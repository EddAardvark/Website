//-------------------------------------------------------------------------------------------------
// Javascript Shape Representations
// (c) John Whitehouse 2015
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
// Create a circle. This is a sub-class of Shape.
//-------------------------------------------------------------------------------------------------
function Circle (x, y)
{
    Shape.call (this, x, y);

    this.is_circle = true;
    this.sides = 0;
    this.r2 = this.scale * this.scale;
    this.inner_radius = 1.0;
}

// The circle prototype is a new instance of shape. All the functions we declare in Circle are
// attached to this instance rather than the Circle function itself. We we call one of these
// functions we will first call the version attached to the Shape instance. If this doesn't
// have a definition the one in the shape prototype will be called.

Circle.prototype = new Shape (0,0);

//-------------------------------------------------------------------------------------------------
// Resize the circle
//-------------------------------------------------------------------------------------------------
Circle.prototype.SetSize = function (size)
{
    Shape.prototype.SetSize.call (this, size);
    this.r2 = this.scale * this.scale;
}
//-------------------------------------------------------------------------------------------------
// Draw the shape in SVG
//-------------------------------------------------------------------------------------------------
Circle.prototype.ToSVG = function ()
{
    return SVGHelp.Circle (this.x, this.y, this.scale, this.colour, "black");
}
//-------------------------------------------------------------------------------------------------
// Draw the shape in a canvas - should be implemented in the sub-classes
//-------------------------------------------------------------------------------------------------
Circle.prototype.ToCanvas = function (cv, fill)
{
    if (fill)
        cv.chelp.DrawFilledCircle (this.x * cv.scale + cv.dx, this.y * cv.scale + cv.dy, this.scale * cv.scale, this.colour, "black");
    else
        cv.chelp.DrawCircle (this.x * cv.scale + cv.dx, this.y * cv.scale + cv.dy, this.scale * cv.scale, "black");
}
//-------------------------------------------------------------------------------------------------
//
//-------------------------------------------------------------------------------------------------
Circle.prototype.ContainsPoint = function (point)
{
    var dx = (this.x - point [0]);
    var dy = (this.y - point [1]);

    return dx * dx + dy * dy < this.r2;
}
//-------------------------------------------------------------------------------------------------
// Does another shape overlap this shape.
// If both shapes are circles the test is done using the radii
//-------------------------------------------------------------------------------------------------
Circle.prototype.Overlaps = function (other)
{
    var ccl_overlap = Shape.CirclesOverlap (this, other);

    // If the circles don't overlap the polygon won't either

    if (! ccl_overlap || other.is_circle)
    {
        return ccl_overlap;
    }

    // Other shape is a polygon

    var points = other.GetPoints ();

    // If any of the polygon points are inside the circle then they overlap

    var n = points.length;

    for (var i = 0 ; i < n ; ++i)
    {
        if (this.ContainsPoint (points [i]))
        {
            return true;
        }
    }

    // if any of the chords overlap the circle then they overlap

    for (var i = 0 ; i < n ; ++i)
    {
        var i2 = (i+1) % n;

        if (Shape.LineIntersectsCircle (points [i], points[i2], [this.x, this.y], this.scale))
        {
            return true;
        }
    }
    return false;
}
//-------------------------------------------------------------------------------------------------
// Does this shape completely contain another shape.
//-------------------------------------------------------------------------------------------------
Circle.prototype.Contains = function (shape)
{
    if (shape.is_circle)
    {
        var dx = (this.x - shape.x);
        var dy = (this.y - shape.y);
        var dmin = this.scale - shape.scale;

        return dx * dx + dy * dy < dmin * dmin;
    }

    // Other shape is a polygon

    var points = shape.GetPoints ();

    // If all the polygon points are inside the circle then the whole polygon must be

    var n = points.length;

    for (var i = 0 ; i < n ; ++i)
    {
        if (! this.ContainsPoint (points [i]))
        {
            return false;
        }
    }

    return true;
}
//-------------------------------------------------------------------------------------------------
// Return the area
//-------------------------------------------------------------------------------------------------
Circle.prototype.Area = function ()
{
    return Math.PI * this.scale * this.scale;
}
//-------------------------------------------------------------------------------------------------
// Touching distance is the minimum distance between a point in one shape and a point on the other
//-------------------------------------------------------------------------------------------------
Circle.prototype.TouchingDistance = function (s)
{
    if (s.is_circle)
    {
        return Shape.CentreDistance (this, s) - this.scale - s.scale;
    }
    
    return s.TouchingDistance (this);    
}
//-------------------------------------------------------------------------------------------------
// The minimum distance between a point and this circle.
//-------------------------------------------------------------------------------------------------
Circle.prototype.TouchingDistancePt = function (pt)
{
    var dx = (pt[0] - this.x);
    var dy = (pt[1] - this.y);
    var d2 = dx * dx + dy * dy;
    var diff = Math.sqrt(d2) - this.scale;
    
    return (diff < 0) ? null : diff;     
}
//-------------------------------------------------------------------------------------------------
// Represent a shape as text
//-------------------------------------------------------------------------------------------------
Circle.prototype.ToText = function (shape)
{
    var ret = Shape.ID_CIRCLE;
    ret += "," + this.colour;
    ret += "," + this.scale;
    ret += "," + this.x;
    ret += "," + this.y;

    return ret;
}
//-------------------------------------------------------------------------------------------------
// Construct a circle from the values saved by to text (note the initial ID_CIRCLE parameter has
// been removed.
//-------------------------------------------------------------------------------------------------
Circle.FromValues = function (fields)
{
    var scale = parseFloat (fields [1]);
    var x = parseFloat (fields [2]);
    var y = parseFloat (fields [3]);

    var ret = new Circle (x, y);
    ret.scale = scale;
    ret.colour = fields [0];
    return ret;
}



