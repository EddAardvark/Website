//-------------------------------------------------------------------------------------------------
// Points used to draw octagon/square tessellation
// Requires octapoints.js
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------


var root2 = Math.sqrt(2);
var root_half = Math.sqrt(0.5);

//==========================================================================================================
// Rather than store points in a bunch of arrays with a complicated indexing scheme I'm using maps
// that have a 2D coordinate plus a sub-lattice type as the key
//==========================================================================================================
Key2D = function(type,x,y)
{
    return type + '_' + x + '_' + y;
}
//==========================================================================================================
// The points used to draw an octagonal lattice on the screen. The spaces between the Octagons are squares
//==========================================================================================================

OctoPoints = function(){}
OctoPoints.shapes = {};     // The Octagons and squares in the lattice
OctoPoints.SQUARE = 1;
OctoPoints.OCTAGON = 2;
OctoPoints.v90 = 1 + root2/2;
OctoPoints.v45 = (1 + root2)/2;

OctoPoints.perspectives =
[
    "Sq90, Oct90", "Sq45", "Oct45"
];

OctoPoints.perspective_unit_cell =
{
    "Sq90":  [2 * OctoPoints.v90, 2 * OctoPoints.v90],
    "Oct90": [2 * OctoPoints.v90, 2 * OctoPoints.v90],
    "Sq45":  [2 * OctoPoints.v45, 2 * OctoPoints.v45],
    "Oct45": [2 * OctoPoints.v45, 2 * OctoPoints.v45]
};


// Represents where the observer is standing

OctoPoints.lattice_offsets = {};


OctoPoints.lattice_offsets["Sq90.S1"]  = [0, 0];
OctoPoints.lattice_offsets["Sq90.S2"]  = [OctoPoints.v90, OctoPoints.v90]
OctoPoints.lattice_offsets["Sq90.O1"]  = [0, OctoPoints.v90];
OctoPoints.lattice_offsets["Sq90.O2"]  = [OctoPoints.v90, 2 * OctoPoints.v90];

OctoPoints.lattice_offsets["Oct90.S1"] = [0, OctoPoints.v90];
OctoPoints.lattice_offsets["Oct90.S2"] = [OctoPoints.v90, 0];
OctoPoints.lattice_offsets["Oct90.O1"] = [0, 0];
OctoPoints.lattice_offsets["Oct90.O2"] = [OctoPoints.v90, OctoPoints.v90];

OctoPoints.lattice_offsets["Sq45.S1"]  = [0, 0];
OctoPoints.lattice_offsets["Sq45.O1"]  = [OctoPoints.v45, OctoPoints.v45];
OctoPoints.lattice_offsets["Oct45.O1"] = [0, 0];
OctoPoints.lattice_offsets["Oct45.S1"] = [OctoPoints.v45, OctoPoints.v45];


OctoPoints.num_sides = {};
OctoPoints.num_sides [OctoPoints.OCTAGON] = 8;
OctoPoints.num_sides [OctoPoints.SQUARE] = 4;

OctoPoints.inner_radius = {};
OctoPoints.inner_radius [OctoPoints.OCTAGON] = (1 + root2)/2;
OctoPoints.inner_radius [OctoPoints.SQUARE] = 0.5;

OctoPoints.outer_radius = {};
OctoPoints.outer_radius [OctoPoints.OCTAGON] = 1 + root2/2;
OctoPoints.outer_radius [OctoPoints.SQUARE] = root2/2;

//==========================================================================================================
// Neighbour mappings N, S, E, W, NE, SE, SW, NW
//==========================================================================================================

OctoPoints.neighbours = {};
OctoPoints.neighbours ["Sq90.S1"] =  [["O1",0,0],  ["O2",0,-1],  ["O1",0,-1],  ["O2",-1,-1], null,        null,         null,         null];
OctoPoints.neighbours ["Sq90.S2"] =  [["O2",0,0],  ["O1",1,0],   ["O2",0,-1],  ["O1",0,0],   null,        null,         null,         null];
OctoPoints.neighbours ["Sq90.O1"] =  [["S1",0,1],  ["S2",0,0],   ["S1",0,0],   ["S2",-1,0],  ["O2",0,0],  ["O2",0,-1],  ["O2",-1,-1], ["O2",-1,0]];
OctoPoints.neighbours ["Sq90.O2"] =  [["S2",0,1],  ["S1",1,1],   ["S2",0,0],   ["S1",0,1],   ["O1",1,1],  ["O1",1,0],   ["O1",0,0],   ["O1",0,1]];

OctoPoints.neighbours ["Oct90.S1"] = [["O1",0,1],  ["O2",0,0],   ["O1",0,0],   ["O2",-1,0],  null,        null,         null,         null];
OctoPoints.neighbours ["Oct90.S2"] = [["O2",0,0],  ["O1",1,0],   ["O2",0,-1],  ["O1",0,0],   null,        null,         null, null];
OctoPoints.neighbours ["Oct90.O1"] = [["S1",0,0],  ["S2",0,0],   ["S1",0,-1],  ["S2",-1,0],  ["O2",0,0],  ["O2",0,-1],  ["O2",-1,-1], ["O2",-1,0]];
OctoPoints.neighbours ["Oct90.O2"] = [["S2",0,1],  ["S1",1,0],   ["S2",0,0],   ["S1",0,0],   ["O1",1,1],  ["O1",1,0],   ["O1",0,0],   ["O1",0,1]];

OctoPoints.neighbours ["Sq45.S1"] =  [null,        null,         null,         null,         ["O1",0,0],  ["O1",0,-1],  ["O1",-1,-1], ["O1",-1,0]];
OctoPoints.neighbours ["Sq45.O1"] =  [["O1",0,1],  ["O1",1,0],   ["O1",0,-1],  ["O1",-1,0],  ["S1",1,1],  ["S1",1,0],   ["S1",0,0],   ["S1",0,1]];

OctoPoints.neighbours ["Oct45.S1"] = [null,        null,         null,         null,         ["O1",1,1],  ["O1",1,0],   ["O1",0,0],   ["O1",0,1]];
OctoPoints.neighbours ["Oct45.O1"] = [["O1",0,1],  ["O1",1,0],   ["O1",0,-1],  ["O1",-1,0],  ["S1",0,0],  ["S1",0,-1],  ["S1",-1,-1], ["S1",-1,0]];

//------------------------------------------------------------------------------------------------------------
OctoPoints.SetNeighbours = function(shape)
{
    shape.neighbours = [null,null,null,null,null,null,null,null];
    var neighbours = OctoPoints.neighbours [shape.root];

    for (var i = 0 ; i < neighbours.length ; ++i)
    {
        if (neighbours[i])
        {
            var root = shape.perspective + "." + neighbours[i][0];
            var dx = neighbours[i][1];
            var dy = neighbours[i][2];
            var key = Key2D(root, shape.x + dx, shape.y + dy);
            shape.neighbours [i] = OctoPoints.shapes [key];
        }
    }
}
//==========================================================================================================
// Construct the tessellations
//==========================================================================================================
OctoPoints.Initialise=function(full)
{
    this.full = full;
}

OctoPoints.MakeShapes = function(xmin,ymin,xmax,ymax)
{
    for(var x=xmin; x<=xmax; ++x)
    {
        for(var y=ymin; y<=ymax; ++y)
        {
            OctoPoints.AddShape(new OctoPoints.ScreenOctagon("Oct90", 1, x, y));
            OctoPoints.AddShape(new OctoPoints.ScreenOctagon("Oct90", 2, x, y));
            OctoPoints.AddShape(new OctoPoints.ScreenSquare("Oct90",  1, x, y));
            OctoPoints.AddShape(new OctoPoints.ScreenSquare("Oct90",  2, x, y));

            if (this.full)
            {
                OctoPoints.AddShape(new OctoPoints.ScreenOctagon("Sq90",  1, x, y));
                OctoPoints.AddShape(new OctoPoints.ScreenOctagon("Sq90",  2, x, y));
                OctoPoints.AddShape(new OctoPoints.ScreenSquare("Sq90",   1, x, y));
                OctoPoints.AddShape(new OctoPoints.ScreenSquare("Sq90",   2, x, y));

                OctoPoints.AddShape(new OctoPoints.ScreenOctagon("Sq45",  1, x, y));
                OctoPoints.AddShape(new OctoPoints.ScreenSquare("Sq45",   1, x, y));

                OctoPoints.AddShape(new OctoPoints.ScreenOctagon("Oct45", 1, x, y));
                OctoPoints.AddShape(new OctoPoints.ScreenSquare("Oct45",  1, x, y));
            }
        }
    }

    Misc.Log ("OctoPoints.shapes contains {0} entries", Object.keys(OctoPoints.shapes).length);

    Misc.Log ("Setting screen neighbours");
    for (var key in OctoPoints.shapes)
    {
        OctoPoints.SetNeighbours (OctoPoints.shapes[key]);
    }
}

OctoPoints.AddShape = function(s)
{
    OctoPoints.shapes[s.key] = s;
}

OctoPoints.Make2dWalls = function()
{
    for (var sidx in OctoPoints.shapes)
    {
        OctoPoints.shapes[sidx].Make2dWalls ();
    }
}
OctoPoints.Make3dWalls = function(mapped_points, z0, z1, x0, x1, y0, y1)
{
    var invisible = [];

    for (var sidx in OctoPoints.shapes)
    {
        OctoPoints.shapes[sidx].Make3dWalls (mapped_points, z0, z1, x0, x1, y0, y1);
    }
}

// Renders shapes in overhead view

OctoPoints.ShapeDrawer = function(img, chelp, wl, fl)
{
    this.chelp = chelp;
    this.image = img;
    this.wall_length = wl;
    this.fwd_limit = fl;

    var w = chelp.canvas.width;
    var h = chelp.canvas.height;
    this.xc = w / 2;
    this.yc = (this.fwd_limit + 4) * this.wall_length;
}

OctoPoints.ShapeDrawer.prototype.Clear = function()
{
    this.chelp.SetBackground ("skyblue");
    this.chelp.SetForeground ("black");
    this.chelp.SetLineWidth (1);

    this.chelp.DrawFilledRect (0, 0, this.chelp.canvas.width, this.chelp.canvas.height);
    this.chelp.DrawSpot (this.xc + this.wall_length/2, this.yc - this.wall_length/2, 3, "red");
}
OctoPoints.ShapeDrawer.prototype.Render=function()
{
    this.image.src=this.chelp.canvas.toDataURL('image/png');
}

OctoPoints.ShapeDrawer.prototype.Draw=function(shape)
{
    this.chelp.SetBackground ("transparent");
    var pts = [];

    for (var i in shape.points)
    {
        var pt=shape.points[i];
        if (!pt)return;

        var x = this.xc + this.wall_length * pt[0];
        var y = this.yc - this.wall_length * pt[1];
        pts.push([x,y]);
    }
    this.chelp.DrawPolygon(pts);
}

OctoPoints.MakeSpecialWalls = function (mapped_points, z0, z1)
{
    var p1 = [0.5,0.5];
    var p2 = [0.5,-3.5];

    OctoPoints.right_wall = new MappedPoints.Shape ();

    OctoPoints.right_wall.points [0] = mapped_points.MapPoint (p1[0], p1[1], z0);
    OctoPoints.right_wall.points [1] = mapped_points.MapPoint (p2[0], p2[1], z0);
    OctoPoints.right_wall.points [2] = mapped_points.MapPoint (p2[0], p2[1], z1);
    OctoPoints.right_wall.points [3] = mapped_points.MapPoint (p1[0], p1[1], z1);

    p1 = [-0.5,0.5];
    p2 = [-0.5,-3.5];

    OctoPoints.left_wall = new MappedPoints.Shape ();

    OctoPoints.left_wall.points [0] = mapped_points.MapPoint (p1[0], p1[1], z0);
    OctoPoints.left_wall.points [1] = mapped_points.MapPoint (p2[0], p2[1], z0);
    OctoPoints.left_wall.points [2] = mapped_points.MapPoint (p2[0], p2[1], z1);
    OctoPoints.left_wall.points [3] = mapped_points.MapPoint (p1[0], p1[1], z1);

    OctoPoints.left_wall.SetDistance (0);
    OctoPoints.right_wall.SetDistance (0);
}






