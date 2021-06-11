//-------------------------------------------------------------------------------------------------
// Create one
//-------------------------------------------------------------------------------------------------
function EventParser ()
{
}

EventParser.KEY_LEFT = 37;
EventParser.KEY_UP = 38;
EventParser.KEY_RIGHT = 39;
EventParser.KEY_DOWN = 40;

EventParser.Special = {}

EventParser.Special [EventParser.KEY_LEFT] = "Left";
EventParser.Special [EventParser.KEY_UP] = "Up";
EventParser.Special [EventParser.KEY_RIGHT] = "Right";
EventParser.Special [EventParser.KEY_DOWN] = "Down";

//-------------------------------------------------------------------------------------------------
EventParser.KeyToText = function (event)
{
    if (event.keyCode < 0x20 || event.keyCode > 0x5A)
    {
        return null;
    }

    // Letters

    if (event.keyCode >= 0x41 && event.keyCode <= 0x5A)
    {
        if (event.ctrlKey || event.altKey)
        {
            var ret = "";
            if (event.altKey) ret += "ALT-";
            if (event.ctrlKey) ret += "CTRL-";
            if (event.shiftKey) ret += "SHIFT-";
            return ret + String.fromCharCode(event.keyCode);
        }

        return String.fromCharCode((event.shiftKey) ? event.keyCode : (event.keyCode + 0x20));
    }

    // Special keys

    if (event.keyCode in EventParser.Special)
    {
        var ret = "";

        if (event.ctrlKey || event.altKey || event.shiftKey)
        {
            if (event.altKey) ret += "ALT-";
            if (event.ctrlKey) ret += "CTRL-";
            if (event.shiftKey) ret += "SHIFT-";
        }
        return ret + EventParser.Special [event.keyCode];
    }

    // the rest

    return String.fromCharCode(event.keyCode);
}
