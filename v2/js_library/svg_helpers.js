//-------------------------------------------------------------------------------------------------
// Functions to create SVG elements
//
// (c) John Whitehouse 2015-19
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

function SVGHelp () {}

//-------------------------------------------------------------------------------------------------
// Helper for text formating
//-------------------------------------------------------------------------------------------------
SVGHelp.MakeParameter = function (name, value)
{
    var ret = " ";
    ret += name;
    ret += "=\"" + value + "\"";

    return ret;
}
//-------------------------------------------------------------------------------------------------
// points is an array of pairs, [x,y]: [[x0,y0],[x1,y1]...]
//-------------------------------------------------------------------------------------------------
SVGHelp.PointsToText = function (points)
{
    var text = points [0][0] + "," + points [0][1];

    for (i = 1 ; i < points.length ; i++)
    {
        text += " ";
        text += points [i][0] + "," + points [i][1];
    }

    return text;
}
//-------------------------------------------------------------------------------------------------
// The starting text
//-------------------------------------------------------------------------------------------------
SVGHelp.Start = function (width, height, x0, y0, x1, y1)
{
    var ret = "<svg";

    ret += SVGHelp.MakeParameter ("xmlns", "http://www.w3.org/2000/svg");
    ret += SVGHelp.MakeParameter ("version", "1.1");
    ret += SVGHelp.MakeParameter ("width", width);
    ret += SVGHelp.MakeParameter ("height", height);

    // Data range: x y width height

    ret += SVGHelp.MakeParameter ("viewbox", [x0, y0, (x1-x0), (y1-y0)]);
    ret += SVGHelp.MakeParameter ("preserveAspectRatio", "none");

    return ret + ">";
}
//-------------------------------------------------------------------------------------------------
// The end text
//-------------------------------------------------------------------------------------------------
SVGHelp.End = function ()
{
    return "</svg>";
}
//-------------------------------------------------------------------------------------------------
// SVG text to draw a circle
//-------------------------------------------------------------------------------------------------
SVGHelp.Circle = function (cx, cy, r, fill, stroke)
{
    var svg = "<circle";

    svg += SVGHelp.MakeParameter ("cx", cx);
    svg += SVGHelp.MakeParameter ("cy", cy);
    svg += SVGHelp.MakeParameter ("r", r);

    svg += SVGHelp.MakeParameter ("fill", fill);
    svg += SVGHelp.MakeParameter ("stroke", stroke);
    svg += SVGHelp.MakeParameter ("stroke-width", 1);
    svg += SVGHelp.MakeParameter ("vector-effect", "non-scaling-stroke");

    return svg + "/>";
}
//-------------------------------------------------------------------------------------------------
// SVG text to draw a line
//-------------------------------------------------------------------------------------------------
SVGHelp.Line = function (p1, p2, stroke)
{
    var svg = "<line";

    svg += SVGHelp.MakeParameter ("x1", p1[0]);
    svg += SVGHelp.MakeParameter ("y1", p1[1]);
    svg += SVGHelp.MakeParameter ("x2", p2[0]);
    svg += SVGHelp.MakeParameter ("y2", p2[1]);

    svg += SVGHelp.MakeParameter ("stroke", stroke);
    svg += SVGHelp.MakeParameter ("stroke-width", 1);
    svg += SVGHelp.MakeParameter ("vector-effect", "non-scaling-stroke");

    return svg + "/>";
}
//-------------------------------------------------------------------------------------------------
// SVG text to draw a dashed line
//-------------------------------------------------------------------------------------------------
SVGHelp.DashedLine = function (p1, p2, stroke, dash)
{
    var svg = "<line ";

    svg += SVGHelp.MakeParameter ("x1", p1[0]);
    svg += SVGHelp.MakeParameter ("y1", p1[1]);
    svg += SVGHelp.MakeParameter ("x2", p2[0]);
    svg += SVGHelp.MakeParameter ("y2", p2[1]);

    svg += SVGHelp.MakeParameter ("stroke", stroke);
    svg += SVGHelp.MakeParameter ("stroke-width", 1);
    svg += SVGHelp.MakeParameter ("vector-effect", "non-scaling-stroke");
    svg += SVGHelp.MakeParameter ("stroke-dasharray", dash);

    return svg + "/>";
}
//-------------------------------------------------------------------------------------------------
// Draw a rectangle
//-------------------------------------------------------------------------------------------------
SVGHelp.Rect = function (x, y, w, h, fill, stroke)
{
    var svg = "<rect";

    svg += SVGHelp.MakeParameter ("fill", fill);
    svg += SVGHelp.MakeParameter ("stroke", stroke);
    svg += SVGHelp.MakeParameter ("stroke-width", 1);
    svg += SVGHelp.MakeParameter ("vector-effect", "non-scaling-stroke");

    svg += SVGHelp.MakeParameter ("x", x);
    svg += SVGHelp.MakeParameter ("y", y);
    svg += SVGHelp.MakeParameter ("width", w);
    svg += SVGHelp.MakeParameter ("height", h);

    return svg + "/>";
}
//-------------------------------------------------------------------------------------------------
// SVG text to draw a polygon
//-------------------------------------------------------------------------------------------------
SVGHelp.Polygon = function (points, fill, stroke)
{
    var svg = "<polygon";

    svg += SVGHelp.MakeParameter ("points", SVGHelp.PointsToText (points));

    svg += SVGHelp.MakeParameter ("fill", fill);
    svg += SVGHelp.MakeParameter ("stroke", stroke);
    svg += SVGHelp.MakeParameter ("stroke-width", 1);
    svg += SVGHelp.MakeParameter ("vector-effect", "non-scaling-stroke");

    return svg + "/>";
}
//-------------------------------------------------------------------------------------------------
// SVG text to draw a graph (x co-ords are xstart to xstart + dx
//-------------------------------------------------------------------------------------------------
SVGHelp.GraphLine = function (xstart, dx, yvalues, stroke)
{
    var svg = "<polyline";

    svg += SVGHelp.MakeParameter ("fill", "none");
    svg += SVGHelp.MakeParameter ("stroke", stroke);
    svg += SVGHelp.MakeParameter ("stroke-width", 1);
    svg += SVGHelp.MakeParameter ("vector-effect", "non-scaling-stroke");

    var x = xstart;
    var n = yvalues.length;

    var values = "" + x + "," + yvalues [0];

    for (var i = 1 ; i < n ; ++i)
    {
        x += dx;
        values += "," + x + "," + yvalues [i];
    }

    svg += SVGHelp.MakeParameter ("points", values);

    return svg + "/>";
}
//-------------------------------------------------------------------------------------------------
// Draw a grid:
//
// x_start      The first X value
// num_x        The number of X values
// dx           The X increment
// y_start      The first Y value
// num_y        The number of Y values
// dy           The Y increment
// colour       The line colour
// outer_style  The style of the outside lines, use null for solid
// inner_style  The style of the inside lines, use null for solid
//-------------------------------------------------------------------------------------------------
SVGHelp.Grid = function (x_start, num_x, dx, y_start, num_y, dy, colour, outer_style, inner_style)
{
    var text = "";
    var width = x_start + num_x * dx;
    var height = y_start + num_y * dy;

    // Horizontals

    for (var row = 1 ; row < rows ; ++row)
    {
        var y = y_start + row * dy;
        text += SVGHelp.DashedLine ([0,y], [width,y], inner_style);
    }

    // Verticals

    for (var col = 1 ; col < num_x ; ++row)
    {
        var x = x_start + col * dx;
        text += SVGHelp.DashedLine ([0,x], [height,x], inner_style);
    }
    return text;
}




