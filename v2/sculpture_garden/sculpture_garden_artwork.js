//-------------------------------------------------------------------------------------------------
// A wall hanging work of art in the sculpture garden
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------


//=======================================================================================================================
// Generic art
//=======================================================================================================================
SculptureGarden.Artwork = function()
{
    this.type = SculptureGarden.Artwork.NONE;
    this.background = "black";
    this.hanging_parameters = [0.5, 0.6, 0.6, 0.6];
    this.author = "Edd Aardvark (www.eddaardvark.co.uk)";
    this.title = "Generic Artwork";
    this.description = "An artwork";
    this.homepage = "http://www.eddaardvark.co.uk/index.html";
}

SculptureGarden.Artwork.NONE = 0;
SculptureGarden.Artwork.TRIANGLE_PATTERN = 1;
SculptureGarden.Artwork.GALLERY_MAP = 2;
SculptureGarden.Artwork.FIVE_CELL_AUTOMATA = 3;
SculptureGarden.Artwork.RECTANGLE_PATTERN = 4;
SculptureGarden.Artwork.MIXED_PATTERN = 5;
SculptureGarden.Artwork.GARDEN_MAP = 6;

SculptureGarden.Artwork.CreateArt = function (type)
{
    if (type == SculptureGarden.Artwork.TRIANGLE_PATTERN)
        return new SculptureGarden.TriangleArt ();

    if (type == SculptureGarden.Artwork.FIVE_CELL_AUTOMATA)
        return new SculptureGarden.FiveCellArt ();

    if (type == SculptureGarden.Artwork.RECTANGLE_PATTERN)
        return new SculptureGarden.RectangleArt ();

    if (type == SculptureGarden.Artwork.MIXED_PATTERN)
        return new SculptureGarden.MixedArt ();

    return null;
}

SculptureGarden.Artwork.prototype.GetHangingParameters = function ()
{
    // x-centre, y-centre, width, height based on a (0,0)-(1,1) rectangle.
    return this.hanging_parameters;
}

SculptureGarden.Artwork.prototype.DrawInShape = function (chelp, shape)
{
    chelp.SetBackground (this.background);
    chelp.DrawPolygon (shape);
}
SculptureGarden.Artwork.prototype.DrawFullSize = function (chelp)
{
    chelp.SetBackground (this.background);
    chelp.DrawFilledRect (0, 0, chelp.width, chelp.height);
}
SculptureGarden.Artwork.prototype.GetCode = function ()
{
    return null;
}
SculptureGarden.Artwork.prototype.toString = function()
{
    return "Generic sculpture garden artwork";
}
//=======================================================================================================================
// Triangle patterns, implemented in triangle_pattern.js
//=======================================================================================================================
SculptureGarden.TriangleArt = function ()
{
    SculptureGarden.Artwork.call(this);

    this.type = SculptureGarden.Artwork.TRIANGLE_PATTERN;
    this.background = "silver";
    this.title = "Triangle Pattern";
    this.picture = new  TrianglePattern ();
    this.picture.Initialise (TrianglePattern.TRIANGLE);

    var n = 1 + Misc.RandomInteger (4);
    for (var i = 0 ; i < n ; ++i)
    {
        this.picture.Expand ();
    }
}
// Inherit the generic prototype
SculptureGarden.TriangleArt.prototype = Object.create(SculptureGarden.Artwork.prototype);

SculptureGarden.TriangleArt.prototype.DrawInShape = function (chelp, shape)
{
    this.picture.DrawInShape (chelp, shape);
}
SculptureGarden.TriangleArt.prototype.DrawFullSize = function (chelp)
{
    this.picture.Draw (chelp);
}
SculptureGarden.TriangleArt.prototype.toString = function()
{
    return "A Sculpture garden triangle artwork";
}
//=======================================================================================================================
// Rectangle patterns, implemented in triangle_pattern.js
//=======================================================================================================================
SculptureGarden.RectangleArt = function ()
{
    SculptureGarden.Artwork.call(this);

    this.type = SculptureGarden.Artwork.RECTANGLE_PATTERN;
    this.background = "silver";
    this.title = "Rectangle Pattern";
    this.picture = new  TrianglePattern ();
    this.picture.Initialise (TrianglePattern.RECTANGLE);

    var n = 1 + Misc.RandomInteger (4);
    for (var i = 0 ; i < n ; ++i)
    {
        this.picture.Expand ();
    }
}
// Inherit the generic prototype
SculptureGarden.RectangleArt.prototype = Object.create(SculptureGarden.Artwork.prototype);

SculptureGarden.RectangleArt.prototype.DrawInShape = function (chelp, shape)
{
    this.picture.DrawInShape (chelp, shape);
}
SculptureGarden.RectangleArt.prototype.DrawFullSize = function (chelp)
{
    this.picture.Draw (chelp);
}
SculptureGarden.RectangleArt.prototype.toString = function()
{
    return "A Sculpture garden rectangular artwork";
}
//=======================================================================================================================
// Dart patterns, implemented in triangle_pattern.js
//=======================================================================================================================
SculptureGarden.MixedArt = function ()
{
    SculptureGarden.Artwork.call(this);

    this.type = SculptureGarden.Artwork.MIXED_PATTERN;
    this.background = "silver";
    this.title = "Dart Pattern";
    this.picture = new  TrianglePattern ();
    this.picture.Initialise (TrianglePattern.MIXED);

    var n = 1 + Misc.RandomInteger (4);
    for (var i = 0 ; i < n ; ++i)
    {
        this.picture.Expand ();
    }
}
// Inherit the generic prototype
SculptureGarden.MixedArt.prototype = Object.create(SculptureGarden.Artwork.prototype);

SculptureGarden.MixedArt.prototype.DrawInShape = function (chelp, shape)
{
    this.picture.DrawInShape (chelp, shape);
}
SculptureGarden.MixedArt.prototype.DrawFullSize = function (chelp)
{
    this.picture.Draw (chelp);
}
SculptureGarden.MixedArt.prototype.toString = function()
{
    return "A Sculpture garden dart artwork";
}
//=======================================================================================================================
// Five Cell Cellular automata, implemented in fivecell.js
//=======================================================================================================================
SculptureGarden.FiveCellArt = function ()
{
    SculptureGarden.Artwork.call(this);

    var colour_map = SculptureGarden.FiveCellArt.original_colour_map.slice ();
    var centre_cells = [];

    while (Math.random () < 0.9)
    {
        var cell = Misc.RandomElement (SculptureGarden.FiveCellArt.fast_cells);
        colour_map [cell] = Misc.RandomInteger (5);
    }
    while (Math.random () < 0.5)
    {
        var cell = Misc.RandomElement (SculptureGarden.FiveCellArt.slow_cells);
        colour_map [cell] = Misc.RandomInteger (5);
    }
    while (Math.random () < 0.5)
    {
        centre_cells.push (Misc.RandomInteger (FiveCell.NUM_COLOURS));
    }

    var size = 1;
    while (size < 16 && Math.random () < 0.5)
    {
        size *= 2;
    }

    // x-centre, y-centre, width, height. Based on a (0,0)-(1,1) rectangle.

    this.hanging_parameters = [0.5, 0.6, 0.81, 0.54];
    this.homepage = "http://www.eddaardvark.co.uk/v2/automata/fivecell.html";
    this.description = "A one dimensional cellular automaton, the second dimension represents the iteration";
    this.type = SculptureGarden.Artwork.FIVE_CELL_AUTOMATA;
    this.background = "orange";
    this.title = "Five colour cellular automata";
    this.picture = new FiveCell.Pattern (colour_map);
    this.picture.SetCentreCells (centre_cells);
    this.picture.SetSize (size);
}

SculptureGarden.FiveCellArt.original_colour_map = [0,1,4,1,3,1,2,0,3,3,4,1,4,0,4];
SculptureGarden.FiveCellArt.fast_cells = [1,2,4,5,7,8,10,11,13,14];
SculptureGarden.FiveCellArt.slow_cells = [0,3,6,9,12];

// Inherit the generic prototype
SculptureGarden.FiveCellArt.prototype = Object.create(SculptureGarden.Artwork.prototype);

SculptureGarden.FiveCellArt.prototype.DrawInShape = function (chelp, shape)
{
    // origin on the left

    if (shape[0][0] > shape[3][0])
    {
        shape = [shape[3], shape[2], shape[1], shape[0]];
    }
    var dx = shape[3][0] - shape[0][0];
    var width = FiveCell.WIDTH;
    if (dx / width < 0.75)
    {
        chelp.SetBackground (this.background);
        chelp.DrawPolygon (shape);
        return;
    }
    var include_lines = dx / width > 2;

    this.picture.DrawInShape (chelp, shape, include_lines);
}

SculptureGarden.FiveCellArt.prototype.DrawFullSize = function (chelp)
{
    this.picture.Draw (chelp.canvas);
}
SculptureGarden.FiveCellArt.prototype.GetCode = function ()
{
    return this.picture.GetCode ();
}

SculptureGarden.FiveCellArt.prototype.toString = function()
{
    return "A Five Coloured Cellular Automata";
}
