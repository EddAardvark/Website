//-------------------------------------------------------------------------------------------------
// A container of molecules
// (c) John Whitehouse 2020
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

Bath = function (num_x, num_y, s, mx, my)
{
    this.num_x = num_x;
    this.num_y = num_y;
    this.vectors = [[1,0],[0,1],[this.num_x-1,0],[0,this.num_y-1]];
    this.reset ();
    
    this.scale = s;
    this.x_margin = mx;
    this.y_margin = my;
    this.grid_size = this.scale * MoleculeTemplate.Size + 2;
    this.width = this.num_x * this.grid_size + 2 * this.x_margin;
    this.height = this.num_y * this.grid_size + 2 * this.y_margin;
}
Bath.MAX_TYPES = 5;
Bath.type_energy = [0,0,0,0,0];
Bath.edge_energy = [[0, null, 0],[null, null, 0],[0, 0, 0]] // straight = 0, out = 1, in = 2
//-------------------------------------------------------------------------------------------------
Bath.prototype.set_edge_energy = function (edge1, edge2, energy)
{
    if (edge1 == MoleculeTemplate.STRAIGHT && edge2 == MoleculeTemplate.STRAIGHT) throw "Can't set energy for flat-flat";
    if (edge1 == MoleculeTemplate.OUT && edge2 != MoleculeTemplate.IN) throw "Out must be matched with in";
    if (edge2 == MoleculeTemplate.OUT && edge1 != MoleculeTemplate.IN) throw "Out must be matched with in";
    
    Bath.edge_energy [edge1][edge2] = energy;
    Bath.edge_energy [edge2][edge1] = energy;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.reset = function (molecule, pts)
{
    var num = this.num_x * this.num_y;
    this.grid = new Array (num);    // Location of molecules
    this.molecules = [];                      // List of molecules
    
    for (var i = 0 ; i < num ; ++i)
    {
        this.grid [i] = null;
    }    
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.place_molecule = function (molecule, pts)
{
    var mapped_points = new Array (pts.length);
    
    for (var i in pts)
    {
       var x = this.grid_size * molecule.x + this.x_margin + this.scale * pts [i][0];
       var y = this.grid_size * molecule.y + this.y_margin + this.scale * pts [i][1];
       
       mapped_points [i] = [x,y];
    }
    
    return mapped_points;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.add_molecule = function (x, y, template)
{
    var pos = y * this.num_x + x;
    
    if (this.grid [pos] != null)
    {
        return false;
    }
    
    var mol = new Molecule (template, this);
    mol.place (x,y);
    this.grid [pos] = mol;
    this.molecules.push (mol);
    return true;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.replace_molecule = function (x, y, template)
{
    var pos = y * this.num_x + x;
    var prev_mol = this.grid [pos];
    var mol = new Molecule (template, this);

    mol.place (x,y);
    this.grid [pos] = mol;
    
    if (prev_mol != null)
    {
        var idx = this.molecules.indexOf (prev_mol);
        if (idx >= 0)
        {
            this.molecules [idx] = mol;
            return;
        }
    }
        
    this.molecules.push (mol);
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.random_molecule = function ()
{
    return (this.molecules.length == 0)
                ? null
                : this.molecules [Misc.RandomInteger (this.molecules.length)];
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.remove_molecule = function ()
{
    var mol = this.random_molecule ();
    if (mol != null)
    {
        var pos = mol.y * this.num_x + mol.x;
        this.grid [pos] = null;
        var idx = this.molecules.indexOf (mol);
        if (idx >= 0)
        {
            this.molecules.splice (idx,1);
        }
    }
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.rotate_molecule = function ()
{
    var mol = this.random_molecule ();
    if (mol != null)
    {
        mol.rotate (Misc.RandomBool() ? 1 : 3);
    }
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.flip_molecule = function ()
{
    var mol = this.random_molecule ();
    if (mol != null)
    {
        mol.flip ();
    }
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.move_molecule = function ()
{
    var mol = this.random_molecule ();
    
    if (mol != null)
    {
        var v = this.vectors [Misc.RandomInteger (4)];
        var x = (mol.x + v[0]) % this.num_x;
        var y = (mol.y + v[1]) % this.num_y;
        var pos = y * this.num_x + x;
        
        if (bath.grid [pos] == null)
        {
            var old_pos = mol.y * this.num_x + mol.x;
            bath.grid [pos] = mol;
            bath.grid [old_pos] = null;            
            mol.place (x, y);
        }
    }
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.draw = function (img_element)
{
    var chelp = new CanvasHelp (this.width, this.height);
    
    for (var i in this.molecules)
    {
        this.molecules[i].draw (chelp);
    }
    img_element.src = chelp.canvas.toDataURL('image/png');
}

        
