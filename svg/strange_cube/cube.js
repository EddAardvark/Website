

//==============================================================================
Cube = function ()
{
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cube.FromDefinitions = function (top_face_def, bottom_face_def)
{
    var ret = new Cube ();
    var top = top_face_def.pieces;
    var bottom = bottom_face_def.pieces;

    ret.key = top_face_def.key * 1000 + bottom_face_def.key;
    ret.top_face = CubeFace.FromPieces (top, "white");
    ret.bottom_face = CubeFace.FromPieces (bottom, "yellow");

    return ret;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cube.FromKeys = function (top_key, bottom_key)
{
    var ret = new Cube ();
    var top = FaceDetails.ClonePieces (CubeFace.unique_faces [top_key].pieces);
    var bottom = FaceDetails.ClonePieces (CubeFace.unique_faces [bottom_key].pieces);

    ret.key = top_key * 1000 + bottom_key;
    ret.top_face = CubeFace.FromPieces (top);
    ret.bottom_face = CubeFace.FromPieces (bottom);

    return ret;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cube.FromKey = function (key)
{
    var k1 = Math.floor(key / 1000);
    var k2 = key % 1000;

    return new Cube.FromKeys (k1, k2);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cube.FromPieces = function (pieces1, pieces2)
{
    var ret = new Cube ();

    ret.top_face = CubeFace.FromPiecesRaw (FaceDetails.ClonePieces (pieces1));
    ret.bottom_face = CubeFace.FromPiecesRaw (FaceDetails.ClonePieces (pieces2));
    ret.key = ret.top_face.key * 1000 + ret.bottom_face.key;

    return ret;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cube.Start = function ()
{
    var ret = new Cube ();

    ret.top_face = CubeFace.StartFace (true);
    ret.bottom_face = CubeFace.StartFace (false);
    ret.key = 170170;

    return ret;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cube.prototype.SetColours = function (top, bottom)
{
    this.top_face.SetColour (top);
    this.bottom_face.SetColour (bottom);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// List of cubes that can be reached with one twist, a map of keys
// and cubes
Cube.prototype.GetNeighbours = function ()
{
    var top_splits = this.top_face.GetSplits ();
    var bottom_splits = this.bottom_face.GetSplits ();
    var neighbours = {};

    for (idx1 in top_splits)
    {
        var top_pieces_1 = top_splits [idx1][1];
        var top_pieces_2 = top_splits [idx1][2];

        for (idx2 in bottom_splits)
        {
            var bottom_pieces_1 = bottom_splits [idx2][1];
            var bottom_pieces_2 = bottom_splits [idx2][2];

            var top_face = top_pieces_1.concat (bottom_pieces_2);
            var bottom_face = top_pieces_2.concat (bottom_pieces_1);
            var top_temp = CubeFace.Identify (top_face);
            var bottom_temp = CubeFace.Identify (bottom_face);

            if (top_temp != null && bottom_temp != null)
            {
                var cube = (top_temp.key > bottom_temp.key)
                                ? Cube.FromDefinitions (top_temp, bottom_temp)
                                : Cube.FromDefinitions (bottom_temp, top_temp);

                neighbours [cube.key] = cube;
            }
        }
    }
    return neighbours;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// List of cubes that can be reached with one twist, a map of keys and cubes. This version
// doesn't filter based on duplicate keys and returns a list of cubes
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cube.prototype.GetAllNeighbours = function ()
{
    var top_splits = this.top_face.GetSplits ();
    var bottom_splits = this.bottom_face.GetSplits ();
    var temp = {};

    for (idx1 in top_splits)
    {
        var top_pieces_1 = top_splits [idx1][1];
        var top_pieces_2 = top_splits [idx1][2];

        for (idx2 in bottom_splits)
        {
            var bottom_pieces_1 = bottom_splits [idx2][1];
            var bottom_pieces_2 = bottom_splits [idx2][2];

            var top_pieces = top_pieces_1.concat (bottom_pieces_2);
            var bottom_pieces = top_pieces_2.concat (bottom_pieces_1);

            // Keep piece 0 on the top

            var use_top = false;
            for (var i = 0 ; i < top_pieces.length ; ++i)
            {
                if (top_pieces[i].id == 0)
                {
                    use_top = true;
                    break;
                }
            }

            var cube = (use_top) ? Cube.FromPieces (top_pieces, bottom_pieces) : Cube.FromPieces (bottom_pieces, top_pieces);
            temp [cube.GetId()] = cube; // This takes into account the face colour
        }
    }
    var neighbours = [];
    var keys = Object.getOwnPropertyNames (temp);
    keys.forEach(function(x)
    {
        neighbours.push (temp [x]);
    });

    return neighbours;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cube.prototype.GetId = function ()
{
    return this.top_face.GetId() + "_" + this.bottom_face.GetId ();
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cube.prototype.toString = function ()
{
    return "Cube_" + this.key;
}



