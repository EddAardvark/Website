
//-------------------------------------------------------------------------------------------------
// Molecule bath controller
// (c) John Whitehouse 2021
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

SimController = function ()
{
}

SimController.SHAPE_TYPES = 4;

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
    SimController.INTERVAL = 200;
    SimController.timer = setInterval(SimController.DoAnimate, SimController.INTERVAL);
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
    
    // UI elements to display shape densities
    
    SimController.densities = [density_1, density_2, density_3, density_4];
    SimController.avg_densities = [avg_density_1, avg_density_2, avg_density_3, avg_density_4];
    SimController.mode_names = ["Add", "Rotate", "Move", "Flip", "Remove"];        
    
    SimController.templates = [];
    SimController.square_templates = [];
    

    for (var i = 0 ; i < SimController.SHAPE_TYPES ; ++i)
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
    
    SimController.ResetStats ();
    SimController.DrawSimulation ();
    SimController.ShowCounts ();
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
    var persec = parseInt (simspeed.value);
    SimController.draw_every = persec * SimController.INTERVAL / 1000;
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
    SimController.bath.start_next_period ();
    SimController.bath.try_moves (SimController.draw_every);
    
    SimController.DrawSimulation();
    num_steps.innerHTML = Misc.FormatNumberReadable (SimController.bath.counters.iterations);
    
    ++ SimController.ticks;
    
    if (SimController.ticks % 10 == 0)
    {
        SimController.ShowCounts ();
        
        if (SimController.ticks % 1000 == 0)
        {
            SimController.bath.correct_drift ();
        }        
    }
}
//------------------------------------------------------------------------------------------------------------------
SimController.ShowCounts = function ()
{
    simulation_counts.innerHTML = SimController.bath.get_counter_display ();
    
    calc_energy.innerHTML = Misc.FloatToText (SimController.bath.counters.tracked_energy, 3);
    avg_energy.innerHTML = Misc.FloatToText (SimController.bath.counters.average_energy, 3);
    density.innerHTML = Misc.FloatToText (SimController.bath.get_density(), 3);
    avg_density.innerHTML = Misc.FloatToText (SimController.bath.get_average_density(), 3);
    
    for (var i = 0 ; i < SimController.SHAPE_TYPES ; ++i)
    {
        SimController.densities [i].innerHTML = Misc.FloatToText (SimController.bath.get_density(i), 3);
        SimController.avg_densities [i].innerHTML = Misc.FloatToText (SimController.bath.get_average_density(i), 3);
    }
}
//------------------------------------------------------------------------------------------------------------------
SimController.DrawTemplates = function ()
{
    for (var i = 0 ; i < SimController.SHAPE_TYPES ; ++i)
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
    
    for (var i = 0 ; i < SimController.SHAPE_TYPES ; ++i)
    {
        b2.simple_replace_molecule (0, 0, SimController.square_templates[i]);   

        for (var j = i ; j < SimController.SHAPE_TYPES ; ++j)
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
    SimController.ResetStats ();
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
        SimController.bath.set_edge_energy (MoleculeTemplate.STRAIGHT, MoleculeTemplate.IN, 0.5);
        SimController.bath.set_edge_energy (MoleculeTemplate.IN, MoleculeTemplate.IN, 1);
        SimController.bath.set_edge_energy (MoleculeTemplate.IN, MoleculeTemplate.OUT, -2);
        
        for (var i = 0 ; i < SimController.SHAPE_TYPES ; ++i)
        {
            for (var j = i ; j < SimController.SHAPE_TYPES ; ++j)
            {
                SimController.bath.set_interaction_energy (i, j, 0);
            }
        }

        SimController.bath.set_temperature (1.0);
        SimController.bath.set_pressure (1.0);
    }
    catch (e)
    {
        Misc.Alert (e);
    }
}
//------------------------------------------------------------------------------------------------------------------
SimController.UpdateInteractions = function ()
{
    // TODO: Use SimController.SHAPE_TYPES

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

        SimController.ResetStats ();
    }
    catch (e)
    {
        Misc.Alert (e);
    }
    SimController.ShowEnergies();
}

//------------------------------------------------------------------------------------------------------------------
SimController.UpdateAllInteractions = function ()
{   
    // TODO: Use SimController.SHAPE_TYPES
        
    var e = parseFloat (all_energy.value);
    
    energy1x1.value = e;
    energy2x2.value = e;
    energy3x3.value = e;
    energy4x4.value = e;
    
    energy1x2.value = e;
    energy1x3.value = e;
    energy1x4.value = e;
    energy2x3.value = e;
    energy2x4.value = e;
    energy3x4.value = e;
    
    SimController.UpdateInteractions ();
}
//------------------------------------------------------------------------------------------------------------------
SimController.UpdateSelfInteractions = function ()
{
    var e = parseFloat (all_energy.value);
    
    energy1x1.value = e;
    energy2x2.value = e;
    energy3x3.value = e;
    energy4x4.value = e;
    
    SimController.UpdateInteractions ();
}    
//------------------------------------------------------------------------------------------------------------------
SimController.UpdateMixedInteractions = function ()
{
    var e = parseFloat (all_energy.value);
    
    energy1x2.value = e;
    energy1x3.value = e;
    energy1x4.value = e;
    energy2x3.value = e;
    energy2x4.value = e;
    energy3x4.value = e;
    
    SimController.UpdateInteractions ();
}    
//------------------------------------------------------------------------------------------------------------------    
SimController.ShowEnergies = function ()
{
    // TODO: Use SimController.SHAPE_TYPES
 
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
SimController.ResetStats = function ()
{
    SimController.ticks = 0;
    SimController.bath.reset_stats ();
    SimController.ShowCounts ();
}
//------------------------------------------------------------------------------------------------------------------
SimController.ShowTotalEnergy = function ()
{
    total_energy.innerHTML = Misc.FloatToText (SimController.bath.get_total_energy (), 6);
}
//------------------------------------------------------------------------------------------------------------------
SimController.ResetSimulation = function ()
{
    SimController.bath.reset ();
    SimController.DrawSimulation();
}
