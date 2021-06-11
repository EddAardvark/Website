//-------------------------------------------------------------------------------------------------
// Javascript UI Code for the interactive shape packing application
// (c) John Whitehouse 2015-2020
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

ShapesController = function ()
{    
    this.shape_counts = [5,0,0,0,0,0,0,0];
    this.per_sec = 1000;
    this.update_interval = 100;
    this.to_draw = 1;
    this.outer_shape = 0;

    // Used for the annealing cycle

    this.t_cycle = false;
    this.t_phase = 0;
    this.t_num_phases = ShapesController.t_phases.length;
    this.t_counter = 0;

    // Best so far monitoring

    this.record_text = {};
    ShapesController.animation_targets.push (this);
}

ShapesController.t_phases = [0.03, 0.005, 0.0005, 0.0001, 0.00005, 0.00002, 0.00001];
ShapesController.t_counts = [300, 300, 300, 300, 300, 500, 6000];

ShapesController.animation_targets = [];

//-------------------------------------------------------------
ShapesController.prototype.StartAnimation = function ()
{
    this.StopAnimation ();
    this.GetShapeCounts ();
    this.shape_packer = new ShapePacker (this.shape_counts, this.outer_shape);
    this.ApplySettings ();
    this.shape_packer.Draw (drawing);

    current_outer.innerHTML = ShapePacker.ShapeNames [this.outer_shape];
    
    this.t_cycle = false;
    this.to_draw = (this.update_interval * this.per_sec) / 1000;
    this.record_text = {};
    
    this.chelp = this.chelp_maze = new CanvasHelp (chart_img.width, chart_img.height);

// reset best-so-far monitoring

    this.record_text = {};
    this.RedrawBestCombo ();

    if (this.to_draw < 1) this.to_draw = 1;

    this.ResumeAnimation ();
    
    this.current_chart = ShapesController.CHART_NONE;
    this.DrawCurrentChart ();
}

//-------------------------------------------------------------
ShapesController.prototype.ShowBest = function ()
{
    var element = document.getElementById("best_combo");
    var best = element.value;

    this.StopAnimation ();

    if (best == "Active")
    {
        this.shape_packer.ReloadBest ();
        best_text.value = this.shape_packer.best;
        this.RedrawBestCombo ();
    }
    else
    {
        this.shape_packer.SetBest (this.record_text [best]);
        best_text.value = this.record_text [best];
    }

    this.shape_packer.Draw (drawing);
    this.UpdateBestStats ();
}

//-------------------------------------------------------------
ShapesController.prototype.ResetBest = function()
{
    this.shape_packer.best_scale = 0;
}

//-------------------------------------------------------------
ShapesController.prototype.StopAnimation = function ()
{
    clearInterval(this.timer);
    this.timer = null;
}
//-------------------------------------------------------------
ShapesController.prototype.ResumeAnimation = function ()
{
    if (this.timer == null)
    {
        this.timer = setInterval(ShapesController.AnimatePattern, this.update_interval);
    }
}
//-------------------------------------------------------------
ShapesController.AnimatePattern = function ()
{
    for (var idx in ShapesController.animation_targets)
    {
        ShapesController.animation_targets [idx].Animate ();
    }
}
//-------------------------------------------------------------
ShapesController.prototype.Animate = function ()
{
    if (this.shape_packer.TryMoves (this.to_draw))
    {
        this.shape_packer.Draw (drawing);
    }
    this.UpdateStats ();
}
//-------------------------------------------------------------
ShapesController.prototype.UpdateStats = function ()
{
    var stats_text = "<li>Scale: " + this.shape_packer.scale.toFixed (7) + "</li>";

    var outer = this.shape_packer.OuterArea ();
    var inner = this.shape_packer.InnerArea ();

    stats_text += "<li>Area ratio: " + Misc.FloatToText (100 * inner / outer, 3) + "%</li>";
    stats_text += "<li>Best: " + this.shape_packer.best_scale.toFixed (7) + "</li>";
    stats_text += "<li>Move: " + this.shape_packer.moves [0] + " of " + this.shape_packer.tries [0] + "</li>";
    stats_text += "<li>Rotate: " + this.shape_packer.moves [1] + " of " + this.shape_packer.tries [0] + "</li>";
    stats_text += "<li>Resize: " + this.shape_packer.moves [2] + " of " + this.shape_packer.tries [2] + "</li>";
    stats_text += "<li>Swap: " + this.shape_packer.moves [3] + " of " + this.shape_packer.tries [3] + "</li>";
    stats_text += "<li>Move step: " + Misc.FloatToText (this.shape_packer.delta_x, 7) + "</li>";
    stats_text += "<li>Size step: " + Misc.FloatToText (this.shape_packer.delta_s, 7) + "</li>";
    stats_text += "<li>Angle step: " + Misc.FloatToText (this.shape_packer.delta_a, 7) + "</li>";

    // When the outer shape isn't a circle

    if (this.shape_packer.moves.length > 4)
    {
        stats_text += "<li>Jiggle: " + this.shape_packer.moves [4] + " of " + this.shape_packer.tries [4] + "</li>";
    }

    // Temperature cycling

    if (this.t_cycle)
    {
        stats_text += "<li>T-Cycle: On, " + Misc.FloatToText (this.shape_packer.temperature, 5) + ", Countdown: " + Misc.FloatToText (this.t_counter/10, 1) + " secs</li>";
    }
    else
    {
        stats_text += "<li>Temperature: " + Misc.FloatToText (this.shape_packer.temperature, 5) + "</li>";
    }
    
    // Show touching
    
    stats_text += "<li>Show touching: " + (this.shape_packer.show_touching ? "Yes" : "No") + "</li>";

    stats.innerHTML = stats_text;

    // if annealing is in action check the phase

    if (this.t_cycle)
    {
        -- this.t_counter;

        if (this.t_counter <= 0)
        {
            ++ this.t_phase;

            if (this.t_phase >= this.t_num_phases)
            {
                this.t_phase = 0;
                var key = "R = " + this.shape_packer.best_scale;
                this.record_text [key] = this.shape_packer.best;

                this.RedrawBestCombo ();
            }
            this.StartAnealingPhase ();
        }
    }
}
//-------------------------------------------------------------
ShapesController.prototype.UpdateBestStats = function ()
{
    var outer = this.shape_packer.OuterArea ();
    var inner = this.shape_packer.InnerArea ();

    var stats_text = "<li><strong>Best do far</strong></li>";
    
    stats_text += "<li>Scale: " + this.shape_packer.scale.toFixed (7) + "</li>";
    stats_text += "<li>Area ratio: " + Misc.FloatToText (100 * inner / outer, 3) + "%</li>";

    stats.innerHTML = stats_text;
}
//-------------------------------------------------------------
// Start an annealing cycle, gradually decreases the temperature
// until it reaches the cold limit, then resets it.
//-------------------------------------------------------------
ShapesController.prototype.ToggleTCycle = function ()
{
    if (this.t_cycle)
    {
        this.t_cycle = false;
    }
    else
    {
        this.t_cycle = true;
        this.t_phase = 0;
        this.StartAnealingPhase ();
    }
}
//-------------------------------------------------------------
ShapesController.prototype.ToggleTouching = function ()
{
    this.shape_packer.show_touching = ! this.shape_packer.show_touching;
}
//-------------------------------------------------------------
ShapesController.prototype.StartAnealingPhase = function ()
{
    this.shape_packer.SetTemperature (ShapesController.t_phases [this.t_phase]);
    this.t_counter = ShapesController.t_counts [this.t_phase];
    current_temperature.innerHTML = Misc.FloatToText (this.shape_packer.temperature, 5);

    if (this.t_phase < 2)
    {
        this.shape_packer.best_scale = 0;
    }
}

//-------------------------------------------------------------
ShapesController.prototype.GetShapeCounts = function ()
{
    var num_shapes = [];
    var total = 0;

    num_shapes.push (parseInt (new_num_circles.value));
    num_shapes.push (parseInt (new_num_p3.value));
    num_shapes.push (parseInt (new_num_p4.value));
    num_shapes.push (parseInt (new_num_p5.value));
    num_shapes.push (parseInt (new_num_p6.value));
    num_shapes.push (parseInt (new_num_p7.value));
    num_shapes.push (parseInt (new_num_p8.value));
    num_shapes.push (parseInt (new_num_p9.value));

    for (var i in num_shapes)
    {
        if (isNaN (num_shapes [i]) || num_shapes [i] < 0)
        {
            num_shapes [i] = 0;
        }
        total += num_shapes [i];
    }

    // Avoid dodgy situations

    if (total < 2)
    {
        alert ("This application needs at least 2 shapes");
        return;
    }

    this.shape_counts = num_shapes;

    this.outer_shape = outer_combo.value;

    current_num_circles.innerHTML = this.shape_counts [0];
    current_num_p3.innerHTML = this.shape_counts [1];
    current_num_p4.innerHTML = this.shape_counts [2];
    current_num_p5.innerHTML = this.shape_counts [3];
    current_num_p6.innerHTML = this.shape_counts [4];
    current_num_p7.innerHTML = this.shape_counts [5];
    current_num_p8.innerHTML = this.shape_counts [6];
    current_num_p9.innerHTML = this.shape_counts [7];
}

//-------------------------------------------------------------
ShapesController.prototype.ApplySettings = function ()
{
    var t = parseFloat (new_temperature.value);
    var ps = parseInt (new_ps.value);
    
    this.shape_packer.SetTemperature (t);

    this.per_sec = ps;
    this.to_draw = (this.update_interval * this.per_sec) / 1000;

    current_temperature.innerHTML = Misc.FloatToText (this.shape_packer.temperature, 5);
    current_ps.innerHTML = this.per_sec;

    // turn off annealing

    this.t_cycle = false;
}
//-------------------------------------------------------------
ShapesController.prototype.RedrawBestCombo = function()
{
    var text = "<select id=\"best_combo\" onchange=\"controller.ShowBest()\">";

    text += "<option value=\"\" selected disabled hidden>Choose...</option>";
    text += "<option value=\"Active\"\"> Active </option>";

    var keys = [];

    // Display in best fit order
    // Display in best fit order

    for (var x in this.record_text)
    {
        keys.push (x);
    }

    keys.sort ();
    keys.reverse ();

    for (var i in keys)
    {
        text += "<option value=\"" + keys[i] + "\">" + keys[i] + "</option>";
    }
    text += "</select>";
    combo1.innerHTML = text;
}

//-------------------------------------------------------------
ShapesController.CHART_NONE = 0;
ShapesController.SCALE_HISTORY_BARS = 1;
ShapesController.SCALE_HISTORY_LINE = 2;
ShapesController.TOUCHING_DISTANCE = 3;

ShapesController.prototype.SelectChart = function()
{
    this.current_chart = chart_combo.value;
    this.DrawCurrentChart ();
}
//-------------------------------------------------------------
ShapesController.prototype.DrawCurrentChart = function()
{
    if (this.current_chart == ShapesController.CHART_NONE)
    {
        this.chelp.SetBackground ("brown");
        this.chelp.DrawFilledRect (0, 0, this.chelp.canvas.width, this.chelp.canvas.height);
        chart_img.src = this.chelp.canvas.toDataURL('image/png');      
    }
    else if (this.current_chart == ShapesController.SCALE_HISTORY_BARS)
    {
        this.shape_packer.chart.DrawHLBars (this.chelp, chart_img);
    }
    else if (this.current_chart == ShapesController.SCALE_HISTORY_LINE)
    {
        this.shape_packer.chart.DrawHighLine (this.chelp, chart_img);
    }
    else if (this.current_chart == ShapesController.TOUCHING_DISTANCE)
    {
        this.shape_packer.DrawTouchingDistance (this.chelp, chart_img);
    }
}






    
    