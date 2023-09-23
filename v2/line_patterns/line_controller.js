<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<meta name="Author" content="John Whitehouse">
<meta name="KeyWords" content="Python Patterns graph star interactive animation">

<script src="http://www.eddaardvark.co.uk/john.js"> </script>
<script src="../js_library/misc.js"> </script>
<script src="../js_library/canvas_helpers.js"> </script>
<script src="../js_library/colours.js"> </script>

<link rel="StyleSheet" href="http://www.eddaardvark.co.uk/jw.css" type="text/css" media="screen">
<link rel="apple-touch-icon" href="http://www.eddaardvark.co.uk/favicon.png" />
<link rel="shortcut icon" href="http://www.eddaardvark.co.uk/favicon.png" />

<title> Line Patterns </title>



<script>

    var STAR = 1;
    var GRAPH = 2;
    var POWERS = 3;
    var STAR_SPIRAL = 4;
    var STAR_ROTATE = 5;
    var POWERS_FULL = 6;
    
    Settings = function ()
    {
        this.mode = STAR;
        this.n = 5;
        this.m = 2;
        this.spf = 90;
        this.splaps = 10;
        this.rotd = 2;
        this.sf = 99;
        this.scount = 25;
        this.scol = "blue";
        this.ecol = "green";
        this.bcol = "aliceblue";
        this.cact = false;
    }

    Settings.prototype.ToJSON = function ()
    {
        return JSON.stringify (this);
    }
    
    var settings = new Settings ();
    
    OnStart = function ()
    {
        pattern_mode.value = settings.mode;
        input_n.value = settings.n;
        input_m.value = settings.m;
        input_l.value = settings.splaps;
        input_s.value = settings.spf;
        input_rot.value = settings.rotd;
        input_shr.value = settings.sf;
        input_rep.value = settings.scount;
        
        SVGColours.AddColours (s_colour);
        SVGColours.AddColours (e_colour);
        SVGColours.AddColours (b_colour);
        
        s_colour.value = settings.scol;
        e_colour.value = settings.ecol;
        b_colour.value = settings.bcol;
        use_colour.checked = settings.cact;
        
        Draw ();
    }
    // Update the pattern mode and redraw the pattern
    SetPatternMode = function ()
    {
        settings.mode = pattern_mode.value;
        Draw ();
    }

    ToggleUseColour=function()
    {
        settings.cact = use_colour.checked;
        Draw ();
    }
    
    Draw = function ()
    {
        settings.n = Math.floor (input_n.value);
        settings.m = Math.floor (input_m.value);
        settings.splaps = Math.floor (input_l.value);
        settings.spf = input_s.value;
        settings.rotd = input_rot.value;
        settings.sf = input_shr.value;
        settings.scount = Math.floor (input_rep.value);
        settings.scol = s_colour.value;
        settings.ecol = e_colour.value;
        settings.bcol = b_colour.value;
        
        if (! ParameterCheck ())
        {
            return;
        }
        
        if (settings.mode == STAR)
        {
            DrawStar (settings.n, settings.m, 480, pattern_view);
        }
        else if (settings.mode == GRAPH)
        {
            DrawGraph (settings.n, 480, pattern_view);
        }
        else if (settings.mode == POWERS)
        {            
            DrawPowers (settings.n, settings.m, 480, pattern_view);
        }
        else if (settings.mode == POWERS_FULL)
        {            
            DrawPowersFull (settings.n, settings.m, 480, pattern_view);
        }
        else if (settings.mode == STAR_SPIRAL)
        {
            DrawStarSpiral (settings.n, settings.m, 480, pattern_view);
        }
        else if (settings.mode == STAR_ROTATE)
        {
            DrawStarRotate (settings.n, settings.m, 480, pattern_view);
        }

        ref.innerHTML = settings.ToJSON();
    }
    
    ParameterCheck = function ()
    {
        if (settings.n > 1024)
        {
            Misc.Alert ("N is limited to 1024, {0} is too large", input_n.value);            
            return false;
        }
        
        if (settings.mode == STAR || settings.mode == STAR_SPIRAL || settings.mode == STAR_ROTATE)
        {
            if (settings.n < 2)
            {
                Misc.Alert ("N must be at least 2, {0} is not allowed", input_n.value);
                return false;
            }

            if (settings.m == 0)
            {
                Misc.Alert ("M can't be 0, {0} is not allowed", input_m.value);
                return false;
            }
            
            if (settings.mode == STAR_ROTATE && settings.scount < 2)
            {
                Misc.Alert ("Repeat in Shrink/Rotate must be at least 2, {0} is not allowed", input_rep.value);
                return false;
            }
        }
        else if (settings.mode == GRAPH)
        {
            if (settings.n < 2)
            {
                Misc.Alert ("N must be at least 2, {0} is not allowed", input_n.value);
                return false;
            }
        }
        else if (settings.mode == POWERS || settings.mode == POWERS_FULL)
        {
            if (settings.n < 2)
            {
                Misc.Alert ("N must be at least 2, {0} is not allowed", input_n.value);
                return false;
            }
            if (settings.m < 2)
            {
                Misc.Alert ("M can't be 0 or 1, {0} is not allowed", input_m.value);
                return false;
            }
        }
        
        return true;
    }

    PatternClick = function (event)
    {
    }
    PatternHover = function (event)
    {
    }
    
    DrawBackground = function (chelp)
    {
        chelp.SetBackground (settings.cact ? settings.bcol : "white");
        chelp.FillRect (0, 0, chelp.canvas.width, chelp.canvas.height);
    }
    
    GetPoints = function (n, r, xc, xc)
    {   
        var f =  2 * Math.PI / n;
        var points = [];
        
        for (var i = 0 ; i < n ; ++i)
        {
            var a = f * i;
            var x = xc + r * Math.sin (a);
            var y = xc - r * Math.cos (a);
            
            points [i] = [x,y];
        }
        return points;
    }
    GetColours = function (n)
    {
        if (n < 2) return [s_colour];

        var colours = [];
        
        for (var i = 0 ; i < n ; ++i)
        {
            colours [i] = (settings.cact)
                            ? SVGColours.Blend (settings.ecol, settings.scol, i/(n-1))
                            : settings.scol;
        }
        
        return colours;
    }
        
    DrawStar = function (n, m, r, img_element)
    {
        var width = Math.floor (2.1 * r);
        var xc = width / 2;
        var f =  2 * Math.PI / n;
        var colours = GetColours (n);
        var chelp = new CanvasHelp (width, width);
        var pt = 0;
        var x0 = xc;
        var y0 = xc-r;
        var count = 0;

        DrawBackground (chelp);
        
        while (true)
        {
            pt = (pt + m) % n;
            
            var a = f * pt;
            var x1 = xc + r * Math.sin (a);
            var y1 = xc - r * Math.cos (a);
            
            chelp.SetForeground (colours[count]);
            chelp.DrawLine ([x0,y0],[x1,y1]);
    
            if (pt == 0)
            {
                break;
            }
    
            x0 = x1;
            y0 = y1;
            ++count;
        }
        img_element.src = chelp.canvas.toDataURL('image/png');
    }
    
    DrawStarSpiral = function (n, m, r, img_element)
    {
        var width = Math.floor (2.1 * r);
        var xc = width / 2;
        var f =  2 * Math.PI / n;
        var count = n * settings.splaps;
        var chelp = new CanvasHelp (width, width);        
        var sfact = settings.spf / 100;
        var colours = GetColours (n);
        
        if (sfact > 1)
        {
            sfact = 1 / sfact;
        }
        
        var shrink = Math.pow (sfact, 1 / n);

        var pt = 0;
        var x0 = xc;
        var y0 = xc-r;

        DrawBackground (chelp);
        
        for (var i = 0 ; i < count ; ++i)
        {
            pt = (pt + m) % n;
            
            var a = f * pt;
            var x1 = xc + r * Math.sin (a);
            var y1 = xc - r * Math.cos (a);
            
            chelp.SetForeground (colours[i%n]);
            chelp.DrawLine ([x0,y0],[x1,y1]);
    
            x0 = x1;
            y0 = y1;
            r = r * shrink;
        }
        img_element.src = chelp.canvas.toDataURL('image/png');
    }
    
    DrawStarRotate = function (n, m, r, img_element)
    {
        var width = Math.floor (2.1 * r);
        var xc = width / 2;
        var f =  2 * Math.PI / n;
        var chelp = new CanvasHelp (width, width);        
        var sfact = settings.sf / 100;
        var delta_a = settings.rotd * Math.PI / 180;
        var angle = 0;
        var colours = GetColours (settings.scount);
        
        if (sfact > 1)
        {
            sfact = 1 / sfact;
        }

        DrawBackground (chelp);

        for (var j = 0 ; j < settings.scount ; ++j)
        {
            var pt = 0;
            var x0 = xc + r * Math.sin (angle);
            var y0 = xc - r * Math.cos (angle);
            
            chelp.SetForeground (colours[j]);
            
            while (true)
            {
                pt = (pt + m) % n;
                
                var a = angle + f * pt;
                var x1 = xc + r * Math.sin (a);
                var y1 = xc - r * Math.cos (a);
                
                chelp.DrawLine ([x0,y0],[x1,y1]);
        
                if (pt == 0)
                {
                    break;
                }
        
                x0 = x1;
                y0 = y1;
            }
            
            r = r * sfact;
            angle += delta_a;
        }
        img_element.src = chelp.canvas.toDataURL('image/png');
    }  
    
    DrawGraph = function (n, r, img_element)
    {
        var width = Math.floor (2.1 * r);
        var xc = width / 2;
        var f =  2 * Math.PI / n;        
        var chelp = new CanvasHelp (width, width);
        var n2 = Math.floor (n/2);
        var colours = GetColours (n2-1);

        DrawBackground (chelp);
        
        var points = GetPoints (n, r, xc, xc);
        
        for (var i = 1 ; i < n2; ++i)
        {
            chelp.SetForeground (colours[i-1]);
            
            for (var j = 0 ; j < n; ++j)
            {                
                chelp.DrawLine (points [j], points [(i+j)%n]);
            }
        }
        
        img_element.src = chelp.canvas.toDataURL('image/png');
    }  
    
    DrawPowers = function (n, m, r, img_element)
    {
        var width = Math.floor (2.1 * r);
        var xc = width / 2;
        var f =  2 * Math.PI / n;
        
        var chelp = new CanvasHelp (width, width);
        var pt0 = 1;

        DrawBackground (chelp);

        chelp.SetForeground (settings.scol);
        
        var visited = [];
        var points = GetPoints (n, r, xc, xc);
        
        // Only guaranteed to stop if n is prime
        
        for (var i = 0 ; i < n ; ++i)
        {
            visited [i] = false;
            chelp.DrawSpot (points[i][0], points[i][1], 4, "red");            
        }
        
        visited [1] = true;
        
        while (true)
        {
            pt = (pt0 * m) % n;
            
            chelp.DrawLine (points [pt0], points [pt]);
    
            if (visited [pt])
            {
                break;
            }
    
            visited [pt] = true;
            pt0 = pt;
        }
        img_element.src = chelp.canvas.toDataURL('image/png');
    }  
    
    DrawPowersFull = function (n, m, r, img_element)
    {
        var width = Math.floor (2.1 * r);
        var xc = width / 2;
        var n2 = Math.floor (n/2);
        var colours = GetColours (n2);
        var chelp = new CanvasHelp (width, width);

        DrawBackground (chelp);
        
        var points = GetPoints (n, r, xc, xc);
        
        // Only guaranteed to stop if n is prime
        
        for (var i = 0 ; i < n ; ++i)
        {
            chelp.DrawSpot (points[i][0], points[i][1], 4, "red");            
        }

        for (var i = 1 ; i < n ; ++i)
        {
            var pt = (i * m) % n;
            var dist = pt - i;
            if (dist < 0) dist += n;
            if (dist > n2) dist = n - dist;            
            
            chelp.SetForeground (colours[dist]);            
            chelp.DrawLine (points[i], points[pt]);
        }
        img_element.src = chelp.canvas.toDataURL('image/png');
    }  


</script>
<title>Line Based Patterns</title>
</head>

<!-- Title -->

<body onload="OnStart()">


<!-- Banner -->

  <div style="margin: auto; width: 1024px;">
     <button style="width: 180px;" class="banner clickable" onclick="Show('http://www.eddaardvark.co.uk')">
        <p> <img border="0" src="http://www.eddaardvark.co.uk/images/home.png">
        <p> <strong>Home page</strong>
     </button>

     <button class="banner">
        <h1> Line Based Patterns </h1>
        <p> Updated December 2011 </p>
     </button>

     <!-- Ads -->

      <button style="width: 260px;" class="banner">
        <script type="text/javascript"><!--
          google_ad_client = "ca-pub-3534237235440125";
          /* Small Square */
          google_ad_slot = "0024655068";
          google_ad_width = 200;
          google_ad_height = 200;
          //-->
        </script>
        <script type="text/javascript"
          src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
        </script>
        <p> <strong>Advertisement</strong> <p>
      </button>
    </div>



<!-- Animation -->

    
    <div class="float in2 box w10" style="overflow: auto;">

    <h2> Line Patterns </h2>
    
    <p>
        This page started out a long time ago as a test for the Python code to draw lines into a bitmap structure.
        This iteration is written in Javascript and uses the HTML canvas to render the patterns.

    </p><p>   
            
      The patterns on this page are created by defining a number of dots evenly around a circle and then connecting them with straight lines. The different
      patterns are created by varying the number of points and the algorithm for deciding which points to join.
      
    </p><p>   
        
    </p><p>    
           
            Pattern:
            <select id="pattern_mode" onchange="SetPatternMode ()">
                    <option value="1">Star</option>
                    <option value="4">Star-spiral</option>
                    <option value="5">Star-rotate</option>
                    <option value="2">Graph</option>
                    <option value="3">Powers</option>
                    <option value="6">Powers-full</option>
            </select>
           
            N: <input type="text" maxlength="12" id="input_n" size="12">  
            M: <input type="text" maxlength="12" id="input_m" size="12">  
            <button onclick="Draw()"> Draw </button>     
            <button onclick="document.location='#modes'"> Modes </button>   
            <button onclick="document.location='#options'"> More Options </button>   

    </p><p>    

        <img id="pattern_view" onClick="PatternClick(event)" onMouseMove="PatternHover(event)">
    </p><p> 
            <a name="options"/>
            Code: <span id="ref">&nbsp;</span>  
        
    </p><p>
            
            Spiral Factor (%): <input type="text" maxlength="12" id="input_s" size="12">  
            Laps (%): <input type="text" maxlength="12" id="input_l" size="12">  
    </p><p>    

            Rotate (deg): <input type="text" maxlength="12" id="input_rot" size="12">  
            Shrink (%): <input type="text" maxlength="12" id="input_shr" size="12">  
            Repeat: <input type="text" maxlength="12" id="input_rep" size="12">  
            
    </p><p>    

            Colours Range: Start: <select id="s_colour" onChange="Draw()"> </select>
                           End: <select id="e_colour" onChange="Draw()"> </select>
                           Back: <select id="b_colour" onChange="Draw()"> </select>
                           <input type="checkbox" id="use_colour" name="cb1" onClick="ToggleUseColour()"/>
                           <label for="cb1">Use</label>
            

    </p><p>    
            Draw from code: <input type="text" maxlength="12" id="from_red" size="12">  
            <button onclick="LoadRef()"> From Code </button>   
        
    </p><p>  
        
    </div>

<!-- Modes -->
    
    <div class="float in2 box w10" style="overflow: auto;">

    <h2> <a name="modes">Modes </a></h2>
    <p>
        <table>
            <tr>
                <th> Star: </th>
                <td> This has two parameters, the number of points (n) and the step size (m). We start with the first point (0) and advance 'm' points to the
                     next (m) and draw a line, we then move to 2m and draw again. we continue this until we return to the original point.</td>
            </tr>
            <tr>
                <th> Graph: </th>
                <td> This has one parameter, the number of points (n). We join every point to every other point. </td>
            </tr>
            <tr>
                <th> Powers: </th>
                <td> This has two parameters, the number of points (n) and the multiplier (m). We start at the second point (1) and repeatedly multiply by 
                     'm' until we return to the starting point.
                    <br><br>
                     This pattern was inspired by a <a href="https://youtu.be/6ZrO90AI0c8">Mathologer video on YouTube</a>.
                     </td>
            </tr>
            <tr>
                <th> Powers&#x2011;full: </th>
                <td> Fills in the missing lines from the "Powers" pattern. </td>
            </tr>
            <tr>
                <th> Star&#x2011;Spiral: </th>
                <td> Draws a star (as above), but shrinks towards the centre as it goes around. Multiple laps create a spiral effect.</td>
            </tr>
            <tr>
                <th> Star&#x2011;Rotate: </th>
                <td> Draws multiple copies of a star, each one shrunk and rotated.</td>
            </tr>
        </table>
    </p>

        
    </div>
        
<!-- Animation -->

    
    <div class="float in2 box w10" style="overflow: auto;">

    <h2> Animation </h2>
         <p>
        <img border="0" src="images/graphs.gif" width="400" height="400">
         <p>
          This is an animation of the complete graphs 3-29 generated using
          using examples 2-29 in the Python code linked <a href="#python">below</a>.
         </p>
    </div>

<!-- Python code -->
    
    <div class="float in2 box w10" style="overflow: auto;">

        <h2> <a name="python"/>The Line Patterns Python Module </h2>
         <p>
           The line pattern module was developed mainly as a test for the line
           drawing algorithm. The module comes with an example function that
           draws patterns like these below.
         </p><p>
           Eaxmples 1-50 draw what are known as complete graphs (the graph obtained by
           joining every point in a set to every other point). You can read more about
           these at <a href="http://mathworld.wolfram.com/CompleteGraph.html">Wolfram
           Research's Mathworld</a>. The first image below is the complete graph for 10.
         </p><p>
          Passing a tuple such as (11,4) to the 'example' method will draw a star.
          The second image is the (11,4) star, it has eleven points with the edges
          joining every 4th point.
         </p><p>
          The third and fourth images are examples 100 and 100 respectively
          third and fourth images are generated by superimposing sets of stars
          and show the sets based on (5,2) and (7,1), with varying phases and sizes.
         </p><p>

          <table border="0" cellpadding="4" cellspacing="0">
           <tr>
            <td>
              <img border="1" src="images/graph00010.gif">
            </td><td>
             <img border="1" src="images/star11_4.gif">
            </td><td>
             <img border="1" src="images/shrinking5star.gif">
            </td><td>
             <img border="1" src="images/shrinking7.gif">
            </td>
           </tr>
          </table>
         </p><p>
          The source for these patterns can be
          downloaded from the <a href="../../python_patterns/source.html">source code page</a>.
         </p>
     </div>


<!-- Generic links -->

    <div class="float w10 box in2" style="overflow: auto;">

        <h2> Other pages </h2>
        <p>
              <iframe class="links" src="http://www.eddaardvark.co.uk/links.html" title="Other pages on this site"></iframe>
        </p>
          
    </div>

<!-- Copyright -->

   <p class="small"> (c) John Whitehouse 2010 - 2020 <p>

<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>

<script type="text/javascript">
var pageTracker = _gat._getTracker("UA-8112879-1"); pageTracker._trackPageview();
</script>

</body>
</html>
