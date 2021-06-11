//-------------------------------------------------------------------------------------------------
// Javascript Shape Class (Abstract base class for other shapes)
// (c) John Whitehouse 2015
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

var two_pi = 2 * Math.PI;

Shape.ID_CIRCLE = "C";
Shape.ID_POLYGON = "P";

Shape.max_polygon = 9;
Shape.shape_names =
[
    "Circle", "n/a", "n/a", "Triangle", "Square", "Pentagon", "Hexagon",
    "Pentagon", "Hexagon", "Heptagon", "Octagon", "Nonagon"
];
//-------------------------------------------------------------------------------------------------
// Create a shape (base class for polygons and cirles and possibly other shapes)
//-------------------------------------------------------------------------------------------------
function Shape (x, y)
{
    this.scale = 1;
    this.angle = 0;
    this.x = x;
    this.y = y;
    this.is_circle = false;

    this.colour = SVGColours.RandomNamedColour ();
}
//-------------------------------------------------------------------------------------------------
// Construct a shape from the text representation
//-------------------------------------------------------------------------------------------------
Shape.FromText = function (text)
{
    var fields = text.split (",");
    var type = fields [0];

    fields.splice (0,1);

    if (type == Shape.ID_CIRCLE)
    {
        return Circle.FromValues (fields);
    }
    if (type == Shape.ID_POLYGON)
    {
        return Polygon.FromValues (fields);
    }
    return null;
}
//-------------------------------------------------------------------------------------------------
// On which side of a line is a point. p1 -> p2 is a line. point is a point. This function
// returns true for on the right, false for on the left (in right-handed co-ordinates).
// if A is the vector p1->p2 and B is the orthogonal vector, then the point P can be represented
// by P = P1 + sA + tB. To decide which side of the line P is on we only need to calculate the
// sign of 't'.
//
// t = ((y2-y1)(x-x1) - (x2-x1)(y-y1)) / |P|^2
//
// |P| squared is always positive unless P1 and P2 are the same point so we can ignore it
//-------------------------------------------------------------------------------------------------
Shape.LineSide = function(p1, p2, point)
{
    var x12 = p2 [0] - p1 [0];
    var y12 = p2 [1] - p1 [1];
    var x = point [0] - p1 [0];
    var y = point [1] - p1 [1];

    return (y12 * x - x12 * y) >= 0;
}
//-------------------------------------------------------------------------------------------------
// Returns the intersection of two lines (or null if they don't intersect)
// p1 etc are [x,y] pairs, lines are p1,p2 and p3,p4.
// If "in_range" is true only intersections that fall on the line segments will be returned,
// otherwise the lines will be extended to infinity.
//
// We use p1 + t (p2-p1) = p3 + s (p4-p3) and solve for s and t.
// If s and t are both in the range 0 - 1 then the segments intersect.
// we set x21 as x2 - x1, etc. then:
//
// | x21  -x43 |   | t |   | x31 |
// |           | x |   | = |     |
// | y21  -y43 |   | s |   | y31 |
//
//
// | t |           |-y43  x43|   | x31 |
// |   | = (1/Det) |         | x |     |
// | s |           |-y21  x21|   | y31 |
//
//-------------------------------------------------------------------------------------------------//
Shape.Intersection = function(p1, p2, p3, p4, in_range)
{
    var x21 = p2 [0] - p1 [0];
    var y21 = p2 [1] - p1 [1];
    var x31 = p3 [0] - p1 [0];
    var y31 = p3 [1] - p1 [1];
    var x43 = p4 [0] - p3 [0];
    var y43 = p4 [1] - p3 [1];

    var det = y21 * x43 - x21 * y43;

    // Parallel

    if (det == 0)
    {
        return null;
    }

    t = (y31 * x43 - x31 * y43) / det;
    s = (x21 * y31 - y21 * x31) / det;

    if (in_range && (s <= 0 || t <= 0 || s >= 1 || t >= 1))
    {
        return null;
    }

    return [p1[0] + t * x21, p1[1] + t * y21];
}
//-------------------------------------------------------------------------------------------------
// Returns true if two lines intersect, false if they don't. Only considers
// the actual segments, not the extensions.
// p1 etc are [x,y] pairs, lines are p1,p2 and p3,p4.
//
// uses the equations from Shape.Intersection
//-------------------------------------------------------------------------------------------------//
Shape.LinesIntersect = function(p1, p2, p3, p4)
{
    var x21 = p2 [0] - p1 [0];
    var y21 = p2 [1] - p1 [1];
    var x31 = p3 [0] - p1 [0];
    var y31 = p3 [1] - p1 [1];
    var x43 = p4 [0] - p3 [0];
    var y43 = p4 [1] - p3 [1];

    var det = y21 * x43 - x21 * y43;

    // Parallel

    if (det == 0)
    {
        return false;
    }

    t = (y31 * x43 - x31 * y43) / det;
    s = (x21 * y31 - y21 * x31) / det;

    return (s > 0 && t > 0 && s < 1 && t < 1);
}
//-------------------------------------------------------------------------------------------------
// Finds where a line segment intersects a circle. The line is defined by the two points
// p1 and p2 and is represented by the equation P = P1 + s(P2 - p1). This function returns
// the values of 's' where the line intersects the circle or null if it doesn't.
//
// it solves the equation |P-C| = R, which resolves to the quadratic
// As^2 + Bs + C = 0, where
//
// A = X21 * X21 + Y21 * Y21
// B = 2 * (X1c * X21 + Y1c * Y21)
// C = X1c * X1c + Y1c * Y1c - R * R
//
// For a complete chord (0 <= s1,s2 <= 1)
//-------------------------------------------------------------------------------------------------
Shape.GetChordParameters = function (p1, p2, centre, rad)
{
    var x1c = p1[0] - centre [0];
    var y1c = p1[1] - centre [1];
    var x21 = p2[0] - p1 [0];
    var y21 = p2[1] - p1 [1];

    var a = x21 * x21 + y21 * y21;
    var b = 2 * (x1c * x21 + y1c * y21);
    var c = x1c * x1c + y1c * y1c - rad * rad;

    var disc = b * b - 4 * a * c;

    // No roots => no chord

    if (disc < 0) return null;

    var sd = Math.sqrt (disc);
    var a2 = 2 * a;

    return [(-b - sd) / a2, (-b + sd) / a2];
}
//-------------------------------------------------------------------------------------------------
// Finds if a line segment intersects a circle.
// Returns true if it does
//-------------------------------------------------------------------------------------------------
Shape.LineIntersectsCircle = function (p1, p2, centre, rad)
{
    var cp = Shape.GetChordParameters (p1, p2, centre, rad);

    return (cp != null && cp [0] <1 && cp [1] > 0);
}
//-------------------------------------------------------------------------------------------------
// Do 2 circles overlap
//-------------------------------------------------------------------------------------------------
Shape.CirclesOverlap = function (x1,y1,r1,x2,y2,r2)
{
    var dx = x1 - x2;
    var dy = y1 - y2;
    var dmin = r1 + r2;

    return dx * dx + dy * dy < dmin * dmin;
}
//-------------------------------------------------------------------------------------------------
// Rotate the shape
//-------------------------------------------------------------------------------------------------
Shape.prototype.Rotate = function (da)
{
    var x = this.angle;
    var new_angle = this.angle + da;

    while (new_angle > two_pi)
    {
        new_angle -= two_pi;
    }
    while (new_angle < 0)
    {
        new_angle += two_pi;
    }

    this.angle = new_angle;
}
//-------------------------------------------------------------------------------------------------
// Resize the shape
//-------------------------------------------------------------------------------------------------
Shape.prototype.Resize = function (factor)
{
    this.scale = Math.abs (this.scale * factor);
}
//-------------------------------------------------------------------------------------------------
// Save the position prior to trying out a potential new position
//-------------------------------------------------------------------------------------------------
Shape.prototype.SavePosition = function ()
{
    this.save_x = this.x;
    this.save_y = this.y;
    this.save_scale = this.scale;
    this.save_angle = this.angle;
}
//-------------------------------------------------------------------------------------------------
// restore the position after a potential new position is rejected
//-------------------------------------------------------------------------------------------------
Shape.prototype.RestorePosition = function ()
{
    this.x = this.save_x;
    this.y = this.save_y;
    this.scale = this.save_scale;
    this.angle = this.save_angle;
}
//-------------------------------------------------------------------------------------------------
// Resize the shape
//-------------------------------------------------------------------------------------------------
Shape.prototype.Move = function (dx, dy)
{
    this.x += dx;
    this.y += dy;
}
//-------------------------------------------------------------------------------------------------
// Resize the shape
//-------------------------------------------------------------------------------------------------
Shape.prototype.MoveTo = function (x, y)
{
    this.x = x;
    this.y = y;
}
//-------------------------------------------------------------------------------------------------
// Draw the shape in SVG - should be implemented in the sub-classes
//-------------------------------------------------------------------------------------------------
Shape.prototype.ToSVG = function ()
{
    var msg = "Abstract function \"ToSVG\" called, circle = " + this.is_circle;
    throw msg;
}
//-------------------------------------------------------------------------------------------------
// Does this shape contain a point
//-------------------------------------------------------------------------------------------------
Shape.prototype.ContainsPoint = function (point)
{
    var msg = "Abstract function \"ContainsPoint\" called, circle = " + this.is_circle;
    throw msg;
}
//-------------------------------------------------------------------------------------------------
// Does another shape overlap this shape.
//-------------------------------------------------------------------------------------------------
Shape.prototype.Overlaps = function (shape)
{
    var msg = "Abstract function \"Overlaps\" called, circle = " + this.is_circle;
    throw msg;
}
//-------------------------------------------------------------------------------------------------
// Does this shape completely contain another shape.
//-------------------------------------------------------------------------------------------------
Shape.prototype.Contains = function (shape)
{
    var msg = "Abstract function \"Contains\" called, circle = " + this.is_circle;
    throw msg;
}
//-------------------------------------------------------------------------------------------------
// represent a shape as text
//-------------------------------------------------------------------------------------------------
Shape.prototype.ToText = function (shape)
{
    var msg = "Abstract function \"ToText\" called, circle = " + this.is_circle;
    throw msg;
}
//-------------------------------------------------------------------------------------------------
// SVG text to draw a circle
//-------------------------------------------------------------------------------------------------
Shape.SVGCircle = function (cx, cy, r, fill, stroke)
{
    var svg = "<circle ";

    svg += " cx=\"" + cx + "\"";
    svg += " cy=\"" + cy + "\"";
    svg += " r=\"" + r + "\"";
    svg += " stroke=\"" + stroke + "\" stroke-width=\"1\" vector-effect=\"non-scaling-stroke\"";
    svg += " fill=\"" + fill + "\"" ;
    svg += "/>\n";

    return svg;
}
//-------------------------------------------------------------------------------------------------
// SVG text to draw a line
//-------------------------------------------------------------------------------------------------
Shape.SVGLine = function (p1, p2, stroke)
{
    var svg = "<line ";
    svg += " x1=\"" + p1[0] + "\"";
    svg += " y1=\"" + p1[1] + "\"";
    svg += " x2=\"" + p2[0] + "\"";
    svg += " y2=\"" + p2[1] + "\"";
    svg += " stroke=\"" + stroke + "\" stroke-width=\"1\" vector-effect=\"non-scaling-stroke\"";
    svg += "/>\n";

    return svg;
}
//-------------------------------------------------------------------------------------------------
// SVG text to draw a line
//-------------------------------------------------------------------------------------------------
Shape.SVGPolygon = function (points, fill, stroke)
{
    var svg = "<polygon ";

    svg += " points=\"" + ShapePacker.PointsToSVG (points) + "\"";
    svg += " stroke=\"" + stroke + "\" stroke-width=\"1\" vector-effect=\"non-scaling-stroke\"";
    svg += " fill=\"" + fill + "\"" ;
    svg += "/>\n";

    return svg;
}

