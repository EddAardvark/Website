//-------------------------------------------------------------------------------------------------
// A pattern created by repeating triangles on a square grid.
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

//==========================================================================================================
// The pattern
// Starts off with a 2x2 grid and generates a series of larger patterns by repeating the original pattern
//==========================================================================================================
TrianglePattern = function ()
{
}

TrianglePattern.TRIANGLE = 0;   // Random set of triangles
TrianglePattern.RECTANGLE = 1;  // Random set of rectangles
TrianglePattern.SPOTS = 2;      // Random set of spots
TrianglePattern.T_AND_R = 3;      // Random set of triangles + rectangles
TrianglePattern.T_AND_S = 4;      // Random set of triangles + spots
TrianglePattern.R_AND_S = 5;      // Random set of rectangles + spots
TrianglePattern.ALL = 6;      // Random set of everything

TrianglePattern.CUSTOM = 7;     // User defined


TrianglePattern.Element = function (idx, colour)
{
    this.draw = idx;
    this.colour = colour;
}
TrianglePattern.Element.prototype.Copy = function ()
{
    return new TrianglePattern.Element (this.draw, this.colour);
}

// transformations

TrianglePattern.Element.Rotate90 = [0,4,1,2,3,8,5,6,7,9,10,11];
TrianglePattern.Element.Rotate180 = [0,3,4,1,2,7,8,5,6,9,10,11];
TrianglePattern.Element.Rotate270 = [0,2,3,4,1,6,7,8,5,9,10,11];
TrianglePattern.Element.ReflectX = [0,2,1,4,3,7,6,5,8,9,10,11];
TrianglePattern.Element.ReflectY = [0,4,3,2,1,5,8,7,6,9,10,11];
TrianglePattern.Element.Invert = [9,3,4,1,2,7,8,5,6,0,11,10];

TrianglePattern.Element.ReflectXY = TrianglePattern.Rotate180;

TrianglePattern.Element.prototype.Copy = function ()
{
    return new TrianglePattern.Element (this.draw, this.colour);
}
TrianglePattern.Element.prototype.Rotate90 = function ()
{
    return new TrianglePattern.Element (TrianglePattern.Element.Rotate90 [this.draw], this.colour);
}
TrianglePattern.Element.prototype.Rotate180 = function ()
{
    return new TrianglePattern.Element (TrianglePattern.Element.Rotate180 [this.draw], this.colour);
}
TrianglePattern.Element.prototype.Rotate270 = function ()
{
    return new TrianglePattern.Element (TrianglePattern.Element.Rotate270 [this.draw], this.colour);
}
TrianglePattern.Element.prototype.ReflectX = function ()
{
    return new TrianglePattern.Element (TrianglePattern.Element.ReflectX [this.draw], this.colour);
}
TrianglePattern.Element.prototype.ReflectY = function ()
{
    return new TrianglePattern.Element (TrianglePattern.Element.ReflectY [this.draw], this.colour);
}
TrianglePattern.Element.prototype.ReflectXY = function ()
{
    return new TrianglePattern.Element (TrianglePattern.Element.Rotate180 [this.draw], this.colour);
}
TrianglePattern.Element.prototype.Invert = function ()
{
    return new TrianglePattern.Element (TrianglePattern.Element.Invert [this.draw], this.colour);
}

TrianglePattern.Shapes =
[
    [],                                                             // 0: Empty

    [[0,0], [0,1], [1,1]],                                          // 1: NW triangle
    [[0,1], [1,1], [1,0]],                                          // 2: NE triangle
    [[0,0], [1,1], [1,0]],                                          // 3: SE triangle
    [[0,0], [0,1], [1,0]],                                          // 4: SW triangle

    [[0,0], [0,1], [0.5,1], [0.5,0]],                               // 5: NW rectangle
    [[0,0.5], [0,1], [1,1], [1,0.5]],                               // 6: NE rectangle
    [[0.5,0], [0.5,1], [1,1], [1,0]],                               // 7: SE rectangle
    [[0,0], [0,0.5], [1,0.5], [1,0]],                               // 8: SW rectangle
    
    [[0,0], [0,1], [1,1], [1,0]],                                   // 9: Solid square
    
    [[0.25,0.25], [0.25,0.75], [0.75,0.75], [0.75,0.25]],           // 10, 11: Square spots
    
    [[0,0], [0,1], [1,1], [1,0], [0,0], [0.25,0.25], [0.75,0.25], [0.75,0.75], [0.25,0.75], [0.25,0.25]],
     
];

TrianglePattern.Patterns =
[
    [1,2,3,4],                  // Triangles
    [5,6,7,8],                  // Rectangles
    [0,9,10,11],                // Spots
    [1,2,3,4,5,6,7,8],          // Triangles + Rectangles
    [1,2,3,4,0,9,10,11],        // Triangles + Spots
    [5,6,7,8,0,9,10,11],        // Rectangles + Spots
    [1,2,3,4,5,6,7,8,0,9,10,11],// Everything
];

// Layout

TrianglePattern.MARGIN = 4;
TrianglePattern.NUM_ELEMENTS = TrianglePattern.Shapes.length;

TrianglePattern.CodeLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
//-----------------------------------------------------------------------------------------------------
TrianglePattern.prototype.MakeRandom = function (type, colours=null)
{
    this.size = 2;
    this.pattern = new Array (this.size);
    this.background = "white";

    var shape_list = TrianglePattern.Patterns[type];

    for (var x = 0 ; x < this.size ; ++x)
    {
        this.pattern [x] = new Array (this.size);

        for (var y = 0 ; y < this.size ; ++y)
        {
            var c = colours ? colours [2 * x + y] : "black"; 
            this.pattern [x][y] = new TrianglePattern.Element (Misc.RandomElement (shape_list), c);
        }
    }
    this.code = "";
}

TrianglePattern.prototype.Initialise = TrianglePattern.prototype.MakeRandom;    // Backwards compatibility

//-----------------------------------------------------------------------------------------------------
TrianglePattern.prototype.MakeCustom = function (shapes)
{
    this.size = 2;
    this.pattern = new Array (this.size);
    this.background = "white";

    var idx = 0;
    
    for (var x = 0 ; x < this.size ; ++x)
    {
        this.pattern [x] = new Array (this.size);

        for (var y = 0 ; y < this.size ; ++y)
        {
            this.pattern [x][y] = shapes[idx].Copy ();
            ++ idx;
        }
    }
    this.code = "";
}
//-----------------------------------------------------------------------------------------------------
TrianglePattern.prototype.Draw = function (chelp)
{
    var w = chelp.canvas.width;
    var h = chelp.canvas.height;
    var dx = (w - 2 * TrianglePattern.MARGIN) / this.size;
    var dy = (h - 2 * TrianglePattern.MARGIN) / this.size;
    var len = Math.min (dx, dy);
    var x0 = (w - this.size * len) / 2;
    var y0 = (h + this.size * len) / 2;

    chelp.SetBackground (this.background);
    chelp.DrawFilledRect (0, 0, w, h);
    chelp.SetLineWidth (0);

    for (var x = 0 ; x < this.size ; ++x)
    {
        for (var y = 0 ; y < this.size ; ++y)
        {
            var element = this.pattern[x][y];
            var piece = TrianglePattern.Shapes [element.draw];

            if (piece.length > 2)
            {
                var draw = piece.map (s => [x0 + (x + s[0]) * len, y0 - (y + s[1]) * len]);
                
                chelp.SetBackground (element.colour);
                chelp.SetForeground (element.colour);
                chelp.DrawPolygon (draw);
            }
        }
    }
}
//-----------------------------------------------------------------------------------------------------
TrianglePattern.DrawElement = function (element, chelp, highlight)
{
    var w = chelp.canvas.width;
    var h = chelp.canvas.height;
    var len = Math.min (w, h);
    var bg = "white";
    var fg = element.colour;

    chelp.SetBackground (bg);
    chelp.DrawFilledRect (0, 0, w, h);
    chelp.SetLineWidth (0);
    chelp.SetBackground (fg);
    chelp.SetForeground (fg);

    var piece = TrianglePattern.Shapes [element.draw];

    if (piece.length > 2)
    {
        var draw = piece.map (s => (s == null) ? null : [s[0] * len, (1 - s[1]) * len]);

        chelp.DrawPolygon (draw);
    }
    
    if (highlight)
    {        
        chelp.SetTransparency(0.3);
        chelp.SetBackground ("blue");
        chelp.DrawFilledRect (0, 0, w, h);
    }
}
//-----------------------------------------------------------------------------------------------------
TrianglePattern.prototype.DrawInShape = function (chelp, shape)
{
// shape is (Bottom-Left, Top-Left, Top-Right, Bottom-Right)

    chelp.SetBackground (this.background);
    chelp.DrawPolygon (shape);

    var square = [[0,0],[1,0],[1,1],[0,1]];

    for (var x = 0 ; x < this.size ; ++x)
    {
        for (var y = 0 ; y < this.size ; ++y)
        {
            var piece = TrianglePattern.Shapes [this.pattern[x][y].draw];

            if (piece.length > 2)
            {
                var draw = piece.map (s => CoordinateMaths.MapToQuadrilateral ((x + s[0]) / this.size, (y + s[1]) / this.size, shape));

                chelp.DrawPolygon (draw);
            }
        }
    }

    CoordinateMaths.MapToQuadrilateral (x, y, shape);
}
//-----------------------------------------------------------------------------------------------------
TrianglePattern.prototype.Expand = function ()
{
    // Applies a random transformation.

    var code = Misc.RandomElement (TrianglePattern.CodeLetters);
    
    this.ExpandFromCode (code);

    //TrianglePattern.Expanders[code].call (this);
}
//-----------------------------------------------------------------------------------------------------
TrianglePattern.prototype.ExpandFromCode = function (code)
{
    this.code += code;

    TrianglePattern.Expanders[code].call (this);
}
//-----------------------------------------------------------------------------------------------------
TrianglePattern.prototype.ExpandSlide = function ()
{
    var new_pattern = new Array (2 * this.size);

    for (var x = 0 ; x < 2 * this.size ; ++x)
    {
        new_pattern [x] = new Array (2 * this.size);
    }

    for (var x = 0 ; x < this.size ; ++x)
    {
        for (var y = 0 ; y < this.size ; ++y)
        {
            new_pattern [x][y] = this.pattern [x][y].Copy();
            new_pattern [this.size + x][y] = this.pattern [x][y].Copy();
            new_pattern [this.size + x][this.size + y] = this.pattern [x][y].Copy();
            new_pattern [x][this.size + y] = this.pattern [x][y].Copy();
        }
    }

    this.pattern = new_pattern;
    this.size *= 2;
}
//-----------------------------------------------------------------------------------------------------
TrianglePattern.prototype.ExpandInvert_X = function ()
{
    var new_pattern = new Array (2 * this.size);

    for (var x = 0 ; x < 2 * this.size ; ++x)
    {
        new_pattern [x] = new Array (2 * this.size);
    }

    for (var x = 0 ; x < this.size ; ++x)
    {
        for (var y = 0 ; y < this.size ; ++y)
        {
            new_pattern [x][y] = this.pattern [x][y].Copy();
            new_pattern [this.size + x][this.size + y] = this.pattern [x][y].Copy();
            new_pattern [this.size + x][y] = this.pattern [x][y].Invert();
            new_pattern [x][this.size + y] = this.pattern [x][y].Invert();
        }
    }

    this.pattern = new_pattern;
    this.size *= 2;
}
//-----------------------------------------------------------------------------------------------------
TrianglePattern.prototype.ExpandInvert = function ()
{
    this.ExpandSlide ();
    this.InvertCorners ();
}
//-----------------------------------------------------------------------------------------------------
TrianglePattern.prototype.ExpandRotate90 = function ()
{
    // The pieces and squares rotate in the same direction
    var new_pattern = new Array (2 * this.size);

    for (var x = 0 ; x < 2 * this.size ; ++x)
    {
        new_pattern [x] = new Array (2 * this.size);
    }

    var n = this.size - 1;

    for (var x = 0 ; x < this.size ; ++x)
    {
        for (var y = 0 ; y < this.size ; ++y)
        {
            var x1 = x;
            var x2 = this.size + (n - y);
            var x3 = this.size + (n - x);
            var x4 = y;
            var y1 = y;
            var y2 = x;
            var y3 = this.size + (n - y);
            var y4 = this.size + (n - x);

            new_pattern [x1][y1] = this.pattern [x][y].Copy();
            new_pattern [x2][y2] = this.pattern [x][y].Rotate90();
            new_pattern [x3][y3] = this.pattern [x][y].Rotate180();
            new_pattern [x4][y4] = this.pattern [x][y].Rotate270();
        }
    }

    this.pattern = new_pattern;
    this.size *= 2;
}
//-----------------------------------------------------------------------------------------------------
TrianglePattern.prototype.ExpandRotate180 = function ()
{
    // The pieces rotate two as the squares rotate once
    var new_pattern = new Array (2 * this.size);

    for (var x = 0 ; x < 2 * this.size ; ++x)
    {
        new_pattern [x] = new Array (2 * this.size);
    }

    var n = this.size - 1;

    for (var x = 0 ; x < this.size ; ++x)
    {
        for (var y = 0 ; y < this.size ; ++y)
        {
            var x1 = x;
            var x2 = this.size + (n - x);
            var x3 = this.size + x;
            var x4 = n - x;
            var y1 = y;
            var y2 = n - y;
            var y3 = this.size + y;
            var y4 = this.size + (n - y);

            new_pattern [x1][y1] = this.pattern [x][y].Copy();
            new_pattern [x2][y2] = this.pattern [x][y].Rotate180();
            new_pattern [x3][y3] = this.pattern [x][y].Copy();
            new_pattern [x4][y4] = this.pattern [x][y].Rotate180();
        }
    }

    this.pattern = new_pattern;
    this.size *= 2;
}
//-----------------------------------------------------------------------------------------------------
TrianglePattern.prototype.ExpandRotate270 = function ()
{
    // The pieces and squares rotate in the opposite direction
    var new_pattern = new Array (2 * this.size);

    for (var x = 0 ; x < 2 * this.size ; ++x)
    {
        new_pattern [x] = new Array (2 * this.size);
    }

    var n = this.size - 1;

    for (var x = 0 ; x < this.size ; ++x)
    {
        for (var y = 0 ; y < this.size ; ++y)
        {
            var x1 = x;
            var x2 = this.size + y;
            var x3 = this.size + (n - x);
            var x4 = n - y;
            var y1 = y;
            var y2 = n - x;
            var y3 = this.size + (n - y);
            var y4 = this.size + x;

            new_pattern [x1][y1] = this.pattern [x][y];
            new_pattern [x2][y2] = this.pattern [x][y].Rotate270();
            new_pattern [x3][y3] = this.pattern [x][y].Rotate180();
            new_pattern [x4][y4] = this.pattern [x][y].Rotate90();
        }
    }

    this.pattern = new_pattern;
    this.size *= 2;
}
//-----------------------------------------------------------------------------------------------------
TrianglePattern.prototype.ExpandReflect = function ()
{
    // Reflect in the principle axes
    var new_pattern = new Array (2 * this.size);

    for (var x = 0 ; x < 2 * this.size ; ++x)
    {
        new_pattern [x] = new Array (2 * this.size);
    }

    var n = this.size - 1;

    for (var x = 0 ; x < this.size ; ++x)
    {
        for (var y = 0 ; y < this.size ; ++y)
        {
            var x1 = x;
            var x2 = this.size + (n - x);
            var x3 = this.size + (n - x);
            var x4 = x;
            var y1 = y;
            var y2 = y;
            var y3 = this.size + (n - y);
            var y4 = this.size + (n - y);

            new_pattern [x1][y1] = this.pattern [x][y].Copy();
            new_pattern [x2][y2] = this.pattern [x][y].ReflectX();
            new_pattern [x3][y3] = this.pattern [x][y].ReflectXY();
            new_pattern [x4][y4] = this.pattern [x][y].ReflectY();
        }
    }

    this.pattern = new_pattern;
    this.size *= 2;
}    
//-----------------------------------------------------------------------------------------------------
TrianglePattern.prototype.ExpandRotate90Invert = function ()
{
    this.ExpandRotate90 ();
    this.InvertCorners ();
}    
//-----------------------------------------------------------------------------------------------------
TrianglePattern.prototype.ExpandRotate180Invert = function ()
{
    this.ExpandRotate180 ();
    this.InvertCorners ();
}    
//-----------------------------------------------------------------------------------------------------
TrianglePattern.prototype.ExpandRotate270Invert = function ()
{
    this.ExpandRotate270 ();
    this.InvertCorners ();
}    
//-----------------------------------------------------------------------------------------------------
TrianglePattern.prototype.ExpandReflectInvert = function ()
{
    this.ExpandReflect ();
    this.InvertCorners ();
}    
//-----------------------------------------------------------------------------------------------------
TrianglePattern.prototype.InvertCorners = function ()
{
    var n = this.size / 2;
    
    for (var x = 0 ; x < n ; ++x)
    {
        for (var y = 0 ; y < n ; ++y)
        {
            this.pattern [x][y] = this.pattern [x][y].Invert ();
            this.pattern [x+n][y+n] = this.pattern [x+n][y+n].Invert ();
        }
    }
}
//---------------------------------------------------------------------------------------------------------
TrianglePattern.Expanders =
{
    "A": TrianglePattern.prototype.ExpandSlide,
    "B": TrianglePattern.prototype.ExpandInvert,
    "C": TrianglePattern.prototype.ExpandRotate90,
    "D": TrianglePattern.prototype.ExpandRotate180,
    "E": TrianglePattern.prototype.ExpandRotate270,
    "F": TrianglePattern.prototype.ExpandReflect,
    "G": TrianglePattern.prototype.ExpandRotate90Invert,
    "H": TrianglePattern.prototype.ExpandRotate180Invert,
    "I": TrianglePattern.prototype.ExpandRotate270Invert,
    "J": TrianglePattern.prototype.ExpandReflectInvert,
};
//---------------------------------------------------------------------------------------------------------
TrianglePattern.prototype.toString = function()
{
    return Misc.Format ("Triangle Pattern: {0}", this.code);
}

