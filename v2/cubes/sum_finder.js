
//-------------------------------------------------------------------------------------------------
// Looks for solutions to the equation x^3 + y^3 - z^3 = n
//
// (c) John Whitehouse 2013 - 2019
// www.eddaardvark.co.uk
//
// Uses vlint.js
//-------------------------------------------------------------------------------------------------

CFSolution = function (x,y,z,t,d)
{
    this.x = x;
    this.y = y;
    this.z = z;
    this.d = d;
    this.t = t;
}
CFSolution.prototype.normalise = function ()
{
    if (this.x < this.y)
    {
        var t = this.x;
        this.x = this.y;
        this.y = t;
    }
    if (this.y < this.z)
    {
        var t = this.y;
        this.y = this.z;
        this.z = t;
    }
    if (this.x < this.y)
    {
        var t = this.x;
        this.x = this.y;
        this.y = t;
    }
}
CFSolution.prototype.getValue = function () 
{
    return this.x * this.x * this.x +
            this.y * this.y * this.y +
            this.z * this.z * this.z;
}
CFSolution.prototype.getText = function () 
{
    var sum = this.getValue ();
    
    var op2 = (this.y > 0) ? "+" + this.y : this.y;
    var op3 = (this.z > 0) ? "+" + this.z : this.z;
    var op4 = (sum > 0) ? sum : "&minus;" + -sum;
    return "n+z^3=" + this.t + ", d = " + this.d + ", Solution: " + this.x + "^3" + op2 + "^3" + op3 + "^3" + "=" + op4;
}
CFSolution.prototype.getKey = function () 
{
    var x = this.x;
    var y = this.y;
    var z = this.z;
    
    if (x < y)
    {
        var t = x;
        x = y;
        y = t;
    }
    if (y < z)
    {
        var t = y;
        y = z;
        z = t;
    }
    if (x < y)
    {
        var t = x;
        x = y;
        y = t;
    }
    return "C" + x + "," + y + "," + z;
}

// Find solutions
CubeSunFinder = function (target, limit)
{
    this.result = [];
        
    if (target%9 == 4 || target%9 == 5)
    {
        return ret; // these cases aren't possible
    }
        
    for (var z = 1 ; z <= limit ; ++z)
    {
        var t = target+z*z*z;
        
        if (t < 0) continue;    // For negative targets
        
        var max_d = Math.floor (Math.pow (4*t,1/3));
        var dvals = Primes.GetFactorsLessThan (t, max_d+1);
                    
        for (var j in dvals)
        {
            var d = dvals[j];
            var a = 3;
            var b = -3 * d;
            var c = (d*d-t/d);
            var b2 = b*b-4*a*c;
            
            var sr = Math.round(Math.sqrt(b2));
            
            if (sr * sr == b2)
            {
                var x1 = (-b + sr);
                var x2 = (-b - sr);
                
                if (x1 % 6 == 0)
                {
                    this.result.push(new CFSolution(x1/6, d - x1/6, -z, t, d));
                }

                if (x2 % 6 == 0)
                {
                    this.result.push(new CFSolution(x2/6, d - x2/6, -z, t, d));
                }
            }
        }
    }
}
CubeSunFinder.prototype.normalise = function ()
{
    for (var i in this.result)
    {
        this.result[i].normalise();
    }
}

CubeSunFinder.prototype.getUnique = function ()
{
    var temp = {};
    var ret = [];
    
    for (var i in this.result)
    {
        temp [this.result[i].getKey()] = this.result[i];
    }
    var props = Object.getOwnPropertyNames(temp);
    for (var i in props)
    {
        ret.push (temp[props[i]]);
    }
    return ret;
}


