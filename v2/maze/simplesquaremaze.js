
//-------------------------------------------------------------------------------------------------
// Javascript Maze class definition. A simple 2D square maze
// (c) John Whitehouse 2017
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

// A cell in the maze
SSMCell = function ()
{
    this.walls = [SSMCell.SOLID, SSMCell.SOLID, SSMCell.SOLID, SSMCell.SOLID];
    this.neighbours = [-1, -1, -1, -1];
    this.domain = 0;
}

SSMCell.N = 0;
SSMCell.E = 1;
SSMCell.S = 2;
SSMCell.W = 3;

SSMCell.Reverse = [SSMCell.S, SSMCell.W, SSMCell.N, SSMCell.E];
SSMCell.TurnLeft = [SSMCell.W, SSMCell.N, SSMCell.E, SSMCell.S];
SSMCell.TurnRight = [SSMCell.E, SSMCell.S, SSMCell.W, SSMCell.N];

SSMCell.vectors = new Array(4);
SSMCell.vectors [SSMCell.N] = { "dx":0, "dy":-1 };
SSMCell.vectors [SSMCell.S] = { "dx":0, "dy":1  };
SSMCell.vectors [SSMCell.E] = { "dx":1, "dy":0  };
SSMCell.vectors [SSMCell.W] = { "dx":-1,"dy":0  };

SSMCell.OPEN = 0;
SSMCell.WALL = 1;
SSMCell.SOLID = 2; // Visited and rejected

SSMCell.wall_colour = [null, "blue", "black"];

// -------------------------------------------------------------------------------------------------
SimpleSquareMaze = function(num_x, num_y)
{
    this.num_x = num_x;
    this.num_y = num_y;
    this.stop_on_solution = false;
    this.Initialise ();
    this.CreateEndPoints ();
    this.OpenRoute ();

    this.SelectAlgorithm (SimpleSquareMaze.KEEP_LEFT);
}

SimpleSquareMaze.UNVISITED = 0;         // Not yest tested
SimpleSquareMaze.CURRENT_PATH = 1;      // Part of the active path
SimpleSquareMaze.VISITED = 2;           // Visited and rejected
SimpleSquareMaze.COLOUR_SWITCH = 7;
SimpleSquareMaze.UNVISITED_COLOUR = "none";        // Not yest teste
SimpleSquareMaze.CURRENT_PATH_COLOUR = "blue";    // Part of the active path
SimpleSquareMaze.START_COLOUR = "cyan";
SimpleSquareMaze.END_COLOUR = "fuchsia";
SimpleSquareMaze.PATCH_COLOURS = ["yellow", "salmon", "thistle", "white", "palegreen", "lightsteelblue", "khaki", "linen",
                                    "oldlace", "coral", "lightpink", "peachpuff", "mistyrose", "blanchedalmond",
                                    "papayawhip", "lavenderblush", "lemonchiffon", "seashell", "mintcream"];
SimpleSquareMaze.SYSTEMATIC = 0;
SimpleSquareMaze.KEEP_LEFT = 1;
SimpleSquareMaze.KEEP_RIGHT= 2;

SimpleSquareMaze.Panel = function (plane, x, y)
{
    this.plane = plane;
    this.x = x;
    this.y = y;
}
SimpleSquareMaze.Panel.prototype.toString = function ()
{
    return "Panel: " + this.plane + " at (" + [this.x,this.y] + ")";
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.SelectAlgorithm = function (method)
{
    if (method == SimpleSquareMaze.SYSTEMATIC)
    {
        this.StartRoute = this.StartRouteSystematic;
        this.ContinueRoute = this.ContinueRouteSystematic;
    }
    else if (method == SimpleSquareMaze.KEEP_LEFT)
    {
        this.StartRoute = this.StartRouteKeepLeft;
        this.ContinueRoute = this.ContinueRouteLeftRight;
    }
    else
    {
        this.StartRoute = this.StartRouteKeepRight;
        this.ContinueRoute = this.ContinueRouteLeftRight;
    }
}

// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.SetCanvas = function (width, height)
{
    this.width = width;
    this.height = height;
    this.chelp = new CanvasHelp (this.width, this.height);
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.Initialise = function ()
{
    this.cells = new Array (this.num_x * this.num_y);

    var pos = 0;
    for (var y = 0 ; y < this.num_y ; ++y)
    {
        for (var x = 0 ; x < this.num_x ; ++x)
        {
            this.cells [pos] = new SSMCell ();
            this.cells [pos].pos = pos;
            this.cells [pos].domain = pos;
            this.cells [pos].x = x;
            this.cells [pos].y = y;
            this.cells [pos].floor_colour = SVGColours.Blend ("black", "white", 0.1 + 0.8 * Math.random ());
            this.cells [pos].ceiling_colour = SVGColours.Blend ("skyblue", "midnightblue", 0.1 + 0.8 * Math.random ());
            this.cells [pos].colour = SimpleSquareMaze.PATCH_COLOURS [Misc.RandomInteger (SimpleSquareMaze.PATCH_COLOURS.length)];

            if (x > 0)
            {
                this.cells [pos].walls [SSMCell.W] = SSMCell.WALL;
                this.cells [pos].neighbours [SSMCell.W] = pos-1;
            }
            if (x < this.num_x-1)
            {
                this.cells [pos].walls [SSMCell.E] = SSMCell.WALL;
                this.cells [pos].neighbours [SSMCell.E] = pos+1;
            }
            if (y > 0)
            {
                this.cells [pos].walls [SSMCell.N] = SSMCell.WALL;
                this.cells [pos].neighbours [SSMCell.N] = pos-this.num_x;
            }
            if (y < this.num_y-1)
            {
                this.cells [pos].walls [SSMCell.S] = SSMCell.WALL;
                this.cells [pos].neighbours [SSMCell.S] = pos+this.num_x;
            }
            pos ++;
        }
    }
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.CreateEndPoints = function ()
{
    if (Misc.RandomInteger (2) == 0) // top + bottom
    {
        this.start_pos = Misc.RandomInteger(this.num_x);
        this.end_pos = this.num_x * (this.num_y-1) + Misc.RandomInteger(this.num_x);
    }
    else // sides
    {
        this.start_pos = this.num_x * Misc.RandomInteger(this.num_y);
        this.end_pos = this.num_x * Misc.RandomInteger(this.num_y) + (this.num_x - 1);
    }
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.GetPosition = function (x, y)
{
    return this.num_x * y + x;
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.OpenRoute = function ()
{
    this.todo = this.cells.length - 1;

    while (this.todo > 0)
    {
        var pos = Misc.RandomInteger (this.cells.length);
        this.RemoveWall (pos);
    }
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.RemoveWall = function (pos)
{
    var d = Misc.RandomInteger (4);
    for (var i = 0 ; i < 4 ; ++i)
    {
        var cell = this.cells [pos];

        if (cell.walls [d] == SSMCell.WALL)
        {
            var pos2 = cell.neighbours [d];
            var next = this.cells [pos2];

            if (next.domain != cell.domain)
            {
                cell.walls [d] = SSMCell.OPEN;
                next.walls [SSMCell.Reverse[d]] = SSMCell.OPEN;
                this.SwitchDomain (next.domain, cell.domain);
                -- this.todo;
                return;
            }
        }
        d = (d + 1) % 4;
    }
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.SwitchDomain = function (from, to)
{
    for (var i = 0 ; i < this.cells.length ; ++i)
    {
        if (this.cells [i].domain == from)
        {
            this.cells [i].domain = to;
        }
    }
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.DrawCanvas = function ()
{
    this.x_factor = this.width / this.num_x;
    this.y_factor = this.height / this.num_y;
    var pos = 0;
    for (var y = 0 ; y < this.num_y ; ++y)
    {
        for (var x = 0 ; x < this.num_x ; ++x)
        {
            if (y == 0)
            {
                this.DrawWall (pos, SSMCell.N);
            }
            if (x == 0)
            {
                this.DrawWall (pos, SSMCell.W);
            }
            this.DrawWall (pos, SSMCell.S);
            this.DrawWall (pos, SSMCell.E);
            ++pos;
        }
    }
    this.DrawEndpoint (this.start_pos, "S", SimpleSquareMaze.START_COLOUR);
    this.DrawEndpoint (this.end_pos, "E", SimpleSquareMaze.END_COLOUR);
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.DrawWall = function (pos, dir)
{
    var colour = SSMCell.wall_colour [this.cells [pos].walls[dir]];
    var pt1, pt2;

    if (colour != null)
    {
        if (dir == SSMCell.N)
        {
            pt1 = [this.cells[pos].x, this.cells[pos].y];
            pt2 = [this.cells[pos].x + 1, this.cells[pos].y];
        }
        else if (dir == SSMCell.S)
        {
            pt1 = [this.cells[pos].x, this.cells[pos].y + 1];
            pt2 = [this.cells[pos].x + 1, this.cells[pos].y + 1];
        }
        else if (dir == SSMCell.W)
        {
            pt1 = [this.cells[pos].x, this.cells[pos].y];
            pt2 = [this.cells[pos].x, this.cells[pos].y + 1];
        }
        else if (dir == SSMCell.E)
        {
            pt1 = [this.cells[pos].x + 1, this.cells[pos].y];
            pt2 = [this.cells[pos].x + 1, this.cells[pos].y + 1];
        }


        pt1 [0] *= this.x_factor;
        pt2 [0] *= this.x_factor;
        pt1 [1] *= this.y_factor;
        pt2 [1] *= this.y_factor;

        this.chelp.SetForeground (colour);
        this.chelp.DrawLine (pt1, pt2);
    }
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.DrawSpot = function (pos, colour)
{
    var cell = this.cells[pos];

    var xpos = (cell.x + 0.5) * this.x_factor;
    var ypos = (cell.y + 0.5) * this.y_factor;

    this.chelp.DrawSpot (xpos, ypos, 0.35 * this.x_factor, colour);
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.DrawEndpoint = function (pos, text, colour)
{
    var cell = this.cells[pos];
    var xpos = (cell.x + 0.5) * this.x_factor;
    var ypos = (cell.y + 0.5) * this.y_factor;
    var font = Math.floor (this.y_factor * 0.9) + "px Arial";

    this.chelp.DrawSpot (xpos, ypos, 0.45 * this.x_factor, colour);
    this.chelp.DrawSolidText (font, text, xpos, ypos, "black");
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.ColourCells = function ()
{
    for (var i = 0 ; i < this.cells.length ; ++i)
    {
        this.cells [i].visit = SimpleSquareMaze.UNVISITED;
    }
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.PrepareRoute = function ()
{
    for (var i = 0 ; i < this.cells.length ; ++i)
    {
        this.cells [i].visit = SimpleSquareMaze.UNVISITED;
    }

    this.cells [this.start_pos].visit = SimpleSquareMaze.CURRENT_PATH;
    this.retrace_length = 0;
    this.patch_colour = 0;
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.StartRouteSystematic = function ()
{
    this.PrepareRoute ();
    this.path = [];
    this.path.push ({"cell":this.start_pos, "direction":0});
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.ContinueRouteSystematic = function ()
{
    var num = this.path.length;

    if (num == 0) return false;

    var pos = this.path [num-1].cell;
    var cell = this.cells [pos];

    while (this.path [num-1].direction < 4)
    {
        if (cell.walls[this.path [num-1].direction] == 0)
        {
            var next_pos = cell.neighbours [this.path [num-1].direction];
            var visited = this.cells [next_pos].visit != SimpleSquareMaze.UNVISITED;

            if (! visited)
            {
                this.cells [next_pos].visit = SimpleSquareMaze.CURRENT_PATH;

                if (this.stop_on_solution && next_pos == this.end_pos)
                {
                    return false; // Finished
                }

                this.DrawSpot (next_pos, SimpleSquareMaze.CURRENT_PATH_COLOUR);
                this.path.push ({"cell":next_pos, "direction":0});
                this.retrace_length = 0;
                return true;
            }
        }
        ++ this.path [num-1].direction;
    }

    // No way out of the current cell

    this.RetracePath ();

    this.cells [pos].visit = SimpleSquareMaze.VISITED;
    this.path.splice (-1, 1);
    this.DrawSpot (pos, SimpleSquareMaze.PATCH_COLOURS [this.patch_colour]);
    num = this.path.length;

    if (num > 0)
    {
        ++ this.path [num-1].direction;
    }

    return num > 0;
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.StartRouteKeepLeft = function ()
{
    this.PrepareRoute ();
    this.current_position = this.start_pos;
    this.current_direction = SSMCell.N;
    this.start_move = SSMCell.TurnLeft;
    this.continue_move = SSMCell.TurnRight;
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.StartRouteKeepRight = function ()
{
    this.PrepareRoute ();
    this.current_position = this.start_pos;
    this.current_direction = SSMCell.N;
    this.start_move = SSMCell.TurnRight;
    this.continue_move = SSMCell.TurnLeft;
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.ContinueRouteLeftRight = function ()
{
    var cell = this.cells[this.current_position];
    var dir = this.current_direction;

    var dir = this.start_move [dir];

    for (var i = 0 ; i < 4 ; ++i)
    {
        var next_pos = cell.neighbours [dir];

        if (cell.walls [dir] == SSMCell.OPEN)
        {
            if (this.cells [this.current_position].visit == SimpleSquareMaze.VISITED)
            {
                this.RetracePath ();
            }
            else
            {
                this.cells [this.current_position].visit = SimpleSquareMaze.VISITED;
                this.retrace_length = 0;
            }
            this.cells [this.current_position].visit = SimpleSquareMaze.VISITED;
            this.DrawSpot (this.current_position, SimpleSquareMaze.PATCH_COLOURS[this.patch_colour]);
            this.current_position = next_pos;
            this.current_direction = dir;
            this.DrawSpot (this.current_position, SimpleSquareMaze.CURRENT_PATH_COLOUR);
            return ! (this.stop_on_solution && this.current_position == this.end_pos);
        }
        var dir = this.continue_move [dir];
    }

    return false;
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.RetracePath = function ()
{
    this.retrace_length ++;

    if (this.retrace_length == SimpleSquareMaze.COLOUR_SWITCH)
    {
        this.patch_colour = (this.patch_colour + 1) % SimpleSquareMaze.PATCH_COLOURS.length;
    }
}
// -------------------------------------------------------------------------------------------------
// Returns the set of walls visible from a point
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.GetView = function (x, y, d_fwd, side_limit, fwd_limit)
{
    var d_left = SSMCell.TurnLeft[d_fwd];
    var d_right = SSMCell.TurnRight[d_fwd];
    var forward = SSMCell.vectors [d_fwd];
    var right = SSMCell.vectors [d_right];

    var ret = new Array ();

    for (var fwd = 0; fwd <= fwd_limit ; ++fwd)
    {
        var xpos = x - side_limit * right.dx + fwd * forward.dx;
        var ypos = y - side_limit * right.dy + fwd * forward.dy;

        for (var lft = -side_limit ; lft <= side_limit ; ++lft)
        {
            var cell = this.GetCell (xpos, ypos);

            if (cell != null)
            {
                if (cell.walls[d_fwd] != SSMCell.OPEN)
                {
                    var panel = new SimpleSquareMaze.Panel ("XZ", lft, fwd+1);
                    panel.colour = (cell.walls[d_fwd] == SSMCell.SOLID) ? "darkred" : cell.colour;
                    ret.push (panel);
                }
                if (lft <= 0 && cell.walls[d_left] != SSMCell.OPEN)
                {
                    var panel = new SimpleSquareMaze.Panel ("YZ", lft, fwd);
                    panel.colour = (cell.walls[d_left] == SSMCell.SOLID) ? "darkred" : cell.colour;
                    ret.push (panel);
                }
                if (lft >= 0 && cell.walls[d_right] != SSMCell.OPEN)
                {
                    var panel = new SimpleSquareMaze.Panel ("YZ", lft+1, fwd);
                    panel.colour = (cell.walls[d_right] == SSMCell.SOLID) ? "darkred" : cell.colour;
                    ret.push (panel);
                }
            }
            xpos += right.dx;
            ypos += right.dy;
        }
    }
    return ret;
}
// -------------------------------------------------------------------------------------------------
// Returns the set of floors/ceilings visible from a point
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.GetLevel = function (x, y, d_fwd, side_limit, fwd_limit, is_floor)
{
    var d_left = SSMCell.TurnLeft[d_fwd];
    var d_right = SSMCell.TurnRight[d_fwd];
    var forward = SSMCell.vectors [d_fwd];
    var right = SSMCell.vectors [d_right];

    var ret = new Array ();

    for (var fwd = 0; fwd <= fwd_limit ; ++fwd)
    {
        var xpos = x - side_limit * right.dx + fwd * forward.dx;
        var ypos = y - side_limit * right.dy + fwd * forward.dy;

        for (var lft = -side_limit ; lft <= side_limit ; ++lft)
        {
            var cell = this.GetCell (xpos, ypos);

            if (cell != null)
            {
                var panel = new SimpleSquareMaze.Panel ("XY", lft, fwd);

                panel.colour = is_floor ? cell.floor_colour : cell.ceiling_colour;
                ret.push (panel);
            }
            xpos += right.dx;
            ypos += right.dy;
        }
    }
    return ret;
}
// -------------------------------------------------------------------------------------------------
// Tests if a move is possible and if it is returns the next square (null otherwise)
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.TryMove = function (x, y, d)
{
    var cell = this.GetCell (x, y);

    if (cell == null || cell.walls[d] != SSMCell.OPEN) return null;

    var forward = SSMCell.vectors [d];

    return [x + forward.dx, y + forward.dy];
}
// -------------------------------------------------------------------------------------------------
SimpleSquareMaze.prototype.GetCell = function (x, y)
{
    if (x < 0 || y < 0 || x >= this.num_x || y >= this.num_y)
    {
        return null;
    }
    return this.cells [this.num_x * y + x];
}

SimpleSquareMaze.Overview = function (wall_length, side_limit, fwd_limit)
{
    this.wall_length = wall_length;
    this.side_limit = side_limit;
    this.fwd_limit = fwd_limit;
}
SimpleSquareMaze.Overview.prototype.Draw = function (maze, x, y, d, chelp)
{
    var w = chelp.canvas.width;
    var h = chelp.canvas.height;
    var xc = w / 2;
    var yc = (this.fwd_limit + 1.5) * this.wall_length;

    chelp.SetBackground ("skyblue");
    chelp.SetForeground ("black");
    chelp.SetLineWidth (1);

    chelp.DrawFilledRect (0, 0, w, h);
    chelp.DrawSpot (xc + this.wall_length/2, yc - this.wall_length/2, 3, "red");

    var to_draw = maze.GetView (x, y, d, this.side_limit, this.fwd_limit);

    for (idx in to_draw)
    {
        var wall = to_draw[idx];
        var p1 = [xc + wall.x * this.wall_length, yc - wall.y * this.wall_length];

        if (wall.plane == "XZ")
        {
            chelpover.DrawLineRelative(p1, [this.wall_length,0]);
        }
        else if (wall.plane == "YZ")
        {
            chelpover.DrawLineRelative(p1, [0,-this.wall_length]);
        }
    }

}
SimpleSquareMaze.ForwardView = function (side_limit, fwd_limit, mapped_points, z_floor, z_ceiling)
{
    this.side_limit = side_limit;
    this.fwd_limit = fwd_limit;
    this.mapped_points = mapped_points;
    this.z_floor = z_floor;
    this.z_ceiling = z_ceiling;
}
SimpleSquareMaze.ForwardView.prototype.Draw = function (maze, x, y, d, chelp)
{
    var w = chelp.canvas.width;
    var h = chelp.canvas.height;

    chelp.SetBackground ("darkslategray");
    chelp.SetLineWidth (1);

    chelp.DrawFilledRect (0, 0, w, h);

    chelp.SetForeground ("black");
//    this.mapped_points.DrawXYPlaneToCanvas (chelp, this.z_floor);
//    this.mapped_points.DrawXYPlaneToCanvas (chelp, this.z_ceiling);

    var to_draw = maze.GetLevel (x, y, d, this.side_limit, this.fwd_limit, true);

    this.DrawSquares (to_draw, this.z_floor, chelp)

    to_draw = maze.GetLevel (x, y, d, this.side_limit, this.fwd_limit, false);

    this.DrawSquares (to_draw, this.z_ceiling, chelp)

    var to_draw = maze.GetView (x, y, d, this.side_limit, this.fwd_limit);

    this.DrawSquares (to_draw, this.z_floor, chelp)
}
SimpleSquareMaze.ForwardView.prototype.DrawSquares = function (to_draw, z, chelp)
{
    var squares = [];

    for (idx in to_draw)
    {
        var wall = to_draw[idx];
        var square = this.mapped_points.GetSquare (wall.plane, wall.x, wall.y, z);

        if (square)
        {
            square.SetColour (wall.colour);
            squares.push (square);
        }
    }

    squares.sort(function(a, b){return b.distance - a.distance});

    for (idx in squares)
    {
        this.mapped_points.DrawSquare (chelp, squares[idx]);
    }
}



