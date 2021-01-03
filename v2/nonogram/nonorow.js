//-------------------------------------------------------------------------------------------------
// A row (or column) in a Nonogram puzzle.
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

NONOGRAM_HOMEPAGE = "http://www.eddaardvark.co.uk/v2/nonogram/index.html";

// A nonogram row (or column)
//-------------------------------------------------------------------------------------
NonoRow = function (length, values)
{
    this.pieces = [];
    this.length = length;
    this.num_cells = 0;

    // Count the cells

    for (var idx in values)
    {
        var l = Math.floor (values[idx]);

        if (l < 1) throw "Lengths must be positive integers";

        this.pieces.push (l);
        this.num_cells += l;
    }

    this.SelectShuffle (NonoRow.SlideShuffle);

    var minlen = (this.num_cells == 0) ? this.num_cells : (this.num_cells + this.pieces.length - 1);

    if (minlen > this.length) throw "Specified pieces require " + minlen + " cells, only " + this.length + " available.";

    this.space = this.length - minlen
    this.fixed = (this.num_cells == 0 || this.space == 0);

    // The shuffle algorithm works on the gaps rather than the pieces

    this.num_gaps = this.pieces.length+1;
    this.gaps = new Array (this.num_gaps);
    this.mingaps = new Array (this.num_gaps);

    this.gaps [0] = 0;
    this.mingaps [0] = 0;
    this.gaps [this.num_gaps-1] = this.space;
    this.mingaps [this.num_gaps-1] = 0;

    for (var i = 1 ; i < this.pieces.length ; ++i)
    {
        this.gaps [i] = 1;
        this.mingaps [i] = 1;
    }

    this.FillCells();
    this.original_gaps = [].concat (this.gaps);
    this.original_cells = [].concat (this.cells);
    this.previous_gaps = [].concat (this.gaps);
    this.previous_cells = [].concat (this.cells);

    console.log ("Fixed = " + this.fixed + ", Pieces [" + this.pieces + "] Gaps [" + this.gaps + "], Cells [" + this.cells + "]"
                    + "Prev Gaps [" + this.gaps + "], Prev Cells [" + this.cells + "]");
}

NonoRow.RandomShuffle = 1;
NonoRow.SlideShuffle = 2;
NonoRow.SlowShuffle = 3;
//-------------------------------------------------------------------------------------
NonoRow.FromString = function (str, length)
{
    if (typeof str !== 'string' || str.length == 0)
    {
        return new NonoRow (length, []);
    }

    var bits = str.split(",");
    return new NonoRow (length, bits);
}
//-------------------------------------------------------------------------------------
NonoRow.prototype.toString = function()
{
    return "NonoRow:[" + this.pieces + "], len = " + this.length;
}
//-------------------------------------------------------------------------------------
NonoRow.prototype.AsText = function()
{
    return (this.pieces.length == 0) ? "---" : this.pieces.toString ();
}
//-------------------------------------------------------------------------------------
NonoRow.prototype.FillCells = function()
{
    this.cells = [];

    if (this.gaps)
    {
        var temp = NonoRow.GetLabelledCells (this.pieces, this.gaps);

        for (var i = 0 ; i < temp.length ; ++i)
        {
            this.cells.push((temp[i] == 0) ? 0 : 1);
        }
    }
    else
    {
        for (var i = 0 ; i < this.length ; ++i)
        {
            this.cells.push(0);
        }
    }
}
//-------------------------------------------------------------------------------------
NonoRow.prototype.SelectShuffle = function (idx)
{
    if (idx == NonoRow.RandomShuffle)
        this.Shuffle = this.RandomShuffle;

    if (idx == NonoRow.SlideShuffle)
        this.Shuffle = this.SlideShuffle;

    if (idx == NonoRow.SlowShuffle)
        this.Shuffle = this.SlowShuffle;
}
//-------------------------------------------------------------------------------------
NonoRow.prototype.GetFixedCells = function()
{
    // Cells that are always filled
    var gaps = [].concat (this.original_gaps);
    var temp1 = NonoRow.GetLabelledCells (this.pieces, gaps);

    gaps[0] = gaps[gaps.length - 1];
    gaps[gaps.length - 1] = 0;

    var temp2 = NonoRow.GetLabelledCells (this.pieces, gaps);
    var ret = [];

    for (var i = 0 ; i < temp1.length ; ++i)
    {
        var f = (temp1[i] == temp2[i]) ? 1 : 0;

        ret.push((temp1[i] != 0 && temp1[i] == temp2[i]) ? 1 : 0);
    }

    return ret;
}
//-------------------------------------------------------------------------------------
NonoRow.GetLabelledCells = function(pieces, gaps)
{
    // Returned list labels the cells according to which piece they belong.
    var cells = [];

    for (var i = 0 ; i < pieces.length ; ++i)
    {
        for (var j = 0 ; j < gaps[i] ; ++j)
        {
            cells.push(0);
        }
        for (var j = 0 ; j < pieces[i] ; ++j)
        {
            cells.push(i+1);
        }
    }
    for (var j = 0 ; j < gaps[pieces.length] ; ++j)
    {
        cells.push(0);
    }
    return cells;
}
//-------------------------------------------------------------------------------------
// Performs a random shuffle (by adjusting the gaps)
NonoRow.prototype.RandomShuffle = function ()
{
    if (this.fixed) return;

    // Distribute the spare cells at randdom

    this.gaps = [].concat (this.mingaps);

    for (var i = 0 ; i < this.space ; ++i)
    {
        var gap = Misc.RandomInteger(this.num_gaps);

        ++ this.gaps [gap];
    }
    this.FillCells();
}
//-------------------------------------------------------------------------------------
// Performs a random shuffle (by adjusting the gaps)
NonoRow.prototype.SlideShuffle = function ()
{
    if (this.fixed) return;

    // Moves a randome set of cells from one gap tp anopther

    var p1 = Misc.RandomInteger (this.num_gaps);

    for (var i = 0 ; i < this.num_gaps ; ++i)
    {
        var surplus = this.gaps [p1] - this.mingaps[p1];

        if (surplus > 0)
        {
            var shift = (surplus > 1) ? (1 + Misc.RandomInteger (surplus-1)) : 1;
            var p2 = (p1 + Misc.RandomInteger(this.num_gaps - 1) + 1) % this.num_gaps;

            this.gaps [p1] -= shift;
            this.gaps [p2] += shift;
            this.FillCells();

            return;
        }
        p1 = (p1 + 1) % this.num_gaps;
    }

    alert ("Shuffle failed");
}//-------------------------------------------------------------------------------------
// Performs a random shuffle (by adjusting the gaps)
NonoRow.prototype.SlowShuffle = function ()
{
    if (this.fixed) return;

    // Moves a randome set of cells from one gap tp anopther

    var p1 = Misc.RandomInteger (this.num_gaps);

    for (var i = 0 ; i < this.num_gaps ; ++i)
    {
        var surplus = this.gaps [p1] - this.mingaps[p1];

        if (surplus > 0)
        {
            var shift = 1;
            var p2 = (p1 + Misc.RandomInteger(this.num_gaps - 1) + 1) % this.num_gaps;

            this.gaps [p1] -= shift;
            this.gaps [p2] += shift;
            this.FillCells();

            return;
        }
        p1 = (p1 + 1) % this.num_gaps;
    }

    alert ("Shuffle failed");
}
//-------------------------------------------------------------------------------------
// Undo a shuffle
NonoRow.prototype.Revert = function ()
{
    if (! this.fixed)
    {
        this.gaps = [].concat (this.previous_gaps);
        this.cells = [].concat (this.previous_cells);
    }
}
//-------------------------------------------------------------------------------------
// Confirm a shuffle
NonoRow.prototype.LockIn = function ()
{
    if (! this.fixed)
    {
        this.previous_gaps = [].concat (this.gaps);
        this.previous_cells = [].concat (this.cells);
    }
}
//-------------------------------------------------------------------------------------
NonoRow.prototype.GetPossiblePositions = function ()
{
    var gapset = [this.original_gaps];
    var seen = [this.original_gaps.toString ()];

    var pos = 0;

    while (pos < gapset.length)
    {
        var gaps = gapset [pos];
        for (var i = gaps.length - 1 ; i > 0 ; --i)
        {
            if (gaps [i] > this.mingaps [i])
            {
                for (var j = i-1 ; j >= 0 ; --j)
                {
                    var new_gaps = [].concat(gaps);
                    -- new_gaps [i];
                    ++ new_gaps [j];

                    var key = new_gaps.toString ();
                    if (seen.indexOf (key) < 0)
                    {
                        gapset.push (new_gaps);
                        seen.push(key);
                    }
                }
            }
        }
        ++pos;
    }

    var ret = [];
    for (idx in gapset)
    {
        var r2 = new NonoRow (row.length, row.pieces);
        r2.gaps = gapset[idx];
        r2.FillCells();

        ret.push (r2);
    }
    return ret;
}





