#==============================================================================
# The SPoint class
#==============================================================================
class SPoint:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.next_x = 0     # For deferred movement
        self.next_y = 0
        self.vx = 0         # X velocity for relaxation calculations
        self.vy = 0         # y velocity for relaxation calculations
        self.ax = 0         # X acceleration for relaxation calculations
        self.ay = 0         # y acceleration for relaxation calculations
        self.shapes = []
        self.lines = []
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def __str__(self):
        return str ((self.x, self.y))
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def addShape(self,shape):
        self.shapes.append (shape)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def addLine(self,line):
        self.lines.append (line)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def scale(self,factor):
        self.x *= factor
        self.y *= factor
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def offset(self,dx,dy):
        self.x += dx
        self.y += dy
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def compare(self,other):
        """
        Compare two points - ordering the points make some search oparations
        easier. The order itself isn't important so long as it is consistent,
        eg. if A > B and B > C then A > C.
        Returns 0, 1 or -1
        """
        
        if self.x > other.x or self.x == other.x and self.y > other.y:
            return 1

        if self.x < other.x or self.x == other.x and self.y < other.y:
            return -1

        return 0        
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def interpolate(self,pt,factor):
        """
        Find a point on the line joining this point to 'pt'
        factor determines how far along the line, so zero will return
        this point and one will return pt.
        """
        x = self.x + factor * (pt.x - self.x)
        y = self.y + factor * (pt.y - self.y)
        return SPoint (x,y)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def update(self):
        self.x = self.next_x
        self.y = self.next_y
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def toCentre(self):
        """
        Move this point to the centre of the polygon determined by all the surrounding shapes.
        This version only works if all the surrounding shapes are triangles.
        """
        self.next_x = self.x
        self.next_y = self.y

        if len (self.shapes) <= 2:
            return

        points = []

    # Find unique points excluding this one.

        for s in self.shapes:
            if len(s.points) != 3:
                return

            for pt in s.points:
                if pt.compare (self) != 0:
                    try:
                        idx = points.index (pt)

                    except ValueError:
                        points.append(pt)

    # Find the mid-point of the found points
    # Store this in the next variables so that all changes can be applied once all
    # calculations have been made.

        if len(points) > 2:
            x = 0
            y = 0

            for pt in points:
                x += pt.x
                y += pt.y

            self.next_x = x/len(points)
            self.next_y = y/len(points)

