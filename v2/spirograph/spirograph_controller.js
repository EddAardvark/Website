//-------------------------------------------------------------------------------------------------
// Javascript spirograph controller class definition
// (c) John Whitehouse 2013 - 2019
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
// A controller
// Requires:
//  js_library/tab_bar.js
//  js_library/animation.js
//-------------------------------------------------------------------------------------------------
SpirographController = function ()
{
}

SpirographController.None = 0;
SpirographController.Single = 1;
SpirographController.Grid = 2;          // Multiple patterns in a grid.
SpirographController.Overlay = 3;       // Multiple overlaid patterns
SpirographController.Evolve = 4;        // Multiple overlaid patterns
SpirographController.BigSplit = 5;      // Big split pattern
SpirographController.BigSingle = 6;     // Big single pattern
SpirographController.BigOverlay = 7;    // Big Overlay
SpirographController.Split = 8;         // Draws second patterns at the locations of the points of the first

SpirographController.Types = ["None", "Single", "Grid", "Overlay", "Evolve"];


// Watcher indeces (keep the wheel related sets contiguous)

SpirographController.WATCH_NUM_WHEELS    = 0;
SpirographController.WATCH_NUM_POINTS    = SpirographController.WATCH_NUM_WHEELS    + 1; 
SpirographController.WATCH_SYMMETRY      = SpirographController.WATCH_NUM_POINTS    + 1;
SpirographController.WATCH_WHEEL_RATE_1  = SpirographController.WATCH_SYMMETRY      + 1;
SpirographController.WATCH_WHEEL_RATE_2  = SpirographController.WATCH_WHEEL_RATE_1  + 1;
SpirographController.WATCH_WHEEL_RATE_3  = SpirographController.WATCH_WHEEL_RATE_2  + 1;
SpirographController.WATCH_WHEEL_RATE_4  = SpirographController.WATCH_WHEEL_RATE_3  + 1;
SpirographController.WATCH_WHEEL_RATE_5  = SpirographController.WATCH_WHEEL_RATE_4  + 1;
SpirographController.WATCH_WHEEL_PHASE_1 = SpirographController.WATCH_WHEEL_RATE_5  + 1;
SpirographController.WATCH_WHEEL_PHASE_2 = SpirographController.WATCH_WHEEL_PHASE_1 + 1;
SpirographController.WATCH_WHEEL_PHASE_3 = SpirographController.WATCH_WHEEL_PHASE_2 + 1;
SpirographController.WATCH_WHEEL_PHASE_4 = SpirographController.WATCH_WHEEL_PHASE_3 + 1;
SpirographController.WATCH_WHEEL_PHASE_5 = SpirographController.WATCH_WHEEL_PHASE_4 + 1;
SpirographController.WATCH_WHEEL_SIZE_1  = SpirographController.WATCH_WHEEL_PHASE_5 + 1;
SpirographController.WATCH_WHEEL_SIZE_2  = SpirographController.WATCH_WHEEL_SIZE_1  + 1;
SpirographController.WATCH_WHEEL_SIZE_3  = SpirographController.WATCH_WHEEL_SIZE_2  + 1;
SpirographController.WATCH_WHEEL_SIZE_4  = SpirographController.WATCH_WHEEL_SIZE_3  + 1;
SpirographController.WATCH_WHEEL_SIZE_5  = SpirographController.WATCH_WHEEL_SIZE_4  + 1;
SpirographController.WATCH_FILL_RULE     = SpirographController.WATCH_WHEEL_SIZE_5  + 1;
SpirographController.WATCH_PHASE_DELTA_1 = SpirographController.WATCH_FILL_RULE     + 1;
SpirographController.WATCH_PHASE_DELTA_2 = SpirographController.WATCH_PHASE_DELTA_1 + 1;
SpirographController.WATCH_PHASE_DELTA_3 = SpirographController.WATCH_PHASE_DELTA_2 + 1;
SpirographController.WATCH_PHASE_DELTA_4 = SpirographController.WATCH_PHASE_DELTA_3 + 1;
SpirographController.WATCH_PHASE_DELTA_5 = SpirographController.WATCH_PHASE_DELTA_4 + 1;
SpirographController.WATCH_MODE          = SpirographController.WATCH_PHASE_DELTA_5 + 1;

SpirographController.NUM_WATCHERS        = SpirographController.WATCH_MODE + 1;  // Counter

SpirographController.watchers = [];

//--------------------------------------------------------------------------------------------------------------------------
// Session management
//--------------------------------------------------------------------------------------------------------------------------
SpirographController.prototype.Initialise = function ()
{
    var tb = new TabBar ();

    tb.AddButton ("Setup", "setup", "Setup &#x25bc", "Setup");
    tb.AddButton ("Size", "wheelsizes", "Wheel Size &#x25bc", "Wheel Size");
    tb.AddButton ("Rate", "wheelrates", "Wheel Rate &#x25bc", "Wheel Rate");
    tb.AddButton ("Phse", "wheelphases", "Wheel Phase &#x25bc", "Wheel Phase");
    tb.AddButton ("DP", "phasedeltas", "&Delta; Phase &#x25bc", "&Delta; Phase");
    tb.AddButton ("Fill", "fill", "Fill &#x25bc", "Fill");
    tb.AddButton ("Overlay", "overlay", "Overlay &#x25bc", "Overlay");
    tb.AddButton ("Split", "split", "Split &#x25bc", "Split");
    tb.AddButton ("Extras", "extras", "Extras &#x25bc", "Extras");
    tb.AddButton ("Print", "print", "Print &#x25bc", "Print");

    TabBar.OPEN_STYLE = "background-color:blue; color:white;"

    tb.Show("buttons");
    tb.SetInitialTab ("Setup");

    SpirographController.animation_target = this;

    this.animator = new Animator (SpirographController.DoAnimation, 50);
    this.print_size = 1024;
    this.image_size = 500;
    this.draw_to = picture;
    this.auto_animate = false;
    this.auto_count = 0;
    this.auto_limit = 100;
    this.mode = SpirographController.Single;
    this.gridx = 1;
    this.gridy = 1;

    print_size.value = this.print_size;
    
    SVGColours.AddColours (fill_colour);
    SVGColours.AddColours (line_colour, true);
    SVGColours.AddColours (back_colour, true);
    SVGColours.AddColours (seq_addfill);
    SVGColours.AddColours (seq_addline);
    SVGColours.AddColours (split_addfill);
    SVGColours.AddColours (split_addline);
    
    this.StartNew();    
}
SpirographController.prototype.StartNew = function ()
{
    this.spirograph = SpirographData.GetDefault (); 
    this.sequence = new SpirographSequence.GetDefault (); 
    this.split = new SpirographSplit.GetDefault (); 
    this.sequence.SetConfig(); 
    this.split.SetConfig (); 
    this.evolution = new SpirographEvolution.GetDefault (); 
    this.AttachWatchers (); 
    this.SetMode (SpirographController.Single);
    this.DisplayStatus ();
}


 SpirographController.OnMouseEnter = function (event)
 {
     SpirographController.ShowTT (event.clientX, event.clientY, event.currentTarget.id);
 }
 
 SpirographController.OnMouseExit = function (x)
 {
     SpirographController.HidePopup ();
 }
 
// Show a spirograph's configuration on the UI
SpirographController.prototype.DisplayStatus = function ()
{
    this.DisplaySpirographStatus (this.spirograph);
}

// Show a spirograph's configuration on the UI
SpirographController.prototype.DisplaySpirographStatus = function (data)
{
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_NUM_WHEELS], data.num_wheels);
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_NUM_POINTS], data.num_points);
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_SYMMETRY], data.GetSymmetry());

    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_WHEEL_RATE_1], data.wheel_rates[0]);
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_WHEEL_RATE_2], data.wheel_rates[1]);
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_WHEEL_RATE_3], data.wheel_rates[2]);
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_WHEEL_RATE_4], data.wheel_rates[3]);
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_WHEEL_RATE_5], data.wheel_rates[4]);

    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_WHEEL_SIZE_1], data.wheel_sizes[0]);
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_WHEEL_SIZE_2], data.wheel_sizes[1]);
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_WHEEL_SIZE_3], data.wheel_sizes[2]);
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_WHEEL_SIZE_4], data.wheel_sizes[3]);
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_WHEEL_SIZE_5], data.wheel_sizes[4]);

    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_WHEEL_PHASE_1], Misc.FloatToText (data.wheel_phases[0],3));
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_WHEEL_PHASE_2], Misc.FloatToText (data.wheel_phases[1],3));
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_WHEEL_PHASE_3], Misc.FloatToText (data.wheel_phases[2],3));
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_WHEEL_PHASE_4], Misc.FloatToText (data.wheel_phases[3],3));
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_WHEEL_PHASE_5], Misc.FloatToText (data.wheel_phases[4],3));

    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_PHASE_DELTA_1], Misc.FloatToText (data.phase_deltas[0],2));
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_PHASE_DELTA_2], Misc.FloatToText (data.phase_deltas[1],2));
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_PHASE_DELTA_3], Misc.FloatToText (data.phase_deltas[2],2));
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_PHASE_DELTA_4], Misc.FloatToText (data.phase_deltas[3],2));
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_PHASE_DELTA_5], Misc.FloatToText (data.phase_deltas[4],2));

    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_FILL_RULE], data.fill_rule);
    SpirographController.SetWatcherText (SpirographController.watchers [SpirographController.WATCH_MODE], SpirographController.Types[data.mode]);
    
    fill_colour.value = this.spirograph.fill_colour;
    line_colour.value = this.spirograph.line_colour;
    back_colour.value = this.spirograph.back_colour;
}

//--------------------------------------------------------------------------------------------------------------------------------------------

SpirographController.prototype.GoBig = function ()
{
    switch (this.mode)
    {
        case SpirographController.Evolve:
        case SpirographController.Grid:
        case SpirographController.BigSingle:
        case SpirographController.BigOverlay:
        case SpirographController.BigSplit:
            // Already big
            break;
            
        case SpirographController.Single:
            this.SetMode (SpirographController.BigSingle);
            break;
            
        case SpirographController.Overlay:
            this.SetMode (SpirographController.BigOverlay);
            break;
            
        case SpirographController.Split:
            this.SetMode (SpirographController.BigSplit);
            break;
            
        default:
            break;
    }
}
    
//--------------------------------------------------------------------------------------------------------------------------------------------

SpirographController.prototype.StartEvolution = function ()
{
    switch (this.mode)
    {
        case SpirographController.Single:
            this.evolution.SetParent (this.spirograph, SpirographController.Single);
            break;            
                 
        case SpirographController.Overlay:
            this.evolution.SetParent (this.sequence, SpirographController.Overlay);
            break;
            
        case SpirographController.Split:
            this.evolution.SetParent (this.split, SpirographController.Split);
            break; 
    }
    this.SetMode (SpirographController.Evolve);
}
    
//--------------------------------------------------------------------------------------------------------------------------------------------

SpirographController.prototype.SetMode = function (m)
{
    var prev = this.mode;
    this.mode = m;
    
    switch (this.mode)
    {
        case SpirographController.Evolve:
            this.ShowGrid ("Evolution");
            this.StopAnimation ();
            break;
            
        case SpirographController.Single:
            this.ShowPicture ();
            break;
            
        case SpirographController.Grid:
            this.ShowGrid ("Overlay Grid");
            this.StopAnimation ();
            this.UpdateOverlay ();
            break;
            
        case SpirographController.Overlay:
            this.ShowPicture ();
            this.UpdateOverlay ();
            break;    
            
        case SpirographController.Split:
            this.ShowPicture ();
            this.UpdateSplit ();
            break;            
            
        case SpirographController.BigSingle:
            this.ShowGrid ("Pattern");
            break;
            
        case SpirographController.BigOverlay:
            this.ShowGrid ("Overlay");
            this.UpdateOverlay ();
            break;
            
        case SpirographController.BigSplit:
            this.ShowGrid ("Overlay");
            this.UpdateOverlay ();
            break;
            
        default:
            break;
    }
        
    this.Redraw ();
}
SpirographController.prototype.ExitGridMode = function ()
{
    switch (this.mode)
    {
        case SpirographController.Evolve:
            this.ExitEvolveMode ();
            break;
            
        case SpirographController.Single:
        case SpirographController.BigSingle:        
            this.SetMode(SpirographController.Single);
            break;
            
        case SpirographController.Grid:
        case SpirographController.Overlay:
        case SpirographController.BigOverlay:
            this.SetMode(SpirographController.Overlay);
            break;

        case SpirographController.Split:
        case SpirographController.BigSplit:
            this.SetMode(SpirographController.Split);
            break;
    }
}
SpirographController.prototype.ExitEvolveMode = function ()
{
    switch (this.evolution.mode)
    {            
        case SpirographController.Single:
            this.spirograph = this.evolution.parent;
            this.SetMode(SpirographController.Single);
            break;
        case SpirographController.Overlay:
            this.evolution.parent.SetConfig ();
            this.SetMode(SpirographController.Overlay);
            break;
        case SpirographController.Split:
            this.evolution.parent.SetConfig ();
            this.SetMode(SpirographController.Split);
            break;
    }
}

SpirographController.prototype.ShowPicture = function ()
{
    evolve_mode.style.display = "none";
    normal_mode.style.display = "block";
    this.image_size = 500;
    this.draw_to = picture;
}
SpirographController.prototype.ShowGrid = function (title)
{
    evolve_mode.style.display = "block";
    normal_mode.style.display = "none";  
    grid_title.innerHTML = title;
    this.image_size = 1024;
    this.draw_to = grid;
}
//--------------------------------------------------------------------------------------------------------------------------------------------

SpirographController.prototype.Redraw = function ()
{
    this.Draw (this.draw_to, this.image_size);
    this.ShowCurrentStatus (details);
}
//--------------------------------------------------------------------------------------------------------------------------------------------

SpirographController.prototype.Draw = function (element, size)
{
    element.innerHTML = this.GetSVG (size);
}
//-------------------------------------------------------------------------------------------------
SpirographController.prototype.GetSVG = function (size)
{
    switch (this.mode)
    {
        case SpirographController.Single:
        case SpirographController.BigSingle:
            return this.SVGHeader (size) + this.spirograph.GetSVG (0, 0, size/2-10) + this.SVGTail ();

        case SpirographController.Grid:
            return this.GetGridSVG (size, this.sequence.frames);
            break;

        case SpirographController.Overlay:
        case SpirographController.BigOverlay:
            return this.SVGHeader (size) + this.sequence.GetSVG (0, 0, size/2-10) + this.SVGTail ();
            break;

        case SpirographController.Split:
        case SpirographController.BigSplit:
            return this.SVGHeader (size) + this.split.GetSVG (0, 0, size/2-10) + this.SVGTail ();
            break;

        case SpirographController.Evolve:
            return this.GetGridSVG (size, this.evolution.children);
            break;
    }
}
//-------------------------------------------------------------------------------------------------
SpirographController.prototype.SVGHeader = function (size)
{
    var w = size / 2;
    var ret = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\"";

    ret += " width=\"" + size + "\" height=\"" + size + "\"";
    ret += " viewBox=\"" + -w + "," + -w + "," + 2*w + "," + 2*w + "\">";

    return ret;
}
//-------------------------------------------------------------------------------------------------
SpirographController.prototype.SVGTail = function ()
{
    return "</svg>";
}
//-------------------------------------------------------------------------------------------------
// Drawsa sequence of patterns in a grid
//-------------------------------------------------------------------------------------------------
SpirographController.prototype.GetGridSVG = function (width, sequence)
{
    this.gridx = Math.ceil (Math.sqrt (3 * sequence.length / 4));
    this.gridy = Math.ceil (sequence.length / this.gridx);
    this.gridsize = width / this.gridx;
    
    var svg = this.StartSVGGrid (width);
    var count = 0;
    
    var radius = this.gridsize * 0.484;

    for (var i = 0 ; i < sequence.length ; ++i)
    {
        var x = i % this.gridx;
        var y = Math.floor (i / this.gridx);
        
        var xpos = (x + 0.5) * this.gridsize;
        var ypos = (y + 0.5) * this.gridsize;
        
        svg += sequence[i].GetSVG (xpos, ypos, radius);
    }

    svg += this.SVGTail ();
    return svg;
}
//-------------------------------------------------------------------------------------------------
SpirographController.prototype.StartSVGGrid = function (size)
{
    var height = Math.floor(size * this.gridy / this.gridx);
    var ret = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\"";

    ret += " width=\"" + size + "\" height=\"" + height + "\"";
    ret += " viewBox=\"" + 0 + "," + 0 + "," + size + "," + height + "\">";

    for (var i = 0 ; i <= this.gridx ; ++i)
    {
        var x = Math.round(size * i / this.gridx);
        ret += SVGHelp.Line ([x,0], [x,height], "black");
    }
    for (var i = 0 ; i <= this.gridy ; ++i)
    {
        var y = Math.round(height * i / this.gridy);
        ret += SVGHelp.Line ([0,y], [size,y], "black");
    }

    return ret;
}
SpirographController.prototype.OnClickGrid = function (xoff, yoff)
{
    var col = Math.min (Math.floor(xoff / this.gridsize), this.gridx);
    var row = Math.min (Math.floor(yoff / this.gridsize), this.gridy);
    var cell = row * this.gridx + col;
    
    switch (this.mode)
    {
        case SpirographController.Evolve:
            this.ContinueEvolution (cell);
            break;
            
        case SpirographController.Single:
        case SpirographController.Overlay:
        case SpirographController.BigSplit:
        case SpirographController.BigSingle:
        case SpirographController.BigOverlay:
            break;
            
        case SpirographController.Grid:
            if (cell >= 0 && cell < this.sequence.frames.length)
            {
                this.spirograph = this.sequence.frames [cell];
                this.SetMode (SpirographController.Single);
            }
            break;
    }
}
//--------------------------------------------------------------------------------------------------------------------------
SpirographController.prototype.AttachWatchers = function ()
{
    // Second parameter must be an element in the HTML document
    
    this.AddWatcher (SpirographController.WATCH_NUM_WHEELS, num_wheels);
    this.AddWatcher (SpirographController.WATCH_NUM_POINTS, num_points);
    this.AddWatcher (SpirographController.WATCH_SYMMETRY, symmetry);
    this.AddWatcher (SpirographController.WATCH_WHEEL_RATE_1, wrate1);
    this.AddWatcher (SpirographController.WATCH_WHEEL_RATE_2, wrate2);
    this.AddWatcher (SpirographController.WATCH_WHEEL_RATE_3, wrate3);
    this.AddWatcher (SpirographController.WATCH_WHEEL_RATE_4, wrate4);
    this.AddWatcher (SpirographController.WATCH_WHEEL_RATE_5, wrate5);
    this.AddWatcher (SpirographController.WATCH_WHEEL_SIZE_1, wsize1);
    this.AddWatcher (SpirographController.WATCH_WHEEL_SIZE_2, wsize2);
    this.AddWatcher (SpirographController.WATCH_WHEEL_SIZE_3, wsize3);
    this.AddWatcher (SpirographController.WATCH_WHEEL_SIZE_4, wsize4);
    this.AddWatcher (SpirographController.WATCH_WHEEL_SIZE_5, wsize5);
    this.AddWatcher (SpirographController.WATCH_WHEEL_PHASE_1, wphase1);
    this.AddWatcher (SpirographController.WATCH_WHEEL_PHASE_2, wphase2);
    this.AddWatcher (SpirographController.WATCH_WHEEL_PHASE_3, wphase3);
    this.AddWatcher (SpirographController.WATCH_WHEEL_PHASE_4, wphase4);
    this.AddWatcher (SpirographController.WATCH_WHEEL_PHASE_5, wphase5);
    this.AddWatcher (SpirographController.WATCH_PHASE_DELTA_1, dwphase1);
    this.AddWatcher (SpirographController.WATCH_PHASE_DELTA_2, dwphase2);
    this.AddWatcher (SpirographController.WATCH_PHASE_DELTA_3, dwphase3);
    this.AddWatcher (SpirographController.WATCH_PHASE_DELTA_4, dwphase4);
    this.AddWatcher (SpirographController.WATCH_PHASE_DELTA_5, dwphase5);
    this.AddWatcher (SpirographController.WATCH_FILL_RULE, fillrule);
    this.AddWatcher (SpirographController.WATCH_MODE, mode);
}
//-------------------------------------------------------------------------------------------------
SpirographController.prototype.AddWatcher = function (idx, element)
{
    SpirographController.watchers [idx] = element;
}
//-------------------------------------------------------------------------------------------------
SpirographController.SetWatcherText = function (element, text)
{
    if (element) element.innerHTML = text;
}
//-------------------------------------------------------------------------------------------------
// Display the current settings
//-------------------------------------------------------------------------------------------------
SpirographController.prototype.ShowCurrentStatus = function(element)
{
    if (element != null)
    {
        sizes = "";
        rates = "";
        phases = "";
        phase_deltas = "";

        for (i = 0 ; i < this.spirograph.num_wheels ; ++i)
        {
            if (i != 0)
            {
                sizes += ", ";
                rates += ", ";
                phases += ", ";
                phase_deltas += ", ";
            }
            sizes += this.spirograph.wheel_sizes [i];
            rates += this.spirograph.wheel_rates [i];
            phases +=  Misc.FloatToText (this.spirograph.wheel_phases [i], 2);
            phase_deltas += Misc.FloatToText (this.spirograph.phase_deltas [i], 2);
        }

        text = "<table>";

        text += "<tr><td>Num wheels:</td><td>" + this.spirograph.num_wheels + "</td></tr>";
        text += "<tr><td>Num points:</td><td>" + this.spirograph.num_points + "</td></tr>";
        text += "<tr><td>Wheel sizes:</td><td>" + sizes + "</td></tr>";
        text += "<tr><td>Wheel rates:</td><td>" + rates + "</td></tr>";
        text += "<tr><td>Wheel phases:</td><td>" + phases + "</td></tr>";
        text += "<tr><td>Wheel phase deltas:</td><td>" + phase_deltas + "</td></tr>";
        text += "<tr><td>Line:</td><td>" + this.spirograph.line_colour + "</td></tr>";
        text += "<tr><td>Fill:</td><td>" + this.spirograph.fill_colour + "</td></tr>";
        text += "<tr><td>Background:</td><td>" + this.spirograph.back_colour + "</td></tr>";
        text += "<tr><td>Fill rule:</td><td>" + this.spirograph.fill_rule + "</td></tr>";
        text += "<tr><td>Randomiser:</td><td>" + this.spirograph.randomiser_text + "</td></tr>";

        text += "</table>";

        element.innerHTML = text;
    }
}
//--------------------------------------------------------------------------------------------------------------------------
// Animation
//--------------------------------------------------------------------------------------------------------------------------
SpirographController.prototype.StartAnimation = function ()
{
    if (! this.animator.IsRunning ())
    {
        this.animator.Start ();
    }
}
SpirographController.DoAnimation = function ()
{
    SpirographController.animation_target.Animate();
}

SpirographController.prototype.Animate = function ()
{    
    switch (this.mode)
    {
        case SpirographController.Single:
        case SpirographController.BigSingle:
            if (this.auto_animate && ++ this.auto_count >= this.auto_limit)
            {
                this.spirograph.Randomise();
                this.auto_count = 0;
            }
            this.spirograph.Animate ();
            break;
            
        case SpirographController.Split:
        case SpirographController.BigSplit:
            if (this.auto_animate && ++ this.auto_count >= this.auto_limit)
            {
                this.split.RandomiseAnimation ();
                this.auto_count = 0;
            }
            this.split.Animate ();
            break;
            
        case SpirographController.Evolve:
            this.evolution.Animate ();
            break;
            
        case SpirographController.Grid:
        case SpirographController.Overlay:
        case SpirographController.BigOverlay:
            this.sequence.Animate ();
            break;
    }
    this.Redraw ();
    this.DisplayStatus ();
}

SpirographController.prototype.AutoAnimation = function ()
{
    this.auto_animate = true;
    this.StartAnimation ();
}
SpirographController.prototype.StopAnimation = function ()
{
    this.auto_animate = false;
    this.animator.Stop ();
}

SpirographController.prototype.Show = function (what) { window.location = what; }

//--------------------------------------------------------------------------------------------------------------------------
// Manipulations
//--------------------------------------------------------------------------------------------------------------------------
SpirographController.prototype.IncrementPoints = function (delta)
{
    this.spirograph.IncrementPoints (delta);
    this.OnSpirographChanged ();
}
SpirographController.prototype.IncrementWheels = function (delta)
{
    this.spirograph.IncrementWheels (delta);
    this.OnSpirographChanged ();
}
SpirographController.prototype.IncrementSymmetry = function (delta)
{
    this.spirograph.IncrementSymmetry (delta);
    this.OnSpirographChanged ();
}
SpirographController.prototype.IncrementSize = function (delta)
{
    this.spirograph.IncrementSize (delta);
    this.OnSpirographChanged ()
}
SpirographController.prototype.SetWheelRate = function (wheel, delta)
{
    this.spirograph.SetWheelRate (wheel, delta);
    this.OnSpirographChanged ()
}
SpirographController.prototype.SetWheelSize = function (wheel, delta) 
{
    this.spirograph.SetWheelSize (wheel, delta);
    this.OnSpirographChanged ()
}
SpirographController.prototype.SetWheelPhase = function (wheel, delta) 
{
    this.spirograph.SetWheelPhase (wheel, delta); 
    this.OnSpirographChanged ()
}
SpirographController.prototype.SetWheelPhaseDelta = function (wheel, dd_phase) 
{
    this.spirograph.SetWheelPhaseDelta (wheel, dd_phase); 
    this.OnSpirographChanged ()
}
SpirographController.prototype.SetWheelSizeDelta = function (wheel, dd_size) 
{
    this.spirograph.SetWheelSizeDelta (wheel, dd_size); 
    this.OnSpirographChanged ()
}
SpirographController.prototype.SetWheelRateDelta = function (wheel, dd_rate) 
{
    this.spirograph.SetWheelRateDelta (wheel, dd_rate); 
    this.OnSpirographChanged ()
}
SpirographController.prototype.SetFillColour = function (sel) 
{
    this.spirograph.SetFillColour (sel.value); 
    this.OnSpirographChanged ()
}
SpirographController.prototype.SetLineColour = function (sel) 
{
    this.spirograph.SetLineColour (sel.value); 
    this.OnSpirographChanged ()
}
SpirographController.prototype.SetBackColour = function (sel) 
{
    this.spirograph.SetBackColour (sel.value); 
    this.OnSpirographChanged ()
}
SpirographController.prototype.SetFillRule = function (rule) 
{
    this.spirograph.SetFillRule (rule); 
    this.OnSpirographChanged ()
}
SpirographController.prototype.Example = function () 
{
    this.spirograph.MakeExample (); 
    this.SetMode (SpirographController.Single);
}
SpirographController.prototype.Randomise = function () 
{
    switch (this.mode)
    {
        case SpirographController.Split:
        case SpirographController.BigSplit:
            this.split.Randomise();
            this.split.SetConfig(); 
            this.split.MakeComponents (this.spirograph);
            break;
            
        case SpirographController.Single:
        case SpirographController.BigSingle:
            this.spirograph.Randomise();
            break;
        
        case SpirographController.Evolve:
            return;
            
        case SpirographController.Grid:
        case SpirographController.Overlay:
        case SpirographController.BigOverlay:
            this.sequence.Randomise();
            this.sequence.SetConfig(); 
            this.sequence.MakeSequence (this.spirograph, this.mode != SpirographController.Grid);
            break;
    }

    this.Redraw ();
    this.DisplayStatus ();
}
SpirographController.prototype.MakeSymmetrical = function () 
{
    this.spirograph.MakeSymmetrical (); 
    this.OnSpirographChanged ()
}

SpirographController.prototype.OnSpirographChanged = function ()
{
    switch (this.mode)
    {
        case SpirographController.Split:
        case SpirographController.BigSplit:
            this.UpdateSplit();
            break;
            
        case SpirographController.Single:
        case SpirographController.BigSingle:
        case SpirographController.Evolve:
            break;
            
        case SpirographController.Grid:
        case SpirographController.Overlay:
        case SpirographController.BigOverlay:
            this.UpdateOverlay();
            break;
    }
    this.Redraw ();
    this.DisplayStatus ();
}
SpirographController.RemoveBlanks = function (list)
{
    var ret = [];
    for (var idx in list)
    {
        if (list[idx].length > 0)
        {
            ret.push (list[idx]);
        }
    }
    return ret;
}
SpirographController.ColoursToText = function (list)
{
    var ret = "";
    
    if (list.length > 0)
    {
        ret += list [0];
    
        for (var i = 1 ; i < list.length ; ++i)
        {
            ret += " " + list [i];
        }
    }
    return ret;
}
SpirographController.prototype.UpdateOverlay = function ()
{
    if (this.sequence)
    {
        this.sequence.ReadConfig ();
        this.sequence.MakeSequence (this.spirograph, this.mode != SpirographController.Grid);
    }
}
SpirographController.prototype.UpdateSplit = function ()
{
    if (this.split)
    {
        this.split.ReadConfig ();
        this.split.MakeComponents (this.spirograph);
    }
}
SpirographController.prototype.ContinueEvolution = function (cell)
{
    if (this.evolution && cell >= 0 && cell < this.evolution.children.length)
    {        
        this.evolution.CreateNextGeneration (cell);
        this.Redraw ();
    }
}

SpirographController.prototype.ShowChildren = function ()
{
    this.children = this.spirograph.CreateChildren (this.spirograph.sequence.sequence_length);

    var text = "";

    for (var i = 0 ; i < this.children.length ; ++i)
    {
        text += "<button class=\"link clickable\" onclick=\"controller.ChooseChild('" + i + "')\">";
        text += "<div style=\"width:240;\">";
        text += "<p>" + this.children[i].GetSVG(200);
        text += "<p> Click to choose this pattern</p>";
        text += "</div></button>";
    }

    document.getElementById("evolve_options").innerHTML = text;
}
SpirographController.prototype.ChooseChild = function (n)
{
    this.spirograph.data = this.children[n].data;

    this.ShowChildren ();
}
SpirographController.prototype.MakePrintable = function ()
{
    this.print_size = print_size.value;

    if (this.print_size < 64)
    {
        alert ("Minimim print size is 64");
        return;
    }

    var svg = this.GetSVG(this.print_size);
    var opened = window.open("");
    var text = "<html><head><title>"

    text += "Spirograph by Edd Aardvark (www.eddaardvark.co.uk)";
    text += "</title></head><body>";
    text += svg;
    text += "</body></html>";

    opened.document.write(text);
}
// Popup tool-tip
SpirographController.active_popup = null;
SpirographController.ShowTT = function (x, y, id)
{
    tool_tip_text.innerHTML = ToolTips.get_text (id);
    SpirographController.active_popup = tool_tip;
    
    var ww = window.innerWidth - 32;
    var wh = window.innerHeight - 32;
    
    var s = window.getComputedStyle(tool_tip);
    var w = parseInt (s.width);
    var h = parseInt (s.height);
    
    y += 6;
    
    tool_tip.style.left = (x + w > ww) ? (ww - w) : x;
    tool_tip.style.top = (y + h > wh) ? (wh - h) : y;
    tool_tip.style.visibility="visible";
}
SpirographController.prototype.ShowSVG = function ()
{
    SpirographController.active_popup = show_svg;
    save_text.value = this.GetSVG(this.print_size);
    show_svg.style.visibility="visible";
}
SpirographController.ShowSource = function ()
{
    SpirographController.active_popup = show_source;
    show_source.style.visibility="visible";
}
SpirographController.HidePopup = function ()
{
    if (SpirographController.active_popup)
    {
        SpirographController.active_popup.style.visibility="hidden";
        SpirographController.active_popup = null;
    }
}

SpirographController.AddColour = function (edit, select)
{
    edit.value += " " + select.value;
}

                                        
                                        
                                        
                                        