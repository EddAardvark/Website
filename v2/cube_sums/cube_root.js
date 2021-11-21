
//-------------------------------------------------------------------------------------------------
// Approximates cube roots as the ration of two integers
//
// (c) John Whitehouse 2013 - 2019
// www.eddaardvark.co.uk
//
// Uses vlint.js
//-------------------------------------------------------------------------------------------------
CubeRoot = function (cube, a, b, count)
{
    // cube - the number being rooted
    // a/b - the original guess
    // count - the number of iterations to try
    // Expects cube, a and b to be VLints.
    
    this.cube = cube;
    this.count = count;
    this.a = a;
    this.b = b;
    
    this.sequence = [[a,b,a.Divide(b)]];
    
    for (var i = 0 ; i < count ; ++i)
    {
        if (this.GetNext ()) break;
    }
    return this.sequence[this.sequence.length-1][2];
}
CubeRoot.FromXY = function (x, y, n)
{
    var x3 = x.Cube ();
    var y3 = y.Cube ();
    var target = x3.Add(y3);
    
    if (x.positive == y.positive)
    {
        if (VLInt.Compare (x, y) > 0)
        {
            guess = x.positive ? x : y;
        }
        else
        {
            guess = x.positive ? y : x;
        }
    }
    else
    {
        guess = VLInt.ZERO;
    }
    
    var cr = new CubeRoot (target, guess, VLInt.ONE, n);
    return cr;
}
//--------------------------------------------------------------------------------------------
CubeRoot.Initialise = function ()
{
    CubeRoot.Two = VLInt.FromInt (2);
    CubeRoot.Three = VLInt.FromInt (3);
}
//--------------------------------------------------------------------------------------------
CubeRoot.prototype.GetNext = function ()
{
    // Uses Newton Raphson, 
    // Z -> Z - f(Z) / f'(Z) = Z - (Z^3 - N) / 3Z^2 = (2Z^3 + N) / 3Z^2
    // Sub Z = (a/b) gives
    //    a -> 2 x a^3 + N x b^3
    //    b -> 2 x a^2 x b
    
    var len = this.sequence.length;
    var a = this.sequence[len-1][0];
    var b = this.sequence[len-1][1];
    var prev = this.sequence[len-1][2];
    
    var a2 = a.Multiply (a);
    var a3 = a2.Multiply(a);
    var b3 = b.Multiply (b).Multiply (b);

    var new_a = CubeRoot.Two.Multiply (a3).Add (b3.Multiply(this.cube));
    var new_b = CubeRoot.Three.Multiply (a2).Multiply (b);
    var int_val = new_a.Divide(new_b);
    
    if (VLInt.Compare (int_val, prev) == 0) return true;

    Misc.Log ("A = {0}, B = {1}, Ratio = {2}", new_a, new_b, int_val);
    this.sequence.push ([new_a, new_b, int_val]);   
    return false;
}
//--------------------------------------------------------------------------------------------
CubeRoot.prototype.ToList = function (element_id)
{
    var text = "<ul>";
    
    for (var row_idx in this.sequence)
    {
        var row = this.sequence [row_idx];
        text += Misc.Format ("<li>{0} / {1}</li>", row[0], row[1]);
    }
    text += "</ul>";
    element_id.innerHTML = text;
}
//--------------------------------------------------------------------------------------------
CubeRoot.prototype.toString = function ()
{
    var len = this.sequence.length;
    var a = this.sequence[len-1][0];
    var b = this.sequence[len-1][1];
    
    return "Cube Root(" + this.cube + ") = " + a + " / " + b;
}
//--------------------------------------------------------------------------------------------
CubeRoot.ApproxRootOfVLInt = function (vlint)
{
    var me = vlint.MantissaExponent ();
    return Math.pow (me[0], 1/3) * Math.pow(10, me[1]/3);
}

   
   