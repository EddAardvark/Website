//-------------------------------------------------------------------------------------------------
// Javascript A shape in the mapped points object
// Used to define the polygons that are displayed on the screen
//
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.Shape = function (n)
{
    this.points = new Array (n);
    this.fill = "pink";
    this.blend = 1;
    this.distance = 0;
}
MappedPoints.Shape.FADE_TO_GREY = 0.9;
MappedPoints.Shape.distance_shading = true;
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.Shape.prototype.SetDistance = function (d)
{
    this.distance = d;
    this.blend = Math.pow (MappedPoints.Shape.FADE_TO_GREY, d);
}
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.Shape.prototype.SetColour = function (c)
{
    this.fill = MappedPoints.Shape.distance_shading ? SVGColours.Blend (c, "darkslategray", this.blend) : c;
}
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.Shape.prototype.MapWallPoint = function (x,y)
{
    // This function assumes that the square is a perspective view of a unit square (00)-(11). It is used to draw
    // on the square by applying perspective to the original points.

    if (! this.f)
    {
        this.l = this.points[3][1] - this.points[0][1];
        this.f = (this.points[2][1] - this.points[1][1]) / this.l;
        this.natural = Math.abs(1-this.f) < 1e-6;
    }

    var g;
    var fn;

    if (this.natural)
    {
         g = x;
         fn = 1;
    }
    else
    {
        fn = Math.pow(this.f, x);
        g = (1 - fn) / (1 - this.f);
    }

    var xpos = this.points[0][0] + g * (this.points[1][0] - this.points[0][0]);
    var ypos = this.points[0][1] + g * (this.points[1][1] - this.points[0][1]) + this.l * y * fn;

    return [xpos,ypos];
}
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.Shape.prototype.GetWindowRect = function (xpos, ypos, width, height)
{
    // Co-ords relative to the shape so 0.5 is the centre and 1 is the width

    var x0 = xpos - width / 2;
    var x1 = xpos + width / 2;
    var y0 = ypos - height / 2;
    var y1 = ypos + height / 2;

    var p4 = this.MapWallPoint (x0, y0);
    var p5 = this.MapWallPoint (x0, y1);
    var p6 = this.MapWallPoint (x1, y1);
    var p7 = this.MapWallPoint (x1, y0);

    return [p4, p5, p6, p7];
}
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.Shape.prototype.SetVisibleExtent = function (window_xmin, window_ymin, window_xmax, window_ymax)
{
    var xcoords = this.points.map (x => x[0]);
    var ycoords = this.points.map (x => x[1]);
    this.xmin = Math.min (...xcoords);
    this.xmax = Math.max (...xcoords);
    this.ymin = Math.min (...ycoords);
    this.ymax = Math.max (...ycoords);

    this.visible = this.xmin < window_xmax
                && this.ymin < window_ymax
                && this.xmax > window_xmin
                && this.ymax > window_ymin;
}
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.Shape.prototype.toString = function ()
{
  return Misc.Format ("Shape: Blend {0}, distance {1}, fill {2}", this.blend, this.distance, this.fill);
}


