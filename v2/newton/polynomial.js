//-------------------------------------------------------------------------------------------------
// Represents a polynomial used in the Newton fractal generator.
// (c) John Whitehouse 2015
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------
function Polynomial ()
{
    this.terms = [];
    this.order = 0;
    this.newton_top = [];
    this.newton_bottom = [];
}

// For finding roots.

Polynomial.search_depth = 1000;
Polynomial.xvals = [-1000, 1000, 0];
Polynomial.yvals = [0, 1000, -1000];
Polynomial.match = 1e-24;

//-------------------------------------------------------------------------------------------------
// Construct from an array of strings
//-------------------------------------------------------------------------------------------------
Polynomial.FromStrings = function (string_list)
{
    var num_terms = string_list.length;
    var ret = new Polynomial ();

    for (var i = 0 ; i < num_terms ; ++i)
    {
        var x = parseFloat (string_list [i]);

        ret.terms.push (isNaN (x) ? 0.0 : x);

        if (x != 0)
        {
            ret.order = i;
        }
    }
    return ret;
}
//-------------------------------------------------------------------------------------------------
// Construct from an array of values
//-------------------------------------------------------------------------------------------------
Polynomial.FromValues = function (values)
{
    var num_terms = values.length;
    var length = 1;

    for (var i = 1 ; i < num_terms ; ++i)
    {
        if (values [i] != 0)
        {
            length = i + 1;
        }
    }

    var ret = new Polynomial ();

    for (var i = 0 ; i < length ; ++i)
    {
        ret.terms.push (isNaN (values[i]) ? 0.0 : values[i]);
    }

    ret.order = length - 1;
    return ret;
}
//-------------------------------------------------------------------------------------------------
// Get one of the terms
//-------------------------------------------------------------------------------------------------
Polynomial.prototype.GetCoefficient = function (idx)
{
    return (idx >= this.terms.length) ? 0 : this.terms [idx];
}
//-------------------------------------------------------------------------------------------------
// Calculate the derivative
//-------------------------------------------------------------------------------------------------
Polynomial.prototype.Derivative = function ()
{
    var ret = new Polynomial ();

    for (var i = 1 ; i <= this.order ; ++i)
    {
        ret.terms.push (this.terms [i] * i);
    }
    ret.order = this.order - 1;
    return ret;
}
//-------------------------------------------------------------------------------------------------
// Convert to HTML, assumes that the stylesheet contains a style "superscript".
//-------------------------------------------------------------------------------------------------
Polynomial.prototype.AsHTML = function ()
{
    var ret = "";
    var first = true;

    for (var i = this.order ; i >= 0 ; --i)
    {
        if (this.terms [i] != 0)
        {
            var x = this.terms [i];
            var sign = "&nbsp;&plus;&nbsp;";

            if (x < 0)
            {
                sign = "&nbsp;&minus;&nbsp;";
                x = -x;
            }

            if (! first)
            {
                ret += sign;
            }

            if (i == 0 || x != 1)
            {
                ret += Misc.FloatToText (x, 10);
            }
            first = false;

            if (i >= 2)
            {
                ret += "z<span class=\"superscript\">" + i + "</span>";
            }
            else if (i == 1)
            {
                ret += "z";
            }
        }
    }
    return ret;
}
//-------------------------------------------------------------------------------------------------
// Calculate the numerator and denominator polynomials used in the iteration
//-------------------------------------------------------------------------------------------------
Polynomial.prototype.MakeNewtonPolynomials = function ()
{
    if (this.order < 1) return;

    var derivative = this.Derivative ();
    this.newton_bottom = derivative;
    this.newton_top = new Polynomial;

    // Top is xf'(x) - f(x)

    this.newton_top.terms.push (-this.terms [0])

    for (var i = 1 ; i <= this.order ; ++i)
    {
        this.newton_top.terms.push (derivative.terms [i-1] - this.terms [i]);
    }
    this.newton_top.order = this.order;
}

//-------------------------------------------------------------------------------------------------
Polynomial.prototype.FindRoots = function ()
{
    // Find the roots of a polynomial
    
    var roots = [];
    var poly = Polynomial.FromValues (this.terms);
    
    while (poly.order > 0)
    {        
        if (poly.order == 1)
        {
            roots.push (new Complex (0, -poly.terms [0]));
            poly = Polynomial.FromValues ([0]);
        }
        else if (poly.order == 2)
        {
            var a = 1;
            var b = poly.terms [1] / poly.terms [2];
            var c = poly.terms [0] / poly.terms [2];
            
            var s2 = b * b - 4 * c;
            
            if (s2 >= 0)
            {
                var s = Math.sqrt (s2);
                roots.push (new Complex ((s - b) / 2, 0));
                roots.push (new Complex ((s + b) / 2, 0));
            }
            else
            {
                var s = Math.sqrt (-s2);
                roots.push (new Complex (- b / 2, s / 2));
                roots.push (new Complex (- b / 2, -s / 2));
            }
            poly = Polynomial.FromValues ([0]);
        }
        else
        {
            poly.MakeNewtonPolynomials ();
        
            root = poly.FindRoot ();
            
            if (root == null)
            {
                break;
            }
            // decide if this is a single real root or a conjugate pair.
            // we do this by dividing the polynomial by the roots and comparing
            // the remainders

            var x2y2 = root.x * root.x + root.y * root.y;
            var rp1 = new Polynomial.FromValues ([-root.x, 1]);
            var rp2 = new Polynomial.FromValues ([x2y2, -2 * root.x, 1]);            
            var div = poly.Divide (rp1);
            var div2 = poly.Divide (rp2);

            if (div.rem.TSquared () < div2.rem.TSquared ())
            {
                roots.push (root);
                poly = div.div;  
            }
            else
            {            
                roots.push (root);
                roots.push (new Complex (root.x, -root.y));   
                poly = div2.div;
            }
        }
    }
    
    return roots;
}
//-------------------------------------------------------------------------------------------------
Polynomial.prototype.FindRoot = function ()
{
    // Find a root of the polynomial
    
    for (var xidx in Polynomial.xvals)
    {
        var x = Polynomial.xvals [xidx];
        
        for (var yidx in Polynomial.yvals)
        {
            var y = Polynomial.yvals [yidx];
            var z = new Complex (x,y);

            for (var i = 0 ; i < Polynomial.search_depth ; ++i)
            {
                var num = this.newton_top.GetValue (z);
                var den = this.newton_bottom.GetValue (z);
                var zm = z;
                
                z = num.Divide (den);
                
                if (z == null) // div by 0
                {
                    break;
                }
                
                var dif = z.Minus (zm);

                if (dif.MagnitudeSquared () < Polynomial.match)
                {
                    return z;
                }
                
                var v = this.GetValue (z);

                if (v.MagnitudeSquared () < Polynomial.match)
                {
                    return z;
                }
            }
        }
    }
    return null;
}
//-------------------------------------------------------------------------------------------------
// Calculate the value of the polyminal at 'z' (a complex number)
//-------------------------------------------------------------------------------------------------
Polynomial.prototype.GetValue = function (z)
{
    var n = this.order;
    var r = new Complex (0,0);

    for (var i = 0 ; i <= n ; ++i)
    {
        r = r.Multiply (z).AddFloat (this.terms [n-i]);
    }

    return r;
}
//-------------------------------------------------------------------------------------------------
// Divides this polynomial by another, returns the result plus the remainder.
//-------------------------------------------------------------------------------------------------
Polynomial.prototype.Divide = function (poly)
{
    var num = this.order - poly.order;
    var ret = {};

    if (num < 0)
    {
        ret.div = Polynomial.FromValues ([0]);
        ret.rem = Polynomial.FromValues (this.terms);
        return ret;
    }

    var p1 = [...this.terms];
    var p2 = [...poly.terms];
    
    for (var i = 0 ; i < num ; ++i)
        p2 = [0].concat (p2);

    var result = [];

    for (var i = 0 ; i < num + 1 ; ++i)
    {
        var len = p1.length;
        var rat = p1 [len-1] / p2 [len-1];
        result.push (rat);
        for (var j = 0 ; j < len ; ++j)
        {
            p1[j] -= rat * p2[j];
        }
        p1.length = len-1;
        p2 = p2.slice (1);
    }

    ret.div = Polynomial.FromValues (result.reverse ());
    ret.rem = Polynomial.FromValues (p1);
    
    return  ret;    
}
//-------------------------------------------------------------------------------------------------
// Divides this polynomial by another, returns the result plus the remainder.
//-------------------------------------------------------------------------------------------------
Polynomial.prototype.Multiply = function (poly)
{
    var len = this.terms.length + poly.terms.length - 1;
    var terms = new Array (len);

    for (i = 0 ; i < len ; ++i)
    {
        terms [i] = 0;
    }
    
    for (i = 0 ; i < this.terms.length ; ++i)
    {
        for (j = 0 ; j < poly.terms.length ; ++j)
        {   
            terms [i+j] += this.terms [i] * poly.terms [j];
        }
    }
    
    return Polynomial.FromValues (terms);
}
//-------------------------------------------------------------------------------------------------
// Sum of the squares of the terms
//-------------------------------------------------------------------------------------------------
Polynomial.prototype.TSquared = function ()
{
    var sum = 0;
    
    for (var idx in this.terms)
    {
        sum += this.terms [idx] * this.terms [idx];
    }
    return sum;
}

/*


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
    */
    /**/

/*


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
            
*/
            
