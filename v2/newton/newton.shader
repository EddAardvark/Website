precision %PRECISION% float;

varying vec2 vPosition;

#define PI 3.1415926535897932384626433832795

void main(void)
{
    %INITIALISE%

    int i = 0;
    int runaway = 0;

    for (int i=0; i <  %NUM_ITERATIONS% ; i++)
    {
        if (runaway == 0)
        {
            %CODE%
        }
    }

    if (runaway == 0)
    {
        runaway = %NUM_ITERATIONS%;
    }

        %APPLY_COLOUR%

        float angle = (PI + atan(y,x)) * (3.0 / PI);
        float value = angle - float(int(angle));
        float level = log(float(runaway)) * %CONTOURS_FACTOR%;

        level = level - float(int(level));

        float red;
        float blue;
        float green;

        if (angle <= 0.0 || angle >= 6.0)
        {
            red = level;
            green = 0.0;
            blue = 0.0;
        }
        else if (angle < 1.0)
        {
            red = level;
            green = value * level;
            blue = 0.0;
        }
        else if (angle < 2.0)
        {
            red = (1.0 - value) * level;
            green = level;
            blue = 0.0;
        }
        else if (angle < 3.0)
        {
            red = 0.0;
            green = level;
            blue = value * level;
        }
        else if (angle < 4.0)
        {
            red = 0.0;
            green = (1.0 - value) * level;
            blue = level;
        }
        else if (angle < 5.0)
        {
            red = value * level;
            green = 0.0;
            blue = level;
        }
        else
        {
            red = level;
            green = 0.0;
            blue = (1.0 - value) * level;
        }

        gl_FragColor = vec4(red, green, blue, 1.0);
}
