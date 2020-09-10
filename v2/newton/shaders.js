//-------------------------------------------------------------------------------------------------
// Loads an compiles a set of shaders. This is intended to be used with the mandelbrot
// drawer which has a single vertex shader and a number of patterns drawing shaders_read
// which combine the iteration with the colour selection.
// (c) John Whitehouse 2014
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------
function ShaderManager ()
{
    this.ctx3 = null;
}

// Shaders are fussy about the difference between integer and fp constants.

function FloatString (x)
{
    var ret = x.toString ();
    var idx_e = ret.indexOf ('e');

    if (idx_e >= 0)
    {
        return ret;
    }

    var idx = ret.indexOf ('.');

    if (idx < 0)
    {
        ret += ".0";
    }
    return ret;
}

// Shaders are fussy about the difference between integer and fp constants.

function IntString (x)
{
    return Math.round (x).toString ();
}

// shader indeces

ShaderManager.VS_VERTEX = 0;
ShaderManager.FS_STANDARD = 1;
ShaderManager.FS_ALPHA = 2;

ShaderManager.NUM_SHADERS = 3;

// Shader types

ShaderManager.VERTEX = 0;
ShaderManager.FRAGMENT = 1;

// Flag set when the shaders are loaded.

ShaderManager.shaders_read = false;

function ShaderHolder (name, type)
{
    this.name = name;
    this.type = type;
    this.text = null;
    this.error = null;
}

// the shaders, indexed using the shader indeces. The shaders are contained in text files
// which will be loaded on start-up

ShaderManager.shaders =
[
    new ShaderHolder ("vertex.shader", ShaderManager.VERTEX),
    new ShaderHolder ("newton.shader", ShaderManager.FRAGMENT),
    new ShaderHolder ("newton_alpha.shader", ShaderManager.FRAGMENT),
];

// Modes

ShaderManager.STANDARD = 0;
ShaderManager.ALPHA = 1;

ShaderManager.mode_names =
[
    "Standard", "Alpha"
]

ShaderManager.mode = ShaderManager.STANDARD;
ShaderManager.polynomial = null;

//------------------------------------------------------------------------------

ShaderManager.VERTEX_SIZE = 2;
ShaderManager.vertexPositionBuffer;
ShaderManager.shaderProgram;

// Direct variables

ShaderManager.aspect = 4.0 / 3.0;
ShaderManager.start_h = 1.2;
ShaderManager.start_w = ShaderManager.start_h * ShaderManager.aspect;
ShaderManager.zoom = 0.5;

// View

ShaderManager.corners = [];

// The origin is a 4-dimensional point representing the 4 variables in the iteration:
// (zx, zy) the origin of the mandelbrot calculations
// (cx, cy) the origin in the julia sets
// there are 6 perpendicular plains on which we can construct patterns

// replaceable variables

var NUM_ITERATIONS = new RegExp("%NUM_ITERATIONS%", "g");
var CONTOURS_FACTOR = new RegExp("%CONTOURS_FACTOR%", "g");
var PRECISION = new RegExp("%PRECISION%", "g");
var TIGHTNESS = new RegExp("%TIGHTNESS%", "g");
var CODE = new RegExp("%CODE%", "g");
var APPLY_COLOUR = new RegExp("%APPLY_COLOUR%", "g");
var INITIALISE = new RegExp("%INITIALISE%", "g");

ShaderManager.num_iterations = 100;
ShaderManager.contours_factor = 1.0;
ShaderManager.precision = "mediump";
ShaderManager.tightness = 1e-8;

ShaderManager.view_cx = 0.0;
ShaderManager.view_cy = 0.0;
ShaderManager.view_zx = 0.0;
ShaderManager.view_zy = 0.0;

// Alpha in the damped equation

ShaderManager.use_alpha = false;
ShaderManager.alpha_x = 1.0;
ShaderManager.alpha_y = 0.0;

// Used to generate colours

ShaderManager.ColourX = 0;
ShaderManager.ColourY = 0;

// Change the seed in alpha mode

ShaderManager.seed_x = 0;
ShaderManager.seed_y = 0;

ShaderManager.equation = [null,null,null,null,null,null,null,null,null,null];

ShaderManager.power = 2;

ShaderManager.equation[2] =               "float x2 =  x *  x -  y *  y; float y2 = 2.0 *  x *  y;\n";
ShaderManager.equation[3] = ShaderManager.equation[2] + "float x3 =  x * x2 -  y * y2; float y3 = x2 *  y +  x * y2;\n";
ShaderManager.equation[4] = ShaderManager.equation[3] + "float x4 =  x * x3 -  y * y3; float y4 = x3 *  y +  x * y3;\n";
ShaderManager.equation[5] = ShaderManager.equation[4] + "float x5 =  x * x4 -  y * y4; float y5 = x4 *  y +  x * y4;\n";
ShaderManager.equation[6] = ShaderManager.equation[5] + "float x6 =  x * x5 -  y * y5; float y6 = x5 *  y +  x * y5;\n";
ShaderManager.equation[7] = ShaderManager.equation[6] + "float x7 =  x * x6 -  y * y6; float y7 = x6 *  y +  x * y6;\n";
ShaderManager.equation[8] = ShaderManager.equation[7] + "float x8 =  x * x7 -  y * y7; float y8 = x7 *  y +  x * y7;\n";
ShaderManager.equation[9] = ShaderManager.equation[8] + "float x9 =  x * x8 -  y * y8; float y9 = x8 *  y +  x * y8;\n";

//---------------------------------------------------------------------------------------
// How many shaders have been loaded?
//---------------------------------------------------------------------------------------
ShaderManager.NumShadersLoaded = function ()
{
    var count = 0;
    for (x in ShaderManager.shaders)
    {
        var holder = ShaderManager.shaders [x];

        if (holder.text != null)
        {
            count ++;
        }
    }
    return count;
}
//------------------------------------------------------------------------------
// Returns a string describing where we are
//------------------------------------------------------------------------------
ShaderManager.GetStatus = function ()
{
    var ret = "Position: " + ShaderManager.GetPositionText ();

    if (ShaderManager.mode == ShaderManager.STANDARD && ShaderManager.use_alpha)
    {
        ret += ", &alpha; = (" + Misc.FloatToText (ShaderManager.alpha_x,10) + "," +
                                 Misc.FloatToText (ShaderManager.alpha_y,10) + ")";
    }

    ret += ", Zoom = " + ShaderManager.GetZoomText () +
            ", Iterations = " + ShaderManager.num_iterations +
            ", Contours = " + Misc.FloatToText (ShaderManager.contours_factor,10) +
            ", Tightness = " + ShaderManager.tightness;

    return ret;
}
//------------------------------------------------------------------------------
// Prepare the program to draw
//------------------------------------------------------------------------------
ShaderManager.PrepareProgramme = function (ctx3)
{
    var aPlotPosition;

    // Create the program

    shaderProgram = ctx3.createProgram();

    // Attach the shaders to the program

    var shidx = (ShaderManager.mode == ShaderManager.STANDARD) ? ShaderManager.FS_STANDARD : ShaderManager.FS_ALPHA;

    var fragmentShader = ShaderManager.GetShader (ctx3, shidx);
    var vertexShader = ShaderManager.GetShader (ctx3, 0);

    ctx3.attachShader(shaderProgram, vertexShader);
    ctx3.attachShader(shaderProgram, fragmentShader);
    ctx3.linkProgram(shaderProgram);

    if (!ctx3.getProgramParameter(shaderProgram, ctx3.LINK_STATUS))
    {
        alert(ctx3.getProgramInfoLog(shaderProgram));
        return;
    }

    ShaderManager.shaderProgram = shaderProgram;
    ctx3.useProgram(ShaderManager.shaderProgram);
}
//------------------------------------------------------------------------------
// Initialise the drawing buffer
//------------------------------------------------------------------------------
ShaderManager.InitBuffers = function (ctx3)
{
    ShaderManager.vertexPositionBuffer = ctx3.createBuffer();

    ctx3.bindBuffer (ctx3.ARRAY_BUFFER, ShaderManager.vertexPositionBuffer);

    var vertices =
    [
         1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
        -1.0, -1.0,
    ];

    ctx3.bufferData(ctx3.ARRAY_BUFFER, new Float32Array(vertices), ctx3.STATIC_DRAW);
}
//-----------------------------------------------------------------------------------------------
ShaderManager.GetCentre = function ()
{
    var x = (ShaderManager.mode == ShaderManager.STANDARD) ? ShaderManager.seed_x : ShaderManager.alpha_x;
    var y = (ShaderManager.mode == ShaderManager.STANDARD) ? ShaderManager.seed_y : ShaderManager.alpha_y;
    
    return [x,y];
}    
//-----------------------------------------------------------------------------------------------
ShaderManager.UpdateView = function ()
{
    var pos = ShaderManager.GetCentre ();
    var x = pos[0];
    var y = pos[1];
    var dx = ShaderManager.start_w / ShaderManager.zoom;
    var dy = ShaderManager.start_h / ShaderManager.zoom;

    ShaderManager.corners =
    [
        [x + dx, y + dy],
        [x - dx, y + dy],
        [x + dx, y - dy],
        [x - dx, y - dy]
    ];
}
//-----------------------------------------------------------------------------------------------
ShaderManager.SetMode = function (mode)
{
    ShaderManager.mode = mode;
}
//-----------------------------------------------------------------------------------------------
ShaderManager.SetZoom = function (z)
{
    ShaderManager.zoom = z;
}
//-----------------------------------------------------------------------------------------------
ShaderManager.SetSeedPosition = function (x, y)
{
    ShaderManager.seed_x = x;
    ShaderManager.seed_y = y;
}
//-----------------------------------------------------------------------------------------------
ShaderManager.SetAlphaValue = function (x, y)
{
    ShaderManager.alpha_x = x;
    ShaderManager.alpha_y = y;
}

//-----------------------------------------------------------------------------------------------
ShaderManager.SetIterations = function (n)
{
    ShaderManager.num_iterations = n;
}
//-----------------------------------------------------------------------------------------------
// Compile the shader script.
// ctx3 - the graphics context
// idx - the shader required (0 - num shaders - 1)
//-----------------------------------------------------------------------------------------------
ShaderManager.GetShader = function (ctx3, idx)
{
    var holder = ShaderManager.shaders [idx];

    // Not available

    if (holder.text == null)
    {
        return null;
    }

    // replace the macros

    var eq = ShaderManager.equation[ShaderManager.power];
    var modified_text = holder.text;

    modified_text = modified_text.replace (NUM_ITERATIONS, IntString(ShaderManager.num_iterations));
    modified_text = modified_text.replace (CONTOURS_FACTOR, FloatString (ShaderManager.contours_factor));
    modified_text = modified_text.replace (TIGHTNESS, FloatString (ShaderManager.tightness));
    modified_text = modified_text.replace (PRECISION, ShaderManager.precision);
    modified_text = modified_text.replace (CODE, ShaderManager.code);
    modified_text = modified_text.replace (INITIALISE, ShaderManager.init);

    colour_code = ShaderManager.GetColourCode ();

    modified_text = modified_text.replace (APPLY_COLOUR, colour_code);

    var type = (holder.type == ShaderManager.VERTEX) ? ctx3.VERTEX_SHADER : ctx3.FRAGMENT_SHADER;
    var type = (holder.type == ShaderManager.VERTEX) ? ctx3.VERTEX_SHADER : ctx3.FRAGMENT_SHADER;
    var shader = ctx3.createShader(type);

    ctx3.shaderSource(shader, modified_text);
    ctx3.compileShader(shader);

    if (!ctx3.getShaderParameter(shader, ctx3.COMPILE_STATUS))
    {
        alert(ctx3.getShaderInfoLog(shader));
        return null;
    }

    holder.compiled = shader;
    return shader;
}
//-------------------------------------------------------------------------------------------------
ShaderManager.GetColourCode = function ()
{
    var ret = "";

    if (ShaderManager.ColourX < 0)
    {
        ret += ("x = x + " + FloatString (-ShaderManager.ColourX) + ";");
    }
    else if (ShaderManager.ColourX > 0)
    {
        ret += ("x = x + " + FloatString (ShaderManager.ColourY) + ";");
    }

    if (ShaderManager.ColourY < 0)
    {
        ret += ("y = y + " + FloatString (-ShaderManager.ColourY) + ";");
    }
    else if (ShaderManager.ColourY > 0)
    {
        ret += ("y = y + " + FloatString (ShaderManager.ColourY) + ";");
    }

    return ret;
}
//-------------------------------------------------------------------------------------------------
// Show the coordinates
//-------------------------------------------------------------------------------------------------
ShaderManager.GetPositionText = function()
{
    var pos = ShaderManager.GetCentre ();
    
    return "(" + Misc.FloatToText (pos[0], 10) + ","
                + Misc.FloatToText (pos[1], 10) + ")";
}   
//-------------------------------------------------------------------------------------------------
// Show the coordinates
//-------------------------------------------------------------------------------------------------
ShaderManager.GetZoomText = function()
{
    return Misc.FloatToText (ShaderManager.zoom, null);
}
//-------------------------------------------------------------------------------------------------
// Update the colour origin
//-------------------------------------------------------------------------------------------------
ShaderManager.SetColourOrigin = function(x, y)
{
    ShaderManager.ColourX = x;
    ShaderManager.ColourY = y;
}
//-------------------------------------------------------------------------------------------------
// Update the colour origin
//-------------------------------------------------------------------------------------------------
ShaderManager.ResetColourOrigin = function()
{
    ShaderManager.ColourX = 0;
    ShaderManager.ColourY = 0;
}
//-------------------------------------------------------------------------------------------------
// Update the colour origin
//-------------------------------------------------------------------------------------------------
ShaderManager.MoveColourOrigin = function(dx, dy)
{
    ShaderManager.ColourX += dx;
    ShaderManager.ColourY += dy;
}
//-------------------------------------------------------------------------------------------------
// XMLHttpRequest callback
//-------------------------------------------------------------------------------------------------
ShaderManager.OnLoad = function(request, idx)
{
    // READYSTATE_UNINITIALIZED (0) The object has been created, but not initialized.
    // READYSTATE_LOADING       (1) A request has been opened.
    // READYSTATE_LOADED        (2) The send method has been called.
    // READYSTATE_INTERACTIVE   (3) Some data has been received.
    // READYSTATE_COMPLETE      (4) All the data has been received.

    // If the request is "DONE" (completed or failed)

    if (request.readyState == 4)
    {
        holder = ShaderManager.shaders [idx];

        // If we got HTTP status 200 (OK)

        if (request.status == 200)
        {
            holder.text = request.responseText;
        }
        else if (request.status == 0)
        {
            holder.error = "Uninitialised: " + request.responseText;
        }
        else
        {
            holder.error = "get " + id + " failed: " + request.status;
        }

        // Should we draw something

        var count = ShaderManager.NumShadersLoaded ();

        if (count < ShaderManager.NUM_SHADERS)
        {
            return;
        }
        ShaderManager.shaders_read = true;

        ShaderManager.InitBuffers(this.ctx3);

        this.ctx3.clearColor(0.0, 0.0, 0.0, 1.0);
        ShaderManager.DrawScene (this.ctx3);
    }
}
//-------------------------------------------------------------------------------------------------
// Load shader scripts from external files.
//-------------------------------------------------------------------------------------------------
ShaderManager.LoadShaders = function(ctx3)
{
    this.ctx3 = ctx3;
    
    for (var idx = 0 ; idx < ShaderManager.NUM_SHADERS ; ++idx)
    {
        ShaderManager.LoadShader (idx);
    }
}
//-------------------------------------------------------------------------------------------------
ShaderManager.LoadShader = function(id)
{
    holder = ShaderManager.shaders [id];

    var name = "./" + holder.name;
    var request = new XMLHttpRequest() ;

    request.open ("GET", name) ;
    request.onreadystatechange = function() { ShaderManager.OnLoad (request, id); } ;
    request.send () ;
}
//-------------------------------------------------------------------------------------------------
// Draw the scene, does nothing if the shaders haven't been loaded
//-------------------------------------------------------------------------------------------------
ShaderManager.DrawScene = function ()
{
    if (! ShaderManager.shaders_read)
    {
        return;
    }
    
    var use_alpha = ShaderManager.mode == ShaderManager.STANDARD
                        || ShaderManager.alpha_x != 1 || ShaderManager.alpha_y != 0;
                        
    if (use_alpha != ShaderManager.use_alpha)
    {
        ShaderManager.use_alpha = use_alpha;
    }
    
    if (use_alpha || ShaderManager.mode == ShaderManager.ALPHA)
    {
        ShaderManager.UpdateCode ();
    }

    ShaderManager.PrepareProgramme(this.ctx3);

    this.ctx3.viewport(0, 0, this.ctx3.viewportWidth, this.ctx3.viewportHeight);
    this.ctx3.clear(this.ctx3.COLOR_BUFFER_BIT | this.ctx3.DEPTH_BUFFER_BIT);

    var aVertexPosition = this.ctx3.getAttribLocation(shaderProgram, "aVertexPosition");
    this.ctx3.enableVertexAttribArray(aVertexPosition);

    var aPlotPosition = this.ctx3.getAttribLocation(shaderProgram, "aPlotPosition");
    this.ctx3.enableVertexAttribArray(aPlotPosition);

    this.ctx3.bindBuffer(this.ctx3.ARRAY_BUFFER, ShaderManager.vertexPositionBuffer);
    this.ctx3.vertexAttribPointer(aVertexPosition, ShaderManager.VERTEX_SIZE, this.ctx3.FLOAT, false, 0, 0);

    // Map the corners to the current zoom view

    var plotPositionBuffer = this.ctx3.createBuffer();

    this.ctx3.bindBuffer(this.ctx3.ARRAY_BUFFER, plotPositionBuffer);

    var idx;
    var corners = [];

    for (idx in ShaderManager.corners)
    {
        var x = ShaderManager.corners[idx][0];
        var y = ShaderManager.corners[idx][1];
        corners.push(x);
        corners.push(y);
    }

    this.ctx3.bufferData(this.ctx3.ARRAY_BUFFER, new Float32Array(corners), this.ctx3.STATIC_DRAW);
    this.ctx3.vertexAttribPointer(aPlotPosition, 2, this.ctx3.FLOAT, false, 0, 0);

    // draw it

    this.ctx3.drawArrays(this.ctx3.TRIANGLE_STRIP, 0, 4);

    this.ctx3.deleteBuffer(plotPositionBuffer)
}
//-------------------------------------------------------------------------------------------------
// Set the polynomial
//-------------------------------------------------------------------------------------------------
ShaderManager.SetPolynomial = function (polynomial)
{
    ShaderManager.polynomial = polynomial;
    ShaderManager.UpdateCode ();
}
//-------------------------------------------------------------------------------------------------
// Update the code
//-------------------------------------------------------------------------------------------------
ShaderManager.UpdateCode = function ()
{
    if (ShaderManager.mode == ShaderManager.STANDARD)
    {
        ShaderManager.init = ShaderManager.MakeStandardInit ();
        ShaderManager.code = ShaderManager.use_alpha ? ShaderManager.MakeAlphaCode () : ShaderManager.MakeCode ();
    }
    else
    {
        ShaderManager.init = ShaderManager.MakeAlphaInit ();
        ShaderManager.code = ShaderManager.MakeAlphaModeCode ();
    }
}
//-------------------------------------------------------------------------------------------------
ShaderManager.MakeCode = function ()
{
    var code = ShaderManager.equation [ShaderManager.polynomial.order];

    ShaderManager.polynomial.MakeNewtonPolynomials ();

    code += "float xt1 = " + ShaderManager.MakeEquation (this.polynomial, "x", true) + ";\n";
    code += "float yt1 = " + ShaderManager.MakeEquation (this.polynomial, "y", false) + ";\n";

    code += "float v2 = xt1 * xt1 + yt1 * yt1;\n";
    code += "if (v2 < " + FloatString (ShaderManager.tightness) + ") { runaway = i; }\n else\n {\n";

    code += "float xb = " + ShaderManager.MakeEquation (this.polynomial.newton_bottom, "x", true) + ";\n";
    code += "float yb = " + ShaderManager.MakeEquation (this.polynomial.newton_bottom, "y", false) + ";\n";

    code += "float mod = xb * xb + yb * yb;\n";
    code += "float xt3 = (xt1 * xb + yt1 * yb) / mod;\n";
    code += "float yt3 = (yt1 * xb - xt1 * yb) / mod;\n";

    code += "x = x - xt3;\n";
    code += "y = y - yt3;\n";

    code += "}\n";

    return code;
}
//-------------------------------------------------------------------------------------------------
ShaderManager.MakeAlphaCode = function ()
{
    var code = ShaderManager.equation [ShaderManager.polynomial.order];

    ShaderManager.polynomial.MakeNewtonPolynomials ();

    code += "float xt1 = " + ShaderManager.MakeEquation (this.polynomial, "x", true) + ";\n";
    code += "float yt1 = " + ShaderManager.MakeEquation (this.polynomial, "y", false) + ";\n";

    code += "float v2 = xt1 * xt1 + yt1 * yt1;\n";
    code += "if (v2 < " + FloatString (ShaderManager.tightness) + ") { runaway = i; }\n else\n {";

    code += "float xb = " + ShaderManager.MakeEquation (this.polynomial.newton_bottom, "x", true) + ";\n";
    code += "float yb = " + ShaderManager.MakeEquation (this.polynomial.newton_bottom, "y", false) + ";\n";

    code += "float xt2 = xt1 * " + FloatString (ShaderManager.alpha_x) + " - yt1 * " + FloatString (ShaderManager.alpha_y) + ";\n";
    code += "float yt2 = xt1 * " + FloatString (ShaderManager.alpha_y) + " + yt1 * " + FloatString (ShaderManager.alpha_x) + ";\n";

    code += "float mod = xb * xb + yb * yb;\n";
    code += "float xt3 = (xt2 * xb + yt2 * yb) / mod;\n";
    code += "float yt3 = (yt2 * xb - xt2 * yb) / mod;\n";

    code += "x = x - xt3;\n";
    code += "y = y - yt3;\n";

    code += "}\n";

    return code;
}
//-------------------------------------------------------------------------------------------------
ShaderManager.MakeAlphaModeCode = function ()
{
    var code = ShaderManager.equation [ShaderManager.polynomial.order];

    ShaderManager.polynomial.MakeNewtonPolynomials ();

    code += "float xt1 = " + ShaderManager.MakeEquation (this.polynomial, "x", true) + ";\n";
    code += "float yt1 = " + ShaderManager.MakeEquation (this.polynomial, "y", false) + ";\n";
    code += "float v2 = xt1 * xt1 + yt1 * yt1;\n";
    code += "if (v2 < " + FloatString (ShaderManager.tightness) + ") { runaway = i; }\n else\n {";

    code += "float xb = " + ShaderManager.MakeEquation (this.polynomial.newton_bottom, "x", true) + ";\n";
    code += "float yb = " + ShaderManager.MakeEquation (this.polynomial.newton_bottom, "y", false) + ";\n";

    code += "float xt2 = xt1 * ax - yt1 * ay;\n";
    code += "float yt2 = xt1 * ay + yt1 * ax;\n";

    code += "float mod = xb * xb + yb * yb;\n";
    code += "float xt3 = (xt2 * xb + yt2 * yb) / mod;\n";
    code += "float yt3 = (yt2 * xb - xt2 * yb) / mod;\n";

    code += "x = x - xt3;\n";
    code += "y = y - yt3;\n";

    code += "}\n";

    return code;
}
//-------------------------------------------------------------------------------------------------
ShaderManager.MakeStandardInit = function ()
{
    return "float x = vPosition.x; float y = vPosition.y;";
}
//-------------------------------------------------------------------------------------------------
ShaderManager.MakeAlphaInit = function ()
{
    var code = "float ax = vPosition.x; float ay = vPosition.y;";

    code += "float x = " + FloatString (ShaderManager.seed_x) + ";";
    code += "float y = " + FloatString (ShaderManager.seed_y) + ";";

    return code;
}
//-------------------------------------------------------------------------------------------------
ShaderManager.MakeEquation = function (polynomial, letter, real)
{
    var ret = "";
    var first = true;

    for (var i = polynomial.order ; i > 0 ; --i)
    {
        var k = polynomial.terms [i];

        if (k != 0)
        {
            var negative = (k < 0);

            if (negative)
            {
                k = -k;
            }

            var multiplier = (k == 1) ? "" : FloatString (k);

            if (negative)
            {
                ret += "-";
            }
            else if (! first)
            {
                ret += "+";
            }

            if (multiplier)
            {
                ret += multiplier + "*";
            }
            ret += letter;

            if (i > 1)
            {
                ret += i;
            }
            first = false;
        }
    }

    // x^0

    if (real)
    {
        k = polynomial.terms [0];

        if (k != 0)
        {
            if (k > 0)
            {
                if (! first)
                {
                    ret += "+";
                }
                ret += FloatString (k);
            }
            else if (k < 0)
            {
                ret += "-";
                ret += FloatString (-k);
            }
        }
    }
    return ret;
}




