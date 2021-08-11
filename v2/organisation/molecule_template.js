//-------------------------------------------------------------------------------------------------
// A molecule template. Real molecules are instances of one of these templates that can
// Also have, position, orientation and parity
//
// In this model molecules are basically square, but each face can be flat, indented or spikey.
// The spikes match the indents which is the basis of the intermolecular interaction and the 
// self organisation we are hoping to simulate.
//
// (c) John Whitehouse 2021
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

MoleculeTemplate = function ()
{
    this.colour="yellow";
    this.id = -1;
}

MoleculeTemplate.LEFT = 0;
MoleculeTemplate.TOP = 1;
MoleculeTemplate.RIGHT = 2;
MoleculeTemplate.BOTTOM = 3;

MoleculeTemplate.opposite_edge = [];
MoleculeTemplate.opposite_edge [MoleculeTemplate.LEFT] = MoleculeTemplate.RIGHT;
MoleculeTemplate.opposite_edge [MoleculeTemplate.RIGHT] = MoleculeTemplate.LEFT;
MoleculeTemplate.opposite_edge [MoleculeTemplate.BOTTOM] = MoleculeTemplate.TOP;
MoleculeTemplate.opposite_edge [MoleculeTemplate.TOP] = MoleculeTemplate.BOTTOM;

MoleculeTemplate.face_names = ["LEFT", "TOP", "RIGHT", "BOTTOM"];

// bottom, right, top, left

MoleculeTemplate.top_side = 
[
    [ [0,10], [10,10] ], 
    [ [0,10], [3,10], [5,12], [7,10], [10,10] ],
    [ [0,10], [3,10], [5,8],  [7,10], [10,10] ],
];

MoleculeTemplate.right_side = 
[
    [ [10,10], [10,0] ],
    [ [10,10], [10,7], [12,5], [10,3], [10,0] ],
    [ [10,10], [10,7], [8,5],  [10,3], [10,0] ],
];

MoleculeTemplate.bottom_side = 
[
    [ [10,0], [0,0] ],
    [ [10,0], [7,0], [5,-2], [3,0], [0,0] ],
    [ [10,0], [7,0], [5,2],  [3,0], [0,0] ],
],

MoleculeTemplate.left_side = 
[
    [ [0,0], [0,10] ],
    [ [0,0], [0,3], [-2,5], [0,7], [0,10] ],
    [ [0,0], [0,3], [2,5],  [0,7], [0,10] ],
];

MoleculeTemplate.STRAIGHT = 0;
MoleculeTemplate.OUT = 1;
MoleculeTemplate.IN = 2;

MoleculeTemplate.edge_names = ["Flat", "Spike", "Socket"];

MoleculeTemplate.allowed_edges =
[
    [true,  false, true],
    [false, false, true],
    [true,  true,  true],
];

MoleculeTemplate.sides = [];
MoleculeTemplate.sides [MoleculeTemplate.LEFT] = MoleculeTemplate.left_side;
MoleculeTemplate.sides [MoleculeTemplate.RIGHT] = MoleculeTemplate.right_side;
MoleculeTemplate.sides [MoleculeTemplate.TOP] = MoleculeTemplate.top_side;
MoleculeTemplate.sides [MoleculeTemplate.BOTTOM] = MoleculeTemplate.bottom_side;

MoleculeTemplate.Size = 10;     // Size of the pattern in pixels

MoleculeTemplate.GetEdgeName = function (edge) { return MoleculeTemplate.edge_names [edge]; }
MoleculeTemplate.GetFaceName = function (face) { return MoleculeTemplate.face_names [face]; }

//-------------------------------------------------------------------------------------------------
MoleculeTemplate.allowed = function (edge1, edge2)
{
    return MoleculeTemplate.allowed_edges [edge1][edge2];
}

//------------------------------------------------------------------------------------------------------------
MoleculeTemplate.Create = function ()
{
    return MoleculeTemplate.CreateFromEdges ([MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT]);
}
//------------------------------------------------------------------------------------------------------------
MoleculeTemplate.CreateFromEdges = function (edges)
{
    var m = new MoleculeTemplate;
    m.edges = [...edges];
    return m;
}
//------------------------------------------------------------------------------------------------------------
MoleculeTemplate.CreateRandom = function ()
{
    var edges = [];
    
    for (var i = 0 ; i < 4 ; ++i)
    {
        edges.push (Misc.RandomInteger(3));
    }
    return MoleculeTemplate.CreateFromEdges (edges);
}
//------------------------------------------------------------------------------------------------------------
MoleculeTemplate.prototype.update_edges = function (new_edges)
{
    this.edges = new_edges;
}
//------------------------------------------------------------------------------------------------------------
MoleculeTemplate.prototype.get_edge = function (i, flip, rot)
{
    var idx = flip ? [0,1,2,3] : [0,3,2,1];
    
    var edge = (idx [i] + rot) % 4;
    return this.edges [edge];

}
//------------------------------------------------------------------------------------------------------------
MoleculeTemplate.prototype.get_points = function (flip, rot)
{
    var idx = flip ? [0,1,2,3] : [0,3,2,1];
    var pts = [null];
    
    for (var i = 0 ; i < 4 ; ++i)
    {
        var edge = (idx [i] + rot) % 4;
        var edge_pts = MoleculeTemplate.sides [i] [this.edges [edge]];
        pts.pop();
        pts = pts.concat(edge_pts);
    }
    
    return pts;
}
//------------------------------------------------------------------------------------------------------------
MoleculeTemplate.prototype.set_colour = function (c)
{
    this.colour = c;
}







