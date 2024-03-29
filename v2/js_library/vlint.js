//-------------------------------------------------------------------------------------------------
// Stores very large integers as a set of smaller ones (base 10000)
// (c) John Whitehouse 2019
// www.eddaardvark.co.uk
//
// None of the methods in this class alter the instance so it is safe to reuse them rather then having
// to clone when assigning.
//-------------------------------------------------------------------------------------------------

VLInt = function ()
{
}

// MAX_SAFE_INTEGER = 9007199254740991
// Base = biggest power of 10 <= sqrt (MAX)
// I want to work in powers of 10 so I'm doing the maths base 10^n, makes printing easier

VLInt.MAX_STRING_LEN = Number.MAX_SAFE_INTEGER.toString ().length - 1;
VLInt.EXP = Math.floor (VLInt.MAX_STRING_LEN / 2);
VLInt.BASE = Math.pow (10, VLInt.EXP); 
VLInt.PREFIX = "0000000000";
//----------------------------------------------------------------------------------------------------------------
VLInt.Initialise = function ()
{
    VLInt.ZERO = VLInt.MakeZero ();
    VLInt.ONE = VLInt.MakeOne ();
    VLInt.TWO = VLInt.FromInt (2);
    VLInt.THREE = VLInt.FromInt (3);
    VLInt.EIGHT = VLInt.FromInt (8);
    VLInt.powers2 = [VLInt.FromInt(1)];
}
//----------------------------------------------------------------------------------------------------------------
VLInt.MakeZero = function ()
{
    var ret = new VLInt ();
    
    ret.positive = true;
    ret.value = [0];
    return ret;
}
//----------------------------------------------------------------------------------------------------------------
VLInt.MakeOne = function ()
{
    var ret = new VLInt ();
    
    ret.positive = true;
    ret.value = [1];
    return ret;
}
//----------------------------------------------------------------------------------------------------------------
VLInt.FromInt = function (n)
{
    n = Math.round (n);
    var positive = (n >= 0);
    
    if (! positive) n = -n;
    
    var value = [];
    var i = 0;
    
    do
    {
        value [i++] = n % VLInt.BASE;
        n = Math.floor (n / VLInt.BASE);
    }
    while (n > 0);
    
    var ret = new VLInt ();
    
    ret.positive = positive;
    ret.value = value;
    return ret;
}
//--------------------------------------------------------------------------------------------
VLInt.FromVLInt = function (n)
{    
    var ret = new VLInt ();
    
    ret.positive = n.positive;
    ret.value = n.value.slice(0);
    return ret;
}
//--------------------------------------------------------------------------------------------
VLInt.FromVector = function (value, positive)
{    
    var ret = new VLInt ();
    
    ret.positive = positive;
    ret.value = value.slice(0);
    return ret;
}
//--------------------------------------------------------------------------------------------
VLInt.FromFloat = function (f)
{
    // Not very efficient

    var positive = f >= 0;
    
    if (! positive) f = -f;

    if (f < 1) return VLInt.FromInt (0);
    
    var text = "";
    
    while (f >= 1)
    {
        var digit = Math.floor (f) % 10;
        text = digit + text;
        f = f / 10;
    }
    
    if (! positive) text = "-" + text;
    
    return VLInt.FromString (text);
}
//--------------------------------------------------------------------------------------------
VLInt.FromString = function (str)
{    
    if (str.length <= VLInt.MAX_STRING_LEN)
    {
        return VLInt.FromInt (parseInt (str));
    }
    
    var positive = str [0] != '-';
    
    if (! positive)
    {
        str = str.splice (1);
    }

    var v = [];
    var len = str.length;
    
    while (len > 0)
    {
        if (len <= VLInt.EXP)
        {
            v.push (parseInt (str));
            break;
        }
        
        var s1 = str.substr (len - VLInt.EXP);
        var s2 = str.substr (0, len - VLInt.EXP);
        
        v.push (parseInt (s1));
        str = s2;
        len = len - VLInt.EXP;
    }
    
    return VLInt.FromVector (v, positive);
}
//-------------------------------------------------------------------------------------------------
VLInt.FromWeightings = function (n1, n2, w1, w2)
{
    // w2 * n1 + (n2 - n1) * w1
    
    var c = VLInt.Compare (n1, n2);
    var ret = n1.MultiplyInt (w2);
    
    if (c == 0) return ret;
    
    var diff = n2.Subtract (n1);
    
    diff = diff.MultiplyInt (w1);
    
    ret = ret.Add (diff);
    
    return ret;
}
//--------------------------------------------------------------------------------------------
// Multiply by a simple number (this number is truncated to an integer)
//--------------------------------------------------------------------------------------------
VLInt.prototype.MultiplyInt = function (num)
{
    if (num == 0 || this.IsZero ())
    {
        return VLInt.MakeZero (0);
    }
    
    num = Math.floor (num);

    var positive = this.positive;
    
    if (num < 0)
    {
        num = -num;
        positive = ! positive;
    }

    var carry = 0;
    var len = this.value.length;
    var vec = new Array (len);
    
    for (var i = 0 ; i < len ; ++i)
    {
        var v = this.value [i] * num + carry;
        carry = Math.floor (v / VLInt.BASE);
        vec [i] = v % VLInt.BASE;
    }
    
    while (carry > 0)
    {
        vec.push (carry % VLInt.BASE);
        carry = Math.floor (carry / VLInt.BASE);
    }
    
    return VLInt.FromVector (vec, positive);
}
//--------------------------------------------------------------------------------------------
// Multiply by a another big integer
//--------------------------------------------------------------------------------------------
VLInt.prototype.Multiply = function (other)
{
    if (other.IsZero () || this.IsZero ())
    {
        return VLInt.MakeZero ();
    }

    var vector = VLInt.MultiplyVectors (this.value, other.value);
    
    return new VLInt.FromVector (vector, this.positive == other.positive);
}
//--------------------------------------------------------------------------------------------
// Add a simple number (this number is truncated to an integer)
// TODO: Optimise using values directly
//--------------------------------------------------------------------------------------------
VLInt.prototype.AddInt = function (num)
{
    var n = VLInt.FromInt (num);

    return this.Add (n);
}
//--------------------------------------------------------------------------------------------
// Add a simple number (this number is truncated to an integer)
// TODO: Optimise using values directly
//--------------------------------------------------------------------------------------------
VLInt.prototype.SubtractInt = function (num)
{
    var n = VLInt.FromInt (num);

    return this.Subtract (n);
}
//--------------------------------------------------------------------------------------------
// Add 1 (in place)
//--------------------------------------------------------------------------------------------
VLInt.prototype.Increment = function ()
{
    if (this.IsZero())
    {
        this.positive = true;
        this.value = [1];
        return;
    }
    
    if (this.positive)
    {
        this.IncrementVector ();
        return;
    }

    this.DecrementVector ();
}
//--------------------------------------------------------------------------------------------
// Subtract 1 (in place)
//--------------------------------------------------------------------------------------------
VLInt.prototype.Decrement = function ()
{
    if (this.IsZero())
    {
        this.positive = false;
        this.value = [1];
        return;
    }
    
    if (this.positive)
    {
        this.DecrementVector ();
        return;
    }
    
    this.IncrementVector ();
}
//--------------------------------------------------------------------------------------------
// Add a simple number (this number is truncated to an integer)
//--------------------------------------------------------------------------------------------
VLInt.prototype.Add = function (other)
{
    if (other.positive == this.positive)
    {
        var vec = VLInt.AddVectors (this.value, other.value);
        return VLInt.FromVector (vec, this.positive);
    }
    
    var comp = VLInt.CompareVector (this.value, other.value);
    
    if (comp == 0)
    {
        return VLInt.FromVector ([0], true);
    }
    
    if (comp > 0)
    {
        var vec = VLInt.SubtractVectors (this.value, other.value);
        return VLInt.FromVector (vec, this.positive);
    }
    
    var vec = VLInt.SubtractVectors (other.value, this.value);
    return VLInt.FromVector (vec, other.positive);
}
//--------------------------------------------------------------------------------------------
// Add a simple number (this number is truncated to an integer)
//--------------------------------------------------------------------------------------------
VLInt.prototype.Subtract = function (other)
{
    if (other.positive != this.positive)
    {
        var vec = VLInt.AddVectors (this.value, other.value);
        return VLInt.FromVector (vec, this.positive);
    }
    
    var comp = VLInt.CompareVector (this.value, other.value);
    
    if (comp == 0)
    {
        return VLInt.FromVector ([0], true);
    }
    
    if (comp > 0)
    {
        var vec = VLInt.SubtractVectors (this.value, other.value);
        return VLInt.FromVector (vec, this.positive);
    }
    
    var vec = VLInt.SubtractVectors (other.value, this.value);
    return VLInt.FromVector (vec, ! other.positive);
}
//--------------------------------------------------------------------------------------------
VLInt.AddVectors = function (vec1, vec2)
{
    var len1 = vec1.length;
    var len2 = vec2.length;
    var len = Math.max(len1, len2);
    var ret = new Array (len);
    var carry = 0;

    for (i = 0 ; i < len ; ++i)
    {
        var sum = carry;
        if (i < vec1.length) sum += vec1[i];
        if (i < vec2.length) sum += vec2[i];
        
        ret[i] = sum % VLInt.BASE;
        carry = Math.floor (sum / VLInt.BASE);
    }
    
    if (carry > 0)
    {
        ret.push (carry);
    }
    
    return ret;
}
//--------------------------------------------------------------------------------------------
VLInt.prototype.IncrementVector = function ()
{
    var n = this.value.length - 1;
    ++this.value[0];
    
    for (var i = 0 ; i < n && this.value[i] == VLInt.BASE ; ++i)
    {
        this.value [i] = 0;
        ++this.value[i+1];
    }
    
    if (this.value[n] == VLInt.BASE)
    {
        this.value [n] = 0;
        this.value[n+1] = 1;
    }
}
//--------------------------------------------------------------------------------------------
VLInt.prototype.DecrementVector = function ()
{
    var n = this.value.length - 1;
    --this.value[0];
    
    for (var i = 0 ; i < n && this.value[i] < 0 ; ++i)
    {
        this.value [i] = VLInt.BASE - 1;
        --this.value[i+1];
    }
    
    if (this.value[n] < 0)
    {
        throw "VLInt: Decrement past 0 not supported";
    }
}
//--------------------------------------------------------------------------------------------
VLInt.SubtractVectors = function (vec1, vec2)
{    
    // Expects vec1 >= vec2

    var len = vec1.length;
    var ret = new Array (len);
    var carry = 0;

    for (var i = 0 ; i < len ; ++i)
    {
        var diff = carry;
        if (i < vec1.length) diff += vec1[i];
        if (i < vec2.length) diff -= vec2[i];
        
        if (diff < 0)
        {
            diff += VLInt.BASE;
            carry = -1;
        }
        else
        {
            carry = 0;
        }
        ret [i] = diff;
    }
    
    if (carry < 0)
    {
        throw "Negative";
    }
    
    var len = ret.length - 1;
    
    while (len > 0 && ret[len] == 0)
    {
        --len;
    }
    
    if (len < ret.length - 1)
    {
        ret = ret.splice (0, len + 1);
    }
    
    return ret;
}
//--------------------------------------------------------------------------------------------
VLInt.MultiplyVectors = function (vec1, vec2)
{
    var len1 = vec1.length;
    var len2 = vec2.length;
    var len = len1 + len2;
    var ret = new Array (len);

    for (i = 0 ; i < len ; ++i)
    {
        ret [i] = 0;
    }

    for (var i = 0 ; i < len1 ; ++i)
    {
        var v1 = vec1 [i];
        for (var j = 0 ; j < len2 ; ++j)
        {
            var v2 = v1 * vec2 [j];
            var pos = i + j;
            ret [pos] += v2;

            while (ret [pos] > VLInt.BASE)
            {
                ret [pos+1] += Math.floor (ret [pos] / VLInt.BASE);
                ret [pos] %= VLInt.BASE;
                ++ pos;
            }
        }
    }

    while (ret.length > 1 && ret [ret.length-1] == 0)
    {
        ret = ret.splice (0, ret.length-1);
    }
    
    return ret;
}
//--------------------------------------------------------------------------------------------
// Compare, returns -1, 0 or 1 for (first < second), (first == second) and (first > second)
//--------------------------------------------------------------------------------------------
VLInt.Compare = function (first, second)
{
    if (first.positive != second.positive)
    {
        return first.positive ? 1 : -1;
    }
    
    var c = VLInt.CompareVector (first.value, second.value);
    
    return first.positive ? c : -c;
}
//--------------------------------------------------------------------------------------------
// returns the minimum (by reference)
//--------------------------------------------------------------------------------------------
VLInt.Min = function (first, second)
{
    return (VLInt.Compare (first, second) > 0) ? second : first;
}
//--------------------------------------------------------------------------------------------
// returns the maximum (by reference)
//--------------------------------------------------------------------------------------------
VLInt.Max = function (first, second)
{
    return (VLInt.Compare (first, second) > 0) ? first : second;
}
//--------------------------------------------------------------------------------------------
// Compare the vector component ignoring the positive,
// returns -1, 0 or 1 for (first < second), (first == second) and (first > second)
// Assumes the vector have no leading 0's
//--------------------------------------------------------------------------------------------
VLInt.CompareVector = function (first, second)
{
    if (first.length != second.length)
    {
        return (first.length > second.length) ? 1 : -1;
    }
    
    var pos = first.length - 1;
    
    while (pos >= 0)
    {
        if (first [pos] != second[pos])
        {
            return (first [pos] > second[pos]) ? 1 : -1;
        }
        --pos;
    }
    return 0;
}
//--------------------------------------------------------------------------------------------
VLInt.prototype.IsGreaterThan = function (other)
{
    return VLInt.Compare (this, other) == 1;
}
//--------------------------------------------------------------------------------------------
VLInt.prototype.IsGreaterThanOrEqualTo = function (other)
{
    return VLInt.Compare (this, other) >= 0;
}
//--------------------------------------------------------------------------------------------
VLInt.prototype.IsLessThan = function (other)
{
    return VLInt.Compare (this, other) == -1;
}
//--------------------------------------------------------------------------------------------
VLInt.prototype.IsLessThanOrEqualTo = function (other)
{
    return VLInt.Compare (this, other) <= 0;
}
//--------------------------------------------------------------------------------------------
VLInt.prototype.IsEqualTo = function (other)
{
    return VLInt.Compare (this, other) == 0;
}
//--------------------------------------------------------------------------------------------
VLInt.prototype.IsNotEqualTo = function (other)
{
    return VLInt.Compare (this, other) != 0;
}
//--------------------------------------------------------------------------------------------
VLInt.prototype.Abs = function ()
{
    return VLInt.FromVector (this.value, true);
}
//--------------------------------------------------------------------------------------------
VLInt.prototype.Minus = function ()
{
    return VLInt.FromVector (this.value, !this.positive);
}
//--------------------------------------------------------------------------------------------
// Check if zero
VLInt.prototype.IsZero = function ()
{
    return this.value.length == 0 || (this.value.length == 1 && this.value[0] == 0);
}
//--------------------------------------------------------------------------------------------
VLInt.prototype.Mod2 = function ()
{
    return (this.value.length > 0) ? (this.value [0] % 2) : 0;
}
//--------------------------------------------------------------------------------------------
VLInt.prototype.Mod4 = function ()
{
    return (this.value.length > 0) ? (this.value [0] % 4) : 0;
}
//--------------------------------------------------------------------------------------------
VLInt.prototype.Mod5 = function ()
{
    return (this.value.length > 0) ? (this.value [0] % 5) : 0;
}
//--------------------------------------------------------------------------------------------
VLInt.prototype.Mod8 = function ()
{
    return (this.value.length > 0) ? (this.value [0] % 8) : 0;
}
//--------------------------------------------------------------------------------------------
VLInt.prototype.Mod9 = function ()
{
    var sum = this.value [0];
    for (var i = 1 ; i < this.value.length ; ++i)
    {
        sum += this.value[i];
    }
    return sum % 9;
}
//--------------------------------------------------------------------------------------------
VLInt.prototype.Mod10 = function ()
{
    return (this.value.length > 0) ? (this.value [0] % 10) : 0;
}
//--------------------------------------------------------------------------------------------
VLInt.prototype.Mod16 = function ()
{
    return (this.value.length > 0) ? (this.value [0] % 16) : 0;
}
//--------------------------------------------------------------------------------------------
// Divide by an integer (< BASE)
VLInt.prototype.DivideByNumber = function (number)
{
    return this.DivMod (number) [0];
}
VLInt.prototype.Remainder = function (number)
{
    return this.DivMod (number) [1];
}

VLInt.prototype.DivMod = function (number)
{
    if (number <= 0)
    {
        return null;
    }
    var len = this.value.length;
    var ret = new Array(len);
    var buffer = [].concat (this.value);

    for (var i = len-1 ; i >= 0 ; --i)
    {
        var rem = buffer [i] % number;

        buffer [i] = Math.floor (buffer [i]/ number);
        
        if (i > 0)
        {
            buffer [i-1] += VLInt.BASE * rem;
        }
    }
    
    return [VLInt.FromVector (buffer, this.positive), rem];
}
// Divide, this/other, returns a VLInt

VLInt.prototype.Divide = function (other)
{
    if (other.IsZero ())
    {
        return null;
    }

    if (VLInt.CompareVector (other, this) > 0)
    {
        return new VLInt.FromInt(0);
    }
    
    var positive = this.positive == other.positive;
    var num = VLInt.FromVLInt (this);
    var den = VLInt.FromVLInt (other);
    
    num.positive = true;
    den.positive = true;
    
    var subs = [den];
    var answer = new VLInt.FromInt (0);
    var pos = 0;

    // We will subtract out powers of 2 times the divisor

    while (num.IsGreaterThan (subs[pos]))
    {
        subs.push (subs [pos].MultiplyInt (2));        // denominator x 2^n
        ++ pos;
    }
    
    VLInt.PreparePowers (subs.length);    
    
    while (pos >= 0)
    {
        if (num.IsGreaterThanOrEqualTo (subs[pos]))
        {
            answer = answer.Add (VLInt.powers2[pos]);
            num = num.Subtract (subs [pos]);
        }
        --pos;
    }
    if (answer.IsZero ())
    {
        answer.positive = true;
    }
    else if (! positive)
    {
        answer.positive = false;
    }
    return answer;
}

// Saves recalculating these every time we do a division

VLInt.PreparePowers = function (n)
{
    if (n > VLInt.powers2.length)
    {
        for (var i = VLInt.powers2.length ; i < n ; ++i)
        {
            VLInt.powers2.push (VLInt.powers2 [i-1].MultiplyInt (2));    // 2^n
        }
    }
}

//------------------------------------------------------------------------------------------------------
// Calculates this^n (n is a positive integer, doesn't do fractional or negative powers)

VLInt.prototype.Pow = function (n)
{
    if (n < 1) return new VLInt (1);

    var bits = [];
    var p = this;

    while (true)
    {
        if (n % 2 == 1)
        {
            bits.push (p);
        }
        n = Math.floor (n / 2);

        if (n < 1) break;

        p = p.Multiply (p);
    }

    var ret = bits [0];
    for (var i = 1 ; i < bits.length ; ++i)
    {
        ret = ret.Multiply (bits [i]);
    }

    return VLInt.Test ("Pow", ret);
}
//------------------------------------------------------------------------------------------------------
// Convert to f * 10^n (ignores the sign)

VLInt.prototype.MantissaExponent = function ()
{
    if (this.IsZero())
    {
        return [0,1];
    }

    var len = this.value.length;
    var exponent = VLInt.EXP * len;
    var mantissa = this.value [len-1] / VLInt.BASE;
    
    if (len > 1)
    {
        mantissa += this.value [len-2] / VLInt.BASE / VLInt.BASE;

        if (len > 2)
        {
            mantissa += this.value [len-3] / VLInt.BASE / VLInt.BASE / VLInt.BASE;
        }
    }
    
    while (mantissa < 1)
    {
        mantissa *= 10;
        exponent --;
    }

    return [mantissa, exponent];
}
//------------------------------------------------------------------------------------------------------
// Log base 10
VLInt.prototype.Log10 = function ()
{
    var me = this.MantissaExponent ();
    
    if (me [0] == 0)
    {
        return null;
    }
    
    return me[1] + Math.log10 (me [0]);
}
//------------------------------------------------------------------------------------------------------
VLInt.Ratio = function (b1, b2)
{
    var m1 = b1.MantissaExponent ();
    var m2 = b2.MantissaExponent ();

    return (m1[0] / m2[0]) * Math.pow (10, (m1[1] - m2[1]));
}
//------------------------------------------------------------------------------------------------------
VLInt.prototype.Square = function ()
{
    return this.Multiply (this);
}
//------------------------------------------------------------------------------------------------------
VLInt.prototype.Cube = function ()
{
    return this.Multiply (this.Multiply (this));
}
//------------------------------------------------------------------------------------------------------
VLInt.prototype.CubeRoot = function ()
{
    var me = this.MantissaExponent ();
    
    while (me [1] % 3 != 0)
    {
        --me [1];
        me [0] *= 10;
    }
    
    var f = Math.pow (me [0], 1/3) * Math.pow (10, me[1]/3);
    var ret = VLInt.FromFloat (f);
    ret.positive = this.positive;
    return ret;
}
//------------------------------------------------------------------------------------------------------
VLInt.prototype.ToInt = function ()
{
    var len = this.value.length;
    var ret = this.value[0];
    
    if (len > 3) return null;
    
    for (var i = 1 ; i < len ; ++i)
    {
        ret = ret * VLInt.BASE + this.value[i];
        
        if (ret > Number.MAX_SAFE_INTEGER) return null;
    }
    
    return (this.positive) ? ret : -ret;
}
//=========================================================================================================
// Monitoring and debugging
//=========================================================================================================
VLInt.prototype.toString = function ()
{
    var len = this.value.length;

    if (len == 0)
    {
        return "0";
    }

    var ret = this.value[len-1].toString ();

    for (var i = len-2 ; i >= 0 ; --i)
    {
        ret += (VLInt.PREFIX + this.value[i]).substr(-VLInt.EXP, VLInt.EXP);
    }
    return this.positive ? ret : ("-" + ret);
}
//------------------------------------------------------------------------------------------------------
VLInt.Test = function ()
{
    // AddInt
    
    var n = VLInt.FromInt (3);
    
    var n1 = n.AddInt (2);
    if (n1.toString () != "5") throw "VLInt AddInt (1)";
    
    n1 = n.AddInt (-1);
    if (n1.toString () != "2") throw "VLInt AddInt (2)";
    
    n1 = n.AddInt (-5);
    if (n1.toString () != "-2") throw "VLInt AddInt (3)";
    
    n1 = n.AddInt (-3);
    if (n1.toString () != "0") throw "VLInt AddInt (4)";
    
    // Add int with negative base
    
    n = VLInt.FromInt (-3);
    n1 = n.AddInt (2);
    if (n1.toString () != "-1") throw "VLInt AddInt (5)";
    
    n1 = n.AddInt (4);
    if (n1.toString () != "1") throw "VLInt AddInt (6)";
    
    n1 = n.AddInt (-5);
    if (n1.toString () != "-8") throw "VLInt AddInt (7)";
    
    n1 = n.AddInt (3);
    if (n1.toString () != "0") throw "VLInt AddInt (8)";
}








