
//-------------------------------------------------------------------------------------------------
// Implements a walker on the surface (x^3 + y^3 - z^3 = 0)
//
// Uses VLIntegers to avoid being confined to small numbers
//
// (c) John Whitehouse 2019
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

CubeSurfer = function (cw)
{
    this.cw = CubeWalker.Clone (cw);
}
//--------------------------------------------------------------------------------------------
// Increments X and adjusts z so that x^3+y^3-z^3 is the smallest possible value.
CubeSurfer.prototype.TrackX = function ()
{
    var ret = new CubeSurfer (this.cw);
    ret.cw.IncrementX ();
    ret.FixZ ();
    return ret;
}
//--------------------------------------------------------------------------------------------
// Increments Y and adjusts z so that x^3+y^3-z^3 is the smallest possible value.
CubeSurfer.prototype.TrackY = function ()
{
    var ret = new CubeSurfer (this.cw);
    ret.cw.IncrementY ();
    ret.FixZ ();
    return ret;
}
//--------------------------------------------------------------------------------------------
// Adjust Z to find the smallest positive value
CubeSurfer.prototype.FixZ = function ()
{
    if (this.cw.value.positive)
    {
        while (true)
        {
            this.cw.SetSubValue ();

            if (! this.cw.subvalue.positive)
            {
                break;
            }
            this.cw.IncrementZ ();
        }        
    }
    else
    {
        while (! this.cw.value.positive)
        {
            this.cw.DecrementZ ();
        }
        this.cw.SetSubValue ();
    }
}
CubeSurfer.SM_Z = 0;
CubeSurfer.SM_VALUE = 1;
CubeSurfer.SM_WALKER = 2;
CubeSurfer.SM_XYZ = 3;
CubeSurfer.SM_RANGE = 4;
CubeSurfer.SM_SUBVALUE = 5;
CubeSurfer.SM_INTERCEPT = 6;
//--------------------------------------------------------------------------------------------
CubeSurfer.prototype.DisplayText = function (mode)
{
    if (mode == CubeSurfer.SM_Z)
    {
        return this.cw.big_cz.root.toString();
    }
    else if (mode == CubeSurfer.SM_VALUE)
    {
        return this.cw.value.toString();
    }
    else if (mode == CubeSurfer.SM_WALKER)
    {
        return this.cw.toString();
    }
    else if (mode == CubeSurfer.SM_XYZ)
    {
        return Misc.Format ("({0},{1},{2})", this.cw.big_cx.root, this.cw.big_cy.root, this.cw.big_cz.root);
    }
    else if (mode == CubeSurfer.SM_RANGE)
    {
        return Misc.Format ("({0},{1})", this.cw.subvalue, this.cw.value);
    }
    else if (mode == CubeSurfer.SM_SUBVALUE)
    {
        return this.cw.subvalue.toString();
    }
    else if (mode == CubeSurfer.SM_INTERCEPT)
    {
        var r = this.cw.value.Subtract (this.cw.subvalue);
        return Misc.FloatToText (VLInt.Ratio (this.cw.value, r), 8);
    }
}
//--------------------------------------------------------------------------------------------
CubeSurfer.prototype.toString = function ()
{
    return "(" + this.cw.value + "," + this.subvalue + ")";
}
   
   