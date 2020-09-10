// Create a namespace
// Some functions in this file rely on "big_integers.js"


Log3Over2 = function () {}
Log3Over2.LOG_3_O_2 = Math.log (3) / Math.log (2);

// Uses BigUnsignedIntegers (big_integers.js)
// A/B is the starting approximation

Log3Over2.FindFactors = function (a, b, limit)
{
    var e = b;
    var f = a-1;
    var sequence = [];

    for (var i = 0 ; i < limit ; ++i)
    {
        var m = a + f;
        var n = b + e;

        var m2 = new BigUnsignedInt (2).Pow (m);
        var n2 = new BigUnsignedInt (3).Pow (n);

        sequence.push ([a,b,e,f]);

        if (m2.IsGreaterThan (n2))
        {
            a = m;
            b = n;
        }
        else
        {
            e = n;
            f = m;
        }
    }
    return sequence;
}
