
//==============================================================================
// The CubeFace class
// Pieces can be an array of numbers, strings or ColouredPiece objects
//==============================================================================

CubeFace = function ()
{
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CubeFace.TRIANGLE = 1;
CubeFace.KITE = 2;
CubeFace.HALF_FACE = 6;
CubeFace.FULL_FACE = 12;
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CubeFace.Init = function ()
{
    CubeFace.short_points = [];
    CubeFace.long_points = [];
    CubeFace.triangles = [];
    CubeFace.kites = [];
    CubeFace.possibile_faces = [];
    CubeFace.unique_faces = {};

    var len1 = 1 / Math.cos (Math.PI / CubeFace.FULL_FACE);
    var len2 = Math.sqrt(2);

    // The points

    for (var i = 0 ; i < CubeFace.FULL_FACE ; ++i)
    {
        var a = i * Math.PI / 6;
        var c = Math.cos (a);
        var s = Math.sin (a);

        CubeFace.short_points.push ([s,c]);
        CubeFace.long_points.push ([s * len2, c * len2]);
    }

    // The shapes

    for (var i = 0 ; i < CubeFace.FULL_FACE ; ++i)
    {
        var i2 = (i + 1) % CubeFace.FULL_FACE;
        var i3 = (i + 2) % CubeFace.FULL_FACE;

        CubeFace.triangles.push ([[0,0], CubeFace.short_points [i], CubeFace.short_points [i2]]);
        CubeFace.kites.push ([[0,0], CubeFace.short_points [i], CubeFace.long_points [i2], CubeFace.short_points [i3]]);
    }

    // Possible faces

    CubeFace.GetPossibleFaces ();
}
//-------------------------------------------------------------
CubeFace.FromString = function (text, face_colour)
{
    var types = [];
    var len = text.length;
    var sum = 0;

    if (! face_colour) face_colour = "white";

    for (var i = 0 ; i < len; ++i)
    {
        if (text[i] == '1')
        {
            types.push (CubeFace.TRIANGLE);
            ++ sum;
        }
        else if (text[i] == '2')
        {
            types.push (CubeFace.KITE);
            sum += 2;
        }
        else
        {
            alert ("'" + text[i] + "' does not define a valid piece");
            return null;
        }
    }

    if (sum != 12)
    {
        alert ("The total of the pieces must be 12");
        return null;
    }

    return CubeFace.FromTypes (types, face_colour);
}
//-------------------------------------------------------------
CubeFace.FromTypes = function (types, face_colour)
{
    var ret = new CubeFace ();

    if (! face_colour) face_colour = "white";

    ret.pieces = [];

    for (var idx in types)
    {
        var type = parseInt (types [idx]);
        ret.pieces.push (new ColouredPiece(type, face_colour));
    }

    ret.key = CubeFace.Identify (ret.pieces) [0];

    return ret;
}
//-------------------------------------------------------------
CubeFace.StartFace = function (top)
{
    var ret = new CubeFace ();
    var id = top ? 0 : 8;
    var face = top ? "white" : "yellow";
    var colours = top ? ["green", "red", "blue", "orange"] : ["green", "orange", "blue", "red"]



    ret.pieces = [];

    ret.pieces.push (new ColouredPiece(CubeFace.KITE, face, colours [0], colours [1], id));
    ret.pieces.push (new ColouredPiece(CubeFace.TRIANGLE, face, colours [1], "", id+1));
    ret.pieces.push (new ColouredPiece(CubeFace.KITE, face, colours [1], colours [2], id+2));
    ret.pieces.push (new ColouredPiece(CubeFace.TRIANGLE, face, colours [2], "", id+3));
    ret.pieces.push (new ColouredPiece(CubeFace.KITE, face, colours [2], colours [3], id+4));
    ret.pieces.push (new ColouredPiece(CubeFace.TRIANGLE, face, colours [3], "", id+5));
    ret.pieces.push (new ColouredPiece(CubeFace.KITE, face, colours [3], colours [0], id+6));
    ret.pieces.push (new ColouredPiece(CubeFace.TRIANGLE, face, colours [0], "", id+7));

    ret.key = CubeFace.Identify (ret.pieces) [0];

    return ret;
}
//-------------------------------------------------------------
// This version rotates the pieces to find the largest key
//-------------------------------------------------------------
CubeFace.FromPieces = function (pieces)
{
    var ret = new CubeFace ();

    ret.pieces = pieces;
    ret.key = CubeFace.Identify (pieces).key;

    return ret;
}
//-------------------------------------------------------------
CubeFace.FromPiecesRaw = function (pieces)
{
    var ret = new CubeFace ();

    ret.pieces = pieces;
    ret.key = FaceDetails.PiecesToKey (pieces);

    return ret;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CubeFace.prototype.SetColour = function (colour)
{
    for (var idx in this.pieces)
    {
        this.pieces [idx].face = colour;
    }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Converts to an SVG drawing
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CubeFace.prototype.Draw = function (sz)
{
    var size = (sz) ? sz : 500;

    return CubeFace.DrawPieces (0, this.pieces, size);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CubeFace.prototype.DrawInColour = function (sz)
{
    var size = (sz) ? sz : 500;

    return CubeFace.DrawPiecesInColour (0, this.pieces, size);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CubeFace.DrawPieces = function (start, pieces, size)
{
    var pos = start;
    var svg = SVGHelp.Start (size, size, -1.5, -1.5, 1.5, 1.5);

    for (idx in pieces)
    {
        if (pieces [idx].type == CubeFace.TRIANGLE)
        {
            svg += SVGHelp.Polygon (CubeFace.triangles [pos], pieces [idx].face, "black");
            pos = (pos + 1) % CubeFace.FULL_FACE;
        }
        else if (pieces [idx].type == CubeFace.KITE)
        {
            svg += SVGHelp.Polygon (CubeFace.kites [pos], pieces [idx].face, "black");
            pos = (pos + 2) % CubeFace.FULL_FACE;
        }
    }

    svg += SVGHelp.End ();
    return svg;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CubeFace.DrawPiecesInColour = function (start, pieces, size)
{
    var pos = start;
    var svg = SVGHelp.Start (size, size, -1.5, -1.5, 1.5, 1.5);
    var width = 0.2;
    var w2 = 1 - width;

    for (idx in pieces)
    {
        if (pieces [idx].type == CubeFace.TRIANGLE)
        {
            var t = CubeFace.triangles [pos];
            var p1 = [t[0][0] * width + t[1][0] * w2, t[0][1] * width + t[1][1] * w2];
            var p2 = [t[0][0] * width + t[2][0] * w2, t[0][1] * width + t[2][1] * w2];

            svg += SVGHelp.Polygon ([t[0],p1,p2], pieces [idx].face, "black");
            svg += SVGHelp.Polygon ([p1,t[1],t[2],p2], pieces [idx].left, "black");
            pos = (pos + 1) % CubeFace.FULL_FACE;
        }
        else if (pieces [idx].type == CubeFace.KITE)
        {
            var k = CubeFace.kites [pos];
            var p1 = [k[0][0] * width + k[1][0] * w2, k[0][1] * width + k[1][1] * w2];
            var p2 = [k[0][0] * width + k[2][0] * w2, k[0][1] * width + k[2][1] * w2];
            var p3 = [k[0][0] * width + k[3][0] * w2, k[0][1] * width + k[3][1] * w2];
            svg += SVGHelp.Polygon ([k[0],p1,p2,p3], pieces [idx].face, "black");
            svg += SVGHelp.Polygon ([p1,k[1],k[2],p2], pieces [idx].left, "black");
            svg += SVGHelp.Polygon ([p2,k[2],k[3],p3], pieces [idx].right, "black");
            pos = (pos + 2) % CubeFace.FULL_FACE;
        }
    }

    svg += SVGHelp.End ();
    return svg;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Returns a map, the key is a letter, the values are the drawing position,
// the left pieces and the right pieces.
CubeFace.prototype.GetSplits = function ()
{
    var ret = {};
    var n = 0;
    var letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
    var num_pts = this.pieces.length;
    var draw_pos = 0;

    for (var i = 0 ; i < num_pts ; ++i)
    {
        var sum = 0;
        var left = [];
        var right = [];

        for (var j = 0 ; j < num_pts && sum < CubeFace.HALF_FACE ; ++j)
        {
            var i2 = (i + j) % num_pts;

            left.push (this.pieces [i2]);
            sum += this.pieces [i2].type;

            if (sum == CubeFace.HALF_FACE)
            {
                for (++j ; j < this.pieces.length ; ++j)
                {
                    i2 = (i + j) % num_pts;
                    right.push (this.pieces [i2]);
                }

                ret [letters [n]] = [draw_pos, left, right];
                ++n;
            }
        }
        draw_pos += this.pieces [i].type;
    }
    return ret;
}
//-------------------------------------------------------------
CubeFace.GetPossibleFaces = function ()
{
    var start = [2, [new ColouredPiece (2, "white")]];   // Every face has at least 1 '2'.

    CubeFace.FindPossibilities (start);

    // Filter out rotations and add some detail

    var possibilities = CubeFace.possibile_faces;

    for (var idx in possibilities)
    {
        var temp = CubeFace.Identify (possibilities[idx]);

        if (temp != null)
        {
            CubeFace.unique_faces [temp.key] = temp;
        }
    }
}
//-------------------------------------------------------------
// Current will contains a tuple, the first element is the sum,
// the second is the pieces
//-------------------------------------------------------------
CubeFace.FindPossibilities = function (current)
{
    if (current [0] > 12)
    {
        alert ("Shouldn't happen");
        return;
    }
    if (current [0] == 12)
    {
        CubeFace.possibile_faces.push (current [1]);
        return;
    }

    if (current [0] <= 10)
    {
        var next1 = [new ColouredPiece (2, "white")].concat (current[1]);
        CubeFace.FindPossibilities ([current[0]+2, next1]);
    }
    if (current [0] <= 11)
    {
        var next2 = [new ColouredPiece (1, "white")].concat (current[1]);
        CubeFace.FindPossibilities ([current[0]+1, next2]);
    }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Finds the largest binary representaton of the face.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CubeFace.Identify = function (pieces)
{
    var ret = null;
    var f2 = pieces;
    var len = pieces.length;

    for (var i = 0 ; i < len ; ++i)
    {
        var key = 0;
        var counts = [0,0];

        for (var j = 0 ; j < len ; ++j)
        {
            key *= 2;

            if (f2 [j].type == CubeFace.KITE)
            {
                ++ key;
            }
            ++ counts [f2 [j].type - 1];
        }

        if (counts[CubeFace.TRIANGLE] < 2)
        {
            return null;
        }

        if (ret == null || key > ret.key)
        {
            ret = new FaceDetails (key, f2, counts[0], counts[1]);
        }

        // rotate

        f2 = f2.slice (-1).concat (f2.slice (0,len-1));
    }
    return ret;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Cmbines the individuakl ids, starting with the smallest but preserving the order.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CubeFace.prototype.GetId = function ()
{
    var len = this.pieces.length;
    var minpos = 0;
    var minval = this.pieces [0].id;

    for (var i = 1 ; i < len ; ++i)
    {
        if (this.pieces [i].id < minval)
        {
            minpos = i;
            minval = this.pieces [i].id;
        }
    }
    var ret = this.pieces [minpos].id;

    for (var i = 1 ; i < len ; ++i)
    {
        ret += "." + this.pieces [(i + minpos) % len].id;
    }
    return ret;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CubeFace.prototype.toString = function ()
{
    return "CubeFace: k = " + this.key;
}

