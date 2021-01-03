
//-------------------------------------------------------------------------------------------------
// Implements patterns created by the interferance caused by trying to render continuous 
// circular patterns (x^2 + y^2 = z) on a pixelated grid. Also includes other similar equations.
//
// (c) John Whitehouse 2002 - 2019
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

CircleController = function ()
{   
}
//----------------------------------------------------------------------------------------------------------------
CircleController.Initialise = function (w)
{
    CircleController.animator = new Animator (CircleController.Animate, 50);    
    CircleController.animation_target = null;
    
    z0.value = "0.001";
    a0.value = "1.000";
    b0.value = "1.000";
    c0.value = "0.000";
    d0.value = "0.000";
    e0.value = "0.000";
    f0.value = "0.000";

    dz.value = "0.001";
    da.value = "0.000";
    db.value = "0.000";
    dc.value = "0.001";
    dd.value = "0.000";
    de.value = "0.000";
    df.value = "0.000";
    
    n_colour.value = 20;
    
    SVGColours.AddColours (s_colour);
    SVGColours.AddColours (e_colour);
    
    s_colour.value = "white";
    e_colour.value = "black";
    pattern.value = "circle";
}
//----------------------------------------------------------------------------------------------------------------
CircleController.prototype.Initialise = function (circle_image, circle_state)
{
    this.img = circle_image;
    this.img_state = circle_state;
    this.width  = circle_image.width;
    this.height = circle_image.height;
    this.UpdateParameters ();
    this.MakeFunction ();
    this.Draw ();
}
//----------------------------------------------------------------------------------------------------------------
CircleController.prototype.Draw = function ()
{
    this.chelp = new CanvasHelp (this.width, this.height);
    
    this.chelp.SetBackground ("White");
    this.chelp.DrawFilledRect (0, 0, this.width, this.height);    
    this.DrawPattern ();
}
//----------------------------------------------------------------------------------------------------------------
CircleController.Animate = function ()
{
    if (CircleController.animation_target)
    {
        CircleController.animation_target.DoAnimation ();
    }
}
//----------------------------------------------------------------------------------------------------------------
CircleController.prototype.DoAnimation = function ()
{
    this.z += this.delta_z;
    this.a += this.delta_a;
    this.b += this.delta_b;
    this.c += this.delta_c;
    this.d += this.delta_d;
    this.e += this.delta_e;
    this.f += this.delta_f;
    
    this.MakeFunction ();
    this.DrawPattern ();
}
//----------------------------------------------------------------------------------------------------------------
CircleController.prototype.StartAnimation = function ()
{
    CircleController.animation_target = this;
    
    if (! CircleController.animator.IsRunning ())
    {
        CircleController.animator.Start ();
    }
}
//----------------------------------------------------------------------------------------------------------------
CircleController.prototype.ResetAnimation = function ()
{
    this.UpdateParameters ();
    this.MakeFunction ();
    this.DrawPattern ();
}
//----------------------------------------------------------------------------------------------------------------
CircleController.prototype.MakeFunction = function ()
{
    // Function
    
    if (this.z == 0)
    {
        this.fun = new Function('x', 'y', 'return 0;');
        return;
    }
    
    var terms = [];
    

    if (this.pattern == "circle")
    {
        terms [0] = CircleController.MakeTerm (1, "x*x");
        terms [1] = CircleController.MakeTerm (1, "y*y");
    }
    else if (this.pattern == "ellipse")
    {
        terms [0] = CircleController.MakeTerm (this.a, "x*x");
        terms [1] = CircleController.MakeTerm (this.b, "y*y");
    }
    else if (this.pattern == "line")
    {
        terms [0] = CircleController.MakeTerm (this.a, "x");
        terms [1] = CircleController.MakeTerm (this.b, "y");
    }
    else if (this.pattern == "conic")
    {
        terms [0] = CircleController.MakeTerm (this.a, "x*x");
        terms [1] = CircleController.MakeTerm (this.b, "y*y");
        terms [2] = CircleController.MakeTerm (this.c, "x*y");
        terms [3] = CircleController.MakeTerm (this.d, "x");
        terms [4] = CircleController.MakeTerm (this.e, "y");
        terms [5] = CircleController.MakeTerm (this.f, null);
    }
    else if (this.pattern == "elliptic")
    {
        terms [0] = CircleController.MakeTerm (this.a, "y*y");
        terms [1] = CircleController.MakeTerm (this.b, "x*x*x");
        terms [2] = CircleController.MakeTerm (this.c, "x*x");
        terms [3] = CircleController.MakeTerm (this.d, "x");
        terms [4] = CircleController.MakeTerm (this.e, null);
    }

    this.display_fun = CircleController.CombineTerms (terms);
    
    if (this.z != 0)
        this.display_fun = Misc.Format ("{0}*({1})", this.z.toFixed(10).replace(/0+$/,""), this.display_fun);

    var funtext = "return Math.floor(" + this.display_fun + ");";

    this.fun = new Function('x', 'y', funtext);
}
//----------------------------------------------------------------------------------------------------------------
CircleController.MakeTerm = function (k, term)
{
    if (k == 0) return null;
    
    var ret = {};
    
    if (term !== null)
    {
        if (k == 1)
        {
            ret.op = "+";
            ret.term = Misc.Format ("{0}", term);
        }
        else if (k == -1)
        {
            ret.op = "+";
            ret.term = Misc.Format ("{0}", term);
        }
        else if (k < 0)
        {
            ret.op = "-";
            ret.term = Misc.Format ("{0}*{1}", (-k).toFixed(10).replace(/0+$/,""), term);
        }
        else
        {
            ret.op = "+";
            ret.term = Misc.Format ("{0}*{1}", k.toFixed(10).replace(/0+$/,""), term);
        }
    }
    else
    {
        if (k < 0)
        {
            ret.op = "-";
            ret.term = (-k).toFixed(10).replace(/0+$/,"");
        }
        else
        {
            ret.op = "+";
            ret.term = k.toFixed(10).replace(/0+$/,"");
        }
    }
    return ret;
}
//----------------------------------------------------------------------------------------------------------------
CircleController.CombineTerms = function (terms)
{
    var funtext = "";
    var first = true;
    
    for (var idx in terms)
    {
        if (terms [idx] != null)
        {
            if (first && terms[idx].op == '+')
                funtext += terms[idx].term;
            else
                funtext += terms[idx].op + terms[idx].term;
            
            first = false;
        }
    }
    return funtext;
}
//----------------------------------------------------------------------------------------------------------------
CircleController.prototype.UpdateParameters = function ()
{
    var z0_val = parseFloat (z0.value);    
    
    this.pattern = pattern.value;
    
    if (z0_val == 0)
    {
        Misc.Alert ("Zoom value can't be 0");
        return;
    }
    
    var c1 = s_colour.value;
    var c2 = e_colour.value;
    
    if (c1 == c2)
    {
        Misc.Alert ("The start and end colours must be different");
        return;
    }
    
    var nc = parseInt (n_colour.value);
    
    if (nc < 2)
    {
        Misc.Alert ("At least 2 colours are required");
        return;
    }
    
    // Equation terms
    
    this.a = parseFloat (a0.value);
    this.b = parseFloat (b0.value);
    this.c = parseFloat (c0.value);
    this.d = parseFloat (d0.value);
    this.e = parseFloat (e0.value);
    this.f = parseFloat (f0.value);
    this.z = z0_val;
    
    
    this.delta_a = parseFloat (da.value);
    this.delta_b = parseFloat (db.value);
    this.delta_c = parseFloat (dc.value);
    this.delta_d = parseFloat (dd.value);
    this.delta_e = parseFloat (de.value);
    this.delta_f = parseFloat (df.value);
    this.delta_z = parseFloat (dz.value);

    // Colours
    
    if (nc == 2)
    {
        this.colour_map = [c1, c2];
    }
    else
    {
        this.colour_map = [];    

        for (var i = 0 ; i < nc ; ++i)
        {
            this.colour_map [i] = SVGColours.Blend (c1, c2, i / (nc-1));
        }
    }
}
//----------------------------------------------------------------------------------------------------------------
CircleController.prototype.ChangePattern = function()
{
    this.UpdateParameters();
}
//----------------------------------------------------------------------------------------------------------------
CircleController.prototype.PauseAnimation = function ()
{
    CircleController.animation_target = null;
}
//----------------------------------------------------------------------------------------------------------------
CircleController.HideHelp = function ()
{
}
//----------------------------------------------------------------------------------------------------------------
CircleController.prototype.DrawPattern = function ()
{
    var num_colours = this.colour_map.length;

    for (var i = 0 ; i < this.width ; ++i)
    {
        var x = i - this.width / 2;
            
        for (var j = 0 ; j < this.height ; ++j)
        {
            var y = j - this.height / 2;
            var z = this.fun (x, y);            
            
            this.chelp.SetBackground (this.colour_map [Math.abs(z) % num_colours]);
            this.chelp.FillRect (i,j,1,1);
        }
    }    
    this.img.src = this.chelp.canvas.toDataURL('image/png');
    this.img_state.innerHTML = Misc.Format ("Function = {0}", this.display_fun);
}
//----------------------------------------------------------------------------------------------------------------
CircleController.Circle = function (x, y)
{
    return Math.floor(this.z * (x * x + y * y));
}
//----------------------------------------------------------------------------------------------------------------
CircleController.Ellipse = function (x, y)
{
    return Math.floor(this.z * (x * x + this.a * y * y));
}
//----------------------------------------------------------------------------------------------------------------
CircleController.Anticircle = function (x, y)
{
    return Math.floor(this.z * (x * x - y * y));
}

CircleController.XYfun = function (x, y)
{
    return Math.floor(this.z * (x * x + this.xy_factor * x * y + y * y));
}

CircleController.X3Y3 = function (x, y)
{
    return Math.floor(this.z * (x * x * x + y * y * y));
}

CircleController.X4y4 = function (x, y)
{
    return Math.floor(this.z * (x * x * x * x + y * y * y * y));
}

CircleController.X3Y3_XY = function (x, y)
{
    var div = x * y;
    
    return (div == 0) ? 0 : Math.floor (this.z * (x * x * x + y * y * y) / div);
}

CircleController.XpY_XmY = function (x, y)
{
    var div = x - y;

    return Math.floor (this.z * (x + y) / (x - y));
}

        
    
    