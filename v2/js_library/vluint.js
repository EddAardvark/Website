//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
// Stores arbitrary large unsigned integers as a set of smaller ones (base 100000000)
// (c) John Whitehouse 2022
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

VLUInt = function ()
{
    this.value = [0];
}

VLUInt.DIGITS = 8;
VLUInt.BASE = 100000000; // 10^DIGITS
VLUInt.PREFIX = "0000000000";

VLUInt.powers2 = [];

// Expects n to be positive

VLUInt.FromInt = function (n)
{
    var ret = new VLUInt ();
    var idx = 0;
    ret.value [idx] = n % VLUInt.BASE;
    
    n = Math.floor (n / VLUInt.BASE);
    
    while (n > 0)
    {
        ret.value [++idx] = n % VLUInt.BASE;
        n = Math.floor (n / VLUInt.BASE);
    }
    
    return ret;
}

VLUInt.FromVLUInt = function (other)
{
    var ret = new VLUInt ();
    ret.value = [... other.value];
    return ret;
}

VLUInt.FromText = function (text)
{
    var ret = new VLUInt ();
    var len = text.length;
    
    if (len > 0)
    {
        var rem = len % VLUInt.DIGITS;
        var blocks = Math.floor (len / VLUInt.DIGITS)

        if (rem == 0)
        {
            rem = VLUInt.DIGITS;
            -- blocks;
        }
        
        var pos = rem;
        
        ret.value [blocks] = parseInt (text.substr (0, pos));
        
        while (blocks > 0)
        {
            --blocks;
            ret.value [blocks] = parseInt (text.substr (pos, VLUInt.DIGITS));
            pos += VLUInt.DIGITS;        
        }
    }
    
    return ret;
}

//--------------------------------------------------------------------------------------------
VLUInt.prototype.TestSmall = function (target)
{
    return this.value.length == 1 && this.value [0] < target;    
}
//--------------------------------------------------------------------------------------------
VLUInt.prototype.IsZero = function () 
{
    return this.value.length == 0 || (this.value.length == 1 && this.value[0] == 0);
}
//--------------------------------------------------------------------------------------------
// Multiply by a simple integer (inaccurate if num > max safe int / BASE)
//--------------------------------------------------------------------------------------------
VLUInt.prototype.MultiplyInt = function (num)
{
    var ret = new VLUInt (); 

    if (num <= 0 || this.IsZero())
    {
        return new VLUInt.FromInt (0);
    }

    var carry = 0;
    
    num = Math.floor (num);

    for (var i = 0 ; i < this.value.length ; ++i)
    {
        var v = this.value[i] * num + carry;
        carry = Math.floor (v / VLUInt.BASE);
        ret.value[i] = v % VLUInt.BASE;
    }

    var pos = this.value.length;

    while (carry > 0)
    {
        ret.value[pos] = carry % VLUInt.BASE;
        carry = Math.floor (carry / VLUInt.BASE);
        ++pos;
    }

    return ret;
}
//--------------------------------------------------------------------------------------------
// Multiply by a another big integer
//--------------------------------------------------------------------------------------------
VLUInt.prototype.Multiply = function (other)
{
    var ret = new VLUInt ();

    if (other.IsZero() || this.IsZero())
    {
        return ret;
    }

    var len1 = this.value.length;
    var len2 = other.value.length;
    var len = len1 + len2;
    
    for (var i = 0; i < len; ++i)
    {
        ret.value[i] = 0;
    }        

    for (var i = 0; i < len1; ++i)
    {
        var v1 = this.value[i];

        for (var j = 0; j < len2; ++j)
        {
            var v2 = v1 * other.value[j];
            var pos = i + j;
            ret.value[pos] += v2;
        }
    }

    for (var i = 0 ; i < len-1 ; ++i)
    {
        ret.value[i + 1] += Math.floor (ret.value[i] / VLUInt.BASE);
        ret.value[i] %= VLUInt.BASE;
    }

    while (ret.value.length > 1 && ret.value [ret.value.length -1] == 0)
    {
        ret.value.pop ();
    }
    
    return ret;
}
//--------------------------------------------------------------------------------------------
// Add a simple number (this number is truncated to an integer)
//--------------------------------------------------------------------------------------------
VLUInt.prototype.AddInt = function (num)
{
    if (num <= 0)
    {
        return new VLUInt ();
    }

    var ret = VLUInt.FromVLUInt (this);

    var carry = Math.floor (num);
    var idx = 0;

    ret.value [idx] = ret.value [idx] + carry;
        
    while (ret.value [idx] >= VLUInt.BASE)
    {    
        carry = Math.floor (ret.value [idx] / VLUInt.BASE);
        ret.value [idx] %= VLUInt.BASE;
        
        ++idx;
        
        if (idx == ret.value.length)
        {
            ret.value [idx] = carry;
        }
        else
        {
            ret.value [idx] += carry;
        }
    }

    return ret;
}
//--------------------------------------------------------------------------------------------
// Subtract a simple number
//--------------------------------------------------------------------------------------------
VLUInt.prototype.SuntractInt = function (num)
{
    if (num < 0)
    {
        throw "value must be positive";
    }

    var n = VLUInt.FromInt (num);

    this.Subtract (n);
}
//--------------------------------------------------------------------------------------------
// increment (in place)
//--------------------------------------------------------------------------------------------
VLUInt.prototype.Increment = function ()
{
    if (this.IsZero())
    {
        this.value = [1];
        return;
    }

    ++this.value[0];
    var idx = 0;
    
    while (this.value [idx] == VLUInt.BASE)
    {
        this.value [idx] = 0;
        ++idx;
        ++this.value [idx];
    }
}
//--------------------------------------------------------------------------------------------
// Pre decrement (in place)
//--------------------------------------------------------------------------------------------
VLUInt.prototype.Decrement = function ()
{
    if (this.IsZero())
    {
        throw "Can't decrement zero";
    }

    --this.value[0];
    var idx = 0;
    
    while (this.value [idx] < 0)
    {
        this.value [idx] += VLUInt.BASE;
        ++ idx;
        --this.value [idx];
    }
    
    while (this.value.length > 1 && this.value [this.value.length -1] == 0)
    {
        this.value.pop ();
    }
}
//--------------------------------------------------------------------------------------------
// Add
//--------------------------------------------------------------------------------------------
VLUInt.prototype.Add = function (other)
{
    var ret = new VLUInt ();

    var len1 = this.value.length;
    var len2 = other.value.length;
    var len = Math.max(len1, len2);

    var carry = 0;

    for (var i = 0; i < len; ++i)
    {
        var sum = carry;

        if (i < len1) sum += this.value[i];
        if (i < len2) sum += other.value[i];

        ret.value[i] = sum % VLUInt.BASE;
        carry = Math.floor (sum / VLUInt.BASE);
    }

    if (carry > 0)
    {
        ret.value[len] = carry;
    }
    return ret;
}
//--------------------------------------------------------------------------------------------
// Subtract
//--------------------------------------------------------------------------------------------
VLUInt.prototype.Subtract = function (other)
{
    // Expects vec1 >= vec2, values are stored low word first

    var ret = new VLUInt ();
    var carry = 0;

    if (this.value.length < other.value.length)
    {
        throw "Subtraction would result in negative result";
    }
    
    for (var pos = 0 ; pos < this.value.length ; ++pos)
    {
        ret.value [pos] = this.value [pos];
        
        if (pos < other.value.length)
        {
            ret.value [pos] -= other.value [pos];
        }
        ret.value [pos] -= carry;
        carry = 0;
        
        if (ret.value [pos] < 0)
        {
            ret.value [pos] += VLUInt.BASE;
            carry = 1;
        }
    }
    
    while (ret.value.length > 1 && ret.value[ret.value.length - 1] == 0)
    {
        ret.value.pop ();
    }
    return ret;
}
//--------------------------------------------------------------------------------------------
// Compare, returns -1, 0 or 1 for (first < second), (first == second) and (first > second)
//--------------------------------------------------------------------------------------------
VLUInt.Compare = function (first, second)
{
    if (first.value.length != second.value.length)
    {
        return (first.value.length > second.value.length) ? 1 : -1;
    }

    for (var i = first.value.length - 1; i >= 0; --i)
    {
        if (first.value[i] != second.value[i])
        {
            return (first.value[i] > second.value[i]) ? 1 : -1;
        }
    }

    return 0;     
}
//--------------------------------------------------------------------------------------------
// returns the minimum (by reference)
//--------------------------------------------------------------------------------------------
VLUInt.Min = function (first, second)
{
    return (VLUInt.Compare(first, second) > 0) ? second : first;
}
//--------------------------------------------------------------------------------------------
// returns the maximum (by reference)
//--------------------------------------------------------------------------------------------
VLUInt.Max = function (first, second)
{
    return (VLUInt.Compare(first, second) > 0) ? first : second;
}
//--------------------------------------------------------------------------------------------
VLUInt.prototype.GreaterThan = function (other)
{
    return VLUInt.Compare(this, other) > 0;
}
//--------------------------------------------------------------------------------------------
VLUInt.prototype.GreaterThanOrEqual = function (other)
{
    return VLUInt.Compare(this, other) >= 0;
}
//--------------------------------------------------------------------------------------------
VLUInt.prototype.LessThan = function (other) 
{
    return VLUInt.Compare(this, other) < 0;
}
//--------------------------------------------------------------------------------------------
VLUInt.prototype.LessThanOrEqual = function (other) 
{
    return VLUInt.Compare(this, other) <= 0;
}
//--------------------------------------------------------------------------------------------
VLUInt.prototype.EqualTo = function (other) 
{
    
    if (first.value.length != second.value.length)
    {
        return false;
    }

    for (var i = 0 ; i < first.value.length ; ++i)
    {
        if (first.value[i] != second.value[i])
        {
            return false;
        }
    }

    return true;    
}
//--------------------------------------------------------------------------------------------
VLUInt.prototype.NotEqualTo = function (other) 
{
    return VLUInt.Compare(this, other) != 0;
}
//--------------------------------------------------------------------------------------------
VLUInt.prototype.Mod2 = function()
{
    return (this.value.length > 0) ? (this.value[0] % 2) : 0;
}
//--------------------------------------------------------------------------------------------
VLUInt.prototype.Mod3 = function()
{
    if (this.value.length == 0)
    {
        return 0;
    }

    var sum = this.value[0];

    for (var i = 1; i < this.value.length; ++i)
    {
        sum += this.value[i];
    }
    return sum % 3;
}
//--------------------------------------------------------------------------------------------
VLUInt.prototype.Mod4 = function ()
{
    return (this.value.length > 0) ? (this.value[0] % 4) : 0;
}
//--------------------------------------------------------------------------------------------
VLUInt.prototype.Mod5 = function ()
{
    return (this.value.length > 0) ? (this.value[0] % 5) : 0;
}
//--------------------------------------------------------------------------------------------
VLUInt.prototype.Mod8 = function ()
{
    return (this.value.length > 0) ? (this.value[0] % 8) : 0;
}
//--------------------------------------------------------------------------------------------
VLUInt.prototype.Mod9 = function ()
{
    if (this.value.length == 0)
    {
        return 0;
    }

    var sum = this.value[0];

    for (var i = 1; i < this.value.length; ++i)
    {
        sum += this.value[i];
    }
    return sum % 9;
}
//--------------------------------------------------------------------------------------------
VLUInt.prototype.Mod10 = function ()
{
    return (this.value.length > 0) ? (this.value[0] % 10) : 0;
}
//--------------------------------------------------------------------------------------------
VLUInt.prototype.Mod16 = function ()
{
    return (this.value.length > 0) ? (this.value[0] % 16) : 0;
}
//--------------------------------------------------------------------------------------------
// Divide by an integer (< BASE)
VLUInt.prototype.DivideInt = function (number)
{
    return this.DivMod(number)[0];
}
VLUInt.prototype.ModuloInt = function (number)
{
    return DivMod(number)[1];
}

VLUInt.prototype.DivMod = function (number)
{
    if (number <= 0 || number > VLUInt.BASE)
    {
        return [0,0];
    }
    
    var temp = VLUInt.FromVLUInt (this);
    var rem = 0;

    for (var i = temp.value.length - 1; i >= 0; --i)
    {
        rem = temp.value[i] % number;

        temp.value[i] = Math.floor (temp.value[i] / number);

        if (i > 0)
        {
            temp.value[i - 1] += VLUInt.BASE * rem;
        }
    }
    
    while (temp.value.length > 1 && temp.value[temp.value.length - 1] == 0)
    {
        temp.value.pop ();
    }

    return [temp,rem];
}
// Divide, this/other, returns a VLUInt

VLUInt.prototype.Divide = function (other)
{
    if (other.IsZero())
    {
        throw "Divide by zero";
    }

    var n = VLUInt.Compare (this, other);

    if (n < 0)
    {
        return new VLUInt();
    }

    if (n == 0)
    {
        return VLUInt.FromInt(1);
    }

    var num = VLUInt.FromVLUInt (this);
    var den = other;
    var subs = [];
    var answer = new VLUInt ();
    var pos = 0;

    subs.push (den);

    // We will subtract out powers of 2 times the divisor

    while (VLUInt.Compare (num, subs[pos]) > 0)
    {
        subs.push(subs[pos].MultiplyInt (2));        // denominator x 2^n
        ++pos;
    }

    VLUInt.PreparePowers(subs.length);

    while (pos >= 0)
    {
        if (VLUInt.Compare (num, subs[pos]) >= 0)
        {
            answer = answer.Add (VLUInt.powers2[pos]);
            num = num.Subtract (subs[pos]);
        }
        --pos;
    }

    return answer;
}
// Divide, this/other, returns two VLUInts (factor and remainder)

VLUInt.prototype.DivdeWithRemainder = function (other)
{
    if (other.IsZero())
    {
        throw "Divide by zero";
    }

    var n = VLUInt.Compare (this, other);

    if (n < 0)
    {
        return [new VLUInt(),VLUInt.FromVLUInt (this)];
    }

    if (n == 0)
    {
        return [VLUInt.FromInt(1),VLUInt.FromInt(0)];
    }

    var num = VLUInt.FromVLUInt (this);
    var den = other;
    var subs = [];
    var answer = new VLUInt ();
    var pos = 0;

    subs.push (den);

    // We will subtract out powers of 2 times the divisor

    while (VLUInt.Compare (num, subs[pos]) > 0)
    {
        subs.push(subs[pos].MultiplyInt (2));        // denominator x 2^n
        ++pos;
    }

    VLUInt.PreparePowers(subs.length);

    while (pos >= 0)
    {
        if (VLUInt.Compare (num, subs[pos]) >= 0)
        {
            answer = answer.Add (VLUInt.powers2[pos]);
            num = num.Subtract (subs[pos]);
        }
        --pos;
    }

    return [answer,num];
}

// Saves recalculating these every time we do a division

VLUInt.PreparePowers = function (n)
{
    var len = VLUInt.powers2.length;
    
    if (len == 0)
    {
        VLUInt.powers2[0] = new VLUInt.FromInt (1);
        len = 1;
    }

    if (n > len)
    {
        for (var i = VLUInt.powers2.length; i < n; ++i)
        {
            VLUInt.powers2 [i] = VLUInt.powers2[i - 1].MultiplyInt (2); // 2^n
        }
    }
}

// Calculates this^n (n is a positive integer, doesn't do fractional or negative powers)

VLUInt.prototype.Pow = function (n)
{
    if (n < 1) return VLUInt.FromInt(1);

    var bits = [];
    var p = VLUInt.FromVLUInt (this);

    while (true)
    {
        if (n % 2 == 1)
        {
            bits.push (p);
        }
        n = Math.floor (n / 2);

        if (n < 1) break;

        p = p.Square ();
    }

    var ret = bits[0];

    for (var i = 1; i < bits.length; ++i)
    {
        ret = ret.Multiply (bits[i]);
    }

    return ret;
}
//------------------------------------------------------------------------------------------------------
// Convert to f * 10^n (ignores the sign)

VLUInt.prototype.MantissaExponent = function()
{
    if (this.IsZero())
    {
        throw "Log 0";
    }
    var len = this.value.length;
    var exponent = VLUInt.DIGITS * len;
    var mantissa = this.value[len - 1] / VLUInt.BASE;

    if (this.value.length > 1)
    {
        mantissa += this.value[len - 2] / VLUInt.BASE / VLUInt.BASE;

        if (this.value.length > 2)
        {
            mantissa += this.value[len - 3] / VLUInt.BASE / VLUInt.BASE / VLUInt.BASE;
        }
    }

    while (mantissa < 1)
    {
        mantissa *= 10;
        exponent--;
    }

    return [mantissa, exponent];
}
//------------------------------------------------------------------------------------------------------
// Log base 10
VLUInt.prototype.Log10 = function()
{
    var me = this.MantissaExponent();

    return me[1] + Math.log10(me[0]);
}
//------------------------------------------------------------------------------------------------------
VLUInt.Ratio = function (b1, b2)
{
    var m1 = b1.MantissaExponent();
    var m2 = b2.MantissaExponent();

    return (m1[0] / m2[0]) * Math.pow(10, (m1[1] - m2[1]));
}
//------------------------------------------------------------------------------------------------------
VLUInt.prototype.Reciprocal = function ()
{
    var x = this.Log10 ();
    return Math.pow (10, -x);
}
//------------------------------------------------------------------------------------------------------
VLUInt.prototype.ToFloat = function ()
{
    var x = this.MantissaExponent ();
    return x[0] * Math.pow (10, x[1]);
}
//------------------------------------------------------------------------------------------------------
VLUInt.prototype.Square = function ()
{
    return this.Multiply (this);
}
//------------------------------------------------------------------------------------------------------
VLUInt.prototype.Cube = function ()
{
    return this.Multiply (this).Multiply (this);
}
//------------------------------------------------------------------------------------------------------
VLUInt.prototype.CubeRoot = function ()
{
    var me = MantissaExponent();

    while (me.second % 3 != 0)
    {
        --me.second;
        me.first *= 10;
    }

    return pow(me.first, 1.0 / 3.0) * pow(10, me.second / 3);
}
//------------------------------------------------------------------------------------------------------

VLUInt.prototype.ToInt = function ()
{
    if (this.value.length == 0) return 0;

    var f = this.value[0];

    for (var i = 1; i < this.value.length; ++i)
    {
        f = f * VLUInt.BASE + this.value[i];

        if (f > Number.MAX_SAFE_INTEGER)
        {
            throw "Overflow";
        }
    }

    return Math.floor (f);
}
//=========================================================================================================
// Monitoring and Testing
//=========================================================================================================
VLUInt.prototype.toString = function ()
{
    var len = this.value.length;

    if (len == 0)
    {
        return "0";
    }

    var ret = this.value[len-1].toString ();

    for (var i = len-2 ; i >= 0 ; --i)
    {
        ret += (VLUInt.PREFIX + this.value[i]).substr(-VLUInt.DIGITS, VLUInt.DIGITS);
    }
    
    return ret;
}
//------------------------------------------------------------------------------------------------------

VLUInt.Test = function ()
{
// AddInt

    var to_add = [1, 5, 9, 10, 12, 24, 33, 111, 9999999]
    var start = [0, 99, 9999999];

// Basic Addition

    for (var i in start)
    {
        var x = start[i];
        var vlx = VLUInt.FromInt(x);

        if (vlx.ToInt() != x)
        {
            var text = "Initialise vlx " + start[i] +  " returned " + vlx;
            throw text;
        }

        for (var j in to_add)
        {
            var was = x;
            x += to_add[j];
            vlx = vlx.AddInt(to_add[j]);

            if (vlx.ToInt() != x)
            {
                var text = "Add: " + was + " + " + to_add[j] + ", got " + vlx + ", expected " + x;
                throw text;
            }
        }
    }
    
// Powers and big Addition and Subtraction

    var ten = VLUInt.FromInt(10);
    var ten49 = ten.Pow(49);
    var ten73 = ten.Pow(73);

    var sum1 = ten49.Add(ten73);
    var sum2 = ten73.Add(ten49);
    var diff = ten73.Subtract(ten49);
    
    if (ten49.toString() != "10000000000000000000000000000000000000000000000000")
    {
        var text = "10^49 = " + ten49.toString ();
        throw text;
    }
    
    if (ten73.toString() != "10000000000000000000000000000000000000000000000000000000000000000000000000")
    {
        var text = "10^73 = " + ten73.toString ();
        throw text;
    }
    
    if (! sum1.EqualTo(sum2))
    {
        var text = "10^73 = " + ten73.toString ();
        throw text;
    }
    
    if (sum1.toString () != "10000000000000000000000010000000000000000000000000000000000000000000000000")
    {
        var text = "10^73 + 10^49 = " + sum1.toString ();
        throw text;
    }
    
    if (diff.toString () != "9999999999999999999999990000000000000000000000000000000000000000000000000")
    {
        var text = "10^73 + 10^49 = " + diff.toString ();
        throw text;
    }
    
// Simple division

    var result = VLUInt.FromInt(1000000).DivideInt (7);
    var target = Math.floor (1000000/7);

    if (result.ToInt() != target)
    {
        var text = "Div: 1000000/(int)7 = " + target + ", got " + result;
        throw text;
    }
    
    var result = VLUInt.FromInt(1000000).Divide (VLUInt.FromInt(7));

    if (result.ToInt() != target)
    {
        var text = "Div: 1000000/7 = " + target + ", got " + result;
        throw text;
    }
    
// Big vivision
    
    var ten24 = ten73.Divide(ten49);    
    
    if (ten24.toString() != "1000000000000000000000000")
    {
        var text = "Div: 10^24 = " + ten24.toString ();
        throw text;
    }

// Factorials

    var f40 = "815915283247897734345611269596115894272000000000";
    var fn = [];

    fn[0] = VLUInt.FromInt(1);

    for (var i = 1; i <= 40; ++i)
    {
        fn[i] = fn[i - 1].MultiplyInt (i);
    }

    if (fn[40].toString() != f40)
    {
        var text = "Factorial 40: " + fn[40] + " != 815915283247897734345611269596115894272000000000";
        throw text;
    }

// Factorials (multiply by VLUInt)

    var fact = VLUInt.FromInt (1);

    for (var i = 1; i <= 40; ++i)
    {
        fact = fact.Multiply (VLUInt.FromInt (i));

        if (fact.NotEqualTo (fn[i]))
        {
            var text = "Factorial [" + i + "], " + fact + " != " + fn[i];
            throw text;
        }
    }

// Division by VLUInt

    for (var i = 0; i < 40; ++i)
    {
        var n = 40 - i;

        fact = fact.Divide (VLUInt.FromInt (n));

        if (fact.NotEqualTo (fn[n - 1]))
        {
            var text = "Factorial Division [" + i + "], " + fact + " != " + fn[n - 1];
            throw text;
        }
    }

// Cubes, Mod 9, Mod 3 + increment

    var vli = VLUInt.FromInt(1000000);
    var mod9 = [ 0, 1, 8 ];

    for (var i = 0; i < 40; ++i)
    {
        var c = vli.Cube();
        var m9 = c.Mod9();
        var m3 = vli.Mod3();

        if (m9 != mod9[m3])
        {
            var text = "Modulo test: " + vli + " cubed = " + c + ", mod 9 = " + m9 + ", mod 3 = " + m3;
            throw text;
        }

        vli.Increment ();
    }

// Decrement

    vli = VLUInt.FromInt(100000020);

    for (var i = 0; i < 40; ++i)
    {
        vli.Decrement ();
    }

    if (vli.ToInt() != 99999980)
    {
        var text = "Decrement test: " + vli + " != 1000000";
        throw text
    }

// Log 10

    vli = VLUInt.FromInt(2);
    var log2 = Math.log10(2.0);
    var log2b = vli.Log10 ();
    
    var check = log2 - log2b;
    
    if (Math.abs (check) > 1e-10)
    {
        var text = "Log10 (2): " + log2 + " != " + log2b;
        throw text
    }

    vli = VLUInt.FromInt(1);
    
    for (var i = 0; i < 40; ++i)
    {
        var l2 = vli.Log10();
        var ipart = Math.round(l2);
        var fpart = l2 - ipart;
        var ifpart = Math.floor (fpart * 100000000);

        if (ifpart != 0 || ipart != i)
        {
            var text = "Power test: " + "Log (" + vli + ") = " + l2 + ": expected " + ipart + " == " + i + " and " + ifpart + " == " + check;
            throw text;
        }
        vli = vli.MultiplyInt(10);
    }

// Ratio & Pow, should give 1.099511627776

    var two = VLUInt.FromInt(2);
    var ten = VLUInt.FromInt(10);

    var rcheck = 99511627776;

    ten = ten.Pow(12);
    two = two.Pow(40);

    var rat = VLUInt.Ratio(two, ten);
    var rchk2 = Math.floor((rat - 1) * 1000000000000);

    if (rcheck != rchk2)
    {
        var text = "Ratio test: " + two + " / " + ten + " = " + rat + " (" + rcheck + " != " + rchk2 + ") ";
        throw text;
    }

// Finished

    Misc.Alert ("VLUInt: All tests passed.");
}
