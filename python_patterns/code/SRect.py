try:
    reload (SPoint) 
except NameError:
    import SPoint 

#==============================================================================
# The SRect class
#==============================================================================
class SRect:
    def __init__(self):
        self.left   = 0
        self.right  = 0
        self.top    = 0
        self.bottom = 0
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def __str__(self):
        return "Rect: (%f,%f) to (%f,%f)" % (self.left, self.bottom, self.right, self.top)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def fromPoint(self,pt):
        """
        Initialise from a SPoint structure
        """
        self.left   = pt.x
        self.right  = pt.x
        self.top    = pt.y
        self.bottom = pt.y
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def includePoint(self,pt):
        """
        Expand to include a SPoint structure
        """
        self.left   = min (pt.x, self.left)
        self.right  = max (pt.x, self.right)
        self.top    = max (pt.y, self.top)
        self.bottom = min (pt.y, self.bottom)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def includeRect(self,rect):
        """
        Expand to include a SRect structure
        """
        self.left   = min (rect.left, self.left)
        self.right  = max (rect.right, self.right)
        self.top    = max (rect.top, self.top)
        self.bottom = min (rect.bottom, self.bottom)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def display(self):
        print self
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def width(self):
        return self.right - self.left
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def height(self):
        return self.top - self.bottom
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def centre(self):
        xc = float (self.right + self.left) / 2
        yc = float (self.top + self.bottom) / 2
        return SPoint.SPoint(xc, yc)
    
    

        
        