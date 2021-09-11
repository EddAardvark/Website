
//-------------------------------------------------------------------------------------------------
// Implements a big cube using big integers
// Implements increment and decrement operators using decrements to avoid big multiplications.
//
// (c) John Whitehouse 2013 - 2019
// www.eddaardvark.co.uk
//
// None of the methods in this class alter the instance so it is safe to reuse them rather then having
// to clone when assigning.
//-------------------------------------------------------------------------------------------------

BigCube = function ()
{
}
//-------------------------------------------------------------------------------------------------
   
BigCube.dddy = 6;
 
//-------------------------------------------------------------------------------------------------
BigCube.FromInt = function (n)
{
    n = VLInt.FromInt (n);

    return BigCube.FromVLInt (n);
}
//-------------------------------------------------------------------------------------------------
BigCube.FromVLInt = function (n)
{
    // y = n^3;
    // y' = 3xn^2 + 3xn + 1
    // y'' = 6xn + 6
    // y''' = 6;
    
    var ret = new BigCube ();
    
    ret.root = n;
    
    var n2 = n.Multiply (n);
    var n3 = n2.Multiply (n);

    ret.cube = n3;

    ret.dy = n2.Add (n);
    ret.dy = ret.dy.MultiplyInt (3);
    ret.dy = ret.dy.AddInt (1);

    ret.ddy = n.AddInt (1);
    ret.ddy = ret.ddy.MultiplyInt (6);
    
    return ret;
}
//-------------------------------------------------------------------------------------------------
BigCube.prototype.Clone = function ()
{    
    var ret = new BigCube ();
    
    ret.root = VLInt.FromVLInt(this.root);
    ret.dy = VLInt.FromVLInt(this.dy);
    ret.ddy = VLInt.FromVLInt(this.ddy);
    ret.cube = VLInt.FromVLInt(this.cube);
    
    return ret;
}
//-------------------------------------------------------------------------------------------------
BigCube.prototype.GetIncrement = function ()
{
    var ret = new BigCube ();
    
    ret.root = this.root.AddInt (1);
    ret.cube = this.cube.Add (this.dy);
    ret.dy = this.dy.Add (this.ddy);
    ret.ddy = this.ddy.AddInt (BigCube.dddy);
    
    return ret;
}
//-------------------------------------------------------------------------------------------------
BigCube.prototype.GetDecrement = function ()
{
    var ret = new BigCube ();

    ret.ddy = this.ddy.SubtractInt (BigCube.dddy);
    ret.dy = this.dy.Subtract (ret.ddy);
    ret.cube = this.cube.Subtract (ret.dy);
    ret.root = this.root.SubtractInt (1);
    
    return ret;
}
//-------------------------------------------------------------------------------------------------
BigCube.prototype.DeltaPlus = function ()
{
    return this.dy;
}
//-------------------------------------------------------------------------------------------------
BigCube.prototype.DeltaMinus = function ()
{
    var ret = this.ddy.SubtractInt (BigCube.dddy);

    ret = this.dy.Subtract (ret);
    
    return ret.Minus();
}
//-------------------------------------------------------------------------------------------------
BigCube.FromString = function (str)
{
    n = VLInt.FromString (str);

    return BigCube.FromVLInt (n);
}
//--------------------------------------------------------------------------------------------
BigCube.prototype.IsGreaterThan = function (other)
{
    return this.root.IsGreaterThan(other.root);
}
//--------------------------------------------------------------------------------------------
BigCube.prototype.IsGreaterThanOrEqualTo = function (other)
{
    return this.root.IsGreaterThanOrEqualTo(other.root);
}
//--------------------------------------------------------------------------------------------
BigCube.prototype.IsLessThan = function (other)
{
    return this.root.IsLessThan(other.root);
}
//--------------------------------------------------------------------------------------------
BigCube.prototype.IsLessThanOrEqualTo = function (other)
{
    return this.root.IsLessThanOrEqualTo(other.root);
}
//--------------------------------------------------------------------------------------------
BigCube.prototype.IsEqualTo = function (other)
{
    return this.root.IsEqualTo(other.root);
}
//--------------------------------------------------------------------------------------------
BigCube.prototype.IsNotEqualTo = function (other)
{
    return this.root.IsNotEqualTo(other.root);
}
//--------------------------------------------------------------------------------------------
BigCube.prototype.IsZero = function ()
{
    return this.root.IsZero();
}
//--------------------------------------------------------------------------------------------
BigCube.prototype.toString = function ()
{
    return "BigCube(" + this.root + ") = " + this.cube;
}
   
   