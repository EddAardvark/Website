//-------------------------------------------------------------------------------------------------
// A wall hanging work of art in the sculpture garden
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------


//=======================================================================================================================
// Panels separate cells of different types
//=======================================================================================================================
SculptureGarden.Panels = function()
{
    this.type = SculptureGarden.Panels.DOOR;
}

SculptureGarden.Panels.WHOLE = 0;
SculptureGarden.Panels.DOOR = 1;
SculptureGarden.Panels.TRIANGLE_FENCE = 2;
SculptureGarden.Panels.HORIZONTAL_BARS = 3;

SculptureGarden.Panels.Door = function (colour, width, height)
{
    this.colour = colour;
    this.width = width;
    this.height = height;
    this.type = SculptureGarden.Panels.DOOR;
}

SculptureGarden.Panels.Door.prototype.Construct = function(shape)
{
    var x0 = 0.5 - this.width / 2;
    var x1 = 0.5 + this.width / 2;
    var y1 = this.height;

    var doorway = [[0,0], [x0,0], [x0,y1], [x1,y1], [x1,0], [1,0], [1,1], [0,1]];
    var draw = doorway.map (s => CoordinateMaths.MapToQuadrilateral (s[0], s[1], shape.points, [0,3,2,1]));
    var ret = new MappedPoints.Shape (8);

    ret.points = draw;
    ret.distance = shape.distance;
    ret.blend = shape.blend;
    ret.SetColour(this.colour);

    return [ret];
}

SculptureGarden.Panels.Door.prototype.toString = function()
{
    return Misc.Format ("Door: {0} {1} x {2}", this.colour, this.width, this.height);
}
//------------------------------------------------------------------------------------------------------------------------------------

SculptureGarden.Panels.TriangleFence = function (colour, num, height1, height2, height3, width, gap)
{
    this.colour = colour;
    this.height1 = height1;
    this.height2 = height2;
    this.height3 = height3;
    this.num = num;
    this.width = width;
    this.gap = gap;
    this.type = SculptureGarden.Panels.TRIANGLE_FENCE;
}

SculptureGarden.Panels.TriangleFence.prototype.Construct = function (shape)
{
    var w = this.num * (this.gap + this.width) + this.gap;
    var f = 1 / w;
    var x0 = this.gap * f;
    var x1 = (this.gap + this.width) * f;
    var step = x1;
    var ret = [];

    for (var i = 0 ; i < this.num ; ++i)
    {
        var coords = [[x0,this.height1], [x0,this.height2], [(x0 + x1)/2,this.height3], [x1,this.height2], [x1,this.height1]];
        var draw = coords.map (s => CoordinateMaths.MapToQuadrilateral (s[0], s[1], shape.points, [0,3,2,1]));
        var s2 = new MappedPoints.Shape (8);

        s2.points = draw;
        s2.distance = shape.distance;
        s2.blend = shape.blend;
        s2.SetColour(this.colour);

        ret.push (s2);
        x0 += step;
        x1 += step;
    }

    return ret;
}
SculptureGarden.Panels.TriangleFence.prototype.toString = function()
{
    return Misc.Format ("TriangleFence: {0} {1} x [H = ({2}, {3}, {4})], W = ({5}, {6})", this.colour, this.num, this.height, this.gap, this.width);
}
//------------------------------------------------------------------------------------------------------------------------------------

SculptureGarden.Panels.HorizontalBarFence = function (colour, num, start, bar_height, gap)
{
    this.colour = colour;
    this.num = num;
    this.start = start;
    this.bar_height = bar_height;
    this.gap = gap;
    this.type = SculptureGarden.Panels.HORIZONTAL_BARS;
}
SculptureGarden.Panels.HorizontalBarFence.prototype.Construct = function (shape)
{
    var ret = [];
    var y0 = this.start;
    var y1 = y0 + this.bar_height;
    var step = this.gap + this.bar_height;

    for (var i = 0 ; i < this.num ; ++i)
    {
        var coords = [[0,y0], [1,y0], [1,y1], [0,y1]]
        var draw = coords.map (s => CoordinateMaths.MapToQuadrilateral (s[0], s[1], shape.points, [0,3,2,1]));
        var s2 = new MappedPoints.Shape (8);

        s2.points = draw;
        s2.distance = shape.distance;
        s2.blend = shape.blend;
        s2.SetColour(this.colour);

        ret.push (s2);
        y0 += step;
        y1 += step;
    }

    return ret;
}

SculptureGarden.Panels.HorizontalBarFence.prototype.toString = function()
{
    return Misc.Format ("HorizontalBarFence: {0} gap: {1} x (bar: {2}, gap: {3}), start: {4}", this.colour, this.num, this.bar_height, this.gap, this.start);
}

