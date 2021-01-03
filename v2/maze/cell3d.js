//-------------------------------------------------------------------------------------------------
// A Cell in a 3D maze rendition
// (c) John Whitehouse 2014
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

var RED = [1.0,  0.0,  0.0,  1.0];
var PINK = [1.0,  0.5,  0.5,  1.0];
var GREEN = [0.0,  1.0,  0.0,  1.0];
var DK_GREEN = [0.0,  0.5,  0.0,  1.0];
var BLUE = [0.0,  0.0,  1.0,  1.0];
var GRAY1 = [0.4,  0.4,  0.4,  1.0];
var GRAY2 = [0.6,  0.6,  0.6,  1.0];
var DK_BLUE = [0.0,  0.0,  0.5,  1.0];
var CYAN = [0.0,  1.0,  1.0,  1.0];
var DK_CYAN = [0.0,  0.5,  0.5,  1.0];

//-------------------------------------------------------------------------------------------------
function Cell3D (image_element)
{
}

Cell3D.WallExclusion = 0.125;
Cell3D.Hole1 = 0.2;
Cell3D.Hole2 = 0.8;
Cell3D.WallHeight = 1;
Cell3D.ViewHeight = 0.7;
Cell3D.FloorSpacing = 1.05;
Cell3D.NumSteps = 4;

Cell3D.QuadSequence = [0,1,2,2,3,0];

// Divide a texture into 16 sub-textures

Cell3D.FlavourSelectors = [];
Cell3D.NumFlavours = 20;

var room_squares = [0,1,2,3,8,9,10,11,16,17,18,19,24,25,26,27];
var corridors_squares = [32,33,34,35,40,41,42,43,48,49,50,51,56,57,58,59];
var ceiling_squares = [4,12,20,28,36,44,52,60];
var wall_squares = [6,14,22,30,38,46,54,62,5,13,21,29,37,45,53,61];
//-------------------------------------------------------------------------------------------------
Cell3D.Initialise = function()
{
    // Sets up a set of limits so that each value is half as likely as the previous:
    // 0.5, 0.25, 0.125, 0.0625...

    var value = 0.5;
    for (var i = 0 ; i < Cell3D.NumFlavours ; ++i)
    {
        Cell3D.FlavourSelectors.push (value);
        value = value / 2;
    }

    Cell3D.oct_template = new Column3D (false, 1, [[0.3,0],[0.5,0.2],[0.7,0]]);
    Cell3D.column_template = new Column3D (false, 5, [[0.1,0.15],[0.9,0.15]]);
    Cell3D.plinth_template = new Column3D (false, 3, [[0,0.2],[0.4, 0.2],[0.4,0] ]);
    Cell3D.cone_template = new Column3D (false, 5, [[0,0.3],[0.6,0]]);
    Cell3D.table_template = new Column3D (false, 5, [[0,0.03],[0.4,0.03],[0.4,0.35],[0.41,0.35],[0.41,0]]);
}
//-------------------------------------------------------------------------------------------------
// returns a number between 0 an limit-1 with the probability distribution defined in
// Cell3D.FlavourSelectors
//-------------------------------------------------------------------------------------------------
Cell3D.GetFloorFlavour = function (cell, num)
{
    if (cell.special == SPECIAL_UP) return num-2;
    if (cell.special == SPECIAL_DOWN) return num-1;

    var value = cell.flavour;

    for (var i = 0 ; i < num-2 ; ++i)
    {
        if (value > Cell3D.FlavourSelectors [i]) return i;
    }
    return num-3;
}
//-------------------------------------------------------------------------------------------------
// The wall image to draw based on the wall type and flavour
//-------------------------------------------------------------------------------------------------
Cell3D.GetWallFlavour = function (type, cell_flavour)
{
    // We have 4 flavours per wall type

    var flavour = 3;

    for (var i = 0 ; i < 3 ; ++i)
    {
        if (cell_flavour > Cell3D.FlavourSelectors [i])
        {
            flavour = i;
            break;
        }
    }

    switch (type)
    {
        case CELL_WALL:
            break;
        case CELL_ROCK:
            flavour += 4;
            break;
        case CELL_SOLID_ROCK:
            flavour += 8;
            break;
        case CELL_IMPENETRABLE:
        default:
            flavour += 12;
            break;
    }

    return wall_squares [flavour];
}
//-------------------------------------------------------------------------------------------------
Cell3D.CreateLocalStructure = function (maze, positions)
{
    var ret = new FloorData ();

    var num = positions.length;
    var bufferset = new BufferSet (0);

    for (var i = 0 ; i < num ; ++i)
    {
        var draw_pos = positions [i];
        var temp = MultiLevelMaze.DeconstructPosition (draw_pos);

        var x = temp [0];
        var y = temp [1];
        var f = temp [2];

        var draw_x = x;
        var draw_y = 0;
        var draw_z = y;

        var cell = maze.cells [draw_pos];
        var t = cell.type;

        // Start, end, columns and some random shapes

        if (cell.special == SPECIAL_START)
        {
            var column = Cell3D.oct_template.CreateBufferSet (x, y, 0);
            ret.structures.push (column);
        }
        else if (cell.special == SPECIAL_END)
        {
            var column = Cell3D.cone_template.CreateBufferSet (x, y, 0);
            ret.structures.push (column);
        }
        else if (cell.special == SPECIAL_COLUMN)
        {
            var column = Cell3D.column_template.CreateBufferSet (x, y, 0);
            ret.structures.push (column);
        }
        else if (t == CELL_ROOM && cell.flavour > 0.99)
        {
            var column = Cell3D.table_template.CreateBufferSet (x, y, 0);
            ret.structures.push (column);
        }

        if (t == CELL_ROOM || t == CELL_CORRIDOR || cell.special == SPECIAL_COLUMN)
        {
            // Room Floor

            if (t == CELL_ROOM || cell.special == SPECIAL_COLUMN)
            {
                var colour1 = (draw_pos % 2 == 0) ? RED : PINK;
                var texture_idx = room_squares [Cell3D.GetFloorFlavour (cell, 16)];
                Cell3D.AddSquareToBuffer ([draw_x, draw_y, draw_z], XZ, colour1, bufferset, texture_idx);
            }
            // Corridor Floor

            else
            {
                var colour1 = (draw_pos % 2 == 0) ? CYAN : DK_CYAN;
                var texture_idx = corridors_squares[Cell3D.GetFloorFlavour (cell, 16)];
                Cell3D.AddSquareToBuffer ([draw_x, draw_y, draw_z], XZ, colour1, bufferset, texture_idx);
            }

        // Ceiling

            var colour2 = (draw_pos % 2 == 0) ? GRAY1 : GRAY2;
            var ceiling_y = draw_y + Cell3D.WallHeight;
            var texture_idx = ceiling_squares[Cell3D.GetFloorFlavour (cell, 8)];

            Cell3D.AddSquareToBuffer ([draw_x, ceiling_y, draw_z], XZ, colour2, bufferset, texture_idx);

            // Right wall

            if (x < WIDTH-1)
            {
                var t2 = maze.cells [draw_pos + 1].type;

                if (t2 != CELL_ROOM && t2 != CELL_CORRIDOR)
                {
                    var f2 = maze.cells [draw_pos + 1].flavour;
                    var colour = (draw_pos % 2 == 0) ? GREEN : DK_GREEN;
                    var texture_id = Cell3D.GetWallFlavour (t2, f2);

                    Cell3D.AddSquareToBuffer ([draw_x + 1, draw_y, draw_z], YZ, colour, bufferset, texture_id);
                }
            }

            // Left wall

            if (x > 0)
            {
                var t2 = maze.cells [draw_pos - 1].type;

                if (t2 != CELL_ROOM && t2 != CELL_CORRIDOR)
                {
                    var f2 = maze.cells [draw_pos - 1].flavour;
                    var colour = (draw_pos % 2 == 0) ? GREEN : DK_GREEN;
                    var texture_id = Cell3D.GetWallFlavour (t2, f2);

                    Cell3D.AddSquareToBuffer ([draw_x, draw_y, draw_z], YZ, colour, bufferset, texture_id);
                }
            }

            // Back Wall

            if (y < HEIGHT-1)
            {
                var t2 = maze.cells [draw_pos + WIDTH].type;

                if (t2 != CELL_ROOM && t2 != CELL_CORRIDOR)
                {
                    var f2 = maze.cells [draw_pos + WIDTH].flavour;
                    var colour = (draw_pos % 2 == 0) ? BLUE : DK_BLUE;
                    var texture_id = Cell3D.GetWallFlavour (t2, f2);

                    Cell3D.AddSquareToBuffer ([draw_x, draw_y, draw_z + 1], XY, colour, bufferset, texture_id);
                }
            }

            // Front Wall

            if (y > 0)
            {
                var t2 = maze.cells [draw_pos - WIDTH].type;

                if (t2 != CELL_ROOM && t2 != CELL_CORRIDOR)
                {
                    var f2 = maze.cells [draw_pos - WIDTH].flavour;
                    var colour = (draw_pos % 2 == 0) ? BLUE : DK_BLUE;
                    var texture_id = Cell3D.GetWallFlavour (t2, f2);

                    Cell3D.AddSquareToBuffer ([draw_x, draw_y, draw_z], XY, colour, bufferset, texture_id);
                }
            }
        }
    }
    ret.SetLocale (bufferset);
    return ret;
}
//-------------------------------------------------------------------------------------------------
// Creates buffers containing the drawing points and colours for a level's floor
//-------------------------------------------------------------------------------------------------
Cell3D.ConstructFloor = function (maze, floor, bufferset)
{
    var draw_pos = floor * FLOOR_AREA;
    var pos3d = Cell3D.ToViewCoord (0, 0);
    var draw_y = pos3d [1];
    var draw_z = pos3d [2];

    for (var y = 0 ; y < HEIGHT  ; ++y)
    {
        var draw_x = pos3d [0];

        for (var x = 0 ; x < WIDTH  ; ++x)
        {
            var cell = maze.cells [draw_pos];
            var t = cell.type;

            if (t == CELL_ROOM)
            {
                var colour1 = (draw_pos % 2 == 0) ? RED : PINK;
                var texture_idx = room_squares [Cell3D.GetFloorFlavour (cell, 16)];
                Cell3D.AddSquareToBuffer ([draw_x, draw_y, draw_z], XZ, colour1, bufferset, texture_idx);
            }
            ++ draw_pos;
            draw_x += 1;
        }
        draw_z += 1;
    }
}
//-------------------------------------------------------------------------------------------------
// Creates buffers containing the drawing points and colours for a level's floor
//-------------------------------------------------------------------------------------------------
Cell3D.ConstructCorridor = function (maze, floor, bufferset)
{
    var draw_pos = floor * FLOOR_AREA;
    var pos3d = Cell3D.ToViewCoord (0, 0);
    var draw_y = pos3d [1];
    var draw_z = pos3d [2];

    for (var y = 0 ; y < HEIGHT  ; ++y)
    {
        var draw_x = pos3d [0];

        for (var x = 0 ; x < WIDTH  ; ++x)
        {
            var cell = maze.cells [draw_pos];
            var t = cell.type;

            if (t == CELL_CORRIDOR)
            {
                var colour1 = (draw_pos % 2 == 0) ? CYAN : DK_CYAN;
                var texture_idx = corridors_squares[Cell3D.GetFloorFlavour (cell, 16)];
                Cell3D.AddSquareToBuffer ([draw_x, draw_y, draw_z], XZ, colour1, bufferset, texture_idx);
            }
            ++ draw_pos;
            draw_x += 1;
        }
        draw_z += 1;
    }
}
//-------------------------------------------------------------------------------------------------
// Creates buffers containing the drawing points and colours for a level's ceiling
//-------------------------------------------------------------------------------------------------
Cell3D.ConstructCeiling = function (maze, floor, bufferset)
{
    var draw_pos = floor * FLOOR_AREA;
    var pos3d = Cell3D.ToViewCoord (0, 0);
    var draw_y = pos3d [1];
    var draw_z = pos3d [2];

    for (var y = 0 ; y < HEIGHT  ; ++y)
    {
        var draw_x = pos3d [0];

        for (var x = 0 ; x < WIDTH  ; ++x)
        {
            var cell = maze.cells [draw_pos];
            var t = cell.type;

            if (t == CELL_ROOM || t == CELL_CORRIDOR)
            {
                var colour2 = (draw_pos % 2 == 0) ? GRAY1 : GRAY2;
                var ceiling_y = draw_y + Cell3D.WallHeight;
                var texture_idx = ceiling_squares[Cell3D.GetFloorFlavour (cell, 8)];

                Cell3D.AddSquareToBuffer ([draw_x, ceiling_y, draw_z], XZ, colour2, bufferset, texture_idx);
            }
            ++ draw_pos;
            draw_x += 1;
        }
        draw_z += 1;
    }
}
//-------------------------------------------------------------------------------------------------
// Creates buffers containing the drawing points and colours for a whole level
//-------------------------------------------------------------------------------------------------
Cell3D.ConstructWalls = function (maze, floor, bufferset)
{
    var draw_pos = floor * FLOOR_AREA;
    var pos3d = Cell3D.ToViewCoord (0, 0);
    var draw_y = pos3d [1];
    var draw_z = pos3d [2];

    for (var y = 0 ; y < HEIGHT  ; ++y)
    {
        var draw_x = pos3d [0];

        for (var x = 0 ; x < WIDTH  ; ++x)
        {
            var cell = maze.cells [draw_pos];
            var t1 = cell.type;

            if (t1 == CELL_ROOM || t1 == CELL_CORRIDOR)
            {
                // Right wall

                if (x < WIDTH-1)
                {
                    var t2 = maze.cells [draw_pos + 1].type;

                    if (t2 != CELL_ROOM && t2 != CELL_CORRIDOR)
                    {
                        var f2 = maze.cells [draw_pos + 1].flavour;
                        var colour = (draw_pos % 2 == 0) ? GREEN : DK_GREEN;
                        var texture_id = Cell3D.GetWallFlavour (t2, f2);

                        Cell3D.AddSquareToBuffer ([draw_x + 1, draw_y, draw_z], YZ, colour, bufferset, texture_id);
                    }
                }

                // Left wall

                if (x > 0)
                {
                    var t2 = maze.cells [draw_pos - 1].type;

                    if (t2 != CELL_ROOM && t2 != CELL_CORRIDOR)
                    {
                        var f2 = maze.cells [draw_pos - 1].flavour;
                        var colour = (draw_pos % 2 == 0) ? GREEN : DK_GREEN;
                        var texture_id = Cell3D.GetWallFlavour (t2, f2);

                        Cell3D.AddSquareToBuffer ([draw_x, draw_y, draw_z], YZ, colour, bufferset, texture_id);
                    }
                }

                // Back

                if (y < HEIGHT-1)
                {
                    var t2 = maze.cells [draw_pos + WIDTH].type;

                    if (t2 != CELL_ROOM && t2 != CELL_CORRIDOR)
                    {
                        var f2 = maze.cells [draw_pos + WIDTH].flavour;
                        var colour = (draw_pos % 2 == 0) ? BLUE : DK_BLUE;
                        var texture_id = Cell3D.GetWallFlavour (t2, f2);

                        Cell3D.AddSquareToBuffer ([draw_x, draw_y, draw_z + 1], XY, colour, bufferset, texture_id);
                    }
                }

                // Front

                if (y > 0)
                {
                    var t2 = maze.cells [draw_pos - WIDTH].type;

                    if (t2 != CELL_ROOM && t2 != CELL_CORRIDOR)
                    {
                        var f2 = maze.cells [draw_pos - WIDTH].flavour;
                        var colour = (draw_pos % 2 == 0) ? BLUE : DK_BLUE;
                        var texture_id = Cell3D.GetWallFlavour (t2, f2);

                        Cell3D.AddSquareToBuffer ([draw_x, draw_y, draw_z], XY, colour, bufferset, texture_id);
                    }
                }
            }
            ++ draw_pos;
            draw_x += 1;
        }
        draw_z += 1;
    }
}
//-------------------------------------------------------------------------------------------------
// Construct a square and the associated element ids
// bufferset - combines the current sets of vertices, colours, elements and textures
// flavour - a number from 0 - 1
//-------------------------------------------------------------------------------------------------
Cell3D.AddSquareToBuffer = function (pos, orientation, colour, bufferset, flavour)
{
    var v1;
    var v2;

    switch (orientation)
    {
        case XY:
            v1 = [1,0,0];
            v2 = [0,1,0];
            break;

        case XZ:
            v2 = [1,0,0];
            v1 = [0,0,Cell3D.WallHeight];
            break;

        case YZ:
            v2 = [0,1,0];
            v1 = [0,0,Cell3D.WallHeight];
            break;
    }

    var p1 = [pos[0], pos[1], pos[2]];
    var p2 = Maze3D.Add3 (p1, v1);
    var p3 = Maze3D.Add3 (p2, v2);
    var p4 = Maze3D.Add3 (p1, v2);

    bufferset.AddQuadrilateral ([p1,p2,p3,p4], colour);

    bufferset.AddTextureCoords (flavour);
}
//-------------------------------------------------------------------------------------------------
// Converts co-ordinates in viewer space to a position within the maze
//-------------------------------------------------------------------------------------------------
Cell3D.ToMazeCoord = function (view_x, view_z)
{
    var maze_x = Math.floor (view_x);
    var maze_y = Math.floor (view_z);

    return [maze_x, maze_y];
}
//-------------------------------------------------------------------------------------------------
// Converts a maze cell to it's BL corner in viewer co-ordinates
//-------------------------------------------------------------------------------------------------
Cell3D.ToViewCoord = function (maze_x, maze_y)
{
    var view_x = maze_x;
    var view_z = maze_y;

    return [view_x, view_z, 0.7];
}
//-------------------------------------------------------------------------------------------------
// Finds the position with a cell (as an offset from the BL corner in view co-ordinates)
//-------------------------------------------------------------------------------------------------
Cell3D.PositionWithinCell = function (view_x, view_z)
{
    var maze_x = view_x;
    var maze_y = view_z;

    var xoff = maze_x - Math.floor (maze_x);
    var yoff = maze_y - Math.floor (maze_y);

    return [xoff,yoff];
}

