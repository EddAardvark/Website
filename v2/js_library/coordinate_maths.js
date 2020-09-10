//-------------------------------------------------------------------------------------------------
// Javascript Co-ordinate maths
// (c) John Whitehouse 2018-2019
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

CoordinateMaths = function()
{

}
// Implements a coordinate system inside an arbitrary quadrilateral

CoordinateMaths.MapToQuadrilateral = function (x, y, shape, order)
{
    if (! order)
    {
        // shape is (Bottom-Left, Top-Left, Top-Right, Bottom-Right)

        var p1 = CoordinateMaths.PointOnLine (shape [0], shape [1], y);
        var p2 = CoordinateMaths.PointOnLine (shape [3], shape [2], y);
    }
    else
    {
        // shape is defined by the point order

        var p1 = CoordinateMaths.PointOnLine (shape [order[0]], shape [order[1]], y);
        var p2 = CoordinateMaths.PointOnLine (shape [order[3]], shape [order[2]], y);
    }

    return CoordinateMaths.PointOnLine (p1, p2, x);
}

// 't' determins the location of a point on a line joining two points, t=0 => p1, t=1 => p2,
// values 0-1 are on the line, <0 and >1 extend it.

CoordinateMaths.PointOnLine = function (p1, p2, t)
{
    return ([p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])]);
}

// ================================================================================================
// A line that passes through 2 points, p1 and p2 (ax + by + c = 0)
// ================================================================================================

CoordinateMaths.Line = function (p1, p2)
{
	this.x0 = p1 [0];
	this.y0 = p1 [1];
	this.dx = p2 [0] - this.x0;
	this.dy = p2 [1] - this.y0;
	this.a = -this.dy;
	this.b = this.dx;
	this.c = - (p1[0] * this.a + p1[1] * this.b);
}
CoordinateMaths.Line.prototype.GetPosition = function (t)
{
	return [this.x0 + t * this.dx, this.y0 + t * this.dy];
}
// Is 'p' on the line
CoordinateMaths.Line.prototype.OnLine = function (p)
{
	return this.a * p[0] + this.b * p[1] + this.c == 0;
}
// Is 'p' on the left when looking from p1 to p2
CoordinateMaths.Line.prototype.OnLeft = function (p)
{
	return this.a * p[0] + this.b * p[1] + this.c > 0;
}
// Is 'p' on the right when looking from p1 to p2
CoordinateMaths.Line.prototype.OnRight = function (p)
{
	return this.a * p[0] + this.b * p[1] + this.c < 0;
}
CoordinateMaths.Line.prototype.Length = function ()
{
	return Math.sqrt (this.dx * this.dx + this.dy * this.dy);
}
//---------------------------------------------------------------------------------------------------------
CoordinateMaths.Line.prototype.toString = function()
{
    return Misc.Format ("Line: {0}x = {1}y + {2} = 0", this.a, this.b, this.c);
}
//-------------------------------------------------------------------------------------------------
// Returns true if two lines intersect, false if they don't. Only considers
// the actual segments, not the extensions.
// p1 etc are [x,y] pairs, lines are p1,p2 and p3,p4.
//
// uses the equations from Shape.Intersection
//-------------------------------------------------------------------------------------------------//
CoordinateMaths.Line.Intersect = function(p1, p2, p3, p4)
{
    var x21 = p2 [0] - p1 [0];
    var y21 = p2 [1] - p1 [1];
    var x31 = p3 [0] - p1 [0];
    var y31 = p3 [1] - p1 [1];
    var x43 = p4 [0] - p3 [0];
    var y43 = p4 [1] - p3 [1];

    var det = y21 * x43 - x21 * y43;

    // Parallel

    if (det == 0)
    {
        return false;
    }

    t = (y31 * x43 - x31 * y43) / det;
    s = (x21 * y31 - y21 * x31) / det;

    return (s > 0 && t > 0 && s < 1 && t < 1);
}
//-------------------------------------------------------------------------------------------------
// Expresses the point p3 in multiples of the vectors parallel and perpendicular to the line
// p1->p2.
//-------------------------------------------------------------------------------------------------//
CoordinateMaths.Line.ParameterisePoint = function(p1, p2, p3)
{
    var x21 = p2 [0] - p1 [0];
    var y21 = p2 [1] - p1 [1];
    var x31 = p3 [0] - p1 [0];
    var y31 = p3 [1] - p1 [1];
    
    var l2 = x21 * x21 + y21 * y21;
    
    // Co-incident points

    if (l2 == 0)
    {
        return null;
    }

    t = (x31 * x21 + y21 * y31) / l2;
    s = (x21 * y31 - y21 * x31) / l2;

    return [t,s];
}
//-------------------------------------------------------------------------------------------------
// Expresses the nearest point on a circle to the line using parameters.
// Returns null if the line intersects the circle (touching is ok).
// Expects "rad" to be positive.
//-------------------------------------------------------------------------------------------------//
CoordinateMaths.Line.ParameteriseCircle = function(p1, p2, centre, rad)
{
    var ts = CoordinateMaths.Line.ParameterisePoint (p1, p2, centre);
    
    if (ts [1] >= rad)
    {
        ts [1] -= rad;
    }
    else if (ts [1] <= -rad)
    {
        ts [1] += rad;
    }
    else
    {
        return null;
    }
    return ts;
}
//-------------------------------------------------------------------------------------------------
// The 'S' parameter from ParameterisePoint
//-------------------------------------------------------------------------------------------------//
CoordinateMaths.Line.SParameter = function(p1, p2, p3)
{
    var x21 = p2 [0] - p1 [0];
    var y21 = p2 [1] - p1 [1];
    var x31 = p3 [0] - p1 [0];
    var y31 = p3 [1] - p1 [1];
    
    var l2 = x21 * x21 + y21 * y21;
    
    // Co-incident points

    if (l2 == 0)
    {
        return null;
    }

    return (x21 * y31 - y21 * x31) / l2;
}

//-------------------------------------------------------------------------------------------------
// The 'T' parameter from ParameterisePoint
//-------------------------------------------------------------------------------------------------//
CoordinateMaths.Line.TParameter = function(p1, p2, p3)
{
    var x21 = p2 [0] - p1 [0];
    var y21 = p2 [1] - p1 [1];
    var x31 = p3 [0] - p1 [0];
    var y31 = p3 [1] - p1 [1];
    
    var l2 = x21 * x21 + y21 * y21;
    
    // Co-incident points

    if (l2 == 0)
    {
        return null;
    }

    return (x31 * x21 + y21 * y31) / l2;
}

//-------------------------------------------------------------------------------------------------
// On which side of a line is a point. p1 -> p2 is a line. point is a point. This function
// returns true for on the right, false for on the left (in right-handed co-ordinates).
// if A is the vector p1->p2 and B is the orthogonal vector, then the point P can be represented
// by P = P1 + sA + tB. To decide which side of the line P is on we only need to calculate the
// sign of 't'.
//
// t = ((y2-y1)(x-x1) - (x2-x1)(y-y1)) / |P|^2
//
// |P| squared is always positive unless P1 and P2 are the same point so we can ignore it
//-------------------------------------------------------------------------------------------------
CoordinateMaths.LineSide = function(p1, p2, p3)
{
    var x21 = p2 [0] - p1 [0];
    var y21 = p2 [1] - p1 [1];
    var x31 = p3 [0] - p1 [0];
    var y31 = p3 [1] - p1 [1];

    return (y21 * x31 - x21 * y31) >= 0;
}

//-------------------------------------------------------------------------------------------------
// Expresses the point p3 in multiples of the vectors parallel and perpendicular to the line
// p1->p2.
//-------------------------------------------------------------------------------------------------//
CoordinateMaths.Line.FromParameters = function(p1, p2, s, t)
{
    var x21 = p2 [0] - p1 [0];
    var y21 = p2 [1] - p1 [1];
    
    var x = p1[0] + t * x21 - s * y21;
    var x = p1[1] + t * y21 + s * x21;
    
    // Co-incident points

    if (det == 0)
    {
        return null;
    }

    t = (x31 * x21 + y21 * y31) / l2;
    s = (x21 * y31 - y21 * x31) / l2;

    return [t,s];
}

// --------------------- L I N E   T E S T S --------------------------------

CoordinateMaths.Line.Tests = function ()
{
	var p1 = [2,3];
	var p2 = [5,7];
	var on_left = [3,12];
	var on_right = [3,-12];
	var on_line = [8,11];
	
	var line = new CoordinateMaths.Line (p1, p2);
	
	if (! line.OnLine (p1)) alert ("Point (" + p1 + ") is on line failed!");
	if (! line.OnLine (p2)) alert ("Point (" + p2 + ") is on line failed!");
	if (! line.OnLine (on_line)) alert ("Point (" + on_line + ") is on line failed!");
	if (line.OnLine (on_left)) alert ("Point (" + on_left + ") is not on line failed!");
	if (line.OnLine (on_right)) alert ("Point (" + on_right + ") is not on line failed!");

	if (! line.OnLeft (on_left)) alert ("Point (" + on_left + ") is on the left failed!");
	if (line.OnRight (on_left)) alert ("Point (" + on_left + ") is on the left failed!");

	if (line.OnLeft (on_right)) alert ("Point (" + on_right + ") is on the left failed!");
	if (! line.OnRight (on_right)) alert ("Point (" + on_right + ") is on the left failed!");
	
	var pos = line.GetPosition (3);
	if (pos[0] != 11 || pos[1] != 15) alert ("Get position (3) failed");	
	if (! line.OnLine (pos)) alert ("Point (" + pos + ") is on line failed!");
    
    var params = CoordinateMaths.Line.ParameterisePoint ([3,1],[4,1],[3.7,1.4]);
    
    if (Misc.FloatToText (params[0],1) != "0.7" || Misc.FloatToText (params[1],1) != "0.4")
        alert ("ParameterisePoint: got [" + params + "}, expected [0.7,0.4], failed!");   

    var params = CoordinateMaths.Line.ParameterisePoint ([4,5],[5,6],[3.9,6.3]);
    
    if (Misc.FloatToText (params[0],1) != "0.6" || Misc.FloatToText (params[1],1) != "0.7")
        alert ("ParameterisePoint: got [" + params + "}, expected [-0.1,1.3], failed!"); 
}




// ================================================================================================
// A plane that passes through 3 points, p1 and p2 (ax + by + cz + d = 0)
// The plane is defined by an origin (x0,y0,z0)  and two vectors (Ax,ay,Az) and (Bx,By,Bz).
// (Nx,Ny,Nz) is the normal vector.
// ================================================================================================

CoordinateMaths.Plane = function (p1, p2, p3)
{
	this.x0 = p1 [0];
	this.y0 = p1 [1];
	this.z0 = p1 [2];
	this.ax = p2 [0] - this.x0;
	this.ay = p2 [1] - this.y0;
	this.az = p2 [2] - this.z0;
	this.bx = p3 [0] - this.x0;
	this.by = p3 [1] - this.y0;
	this.bz = p3 [2] - this.z0;
	this.a = this.ay * this.bz - this.by * this.az;
	this.b = this.bx * this.az - this.ax * this.bz;
	this.c = this.ax * this.by - this.bx * this.ay;
	this.d = - (p1[0] * this.a + p1[1] * this.b + p1[2] * this.c);
}
CoordinateMaths.Plane.prototype.GetPosition = function (s, t)
{
	return [this.x0 + s * this.ax + t * this.bx,
			this.y0 + s * this.ay + t * this.by,
			this.z0 + s * this.az + t * this.bz];
}
// Is 'p' on the line
CoordinateMaths.Plane.prototype.OnPlane = function (p)
{
	return this.a * p[0] + this.b * p[1] + this.c * p[2] + this.d == 0;
}
// Is 'p' on the left when looking from p1 to p2
CoordinateMaths.Plane.prototype.Above = function (p)
{
	return this.a * p[0] + this.b * p[1] + this.c * p[2] + this.d > 0;
}
// Is 'p' on the right when looking from p1 to p2
CoordinateMaths.Plane.prototype.Below = function (p)
{
	return this.a * p[0] + this.b * p[1] + this.c * p[2] + this.d < 0;
}
//---------------------------------------------------------------------------------------------------------
CoordinateMaths.Plane.prototype.toString = function()
{
    return Misc.Format ("Plane: {0}x = {1}y + {2}y + {3} = 0", this.a, this.b, this.c);
}
CoordinateMaths.Plane.Tests = function ()
{
	var p1 = [2,3,1];
	var p2 = [5,7,1];
	var p3 = [5,7,5];
	
	var plane = new CoordinateMaths.Plane (p1, p2, p3);
	
	var p4 = plane.GetPosition (4,-3);
	
	if (! plane.OnPlane (p1)) alert ("Point (" + p1 + ") is on plane failed!");
	if (! plane.OnPlane (p2)) alert ("Point (" + p2 + ") is on plane failed!");
	if (! plane.OnPlane (p3)) alert ("Point (" + p3 + ") is on plane failed!");
	if (! plane.OnPlane (p4)) alert ("Point (" + p4 + ") is on plane failed!");
}

CoordinateMaths.Plane.Tests ();
// ================================================================================================
// A shape on a plane
// We accept any set of co-ordinates, use three to define the plane and then force the remainder
// onto the plane
// ================================================================================================

CoordinateMaths.ShapeOnPlane =  function (points)
{
	if (points.length < 3)
		throw "CoordinateMaths.ShapeOnPlane: At least 3 points required";
}



// ================================================================================================
// Bounding rectangle of a polygon
// ================================================================================================

CoordinateMaths.PolygonExtent = function (polygon)
{
    var xcoords = polygon.map (p => p[0]);
    var ycoords = polygon.map (p => p[1]);
    return { "xmin": Math.min (...xcoords), "ymin": Math.min (...ycoords), "xmax": Math.max (...xcoords), "ymax": Math.max (...ycoords)};
}

// Construct a regular polygon

CoordinateMaths.MakePolygon = function (origin, radius, sides)
{
    var ret = new Array (sides);
    var theta = 2 * Math.PI / sides;

    for (var i = 0 ; i < sides ; ++i)
    {
        ret [i] = [origin [0] + radius * Math.cos (i * theta), origin [1] + radius * Math.sin (i * theta)];
    }
    return ret;
}

// Construct a star polygon

CoordinateMaths.MakeStarPolygon = function (origin, radius, sides, star)
{
    var ret = new Array (sides);
    var theta = 2 * Math.PI / sides;

    for (var i = 0 ; i < sides ; ++i)
    {
        ret [i] = [origin [0] + radius * Math.cos (i * star * theta), origin [1] + radius * Math.sin (i * star * theta)];
    }
    return ret;
}
// A point on a circle, origin at (0,0)
CoordinateMaths.PointOnCircle2D = function (radius, angle)
{
    return [radius * Math.cos (angle), radius * Math.sin (angle)];
}
// Rotate a point around (0,0)
CoordinateMaths.Rotate2D = function (point, angle)
{
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    return [point[0] * c + point[1] * s, point[1] * c - point[0] * s];
}
// ================================================================================================
// E X T R A S
// ================================================================================================

CoordinateMaths.Distance = function (p1, p2)
{
    var dx = p2[0] - p1[0];
    var dy = p2[1] - p1[1];
	return Math.sqrt (dx * dx + dy * dy);
}



