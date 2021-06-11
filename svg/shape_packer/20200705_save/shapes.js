//-------------------------------------------------------------------------------------------------
// Javascript Shape Class (Abstract base class for other shapes)
// (c) John Whitehouse 2015-2020
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

var two_pi = 2 * Math.PI;

Shape.ID_CIRCLE = "C";
Shape.ID_POLYGON = "P";

Shape.max_polygon = 9;
Shape.shape_names =
[
    "Circle", "n/a", "n/a", "Triangle", "Square", "Pentagon", "Hexagon",
    "Heptagon", "Octagon", "Nonagon"
];
//-------------------------------------------------------------------------------------------------
// Create a shape (base class for polygons and circles and possibly other shapes)
//-------------------------------------------------------------------------------------------------
function Shape (x, y)
{
    this.scale = 1;
    this.angle = 0;
    this.x = x;
    this.y = y;
    this.is_circle = false;
    this.inner_radius = 1.0;

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
// Distance between two shapes (squared)
//-------------------------------------------------------------------------------------------------
Shape.CentreDistanceSquared = function (s1, s2)
{
    var dx = s1.x - s2.x;
    var dy = s1.y - s2.y;

    return dx * dx + dy * dy;
}
//-------------------------------------------------------------------------------------------------
// Distance between two shapes
//-------------------------------------------------------------------------------------------------
Shape.CentreDistance = function (s1, s2)
{
    var dx = s1.x - s2.x;
    var dy = s1.y - s2.y;

    return Math.sqrt (dx * dx + dy * dy);
}
//-------------------------------------------------------------------------------------------------
// Do 2 circles overlap
//-------------------------------------------------------------------------------------------------
Shape.CirclesOverlap = function (s1, s2)
{
    var dmin = s1.scale + s2.scale;

    return Shape.CentreDistanceSquared (s1, s2) < dmin * dmin;
}
//-------------------------------------------------------------------------------------------------
// Are two shapes touching
//-------------------------------------------------------------------------------------------------
Shape.TouchingDistance = 0.01;

Shape.Touching = function (s1, s2)
{
    var d = s1.TouchingDistance (s2);
    return d !== null && d < Shape.TouchingDistance;
}
//-------------------------------------------------------------------------------------------------
// Touching distance is the minimum distance between a point in one shape and a point on the other
//-------------------------------------------------------------------------------------------------
Shape.prototype.TouchingDistance = function (s)
{
    var msg = "Abstract function \"TouchingDistance\" called";
    throw msg;    
}
//-------------------------------------------------------------------------------------------------
// The minimum distance between a point and this shape.
//-------------------------------------------------------------------------------------------------
Shape.prototype.TouchingDistancePt = function (pt)
{
    var msg = "Abstract function \"TouchingDistancePt\" called";
    throw msg;    
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
    var msg = "Abstract function \"ToSVG\" called";
    throw msg;
}
//-------------------------------------------------------------------------------------------------
// Does this shape contain a point
//-------------------------------------------------------------------------------------------------
Shape.prototype.ContainsPoint = function (point)
{
    var msg = "Abstract function \"ContainsPoint\" called";
    throw msg;
}
//-------------------------------------------------------------------------------------------------
// Does another shape overlap this shape.
//-------------------------------------------------------------------------------------------------
Shape.prototype.Overlaps = function (shape)
{
    var msg = "Abstract function \"Overlaps\" called";
    throw msg;
}
//-------------------------------------------------------------------------------------------------
// Does this shape completely contain another shape.
//-------------------------------------------------------------------------------------------------
Shape.prototype.Contains = function (shape)
{
    var msg = "Abstract function \"Contains\" called";
    throw msg;
}
//-------------------------------------------------------------------------------------------------
// Return the area
//-------------------------------------------------------------------------------------------------
Shape.prototype.Area = function ()
{
    var msg = "Abstract function \"Area\" called";
    throw msg;
}
//-------------------------------------------------------------------------------------------------
// represent a shape as text
//-------------------------------------------------------------------------------------------------
Shape.prototype.ToText = function (shape)
{
    var msg = "Abstract function \"ToText\" called";
    throw msg;
}

