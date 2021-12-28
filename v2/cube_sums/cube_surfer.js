
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
//-------------------------------------------------------------------------------------------------
CubeSurfer.Initialise = function ()
{
    CubeSurferGrid.red = SVGColours.RgbFromName ("red");
    CubeSurferGrid.blue = SVGColours.RgbFromName ("blue");
    CubeSurferGrid.black = SVGColours.RgbFromName ("black");
    CubeSurferGrid.white = SVGColours.RgbFromName ("white");
}
//-------------------------------------------------------------------------------------------------
CubeSurfer.FromPosition = function (x, y)
{    
    var bcx = BigCube.FromVLInt (x);
    var bcy = BigCube.FromVLInt (y);
    var v = bcx.cube.Add (bcy.cube);
    var z = v.CubeRoot ();
    var bcz = BigCube.FromVLInt (z);

// A cube-walker straddle has the smallest positive value, the largest negative sub-value

    var cw = CubeWalker.FromCubes (bcx, bcy, bcz);    
    var ret = new CubeSurfer (cw);
    
    ret.cw = cw;
    ret.cw.SetSubValue ();
    ret.cw.MoveToSurface ();
    
    return ret;
}
//-------------------------------------------------------------------------------------------------
CubeSurfer.GetZ = function (x, y)
{
    var cs = CubeSurfer.FromPosition (x, y);

    return cs.cw.big_cz.root;
}
//--------------------------------------------------------------------------------------------
// Increments X and adjusts z so that x^3+y^3-z^3 is the smallest possible value.
CubeSurfer.prototype.TrackX = function ()
{
    var ret = new CubeSurfer (CubeWalker.Clone (this.cw));
    
    ret.cw.IncrementX ();
    ret.cw.FixZ ();
    
    return ret;
}
//--------------------------------------------------------------------------------------------
// Increments Y and adjusts z so that x^3+y^3-z^3 is the smallest possible value.
CubeSurfer.prototype.TrackY = function ()
{    
    var ret = new CubeSurfer (CubeWalker.Clone (this.cw));
    
    ret.cw.IncrementY ();
    ret.cw.FixZ ();
    
    return ret;
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
CubeSurfer.SM_N = 12;

CubeSurfer.MODE_TEXT = [];

CubeSurfer.MODE_TEXT [CubeSurfer.SM_Z] =         "Zv (max z where x^3+y^3-z^3>0)";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_VALUE] =     "V=x^3+y^3-Zv^3";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_WALKER] =    "Cube Walker";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_XYZ] =       "(x, y, z)";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_RANGE] =     "V-S=(x^3+y^3-Zv^3)-(x^3+y^3-(Zv+1)^3)=(Zv+1)^3-Zv^3=3Zv^2+3Zv+1";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_SUBVALUE] =  "S=x^3+y^3-(Zv+1)^3";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_INTERCEPT] = "Linear intersect: V/(V-S)";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_MOD9] =      "V Modulo 9";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_F2] =        "When the intersect is close to 1/2";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_F3] =        "When the intersect close to 1/3 or 2/3";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_F4] =        "When the intersect close to 1/4, 2/4 or 3/4";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_F5] =        "When the intersect close to 1/5, 2/5, 3/5 or 4/5";
CubeSurfer.MODE_TEXT [CubeSurfer.SM_N] =         "The contour below, max (z-x,z-y)";
    
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
CubeSurfer.VALUE_TEXT [CubeSurfer.SM_N] =         function (x) { return x.cw.GetContour().toString ();}

//--------------------------------------------------------------------------------------------
CubeSurfer.prototype.DisplayText = function (mode)
{
    return CubeSurfer.VALUE_TEXT [mode] (this);
}
//--------------------------------------------------------------------------------------------
CubeSurfer.prototype.toString = function ()
{
    return "(" + this.cw.value + "," + this.cw.subvalue + ")";
}
//==========================================================================================================
//==========================================================================================================
CubeSurferGrid = function (type, x, y)
{
    this.size = CubeSurferGrid.size [type];
    this.num_cells = this.size * this.size;
    this.cell_size = CubeSurferGrid.cell [type];
    this.grid = new Array (this.num_cells);
    this.type = type;
    this.x0 = x;
    this.y0 = y;
    
    this.grid [0] = CubeSurfer.FromPosition (x, y);
    this.ExpandColumn (0);
    this.CalcLimits ();
}

CubeSurferGrid.SCROLL = 0;
CubeSurferGrid.CENTRE = 1;
CubeSurferGrid.TIMES2 = 2;
CubeSurferGrid.TIMES3 = 3;
CubeSurferGrid.TIMES4 = 4;
CubeSurferGrid.TIMES5 = 5;
    
CubeSurferGrid.G11 = 0;
CubeSurferGrid.G101 = 1;
CubeSurferGrid.G1001 = 2;

CubeSurferGrid.size = [11, 101, 1001];
CubeSurferGrid.cell = [32, 8, 1];
CubeSurferGrid.slide = [5, 50, 500];

CubeSurferGrid.animate = null;
CubeSurferGrid.surfer = null;

//--------------------------------------------------------------------------------------------
CubeSurferGrid.prototype.StartSurfing = function (x, y)
{
    var ix = (x.Subtract(this.x0)).ToInt ();
    var iy = (y.Subtract(this.y0)).ToInt ();
    var idx = iy + this.size * ix;
    
    CubeSurferGrid.surfer = new CubeSurfer (CubeWalker.Clone (this.grid[idx].cw));
    CubeSurferGrid.animate = this;
}
//--------------------------------------------------------------------------------------------
CubeSurferGrid.Animate = function ()
{
    if (CubeSurferGrid.animate != null)
    {
        CubeSurferGrid.animate.Animate ();
    }
}
//--------------------------------------------------------------------------------------------
CubeSurferGrid.prototype.Animate = function ()
{
}
//--------------------------------------------------------------------------------------------
CubeSurferGrid.prototype.CalcLimits = function ()
{
    var n = this.num_cells;
    
    // Defer calculation until required
    
    this.vmax = null;
    this.smin = null;
    this.zmin = null;
    this.range_min = null;
    this.contour_min = null;
} 
//--------------------------------------------------------------------------------------------
CubeSurferGrid.prototype.InitRangeZ = function ()
{
    if (this.zmin === null)
    {
        var n = this.num_cells;
    
        this.zmin = VLInt.FromVLInt (this.grid[0].cw.big_cz.root);
        this.zmax = VLInt.FromVLInt (this.grid[0].cw.big_cz.root);
    
        for (var i = 0 ; i < n ; ++i)
        {
            var z = this.grid[i].cw.big_cz.root;
        
            if (VLInt.Compare (z, this.zmax) > 0)
            {
                this.zmax = z;
            }
            if (VLInt.Compare (z, this.zmin) < 0)
            {
                this.zmin = z;
            }
        }
        
        this.zrange = this.zmax.Subtract (this.zmin);
    }
}   
//--------------------------------------------------------------------------------------------
CubeSurferGrid.prototype.InitRangeV = function ()
{
    if (this.vmax === null)
    {
        var n = this.num_cells;
    
        this.vmax = VLInt.ZERO;
        
        for (var i = 0 ; i < n ; ++i)
        {
            var v = this.grid[i].cw.value;
        
            if (VLInt.Compare (v, this.vmax) > 0)
            {
                this.vmax = v;
            }
        }
    }
}   
//--------------------------------------------------------------------------------------------
CubeSurferGrid.prototype.InitRangeS = function ()
{
    if (this.smin === null)
    {
        var n = this.num_cells;
    
        this.smin = VLInt.ZERO;
        
        for (var i = 0 ; i < n ; ++i)
        {
            var s = this.grid[i].cw.subvalue;

            if (VLInt.Compare (s, this.smin) < 0)
            {
                this.smin = s;
            }
        }
    }
}
//--------------------------------------------------------------------------------------------
CubeSurferGrid.prototype.InitRangeRange = function ()
{
    if (this.range_min === null)
    {
        var n = this.num_cells;
    
        this.range_min = VLInt.FromVLInt (this.grid[0].cw.big_cz.root);
        this.range_max = VLInt.FromVLInt (this.grid[0].cw.big_cz.root);
    
        for (var i = 0 ; i < n ; ++i)
        {
            var r = this.grid[i].cw.Range ();
        
            if (VLInt.Compare (r, this.range_max) > 0)
            {
                this.range_max = r;
            }
            if (VLInt.Compare (r, this.range_min) < 0)
            {
                this.range_min = r;
            }
        }
        
        this.range_range = this.range_max.Subtract (this.range_min);
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
//--------------------------------------------------------------------------------------------    
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

    CubeSurferGrid.INITRANGE [mode] (this);

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
    
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x >= this.size) x = this.size - 1;
    if (y >= this.size) y = this.size - 1;
    
    var idx = y + this.size * x;
    
    if (idx < 0 || idx >= this.num_cells)
    {
        Misc.Alert ("No cell at ({0},{1})", x, y);
    }
    return this.grid [idx];
}

//--------------------------------------------------------------------------------------------
CubeSurferGrid.ACTION=[];
CubeSurferGrid.ACTION[CubeSurferGrid.SCROLL] = function (csg, x, y)
{
    return [x,y];    
}
CubeSurferGrid.ACTION[CubeSurferGrid.CENTRE] = function (csg, x, y)
{
    var slide = CubeSurferGrid.slide[csg.type];
        
    return [x.AddInt (-slide),y.AddInt (-slide)];
}
CubeSurferGrid.ACTION[CubeSurferGrid.TIMES2] = function (csg, x, y)
{
    return [x.MultiplyInt (2),y.MultiplyInt (2)];
}
CubeSurferGrid.ACTION[CubeSurferGrid.TIMES3] = function (csg, x, y)
{
    return [x.MultiplyInt (2),y.MultiplyInt (2)];
}
CubeSurferGrid.ACTION[CubeSurferGrid.TIMES4] = function (csg, x, y)
{
    return [x.MultiplyInt (2),y.MultiplyInt (2)];
}
CubeSurferGrid.ACTION[CubeSurferGrid.TIMES5] = function (csg, x, y)
{
    return [x.MultiplyInt (2),y.MultiplyInt (2)];
}
//--------------------------------------------------------------------------------------------
CubeSurferGrid.prototype.GetNewCorner = function (xpos, ypos, action)
{
    var cell = this.GetCellAt (xpos, ypos);

    var x = cell.cw.big_cx.root;
    var y = cell.cw.big_cy.root;
    
    return CubeSurferGrid.ACTION[action](this, x, y); 
}
//--------------------------------------------------------------------------------------------
CubeSurferGrid.INITRANGE = [];
CubeSurferGrid.INITRANGE [CubeSurfer.SM_Z] = function (csg) { csg.InitRangeZ (); }
CubeSurferGrid.INITRANGE [CubeSurfer.SM_VALUE] = function (csg) { csg.InitRangeV (); }
CubeSurferGrid.INITRANGE [CubeSurfer.SM_WALKER] = function (csg) {}
CubeSurferGrid.INITRANGE [CubeSurfer.SM_XYZ] = function (csg) {}
CubeSurferGrid.INITRANGE [CubeSurfer.SM_RANGE] = function (csg) { csg.InitRangeRange (); }
CubeSurferGrid.INITRANGE [CubeSurfer.SM_SUBVALUE] = function (csg) { csg.InitRangeS (); }
CubeSurferGrid.INITRANGE [CubeSurfer.SM_INTERCEPT] = function (csg) {}
CubeSurferGrid.INITRANGE [CubeSurfer.SM_MOD9] = function (csg) {}
CubeSurferGrid.INITRANGE [CubeSurfer.SM_F2] = function (csg) {}
CubeSurferGrid.INITRANGE [CubeSurfer.SM_F3] = function (csg) {}
CubeSurferGrid.INITRANGE [CubeSurfer.SM_F4] = function (csg) {}
CubeSurferGrid.INITRANGE [CubeSurfer.SM_F5] = function (csg) {}
CubeSurferGrid.INITRANGE [CubeSurfer.SM_N] = function (csg) {}

//--------------------------------------------------------------------------------------------
CubeSurferGrid.COLOUR = [];

CubeSurferGrid.COLOUR [CubeSurfer.SM_Z] = function (csg, surfer)
{
    var dz = surfer.cw.big_cz.root.Mod16();
    var f = dz / 16;
    
    return SVGColours.BlendRGB (CubeSurferGrid.red, CubeSurferGrid.blue, f);
}

CubeSurferGrid.COLOUR [CubeSurfer.SM_VALUE] = function (csg, surfer)
{
    var f = VLInt.Ratio (surfer.cw.value, csg.vmax);
    
    return SVGColours.BlendRGB (CubeSurferGrid.blue, CubeSurferGrid.white, f);
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
    var dz = surfer.cw.Range().Subtract (csg.range_min);
    var f = VLInt.Ratio (dz, csg.range_range);
    
    return SVGColours.BlendRGB (CubeSurferGrid.red, CubeSurferGrid.blue, f);
}
CubeSurferGrid.COLOUR [CubeSurfer.SM_SUBVALUE] =  function (csg, surfer)
{
    var f = VLInt.Ratio (surfer.cw.subvalue, csg.smin);
    
    return SVGColours.BlendRGB (CubeSurferGrid.red, CubeSurferGrid.white, f);
}
CubeSurferGrid.COLOUR [CubeSurfer.SM_INTERCEPT] = function (csg, surfer)
{
    var r = surfer.cw.value.Subtract (surfer.cw.subvalue);
    var f = VLInt.Ratio (surfer.cw.value, r);
    
    if (f > 0.5)
    {
        return SVGColours.BlendRGB (CubeSurferGrid.red, CubeSurferGrid.white, 2 * (f - 0.5));
    }
    
    return SVGColours.BlendRGB (CubeSurferGrid.white, CubeSurferGrid.blue, 2 * f);
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

    return SVGColours.BlendRGB (CubeSurferGrid.blue, white, 1 - 8 * x);
}
CubeSurferGrid.COLOUR [CubeSurfer.SM_F3] = function (csg, surfer)
{
    var x = surfer.cw.DistanceFrom ([1/3, 2/3]);
    
    if (x > 1/27) return "white";
    
    var white = SVGColours.RgbFromName ("white");

    return SVGColours.BlendRGB (CubeSurferGrid.blue, white, 1 - 27 * x);
}
CubeSurferGrid.COLOUR [CubeSurfer.SM_F4] = function (csg, surfer)
{
    var x = surfer.cw.DistanceFrom ([1/4, 2/4, 3/4]);
    
    if (x > 1/64) return "white";
    
    var white = SVGColours.RgbFromName ("white");

    return SVGColours.BlendRGB (CubeSurferGrid.blue, white, 1 - 64 * x);
}
CubeSurferGrid.COLOUR [CubeSurfer.SM_F5] = function (csg, surfer)
{
    var x = surfer.cw.DistanceFrom ([1/5, 2/5, 3/5, 4/5]);
    
    if (x > 1/125) return "white";

    return SVGColours.BlendRGB (CubeSurferGrid.blue, CubeSurferGrid.white, 1 - 125 * x);
}
//--------------------------------------------------------------------------------------------
CubeSurferGrid.COLOUR [CubeSurfer.SM_N] = function (csg, surfer)
{
    var x = surfer.cw.GetContour ().Mod8();
    var f = x / 7;
    
    return SVGColours.BlendRGB (CubeSurferGrid.black, CubeSurferGrid.white, f);
}
//--------------------------------------------------------------------------------------------
CubeSurferGrid.prototype.GetColour = function (idx, mode)
{
    var surfer = this.grid [idx];
    
    if (surfer.cw.big_cx.IsZero () || surfer.cw.big_cy.IsZero ()) return "black";
    
    return CubeSurferGrid.COLOUR [mode] (this, surfer);
}

