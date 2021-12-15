
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
    this.cmode = ContourWalker.RAINBOW;
    this.SetTrackingMode (ContourWalker.FULL);
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
        var t = x;
        x = y;
        y = t;
    }
    var n = z.Subtract (x);

    ret.cube = new BigCube.FromVLInt (y);
    ret.subcube = new SubCube.FromVLInts (x, n);
    ret.value = ret.cube.cube.Subtract (ret.subcube.value);

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

//-------------------------------------------------------------------------------------------------
ContourWalker.Initialise = function (img_element, text_element)
{
    ContourWalker.AmimationView = img_element;
    ContourWalker.AmimationText = text_element;
    ContourWalker.Results = new WalkingResults (1001);
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
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.IncrementSub = function ()
{
    this.value = this.value.Subtract (this.subcube.dv); // Value = cube - sub, so subtract
    this.subcube.IncrementX ();
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.DecrementCube = function ()
{
    this.cube.Decrement ();
    this.value = this.value.Subtract (this.cube.dy);
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.IncrementCube = function ()
{
    this.value = this.value.Add (this.cube.dy);
    this.cube.Increment ();
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.HopSub = function (hop)
{
    this.subcube.Hop (hop);
    
    this.value = this.cube.cube.Subtract (this.subcube.value);
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.Animate = function (n, interval)
{
    ContourWalker.Amimating = this;
    ContourWalker.AmimationStep = n;
    ContourWalker.timer = setInterval(ContourWalker.DoAnimate, interval);
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.SetTrackingMode = function (tm)
{
    this.tmode = tm;
    
    if (this.tmode == ContourWalker.FULL)
    {
        this.Tracker = this.FillContour;
    }
    else
    {
        this.Tracker = this.FillContour2;
    }
    
    this.min_v = VLInt.MakeZero ();
    this.max_v = VLInt.MakeZero ();
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.StopAnimate = function ()
{
    ContourWalker.Amimating = null;
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.ShowResults = function (element)
{
    element.innerHTML = ContourWalker.Results.GetAsTable ();
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
ContourWalker.prototype.CreateTrack = function (limit)
{
    this.contour = new Array (limit);
    this.hop_max = 0;
    this.min_v = VLInt.MakeZero ();
    this.max_v = VLInt.MakeZero ();
    this.UpdateContourChart (0, limit);
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.UpdateContourChart = function (start, limit)
{
    this.Tracker (start, limit);
    this.DrawTrack ();    
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.ScrollTrack = function (num)
{
    var width = this.contour.length;
    
    if (num > width/2) num = Math.floor (width/2);
    
    // Remove the old stuff
    
    this.contour = this.contour.slice (num);
    
    // Refill
    
    var x = this.contour.length;
    this.UpdateContourChart (x, width);
}
//--------------------------------------------------------------------------------------------
ContourWalker.prototype.FillContour = function (x, width)
{
    //var t0 = performance.now ();
    var n = 0;
    
    while (x < width)
    {
        if (! this.contour [x])
        {
            this.contour [x] = {x:VLInt.FromVLInt (this.subcube.x), y:VLInt.FromVLInt (this.cube.root), value:null, subv:null};
        }
        
        if (this.value.positive)
        {
            this.contour [x].value = VLInt.FromVLInt (this.value);
            
            if (VLInt.Compare (this.value, this.max_v) > 0) this.max_v = this.value;
            
            this.IncrementSub ();
            ++x;
            ++n;
        }
        else
        {
            this.contour [x].subv = VLInt.FromVLInt (this.value);
            
            if (VLInt.Compare (this.value, this.min_v) < 0) this.min_v = this.value;

            this.IncrementCube ();
        }
    }
    
    //var t1 = performance.now ();
    
    //Misc.Log ("Full: {0} values in {1} milliseconds", n, t1-t0);
}
//--------------------------------------------------------------------------------------------
ContourWalker.prototype.FillContour2 = function (x, width)
{        
    var prev_value = null;
    //var t0 = performance.now ();
    var steps = 0;
    var n = 0;
    var hop = 0;
    var l1 = new VLInt.FromInt (1000);
    var l2 = new VLInt.FromInt (-1000);
    
    while (x < width)
    {
        if (hop > 0)
        {
            this.HopSub (hop);
            n += hop;
            hop = 0;
            if (!this.value.positive)
                throw "ooops!";
            
        }
        if (this.value.positive)
        {
            prev_value = VLInt.FromVLInt (this.value);
            this.IncrementSub ();
            ++n;
        }
        else
        {
            var sub_value = VLInt.FromVLInt (this.value);
            
            if (prev_value)
            {
                if (VLInt.Compare (sub_value, this.min_v) < 0) this.min_v = sub_value;
                if (VLInt.Compare (prev_value, this.max_v) > 0) this.max_v = prev_value;
                
                if (VLInt.Compare (sub_value, l2) >= 0)
                {
                    var zval = this.subcube.x.Add (this.subcube.n);
                    var result = new WalkingResults.Result (this.subcube.x, this.cube.root, zval, sub_value);
                    ContourWalker.Results.Add (result);
                }
                
                if (VLInt.Compare (prev_value, l1) <= 0)
                {
                    var xval = this.subcube.x.SubtractInt (1);
                    var zval = xval.Add (this.subcube.n);
                    var result = new WalkingResults.Result (xval, this.cube.root, zval, prev_value);
                    ContourWalker.Results.Add (result);
                }
            
                this.contour [x] = {x:VLInt.FromVLInt (this.subcube.x), y:VLInt.FromVLInt (this.cube.root), value:prev_value, subv:sub_value};
                ++x;
                steps += n;
                if (n > this.hop_max) this.hop_max = n;
                hop = this.hop_max-3;
                n = 0;
            }

            this.IncrementCube ();
        }
    }
    
    //var t1 = performance.now ();
    //var tim = t1 - t0;
    //var rate = steps / tim;
    
    //Misc.Log ("Compact: {0} values in {1} milliseconds, hop = {2}, rate = {3}", steps, Misc.FloatToText(tim,3), this.hop_max, Math.floor(rate));
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.DrawTrack = function ()
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
            var c = ContourWalker.VCOLOUR [this.cmode] (this.contour [x]);
        
            chelp.SetForeground (c);
            chelp.DrawLine ([x,y0],[x,y]);
        }

        if (this.contour [x].subv != null)
        {
            var y = HEIGHT * (1 - VLInt.Ratio (this.contour [x].subv.Subtract (this.min_v), range));
            var c = ContourWalker.SCOLOUR [this.cmode] (this.contour [x]);
            
            chelp.SetForeground (c);
            chelp.DrawLine ([x,y0],[x,y]);
        }
    }
    
    chelp.SetForeground ("black");
    chelp.DrawLine ([0,y0],[width,y0]);
    ContourWalker.AmimationView.src = chelp.canvas.toDataURL('image/png');
    ContourWalker.AmimationText.innerHTML = this.GetText (0);
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
    var ret = Misc.Format ("N = {0}, X = {1}, Y = {2}", this.subcube.n, this.contour [x].x, this.contour [x].y);
    var z = this.contour [x].x.Add(this.subcube.n);

    if (this.contour [x].value != null)
    {
        ret += Misc.Format (", V = {0}", this.contour [x].value);
    }

    if (this.contour [x].subv != null)
    {
        ret += Misc.Format (", SV = {0}", this.contour [x].subv);
    }
    
    return ret;
} 
//--------------------------------------------------------------------------------------------
ContourWalker.NORMAL = 0
ContourWalker.RAINBOW = 1;
ContourWalker.FULL = 0;
ContourWalker.COMPACT = 1;

ContourWalker.RAINBOW_COLOURS = ["red","orange","yellow","green","black","black","blue","indigo","violet"]; // no 4 or 5

ContourWalker.VCOLOUR = [];
ContourWalker.SCOLOUR = [];

ContourWalker.VCOLOUR [ContourWalker.NORMAL] = function (contour)
{
    return "blue";
}
ContourWalker.VCOLOUR [ContourWalker.RAINBOW] = function (contour)
{
    return ContourWalker.RAINBOW_COLOURS[contour.value.Mod9 ()];
}
ContourWalker.SCOLOUR [ContourWalker.NORMAL] = function (contour)
{
    return "red";
}
ContourWalker.SCOLOUR [ContourWalker.RAINBOW] = function (contour)
{
    return ContourWalker.RAINBOW_COLOURS[contour.subv.Mod9 ()];
}

//--------------------------------------------------------------------------------------------
ContourWalker.prototype.toString = function ()
{
    return Misc.Format ("Contour({0},{1},{2})={3}", this.s, this.c, this.n, this.value);
}     
//--------------------------------------------------------------------------------------------
ContourWalker.prototype.Verify = function (where)
{
    this.subcube.Verify ();
    this.cube.Verify ();
    
    var x = this.subcube.x;
    var y = this.cube.root;
    var z = x.Add (this.subcube.n);
    
    var x3 = x.Cube ();
    var y3 = y.Cube ();
    var z3 = z.Cube ();
    
    var value = x3.Add(y3).Subtract(z3);
    var prefix = where ? (where + ": ") : "";
    
    if (value.toString () != this.value.toString ())
    {
        throw prefix + Misc.Format ("{0}^3 + {1}^3 - {2}^3 = {3}, not {4}", x, y, z, value, this.value);
    }
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

   
   