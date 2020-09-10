//-------------------------------------------------------------------------------------------------
// The floors in a 3D maze
// (c) John Whitehouse 2014
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------
function FloorData (t)
{
    this.artifacts = [];
    this.structures = [];
    this.locale = null;
}
//-------------------------------------------------------------------------------------------------
// Add a structural element
//-------------------------------------------------------------------------------------------------
FloorData.prototype.SetLocale = function (bufferset)
{
    this.locale = bufferset;
}
//-------------------------------------------------------------------------------------------------
// Add a structural element
//-------------------------------------------------------------------------------------------------
FloorData.prototype.AddStructure = function (bufferset)
{
    this.structures.push (bufferset);
}
//-------------------------------------------------------------------------------------------------
// Add an artifact
//-------------------------------------------------------------------------------------------------
FloorData.prototype.AddArtifact = function (bufferset)
{
    this.artifacts.push (bufferset);
}
//-------------------------------------------------------------------------------------------------
//  Populate the buffers with the data for a this floor
//-------------------------------------------------------------------------------------------------
FloorData.prototype.BindData = function (context)
{
    var sets = this.artifacts.length + this.structures.length;

    sets += (this.locale != null) ? 1 : 0;

    var buffers_required = BufferSet.NumBuffersPerSet * sets;

    context.CreateBuffers (buffers_required);

    var pos = 0;

    if (this.locale != null)
    {
        this.locale.BindData (context, pos);
        pos += BufferSet.NumBuffersPerSet;
    }

    for (var i = 0 ; i < this.structures.length ; ++i)
    {
        this.structures [i].BindData (context, pos);
        pos += BufferSet.NumBuffersPerSet;
    }

    for (var i = 0 ; i < this.artifacts.length ; ++i)
    {
        this.artifacts [i].BindData (context, pos);
        pos += BufferSet.NumBuffersPerSet;
    }
}
//-------------------------------------------------------------------------------------------------
// Draw this floor. Must draw the buffers in the same sequence as BindData
//-------------------------------------------------------------------------------------------------
FloorData.prototype.Draw = function (context, use_texture)
{
    this.BindData (context);

    var pos = 0;

    if (this.locale != null)
    {
        this.locale.Draw (context, pos, use_texture);
        pos += BufferSet.NumBuffersPerSet;
    }

    for (var i = 0 ; i < this.structures.length ; ++i)
    {
        this.structures [i].Draw (context, pos, use_texture);
        pos += BufferSet.NumBuffersPerSet;
    }

    for (var i = 0 ; i < this.artifacts.length ; ++i)
    {
        this.artifacts [i].Draw (context, pos, use_texture);
        pos += BufferSet.NumBuffersPerSet;
    }
}

