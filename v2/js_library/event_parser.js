//-------------------------------------------------------------------------------------------------
// Create one
//-------------------------------------------------------------------------------------------------
EventParser = function ()
{
    this.KeyHandlers = {}
    this.GenericKeyHandler = null;
    this.logging = false;
    this.alerting = false;
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

EventParser.Initialise = function ()
{
    document.addEventListener('keydown', EventParser.OnKey);
}

EventParser.SetActiveInstance = function (handler)
{
    EventParser.active_instance = handler;
}

EventParser.active_instance = null;

EventParser.OnKey = function (event)
{
    if (EventParser.active_instance)
    {
        EventParser.active_instance.OnKey (event);
    }
}

EventParser.KEY_LEFT = 37;
EventParser.KEY_UP = 38;
EventParser.KEY_RIGHT = 39;
EventParser.KEY_DOWN = 40;
EventParser.PAGE_UP = 33;
EventParser.PAGE_DOWN = 34;
EventParser.ENTER = 13;
EventParser.ESCAPE = 27;

EventParser.ControlKeys = [16, 17, 18]; // Shift, Control, Alt

//-------------------------------------------------------------------------------------------------
EventParser.prototype.SetLogging = function (log, alert)
{
    this.logging = log === true;
    this.alerting = alert === true;
}
//-------------------------------------------------------------------------------------------------
EventParser.prototype.AddKeyHandler = function (key, object, handler)
{
    if (typeof(key) == "number")
        this.KeyHandlers [Math.floor(key)] = [object, handler];
    
    else if (typeof (key) == "string")
        if (key.length > 0)
            this.KeyHandlers [key.toUpperCase().charCodeAt(0)] = [object, handler];    
}
//-------------------------------------------------------------------------------------------------
EventParser.prototype.AddGenericKeyHandler = function (object, handler)
{
    this.GenericKeyHandler = [object, handler];
}
//-------------------------------------------------------------------------------------------------
EventParser.prototype.GetHandler = function (event)
{
    var key = event.keyCode;
    
    if (this.KeyHandlers.hasOwnProperty (key))
    {
        return this.KeyHandlers [key];
    }

    return this.GenericKeyHandler;
}
//-------------------------------------------------------------------------------------------------
EventParser.prototype.OnKey = function (event)
{
    if (this.logging)
    {
        this.LogKey (event);
    }
    if (this.alerting)
    {
        this.ShowKey (event);
    }
    
    var handler = this.GetHandler (event);
    
    if (handler)
    {
        if (handler[0])
            handler [1].call (handler[0], event);
        else
            handler [1] (event);
    }
}
//-------------------------------------------------------------------------------------------------
EventParser.prototype.LogKey = function (event)
{
    var key = event.keyCode;
    
    if (EventParser.ControlKeys.indexOf (key) < 0)
    {
        var handler = this.GetHandler (event);
    
        if (handler)
            Misc.Log ("Key = {0}, Name = {1}, Handler = [{2}]", key, event.code, handler);
        else
            Misc.Log ("Key = {0}, Name = {1}, unhandled", key, event.code);
    }
}
//-------------------------------------------------------------------------------------------------
EventParser.prototype.ShowKey = function (event)
{
    var key = event.keyCode;

    if (EventParser.ControlKeys.indexOf (key) < 0)
    {
        var handler = this.GetHandler (event);
    
        if (handler)
            Misc.Alert ("Key = {0}, Name = {1}, Handler = [{2}]", key, event.code, handler);
        else
            Misc.Alert ("Key = {0}, Name = {1}, unhandled", key, event.code);
    }
}

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


