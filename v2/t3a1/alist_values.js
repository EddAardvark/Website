//-------------------------------------------------------------------------------------------------
// Functions for drawing value charts
// required graphics.js
// (c) John Whitehouse 2019
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

AListValues = function () {}


AListValues.Draw_K = 0;
AListValues.Draw_Smin = 1;
AListValues.Draw_Smax = 2;
AListValues.Draw_MaxSeed = 3;

AListValues.Scale_1 = 0;
AListValues.Scale_Reciprocal = 1;
AListValues.Scale_Log = 2;
AListValues.Scale_K = 3;
AListValues.Scale_Smin = 4;
AListValues.Scale_Smax = 5;
AListValues.Scale_2m = 6;
AListValues.Scale_3n = 7;

AListValues.data = {};
AListValues.big_data = {};
AListValues.vmode_text =
[
    "K",
    "Smin",
    "Smax",
    "MaxSeed",
];


AListValues.smode_text =
[
    "Raw",
    "Reciprocal",
    "Log",
    "Divided by K",
    "Divided by Smin",
    "Divided by Smax",
    "Divided by 2^m",
    "Divided by 3^n",
];

AListValues.get_value = [];

AListValues.get_value[AListValues.Draw_K] =  function (d) { return d.k; }
AListValues.get_value[AListValues.Draw_Smin] =  function (d) { return d.smin; }
AListValues.get_value[AListValues.Draw_Smax] =  function (d) { return d.smax; }
AListValues.get_value[AListValues.Draw_MaxSeed] =  function (d) { return d.maxseed; }

AListValues.scale_value = [];

AListValues.scale_value[AListValues.Scale_1] =  function (x,d) { return x; }
AListValues.scale_value[AListValues.Scale_Reciprocal] =  function (x,d) { return 1/x; }
AListValues.scale_value[AListValues.Scale_Log]  =  function (x,d) { return Math.log (x); }
AListValues.scale_value[AListValues.Scale_K]    =  function (x,d) { return x / d.k; }
AListValues.scale_value[AListValues.Scale_Smin] =  function (x,d) { return x / d.smin; }
AListValues.scale_value[AListValues.Scale_Smax] =  function (x,d) { return x / d.smax; }
AListValues.scale_value[AListValues.Scale_2m]   =  function (x,d) { return x / AList.pow2[d.m]; }
AListValues.scale_value[AListValues.Scale_3n]   =  function (x,d) { return x / AList.pow3[d.n]; }


AListValues.scale_big_value = [];

AListValues.scale_big_value[AListValues.Scale_1] =  function (x,d) { return x.ToFloat (); }
AListValues.scale_big_value[AListValues.Scale_Reciprocal] =  function (x,d) { return x.Reciprocal(); }
AListValues.scale_big_value[AListValues.Scale_Log]  =  function (x,d) { return x.Log10 (); }
AListValues.scale_big_value[AListValues.Scale_K]    =  function (x,d) { return x.Divide (d.k).ToFloat (); }
AListValues.scale_big_value[AListValues.Scale_Smin] =  function (x,d) { return x.Divide (d.smin).ToFloat (); }
AListValues.scale_big_value[AListValues.Scale_Smax] =  function (x,d) { return x.Divide (d.smax).ToFloat (); }
AListValues.scale_big_value[AListValues.Scale_2m]   =  function (x,d) { return x.Divide (AList.pow2[d.m]).ToFloat (); }
AListValues.scale_big_value[AListValues.Scale_3n]   =  function (x,d) { return x.Divide (AList.pow3[d.n]).ToFloat (); }


AListValues.GetData = function (m, n)
{
    for (var idx in AListValues.data)
    {
        if (AListValues.data [idx][0] == m && AListValues.data [idx][1] == n)
        {
            return AListValues.data [idx];
        }
    }
    return null;
}

// Same as GetData but uses VLUInts, calculated on demand

AListValues.GetData = function (m, n)
{
    var key = "m" + m + "n" + n;
    
    if (AListValues.big_data.hasOwnProperty (key))
    {
        return AListValues.big_data [key];
    }
    
    
    var k = AList.pow2[m] - AList.pow3 [n];
    
    if (k <= 0) return;
    
    var a1 = AList.MakeBalancedList (m, n);
    var a2 = AList.MakeMaxValueList (m, n);
    var a3 = AList.MakeMinValueList (m, n);
    
    var ret = {};
            
    ret.k = k;
    ret.n = n;
    ret.m = m;
    ret.maxseed = a1.Value ();
    ret.smax = a2.Value ();
    ret.smin = a3.Value ();    
    
    AListValues.data [key] = ret;
    return ret;
}

// Same as GetData but uses VLUInts, calculated on demand

AListValues.GetBigData = function (m, n)
{
    var key = "m" + m + "n" + n;
    
    if (AListValues.big_data.hasOwnProperty (key))
    {
        return AListValues.big_data [key];
    }
    
    var p2 = AList.GetBigPow2 (m);
    var p3 = AList.GetBigPow3 (n);
    
    if (VLUInt.Compare (p2, p3) <= 0) return;
    
    var a1 = AList.MakeBalancedList (m, n);
    var a2 = AList.MakeMaxValueList (m, n);
    var a3 = AList.MakeMinValueList (m, n);
    
    var ret = {};
            
    ret.k = p2.Subtract (p3);
    ret.n = n;
    ret.m = m;
    ret.maxseed = a1.BigValue ();
    ret.smax = a2.BigValue ();
    ret.smin = a3.BigValue ();
            
    AListValues.big_data [key] = ret;
    return ret;
}
        
AListValues.Draw = function (mode, scale, img, text)
{
    var points = [];
    var vfun = AListValues.get_value [mode];
    var sfun = AListValues.scale_value [scale];
    
    for (var n = 1 ; n < AList.max_n ; ++n)
    {
        var limit = Math.min (AList.max_m, 2 * n);
        
        for (var m = AList.GetM0 (n) ; m <= limit ; ++m)
        {
            var d = AListValues.GetData (m, n);
            var v = vfun.call(null, d);
            var s = sfun.call(null, v, d);
        
            points.push ([d.m, d.n, s]);
        }
    }

    var def = new Graphics.ValueGridDef ();
    
    def.cell_x = 12;
    def.cell_y = 12;
    
    Graphics.DrawValueGrid (def, points, img);
    
    var str1 = Misc.FloatToText (def.z_min, 3);
    var str2 = Misc.FloatToText (def.z_max, 3);
    
    text.innerHTML = Misc.Format ("Showing {0} ({1}), range: {2} to {3}", AListValues.vmode_text[mode], AListValues.smode_text[scale], str1, str2);
}


AListValues.DrawBigGraph = function (vmode, smode, moff, n_max, graph_element, caption_element)
{
    var data = [];
    var vfun = AListValues.get_value [vmode];
    var sfun = AListValues.scale_big_value [smode];
    
    for (var n = 2 ; n <= n_max ; ++n)
    {
        var m = AList.GetM0 (n) + moff;
        var d = AListValues.GetBigData (m, n);
        var z = vfun (d);
        
        z = sfun (z, d);

        data [n-2] = z;
        
        if (n == 2)
        {
            var zmin = z;
            var zmax = z;
        }
        else if (z < zmin)
        {
            zmin = z;
        }
        else if (z > zmax)
        {
            zmax = z;
        }
    }

    var styles = new Graphics.GraphDef ();

    styles.width = 800;
    styles.height = 600;
    
    var values = [];
    
    for (var i = 0 ; i < data.length ; ++i)
    {
        values [i] = data[i] / zmax;
    }
    Graphics.DrawGraph (values, graph_element, styles);
    caption_element.innerHTML = Misc.Format ("Showing {0} ({1}), Nmax = {2}, m = m0 + {3}", AListValues.vmode_text[vmode], AListValues.smode_text[smode], n_max, moff);
}


AListValues.OffsetHeadings =
    [
        ["m", null],
        ["K", null],
        ["Smin", null],
        ["Max Seed (MS)", null],
        ["Smin/K", null],
        ["MS/K", null],
        ["Smin / 3^n", null],
        ["log(MS) / n", null],
    ];
    
    
AListValues.CreateOffsetTable = function (k_offset, k_table)
{
    // Expects TD.tar to be defined in CSS
    
    var tk = new JWTable ();
    
    tk.corner = "n";
    tk.headings = AListValues.OffsetHeadings;
    tk.rows = [];
    tk.cells = [];
    
    var rows = [];
    rows [0] = null;
    
    for (var n = 1 ; n < AList.max_n ; ++n)
    {
        var m = AList.GetM0 (n) + k_offset;
        rows [n] = null;
        
        if (m <= AList.max_m)
        {
            var data = AListValues.GetData (m, n);
            
            if (data != null)
            {
                tk.rows.push ([n.toString (), null]);
                tk.cells.push ([m.toString (), null]);
                tk.cells.push ([data.k.toString (), "tar"]);
                tk.cells.push ([data.smin.toString (), "tar"]);
                tk.cells.push ([data.maxseed.toString (), "tar"]);
                tk.cells.push ([Misc.FloatToText (data.smin / data.k, 2), "tar"]);
                tk.cells.push ([Misc.FloatToText (data.maxseed / data.k, 2), "tar"]);
                tk.cells.push ([Misc.FloatToText (data.smin/AList.pow3[n], 6), "tar"]);
                tk.cells.push ([Misc.FloatToText (Math.log(data.maxseed)/n, 3), "tar"]);
            }
        }
    }
    k_table.innerHTML = tk.Render ();
}

