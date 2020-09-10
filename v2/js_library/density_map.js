//-------------------------------------------------------------------------------------------------
// Construct and draw density maps (colours pixels according to the value of a function atan
// that point.
//
// Uses misc.js, canvas_helpers.js, colours.js
//
// (c) John Whitehouse 2020
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

DensityMap = function ()
{
}

//-------------------------------------------------------------------------------------------------
// chelp - canvas_helpers
// fun - function that returns the density at a coordinate: d = fun(x,y);
//-------------------------------------------------------------------------------------------------
DensityMap.prototype.Initialise = function (object, fun)
{
    this.fun = fun;
    this.object = object;

    this.canvas_x0 = 0;
    this.canvas_y0 = 0;
    this.canvas_w = 100;
    this.canvas_h = 100;
    
    this.domain_x0 = 0;
    this.domain_y0 = 0;
    this.domain_h = 1;
    this.domain_w = 1;
    
    this.value_min = 0;
    this.value_max = 1;
    
    this.colour_map = SVGColours.CreateColourRange ("midnightblue", "aliceblue", 100);
    this.background = "gray";
}
//-------------------------------------------------------------------------------------------------
DensityMap.prototype.SetDomainRect = function (x, y, w, h)
{
    this.domain_x0 = x;
    this.domain_y0 = y;
    this.domain_w = w;
    this.domain_h = h;
}
//-------------------------------------------------------------------------------------------------
DensityMap.prototype.SetCanvasRect = function (x, y, w, h)
{
    this.canvas_x0 = x;
    this.canvas_y0 = y;
    this.canvas_w = w;
    this.canvas_h = h;
}
//-------------------------------------------------------------------------------------------------
DensityMap.prototype.SetValueRange = function (vmin, vmax)
{
    this.value_min = vmin;
    this.value_max = vmax;
}
//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
DensityMap.prototype.Draw = function (chelp, image_element)
{
    var w = chelp.canvas.width;
    var h = chelp.canvas.height;
    var x0 = 0;
    var y0 = h;
    var nc = this.colour_map.length - 1;
    var xf = this.domain_w / this.canvas_w;
    var yf = this.domain_h / this.canvas_h;
    var vf = nc / (this.value_max - this.value_min);

    chelp.SetBackground (this.background);
    chelp.SetForeground ("white");
    chelp.SetLineWidth (1);

    chelp.DrawFilledRect (0, 0, chelp.canvas.width, chelp.canvas.height);   
    
    for (var i = 0 ; i < this.canvas_w ; ++i)
    {
        var x = this.domain_x0 + i * xf;

        for (var j = 0 ; j < this.canvas_h ; ++j)
        {
            var y = this.domain_y0 + j * yf;
            var v = this.fun.call (this.object, x, y);
            
            if (v !== null)
            {
                var c = Math.floor ((v - this.value_min) * vf);

                c = Math.min (Math.max (0, c), nc);
                        
                chelp.SetBackground (this.colour_map [c]);
                chelp.FillRect (this.canvas_x0 + i, h - (this.canvas_y0 + j), 1, 1);   
            }
        }
    }
    
    image_element.src = chelp.canvas.toDataURL('image/png');    
}

