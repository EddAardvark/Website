//-------------------------------------------------------------------------------------------------
// Functions to create a tab-bar that manages the visibility of a single element from a set os
// possibilities.
//
// Contains two classes
//     TabButton - One of the buttons used to render the tab bar
//     TabBar - The tab bar
//
// (c) John Whitehouse 2017-2019
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

// A button in a tab bar menu

TabButton = function (tab_id, button_id, control, closed_text, open_text)
{
    this.tab_id = tab_id;
    this.button_id = button_id;
    this.control = control;
    this.closed_text = closed_text;
    this.open_text = open_text;
}

TabButton.CLASS = "clickable";

// Returns the html that will render this button on a HTML page

TabButton.prototype.toHTML = function ()
{
    var html = "<button";

    html += " id=\"" + this.button_id + "\"";
    html += " onclick=\"TabBar.FUNCTION(" + this.tab_id + ",'" + this.button_id + "')\"";

    if (TabButton.CLASS) html += " class=\"" + TabButton.CLASS + "\"";

    html += "\>" + this.closed + "</button>";

    return html;
}

// Render as a string

TabButton.prototype.toString = function ()
{
    return "TabButton: " + this.button_id;
}
//------------------------------------------------------------------------------------------------------
// TabBar - A collection of tab buttons. This tab bar manages a set of controls, showing the one that
// relates to the clicked button and hiding all the others.
//------------------------------------------------------------------------------------------------------
TabBar = function ()
{
    this.buttons = {};
    this.button_ids = [];
    this.current_id = null;

    this.tab_bar_index = TabBar.tab_bars.length;
    TabBar.tab_bars.push (this);
}

// Styles for open and closed tabs

TabBar.OPEN_STYLE = null;
TabBar.CLOSED_STYLE = null;

// Function called by the tab bar buttons

TabBar.FUNCTION = function (tab_bar_id, button_id)
{
    TabBar.tab_bars [tab_bar_id].onButtonClick (button_id);
}

// Allows us to have multiple tab bars on the same page

TabBar.tab_bars = [];

// Add a button
//  button_id - identifies the button, should be unique within the tab bar
//  control - the id of the page element to hide or display
//  closed_text - the text to display while the control is invisible
//  open_text - the text to display while the control is visible

TabBar.prototype.AddButton = function (button_id, control, closed_text, open_text)
{
    var b = new TabButton (this.tab_bar_index, button_id, control, closed_text, open_text);

    this.button_ids.push (b.button_id);
    this.buttons [b.button_id] = b;
}

// Show this tab-bar. 'wher' defines the element where it will be displayed

TabBar.prototype.Show = function (where)
{
    var elem = document.getElementById(where);

    if (elem)
    {
        var text = "";

        for (idx in this.button_ids)
        {
            text += this.buttons[this.button_ids [idx]].toHTML ();
        }
        elem.innerHTML = text;
    }
}

TabBar.prototype.SetInitialTab = function (button_id)
{
    for (idx in this.button_ids)
    {
        this.HideSection (this.button_ids [idx]);
    }

    if (button_id)
    {
        this.ShowSection (button_id);
    }
}

// Called when one of the buttons is clicked

TabBar.prototype.onButtonClick = function (id)
{
    var button = this.buttons [id];

    // Already visible - hide it

    if (this.current_id == button.button_id)
    {
        this.HideSection (button.button_id);
        return;
    }

    // Otherwise hide what is currently visible and show the new section

    if (this.current_id)
    {
        this.HideSection (this.current_id);
    }

    this.ShowSection (button.button_id);
}
TabBar.prototype.ShowSection = function (button_id)
{
    var button = this.buttons [button_id];

    var elem = document.getElementById(button.control);
    var btn = document.getElementById(button.button_id);

    if (elem)
    {
        elem.style.display = "block";
        this.current_id = button_id;
    }

    if (btn)
    {
        btn.innerHTML  = button.open_text;

        if (TabBar.OPEN_STYLE)
        {
            btn.setAttribute('style', TabBar.OPEN_STYLE);
        }
        else
        {
            btn.setAttribute('style', "");
        }
    }
}
TabBar.prototype.HideSection = function (button_id)
{
    var button = this.buttons [button_id];

    var elem = document.getElementById(button.control);
    var btn = document.getElementById(button.button_id);

    if (elem)
    {
        elem.style.display = "none";
        this.current_id = null;
    }
    if (btn)
    {
        btn.innerHTML  = button.closed_text;

        if (TabBar.OPEN_STYLE)
        {
            btn.setAttribute('style', TabBar.CLOSED_STYLE);
        }
        else
        {
            btn.setAttribute('style', "");
        }
    }
}

// Called if this tab-bar needs to be rendered as a string

TabBar.prototype.toString = function ()
{
    return "TabBar: " + this.buttons.length + " buttons";
}
