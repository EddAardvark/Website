//-------------------------------------------------------------------------------------------------
// A collection of path constructing functions for use in the sculpture garden
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------
SculptureGarden.Path = function()
{
    // Keys allows us to trace the path, cells allows us to test whether cells are on the path.
    this.cells = {};
    this.keys = [];
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Path.prototype.Construct = function(position, d, twist, len)
{
    // twist: 0 = straight, 1 = totally random

    while (--len > 0)
    {
        if (this.keys.indexOf (position.key) < 0)
        {
            this.cells [position.key] = position;
            this.keys.push (position.key);
            this.end_dir = d;
            this.end_pos = position;
        }

        var next = SculptureGarden.Path.NextPosition (position, d);

        if (Math.random () < twist)
        {
            d = (Math.random() < 0.5) ? Direction.turn_left45 [d] : Direction.turn_right45 [d];
        }
        position = next;
    }
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Path.prototype.Join = function(x0, y0, x1, y1)
{
    var position = new OctoPosition (x0, y0);
    var finished = false;
    var d = Direction.Direction (dx, dy);

    while (! finished)
    {
        var dx = x1 - position.x_pos;
        var dy = y1 - position.y_pos;

        if (dx == 0 && dy == 0)
        {
            finished = true;
        }
        else
        {
            d = Direction.Direction (dx, dy);
        }

        if (this.keys.indexOf (position.key) < 0)
        {
            this.cells [position.key] = position;
            this.keys.push (position.key);
            this.end_dir = d;
            this.end_pos = position;
        }
        position = SculptureGarden.Path.NextPosition (position, d);
    }
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Path.NextPosition = function(position, dir)
{
    var next = position.Neighbour (dir);

    if (! next)
    {
        var d2 = (Math.random () > 0.5) ? Direction.turn_left45 [dir] : Direction.turn_right45 [dir];
        next = position.Neighbour (d2);
    }
    return next;
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Path.prototype.toString = function()
{
    var ret = "Path:";

    for (var idx in this.keys)
    {
        var key = this.keys[idx];
        var pos = this.cells[key];

        ret += "(" + pos.x_pos + "," + pos.y_pos + ")";
    }
    return ret;
}
