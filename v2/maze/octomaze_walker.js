
//==============================================================
OctoMazeWalker = function(maze, mapped_points, z_floor)
{
    this.maze = maze;
    this.location = this.maze.starting_point;
    this.facing = new Direction(this.maze.starting_dir);
    this.mapped_points = mapped_points;
    this.maze_floor = z_floor;
}
OctoMazeWalker.TURN_LEFT = 0;
OctoMazeWalker.MOVE_FORWARD = 1;
OctoMazeWalker.TURN_RIGHT = 2;
OctoMazeWalker.MOVE_LEFT = 3;
OctoMazeWalker.MOVE_BACK = 4;
OctoMazeWalker.MOVE_RIGHT = 5;
OctoMazeWalker.MOVE_45 = 6;        // relative NE
OctoMazeWalker.MOVE_135 = 7;       // relative SE
OctoMazeWalker.MOVE_225 = 8;       // relative SW
OctoMazeWalker.MOVE_315 = 9;       // relative NW


//------------------------------------------------------------------------------------------------------------------------------------
OctoMazeWalker.prototype.DrawOverhead = function (chelp, wall_length, side_ext, forward_ext)
{
    var w = chelp.canvas.width;
    var h = chelp.canvas.height;
    var x0 = w / 2;
    var y0 = h - 2 * wall_length;

    chelp.SetBackground ("skyblue");
    chelp.SetForeground ("black");
    chelp.SetLineWidth (1);

    chelp.DrawFilledRect (0, 0, chelp.canvas.width, chelp.canvas.height);

    var cells = this.GetVisibleCells (side_ext, forward_ext);
    var to_draw = this.GetWallsFromCells (cells, OctoMazeWalker.GET_2D_WALLS);

    chelp.DrawSpot (x0, y0, 2, "blue");

    for (idx in to_draw)
    {
        var wall = to_draw[idx];
        var pt1 = [x0 + wall_length * wall[0][0], y0 - wall_length * wall[0][1]];
        var pt2 = [x0 + wall_length * wall[1][0], y0 - wall_length * wall[1][1]];

        chelp.DrawLine (pt1, pt2);
    }
}

OctoMazeWalker.search_order = [Direction.W, Direction.E, Direction.NE, Direction.NW, Direction.N];
OctoMazeWalker.GET_2D_WALLS = 0;
OctoMazeWalker.GET_3D_WALLS = 1;
OctoMazeWalker.GET_FLOOR = 2;
OctoMazeWalker.GET_CEILING = 3;
//------------------------------------------------------------------------------------------------------------------------------------
OctoMazeWalker.prototype.GetVisibleCells = function (side_ext, forward_ext)
{
    Misc.Log ("---------------------------------------------- New View ---------------------------------------------------")

    var orientation = Direction.orientation [this.facing.d];
    var location = this.location;
    var draw_lattice_type = (location.shape_type == OctoPoints.OCTAGON) ? "Oct" : "Sq";
    var draw_lattice = draw_lattice_type + orientation;
    var square = location.shape_type == OctoPoints.SQUARE;
    var root = draw_lattice + "." + (square ? "S1" : "O1");
    var key = Key2D(root, 0, 0);
    var scrn = OctoPoints.shapes [key];

    if (! scrn) return;

    var xmax = side_ext * OctoPoints.v90;
    var xmin = -xmax;
    var ymax = forward_ext * OctoPoints.v90;
    var ymin = -0.5 * OctoPoints.v90;
    var visited = [];
    var list = [];
    var cells = [];
    var pov_mapping = Direction.pov_to_world[this.facing.d];
    var pos = 0;

    visited.push (location.key);
    list.push ([location, scrn, 0]);

    while (pos < list.length)
    {
        var current = list[pos];
        var location = current[0];
        var screen_cell = current[1];
        var distance = current[2];
        var maze_cell = this.maze.shapes [location.key];

        if (! maze_cell)
        {
            maze_cell = this.maze.SynthesiseExteriorCell (location);
        }

        cells.push ([maze_cell, screen_cell, distance])

        for (var screen_dir = 0 ; screen_dir < Direction.NUM ; ++screen_dir)
        {
            //var screen_dir = OctoMazeWalker.search_order [idx];
            var maze_dir = pov_mapping [screen_dir];
            var next_location = location.GetNeighbour(maze_dir);

            if (next_location)
            {
                var next_visited = visited.indexOf (next_location.key) >= 0;
                var wall = maze_cell.walls[maze_dir];

                // The next cell

                if (! next_visited && wall.CanViewThrough())
                {
                    visited.push (next_location.key);
                    var next_scrn = screen_cell.neighbours [screen_dir];

                    if (next_scrn && (next_scrn.xc >= xmin && next_scrn.xc <= xmax && next_scrn.yc > ymin && next_scrn.yc <= ymax))
                    {
                        var d2 = next_scrn.xc * next_scrn.xc + next_scrn.yc * next_scrn.yc;
                        list.push ([next_location, next_scrn, d2]);
                    }
                }
            }
        }
        ++pos;
    }
    return cells;
}

//------------------------------------------------------------------------------------------------------------------------------------
OctoMazeWalker.prototype.GetWallsFromCells = function (cells, mode)
{
    var orientation = Direction.orientation [this.facing.d];
    var location = this.location;
    var draw_lattice_type = (location.shape_type == OctoPoints.OCTAGON) ? "Oct" : "Sq";
    var draw_lattice = draw_lattice_type + orientation;
    var walls = [];
    var pov_mapping = Direction.pov_to_world[this.facing.d];

    // Bit of a hack because the perspective lets you see around the walls on the sides of a square

    if (mode == OctoMazeWalker.GET_3D_WALLS && draw_lattice == "Sq90")
    {
        var maze_cell = this.maze.shapes [location.key];
        if (maze_cell)
        {
            var left = pov_mapping [3];
            var right = pov_mapping [1];
            if (! maze_cell.walls[left].IsOpen ())
            {
                OctoPoints.left_wall.SetColour(maze_cell.walls[left].colour);
                walls.push (OctoPoints.left_wall);
            }
            if (! maze_cell.walls[right].IsOpen ())
            {
                OctoPoints.right_wall.SetColour(maze_cell.walls[right].colour);
                walls.push (OctoPoints.right_wall);
            }
        }
    }
    for (var pos in cells)
    {
        var x = cells [pos];

        var maze_cell = x[0];
        var screen_cell = x[1];

        // Floor and ceiling

        if (mode == OctoMazeWalker.GET_FLOOR)
        {
            if (maze_cell.floor_colour)
            {
                var plane = screen_cell.floor;
                plane.SetColour (maze_cell ? maze_cell.floor_colour : "DarkKhaki");
                walls.push (plane);
            }
        }
        else if (mode == OctoMazeWalker.GET_CEILING)
        {
            if (maze_cell.ceiling_colour)
            {
                var plane = screen_cell.ceiling;
                plane.SetColour (maze_cell.ceiling_colour);
                walls.push (plane);
            }
        }

        for (var idx in OctoMazeWalker.search_order)
        {
            var screen_dir = OctoMazeWalker.search_order [idx];
            var maze_dir = pov_mapping [screen_dir];
            var wall = maze_cell.walls[maze_dir];
            var is_passable = wall.IsPassable();

            // The walls

            if (mode == OctoMazeWalker.GET_3D_WALLS || mode == OctoMazeWalker.GET_2D_WALLS)
            {
                if (! wall.IsOpen())
                {
                    var wall2d = screen_cell.walls2d [screen_dir];

                    if (wall2d && (wall2d[0][1] >= 0.01 || wall2d[1][1] >= 0.01))
                    {
                        if (mode == OctoMazeWalker.GET_3D_WALLS)
                        {
                            var wall3d = screen_cell.walls3d [screen_dir];

                            if (wall.IsDoorway ())
                            {
                                wall3d = wall3d.MakeDoorway (0.5, 0.75);
                            }
                            wall3d.SetColour(maze_cell.walls[maze_dir].colour);
                            walls.push (wall3d);
                        }
                        else if (!is_passable)
                        {
                            walls.push (wall2d);
                        }
                    }
                }
            }
        }
        if (mode == OctoMazeWalker.GET_3D_WALLS && maze_cell.item)
        {
            Misc.Log ("Item: maze = {0}, screen = {1}, item = {2}", maze_cell, screen_cell, maze_cell.item);
            var pts3d = screen_cell.TranslatePoints (this.maze_floor, this.facing.d, maze_cell.item.points);
            var planes = maze_cell.item.MakePlanes (pts3d, this.mapped_points);
            for (var p in planes)
            {
                walls.push (planes[p]);
            }
        }
    }
    return walls;
}
//------------------------------------------------------------------------------------------------------------------------------------
OctoMazeWalker.prototype.DrawPOV = function (chelp, side_ext, forward_ext)
{
    console.clear();
    chelp.SetBackground ("midnightblue");
    chelp.SetForeground ("black");
    chelp.SetLineWidth (1);

    chelp.DrawFilledRect (0, 0, chelp.canvas.width, chelp.canvas.height);

    var cells = this.GetVisibleCells (side_ext, forward_ext);


    var floor = this.GetWallsFromCells (cells, OctoMazeWalker.GET_FLOOR);
    var ceiling = this.GetWallsFromCells (cells, OctoMazeWalker.GET_CEILING);
    var walls = this.GetWallsFromCells (cells, OctoMazeWalker.GET_3D_WALLS);

    this.DrawPovElements (chelp, floor);
    this.DrawPovElements (chelp, ceiling);
    this.DrawPovElements (chelp, walls);


}
//------------------------------------------------------------------------------------------------------------------------------------
OctoMazeWalker.prototype.DrawPovElements = function (chelp, list)
{
    Misc.Log ("------------------------------------------- Walls -------------------------------------------");

    list.sort(function(a, b){return b.distance - a.distance});

    for (idx in list)
    {
        if (list[idx].points.length == 3)
        {
            Misc.Log ("{0}: ({1},{2}}) ({3},{4}) ({5},{6}), d = {7}", idx,
                      list[idx].points[0][0],list[idx].points[0][1],
                      list[idx].points[1][0],list[idx].points[1][1],
                      list[idx].points[2][0],list[idx].points[2][1], list[idx].distance) ;
        }
        chelp.SetBackground (list[idx].fill);
        chelp.DrawPolygon (list[idx].points);
    }
}
//------------------------------------------------------------------------------------------------------------------------------------

OctoMazeWalker.prototype.DrawShapes = function (chelp, wall_length, side_ext, forward_ext)
{
    var to_draw = this.GetVisibleShapes (side_ext, forward_ext);

    this.DrawShapeList (chelp, to_draw, wall_length);
}

//------------------------------------------------------------------------------------------------------------------------------------
OctoMazeWalker.prototype.DrawShapeList = function (chelp, shape_keys, wall_length)
{
    var w = chelp.canvas.width;
    var h = chelp.canvas.height;
    var x0 = w / 2;
    var y0 = h - 2 * wall_length;

    chelp.SetBackground ("yellow");
    chelp.SetForeground ("black");
    chelp.SetLineWidth (1);

    chelp.DrawFilledRect (0, 0, chelp.canvas.width, chelp.canvas.height);
    chelp.DrawSpot (x0, y0, 2, "red");


    for (idx in shape_keys)
    {
        var scrn = OctoPoints.shapes [shape_keys [idx]];

        var draw_points = [];
        var pt1 = [x0 + wall_length * scrn.xc, y0 - wall_length * scrn.yc];

        for (var i in scrn.points)
        {
            var pt3 = [x0 + wall_length * scrn.points[i][0], y0 - wall_length * scrn.points[i][1]];
            chelp.SetForeground ("green");
            chelp.DrawLine (pt1, pt3);

            draw_points.push(pt3);
        }
        chelp.SetForeground ("black");
        chelp.SetBackground ("transparent");
        chelp.DrawPolygon (draw_points)
        chelp.SetForeground ("red");

        for (var i = 0 ; i < scrn.neighbours.length ; ++i)
        {
            var neighbour = scrn.neighbours [i];

            if (neighbour)
            {
                var pt2 = [x0 + wall_length * neighbour.xc, y0 - wall_length * neighbour.yc];
                Misc.Log ("Neighbour = {0}, Pt1 = ({1}), Pt2 = ({2})", i, pt1, pt2)

                chelp.DrawLine (pt1, pt2);
            }

        }

        chelp.SetForeground ("black");
        chelp.DrawPolygon (draw_points)
    }
}


// Determines which of the above walls to draw depending on the cells position relative to the viewer

OctoMazeWalker.MASK_LEFT = 0;
OctoMazeWalker.MASK_FORWARD = 1;
OctoMazeWalker.MASK_RIGHT = 2;

OctoMazeWalker.wall_masks = new Array (3);
OctoMazeWalker.wall_masks [OctoMazeWalker.MASK_LEFT] = [Direction.W,Direction.NW,Direction.N];
OctoMazeWalker.wall_masks [OctoMazeWalker.MASK_FORWARD] = [Direction.W,Direction.NW,Direction.N,Direction.NE,Direction.E];
OctoMazeWalker.wall_masks [OctoMazeWalker.MASK_RIGHT] = [Direction.N,Direction.NE,Direction.E];

//------------------------------------------------------------------------------------------------------------------------------------
OctoMazeWalker.prototype.Move = function (opt)
{
    if (opt == OctoMazeWalker.TURN_LEFT)
    {
        this.facing.TurnLeft45();
        return true;
    }
    if (opt == OctoMazeWalker.TURN_RIGHT)
    {
        this.facing.TurnRight45();
        return true;
    }

    if (opt == OctoMazeWalker.MOVE_FORWARD)
    {
        return this.Walk (this.facing);
    }

    if (opt == OctoMazeWalker.MOVE_BACK)
    {
        return this.Walk (this.facing.GetReverse ());
    }

    if (opt == OctoMazeWalker.MOVE_LEFT)
    {
        return this.Walk (this.facing.GetLeft90 ());
    }
    if (opt == OctoMazeWalker.MOVE_RIGHT)
    {
        return this.Walk (this.facing.GetRight90 ());
    }
    if (opt == OctoMazeWalker.MOVE_45)
    {
        return this.Walk (this.facing.GetRight45 ());
    }
    if (opt == OctoMazeWalker.MOVE_135)
    {
        return this.Walk (this.facing.GetRight135 ());
    }
    if (opt == OctoMazeWalker.MOVE_225)
    {
        return this.Walk (this.facing.GetLeft135 ());
    }
    if (opt == OctoMazeWalker.MOVE_315)
    {
        return this.Walk (this.facing.GetLeft45 ());
    }


    return false;
}
//------------------------------------------------------------------------------------------------------------------------------------
OctoMazeWalker.prototype.Walk = function (walk_direction)
{
    // If the cell is null we are on the infinite plane outsize the maze

    var current_cell = this.maze.shapes[this.location.key];

    if (! current_cell)
    {
        current_cell = this.maze.SynthesiseExteriorCell (this.location);
    }

    if (! current_cell.walls[walk_direction.d].IsPassable())
    {
        Misc.Log ("Direction {0} is blocked", walk_direction.d);
        return false;
    }

    this.location = this.location.GetNeighbour (walk_direction.d);
    return true;
}

