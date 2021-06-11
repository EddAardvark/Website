
// Modes when expanding lines on the edge of the pattern

var EXPAND_OUTSIDE = 1;
var EXPAND_ONLINE  = 2;

// Pattern modes

var POLYGON = "S";
var WHEEL = "W";
var PRISM = "P";
var ANTIPRISM = "A"
var GRID = "G"

var NEXT_KEY = "N";
var DUAL_KEY = "D";
//==============================================================================
// The SPattern class
//==============================================================================
SPattern = function ()
{
    this.lines = [];
    this.shapes = [];
    this.points = [];
    this.iteration = 1;
    this.edge_mode = EXPAND_ONLINE;
    this.symetry = 4;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Starts with a polygon, optionally connected to the centre
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.start = function (sides, bCentre)
{
    this.shapes = [];
    this.points = [];
    this.lines = [];
    this.symetry = sides;

    if (sides < 3)
    {
        throw "At least 3 sides are required";
    }

    var dt = Math.PI / sides;

    for (var i = 1 ; i <= 2 * sides ; i += 2)
    {
        var new_pt = new SPoint(Math.cos(i*dt), Math.sin (i*dt));
        this.points.push (new_pt);
    }

    if (bCentre)
    {
        this.points.push (new SPoint(0,0));

        for (var i = 0 ; i < sides ; ++i)
        {
            var s = new Shape();

            s.addPoint (this.points [i]);
            s.addPoint (this.points [(i+1)%sides]);
            s.addPoint (this.points [sides]);
            this.shapes.push (s);
        }
    }
    else
    {
        var s = new Shape();
        for (var i = 0 ; i < sides ; ++i)
        {
             s.addPoint (this.points [i]);
        }
        this.shapes.push (s);
    }

    this.findLines ();
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Starts with a square grid, n x n
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.startGrid = function (n)
{
    this.shapes = [];
    this.points = [];
    this.symetry = 4;

    if (n < 1)
        throw "At least 1 square is required";

    for (var i = 0 ; i <= n ; ++i)
    {
        for (var j = 0 ; j <= n ; ++j)
        {
            this.points.push (new SPoint(i,j));
        }
    }

    for (var i = 0 ; i < n ; ++i)
    {
        for (var j = 0 ; j < n ; ++j)
        {
            s = new Shape();
            pos = (n + 1) * i + j;
            s.addPoint (this.points [pos]);
            s.addPoint (this.points [pos+1]);
            s.addPoint (this.points [pos+n+2]);
            s.addPoint (this.points [pos+n+1]);
            this.shapes.push (s);
        }
    }

    this.findLines ();
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// A prism joins two copies of the basic polygon by a set of
// quadrilaterals
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.startPrism = function (sides)
{
    this.shapes = [];
    this.points = [];
    this.lines = [];
    this.symetry = sides;

    if (sides < 3)
    {
        throw "At least 3 sides are required";
    }

    var dt = Math.PI / sides;

    // Outer points

    for (var i = 1 ; i <= 2 * sides ; i += 2)
    {
        var new_pt = new SPoint(Math.cos(i*dt), Math.sin (i*dt));
        this.points.push (new_pt);
    }

    // Inner points

    for (var i = 1 ; i <= 2 * sides ; i += 2)
    {
        var new_pt = new SPoint(0.5 * Math.cos(i*dt), 0.5 * Math.sin (i*dt));
        this.points.push (new_pt);
    }

    // Inner shape

    var s = new Shape();

    for (var i = sides ; i < 2 * sides ; ++i)
    {
        s.addPoint (this.points [i]);
    }

    this.shapes.push (s);

    // Side panels

    for (var i = 0 ; i < sides ; ++i)
    {
        var n1 = i;
        var n2 = (i + 1) % sides;

        s = new Shape ();

        s.addPoint (this.points [n1]);
        s.addPoint (this.points [n2]);
        s.addPoint (this.points [n2 + sides]);
        s.addPoint (this.points [n1 + sides]);

        this.shapes.push (s);
    }

    this.findLines ();
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// An prism joins two copies of the basic polygon by a set of
// Triangles
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.startAntiPrism = function (sides)
{

    this.shapes = [];
    this.points = [];
    this.lines = [];
    this.symetry = sides;

    if (sides < 3)
    {
        throw "At least 3 sides are required";
    }

    var dt = Math.PI / sides;

    // Outer points

    for (var i = 1 ; i <= 2 * sides ; i += 2)
    {
        var new_pt = new SPoint(Math.cos(i*dt), Math.sin (i*dt));
        this.points.push (new_pt);
    }

    // Inner points

    for (var i = 2 ; i <= 2 * sides ; i += 2)
    {
        var new_pt = new SPoint(0.25 * Math.cos(i*dt), 0.25 * Math.sin (i*dt));
        this.points.push (new_pt);
    }

    // Inner shape

    var s = new Shape();

    for (var i = sides ; i < 2 * sides ; ++i)
    {
        s.addPoint (this.points [i]);
    }

    this.shapes.push (s);


    // Side panels

    for (var i = 0 ; i < sides ; ++i)
    {
        var n1 = i;
        var n2 = (i + 1) % sides;
        var n3 = i + sides;
        var n4 = (i + sides - 1) % sides + sides;

        // first triangle (n1, n3, n4)

        s = new Shape ();

        s.addPoint (this.points [n1]);
        s.addPoint (this.points [n3]);
        s.addPoint (this.points [n4]);

        this.shapes.push (s);

        // first triangle (n1, n2, n3)

        s = new Shape ();

        s.addPoint (this.points [n1]);
        s.addPoint (this.points [n2]);
        s.addPoint (this.points [n3]);

        this.shapes.push (s);
    }

    this.findLines ();
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-------------------
// From a key string, consists of <start_mode><num_sides>:<list of operations>
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-------------------
SPattern.fromKey = function(pattern, from_key_value)
{
    var bits = from_key_value.split(":");

    if (bits.length < 2 || bits[0].length < 2)
    {
        alert ("invalid key value");
        throw "invalid key value";
    }
    var start_mode = bits[0][0];
    var sides = bits[0].substr(1);
    var num_sides = parseInt(sides);

    if (num_sides < 3)
    {
        alert ("invalid number of sides");
        throw "invalid number of sides";
    }

    switch (start_mode)
    {
    case GRID:
        pattern.startGrid (num_sides);
        break;

    case POLYGON:
        pattern.start (num_sides, false);
        break;

    case WHEEL:
        pattern.start (num_sides, true);
        break;

    case PRISM:
        pattern.startPrism (num_sides);
        break;

    case ANTIPRISM:
        pattern.startAntiPrism (num_sides);
        break;

    default:
        throw "Invalid pattern type";
    }

    for (var i = 0 ; i < bits[1].length ; ++i)
    {
        switch (bits[1][i])
        {
        case NEXT_KEY:
            pattern.nextPattern (false);
            break;
        case DUAL_KEY:
            pattern = pattern.getDual ();
            break;
        }
    }
    return pattern;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Calculate the bounding rectangle
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.boundingRect = function ()
{
    var ret = new SRect();
    var num = this.shapes.length;

    if (num > 0)
    {
        ret = this.shapes [0].boundingRect();

        for (var i = 1 ; i < num ; ++i)
        {
            ret.includeRect(this.shapes [i].boundingRect());
        }
    }
    return ret;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Radius of the smallest circle that contains all the points. Assumes the
// origin is (0,0).
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.radius = function ()
{
    var r2 = 0;

    for (pt in this.points)
    {
        var x = this.points[pt].x;
        var y = this.points[pt].y;

        var d2 = x * x + y * y;
        r2 = max (r2, d2);
    }

    return Math.sqrt(r2);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Corrects the pattern by moving points nearer or further from the centre
// depending on where they are. Rnew = Rad * (Rold/Radius) ** factor
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.correct = function (factor)
{
    var r = this.radius();
    var num = this.points.length;

    for (var i = 0 ; i < num ; ++i)
    {
        var d2 = this.points[i].x*this.points[i].x + this.points[i].y*this.points[i].y;
        var f = Math.pow((Math.sqrt(d2) / r), factor);

        this.points[i].x *= f;
        this.points[i].y *= f;
    }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Stretch the underlying polygon into a circle.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.circularise = function ()
{
    var dt  = 2 * Math.PI / this.symetry;
    var cdt = Math.cos (dt/2);
    var num = this.points.length;

    for (var i = 0 ; i < num ; ++i)
    {
        var ang = Math.atan2 (this.points[i].y,this.points[i].x);

        if (ang < 0)
        {
            ang += 2 * Math.PI;
        }
        while (ang > dt / 2)
        {
            ang -= dt;
        }
        f = Math.cos (ang) / cdt

        this.points[i].x *= f;
        this.points[i].y *= f;
    }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Draw the pattern (in SVG)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.draw = function (sz)
{
    var size = (sz) ? sz : 500;
    var rect = this.boundingRect();
    var width = rect.width();
    var height = rect.height();
    var centre = rect.centre();

    var svg = SVGHelp.Start (size, size, rect.left,rect.bottom, rect.right, rect.top);

    for (shape_idx in this.shapes)
    {
        var shape = this.shapes[shape_idx];
        var num = shape.points.length;

        if (num > 0)
        {
            var x1 = shape.points [0].x;
            var y1 = shape.points [0].y;

            for (var i = 1 ; i <= num ; ++i)
            {
                var x2 = shape.points [i % num].x;
                var y2 = shape.points [i % num].y;

                svg += SVGHelp.Line ([x1,y1],[x2,y2], "black");

                x1 = x2;
                y1 = y2;
            }
        }
    }
    svg += SVGHelp.End ();
    return svg;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Create the next pattern
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.nextPattern = function(expand_out)
{
    this.new_shapes = [];
    this.iteration += 1;
    this.edge_mode = (expand_out) ? EXPAND_OUTSIDE : EXPAND_ONLINE;

// Break the old point/shape links

    for (var idx in this.points)
    {
        this.points[idx].shapes = [];
        this.points[idx].lines = [];
    }

// Create the new internal shapes

    for (var idx in this.shapes)
    {
        this.new_shapes.push (this.shapes[idx].internalShape());
    }

// Create the new line shapes

    for (var idx in this.lines)
    {
        this.makeNewShapes (this.lines[idx]);
    }

// Complete the linking and draw

    this.shapes = this.new_shapes;
    this.findLines ();
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//        Read through the points enumerating the lines and
//        tie them to the shapes.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.findLines = function ()
{
    this.lines = []

    for (shape_idx in this.shapes)
    {
        this.shapes [shape_idx].done = false;
    }

    for (shape_idx in this.shapes)
    {
        var shape = this.shapes [shape_idx];
        var p1 = shape.points [shape.points.length-1];
        shape.done = 1;

        for (pt_idx in shape.points)
        {
            var pt = shape.points[pt_idx];
            var other_shape = null;

            for (s2_idx in pt.shapes)
            {
                var s2 = pt.shapes[s2_idx];

                if (s2 != shape && s2.includes(p1))
                {
                    other_shape = s2;
                    break;
                }
            }

            if (other_shape == null || ! other_shape.done)
            {
                var line = new SLine(pt, p1);

                line.addShape (shape);
                pt.addLine (line);
                p1.addLine (line);

                if (other_shape != null)
                {
                    line.addShape (other_shape);
                }
                this.lines.push (line);
            }

            p1 = pt;
        }
    }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//         Converts a single line into a square and two triangles
//         <[]>
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.makeNewShapes  = function (line)
{
    if (line.shape1 == null)
    {
        if (line.shape2 != null)
        {
            this.expandOneShape (line, line.shape2);
        }
    }
    else
    {
        if (line.shape2 == null)
        {
            this.expandOneShape (line, line.shape1);
        }
        else
        {
            this.expandTwoShapes (line, line.shape1, line.shape2);
        }
    }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Converts a single line into a square and two triangles when there
// is one adjacent shape.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.expandOneShape  = function (line, shape)
{
    var p1 = line.p1;
    var p2 = line.p2;
    var p11 = shape.mapPoint (p1);
    var p21 = shape.mapPoint (p2);

    if (this.edge_mode == EXPAND_OUTSIDE)
    {
        p12 = line.reflect (p11)
        p22 = line.reflect (p21)
    }
    else
    {
        p12 = p1.interpolate (p2,1/3);
        p22 = p1.interpolate (p2,2/3);
    }

    this.assemblePoints (p1, p2, p11, p12, p21, p22);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Converts a single line into a square and two triangles when there
// are two adjacent shapes.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

SPattern.prototype.expandTwoShapes  = function (line, s1, s2)
{
    var p1 = line.p1;
    var p2 = line.p2;
    var p11 = s1.mapPoint (p1);
    var p12 = s2.mapPoint (p1);
    var p21 = s1.mapPoint (p2);
    var p22 = s2.mapPoint (p2);

    this.assemblePoints (p1, p2, p11, p12, p21, p22);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Common part of the two expand functions
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.assemblePoints  = function ( p1, p2, p11, p12, p21, p22)
{
    var new_s1 = new Shape();
    var new_s2 = new Shape();
    var new_s3 = new Shape();

    new_s1.addPoint(p1);
    new_s1.addPoint(p11);
    new_s1.addPoint(p12);

    new_s2.addPoint(p11);
    new_s2.addPoint(p12);
    new_s2.addPoint(p22);
    new_s2.addPoint(p21);

    new_s3.addPoint(p2);
    new_s3.addPoint(p21);
    new_s3.addPoint(p22);

    this.new_shapes.push (new_s1);
    this.new_shapes.push (new_s2);
    this.new_shapes.push (new_s3);

// Add the new points to our list

    this.addPoint (p11);
    this.addPoint (p12);
    this.addPoint (p21);
    this.addPoint (p22);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//         Add a point, avoiding duplicates.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.addPoint = function( pt)
{
    var idx = this.points.indexOf (pt);

    if (idx < 0)
    {
        this.points.push(pt);
    }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Return the dual of this pattern
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.getDual = function()
{
    var dual = new SPattern ();

    for (pt_idx in this.points)
    {
        var pt = this.points [pt_idx];
        var shape = new Shape ();

        if (pt.shapes.length == pt.lines.length)
        {
            for (s_idx in pt.shapes)
            {
                var s = pt.shapes[s_idx];
                s.findCentre ();

                var newpt = dual.findPoint (s.centre);
                shape.addPoint (newpt)
            }
            shape.sortPoints ();
            dual.shapes.push(shape);
        }
    }

    dual.findLines();
    return dual;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.getCopy = function()
{
    var copy = new SPattern ();

    for (shape_idx in this.shapes)
    {
        var shape = this.shapes [shape_idx];
        var newshape = new Shape ();

        for (pt_idx in shape.points)
        {
            var pt = shape.points [pt_idx];
            var newpt = copy.findPoint (pt);
            newshape.addPoint (newpt);
        }
        newshape.sortPoints ();
        copy.shapes.push(newshape);
    }

    copy.findLines();
    return copy;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Find a point in the list (by value), if it's not there add it
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.findPoint = function (fpt)
{
    for (pt_idx in this.points)
    {
        var pt = this.points[pt_idx];
        if (pt.x == fpt.x && pt.y == fpt.y)
        {
            return pt;
        }
    }
    var newpt = new SPoint (fpt.x, fpt.y);
    this.points.push (newpt);
    return newpt;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// All the points that are inside polygons formed by a set of triangles are
// moved to the centre. Done in two passes to preserve symetry.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.centrePoints = function ()
{
    for (pt in this.points)
    {
        this.points[pt].toCentre()
    }
    for (pt in this.points)
    {
        this.points[pt].update()
    }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Assume all the lines are springs that relax to the average
// length of lines in the diagram and calculate the equations of
// motion.
// drag applies a damping factor to movement, 1 represents 100% loss of
// momentum between iterations, 0 represents none.
// scale is the calculation step, larger values give finer control
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.relax = function (n, drag, scale)
{
    if (! n) n = 1;
    if (! drag) drag = 1;
    if (! scale) scale = 200;

    drag = 1 - drag;
    var d_avg = this.averageLineLength();

    //print "000: Average Length = ", d_avg

// Do the relaxation

    for (var i = 0 ; i < n ; ++i)
    {
        for (var pt_idx in this.points)
        {
            this.points[pt_idx].ax = 0;
            this.points[pt_idx].ay = 0;
        }

        for (l_idx in this.lines)
        {
            var line = this.lines[l_idx];
            var dx = line.p1.x - line.p2.x;
            var dy = line.p1.y - line.p2.y;
            var d = Math.sqrt(dx*dx+dy*dy);
            var f = (d - d_avg)/(scale * d);

            line.p1.ax -= dx * f;
            line.p1.ay -= dy * f;
            line.p2.ax += dx * f;
            line.p2.ay += dy * f;
        }
        for (var pt_idx in this.points)
        {
            var pt = this.points[pt_idx];
            pt.vx = pt.vx * drag + pt.ax;
            pt.vy = pt.vy * drag + pt.ay;
            pt.x  += pt.vx;
            pt.y  += pt.vy;
        }

        avg2 = this.averageLineLength();
    }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Gives one of the points in an animation a nudge.
// pt: The index of the point to nudge
// dir: The direction (in degrees, 0-360)
// mag: The size of the impule (in multiples of the average line length)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.ping = function (pt,dir,mag)
{
    if (! pt) pt = 0;
    if (! dir) dir = 0;
    if (! mag) mag = 0.1;

    if (pt < 0 || pt >= this.points.length)
    {
        throw "pt not in range 0 - " + this.points.length;
    }

    var avg = this.averageLineLength() * mag;
    var angle = dir * Math.PI / 180;
    var vx = Math.cos(angle) * avg;
    var vy = Math.sin(angle) * avg;

    this.points[pt].vx += vx;
    this.points[pt].vy += vy;

    //print "Velocity = (%f,%f)" % (this.points[pt].vx, this.points[pt].vy)
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Calculate the average length of lines in the pattern.
// If there aren't any lines it returns 1.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPattern.prototype.averageLineLength = function()
{
    var num_lines = this.lines.length;

    if (num_lines == 0)
    {
        return 1;
    }

    var tlen = 0;

    for (lidx in this.lines)
    {
        var line = this.lines [lidx];

        dx = line.p1.x - line.p2.x;
        dy = line.p1.y - line.p2.y;

        tlen += Math.sqrt(dx*dx+dy*dy);
    }
    return tlen / num_lines;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Make a pattern object based on the supplied parameters
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

SPattern.prototype.makePattern = function(sides,centre,iterations)
{
    if (! sides) sides = 4;
    if (! centre) centre = false;
    if (! iterations) iteratins = 1;

    pat = SPattern ();
    pat.start(sides,centre);

    for (var i = 0 ; i < iterations ; ++i)
    {
        pat.nextPattern();
    }
    return pat
}
