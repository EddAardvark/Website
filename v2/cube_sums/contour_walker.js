
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
    this.SetTrackingMode (ContourWalker.TM_ONLINE);
    this.SetColourMode (ContourWalker.CM_RED_BLUE);
    this.SetPlotMode (ContourWalker.PM_NORMAL);
}

ContourWalker.background = "Bisque";
ContourWalker.zero_line = "Black";
ContourWalker.major_grid_line = "Chocolate";
ContourWalker.minor_grid_line = "SandyBrown";

ContourWalker.CM_RED_BLUE = 0
ContourWalker.CM_RAINBOW = 1;
ContourWalker.CM_SOLID = 2;

ContourWalker.PM_NORMAL = 0;
ContourWalker.PM_LOG = 1;

ContourWalker.TM_ONLINE = 0;
ContourWalker.TM_FASTONLINE = 1;
ContourWalker.TM_NO_DRAW = 2;

ContourWalker.TimeOut = 100;
ContourWalker.WIDTH = 1001;

ContourWalker.RAINBOW_COLOURS = ["red","orange","yellow","green","black","black","blue","indigo","violet"]; // no 4 or 5

//-------------------------------------------------------------------------------------------------
ContourWalker.Initialise = function (img_element, text_element, latest_element)
{
    ContourWalker.AmimationView = img_element;
    ContourWalker.AmimationText = text_element;
    ContourWalker.LastFound = latest_element;
    ContourWalker.ClearResults ();
}
//-------------------------------------------------------------------------------------------------
ContourWalker.ClearResults = function ()
{
    ContourWalker.Results = new WalkingResults (ContourWalker.WIDTH);
}
//-------------------------------------------------------------------------------------------------
ContourWalker.prototype.SetCurrent = function (current)
{
    this.current = current;
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.Animate = function (n, interval)
{
    ContourWalker.Amimating = this;
    ContourWalker.TimeOut = Math.floor (1000/interval);
    ContourWalker.AmimationStep = n;
    ContourWalker.timer = setInterval(ContourWalker.DoAnimate, interval);
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.SetTrackingMode = function (tm)
{
    this.tmode = tm;
    
    if (this.tmode == ContourWalker.TM_ONLINE)
    {
        this.Tracker = this.FillOnLine;
    }
    else if (this.tmode == ContourWalker.TM_FASTONLINE)
    {
        this.Tracker = this.FillFastOnLine;
    }
    else if (this.tmode == ContourWalker.TM_NO_DRAW)
    {
        this.Tracker = this.FillNoDraw;
    }
    
    this.min_v = VLInt.MakeZero ();
    this.max_v = VLInt.MakeZero ();
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.SetColourMode = function (cm)
{
    this.cmode = cm;
    this.TryDraw ();
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.SetPlotMode = function (pm)
{
    this.pmode = pm;
    
    if (this.pmode == ContourWalker.PM_NORMAL)
    {
        this.Draw = this.DrawTrackValues;
    }
    else
    {
        this.Draw = this.DrawTrackLog;
    }
    this.TryDraw ();
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.TryDraw = function ()
{
    if (this.Draw && this.contour && this.contour [0])
    {
        this.Draw ();
    }
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
ContourWalker.prototype.CreateTrack = function ()
{
    if (! this.current)
    {
        throw "Can't track contour without a current point";
    }
    this.contour = new Array (ContourWalker.WIDTH);
    this.hop_max = 0;
    this.hop = 0;
    this.cross = null;
    this.min_v = VLInt.MakeZero ();
    this.max_v = VLInt.MakeZero ();
    this.Tracker (0, ContourWalker.WIDTH);

    if (this.tmode != ContourWalker.TM_NO_DRAW)
    {
        this.Draw ();
    }
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.ScrollTrack = function (num)
{
    if (this.tmode == ContourWalker.TM_NO_DRAW)
    {
        var t0 = performance.now();
        do
        {
            this.Tracker (0, 500);
            var t1 = performance.now();
        }
        while (t1 - t0 < ContourWalker.TimeOut);
        
        ContourWalker.AmimationText.innerHTML = this.current.toString ();
    }
    else
    {
        var target = ContourWalker.WIDTH - num;
        
        if (target < 10) target = 10;
    
    // Remove the old stuff
    
        this.contour = this.contour.slice (-target);
    
    // Refill
    
        var x = this.contour.length;        
        this.Tracker (x, ContourWalker.WIDTH);
        this.Draw ();
    }
}
//--------------------------------------------------------------------------------------------
ContourWalker.prototype.TestValue = function (v)
{           
    if (v.TestValue ())
    {
        ContourWalker.SaveResult (v.MakeResult ());
    }
}
//--------------------------------------------------------------------------------------------
ContourWalker.prototype.FillOnLine = function (x, width)
{
    var n = 0;

    while (x < width)
    {
        this.TestValue (this.current);
        
        var v1 = this.current.GetNextX ();
        var v2 = v1.GetNextY ();
        
        var c = VLInt.CompareVector (v1.value.value, v2.value.value);
        
        if (c > 0)
        {
            if (VLInt.Compare (v2.value, this.max_v) > 0) this.max_v = v2.value;
            this.current = v2;
        }
        else
        {
            if (VLInt.Compare (v1.value, this.min_v) < 0) this.min_v = v1.value;
            this.current = v1;
        }
        
        this.contour [x] = this.current;

        ++x;
    }
}
//--------------------------------------------------------------------------------------------
ContourWalker.prototype.FillFastOnLine = function (x, width)
{
    var dec = 0;
    
    while (x < width)
    {
        if (this.hop >= 2)
        {
            this.current.HopSub (this.hop);
            this.current.IncrementCube ();
            this.hop = 0;

            while (!this.current.value.positive)
            {
                this.current.DecrementSub ();
                Misc.Log ("Overshot, Dec = {0}", ++dec);
            }
        }
        
        var v1 = this.current.GetNextX ();
        var v2 = v1.GetNextY ();
        var prev = this.current;
        
        var c = VLInt.CompareVector (v1.value.value, v2.value.value);
            
        this.current = (c > 0) ? v2 : v1;
        
        // Check for crossing, positive to negative
        
        if (prev.value.positive && ! this.current.value.positive)
        {
            this.contour [x++] = prev;            
            this.contour [x++] = ContourPoint.Clone (this.current);

            if (VLInt.Compare (prev.value, this.max_v) > 0) this.max_v = prev.value;
            if (VLInt.Compare (this.current.value, this.min_v) < 0) this.min_v = this.current.value;
            
            this.TestValue (prev);
            this.TestValue (this.current);
            
            var delta = (this.cross != null) ? (prev.subcube.x.Subtract(this.cross)) : null;
            this.cross = VLInt.FromVLInt (prev.subcube.x);
            delta = (delta == null) ? 0 : (delta.ToInt ());
            if (delta > this.hop_max) this.hop_max = delta;
            this.hop = this.hop_max - 2;
        }
    }
}
//--------------------------------------------------------------------------------------------
ContourWalker.prototype.FillNoDraw = function (x, width)
{
    var dec = 0;
    
    while (x < width)
    {
        if (this.hop >= 2)
        {
            this.current.HopSub (this.hop);
            this.current.IncrementCube ();
            this.hop = 0;

            while (!this.current.value.positive)
            {
                this.current.DecrementSub ();
                Misc.Log ("Overshot, Dec = {0}", ++dec);
            }
        }
        
        var v1 = this.current.GetNextX ();
        var v2 = v1.GetNextY ();
        var prev = this.current;
        
        var c = VLInt.CompareVector (v1.value.value, v2.value.value);
            
        this.current = (c > 0) ? v2 : v1;
        
        // Check for crossing, positive to negative
        
        if (prev.value.positive && ! this.current.value.positive)
        {            
            this.TestValue (prev);
            this.TestValue (this.current);
            
            var delta = (this.cross != null) ? (prev.subcube.x.Subtract(this.cross)) : null;
            this.cross = VLInt.FromVLInt (prev.subcube.x);
            delta = (delta == null) ? 0 : (delta.ToInt ());
            if (delta > this.hop_max) this.hop_max = delta;
            this.hop = this.hop_max - 2;
        }
        ++x;
    }
}
//--------------------------------------------------------------------------------------------
ContourWalker.prototype.FillNoDrawX = function (x, width)
{
    // this version doesn't record any intermediate values.
        
    while (x < width)
    {
        if (this.value.positive)
        {
            if (VLInt.Compare (this.value, ContourWalker.max_target) <= 0)
            {
                var zval = this.subcube.x.Add (this.subcube.n);
                ContourWalker.SaveResult (this.subcube.x, this.cube.root, zval, this.value);
            }
        }          
        else if (VLInt.Compare (this.value, ContourWalker.min_target) >= 0)
        {
            var zval = this.subcube.x.Add (this.subcube.n);
            ContourWalker.SaveResult (this.subcube.x, this.cube.root, zval, this.value);
        }

        if (this.hop > 1)
        {
            this.HopSub (this.hop);
            this.IncrementCube ();
            this.hop = 0;

            if (!this.value.positive)
                throw "ooops!"; 
        }

        var v1 = this.value.Subtract (this.subcube.dv);
        var v2 = this.value.Add (this.cube.dy);

        if (VLInt.CompareVector (v1.value, v2.value) > 0)
        {
            this.IncrementCube ();
        }
        else
        {
            if (! v1.positive && this.value.positive)
            {
                var delta = (this.cross != null) ? (this.subcube.x.Subtract(this.cross)) : null;
                this.cross = VLInt.FromVLInt (this.subcube.x);
                this.hop = (delta == null) ? 0 : (delta.ToInt ());
                if (this.hop > this.hop_max) this.hop_max = this.hop;
                this.hop = this.hop - 2;
            }

            var prev = this.value;
            this.IncrementSub ();
        }

        var v = VLInt.FromVLInt (this.value);

        if (! v.positive && VLInt.Compare (v, this.min_v) < 0)
        {
            this.min_v = v;
        }

        if (v.positive && VLInt.Compare (v, this.max_v) > 0)
        {
            this.max_v = v;
        }
        
        ++x;
    }
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.SaveResult = function (result)
{
    ContourWalker.Results.Add (result);
    ContourWalker.LastFound.innerHTML = Misc.Format ("{0}, {1}", ContourWalker.Results.count, result);
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.DrawTrackValues = function ()
{
    var HEIGHT = 300;
    var width = this.contour.length;    
    var range = this.max_v.Subtract (this.min_v);
    var chelp = new CanvasHelp (width, HEIGHT);    
    var y0 = HEIGHT * VLInt.Ratio (this.max_v, range);
    
    chelp.SetBackground (ContourWalker.background);
    chelp.FillRect (0, 0, width, HEIGHT);

    for (var x = 0 ; x < width ; ++x)
    {
        if (this.contour [x].value != null)
        {            
            Misc.Log ("X {0} Y {1} V {2}", this.contour [x].subcube.x, this.contour [x].cube.root, this.contour [x].value);
            var y = HEIGHT * (1 - VLInt.Ratio (this.contour [x].value.Subtract (this.min_v), range));
            var c = ContourWalker.VCOLOUR [this.cmode] (this.contour [x]);
        
            chelp.SetForeground (c);
            chelp.DrawLine ([x,y0],[x,y]);     
        }
    }
    
    chelp.SetForeground (ContourWalker.zero_line);
    chelp.DrawLine ([0,y0],[width,y0]);
    ContourWalker.AmimationView.src = chelp.canvas.toDataURL('image/png');
    ContourWalker.AmimationText.innerHTML = this.current.toString ();
}
//----------------------------------------------------------------------------------------------------------------
ContourWalker.prototype.DrawTrackLog = function ()
{
    var HEIGHT = 300;
    var width = this.contour.length;
    var maxval = Math.ceil(this.max_v.Log10());
    var range = maxval;
    var chelp = new CanvasHelp (width, HEIGHT); 
    var y0 = HEIGHT;

    chelp.SetBackground (ContourWalker.background);
    chelp.FillRect (0, 0, width, HEIGHT);

    // major grid lines on thousands, millions, billions, ...
    
    var yc = 0;
    while (yc < maxval)
    {
        var y1 = HEIGHT * (1 - yc / maxval);
            
        chelp.SetForeground ((yc % 3 == 0) ? ContourWalker.major_grid_line : ContourWalker.minor_grid_line);
        chelp.DrawLine ([0,y1],[width,y1]);

        ++yc;
    }
    
    var y0 =  HEIGHT * (1 - (this.contour [0].value.Log10 ()) / maxval);

    for (var x = 1 ; x < width ; ++x)
    {
        var y1 =  HEIGHT * (1 - (this.contour [x].value.Log10 ()) / maxval);        
        var c = ContourWalker.VCOLOUR [this.cmode] (this.contour [x]);
        chelp.SetForeground (c);
        chelp.DrawLine ([x-1,y0],[x,y1]);
        y0 = y1;
    }
    
    ContourWalker.AmimationView.src = chelp.canvas.toDataURL('image/png');
    ContourWalker.AmimationText.innerHTML = this.current.toString ();
}
//--------------------------------------------------------------------------------------------
ContourWalker.prototype.HoverText = function (event)
{
    var x = event.offsetX;

    if (x >= this.contour.length) x = this.contour.length - 1;
    if (x < 0) x = 0;
    
    return this.contour [x].HoverText ();
}
//--------------------------------------------------------------------------------------------

ContourWalker.VCOLOUR = [];
ContourWalker.VCOLOUR [ContourWalker.CM_RED_BLUE] = function (contour)
{
    return contour.value.positive ? "blue" : "red";
}
ContourWalker.VCOLOUR [ContourWalker.CM_RAINBOW] = function (contour)
{
    return ContourWalker.RAINBOW_COLOURS[contour.value.Mod9 ()];
}
ContourWalker.VCOLOUR [ContourWalker.CM_SOLID] = function (contour)
{
    return "blue";
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

   
   