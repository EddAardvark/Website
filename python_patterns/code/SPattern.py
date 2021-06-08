import WindowsBMP
import LineDrawer
import ColourMap
import math

try:
    reload (SPoint)
except NameError:
    import SPoint 

try:
    reload (SLine)
except NameError:
    import SLine

try:
    reload (Shape)
except NameError:
    import Shape 

try:
    reload (SRect)
except NameError:
    import SRect 

# Modes when expanding lines on the edge of the pattern

EXPAND_OUTSIDE = 1
EXPAND_ONLINE  = 2

def_path = 'c:/python25/work/shapes/'
#==============================================================================
# The SPattern class
#==============================================================================
class SPattern:
    def __init__(self, pth=None):
        self.lines = []
        self.shapes = []
        self.points = []
        self.iteration = 1
        self.edge_mode = EXPAND_ONLINE
        self.symetry = 4
        
        if pth == None:
            self.path = def_path
        else:
            self.path = pth
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def start(self,sides,centre=True):
        """
        Starts with a polygon, optionally connected to the centre
        """
        self.shapes = []
        self.points = []
        self.symetry = sides

        if sides < 3:
            raise "At least 3 sides are required"
    
        dt = math.pi / sides

        self.points = [SPoint.SPoint(math.cos(i*dt), math.sin (i*dt)) for i in range (1,2*sides,2)]

        if centre:
            self.points.append (SPoint.SPoint(0,0))
            for i in range (sides):
                s = Shape.Shape()
                s.addPoint (self.points [i])
                s.addPoint (self.points [(i+1)%sides])
                s.addPoint (self.points [sides])
                self.shapes.append (s)
        else:
            s = Shape.Shape()
            for i in range (sides):
                s.addPoint (self.points [i])

            self.shapes.append (s)

        self.findLines ()
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def startGrid(self,n):
        """
        Starts with a square grid, n x n
        """
        self.shapes = []
        self.points = []
        self.symetry = 4

        if n < 1:
            raise "At least 1 square is required"
    
        for i in range (n+1):
            for j in range (n+1):
                self.points.append (SPoint.SPoint(i,j))
            
        for i in range (n):
            for j in range (n):
                s = Shape.Shape()
                pos = (n + 1) * i + j
                s.addPoint (self.points [pos])
                s.addPoint (self.points [pos+1])
                s.addPoint (self.points [pos+n+2])
                s.addPoint (self.points [pos+n+1])
                self.shapes.append (s)

        self.findLines ()
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def display(self):
        print "Pattern has %d shapes and %d edges" % (len(self.shapes), len(self.lines))
        for shape in self.shapes:
            shape.display()
            rect = shape.boundingRect()
            rect.display()

        rect = self.boundingRect()
        rect.display()
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def boundingRect(self):
        """
        Calculate the bounding rectangle
        """
        
        ret = SRect.SRect()
        num = len (self.shapes)

        if num > 0:
            ret = self.shapes [0].boundingRect()
            
            for i in range (1,num):
                ret.includeRect(self.shapes [i].boundingRect())

        return ret
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def radius(self):
        """
        Radius of the smallest circle that contains all the points. Assumes the
        origin is (0,0).
        """
        
        r2 = 0

        for pt in self.points:
            d2=pt.x*pt.x + pt.y*pt.y
            r2 = max (r2,d2)

        return math.sqrt(r2)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def correct(self,factor):
        """
        Corrects the pattern by moving points nearer or further from the centre
        depending on where they are. Rnew = Rad * (Rold/Radius) ** factor
        """
        
        r = self.radius()

        for i in range (len(self.points)):
            d2 = self.points[i].x*self.points[i].x + self.points[i].y*self.points[i].y
            f = (math.sqrt(d2) / r) ** factor
            self.points[i].x *= f
            self.points[i].y *= f
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def circularise(self):
        """
        Stretch the underlying polygon into a circle.
        """

        dt  = 2 * math.pi / self.symetry
        cdt = math.cos (dt/2)
                  
        for i in range (len(self.points)):
            ang = math.atan2 (self.points[i].y,self.points[i].x)
            if ang < 0:
                ang = 2 * math.pi + ang
            while ang > dt / 2:
                ang -= dt

            f = math.cos (ang) / cdt

            self.points[i].x *= f
            self.points[i].y *= f
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def draw(self, bm_width, fname):
        """
        Draw the pattern
        """

        bitmap = WindowsBMP.WindowsBMP ()
        bitmap.create24Bit (bm_width, bm_width)

        rect = self.boundingRect()
        width = rect.width()
        height = rect.height()
        centre = rect.centre()
        xc=centre.x
        yc=centre.y
        bmxc = bm_width/2
        bmyc = bm_width/2
        xscale = 0.9 * float (bm_width) / float (width)
        yscale = 0.9 * float (bm_width) / float (height)
        scale = min (xscale,yscale)

        for shape in self.shapes:

            num = len (shape.points)

            if num > 0:            
                x1=(int) ((shape.points [0].x-xc) * scale + bmxc)
                y1=(int) ((shape.points [0].y-yc) * scale + bmyc)

                for i in range (1,num+1):                
                    x2=(int) ((shape.points [i%num].x-xc) * scale + bmxc)
                    y2=(int) ((shape.points [i%num].y-yc) * scale + bmyc)

                    pixels = LineDrawer.draw ((x1,y1),(x2,y2))
                    bitmap.drawPointSet (pixels, ColourMap.black)

                    x1 = x2
                    y1 = y2

        bitmap.writeFile(self.path + fname + ".bmp")
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def nextPattern(self):
        """
        Calculate the next pattern
        """
        self.new_shapes = []
        self.iteration += 1

    # Break the old point/shape links
    
        for pt in self.points:
            pt.shapes = []
            pt.lines = []

    # Create the new internal shapes
    
        for shape in self.shapes:
            self.new_shapes.append (shape.internalShape())

    # Create the new line shapes
    
        for line in self.lines:
            self.makeNewShapes (line)

    # Complete the linking and draw
    
        self.shapes = self.new_shapes
        self.findLines ()        
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def findLines (self):
        """
        Read through the points enumerating the lines and
        tie them to the shapes.
        """

        self.lines = []

        for shape in self.shapes:
            shape.done = 0

        for shape in self.shapes:
            p1 = shape.points [-1]
            shape.done = 1
            for pt in shape.points:
                other_shape = None
                for s2 in pt.shapes:
                    if s2 != shape and s2.includes(p1):
                        other_shape = s2
                        break

                if other_shape == None or other_shape.done == 0:
                    line = SLine.SLine(pt, p1)
                    line.addShape (shape)
                    pt.addLine (line)
                    p1.addLine (line)
                    if other_shape != None:
                        line.addShape (other_shape)
                    self.lines.append (line)

                p1 = pt
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def makeNewShapes (self,line):
        """
        Converts a single line into a square and two triangles
        <[]>
        """

        if line.shape1 == None:
            if line.shape2 != None:
                self.expandOneShape (line, line.shape2)
        else:
            if line.shape2 == None:
                self.expandOneShape (line, line.shape1)
            else:
                self.expandTwoShapes (line, line.shape1, line.shape2)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def expandOneShape (self,line, shape):
        """
        Converts a single line into a square and two triangles when there
        is one adjacent shape.
        """
        p1 = line.p1
        p2 = line.p2
        p11 = shape.mapPoint (p1)
        p21 = shape.mapPoint (p2)

        if self.edge_mode == EXPAND_OUTSIDE:        
            p12 = line.reflect (p11)
            p22 = line.reflect (p21)
        else:
            p12 = p1.interpolate (p2,1/3.0)
            p22 = p1.interpolate (p2,2/3.0)

        self.assemblePoints (p1, p2, p11, p12, p21, p22)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def expandTwoShapes (self, line, s1, s2):
        """
        Converts a single line into a square and two triangles when there
        are two adjacent shapes.
        """
        p1 = line.p1
        p2 = line.p2
        p11 = s1.mapPoint (p1)
        p12 = s2.mapPoint (p1)
        p21 = s1.mapPoint (p2)
        p22 = s2.mapPoint (p2)

        self.assemblePoints (p1, p2, p11, p12, p21, p22)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def assemblePoints (self, p1, p2, p11, p12, p21, p22):
        """
        Common part of the two expand functions
        """

        new_s1 = Shape.Shape()
        new_s2 = Shape.Shape()
        new_s3 = Shape.Shape()

        new_s1.addPoint(p1)
        new_s1.addPoint(p11)
        new_s1.addPoint(p12)
        
        new_s2.addPoint(p11)
        new_s2.addPoint(p12)
        new_s2.addPoint(p22)
        new_s2.addPoint(p21)

        new_s3.addPoint(p2)
        new_s3.addPoint(p21)
        new_s3.addPoint(p22)

        self.new_shapes.append (new_s1)
        self.new_shapes.append (new_s2)
        self.new_shapes.append (new_s3)

    # Add the new points to our list
    
        self.addPoint (p11)
        self.addPoint (p12)
        self.addPoint (p21)
        self.addPoint (p22)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def addPoint(self, pt):
        """
        Add a point, avoiding duplicates.
        """

        try:
            idx = self.points.index (pt)

        except ValueError:
            self.points.append(pt)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def getDual(self):
        """
        Return the dual of this pattern
        """

        dual = SPattern ()
        
        for pt in self.points:
            shape = Shape.Shape ()
            if len(pt.shapes) == len(pt.lines):
                for s in pt.shapes:
                    s.findCentre ()
                    newpt = dual.findPoint (s.centre)
                    shape.addPoint (newpt)
                shape.sortPoints ()
                dual.shapes.append(shape)

        dual.findLines()
        return dual
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def getCopy(self):
        copy = SPattern ()
        
        for shape in self.shapes:
            newshape = Shape.Shape ()
            for pt in shape.points:
                newpt = copy.findPoint (pt)
                newshape.addPoint (newpt)
            newshape.sortPoints ()
            copy.shapes.append(newshape)

        copy.findLines()
        return copy
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def findPoint(self,fpt):
        """
        Find a point in the list (by value), if it's not there add it
        """

        for pt in self.points:
            if pt.x == fpt.x and pt.y == fpt.y:
                return pt

        newpt = SPoint.SPoint (fpt.x, fpt.y)
        self.points.append (newpt)
        return newpt
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            
    def centrePoints(self):
        """
        All the points that are inside polygons formed by a set of triangles are
        moved to the centre. Done in two passes to preserve symetry.
        """
        for pt in self.points:
            pt.toCentre()
        for pt in self.points:
            pt.update()
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def relax(self, n, drag=0, scale=200, draw=False, width=300):
        """
        Assume all the lines are springs that relax to the average
        length of lines in the diagram and calculate the equations of
        motion.
        drag applies a damping factor to movement, 1 represents 100% loss of
        momentum between iterations, 0 represents none.
        scale is the calculation step, larger values give finer control
        """

        drag = 1 - drag
        d_avg = self.averageLineLength()

        print "000: Average Length = ", d_avg

    # Do the relaxation
        for i in range (n):
            if draw:
                self.draw(width,"relax%04d"%i)
            for pt in self.points:
                pt.ax = 0
                pt.ay = 0
            for l in self.lines:
                dx = l.p1.x - l.p2.x
                dy = l.p1.y - l.p2.y
                d = math.sqrt(dx*dx+dy*dy)
                f = (d - d_avg)/(scale * d)
                l.p1.ax -= dx * f
                l.p1.ay -= dy * f
                l.p2.ax += dx * f
                l.p2.ay += dy * f
            for pt in self.points:
                pt.vx = pt.vx * drag + pt.ax
                pt.vy = pt.vy * drag + pt.ay
                pt.x  += pt.vx
                pt.y  += pt.vy

            avg2 = self.averageLineLength()
            print "%3d: Average Length = %f" % (i+1, avg2)
        if draw:
            self.draw(width,"relax%04d"%n)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def ping(self,pt=0,dir=0,mag=0.1):
        """
        Gives one of the points in an animation a nudge.
        pt: The index of the point to nudge
        dir: The direction (in degrees, 0-360)
        mag: The size of the impule (in multiples of the average line length)
        """
        if pt < 0 or pt >= len(self.points):
            raise Exception ("pt not in range 0 - %d" % len(self.points))

        avg = self.averageLineLength()
        vx = math.cos(dir*math.pi/180) * avg * mag
        vy = math.sin(dir*math.pi/180) * avg * mag
        self.points[pt].vx += vx
        self.points[pt].vy += vy
        print "Velocity = (%f,%f)" % (self.points[pt].vx, self.points[pt].vy)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def averageLineLength(self):
        """
        Calculate the average length of lines in the pattern.
        If there aren't any lines it returns 1.
        """
        num_lines = len(self.lines)
        if num_lines == 0:
            return 1

        tlen = 0
        for l in self.lines:
            dx = l.p1.x - l.p2.x
            dy = l.p1.y - l.p2.y
            d = math.sqrt(dx*dx+dy*dy)
            tlen += d
        return tlen / num_lines

#=================================================================
def makePattern(sides = 4,centre=0,iterations=1):
    """
    Make a pattern object based on the supplied parameters
    """
    pat = SPattern ()
    pat.start(sides,centre)
    for i in range (iterations):
        pat.nextPattern()
    return pat
