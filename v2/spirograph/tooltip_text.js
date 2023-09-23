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
    This switches to overlay mode but displays all the components in separate cells of a grid. Press the
    "exit" button in the grid view to see the overlay pattern.
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

ToolTips.text ["Extras"] = `
<strong> Extras </strong>
<p>
    Some options that don't sit hapily anywhere else.
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
    images when combined with wheel rates that are close to a fraction of the number of points. The first example below uses wheek
    rates of 100 and 99 against 800 points, and the second has rates of 3, -4 and 397 displayed using with 1600 points. 397 being
    close to one quarter of 1600.
</p><p>
    <img border="0" src="images/dashed3.jpg" width="120">
    <img border="0" src="images/dashed2.jpg" width="120">
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



