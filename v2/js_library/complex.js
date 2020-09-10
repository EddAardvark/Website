//-------------------------------------------------------------------------------------------------
// A complex number
// (c) John Whitehouse 2020
// www.eddaardvark.co.uk
//
// None of the methods in this class alter the instance so it is safe to reuse them rather then having
// to clone when assigning.
//-------------------------------------------------------------------------------------------------

Complex = function ()
{
}

//----------------------------------------------------------------------------------------------------------------
Complex.Initialise = function ()
{
}
//----------------------------------------------------------------------------------------------------------------
Complex = function (x, y)
{
    this.x = x;
    this.y = y;
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
    
    return null; // to do
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
// Compare, returns -1, 0 or 1 for (first < second), (first == second) and (first > second)
// Doesn't really make sense for complex numbers but we need this for sorting
//--------------------------------------------------------------------------------------------
Complex.Compare = function (first, second)
{    
    //to do
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
Complex.prototype.Pow = function (n)
{
    // to do
}




