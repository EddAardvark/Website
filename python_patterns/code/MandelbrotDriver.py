#==============================================================
# (c) John Whitehouse 2002-2003
# htpp://www.eddaardvark.co.uk/
#
# Command line interface module to drive the mandelbror drawer
#==============================================================

import string
import sys
import os

# Our files might have changed so do a reload

try:
    reload(Mandelbrot)
except:
    import Mandelbrot

# For histogram colouring

values=[]
size = (0,0)

# Default settings

class Settings:
    """
        Collect all the settings into an object
    """

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def __init__(self):
        """
            initialise the key handler map and set the default values
        """

        self.keyhandlers = {
            'b':self.setStarFactor,
            'c':self.setCValue,
            'd':self.setColourScheme,
            'f':self.setFileName,
            'h':self.showHelp,
            'i':self.setIterations,
            'l':self.logProgress,
            'm':self.setMagnification,
            'n':self.setNoDraw,
            'p':self.setPath,
            's':self.setSize,
            't':self.setType,
            'w':self.setWhereIs,
        }

    # default values

        self.type = 'M'              # Mandelbrot
        self.sub_type = ' '          # Standard colouring scheme
        self.filename = "mandelbrot" # The file name to save the pattern as
        self.path = "c:\\"           # The path to save data files
        self.c_value = (0,0,0,0)     # The drawing center (zx, zy, cx, cy)
        self.magnify = 1             # Magnification (>1 to zoom in)
        self.iterations = 600        # The number of iterations
        self.size = (240, 180)       # The size in pixels of the image to draw
        self.draw_it = 1             # Draw the pattern
        self.show_help = 0           # Should we show the help
        self.where_is = None         # 'Where is' point
        self.palette = None          # 1st colour scheme
        self.starfactor = 0.001      # Star factor in star colouring scheme
        self.log_progress = 0        # How often to log progress (0 = never)
        
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def doHelp(self):
        "Show the help"
        
        print "Parameters..."
        print "  -b<number>        - Blob factor, controls the star size with star colouring"
        print "  -c(zx,zy, cx, cy) - The centre of the image"
        print "  -d<number>        - Drawing colour palette to use"
        print "  -f<name>          - Output file name, without path or extension"
        print "  -h                - Shows this help"
        print "  -i<number>        - Set the maximum number of iterations"
        print "  -l                - How often to log progress (0 = never)"
        print "  -m<number>        - Magnification - 1 = whole picture, >1 zooms in"
        print "  -n                - NoDraw, just prints the parameters"
        print "  -p<path>          - Sets the path"
        print "  -s<w>x<h>         - Sets the size of the pattern to draw"
        print "  -t<type><scheme>  - The type colouring scheme of the pattern. Types:"
        print "             M - Mandelbrot set"
        print "             J - Julia Set"
        print "             A - Fixes Z0x and cx, varies z0y and cy"
        print "             B - Fixes Z0x and cy, varies z0y and cx"
        print "             C - Fixes Z0y and cx, varies z0x and cy"
        print "             D - Fixes Z0y and cy, varies z0x and cx"
        print "        - Schemes:"
        print "             none/space - Standard colouring scheme"
        print "             S - with star colouring"
        print "             B - with banded colouring"
        print "             R - With the real axis subset of bands"
        print "             I - With the imaginary axis subset of bands"
        print "             Q - Coloured according to the arc-tangent of the last coordinate"
        print "             V - calculates the values and then colours in later"
        print "  -w(x,y)           - Returns the position of the pixel at (x,y). No Drawing"
        print "  -z(x,y)           - The fixed part of the drawing"

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def showHelp (self, dummystr):
        """
        Show some help
        """

        self.show_help = 1
        self.draw_it = 0

        return 1
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def setNoDraw (self, dummystr):
        """
        Turn of the actual drawing - used to test parameter parsing
        """

        self.draw_it = 0

        return 1
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def logProgress (self, logstr):
        """
        Turn on progress logging
        """

        try:
            self.log_progress = int (logstr)

        except ValueError:
            self.log_progress = 0

        return 1
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def go(self):
        """
        Apply the parameters and draw the picture (or show the help)
        """
        
# If help requested then go no further

        if self.show_help:
            self.doHelp ()

        else:
            self.applyParameters()
            if self.draw_it:
                return self.draw()
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def applyParameters(self):
        """
        Make any required adjustments to the parameters
        """

    # Fix up unset parameters - 'c' value (both)

        if self.c_value == None:
            self.c_value = (-0.75,0)

    # Choose the default colour scheme if it hasn't been set

        palette_map = {
        ' ':1,              # Standard
        'S':3,              # Stars
        'B':4,              # Bands
        'R':4,              # Real Bands
        'I':4,              # Imaginary Bands
        'V':1,              # Values
        'Q':6               # Quadrants
        }

        scheme_map = {
        ' ':'Standard',
        'S':'Stars',
        'B':'Bands',
        'R':'Real Bands',
        'I':'Imaginary Bands',
        'V':'Values',
        'Q':'Quadrants'
        }


        if self.palette  == None:
            self.palette = palette_map [self.sub_type]

    # Print out what we've chosen

        print "  Pattern type:   ", self.type, ", scheme = ", scheme_map [self.sub_type]
        print "  Size:           ", self.size [0], "x", self.size [1]
        print "  File name:      ", self.path + self.filename + '.bmp'
        print "  Pattern Origin: (%.7f,%.7f,%.7f,%.7f)" % self.c_value
        if self.where_is:
            print "  Where is:       (%.7f,%.7f)" % self.where_is
        print "  Magnification:  ", self.magnify
        print "  Iterations:     ", self.iterations
        print "  Colour Scheme:  ", self.palette
        print "  Star Factor:    ", self.starfactor
        print "  Logging:        ", self.log_progress
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def draw(self):
        """
        Draw a pattern based on the settings
        """

        values = None

        # Initialise the pattern

        m = Mandelbrot.Mandelbrot()

        m.position = self.c_value

    # Draw the appropriate pattern type        

        m.palette      = self.palette - 1
        m.starfactor   = self.starfactor
        m.scale        = 4.0/(self.magnify * self.size[0])
        m.log_progress = self.log_progress
        
        m.setSize       (self.size)
        m.setIterations (self.iterations)

        if self.where_is == None:
            m.drawPattern (self.type, self.sub_type)

        # Write out the bitmap

            if self.sub_type == 'Values':
                pass
            else:
                file = self.path + self.filename + '.bmp'
                m.bitmap.writeFile(file)

    # Print the whereis value (screen co-ords are upside down)
    
        else:
            x = self.where_is [0]
            y = self.size [1] - self.where_is [1]

            where = m.whereIs (x, y, self.type)
            
            print "(%d, %d) is at (%12.10f, %12.10f, %12.10f, %12.10f)" % (self.where_is [0], self.where_is [1], where [0], where [1], where [2], where [3])

        return values
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def process (self, arg):
        """
        Process a command string. All command strings have the format
        "-<letter><string>" or "/<letter><string>"
        <string. can't contain spaces.
        """
        if len(arg)>1 and (arg[0]== '-' or arg[0]=='/'):
            try:
                return self.keyhandlers[arg[1]](arg[2:])
            except KeyError:
                print "  Unknown parameter:", arg

        return 0                
                
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def setType (self, typestr):
        """
        -t<type><scheme>"
            - The type colouring scheme of the pattern. Types:"
                M - Mandelbrot set"
                J - Julia Set"
                A - Fixes Z0x and cx, varies z0y and cy"
                B - Fixes Z0x and cy, varies z0y and cx"
                C - Fixes Z0y and cx, varies z0x and cy"
                D - Fixes Z0y and cy, varies z0x and cx"
            - Schemes:"
                none/space - Standard colouring scheme"
                S - with star colouring"
                B - with banded colouring"
                R - With the real axis subset of bands"
                I - With the imaginary axis subset of bands"
                Q - Coloured according to the arc-tangent of the last coordinate"
                V - calculates the values and then colours in later"
        """

        valid_types   = 'MJABCD'
        valid_schemes = ' SBRIQV'

        self.type     = 'M'     # Mandelbrot
        self.sub_type = ' '     # Standard

        if len (typestr) > 0:
            self.type = typestr [0]

        if len (typestr) > 1:
            self.sub_type = typestr [1]
            
        if not self.type in valid_types or not self.sub_type in valid_schemes:
            print "  '%s' is not a valid pattern type" % (typestr)
            return 0
            
        return 1

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def setFileName (self, fnstr):
        """
        Set the file name. Strip off any extension. We'll add
        a '.bmp' later.
        """

        if len (fnstr) > 0:
            self.filename = fnstr
            dotpos = string.rfind (self.filename, '.')
            if dotpos >= 0:
                self.filename = self.filename [:dotpos]
            
        return 1

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def setPath (self, pathstr):
        """
        Set the output path
        """

        if len (pathstr) > 0:
            if pathstr [-1] != '\\':
                pathstr += '\\'
                
            self.path = os.path.abspath(pathstr) + '\\'
            return 1

        print "  Empty path parameter"
        return 0

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def setIterations(self, ptstr):
        """
        Sets the number of iterations
        """

        try:
            self.iterations = int (ptstr)
            return 1
        except ValueError:
            pass

        return 0

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def setMagnification (self, magstr):
        """
        Set the magnification (1 will draw the whole image, larger
        values zoom in)
        """

        try:
            self.magnify = float (magstr)
            return 1
        except ValueError:
            print "magnification '%s' must be a number" % (magstr)

        return 0

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def setStarFactor (self, sfstr):
        """
        Set the star factor - for star patterns
        """

        try:
            self.starfactor = float (sfstr)
            return 1
        except ValueError:
            print "'Star Factor' must be a number" % (sfstr)

        return 0

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def setWhereIs (self, posstr):
        """
        Set the 'where is' point. If this is set then rather than draw a
        picture the driver returns the location of the selected pixel
        in 'z' or 'c' space.
        """

        pos = self.decodeCoord (posstr, 2)

        if pos != None:
            self.where_is = pos
            return 1
        
        return 0

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def setCValue (self, posstr):
        """
        Set the c value.
        Expects a string in the format "(zx, zy, cx, cy)"
        """

        pos = self.decodeCoord (posstr, 4)

        if pos != None:
            self.c_value = pos
            return 1
        
        return 0

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def setSize (self, sizestr):
        """        Parse a string of the format "<w>x<h>" into a size
        """

        str = string.strip (sizestr)
        bits = string.split (str, 'x')

        if len(bits) == 2:
            self.size = (int (bits [0]), int (bits [1]))
            return 1

        return 0

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def setColourScheme (self, csstr):
        """        Parse anumber to a colour scheme
        """

        try:
            self.palette = int (csstr)
            return 1
        except ValueError:
            pass

        return 0


#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def decodeCoord (self, posstr, num):
        """        Parse a string of the format "(x,y)" or "(zx, zy, cx, cy)" and return
        the tuple (x,y) or (zx, zy, cx, cy)
        """

        str = string.strip (posstr)     # remove whitespace
        str = str [1:-1]                # remove '(' and ')'
        bits = string.split (str, ',')

        if len(bits) == num:
            try:
                if num == 2:
                    return (float (bits [0]), float (bits [1]))

                if num == 4:
                    return (float (bits [0]), float (bits [1]), float(bits [2]), float (bits [3]))
            except:
                pass

        print 'Invald position "%s"' % posstr
        return None

#==============================================================================
# A module level function that allows us to call the example function from
# the command line
#==============================================================================

def go (args):
    global values
    global size
    ok = 1
    settings = Settings()
    strtype = type ('xxx')
    listtype = type (range (2))

# Output file path
    
    path = os.path.dirname(sys.argv[0])
    settings.path = os.path.abspath(path) + '\\'
    
    print "Mandelbrot Driver..."

    if type(args) != listtype:
        if type(args) == strtype:
            args = string.split (args, ' ')
        else:
            args = ['-h']

# Process the arguments

    for arg in args:
        if ok:
            ok = settings.process (arg)
            if not ok:
                print "Unknown parameter: '%s'" % (arg)

# Draw the picture (or something)

    if ok:
        values = settings.go()
        size   = settings.size
#======================================================================
def histogram():
    """
    Returns the histogram of the values in the 'values' array
    """
    hist={}
    for v in values:
        try:
            hist [v] += 1
        except KeyError:
            hist [v] = 1            

    return hist
#======================================================================
# Call the entry point
#======================================================================

if len (sys.argv) > 1:
    go (sys.argv[1:]) # skip the program name
else:
    print "Mandelbrot Driver Loaded"

