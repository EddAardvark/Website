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
T3A1.SequenceToText = function (seq)
{
    var ret = "";
    var num = seq.length;

    for (var i = 0 ; i < num ; ++i)
    {
        ret += seq [i] + ", ";
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

    if (len < 1) return new BigUnsignedInt(0);
    if (len == 1) return new BigUnsignedInt(1);
    if (len == 2) return new BigUnsignedInt(3).Add (new BigUnsignedInt(2).Pow (alist [0]));

    var p2 = new BigUnsignedInt(1);
    var p3 = new BigUnsignedInt(1);
    var two = new BigUnsignedInt(2);
    var three = new BigUnsignedInt(3);
    var twos = [];
    var threes = [];

    for (var i = 0 ; i < len ; ++i)
    {
        twos.push (p2);
        threes.push (p3);
        p2 = p2.Multiply (two.Pow (alist[i]));
        p3 = p3.Multiply (three);
    }

    var sum = new BigUnsignedInt(0);

    for (var i = 0 ; i < len ; ++i)
    {
        sum = sum.Add (twos[i].Multiply(threes[len-i-1]));
    }
    return sum;
}

T3A1.RotateList = function (list)
{
    return list.slice(1).concat (list[0]);
}

T3A1.CreateALists = function (m, n, limit)
{
    // Create all the lists of n integers, >= 1, that add up to m (limit stops the size
    // getting out of hand

    if (n == 1) return [[m]];

    var spare = m - n;
    var ret = []

    // The first integer can take values in the range 1 to 1 + spare

    for (var i = 0 ; i <= spare ; ++i)
    {
        var a0 = i + 1;
        var list_set = T3A1.CreateALists (m - a0, n - 1, limit);

        for (var j = 0 ; j < list_set.length ; ++j)
        {
            var new_list = [a0].concat (list_set [j]);

            ret.push (new_list);
            if (ret.length >= limit) return ret;
        }
    }
    return ret
}
// Creates a balanced A-list which will generate the largest loop seed for (m,n)
T3A1.MakeBalancedList = function (m,n)
{
    var ret = []
    var inc = m / n;
    var val = inc;

    for (var i = 0 ; i < n ; ++i)
    {
        var ival = Math.floor (val);
        ret.push (ival);
        val = val - ival + inc;
    }

    return ret
}

// Returns a map, alist_key -> [loop, list, value]

T3A1.FindLoops = function (m, n, limit)
{
    var alists = T3A1.CreateALists (m, n, limit);
    var list_map = {};
    var idx = 0;
    var num = alists.length;

    for (var i = 0 ; i < num ; ++i)
    {
        var key = T3A1.MakeAListKey (alists [i]);

        if (! list_map.hasOwnProperty (key))
        {
            var list = alists[i].slice();
            list_map [key] = [idx, list, T3A1.AListToValue (list)];
            for (var j = 0 ; j < n-1 ; ++j)
            {
                list = T3A1.RotateList (list);
                list_map [T3A1.MakeAListKey(list)] = [idx, list, T3A1.AListToValue (list)];
            }
            ++idx;
        }
    }
    return list_map;
}


NodeInAlistDAG = function (x, level, alist)
{
    this.x = x;
    this.level = level;
    this.s_value = T3A1.AListToValue (alist);
    this.alist = alist;
    this.key = T3A1.MakeAListKey(alist);
    this.next = [];
}
NodeInAlistDAG.prototype.toString = function ()
{
    return "DAG-Node: (" + [this.level, this.x] + ") " + T3A1.MakeAListKey(alist) + " = " + this.s_value;
}
NodeInAlistDAG.prototype.BuildGraph = function (visited, row_lengths)
{
    for (var j = 1 ; j < this.alist.length ; ++j)
    {
        if (this.alist[j] > 1)
        {
            var next = [].concat(this.alist);
            ++ next[j-1];
            -- next[j];

            var dag = new NodeInAlistDAG (row_lengths [this.level+1], this.level+1, next);
            this.next.push (dag);

            if (! visited.hasOwnProperty (dag.key))
            {
                visited [dag.key] = dag;
                ++row_lengths [dag.level];
                dag.BuildGraph (visited, row_lengths);
            }
        }
    }
}
NodeInAlistDAG.CreateAListDAG = function (m, n)
{
    // We start with the list [1,1,1,...m-n-1] and iterate down to [m-n-1,...,1,1,1]
    var start_list = [];
    var num_rows = (n-1)*(m - n) + 1;
    var row_lengths = new Array(num_rows);

    for (var i = 0 ; i < num_rows ; ++i)
    {
        row_lengths [i] = 0;
    }

    for (var i = 0 ; i < n ; ++i)
    {
        start_list.push(1);
    }
    start_list [n-1] = m - n + 1;

    var visited = {};
    var start = new NodeInAlistDAG (0, 0, start_list);

    visited [start.key] = start;
    ++row_lengths [start.level];
    start.BuildGraph (visited, row_lengths);

    return [visited, row_lengths];
}



