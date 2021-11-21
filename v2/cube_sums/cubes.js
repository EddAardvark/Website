
CubeController = function ()
{
}
//----------------------------------------------------------------------------------------------------------------
CubeController.prototype.Initialise = function ()
{
    var x = BigCube.FromInt (1);
    var y = BigCube.FromInt (1);
    var z = BigCube.FromInt (1);
    
    this.walker = CubeWalker.FromCubes (x, y, z);
    
    // Cube root UI
    
    cr_target.value = "3";
	cr_a.value = "3";
	cr_b.value = "2";
	cr_it.value = "5";
    vec_x.value = "2";
    vec_y.value = "1";
    follow_depth.value = 10;
}
CubeController.prototype.CalculateCubeRoot = function()
{
    var target = new VLInt.FromString (cr_target.value);
    var a = new VLInt.FromString (cr_a.value);
    var b = new VLInt.FromString (cr_b.value);
    var count = parseInt (cr_it.value);
    
    var cr = new CubeRoot (target, a, b, count);
    
    cr.ToList (cube_roots);
}

//----------------------------------------------------------------------------------------------------------------
CubeController.prototype.Show = function ()
{
    this.walker.ToTable (location_table);
    this.walker.ToList (neighbour_list);
    
    current_location.innerHTML = this.walker.toString();
}
//----------------------------------------------------------------------------------------------------------------
CubeController.prototype.DecrementX = function ()
{
    this.walker.DecrementX ();
    this.Show ();
}
//----------------------------------------------------------------------------------------------------------------
CubeController.prototype.IncrementX = function ()
{
    this.walker.IncrementX ();
    this.Show ();
}
//----------------------------------------------------------------------------------------------------------------
CubeController.prototype.DecrementY = function ()
{
    this.walker.DecrementY ();
    this.Show ();
}
//----------------------------------------------------------------------------------------------------------------
CubeController.prototype.IncrementY = function ()
{
    this.walker.IncrementY ();
    this.Show ();
}
//----------------------------------------------------------------------------------------------------------------
CubeController.prototype.DecrementZ = function ()
{
    this.walker.DecrementZ ();
    this.Show ();
}
//----------------------------------------------------------------------------------------------------------------
CubeController.prototype.IncrementZ = function ()
{
    this.walker.IncrementZ ();
    this.Show ();
}
//----------------------------------------------------------------------------------------------------------------
CubeController.prototype.CalculateFollowVector = function (element_id)
{
    var x = new VLInt.FromString (vec_x.value);
    var y = new VLInt.FromString (vec_y.value);
    var depth = follow_depth.value;
    var xc = BigCube.FromInt (x);
    var yc = BigCube.FromInt (y);
    var z3 = xc.cube.Add(yc.cube);
    var zf = CubeRoot.ApproxRootOfVLInt (z3)
    var z = VLInt.FromFloat (zf);
    var zc = BigCube.FromInt (z);
    var walker = CubeWalker.FromCubes (xc, yc, zc);
    var text = Misc.Format  ("Start at {0}", walker);
    
    walker.ToFlatTable (location_table_2);
    
    for (var i = 0 ; i < depth ; ++i)
    {
        text += Misc.Format ("<br>I = {0}: {1}<br>{2}", i, walker, walker.GetFlatTableText ());

        var neighbour = walker.FindCross ();
        
        if (neighbour == null) break;
        
        text += Misc.Format ("<br>Neighbour = {0}: {1}<br>{2}", i, neighbour, neighbour.GetFlatTableText ());

        walker = CubeWalker.FromWeightings (walker, neighbour, 1, 2);
        
        text += Misc.Format ("<br>Midpoint = {0}: {1}<br>{2}", i, walker, walker.GetFlatTableText ());
        
        while (true)
        {
            var next_walker = walker.Walk ();
            if (next_walker == null)
            {
                break;
            }
            walker = next_walker;
            text += Misc.Format ("<br>Next = {0}: {1}<br>{2}", i, walker, walker.GetFlatTableText ());
            
        }
    }
    
    element_id.innerHTML = text;    
}
//----------------------------------------------------------------------------------------------------------------
CubeController.prototype.ExCalculateFollowVector = function (element_id)
{
    var x = new VLInt.FromString (vec_x.value);
    var y = new VLInt.FromString (vec_y.value);
    var depth = follow_depth.value;
    var xc = BigCube.FromInt (x);
    var yc = BigCube.FromInt (y);
    var z3 = xc.y.Add(yc.y);
    var zf = CubeRoot.ApproxRootOfVLInt (z3)
    var z = VLInt.FromFloat (zf);
    var zc = BigCube.FromInt (z);
    var walker = CubeWalker.FromCubes (xc, yc, zc);
    var text = Misc.Format  ("Start at {0}", walker);
    
    walker.ToFlatTable (location_table_2);
    
    for (var i = 0 ; i < depth ; ++i)
    {
        while (true)
        {
            text += Misc.Format ("Value = {0}, trying walk<br>", walker);
            var next_walker = walker.Walk ();
            
            if (! next_walker)
            {
                break;
            }
            walker = next_walker;                
            text += Misc.Format ("<br>Walk = {0}<br>{1}", walker, walker.GetFlatTableText ());
        }
        
        walker.Scale (VLInt.TWO);
    }
    
    element_id.innerHTML = text;    
}




