
//-------------------------------------------------------------------------------------------------
// Calculates the coverage of the interval between 0 and 1 by fractional approximations
// to roots of x^3 + Y^3 - Z^3 = 0
//
// (c) John Whitehouse 2019
// www.eddaardvark.co.uk
//
// A fraction A/B covers the interval A/B - 1/2B^3 to A/B + 1/2B^3 
//-------------------------------------------------------------------------------------------------

FractionalCoverage = function ()
{
}
FractionalCoverage.Initialise = function (depth_element)
{
    depth_element.value = 5;
}
FractionalCoverage.DrawFullTable = function (depth_element, table_element)
{
    var n = parseInt (inter_depth.value);
    n = Math.max (Math.min (n, 100), 2);
    
    depth_element.value = n;
    
    FractionalCoverage.MakeFullTable (n, table_element);
}
FractionalCoverage.DrawReducedTable = function (depth_element, table_element)
{
    var n = parseInt (inter_depth.value);
    n = Math.max (Math.min (n, 100), 2);
    
    depth_element.value = n;
    
    FractionalCoverage.MakeReducedTable (n, table_element);
}
//--------------------------------------------------------------------------------------------
FractionalCoverage.MakeFullTable = function (n, table_element)
{
    var text = "<table border=\"1\">";
    var overall = 0;
    
    text += "<tr><th>Depth</td><th>Intervals</td><th>Coverage</td></tr>";
    
    for (var i = 2 ; i <= n ; ++i)
    {
        var total = 0;
        text += Misc.Format ("<tr><td>{0}</td><td>", i);
        
        for (var j = 1 ; j <= i-1 ; ++j)
        {
            var mid = j / i;
            var delta = 0.5 / (i * i * i);
            
            if (j > 1) text += ", ";

            text += Misc.Format ("{0}&minus;{1}", (mid-delta).toFixed(6), (mid+delta).toFixed(6));
            total += 2 * delta;
        }
        overall += total;
        text += Misc.Format ("</td><td>{0}</td></tr>", total.toFixed(6));
    }    
    
    text += Misc.Format ("<tr><th colspan=\"2\" style=\"text-align:left;\">Overall total</th><td>{0}</td></tr></table>", overall.toFixed(6));
    
    table_element.innerHTML = text;
}
//--------------------------------------------------------------------------------------------
FractionalCoverage.MakeReducedTable = function (n, table_element)
{
    var text = "<table border=\"1\">";
    var overall = 0;
    
    text += "<tr><th>Depth</td><th>Intervals</td><th>Coverage</td></tr>";

    for (var i = 2 ; i <= n ; ++i)
    {
        var total = 0;

        text += Misc.Format ("<tr><td>{0}</td><td>", i);
        
        for (var j = 1 ; j <= i-1 ; ++j)
        {
            if (FractionalCoverage.hcf (i,j) == 1)
            {
                var mid = j / i;
                var delta = 0.5 / (i * i * i);
            
                if (j > 1) text += ", ";

                text += Misc.Format ("{0}&minus;{1}", (mid-delta).toFixed(6), (mid+delta).toFixed(6));
                total += 2 * delta;
            }
        }
        overall += total;
        text += Misc.Format ("</td><td>{0}</td></tr>", total.toFixed(6));
    }    
    
    text += Misc.Format ("<tr><th colspan=\"2\" style=\"text-align:left;\">Overall total</th><td>{0}</td></tr></table>", overall.toFixed(6));
    
    table_element.innerHTML = text;
}
//--------------------------------------------------------------------------------------------
FractionalCoverage.DrawOverlaps = function (inter_depth, overlap_map, w, h)
{
    var chelp = new CanvasHelp (w, h);
    var n = parseInt (inter_depth.value);
    n = Math.max (Math.min (n, 100), 2);
    inter_depth.value = n;
    
    var dh = h / n;
    
    chelp.SetBackground ("Black");
    chelp.SetForeground ("White");
    chelp.SetLineWidth (1);

    chelp.DrawFilledRect (0, 0, w, h);
    
    var yb = (n - 1) * dh;

    for (var i = 2 ; i <= n ; ++i)
    {
        for (var j = 1 ; j <= i-1 ; ++j)
        {
            var y0 = (i - 2) * dh;
            
            var include = FractionalCoverage.hcf (i,j) == 1;

            chelp.SetBackground (include ? "Yellow" : "OrangeRed");
            
            var mid = j / i;
            var range = 1 / (i * i * i);

            var x0 = (mid-range/2) * w;
            var width = range * w;

            chelp.FillRect (x0, y0, width, dh);
            
            if (include)
            {
                chelp.SetBackground ("Cyan");
                chelp.FillRect (x0, yb, width, dh);
            }
        }
    }    
    
    chelp.DrawLine ([0,yb], [w,yb]);
    
    overlap_map.src = chelp.canvas.toDataURL('image/png');
}
//-------------------------------------------------------------------------------------------------
// Get the highest common factor
//-------------------------------------------------------------------------------------------------
FractionalCoverage.hcf = function (x, y)
{
    x = Math.round (Math.abs(x));
    y = Math.round (Math.abs(y));

    if (x == 0 || y == 0) return 1;

    return FractionalCoverage.hcf2 (x, y)
}
FractionalCoverage.hcf2 = function (x, y)
{
    if (x == 1 || y == 1) return 1;
    if (x == y) return x;

    return (x > y) ? FractionalCoverage.hcf2 (x-y,x) : FractionalCoverage.hcf2 (x,y-x);
}
