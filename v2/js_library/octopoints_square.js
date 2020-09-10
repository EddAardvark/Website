//-------------------------------------------------------------------------------------------------
// An octogon in an octagon/square tessellation,
// Inherits from OctoPoints.ScreenShape, requires octapoints.js
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------


//==========================================================================================================
// Single Square
//==========================================================================================================
OctoPoints.ScreenSquare = function(perspective, sublattice, x, y)
{
    OctoPoints.ScreenShape.call (this, OctoPoints.SQUARE, perspective, sublattice, x, y);

    this.points = new Array(4);
    this.x = x;
    this.y = y;
    this.shape_type = OctoPoints.SQUARE;
    this.sublattice = sublattice;
    this.perspective = perspective;
    this.root = perspective + ".S" + this.sublattice;
    this.key = Key2D(this.root, x, y);

    if (perspective == "Oct45" || perspective == "Sq45")
    {
        this.wall_points = OctoPoints.ScreenSquare.wall_points_45;
        this.points[0] = [0, -root2 / 2];
        this.points[1] = [-root2 / 2, 0];
        this.points[2] = [0, root2 / 2];
        this.points[3] = [root2 / 2, 0];
    }
    else
    {
        this.wall_points = OctoPoints.ScreenSquare.wall_points_90;
        this.points[0] = [-0.5, -0.5];
        this.points[1] = [-0.5, 0.5];
        this.points[2] = [0.5, 0.5];
        this.points[3] = [0.5, -0.5];
    }

    var lattice_ley = perspective + ".S" + sublattice;
    var unit_cell = OctoPoints.perspective_unit_cell [perspective];
    var lattice_offset = OctoPoints.lattice_offsets [lattice_ley];

    this.xc = lattice_offset [0] + x * unit_cell [0];
    this.yc = lattice_offset [1] + y * unit_cell [1];

    for (i = 0 ; i < 4 ; ++i)
    {
        this.points [i][0] += this.xc;
        this.points [i][1] += this.yc;
    }

    var furthest = (this.xc < 0) ? 1 : 2;
    this.d2 = this.points [furthest][0] * this.points [furthest][0] + this.points [furthest][1] * this.points [furthest][1];

}
OctoPoints.ScreenSquare.prototype = Object.create(OctoPoints.ScreenShape.prototype);

// Expects walls3d to have been initialised
OctoPoints.ScreenSquare.prototype.MakeFloor = function (d)
{
    this.floor = new MappedPoints.Shape (4);

    var noff = (this.perspective == "Oct45" || this.perspective == "Sq45") ? 4 : 0;

    for (var i = 0 ; i < 4 ; ++i)
    {
        this.floor.points [i] = this.walls3d[noff + i].points[0];
    }

    this.floor.SetDistance (d);
    this.floor.SetVisibleExtent ();
}
// Expects walls3d to have been initialised
OctoPoints.ScreenSquare.prototype.MakeCeiling = function (d)
{
    this.ceiling = new MappedPoints.Shape (4);

    var noff = (this.perspective == "Oct45" || this.perspective == "Sq45") ? 4 : 0;

    for (var i = 0 ; i < 4 ; ++i)
    {
        this.ceiling.points [i] = this.walls3d [noff + i].points[2];
    }

    this.ceiling.SetDistance (d);
    this.ceiling.SetVisibleExtent ();
}
//------------------------------------------------------------------------------------------------------------
OctoPoints.ScreenSquare.wall_points_90 = [[1,2],[2,3],[3,0],[0,1],null, null, null, null]; // N,E,S,W
OctoPoints.ScreenSquare.wall_points_45 = [null, null, null, null,[2,3],[3,0],[0,1],[1,2]]; // NE,SE,SW,NW

//------------------------------------------------------------------------------------------------------------
OctoPoints.ScreenSquare.prototype.toString = function()
{
    return "Square " + this.key;
}
