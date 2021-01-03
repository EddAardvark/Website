//-------------------------------------------------------------------------------------------------
// An item for use in the Octomaze
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------


//==============================================================
OctoMaze.Item = function(n, shape_map)
{
    this.points = new Array(n);
    this.shape_map = shape_map;
    this.colours = new Array(shape_map.length);
}

OctoMaze.Item.prototype.SetColours  = function(list)
{
    for (var i = 0 ; i < this.colours.length && i < list.length ; ++i)
    {
        this.colours [i] = list [i];
    }
}

OctoMaze.Item.prototype.MakePlanes = function (pts3d, mapped_points)
{
    var pts2d = new Array (pts3d.length);

    for (idx in pts3d)
    {
        pts2d [idx] = mapped_points.MapPoint (pts3d[idx][0], pts3d[idx][1], pts3d[idx][2]);
    }

    var ret = new Array (this.shape_map.length);

    for (idx in this.shape_map)
    {
        var xsum = 0;
        var ysum = 0;
        var zsum = 0;
        var point_map = this.shape_map [idx];
        var temp = new MappedPoints.Shape (point_map.length);

        for (pidx in point_map)
        {
            var pt3d = pts3d [point_map[pidx]];

            temp.points [pidx] = pts2d [point_map[pidx]];
            xsum += pt3d [0];
            ysum += pt3d [1];
            zsum += pt3d [2];
        }

        var dx = (xsum/point_map.length) - mapped_points.x_eye;
        var dy = (ysum/point_map.length) - mapped_points.y_eye;
        var dz = (zsum/point_map.length) - mapped_points.z_eye;

        temp.SetDistance (Math.sqrt (dx * dx + dy * dy + dz * dz));
        temp.SetColour(this.colours [idx]);

        ret [idx] = temp;
    }
    return ret;
}

OctoMaze.Item.prototype.toString = function()
{
    return Misc.Format ("Item: num_points = {0}", this.points.length);
}

//---------------------------- Square Pyramid-----------------------------------

OctoMaze.Item.Pyramid = function (orthogonal, width, hover, height)
{
    OctoMaze.Item.call (this, 5, OctoMaze.Item.Pyramid.shape_map);

    if (orthogonal)
    {
        var r2 = width/2;
        this.points [0] = [-r2, -r2, hover];
        this.points [1] = [-r2, r2, hover];
        this.points [2] = [r2, r2, hover];
        this.points [3] = [r2, -r2, hover];
        this.points [4] = [0, 0, hover + height];
    }
    else
    {
        var r2 = width * root_half;
        this.points [0] = [-r2, 0, hover];
        this.points [1] = [0, r2, hover];
        this.points [2] = [r2, 0, hover];
        this.points [3] = [0, -r2, hover];
        this.points [4] = [0, 0, hover + height];
    }
}
OctoMaze.Item.Pyramid.prototype = Object.create(OctoMaze.Item.prototype);

// Turns the points into shapes
OctoMaze.Item.Pyramid.shape_map =
[
    [0,1,4], [1,2,4], [2,3,4], [3,0,4], [0,1,2,3]
];

//---------------------------- Octahedron -----------------------------------
OctoMaze.Item.Octahedron = function (orthogonal, width, bottom, middle, top)
{
    OctoMaze.Item.call (this, 5, OctoMaze.Item.Octahedron.shape_map);

    if (orthogonal)
    {
        var r2 = width/2;
        this.points [0] = [-r2, -r2, middle];
        this.points [1] = [-r2, r2, middle];
        this.points [2] = [r2, r2, middle];
        this.points [3] = [r2, -r2, middle];
        this.points [4] = [0, 0, top];
        this.points [5] = [0, 0, bottom];
    }
    else
    {
        var r2 = width * root_half;
        this.points [0] = [-r2, 0, middle];
        this.points [1] = [0, r2, middle];
        this.points [2] = [r2, 0, middle];
        this.points [3] = [0, -r2, middle];
        this.points [4] = [0, 0, top];
        this.points [5] = [0, 0, bottom];
    }
}
OctoMaze.Item.Octahedron.prototype = Object.create(OctoMaze.Item.prototype);

// Turns the points into shapes
OctoMaze.Item.Octahedron.shape_map =
[
    [0,1,4], [1,2,4], [2,3,4], [3,0,4], [0,1,5], [1,2,5], [2,3,5], [3,0,5],
];




