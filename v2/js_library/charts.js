//-------------------------------------------------------------------------------------------------
// Construct and draw charts
//
// Uses misc.js, canvas_helpers.js, colours.js, circular_buffer.js
//
// (c) John Whitehouse 2020
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

Chart = function ()
{
    this.background = "teal";
    this.axis = "lightcyan";
    this.grid = "cadetblue";
    this.line = "midnightblue";    
    this.text = "black";    
}

//-------------------------------------------------------------------------------------------------

Chart.OHCL = function ()
{
    this.count = 0;
}
Chart.OHCL.prototype.Add = function (x)
{
    if (this.count == 0)
    {
        this.open = x;
        this.high = x;
        this.low = x;
        this.close = x;
    }
    else
    {
        if (x > this.high) this.high = x;
        if (x < this.low) this.low = x;
        this.close = x;
    }
    ++this.count;
}
//-------------------------------------------------------------------------------------------------
// Collects data into bins, and maintains the open/hi/low/close
// n_bins: the number of bins
// per_bin: the number of samples per bin
//-------------------------------------------------------------------------------------------------
Chart.HiLoBins = function (n_bins, per_bin)
{
    this.buffer = new CircularBuffer (n_bins, null);
    this.bin = new Chart.OHCL ();
    this.per_bin = per_bin;
    this.bins = n_bins;
    this.changed = false;
}

// Inherit basic properties

Chart.HiLoBins.prototype = new Chart ();

//-------------------------------------------------------------------------------------------------
Chart.HiLoBins.prototype.Add = function (x)
{
    this.bin.Add (x);
    
    if (this.bin.count == this.per_bin)
    {
        this.buffer.Add (this.bin);
        this.bin = new Chart.OHCL ();
        this.changed = true;
    }
}
//-------------------------------------------------------------------------------------------------
Chart.HiLoBins.prototype.DrawHLBars = function (chelp, image_element)
{
    var labels = 12;
    var margin_top = 6 + labels / 2;
    var margin_bot = 6;
    var margin_left = 6 + labels;
    var margin_right = 6;


    var w = chelp.canvas.width - margin_left - margin_right;
    var h = chelp.canvas.height - margin_top - margin_bot;
    var x0 = margin_left;
    var y0 = margin_top + h;
    
    
    chelp.SetBackground (this.background);
    chelp.SetForeground (this.axis);
    chelp.SetLineWidth (1);

    chelp.DrawFilledRect (0, 0, chelp.canvas.width, chelp.canvas.height);   
    
    chelp.DrawLine ([x0, y0-h], [x0, y0]);
    chelp.DrawLine ([x0, y0], [x0 + w, y0]);    
    
    var ymin = null;
    var ymax = null;
    
    for (var i = 0 ; i < this.bins ; ++i)
    {
        var ohcl = this.buffer.buffer [i];
        
        if (ohcl != null && (ymin == null || ohcl.low < ymin)) ymin = ohcl.low;
        if (ohcl != null && (ymax == null || ohcl.high > ymax)) ymax = ohcl.high;
    }
    
    var yrange = ymax - ymin;
    
    if (yrange <= 0)
    {
        chelp.DrawLine ([x0, y0-h/2], [x0 + w, y0-h/2]); // horizontal line in middle
    }
    else
    {
        var pow = Math.log10 (yrange);
        var digits = Math.floor (1 - pow);
        var mult = Math.pow (10, digits);
        var delta = 1 / mult;
        var r0 = Math.floor (ymin * mult);
        var floor = r0 / mult;
        var ceil = Math.ceil (ymax * mult) / mult;
        var fy = h / (ceil - floor);
        var fx = w / this.bins;
        var t_props = new CanvasHelp.TextProperties ("12px Arial", this.text, "left", "bottom");
        
        r0 = r0 % 10;
        
        chelp.SetForeground (this.grid);

        for (var yval = floor + delta ; yval <= ceil ; yval += delta)
        {
            r0 = (r0 + 1) % 10;
            var y = y0 - (yval - floor) * fy;
            
            chelp.DrawTextAt (x0-labels, y+labels/2-1, r0, t_props);   
            chelp.DrawLine ([x0, y], [x0 + w, y]);    
        }
        
        chelp.SetForeground (this.line);
        
        for (var i = 0 ; i < this.bins ; ++i)
        {
            var ohlc = this.buffer.ItemAt (i);
            if (ohlc != null)
            {
                var y1 = y0 - (ohlc.low - floor) * fy;
                var y2 = y0 - (ohlc.high - floor) * fy;
                var x = x0 + i * fx;
                chelp.DrawLine ([x, y1], [x, y2]);
            }
        }
    
        chelp.DrawTextAt (x0+1, y0-1, floor.toFixed(digits), t_props);   
    }
    
    image_element.src = chelp.canvas.toDataURL('image/png');    
}
//-------------------------------------------------------------------------------------------------
Chart.HiLoBins.prototype.DrawHighLine = function (chelp, image_element)
{
    var labels = 12;
    var margin_top = 6 + labels / 2;
    var margin_bot = 6;
    var margin_left = 6 + labels;
    var margin_right = 6;


    var w = chelp.canvas.width - margin_left - margin_right;
    var h = chelp.canvas.height - margin_top - margin_bot;
    var x0 = margin_left;
    var y0 = margin_top + h;
    
    chelp.SetBackground (this.background);
    chelp.SetForeground (this.axis);
    chelp.SetLineWidth (1);

    chelp.DrawFilledRect (0, 0, chelp.canvas.width, chelp.canvas.height);   
    
    chelp.DrawLine ([x0, y0-h], [x0, y0]);
    chelp.DrawLine ([x0, y0], [x0 + w, y0]);    
    
    var ymin = null;
    var ymax = null;
    
    for (var i = 0 ; i < this.bins ; ++i)
    {
        var ohcl = this.buffer.buffer [i];
        
        if (ohcl != null && (ymin == null || ohcl.high < ymin)) ymin = ohcl.low;
        if (ohcl != null && (ymax == null || ohcl.high > ymax)) ymax = ohcl.high;
    }
    
    var yrange = ymax - ymin;
    
    if (yrange <= 0)
    {
        chelp.DrawLine ([x0, y0-h/2], [x0 + w, y0-h/2]); // horizontal line in middle
    }
    else
    {
        var pow = Math.log10 (yrange);
        var digits = Math.floor (1 - pow);
        var mult = Math.pow (10, digits);
        var delta = 1 / mult;
        var r0 = Math.floor (ymin * mult);
        var floor = r0 / mult;
        var ceil = Math.ceil (ymax * mult) / mult;
        var fy = h / (ceil - floor);
        var fx = w / this.bins;
        var t_props = new CanvasHelp.TextProperties ("12px Arial", this.text, "left", "bottom");
        
        r0 = r0 % 10;

        chelp.SetForeground (this.grid);
    
        for (var yval = floor + delta ; yval <= ceil ; yval += delta)
        {
            r0 = (r0 + 1) % 10;
            var y = y0 - (yval - floor) * fy;
            
            chelp.DrawTextAt (x0-labels, y+labels/2-1, r0, t_props);   
            chelp.DrawLine ([x0, y], [x0 + w, y]);    
        }
        
        var points = new Array ();
        
        chelp.SetForeground (this.line);
        
        for (var i = 0 ; i < this.bins ; ++i)
        {
            var ohlc = this.buffer.ItemAt (i);
            if (ohlc != null)
            {
                var y = y0 - (ohlc.high - floor) * fy;
                var x = x0 + i * fx;
                points.push ([x,y]);
            }
        }
    
        chelp.DrawLines (points);        
        chelp.DrawTextAt (x0+1, y0-1, floor.toFixed(digits), t_props);   
    }
    
    image_element.src = chelp.canvas.toDataURL('image/png');    
}
//-------------------------------------------------------------------------------------------------
Chart.HiLoBins.prototype.GetChanged = function ()
{
    var ret = this.changed;
    this.changed = false;
    return ret;
}
    