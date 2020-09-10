

//-------------------------------------------------------------

//-------------------------------------------------------------
ConwayLife = function ()
{
    this.level = 1;
    this.periodic = true;
    this.shape = 0;
    this.Reset ();
}

ConwayLife.CELL_SIZE = 6;
ConwayLife.WIDTH = 21;
ConwayLife.HEIGHT = 21;

//-------------------------------------------------------------
ConwayLife.prototype.SetLevel = function (n)
{
    this.level = Math.pow (2,n);
    this.Reset ();
}
//-------------------------------------------------------------
ConwayLife.prototype.SetShape = function (n)
{
    this.shape = n;
    this.Reset ();
}
//-------------------------------------------------------------
ConwayLife.prototype.Reset = function ()
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
        this.cells [i] = 0;
    }

    ConwayLife.WIDTH = this.x_size;
    ConwayLife.HEIGHT = this.y_size;
}
//-------------------------------------------------------------
ConwayLife.prototype.AddPoint = function (x, y)
{
    x = (this.x_size - 1) / 2 + x;
    y = (this.y_size - 1) / 2 + y;

    if (x >= 0 && y >= 0 && x < ConwayLife.WIDTH && y < ConwayLife.HEIGHT)
    {
        var pos = y * ConwayLife.WIDTH + x;

        this.cells [pos] = 1;
    }
}
//-------------------------------------------------------------
ConwayLife.prototype.Draw = function (canvas)
{
    var ctx = canvas.getContext("2d");
    var idx = 0;
    var ypos = 0;

    canvas.width = ConwayLife.CELL_SIZE * ConwayLife.WIDTH;
    canvas.height = ConwayLife.CELL_SIZE * ConwayLife.HEIGHT;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Coloured squares

    ctx.fillStyle = "white";

    for (var y = 0 ; y < ConwayLife.HEIGHT ; ++y, ypos += ConwayLife.CELL_SIZE)
    {
        var xpos = 0;
        for (var x = 0 ; x < ConwayLife.WIDTH ; ++x, xpos += ConwayLife.CELL_SIZE)
        {
            if (this.cells[idx] != 0)
            {
                ctx.fillRect(xpos, ypos, ConwayLife.CELL_SIZE, ConwayLife.CELL_SIZE);
            }
            ++idx;
        }
    }
}
//-------------------------------------------------------------
ConwayLife.prototype.Next = function (canvas)
{
    var fun = this.periodic ? GetCellValuePeriodic : GetCellValueEdges;
    var num_cells = this.cells.length;
    var new_cells = new Array (num_cells);
    var idx = 0;

    for (var y = 0 ; y < ConwayLife.HEIGHT ; ++y)
    {
        for (var x = 0 ; x < ConwayLife.WIDTH ; ++x)
        {
            var centre = fun (this,x,y);
            var west = fun (this,x-1,y);
            var east = fun (this,x+1,y);
            var north = fun (this,x,y-1);
            var south = fun (this,x,y+1);
            var nw = fun (this,x-1,y-1);
            var ne = fun (this,x+1,y-1);
            var se = fun (this,x+1,y+1);
            var sw = fun (this,x-1,y+1);

            var sum = west + east + north + south + ne + nw + se + sw;
            if (centre == 1)
            {
                new_cells [idx] = (sum == 2 || sum == 3) ? 1 : 0;
            }
            else
            {
                new_cells [idx] = (sum == 3) ? 1 : 0;
            }

            ++idx;
        }
    }

    this.cells = new_cells;
}
//-------------------------------------------------------------
ConwayLife.prototype.NextEdges = function (canvas)
{
    var num_cells = this.cells.length;
    var new_cells = new Array (num_cells);
    var idx = 0;

    for (var y = 0 ; y < ConwayLife.HEIGHT ; ++y)
    {
        for (var x = 0 ; x < ConwayLife.WIDTH ; ++x)
        {
            var centre = this.cells[idx];
            var left = (x > 0) ? this.cells[idx-1] : 0;
            var right = (x < ConwayLife.WIDTH - 1) ? this.cells[idx+1] : 0;
            var up = (y > 0) ? this.cells[idx-ConwayLife.WIDTH] : 0;
            var down = (y < ConwayLife.HEIGHT - 1) ? this.cells[idx+ConwayLife.WIDTH] : 0;

            var sum = left + right + up + down;

            if (centre == 1)
            {
                new_cells [idx] = (sum == 2 || sum == 3) ? 1 : 0;
            }
            else
            {
                new_cells [idx] = (sum == 3) ? 1 : 0;
            }

            ++idx;
        }
    }

    this.cells = new_cells;
}
//-------------------------------------------------------------
ConwayLife.prototype.NextPeriodic = function (canvas)
{
    var num_cells = this.cells.length;
    var new_cells = new Array (num_cells);
    var idx = 0;

    for (var y = 0 ; y < ConwayLife.HEIGHT ; ++y)
    {
        for (var x = 0 ; x < ConwayLife.WIDTH ; ++x)
        {
            var centre = this.GetCellValuePeriodic (x,y);
            var left = this.GetCellValuePeriodic (x-1,y);
            var right = this.GetCellValuePeriodic (x+1,y);
            var up = this.GetCellValuePeriodic (x,y-1);
            var down = this.GetCellValuePeriodic (x,y+1);
            var sum = left + right + up + down;

            if (centre == 1)
            {
                new_cells [idx] = (sum == 2 || sum == 3) ? 1 : 0;
            }
            else
            {
                new_cells [idx] = (sum == 3) ? 1 : 0;
            }

            ++idx;
        }
    }

    this.cells = new_cells;
}
//-----------------------------------------------------------------------------------
GetCellValuePeriodic = function (pattern,x,y)
{
    x = (x + ConwayLife.WIDTH) % ConwayLife.WIDTH;
    y = (y + ConwayLife.HEIGHT) % ConwayLife.HEIGHT;

    return pattern.cells [y * ConwayLife.WIDTH + x];
}
//-----------------------------------------------------------------------------------
GetCellValueEdges = function (pattern,x,y)
{
    if ( x < 0 || x >= ConwayLife.WIDTH || y < 0 || y >= ConwayLife.HEIGHT)
    {
        return 0;
    }

    return pattern.cells [y * ConwayLife.WIDTH + x];
}
