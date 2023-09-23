
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
    
    ret.root = VLInt.FromVLInt (n);
    
    var n2 = n.Multiply (n);
    var n3 = n2.Multiply (n);

    ret.value = n3;

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
    ret.value = VLInt.FromVLInt(this.value);
    
    return ret;
}
//-------------------------------------------------------------------------------------------------
BigCube.prototype.GetIncrement = function ()
{
    return this.dy;
}
//-------------------------------------------------------------------------------------------------
BigCube.prototype.GetDecrement = function ()
{
    var temp_ddy = this.ddy.SubtractInt (BigCube.dddy);
    return this.dy.Subtract (temp_ddy);
}
//-------------------------------------------------------------------------------------------------
BigCube.prototype.Increment = function ()
{    
    this.root.Increment ();
    this.value = this.value.Add (this.dy);
    this.dy = this.dy.Add (this.ddy);
    this.ddy = this.ddy.AddInt (BigCube.dddy);
}
//-------------------------------------------------------------------------------------------------
BigCube.prototype.Decrement = function ()
{
    this.ddy = this.ddy.SubtractInt (BigCube.dddy);
    this.dy = this.dy.Subtract (this.ddy);
    this.value = this.value.Subtract (this.dy);
    this.root.Decrement ();
}
//-------------------------------------------------------------------------------------------------
BigCube.prototype.DeltaPlus = function ()
{
    return this.dy;
}
//-------------------------------------------------------------------------------------------------
BigCube.prototype.GetNext = function ()
{    
    var ret = new BigCube ();
    
    ret.root = this.root.AddInt(1);
    ret.value = this.value.Add (this.dy);
    ret.dy = this.dy.Add (this.ddy);value
    ret.ddy = this.ddy.AddInt (BigCube.dddy);
    
    return ret;
}
//-------------------------------------------------------------------------------------------------
BigCube.prototype.GetPrevious = function ()
{    
    var ret = new BigCube ();
    
    ret.root = this.root.SubtractInt(1);
    ret.ddy = this.ddy.SubtractInt (BigCube.dddy);
    ret.dy = this.dy.Subtract (this.ddy);
    ret.value = this.value.Subtract (this.dy);
    
    return ret;
}//-------------------------------------------------------------------------------------------------
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
    return "BigCube(" + this.root + ") = " + this.value;
}
BigCube.prototype.FullText = function ()
{
    return Misc.Format ("BC: n = {0}, n^3 = {1}, dx = {2}, ddx = {3}, dddx = 6", this.root, this.value, this.dy, this.ddy);
}

//-------------------------------------------------------------------------------------------------
BigCube.prototype.Verify = function (where)
{
    // y = n^3;
    // y' = 3xn^2 + 3xn + 1
    // y'' = 6xn + 6
    // y''' = 6;
    
    var n = this.root;
    
    var n2 = n.Multiply (n);
    var n3 = n2.Multiply (n);

    var cube = n3;
    
    if (VLInt.Compare (cube, this.value) != 0)
    {
        throw where + " " + this.FullText ();
    }

    var dy = n2.Add (n);
    dy = dy.MultiplyInt (3);
    dy = dy.AddInt (1);
    
    if (VLInt.Compare (dy, this.dy) != 0)
    {
        throw where + " " + this.FullText ();
    }
    
    var ddy = n.AddInt (1);
    ddy = ddy.MultiplyInt (6);
    
    if (VLInt.Compare (ddy, this.ddy) != 0)
    {
        throw where + " " + this.FullText ();
    }
}
   
   