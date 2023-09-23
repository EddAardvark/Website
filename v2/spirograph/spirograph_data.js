//-------------------------------------------------------------------------------------------------
// Parameters used to describe a spirograph pattern
// (c) John Whitehouse 2013-2023
// www.eddaardvark.co.uk
//
// Depends on SVGColours: colours.js
//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
// define the spirograph data
//-------------------------------------------------------------------------------------------------
SpirographData = function ()
{
}

// Constants

SpirographData.max_wheels = 5;
SpirographData.min_wheels = 2;
SpirographData.min_points = 3;
SpirographData.max_points = 10000;
SpirographData.min_size = 30;
SpirographData.max_size = 1000;
SpirographData.fill_options = ["nonzero", "evenodd", "none", "dashed"];

// Globals

// Constructors

SpirographData.GetDefault = function ()
{
    var ret = new SpirographData ();
    
    ret.num_wheels = 2;
    ret.num_points = 600;

    ret.wheel_sizes = [5,6,2,1,1];
    ret.wheel_rates = [4,-7,5,-3,61];
    ret.wheel_phases = [0,0,0,0,0];
    
    ret.phase_deltas = [0.0,1,0,0,0];

    ret.line_colour = "black";
    ret.fill_colour = "yellow";
    ret.back_colour = "transparent";
    ret.fill_rule = "evenodd";
    ret.scale = 1;
   
    return ret;
}

SpirographData.MakeCopy = function (other)
{
    var ret = new SpirographData ();
    
    ret.num_wheels   = other.num_wheels;
    ret.num_points   = other.num_points;
    
    ret.wheel_sizes  = [...other.wheel_sizes];
    ret.wheel_rates  = [...other.wheel_rates];
    ret.wheel_phases = [...other.wheel_phases];
    
    ret.phase_deltas = [...other.phase_deltas];
    
    ret.line_colour  = other.line_colour;
    ret.fill_colour  = other.fill_colour;
    ret.back_colour  = other.back_colour;
    ret.fill_rule    = other.fill_rule;
    ret.scale        = other.scale;
   
    return ret;
}

// Functions

//-------------------------------------------------------------------------------------------------
// Get the symmetry - only uses the first 2 wheels !
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.GetSymmetry = function()
{
   symm = this.wheel_rates [1] - this.wheel_rates [0];

   div = Primes.hcf (symm, this.wheel_rates [0]);
   return symm / div;
}

//-------------------------------------------------------------------------------------------------
// Increase the number of points used to draw the spirograph
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.IncrementPoints = function (delta)
{
    this.num_points += delta;

    if (this.num_points < SpirographData.min_points) this.num_points = SpirographData.min_points;
    if (this.num_points > SpirographData.max_points) this.num_points = SpirographData.max_points;
}
//-------------------------------------------------------------------------------------------------
// Increase the number of wheels used to construct the pattern
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.IncrementWheels = function (delta)
{
    this.num_wheels += delta;

    if (this.num_wheels < SpirographData.min_wheels) this.num_wheels = SpirographData.min_wheels;
    if (this.num_wheels > SpirographData.max_wheels) this.num_wheels = SpirographData.max_wheels;
}
//-------------------------------------------------------------------------------------------------
// Set the fill colour
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.SetFillColour = function (colour)
{
    this.fill_colour = colour;
}
//-------------------------------------------------------------------------------------------------
// Set the background colour
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.SetBackColour = function (colour)
{
    this.back_colour = colour;
}
//-------------------------------------------------------------------------------------------------
// Set the fill colour
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.SetFillRule = function (rule)
{
    this.fill_rule = rule;
}
//-------------------------------------------------------------------------------------------------
// Set the line colour
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.SetLineColour = function (colour)
{
    this.line_colour = colour;
}
//-------------------------------------------------------------------------------------------------
// Update a wheel's size
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.SetWheelSize = function (wheel, delta)
{
    if (wheel >= 0 && wheel < SpirographData.max_wheels)
    {
        new_size = this.wheel_sizes [wheel] + delta;
        if (new_size < 1) new_size = 1;
        this.wheel_sizes [wheel] = new_size;
    }
}
//-------------------------------------------------------------------------------------------------
// Update a wheel's rate
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.SetWheelRate = function (wheel, delta)
{
    this.wheel_rates [wheel] += delta;
}
//-------------------------------------------------------------------------------------------------
// Update a wheel's rate
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.ChangeWheelRate = function (wheel, new_rate)
{
    if (wheel >= 0 && wheel < SpirographData.max_wheels)
    {
        this.wheel_rates [wheel] = new_rate;
    }
}
//-------------------------------------------------------------------------------------------------
// Update a wheel's phase
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.SetWheelPhase = function (wheel, delta)
{
    if (wheel >= 0 && wheel < SpirographData.max_wheels)
    {
        var new_phase = (this.wheel_phases [wheel] + delta) % 360;
        
        if (new_phase < 0) new_phase += 360;
        
        this.wheel_phases [wheel] = new_phase;
    }
}
//-------------------------------------------------------------------------------------------------
// Update a wheel's phase delta
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.SetWheelPhaseDelta = function (wheel, d_delta)
{
    if (wheel >= 0 && wheel < SpirographData.max_wheels)
    {
        new_delta = (this.phase_deltas [wheel] + d_delta);
        if (new_delta > 180) new_delta -= 180;
        this.phase_deltas [wheel] = new_delta;
    }
}
//-------------------------------------------------------------------------------------------------
// Increase/decrease the symmetry of the pattern
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.IncrementSymmetry = function (delta)
{
    symm = this.GetSymmetry ();

    if (symm == 0) return;
    if (symm < 0) symm = - symm;

    symm += delta;

    if (symm > 1)
    {
        this.EnforceSymmetry (symm, 1);
    }
}
//-------------------------------------------------------------------------------------------------
// Adjust wheels 2-N to make the pattern symetrical
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.MakeSymmetrical = function ()
{
    symm = this.GetSymmetry ();

    this.EnforceSymmetry (symm, 2);
}
// Apply the ani9mation parameters

SpirographData.prototype.Animate = function ()
{
    for (var i in this.wheel_phases)
    {   
        var new_phase = (this.wheel_phases [i] + this.phase_deltas [i]) % 360;
        if (new_phase < 0) new_phase += 360;
        
        this.wheel_phases [i] = new_phase;
    }
}
//-------------------------------------------------------------------------------------------------    
// Rotate
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.Rotate = function (angle)
{
    for (var i in this.wheel_phases)
    {
        this.wheel_phases [i] += angle;
    }
}   
//-------------------------------------------------------------------------------------------------
// Make an example pattern
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.MakeExample = function ()
{
    this.num_wheels = 2;
    this.num_points = 298;
    this.wheel_rates [0] = 6;
    this.wheel_rates [1] = 79;
    this.line_colour = "black";
    this.fill_colour = "blue";
    this.back_colour = "none";
    this.fill_rule = "evenodd";
}
//-------------------------------------------------------------------------------------------------
// Randomise some attributes
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.Randomise = function ()
{
    var count = 0;
    
    this.randomiser_text =  "";
    
    do
    {
        for (var idx in SpirographData.Randomisers)
        {
            if (Misc.RandomInteger (7) == 0)
            {
                SpirographData.Randomisers [idx].call (this);
                count ++;
            }
        }
    }
    while (count == 0);
}
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.BuildRandomiserText = function (txt)
{
    if (this.randomiser_text.length > 0)
    {
        this.randomiser_text += ", ";
    }
    this.randomiser_text += txt;
}
//-------------------------------------------------------------------------------------------------
// Randomise the number of wheels
//-------------------------------------------------------------------------------------------------
SpirographData.RandomiseWheels = function ()
{
    this.BuildRandomiserText ("Num wheels");

    if (this.num_wheels == SpirographData.min_wheels)
    {
        this.num_wheels += 1;
    }
    else if (this.num_wheels == SpirographData.max_wheels)
    {
        this.num_wheels -= 1;
    }
    else
    {
        this.num_wheels += (Math.random () > 0.5) ? 1 : -1;
    }
}
//-------------------------------------------------------------------------------------------------
// Randomise the number of points
//-------------------------------------------------------------------------------------------------
SpirographData.RandomisePoints = function ()
{
    var mode = Misc.RandomInteger (5);
    this.BuildRandomiserText ("Points: " + mode);

    switch (mode)
    {
    case 0:
        this.num_points *= Misc.RandomInteger (2, 5);
        break;
    case 1:
        this.num_points = Math.floor (Misc.RandomInteger (2, 5));
        break;
    case 2:
        this.num_points = this.GetSymmetry () * 100;
        break;
    case 3:
        this.num_points = this.GetSymmetry () * Misc.RandomInteger(1, 7);
        break;
    case 4:
        this.num_points = Misc.RandomInteger(3, 3000);
        break;
    }

    if (this.num_points < SpirographData.min_points) this.num_points = SpirographData.min_points;
    if (this.max_points > SpirographData.max_points) this.num_points = SpirographData.max_points;
}
//-------------------------------------------------------------------------------------------------
// Randomise the size of a wheel
//-------------------------------------------------------------------------------------------------
SpirographData.RandomiseWheelSize = function ()
{
    var wheel = Misc.RandomInteger (this.num_wheels);

    this.BuildRandomiserText ("Wheel-size " + wheel);
    
    this.SetWheelSize (wheel, Misc.RandomInteger (-2, 2));
}
//-------------------------------------------------------------------------------------------------
// Randomise the rate of a wheel
//-------------------------------------------------------------------------------------------------
SpirographData.RandomiseWheelRate = function ()
{
    var wheel = Misc.RandomInteger (this.num_wheels);
    var mode = Misc.RandomInteger(3);
    this.BuildRandomiserText ("Wheel-rate [" + wheel + "][" + mode + "]");

    switch (mode)
    {
        case 0:
            this.SetWheelRate (wheel, Misc.RandomInteger (-2, 2));
            break;
        case 1:
            this.ChangeWheelRate (wheel, Misc.RandomInteger (-12, 12));
            break;
        case 2:
            var next = this.num_points;
            next = Math.round((Misc.RandomInteger (6) - 3) + next / (2 + Misc.RandomInteger (4)));
            this.ChangeWheelRate (wheel, next);
            break;
    }
}
//-------------------------------------------------------------------------------------------------
// Randomise the phase of a wheel
//-------------------------------------------------------------------------------------------------
SpirographData.RandomiseWheelPhase = function ()
{
    var wheel = Misc.RandomInteger (this.num_wheels);

    this.BuildRandomiserText ("Wheel-phase " + wheel);    
    this.SetWheelPhase (wheel, Misc.RandomInteger (360));
}
//-------------------------------------------------------------------------------------------------
// Randomise the fill colour
//-------------------------------------------------------------------------------------------------
SpirographData.RandomiseFillColour = function ()
{
    var c = SVGColours.RandomNamedColour ();

    this.BuildRandomiserText ("Fill colour: " + c);
    this.fill_colour = c;
}
//-------------------------------------------------------------------------------------------------
// Randomise the line colour
//-------------------------------------------------------------------------------------------------
SpirographData.RandomiseLineColour = function ()
{
    if (this.fill_colour == "None" || this.line_colour != "black")
    {
        this.line_colour = "black";
    }
    else
    {
        this.line_colour = SVGColours.RandomNamedColour ();
    }
    this.BuildRandomiserText ("Line colour " + this.line_colour);
}
//-------------------------------------------------------------------------------------------------
// Randomise the fill mode
//-------------------------------------------------------------------------------------------------
SpirographData.RandomiseFillMode = function ()
{
    var next;
    var previous = this.fill_rule;

    do
    {
        next = SpirographData.fill_options [Misc.RandomInteger (4)];
    }
    while (next == previous);

    this.fill_rule = next;
    this.BuildRandomiserText ("Fill rule " + this.fill_rule);
}
//-------------------------------------------------------------------------------------------------
// Randomise the Animation parameters
//-------------------------------------------------------------------------------------------------
SpirographData.RandomiseAnimation = function ()
{
    var wheel = Misc.RandomInteger (this.num_wheels);

    this.BuildRandomiserText ("Phase delta [" + wheel + "]");    

    if (Misc.RandomInteger (2) == 0)
    {
        this.phase_deltas [wheel] = 0;
    }
    else
    {
        this.phase_deltas [wheel] = Misc.RandomInteger (-100, 100) / 100;
    }
}
//-------------------------------------------------------------------------------------------------
SpirographData.Randomisers =
    [
        SpirographData.RandomiseFillColour,
        SpirographData.RandomiseFillMode,
        SpirographData.RandomiseLineColour,
        SpirographData.RandomiseAnimation,
        SpirographData.RandomiseWheels,
        SpirographData.RandomiseWheelSize,
        SpirographData.RandomiseWheelRate,
        SpirographData.RandomiseWheelPhase,
        SpirographData.RandomisePoints
    ];
//-------------------------------------------------------------------------------------------------
// Construct the SVG to draw in a position and radius
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.GetSVG = function (xpos, ypos, radius)
{
    var ret = "";
    
    if (this.back_colour != "transparent")
    {
        var r2 = radius * 1.05;
        ret += SVGHelp.Rect (-r2, -r2, 2 * r2, 2 * r2, this.back_colour, "transparent");
    }
    
    ret += (this.fill_rule == "dashed")
                        ? this.GetDashedSVG (xpos, ypos, radius)
                        : this.GetSolidSVG (xpos, ypos, radius)

    return ret;
}

//-------------------------------------------------------------------------------------------------
// Construct the SVG using solid lines
SpirographData.prototype.GetSolidSVG = function (xpos, ypos, r)
{
    var radius = 0;
    var phases = [];
    
    // Calculate total radius and convert phases to radians

    for (i = 0 ; i < this.num_wheels ; i++)
    {
        radius += Math.abs (this.wheel_sizes [i]);
        phases [i] = this.wheel_phases [i] * Math.PI / 180;
    }

    var factor = this.scale * r / radius;
    var k = 2 * Math.PI / this.num_points;
    var points = "";

    for (i = 0 ; i < this.num_points ; i++)
    {
        var a = i * k;
        var x = 0;
        var y = 0;

        for (j = 0 ; j < this.num_wheels ; j++)
        {
            a2 = a * this.wheel_rates [j] + phases [j];
            x += this.wheel_sizes [j] * Math.sin (a2);
            y += this.wheel_sizes [j] * Math.cos (a2);
        }

        x = xpos + x * factor;
        y = ypos + y * factor;

        points += x + "," + y + " ";
    }
    
    var ret = "<polygon points=\"" + points + "\"";
    ret += " style=\"stroke-width:1;";

    if (this.fill_rule == 'none')
    {
        ret += "fill:none;";
    }
    else
    {
        ret += "fill:" + this.fill_colour + ";";
        ret += "fill-rule:" + this.fill_rule + ";";
    }
    ret += "stroke:" + this.line_colour + ";";
    ret += "\"/>";
    return ret;
}
//-------------------------------------------------------------------------------------------------
// Construct the SVG by drawing a line between alternate pairs of points (no fill)

SpirographData.prototype.GetDashedSVG = function (xpos, ypos, r)
{
    var radius = 0;
    var phases = [];
    var ret = "";

    // Calculate total radius and convert phases to radians

    for (i = 0 ; i < this.num_wheels ; i++)
    {
        radius += Math.abs (this.wheel_sizes [i]);
        phases [i] = this.wheel_phases [i] * Math.PI / 180;
    }

    var factor = this.scale * r / radius;
    var num_points = ((this.num_points % 2) == 0) ? this.num_points : (this.num_points + 1);
    var k = 2 * Math.PI / num_points;
    var p1, p2;

    for (i = 0 ; i < num_points ; i++)
    {
        var a = i * k;
        var x = 0;
        var y = 0;

        for (j = 0 ; j < this.num_wheels ; j++)
        {
            a2 = a * this.wheel_rates [j] + phases [j];
            x += this.wheel_sizes [j] * Math.sin (a2);
            y += this.wheel_sizes [j] * Math.cos (a2);
        }
        x = xpos + x * factor;
        y = ypos + y * factor;

        if ((i % 2) == 0)
        {
            p1 = [x, y];
        }
        else
        {
            ret += SVGHelp.Line (p1, [x,y], this.line_colour);
        }
    }
    return ret;
}

//-------------------------------------------------------------------------------------------------
// Construct the SVG by drawing a line between alternate pairs of points (no fill)

SpirographData.prototype.GetPoints = function (xpos, ypos, r)
{
    var radius = 0;
    var phases = [];
    var ret = [];

    // Calculate total radius and convert phases to radians

    for (i = 0 ; i < this.num_wheels ; i++)
    {
        radius += Math.abs (this.wheel_sizes [i]);
        phases [i] = this.wheel_phases [i] * Math.PI / 180;
    }

    var factor = this.scale * r / radius;
    var k = 2 * Math.PI / this.num_points;

    for (i = 0 ; i < this.num_points ; i++)
    {
        var a = i * k;
        var x = 0;
        var y = 0;

        for (j = 0 ; j < this.num_wheels ; j++)
        {
            a2 = a * this.wheel_rates [j] + phases [j];
            x += this.wheel_sizes [j] * Math.sin (a2);
            y += this.wheel_sizes [j] * Math.cos (a2);
        }
        x = xpos + x * factor;
        y = ypos + y * factor;
        
        ret.push ({"x":x, "y":y});
    }
    return ret;
}




