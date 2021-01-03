//-------------------------------------------------------------------------------------------------
// A cell in a maze constructed from octagons and squares
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

OctoMaze.Cell = function(sublattice, x, y, domain)
{
    this.sides = OctoMaze.sides[sublattice];

    if (! this.sides)
    {
        this.key="invalid";
        return;
    }

    this.shape_type = (this.sides == 4) ? OctoPoints.SQUARE : OctoPoints.OCTAGON;
    this.key = Key2D(sublattice,x,y);
    this.sublattice = sublattice;
    this.x = x;
    this.y = y;
    this.neighbours = new Array(this.sides);
    this.walls = new Array(this.sides);
    this.domain = domain;
    this.location = OctoMaze.Location.Create (sublattice, x, y);
    this.special = "";

    if (this.shape_type == OctoPoints.OCTAGON)
    {
        this.floor_colour = Misc.RandomElement (OctoMaze.OCT_FLOOR_COLOURS);
        this.ceiling_colour = Misc.RandomElement (OctoMaze.OCT_CEILING_COLOURS);
    }
    else
    {
        this.floor_colour = Misc.RandomElement (OctoMaze.SQ_FLOOR_COLOURS);
        this.ceiling_colour = Misc.RandomElement (OctoMaze.SQ_CEILING_COLOURS);
    }

    for (var i = 0; i < this.sides; ++i)
    {
        this.neighbours[i] = null;
        this.walls[i] = new OctoMaze.Wall ();
    }
    while (i < 8)
    {
        this.walls[i++] = new OctoMaze.Wall ();
    }
}

OctoMaze.Cell.prototype.JoinDomains = function (direction)
{
    var s2 = this.neighbours[direction.d];

    if (! s2 || s2.domain == this.domain)
    {
        return false;
    }

    var back = direction.GetReverse (direction);

    this.walls[direction.d].type = OctoMaze.Wall.OPEN;
    s2.walls[back.d].type = OctoMaze.Wall.OPEN;

    s2.ChangeDomain(this.domain);
    return true;
}

OctoMaze.Cell.prototype.RemoveWall = function (direction)
{
    if (! this.walls[direction.d].IsPassable ())
    {
        var s2 = this.neighbours[direction.d];

        if (s2)
        {
            var back = direction.GetReverse (direction);

            this.walls[direction.d].type = OctoMaze.Wall.OPEN;
            s2.walls[back.d].type = OctoMaze.Wall.OPEN;
        }
    }
}
OctoMaze.Cell.prototype.RemoveHangingWalls = function ()
{
    // Removes walls that are only connected at one end

    var gaps = [];

    for (var i = 0; i < this.sides; ++i)
    {
        if (this.walls [i].IsPassable())
        {
            gaps.push (i);
        }
    }

    if (gaps.length > 0)
    {
        for (var idx in gaps)
        {
            var d = gaps [idx];
            var dleft = (this.shape_type == OctoPoints.OCTAGON) ? Direction.turn_left45 [d] : Direction.turn_left90 [d];
            var dright = (this.shape_type == OctoPoints.OCTAGON) ? Direction.turn_right45 [d] : Direction.turn_right90 [d];

            this.walls [dleft].type = OctoMaze.Wall.OPEN;
            this.walls [dright].type = OctoMaze.Wall.OPEN;
        }
    }
}

OctoMaze.Cell.prototype.ChangeDomain = function(newd)
{
    // Follows the connected tree, the test stops it going back on itself
    if (this.domain != newd)
    {
        this.domain = newd;
        for (var i = 0 ; i < this.sides ; ++i)
        {
            if (this.walls[i].IsPassable () && this.neighbours[i])
            {
                this.neighbours[i].ChangeDomain(newd);
            }
        }
    }
}

OctoMaze.Cell.prototype.Link = function(maze)
{
    var neighbours;
    if (this.sublattice == 'O1')
    {
        neighbours = OctoPoints.neighbours ["Oct90.O1"];
    }
    else if (this.sublattice == 'O2')
    {
        neighbours = OctoPoints.neighbours ["Oct90.O2"];
    }
    else if (this.sublattice == 'S1')
    {
        neighbours = OctoPoints.neighbours ["Oct90.S1"];
    }
    else if (this.sublattice == 'S2')
    {
        neighbours = OctoPoints.neighbours ["Oct90.S2"];
    }

    for (var i = 0 ; i < neighbours.length ; ++i)
    {
        if (neighbours[i])
        {
            var root = neighbours[i][0];
            var dx = neighbours[i][1];
            var dy = neighbours[i][2];
            var key = Key2D(root, this.x + dx, this.y + dy);
            this.neighbours [i] = maze.shapes[key];
        }
    }
}
OctoMaze.Cell.prototype.GetLocation = function()
{
    return OctoMaze.Location.Create (this.sublattice, this.x, this.y);
}
OctoMaze.Cell.prototype.toString = function()
{
    return Misc.Format ("Maze shape {0}: sides = {1}", this.key, this.sides);
}
