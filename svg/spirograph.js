//-------------------------------------------------------------------------------------------------
// Javascript spirograph Drawing
// (c) John Whitehouse 2013
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

var num_wheels = 2;
var max_wheels = 5;
var min_wheels = 2;

var num_points = 600;
var min_points = 3;
var max_points = 3000;

var wheel_sizes = [5,3,2,1,1];
var wheel_rates = [2,-5,9,-12,16];
var wheel_phases = [0,0,0,0,0];

var line_colour = "black";
var fill_colour = "none";
var fill_rule = "nonzero";

var randomiser = "None";

var colours = [ "Black", "Navy","DarkBlue", "MediumBlue", "Blue", "DarkGreen", "Green", "Teal",
                "DarkCyan", "DeepSkyBlue", "DarkTurquoise", "MediumSpringGreen", "Lime", "SpringGreen",
                "Aqua", "Cyan", "MidnightBlue", "DodgerBlue", "LightSeaGreen", "ForestGreen", "SeaGreen",
                "DarkSlateGray", "LimeGreen", "MediumSeaGreen", "Turquoise", "RoyalBlue", "SteelBlue",
                "DarkSlateBlue", "MediumTurquoise", "Indigo  ", "DarkOliveGreen", "CornflowerBlue",
                "MediumAquaMarine", "DimGray", "SlateBlue", "OliveDrab", "SlateGray", "LightSlateGray",
                "MediumSlateBlue", "LawnGreen", "Chartreuse", "Aquamarine", "Maroon", "Purple", "Olive",
                "Gray", "SkyBlue", "LightSkyBlue", "BlueViolet", "DarkRed", "DarkMagenta", "SaddleBrown",
                "DarkSeaGreen", "LightGreen", "MediumPurple", "DarkViolet", "PaleGreen", "DarkOrchid",
                "YellowGreen", "Sienna", "Brown", "DarkGray", "LightBlue", "GreenYellow", "PaleTurquoise",
                "LightSteelBlue", "PowderBlue", "FireBrick", "DarkGoldenRod", "MediumOrchid", "RosyBrown",
                "DarkKhaki", "Silver", "MediumVioletRed", "IndianRed ", "Peru", "Chocolate", "Tan",
                "LightGray", "Thistle", "Orchid", "GoldenRod", "PaleVioletRed", "Crimson", "Gainsboro",
                "Plum", "BurlyWood", "LightCyan", "Lavender", "DarkSalmon", "Violet", "PaleGoldenRod",
                "LightCoral", "Khaki", "AliceBlue", "HoneyDew", "Azure", "SandyBrown", "Wheat", "Beige",
                "WhiteSmoke", "MintCream", "GhostWhite", "Salmon", "AntiqueWhite", "Linen", "LightGoldenRodYellow",
                "OldLace", "Red", "Fuchsia", "Magenta", "DeepPink", "OrangeRed", "Tomato", "HotPink", "Coral",
                "DarkOrange", "LightSalmon", "Orange", "LightPink", "Pink", "Gold", "PeachPuff",
                "NavajoWhite", "Moccasin", "Bisque", "MistyRose", "BlanchedAlmond", "PapayaWhip",
                "LavenderBlush", "SeaShell", "Cornsilk", "LemonChiffon", "FloralWhite", "Snow", "Yellow",
                "LightYellow", "Ivory", "White", "#aabbcc"];

//-------------------------------------------------------------------------------------------------
// display the spirograph settings
//-------------------------------------------------------------------------------------------------
function DisplaySettings (element_name)
{
    var element = document.getElementById(element_name);

    if (element != null)
    {
        sizes = "";
        rates = "";
        phases = "";

        for (i = 0 ; i < num_wheels ; ++i)
        {
            if (i != 0)
            {
                sizes += ", ";
                rates += ", ";
                phases += ", ";
            }
            sizes += wheel_sizes [i];
            rates += wheel_rates [i];
            phases += wheel_phases [i];
        }

        text = "<table>";

        text += "<tr><td>Num wheels:</td><td>" + num_wheels + "</td></tr>";
        text += "<tr><td>Num points:</td><td>" + num_points + "</td></tr>";
        text += "<tr><td>Wheel sizes:</td><td>" + sizes + "</td></tr>";
        text += "<tr><td>Wheel rates:</td><td>" + rates + "</td></tr>";
        text += "<tr><td>Wheel phases:</td><td>" + phases + "</td></tr>";
        text += "<tr><td>Line:</td><td>" + line_colour + "</td></tr>";
        text += "<tr><td>Fill:</td><td>" + fill_colour + "</td></tr>";
        text += "<tr><td>Fill rule:</td><td>" + fill_rule + "</td></tr>";
        text += "<tr><td>Randomiser:</td><td>" + randomiser + "</td></tr>";

        text += "</table>";

        element.innerHTML = text;
    }
}
//-------------------------------------------------------------------------------------------------
// Draw the spirograph
//-------------------------------------------------------------------------------------------------
function DrawSpirograph (element_name)
{
    var element = document.getElementById(element_name);

    if (element != null)
    {
        radius = 0;
        phases = [0,0,0,0,0];

        // Calculate total radius and convert phases to radians

        for (i = 0 ; i < num_wheels ; i++)
        {
            radius += Math.abs (wheel_sizes [i]);
            phases [i] = wheel_phases [i] * Math.PI / 180;
        }

        factor = 180 / radius;

        var k = 2 * Math.PI / num_points;

        text = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"500\" height=\"500\" viewBox=\"-200,-200,400,400\">";
        points = "";

        for (i = 0 ; i < num_points ; i++)
        {
            a = i * k;
            x = 0;
            y = 0;

            for (j = 0 ; j < num_wheels ; j++)
            {
                a2 = a * wheel_rates [j] + phases [j];
                x += wheel_sizes [j] * Math.sin (a2);
                y += wheel_sizes [j] * Math.cos (a2);
            }

            x = x * factor;
            y = y * factor;

            points += x + "," + y + " ";
        }

        text += "<polygon points=\"" + points + "\"";
        text += " style=\"stroke-width:1;";
        text += "fill:" + fill_colour + ";";
        text += "stroke:" + line_colour + ";";
        text += "fill-rule:" + fill_rule + ";";

        text += "\"/></svg>";
        element.innerHTML = text;
    }
}
//-------------------------------------------------------------------------------------------------
// Increase the number of points used to draw the spirograph
//-------------------------------------------------------------------------------------------------
function IncrementPoints (picture, details, delta)
{
    num_points += delta;

    if (num_points < min_points) num_points = min_points;
    if (num_points > max_points) num_points = max_points;

    DrawSpirograph (picture);
    DisplaySettings (details);
}
//-------------------------------------------------------------------------------------------------
// Increase the number of wheels used to construct the pattern
//-------------------------------------------------------------------------------------------------
function IncrementWheels (picture, details, delta)
{
    num_wheels += delta;

    if (num_wheels < min_wheels) num_wheels = min_wheels;
    if (num_wheels > max_wheels) num_wheels = max_wheels;

    DrawSpirograph (picture);
    DisplaySettings (details);
}
//-------------------------------------------------------------------------------------------------
// Set the fill colour
//-------------------------------------------------------------------------------------------------
function SetFillColour (picture, details, colour)
{
    fill_colour = colour;

    DrawSpirograph (picture);
    DisplaySettings (details);
}
//-------------------------------------------------------------------------------------------------
// Set the fill colour
//-------------------------------------------------------------------------------------------------
function SetFillRule (picture, details, rule)
{
    fill_rule = rule;

    DrawSpirograph (picture);
    DisplaySettings (details);
}
//-------------------------------------------------------------------------------------------------
// Update a wheel's size
//-------------------------------------------------------------------------------------------------
function SetWheelSize (picture, details, wheel, delta)
{
    if (wheel >= 0 && wheel <= 4)
    {
        new_size = wheel_sizes [wheel] + delta;
        if (new_size < 1) new_size = 1;
        wheel_sizes [wheel] = new_size;

        DrawSpirograph (picture);
        DisplaySettings (details);
    }
}
//-------------------------------------------------------------------------------------------------
// Update a wheel's rate
//-------------------------------------------------------------------------------------------------
function SetWheelRate (picture, details, wheel, delta)
{
    if (wheel >= 0 && wheel <= 4)
    {
        new_rate = wheel_rates [wheel] + delta;
        if (new_rate == 0) new_rate = (delta > 0) ? 1 : -1;
        wheel_rates [wheel] = new_rate;

        DrawSpirograph (picture);
        DisplaySettings (details);
    }
}
//-------------------------------------------------------------------------------------------------
// Update a wheel's phase
//-------------------------------------------------------------------------------------------------
function SetWheelPhase (picture, details, wheel, delta)
{
    if (wheel >= 0 && wheel <= 4)
    {
        new_phase = (wheel_phases [wheel] + delta) % 360;
        if (new_phase < 0) new_phase += 360;
        wheel_phases [wheel] = new_phase;

        DrawSpirograph (picture);
        DisplaySettings (details);
    }
}
//-------------------------------------------------------------------------------------------------
// Creates a pattern with the requested symmetry
//-------------------------------------------------------------------------------------------------
function EnforceSymmetry (symm, first_wheel)
{
    // Make the number of points a multiple of the symmetry;

    temp = Math.floor ((num_points + symm - 1) / symm);
    num_points = temp * symm;

    // Adjust the wheels (1st two wheels define the symmetry)

    if (first_wheel == 1)
    {
        if (wheel_rates [1] > wheel_rates [0])
        {
            wheel_rates [1] = wheel_rates [0] + symm;
        }
        else
        {
            wheel_rates [1] = wheel_rates [0] - symm;
        }
    }

    // Elliminate degenerate patterns

    while (wheel_rates [0] == 0 || wheel_rates [1] == 0 || hcf (wheel_rates [1], wheel_rates [0]) > 1)
    {
        wheel_rates [0] += 1;
        wheel_rates [1] += 1;
    }

    // remaining wheels take the symmetry from the first two

    for (i = 2 ; i < num_wheels ; ++i)
    {
        delta = wheel_rates [i] - wheel_rates [0];
        temp = Math.floor ((delta + symm - 1) / symm);
        wheel_rates [i] = wheel_rates [0] + temp * symm;
    }
}
//-------------------------------------------------------------------------------------------------
// Increase/decrease the symmetry of the pattern
//-------------------------------------------------------------------------------------------------
function IncrementSymmetry (picture, details, delta)
{
    symm = GetSymmetry ();

    if (symm == 0) return;
    if (symm < 0) symm = - symm;

    symm += delta;

    if (symm > 1)
    {
        EnforceSymmetry (symm, 1);

        DrawSpirograph (picture);
        DisplaySettings (details);
    }
}
//-------------------------------------------------------------------------------------------------
// Adjust wheels 2-N to make the pattern symetrical
//-------------------------------------------------------------------------------------------------
function MakeSymmetrical (picture, details)
{
    symm = GetSymmetry ();

    EnforceSymmetry (symm, 2);

    DrawSpirograph (picture);
    DisplaySettings (details);
}
//-------------------------------------------------------------------------------------------------
// Back to the original values
//-------------------------------------------------------------------------------------------------
function Example (picture, details)
{
    num_wheels = 2;
    num_points = 298;
    wheel_rates [0] = 6;
    wheel_rates [1] = 79;
    line_colour = "black";
    fill_colour = "blue";
    fill_rule = "evenodd";

    DrawSpirograph (picture);
    DisplaySettings (details);
}
//-------------------------------------------------------------------------------------------------
// Randomise - takes a single parameter and randomises it
//-------------------------------------------------------------------------------------------------
function Randomise (picture, details)
{
    option = Math.floor (Math.random() * 9);

    switch (option)
    {
        case 0:
            randomiser = "Wheels";
            if (num_wheels == min_wheels)
            {
                num_wheels += 1;
            }
            else if (num_wheels == max_wheels)
            {
                num_wheels -= 1;
            }
            else
            {
                num_wheels += (Math.random () > 0.5) ? 1 : -1;
            }
            break;

        case 1:
            randomiser = "Points";
            num_points = min_points + RandomInteger (max_points - min_points);
            break;

        case 2:
            wheel = RandomInteger (num_wheels);
            randomiser = "Wheel-rate " + wheel;
            wheel_rates [wheel] += RandomInteger (5) - 2;
            break;

        case 3:
            wheel = RandomInteger (num_wheels);
            randomiser = "Wheel-rate " + wheel;
            wheel_sizes [wheel] += RandomInteger (5) - 2;
            break;

        case 4:
            wheel = RandomInteger (num_wheels);
            randomiser = "Wheel-rate " + wheel;
            wheel_phases [wheel] = RandomInteger (360);
            break;

        case 5:
            randomiser = "Fill colour";
            c = RandomInteger (colours.length);
            fill_colour = colours [c];
            break;

        case 6:
            randomiser = "Line colour";
            line_colour = (line_colour == "black") ? fill_colour : "black";
            break;

        case 7:
            randomiser = "Fill rule";
            fill_rule = (fill_rule == "nonzero") ? "evenodd" : "nonzero";
            break;

        case 8:
            randomiser = "Make Symmetrical";
            symm = GetSymmetry ();
            EnforceSymmetry (symm, 2);
            break;

        default:
            randomiser = option;
            break;
    }

    DrawSpirograph (picture);
    DisplaySettings (details);
}
//-------------------------------------------------------------------------------------------------
// Get a random integer in the range (0 - n-1)
//-------------------------------------------------------------------------------------------------
function RandomInteger (n)
{
    ret = Math.floor (Math.random () * n);
    if (ret == n) ret = n-1;
    return ret;
}
//-------------------------------------------------------------------------------------------------
// Get the symmetry
//-------------------------------------------------------------------------------------------------
function GetSymmetry ()
{
   symm = wheel_rates [1] - wheel_rates [0];
   if (symm < 0) symm = -symm;
   div = hcf (symm, wheel_rates [0]);
   return symm / div;
}
//-------------------------------------------------------------------------------------------------
// Get the highest common factor
//-------------------------------------------------------------------------------------------------
function hcf (x, y)
{
    x = Math.round (x);
    y = Math.round (y);

    if (x == 0 || y == 0) return 1;

    if (x < 0) x = -x;
    if (y < 0) y = -y;

    return hcf2 (x, y)
}
function hcf2 (x, y)
{
    if (x == 1 || y == 1) return 1;
    if (x == y) return x;

    return (x > y) ? hcf2 (x-y,x) : hcf2 (x,y-x);
}
//-------------------------------------------------------------------------------------------------
// Back to the original values
//-------------------------------------------------------------------------------------------------
function ResetParameters (picture, details)
{
    num_wheels = 2;
    num_points = 600;

    wheel_sizes [0] = 5;
    wheel_sizes [1] = 3;
    wheel_sizes [2] = 2;
    wheel_sizes [3] = 1;
    wheel_sizes [4] = 1;

    wheel_rates [0] = 6;
    wheel_rates [1] = -7;
    wheel_rates [2] = 19;
    wheel_rates [3] = -20;
    wheel_rates [4] = 123;

    wheel_phases [0] = 0;
    wheel_phases [1] = 0;
    wheel_phases [2] = 0;
    wheel_phases [3] = 0;
    wheel_phases [4] = 0;

    line_colour = "black";
    fill_colour = "yellow";
    fill_rule = "evenodd";

    DrawSpirograph (picture);
    DisplaySettings (details);
}

