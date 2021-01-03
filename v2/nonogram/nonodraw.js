//-------------------------------------------------------------------------------------------------
// Draws nonograms and nonogram rows
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

// A cell in the maze
NonoDraw = function (cell_size)
{
    this.cell_size = cell_size;
}
//---------------------------------------------------------------------------------
// Draws a whole pattern based on lists of rows and columns.
NonoDraw.prototype.DrawCombined = function (nonogram)
{
    var num_rows = nonogram.row_definitions.length;
    var num_cols = nonogram.col_definitions.length;
    var pos = 0;

    this.width = num_cols * this.cell_size + 1;
    this.height = num_rows * this.cell_size + 1;
    this.canvas = new CanvasHelp (this.width, this.height);

    // background

    this.canvas.SetBackground ("white");
    this.canvas.DrawFilledRect (0, 0, this.width, this.height);

    for (var row = 0 ; row < num_rows ; ++ row)
    {
        for (var col = 0 ; col < num_cols ; ++ col, ++pos)
        {
            var red = (nonogram.row_definitions[row].cells[col] != 0) ? 0 : 255;
            var green = (nonogram.col_definitions[col].cells[row] != 0) ? 0 : 255;
            var blue = (nonogram.cells [pos] != 0) ? 0 : 255;

            if (red != 255 || green != 255 || blue != 255)
            {
                var colour = SVGColours.ToHTMLValue (red, green, blue);

                this.canvas.SetBackground (colour);
                this.canvas.FillRect (col * this.cell_size, row * this.cell_size, cell_size, cell_size);
            }
        }
    }
    this.DrawGrid ();
}
//---------------------------------------------------------------------------------
// Draws a whole pattern based on lists of rows and columns.
NonoDraw.prototype.DrawRows = function (nonogram)
{
    var num_rows = nonogram.row_definitions.length;
    var num_cols = nonogram.col_definitions.length;
    var pos = 0;

    this.width = num_cols * this.cell_size + 1;
    this.height = num_rows * this.cell_size + 1;
    this.canvas = new CanvasHelp (this.width, this.height);

    // background

    this.canvas.SetBackground ("white");
    this.canvas.DrawFilledRect (0, 0, this.width, this.height);
    this.canvas.SetBackground ("black");

    for (var row = 0 ; row < num_rows ; ++ row)
    {
        for (var col = 0 ; col < num_cols ; ++ col, ++pos)
        {
            if (nonogram.row_definitions[row].cells[col] != 0)
            {
                this.canvas.FillRect (col * this.cell_size, row * this.cell_size, cell_size, cell_size);
            }
        }
    }
    this.DrawGrid ();
}
//---------------------------------------------------------------------------------
// Draws a whole pattern based on lists of rows and columns.
NonoDraw.prototype.DrawColumns = function (nonogram)
{
    var num_rows = nonogram.row_definitions.length;
    var num_cols = nonogram.col_definitions.length;
    var pos = 0;

    this.width = num_cols * this.cell_size + 1;
    this.height = num_rows * this.cell_size + 1;
    this.canvas = new CanvasHelp (this.width, this.height);

    // background

    this.canvas.SetBackground ("white");
    this.canvas.DrawFilledRect (0, 0, this.width, this.height);
    this.canvas.SetBackground ("black");

    for (var row = 0 ; row < num_rows ; ++ row)
    {
        for (var col = 0 ; col < num_cols ; ++ col, ++pos)
        {
            if (nonogram.col_definitions[col].cells[row] != 0)
            {
                this.canvas.FillRect (col * this.cell_size, row * this.cell_size, cell_size, cell_size);
            }
        }
    }
    this.DrawGrid ();
}
//---------------------------------------------------------------------------------
// Draws the matches squares
NonoDraw.prototype.DrawMatches = function (nonogram)
{
    var num_rows = nonogram.row_definitions.length;
    var num_cols = nonogram.col_definitions.length;
    var pos = 0;

    this.width = num_cols * this.cell_size + 1;
    this.height = num_rows * this.cell_size + 1;
    this.canvas = new CanvasHelp (this.width, this.height);

    // background

    this.canvas.SetBackground ("white");
    this.canvas.DrawFilledRect (0, 0, this.width, this.height);

    // The cells

    for (var row = 0 ; row < num_rows ; ++ row)
    {
        for (var col = 0 ; col < num_cols ; ++ col, ++pos)
        {
            var rval = nonogram.row_definitions[row].cells [col];
            var cval = nonogram.col_definitions[col].cells [row];

            if (rval == 1 && cval == 1)
            {
                var colour = (nonogram.cells[pos] == 1) ? "black" : "midnightblue";

                this.canvas.SetBackground (colour);
                this.canvas.FillRect (col * this.cell_size, row * this.cell_size, cell_size, cell_size);
            }
        }
    }
    this.DrawGrid ();
}

//---------------------------------------------------------------------------------
// Draws the matches squares
NonoDraw.prototype.DrawCombinedHeat = function (rows, cols)
{
    var num_rows = nonogram.row_definitions.length;
    var num_cols = nonogram.col_definitions.length;
    var pos = 0;

    this.width = num_cols * this.cell_size + 1;
    this.height = num_rows * this.cell_size + 1;
    this.canvas = new CanvasHelp (this.width, this.height);

    // background

    this.canvas.SetBackground ("white");
    this.canvas.DrawFilledRect (0, 0, this.width, this.height);


    // The cells

    for (var row = 0 ; row < num_rows ; ++ row)
    {
        for (var col = 0 ; col < num_cols ; ++ col, ++pos)
        {
            var v = Math.floor(255 * (1 - nonogram.heat[pos]));
            var c = SVGColours.ToHTMLValue (v, v, v);

            this.canvas.SetBackground (c);
            this.canvas.FillRect (col * this.cell_size, row * this.cell_size, cell_size, cell_size);
        }
    }
    this.DrawGrid ();
}




NonoDraw.prototype.DrawGrid = function ()
{
    // Grid (draw the whoe grid, not just the cells, though they sould be the same

    this.canvas.SetForeground ("darkgray");

    for (var x = this.cell_size ; x < this.width ; x += this.cell_size)
    {
        this.canvas.DrawLine ([x,0], [x,this.height]);
    }
    for (var y = this.cell_size ; y < this.height ; y += this.cell_size)
    {
        this.canvas.DrawLine ([0,y], [this.width,y]);
    }
}


NonoDraw.prototype.DrawProbabilities = function (probabilities)
{
    // Draw the background, then the rects, then superimpose the grid

    // background

    this.canvas.SetBackground ("white");
    this.canvas.SetForeground ("black");
    this.canvas.DrawFilledRect (0, 0, this.width, this.height);

    // The cells

    this.canvas.SetForeground ("white");

    var nx = Math.min (probabilities.length, this.num_cols);
    for (var x = 0 ; x < nx ; ++x)
    {
        var v = Math.floor(255 * (1 - probabilities [x]));
        var c = SVGColours.ToHTMLValue (v, v, v);

        this.canvas.SetBackground (c);
        this.canvas.FillRect (x * this.cell_size, 0, cell_size, cell_size);
    }

    // Grid (draw the whoe grid, not just the cells, though they sould be the same

    for (var x = 1 ; x < this.width ; x += this.cell_size)
    {
        this.canvas.DrawLine ([x,0], [x,this.height]);
    }
}
NonoDraw.prototype.DrawHeat = function (heat)
{
    // background

    this.canvas.SetBackground ("white");
    this.canvas.SetForeground ("black");
    this.canvas.DrawFilledRect (0, 0, this.width, this.height);

    // The cells

    this.canvas.SetForeground ("white");

    var nx = Math.min (heat.length, this.num_cols);
    for (var x = 0 ; x < nx ; ++x)
    {
        var v = Math.floor(255 * (1 - heat [x]));
        var c = SVGColours.ToHTMLValue (v, v, v);

        this.canvas.SetBackground (c);
        this.canvas.FillRect (x * this.cell_size, 0, cell_size, cell_size);
    }

    // Grid (draw the whoe grid, not just the cells, though they sould be the same

    for (var x = 1 ; x < this.width ; x += this.cell_size)
    {
        this.canvas.DrawLine ([x,0], [x,this.height]);
    }
}
// Draw some cells
NonoDraw.prototype.DrawCells = function (cells, background, forground, grid, box)
{
    // Draw the background, then the rects, then superimpose the grid

    this.canvas.SetBackground (background);
    this.canvas.FillRect (0, 0, this.width-1, this.height-1);

    // The cells

    this.canvas.SetBackground (forground);

    var nx = Math.min (cells.length, this.num_cols);
    for (var x = 0 ; x < nx ; ++x)
    {
        if (cells [x] != 0)
        {
            this.canvas.FillRect (x * this.cell_size, 0, cell_size, cell_size);
        }
    }

    // Grid (draw the whoe grid, not just the cells, though they sould be the same

    this.canvas.SetForeground (grid);

    for (var x = this.cell_size ; x < this.width ; x += this.cell_size)
    {
        this.canvas.DrawLine ([x,0], [x,this.height]);
    }

    // Box

    this.canvas.SetForeground (box);
    this.canvas.DrawRect (0, 0, this.width, this.height);
}


