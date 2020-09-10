

//-------------------------------------------------------------
FiveCell = function () {}

FiveCell.CELL_SIZE = 6;
FiveCell.WIDTH = 60;
FiveCell.HEIGHT = 40;
FiveCell.NUM_COLOURS = 5;
FiveCell.MAP_LENGTH = 15;
FiveCell.LEFT_IDX = 13;
FiveCell.RIGHT_IDX = 14;
FiveCell.colour_names = ["red", "orange", "yellow", "lime", "blue", "magenta"];
FiveCell.text_names = ["white", "red", "black", "blue", "white", "white"];

FiveCell.Initialise = function (n)
{
    FiveCell.NUM_COLOURS = n;
    FiveCell.MAP_LENGTH = 3 * n;
    FiveCell.LEFT_IDX = 3 * n - 2;
    FiveCell.RIGHT_IDX = 3 * n - 1;
}
//-------------------------------------------------------------
FiveCell.Row = function (left, pattern, right)
{
    this.left = left;
    this.right = right;
    this.pattern = pattern;
    this.start = 0;
}
//-------------------------------------------------------------
FiveCell.Row.prototype.NextRow = function (map)
{
    var next_row = new FiveCell.Row (this.left, [], this.right);

    next_row.start = this.start - 1;
    next_row.left = map [3 * this.left];
    next_row.right = map [3 * this.right];

    var new_len = this.pattern.length + 2;

    var n1 = this.left;
    var n2 = this.left;

    for (var i = 0 ; i < this.pattern.length ; ++i)
    {
        var n3 = this.pattern [i];
        next_row.pattern.push (map[n1+n2+n3]);
        n1 = n2;
        n2 = n3;
    }

    n3 = this.right;
    next_row.pattern.push (map[n1+n2+n3]);

    n1 = n2;
    n2 = n3;
    n3 = this.right;
    next_row.pattern.push (map[n1+n2+n3]);

    while (next_row.pattern.length > 0 && next_row.pattern [0] == next_row.left)
    {
        next_row.pattern = next_row.pattern.slice (1);
        next_row.start += 1;
    }
    while (next_row.pattern.length > 0 && next_row.pattern [next_row.pattern.length - 1] == next_row.right)
    {
        next_row.pattern = next_row.pattern.slice (0,next_row.pattern.length - 1);
    }

    return next_row;
}
//-------------------------------------------------------------
FiveCell.Row.prototype.GetColour = function (pos)
{
    var idx = pos - this.start;

    if (idx < 0)
    {
        return FiveCell.colour_names[this.left];
    }
    if (idx >= this.pattern.length)
    {
        return FiveCell.colour_names[this.right];
    }

    return FiveCell.colour_names[this.pattern[idx]];
}
//-------------------------------------------------------------
FiveCell.Row.prototype.Draw = function (ctx, x_start, y, width)
{
    var xpos = 0;
    var ypos = FiveCell.CELL_SIZE * y;
    var current_colour = this.GetColour (x_start);
    var num_cells = 1;

    for (var i = 1 ; i < width ; ++i)
    {
        var fill_colour = this.GetColour (i + x_start);

        if (fill_colour == current_colour)
        {
            ++num_cells;
        }
        else
        {
            ctx.fillStyle = current_colour;
            ctx.fillRect(xpos, ypos, num_cells * FiveCell.CELL_SIZE, FiveCell.CELL_SIZE);
            xpos += num_cells * FiveCell.CELL_SIZE;
            num_cells = 1;
            current_colour = fill_colour;
        }
    }
    ctx.fillStyle = current_colour;
    ctx.fillRect(xpos, ypos, num_cells * FiveCell.CELL_SIZE, FiveCell.CELL_SIZE);
}
//-------------------------------------------------------------
FiveCell.Row.prototype.DrawVerticals = function (ctx, x_start, y, width)
{
    var xpos = 0;
    var ypos = FiveCell.CELL_SIZE * y;
    var current_colour = this.GetColour (x_start);

    ctx.fillStyle = "black";

    for (var i = 0 ; i < width ; ++i)
    {
        var cell_idx = i + x_start;
        var fill_colour = this.GetColour (cell_idx);

        if (fill_colour != current_colour)
        {
            ctx.fillRect(xpos, ypos, 1, FiveCell.CELL_SIZE);
            current_colour = fill_colour;
        }

        xpos += FiveCell.CELL_SIZE;
    }
}
//-------------------------------------------------------------
FiveCell.Row.prototype.DrawHorizontals = function (ctx, previous_row, x_start, y, width)
{
    var xpos = 0;
    var ypos = FiveCell.CELL_SIZE * y;

    ctx.fillStyle = "black";

    for (var i = 0 ; i < width ; ++i)
    {
        var cell_idx = i + x_start;
        var fill_colour = this.GetColour (cell_idx);
        var top_colour = previous_row.GetColour (cell_idx);

        if (top_colour != fill_colour)
        {
            ctx.fillRect(xpos, ypos, FiveCell.CELL_SIZE + 1, 1);
        }

        xpos += FiveCell.CELL_SIZE;
    }
}
//-------------------------------------------------------------
FiveCell.Row.prototype.DrawInShape = function (chelp, x_start, y, width, height, shape)
{
    var xpos = 0;
    var ypos = FiveCell.CELL_SIZE * (height - y);
    var ytop = ypos - FiveCell.CELL_SIZE;
    var xsize = width * FiveCell.CELL_SIZE;
    var ysize = height * FiveCell.CELL_SIZE;
    var current_colour = this.GetColour (x_start);
    var num_cells = 1;

    for (var i = 1 ; i < width ; ++i)
    {
        var fill_colour = this.GetColour (i + x_start);

        if (fill_colour == current_colour)
        {
            ++num_cells;
        }
        else
        {
            var x0 = xpos;
            var x1 = x0 + num_cells * FiveCell.CELL_SIZE;
            var rect = [[x0,ypos], [x0, ytop], [x1, ytop], [x1, ypos]];
            var draw = rect.map (s => CoordinateMaths.MapToQuadrilateral (s[0] / xsize, s[1] / ysize, shape));

            chelp.SetBackground (current_colour);
            chelp.SetForeground (current_colour);
            chelp.DrawPolygon (draw);

            xpos += num_cells * FiveCell.CELL_SIZE;
            num_cells = 1;
            current_colour = fill_colour;
        }
    }
    var x1 = xpos + num_cells * FiveCell.CELL_SIZE;
    var rect = [[xpos,ypos], [xpos, ytop], [x1, ytop], [x1, ypos]];
    var draw = rect.map (s => CoordinateMaths.MapToQuadrilateral (s[0] / xsize, s[1] / ysize, shape));

    chelp.SetBackground (current_colour);
    chelp.SetForeground (current_colour);
    chelp.DrawPolygon (draw);
}
//-------------------------------------------------------------
FiveCell.Row.prototype.DrawVerticalsInShape = function (chelp, x_start, y, width, height, shape)
{
    var xpos = 0;
    var ypos = FiveCell.CELL_SIZE * (height - y);
    var ytop = ypos - FiveCell.CELL_SIZE;
    var current_colour = this.GetColour (x_start);
    var xsize = width * FiveCell.CELL_SIZE;
    var ysize = height * FiveCell.CELL_SIZE;

    chelp.SetForeground ("black");

    for (var i = 0 ; i < width ; ++i)
    {
        var cell_idx = i + x_start;
        var fill_colour = this.GetColour (cell_idx);

        if (fill_colour != current_colour)
        {
            var p1 = CoordinateMaths.MapToQuadrilateral (xpos / xsize, ypos / ysize, shape);
            var p2 = CoordinateMaths.MapToQuadrilateral (xpos / xsize, ytop / ysize, shape);

            chelp.DrawLine(p1, p2);
            current_colour = fill_colour;
        }

        xpos += FiveCell.CELL_SIZE;
    }
}
//-------------------------------------------------------------
FiveCell.Row.prototype.DrawHorizontalsInShape = function (chelp, previous_row, x_start, y, width, height, shape)
{
    var xpos = 0;
    var ypos = FiveCell.CELL_SIZE * (height - y);
    var ytop = ypos - FiveCell.CELL_SIZE;
    var xsize = width * FiveCell.CELL_SIZE;
    var ysize = height * FiveCell.CELL_SIZE;

    chelp.SetForeground ("black");

    for (var i = 0 ; i < width ; ++i)
    {
        var cell_idx = i + x_start;
        var fill_colour = this.GetColour (cell_idx);
        var top_colour = previous_row.GetColour (cell_idx);

        if (top_colour != fill_colour)
        {
            var p1 = CoordinateMaths.MapToQuadrilateral (xpos / xsize, ypos / ysize, shape);
            var p2 = CoordinateMaths.MapToQuadrilateral ((xpos + FiveCell.CELL_SIZE + 1) / xsize, ypos / ysize, shape);
            chelp.DrawLine(p1, p2);
        }

        xpos += FiveCell.CELL_SIZE;
    }
}
//-------------------------------------------------------------
FiveCell.Row.prototype.toString = function ()
{
    return this.left.toString () + "," + this.pattern + "," + this.right + " @ " + this.start;
}
//-------------------------------------------------------------
FiveCell.Pattern = function (cm)
{
    this.colour_map = cm.slice();
    this.centre_cells = [];
    this.num_centre_colours = 0;
    this.SetSize (1);
    this.Reset ();
}
//-------------------------------------------------------------
FiveCell.Pattern.Codes = ["0","1","2","3","4"];

//-------------------------------------------------------------
FiveCell.Pattern.FromCode = function (code)
{
    var bits = code.split (",");

    if (bits.length != 3 || bits [0] != "5") return;

    var colour_map = [];

    for (var i in bits[1])
    {
        var n = FiveCell.Pattern.Codes.indexOf (bits[1].charAt (i));
        if (n < 0) return null;
        colour_map.push(n);
    }
    var ret = new FiveCell.Pattern (colour_map);

    if (bits[2].length > 0)
    {
        var centre_cells = [];

        for (var i in bits[2])
        {
            var n = FiveCell.Pattern.Codes.indexOf (bits[2].charAt (i));
            if (n < 0) return null;
            centre_cells.push(n);
        }

        ret.SetCentreCells (centre_cells);
    }
    return ret;
}
//-------------------------------------------------------------
FiveCell.Pattern.prototype.SetCentreCells = function (centre_cells)
{
    this.centre_cells = centre_cells;
    this.num_centre_colours = centre_cells.length;
}
//-------------------------------------------------------------
FiveCell.Pattern.prototype.GetCode = function ()
{
    return FiveCell.NUM_COLOURS + "," +
            this.colour_map.reduce (function (a,b) { return a + b; }, "") +
            "," +
            this.centre_cells.reduce (function (a,b) { return a + b; }, "");
}
//-------------------------------------------------------------
FiveCell.Pattern.prototype.Reset = function ()
{
    this.rows = [];
}
//-------------------------------------------------------------
FiveCell.Pattern.prototype.SetSize = function (size)
{
    this.size = size;
    this.x_start = -Math.floor ((FiveCell.WIDTH - this.centre_cells.length) * size/2);
    this.y_start = 0;
    this.height = FiveCell.HEIGHT * this.size;
    this.width = FiveCell.WIDTH * this.size;
}
//-------------------------------------------------------------
FiveCell.Pattern.prototype.Scroll = function (dx, dy)
{
    this.x_start += dx;
    this.y_start = Math.max (this.y_start + dy, 0);
}
//-------------------------------------------------------------
FiveCell.Pattern.prototype.CreateRows = function ()
{
    var centre = this.centre_cells.slice(0, this.num_centre_colours);

    // Ensure we have enough rows

    if (this.rows.length == 0)
    {
        var left_colour = this.colour_map[FiveCell.LEFT_IDX];
        var right_colour = this.colour_map[FiveCell.RIGHT_IDX];
        this.rows.push(new FiveCell.Row (left_colour, centre, right_colour));
    }

    var y_end = this.y_start + this.height;

    for (var y = this.rows.length ; y < y_end ; ++y)
    {
        this.rows.push(this.rows [y-1].NextRow(this.colour_map));
    }
}
//-------------------------------------------------------------
FiveCell.Pattern.prototype.Draw = function (canvas)
{
    var ctx = canvas.getContext("2d");

    canvas.width = this.size * FiveCell.WIDTH * FiveCell.CELL_SIZE;
    canvas.height = this.size * FiveCell.HEIGHT * FiveCell.CELL_SIZE;

    this.CreateRows ();

    // Draw them

    var y = this.y_start;
    this.rows [y].Draw (ctx, this.x_start, 0, this.width);
    this.rows [y].DrawVerticals (ctx, this.x_start, 0, this.width);

    for (var y_idx = 1 ; y_idx < this.height ; ++y_idx)
    {
        ++y;

        this.rows [y].Draw (ctx, this.x_start, y_idx, this.width);
        this.rows [y].DrawVerticals (ctx, this.x_start, y_idx, this.width);
        this.rows [y].DrawHorizontals (ctx, this.rows[y-1], this.x_start, y_idx, this.width);
    }
}
//-------------------------------------------------------------
FiveCell.Pattern.prototype.DrawInShape = function (chelp, shape, include_lines)
{
    this.CreateRows ();

    // Draw them

    var y = this.y_start;
    this.rows [y].DrawInShape (chelp, this.x_start, 0, this.width, this.height, shape);

    if (include_lines)
    {
        this.rows [y].DrawVerticalsInShape (chelp, this.x_start, 0, this.width, this.height, shape);
    }

    for (var y_idx = 1 ; y_idx < this.height ; ++y_idx)
    {
        ++y;

        this.rows [y].DrawInShape (chelp, this.x_start, y_idx, this.width, this.height, shape);
        if (include_lines)
        {
            this.rows [y].DrawVerticalsInShape (chelp, this.x_start, y_idx, this.width, this.height, shape);
            this.rows [y].DrawHorizontalsInShape (chelp, this.rows[y-1], this.x_start, y_idx, this.width, this.height, shape);
        }
    }
}





