//-------------------------------------------------------------------------------------------------
// Functions relating to A-lists and S-values
// (c) John Whitehouse 2019
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

AList = function () {}

AList.pow2 = [];
AList.pow3 = [];
AList.big_pow2 = [];
AList.big_pow3 = [];

AList.Initialise = function ()
{
    var x = 1;
    var idx = 0;
    
    while (x <= Number.MAX_SAFE_INTEGER)
    {
        AList.pow2 [idx] = x;
        x = x * 2;
        ++idx;
    }
    x = 1;
    idx = 0;
    
    while (x <= Number.MAX_SAFE_INTEGER)
    {
        AList.pow3 [idx] = x;
        x = x * 3;
        ++idx;
    }

    AList.max_n = AList.pow3.length - 1;
    AList.max_m = AList.pow2.length - 1;
    
    AList.Zero = VLUInt.FromInt (0);
    AList.One = VLUInt.FromInt (1);
    
    AList.big_pow2 [0] = AList.One;
    AList.big_pow3 [0] = AList.One;
}

AList.FromList = function (list)
{
    var ret = new AList ();
    ret.list = list;
    ret.CalculateAttributes ();
    return ret;
}

AList.prototype.GetRotation = function ()
{
    return AList.FromList (this.list.slice(1).concat (this.list[0]));
}


AList.prototype.CalculateAttributes = function ()
{
    this.n = this.list.length;
    this.m = 0;
    
    for (var idx in this.list)
    {
        this.m += this.list[idx];
    }
    this.k = AList.pow2[this.m] - AList.pow3 [this.n];
}
    
AList.prototype.Key = function ()
{
    if (!this.key)
    {
        this.key = this.MakeKey ();
    }
    return this.key;
}

AList.prototype.MakeKey = function ()
{
    return AList.MakeListKey (this.list);
}
AList.MakeListKey = function (list)
{
    return "[" + list + "]";
}

AList.M0 = [1,2,4,5,7,8,10,12,13,15,16,18,20,21,23,24,26,27,29,31,32,34,35,37,39,40,42,43,45,46,48,50,51];

AList.GetM0 = function (n)
{
    if (AList.M0 [n]) return AList.M0 [n];
    
    var m = Math.floor (n * 1.58496); // log(3)/log(2) is irrational, this errs slightly on the small size.

    var p2 = AList.GetBigPow2 (m);
    var p3 = AList.GetBigPow3 (n);
    
    if (VLUInt.Compare (p2, p3) <= 0) ++m;
            
    AList.M0 [n] = m;
    
    return m;
}
            

AList.prototype.Value = function ()
{
    if (!this.value)
    {
        this.value = this.CalculateValueAt (0);
    }
    return this.value;
}

AList.prototype.CalculateValueAt = function (pos)
{
    if (this.list.length < pos+1) return 0;
    if (this.list.length == pos+1) return 1;
    if (this.list.length == pos+2) return 3 + AList.pow2 [this.list [pos]];

    return AList.pow3 [this.list.length-pos-1] + AList.pow2 [this.list [pos]] * this.CalculateValueAt(pos+1);
}
// Stops after first cycle
AList.prototype.GetSValues = function ()
{
    if (! this.svalues)
    {
        var ret = [];
        var s0 = this.Value();
        var s1 = s0;
        
        for (var i = 0 ; i < this.list.length ; ++i)
        {
            ret.push (s1);
            s1 = (3 * s1 + this.k) / Math.pow (2, this.list[i]);
            if (s1 == s0) break;
            s0 = s1;
        }
        this.svalues = ret;
        
        this.smin = Math.min (...this.svalues);
        this.smax = Math.max (...this.svalues);
    }
    
    return this.svalues;
}

AList.prototype.Smin = function () { this.GetSValues (); return this.smin; }
AList.prototype.Smax = function () { this.GetSValues (); return this.smax; }


// Creates a balanced A-list which will generate the largest loop seed for (m,n)
AList.MakeBalancedList = function (m,n)
{
    var ret = []
    var val = m;
    var i = 0;
    
    while (i < n)
    {
        ret [i] = 0;
        while (val >= n)
        {
            ++ ret [i];
            val -= n;
        }
        ++i;
        val += m;
    }
    
    if (val != m) throw Misc.Format ("Val = {0}", val);

    return AList.FromList (ret);
}
// Creates a balanced A-list which will generate the smallest loop seed for (m,n)
AList.MakeMinValueList = function (m,n)
{
    var ret = []

    for (var i = 0 ; i < n ; ++i)
    {
        ret [i] = 1;
    }

    ret [n-1] = 1 + m - n;

    return AList.FromList (ret);
}
// Creates a balanced A-list which will generate the largest loop seed for (m,n)
AList.MakeMaxValueList = function (m,n)
{
    var ret = []

    for (var i = 0 ; i < n ; ++i)
    {
        ret [i] = 1;
    }

    ret [0] = 1 + m - n;

    return AList.FromList (ret);
}

// Gets the list generated by moving one of the beads to the left, no box can have fewer than 1 beads
// so in this case it returns null

AList.prototype.MoveBeadLeft = function (idx)
{
    if (idx < 1 || idx >= this.list.length || this.list[idx] == 1)
    {
        return null;
    }
    
    var next = [].concat(this.list);
    ++ next[idx-1];
    -- next[idx];
    
    var ret = AList.FromList (next);
    
    ret.row = this.row + 1;
    return ret;
}
//=========================================================================================================
// Big integer versions (uses unsigned values so no negative results
//=========================================================================================================
AList.GetBigPow2 = function (n)
{
    var pos = AList.big_pow2.length;

    while (pos <= n)
    {
        AList.big_pow2 [pos] = AList.big_pow2 [pos-1].MultiplyInt (2);
        ++pos;        
    }
    
    return AList.big_pow2 [n];
}
AList.GetBigPow3 = function (n)
{
    var pos = AList.big_pow3.length;

    while (pos <= n)
    {
        AList.big_pow3 [pos] = AList.big_pow3 [pos-1].MultiplyInt (3);
        ++pos;        
    }
    
    return AList.big_pow3 [n];
}
AList.prototype.BigValue = function ()
{
    if (!this.big_value)
    {
        this.big_value = this.CalculateBigValueAt (0);
    }
    return this.big_value;
}

AList.prototype.CalculateBigValueAt = function (pos)
{
    if (this.list.length < pos+1) return AList.Zero;
    if (this.list.length == pos+1) return AList.One;
    
    var p2 = AList.GetBigPow2 (this.list [pos]);
    
    if (this.list.length == pos+2)
    {
        return p2.AddInt (3);
    }

    var p3 = AList.GetBigPow3 (this.list.length-pos-1);
    
    return p3.Add (p2.Multiply (this.CalculateBigValueAt(pos+1)));
}

AList.GetBaseExpression = function (a)
{    
    if (a < 1 || a != Math.floor (a)) throw "not a positive integer";
    
    var exp = a + 1;
    var z = (a % 2 == 0) ? 1 : 5;
    var b = (z * Math.pow (2, a) - 1) / 3;
    
    return [exp, b];    
}
//=========================================================================================================
// Testing
//=========================================================================================================
AList.prototype.toString = function ()
{
    if (this.list) return this.list.toString ();
    return "[]";
}
    
AList.Test = function ()
{
    var a1 = AList.MakeBalancedList (5,3);
    var v1 = a1.Value ();
    
    if (v1 != 23) throw Misc.Format ("({0}}: {1} != 23", a1, v1);
    
    var v2 = a1.BigValue ();
    
    if (v1.toString () != v2.toString ()) throw Misc.Format ("({0}}: {1} != {2}", a1, v1, v2);

    a1 = AList.MakeBalancedList (9,5);    
    v1 = a1.Value ();
    
    if (v1 != 431) throw Misc.Format ("({0}}: {1} != 431", a1, v1);
    
    v2 = a1.BigValue ();
    
    if (v1.toString () != v2.toString ()) throw Misc.Format ("({0}}: {1} != {2}", a1, v1, v2);
    
    // Verify the M0 array
    
    for (var n = 1 ; n <= 32 ; ++n)
    {
        var m = Math.floor (n * 1.58496); // log(3)/log(2) is irrational, this errs slightly on the small size.
    
        if (AList.pow2[m] - AList.pow3 [n] <= 0) m = m+1;
        
        if (m != AList.GetM0(n)) throw Misc.Format ("M0 ({0}) = {1} != {2}", n, AList.GetM0(n), m);
    }
    
    
}
