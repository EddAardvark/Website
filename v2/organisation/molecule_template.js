//-------------------------------------------------------------------------------------------------
// A molecule template. Real molecules are instances of one of these templates that can
// Also have, position, orientation and parity
//
// In this model molecules are basically square, but each face can be flat, indented or spikey.
// The spikes match the indents which is the basis of the intermolecular interaction and the 
// self organisation we are hoping to simulate.
//
// (c) John Whitehouse 2020
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

MoleculeTemplate = function ()
{
    this.colour="yellow";
    this.id = -1;
}

// bottom, right, top, left

MoleculeTemplate.BOT = 0;
MoleculeTemplate.RGT = 1;
MoleculeTemplate.TOP = 2;
MoleculeTemplate.LFT = 3;

MoleculeTemplate.BOTTOM = 
[
    [ [0,10], [10,10] ], 
    [ [0,10], [3,10], [5,12], [7,10], [10,10] ],
    [ [0,10], [3,10], [5,8],  [7,10], [10,10] ],
];

MoleculeTemplate.RIGHT = 
[
    [ [10,10], [10,0] ],
    [ [10,10], [10,7], [12,5], [10,3], [10,0] ],
    [ [10,10], [10,7], [8,5],  [10,3], [10,0] ],
];

MoleculeTemplate.TOP = 
[
    [ [10,0], [0,0] ],
    [ [10,0], [7,0], [5,-2], [3,0], [0,0] ],
    [ [10,0], [7,0], [5,2],  [3,0], [0,0] ],
],

MoleculeTemplate.LEFT = 
[
    [ [0,0], [0,10] ],
    [ [0,0], [0,3], [-2,5], [0,7], [0,10] ],
    [ [0,0], [0,3], [2,5],  [0,7], [0,10] ],
];
                 
MoleculeTemplate.sides = [MoleculeTemplate.BOTTOM, MoleculeTemplate.RIGHT, MoleculeTemplate.TOP, MoleculeTemplate.LEFT];

MoleculeTemplate.STRAIGHT = 0;
MoleculeTemplate.OUT = 1;
MoleculeTemplate.IN = 2;

MoleculeTemplate.Size = 10;     // Size of the pattern in pixels

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







