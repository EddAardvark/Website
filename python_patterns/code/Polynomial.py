#==============================================================
# (c) John Whitehouse 2010
# htpp://www.eddaardvark.co.uk/
#
# Represents polynomials as lists of coefficients
#
# [a,b,c,d] = ax^3 + bx^2 +cx + d
#
#==============================================================

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def GetValue (polynomial, z):
    """
    Calculate the value of the polyminal at 'z'
    """

    n = len (polynomial)
    r = complex (0,0)

    for i in range (n):
        r = r * z + polynomial [i]

    return r        

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def divide (_poly1, poly2):
    """
    Divide poly1 by poly2. Returns the new polynomial and the remainder
    """

    num = len(_poly1) - len(poly2)

    if num < 0:
        raise Exception("divisor too long")

    poly1 = [i for i in _poly1]
    n2 = len(poly2)
    
    ret = []
    for i in range (num+1):
        f = float(poly1 [i]) / float(poly2 [0])
        ret.append(f)
        for j in range (n2):
            poly1 [i+j] -= f * poly2[j]
    return ret,poly1
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def Differentiate (polynomial):
    """
    Given an polynomial, returns its derivative
    """
    diff = []
    n = len (polynomial)-1
    
    for i in range (n):
        diff.append (polynomial [i] * (n-i))

    return diff
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def GetNewtonPolynomials (polynomial):
    """
    given an polynomial, returns the numerator and denominator to
    be used in the iteration x -> numerator(x) / denominator (x)
    """
    denominator = Differentiate(polynomial)
    numerator = []

    xfdash = denominator + [0]

    for i in range (0, len (polynomial)):
        numerator.append (xfdash [i] - polynomial [i])    

    return numerator, denominator
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def FindRoots (polynomial):
    """
    Find the roots of a polynomial
    """
    roots = []
    while len(polynomial) > 2:
        root = FindRoot (polynomial)
        if root == None:
            raise Exception ("Can't solve {0}", polynomial)

    # decide if this is a single real root or a conjugate pair.
    # we do this by dividing the polynomial by the roots and comparing
    # the remainders

        rp1 = [1, -root.real]
        rp2 = [1, -2 * root.real, root.real * root.real + root.imag * root.imag]
        
        p1, rem1 = divide (polynomial, rp1)
        p2, rem2 = divide (polynomial, rp2)

        m1 = abs (rem1 [-1])
        m2 = max (abs (rem2 [-1]),abs (rem2 [-2]))

        if m1 < m2:
            roots.append (complex (root.real, 0))
            polynomial = p1
        else:
            roots.append (root)
            roots.append (root.conjugate())
            polynomial = p2

    if len (polynomial) == 2:
        roots.append (complex (-polynomial[1]/polynomial[0],0))

    return roots        
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def GetNewtonOrbit (polynomial, x, y, num):
    """
    Returns the path taken by a starting "guess" as it converges on a
    root (or not)
    """
    num,den = GetNewtonPolynomials (polynomial)

    z = complex (x,y)
    orbit = [z]

    for i in range (num):
        v1 = GetValue (num, z)
        v2 = GetValue (den, z)
        z = v1 / v2
        orbit.append (z)

    return orbit        
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def FindRoot (polynomial):
    """
    Find a root of the polymonial
    """
    xvals = [-1000,1000,0]
    yvals = [0,1000,-1000]

    num,den = GetNewtonPolynomials (polynomial)

    for x in xvals:
        for y in yvals:
            z = complex (x,y)
            try:
                for i in range (1000):
                    v1 = GetValue (num, z)
                    v2 = GetValue (den, z)
                    zm = z
                    z = v1 / v2
                    v3 = GetValue (polynomial, z)

                    if z == zm:
                        return z
                v = GetValue (polynomial, z)
                if abs (v) < 1e-10:
                    return z
            except:
                pass
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def SortRoots (_roots):
    """
    Sort some roots
    """

    roots = [r for r in _roots]

    while True:
        swapped = 0
        for i in range (0, len(roots)-1):
            if roots[i].real > roots[i+1].real or (roots[i].real == roots[i+1].real and roots[i].imag > roots[i+1].imag):
                temp = roots[i]
                roots [i] = roots [i+1]
                roots [i+1] = temp
                swapped += 1
        if swapped == 0:
            break

    return roots        
            
