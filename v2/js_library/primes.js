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

//-------------------------------------------------------------
Primes.CacheUpTo = function (maxp)
{
    var current_max = Primes.list [Primes.list.length-1];
    
    if (maxp < current_max) return;
    
    if (current_max % 6 == 1)
    {
        Primes.TryAdd (current_max + 4);
        next = current_max + 6;
    }
    else
    {
        next = current_max + 2;
    }
    
    while (Primes.list [Primes.list.length-1] <= maxp)
    {
        Primes.TryAdd (next);
        Primes.TryAdd (next+4);
        next += 6;
    }
}
//-------------------------------------------------------------
Primes.TryAdd = function (p)
{
    if (Primes.IsPrime (p))
    {
        Primes.list.push (p);
    }
}
//-------------------------------------------------------------
Primes.IsPrime = function (n)
{
    if (Primes.list.indexOf (n) >= 0) return true;
    
    var limit = Math.floor (Math.sqrt (n));

    Primes.CacheUpTo (limit);

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

    Primes.CacheUpTo (limit);

    for (var i in Primes.list)
    {
        var p = Primes.list [i];
        
        if (p > limit)
        {
            return [n];
        }
        if (n % p == 0)
        {
            return [p].concat (Primes.GetPrimeFactors (n/p));
        }
    }
    throw "too large";
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
    var ret = Primes.GAF2(n);
    ret.sort(function(a, b) {return a - b;});
    return ret;
}
//-------------------------------------------------------------
Primes.GAF2 = function (n)
{
    if (Primes.list.indexOf (n) >= 0) return [1,n];
    
    var limit = Math.floor (Math.sqrt (n));

    Primes.CacheUpTo (limit);

    for (var i in Primes.list)
    {
        var p = Primes.list [i];
        
        if (p > limit)
        {
            return [n];
        }
        if (n % p == 0)
        {
            var list = Primes.GAF2 (n/p);
            var more = [];
            
            for (var j in list)
            {
                var q = p * list[j];
                if (list.indexOf(q) < 0)
                {
                    more.push(q);
                }
            }
            
            return list.concat (more);
        }
    }
    throw "too large";
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



    
