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

TimeoutAnimator = function (fun, interval)
{
    this.running = false;
    TimeoutAnimator.fun = fun;
    TimeoutAnimator.interval = interval;
}
TimeoutAnimator.fun = null;
TimeoutAnimator.interval=0;
TimeoutAnimator.id=-1;

TimeoutAnimator.callback = async function ()
{
    await TimeoutAnimator.fun.call ();
    TimeoutAnimator.id = window.setTimeout(TimeoutAnimator.callback, TimeoutAnimator.interval);
}
//=======================================================================================
// Start - does nothing if already running
//=======================================================================================
TimeoutAnimator.prototype.Start = function ()
{
    if (! this.running)
    {
        this.running = true;
        TimeoutAnimator.id = window.setTimeout(TimeoutAnimator.callback, TimeoutAnimator.interval);
    }
}
//=======================================================================================
// Stop - does nothing if already stopped
//=======================================================================================
TimeoutAnimator.prototype.Stop = function ()
{
    if (TimeoutAnimator.id >= 0)
    {
        window.clearTimeout(TimeoutAnimator.id);
        TimeoutAnimator.id = -1;
    }
    this.running = false;
}
//=======================================================================================
// Is the TimeoutAnimator running?
//=======================================================================================
TimeoutAnimator.prototype.IsRunning = function ()
{
    return this.running;
}
//=======================================================================================
// Convert to a string
//=======================================================================================
TimeoutAnimator.prototype.toString = function ()
{
    var text = "TimeoutAnimator: interval = " + TimeoutAnimator.interval;
    if (this.running)
        text += " [running], id = " + TimeoutAnimator.id;
    else
        text += " [stopped]";
}
