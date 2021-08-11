//-------------------------------------------------------------------------------------------------
// Statistics in the molecules bath
// (c) John Whitehouse 2021
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

BathCounters = function ()
{
    this.tries = new Array (BathCounters.MOVE_TYPES);
    this.accepted = new Array (BathCounters.MOVE_TYPES);
    this.total_tries = new Array (BathCounters.MOVE_TYPES);
    this.total_accepted = new Array (BathCounters.MOVE_TYPES);
    
    this.shape_counts = new Array (BathCounters.MOVE_TYPES);
    this.avg_shape_counts = new Array (BathCounters.MOVE_TYPES);
    
    this.reset (0,0);    
    
    for (var i = 0 ; i < SimController.SHAPE_TYPES ; ++i)
    {
        this.shape_counts [i] = 0;
        this.avg_shape_counts [i] = 0;
    }
}
//-------------------------------------------------------------------------------------------------
BathCounters.Add = 0;
BathCounters.Remove = 1;
BathCounters.Exchange = 2;
BathCounters.Rotate = 3;
BathCounters.Move = 4;
BathCounters.Flip = 5;
BathCounters.MOVE_TYPES = 6;

BathCounters.AVERAGER1 = 0.99999;
BathCounters.AVERAGER2 = 1 - BathCounters.AVERAGER1;

BathCounters.NAMES = ["Add", "Remove", "Exchange", "Move", "Rotate", "Flip"];

BathCounters.prototype.reset = function (e, n)
{
    for (var i = 0 ; i < BathCounters.MOVE_TYPES ; ++i)
    {
        this.tries [i] = 0;
        this.accepted [i] = 0;
        this.total_tries [i] = 0;
        this.total_accepted [i] = 0;
    }
    
    this.tracked_energy = e;
    this.average_energy = e;
    this.average_number = n;
    this.iterations = 0;
}
//-------------------------------------------------------------------------------------------------
BathCounters.prototype.inc = function (type, result, n)
{
    ++ this.tries [type];
    ++ this.iterations;
        
    if (result !== null)
    {
        ++ this.accepted [type];
        this.tracked_energy += result.delta_energy;
        if (result.add_type !== null) ++ this.shape_counts [result.add_type];
        if (result.del_type !== null) -- this.shape_counts [result.del_type];
    }
    
    this.average_energy = this.average_energy * BathCounters.AVERAGER1 + this.tracked_energy * BathCounters.AVERAGER2;
    this.average_number = this.average_number * BathCounters.AVERAGER1 + n * BathCounters.AVERAGER2;
     
    for (var i = 0 ; i < SimController.SHAPE_TYPES ; ++i)
    {
        this.avg_shape_counts [i] = this.avg_shape_counts [i] * BathCounters.AVERAGER1 + this.shape_counts [i] * BathCounters.AVERAGER2;
    }    
}
//-------------------------------------------------------------------------------------------------
BathCounters.prototype.next_period = function ()
{
    for (var i = 0 ; i < BathCounters.MOVE_TYPES ; ++i)
    {
        this.total_tries [i] += this.tries [i];
        this.total_accepted [i] += this.accepted [i];
        this.tries [i] = 0;
        this.accepted [i] = 0;
    }
}
//-------------------------------------------------------------------------------------------------
BathCounters.prototype.table_row = function (type)
{
    var ret = "<tr>";
    
    ret += "<td>" + BathCounters.NAMES[type] + "</td>";
    
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
BathCounters.prototype.total_row = function ()
{
    
    var tries = 0;
    var accepted = 0;
    var tot_tries = 0;
    var tot_accepted = 0;
        
    for (var i = 0 ; i < BathCounters.MOVE_TYPES ; ++i)
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
BathCounters.prototype.heading_row = function ()
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




        
