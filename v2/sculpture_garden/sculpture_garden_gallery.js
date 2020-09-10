//-------------------------------------------------------------------------------------------------
// A sculpture garden is a collection of galleries displaying artworks set in a garden displaying sculptures
// There may also be some sculptures inside the galleries. It is implemented on a grid composed of octagons and
// squares, walls will be implemented by solid octagons, corridors, galleries and the gardens by empty squares
// This file implements a single gallery
// (c) John Whitehouse 2019
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------


//==============================================================
SculptureGarden.Gallery = function()
{
    Rectangle.call(this);

    this.type = SculptureGarden.GALLERY;
    this.name = "Gallery";
}

// Inherit the rectangle prototype

SculptureGarden.Gallery.prototype = Object.create(Rectangle.prototype);

SculptureGarden.Gallery.ROOM_MIN = 5;
SculptureGarden.Gallery.ROOM_MAX = 9;
SculptureGarden.Gallery.ROOM_GAP = 2;

SculptureGarden.Gallery.prototype.MapColour = function ()
{
    return "SteelBlue";
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Gallery.prototype.Construct = function(garden)
{
    this.garden = garden;
    this.rooms = [];

    this.InitialiseCells ();
    this.AddCorridors ();
    this.AddRooms ();
    this.SetCellTypes();
    this.SetCellColours();
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Gallery.prototype.InitialiseCells = function ()
{
    for (var x = this.x0 ; x <= this.x1 ; ++x)
    {
        var ext1 = (x == this.x0 || x == this.x1);

        for (var y = this.y0 ; y <= this.y1 ; ++y)
        {
            var external = ext1 || y == this.y0 || y == this.y1;

            var pos = new OctoPosition (x,y);
            var cell = new SculptureGarden.Cell (pos, external ? SculptureGarden.Cell.EXTERNAL_WALL : SculptureGarden.Cell.SOLID);

            this.cells[pos.key] = cell;
        }
    }
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Gallery.prototype.InitialiseArtwork = function ()
{
    for (var idx in this.cells)
    {
        if (this.cells[idx].HasWalls ())
        {
            this.cells[idx].InitialiseArtwork();
        }
    }
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Gallery.prototype.AddCorridors = function ()
{
    var x1 = Misc.RandomInteger (this.x0 + 2, this.x1 - 2);
    var y1 = this.y0;
    var x2 = Misc.RandomInteger (this.x0 + 2, this.x1 - 2);
    var y2 = this.y1;
    var x3 = this.x0;
    var y3 = Misc.RandomInteger (this.y0 + 2, this.y1 - 2);
    var x4 = this.x1;
    var y4 = Misc.RandomInteger (this.y0 + 2, this.y1 - 2);

    var path1 = new SculptureGarden.Path ();
    var path2 = new SculptureGarden.Path ();

    path1.Join (x1, y1, x2, y2);
    path2.Join (x3, y3, x4, y4);

    for (var idx in path1.cells)
    {
        this.cells [idx] = new SculptureGarden.Cell (path1.cells [idx], SculptureGarden.Cell.CORRIDOR);
    }
    for (var idx in path2.cells)
    {
        this.cells [idx] = new SculptureGarden.Cell (path2.cells [idx], SculptureGarden.Cell.CORRIDOR);
    }

    var key = OctoPosition.MakeKey (x1, y1);
    var anchor = new Anchor (key, Direction.S);
    this.anchors.Add (anchor);

    key = OctoPosition.MakeKey (x2, y2);
    anchor = new Anchor (key, Direction.N);
    this.anchors.Add (anchor);

    key = OctoPosition.MakeKey (x3, y3);
    anchor = new Anchor (key, Direction.W);
    this.anchors.Add (anchor);

    key = OctoPosition.MakeKey (x4, y4);
    anchor = new Anchor (key, Direction.E);
    this.anchors.Add (anchor);
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Gallery.prototype.AddCorridor = function ()
{
    var twistiness = Misc.RandomInteger (5, 16);

    for (var idx in this.rooms)
    {
        var room = this.rooms[idx];
        for (var didx in room.doors)
        {
            var last_turn = 0;
            var door = room.doors[didx];
            var x = door.x;
            var y = door.y;
            var d = door.d;
            var in_room = true;

            var position = new OctoPosition (x,y);
            while (true)
            {
                var cell = this.cells[position.key];

                if (! cell || (! in_room && ! cell.IsSolid ()))
                {
                    if (! cell)
                    {
                        this.cells [position.key] = new SculptureGarden.Cell (position, SculptureGarden.Cell.PATH);
                        this.cells [position.key].SetColours ();

                        this.anchors.Add (new Anchor(position.key, d));
                    }
                    break;
                }

                if (cell.type != SculptureGarden.Cell.ROOM)
                {
                    if (! cell.IsSolid ())
                    {
                        break;
                    }
                    in_room = false;
                }

                if (cell.IsSolid ())
                {
                    this.cells[position.key].type = SculptureGarden.Cell.CORRIDOR;
                }

                var new_pos = position.Neighbour (d);
                if (new_pos == null)
                {
                    var d2 = (r == 0) ? Direction.turn_left45 [d] : Direction.turn_right45 [d];
                    new_pos = position.Neighbour (d2);
                }
                position = new_pos;
                var r = Misc.RandomInteger (twistiness);
                if (r < 2)
                {
                    d = (r == 0) ? Direction.turn_left45 [d] : Direction.turn_right45 [d];
                    last_turn = r;
                }
            }
        }
    }
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Gallery.prototype.AddRooms = function (num)
{
    var fails = 0;

    while (fails < 5)
    {
        var w = Misc.RandomInteger (SculptureGarden.Gallery.ROOM_MIN, SculptureGarden.Gallery.ROOM_MAX);
        var h = Misc.RandomInteger (SculptureGarden.Gallery.ROOM_MIN, SculptureGarden.Gallery.ROOM_MAX);

        for (var i = 0 ; i < 10 ; ++i)
        {
            var xpos = Misc.RandomInteger (this.x0 + 2, this.x1 - 2 - w);
            var ypos = Misc.RandomInteger (this.y0 + 2, this.y1 - 2 - h);
            var room = new SculptureGarden.Room (xpos, ypos, w, h);
            var ok = true;

            for (var idx in this.rooms)
            {
                if (room.Overlaps (this.rooms[idx], SculptureGarden.Gallery.ROOM_GAP))
                {
                    ok = false;
                    break;
                }
            }

            if (ok)
            {
                room.MakeCells (this);
                this.rooms.push (room);

                fails = 0;
                break;
            }
        }
        ++fails;
    }
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Gallery.prototype.SetCellTypes = function ()
{
    for (var idx in this.cells)
    {
        if (this.cells[idx].type == SculptureGarden.Cell.SOLID)
        {
            var location = this.cells[idx].position;
            var dset = (location.shape_type == OctoPoints.OCTAGON) ? 8 : 4;

            for (var d = 0 ; d < dset ; ++d)
            {
                var neighbour_pos = location.Neighbour (d);
                var neighbour = this.cells[neighbour_pos.key];

                if (neighbour.type == SculptureGarden.Cell.CORRIDOR)
                {
                    this.cells[idx].type = SculptureGarden.Cell.CORRIDOR_WALL;
                }
            }
        }
    }
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Gallery.prototype.AddArtwork = function ()
{
    // Artwork goes on the walls of the rooms

    for (var idx in this.cells)
    {
        var shape = this.cells[idx];
        if (shape.type == SculptureGarden.Cell.ROOM_WALL)
        {
            for (var i = 0 ; i < shape.artwork.length ; ++i)
            {
                var npos = shape.position.Neighbour (i);
                var neighbour = this.cells[npos.key];
                if (neighbour && neighbour.type == SculptureGarden.Cell.ROOM)
                {
                    var rand = Math.random ();

                    if (rand < 0.96)
                    {
                        shape.artwork [i] = SculptureGarden.Artwork.CreateArt (neighbour.room.display_art);
                    }
                    else if (rand < 0.98)
                    {
                        shape.artwork [i] = new SculptureGarden.GalleryMap (this.garden, this, shape.position);
                    }
                    else
                    {
                        shape.artwork [i] = new SculptureGarden.GardenMap (this.garden, shape.position);
                    }
                }
            }
        }
    }
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Gallery.prototype.AddMaps = function ()
{
    this.InitialiseArtwork();
    this.AddArtwork();

    this.map_colours = new SculptureGarden.GalleryMap.MapColours (this, this.garden);

    // Look for an external wall next to a corridor and a garden/path. Map goes on the wall facing the garden

    for (var idx in this.cells)
    {
        var shape = this.cells[idx];
        var viewer_dir = null;
        var observer = null;

        // Maps on the walls by the entrances

        if (shape.type == SculptureGarden.Cell.EXTERNAL_WALL)
        {
            var neighbours = [SculptureGarden.Cell.INVALID, SculptureGarden.Cell.INVALID, SculptureGarden.Cell.INVALID, SculptureGarden.Cell.INVALID];
            for (var d = 0 ; d < 4 ; ++d)
            {
                var npos = shape.position.Neighbour (d);
                if (npos)
                {
                    var cell = this.cells[npos.key];
                    neighbours[d] = (cell) ? cell.type : SculptureGarden.Cell.OUTSIDE;
                }
            }

            // add a gallery map near the entrance

            var corridor = neighbours.indexOf (SculptureGarden.Cell.CORRIDOR);

            if (corridor >= 0)
            {
                for (var d = 0 ; d < 4 ; ++d)
                {
                    var npos = shape.position.Neighbour (d);
                    if (npos)
                    {
                        var neighbour = this.cells[npos.key];
                        if (! neighbour || neighbour.type == SculptureGarden.Cell.PATH)
                        {
                            viewer_dir = d;
                            observer = npos;
                            break;
                        }
                    }
                }

                if (observer)
                {
                    var left_pos = shape.position.Neighbour (Direction.turn_left90 [viewer_dir]);

                    if (left_pos)
                    {
                        var left = this.cells[left_pos.key];
                        if (left && left.type == SculptureGarden.Cell.CORRIDOR)
                        {
                            shape.artwork [viewer_dir] = new SculptureGarden.GalleryMap (this.garden, this, observer);
                            continue;
                        }
                    }

                    var right_pos = shape.position.Neighbour (Direction.turn_right90 [viewer_dir]);

                    if (right_pos)
                    {
                        var left = this.cells[right_pos.key];
                        if (left && left.type == SculptureGarden.Cell.CORRIDOR)
                        {
                            shape.artwork [viewer_dir] = new SculptureGarden.GalleryMap (this.garden, this, observer);
                        }
                    }
                }
            }
            // Try a random map

            else if (Math.random () < 0.1)
            {
                for (var d = 0 ; d < neighbours.length ; ++d)
                {
                    if (neighbours [d] == SculptureGarden.Cell.OUTSIDE)
                    {
                        if (Math.random () > 0.5)
                            shape.artwork [d] = new SculptureGarden.GardenMap (this.garden, shape.position);
                        else
                            shape.artwork [d] = new SculptureGarden.GalleryMap (this.garden, this, shape.position);
                    }
                }
            }
        }
        else if (shape.type == SculptureGarden.Cell.CORRIDOR_WALL)
        {
            var dir = Misc.RandomInteger (shape.artwork.length);
            var npos = shape.position.Neighbour (dir);
            if (npos)
            {
                var neighbour = this.cells[npos.key];
                if (neighbour && neighbour.type == SculptureGarden.Cell.CORRIDOR)
                {
                    if (Math.random () > 0.5)
                    {
                        shape.artwork [dir] = new SculptureGarden.GalleryMap (this.garden, this, npos);
                    }
                    else
                    {
                        shape.artwork [dir] = new SculptureGarden.GardenMap (this.garden, shape.position);
                    }
                }
            }
        }
    }
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Gallery.prototype.toString = function()
{
    return Misc.Format ("SG Gallery: Origin = ({0}.{1}), size = {2} x {3}", this.origin[0], this.origin[1], this.width, this.height);
}

