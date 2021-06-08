#==============================================================
# (c) John Whitehouse 2002-2003
# htpp://www.eddaardvark.co.uk/
#==============================================================

X = 0
Y = 1

#============================================================
# Constructs the set of pixels to draw a line between
# two points
#
# The line following algorithm basically calculates the
# value of Z = Ax + By + C for candidate points along the
# line and chooses the next point to be the candidate where
# Z is closest to zero. Because we start at a point on the
# line (where Z = 0) and calculate the candidate values by
# adding the derivatives (dz/dx and dz/dy) we don't need
# to know the value of C.
#============================================================

def draw (point1, point2):
    """
    Draw a line from point 1 to point 2
    """

# Ensure line has increasing 'x' values
    
    if point1[X] > point2 [X]:
        p2 = point1
        p1 = point2
    else:
        p1 = point1
        p2 = point2

# A and B are the co-efficients in the line equation
# Ax + By + C = 0. This algorithm doesn't need to know
# the value of C (which is Y1.X2 - X1.Y2)

    a = p2 [Y] - p1 [Y]
    b = p1 [X] - p2 [X]

# Draws the line - returns a set of points
# a line is steep if |dy| > |dx| (|a| > |b|)

    steep = abs (a) > abs (b)

# Rising (1) or falling (-1)?

    if a >= 0:
        dy = 1
    else:
        dy = -1

# Initialise

    z   = 0         # firts point is on the line (z = 0)
    x   = p1 [X]    # first point
    y   = p1 [Y]
    dz  = b * dy    # change of z in vertical direction
    ret = [(x,y)]   # Initialise return list with first point

    # Rising or falling steeply, draws verticals and diagonals"

    if steep:

        while y != p2 [Y]:

            y += dy
            z += dz
            z_di = z + a

            if abs (z) > abs (z_di):
                x += 1
                z += a

            ret.append ((x,y))

    # Rising or falling gentley, draws diagonals and horizontals"

    else:

        while x != p2 [X]:

            x += 1
            z += a
            z_di = z + dz

            if abs (z) > abs (z_di):
                y += dy
                z += dz

            ret.append ((x,y))
        
    return ret
