//-------------------------------------------------------------------------------------------------
// A complex number
// (c) John Whitehouse 2020, 2021
// www.eddaardvark.co.uk
//
// None of the methods in this class alter the instance so it is safe to reuse them rather then having
// to clone when assigning.
//-------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------
Complex = function (x, y)
{
    this.x = x;
    this.y = y;
}
//----------------------------------------------------------------------------------------------------------------
Complex.Initialise = function ()
{
}
//--------------------------------------------------------------------------------------------
Complex.FromFloat = function (f)
{
    return new Complex (n, 0);
}
//--------------------------------------------------------------------------------------------
Complex.FromComplex = function (c)
{    
    return new Complex (c.x, c.y);
}
//--------------------------------------------------------------------------------------------
Complex.FromString = function (str)
{
    var part1 = "";
    var part2 = "";
    var part = 1;
    
    // Remove unnecessary characters
    
    var text = "";
    
    for (var i = 0; i < str.length; ++i)
    {
        var ch = str.charAt(i);
        if ("0123456789+-.i".includes(ch))
        {
            if (part == 2)
            {
                part2 += ch;
            }
            else if (part1 == "")
            {
                part1 += ch;
            }
            else if (ch == "-")
            {
                part2 += ch;
                part = 2;
            }
            else if (ch == "+")
            {
                part = 2;
            }
            else
            {
                part1 += ch;
            }
        }
    }
    // Missing or invalid components will return 0.
    
    var x = 0;
    var y = 0;
    
    if (part1.length > 0)
    {
        if (part1 == "i")
        {
            y = 1;
        }
        else if (part1 [part1.length-1] == "i")
        {
            y = parseFloat (part1.substring (0, part1.length-1));
        }
        else
        {
            x = parseFloat (part1);
        }
    }
    
    if (part2.length > 0)
    {
        if (part2 == "i")
        {
            y = 1;
        }
        else if (part2 [part2.length-1] == "i")
        {
            y = parseFloat (part2.substring (0, part2.length-1));
        }
        else
        {
            x = parseFloat (part2);
        }
    }
    
    return new Complex (x, y);
}

//--------------------------------------------------------------------------------------------
Complex.prototype.toString = function ()
{
    if (this.x == 0)
    {
        return (this.y == 0) ? "0" : (Misc.FloatToText (this.y,10) + "i");
    }
    
    if (this.y == 0) return Misc.FloatToText (this.x,10);

    if (this.y < 0)
    {
        return "(" + Misc.FloatToText (this.x,10) + " - " + Misc.FloatToText (-this.y,10) + "i)";
    }

    return "(" + Misc.FloatToText (this.x, 10) + " + " + Misc.FloatToText (this.y, 10) + "i)";
}
//--------------------------------------------------------------------------------------------
// Multiply by a simple number (this number is truncated to an integer)
//--------------------------------------------------------------------------------------------
Complex.prototype.MultiplyFloat = function (f)
{    
    return new Complex (f * this.x, f * this.y);
}
//--------------------------------------------------------------------------------------------
// Multiply by a simple number (this number is truncated to an integer)
//--------------------------------------------------------------------------------------------
Complex.prototype.DivideFloat = function (f)
{    
    return new Complex (this.x / f, this.y / f);
}
//--------------------------------------------------------------------------------------------
// Multiply by a another big integer
//--------------------------------------------------------------------------------------------
Complex.prototype.Multiply = function (other)
{
    var x = this.x * other.x - this.y * other.y;
    var y = this.x * other.y + this.y * other.x;
    
    return new Complex (x, y);
}
//--------------------------------------------------------------------------------------------
// Returns the square of the current number
//--------------------------------------------------------------------------------------------
Complex.prototype.Squared = function ()
{
    var x = this.x * this.x - this.y * this.y;
    var y = 2 * this.x * this.y;
    
    return new Complex (x, y);
}
//--------------------------------------------------------------------------------------------
// Add a complex number
//--------------------------------------------------------------------------------------------
Complex.prototype.Add = function (other)
{
    var x = this.x + other.x;
    var y = this.y + other.y;
    
    return new Complex (x, y);
}
//--------------------------------------------------------------------------------------------
// Subtract a complex number
//--------------------------------------------------------------------------------------------
Complex.prototype.Subtract = function (other)
{    
    var x = this.x - other.x;
    var y = this.y - other.y;
    
    return new Complex (x, y);
}
//--------------------------------------------------------------------------------------------
// Add a simple number (this number is truncated to an integer)
//--------------------------------------------------------------------------------------------
Complex.prototype.AddFloat = function (f)
{    
    return new Complex (this.x + f, this.y);
}
//--------------------------------------------------------------------------------------------
// Add a simple number (this number is truncated to an integer)
//--------------------------------------------------------------------------------------------
Complex.prototype.SubtractFloat = function (f)
{    
    return new Complex (this.x - f, this.y);
}
//--------------------------------------------------------------------------------------------
// Subtracts this number from a float (f - this)
//--------------------------------------------------------------------------------------------
Complex.prototype.SubtractFromFloat = function (f)
{    
    return new Complex (f - this.x, -this.y);
}
//--------------------------------------------------------------------------------------------
// √(a + ib) = ± (√{[√(a2 + b2) + a]/2} + ib/|b| √{[√(a2 + b2) - a]/2})
//--------------------------------------------------------------------------------------------
Complex.prototype.SquareRoot = function (f)
{
    var z = Math.sqrt (this.MagnitudeSquared());
    var x = Math.sqrt ((z + this.x) / 2);
    var y = Math.sqrt ((z - this.x) / 2);
    
    if (this.y < 0) y = -y;
    
    return new Complex (x, y);
}
//--------------------------------------------------------------------------------------------
// Compare, returns -1, 0 or 1 for (first < second), (first == second) and (first > second)
// Doesn't really make sense for complex numbers but we need this for sorting
//--------------------------------------------------------------------------------------------
Complex.Compare = function (first, second)
{    
    if (first.x == second.x)
    {
        return (second.y == first.y) ? 0 : ((second.y > first.y) ? 1 : -1);
    }
    else
    {
        return (second.x > first.x) ? 1 : -1;
    }
}
//--------------------------------------------------------------------------------------------
// Distance Squared
//--------------------------------------------------------------------------------------------
Complex.DistanceSquared = function (first, second)
{    
    var dx = first.x - second.x;
    var dy = first.y - second.y;
    return dx * dx + dy * dy;
}
//--------------------------------------------------------------------------------------------
// Invert
//--------------------------------------------------------------------------------------------
Complex.prototype.Minus = function ()
{
    return new Complex (-this.x, -this.y);
}
//--------------------------------------------------------------------------------------------
// 
//--------------------------------------------------------------------------------------------
Complex.prototype.Transpose = function ()
{
    return new Complex (this.x, -this.y);
}
//--------------------------------------------------------------------------------------------
// The square of the magnitude
//--------------------------------------------------------------------------------------------
Complex.prototype.MagnitudeSquared = function ()
{
    return this.x * this.x + this.y * this.y;
}
//--------------------------------------------------------------------------------------------
// The magnitude
//--------------------------------------------------------------------------------------------
Complex.prototype.Magnitude = function ()
{
    return Math.sqrt (this.x * this.x + this.y * this.y)
}
//--------------------------------------------------------------------------------------------
// Divide by another complex number
//--------------------------------------------------------------------------------------------
Complex.prototype.Divide = function (other)
{
    var div = other.MagnitudeSquared ();

    if (div == 0)
    {
        return null;
    }
    
    return this.Multiply (other.Transpose ()).DivideFloat (div);
}
//--------------------------------------------------------------------------------------------
// Interpolate:
// Creates a value somewhere on the line joining c1 to c2, f is the interpolation factor
// f outside the range 0-1 will extrapolate.
//------------------------------------------------------------------------------
Complex.Interpolate = function (c1, c2, f)
{
    var x = (1 - f) * c1.x + f * c2.x;
    var y = (1 - f) * c1.y + f * c2.y;
    
    return new Complex (x, y);
}
//--------------------------------------------------------------------------------------------
Complex.prototype.Overwrite = function (x, y)
{
    this.x = x;
    this.y = y;
}
//--------------------------------------------------------------------------------------------
Complex.prototype.Copy = function (c)
{
    this.x = c.x;
    this.y = c.y;
}
//--------------------------------------------------------------------------------------------
Complex.prototype.IsEqual = function (other)
{
    return Complex.Compare (this, other) == 0;
}


Complex.prototype.Pow = function (n)
{
    // to do
}




