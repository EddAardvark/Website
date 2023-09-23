//-------------------------------------------------------------------------------------------------
// Construct and draw diagrams
//
// Requires colours.js, canvas_helpers.js, misc.js
// (c) John Whitehouse 2022
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

Graphics = function ()
{
}

Graphics.MAX_SIZE = 50000000;  // 50 million is a lot of pixels

Graphics.ValueGridDef = function ()
{
    this.x_min = null;
    this.x_max = null;
    this.y_min = null;
    this.y_max = null;
    this.z_min = null;
    this.z_max = null;
    this.cell_x = 1;
    this.cell_y = 1;

    this.start_colour = "white";
    this.mid_colour = null;
    this.end_colour = "midnightblue";
    this.back_colour = "gray";
    this.image_width = 480;
    this.image_height = 480;
}
Graphics.ValueGridDef.prototype.Fix = function (def, data)
{
    // Data is a set of [x,y,z] values.
    
    if (this.x_min === null) this.x_min = Graphics.ValueGridDef.GetMin (data, 0);
    if (this.y_min === null) this.y_min = Graphics.ValueGridDef.GetMin (data, 1);
    if (this.z_min === null) this.z_min = Graphics.ValueGridDef.GetMin (data, 2);
    if (this.x_max === null) this.x_max = Graphics.ValueGridDef.GetMax (data, 0);
    if (this.y_max === null) this.y_max = Graphics.ValueGridDef.GetMax (data, 1);
    if (this.z_max === null) this.z_max = Graphics.ValueGridDef.GetMax (data, 2);
    
    this.x_min = Math.floor (this.x_min);
    this.y_min = Math.floor (this.y_min);
    this.x_max = Math.ceil (this.x_max);
    this.y_max = Math.ceil (this.y_max);
    this.num_x = this.x_max - this.x_min + 1;
    this.num_y = this.y_max - this.y_min + 1;
    this.z_range = this.z_max - this.z_min;

    if (this.z_range <= 0) this.z_range = 1;
    
    if (this.num_x * this.num_y > Graphics.MAX_SIZE) throw Misc.Format ("{0} x {1} is too big", this.num_x, this.num_y);
    
    
    if (this.cell_x !== null)
    {
        this.image_width = this.num_x * this.cell_x;
    }
    else
    {
        this.cell_x = this.image_width / this.num_x;
    }
    
    if (this.cell_y !== null)
    {
        this.image_height = this.num_y * this.cell_y;
    }
    else
    {
        this.cell_y = this.image_height / this.num_y;
    }
    
    // Colours, 128 bands shoudl be enough
    
    this.colours = [];
    
    if (this.mid_colour === null)
    {
        for (var i = 0 ; i < 129 ; ++i)
        {
            this.colours [i] = SVGColours.Blend (def.end_colour, def.start_colour, i / 128)
        }
    }
    else
    {
        for (var i = 0 ; i < 65 ; ++i)
        {
            this.colours [i] = SVGColours.Blend (def.end_colour, def.mid_colour, i / 64)
        }
        for (var i = 65 ; i < 129 ; ++i)
        {
            this.colours [i-65] = SVGColours.Blend (def.mid_colour, def.start_colour, (i-64) / 64)
        }
    }
}

Graphics.ValueGridDef.GetMax = function (data, col)
{
    var max = -Number.MAX_VALUE;
    
    for (var idx in data)
    {
        max = Math.max (max, data[idx][col]);
    }
    return max;
}
Graphics.ValueGridDef.GetMin = function (data, col)
{
    var min = Number.MAX_VALUE;
    
    for (var idx in data)
    {
        min = Math.min (min, data[idx][col]);
    }
    return min;
}

//--------------------------------------------------------------------------------------------
Graphics.DrawValueGrid = function (def, data, img)
{
    // def is a ValueGridDef
    // data is a set of [x,y,z] values.
    
    def.Fix (def, data);
    
    var chelp = new CanvasHelp (def.image_width, def.image_height);

    chelp.SetBackground (def.back_colour);
    chelp.FillRect (def.image_width, def.image_height);

    for (var idx in data)
    {
        var x = (data[idx][0] - def.x_min) * def.cell_x;
        var y = (data[idx][1] - def.y_min) * def.cell_y;
        var f = (data[idx][2] - def.z_min) / def.z_range;
        var c = Math.floor (f * 128)
        
        chelp.SetBackground (def.colours[c]);
        chelp.FillRect (x, y, def.cell_x, def.cell_y);
    }
    
    img.src = chelp.canvas.toDataURL('image/png');
}
//=======================================================================================================================
//=======================================================================================================================
Graphics.GraphDef = function ()
{
    this.background = "white";
    this.line_colours = ["blue", "green"];
    this.fill_colours = ["cyan", "midnightblue"];
    this.chart_type = Graphics.GraphDef.LINE;
    this.ymin = 0;
    this.ymax = 1;
    this.xmin = 0;
    this.xmax = 1;
    this.width = null;
    this.height = null;
    this.bar_width = 1;
    this.calc_ranges = false;
}
Graphics.GraphDef.LINE = 0;                 // Line (x,y)
Graphics.GraphDef.MULTI_LINES = 1;          // Lines (x, y1), (x,y2), etc.
Graphics.GraphDef.BAR = 2;                  // Bar (x, [0-y])
Graphics.GraphDef.RANGE = 3;                // Bar (x, [y1-y2]) - swap colour if inverted.
Graphics.GraphDef.SERIES_TREE = 4;          // Multiple series as a tree
Graphics.GraphDef.MULTI_SERIES = 5;         // Multiple series as lines
Graphics.GraphDef.BLANK = 6;                // Nothing
Graphics.GraphDef.SPOTS = 7;                // Spots, data = [x,y,colour]

Graphics.DrawGraph = function (data, img, styles)
{
    if (! styles) styles = new GraphStyles ();
    
    styles.Prepare (img);
    
    styles.chelp.SetBackground (styles.background);
    styles.chelp.FillRect (0, 0, styles.width, styles.height);
    
    if (styles.chart_type == Graphics.GraphDef.LINE)
    {
        styles.DrawSingleLineChart (data);
    }
    else if (styles.chart_type == Graphics.GraphDef.BAR)
    {
        styles.DrawBarChart (data);
    }
    else if (styles.chart_type == Graphics.GraphDef.SERIES_TREE)
    {
        styles.DrawSeriesTreeChart (data);
    }
    else if (styles.chart_type == Graphics.GraphDef.MULTI_SERIES)
    {
        styles.DrawMultiSeriesChart (data);
    }
    else if (styles.chart_type == Graphics.GraphDef.BLANK)
    {
        styles.DrawEmptyChart (data);
    }
    else if (styles.chart_type == Graphics.GraphDef.SPOTS)
    {
        styles.DrawSpots (data);
    }
    
    img.src = styles.chelp.canvas.toDataURL('image/png');
}

Graphics.GraphDef.prototype.Prepare = function (img)
{
    if (! this.width) this.width = img.width;
    if (! this.height) this.height = img.height;
    
    this.width = Math.max (this.width, 1);
    this.height = Math.max (this.height, 1);
    
    if (! this.calc_ranges)
    {
        this.range = this.ymax - this.ymin;
    
        if (this.range == 0)
        {
            this.range = 1;
            this.ymin -= 0.5;
            this.ymax += 0.5;
        }
    }
    
    this.chelp = new CanvasHelp (this.width, this.height);
    
    this.chelp.SetBackground (this.background);
    this.chelp.FillRect (0, 0, this.width, this.height);
}
// Empty window

Graphics.GraphDef.prototype.DrawEmptyChart = function (data)
{
}
// This takes the values from data and draws a line through all the points in data
// data should be an array of numbers

Graphics.GraphDef.prototype.DrawSingleLineChart = function (data)
{
    var points = [];
    var n = data.length - 1;
    
    for (var i = 0 ; i < data.length ; ++i)
    {
        var x = i * this.width / n;
        var y = this.height - (data [i] - this.ymin) * this.height / this.range;

        points [i] = [x,y];
    }
        
    this.chelp.SetForeground (this.line_colours[0]);
    this.chelp.DrawLines (points);
}
// This takes the values from data and draws a line through all the points in data
// data should be an array of numbers

Graphics.GraphDef.prototype.DrawMultiSeriesChart = function (data)
{
    this.xmin = 0;
    this.ymin = (this.log) ? 1 : 0;
    this.ymax = (this.log) ? 1 : 0;    

    var max_x = 0;
    var vals = [];
    var k = 0;
    
    for (var i in data)
    {
        var xlen = data [i].length;
        
        if (xlen > 0)
        {
            max_x = Math.max (max_x, data [i].length);
            vals [k] = [];
            
            if (this.normalise)
            {
                var y0 = data[i][0].ToFloat ();
                
                for (var j in data[i])
                {
                     var y = data[i][j] / y0;
                     vals[k].push ((this.log) ? Math.log10 (y) : y);                         
                }
            }
            else
            {
                for (var j in data[i])
                {
                     vals[k].push ((this.log) ?  data[i][j].Log10 (y) :  data[i][j].ToFloat ());                         
                }
            }
            this.ymax = vals[k].reduce((x,y) => x > y ? x : y, this.ymax);
            this.ymin = vals[k].reduce((x,y) => x > y ? y : x, this.ymin);
            ++k;
        }
    }
    
    this.xmax = max_x - 1;
    
    if (this.xmax < 1 || this.ymax <= this.ymin) return;    
    
    var yfact = this.height / (this.ymax - this.ymin);
    
    
    var yb = this.height - (((this.log) ? 0 : 5) - this.ymin) * yfact;
            
    
    this.chelp.SetBackground ("pink");
    this.chelp.FillRect (0, yb, this.width, this.height);
    
    for (var idx in vals)
    {
        var points = [];
        var series = vals [idx];
        
        for (var i = 0 ; i < series.length ; ++i)
        {
            var x = i * this.width / this.xmax;
            var y = this.height - (series[i] - this.ymin) * yfact;

            points [i] = [x,y];
        }
        
        this.chelp.SetForeground (this.line_colours[0]);    
        this.chelp.DrawLines (points);
    }
}
// This takes the values from data and draws a bar chart
// data should be an array of numbers

Graphics.GraphDef.prototype.DrawBarChart = function (data)
{
    var points = [];
    var n = data.length;
    var bar = this.width/n * this.bar_width;
    var y0 = this.height;
    var scale = this.height / (this.ymax - this.ymin);
    
    this.chelp.SetForeground (this.line_colours[0]);

    var ytop;
    var ybot;
    

    for (var i = 0 ; i < data.length ; ++i)
    {
        if (data [i] > 0)
        {
            ytop = data [i];
            ybot = 0;
            this.chelp.SetBackground (this.fill_colours[0]);
        }
        else
        {
            ytop = 0;
            ybot = data [i];
            this.chelp.SetBackground (this.fill_colours[1]);
        }
        
        var x = i * this.width / n;
        var h0 = (ytop - this.ymin) * scale;
        var h1 = (ybot - this.ymin) * scale;

        this.chelp.DrawFilledRect (x, y0-h0, bar, h0-h1);
    }
}
Graphics.GraphDef.SeriesTree = function ()
{
    this.nodes = {};
    this.vmax = VLUInt.FromInt (0);
}
// Series is a list of VLUInts, starting at the leaf and moving to the root
Graphics.GraphDef.SeriesTree.prototype.AddSeries = function (series)
{
    if (series.length == 0) return;

    var v1 = series [0];
    var v1key = v1.toString ();
    
    if (this.nodes.hasOwnProperty (v1key))
    {
        return;
    }

    if (VLUInt.Compare (v1, this.vmax) > 0) this.vmax = v1;
        
    this.nodes [v1key] = new Graphics.GraphDef.Node (v1);
    
    for (var idx = 1 ; idx < series.length ; ++ idx)
    {
        var v2 = series [idx];
        var v2key = v2.toString ();
        this.nodes [v1key].next = v2key;

        if (VLUInt.Compare (v2, this.vmax) > 0) this.vmax = v2;
        
        if (this.nodes.hasOwnProperty (v2key))
        {
            this.nodes [v2key].prev.push (this.nodes[v1key]);
            break;
        }
        else
        {
            this.nodes [v2key] = new Graphics.GraphDef.Node (v2);
            this.nodes [v2key].prev.push (this.nodes[v1key]);
        }
        
        v1key = v2key;
    }
}
// Root(s) is/are depth 0.
Graphics.GraphDef.SeriesTree.prototype.SetDepth = function ()
{   
    var keys = Object.keys (this.nodes);
    for (var kidx in keys)
    {
        var k = keys [kidx];
        if (this.nodes[k].next === null)
        {
            this.nodes[k].SetDepth (0);
        }
    }
}
// Root(s) is/are depth 0.
Graphics.GraphDef.SeriesTree.prototype.SetMaxDepth = function ()
{   
    this.max_depth = 0;
    var keys = Object.keys (this.nodes);
    for (var kidx in keys)
    {
        var k = keys [kidx];
        var depth = this.nodes[k].depth;
        if (depth > this.max_depth) this.max_depth = depth;
    }
}

Graphics.GraphDef.Node = function (val)
{
    this.val = val;
    this.prev = [];
    this.next = null;
    this.depth = -1;
}

Graphics.GraphDef.Node.prototype.SetDepth = function (d)
{
    this.depth = d;
    
    for (var idx in this.prev)
    {
        this.prev [idx].SetDepth (d+1);
    }
}

// Data contains a set of series, these are built into a tree. If series links into t aprevious series
// or looops back on itself it is truncated at that point

Graphics.GraphDef.prototype.DrawSeriesTreeChart = function (data)
{
    var tree = new Graphics.GraphDef.SeriesTree();
    var maxlen = 0;
    
    for (var s_idx in data)
    {
        var series = data [s_idx];
        
        tree.AddSeries (series);
    }
    
    tree.SetDepth ();
    tree.SetMaxDepth ();
    
    if (this.calc_ranges)
    {
        this.ymin = 0;
        this.ymax = (this.log) ? tree.vmax.Log10 () : tree.vmax.ToFloat ();
        this.xmin = 0;
        this.xmax = tree.max_depth;
    }    
    
    var y_factor = this.height / (this.ymax - this.ymin);
    var x_factor = this.width / (this.xmax - this.xmin);

    // Draw the graph
    
    this.chelp.SetBackground (this.background);
    this.chelp.FillRect (0, 0, this.width, this.height);
    this.chelp.SetForeground (this.line_colours[0]);
    
    var keys = Object.keys (tree.nodes);
    for (var kidx in keys)
    {
        var k = keys [kidx];
        var node = tree.nodes [k];
        if (tree.nodes[k].next != null)
        {
            var next = tree.nodes [node.next];
            var x0 = (this.xmax - node.depth) * x_factor;
            var x1 = x0 + x_factor;
            var v1 = (this.log) ? node.val.Log10 () : node.val.ToFloat ();
            var v2 = (this.log) ? next.val.Log10 () : next.val.ToFloat ();
            var y0 = (this.ymax - v1) * y_factor;
            var y1 = (this.ymax - v2) * y_factor;

            this.chelp.DrawLine ([x0,y0],[x1,y1]);            
        }
    }
}


// Data contains a set of spots (x, y, colour). Spot size is in the member variabel "spot_size")
// or looops back on itself it is truncated at that point

Graphics.GraphDef.prototype.DrawSpots = function (data)
{    
    var y_factor = this.height / (this.ymax - this.ymin);
    var x_factor = this.width / (this.xmax - this.xmin);

    // Draw the graph
    
    for (var idx in data)
    {
        var spot = data [idx];
        var x = (spot [0] - this.xmin) * x_factor;
        var y = (this.ymax - spot[1]) * y_factor;
        var cidx = spot [2] % this.fill_colours.length;
        var c = this.fill_colours[cidx];

        this.chelp.DrawFilledCircle (x, y, this.spot_size, c, c);
    }
}


