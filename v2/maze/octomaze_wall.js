//-------------------------------------------------------------------------------------------------
// A wall in a maze constructed from octagons and squares
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------


OctoMaze.Wall = function ()
{
    this.type = OctoMaze.Wall.SOLID;
    this.colour = Misc.RandomElement (OctoMaze.WALL_COLOURS);
}
OctoMaze.Wall.prototype.IsPassable = function ()
{
    return (this.type == OctoMaze.Wall.OPEN || this.type == OctoMaze.Wall.DOORWAY);
}
OctoMaze.Wall.prototype.CanViewThrough = function ()
{
    return (this.type == OctoMaze.Wall.OPEN || this.type == OctoMaze.Wall.DOORWAY);
}

OctoMaze.Wall.prototype.IsOpen = function ()
{
    return (this.type == OctoMaze.Wall.OPEN);
}
OctoMaze.Wall.prototype.IsDoorway = function ()
{
    return (this.type == OctoMaze.Wall.DOORWAY);
}
OctoMaze.Wall.prototype.toString = function ()
{
    return Misc.Format ("{0} {1}", OctoMaze.Wall.STRINGS[this.type], this.colour);
}
OctoMaze.Wall.STRINGS = ["Open", "Solid", "Doorway"];

OctoMaze.Wall.OPEN = 0;
OctoMaze.Wall.SOLID = 1;
OctoMaze.Wall.DOORWAY = 2;

