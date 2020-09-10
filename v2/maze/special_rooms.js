//-------------------------------------------------------------------------------------------------
// Javascript Maze player, the player within a maze
// (c) John Whitehouse 2013
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

// Corridor like rooms (-1 => add a pillar)

var chooser1 = [CELL_WALL, CELL_ROOM, -1, CELL_ROOM, CELL_ROOM, -1, CELL_ROOM, CELL_WALL];
var chooser2 = [CELL_WALL, CELL_CORRIDOR, -1, CELL_CORRIDOR, CELL_WALL];

//-------------------------------------------------------------------------------------------------
// Create an item
//-------------------------------------------------------------------------------------------------
function MakeSpecialRoom (cells, floor, w, h)
{
    while (true)
    {
        switch (RandomInteger (5))
        {
            case 0:
                AddSquares (cells, floor, w, h, 1 + RandomInteger (4));
                break;
            case 1:
                AddLongHorizontalStrips (cells, floor, w, h, 2, true);
                break;
            case 2:
                AddLongHorizontalStrips (cells, floor, w, h, 2, false);
                break;
            case 3:
                AddLongVerticalStrips (cells, floor, w, h, 2, true);
                break;
            case 4:
                AddLongVerticalStrips (cells, floor, w, h, 2, true);
                break;
        }

        if (RandomInteger (2) == 0)
        {
            break;
        }
    }
}
//-------------------------------------------------------------------------------------------------
function AddLongHorizontalStrips (cells, floor, w, h, limit, is_room)
{
    var chooser = (is_room) ? chooser1 : chooser2;
    var width = chooser.length;
    var background = (is_room) ? CELL_ROOM : CELL_CORRIDOR;

    while (true)
    {
        var range = RandomRange (5, w - 10, 7);
        var x0 = range [0];
        var x1 = range [1];
        var y = 5 + RandomInteger (h - 15);

        if (x1 < x0)
        {
            var temp = x1;
            x1 = x0;
            x0 = temp;
        }

        for (var i = 0 ; i < width ; ++i)
        {
            var pos = floor * w * h + w * (y + i) + x0;
            var choice = chooser [i];
            var next_column = x0 + 2;

            for (var x = x0 ; x <= x1 ; ++x)
            {
                if (is_room && (x == x0 || x == x1))
                {
                    cells [pos].type = CELL_WALL;
                    cells [pos].special = SPECIAL_NONE;
                }
                else if (choice == -1)
                {
                    cells [pos].type = background;

                    if (x == next_column && next_column < (x1-1))
                    {
                        cells [pos].special = SPECIAL_COLUMN;
                        next_column += 2;
                    }
                    else
                    {
                        cells [pos].special = SPECIAL_NONE;
                    }
                }
                else
                {
                    cells [pos].type = choice;
                    cells [pos].special = SPECIAL_NONE;
                }

                ++pos;
            }
        }
        if (RandomInteger (limit) == 0)
        {
            break;
        }
    }
}
//-------------------------------------------------------------------------------------------------
function AddLongVerticalStrips (cells, floor, w, h, limit, is_room)
{
    var chooser = (is_room) ? chooser1 : chooser2;
    var width = chooser.length;
    var background = (is_room) ? CELL_ROOM : CELL_CORRIDOR;

    for (var k = 0 ; k < limit ; ++k)
    {
        var y0 = 3 + RandomInteger (h/2);
        var y1 = y0 + RandomInteger (h - y0 - 4);
        var x = 5 + RandomInteger (w - 15);

        for (var i = 0 ; i < width ; ++i)
        {
            var pos = floor * w * h + w * y0 + (x + i);
            var choice = chooser [i];
            var next_column = y0 + 2;

            for (var y = y0 ; y <= y1 ; ++y)
            {
                if (is_room && (y == y0 || y == y1))
                {
                    cells [pos].type = CELL_WALL;
                    cells [pos].special = SPECIAL_NONE;
                }
                else if (choice == -1)
                {
                    cells [pos].type = background;

                    if (y == next_column && next_column < (y1-1))
                    {
                        cells [pos].special = SPECIAL_COLUMN;
                        next_column += 2;
                    }
                    else
                    {
                        cells [pos].special = SPECIAL_NONE;
                    }
                }
                else
                {
                    cells [pos].type = choice;
                    cells [pos].special = SPECIAL_NONE;
                }
                pos += w;
            }
        }
        if (RandomInteger (limit) == 0)
        {
            break;
        }
    }
}
//-------------------------------------------------------------------------------------------------
function AddSquares (cells, floor, w, h, limit)
{
    for (var k = 0 ; k < limit ; ++k)
    {
        var l2 = 2 + RandomInteger (h / 4);
        var len = 2 * l2 + 1;
        var x = 6 + RandomInteger (w - 12 - len);
        var y = 6 + RandomInteger (h - 12 - len);
        var pos = floor * w * h + w * y + x;

        var pos1 = pos;
        var pos2 = pos1 + (len-1) * w;

        for (var i = 0 ; i < len ; ++i)
        {
            var type = (i == l2) ? CELL_CORRIDOR : CELL_SOLID_ROCK;
            cells [pos1].type = type;
            cells [pos2].type = type;
            pos1 += 1;
            pos2 += 1;
        }

        var pos1 = pos;
        var pos2 = pos1 + (len-1);

        for (var i = 0 ; i < len ; ++i)
        {
            var type = (i == l2) ? CELL_CORRIDOR : CELL_SOLID_ROCK;
            cells [pos1].type = type;
            cells [pos2].type = type;
            pos1 += w;
            pos2 += w;
        }

        pos += 1 + w;
        len -= 2;

        var pos1 = pos;
        var pos2 = pos1 + (len-1) * w;

        for (var i = 0 ; i < len ; ++i)
        {
            cells [pos1].type = CELL_CORRIDOR;
            cells [pos2].type = CELL_CORRIDOR;
            pos1 += 1;
            pos2 += 1;
        }

        var pos1 = pos;
        var pos2 = pos1 + (len-1);

        for (var i = 0 ; i < len ; ++i)
        {
            cells [pos1].type = CELL_CORRIDOR;
            cells [pos2].type = CELL_CORRIDOR;
            pos1 += w;
            pos2 += w;
        }
    }
}
