//-------------------------------------------------------------------------------------------------
// Javascript pupup window cell class definition. Used for popup windows in the maze.
// (c) John Whitehouse 2013
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
// Popup for the maze application
//-------------------------------------------------------------------------------------------------

function MazePopup () { }

MazePopup.has_popup = false;
MazePopup.popup_element;

//-------------------------------------------------------------------------------------------------
MazePopup.Initialise = function (element_name)
{
    MazePopup.popup_element = document.getElementById(element_name);
}
//-------------------------------------------------------------------------------------------------
// Act on a key stroke, returns true if the key id processed, false if it isn't.
//-------------------------------------------------------------------------------------------------
MazePopup.HandleKey = function (key)
{
    if (MazePopup.has_popup)
    {
        switch (key)
        {
            case Popup.KEY_ESCAPE:
                MazePopup.Hide ();
                return true;

            case Popup.KEY_ENTER:
                MazePopup.Hide ();
                return true;
        }
    }

    return false;
}
//-------------------------------------------------------------------------------------------------
MazePopup.Replace = function (text)
{
    if (MazePopup.has_popup)
    {
        var dialog = "<div class=\"box\"><div class=\"margins\">";

        dialog += text;
        dialog += "<button OnClick=\"MazePopup.Hide(false);\">Close</button>";
        dialog += "</div></div>";

        MazePopup.popup_element.innerHTML = dialog;
    }
}
//-------------------------------------------------------------
MazePopup.Show = function (text)
{
    if (! MazePopup.has_popup)
    {
        MazePopup.has_popup = true;
        MazePopup.Replace (text);
        MazePopup.popup_element.style.visibility = "visible";
    }
}
//-------------------------------------------------------------
MazePopup.Hide = function ()
{
    if (MazePopup.has_popup)
    {
        MazePopup.popup_element.style.visibility = "hidden";
        MazePopup.has_popup = false;
    }
}
//-------------------------------------------------------------------------------------------------
// Generic popup
//-------------------------------------------------------------------------------------------------
Popup = function (element_name)
{
    this.popup_element = document.getElementById(element_name);
    this.has_popup = false;
}

Popup.KEY_ENTER = 13;
Popup.KEY_ESCAPE = 27;

//-------------------------------------------------------------------------------------------------
// Act on a key stroke, returns true if the key id processed, false if it isn't.
//-------------------------------------------------------------------------------------------------
Popup.prototype.HandleKey = function (key)
{
    if (this.has_popup)
    {
        switch (key)
        {
            case Popup.KEY_ESCAPE:
                this.Hide ();
                return true;

            case Popup.KEY_ENTER:
                this.Hide ();
                return true;
        }
    }

    return false;
}
//-------------------------------------------------------------------------------------------------
Popup.prototype.Replace = function (text, closefun)
{
    if (this.has_popup)
    {
        var dialog = "";

        dialog += text;
        
        if (closefun)
        {
            Popup.closefun = closefun;
            dialog += "<button OnClick=\"Popup.closefun();\">Close</button>";
        }

        this.popup_element.innerHTML = dialog;
    }
}
//-------------------------------------------------------------
Popup.prototype.Show = function (text, closefun)
{
    if (! this.has_popup)
    {
        this.has_popup = true;
        this.Replace (text, closefun);
        this.popup_element.style.visibility = "visible";
    }
}
//-------------------------------------------------------------
Popup.prototype.Hide = function ()
{
    if (this.has_popup)
    {
        this.popup_element.style.visibility = "hidden";
        this.has_popup = false;
    }
}



