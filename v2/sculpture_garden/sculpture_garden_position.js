//-------------------------------------------------------------------------------------------------
// An (x,y) coordinate within the sculpture garden.
// requires SculptureGarden and Direction
// Assumes that the octagonal lattice is divided into four sub-lattices, O1, O2, S1 and S2.
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

SculptureGarden.Position = function (x, y)
{
    this.x_pos = Math.floor (x);
    this.y_pos = Math.floor (y);

    this.lattice_index = 2 * (Math.abs(x) % 2) + (Math.abs(y) % 2);
    this.lattice = SculptureGarden.Position.to_lattice [this.lattice_index];
    this.shape_type = SculptureGarden.Position.to_shape [this.lattice_index];
    this.key = SculptureGarden.Position.MakeKey (this.x_pos, this.y_pos);
}

SculptureGarden.Position.lattice_offset =
[
    [0,0],   // 0 = O1
    [0,1],   // 1 = S1
    [1,0],   // 2 = s2
    [1,1]    // 3 = O2
];

SculptureGarden.Position.to_lattice = ['O1', 'S1', 'S2', 'O2'];
SculptureGarden.Position.from_lattice = {'O1':0, 'S1':1, 'S2':2, 'O2':3};
SculptureGarden.Position.to_shape = [OctoPoints.OCTAGON, OctoPoints.SQUARE, OctoPoints.SQUARE, OctoPoints.OCTAGON];

// Directions are N, E, S, W, NE, SE, SW, NW

SculptureGarden.Position.delta = [[0,1], [1,0], [0,-1], [-1,0], [1,1], [1,-1], [-1,-1], [-1,1]];

SculptureGarden.Position.MakeKey = function (x, y)
{
    return Misc.Format ("{0}_{1}", x, y);
}

SculptureGarden.Position.prototype.Neighbour = function (d)
{
    if (this.shape_type == OctoPoints.SQUARE && Direction.orientation [d] != 90)
    {
        return null;
    }
    var delta = SculptureGarden.Position.delta[d];
    return new SculptureGarden.Position (this.x_pos + delta[0], this.y_pos + delta [1]);
}

// Creates a position from a lattice coordinate

SculptureGarden.Position.FromLatticePosition = function(lattice, x, y)
{
    var x_pos = 2 * x + SculptureGarden.Position.lattice_offset [this.lattice_index][0];
    var y_pos = 2 * y + SculptureGarden.Position.lattice_offset [this.lattice_index][1];

    return new SculptureGarden.Position (x_pos, y_pos);
}
// recreate from a key

SculptureGarden.Position.FromKey = function(key)
{
    var bits = key.split('_');
    var lattice = bits[0];
    var x_pos = parseInt (bits[0]);
    var y_pos = parseInt (bits[1])

    return new SculptureGarden.Position (x_pos, y_pos);
}

//------------------------------------------------------------------------------------------------------------
SculptureGarden.Position.prototype.toString = function()
{
    return Misc.Format ("SGPos {2} = ({0},{1})", this.x_pos, this.y_pos, this.key);
}
