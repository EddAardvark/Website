import struct

# GIF Components

from GIFDataSubBlock import *


"""
GIF-File Formats

struct GIFHEADER
{
    BYTE    sig [3]     signature
    BYTE    ver [3]     version (87a or 89a)
    WORD    width       in pixels
    WORD    height      in pixels
    BYTE    ct_flags    Colour table flags
    BYTE    back_index  Background colour index
    BYTE    pix_aspect  Pixel Aspect Ratio
} ;

"""

#=======================================================================
FILTER=''.join([(len(repr(chr(x)))==3) and chr(x) or '.' for x in range(256)])

def dump(title, src, length=8):
    "Prints a string in hex"

    print title        
    N=0; result=''
    while src:
       s,src = src[:length],src[length:]
       hexa = ' '.join(["%02X"%ord(x) for x in s])
       s = s.translate(FILTER)
       str = "%04X   %-*s   %s" % (N, length*3, hexa, s)
       print str
       N+=length
    return result

#==================================================================

def decodeColourTableByte (byte):
    """
    Translates the colour table byte into it's separate values
    (r1, r2, r3, r4)
    
    r1 = Size of Global Color Table    3 Bits (2^(n+1) 3 byte colours)
    r2 = Sort Flag                     1 Bit
    r3 = Color Resolution              3 Bits
    r4 = Global Color Table Flag       1 Bit
    """

    r1 = byte % 8   # Size of colour table
    byte /= 8
    r2 = byte % 2   # Sort flag
    byte /= 2
    r3 = byte % 8   # Colour resolution
    byte /= 8
    r4 = byte % 2   # Colour table present
    
    return (r1, r2, r3, r4)

#==================================================================
def decodeImageFlags (byte):
    """
    Translates the Image descriptor flags byte into it's separate values
    (r1, r2, r3, r4)
    
    r1 = Size of Local Color Table     3 Bits (2^(n+1) 3 byte colours)
    reserved                           2 Bits - not returned
    r2 = Sort Flag                     1 Bit
    r3 = Interlaced                    1 Bit
    r4 = Local Color Table Flag        1 Bit
    """

    r1 = byte % 8   # Size of colour table
    byte /= 8
    byte /= 4       # reserved
    r2 = byte % 2   # Sort flag
    byte /= 2
    r3 = byte % 2   # Interlaced flag
    byte /= 2
    r4 = byte % 2   # Colour table present
    
    return (r1, r2, r3, r4)

#==================================================================
def decodeGCEFlags (byte):
    """
    Translates the Graphics control extension flags
    (r1, r2, r3)
    
    r1 = Use transparancy               1 bit
    r2 = User input flag                1 Bit
    r3 = Disposal method                3 bits
    """

    r1 = byte % 2   # Transparent
    byte /= 2
    r2 = byte % 2   # User input
    byte /= 2
    r3 = byte % 8   # Disposal

    return (r1, r2, r3)

# The GIF class        
#==================================================================

# static data

testfile = 'c:\\Python22\\work\\test.gif'
test2    = 'c:\\Python22\\work\\test2.gif'
seqfile  = 'c:\\Python22\\work\\example1\\sequence2.gif'

# For parsing structures. The '=' prefix stops the parser
# trying to align long values on 4 byte boundaries.

HDR_FORMAT = '=3s3sHHBBB'
HDR_SIZE   = 13

CGE_FORMAT = '=BBHBB'
GCE_SIZE   = 6

IMG_FORMAT = '=HHHHB'
IMG_SIZE   = 9

AE_FORMAT  = '=B8s3s'
AE_SIZE    = 12

#indexes

hdr_Sig             = 0
hdr_Version         = 1
hdr_Width           = 2
hdr_Height          = 3
hdr_ClrTabBits      = 4
hdr_BackIndex       = 5
hdr_PixAspect       = 6

pow = [2, 4, 8, 16, 32, 64, 128, 256] # 2^(i+1)

# Some GIF constants

EXTENSION       = 0x21
IMAGE_SEPARATOR = 0x2c
END_OF_FILE     = 0x3b

GRAPHIC_CONTROL_EXTENSION = 0xf9
COMMENT_EXTENSION         = 0xfe
PLAIN_TEXT_EXTENSION      = 0x01
APPLICATION_EXTENSION     = 0xff

#==============================================================
# GIF Header
# Combines the header and the logical screen descriptor as
# they always appear to follow each other
#==============================================================

class GIFHeader:
    
    Sig             = 'GIF'
    Version         = '89a'
    Width           = 40
    Height          = 30
    Flags           = 0
    BackIndex       = 0
    PixAspect       = 0

    def readFromFile (self, file):
        """
        Read the header and logical screen descriptor from the
        specified file
        """

#==============================================================
# GIF File decoding class
#==============================================================

class GIFFile:
    
# Header (size = HDR_SIZE)

    hdr_vals = ('', '', 0, 0, 0, 0, 0)
    
# The file

    the_file = None

# The colour map

    colours = []

#================================================================================
    def readFile (self, filename):
        "Read in a bitmap file"

        self.the_file = open (filename, "rb")

        hdr = self.the_file.read (HDR_SIZE)

        self.hdr_vals = struct.unpack (HDR_FORMAT, hdr)
        
        if self.hdr_vals [hdr_Sig] != 'GIF':
            print "****** Not a GIF File ******"
            return

        print "Gif Version = ", self.hdr_vals [hdr_Version]
        print "Size = %d x %d" % (self.hdr_vals [hdr_Width], self.hdr_vals [hdr_Height])

        r = decodeColourTableByte (self.hdr_vals [hdr_ClrTabBits])
        
        print "Colour table present = ", r [3]
        print "Pixel Aspect = ", self.hdr_vals [hdr_PixAspect]

        if r[3]:
            print "Size of colour table = ", pow [r [0]]
            print "Sort colour table = ", r [1]
            print "Color Resolution = %d bits" % (r [2])
            self.colours = self.readColourTable (pow [r [0]])
            print "Background: Colour [", self.hdr_vals [hdr_BackIndex], "] = ", self.colours [self.hdr_vals [hdr_BackIndex]]
        else:
            self.colours = None

    # Read the data blocks

        while 1:
            
            sep = ord (self.the_file.read (1)[0])

            if sep == END_OF_FILE:
                break

            elif sep == IMAGE_SEPARATOR:
                self.readImage ()
            
            elif sep == EXTENSION:
                self.readExtension ()

            else:
                print "Sep = " + hex (sep)

    # Close the file
    
        self.the_file.close ()

#================================================================================
    def readColourTable (self, num):
        """
        Read the colour table. Each colour is three bytes
        (r,g,b)
        """

        ret = []

        for i in range (0,num):
            s = self.the_file.read (3)
            c = struct.unpack ('BBB', s)
            ret.append (c)

        return ret ;

                
#================================================================================
    def readExtension (self):
        """
        Read an Extension Block!
        byte 1  0x21 - already read
        byte 2  Application Extension Label
        """

        type = ord (self.the_file.read (1)[0])

        if type == GRAPHIC_CONTROL_EXTENSION:
            self.readGraphicControlExtension ()

        elif type == COMMENT_EXTENSION:
            self.readCommentExtension ()

        elif type == PLAIN_TEXT_EXTENSION:
            print "Plain Text Extension"

        elif type == APPLICATION_EXTENSION:
            self.readApplicationExtension ()
        
#================================================================================
    def readGraphicControlExtension (self):
        """
        Read a graphic control extension

            BYTE    size
            BYTE    disposal
            WORD    delay
            BYTE    transparent colour
            BYTE    terminator
        """
        
        s = self.the_file.read (GCE_SIZE)
        gce = struct.unpack (CGE_FORMAT, s)

        flags = decodeGCEFlags (gce [1])

        print "Graphic control Extension"
        print "     Delay = ", gce [2]
        print "     Disposal = ", flags [2] 
        print "     User Input = ", flags [1]
        print "     Use transparancy = ", flags [0]

        if flags [0]:
            print "     Transparancy = ", gce [3], self.colours [gce [3]]
        
#================================================================================
    def readApplicationExtension (self):
        """
        Read a graphic control extension

            BYTE    size
            BYTE    name [7]
            BYTE    code [3]
        """
        
        s = self.the_file.read (AE_SIZE)
        ae = struct.unpack (AE_FORMAT, s)

        print "Application Extension"
        print "     App = ", ae [1]
        print "     Code = ", ae [2]

        while 1:
            sb = self.readDataSubBlock ()
            if sb.length == 0:
                break

            print "     Sub-block, length = ", sb.length

#================================================================================
    def readCommentExtension (self):
        """
        No specific content, only sub-blocks
        """

        print "Comment Extension"

        while 1:
            sb = self.readDataSubBlock ()
            if sb.length == 0:
                break

            print "     Sub-block, length = ", sb.length

#================================================================================
    def readImage (self):
        """
            WORD    left        in pixels
            WORD    top         in pixels
            WORD    width       in pixels
            WORD    height      in pixels
            BYTE    flags       flags
        """
        s = self.the_file.read (IMG_SIZE)
        img = struct.unpack (IMG_FORMAT, s)
        print "Image: Position = (%d, %d), Size = %d x %d" % (img [0], img [1], img [2], img [3])
        flags = decodeImageFlags (img [4])
        print "     Sort = ", flags [1]
        print "     Interlaced = ", flags [2]
        print "     Local colour table = ", flags [3]

        if flags [3]:
            print "     Colour table size  = ", pow [flags [0]]
            lcolours = self.readColourTable (pow [flags [0]])

        code_bits = ord (self.the_file.read (1)[0])

        print "     Image code bits = ", code_bits

        while 1:
            sb = self.readDataSubBlock ()
            if sb.length == 0:
                break

            print "     Sub-block, length = ", sb.length
        
#================================================================================
    def readDataSubBlock (self):
        "Read a data sub-block, a length and a string"

        ret = GIFDataSubBlock ()

        ret.readFromFile (self.the_file)

        return ret        


