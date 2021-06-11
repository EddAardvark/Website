//==============================================================================
// The Shape class
//==============================================================================

Shape = function ()
{
    this.points = [];
    this.internal_shape = null;
    this.centre = null;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Add a point. These should be in order as edges will join
// adjacent points. Also add this shape to the point.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Shape.prototype.addPoint = function (pt)
{
    this.points.push (pt);

    pt.addShape (this);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Shape.prototype.toString = function ()
{
    var ret = "Shape: " + this.points.length + " points [ ";

    for (var pt_idx in this.points)
    {
        if (pt_idx > 0) ret += ",";
        ret += this.points[pt_idx].toString ();
    }
    ret += "]";
    return ret;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Return the rectangle bouding the shape
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Shape.prototype.boundingRect = function ()
{
    ret = new SRect();
    num = this.points.length;
    ret.fromPoint(this.points [0]);

    for (var i = 1 ; i < num ; ++i)
    {
        ret.includePoint(this.points [i]);
    }

    return ret
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Find and set the centre
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Shape.prototype.findCentre = function ()
{
    var xc = 0.0;
    var yc = 0.0;

    num = this.points.length;

    if (num > 0)
    {
        for (idx = 0 ; idx < num ; ++idx)
        {
            xc += this.points[idx].x;
            yc += this.points[idx].y;
        }
        xc /= num;
        yc /= num;

        this.centre = new SPoint (xc, yc);
    }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Calculate the points inside this shape
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Shape.prototype.internalShape = function ()
{
    var xc = 0.0;
    var yc = 0.0;

    if (this.internal_shape == null)
    {
        this.findCentre();
        this.internal_shape = new Shape ();

        for (var pt_idx in this.points)
        {
            var pt = this.points [pt_idx];
            var point = this.centre.interpolate (pt, 1/3.0);
            this.internal_shape.addPoint(point);
        }
    }
    return this.internal_shape;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Find the corresponding point in the internal shape to the one
// supplied.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Shape.prototype.mapPoint = function (pt)
{
    var idx = this.points.indexOf (pt);

    if (idx < 0)
    {
        throw "Point not found";
    }

    var s2 = this.internalShape ();
    return s2.points [idx];
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Does this shape include a point
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Shape.prototype.includes = function (pt)
{
    return (this.points.indexOf (pt) >= 0);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Make sure the points are in order (so we don't draw stars)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Shape.prototype.sortPoints = function ()
{
    this.findCentre();

    var list = [];
    var num = this.points.length;

    for (var idx = 0 ; idx < num ; ++idx)
    {
        var pt = this.points [idx];
        list.push ([Math.atan2(pt.y-this.centre.y,pt.x-this.centre.x),pt]);
    }

    // Sort

    while (true)
    {
        var bSwapped = false;

        for (var i = 0 ; i < num-1 ; ++i)
        {
            if (list [i][0] > list [i+1][0])
            {
                var temp = list [i];
                list [i] = list [i+1];
                list [i+1] = temp;
                bSwapped = true;
            }
        }
        if (! bSwapped)
        {
            break;
        }
    }

    this.points = [];

    for (var idx in list)
    {
        this.points.push (list[idx][1]);
    }
}

