//-------------------------------------------------------------------------------------------------
// Javascript animation methods
//
// Two parameters:
//  (1) The function to call
//  {2) THe interval in milliseconds (if ommited 100 is assumed)
//
// (c) John Whitehouse 2015 - 2019
// www.eddaardvark.co.uk
//=======================================================================================
Animator = function (fun, interval)
{
    this.fun = fun;
    this.timer = null;

    if (interval && interval > 1)
    {
        this.interval = interval;
    }
    else
    {
        this.interval = 100;
    }
}
//=======================================================================================
// Start - does nothing if already running
//=======================================================================================
Animator.prototype.Start = function ()
{
    if (! this.timer)
    {
        this.timer = setInterval(this.fun, this.interval);
    }
}
//=======================================================================================
// Stop - does nothing if already stopped
//=======================================================================================
Animator.prototype.Stop = function ()
{
    if (this.timer)
    {
        clearInterval(this.timer);
        this.timer = null;
    }
}
//=======================================================================================
// Is the animator running?
//=======================================================================================
Animator.prototype.IsRunning = function ()
{
    return this.timer != null;
}
//=======================================================================================
// Convert to a string
//=======================================================================================
Animator.prototype.toString = function ()
{
    var text = "Animator: interval = " + this.interval;
    if (this.timer)
        text += " [running]";
    else
        text += " [stopped]";
}
