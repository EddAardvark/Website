//-------------------------------------------------------------------------------------------------
// Mandelbrot complexity
// (c) John Whitehouse 2020 - 2023
// www.eddaardvark.co.uk
//
// Draws diagrams related to the complexity of the Mandelbrot set.
// Refers to various controls on the matching HTML page
//-------------------------------------------------------------------------------------------------
Complexity = function ()
{
}

Complexity.Initialise = function (n)
{
}



Complexity.in_animation = 0;
Complexity.ccl_colours = ["red", "green", "yellow", "yellow", "cyan"]

//-----------------------------------------------------------------------------
// Draw a circle into a canvas
//-----------------------------------------------------------------------------
Complexity.DrawCircle = function (ctx, x, y, r, colour)
{
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = colour;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();
}
//-----------------------------------------------------------------------------
// Calculate the nth 'c' polynomial by iterating c -> c*c + c
//-----------------------------------------------------------------------------
Complexity.CPolynomial = function (n)
{
   var p = [1];

   for (var i = 1 ; i < n ; ++i)
   {
     p = Complexity.SquarePolynomial (p);
     p.push (1);
   }
   return p;
}
//-----------------------------------------------------------------------------
// Square a polynomial. This version assumes the constant term is always 0
//-----------------------------------------------------------------------------
Complexity.SquarePolynomial = function (p)
{
   var n = p.length;
   var ret = [];

   for (var i = 0 ; i < 2*n-1 ; ++i)
   {
     ret.push(0);
   }
   for (var i = 0 ; i < n ; ++i)
   {
     ret [2 * i] += p[i] * p [i];
     for (var j = i+1 ; j < n ; ++j)
     {
       ret [i+j] += 2 * p[i] * p[j];
     }
   }
   return ret;
}
//-----------------------------------------------------------------------------
// Gets the nth polynomial and converts it to text.  Only accurate up to 7.
//-----------------------------------------------------------------------------
Complexity.GetCEquation = function (n)
{
   var text = "";
   var p = Complexity.CPolynomial (n);
   var first = true;

   for (var i in p)
   {
     var m = p.length - i;
     if (p[i] != 0)
     {
       if (! first) text += " + ";
       first = false;
       if (p[i] != 1) text += p[i];
       text += "c";
       if (m > 1)
       {
         text += "<span class=\"superscript\">" + m + "</span>";
       }
     }
   }
   return text;
}
//-----------------------------------------------------------------------------
// Shows a set of equations, from 1 to n (inclusive).
// Expects controls with id "lable1", "lable2", ... and "eq1", "eq2", ...
//-----------------------------------------------------------------------------
Complexity.ShowCSequence = function (n,label,eq)
{
   for (var i = 1 ; i <= n ; ++i)
   {
     var name1 = label + i;
     var name2 = eq + i;

     document.getElementById(name1).innerHTML = "z<span class=\"subscript\">" + i + "</span>&nbsp;&equals;&nbsp;";
     document.getElementById(name2).innerHTML = Complexity.GetCEquation (i);
   }
}
//-----------------------------------------------------------------------------
// Updates the orbit parameter and returns an arrat containing the orbit, the
// type of convergence and the number of iterations. Convergence types are:
//      -1 : diverges
//      0  : don't know
//      1+ : stationary point or cycle
//-----------------------------------------------------------------------------
Complexity.GetOrbit = function (c,limit)
{
    var z = Complex.FromComplex (c);

    orbit = [z];

    if (z.MagnitudeSquared() > 4)
    {
        return [orbit,-1,0];
    }
    
    
    for (var i = 0 ; i < limit ; ++i)
    {
        var z2 = z.Squared().Add (c);
        orbit.push (z2);

        if (z2.MagnitudeSquared() > 4)
        {
            return [orbit,-1,i];
        }
        
        var max_cycle = orbit.length - 1;

        for (j = 1 ; j <= max_cycle ; ++j)
        {
            var d2 = Complex.DistanceSquared (orbit [max_cycle], orbit [max_cycle-j]);
                        
            if (d2 < 1e-24)
            {
                var cycle = j;
                return [orbit,j,i];
                break;
            }
        }
        z = z2;
    }
    return [orbit,0,limit];
}
//-----------------------------------------------------------------------------
// Creates a description of the result of the GetOrbit function
//-----------------------------------------------------------------------------
Complexity.GetOrbitResultToText = function (result)
{
    switch (result [1])
    {
        case -1:
            return "Iteration diverged after " + result [2] + " iterations.";

        case 0:
            return "Iteration didn't converge, more iterations are required.";

        case 1:
            return "Iteration converged on the point " + orbit[orbit.length-1] + ".";

        default:
            return "Iteration converged on a " + result[1] + " cycle after " + result[2] + " iterations.";
    }
}
//-----------------------------------------------------------------------------
Complexity.CalculateSingularPoint = function (r_element, i_element, view_element)
{
    var x = parseFloat (r_element.value);
    var y = parseFloat (i_element.value);

    var c = new Complex (x, y);
    var pts = Complexity.GetAttractors (c);

    var text = "C = " + c + ",<br>Point 1 = " + pts[0] + ",<br>Point 2 = " + pts[1];

    text += "<br>2&#x2011;cycle = " + pts[2] + " &#x2194; " + pts[3];
    view_element.innerHTML = text;
}
//-----------------------------------------------------------------------------
// returns the two singular attractive points and the 2&#x2011;cycle for a 'c' value..
//
// Points = 1/2 +/- sqrt (1/4 - C)
// Cycle = -1/2 +/- sqrt (1/4 - (C+1))
//-----------------------------------------------------------------------------
Complexity.GetAttractors = function (c)
{
    var temp = c.SubtractFromFloat (0.25);
    temp = temp.SquareRoot ();

    var t2 = c.SubtractFromFloat (-0.75);
    t2 = t2.SquareRoot ();

    return [temp.AddFloat (0.5), temp.SubtractFromFloat (0.5),
            t2.AddFloat (-0.5), t2.SubtractFromFloat (-0.5)];
}
//-------------------------------------------------------------
// Start the phase animations
//-------------------------------------------------------------
Complexity.StartAnimation = function (fun)
{
    if (Complexity.in_animation)
    {
        StopAnimation ();
    }

    timer = setInterval(fun, 100);
    Complexity.in_animation = true;
}
//-------------------------------------------------------------
// Start the phase animations
//-------------------------------------------------------------
Complexity.StopAnimation = function ()
{
    if (Complexity.in_animation)
    {
        Complexity.in_animation = false;
        clearInterval(timer);
    }
}
//-----------------------------------------------------------------------------
Complexity.DrawOrbit = function (r_element, i_element, max_element, view_element)
{
    var x = parseFloat (r_element.value);
    var y = parseFloat (i_element.value);
    var limit = parseInt (max_element.value);

    var c = new Complex (x, y);

    Complexity.DoDrawOrbit (c, limit, view_element);
}
//-----------------------------------------------------------------------------
Complexity.animate_mode = "none";
Complexity.animate_p1;
Complexity.animate_p2;
Complexity.animate_step;
Complexity.animate_steps;
Complexity.animate_view;
Complexity.animate_limit;
Complexity.animate_distance;

Complexity.AnimateOrbit = function (r_element, i_element, max_element, view_element,
                            r2_element,i2_element,s_element,mode)
{
    var x =  parseFloat (r_element.value);
    var y =  parseFloat (i_element.value);
    var x2 = parseFloat (r2_element.value);
    var y2 = parseFloat (i2_element.value);
    var dx = x2 - x;
    var dy = y2 - y;

    animate_mode = mode;
    animate_p1 = [x, y];
    animate_p2 = [x2, y2];
    animate_step = 0;
    animate_steps = parseInt (s_element.value);
    animate_view = view_element;
    animate_limit = parseInt (max_element.value);
    animate_distance = Math.sqrt (dx * dx + dy * dy);

    Complexity.StartAnimation (Complexity.NextOrbit);
}
//-----------------------------------------------------------------------------
Complexity.NextOrbit = function ()
{
    if (animate_mode == "none")
    {
        return;
    }
    if (animate_mode == "line")
    {
        var f = animate_step / animate_steps;
        var x = animate_p1 [0] * (1 - f) + animate_p2 [0] * f;
        var y = animate_p1 [1] * (1 - f) + animate_p2 [1] * f;
    }
    else if (animate_mode == "circle")
    {
        var angle = animate_step * Math.PI * 2 / animate_steps;
        var x = animate_p1 [0] + animate_distance * Math.cos (angle);
        var y = animate_p1 [1] + animate_distance * Math.sin (angle);
    }

    var c = new Complex (x, y);

    Complexity.DoDrawOrbit (c, animate_limit, animate_view);

    ++ animate_step;
    
    current_location.innerHTML = Misc.Format ("{0}: ({1},{2})", animate_step, Misc.FloatToText(x, 9), Misc.FloatToText (y, 9));
    

    if (animate_step == animate_steps)
    {
        if (animate_mode == "line")
        {
            var temp = animate_p1;

            animate_p1 = animate_p2;
            animate_p2 = temp;
        }

        animate_step = 0;
    }
}
//-----------------------------------------------------------------------------
Complexity.DoDrawOrbit = function (c, limit, view)
{
    var result = Complexity.GetOrbit (c,limit);
    var orbit = result[0];
    var pts = Complexity.GetAttractors (c);

    var svg = SVGHelp.Start (480, 480, -2.05, -2.05, 2.05, 2.05);

    // Grid

    svg += SVGHelp.DashedLine ([-2.05,0], [2.05,0], "black", "5,2")
    svg += SVGHelp.DashedLine ([0,-2.05], [0,2.05], "black", "5,2")
    svg += SVGHelp.Circle (0, 0, 2, "none", "black");

    // Orbit

    var p1 = [orbit[0].x, orbit[0].y];

    for (var i = 1 ; i < orbit.length ; ++i)
    {
        var p2 = [orbit[i].x, orbit[i].y];
        svg += SVGHelp.Line (p1, p2, "orangered");
        p1 = p2;
    }

    var rad = 4.1 / 200;
    for (var i = 1 ; i < orbit.length ; ++i)
    {
        svg += SVGHelp.Circle (orbit[i].x, orbit[i].y, rad, "crimson", "black");
    }

    // Attractors

    for (var i = 0 ; i < 4 ; ++i)
    {
        svg += SVGHelp.Circle (pts[i].x, pts[i].y, rad * 1.5, Complexity.ccl_colours[i], "black");
    }
    // Starting point

    svg += SVGHelp.Circle (orbit[0].x, orbit[0].y, rad * 1.5, Complexity.ccl_colours[4], "black");

    view.innerHTML = svg;
}
//-----------------------------------------------------------------------------
Complexity.DrawCycle = function (r_element, i_element, max_element, view_element, mode)
{
    var x = parseFloat (r_element.value);
    var y = parseFloat (i_element.value);
    var limit = parseInt (max_element.value);
    var view = view_element;

    var c = new Complex (x, y);
    var result = GetOrbit (c,limit);
    var orbit = result[0];
    var text = GetOrbitResultToText (result);
    var svg = "";
    var cycle_size = result[1];

    if (cycle_size > 0)
    {
        var new_cycle_size = ReduceOrbit (orbit, cycle_size);

        if (new_cycle_size < cycle_size)
        {
            text += "<br>Reduced to " + new_cycle_size + " after analysis.";
        }

        svg += SVGHelp.Start (480, 480, -2.05, -2.05, 2.05, 2.05);

        svg += SVGHelp.DashedLine ([-2.05,0], [2.05,0], "black", "5,2")
        svg += SVGHelp.DashedLine ([0,-2.05], [0,2.05], "black", "5,2")
        svg += SVGHelp.Circle (0, 0, 2, "none", "black");

        var p1 = [orbit[0].x, orbit[0].y];

        for (var i = orbit.length - new_cycle_size - 1 ; i < orbit.length ; ++i)
        {
            var p2 = [orbit[i].x, orbit[i].y];
            svg += SVGHelp.Line (p1, p2, "orangered");
            p1 = p2;
        }

        var rad = 4.1 / 200;
        for (var i = orbit.length - new_cycle_size - 1 ; i < orbit.length ; ++i)
        {
            svg += SVGHelp.Circle (orbit[i].x, orbit[i].y, rad, "crimson", "black");
        }

    // Start and Attractors

        var pts = GetAttractors (c);

        for (var i = 0 ; i < 4 ; ++i)
        {
            svg += SVGHelp.Circle (pts[i].x, pts[i].y, rad * 1.5, ccl_colours[i], "black");
        }
        svg += SVGHelp.Circle (orbit[0].x, orbit[0].y, rad * 1.5, ccl_colours[4], "black");
    }

    view.innerHTML = svg + "<p>" + text;
}
//-----------------------------------------------------------------------------
// Draw a map of how different points finish their orbits
//
// Draws a 120x120 grid using 480x480 pixels
//-----------------------------------------------------------------------------

Complexity.SIZE = 480;
Complexity.CELL = 1;
Complexity.NUM_CELLS = Complexity.SIZE / Complexity.CELL;
Complexity.HALF_CELLS = Complexity.NUM_CELLS / 2;
Complexity.colours =
[
    "palevioletred", "red", "blue", "yellow", "cyan",
    "white", "magenta", "green", "olive",
    "palegoldenrod", "lavender", "seashell", "firebrick",
    "saddlebrown", "dimgray", "lime"
];
Complexity.NUM_COLOURS = Complexity.colours.length;

Complexity.DrawCycleMap = function (x,y,limit,size,image_element,key_element)
{
    var map = {};
    var delta = size / Complexity.NUM_CELLS;
    var r0 = x - Complexity.HALF_CELLS * delta;
    var i0 = y - Complexity.HALF_CELLS * delta;

    for (var i = 0 ; i < Complexity.NUM_CELLS ; ++i)
    {
        var r = r0 + i * delta;

        for (var j = 0 ; j < Complexity.NUM_CELLS ; ++j)
        {
            var c = new Complex (r, i0 + j * delta);
            var result = Complexity.GetOrbit (c,limit);
            var cycle_size = result [1];

            if (cycle_size != -1)
            {
                if (cycle_size > 1)
                {
                    cycle_size = Complexity.ReduceOrbit (result[0], cycle_size);
                }
                if (! map.hasOwnProperty (cycle_size))
                {
                    map [cycle_size] = [];
                }
                map [cycle_size].push ([i,j]);
            }
        }
    }

    // Create a canvas to draw the image

    var canvas = document.createElement('canvas');
    canvas.width = Complexity.SIZE;
    canvas.height = Complexity.SIZE;

    // Draw the picture

    var ctx = canvas.getContext("2d");
    var key_text = "";

    for (var cycle in map)
    {
        if (cycle == 0)
        {
            var clr = "black";
            key_text += "<span style=\"margin:6pt; background-color:black; color:white;\"> &nbsp;indeterminate&nbsp; </span> ";
        }
        else
        {
            var clr = Complexity.colours[cycle % Complexity.NUM_COLOURS];
            var cycle_text = cycle + "&minus;cycle";
            key_text += "<span style=\"margin:6pt; background-color:" + clr + ";\">&nbsp;" + cycle_text + "&nbsp;</span> ";
        }
        ctx.fillStyle = clr;

        for (var i = 0 ; i < map[cycle].length ; ++i)
        {
            var x = map[cycle][i][0] * Complexity.CELL;
            var y = map[cycle][i][1] * Complexity.CELL;

            ctx.fillRect(x, y, Complexity.CELL, Complexity.CELL);
        }
    }

    // Transfer canvas to image

    image_element.src = canvas.toDataURL();
    key_element.innerHTML = key_text;
}
//-----------------------------------------------------------------------------
Complexity.AT_SIZE = 480;
Complexity.AT_X = 0.0;
Complexity.AT_Y = 0.0;
Complexity.AT_WIDTH = 4;
Complexity.AT_DX = Complexity.AT_WIDTH / Complexity.AT_SIZE;
Complexity.AT_DY = Complexity.AT_WIDTH / Complexity.AT_SIZE;
Complexity.AT_R0 = Complexity.AT_X - Complexity.AT_WIDTH / 2;
Complexity.AT_I0 = Complexity.AT_Y - Complexity.AT_WIDTH / 2;
Complexity.AT_CELL_X = Complexity.AT_SIZE / Complexity.AT_SIZE;
Complexity.AT_CELL_Y = Complexity.AT_SIZE / Complexity.AT_SIZE;
//-----------------------------------------------------------------------------
Complexity.DrawIterations = function (c,n,image)
{
    var pts = Complexity.GetAttractors (c);
    var max_r1 = 100;
    var max_r2 = 100;
    var best_r1 = null;
    var best_r2 = null;

    var canvas = document.createElement('canvas');
    canvas.width = Complexity.SIZE;
    canvas.height = Complexity.SIZE;
    var ctx = canvas.getContext("2d");

    // Draw the picture

    for (var i = 0 ; i < Complexity.AT_SIZE ; ++i)
    {
        var r = Complexity.AT_R0 + i * Complexity.AT_DX;

        for (var j = 0 ; j < Complexity.AT_SIZE ; ++j)
        {
            var z = new Complex (r, Complexity.AT_I0 + j * Complexity.AT_DY);
            var z0 = z;

            for (var k = 0; k < n ; ++k)
            {
                z = z.Multiply (z);
                z = z.Add (c);    // z^2 + c
            }

            var log = [0,0,0,0];

            for (var k = 0 ; k < 4 ; ++k)
            {
                var d1 = z0.Subtract (pts[k]).Magnitude();
                var d3 = z.Subtract (pts[k]).Magnitude();

                log [k] = (d1 > 0) ? Math.log10 (d3 / d1) : 0;
            }

            var red = 0;        // P1
            var green = 0;      // P2
            var blue = 0;       // P3

            // First singleton (red), 2nd sigleton (green), 2&#x2011;cycle (blue)

            if (log [0] < 0)
            {
                red = Math.floor (255 * Math.min (-log[0],1.5) / 1.5);
            }
            if (log [1] < 0)
            {
                green = Math.floor (255 * Math.min (-log[1],1.5) / 1.5);
            }
            var lmin = Math.min (log[2],log[3]);
            if (lmin < 0)
            {
                blue = Math.floor (255 * Math.min (-lmin,1.5) / 1.5);
            }

            var fs = SVGColours.ToHTMLValue (red, green, blue);

            ctx.fillStyle = fs;
            ctx.fillRect(i * Complexity.AT_CELL_X, j * Complexity.AT_CELL_Y, Complexity.AT_CELL_X, Complexity.AT_CELL_Y);
        }
    }

    // Draw interesting points

    for (var i = 0 ; i < 4 ; ++i)
    {
        var x = (pts[i].x - Complexity.AT_R0) * 480 / Complexity.AT_WIDTH;
        var y = (pts[i].y - Complexity.AT_I0) * 480 / Complexity.AT_WIDTH;

        Complexity.DrawCircle (ctx, x, y, 5, Complexity.ccl_colours[i]);
    }

    x = (c.x - Complexity.AT_R0) * Complexity.SIZE / Complexity.AT_WIDTH;
    y = (c.y - Complexity.AT_I0) * Complexity.SIZE / Complexity.AT_WIDTH;

    Complexity.DrawCircle (ctx, x, y, 5, Complexity.ccl_colours[i]);

    // Transfer canvas to image

    image.src = canvas.toDataURL();
}
//-----------------------------------------------------------------------------
// The orbit detector looks for floating point numbers that are identical.
// Unfortunately the finite reality of floating point numbers means that
// additional levels of multiplicity can be introduded. This functions trys
// to establish the real order of a cycle by looking for points that are
// less that 10e-14 appart.
//-----------------------------------------------------------------------------
Complexity.ReduceOrbit = function (orbit, cycle_size)
{
    var limit = 1e-24;

    if (orbit.length < cycle_size)
    {
        return cycle_size;
    }

    var real_orbit = cycle_size;
    var os = orbit [orbit.length - 1];
    var start = orbit.length - cycle_size;

    for (var i = 1 ; i <= cycle_size / 2 ; ++i)
    {
        if (cycle_size % i == 0)
        {
            var pos = orbit.length - 1 - i;
            var dist2 = Complex.DistanceSquared (os, orbit [pos]);

            if (dist2 < limit)
            {
                real_orbit = i;
                break;
            }
        }
    }
    return real_orbit;
}