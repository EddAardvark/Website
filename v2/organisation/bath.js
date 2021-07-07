//-------------------------------------------------------------------------------------------------
// A container of molecules
// (c) John Whitehouse 2020
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

Bath = function (num_x, num_y, s, mx, my)
{
    this.num_x = num_x;
    this.num_y = num_y;    
    this.num_cells = this.num_x * this.num_y;
    this.reset ();
    
    this.scale = s;
    this.x_margin = mx;
    this.y_margin = my;
    this.grid_size = this.scale * MoleculeTemplate.Size + 2;
    this.width = this.num_x * this.grid_size + 2 * this.x_margin;
    this.height = this.num_y * this.grid_size + 2 * this.y_margin;
    
    this.type_energy = [0.5,0.25,-0.5,-1];
    this.edge_energy = [[0, null, 0],[null, null, -2],[0, -1, -0.5]]; // straight = 0, out = 1, in = 2
    this.interaction_energy = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
    this.temperature = 1;
    
    // Adjacent cells
    
    this.up = new Array (this.num_cells);
    this.down = new Array (this.num_cells);
    this.left = new Array (this.num_cells);
    this.right = new Array (this.num_cells);
    this.move_map = [this.up, this.right, this.down, this.right];
    
    for (var x = 0 ; x < this.num_x ; ++x)
    {
        var xleft = (x + this.num_x - 1) % this.num_x;
        var xright = (x + 1) % this.num_x;
        
        for (var y = 0 ; y < this.num_y ; ++y)
        {
            var yup = (y + 1) % this.num_y;
            var ydown = (y + this.num_y - 1) % this.num_y;
            var pos = y * this.num_x + x;
            
            this.up [pos] = yup * this.num_x + x;
            this.down [pos] = ydown * this.num_x + x;
            this.left [pos] = y * this.num_x + xleft;
            this.right [pos] = y * this.num_x + xright;
        }
    }
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.set_edge_energy = function (edge1, edge2, energy)
{
    if (edge1 == MoleculeTemplate.STRAIGHT && edge2 == MoleculeTemplate.STRAIGHT) throw "Can't set energy for flat-flat";
    if (edge1 == MoleculeTemplate.OUT && edge2 != MoleculeTemplate.IN) throw "Out must be matched with in";
    if (edge2 == MoleculeTemplate.OUT && edge1 != MoleculeTemplate.IN) throw "Out must be matched with in";
    
    this.edge_energy [edge1][edge2] = energy;
    this.edge_energy [edge2][edge1] = energy;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.set_type_energy = function (id, energy)
{
    this.type_energy [id] = energy;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.set_interaction_energy = function (id1, id2, energy)
{
    this.interaction_energy [id1][id2] = energy;
    this.interaction_energy [id2][id1] = energy;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.set_temperature = function (energy)
{
    this.temperature = energy;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.reset = function (molecule, pts)
{
    this.grid = new Array (this.num_cells);        // Location of molecules
    this.molecules = [];                // List of molecules
    
    for (var i = 0 ; i < this.num_cells ; ++i)
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
       var y = this.grid_size * (this.num_y - molecule.y - 1) + this.y_margin + this.scale * pts [i][1];
       
       mapped_points [i] = [x,y];
    }
    
    return mapped_points;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.add_molecule = function (x, y, template)
{
    Misc.Log ("Add");
    var mol = this.simple_add_molecule(x, y, template);
    
    return (mol == null) ? 0 : this.get_molecule_energy (mol);
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.simple_add_molecule = function (x, y, template)
{
    var pos = y * this.num_x + x;
    
    if (this.grid [pos] != null)
    {
        return null;
    }
    
    var mol = new Molecule (template, this);
    this.place (mol, pos);
    this.grid [pos] = mol;
    this.molecules.push (mol);
    return mol;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.replace_molecule = function (x, y, template)
{    
    var pos = y * this.num_x + x;
    var new_mol = new Molecule (template, this);
    var prev_mol = this.grid [pos];

    return this.replace_at (pos, prev_mol, new_mol);
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.simple_replace_molecule = function (x, y, template)
{    
    var pos = y * this.num_x + x;
    var new_mol = new Molecule (template, this);
    var prev_mol = this.grid [pos];

    return this.simple_replace_at (pos, prev_mol, new_mol);
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.replace_at = function (pos, prev_mol, new_mol)
{
    var old_e = (prev_mol == null) ? 0 : this.get_molecule_energy (prev_mol);
    var new_e = this.get_molecule_energy (new_mol);
    
    this.simple_replace_at (pos, prev_mol, new_mol);
    
    return new_e - old_e;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.simple_replace_at = function (pos, prev_mol, new_mol)
{
    this.place (new_mol, pos);
    this.grid [pos] = new_mol;
    
    if (prev_mol != null)
    {
        var idx = this.molecules.indexOf (prev_mol);
        if (idx >= 0)
        {
            this.molecules [idx] = new_mol;
            return;
        }
    }
        
    this.molecules.push (new_mol);
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
    Misc.Log ("Remove");
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
        return - this.get_molecule_energy (mol);
    }
    return 0;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.rotate_molecule = function ()
{
    Misc.Log ("Rotate");
    var mol = this.random_molecule ();
    if (mol != null)
    {
        var old_e = this.get_molecule_energy (mol);
        mol.cache ();
        mol.rotate (Misc.RandomBool() ? 1 : 3);
        var new_e = this.get_molecule_energy (mol);
        return new_e - old_e;
    }
    return 0;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.flip_molecule = function ()
{
    Misc.Log ("Flip");
    var mol = this.random_molecule ();
    if (mol != null)
    {
        var old_e = this.get_molecule_energy (mol);
        mol.cache ();
        mol.flip ();
        var new_e = this.get_molecule_energy (mol);
        return new_e - old_e;
    }
    return 0;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.move_molecule = function ()
{
    Misc.Log ("Move");
    var dir = Misc.RandomInteger (4);
    var mol = this.random_molecule ();
    var old_e = this.get_molecule_energy (mol);
    
    if (mol != null)
    {
        var old_pos = mol.y * this.num_x + mol.x;
        var new_pos = this.move_map [dir][old_pos];
        
        if (this.grid [new_pos] == null)
        {
            this.grid [new_pos] = mol;
            this.grid [old_pos] = null;            
            this.place (mol, new_pos);
            var new_e = this.get_molecule_energy (mol);
            return new_e - old_e;
        }
    }
    return 0;
}
//------------------------------------------------------------------------------------------------------------
Bath.prototype.place = function (mol, pos)
{
    mol.x = pos % this.num_x;
    mol.y = Math.floor (pos / this.num_x);

    var pts = mol.template.get_points (mol.parity, mol.orientation);
    
    mol.points = this.place_molecule (mol, pts);
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
//-------------------------------------------------------------------------------------------------
Bath.prototype.get_neighbours = function (mol)
{
    var ret = [null, null, null, null];    
    var pos = mol.y * this.num_x + mol.x;
    
    ret [MoleculeTemplate.TOP] = this.grid [this.up [pos]];
    ret [MoleculeTemplate.BOTTOM] = this.grid [this.down [pos]];
    ret [MoleculeTemplate.LEFT] = this.grid [this.left [pos]];
    ret [MoleculeTemplate.RIGHT] = this.grid [this.right [pos]];
    
    return ret;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.get_total_energy = function (mol, neighbours)
{
    var inate_energy = 0;
    var interaction_energy = 0;
    
    for (var i in this.molecules)
    {
        var mol = this.molecules [i];
        var neighbours = this.get_neighbours (mol);
        
        inate_energy += this.get_inate_energy (mol);
        interaction_energy += this.get_interaction_energy (mol, neighbours);
    }    
    
    return inate_energy + interaction_energy / 2;    
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.get_molecule_energy = function (mol)
{
    var inate_energy = this.get_inate_energy (mol);
    var interaction_energy = 0;    
    var neighbours = this.get_neighbours (mol);
    var interaction_energy = this.get_interaction_energy (mol, neighbours);
    
    return inate_energy + interaction_energy;   
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.get_inate_energy = function (mol)
{
    return this.type_energy [mol.template.id];    
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.get_interaction_energy = function (mol, neighbours)
{
        
    Misc.Log ("Mol = {0}", mol);
    var energy = 0;
    var count = 0;
    for (var i in neighbours)
    {
        if (neighbours [i] != null)
        {
            count ++;
        }
    }
        
    Misc.Log ("Neighbours = {0}", count);
    
    // Neighbour/neighbour interactions & point interactions
    
    for (var i in neighbours)
    {
        if (neighbours [i] != null)
        {
            energy += this.interaction_energy [mol.template.id][neighbours [i].template.id];
            var dir = MoleculeTemplate.opposite_edge [i];
            var edge1 = mol.get_edge(i);
            var edge2 = neighbours [i].get_edge(dir);
            Misc.Log ("Sides = {0} and {1}, edges = {2} and {3}", MoleculeTemplate.GetFaceName(i), MoleculeTemplate.GetFaceName(dir),
            MoleculeTemplate.GetEdgeName(edge1), MoleculeTemplate.GetEdgeName(edge2));
        }
    }
    return energy;
}
        
