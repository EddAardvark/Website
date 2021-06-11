//==================================================================================
// A line in a pattern
//==================================================================================

SLine = function (p1, p2)
{
    this.p1 = p1;
    this.p2 = p2;
    this.shape1 = null;
    this.shape2 = null;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SLine.prototype.toString = function ()
{
    return "Line " + this.p1.toString () + " to " + this.p2.toString ();
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SLine.prototype.midPoint = function ()
{
    var x = (this.p1.x + this.p2.x) / 2;
    var y = (this.p1.y + this.p2.y) / 2;

    return new SPoint(x,y);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SLine.prototype.length = function ()
{
    var dx = this.p1.x - this.p2.x;
    var dy = this.p1.y - this.p2.y;
    return math.sqrt(dx*dx + dy*dy);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SLine.prototype.vector = function ()
{
    var p1 = new SPoint (0,0);
    var p2 = new SPoint (this.p2.x - this.p1.x, this.p2.y - this.p1.y);
    return SLine (p1, p2)
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SLine.prototype.display = function ()
{
    return this.toString ();
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SLine.prototype.addShape = function (shape)
{
    if (this.shape1 == null)
    {
        this.shape1 = shape;
    }
    else if (this.shape2 == null)
    {
        this.shape2 = shape;
    }
    else
    {
        throw "Too many shapes";
    }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Reflect a point in this line
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SLine.prototype.reflect = function (point)
{
    var x21 = this.p2.x - this.p1.x;
    var y21 = this.p2.y - this.p1.y;
    var x31 = point.x - this.p1.x;
    var y31 = point.y - this.p1.y;

    var div = x21 * x21 + y21 * y21;

    var a = (x31 * x21 + y31 * y21) / div;
    var b = (x31 * y21 - y31 * x21) / div;

    var x = this.p1.x + a * x21 - b * y21;
    var y = this.p1.y + a * y21 + b * x21;

    return new SPoint(x,y);
}
