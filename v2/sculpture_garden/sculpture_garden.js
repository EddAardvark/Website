//-------------------------------------------------------------------------------------------------
// A sculpture garden is a collection of galleries displaying artworks set in a garden displaying sculptures
// There may also be some sculptures inside the galleries. It is implemented on a grid composed of octagons and
// squares, walls will be implemented by solid octagons, corridors, galleries and the gardens by empty squares
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------


//==============================================================
SculptureGarden = function()
{
    Rectangle.call(this);

    this.attractions = [];
    this.mapable = [];
    this.name = "Garden";
}

// Inherit the rectangle prototype

SculptureGarden.prototype = Object.create(Rectangle.prototype);

SculptureGarden.MAZE = 1;
SculptureGarden.GALLERY = 2;
SculptureGarden.JUNCTION = 3;
SculptureGarden.GAZEBO = 4;
SculptureGarden.STATUE = 5;

SculptureGarden.X_MARGIN = 2;
SculptureGarden.Y_MARGIN = 2;

SculptureGarden.AttractionDetails = {};

SculptureGarden.AttractionDetails [SculptureGarden.MAZE] = {"min_size":9, "max_size":26, "exclusion":3};
SculptureGarden.AttractionDetails [SculptureGarden.GALLERY] = {"min_size":21, "max_size":41, "exclusion":5};
SculptureGarden.AttractionDetails [SculptureGarden.JUNCTION] = {"min_size":3, "max_size":3, "exclusion":6};
SculptureGarden.AttractionDetails [SculptureGarden.GAZEBO] = {"min_size":3, "max_size":3, "exclusion":6};
SculptureGarden.AttractionDetails [SculptureGarden.STATUE] = {"min_size":3, "max_size":3, "exclusion":6};

SculptureGarden.MajorAttractionFrequency = [0, 3, 3, 0, 20, 0];
SculptureGarden.MinorAttractionFrequency = [0, 0, 0, 60, 40, 120];

SculptureGarden.MajorFrequency = SculptureGarden.MajorAttractionFrequency.reduce((temp, a) => temp + a);
SculptureGarden.MinorFrequency = SculptureGarden.MinorAttractionFrequency.reduce((temp, a) => temp + a);
SculptureGarden.MinorAttractionSelection = [];
SculptureGarden.MajorAttractionSelection = [];

SculptureGarden.AttractionCreatorFun =
    [
        function (){},
        function () { return new SculptureGarden.Maze(); },
        function () { return new SculptureGarden.Gallery(); },
        function () { return new SculptureGarden.Junction(); },
        function () { return new SculptureGarden.Gazebo(); },
        function () { return new SculptureGarden.Statue(); }
    ];

//-------------------------------------------------------------------------------------------------
SculptureGarden.Initialise = function ()
{
    for (var i in SculptureGarden.MajorAttractionFrequency)
    {
        for (var j = 0 ; j < SculptureGarden.MajorAttractionFrequency [i] ; ++j)
        {
            SculptureGarden.MajorAttractionSelection.push (i);
        }
    }
    for (var i in SculptureGarden.MinorAttractionFrequency)
    {
        for (var j = 0 ; j < SculptureGarden.MinorAttractionFrequency [i] ; ++j)
        {
            SculptureGarden.MinorAttractionSelection.push (i);
        }
    }
}
SculptureGarden.Initialise ();
//-------------------------------------------------------------------------------------------------
SculptureGarden.prototype.Initialise = function ()
{
    // start with a gallery

    var w = SculptureGarden.RandomSize (SculptureGarden.GALLERY);
    var h = SculptureGarden.RandomSize (SculptureGarden.GALLERY);
    var gallery = new SculptureGarden.Gallery ();

    gallery.SetPosition (0, 0, w, h);
    gallery.Construct (this);

    this.GrowToAccommodate (gallery);

    this.attractions.push (gallery);
    this.mapable.push (gallery);

    var num = Misc.RandomInteger (2, 2 * SculptureGarden.MajorFrequency);

    for (var i = 0 ; i < num ; ++i)
    {
        this.AddMajorAttraction ();
    }
    num = Misc.RandomInteger (10, 2 * SculptureGarden.MinorFrequency);

    for (var i = 0 ; i < num ; ++i)
    {
        this.AddMinorAttraction ();
    }

    this.AddMargins ();
    this.FindAnchors ();
    this.SetStart ();
    this.AddPaths ();
    this.AddPathTrees ();
    this.FinishConstruct ();
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.prototype.InitialiseSingleStatue = function (type)
{
    this.SetPosition (-10, -10, 21, 21);

    this.AddSculpture (type);
    this.FindAnchors ();

    this.start_point = OctoPosition.FromKey ("1_-6");
    this.start_view = new Direction (Direction.N);

    this.AddPaths ();
    this.AddPathTrees ();
    this.FinishConstruct ();
}
//-------------------------------------------------------------------------------------------------
// Garden expands to accommodate major attractions, minor attractions must fit within the garden
// defined by the major attractions.
//-------------------------------------------------------------------------------------------------
SculptureGarden.prototype.AddMajorAttraction = function ()
{
    var atype = Misc.RandomElement (SculptureGarden.MajorAttractionSelection);
    var attraction = SculptureGarden.AttractionCreatorFun[atype] ();

    Misc.Log ("Atype = {0} = {1} = {2}", atype, attraction.type, attraction.name);

    var w = SculptureGarden.RandomSize (attraction.type);
    var h = SculptureGarden.RandomSize (attraction.type);
    var start = Misc.RandomElement (this.attractions);
    var anchor = start.MakeEdgeAnchor();

    var gap = Math.max (SculptureGarden.AttractionDetails [start.type].exclusion, SculptureGarden.AttractionDetails [attraction.type].exclusion);
    var x0;
    var y0;

    if (anchor.dir == Direction.N)
    {
        x0 = Misc.RandomInteger (anchor.x - w - gap, anchor.x + gap);
        y0 = anchor.y + Misc.RandomInteger(gap, gap + 10);
    }
    else if (anchor.dir == Direction.E)
    {
        x0 = anchor.x + Misc.RandomInteger(gap, gap + 10);
        y0 = Misc.RandomInteger (anchor.y - h - gap, anchor.y + gap);
    }
    else if (anchor.dir == Direction.S)
    {
        x0 = Misc.RandomInteger (anchor.x - w - gap, anchor.x + gap);
        y0 = anchor.y - h - Misc.RandomInteger(gap, gap + 10);
    }
    else if (anchor.dir == Direction.W)
    {
        x0 = anchor.x - gap - w - Misc.RandomInteger(gap, gap + 10);;
        y0 = Misc.RandomInteger (anchor.y - h - gap, anchor.y + gap);
    }

    attraction.SetPosition (x0, y0, w, h);

    var vec = Direction.vectors [anchor.dir];

    while (this.CheckOverlap (attraction))
    {
        attraction.Move (vec[0], vec[1]);
    }

    this.GrowToAccommodate (attraction);

    attraction.Construct (this);

    this.attractions.push (attraction);
}

//-------------------------------------------------------------------------------------------------
SculptureGarden.prototype.AddMinorAttraction = function ()
{
    var attraction;
    var atype = Misc.RandomElement (SculptureGarden.MinorAttractionSelection);

    attraction = SculptureGarden.AttractionCreatorFun[atype] ();

    var w = SculptureGarden.RandomSize (attraction.type);
    var h = SculptureGarden.RandomSize (attraction.type);
    var x0 = Misc.RandomInteger (this.x0, this.x1);
    var y0 = Misc.RandomInteger (this.y0, this.y1);
    var dir = Misc.RandomInteger (8);

    attraction.SetPosition (x0, y0, w, h);

    var vec = Direction.vectors [dir];

    while (true)
    {
        if (! this.Contains (attraction))
        {
            return;
        }

        attraction.Move (vec[0], vec[1]);

        if (! this.CheckOverlap (attraction))
        {
            break;
        }
    }

    attraction.Construct (this);

    this.attractions.push (attraction);
}

//-------------------------------------------------------------------------------------------------
SculptureGarden.prototype.AddSculpture = function (type)
{
    var attraction = new SculptureGarden.Statue(type);

    var w = 3;
    var h = 3;
    var x0 = 0;
    var y0 = 0;
    var dir = Misc.RandomInteger (8);

    attraction.SetPosition (x0, y0, w, h);
    attraction.Construct (this);

    this.attractions.push (attraction);
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.prototype.FinishConstruct = function (attraction)
{
    for (idx in this.attractions)
    {
        var a = this.attractions [idx];

        if (a.type == SculptureGarden.JUNCTION)
        {
            a.AddMaps ();
        }
        else if (a.type == SculptureGarden.GALLERY)
        {
            a.AddMaps();
        }
    }
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.prototype.AddMargins = function ()
{
    this.x0 -= SculptureGarden.X_MARGIN;
    this.x1 += SculptureGarden.X_MARGIN;
    this.y0 -= SculptureGarden.Y_MARGIN;
    this.y1 += SculptureGarden.Y_MARGIN;
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.prototype.CheckOverlap = function (attraction)
{
    for (idx in this.attractions)
    {
        var a = this.attractions [idx];
        var gap = Math.max (SculptureGarden.AttractionDetails [a.type].exclusion, SculptureGarden.AttractionDetails [attraction.type].exclusion);
        if (attraction.Overlaps (a, gap))
        {
            return true;
        }
    }
    return false;
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.prototype.SetStart = function ()
{
    var keys = Object.keys (this.all_anchors);
    var start_key = Misc.RandomElement (keys);

    this.start_point = OctoPosition.FromKey (start_key);
    this.start_view = new Direction (Direction.turn_around[this.all_anchors[start_key].dir]);
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.prototype.FindAnchors = function ()
{
    this.all_anchors = {};

    for (attr in this.attractions)
    {
        var attraction = this.attractions [attr];
        var anchors = attraction.anchors.anchors;
        for (anc in anchors)
        {
            this.all_anchors [anc] = anchors [anc];
        }
    }
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.prototype.AddPaths = function ()
{
    this.max_path = this.x1 + this.y1 - this.x0 - this.y0;

    for (attr in this.attractions)
    {
        var attraction = this.attractions [attr];

        this.CreatePathsFromAttraction (attraction);
    }
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.prototype.CreatePathsFromAttraction = function (attraction)
{
    for (aidx in attraction.anchors.anchors)
    {
        var anchor = attraction.anchors.anchors [aidx];

        this.CreatePathFromAnchor (anchor);
    }
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.prototype.CreatePathFromAnchor = function (anchor)
{
    var pos = OctoPosition.FromKey (anchor.key);
    var np = new Array (5);
    var d = new Array (5);
    var finish = false;
    var path_length = 0;

    d[0] = anchor.dir;

    while (path_length < this.max_path && ! finish)
    {
        var best = -1;
        var min_potential = Number.MAX_SAFE_INTEGER;

        d[1] = Direction.turn_left45 [d[0]];
        d[2] = Direction.turn_right45 [d[0]];
        d[3] = Direction.turn_left90 [d[0]];
        d[4] = Direction.turn_right90 [d[0]];

        // have we met another path

        for (var i = 0 ; i < 5 ; ++i)
        {
            np[i] = pos.Neighbour (d[i]);

            if (np[i] && this.cells [np[i].key] && this.cells [np[i].key].type == SculptureGarden.Cell.PATH)
            {
                finish = true;
                break;
            }
        }

        // Otherwise try to move forward

        for (var i = 0 ; i < 3 && ! finish ; ++i)
        {
            if (! np[i])
            {
                continue;
            }

        // have we found an anchor

            if (this.all_anchors [np[i].key])
            {
                best = i;
                finish = true;
                break;
            }

        // Stay inside the garden

            if (! this.ContainsCell (np[i]))
            {
                continue;
            }

        // If we bump into something go around it

            if (this.IsCellSolid (np[i]))
            {
                continue;
            }

        // Follow the potential

            var potential = this.GetPathPotential (np[i].x_pos, np[i].y_pos);

            if (potential < min_potential)
            {
                min_potential = potential;
                best = i;
            }
        }

        // Can't continue
        if (best < 0)
        {
            break;
        }

        pos = np [best];
        d [0] = d [best];
        ++path_length;

        this.cells [pos.key] = new SculptureGarden.Cell (pos, SculptureGarden.Cell.PATH);
        this.cells [pos.key].SetColours ();
    }
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.prototype.GetPathPotential = function (x,y)
{
    var potential = 0;
    var key = OctoPosition.MakeKey (x,y);

    if (this.all_anchors [key])
    {
        return -1000000;
    }

    // Anchors are attractive

    for (var idx in this.all_anchors)
    {
        var xa = this.all_anchors [idx].x;
        var ya = this.all_anchors [idx].y;
        var dx = x - xa;
        var dy = y - ya;
        var r2 = dx * dx + dy * dy;

        if (r2 > 0)
        {
            potential -= 1 / r2;
        }
    }

    // Attractions are repulsive, but less so than anchors are attractive (only 1 can influence the result)

    for (var idx in this.attractions)
    {
        var attr = this.attractions [idx];

        if (attr.ContainsPoint (x, y, 3))
        {
            if (! attr.ContainsPoint (x, y, 2))
            {
                return potential + 1 / 16;
            }
            if (! attr.ContainsPoint (x, y, 1))
            {
                return potential + 1 / 9;
            }
            if (! attr.ContainsPoint (x, y, 0))
            {
                return potential + 1 / 4;
            }

            return Number.MAX_SAFE_INTEGER;
        }
    }
    return potential;
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.prototype.ContainsCell = function (position)
{
    return position.x_pos >= this.x0 && position.x_pos <= this.x1 && position.y_pos >= this.y0 && position.y_pos <= this.y1;
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.prototype.CreatePathCells = function (path, overwrite)
{
    for (var idx in path.keys)
    {
        var cell_pos = path.cells [path.keys[idx]];

        if (! overwrite && this.IsCellOccupied (cell_pos))
        {
            break;
        }
        this.cells [cell_pos.key] = new SculptureGarden.Cell (cell_pos, SculptureGarden.Cell.PATH);
        this.cells [cell_pos.key].SetColours ();
    }
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.prototype.AddPathTrees = function ()
{
    var path_trees = Math.random() * 0.75;
    var tested = {};
    var num_tested = 0;
    var num_planted = 0;

    for (var key in this.cells)
    {
        if (this.cells [key].type == SculptureGarden.Cell.PATH)
        {
            var pos = this.cells [key].position;

            for (var d = 0 ; d < 8 ; ++d)
            {
                var neighbour = pos.Neighbour (d);

                if (neighbour && ! this.IsCellOccupied (neighbour) && ! tested[neighbour.key])
                {
                    tested[neighbour.key] = true;

                    num_tested ++;

                    if (Math.random () < path_trees)
                    {
                        this.cells [neighbour.key] = new SculptureGarden.Cell (neighbour, SculptureGarden.Cell.SOLID_TREE);
                        this.cells [neighbour.key].SetColours ();

                        var width = 0.3 + Math.random () * 0.7;
                        var height = 0.3 + 1.7 * Math.random ();

                        this.cells [neighbour.key].items = [new SculptureGarden.Item.Pyramid (neighbour.shape_type, width, 0, height, "darkgreen", "greenyellow")];
                        num_planted ++;
                    }
                }
            }
        }
    }
}
//-------------------------------------------------------------------------------------------------
SculptureGarden.prototype.SynthesiseExteriorCell = function (pos)
{
    var type = (pos.x_pos < this.x0 || pos.x_pos > this.x1 || pos.y_pos < this.y0 || pos.y_pos > this.y1) ? SculptureGarden.Cell.VOID : SculptureGarden.Cell.OUTSIDE;
    var cell = new SculptureGarden.Cell (pos, type);
    cell.SetGardenColours (pos, type);
    return cell;
}
//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.prototype.GetCellAt = function (position)
{
    for (var idx in this.attractions)
    {
        var attraction = this.attractions [idx];
        var cell = attraction.GetCellAt (position)

        if (cell) return cell;
    }

    cell = this.cells [position.key];

    if (cell) return cell;

    return this.SynthesiseExteriorCell (position);
}
//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.prototype.IsCellOccupied = function (position)
{
    if (this.cells[position.key])
    {
        return true;
    }
    for (var idx in this.attractions)
    {
        if (this.attractions [idx].IsCellOccupied (position))
        {
            return true;
        }
    }
    return false;
}
//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.prototype.IsCellSolid = function (position)
{
    var cell = this.cells[position.key];

    if (cell && cell.IsSolid ())
    {
        return true;
    }

    for (var idx in this.attractions)
    {
        cell = this.attractions [idx].GetCellAt (position);

        if (cell && cell.IsSolid ())
        {
            return true;
        }
    }
    return false;
}
//------------------------------------------------------------------------------------------------------------------------------------
SculptureGarden.RandomSize = function (attraction_type)
{
    var details = SculptureGarden.AttractionDetails [attraction_type];

    if (details == null)
    {
        return 0;
    }
    return details.min_size + Misc.RandomInteger (details.max_size - details.min_size);
}

//---------------------------------------------------------------------------------------------------------
SculptureGarden.prototype.toString = function()
{
    return Misc.Format ("Sculpture Garden");
}
