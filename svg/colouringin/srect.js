//==============================================================================
// The SRect class
//==============================================================================
SRect = function ()
{
    this.left   = 0;
    this.right  = 0;
    this.top    = 0;
    this.bottom = 0;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SRect.prototype.toString = function ()
{
    return "Rect: (" + this.left + "," + this.bottom + ") to (" + this.right + "," + this.top + ")";
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Initialise from a SPoint structure
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SRect.prototype.fromPoint = function (pt)
{
    this.left   = pt.x;
    this.right  = pt.x;
    this.top    = pt.y;
    this.bottom = pt.y;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Expand to include a SPoint
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SRect.prototype.includePoint = function (pt)
{
    this.left   = Math.min (pt.x, this.left);
    this.right  = Math.max (pt.x, this.right);
    this.top    = Math.max (pt.y, this.top);
    this.bottom = Math.min (pt.y, this.bottom);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Expand to include a SRect structure
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SRect.prototype.includeRect = function (rect)
{
    this.left   = Math.min (rect.left, this.left);
    this.right  = Math.max (rect.right, this.right);
    this.top    = Math.max (rect.top, this.top);
    this.bottom = Math.min (rect.bottom, this.bottom);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SRect.prototype.display = function ()
{
    return this.toString ();
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SRect.prototype.width = function ()
{
    return this.right - this.left;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SRect.prototype.height = function ()
{
    return this.top - this.bottom;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SRect.prototype.centre = function ()
{
    var xc = (this.right + this.left) / 2;
    var yc = (this.top + this.bottom) / 2;
    return new SPoint(xc, yc);
}



