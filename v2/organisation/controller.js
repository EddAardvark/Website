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
SimController.initialise = function (w, h)
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
    SimController.pair_shapes = [x1y1,x1y2,x1y3,x1y4,x2y2,x2y3,x2y4,x3y3,x3y4,x4y4];
    SimController.ResetCounts ();
    SimController.draw_every = 100;
    SimController.sim_fun = null;

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
    
    SimController.mode_names = ["Add", "Rotate", "Move", "Flip", "Remove"];        
    
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
    
    SimController.bath = new Bath (w, h, 2, 6, 6);
    
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
SimController.ResetCounts = function ()
{
    SimController.tries = [0,0,0,0,0,0];
    SimController.accepted = [0,0,0,0,0,0];
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
    if (SimController.sim_fun) SimController.sim_fun ();
}
//------------------------------------------------------------------------------------------------------------------
SimController.StartSimulation = function ()
{
    SimController.draw_every = parseInt (simdraw.value);
    SimController.sim_fun = SimController.DoSimulation;
}
//------------------------------------------------------------------------------------------------------------------
SimController.StopSimulation = function ()
{
    SimController.sim_fun = null;
}
//------------------------------------------------------------------------------------------------------------------
SimController.DoSimulation = function ()
{
    for (var i = 0 ; i < SimController.draw_every ; ++i)
    {
        var n = Misc.RandomInteger (6);
        var delta = null;
        
        if (n == 0)
        {
            var type = Misc.RandomInteger (SimController.templates.length);

            delta = SimController.bath.add_molecule (SimController.templates[type]);
        }
        else if (n == 1)
        {
            delta = SimController.bath.rotate_molecule ();
        }
        else if (n == 2)
        {
            delta = SimController.bath.move_molecule ();
        }
        else if (n == 3)
        {
            delta = SimController.bath.flip_molecule ();
        }
        else if (n == 4)
        {
            delta = SimController.bath.remove_molecule ();
        }
        else if (n == 5)
        {
            var type = Misc.RandomInteger (SimController.templates.length);

            delta = SimController.bath.exchange_molecule (SimController.templates[type]);
        }
        
        ++ SimController.tries [n];
        
        if (delta !== null)
        {
            ++SimController.accepted [n];
            SimController.tracked_energy += delta;
            //Misc.Log ("Op = {0}, delta = {1}, total = {2}", SimController.mode_names [n], delta, SimController.tracked_energy);
        }
    }
    SimController.DrawSimulation();
    SimController.ShowTrackedEnergy ();
    SimController.ShowCounts ();
    SimController.ResetCounts ();
}
//------------------------------------------------------------------------------------------------------------------
SimController.ShowProbabilities = function (t_element, p_element, v_element, result)
{
    var T = parseFloat (t_element.value);
    var P = parseFloat (p_element.value);
    var V = parseFloat (v_element.value);
    SimController.ShowProbabilitiesFromValues (T, P, V, result);
}
//------------------------------------------------------------------------------------------------------------------
SimController.ShowProbabilitiesFromValues = function (T, P, V, result)
{
    var pv = P * V;
    var energies = [-2, -1, -0.5, -0.1, 0, 0.1, 0.5, 1.0, 2.0];
    
    var text = "<table><tr> <th>&Delta;E</th>  <th>Move</th>  <th>Create</th>  <th>Destroy</th> </tr>";
    
    for (var i in energies)
    {
        var de = energies [i];
        
        text += "<tr>";
        text += "<td>" + Misc.FloatToText (de, 6) + "</td>";
        text += "<td>" + Misc.FloatToText (Bath.MoveProbability (de, pv, T, 32), 6) + "</td>";
        text += "<td>" + Misc.FloatToText (Bath.CreateProbability (de, pv, T, 32), 6) + "</td>";
        text += "<td>" + Misc.FloatToText (Bath.DestroyProbability (de, pv, T, 32), 6) + "</td>";
        text += "</tr>";
    }
    text += "</table>";
    
    result.innerHTML = text;
}
//------------------------------------------------------------------------------------------------------------------
SimController.ShowCounts = function ()
{
    var text = "";
    for (var i = 0 ; i < SimController.tries.length ; ++i)
    {
        text += Misc.Format ("{0}: Tried = {1}, Accepted = {2}, Ratio = {3}<br>", 
                        SimController.mode_names [i],
                        SimController.tries [i],
                        SimController.accepted [i],
                        Misc.FloatToText (SimController.accepted [i] / SimController.tries [i], 3));
    }
    
    simulation_counts.innerHTML = text;
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
    SimController.ResetTrackedEnergy ();
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
    var pres = parseFloat (pressure.value);                 
    
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
        SimController.bath.set_pressure (pres);
        SimController.bath.reset_acceptance ();
        SimController.ResetTrackedEnergy ();
    }
    catch (e)
    {
        Misc.Alert (e);
    }
    SimController.ShowEnergies();
    SimController.ShowProbabilitiesFromValues (
                    SimController.bath.temperature,
                    SimController.bath.pressure,
                    SimController.bath.num_cells/2, tp_result);
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
    pressure.value = Misc.FloatToText (SimController.bath.pressure, 6);
}
//------------------------------------------------------------------------------------------------------------------
SimController.DrawSimulation = function ()
{
    SimController.bath.draw (the_simulation);
}
//------------------------------------------------------------------------------------------------------------------
SimController.ResetTrackedEnergy = function ()
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
    var delta = SimController.bath.add_molecule (SimController.templates[type]);
    
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
    
    if (delta !== null)
    {
        SimController.DrawSimulation();
        SimController.ShowDelta (delta);
    }
}
//------------------------------------------------------------------------------------------------------------------
SimController.FlipRandomMolecule = function ()
{
    delta = SimController.bath.flip_molecule ();
    
    if (delta !== null)
    {
        SimController.DrawSimulation();
        SimController.ShowDelta (delta);
    }
}
//------------------------------------------------------------------------------------------------------------------
SimController.MoveRandomMolecule = function ()
{
    delta = SimController.bath.move_molecule ();
    
    if (delta !== null)
    {
        SimController.DrawSimulation();
        SimController.ShowDelta (delta);
    }
}
//------------------------------------------------------------------------------------------------------------------
SimController.RemoveRandomMolecule = function ()
{
    delta = SimController.bath.remove_molecule ();
    
    if (delta !== null)
    {
        SimController.DrawSimulation();
        SimController.ShowDelta (delta);
    }
}
//------------------------------------------------------------------------------------------------------------------
SimController.ResetSimulation = function ()
{
    SimController.bath.reset ();
    SimController.DrawSimulation();
    SimController.tracked_energy = 0;
    SimController.ShowDelta (0);
}
