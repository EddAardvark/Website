//-------------------------------------------------------------------------------------------------
// An item for use in the SculptureGarden
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------


//==============================================================
SculptureGarden.Item = function(n, shape_map, c1, c2)
{
    this.points = new Array(n);
    this.shape_map = shape_map;
    this.colours = new Array(shape_map.length);
    this.animated = false;
    this.id = ++SculptureGarden.Item.counter;
    this.name = "not set";

    for (var i = 0 ; i < this.colours.length ; ++i)
    {
        this.colours [i] = SVGColours.Blend (c1, c2, Math.random ());
    }
}

SculptureGarden.Item.counter = 0;

SculptureGarden.Item.prototype.MakePlanes = function (pts3d, mapped_points)
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
        var shape3d = [];

        for (pidx in point_map)
        {
            var ptidx = point_map[pidx]

            shape3d.push (pts3d [ptidx]);
            temp.points [pidx] = pts2d [ptidx];
        }

        var d2 = SculptureGarden.Item.GetDistanceSquared (shape3d, mapped_points);

        temp.SetDistance (Math.sqrt (d2));
        temp.SetColour(this.colours [idx]);

        ret [idx] = temp;
    }
    return ret;
}
// Distance to the nearest point slightly inside the shape

SculptureGarden.Item.GetDistanceSquared = function (points, mapped_points)
{
// Distance to the centre

    var min_d2 = Number.MAX_SAFE_INTEGER;
    var n = points.length;
    var x = 0;
    var y = 0;
    var z = 0;
    for (var i = 0 ; i < n ; ++i)
    {
        x += points [i][0];
        y += points [i][1];
        z += points [i][2];
    }
    var dx = x/n - mapped_points.x_eye;
    var dy = y/n - mapped_points.y_eye;
    var dz = z/n - mapped_points.z_eye;

    return dx * dx + dy * dy + dz * dz;
}

SculptureGarden.Item.prototype.SetColours = function (c1, c2)
{
}
SculptureGarden.Item.prototype.SetAnimation = function ()
{
    this.animated = true;
}
SculptureGarden.Item.prototype.Animate = function ()
{
}
SculptureGarden.Item.prototype.toString = function()
{
    return Misc.Format ("SG Item: ID = {0}, Name = {1}", this.id, this.name);
}


//---------------------------------------------------------------------------------------------------------
// Angle for use in animations
//---------------------------------------------------------------------------------------------------------

// An angle (using degrees)

SculptureGarden.Item.Angle = function (start, delta)
{
    this.angle = SculptureGarden.Item.Angle.Fix (start);
    this.delta = SculptureGarden.Item.Angle.Fix (delta);
}
SculptureGarden.Item.Angle.Fix = function (a)
{
    return (a >= 0)
                ? Math.floor (a) % 360
                : (- (Math.floor (-a) % 360));
}
SculptureGarden.Item.Angle.prototype.Advance = function ()
{
    this.angle = SculptureGarden.Item.Angle.Fix (this.angle + this.delta);
}
SculptureGarden.Item.Angle.prototype.Cos = function ()
{
    return Math.cos (this.angle * Math.PI / 180);
}
SculptureGarden.Item.Angle.prototype.Sin = function ()
{
    return Math.sin (this.angle * Math.PI / 180);
}
SculptureGarden.Item.Angle.prototype.Degrees = function ()
{
    return this.angle;
}
SculptureGarden.Item.Angle.prototype.Radians = function ()
{
    return this.angle * Math.PI / 180;
}
//---------------------------------------------------------------------------------------------------------
// A spirograph pattern for use in animations
// N1 x Cos (N3 * t) + N2 x Cos (N4 * t)
// N1 x Sin (N3 * t) + N2 x Sin (N4 * t)
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Item.Spirograph = function (radius)
{
    this.angle = new SculptureGarden.Item.Angle (0, 1);
    this.phase1 = Misc.RandomInteger (360) * Math.PI / 180;
    this.phase2 = Misc.RandomInteger (360) * Math.PI / 180;
    this.n1 = Misc.RandomInteger (-13,13);
    this.n2 = Misc.RandomInteger (-13,13);
    this.n3 = Misc.RandomInteger (-13,13);
    this.n4 = Misc.RandomInteger (-13,13);

    var size = Math.abs (this.n1) + Math.abs (this.n2);

    this.factor = radius / Math.max (1, size);
}
SculptureGarden.Item.Spirograph.prototype.GetPosition = function ()
{
    var theta = this.angle.Radians ();
    var theta1 = theta * this.n3 + this.phase1;
    var theta2 = theta * this.n4 + this.phase2;

    var x = (this.n1 * Math.cos (theta1) + this.n2 * Math.cos (theta2)) * this.factor;
    var y = (this.n1 * Math.sin (theta1) + this.n2 * Math.sin (theta2)) * this.factor;
    return [x,y];
}
SculptureGarden.Item.Spirograph.prototype.Advance = function ()
{
    this.angle.Advance ();
}

//---------------------------- Square Pyramid-----------------------------------

SculptureGarden.Item.Pyramid = function (shape, width, hover, height, c1, c2)
{
    SculptureGarden.Item.call (this, 5, SculptureGarden.Item.Pyramid.shape_map, c1, c2);

    this.animode = 0;
    this.bot_angle = new SculptureGarden.Item.Angle (0, Misc.RandomInteger (13) - 6);
    this.top_angle = new SculptureGarden.Item.Angle (0, Misc.RandomInteger (13) - 6);
    this.angle = new SculptureGarden.Item.Angle (Misc.RandomInteger (90), Misc.RandomInteger (13) - 6);
    this.rad_angle = new SculptureGarden.Item.Angle (0, Misc.RandomInteger (13) - 6);
    this.radius = width * OctoPoints.inner_radius [shape];
    this.bottom = hover;
    this.top = hover + height;
    this.vrange = height / 2;

    this.SetPoints ();
}

SculptureGarden.Item.Pyramid.prototype = Object.create(SculptureGarden.Item.prototype);

// Turns the points into shapes
SculptureGarden.Item.Pyramid.shape_map =
[
    [0,1,4], [1,2,4], [2,3,4], [3,0,4], [0,1,2,3]
];

SculptureGarden.Item.Pyramid.ANIMATE_TOP = 1;
SculptureGarden.Item.Pyramid.ANIMATE_BOTTOM = 2;
SculptureGarden.Item.Pyramid.ANIMATE_RADIUS = 4;
SculptureGarden.Item.Pyramid.ANIMATE_ANGLE = 8;
SculptureGarden.Item.Pyramid.ANIMATE_TOTAL = 15;

SculptureGarden.Item.Pyramid.prototype.SetAnimation = function (mode)
{
    this.animode = (mode === undefined) ? Misc.RandomInteger (SculptureGarden.Item.Pyramid.ANIMATE_TOTAL) : mode;
    this.animated = this.animode != 0;
}
SculptureGarden.Item.Pyramid.prototype.SetPoints = function ()
{
    var radius = this.radius * (1 + this.rad_angle.Cos()) / 2;
    var top = this.top - this.vrange * (1 - this.top_angle.Cos()) / 2;
    var bottom = this.bottom + this.vrange * (1 - this.bot_angle.Cos()) / 2;
    var corner = CoordinateMaths.Rotate2D ([0, radius], this.angle.Radians());

    var x = corner[0];
    var y = corner[1];

    this.points [0] = [-x, -y, bottom];
    this.points [1] = [-y, x, bottom];
    this.points [2] = [x, y, bottom];
    this.points [3] = [y, -x, bottom];
    this.points [4] = [0, 0, top];
}

SculptureGarden.Item.Pyramid.prototype.Animate = function ()
{
    if (this.animode & SculptureGarden.Item.Pyramid.ANIMATE_TOP) this.top_angle.Advance ();
    if (this.animode & SculptureGarden.Item.Pyramid.ANIMATE_BOTTOM) this.bot_angle.Advance ();
    if (this.animode & SculptureGarden.Item.Pyramid.ANIMATE_RADIUS) this.rad_angle.Advance ();
    if (this.animode & SculptureGarden.Item.Pyramid.ANIMATE_ANGLE) this.angle.Advance ();

    this.SetPoints ();
}

//---------------------------- Square Bi-Bipyramid-----------------------------------

SculptureGarden.Item.Bipyramid = function (shape, width, hover, height, c1, c2)
{
    SculptureGarden.Item.call (this, 5, SculptureGarden.Item.Bipyramid.shape_map, c1, c2);

    this.animode = 0;
    this.bot_angle = new SculptureGarden.Item.Angle (0, Misc.RandomInteger (13) - 6);
    this.top_angle = new SculptureGarden.Item.Angle (0, Misc.RandomInteger (13) - 6);
    this.top_rad = new SculptureGarden.Item.Angle (0, Misc.RandomInteger (13) - 6);
    this.bot_rad = new SculptureGarden.Item.Angle (0, Misc.RandomInteger (13) - 6);
    this.theta_z1 = new SculptureGarden.Item.Angle (0,Misc.RandomInteger (23) - 11);
    this.theta_z2 = new SculptureGarden.Item.Angle (0,Misc.RandomInteger (23) - 11);
    this.theta_z3 = new SculptureGarden.Item.Angle (0,Misc.RandomInteger (23) - 11);
    this.radius = width * OctoPoints.inner_radius [shape];
    this.bottom = hover;
    this.top = hover + height;
    this.z_min = this.bottom;
    this.z_range = this.top - this.bottom;

    this.SetPoints ();
}

SculptureGarden.Item.Bipyramid.prototype = Object.create(SculptureGarden.Item.prototype);

// Turns the points into shapes
SculptureGarden.Item.Bipyramid.shape_map =
[
    [0,1,4], [1,2,4], [2,3,4], [3,0,4], [0,1,2,3],
    [5,6,4], [6,7,4], [7,8,4], [8,5,4], [5,6,7,8]
];

SculptureGarden.Item.Bipyramid.ANIMATE_HEIGHT = 1;
SculptureGarden.Item.Bipyramid.ANIMATE_TOP_RADIUS = 2;
SculptureGarden.Item.Bipyramid.ANIMATE_TOP_ANGLE = 4;
SculptureGarden.Item.Bipyramid.ANIMATE_BOT_RADIUS = 8;
SculptureGarden.Item.Bipyramid.ANIMATE_BOT_ANGLE = 16;
SculptureGarden.Item.Bipyramid.ANIMATE_TOTAL = 31;

SculptureGarden.Item.Bipyramid.prototype.SetAnimation = function (mode)
{
    this.animode = (mode === undefined) ? Misc.RandomInteger (SculptureGarden.Item.Bipyramid.ANIMATE_TOTAL) : mode;
    this.animated = this.animode != 0;
}
SculptureGarden.Item.Bipyramid.prototype.SetPoints = function ()
{
    var top_radius = this.radius * (1 + this.bot_rad.Cos()) / 2;
    var bot_radius = this.radius * (1 + this.top_rad.Cos()) / 2;
    var heights =
    [
        this.z_min + ((1 - this.theta_z1.Cos())/2) * this.z_range,
        this.z_min + ((1 + this.theta_z2.Sin())/2) * this.z_range,
        this.z_min + ((1 + this.theta_z3.Cos())/2) * this.z_range
    ];

    var top_corner = CoordinateMaths.Rotate2D ([0, top_radius], this.top_angle.Radians());
    var bot_corner = CoordinateMaths.Rotate2D ([0, bot_radius], this.bot_angle.Radians());
    heights.sort(function(a, b){return a - b});

    var xtop = top_corner[0];
    var ytop = top_corner[1];
    var xbot = bot_corner[0];
    var ybot = bot_corner[1];

    this.points [0] = [-xtop, -ytop, heights[2]];
    this.points [1] = [-ytop, xtop, heights[2]];
    this.points [2] = [xtop, ytop, heights[2]];
    this.points [3] = [ytop, -xtop, heights[2]];
    this.points [4] = [0, 0, heights[1]];
    this.points [5] = [-xtop, -ybot, heights[0]];
    this.points [6] = [-ybot, xbot, heights[0]];
    this.points [7] = [xbot, ybot, heights[0]];
    this.points [8] = [ybot, -xbot, heights[0]];
}

SculptureGarden.Item.Bipyramid.prototype.Animate = function ()
{
    if (this.animode & SculptureGarden.Item.Octahedron.ANIMATE_HEIGHT)
    {
        this.theta_z1.Advance ();
        this.theta_z2.Advance ();
        this.theta_z3.Advance ();
    }
    if (this.animode & SculptureGarden.Item.Bipyramid.ANIMATE_TOP_RADIUS) this.top_rad.Advance ();
    if (this.animode & SculptureGarden.Item.Bipyramid.ANIMATE_TOP_ANGLE) this.top_angle.Advance ();
    if (this.animode & SculptureGarden.Item.Bipyramid.ANIMATE_BOT_RADIUS) this.bot_rad.Advance ();
    if (this.animode & SculptureGarden.Item.Bipyramid.ANIMATE_BOT_ANGLE) this.bot_angle.Advance ();

    this.SetPoints ();
}
//---------------------------- Octahedron -----------------------------------
SculptureGarden.Item.Octahedron = function (shape, z_min, z_max, c1, c2)
{
    SculptureGarden.Item.call (this, 5, SculptureGarden.Item.Octahedron.shape_map, c1, c2);

    var radius = OctoPoints.inner_radius [shape] * (0.3 + Math.random () * 0.7);

    this.angle = new SculptureGarden.Item.Angle (Misc.RandomInteger (90), 0);
    this.theta_z1 = new SculptureGarden.Item.Angle (0,Misc.RandomInteger (23) - 11);
    this.theta_z2 = new SculptureGarden.Item.Angle (0,Misc.RandomInteger (23) - 11);
    this.theta_z3 = new SculptureGarden.Item.Angle (0,Misc.RandomInteger (23) - 11);
    this.rad_angle = new SculptureGarden.Item.Angle (0,Misc.RandomInteger (23) - 11);
    this.x_min = 0.3 * Math.random() * radius;
    this.x_max = (0.3 + 0.7 * Math.random()) * radius;
    this.x_range = this.x_max - this.x_min;
    this.z_min = z_min;
    this.z_range = z_max - z_min;

    this.SetPoints ();
}

SculptureGarden.Item.Octahedron.prototype = Object.create(SculptureGarden.Item.prototype);
SculptureGarden.Item.Octahedron.ANIMATE_HEIGHT = 1;
SculptureGarden.Item.Octahedron.ANIMATE_RADIUS = 2;
SculptureGarden.Item.Octahedron.ANIMATE_ANGLE = 4;
SculptureGarden.Item.Octahedron.ANIMATE_TOTAL = 7;

SculptureGarden.Item.Octahedron.prototype.SetPoints = function ()
{
    var heights =
    [
        this.z_min + ((1 - this.theta_z1.Cos())/2) * this.z_range,
        this.z_min + ((1 + this.theta_z2.Sin())/2) * this.z_range,
        this.z_min + ((1 + this.theta_z3.Cos())/2) * this.z_range
    ];

    var radius = this.x_min + this.x_range * (1 + this.rad_angle.Cos()) / 2;
    var corner = CoordinateMaths.Rotate2D ([0, radius], this.angle.Radians());

    heights.sort(function(a, b){return a - b});

    var x = corner[0];
    var y = corner[1];

    this.points [0] = [-x, -y, heights[1]];
    this.points [1] = [-y, x, heights[1]];
    this.points [2] = [x, y, heights[1]];
    this.points [3] = [y, -x, heights[1]];
    this.points [4] = [0, 0, heights[2]];
    this.points [5] = [0, 0, heights[0]];
}

SculptureGarden.Item.Octahedron.prototype.SetAnimation = function (mode)
{
    this.animode = (mode === undefined) ? Misc.RandomInteger (SculptureGarden.Item.Octahedron.ANIMATE_TOTAL) : mode;
    this.animated = this.animode != 0;
}

// Animates the Octahedron within the bounds of the original shape

SculptureGarden.Item.Octahedron.prototype.Animate = function ()
{
    if (this.animode & SculptureGarden.Item.Octahedron.ANIMATE_HEIGHT)
    {
        this.theta_z1.Advance ();
        this.theta_z2.Advance ();
        this.theta_z3.Advance ();
    }
    if (this.animode & SculptureGarden.Item.Octahedron.ANIMATE_RADIUS) this.rad_angle.Advance ();
    if (this.animode & SculptureGarden.Item.Octahedron.ANIMATE_ANGLE) this.angle.Advance ();

    this.SetPoints ();
}

// Turns the points into shapes
SculptureGarden.Item.Octahedron.shape_map =
[
    [0,1,4], [1,2,4], [2,3,4], [3,0,4], [0,1,5], [1,2,5], [2,3,5], [3,0,5],
];

//---------------------------- StackOfSquares -----------------------------------
//
SculptureGarden.Item.StackOfSquares = function (shape, bottom, top, num, c1, c2)
{
	this.num = Math.min (Math.max (num, SculptureGarden.Item.StackOfSquares.Min), SculptureGarden.Item.StackOfSquares.Max);
	shape_map = new Array (this.num);
	
	for (var i = 0 ; i < this.num ; ++i)
	{
		shape_map [i] = [4*i, 4*i+1, 4*i+2, 4*i+3];
	}

    SculptureGarden.Item.call (this, 4 * this.num, shape_map, c1, c2);

    var radius = OctoPoints.inner_radius [shape];

    this.heights = [];
    this.tracks = [];
    this.points = new Array (4 * num);

    var h = bottom;
    var delta = (top - bottom) / Math.max (1, this.num-1);

    for (var i = 0 ; i < this.num ; ++i)
    {
        this.heights.push (h);
        this.tracks.push (new SculptureGarden.Item.Spirograph (0.45 * radius));

        h += delta;
    }
    this.SetPoints ();
}

SculptureGarden.Item.StackOfSquares.prototype = Object.create(SculptureGarden.Item.prototype);

SculptureGarden.Item.StackOfSquares.ANIMATE_TOTAL = 1;

SculptureGarden.Item.StackOfSquares.prototype.SetPoints = function ()
{
    var pos = 0;

    for (var i = 0 ; i < this.num ; ++i)
    {
        var corner = this.tracks [i].GetPosition ();

        this.points [pos+0] = [corner[0], corner[1], this.heights[i]];
        this.points [pos+1] = [- corner[1], corner[0], this.heights[i]];
        this.points [pos+2] = [- corner[0], - corner[1], this.heights[i]];
        this.points [pos+3] = [corner[1], - corner[0], this.heights[i]];

        pos += 4;
    }
}

SculptureGarden.Item.StackOfSquares.prototype.SetAnimation = function (mode)
{
    this.animated = mode ? true : false;
}

// Animates the octagon within the bounds of the original shape

SculptureGarden.Item.StackOfSquares.prototype.Animate = function ()
{
    for (var i = 0 ; i < this.num ; ++i)
    {
        this.tracks [i].Advance ();
    }

    this.SetPoints ();
}

SculptureGarden.Item.StackOfSquares.RandomStack = function () { return Misc.RandomInteger (SculptureGarden.Item.StackOfSquares.Min, SculptureGarden.Item.StackOfSquares.Max); }

SculptureGarden.Item.StackOfSquares.Max = 16;
SculptureGarden.Item.StackOfSquares.Min = 2;

//---------------------------- Stack of 4 blocks -----------------------------------

SculptureGarden.Item.StackOfBlocks = function (shape, widths, heights, num, c1, c2)
{
	this.planes = num+1;
	shape_map = [];


	for (var i = 0 ; i < this.planes ; ++i)
	{
		shape_map.push ([4*i, 4*i+1, 4*i+2, 4*i+3]);
	}
	for (var i = 0 ; i < num ; ++i)
	{
		var p1 = shape_map [i];
		var p2 = shape_map [i+1];
		shape_map.push ([p1[0], p1[1], p2[1], p2[0]]);
		shape_map.push ([p1[1], p1[2], p2[2], p2[1]]);
		shape_map.push ([p1[2], p1[3], p2[3], p2[2]]);
		shape_map.push ([p1[3], p1[0], p2[0], p2[3]]);
	}


    SculptureGarden.Item.call (this, 4 * this.planes, shape_map, c1, c2);

    this.radius = OctoPoints.inner_radius [shape];
    this.angle = Math.random () * Math.PI / 2;
    this.widths = [].concat (widths);
    this.heights = [].concat (heights);

    var heights = [].concat (this.heights);
    heights.sort(function(a, b){return b - a});

    for (var i = 0 ; i < this.planes ; ++i)
    {
        var x = this.radius * widths [i] * Math.cos (this.angle);
        var y = this.radius * widths [i] * Math.sin (this.angle);
        var pos = 4 * i;

        this.points [pos + 0] = [-x, -y, heights[i]];
        this.points [pos + 1] = [-y, x, heights[i]];
        this.points [pos + 2] = [x, y, heights[i]];
        this.points [pos + 3] = [y, -x, heights[i]];
    }
    this.top = Math.max (...heights);
    this.bottom = Math.min (...heights);
}

SculptureGarden.Item.StackOfBlocks.prototype = Object.create(SculptureGarden.Item.prototype);

SculptureGarden.Item.StackOfBlocks.ANIMATE_ROTATE = 1;
SculptureGarden.Item.StackOfBlocks.ANIMATE_WIDTH = 2;
SculptureGarden.Item.StackOfBlocks.ANIMATE_HEIGHT = 4;
SculptureGarden.Item.StackOfBlocks.ANIMATE_TOTAL = 7;

// turn on animation

SculptureGarden.Item.StackOfBlocks.prototype.SetAnimation = function (mode)
{
    this.theta  = new Array(this.planes);
    this.delta_theta  = new Array(this.planes);
    this.deltah = new Array(5);
    this.delta_angle = Misc.RandomInteger (-11,11) * Math.PI / 180;

    for (var i = 0 ; i < this.planes ; ++i)
    {
        this.theta [i] = 0;
        this.delta_theta [i] = Misc.RandomInteger (-11,11) * Math.PI / 1800;
        this.deltah [i] = Misc.RandomInteger (-11,11) * (this.top - this.bottom) / 330;
    }

    this.animated = true;
    this.animation_mode = mode;
}
// Animates the stack within the bounds of the original shape

SculptureGarden.Item.StackOfBlocks.prototype.Animate = function ()
{
    if (this.animation_mode & SculptureGarden.Item.StackOfBlocks.ANIMATE_HEIGHT)
    {
        for (var i = 0 ; i < this.planes ; ++i)
        {
            var h = this.heights [i] + this.deltah [i];

            if (h > this.top || h < this.bottom)
            {
                this.deltah [i] = - this.deltah [i];
                h = this.heights [i] + this.deltah [i];
            }

            this.heights [i] = h;
        }
    }

    var heights = [].concat (this.heights);
    var widths = [].concat (this.widths);

    heights.sort(function(a, b){return b - a});

    if (this.animation_mode & SculptureGarden.Item.StackOfBlocks.ANIMATE_WIDTH)
    {
        for (var i = 0 ; i < this.planes ; ++i)
        {
            widths [i] *= Math.abs (Math.cos(this.theta [i]));
            this.theta [i] += this.delta_theta [i];
        }
    }

    if (this.animation_mode & SculptureGarden.Item.StackOfBlocks.ANIMATE_ROTATE)
    {
        this.angle += this.delta_angle;
    }

    for (var i = 0 ; i < this.planes ; ++i)
    {
        var corner = CoordinateMaths.Rotate2D ([0, this.radius * widths[i]], this.angle);

        var pos = 4 * i;

        this.points [pos + 0] = [-corner[0], -corner[1], heights[i]];
        this.points [pos + 1] = [-corner[1], corner[0], heights[i]];
        this.points [pos + 2] = [corner[0], corner[1], heights[i]];
        this.points [pos + 3] = [corner[1], -corner[0], heights[i]];

        this.theta [i] += this.delta_theta [i];
    }
}

SculptureGarden.Item.StackOfBlocks.RandomStack = function () { return Misc.RandomInteger (SculptureGarden.Item.StackOfBlocks.Min, SculptureGarden.Item.StackOfBlocks.Max); }

SculptureGarden.Item.StackOfBlocks.Max = 6;
SculptureGarden.Item.StackOfBlocks.Min = 1;




