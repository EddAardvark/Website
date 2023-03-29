//-------------------------------------------------------------------------------------------------
// Makes a variety of lists based on a seed value (only accepts positive odd values)
// Works using VLUInts.
// (c) John Whitehouse 2023
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

ListMaker = function (b)
{
    this.full_sequence = [];
    this.odd_sequence = [];
    this.alist = [];
    this.odd_growth = [];
    this.growth_alist = [];
    this.growth_gv = [];
    
    if (VLUInt.Compare (b, ListMaker.ONE) < 0) return;
    
    while (b.Mod2 () == 0)
    {
        b = b.DivideInt (2);
    }
    
    this.b0 = b;
    this.MakeSequences ();
    this.MakeGVList ();
}

ListMaker.ONE = VLUInt.FromInt (1);


//---------------------------------------------- Make Sequences ------------------------------------------------------------

ListMaker.prototype.MakeSequences = function (b)
{
    var count = 0;
    var growing = true;
    var b = this.b0;
    
    this.full_sequence.push (b);
    this.odd_sequence.push (b);
    this.odd_growth.push (b);
    
    while (VLUInt.Compare (b, ListMaker.ONE) != 0)
    {
        if (b.Mod2 () == 1)
        {
            b = b.MultiplyInt (3);
            b.Increment();
            count = 0;
        }
        else
        {
            b = b.DivideInt (2);
            ++ count;
            if (b.Mod2 () == 1)
            {
                this.alist.push (count);
                this.odd_sequence.push (b);
                
                growing = growing && VLUInt.Compare (b, this.b0) > 0;
                
                if (growing)
                {
                    this.growth_alist.push (count);
                    this.odd_growth.push (b);
                }
            }
        }
        this.full_sequence.push (b);
    }
}

//---------------------------------------------- Make GV Lists ------------------------------------------------------------

ListMaker.prototype.MakeGVList = function ()
{
    var len = this.growth_alist.length;
    
    if (len == 0) return;
    
    var gv = VLGenericValue.MakeAtom (this.growth_alist [0]);
    
    this.growth_gv.push (gv);
    
    for (var idx = 1 ; idx < len ; ++idx)
    {
        gv = gv.Postfix (this.growth_alist [idx]);
        this.growth_gv.push (gv);
    }
}

ListMaker.prototype.GetGVListText = function ()
{
    var text = "";
    
    for (var idx = 0 ; idx < this.growth_gv.length ; ++idx)
    {
        if (idx != 0)
        {
            text += ",<br>";
        }
        var gv = this.growth_gv[idx];
        text += gv.toString ();
        var k = gv.GetKForValue (this.b0);
        
        if (k == null)
        {
            text += ",k=?" ;
        }
        else
        {
            var t = Misc.Format (",k={0},V={1}", k, this.b0);
            text += Misc.expand_expression(t);
        }
    }
    return text;
}

ListMaker.prototype.MinimalGVList = function ()
{
    var ret = [];
    
    for (var idx = 0 ; idx < this.growth_gv.length ; ++idx)
    {
        var gv = this.growth_gv[idx];        
        var k = gv.GetKForValue (this.b0);
        
        if (k == 0)
        {
            ret.push(gv);
        }
    }
    return ret;
}

ListMaker.prototype.MinimalGVListText = function ()
{
    var list = this.MinimalGVList ();
    var text = "";
    
    for (var idx in list)
    {
        var gv = list[idx];
        text += Misc.Format ("({0},{1}) ", gv.p2, gv.b);
    }
    return text;
}


// The first GV where k is 0, null if there isn't one
ListMaker.prototype.GetBaseGV = function ()
{
    var idx = this.GetBaseGVIndex ();
    
    return (idx > 0) ? this.growth_gv[idx] : null;
}

// The first GV where k is 0, null if there isn't one
ListMaker.prototype.GetBaseGVIndex = function ()
{
    for (var idx = 0 ; idx < this.growth_gv.length ; ++idx)
    {
        var gv = this.growth_gv[idx];
        var k = gv.GetKForValue (this.b0);
        
        if (k == 0) return idx;
    }
    return -1;
}
// The first GV where k is 0, null if there isn't one
ListMaker.prototype.GetBaseGV = function (index)
{
    var idx = this.GetBaseGVIndex ();
    
    if (idx >= 0)
    {
        index += idx;
        
        return (index < this.growth_gv.length) ? this.growth_gv [index] : null;
    }
}

ListMaker.prototype.GetFGVRow = function (include_repeats)
{
    this.gvlist = this.MinimalGVList ();
    var odd_growth = this.odd_growth.toString ().replaceAll (",", ", ");
    var growth_alist = this.growth_alist.toString ().replaceAll (",", ", ");
    
    if (this.gvlist.length == 0)
    {
        if (! include_repeats) return "";
        
        var gv = this.growth_gv[0];        
        var k = gv.GetKForValue (this.b0);
                
        return Misc.Format ("{0} | | {1} | {2}|({3},{4}), k={5}\n", this.b0, growth_alist, odd_growth, gv.p2, gv.b, k);
    }
    
    var gvtext = "";
    
    for (var idx in this.gvlist)
    {
        var gv = this.gvlist[idx];
        gvtext += Misc.Format ("({0},{1}) ", gv.p2, gv.b);
    }
    
    return Misc.Format ("{0} | {x}{1} | {2} | {3}|\n", this.b0, gvtext, growth_alist, odd_growth);
}
ListMaker.gv_table = "";
ListMaker.gv_list = {};
ListMaker.sorted_gv_list = {};
ListMaker.gv_table_depth = 0;
ListMaker.gv_list_depth = 0;

ListMaker.BuildGVTable = function (p)
{
    // 'p' is the power of 2 to search up to
    
    if (p <= ListMaker.gv_table_depth)
    {
        fgv_text.innerHTML = "";
        return;
    }
    
    if (ListMaker.gv_table_depth == 0)
    {
        ListMaker.gv_table = "{h}Value | {h} GV | {h} A&hyphen;List | {h} B&hyphen;List | {h} Comments\n";
        var n = 3;
    }
    else
    {
        var n =  Math.pow (2,ListMaker.gv_table_depth) + 3;
    }
        
    var limit = Math.pow (2,p);

    ListMaker.gv_table_depth = p;    
    ListMaker.gv_list_depth = Math.max (ListMaker.gv_list_depth, p);
        
    do
    {
        var b = VLUInt.FromInt (n);        
        var lm = new ListMaker (b);
        
        ListMaker.gv_table += lm.GetFGVRow (show_repeats.checked);
        
        ListMaker.AddToGVList (lm.gvlist);
        
        n += 4;
    }
    while (n < limit)
}
ListMaker.BuildGVList = function (p)
{
    // 'p' is the power of 2 to search up to
    
    if (p <= ListMaker.gv_list_depth)
    {
        return;
    }
    
    var n = (ListMaker.gv_list_depth == 0) ? 3 : Math.pow (2,ListMaker.gv_list_depth) + 3;
    var limit = Math.pow (2,p);

    ListMaker.gv_list_depth = p;
        
    do
    {
        var b = VLUInt.FromInt (n);        
        var lm = new ListMaker (b);
        
        ListMaker.AddToGVList (lm.MinimalGVList());
        
        n += 4;
    }
    while (n < limit)
}

ListMaker.AddToGVList = function (gvlist)
{
    for (var idx in gvlist)
    {
        var fgv = gvlist[idx];
        var key = fgv.p2 + "." + fgv.b.toString ();
        ListMaker.gv_list [key] = [fgv.p2, fgv.b];
    
        if (! ListMaker.sorted_gv_list.hasOwnProperty (fgv.p2))
        {
            ListMaker.sorted_gv_list [fgv.p2] = {};
        }
        ListMaker.sorted_gv_list [fgv.p2][key] = fgv.b;
    }
}

ListMaker.MakeSortedGVTable = function (limit)
{
    var text = "{h}Power |  {h} GVs| {h} B&hyphen;Values |{h} A&hyphen;Lists\n";
    
    for (var idx in ListMaker.sorted_gv_list)
    {
        var p2 = parseInt (idx);
        
        if (p2 > limit) continue;
        
        var row = ListMaker.sorted_gv_list [idx];
        var vals = Object.values (row);
        var valtext = vals.toString ().replaceAll (",", ", ");
        var t3 = "";
        var first = true;
        
        for (var vidx in vals)
        {
            var gv = VLGenericValue.FromVLUInts (0, p2, vals[vidx]);
            if (! first)
            {
                t3 += ", ";
            }
            first = false;
            t3 += "[" + gv.GetAList () + "]";
            
        }
        
        text += idx + "|" + vals.length+ "|" + valtext + "|" + t3 + "\n" ;
    }
    
    return text;
}


// Draw a collection of GVs, 2^n*k_b.
// Plost (n, b/2^n)   

ListMaker.DrawGVChart = function (img, list, limit1)
{
    var seen = {};
    var spots = [];
    var styles = new Graphics.GraphDef ();
    var p2 = BigPowers.GetPower (2,1);
    
    styles.background = "black";
    styles.fill_colours = ["green", "orange", "red"];
    styles.chart_type = Graphics.GraphDef.SPOTS;
    styles.spot_size = 2;
    styles.width = 800;
    styles.height = 800;
    
    for (var idx in list)
    {
        var row = ListMaker.sorted_gv_list [idx];
        var y = parseInt (idx);
        var vals = Object.values (row);
        
        p2 = (y <= limit1) ? BigPowers.GetPower (2,y) : BigPowers.GetPower (2,limit1);
        
        for (var vidx in vals)
        {
            var b = vals[vidx];
            var x = VLUInt.Ratio (b, p2);
            var c = 2;
            
            if (y <= limit1)
            {
                if (seen.hasOwnProperty (b))
                {
                    c = 1;
                }
                else
                {
                    c = 0;
                    seen [b] = true;
                }
            }
            
            styles.xmax = Math.max (styles.xmax, x);
            styles.ymax = Math.max (styles.ymax, y);
            spots.push ([x, y, c]);
        }
    }
    
    styles.chart_type = Graphics.GraphDef.SPOTS;
    Graphics.DrawGraph (spots, img, styles);   
}
    





