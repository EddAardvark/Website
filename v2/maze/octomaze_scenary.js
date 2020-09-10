//-------------------------------------------------------------------------------------------------
// Used to create scenary in a maze constructed from octagons and squares
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------


OctoMaze.Scenary = function ()
{
    this.GetItem = this.GetItemNull;
}

OctoMaze.Scenary.MODE_REPEATING_FIBONACCI;

OctoMaze.Scenary.prototype.Init = function (mode)
{
    if (mode == OctoMaze.Scenary.MODE_REPEATING_FIBONACCI)
    {
        this.InitFibonacci ();
        this.GetItem = this.GetItemFibonacci;
        return;
    }
}

OctoMaze.Scenary.prototype.InitFibonacci = function ()
{
    this.size = 17 + Misc.RandomInteger (40);
    this.trees = new Array (this.size * this.size);

    for (var idx = 0 ; idx < this.trees.length ; ++idx)
    {
        this.trees [idx] = 0;
    }

    for (var type = 1 ; type <= 5 ; ++type)
    {
        var x0 = 1 + Misc.RandomInteger (this.size-1);
        var y0 = 1 + Misc.RandomInteger (this.size-1);
        var xn = x0;
        var yn = y0;

        while (true)
        {
            this.trees [this.size * xn + yn] = type;

            var xt = yn;
            yn = (xn + yn) % this.size;
            xn = xt;

            if (xn == x0 && yn == y0) break;
        }
    }
}

OctoMaze.Scenary.fib_0 = function ()
{
    return { "item": null, "floor": null };
}
OctoMaze.Scenary.fib_1 = function ()
{
    var item = new OctoMaze.Item.Pyramid (true, 0.2, 0.0, 0.7);
    item.SetColours (["yellowgreen","green","darkolivegreen","forestgreen","hotpink"]);
    return { "item": item, "floor": null };
}
OctoMaze.Scenary.fib_2 = function ()
{
    var item = new OctoMaze.Item.Pyramid (false, 0.2, 0.0, 0.7);
    item.SetColours (["lawngreen","green","darkgreen","greenyellow","hotpink"]);
    return { "item": item, "floor": null };
}
OctoMaze.Scenary.fib_3 = function ()
{
    var item = new OctoMaze.Item.Octahedron (true, 0.3, 0.0, 0.4, 0.8);
    item.SetColours (["lawngreen","green","darkgreen","greenyellow","hotpink","green","darkgreen","greenyellow"]);
    return { "item": item, "floor": "Maroon" };
}
OctoMaze.Scenary.fib_4 = function ()
{
    var item = new OctoMaze.Item.Pyramid (false, 0.3, 0.38, -0.38);
    item.SetColours (["lawngreen","green","darkgreen","greenyellow","hotpink"]);
    return { "item": item, "floor": null };
}
OctoMaze.Scenary.fib_5 = function ()
{
    var item = null;
    return { "item": item, "floor": "MediumBlue" };
}
OctoMaze.Scenary.fibonacci_items =
[
    OctoMaze.Scenary.fib_0,
    OctoMaze.Scenary.fib_1,
    OctoMaze.Scenary.fib_2,
    OctoMaze.Scenary.fib_3,
    OctoMaze.Scenary.fib_4,
    OctoMaze.Scenary.fib_5,
];

OctoMaze.Scenary.prototype.GetItemNull = function (x,y)
{
    return { "item": null, "floor": null};
}
OctoMaze.Scenary.prototype.GetItemFibonacci = function (x,y)
{
    var xpos = x % this.size;
    var ypos = y % this.size;

    if (xpos < 0) xpos = xpos + this.size;
    if (ypos < 0) ypos = ypos + this.size;

    var idx = this.trees [this.size * xpos + ypos];

    return OctoMaze.Scenary.fibonacci_items [idx] ();
}
