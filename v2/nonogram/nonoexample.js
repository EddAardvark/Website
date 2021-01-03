//-------------------------------------------------------------------------------------------------
// Nonogram examples
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

// A nonogram row (set type to ROW or COL)
//-------------------------------------------------------------------------------------
NonoExample = function ()
{
}

NonoExample.map = {};
NonoExample.GetKeys = function ()
{
    var ret = [];
    for (k in NonoExample.map)
    {
        if (NonoExample.map.hasOwnProperty (k))
        {
            ret.push (k);
        }
    }
    return ret;
};

var example;

example = new NonoExample ();

example.rows = ["1", "1", "1", "", "1", "1", "1"];
example.cols = ["", "", "", "3,3", "", "", ""];
example.key = "Test 1";
example.text = 'A simple example with empty and full rows/columns';

NonoExample.map [example.key] = example;


example = new NonoExample ();

example.rows = ["3", "4", "6,1", "4,2", "5,2", "6,2", "8", "7", "4", "2", "1", "1", "4"];
example.cols = ["1", "3", "6", "8,1", "8,1", "11", "6,1", "4", "2", "3", "4", "3"];
example.key = "Small 1";
example.text = 'A small example from the <a href="http://www.nonograms.org/nonograms/i/16803" target="_blank">nonograms.org site<a/>.';

NonoExample.map [example.key] = example;

example = new NonoExample ();

example.rows = ["3", "1,1", "1,1,7,2", "1,1,2,1,1", "1,22", "1,1,1", "1,1,3,4", "1,1,4,3,9,4", "1,1,1", "1,22",
            "6,6,1,1,2", "4,6,1", "3,9", "5", "6", "6", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3"];

example.cols = ["12", "1,3", "1,11", "1,1,3", "2,1,1,2", "1,1,1,2", "1,1,1,1", "1,1,1,3,2", "1,1,7", "1,1,2,18",
            "1,1,2,18", "1,2,18", "1,7", "1,1,1,1", "1,1,2,1", "2,1,1,1", "2,1,4", "1,1,1", "1,1,1", "1,1,1", "1,1,1",
            "2,1,1", "1,1,2", "9", "2", "2", "2"];

example.key = "Medium 1";
example.text = 'A medium example from the <a href="http://www.nonograms.org/nonograms/i/15125" target="_blank">nonograms.org site<a/>.';
NonoExample.map [example.key] = example;

example = new NonoExample ();

example.rows = ["1", "1", "1", "1", "1", "1", "1", "1"];
example.cols = ["1", "1", "1", "1", "1", "1", "1", "1"];

example.key = "8 Rooks";
example.text = "Eight rooks on a chessboard (doesn't have a unique solution)";

NonoExample.map [example.key] = example;

example = new NonoExample ();

example.rows = ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"];
example.cols = ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"];

example.key = "11 Rooks";
example.text = "Eleven rooks on a 11x11 chessboard (doesn't have a unique solution)";

NonoExample.map [example.key] = example;


example = new NonoExample ();

example.rows = ["2,2", "1,2,3", "7,1", "8,1", "1,2,4", "2,3,4", "4,10", "4,3,1,2",
                "1,1,1,1,3,2", "4,2,3", "1,1,3,1", "2,2,2", "4,3", "1,7", "2,8",
                "2,9", "1,10", "1,11", "1,11", "1,10", "1,11", "1,4,4", "2,2,2,3",
                "2,1,8", "1,1,2,9", "3,1,1,2,9,8", "1,1,2,8", "2,2,4,6", "1,1,2,10",
                "3,1,2,1,10", "5,7,5", "3", "3,5", "1,7", "7"];

example.cols = ["1,1", "1,1,1", "4,1", "8,2,3", "1,2,2,2,1,6,4,1", "3,2,1,5,4,3", "5,2,1,6,1",
                "6,1,1,1,2", "2,2,1,1,1,1", "2,1,1,1,4,2,7", "1,5,2,17", "2,3,1,1,10,1,1",
                "7,3,9,2,1,2", "6,9,4,1,1", "2,12,6,1", "1,1,10,9,2", "1,1,8,9,1,1",
                "8,8,1,1", "14,2", "12,2", "6,2,2", "3,3", "1,3,3", "1,5", "1,5", "1,3",
                "1","1","1","1"
            ];

example.key = "Cat";
example.text = 'Another medium example from the <a href="http://www.nonograms.org/nonograms/i/16405" target="_blank">nonograms.org site<a/>.';

NonoExample.map [example.key] = example;





