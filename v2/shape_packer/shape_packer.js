//-------------------------------------------------------------------------------------------------
// Javascript Shape Representations
// (c) John Whitehouse 2015
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
// Create the shape packer
// shape counts: and array containing the number of each type of Shape
// outer_shape: the type of the outer shape, 0 = circle, 3-n = polygon
//-------------------------------------------------------------------------------------------------
function ShapePacker (shape_counts, outer_shape)
{
    this.shapes = [];
    this.scale = 0;
    this.show_touching = false;
    this.chart = new Chart.HiLoBins (200, 1000);
    
    this.SetTemperature (0.001);
        
    // create the outer shape

    if (outer_shape >= 3)
    {
        this.functions = [this.Move, this.Rotate, this.Resize, this.SwapAndShrink, this.RotateOuter];
        this.tries = [0,0,0,0,0];
        this.moves = [0,0,0,0,0];
        this.outer_shape = new Polygon (outer_shape, 0, 0);
    }
    else
    {
        this.functions = [this.Move, this.Rotate, this.Resize, this.SwapAndShrink];
        this.tries = [0,0,0,0];
        this.moves = [0,0,0,0];
        this.outer_shape = new Circle (0,0);
    }
    this.outer_shape.colour = "none";

    // And the inner shapes

    var num_shapes = 0;

    for (var i = 0 ; i < shape_counts.length ; ++i)
    {
        num_shapes += shape_counts [i];
    }

    if (num_shapes == 0)
    {
        alert ("No shapes specified");
        return;
    }

    this.scale = 1.0 / (num_shapes + 2);
    this.best_scale = this.scale;

    // Circles

    var num_circles = 0;

    while (num_circles < shape_counts [0])
    {
        var r = (1 - this.scale) * Math.random ();
        var theta = Math.random () * Math.PI * 2;
        var circle = new Circle (r * Math.cos (theta), r * Math.sin (theta));

        circle.SetSize (this.scale);
        if (this.TryAddShape (circle))
        {
            ++ num_circles;
        }
    }

    // Polygons

    for (var i = 1 ; i < shape_counts.length ; ++i)
    {
        var num_poly = 0;
        var sides = i+2;

        while (num_poly < shape_counts [i])
        {
            var r = (1 - this.scale) * Math.random ();
            var theta = Math.random () * Math.PI * 2;
            var polygon = new Polygon (sides, r * Math.cos (theta), r * Math.sin (theta));

            polygon.SetSize (this.scale);
            polygon.angle = Math.random () * Math.PI * 2;

            if (this.TryAddShape (polygon))
            {
                ++ num_poly;
            }
        }
    }

    // Label the shapes
    
    for (var idx in this.shapes)
    {
        this.shapes [idx].id = idx;
    }
    
    //this.InitialiseDistances ();

    // This is the best configuration so far

    this.SaveAsBest ();
}

// Global constants

ShapePacker.MinPolygon = 3;
ShapePacker.MaxPolygon = 9;
ShapePacker.PgConstants = new Array (ShapePacker.MaxPolygon);
ShapePacker.ShapeNames = ["Circle", "?", "?", "Triangle", "Square", "Pentagon", "Hexagon", "Heptagon", "Octagon", "Nonagon"];
ShapePacker.MaxResize = 0.1;
//-------------------------------------------------------------------------------------------------
// All polygons of a particular order share the same constants
//-------------------------------------------------------------------------------------------------
ShapePacker.Initialise = function()
{
    for (var i = ShapePacker.MinPolygon ; i <= ShapePacker.MaxPolygon ; ++i)
    {
        ShapePacker.PgConstants [i] = new PolygonConstants (i);
    }
}
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.SetTemperature = function (t)
{
    this.temperature = t;
    this.delta_x = Math.min (1000 * t, 1);
    this.delta_a = Math.min (100 * t, 0.1);
    this.delta_s = Math.min (10 * t, 0.01);
}
//-------------------------------------------------------------------------------------------------
// Try to add a shape, returns false if the shape isn't entirely indide the container or if
// it overlaps an existing shape.
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.TryAddShape = function (shape)
{
    if (! this.outer_shape.Contains (shape))
    {
        return false;
    }

    for (sidx in this.shapes)
    {
        if (this.shapes [sidx].Overlaps (shape))
        {
            return false;
        }
    }
    this.shapes.push (shape);
    return true;
}
//-------------------------------------------------------------------------------------------------
// Try some moves
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.TryMoves = function (num_to_try)
{
    var changed = false;

    for (var i = 0 ; i < num_to_try ; ++i)
    {
        var option = Math.floor (Math.random () * this.functions.length);

        this.tries [option] ++;

        if (this.functions [option].call (this))
        {
            changed = true;
            this.scale = this.shapes [0].scale;
            this.moves [option] ++;
            
            this.chart.Add (this.scale);

            if (this.scale > this.best_scale)
            {
                this.best_scale = this.scale;
                this.SaveAsBest ();
            }
        }
    }

    return changed;
}
//-------------------------------------------------------------------------------------------------
// Move a shape
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.Move = function ()
{
    var dx = this.delta_x * (Math.random () - 0.5);
    var dy = this.delta_x * (Math.random () - 0.5);
    var sidx = Math.floor (Math.random () * this.shapes.length);

    var shape = this.shapes [sidx];

    shape.SavePosition ();
    shape.Move (dx, dy);

    var accepted = this.CheckShapePosition (sidx, shape);

    if (! accepted)
    {
        shape.RestorePosition ();
    }

    return accepted;
}
//-------------------------------------------------------------------------------------------------
// Rotate the outer shape
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.RotateOuter = function ()
{
    var da = this.delta_a * (Math.random () - 0.5);

    this.outer_shape.SavePosition ();
    this.outer_shape.Rotate (da);

    var accepted = this.CheckOuterShapePosition ();

    if (! accepted)
    {
        this.outer_shape.RestorePosition ();
    }

    return accepted;
}
//-------------------------------------------------------------------------------------------------
// Rotate a shape
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.Rotate = function ()
{
    var da = this.delta_a * (Math.random () - 0.5);
    var sidx = Math.floor (Math.random () * this.shapes.length);

    var shape = this.shapes [sidx];

    shape.SavePosition ();
    shape.Rotate (da);

    var accepted = this.CheckShapePosition (sidx, shape);

    if (! accepted)
    {
        shape.RestorePosition ();
    }

    return accepted;
}
//-------------------------------------------------------------------------------------------------
// Resize all the shapes. If the size increases the change is always accepted, if it shrinks
// then it is accepted based on a temperature related value. This has the effect of forcing
// shapes to be as large as possible while allowing some scope for them to rearrange their
// positions.
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.Resize = function ()
{
    var ds = this.delta_s * (Math.random () - 0.5);

    // Reject shrinkage using the factor exp (ds/T). Bigger shrinkages are less likely.

    if (ds < 0)
    {
        var factor = Math.exp (ds / this.temperature);
        var accept = Math.random ();
        if (factor < accept)
        {
            return;
        }
    }
    // Save positions

    for (var sidx in this.shapes)
    {
        this.shapes [sidx].SavePosition ();
    }

    // Resize

    for (var sidx in this.shapes)
    {
        this.shapes [sidx].Resize (ds);
    }

    // Check for overlaps

    var accepted = true;

    for (var sidx in this.shapes)
    {
        if (! this.CheckShapePosition (sidx, this.shapes [sidx]))
        {
            accepted = false;
            break;
        }
    }

    // If not accepted restore the previous positions

    if (! accepted)
    {
        for (var sidx in this.shapes)
        {
            this.shapes [sidx].RestorePosition ();
        }
    }
    return accepted;
}
//-------------------------------------------------------------------------------------------------
// Swaps two shapes and shrink everything at the same time
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.SwapAndShrink = function ()
{
    // choose two shapes

    var sidx1 = Math.floor (Math.random () * this.shapes.length);
    var sidx2 = Math.floor (Math.random () * this.shapes.length);

    if (sidx1 == sidx2)
    {
        return false;
    }

    var shape1 = this.shapes [sidx1];
    var shape2 = this.shapes [sidx2];

    // No point swapping circles

    if (shape1.is_circle && shape2.is_circle)
    {
        return false;
    }

    // Test the shrink factor, more likely to work at higher temperatures

    var ds = -2 * ShapePacker.MaxResize * Math.random ();

    // Reject shrinkage using the factor exp (ds/T). Bigger shrinkages are less likely.

    if (ds < 0)
    {
        var factor = Math.exp (ds / this.temperature);
        var accept = Math.random ();
        if (factor < accept)
        {
            return;
        }
    }

    // Save positions

    for (var sidx in this.shapes)
    {
        this.shapes [sidx].SavePosition ();
    }

    // Resize

    for (var sidx in this.shapes)
    {
        this.shapes [sidx].Resize (ds);
    }

    // Swap

    var x1 = shape1.x;
    var y1 = shape1.y;
    var x2 = shape2.x;
    var y2 = shape2.y;

    shape1.MoveTo (x2, y2);
    shape2.MoveTo (x1, y1);

    // Check for overlaps

    var accepted = true;

    for (var sidx in this.shapes)
    {
        if (! this.CheckShapePosition (sidx, this.shapes [sidx]))
        {
            accepted = false;
            break;
        }
    }

    // If not accepted restore the previous positions

    if (! accepted)
    {
        for (var sidx in this.shapes)
        {
            this.shapes [sidx].RestorePosition ();
        }
    }
    return accepted;
}
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.CheckShapePosition = function (exclude, shape)
{
    // Must be inside the outer shape and not overlap any of the other shapes

    if (! this.outer_shape.Contains (shape))
    {
        return false;
    }

    for (var idx in this.shapes)
    {
        if (idx != exclude && shape.Overlaps (this.shapes [idx]))
        {
            return false;
        }
    }

    return true;
}
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.CheckOuterShapePosition = function ()
{
    // Are all the shapes inside the outer shape

    for (var idx in this.shapes)
    {
        if (! this.outer_shape.Contains (this.shapes [idx]))
        {
            return false;
        }
    }

    return true;
}
//-------------------------------------------------------------------------------------------------
// Save the best to the list
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.SaveAsBest = function ()
{
    var best = this.outer_shape.ToText();

    for (var i in this.shapes)
    {
        best += "|";
        best += this.shapes [i].ToText ();
    }
    this.best = best;
}
//-------------------------------------------------------------------------------------------------
// restore from a saved pattern
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.FromText = function (text)
{
    var bits = text.split("|");
    var n = bits.length;

    this.shapes = [];

    this.outer_shape = Shape.FromText (bits [0]);

    for (var i = 1 ; i < n ; ++i)
    {
        var shape = Shape.FromText (bits [i]);

        if (shape != null)
        {
            this.shapes.push (shape);
            this.scale = shape.scale;
        }
    }
}
//-------------------------------------------------------------------------------------------------
// Returns a vector containing 3 elements.
// The first is the name of the outer shape.
// The second will be a description of the whole picture
// The third is the scale
//-------------------------------------------------------------------------------------------------
ShapePacker.CountShapes = function (text)
{
    var bits = text.split("|");
    var n = bits.length;

    var ret = [null,null];
    var counts = [0,0,0,0,0,0,0,0,0,0];

    var outer = Shape.FromText (bits [0]);
    ret [0] = Shape.shape_names [outer.sides];

    for (var i = 1 ; i < n ; ++i)
    {
        var shape = Shape.FromText (bits [i]);
        ret [2] = shape.scale;
        counts [shape.sides] ++;;
    }

    var description = "";
    var comma = "";
    for (var i in counts)
    {
        if (counts [i] > 0)
        {
            description += comma;
            description += counts [i];
            description += " ";
            description += Shape.shape_names [i];
            if (i > 1) description += "s";
            comma = " + "
        }
    }
    ret [1] = description;
    return ret;
}
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.InitialiseDistances = function ()
{
    var n = this.shapes.length;
    var npairs = n * (n - 1) / 2;
    
    this.touching_distances = new Array (npairs);
    this.centre_distances  = new Array (npairs);
    
    for (var i = 0 ; i < n - 1 ; ++i)
    {
        for (var j = i + 1 ; j < n ; ++j)
        {
            var idx = ShapePacker.PairIndex (i, j);
            this.centre_distances [idx] = Shape.CentreDistance (this.shapes[i], this.shapes [j]);
            this.touching_distances [idx] = this.shapes[i].TouchingDistance (this.shapes [j]);
        }
    }
}
//-------------------------------------------------------------------------------------------------
// Gets the distances between the shape specified and the other shapes, returns null is any 
// overlap
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.GetCentreDistances = function (shape, idx, min)
{
    var ret = [];
    
    for (var i = 0 ; i < this.shapes.length ; ++i)
    {
        if (i != idx)
        {
            var d = Shape.CentreDistance (shape, this.shapes [i]);
            
            if (d < min)
            {
                return null;
            }
            ret.push (ShapePacker.PairIndex (i, idx), d);
        }        
    }
    return ret;
}
//-------------------------------------------------------------------------------------------------
// Gets the touching distances between the shape specified and the other shapes, returns null is any 
// overlap
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.GetTouchingDistances = function (shape, idx, min)
{
    var ret = [];
    
    for (var i = 0 ; i < this.shapes.length ; ++i)
    {
        if (i != idx)
        {
            var d = Shape.TouchingDistance (shape, this.shapes [i]);
            
            if (d < min)
            {
                return null;
            }
            ret.push (ShapePacker.PairIndex (i, idx), d);
        }        
    }
    return ret;
}
//-------------------------------------------------------------------------------------------------
// Returns the closest distance between a shape and the point
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.GetTouchingDistance = function (x, y)
{
    var pt = [x,y];
    var ret = 1000000;
    
    for (var i = 0 ; i < this.shapes.length ; ++i)
    {
        var d = this.shapes [i].TouchingDistancePt (pt);
        
        if (d === null) return null;
        
        if (d < ret)
        {
            ret = d;
        }        
    }
    
    return ret;    
}
//-------------------------------------------------------------------------------------------------
ShapePacker.PairIndex = function (n1, n2)
{
    return (n1 >= n2)
                ? (n1 * (n1 - 1) / 2 + n2)
                : (n2 * (n2 - 1) / 2 + n1);
}
//-------------------------------------------------------------------------------------------------
// Restore the best so far
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.ReloadBest = function ()
{
    this.FromText (this.best);
}
//-------------------------------------------------------------------------------------------------
// Save a definition as the best so far
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.SetBest = function (text)
{
    this.FromText (text);
}
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.DrawCanvas = function (cv)
{
    cv.chelp.SetLineWidth (1);

    cv.chelp.context.clearRect(0,0,cv.chelp.canvas.width,cv.chelp.canvas.height);

    //cv.chelp.DrawFilledRect (0, 0, cv.chelp.canvas.width, cv.chelp.canvas.height);   
    
    this.outer_shape.ToCanvas (cv, false);

    for (var i in this.shapes)
    {
        this.shapes [i].ToCanvas (cv, true);
    }
    
    if (this.show_touching)
    {
        cv.chelp.SetForeground ("black");
        for (var i = 0 ; i < this.shapes.length - 1 ; ++i)
        {
            var s1 = this.shapes [i];
            for (var j = i+1 ; j < this.shapes.length ; ++j)
            {
                var s2 = this.shapes [j];
                if (Shape.Touching (s1, s2))
                {
                    var x1 = s1.x * cv.scale + cv.dx;
                    var y1 = s1.y * cv.scale + cv.dy;
                    var x2 = s2.x * cv.scale + cv.dx;
                    var y2 = s2.y * cv.scale + cv.dy;
                    cv.chelp.DrawLine ([x1, y1], [x2, y2]);
                }
            }
        }
    }    

    cv.image.src = cv.chelp.canvas.toDataURL('image/png');    
}

//-------------------------------------------------------------------------------------------------
// Draw the display
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.InnerArea = function ()
{
    var ret = 0;

    for (var i in this.shapes)
    {
        ret += this.shapes [i].Area ();
    }

    return ret;
}
//-------------------------------------------------------------------------------------------------
// Draw the display
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.OuterArea = function ()
{
    return this.outer_shape.Area();
}
//-------------------------------------------------------------------------------------------------
ShapePacker.prototype.DrawTouchingDistance = function (chelp, image_element)
{
    var w = chelp.canvas.width;
    var h = chelp.canvas.height;
    var chart = new DensityMap ();

    chart.Initialise (this, this.GetTouchingDistance);
    chart.SetDomainRect (-1, -1, 2, 2);
    chart.SetValueRange (0,0.1);

    if (w > h)
    {
        chart.SetCanvasRect ((w-h)/2, 0, h, h);
    }
    else
    {
        chart.SetCanvasRect (0, (h-w)/2, w, w);
    }
    chart.Draw (chelp, image_element);
}







