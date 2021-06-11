//-------------------------------------------------------------------------------------------------
// Javascript Shape Representations
// (c) John Whitehouse 2015
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
// Create a polygon, polygons have position, size and rotation. This is a sub-class of Shape.
//-------------------------------------------------------------------------------------------------
function Polygon (n, x, y)
{
    Shape.call (this, x, y);

    this.sides = n;
    this.current_position = null;
    this.inner_radius = this.scale * ShapePacker.PgConstants [this.sides].inner_radius;
    this.edge_len = this.scale * ShapePacker.PgConstants [this.sides].edge_len;
}

// The Polygon prototype is a new instance of shape. All the functions we declare in Polygon are
// attached to this instance rather than the Polygon function itself. We we call one of these
// functions we will first call the version attached to the Shape instance. If this doesn't
// have a definition the one in the shape prototype will be called.

Polygon.prototype = new Shape (0,0);
//-------------------------------------------------------------------------------------------------
// The polygon points are calculated the first time they are needed
//-------------------------------------------------------------------------------------------------
Polygon.prototype.GetPoints = function ()
{
    if (this.current_position == null)
    {
        this.UpdatePosition ();
    }
    return this.current_position;
}
//-------------------------------------------------------------------------------------------------
// This function is used so that we don't have to calculate the actual positions unless we
// need them
//-------------------------------------------------------------------------------------------------
Polygon.prototype.UpdatePosition = function ()
{
    var c = Math.cos (this.angle) * this.scale;
    var s = Math.sin (this.angle) * this.scale;

    this.current_position = new Array (this.sides);
    var basis = ShapePacker.PgConstants [this.sides].points;

    for (var i = 0 ; i < this.sides ; ++i)
    {
        x = this.x + (basis [i][0] * c - basis [i][1] * s);
        y = this.y + (basis [i][0] * s + basis [i][1] * c);

        this.current_position [i] = [x,y];
    }
}
//-------------------------------------------------------------------------------------------------
// Does this shape completely contain another shape.
//-------------------------------------------------------------------------------------------------
Polygon.prototype.Contains = function (shape)
{
    var centre = [shape.x, shape.y];

    if (! this.ContainsPoint (centre))
    {
        return false;
    }

    if (shape.is_circle)
    {
        var points = this.GetPoints ();
        var n = points.length;

        for (var i = 0 ; i < n ; ++i)
        {
            var j = (i + 1) % n;

            if (Shape.LineIntersectsCircle (points [i], points [j], centre, shape.scale))
            {
                return false;
            }
        }
        return true;
    }

    // Other shape is a polygon

    return this.ContainsAllPoints (shape.GetPoints ());
}
//-------------------------------------------------------------------------------------------------
// Does this polygon contain a point
//-------------------------------------------------------------------------------------------------
Polygon.prototype.ContainsPoint = function (point)
{
    // For convex polygons we can just check that the point lies on the same side of all
    // the constituent lines, if we ever do concave polygons then we'll need to
    // decompose them into triangles

    var points = this.GetPoints ();

    // Polygons require at least three points

    var n = points.length;

    if (n <= 2)
    {
        return false;
    }

    var target_side = CoordinateMaths.LineSide (points [0], points [1], points [2]);

    for (var i = 0 ; i < n ; ++i)
    {
        var j = (i + 1) % n;

        if (CoordinateMaths.LineSide (points [i], points [j], point) != target_side)
        {
            return false;
        }
    }

    return true;
}
//-------------------------------------------------------------------------------------------------
// Does this polygon contain all of the points provided
//-------------------------------------------------------------------------------------------------
Polygon.prototype.ContainsAllPoints = function (point_list)
{
    // For convex polygons we can just check that the point lies on the same side of all
    // the constituent lines, if we ever do concave polygons then we'll need to
    // decompose them into triangles

    var points = this.GetPoints ();

    // Polygons require at least three points

    var n = points.length;

    if (n <= 2)
    {
        return false;
    }

    var target_side = CoordinateMaths.LineSide (points [0], points [1], points [2]);

    for (var pt in point_list)
    {
        for (var i = 0 ; i < n ; ++i)
        {
            var j = (i + 1) % n;

            if (CoordinateMaths.LineSide (points [i], points [j], point_list [pt]) != target_side)
            {
                return false;
            }
        }
    }

    return true;
}
//-------------------------------------------------------------------------------------------------
// Does this polygon contain any of the points provided
//-------------------------------------------------------------------------------------------------
Polygon.prototype.ContainsAnyPoint = function (point_list)
{
    // For convex polygons we can just check that the point lies on the same side of all
    // the constituent lines, if we ever do concave polygons then we'll need to
    // decompose them into triangles

    var points = this.GetPoints ();

    // Polygons require at least three points

    var n = points.length;

    if (n <= 2)
    {
        return false;
    }

    var target_side = CoordinateMaths.LineSide (points [0], points [1], points [2]);

    for (var pt in point_list)
    {
        var inside = true;

        for (var i = 0 ; i < n ; ++i)
        {
            var j = (i + 1) % n;

            if (CoordinateMaths.LineSide (points [i], points [j], point_list [pt]) != target_side)
            {
                inside = false;
                break;
            }
        }

        if (inside)
        {
            return true;
        }
    }

    return false;
}
//-------------------------------------------------------------------------------------------------
// Does another shape overlap this shape.
//-------------------------------------------------------------------------------------------------
Polygon.prototype.Overlaps = function (shape)
{
    // if the other shape is a circle the use it to perform the test

    if (shape.is_circle)
    {
        return shape.Overlaps (this);
    }

    var ccl_overlap = true;

    // If the circles don't overlap the polygon won't either

    if (! ccl_overlap)
    {
        return false;
    }

    // Check if any of the polygon edges intersect

    var pts1 = this.GetPoints ();
    var pts2 = shape.GetPoints ();
    var n1 = pts1.length;
    var n2 = pts2.length;

    for (var i1 = 0 ; i1 < n1 ; ++i1)
    {
        var j1 = (i1 + 1) % n1;

        for (var i2 = 0 ; i2 < n2 ; ++i2)
        {
            var j2 = (i2 + 1) % n2;

            if (CoordinateMaths.Line.Intersect (pts1[i1], pts1[j1], pts2[i2], pts2[j2]))
            {
                return true;
            }
        }
    }

    return false;
}
//-------------------------------------------------------------------------------------------------
// Touching distance is the minimum distance between a point in one shape and a point on the other.
// When looking at the edges the point will be to the left of the lines nearest to it and on the right
// of the lines further away (this is a consequence if the way we have ordered the points and implemented
// the parameterisation function). If there an odd number of such edges then the middle one will be
// the nearest, if there are an even number then it is the point where the central two meet.
//-------------------------------------------------------------------------------------------------
Polygon.prototype.TouchingDistance = function (shape)
{
    if (shape.is_circle)
    {
        var c = [shape.x, shape.y];
        var pts = this.GetPoints ();
        var n1 = pts.length;
        var num = 0;
        var result = [];
        
        for (var i = 0 ; i < n1 ; ++i)
        {
            var j = (i + 1) % n1;
            var s = CoordinateMaths.Line.ParameterisePoint (pts [i], pts[j], c)[1];
            
            s = s * this.edge_len + shape.scale;

            result.push ([s, i, j]);
            if (s <= 0)
            {
                ++num;
            }
        }
        if (num == 0)
        {
            return null;
        }
        while (result [0][0] > 0 || result [n1-1][0] <= 0)
        {
            Misc.RotateFrontToBack (result);
        }
        
        if (num % 2 == 1)
        {
            return - result[(num-1)/2][0] * this.edge_len;
        }
        else
        {
            return CoordinateMaths.Distance ([s.x,s.y], result[num/2][1]) - s.scale;
        }
    }
    else
    {
        var d1 = this.NearestPoint (shape);
        var d2 = shape.NearestPoint (this);
        
        return (d1 === null || d2 === null) ? null : Math.min (d1, d2);
    }
}
//-------------------------------------------------------------------------------------------------
// Touching distance is the minimum distance between a point and this shape
// When looking at the edges the point will be to the left of the lines nearest to it and on the right
// of the lines further away (this is a consequence if the way we have ordered the points and implemented
// the parameterisation function). If there an odd number of such edges then the middle one will be
// the nearest, if there are an even number then it is the point where the central two meet.
//-------------------------------------------------------------------------------------------------
Polygon.prototype.TouchingDistancePt = function (pt)
{
    var pts = this.GetPoints ();
    var n1 = pts.length;
    var num = 0;
    var result = [];
    
    for (var i = 0 ; i < n1 ; ++i)
    {
        var j = (i + 1) % n1;
        var s = CoordinateMaths.Line.ParameterisePoint (pts [i], pts[j], pt)[1];

        result.push ([s, i, j]);

        if (s <= 0)
        {
            ++num;
        }
    }
    if (num == 0)
    {
        return null;
    }
    
    while (result [0][0] > 0 || result [n1-1][0] <= 0)
    {
        Misc.RotateFrontToBack (result);
    }
    
    // Near an edge
    
    if (num % 2 == 1)
    {
        return - result[(num-1)/2][0] * this.edge_len;
    }
    
    // Near a point

    else
    {
        var idx = result[num/2][1];
        var pti = pts [idx];
        return CoordinateMaths.Distance (pt, pti);
    }
    
    return null;
}
//-------------------------------------------------------------------------------------------------
// The nearest point distance to another polygon
//-------------------------------------------------------------------------------------------------
Polygon.prototype.NearestPoint = function (polygon)
{
    var pts = polygon.GetPoints ();
    var min_distance = null;
    
    for (var idx in pts)
    {
        var d = this.TouchingDistancePt (pts[idx]);
        
        if (d === null)
        {
            return null;
        }
        if (min_distance === null || d < min_distance)
        {
            min_distance = d;
        }
    }
    return min_distance;        
}
//-------------------------------------------------------------------------------------------------
// Rotate the shape
//-------------------------------------------------------------------------------------------------
Polygon.prototype.Rotate = function (da)
{
    Shape.prototype.Rotate.call (this, da);
    this.current_position = null;
}
//-------------------------------------------------------------------------------------------------
// Resize the shape
//-------------------------------------------------------------------------------------------------
Polygon.prototype.SetSize = function (size)
{
    Shape.prototype.SetSize.call (this, size);
    this.current_position = null;
    this.inner_radius = this.scale * ShapePacker.PgConstants [this.sides].inner_radius;
    this.edge_len = this.scale * ShapePacker.PgConstants [this.sides].edge_len;
}
//-------------------------------------------------------------------------------------------------
// Move the polygon
//-------------------------------------------------------------------------------------------------
Polygon.prototype.Move = function (dx, dy)
{
    Shape.prototype.Move.call (this, dx, dy);

    this.current_position = null;
}
//-------------------------------------------------------------------------------------------------
// Move the polygon
//-------------------------------------------------------------------------------------------------
Polygon.prototype.MoveTo = function (x, y)
{
    Shape.prototype.MoveTo.call (this, x, y);

    this.current_position = null;
}
//-------------------------------------------------------------------------------------------------
// Save the position prior to trying out a potential new position
//-------------------------------------------------------------------------------------------------
Polygon.prototype.SavePosition = function ()
{
    Shape.prototype.SavePosition.call (this);

    this.save_current_position = this.current_position;
}
//-------------------------------------------------------------------------------------------------
// restore the position after a potential new position is rejected
//-------------------------------------------------------------------------------------------------
Polygon.prototype.RestorePosition = function ()
{
    Shape.prototype.RestorePosition.call (this);

    this.current_position = this.save_current_position;
    this.inner_radius = this.scale * ShapePacker.PgConstants [this.sides].inner_radius;
    this.edge_len = this.scale * ShapePacker.PgConstants [this.sides].edge_len;
}
//-------------------------------------------------------------------------------------------------
// Draw the shape in SVG
//-------------------------------------------------------------------------------------------------
Polygon.prototype.ToSVG = function ()
{
    if (this.current_position == null)
    {
        this.UpdatePosition ();
    }

    var svg = "";
    svg += SVGHelp.Polygon (this.current_position, this.colour, "black");
    return svg;
}
//-------------------------------------------------------------------------------------------------
// Draw the shape in a canvas - should be implemented in the sub-classes
//-------------------------------------------------------------------------------------------------
Polygon.prototype.ToCanvas = function (cv, fill)
{
    if (this.current_position == null)
    {
        this.UpdatePosition ();
    }
    
    var pts = this.current_position.map(function(pt) { return [pt[0] * cv.scale + cv.dx, pt[1] * cv.scale + cv.dy]; });
    cv.chelp.SetForeground ("black");

    if (fill)
    {
        cv.chelp.SetBackground (this.colour);
        cv.chelp.FillPolygon (pts);
    }
    else
        cv.chelp.DrawPolygon (pts);
}
//-------------------------------------------------------------------------------------------------
// Return the area
//-------------------------------------------------------------------------------------------------
Polygon.prototype.Area = function ()
{
    var theta = Math.PI / this.sides;
    return this.sides * this.scale * this.scale * Math.cos (theta) * Math.sin (theta);
}
//-------------------------------------------------------------------------------------------------
// Represent a polygon as text
//-------------------------------------------------------------------------------------------------
Polygon.prototype.ToText = function (shape)
{
    var ret = Shape.ID_POLYGON;
    ret += "," + this.colour;
    ret += "," + this.sides;
    ret += "," + this.scale;
    ret += "," + this.angle;
    ret += "," + this.x;
    ret += "," + this.y;

    return ret;
}
//-------------------------------------------------------------------------------------------------
// Construct a polygon from the values saved by to text (note the initial ID_CIRCLE parameter has
// been removed.
//-------------------------------------------------------------------------------------------------
Polygon.FromValues = function (fields)
{
    var sides = parseFloat (fields [1]);
    var scale = parseFloat (fields [2]);
    var angle = parseFloat (fields [3]);
    var x = parseFloat (fields [4]);
    var y = parseFloat (fields [5]);

    var ret = new Polygon (sides, x, y)

    ret.angle = angle;
    ret.scale = scale;
    ret.colour = fields [0];

    ret.UpdatePosition ();
    ret.inner_radius = ret.scale * ShapePacker.PgConstants [ret.sides].inner_radius;
    ret.edge_len = ret.scale * ShapePacker.PgConstants [ret.sides].edge_len;

    return ret;
}
