//-------------------------------------------------------------------------------------------------
// Javascript Triangle
// (c) John Whitehouse 2015
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
// Create a Triangle, Triangles have three points.
//-------------------------------------------------------------------------------------------------
function Triangle (p1, p2, p3)
{
    this.points = [p1,p2,p3];
    this.colour = "none";
    this.inside = null;

    var x_coords = [p1[0],p2[0],p3[0]];
    var y_coords = [p1[1],p2[1],p3[1]];

    this.xmin = Math.min.apply(Math, x_coords);
    this.xmax = Math.max.apply(Math, x_coords);
    this.ymin = Math.min.apply(Math, y_coords);
    this.ymax = Math.max.apply(Math, y_coords);
}
//-------------------------------------------------------------------------------------------------
// The Triangle points
//-------------------------------------------------------------------------------------------------
Triangle.prototype.GetPoints = function ()
{
    return this.points;
}
//-------------------------------------------------------------------------------------------------
// Draw the shape in SVG
//-------------------------------------------------------------------------------------------------
Triangle.prototype.ToSVG = function ()
{
    var svg = "";
    svg += "<Polygon points=\"" + ShapePacker.PointsToSVG (this.GetPoints()) + "\"";
    svg += " style=\"stroke-width:1;stroke:black;fill-rule:nonzero;vector-effect:non-scaling-stroke;";
    svg += "fill:" + this.colour + ";\"";
    svg += "/>";

    svg += Shape.SVGLine ([this.xmin, this.ymin], [this.xmin, this.ymax], "blue");
    svg += Shape.SVGLine ([this.xmin, this.ymax], [this.xmax, this.ymax], "green");
    svg += Shape.SVGLine ([this.xmax, this.ymax], [this.xmax, this.ymin], "orange");
    svg += Shape.SVGLine ([this.xmax, this.ymin], [this.xmin, this.ymin], "red");

    return svg;
}
//-------------------------------------------------------------------------------------------------
// Do two triangles overlap. This will return true if one triangle contains the other/
// Touching does not count as overlapping.
//-------------------------------------------------------------------------------------------------
Triangle.prototype.Overlaps = function (other)
{
    // If the bounding rectangles don't overlap then there is no point in continuing

    if (this.xmin >= other.xmax || this.xmax <= other.xmin
         || this.ymin >= other.ymax || this.ymax <= other.ymin)
    {
        return false;
    }

    // If any of the points are inside one of the triangles then they overlap. This also
    // covers the case where one triangle is entirely inside the other

    for (var i in other.points)
    {
        if (this.ContainsPoint (other.points [i]))
        {
            return true;
        }
    }

    for (var i in this.points)
    {
        if (other.ContainsPoint (this.points [i]))
        {
            return true;
        }
    }

    // this only leaves configurations, the star of David and the pattern you would
    // get if you took a hexagon and joined points (1,3 and 4) and (2, 5 and 6) into
    // two triangles. Both of these have overlapping edges.

    if (CoordinateMaths.Line.Intersect (this.points [0], this.points [1], other.points [0], other.points [1])
        || CoordinateMaths.Line.Intersect (this.points [0], this.points [1], other.points [1], other.points [2])
        || CoordinateMaths.Line.Intersect (this.points [0], this.points [1], other.points [2], other.points [0])
        || CoordinateMaths.Line.Intersect (this.points [1], this.points [2], other.points [0], other.points [1])
        || CoordinateMaths.Line.Intersect (this.points [1], this.points [2], other.points [1], other.points [2])
        || CoordinateMaths.Line.Intersect (this.points [1], this.points [2], other.points [2], other.points [0])
        || CoordinateMaths.Line.Intersect (this.points [2], this.points [0], other.points [0], other.points [1])
        || CoordinateMaths.Line.Intersect (this.points [2], this.points [0], other.points [1], other.points [2])
        || CoordinateMaths.Line.Intersect (this.points [2], this.points [0], other.points [2], other.points [0]))
    {
        return true;
    }

    return false;
}
//-------------------------------------------------------------------------------------------------
Triangle.prototype.ContainsPoint = function (point)
{
    // First decide which side is inside (depends on whether the points p1, p2, p3
    // progress clockwise or anti-clockwise)

    if (this.inside == null)
    {
        this.inside = Shape.LineSide (p1, p2, p3);
    }

    // Now check that the target point is on the same side of all three line segments

    if (Shape.LineSide (p1, p2, point) != this.inside)
    {
        return false;
    }
    if (Shape.LineSide (p2, p3, point) != this.inside)
    {
        return false;
    }
    if (Shape.LineSide (p3, p1, point) != this.inside)
    {
        return false;
    }

    return true;
}

