OrgController = function ()
{
}
//------------------------------------------------------------------------------------------------------------------
OrgController.HidePopup = function ()
{
    OrgController.popup.Hide();
}
//------------------------------------------------------------------------------------------------------------------
// This method relies on the owning web page having the necessary controls.
OrgController.initialise = function ()
{
    document.addEventListener('keydown', OrgController.OnKey);
    OrgController.popup = new Popup("popup");
    OrgController.timer = setInterval(OrgController.DoAnimate, 200);
    OrgController.colours = ["yellow", "green", "cyan", "magenta"];
    
    SVGColours.AddColours (colour1);
    SVGColours.AddColours (colour2);
    SVGColours.AddColours (colour3);
    SVGColours.AddColours (colour4);
    
    colour1.value = OrgController.colours [0];
    colour2.value = OrgController.colours [1];
    colour3.value = OrgController.colours [2];
    colour4.value = OrgController.colours [3];

    OrgController.images = [shape1, shape2, shape3, shape4];
    OrgController.energies = [energy1, energy2, energy3, energy4];         
    OrgController.pair_shapes = [x1y1,x1y2,x1y3,x1y4,x2y2,x2y3,x2y4,x3y3,x3y4,x4y4];
    
    OrgController.shape_choices =
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
    
    OrgController.edge_templates =
    [
        [MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT],
        [MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT],
        [MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT],
        [MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT,MoleculeTemplate.STRAIGHT],
    ];
    
    OrgController.templates = [];
    OrgController.square_templates = [];
    
    for (var i = 0 ; i < 4 ; ++i)
    {
        OrgController.templates [i] = MoleculeTemplate.CreateFromEdges (OrgController.edge_templates[i]);
        OrgController.templates [i].set_colour (OrgController.colours [i]);
        OrgController.templates [i].id = i;
        
        OrgController.square_templates [i] = MoleculeTemplate.CreateFromEdges (OrgController.edge_templates[i]);
        OrgController.square_templates [i].set_colour (OrgController.colours [i]);
    }
    
    OrgController.bath = new Bath (4,4, 2, 0, 0);
    
    OrgController.InitEnergies ();            
    OrgController.ShowEnergies();
    
    OrgController.DrawTemplates ();
    OrgController.DrawPairs ();
    OrgController.DrawEdgeInteractions ();
    OrgController.DrawShapeSelection ();    

    OrgController.tracked_energy = 0;    
    
    OrgController.DrawSimulation ();
}
//------------------------------------------------------------------------------------------------------------------
OrgController.ShowDelta = function (d)
{
    delta_energy.innerHTML = Misc.FloatToText (d, 6);
    OrgController.tracked_energy += d;
    calc_energy.innerHTML = Misc.FloatToText (OrgController.tracked_energy, 6);
}
//------------------------------------------------------------------------------------------------------------------
OrgController.OnKey = function (event)
{
    var key = event.keyCode;

    if (OrgController.popup.HandleKey (key))
    {
        event.preventDefault();
        return;
    }
}
//------------------------------------------------------------------------------------------------------------------
OrgController.DoAnimate = function ()
{
}
//------------------------------------------------------------------------------------------------------------------
OrgController.DrawTemplates = function ()
{
    for (var i = 0 ; i < 4 ; ++i)
    {
        OrgController.DrawTemplate (i);
    }
}
//------------------------------------------------------------------------------------------------------------------
OrgController.DrawTemplate = function (n)
{
    var b = new Bath (1, 1, 5, 12, 12);
    
    b.simple_add_molecule (0, 0, OrgController.templates[n]);
    b.draw (OrgController.images[n]);
}
//------------------------------------------------------------------------------------------------------------------    
OrgController.DrawShapeSelection = function ()
{
    var b = new Bath (1, 1, 2, 4, 4);
    
    for (var i in OrgController.shape_choices)
    {
        var template = MoleculeTemplate.CreateFromEdges (OrgController.shape_choices[i][2]);
        template.set_colour (OrgController.shape_choices[i][1]);
        b.simple_replace_molecule (0, 0, template);
        b.draw (OrgController.shape_choices[i][0]);
    }
}
//------------------------------------------------------------------------------------------------------------------
OrgController.DrawPairs = function ()
{
    var b2 = new Bath (2, 1, 2, 0, 0);
    var shape = 0;
    
    for (var i = 0 ; i < 4 ; ++i)
    {
        b2.simple_replace_molecule (0, 0, OrgController.square_templates[i]);   

        for (var j = i ; j < 4 ; ++j)
        {     
            b2.simple_replace_molecule (1, 0, OrgController.square_templates[j]);        
            b2.draw (OrgController.pair_shapes[shape++]);
        }
    }
}
//------------------------------------------------------------------------------------------------------------------
OrgController.DrawEdgeInteractions = function ()
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
OrgController.ConfigShape = function (n)
{
    OrgController.active_shape = n;
    moltype.innerHTML = (n+1);
    
    var element = document.getElementById("shapes");
    OrgController.popup.Show (element.innerHTML, OrgController.HidePopup);
}
//------------------------------------------------------------------------------------------------------------------
OrgController.ChooseShape = function (n)
{
    OrgController.popup.Hide ();
    OrgController.edge_templates[OrgController.active_shape] = OrgController.shape_choices [n][2];
    OrgController.templates [OrgController.active_shape].update_edges (OrgController.edge_templates[OrgController.active_shape]);
    OrgController.DrawTemplate(OrgController.active_shape);
    
    OrgController.ResetSimulation ();   
}
//------------------------------------------------------------------------------------------------------------------
OrgController.ChangeColour = function(shape, id)
{
    OrgController.colours [shape] = id.value;
    OrgController.templates [shape].set_colour (OrgController.colours [shape]);
    OrgController.square_templates [shape].set_colour (OrgController.colours [shape]);
    OrgController.DrawPairs();
    OrgController.DrawTemplate(shape);
    OrgController.DrawSimulation ();        
}
//------------------------------------------------------------------------------------------------------------------
OrgController.UpdateEnergy = function(idx)
{
    var energy = parseFloat (OrgController.energies[idx].value);
    OrgController.energies[idx].value = Misc.FloatToText (energy,6);
    OrgController.bath.set_type_energy (idx, energy);
}
//------------------------------------------------------------------------------------------------------------------
OrgController.InitEnergies = function ()
{   
    try
    {
        OrgController.bath.set_edge_energy (MoleculeTemplate.STRAIGHT, MoleculeTemplate.IN, 0.1);
        OrgController.bath.set_edge_energy (MoleculeTemplate.IN, MoleculeTemplate.IN, 0.2);
        OrgController.bath.set_edge_energy (MoleculeTemplate.IN, MoleculeTemplate.OUT, -0.5);

        OrgController.bath.set_interaction_energy (0, 0, -0.2);
        OrgController.bath.set_interaction_energy (0, 1, 0.2);
        OrgController.bath.set_interaction_energy (0, 2, 0.3);
        OrgController.bath.set_interaction_energy (0, 3, 0.2);
        OrgController.bath.set_interaction_energy (1, 1, -0.3);
        OrgController.bath.set_interaction_energy (1, 2, 0.1);
        OrgController.bath.set_interaction_energy (1, 3, 0.1);
        OrgController.bath.set_interaction_energy (2, 2, -0.4);
        OrgController.bath.set_interaction_energy (2, 3, -0.2);
        OrgController.bath.set_interaction_energy (3, 3, -0.5);

        OrgController.bath.set_temperature (1.0);
    }
    catch (e)
    {
        Misc.Alert (e);
    }
}
//------------------------------------------------------------------------------------------------------------------
OrgController.UpdateInteractions = function ()
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
        OrgController.bath.set_edge_energy (MoleculeTemplate.STRAIGHT, MoleculeTemplate.IN, eeh);
        OrgController.bath.set_edge_energy (MoleculeTemplate.IN, MoleculeTemplate.IN, ehh);
        OrgController.bath.set_edge_energy (MoleculeTemplate.IN, MoleculeTemplate.OUT, ehs);

        OrgController.bath.set_interaction_energy (0, 0, e11);
        OrgController.bath.set_interaction_energy (0, 1, e12);
        OrgController.bath.set_interaction_energy (0, 2, e13);
        OrgController.bath.set_interaction_energy (0, 3, e14);
        OrgController.bath.set_interaction_energy (1, 1, e22);
        OrgController.bath.set_interaction_energy (1, 2, e23);
        OrgController.bath.set_interaction_energy (1, 3, e24);
        OrgController.bath.set_interaction_energy (2, 2, e33);
        OrgController.bath.set_interaction_energy (2, 3, e34);
        OrgController.bath.set_interaction_energy (3, 3, e44);

        OrgController.bath.set_temperature (temp);
    }
    catch (e)
    {
        Misc.Alert (e);
    }
        
    OrgController.ShowEnergies();
}
//------------------------------------------------------------------------------------------------------------------    
OrgController.ShowEnergies = function ()
{    
    energy1x1.value = Misc.FloatToText (OrgController.bath.interaction_energy[0][0],6);
    energy1x2.value = Misc.FloatToText (OrgController.bath.interaction_energy[0][1],6);
    energy1x3.value = Misc.FloatToText (OrgController.bath.interaction_energy[0][2],6);
    energy1x4.value = Misc.FloatToText (OrgController.bath.interaction_energy[0][3],6);
    energy2x2.value = Misc.FloatToText (OrgController.bath.interaction_energy[1][1],6);
    energy2x3.value = Misc.FloatToText (OrgController.bath.interaction_energy[1][2],6);
    energy2x4.value = Misc.FloatToText (OrgController.bath.interaction_energy[1][3],6);
    energy3x3.value = Misc.FloatToText (OrgController.bath.interaction_energy[2][2],6);
    energy3x4.value = Misc.FloatToText (OrgController.bath.interaction_energy[2][3],6);
    energy4x4.value = Misc.FloatToText (OrgController.bath.interaction_energy[3][3],6);

    energy_eh.value = Misc.FloatToText (OrgController.bath.edge_energy[MoleculeTemplate.STRAIGHT][MoleculeTemplate.IN],6);
    energy_hh.value = Misc.FloatToText (OrgController.bath.edge_energy[MoleculeTemplate.IN][MoleculeTemplate.IN],6);
    energy_hs.value = Misc.FloatToText (OrgController.bath.edge_energy[MoleculeTemplate.IN][MoleculeTemplate.OUT],6);
    
    temperature.value = Misc.FloatToText (OrgController.bath.temperature, 6);
    
    for (var i = 0 ; i < 4 ; ++i)
    {
        OrgController.energies[i].value = OrgController.bath.type_energy [i];
    }
}
//------------------------------------------------------------------------------------------------------------------
OrgController.DrawSimulation = function ()
{
    OrgController.bath.draw (the_simulation);
}
//------------------------------------------------------------------------------------------------------------------
OrgController.ShowTotalEnergy = function ()
{
    total_energy.innerHTML = Misc.FloatToText (OrgController.bath.get_total_energy (), 6);
}
//------------------------------------------------------------------------------------------------------------------
OrgController.AddRandomMolecule = function ()
{
    OrgController.AddMoleculeByType (Misc.RandomInteger (OrgController.templates.length));
}
//------------------------------------------------------------------------------------------------------------------
OrgController.AddMoleculeByType = function (type)
{
    var x = Misc.RandomInteger (OrgController.bath.num_x);
    var y = Misc.RandomInteger (OrgController.bath.num_y);
    var delta = OrgController.bath.add_molecule (x, y, OrgController.templates[type]);
    OrgController.DrawSimulation();
    OrgController.ShowDelta (delta);
}
//------------------------------------------------------------------------------------------------------------------
OrgController.RotateRandomMolecule = function ()
{
    var delta = OrgController.bath.rotate_molecule ();
    OrgController.DrawSimulation();
    OrgController.ShowDelta (delta);
}
//------------------------------------------------------------------------------------------------------------------
OrgController.FlipRandomMolecule = function ()
{
    delta = OrgController.bath.flip_molecule ();
    OrgController.DrawSimulation();
    OrgController.ShowDelta (delta);
}
//------------------------------------------------------------------------------------------------------------------
OrgController.MoveRandomMolecule = function ()
{
    delta = OrgController.bath.move_molecule ();
    OrgController.DrawSimulation();
    OrgController.ShowDelta (delta);
}
//------------------------------------------------------------------------------------------------------------------
OrgController.RemoveRandomMolecule = function ()
{
    delta = OrgController.bath.remove_molecule ();
    OrgController.DrawSimulation();
    OrgController.ShowDelta (delta);
}
//------------------------------------------------------------------------------------------------------------------
OrgController.ResetSimulation = function ()
{
    OrgController.bath.reset ();
    OrgController.DrawSimulation();
    OrgController.tracked_energy = 0;
    OrgController.ShowDelta (0);
}
