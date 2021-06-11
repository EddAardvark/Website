//-------------------------------------------------------------------------------------------------
// Text Equation class definition.
// (c) John Whitehouse 2014
// www.eddaardvark.co.uk
//
// An equation is a list of repeating elements applied in order
// The operators are:
//       "A.B" => Apply A followed by B.
//       "X^12" repeat X 12 times
//       "(A...B)" defines a composite entity
//       "ABC" a simple sequence of operations applied once from left to right
//
// This file implements classes for the operator types, each class implements:
//
//      Reset -         start again
//      GetNextChar -   the next character (or null if the sequence has ended)
//      Inflate -       the full character sequence
//-------------------------------------------------------------------------------------------------

// ******************************************
// ****** DOT operator: implements A.B ******
// ******************************************

function DotOperator (a, b)
{
    this.first = TextEquation.Create (a);
    this.second = TextEquation.Create (b);
    this.Reset ();
}
//-------------------------------------------------------------------------------------------------
DotOperator.prototype.Reset = function ()
{
    this.first.Reset ();
    this.second.Reset ();
}
//-------------------------------------------------------------------------------------------------
DotOperator.prototype.GetNextChar = function ()
{
    var ret = this.first.GetNextChar ();

    if (ret != null)
    {
        return ret;
    }
    return this.second.GetNextChar ();
}
//-------------------------------------------------------------------------------------------------
DotOperator.prototype.Inflate = function ()
{
    return this.first.Inflate () + this.second.Inflate ();
}

// ******************************************
// ****** EXP operator: implements X^N ******
// ******************************************

function ExpOperator (x, n)
{
    this.equation = TextEquation.Create (x);
    this.repeat = parseInt (n);
    this.current = 0;

    if (this.repeat < 1)
    {
        this.repeat = 1;
    }
}
//-------------------------------------------------------------------------------------------------
ExpOperator.prototype.Reset = function ()
{
    this.equation.Reset ();
    this.current = 0;
}
//-------------------------------------------------------------------------------------------------
ExpOperator.prototype.GetNextChar = function ()
{
    while (this.current < this.repeat)
    {
        var chr = this.equation.GetNextChar ();

        if (chr != nul)
        {
            return chr;
        }
        this.current += 1;
        this.equation.Reset ();
    }
    return null;
}
//-------------------------------------------------------------------------------------------------
ExpOperator.prototype.Inflate = function ()
{
    var ret = "";

    for (var i = 0 ; i < this.repeat ; ++i)
    {
        ret += this.equation.Inflate ();
    }
    return ret;
}

// ************************************************
// ****** Simple Sequence: implements ABC... ******
// ************************************************

function SimpleSequence (abc)
{
    this.sequence = abc;
    this.pos = 0;
}
//-------------------------------------------------------------------------------------------------
SimpleSequence.prototype.Reset = function ()
{
    this.pos = 0;
}

//-------------------------------------------------------------------------------------------------
SimpleSequence.prototype.GetNextChar = function ()
{
    if (this.pos < this.sequence.length)
    {
        var chr = this.sequence [this.pos];
        this.pos += 1;
        return chr;
    }
    return null;
}
//-------------------------------------------------------------------------------------------------
SimpleSequence.prototype.Inflate = function ()
{
    return this.sequence;
}
// *********************************
// ****** Generic constructor ******
// *********************************

function TextEquation ()
{
}

//-------------------------------------------------------------------------------------------------
TextEquation.Create = function (text)
{
    var len = text.length;

    // remove brackets

    if (text [0] == '(' && text [len-1] == ')')
    {
        text = text.substring (1, len-1);
        len = len - 2;
    }

    // Eliminate zero length terms

    if (text [0] == '.')
    {
        text = text.substring (1);
        len = len - 1;
    }

    if (text [len-1] == '.')
    {
        text = text.substring (0, len-1);
        len = len - 1;
    }

    var piece = "";
    var bracket_count = 0;

    // Look for products (A.B)

    for (var i = 0; i < len; i++)
    {
        var chr = text[i];

        if (chr == '(')
        {
            bracket_count += 1;
        }
        else if (chr == ')')
        {
            bracket_count -= 1;
        }

        if (chr == '.' && bracket_count == 0)
        {
            var piece2 = text.substring (i+1);
            return new DotOperator (piece, piece2);;
        }

        piece += chr;
    }

    // Try for exponentiation

    piece = "";

    for (var i = 0; i < len; i++)
    {
        var chr = text[i];

        if (chr == '(')
        {
            bracket_count += 1;
        }
        else if (chr == ')')
        {
            bracket_count -= 1;
        }

        if (chr == '^' && bracket_count == 0)
        {
            var piece2 = text.substring (i+1);
            return new ExpOperator (piece, piece2);;
        }

        piece += chr;
    }

    // If there is only one piece create a simple element.

    return new SimpleSequence (piece);
}
