//-------------------------------------------------------------------------------------------------
// Implements the boxes and beads widget in the A-lists page
// (c) John Whitehouse 2019
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------
Beads = function () {}

Beads.boxes = [];
Beads.num_boxes = 0;
Beads.n = 0;
Beads.m = 0;
Beads.buttons = [];

//-------------------------------------------------------------
Beads.DrawBoxes = function (n, m)
{
    if (n < 1 || n > Beads.buttons.length)
    {
        Misc.Alert ("Please choose 1-" + Beads.buttons.length + " boxes");
        return;
    }
    if (m < n)
    {
        Misc.Alert ("Please choose at least " + n + " beads");
        return;
    }
    if (m > 2 * n)
    {
        Misc.Alert ("'m' is limited to twice 'n'");
        return;
    }

    Beads.n = n;
    Beads.m = m;
    Beads.num_boxes = n;

    for (var i = 0 ; i < n ; ++i)
    {
        Beads.boxes [i] = 1;
    }

    Beads.boxes [n-1] = 1 + m - n;

    Beads.UpdateBoxes ();
}
//-------------------------------------------------------------
Beads.UpdateBoxes = function ()
{
    for (var i in Beads.buttons)
    {
        var button = Beads.buttons [i];

        if (i >= Beads.num_boxes)
        {
            button.style.background = "gray";
            button.style.color = "gray";
            button.innerHTML = "";
        }
        else if (i == 0)
        {
            button.style.background = "lightblue";
            button.style.color = "darkblue";
            button.innerHTML = Beads.boxes [i];
        }
        else if (Beads.boxes [i] == 1)
        {
            button.style.background = "pink";
            button.style.color = "darkred";
            button.innerHTML = 1;
        }
        else
        {
            button.style.background = "lightgreen";
            button.style.color = "darkgreen";
            button.innerHTML = Beads.boxes [i];
        }
    }
    var alist = AList.FromList (Beads.boxes.slice (0, Beads.num_boxes))
    var s0 = alist.Value ();
    var K = T3A1.GetK (Beads.m, Beads.n);
    var start = s0;
    var hcf = Primes.hcf (s0, K);
    var svalues = alist.GetSValues();
    var smin = Math.min (...svalues);
    
    text = Misc.Format ("n = {0}, m = {1}, K = {2}, List = [{3}], ", Beads.n,  Beads.m, K, alist);
    text += Misc.FormatExpression ("S¬0={0}, S¬[min]={1}, hcf={2}", s0, smin, hcf);
    text += Misc.Format ("<br>S-values = [{0}]<br>", svalues);
    
    for (var i = 0 ; i < Beads.n ; ++i)
    {
        var den = Math.pow (2, alist.list[i]);
        var s1 = (3 * s0 + K) / den;
        var sok = Math.floor (s0 / K);

        text += "<br>";
        text += Misc.FormatExpression("(3*{0}+{1})/{2}={3}, S/K={4}", s0, K, den, s1, sok);
        
        if (s1 == start) break;
        s0 = s1;
    }

    alist2_result.innerHTML = text;
}

//-------------------------------------------------------------
Beads.MoveBeadLeft = function (idx)
{
    if (idx < 0 || idx >= Beads.num_boxes)
    {
        return;
    }
    if (idx == 0)
    {
        Misc.Alert ("You can't remove the beads from this box");
        return;
    }
    if (Beads.boxes [idx] == 1)
    {
        Misc.Alert ("Moving this bead would leave the box empty");
        return;
    }
    ++ Beads.boxes [idx-1];
    -- Beads.boxes [idx];

    Beads.UpdateBoxes ();
}

    
    
    