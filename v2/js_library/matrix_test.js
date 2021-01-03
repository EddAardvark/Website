// ================================================================================================
// 2D Matrix Test functions
// (c) John Whitehouse 2019
// www.eddaardvark.co.uk
// ================================================================================================

//==============================================================================================================
Tests = function (){}

Tests.Matrix2dToArray = function (m2d)
{
	return [m2d.m11, m2d.m12, m2d.m21, m2d.m22];
}
Tests.Matrix3dToArray = function (m3d)
{
	return [m3d.m11, m3d.m12, m3d.m13, m3d.m21, m3d.m22, m3d.m23, m3d.m31, m3d.m32, m3d.m33];
}

Tests.ArrayCompare = function (a1, a2, message)
{
	if (a1.length != a2.length)
	{
		alert (message + ": length");
		return;
	}
	for (var i = 0 ; i < a1.length ; ++i)
	{
		if (a1[i] != a2[i])
		{
			alert (message + ": elements " + [i, a1[i], a2[i]]);
			return;
		}
	}
}
//==============================================================================================================
Tests.ValueCompare = function (a1, a2, message)
{
	if (a1 != a2) alert (message + ": value " + a1 + " <> " + a2);
}

//==============================================================================================================
Matrix2D.Tests = function ()
{
	var m1 = new Matrix2D (1,2,3,4);
	var m2 = new Matrix2D (4,3,2,1);

	var m3 = m1.ScaleBy (2);
	if (m3.m11 != 2 || m3.m12 != 4 || m3.m21 != 6 || m3.m22 != 8) alert ("Scale failed!");
	
	var m4 = m1.PostMultiplyBy (m2);
	if (m4.m11 != 8 || m4.m12 != 5 || m4.m21 != 20 || m4.m22 != 13) alert ("Post Multiply failed!");

	var m5 = m1.PreMultiplyBy (m2);
	if (m5.m11 != 13 || m5.m12 != 20 || m5.m21 != 5 || m5.m22 != 8) alert ("Pre Multiply failed!");

	var m6 = m1.Add (m2);
	if (m6.m11 != 5 || m6.m12 != 5 || m6.m21 != 5 || m6.m22 != 5) alert ("Add failed!");

	var m7 = m1.Subtract (m2);
	if (m7.m11 != -3 || m7.m12 != -1 || m7.m21 != 1 || m7.m22 != 3) alert ("Subtract failed!");

	if (m1.Determinant () != -2) alert ("Determinant failed!");
	
	var m8 = m1.Inverse ();
	if (m8.m11 != -2 || m8.m12 != 1 || m8.m21 != 1.5 || m8.m22 != -0.5) alert ("Inverse failed!");

	var m9 = m1.Transpose ();
	if (m9.m11 != 1 || m9.m12 != 3 || m9.m21 != 2 || m9.m22 != 4) alert ("Transpose failed!");
	
	var m10 = new Matrix2D (8,10,6,8);
	var m11 = m10.Normalise();
	if (m11.m11 != 4 || m11.m12 != 5 || m11.m21 != 3 || m11.m22 != 4) alert ("Normalise (1) failed!");
	if (m11.Determinant () != 1) alert ("Normalise (2) failed!");	
}

//==============================================================================================================
Matrix3D.Tests = function ()
{
	var m1 = new Matrix3D (1,2,3,4,5,0,1,2,3);
	var m2 = new Matrix3D (4,3,2,1,0,4,3,2,1);

	var m3 = m1.ScaleBy (2);
	Tests.ArrayCompare (Tests.Matrix3dToArray (m3), [2,4,6,8,10,0,2,4,6], "M3D: Scale By failed!");
	
	var m4 = m1.PostMultiplyBy (m2);
	Tests.ArrayCompare (Tests.Matrix3dToArray (m4), [15,9,13,21,12,28,15,9,13], "M3D: Post Multiply failed!");

	var m5 = m1.PreMultiplyBy (m2);
	Tests.ArrayCompare (Tests.Matrix3dToArray (m5), [18,27,18,5,10,15,12,18,12], "M3D: Pre Multiply failed!");

	var m6 = m1.Add (m4);
	Tests.ArrayCompare (Tests.Matrix3dToArray (m6), [16,11,16,25,17,28,16,11,16], "M3D: Add failed!");

	var m7 = m1.Subtract (m2);
	Tests.ArrayCompare (Tests.Matrix3dToArray (m7), [-3,-1,1,3,5,-4,-2,0,2], "M3D: Subtract failed!");

	Tests.ValueCompare (m1.Determinant (), 0, "Determinant 1 failed!");
	Tests.ValueCompare (m2.Determinant (), 5, "Determinant 2 failed!");
	
	if (m1.Inverse () != null) alert ("M3D: Inverse 1 failed!: not null");
	var m8 = m2.Inverse ();
	Tests.ArrayCompare (Tests.Matrix3dToArray (m8), [-1.6,0.2,2.4,2.2,-0.4,-2.8,0.4,0.2,-0.6], "M3D: Inverse 1 failed!");

	var m9 = m1.Transpose ();
	Tests.ArrayCompare (.ToArray(m9), [1,4,1,2,5,2,3,0,3], "M3D: Transpose failed!");
	
	var m11 = m2.Normalise();
	var d = m11.Determinant();
	Tests.ValueCompare (d, 1, "M3D: Normalise (2) failed!");	
}

Matrix2D.Tests ();
Matrix3D.Tests ();
