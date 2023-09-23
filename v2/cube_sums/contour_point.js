
//-------------------------------------------------------------------------------------------------
// Implements a number of the form y^3 - 3nx^2 + 3n^2x + n^3, equivalent to (x+n)^3 - x^3
//
// Uses VLIntegers to avoid being confined to small numbers
//
// This is a single point on the contour in the map for X^3 + y^3 - z^3 = 0
//
// (c) John Whitehouse 2021, 2022
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

ContourPoint = function ()
{
}

//-------------------------------------------------------------------------------------------------

ContourPoint.factor = Math.pow (2, 1/3) - 1;
ContourPoint.LIMIT = 1025;

ContourPoint.max_target = new VLInt.FromInt (ContourPoint.LIMIT);
ContourPoint.min_target = new VLInt.FromInt (-ContourPoint.LIMIT);

//-------------------------------------------------------------------------------------------------
ContourPoint.FromInts = function (x, y)
{
    return ContourPoint.FromVLInts (VLInt.FromInt (x), VLInt.FromInt (y));
}
//-------------------------------------------------------------------------------------------------
ContourPoint.FromVLInts = function (x, y)
{       
    var ret = new ContourPoint ();
    var z = CubeSurfer.GetZ (x, y)

    ret.swap = VLInt.Compare (x, y) < 0;
    
    // use x > y;
    
    if (ret.swap)
    {
        var t = x;
        x = y;
        y = t;
    }
    var n = z.Subtract (x);

    ret.cube = new BigCube.FromVLInt (y);
    ret.subcube = new SubCube.FromVLInts (x, n);
    ret.value = ret.cube.value.Subtract (ret.subcube.value);
    ret.n = n.GetInt ();
    return ret;
}
//-------------------------------------------------------------------------------------------------
ContourPoint.FromContour = function (contour)
{       
    var ret = new ContourPoint ();
    var x = VLInt.FromInt (Math.ceil (contour / ContourPoint.factor));
    var y = VLInt.FromVLInt (x);
    
    
    ret.n = contour;
    ret.cube = new BigCube.FromVLInt (y);
    ret.subcube = new SubCube.FromVLInts (x, contour);
    ret.value = ret.cube.value.Subtract (ret.subcube.value);

    return ret;
}
//-------------------------------------------------------------------------------------------------
ContourPoint.Clone = function (other)
{  
    var ret = new ContourPoint ();
    
    ret.cube = other.cube.Clone ();
    ret.subcube = SubCube.Clone (other.subcube);
    ret.value = VLInt.FromVLInt (other.value);
    ret.n = other.n;
    
    return ret;
}
//-------------------------------------------------------------------------------------------------
ContourPoint.prototype.GetNextX = function ()
{
    var ret = ContourPoint.Clone (this);
    ret.IncrementSub ();
    return ret;
}
//-------------------------------------------------------------------------------------------------
ContourPoint.prototype.GetNextY = function ()
{
    var ret = ContourPoint.Clone (this);
    ret.IncrementCube ();
    return ret;
}
//-------------------------------------------------------------------------------------------------
ContourPoint.prototype.GetPreviousX = function ()
{
    var ret = ContourPoint.Clone (this);
    ret.DecrementSub ();
    return ret;
}
//-------------------------------------------------------------------------------------------------
ContourPoint.prototype.GetPreviousY = function ()
{
    var ret = ContourPoint.Clone (this);
    ret.DecrementCube ();
    return ret;
}
//----------------------------------------------------------------------------------------------------------------
ContourPoint.prototype.DecrementSub = function ()
{
    this.subcube.DecrementX ();
    this.value = this.value.Add (this.subcube.dv); // Value = cube - sub, so add
}
//----------------------------------------------------------------------------------------------------------------
ContourPoint.prototype.IncrementSub = function ()
{
    this.value = this.value.Subtract (this.subcube.dv); // Value = cube - sub, so subtract
    this.subcube.IncrementX ();
}
//----------------------------------------------------------------------------------------------------------------
ContourPoint.prototype.DecrementCube = function ()
{
    this.cube.Decrement ();
    this.value = this.value.Subtract (this.cube.dy);
}
//----------------------------------------------------------------------------------------------------------------
ContourPoint.prototype.IncrementCube = function ()
{
    this.value = this.value.Add (this.cube.dy);
    this.cube.Increment ();
}
//----------------------------------------------------------------------------------------------------------------
ContourPoint.prototype.HopSub = function (hop)
{
    this.subcube.Hop (hop);
    
    this.value = this.cube.value.Subtract (this.subcube.value);
}
//--------------------------------------------------------------------------------------------
ContourPoint.prototype.TestValue = function ()
{           
    if (this.value.positive)
    {
        if (VLInt.Compare (this.value, ContourPoint.max_target) <= 0)
        {
            return true;
        }
    }          
    else if (VLInt.Compare (this.value, ContourPoint.min_target) >= 0)
    {
        return true;
    }
    return false;
}
//--------------------------------------------------------------------------------------------
ContourPoint.prototype.MakeResult = function ()
{         
    var zval = this.subcube.x.Add (this.subcube.n);
    
    return new WalkingResults.Result(this.subcube.x, this.cube.root, zval, this.value);
}
//--------------------------------------------------------------------------------------------
ContourPoint.prototype.PositionText = function ()
{
    return Misc.Format ("({0}, {1})", this.subcube.x, this.cube.root);
} 
//--------------------------------------------------------------------------------------------
ContourPoint.prototype.HoverText = function ()
{
    return Misc.Format ("N = {0}, X = {1}, Y = {2}, V = {3}", this.subcube.n, this.subcube.x, this.cube.root, this.value);
} 
//--------------------------------------------------------------------------------------------
ContourPoint.prototype.toString = function ()
{
    return Misc.Format ("Contour Point ({0},{1},{2}) = {3}", this.n, this.subcube.x, this.cube.root, this.value);
}  

