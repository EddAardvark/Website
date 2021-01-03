//-------------------------------------------------------------------------------------------------
// Javascript Maze class definition. A 3d maze consisting of rooms, tunnels and shafts.
// (c) John Whitehouse 2013
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

var KEY_WEST = 37;
var KEY_EAST = 39;
var KEY_NORTH = 38;
var KEY_SOUTH = 40;
var KEY_UP = 85;
var KEY_DOWN = 68;
var KEY_PICK_UP = 80;
var KEY_INVENTORY = 73;
var KEY_DROP = 88;
var KEY_RUNES = 82;
var KEY_CAST = 67;

var maze_keys =
[
    KEY_WEST,
    KEY_EAST,
    KEY_NORTH,
    KEY_SOUTH,
    KEY_UP,
    KEY_DOWN,
    KEY_PICK_UP,
    KEY_INVENTORY,
    KEY_DROP,
    KEY_RUNES,
    KEY_CAST,
];
//-------------------------------------------------------------------------------------------------
// define the maze object. The cells in the maze are rendered East, South, Down, so cell
// (x, y, floor) = FLOOR_AREA * floor + WIDTH * y + x
//-------------------------------------------------------------------------------------------------
function MultiLevelMaze ()
{
    this.debug = "";
    this.image = null;
    this.connected = false;
    this.num_floors = DEPTH;
    this.num_corridors = 0;
    this.num_rooms = 0;
    this.num_rocks = 0;
    this.num_blocks = 0;
    this.num_keys = 0;
    this.num_locks = 0;

    this.animator = new Animator ();
    this.spell = new Spell ();
    this.in_conversation = false;
    this.player = new MazePlayer ();
    this.reachable_cells = [];
    this.key_frequency = 25 + RandomInteger (500);

    this.CreateCells ();
    this.CreateCanvas ();
    this.AddSolidRock (1 + RandomInteger (ROCK_FREQUENCY));
    this.CreateRooms (2 + RandomInteger (ROOM_FREQUENCY), 1 + RandomInteger (SPECIAL_ROOM_FREQUENCY));
    this.CreateBlocks (1 + RandomInteger (BLOCK_FREQUENCY));
    this.CreateEndPoints ();
    this.CreateCorridors ();
    this.AddGems ();
    this.AddFlags ();

    // Draw the player

    this.player.pos = this.start_pos;
    this.player.floor = 0;

    this.ExposeCells (this.start_pos);
    this.DrawPlayerImage (this.player);

    if (! this.connected)
    {
        this.ShowAlert ("Maze generation failed, press F5 to try again");
    }

    this.CountThings ();
}
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.CountThings = function ()
{
    this.debug += "Rooms: " + this.num_rooms + "<br>";
    this.debug += "Corridors: " + this.num_corridors + "<br>";
    this.debug += "Blocks: " + this.num_blocks + "<br>";
    this.debug += "Rocks: " + this.num_rocks + "<br>";
    this.debug += "Keys: " + this.num_keys + "<br>";
    this.debug += "Locks: " + this.num_locks + "<br>";
}
//-------------------------------------------------------------------------------------------------
// Render a floor as an image
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.DisplayFloor = function (floor)
{
    this.image.src = this.canvas [floor].toDataURL();
}
//-------------------------------------------------------------------------------------------------
// Show some cells
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.ExposeCells = function (pos)
{
    if (this.cells [pos].type == CELL_ROOM)
    {
        this.ExposeRoom (pos);
    }
    else
    {
        this.ExposeArea (pos);
    }
}
//-------------------------------------------------------------------------------------------------
// Show some cells
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.ExposeArea = function (pos)
{
    this.ExposeCell (pos);

    for (var i = 0 ; i < 8 ; ++i)
    {
        this.ExposeCell (pos + all8 [i]);
    }
}
//-------------------------------------------------------------------------------------------------
// Show some cells
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.ExposeCell = function (pos)
{
    if (! this.cells [pos].seen)
    {
        this.cells [pos].seen = true;
        this.ReconstructCell (pos);
    }
}
//-------------------------------------------------------------------------------------------------
// Show room
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.ExposeRoom = function (pos)
{
    var to_do = [];
    var idx = 0;

    to_do.push (pos);

    // Identify the cells

    while (idx < to_do.length)
    {
        var p2 = to_do [idx];

        if (this.cells [p2].type == CELL_ROOM)
        {
            for (var i = 0 ; i < 8 ; ++i)
            {
                var p3 = p2 + all8 [i];

                if (to_do.indexOf(p3) == -1)
                {
                    if (! this.cells [p3].seen)
                    {
                        to_do.push (p3);
                    }
                }
            }
        }
        ++ idx;
    }

    // Expose them

    idx = 0;

    while (idx < to_do.length)
    {
        this.ExposeCell (to_do [idx]);
        ++ idx;
    }
}
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.ReconstructCell = function (pos)
{
    var temp = MultiLevelMaze.DeconstructPosition (pos);

    var floor = temp [2];
    var y = temp [1];
    var x = temp [0];

    this.cells [pos].Draw (this.canvas [floor], x, y, false);

    // Draw wall facings - avoids having 2^8 separate images

    if (this.cells [pos].type == CELL_WALL)
    {
        var nw = this.cells [pos-WIDTH-1].type == CELL_ROOM;
        var n = this.cells [pos-WIDTH].type == CELL_ROOM;
        var ne = this.cells [pos-WIDTH+1].type == CELL_ROOM;
        var w = this.cells [pos-1].type == CELL_ROOM;
        var e = this.cells [pos+1].type == CELL_ROOM;
        var sw = this.cells [pos+WIDTH-1].type == CELL_ROOM;
        var s = this.cells [pos+WIDTH].type == CELL_ROOM;
        var se = this.cells [pos+WIDTH+1].type == CELL_ROOM;

        this.cells [pos].DrawWallFacings (this.canvas [floor], x, y, nw, n, ne, w, e, sw, s, se);
    }

    else if (this.cells [pos].type == CELL_CORRIDOR)
    {
        if (this.cells [pos].special == SPECIAL_DOOR)
        {
            var n = this.cells [pos-WIDTH].type == CELL_ROOM;
            var w = this.cells [pos-1].type == CELL_ROOM;
            var e = this.cells [pos+1].type == CELL_ROOM;
            var s = this.cells [pos+WIDTH].type == CELL_ROOM;

            this.cells [pos].DrawDoorFacings (this.canvas [floor], x, y, n, w, e, s);
        }
    }
}
//-------------------------------------------------------------------------------------------------
// Remove the player's image from a cell
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.RemovePlayerImage = function (player)
{
    var temp = MultiLevelMaze.DeconstructPosition (player.pos);

    var floor = temp [2];
    var y = temp [1];
    var x = temp [0];

    this.cells [player.pos].Draw (this.canvas [floor], x, y, false);
}
//-------------------------------------------------------------------------------------------------
// Add the player's image to a cell
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.DrawPlayerImage = function (player)
{
    var temp = MultiLevelMaze.DeconstructPosition (player.pos);

    var floor = temp [2];
    var y = temp [1];
    var x = temp [0];

    this.cells [player.pos].Draw (this.canvas [floor], x, y, true);
}
//-------------------------------------------------------------------------------------------------
// Create canvases for the individual floors
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.CreateCanvas = function ()
{
    this.canvas = new Array ();

    for (var i = 0 ; i < DEPTH ; ++i)
    {
        this.InitialiseCanvas (i);
    }
}
//-------------------------------------------------------------------------------------------------
// Create canvas for a single floor
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.InitialiseCanvas = function (floor)
{
    this.canvas [floor] = document.createElement('canvas');
    this.canvas [floor].width = WIDTH * CELL_SIZE;
    this.canvas [floor].height = HEIGHT * CELL_SIZE;
}
//-------------------------------------------------------------------------------------------------
// Create the cells - cells are initialised to "impenetrable". The playing area is then
// carved out.
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.CreateCells = function ()
{
    this.cells = new Array ();

    for (var i = 0 ; i < WIDTH * HEIGHT * DEPTH ; ++i)
    {
        this.cells.push (new MazeCell ());
    }

    for (var f = 0 ; f < DEPTH ; ++f)
    {
        for (var y = 1 ; y < HEIGHT-1 ; ++y)
        {
            var pos = FLOOR_AREA * f + WIDTH * y + 1;

            for (var x = 1 ; x < WIDTH-1 ; ++x)
            {
                this.cells [pos].type = CELL_ROCK;
                pos ++;
            }
        }
    }
}
//-------------------------------------------------------------------------------------------------
// Show the whole floor regardless of whether it has been seen
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.ShowFloor = function (floor)
{
    var pos = FLOOR_AREA * floor;

    for (var i = 0 ; i < FLOOR_AREA ; ++i)
    {
        this.ReconstructCell (pos);
        ++ pos;
    }
}
//-------------------------------------------------------------------------------------------------
// Draw the whole floor, showing only the seen cells.
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.RedrawFloor = function (floor)
{
    this.InitialiseCanvas (floor);

    var pos = floor * FLOOR_AREA;

    for (var i = 0 ; i < FLOOR_AREA ; ++i)
    {
        if (this.cells [pos].seen)
        {
            this.ReconstructCell (pos);
        }
        ++ pos;
    }
}
//-------------------------------------------------------------------------------------------------
// Show the tagged cells (ignores the seen flag)
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.DrawTags = function (floor)
{
    var pos = floor * FLOOR_AREA;

    for (var y = 0 ; y < HEIGHT  ; ++y)
    {
        for (var x = 0 ; x < WIDTH  ; ++x)
        {
            this.cells [pos].DrawTag (this.canvas [floor], x, y);
            ++ pos;
        }
    }
}
//-------------------------------------------------------------
// Is the supplied key one we can handle (1 = yes, 0 = no)
//-------------------------------------------------------------
function IsMazeKey (key)
{
    return maze_keys.indexOf(key) != -1;
}
//----------------------------------------------------------------------------------------
// Keyboard handler - returns true if the maze needs to be redrawn, false if it doesn't.
//----------------------------------------------------------------------------------------
MultiLevelMaze.prototype.OnKey = function (key)
{
    if (this.in_conversation)
    {
        return false;
    }

    var pos = this.player.pos;

    switch (key)
    {
        case KEY_WEST:
            return this.MovePlayer (pos, pos - 1);

        case KEY_EAST:
            return this.MovePlayer (pos, pos + 1);

        case KEY_NORTH:
            return this.MovePlayer (pos, pos - WIDTH);

        case KEY_SOUTH:
            return this.MovePlayer (pos, pos + WIDTH);

        case KEY_UP:
            if (this.cells [pos].special == SPECIAL_UP)
            {
                return this.MovePlayer (pos, pos - FLOOR_AREA);
            }
            break;

        case KEY_DOWN:
            if (this.cells [pos].special == SPECIAL_DOWN)
            {
                return this.MovePlayer (pos, pos + FLOOR_AREA);
            }
            break;

        case KEY_PICK_UP:
            return this.PickUpItems (this.cells [pos]);
            break;

        case KEY_INVENTORY:
            MazePopup.Show (MazeItem.MakeInventoryText (this.player.items));
            break;

        case KEY_CAST:
            MazePopup.Show (this.spell.MakeSpellConstructor ());
            break;

        case KEY_DROP:
            MazePopup.Show (MazeItem.MakeDropText (this.player.items, this.cells [this.player.pos].items));
            break;

        case KEY_RUNES:
            MazePopup.Show (Spell.MakeRuneList ());
            return true;

        default:
            alert ("Nothing");
            break;
    }
    return false;
}
//----------------------------------------------------------------------------------------
MultiLevelMaze.prototype.DropItem = function (item_type)
{
    MazeItem.TransferItemType (item_type, this.player.items, this.cells [this.player.pos].items);
    MazePopup.Replace (MazeItem.MakeDropText (this.player.items, this.cells [this.player.pos].items));
    Redraw ();
}
//----------------------------------------------------------------------------------------
MultiLevelMaze.prototype.PickUpItem = function (item_type)
{
    MazeItem.TransferItemType (item_type, this.cells [this.player.pos].items, this.player.items);
    MazePopup.Replace (MazeItem.MakeDropText (this.player.items, this.cells [this.player.pos].items));
    Redraw ();
}
//----------------------------------------------------------------------------------------
// Keyboard handler - returns 1 if the maze needs to be redrawn, 0 if it doesn't.
//----------------------------------------------------------------------------------------
MultiLevelMaze.prototype.MovePlayer = function (pos_from, pos_to)
{
    if (! this.CheckSpecialCell (pos_to))
    {
        return false;
    }

    var redraw = false;

    if (this.cells [pos_to].IsFree ())
    {
        var old_pos = FLOOR_AREA * this.player.floor + WIDTH * this.player.y + this.player.x;

        this.ExposeCells (pos_to);

        // Move the player's image

        this.RemovePlayerImage (this.player);

        this.player.pos = pos_to;
        this.player.floor = Math.floor (pos_to / FLOOR_AREA);

        this.DrawPlayerImage (this.player);

        if (this.cells [pos_to].special == SPECIAL_END)
        {
            this.ShowAlert ("Well done, you've found the exit");
        }

        return true;
    }
    this.debug = "Move failed";
    return redraw;
}
//----------------------------------------------------------------------------------------
// Check for special actions when the user encounters a special cell
//----------------------------------------------------------------------------------------
MultiLevelMaze.prototype.CheckSpecialCell = function (pos)
{
    switch (this.cells [pos].special)
    {
        case SPECIAL_GREEN_LOCK:
            return this.DoUnlock (pos, ITEM_GREEN_KEY);

        case SPECIAL_BLUE_LOCK:
            return this.DoUnlock (pos, ITEM_BLUE_KEY);

        case SPECIAL_YELLOW_LOCK:
            return this.DoUnlock (pos, ITEM_YELLOW_KEY);

        case SPECIAL_MAGENTA_LOCK:
            return this.DoUnlock (pos, ITEM_MAGENTA_KEY);

        case SPECIAL_RED_LOCK:
            return this.DoUnlock (pos, ITEM_RED_KEY);
    }

    return true;
}
//----------------------------------------------------------------------------------------
// Unlock a door
//----------------------------------------------------------------------------------------
MultiLevelMaze.prototype.DoUnlock = function (pos, required_item)
{
    if (! this.player.HasItem (required_item))
    {
        this.ShowAlert ("This door requires a " + item_names [required_item]);
        return false;
    }

    if (! this.AskYesNoQuestion ("Would you like to unlock this door"))
    {
        return false;
    }

    this.cells [pos].special = SPECIAL_NONE;
    this.player.RemoveItem (required_item);

    return true;
}
//----------------------------------------------------------------------------------------
MultiLevelMaze.prototype.PickUpItems = function (cell)
{
    if (cell.items.length == 0)
    {
        return false;
    }

    for (var i = 0 ; i < cell.items.length ; ++i)
    {
        this.player.items.push (cell.items [i]);
    }

    cell.items = [];
    return true;
}
//----------------------------------------------------------------------------------------
// Text describing the player's inventory
//----------------------------------------------------------------------------------------
MultiLevelMaze.prototype.ShowInventory = function ()
{
    this.player.ShowInventory ();
}
//----------------------------------------------------------------------------------------
// Text describing the player
//----------------------------------------------------------------------------------------
MultiLevelMaze.prototype.GetPlayerText = function ()
{
    var x = MultiLevelMaze.DeconstructPosition (this.player.pos);

    return "at (" + x[0] + ", " + x[1] + ") on floor " + (x[2]+1);
}
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.CellText = function (pos)
{
    var floor = Math.floor (pos / FLOOR_AREA);
    var p2 = pos - floor * FLOOR_AREA;
    var y = Math.floor (p2 / WIDTH);
    p2 -= y * WIDTH;
    var type = "Error";

    try
    {
        type = TypeNames [this.cells[pos].type];
    }
    catch (err) {}

    return "(" + p2 + "," + y + "," + floor + ") = " + type;
}
//-------------------------------------------------------------------------------------------------
// Disables keyboard whilst in conversation.
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.ShowAlert = function (message)
{
    if (! this.in_conversation)
    {
        this.in_conversation = true;
        alert (message);
        this.in_conversation = false;
    }
}
//-------------------------------------------------------------------------------------------------
// Display the path to something
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.CastFindSpell = function (level, power, target)
{
    var checker = null;

    switch (target)
    {
        case SPELL_PLAYER:
            alert ("You already know where you are");
            return;

        case SPELL_MONSTER:
            alert ("There aren't any monsters in this maze");
            return;

        case SPELL_STRUCTURE:
            alert ("There aren't any structures in this maze");
            return;

        case SPELL_HOME:
            checker = new SpecialChecker (SPECIAL_START);
            break;

        case SPELL_EXIT:
            checker = new SpecialChecker (SPECIAL_END);
            break;

        case SPELL_LOCK:
            checker = new LockChecker ();
            break;

        case SPELL_KEY:
            checker = new ItemMaskChecker (ITEM_MASK_KEY);
            break;

        case SPELL_GEM:
            checker = new ItemMaskChecker (ITEM_MASK_GEM);
            break;

        case SPELL_FLAG:
            checker = new ItemMaskChecker (ITEM_MASK_FLAG);
            break;

        case SPELL_BEACON:
            alert ("looking for beacon");
            checker = new ItemMaskChecker (ITEM_MASK_BEACON);
            break;

        case SPELL_ANYTHING:
            checker = new AnythingChecker ();
            break;

        default:
            alert ("Unknown target " + target);
            break;
    }

    // Construct the path and pass it to the Animator

    var path = this.FindPath (this.player.pos, checker);

    if (path != null)
    {
        var animation = new AnimatedPath ();

        animation.floor = floor;
        animation.duration = spell_powers [power] * 10;
        animation.path = [];

        var to_draw = spell_levels [level] * 3;
        var num = path.length;

        if (to_draw > num)
        {
            to_draw = num;
        }

        for (var i = 1 ; i <= to_draw ; ++i)
        {
            animation.path.push (path [num - i]);
        }

        this.animator.paths.push (animation);
    }
}
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.FindPath = function (current_pos, finder)
{
    // Use the tags to record where we have been.

    for (var i = 0 ; i < VOLUME ; ++i)
    {
        this.cells [i].tag = NO_TAG;
    }

    // Order the cells according to how close they are to the start until we reach the end

    var idx = 0;
    var stack = [];
    var finished = false;
    var target_pos = -1;

    stack.push (current_pos);
    this.cells [current_pos].tag = 1;

    while (idx < stack.length && ! finished)
    {
        var pos = stack [idx];
        var current_tag = this.cells [pos].tag + 1;
        ++idx;

        var neighbours = this.GetNeighbours (pos);

        for (var i = 0 ; i < neighbours.length ; ++i)
        {
            var p = neighbours [i];

            if (this.cells [p].tag == NO_TAG && this.cells [p].IsPotentiallyFree ())
            {
                this.cells [p].tag = current_tag;
                stack.push (p);

                if (finder.CheckCell (this.cells [p]))
                {
                    finished = true;
                    target_pos = p;
                    break;
                }
            }
        }
    }
    if (! finished)
    {
        alert ("No route");
        return null;
    }

    // trace back to the start
    // trace back to the start

    var route = [];

    pos = target_pos;
    current_tag = this.cells [pos].tag;
    var path_length = current_tag;

    for (var j = 0 ; j <= path_length ; ++j)
    {
        --current_tag;

        if (current_tag == 1)
        {
            return route;
        }

        var neighbours = this.GetNeighbours (pos);

        for (var i = 0 ; i < neighbours.length ; ++i)
        {
            var p = neighbours [i];

            if (this.cells [p].tag == current_tag)
            {
                route.push (p);
                pos = p;
                break;
            }
        }
    }

    alert ("Can't trace back");
    return null;
}
//-------------------------------------------------------------------------------------------------
// Get the accessible neighbours of a cell.
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.GetNeighbours = function (pos)
{
    var neighbours = [pos-1, pos+1, pos-WIDTH, pos+WIDTH];

    if (this.cells [pos].special == SPECIAL_UP)
    {
        neighbours.push (pos-FLOOR_AREA);
    }
    if (this.cells [pos].special == SPECIAL_DOWN)
    {
        neighbours.push (pos+FLOOR_AREA);
    }

    return neighbours;
}
//-------------------------------------------------------------------------------------------------
// Disables keyboard whilst in conversation.
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.prototype.AskYesNoQuestion = function (message)
{
    if (! this.in_conversation)
    {
        this.in_conversation = true;
        var ret = confirm (message);
        this.in_conversation = false;
    }
    return ret;
}
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.DeconstructPosition = function (pos)
{
    var floor = Math.floor (pos / FLOOR_AREA);
    var p2 = pos - floor * FLOOR_AREA;
    var y = Math.floor (p2 / WIDTH);
    var x = p2 - y * WIDTH;

    return [x, y, floor];
}
//-------------------------------------------------------------------------------------------------
MultiLevelMaze.MakePosition = function (x, y, floor)
{
    return FLOOR_AREA * floor + WIDTH * y + x;
}






