//-------------------------------------------------------------------------------------------------
// Javascript Membrane Simulator
// (c) John Whitehouse 2015
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

var HISTO_BAR = 7;
var HISTO_GAP = 1;
var HISTO_WIDTH = HISTO_BAR + HISTO_GAP;

//-------------------------------------------------------------------------------------------------
// Initialise the simulation
// num_points - the width of the simulation
//-------------------------------------------------------------------------------------------------
function ZigZagSimulator (num_points, p_left)
{
    // Check the parameters are viable

    if (num_points < 4 || p_left < 0 || p_left > 1)
    {
        throw "Invalid parameter";
    }
    if (num_points % 2 != 0)
    {
        ++ num_points;
    }

    this.num_points = num_points;
    this.points = new Array (num_points);
    this.heights = new Array (num_points);
    this.height_counts = {};
    this.wall_pos = 5;

    // we start with a horizontal membrane indicated by a string of 0's and 1s'

    for (var i = 0 ; i < num_points ; ++i)
    {
        this.points [i] = ((i % 2) == 0) ? 0 : 1;
        this.heights [i] = ((i % 2) == 0) ? 1 : 0;
    }
    this.height_counts [0] = num_points / 2;
    this.height_counts [1] = num_points / 2;

    this.p_left = 0.6;
    this.p_right = 1 - this.p_left;
    this.min_y = 0;
    this.max_y = 1;
    this.sum_y = num_points / 2;
    this.sum_y2 = num_points / 2;
}
//-------------------------------------------------------------------------------------------------
// Constants
//-------------------------------------------------------------------------------------------------
ZigZagSimulator.MinHeight = 10;
//-------------------------------------------------------------------------------------------------
// Run the simulation for a number of steps
//-------------------------------------------------------------------------------------------------
ZigZagSimulator.prototype.DoIterations = function (num)
{
    var count = 0;

    for (var i = 0 ; i < num ; ++i)
    {
        var pos = Math.floor (Math.random () * this.num_points);
        var p2 = (pos + 1) % this.num_points;
        var type = 2 * this.points [pos] + this.points [p2];

        // 01 = 1, 10 = 2

        switch (type)
        {
            case 1:

                if (Math.random () <= this.p_left)
                {
                    var old_y = this.heights [p2];
                    var new_y = this.heights [p2] + 2;

                    if (new_y <= this.wall_pos)
                    {
                        this.heights [p2] = new_y;

                        this.points [pos] = 1;
                        this.points [p2] = 0;
                        this.UpdateCounts (this.heights [p2], old_y);

                        ++ count;
                    }
                }
                break;

            case 2:

                if (Math.random () <= this.p_right)
                {
                    var old_y = this.heights [p2];
                    this.heights [p2] -= 2;

                    this.points [pos] = 0;
                    this.points [p2] = 1;
                    this.UpdateCounts (this.heights [p2], old_y);

                    ++ count;
                }
                break;
        }
    }
    return count;
}
//-------------------------------------------------------------------------------------------------
// Draw something
//-------------------------------------------------------------------------------------------------
ZigZagSimulator.prototype.Draw = function (picture, histogram)
{
    this.UpdateAverages ();

    picture.innerHTML = this.MembraneToSVG ();
    histogram.innerHTML = this.HistogramToSVG ();
}
//-------------------------------------------------------------------------------------------------
// The range of values will be contiguous, ie., there will be no '0's mid range
//-------------------------------------------------------------------------------------------------
ZigZagSimulator.prototype.UpdateCounts = function (add, remove)
{
    // New value

    if (add > this.max_y)
    {
        this.max_y = add;
        this.height_counts [add] = 1;
    }
    else if (add < this.min_y)
    {
        this.min_y = add;
        this.height_counts [add] = 1;
    }
    else
    {
        ++ this.height_counts [add];
    }

    // Old value

    if ((-- this.height_counts [remove]) == 0)
    {
        if (remove == this.min_y)
        {
            ++ this.min_y;
            delete this.height_counts [remove];
        }
        else if (remove == this.max_y)
        {
            -- this.max_y;
            delete this.height_counts [remove];
        }
    }

    // Sum and Sum of squares

    this.sum_y += add - remove;
    this.sum_y2 += add * add - remove * remove;
}
//-------------------------------------------------------------------------------------------------
// Set the probability of moving left. Doesn't require restarting the simulationƒ
//-------------------------------------------------------------------------------------------------
ZigZagSimulator.prototype.SetLeftProbability = function (p_left)
{
    if (p_left < 0 || p_left > 1)
    {
        return false;
    }
    this.p_left = p_left;
    this.p_right = 1 - p_left;
    return true;
}
//-------------------------------------------------------------------------------------------------
ZigZagSimulator.prototype.UpdateAverages = function ()
{
    this.avg_y = this.sum_y / this.num_points;
    this.avg_y2 = this.sum_y2 / this.num_points;
    this.sd = Math.sqrt (this.avg_y2 - this.avg_y * this.avg_y);
}
//-------------------------------------------------------------------------------------------------
// Convert to SVG, we fit the whole pattern into a 640 x 256 image
//-------------------------------------------------------------------------------------------------
ZigZagSimulator.prototype.MembraneToSVG = function ()
{
    var ymin = this.min_y - 1;
    var ymax = this.wall_pos + 2;
    var height = Math.max (ymax - ymin, ZigZagSimulator.MinHeight);

    // Physical size

    var svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"640\" height=\"256\"";

    // Data range: x y width height

    svg += "viewBox=\"0," + ymin + "," + this.num_points + "," + (ymax-ymin) + "\" preserveAspectRatio=\"none\">";
    svg += ZigZagSimulator.RectToSVG (0, ymin, this.num_points, (ymax-ymin), "none", "black");

    // the lines

    svg += "<polyline stroke=\"black\" fill=\"none\" stroke-width=\"1\" vector-effect=\"non-scaling-stroke\" points=\"";
    svg += "0," + this.heights [0];

    for (var i = 1 ; i < this.num_points ; ++i)
    {
        svg += "," + i + "," + this.heights [i];
    }
    svg += "\"/>";

    svg += ZigZagSimulator.LineToSVG (0, this.avg_y, this.num_points, this.avg_y, "red");

    var r1 = this.avg_y + this.sd;
    var r2 = this.avg_y - this.sd;

    svg += ZigZagSimulator.DashedLineToSVG (0, r1, this.num_points, r1, "red");
    svg += ZigZagSimulator.DashedLineToSVG (0, r2, this.num_points, r2, "red");
    svg += ZigZagSimulator.RectToSVG (0, this.wall_pos, this.num_points, this.wall_pos + 3, "green", "black");

    svg += "</svg>";
    return svg;
}
//-------------------------------------------------------------------------------------------------
// Draw thge histogram using SVG
//-------------------------------------------------------------------------------------------------
ZigZagSimulator.prototype.HistogramToSVG = function ()
{
    // Physical size

    var svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"128\" height=\"256\"";

    // Data range: x y width height

    var height = 0;

    for (var i = this.min_y ; i <= this.max_y ; ++i)
    {
        height = Math.max (height, this.height_counts [i]);
    }

    var w = (this.max_y - this.min_y + 1) * HISTO_WIDTH;
    var h = height;

    svg += "viewBox=\"0,0," + w + "," + h + "\" preserveAspectRatio=\"none\">";
    svg += ZigZagSimulator.RectToSVG (0, 0, w, h, "none", "black");

    for (var i = this.min_y ; i <= this.max_y ; ++i)
    {
        var xpos = (i - this.min_y) * HISTO_WIDTH;
        var ypos = height - this.height_counts [i];

        svg += ZigZagSimulator.RectToSVG (xpos, ypos, HISTO_BAR, this.height_counts [i], "cyan", "black");
    }

    var r0 = (this.avg_y - this.min_y + 0.5) * HISTO_WIDTH;
    var r1 = (this.avg_y + this.sd - this.min_y + 0.5) * HISTO_WIDTH;
    var r2 = (this.avg_y - this.sd - this.min_y + 0.5) * HISTO_WIDTH;

    svg += ZigZagSimulator.LineToSVG (r0, 0, r0, height, "red");
    svg += ZigZagSimulator.DashedLineToSVG (r1, 0, r1, height, "red");
    svg += ZigZagSimulator.DashedLineToSVG (r2, 0, r2, height, "red");

    svg += "</svg>";
    return svg;
}
//-------------------------------------------------------------------------------------------------
// Draw thge histogram using SVG
//-------------------------------------------------------------------------------------------------
ZigZagSimulator.RectToSVG = function (x, y, w, h, fill, stroke)
{
    var svg = "<rect stroke-width=\"1\" vector-effect=\"non-scaling-stroke\"";

    svg += " fill=\"" + fill + "\"";
    svg += " stroke=\"" + stroke + "\"" ;
    svg += " x=\"" + x + "\"" ;
    svg += " y=\"" + y + "\"" ;
    svg += " width=\"" + w + "\"" ;
    svg += " height=\"" + h + "\"" ;
    svg += "/>";

    return svg;
}
//-------------------------------------------------------------------------------------------------
// SVG text to draw a line
//-------------------------------------------------------------------------------------------------
ZigZagSimulator.LineToSVG = function (x1, y1, x2, y2, stroke)
{
    var svg = "<line ";
    svg += " x1=\"" + x1 + "\"";
    svg += " y1=\"" + y1 + "\"";
    svg += " x2=\"" + x2 + "\"";
    svg += " y2=\"" + y2 + "\"";
    svg += " stroke=\"" + stroke + "\" stroke-width=\"1\" vector-effect=\"non-scaling-stroke\"";
    svg += "/>\n";

    return svg;
}

//-------------------------------------------------------------------------------------------------
// SVG text to draw a line
//-------------------------------------------------------------------------------------------------
ZigZagSimulator.DashedLineToSVG = function (x1, y1, x2, y2, stroke)
{
    var svg = "<line ";
    svg += " x1=\"" + x1 + "\"";
    svg += " y1=\"" + y1 + "\"";
    svg += " x2=\"" + x2 + "\"";
    svg += " y2=\"" + y2 + "\"";
    svg += " stroke=\"" + stroke + "\" stroke-width=\"1\" stroke-dasharray=\"5,5\" vector-effect=\"non-scaling-stroke\"";
    svg += "/>\n";

    return svg;
}
