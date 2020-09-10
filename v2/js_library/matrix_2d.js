// ================================================================================================
// 2D Matrix functions
// (c) John Whitehouse 2019
// www.eddaardvark.co.uk
// ================================================================================================

// | m11  m12 |
// | m21  m22 |

Matrix2D = function(m11, m12, m21, m22)
{
	this.m11 = m11;
	this.m12 = m12;
	this.m21 = m21;
	this.m22 = m22;
}

Matrix2D.prototype.Identity = function ()
{
	return new Matrix2D (1,0,0,1);
}

Matrix2D.prototype.ScaleBy = function (f)
{
	return new Matrix2D (this.m11 * f, this.m12 * f, this.m21 * f, this.m22 * f);
}

Matrix2D.prototype.PostMultiplyBy = function (other)
{
	return new Matrix2D (
				this.m11 * other.m11 + this.m12 * other.m21,
				this.m11 * other.m12 + this.m12 * other.m22,
				this.m21 * other.m11 + this.m22 * other.m21,
				this.m21 * other.m12 + this.m22 * other.m22);				
}

Matrix2D.prototype.PreMultiplyBy = function (other)
{
	return new Matrix2D (
				other.m11 * this.m11 + other.m12 * this.m21,
				other.m11 * this.m12 + other.m12 * this.m22,
				other.m21 * this.m11 + other.m22 * this.m21,
				other.m21 * this.m12 + other.m22 * this.m22);			
}

Matrix2D.prototype.Add = function (other)
{
	return new Matrix2D (this.m11 + other.m11, this.m12 + other.m12,
							this.m21 + other.m21, this.m22 + other.m22);				
}

Matrix2D.prototype.Subtract = function (other)
{
	return new Matrix2D (this.m11 - other.m11, this.m12 - other.m12,
							this.m21 - other.m21, this.m22 - other.m22);				
}

Matrix2D.prototype.Determinant = function ()
{
	return this.m11 * this.m22 - this.m12 * this.m21;
}

Matrix2D.prototype.Inverse = function ()
{
	var d = this.Determinant ();	
	if (d == 0) return null;

	return new Matrix2D (this.m22 / d, - this.m12 / d, - this.m21 / d, this.m11 /d);
}

Matrix2D.prototype.Transpose = function ()
{
	return new Matrix2D (this.m11, this.m21, this.m12, this.m22);
}

Matrix2D.prototype.Normalise = function ()
{
	var d = Math.sqrt(this.Determinant ());
	if (d == 0) return null;
	return new Matrix2D (this.m11 / d, this.m12 / d, this.m21 / d, this.m22 / d);
}
Matrix2D.prototype.Map = function (vector)
{
	return [this.m11 * vector [0] + this.m12 * vector [1],
			this.m21 * vector [0] + this.m22 * vector [1]];
}

Matrix2D.prototype.toString = function()
{
    return "(" + this.m11 + "," + this.m12 + "," + this.m21  + "," + this.m22 + ")";
}

