#==============================================================
# (c) John Whitehouse 2002-2003
# htpp://www.eddaardvark.co.uk/
#==============================================================

import struct
import time
from MakeFileList import MakeFileList

"""
Bitmap-File Formats

Windows bitmap files are stored in a device-independent bitmap (DIB) format
that allows Windows to display the bitmap on any type of display device. The
term "device independent" means that the bitmap specifies pixel color in a
form independent of the method used by a display to represent color. The
default filename extension of a Windows DIB file is .BMP.

Bitmap-File Structures

Each bitmap file contains a bitmap-file header, a bitmap-information header,
a color table, and an array of bytes that defines the bitmap bits. The file
has the following form:

BITMAPFILEHEADER bmfh;
BITMAPINFOHEADER bmih;
RGBQUAD          aColors[];
BYTE             aBitmapBits[];

The bitmap-file header contains information about the type, size, and layout
of a device-independent bitmap file. The header is defined as a
BITMAPFILEHEADER structure.

struct BITMAPFILEHEADER
{
  WORD    bfType;
  DWORD   bfSize;
  WORD    bfReserved1;
  WORD    bfReserved2;
  DWORD   bfOffBits;
} ;


struct BITMAPINFOHEADER
{
  DWORD  biSize;
  LONG   biWidth;
  LONG   biHeight;
  WORD   biPlanes;
  WORD   biBitCount;
  DWORD  biCompression;
  DWORD  biSizeImage;
  LONG   biXPelsPerMeter;
  LONG   biYPelsPerMeter;
  DWORD  biClrUsed;
  DWORD  biClrImportant;
} ;

"""

#==================================================================
# The bitmap class        
#==================================================================
# static data

bytes_per_pixel = {4:0.5, 8:1, 16:2, 24:3, 32:4}

C1 = 256
C2 = 256 * 256
C3 = 256 * 256 * 256
BM = 19778

RGB_BLACK = chr(0)+chr(0)+chr(0)
RGB_WHITE = chr(255)+chr(255)+chr(255)
RGB_RED   = chr(0)+chr(0)+chr(255)

BLACK_FOUR = chr(0)+chr(0)+chr(0)+chr(0)
WHITE_FOUR = chr(255)+chr(255)+chr(255)+chr(0)

# For parsing structures. The '=' prefix stops the parser
# trying to align long values on 4 byte boundaries, which
# breaks the bitmap file header structure.

BFH_FORMAT = '=HLHHL'
BIH_FORMAT = '=LllHHLLllLL'
BFH_SIZE   = 14
BIH_SIZE   = 40

#indexes

# BitmapFileHeader (size = 14)

bfh_Type            = 0
bfh_Size            = 1
bfh_Reserved1       = 2
bfh_Reserved2       = 3
bfh_OffsetBits      = 4

# BitmapInfoHeader (40 bytes)

bih_Size            = 0
bih_Width           = 1
bih_Height          = 2
bih_Planes          = 3
bih_BitCount        = 4
bih_Compression     = 5
bih_SizeImage       = 6
bih_XPelsPerMeter   = 7
bih_YPelsPerMeter   = 8
bih_ColorsUsed      = 9
bih_ColorsImportant = 10

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def example (which):
    """
    For testing creation and writing of 24 bit bitmaps

    1 => Draw some boxes (increments in 2 pixels)
    2 => Draw more boxes (increments in 1 pixel)
    3 => Draw some rectangles
    """

    b = WindowsBMP ()
    b.create24Bit (300, 300)

    if which == 1:
        
        for i in range (5, 127, 2):
            colour = chr(2*i)+chr(0)+chr(255-2*i)
            b.drawBox (150-i, 150-i, 2*i, 2*i, colour)

        b.writeFile (b.path+'bmboxes1.bmp')

    elif which == 2:
        
        for i in range (2, 127, 1):
            colour = chr(0)+chr(128-i)+chr(255-2*i)
            b.drawBox (150-i, 150-i, 2*i, 2*i, colour)

        b.writeFile (b.path+'bmboxes2.bmp')

    elif which == 3:

        for i in range (0, 8):
            colour = chr(255*(i%2))+chr(255*((i/2)%2))+chr(128*((i/4)%2))
            b.drawRect (10*i, 20*i, 10+25*i, 10+10*i, colour)

        b.writeFile (b.path+'bmbrects.bmp')

#============================================================
# A class for representing windows bitmaps.
# Currently only supports 24 bits fully
#============================================================
class WindowsBMP:

    def __init__ (self):
        """
            Initialise
            BitmapFileHeader (size = 14)
            BitmapInfoHeader (40 bytes)
        """

        self.path      = 'c:\\python22\\work\\'
        self.bfh_vals  = (BM, 0, 0, 0, 0)
        self.bih_vals  = (BIH_SIZE, 0, 0, 1, 32, 0, 0, 0, 0, 0, 0)
        self.the_file  = None
        self.image     = []
        self.colourmap = []

#================================================================================
    def readFile (self, filename):
        "Read in a bitmap file"

        self.the_file = open (filename, "rb")

        bfh = self.the_file.read (BFH_SIZE)
        self.bfh_vals = struct.unpack (BFH_FORMAT, bfh)
        print self.bfh_vals

        if not self.bfh_vals [bfh_Type] == BM:
            print "***** Not a bitmap *****"
            return

        bih = self.the_file.read (BIH_SIZE)
        self.bih_vals = struct.unpack (BIH_FORMAT, bih)
        print self.bih_vals

        print "Bitmap: %d x %d: %d bits" % (self.bih_vals [bih_Width], self.bih_vals [bih_Height], self.bih_vals [bih_BitCount])
        print "Size: ", self.bih_vals [bih_SizeImage], " bytes"
        print "Compression: ", self.bih_vals [bih_Compression]
        print "Colour map: ", self.bih_vals [bih_ColorsUsed], self.bih_vals [bih_ColorsImportant]

    # See how big the bitmap should be and compare with the size in the header

        self.testSize ()    

    # Read any colour map

        self.readColourMap ()    
    
    # Read the image data

        self.readImage ()    

        self.the_file.close ()            
        
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def testSize (self):
        """
        See if the number of bytes indicated by the header matches
        the number we calculate
        """
        
        perpixel = bytes_per_pixel [self.bih_vals [bih_BitCount]]
        width    = self.bih_vals [bih_Width]
        height   = self.bih_vals [bih_Height]
        expected = self.bih_vals [bih_SizeImage]

    # Rows always have multiples of 4 bytes
        
        padding = 3 - ((perpixel * width + 3) % 4)
        size = (width * perpixel + padding) * height

        if not size == expected:
            print "Calculated size = %d (<> %d)" % (size, expected)
            print "***** File size error *****"

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def writeFile (self, filename):
        "Write out a bitmap file"

        self.the_file = open (filename, "wb")

    # The file header

        bfh = struct.pack (BFH_FORMAT,
                           self.bfh_vals [0],
                           self.bfh_vals [1],
                           self.bfh_vals [2],
                           self.bfh_vals [3],
                           self.bfh_vals [4])
        
        self.the_file.write (bfh)

    # The info header
    
        bih = struct.pack (BIH_FORMAT,
                           self.bih_vals [0],
                           self.bih_vals [1],
                           self.bih_vals [2],
                           self.bih_vals [3],
                           self.bih_vals [4],
                           self.bih_vals [5],
                           self.bih_vals [6],
                           self.bih_vals [7],
                           self.bih_vals [8],
                           self.bih_vals [9],
                           self.bih_vals [10])

        self.the_file.write (bih)

    # Write the Colour map

        self.writeColourMap ()

    # Write the image data

        self.writeImage ()    
        self.the_file.close ()            
        
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def create24Bit (self, width, height, bcol=RGB_WHITE):
        "Create a 24 bit bitmap"

        padding = 3 - ((3 * width + 3) % 4)
        size = (width * 3 + padding) * height

    # BitmapFileHeader

        self.bfh_vals = (BM,
                         BFH_SIZE + BIH_SIZE + size,
                         0, 0,
                         BFH_SIZE + BIH_SIZE)

    # BitmapInfoHeader

        self.bih_vals = (BIH_SIZE,
                         width, height,     # size in pixels
                         1, 24,             # planes and colours
                         0,                 # compression
                         size,              # image size in bytes
                         0, 0,              # pels/meter
                         0, 0)              # colour table

    # Colour map

        self.colourmap = []
        
    # Image data - a 2d array implemented as a list of lists
    
        self.image = []
        for y in range (0,height):
            self.image.append ([bcol] * width)
        
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def create8Bit (self, width, height):
        "Create an 8 bit bitmap"

        padding = 3 - ((width + 3) % 4)
        size = (width + padding) * height

    # BitmapFileHeader

        self.bfh_vals = (BM,
                         BFH_SIZE + BIH_SIZE + 1024 + size,
                         0, 0,
                         BFH_SIZE + BIH_SIZE + 1024)

    # BitmapInfoHeader

        self.bih_vals = (BIH_SIZE,
                         width, height,    # size in pixels
                         1, 8,             # planes and colours
                         0,                # compression
                         size,             # image size in bytes
                         0, 0,             # pels/meter
                         256, 256)         # colour table

    # Colour map

        self.colourmap = [WHITE_FOUR] * 256
        
    # Image data - a 2d array implemented as a list of lists
    
        self.image = []
        for y in range (0,height):
            self.image.append ([chr(0)] * width)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def readImage (self):
        "Read the image data"

        width    = self.bih_vals [bih_Width]
        height   = self.bih_vals [bih_Height]
        perpixel = bytes_per_pixel [self.bih_vals [bih_BitCount]]
        padding  = 3 - ((perpixel * width + 3) % 4)

        print "Reading %d x %d x %d" % (width, height, perpixel)

    # Create the image array
    
        self.image = []
        
        for y in range (0,height):
            self.image.append ([RGB_WHITE] * width)

    # Read the file
        
        for row in self.image:
            for j in range (0, width):
                row [j] = self.the_file.read (perpixel)

            if padding > 0:
                self.the_file.read (padding)
        
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def writeImage (self):
        "Write the image data"

        width    = self.bih_vals [bih_Width]
        height   = self.bih_vals [bih_Height]
        perpixel = bytes_per_pixel [self.bih_vals [bih_BitCount]]
        pixels   = width * height

        print "Writing %d x %d x %d" % (width, height, perpixel)

    # Data is stored as strings of the appropriate length for the number
    # of bytes per pixel
    # Rows always have a multiple of 4 bytes
                
        padding = 3 - ((perpixel * width + 3) % 4)
        pstr = chr(0) * padding
    
        for row in self.image:
            for j in range (0, width):
                self.the_file.write (row [j])

            self.the_file.write (pstr)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def readColourMap (self):
        """
        Read the colour map
        """
        
        num = self.bih_vals [bih_ColorsUsed]

        if num > 0:
            self.colourmap = [BLACK_FOUR] * num
            
            for i in range (0, num):
                self.colourmap [i] = self.the_file.read (4)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def writeColourMap (self):
        """
        Write the colour map
        """

        num = self.bih_vals [bih_ColorsUsed]

        for i in range (0, num):
            self.the_file.write (self.colourmap [i])

#=======================================================================
    def getPixel (self, x, y):
        """
        Return the colour of the pixel at (x,y)
        Uses a right handed co-ordinate system, so (0,0) it the bottom left.
        """
        return self.image [y][x]
                
#=======================================================================
    def setPixel (self, x, y, colour):
        """
        Set the colour of the pixel at (x,y)
        Uses a right handed co-ordinate system, so (0,0) it the bottom left.
        """
        self.image [y][x] = colour

#=======================================================================
    def drawRect (self, x, y, w, h, colour):
        """
        Set the colour of the rectangle starting at (x,y)
        Uses a right handed co-ordinate system, so (0,0) it the bottom left.
        """
        for i in range (y,y+h):
            row = self.image [i]

            for j in range (x,x+w):
                row [j] = colour

#=======================================================================
    def drawBox (self, left, top, width, height, colour):
        """
        Draws the boundary of a box.
        """
        w = self.bih_vals [bih_Width]
        h = self.bih_vals [bih_Height]

        cols = [left, left + width - 1]
        rows = [top, top + height - 1]
        
        x0 = max ((0,left))
        x1 = min ((cols[1]+1, w))
        y0 = max ((0,top))
        y1 = min ((rows [1]+1, h))

    # rows

        for r in rows:
            if r >= 0 and r < h:
                row = self.image [r]
                for x in range (x0, x1):
                    row [x] = colour

    # columns
    
        for y in range (y0, y1):
            row = self.image [y]
            for c in cols:
                if c >= 0 and c < w :
                    row [c] = colour
                
#=======================================================================
    def drawPointSet (self, points, colour):
        """
        Set the colour of all the pixels defined by points
        Uses a right handed co-ordinate system, so (0,0) it the bottom left.
        Doesn't do any clipping, use drawClippedPointSet
        """

        w = self.bih_vals [bih_Width]

        for pt in points:
            self.image [pt [1]][pt [0]] = colour

#=======================================================================
    def drawClippedPointSet (self, points, colour):
        """
        Set the colour of all the pixels defined by points
        Uses a right handed co-ordinate system, so (0,0) it the bottom left.
        Points are tested to see if they are indide the rectange so this
        method will be slower than drawPointSet
        """

        w = self.bih_vals [bih_Width]
        h = self.bih_vals [bih_Height]
        
        for pt in points:
            if pt [0] >= 0 and pt [0] < w and pt [1] >= 0 and pt [1] < h:
                self.image [pt [1]][pt [0]] = colour

#=======================================================================
    def invertImage (self):
        "Replace all the pixels with their inverse colour"

        width    = self.bih_vals [bih_Width]
        height   = self.bih_vals [bih_Height]
        perpixel = bytes_per_pixel [self.bih_vals [bih_BitCount]]
        pixels   = width * height
        colours  = len (self.colourmap)

        print "Inverting %d x %d x %d" % (width, height, perpixel)

    # If there is a colour map then invert it

        if colours > 0:
            
            for i in range (0, colours):

                s = ''
                colour = self.colourmap [i]
                
                for char in colour:
                    s += chr (255 - ord (char))

                self.colourmap [i] = s

    # Otherwise invert the colours
            
        else:
            for row in self.image:
                for i in range (0,len(row)):
                    s = ''
                    for char in row [i]:
                        s += chr (255 - ord (char))

                    row [i] = s                


#=======================================================================
    def flipHorizontal (self):
        """
        Invert the image in the vertical axis: left <-> right
        """

        for row in self.image:
            row.reverse ()

#=======================================================================
    def flipVertical (self):
        "Invert the image in the horizontal axis: top <-> bottom"
        print "starting flip"
        width  = self.bih_vals [bih_Width]
        height = self.bih_vals [bih_Height]
        pixels = width * height
        h2 = (height + 1) / 2

        for y in range (0, h2):
            temp = self.image [y]
            self.image [y] = self.image [height - y - 1]
            self.image [height - y - 1] = temp
