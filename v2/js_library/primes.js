// ================================================================================================
// Prime numbers
// (c) John Whitehouse 2021
// www.eddaardvark.co.uk
// ================================================================================================

Primes = function () {}

Primes.list = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,
               107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,
               223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,
               337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,
               457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,
               593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,
               719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,
               857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,
               997];


// TODO: Review this...
//-------------------------------------------------------------
Primes.GetNextPrime = function ()
{
    var next = Primes.list [Primes.list.length-1];

    while (true)
    {
        next = (next % 6 == 1) ? next + 4 : next + 2;

        if (Primes.IsPrime (next))
        {
            Primes.list.push (next);
            return next;
        }
    }
}
//-------------------------------------------------------------
Primes.IsPrime = function (n)
{
    if (Primes.list.indexOf (n) >= 0) return true;
    
    var limit = Math.floor (Math.sqrt (n));

    for (var i in Primes.list)
    {
        var p = Primes.list [i];
        
        if (p > limit)
        {
            return true;
        }
        if (n % p == 0)
        {
            return false;
        }
    }
    throw "too large";
}
//-------------------------------------------------------------
Primes.GetPrimeFactors = function (n)
{
    if (Primes.list.indexOf (n) >= 0) return [n];
    
    var limit = Math.floor (Math.sqrt (n));
    var ret = [];

    for (var i in Primes.list)
    {
        var p = Primes.list [i];
        
        if (p > limit)
        {
            ret.push (n);
            return ret;
        }
        while (n % p == 0)
        {
            ret.push (p);
            n = n / p;

            if (n == 1) return;
            limit = Math.floor (Math.sqrt (n));
        }
    }
    while (true)
        {
            p = Primes.GetNextPrime ();
        }
}
//-------------------------------------------------------------
Primes.GetUniquePrimeFactors = function (n)
{
    if (Primes.list.indexOf (n) >= 0) return [n];
    
    var limit = Math.floor (Math.sqrt (n));

    Primes.CacheUpTo (limit);
    
    for (var i in Primes.list)
    {
        var p = Primes.list [i];
        
        if (p > limit || p >= less_than)
        {
            return [n];
        }
        if (n % p == 0)
        {
            var list = Primes.GetUniquePrimeFactors (n/p);
            
            return (list[0] == p) ? list : ([p].concat (list));
        }
    }
    throw "too large";
}
//-------------------------------------------------------------
Primes.GetAllFactors = function (n)
{
    var primes = Primes.GetPrimeFactors (n);
    var ret =  Primes.UniqueProducts (primes);
    
    ret.sort(function(a, b) {return a - b;});
    return ret;
}
//-------------------------------------------------------------
Primes.UP0 = function (list)
{
    if (list.length == 0) return [];

    var ret = [];
    
    for (var idx in list)
    {
        if (ret.indexOf (list[idx]) < 0)
        {
            ret.push(list[idx]);
        }
    }
    
    var first = list [0];

    if (list.length > 1)
    {
        var sub_list = list.slice(1);
        
        for (var idx in sub_list)
        {
            var n = first * sub_list[idx];
            
            if (ret.indexOf (n) < 0)
            {
                ret.push(n);
            }
        }
        
        var unique = Primes.UniqueProducts (sub_list);
        
        for (var idx in unique)
        {
            var n = first * unique [idx];
            if (ret.indexOf (n) < 0)
            {
                ret.push(n);
            }
        }
    }
    return ret;
}

//-------------------------------------------------------------
Primes.UniqueProducts = function (list)
{
    if (list.length == 0) return [];

    var first = list [0];
    var sub_list = list.slice(1);
    var ret = [1, first];
    var unique = Primes.UniqueProducts (sub_list);
        
    for (var idx in unique)
    {
        var n = unique[idx];
        var n2 = first * n;

        if (ret.indexOf (n) < 0)
        {
            ret.push(n);
        }
        if (ret.indexOf (n2) < 0)
        {
            ret.push(n2);
        }
    }
    return ret;
}

    
    
//-------------------------------------------------------------
Primes.GetFactorsLessThan = function (n, less_than)
{
    var ret = Primes.GFLT2(n, less_than);
    ret.sort(function(a, b) {return a - b;});
    return ret;
}
//-------------------------------------------------------------
Primes.GFLT2 = function (n, less_than)
{
    if (Primes.list.indexOf (n) >= 0)
    {
        return (n < less_than) ? [1,n] : [1];
    }
    
    //var limit = Math.floor (Math.sqrt (n));

    Primes.CacheUpTo (less_than);

    for (var i in Primes.list)
    {
        var p = Primes.list [i];
        
        if (p > less_than)
        {
            return [];
        }
        if (n % p == 0)
        {
            var list = Primes.GFLT2 (n/p, less_than);
            var more = [];
            
            for (var j in list)
            {
                var q = p * list[j];
                if (q < less_than && list.indexOf(q) < 0)
                {
                    more.push(q);
                }
            }
            
            return list.concat (more);
        }
    }
    throw "too large";
}

//-------------------------------------------------------------------------------------------------
// Get the highest common factor
//-------------------------------------------------------------------------------------------------
Primes.hcf = function (x, y)
{
    x = Math.round (x);
    y = Math.round (y);

    if (x < 0) x = -x;
    if (y < 0) y = -y;

    return Primes.hcf2 (x, y)
}
Primes.hcf2 = function (x, y)
{
    if (x == 0) return y;
    if (y == 0) return x;
    if (x == 1 || y == 1) return 1;
    if (x == y) return x;

    return (x > y) ? Primes.hcf2 (x%y,y) : Primes.hcf2 (x,y%x);
}
//---------------------------------------------------------------------------------------------------
Primes.Test = function ()
{
    if (Primes.hcf (3,4) != 1) throw "hcf (3,4) != 1";
    if (Primes.hcf (3,6) != 3) throw "hcf (3,4) != 3";
    if (Primes.hcf (10000000,3) != 1) throw "hcf (10000000,3) != 1";
    if (Primes.hcf (80000100,9) != 9) throw "hcf (hcf (80000100,9) != 9";
    if (Primes.hcf (80000100,9*11*13) != 9) throw "hcf (80000100,9*11*13) != 9";
    
    var n = 2 * 2 * 3 * 5 * 5 * 97 * 101 * 101 * 101 * 103;
    var factors = Primes.GetPrimeFactors (n);
    var fs = factors.toString ();    
    if (fs != "2,2,3,5,5,97,101,101,101,103") throw "prime factors (" + n + ") != 2,2,3,5,5,97,101,101,101,103";

    factors = Primes.GetAllFactors (28);
    fs = factors.toString ();    
    if (fs != "1,2,4,7,14,28") throw "factors (28) != 1,2,4,7,14,28";

    var expected = [
        1,
        2,3,5,7,11,
        2*3,2*5,2*7,2*11,3*5,3*7,3*11,5*7,5*11,7*11,
        2*3*5,2*3*7,2*3*11,2*5*7,2*5*11,2*7*11,3*5*7,3*5*11,3*7*11,5*7*11,
        2*3*5*7,2*3*5*11,2*3*7*11,2*5*7*11,3*5*7*11,
        2*3*5*7*11
    ];
    
    
    expected.sort(function(a, b) {return a - b;});

    factors = Primes.GetAllFactors (2*3*5*7*11);
    if (factors.toString () != expected.toString ())
    {
        throw factors.toString () + " != " + expected.toString ();
    }
}



    
