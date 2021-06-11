var polygon_sides = 3;
var polygon_steps = 1;

var line_colour = "black";
var fill_colour = "none";
var fill_rule = "nonzero";

var min_sides = 3;
var max_sides = 600;
var min_steps = 1;


//-------------------------------------------------------------------------------------------------
// display the spirograph settings
//-------------------------------------------------------------------------------------------------
function DisplaySettings (element_name)
{
    var element = document.getElementById(element_name);

    if (element != null)
    {
        text = "<table>";
        text += "<tr><td>Sides:</td><td>" + polygon_sides + "</td></tr>";
        text += "<tr><td>Step:</td><td>" + polygon_steps + "</td></tr>";
        text += "<tr><td>Line:</td><td>" + line_colour + "</td></tr>";
        text += "<tr><td>Fill:</td><td>" + fill_colour + "</td></tr>";
        text += "<tr><td>Fill rule:</td><td>" + fill_rule + "</td></tr>";
        text += "</table>";

        element.innerHTML = text;
    }
}
//-------------------------------------------------------------------------------------------------
// Draw the polygon
//-------------------------------------------------------------------------------------------------
function DrawPolygon (element_name)
{
    var element = document.getElementById(element_name);

    if (element != null)
    {
        var k = 2 * Math.PI * polygon_steps / polygon_sides;
        text = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"500\" height=\"500\" viewBox=\"-200,-200,400,400\">";
        points = "";

        for (i = 0 ; i < polygon_sides ; i++)
        {
            a = i * k;
            x = 180 * Math.sin (a);
            y = 180 * Math.cos (a);
            points += x + "," + y + " ";
        }

        text += "<polygon points=\"" + points + "\"";
        text += " style=\"";
        text += "fill:" + fill_colour + ";";
        text += "stroke:" + line_colour + ";";
        text += "stroke-width:1;";
        text += "fill-rule:" + fill_rule + ";";
        text += "\"/></svg>";

        element.innerHTML = text;
    }
}
//-------------------------------------------------------------------------------------------------
// Increase the number of polygon points
//-------------------------------------------------------------------------------------------------
function IncrementSides (picture, details, delta)
{
    polygon_sides += delta;

    if (polygon_sides < min_sides) polygon_sides = min_sides;
    if (polygon_sides > max_sides) polygon_sides = max_sides;
    if (polygon_steps >= polygon_sides) polygon_steps = polygon_sides - 1;

    DrawPolygon (picture);
    DisplaySettings (details);
}
//-------------------------------------------------------------------------------------------------
// Increase the number of polygon steps
//-------------------------------------------------------------------------------------------------
function IncrementSteps (picture, details, delta)
{
    polygon_steps += delta;

    if (polygon_steps < min_steps) polygon_steps = min_steps;
    if (polygon_steps >= polygon_sides) polygon_steps = polygon_sides - 1;

    DrawPolygon (picture);
    DisplaySettings (details);
}
//-------------------------------------------------------------------------------------------------
// Set the fill colour
//-------------------------------------------------------------------------------------------------
function SetFillColour (picture, details, colour)
{
    fill_colour = colour;

    DrawPolygon (picture);
    DisplaySettings (details);
}
//-------------------------------------------------------------------------------------------------
// Set the fill colour
//-------------------------------------------------------------------------------------------------
function SetFillRule (picture, details, rule)
{
    fill_rule = rule;

    DrawPolygon (picture);
    DisplaySettings (details);
}

