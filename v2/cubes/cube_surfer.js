
//-------------------------------------------------------------------------------------------------
// Implements a walker on the surface (x^3 + y^3 - z^3 = 0)
//
// Uses VLIntegers to avoid being confined to small numbers
//
// (c) John Whitehouse 2019
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

CubeSurfer = function (cw)
{
    this.cw = cw;
}

CubeSurfer.FromPosition = function (x, y)
{
    var z = CubeRoot.FromXY (x, y, 10);
    var x3 = x.Cube ();
    var y3 = y.Cube ();
    var z3 = z.Cube ();
    var bcx = BigCube.FromVLInt (x);
    var bcy = BigCube.FromVLInt (y);
    var bcz = BigCube.FromVLInt (z);

// A cube-walker straddle will the CW that has the smallest positive value, the straddle is the CW value and the value - dv

    var cw = CubeWalker.FromCubes (bcx, bcy, bcz);

    while (VLInt.Compare (cw.value, VLInt.ZERO) < 0)
    {
        cw.DecrementZ ();
    }
    
    var ret = new CubeSurfer (cw);
    
    ret.cw = cw;
    ret.cw.SetSubValue ();
    
    return ret;
}
//--------------------------------------------------------------------------------------------
// Increments X and adjusts z so that x^3+y^3-z^3 is the smallest possible value.
CubeSurfer.prototype.TrackX = function ()
{
    var ret = new CubeSurfer (CubeWalker.Clone (this.cw));
    
    ret.cw.IncrementX ();
    ret.FixZ ();
    return ret;
}
//--------------------------------------------------------------------------------------------
// Increments Y and adjusts z so that x^3+y^3-z^3 is the smallest possible value.
CubeSurfer.prototype.TrackY = function ()
{
    var ret = new CubeSurfer (CubeWalker.Clone (this.cw));
    
    ret.cw.IncrementY ();
    ret.FixZ ();
    return ret;
}
//--------------------------------------------------------------------------------------------
// Adjust Z to find the smallest positive value
CubeSurfer.prototype.FixZ = function ()
{
    if (this.cw.value.positive)
    {
        while (true)
        {
            this.cw.SetSubValue ();

            if (! this.cw.subvalue.positive)
            {
                break;
            }
            this.cw.IncrementZ ();
        }        
    }
    else
    {
        while (! this.cw.value.positive)
        {
            this.cw.DecrementZ ();
        }
        this.cw.SetSubValue ();
    }
}

CubeSurfer.SM_Z = 0;
CubeSurfer.SM_VALUE = 1;
CubeSurfer.SM_WALKER = 2;
CubeSurfer.SM_XYZ = 3;
CubeSurfer.SM_RANGE = 4;
CubeSurfer.SM_SUBVALUE = 5;
CubeSurfer.SM_INTERCEPT = 6;
CubeSurfer.SM_MOD9 = 7;
CubeSurfer.SM_F2 = 8;
CubeSurfer.SM_F3 = 9;
CubeSurfer.SM_F4 = 10;
CubeSurfer.SM_F5 = 11;

CubeSurfer.MODE_TEXT = [];

CubeSurfer.MODE_TEXT [CubeSurfer.SM_Z] =         "Z";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_VALUE] =     "x^3+y^3-z^3";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_WALKER] =    "Walker";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_XYZ] =       "(x, y, z)";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_RANGE] =     "Z Range";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_SUBVALUE] =  "Z below";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_INTERCEPT] = "Linear intersect";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_MOD9] =      "Modulo 9";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_F2] =        "Close to 1/2";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_F3] =        "Close to 1/3";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_F4] =        "Close to 1/4";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_F5] =        "Close to 1/5";
    
CubeSurfer.VALUE_TEXT = [];

CubeSurfer.VALUE_TEXT [CubeSurfer.SM_Z] =         function (x) { return x.cw.big_cz.root.toString(); }
CubeSurfer.VALUE_TEXT [CubeSurfer.SM_VALUE] =     function (x) { return x.cw.value.toString(); }
CubeSurfer.VALUE_TEXT [CubeSurfer.SM_WALKER] =    function (x) { return x.cw.toString(); }
CubeSurfer.VALUE_TEXT [CubeSurfer.SM_XYZ] =       function (x) { return Misc.Format ("({0},{1},{2})", x.cw.big_cx.root, x.cw.big_cy.root, x.cw.big_cz.root); }
CubeSurfer.VALUE_TEXT [CubeSurfer.SM_RANGE] =     function (x) { return x.cw.Range (); }
CubeSurfer.VALUE_TEXT [CubeSurfer.SM_SUBVALUE] =  function (x) { return x.cw.subvalue.toString(); }
CubeSurfer.VALUE_TEXT [CubeSurfer.SM_INTERCEPT] = function (x) { return Misc.FloatToText (x.cw.Intercept(), 8); }
CubeSurfer.VALUE_TEXT [CubeSurfer.SM_MOD9] =      function (x) { return x.cw.value.Remainder (9);}
CubeSurfer.VALUE_TEXT [CubeSurfer.SM_F2] =        function (x) { return Misc.FloatToText (x.cw.DistanceFrom ([1/2]), 8);}
CubeSurfer.VALUE_TEXT [CubeSurfer.SM_F3] =        function (x) { return Misc.FloatToText (x.cw.DistanceFrom ([1/3, 2/3]), 8);}
CubeSurfer.VALUE_TEXT [CubeSurfer.SM_F4] =        function (x) { return Misc.FloatToText (x.cw.DistanceFrom ([1/4, 2/4, 3/4]), 8);}
CubeSurfer.VALUE_TEXT [CubeSurfer.SM_F5] =        function (x) { return Misc.FloatToText (x.cw.DistanceFrom ([1/5, 2/5, 3/5, 4/5]), 8);}

//--------------------------------------------------------------------------------------------
CubeSurfer.prototype.DisplayText = function (mode)
{
    return CubeSurfer.VALUE_TEXT [mode] (this);
}
//--------------------------------------------------------------------------------------------
CubeSurfer.prototype.toString = function ()
{
    return "(" + this.cw.value + "," + this.subvalue + ")";
}
//--------------------------------------------------------------------------------------------
CubeSurfer.prototype.toString = function ()
{
    return "(" + this.cw.value + "," + this.cw.subvalue + ")";
}

//==========================================================================================================
//==========================================================================================================
CubeSurferGrid = function (n, x, y)
{
    this.size = n;
    this.cell_size = 32;
    this.grid = new Array (n * n);

    this.grid [0] = CubeSurfer.FromPosition (x, y);
    
    this.ExpandColumn (0);
    
    this.CalcLimits ();
}
//--------------------------------------------------------------------------------------------
CubeSurferGrid.prototype.CalcLimits = function ()
{
    var n = this.grid.length;
    
    this.vmax = VLInt.ZERO;
    this.smin = VLInt.ZERO;
    this.zmin = this.grid [0].cw.big_cz.root;
    
    this.zmin = this.grid [0].cw.big_cz.root;
    this.zmax = this.grid [n - 1].cw.big_cz.root;
    this.zrange = this.zmax.Subtract (this.zmin);
    
    this.rmin = this.grid [0].cw.Range();
    this.rmax = this.grid [n - 1].cw.Range();
    this.rrange = this.rmax.Subtract (this.rmin);
    
    for (var i = 0 ; i < n ; ++i)
    {
        var cw = this.grid[i].cw;
        
        if (VLInt.Compare (cw.value, this.vmax) > 0)
        {
            this.vmax = VLInt.FromVLInt (cw.value);
        }
        if (VLInt.Compare (cw.subvalue, this.smin) < 0)
        {
            this.smin = VLInt.FromVLInt (cw.subvalue);
        }
    }
}   
//--------------------------------------------------------------------------------------------
CubeSurferGrid.prototype.ExpandColumn = function (x)
{
    var idx = x * this.size;
    
    for (var i = 1 ; i < this.size ; ++i)
    {
        this.grid [idx+1] = this.grid [idx].TrackY ();
        ++ idx;
    }
    
    for (var i = 0 ; i < this.size ; ++i)
    {
        this.ExpandRow (i);
    }
}
    
CubeSurferGrid.prototype.ExpandRow = function (y)
{
    var idx = y;
    
    for (var i = 1 ; i < this.size ; ++i)
    {
        var nidx = idx + this.size;
        this.grid [nidx] = this.grid [idx].TrackX ();
        idx = nidx;
    }
}
    
//--------------------------------------------------------------------------------------------
CubeSurferGrid.prototype.ToTable = function (mode)
{
    var text = "<table>";
    
    for (var y = 0 ; y < this.size ; ++y)
    {
        text += "<tr>";
        for (var x = 0 ; x < this.size ; ++x)
        {
            var idx = y + this.size * x;
            
            text += "<td>";
            text += this.grid [idx].DisplayText (mode);
            text += "</td>";
        }
        text += "</tr>";
    }
    text += "</table>";
    return text;
}

//--------------------------------------------------------------------------------------------
CubeSurferGrid.prototype.DrawPattern = function (img_element, mode)
{
    var cell = this.cell_size;
    var width = this.size * cell;    
    var chelp = new CanvasHelp (width, width);

    for (var x = 0 ; x < this.size ; ++x)
    {
        for (var y = 0 ; y < this.size ; ++y)
        {
            var idx = y + this.size * x;
            var c = this.GetColour (idx, mode);
            
            chelp.SetBackground (c);
            chelp.FillRect (x * cell, y * cell, cell, cell);
        }
    }
    
    img_element.src = chelp.canvas.toDataURL('image/png');
}   
//--------------------------------------------------------------------------------------------
CubeSurferGrid.prototype.GetCellAt = function (xpos, ypos)
{
    var x = Math.floor (xpos / this.cell_size);
    var y = Math.floor (ypos / this.cell_size);
    var idx = y + this.size * x;
    return this.grid [idx];
}   
//--------------------------------------------------------------------------------------------
CubeSurferGrid.COLOUR = [];

CubeSurferGrid.COLOUR [CubeSurfer.SM_Z] = function (csg, surfer)
{
    var c1 = SVGColours.RgbFromName ("red");
    var c2 = SVGColours.RgbFromName ("blue");
    var dz = surfer.cw.big_cz.root.Subtract (csg.zmin);
    var f = VLInt.Ratio (dz, csg.zrange);
    
    return SVGColours.BlendRGB (c1, c2, f);
}

CubeSurferGrid.COLOUR [CubeSurfer.SM_VALUE] = function (csg, surfer)
{
    var c1 = SVGColours.RgbFromName ("blue");
    var c2 = SVGColours.RgbFromName ("white");
    var f = VLInt.Ratio (surfer.cw.value, csg.vmax);
    
    return SVGColours.BlendRGB (c1, c2, f);
}

CubeSurferGrid.COLOUR [CubeSurfer.SM_WALKER] = function (csg, surfer)
{
    return "white";
}
CubeSurferGrid.COLOUR [CubeSurfer.SM_XYZ] = function (csg, surfer)
{
    return "white";
}
CubeSurferGrid.COLOUR [CubeSurfer.SM_RANGE] = function (csg, surfer)
{
    var c1 = SVGColours.RgbFromName ("red");
    var c2 = SVGColours.RgbFromName ("blue");
    var dz = surfer.cw.Range().Subtract (csg.rmin);
    var f = VLInt.Ratio (dz, csg.rrange);
    
    return SVGColours.BlendRGB (c1, c2, f);
}
CubeSurferGrid.COLOUR [CubeSurfer.SM_SUBVALUE] =  function (csg, surfer)
{
    var c1 = SVGColours.RgbFromName ("red");
    var c2 = SVGColours.RgbFromName ("white");
    var f = VLInt.Ratio (surfer.cw.subvalue, csg.smin);
    
    return SVGColours.BlendRGB (c1, c2, f);
}
CubeSurferGrid.COLOUR [CubeSurfer.SM_INTERCEPT] = function (csg, surfer)
{
    var white = SVGColours.RgbFromName ("white");
    var r = surfer.cw.value.Subtract (surfer.cw.subvalue);
    var f = VLInt.Ratio (surfer.cw.value, r);
    
    if (f > 0.5)
    {
        var red = SVGColours.RgbFromName ("red");
        return SVGColours.BlendRGB (red, white, 2 * (f - 0.5));
    }
    
    var blue = SVGColours.RgbFromName ("blue");
    return SVGColours.BlendRGB (white, blue, 2 * f);
}

CubeSurferGrid.RAINBOW = ["red","orange","yellow","green","black","black","blue","indigo","violet"]; // no 4 or 5

CubeSurferGrid.COLOUR [CubeSurfer.SM_MOD9] = function (csg, surfer)
{
    var n = surfer.cw.value.Remainder (9);
    return CubeSurferGrid.RAINBOW [n];
}


CubeSurferGrid.COLOUR [CubeSurfer.SM_F2] = function (csg, surfer)
{
    var x = surfer.cw.DistanceFrom ([1/2]);
    
    if (x > 1/8) return "white";
    
    var white = SVGColours.RgbFromName ("white");
    var blue = SVGColours.RgbFromName ("blue");
    return SVGColours.BlendRGB (blue, white, 1 - 8 * x);
}
CubeSurferGrid.COLOUR [CubeSurfer.SM_F3] = function (csg, surfer)
{
    var x = surfer.cw.DistanceFrom ([1/3, 2/3]);
    
    if (x > 1/27) return "white";
    
    var white = SVGColours.RgbFromName ("white");
    var blue = SVGColours.RgbFromName ("blue");
    return SVGColours.BlendRGB (blue, white, 1 - 27 * x);
}
CubeSurferGrid.COLOUR [CubeSurfer.SM_F4] = function (csg, surfer)
{
    var x = surfer.cw.DistanceFrom ([1/4, 2/4, 3/4]);
    
    if (x > 1/64) return "white";
    
    var white = SVGColours.RgbFromName ("white");
    var blue = SVGColours.RgbFromName ("blue");
    return SVGColours.BlendRGB (blue, white, 1 - 64 * x);
}
CubeSurferGrid.COLOUR [CubeSurfer.SM_F5] = function (csg, surfer)
{
    var x = surfer.cw.DistanceFrom ([1/5, 2/5, 3/5, 4/5]);
    
    if (x > 1/125) return "white";
    
    var white = SVGColours.RgbFromName ("white");
    var blue = SVGColours.RgbFromName ("blue");
    return SVGColours.BlendRGB (blue, white, 1 - 125 * x);
}

//--------------------------------------------------------------------------------------------
CubeSurferGrid.prototype.GetColour = function (idx, mode)
{
    return CubeSurferGrid.COLOUR [mode] (this, this.grid [idx]);
}


    

   