WebGLController = function ()
{
}

WebGLController.animation_target = null;
WebGLController.timer = null;

WebGLController.prototype.Initialise = function ()
{
    this.variables = {};
    
    this.variables ["z9"] = new AnimationFloat (z9_start, z9_delta, z9_current);
    this.variables ["z8"] = new AnimationFloat (z8_start, z8_delta, z8_current);
    this.variables ["z7"] = new AnimationFloat (z7_start, z7_delta, z7_current);
    this.variables ["z6"] = new AnimationFloat (z6_start, z6_delta, z6_current);
    this.variables ["z5"] = new AnimationFloat (z5_start, z5_delta, z5_current);
    this.variables ["z4"] = new AnimationFloat (z4_start, z4_delta, z4_current);
    this.variables ["z3"] = new AnimationFloat (z3_start, z3_delta, z3_current);
    this.variables ["z2"] = new AnimationFloat (z2_start, z2_delta, z2_current);
    this.variables ["z1"] = new AnimationFloat (z1_start, z1_delta, z1_current);
    this.variables ["z0"] = new AnimationFloat (z0_start, z0_delta, z0_current);
    this.variables ["zoom"] = new AnimationExponential (zoom_start, zoom_factor, [zoom_current,zoom_value]);
    this.variables ["alpha"] = new AnimationCoordinate (alpha_start, alpha_delta, [alpha_current,alpha_value]);
    this.variables ["seed"] = new AnimationCoordinate (seed_start, seed_delta, [seed_current,seed_value]);
    this.variables ["steps"] = new AnimationInt (steps_start, steps_inc, [steps_current,steps_value]);
    this.variables ["colour"] = new AnimationCoordinate (clr_start, clr_inc, [clr_current,colour_origin]);

    this.vis_div = null;     
    
    WebGLController.animation_target = null;
    WebGLController.timer = setInterval(WebGLController.AnimatePattern, 100);
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
    var coeffs = [];

    coeffs.push (this.variables ["z0"].current);
    coeffs.push (this.variables ["z1"].current);
    coeffs.push (this.variables ["z2"].current);
    coeffs.push (this.variables ["z3"].current);
    coeffs.push (this.variables ["z4"].current);
    coeffs.push (this.variables ["z5"].current);
    coeffs.push (this.variables ["z6"].current);
    coeffs.push (this.variables ["z7"].current);
    coeffs.push (this.variables ["z8"].current);
    coeffs.push (this.variables ["z9"].current);

    this.polynomial = Polynomial.FromValues (coeffs);

    if (this.polynomial.order < 2)
    {
        alert ("The polynomial must be of at least order 2, ie include a Z^2 or higher term");
        return;
    }

    this.derivative = this.polynomial.Derivative ();

    ShaderManager.SetPolynomial (this.polynomial);
    this.UpdateStatus ();
    
    var derivative = this.polynomial.Derivative ();
    var x = this.polynomial.MakeNewtonPolynomials ();
    var roots = this.polynomial.FindRoots ();
    
    var t = 
        "Iteration = z &rarr; ( " + this.polynomial.newton_top.AsHTML () +
        ") / (" + this.polynomial.newton_bottom.AsHTML () + ")";

    for (var idx in roots)
    {
        t += "<br>Root[" + idx + "] = " + roots [idx] + ", F = " + this.polynomial.GetValue (roots[idx]);
    }
    
    test_text.innerHTML = t;
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
    this.InitSeed();
    this.InitAlpha();
    this.InitColourOrigin();
    this.ResetTightness();
    ShaderManager.SetZoom (this.variables ["zoom"].current);    
    ShaderManager.SetIterations (this.variables ["steps"].current);  
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.Draw = function ()
{
    status_text.innerHTML = "Calculating";

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
WebGLController.prototype.ShowCurrentValues = function ()
{
    for (var vidx in this.variables)
    {
        this.variables [vidx].UpdateWatchers ();
    }
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ZoomBy = function (f)
{
    this.variables ["zoom"].SetCurrent (this.variables ["zoom"].current * f);
    ShaderManager.SetZoom (this.variables ["zoom"].current);
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ResetZoom = function (f)
{
    this.variables ["zoom"].SetCurrent (this.variables ["zoom"].start);
    ShaderManager.SetZoom (this.variables ["zoom"].current);  
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.AdjustIterations = function (f)
{
    this.variables ["steps"].ScaleValue (f);
    ShaderManager.SetIterations (this.variables ["steps"].current);  
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
    var zoom = (mode == ShaderManager.STANDARD) ? 0.5 : 1.2;
    
    this.variables ["zoom"].SetStart (zoom);

    ShaderManager.SetMode (mode);
    ShaderManager.SetZoom (zoom);
}
//-----------------------------------------------------------------------------------------------
WebGLController.prototype.ResetV = function ()
{
    if (ShaderManager.mode == ShaderManager.STANDARD)
    {
        this.UpdateShaderPosition (0,0);
    }
    else
    {
        this.UpdateShaderPosition (1,0);
    }
}
//-----------------------------------------------------------------------------------------------
WebGLController.prototype.UpdateShaderPosition = function (x,y)
{
    if (ShaderManager.mode == ShaderManager.STANDARD)
    {
        ShaderManager.SetSeedPosition (x, y);

        this.variables ["seed"].SetCurrent (x, y);
    }
    else
    {
        ShaderManager.SetAlphaValue (x, y);

        this.variables ["alpha"].SetCurrent (x, y);
    }
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.InitSeed = function()
{
    var x = this.variables ["seed"].current_x;
    var y = this.variables ["seed"].current_y;

    ShaderManager.SetSeedPosition (x, y);
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.SetSeed = function(x, y)
{
    this.variables ["seed"].SetCurrent (x, y);

    ShaderManager.SetSeedPosition (x, y);
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.MoveSeed = function(dx, dy, seed_inc)
{
    seed_delta = parseFloat (seed_inc.value);

    if (ShaderManager.mode == ShaderManager.ALPHA)
    {
        var x = this.variables ["seed"].current_x + dx * seed_delta;
        var y = this.variables ["seed"].current_y + dy * seed_delta;
    }
    else
    {
        var w = 2 * ShaderManager.start_w / ShaderManager.zoom;
        var h = 2 * ShaderManager.start_h / ShaderManager.zoom;
        var x = this.variables ["seed"].current_x + w * dx * seed_delta;
        var y = this.variables ["seed"].current_y + h * dy * seed_delta;
    }

    this.SetSeed (x, y);
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ResetSeed = function()
{
    this.variables ["seed"].Restart ();
    
    var x = this.variables ["seed"].current_x;
    var y = this.variables ["seed"].current_y;

    this.SetSeed (x, y);
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.InitAlpha = function ()
{
    var x = this.variables ["alpha"].current_x;
    var y = this.variables ["alpha"].current_y;
    ShaderManager.SetAlphaValue (x, y);
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.MoveAlpha = function(dx, dy, alpha_inc)
{
    alpha_delta = parseFloat (alpha_inc.value);

    if (ShaderManager.mode == ShaderManager.STANDARD)
    {
        var x = this.variables ["alpha"].current_x + dx * alpha_delta;
        var y = this.variables ["alpha"].current_y + dy * alpha_delta;
    }
    else
    {
        var w = 2 * ShaderManager.start_w / ShaderManager.zoom;
        var h = 2 * ShaderManager.start_h / ShaderManager.zoom;
        var x = this.variables ["alpha"].current_x + w * dx * alpha_delta;
        var y = this.variables ["alpha"].current_y + h * dy * alpha_delta;
    }

    this.SetAlpha (x, y);
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ResetAlpha = function()
{
    this.variables ["alpha"].Restart ();
    
    var x = this.variables ["alpha"].current_x;
    var y = this.variables ["alpha"].current_y;

    this.SetAlpha (x, y);
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.SetAlpha = function(x, y)
{
    this.variables ["alpha"].SetCurrent (x, y);

    ShaderManager.SetAlphaValue (x, y);
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.InitColourOrigin = function ()
{
    var x = this.variables ["colour"].current_x;
    var y = this.variables ["colour"].current_y;
    ShaderManager.SetColourOrigin (x, y);
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.MoveColourOrigin = function (dx, dy)
{
    var colour_delta = colour_inc.value;
    
    var x = this.variables ["colour"].current_x + dx * colour_delta;
    var y = this.variables ["colour"].current_y + dy * colour_delta;
    
    this.SetColourOrigin (x, y);
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ResetColourOrigin = function ()
{
    this.variables ["colour"].Restart ();
    
    var x = this.variables ["colour"].current_x;
    var y = this.variables ["colour"].current_y;
    
    this.SetColourOrigin (x, y);
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.SetColourOrigin = function (x, y)
{
    this.variables ["colour"].SetCurrent (x, y);

    ShaderManager.SetColourOrigin (x, y);
    this.Draw ();
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
    this.Draw ();
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
WebGLController.prototype.ApplySettings = function ()
{
    for(var idx in this.variables)
    {
        this.variables [idx].Update ();
    }
    this.SynchroniseShader ();
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ResetSettings = function ()
{
    for(var idx in this.variables)
    {
        this.variables [idx].Reset ();
    }
    this.SynchroniseShader ();
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.LockInSettings = function ()
{
    for(var idx in this.variables)
    {
        this.variables [idx].LockIn ();
    }
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.Next = function ()
{
    this.IncrementSettings ();
    this.SynchroniseShader ();
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.IncrementSettings = function ()
{
    for(var idx in this.variables)
    {
        this.variables [idx].Next ();
    }
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.SetPrecision = function (value)
{
    ShaderManager.precision = value;
    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.StartAnimation = function ()
{
    if (WebGLController.animation_target != null)
    {
        return;
    }    
    
    for (var vidx in this.variables)
    {
        this.variables [vidx].Restart ();
    }

    this.animation_step = 0;
    this.ResumeAnimation ();
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.DrawAnimation = function ()
{
    if (this.animation_step >= this.max_animation)
    {
        this.StopAnimation ();
        return;
    }

    WebGLController.animation_target.Next ();
    ++this.animation_step;
    show_step.innerHTML = this.animation_step;
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.StopAnimation = function ()
{
    WebGLController.animation_target = null;
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ResumeAnimation = function ()
{
    var n = parseInt (max_animation.value);
    
    this.max_animation = (n < 5) ? 5 : n;
    
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
    var settings = {};
    
    for(var idx in this.variables)
    {
        settings [idx] = this.variables [idx].ToSaveObject ();
    }
    textarea.value = JSON.stringify(settings);
}
//-------------------------------------------------------------------------------------------------
WebGLController.prototype.ApplyJson = function (textarea)
{
    var settings = JSON.parse (textarea.value);
    
    for(var idx in this.variables)
    {
        if (settings.hasOwnProperty (idx))
        {
            this.variables [idx].FromSaveObject (settings[idx]);
        }
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





