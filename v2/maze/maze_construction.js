//-------------------------------------------------------------------------------------------------
// Javascript Maze class definition. A 3d maze consisting of rooms, tunnels and shafts.
// (c) John Whitehouse 2013
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

var WIDTH = 81;         // floor width
var HEIGHT = 45;        // floor height
var DEPTH = 12;         // number of floors

var NORTH = 0;
var SOUTH = 1;
var EAST = 2;
var WEST = 3;
var NORTH_EAST = 4;
var NORTH_WEST = 5;
var SOUTH_EAST = 6;
var SOUTH_WEST = 7;

var DIG_NOWHERE = 0;
var DIG_FORWARD = 1;
var DIG_LEFT = 2;
var DIG_RIGHT = 3;
var DIG_DOWN_FORWARD = 4;
var DIG_DOWN_LEFT = 5;
var DIG_DOWN_RIGHT = 6;
var DIG_DOWN_REVERSE = 7;
var DIG_UP_FORWARD = 8;
var DIG_UP_LEFT = 9;
var DIG_UP_RIGHT = 10;
var DIG_UP_REVERSE = 11;

DirectionName = ["N", "S", "E", "W", "NE", "NW", "SE", "SW"];

var ROOM_FREQUENCY = 7;
var BLOCK_FREQUENCY = 12;
var ROCK_FREQUENCY = 100;
var SPECIAL_ROOM_FREQUENCY = 12;
var RANDOM_COUNT = 20;
var CONNECTED_COUNT = 10;

// S/E = 1, N/W = -1

var vector_x = [0, 0, 1, -1, 1, -1, 1, -1];
var vector_y = [-1, 1, 0, 0, -1, -1, 1, 1];

var FLOOR_AREA = WIDTH * HEIGHT;
var VOLUME = WIDTH * HEIGHT * DEPTH;

var MIN_ROOM_WIDTH = 2;
var MIN_ROOM_HEIGHT = 2;
var MAX_ROOM_WIDTH = 20;
var MAX_ROOM_HEIGHT = 14;

var gems =
[
    [ITEM_WHITE_GEM, 2],
    [ITEM_RED_GEM, 5],
    [ITEM_GREEN_GEM, 10],
    [ITEM_BLUE_GEM, 20],
    [ITEM_YELLOW_GEM, 50]
];

var flags =
[
    [ITEM_GREEN_FLAG, 4],
    [ITEM_BLUE_FLAG, 10],
    [ITEM_RED_FLAG, 20],
];

var NUM_GEM_TYPES = gems.length;
var NUM_FLAG_TYPES = flags.length;

// Adjacent cells on the same floor

var nsew = [1, -1, WIDTH, -WIDTH];
var all8 = [1, -1, WIDTH, -WIDTH, WIDTH+1, WIDTH-1, -WIDTH+1, -WIDTH-1];
var diag4 = [WIDTH+1, WIDTH-1, -WIDTH+1, -WIDTH-1];

//-------------------------------------------------------------------------------------------------
// Create some corridors - continues until the maze is connected
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.CreateCorridors = function ()
{
    // Create a route from start to end

    var random_count = 1 + RandomInteger (RANDOM_COUNT);
    var connected_count = 1 + RandomInteger (CONNECTED_COUNT);

    // Add a mixture of random and conntected corridrors

    while (! this.connected)
    {
        var counter = 0;

        while (! this.connected && counter < random_count)
        {
            this.AddRandomCorridor ();
            counter ++;
        }

        counter = 0;

        while (! this.connected && counter < connected_count)
        {
            var n = RandomInteger (this.reachable_cells.length);
            var pos = this.reachable_cells [n];

            this.AddCorridor (pos);
            counter ++;
        }
    }
}
//-------------------------------------------------------------------------------------------------
// Create some rooms - should only be called once on an empty maze.
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.CreateRooms = function (frequency, special_freq)
{
    var floor = 0;

    while (floor < DEPTH)
    {
        if (RandomInteger (frequency) == 0)
        {
            ++floor;

            while (floor < DEPTH-1)
            {
                if (RandomInteger (special_freq) != 0)
                {
                    break;
                }
                MakeSpecialRoom (this.cells, floor, WIDTH, HEIGHT);
                ++ floor;
            }
        }
        else
        {
            w = MIN_ROOM_WIDTH + RandomInteger (MAX_ROOM_WIDTH - MIN_ROOM_WIDTH);
            h = MIN_ROOM_HEIGHT + RandomInteger (MAX_ROOM_HEIGHT - MIN_ROOM_HEIGHT);
            x = 2 + RandomInteger (WIDTH - w - 4);
            y = 2 + RandomInteger (HEIGHT - h - 4);

            ++ this.num_rooms;
            this.SetRoomCells (floor, x, y, w, h);
        }
    }
}
//-------------------------------------------------------------------------------------------------
// Create the start and end points.
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.CreateEndPoints = function ()
{
    // The start room

    var w = 3;
    var h = 3;
    var x = 2 + RandomInteger (WIDTH - w - 4);
    var y = 2 + RandomInteger (HEIGHT - h - 4);

    this.start_pos = WIDTH * (y + 1) + x + 1;
    this.cells [this.start_pos].special = SPECIAL_START;
    this.SetRoomCells (0, x, y, w, h);

    this.TagCell (this.start_pos, START_TAG);

    // The end room

    var x = 2 + RandomInteger (WIDTH - w - 4);
    var y = 2 + RandomInteger (HEIGHT - h - 4);

    this.end_pos = FLOOR_AREA * (DEPTH - 1) + WIDTH * (y + 1) + x + 1;
    this.cells [this.end_pos].special = SPECIAL_END;
    this.SetRoomCells (DEPTH - 1, x, y, w, h);
    this.num_rooms += 2;
    this.TagCell (this.end_pos, END_TAG);

    this.AddCorridor (this.start_pos);
    this.AddCorridor (this.end_pos);
}
//-------------------------------------------------------------------------------------------------
// Create some blocks - 3x3 walled areas. Should be drawn before corridors are added.
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.CreateBlocks = function (frequency)
{
    var floor = 0;

    while (true)
    {
        if (RandomInteger (frequency) == 0)
        {
            ++floor;

            if (floor >= DEPTH)
            {
                break;
            }
        }

        var x0 = 1 + RandomInteger (WIDTH - 4);
        var y0 = 1 + RandomInteger (HEIGHT - 4);
        ++ this.num_blocks;

        for (var y = 0 ; y < 3 ; ++y)
        {
            var pos = FLOOR_AREA * floor + WIDTH * (y + y0) + x0;

            for (var x = 0 ; x < 3 ; ++x)
            {
                this.cells [pos].type = (x == 1 && y == 1) ? CELL_ROCK : CELL_WALL;
                this.cells [pos].special = SPECIAL_NONE;
                ++pos;
            }
        }
    }
}
//-------------------------------------------------------------------------------------------------
// Creates a room, clears an area 1 larger than the new room and then places this room in the
// space
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.SetRoomCells = function (floor, x, y, w, h)
{
    var floor_pos = FLOOR_AREA * floor;

    for (var i = -1 ; i <= h ; ++i)
    {
        var pos = floor_pos + WIDTH * (y + i) + x;
        var is_wall = i == -1 || i == h;

        for (var j = -1 ; j <= w ; ++j)
        {
            var is_wall2 = j == -1 || j == w;
            var cell = this.cells [pos + j];

            if (is_wall || is_wall2)
            {
                // Don't impose walls on a pre-existing room

                if (cell.type != CELL_ROOM)
                {
                    cell.type = CELL_WALL;
                }
            }
            else
            {
                cell.type = CELL_ROOM;
            }
        }
    }
}
//-------------------------------------------------------------------------------------------------
// Create a random corridor
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.AddRandomCorridor = function ()
{
    var pos = RandomInteger (VOLUME);

    this.AddCorridor (pos);
}
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.AddGems = function ()
{
    for (var i = 0 ; i < NUM_GEM_TYPES ; ++i)
    {
        var gem = gems [i][0];
        var freq = gems [i][1];

        while (RandomInteger (freq) != 0)
        {
            var pos = RandomInteger (VOLUME);

            if (this.cells [pos].type == CELL_ROCK)
            {
                this.cells [pos].items.push (new MazeItem (gem));
            }
        }
    }
}
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.AddFlags = function ()
{
    for (var i = 0 ; i < NUM_FLAG_TYPES ; ++i)
    {
        var flag = flags [i][0];
        var freq = flags [i][1];

        while (RandomInteger (freq) != 0)
        {
            var pos = RandomInteger (VOLUME);

            if (this.cells [pos].IsFree ())
            {
                this.cells [pos].items.push (new MazeItem (flag));
            }
        }
    }
}
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.AddSolidRock = function (frequency)
{
    var floor = 0;

    while (true)
    {
        if (RandomInteger (frequency) == 0)
        {
            ++floor;

            if (floor >= DEPTH)
            {
                break;
            }
        }

        var pos = RandomInteger (VOLUME);

        if (this.cells [pos].type == CELL_ROCK)
        {
            this.cells [pos].type = CELL_SOLID_ROCK;
            ++ this.num_rocks;
        }
    }
}
//-------------------------------------------------------------------------------------------------
// Create a random corridor
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.AddCorridor = function (pos)
{
    var state = MakeState (pos, RandomInteger (4), this.cells [pos].tag);

    if (this.cells [pos].type == CELL_ROOM)
    {
        state = this.StartRoomCorridor (state);
    }
    else if (this.cells [pos].type == CELL_CORRIDOR && this.cells [pos].special == SPECIAL_NONE)
    {
        state = this.StartCorridorCorridor (state);
    }
    else if (this.cells [pos].type == CELL_ROCK)
    {
        state = this.StartRockCorridor (state);
    }
    else
    {
        return;
    }

    this.ContinueCorridor (state);
}
//-------------------------------------------------------------------------------------------------
// Start a corridor from a room, picks a ramdom direction and traces it's way to the edge.
// Returns null if the corridor can't be startd, or a tuple (pos, tag, x, y, floor, dx, dy)
// if it can.
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.StartRoomCorridor = function (state)
{
    if (this.cells [state.pos].type != CELL_ROOM)
    {
        return null;
    }

    // Trace it to the edge

    while (this.cells [state.pos].type == CELL_ROOM)
    {
        MoveForward (state);
    }

    // all three exit cells must be walls

    var left_pos = state.pos + state.dx * WIDTH - state.dy;
    var right_pos = state.pos - state.dx * WIDTH + state.dy;

    if (this.cells [state.pos].type != CELL_WALL || this.cells [left_pos].type != CELL_WALL
            || this.cells [right_pos].type != CELL_WALL)
    {
        return null;
    }

    // Next cell must be rock

    var forward = state.pos + WIDTH * state.dy + state.dx;

    if (! this.cells [forward].type == CELL_ROCK)
    {
        return null;
    }

    this.cells [state.pos].type = CELL_CORRIDOR;
    this.cells [state.pos].special = SPECIAL_DOOR;
    this.cells [state.pos].tag = state.tag;

    MoveForward (state);
    return state;
}
//-------------------------------------------------------------------------------------------------
// Start a corridor from another corridor.
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.StartCorridorCorridor = function (state)
{
    moves = this.GetPossibleMoves (state, false);

    if (this.cells [state.pos].type != CELL_CORRIDOR)
    {
        return null;
    }

    MoveForward (state);

    if (this.cells [state.pos].type != CELL_ROCK)
    {
        return null;
    }
    return state;
}
//-------------------------------------------------------------------------------------------------
// Start a corridor from a rock square.
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.StartRockCorridor = function (state)
{
    var finished = false;

    // If the potential start abuts an existing corridor try again

    for (var i = 0 ; i < 8 ; ++i)
    {
        var p2 = state.pos + all8 [i];

        if (this.cells [p2].type == CELL_CORRIDOR)
        {
            return null;
        }
    }

    this.SetCorridorCell (state.pos, state.tag);

    moves = this.GetPossibleMoves (state, false);

    if (moves.indexOf(DIG_FORWARD) == -1)
    {
        return null;
    }

    return state;
}
//-------------------------------------------------------------------------------------------------
// Extend the corridor until we hit something
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.ContinueCorridor = function (state)
{
    if (state == null)
    {
        return;
    }

    this.num_corridors += 1;

    while (true)
    {
        if (state == null)
        {
            return;
        }

        this.SetCorridorCell (state.pos, state.tag);

        if (state.tag == START_TAG)
        {
            this.reachable_cells.push (state.pos);
        }

        moves = this.GetPossibleMoves (state, true);

        var forward_possible = moves.indexOf(DIG_FORWARD) != -1;

        // Continue of turn?

        if (forward_possible && RandomInteger (10) != 0)
        {
            state = this.MakeMove (state, [DIG_FORWARD]);
        }
        else
        {
            state = this.MakeMove (state, moves);
        }
    }
}
//-------------------------------------------------------------------------------------------------
// See what moves are possible. If no move is possible (or we've joined up with a previous part
// of the maze) we return null, otherwise a list of possibilities will be returned.
// We want to avoid:
//      - digging solid rock
//      - digging along a wall
//      - leaving the maze
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.GetPossibleMoves = function (state, allow_levels)
{
    // Have we joined up with existing passages.

    var fwd_pos = state.pos + state.dy * WIDTH + state.dx;
    var left_pos = state.pos + state.dx * WIDTH - state.dy;
    var right_pos = state.pos - state.dx * WIDTH + state.dy;
    var cells = [fwd_pos, left_pos, right_pos];

    if (this.CheckAdjacentCells (state.pos, cells, true))
    {
        return [DIG_NOWHERE];
    }

    // If we can diagonnaly connect to a previous corridor then do it.

    if (this.cells [fwd_pos] == CELL_CORRIDOR)
    {
        var fwd_left_pos = fwd_pos + state.dx * WIDTH - state.dy;
        var fwd_right_pos = fwd_pos - state.dx * WIDTH + state.dy;

        if (this.cells [fwd_left_pos] == CELL_CORRIDOR || this.cells [fwd_right_pos] == CELL_CORRIDOR)
        {
            return [DIG_FORWARD];
        }
    }

    // Otherwise explore the standard possibilities

    var fwd2_pos = fwd_pos + state.dy * WIDTH + state.dx;
    var left2_pos = left_pos + state.dx * WIDTH - state.dy;
    var right2_pos = right_pos - state.dx * WIDTH + state.dy;
    var up_pos = state.pos - FLOOR_AREA;
    var down_pos = state.pos + FLOOR_AREA;
    var moves = new Array ();

    // Forward, left and right: rock or a room wall

    if (this.ProgressPossible (fwd_pos, fwd2_pos))
    {
        moves.push (DIG_FORWARD);
    }

    if (this.ProgressPossible (left_pos, left2_pos))
    {
        moves.push (DIG_LEFT);
    }

    if (this.ProgressPossible (right_pos, right2_pos))
    {
        moves.push (DIG_RIGHT);
    }

    if (allow_levels)
    {
        // Down options

        if (down_pos < VOLUME)
        {
            var down_spcl = this.cells [down_pos].special;
            var down_type = this.cells [down_pos].type;

            // If the down cell is free only add forward as the next move will complete the tunnel

            if (down_type == CELL_ROOM || down_type == CELL_CORRIDOR)
            {
                if (down_spcl == SPECIAL_NONE)
                {
                    moves.push (DIG_DOWN_FORWARD);
                }
            }
            else if (down_type == CELL_ROCK)
            {
                var d_fwd_pos = down_pos + state.dy * WIDTH + state.dx;
                var d_left_pos = down_pos + state.dx * WIDTH - state.dy;
                var d_right_pos = down_pos - state.dx * WIDTH + state.dy;
                var d_back_pos = down_pos - state.dy * WIDTH - state.dx;
                var d_fwd2_pos = d_fwd_pos + state.dy * WIDTH + state.dx;
                var d_left2_pos = d_left_pos + state.dx * WIDTH - state.dy;
                var d_right2_pos = d_right_pos - state.dx * WIDTH + state.dy;
                var d_back2_pos = d_back_pos - state.dy * WIDTH - state.dx;

                if (this.ProgressPossible (d_fwd_pos, d_fwd2_pos))
                {
                    moves.push (DIG_DOWN_FORWARD);
                }

                if (this.ProgressPossible (d_left_pos, d_left2_pos))
                {
                    moves.push (DIG_DOWN_LEFT);
                }

                if (this.ProgressPossible (d_right_pos, d_right2_pos))
                {
                    moves.push (DIG_DOWN_RIGHT);
                }

                if (this.ProgressPossible (d_back_pos, d_back2_pos))
                {
                    moves.push (DIG_DOWN_REVERSE);
                }
            }
        }

        // Up options

        if (up_pos >= 0)
        {
            var up_spcl = this.cells [up_pos].special;
            var up_type = this.cells [up_pos].type;

            // If the up cell is free only add forward as the next move will complete the tunnel

            if (up_type == CELL_ROOM || up_type == CELL_CORRIDOR)
            {
                if (up_spcl == SPECIAL_NONE)
                {
                    moves.push (DIG_UP_FORWARD);
                }
            }
            else if (up_type == CELL_ROCK)
            {
                var u_fwd_pos = up_pos + state.dy * WIDTH + state.dx;
                var u_left_pos = up_pos + state.dx * WIDTH - state.dy;
                var u_right_pos = up_pos - state.dx * WIDTH + state.dy;
                var u_back_pos = up_pos - state.dy * WIDTH - state.dx;
                var u_fwd2_pos = u_fwd_pos + state.dy * WIDTH + state.dx;
                var u_left2_pos = u_left_pos + state.dx * WIDTH - state.dy;
                var u_right2_pos = u_right_pos - state.dx * WIDTH + state.dy;
                var u_back2_pos = u_back_pos - state.dy * WIDTH - state.dx;

                if (this.ProgressPossible (u_fwd_pos, u_fwd2_pos))
                {
                    moves.push (DIG_UP_FORWARD);
                }

                if (this.ProgressPossible (u_left_pos, u_left2_pos))
                {
                    moves.push (DIG_UP_LEFT);
                }

                if (this.ProgressPossible (u_right_pos, u_right2_pos))
                {
                    moves.push (DIG_UP_RIGHT);
                }

                if (this.ProgressPossible (u_back_pos, u_back2_pos))
                {
                    moves.push (DIG_UP_REVERSE);
                }
            }
        }
    }
    return moves;
}
//-------------------------------------------------------------------------------------------------
// Checks the next two cells in a potential direction to see if a tunnel can be dug.
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.ProgressPossible = function (pos1, pos2)
{
    if (this.cells [pos1].type == CELL_ROCK)
    {
        return true;
    }

    // Only allow digging into a wall if the cell the other side is a room

    if (this.cells [pos1].type == CELL_WALL && this.cells [pos2].type == CELL_ROOM)
    {
        return true;
    }

    return false;
}

//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.CheckAdjacentCells = function (pos, adjacent_cells, allow_door)
{
    var n = adjacent_cells.length;
    var finished = false;

    for (var i = 0 ; i < n ; ++i)
    {
        var p2 = adjacent_cells [i];

        if (this.cells [p2].IsFree ())
        {
            finished = true;
            this.CheckRetag (pos, p2, allow_door);
        }
    }
    return finished;
}
//-------------------------------------------------------------------------------------------------
// Make a move
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.MakeMove = function (state, moves)
{
    // Up, down or finish

    var idx = RandomInteger (moves.length);
    var choice = moves [idx];

    if (choice == DIG_NOWHERE)
    {
        return null;
    }

// Up/Down

    switch (choice)
    {
        case DIG_DOWN_FORWARD:
        case DIG_DOWN_LEFT:
        case DIG_DOWN_RIGHT:
        case DIG_DOWN_REVERSE:
            state = this.MakePassageDown (state);
            break;

        case DIG_UP_FORWARD:
        case DIG_UP_LEFT:
        case DIG_UP_RIGHT:
        case DIG_UP_REVERSE:
            state = this.MakePassageUp (state);
            break;
    }

    if (state == null)
    {
        return null;
    }

// Turn/move

    switch (choice)
    {
        case DIG_LEFT:
        case DIG_DOWN_LEFT:
        case DIG_UP_LEFT:
            TurnLeft (state);
            break;

        case DIG_RIGHT:
        case DIG_DOWN_RIGHT:
        case DIG_UP_RIGHT:
            TurnRight (state);
            break;

        case DIG_DOWN_REVERSE:
        case DIG_UP_REVERSE:
            TurnAround (state);
            break;
    }

    MoveForward (state);
    return state;
}
//-------------------------------------------------------------------------------------------------
// Create a downward staircase at the supplied point. Returns the new state if the move
// is successful, or null if not.
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.MakePassageDown = function (state)
{
    var new_floor = state.floor + 1;
    var down_pos = state.pos + FLOOR_AREA;

    // Make the link

    this.cells [down_pos].special = SPECIAL_UP;
    this.cells [state.pos].special = SPECIAL_DOWN;

    // retag newly met cells

    if (this.cells [down_pos].IsFree ())
    {
        this.CheckRetag (state.pos, down_pos, false);
        return null;
    }

    this.cells [down_pos].type = CELL_CORRIDOR;
    this.cells [down_pos].tag = state.tag;

    // Check the adjacent cells for connectivity

    var pos1 = down_pos + WIDTH;
    var pos2 = down_pos - WIDTH;
    var pos3 = down_pos + 1;
    var pos4 = down_pos - 1;
    var cells = [pos1, pos2, pos3, pos4];

    var finished = this.CheckAdjacentCells (down_pos, cells, false);

    if (finished)
    {
        return null;
    }

    state.pos = down_pos;
    state.floor = new_floor;

    return state;
}
//-------------------------------------------------------------------------------------------------
// Create a upward staircase at the supplied point. Returns true if the link has been made,
// false otherwise.
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.MakePassageUp = function (state)
{
    var new_floor = state.floor - 1;
    var up_pos = state.pos - FLOOR_AREA;

    // Make the link

    var cell = this.cells [up_pos];

    this.cells [up_pos].special = SPECIAL_DOWN;
    this.cells [state.pos].special = SPECIAL_UP;

    // retag newly met cells

    if (this.cells [up_pos].IsFree ())
    {
        this.CheckRetag (state.pos, up_pos, false);
        return null
    }

    this.cells [up_pos].type = CELL_CORRIDOR;
    this.cells [up_pos].tag = state.tag;

    // Check the adjacent cells for connectivity

    var pos1 = up_pos + WIDTH;
    var pos2 = up_pos - WIDTH;
    var pos3 = up_pos + 1;
    var pos4 = up_pos - 1;
    var cells = [pos1, pos2, pos3, pos4];

    var finished = this.CheckAdjacentCells (up_pos, cells, false);

    if (finished)
    {
        return null;
    }

    state.pos = up_pos;
    state.floor = new_floor;

    return state;
}
//-------------------------------------------------------------------------------------------------
// Retag one set of adjacent cells
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.CheckRetag = function (pos1, pos2, allow_door)
{
    var tag1 = this.cells [pos1].tag;
    var tag2 = this.cells [pos2].tag;

    if (tag1 != tag2)
    {
        // Have we finished ?

        if ((tag1 == START_TAG && tag2 == END_TAG) || (tag1 == END_TAG && tag2 == START_TAG))
        {
            if (allow_door)
            {
                this.PlaceKey ((tag1 == NO_TAG) ? pos1 : pos2, ITEM_MAGENTA_KEY, SPECIAL_MAGENTA_LOCK);
            }
            this.connected = true;
            return;
        }

        // Retag the untagged region

        if (tag1 != NO_TAG)
        {
            this.TagCell (pos2, tag1);
        }
        else
        {
            this.TagCell (pos1, tag2);
        }
    }
}
//-------------------------------------------------------------------------------------------------
// Recursively tags cells to be the same as tag parameter.
// Only tags free cells.
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.TagCell = function (pos, tag)
{
    var positions = [];
    var index = 0;

    positions.push (pos);

    while (index < positions.length)
    {
        pos = positions [index];

        var cell = this.cells [pos];

        if (cell.tag == NO_TAG)
        {
            cell.tag = tag;

            if (tag == START_TAG)
            {
                this.reachable_cells.push (pos);
            }

            // Check neighbours

            var neighbours = [pos - WIDTH, pos + WIDTH, pos + 1, pos - 1];

            for (var i = 0 ; i < 4 ; ++i)
            {
                var n_cell = this.cells [neighbours [i]];

                if (n_cell.tag == NO_TAG && n_cell.IsFree ())
                {
                    positions.push (neighbours [i]);
                }
            }
            // Up/Down

            var ud_pos = -1;

            if (cell.special == SPECIAL_UP)
            {
                ud_pos = pos-FLOOR_AREA;
            }
            else if (cell.special == SPECIAL_DOWN)
            {
                ud_pos = pos+FLOOR_AREA;
            }

            if (ud_pos >= 0)
            {
                var ud_cell = this.cells [ud_pos];

                if (ud_cell.tag != tag && ud_cell.IsFree ())
                {
                    positions.push (ud_pos);
                }
            }
        }
        index += 1;
    }
}

//-------------------------------------------------------------------------------------------------
// Returns all the connected cells on the same floor
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.GetConnectedCells = function (pos)
{
    var positions = [];
    var index = 0;

    positions.push (pos);

    while (index < positions.length)
    {
        pos = positions [index];

        // Check neighbours

        var neighbours = [pos - WIDTH, pos + WIDTH, pos + 1, pos - 1];

        for (var i = 0 ; i < 4 ; ++i)
        {
            var seen_before = positions.indexOf (neighbours [i]) >= 0;

            if (! seen_before)
            {
                var n_cell = this.cells [neighbours [i]];

                if (n_cell.IsFree () || n_cell.special == SPECIAL_COLUMN)
                {
                    positions.push (neighbours [i]);
                }
            }
        }
        index += 1;
    }
    return positions;
}
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.SetCorridorCell = function (pos, tag)
{
    this.cells [pos].type = CELL_CORRIDOR;
    this.cells [pos].tag = tag;

    if (this.cells [pos].tag != START_TAG)
    {
        var n = RandomInteger (this.key_frequency);

        if (n == 0)
        {
            this.PlaceRandomKey (pos);
        }
    }
}
//-------------------------------------------------------------------------------------------------
// Places locked doors along the root and adds keys.
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.PlaceRandomKey = function (pos, key, lock)
{
    switch (RandomInteger (4))
    {
        case 0:
            this.PlaceKey (pos, ITEM_GREEN_KEY, SPECIAL_GREEN_LOCK);
            break;

        case 1:
            this.PlaceKey (pos, ITEM_BLUE_KEY, SPECIAL_BLUE_LOCK);
            break;

        case 2:
            this.PlaceKey (pos, ITEM_YELLOW_KEY, SPECIAL_YELLOW_LOCK);
            break;

        case 3:
            this.PlaceKey (pos, ITEM_RED_KEY, SPECIAL_RED_LOCK);
            break;
    }
}
//-------------------------------------------------------------------------------------------------
// Places locked doors along the root and adds keys.
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.PlaceKey = function (pos, key, lock)
{
    if (this.cells [pos].special == SPECIAL_NONE && this.cells [pos].type == CELL_CORRIDOR && this.HideKey (key))
    {
        this.cells [pos].special = lock;
        ++ this.num_locks;
    }
}
//-------------------------------------------------------------------------------------------------
// Hide a key (must be a non-special cell). Returns true if a key is placed
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.HideKey = function (key)
{
    var num_sites = this.reachable_cells.length;

    if (num_sites > 0)
    {
        var pos = this.reachable_cells [RandomInteger (num_sites)];

        if (this.cells [pos].special == SPECIAL_NONE)
        {
            this.cells [pos].items.push (new MazeItem (key));
            ++this.num_keys;
            return true;
        }
    }
    return false;
}
//-------------------------------------------------------------------------------------------------
// Get a random integer in the range (0 - n-1)
//-------------------------------------------------------------------------------------------------
function RandomInteger (n)
{
    ret = Math.floor (Math.random () * n);
    if (ret == n) ret = n-1;
    return ret;
}
//-------------------------------------------------------------------------------------------------
// Get a random range on the interval (vmin to vmax that is at least min_range)
// Result is in a 2 element array
//-------------------------------------------------------------------------------------------------
function RandomRange (vmin, vmax, min_range)
{
    if (vmax - vmin < min_range)
    {
        return null;
    }

    var v1 = vmin + RandomInteger (vmax - vmin - min_range);
    var v2 = v1 + min_range + RandomInteger (vmax - v1 - min_range);
    return [v1, v2];
}
//-------------------------------------------------------------------------------------------------
function TurnLeft (state)
{
    var temp = state.dx;
    state.dx = -state.dy;
    state.dy = temp;
}
//-------------------------------------------------------------------------------------------------
function TurnRight (state)
{
    var temp = state.dx;
    state.dx = state.dy;
    state.dy = -temp;
}
//-------------------------------------------------------------------------------------------------
function TurnAround (state)
{
    state.dx = -state.dx;
    state.dy = -state.dy;
}
//-------------------------------------------------------------------------------------------------
function MoveForward (state)
{
    this.debug += "MF: [" + StateText (state) + "] ";

    state.x += state.dx;
    state.y += state.dy;
    state.pos = FLOOR_AREA * state.floor + WIDTH * state.y + state.x;
    this.debug += "to [" + StateText (state) + "] ";
}
//-------------------------------------------------------------------------------------------------
function MakeState (pos, direction, tag)
{
    var ret = new Object ();
    var temp = MultiLevelMaze.DeconstructPosition (pos);

    ret.floor = temp [2];
    ret.y = temp [1];
    ret.x = temp [0];
    ret.pos = pos;
    ret.tag = tag;
    ret.dx = vector_x [direction];
    ret.dy = vector_y [direction];

    return ret;
}
//-------------------------------------------------------------------------------------------------
function StateText (state)
{
    var text = "Pos = " + state.pos;

    text += " = (" + state.floor + ", " + state.x + ", " + state.y + ")";
    text += ", vector = (" + state.dx + ", " + state.dy + ")";
    text += ", tag: " + state.tag;

    return text;
}


