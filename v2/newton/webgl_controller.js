WebGLController = function ()
{
}

WebGLController.animation_target = null;
WebGLController.timer = null;
  

//-----------------------------------------------------------------------------------------
// Set up some default values
//-----------------------------------------------------------------------------------------
WebGLController.prototype.Initialise = function ()
{
    WebGLController.current_ids =
    [
        z9_current,    z8_current,    z7_current,    z6_current,    z5_current,    z4_current,
        z3_current,    z2_current,    z1_current,    z0_current,    alpha_current, seed_current,
        zoom_current,  steps_current, clr_current
    ];

    WebGLController.start_ids =
    [
        z9_start,    z8_start,    z7_start,    z6_start,    z5_start,    z4_start,
        z3_start,    z2_start,    z1_start,    z0_start,    alpha_start, seed_start,
        zoom_start,  steps_start, clr_start
    ];
    WebGLController.end_ids =
    [
        z9_end,    z8_end,    z7_end,    z6_end,    z5_end,    z4_end,
        z3_end,    z2_end,    z1_end,    z0_end,    alpha_end, seed_end,
        zoom_end,  steps_end, clr_end,
    ];

    this.zidx = (ShaderManager.mode == ShaderManager.STANDARD) ? 0 : 1;
    this.current = new NRFParameters ();
    this.anim_start = new NRFParameters ();
    this.anim_end = new NRFParameters ();
    this.animation_step = 0;
    this.max_animation = 100;
    this.animation_speed = 1;
    this.anim_end.zoom[0] = this.anim_start.zoom[0] * 10;
    this.anim_end.zoom[1] = this.anim_start.zoom[1] * 10;
    
    this.current.ShowValues (WebGLController.current_ids, this.zidx);
    this.anim_start.DisplayText (WebGLController.start_ids, this.zidx);
    this.anim_end.DisplayText (WebGLController.end_ids, this.zidx);

    this.vis_div = null;     
    
    WebGLController.animation_target = null;
    WebGLController.timer = setInterval(WebGLController.AnimatePattern, 100);
}
// For use with the polynomial solver

WebGLController.prototype.InitialisePolynomial = function ()
{
    WebGLController.poly_ids =
    [
        z9_current,    z8_current,    z7_current,    z6_current,    z5_current,
        z4_current,    z3_current,    z2_current,    z1_current,    z0_current,
    ];

    this.current = new NRFParameters ();    
    this.current.ShowPolyValues (WebGLController.poly_ids);
}

WebGLController.prototype.initGL = function(canvas)
{
    try
    {
        this.ctx3 = canvas.getContext("webgl");

        if (this.ctx3 == null)
        {
            this.ctx3 = canvas.getContext("experimental-webgl");
        }

        if (this.ctx3 == null)
        {
            alert("WebGL is not supported");
            return;
        }

        this.ctx3.viewportWidth = canvas.width;
        this.ctx3.viewportHeight = canvas.height;
        
        ShaderManager.LoadShaders (this.ctx3);
    }
    catch(e)
    {
        alert (e);
    }
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.UpdateEquation = function()
{
    this.polynomial = this.current.GetPolynomial ();

    if (this.polynomial.order < 2)
    {
        alert ("The polynomial must be of at least order 2, ie include a Z^2 or higher term");
        return;
    }

    this.derivative = this.polynomial.Derivative ();

    ShaderManager.SetPolynomial (this.polynomial);
    this.UpdateStatus ();
}        
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.Start = function()
{
    this.SetMode(ShaderManager.STANDARD);
    this.SynchroniseShader ();

    this.Draw ();
}     
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.SynchroniseShader = function()
{
    this.UpdateEquation();
    this.SetShaderSeed ();
    this.SetShaderAlpha ();
    this.SetShaderColourOrigin ();
    this.ResetTightness();
    ShaderManager.SetZoom (this.current.zoom [this.zidx]);    
    ShaderManager.SetIterations (this.current.steps [this.zidx]);  
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.Draw = function ()
{
    status_text.innerHTML = "Calculating";
    
    this.ShowExplorerPosition ();
    this.current.ShowValues (WebGLController.current_ids, this.zidx);
    
    ShaderManager.UpdateView ();
    ShaderManager.DrawScene ();
    this.UpdateStatus ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.UpdateStatus = function ()
{
    status_text.innerHTML = ShaderManager.GetStatus ();    
    eq_text.innerHTML = this.polynomial.AsHTML ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ShowExplorerPosition = function ()
{
    alpha_value.innerHTML = this.current.alpha.toString();
    seed_value.innerHTML = this.current.seed.toString();
    zoom_value.innerHTML = Misc.FloatToText (this.current.zoom [this.zidx], 2);
    steps_value.innerHTML = this.current.steps[this.zidx];
    colour_origin.innerHTML = this.current.colour.toString();
}

//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ZoomBy = function (f)
{
    this.current.zoom[this.zidx] *= f;
    ShaderManager.SetZoom (this.current.zoom[this.zidx]);
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ResetZoom = function (f)
{
    this.current.zoom[this.zidx] = this.anim_start.zoom[this.zidx];
    ShaderManager.SetZoom (this.current.zoom[this.zidx]);  
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ResetIterations = function (f)
{
    this.current.steps[this.zidx] = this.anim_start.steps[this.zidx];
    ShaderManager.SetIterations (this.current.steps[this.zidx]);  
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.AdjustIterations = function (f)
{
    this.current.steps[this.zidx] = Math.max (2, Math.floor (this.current.steps[this.zidx] * f));
    ShaderManager.SetIterations (this.current.steps[this.zidx]);  
    this.Draw ();
}                        
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ChangeMode = function (mode)
{
    this.SetMode (mode);
    this.Draw ();
}           
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.SetMode = function (mode)
{
    this.zidx = (mode == ShaderManager.STANDARD) ? 0 : 1;    
    this.anim_start.DisplayText (WebGLController.start_ids, this.zidx);
    this.anim_end.DisplayText (WebGLController.end_ids, this.zidx);
    
    ShaderManager.SetMode (mode);
    this.SynchroniseShader ();
}
//-----------------------------------------------------------------------------------------------
WebGLController.prototype.UpdateShaderPosition = function (x,y)
{
    if (ShaderManager.mode == ShaderManager.STANDARD)
    {
        ShaderManager.SetSeedPosition (x, y);
        this.current.seed.Overwrite (x, y);
    }
    else
    {
        ShaderManager.SetAlphaValue (x, y);
        this.current.alpha.Overwrite (x, y);
    }
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.SetShaderSeed = function()
{
    ShaderManager.SetSeedPosition (this.current.seed.x, this.current.seed.y);
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.MoveSeed = function(dx, dy, seed_inc)
{
    seed_delta = parseFloat (seed_inc.value);

    if (ShaderManager.mode == ShaderManager.ALPHA)
    {
        var x = this.current.seed.x + dx * seed_delta;
        var y = this.current.seed.y + dy * seed_delta;
    }
    else
    {
        var w = 2 * ShaderManager.start_w / ShaderManager.zoom;
        var h = 2 * ShaderManager.start_h / ShaderManager.zoom;
        var x = this.current.seed.x + w * dx * seed_delta;
        var y = this.current.seed.y + h * dy * seed_delta;
    }
    
    this.current.seed.Overwrite (x, y);
    this.SetShaderSeed ();
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ResetSeed = function()
{
    this.current.seed.Copy (this.anim_start.seed);
    this.SetShaderSeed ();
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.MoveAlpha = function(dx, dy, alpha_inc)
{
    alpha_delta = parseFloat (alpha_inc.value);

    if (ShaderManager.mode == ShaderManager.STANDARD)
    {
        var x = this.current.alpha.x + dx * alpha_delta;
        var y = this.current.alpha.y + dy * alpha_delta;
    }
    else
    {
        var w = 2 * ShaderManager.start_w / ShaderManager.zoom;
        var h = 2 * ShaderManager.start_h / ShaderManager.zoom;
        var x = this.current.alpha.x + w * dx * alpha_delta;
        var y = this.current.alpha.y + h * dy * alpha_delta;
    }

    this.current.alpha.Overwrite (x, y);
    this.SetShaderAlpha ();
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ResetAlpha = function()
{
    this.current.alpha.Copy (this.anim_start.alpha);
    this.SetShaderAlpha ();
    this.Draw ();  
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.SetShaderAlpha = function()
{
    ShaderManager.SetAlphaValue (this.current.alpha.x, this.current.alpha.y);
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.MoveColourOrigin = function (dx, dy)
{
    var colour_delta = colour_inc.value;
    
    var x = this.current.colour.x + dx * colour_delta;
    var y = this.current.colour.y + dy * colour_delta;
    
    this.current.colour.Overwrite (x, y);
    this.SetShaderColourOrigin ();
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ResetColourOrigin = function ()
{
    this.current.colour.Copy (this.anim_start.colour);
    this.SetShaderColourOrigin ();
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.SetShaderColourOrigin = function ()
{
    ShaderManager.SetColourOrigin (this.current.colour.x, this.current.colour.y);
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.Tighten = function (f)
{
    ShaderManager.tightness *= f;
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ResetTightness = function (f)
{
    ShaderManager.tightness = 1e-8;
    ShaderManager.UpdateView ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.AdjustContours = function (f)
{
    ShaderManager.contours_factor *= f;
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ResetContours = function (f)
{
    ShaderManager.contours_factor = 1;
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ShowHighResView = function (w, h)
{
    if (w == 0 || h == 0)
    {
        w = input_w.value;
        h = input_h.value;
    }

    if (w <= 0 || h <= 0)
    {
        alert ("Invalid size: " + w + " x " + h);
        return;
    }
    canvas.width = w;
    canvas.height = h;

    this.ctx3.viewportWidth = canvas.width;
    this.ctx3.viewportHeight = canvas.height;
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.SolvePolynomial = function (eq_text, it_text, root_text, image)
{
    this.current.GetPolyValues (WebGLController.poly_ids);
    
    this.polynomial = this.current.GetPolynomial ();

    if (this.polynomial.order < 2)
    {
        alert ("The polynomial must be of at least order 2, ie include a Z^2 or higher term");
        return;
    }
    
    var derivative = this.polynomial.Derivative ();
    var x = this.polynomial.MakeNewtonPolynomials ();
    var roots = this.polynomial.FindRoots ();
    
    if (roots == null || roots.length == 0)
    {
        eq_text.innerHTML = "no roots found";
        it_text.innerHTML = "";                            
        root_text.innerHTML = "";
        return;
    }
    
    eq_text.innerHTML = this.polynomial.AsHTML();
    it_text.innerHTML = "z &rarr; ( " + this.polynomial.newton_top.AsHTML () +
                            ") / (" + this.polynomial.newton_bottom.AsHTML () + ")";

    var text = "";
    var xymax = 0;
    
    for (var idx in roots)
    {
        if (idx > 0) text += "<br>";
        text += "Root [" + idx + "] = " + roots [idx];
        if (Math.abs(roots [idx].x) > xymax) xymax = Math.abs(roots [idx].x);
        if (Math.abs(roots [idx].y) > xymax) xymax = Math.abs(roots [idx].y);
    }
    
    root_text.innerHTML = text;
    
    // Draw the roots on a map.
    
    if (image)
    {
        var chelp = new CanvasHelp (image.width, image.height);
        var w2 = image.width/2;
        var h2 = image.height/2;
        var r = 6;
        
        xymax = Math.ceil (xymax * 1.01);
        
        var f = image.width / (2 * xymax);
        
        chelp.DrawLine ([0,w2], [image.height,w2]);
        chelp.DrawLine ([h2,0], [h2,image.width]);
       
        
        for (var i = 0 ; i <= xymax ; ++i)
        {
            chelp.DrawCircle (w2, h2, i * f, "black")
        }

        for (var idx in roots)
        {
            chelp.DrawFilledCircle (w2 + f * roots [idx].x, h2 + f * roots [idx].y, r, "red", "black")
        }
        
        image.src = chelp.canvas.toDataURL('image/png');
    }
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ApplySettings = function ()
{
    this.current.GetValues (WebGLController.current_ids, this.zidx);
    this.SynchroniseShader ();
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.SaveToStart = function ()
{
    this.ApplySettings();
    this.anim_start.Copy (this.current);
    this.anim_start.DisplayText (WebGLController.start_ids, this.zidx);
    
    show_step.innerHTML = this.animation_step;
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.SaveToEnd = function ()
{
    this.ApplySettings();
    this.anim_end.Copy (this.current);
    this.anim_end.DisplayText (WebGLController.end_ids, this.zidx);
    this.animation_step = this.max_animation;
}
WebGLController.prototype.SwapAnimationEndpoints = function ()
{
    var temp = this.anim_end;
    this.anim_end = this.anim_start;
    this.anim_start = temp;    
    this.anim_start.DisplayText (WebGLController.start_ids, this.zidx);
    this.anim_end.DisplayText (WebGLController.end_ids, this.zidx);
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.RestoreEnd = function ()
{
    this.StopAnimation ();
    this.animation_step = this.max_animation;
    this.SetCurrent (this.anim_end);
    
    show_step.innerHTML = this.animation_step;
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.RestoreStart = function ()
{
    this.StopAnimation ();
    this.animation_step = 0;
    this.SetCurrent (this.anim_start);
    
    show_step.innerHTML = this.animation_step;
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.SetCurrent = function (nrf)
{
    this.current.Copy (nrf);
    this.SynchroniseShader ();
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.SetPrecision = function (value)
{
    ShaderManager.precision = value;
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.DrawAnimation = function ()
{
    this.DrawAnimationFrame ();
    
    if ((this.animation_speed < 0 && this.animation_step <= 0)
        || (this.animation_speed > 0 && this.animation_step >= this.max_animation))
    {
        this.StopAnimation ();
        return;
    }
    this.animation_step += this.animation_speed;
    this.animation_step = Math.min (this.max_animation, Math.max (0, this.animation_step));
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.SkipFrame = function (delta)
{
    this.StopAnimation ();
    this.animation_step += delta;
    this.DrawAnimationFrame ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.DrawAnimationFrame = function ()
{
    var f = this.animation_step / this.max_animation;
    var nrf = NRFParameters.Interpolate (this.anim_start, this.anim_end, f)
    
    this.SetCurrent (nrf);
    
    show_step.innerHTML = this.animation_step;
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.StopAnimation = function ()
{
    WebGLController.animation_target = null;
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ResumeAnimation = function (rate)
{
    var n = parseInt (num_iterations.value);
    
    this.max_animation = Math.max (n,5);
    this.animation_speed = (rate) ? rate : 1;
    
    WebGLController.animation_target = this;
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ShowDiv = function (name)
{
    if (this.vis_div != null)
    {
        this.vis_div.style.display = "none";
    }
    
    if (name)
    {
        this.vis_div = document.getElementById(name);

        if (this.vis_div != null)
        {
            this.vis_div.style.display = "block";
        }
    }
}
//-------------------------------------------------------------------------------------------------
WebGLController.AnimatePattern = function ()
{
    if (WebGLController.animation_target)
    {
        WebGLController.animation_target.DrawAnimation ();
    }
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ShowJson = function (textarea)
{
    textarea.value = JSON.stringify(this.current);
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ApplyJson = function (textarea)
{
    if (this.current.UpdateFromJson (textarea.value))
    {
        this.StopAnimation ();
        this.SynchroniseShader ();
        this.Draw ();
    }
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.SelectExample = function (sel, textarea)
{
    var id = sel.options [sel.selectedIndex];
    
    if (id.value != "none")
    {
        textarea.value = NewtonExamples.GetExample (id.value);
        this.ApplyJson (textarea);
    }
}





