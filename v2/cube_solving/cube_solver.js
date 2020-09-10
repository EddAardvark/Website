//-------------------------------------------------------------------------------------------------
// Javascript CubsSolver class definition.
// (c) John Whitehouse 2014
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

// key points, the rest are reflections

var p1a = [30,0];
var p2a = [120,0];
var p3a = [150,0];
var p4a = [135,50];
var p5a = [100,100];
var p6a = [200,200];

// 2nd octant reflect 'a' in x = y (x <-> y)

var p1b = [0,30];
var p2b = [0,120];
var p3b = [0,150];
var p4b = [50,135];
var p5b = [100,100];
var p6b = [200,200];

// 3rd & 4th reflect in x = 0 (x -> -x)

var p1c = [-30,0];
var p2c = [-120,0];
var p3c = [-150,0];
var p4c = [-135,50];
var p5c = [-100,100];
var p6c = [-200,200];

var p1d = [0,30];
var p2d = [0,120];
var p3d = [0,150];
var p4d = [-50,135];
var p5d = [-100,100];
var p6d = [-200,200];

// 5th - 8th reflect in y = 0 (y -> -y)

var p1e = [30,0];
var p2e = [120,0];
var p3e = [150,0];
var p4e = [135,-50];
var p5e = [100,-100];
var p6e = [200,-200];

var p1f = [0,-30];
var p2f = [0,-120];
var p3f = [0,-150];
var p4f = [50,-135];
var p5f = [100,-100];
var p6f = [200,-200];

var p1g = [-30,0];
var p2g = [-120,0];
var p3g = [-150,0];
var p4g = [-135,-50];
var p5g = [-100,-100];
var p6g = [-200,-200];

var p1h = [0,-30];
var p2h = [0,-120];
var p3h = [0,-150];
var p4h = [-50,-135];
var p5h = [-100,-100];
var p6h = [-200,-200];

// 3d points (taken from the image)

var p1 = [306,40];
var p2 = [531,150];
var p3 = [490,351];
var p4 = [338,509];
var p5 = [142,364];
var p6 = [111,162];

var p7 = [291,139];
var p8 = [359,134];
var p9 = [369,184];
var p10 = [294,188];

var p11 = [425,301];
var p12 = [461,315];
var p13 = [431,372];
var p14 = [396,357];

var p15 = [274,366];
var p16 = [223,378];
var p17 = [187,321];
var p18 = [238,304];

var p19 = [350,318];

// Plan view

var plan_shapes =
[
    // 0-4 centre squares

    [p1a, p1d, p1g, p1f],
    [p2a, p4a, p3a, p4e],
    [p2c, p4c, p3c, p4g],
    [p2b, p4b, p3b, p4d],
    [p2f, p4f, p3f, p4h],

    // 5-8 Centre diagonals

    [p1a,p1b,p5a],
    [p1c,p1d,p5c],
    [p1e,p1f,p5e],
    [p1g,p1h,p5g],

    // 9-12 Right diagonals

    [p2a,p4a,p5a],
    [p2e,p4e,p5e],
    [p3a,p4a,p6a],
    [p3e,p4e,p6e],

    // 13-16 Left diagonals

    [p2c,p4c,p5c],
    [p2g,p4g,p5g],
    [p3c,p4c,p6c],
    [p3g,p4g,p6g],

    // 17-20 Top diagonals

    [p2b,p4b,p5b],
    [p2d,p4d,p5d],
    [p3b,p4b,p6b],
    [p3d,p4d,p6d],

    // 21-24 Bottom diagonals

    [p2f,p4f,p5f],
    [p2h,p4h,p5h],
    [p3f,p4f,p6f],
    [p3h,p4h,p6h],

    // 25-28 Right edges

    [p5a,p5e,p2a],
    [p4a,p5a,p6a],
    [p3a,p6a,p6e],
    [p4e,p5e,p6e],

    // 29-32 Left edges

    [p5c,p5g,p2c],
    [p4c,p5c,p6c],
    [p3c,p6c,p6g],
    [p4g,p5g,p6g],

    // 33-36 Top edges

    [p5b,p5d,p2b],
    [p4b,p5b,p6b],
    [p3b,p6b,p6d],
    [p4d,p5d,p6d],

    // 37-40 Bottom edges

    [p5f,p5h,p2f],
    [p4f,p5f,p6f],
    [p3f,p6f,p6h],
    [p4h,p5h,p6h],

    // 41 - 44 Centre edges

    [p1a,p5a,p5e],
    [p1b,p5b,p5d],
    [p1c,p5c,p5g],
    [p1f,p5f,p5h],

    // 45 - 53 Bottom face is invisible
];

// 3D view - same indeces but some shapes are invisible

var alternate_shapes =
[
    // 0-4 centre squares

    [p7, p8, p9, p10],
    [p11, p12, p13, p14],
    [],
    [p15,p16,p17,p18],
    [],

    // 5-8 Centre diagonals

    [p9,p10,p19],
    [p6,p7,p10],
    [p2,p8,p9],
    [p1,p7,p8],

    // 9-12 Right diagonals

    [p11,p14,p19],
    [p2,p11,p12],
    [p4,p13,p14],
    [p3,p12,p13],

    // 13-16 Left diagonals

    [], [], [], [],

    // 17-20 Top diagonals

    [p15,p18,p19],
    [p6,p17,p18],
    [p4,p15,p16],
    [p5,p16,p17],

    // 21-24 Bottom diagonals

    [], [], [], [],

    // 25-28 Right edges

    [p2,p11,p19],
    [p4,p14,p19],
    [p3,p4,p13],
    [p2,p3,p12],

    // 29-32 Left edges

    [], [], [], [],

    // 33-36 Top edges

    [p6,p18,p19],
    [p4,p15,p19],
    [p4,p5,p16],
    [p5,p6,p17],

    // 37-40 Bottom edges

    [], [], [], [],

    // 41 - 44 Centre edges

    [p2,p9,p19],
    [p6,p10,p19],
    [p1,p6,p7],
    [p1,p2,p8],

    // 45 - 53 Bottom face is invisible

];

var is_edge =
[
    false, false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    true, true, true, true,
    true, true, true, true,
    true, true, true, true,
    true, true, true, true,
    true, true, true, true,
];

var is_diagonal =
[
    false, false, false, false, false,
    true, true, true, true,
    true, true, true, true,
    true, true, true, true,
    true, true, true, true,
    true, true, true, true,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
];

var CENTRE = "yellow";
var RIGHT = "green";
var LEFT = "blue";
var TOP = "red";
var BOTTOM = "orange";
var INVISIBLE = "#EEEEEE";

var DK_CENTRE = "#EEEE00";
var DK_RIGHT = "#007000";
var DK_LEFT = "#0000DD";
var DK_TOP = "#DD0000";
var DK_BOTTOM = "#DD7000";
var DK_INVISIBLE = "#DDDDDD";

var LT_CENTRE = "#FFFF80";
var LT_RIGHT = "#209020";
var LT_LEFT = "#4040FF";
var LT_TOP = "#FF3030";
var LT_BOTTOM = "#FF9020";
var LT_INVISIBLE = "#FFFFFF";


var colours = new Array (53);

var default_colours =
[
    CENTRE, RIGHT, LEFT, TOP, BOTTOM,
    DK_CENTRE, LT_CENTRE, LT_CENTRE, DK_CENTRE,
    DK_RIGHT, LT_RIGHT, LT_RIGHT, DK_RIGHT,
    LT_LEFT, DK_LEFT, DK_LEFT, LT_LEFT,
    DK_TOP, LT_TOP, LT_TOP, DK_TOP,
    LT_BOTTOM, DK_BOTTOM, DK_BOTTOM, LT_BOTTOM,
    RIGHT, RIGHT, RIGHT, RIGHT,
    LEFT, LEFT, LEFT, LEFT,
    TOP, TOP, TOP, TOP,
    BOTTOM, BOTTOM, BOTTOM, BOTTOM,
    CENTRE, CENTRE, CENTRE, CENTRE,
    INVISIBLE, LT_INVISIBLE, INVISIBLE, DK_INVISIBLE, INVISIBLE, DK_INVISIBLE, INVISIBLE, LT_INVISIBLE, INVISIBLE
]

var draw_numbers = false;
var draw_3d = true;

var transform = {};
var equation = {};

var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

transform ['A'] =
[
    [40,44,29], [32,37,43], [22,8,14], [24,7,13], [4,0,2], [21,6,16]
];
transform ['a'] =
[
    [29,44,40], [43,37,32], [14,8,22], [13,7,24], [2,0,4], [16,6,21]
];
transform ['B'] =
[
    [22,12,5], [4,1,0], [23,9,8], [37,28,41], [21,10,7], [38,25,44]
];
transform ['b'] =
[
    [5,12,22], [0,1,4], [8,9,23], [41,28,37], [7,10,21], [44,25,38]
];
transform ['C'] =
[
    [7,11,18], [0,1,3], [6,10,19], [42,25,34], [5,9,17], [41,26,33]
];
transform ['c'] =
[
    [18,11,7], [3,1,0], [19,10,6], [34,25,42], [17,9,5], [33,26,41]
];
transform ['D'] =
[
    [20,14,5], [3,2,0], [17,15,8], [36,29,42], [18,13,6], [33,30,43]
];
transform ['d'] =
[
    [5,14,20], [0,2,3], [8,15,17], [42,29,36], [6,13,18], [43,30,33]
];
transform ['Z'] =
[
    [39,27,35,31], [23,11,20,16], [38,26,36,32],
    [24,12,19,15], [4,1,3,2], [21,9,18,14],
    [40,28,34,30], [22,10,17,13], [37,25,33,29],
    [44,41,42,43], [7,5,6,8],
    [45,51,53,47], [48,52,50,46]

];
transform ['z'] =
[
    [31,35,27,39], [16,20,11,23], [32,36,26,38],
    [15,19,12,24], [2,3,1,4], [14,18,9,21],
    [30,34,28,40], [13,17,10,22], [29,33,25,37],
    [43,42,41,44], [8,6,5,7],
    [47,53,51,45], [46,50,52,48]
];

transform ['y'] =
[
    [31,32,29,30], [16,14,13,15], [26,27,28,25], [11,12,10,9],
    [34,51,38,41], [3,49,4,0], [33,53,39,44], [35,45,37,42],
    [17,52,23,7], [19,48,21,5], [20,46,22,6], [18,50,24,8],
    [36,47,40,43]
];

transform ['Y'] =
[
    [30,29,32,31], [15,13,14,16], [25,28,27,26], [9,10,12,11],
    [41,38,51,34], [0,4,49,3], [44,39,53,33], [42,37,45,35],
    [7,23,52,17], [5,21,48,19], [6,22,46,20], [8,24,50,18],
    [43,40,47,36]
]

transform ['x'] =
[
    [40,39,38,37], [24,23,21,22], [36,35,34,33], [18,20,19,17],
    [32,45,28,44], [29,47,27,41], [30,53,26,42], [31,51,25,43],
    [14,46,12,7], [13,50,11,5], [15,52,9,6], [16,48,10,8],
    [2,49,1,0]
];

transform ['X'] =
[
    [37,38,39,40], [22,21,23,24], [33,34,35,36], [17,19,20,18],
    [44,28,45,32], [41,27,47,29], [42,26,53,30], [43,25,51,31],
    [7,12,46,14], [5,11,50,13], [6,9,52,15], [8,10,48,16],
    [0,1,49,2]
];

var DRAW_ALL = 0;
var DRAW_EDGES = 1;
var DRAW_DIAGONALS = 2;

var draw_mode = DRAW_ALL;

//-------------------------------------------------------------------------------------------------
function CubeSolver ()
{
}
//-------------------------------------------------------------------------------------------------
CubeSolver.Initialise = function ()
{
    CubeSolver.Reset ();
}
//-------------------------------------------------------------------------------------------------
// Draw the cube
//-------------------------------------------------------------------------------------------------
CubeSolver.DrawCube = function (element)
{
    var text;

    if (draw_3d)
    {
        text = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"500\" height=\"500\" viewBox=\"100,30,500,500\">";
        shapes = alternate_shapes;
    }
    else
    {
        text = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"500\" height=\"500\" viewBox=\"-200,-200,400,400\">";
        shapes = plan_shapes;
    }

    var num_shapes = shapes.length;

    switch (draw_mode)
    {
        case DRAW_ALL:
            for (var i = 0 ; i < num_shapes ; ++i)
            {
                text += CubeSolver.DrawShape (shapes [i], colours [i]);
            }
            break;

        case DRAW_EDGES:
            for (var i = 0 ; i < num_shapes ; ++i)
            {
                text += CubeSolver.DrawShape (shapes [i], is_edge [i] ? colours [i] : "gray");
            }
            break;

        case DRAW_DIAGONALS:
            for (var i = 0 ; i < num_shapes ; ++i)
            {
                text += CubeSolver.DrawShape (shapes [i], is_diagonal [i] ? colours [i] : "gray");
            }
            break;
    }


    if (draw_numbers)
    {
        for (var i = 0 ; i < num_shapes ; ++i)
        {
            text += CubeSolver.LabelShape (i, shapes [i], colours [i]);
        }
    }
    text += "</svg>";
    element.innerHTML = text;
}
//-------------------------------------------------------------------------------------------------
CubeSolver.DrawShape = function (points, colour)
{
    var text = "";

    text += "<polygon points=\"" + CubeSolver.PointsToText (points) + "\"";
    text += " style=\"stroke-width:1;stroke:black;fill-rule:nonzero;";
    text += "fill:" + colour + ";";

    text += "\"/>";

    return text;
}
//-------------------------------------------------------------------------------------------------
CubeSolver.LabelShape = function (n, points)
{
    var text = "";
    var num = points.length;

    if (num > 0)
    {
        var sumx = 0;
        var sumy = 0;

        for (var i = 0 ; i < num ; ++i)
        {
            sumx += points [i][0];
            sumy += points [i][1];
        }

        sumx = sumx / num;
        sumy = sumy / num;

        text += "<text x=\"" + sumx + "\" y=\"" + sumy + "\" class=\"svgtext\">" + n + "</text>";
    }
    return text;
}
//-------------------------------------------------------------------------------------------------
CubeSolver.PointsToText = function (points)
{
    var text = "";
    var num_points = points.length;

    for (i = 0 ; i < num_points ; i++)
    {
        if (i > 0)
        {
            text += " ";
        }
        text += points [i][0] + "," + points [i][1];
    }

    return text;
}
//-------------------------------------------------------------------------------------------------
CubeSolver.Reset = function ()
{
    var num = default_colours.length;

    for (var i = 0 ; i < num ; ++i)
    {
        colours [i] = default_colours [i];
    }
}
//-------------------------------------------------------------------------------------------------
CubeSolver.DoKey = function (event)
{
    var chr = getChar(event)

    if (CubeSolver.DoLetter (chr))
    {
        return true;
    }

    switch (chr)
    {
        case 'ALT-N':
            draw_numbers = ! draw_numbers;
            return true;

        case 'ALT-R':
            CubeSolver.Reset ();
            return true;

        case 'ALT-P':
            draw_3d = ! draw_3d;
            return true;

        case 'ALT-A':
            draw_mode = DRAW_ALL;
            return true;

        case 'ALT-E':
            draw_mode = DRAW_EDGES;
            return true;

        case 'ALT-D':
            draw_mode = DRAW_DIAGONALS;
            return true;
    }

    return false;
}
//-------------------------------------------------------------------------------------------------
CubeSolver.DoLetter = function (chr)
{
    if (chr in transform)
    {
        CubeSolver.ApplyTransform (transform [chr]);
        return true;
    }

    if (chr in equation)
    {
        CubeSolver.ApplyEquation (equation [chr]);
        return true;
    }

    return false;
}
//-------------------------------------------------------------------------------------------------
CubeSolver.ApplyEquation = function (text)
{
    var equation = TextEquation.Create (text);

    var details = equation.Inflate ();
    var len = details.length;

    for (var i = 0; i < len; i++)
    {
        CubeSolver.DoLetter (details[i]);
    }
}
//-------------------------------------------------------------------------------------------------
CubeSolver.SaveEquation = function (chr, text)
{
    if (chr.length > 1)
    {
        alert ("Equation keys must be single letters, length '" + chr + "' length = " + chr.length);
        return;
    }

    if (chr in transform)
    {
        alert ("'" + chr + "' is a reserved character");
        return;
    }
    if (letters.indexOf (chr) < 0)
    {
        alert ("Can't assign to non-alphabetic character: '" + chr + "'");
    }

    equation [chr] = text;
}
//-------------------------------------------------------------------------------------------------
CubeSolver.GetEquationText = function ()
{
    var ret = "<table>";

    for (var k in equation)
    {
        ret += "<tr><td>" + k + "</td><td>" + equation [k] + "</td></tr>";
    }

    ret += "</table>";
    return ret;
}
//-------------------------------------------------------------------------------------------------
CubeSolver.ApplyTransform = function (transform)
{
    for (var i = 0 ; i < transform.length ; ++i)
    {
        var num = transform [i].length;
        var temp = colours [transform [i][0]];

        for (j = 0 ; j < num-1; ++j)
        {
            colours [transform [i][j]] = colours [transform [i][j+1]];
        }
        colours [transform [i][num-1]] = temp;
    }
}
//-------------------------------------------------------------------------------------------------
function getChar(event)
{
    if (event.keyCode < 0x20 || event.keyCode > 0x5A)
    {
        return null;
    }

    if (event.keyCode >= 0x41 && event.keyCode <= 0x5A)
    {
        if (event.ctrlKey || event.altKey)
        {
            var ret = "";
            if (event.altKey) ret += "ALT-";
            if (event.ctrlKey) ret += "CTRL-";
            if (event.shiftKey) ret += "SHIFT-";
            return ret + String.fromCharCode(event.keyCode);
        }

        return String.fromCharCode((event.shiftKey) ? event.keyCode : (event.keyCode + 0x20));
    }

    return String.fromCharCode(event.keyCode);
}


