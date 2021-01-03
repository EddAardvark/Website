// Creates the namespace
function Misc ()
{
}


//-------------------------------------------------------------------------------------------------
// Get a random integer in the range (0 - n1-1) or (n1 - n2)
//-------------------------------------------------------------------------------------------------
Misc.RandomInteger = function (n1, n2)
{
    if (! n2)
    {
        return Math.floor (Math.random () * n1);
    }

    return n1 + Math.floor (Math.random () * (n2 - n1 + 1));
}

//-------------------------------------------------------------------------------------------------
Misc.RandomFloat = function (f1, f2)
{
    return f1 + Math.random () * (f2 - f1);
}
//----------------------------------------------------------------------------------------------------------
Misc.FloatToText = function (x, precision)
{
    if (precision === null)
    {
        precision = (x) ? Math.max (2, 2 - Math.floor (Math.log10 (Math.abs(x)))) : 3;    
    }
    return x.toFixed(precision).replace(/0+$/,"").replace(/\.$/,"");
}
//-------------------------------------------------------------------------------------------------
// Uses C# printf notation, {n} replaced by the (n+1)th, starting at 0, argument
//-------------------------------------------------------------------------------------------------
Misc.Log = function ()
{
    if (arguments.length == 0)
    {
        console.log ("Misc.Log called with no arguments");
    }

    console.log (Misc.FormatString (Array.from(arguments)));
}
//-------------------------------------------------------------------------------------------------
// Uses C# printf notation, {n} replaced by the (n+1)th, starting at 0, argument
//-------------------------------------------------------------------------------------------------
Misc.ResetLog = function (title)
{
    console.clear();

    if (title)
    {
        console.log (title);
    }
}
//-------------------------------------------------------------------------------------------------
// Uses C# printf notation, {n} replaced by the (n+1)th, starting at 0, argument
//-------------------------------------------------------------------------------------------------
Misc.Alert = function ()
{
    if (arguments.length == 0)
    {
        alert ("Misc.Alert called with no arguments");
    }

    alert (Misc.FormatString (Array.from(arguments)));
}
//-------------------------------------------------------------------------------------------------
// Uses C# printf notation, {n} replaced by the (n+1)th, starting at 0, argument
//-------------------------------------------------------------------------------------------------
Misc.Format = function ()
{
    if (arguments.length == 0)
    {
        return ("Misc.Format called with no arguments");
    }

    return (Misc.FormatString (Array.from(arguments)));
}
//-------------------------------------------------------------------------------------------------
// Common part of formatting functions
//-------------------------------------------------------------------------------------------------
Misc.FormatString = function(args)
{
    var format = args [0].toString ();
    var result = "";

    while (true)
    {
        var pos = format.indexOf ("{");
        if (pos < 0)
        {
            result += format;
            break;
        }

        if (pos > 0 && format.charAt(pos-1) == "\\")
        {
            result += format.substr(0, pos-1) + "{";
            format = format.substr(pos+1);
        }
        else
        {
            result += format.substr(0, pos);
            format = format.substr(pos+1);
            var pos2 = format.indexOf ("}");
            if (pos2 < 0)
            {
                result += format;
                break;
            }
            var param = format.substr(0, pos2);
            format = format.substr(pos2+1);
            var idx = parseInt(param);

            if (idx >= 0 && idx < args.length-1)
            {
                if (args[idx+1] === null)
                    result += "null";
                else
                    result += (typeof(args[idx+1]) == 'undefined') ? "undefined" : args[idx+1].toString ();
            }
            else
            {
                result += "{" + param + "}";
            }
        }
    }
    return result;
}

Misc.Vector2Add = function (a, b) { return [a[0] + b[0], a[1] + b[1]]; }

Misc.RandomElement = function (list)
{
    return list[Misc.RandomInteger(list.length)];
}

// Rotates a list in place

Misc.RotateFrontToBack = function (list)
{
    if (list.length < 2)
    {
        return;
    }
        
    var x = list.shift ();
    list.push (x);    
}

Misc.RotateBackToFront = function (list)
{
    if (list.length < 2)
    {
        return;
    }
        
    var x = list.pop ();
    list.unshift (x);    
}





