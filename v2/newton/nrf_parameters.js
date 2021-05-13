//-------------------------------------------------------------------------------------------------
// Parameters used to construct the newton raphson fractal
// (c) John Whitehouse 2021
// www.eddaardvark.co.uk
//
// For polynomials up to degree 9.
//-------------------------------------------------------------------------------------------------
NRFParameters = function ()
{
    this.z9 = 0;
    this.z8 = 0;
    this.z7 = 0;
    this.z6 = 0;
    this.z5 = 0;
    this.z4 = 0;
    this.z3 = 1;
    this.z2 = -2.55;
    this.z1 = 0;
    this.z0 = -1;
    this.zoom = [0.5,1.5];
    this.steps = [100,500];
    this.alpha = new Complex (1,0);
    this.seed = new Complex (1,0);
    this.colour = new Complex (0,0);
}
//------------------------------------------------------------------------------
NRFParameters.Clone = function ()
{
    var ret = new NRFParameters();
    
    ret.z9 = this.z9;
    ret.z8 = this.z8;
    ret.z7 = this.z7;
    ret.z6 = this.z6;
    ret.z5 = this.z5;
    ret.z4 = this.z4;
    ret.z3 = this.z3;
    ret.z2 = this.z2;
    ret.z1 = this.z1;
    ret.z0 = this.z0;
    ret.zoom = this.zoom;
    ret.steps = this.steps;
    ret.alpha = Complex.FromComplex (this.alpha);
    ret.seed = Complex.FromComplex (this.seed);
    ret.colour = Complex.FromComplex (this.colour);    
}
//------------------------------------------------------------------------------
NRFParameters.prototype.Copy = function (other)
{
    this.z9 = other.z9;
    this.z8 = other.z8;
    this.z7 = other.z7;
    this.z6 = other.z6;
    this.z5 = other.z5;
    this.z4 = other.z4;
    this.z3 = other.z3;
    this.z2 = other.z2;
    this.z1 = other.z1;
    this.z0 = other.z0;
    this.zoom = other.zoom;
    this.steps = other.steps;
    this.alpha = Complex.FromComplex (other.alpha);
    this.seed = Complex.FromComplex (other.seed);
    this.colour = Complex.FromComplex (other.colour);    
}
//------------------------------------------------------------------------------
// Creates a position somewhere between two others, f is the interpolation factor
// f outside the range 0-1 will extrapolate.
//------------------------------------------------------------------------------
NRFParameters.Interpolate = function (nrf1, nrf2, f)
{
    var ret = new NRFParameters();
    var f2 = 1 - f;
    
    // Polynomial linear
    
    ret.z9 = f2 * nrf1.z9 + f * nrf2.z9;
    ret.z8 = f2 * nrf1.z8 + f * nrf2.z8;
    ret.z7 = f2 * nrf1.z7 + f * nrf2.z7;
    ret.z6 = f2 * nrf1.z6 + f * nrf2.z6;
    ret.z5 = f2 * nrf1.z5 + f * nrf2.z5;
    ret.z4 = f2 * nrf1.z4 + f * nrf2.z4;
    ret.z3 = f2 * nrf1.z3 + f * nrf2.z3;
    ret.z2 = f2 * nrf1.z2 + f * nrf2.z2;
    ret.z1 = f2 * nrf1.z1 + f * nrf2.z1;
    ret.z0 = f2 * nrf1.z0 + f * nrf2.z0;
    
    // Complex;    
    
    ret.alpha = Complex.Interpolate (nrf1.alpha, nrf2.alpha, f);
    ret.seed = Complex.Interpolate (nrf1.seed, nrf2.seed, f);
    ret.colour = Complex.Interpolate (nrf1.colour, nrf2.colour, f);
    
    // Zoom & iterations exponential
    
    for (i = 0 ; i < 2 ; ++i)
    {
        ret.zoom [i] = nrf1.zoom [i] * Math.pow (nrf2.zoom [i]/nrf1.zoom [i], f);    
        ret.steps [i] = Math.round(nrf1.steps [i] * Math.pow (nrf2.steps [i]/nrf1.steps [i], f));    
    }
    
    return ret;
}
NRFParameters.prototype.GetPolynomial = function ()
{
    var coeffs = [
        this.z0,  this.z1,  this.z2,  this.z3,  this.z4,
        this.z5,  this.z6,  this.z7,  this.z8,  this.z9,
    ];

    return Polynomial.FromValues (coeffs);
}

NRFParameters.prototype.DisplayText = function (ids, zidx)
{
    ids[0].innerHTML = this.z9;
    ids[1].innerHTML = this.z8;
    ids[2].innerHTML = this.z7;
    ids[3].innerHTML = this.z6;
    ids[4].innerHTML = this.z5;
    ids[5].innerHTML = this.z4;
    ids[6].innerHTML = this.z3;
    ids[7].innerHTML = this.z2;
    ids[8].innerHTML = this.z1;
    ids[9].innerHTML = this.z0;
    
    ids[10].innerHTML = this.alpha.toString ();
    ids[11].innerHTML = this.seed.toString ();
    ids[12].innerHTML = this.zoom [zidx];
    ids[13].innerHTML = this.steps [zidx];    
    ids[14].innerHTML = this.colour.toString ();
}

NRFParameters.prototype.ShowValues = function (ids, zidx)
{
    ids[0].value = this.z9;
    ids[1].value = this.z8;
    ids[2].value = this.z7;
    ids[3].value = this.z6;
    ids[4].value = this.z5;
    ids[5].value = this.z4;
    ids[6].value = this.z3;
    ids[7].value = this.z2;
    ids[8].value = this.z1;
    ids[9].value = this.z0;
    
    ids[10].value = this.alpha.toString ();
    ids[11].value = this.seed.toString ();
    ids[12].value = this.zoom [zidx];
    ids[13].value = this.steps [zidx];    
    ids[14].value = this.colour.toString ();
}

NRFParameters.prototype.GetValues = function (ids, zidx)
{
    this.z9 = parseFloat (ids[0].value);
    this.z8 = parseFloat (ids[1].value);
    this.z7 = parseFloat (ids[2].value);
    this.z6 = parseFloat (ids[3].value);
    this.z5 = parseFloat (ids[4].value);
    this.z4 = parseFloat (ids[5].value);
    this.z3 = parseFloat (ids[6].value);
    this.z2 = parseFloat (ids[7].value);
    this.z1 = parseFloat (ids[8].value);
    this.z0 = parseFloat (ids[9].value);
    
    this.alpha = Complex.FromString (ids[10].value);
    this.seed = Complex.FromString (ids[11].value);
    this.zoom [zidx] = parseFloat (ids[12].value);
    this.steps [zidx] = parseInt (ids[13].value);
    this.colour = Complex.FromString (ids[14].value);
}

NRFParameters.prototype.ShowPolyValues = function (ids)
{
    ids[0].value = this.z9;
    ids[1].value = this.z8;
    ids[2].value = this.z7;
    ids[3].value = this.z6;
    ids[4].value = this.z5;
    ids[5].value = this.z4;
    ids[6].value = this.z3;
    ids[7].value = this.z2;
    ids[8].value = this.z1;
    ids[9].value = this.z0;  
}

NRFParameters.prototype.GetPolyValues = function (ids)
{
    this.z9 = parseFloat (ids[0].value);
    this.z8 = parseFloat (ids[1].value);
    this.z7 = parseFloat (ids[2].value);
    this.z6 = parseFloat (ids[3].value);
    this.z5 = parseFloat (ids[4].value);
    this.z4 = parseFloat (ids[5].value);
    this.z3 = parseFloat (ids[6].value);
    this.z2 = parseFloat (ids[7].value);
    this.z1 = parseFloat (ids[8].value);
    this.z0 = parseFloat (ids[9].value);
}


NRFParameters.prototype.UpdateFromJson = function (text)
{
    try
    {
        var new_nrf = JSON.parse (text);
        this.Copy (new_nrf);
        return true;
    }
    catch (ex)
    {
        Misc.Alert (ex);
        return false;
    }
}

    




    

