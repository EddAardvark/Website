//-------------------------------------------------------------------------------------------------
// Searches Generic values for lists with interesting qualities
// (c) John Whitehouse 2023
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

GVSearcher = function ()
{
    this.todo = [];
    this.max_len = 0;
    this.max_growth = 0;
    this.show_all = true;
    this.curent = null;
    this.links = [];
    this.depth = 1;
    this.rows = [];
    this.longest = null;
    this.biggest = null;
}




GVSearcher.HEADING = "{h}A&hyphen;List|{h}Reason|{h} Equation | {h}B&hyphen;List|{h}Max|{h}Growth\n";
GVSearcher.FORMAT = "{0}|{1}|{2}|{3}|{4}|{5}\n";

GVSearcher.prototype.MakeTable = function ()
{
    var text = GVSearcher.HEADING;
    
    for (var ridx in this.rows)
    {
        var row = this.rows [ridx];
        var gv = row.gv;
        var blist_text = gv.GetBList().toString ().replaceAll (",", ", ");
        var alist_text = gv.alist.toString ().replaceAll (",", ", ");
        var g_text = Misc.FloatToText (gv.GetGrowth(), 3);        
        
        text += Misc.Format (GVSearcher.FORMAT, alist_text, GVSearcher.REASONS[row.reason], gv, blist_text, gv.max_b, g_text);
    }
    
    return JWStyledTable.FromText (text);
}

GVSearcher.prototype.MakeRecordsTable = function ()
{
    var text = GVSearcher.HEADING;
    
    var blist_text = this.biggest.GetBList().toString ().replaceAll (",", ", ");
    var alist_text = this.biggest.alist.toString ().replaceAll (",", ", ");
    var g_text = Misc.FloatToText (this.biggest.GetGrowth(), 3);        
        
    text += Misc.Format (GVSearcher.FORMAT, alist_text, GVSearcher.REASONS[2], this.biggest, blist_text, this.biggest.max_b, g_text);
    
    blist_text = this.longest.GetBList().toString ().replaceAll (",", ", ");
    alist_text = this.longest.alist.toString ().replaceAll (",", ", ");
    g_text = Misc.FloatToText (this.longest.GetGrowth(), 3);        
    
    text += Misc.Format (GVSearcher.FORMAT, alist_text, GVSearcher.REASONS[1], this.longest, blist_text, this.longest.max_b, g_text);
    
    return JWStyledTable.FromText (text);
}

GVSearcher.prototype.StartSystematic = function(depth, show_all)
{
    var start = VLGenericValue.MakeAtom (1);

    start.Inflate ();

    this.todo = [start];
    this.rows = [{"b":start.b, "reason":4, "gv":start}];
    this.max_len = start.alist.length
    this.max_growth = start.growth;
    this.depth = depth;
    this.show_all = show_all;
}

GVSearcher.prototype.ContinueSystematic = function ()
{    
    for (var i = 0 ; i < this.depth ; ++i)
    {
        var current = this.todo.shift ();
        var j = 1;
        
        while (true)
        {
            var next = current.Postfix (j);
            next.Inflate ();
            if (VLUInt.Compare (next.limit.b, next.b) < 0) break;
            
            var reason = this.TestAppend (next);

            if (reason != null)
            {   
                this.AddRow (next, reason);
            }
            this.AddToTodo (next);
            
            ++j;
        }
    }
}

GVSearcher.prototype.StartWide = function (depth, show_all)
{
    var start = VLGenericValue.MakeAtom (1);    
    
    start.Inflate ();
    
    this.todo = [];
    this.rows = [];
    this.max_len = start.alist.length
    this.max_growth = start.growth;
    this.depth = depth;
    this.show_all = show_all;
    this.todo [0] = start;    
}
GVSearcher.prototype.ContinueWide = function ()
{
    for (var i = 0 ; i < this.depth ; ++i)
    {
        var current = (this.todo.length > 0) ? this.todo.shift () : this.biggest;
        var reason = this.TestAppend (current);
        
        if (reason != null)
        {
            this.AddRow (current, reason);
        }
        
        var j = 1;
        
        while (true)
        {
            var next = current.Postfix (j);
            var blist = next.GetBList ();
            if (VLUInt.Compare (blist [blist.length-1], blist[0]) < 0) break;
            ++j;

            this.AddToTodo (next);
        }
    }
}
GVSearcher.prototype.UnwindWide = function ()
{
    for (var i = 0 ; i < this.depth ; ++i)
    {
        var current = this.todo.shift ();

        if (current == null)
        {
            return;
        }
        
        var reason = this.TestAppend (current);
        
        if (reason != null)
        {
            this.AddRow (current, reason);
        }
    }
}
GVSearcher.REASONS = ["All", "Longest", "Biggest", "Long & Big", "Start"];
GVSearcher.CombineReason = function(first, second)
{
    return (first | second) & 0x03;
}

GVSearcher.prototype.AddRow = function (gv, reason)
{
    var added = false;
    
    if (! this.show_all && this.rows.length > 0)
    {
        var tail = this.rows [this.rows.length-1];
        
        if (VLUInt.Compare (gv.b, tail.b) == 0)
        {
            tail.reason = GVSearcher.CombineReason (tail.reason, gv.reason);
            tail.gv = gv;
            
            added = true;
        }
    }
    
    if (! added)
    {
        this.rows.push ({"b":gv.b, "reason":reason, "gv":gv});
    }
    
    if (reason == 1 || reason == 3)
    {
        this.longest = gv;
    }
    if (reason == 2 || reason == 3)
    {
        this.biggest = gv;
    }
}

GVSearcher.prototype.TestAppend = function (next)
{
    var longest = false;
    var biggest = false;
    
    if (next.alist.length > this.max_len)
    {
        this.max_len = next.alist.length;
        longest = true;
    }

    if (next.growth > this.max_growth)
    {
        this.max_growth = next.growth;
        biggest = true;
    }

    if (biggest && longest) return 3;
    if (longest) return 1;
    if (biggest) return 2;

    return this.show_all ? 0 : null;
}


GVSearcher.prototype.AddToTodo = function (gv)
{
    this.AddToTodoRange (0, this.todo.length, gv);
}
GVSearcher.prototype.AddToTodoRange = function (start, end, gv)
{
    if (end == 0)
    {
        this.todo.push (gv);
        return;
    }
    
    if (end - start <= 1)
    {
        if (VLUInt.Compare (gv.b, this.todo[start].b) <= 0)
        {
            this.todo.splice (start, 0, gv);
        }
        else
        {
            this.todo.splice (start+1, 0, gv);
        }
    }
    else
    {
        var mid = Math.floor ((start + end) / 2);
        
        if (VLUInt.Compare (gv.b, this.todo[start].b) <= 0)
        {
            this.AddToTodoRange (0, mid, gv);
        }
        else
        {
            this.AddToTodoRange (mid, end, gv);
        }
    }
}


// Calculates various dependent terms

VLGenericValue.prototype.Inflate = function ()
{
    if (this.blist) return; // already inflated
    
    var next = this;
    var count = 0;    
    
    this.blist = [this.b];
    this.max_b = this.b;
    this.alist = [];
    var pow2 = BigPowers.GetPower (2,this.p2);
    var pow3 = BigPowers.GetPower (3,this.p3);
    this.multiplier = pow3.Multiply(pow2);
    this.limit = this;
    this.text = this.multiplier + "k+" + this.b.toString ();
    
    while (true)
    {
        next = next.Next ();
        if (next == null)
            break;
        
        if (next.odd)
        {
            this.blist.push (next.b);
            this.limit = next;
            this.alist.push (count);
            if (VLUInt.Compare (next.b, this.max_b) > 0)
            {
                this.max_b = next.b;
            }
            count = 0;
        }
        else
        {
            ++ count;
        }
    }
    this.growth = VLUInt.Ratio (this.max_b, this.b);
}