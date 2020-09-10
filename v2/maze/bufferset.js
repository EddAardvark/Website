//-------------------------------------------------------------------------------------------------
// The set of buffers required to draw a section of the maze.
// (c) John Whitehouse 2014
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------
function BufferSet (texture_id)
{
    this.vertices = [];
    this.colours = [];
    this.elements = [];
    this.texture_coords = [];
    this.texture_id = texture_id;
}

// Divide a texture into 16 sub-textures

BufferSet.NumDivisions = 8;
BufferSet.SubSquares = new Array (64);
BufferSet.NumBuffersPerSet = 4;

BufferSet.COORD_IDX = 0;
BufferSet.COLOUR_IDX = 1;
BufferSet.ELEMENT_IDX = 2;
BufferSet.TEXTURE_IDX = 3;

//-------------------------------------------------------------------------------------------------
// Configure the relative possibilitues of the individual squares, ratio determines how
// much more likely cell n is compared to n+1.
//-------------------------------------------------------------------------------------------------
BufferSet.Initialise = function(ratio)
{
    var step = 1.0 / BufferSet.NumDivisions;
    var basic_square = [0.0, 0.0,  step, 0.0,  step, step,  0.0, step];
    var idx = 0;

    for (var i = 0 ; i < BufferSet.NumDivisions ; ++i)
    {
        var dx = i * step;
        for (var j = 0 ; j < BufferSet.NumDivisions ; ++j)
        {
            var subsq = new Array(8);
            var dy = j * step;

            for (var k = 0 ; k < 4 ; ++k)
            {
                subsq[k*2] = basic_square[k*2] + dx;
                subsq[k*2+1] = basic_square[k*2+1] + dy;
            }
            BufferSet.SubSquares[idx] = subsq;
            idx += 1;
        }
    }
}
//-------------------------------------------------------------------------------------------------
//  Populate the buffers with the data for a specific floor
//-------------------------------------------------------------------------------------------------
BufferSet.prototype.BindData = function (context, pos)
{
    var coords = new Float32Array(this.vertices);
    var colours = new Float32Array(this.colours);
    var elements = new Uint16Array(this.elements);
    var txcoords = new Float32Array(this.texture_coords);

    context.BindArrayData (pos + BufferSet.COORD_IDX, coords);
    context.BindArrayData (pos + BufferSet.COLOUR_IDX, colours);
    context.BindElementData (pos + BufferSet.ELEMENT_IDX, elements);
    context.BindArrayData (pos + BufferSet.TEXTURE_IDX, txcoords);
}
//-------------------------------------------------------------------------------------------------
// Draw this bufferset. Must draw the buffers in the same sequence as BindData
//-------------------------------------------------------------------------------------------------
BufferSet.prototype.Draw = function (context, pos, use_texture)
{
    if (use_texture && this.texture_id >= 0)
    {
        context.DrawTextures (pos, this.elements.length, this.texture_id);
    }
    else
    {
        context.DrawInColour (pos, this.elements.length);
    }
}
//-------------------------------------------------------------------------------------------------
// Adds a quadrilateral to the buffer set
// points - the corners (in sequence)
// colour - the colour of the rectanglr
//-------------------------------------------------------------------------------------------------
BufferSet.prototype.AddQuadrilateral = function (points, colour)
{
    var start = this.vertices.length / 3;

// Points

    for (var i = 0 ; i < 4 ; ++i)
    {
        var pt = points [i];

        for (var j = 0 ; j < 3 ; ++j)
        {
            this.vertices.push (pt[j]);
        }
    }

// Colour

    for (var i = 0 ; i < 4 ; ++i)
    {
        for (var j = 0 ; j < 4 ; ++j)
        {
            this.colours.push (colour [j]);
        }
    }

// element indeces

    this.elements.push (start);
    this.elements.push (start+1);
    this.elements.push (start+2);
    this.elements.push (start);
    this.elements.push (start+2);
    this.elements.push (start+3);
}
//-------------------------------------------------------------------------------------------------
BufferSet.prototype.AddTextureCoords = function (idx)
{
    var t_coords = BufferSet.SubSquares [idx];

    for (var i = 0 ; i < 8 ; ++i)
    {
        this.texture_coords.push (t_coords[i]);
    }
}
