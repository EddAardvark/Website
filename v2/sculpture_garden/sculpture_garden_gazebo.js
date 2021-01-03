//-------------------------------------------------------------------------------------------------
// A maze in the sculpture garden.
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------
SculptureGarden.Gazebo = function()
{
    Rectangle.call(this);

    this.type = SculptureGarden.GAZEBO;
    this.name = "Gazebo";
}

// Inherit the rectangle prototype

SculptureGarden.Gazebo.prototype = Object.create(Rectangle.prototype);

SculptureGarden.Gazebo.prototype.MapColour = function ()
{
    return "Tomato";
}

SculptureGarden.Gazebo.Initialise = function ()
{
}

//-------------------------------------------------------------------------------------------------
SculptureGarden.Gazebo.prototype.Construct = function(garden)
{
    this.garden = garden;
    this.domains = [];

    // Should be 3x3, so (1,1) will be the centre. Create a plinth where we cab attach some maps

    var xc = this.x0 + 1;
    var yc = this.y0 + 1;
    var centre = new OctoPosition (xc, yc);

    this.cells [centre.key] = new SculptureGarden.Cell (centre, SculptureGarden.Cell.GAZEBO);
    this.cells [centre.key].SetColours ();

    // Add a sculpture
    var item;

    if (Math.random () > 0.5)
    {
        item = new SculptureGarden.Item.Octahedron (centre.shape_type, -0.4, 0.8, "CadetBlue", "SlateBlue");

        item.SetAnimation (Misc.RandomInteger(1, SculptureGarden.Item.Octahedron.ANIMATE_TOTAL));
    }
    else
    {
        item = new SculptureGarden.Item.Bipyramid (centre.shape_type, 0.9, -0.4, 0.8, SVGColours.RandomNamedColour ("red"), SVGColours.RandomNamedColour ("blue"));
        item.SetAnimation (Misc.RandomInteger(1, SculptureGarden.Item.Bipyramid.ANIMATE_TOTAL));
    }
    this.cells [centre.key].items = [item];

    var d = Misc.RandomInteger (4);
    var x = xc + Direction.vectors [d][0];
    var y = yc + Direction.vectors [d][1];

    var key = OctoPosition.MakeKey (x, y);
    var anchor = new Anchor (key, d);
    this.anchors.Add (anchor);

    var position = new OctoPosition (x, y);

    this.cells [key] = new SculptureGarden.Cell (position, SculptureGarden.Cell.PATH);
    this.cells [key].SetColours ();
}
//---------------------------------------------------------------------------------------------------------
SculptureGarden.Gazebo.prototype.toString = function()
{
    return Misc.Format ("SG Gazebo: Origin = ({0}.{1}), size = {2} x {3}", this.origin[0], this.origin[1], this.width, this.height);
}

