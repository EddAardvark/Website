//-------------------------------------------------------------------------------------------------
// A collection of connection points
// (c) John Whitehouse 2019
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------
Anchor = function (key, dir)
{
    var temp = OctoPosition.SplitKey (key);

    this.key = key;
    this.dir = dir;
    this.connected = false;
    this.x = temp [0];
    this.y = temp [1];
}
//-------------------------------------------------------------------------------------------------
Anchors = function ()
{
    this.anchors = {};
}
//-------------------------------------------------------------------------------------------------
Anchors.prototype.Add = function (anchor)
{
    this.anchors [anchor.key] = anchor;
}
//-------------------------------------------------------------------------------------------------
Anchors.prototype.Remove = function (key)
{
    delete this.anchors [key];
}
//---------------------------------------------------------------------------------------------------------
Anchors.prototype.GetRandonAnchor = function (dir)
{
    var keys = Object.keys(this.anchors);

    if (keys.length == 0)
    {
        return null;
    }

    while (true)
    {
        var key = Misc.RandomElement (keys);

        if (dir === null || dir === undefined || this.anchors[key] == dir)
        {
            return this.anchors[key];
        }
    }
}
