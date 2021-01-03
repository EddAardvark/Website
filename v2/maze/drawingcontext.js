//-------------------------------------------------------------------------------------------------
function DrawingContext (ctx3)
{
    this.ctx3 = ctx3;
    this.context_buffers = [];
}

// Texture files

var texture_files =
[
    "images3d/dungeon.jpg",
];

// Texture indeces

var TEXTURE_DUNGEON = 0;

// texture callback

function handleLoadedTexture(counter)
{
    counter.owner.textures_loaded += 1;

    if (counter.owner.textures_loaded == texture_files.length)
    {
        counter.maze.Draw ();
    }
}
//-------------------------------------------------------------------------------------------------
DrawingContext.prototype.Initialise = function (maze)
{
    var ctx3 = this.ctx3;

    ctx3.viewport   (0, 0, ctx3.drawingBufferWidth, ctx3.drawingBufferHeight);
    ctx3.clearColor (0.0, 0.1, 0.1, 1.0);       // Set clear color
    ctx3.depthFunc  (ctx3.LESS);                // Near things obscure far things
    ctx3.disable    (ctx3.BLEND) ;
    ctx3.enable     (ctx3.DEPTH_TEST);          // Enable depth testing

// Creates the shaders, these are sippets of code which are downloaded to the graphics card.
// They reference the arrays perspective_mat and model_view_mat and enumerate the points in
// the buffers using the variables 'pos', 'colour' and 'texture_coord'.

    this.CompileShaders ();

// Bind the matrix variables

    this.colour_pmat_idx = ctx3.getUniformLocation(this.colour_prog, "perspective_mat");
    this.colour_mvmat_idx = ctx3.getUniformLocation(this.colour_prog, "model_view_mat");

    this.texture_pmat_idx = ctx3.getUniformLocation(this.texture_prog, "perspective_mat");
    this.texture_mvmat_idx = ctx3.getUniformLocation(this.texture_prog, "model_view_mat");

// Bind the colour shader variables

    this.variable_colour_pos = ctx3.getAttribLocation(this.colour_prog, "pos");
    this.variable_colour = ctx3.getAttribLocation(this.colour_prog, "colour");

// Link to texture shader variables

    this.variable_texture_pos = ctx3.getAttribLocation(this.texture_prog, "txture_pos");
    this.variable_texture = ctx3.getAttribLocation(this.texture_prog, "texture_coord");

// Textures

    var num_textures = texture_files.length;

    counter = {};
    counter.owner = this;
    counter.maze = maze;

    this.textures = [];
    this.textures_loaded = 0;

    for (var i = 0 ; i < num_textures ; ++i)
    {
        var txture = ctx3.createTexture();
        txture.image = new Image();
        txture.context = ctx3;
        txture.image.onload = function() { handleLoadedTexture(counter); }
        txture.image.src = texture_files [i];

        this.textures.push (txture);
    }
}
//-------------------------------------------------------------------------------------------------
DrawingContext.prototype.CompileShaders  = function ()
{
    var ctx3 = this.ctx3;

    // We currently have 4 shaders

    var cvs = this.CompileShader (colour_vertex_shader, ctx3.VERTEX_SHADER);
    var tvs = this.CompileShader (texture_vertex_shader, ctx3.VERTEX_SHADER);
    var cfs = this.CompileShader (colour_fragment_shader, ctx3.FRAGMENT_SHADER);
    var tfs = this.CompileShader (texture_fragment_shader, ctx3.FRAGMENT_SHADER);

    // And two programs

    this.colour_prog = ctx3.createProgram();
    this.texture_prog = ctx3.createProgram();

    ctx3.attachShader(this.colour_prog, cvs);
    ctx3.attachShader(this.colour_prog, cfs);
    ctx3.attachShader(this.texture_prog, tvs);
    ctx3.attachShader(this.texture_prog, tfs);

    ctx3.linkProgram(this.colour_prog);
    ctx3.linkProgram(this.texture_prog);

    this.CheckProgramLinkage (this.colour_prog);
    this.CheckProgramLinkage (this.texture_prog);
}
//-------------------------------------------------------------------------------------------------
DrawingContext.prototype.CheckProgramLinkage = function (program)
{
    var num = this.ctx3.getProgramParameter(program, this.ctx3.ATTACHED_SHADERS)
    var bLinked = this.ctx3.getProgramParameter (program, this.ctx3.LINK_STATUS);
    var text = "Num linked: " + num;

    if (! bLinked)
    {
        var error = this.ctx3.getProgramInfoLog(program);
        text += ", Error: " + error;
        alert (text);
    }
}
//-------------------------------------------------------------------------------------------------
// Compile a shader
// - source_code:   The source coder
// - type:          The type of shader (VERTEX_SHADER or FRAGMENT_SHADER)
//-------------------------------------------------------------------------------------------------
DrawingContext.prototype.CompileShader = function (source_code, type)
{
    var shader = this.ctx3.createShader(type);
    this.ctx3.shaderSource(shader, source_code);
    this.ctx3.compileShader(shader);

    return shader;
}
//-------------------------------------------------------------------------------------------------
DrawingContext.prototype.Clear = function ()
{
    this.ctx3.clear (this.ctx3.COLOR_BUFFER_BIT | this.ctx3.DEPTH_BUFFER_BIT);
}
//-------------------------------------------------------------------------------------------------
DrawingContext.prototype.TexturesLoaded = function ()
{
    return this.textures_loaded == texture_files.length;
}
//-------------------------------------------------------------------------------------------------
// Create some buffers to be used in drawing. This function adds extra buffers as
// required but never deletes any.
//-------------------------------------------------------------------------------------------------
DrawingContext.prototype.CreateBuffers = function (required)
{
    var current = this.context_buffers.length;
    var to_add = required - current;

    for (var i = 0 ; i < to_add ; ++i)
    {
        this.context_buffers.push (this.ctx3.createBuffer());
    }
}
//-------------------------------------------------------------------------------------------------
// Bind some array data to a buffer.
//-------------------------------------------------------------------------------------------------
DrawingContext.prototype.BindArrayData = function (idx, data)
{
    this.ctx3.bindBuffer(this.ctx3.ARRAY_BUFFER, this.context_buffers [idx]);
    this.ctx3.bufferData(this.ctx3.ARRAY_BUFFER, data, this.ctx3.STATIC_DRAW);
}
//-------------------------------------------------------------------------------------------------
// Bind some element data to a buffer.
//-------------------------------------------------------------------------------------------------
DrawingContext.prototype.BindElementData = function (idx, elements)
{
    this.ctx3.bindBuffer(this.ctx3.ELEMENT_ARRAY_BUFFER, this.context_buffers [idx]);
    this.ctx3.bufferData(this.ctx3.ELEMENT_ARRAY_BUFFER, elements, this.ctx3.STATIC_DRAW);
}
//-------------------------------------------------------------------------------------------------
// Attach the matrices
//
// pMatrix:     The perspective matrix
// mvMatrix:    The position/rotation matrix
//-------------------------------------------------------------------------------------------------
DrawingContext.prototype.AttachMatrices = function (pMatrix, mvMatrix)
{
    this.perspective = pMatrix;
    this.transform = mvMatrix;
}
//-------------------------------------------------------------------------------------------------
// Draw a sub-set of the whole picture
//-------------------------------------------------------------------------------------------------
DrawingContext.prototype.DrawInColour = function (pos, num_elements)
{
    var ctx3 = this.ctx3;

    ctx3.useProgram(this.colour_prog);

    // Select program and attach matrices

    ctx3.uniformMatrix4fv(this.colour_pmat_idx, false, this.perspective);
    ctx3.uniformMatrix4fv(this.colour_mvmat_idx, false, this.transform);

    var coords = this.context_buffers [pos + BufferSet.COORD_IDX];
    var colours = this.context_buffers [pos + BufferSet.COLOUR_IDX];
    var elements = this.context_buffers [pos + BufferSet.ELEMENT_IDX];

    // Coordinate buffer

    ctx3.bindBuffer(ctx3.ARRAY_BUFFER, coords);
    ctx3.enableVertexAttribArray(this.variable_colour_pos);
    ctx3.vertexAttribPointer(this.variable_colour_pos, 3, ctx3.FLOAT, false, 0, 0);

    // Colours buffer

    ctx3.bindBuffer(ctx3.ARRAY_BUFFER, colours);
    ctx3.enableVertexAttribArray(this.variable_colour);
    ctx3.vertexAttribPointer(this.variable_colour, 4, ctx3.FLOAT, false, 0, 0);

    // Elements buffer

    ctx3.bindBuffer(ctx3.ELEMENT_ARRAY_BUFFER, elements);
    ctx3.drawElements(ctx3.TRIANGLES, num_elements, ctx3.UNSIGNED_SHORT, 0);
}
//-------------------------------------------------------------------------------------------------
// Draw a sub-set of the whole picture
//-------------------------------------------------------------------------------------------------
DrawingContext.prototype.DrawTextures = function (pos, num_elements, texture_id)
{
    var ctx3 = this.ctx3;
    var texture = this.textures [texture_id];

    // Select program and attach matrices

    ctx3.useProgram(this.texture_prog);

    ctx3.uniformMatrix4fv(this.texture_pmat_idx, false, this.perspective);
    ctx3.uniformMatrix4fv(this.texture_mvmat_idx, false, this.transform);

    var coords = this.context_buffers [pos + BufferSet.COORD_IDX];
    var textures = this.context_buffers [pos + BufferSet.TEXTURE_IDX];
    var elements = this.context_buffers [pos + BufferSet.ELEMENT_IDX];

    // Coordinate buffer

    ctx3.bindBuffer(ctx3.ARRAY_BUFFER, coords);
    ctx3.enableVertexAttribArray(this.variable_texture_pos);
    ctx3.vertexAttribPointer(this.variable_texture_pos, 3, ctx3.FLOAT, false, 0, 0);

    // Texture buffer

    ctx3.bindBuffer(ctx3.ARRAY_BUFFER, textures);
    ctx3.enableVertexAttribArray(this.variable_texture);
    ctx3.vertexAttribPointer(this.variable_texture, 2, ctx3.FLOAT, false, 0, 0);

    ctx3.bindTexture (ctx3.TEXTURE_2D, texture) ;
    ctx3.pixelStorei(ctx3.UNPACK_FLIP_Y_WEBGL, true);
    ctx3.texImage2D(ctx3.TEXTURE_2D, 0, ctx3.RGBA, ctx3.RGBA, ctx3.UNSIGNED_BYTE, texture.image);
    ctx3.texParameteri(ctx3.TEXTURE_2D, ctx3.TEXTURE_MAG_FILTER, ctx3.NEAREST);
    ctx3.generateMipmap (ctx3.TEXTURE_2D) ;
    ctx3.activeTexture (ctx3.TEXTURE0) ;
    ctx3.uniform1i (this.texture_prog.samplerUniform, 0) ;

    // Elements buffer

    ctx3.bindBuffer(ctx3.ELEMENT_ARRAY_BUFFER, elements);
    ctx3.drawElements(ctx3.TRIANGLES, num_elements, ctx3.UNSIGNED_SHORT, 0);
}

