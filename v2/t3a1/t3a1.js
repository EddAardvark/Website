// Create a namespace
// Some functions in this file rely on "big_integers.js"


T3A1 = function () {}

T3A1.INDEX = 'http://www.eddaardvark.co.uk/v2/t3a1/index.html';
T3A1.MAX_PREDECESSOR = (Number.MAX_SAFE_INTEGER - 1) / 4;
T3A1.LOG_3_O_2 = Math.log (3) / Math.log (2);

// Raw function
T3A1.NextRaw = function(x)
{
    return ((x % 2) == 0) ? (x/2) : (3*x+1);
}
// Selects only the odd numbers, must be called with an odd number
T3A1.NextOdd = function(x)
{
    var t = 3 * x + 1;

    while (t % 2 == 0)
    {
        t /= 2;
    }
    return t;
}
// Selects only the odd numbers, takes out numbers of the form (4n+1) as
// 3 * (4n+1) + 1 = 12n + 4 = 4 * (3n + 1). So a number of the form 4n+1 will in
// two iterations time converge on the same result as n.
// must be called with an odd number
T3A1.NextOdd4 = function(x)
{
    if (x % 8 == 5)
    {
        return (x - 1) / 4;
    }

    var t = 3 * x + 1;

    while (t % 2 == 0)
    {
        t /= 2;
    }
    return t;
}

T3A1.GetK = function (m,n) { return Math.pow (2,m) - Math.pow(3,n); }
T3A1.GetBigK = function (m,n)
{
    var t1 = new BigUnsignedInt (2).Pow (m);
    var t2 = new BigUnsignedInt (3).Pow (n);
    return t1.Subtract (t2);
}

// Makes a sequence
T3A1.MakeRawSequence = function (x) { return (x > 0) ? T3A1.MakeSequence (T3A1.NextRaw,x) : T3A1.MakeNegativeSequence (T3A1.NextRaw,x); ; }
T3A1.MakeOddSequence = function (x) { return (x > 0) ? T3A1.MakeSequence (T3A1.NextOdd,x) : T3A1.MakeNegativeSequence (T3A1.NextOdd,x); ; }
T3A1.MakeOdd4Sequence = function (x) { return (x > 0) ? T3A1.MakeSequence (T3A1.NextOdd4,x) : T3A1.MakeNegativeSequence (T3A1.NextOdd4,x); ; }

// Makes a sequence using the supplied function
T3A1.MakeSequence = function (fun, x)
{
    var ret = [];

    while (x != 1)
    {
        ret.push (x);
        x = fun (x);
    }
    ret.push (x);
    return ret;
}
// Makes a sequence using the supplied function
T3A1.MakeNegativeSequence = function (fun, x)
{
    var ret = [];

    while (x != -1 && x != -7)
    {
        ret.push (x);
        x = fun (x);
    }
    ret.push (x);
    return ret;
}
// Convert a sequence to text
T3A1.SequenceToText = function (seq, maxlen)
{
    var ret = "";
    var num = seq.length;
    var last_cutoff = 0;

    for (var i = 0 ; i < num ; ++i)
    {
        ret += seq [i] + ", ";
        if (maxlen)
        {
            if (ret.length - last_cutoff > maxlen)
            {
                ret += "\n";
                last_cutoff = ret.length;
            }
        }
    }
    return ret.substr(0, ret.length-2);
}
// Selects only the odd numbers, must be called with an odd number
T3A1.NextOddWithAlpha = function(x)
{
    var t = 3 * x + 1;
    var alpha = 0;

    while (t % 2 == 0)
    {
        t /= 2;
        ++ alpha;
    }
    return [t,alpha];
}
// Makes an alpha sequence using the supplied function
T3A1.MakeAlphaSequence = function (x)
{
    var ret = [];

    while (x != 1 && x != -1 && x != -7)
    {
        var result = T3A1.NextOddWithAlpha (x);
        x = result [0];
        ret.push (result[1]);
    }
    return ret;
}
// Clides are sequences that reduce a seed to a smaller number.
T3A1.MakeGlideSequence = function (x)
{
    var ret = [x];
    var current = x;
    while (x >= current)
    {
        x = T3A1.NextOdd (x);
        ret.push(x);
    }
    return ret;
}
// Clides are sequences that reduce a seed to a smaller number.
T3A1.Make4nGlideSequence = function (x)
{
    var ret = [x];
    var current = x;
    while (x >= current)
    {
        x = T3A1.NextOdd4 (x);
        ret.push(x);
    }
    return ret;
}
// Gets the list of numbers that converge on the seed
T3A1.GetPredecessors = function (x)
{
    if (x % 2 == 0 || x % 3 == 0 || x < 0 || x > T3A1.MAX_PREDECESSOR)
    {
        return [];
    }

    var p0 = ((x % 6 == 1) ? (x * 4 - 1) : (x * 2 - 1)) / 3;

    var ret = [p0];

    while (p0 <= T3A1.MAX_PREDECESSOR)
    {
        p0 = p0 * 4 + 1;
        ret.push (p0);
    }
    return ret;
}
// Gets the one ror two numbers that converge on a value in the 4n tree
T3A1.Get4nPredecessors = function (x)
{

    var ret = [];
    var r = x % 6;

    if (r == 1)
    {
        ret.push ((4 * x - 1) / 3);
    }
    else if (r == 5)
    {
        ret.push ((2 * x - 1) / 3);
    }
    ret.push (4 * x + 1);
    return ret;
}
// Convert an integer to binary

T3A1.ToBinary = function (x)
{
    if (x <= 0) return [0];

    var binary = [];

    while (x > 0)
    {
        binary.push (x%2);
        x = Math.floor (x/2);
    }
    return binary;
}
// Convert an integer to binary

T3A1.FromBinary = function (binary)
{
    var n = binary.length - 1;
    var ret = 0;

    while (n >= 0)
    {
        ret = ret * 2 + binary [n];
        --n;
    }
    return ret;
}
// Converts an integer into a value using the 4n=1 tree.
// We take the binary representation, eg 5 = 101. 1 then maps to 4x+1 and
// 0 to (2x-1)/3, (4x-1)/3, or possibly 0 (when x is divisible by 3).
T3A1.Binary4n = function (binary)
{
    var ret = 5;
    var res = 16/15;
    var n = binary.length - 2;  // assum 1st bit is a 1

    while (n >= 0)
    {
        if (binary [n] == 1)
        {
            ret = 4 * ret + 1;
            res -= res * (1 / ret);
        }
        else if (ret % 3 == 0)
        {
            ret = 0;
            res = 0;
            break;
        }
        else if (ret % 6 == 1)
        {
            var f2 = 1 + 1 / (4 * ret - 1);
            ret = (4 * ret - 1) / 3;
            res *= f2;
        }
        else
        {
            var f2 = 1 + 1 / (2 * ret - 1);
            ret = (2 * ret - 1) / 3;
            res *= f2;
        }
        --n;
    }
    return [ret, res];
}

T3A1.MakeAListKey = function (alist)
{
    return "[" + alist + "]";
}

T3A1.AListToValue = function (list)
{
    var alist = [].concat (list);
    var len = alist.length;

    if (len < 1) return 0;
    if (len == 1) return 1;
    if (len == 2) return 3 + Math.pow (2, alist [0]);

    return Math.pow (3, len-1) + Math.pow (2, alist [0]) * T3A1.AListToValue(alist.slice(1));
}
T3A1.BigAListToValue = function (list)
{
    // Recursive version is more succinct gets stack overflow after a few thousand.iterations
    var alist = [].concat (list);
    var len = alist.length;

    if (len < 1) return VLUInt.FromInt(0);
    if (len == 1) return VLUInt.FromInt(1);
    if (len == 2) return VLUInt.FromInt(3).Add (VLUInt.FromInt(2).Pow (alist [0]));

    var p2 = VLUInt.FromInt(1);
    var p3 = VLUInt.FromInt(1);
    var two = VLUInt.FromInt(2);
    var three = VLUInt.FromInt(3);
    var twos = [];
    var threes = [];

    for (var i = 0 ; i < len ; ++i)
    {
        twos.push (p2);
        threes.push (p3);
        p2 = p2.Multiply (two.Pow (alist[i]));
        p3 = p3.Multiply (three);
    }

    var sum = new VLUInt();

    for (var i = 0 ; i < len ; ++i)
    {
        sum = sum.Add (twos[i].Multiply(threes[len-i-1]));
    }
    return sum;
}

MakeRemainderTable=function (input, output1, output2)
{
    f = parseInt(input.value);
    
    if (f <= 0)
    {
        Misc.Alert ("input must be a positive integer, {0} is invalid", input.value);
        return;
    }
    
    var list2 = RemainderSequence (2,f);
    var list3 = RemainderSequence (3,f);
    var text = Misc.expand_expression("2^i mod ") + f + " = [" + list2[0] + "] + [" + list2 [1] + "]\n";
    text += Misc.expand_expression("3^i mod ") + f + " = [" + list3[0] + "] + [" + list3 [1] + "]";
    
    output1.innerHTML = text;
    var n2 = list2[0].length + list2[1].length;
    var n3 = list3[0].length + list3[1].length;
    
    if (n2 > 20 || n3 > 20)
    {
        output2.innerHTML = Misc.Format ("*** Table {0} x {1} is too large!", n2, n3);
        return;
    }
    var table = new JWTable ();
    
    table.style = "t1";

    for (var i = 0 ; i < list2[0].length ; ++i)
    {
        table.headings.push ([list2[0][i], "h1"]);
    }
    for (var i = 0 ; i < list2[1].length ; ++i)
    {
        table.headings.push ([list2[1][i], "h2"]);
    }
    
    for (var j = 0 ; j < list3[0].length ; ++j)
    {
        table.rows.push ([list3[0][j], "h1"]);
            
        for (var i = 0 ; i < list2[0].length ; ++i)
        {
            var v = (f + list3[0][j] - list2[0][i]) % f
            table.cells.push ([v, (v == 0) ? "vzero" : "v11"]);
        }
        for (var i = 0 ; i < list2[1].length ; ++i)
        {
            var v = (f + list3[0][j] - list2[1][i]) % f;
            table.cells.push ([v, (v == 0) ? "vzero" : "v12"]);
        }
    }
    
    for (var j = 0 ; j < list3[1].length ; ++j)
    {
        table.rows.push ([list3[1][j], "h2"]);
            
        for (var i = 0 ; i < list2[0].length ; ++i)
        {
            var v = (f + list3[1][j] - list2[0][i]) % f;
            table.cells.push ([v, (v == 0) ? "vzero" : "v21"]);
        }
        for (var i = 0 ; i < list2[1].length ; ++i)
        {
            var v = (f + list3[1][j] - list2[1][i]) % f;
            table.cells.push ([v, (v == 0) ? "vzero" : "v22"]);
        }
    }
    
    output2.innerHTML = table.Render ();
}

// Remainders of m^i % f
RemainderSequence = function(m,f)
{
    var ret = [];
    var val = 1;
    var idx = -1;
    
    for (var i = 0 ; i < f ; ++i)
    {
        var rem = val % f;
        idx = ret.indexOf (rem);
        if (idx >= 0)
        {
            break;
        }
        ret[i] = rem;
        val = val * m;
    }
    var part1 = ret.slice (0,idx);
    var part2 = ret.slice (idx);
    return [part1,part2];
}


