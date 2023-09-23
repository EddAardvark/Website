//-------------------------------------------------------------------------------------------------
// Graphs showing related A-lists
// (c) John Whitehouse 2019
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------
AListsGraph = function ()
{
    this.colour_mode = 0;           // 0 = none, 1-num_loops = loop, num_loops+1 = end-points
    this.mode = AListsGraph.List;
    this.loop_mode = AListsGraph.LoopModeLinesBySeed;
}

// Variables used when drawing a-list graphs

AListsGraph.box_height = 24;
AListsGraph.x_margin = 8;
AListsGraph.y_margin = 24;
AListsGraph.x_padding = 4;
AListsGraph.y_padding = 6;
AListsGraph.ccl_r2 = 4;

// Display modes
AListsGraph.Minimal = 0;
AListsGraph.List = 1;
AListsGraph.Value = 2;
AListsGraph.Smin = 3;
AListsGraph.Smax = 4;
AListsGraph.SoverK = 5;
AListsGraph.MaxoverMin = 6;
AListsGraph.MinoverK = 7;
AListsGraph.LoopIndex = 8;
AListsGraph.HCF = 9;

// Colour modes

AListsGraph.ColourModeNone = 0;
AListsGraph.ColourModeMinMax = 1;
AListsGraph.ColourModeHcf = 2;
AListsGraph.ColourModeLevelOne = 3;

// Loop drawing modes

AListsGraph.LoopModeCircle = 0;
AListsGraph.LoopModeLines = 1;
AListsGraph.LoopModeLinesBySeed = 2;
AListsGraph.LoopModeLinesByMax = 3;
AListsGraph.LoopModeLinesByRange = 4;
            
//-------------------------------------------------------------
AListsGraph.prototype.Initialise = function (n, m, img_element)
{
    if (m < n || n < 1)
    {
        Misc.Alert ("Please enter n > 1 and m >= n")
        return;
    }
    
    this.img_element = img_element;
    this.n = n;
    this.m = m;
    this.k = T3A1.GetK (m, n);
    this.img_element.innerHTML = "none";
    
    this.CreateGraph (m, n, 10000)
    this.FindLoops ();
    this.GetRowLengths();  
}

// Returns a graph containing all the A-lists with n members where the sum of the elements is m.
// Works recurively by choosing the first element and then constructing all the lists with the
// remainder. 
// Also creates a dictionarly of found lists indexed by their keys

AListsGraph.prototype.CreateGraph = function (m, n, limit)
{
    if (m < n) throw "CreateGraph: invalid parameters";
    
    var list = [];
    
    for (var i = 0 ; i < n-1 ; ++i)
    {
        list [i] = 1;
    }
    list [n-1] = m - n + 1;
    
    this.root = AList.FromList (list);
    this.lists = {};
    
    this.root.row = 0;
    this.root.next = [];
    
    this.num_rows = 0;
    this.num_lists = 0;
    
    this.ExpandGraph (this.root);
}
// Called recursively from CreateGraph
AListsGraph.prototype.ExpandGraph = function (alist)
{
    var key = alist.Key();
    
    if (this.lists.hasOwnProperty (key))
    {
        return;
    }
    
    for (var i = 1 ; i < alist.list.length ; ++i)
    {
        var next = alist.MoveBeadLeft (i);
        
        if (next != null)
        {
            if (this.lists[next.Key ()])
            {
                next = this.lists[next.Key ()];
            }
            else
            {
                next.row = alist.row + 1;
                next.next = [];
            }
            alist.next.push (next);
        }
    }
        
    this.lists [alist.Key ()] = alist;
    this.num_lists
    this.num_rows = Math.max (alist.row + 1, this.num_rows);
    
    for (var i in alist.next)
    {
        this.ExpandGraph (alist.next [i]);
    }
}

// Assigns a loop index to all the lists found by CreateGraph (added as a property to the individual lists)

AListsGraph.prototype.FindLoops = function ()
{
    var visited = [];
    var index = 0;

    for (var key in this.lists)
    {
        if (visited.indexOf (key) < 0)
        {
            visited.push (key);
            
            list = this.lists[key];
            list.index = index;
            
            var len = list.list.length;

            for (var j = 0 ; j < len-1 ; ++j)
            {
                list = list.GetRotation ();
                var key = list.Key ();
                
                this.lists [key].index = index;

                visited.push (key);
            }
            ++index;
        }
    }
    this.num_loops = index;
    
    this.loops = [];
    
    for (var i = 0 ; i < this.num_loops ; ++i)
    {
        this.loops [i] = null;
    }
    
    for (var key in this.lists)
    {
        if (! this.loops [this.lists[key].index])
        {
            var loop = {};
            
            loop.seed = this.lists[key].Smin();
            loop.smax = this.lists[key].Smax();
            loop.alist = this.lists[key];
            
            this.loops [this.lists[key].index] = loop;
        }
        else
        {
            var loop = this.loops [this.lists[key].index];
            
            if (this.lists[key].Smin() < loop.seed)
            {
                loop.seed = this.lists[key].Smin();
                loop.alist = this.lists[key];
            }
            loop.smax = Math.max (this.lists[key].Smax(), loop.smax);
        }
    }
}


// Assigns a loop index to all the lists found by CreateGraph (added as a property to the individual lists)

AListsGraph.prototype.GetRowLengths = function ()
{
    this.row_lengths = [];
    
    for (var i = 0 ; i < this.num_rows ; ++i)
    {
        this.row_lengths [i] = 0;
    }

    for (var key in this.lists)
    {
        var list = this.lists[key];
        
        list.row_pos = this.row_lengths [list.row];
        ++ this.row_lengths [list.row] ;
    }
    this.max_row_length = Math.max (...this.row_lengths);
}
//-------------------------------------------------------------
AListsGraph.prototype.DrawDAG = function ()
{
    this.DrawDAGWithMode (this.mode);
}
//-------------------------------------------------------------
AListsGraph.prototype.DrawDAGWithMode = function (mode)
{
    this.mode = mode;
    var svg = this.GetDAGSVG (1153);
    this.img_element.innerHTML = svg;
}
//-------------------------------------------------------------
AListsGraph.prototype.GetMaxDAGTextLength = function ()
{
    // Find the longest string in the diagram

    var max_len = 0;
    
    for (var key in this.lists)
    {
        var list = this.lists[key];
        var text = this.GetListText (list, this.mode);
        
        max_len = Math.max (max_len, text.length);
    }    
    
    return max_len;
}
//-------------------------------------------------------------
AListsGraph.prototype.GetDAGSVG = function (max_width)
{
    // Draw the A-list tree
    
    var num_rows = this.row_lengths.length;
    var box_width = (this.mode == AListsGraph.Minimal) ? 36 : (8 * (1 + this.GetMaxDAGTextLength()));
    var width = this.max_row_length * box_width + (this.max_row_length - 1) * AListsGraph.x_margin;
    var height = num_rows * AListsGraph.box_height + (num_rows - 1) * AListsGraph.y_margin;
    var vw = width;
    var vh = height;
    
    if (vw > max_width)
    {
        if (vw > 4 * max_width)
        {
            return "Table too large";
        }
        vh *= (max_width / vw);
        vw = max_width;
    }    

    var svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\"";

    svg += " width=\"" + vw + "\" height=\"" + vh + "\"";
    svg += " viewBox=\"" + 0 + "," + 0 + "," + width + "," + height + "\">";

    // Draw the lines first, then put the boxes on top
    
    for (var key in this.lists)
    {
        var list = this.lists[key];
        var row = list.row;
        var col = list.row_pos;
        var offset = (this.max_row_length - this.row_lengths[row]) * (box_width + AListsGraph.x_margin) / 2;
        var x0 = offset + col * (box_width + AListsGraph.x_margin) + box_width / 2;
        var y0 = row * (AListsGraph.box_height + AListsGraph.y_margin) + AListsGraph.box_height / 2 ;
        
        for (var k2 = 0 ; k2 < list.next.length ; ++k2)
        {
            var other = list.next[k2];
            var r2 = other.row;
            var c2 = other.row_pos;
            var o2 = (this.max_row_length - this.row_lengths[r2]) * (box_width + AListsGraph.x_margin) / 2;
            var x1 = o2 + c2 * (box_width + AListsGraph.x_margin) + box_width / 2;
            var y1 = r2 * (AListsGraph.box_height + AListsGraph.y_margin) + AListsGraph.box_height / 2 ;            
            
            svg += SVGHelp.Line ([x0,y0], [x1,y1], "blue");
        }
    }
    
    // Now the boxes on top

    for (var key in this.lists)
    {
        var list = this.lists[key];
        var row = list.row;
        var col = list.row_pos;
        
        var offset = (this.max_row_length - this.row_lengths[row]) * (box_width + AListsGraph.x_margin) / 2;
        
        if (this.mode == AListsGraph.Minimal)
        {        
            var x0 = offset + col * (box_width + AListsGraph.x_margin) + box_width / 2;
            var y0 = row * (AListsGraph.box_height + AListsGraph.y_margin) + AListsGraph.box_height / 2 ;

            svg += SVGHelp.Circle (x0, y0, 12, this.GetDAGListColour(list), "black");
        }
        else
        {
            var x = offset + col * (box_width + AListsGraph.x_margin);
            var y = row * (AListsGraph.box_height + AListsGraph.y_margin);        
            var tx = x + AListsGraph.x_padding;
            var ty = y + AListsGraph.box_height - AListsGraph.y_padding;

            svg += SVGHelp.Rect (x, y, box_width, AListsGraph.box_height, this.GetDAGListColour(list), "black");
            svg += "<text class=\"svgtext\" x=\"" + tx+ "\" y=\"" + ty + "\">";
            svg += this.GetListText (list, this.mode);
            svg += "</text>";
        }
    }
    svg += "</svg>";
    return svg;
}
//-------------------------------------------------------------
AListsGraph.prototype.AdvanceDAGColourMode = function (delta)
{
    this.colour_mode += delta;

    if (this.colour_mode < AListsGraph.ColourModeNone)
    {
        this.colour_mode = AListsGraph.ColourModeLevelOne + this.num_loops - 1;
    }
    else if (this.colour_mode >= AListsGraph.ColourModeLevelOne + this.num_loops)
    {
        this.colour_mode = AListsGraph.ColourModeNone;
    }
    
    this.ShowColourText ();
    this.DrawDAG();
}
AListsGraph.prototype.ShowColourText = function ()
{
    if (this.colour_mode == AListsGraph.ColourModeNone)
    {
        alist3_mode.innerHTML = "No colour";
    }
    else if (this.colour_mode == AListsGraph.ColourModeMinMax)
    {
        alist3_mode.innerHTML = "Min and Max values";
    }
    else if (this.colour_mode == AListsGraph.ColourModeHcf)
    {
        alist3_mode.innerHTML = "HCF > 1";
    }   
    else 
    {
        alist3_mode.innerHTML = "Loop " + (this.colour_mode - AListsGraph.ColourModeLevelOne + 1);
    }
}
//-------------------------------------------------------------
AListsGraph.prototype.GetDAGListColour = function (alist)
{
    if (this.colour_mode == AListsGraph.ColourModeNone) return "white";

    if (this.colour_mode == AListsGraph.ColourModeMinMax)        // Seeds in green, max values in red
    {
        var s = alist.Value();
        
        if (s == alist.Smin()) return "lightgreen";
        if (s == alist.Smax()) return "deeppink";
        return "white";
    }
    
    if (this.colour_mode == AListsGraph.ColourModeHcf)
    {
        var hcf = Primes.hcf (alist.Smin (), this.k);
        
        return (hcf > 1) ? "fuchsia" : "white";
    }        

    if (this.colour_mode >= AListsGraph.ColourModeLevelOne)
    {
        var loop = this.colour_mode - AListsGraph.ColourModeLevelOne;
        
        if (loop >= this.num_loops)
        {
            loop = this.num_loops - 1;
            this.colour_mode = AListsGraph.ColourModeLevelOne + loop;
            this.ShowColourText ();
        }
            
        return (alist.index == loop) ? "cyan" : "white";
    }
    return "yellow"; // error
}
//-------------------------------------------------------------
AListsGraph.prototype.DrawLoops = function (element)
{
    element.innerHTML = this.GetLoopsSVG (1152);
}
//-------------------------------------------------------------
AListsGraph.prototype.GetLoopsSVG = function (size)
{
    if (this.loop_mode == AListsGraph.LoopModeCircle)
    {
        return graph.GetCircleSVG (size);
    }
    if (this.loop_mode == AListsGraph.LoopModeLines
        || this.loop_mode == AListsGraph.LoopModeLinesBySeed
        || this.loop_mode == AListsGraph.LoopModeLinesByMax
        || this.loop_mode == AListsGraph.LoopModeLinesByRange)
    {
        return graph.GetListsAsBars (size);
    }
}
//-------------------------------------------------------------
AListsGraph.prototype.GetCircleSVG = function (size)
{
    // Draw the A-list tree

    var radius = size / 2 - (AListsGraph.ccl_r2 + 1);
    var width = size;
    var height = size;
    var max_val = 0;
    var xc = width / 2;
    var yc = height / 2;

    // loops contains a map, alist_key -> [loop, list, value]
    // loop_limits[i][0] is the loop seed, this.loop_limits[i][1] is the max value

    for (var idx in this.loops)
    {
        if (this.loops[idx].smax > max_val)
        {
            max_val = this.loops[idx].smax;
        }
    }

    var svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\"";

    svg += " width=\"" + width + "\" height=\"" + height + "\"";
    svg += " viewBox=\"" + 0 + "," + 0 + "," + width + "," + height + "\">";

    // Outer circle

    svg += SVGHelp.Circle (xc, yc, radius, "none", "black");

    // Loops

    var angle_factor = 2 * Math.PI / max_val;
    var spots = [];

    for (var idx in this.loops)
    {
        var s1 = this.loops [idx].seed;
        
        while (true)
        {
            var s2 = 3 * s1 + this.k;

            while (s2 % 2 == 0) s2 /= 2;

            var theta1 = s1 * angle_factor;
            var theta2 = s2 * angle_factor;
            var x1 = xc + Math.sin (theta1) * radius;
            var y1 = yc - Math.cos (theta1) * radius;
            var x2 = xc + Math.sin (theta2) * radius;
            var y2 = yc - Math.cos (theta2) * radius;
            svg += SVGHelp.Line ([x1,y1], [x2,y2], "blue");

            var c = "white";

            if (s1 == this.loops [idx].seed)
            {
                c = "cyan";
            }
            else if (s1 == this.loops [idx].smax)
            {
                c = "deeppink";
            }

            spots.push ([x1, y1, c]);
            
            if (s2 == this.loops [idx].seed) break;
            s1 = s2;            
        }
    }

    // Spots

    for (var idx in spots)
    {
        var spot = spots[idx];
        svg += SVGHelp.Circle (spot[0], spot[1], AListsGraph.ccl_r2, spot[2], "black");
    }
    svg += "</svg>";
    return svg;
}
//-------------------------------------------------------------
AListsGraph.prototype.GetListsAsBars = function (size)
{
    // Draw the A-lists as bars

    var spacing = 2 * AListsGraph.ccl_r2;
    var width = spacing * (this.loops.length + 1) ;
    var height = 512;
    var max_val = 0;

    // loops contains a map, alist_key -> [loop, list, value]
    // loop_limits[i][0] is the loop seed, this.loop_limits[i][1] is the max value

    for (var idx in this.loops)
    {
        if (this.loops[idx].smax > max_val)
        {
            max_val = this.loops[idx].smax;
        }
    }
    
    if (width > size)
    {
        spacing = size / this.loops.length;
        width = size;
    }

    var loops = [].concat (this.loops);

    if (this.loop_mode == AListsGraph.LoopModeLinesBySeed)
    {
        loops.sort ((a,b) => (a.seed < b.seed) ? -1 : (a.seed > b.seed) ? 1 : 0) // smallest first
    }
    else if (this.loop_mode == AListsGraph.LoopModeLinesByMax)
    {
        loops.sort ((a,b) => (a.smax > b.smax) ? -1 : (a.smax < b.smax) ? 1 : 0) // biggest first
    }
    else if (this.loop_mode == AListsGraph.LoopModeLinesByRange)
    {
        loops.sort ((a,b) => (a.smax - a.seed > b.smax - b.seed) ? -1 : (a.smax - a.seed < b.smax - b.seed) ? 1 : 0) // largest first
    }

    var svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\"";

    svg += " width=\"" + width + "\" height=\"" + height + "\"";
    svg += " viewBox=\"" + 0 + "," + 0 + "," + width + "," + height + "\">";

    // Outer box

    svg += SVGHelp.Rect (0, 0, width, height, "SandyBrown", "black");

    // Loops

    var yfactor = (height - 2 * AListsGraph.ccl_r2) /  max_val;

    for (var idx = 0 ; idx < loops.length ; ++idx)
    {
        var x = (idx + 1) * spacing;
        var y1 = height - loops[idx].seed * yfactor;
        var y2 = height - loops[idx].smax * yfactor;

        svg += SVGHelp.Line ([x,y1], [x,y2], "black");
    }
    

    for (var idx = 0 ; idx < loops.length ; ++idx)
    {
        var x = (idx + 1) * spacing;
        var s1 = loops [idx].seed;
        
        while (true)
        {
            var y = height - s1 * yfactor;

            var c = "white";

            if (s1 == loops [idx].seed)
            {
                c = "cyan";
            }
            else if (s1 == loops [idx].smax)
            {
                c = "deeppink";
            }

            svg += SVGHelp.Circle (x, y, AListsGraph.ccl_r2, c, "black");
            
            s1 = 3 * s1 + this.k;

            while (s1 % 2 == 0) s1 /= 2;

            if (s1 == loops [idx].seed)
            {
                break;
            }
        }
    }

    svg += "</svg>";
    return svg;
}
    
    
AListsGraph.prototype.GetListText = function (alist, mode)
{
    if (mode == AListsGraph.Minimal)
    {
        return "";
    }
    
    if (mode == AListsGraph.List)
    {
        return alist.toString ();
    }
    
    if (mode == AListsGraph.Value)
    {
        return alist.Value().toString ();
    }
    
    if (mode == AListsGraph.Smin)
    {
        return alist.Smin().toString ();
    }
    
    if (mode == AListsGraph.Smax)
    {
        return alist.Smax().toString ();
    }
    
    if (mode == AListsGraph.SoverK)
    {
        return Misc.FloatToText (alist.Value() / this.k, 2);
    }
    
    if (mode == AListsGraph.MaxoverMin)
    {
        return Misc.FloatToText (alist.Smax() / alist.Smin(), 2);
    }
    
    if (mode == AListsGraph.MinoverK)
    {
        return Misc.FloatToText (alist.Smin() / this.k, 2);
    }    
    
    if (mode == AListsGraph.LoopIndex)
    {
        if (alist.index === undefined) return "UD";
        return alist.index.toString ();
    }
    
    if (mode == AListsGraph.HCF)
    {
        var hcf = Primes.hcf (alist.Smin (), this.k);
        return hcf.toString ();
    }
    
    return "?";
}
    
    
    
    