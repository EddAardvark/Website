//-------------------------------------------------------------------------------------------------
// Javascript Maze animations. Superimposes animations over the maze.
// (c) John Whitehouse 2013
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

var PATH_ANIMATION = 5;

var path_image1 = LoadImage ("images/path1.png");
var path_image2 = LoadImage ("images/path2.png");

//-------------------------------------------------------------------------------------------------
// A path to somewhere
//-------------------------------------------------------------------------------------------------
function AnimatedPath ()
{
    this.path = [];
    this.duration = 0;              // How long remaining (in time units)
    this.animation_step = 0;        // Used to animate the images in the path
    this.floor = 0;                 // Which floor the player is on (other floors are invisible)
    this.needs_clearing = false;    // So that we can clear the overlay if there is nothing to draw
}
//-------------------------------------------------------------------------------------------------
// Maintains list of the current animations and draws them when requested.
//-------------------------------------------------------------------------------------------------
function Animator ()
{
    this.canvas = document.createElement('canvas');
    this.image = null;

    this.canvas.width = WIDTH * CELL_SIZE;
    this.canvas.height = HEIGHT * CELL_SIZE;

    this.paths = [];
}
//-------------------------------------------------------------------------------------------------
// Maintains list of the current animations and draws them when requested.
//-------------------------------------------------------------------------------------------------
Animator.prototype.Update = function ()
{
    var num_paths = this.paths.length;
    var redraw = num_paths > 0;

    // Nothing to draw, remove any previous contents

    if (! redraw)
    {
        if (this.needs_clearing)
        {
            this.context = this.canvas.getContext('2d');
            this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);
            this.needs_clearing = false;
            this.image.src = this.canvas.toDataURL();
        }
        return;
    }

    // Draw the animation

    this.context = this.canvas.getContext('2d');
    this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);
    this.needs_clearing = true;

    for (var i = 0 ; i < num_paths ; ++i)
    {
        this.DrawPath (this.paths [i]);
    }

    // Remove expired objects

    var idx = 0;

    while (idx < this.paths.length)
    {
        if (this.paths [idx].duration <= 0)
        {
            this.paths.splice (idx, 1);
        }
        else
        {
            idx += 1;
        }
    }

    this.image.src = this.canvas.toDataURL();
}
//-------------------------------------------------------------------------------------------------
// Draw a path - 'path' is an animated path that contains the cell positions of the path to draw
//-------------------------------------------------------------------------------------------------
Animator.prototype.DrawPath = function (path)
{
    var num = path.path.length;

    for (var i = 0 ; i < num ; ++i)
    {
        var pos = path.path [i];
        var f = Math.floor (pos / FLOOR_AREA);

        if (f == path.floor)
        {
            var img = (((i + path.animation_step) % PATH_ANIMATION) == 0) ? path_image2 : path_image1;

            pos -= floor * FLOOR_AREA;
            var y = Math.floor (pos / WIDTH);
            var x = pos - y * WIDTH;

            this.context.drawImage(img, x * CELL_SIZE, y * CELL_SIZE);
        }
    }

    path.duration -= 1;
    path.animation_step += PATH_ANIMATION - 1;
}

