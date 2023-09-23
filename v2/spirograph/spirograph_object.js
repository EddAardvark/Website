//-------------------------------------------------------------------------------------------------
// Javascript spirograph class definition
// (c) John Whitehouse 2013
// www.eddaardvark.co.uk
//
// Depends on SVGColours: colours.js
//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
// Define the spirograph object, this contains the functions to manipulate and render the
// EpirographData
//-------------------------------------------------------------------------------------------------
Spirograph = function()
{
}

//-------------------------------------------------------------------------------------------------
// Creates a pattern with the requested symmetry
//-------------------------------------------------------------------------------------------------
Spirograph.prototype.EnforceSymmetry = function(symm, first_wheel)
{
    // Make the number of points a multiple of the symmetry;

    temp = Math.floor ((this.data.num_points + symm - 1) / symm);
    this.data.num_points = temp * symm;

    // Adjust the wheels (1st two wheels define the symmetry)

    if (first_wheel == 1)
    {
        if (this.data.wheel_rates [1] > this.data.wheel_rates [0])
        {
            this.data.wheel_rates [1] = this.data.wheel_rates [0] + symm;
        }
        else
        {
            this.data.wheel_rates [1] = this.data.wheel_rates [0] - symm;
        }
    }

    // Elliminate degenerate patterns

    while (this.data.wheel_rates [0] == 0 || this.data.wheel_rates [1] == 0 || hcf (this.data.wheel_rates [1], this.data.wheel_rates [0]) > 1)
    {
        this.data.wheel_rates [0] += 1;
        this.data.wheel_rates [1] += 1;
    }

    // remaining wheels take the symmetry from the first two

    for (i = 2 ; i < this.num_wheels ; ++i)
    {
        delta = this.wheel_rates [i] - this.wheel_rates [0];
        temp = Math.floor ((delta + symm - 1) / symm);
        this.wheel_rates [i] = this.wheel_rates [0] + temp * symm;
    }
}


