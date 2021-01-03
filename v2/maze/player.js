//-------------------------------------------------------------------------------------------------
// Javascript Maze player, the player within a maze
// (c) John Whitehouse 2013
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
// Create an item
//-------------------------------------------------------------------------------------------------
function MazePlayer (id)
{
    this.pos = 0;
    this.items = [];
    this.items.push (new MazeItem (ITEM_RED_FLAG));
    this.items.push (new MazeItem (ITEM_BEACON));
}
//-------------------------------------------------------------------------------------------------
// Does the player possess an item
//-------------------------------------------------------------------------------------------------
MazePlayer.prototype.FindItem = function (item_id)
{
    var n = this.items.length;

    for (var i = 0 ; i < n ; ++i)
    {
        if (this.items [i].id == item_id)
        {
            return i;
        }
    }
    return -1;
}
//-------------------------------------------------------------------------------------------------
// Does the player possess an item
//-------------------------------------------------------------------------------------------------
MazePlayer.prototype.HasItem = function (item)
{
    var idx = this.FindItem(item);

    return idx != -1;
}
//-------------------------------------------------------------------------------------------------
// Remove an item
//-------------------------------------------------------------------------------------------------
MazePlayer.prototype.RemoveItem = function (item)
{
    var idx = this.FindItem(item);

    if (idx >= 0)
    {
        this.items.splice (idx, 1);
    }
}


