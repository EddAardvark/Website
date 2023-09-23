//-------------------------------------------------------------------------------------------------
// Functions for managing HTML colours
//
// (c) John Whitehouse 2013 - 2019
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

function SVGColours ()
{
}

// Predefined colours

SVGColours.Colours = [];

SVGColours.Initialise = function ()
{
    for (key in SVGColours.hex_code)
    {
        if (SVGColours.hex_code.hasOwnProperty (key))
        {
            SVGColours.Colours.push (key);
        }
    }
}

// return a random colour from the named set of globally

SVGColours.RandomNamedColour = function (set)
{
    if (set)
    {
        lcname = name.toLowerCase();
        if (SVGColours.colour_set[lcname])
        {
            var n = SVGColours.colour_set[lcname];
            return SVGColours.colour_set[lcname] [Math.floor (Math.random() * n)];
        }
    }
    var n = SVGColours.Colours.length;
    return SVGColours.Colours [Math.floor (Math.random() * n)];
}
//------------------------------------------------------------------------------
// Convert RGB
//------------------------------------------------------------------------------
SVGColours.ToHTMLValue = function (r, g, b)
{
    var clr = 0x1000000 + r * 65536 + g * 256 + b;
    return "#" + clr.toString(16).substr(-6);
}
//------------------------------------------------------------------------------
// Parse a hex value to RGB: #4080ff => [64,128,255]
//------------------------------------------------------------------------------
SVGColours.RgbFromHex = function (hex)
{
    return [parseInt(hex.substr(1,2),16),parseInt(hex.substr(3,2),16),parseInt(hex.substr(5,2),16)];
}
//------------------------------------------------------------------------------
// Parse a colour name to RGB (if the colour isn't known assume it is hex)
//------------------------------------------------------------------------------
SVGColours.RgbFromName = function (name)
{
    lcname = name.toLowerCase();
    if (SVGColours.hex_code.hasOwnProperty (lcname))
    {
        return SVGColours.RgbFromHex (SVGColours.hex_code[lcname]);
    }
    return SVGColours.RgbFromHex (name);
}
//------------------------------------------------------------------------------
// Blend two colours
//------------------------------------------------------------------------------
SVGColours.Blend = function (start_colour, end_colour, fraction1)
{
    var c1 = SVGColours.RgbFromName (start_colour);
    var c2 = SVGColours.RgbFromName (end_colour);
    var f2 = 1 - fraction1;

    var r = Math.floor (c1 [0] * fraction1 + c2[0] * f2);
    var g = Math.floor (c1 [1] * fraction1 + c2[1] * f2);
    var b = Math.floor (c1 [2] * fraction1 + c2[2] * f2);

    return SVGColours.ToHTMLValue (r, g, b);
}

//------------------------------------------------------------------------------
// Blend from a list of colours, fraction is in the range 0-1
//------------------------------------------------------------------------------
SVGColours.MultiBlend = function (colours, fraction)
{
    if (colours.length < 1)
    {
        return black;
    }
    if (colours.length < 2)
    {
        return colours [0];
    }
    if (colours.length < 3)
    {
        return SVGColours.Blend (colours [1], colours[0], fraction);
    }
    
    var f = fraction * (colours.length -1);
    var idx1 = Math.floor (f);
    
    if (idx1 >= colours.length - 1) return colours [colours.length - 1];
    
    var factor = f - idx1;
    var idx2 = idx1+1;
    
    return SVGColours.Blend (colours [idx2], colours[idx1], factor);
}    
//------------------------------------------------------------------------------
// Blend two colours (as RGB triplets: [R,G,B])
//------------------------------------------------------------------------------
SVGColours.BlendRGB = function (c1, c2, fraction1)
{
    var f2 = 1 - fraction1;

    var r = Math.floor (c1 [0] * fraction1 + c2[0] * f2);
    var g = Math.floor (c1 [1] * fraction1 + c2[1] * f2);
    var b = Math.floor (c1 [2] * fraction1 + c2[2] * f2);

    return SVGColours.ToHTMLValue (r, g, b);
}
//------------------------------------------------------------------------------
// Create a colour map by blending two colours
//------------------------------------------------------------------------------
SVGColours.CreateColourRange = function (start_colour, end_colour, num_colours)
{
    if (! num_colours || num_colours < 2)
    {
        return [start_colour];
    }

    var c1 = SVGColours.RgbFromName (start_colour);
    var c2 = SVGColours.RgbFromName (end_colour);
    var ret = new Array (num_colours);
    var d = 1 / (num_colours - 1);
    
    for (var i = 0 ; i < num_colours ; ++i)
    {
        ret [i] = SVGColours.BlendRGB (c1, c2, i * d);
    }
    
    return ret;
}

SVGColours.hex_code = {};

SVGColours.hex_code['fuchsia'] = '#FF0080';
SVGColours.hex_code['red'] = '#FF0000';
SVGColours.hex_code['black'] = '#000000';
SVGColours.hex_code['navy'] = '#000080';
SVGColours.hex_code['darkblue'] = '#00008B';
SVGColours.hex_code['mediumblue'] = '#0000CD';
SVGColours.hex_code['blue'] = '#0000FF';
SVGColours.hex_code['darkgreen'] = '#006400';
SVGColours.hex_code['green'] = '#008000';
SVGColours.hex_code['teal'] = '#008080';
SVGColours.hex_code['darkcyan'] = '#008B8B';
SVGColours.hex_code['deepskyblue'] = '#00BFFF';
SVGColours.hex_code['darkturquoise'] = '#00CED1';
SVGColours.hex_code['mediumspringgreen'] = '#00FA9A';
SVGColours.hex_code['lime'] = '#00FF00';
SVGColours.hex_code['springgreen'] = '#00FF7F';
SVGColours.hex_code['cyan'] = '#00FFFF';
SVGColours.hex_code['aqua'] = '#00FFFF';
SVGColours.hex_code['midnightblue'] = '#191970';
SVGColours.hex_code['dodgerblue'] = '#1E90FF';
SVGColours.hex_code['lightseagreen'] = '#20B2AA';
SVGColours.hex_code['forestgreen'] = '#228B22';
SVGColours.hex_code['seagreen'] = '#2E8B57';
SVGColours.hex_code['darkslategray'] = '#2F4F4F';
SVGColours.hex_code['darkslategrey'] = '#2F4F4F';
SVGColours.hex_code['limegreen'] = '#32CD32';
SVGColours.hex_code['mediumseagreen'] = '#3CB371';
SVGColours.hex_code['turquoise'] = '#40E0D0';
SVGColours.hex_code['royalblue'] = '#4169E1';
SVGColours.hex_code['steelblue'] = '#4682B4';
SVGColours.hex_code['darkslateblue'] = '#483D8B';
SVGColours.hex_code['mediumturquoise'] = '#48D1CC';
SVGColours.hex_code['indigo'] = '#4B0082';
SVGColours.hex_code['darkolivegreen'] = '#556B2F';
SVGColours.hex_code['cadetblue'] = '#5F9EA0';
SVGColours.hex_code['cornflowerblue'] = '#6495ED';
SVGColours.hex_code['mediumaquamarine'] = '#66CDAA';
SVGColours.hex_code['dimgrey'] = '#696969';
SVGColours.hex_code['dimgray'] = '#696969';
SVGColours.hex_code['slateblue'] = '#6A5ACD';
SVGColours.hex_code['olivedrab'] = '#6B8E23';
SVGColours.hex_code['slategrey'] = '#708090';
SVGColours.hex_code['slategray'] = '#708090';
SVGColours.hex_code['lightslategray'] = '#778899';
SVGColours.hex_code['lightslategrey'] = '#778899';
SVGColours.hex_code['mediumslateblue'] = '#7B68EE';
SVGColours.hex_code['lawngreen'] = '#7CFC00';
SVGColours.hex_code['chartreuse'] = '#7FFF00';
SVGColours.hex_code['aquamarine'] = '#7FFFD4';
SVGColours.hex_code['maroon'] = '#800000';
SVGColours.hex_code['purple'] = '#800080';
SVGColours.hex_code['olive'] = '#808000';
SVGColours.hex_code['gray'] = '#808080';
SVGColours.hex_code['grey'] = '#808080';
SVGColours.hex_code['skyblue'] = '#87CEEB';
SVGColours.hex_code['lightskyblue'] = '#87CEFA';
SVGColours.hex_code['blueviolet'] = '#8A2BE2';
SVGColours.hex_code['darkred'] = '#8B0000';
SVGColours.hex_code['darkmagenta'] = '#8B008B';
SVGColours.hex_code['saddlebrown'] = '#8B4513';
SVGColours.hex_code['darkseagreen'] = '#8FBC8F';
SVGColours.hex_code['lightgreen'] = '#90EE90';
SVGColours.hex_code['mediumpurple'] = '#9370DB';
SVGColours.hex_code['darkviolet'] = '#9400D3';
SVGColours.hex_code['palegreen'] = '#98FB98';
SVGColours.hex_code['darkorchid'] = '#9932CC';
SVGColours.hex_code['yellowgreen'] = '#9ACD32';
SVGColours.hex_code['sienna'] = '#A0522D';
SVGColours.hex_code['brown'] = '#A52A2A';
SVGColours.hex_code['darkgray'] = '#A9A9A9';
SVGColours.hex_code['darkgrey'] = '#A9A9A9';
SVGColours.hex_code['lightblue'] = '#ADD8E6';
SVGColours.hex_code['greenyellow'] = '#ADFF2F';
SVGColours.hex_code['paleturquoise'] = '#AFEEEE';
SVGColours.hex_code['lightsteelblue'] = '#B0C4DE';
SVGColours.hex_code['powderblue'] = '#B0E0E6';
SVGColours.hex_code['firebrick'] = '#B22222';
SVGColours.hex_code['darkgoldenrod'] = '#B8860B';
SVGColours.hex_code['mediumorchid'] = '#BA55D3';
SVGColours.hex_code['rosybrown'] = '#BC8F8F';
SVGColours.hex_code['darkkhaki'] = '#BDB76B';
SVGColours.hex_code['silver'] = '#C0C0C0';
SVGColours.hex_code['mediumvioletred'] = '#C71585';
SVGColours.hex_code['indianred'] = '#CD5C5C';
SVGColours.hex_code['peru'] = '#CD853F';
SVGColours.hex_code['chocolate'] = '#D2691E';
SVGColours.hex_code['tan'] = '#D2B48C';
SVGColours.hex_code['lightgray'] = '#D3D3D3';
SVGColours.hex_code['lightgrey'] = '#D3D3D3';
SVGColours.hex_code['thistle'] = '#D8BFD8';
SVGColours.hex_code['orchid'] = '#DA70D6';
SVGColours.hex_code['goldenrod'] = '#DAA520';
SVGColours.hex_code['palevioletred'] = '#DB7093';
SVGColours.hex_code['crimson'] = '#DC143C';
SVGColours.hex_code['gainsboro'] = '#DCDCDC';
SVGColours.hex_code['plum'] = '#DDA0DD';
SVGColours.hex_code['burlywood'] = '#DEB887';
SVGColours.hex_code['lightcyan'] = '#E0FFFF';
SVGColours.hex_code['lavender'] = '#E6E6FA';
SVGColours.hex_code['darksalmon'] = '#E9967A';
SVGColours.hex_code['violet'] = '#EE82EE';
SVGColours.hex_code['palegoldenrod'] = '#EEE8AA';
SVGColours.hex_code['lightcoral'] = '#F08080';
SVGColours.hex_code['khaki'] = '#F0E68C';
SVGColours.hex_code['aliceblue'] = '#F0F8FF';
SVGColours.hex_code['honeydew'] = '#F0FFF0';
SVGColours.hex_code['azure'] = '#F0FFFF';
SVGColours.hex_code['sandybrown'] = '#F4A460';
SVGColours.hex_code['wheat'] = '#F5DEB3';
SVGColours.hex_code['beige'] = '#F5F5DC';
SVGColours.hex_code['whitesmoke'] = '#F5F5F5';
SVGColours.hex_code['mintcream'] = '#F5FFFA';
SVGColours.hex_code['ghostwhite'] = '#F8F8FF';
SVGColours.hex_code['salmon'] = '#FA8072';
SVGColours.hex_code['antiquewhite'] = '#FAEBD7';
SVGColours.hex_code['linen'] = '#FAF0E6';
SVGColours.hex_code['lightgoldenrodyellow'] = '#FAFAD2';
SVGColours.hex_code['oldlace'] = '#FDF5E6';
SVGColours.hex_code['magenta'] = '#FF00FF';
SVGColours.hex_code['deeppink'] = '#FF1493';
SVGColours.hex_code['orangered'] = '#FF4500';
SVGColours.hex_code['tomato'] = '#FF6347';
SVGColours.hex_code['hotpink'] = '#FF69B4';
SVGColours.hex_code['coral'] = '#FF7F50';
SVGColours.hex_code['darkorange'] = '#FF8C00';
SVGColours.hex_code['lightsalmon'] = '#FFA07A';
SVGColours.hex_code['orange'] = '#FFA500';
SVGColours.hex_code['lightpink'] = '#FFB6C1';
SVGColours.hex_code['pink'] = '#FFC0CB';
SVGColours.hex_code['gold'] = '#FFD700';
SVGColours.hex_code['peachpuff'] = '#FFDAB9';
SVGColours.hex_code['navajowhite'] = '#FFDEAD';
SVGColours.hex_code['moccasin'] = '#FFE4B5';
SVGColours.hex_code['bisque'] = '#FFE4C4';
SVGColours.hex_code['mistyrose'] = '#FFE4E1';
SVGColours.hex_code['blanchedalmond'] = '#FFEBCD';
SVGColours.hex_code['papayawhip'] = '#FFEFD5';
SVGColours.hex_code['lavenderblush'] = '#FFF0F5';
SVGColours.hex_code['seashell'] = '#FFF5EE';
SVGColours.hex_code['cornsilk'] = '#FFF8DC';
SVGColours.hex_code['lemonchiffon'] = '#FFFACD';
SVGColours.hex_code['floralwhite'] = '#FFFAF0';
SVGColours.hex_code['snow'] = '#FFFAFA';
SVGColours.hex_code['yellow'] = '#FFFF00';
SVGColours.hex_code['lightyellow'] = '#FFFFE0';
SVGColours.hex_code['ivory'] = '#FFFFF0';
SVGColours.hex_code['white'] = '#FFFFFF';

SVGColours.Initialise ();

// As defined on https://en.wikipedia.org/wiki/Web_colors

SVGColours.colour_set = {};

SVGColours.colour_set ["pink"] = ["Pink", "LightPink", "HotPink", "DeepPink", "PaleVioletRed", "MediumVioletRed"];
SVGColours.colour_set ["red"] = ["LightSalmon", "Salmon", "DarkSalmon", "LightCoral", "IndianRed", "Crimson", "Firebrick", "DarkRed", "Red"];
SVGColours.colour_set ["orange"] = ["OrangeRed", "Tomato", "Coral", "DarkOrange", "Orange"];
SVGColours.colour_set ["yellow"] = ["Yellow", "LightYellow", "LemonChiffon", "LightGoldenrodYellow", "PapayaWhip", "Moccasin", "PeachPuff",
                                        "PaleGoldenrod", "Khaki", "DarkKhaki", "Gold"];
SVGColours.colour_set ["brown"] = ["Cornsilk", "BlanchedAlmond", "Bisque", "NavajoWhite", "Wheat", "Burlywood", "Tan", "RosyBrown", "SandyBrown",
                                        "Goldenrod", "DarkGoldenrod", "Peru", "Chocolate", "SaddleBrown", "Sienna", "Brown", "Maroon"];
SVGColours.colour_set ["green"] = ["DarkOliveGreen", "Olive", "OliveDrab", "YellowGreen", "LimeGreen", "Lime", "LawnGreen", "Chartreuse",
                                        "GreenYellow", "SpringGreen", "MediumSpringGreen", "LightGreen", "PaleGreen", "DarkSeaGreen",
                                        "MediumAquamarine", "MediumSeaGreen", "SeaGreen", "ForestGreen", "Green", "DarkGreen"];
SVGColours.colour_set ["cyan"] = ["Aqua", "Cyan", "LightCyan", "PaleTurquoise", "Aquamarine", "Turquoise", "MediumTurquoise", "DarkTurquoise",
                                        "LightSeaGreen", "CadetBlue", "DarkCyan", "Teal"];
SVGColours.colour_set ["blue"] = ["LightSteelBlue", "PowderBlue", "LightBlue", "SkyBlue", "LightSkyBlue", "DeepSkyBlue", "DodgerBlue",
                                        "CornflowerBlue", "SteelBlue", "RoyalBlue", "Blue", "MediumBlue", "DarkBlue", "Navy", "MidnightBlue"];
SVGColours.colour_set ["purple"] = ["Lavender", "Thistle", "Plum", "Violet", "Orchid", "Fuchsia", "Magenta", "MediumOrchid", "MediumPurple",
                                        "BlueViolet", "DarkViolet", "DarkOrchid", "DarkMagenta", "Purple", "Indigo", "DarkSlateBlue",
                                        "SlateBlue", "MediumSlateBlue"];
SVGColours.colour_set ["white"] = ["White", "Snow", "Honeydew", "MintCream", "Azure", "AliceBlue", "GhostWhite", "WhiteSmoke", "Seashell",
                                        "Beige", "OldLace", "FloralWhite", "Ivory", "AntiqueWhite", "Linen", "LavenderBlush", "MistyRose"];
SVGColours.colour_set ["grey"] = ["Gainsboro", "LightGray", "Silver", "DarkGray", "Gray", "DimGray", "LightSlateGray", "SlateGray",
                                        "DarkSlateGray", "Black"];

SVGColours.colour_sets = ["pink", "red", "orange", "pink", "yellow", "brown", "green", "cyan", "blue", "purple", "white", "grey"];

//-----------------------------------------------------------------------------------------------------------------
// Add the full set of colours into a select control
//-----------------------------------------------------------------------------------------------------------------
SVGColours.AddColours = function (select, inc_transparent)
{
    if (inc_transparent)
    {
        var option = document.createElement("option");
    
        option.text = "transparent";
        option.value = "transparent";
        select.add(option);
    }

    var keys = Object.getOwnPropertyNames (SVGColours.hex_code);
    keys.sort ();
    
    for (var key in keys)
    {
        var option = document.createElement("option");
        
        option.text = keys[key];
        option.value = keys[key];
        select.add(option);
    }
}












