
AffineController = function ()
{
}

AffineController.examples = [];

AffineController.examples [0] =
{
    'text':'{"A":{"a1":90,"a2":180,"sx":0.9,"sy":0.3,"dx":1,"dy":4},"B":{"a1":17,"a2":107,"sx":1,"sy":1,"dx":-1,"dy":-2},"C":{"a1":0,"a2":90,"sx":0.4,"sy":0.5,"dx":0,"dy":0},"c":"AB","mx":0,"my":0,"s":30,"ns":20,"nk":10}',
    'img':'ex1.png'
};

AffineController.examples [1] =
{
    'text':'{"A":{"a1":90,"a2":180,"sx":0.3,"sy":0.9,"dx":1,"dy":4},"B":{"a1":17,"a2":107,"sx":1,"sy":1,"dx":-1,"dy":-2},"C":{"a1":0,"a2":90,"sx":0.4,"sy":0.5,"dx":0,"dy":0},"c":"AB","mx":-2.88,"my":1.92,"s":50,"ns":20,"nk":10}',
    'img':'ex2.png'
};

AffineController.examples [2] =
{
    'text':'{"A":{"a1":90,"a2":180,"sx":0.9,"sy":0.6,"dx":1,"dy":4},"B":{"a1":45,"a2":135,"sx":1,"sy":1,"dx":0,"dy":0},"C":{"a1":0,"a2":90,"sx":0.4,"sy":0.4,"dx":-0.5,"dy":0},"c":"ABC","mx":-0.5840363400389361,"my":2.041116158338741,"s":67,"ns":20,"nk":10}',
    'img':'ex3.png'
};

AffineController.examples [3] =
{
    'text':'{"A":{"a1":90,"a2":180,"sx":0.9,"sy":0.6,"dx":1,"dy":4},"B":{"a1":45,"a2":135,"sx":1,"sy":1,"dx":0,"dy":0},"C":{"a1":0,"a2":90,"sx":0.4,"sy":0.4,"dx":-0.5,"dy":0},"c":"BC","mx":0.135963659961064,"my":-0.10455548345230414,"s":225,"ns":20,"nk":10}',
    'img':'ex4.png'
};

AffineController.examples [4] =
{
    'text':'{"A":{"a1":90,"a2":180,"sx":0.9,"sy":0.6,"dx":2,"dy":4},"B":{"a1":45,"a2":135,"sx":1,"sy":1,"dx":-3,"dy":-4},"C":{"a1":0,"a2":90,"sx":0.4,"sy":0.4,"dx":-0.5,"dy":0},"c":"AB","mx":0.135963659961064,"my":2.0287778498810294,"s":24,"ns":5,"nk":0}',
    'img':'ex5.png'
};

AffineController.examples [5] =
{
    'text':'{"A":{"a1":90,"a2":180,"sx":1,"sy":1,"dx":2,"dy":4},"B":{"a1":45,"a2":135,"sx":1,"sy":1,"dx":-3,"dy":-4},"C":{"a1":0,"a2":90,"sx":0.4,"sy":0.4,"dx":-0.5,"dy":0},"c":"AB","mx":0.135963659961064,"my":2.0287778498810294,"s":6,"ns":30,"nk":10}',
    'img':'ex6.png'
};
    
AffineController.examples [6] =
{
    'text':'{"A":{"a1":95,"a2":185,"sx":0.95,"sy":0.95,"dx":2,"dy":4},"B":{"a1":45,"a2":135,"sx":1.05,"sy":1,"dx":-3,"dy":-4},"C":{"a1":0,"a2":90,"sx":0.8,"sy":0.4,"dx":-0.5,"dy":0},"c":"AC","mx":0.135963659961064,"my":2.828777849881029,"s":75,"ns":30,"nk":10}',
    'img':'ex7.png'
};
    
AffineController.examples [7] =
{
    'text':'{"A":{"a1":90,"a2":180,"sx":0.95,"sy":0.97,"dx":1,"dy":1},"B":{"a1":70,"a2":160,"sx":1,"sy":1,"dx":0,"dy":0},"C":{"a1":0,"a2":90,"sx":0.4,"sy":0.4,"dx":-0.5,"dy":-0.2},"c":"AC","mx":0.01596365996106397,"my":0.8411161583387409,"s":200,"ns":20,"nk":10}',
    'img':'ex8.png'
};
    
AffineController.examples [8] =
{
    'text':'{"A":{"a1":90,"a2":180,"sx":1,"sy":1,"dx":2,"dy":4},"B":{"a1":45,"a2":135,"sx":0.8,"sy":0.9,"dx":-3,"dy":-4},"C":{"a1":0,"a2":90,"sx":0.4,"sy":0.4,"dx":-0.5,"dy":0},"c":"BC","mx":0.135963659961064,"my":-6.441810385413088,"s":34,"ns":30,"nk":10}',
    'img':'ex9.png'
};

AffineController.examples [8] =
{
    'text':'{"A":{"a1":0,"a2":90,"sx":-1,"sy":1,"dx":0,"dy":0},"B":{"a1":55,"a2":145,"sx":1,"sy":1,"dx":0,"dy":0},"C":{"a1":0,"a2":90,"sx":0.4,"sy":0.4,"dx":-10.5,"dy":-5},"c":"ABC","mx":0.135963659961064,"my":-0.10455548345230414,"s":11,"ns":20,"nk":10}',
    'img':'ex10.png'
};
    
//----------------------------------------------------------------------------------------------------------------


AffineController.prototype.Initialise = function ()
{
	// Drawing parameters
	
	this.scale_val = new UIValue (scale_val, 30, UIValue.Float);
	this.per_update = new UIValue (per_update, 100, UIValue.Int);
	this.per_point = new UIValue (per_point, 20, UIValue.Int);
	this.skip = new UIValue (skip, 10, UIValue.Int);
	
	// The transforms

    this.transform = {};
  	this.transform ['A'] = new AffineTransformation ();
  	this.transform ['B'] = new AffineTransformation ();
  	this.transform ['C'] = new AffineTransformation ();
    
    this.transform ['A'].SetOffset (1,4);
    this.transform ['B'].SetOffset (-1, -2);

    this.transform ['A'].SetScale (0.9,0.3);
    this.transform ['A'].SetRotationDegrees (90);
    this.transform ['B'].SetRotationDegrees (17);
    this.transform ['C'].SetScale (0.4,0.5);

    this.InitialEditor ();

	// Which transforms to animate
	
	combine.value = "AB";
    colour_range.value = 100;
    scroll_percent.value = 20;
    show_grid.checked = true;
    
	// Drawing coordinates

	this.xc = 360;
	this.yc = 240;
	
	this.chelp = new CanvasHelp (720, 480);
	this.animator = new Animator (AffineController.ContinueAnimation, 100);
	this.animator.Start ();
	this.animation_enabled = false;
	this.cells = new Array ();
	this.colours = new Array (101);
    this.model_xc = 0;
    this.model_yc = 0;
    this.UpdateScale ();
   
	for (var i = 0 ; i < 20 ; ++i)
	{
		var factor = 1 - i * 0.05;
		this.colours [i] = SVGColours.Blend (AffineController.Colours[0], AffineController.Colours[1], factor);
		this.colours [i+20] = SVGColours.Blend (AffineController.Colours[1], AffineController.Colours[2], factor);
		this.colours [i+40] = SVGColours.Blend (AffineController.Colours[2], AffineController.Colours[3], factor);
		this.colours [i+60] = SVGColours.Blend (AffineController.Colours[3], AffineController.Colours[4], factor);
		this.colours [i+80] = SVGColours.Blend (AffineController.Colours[4], AffineController.Colours[5], factor);
	}
	this.colours [100] = "white";

    AffineController.NUM_COLOURS = 100;
	AffineController.animation_target = this;
    
    this.UpdateSettings ();
    
    // Event handling
    
    EventParser.Initialise ();

    this.popup_event_handler = new EventParser ();
    this.general_event_handler = new EventParser ();
    this.info_event_handler = new EventParser ();
    this.load_event_handler = new EventParser ();
    
    // Keyboard shortcuts when in general mode
    
    this.general_event_handler.AddKeyHandler ("H", this, this.ShowHelp);
    this.general_event_handler.AddKeyHandler ("A", this, this.ShowCreateMatrixA);
    this.general_event_handler.AddKeyHandler ("B", this, this.ShowCreateMatrixB);
    this.general_event_handler.AddKeyHandler ("C", this, this.ShowCreateMatrixC);    

    // Keyboard shortcuts for the edit matrix popup
    
    this.popup_event_handler.AddKeyHandler (EventParser.ENTER, this, this.CalculateMatrix);
    this.popup_event_handler.AddKeyHandler (EventParser.ESCAPE, this, this.HideCreateMatrix);

    // Keyboard shortcuts for the load JSON popup
    
    this.popup_event_handler.AddKeyHandler (EventParser.ENTER, this, this.LoadJson);
    this.popup_event_handler.AddKeyHandler (EventParser.ESCAPE, this, this.HideCreateMatrix);

    // Keyboard shortcuts for the help popup
    
    this.info_event_handler.AddKeyHandler (EventParser.ENTER, this, this.HideHelp);
    this.info_event_handler.AddKeyHandler (EventParser.ESCAPE, this, this.HideHelp);

    EventParser.SetActiveInstance (this.general_event_handler);
    
    
    // Draw initial transforms
    
    this.DrawTransformA ();
    this.DrawTransformB ();
    this.DrawTransformC ();
    
    // Examples
    
    AffineController.example_ids = [ex1,ex2,ex3,ex4,ex5];
    
    this.num_examples = AffineController.examples.length;
    this.num_example_slots = AffineController.example_ids.length;
    this.example_idx = 0;
    
    this.ShowExamples ();
}

AffineController.animation_target;
AffineController.WIDTH = 720;
AffineController.HEIGHT = 480;
AffineController.Colours = ["black", "blue", "lime", "yellow", "red", "white"];

//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.InitialEditor = function ()
{
	this.tx_angle_1 = new UIValue (tx_angle_1, 0, UIValue.Float);
	this.tx_angle_2 = new UIValue (tx_angle_2, 90, UIValue.Float);
	this.tx_scale_1 = new UIValue (tx_scale_1, 1, UIValue.Float);
	this.tx_scale_2 = new UIValue (tx_scale_2, 1, UIValue.Float);
	this.tx_x_offset = new UIValue (tx_x_offset, 1, UIValue.Float);
    this.tx_y_offset = new UIValue (tx_y_offset, 1, UIValue.Float);
    use_skew.checked = false;
    this.use_skew = false;    
}              
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.UpdateEditor = function ()
{    
	this.tx_angle_1.Set (this.working.angle_1);
	this.tx_angle_2.Set (this.working.angle_2);
	this.tx_scale_1.Set (this.working.scale_x);
	this.tx_scale_2.Set (this.working.scale_y);
	this.tx_x_offset.Set (this.working.dx);
    this.tx_y_offset.Set (this.working.dy);
    this.use_skew = use_skew.checked;
    
    this.DrawNewTransform (this.working);
}     
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.DrawTransform = function (id)
{
    if(id == 'A')
    {
        this.DrawTransformA ();
    }
    else if(id == 'B')
    {
        this.DrawTransformB ();
    }
    else if(id == 'C')
    {
        this.DrawTransformC ();
    }
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.DrawTransformA = function ()
{
    AffineController.DrawTransform (this.transform ['A'], a_transform, a_transform.width, a_transform.height);
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.DrawTransformB = function ()
{
    AffineController.DrawTransform (this.transform ['B'], b_transform, a_transform.width, a_transform.height);
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.DrawTransformC = function ()
{
    AffineController.DrawTransform (this.transform ['C'], c_transform, a_transform.width, a_transform.height);
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.DrawNewTransform = function (transform)
{
    AffineController.DrawTransform (transform, new_transform, a_transform.width, a_transform.height);
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.StopAnimation = function ()
{
	this.animation_enabled = false;
}
AffineController.prototype.ResumeAnimation = function ()
{
	this.animation_enabled = true;
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.ContinueAnimation = function()
{
	if (AffineController.animation_target.animation_enabled)
	if (AffineController.animation_target.animation_enabled)
	{
		AffineController.animation_target.AnimatePoint ();
	}
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.Move = function (dx, dy)
{
    var f = parseInt (scroll_percent.value) * 0.01;
    
    this.model_xc += dx * f * this.model_width;
    this.model_yc += dy * f * this.model_height;
    
    this.StartAnimation ();
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.Centre = function ()
{
    this.model_xc = 0;
    this.model_yc = 0;
    this.StartAnimation ();
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.StartAnimation = function ()
{
	for (var idx = 0 ; idx < AffineController.WIDTH * AffineController.HEIGHT ; ++idx)
		this.cells [idx] = 0;

	this.UpdateSettings ();
    this.DrawBackground ();
    this.DrawGrid ();
    this.animation_enabled = true;
	this.counter = 0;
    
    centre_text.innerHTML = "(" + this.model_xc.toFixed(6) + "," + this.model_yc.toFixed(6) + ")";
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.DrawBackground = function()
{
	this.chelp.SetBackground ("black");
	this.chelp.SetForeground ("white");
	this.chelp.SetLineWidth (1);

	this.chelp.DrawFilledRect (0, 0, this.chelp.canvas.width, this.chelp.canvas.height);
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.DrawGrid = function()
{
    if (show_grid.checked)
    {
        this.chelp.SetForeground ("gray");

        var xmin = (this.model_xc - this.model_width / 2);
        var ymin = (this.model_yc - this.model_height / 2);
        var xmax = (this.model_xc + this.model_width / 2);
        var ymax = (this.model_yc + this.model_height / 2);

        
        for (x = Math.ceil (xmin) ; x < xmax ; ++x)
        {
            var draw_x = (x - this.model_xc) * this.scale + this.xc;
            this.chelp.SetForeground ((x == 0) ? "white" : "dimgray");
            this.chelp.DrawLine ([draw_x, 0], [draw_x, this.chelp.canvas.height]);
        }

        for (y = Math.ceil (ymin) ; y < ymax ; ++y)
        {
            var draw_y = (this.model_yc - y) * this.scale + this.yc;
            this.chelp.SetForeground ((y == 0) ? "white" : "dimgray");
            this.chelp.DrawLine ([0, draw_y], [this.chelp.canvas.width, draw_y]);
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.StopAnimation = function()
{
	this.animation_enabled = false;
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.UpdateSettings = function ()
{
	this.UpdateScale ();
	this.keys = [];
	
	var temp = combine.value;
	
	for (var idx in temp)
	{
		this.keys.push (temp[idx]);
	}
	
	this.num_points = this.per_update.Get ();
	this.num_steps = this.per_point.Get ();
	this.num_skip = this.skip.Get ();
    this.cfactor = AffineController.NUM_COLOURS / Math.log (colour_range.value);
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.UpdateScale = function ()
{
	this.scale = this.scale_val.Get ();
    this.model_width = this.chelp.canvas.width / this.scale;
    this.model_height = this.chelp.canvas.height / this.scale;
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.UpdateGrid = function ()
{
    this.draw_grid = show_grid.checked;
    this.DrawBackground ();
    this.DrawGrid ();
    this.DrawAll ();
    
	picture.src = this.chelp.canvas.toDataURL('image/png');
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.ChangeColourDepth = function ()
{
    this.cfactor = AffineController.NUM_COLOURS / Math.log (colour_range.value)
    this.DrawBackground ();
    this.DrawGrid ();
    this.DrawAll ();
    
	picture.src = this.chelp.canvas.toDataURL('image/png');
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.AnimatePoint = function ()
{
    var start_range = -1;
    var end_range = 1;

	for (var j = 0 ; j < this.num_points ; ++ j)
	{
		//var point = [Math.random () * 2 - 1, Math.random () * 2 - 1, 1];
		var point = [Misc.RandomFloat (start_range, end_range), Misc.RandomFloat (start_range, end_range), 1];
		
		for (var i = 0 ; i < this.num_steps ; ++i)
		{
            if (i >= this.num_skip)
            {
                this.PlotPoint (point);
            }
			var op = Misc.RandomElement (this.keys);
			point = this.transform [op].MapV3 (point);
		}
	}
	this.counter += this.num_points * this.num_steps;
	
	counter_text.innerHTML = this.counter;
	
	picture.src = this.chelp.canvas.toDataURL('image/png');
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.Partition = function (x)
{
	return (x < 0.5) ? [0.5 - x, x + 0.5, 0] : [0, 1.5 - x, x - 0.5];
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.PlotPoint = function (point)
{
    var x = (point[0] - this.model_xc) * this.scale + this.xc;
    var y = (this.model_yc - point[1]) * this.scale + this.yc;
    
    // parcel the point among the 4 overlapping cells
    
    var x0 = Math.floor (x);
    var y0 = Math.floor (y);
    var p1 = AffineController.Partition (x - x0);
    var p2 = AffineController.Partition (y - y0);
    
    for (var dx = 0 ; dx < 3 ; ++dx)
    {
        for (var dy = 0 ; dy < 3 ; ++dy)
        {
            var add = p1[dx] * p1[dy];

            if (add > 0)
            {
                var ix = x0 + dx - 1;
                var iy = y0 + dy - 1;

                if (ix >= 0 && ix < AffineController.WIDTH && iy >= 0 && iy < AffineController.HEIGHT)
                {
                    var pos = iy * AffineController.WIDTH + ix;
                    this.cells [pos] += add;
                    var cidx = Math.max (0, Math.floor(Math.log (this.cells [pos]) * this.cfactor));
                    var c = (cidx < 100) ? this.colours [cidx] : this.colours [100];
                    this.chelp.SetBackground (c);
                    this.chelp.SetPixel (ix, iy);
                }
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.DrawAll = function ()
{
    for (var ix = 0 ; ix < AffineController.WIDTH ; ++ix)
    {
        for (var iy = 0 ; iy < AffineController.HEIGHT ; ++iy)
        {
            var pos = iy * AffineController.WIDTH + ix;
            var cidx = Math.max (0, Math.floor(Math.log (this.cells [pos]) * this.cfactor));
            
            if (cidx > 0)
            {
                var c = (cidx < 100) ? this.colours [cidx] : this.colours [100];
            
                this.chelp.SetBackground (c);
                this.chelp.SetPixel (ix, iy);
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.ShowHelp = function ()
{
	show_help.style.visibility="visible";

    EventParser.SetActiveInstance (this.info_event_handler);
}
AffineController.prototype.HideHelp = function ()
{
    // Shared by multiple popups
    
	show_help.style.visibility="hidden";
	display_matrix.style.visibility="hidden";
    show_json.style.visibility="hidden";
    load_json.style.visibility="hidden";

    EventParser.SetActiveInstance (this.general_event_handler);
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.ShowCreateMatrixA = function ()
{
    this.ShowCreateMatrix(1);
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.ShowCreateMatrixB = function ()
{
    this.ShowCreateMatrix(2);
}//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.ShowCreateMatrixC = function ()
{
    this.ShowCreateMatrix(3);
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.ShowCreateMatrix = function (n)
{
	build_matrix.style.visibility="visible";
    
    EventParser.SetActiveInstance (this.popup_event_handler);

	this.active_matrix = "-ABC"[n];
    
	matrix_n1.innerHTML = this.active_matrix;
    
    this.working = this.transform [this.active_matrix].Clone ();
    
    this.UpdateEditor ();
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.ShowMatrix = function (n)
{
	display_matrix.style.visibility="visible";
    
    EventParser.SetActiveInstance (this.info_event_handler);

	var id = "-ABC"[n];
    
	matrix_n2.innerHTML = id;
    
    var tx = this.transform [id];
    
    tx_m11.innerHTML = "&nbsp;" + tx.matrix3.m11 + "&nbsp;";
    tx_m12.innerHTML = "&nbsp;" + tx.matrix3.m12 + "&nbsp;";
    tx_m13.innerHTML = "&nbsp;" + tx.matrix3.m13 + "&nbsp;";
    tx_m21.innerHTML = "&nbsp;" + tx.matrix3.m21 + "&nbsp;";
    tx_m22.innerHTML = "&nbsp;" + tx.matrix3.m22 + "&nbsp;";
    tx_m23.innerHTML = "&nbsp;" + tx.matrix3.m23 + "&nbsp;";
    tx_m31.innerHTML = "&nbsp;" + tx.matrix3.m31 + "&nbsp;";
    tx_m32.innerHTML = "&nbsp;" + tx.matrix3.m32 + "&nbsp;";
    tx_m33.innerHTML = "&nbsp;" + tx.matrix3.m33 + "&nbsp;";
}
 

AffineController.prototype.TxShow = function ()
{
    if (use_skew.checked)
    {
        this.working.SetSkewDegrees (this.tx_angle_1.Get(), this.tx_angle_2.Get());
    }
    else
    {
        this.working.SetRotationDegrees (this.tx_angle_1.Get());
    }
    this.working.SetScale (this.tx_scale_1.Get(), this.tx_scale_2.Get());
    this.working.SetOffset (this.tx_x_offset.Get(), this.tx_y_offset.Get());
    this.UpdateEditor ();
}
AffineController.prototype.TxReflectX = function ()
{
    this.working.ReflectX ();
    this.UpdateEditor ();
}
AffineController.prototype.TxReflectY = function ()
{
    this.working.ReflectY ();
    this.UpdateEditor ();
}
AffineController.prototype.TxReset = function ()
{
    this.working = new AffineTransformation ();
    this.UpdateEditor ();
}

AffineController.prototype.HideCreateMatrix = function ()
{
	build_matrix.style.visibility="hidden";
    EventParser.SetActiveInstance (this.general_event_handler);
}
AffineController.prototype.CalculateMatrix = function ()
{
    var tx = new AffineTransformation ();

	var a1 = this.tx_angle_1.Get ();
	var a2 = this.tx_angle_2.Get ();
	var s1 = this.tx_scale_1.Get ();
	var s2 = this.tx_scale_2.Get ();
	var dx = this.tx_x_offset.Get ();
    var dy = this.tx_y_offset.Get ();
    
    tx.SetOffset (dx, dy);
    tx.SetScale (s1, s2);
    tx.SetSkewDegrees (a1, a2);
    
	this.HideCreateMatrix ();
    
    this.transform [this.active_matrix] = tx;
    this.DrawTransform (this.active_matrix);
    
    if (this.animation_enabled)
    {
        this.StartAnimation ();
    }
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.ShowSaveText = function ()
{
	show_json.style.visibility="visible";

    EventParser.SetActiveInstance (this.info_event_handler);
    
    save_text.value = this.MakeSaveString ();
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.ShowLoadJson = function ()
{
	load_json.style.visibility="visible";

    EventParser.SetActiveInstance (this.load_event_handler);
    
    load_text.value = "";
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.LoadJson = function ()
{
	load_json.style.visibility="hidden";

    EventParser.SetActiveInstance (this.general_event_handler);
    
    this.RestoreSaveString (load_text.value);
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.MakeSaveString = function ()
{
    var obj = {};
    
    obj ['A'] = this.transform ['A'].GetDefinition();
    obj ['B'] = this.transform ['B'].GetDefinition();
    obj ['C'] = this.transform ['C'].GetDefinition();
    obj.c = combine.value;
    obj.mx = this.model_xc;
    obj.my = this.model_yc;
    obj.s = this.scale;
    obj.ns = this.num_steps;
    obj.nk = this.num_skip;

    return JSON.stringify (obj);
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.RestoreSaveString = function (text)
{
    var obj;
    
    try
    {
        obj = JSON.parse (text);
    }
    catch(err)
    {
        alert (err);
        return;
    }

    var ok = typeof (obj) == "object"
                && typeof (obj.A) == "object"
                && typeof (obj.B) == "object"
                && typeof (obj.C) == "object"
                && typeof (obj.c) == "string"
                && typeof (obj.mx) == "number"
                && typeof (obj.my) == "number"
                && typeof (obj.s) == "number"
                && typeof (obj.ns) == "number"
                && typeof (obj.nk) == "number";
                
    if (! ok)
    {
        alert ("Object is not a transform");
        return;
    }
    
    this.transform ['A'].SetDefinition(obj ['A']);
    this.transform ['B'].SetDefinition(obj ['B']);
    this.transform ['C'].SetDefinition(obj ['C']);
        
    combine.value = obj.c;
    this.model_xc = obj.mx;
    this.model_yc = obj.my;
    this.scale = obj.s;
    this.num_steps = obj.ns;
    this.num_skip = obj.nk;
        
    this.scale_val.Set (this.scale);
	this.per_point.Set (this.num_steps);
	this.skip.Set (this.num_skip);

    this.DrawTransformA ();
    this.DrawTransformB ();
    this.DrawTransformC ();    
    
    this.StartAnimation ();
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.DrawTransform = function (transform, image, w, h)
{
	var chelp = new CanvasHelp (w, h);
	
	chelp.SetBackground ("midnightblue");

	chelp.DrawFilledRect (0, 0, w, h);
	
	var xc = chelp.canvas.width / 2;
	var yc = chelp.canvas.height / 2;
	var p = [];
	
	p[0] = [0,0,1];
	p[1] = [1,0,1];
	p[2] = [1,1,1];
	p[3] = [0,1,1];
	p[4] = transform.MapV3 (p[0]);
	p[5] = transform.MapV3 (p[1]);
	p[6] = transform.MapV3 (p[2]);
	p[7] = transform.MapV3 (p[3]);
	
	var xmax = Math.max (1, Math.abs (p[4][0]), Math.abs (p[5][0]), Math.abs (p[6][0]), Math.abs (p[7][0])) + 0.5 ;
	var ymax = Math.max (1, Math.abs (p[4][1]), Math.abs (p[5][1]), Math.abs (p[6][1]), Math.abs (p[7][1])) + 0.5 ;
	var f = Math.min (w / xmax, h / ymax) / 2;
	
	for (var i = 0 ; i < 8 ; ++i)
	{
		p [i][0] = p [i][0] * f + xc;
		p [i][1] = yc - p [i][1] * f;
	}
	
	chelp.SetForeground ("magenta");
	chelp.SetLineWidth (1);
	
	chelp.DrawLine ([xc,0], [xc, chelp.canvas.height]);
	chelp.DrawLine ([0,yc], [chelp.canvas.width,yc]);
	
	chelp.SetForeground ("cyan");
	chelp.DrawLine (p[0],p[1]);
	chelp.DrawLine (p[1],p[2]);
	chelp.DrawLine (p[2],p[3]);
	chelp.DrawLine (p[3],p[0]);
	
	chelp.SetForeground ("white");
	chelp.DrawLine (p[4],p[5]);
	chelp.DrawLine (p[5],p[6]);
	chelp.DrawLine (p[6],p[7]);
	chelp.DrawLine (p[7],p[4]);
	
	image.src = chelp.canvas.toDataURL('image/png');
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.ShowExample = function (n)
{
    var idx = (this.example_idx + n) % this.num_examples;
    var text = AffineController.examples [idx].text; 
    
    this.RestoreSaveString (text);
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.ScrollImages = function (direction)
{
    this.example_idx += (direction > 0) ? 1 : (this.num_examples - 1);
    this.example_idx = this.example_idx % this.num_examples;

    this.ShowExamples ();
}
//------------------------------------------------------------------------------------------------------------------------------------
AffineController.prototype.ShowExamples = function ()
{
    for (var i = 0 ; i < this.num_example_slots ; ++i)
    {
        var idx = (this.example_idx + i) % this.num_examples;
        
        AffineController.example_ids[i].src = AffineController.examples [idx].img;        
    }        
}