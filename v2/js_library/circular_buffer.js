//-------------------------------------------------------------------------------------------------
// A circular buffer
//
// (c) John Whitehouse 2020
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------
CircularBuffer = function (size, init)
{
    if (typeof (size) != "number" || size < 2)
    {
        throw "CircularBuffer: Minimum size is 2";
    }
    
    this.size = Math.floor (size);
    this.buffer = new Array (this.size);
    
    for (var idx in this.buffer)
    {
        this.buffer [idx] = init;
    }
    this.pos = 0;
}
//-------------------------------------------------------------------------------------------------
// Replace the oldest value with the newest
// Returns the value being removed
//-------------------------------------------------------------------------------------------------
CircularBuffer.prototype.Add = function (value)
{
    var ret = this.buffer [this.pos];

    this.buffer [this.pos] = value;
    this.pos = (this.pos + 1) % this.size;
    return ret;
}
//-------------------------------------------------------------------------------------------------
// Return an item
//-------------------------------------------------------------------------------------------------
CircularBuffer.prototype.ItemAt = function (idx)
{
    return this.buffer [(this.pos + idx) % this.size];
}
