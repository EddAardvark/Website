//==============================================================================
// The SPoint class
//==============================================================================
SPoint = function (x, y)
{
    this.x = x;
    this.y = y;
    this.next_x = 0;     // For deferred movement
    this.next_y = 0;
    this.vx = 0;         // X velocity for relaxation calculations
    this.vy = 0;         // y velocity for relaxation calculations
    this.ax = 0;         // X acceleration for relaxation calculations
    this.ay = 0;         // y acceleration for relaxation calculations
    this.shapes = [];
    this.lines = [];
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPoint.prototype.toString = function ()
{
    return "(" + this.x.toPrecision(4) + "," + this.y.toPrecision(4) + ")";
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPoint.prototype.addShape = function(shape)
{
    this.shapes.push (shape);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPoint.prototype.addLine = function(line)
{
    this.lines.push (line);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPoint.prototype.scale = function(factor)
{
    this.x *= factor;
    this.y *= factor;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPoint.prototype.offset = function(dx,dy)
{
    this.x += dx;
    this.y += dy;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Compare two points - ordering the points make some search oparations
// easier. The order itself isn't important so long as it is consistent,
// eg. if A > B and B > C then A > C.
// Returns 0, 1 or -1
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPoint.prototype.compare = function(other)
{
    if (this.x > other.x || (this.x == other.x && this.y > other.y))
    {
        return 1;
    }
    if (this.x < other.x || (this.x == other.x && this.y < other.y))
    {
        return -1;
    }

    return 0
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Find a point on the line joining this point to 'pt'
// factor determines how far along the line, so zero will return
// this point and one will return pt.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPoint.prototype.interpolate = function (pt,factor)
{
    x = this.x + factor * (pt.x - this.x);
    y = this.y + factor * (pt.y - this.y);
    return new SPoint (x,y);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPoint.prototype.update = function()
{
    this.x = this.next_x;
    this.y = this.next_y;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Move this point to the centre of the polygon determined by all the surrounding shapes.
// This version only works if all the surrounding shapes are triangles.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SPoint.prototype.toCentre = function()
{
    this.next_x = this.x;
    this.next_y = this.y;

    if (this.shapes.length <= 2)
    {
        return;
    }

    var points = [];

    // Find unique points excluding this one.

    for (var s in this.shapes)
    {
        var shape = this.shapes [s];
        if (shape.points.length != 3)
        {
            return;
        }

        for (var pt in shape.points)
        {
            var point = shape.points [pt];
            if (point.compare (this) != 0)
            {
                var idx = points.indexOf (point);

                if (idx < 0)
                {
                    points.push(point);
                }
            }
        }
    }

    // Find the mid-point of the found points
    // Store this in the next variables so that all changes can be applied once all
    // calculations have been made.

    if (points.length > 2)
    {
        var n = points.length;
        x = 0;
        y = 0;

        for (var pt in points)
        {
            x += points [pt].x;
            y += points [pt].y;
        }

        this.next_x = x/n;
        this.next_y = y/n;
    }
}

