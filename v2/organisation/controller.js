SimController = function ()
{
}
//------------------------------------------------------------------------------------------------------------------
SimController.HidePopup = function ()
{
    SimController.popup.Hide();
}
//------------------------------------------------------------------------------------------------------------------
// This method relies on the owning web page having the necessary controls.
SimController.initialise = function ()
{
    document.addEventListener('keydown', SimController.OnKey);
    SimController.popup = new Popup("popup");
    SimController.timer = setInterval(SimController.DoAnimate, 200);
    SimController.colours = ["yellow", "green", "cyan", "magenta"];
    
    SVGColours.AddColours (colour1);
    SVGColours.AddColours (colour2);
    SVGColours.AddColours (colour3);
    SVGColours.AddColours (colour4);
    
    colour1.value = SimController.colours [0];
    colour2.value = SimController.colours [1];
    colour3.value = SimController.colours [2];
    colour4.value = SimController.colours [3];

    SimController.images = [shape1, shape2, shape3, shape4];
    SimController.energies = [energy1, energy2, energy3, energy4];         
    SimController.pair_shapes = [x1y1,x1y2,x1y3,x1y4,x2y2,x2y3,x2y4,x3y3,x3y4,x4y4];
    
    SimController.shape_choices =
    [
        [s0000, "yellow", [MoleculeTemplate.STRAIGHT, MoleculeTemplate.STRAIGHT, MoleculeTemplate.STRAIGHT, MoleculeTemplate.STRAIGHT]],
        [s0010, "orange", [MoleculeTemplate.STRAIGHT, MoleculeTemplate.STRAIGHT, MoleculeTemplate.OUT,      MoleculeTemplate.STRAIGHT]],
        [s0020, "orange", [MoleculeTemplate.STRAIGHT, MoleculeTemplate.STRAIGHT, MoleculeTemplate.IN,       MoleculeTemplate.STRAIGHT]],
        [s0011, "yellow", [MoleculeTemplate.STRAIGHT, MoleculeTemplate.STRAIGHT, MoleculeTemplate.OUT,      MoleculeTemplate.OUT]],
        [s1010, "yellow", [MoleculeTemplate.OUT,      MoleculeTemplate.STRAIGHT, MoleculeTemplate.OUT,      MoleculeTemplate.STRAIGHT]],
        [s0022, "yellow", [MoleculeTemplate.STRAIGHT, MoleculeTemplate.STRAIGHT, MoleculeTemplate.IN,       MoleculeTemplate.IN]],
        [s2020, "yellow", [MoleculeTemplate.IN,       MoleculeTemplate.STRAIGHT, MoleculeTemplate.IN,       MoleculeTemplate.STRAIGHT]],
        [s0021, "yellow", [MoleculeTemplate.STRAIGHT, MoleculeTemplate.STRAIGHT, MoleculeTemplate.IN,       MoleculeTemplate.OUT]],
        [s1020, "yellow", [MoleculeTemplate.OUT,      MoleculeTemplate.STRAIGHT, MoleculeTemplate.IN,       MoleculeTemplate.STRAIGHT]],
        [s0111, "orange", [MoleculeTemplate.STRAIGHT, MoleculeTemplate.OUT,      MoleculeTemplate.OUT,      MoleculeTemplate.OUT]],
        [s0112, "orange", [MoleculeTemplate.STRAIGHT, MoleculeTemplate.OUT,      MoleculeTemplate.OUT,      MoleculeTemplate.IN]],
        [s0121, "orange", [MoleculeTemplate.STRAIGHT, MoleculeTemplate.OUT,      MoleculeTemplate.IN,       MoleculeTemplate.OUT]],
        [s0122, "orange", [MoleculeTemplate.STRAIGHT, MoleculeTemplate.OUT,      MoleculeTemplate.IN,       MoleculeTemplate.IN]],
        [s0212, "orange", [MoleculeTemplate.STRAIGHT, MoleculeTemplate.IN,       MoleculeTemplate.OUT,      MoleculeTemplate.IN]],
        [s0222, "orange", [MoleculeTemplate.STRAIGHT, MoleculeTemplate.IN,       MoleculeTemplate.IN,       MoleculeTemplate.IN]],
        [s1111, "yellow", [MoleculeTemplate.OUT,      MoleculeTemplate.OUT,      MoleculeTemplate.OUT,      MoleculeTemplate.OUT]],
        [s1112, "yellow", [MoleculeTemplate.OUT,      MoleculeTemplate.OUT,      MoleculeTemplate.OUT,      MoleculeTemplate.IN]],
        [s1122, "yellow", [MoleculeTemplate.OUT,      MoleculeTemplate.OUT,      MoleculeTemplate.IN,       MoleculeTemplate.IN]],
        [s1212, "yellow", [MoleculeTemplate.OUT,      MoleculeTemplate.IN,       MoleculeTemplate.OUT,      MoleculeTemplate.IN]],
        [s1222, "yellow", [MoleculeTemplate.OUT,      MoleculeTemplate.IN,       MoleculeTemplate.IN,       MoleculeTemplate.IN]],
        [s2222, "yellow", [MoleculeTemplate.IN,       MoleculeTemplate.IN,       MoleculeTemplate.IN,       MoleculeTemplate.IN]],
    ];
    
    SimController.edge_templates =
    [
        [MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT],
        [MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT],
        [MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT],
        [MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT],
    ];
    
    SimController.templates = [];
    SimController.square_templates = [];
    
    for (var i = 0 ; i < 4 ; ++i)
    {
        SimController.templates [i] = MoleculeTemplate.CreateFromEdges (SimController.edge_templates[i]);
        SimController.templates [i].set_colour (SimController.colours [i]);
        SimController.templates [i].id = i;
        
        SimController.square_templates [i] = MoleculeTemplate.CreateFromEdges (SimController.edge_templates[i]);
        SimController.square_templates [i].set_colour (SimController.colours [i]);
    }
    
    SimController.bath = new Bath (4,4, 2, 0, 0);
    
    SimController.InitEnergies ();            
    SimController.ShowEnergies();
    
    SimController.DrawTemplates ();
    SimController.DrawPairs ();
    SimController.DrawEdgeInteractions ();
    SimController.DrawShapeSelection ();    

    SimController.tracked_energy = 0;    
    
    SimController.DrawSimulation ();
}
//------------------------------------------------------------------------------------------------------------------
SimController.ShowDelta = function (d)
{
    delta_energy.innerHTML = Misc.FloatToText (d, 6);
    SimController.tracked_energy += d;
    SimController.ShowTrackedEnergy (d);
}
//------------------------------------------------------------------------------------------------------------------
SimController.OnKey = function (event)
{
    var key = event.keyCode;

    if (SimController.popup.HandleKey (key))
    {
        event.preventDefault();
        return;
    }
}
//------------------------------------------------------------------------------------------------------------------
SimController.DoAnimate = function ()
{
}
//------------------------------------------------------------------------------------------------------------------
SimController.DrawTemplates = function ()
{
    for (var i = 0 ; i < 4 ; ++i)
    {
        SimController.DrawTemplate (i);
    }
}
//------------------------------------------------------------------------------------------------------------------
SimController.DrawTemplate = function (n)
{
    var b = new Bath (1, 1, 5, 12, 12);
    
    b.simple_add_molecule (0, 0, SimController.templates[n]);
    b.draw (SimController.images[n]);
}
//------------------------------------------------------------------------------------------------------------------    
SimController.DrawShapeSelection = function ()
{
    var b = new Bath (1, 1, 2, 4, 4);
    
    for (var i in SimController.shape_choices)
    {
        var template = MoleculeTemplate.CreateFromEdges (SimController.shape_choices[i][2]);
        template.set_colour (SimController.shape_choices[i][1]);
        b.simple_replace_molecule (0, 0, template);
        b.draw (SimController.shape_choices[i][0]);
    }
}
//------------------------------------------------------------------------------------------------------------------
SimController.DrawPairs = function ()
{
    var b2 = new Bath (2, 1, 2, 0, 0);
    var shape = 0;
    
    for (var i = 0 ; i < 4 ; ++i)
    {
        b2.simple_replace_molecule (0, 0, SimController.square_templates[i]);   

        for (var j = i ; j < 4 ; ++j)
        {     
            b2.simple_replace_molecule (1, 0, SimController.square_templates[j]);        
            b2.draw (SimController.pair_shapes[shape++]);
        }
    }
}
//------------------------------------------------------------------------------------------------------------------
SimController.DrawEdgeInteractions = function ()
{
    var spike_left =  MoleculeTemplate.CreateFromEdges ([MoleculeTemplate.OUT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT]);
    var spike_right =  MoleculeTemplate.CreateFromEdges ([MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.OUT,MoleculeTemplate.STRAIGHT]);
    var hole_left =  MoleculeTemplate.CreateFromEdges ([MoleculeTemplate.IN,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT]);
    var hole_right =  MoleculeTemplate.CreateFromEdges ([MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.IN,MoleculeTemplate.STRAIGHT]);
    var flat =  MoleculeTemplate.CreateFromEdges ([MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT]);
    var to_draw =
    [
        [edge_edge, flat, flat],
        [edge_hole, flat, hole_left],
        [edge_spike, flat, spike_left],
        [hole_hole, hole_right, hole_left],
        [hole_spike, hole_right, spike_left],
        [spike_spike, spike_right, spike_left],
    ];
    
    spike_left.set_colour ("orange");
    spike_right.set_colour ("orange");
    hole_left.set_colour ("crimson");
    hole_right.set_colour ("crimson");

    var b2 = new Bath (3, 1, 2, 0, 0);
            
    for (var i in to_draw)
    {
        var row = to_draw [i];
        
        b2.simple_replace_molecule (0, 0, row [1]);   
        b2.simple_replace_molecule (2, 0, row [2]);   
        b2.draw (row[0]);
    }
}
//------------------------------------------------------------------------------------------------------------------
SimController.ConfigShape = function (n)
{
    SimController.active_shape = n;
    moltype.innerHTML = (n+1);
    
    var element = document.getElementById("shapes");
    SimController.popup.Show (element.innerHTML, SimController.HidePopup);
}
//------------------------------------------------------------------------------------------------------------------
SimController.ChooseShape = function (n)
{
    SimController.popup.Hide ();
    SimController.edge_templates[SimController.active_shape] = SimController.shape_choices [n][2];
    SimController.templates [SimController.active_shape].update_edges (SimController.edge_templates[SimController.active_shape]);
    SimController.DrawTemplate(SimController.active_shape);
    
    SimController.ResetSimulation ();
    SimController.ResetTrackedEneryg ();
}
//------------------------------------------------------------------------------------------------------------------
SimController.ChangeColour = function(shape, id)
{
    SimController.colours [shape] = id.value;
    SimController.templates [shape].set_colour (SimController.colours [shape]);
    SimController.square_templates [shape].set_colour (SimController.colours [shape]);
    SimController.DrawPairs();
    SimController.DrawTemplate(shape);
    SimController.DrawSimulation ();        
}
//------------------------------------------------------------------------------------------------------------------
SimController.UpdateEnergy = function(idx)
{
    var energy = parseFloat (SimController.energies[idx].value);
    SimController.energies[idx].value = Misc.FloatToText (energy,6);
    SimController.bath.set_type_energy (idx, energy);
    SimController.ResetTrackedEneryg ();
}
//------------------------------------------------------------------------------------------------------------------
SimController.InitEnergies = function ()
{   
    try
    {
        SimController.bath.set_edge_energy (MoleculeTemplate.STRAIGHT, MoleculeTemplate.IN, 0.1);
        SimController.bath.set_edge_energy (MoleculeTemplate.IN, MoleculeTemplate.IN, 0.2);
        SimController.bath.set_edge_energy (MoleculeTemplate.IN, MoleculeTemplate.OUT, -0.5);

        SimController.bath.set_interaction_energy (0, 0, -0.2);
        SimController.bath.set_interaction_energy (0, 1, 0.2);
        SimController.bath.set_interaction_energy (0, 2, 0.3);
        SimController.bath.set_interaction_energy (0, 3, 0.2);
        SimController.bath.set_interaction_energy (1, 1, -0.3);
        SimController.bath.set_interaction_energy (1, 2, 0.1);
        SimController.bath.set_interaction_energy (1, 3, 0.1);
        SimController.bath.set_interaction_energy (2, 2, -0.4);
        SimController.bath.set_interaction_energy (2, 3, -0.2);
        SimController.bath.set_interaction_energy (3, 3, -0.5);

        SimController.bath.set_temperature (1.0);
    }
    catch (e)
    {
        Misc.Alert (e);
    }
}
//------------------------------------------------------------------------------------------------------------------
SimController.UpdateInteractions = function ()
{
    var e11 = parseFloat (energy1x1.value);
    var e12 = parseFloat (energy1x2.value);
    var e13 = parseFloat (energy1x3.value);
    var e14 = parseFloat (energy1x4.value);
    var e22 = parseFloat (energy2x2.value);
    var e23 = parseFloat (energy2x3.value);
    var e24 = parseFloat (energy2x4.value);
    var e33 = parseFloat (energy3x3.value);
    var e34 = parseFloat (energy3x4.value);
    var e44 = parseFloat (energy4x4.value);

    var eeh = parseFloat (energy_eh.value);
    var ehh = parseFloat (energy_hh.value);
    var ehs = parseFloat (energy_hs.value);

    var temp = parseFloat (temperature.value);                 
    
    try
    {
        SimController.bath.set_edge_energy (MoleculeTemplate.STRAIGHT, MoleculeTemplate.IN, eeh);
        SimController.bath.set_edge_energy (MoleculeTemplate.IN, MoleculeTemplate.IN, ehh);
        SimController.bath.set_edge_energy (MoleculeTemplate.IN, MoleculeTemplate.OUT, ehs);

        SimController.bath.set_interaction_energy (0, 0, e11);
        SimController.bath.set_interaction_energy (0, 1, e12);
        SimController.bath.set_interaction_energy (0, 2, e13);
        SimController.bath.set_interaction_energy (0, 3, e14);
        SimController.bath.set_interaction_energy (1, 1, e22);
        SimController.bath.set_interaction_energy (1, 2, e23);
        SimController.bath.set_interaction_energy (1, 3, e24);
        SimController.bath.set_interaction_energy (2, 2, e33);
        SimController.bath.set_interaction_energy (2, 3, e34);
        SimController.bath.set_interaction_energy (3, 3, e44);

        SimController.bath.set_temperature (temp);
        SimController.ResetTrackedEneryg ();
    }
    catch (e)
    {
        Misc.Alert (e);
    }
        
    SimController.ShowEnergies();
}
//------------------------------------------------------------------------------------------------------------------    
SimController.ShowEnergies = function ()
{    
    energy1x1.value = Misc.FloatToText (SimController.bath.interaction_energy[0][0],6);
    energy1x2.value = Misc.FloatToText (SimController.bath.interaction_energy[0][1],6);
    energy1x3.value = Misc.FloatToText (SimController.bath.interaction_energy[0][2],6);
    energy1x4.value = Misc.FloatToText (SimController.bath.interaction_energy[0][3],6);
    energy2x2.value = Misc.FloatToText (SimController.bath.interaction_energy[1][1],6);
    energy2x3.value = Misc.FloatToText (SimController.bath.interaction_energy[1][2],6);
    energy2x4.value = Misc.FloatToText (SimController.bath.interaction_energy[1][3],6);
    energy3x3.value = Misc.FloatToText (SimController.bath.interaction_energy[2][2],6);
    energy3x4.value = Misc.FloatToText (SimController.bath.interaction_energy[2][3],6);
    energy4x4.value = Misc.FloatToText (SimController.bath.interaction_energy[3][3],6);

    energy_eh.value = Misc.FloatToText (SimController.bath.edge_energy[MoleculeTemplate.STRAIGHT][MoleculeTemplate.IN],6);
    energy_hh.value = Misc.FloatToText (SimController.bath.edge_energy[MoleculeTemplate.IN][MoleculeTemplate.IN],6);
    energy_hs.value = Misc.FloatToText (SimController.bath.edge_energy[MoleculeTemplate.IN][MoleculeTemplate.OUT],6);
    
    temperature.value = Misc.FloatToText (SimController.bath.temperature, 6);
    
    for (var i = 0 ; i < 4 ; ++i)
    {
        SimController.energies[i].value = SimController.bath.type_energy [i];
    }
}
//------------------------------------------------------------------------------------------------------------------
SimController.DrawSimulation = function ()
{
    SimController.bath.draw (the_simulation);
}
//------------------------------------------------------------------------------------------------------------------
SimController.ResetTrackedEneryg = function ()
{
    SimController.tracked_energy = SimController.bath.get_total_energy ();
    SimController.ShowTrackedEnergy ();
}
//------------------------------------------------------------------------------------------------------------------
SimController.ShowTrackedEnergy = function ()
{
    calc_energy.innerHTML = Misc.FloatToText (SimController.tracked_energy, 6);
}
//------------------------------------------------------------------------------------------------------------------
SimController.ShowTotalEnergy = function ()
{
    total_energy.innerHTML = Misc.FloatToText (SimController.bath.get_total_energy (), 6);
}
//------------------------------------------------------------------------------------------------------------------
SimController.AddRandomMolecule = function ()
{
    SimController.AddMoleculeByType (Misc.RandomInteger (SimController.templates.length));
}
//------------------------------------------------------------------------------------------------------------------
SimController.AddMoleculeByType = function (type)
{
    var x = Misc.RandomInteger (SimController.bath.num_x);
    var y = Misc.RandomInteger (SimController.bath.num_y);
    var delta = SimController.bath.add_molecule (x, y, SimController.templates[type]);
    
    if (delta !== null)
    {
        SimController.DrawSimulation();
        SimController.ShowDelta (delta);
    }
}
//------------------------------------------------------------------------------------------------------------------
SimController.RotateRandomMolecule = function ()
{
    var delta = SimController.bath.rotate_molecule ();
    SimController.DrawSimulation();
    SimController.ShowDelta (delta);
}
//------------------------------------------------------------------------------------------------------------------
SimController.FlipRandomMolecule = function ()
{
    delta = SimController.bath.flip_molecule ();
    SimController.DrawSimulation();
    SimController.ShowDelta (delta);
}
//------------------------------------------------------------------------------------------------------------------
SimController.MoveRandomMolecule = function ()
{
    delta = SimController.bath.move_molecule ();
    SimController.DrawSimulation();
    SimController.ShowDelta (delta);
}
//------------------------------------------------------------------------------------------------------------------
SimController.RemoveRandomMolecule = function ()
{
    delta = SimController.bath.remove_molecule ();
    SimController.DrawSimulation();
    SimController.ShowDelta (delta);
}
//------------------------------------------------------------------------------------------------------------------
SimController.ResetSimulation = function ()
{
    SimController.bath.reset ();
    SimController.DrawSimulation();
    SimController.tracked_energy = 0;
    SimController.ShowDelta (0);
}
