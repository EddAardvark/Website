import math

try:
    reload (SRect)
except NameError:
    import SRect

try:
    reload (SPoint)
except NameError:
    import SPoint

#==============================================================================
# The Shape class
#==============================================================================
class Shape:
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def __init__(self):
        self.points = []
        self.internal_shape = None
        self.centre = None
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def addPoint(self,pt):
        """
        Add a point. These should be in order as edges will join
        adjacent points. Also add this shape to the point.
        """
        self.points.append (pt)
        pt.addShape (self)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def display(self):
        print "Shape: %d points" % (len (self.points))
        for pt in self.points:
            print pt
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def boundingRect(self):
        """
        Return the rectangle bouding the shape
        """

        ret = SRect.SRect()
        num = len(self.points)
        ret.fromPoint(self.points [0])
        
        for i in range (1,num):
            ret.includePoint(self.points [i])

        return ret
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def findCentre(self):
        """
        Find and set the centre
        """
        xc = 0.0
        yc = 0.0
        
        num = len(self.points)
        if num > 0:
            for pt in self.points:
                xc += pt.x
                yc += pt.y
                    
            xc /= num
            yc /= num

            self.centre = SPoint.SPoint (xc, yc)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def internalShape(self):
        """
        Calculate the points inside this shape
        """
        xc = 0.0
        yc = 0.0
        
        if self.internal_shape == None:
            self.findCentre()
            self.internal_shape = Shape ()

            for pt in self.points:
                point = self.centre.interpolate (pt, 1/3.0)
                self.internal_shape.addPoint(point)                
                
        return self.internal_shape
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def mapPoint(self, pt):
        """
        Find the corresponding point in the internal shape to the one
        supplied.
        """

        try:
            idx = self.points.index (pt)
            s2 = self.internalShape ()
            return s2.points [idx]

        except ValueError:
            raise "Point not found"            
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def includes(self, pt):
        """
        Does this shape include a point
        """

        try:
            idx = self.points.index (pt)
            return 1

        except ValueError:
            return 0
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def sortPoints(self):
        """
        Make sure the points are in order (so we don't draw stars)
        """

        self.findCentre()

        list = [(math.atan2(pt.y-self.centre.y,pt.x-self.centre.x),pt) for pt in self.points]
        list.sort()
        self.points = [x[1] for x in list]
        