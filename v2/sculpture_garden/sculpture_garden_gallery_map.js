//-------------------------------------------------------------------------------------------------
// A gallery map, implemented as a wall hanging work of art in the sculpture garden
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------


//=======================================================================================================================
// Gallery Map
//=======================================================================================================================
SculptureGarden.GalleryMap = function (garden, gallery, position)
{
    SculptureGarden.Artwork.call(this);

    this.gallery = gallery;
    this.garden = garden;
    this.type = SculptureGarden.Artwork.GALLERY_MAP;
    this.title = "Gallery Map";
    this.position = position;
    this.background = SVGColours.Blend ("DarkGreen", SculptureGarden.Cell.type_colour[SculptureGarden.Cell.SOLID], 0.25);
    this.x_range = gallery.x1 - gallery.x0 - 1 + 2 * SculptureGarden.GalleryMap.X_MARGIN;
    this.y_range = gallery.y1 - gallery.y0 - 1 + 2 * SculptureGarden.GalleryMap.Y_MARGIN;

    // x-centre, y-centre, width, height. Based on a (0,0)-(1,1) rectangle.

    this.hanging_parameters = (this.x_range > this.y_range)
                                ? [0.5, 0.6, 0.6, 0.6 * (this.y_range / this.x_range)]
                                : [0.5, 0.6, 0.6 * (this.x_range / this.y_range), 0.6];
}
// Inherit the generic prototype
SculptureGarden.GalleryMap.prototype = Object.create(SculptureGarden.Artwork.prototype);

SculptureGarden.GalleryMap.X_MARGIN = 3;
SculptureGarden.GalleryMap.Y_MARGIN = 3;
//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.GalleryMap.MapColours = function (gallery, garden)
{
    this.x0 = gallery.x0 - SculptureGarden.GalleryMap.X_MARGIN;
    this.y0 = gallery.y0 - SculptureGarden.GalleryMap.Y_MARGIN;
    this.x1 = gallery.x1 + SculptureGarden.GalleryMap.X_MARGIN;
    this.y1 = gallery.y1 + SculptureGarden.GalleryMap.Y_MARGIN;
    this.cells = {};

    // Get the map colours

    for (x = this.x0 ; x <= this.x1 ; ++x)
    {
        for (y = this.y0 ; y <= this.y1 ; ++y)
        {
            var key = OctoPosition.MakeKey (x,y);
            var pos = OctoPosition.FromKey (key);
            var cell = gallery.GetCellAt (pos);
            if (! cell)
            {
                cell = garden.GetCellAt (pos);
            }

            if (cell && ! cell.IsOutside ())
            {
                this.cells [cell.position.key] = cell.GetMapColour ();
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.GalleryMap.prototype.DrawFullSize = function (chelp)
{
    chelp.SetBackground ("Green");
    chelp.SetForeground ("black");
    chelp.SetLineWidth (1);

    var w = chelp.canvas.width;
    var h = chelp.canvas.height;

    chelp.DrawFilledRect (0, 0, w, h);

    var map_colours = this.gallery.map_colours;

    var dx = w / this.x_range;
    var dy = h / this.y_range;
    var step = Math.min (dx, dy);
    var spot = Math.max (1, step/2);
    var x0 = (w - this.x_range * step) / 2;
    var y0 = (h + this.y_range * step) / 2;

    for (x = map_colours.x0 ; x <= map_colours.x1 ; ++x)
    {
        for (y = map_colours.y0 ; y <= map_colours.y1 ; ++y)
        {
            var key = OctoPosition.MakeKey (x,y);
            var colour = map_colours.cells [key];

            if (colour !== undefined)
            {
                var xdraw = x0 + (x - map_colours.x0) * step;
                var ydraw = y0 - (y - map_colours.y0) * step;
                chelp.DrawSpot (xdraw, ydraw, spot, colour);
            }
        }
    }

    if (this.position)
    {
        var xstar = x0 + (this.position.x_pos - map_colours.x0) * step;
        var ystar = y0 - (this.position.y_pos - map_colours.y0) * step;
        var star = CoordinateMaths.MakeStarPolygon ([xstar, ystar], 5 * spot, 5, 2);

        chelp.SetBackground ("Cyan");
        chelp.SetForeground ("Blue");
        chelp.DrawPolygon (star);
    }
}

//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.GalleryMap.prototype.DrawInShape = function (chelp, shape)
{
    var extent = CoordinateMaths.PolygonExtent (shape);

    var dx = (extent.xmax - extent.xmin) / (this.x_range - 1);
    var dy = (extent.ymax - extent.ymin) / (this.y_range - 1);
    var step = Math.min (dx, dy);

    chelp.SetForeground ("black");
    chelp.SetLineWidth (1);

    if (step < 0.6)
    {

        chelp.SetBackground (this.background);

        chelp.DrawPolygon (shape);
        return;
    }

    chelp.SetBackground ("Green");

    chelp.DrawPolygon (shape);

    // origin on the left

    if (shape[0][0] > shape[3][0])
    {
        shape = [shape[3], shape[2], shape[1], shape[0]];
    }

    var spot = Math.max (1, step/2);
    var map_colours = this.gallery.map_colours;

    for (x = map_colours.x0 ; x <= map_colours.x1 ; ++x)
    {
        for (y = map_colours.y0 ; y <= map_colours.y1 ; ++y)
        {
            var key = OctoPosition.MakeKey (x,y);
            var colour = map_colours.cells [key];

            if (colour !== undefined)
            {
                var xdraw = (x - map_colours.x0) / (this.x_range + 1);
                var ydraw = (y - map_colours.y0) / (this.y_range + 1);
                var screen = CoordinateMaths.MapToQuadrilateral (xdraw, ydraw, shape);
                chelp.DrawSpot (screen[0], screen[1], spot, colour);
            }
        }
    }

    if (this.position)
    {
        var xdraw = (this.position.x_pos - map_colours.x0) / this.x_range;
        var ydraw = (this.position.y_pos - map_colours.y0) / this.y_range;
        var screen = CoordinateMaths.MapToQuadrilateral (xdraw, ydraw, shape);
        var star = CoordinateMaths.MakeStarPolygon (screen, 5 * spot, 5, 2);

        chelp.SetBackground ("Cyan");
        chelp.SetForeground ("Blue");
        chelp.DrawPolygon (star);
    }
}

SculptureGarden.GalleryMap.prototype.toString = function()
{
    return "A Sculpture garden map display";
}
