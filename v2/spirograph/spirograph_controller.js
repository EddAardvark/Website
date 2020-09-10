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

//--------------------------------------------------------------------------------------------------------------------------
// Session management
//--------------------------------------------------------------------------------------------------------------------------
SpirographController.prototype.Initialise = function ()
{
    var tb = new TabBar ();

    tb.AddButton ("Setup", "setup", "Setup &#x25bc", "Setup");
    tb.AddButton ("W3", "wheelsizes", "Wheel Size &#x25bc", "Wheel Size");
    tb.AddButton ("W2", "wheelrates", "Wheel Rate &#x25bc", "Wheel Rate");
    tb.AddButton ("W1", "wheelphases", "Wheel Phase &#x25bc", "Wheel Phase");
    tb.AddButton ("Fill", "fill", "Fill &#x25bc", "Fill");
    tb.AddButton ("Animation", "animate", "Animate &#x25bc", "Animate");
    tb.AddButton ("Overlay", "overlay", "Overlay &#x25bc", "Overlay");
    tb.AddButton ("Extras", "extras", "Extras &#x25bc", "Extras");
    tb.AddButton ("Print", "print", "Print &#x25bc", "Print");

    TabBar.OPEN_STYLE = "background-color:blue; color:white;"

    tb.Show("buttons");
    tb.SetInitialTab ();

    SpirographController.animation_target = this;

    this.animator = new Animator (SpirographController.AnimateWheels, 50);
    this.print_size = 1024;
    this.screen_size = 500;
    this.auto_animate = false;
    this.auto_count = 0;
    this.auto_limit = 100;

    print_size.value = this.print_size;

    this.StartNew();
    this.ToNormalMode();
}
SpirographController.prototype.StartNew = function ()
{
    this.spirograph = new Spirograph (); 
    this.AttachWatchers (); 
    this.SetSequence (); 
    this.Redraw ();
}
SpirographController.prototype.Redraw = function ()
{
    this.spirograph.Draw ('picture', this.screen_size);
    this.spirograph.DisplaySettings ('details');
}
//--------------------------------------------------------------------------------------------------------------------------
SpirographController.prototype.AttachWatchers = function ()
{
    this.spirograph.AddWatcher (Spirograph.WATCH_NUM_WHEELS, "num_wheels");
    this.spirograph.AddWatcher (Spirograph.WATCH_NUM_POINTS, "num_points");
    this.spirograph.AddWatcher (Spirograph.WATCH_SYMMETRY, "symmetry");
    this.spirograph.AddWatcher (Spirograph.WATCH_WHEEL_RATE_1, "wrate1");
    this.spirograph.AddWatcher (Spirograph.WATCH_WHEEL_RATE_2, "wrate2");
    this.spirograph.AddWatcher (Spirograph.WATCH_WHEEL_RATE_3, "wrate3");
    this.spirograph.AddWatcher (Spirograph.WATCH_WHEEL_RATE_4, "wrate4");
    this.spirograph.AddWatcher (Spirograph.WATCH_WHEEL_RATE_5, "wrate5");
    this.spirograph.AddWatcher (Spirograph.WATCH_WHEEL_SIZE_1, "wsize1");
    this.spirograph.AddWatcher (Spirograph.WATCH_WHEEL_SIZE_2, "wsize2");
    this.spirograph.AddWatcher (Spirograph.WATCH_WHEEL_SIZE_3, "wsize3");
    this.spirograph.AddWatcher (Spirograph.WATCH_WHEEL_SIZE_4, "wsize4");
    this.spirograph.AddWatcher (Spirograph.WATCH_WHEEL_SIZE_5, "wsize5");
    this.spirograph.AddWatcher (Spirograph.WATCH_WHEEL_PHASE_1, "wphase1");
    this.spirograph.AddWatcher (Spirograph.WATCH_WHEEL_PHASE_2, "wphase2");
    this.spirograph.AddWatcher (Spirograph.WATCH_WHEEL_PHASE_3, "wphase3");
    this.spirograph.AddWatcher (Spirograph.WATCH_WHEEL_PHASE_4, "wphase4");
    this.spirograph.AddWatcher (Spirograph.WATCH_WHEEL_PHASE_5, "wphase5");
    this.spirograph.AddWatcher (Spirograph.WATCH_FILL_COLOUR, "fillcol");
    this.spirograph.AddWatcher (Spirograph.WATCH_LINE_COLOUR, "linecol");
    this.spirograph.AddWatcher (Spirograph.WATCH_FILL_RULE, "fillrule");
    this.spirograph.AddWatcher (Spirograph.WATCH_PATTERN_SIZE, "sizeval");
    this.spirograph.AddWatcher (Spirograph.WATCH_MODE, "mode");
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
    else
    {
        this.spirograph.RandomisePhaseDeltas ();
    }
}
SpirographController.AnimateWheels = function ()
{
    SpirographController.animation_target.DoAnimation ();
}
SpirographController.prototype.DoAnimation = function ()
{
    if (this.auto_animate && ++ this.auto_count >= this.auto_limit)
    {
        this.spirograph.RandomisePhaseDeltas ();
        this.auto_count = 0;
    }
    this.spirograph.Animate ();
    this.Redraw ();
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
SpirographController.prototype.IncrementPoints = function (delta) { this.spirograph.IncrementPoints (delta); this.Redraw (); }
SpirographController.prototype.IncrementWheels = function (delta) { this.spirograph.IncrementWheels (delta); this.Redraw (); }
SpirographController.prototype.IncrementSymmetry = function (delta) { this.spirograph.IncrementSymmetry (delta); this.Redraw (); }
SpirographController.prototype.IncrementSize = function (delta) { this.spirograph.IncrementSize (delta); this.Redraw (); }
SpirographController.prototype.SetWheelRate = function (wheel, delta) { this.spirograph.SetWheelRate (wheel, delta); this.Redraw (); }
SpirographController.prototype.SetWheelSize = function (wheel, delta) { this.spirograph.SetWheelSize (wheel, delta); this.Redraw (); }
SpirographController.prototype.SetWheelPhase = function (wheel, delta) { this.spirograph.SetWheelPhase (wheel, delta); this.Redraw (); }
SpirographController.prototype.SetFillColour = function (colour) { this.spirograph.SetFillColour (colour); this.Redraw (); }
SpirographController.prototype.SetLineColour = function (colour) { this.spirograph.SetLineColour (colour); this.Redraw (); }
SpirographController.prototype.SetFillRule = function (rule) { this.spirograph.SetFillRule (rule); this.Redraw (); }
SpirographController.prototype.Example = function () { this.spirograph.MakeExample (); this.Redraw (); }
SpirographController.prototype.Randomise = function () { this.spirograph.Randomise (); this.Redraw (); }
SpirographController.prototype.MakeSymmetrical = function () { this.spirograph.MakeSymmetrical (); this.Redraw (); }
SpirographController.prototype.UpdateOverlay = function () { this.SetSequence (); this.Redraw(); }

SpirographController.prototype.SetMode = function (m)
{
    if (m != Spirograph.Evolve)
    {
        this.spirograph.SetMode (m);
        this.Redraw ();
    }
    else
    {
        this.ToEvolveMode();
    }
}

SpirographController.prototype.ToEvolveMode = function ()
{
    evolve_mode.style.display = "block";
    normal_mode.style.display = "none";

    this.ShowChildren ();
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
SpirographController.prototype.ToNormalMode = function ()
{
    evolve_mode.style.display = "none";
    normal_mode.style.display = "block";

    this.Show ("#pic");
    this.Redraw ();
}
SpirographController.prototype.ChooseChild = function (n)
{
    this.spirograph.data = this.children[n].data;

    this.ShowChildren ();
}
SpirographController.prototype.MakePrintable = function ()
{
    this.print_size = parseInt (document.getElementById("print_size").value);

    if (this.print_size < 64)
    {
        alert ("Minimim print size is 64");
        return;
    }

    var svg = this.spirograph.GetSVG(this.print_size);
    var opened = window.open("");
    var text = "<html><head><title>"

    text += "Spirograph by Edd Aardvark (www.eddaardvark.co.uk)";
    text += "</title></head><body>";
    text += svg;
    text += "</body></html>";

    opened.document.write(text);
}
SpirographController.prototype.SetSequence = function ()
{
    var seq = new SpirographSequence ();

    seq.phase_deltas [0] = parseInt (document.getElementById("dwphase0").value);
    seq.phase_deltas [1] = parseInt (document.getElementById("dwphase1").value);
    seq.phase_deltas [2] = parseInt (document.getElementById("dwphase2").value);
    seq.phase_deltas [3] = parseInt (document.getElementById("dwphase3").value);
    seq.phase_deltas [4] = parseInt (document.getElementById("dwphase4").value);

    seq.size_deltas [0] = parseFloat (document.getElementById("dwsize0").value);
    seq.size_deltas [1] = parseFloat (document.getElementById("dwsize1").value);
    seq.size_deltas [2] = parseFloat (document.getElementById("dwsize2").value);
    seq.size_deltas [3] = parseFloat (document.getElementById("dwsize3").value);
    seq.size_deltas [4] = parseFloat (document.getElementById("dwsize4").value);

    seq.rate_deltas [0] = parseInt (document.getElementById("dwrate0").value);
    seq.rate_deltas [1] = parseInt (document.getElementById("dwrate1").value);
    seq.rate_deltas [2] = parseInt (document.getElementById("dwrate2").value);
    seq.rate_deltas [3] = parseInt (document.getElementById("dwrate3").value);
    seq.rate_deltas [4] = parseInt (document.getElementById("dwrate4").value);

    seq.points_delta = parseInt (document.getElementById("dpoints").value);
    seq.scale_factor = parseFloat (document.getElementById("dsize").value);
    seq.sequence_length = parseInt (document.getElementById("num_images").value);

    seq.line_colour_sequence = [];

    seq.line_colour_sequence.push (document.getElementById("seqcol1").value);
    seq.line_colour_sequence.push (document.getElementById("seqcol2").value);

    var error = seq.Verify ();

    if (error != null)
    {
        alert (error);
        return;
    }

    this.spirograph.sequence = seq;
}

SpirographController.prototype.ShowSVG = function ()
{
    show_svg.style.visibility="visible";
    save_text.value = this.spirograph.GetSVG(this.print_size);
}
SpirographController.prototype.ShowSource = function ()
{
    show_source.style.visibility="visible";
}
SpirographController.prototype.HidePopup = function ()
{
    show_svg.style.visibility="hidden";
    show_source.style.visibility="hidden";
    
}
