//-------------------------------------------------------------------------------------------------
// Javascript spirograph class definition
// (c) John Whitehouse 2013
// www.eddaardvark.co.uk
//
// Depends on SVGColours: colours.js
//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
// define the spirograph data
//-------------------------------------------------------------------------------------------------
SpirographData = function ()
{
    this.num_wheels = 2;
    this.num_points = 600;

    this.wheel_sizes = [5,3,2,1,1];
    this.wheel_rates = [6,-7,19,-20,123];
    this.wheel_phases = [0,0,0,0,0];

    this.line_colour = "black";
    this.fill_colour = "yellow";
    this.fill_rule = "evenodd";
    this.scale = 1;
}

//-------------------------------------------------------------------------------------------------
// Copy an existing spirograph object
//-------------------------------------------------------------------------------------------------
SpirographData.prototype.Clone = function ()
{
    var ret = new SpirographData ();

    ret.num_wheels = this.num_wheels;
    ret.num_points = this.num_points;
    ret.line_colour = this.line_colour;
    ret.fill_colour = this.fill_colour;
    ret.fill_rule = this.fill_rule;
    ret.scale = this.scale;

    for (i = 0 ; i < SpirographData.max_wheels ; i++)
    {
        ret.wheel_sizes [i] = this.wheel_sizes [i];
        ret.wheel_rates [i] = this.wheel_rates [i];
        ret.wheel_phases [i] = this.wheel_phases [i];
    }
    return ret;
}

SpirographData.max_wheels = 5;
SpirographData.min_wheels = 2;
SpirographData.min_points = 3;
SpirographData.max_points = 10000;
SpirographData.min_size = 30;
SpirographData.max_size = 1000;
SpirographData.fill_options = ["nonzero", "evenodd", "none", "dashed"];

//-------------------------------------------------------------------------------------------------
// Define incremental data used for sequences and animations
//-------------------------------------------------------------------------------------------------
SpirographSequence = function ()
{
    this.phase_deltas = [1,2,-1,-2,7];
    this.size_deltas = [0,0,0,0,0];
    this.rate_deltas = [0,0,0,0,0];
    this.points_delta = 0;
    this.line_colour_sequence = ['blue','red'];
    this.sequence_length = 10;
    this.sequence_type = SpirographSequence.Animation;
    this.scale_factor = 0.99;
}

//-------------------------------------------------------------------------------------------------
SpirographSequence.prototype.Verify = function ()
{
    // Returns a string describing what is wrong with the parameters (or null)

    if (this.phase_deltas.length != SpirographData.max_wheels
                || this.size_deltas.length != SpirographData.max_wheels
                || this.rate_deltas.length != SpirographData.max_wheels)
    {
        return "Sequence needs size, rate and phase deltas for " + SpirographData.max_wheels + " wheels";
    }
    if (this.sequence_length < 2)
    {
        return "Sequence length must be at least 2";
    }
    if (this.line_colour_sequence.length < 1)
    {
        return "Sequence needs at least one colour";
    }
    if (this.scale_factor <= 0 || this.scale_factor > 1)
    {
        return "Sequence: scale factor (f = " + this.scale_factor + ") does not satisfy the requirement 0 < f <= 1.";
    }
    return null;
}
//-------------------------------------------------------------------------------------------------
SpirographSequence.prototype.toString = function ()
{
    return SpirographSequence.Types [this.sequence_type] + ": steps = " + this.sequence_length;
}
//-------------------------------------------------------------------------------------------------
// Define the spirograph object, this contains the functions to manipulate and render the
// EpirographData
//-------------------------------------------------------------------------------------------------
Spirograph = function()
{
    this.data = new SpirographData ();
    this.sequence = new SpirographSequence ();
    this.randomiser = "None";
    this.watchers = new Array (Spirograph.NUM_WATCHERS);
    this.mode = Spirograph.Single;
    this.save_data = [];
}

Spirograph.Single = 1;
Spirograph.Grid = 2;        // Multiple patterns in a grid.
Spirograph.Overlay = 3;     // Multiple overlaid patterns
Spirograph.Evolve = 4;     // Multiple overlaid patterns
Spirograph.Types = ["None", "Single", "Grid", "Overlay", "Evolve"];

// Watcher indeces (keep the wheel related sets contiguous)

Spirograph.WATCH_NUM_WHEELS = 0;
Spirograph.WATCH_NUM_POINTS = 1;
Spirograph.WATCH_SYMMETRY = 2;
Spirograph.WATCH_WHEEL_RATE_1 = 3;
Spirograph.WATCH_WHEEL_RATE_2 = 4;
Spirograph.WATCH_WHEEL_RATE_3 = 5;
Spirograph.WATCH_WHEEL_RATE_4 = 6;
Spirograph.WATCH_WHEEL_RATE_5 = 7;
Spirograph.WATCH_WHEEL_PHASE_1 = 8;
Spirograph.WATCH_WHEEL_PHASE_2 = 9;
Spirograph.WATCH_WHEEL_PHASE_3 = 10;
Spirograph.WATCH_WHEEL_PHASE_4 = 11;
Spirograph.WATCH_WHEEL_PHASE_5 = 12;
Spirograph.WATCH_WHEEL_SIZE_1 = 13;
Spirograph.WATCH_WHEEL_SIZE_2 = 14;
Spirograph.WATCH_WHEEL_SIZE_3 = 15;
Spirograph.WATCH_WHEEL_SIZE_4 = 16;
Spirograph.WATCH_WHEEL_SIZE_5 = 17;
Spirograph.WATCH_FILL_COLOUR = 18;
Spirograph.WATCH_LINE_COLOUR = 19;
Spirograph.WATCH_FILL_RULE = 20;
Spirograph.WATCH_PATTERN_SIZE = 21;
Spirograph.WATCH_MODE = 21;

Spirograph.NUM_WATCHERS = 20;

Spirograph.watcher_funs = {}

Spirograph.watcher_funs [Spirograph.WATCH_NUM_WHEELS] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_NUM_WHEELS], spirograph.data.num_wheels); }
Spirograph.watcher_funs [Spirograph.WATCH_NUM_POINTS] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_NUM_POINTS], spirograph.data.num_points); }
Spirograph.watcher_funs [Spirograph.WATCH_SYMMETRY] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_SYMMETRY], spirograph.GetSymmetry()); }
Spirograph.watcher_funs [Spirograph.WATCH_WHEEL_RATE_1] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_WHEEL_RATE_1], spirograph.data.wheel_rates[0]); }
Spirograph.watcher_funs [Spirograph.WATCH_WHEEL_RATE_2] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_WHEEL_RATE_2], spirograph.data.wheel_rates[1]); }
Spirograph.watcher_funs [Spirograph.WATCH_WHEEL_RATE_3] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_WHEEL_RATE_3], spirograph.data.wheel_rates[2]); }
Spirograph.watcher_funs [Spirograph.WATCH_WHEEL_RATE_4] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_WHEEL_RATE_4], spirograph.data.wheel_rates[3]); }
Spirograph.watcher_funs [Spirograph.WATCH_WHEEL_RATE_5] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_WHEEL_RATE_5], spirograph.data.wheel_rates[4]); }
Spirograph.watcher_funs [Spirograph.WATCH_WHEEL_SIZE_1] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_WHEEL_SIZE_1], spirograph.data.wheel_sizes[0]); }
Spirograph.watcher_funs [Spirograph.WATCH_WHEEL_SIZE_2] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_WHEEL_SIZE_2], spirograph.data.wheel_sizes[1]); }
Spirograph.watcher_funs [Spirograph.WATCH_WHEEL_SIZE_3] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_WHEEL_SIZE_3], spirograph.data.wheel_sizes[2]); }
Spirograph.watcher_funs [Spirograph.WATCH_WHEEL_SIZE_4] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_WHEEL_SIZE_4], spirograph.data.wheel_sizes[3]); }
Spirograph.watcher_funs [Spirograph.WATCH_WHEEL_SIZE_5] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_WHEEL_SIZE_5], spirograph.data.wheel_sizes[4]); }
Spirograph.watcher_funs [Spirograph.WATCH_WHEEL_PHASE_1] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_WHEEL_PHASE_1], spirograph.data.wheel_phases[0]); }
Spirograph.watcher_funs [Spirograph.WATCH_WHEEL_PHASE_2] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_WHEEL_PHASE_2], spirograph.data.wheel_phases[1]); }
Spirograph.watcher_funs [Spirograph.WATCH_WHEEL_PHASE_3] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_WHEEL_PHASE_3], spirograph.data.wheel_phases[2]); }
Spirograph.watcher_funs [Spirograph.WATCH_WHEEL_PHASE_4] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_WHEEL_PHASE_4], spirograph.data.wheel_phases[3]); }
Spirograph.watcher_funs [Spirograph.WATCH_WHEEL_PHASE_5] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_WHEEL_PHASE_5], spirograph.data.wheel_phases[4]); }
Spirograph.watcher_funs [Spirograph.WATCH_FILL_COLOUR] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_FILL_COLOUR], spirograph.data.fill_colour); }
Spirograph.watcher_funs [Spirograph.WATCH_LINE_COLOUR] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_LINE_COLOUR], spirograph.data.line_colour); }
Spirograph.watcher_funs [Spirograph.WATCH_FILL_RULE] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_FILL_RULE], spirograph.data.fill_rule); }
Spirograph.watcher_funs [Spirograph.WATCH_PATTERN_SIZE] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_PATTERN_SIZE], spirograph.data.size); }
Spirograph.watcher_funs [Spirograph.WATCH_MODE] = function (spirograph) { Spirograph.SetWatcherText (spirograph.watchers [Spirograph.WATCH_MODE], Spirograph.Types[spirograph.mode]); }

//-------------------------------------------------------------------------------------------------
Spirograph.prototype.PushData = function ()
{
    this.save_data.push (this.data.Clone());
}
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.PopData = function ()
{
    if (this.save_data.length > 0)
    {
        this.data = this.save_data.pop ();
    }
}
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.AddWatcher = function (idx, element)
{
    this.watchers [idx] = element;
    Spirograph.watcher_funs [idx] (this);
}
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.CreateChildren = function (num)
{
    // Used for evolution, first child is a direct copy, others are randomised

    var ret = [];
    for (var i = 0 ; i < num ; ++i)
    {
        var sg = new Spirograph ();

        sg.data = this.data.Clone ();
        sg.mode = Spirograph.Single;
        ret.push (sg);
    }
    for (var i = 1 ; i < num ; ++i)
    {
        ret [i].Randomise ();
    }
    return ret;
}
//-------------------------------------------------------------------------------------------------
// Draw the spirograph
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.Draw = function (element_name, size)
{
    var element = document.getElementById(element_name);

    if (element) element.innerHTML = this.GetSVG (size);
}
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.GetSVG = function (size)
{
    switch (this.mode)
    {
        case Spirograph.Single:
            return this.GetSingleSVG (size);

        case Spirograph.Grid:
            return this.GetGridSVG (size, 3, 4);
            break;

        case Spirograph.Overlay:
            return this.GetSequenceSVG (size);
            break;

        case Spirograph.Evolve:
            break;
    }
}
//-------------------------------------------------------------------------------------------------
// Draw the spirograph
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.GetSingleSVG = function (size)
{
    return this.SVGHeader (size) + this.SVGBody (0, 0, size) + this.SVGTail ();
}
//-------------------------------------------------------------------------------------------------
// Draws a sequence of superimposed spirographs
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.GetSequenceSVG = function (size)
{
    var svg = this.SVGHeader (size);

    this.PushData ();
    this.data.line_colour = this.sequence.line_colour_sequence [0];

    if (this.data.fill_rule == "evenodd" || this.data.fill_rule == "nonzero")
    {
        this.data.fill_rule == "none";
    }

    for (var i = 0 ; i < this.sequence.sequence_length ; ++i)
    {
        svg += this.SVGBody (0, 0, size);
        this.Advance (this.sequence, i);
    }

    this.PopData ();

    svg += this.SVGTail ();
    return svg;
}
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.SVGBody = function (xpos, ypos, size)
{
    if (this.data.fill_rule == "dashed")
    {
        return this.SVGDashedBody (xpos, ypos, size)
    }

    var radius = 0;
    var phases = [0,0,0,0,0];

    // Calculate total radius and convert phases to radians

    for (i = 0 ; i < this.data.num_wheels ; i++)
    {
        radius += Math.abs (this.data.wheel_sizes [i]);
        phases [i] = this.data.wheel_phases [i] * Math.PI / 180;
    }

    var w = size / 2;
    var factor = this.data.scale * (w - 10) / radius;
    var k = 2 * Math.PI / this.data.num_points;
    var points = "";

    for (i = 0 ; i < this.data.num_points ; i++)
    {
        var a = i * k;
        var x = 0;
        var y = 0;

        for (j = 0 ; j < this.data.num_wheels ; j++)
        {
            a2 = a * this.data.wheel_rates [j] + phases [j];
            x += this.data.wheel_sizes [j] * Math.sin (a2);
            y += this.data.wheel_sizes [j] * Math.cos (a2);
        }

        x = xpos + x * factor;
        y = ypos + y * factor;

        points += x + "," + y + " ";
    }

    var ret = "<polygon points=\"" + points + "\"";
    ret += " style=\"stroke-width:1;";

    if (this.data.fill_rule == 'none')
    {
        ret += "fill:none;";
    }
    else
    {
        ret += "fill:" + this.data.fill_colour + ";";
        ret += "fill-rule:" + this.data.fill_rule + ";";
    }
    ret += "stroke:" + this.data.line_colour + ";";
    ret += "\"/>";
    return ret;
}
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.SVGDashedBody = function (xpos, ypos, size)
{
    var radius = 0;
    var phases = [0,0,0,0,0];
    var ret = "";

    // Calculate total radius and convert phases to radians

    for (i = 0 ; i < this.data.num_wheels ; i++)
    {
        radius += Math.abs (this.data.wheel_sizes [i]);
        phases [i] = this.data.wheel_phases [i] * Math.PI / 180;
    }

    var w = size / 2;
    var factor = this.data.scale * (w - 10) / radius;
    var k = 2 * Math.PI / this.data.num_points;
    var num_points = ((this.data.num_points % 2) == 0) ? this.data.num_points : (this.data.num_points + 1);
    var p1, p2;

    for (i = 0 ; i < num_points ; i++)
    {
        var a = i * k;
        var x = 0;
        var y = 0;

        for (j = 0 ; j < this.data.num_wheels ; j++)
        {
            a2 = a * this.data.wheel_rates [j] + phases [j];
            x += this.data.wheel_sizes [j] * Math.sin (a2);
            y += this.data.wheel_sizes [j] * Math.cos (a2);
        }
        x = xpos + x * factor;
        y = ypos + y * factor;

        if ((i % 2) == 0)
        {
            p1 = [x, y];
        }
        else
        {
            ret += SVGHelp.Line (p1, [x,y], this.data.line_colour);
        }
    }
    return ret;
}

//-------------------------------------------------------------------------------------------------
Spirograph.prototype.SVGHeader = function (size)
{
    var w = size / 2;
    var ret = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\"";

    ret += " width=\"" + size + "\" height=\"" + size + "\"";
    ret += " viewBox=\"" + -w + "," + -w + "," + 2*w + "," + 2*w + "\">";

    return ret;
}
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.SVGTail = function ()
{
    return "</svg>";
}
//-------------------------------------------------------------------------------------------------
// Draws Nx x Ny patterns in a grid
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.GetGridSVG = function (size)
{
    var Nx = Math.ceil (Math.sqrt (3 * this.sequence.sequence_length / 4));
    var Ny = Math.ceil (this.sequence.sequence_length / Nx);

    var svg = this.StartSVGGrid (size, Nx, Ny);
    var count = 0;
    var scale_factor = this.sequence.scale_factor;

    this.sequence.scale_factor = 1;

    this.PushData ();
    this.data.scale = 1 / Nx;
    this.data.line_colour = this.sequence.line_colour_sequence [0];

    for (var x = 0 ; x < Nx && count < this.sequence.sequence_length ; ++x)
    {
        var xpos = (2 * x + 1) * size / (2 * Nx);
        for (var y = 0 ; y < Ny && count < this.sequence.sequence_length ; ++y, ++ count)
        {
            var ypos = (2 * y + 1) * size / (2 * Nx);
            svg += this.SVGBody (xpos, ypos, size);
            this.Advance (this.sequence, count);
        }
    }

    this.PopData ();
    this.sequence.scale_factor = scale_factor;

    svg += this.SVGTail ();
    return svg;
}
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.StartSVGGrid = function (size, Nx, Ny)
{
    var height = Math.floor(size * Ny / Nx);
    var ret = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\"";

    ret += " width=\"" + size + "\" height=\"" + height + "\"";
    ret += " viewBox=\"" + 0 + "," + 0 + "," + size + "," + height + "\">";

    for (var i = 0 ; i <= Nx ; ++i)
    {
        var x = Math.round(size * i / Nx);
        ret += SVGHelp.Line ([x,0], [x,height], "black");
    }
    for (var i = 0 ; i <= Ny ; ++i)
    {
        var y = Math.round(height * i / Ny);
        ret += SVGHelp.Line ([0,y], [size,y], "black");
    }

    return ret;
}
//-------------------------------------------------------------------------------------------------
Spirograph.SetWatcherText = function (where, text)
{
    var elem = document.getElementById(where);

    if (elem) elem.innerHTML = text;
}
//-------------------------------------------------------------------------------------------------
// Increase the number of points used to draw the spirograph
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.IncrementPoints = function (delta)
{
    this.data.num_points += delta;

    if (this.data.num_points < SpirographData.min_points) this.data.num_points = SpirographData.min_points;
    if (this.data.num_points > SpirographData.max_points) this.data.num_points = SpirographData.max_points;

    Spirograph.watcher_funs [Spirograph.WATCH_NUM_POINTS] (this);
}
//-------------------------------------------------------------------------------------------------
// Increase the number of wheels used to construct the pattern
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.IncrementWheels = function (delta)
{
    this.data.num_wheels += delta;

    if (this.data.num_wheels < SpirographData.min_wheels) this.data.num_wheels = SpirographData.min_wheels;
    if (this.data.num_wheels > SpirographData.max_wheels) this.data.num_wheels = SpirographData.max_wheels;

    Spirograph.watcher_funs [Spirograph.WATCH_NUM_WHEELS] (this);
    Spirograph.watcher_funs [Spirograph.WATCH_SYMMETRY] (this);
}
//-------------------------------------------------------------------------------------------------
// Set the fill colour
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.SetFillColour = function (colour)
{
    this.data.fill_colour = colour;
    Spirograph.watcher_funs [Spirograph.WATCH_FILL_COLOUR] (this);
}
//-------------------------------------------------------------------------------------------------
// Set the fill colour
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.SetFillRule = function (rule)
{
    this.data.fill_rule = rule;
    Spirograph.watcher_funs [Spirograph.WATCH_FILL_RULE] (this);
}
//-------------------------------------------------------------------------------------------------
// Set the fill colour
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.SetLineColour = function (colour)
{
    this.data.line_colour = colour;
    Spirograph.watcher_funs [Spirograph.WATCH_LINE_COLOUR] (this);
}
//-------------------------------------------------------------------------------------------------
// Set the fill colour
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.SetSize = function (new_size)
{
    if (new_size >= SpirographData.min_size && new_size <= SpirographData.max_size)
    {
        this.data.size = new_size;
    }
}
//-------------------------------------------------------------------------------------------------
// Set the fill colour
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.SetMode = function (mode)
{
    if (Spirograph.Types[mode])
    {
        this.mode = mode;
    }
    Spirograph.watcher_funs [Spirograph.WATCH_MODE] (this);
}
//-------------------------------------------------------------------------------------------------
// Set the fill colour
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.IncrementSize = function (delta)
{
    new_size = this.size + delta;

    if (new_size > 0)
    {
        this.SetSize (this.data.size + delta);
    }
}
//-------------------------------------------------------------------------------------------------
// Update a wheel's size
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.SetWheelSize = function (wheel, delta)
{
    if (wheel >= 0 && wheel < SpirographData.max_wheels)
    {
        new_size = this.data.wheel_sizes [wheel] + delta;
        if (new_size < 1) new_size = 1;
        this.data.wheel_sizes [wheel] = new_size;
        Spirograph.watcher_funs [Spirograph.WATCH_WHEEL_SIZE_1 + wheel] (this);
    }
}
//-------------------------------------------------------------------------------------------------
// Update a wheel's rate
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.SetWheelRate = function (wheel, delta)
{
    var new_rate = this.data.wheel_rates [wheel] + delta;

    this.ChangeWheelRate (wheel, new_rate);
}
//-------------------------------------------------------------------------------------------------
// Update a wheel's rate
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.ChangeWheelRate = function (wheel, new_rate)
{
    if (wheel >= 0 && wheel < SpirographData.max_wheels)
    {
        this.data.wheel_rates [wheel] = new_rate;

        Spirograph.watcher_funs [Spirograph.WATCH_WHEEL_RATE_1 + wheel] (this);
        Spirograph.watcher_funs [Spirograph.WATCH_SYMMETRY] (this);
    }
}
//-------------------------------------------------------------------------------------------------
// Update a wheel's phase
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.SetWheelPhase = function (wheel, delta)
{
    if (wheel >= 0 && wheel < SpirographData.max_wheels)
    {
        new_phase = (this.data.wheel_phases [wheel] + delta) % 360;
        if (new_phase < 0) new_phase += 360;
        this.data.wheel_phases [wheel] = new_phase;
        Spirograph.watcher_funs [Spirograph.WATCH_WHEEL_PHASE_1 + wheel] (this);
    }
}
//-------------------------------------------------------------------------------------------------
// Animate the wheel phases
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.Animate = function ()
{
    for (wheel = 0 ; wheel < SpirographData.max_wheels ; ++wheel)
    {
        this.SetWheelPhase (wheel, this.sequence.phase_deltas [wheel]);
    }
}
//-------------------------------------------------------------------------------------------------
// Increase/decrease the symmetry of the pattern
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.IncrementSymmetry = function (delta)
{
    symm = this.GetSymmetry ();

    if (symm == 0) return;
    if (symm < 0) symm = - symm;

    symm += delta;

    if (symm > 1)
    {
        this.EnforceSymmetry (symm, 1);
    }
    Spirograph.watcher_funs [Spirograph.WATCH_SYMMETRY] (this);
}
//-------------------------------------------------------------------------------------------------
// Adjust wheels 2-N to make the pattern symetrical
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.MakeSymmetrical = function ()
{
    symm = this.GetSymmetry ();

    this.EnforceSymmetry (symm, 2);
    Spirograph.watcher_funs [Spirograph.WATCH_SYMMETRY] (this);
}
//-------------------------------------------------------------------------------------------------
// Make an example pattern
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.MakeExample = function ()
{
    this.data.num_wheels = 2;
    this.data.num_points = 298;
    this.data.wheel_rates [0] = 6;
    this.data.wheel_rates [1] = 79;
    this.data.line_colour = "black";
    this.data.fill_colour = "blue";
    this.data.fill_rule = "evenodd";
}
//-------------------------------------------------------------------------------------------------
// Randomise the number of wheels
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.RandomiseWheels = function ()
{
    this.randomiser = "Wheels";

    if (this.data.num_wheels == SpirographData.min_wheels)
    {
        this.data.num_wheels += 1;
    }
    else if (this.data.num_wheels == SpirographData.max_wheels)
    {
        this.data.num_wheels -= 1;
    }
    else
    {
        this.data.num_wheels += (Math.random () > 0.5) ? 1 : -1;
    }
}
//-------------------------------------------------------------------------------------------------
// Randomise the number of points
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.RandomisePoints = function (increase)
{
    var mode = RandomInteger(4);
    this.randomiser = "Points: " + mode;

    switch (mode)
    {
    case 0:
        this.data.num_points *= (2 + RandomInteger (3));
        break;
    case 1:
        this.data.num_points /= (2 + RandomInteger (3));
        break;
    case 2:
        this.data.num_points = this.GetSymmetry () * 100;
        break;
    case 3:
        this.data.num_points = this.GetSymmetry () * (1 + RandomInteger(6));
        break;
    }

    this.data.num_points = Math.round (this.data.num_points);
    if (this.data.num_points < SpirographData.min_points) this.data.num_points = SpirographData.min_points;
    if (this.data.max_points > SpirographData.max_points) this.data.num_points = SpirographData.max_points;
}
//-------------------------------------------------------------------------------------------------
// Randomise the size of a wheel
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.RandomiseWheelSize = function ()
{
    var wheel = RandomInteger (this.data.num_wheels);

    this.randomiser = "Wheel-size " + wheel;
    this.SetWheelSize (wheel, RandomInteger (5) - 2);
}
//-------------------------------------------------------------------------------------------------
// Randomise the rate of a wheel
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.RandomiseWheelRate = function ()
{
    var wheel = RandomInteger (this.data.num_wheels);
    var mode = RandomInteger(3);
    this.randomiser = "Wheel-rate [" + wheel + "][" + mode + "]";

    switch (mode)
    {
        case 0:
            this.SetWheelRate (wheel, RandomInteger (5) - 2);
            break;
        case 1:
            this.ChangeWheelRate (wheel, RandomInteger (25) - 12);
            break;
        case 2:
            var next = this.data.num_points;
            next = Math.round((RandomInteger (6) - 3) + next / (2 + RandomInteger (4)));
            this.ChangeWheelRate (wheel, next);
            break;
    }
}
//-------------------------------------------------------------------------------------------------
// Randomise the phase of a wheel
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.RandomiseWheelPhase = function ()
{
    var wheel = RandomInteger (this.data.num_wheels);

    this.randomiser = "Wheel-phase " + wheel;
    this.SetWheelPhase (wheel, RandomInteger (360));
}
//-------------------------------------------------------------------------------------------------
// Randomise the fill colour
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.RandomiseFillColour = function ()
{
    var c = SVGColours.RandomNamedColour ();

    this.randomiser = "Fill colour: " + c;
    this.data.fill_colour = c;
}
//-------------------------------------------------------------------------------------------------
// Randomise the line colour
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.RandomiseLineColour = function ()
{
    if (this.data.fill_colour == "None" || this.line_colour != "black")
    {
        this.data.line_colour = "black";
    }
    else
    {
        this.data.line_colour = SVGColours.RandomNamedColour ();
    }
    this.randomiser = "Line colour " + this.data.line_colour;
    Spirograph.watcher_funs [Spirograph.WATCH_LINE_COLOUR] (this);
}
//-------------------------------------------------------------------------------------------------
// Randomise the fill mode
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.RandomiseFillMode = function ()
{
    var next;
    var previous = this.data.fill_rule;

    do
    {
        next = SpirographData.fill_options [RandomInteger (4)];
    }
    while (next == previous);

    this.data.fill_rule = next;
    this.randomiser = "Fill rule " + this.data.fill_rule;

    Spirograph.watcher_funs [Spirograph.WATCH_FILL_RULE] (this);
}
//-------------------------------------------------------------------------------------------------
// Randomise the phase deltas
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.RandomisePhaseDeltas = function ()
{
    this.randomiser = "Phase deltas";

    for (wheel = 0 ; wheel < SpirographData.max_wheels ; ++wheel)
    {
        if (RandomInteger (2) == 0)
        {
            this.sequence.phase_deltas [wheel] = 0;
        }
        else
        {
            this.sequence.phase_deltas [wheel] = RandomInteger (11) - 5;
        }
    }
}
//-------------------------------------------------------------------------------------------------
// Randomise - takes a single attribute and randomises it
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.Randomise = function ()
{
    var list;

    // Prefer changing shape to colours

    if (RandomInteger (5) == 1)
    {
        this.RandomiseStyle ();
    }
    else
    {
        this.RandomisePattern ();
    }
}
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.RandomisePattern = function ()
{
    var n = RandomInteger (6);

    switch (n)
    {
        case 0:
            this.RandomiseWheels ();
            break;

        case 1:
            this.RandomiseWheelSize ();
            break;

        case 2:
            this.RandomiseWheelRate ();
            break;

        case 3:
            this.RandomiseWheelPhase ();
            break;

        case 4:
            this.RandomisePhaseDeltas ();
            break;

        case 5:
            this.RandomisePoints ();
            break;
    }
}
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.RandomiseStyle = function ()
{
    var n = RandomInteger (4);

    switch (n)
    {
        case 0:
            this.RandomiseFillColour ();
            break;

        case 1:
            this.RandomiseLineColour ();
            break;

        case 2:
        case 3:
            this.RandomiseFillMode ();
            break;
    }
}
//-------------------------------------------------------------------------------------------------
// Display the current settings
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.DisplaySettings = function(element_name)
{
    var element = document.getElementById(element_name);

    if (element != null)
    {
        sizes = "";
        rates = "";
        phases = "";
        phase_deltas = "";

        for (i = 0 ; i < this.data.num_wheels ; ++i)
        {
            if (i != 0)
            {
                sizes += ", ";
                rates += ", ";
                phases += ", ";
                phase_deltas += ", ";
            }
            sizes += this.data.wheel_sizes [i];
            rates += this.data.wheel_rates [i];
            phases += this.data.wheel_phases [i];
            phase_deltas += this.sequence.phase_deltas [i];
        }

        text = "<table>";

        text += "<tr><td>Num wheels:</td><td>" + this.data.num_wheels + "</td></tr>";
        text += "<tr><td>Num points:</td><td>" + this.data.num_points + "</td></tr>";
        text += "<tr><td>Wheel sizes:</td><td>" + sizes + "</td></tr>";
        text += "<tr><td>Wheel rates:</td><td>" + rates + "</td></tr>";
        text += "<tr><td>Wheel phases:</td><td>" + phases + "</td></tr>";
        text += "<tr><td>Wheel phase deltas:</td><td>" + phase_deltas + "</td></tr>";
        text += "<tr><td>Line:</td><td>" + this.data.line_colour + "</td></tr>";
        text += "<tr><td>Fill:</td><td>" + this.data.fill_colour + "</td></tr>";
        text += "<tr><td>Fill rule:</td><td>" + this.data.fill_rule + "</td></tr>";
        text += "<tr><td>Randomiser:</td><td>" + this.randomiser + "</td></tr>";

        text += "</table>";

        element.innerHTML = text;
    }
}
//-------------------------------------------------------------------------------------------------
// Get the symmetry
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.GetSymmetry = function()
{
   symm = this.data.wheel_rates [1] - this.data.wheel_rates [0];
   if (symm < 0) symm = -symm;
   div = hcf (symm, this.data.wheel_rates [0]);
   return symm / div;
}
//-------------------------------------------------------------------------------------------------
// Creates a pattern with the requested symmetry
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.EnforceSymmetry = function(symm, first_wheel)
{
    // Make the number of points a multiple of the symmetry;

    temp = Math.floor ((this.data.num_points + symm - 1) / symm);
    this.data.num_points = temp * symm;

    // Adjust the wheels (1st two wheels define the symmetry)

    if (first_wheel == 1)
    {
        if (this.data.wheel_rates [1] > this.data.wheel_rates [0])
        {
            this.data.wheel_rates [1] = this.data.wheel_rates [0] + symm;
        }
        else
        {
            this.data.wheel_rates [1] = this.data.wheel_rates [0] - symm;
        }
    }

    // Elliminate degenerate patterns

    while (this.data.wheel_rates [0] == 0 || this.data.wheel_rates [1] == 0 || hcf (this.data.wheel_rates [1], this.data.wheel_rates [0]) > 1)
    {
        this.data.wheel_rates [0] += 1;
        this.data.wheel_rates [1] += 1;
    }

    // remaining wheels take the symmetry from the first two

    for (i = 2 ; i < this.num_wheels ; ++i)
    {
        delta = this.wheel_rates [i] - this.wheel_rates [0];
        temp = Math.floor ((delta + symm - 1) / symm);
        this.wheel_rates [i] = this.wheel_rates [0] + temp * symm;
    }
}
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.Advance = function (seq, pos)
{
    this.data.num_points += seq.points_delta;
    this.data.scale *= seq.scale_factor;

    for (var i = 0 ; i < SpirographData.max_wheels ; ++i)
    {
        this.data.wheel_sizes [i] += seq.size_deltas [i];
        this.data.wheel_rates [i] += seq.rate_deltas [i];
        this.data.wheel_phases [i] += seq.phase_deltas [i];
    }

    if (this.data.num_points < 3) this.data.num_points = 3;

    var colour = pos * (seq.line_colour_sequence.length - 1) / (seq.sequence_length - 1);
    var idx1 = Math.floor (colour);
    var factor = colour - idx1;
    var idx2 = idx1+1;

    if (idx2 == seq.line_colour_sequence.length) --idx2;

    var c1 = seq.line_colour_sequence[idx1];
    var c2 = seq.line_colour_sequence[idx2];

    blend = SVGColours.Blend (c1, c2, 1 - factor);

    this.data.line_colour = blend;
}
//-------------------------------------------------------------------------------------------------
// Get a random integer in the range (0 - n-1)
//-------------------------------------------------------------------------------------------------
RandomInteger = function (n)
{
    ret = Math.floor (Math.random () * n);
    if (ret == n) ret = n-1;
    return ret;
}
//-------------------------------------------------------------------------------------------------
// Get the highest common factor
//-------------------------------------------------------------------------------------------------
function hcf (x, y)
{
    x = Math.round (x);
    y = Math.round (y);

    if (x == 0 || y == 0) return 1;

    if (x < 0) x = -x;
    if (y < 0) y = -y;

    return hcf2 (x, y)
}
function hcf2 (x, y)
{
    if (x == 1 || y == 1) return 1;
    if (x == y) return x;

    return (x > y) ? hcf2 (x-y,x) : hcf2 (x,y-x);
}

