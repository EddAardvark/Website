//-------------------------------------------------------------------------------------------------
// Javascript Shape Constants
// (c) John Whitehouse 2015
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
function PolygonConstants (n)
{
    this.order = n;

    this.points = new Array (n);
    this.outer_radius = 1.0;

    var angle = 2 * Math.PI / n;

    for (var i = 0 ; i < n ; ++i)
    {
        var x = Math.cos (i * angle);
        var y = Math.sin (i * angle);

        this.points [i] = [x,y];
    }

    // Find the mid-point of an edge (there's probably an equation that does this but I can't
    // be bothered to work it out.

    var x1 = (this.points [0][0] + this.points [1][0]) / 2;
    var y1 = (this.points [0][1] + this.points [1][1]) / 2;

    this.inner_radius = Math.sqrt (x1 * x1 + y1 * y1);
    
    // The length of an edge
    
    this.edge_len = CoordinateMaths.Distance (this.points [0], this.points [1]);
}
//-------------------------------------------------------------------------------------------------
// Debugging check
//-------------------------------------------------------------------------------------------------
PolygonConstants.prototype.ToText = function ()
{
    return  "Polygon " + this.order + ", radii = " + [this.inner_radius, this.outer_radius];
}
