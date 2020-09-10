//-------------------------------------------------------------------------------------------------
// A rectangle in the sculpture garden. Used to delineate a feature such as a gallery or a maze.
// Implements common functionality, such as the collection of cells
// (c) John Whitehouse 2019
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------
Rectangle = function()
{
    this.SetPosition (0, 0, 1, 1);
    this.cells = {};
    this.anchors = new Anchors ();  // Places to attach something
    this.type = 0;
    this.name = "Rectangle";
}
//-------------------------------------------------------------------------------------------------
Rectangle.prototype.SetPosition = function(x, y, w, h)
{
    this.width = w;
    this.height = h;

    this.x0 = x;
    this.y0 = y;
    this.x1 = x + this.width - 1;
    this.y1 = y + this.height - 1;
}
//-------------------------------------------------------------------------------------------------
Rectangle.prototype.GrowToAccommodate = function (rect)
{
    this.x0 = Math.min (this.x0, rect.x0);
    this.y0 = Math.min (this.y0, rect.y0);
    this.x1 = Math.max (this.x1, rect.x1);
    this.y1 = Math.max (this.y1, rect.y1);
    this.width = this.x1 - this.x0 + 1;
    this.height = this.y1 - this.y0 + 1;
}
//-------------------------------------------------------------------------------------------------
Rectangle.prototype.Move = function (dx, dy, relocate)
{
    this.x0 += dx;
    this.y0 += dy;
    this.x1 += dx;
    this.y1 += dy;

    if (relocate)
    {
        // TODO: relocate the cells and anchors
    }
}
//-------------------------------------------------------------------------------------------------
Rectangle.directions = [null, Direction.W, Direction.E, null, Direction.S, Direction.SW, Direction.SE, null, Direction.N, Direction.NW, Direction.NE];
//-------------------------------------------------------------------------------------------------
Rectangle.prototype.GetDirection = function (x,y)
{
    var n = 0;

    if (x < this.x0) n += 1; // West
    if (x > this.x1) n += 2; // East
    if (y < this.y0) n += 4; // South
    if (y > this.y1) n += 8; // North

    return Rectangle.directions[n];
}
//---------------------------------------------------------------------------------------------------------
Rectangle.prototype.ContainsCell = function (x,y)
{
    return (x >= this.x0 && x <= this.x1 && y >= this.y0 && y <= this.y1);
}
//-------------------------------------------------------------------------------------------------
Rectangle.prototype.SetCellColours = function ()
{
    for (var idx in this.cells)
    {
        this.cells[idx].SetColours ();
    }
}
//-------------------------------------------------------------------------------------------------
Rectangle.prototype.GetCellAt = function (position)
{
    return this.cells [position.key];
}
//------------------------------------------------------------------------------------------------------------------------------------
Rectangle.prototype.IsCellOccupied = function (position)
{
    return this.cells [position.key] != null;
}
//-------------------------------------------------------------------------------------------------
Rectangle.prototype.GetAnchor = function (d)
{
    return this.anchors.GetRandonAnchor (d);
}
//-------------------------------------------------------------------------------------------------
Rectangle.prototype.MakeEdgeAnchor = function (d)
{
    if (!d) d = Misc.RandomInteger (4);

    if (d == 0)
    {
        var pos = OctoPosition.MakeKey (Misc.RandomInteger (this.x0+1, this.x1-1), this.y1);
        return new Anchor (pos, d)
    }
    if (d == 1)
    {
        var pos = OctoPosition.MakeKey (this.x1, Misc.RandomInteger (this.y0+1, this.y1-1));
        return new Anchor (pos, d)
    }
    if (d == 2)
    {
        var pos = OctoPosition.MakeKey (Misc.RandomInteger (this.x0+1, this.x1-1), this.y0);
        return new Anchor (pos, d)
    }
    if (d == 3)
    {
        var pos = OctoPosition.MakeKey (this.x0, Misc.RandomInteger (this.y0+1, this.y1-1));
        return new Anchor (pos, d)
    }
}
//-------------------------------------------------------------------------------------------------
Rectangle.prototype.Overlaps = function(rect2, min_gap)
{
    if (! min_gap || min_gap < 0) min_gap = 0;

    var xstart = Math.max (this.x0, rect2.x0);
    var xend = Math.min (this.x1, rect2.x1);

    if (xstart - xend > min_gap) return false;

    var ystart = Math.max (this.y0, rect2.y0);
    var yend = Math.min (this.y1, rect2.y1);

    return (ystart - yend < min_gap);
}
//-------------------------------------------------------------------------------------------------
Rectangle.prototype.Contains = function(rect2, min_gap)
{
    if (! min_gap) min_gap = 0;

    return     rect2.x1 <= this.x1 + min_gap && rect2.y1 <= this.y1 + min_gap
            && rect2.x0 >= this.x0 - min_gap && rect2.y0 >= this.y0 - min_gap;
}
//-------------------------------------------------------------------------------------------------
Rectangle.prototype.ContainsPoint = function(x, y, min_gap)
{
    if (! min_gap) min_gap = 0;

    return     x <= this.x1 + min_gap && y <= this.y1 + min_gap
            && x >= this.x0 - min_gap && y >= this.y0 - min_gap;
}
//---------------------------------------------------------------------------------------------------------
Rectangle.prototype.toString = function()
{
    return Misc.Rectangle ("Origin = ({0}.{1}), size = {2} x {3}", this.x0, this.y0, this.width, this.height);
}

