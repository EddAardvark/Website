#==============================================================
# (c) John Whitehouse 2002-2003
# htpp://www.eddaardvark.co.uk/
#
# Command line interface module to drive the spirograph drawer
#==============================================================

import Spirograph
import string
import sys
import os
import math

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
            'c':self.setIterations,
            'd':self.getWheelDeltas,
            'f':self.setFileName,
            'h':self.showHelp,
            'i':self.setPoints,
            'n':self.setNoDraw,
            'p':self.setPath,
            'r':self.setRatio,
            's':self.setSize,
            'w':self.getWheelParameters,
            'q':self.setQuiet
        }

    # default values

        self.filename    = "spirograph" # The file name to save the pattern as
        self.path         = "c:\\"      # The path to save data files
        self.draw_it      = True        # Draw the pattern
        self.show_help    = False       # Should we show the help
        self.size         = (320, 320)  # The size in pixels of the image to draw
        self.points       = 600         # Number of points to draw
        self.iterations   = 1           # Number of iterations (where we add the deltas)
        self.ratio        = 1.0         # Size change between iterations
        self.wheel_sizes  = [3,2,2,2,1] # Default wheel size
        self.wheel_rates  = [5,-6]      # Rates (Negative is counter-rotation)
        self.wheel_phases = [0]*12      # Starting angles (degrees)
        self.size_deltas  = [0]*12      # Default wheel size deltas (for multiple drawings)
        self.rate_deltas  = [0]*12      # Rate deltas
        self.phase_deltas = [0]*12      # Starting angle deltas (degrees)
        self.wheels       = 2           # Number of wheels
        self.quiet        = False       # If quiet is true we don't print things
        
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def doHelp(self):
        "Show the help"

        print "Parameters..."
        print "  -c          - Sets the drawing counter (where we add in the deltas)"
        print "  -ds[<list>] - The wheel size deltas (when counter > 1)"
        print "  -dr[<list>] - The wheel rate deltas (when counter > 1)"
        print "  -dp[<list>] - The wheel phase deltas (when counter > 1)"
        print "  -f<name>    - Output file name, without path or extension"
        print "  -h          - Shows this help"
        print "  -q          - Quiet mode"
        print "  -i          - Sets the number of points to draw"
        print "  -n          - NoDraw - just prints the parameters"
        print "  -p<path>    - Sets the path"
        print "  -r<ratio>   - When counter > 1, the size ratio between successive images"
        print "  -s<w>x<h>   - Sets the size of the pattern to draw"
        print "  -ws[<list>] - The wheel sizes - how big they are"
        print "  -wr[<list>] - The wheel rates - how fast they rotate"
        print "  -wp[<list>] - The wheel phases - the starting angles in degrees"
        print ""
        print "<list> is a set of comma separated values"

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def showHelp (self, dummystr):
        """
        Show some help.
        """

        self.show_help = True
        self.draw_it   = False
        return True

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def setQuiet(self, dummystr):
        """
        Set quiet mode.
        """
        self.quiet = True
        return True

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def setNoDraw (self, dummystr):
        """
        Turn of the actual drawing - used to test parameter parsing
        """

        self.draw_it = False
        return True

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
                self.draw()

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def getWheelParameters(self, wstr):
        """
        Get wheel parameters can be size, rate or phase.
        'size' is the diameter of the wheel, 'rate' is how fast it rotates and
        'phase' the starting angle.  In real spirographs rate and size were
        related as the teeth were a fixed size. We don't have that restriction.
        """

        if len (wstr) > 2:
            type = wstr[0]
            wstr = wstr[1:]

            if type == 's' or type == 'r' or type == 'p':
                list = self.decodeList (wstr)
                if list != None:
                    if type == 's':
                        self.wheel_sizes = list
                    elif type == 'r':
                        self.wheel_rates = list
                    else:
                        self.wheel_phases = list

                    return 1

        return 0        

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def getWheelDeltas(self, wstr):
        """
        Get wheel parameter deltas can be size, rate or phase.
        Deltas are only aplied when the number of iterations is greater than
        one.
        """

        if len (wstr) > 2:
            type = wstr[0]
            wstr = wstr[1:]

            if type == 's' or type == 'r' or type == 'p':
                list = self.decodeList (wstr)
                if list != None:
                    if type == 's':
                        self.size_deltas = list
                    elif type == 'r':
                        self.rate_deltas = list
                    else:
                        self.phase_deltas = list

                    return 1

        return 0        

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def applyParameters(self):
        """
        Make any required adjustments to the parameters
        """

    # Check the wheels match up (limit wheels to 12)

        l1 = len (self.wheel_sizes)
        l2 = len (self.wheel_rates)
        l3 = len (self.wheel_phases)

        l = min (12, l1, l2, l3)

        if self.iterations > 1:
            l4 = len (self.size_deltas)
            l5 = len (self.rate_deltas)
            l6 = len (self.phase_deltas)

            l = min (l, l4, l5, l6)

        if l < 2:
            raise "Too few wheels"

        self.wheel_sizes  = self.wheel_sizes  [:l]
        self.wheel_rates  = self.wheel_rates  [:l]
        self.wheel_phases = self.wheel_phases [:l]

        if self.iterations > 1:
            self.size_deltas  = self.size_deltas  [:l]
            self.rate_deltas  = self.rate_deltas  [:l]
            self.phase_deltas = self.phase_deltas [:l]

        self.wheels = l            

    # Print out what we've chosen

        if not self.quiet:
            print "  Size:          ", self.size [0], "x", self.size [1]
            print "  File name:     ", self.path + self.filename + '.bmp'
            print "  Points:        ", self.points
            print "  Wheels:        ", self.wheels
            print "  Wheel Sizes:   ", self.wheel_sizes
            print "  Wheel Rates:   ", self.wheel_rates
            print "  Wheel Phases:  ", self.wheel_phases
            print "  Counter:       ", self.iterations

            if self.iterations > 1:
                print "  Size Deltas:   ", self.size_deltas
                print "  Rate Deltas:   ", self.rate_deltas
                print "  Phase Deltas:  ", self.phase_deltas
                print "  Size Ratio:    ", self.ratio

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def draw(self):
        """
        Draw a pattern based on the settings
        """

    # Initialise the pattern

        s = Spirograph.Spirograph ()
        s.size   = self.size
        s.points = self.points
        s.speeds = [i for i in self.wheel_rates]
        s.sizes  = [i for i in self.wheel_sizes]
        s.phases = [i * math.pi / 180 for i in self.wheel_phases]
        s.scale  = 1
        
        s.prepareBitmap ()
        s.draw ()

    # If we are superimposing multiple drawings

        while self.iterations > 1:
            self.iterations -= 1
            for i in range (0, self.wheels):
                self.wheel_rates  [i] += self.rate_deltas [i]
                self.wheel_sizes  [i] += self.size_deltas [i]
                self.wheel_phases [i] += self.phase_deltas [i] * math.pi / 180

            s.speeds = [i for i in self.wheel_rates]
            s.sizes  = [i for i in self.wheel_sizes]
            s.phases = [i for i in self.wheel_phases]
            s.scale  *= self.ratio
            s.draw ()

        s.bitmap.writeFile (self.getFileName())

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def getFileName(self):
        return self.path + self.filename + '.bmp'

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
    def setRatio (self, ratstr):
        """        A number (0 < x < 1) which determines how much the pattern shrinks
        each iteration.
        """

        str = string.strip (ratstr)

        try:
            self.ratio = float (ratstr)
            return 1
        except:
            pass

        return 0

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def setPoints(self, ptstr):
        """
        Sets the number of points
        """

        try:
            self.points = int (ptstr)
            return 1
        except ValueError:
            pass

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
    def decodeList (self, posstr):
        """        Parse a string of the format "[x,y,...]" and return the list
        [x,y,...]
        """

        str = string.strip (posstr)     # remove whitespace
        str = str [1:-1]                # remove '[' and ']'
        bits = string.split (str, ',')

        if len(bits) > 0:
            try:
                return [float (x) for x in bits]
            except ValueError:
                pass

        return None

#==============================================================================
# A module level function that allows us to call the example function from
# the command line
#==============================================================================

def go (args):

    ok = 1
    settings = Settings()
    strtype = type ('xxx')
    listtype = type (range (2))

# Output file path
    
    path = os.path.dirname(sys.argv[0])
    settings.path = os.path.abspath(path) + '\\'
    
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
        settings.go()
        return settings.getFileName()    
        
#======================================================================
# Call the entry point
#======================================================================

if len (sys.argv) > 1:
    go (sys.argv[1:]) # skip the program name
else:
    print "Spirograph Driver Loaded"
