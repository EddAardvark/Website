
//-------------------------------------------------------------------------------------------------
// Implements a number of the form y^3 - 3nx^2 + 3n^2x + n^3, equivalent to (x+n)^3 - x^3
//
// Uses VLIntegers to avoid being confined to small numbers
//
// This is a single contour in the map for X^3 + y^3 - z^3 = 0
//
// (c) John Whitehouse 2021
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------
WalkingResults = function (max)
{
    this.results = new Array (max);

    this.values = {};

    for (var i = 0 ; i < max ; ++i)
    {
        this.results [i] = null;
    }
    this.count = 0;
}
//-------------------------------------------------------------------------------------------------
WalkingResults.Result = function (x, y, z, v)
{
    WalkingResults.VerifySolution (x, y, z, v);
    
    if (v.positive)
    {
        this.flip = false;
        this.v = v.ToInt ();
    }
    else
    {
        this.flip = true;
        this.v = -v.ToInt ();
    }    
    
    this.x = VLInt.FromVLInt (x);
    this.y = VLInt.FromVLInt (y);
    this.z = VLInt.FromVLInt (z);
}
//-------------------------------------------------------------------------------------------------
WalkingResults.Result.prototype.Key = function ()
{
    return Misc.Format ("K{0}_{1}_{2}", this.x, this.y, this.z);
}
//-------------------------------------------------------------------------------------------------
WalkingResults.Result.prototype.SumAsText = function ()
{
    var ret = this.flip
                ? Misc.Format ("{0}^3 - {1}^3 - {2}^3", this.z, this.x, this.y)
                : Misc.Format ("{0}^3 + {1}^3 - {2}^3", this.x, this.y, this.z);
                
    return Misc.expand_expression (ret);
}
//-------------------------------------------------------------------------------------------------
WalkingResults.Result.prototype.toString = function ()
{
    var ret = this.flip
                ? Misc.Format ("{0}^3 - {1}^3 - {2}^3 = {3}", this.z, this.x, this.y, this.v)
                : Misc.Format ("{0}^3 + {1}^3 - {2}^3 = {3}", this.x, this.y, this.z, this.v);
                
    return Misc.expand_expression (ret);
}
//-------------------------------------------------------------------------------------------------
WalkingResults.prototype.Add = function (result)
{
    var key = result.Key ();
    
    this.values [key] = result;
    
    if (this.results [result.v] == null)
    {
        this.results [result.v] = [key];
    }
    else if (this.results[result.v].length == 10)
    {
        this.results[result.v] = this.results[result.v].slice (-9);        
        this.results[result.v].push (key);
    }
    else if (this.results[result.v].indexOf(key) < 0)
    {        
        this.results [result.v].push (key);
    }
    ++ this.count;
}
//--------------------------------------------------------------------------------------------
WalkingResults.VerifySolution = function (x, y, z, v)
{
    var x3 = x.Cube ();
    var y3 = y.Cube ();
    var z3 = z.Cube ();
    
    var value = x3.Add(y3).Subtract(z3);
    
    if (value.toString () != v.toString())
        throw Misc.Format ("{0}^3 + {1}^3 - {2}^3 = {3}, NOT {4}", x, y, z, value, v);
}
//--------------------------------------------------------------------------------------------
WalkingResults.prototype.GetAsTable = function ()
{
    var ret = "<table>";
    
    for (var row in this.results)
    {
        if (this.results[row] != null)
        {
            var first = true;
            
            ret += "<tr>";
            ret += "<td>" + row + "</td>";
            ret += "<td>";
            
            for (var ridx in this.results [row])    
            {
                var k = this.results [row][ridx];
                if (! first ) ret += ", ";
                ret += "(" + this.values [k].SumAsText() + ")";
                first = false;
            }
        }
        ret += "</td>";
        ret += "</tr>";
    }
    
    return ret + "</table>";
}


