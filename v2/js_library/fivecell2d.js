

//-------------------------------------------------------------

//-------------------------------------------------------------
FiveCell2d = function (cm, outer_colour)
{
    this.colour_map = cm.slice();
    this.level = 1;
    this.periodic = false;
    this.outer_colour = outer_colour;
    this.shape = 0;
    this.Reset ();
}

FiveCell2d.CELL_SIZE = 6;
FiveCell2d.WIDTH = 21;
FiveCell2d.HEIGHT = 21;
FiveCell2d.NUM_COLOURS = 5;
FiveCell2d.NUM_NEIGHBOURS = 5;
FiveCell2d.colour_names = ["red", "orange", "yellow", "lime", "blue", "magenta"];
FiveCell2d.text_names = ["white", "red", "black", "blue", "white", "white"];

FiveCell2d.Initialise = function (n)
{
    FiveCell2d.NUM_COLOURS = n;
    FiveCell2d.MAP_LENGTH = FiveCell2d.NUM_NEIGHBOURS * (n - 1) + 1;
}

FiveCell2d.Initialise (5);

//-------------------------------------------------------------
FiveCell2d.prototype.SetLevel = function (n)
{
    this.level = Math.pow (2,n);
    this.Reset ();
}
//-------------------------------------------------------------
FiveCell2d.prototype.SetShape = function (n)
{
    this.shape = n;
    this.Reset ();
}
//-------------------------------------------------------------
FiveCell2d.prototype.Reset = function ()
{
    switch (this.shape)
    {
    case 0: // 1x1 (Square)
        this.x_size = 20 * this.level + 1;
        this.y_size = 20 * this.level + 1;
        break;

    case 1: // 4x3
        this.x_size = 24 * this.level + 1;
        this.y_size = 16 * this.level + 1;
        break;

    case 2: // 4x3
        this.x_size = 32 * this.level + 1;
        this.y_size = 18 * this.level + 1;
        break;
    }

    var num_cells = this.x_size * this.y_size;
    this.cells = new Array (num_cells);

    for (var i = 0 ; i < num_cells ; ++i)
    {
        this.cells [i] = this.outer_colour;
    }

    FiveCell2d.WIDTH = this.x_size;
    FiveCell2d.HEIGHT = this.y_size;
}
//-------------------------------------------------------------
FiveCell2d.prototype.AddPoint = function (coloured_point)
{
    var x = (this.x_size - 1) / 2 + coloured_point.x;
    var y = (this.y_size - 1) / 2 + coloured_point.y;

    if (x >= 0 && y >= 0 && x < FiveCell2d.WIDTH && y < FiveCell2d.HEIGHT)
    {
        var pos = y * FiveCell2d.WIDTH + x;

        this.cells [pos] = coloured_point.c;
    }
}
//-------------------------------------------------------------
FiveCell2d.prototype.Draw = function (canvas)
{
    var ctx = canvas.getContext("2d");
    var idx = 0;
    var ypos = 0;

    canvas.width = FiveCell2d.CELL_SIZE * FiveCell2d.WIDTH;
    canvas.height = FiveCell2d.CELL_SIZE * FiveCell2d.HEIGHT;

    // Coloured squares

    for (var y = 0 ; y < FiveCell2d.HEIGHT ; ++y, ypos += FiveCell2d.CELL_SIZE)
    {
        var xpos = 0;
        for (var x = 0 ; x < FiveCell2d.WIDTH ; ++x, xpos += FiveCell2d.CELL_SIZE)
        {
            ctx.fillStyle = FiveCell2d.colour_names[this.cells[idx]];
            ctx.fillRect(xpos, ypos, FiveCell2d.CELL_SIZE, FiveCell2d.CELL_SIZE);

            ++idx;
        }
    }

    // Edges

    idx = 0;
    ypos = 0;
    ctx.fillStyle = "black";

    for (var y = 0 ; y < FiveCell2d.HEIGHT ; ++y, ypos += FiveCell2d.CELL_SIZE)
    {
        var xpos = 0;
        for (var x = 0 ; x < FiveCell2d.WIDTH ; ++x, xpos += FiveCell2d.CELL_SIZE)
        {
            if (x > 0 && this.cells[idx] != this.cells[idx-1])
            {
                ctx.fillRect(xpos, ypos, 1, FiveCell2d.CELL_SIZE);
            }

            if (y > 0 && this.cells[idx] != this.cells[idx-FiveCell2d.WIDTH])
            {
                ctx.fillRect(xpos, ypos, FiveCell2d.CELL_SIZE + 1, 1);
            }

            ++idx;
        }
    }
}
//-------------------------------------------------------------
FiveCell2d.prototype.Next = function (canvas)
{
    if (this.periodic)
    {
        this.NextPeriodic ();
    }
    else
    {
        this.NextEdges ();
    }
}
//-------------------------------------------------------------
FiveCell2d.prototype.NextEdges = function (canvas)
{
    var num_cells = this.cells.length;
    var new_cells = new Array (num_cells);
    var idx = 0;

    for (var y = 0 ; y < FiveCell2d.HEIGHT ; ++y)
    {
        for (var x = 0 ; x < FiveCell2d.WIDTH ; ++x)
        {
            var centre = this.cells[idx];
            var left = (x > 0) ? this.cells[idx-1] : this.outer_colour;
            var right = (x < FiveCell2d.WIDTH - 1) ? this.cells[idx+1] : this.outer_colour;
            var up = (y > 0) ? this.cells[idx-FiveCell2d.WIDTH] : this.outer_colour;
            var down = (y < FiveCell2d.HEIGHT - 1) ? this.cells[idx+FiveCell2d.WIDTH] : this.outer_colour;

            new_cells [idx] = this.colour_map [centre + left + right + up + down];

            ++idx;
        }
    }

    this.cells = new_cells;
}
//-------------------------------------------------------------
FiveCell2d.prototype.NextPeriodic = function (canvas)
{
    var num_cells = this.cells.length;
    var new_cells = new Array (num_cells);
    var idx = 0;

    for (var y = 0 ; y < FiveCell2d.HEIGHT ; ++y)
    {
        for (var x = 0 ; x < FiveCell2d.WIDTH ; ++x)
        {
            var centre = this.GetPatternColour (x,y);
            var left = this.GetPatternColour (x-1,y);
            var right = this.GetPatternColour (x+1,y);
            var up = this.GetPatternColour (x,y-1);
            var down = this.GetPatternColour (x,y+1);

            new_cells [idx] = this.colour_map [centre + left + right + up + down];

            ++idx;
        }
    }

    this.cells = new_cells;
}
//-----------------------------------------------------------------------------------
FiveCell2d.prototype.GetPatternColour = function (x,y)
{
    x = (x + FiveCell2d.WIDTH) % FiveCell2d.WIDTH;
    y = (y + FiveCell2d.HEIGHT) % FiveCell2d.HEIGHT;

    return this.cells [y * FiveCell2d.WIDTH + x];
}
//-----------------------------------------------------------------------------------
// Used to add points to the pattern
//-----------------------------------------------------------------------------------
ColouredPoint = function (x, y, c)
{
    this.x = x;
    this.y = y;
    this.c = c;
    this.key = "CP" + this.x + "_" + this.y;
}
//-------------------------------------------------------------
ColouredPoint.prototype.toString = function ()
{
    return "(" + this.x + "," + this.y + ") = " + this.c;
}
