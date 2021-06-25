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
//-------------------------------------------------------------------------------------------------
Misc.RandomElement = function (list)
{
    return list[Misc.RandomInteger(list.length)];
}
//-------------------------------------------------------------------------------------------------
Misc.RandomBool = function ()
{
    return Math.random () >= 0.5;
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
// Uses C# printf notation, "{n}" is replaced by the (n+1)th argument, count starts at 0.
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
// Clears the log in the console
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
// Uses C# printf notation, "{n}" is replaced by the (n+1)th argument, count starts at 0.
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

//==============================================================================================================
// Functions for rendering equations more readable in html
// Replaces operator characters with mathematical symbols and formats exponents
// Relies on the iteration of the object properties following the order they are added.
//==============================================================================================================

Misc.opsmap = {};

Misc.opsmap['>'] = "&gt;";
Misc.opsmap['<'] = "&lt;";
Misc.opsmap['=&gt;'] = "&nbsp;&#x21D2;&nbsp;";
Misc.opsmap['&gt;='] = "&nbsp;&#x2265;&nbsp;";
Misc.opsmap['&lt;='] = "&nbsp;&#x2264;&nbsp;";
Misc.opsmap['~='] = "&nbsp;&#x2248;&nbsp;";
Misc.opsmap['+'] = "&nbsp;&plus;&nbsp;";
Misc.opsmap['-'] = "&nbsp;&minus;&nbsp;";
Misc.opsmap['*'] = "&nbsp;&times;&nbsp;";
Misc.opsmap['/'] = "&nbsp;&#8725;&nbsp;";
Misc.opsmap['='] = "&nbsp;&equals;&nbsp;";
Misc.opsmap['&gt;'] = "&nbsp;&#x003E;&nbsp;";   // Using &gt; creates a recursive substitution. 3E is the same symbol.
Misc.opsmap['&lt;'] = "&nbsp;&#x003C;&nbsp;";

// Expands the text in an element, operates on innerHTML so should only be called for elements that contains
// literal text 
Misc.expand_element = function (element)
{
    element.innerHTML = Misc.expand_expression(element.innerHTML);
}
// Expands some text
Misc.expand_expression = function (text)
{    
    // Simple substitutions
    
    for (var prop in Misc.opsmap)
    {
        if (Misc.opsmap.hasOwnProperty(prop))
        {
            while (text.indexOf(prop) >= 0)
            {
                text=text.replace (prop, Misc.opsmap[prop]);
            }
        }
    }

    // Expand the '^' characters (for now just ^X, will enhance to include ^[string])
    
    while (true)
    {
        var pos = text.indexOf ('^');
        
        if (pos < 0 || pos >= text.length - 1)
            break;
        
        // look for the X^[string]" case.
        
        if (text[pos+1] == '[')
        {
            var pos2 = Misc.find_matching_brace (text, pos+1);
            if (pos2 < 0)
            {
                text += "*ERROR*";
                break;
            }
            var insert = '<span class="superscript">' + text.substr(pos+2, pos2 - pos - 2) + '</span>';
            text = text.slice(0, pos) + insert + text.slice (pos2+1);
            pos = pos2 + 1;
        }
        else
        {
            var insert = '<span class="superscript">' + text[pos+1] + '</span>';
            text = text.slice(0, pos) + insert + text.slice (pos+2);
        }
    }
    
    return text;
}
// Find the end of a bracketed sequence, uses '(', '{', and '['.
// I can't do <X> as it confuses the html and |A|B|C| is ambiguous.

Misc.braces = {};
Misc.braces['('] = ')';
Misc.braces['{'] = '}';
Misc.braces['['] = ']';

Misc.find_matching_brace = function (text, pos)
{
    if (pos >= text.length) return -1;
    var to_match = Misc.braces[text[pos]];
    if (! to_match) return -1;
    var stack = [];

    while (++pos < text.length)
    {
        var ch = text[pos];
        if (ch == to_match)
        {
            if (stack.length == 0) return pos;

            to_match = stack.pop ();
        }
        else if (Misc.braces.hasOwnProperty(ch))
        {
            stack.push (to_match);
            to_match = Misc.braces[ch];
        }
    }
    return -1;
}
    
    

// Should be in coordinate maths

Misc.Vector2Add = function (a, b) { return [a[0] + b[0], a[1] + b[1]]; }


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





