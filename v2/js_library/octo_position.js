//-------------------------------------------------------------------------------------------------
// An (x,y) coordinate within the sculpture garden.
// requires SculptureGarden and Direction
// Assumes that the octagonal lattice is divided into four sub-lattices, O1, O2, S1 and S2.
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

OctoPosition = function (x, y)
{
    this.x_pos = Math.floor (x);
    this.y_pos = Math.floor (y);

    this.lattice_index = 2 * (Math.abs(x) % 2) + (Math.abs(y) % 2);
    this.lattice = OctoPosition.to_lattice [this.lattice_index];
    this.shape_type = OctoPosition.to_shape [this.lattice_index];
    this.key = OctoPosition.MakeKey (this.x_pos, this.y_pos);
}

OctoPosition.lattice_offset =
[
    [0,0],   // 0 = O1
    [0,1],   // 1 = S1
    [1,0],   // 2 = s2
    [1,1]    // 3 = O2
];

OctoPosition.to_lattice = ['O1', 'S1', 'S2', 'O2'];
OctoPosition.from_lattice = {'O1':0, 'S1':1, 'S2':2, 'O2':3};
OctoPosition.to_shape = [OctoPoints.OCTAGON, OctoPoints.SQUARE, OctoPoints.SQUARE, OctoPoints.OCTAGON];

// Directions are N, E, S, W, NE, SE, SW, NW

OctoPosition.delta = [[0,1], [1,0], [0,-1], [-1,0], [1,1], [1,-1], [-1,-1], [-1,1]];

OctoPosition.MakeKey = function (x, y)
{
    return Misc.Format ("{0}_{1}", x, y);
}

OctoPosition.prototype.Neighbour = function (d)
{
    if (this.shape_type == OctoPoints.SQUARE && Direction.orientation [d] != 90)
    {
        return null;
    }
    var delta = OctoPosition.delta[d];
    return new OctoPosition (this.x_pos + delta[0], this.y_pos + delta [1]);
}
OctoPosition.prototype.Neighbours = function ()
{
    var ret = [];
    for (var d = 0 ; d < 8 ; ++d)
    {
        if (this.shape_type != OctoPoints.SQUARE || Direction.orientation [d] == 90)
        {
            var delta = OctoPosition.delta[d];
            ret.push (new OctoPosition (this.x_pos + delta[0], this.y_pos + delta [1]));
        }
    }
    return ret;
}
// Creates a position from a lattice coordinate

OctoPosition.FromLatticePosition = function(lattice, x, y)
{
    var x_pos = 2 * x + OctoPosition.lattice_offset [this.lattice_index][0];
    var y_pos = 2 * y + OctoPosition.lattice_offset [this.lattice_index][1];

    return new OctoPosition (x_pos, y_pos);
}
// recreate from a key

OctoPosition.FromKey = function(key)
{
    var bits = key.split('_');
    var lattice = bits[0];
    var x_pos = parseInt (bits[0]);
    var y_pos = parseInt (bits[1])

    return new OctoPosition (x_pos, y_pos);
}
// split a key into an x,y pair

OctoPosition.SplitKey = function(key)
{
    var bits = key.split('_');
    var lattice = bits[0];
    return [parseInt (bits[0]), parseInt (bits[1])];
}

//------------------------------------------------------------------------------------------------------------
OctoPosition.prototype.toString = function()
{
    return Misc.Format ("SGPos {2} = ({0},{1})", this.x_pos, this.y_pos, this.key);
}
