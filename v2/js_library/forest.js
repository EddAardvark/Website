//-------------------------------------------------------------------------------------------------
// JavascriptForest Fire Simulator: class definition.
// (c) John Whitehouse 2014
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

ForestFire.CELL_SIZE = 3;
ForestFire.WIDTH = 256;
ForestFire.HEIGHT = 192;
ForestFire.AREA = ForestFire.WIDTH * ForestFire.HEIGHT;
ForestFire.DISPLAY_HEIGHT = ForestFire.HEIGHT * ForestFire.CELL_SIZE;
ForestFire.DISPLAY_WIDTH = ForestFire.WIDTH * ForestFire.CELL_SIZE;

ForestFire.JUST_IGNITED = -1;

ForestFire.FRESH_FIRE = 0;
ForestFire.ESTABLISHED_FIRE = 1;
ForestFire.GLOWING_EMBERS = 2;
ForestFire.ASH = 3;
ForestFire.FRESH_SHOOTS = 4;
ForestFire.SHRUB = 5;
ForestFire.MATURE = 6;

ForestFire.NUM_CELL_TYPES = 7;

ForestFire.cell_names =
[
    "Freshly lit fire",
    "Established fire",
    "Glowing embers",
    "Ash",
    "Fresh shoots",
    "Scrub",
    "Mature forest"
];

ForestFire.colours =
[
    "yellow", "orange", "red", "black", "lightgreen", "lawngreen", "forestgreen"
];

ForestFire.PROB_TO_ESTABLISHED = 0;
ForestFire.PROB_TO_EMBERS = 1;
ForestFire.PROB_TO_ASH = 2;
ForestFire.PROB_TO_FRESH = 3;
ForestFire.PROB_TO_SCRUB = 4;
ForestFire.PROB_TO_MATURE = 5;
ForestFire.PROB_IGNIGHT = 6;
ForestFire.PROB_SPREAD = 7;

//-------------------------------------------------------------------------------------------------
// Create one
//-------------------------------------------------------------------------------------------------
function ForestFire (image_element)
{
    this.image = document.getElementById(image_element);

    this.canvas = document.createElement('canvas');
    this.canvas.width = ForestFire.DISPLAY_WIDTH;
    this.canvas.height = ForestFire.DISPLAY_HEIGHT;
    this.forest = new Array (ForestFire.AREA);
    this.transitions = [ 0.3, 0.2, 0.2, 0.1, 0.1, 0.1, 0.00001, 0.4];

    for (var i = 0 ; i < ForestFire.AREA ; ++i)
    {
        this.forest [i] = ForestFire.FRESH_SHOOTS;
    }
}
//-------------------------------------------------------------------------------------------------
// Render the forest fire into the cached image
//-------------------------------------------------------------------------------------------------
ForestFire.prototype.DisplayImage = function ()
{
    this.image.src = this.canvas.toDataURL();
}
//-------------------------------------------------------------------------------------------------
// Calculate the next view - two modes
//
// (1) Cells can spontaneously advance to the next stage based on the probabilities
// (2) Fresh fire cells may ignite adjacent mature forest
//-------------------------------------------------------------------------------------------------
ForestFire.prototype.Next = function ()
{
    // First spread the burning cells. JUST_IGNITED is used to stop new fires cells either
    // spreading or maturing.

    for (var i = 0 ; i < ForestFire.AREA ; ++i)
    {
        if (this.forest [i] == ForestFire.FRESH_FIRE)
        {
            var x = i % ForestFire.WIDTH;
            var y = Math.floor (i / ForestFire.WIDTH);

            var adjacent = [];

            if (x > 0) adjacent.push (y * ForestFire.WIDTH + x - 1);
            if (x < ForestFire.WIDTH-1) adjacent.push (y * ForestFire.WIDTH + x + 1);
            if (y > 0) adjacent.push ((y-1) * ForestFire.WIDTH + x);
            if (y < ForestFire.HEIGHT-1) adjacent.push ((y+1) * ForestFire.WIDTH + x);

            for (var j = 0 ; j < adjacent.length ; ++j)
            {
                var pos = adjacent [j];

                if (this.forest [pos] == ForestFire.MATURE)
                {
                    if (Math.random() < this.transitions [ForestFire.PROB_SPREAD])
                    {
                        this.forest [pos] = ForestFire.JUST_IGNITED;
                    }
                }
            }
        }
    }

    // Then advance the other cells

    for (var i = 0 ; i < ForestFire.AREA ; ++i)
    {
        var cell = this.forest [i];

        if (cell != ForestFire.JUST_IGNITED)
        {
            if (Math.random() < this.transitions [cell])
            {
                this.forest [i] = (cell + 1) % ForestFire.NUM_CELL_TYPES;
            }
        }
    }

    // Then convert the just ignited cells into real fire

    for (var i = 0 ; i < ForestFire.AREA ; ++i)
    {
        if (this.forest [i] == ForestFire.JUST_IGNITED)
        {
            this.forest [i] = ForestFire.FRESH_FIRE;
        }
    }
}
//-------------------------------------------------------------------------------------------------
// Update one of the probabilities
//-------------------------------------------------------------------------------------------------
ForestFire.prototype.SetProbability = function (idx, value)
{
    var p = parseFloat (value);

    if (p > 0 && p <= 1)
    {
        this.transitions[idx] = p;
    }
}
//-------------------------------------------------------------------------------------------------
// Get one of the probabilities
//-------------------------------------------------------------------------------------------------
ForestFire.prototype.GetProbability = function (idx)
{
    return this.transitions[idx];
}
//-------------------------------------------------------------------------------------------------
ForestFire.prototype.Draw = function ()
{
    var ctx = this.canvas.getContext("2d");

    ctx.fillStyle = ForestFire.colours [ForestFire.FRESH_SHOOTS];
    ctx. fillRect(0, 0, ForestFire.DISPLAY_WIDTH, ForestFire.DISPLAY_HEIGHT);

    var pos = 0;

    for (var y = 0 ; y < ForestFire.DISPLAY_HEIGHT ; y += ForestFire.CELL_SIZE)
    {
        for (var x = 0 ; x < ForestFire.DISPLAY_WIDTH ; x += ForestFire.CELL_SIZE)
        {
            var type = this.forest [pos];

            if (type != ForestFire.FRESH_SHOOTS)
            {
                ctx.fillStyle = ForestFire.colours [type];
                ctx. fillRect(x, y, ForestFire.CELL_SIZE, ForestFire.CELL_SIZE);
            }

            ++ pos;
        }
    }
}
//-------------------------------------------------------------------------------------------------
// Make a legend item
//-------------------------------------------------------------------------------------------------
ForestFire.SetLegendText = function (element_name, idx)
{
    var text = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"24\" height=\"24\" viewBox=\"0,0,23,23\">";

    text += "<polygon points=\"0,0 0,23 23,23 23,0\"";
    text += " style=\"stroke-width:1;stroke:black;fill-rule:nonzero;";
    text += "fill:" + ForestFire.colours [idx] + ";";

    text += "\"/></svg> ";
    text += ForestFire.cell_names [idx] + ".";

    element = document.getElementById(element_name);
    element.innerHTML = text;
}
