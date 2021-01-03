//----------------------------------------------------------------------------------------------------------
// A variable used for automation
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//----------------------------------------------------------------------------------------------------------


//==========================================================================================================
// A collection of objects with a common interface to implement variables used in animations
//
// Expects the id's of two text inputs and a list of watchers
//==========================================================================================================

AnimationValue = function (start_id, inc_id, watchers)
{
    this.start_id = start_id;
    this.inc_id = inc_id;
    this.watchers = Array.isArray(watchers) ? watchers.slice(0) : [watchers];
    
    this.Update ();
}
//----------------------------------------------------------------------------------------------------------
// Reset the values in the UI
AnimationValue.prototype.SetStart = function(value)
{
    this.start = value;
    this.start_id.value = this.start;
    this.Restart ();
}
//----------------------------------------------------------------------------------------------------------
// Reset the values in the UI
AnimationValue.prototype.Reset = function()
{
    this.start_id.value = this.start;
    this.inc_id.value = this.inc;
    this.Restart ();
}
//----------------------------------------------------------------------------------------------------------
// Restart
AnimationValue.prototype.Restart = function()
{
    this.current = this.start;    
    
    this.UpdateWatchers ();
}
//----------------------------------------------------------------------------------------------------------
// Update using the values from the UI
AnimationValue.prototype.Update = function()
{
    this.start = parseFloat (this.start_id.value);
    this.inc = parseFloat (this.inc_id.value);
    this.current = this.start;
    
    this.Restart ();
}
//----------------------------------------------------------------------------------------------------------
AnimationValue.prototype.SetCurrent = function(value)
{
    this.current = value;
    this.UpdateWatchers ();
}
//----------------------------------------------------------------------------------------------------------
// Apply the increment
AnimationValue.prototype.Next = function()
{
    this.current += this.inc;
    
    this.UpdateWatchers ();
}
//----------------------------------------------------------------------------------------------------------
// Make the current value the new start
AnimationValue.prototype.LockIn = function()
{
    this.start = this.current;    
    this.start_id.value = this.start;
    
    this.UpdateWatchers ();
}
//----------------------------------------------------------------------------------------------------------
// Update using the values from the UI
AnimationValue.prototype.UpdateWatchers = function()
{
    for (idx in this.watchers)
    {
        this.watchers [idx].innerHTML = this.CurrentText();
    }
}
//----------------------------------------------------------------------------------------------------------
AnimationValue.prototype.CurrentText = function()
{
    return Misc.FloatToText (this.current, 10);
}
//----------------------------------------------------------------------------------------------------------
AnimationValue.prototype.ToSaveObject = function()
{
    var ret = {};
    
    ret.start = this.start;
    ret.inc = this.inc;
    ret.current = this.current;
    
    return ret;
}
//----------------------------------------------------------------------------------------------------------
AnimationValue.prototype.FromSaveObject = function(obj)
{
    if (obj.hasOenProperty ("start")) this.start = obj.start;
    if (obj.hasOenProperty ("inc")) this.inc = obj.inc;
    if (obj.hasOenProperty ("current")) this.current = obj.current;
}
//==========================================================================================================
// A floating point value
//==========================================================================================================
AnimationFloat = function(start_id, inc_id, watchers)
{
    AnimationValue.call (this, start_id, inc_id, watchers);
}
AnimationFloat.prototype = Object.create(AnimationValue.prototype);
//==========================================================================================================
// An exponential growing value
//==========================================================================================================
AnimationExponential = function(start_id, inc_id, watchers)
{
    AnimationValue.call (this, start_id, inc_id, watchers);
}
AnimationExponential.prototype = Object.create(AnimationValue.prototype);
//----------------------------------------------------------------------------------------------------------
// Apply the increment
AnimationExponential.prototype.Next = function()
{
    this.current *= this.inc;
    
    this.UpdateWatchers ();
}
//----------------------------------------------------------------------------------------------------------
AnimationExponential.prototype.CurrentText = function()
{
    return Misc.FloatToText (this.current, null);
}
//==========================================================================================================
// An integer value (scaling is implemented using floating point)
//==========================================================================================================
AnimationInt = function(start_id, inc_id, watchers)
{
    AnimationValue.call (this, start_id, inc_id, watchers);
    
    this.real_current = this.current;
    this.current = Math.floor (this.real_current);
}
AnimationInt.prototype = Object.create(AnimationValue.prototype);
//----------------------------------------------------------------------------------------------------------
// Restart
AnimationInt.prototype.Restart = function()
{
    this.real_current = this.start;
    this.current = Math.floor (this.start);
    
    this.UpdateWatchers ();
}
//----------------------------------------------------------------------------------------------------------
AnimationInt.prototype.SetCurrent = function(value)
{
    this.real_current = value;
    this.current = Math.floor (value);
    this.UpdateWatchers ();
}
//----------------------------------------------------------------------------------------------------------
// Apply the increment
AnimationInt.prototype.Next = function()
{
    this.real_current += this.inc;
    this.current = Math.floor (this.real_current);
    
    this.UpdateWatchers ();
}
//----------------------------------------------------------------------------------------------------------
// Multiply the number of iterations by a float
AnimationInt.prototype.ScaleValue = function (f)
{
    this.real_current *= f;
    this.current = Math.floor (this.real_current);
    
    this.UpdateWatchers ();
}
//==========================================================================================================
// A co-ordinate
//==========================================================================================================
AnimationCoordinate = function(start_id, inc_id, watchers)
{
    AnimationValue.call (this, start_id, inc_id, watchers);
}
AnimationCoordinate.prototype = Object.create(AnimationValue.prototype);
//----------------------------------------------------------------------------------------------------------
AnimationCoordinate.ExtractValues = function (t0)
{
    text = t0.replace ("(", "");
    text = text.replace (")", "");
    var bits = text.split (",");
    if (bits.length != 2)
    {
        alert (t0 + "Is not a co-ordinate");
        return null;
    }
    var x = parseFloat (bits [0]);
    var y = parseFloat (bits [1]);
    
    return [x,y];
}
//----------------------------------------------------------------------------------------------------------
AnimationCoordinate.MakeText = function (x, y)
{
    return "(" + Misc.FloatToText(x,10) + "," + Misc.FloatToText(y,10) + ")";
}
//----------------------------------------------------------------------------------------------------------
// Apply the increment
AnimationCoordinate.prototype.Next = function()
{
    this.current_x += this.delta_x;
    this.current_y += this.delta_y;
    
    this.UpdateWatchers ();
}
//----------------------------------------------------------------------------------------------------------
// Set the start value
AnimationCoordinate.prototype.SetStart = function(x, y)
{
    this.start_x = x;
    this.start_y = y;    
    this.start_id.value = AnimationCoordinate.MakeText (this.start_x, this.start_y);
    this.Restart ();
}
//----------------------------------------------------------------------------------------------------------
// Reset the values in the UI
AnimationCoordinate.prototype.Reset = function()
{
    this.start_id.value = AnimationCoordinate.MakeText (this.start_x, this.start_y);
    this.inc_id.value = AnimationCoordinate.MakeText (this.delta_x, this.delta_y);   
    this.start_id.value = AnimationCoordinate.MakeText (this.start_x, this.start_y);
    
    this.Restart ();
}
//----------------------------------------------------------------------------------------------------------
// Restart
AnimationCoordinate.prototype.Restart = function()
{
    this.current_x = this.start_x;
    this.current_y = this.start_y;
    
    this.UpdateWatchers ();
}
// Update using the values from the UI
//----------------------------------------------------------------------------------------------------------
AnimationCoordinate.prototype.Update = function()
{
    var start = AnimationCoordinate.ExtractValues (this.start_id.value)
    var inc = AnimationCoordinate.ExtractValues (this.inc_id.value)

    if (start && inc)
    {
        this.start_x = start [0];
        this.start_y = start [1];
        this.delta_x = inc [0];
        this.delta_y = inc [1];
    
        this.Restart ();
    }
}
//----------------------------------------------------------------------------------------------------------
AnimationCoordinate.prototype.SetCurrent = function(x, y)
{
    this.current_x = x;
    this.current_y = y;
    
    this.UpdateWatchers ();
}
//----------------------------------------------------------------------------------------------------------
// Make the current value the new start
AnimationCoordinate.prototype.LockIn = function()
{
    this.start_x = this.current_x;
    this.start_y = this.current_y; 
    this.start_id.value = AnimationCoordinate.MakeText (this.start_x, this.start_y);
    
    this.UpdateWatchers ();
}
//----------------------------------------------------------------------------------------------------------
AnimationCoordinate.prototype.CurrentText = function()
{
    return AnimationCoordinate.MakeText (this.current_x, this.current_y);
}
//----------------------------------------------------------------------------------------------------------
AnimationCoordinate.prototype.ToSaveObject = function()
{
    var ret = {};
    
    ret.sx = this.start_x;
    ret.sy = this.start_y;
    ret.dx = this.delta_x;
    ret.dy = this.delta_y;
    ret.cx = this.current_x;
    ret.cy = this.current_y;
    
    return ret;
}
//----------------------------------------------------------------------------------------------------------
AnimationCoordinate.prototype.FromSaveObject = function(obj)
{
    if (obj.hasOenProperty ("sx")) this.start_x = obj.sx;
    if (obj.hasOenProperty ("sy")) this.start_y = obj.sy;
    if (obj.hasOenProperty ("dx")) this.delta_x = obj.dx;
    if (obj.hasOenProperty ("dy")) this.delta_y = obj.dy;
    if (obj.hasOenProperty ("cx")) this.current_x = obj.cx;
    if (obj.hasOenProperty ("cy")) this.current_y = obj.cy;
    
    this.UpdateWatchers ();
}
