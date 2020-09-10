//-------------------------------------------------------------------------------------------------
// An octogon in an octagon/square tessellation,
// Inherits from OctoPoints.ScreenShape, requires octapoints.js
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

//==========================================================================================================
// Single Octagon
//==========================================================================================================
OctoPoints.ScreenOctagon = function(perspective, sublattice, x, y)
{
    OctoPoints.ScreenShape.call (this, OctoPoints.OCTAGON, perspective, sublattice, x, y);

    this.points[0] = [].concat(OctoPoints.ScreenOctagon.A);
    this.points[1] = [].concat(OctoPoints.ScreenOctagon.B);
    this.points[2] = [].concat(OctoPoints.ScreenOctagon.C);
    this.points[3] = [].concat(OctoPoints.ScreenOctagon.D);
    this.points[4] = [].concat(OctoPoints.ScreenOctagon.E);
    this.points[5] = [].concat(OctoPoints.ScreenOctagon.F);
    this.points[6] = [].concat(OctoPoints.ScreenOctagon.G);
    this.points[7] = [].concat(OctoPoints.ScreenOctagon.H);

    var lattice_key = perspective + ".O" + sublattice;
    var unit_cell = OctoPoints.perspective_unit_cell [perspective];
    var lattice_offset = OctoPoints.lattice_offsets [lattice_key];

    this.xc = lattice_offset [0] + x * unit_cell [0];
    this.yc = lattice_offset [1] + y * unit_cell [1];

    for (i = 0 ; i < 8 ; ++i)
    {
        this.points [i][0] += this.xc;
        this.points [i][1] += this.yc;
    }

    var furthest = (this.xc < 0) ? 3 : 4;
    this.d2 = this.points [furthest][0] * this.points [furthest][0] + this.points [furthest][1] * this.points [furthest][1];
}

OctoPoints.ScreenOctagon.prototype = Object.create(OctoPoints.ScreenShape.prototype);


// An Octagon

var t = (1 + root2) / 2;

OctoPoints.ScreenOctagon.A = [-0.5, -t];
OctoPoints.ScreenOctagon.B = [-t, -0.5];
OctoPoints.ScreenOctagon.C = [-t, 0.5];
OctoPoints.ScreenOctagon.D = [-0.5, t];
OctoPoints.ScreenOctagon.E = [0.5, t];
OctoPoints.ScreenOctagon.F = [t, 0.5];
OctoPoints.ScreenOctagon.G = [t, -0.5];
OctoPoints.ScreenOctagon.H = [0.5, -t];

// Expects walls3d to have been initialised

OctoPoints.ScreenOctagon.prototype.MakeFloor = function (d)
{
    this.floor = new MappedPoints.Shape (8);

    for (var i = 0 ; i < 8 ; ++i)
    {
        this.floor.points [i] = this.walls3d[OctoPoints.ScreenOctagon.floor_points[i]].points [0];
    }

    this.floor.SetDistance (d);
    this.floor.SetVisibleExtent ();
}
// Expects walls3d to have been initialised
OctoPoints.ScreenOctagon.prototype.MakeCeiling = function (d)
{
    this.ceiling = new MappedPoints.Shape (8);

    for (var i = 0 ; i < 8 ; ++i)
    {
        this.ceiling.points [i] = this.walls3d[OctoPoints.ScreenOctagon.floor_points[i]].points[2];
    }

    this.ceiling.SetDistance (d);
    this.ceiling.SetVisibleExtent ();
}
//------------------------------------------------------------------------------------------------------------
// N, S, E, W, NE, SE, SW, NW
OctoPoints.ScreenOctagon.wall_points = [[3,4], [5,6], [7,0], [1,2], [4,5], [6,7], [0,1], [2,3]];
OctoPoints.ScreenOctagon.floor_points = [6,3,7,0,4,1,5,2];

//------------------------------------------------------------------------------------------------------------
OctoPoints.ScreenOctagon.prototype.toString=function()
{
    return "Octagon " + this.key;
}





