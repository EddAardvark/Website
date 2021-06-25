
//-------------------------------------------------------------------------------------------------
// Implements a walker on the surface (x^3 + y^3 - z^3 = 0)
//
// Uses VLIntegers to avoid being confined to small numbers
//
// (c) John Whitehouse 2019
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

CubeWalker = function ()
{
}
//-------------------------------------------------------------------------------------------------
CubeWalker.FromCubes = function (xc, yc, zc)
{
    var ret = new CubeWalker ();
    
    ret.big_cx = xc;
    ret.big_cy = yc;
    ret.big_cz = zc;
    
    ret.value = ret.big_cx.cube.Add (ret.big_cy.cube).Subtract(ret.big_cz.cube);

    return ret;
}
//-------------------------------------------------------------------------------------------------
CubeWalker.FromWeightings = function (w1, w2, n1, n2)
{
    var ret = new CubeWalker ();

    var x = VLInt.FromWeightings (w1.big_cx.root, w2.big_cx.root, n1, n2);
    var y = VLInt.FromWeightings (w1.big_cy.root, w2.big_cy.root, n1, n2);
    var z = VLInt.FromWeightings (w1.big_cz.root, w2.big_cz.root, n1, n2);
    
    return CubeWalker.FromInts (x, y, z);
}
//-------------------------------------------------------------------------------------------------
CubeWalker.FromInts = function (x, y, z)
{    
    var xc = BigCube.FromInt (x);
    var yc = BigCube.FromInt (y);
    var zc = BigCube.FromInt (z);

    return CubeWalker.FromCubes (xc, yc, zc);
}
//--------------------------------------------------------------------------------------------
CubeWalker.prototype.Neighbours = function ()
{
    var neighbours = new Array (27);
    
    var dx = [this.big_cx.DeltaMinus (), 0, this.big_cx.DeltaPlus ()];
    var dy = [this.big_cy.DeltaMinus (), 0, this.big_cy.DeltaPlus ()];
    var dz = [this.big_cz.DeltaMinus (), 0, this.big_cz.DeltaPlus ()];
    var pos = 0;
    
    for (var k = 0 ; k < 3 ; ++k)
    {
        var z = this.big_cz.root.AddInt (k-1);
        for (var j = 0 ; j < 3 ; ++j)
        {
            var y = this.big_cy.root.AddInt (j-1);
            for (var i = 0 ; i < 3 ; ++i)
            {
                var x = this.big_cx.root.AddInt (i-1);
                var n = (dx[i] == 0) ? this.value : this.value.Add (dx[i]);
                if (dy[j] != 0) n = n.Add (dy[j]);
                if (dz[k] != 0) n = n.Subtract (dz[k]);
                
                this.value.AddInt (dx[i]).AddInt(dy[j]).SubtractInt(dz[k]);
                neighbours [pos++] = [x, y, z, n];
            }
        }
    }
    return neighbours;
}
//--------------------------------------------------------------------------------------------
CubeWalker.prototype.Walk = function ()
{                                
    var neighbours = this.Neighbours ();    
    
    // Find the best
    
    var vabs = this.value.Abs ();
    var best = -1;
    
    for (var idx in neighbours)
    {
        var neighbour = neighbours [idx];
        
        if (! neighbour [3].IsZero () && neighbour[0].IsNotEqualTo (neighbour[2]))
        {
            var nabs = neighbour[3].Abs();
            if (nabs.IsLessThan (vabs))
            {
                vabs = nabs;
                best = idx;
            }
        }
    }
    if (best == -1)
    {
        return null;
    }
    
    return CubeWalker.FromInts (...neighbours[best]);
}
//--------------------------------------------------------------------------------------------
CubeWalker.prototype.FindCross = function ()
{                                
    // Finds the best vector between the current point and an intersection with the surface
    // X^3 + Y^3 - Z^3 = 0
    // Assumes (x,y,z) is close to the surface.

    var neighbours = this.Neighbours ();    
    var best = null;
    var babs = null;
    
    for (var idx in neighbours)
    {
        var neighbour = neighbours [idx];
        
        if (neighbour[3].positive != this.value.positive && ! neighbour[3].IsZero())
        {
            var nabs = neighbour [3].Abs ();
            
            if (best == null || nabs.IsLessThan (babs))
            {
                best = neighbour;
                babs = nabs;
            }
        }
    }
    
    if (! best) return null;
    
    return CubeWalker.FromInts (...best);
}
//--------------------------------------------------------------------------------------------
CubeWalker.prototype.WalkX = function ()
{
    var vplus = this.value.Add (this.big_cx.DeltaPlus ());
    
    if (vplus.Abs ().IsLessThan (this.value.Abs ()))
    {
        return CubeWalker.FromInts (this.big_cx.root.Add (VLInt.ONE), this.big_cy.root, this.big_cz.root);
    }

    var vminus = this.value.Add (this.big_cx.DeltaMinus ());
        
    if (vminus.Abs ().IsLessThan (this.value.Abs ()))
    {
        return CubeWalker.FromInts (this.big_cx.root.Subtract (VLInt.ONE), this.big_cy.root, this.big_cz.root);
    }
    
    return null;
}
//--------------------------------------------------------------------------------------------
CubeWalker.prototype.WalkY = function ()
{
    var vplus = this.value.Add (this.big_cy.DeltaPlus ());
    
    if (vplus.Abs ().IsLessThan (this.value.Abs ()))
    {
        return CubeWalker.FromInts (this.big_cx.root, this.big_cy.root.Add (VLInt.ONE), this.big_cz.root);
    }

    var vminus = this.value.Add (this.big_cy.DeltaMinus ());
        
    if (vminus.Abs ().IsLessThan (this.value.Abs ()))
    {
        return CubeWalker.FromInts (this.big_cx.root, this.big_cy.root.Subtract (VLInt.ONE), this.big_cz.root);
    }
    
    return null;
}
//--------------------------------------------------------------------------------------------
CubeWalker.prototype.WalkZ = function ()
{
    var vplus = this.value.Subtract (this.big_cz.DeltaPlus ());
    
    if (vplus.Abs ().IsLessThan (this.value.Abs ()))
    {
        return CubeWalker.FromInts (this.big_cx.root, this.big_cy.root, this.big_cz.root.Add (VLInt.ONE));
    }

    var vminus = this.value.Subtract (this.big_cz.DeltaMinus ());
        
    if (vminus.Abs ().IsLessThan (this.value.Abs ()))
    {
        return CubeWalker.FromInts (this.big_cx.root, this.big_cy.root, this.big_cz.root.Subtract (VLInt.ONE));
    }
    
    return null;
}
//--------------------------------------------------------------------------------------------
CubeWalker.prototype.Scale = function (n)
{
    this.big_cx = new BigCube.FromVLInt (this.big_cx.root.Multiply (n));
    this.big_cy = new BigCube.FromVLInt (this.big_cy.root.Multiply (n));
    this.big_cz = new BigCube.FromVLInt (this.big_cz.root.Multiply (n));

    this.value = this.big_cx.cube.Add (this.big_cy.cube).Subtract(this.big_cz.cube);
}
//----------------------------------------------------------------------------------------------------------------
CubeWalker.prototype.DecrementX = function ()
{
    this.value = this.value.Add (this.big_cx.DeltaMinus ());
    this.big_cx = this.big_cx.GetDecrement ();
}
//----------------------------------------------------------------------------------------------------------------
CubeWalker.prototype.IncrementX = function ()
{
    this.value = this.value.Add (this.big_cx.DeltaPlus ());
    this.big_cx = this.big_cx.GetIncrement ();
}
//----------------------------------------------------------------------------------------------------------------
CubeWalker.prototype.DecrementY = function ()
{
    this.value = this.value.Add (this.big_cy.DeltaMinus ());
    this.big_cy = this.big_cy.GetDecrement ();
}
//----------------------------------------------------------------------------------------------------------------
CubeWalker.prototype.IncrementY = function ()
{
    this.value = this.value.Add (this.big_cy.DeltaPlus ());
    this.big_cy = this.big_cy.GetIncrement ();
}
//----------------------------------------------------------------------------------------------------------------
CubeWalker.prototype.DecrementZ = function ()
{
    this.value = this.value.Subtract (this.big_cz.DeltaMinus ());
    this.big_cz = this.big_cz.GetDecrement ();
}
//----------------------------------------------------------------------------------------------------------------
CubeWalker.prototype.IncrementZ = function ()
{
    this.value = this.value.Subtract (this.big_cz.DeltaPlus ());
    this.big_cz = this.big_cz.GetIncrement ();
}
//--------------------------------------------------------------------------------------------
CubeWalker.TABLE_MAP =
[
    [-1, -1, 24, 25, 26],
    [-1, 21, 22, 23, -1],
    [18, 19, 20, -1, -1],
    [-1, -1, -1, -1, -1],
    
    [-1, -1, 15, 16, 17],
    [-1, 12, 13, 14, -1],
    [ 9, 10, 11, -1, -1],
    [-1, -1, -1, -1, -1],

    [-1, -1,  6,  7,  8],
    [-1,  3,  4,  5, -1],
    [ 0,  1,  2, -1, -1],
];


//--------------------------------------------------------------------------------------------
CubeWalker.TABLE_MAP_2 =
[
    [-1, -1, 24, 25, 26, -1, -1, -1, -1, -1, -1],
    [-1, 21, 22, 23, -1, -1, -1, -1, -1, -1, -1],
    [18, 19, 20, -1, -1, 15, 16, 17, -1, -1, -1],
    [-1, -1, -1, -1, 12, 13, 14, -1, -1, -1, -1],
    [-1, -1, -1,  9, 10, 11, -1, -1,  6,  7,  8],
    [-1, -1, -1, -1, -1, -1, -1,  3,  4,  5, -1],
    [-1, -1, -1, -1, -1, -1,  0,  1,  2, -1, -1],    
];



//--------------------------------------------------------------------------------------------
CubeWalker.FLAT_TABLE =
[
    [ 6,  7,  8, -1, 15, 16, 17, -1, 24, 25, 26],
    [ 3,  4,  5, -1, 12, 13, 14, -1, 21, 22, 23], 
    [ 0,  1,  2, -1,  9, 10, 11, -1, 18, 19, 20]
];


CubeWalker.TABLE_CENTRE = 13;
//--------------------------------------------------------------------------------------------
CubeWalker.prototype.ToTable = function (element_id)
{
    element_id.innerHTML = this.GetTableText();
}
//--------------------------------------------------------------------------------------------
CubeWalker.prototype.ToFlatTable = function (element_id)
{
    element_id.innerHTML = this.GetFlatTableText();
}
//--------------------------------------------------------------------------------------------
CubeWalker.prototype.GetTableText = function ()
{
    return this.MakeNeighboursTable (CubeWalker.TABLE_MAP_2);
}
//--------------------------------------------------------------------------------------------
CubeWalker.prototype.GetFlatTableText = function ()
{
    return this.MakeNeighboursTable (CubeWalker.FLAT_TABLE);
}
//--------------------------------------------------------------------------------------------
CubeWalker.prototype.MakeNeighboursTable = function (map)
{   
    var neighbours = this.Neighbours ();
    
    var text = "<table>";
    
    for (var row_idx in map)
    {
        var row = map [row_idx];
        text += "<tr>";
        
        for (var col_idx in row)
        {
            var cell = row [col_idx];

            if (cell < 0)
            {
                text += "<td>&nbsp;</td>";
            }
            else
            {
                var val = neighbours [cell][3];
                var style = (cell == CubeWalker.TABLE_CENTRE) ? "centre" : (val.positive ? "positive" : "negative");
                text += "<td class = \"" + style + "\">" + val.toString() + "</td>";
            }
        }
        text += "</tr>";
    }
    text += "</table>";
    return text;
}
//--------------------------------------------------------------------------------------------
CubeWalker.prototype.MakeNeighboursTable_Old = function (map)
{   
    var neighbours = this.Neighbours ();
    
    var text = "<table>";
    
    for (var row_idx in map)
    {
        var row = map [row_idx];
        text += "<tr>";
        
        for (var col_idx in row)
        {
            var cell = row [col_idx];

            if (cell < 0)
            {
                text += "<td>&nbsp;</td>";
            }
            else
            {
                var val = neighbours [cell][3];
                var style = (cell == CubeWalker.TABLE_CENTRE) ? "centre" : (val.positive ? "positive" : "negative");
                text += "<td class = \"" + style + "\">" + val.toString() + "</td>";
            }
        }
        text += "</tr>";
    }
    text += "</table>";
    return text;
}

//--------------------------------------------------------------------------------------------
CubeWalker.prototype.ToList = function (element_id)
{
    var neighbours = this.Neighbours ();
    var text = "<ul>";
    
    for (var row_idx in neighbours)
    {
        var row = neighbours [row_idx];
        text += Misc.Format ("<li>({0},{1},{2}) = {3}</li>", row[0], row[1], row[2], row[3]);
    }
    text += "</ul>";
    element_id.innerHTML = text;
}

//--------------------------------------------------------------------------------------------
CubeWalker.prototype.toString = function ()
{
    return "(" + [this.big_cx.root, this.big_cy.root, this.big_cz.root] + ") = " + this.value;
}
   
   