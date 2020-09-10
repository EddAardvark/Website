//-------------------------------------------------------------------------------------------------
// A cell in a sculpture garden
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------


//==============================================================
SculptureGarden.Cell = function(position, type)
{
    this.position = position;
    this.type = type;
}
SculptureGarden.Cell.INVALID = -1;
SculptureGarden.Cell.OUTSIDE = 0;
SculptureGarden.Cell.SOLID = 1;
SculptureGarden.Cell.ROOM = 2;
SculptureGarden.Cell.CORRIDOR = 3;
SculptureGarden.Cell.PATH = 4;
SculptureGarden.Cell.CORRIDOR_WALL = 5;
SculptureGarden.Cell.EXTERNAL_WALL = 6;
SculptureGarden.Cell.ROOM_WALL = 7;
SculptureGarden.Cell.SOLID_TREE = 8;
SculptureGarden.Cell.GAZEBO = 9;
SculptureGarden.Cell.VOID = 10;
SculptureGarden.Cell.MAZE_WALL = 11;
SculptureGarden.Cell.MAZE_WATER = 12;
SculptureGarden.Cell.DARK_MAZE_WALL = 13;


SculptureGarden.Cell.GARDEN_GRID = 5;

SculptureGarden.Cell.type_colour = {};

SculptureGarden.Cell.garden_colour_range = ["DarkOliveGreen", "PaleGreen"];
SculptureGarden.Cell.void_colour_range = ["BlueViolet", "Indigo"];

SculptureGarden.Cell.garden_colours = new Array (SculptureGarden.Cell.GARDEN_GRID * SculptureGarden.Cell.GARDEN_GRID);
SculptureGarden.Cell.void_colours = new Array (SculptureGarden.Cell.GARDEN_GRID * SculptureGarden.Cell.GARDEN_GRID);

// Floor colourings

SculptureGarden.Cell.floor_colours_oct = {};
SculptureGarden.Cell.floor_colours_sq = {};

SculptureGarden.Cell.floor_colours_oct [SculptureGarden.Cell.ROOM] = ["Thistle", "Fuchsia"];
SculptureGarden.Cell.floor_colours_oct [SculptureGarden.Cell.CORRIDOR] = ["White", "DodgerBlue"];
SculptureGarden.Cell.floor_colours_oct [SculptureGarden.Cell.PATH] = ["SaddleBrown", "Peru"];
SculptureGarden.Cell.floor_colours_oct [SculptureGarden.Cell.SOLID_TREE] = ["DarkOliveGreen", "Olive"];
SculptureGarden.Cell.floor_colours_oct [SculptureGarden.Cell.MAZE_WALL] = ["Orange", "Chartreuse"];
SculptureGarden.Cell.floor_colours_oct [SculptureGarden.Cell.DARK_MAZE_WALL] = ["Orange", "Chartreuse"];
SculptureGarden.Cell.floor_colours_oct [SculptureGarden.Cell.MAZE_WATER] = ["LightBlue", "MidnightBlue"];
SculptureGarden.Cell.floor_colours_oct [SculptureGarden.Cell.DARK_PATH] = ["SaddleBrown", "MidnightBlue"];

SculptureGarden.Cell.floor_colours_sq [SculptureGarden.Cell.ROOM] = ["DarkOrchid", "Indigo"];
SculptureGarden.Cell.floor_colours_sq [SculptureGarden.Cell.CORRIDOR] = ["DarkTurquoise", "DarkBlue"];
SculptureGarden.Cell.floor_colours_sq [SculptureGarden.Cell.PATH] = ["SandyBrown", "RosyBrown"];
SculptureGarden.Cell.floor_colours_sq [SculptureGarden.Cell.SOLID_TREE] = ["DarkOliveGreen", "Olive"];
SculptureGarden.Cell.floor_colours_sq [SculptureGarden.Cell.DARK_MAZE_WALL] = ["DarkOrange", "GreenYellow"];
SculptureGarden.Cell.floor_colours_sq [SculptureGarden.Cell.MAZE_WALL] = ["DarkOrange", "GreenYellow"];
SculptureGarden.Cell.floor_colours_sq [SculptureGarden.Cell.DARK_PATH] = ["SaddleBrown", "Black"];

// Sky colourings

SculptureGarden.Cell.sky_colours_oct = {};
SculptureGarden.Cell.sky_colours_sq = {};

SculptureGarden.Cell.sky_colours_oct [SculptureGarden.Cell.ROOM] = ["Silver", "LavenderBlush"];
SculptureGarden.Cell.sky_colours_oct [SculptureGarden.Cell.CORRIDOR] = ["MediumTurquoise", "RoyalBlue"];
SculptureGarden.Cell.sky_colours_oct [SculptureGarden.Cell.GAZEBO] = ["FireBrick", "IndianRed"];
SculptureGarden.Cell.sky_colours_oct [SculptureGarden.Cell.DARK_PATH] = ["Black", "Maroon"];

SculptureGarden.Cell.sky_colours_sq [SculptureGarden.Cell.ROOM] = ["LemonChiffon", "BlanchedAlmond"];
SculptureGarden.Cell.sky_colours_sq [SculptureGarden.Cell.CORRIDOR] = ["LightSeaGreen", "SlateBlue"];
SculptureGarden.Cell.sky_colours_sq [SculptureGarden.Cell.GAZEBO] = ["FireBrick", "IndianRed"];
SculptureGarden.Cell.sky_colours_sq [SculptureGarden.Cell.DARK_PATH] = ["Black", "FireBrick"];

// Wall colourings

SculptureGarden.Cell.wall_colours = {};

SculptureGarden.Cell.wall_colours[SculptureGarden.Cell.CORRIDOR_WALL] = ["CadetBlue", "MidnightBlue"];
SculptureGarden.Cell.wall_colours[SculptureGarden.Cell.EXTERNAL_WALL] = ["SaddleBrown", "Burlywood"];
SculptureGarden.Cell.wall_colours[SculptureGarden.Cell.ROOM_WALL] = ["FireBrick", "DarkRed"];

// Colours that appear on the map

SculptureGarden.Cell.type_colour [SculptureGarden.Cell.SOLID] = "Gray";
SculptureGarden.Cell.type_colour [SculptureGarden.Cell.ROOM] = "gold";
SculptureGarden.Cell.type_colour [SculptureGarden.Cell.CORRIDOR] = "White";
SculptureGarden.Cell.type_colour [SculptureGarden.Cell.PATH] = "SaddleBrown";
SculptureGarden.Cell.type_colour [SculptureGarden.Cell.CORRIDOR_WALL] = "DarkSlateGray";
SculptureGarden.Cell.type_colour [SculptureGarden.Cell.EXTERNAL_WALL] = "DimGray";
SculptureGarden.Cell.type_colour [SculptureGarden.Cell.ROOM_WALL] = "maroon";
SculptureGarden.Cell.type_colour [SculptureGarden.Cell.SOLID_TREE] = "DarkGreen";
SculptureGarden.Cell.type_colour [SculptureGarden.Cell.GAZEBO] = "FireBrick";
SculptureGarden.Cell.type_colour [SculptureGarden.Cell.MAZE_WALL] = "Chartreuse";
SculptureGarden.Cell.type_colour [SculptureGarden.Cell.DARK_MAZE_WALL] = "Chartreuse";
SculptureGarden.Cell.type_colour [SculptureGarden.Cell.MAZE_WATER] = "RoyalBlue";
SculptureGarden.Cell.type_colour [SculptureGarden.Cell.DARK_PATH] = "SaddleBrown";

// Flags

SculptureGarden.Cell.flags = {};

SculptureGarden.Cell.flags[SculptureGarden.Cell.OUTSIDE] = {"is_solid":false, "is_viewable":true, "has_walls":false, "is_passable":true, "is_outside":true, "is_path":false};
SculptureGarden.Cell.flags[SculptureGarden.Cell.SOLID] = {"is_solid":true, "is_viewable":false, "has_walls":false, "is_passable":false, "is_outside":false, "is_path":false};
SculptureGarden.Cell.flags[SculptureGarden.Cell.ROOM] = {"is_solid":false, "is_viewable":true, "has_walls":false, "is_passable":true, "is_outside":false, "is_path":false};
SculptureGarden.Cell.flags[SculptureGarden.Cell.CORRIDOR] = {"is_solid":false, "is_viewable":true, "has_walls":false, "is_passable":true, "is_outside":false, "is_path":false};
SculptureGarden.Cell.flags[SculptureGarden.Cell.PATH] = {"is_solid":false, "is_viewable":true, "has_walls":false, "is_passable":true, "is_outside":false, "is_path":true};
SculptureGarden.Cell.flags[SculptureGarden.Cell.CORRIDOR_WALL] = {"is_solid":true, "is_viewable":true, "has_walls":true, "is_passable":false, "is_outside":false, "is_path":false};
SculptureGarden.Cell.flags[SculptureGarden.Cell.EXTERNAL_WALL] = {"is_solid":true, "is_viewable":true, "has_walls":true, "is_passable":false, "is_outside":false, "is_path":false};
SculptureGarden.Cell.flags[SculptureGarden.Cell.ROOM_WALL] = {"is_solid":true, "is_viewable":true, "has_walls":true, "is_passable":false, "is_outside":false, "is_path":false};
SculptureGarden.Cell.flags[SculptureGarden.Cell.SOLID_TREE] = {"is_solid":false, "is_viewable":true, "has_walls":false, "is_passable":false, "is_outside":false, "is_path":false};
SculptureGarden.Cell.flags[SculptureGarden.Cell.GAZEBO] = {"is_solid":false, "is_viewable":true, "has_walls":false, "is_passable":true, "is_outside":false, "is_path":false};
SculptureGarden.Cell.flags[SculptureGarden.Cell.VOID] = {"is_solid":false, "is_viewable":true, "has_walls":false, "is_passable":true, "is_outside":true, "is_path":false};
SculptureGarden.Cell.flags[SculptureGarden.Cell.MAZE_WALL] = {"is_solid":false, "is_viewable":true, "has_walls":false, "is_passable":false, "is_outside":false, "is_path":false};
SculptureGarden.Cell.flags[SculptureGarden.Cell.DARK_MAZE_WALL] = {"is_solid":false, "is_viewable":true, "has_walls":false, "is_passable":false, "is_outside":false, "is_path":false};
SculptureGarden.Cell.flags[SculptureGarden.Cell.MAZE_WATER] = {"is_solid":false, "is_viewable":true, "has_walls":false, "is_passable":false, "is_outside":false, "is_path":false};
SculptureGarden.Cell.flags[SculptureGarden.Cell.DARK_PATH] = {"is_solid":false, "is_viewable":true, "has_walls":false, "is_passable":true, "is_outside":false, "is_path":true};

SculptureGarden.Cell.door_parameters = {};

//---------------------------------------------------------------------------------------------------------
SculptureGarden.Cell.Initialise = function ()
{
    var start = SculptureGarden.Cell.garden_colour_range [0];
    var end = SculptureGarden.Cell.garden_colour_range [1];

    for (var i = 0 ; i < SculptureGarden.Cell.garden_colours.length ; ++i)
    {
        SculptureGarden.Cell.garden_colours [i] = SVGColours.Blend (start, end, Math.random());
    }
    start = SculptureGarden.Cell.void_colour_range [0];
    end = SculptureGarden.Cell.void_colour_range [1];

    for (var i = 0 ; i < SculptureGarden.Cell.void_colours.length ; ++i)
    {
        SculptureGarden.Cell.void_colours [i] = SVGColours.Blend (start, end, Math.random());
    }

    SculptureGarden.Cell.DefineDoor (SculptureGarden.Cell.OUTSIDE, SculptureGarden.Cell.ROOM, "Crimson", "green", 0.4, 0.75);
    SculptureGarden.Cell.DefineDoor (SculptureGarden.Cell.OUTSIDE, SculptureGarden.Cell.CORRIDOR, "LightSlateGray", "green", 0.4, 0.75);
    SculptureGarden.Cell.DefineDoor (SculptureGarden.Cell.SOLID_TREE, SculptureGarden.Cell.ROOM, "Crimson", "green", 0.0, 0.0);
    SculptureGarden.Cell.DefineDoor (SculptureGarden.Cell.SOLID_TREE, SculptureGarden.Cell.CORRIDOR, "LightSlateGray", "green", 0.0, 0.0);
    SculptureGarden.Cell.DefineDoor (SculptureGarden.Cell.PATH, SculptureGarden.Cell.ROOM, "Crimson", "RosyBrown", 0.5, 0.75);
    SculptureGarden.Cell.DefineDoor (SculptureGarden.Cell.PATH, SculptureGarden.Cell.CORRIDOR, "LightSlateGray", "RosyBrown", 0.5, 0.75);
    SculptureGarden.Cell.DefineDoor (SculptureGarden.Cell.ROOM, SculptureGarden.Cell.CORRIDOR, "MediumSlateBlue", "Crimson", 0.5, 0.75);
    SculptureGarden.Cell.DefineDoor (SculptureGarden.Cell.OUTSIDE, SculptureGarden.Cell.GAZEBO, "FireBrick", "IndianRed", 0.5, 0.75);
    SculptureGarden.Cell.DefineDoor (SculptureGarden.Cell.PATH, SculptureGarden.Cell.GAZEBO, "FireBrick", "IndianRed", 0.5, 0.75);
    SculptureGarden.Cell.DefineDoor (SculptureGarden.Cell.OUTSIDE, SculptureGarden.Cell.VOID, "DarkViolet", "Indigo", 0.9, 0.9);
    SculptureGarden.Cell.DefineDoor (SculptureGarden.Cell.PATH, SculptureGarden.Cell.VOID, "DarkViolet", "Indigo", 0.9, 0.9);

    SculptureGarden.Cell.DefineHorizontalBarFence (SculptureGarden.Cell.SOLID_TREE, SculptureGarden.Cell.VOID, "DarkViolet", "Indigo", 3, .2, .2, .1);
    SculptureGarden.Cell.DefineHorizontalBarFence (SculptureGarden.Cell.MAZE_WATER, SculptureGarden.Cell.PATH, "RosyBrown", "Blue", 2, .15, .025, .025);

    SculptureGarden.Cell.DefineTriangleFence (SculptureGarden.Cell.MAZE_WALL, SculptureGarden.Cell.PATH, "RosyBrown", "DarkGreen", 6, 0, 0.5, 0.55, 2, 1);
    SculptureGarden.Cell.DefineTriangleFence (SculptureGarden.Cell.MAZE_WALL, SculptureGarden.Cell.OUTSIDE, "Green", "DarkOliveGreen", 8, 0, 0.5, 0.55, 2, 1);
    SculptureGarden.Cell.DefineTriangleFence (SculptureGarden.Cell.SOLID_TREE, SculptureGarden.Cell.GAZEBO, "FireBrick", "IndianRed", 4, 0, 1, 1, 4, 1);
    SculptureGarden.Cell.DefineTriangleFence (SculptureGarden.Cell.MAZE_WATER, SculptureGarden.Cell.OUTSIDE, "Green", "DarkSlateBlue", 4, 0, 0.5, 0.55, 1, 2);

    SculptureGarden.Cell.DefineTriangleFence (SculptureGarden.Cell.MAZE_WATER, SculptureGarden.Cell.DARK_PATH, "MidnightBlue", "DarkSlateBlue", 3, 0, 1, 1, 5, 1);
    SculptureGarden.Cell.DefineTriangleFence (SculptureGarden.Cell.MAZE_WALL, SculptureGarden.Cell.DARK_PATH, "Black", "DarkSlateBlue", 3, 0, 1, 1, 5, 1);
    SculptureGarden.Cell.DefineTriangleFence (SculptureGarden.Cell.DARK_MAZE_WALL, SculptureGarden.Cell.DARK_PATH, "Black", "DarkSlateBlue", 3, 0, 1, 1, 5, 1);
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Cell.DefineDoor = function (from, to, from_colour, to_colour, width, door_height)
{
    var k1 = from + "_" + to;
    var k2 = to + "_" + from;

    SculptureGarden.Cell.door_parameters [k1] = new SculptureGarden.Panels.Door (from_colour, width, door_height);
    SculptureGarden.Cell.door_parameters [k2] = new SculptureGarden.Panels.Door (to_colour, width, door_height);
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Cell.DefineTriangleFence = function (from, to, from_colour, to_colour, num, height1, height2, height3, width, gap)
{
    var k1 = from + "_" + to;
    var k2 = to + "_" + from;

    SculptureGarden.Cell.door_parameters [k1] = new SculptureGarden.Panels.TriangleFence (from_colour, num, height1, height2, height3, width, gap);
    SculptureGarden.Cell.door_parameters [k2] = new SculptureGarden.Panels.TriangleFence (to_colour, num, height1, height2, height3, width, gap);
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Cell.DefineHorizontalBarFence = function (from, to, from_colour, to_colour, num, start, bar_height, gap)
{
    var k1 = from + "_" + to;
    var k2 = to + "_" + from;

    SculptureGarden.Cell.door_parameters [k1] = new SculptureGarden.Panels.HorizontalBarFence (from_colour, num, start, bar_height, gap);
    SculptureGarden.Cell.door_parameters [k2] = new SculptureGarden.Panels.HorizontalBarFence (to_colour, num, start, bar_height, gap);
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Cell.GetDoorParameters = function (from, to)
{
    var key = from + "_" + to;

    return SculptureGarden.Cell.door_parameters [key];
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Cell.prototype.InitialiseArtwork = function ()
{
    var sides = (this.position.shape_type == OctoPoints.OCTAGON) ? 8 : 4;
    this.artwork = new Array (sides);
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Cell.prototype.IsSolid = function()
{
    return SculptureGarden.Cell.flags [this.type].is_solid;
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Cell.prototype.IsViewable = function()
{
    return SculptureGarden.Cell.flags [this.type].is_viewable;
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Cell.prototype.IsOutside = function()
{
    return SculptureGarden.Cell.flags [this.type].is_outside;
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Cell.prototype.IsPath = function()
{
    return SculptureGarden.Cell.flags [this.type].is_path;
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Cell.prototype.IsPassable = function()
{
    return SculptureGarden.Cell.flags [this.type].is_passable;
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Cell.prototype.HasWalls = function()
{
    return SculptureGarden.Cell.flags [this.type].has_walls;
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Cell.prototype.GetMapColour = function ()
{
    return (this.room)
                ? this.room.GetMapColour (this.position.x_pos, this.position.y_pos)
                : this.GetTypeColour ();
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Cell.prototype.GetTypeColour = function ()
{
    return SculptureGarden.Cell.type_colour [this.type];
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Cell.prototype.SetGardenColours = function(pos, type)
{
    var idx = SculptureGarden.Cell.GARDEN_GRID * Math.abs((pos.x_pos % SculptureGarden.Cell.GARDEN_GRID)) + Math.abs((pos.y_pos % SculptureGarden.Cell.GARDEN_GRID));

    if (type == SculptureGarden.Cell.VOID)
    {
        this.floor_colour = SculptureGarden.Cell.void_colours [idx];
    }
    if (type == SculptureGarden.Cell.OUTSIDE)
    {
        this.floor_colour = SculptureGarden.Cell.garden_colours [idx];
    }
    this.sky_colour = null;
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Cell.prototype.SetColours = function()
{
    if (this.position.shape_type == OctoPoints.OCTAGON)
    {
        var floor_colours = SculptureGarden.Cell.floor_colours_oct [this.type];
        var sky_colours = SculptureGarden.Cell.sky_colours_oct [this.type];

        if (floor_colours)
        {
            this.floor_colour = SVGColours.Blend (floor_colours[0], floor_colours[1], Math.random());
        }

        if (sky_colours)
        {
            this.sky_colour = SVGColours.Blend (sky_colours[0], sky_colours[1], Math.random());
        }
    }
    else
    {
        var floor_colours = SculptureGarden.Cell.floor_colours_sq [this.type];
        var sky_colours = SculptureGarden.Cell.sky_colours_sq [this.type];

        if (floor_colours)
        {
            this.floor_colour = SVGColours.Blend (floor_colours[0], floor_colours[1], Math.random());
        }
        if (sky_colours)
        {
            this.sky_colour = SVGColours.Blend (sky_colours[0], sky_colours[1], Math.random());
        }
    }

    if (SculptureGarden.Cell.wall_colours[this.type])
    {
        this.SetWallColours (SculptureGarden.Cell.wall_colours[this.type][0], SculptureGarden.Cell.wall_colours[this.type][1]);
    }
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Cell.prototype.SetWallColours = function(start, end)
{
    this.wall_colour = new Array(8);

    for (var i = 0 ; i < 8 ; ++i)
    {
        this.wall_colour [i] = SVGColours.Blend (start, end, Math.random());
    }
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Cell.prototype.toString = function()
{
    return Misc.Format ("SG cell at {0}, type = {1}", this.position, this.type);
}
