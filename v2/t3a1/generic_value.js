//-------------------------------------------------------------------------------------------------
// A generic value in a Collatz iteration
// (c) John Whitehouse 2022
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

GenericValue = function (p3, p2, b)
{
    this.p3 = p3;
    this.p2 = p2;
    this.b = b;
    this.odd = this.b % 2 != 0;
}

GenericValue.Clone = function (other)
{
    this.p3 = other.p3;
    this.p2 = other.p2;
    this.b = other.b;
    this.odd = other.odd;
    
    if (other.blist)
    {
        this.blist = other.blist;
        this.alist = other.alist;
        this.multiplier = other.multiplier;
        this.limit = other.limit;
    }
}

GenericValue.prototype.Next = function ()
{
    if (this.odd)
        return new GenericValue (this.p3 + 1, this.p2, 3 * this.b + 1);
    
    if (this.p2 <= 1)
        return null;
    
    return new GenericValue (this.p3, this.p2 - 1, this.b / 2);
}
GenericValue.prototype.GetValue = function (k)
{
    var m = this.GetMultiplier ();
    
    return m * k + this.b;
}
GenericValue.prototype.IsValid = function ()
{
    return this.p2 > 0 && this.p3 >= 0 && this.b == Math.floor (b);
}
GenericValue.ToFullSequence = function (list, k)
{
    var ret = [];
    for (var i in list)
    {
        ret.push (list[i].GetValue (k));
    }
    return ret;
}
GenericValue.ToOddSequence = function (list, k)
{
    var ret = [];
    for (var i in list)
    {
        if (list[i].odd) ret.push (list[i].GetValue (k));
    }
    return ret;
}
GenericValue.Compare = function (a, b)
{
    if (a.p3 != b.p3) return (a.p3 > b.p3) ? 1 : -1;
    if (a.p2 != b.p2) return (a.p2 > b.p2) ? 1 : -1;
    if (a.b != b.b) return (a.b > b.b) ? 1 : -1;
    return 0;
}
GenericValue.MakeAtom = function (n)
{    
    var b = Math.pow(2, n);
    
    b = (n % 2 == 0) ? ((b - 1) / 3) : ((5 * b - 1) / 3);
    
    return new GenericValue (0, 1 + n, b);
}

GenericValue.MakeTwoMemberList = function (n1, n2)
{    
    if (n1 < 1 || n2 < 1) throw "too small";
    
    var gv2 = GenericValue.MakeAtom (n2);
    
    return gv2.Prefix (n1);
}
GenericValue.FromAList = function (alist)
{
    var pos = alist.length - 1;
    
    if (pos < 0) throw "too small";
    
    var gv = GenericValue.MakeAtom (alist [pos])
    
    while (pos > 0)
    {
        --pos;
        gv = gv.Prefix (alist[pos]);
    }
    return gv;
}

GenericValue.prototype.Prefix = function (n)
{    
//    (3*b+1)/2^n1 = 2^(n2+1) * k + b2

    var base = Math.pow (2, this.p2)
    var p1 = Math.pow (2,n)
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
    
    return new GenericValue (0, n+this.p2, b);
}


GenericValue.prototype.Postfix = function (n)
{
    var atom = GenericValue.MakeAtom (n);
    var limit = this.GetLimit ();    
    var am = atom.GetMultiplier ();
    var range = am/2;
    
    for (var k = 0 ; k < range ; ++ k)
    {
        var v = limit.GetValue (k);
        if (v % am == atom.b)
        {
            break;
        }
    }
    
    if (k == range) throw "GenericValue.Postfix failed";

    var b = Math.pow (2, this.p2) * k + this.b;
    var m = this.p2 + atom.p2 - 1;
    
    var ret = new GenericValue (0, m, b);

    ret.k = k;
    
    return ret;
}
// Constructs a list of lists that diverge

GenericValue.SearchLists = function (depth)
{
    var todo = [];
    var start = GenericValue.MakeAtom (1);
    var n = 1;    
    var text = Misc.Format ("{0}|{1}|{2}\n", start.GetAList(), start, start.GetBList());
    
    todo.push (start);
    
    for (var i = 0 ; i < depth ; ++i)
    {
        var current = todo.shift ();
        var j = 1;
        
        while (true)
        {
            var next = current.Postfix (j);
            var blist = next.GetBList ();
            if (blist [blist.length-1] < blist[0]) break;
            ++n; ++j;
            text += Misc.Format ("{0}|{1}|{2}\n", next.GetAList(), next, next.GetBList());
            todo.push (next);
        }
    }
    return text;
}

GenericValue.SearchListsWide = function (depth)
{   
    var start = GenericValue.MakeAtom (1);
    var n = 1;    
    var sofar = {};
    var text = Misc.Format ("{0}|{1}|{2}\n", start.GetAList(), start, start.GetBList());
    var links = [];
    
    sofar [start.b] = start;    

    for (var i = 0 ; i < depth ; ++i)
    {
        var keys = Object.keys (sofar);
        var key = Math.min(...keys);
        var current = sofar[key];
        Misc.Log ("Choosing {0}, AList = [{1}], BList = [{2}]", current.b, current.GetAList (), current.GetBList());
        delete sofar [key];
        text += Misc.Format ("{0}|{1}|{2}\n", current.GetAList(), current, current.GetBList());
        
        var j = 1;
        
        while (true)
        {
            var next = current.Postfix (j);
            Misc.Log ("Next B = {0}, AList = [{1}], BList = [{2}]", next.b, next.GetAList (), next.GetBList());
        
            var blist = next.GetBList ();
            if (blist [blist.length-1] < blist[0]) break;
            ++n; ++j;
            links.push ([current.b, next.b]);
            sofar[next.b] = next;
            Misc.Log ("Queueing: {0}, link = [{1}]", next.GetAList (), [current.b, next.b]);

        }
    }
    return text;
}
// Calculates various dependent terms

GenericValue.prototype.Inflate = function ()
{
    if (this.blist) return; // already inflated
    
    var next = this;
    var count = 0;    
    
    this.blist = [this.b];
    this.alist = [];
    this.multiplier = Math.pow (2,this.p2) * Math.pow (3,this.p3);
    this.limit = this;
    this.text = this.multiplier + "k+" + this.b;
    
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
            count = 0;
        }
        else
        {
            ++ count;
        }
    }
    return this.blist;
}
// The last predictable generic value for this seed.
GenericValue.prototype.GetLimit = function ()
{
    this.Inflate ();    
    return this.limit;
}
// The A-List defined by this seed
GenericValue.prototype.GetAList = function ()
{
    this.Inflate ();    
    return this.alist;
}
// The B-List defined by this seed
GenericValue.prototype.GetBList = function ()
{
    this.Inflate ();
    return this.blist;
}
// The B-List defined by this seed
GenericValue.prototype.GetMultiplier = function ()
{
    this.Inflate ();
    return this.multiplier;
}

GenericValue.prototype.toArray = function ()
{
    return [this.p3, this.p2, this.b];
}

GenericValue.prototype.toString = function ()
{
    var ret = "";
    if (this.p3 > 0)
    {
        ret += (this.p3 == 1) ? "3*" : Misc.Format ("3^[{0}]*", this.p3);
    }
    ret += (this.p2 == 1) ? Misc.Format ("2*k+{0}", this.b) : Misc.Format ("2^[{0}]*k+{1}", this.p2, this.b);
    return Misc.expand_expression (ret);
}