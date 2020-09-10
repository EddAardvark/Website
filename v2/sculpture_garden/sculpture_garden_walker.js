//-------------------------------------------------------------------------------------------------
// Implements an observer inside the sculpture garden
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

//=================================================================================================
SculptureGarden.Walker = function()
{
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Walker.TURN_LEFT = 0;
SculptureGarden.Walker.MOVE_FORWARD = 1;
SculptureGarden.Walker.TURN_RIGHT = 2;
SculptureGarden.Walker.MOVE_LEFT = 3;
SculptureGarden.Walker.MOVE_BACK = 4;
SculptureGarden.Walker.MOVE_RIGHT = 5;
SculptureGarden.Walker.MOVE_45 = 6;        // relative NE
SculptureGarden.Walker.MOVE_135 = 7;       // relative SE
SculptureGarden.Walker.MOVE_225 = 8;       // relative SW
SculptureGarden.Walker.MOVE_315 = 9;       // relative NW

SculptureGarden.Walker.fwd_search = [Direction.W, Direction.E, Direction.NE, Direction.NW, Direction.N];

//-------------------------------------------------------------------------------------------------
SculptureGarden.Walker.prototype.Initialise = function(garden, mapped_points, z_floor)
{
    this.garden = garden;
    this.mapped_points = mapped_points;
    this.z_floor = z_floor;
    this.position = garden.start_point;
    this.facing = garden.start_view;
    this.radar_width = 120;
    this.radar_height = 90;
    this.radar_len = 6;
    this.radar_side = 4;
    this.radar_fwd = 6;
    this.current_artwork = null;
    this.animated = false;
}
//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.Walker.prototype.DrawPOV = function (chelp, side_ext, forward_ext)
{
    this.animated = false;  // Only set when we encounter an animated item

    chelp.SetBackground ("midnightblue");
    chelp.SetForeground ("black");
    chelp.SetLineWidth (1);

    chelp.DrawFilledRect (0, 0, chelp.canvas.width, chelp.canvas.height);

    var cells = this.GetVisibleCells (side_ext, forward_ext);

    var floor = this.GetWallsFromCells (cells, SculptureGarden.Walker.GET_FLOOR);

    floor = floor.concat (this.GetWallsFromCells (cells, SculptureGarden.Walker.GET_CEILING));
    floor = floor.concat (this.GetWallsFromCells (cells, SculptureGarden.Walker.GET_WALLS));

    this.DrawPovElements (chelp, floor);

    var x0 = chelp.canvas.width - 2 - this.radar_width;
    var y0 = chelp.canvas.height - 2;

    this.DrawRadar (chelp, x0, y0);
}
//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.Walker.prototype.DrawRadar = function (chelp, xpos, ypos)
{
    var x0 = xpos + this.radar_width / 2;
    var y0 = ypos - 2 * this.radar_len;

    chelp.SetLineWidth (1);

    var cells = this.GetVisibleCells (this.radar_side, this.radar_fwd);

    for (idx in cells)
    {
        var cell = cells[idx];
        if (cell.maze_cell.type != SculptureGarden.Cell.SOLID)
        {
            var colour = cell.maze_cell.GetTypeColour ();

            if (colour)
            {
                var scrn = cell.screen_cell;
                chelp.SetForeground ("black");

                var new_points = new Array (scrn.points.length);

                for (var idx in scrn.points)
                {
                    var x = x0 + this.radar_len * scrn.points[idx][0];
                    var y = y0 - this.radar_len * scrn.points[idx][1];
                    new_points [idx] = [x,y];
                }
                chelp.SetBackground (colour);
                chelp.DrawPolygon (new_points);
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.Walker.prototype.SelectCurrentArt = function ()
{
    this.current_artwork = null;

    var wall_pos = this.position.Neighbour (this.facing.d);
    if (wall_pos)
    {
        var maze_cell = this.garden.GetCellAt (wall_pos);

        if (maze_cell && maze_cell.artwork)
        {
            var wall_dir = Direction.turn_around [this.facing.d];
            this.current_artwork = maze_cell.artwork[wall_dir];
        }
    }
}

SculptureGarden.Walker.search_order = [Direction.W, Direction.E, Direction.NE, Direction.NW, Direction.N];
SculptureGarden.Walker.GET_WALLS = 1;
SculptureGarden.Walker.GET_FLOOR = 2;
SculptureGarden.Walker.GET_CEILING = 3;
//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.Walker.prototype.GetVisibleCells = function (side_ext, forward_ext)
{
    // A list of maze cells:
    // We start at the current location and look for adjacent visible cells in the forward direction
    // We also return the matching screen cell.

    var pov_mapping = Direction.pov_to_world[this.facing.d];
    var fwd_dir = SculptureGarden.Walker.fwd_search.map (x => pov_mapping [x]);
    var orientation = Direction.orientation [this.facing.d];
    var position = this.position;
    var square = position.shape_type == OctoPoints.SQUARE;
    var draw_lattice_type = (position.shape_type == OctoPoints.OCTAGON) ? "Oct" : "Sq";
    var draw_lattice = draw_lattice_type + orientation;
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
    var ret = {};
    var list_pos = 0;
    var maze_cell = this.garden.GetCellAt (position);

    visited.push (position.key);
    list.push ([maze_cell, scrn]);

    // First find the open cells

    var counter = 0;
    while (list_pos < list.length)
    {
        var current = list[list_pos];

        maze_cell = current[0];

        var pos = maze_cell.position;
        var screen_cell = current[1];

        ret [maze_cell.position.key] = {"maze_cell":maze_cell, "screen_cell":screen_cell};

        for (var idx in SculptureGarden.Walker.fwd_search)
        {
            var screen_dir = SculptureGarden.Walker.fwd_search [idx];
            var maze_dir = fwd_dir [idx];
            var next_location = pos.Neighbour(maze_dir);

            if (next_location)
            {
                var next_maze = this.garden.GetCellAt (next_location);

                if (next_maze.IsViewable ())
                {
                    var next_visited = visited.indexOf (next_location.key) >= 0;

                    if (! next_visited)
                    {
                        visited.push (next_location.key);
                        var next_scrn = screen_cell.neighbours [screen_dir];

                        if (next_scrn && (next_scrn.xc >= xmin && next_scrn.xc <= xmax && next_scrn.yc > ymin && next_scrn.yc <= ymax))
                        {
                            var d2 = next_scrn.d2; //next_scrn.xc * next_scrn.xc + next_scrn.yc * next_scrn.yc;
                            list.push ([next_maze, next_scrn, d2]);
                        }
                    }
                }
            }
            ++counter;
        }
        ++list_pos;
    }
    return ret;
}
//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.Walker.prototype.DrawPovElements = function (chelp, list)
{
    list.sort(function(a, b){return b.plane.distance - a.plane.distance});

    for (idx in list)
    {
        var wall = list[idx].plane;
        var artwork = list[idx].artwork;
        chelp.SetForeground ("black");
        chelp.SetBackground (wall.fill);
        chelp.DrawPolygon (wall.points);
        if (artwork)
        {
            var position = artwork.GetHangingParameters ();
            var shape = wall.GetWindowRect (...position);

            artwork.DrawInShape (chelp, shape);
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.Walker.prototype.DrawShapes = function (chelp, wall_length, side_ext, forward_ext)
{
    var to_draw = this.GetVisibleShapes (side_ext, forward_ext);

    this.DrawShapeList (chelp, to_draw, wall_length);
}
//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.Walker.prototype.GetWallsFromCells = function (cells, mode)
{
    var orientation = Direction.orientation [this.facing.d];
    var location = this.position;
    var draw_lattice_type = (location.shape_type == OctoPoints.OCTAGON) ? "Oct" : "Sq";
    var draw_lattice = draw_lattice_type + orientation;
    var ret = [];
    var pov_mapping = Direction.pov_to_world[this.facing.d];
    var door_dir = SculptureGarden.Walker.fwd_search.map (x => pov_mapping [x]);

    for (var pos in cells)
    {
        var cell = cells [pos];

        var maze_cell = cell.maze_cell;
        var screen_cell = cell.screen_cell;

        // Floor and ceiling

        if (mode == SculptureGarden.Walker.GET_FLOOR)
        {
            if (screen_cell.visible && ! maze_cell.IsSolid ())
            {
                var colour = maze_cell.floor_colour;
                if (colour)
                {
                    var plane = screen_cell.floor;

                    plane.SetColour (colour);
                    ret.push ({"plane":plane});
                }
            }
        }
        else if (mode == SculptureGarden.Walker.GET_CEILING)
        {
            if (screen_cell.visible && ! maze_cell.IsSolid ())
            {
                var colour = maze_cell.sky_colour;
                if (colour)
                {
                    var plane = screen_cell.ceiling;
                    plane.SetColour (colour);
                    ret.push ({"plane":plane});
                }
            }
        }
        var is_passable = maze_cell.IsPassable();
        var has_walls = maze_cell.HasWalls();

        // The walls

        if (has_walls && mode == SculptureGarden.Walker.GET_WALLS && screen_cell.visible)
        {
            //for (var screen_dir = 0 ; screen_dir < 8 ; ++ screen_dir)
            var ways = [1,5,2,6,3];
            for (idx in ways)
            {
                var screen_dir = ways[idx];
                var wall2d = screen_cell.walls2d [screen_dir];
                if (wall2d && (wall2d[0][1] >= 0.01 || wall2d[1][1] >= 0.01))
                {
                    var maze_dir = pov_mapping [screen_dir];
                    var wall3d = screen_cell.walls3d [screen_dir];
                    var artwork = null;

                    if (wall3d.visible)
                    {
                        wall3d.SetColour(maze_cell.wall_colour [maze_dir]);
                        if (maze_cell.artwork && maze_cell.artwork [maze_dir])
                        {
                            artwork = maze_cell.artwork [maze_dir];
                        }
                        ret.push ({"plane":wall3d, "artwork":artwork});
                    }
                }
            }
        }
        // Doorways

        if (! has_walls && mode == SculptureGarden.Walker.GET_WALLS && screen_cell.visible)
        {
            // Doorways (at the transition between two open cell types)

            for (var idx in door_dir)
            {
                var pos2 = maze_cell.position.Neighbour (door_dir[idx]);

                if (pos2)
                {
                    var neighbour = cells [pos2.key];

                    if (neighbour && neighbour.screen_cell.visible)
                    {
                        var ntype = neighbour.maze_cell.type;

                        if (ntype != maze_cell.type)
                        {
                            var door_params = (screen_cell.d2 < neighbour.screen_cell.d2)
                                                    ? SculptureGarden.Cell.GetDoorParameters (maze_cell.type, ntype)
                                                    : SculptureGarden.Cell.GetDoorParameters (ntype, maze_cell.type);

                            if (door_params)
                            {
                                var wall3d = screen_cell.walls3d [SculptureGarden.Walker.fwd_search[idx]];
                                if (wall3d && wall3d.visible)
                                {
                                    var panels = door_params.Construct (wall3d);
                                    for (var idx in panels)
                                    {
                                        ret.push ({"plane":panels[idx]});
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Items (on a level with walls)

        if (maze_cell.items && mode == SculptureGarden.Walker.GET_WALLS)
        {
            for (var idx in maze_cell.items)
            {
                var item = maze_cell.items[idx];

                if (item.animated)
                {
                    this.animated = true;
                    item.Animate ();
                }

                var pts3d = screen_cell.TranslatePoints (this.z_floor, this.facing.d, item.points);
                var planes = item.MakePlanes (pts3d, this.mapped_points);

                for (var p in planes)
                {
                    ret.push ({"plane":planes[p]});
                }
            }
        }
    }
    return ret;
}

// Determines which of the above walls to draw depending on the cells position relative to the viewer

SculptureGarden.Walker.MASK_LEFT = 0;
SculptureGarden.Walker.MASK_FORWARD = 1;
SculptureGarden.Walker.MASK_RIGHT = 2;

SculptureGarden.Walker.wall_masks = new Array (3);
SculptureGarden.Walker.wall_masks [SculptureGarden.Walker.MASK_LEFT] = [Direction.W,Direction.NW,Direction.N];
SculptureGarden.Walker.wall_masks [SculptureGarden.Walker.MASK_FORWARD] = [Direction.W,Direction.NW,Direction.N,Direction.NE,Direction.E];
SculptureGarden.Walker.wall_masks [SculptureGarden.Walker.MASK_RIGHT] = [Direction.N,Direction.NE,Direction.E];

//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.Walker.prototype.Move = function (opt)
{
    if (opt == SculptureGarden.Walker.TURN_LEFT)
    {
        this.facing.TurnLeft45();
        return true;
    }
    if (opt == SculptureGarden.Walker.TURN_RIGHT)
    {
        this.facing.TurnRight45();
        return true;
    }
    if (opt == SculptureGarden.Walker.MOVE_FORWARD)
    {
        return this.Walk (this.facing);
    }
    if (opt == SculptureGarden.Walker.MOVE_BACK)
    {
        return this.Walk (this.facing.GetReverse ());
    }
    if (opt == SculptureGarden.Walker.MOVE_LEFT)
    {
        return this.Walk (this.facing.GetLeft90 ());
    }
    if (opt == SculptureGarden.Walker.MOVE_RIGHT)
    {
        return this.Walk (this.facing.GetRight90 ());
    }
    if (opt == SculptureGarden.Walker.MOVE_45)
    {
        return this.Walk (this.facing.GetRight45 ());
    }
    if (opt == SculptureGarden.Walker.MOVE_135)
    {
        return this.Walk (this.facing.GetRight135 ());
    }
    if (opt == SculptureGarden.Walker.MOVE_225)
    {
        return this.Walk (this.facing.GetLeft135 ());
    }
    if (opt == SculptureGarden.Walker.MOVE_315)
    {
        return this.Walk (this.facing.GetLeft45 ());
    }

    return false;
}
//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.Walker.prototype.Walk = function (walk_direction)
{
    // If the cell is null we are on the infinite plane outsize the garden

    var next_position = this.position.Neighbour (walk_direction.d);
    if (! next_position )
    {
        Misc.Log ("Direction {0} is invalid", walk_direction.d);
        return false;
    }
    var next_cell = this.garden.GetCellAt (next_position);

    if (next_cell && ! next_cell.IsPassable ())
    {
        Misc.Log ("Direction {0} is blocked", walk_direction.d);
        return false;
    }

    this.position = next_position;
    return true;
}

