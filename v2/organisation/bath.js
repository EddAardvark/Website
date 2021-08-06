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
    
    this.edge_energy = [[0, null, 0],[null, null, -2],[0, -1, -0.5]]; // straight = 0, out = 1, in = 2
    this.interaction_energy = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
    this.temperature = 1;
    this.set_pressure (1);
    this.move_counters = new Bath.MoveCounters();
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
            
            this.down [pos] = yup * this.num_x + x;
            this.up [pos] = ydown * this.num_x + x;
            this.left [pos] = y * this.num_x + xleft;
            this.right [pos] = y * this.num_x + xright;
        }
    }
}
//-------------------------------------------------------------------------------------------------
Bath.MoveCounters = function ()
{
    this.tries = new Array (Bath.MoveCounters.MOVE_TYPES);
    this.accepted = new Array (Bath.MoveCounters.MOVE_TYPES);
    this.total_tries = new Array (Bath.MoveCounters.MOVE_TYPES);
    this.total_accepted = new Array (Bath.MoveCounters.MOVE_TYPES);
    
    this.reset (0);
}
//-------------------------------------------------------------------------------------------------
Bath.MoveCounters.Add = 0;
Bath.MoveCounters.Remove = 1;
Bath.MoveCounters.Exchange = 2;
Bath.MoveCounters.Rotate = 3;
Bath.MoveCounters.Move = 4;
Bath.MoveCounters.Flip = 5;
Bath.MoveCounters.MOVE_TYPES = 6;

Bath.MoveCounters.AVERAGER1 = 0.99999;
Bath.MoveCounters.AVERAGER2 = 1 - Bath.MoveCounters.AVERAGER1;

Bath.MoveCounters.NAMES = ["Add", "Remove", "Exchange", "Move", "Rotate", "Flip"];

Bath.MoveCounters.prototype.reset = function (e)
{
    for (var i = 0 ; i < Bath.MoveCounters.MOVE_TYPES ; ++i)
    {
        this.tries [i] = 0;
        this.accepted [i] = 0;
        this.total_tries [i] = 0;
        this.total_accepted [i] = 0;
    }
    this.tracked_energy = e;
    this.average_energy = e;
}
//-------------------------------------------------------------------------------------------------
Bath.MoveCounters.prototype.inc = function (type, delta, accepted)
{
    ++ this.tries [type];
    if (accepted)
    {
        ++ this.accepted [type];
        this.tracked_energy += delta;
    }
    
    this.average_energy = this.average_energy * Bath.MoveCounters.AVERAGER1 + this.tracked_energy * Bath.MoveCounters.AVERAGER2;
}
//-------------------------------------------------------------------------------------------------
Bath.MoveCounters.prototype.next_period = function ()
{
    for (var i = 0 ; i < Bath.MoveCounters.MOVE_TYPES ; ++i)
    {
        this.total_tries [i] += this.tries [i];
        this.total_accepted [i] += this.accepted [i];
        this.tries [i] = 0;
        this.accepted [i] = 0;
    }
}
//-------------------------------------------------------------------------------------------------
Bath.MoveCounters.prototype.table_row = function (type)
{
    var ret = "<tr>";
    
    ret += "<td>" + Bath.MoveCounters.NAMES[type] + "</td>";
    
    ret += "<td>" + this.tries [type] + "</td>";
    ret += "<td>" + this.accepted [type] + "</td>";
    ret += "<td>" + Misc.FloatToText (100 * this.accepted [type] / this.tries [type], 3) + "</td>";
    
    var total_t = this.tries [type] + this.total_tries [type];
    var total_a = this.accepted [type] + this.total_accepted [type];
    
    ret += "<td>" + total_t + "</td>";
    ret += "<td>" + total_a + "</td>";
    ret += "<td>" + Misc.FloatToText (100 * total_a / total_t, 3) + "</td>";

    ret += "</tr>";
    return ret;
}
//-------------------------------------------------------------------------------------------------
Bath.MoveCounters.prototype.total_row = function ()
{
    
    var tries = 0;
    var accepted = 0;
    var tot_tries = 0;
    var tot_accepted = 0;
        
    for (var i = 0 ; i < Bath.MoveCounters.MOVE_TYPES ; ++i)
    {
        tot_tries += this.total_tries [i];
        tot_accepted += this.total_accepted [i];
        tries += this.tries [i];
        accepted += this.accepted [i];
    }
    
    var ret = "<tr>";
    
    ret += "<td> Total </td>";
    
    ret += "<td>" + tries + "</td>";
    ret += "<td>" + accepted + "</td>";
    ret += "<td>" + Misc.FloatToText (100 * accepted / tries, 3) + "</td>";
    
    ret += "<td>" + tot_tries + "</td>";
    ret += "<td>" + tot_accepted + "</td>";
    ret += "<td>" + Misc.FloatToText (100 * tot_accepted / tot_tries, 3) + "</td>";

    ret += "</tr>";
    
    return ret;
}
//-------------------------------------------------------------------------------------------------
Bath.MoveCounters.prototype.heading_row = function ()
{
    var ret = "<tr>";
    
    ret += "<th> Action </th>";
    
    ret += "<th> Tries </th>";
    ret += "<th> Accepted </th>";
    ret += "<th> % </th>";

    ret += "<th> Total Tries </th>";
    ret += "<th> Total Accepted </th>";
    ret += "<th> Total % </th>";

    ret += "</tr>";
    return ret;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.try_moves = function (num)
{
    for (var i = 0 ; i < num ; ++i)
    {
        var n = Misc.RandomInteger (Bath.MoveCounters.MOVE_TYPES);
        var delta = null;
        
        if (n == Bath.MoveCounters.Add)
        {
            var type = Misc.RandomInteger (SimController.templates.length);

            delta = SimController.bath.add_molecule (SimController.templates[type]);
        }
        else if (n == Bath.MoveCounters.Rotate)
        {
            delta = SimController.bath.rotate_molecule ();
        }
        else if (n == Bath.MoveCounters.Move)
        {
            delta = SimController.bath.move_molecule ();
        }
        else if (n == Bath.MoveCounters.Flip)
        {
            delta = SimController.bath.flip_molecule ();
        }
        else if (n == Bath.MoveCounters.Remove)
        {
            delta = SimController.bath.remove_molecule ();
        }
        else if (n == Bath.MoveCounters.Exchange )
        {
            var type = Misc.RandomInteger (SimController.templates.length);

            delta = SimController.bath.exchange_molecule (SimController.templates[type]);
        }
        
        var accepted = delta !== null;
        
        this.move_counters.inc (n, delta, accepted);
    }
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.reset_stats = function ()
{
    this.move_counters.reset (this.get_total_energy ());
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.start_next_period = function ()
{
    this.move_counters.next_period ();
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.get_counter_display = function ()
{
    var ret = "<table>";
    
    ret += this.move_counters.heading_row();   
    
    for (var i = 0 ; i < Bath.MoveCounters.MOVE_TYPES ; ++i)
    {
        ret += this.move_counters.table_row (i);
    }
    ret += this.move_counters.total_row ();
    ret += "</table>";
    
    return ret;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.next_period = function ()
{
    for (var i = 0 ; i < Bath.MoveCounters.MOVE_TYPES ; ++i)
    {
        this.total_tries [i] += this.tries [i];
        this.total_accepted [i] += this.accepted [i];
        this.tries [i] = 0;
        this.accepted [i] = 0;
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
Bath.prototype.set_interaction_energy = function (id1, id2, energy)
{
    this.interaction_energy [id1][id2] = energy;
    this.interaction_energy [id2][id1] = energy;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.set_pressure = function (p)
{
    this.pressure  = p;
    this.pv  = p * this.num_cells;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.set_temperature = function (t)
{
    this.temperature = t;
}
//-------------------------------------------------------------------------------------------------
// Used for move type operations: exp (-de/T) > r
Bath.prototype.test_delta = function (de, ch)
{
    var prob = Math.exp (- de / this.temperature);

    return (prob >= 1) || (prob > Math.random ());
}
//-------------------------------------------------------------------------------------------------
// Used for add type operations: 1/(1 + (N+1) exp (de/T) / P) > r
Bath.prototype.test_create_delta = function (de)
{
    var prob = 1 / (1 + (this.molecules.length+1) * Math.exp (de / this.temperature) / this.pv);

    return (prob >= 1) || (prob > Math.random ());
}
//-------------------------------------------------------------------------------------------------
// Used for remove type operations: 1/(1 + P x exp (de/T) / N) > r
Bath.prototype.test_destroy_delta = function (de)
{
    var prob = 1 / (1 + this.pv * Math.exp (de / this.temperature) / this.molecules.length);

    return (prob >= 1) || (prob > Math.random ());
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.reset = function ()
{
    this.grid = new Array (this.num_cells);     // Location of molecules
    this.molecules = [];                        // List of molecules
    
    for (var i = 0 ; i < this.num_cells ; ++i)
    {
        this.grid [i] = null;
    }    
}
//-------------------------------------------------------------------------------------------------
Bath.CreateProbability = function (delta_E, PV, T, N)
{
    var x = 1 / (1 + (N+1) * Math.exp (delta_E / T) / PV);
    return Math.min (1,x);
}
//-------------------------------------------------------------------------------------------------
Bath.DestroyProbability = function (delta_E, PV, T, N)
{
    var x = 1 / (1 + PV * Math.exp (delta_E / T) / N);
    return Math.min (1,x);
}
//-------------------------------------------------------------------------------------------------
Bath.MoveProbability = function (delta_E, PV, T, N)
{
    var x = Math.exp (- delta_E / T);
    return Math.min (1,x);
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
// no checks on the addition
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
    var old_e = (prev_mol == null) ? 0 : this.get_molecule_energy (prev_mol, pos);
    var new_e = this.get_molecule_energy (new_mol, pos);
    
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
// This version looks at the energy implications and may reject the addition
Bath.prototype.add_molecule = function (template)
{
    var pos = Misc.RandomInteger (this.num_cells);
    
    if (this.grid [pos] != null)
    {
        return null;
    }
    
    var mol = new Molecule (template, this);    
    var delta_e = this.get_molecule_energy (mol, pos);
    
    if (delta_e === null)
    {
        return null;
    }
    
    if (! this.test_create_delta (delta_e))
    {
        return null;
    }
    this.place (mol, pos);
    this.grid [pos] = mol;
    this.molecules.push (mol);
    return delta_e;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.exchange_molecule = function (template)
{
    var pos = Misc.RandomInteger (this.num_cells);
    
    if (this.grid [pos] == null)
    {
        return null;
    }
    
    var old_mol = this.grid [pos];   
    var new_mol = new Molecule (template, this);   
    var old_e = this.get_molecule_energy (old_mol, pos);
    var new_e = this.get_molecule_energy (new_mol, pos);
    
    if (old_e === null || new_e === null)
    {
        return null;
    }
    
    var delta_e = new_e - old_e;
    
    if (! this.test_delta (delta_e, 'X'))
    {
        return null;
    }
    
    var idx = this.molecules.indexOf (old_mol);
    
    this.place (new_mol, pos);
    this.grid [pos] = new_mol;
    this.molecules [idx] = new_mol;
    
    return delta_e;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.remove_molecule = function ()
{
    var pos = Misc.RandomInteger (this.num_cells);
    var mol = this.grid [pos];
    
    if (mol == null)
    {
        return null;
    }

    this.grid [pos] = null;
    var delta_e = - this.get_molecule_energy (mol, pos);
    
    if (! this.test_destroy_delta (delta_e))
    {
        this.grid [pos] = mol;
        return null;
    }
    
    var idx = this.molecules.indexOf (mol);
    
    if (idx >= 0)
    {
        this.molecules.splice (idx,1);
    }
    
    return delta_e;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.rotate_molecule = function ()
{
    var mol = this.random_molecule ();
    
    if (mol == null)
    {
        return null;
    }
    
    var pos = mol.y * this.num_x + mol.x;
    var old_e = this.get_molecule_energy (mol, pos);
    mol.cache ();
    mol.rotate (Misc.RandomBool() ? 1 : 3);
    var new_e = this.get_molecule_energy (mol, pos);
    
    if (new_e == null)
    {
        mol.uncache ();
        return null;
    }
    
    var delta_e = new_e - old_e;
    
    if (! this.test_delta (delta_e, 'R'))
    {
        mol.uncache ();
        return null;
    }
    
    mol.set_points();
        
    return delta_e;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.flip_molecule = function ()
{
    var mol = this.random_molecule ();
    
    if (mol == null)
    {
        return null;
    }
    
    var pos = mol.y * this.num_x + mol.x;
    var old_e = this.get_molecule_energy (mol, pos);
    mol.cache ();
    mol.flip ();
    var new_e = this.get_molecule_energy (mol, pos);
    
    if (new_e == null)
    {
        mol.uncache ();
        return null;
    }
    
    var delta_e = new_e - old_e;
    
    if (! this.test_delta (delta_e, 'F'))
    {
        mol.uncache ();
        return null;
    }
    
    mol.set_points();
        
    return delta_e;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.move_molecule = function ()
{
    var mol = this.random_molecule ();
    
    if (mol == null)
    {
        return null;
    }

    var old_pos = mol.y * this.num_x + mol.x;
    var dir = Misc.RandomInteger (4);
    var new_pos = this.move_map [dir][old_pos];
        
    if (this.grid [new_pos] != null)
    {
        return null;
    }
    
    var old_e = this.get_molecule_energy (mol, old_pos);
    this.grid [new_pos] = mol;
    this.grid [old_pos] = null;   
    var new_e = this.get_molecule_energy (mol, new_pos);
    
    if (new_e === null)
    {
        this.grid [old_pos] = mol;
        this.grid [new_pos] = null;   
        return null;
    }
    
    var delta_e = new_e - old_e;
    
    if (! this.test_delta (delta_e, 'M'))
    {
        this.grid [old_pos] = mol;
        this.grid [new_pos] = null;  
        return null;
    }

    this.place (mol, new_pos);
        
    return delta_e;
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
Bath.prototype.get_neighbours = function (pos)
{
    var ret = [null, null, null, null];
    
    ret [MoleculeTemplate.TOP] = this.grid [this.up [pos]];
    ret [MoleculeTemplate.BOTTOM] = this.grid [this.down [pos]];
    ret [MoleculeTemplate.LEFT] = this.grid [this.left [pos]];
    ret [MoleculeTemplate.RIGHT] = this.grid [this.right [pos]];
    
    return ret;
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.get_total_energy = function (mol, neighbours)
{
    var interaction_energy = 0;
    
    for (var i in this.molecules)
    {
        var mol = this.molecules [i];
        var pos = mol.y * this.num_x + mol.x;
        var neighbours = this.get_neighbours (pos);
        
        var ie = this.get_interaction_energy (mol, neighbours);
        
        if (ie === null) throw "invalid configuration";
                    
        interaction_energy += ie;
    }    
    
    return interaction_energy / 2;    // Interactions are counted twice)
}
//-------------------------------------------------------------------------------------------------
Bath.prototype.get_molecule_energy = function (mol, pos)
{
    var neighbours = this.get_neighbours (pos);
    var interaction_energy = this.get_interaction_energy (mol, neighbours);
    
    if (interaction_energy === null) return null;
    
    return interaction_energy;   
}
//-------------------------------------------------------------------------------------------------
// returns null for invalid edge configurations
Bath.prototype.get_interaction_energy = function (mol, neighbours)
{        
    var energy = 0;
    var count = 0;
    var edge_energy = 0;
    
    // Eliminate invalid edge combinations 
    
    for (var i in neighbours)
    {
        if (neighbours [i] != null)
        {
            var dir = MoleculeTemplate.opposite_edge [i];
            var edge1 = mol.get_edge(i);
            var edge2 = neighbours [i].get_edge(dir);
            var allowed = MoleculeTemplate.allowed (edge1, edge2);
             
            if (! MoleculeTemplate.allowed (edge1, edge2))
            {
                return null;
            }

            edge_energy += this.edge_energy[edge1][edge2];                
            count ++;
        }
    }
    
    // Neighbour/neighbour interactions & point interactions
    
    for (var i in neighbours)
    {
        if (neighbours [i] != null)
        {
            energy += this.interaction_energy [mol.template.id][neighbours [i].template.id];
        }
    }
    return energy + edge_energy;
}

Bath.Acceptance = function (p)
{
    this.probability = p;
    this.tries = 0;
    this.success = 0;
}
Bath.Acceptance.CODE = {'C':"Create",'D':"Destroy",'M':"Move",'F':"Flip",'D':"Rotate"};

Bath.Acceptance.toTable = function (map)
{
    for (const key in map)
    {
        Misc.Log ("{0}", key);
    }
}
Bath.Acceptance.prototype.toRow = function (key)
{
    var name = Bath.Acceptance.CODE [key[0]];
    var energy = key.substring (1);
    return "<td>" + name + "</td><td>" + energy + "</td><td>" + this.tries + "</td><td>" + this.success + "</td><td>"
                    + Misc.FloatToText (this.success / this.tries * 100, 3);
}
Bath.Acceptance.prototype.toString = function ()
{
    return Misc.Format ("Prob = {0}, Tries = {1}, success = {2}", this.probability, this.tries, this.success);
}



        
