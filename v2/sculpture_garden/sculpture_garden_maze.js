//-------------------------------------------------------------------------------------------------
// A maze in the sculpture garden.
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------
SculptureGarden.Maze = function()
{
    Rectangle.call(this);

    this.type = SculptureGarden.MAZE;
    this.maze_type = Misc.RandomElement (SculptureGarden.Maze.Types);
    this.name = SculptureGarden.Maze.TypeNames [this.maze_type];

    Misc.Log ("Maze type = {0}", this.name);
}

// Inherit the rectangle prototype

SculptureGarden.Maze.prototype = Object.create(Rectangle.prototype);

SculptureGarden.Maze.FENCED = 1;
SculptureGarden.Maze.WATER = 2;
SculptureGarden.Maze.DARK = 3;

SculptureGarden.Maze.Types = [SculptureGarden.Maze.FENCED, SculptureGarden.Maze.WATER, SculptureGarden.Maze.DARK];
SculptureGarden.Maze.TypeNames = {};
SculptureGarden.Maze.Blockers = {};
SculptureGarden.Maze.Paths = {};
SculptureGarden.Maze.ItemBase = {};
SculptureGarden.Maze.MapColours = {};

SculptureGarden.Maze.TypeNames [SculptureGarden.Maze.FENCED] = "Fenced Maze";
SculptureGarden.Maze.TypeNames [SculptureGarden.Maze.WATER] = "Water Maze";
SculptureGarden.Maze.TypeNames [SculptureGarden.Maze.DARK] = "Dark Maze";

SculptureGarden.Maze.MapColours [SculptureGarden.Maze.FENCED] = "Teal";
SculptureGarden.Maze.MapColours [SculptureGarden.Maze.WATER] = "DarkKhaki";
SculptureGarden.Maze.MapColours [SculptureGarden.Maze.DARK] = "MidnightBlue";

SculptureGarden.Maze.Initialise = function ()
{
    SculptureGarden.Maze.Blockers [SculptureGarden.Maze.FENCED] = SculptureGarden.Cell.MAZE_WALL;
    SculptureGarden.Maze.Blockers [SculptureGarden.Maze.WATER] = SculptureGarden.Cell.MAZE_WATER;
    SculptureGarden.Maze.Blockers [SculptureGarden.Maze.DARK] = SculptureGarden.Cell.MAZE_WALL;

    SculptureGarden.Maze.Paths [SculptureGarden.Maze.FENCED] = SculptureGarden.Cell.PATH;
    SculptureGarden.Maze.Paths [SculptureGarden.Maze.WATER] = SculptureGarden.Cell.PATH;
    SculptureGarden.Maze.Paths [SculptureGarden.Maze.DARK] = SculptureGarden.Cell.DARK_PATH;

    SculptureGarden.Maze.ItemBase [SculptureGarden.Maze.FENCED] = SculptureGarden.Cell.SOLID_TREE;
    SculptureGarden.Maze.ItemBase [SculptureGarden.Maze.WATER] = SculptureGarden.Cell.SOLID_TREE;
    SculptureGarden.Maze.ItemBase [SculptureGarden.Maze.DARK] = SculptureGarden.Cell.SOLID_TREE;
}

SculptureGarden.Maze.prototype.MapColour = function ()
{
    return SculptureGarden.Maze.MapColours[this.maze_type];
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Maze.prototype.Construct = function(garden)
{
    var domain = 1;
    var item_base = SculptureGarden.Maze.ItemBase [this.maze_type];
    var blocker_cell = SculptureGarden.Maze.Blockers [this.maze_type];

    this.path_cell = SculptureGarden.Maze.Paths [this.maze_type];

    this.garden = garden;

    var p = 0.025;

    for (var x = this.x0 ; x <= this.x1 ; ++x)
    {
        for (var y = this.y0 ; y <= this.y1 ; ++y)
        {
            var position = new OctoPosition (x, y);

            if (Math.random () < p)
            {
                var item = (position.shape_type == OctoPoints.SQUARE) ? SculptureGarden.Maze.MakeSquareItem () : SculptureGarden.Maze.MakeOctagonItem ();

                this.cells [position.key] = new SculptureGarden.Cell (position, item_base);
                this.cells [position.key].items = [item];
                this.cells [position.key].type = item_base;
            }
            else
            {
                this.cells [position.key] = new SculptureGarden.Cell (position, blocker_cell);
            }
        }
    }

    // Hollow out some cells

    var to_remove = ((this.width - 2) * (this.height - 2)) / 2;
    var removed = 0;

    while (removed < to_remove)
    {
        var x = Misc.RandomInteger (this.x0 + 1, this.x1 - 1);
        var y = Misc.RandomInteger (this.y0 + 1, this.y1 - 1);

        var position = new OctoPosition (x, y);

        if (this.cells [position.key].type == blocker_cell)
        {
            this.cells [position.key] = new SculptureGarden.Cell (position, this.path_cell);
            ++ removed;
        }
    }

    var num_entrances = Misc.RandomInteger (4,8);

    for (var n = 0, i = 0 ; n < num_entrances && i < 100 ; ++ i)
    {
        var d = Misc.RandomInteger (4);
        var anchor = this.MakeEdgeAnchor (d);

        if (this.cells [anchor.key].type == blocker_cell)
        {
            this.cells [anchor.key].type = this.path_cell;
            this.anchors.Add (anchor);
            ++n;
        }
    }

    // Assign domains (for connectivity checking (start at 1)

    var domain = 0;

    this.domains = [];

    for (var idx in this.cells)
    {
        var cell = this.cells[idx];
        if (cell.type == this.path_cell && ! cell.domain)
        {
            cell.domain = ++domain;
            this.domains.push (domain);
            this.MergeDomains (cell);
        }
    }

    // Merge Domains

    for (var i = 0 ; i < 10000 && this.domains.length > 1 ; ++i)
    {
        var x = Misc.RandomInteger (this.x0 + 1, this.x1 - 1);
        var y = Misc.RandomInteger (this.y0 + 1, this.y1 - 1);
        var position = new OctoPosition (x, y);

        if (this.cells [position.key].type != this.path_cell)
        {
            var domains = [];
            var neighbours = position.Neighbours ();
            var num_paths;

            for (var nidx in neighbours)
            {
                var neighbour = neighbours [nidx];
                var cell = this.cells [neighbour.key];

                if (cell.type == this.path_cell)
                {
                    ++num_paths;
                    if (domains.indexOf (cell.domain) < 0)
                    {
                        domains.push (cell.domain);
                    }
                }
            }
            if (domains.length > 1)
            {
                this.cells [position.key] = new SculptureGarden.Cell (position, this.path_cell);
                this.cells [position.key].domain = Math.min (...domains);
                this.MergeDomains (this.cells [position.key]);
            }
        }
    }

    if (this.domains.length > 1)
    {
        Misc.Log ("Maze Finished, I = {0}, domains = {1}", i, this.domains.length)
        this.LogMazeAsText ();
    }

    for (var x = this.x0 ; x <= this.x1 ; ++x)
    {
        for (var y = this.y0 ; y <= this.y1 ; ++y)
        {
            var position = new OctoPosition (x, y);
            this.cells [position.key].SetColours ();
        }
    }
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Maze.MakeSquareItem = function ()
{
    var c1 = SVGColours.RandomNamedColour ("blue");
    var c2 = SVGColours.RandomNamedColour ("purple");
    var z0 = 0.3 * Math.random();
    var z1 = 0.3 + 0.7 * Math.random();

    var item = new SculptureGarden.Item.Octahedron (OctoPoints.SQUARE, z0, z1, c1, c2);

    item.SetAnimation ();
    return item;
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Maze.MakeOctagonItem = function ()
{
    var widths = new Array (5);
    var heights = new Array (5);

    for (var i = 0 ; i < 5 ; ++i)
    {
        widths [i] = Math.random ();
        heights [i] = i * Math.random () / 2;
    }

    var item = new SculptureGarden.Item.StackOfFour (OctoPoints.OCTAGON, widths, heights, SVGColours.RandomNamedColour ("red"), SVGColours.RandomNamedColour ("purple"));
    var mode = Misc.RandomInteger (0,7);

    if (mode != 0)
    {
        item.SetAnimation (mode);
    }
    return item;
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Maze.prototype.Construct2 = function(garden)
{
    var domain = 1;
    var item_base = SculptureGarden.Maze.ItemBase [this.maze_type];

    this.blocker_cell = SculptureGarden.Maze.Blockers [this.maze_type];
    this.path_cell = SculptureGarden.Maze.Paths [this.maze_type];

    this.garden = garden;

    for (var x = this.x0 ; x <= this.x1 ; ++x)
    {
        for (var y = this.y0 ; y <= this.y1 ; ++y)
        {
            var position = new OctoPosition (x, y);
            this.cells [position.key] = new SculptureGarden.Cell (position, this.blocker_cell);
        }
    }

    // Hollow out some cells

    var to_remove = ((this.width - 2) * (this.height - 2)) / 2;
    var removed = 0;

    while (removed < to_remove)
    {
        var x = Misc.RandomInteger (this.x0 + 1, this.x1 - 1);
        var y = Misc.RandomInteger (this.y0 + 1, this.y1 - 1);

        var position = new OctoPosition (x, y);

        if (this.cells [position.key].type != this.path_cell)
        {
            this.cells [position.key] = new SculptureGarden.Cell (position, this.path_cell);
            ++ removed;
        }
    }

    var num_entrances = Misc.RandomInteger (4,8);

    for (var i = 0 ; i < num_entrances ; ++i)
    {
        var d = Misc.RandomInteger (4);
        var anchor = this.MakeEdgeAnchor (d);
        this.cells [anchor.key].type = this.path_cell;
        this.anchors.Add (anchor);
    }

    // Assign domains (for connectivity checking (start at 1)

    var domain = 0;

    this.domains = [];

    for (var idx in this.cells)
    {
        var cell = this.cells[idx];
        if (cell.type == this.path_cell && ! cell.domain)
        {
            cell.domain = ++domain;
            this.domains.push (domain);
            this.MergeDomains (cell);
        }
    }

    // Merge Domains

    for (var i = 0 ; i < 10000 && this.domains.length > 1 ; ++i)
    {
        var x = Misc.RandomInteger (this.x0 + 1, this.x1 - 1);
        var y = Misc.RandomInteger (this.y0 + 1, this.y1 - 1);
        var position = new OctoPosition (x, y);

        if (this.cells [position.key].type == this.blocker_cell)
        {
            var domains = [];
            var neighbours = position.Neighbours ();
            var num_paths;

            for (var nidx in neighbours)
            {
                var neighbour = neighbours [nidx];
                var cell = this.cells [neighbour.key];

                if (cell.type == this.path_cell)
                {
                    ++num_paths;
                    if (domains.indexOf (cell.domain) < 0)
                    {
                        domains.push (cell.domain);
                    }
                }
            }
            if (domains.length > 1)
            {
                this.cells [position.key] = new SculptureGarden.Cell (position, this.path_cell);
                this.cells [position.key].domain = Math.min (...domains);
                this.MergeDomains (this.cells [position.key]);
            }
        }
    }

    if (this.domains.length > 1)
    {
        Misc.Log ("Maze Finished, I = {0}, domains = {1}", i, this.domains.length)
        this.LogMazeAsText ();
    }

    // Set colours, count edges

    for (var idx in this.cells)
    {
        var cell = this.cells [idx];

        if (cell.type == this.blocker_cell)
        {
            var num_edges = 0;

            for (var d = 0 ; d < 8 ; d++)
            {
                var npos = cell.position.Neighbour (d);

                if (npos)
                {
                // Partition = direction, offset, bottom, top, width, thickness, c1, c2

                    if (! this.cells [npos.key] || (this.cells [npos.key].IsPath ()))
                    {
                        ++num_edges;
                    }
                }
            }
            if (num_edges > 5)
            {
                var widths = new Array (5);
                var heights = new Array (5);

                for (var i = 0 ; i < 5 ; ++i)
                {
                    widths [i] = Math.random ();
                    heights [i] = i * Math.random () / 2;
                }

                var item = new SculptureGarden.Item.StackOfFour (OctoPoints.OCTAGON, widths, heights, SVGColours.RandomNamedColour ("red"), SVGColours.RandomNamedColour ("purple"));
                var mode = Misc.RandomInteger (0,7);

                if (mode != 0)
                {
                    item.SetAnimation (mode);
                }
                cell.items = [item];
                cell.type = item_base;
            }
            else if (num_edges == 4 && cell.position.shape_type == OctoPoints.SQUARE)
            {
                var item = new SculptureGarden.Item.Octahedron (OctoPoints.SQUARE, 0.9, 0.1, 0.5, 0.9, "CadetBlue", "DarkGray");

                item.SetAnimation ();
                cell.items = [item];
                cell.type = item_base;
            }
        }
        cell.SetColours ();
    }
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Maze.prototype.LogMazeAsText = function ()
{
    for (y = this.y1 ; y >= this.y0 ; --y)
    {
        var line = ("    " + y).slice(-4) + ": ";
        for (x = this.x0 ; x <= this.x1 ; ++x)
        {
            var key = OctoPosition.MakeKey (x,y);

            if (! this.cells [key])
            {
                line += " ...";
            }
            else if (this.cells [key].type != this.path_cell)
            {
                line += " XXX";
            }
            else if (! this.cells [key].domain)
            {
                line += " ---";
            }
            else
            {
                line += ("    " + this.cells [key].domain).slice(-4);
            }
        }
        Misc.Log (line);
    }
    Misc.Log ("Domains [{0}]", this.domains);
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Maze.prototype.MergeDomains = function (cell)
{
    var to_do = [];
    var neighbours = cell.position.Neighbours ();

    for (var nidx in neighbours)
    {
        var npos = neighbours [nidx];
        var cell2 = this.cells [npos.key];

        if (cell2 && cell2.type == this.path_cell && (! cell2.domain || cell2.domain > cell.domain))
        {
            var pos = this.domains.indexOf (cell2.domain);
            if (pos >= 0)
            {
                this.domains.splice (pos,1);
            }
            cell2.domain = cell.domain;
            to_do.push (cell2);
        }
    }
    for (var idx in to_do)
    {
        this.MergeDomains (to_do[idx]);
    }
}

//---------------------------------------------------------------------------------------------------------
SculptureGarden.Maze.prototype.toString = function()
{
    return Misc.Format ("SG Maze: Origin = ({0}.{1}), size = {2} x {3}", this.origin[0], this.origin[1], this.width, this.height);
}
