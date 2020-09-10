// ================================================================================================
// 2D Affine transformation
// Requires Matrix3D and Matrix2D
// (c) John Whitehouse 2019
// www.eddaardvark.co.uk
//
// Transform = | Cos (a1) Cos(a2) | * |x| + |dx|
//             | Sin (a1) Sin(a2) |   |y|   |dy|
// ================================================================================================


AffineTransformation = function ()
{
    // Construct the identity, angles are in degrees
    
    this.angle_1 = 0;               // Angle that the (1,0) vector is rotated to produce the first vector
    this.angle_2 = 90;              // Angle that the (1,0) vector is rotated to produce the second vector
    this.scale_x = 1;               // Length of first vector
    this.scale_y = 1;               // Length of secodd vector
    this.dx = 0;                    // x origin
    this.dy = 0;                    // y origin
    
    this.matrix2 = this.MakeMatrix2D ();
    this.matrix3 = this.MakeMatrix3D ();
}

AffineTransformation.D2R = Math.PI / 180;

AffineTransformation.prototype.GetDefinition = function ()
{
    var obj = {};
    
    obj.a1 = this.angle_1;
    obj.a2 = this.angle_2;
    obj.sx = this.scale_x;
    obj.sy = this.scale_y;
    obj.dx = this.dx;
    obj.dy = this.dy;
    
    return obj;
}

AffineTransformation.prototype.SetDefinition = function (defn)
{
    this.angle_1 = defn.a1;
    this.angle_2 = defn.a2;
    this.scale_x = defn.sx;
    this.scale_y = defn.sy;
    this.dx = defn.dx;
    this.dy = defn.dy;    
    
    this.matrix2 = this.MakeMatrix2D ();
    this.matrix3 = this.MakeMatrix3D ();
}
AffineTransformation.prototype.Clone = function ()
{
    var clone = new AffineTransformation ();
    
    clone.angle_1 = this.angle_1;
    clone.angle_2 = this.angle_2;
    clone.scale_x = this.scale_x;
    clone.scale_y = this.scale_y;
    clone.dx = this.dx;
    clone.dy = this.dy;
    
    clone.matrix2 = clone.MakeMatrix2D ();
    clone.matrix3 = clone.MakeMatrix3D ();
    
    return clone;
}

AffineTransformation.prototype.SetRotationDegrees = function (angle)
{
    this.angle_1 = angle;           // Angle that the (1,0) vector is rotated to produce the first vector
    this.angle_2 = angle+90;        // Angle that the (1,0) vector is rotated to produce the second vector
    
    this.matrix2 = this.MakeMatrix2D ();
    this.matrix3 = this.MakeMatrix3D ();
}

AffineTransformation.prototype.SetSkewDegrees = function  (angle1, angle2)
{
    this.angle_1 = angle1;
    this.angle_2 = angle2;
    
    this.matrix2 = this.MakeMatrix2D ();
    this.matrix3 = this.MakeMatrix3D ();
}

AffineTransformation.prototype.SetScale = function  (sx, sy)
{
    this.scale_x = sx;
    this.scale_y = sy;
    
    this.matrix2 = this.MakeMatrix2D ();
    this.matrix3 = this.MakeMatrix3D ();
}

AffineTransformation.prototype.SetOffset = function  (dx, dy)
{
    this.dx = dx;
    this.dy = dy;
    
    this.matrix2 = this.MakeMatrix2D ();
    this.matrix3 = this.MakeMatrix3D ();
}

AffineTransformation.prototype.ReflectX = function  ()
{
    this.scale_x = -this.scale_x;
    
    this.matrix2 = this.MakeMatrix2D ();
    this.matrix3 = this.MakeMatrix3D ();
}

AffineTransformation.prototype.ReflectY = function  ()
{
    this.scale_y = -this.scale_y;
    
    this.matrix2 = this.MakeMatrix2D ();
    this.matrix3 = this.MakeMatrix3D ();
}

AffineTransformation.prototype.MakeMatrix2D = function  ()
{
    var a1 = this.angle_1 * AffineTransformation.D2R;
    var a2 = this.angle_2 * AffineTransformation.D2R;

    return new Matrix2D (Math.cos (a1) * this.scale_x,
                         Math.cos (a2) * this.scale_y,
                         Math.sin (a1) * this.scale_x,
                         Math.sin (a2) * this.scale_y);
}

AffineTransformation.prototype.MakeMatrix3D = function  ()
{
    var a1 = this.angle_1 * AffineTransformation.D2R;
    var a2 = this.angle_2 * AffineTransformation.D2R;

    return new Matrix3D (Math.cos (a1) * this.scale_x,
                         Math.cos (a2) * this.scale_y,
                         this.dx,
                         Math.sin (a1) * this.scale_x,
                         Math.sin (a2) * this.scale_y,
                         this.dy,
                         0, 0, 1);
}

AffineTransformation.prototype.SetMatrix2D = function  (m2d)
{
    // Doesn't change the vector (dx, dy)

    this.angle_1 = Math.atan (m2d.m11, m2d.m21);
    this.angle_2 = Math.atan (m2d.m12, m2d.m22); 
    this.scale_x = Math.sqrt (m2d.m11 * m2d.m11 + m2d.m21 * m2d.m21);
    this.scale_y = Math.sqrt (m2d.m12 * m32.m12 + m2d.m22 * m2d.m22);
    
    this.matrix2 = this.MakeMatrix2D ();
    this.matrix3 = this.MakeMatrix3D ();
}

AffineTransformation.prototype.SetMatrix3D = function  (m3d)
{
    this.angle_1 = Math.atan (m3d.m11, m3d.m21);
    this.angle_2 = Math.atan (m3d.m12, m3d.m22);
    this.scale_x = Math.sqrt (m3d.m11 * m3d.m11 + m3d.m21 * m3d.m21);
    this.scale_y = Math.sqrt (m3d.m12 * m3d.m12 + m3d.m22 * m3d.m22);
    
    this.matrix2 = this.MakeMatrix2D ();
    this.matrix3 = this.MakeMatrix3D ();
}

AffineTransformation.prototype.MapV3  = function (vector3)
{
    return this.matrix3.Map (vector3);
}
AffineTransformation.prototype.MapV2  = function (vector2)
{
    var v2 = this.matrix2.Map (vector2);
    
    v2[0] += this.dx;
    v2[1] += this.dy;
    
    return v2;
}




