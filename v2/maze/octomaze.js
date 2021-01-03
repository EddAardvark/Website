//-------------------------------------------------------------------------------------------------
// Maze constructed from octagons and squares
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------


//==============================================================
OctoMaze = function()
{
}

OctoMaze.sides = {"O1":8,"O2":8,"S1":4,"S2":4};

OctoMaze.OCT_FLOOR_COLOURS = [
    "Chartreuse","GreenYellow", "LawnGreen","Lime","LimeGreen","MediumSeaGreen",
    "DarkGreen","DarkOliveGreen","Green","LimeGreen","MediumAquaMarine", "MediumSpringGreen",
    "OliveDrab","SeaGreen","SpringGreen","YellowGreen"];

OctoMaze.SQ_FLOOR_COLOURS = OctoMaze.OCT_FLOOR_COLOURS

OctoMaze.OCT_CEILING_COLOURS = ["SkyBlue","Turquoise","Aqua"];
OctoMaze.SQ_CEILING_COLOURS = ["SlateBlue","SteelBlue"];

OctoMaze.WALL_COLOURS = ["yellow", "salmon", "thistle", "palegreen", "lightsteelblue", "khaki", "linen",
                                    "oldlace", "coral", "lightpink", "peachpuff", "mistyrose", "blanchedalmond",
                                    "papayawhip", "lavenderblush", "lemonchiffon", "seashell", "mintcream"];


// nx x ny is the size of the maze, num_exits, if defined, is the number of exists to the outside world

OctoMaze.prototype.Create = function(nx, ny, num_exits)
{
    this.shapes = {};
    this.cells = [];
    this.nx = nx;
    this.ny = ny;

    if (typeof (num_exits) != "number" || num_exits < 0)
    {
        num_exits = 2 + Misc.RandomInteger(5);
    }

    this.num_exits = num_exits;

    this.scenary = new OctoMaze.Scenary ();
    this.scenary.Init (OctoMaze.Scenary.MODE_REPEATING_FIBONACCI);

    this.xmin = 0;
    this.ymin = 0;
    this.xmax = this.nx - 1;
    this.ymax = this.ny - 1;

// Create the shapes. "domain" is used to test connectivity.

    var domain = 0;

    for(var x = 0; x < this.nx; ++x)
    {
        for(var y = 0; y < this.ny; ++y)
        {
            this.AddShape (new OctoMaze.Cell('O1', x, y, ++domain))
            this.AddShape (new OctoMaze.Cell('O2', x, y, ++domain));
            this.AddShape (new OctoMaze.Cell('S1', x, y, ++domain));
            this.AddShape (new OctoMaze.Cell('S2', x, y, ++domain));
        }
    }

// Link the shapes with their neighbours

    for (sidx in this.cells)
    {
        this.cells[sidx].Link(this);
    }

    this.num_domains = this.cells.length;
    this.num_rooms = 1 + Misc.RandomInteger (1 + Math.floor (this.nx * this.ny / 10));

// Create some rooms, paths and boundary

    this.CreateRooms ();
    this.RemoveLooseEnds ();
    this.ReduceDomains ();
    this.RemoveWalls();
    this.MarkBoundary ();

    this.MakeExits(this.num_exits);
}

// construct a maze by removing walls so that all cells are connected.

OctoMaze.prototype.RemoveWalls = function()
{
    while (this.num_domains > 1)
    {
        var sidx = Misc.RandomInteger (this.cells.length);
        var s1 = this.cells[sidx];
        var direction = Direction.GetRandom (s1.sides);

        if (s1.JoinDomains (direction))
        {
            --this.num_domains;
        }
    }
}
OctoMaze.prototype.ReduceDomains = function ()
{
    for (var idx in this.cells)
    {
        var cell = this.cells[idx];
        for (var d in cell.walls)
        {
            if (cell.walls[d].IsPassable ())
            {
                var cell2 = cell.neighbours[d];

                if (cell2 && cell2.domain != cell.domain)
                {
                    cell2.domain = cell.domain;
                    --this.num_domains;
                }
            }
        }
    }
}

OctoMaze.prototype.CreateRooms = function()
{
    for (var i = 0 ; i < this.num_rooms ; ++i)
    {
        var cell = Misc.RandomElement (this.cells);
        cell.item = new OctoMaze.Item.Pyramid (true, 0.2, 0.0, 0.8);
        cell.item.SetColours (["red","orangered","hotpink","orange","black"]);

        for (var d = 0 ; d < cell.sides ; ++d)
        {
            cell.RemoveWall (new Direction (d));
        }
    }
}

OctoMaze.prototype.RemoveLooseEnds = function()
{
    for (var idx in this.cells)
    {
        this.cells[idx].RemoveHangingWalls ();
    }
}


OctoMaze.prototype.CountDomains = function()
{
    var counts = {};

    for (sidx in this.cells)
    {
        if (counts.hasOwnProperty(this.cells[sidx].domain))
        {
            ++counts[this.cells[sidx].domain];
        }
        else
        {
            counts[this.cells[sidx].domain] = 0;
        }
    }
    return Object.keys(counts).length;
}

OctoMaze.prototype.MarkBoundary = function()
{
    // Colours the external walls differently

    for (sidx in this.cells)
    {
        var cell = this.cells[sidx];

        for (nidx in cell.neighbours)
        {
            if (! cell.neighbours[nidx])
            {
                cell.walls[nidx].colour = (nidx < 4) ? "Maroon" : "FireBrick";
            }
        }
    }
}

OctoMaze.prototype.MakeExits = function(n)
{
    // Create doorways to the external world

    var count = 0;
    while (true)
    {
        var cell = Misc.RandomElement (this.cells);
        var wall = Misc.RandomInteger (cell.sides);
        if (cell.neighbours[wall] == null)
        {
            cell.walls[wall].type = OctoMaze.Wall.DOORWAY;

            ++ count;
            if (count == n)
            {
                cell.special = "start";

                var vec = Direction.vectors[wall];
                this.starting_point = cell.GetLocation();
                this.starting_point.Move (vec[0]*2, vec[1]*2);
                this.starting_dir = Direction.turn_around [wall];
                return;
            }
            else if (count == 1)
            {
                cell.special = "end";
            }
            else
            {
                cell.special = "D" + count;
            }
        }
    }
}

OctoMaze.prototype.SynthesiseExteriorCell = function (location)
{
    var ret = new OctoMaze.Cell (location.sublattice, location.x, location.y, 0);

    ret.ceiling_colour = null;
    ret.floor_colour = (ret.shape_type == OctoPoints.OCTAGON) ? "Peru" : "Sienna";

    for (var i = 0 ; i < 8 ; ++i)
    {
        var loc = location.GetNeighbour (i);

        if (loc)
        {
            var shape = this.shapes [loc.key];

            ret.walls [i].type = OctoMaze.Wall.OPEN;

            if (shape)
            {
                var reverse = Direction.turn_around [i];

                ret.neighbours[i] = shape;
                ret.walls [i].colour =  (i < 4) ? "DimGray" : "SlateGray";
                ret.walls [i].type = (! shape.walls[reverse].IsPassable ()) ? OctoMaze.Wall.SOLID : shape.walls[reverse].type;
            }
        }
    }

    var tree_pos = location.ExpandedPosition ();
    var scenary = this.scenary.GetItem (tree_pos[0], tree_pos[1]);

    ret.item = scenary.item;
    if (scenary.floor) ret.floor_colour = scenary.floor;

    return ret;
}

OctoMaze.prototype.AddShape = function(s)
{
    this.shapes[s.key] = s;
    s.index = this.cells.length;
    this.cells.push(s);
}

OctoMaze.Location = function ()
{
}

OctoMaze.Location.offset = {};
OctoMaze.Location.offset ['O1'] = [0,0];
OctoMaze.Location.offset ['O2'] = [1,1];
OctoMaze.Location.offset ['S1'] = [0,1];
OctoMaze.Location.offset ['S2'] = [1,0];

OctoMaze.Location.Create = function (subl, x, y)
{
    var ret = new OctoMaze.Location();
    ret.sublattice = subl;
    ret.shape_type = (subl == "S1" || subl == "S2") ? OctoPoints.SQUARE : OctoPoints.OCTAGON;
    ret.x = x;
    ret.y = y;
    ret.root = "Oct90." + subl;
    ret.key = Key2D(ret.sublattice, ret.x, ret.y);

    return ret;
}
OctoMaze.Location.prototype.Move = function (dx, dy)
{
    this.x += dx;
    this.y += dy;
    this.key = Key2D(this.sublattice, this.x, this.y);
}
OctoMaze.Location.prototype.GetNeighbour = function(direction)
{
    var delta = OctoPoints.neighbours [this.root][direction];

    return (delta) ? OctoMaze.Location.Create (delta[0], this.x + delta[1], this.y + delta[2]) : null;
}
// Maps the cells onto a square grid where each cell has a unique location
OctoMaze.Location.prototype.ExpandedPosition = function()
{
    var delta = OctoMaze.Location.offset [this.sublattice];
    return [this.x * 2 + delta [0], this.y * 2 + delta [1]];
}
OctoMaze.Location.prototype.toString = function()
{
    return Misc.Format ("OctoMaze.Location: {0}({1},{2})", this.sublattice, this.x, this.y);
}


OctoMaze.DRAW_MARGIN = 4;

OctoMaze.prototype.Draw = function (chelp, background)
{
    var bl = OctoPoints.shapes[Key2D('Oct90.O1',0,0)];
    var tr = OctoPoints.shapes[Key2D('Oct90.O2',nx-1,ny-1)];
    var left = bl.points[1][0];
    var bottom = bl.points[7][1];
    var top = tr.points[3][1];
    var right = tr.points[5][0];
    var height = top - bottom;
    var width = right - left;

    Misc.Log ("Maze, rect = ({0},{1}) - ({2},{3}), size = {4} x {5}", left, bottom, right, top, width, height);

    var w = chelp.canvas.width - 2 * OctoMaze.DRAW_MARGIN;
    var h = chelp.canvas.height - 2 * OctoMaze.DRAW_MARGIN;
    var f = Math.min (w / width, h / height);

    chelp.SetBackground (background ? background : "skyblue");
    chelp.SetForeground ("black");
    chelp.SetLineWidth (1);

    if (background != "transparent")
    {
        chelp.DrawFilledRect (0, 0, chelp.canvas.width, chelp.canvas.height);
    }

    this.DrawShapes(chelp, h, left, bottom, f);
}

OctoMaze.prototype.DrawShapes = function (chelp, h, left, bottom, f)
{
    // Uses the Oct90 lattice for this view

    var font = "12px Arial";


    for (key in this.shapes)
    {
        var screen_key = "Oct90." + key;
        var scrn = OctoPoints.shapes[screen_key];

        if (! scrn) continue;

        var shape = this.shapes[key];
        var to_draw = [];

        if (shape.shape_type == OctoPoints.OCTAGON)
        {
            if (! shape.walls [Direction.NW].IsPassable ()) to_draw.push (Direction.NW);
            if (! shape.walls [Direction.NE].IsPassable ()) to_draw.push (Direction.NE);

            // Special edge cases

            if (shape.sublattice == "O1")
            {
                if (shape.x == this.xmin) { to_draw.push (Direction.W); }
                if (shape.x == this.xmin || shape.y == this.ymin) { to_draw.push (Direction.SW); }
                if (shape.y == this.ymin) { to_draw.push (Direction.S); to_draw.push (Direction.SE); }
            }
            else
            {
                if (shape.x == this.xmax)  { to_draw.push (Direction.E); to_draw.push (Direction.SE); }
                if (shape.y == this.ymax)  { to_draw.push (Direction.N); }
            }
        }
        else
        {
            if (! shape.walls [Direction.N].IsPassable ()) to_draw.push (Direction.N);
            if (! shape.walls [Direction.E].IsPassable ()) to_draw.push (Direction.E);
            if (! shape.walls [Direction.S].IsPassable ()) to_draw.push (Direction.S);
            if (! shape.walls [Direction.W].IsPassable ()) to_draw.push (Direction.W);
        }

        for (var idx in to_draw)
        {
            var d = to_draw[idx];
            var pt1 = scrn.walls2d[d][0];
            var pt2 = scrn.walls2d[d][1];

            var x1 = OctoMaze.DRAW_MARGIN + (pt1[0] - left) * f;
            var y1 = OctoMaze.DRAW_MARGIN + h - (pt1[1] - bottom) * f;
            var x2 = OctoMaze.DRAW_MARGIN + (pt2[0] - left) * f;
            var y2 = OctoMaze.DRAW_MARGIN + h - (pt2[1] - bottom) * f;

            chelp.DrawLine ([x1,y1], [x2,y2]);
        }

        if (shape.special != "")
        {
            chelp.DrawSolidText (font, shape.special, (scrn.xc - left) * f, h - (scrn.yc - bottom) * f, "black");
        }

    }
}

OctoMaze.prototype.DrawVectors = function (chelp, h, f)
{
    chelp.SetForeground ("Red");

    // Direction vectors

    var vector = [[0, 0.25], [0.25,0], [0,-0.25], [-0.25,0],
                    [root2/8,root2/8], [root2/8,-root2/8], [-root2/8,-root2/8], [-root2/8,root2/8]];

    for (key in this.shapes)
    {
        var shape = this.shapes[key];
        var scrn = OctoPoints.shapes[key];

        if (! scrn) continue;

        for (var d in shape.walls)
        {
            if (shape.walls[d].type.IsPassable ())
            {
                var x1 = OctoMaze.DRAW_MARGIN + scrn.xc * f;
                var y1 = OctoMaze.DRAW_MARGIN + h - scrn.yc * f;
                var x2 = OctoMaze.DRAW_MARGIN + (scrn.xc + vector[d][0]) * f;
                var y2 = OctoMaze.DRAW_MARGIN + h - (scrn.yc + vector[d][1]) * f;

                chelp.DrawLine ([x1,y1], [x2,y2]);
            }
        }
    }
}

OctoMaze.prototype.DrawAccessibleNeighbours = function (chelp, h, f)
{
    for (key in this.shapes)
    {
        var shape = this.shapes[key];
        var scrn = OctoPoints.shapes[key];

        if (! scrn) continue;

        for (var d in shape.walls)
        {
            if (shape.walls[d].IsPassable ())
            {
                var neighbour = shape.neighbours[d];

                if (neighbour)
                {
                    var scrn2 = OctoPoints.shapes[neighbour.key];

                    if (scrn2)
                    {
                        var dx = (scrn2.xc - scrn.xc) / 6;
                        var dy = (scrn2.yc - scrn.yc) / 6;
                        var x2 = OctoMaze.DRAW_MARGIN + (scrn.xc + dx) * f;
                        var y2 = OctoMaze.DRAW_MARGIN + h - (scrn.yc + dy) * f;

                        chelp.DrawSpot (x2, y2, 4, "green");
                    }
                }
            }
        }
    }
}

OctoMaze.prototype.DrawCentres = function (chelp, h, f)
{
    for (key in this.shapes)
    {
        var scrn = OctoPoints.shapes[key];

        if (! scrn) continue;

        var colour = (this.shapes[key].shape_type == OctoPoints.OCTAGON) ? "red" : "maroon";

        var x2 = OctoMaze.DRAW_MARGIN + scrn.xc * f;
        var y2 = OctoMaze.DRAW_MARGIN + h - scrn.yc * f;

        chelp.DrawSpot (x2, y2, 4, colour);
    }
}
