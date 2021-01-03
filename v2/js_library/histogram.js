//-------------------------------------------------------------------------------------------------
// Construct and draw histograms
//
// Uses misc.js, canvas_helpers.js, colours.js and svg_helpers.js
//
// (c) John Whitehouse 2020
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

Histogram = function ()
{
    this.SetBins (100);
    this.SetRange (0,1);
    this.SetHistory (0);
}
//-------------------------------------------------------------------------------------------------
// Set the range of acceptable values
//-------------------------------------------------------------------------------------------------
Histogram.prototype.SetRange = function (s, e)
{
    if (typeof (s) != "number" || typeof (e) != "number" || s >= e)
    {
        throw Misc.Format ("Invalid range {0} to {1}", s, e);
    }

    this.min = s;
    this.max = e;
    this.f = this.bins / (this.max - this.min);
}

//-------------------------------------------------------------------------------------------------
// Set the range of acceptable values
//-------------------------------------------------------------------------------------------------
Histogram.prototype.SetBins = function (b)
{
    if (typeof (b) != "number" || b < 2)
    {
        throw Misc.Format ("Invalid number of bins: {0}", b);
    }

    this.bins = Math.floor (b);
    this.f = this.bins / (this.max - this.min);
    this.bars = new Array (this.bins + 1);
}
//-------------------------------------------------------------------------------------------------
// If we are maintaining a finite history create a buffer to store the values
//-------------------------------------------------------------------------------------------------
Histogram.prototype.SetHistory = function (n)
{
    if (typeof (n) != "number" || n < 2)
    {
        this.history = null;
    }
    else
    {
        this.history = new CircularBuffer (Math.floor (n), 0);
    }
}
//-------------------------------------------------------------------------------------------------
// Add a value
//-------------------------------------------------------------------------------------------------
Histogram.prototype.Add = function (value)
{
    if (value >= this.min && value <= this.max)
    {
        var idx = (value - this.min) * this.f;
        
        if (this.history != null)
        {
            var prev = this.history.Add (idx);
            -- this.bars [prev];
        }
        ++this.bars [idx];
    }    
}