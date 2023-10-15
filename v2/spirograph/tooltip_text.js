ToolTips = function () {}


ToolTips.get_text = function (id)
{
    var text = ToolTips.text [id];
    
    if (! text)
    {
        text = "No help available for this control";
    }
    return text;
}
     
ToolTips.text = {};

// Display modes

ToolTips.text ["btn_single"] = `
<strong> Single </strong>
<p>
    Displays a simple pattern based on the configured set of wheels.
    Use the "Setup" tab to change the configuration.
 </p>
`

ToolTips.text ["btn_overlay"] = `
<strong> Overay </strong>
<p>
    This mode allows you to overlay a number of patterns into a composite, varying some attributes
    between iterations. The "Overlay &#x25bc" tab allows you to choose which attributes are varied.
 </p>
`

ToolTips.text ["btn_split"] = `
<strong> Split </strong>
<p>
    This mode splits the wheels used to create the pattern into two set. The 'inner' set are then used
    to calculate a set of points but draw anything. The 'outer' set are then used to draw a separate
    pattern at each of the inner points. The "Split &#x25bc" tab allows you to define how to
    partition the wheels.
</p>
`

ToolTips.text ["btn_big"] = `
<strong> Big </strong>
<p>
    This removes the status area to the right of the pattern and displays a larger version of the pattern.
    This applies to simple, overlay and split patterns.
    Use the "Exit" button to return to this view.
</p>
`

ToolTips.text ["btn_grid"] = `
<strong> Grid </strong>
<p>
    This switches to "Overlay" mode but displays all the components that would be overlaid in the separate
    cells of a grid. Press the "exit" button in this grid view to see the overlay pattern.
</p>
`

ToolTips.text ["btn_evolve"] = `
<strong> Evolve </strong>
<p>
    This switches to a grid view where the original pattern (the parent) is displayed in the top left and the 
    other cells display versions of the original with one or more attributes changed at random (the children).
</p><p>
    You can now click on one of the children. This will become the new parent and the other patterns are
    replaced by a new set of children. You can repeat this process to guide the patterns in directions of
    your choice.
</p>
`

// Main toolbar

ToolTips.text ["Setup"] = `
<strong> Setup </strong>
<p>
    This displays the main controls where you can define:
    <ul>
        <li>the number of wheels that are used to generate a pattern.
            2 wheels will generate a traditional Spirograph pattern, more wheels create more interesting effects.
            This app limits you to 5 wheels.
        </li><li>
            The number of points used to draw the pattern. More points give smoother effects, but will slow down the
            rendering, especially important where you are animating or overlaying a number of patterns. Small numbers
            can also produce interesting effects.
        </li>
    </ul>
</p>
`

ToolTips.text ["Size"] = `
<strong> Wheel Size </strong>
<p>
    Controls to change the sizes of the wheels involved in the pattern. Only the relative sizes matter.
</p>
`


ToolTips.text ["Rate"] = `
<strong> Wheel Rate </strong>
<p>
    Displays the "Wheel Rates" dialog where you can change the rates that the wheels turn.
    In the toy this is controlled by the number of teeth on the wheels, but here we have we have no such constraints.
</p><p>
    Open up the "Wheel Rates" dialog for more information.
</p>
`

ToolTips.text ["Phse"] = `
<strong> Wheel Phase </strong>
<p>
    Controls the starting angle of the wheels. For two wheels this just rotates the whole pattern, For 3 plus wheels it
    can be more interesting. Varying the phase is the key element of the animations.
</p>
`

ToolTips.text ["DP"] = `
<strong> Delta-Phase </strong>
<p>
    Allows you to control how fast the wheel phases change during an animation.
</p>
`

ToolTips.text ["Fill"] = `
<strong> Fill </strong>
<p>
    This tab allows you to set the line, fill and background colours, and the colouring mode.
</p>
`


ToolTips.text ["Overlay"] = `
<strong> Overlay </strong>
<p>
    Allows you to configure which attributes change when setting up a sequence of patterns to generate an overlay. You can review
    the individual patterns that form the overlay using the "Grid" view.
</p>
`

ToolTips.text ["Split"] = `
<strong> Split </strong>
<p>
    Allows you to specify how many wheels are used to define the inner points and outer points in a Aplit view. You can also specify how
    the colours vary around the pattern.
</p>
`

ToolTips.text ["Print"] = `
<strong> Print </strong>
<p>
    Creates a printable copy of the current pattern on a separate page, without any clutter.
</p>
`

// Additional actions

ToolTips.text ["example"] = `
<strong> Example </strong>
<p>
    Displays an example pattern.
</p>
`

ToolTips.text ["randomise"] = `

<strong> Randomise </strong>
<p>
    Randomises the parameters for the pattern currently on display. For a single pattern this will be the underlying
    pattern parameters, for split and overlay patterns it will be the parameters that determine how these modes
    are applied to the base pattern.
</p>
`

ToolTips.text ["an_start"] = `

<strong> Start Animation </strong>
<p>
    Starts the animation.
</p>
`

ToolTips.text ["an_auto"] = `

<strong> Automate Animation </strong>
<p>
    When the animation is running the parameters will be automatically randomised from time to time.
</p>

`

ToolTips.text ["an_stop"] = `

<strong> Start Animation </strong>
<p>
    Stops the animation.
</p>
`

ToolTips.text ["new_pat"] = `

<strong> Reset </strong>
<p>
    Restores all the parameters back to their original settings
</p>

`


ToolTips.text ["svg_btn"] = `

<strong> SVG </strong>
<p>
    Displays the text for the SVG behind the current pattern in a text area where you can cut
    and past it into other applications.
</p>

`

ToolTips.text ["ins_link"] = `

<strong> Instructions </strong>
<p>
    Jump to the instructions section.
</p>

`





// An example used in the instructions

ToolTips.text ["help_example"] = `

<strong>Help Example </strong>

<p>
    Hover over icons like this for extra information.
</p>

`

// Section help

ToolTips.text ["setup_help"] = `

<strong> Basic Setup </strong>
<p>
In this section you can configure the number of wheels and points used to draw the pattern.
</p><p>
<table>
 <tr>
  <td> Points </td>
  <td> The number of points can be varied from 3 upwards, but going beyond a few thousand is probably overkill. There are three
       types of button, [&#x25b7;] increases the number of points by 1, [&#x25b6;] by 10 and [&#x25b6;&#x25b6;] by 100.
       The [&#x25c0;&#x25c0;], [&#x25c0;] and [&#x25c1;] 
       buttons reduce the number of points by the same amount, but won't go fewer than 3. </td>
 </tr><tr>
  <td> Wheels </td>
  <td> The buttons &#x25c1; and &#x25b7; change the number of wheels by one, within the range 2-5. </td>
 </tr>
</table>
</p>

`

ToolTips.text ["sizes_help"] = `

<strong> Wheel Sizes </strong>
<p>
    Here you can change the sizes of the wheels using the buttons [&#x25c0;], [&#x25c1;], [&#x25b7;] and [&#x25b6;]. These change the size by
    -10, -1, 1 and 10 respectively. There is a different set for each wheel.
</p><p>
    You can't decrease the size below 1. Only  the relative sizes matter, so 2 and 5 will be the same as 4 and 10.
    
</p>

`

ToolTips.text ["rates_help"] = `

<strong> Wheel Rates </strong>
<p>
    Here you can change the rates of the wheels (how fast they rotate relative to each other). Each wheel has it's own set of buttons:
    &#x25c0;, &#x25c1;, &#x25b7; and &#x25b6;, which change the rate by -10, -1, 1 and 10 respectively.
</p><p>
    Avoid creating sets of wheel rates where all the values have a common factor, such as [-5,5,25], as this will just draw
    the [-1,1,5] pattern five times, but with only one fifth of the points. However, if you pick a small number of points that isn't a multiple
    of the common factor it might get interesting.
</p><p>
    The symmetry of the pattern is determined by the differences between the rates (once you have divided out any common factors). For two
    wheel patterns it is just the differentce, so 3 and 5 will create a pattern with 2-fold symmetry, and 3,-5 will produce 8-fold symmetry.
</p><p>
    <img border="0" src="images/rates3x5.png" width="120">
    <img border="0" src="images/rates3xm5.png" width="120">
</p><p>
    For more wheels you need to calculate the highest common factor of the set of differences.
</p>

`


ToolTips.text ["phases_help"] = `

<strong> Wheel Phase Configuration </strong>
<p>
    "Phase" determines the starting angle of the wheels. Useful when creating animations, especially with more than 2 wheels. When using only 
    two wheels changing the starting phase phase has the effect of rotating the whole pattern. The values are in degrees.

</p><p>
    Each wheel has it's own set of buttons:
    &#x25c0;, &#x25c1;, &#x25b7; and &#x25b6;, which change the phase by -10&deg;, -1&deg;, 1&deg; and 10&deg; respectively. If you go beyond
    360&deg; or below 0 the value will wrap around.
</p>
`


ToolTips.text ["fill_help"] = `

<strong> Colour Configuration </strong>
<p>
    Here you can configure the colours used to draw the line and to fill in the pattern. You can also set a background colour.
    The four "Style" buttons allow you choose how the fill colour is applied. These are referred to as  "none" (the open circle),
    "nonezero" (the solid circle), "evenodd" (the half filled circle) and "dashed" (the three horizontal lines). When applied to 
    the default pattern they appear like:
</p><p>
    <img border="0" src="images/hollow.jpg" width="120">
    <img border="0" src="images/solid.jpg" width="120">
    <img border="0" src="images/evenodd.jpg" width="120">
    <img border="0" src="images/dashed.jpg" width="120">
</p><p>
    The dashed mode isn't very exciting when used on simple patterns but can produce more dramatic
    images when combined with wheel rates that are close to a fraction of the number of points. The first example below uses wheel
    rates of 100 and 99 against 800 points, and the second has rates of 3, -4 and 397 displayed using with 1600 points. 397 being
    close to one quarter of 1600.
</p><p>
    <img border="0" src="images/dashed3.jpg" width="120">
    <img border="0" src="images/dashed2.jpg" width="120">
</p>
`


ToolTips.text ["overlay_apply"] = `
<strong> Overlay Apply </strong>
<p>
Apply the current settings to the overlay pattern display. If neccessary, this will change the display mode to "Overlay".
</p>
`

ToolTips.text ["overlay_help"] = `

<strong> Overlay Configuration </strong>
<p>
    Overay allows you to superimpose a number of similar patterns, differing slightly is size or rotation. There are a lot of parameters that
    can be varied to create overlays. Examples of the effect of each can be seen by hovering over the labels introducing the controls in this 
    dialog.
</p>

`


ToolTips.text ["split_help"] = `

<strong> Split </strong>
<p> 

Split allows you to take the wheels defined for the basic pattern and split them into two sets, inner and outer.
The inner wheels are used to define a set of points, then the outer wheels draw a separate pattern at each point.

</p><p>
    <img border="0" src="images/split.jpg" width="120">
</p>
`


ToolTips.text ["out_points"] = `

<strong> Split Outer Points </strong>
<p> 

The number of points used to draw the outer pattern. Here we are using one wheel and 5 points, creating the
5-pointed stars. The number of outer points might be adjusted if the entered value is incompatible with the
other parameters.

</p><p>
    <img border="0" src="images/split_outer_points.jpg" width="120">
</p>
`


ToolTips.text ["overlay_points"] = `

<strong> Points </strong>
<p>
    This allows you to change the number of points used to draw each image. The value can be positive, negative or zero. 
    For none zero values the pattern will become more or less angular as the sequence progresses.
</p><p>
    The first example starts with 330 points and draws 15 images, each using 22 point fewer than the previous one.
    All these numbers are multiples of 11,
    the symmetry of the original pattern, so the symmetry persists as the number of points decreases. The images also 
    shrink slightly to make the differences clearer. The second pattern has fill and
    rotation added, and the number of poins no longer matches the symmetry. The third image starts with 11 points and
    reduces them down to 4. No rotation or shrinkage.
</p><p>
    <img border="0" src="images/overlay_points_1.jpg" width="120">
    <img border="0" src="images/overlay_points_2.jpg" width="120">
    <img border="0" src="images/overlay_points_3.jpg" width="120">
</p>
`


ToolTips.text ["overlay_shrink"] = `

<strong> Shrink </strong>
<p>
    This allows you to change the relative size of succesive images. A value of 1 means no change. Other values are the
    ratio of the sizes of successive images. Values between 0.1 and 10 are allowed. When the value is larger than one
    the layers are drawn small to large.

</p><p>
    In these examples the first is drawn large to small and the second small to large with some rotation. The third 
    has fill turned off.
</p><p>
    <img border="0" src="images/overlay_shrink_1.jpg" width="120">
    <img border="0" src="images/overlay_shrink_2.jpg" width="120">
    <img border="0" src="images/overlay_shrink_3.jpg" width="120">
</p>
`

ToolTips.text ["overlay_rotate"] = `

<strong> Rotate </strong>
<p>
    This allows you to change the relative orientation of succesive images. The angles are in degrees (&pi;/180).

</p><p>
    The first image shows pure rotation, the second combines rotation with shrinkage and the third also
    adds in chnaging the size of one of the wheels.
</p><p>
    <img border="0" src="images/overlay_rotate_1.jpg" width="120">
    <img border="0" src="images/overlay_rotate_2.jpg" width="120">
    <img border="0" src="images/overlay_rotate_3.jpg" width="120">
</p>
`


ToolTips.text ["overlay_vary1"] = `

<strong> Vary </strong>
<p>
    These three controls allow you to vary an attribute of one of the wheels. There are three options (plus "none"),
    you can only chooe one at a time.
</p><p>
    The first image is an example of varying phase. This only becomes interesting with three or more wheels.
    Here we show wheel rates of -7, 4 and 15 (to preserve the 11-fold symmetry) and vary the phase of the third
    wheel by 3&deg;.
</p><p>
    The second image uses the same wheels as the first but this time varies the size of the first. The wheel size parameter
    is a factor, so values close to 1 work best.
</p><p>
    The third image start with wheel rates of -2, 3 and 8, giving 5-fold symmetry. We then change the rate of
    the third wheel by +5 each iteration.
</p><p>
    <img border="0" src="images/overlay_vary_1.jpg" width="120">
    <img border="0" src="images/overlay_vary_2.jpg" width="120">
    <img border="0" src="images/overlay_vary_3.jpg" width="120">
</p>
`

ToolTips.text ["overlay_vary2"] = ToolTips.text ["overlay_vary1"];
ToolTips.text ["overlay_vary3"] = ToolTips.text ["overlay_vary1"];

ToolTips.text ["overlay_fill"] = `

<strong> Fill Colours </strong>
<p> You can define a sequence of colours that will be used to fill the succesive patterns. You can
use as many colours as you like. Colours can be names or RGB values. The list of colours can be used to add
names colours to the list by clicking the "+" button, or you can type directly into the edit box.

</p><p>
The first image uses the rainbow colours: "red orange yellow green blue indigo violet",
the second alternates black and yellow: "black yellow black yellow black" and the third uses two RGB values:
"#335577 #DDEEFF".

</p><p>
    <img border="0" src="images/overlay_fill_1.jpg" width="120">
    <img border="0" src="images/overlay_fill_2.jpg" width="120">
    <img border="0" src="images/overlay_fill_3.jpg" width="120">
</p>

`


ToolTips.text ["overlay_line"] = `

<strong> Line Colours </strong>
<p> You can define a sequence of colours that will be used to draw the succesive patterns. The controls
work identically to the those for fill colour.

</p><p>
The first image conbines lines drawn using "green blue red" with a solid white fill.
the second uses "crimson orange yellow" on a "wheat" background with no fill. The third combines lines
blending from black to white with fills going from white to black.

</p><p>
    <img border="0" src="images/overlay_line_1.jpg" width="120">
    <img border="0" src="images/overlay_line_2.jpg" width="120">
    <img border="0" src="images/overlay_line_3.jpg" width="120">
</p>

`

ToolTips.text ["overlay_num"] = `

<strong> Number of Images </strong>
<p> 
The number of separate images in the overlay sequence.
</p>

`

ToolTips.text ["in_wheels"] = `

<strong> Split Wheels </strong>
<p> 
The basic battern defines 5 wheels, here you can choose how many are used to define the set of points (inner wheels)
and how many are used to draw the outer pattern (outer wheels). The number of points generated by the inner wheels is
taken from the number of points in the original pattern.
</p>

`

ToolTips.text ["out_wheels"] = ToolTips.text ["in_wheels"];

ToolTips.text ["out_rotate"] =  `

<strong> Split Outer Rotate </strong>
<p> The outer pattern is by default drawn at the same orientation each time. This parameter allows
you to rotate it along the orbit, the absolute being the total number of 360&deg; rotations.
Positive values are clockwise, zero is no rotation. These images show examples of 1, 0 and -5. You can see 
larger versions in the examples section at the end of this page.
</p><p>
    <img border="0" src="images/split_rotate_1.jpg" width="120">
    <img border="0" src="images/split_rotate_2.jpg" width="120">
    <img border="0" src="images/split_rotate_3.jpg" width="120">
</p>

`

ToolTips.text ["split_apply"] = `
<strong> Split Apply </strong>
<p>
Apply the current settings to the split pattern display. If neccessary, this will change the display mode to "Split".
</p>
`

ToolTips.text ["split_fill"] = `
<strong> Split Fill colours </strong>
<p>
Allows you to set the colour sequence used to fill the outer shapes. Colours will blend from one to the next
as you move around the pattern. Setting the first and last colours to the same value avoids a discontinuity
when the pattern joins up. This pattern uses "red yellow black cyan red", starting and ending on "Red".
</p><p>
    <img border="0" src="images/split_fill.jpg" width="120">
</p>
`

ToolTips.text ["split_line"] = `
<strong> Split Line colours </strong>
<p>
Allows you to set the colour sequence used to draw the outer shapes. Colours will blend from one to the next
as you move around the pattern. Setting the first and last colours to the same value avoids a discontinuity
when the pattern joins up. This pattern uses "red green blue red", the shapes are filled with "white".
</p><p>
    <img border="0" src="images/split_line.jpg" width="120">
</p>
`

ToolTips.text ["in_size"] = `
<strong> Wheel Sizes </strong>
<p> 
These two values control the sizes of outer and inner patterns. Only the ratio is important. The first example is 25:1,
the second 9:1 and the third 1:15. The inner and outer patterns both have 50 points and the outer wheel rates are 2,-3.

</p><p>
    <img border="0" src="images/split_wheel_sizes_1.jpg" width="120">
    <img border="0" src="images/split_wheel_sizes_2.jpg" width="120">
    <img border="0" src="images/split_wheel_sizes_3.jpg" width="120">
</p>

`

ToolTips.text ["out_size"] = ToolTips.text ["in_size"];

// Example images

ToolTips.help_images = [
    { "img":"images/rates3x5.png", "text":"<strong>Rates Dialog</strong>: Image created by setting the wheel rates to 3 and 5." },
    { "img":"images/rates3xm5.png", "text":"<strong>Rates Dialog</strong>: Image created by setting the wheel rates to 3 and -5." },
    { "img":"images/hollow.jpg", "text":"<strong>Fill Dialog</strong>: Image created using the \"hollow\" style (open circle)" },
    { "img":"images/solid.jpg", "text":"<strong>Fill Dialog</strong>: Image created using the \"solid\" style (filled circle)" },
    { "img":"images/evenodd.jpg", "text":"<strong>Fill Dialog</strong>: Image created using the \"evenodd\" style (half filled circle)" },

    { "img":"images/dashed.jpg", "text":"<strong>Fill Dialog</strong>: Image created using the \"dashed\" style (three horizontal lines)" },
    { "img":"images/dashed3.jpg", "text":"<strong>Fill Dialog</strong>: \"dashed\" mode with wheel rates of 100 and 99 rendered using 800 points" },
    { "img":"images/dashed2.jpg", "text":"<strong>Fill Dialog</strong>: \"dashed\" mode with wheel rates of 3, -4 and 397 rendered using 1600 points" },

    { "img":"images/overlay_points_1.jpg", "text":"<strong>Overlay Points</strong>: 15 images overlaid, the first rendered with 330 points, subsequent images have 22 points fewer. All numbers are multiples of 11 to preserve the symmetry." },
    { "img":"images/overlay_points_2.jpg", "text":"<strong>Overlay Points</strong>: Reducing the number of points and rotating, with filling enabled. This time the numbers of points aren't multiples of 11 and the symmetry is lost." },
    { "img":"images/overlay_points_3.jpg", "text":"<strong>Overlay Points</strong>: Here we start with 11 points and drop down 4." },

    { "img":"images/overlay_shrink_1.jpg", "text":"<strong>Overlay Shrink</strong>: Here we start with a full sized image and gradually shrink it." },
    { "img":"images/overlay_shrink_2.jpg", "text":"<strong>Overlay Shrink</strong>: Here we make the shrink factor greater than one so that we start with a small image and grow it. We've also added some rotation. The larger images mostly obscure the smaller ones." },
    { "img":"images/overlay_shrink_3.jpg", "text":"<strong>Overlay Shrink</strong>: With fill turned off so that you only see the lines." },

    { "img":"images/overlay_rotate_1.jpg", "text":"<strong>Overlay Rotate</strong>: Rotating the pattern, leaving the size unchanged." },
    { "img":"images/overlay_rotate_2.jpg", "text":"<strong>Overlay Rotate</strong>: Rotating and shrinking." },
    { "img":"images/overlay_rotate_3.jpg", "text":"<strong>Overlay Rotate</strong>: Rotating, shrinking and changing the size of one of the wheels." },

    { "img":"images/overlay_vary_1.jpg", "text":"<strong>Overlay Vary</strong>: Three wheels with rates -7, 4 and 15 (11-fold symmetry). The phase of the 3rd wheel increments by 3&deg; between renderings." },
    { "img":"images/overlay_vary_2.jpg", "text":"<strong>Overlay Vary</strong>: Three wheels with rates -7, 4 and 15 (11-fold symmetry). Here we vary the size of the first wheel." },
    { "img":"images/overlay_vary_3.jpg", "text":"<strong>Overlay Vary</strong>: Three wheels with rates -2, 3 and 8 (5-fold symmetry). We then change the rate of the third wheel by +5 (to preserve the symmetry) each iteration." },

    { "img":"images/overlay_fill_1.jpg", "text":"<strong>Overlay Fill Colour</strong>: Varying the fill colour using the rainbow colours: \"red orange yellow green blue indigo violet\"." },
    { "img":"images/overlay_fill_2.jpg", "text":"<strong>Overlay Fill Colour</strong>: Varying the fill colour using black and yellow: \"black yellow black yellow black\"." },
    { "img":"images/overlay_fill_3.jpg", "text":"<strong>Overlay Fill Colour</strong>: Varying the fill colour using RGB values: \"#335577 #DDEEFF\"." },

    { "img":"images/overlay_line_1.jpg", "text":"<strong>Overlay Line Colour</strong>: Varying the line colour using the rainbow colours: \"red orange yellow green blue indigo violet\", starting small and growing." },
    { "img":"images/overlay_line_2.jpg", "text":"<strong>Overlay Line Colour</strong>: Using \"crimson orange yellow\" on a \"wheat\" background." },
    { "img":"images/overlay_line_3.jpg", "text":"<strong>Overlay Line Colour</strong>: Combines lines blending from black to white with fills going from white to black on a sky blue background." },

    { "img":"images/split.jpg", "text":"<strong>Split</strong>: The inner wheels define the 11-fold pattern that we start with, the outer wheel draws the hexagons at the points of the main pattern. Uses the colour sequence \"red orange yellow green blue indigo violet red\"" },
    { "img":"images/split_outer_points.jpg", "text":"<strong>Split Outer Points</strong>: The number of points used to draw the outer pattern is 5." },

    { "img":"images/split_wheel_sizes_1.jpg", "text":"<strong>Split Wheel Sizes</strong>: The size ratio between the inner pattern and outer pattern is 25:1." },
    { "img":"images/split_wheel_sizes_2.jpg", "text":"<strong>Split Wheel Sizes</strong>: The size ratio between the inner pattern and outer pattern is 9:1." },
    { "img":"images/split_wheel_sizes_3.jpg", "text":"<strong>Split Wheel Sizes</strong>: The size ratio between the inner pattern and outer pattern is 1:15." },

    { "img":"images/split_rotate_1.jpg", "text":"<strong>Split Outer Rotate</strong>: Setting the outer rotate value to 0, the outer pattern's orientation remains constant." },
    { "img":"images/split_rotate_2.jpg", "text":"<strong>Split Outer Rotate</strong>: Setting the outer rotate value to 1, the outer pattern executes 1 full rotation around the circuit. Uses outer wheel rates of 1 and -1 and 100 outer points to create the elipses." },
    { "img":"images/split_rotate_3.jpg", "text":"<strong>Split Outer Rotate</strong>: Setting the outer rotate value to -5, the outer pattern executes 5 full rotations around the circuit." },

    { "img":"images/split_fill.jpg", "text":"<strong>Split Fill Colours</strong>: This example is created using the fill colour sequence \"red yellow black cyan red\". By making the first and last colours the same the end of the sequence blends into the start, with no glaring discontinuity." },
    { "img":"images/split_line.jpg", "text":"<strong>Split Line Colours</strong>: This example is created using the line colour sequence \"red green blue red\". The triangles are filled in white to match the background." },

    
];
