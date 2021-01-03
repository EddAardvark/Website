//-------------------------------------------------------------------------------------------------
// A gallery map, implemented as a wall hanging work of art in the sculpture garden
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------


//=======================================================================================================================
// Garden Map
//=======================================================================================================================
SculptureGarden.GardenMap = function (garden, position)
{
    SculptureGarden.Artwork.call(this);

    this.garden = garden;
    this.type = SculptureGarden.Artwork.GARDEN_MAP;
    this.title = "Garden Map";
    this.position = position;
    this.background = "DarkOliveGreen";
    this.x0 = garden.x0 - SculptureGarden.GardenMap.X_MARGIN;
    this.y0 = garden.y0 - SculptureGarden.GardenMap.Y_MARGIN;
    this.x_range = garden.x1 - this.x0 + 2 * SculptureGarden.GardenMap.X_MARGIN;
    this.y_range = garden.y1 - this.y0 + 2 * SculptureGarden.GardenMap.Y_MARGIN;
    this.draw_anchors = false;

    // x-centre, y-centre, width, height. Based on a (0,0)-(1,1) rectangle.

    this.hanging_parameters = (this.x_range > this.y_range)
                                ? [0.5, 0.6, 0.6, 0.6 * (this.y_range / this.x_range)]
                                : [0.5, 0.6, 0.6 * (this.x_range / this.y_range), 0.6];
}
// Inherit the generic prototype

SculptureGarden.GardenMap.prototype = Object.create(SculptureGarden.Artwork.prototype);

SculptureGarden.GardenMap.X_MARGIN = 1;
SculptureGarden.GardenMap.Y_MARGIN = 1;

//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.GardenMap.prototype.DrawFullSize = function (chelp)
{
    chelp.SetBackground ("Indigo");
    chelp.SetForeground ("black");
    chelp.SetLineWidth (1);

    var w = chelp.canvas.width;
    var h = chelp.canvas.height;

    chelp.DrawFilledRect (0, 0, w, h);

    var dx = w / this.x_range;
    var dy = h / this.y_range;
    var step = Math.min (dx, dy);
    var spot = Math.max (1, step/2);
    var x0 = (w - this.x_range * step) / 2;
    var y0 = (h + this.y_range * step) / 2;

    chelp.SetBackground (this.background);
    this.DrawFullsizeRect (chelp, x0, y0, step, this.garden);

    for (key in this.garden.cells)
    {
        var cell = this.garden.cells [key];
        var colour = cell.GetMapColour ();

        if (colour !== undefined)
        {
            var xdraw = x0 + (cell.position.x_pos - this.x0) * step;
            var ydraw = y0 - (cell.position.y_pos - this.y0) * step;
            chelp.DrawSpot (xdraw, ydraw, spot, colour);
        }
    }

    // Attractions

    for (var aidx in this.garden.attractions)
    {
        var attraction = this.garden.attractions [aidx];

        chelp.SetBackground (attraction.MapColour());
        chelp.SetForeground ("black");
        this.DrawFullsizeRect (chelp, x0, y0, step, attraction);
    }

    // You are here

    var xstar = x0 + (this.position.x_pos - this.x0) * step;
    var ystar = y0 - (this.position.y_pos - this.y0) * step;

    var star = CoordinateMaths.MakeStarPolygon ([xstar, ystar], 5 * spot, 5, 2);

    chelp.SetBackground ("Cyan");
    chelp.SetForeground ("Blue");
    chelp.DrawPolygon (star);
}
//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.GardenMap.prototype.DrawFullsizeRect = function (chelp, x0, y0, step, attraction)
{
    var xa = x0 + (attraction.x0 - this.x0) * step;
    var ya = y0 - (attraction.y1 - this.y0) * step;

    var w = (attraction.x1 - attraction.x0) * step;
    var h = (attraction.y1 - attraction.y0) * step;

    chelp.DrawFilledRect (xa, ya, w, h);
}
//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.GardenMap.prototype.DrawRectInShape = function (chelp, shape, attraction)
{
    var xa = (attraction.x0 - this.x0) / (this.x_range + 1);
    var ya = (attraction.y0 - this.y0) / (this.y_range + 1);
    var xb = (attraction.x1 - this.x0) / (this.x_range + 1);
    var yb = (attraction.y1 - this.y0) / (this.y_range + 1);
    var pts = new Array(4);

    pts[0] = CoordinateMaths.MapToQuadrilateral (xa, ya, shape);
    pts[1] = CoordinateMaths.MapToQuadrilateral (xa, yb, shape);
    pts[2] = CoordinateMaths.MapToQuadrilateral (xb, yb, shape);
    pts[3] = CoordinateMaths.MapToQuadrilateral (xb, ya, shape);

    chelp.DrawPolygon (pts);
}
//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.GardenMap.prototype.DrawInShape = function (chelp, shape)
{
    var extent = CoordinateMaths.PolygonExtent (shape);

    var dx = (extent.xmax - extent.xmin) / (this.x_range - 1);
    var dy = (extent.ymax - extent.ymin) / (this.y_range - 1);
    var step = Math.min (dx, dy);

    chelp.SetForeground ("black");
    chelp.SetLineWidth (1);
    chelp.SetBackground (this.background);

    chelp.DrawPolygon (shape);

    if (step < 0.2)
    {
        return;
    }

    // origin on the left

    if (shape[0][0] > shape[3][0])
    {
        shape = [shape[3], shape[2], shape[1], shape[0]];
    }

    var spot = Math.max (1, step/2);

    for (key in this.garden.cells)
    {
        var cell = this.garden.cells [key];
        var colour = cell.GetMapColour ();

        if (colour !== undefined)
        {
            var xdraw = (cell.position.x_pos - this.x0) / (this.x_range + 1);
            var ydraw = (cell.position.y_pos - this.y0) / (this.y_range + 1);
            var screen = CoordinateMaths.MapToQuadrilateral (xdraw, ydraw, shape);
            chelp.DrawSpot (screen[0], screen[1], spot, colour);
        }
    }

    // Attractions

    for (var aidx in this.garden.attractions)
    {
        var attraction = this.garden.attractions [aidx];

        chelp.SetBackground (attraction.MapColour());
        chelp.SetForeground ("black");

        this.DrawRectInShape (chelp, shape, attraction);
    }

    // Anchors

    if (this.draw_anchors)
    {
        for (var anc in this.garden.all_anchors)
        {
            var anchor = this.garden.all_anchors [anc];
            var xdraw = (anchor.x - this.x0) / (this.x_range + 1);
            var ydraw = (anchor.y - this.y0) / (this.y_range + 1);
            chelp.DrawSpot (xdraw, ydraw, spot, "OrangeRed");
        }
    }
    // You are here

    xdraw = (this.position.x_pos - this.x0) / this.x_range;
    ydraw = (this.position.y_pos - this.y0) / this.y_range;
    screen = CoordinateMaths.MapToQuadrilateral (xdraw, ydraw, shape);

    var star = CoordinateMaths.MakeStarPolygon (screen, 5 * spot, 5, 2);

    chelp.SetBackground ("Cyan");
    chelp.SetForeground ("Blue");
    chelp.DrawPolygon (star);
}

SculptureGarden.GardenMap.prototype.toString = function()
{
    return "A Sculpture garden map display";
}
