//-------------------------------------------------------------------------------------------------
// A maze in the sculpture garden.
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------
SculptureGarden.Junction = function()
{
    Rectangle.call(this);

    this.type = SculptureGarden.JUNCTION;
    this.name = "Junction";
}

// Inherit the rectangle prototype

SculptureGarden.Junction.prototype = Object.create(Rectangle.prototype);


SculptureGarden.Junction.prototype.MapColour = function ()
{
    return "White";
}

SculptureGarden.Junction.Initialise = function ()
{
    SculptureGarden.Junction.SquareGrid =
    [
        null,                       SculptureGarden.Cell.PATH,          null,
        SculptureGarden.Cell.PATH,  SculptureGarden.Cell.EXTERNAL_WALL, SculptureGarden.Cell.PATH,
        null,                       SculptureGarden.Cell.PATH,          null,
    ];
    SculptureGarden.Junction.OctoGrid =
    [
        SculptureGarden.Cell.PATH,  SculptureGarden.Cell.PATH,          SculptureGarden.Cell.PATH,
        SculptureGarden.Cell.PATH,  SculptureGarden.Cell.EXTERNAL_WALL, SculptureGarden.Cell.PATH,
        SculptureGarden.Cell.PATH,  SculptureGarden.Cell.PATH,          SculptureGarden.Cell.PATH,
    ];
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Junction.prototype.Construct = function(garden)
{
    this.garden = garden;
    this.domains = [];

    // Should be 3x3, so (1,1) will be the centre. Create a plinth where we cab attach some maps

    var xc = this.x0 + 1;
    var yc = this.y0 + 1;
    var pos = new OctoPosition (xc, yc);
    var grid = (pos.shape_type == OctoPoints.SQUARE) ? SculptureGarden.Junction.SquareGrid : SculptureGarden.Junction.OctoGrid;
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

    // Entrances (N, S, E, W)

    for (var d = 0 ; d < 4 ; ++d)
    {
        var x = xc + Direction.vectors [d][0];
        var y = yc + Direction.vectors [d][1];

        var key = OctoPosition.MakeKey (x, y);
        var anchor = new Anchor (key, d);
        this.anchors.Add (anchor);
    }


}
//-------------------------------------------------------------------------------------------------
SculptureGarden.Junction.prototype.AddMaps = function()
{
    var cpos = new OctoPosition (this.x0 + 1, this.y0 + 1);
    var cell = this.cells [cpos.key];

    cell.InitialiseArtwork();

    for (var d = 0 ; d < cell.artwork.length ; ++d)
    {
        if (this.garden.mapable.length > 0 && Math.random () < 0.3)
        {
            var attraction = Misc.RandomElement (this.garden.mapable);

            cell.artwork [d] = new SculptureGarden.GalleryMap (this.garden, attraction);
        }
        else
        {
            cell.artwork [d] = new SculptureGarden.GardenMap (this.garden, cpos);
        }
    }
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Junction.prototype.toString = function()
{
    return Misc.Format ("SG Junction: Origin = ({0}.{1}), size = {2} x {3}", this.origin[0], this.origin[1], this.width, this.height);
}
