# Load the other classes

try:
    reload (SPoint) 
except NameError:
    import SPoint 

try:
    reload (SRect) 
except NameError:
    import SRect 

import math

#==================================================================================
# A line in a pattern
#==================================================================================

class SLine:

    def __init__(self, p1, p2):
        self.p1 = p1
        self.p2 = p2
        self.shape1 = None
        self.shape2 = None
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def __str__(self):
        return "Line %s to %s" % (str(self.p1), str(self.p2))
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def midPoint(self):
        x = (self.p1.x + self.p2.x) / 2
        y = (self.p1.y + self.p2.y) / 2
        return SPoint.SPoint(x,y)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def length(self):
        dx = self.p1.x - self.p2.x
        dy = self.p1.y - self.p2.y
        return math.sqrt(dx*dx+dy*dy)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def vector(self):
        p1 = SPoint.SPoint (0,0)
        p2 = SPoint.SPoint (self.p2.x - self.p1.x, self.p2.y - self.p1.y)
        return SLine (p1, p2)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def display(self):
        print self
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def addShape(self, shape):
         if self.shape1 == None:
             self.shape1 = shape
         elif self.shape2 == None:
             self.shape2 = shape
         else:
             raise "Too many shapes"
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def reflect(self, point):
        """
        Reflect a point in this line
        """
   
        x21 = self.p2.x - self.p1.x
        y21 = self.p2.y - self.p1.y
        x31 = point.x - self.p1.x
        y31 = point.y - self.p1.y

        div = float (x21 * x21 + y21 * y21)
        
        a = float (x31 * x21 + y31 * y21) / div
        b = float (x31 * y21 - y31 * x21) / div

        x = self.p1.x + a * x21 - b * y21
        y = self.p1.y + a * y21 + b * x21

        return SPoint.SPoint(x,y)        
