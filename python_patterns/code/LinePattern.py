#==============================================================
# (c) John Whitehouse 2002-2003
# htpp://www.eddaardvark.co.uk/
#==============================================================

import WindowsBMP
import LineDrawer
import math
import string
import ColourMap

# some types

an_int = type (3)
a_list = type ([])
a_tuple = type (())

#=================================================================
# Some examples
#=================================================================

def example(which):
    """
        Draw some line patterns.

        If 'which' is a single integer (0-50) then this function
        draws the complete graph of that number of points.append

        if 'which' is a two member tuple then it draws a star.

        other values...
            100 => Shrinking and rotating 5 pointed star
            101 => Shrinking and rotating heptagon
    """

# tuples and lists draw a star

    if type(which) == a_tuple or type(which) == a_list:
        if len (which) >= 2:
            index = '%d_%d' % (which [0], which [1])
            lp = LinePattern ()
            lp.colour = ColourMap.blue
            lp.drawStar (which [0], which [1])
            lp.bitmap.writeFile(lp.path + 'star' + index + '.bmp')

# Small integers draw a complete graph, larger integers other patterns

    elif type(which) == an_int:

        if which <= 50:
            index = string.zfill(which, 5)

            lp = LinePattern ()
            lp.colour = ColourMap.blue
            lp.drawGraph (which)
            lp.bitmap.writeFile(lp.path + 'graph' + index + '.bmp')

        elif which == 100: # shrinking 5 point star
            
            lp = LinePattern ()
            lp.setSize (640)
            colours = ColourMap.createLinear(ColourMap.blue, ColourMap.green,30)

            for i in range (0,30):
                lp.colour = colours [i]
                lp.phase += math.pi/60
                lp.radius *= 0.99
                lp.drawStar (5,2)

            lp.bitmap.writeFile(lp.path + 'shrinking5star.bmp')
        
        elif which == 101: # shrinking heptagon
            
            lp = LinePattern ()
            lp.setSize (640)

            for i in range (0,40):
                lp.phase += math.pi/50
                lp.radius *= 0.97
                lp.drawStar (7, 1)

            lp.bitmap.writeFile(lp.path + 'shrinking7.bmp')

#=================================================================
# The Line Pattern class
#=================================================================

class LinePattern:

    def __init__ (self):
        self.width      = 400
        self.colour     = chr(255)+chr(0)+chr(255) # magenta
        self.path       = 'c:\\python22\\work\\'
        self.filename   = 'circle'
        self.phase      = 0

    # Start off with a blank bitmap, 400 x 400

        self.setSize (400)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def getCirclePoints (self, n):

        "Get a set of 'n' points evenly spaced around a circle"
        
        points = []
        theta  = 2 * math.pi / n
        xc     = self.width / 2
        yc     = self.width / 2

    # Filter out stupid radii

        if self.radius < 0:
            self.radius = 0
        elif self.radius >= self.width / 2:
            self.radius = self.width / 2

    # Arrange the points in a circle
    
        for i in range (0, n):
            t = theta * i + self.phase
            x = xc + int (self.radius * math.cos (t) + 0.5)
            y = yc + int (self.radius * math.sin (t) + 0.5)
            points.append ((x,y))

        return points            

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def setSize (self, size):
        """
        Resize the bitmap
        """

        self.width  = size
        self.radius = (size/2) - 4
        self.clear ()

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def clear(self):
        """
        Remove the old bitmap and create a new one
        """
    
        self.bitmap = WindowsBMP.WindowsBMP ()
        self.bitmap.create24Bit (self.width, self.width)
    
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def drawGraph (self, n):
        "Draw the complete graph of 'n' points"

    # Get the points

        points = self.getCirclePoints (n)

        for i in range (0, n):
            for j in range (1, (n+3)/2):
                line = LineDrawer.draw (points [i], points [(i+j)%n])
                self.bitmap.drawPointSet (line, self.colour)
                
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def drawStar (self, n1, n2):
        "Draws a star based on n1 and n2"

    # Get the points

        points = self.getCirclePoints (n1)

        idx = 0

        for i in range (0, n1):
            i2 = (idx + n2) % n1
            line = LineDrawer.draw (points [idx], points [i2])
            self.bitmap.drawPointSet (line, self.colour)
            idx = i2

