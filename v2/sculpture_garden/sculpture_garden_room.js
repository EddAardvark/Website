//-------------------------------------------------------------------------------------------------
// A sculpture garden is a collection of galleries displaying artworks set in a garden displaying sculptures
// There may also be some sculptures inside the galleries. This file implements a room within a gallery.
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------
SculptureGarden.Room = function(x, y, w, h)
{
    Rectangle.call(this);

    this.doors = [];
    this.type = Misc.RandomElement (SculptureGarden.Room.Types);
    this.display_art = SculptureGarden.Room.ArtTypes [this.type];

    this.SetPosition (x, y, w, h);
}
// Inherit the rectangle prototype

SculptureGarden.Room.prototype = Object.create(Rectangle.prototype);

SculptureGarden.Room.Types = ["TRIANGLE", "FIVE_CELL", "RECTANGLE", "MIXED"];

SculptureGarden.Room.MapColoursBase =
{
    "TRIANGLE": ["Yellow","Orange"],
    "FIVE_CELL": ["Khaki","Tomato"],
    "RECTANGLE": ["Plum","Fuchsia"],
    "MIXED": ["Coral","DarkOrange"]
};

SculptureGarden.Room.MapColours = {};

// Initialise the map colours, done in a function so that we don't need to worry about the order the objects are loaded

SculptureGarden.Room.Initialise = function ()
{
    SculptureGarden.Room.ArtTypes =
    {
        "TRIANGLE": SculptureGarden.Artwork.TRIANGLE_PATTERN,
        "FIVE_CELL": SculptureGarden.Artwork.FIVE_CELL_AUTOMATA,
        "RECTANGLE": SculptureGarden.Artwork.RECTANGLE_PATTERN,
        "MIXED": SculptureGarden.Artwork.MIXED_PATTERN
    };

    for (var idx in SculptureGarden.Room.Types)
    {
        var type = SculptureGarden.Room.Types [idx];
        var start = SculptureGarden.Room.MapColoursBase[type][0];
        var end = SculptureGarden.Room.MapColoursBase[type][1];

        SculptureGarden.Room.MapColours [type] = new Array (16);

        for (var i = 0 ; i < 16 ; ++i)
        {
            SculptureGarden.Room.MapColours [type][i] = SVGColours.Blend (start, end, Math.random());
        }
    }
};
//------------------------------------------------------------------------------------------------------------
SculptureGarden.Room.prototype.GetMapColour = function(x, y)
{
    var idx = 4 * Math.abs(x % 4) + Math.abs(y % 4);
    return SculptureGarden.Room.MapColours [this.type][idx];
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Room.prototype.MakeCells = function(gallery)
{
    var cells = gallery.cells;

    for (var x = this.x0 ; x <= this.x1 ; ++x)
    {
        var xedge = x == this.x0 || x == this.x1;

        for (var y = this.y0 ; y <= this.y1 ; ++y)
        {
            var yedge = y == this.y0 || y == this.y1;

            var position = new OctoPosition (x, y);

            if (xedge || yedge)
            {
                cells[position.key].type = SculptureGarden.Cell.ROOM_WALL;
            }
            else
            {
                cells[position.key].type = SculptureGarden.Cell.ROOM;
                cells[position.key].room = this;
            }
        }
    }

    // Look for adjacent corridor

    var found_n = false;
    var found_s = false;
    var found_e = false;
    var found_w = false;

    for (var y = this.y0 ; y <= this.y1 ; ++y)
    {
        var position = new OctoPosition (this.x0, y);
        var west = position.Neighbour (Direction.W);
        if (cells [west.key].type == SculptureGarden.Cell.CORRIDOR)
        {
            cells [position.key].type = SculptureGarden.Cell.CORRIDOR;
            found_w = true;
            ++y;
        }
    }
    for (var y = this.y0 ; y <= this.y1 ; ++y)
    {
        var position = new OctoPosition (this.x1, y);
        var east = position.Neighbour (Direction.E);
        if (cells [east.key].type == SculptureGarden.Cell.CORRIDOR)
        {
            cells [position.key].type = SculptureGarden.Cell.CORRIDOR;
            found_e = true;
            ++y;
        }
    }
    for (var x = this.x0 ; x <= this.x1; ++x)
    {
        var position = new OctoPosition (x, this.y0);
        var south = position.Neighbour (Direction.S);
        if (cells [south.key].type == SculptureGarden.Cell.CORRIDOR)
        {
            cells [position.key].type = SculptureGarden.Cell.CORRIDOR;
            found_s = true;
            ++x;
        }
    }
    for (var x = this.x0; x <= this.x1 ; ++x)
    {
        var position = new OctoPosition (x, this.y1);
        var north = position.Neighbour (Direction.N);
        if (cells [north.key].type == SculptureGarden.Cell.CORRIDOR)
        {
            cells [position.key].type = SculptureGarden.Cell.CORRIDOR;
            found_n = true;
            ++x;
        }
    }

    if (! found_w)
    {
        var y = Misc.RandomInteger (this.y0 + 1, this.y1 - 1)

        this.MakeStraightCorridor (this.x0, y, Direction.W, gallery);
    }
    if (! found_e)
    {
        var y = Misc.RandomInteger (this.y0 + 1, this.y1 - 1)

        this.MakeStraightCorridor (this.x1, y, Direction.E, gallery);
    }
    if (! found_s)
    {
        var x = Misc.RandomInteger (this.x0 + 1, this.x1 - 1)

        this.MakeStraightCorridor (x, this.y0, Direction.S, gallery);
    }
    if (! found_n)
    {
        var x = Misc.RandomInteger (this.x0 + 1, this.x1 - 1)

        this.MakeStraightCorridor (x, this.y1, Direction.N, gallery);
    }

    return;
}

//------------------------------------------------------------------------------------------------------------
SculptureGarden.Room.prototype.MakeStraightCorridor = function(x, y, d, gallery)
{
    var position = new OctoPosition (x, y);
    var d2 = Direction.turn_left45 [d];
    var d3 = Direction.turn_right45 [d];
    var cells = gallery.cells;

    cells [position.key].type = SculptureGarden.Cell.CORRIDOR;

    while (true)
    {
        var next = position.Neighbour (d);
        var n2 = position.Neighbour (d2);
        var s3 = position.Neighbour (d3);
        var cell = cells [next.key];

        if (cell.type == SculptureGarden.Cell.CORRIDOR
             || (n2 && cells [n2.key].type == SculptureGarden.Cell.CORRIDOR)
             || (n2 && cells [n2.key].type == SculptureGarden.Cell.CORRIDOR))
        {
            break;
        }

        var previous = cell.type;

        cell.type = SculptureGarden.Cell.CORRIDOR;

        if (previous == SculptureGarden.Cell.ROOOM_WALL)
        {
            break;
        }

        if (previous == SculptureGarden.Cell.EXTERNAL_WALL)
        {
            anchor = new Anchor (next.key, d);
            gallery.anchors.Add (anchor);
            break;
        }
        position = next;
    }
}
//------------------------------------------------------------------------------------------------------------
SculptureGarden.Room.prototype.toString = function()
{
    return Misc.Format ("Room: x = {0} - {1}, y = {2} - {3}", this.x0, this.x1, this.y0, this.y1);
}
