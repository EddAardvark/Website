//-------------------------------------------------------------------------------------------------
// A row (or column) in a Nonogram puzzle.
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

Nonogram = function (num_rows, num_cols, cell_size)
{
    if (num_rows < 2 || num_cols < 2)
    {
        throw "Minimum size supported is 2 x 2";
    }
    this.row_definitions = new Array (num_rows);
    this.col_definitions = new Array (num_cols);
    this.num_cols = num_cols;
    this.num_rows = num_rows;
    this.num_cells = num_rows * num_cols;
    this.cell_size = cell_size;
    this.temperature = 1;
    this.accepted = 0;
    this.rejected = 0;
    this.draw_mode = Nonogram.DRAW_ROWS_AND_COLS;

    for (var row = 0 ; row < this.num_rows ; ++row)
    {
        this.row_definitions [row] = NonoRow.FromString ("", this.num_cols);
    }
    for (var col = 0 ; col < this.num_cols ; ++col)
    {
        this.col_definitions [col] = NonoRow.FromString ("", this.num_rows);
    }

    console.log ("Constructor counting cells");
    this.CountCells();
}

Nonogram.DRAW_ROWS_AND_COLS = 1;
Nonogram.DRAW_MATCHES = 2;
Nonogram.DRAW_HEAT = 3;
Nonogram.DRAW_ROWS_ONLY = 4;
Nonogram.DRAW_COLS_ONLY = 5;

Nonogram.heat_average = 0.999;
Nonogram.heat_average_m = 1 - Nonogram.heat_average;
//---------------------------------------------------------------------------------------------
Nonogram.prototype.Shuffle = function ()
{
    var mode = 1 + Misc.RandomInteger (3);
    var delta_r = 0;
    var delta_c = 0;
    var do_row = (mode & 1) == 1;
    var do_col = (mode & 2) == 2;

    console.log ("Mode " + mode + " = " + [do_row, do_col]);

    if (do_row)
    {
        var row = Misc.RandomInteger (this.num_rows);
        var row_element = this.row_definitions[row];
        var r_overlaps_1 = this.GetRowOverlaps (row, row_element);
        row_element.Shuffle ();
        var r_overlaps_2 = this.GetRowOverlaps (row, row_element);
        delta_r = r_overlaps_1 - r_overlaps_2;

        console.log ("Row " + row + " shuffle " + r_overlaps_1 + " -> " + r_overlaps_2 + ", delta = " + delta_r);
    }

    if (do_col)
    {
        var col = Misc.RandomInteger (this.num_cols);
        var col_element = this.col_definitions[col];
        var c_overlaps_1 = this.GetColumnOverlaps (col, col_element);
        col_element.Shuffle ();
        var c_overlaps_2 = this.GetColumnOverlaps (col, col_element);
        delta_c = c_overlaps_1 - c_overlaps_2;

        console.log ("Col " + col + " shuffle " + c_overlaps_1 + " -> " + c_overlaps_2 + ", delta = " + delta_c);
    }

    var delta = delta_r + delta_c;

    if (delta < 0)
        accept = true;
    else
        accept = Math.exp (- delta / this.temperature) > Math.random ();

    if (accept)
    {
        this.overlaps -= delta;
        this.energy = this.occupied_cells - this.overlaps;

        if (do_row) row_element.LockIn ();
        if (do_col) col_element.LockIn ();
        ++ this.accepted;
    }
    else
    {
        if (do_row) row_element.Revert ();
        if (do_col) col_element.Revert ();
        ++ this.rejected;
    }

    if (this.energy < 0) alert ("Negative energy");

    console.log ("ShuffleElement: energy = " + this.energy
                  + ", accept = " + accept + ", accepted = " + this.accepted
                  + ", rejected = " + this.rejected);

    this.UpdateHeat ();

    return accept;
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.Randomise = function (idx)
{
    for (var row in this.row_definitions)
        this.row_definitions[row].RandomShuffle ();
    for (var col in this.col_definitions)
        this.col_definitions[col].RandomShuffle ();

    this.CountCells ();
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.AddRow = function (pos, def)
{
    if (pos < 0 || pos >= this.num_rows)
    {
        alert ("Can't create row " + pos + ", limit is " + this.num_rows);
        return false;
    }
    try
    {
        var row = NonoRow.FromString (def, this.num_cols);
        this.row_definitions [pos] = row;
        return true;
    }
    catch (err)
    {
        alert (err);
        return false;
    }
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.AddColumn = function (pos, def)
{
    if (pos < 0 || pos >= this.num_cols)
    {
        alert ("Can't create column " + pos + ", limit is " + this.num_cols);
        return false;
    }
    try
    {
        var col = NonoRow.FromString (def, this.num_rows);
        this.col_definitions [pos] = col;
        return true;
    }
    catch (err)
    {
        alert (err);
        return false;
    }
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.RemoveRow = function (pos)
{
    if (pos >= 0 && pos < this.num_rows)
    {
        this.row_definitions [pos] = NonoRow.FromString ("", this.num_cols);
        return true;
    }

    return false;
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.RemoveColumn = function (pos)
{
    if (pos >= 0 && pos < this.num_cols)
    {
        this.col_definitions [pos] = NonoRow.FromString ("", this.num_rows);
        return true;
    }
    return false;
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.MoveRowUp = function (pos)
{
    if (pos >= 1 && pos < this.num_rows)
    {
        var temp = this.row_definitions [pos];
        this.row_definitions [pos] = this.row_definitions [pos-1];
        this.row_definitions [pos-1] = temp;
        return true;
    }
    return false;
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.MoveColumnLeft = function (pos)
{
    if (pos >= 1 && pos < this.num_cols)
    {
        var temp = this.col_definitions [pos];
        this.col_definitions [pos] = this.col_definitions [pos-1];
        this.col_definitions [pos-1] = temp;
        return true;
    }
    return false;
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.MoveRowDown = function (pos)
{
    if (pos >= 0 && pos < this.num_rows - 1)
    {
        var temp = this.row_definitions [pos];
        this.row_definitions [pos] = this.row_definitions [pos+1];
        this.row_definitions [pos+1] = temp;
        return true;
    }
    return false;
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.MoveColumnRight = function (pos)
{
    if (pos >= 0 && pos < this.num_cols - 1)
    {
        var temp = this.col_definitions [pos];
        this.col_definitions [pos] = this.col_definitions [pos+1];
        this.col_definitions [pos+1] = temp;
        return true;
    }
    return false;
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.UpdateRowList = function (list)
{
    for (var i = 0 ; i < this.num_rows ; ++i)
    {
        list.options[i].text = this.row_definitions [i].AsText ();
    }
    this.CountCells ();
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.UpdateColumnList = function (list)
{
    for (var i = 0 ; i < this.num_cols ; ++i)
    {
        list.options[i].text = this.col_definitions [i].AsText ();
    }
    this.CountCells ();
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.Draw = function(where)
{
    var drawer = new NonoDraw (this.cell_size);

    if (this.draw_mode == Nonogram.DRAW_ROWS_AND_COLS)
        drawer.DrawCombined (this);
    else if (this.draw_mode == Nonogram.DRAW_MATCHES)
        drawer.DrawMatches (this);
    else if (this.draw_mode == Nonogram.DRAW_HEAT)
        drawer.DrawCombinedHeat (this);
    else if (this.draw_mode == Nonogram.DRAW_ROWS_ONLY)
        drawer.DrawRows (this);
    else if (this.draw_mode == Nonogram.DRAW_COLS_ONLY)
        drawer.DrawColumns (this);

    drawer.canvas.Render (where);
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.GetPosition = function (row, col)
{
    // Applies periodic (toroidal) boundary conditions
    // Won't be very efficient
    if (row < 0) return this.GetPosition (row + this.num_rows, col);
    if (col < 0) return this.GetPosition (row, col + this.num_cols);
    if (row >= this.num_rows) return this.GetPosition (row - this.num_rows, col);
    if (col >= this.num_cols) return this.GetPosition (row, col - this.num_cols);

    return row * this.num_cols + col;
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.CountCells = function ()
{
    this.num_row_cells = 0;
    this.num_col_cells = 0;
    this.heat =  new Array (this.num_cells);
    this.cells = new Array (this.num_cells);

    for (var col = 0 ; col < this.num_cols ; ++ col)
    {
        this.num_col_cells += this.col_definitions[col].num_cells;
    }
    for (var row = 0 ; row < this.num_rows ; ++ row)
    {
        this.num_row_cells += this.row_definitions[row].num_cells;
    }

    var pos = 0;

    for (var row = 0 ; row < this.num_rows ; ++ row)
    {
        for (var col = 0 ; col < this.num_cols ; ++ col, ++pos)
        {
            this.cells [pos] = 0;
            this.heat [pos] = 0;
        }
    }

    // Initialise the occupied cells

    this.occupied_cells = Math.max (this.num_row_cells, this.num_col_cells);
    // Initialise the heat map

    pos = 0;
    this.overlaps = this.GetMatches ();
    this.energy = this.occupied_cells - this.overlaps;
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.GetMatches = function ()
{
    // Called after every move, calculates the energy of the moving bars and the
    // heat of the cells

    var overlaps = 0;

    for (var row = 0 ; row < this.num_rows ; ++ row)
    {
        for (var col = 0 ; col < this.num_cols ; ++ col)
        {
            if (this.row_definitions[row].cells[col] == 1 && this.col_definitions[col].cells[row] == 1)
            {
                ++ overlaps;
            }
        }
    }
    return overlaps;    // Aiming for 0.
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.GetRowOverlaps = function (row_idx, row)
{
    var overlaps = 0;

    for (var col = 0 ; col < this.num_cols ; ++ col)
    {
        if (row.cells[col] == 1 && this.col_definitions[col].cells[row_idx] == 1)
        {
            ++ overlaps;
        }
    }
    return overlaps;
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.GetColumnOverlaps = function (col_idx, col)
{
    var overlaps = 0;

    for (var row = 0 ; row < this.num_rows ; ++ row)
    {
        if (col.cells[row] == 1 && this.row_definitions[row].cells[col_idx] == 1)
        {
            ++ overlaps;
        }
    }
    return overlaps;
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.UpdateHeat = function ()
{
    var pos = 0;
    for (var row = 0 ; row < this.num_rows ; ++ row)
    {
        for (var col = 0 ; col < this.num_cols ; ++ col, ++pos)
        {
            var n = (this.row_definitions[row].cells[col] + this.col_definitions[col].cells[row]) / 2;

            this.heat[pos] = Nonogram.heat_average * this.heat[pos] + Nonogram.heat_average_m * n;
        }
    }
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.UpdateGridRow = function (row, data)
{
    for (var col = 0 ; col < this.num_cols ; ++col)
    {
        var cval = this.col_values [col][row] & NonoRow.COL;
        var rval = this.row_values [row][col];
        var new_rval = cval + data [col];

        this.row_values [row][col] = new_rval;
        this.col_values [col][row] = new_rval;
    }
}
//---------------------------------------------------------------------------------------------
Nonogram.prototype.UpdateGridColumn = function (col, data)
{
    for (var row = 0 ; row < this.num_rows ; ++row)
    {
        var cval = this.col_values [col][row];
        var rval = this.row_values [row][col] & NonoRow.ROW;
        var new_cval = rval + data [row];

        //alert (["ugc", cval, rval, data [row],new_cval]);

        this.row_values [row][col] = new_cval;
        this.col_values [col][row] = new_cval;
    }
}


// EOF


