//-------------------------------------------------------------------------------------------------
// Javascript UI Code for the symmetry patterns application
// (c) John Whitehouse 2020
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

TriangleController = function ()
{
    this.type = TrianglePattern.RECTANGLE;
    this.chelp = new CanvasHelp (pattern_image.width, pattern_image.height);
    this.custom_target = 0;
    this.custom_cells = new Array (4);

    for (var i = 0 ; i < 4 ; ++i)
    {
        this.custom_cells [i] = new TrianglePattern.Element (TriangleController.initial_tiles[i], "black");
    }
    this.expand_code = "A";
    
    seed_type.value = this.type;
    expand_type.value = this.expand_code;
    
    this.DrawSourceCells ();
    this.DrawTargetCells ();
    this.DrawColourCells ();
}

TriangleController.tile_colours = ["red", "orange", "green", "midnightblue", "cyan", "black", "maroon", "pink", "lavender", "gray"];
TriangleController.initial_tiles = [2,1,3,4];

//------------------------------------------------------------------------------------------------------------
TriangleController.prototype.CreatePattern = function ()
{
    this.picture = new TrianglePattern ();
    
    if (this.type == TrianglePattern.CUSTOM)
    {
        this.picture.MakeCustom (this.custom_cells);
    }
    else if (this.use_colours)
    {
        var colours = this.custom_cells.map (x => x.colour);
        this.picture.MakeRandom (this.type, colours);
    }
    else
    {
        this.picture.MakeRandom (this.type);
    }
}
//------------------------------------------------------------------------------------------------------------
TriangleController.prototype.SetExpand = function (select_element)
{
    this.expand_code = select_element.value;
}
//------------------------------------------------------------------------------------------------------------
TriangleController.prototype.Expand = function ()
{
    this.picture.ExpandFromCode (this.expand_code);
    this.DrawPattern (pattern_image);
}
//------------------------------------------------------------------------------------------------------------
TriangleController.prototype.DrawPattern = function (img_element)
{
    this.picture.Draw (this.chelp);        
    
    img_element.src = this.chelp.canvas.toDataURL('image/png');
    code.innerHTML = this.picture.code;
}
//------------------------------------------------------------------------------------------------------------
TriangleController.prototype.NewPattern = function ()
{   
    this.CreatePattern ();
    this.DrawPattern (pattern_image);
}

//------------------------------------------------------------------------------------------------------------
TriangleController.prototype.SetUseCustomColours = function (use_colours)
{   
    this.use_colours = use_colours;
    this.CreatePattern ();
    this.DrawPattern (pattern_image);
}

//------------------------------------------------------------------------------------------------------------
TriangleController.prototype.RandomPattern = function (depth_input)
{
    var depth = parseInt (depth_input.value);
    
    depth = Math.min (Math.max (1, depth), 7);
    
    depth_input.value = depth;
        
    this.CreatePattern ();
    
    for (var i = 0 ; i < depth ; ++i)
    {
        this.picture.Expand ();
    }
    this.DrawPattern (pattern_image);
}

//------------------------------------------------------------------------------------------------------------
TriangleController.prototype.ApplyCode = function(code_input)
{
    var code = code_input.value;
    
    this.CreatePattern ();

    for (var i = 0 ; i < code.length ; ++i)
    {
        this.picture.ExpandFromCode (code[i]);
    }
    
    this.DrawPattern (pattern_image);
}

//------------------------------------------------------------------------------------------------------------
TriangleController.prototype.SetSeedType = function (combo)
{
    this.type = combo.value;
    this.NewPattern ();
}
//------------------------------------------------------------------------------------------------------------
TriangleController.prototype.SelectTarget = function (n)
{
    if (n != this.custom_target)
    {
        var prev = this.custom_target;
        this.custom_target = n;
        this.DrawTargetCell (this.custom_target);
        this.DrawTargetCell (prev);
    }
}
//------------------------------------------------------------------------------------------------------------
TriangleController.prototype.SelectSource = function (n)
{
    this.custom_cells [this.custom_target].draw = n;
    this.DrawTargetCell (this.custom_target);
    
    if (this.type == TrianglePattern.CUSTOM)
        this.NewPattern ();    
}
//------------------------------------------------------------------------------------------------------------
TriangleController.prototype.SelectColour = function (n)
{
    this.custom_cells [this.custom_target].colour = TriangleController.tile_colours [n];
    this.DrawTargetCell (this.custom_target);
    
    if (this.type == TrianglePattern.CUSTOM)
        this.NewPattern ();    
}
//------------------------------------------------------------------------------------------------------------
TriangleController.prototype.SelectComboColour = function (combo)
{
    this.custom_cells [this.custom_target].colour = combo.value;
    this.DrawTargetCell (this.custom_target);
    
    if (this.type == TrianglePattern.CUSTOM)
        this.NewPattern ();    
}
//------------------------------------------------------------------------------------------------------------
TriangleController.prototype.DrawColourCells = function ()
{
    for (var i = 0 ; i < 10 ; ++i)
    {
        var id = "colour_" + i;
        var img = document.getElementById(id);
        var chelp = new CanvasHelp (img.width, img.height);
        
        chelp.SetBackground (TriangleController.tile_colours[i]);
        chelp.DrawFilledRect (0, 0, img.width, img.height);
        img.src = chelp.canvas.toDataURL('image/png');   
    }
}
//------------------------------------------------------------------------------------------------------------
TriangleController.prototype.DrawTargetCells = function ()
{
    for (var i = 0 ; i < 4 ; ++i)
    {
        this.DrawTargetCell (i);
    }
}
//------------------------------------------------------------------------------------------------------------
TriangleController.prototype.DrawSourceCells = function ()
{
    for (var i = 0 ; i < TrianglePattern.NUM_ELEMENTS ; ++i)
    {
        this.DrawSourceCell (i);
    }
}
//------------------------------------------------------------------------------------------------------------
TriangleController.prototype.DrawTargetCell = function (n)
{
    var id = "target_" + n;
    var img = document.getElementById(id);
    var chelp = new CanvasHelp (img.width, img.height);

    TrianglePattern.DrawElement (this.custom_cells [n], chelp, n == this.custom_target);
    
    img.src = chelp.canvas.toDataURL('image/png');    
}
//------------------------------------------------------------------------------------------------------------
TriangleController.prototype.DrawSourceCell = function (n)
{
    var id = "source_" + n;
    var img = document.getElementById(id);
    var chelp = new CanvasHelp (img.width, img.height);

    var element = new TrianglePattern.Element (n, "black");
    TrianglePattern.DrawElement (element, chelp, false);       
    
    img.src = chelp.canvas.toDataURL('image/png');    
}
//------------------------------------------------------------------------------------------------------------
// Makes a printable page from content within the page.
// Template is an element on the page that contains a comment which in turn contains a HTML page definition.
//------------------------------------------------------------------------------------------------------------
TriangleController.prototype.MakePrintable = function (template, size_def)
{
    var size = parseInt (size_def.value);
    var chelp = new CanvasHelp (size, size);

    this.picture.Draw (chelp); 

    var dataURL = chelp.canvas.toDataURL('image/png');

    var text = print_page.innerHTML;

    text = text.replace ("<!--", "");
    text = text.replace ("-->", "");
    text = text.replace ("%AUTHOR%", "www.eddaardvark.co.uk");
    text = text.replace ("%TITLE%", "A symmetry pattern: code = " + this.code);
    text = text.replace ("%WIDTH%", size);
    text = text.replace ("%HEIGHT%", size);
    text = text.replace ("%DATA_URL%", dataURL);

    var w = window.open('about:blank');
    w.document.write(text);
}





