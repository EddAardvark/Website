//-------------------------------------------------------------------------------------------------
// A molecule. 
//
// This is an instance of the molcule template. All molecules from the same template will
// look the same, though they may be mirror images.
//
// (c) John Whitehouse 2021
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------
Molecule = function (template, container)
{
    this.template = template;
    this.container = container;
    this.orientation = 0;
    this.parity = false;
    this.x = 0;
    this.y = 0;
    this.cache ();
}
//------------------------------------------------------------------------------------------------------------
Molecule.prototype.rotate = function (n)
{
    this.orientation = (this.orientation + n) % 4;
    
    if (this.orientation < 0)
    {
        this.orientation += 4;
    }
}
//------------------------------------------------------------------------------------------------------------
Molecule.prototype.flip = function ()
{
    this.parity = ! this.parity;
}
//------------------------------------------------------------------------------------------------------------
Molecule.prototype.draw = function (chelp, img_element)
{
    chelp.SetBackground (this.template.colour);
    chelp.DrawPolygon (this.points);
}
//------------------------------------------------------------------------------------------------------------
Molecule.prototype.cache = function ()
{
    this.cache_orientation = this.orientation;
    this.cache_parity = this.parity;
}
//------------------------------------------------------------------------------------------------------------
Molecule.prototype.uncache = function ()
{
    this.orientation = this.cache_orientation;
    this.parity = this.cache_parity;
}
//------------------------------------------------------------------------------------------------------------
Molecule.prototype.set_points = function ()
{
    var pts = this.template.get_points (this.parity, this.orientation);
    
    this.points = this.container.place_molecule (this, pts);
}
//------------------------------------------------------------------------------------------------------------
Molecule.prototype.get_edge = function (idx)
{
    return this.template.get_edge (idx, this.parity, this.orientation);
}

//------------------------------------------------------------------------------------------------------------
Molecule.prototype.toString = function ()
{
    return Misc.Format ("{0} at ({1},{2})", this.template.colour, this.x, this.y);
}







