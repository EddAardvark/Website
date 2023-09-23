//-------------------------------------------------------------------------------------------------
// A generic value in a Collatz iteration (Using large ints)
// (c) John Whitehouse 2022
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

VLGenericValue = function ()
{
}

// P2 and p3 are ints, b is a VLUInt


VLGenericValue.FromInts = function (p3, p2, b)
{
    var ret = new VLGenericValue ();
    
    ret.p3 = p3;
    ret.p2 = p2;
    ret.b = VLUInt.FromInt (b);
    ret.odd = ret.b.Mod2 () != 0;
    
    return ret;
}
VLGenericValue.FromVLUInts = function (p3, p2, b)
{
    var ret = new VLGenericValue ();
    
    ret.p3 = p3;
    ret.p2 = p2;
    ret.b = b;
    ret.odd = ret.b.Mod2 () != 0;
    
    return ret;
}
VLGenericValue.Clone = function (other)
{
    var ret = new VLGenericValue ();
    
    ret.p3 = other.p3;
    ret.p2 = other.p2;
    ret.b = VLUInt.FromVLUInt (other.b);
    ret.odd = other.odd;
    
    if (other.blist)
    {
        ret.blist = other.blist;
        ret.alist = other.alist;
        ret.multiplier = other.multiplier;
        ret.limit = other.limit;
    }
    
    return ret;
}
VLGenericValue.CloneShallow = function (other)
{
    var ret = new VLGenericValue ();
    
    ret.p3 = other.p3;
    ret.p2 = other.p2;
    ret.b = VLUInt.FromVLUInt (other.b);
    ret.odd = other.odd;
    
    return ret;
}
VLGenericValue.ListFromStartValue = function (value)
{
    var ret = [];
    
    return ret;
}

VLGenericValue.prototype.Next = function ()
{
    if (this.odd)
    {
        var ret = VLGenericValue.CloneShallow (this);
        ++ ret.p3;

        ret.b = ret.b.MultiplyInt (3);
        ret.b.Increment();
        ret.odd = ret.b.Mod2 () != 0;
        return ret;
    }
    
    if (this.p2 <= 1)
        return null;
    
    var ret = VLGenericValue.CloneShallow (this);
    -- ret.p2;
    ret.b = ret.b.DivideInt (2);
    ret.odd = ret.b.Mod2 () != 0;
    return ret;
}

VLGenericValue.prototype.GetValue = function (k)
{
    var m = this.GetMultiplier ();
    
    return m.MultiplyInt (k).Add (this.b);
}

VLGenericValue.prototype.GetKForValue = function (val)
{
    var m = this.GetMultiplier ();
    var v = val.Subtract (this.b);
    var nd = v.DivdeWithRemainder (m);
    
    return (nd [1].IsZero ()) ? nd[0] : null;
}


VLGenericValue.prototype.IsValid = function ()
{
    return this.p2 > 0 && this.p3 >= 0;
}

VLGenericValue.ToFullSequence = function (list, k)
{
    var ret = [];
    for (var i in list)
    {
        ret.push (list[i].GetValue (k));
    }
    return ret;
}

VLGenericValue.ToOddSequence = function (list, k)
{
    var ret = [];
    for (var i in list)
    {
        if (list[i].odd) ret.push (list[i].GetValue (k));
    }
    return ret;
}

VLGenericValue.Compare = function (a, b)
{
    if (a.p3 != b.p3) return (a.p3 > b.p3) ? 1 : -1;
    if (a.p2 != b.p2) return (a.p2 > b.p2) ? 1 : -1;
    
    return VLUInt.Compare (a.b, b.b);
}

VLGenericValue.MakeAtom = function (n)
{    
    var b = BigPowers.GetPower (2, n);
    
    if (n % 2 != 0)
    {
         b = b.MultiplyInt(5);
    }

    b.Decrement ();
    b = b.DivideInt (3);
    
    return VLGenericValue.FromVLUInts (0, 1 + n, b);
}

VLGenericValue.MakeTwoMemberList = function (n1, n2)
{    
    if (n1 < 1 || n2 < 1) throw "too small";
    
    var gv2 = VLGenericValue.MakeAtom (n2);
    
    return gv2.Prefix (n1);
}

VLGenericValue.FromAList = function (alist)
{
    var pos = alist.length - 1;
    
    if (pos < 0) throw "too small";
    
    var gv = VLGenericValue.MakeAtom (alist [pos])
    
    while (pos > 0)
    {
        --pos;
        gv = gv.Prefix (alist[pos]);
    }
    return gv;
}

VLGenericValue.prototype.Prefix = function (n)
{    
//    (3*b+1)/2^n1 = 2^(n2+1) * k + b2

    var base = BigPowers.GetPower (2, this.p2);
    var p1 = BigPowers.GetPower (2, n)
    var to_try = this.b;
    var b = 0;

    for (var i = 0 ; i < 3 ; ++i)
    {
        var temp = p1 * to_try - 1;
        if (temp % 3 == 0)
        {
            b = temp/3;
            break;
        }
        to_try += base;
    }
    if (b == 0) throw "failed";
    
    return new VLGenericValue (0, n+this.p2, b);
}


VLGenericValue.prototype.Postfix = function (n)
{
    var atom = VLGenericValue.MakeAtom (n);
    var limit = this.GetLimit ();    
    var am = atom.GetMultiplier ();
    var range = am.DivideInt(2).ToInt();
    
    for (var k = 0 ; k < range ; ++ k)
    {
        var v = limit.GetValue (k);
        var t = v.DivdeWithRemainder (am);
        
        if(VLUInt.Compare (t[1], atom.b) == 0)
        {
            break;
        }
    }
    
    if (k == range)
    {
        return null;
    }

    var b = BigPowers.GetPower (2, this.p2).MultiplyInt (k).Add (this.b);
    var m = this.p2 + atom.p2 - 1;
    
    var ret = VLGenericValue.FromVLUInts (0, m, b);

    ret.k = k;
    
    return ret;
}

VLGenericValue.prototype.SequenceForK = function (k)
{
    var b = BigPowers.GetPower (2, this.p2).MultiplyInt (k).Add (this.b);
    
    return VLGenericValue.MakeOddSequence (b);
}

VLGenericValue.prototype.GrowthForK = function (k)
{
    var b = BigPowers.GetPower (2, this.p2).MultiplyInt (k).Add (this.b);
    
    return VLGenericValue.MakeOddGrowthSequence (b);
}



// Calculates various dependent terms

VLGenericValue.prototype.Inflate = function ()
{
    if (this.blist) return; // already inflated
    
    var next = this;
    var count = 0;    
    
    this.blist = [this.b];
    this.max_b = this.b;
    this.alist = [];
    var pow2 = BigPowers.GetPower (2,this.p2);
    var pow3 = BigPowers.GetPower (3,this.p3);
    this.multiplier = pow3.Multiply(pow2);
    this.limit = this;
    this.text = this.multiplier + "k+" + this.b.toString ();
    
    while (true)
    {
        next = next.Next ();
        if (next == null)
            break;
        
        if (next.odd)
        {
            this.blist.push (next.b);
            this.limit = next;
            this.alist.push (count);
            if (VLUInt.Compare (next.b, this.max_b) > 0)
            {
                this.max_b = next.b;
            }
            count = 0;
        }
        else
        {
            ++ count;
        }
    }
    this.growth = VLUInt.Ratio (this.max_b, this.b);
}

//---------------------------------------------- Access functions ------------------------------------------------------------
// The last predictable generic value for this seed.
VLGenericValue.prototype.GetLimit = function ()
{
    this.Inflate ();    
    return this.limit;
}
// The A-List defined by this seed
VLGenericValue.prototype.GetAList = function ()
{
    this.Inflate ();    
    return this.alist;
}
// The B-List defined by this seed
VLGenericValue.prototype.GetBList = function ()
{
    this.Inflate ();
    return this.blist;
}
// The B-List defined by this seed
VLGenericValue.prototype.GetMaxB = function ()
{
    this.Inflate ();
    return this.max_b;
}
// The B-List defined by this seed
VLGenericValue.prototype.GetMultiplier = function ()
{
    this.Inflate ();
    return this.multiplier;
}
// The B-List defined by this seed
VLGenericValue.prototype.GetGrowth = function ()
{
    this.Inflate ();
    return this.growth;
}


//---------------------------------------------- helpers ------------------------------------------------------------
VLGenericValue.ONE = VLUInt.FromInt (1);


VLGenericValue.MakeSequence = function (b)
{
    if (VLUInt.Compare (b, VLGenericValue.ONE) < 0) return "n/a";
    
    var ret = [b];
    
    while (VLUInt.Compare (b, VLGenericValue.ONE) != 0)
    {
        if (b.Mod2 () == 1)
        {
            b = b.MultiplyInt (3);
            b.Increment();
        }
        else
        {
            b = b.DivideInt (2);
        }
        ret.push (b);
    }
    return ret;
}
VLGenericValue.MakeOddSequence = function  (b)
{
    if (VLUInt.Compare (b, VLGenericValue.ONE) < 0) return "n/a";
    
    var ret = [];
    
    while (VLUInt.Compare (b, VLGenericValue.ONE) != 0)
    {
        if (b.Mod2 () == 1)
        {
            ret.push (b);
            b = b.MultiplyInt (3);
            b.Increment();
        }
        else
        {
            b = b.DivideInt (2);
        }
    }
    ret.push (VLGenericValue.ONE);
    return ret;
}
VLGenericValue.MakeOddGrowthSequence = function  (b)
{    
    if (VLUInt.Compare (b, VLGenericValue.ONE) < 0) return "n/a";
    
    var ret = [b];
    var b0 = b;
    var odd = b.Mod2 () == 1;
    
    while (true)
    {
        if (odd)
        {
            b = b.MultiplyInt (3);
            b.Increment();
            odd = false;
        }
        else
        {
            b = b.DivideInt (2);
            
            odd = b.Mod2 () == 1;

            if (odd)
            {
                var c = VLUInt.Compare (b, b0);
            
                if (c < 0) break;
                if (c == 0) return "You've gound a loop!";

                ret.push (b);
            }
        }
    }
    return ret;
}
VLGenericValue.MakeGrowthAList = function  (b)
{    
    if (VLUInt.Compare (b, VLGenericValue.ONE) < 0) return "n/a";
    
    var ret = [];
    var b0 = b;
    var odd = b.Mod2 () == 1;
    var count = 0;
    
    while (true)
    {
        if (odd)
        {
            b = b.MultiplyInt (3);
            b.Increment();
            odd = false;
            count = 0;
        }
        else
        {
            b = b.DivideInt (2);
            
            odd = b.Mod2 () == 1;
            ++count;

            if (odd)
            {
                var c = VLUInt.Compare (b, b0);
            
                if (c < 0) break;
                if (c == 0) return "You've gound a loop!";

                ret.push (count);
            }
        }
    }
    return ret;
}
VLGenericValue.MakeFullAList = function  (b)
{
    if (VLUInt.Compare (b, VLGenericValue.ONE) < 0) return "n/a";
    
    var ret = [];
    
    while (VLUInt.Compare (b, VLGenericValue.ONE) != 0)
    {
        if (b.Mod2 () == 1)
        {
            b = b.MultiplyInt (3);
            b.Increment();
        }
        else
        {
            var count = 0;
            while (true)
            {
                b = b.DivideInt (2);
                ++ count;
                if (b.Mod2 () == 1)
                {
                    break;
                }
            }
            ret.push (count);
        }
    }
    return ret;
}


//---------------------------------------------- Inspection and testing ------------------------------------------------------------
VLGenericValue.prototype.toArray = function ()
{
    return [this.p3, this.p2, this.b];
}

VLGenericValue.prototype.toString = function ()
{
    var ret = "";
    if (this.p3 > 0)
    {
        ret += (this.p3 == 1) ? "3*" : Misc.Format ("3^[{0}]*", this.p3);
    }
    ret += (this.p2 == 1) ? Misc.Format ("2*k+{0}", this.b) : Misc.Format ("2^[{0}]*k+{1}", this.p2, this.b);
    return Misc.expand_expression (ret);
}