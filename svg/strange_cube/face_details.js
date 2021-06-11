//==============================================================================
// The FaceDetails class
// Holds information about a face
//==============================================================================

FaceDetails = function (key, pieces, num_t, num_k)
{
    this.key = key;
    this.pieces = pieces;
    this.num_triangles = num_t;
    this.num_kites = num_k;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
FaceDetails.prototype.GetPieceTypes = function ()
{
    var types = [];
    this.pieces.forEach(function(x) {types.push(x.type)});

    return types;
}
//-------------------------------------------------------------
FaceDetails.ClonePieces = function (pieces)
{
    var ret = [];

    pieces.forEach(function(x)
    {
        var piece = new ColouredPiece(x.type, x.face, x.left, x.right, x.id);
        ret.push(piece);
    });

    return ret;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Finds the largest binary representaton of the face.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
FaceDetails.PiecesToKey = function (pieces)
{
    var key = 0;
    var len = pieces.length;

    for (var j = 0 ; j < len ; ++j)
    {
        key *= 2;

        if (pieces[j].type == CubeFace.KITE)
        {
            ++ key;
        }
    }

    return key;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
FaceDetails.prototype.toString = function ()
{
    return "FD: Key = " + this.key + ", pieces [" + this.pieces + "]";
}
