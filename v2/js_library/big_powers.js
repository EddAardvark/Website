//-------------------------------------------------------------------------------------------------
// Stores arbitrary large unsigned integers as a set of smaller ones (base 100000000)
// (c) John Whitehouse 2022
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

BigPowers = function ()
{
}

BigPowers.instances = {};

// Return a^n

BigPowers.GetPower = function (a, n)
{
    var k = "X"+a;

    if (! BigPowers.instances.hasOwnProperty (k))
    {
        var bp = new BigPowers ();
        
        bp.base = a;        
        bp.values = [];
        bp.values [0] = VLUInt.FromInt (1);
        
        BigPowers.instances[k] = bp;
    }
    
    return VLUInt.FromVLUInt (BigPowers.instances[k].GetPower (n));
}

BigPowers.prototype.GetPower = function (n)
{    
    this.Reserve (n);
        
    return this.values [n];
}

BigPowers.prototype.Reserve = function (n)
{    
    var i = this.values.length;
    
    for (i = this.values.length; i <= n ; ++i)
    {
        this.values [i] = this.values [i-1].MultiplyInt (this.base);
    }
}
