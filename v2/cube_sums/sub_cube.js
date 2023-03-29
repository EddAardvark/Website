
//-------------------------------------------------------------------------------------------------
// Implements a number of the form 3nx^2 + 3n^2x + n^3, equivalent to (x+n)^3 - x^3
//
// Uses VLIntegers to avoid being confined to small numbers
//
// (c) John Whitehouse 2021
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

SubCube = function ()
{
}
//-------------------------------------------------------------------------------------------------
SubCube.FromInts = function (x, n)
{
    return SubCube.FromVLInts (VLInt.FromInt (x), VLInt.FromInt (n));
}
//-------------------------------------------------------------------------------------------------
SubCube.FromVLInts = function (x, contour)
{
    // n = contour
    // v = 3nx^2 + 3n^2x + n^3, equivalent to ax^2 + bx + c, where
    // a = 3n, b = 3n^2, c = n^3
    // v' = +3xn^2 + 3xn + 1
    // v'' = 6xn + 6
    
    var ret = new SubCube ();
    var n = VLInt.FromInt (contour);    
    var n2 = n.Multiply (n);
    
    ret.a = n.MultiplyInt (3);
    ret.b = n2.MultiplyInt (3);
    ret.c = n2.Multiply(n);
    ret.x = VLInt.FromVLInt (x);
    ret.n = VLInt.FromVLInt (n);

    ret.value = ret.CalculateValue ();
    ret.ax2 = ret.a.MultiplyInt(2);
    ret.a_plus_b = ret.a.Add(ret.b);
    
    ret.dv = ret.ax2.Multiply(ret.x).Add(ret.a_plus_b);
    ret.ddv = ret.ax2;
    
    return ret;
}
//-------------------------------------------------------------------------------------------------
SubCube.prototype.CalculateValue = function ()
{
    var temp = this.a.Multiply (this.x).Add(this.b);
    
    return temp.Multiply(this.x).Add(this.c);
}
//-------------------------------------------------------------------------------------------------
SubCube.Clone = function (other)
{
    return SubCube.FromVLInts (other.x, other.n);
}
//-------------------------------------------------------------------------------------------------
SubCube.prototype.Hop = function (hop)
{
    this.x = this.x.AddInt (hop);
    this.value = this.CalculateValue ();    
    this.dv = this.ax2.Multiply(this.x).Add(this.a).Add(this.a_plus_b);
}
//----------------------------------------------------------------------------------------------------------------
SubCube.prototype.DecrementX = function ()
{
    this.x.Decrement ();
    this.dv = this.dv.Subtract (this.ddv);
    this.value = this.value.Subtract (this.dv);
}
//----------------------------------------------------------------------------------------------------------------
SubCube.prototype.IncrementX = function ()
{
    this.x.Increment ();
    this.value = this.value.Add (this.dv);
    this.dv = this.dv.Add (this.ddv);
}
//--------------------------------------------------------------------------------------------
SubCube.prototype.toString = function ()
{
    return Misc.Format ("SC({0},{1})={2}", this.x, this.n, this.value);
}   
//--------------------------------------------------------------------------------------------
SubCube.prototype.LogFull = function (where)
{
    Misc.Log ("SC({0},{1})={2}", this.x, this.n, this.value);
    Misc.Log ("DV = {0}", this.dv);
    Misc.Log ("DDV = {0}", this.ddv);
}   
//--------------------------------------------------------------------------------------------
SubCube.prototype.Verify = function (where)
{
    var good = SubCube.FromVLInts (this.x, this.n);
    
    if (good.value.toString () != this.value.toString ())
        throw Misc.Format ("SubCube: value {0} != {1}", this.value, good.value);
    
    if (good.dv.toString () != this.dv.toString ())
        throw Misc.Format ("SubCube: Delta-v {0} != {1}", this.dv, good.dv);
    
    if (good.ddv.toString () != this.ddv.toString ())
        throw Misc.Format ("SubCube: Delta-Delta-v {0} != {1}", this.ddv, good.ddv);

    if (good.n2.toString () != this.n2.toString ())
        throw Misc.Format ("SubCube: N^2 {0} != {1}", this.n2, good.n2);

    if (good.n3.toString () != this.n3.toString ())
        throw Misc.Format ("SubCube: N^3 {0} != {1}", this.n3, good.n3);
}
//--------------------------------------------------------------------------------------------
SubCube.Test = function ()
{
    var sc = new SubCube.FromInts (1,1);
    if (sc.value.toString () != "7") throw ("SC(1,1) value");
    if (sc.dv.toString () != "12") throw ("SC(1,1) dv");
    if (sc.ddv.toString () != "6") throw ("SC(1,1) ddv");
    
    sc.IncrementX ();
    if (sc.value.toString () != "19") throw ("SC(1,1) inc1");
    
    sc.IncrementX ();
    if (sc.value.toString () != "37") throw ("SC(1,1) inc2");

    sc.IncrementX ();
    if (sc.value.toString () != "61") throw ("SC(1,1) inc3");

    sc.DecrementX ();
    if (sc.value.toString () != "37") throw ("SC(1,1) dec1");

    sc.DecrementX ();
    if (sc.value.toString () != "19") throw ("SC(1,1) dec2");
    
    sc.DecrementX ();
    if (sc.value.toString () != "7") throw ("SC(1,1) dec3");

    sc.DecrementX ();
    if (sc.value.toString () != "1") throw ("SC(1,1) dec4");
    
    // n = 4
    
    var sc = new SubCube.FromInts (1,4);
    
    
    if (sc.value.toString () != "124") throw ("SC(1,4) value");
        
    sc.IncrementX ();
    if (sc.value.toString () != "208") throw ("SC(1,4) inc1");
    
    sc.IncrementX ();
    if (sc.value.toString () != "316") throw ("SC(1,4) inc2");

    sc.IncrementX ();
    if (sc.value.toString () != "448") throw ("SC(1,4) inc3");

    sc.DecrementX ();
    if (sc.value.toString () != "316") throw ("SC(1,4) dec1");

    sc.DecrementX ();
    if (sc.value.toString () != "208") throw ("SC(1,4) dec2");
    
    sc.DecrementX ();
    if (sc.value.toString () != "124") throw ("SC(1,4) dec3");

    sc.DecrementX ();
    if (sc.value.toString () != "64") throw ("SC(1,4) dec4");
    
    
}


   
   