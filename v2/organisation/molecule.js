//-------------------------------------------------------------------------------------------------
// A molecule. 
//
// This is an instance of the molcule template. All molecules from the same template will
// look the same, though they may be mirror images.
//
// (c) John Whitehouse 2020
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------
Molecule = function (template, container)
{
    this.template = template;
    this.container = container;
    this.orientation = 0;
    this.parity = false;
}
//------------------------------------------------------------------------------------------------------------
Molecule.prototype.place = function (x, y)
{
    this.x = x;
    this.y = y;
    this.set_points();
}
//------------------------------------------------------------------------------------------------------------
Molecule.prototype.rotate = function (n)
{
    this.orientation = (this.orientation + n) % 4;
    
    if (this.orientation < 0)
    {
        this.orientation += 4;
    }
    this.set_points();
}
//------------------------------------------------------------------------------------------------------------
Molecule.prototype.flip = function ()
{
    this.parity = ! this.parity;
    this.set_points();
}
//------------------------------------------------------------------------------------------------------------
Molecule.prototype.draw = function (chelp, img_element)
{
    chelp.SetBackground (this.template.colour);
    chelp.DrawPolygon (this.points);
}
//------------------------------------------------------------------------------------------------------------
Molecule.prototype.set_points = function ()
{
    var pts = this.template.get_points (this.parity, this.orientation);
    
    this.points = this.container.place_molecule (this, pts);
}






