
var site = "";


var MAZE_ICON = "http://www.eddaardvark.co.uk/images/maze_icon.png";
var MAZE_HOMEPAGE = "http://www.eddaardvark.co.uk/v2/maze/index.html";


Show = function (what) { window.open(what,'_blank'); }


LinkDefinition = function (title, image, link, description)
{
    this.title = title;
    this.image = image;
    this.link = link;
    this.description = description;
}

var Links = [

    ["Sudoku",
         "http://www.eddaardvark.co.uk/images/sudoku.png",
         "http://www.eddaardvark.co.uk/sudoku/index.html"],

    ["Cathedral",
         "http://eddaardvark.co.uk/Neilw/cathedral/cathy2.png",
         "http://www.eddaardvark.co.uk/Neilw/cathedral/index.html"],

    ["Mazes", MAZE_ICON, MAZE_HOMEPAGE],

    ["Spirographs",
         "http://www.eddaardvark.co.uk/python_patterns/images/coloured_tn2.png",
         "http://www.eddaardvark.co.uk/python_patterns/spirograph.html"],

    ["Mandelbrot",
         "http://www.eddaardvark.co.uk/mandelbrot/images/j11m8_tn.png",
         "http://www.eddaardvark.co.uk/mandelbrots.html"],

    ["Julia Sets",
         "http://www.eddaardvark.co.uk/mandelbrot/images/jpt5_tn.png",
         "http://www.eddaardvark.co.uk/mandelbrots.html"],

    ["WebGL",
         "http://www.eddaardvark.co.uk/mandelbrot/4dimages/avi2_211_tn.png",
         "http://www.eddaardvark.co.uk/webgl.html"],

    ["Forest Fire",
         "http://www.eddaardvark.co.uk/images/forest_fire_icon.png",
         "http://www.eddaardvark.co.uk/v2/automata/forest.html"],

    ["SVG Index",
         "http://www.eddaardvark.co.uk/images/svg_icon.png",
         "http://www.eddaardvark.co.uk/svg/index.html"],

    ["Cellular Automata",
         "http://www.eddaardvark.co.uk/images/automata_icon.png",
         "http://www.eddaardvark.co.uk/v2/automata/index.html"],

    ["Butterflies",
         "http://www.eddaardvark.co.uk/images/butterfly_icon.png",
         "http://www.eddaardvark.co.uk/Neilw/gallery/butterfly/index.html"],

    ["Shape-packing",
         "http://www.eddaardvark.co.uk/images/shape_icon.png",
         "http://www.eddaardvark.co.uk/v2/shape_packer/index.html"],

    ["Circle Patterns",
         "http://www.eddaardvark.co.uk/python_patterns/images/smooth2_tn.png",
         "http://www.eddaardvark.co.uk/v2/circles/index.html"],

    ["Colouring-in",
         "http://www.eddaardvark.co.uk/colouringin/icon.png",
         "http://www.eddaardvark.co.uk/svg/colouringin/index.html"],

    ["Line Patterns",
         "http://www.eddaardvark.co.uk/python_patterns/images/TN_shrinking7.gif",
         "http://www.eddaardvark.co.uk/python_patterns/line_patterns.html"],

    ["Newton-Raphson Fractal",
         "http://www.eddaardvark.co.uk/python_patterns/images/newton_index.png",
         "http://www.eddaardvark.co.uk/v2/newton/webgl.html"],

    ["Python Source Code",
         "http://www.eddaardvark.co.uk/images/sc_icon.png",
         "http://www.eddaardvark.co.uk/python_patterns/source.html"],

    ["Doodles",
         "http://www.eddaardvark.co.uk/images/doodle_icon.png",
         "http://www.eddaardvark.co.uk/artwork/doodles/page_01.htm"],

    ["Pythagorean Triples",
         "http://www.eddaardvark.co.uk/images/triple_icon.png",
         "http://www.eddaardvark.co.uk/v2/pythagoras/index.html"],

    ["Java Applets",
         "http://www.eddaardvark.co.uk/images/java_icon.png",
         "http://www.eddaardvark.co.uk/patternindex.html"],

    ["3x + 1",
         "http://www.eddaardvark.co.uk/images/3x1_icon.png",
         "http://www.eddaardvark.co.uk/v2/t3a1/index.html"],

    ["Fibonacci Patterns",
         "http://www.eddaardvark.co.uk/fibpatterns/images/thumb12.jpg",
         "http://www.eddaardvark.co.uk/svg/fibpatterns/index.html"],

    ["Jigsaws",
         "http://www.eddaardvark.co.uk/jigsaws/jigsaw_icon.jpg",
         "http://www.eddaardvark.co.uk/jigsaws/index.html"],

    ["Affine",
         "http://www.eddaardvark.co.uk/images/afine3.jpg",
         "http://www.eddaardvark.co.uk/v2/affine/index.html"],
];


var new_links = [];

new_links.push (new LinkDefinition ("Sudoku",
        "http://www.eddaardvark.co.uk/images/sudoku.png",
        "http://www.eddaardvark.co.uk/sudoku/index.html",
        ""));

new_links.push (new LinkDefinition ("Cathedral",
         "http://eddaardvark.co.uk/Neilw/cathedral/cathy2.png",
         "http://www.eddaardvark.co.uk/Neilw/cathedral/index.html",
         ""));

new_links.push (new LinkDefinition ("Mazes", MAZE_ICON, MAZE_HOMEPAGE, ""));

new_links.push (new LinkDefinition ("Spirographs",
         "http://www.eddaardvark.co.uk/python_patterns/images/coloured_tn2.png",
         "http://www.eddaardvark.co.uk/v2/spirograph/spirograph2.html",
         ""));

new_links.push (new LinkDefinition ("Mandelbrot",
         "http://www.eddaardvark.co.uk/mandelbrot/images/j11m8_tn.png",
         "http://www.eddaardvark.co.uk/mandelbrots.html",
         ""));

new_links.push (new LinkDefinition ("Julia Sets",
         "http://www.eddaardvark.co.uk/mandelbrot/images/jpt5_tn.png",
         "http://www.eddaardvark.co.uk/mandelbrots.html",
         ""));

new_links.push (new LinkDefinition ("WebGL",
         "http://www.eddaardvark.co.uk/mandelbrot/4dimages/avi2_211_tn.png",
         "http://www.eddaardvark.co.uk/webgl.html",
         ""));

new_links.push (new LinkDefinition ("Forest Fire",
         "http://www.eddaardvark.co.uk/images/forest_fire_icon.png",
         "http://www.eddaardvark.co.uk/v2/automata/forest.html",
         ""));

new_links.push (new LinkDefinition ("SVG Index",
         "http://www.eddaardvark.co.uk/images/svg_icon.png",
         "http://www.eddaardvark.co.uk/svg/index.html",
         ""));

new_links.push (new LinkDefinition ("Cellular Automata",
         "http://www.eddaardvark.co.uk/images/automata_icon.png",
         "http://www.eddaardvark.co.uk/v2/automata/index.html",
         ""));

new_links.push (new LinkDefinition ("Butterflies",
         "http://www.eddaardvark.co.uk/images/butterfly_icon.png",
         "http://www.eddaardvark.co.uk/Neilw/gallery/butterfly/index.html",
         ""));

new_links.push (new LinkDefinition ("Shape-packing",
         "http://www.eddaardvark.co.uk/images/shape_icon.png",
         "http://www.eddaardvark.co.uk/v2/shape_packer/index.html",
         ""));

new_links.push (new LinkDefinition ("Circle Patterns",
         "http://www.eddaardvark.co.uk/python_patterns/images/smooth2_tn.png",
         "http://www.eddaardvark.co.uk/v2/circles/index.html",
         ""));

new_links.push (new LinkDefinition ("Colouring-in",
         "http://www.eddaardvark.co.uk/colouringin/icon.png",
         "http://www.eddaardvark.co.uk/colouringin/index.html",
         ""));

new_links.push (new LinkDefinition ("Line Patterns",
         "http://www.eddaardvark.co.uk/python_patterns/images/TN_shrinking7.gif",
         "http://www.eddaardvark.co.uk/python_patterns/line_patterns.html",
         ""));

new_links.push (new LinkDefinition ("Newton-Raphson Fractal",
         "http://www.eddaardvark.co.uk/python_patterns/images/newton_index.png",
         "http://www.eddaardvark.co.uk/v2/newton/webgl.html",
         ""));

new_links.push (new LinkDefinition ("Python Source Code",
         "http://www.eddaardvark.co.uk/images/sc_icon.png",
         "http://www.eddaardvark.co.uk/python_patterns/source.html",
         ""));

new_links.push (new LinkDefinition ("Doodles",
         "http://www.eddaardvark.co.uk/images/doodle_icon.png",
         "http://www.eddaardvark.co.uk/artwork/doodles/page_01.htm",
         ""));

new_links.push (new LinkDefinition ("Pythagorean Triples",
         "http://www.eddaardvark.co.uk/images/triple_icon.png",
         "http://www.eddaardvark.co.uk/v2/pythagoras/index.html",
         ""));

new_links.push (new LinkDefinition ("Java Applets",
         "http://www.eddaardvark.co.uk/images/java_icon.png",
         "http://www.eddaardvark.co.uk/patternindex.html",
         ""));

new_links.push (new LinkDefinition ("3x + 1",
         "http://www.eddaardvark.co.uk/images/3x1_icon.png",
         "http://www.eddaardvark.co.uk/v2/t3a1/index.html",
         ""));

new_links.push (new LinkDefinition ("Fibonacci Patterns",
         "http://www.eddaardvark.co.uk/fibpatterns/images/thumb12.jpg",
         "http://www.eddaardvark.co.uk/svg/fibpatterns/index.html",
         ""));

new_links.push (new LinkDefinition ("Jigsaws",
         "http://www.eddaardvark.co.uk/jigsaws/jigsaw_icon.jpg",
         "http://www.eddaardvark.co.uk/jigsaws/index.html",
         ""));
		 
new_links.push (new LinkDefinition ("Affine Transformations",
         "http://www.eddaardvark.co.uk/images/afine3.jpg",
         "http://www.eddaardvark.co.uk/v2/affine/index.html",
         ""));


function ShowLinks ()
{
    var element = document.getElementById("links");

    if (element)
    {
        var text = "<h2> Links </h2> <div align=\"center\">";
        var len = Links.length;

        var indeces = [];

        for (var i = 0 ; i < len ; ++i)
        {
            indeces.push (i);
        }

        text += "<p class=\"small\">";
        text += "Twitter: <a href=\"https://twitter.com/EddAardvark\" target=\"_blank\"> @EddAardvark</a>";
        text += "<br>";
        text += "<a href=\"https://www.linkedin.com/in/eddaardvark\" target=\"_blank\"> Linked in</a>";
        text += "</p>";

        while (indeces.length > 0)
        {
            var idx = Math.floor (Math.random () * indeces.length);
            var i = indeces [idx];
            indeces.splice (idx,1);

            text += "<p class=\"small\">";
            text += "<a href=\"";
            text += site + Links [i][2];
            text += "\">";
            text += "<img border=\"1pt\" src=\"";
            text += site + Links [i][1];
            text += "\" title=\"";
            text += Links [i][0];
            text += "\" width=\"120\"/></a>";
            text += "</p><p class=\"small\">";
            text += "<a href=\"";
            text += site + Links [i][2];
            text += "\">";
            text += Links [i][0];
            text += "</a> </p>";
        }
        element.innerHTML = text;
    }
    else
    {
        alert("links element not found");
    }
}
//--------------------------------------------------------------------------------------------------------
// Builds the links into buttons
//--------------------------------------------------------------------------------------------------------
function MakeButtons ()
{
    var indeces = [];
    var len = new_links.length;

    for (var i = 0 ; i < len ; ++i)
    {
        indeces.push (i);
    }

    var text = "";

    while (indeces.length > 0)
    {
        var idx = Math.floor (Math.random () * indeces.length);
        var i = indeces [idx];
        indeces.splice (idx,1);

        text += "<button class=\"link\" onclick=\"Show('" + new_links[i].link + "')\">";
        text += "<div style=\"width:160;\">";
        text += "<p><img border=\"0\" src=\"" + new_links[i].image + "\" width=\"120\">";
        text += "<p><strong>" + new_links[i].title + "</strong>: " + new_links[i].description + "</p>";
        text += "</div></button>";
    }

    return text;
}

    // Expects an array pf LinkDefinitions
    MakeMiniLinks = function (list)
    {
        var len = list.length;
        var text = "";

        for (var i = 0 ; i < len ; ++i)
        {
            text += "<button class=\"link\" onclick=\"Show('" + list[i].link + "')\" title=\"" + list[i].description + "\">";
            text += "<p class=\"minilink\"><strong>" + list[i].title + "</strong></p>";
            text += "</div></button>";
        }

        return text;
    }
    //--------------------------------------------------------------------------------------------------------
    // Defines a link
    //--------------------------------------------------------------------------------------------------------
    LinkDefinition = function (title, image, link, description)
    {
        this.title = title;
        this.image = image;
        this.link = link;
        this.description = description;
    }



