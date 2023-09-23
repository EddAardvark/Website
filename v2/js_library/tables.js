//-------------------------------------------------------------------------------------------------
// Functions for working with tables
// (c) John Whitehouse 2022
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

JWTable = function ()
{
    this.corner = "X";
    this.headings = []; // Array of [text,class] entries.
    this.rows = [];     // Array of  [text,class] entries.
    this.cells = [];    
    this.style = null;
}

JWTable.prototype.Render = function ()
{
    // Expects a table of width by height, organised into rows, each element has 3 components:
    // [Value, Is header, Style]. Style may be null.
    
    var ret = "<table ";
    
    if (this.style)
    {
        ret += "class=\"" + this.style + "\"";
    }

// Headings
    
    ret += "><tr>";    
    ret += "<th>" + this.corner + "</th>";
    
    for (var idx in this.headings)
    {
        ret += "<th ";
        
        if (this.headings[idx][1])
        {
            ret += "class=\"" + this.headings[idx][1] + "\"";
        }
        ret += ">" + this.headings[idx][0] + "</th>";
    }
    ret += "</tr>";
    
// Body

    var idx = 0;
    
    for (var row in this.rows)
    {
        ret += "<tr><th ";
        
        if (this.rows[row][1])
        {
            ret += "class=\"" + this.rows[row][1] + "\"";
        }
        ret += ">" + this.rows[row][0] + "</th>";
        
        for (var col in this.headings)
        {
            ret += "<td";
            
            if (this.cells [idx][1]) ret += " class=\"" + this.cells [idx][1] + "\"";
            
            ret += ">" + this.cells [idx][0];
            ret += "</td>";
            ++idx;
        }
        ret += "</tr>";
    }
    
    ret += "</table>";
    return ret;    
    
}

// Table defined by '|' and '||' separators

JWSimpleTable = function ()
{
    this.td_class = null;
    this.th_class = null;
    this.tab_class = null;
    this.lines = [];
}
JWSimpleTable.FromText = function (text)
{
    var ret = new JWSimpleTable ();

    if (text)
    {        
        ret.lines = text.split ("\n");
    }

    return ret;
}
// Expands the text in an element, operates on innerHTML so should only be called for elements that contains
// literal text 
JWSimpleTable.ExpandElement = function (element)
{
    var tab = JWSimpleTable.FromText (element.innerHTML);
    element.innerHTML = tab.ToHTML (tab);
}

JWSimpleTable.prototype.ToHTML = function ()
{
    var ret = "";
    if (this.tab_class)
        ret += '<table class="' + this.tab_class + '">';
    else
        ret += "<table>";
    
    for (var idx in this.lines)
    {
        if (this.lines[idx])
            ret += this.LineToHTML (this.lines[idx]);
    }
    
    return ret + "</table>";
}

JWSimpleTable.prototype.LineToHTML = function (line)
{
    var cell_type = "none";
    var cell_text = "";

    this.txt = "<tr>";
    this.mode = "start";
    this.cell_type = null;
    
    for (var i = 0 ; i < line.length ; ++i)
    {
        var ch = line.charAt (i);
        
        if (! this.literal && ch == '\\')
        {
            this.literal = true;
            continue;
        }
        
        if (this.mode == "start")
        {
            this.ContinueStart (ch);
        }
        else if (this.mode == "td")
        {
            this.ContinueTD (ch);
        }
        else if (this.mode == "th")
        {
            this.ContinueTH (ch);
        }
        else if (this.mode == "collecting")
        {
            this.ContinueCollecting (ch);
        }
        
        this.literal = false;
    }
    
    this.txt +="</tr>";
    return this.txt;
}
JWSimpleTable.prototype.ContinueStart = function (ch)
{    
    if (ch == '|' && ! this.literal)
    {
        this.cell_type = "td";
        this.mode = "td";
    }
}
JWSimpleTable.prototype.ContinueTD = function (ch)
{
    if (ch == '|' && ! this.literal)
    {
        this.cell_type = "th";
        this.mode = "th";
    }
    else
    {
        this.cell_text = ch;
        this.mode = "collecting";
    }
}
JWSimpleTable.prototype.ContinueTH = function (ch)
{
    if (ch == '|' && ! this.literal)
    {
        this.cell_text = "&nbsp;"
        this.txt += this.CellToHTML ();
        this.mode = "td";
        this.cell_type = "td";
    }
    else
    {
        this.cell_text = ch;
        this.mode = "collecting";
    }
}
JWSimpleTable.prototype.ContinueCollecting = function (ch)
{
    if (ch == '|' && ! this.literal)
    {
        this.txt += this.CellToHTML ();
        this.mode = "td";
        this.cell_type = "td";
    }
    else
    {
        this.cell_text += ch;
    }
}




JWSimpleTable.prototype.CellToHTML = function ()
{
    var cl = (this.cell_type == "td") ? this.td_class : this.th_class;
    var ret = "<" + this.cell_type;

    if (this.tab_class)
        ret += ' class="' + this.tab_class + '">';
    else
        ret += ">";
    
    ret += this.cell_text;
    ret += "</" + this.cell_type + ">";
    return ret;
}

// Table elements separated by '|' 
// table elements modified by
// {H} - heading
// {n} - Column span
// {text} - element class

JWStyledTable = function ()
{
}
JWStyledTable.Cell = function (text)
{
    this.style = null;
    this.colspan = 1;
    this.header = false;
    
    while (true)
    {
        var pos1 = text.indexOf ('{');
        
        if (pos1 < 0)
            break;
        
        var pos2 = text.indexOf ('}', pos1);

        if (pos2 < 1)
            break;
        
        if (pos2 - pos1 > 1)
        {
            var style = text.substr (pos1+1, pos2 - pos1 - 1).trim();
            
            if (style.length > 0)
            {
                if (style == "h" || style == "H")
                {
                    this.header = true;
                }
                else if ("0123456789".indexOf (style [0]) >= 0)
                {
                    this.colspan = parseInt (style);
                }
                else
                {
                    if (! this.style)
                        this.style = style;
                    else
                        this.style += (" " + style);
                }
            }
        }
        
        text = text.substr (0, pos1) + text.substr (pos2+1);
    }
    this.text = text;
}
JWStyledTable.Cell.prototype.ToText = function ()
{
    var ret = (this.header) ? "<th" : "<td";
            
    if (this.colspan > 1)
    {
        ret += " colspan=\"" + this.colspan + "\"";
    }
    
    if (this.style)
    {
        ret += " class=\"" + this.style + "\"";
    }
    
    ret += ">" + this.text;
    ret += (this.header) ? "</th>" : "</td>";
    
    return ret;
}



JWStyledTable.FromText = function (text)
{
    var ret = new JWStyledTable ();

    ret.rows = [];
        
    if (text)
    {        
        var lines = text.split ("\n");
        var row = 0;
        
        for (var idx in lines)
        {
            var line = lines[idx].trim();
            
            if (line.length > 0)
            {
                var cells = line.split ("|");
                
                ret.rows [row] = [];
                
                for (var col in cells)
                {
                    ret.rows[row][col] = new JWStyledTable.Cell (cells[col]);
                }
                ++row;
            }
        }
    }

    return ret;
}
// Expands the text in an element, operates on innerHTML so should only be called for elements that contains
// literal text 
JWStyledTable.ExpandElement = function (element)
{
    var tab = JWStyledTable.FromText (element.innerHTML);
    element.innerHTML = tab.ToHTML (tab);
}

JWStyledTable.prototype.ToHTML = function ()
{
    var ret = "";
    
    ret += "<table>";
    
    for (var row in this.rows)
    {
        ret += "<tr>";
        
        for (var col in this.rows[row])
        {
            ret += this.rows[row][col].ToText ();
        }
        ret += "</tr>";
    }
    
    return ret + "</table>";
}



