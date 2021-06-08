import WindowsBMP
import CircleDrawer
import LineDrawer
import math
import string
import ColourMap

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def hcfList (list):
    "Highest common factor of a list of integers"

    if len (list) == 0:
        return 1

    h = list [0]

    for i in range (1, len(list)):
        h = hcf (h, list [i])

    return h        

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def hcf (n1, n2):
    "Highest common factor of two integers"

    n1 = abs (int (n1))
    n2 = abs (int (n2))

    while 1:
        if n1 > n2:
            t = n1
            n1 = n2
            n2 = t

        if n1 == 0:
            return n2

        if n1 == 1:
            return 1

        n2 = n2 % n1        
            
#=================================================================
# The Spirograph class
#=================================================================

class Spirograph:

    def __init__ (self):

        self.speeds     = [-3, 2]   # Rotation rates
        self.sizes      = [4, 3]    # Relative sizes of the wheels
        self.phases     = [0, 0]    # Starting angles of the wheels
        self.points     = 500       # Number of points in the pattern
        self.colour     = ColourMap.blue
        self.ccl_radius = 3         # used when drawing circles for points
        self.scale      = 1         # Used to rescale the entire pattern
        
        self.path       = 'c:\\python22\\work\\'
        self.filename   = 'spirograph'
        self.size       = (400,400)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def prepareBitmap (self):
        """
        Resize the bitmap
        Remove the old bitmap and create a new one
        """

        rad = min (self.size[0], self.size[1])        

        self.radius = (rad/2) - 2 - self.ccl_radius
    
        self.bitmap = WindowsBMP.WindowsBMP ()
        self.bitmap.create24Bit (self.size[0], self.size[1])
    
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def draw (self):
        """
        Draw the pattern. This doesn't erase the previous bitmap contents
        so you can superimpose multiple drawings.
        """

        points = self.getPoints ()

        if len (points) > 0:

            p0 = points [-1]

            for pt in points:
                line = LineDrawer.draw (p0, pt)
                self.bitmap.drawPointSet (line, self.colour)
                p0 = pt

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def drawCircles (self):
        """
        Draw the pattern as a circle at each point
        """

        points = self.getPoints ()

        for pt in points:
            ccl = CircleDrawer.drawRadiusCircle (pt, self.ccl_radius)
            self.bitmap.drawPointSet (ccl, self.colour)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def getPoints (self):
        """
        Returns the set of points defining the pattern
        """

        self.fixWheels ()

    # Initialise
    
        dt     = [2 * math.pi * x / self.points for x in self.speeds]
        theta  = [t for t in self.phases]
        xc     = self.size [0] / 2
        yc     = self.size [1] / 2
        wlist  = range (0, len (self.speeds))
        points = []

        if len (self.speeds) < 1:
            print "*** No wheels ***"
            return points

    # Calculate the points
    
        for i in range (0, self.points):
            x = xc
            y = yc
            
            for j in wlist:
                x += self.sizes [j] * math.cos (theta [j])
                y += self.sizes [j] * math.sin (theta [j])
                theta [j] += dt [j]

            points.append ((int(x), int(y)))

        return points        

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def fixWheels (self):
        """
        Fix the wheel parameters. Assumes that the speeds are definitive and
        that the phases and sizes are dependent.
        """

    # ensure all the arrays are the same size

        l1 = len (self.speeds)
        l2 = len (self.sizes)
        l3 = len (self.phases)

        num_wheels = min (l1, l2, l3)

        if num_wheels < 2:
            raise "Too few wheels"

        self.speeds = self.speeds [:num_wheels]
        self.sizes  = self.sizes  [:num_wheels]
        self.phases = self.phases [:num_wheels]

        sum = 0

    # calculate the total size

        for i in range (0,num_wheels):
            sum += abs (self.sizes [i])

    # Normalise and apply scale factor

        factor = float (self.radius) * self.scale / float (sum)    

        for i in range (0,num_wheels):
            self.sizes [i] *= factor

    # Fix the speeds - if there is a common factor we just draw the same
    # pattern multiple times, so we divide all the speeds by their highest
    # common factor

        self.speeds = [int (x) for x in self.speeds]                     
        h = hcfList (self.speeds) ;
        self.speeds = [x / h for x in self.speeds]                     
                    
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def getSymetry (self):
        "Return the symetry of the current pattern"

        difs = []

        for i in range (1, len (self.speeds)):
            difs.append (self.speeds [i] - self.speeds [i-1])
            
        return hcfList (difs)
                    
    
