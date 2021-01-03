//-------------------------------------------------------------------------------------------------
// Creates a column for use in the 3D maze
// (c) John Whitehouse 2013
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

var C1 = [0.7,  0.8,  0.9,  1.0];
var C2 = [0.6,  0.7,  0.8,  1.0];

function add3 (p1, p2)
{
    return [p1[0] + p2[0], p1[1] + p2[1], p1[2] + p2[2]];
}
//-------------------------------------------------------------------------------------------------
// The column fits inside a 1 x 1 x 1 cube.
// You can choose the number of points on a side and the radius of the central column.
// This is rendered as an array of quadrilaterals, each having 4 points, each point having
// 3 co-ordinates (x,y,z).
//
// per_side - the number of points along a side (only count 1 corner)
// A list of (height, radius values)
//-------------------------------------------------------------------------------------------------
function Column3D (draw_floor, per_side, column_points)
{
    // Create the basic square

    var num_points = 4 * per_side;
    var dl = 1 / per_side;
    var offset = 0;
    var num_circles = draw_floor ? column_points.length + 2 : column_points.length;

    this.circles = new Array (num_circles);
    this.per_side = per_side;

    // Top and bottom (these circles are square)

    if (draw_floor)
    {
        var n = num_circles + 1;

        this.circles [0] = new Array (num_points);
        this.circles [n] = new Array (num_points);

        for (var i = 0 ; i < per_side ; ++i)
        {
            this.circles [0][i] = [0, 0, offset];
            this.circles [0][i+per_side] = [offset, 0, 1];
            this.circles [0][i+2*per_side] = [1, 0, 1-offset];
            this.circles [0][i+3*per_side] = [1-offset, 0, 0];

            this.circles [n][i] = [0, 1, offset];
            this.circles [n][i+per_side] = [offset, 1, 1];
            this.circles [n][i+2*per_side] = [1, 1, 1-offset];
            this.circles [n][i+3*per_side] = [1-offset, 1, 0];

            offset += dl;
        }
    }

    // Real circles: points run anti-clockwise starting at 225 degrees (5.PI/4).

    var theta = 5 * Math.PI / 4;
    var dt = 2 * Math.PI / num_points;
    var cidx = (draw_floor) ? 1 : 0;

    for (var n = 0 ; n < column_points.length ; ++n)
    {
        this.circles [cidx] = new Array (num_points);
        var z = column_points [n][0];
        var radius = column_points [n][1];

        for (var i = 0 ; i < num_points ; ++i)
        {
            var x = Math.cos (theta);
            var y = Math.sin (theta);
            this.circles [cidx][i] = [0.5 + radius * x, z, 0.5 + radius * y];
            theta -= dt;
        }

        ++ cidx;
    }
    //-------------------------------------------------------------------------------------------------
    // Create a buffer set for a column at (x,y)
    //-------------------------------------------------------------------------------------------------
    Column3D.prototype.CreateBufferSet = function (x, y, texture_id)
    {
        var ret = new BufferSet (texture_id);
        var num_points = 4 * this.per_side;
        var num_circles = this.circles.length;
        var offset = [x, 0, y];

        for (var i = 0 ; i < num_points ; ++i)
        {
            var j = (i+1) % num_points;
            for (n = 0 ; n < num_circles - 1; ++n)
            {
                var toggle = (i+n) % 2 == 0;
                var p1 = add3 (this.circles [n][i], offset);
                var p2 = add3 (this.circles [n][j], offset);
                var p3 = add3 (this.circles [n+1][j], offset);
                var p4 = add3 (this.circles [n+1][i], offset);

                ret.AddQuadrilateral ([p1, p2, p3, p4], toggle ? C1 : C2);
                ret.AddTextureCoords (29);
            }
        }
        return ret;
    }
}
