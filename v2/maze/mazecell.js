//-------------------------------------------------------------------------------------------------
// Javascript Maze cell class definition. A cell in a maze.
// (c) John Whitehouse 2013
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

var NO_TAG = 0;         // For connectivity calculations
var START_TAG = 1;
var END_TAG = 2;
var CELL_SIZE = 11;     // The size of a single cell (11 x 11)

// Walls

var TOP_WALL = 0;
var BOTTOM_WALL = 1;
var LEFT_WALL = 2;
var RIGHT_WALL = 3;
var NE_CORNER = 4;
var NW_CORNER = 5;
var SE_CORNER = 6;
var SW_CORNER = 7;

var TOP_DOOR = 0;
var BOTTOM_DOOR = 1;
var LEFT_DOOR = 2;
var RIGHT_DOOR = 3;

// Types of cell (all cells have a type)

var CELL_ROCK = 0;
var CELL_ROOM = 1;
var CELL_CORRIDOR = 2;
var CELL_WALL = 3;
var CELL_SOLID_ROCK = 4;
var CELL_IMPENETRABLE = 5;

// Cell adornments (most cells don't have these, no cell can have more than one)

var SPECIAL_NONE = 0;
var SPECIAL_START = 1;
var SPECIAL_END = 2;
var SPECIAL_UP = 3;
var SPECIAL_DOWN = 4;
var SPECIAL_DOOR = 5;
var SPECIAL_COLUMN = 6;

var SPECIAL_MAGENTA_LOCK = 0x100;
var SPECIAL_GREEN_LOCK = 0x101;
var SPECIAL_BLUE_LOCK = 0x102;
var SPECIAL_YELLOW_LOCK = 0x103;
var SPECIAL_RED_LOCK = 0x104;

var LOCK_MASK = 0x100;

var TypeNames = ["Rock", "Room", "Corridor", "Wall", "Solid", "Impenetrable"];

// Maps cell types to images

var type_image = [];

type_image [CELL_ROCK] = LoadImage ("images/rock.png");
type_image [CELL_ROOM] = LoadImage ("images/room.png");
type_image [CELL_CORRIDOR] = LoadImage ("images/cdoor.png");
type_image [CELL_WALL] = LoadImage ("images/wall.png");
type_image [CELL_SOLID_ROCK] = LoadImage ("images/solid_rock.png");
type_image [CELL_IMPENETRABLE] = LoadImage ("images/impenetrable_rock.png");

// Wall edges (added to the basic wall)

var wall_image = [];

wall_image [TOP_WALL] = LoadImage ("images/t_wall.png");
wall_image [BOTTOM_WALL] = LoadImage ("images/b_wall.png");
wall_image [LEFT_WALL] = LoadImage ("images/l_wall.png");
wall_image [RIGHT_WALL] = LoadImage ("images/r_wall.png");
wall_image [NE_CORNER] = LoadImage ("images/ne_c.png");
wall_image [NW_CORNER] = LoadImage ("images/nw_c.png");
wall_image [SE_CORNER] = LoadImage ("images/se_c.png");
wall_image [SW_CORNER] = LoadImage ("images/sw_c.png");

// Doors (separate rooms from corridors)

var door_image = [];

door_image [TOP_DOOR] = LoadImage ("images/t_door.png");
door_image [BOTTOM_DOOR] = LoadImage ("images/b_door.png");
door_image [LEFT_DOOR] = LoadImage ("images/l_door.png");
door_image [RIGHT_DOOR] = LoadImage ("images/r_door.png");

var player_image = LoadImage ("images/player.png");

// Special additions

var special_image = {};

special_image [SPECIAL_NONE] = LoadImage ("images/transparent.png");
special_image [SPECIAL_END] = LoadImage ("images/end.png");
special_image [SPECIAL_START] = LoadImage ("images/start.png");
special_image [SPECIAL_UP] = LoadImage ("images/up.png");
special_image [SPECIAL_DOWN] = LoadImage ("images/down.png");
special_image [SPECIAL_DOOR] = LoadImage ("images/transparent.png");
special_image [SPECIAL_MAGENTA_LOCK] = LoadImage ("images/magenta_lock.png");
special_image [SPECIAL_GREEN_LOCK] = LoadImage ("images/green_lock.png");
special_image [SPECIAL_YELLOW_LOCK] = LoadImage ("images/yellow_lock.png");
special_image [SPECIAL_BLUE_LOCK] = LoadImage ("images/blue_lock.png");
special_image [SPECIAL_RED_LOCK] = LoadImage ("images/red_lock.png");
special_image [SPECIAL_COLUMN] = LoadImage ("images/column.png");

var special_is_walkable = {};

special_is_walkable [SPECIAL_NONE] = true;
special_is_walkable [SPECIAL_END] = true;
special_is_walkable [SPECIAL_START] = true;
special_is_walkable [SPECIAL_UP] = true;
special_is_walkable [SPECIAL_DOWN] = true;
special_is_walkable [SPECIAL_DOOR] = true;
special_is_walkable [SPECIAL_MAGENTA_LOCK] = false;
special_is_walkable [SPECIAL_GREEN_LOCK] = false;
special_is_walkable [SPECIAL_YELLOW_LOCK] = false;
special_is_walkable [SPECIAL_BLUE_LOCK] = false;
special_is_walkable [SPECIAL_RED_LOCK] = false;
special_is_walkable [SPECIAL_COLUMN] = false;

var special_can_be_opened = {};

special_can_be_opened [SPECIAL_NONE] = false;
special_can_be_opened [SPECIAL_END] = false;
special_can_be_opened [SPECIAL_START] = false;
special_can_be_opened [SPECIAL_UP] = false;
special_can_be_opened [SPECIAL_DOWN] = false;
special_can_be_opened [SPECIAL_DOOR] = false;
special_can_be_opened [SPECIAL_MAGENTA_LOCK] = true;
special_can_be_opened [SPECIAL_GREEN_LOCK] = true;
special_can_be_opened [SPECIAL_YELLOW_LOCK] = true;
special_can_be_opened [SPECIAL_BLUE_LOCK] = true;
special_can_be_opened [SPECIAL_RED_LOCK] = true;
special_can_be_opened [SPECIAL_COLUMN] = false;

var tag_image = [];

tag_image [0] = LoadImage ("images/red_gem.png");
tag_image [1] = LoadImage ("images/yellow_gem.png");
tag_image [2] = LoadImage ("images/green_gem.png");
tag_image [3] = LoadImage ("images/blue_gem.png");

//-------------------------------------------------------------------------------------------------
// Load the maze images
//-------------------------------------------------------------------------------------------------
function LoadImage (name)
{
    var image = new Image(CELL_SIZE, CELL_SIZE);
    image.src = name;
    return image;
}
//-------------------------------------------------------------------------------------------------
// Create a default cell
//-------------------------------------------------------------------------------------------------
function MazeCell ()
{
    this.special = SPECIAL_NONE;
    this.type = CELL_IMPENETRABLE;
    this.seen = false;
    this.tag = NO_TAG;
    this.items = [];
    this.flavour = Math.random ();
}
//-------------------------------------------------------------------------------------------------
// Draw a cell. Draws the basic cell contents plus any special extras and an optional player.
// The extras may be transparent.
//-------------------------------------------------------------------------------------------------
MazeCell.prototype.Draw = function (canvas, x, y, has_player)
{
    var ctx = canvas.getContext("2d");

    ctx.drawImage(type_image [this.type], x * CELL_SIZE, y * CELL_SIZE);

    if (this.special != SPECIAL_NONE)
    {
        ctx.drawImage(special_image [this.special], x * CELL_SIZE, y * CELL_SIZE);
    }

    // If the player is in this cell then draw the player, otherwise draw the first item
    // in the cell.

    if (has_player)
    {
        ctx.drawImage(player_image, x * CELL_SIZE, y * CELL_SIZE);
    }
    else if (this.items.length > 0)
    {
        ctx.drawImage(item_image [this.items [0].id], x * CELL_SIZE, y * CELL_SIZE);
    }
}
//-------------------------------------------------------------------------------------------------
MazeCell.prototype.DrawTag = function (canvas, x, y)
{
    var ctx = canvas.getContext("2d");

    if (this.tag != NO_TAG)
    {
        var idx = this.tag % 4;
        var img = tag_image [idx];
        ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE);
    }
}
//-------------------------------------------------------------------------------------------------
MazeCell.prototype.DrawWallFacings = function (canvas, x, y, nw, n, ne, w, e, sw, s, se)
{
    var ctx = canvas.getContext("2d");

    // Draw faces first

    if (n) ctx.drawImage(wall_image [TOP_WALL], x * CELL_SIZE, y * CELL_SIZE);
    if (s) ctx.drawImage(wall_image [BOTTOM_WALL], x * CELL_SIZE, y * CELL_SIZE);
    if (e) ctx.drawImage(wall_image [RIGHT_WALL], x * CELL_SIZE, y * CELL_SIZE);
    if (w) ctx.drawImage(wall_image [LEFT_WALL], x * CELL_SIZE, y * CELL_SIZE);

    // then the corners

    if (ne) ctx.drawImage(wall_image [NE_CORNER], x * CELL_SIZE, y * CELL_SIZE);
    if (nw) ctx.drawImage(wall_image [NW_CORNER], x * CELL_SIZE, y * CELL_SIZE);
    if (se) ctx.drawImage(wall_image [SE_CORNER], x * CELL_SIZE, y * CELL_SIZE);
    if (sw) ctx.drawImage(wall_image [SW_CORNER], x * CELL_SIZE, y * CELL_SIZE);
}
//-------------------------------------------------------------------------------------------------
MazeCell.prototype.DrawDoorFacings = function (canvas, x, y, n, w, e, s)
{
    var ctx = canvas.getContext("2d");

    if (n) ctx.drawImage(door_image [TOP_DOOR], x * CELL_SIZE, y * CELL_SIZE);
    if (s) ctx.drawImage(door_image [BOTTOM_DOOR], x * CELL_SIZE, y * CELL_SIZE);
    if (e) ctx.drawImage(door_image [RIGHT_DOOR], x * CELL_SIZE, y * CELL_SIZE);
    if (w) ctx.drawImage(door_image [LEFT_DOOR], x * CELL_SIZE, y * CELL_SIZE);
}
//-------------------------------------------------------------------------------------------------
// Is a cell free, ie, can the player move into it.
//-------------------------------------------------------------------------------------------------
MazeCell.prototype.IsFree = function ()
{
    return (this.type == CELL_CORRIDOR || this.type == CELL_ROOM) && special_is_walkable [this.special];
}
//-------------------------------------------------------------------------------------------------
// Is a cell potentially free, ie, cells the player could move into in the right circumstances.
//-------------------------------------------------------------------------------------------------
MazeCell.prototype.IsPotentiallyFree = function ()
{
    return (this.type == CELL_CORRIDOR || this.type == CELL_ROOM)
            && (special_is_walkable [this.special] || special_can_be_opened [this.special]);
}


