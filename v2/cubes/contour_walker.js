
//-------------------------------------------------------------------------------------------------
// Implements a number of the form y"3 - 3nx^2 + 3n^2x + n^3, equivalent to (x+n)^3 - x^3
//
// Uses VLIntegers to avoid being confined to small numbers
//
// This is a single contour in the map for X^3 + y^3 - z^3 = 0
//
// (c) John Whitehouse 2021
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

ContourWalker = function ()
{
}
//-------------------------------------------------------------------------------------------------
ContourWalker.FromInts = function (x, y, n, inc_x)
{
    return ContourWalker.FromVLInts (VLInt.FromInt (x), VLInt.FromInt (y), VLInt.FromInt (n), inc_x);
}
//-------------------------------------------------------------------------------------------------
ContourWalker.FromVLInts = function (x, y, n, inc_x)
{
    var ret = new ContourWalker ();
    
    if (inc_x)
    {
        ret.c = VLInt.FromVLInt (y);
        ret.s = VLInt.FromVLInt (x);
        ret.cube = new BigCube.FromVLInt (y);
        ret.subcube = new SubCube.FromVLInts (x, n);
    }
    else
    {
        ret.c = VLInt.FromVLInt (x);
        ret.s = VLInt.FromVLInt (y);
        ret.cube = new BigCube.FromVLInt (x);
        ret.subcube = new SubCube.FromVLInts (y, n);
    }
    
    ret.n = VLInt.FromVLInt (n);
    ret.value = ret.cube.cube.Subtract (ret.subcube.value);
    ret.subvalue = ret.value.Subtract (ret.cube.GetDecrement ());
    ret.walk = inc_x ? ret.WalkX : ret.WalkY;
    return ret;
}
//-------------------------------------------------------------------------------------------------
ContourWalker.Clone = function (other)
{  
    var ret = new ContourWalker ();
    
    ret.cube = other.cube.clone ();
    ret.subcube = other.subcube.clone ();
    ret.value = VLInt.FromVLInt (other.value);
    
    return ret;
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.Next = function ()
{
    if (this.value.positive)
    {
        this.IncrementCube ();
    }
    else
    {
        this.DecrementSub ();
    }
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.DecrementSub = function ()
{
    this.subcube.DecrementX ();
    this.value = this.value.Add (this.subcube.dv); // Value = cube - sub, so add
    this.subvalue = this.value.Add (this.subcube.dv); // Value = cube - sub, so add
    this.s.Decrement ();
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.IncrementSub = function ()
{
    this.value = this.value.Subtract (this.subcube.dv); // Value = cube - sub, so subtract
    this.subvalue = this.value.Subtract (this.subcube.dv); // Value = cube - sub, so subtract
    this.subcube.IncrementX ();
    this.s.Increment ();
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.DecrementCube = function ()
{
    this.cube.Decrement ();
    this.value = this.value.Subtract (this.cube.dy);
    this.subvalue = this.value.Subtract (this.cube.GetDecrement ());
    this.c.Decrement ();
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.IncrementCube = function ()
{
    this.subvalue = VLInt.FromVLInt (this.value);
    this.value = this.value.Add (this.cube.dy);
    this.cube.Increment ();    
    this.c.Increment ();
}
//--------------------------------------------------------------------------------------------
ContourWalker.prototype.toString = function ()
{
    return Misc.Format ("Contour({0},{1},{2})={3},{4}", this.x, this.y, this.n, this.value, this.subvalue);
}     
//--------------------------------------------------------------------------------------------
ContourWalker.prototype.Verify = function (where)
{
    // Value should be c^3 - (3ns^2 - 3sn^2 - n^3)
    
    var n2 = this.n.Multiply (this.n);
    var n3 = n2.Multiply (this.n);
    var c2 = this.c.Multiply (this.c);
    var c3 = c2.Multiply (this.c);
    var s2 = this.s.Multiply (this.s);
    var a = s2.Multiply (this.n).MultiplyInt(3);
    var b = n2.Multiply (this.s).MultiplyInt(3);
    var sv = a.Add(b).Add(n3);
    var v = c3.Subtract (sv);
    
    var cm = this.c.SubtractInt(1);
    var cm2 = this.cm.Multiply (this.cm);
    var cm3 = cm2.Multiply (this.cm);
    var subv = cm3.Subtract (sv);
    
    
    if (v.toString () != this.value.toString ()) throw "ContourWalker value failed";
    if (subv.toString () != this.subvalue.toString ()) throw "ContourWalker subvalue failed";
}
//--------------------------------------------------------------------------------------------
ContourWalker.Test = function ()
{
    var conw = ContourWalker.FromInts (5, 7, 3, true);
    
    var x = 5;
    var y = 7;
    var z = x+3;
    var x3y3mz3 = y*y*y + x*x*x - z*z*z;
    
    if (conw.value.toString () != x3y3mz3.toString()) throw ("ContourWalker.Test 1");
    
    conw.IncrementCube ();
    conw.Verify ();
    conw.IncrementCube ();
    conw.Verify ();
    conw.IncrementCube ();
    conw.Verify ();
    conw.DecrementSub ();
    conw.Verify ();
    conw.DecrementSub ();
    conw.Verify ();
    conw.DecrementSub ();
    conw.Verify ();
    conw.DecrementCube ();
    conw.Verify ();
    conw.DecrementCube ();
    conw.Verify ();
    conw.DecrementCube ();
    conw.Verify ();    
    conw.IncrementSub ();
    conw.Verify ();
    conw.IncrementSub ();
    conw.Verify ();
    conw.IncrementSub ();
    conw.Verify ();
    
    if (conw.value.toString () != x3y3mz3.toString()) throw ("ContourWalker.Test 2");
}


   
   