//-------------------------------------------------------------------------------------------------
// Items for use in the javascript maze.
// (c) John Whitehouse 2013
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

// Keys

var ITEM_MAGENTA_KEY = 0x100;
var ITEM_GREEN_KEY = 0x101;
var ITEM_BLUE_KEY = 0x102;
var ITEM_YELLOW_KEY = 0x103;
var ITEM_RED_KEY = 0x104;

// Flags

var ITEM_RED_FLAG = 0x200;
var ITEM_BLUE_FLAG = 0x201;
var ITEM_GREEN_FLAG = 0x202;

// Gems

var ITEM_RED_GEM = 0x400;
var ITEM_GREEN_GEM = 0x401;
var ITEM_BLUE_GEM = 0x402;
var ITEM_YELLOW_GEM = 0x403;
var ITEM_WHITE_GEM = 0x404;

// Beacons

var ITEM_BEACON = 0x800;

// Item masks

var ITEM_MASK_KEY = 0x100;
var ITEM_MASK_FLAG = 0x200;
var ITEM_MASK_GEM = 0x400;
var ITEM_MASK_BEACON = 0x800;

// Items that may be found in the maze

var known_items =
[
    ITEM_MAGENTA_KEY,
    ITEM_GREEN_KEY,
    ITEM_BLUE_KEY,
    ITEM_YELLOW_KEY,
    ITEM_RED_KEY,
    ITEM_RED_FLAG,
    ITEM_BLUE_FLAG,
    ITEM_GREEN_FLAG,
    ITEM_RED_GEM,
    ITEM_GREEN_GEM,
    ITEM_BLUE_GEM,
    ITEM_YELLOW_GEM,
    ITEM_WHITE_GEM,
    ITEM_BEACON
];

var item_image = {};

item_image [ITEM_MAGENTA_KEY] = LoadImage ("images/magenta_key.png");
item_image [ITEM_GREEN_KEY] = LoadImage ("images/green_key.png");
item_image [ITEM_BLUE_KEY] = LoadImage ("images/blue_key.png");
item_image [ITEM_YELLOW_KEY] = LoadImage ("images/yellow_key.png");
item_image [ITEM_RED_KEY] = LoadImage ("images/red_key.png");
item_image [ITEM_RED_FLAG] = LoadImage ("images/red_flag.png");
item_image [ITEM_BLUE_FLAG] = LoadImage ("images/blue_flag.png");
item_image [ITEM_GREEN_FLAG] = LoadImage ("images/green_flag.png");
item_image [ITEM_RED_GEM] = LoadImage ("images/red_gem.png");
item_image [ITEM_GREEN_GEM] = LoadImage ("images/green_gem.png");
item_image [ITEM_BLUE_GEM] = LoadImage ("images/blue_gem.png");
item_image [ITEM_YELLOW_GEM] = LoadImage ("images/yellow_gem.png");
item_image [ITEM_WHITE_GEM] = LoadImage ("images/white_gem.png");
item_image [ITEM_BEACON] = LoadImage ("images/beacon.png");

var item_image_files = {};

item_image_files [ITEM_MAGENTA_KEY] = "images/big_magenta_key.png";
item_image_files [ITEM_GREEN_KEY] = "images/big_green_key.png";
item_image_files [ITEM_BLUE_KEY] = "images/big_blue_key.png";
item_image_files [ITEM_YELLOW_KEY] = "images/big_yellow_key.png";
item_image_files [ITEM_RED_KEY] = "images/big_red_key.png";
item_image_files [ITEM_RED_FLAG] = "images/red_flag.png";
item_image_files [ITEM_BLUE_FLAG] = "images/blue_flag.png";
item_image_files [ITEM_GREEN_FLAG] = "images/green_flag.png";
item_image_files [ITEM_RED_GEM] = "images/red_gem.png";
item_image_files [ITEM_GREEN_GEM] = "images/green_gem.png";
item_image_files [ITEM_BLUE_GEM] = "images/blue_gem.png";
item_image_files [ITEM_YELLOW_GEM] = "images/yellow_gem.png";
item_image_files [ITEM_WHITE_GEM] = "images/white_gem.png";
item_image_files [ITEM_BEACON] = "images/beacon.png";

var item_names = {};

item_names [ITEM_MAGENTA_KEY] = "Magenta key";
item_names [ITEM_GREEN_KEY] = "Green key";
item_names [ITEM_BLUE_KEY] = "Blue key";
item_names [ITEM_YELLOW_KEY] = "Yellow key";
item_names [ITEM_RED_KEY] = "Red key";
item_names [ITEM_RED_FLAG] = "Red flag";
item_names [ITEM_BLUE_FLAG] = "Blue flag";
item_names [ITEM_GREEN_FLAG] = "Green flag";
item_names [ITEM_RED_GEM] = "Red gem";
item_names [ITEM_GREEN_GEM] = "Green gem";
item_names [ITEM_BLUE_GEM] = "Blue gem";
item_names [ITEM_YELLOW_GEM] = "Yellow gem";
item_names [ITEM_WHITE_GEM] = "White gem";
item_names [ITEM_BEACON] = "Beacon";

//-------------------------------------------------------------------------------------------------
// Create an item
//-------------------------------------------------------------------------------------------------
function MazeItem (id)
{
    this.id = id;
    this.name = item_names [id];
}
//-------------------------------------------------------------------------------------------------
MazeItem.TransferItemType = function (item_type, from_items, to_items)
{
    for (var i = 0 ; i < from_items.length ; ++i)
    {
        if (from_items [i].id == item_type)
        {
            to_items.push (from_items [i]);
            from_items.splice (i, 1);
            break;
        }
    }
}
//-------------------------------------------------------------------------------------------------
MazeItem.MakeInventoryText = function (items)
{
    var text = "<h1> Inventory </h1>";
    text += "<table>";
    text += "<tr> <th> Item </th> <th> Description </th></tr>";

    var counters = {};
    var num_items = known_items.length;

    for (var i = 0 ; i < num_items ; ++i)
    {
        counters [known_items [i]] = 0;
    }

    for (var i = 0 ; i < items.length ; ++i)
    {
        counters [items [i].id] += 1;
    }

    for (var i = 0 ; i < num_items ; ++i)
    {
        var item_id = known_items [i];

        if (counters [item_id] > 0)
        {
            text += "<tr>";
            text += "<td><img src=\"" + item_image_files [item_id] + "\" alt=\"\"></td>";
            text += "<td>" + item_names [item_id];

            if (counters [item_id] > 1)
            {
                text += " (x" + counters [item_id] + ")";
            }

            text += "</td></tr>";
        }
    }

    text += "</table>";
    return text;
}
//-------------------------------------------------------------------------------------------------
MazeItem.MakeDropText = function (player_items, floor_items)
{
    var text = "<h1> Exchange Items </h1>";

    text += "<p> Click on the item to drop or pick up. </p>"
    text += "<table border=\"2\">";
    text += "<tr> <th> Player </th> <th> Description </th> <th> Floor </th></tr>";

    var payer_counters = [];
    var floor_counters = [];

    var num_items = known_items.length;

    for (var i = 0 ; i < num_items ; ++i)
    {
        payer_counters [known_items [i]] = 0;
        floor_counters [known_items [i]] = 0;
    }

    for (var i = 0 ; i < player_items.length ; ++i)
    {
        payer_counters [player_items [i].id] += 1;
    }
    for (var i = 0 ; i < floor_items.length ; ++i)
    {
        floor_counters [floor_items [i].id] += 1;
    }

    for (var i = 0 ; i < num_items ; ++i)
    {
        var item_id = known_items [i];

        if (payer_counters [item_id] > 0 || floor_counters [item_id] > 0)
        {
            text += "<tr>";

            // Player stuff

            if (payer_counters [item_id] > 0)
            {
                text += "<td> <img src=\"" + item_image_files [item_id] + "\" alt=\"\" OnClick=\"maze.DropItem(" + item_id + ");\">";

                if (payer_counters [item_id] > 1)
                {
                    text += " (x" + payer_counters [item_id] + ")";
                }
                text += "</td>";
            }
            else
            {
                text += "<td> &nbsp; </td>";
            }

            // Name

            text += "<td> " + item_names [item_id] + "</td>";

            // Gound stuff

            if (floor_counters [item_id] > 0)
            {
                text += "<td> <img src=\"" + item_image_files [item_id] + "\" alt=\"\" OnClick=\"maze.PickUpItem(" + item_id + ");\">";

                if (floor_counters [item_id] > 1)
                {
                    text += " (x" + floor_counters [item_id] + ")";
                }
                text += "</td>";
            }
            else
            {
                text += "<td> &nbsp; </td>";
            }
            text += "</tr>";
        }
    }

    text += "</table>";

    return text;
}


