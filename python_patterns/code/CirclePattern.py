#==============================================================
# (c) John Whitehouse 2002-2003
# htpp://www.eddaardvark.co.uk/
#==============================================================

import WindowsBMP
import ColourMap

from MakeFileList import MakeFileList 

#================================================================        
def example(which):
    """
        Some example patterns. The first 4 use the circle algorithm
        z = x^2 + y^2.

        (1) 400x300 - z_factor = 1e-3, two colours blue and cyan
        (2) Same values as (1) but with a 16 colour range
        (3) The inner 200x150 from pattern (1) in red and yellow
        (4) Another 200x150 pattern, this time with 4 colours
        (5) An example using the anticircle algorithm (x^2 - y^2)
        (6) An example using the xyfun algorithm. This introduces a
            cross term k.x.y into the circle equation.
        
        (1000) A series of 100 images, suitable for converting into
               an animation, starting at 1000 to 1099. These are
               based on the single example (4)
    """

    pat = CirclePattern()
    pat.fun = pat.circle
    pat.filename = 'example'
    
    if which == 1:
        pat.setSize (400, 300)
        pat.z_factor = 1e-2
        pat.colour_map = ColourMap.createLinear (ColourMap.blue,ColourMap.cyan,2)

    elif which == 2:        
        pat.setSize (400, 300)
        pat.z_factor = 1e-2
        pat.colour_map = ColourMap.createLinear (ColourMap.blue,ColourMap.cyan,16)

    elif which == 3:
        pat.setSize (200, 150)
        pat.z_factor = 1e-2
        pat.colour_map = ColourMap.createLinear (ColourMap.red,ColourMap.yellow,2)

    elif which == 4 or which == 1000:
        pat.setSize (200, 150)
        pat.z_factor = 2e-3
        pat.colour_map = ColourMap.createLinear (ColourMap.blue,ColourMap.cyan,2)

    elif which == 5:
        pat.colour_map = ColourMap.createLinear (ColourMap.green, ColourMap.blue, 4)
        pat.fun = pat.anticircle
        pat.z_factor = 1e-2
        pat.draw()
        
    elif which == 6:
        pat.colour_map = ColourMap.createLinear (ColourMap.green, ColourMap.black, 2)
        pat.fun = pat.xyfun
        pat.z_factor = 1e-2
        pat.xy_factor = 1
        pat.draw()

    if which < 1000:
        pat.draw ()
        pat.bitmap.writeFile (pat.path + pat.filename + str (which) + '.bmp')
    else:
        pat.drawSequence (4.04e-2, -4e-4, 100)


    return pat        

#=================================================================
# The Circle Pattern class
#=================================================================

class CirclePattern:

    def __init__ (self):
        self.width      = 400
        self.height     = 300
        self.colour_map = [ColourMap.black, ColourMap.white]
        self.z_factor   = 1e-3
        self.xy_factor  = 0
        self.path       = 'c:\\python22\\work\\'
        self.filename   = 'circle'
        self.blocksize  = 1
        self.fun        = self.circle

#================================================================
    def setSize (self, w, h):
        "Set the pattern size"

        self.width  = w
        self.height = h
        

#================================================================
    def draw(self):
        "draw a circular pattern based on the current values"

        if self.blocksize == 1:
            self.drawPixelPattern ()
        else:
            self.drawBlockPattern ()

#================================================================
    def drawPixelPattern(self):
        "draw a circular pattern based on the current values"

        self.bitmap = WindowsBMP.WindowsBMP ()
        self.bitmap.create24Bit (self.width, self.height)
        colours = len (self.colour_map)

        for i in range (0, self.width):
            x = i - self.width / 2
            
            for j in range (0, self.height):
                y = j - self.height / 2
                z = self.fun (x, y)

                self.bitmap.setPixel (i, j, self.colour_map [z % colours])

#================================================================
    def drawBlockPattern(self):
        """
        draw a circular pattern based on the current values.
        This version draws a square for each cell in the pattern
        """

        self.bitmap = WindowsBMP.WindowsBMP ()
        self.bitmap.create24Bit (self.width * self.blocksize, self.height * self.blocksize)

        for i in range (0, self.width):
            x = i - self.width / 2
            xpos = i * self.blocksize
            
            for j in range (0, self.height):
                y = j - self.height / 2
                z = self.fun (x, y)
                colour = self.colour_map [z % self.colours]
                ypos = j * self.blocksize

                self.bitmap.drawRect (xpos, ypos, self.blocksize, self.blocksize, colour)

#================================================================
    def drawZSequence (self, z0, zinc, start, num):
        """
        Create a sequence of bitmap files generated by
        varying the z factor, starting at z0 and incrementing
        by zinc for each pattern.
        start and num determin the range of file names
        """
        self.z_factor = z0
        
        files = MakeFileList (self.path, self.filename, 'bmp', start, num)
        
        for fname in files:
            self.draw ()
            print "Writing to ", fname
            self.bitmap.writeFile (fname)
            self.z_factor += zinc

#================================================================
    def drawXYSequence (self, xy0, xyinc, start, num):
        """
        Create a sequence of bitmap files generated by
        varying the xy factor, starting at xy0 and incrementing
        by xyinc for each pattern.
        start and num determin the range of file names
        """
        self.xy_factor = xy0
        
        files = MakeFileList (self.path, self.filename, 'bmp', start, num)
        
        for fname in files:
            self.draw ()
            print "Writing to ", fname        
            self.bitmap.writeFile (fname)
            self.xy_factor += xyinc

# The functions

    def circle (self, x, y):
        return (int)(self.z_factor * (x * x + y * y))

    def anticircle (self, x, y):
        return (int)(self.z_factor * (x * x - y * y))

    def xyfun (self, x, y):
        return (int)(self.z_factor * (x * x + self.xy_factor * x * y + y * y))

    def x3y3 (self, x, y):
        return (int)(self.z_factor * (x * x * x + y * y * y))

    def x4y4 (self, x, y):
        return (int)(self.z_factor * (x * x * x * x + y * y * y * y))

    def x3y3_xy (self, x, y):
        try:
            return (int)(self.z_factor * (x * x * x + y * y * y) / (x * y))
        except:
            return 0


    def xpy_xmy  (self, x, y):
        try:
            return (int)(self.z_factor * (x + y) / (x - y))
        except:
            return 0
        
    