//-------------------------------------------------------------------------------------------------
// A Statue in the sculpture garden.
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------
SculptureGarden.Statue = function(statue_type, animation_option)
{
    Rectangle.call(this);

    this.type = SculptureGarden.STATUE;

    this.statue_type = (statue_type && SculptureGarden.Statue.Types.indexOf (statue_type) >= 0)
            ? statue_type
            : Misc.RandomElement (SculptureGarden.Statue.Types);

    this.animation_option = animation_option ? animation_option : SculptureGarden.Statue.MaxAnimate [this.statue_type];
    this.name = SculptureGarden.Statue.TypesNames [this.statue_type] + " Statue";
}

// Inherit the rectangle prototype

SculptureGarden.Statue.prototype = Object.create(Rectangle.prototype);

SculptureGarden.Statue.PYRAMID = 1;
SculptureGarden.Statue.STACK_OF_BLOCKS = 2;
SculptureGarden.Statue.STACK_OF_SQUARES = 3;
SculptureGarden.Statue.OCTAHEDRON = 4;
SculptureGarden.Statue.BIPYRAMID = 5;
SculptureGarden.Statue.NUM_TYPES = 6;

SculptureGarden.Statue.Types =
[
    SculptureGarden.Statue.PYRAMID,
    SculptureGarden.Statue.STACK_OF_BLOCKS,
    SculptureGarden.Statue.STACK_OF_SQUARES,
    SculptureGarden.Statue.OCTAHEDRON,
    SculptureGarden.Statue.BIPYRAMID,
];

SculptureGarden.Statue.TypesNames = {};
SculptureGarden.Statue.Decoder = {};
SculptureGarden.Statue.Constructors = {};
SculptureGarden.Statue.MaxAnimate = {};

SculptureGarden.Statue.TypesNames [SculptureGarden.Statue.PYRAMID] = "Pyramid";
SculptureGarden.Statue.TypesNames [SculptureGarden.Statue.STACK_OF_BLOCKS] = "Stack of blocks";
SculptureGarden.Statue.TypesNames [SculptureGarden.Statue.STACK_OF_SQUARES] = "Stack of squares";
SculptureGarden.Statue.TypesNames [SculptureGarden.Statue.OCTAHEDRON] = "Octahedron";
SculptureGarden.Statue.TypesNames [SculptureGarden.Statue.BIPYRAMID] = "Bi-pyramid";

SculptureGarden.Statue.Decoder ["Pyramid"] = SculptureGarden.Statue.PYRAMID;
SculptureGarden.Statue.Decoder ["Stack of blocks"] = SculptureGarden.Statue.STACK_OF_BLOCKS;
SculptureGarden.Statue.Decoder ["Stack of squares"] = SculptureGarden.Statue.STACK_OF_SQUARES;
SculptureGarden.Statue.Decoder ["Octahedron"] = SculptureGarden.Statue.OCTAHEDRON;
SculptureGarden.Statue.Decoder ["Bi-pyramid"] = SculptureGarden.Statue.BIPYRAMID;

SculptureGarden.Statue.prototype.MapColour = function ()
{
    return "HotPink";
}
// References to other objects are best handled after all the code is loaded
SculptureGarden.Statue.Initialise = function ()
{
    SculptureGarden.Statue.SquareGrid =
    [
        null,                       SculptureGarden.Cell.PATH,        null,
        SculptureGarden.Cell.PATH,  SculptureGarden.Cell.SOLID_TREE,  SculptureGarden.Cell.PATH,
        null,                       SculptureGarden.Cell.PATH,        null,
    ];
    SculptureGarden.Statue.OctoGrid =
    [
        SculptureGarden.Cell.PATH,  SculptureGarden.Cell.PATH,        SculptureGarden.Cell.PATH,
        SculptureGarden.Cell.PATH,  SculptureGarden.Cell.SOLID_TREE,  SculptureGarden.Cell.PATH,
        SculptureGarden.Cell.PATH,  SculptureGarden.Cell.PATH,        SculptureGarden.Cell.PATH,
    ];

    SculptureGarden.Statue.MaxAnimate [SculptureGarden.Statue.PYRAMID] = SculptureGarden.Item.Pyramid.ANIMATE_TOTAL;
    SculptureGarden.Statue.MaxAnimate [SculptureGarden.Statue.STACK_OF_BLOCKS] = SculptureGarden.Item.StackOfBlocks.ANIMATE_TOTAL;
    SculptureGarden.Statue.MaxAnimate [SculptureGarden.Statue.STACK_OF_SQUARES] = SculptureGarden.Item.StackOfSquares.ANIMATE_TOTAL;
    SculptureGarden.Statue.MaxAnimate [SculptureGarden.Statue.OCTAHEDRON] = SculptureGarden.Item.Octahedron.ANIMATE_TOTAL;
    SculptureGarden.Statue.MaxAnimate [SculptureGarden.Statue.BIPYRAMID] = SculptureGarden.Item.Bipyramid.ANIMATE_TOTAL;
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Statue.prototype.Construct = function(garden)
{
    this.garden = garden;
    this.domains = [];

    // Should be 3x3, so (1,1) will be the centre. Create a plinth where we cab attach some maps

    var xc = this.x0 + 1;
    var yc = this.y0 + 1;
    var centre = new OctoPosition (xc, yc);
    var grid = (centre.shape_type == OctoPoints.SQUARE) ? SculptureGarden.Statue.SquareGrid : SculptureGarden.Statue.OctoGrid;
    var idx = 0;

    for (var x = this.x0 ; x <= this.x1 ; ++x)
    {
        for (var y = this.y0 ; y <= this.y1 ; ++y)
        {
            var type = grid[idx++];

            if (type !== null)
            {
                var position = new OctoPosition (x, y);

                this.cells [position.key] = new SculptureGarden.Cell (position, type);
                this.cells [position.key].SetColours ();
            }
        }
    }
    // Add a sculpture

    var item = SculptureGarden.Statue.Constructors [this.statue_type](centre.shape_type);

    if (this.animation_option)
    {
        item.SetAnimation (Misc.RandomInteger(1, this.animation_option));
    }

    this.cells [centre.key].items = [item];

    // Entrances (N, S, E, W)

    var d = Misc.RandomInteger (4);
    var x = xc + Direction.vectors [d][0];
    var y = yc + Direction.vectors [d][1];

    var key = OctoPosition.MakeKey (x, y);
    var anchor = new Anchor (key, d);
    this.anchors.Add (anchor);
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Statue.CreatePyramid = function (shape_type, animation_option)
{
    return new SculptureGarden.Item.Pyramid (shape_type, 0.9, 0, 2, SVGColours.RandomNamedColour ("blue"), SVGColours.RandomNamedColour ("blue"));
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Statue.CreateStackOfBlocks = function (shape_type, animation_option)
{
    var widths = new Array (5);
    var heights = new Array (5);

    for (var i = 0 ; i < 5 ; ++i)
    {
        widths [i] = Math.random ();
        heights [i] = i * Math.random () / 2;
    }

    return new SculptureGarden.Item.StackOfBlocks (shape_type, widths, heights, SculptureGarden.Item.StackOfBlocks.RandomStack (), SVGColours.RandomNamedColour ("blue"), SVGColours.RandomNamedColour ("blue"));
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Statue.CreateStackOfSquares = function (shape_type)
{
    return new SculptureGarden.Item.StackOfSquares (shape_type, 0.1, 0.6, SculptureGarden.Item.StackOfSquares.RandomStack(), SVGColours.RandomNamedColour ("blue"), SVGColours.RandomNamedColour ("blue"));
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Statue.CreateOctahedron = function (shape_type)
{
    return new SculptureGarden.Item.Octahedron (shape_type, 0, 0.8, SVGColours.RandomNamedColour ("blue"), SVGColours.RandomNamedColour ("blue"));
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Statue.CreateBiPyramid = function (shape_type)
{
    return new SculptureGarden.Item.Bipyramid (shape_type, 0.9, 0, 2, SVGColours.RandomNamedColour ("blue"), SVGColours.RandomNamedColour ("blue"));
}

SculptureGarden.Statue.Constructors [SculptureGarden.Statue.PYRAMID] = SculptureGarden.Statue.CreatePyramid;
SculptureGarden.Statue.Constructors [SculptureGarden.Statue.STACK_OF_BLOCKS] = SculptureGarden.Statue.CreateStackOfBlocks;
SculptureGarden.Statue.Constructors [SculptureGarden.Statue.STACK_OF_SQUARES] = SculptureGarden.Statue.CreateStackOfSquares;
SculptureGarden.Statue.Constructors [SculptureGarden.Statue.OCTAHEDRON] = SculptureGarden.Statue.CreateOctahedron;
SculptureGarden.Statue.Constructors [SculptureGarden.Statue.BIPYRAMID] = SculptureGarden.Statue.CreateBiPyramid;

//---------------------------------------------------------------------------------------------------------
SculptureGarden.Statue.prototype.toString = function()
{
    return Misc.Format ("SG Statue: Origin = ({0}.{1}), size = {2} x {3}", this.origin[0], this.origin[1], this.width, this.height);
}
