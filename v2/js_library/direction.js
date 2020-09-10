//-------------------------------------------------------------------------------------------------
// Javascript Direction class definition. Used in maze drawing
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

Direction = function(d)
{
    this.d = d;
}


// Directions

Direction.N  = 0;
Direction.E  = 1;
Direction.S  = 2;
Direction.W  = 3;
Direction.NE = 4;
Direction.SE = 5;
Direction.SW = 6;
Direction.NW = 7;

Direction.NUM = 8;
Direction.rh = Math.sqrt(0.5);

Direction.names = ["North", "East", "South", "West", "North East", "South East", "South West", "North West"];
Direction.vectors = [[0,1],[1,0],[0,-1],[-1,0],[1,1],[1,-1],[-1,-1],[-1,1]];
Direction.orientation = [90, 90, 90, 90, 45, 45, 45, 45];
Direction.rotate = [
    [1,0,0,1],
    [0,1,-1,0],
    [-1,0,0,-1],
    [0,-1,1,0],
    [Direction.rh, Direction.rh, -Direction.rh, Direction.rh],
    [-Direction.rh, Direction.rh, -Direction.rh, -Direction.rh],
    [-Direction.rh, -Direction.rh, Direction.rh, -Direction.rh],
    [Direction.rh, -Direction.rh, Direction.rh, Direction.rh]
];


Direction.prototype.TurnLeft45 = function ()
{
    this.d = Direction.turn_left45 [this.d];
}
Direction.prototype.TurnRight45 = function ()
{
    this.d = Direction.turn_right45 [this.d];
}
Direction.prototype.TurnLeft90 = function ()
{
    this.d = Direction.turn_left90 [this.d];
}
Direction.prototype.TurnRight90 = function ()
{
    this.d = Direction.turn_right90 [this.d];
}
Direction.prototype.TurnAround = function ()
{
    this.d = Direction.turn_around [this.d];
}
Direction.prototype.GetReverse = function ()
{
    return new Direction (Direction.turn_around [this.d]);
}
Direction.prototype.GetLeft45 = function ()
{
    return new Direction (Direction.turn_left45 [this.d]);
}
Direction.prototype.GetLeft90 = function ()
{
    return new Direction (Direction.turn_left90 [this.d]);
}
Direction.prototype.GetLeft135 = function ()
{
    return new Direction (Direction.turn_left135 [this.d]);
}
Direction.prototype.GetRight45 = function ()
{
    return new Direction (Direction.turn_right45 [this.d]);
}
Direction.prototype.GetRight90 = function ()
{
    return new Direction (Direction.turn_right90 [this.d]);
}
Direction.prototype.GetRight135 = function ()
{
    return new Direction (Direction.turn_right135 [this.d]);
}
Direction.GetRandom = function (n)
{
    return new Direction (Misc.RandomInteger (n));
}
Direction.prototype.toString = function ()
{
    return Direction.names [this.d];
}


Direction.dir4 = [Direction.W, Direction.S, Direction.E, Direction.N, Direction.W];
Direction.dir8 = [Direction.W, Direction.SW, Direction.S, Direction.SE, Direction.E, Direction.NE, Direction.N, Direction.NW, Direction.W];

Direction.CardinalDirection = function (dx, dy)
{
    var t = Math.atan2(dy,dx);

    return Direction.dir4 [2 + Math.round (t * 2 / Math.PI)];
}
Direction.Direction = function (dx, dy)
{
    var t = Math.atan2(dy,dx);

    return Direction.dir8 [4 + Math.round (t * 4 / Math.PI)];
}

Direction.turn_around   = [Direction.S,  Direction.W,  Direction.N,  Direction.E,  Direction.SW, Direction.NW, Direction.NE, Direction.SE];
Direction.turn_left45   = [Direction.NW, Direction.NE, Direction.SE, Direction.SW, Direction.N,  Direction.E,  Direction.S,  Direction.W];
Direction.turn_right45  = [Direction.NE, Direction.SE, Direction.SW, Direction.NW, Direction.E,  Direction.S,  Direction.W,  Direction.N];
Direction.turn_left90   = [Direction.W,  Direction.N,  Direction.E,  Direction.S,  Direction.NW, Direction.NE, Direction.SE, Direction.SW];
Direction.turn_right90  = [Direction.E,  Direction.S,  Direction.W,  Direction.N,  Direction.SE, Direction.SW, Direction.NW, Direction.NE];
Direction.turn_left135  = [Direction.SE, Direction.NW, Direction.NE, Direction.SE, Direction.W,  Direction.N,  Direction.E,  Direction.S];
Direction.turn_right135 = [Direction.SE, Direction.SW, Direction.NW, Direction.NE, Direction.S,  Direction.W,  Direction.N,  Direction.E];

// Map the point-of-view directions, to world directions
// When facing NE, the wall in front of you is maze wall NE (4) and screen wall N (0)
// When facing E, the wall in front of you is maze wall E (1) and screen wall N (0)
// This table maps the maze walls to the screen walls and vice versa

Direction.world_to_pov = new Array (Direction.NUM);
Direction.pov_to_world = new Array (Direction.NUM);

Direction.world_to_pov [Direction.N] = [Direction.N, Direction.E, Direction.S, Direction.W, Direction.NE, Direction.SE, Direction.SW, Direction.NW];
Direction.world_to_pov [Direction.E] = [Direction.W, Direction.N, Direction.E, Direction.S, Direction.NW, Direction.NE, Direction.SE, Direction.SW];
Direction.world_to_pov [Direction.S] = [Direction.S, Direction.W, Direction.N, Direction.E, Direction.SW, Direction.NW, Direction.NE, Direction.SE];
Direction.world_to_pov [Direction.W] = [Direction.E, Direction.S, Direction.W, Direction.N, Direction.SE, Direction.SW, Direction.NW, Direction.NE];

Direction.world_to_pov [Direction.NE] = [Direction.NW, Direction.NE, Direction.SE, Direction.SW, Direction.N, Direction.E, Direction.S, Direction.W];
Direction.world_to_pov [Direction.SE] = [Direction.SW, Direction.NW, Direction.NE, Direction.SE, Direction.W, Direction.N, Direction.E, Direction.S];
Direction.world_to_pov [Direction.SW] = [Direction.SE, Direction.SW, Direction.NW, Direction.NE, Direction.S, Direction.W, Direction.N, Direction.E];
Direction.world_to_pov [Direction.NW] = [Direction.NE, Direction.SE, Direction.SW, Direction.NW, Direction.E, Direction.S, Direction.W, Direction.N];

Direction.pov_to_world [Direction.N] = [Direction.N, Direction.E, Direction.S, Direction.W, Direction.NE, Direction.SE, Direction.SW, Direction.NW];
Direction.pov_to_world [Direction.E] = [Direction.E, Direction.S, Direction.W, Direction.N, Direction.SE, Direction.SW, Direction.NW, Direction.NE];
Direction.pov_to_world [Direction.S] = [Direction.S, Direction.W, Direction.N, Direction.E, Direction.SW, Direction.NW, Direction.NE, Direction.SE];
Direction.pov_to_world [Direction.W] = [Direction.W, Direction.N, Direction.E, Direction.S, Direction.NW, Direction.NE, Direction.SE, Direction.SW];

Direction.pov_to_world [Direction.NE] = [Direction.NE, Direction.SE, Direction.SW, Direction.NW, Direction.E, Direction.S, Direction.W, Direction.N];
Direction.pov_to_world [Direction.SE] = [Direction.SE, Direction.SW, Direction.NW, Direction.NE, Direction.S, Direction.W, Direction.N, Direction.E];
Direction.pov_to_world [Direction.SW] = [Direction.SW, Direction.NW, Direction.NE, Direction.SE, Direction.W, Direction.N, Direction.E, Direction.S];
Direction.pov_to_world [Direction.NW] = [Direction.NW, Direction.NE, Direction.SE, Direction.SW, Direction.N, Direction.E, Direction.S, Direction.W];
