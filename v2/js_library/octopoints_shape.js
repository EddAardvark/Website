//-------------------------------------------------------------------------------------------------
// A shape in an octagon/square tessellation
// Requires octapoints.js
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------



//==========================================================================================================
// Generic shape, specific shapes will inherit from this
//==========================================================================================================
OctoPoints.ScreenShape = function(type, perspective, sublattice, x, y)
{
    this.points = new Array(this.sides);
    this.x = x;
    this.y = y;
    this.shape_type = type;
    this.perspective = perspective;
    this.sublattice = sublattice;
    this.root = perspective + ".O" + this.sublattice;
    this.key = Key2D(this.root, x, y);
    this.wall_points = OctoPoints.ScreenOctagon.wall_points;
    this.items = {};
}

OctoPoints.ScreenShape.prototype.Make2dWalls = function ()
{
    var n = this.wall_points.length;
    this.walls2d = new Array (n);

    for (var i = 0 ; i < n ; ++i)
    {
        var wall_pts = this.wall_points[i];
        if(wall_pts)
        {
            var p1 = wall_pts[0];
            var p2 = wall_pts[1];
            this.walls2d[i] = [this.points[p1], this.points[p2]];
        }
    }
}


OctoPoints.ScreenShape.prototype.Make3dWalls = function (mapped_points, z_floor, z_ceil, x0, x1, y0, y1)
{
    var sides = this.wall_points.length;
    this.walls3d = new Array (sides);
    this.walls2d = new Array (sides);
    this.visible = false;

    for (var i = 0 ; i < sides ; ++i)
    {
        var temp = new MappedPoints.Shape (4);
        var wall_pts = this.wall_points[i];
        if(wall_pts)
        {
            var p1 = wall_pts[0];
            var p2 = wall_pts[1];
            this.walls2d[i] = [this.points[p1], this.points[p2]];

            temp.points [0] = mapped_points.MapPoint (this.points[p1][0], this.points[p1][1], z_floor);
            temp.points [1] = mapped_points.MapPoint (this.points[p2][0], this.points[p2][1], z_floor);
            temp.points [2] = mapped_points.MapPoint (this.points[p2][0], this.points[p2][1], z_ceil);
            temp.points [3] = mapped_points.MapPoint (this.points[p1][0], this.points[p1][1], z_ceil);

            var xc = (this.points[p1][0] + this.points[p2][0]) / 2;
            var yc = (this.points[p1][1] + this.points[p2][1]) / 2;
            var zc = 0.5;
            var dx = xc - mapped_points.x_eye;
            var dy = yc - mapped_points.y_eye;
            var dz = zc - mapped_points.z_eye;

            temp.SetDistance (Math.sqrt (dx * dx + dy * dy + dz * dz));
            temp.SetVisibleExtent (x0, x1, y0, y1);
            this.walls3d [i] = temp;
            this.walls2d[i] = [this.points[p1], this.points[p2]];
            this.visible = this.visible || temp.visible;
        }
    }
    var dx = this.xc - mapped_points.x_eye;
    var dy = this.yc - mapped_points.y_eye;
    var dzc = z_ceil - mapped_points.z_eye;
    var dzf = z_floor - mapped_points.z_eye;

    this.MakeFloor (Math.sqrt (dx * dx + dy * dy + dzf * dzf));
    this.MakeCeiling (Math.sqrt (dx * dx + dy * dy + dzc * dzc));

    this.visible = this.visible || this.floor.visible;
    this.visible = this.visible || this.ceiling.visible;
}

OctoPoints.ScreenShape.Rotate = new Array (8);

OctoPoints.ScreenShape.Rotate [Direction.N] = function (x,y,z) { return [x,y,z]; }
OctoPoints.ScreenShape.Rotate [Direction.E] = function (x,y,z) { return [-y,x,z]; }
OctoPoints.ScreenShape.Rotate [Direction.S] = function (x,y,z) { return [-x,-y,z]; }
OctoPoints.ScreenShape.Rotate [Direction.W] = function (x,y,z) { return [y,-x,z]; }
OctoPoints.ScreenShape.Rotate [Direction.NE] = function (x,y,z) { return [root_half * (x-y), root_half * (x+y), z]; }
OctoPoints.ScreenShape.Rotate [Direction.SE] = function (x,y,z) { return [- root_half * (x+y), root_half * (x-y), z]; }
OctoPoints.ScreenShape.Rotate [Direction.SW] = function (x,y,z) { return [- root_half * (x-y), - root_half * (x+y), z]; }
OctoPoints.ScreenShape.Rotate [Direction.NW] = function (x,y,z) { return [root_half * (x+y), - root_half * (x-y), z]; }

OctoPoints.ScreenShape.TestRotate = function (x,y)
{
    for (var i = 0 ; i < 8 ; ++i)
    {
        var r = OctoPoints.ScreenShape.Rotate[i](x,y);
        Misc.Log ("Rotate {0} of ({1},{2}) = ({3},{4})", i ,x, y, r[0], r[1]);
    }

}

OctoPoints.ScreenShape.prototype.TranslatePoints = function (z_floor, dir, points)
{
    var ret = new Array (points.length);
    var rotate = OctoPoints.ScreenShape.Rotate [dir];

    for (var idx in points)
    {
        var temp = rotate (points [idx][0], points [idx][1], points [idx][2]);
        ret [idx] = [temp[0] + this.xc, temp[1] + this.yc, temp[2] + z_floor];
    }
    return ret;
}





