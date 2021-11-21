
//-------------------------------------------------------------------------------------------------
// Implements a number of the form y^3 - 3nx^2 + 3n^2x + n^3, equivalent to (x+n)^3 - x^3
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
ContourWalker.FromInts = function (x, y)
{
    return ContourWalker.FromVLInts (VLInt.FromInt (x), VLInt.FromInt (y));
}
//-------------------------------------------------------------------------------------------------
ContourWalker.FromVLInts = function (x, y)
{       
    var ret = new ContourWalker ();
    var z = CubeSurfer.GetZ (x, y)

    ret.swap = VLInt.Compare (x, y) < 0;
    
    // use x > y;
    
    if (ret.swap)
    {
        ret.x = VLInt.FromVLInt (y);
        ret.y = VLInt.FromVLInt (x);
    }
    else
    {
        ret.x = VLInt.FromVLInt (x);
        ret.y = VLInt.FromVLInt (y);
    }
    
    ret.n = z.Subtract (ret.x);
    ret.cube = new BigCube.FromVLInt (ret.y);
    ret.subcube = new SubCube.FromVLInts (ret.x, ret.n);
    
    ret.value = ret.cube.cube.Subtract (ret.subcube.value);
    ret.walk = ret.WalkX;

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
        this.IncrementSub ();
    }
    else
    {
        this.IncrementCube ();
    }
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.DecrementSub = function ()
{
    this.subcube.DecrementX ();
    this.value = this.value.Add (this.subcube.dv); // Value = cube - sub, so add
    this.x.Decrement ();
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.IncrementSub = function ()
{
    this.value = this.value.Subtract (this.subcube.dv); // Value = cube - sub, so subtract
    this.subcube.IncrementX ();
    this.x.Increment ();
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.DecrementCube = function ()
{
    this.cube.Decrement ();
    this.value = this.value.Subtract (this.cube.dy);
    this.y.Decrement ();
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.IncrementCube = function ()
{
    this.value = this.value.Add (this.cube.dy);
    this.cube.Increment ();    
    this.y.Increment ();
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.Animate = function (n, interval, element)
{
    ContourWalker.Amimating = this;
    ContourWalker.AmimationElement = element;
    ContourWalker.AmimationStep = n;
    ContourWalker.timer = setInterval(ContourWalker.DoAnimate, interval);
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.StopAnimate = function ()
{
    ContourWalker.Amimating = null;
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.DoAnimate = function ()
{
    if (ContourWalker.Amimating)
    {
        ContourWalker.Amimating.ScrollTrack (ContourWalker.AmimationStep, ContourWalker.AmimationElement);
    }
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.CreateTrack = function (limit, img_element)
{
    this.contour = new Array (limit);
    this.min_v = VLInt.MakeZero ();
    this.max_v = VLInt.MakeZero ();

    this.FillContour (0, limit);
    
    this.DrawTrack (img_element);    
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.ScrollTrack = function (num, img_element)
{
    var width = this.contour.length;
    
    if (num > width/2) num = Math.floor (width/2);
    
    // Remove the old stuff
    
    this.contour = this.contour.slice (num);
    
    // Refill
    
    var x = this.contour.length;
    
    this.FillContour (x, width)
    this.DrawTrack (img_element);
}
//--------------------------------------------------------------------------------------------
ContourWalker.prototype.FillContour = function (x, width)
{
    while (x < width)
    {
        if (! this.contour [x])
        {
            this.contour [x] = {x:VLInt.FromVLInt (this.x), y:VLInt.FromVLInt (this.y), value:null, subv:null};
        }
        
        if (this.value.positive)
        {
            this.contour [x].value = VLInt.FromVLInt (this.value);
            
            Misc.Log (this.GetText (x));
            
            if (VLInt.Compare (this.value, this.max_v) > 0) this.max_v = this.value;
            
            this.IncrementSub ();
            ++x;
        }
        else
        {
            this.contour [x].subv = VLInt.FromVLInt (this.value);
            
            if (VLInt.Compare (this.value, this.min_v) < 0) this.min_v = this.value;

            this.IncrementCube ();
        }
    }
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.DrawTrack = function (img_element)
{
    var HEIGHT = 300;
    var width = this.contour.length;    
    var range = this.max_v.Subtract (this.min_v);
    var chelp = new CanvasHelp (width, HEIGHT);    
    var y0 = HEIGHT * VLInt.Ratio (this.max_v, range);
    
    chelp.SetBackground ("yellow");
    chelp.FillRect (0, 0, width, HEIGHT);

    for (var x = 0 ; x < width ; ++x)
    {
        if (this.contour [x].value != null)
        {
            var y = HEIGHT * (1 - VLInt.Ratio (this.contour [x].value.Subtract (this.min_v), range));
        
            chelp.SetForeground ("blue");
            chelp.DrawLine ([x,y0],[x,y]);
        }

        if (this.contour [x].subv != null)
        {
            var y = HEIGHT * (1 - VLInt.Ratio (this.contour [x].subv.Subtract (this.min_v), range));
            chelp.SetForeground ("red");
            chelp.DrawLine ([x,y0],[x,y]);
        }
    }
    
    chelp.SetForeground ("black");
    chelp.DrawLine ([0,y0],[width,y0]);
    img_element.src = chelp.canvas.toDataURL('image/png');
}
//--------------------------------------------------------------------------------------------
ContourWalker.prototype.HoverText = function (event)
{
    var x = event.offsetX;

    if (x >= this.contour.length) x = this.contour.length - 1;

    return this.GetText (x);
}
//--------------------------------------------------------------------------------------------
ContourWalker.prototype.GetText = function (x)
{
    var ret = Misc.Format ("N = {0}, X = {1}, Y = {2}", this.n, this.contour [x].x, this.contour [x].y);
    var z = this.contour [x].x.Add(this.n);

    if (this.contour [x].value != null)
    {
        ret += Misc.Format (", V = {0}", this.contour [x].value);
    }

    if (this.contour [x].subv != null)
    {
        ret += Misc.Format (", SV = {0}", this.contour [x].subv);
        ret += Misc.Format (": {0}^3 - {1}^3 - {2}^3 = {3}", z, this.contour [x].x, this.contour [x].y, this.contour [x].subv.Minus());
    }
    else
    {
        ret += Misc.Format (": {0}^3 + {1}^3 - {2}^3 = {3}", this.contour [x].x, this.contour [x].y, z, this.contour [x].value);
    }
    
    
    return ret;
}
//--------------------------------------------------------------------------------------------
ContourWalker.prototype.toString = function ()
{
    return Misc.Format ("Contour({0},{1},{2})={3}", this.s, this.c, this.n, this.value);
}     
//--------------------------------------------------------------------------------------------
ContourWalker.prototype.Verify = function (where)
{
    var x = this.s;
    var y = this.c;
    var z = x.Add (this.n);
    var zp = z.AddInt(1);
    
    var x3 = x.Cube ();
    var y3 = y.Cube ();
    var z3 = z.Cube ();
    var zp3 = zp.Cube ();
    
    var value = x3.Add(y3).Subtract(z3);
    
    if (value.toString () != this.value.toString ()) throw "ContourWalker value failed";
}

//--------------------------------------------------------------------------------------------
ContourWalker.prototype.XYZText = function ()
{
    var x = this.s;
    var y = this.c;
    var z = x.Add (this.n);
    
    return Misc.Format ("X = {0}, Y = {1}, Z = {2}", x, y, z);
}

//--------------------------------------------------------------------------------------------
ContourWalker.prototype.CubesText = function ()
{
    var x = this.s;
    var y = this.c;
    var z = x.Add (this.n);
    var zp = z.AddInt(1);
    
    var x3 = x.Cube ();
    var y3 = y.Cube ();
    var z3 = z.Cube ();
    var zp3 = zp.Cube ();
    
    var value = x3.Add(y3).Subtract(z3);
    
    return Misc.Format ("X^3 = {0}, Y^3 = {1}, Z^3 = {2}, Val = {3}", x3, y3, z3, value);
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

    // Walks a square

    conw.IncrementCube ();
    Misc.Log (conw);
    conw.Verify ();
    conw.IncrementCube ();
    Misc.Log (conw);
    conw.Verify ();
    conw.IncrementCube ();
    Misc.Log (conw);
    conw.Verify ();
    conw.DecrementSub ();
    Misc.Log (conw);
    conw.Verify ();
    conw.DecrementSub ();
    Misc.Log (conw);
    conw.Verify ();
    conw.DecrementSub ();
    Misc.Log (conw);
    conw.Verify ();
    conw.DecrementCube ();
    Misc.Log (conw);
    conw.Verify ();
    conw.DecrementCube ();
    Misc.Log (conw);
    conw.Verify ();
    conw.DecrementCube ();
    Misc.Log (conw);
    conw.Verify ();    
    conw.IncrementSub ();
    Misc.Log (conw);
    conw.Verify ();
    conw.IncrementSub ();
    Misc.Log (conw);
    conw.Verify ();
    conw.IncrementSub ();
    Misc.Log (conw);
    conw.Verify ();
    
    if (conw.value.toString () != x3y3mz3.toString()) throw ("ContourWalker.Test 2");
}

   
   