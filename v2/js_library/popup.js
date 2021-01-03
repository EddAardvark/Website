//-------------------------------------------------------------------------------------------------
// Javascript pupup window cell class definition. Used for popup windows in the maze.
// (c) John Whitehouse 2013
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

function MazePopup () { }

var KEY_ENTER = 13;
var KEY_ESCAPE = 27;

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
            case KEY_ESCAPE:
                MazePopup.Hide ();
                return true;

            case KEY_ENTER:
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
