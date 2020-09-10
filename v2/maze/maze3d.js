//-------------------------------------------------------------------------------------------------
// Javascript - 3d canvas teting
// (c) John Whitehouse 2014
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

var DISPLAY_HEIGHT = 400;
var DISPLAY_WIDTH = 720;
var ASPECT = DISPLAY_WIDTH / DISPLAY_HEIGHT;
var NO_SUPPORT = "";
var STANDARD_SUPPORT = "webgl";
var EXP_SUPPORT = "experimental-webgl";
var XY = 0;
var XZ = 1;
var YZ = 2;
var SIZEOF_SQUARE = 4;
var NORTH = 0;
var SOUTH = 1;
var EAST = 2;
var WEST = 3;

Maze3D.FarCutoff = 24;
Maze3D.NearCutoff = 0.05;
Maze3D.ViewWidth = 4;
//Maze3D.FloorTileIndex = 0;
Maze3D.DrawTextures = true;

//-------------------------------------------------------------------------------------------------
// Create one
//-------------------------------------------------------------------------------------------------
function Maze3D (image_element)
{
    this.image = document.getElementById(image_element);

    this.canvas = document.createElement('canvas');
    this.canvas.width = DISPLAY_WIDTH;
    this.canvas.height = DISPLAY_HEIGHT;
    this.message = "Created";
    this.basic_step = 1 / 4;

    this.CheckSupport ();

    this.xpos = 0.5;
    this.ypos = 0.8;
    this.zpos = 0.5;
    this.rotate = 0;
    this.sin = 0;
    this.cos = 1;

    if (this.context != null)
    {
        BufferSet.Initialise ();
        Cell3D.Initialise ();
        this.context.Initialise (this);
    }
}
//-------------------------------------------------------------------------------------------------
// Get the WebGL context
//-------------------------------------------------------------------------------------------------
Maze3D.prototype.CheckSupport = function ()
{
    try
    {
        var ctx3 = this.canvas.getContext("webgl");

        if (ctx3 != null)
        {
            this.mode = STANDARD_SUPPORT;
            this.message = "Using webgl.";
            this.context = new DrawingContext (ctx3);
            return true;
        }

        ctx3 = this.canvas.getContext( 'experimental-webgl');

        if (ctx3 != null)
        {
            this.mode = EXP_SUPPORT;
            this.message = "Using experimental-webgl";
            this.context = new DrawingContext (ctx3);
            return true;
        }

        this.message = "No webgl support.";
    }
    catch(e)
    {
        this.message = "Get webgl exception: " + e;
    }

    this.context = null;
    this.mode = NO_SUPPORT;
    return false;
}
//-------------------------------------------------------------------------------------------------
Maze3D.prototype.ConstructWholeMaze = function (maze)
{
// Creates 9 buffers (floor, ceiling, walls) x (drawing points, colours, elements)

    var player = MultiLevelMaze.DeconstructPosition (maze.start_pos);

    this.maze = maze;
    this.floor = player [2];
    this.floors = [];

    var view_pos = Cell3D.ToViewCoord (player [0] + 0.5, player [1] + 0.5);

    this.xpos = view_pos [0];
    this.zpos = view_pos [1];
    this.ypos = view_pos [2];

    // get the maze data

    for (var i = 0; i < maze.num_floors ; ++i)
    {
        var floor = new FloorData ();

        var bufferset = new BufferSet (TEXTURE_DUNGEON);

        Cell3D.ConstructFloor (maze, i, bufferset);
        Cell3D.ConstructCorridor (maze, i, bufferset);
        Cell3D.ConstructCeiling (maze, i, bufferset);
        Cell3D.ConstructWalls (maze, i, bufferset);

        floor.AddStructure (bufferset);

        this.floors.push (floor);
    }
}
//-------------------------------------------------------------------------------------------------
Maze3D.prototype.ConstructPlayerLocale = function (maze, player_pos)
{
// Creates 9 buffers (floor, ceiling, walls) x (drawing points, colours, elements)

    var player = MultiLevelMaze.DeconstructPosition (player_pos);

    this.maze = maze;
    this.floor = player [2];

    var view_pos = Cell3D.ToViewCoord (player [0] + 0.5, player [1] + 0.5);

    this.xpos = view_pos [0];
    this.zpos = view_pos [1];
    this.ypos = view_pos [2];

    var positions = maze.GetConnectedCells (player_pos);

    this.floor_data = Cell3D.CreateLocalStructure (maze, positions);
}
//-------------------------------------------------------------------------------------------------
// Draw a sub-set of the whole picture
//-------------------------------------------------------------------------------------------------
Maze3D.prototype.Draw = function ()
{
    this.context.Clear ();

    var pMatrix = Maze3D.PerspectiveMatrix (ASPECT);
    var mvMatrix = this.MatrixPosition4x4 ();
    var use_texture = this.context.TexturesLoaded () && Maze3D.DrawTextures;

    this.context.AttachMatrices (pMatrix, mvMatrix);
    this.floor_data.Draw (this.context, use_texture);
    this.image.src = this.canvas.toDataURL();
}
//-------------------------------------------------------------
Maze3D.prototype.OnEvent = function (event)
{
    var text = EventParser.KeyToText (event);

    if (text == null)
    {
        return false;
    }

    switch (text)
    {
        case 'SHIFT-Left':
        case 'q':
            this.Move (-this.basic_step, 0);
            break;

        case 'SHIFT-Right':
        case 'e':
            this.Move (this.basic_step, 0);
            break;

        case 'Up':
        case 'w':
            this.Move (0, -this.basic_step);
            break;

        case 'Down':
        case 's':
            this.Move (0, this.basic_step);
            break;

        case 'SHIFT-Up':
            return this.ChangeFloor (true);
            break;

        case 'SHIFT-Down':
            return this.ChangeFloor (false);
            break;

        case 'Left':
        case 'a':
            this.Rotate (-15);
            break;

        case 'Right':
        case 'd':
            this.Rotate (15);
            break;

        case 't':
            Maze3D.DrawTextures = ! Maze3D.DrawTextures;
            this.UpdatePerspective ();
            break;

        default:
            return false;
    }
    return true;
}
//-------------------------------------------------------------------------------------------------
Maze3D.prototype.Move = function (dx, dz)
{
    var xpos = this.xpos + dx * this.cos - dz * this.sin;
    var zpos = this.zpos + dx * this.sin + dz * this.cos;

    var maze_pos = Cell3D.ToMazeCoord (xpos, zpos);
    var player_pos = MultiLevelMaze.MakePosition (maze_pos[0], maze_pos[1], this.floor);

    var t = this.maze.cells [player_pos].type;

    if (t != CELL_ROOM && t != CELL_CORRIDOR)
    {
        return;
    }

    var offset = Cell3D.PositionWithinCell (xpos, zpos);
    var left_t = this.maze.cells [player_pos + 1].type;
    var right_t = this.maze.cells [player_pos - 1].type;
    var fwd_t = this.maze.cells [player_pos - WIDTH].type;
    var back_t = this.maze.cells [player_pos + WIDTH].type;

    // don't let the player get too close to the walls

    if ((left_t != CELL_ROOM && left_t != CELL_CORRIDOR) && offset [0] < Cell3D.WallExclusion)
    {
        xpos += Cell3D.WallExclusion - offset [0];
    }
    else if ((right_t != CELL_ROOM && right_t != CELL_CORRIDOR) && 1 - offset [0] < Cell3D.WallExclusion)
    {
        xpos -= offset [0] - 1 + Cell3D.WallExclusion;
    }

    if ((back_t != CELL_ROOM && back_t != CELL_CORRIDOR) && offset [1] < Cell3D.WallExclusion)
    {
        zpos += Cell3D.WallExclusion - offset [1];
    }
    else if ((fwd_t != CELL_ROOM && fwd_t != CELL_CORRIDOR) && 1 - offset [1] < Cell3D.WallExclusion)
    {
        zpos -= offset [1] - 1 + Cell3D.WallExclusion;
    }

    this.xpos = xpos;
    this.zpos = zpos;

    this.Draw ();
}
//-------------------------------------------------------------------------------------------------
Maze3D.prototype.ChangeFloor = function (up)
{
    var maze_pos = Cell3D.ToMazeCoord (this.xpos, this.zpos);
    var player_pos = MultiLevelMaze.MakePosition (maze_pos[0], maze_pos[1], this.floor);
    var changed = false;
    var cell = this.maze.cells [player_pos];

    // Are we standing on an up/down square

    if (up && this.floor > 0 && cell.special == SPECIAL_UP)
    {
        this.floor -= 1;
        player_pos -= FLOOR_AREA;
        changed = true;
    }
    else if (! up && cell.special == SPECIAL_DOWN && this.floor < this.maze.num_floors - 1)
    {
        this.floor += 1;
        player_pos += FLOOR_AREA;
        changed = true;
    }

    // If not, see if the square in front supports up/down

    if (! changed)
    {
        var xpos = this.xpos + this.sin;
        var zpos = this.zpos - this.cos;
        maze_pos = Cell3D.ToMazeCoord (xpos, zpos);
        player_pos = MultiLevelMaze.MakePosition (maze_pos[0], maze_pos[1], this.floor);
        cell = this.maze.cells [player_pos];
        t = cell.type;

        if (t == CELL_ROOM || t == CELL_CORRIDOR)
        {
            if (up && this.floor > 0 && cell.special == SPECIAL_UP)
            {
                this.floor -= 1;
                player_pos -= FLOOR_AREA;
                changed = true;
            }
            else if (! up && cell.special == SPECIAL_DOWN && this.floor < this.maze.num_floors - 1)
            {
                this.floor += 1;
                player_pos += FLOOR_AREA;
                changed = true;
            }
        }
    }

    if (changed)
    {
        this.ConstructPlayerLocale (this.maze, player_pos);
        this.Move (0,0);
    }

    return changed;
}
//-------------------------------------------------------------------------------------------------
Maze3D.prototype.UpdatePerspective = function ()
{
    this.Draw (this.floor);
}
//-------------------------------------------------------------------------------------------------
Maze3D.prototype.Rotate = function (angle)
{
    this.rotate = (this.rotate + angle + 360) % 360;
    var a = (this.rotate * Math.PI) / 180;
    this.sin = Math.sin (a);
    this.cos = Math.cos (a);

    this.Draw (this.floor);
}
//-------------------------------------------------------------------------------------------------
// Construct a transformation matrix
//-------------------------------------------------------------------------------------------------
Maze3D.prototype.MatrixPosition4x4 = function ()
{
    var xpos = this.cos * this.xpos + this.sin * this.zpos;
    var zpos = -this.sin * this.xpos + this.cos * this.zpos;

    var x = [this.cos,  0,          -this.sin,      0,
             0,         1,          0,              0,
             this.sin,  0,          this.cos,       0,
             -xpos,     -this.ypos, -zpos,          1];

    return new Float32Array (x);
}
//-------------------------------------------------------------------------------------------------
// Construct a perspective matrix
//-------------------------------------------------------------------------------------------------
Maze3D.PerspectiveMatrix = function (aspect)
{
    var width = Maze3D.ViewWidth;
    var near = Maze3D.NearCutoff;
    var far = Maze3D.FarCutoff;
    var dif = far - near;

    var x = [  width / aspect,  0,      0,                      0,
               0,               width,  0,                      0,
               0,               0,      -(far + near) / dif,    -1,
               0,               0,      -2 * far * near / dif,  0];

    return new Float32Array (x);
};
//-------------------------------------------------------------------------------------------------
Maze3D.Add3 = function (p1, p2)
{
    return [p1[0] + p2[0], p1[1] + p2[1], p1[2] + p2[2]];
}
