//-------------------------------------------------------------------------------------------------
// Spirograph split. Draws a set of small spirographs located at the points of a larger one
// parameters
// (c) John Whitehouse 2013-2023
// www.eddaardvark.co.uk
//
// Depends on SVGColours: colours.js
//-------------------------------------------------------------------------------------------------

SpirographSplit = function ()
{
}

//-------------------------------------------------------------------------------------------------
SpirographSplit.GetDefault = function ()
{
    var ret = new SpirographSplit ();
    
    ret.inner_wheels = 2;
    ret.outer_wheels = 1;
    ret.outer_points = 5;
    ret.inner_size   = 25;    // Controls the relative size of the two components
    ret.outer_size   = 1;
    ret.outer_rotate = 0;
    ret.line_colours = ["black"];
    ret.fill_colours = ["blue","cyan"];
    
    return ret;
}
// Copies the split data

SpirographSplit.MakeCopy = function (other)
{
    var ret = new SpirographSplit ();
       
    ret.inner_wheels = other.inner_wheels;
    ret.outer_wheels = other.outer_wheels;
    ret.outer_points = other.outer_points;
    ret.inner_size   = other.inner_size;
    ret.outer_size   = other.outer_size;    
    ret.outer_rotate = other.outer_rotate;
    ret.line_colours = other.line_colours;
    ret.fill_colours = other.fill_colours;
    
    return ret;
}
//-------------------------------------------------------------------------------------------------
SpirographSplit.prototype.MakeComponents = function (spirograph)
{   
    this.Fix ();
    
    this.spirograph = spirograph;
    this.inner = SpirographData.MakeCopy (spirograph);
    this.outer = SpirographData.MakeCopy (spirograph);
    this.outer.back_colour = "transparent";
    
    // Innter has all the attributes of the original except the number of wheels
    
    this.inner.num_wheels = this.inner_wheels;
    
    // Outer's wheels are taken from the next available inner wheels
    
    this.outer.num_wheels = this.outer_wheels;
    this.outer.num_points = this.outer_points;    
    
    this.outer.wheel_sizes  = [];
    this.outer.wheel_rates  = [];
    this.outer.wheel_phases = [];
    this.outer.phase_deltas = [];
    
    var hcf = this.outer.num_points;
    
    for (var i = 0 ; i < this.outer_wheels ; ++i)
    {
        var j = i + this.inner.num_wheels;
        this.outer.wheel_sizes  [i] = this.spirograph.wheel_sizes  [j];
        this.outer.wheel_rates  [i] = this.spirograph.wheel_rates  [j];
        this.outer.wheel_phases [i] = this.spirograph.wheel_phases [j];
        this.outer.phase_deltas [i] = this.spirograph.phase_deltas [j];
        
        hcf = Primes.hcf (hcf, this.outer.wheel_rates [i]);
    }
    
    // Avoids empty patterns
    
    while (hcf > 1)
    {
        this.outer.num_points ++;
        hcf = this.outer.num_points;
        for (var i = 0 ; i < this.outer_wheels ; ++i)
        {
            hcf = Primes.hcf (hcf, this.outer.wheel_rates [i]);
        }
    }
    
    // scale so that they fit
    
    this.inner.scale = this.inner_size / (this.inner_size + this.outer_size );
    this.outer.scale = 1 - this.inner.scale;
}
//-------------------------------------------------------------------------------------------------
SpirographSplit.prototype.Advance = function (spirograph, idx)
{
    // Doesn't do overlay mode
}
//-------------------------------------------------------------------------------------------------
SpirographSplit.prototype.SetConfig = function ()
{
    inner_wheels.value   = this.inner_wheels;
    outer_wheels.value   = this.outer_wheels;
    outer_points.value   = this.outer_points;
    inner_size.value     = this.inner_size;
    outer_size.value     = this.outer_size;
    outer_rotate.value   = this.outer_rotate;
    split_linecols.value = SpirographController.ColoursToText(this.line_colours);
    split_fillcols.value = SpirographController.ColoursToText(this.fill_colours);
}
//-------------------------------------------------------------------------------------------------
SpirographSplit.prototype.ReadConfig = function ()
{
    this.inner_wheels = parseInt (inner_wheels.value);
    this.outer_wheels = parseInt (outer_wheels.value);
    this.outer_points = parseInt (outer_points.value);
    this.inner_size   = parseInt (inner_size.value);
    this.outer_size   = parseInt (outer_size.value);
    this.outer_rotate = parseInt (outer_rotate.value);    
    this.line_colours = SpirographController.RemoveBlanks(split_linecols.value.split (" "));
    this.fill_colours = SpirographController.RemoveBlanks(split_fillcols.value.split (" "));
}
//-------------------------------------------------------------------------------------------------
// Randomise some attributes
//-------------------------------------------------------------------------------------------------
SpirographSplit.prototype.Randomise = function ()
{
    var count = 0;
    
    this.randomiser_text =  "";
    
    do
    {
        for (var idx in SpirographSplit.Randomisers)
        {
            if (Misc.RandomInteger (7) == 0)
            {
                SpirographSplit.Randomisers [idx].call (this);
                count ++;
            }
        }
    }
    while (count == 0);
}
SpirographSplit.RandomiseInnerWheels = function ()
{
    this.inner_wheels = Misc.RandomInteger (1, SpirographData.max_wheels - this.outer_wheels);
}
SpirographSplit.RandomiseOuterWheels = function ()
{
    this.outer_wheels = Misc.RandomInteger (1, SpirographData.max_wheels - this.inner_wheels);
}
SpirographSplit.RandomiseOuterPoints = function ()
{
    var new_points = this.outer_points;
    
    switch (Misc.RandomInteger (3))
    {
        case 0:
            new_points = Misc.RandomInteger (3,11);
            break;
        case 1:
            new_points = this.outer_points * Misc.RandomInteger (2,5);
            break;
        case 2:
            new_points = this.outer_points * Math.random ();
            break;
        case 3:
            new_points = Misc.RandomInteger(3, 600);
            break;
    }
    this.outer_points = Math.max (3, Math.floor (new_points));
}
SpirographSplit.RandomiseInnerSize = function ()
{
    switch (Misc.RandomInteger (0,1))
    {
        case 0:
            this.inner_size = Misc.RandomInteger (1, 50);
            break;
        case 1:
            this.inner_size = 1;
            break;
    }        
}
SpirographSplit.RandomiseOuterSize = function ()
{
    switch (Misc.RandomInteger (0,1))
    {
        case 0:
            this.outer_size = Misc.RandomInteger (1, 50);
            break;
        case 1:
            this.outer_size = 1;
            break;
    }
}
SpirographSplit.RandomiseLineColours = function ()
{
    var num_colours = Misc.RandomInteger (1,4);
    this.line_colours = [];
    for (var i = 0 ; i < num_colours ; ++i)
    {
        this.line_colours.push (SVGColours.RandomNamedColour ());
    }
}
SpirographSplit.RandomiseFillColours = function ()
{   
    var num_colours = Misc.RandomInteger (1,4);
    this.fill_colours = [];
    for (var i = 0 ; i < num_colours ; ++i)
    {
        this.fill_colours.push (SVGColours.RandomNamedColour ());
    }
}
//-------------------------------------------------------------------------------------------------
SpirographSplit.Randomisers =
    [
        SpirographSplit.RandomiseInnerWheels,
        SpirographSplit.RandomiseOuterWheels,
        SpirographSplit.RandomiseOuterPoints,
        SpirographSplit.RandomiseInnerSize,
        SpirographSplit.RandomiseOuterSize,
        SpirographSplit.RandomiseLineColours,
        SpirographSplit.RandomiseFillColours
    ];
//-------------------------------------------------------------------------------------------------
SpirographSplit.prototype.Fix = function ()
{
    if (this.inner_wheels < 1) this.inner_wheels = 1;
    if (this.inner_wheels > SpirographData.max_wheels-1) this.inner_wheels = SpirographData.max_wheels-1;
    if (this.outer_wheels < 1) this.outer_wheels = 1;
    if (this.inner_wheels + this.outer_wheels > SpirographData.max_wheels) this.outer_wheels = SpirographData.max_wheels-this.inner_wheels;
    if (this.outer_points < 3) this.outer_points = 3;
    if (this.line_colours.length < 1) this.line_colours = ["black"];
    if (this.fill_colours.length < 1) this.fill_colours = ["white"];
}
//-------------------------------------------------------------------------------------------------
// Construct the SVG to draw in a position and radius

SpirographSplit.prototype.GetSVG = function (xpos, ypos, radius)
{
    var ret = "";
    
    if (this.spirograph.back_colour != "transparent")
    {
        var r2 = radius * 1.05;
        ret += SVGHelp.Rect (-r2, -r2, 2 * r2, 2 * r2, this.back_colour, "transparent");
    }
        
    var points = this.inner.GetPoints (xpos, ypos, radius);
    var da = this.outer_rotate * 360 / points.length;
    
    for (var idx in points)
    {
        var f = idx / points.length;
    
        this.outer.line_colour = SVGColours.MultiBlend (this.line_colours, f);
        this.outer.fill_colour = SVGColours.MultiBlend (this.fill_colours, f);
    
        ret += this.outer.GetSVG (points[idx].x, points[idx].y, radius);
        this.outer.Rotate (da);
    }
    return ret;
}
//-------------------------------------------------------------------------------------------------
// Animate the individual frames

SpirographSplit.prototype.Animate = function ()
{
    var ret = "";
    
    this.inner.Animate ();
    this.outer.Animate ();
    
    return ret;
}
//-------------------------------------------------------------------------------------------------
SpirographSplit.prototype.toString = function ()
{
    return "Split: inner = " + this.inner_points + ", outer = " + this.outer_points;
}

