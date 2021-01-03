// ================================================================================================
// Binds a variable to an edit box
// (c) John Whitehouse 2019
// www.eddaardvark.co.uk
// ================================================================================================

UIValue = function (textbox, value, parser)
{
	this.textbox = textbox;
	this.value = value;
	this.parser = parser;
    this.decimals = 5;

	this.textbox.value = this.value;
}
//------------------------------------------------------------------------------------------------------------------------------------
UIValue.prototype.Get = function ()
{
	return this.parser (this);
}
//------------------------------------------------------------------------------------------------------------------------------------
UIValue.prototype.Set = function (value)
{
	this.textbox.value = value;
	this.Get ();
}
//------------------------------------------------------------------------------------------------------------------------------------
UIValue.Text = function (uivalue)
{
	return uivalue.textbox.value;
}
//------------------------------------------------------------------------------------------------------------------------------------
UIValue.Int = function (uivalue)
{
	var x = parseInt(uivalue.textbox.value);
	if (! isNaN (x)) uivalue.value = x;
	uivalue.textbox.value = uivalue.value;
	return uivalue.value;
}	
//------------------------------------------------------------------------------------------------------------------------------------
UIValue.Float = function (uivalue)
{
	var x = parseFloat(uivalue.textbox.value);
	if (! isNaN (x)) uivalue.value = x;
	uivalue.textbox.value = uivalue.value;
	return uivalue.value;
}
//------------------------------------------------------------------------------------------------------------------------------------

UIValue.prototype.toString = function()
{
    return "UIValue: ID = " + this.textbox + ", Text = " + this.textbox.value
				 + ", Parser = " + this.parser + ", Value = " + this.value ;
}