//==============================================================================
// A colourd piece can be a kite or a triangle. Kites have two edges,
// left and right, triangles only have one, for which we reuse left.
// Id is used to match faces within a cube.
//==============================================================================
ColouredPiece = function (type, colour, left, right, id)
{
    this.type = (type == CubeFace.TRIANGLE) ? CubeFace.TRIANGLE : CubeFace.KITE;
    this.face = colour ? colour : "cyan";
    this.left = left ? left : "black";     // Used for triangles
    this.right = right ? right : "black";    // Used for both
    this.id = id ? id : 0; // Used for identifying faces
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
ColouredPiece.prototype.toString = function ()
{
    return this.face + " " + ((this.type == CubeFace.TRIANGLE) ? "T" : "K");
}

