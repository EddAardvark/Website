
import math

#============================================================
# Draws circles (8 octants)
#============================================================

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def info():
    """
    Constructs the point sets required to draw circles and octants. Octants
    cover the 45 degrees from (r,0) to (sqrt(r),sqrt(r)) where 'r' is the
    radius of the circle and 'sqrt' is the square root.

    works by tracing the contours of z = x^2 + y^2

    Circles are created by reflecting these octants in the three axes x=0, y=0
    and x = y.
    """
    help (info)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

def drawCPCircle (centre, point):
    """
    Draw a circle given the centre and a point on the circumference
    """

    xp = point [0] - centre [0]    
    yp = point [1] - centre [1]    

    r2 = xp * xp + yp * yp
    r  = math.sqrt (r2)

    return drawRadiusCircle (centre, r)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def drawRadiusCircle (centre, radius):
    """
    Draw a circle given the radius
    """

    points = constructOctant (radius)

# reflect in x = y

    reflect = [(p[1],p[0]) for p in points]
    points  = points + reflect
    
# reflect in x = 0

    reflect = [(-p[0],p[1]) for p in points]
    points  = points + reflect

# reflect in y = 0

    reflect = [(p[0],-p[1]) for p in points]
    points  = points + reflect

    return offsetPoints (points, centre [0], centre [1])

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def constructOctant (radius):
    """
    Construct an octant from the radius, centre = (0,0)
    Radius is converted to an integer
    """
    
    x  = int(abs(radius)+0.5)
    y  = 0
    z  = 0
    dx = 2 * x - 1
    dy = 2 * y + 1

# We can either move directly up (0,1), or up and to the left (-1,1)

    points = [(x,y)]
    
    while 1:
    # Up (this step is always taken)
    
        y  += 1
        z  += dy
        dy += 2

    # Left (This step might be taken)
    
        x2  = x - 1
        z2  = z - dx
        dx2 = dx - 2

    # decide which to use

        if abs(z2) < abs (z):
            x  = x2
            z  = z2
            dx = dx2

    # finished ?

        if x < y:
            break ;

        points.append ((x,y))

    return points

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def offsetPoints (points, dx, dy):
    """
    Offset an array of points by (dx, dy)
    """

    return [(p[0]+dx, p[1]+dy) for p in points]

    
    