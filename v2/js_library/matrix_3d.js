// ================================================================================================
// 2D Matrix functions
// (c) John Whitehouse 2019
// www.eddaardvark.co.uk
// ================================================================================================

// | m11  m12 m13|
// | m21  m22 m23|
// | m31  m32 m33|

Matrix3D = function(m11, m12, m13, m21, m22, m23, m31, m32, m33)
{
	this.m11 = m11;
	this.m12 = m12;
	this.m13 = m13;
	this.m21 = m21;
	this.m22 = m22;
	this.m23 = m23;
	this.m31 = m31;
	this.m32 = m32;
	this.m33 = m33;
}

Matrix3D.prototype.Identity = function ()
{
	return new Matrix3D (1,0,0,0,1,0,0,0,1);
}

Matrix3D.prototype.ScaleBy = function (f)
{
	return new Matrix3D (this.m11 * f, this.m12 * f, this.m13 * f,
						 this.m21 * f, this.m22 * f, this.m23 * f,
						 this.m31 * f, this.m32 * f, this.m33 * f);
}

Matrix3D.prototype.PostMultiplyBy = function (other)
{
	return new Matrix3D (
				this.m11 * other.m11 + this.m12 * other.m21 + this.m13 * other.m31,
				this.m11 * other.m12 + this.m12 * other.m22 + this.m13 * other.m32,
				this.m11 * other.m13 + this.m12 * other.m23 + this.m13 * other.m33,

				this.m21 * other.m11 + this.m22 * other.m21 + this.m23 * other.m31,
				this.m21 * other.m12 + this.m22 * other.m22 + this.m23 * other.m32,
				this.m21 * other.m13 + this.m22 * other.m23 + this.m23 * other.m33,

				this.m31 * other.m11 + this.m32 * other.m21 + this.m33 * other.m31,
				this.m31 * other.m12 + this.m32 * other.m22 + this.m33 * other.m32,
				this.m31 * other.m13 + this.m32 * other.m23 + this.m33 * other.m33);
				
}

Matrix3D.prototype.PreMultiplyBy = function (other)
{
	return new Matrix3D (
				other.m11 * this.m11 + other.m12 * this.m21 + other.m13 * this.m31,
				other.m11 * this.m12 + other.m12 * this.m22 + other.m13 * this.m32,
				other.m11 * this.m13 + other.m12 * this.m23 + other.m13 * this.m33,

				other.m21 * this.m11 + other.m22 * this.m21 + other.m23 * this.m31,
				other.m21 * this.m12 + other.m22 * this.m22 + other.m23 * this.m32,
				other.m21 * this.m13 + other.m22 * this.m23 + other.m23 * this.m33,

				other.m31 * this.m11 + other.m32 * this.m21 + other.m33 * this.m31,
				other.m31 * this.m12 + other.m32 * this.m22 + other.m33 * this.m32,
				other.m31 * this.m13 + other.m32 * this.m23 + other.m33 * this.m33);
}

Matrix3D.prototype.Add = function (other)
{
	return new Matrix3D (this.m11 + other.m11, this.m12 + other.m12, this.m13 + other.m13,
						 this.m21 + other.m21, this.m22 + other.m22, this.m23 + other.m23,
						 this.m31 + other.m31, this.m32 + other.m32, this.m33 + other.m33);
}

Matrix3D.prototype.Subtract = function (other)
{
	return new Matrix3D (this.m11 - other.m11, this.m12 - other.m12, this.m13 - other.m13,
						 this.m21 - other.m21, this.m22 - other.m22, this.m23 - other.m23,
						 this.m31 - other.m31, this.m32 - other.m32, this.m33 - other.m33);
}

Matrix3D.prototype.Determinant = function ()
{
	return   this.m11 * (this.m22 * this.m33 - this.m23 * this.m32)
	       - this.m12 * (this.m21 * this.m33 - this.m23 * this.m31)
		   + this.m13 * (this.m21 * this.m32 - this.m22 * this.m31);
}

Matrix3D.prototype.Inverse = function ()
{
	var d = this.Determinant ();
	if (d == 0) return null;

	var n11 = (this.m22 * this.m33 - this.m23 * this.m32) / d;
	var n12 = (this.m21 * this.m33 - this.m23 * this.m31) / d;
	var n13 = (this.m21 * this.m32 - this.m22 * this.m31) / d;
	var n21 = (this.m12 * this.m33 - this.m13 * this.m32) / d;
	var n22 = (this.m11 * this.m33 - this.m13 * this.m31) / d;
	var n23 = (this.m11 * this.m32 - this.m12 * this.m31) / d;
	var n31 = (this.m12 * this.m23 - this.m13 * this.m22) / d;
	var n32 = (this.m11 * this.m23 - this.m13 * this.m21) / d;
	var n33 = (this.m11 * this.m22 - this.m12 * this.m21) / d;
	
	return new Matrix3D (n11, -n21, n31, -n12, n22, -n32, n13, -n23, n33);
}

Matrix3D.prototype.Transpose = function ()
{
	return new Matrix3D (this.m11, this.m21, this.m31,
                         this.m12, this.m22, this.m32,
						 this.m13, this.m23, this.m33);
}

Matrix3D.prototype.Normalise = function ()
{
	var d = Math.pow(this.Determinant (), 1/3);
	if (d == 0) return null;
	return new Matrix3D (this.m11 / d, this.m12 / d, this.m13 / d,
						 this.m21 / d, this.m22 / d, this.m23 / d,
						 this.m31 / d, this.m32 / d, this.m33 / d);
}
Matrix3D.prototype.Map = function (vector)
{
	return [this.m11 * vector [0] + this.m12 * vector [1] + this.m13 * vector [2],
			this.m21 * vector [0] + this.m22 * vector [1] + this.m23 * vector [2],
			this.m31 * vector [0] + this.m32 * vector [1] + this.m33 * vector [2]];
}

Matrix3D.prototype.toString = function()
{
    return "(" + this.m11 + "," + this.m12 + "," + this.m13 + "," +
	             this.m21 + "," + this.m22 + "," + this.m23 + "," +
	             this.m31 + "," + this.m32 + "," + this.m33 + ")";
}
