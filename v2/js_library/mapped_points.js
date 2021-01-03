//-------------------------------------------------------------------------------------------------
// Javascript Mapped points definition.
// Used to create a static map between a 3D grid to the screen.
//
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints = function (x_min, x_max, y_min, y_max, z_min, z_max)
{
    this.x_min = x_min;
    this.y_min = y_min;
    this.z_min = z_min;
    this.x_max = x_max;
    this.y_max = y_max;
    this.z_max = z_max;
    this.nx = x_max - x_min + 1;
    this.ny = y_max - y_min + 1;
    this.nz = z_max - z_min + 1;

    this.f = 0.8;
    this.scale = 900;
    this.x_vanish = 400;
    this.y_vanish = 400;
    this.x_eye = 0.5;
    this.y_eye = -1.5;
    this.z_eye = 1.7;
    this.screen_height = 400;
}

//------------------------------------------------------------------------------------------------------------------------------------
// The point in the view where lines converge.
// scale - the length of a unit line at Y = 0;
// perspective - the ratio between a line at Y = 1 and Y = 0;
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.prototype.SetVanishingPoint = function (scale, perspective, x_vanish, y_vanish)
{
    this.f = perspective;
    this.scale = scale;
    this.x_vanish = x_vanish;
    this.y_vanish = y_vanish;
}
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.prototype.SetEye = function (x_eye, y_eye, z_eye)
{
    this.x_eye = x_eye;
    this.y_eye = y_eye;
    this.z_eye = z_eye;
}
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.prototype.SetScreenHeight = function (sh)
{
    this.screen_height = sh;
}

//------------------------------------------------------------------------------------------------------------------------------------
// Cache the mapped points, works fine if we are only using lattice points in the
// predefined ranges.
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.prototype.MapPoints = function ()
{
    this.points = new Array(this.nx * this.ny * this.nz);

    for (var y = this.y_min ; y <= this.y_max ; ++y)
    {
        for (var x = this.x_min ; x <= this.x_max ; ++x)
        {
            for (var z = this.z_min ; z <= this.z_max ; ++z)
            {
                var pt = this.MapPoint(x, y, z);

                var dx = x - this.x_eye;
                var dy = y - this.y_eye;
                var dz = z - this.z_eye;
                var d2 = dx * dx + dy * dy + dz * dz;
                this.points[this.GetIndex(x,y,z)] = [pt, d2];
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.prototype.MapPoint = function (x, y, z)
{
    var xpos = x - this.x_eye;
    var ypos = y - this.y_eye;
    var zpos = z - this.z_eye;
    var fn = Math.pow (this.f, ypos);
    var xscreen = this.x_vanish + this.scale * fn * xpos;
    var yscreen = this.screen_height - (this.y_vanish + this.scale * fn * zpos);

    return [xscreen, yscreen];
}
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.prototype.GetPoint = function (x, y, z)
{
    return this.points[this.GetIndex(x,y,z)];
}
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.prototype.GetIndex = function (x, y, z)
{
    return (z - this.z_min) + this.nz * (y - this.y_min) + this.ny * this.nz * (x - this.x_min);
}
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.prototype.BuildSquareMap = function (mapped_points)
{
    this.squares = {};

    for (var x = this.x_min ; x < this.x_max ; ++x)
    {
        for (var y = this.y_min ; y < this.y_max ; ++y)
        {
            for (var z = this.z_min ; z < this.z_max ; ++z)
            {
                var temp = new MappedPoints.Shape (4);

                // XY Plane

                temp.points [0] = this.GetPoint (x, y, z)[0];
                temp.points [1] = this.GetPoint (x + 1, y + 1, z)[0];
                temp.points [2] = this.GetPoint (x + 1, y, z)[0];
                temp.points [3] = this.GetPoint (x, y + 1, z)[0];

                this.AddSquareToMap (MappedPoints.MakeSquareKey("XY", x, y, z), x + 0.5, y + 0.5, z, temp);

                // XZ Plane

                temp = new MappedPoints.Shape (4);

                temp.points [0] = this.GetPoint (x, y, z)[0];
                temp.points [1] = this.GetPoint (x + 1, y, z + 1)[0];
                temp.points [2] = this.GetPoint (x + 1, y, z)[0];
                temp.points [3] = this.GetPoint (x, y, z + 1)[0];
                temp.SetDistance (x + 0.5, y, z + 0.5);

                this.AddSquareToMap (MappedPoints.MakeSquareKey("XZ", x, y, z), x + 0.5, y, z + 0.5, temp);

                // YZ Plane

                temp = new MappedPoints.Shape (4);

                temp.points [0] = this.GetPoint (x, y, z)[0];
                temp.points [1] = this.GetPoint (x, y + 1, z + 1)[0];
                temp.points [2] = this.GetPoint (x, y + 1, z)[0];
                temp.points [3] = this.GetPoint (x, y, z + 1)[0];
                temp.SetDistance (x, y + 0.5, z + 0.5);

                this.AddSquareToMap (MappedPoints.MakeSquareKey("YZ", x, y, z), x, y + 0.5, z + 0.5, temp);
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.prototype.AddSquareToMap = function (key, xc, yc, zc, sq)
{
    var dx = xc - this.x_eye;
    var dy = yc - this.y_eye;
    var dz = zc - this.z_eye;

    sq.SetDistance (Math.sqrt (dx * dx + dy * dy + dz * dz));

    this.squares [key] = sq;
}
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.MakeSquareKey = function (plane, x, y, z)
{
    return plane + "_" + x + "_" + y + "_" + z;
}
//------------------------------------------------------------------------------------------------------------------------------------
// Square an XY plane, chelp is a canvas helper (canvas_helpers.js)
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.prototype.DrawXYPlaneToCanvas = function (chelp, z)
{
    for (var x = this.x_min ; x < this.x_max ; ++x)
    {
        for (var y = this.y_min ; y < this.y_max ; ++y)
        {
            this.DrawSquareToCanvas (chelp, "XY", x, y, z);
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------------------
// Square an YZ plane, chelp is a canvas helper (canvas_helpers.js)
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.prototype.DrawYZPlaneToCanvas = function (chelp, x)
{
    for (var z = this.z_min ; z < this.z_max ; ++z)
    {
        for (var y = this.y_min ; y < this.y_max ; ++y)
        {
            this.DrawSquareToCanvas (chelp, "YZ", x, y, z);
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------------------
// Square an YZ plane, chelp is a canvas helper (canvas_helpers.js)
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.prototype.DrawXZPlaneToCanvas = function (chelp, y)
{
    for (var x = this.x_min ; x < this.x_max ; ++x)
    {
        for (var z = this.z_min ; z < this.z_max ; ++z)
        {
            this.DrawSquareToCanvas (chelp, "XZ", x, y, z);
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------------------
// Draw the whole lattice
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.prototype.DrawLatticeToCanvas = function (chelp)
{
    for (var x = this.x_min ; x < this.x_max ; ++x)
    {
        for (var y = this.y_min ; y < this.y_max ; ++y)
        {
            for (var z = this.z_min ; z < this.z_max ; ++z)
            {
                this.DrawSquareToCanvas (chelp, "XZ", x, y, z);
                this.DrawSquareToCanvas (chelp, "YZ", x, y, z);
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------------------
// Square in the XY plane, chelp is a canvas helper (canvas_helpers.js)
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.prototype.DrawSquareToCanvas = function (chelp, type, x, y, z)
{
    var square = this.GetSquare (type, x, y, z);

    if (square)
    {
        this.DrawSquare (chelp, square);
    }
}
//------------------------------------------------------------------------------------------------------------------------------------
// Square in the XY plane, chelp is a canvas helper (canvas_helpers.js)
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.prototype.GetSquare = function (type, x, y, z)
{
    return this.squares [MappedPoints.MakeSquareKey(type, x, y, z)];
}
//------------------------------------------------------------------------------------------------------------------------------------
// Square in the XY plane, chelp is a canvas helper (canvas_helpers.js)
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.prototype.DrawSquare = function (chelp, square)
{
    chelp.SetBackground (square.fill);
    chelp.DrawPolygon (square.points);
}
//------------------------------------------------------------------------------------------------------------------------------------
MappedPoints.prototype.toString = function ()
{
  return "Mapped points: (" + [this.x_min, this.y_min, this.z_min] + ")-(" + [this.x_max, this.y_max, this.z_max] + ")): "
                            + this.nx + "x" + this.ny + "x" + this.nz;
}



