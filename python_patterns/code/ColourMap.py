#==============================================================
# (c) John Whitehouse 2002-2003
# htpp://www.eddaardvark.co.uk/
#==============================================================

# Some colours

red        = chr(0)+chr(0)+chr(255)
blue       = chr(255)+chr(0)+chr(0)
green      = chr(0)+chr(255)+chr(0)
cyan       = chr(255)+chr(255)+chr(0)
yellow     = chr(0)+chr(255)+chr(255)
magenta    = chr(255)+chr(0)+chr(255)
white      = chr(255)+chr(255)+chr(255)
black      = chr(0)+chr(0)+chr(0)
orange     = chr(0)+chr(128)+chr(255)

dk_red     = chr(0)+chr(0)+chr(128)
dk_blue    = chr(128)+chr(0)+chr(0)
dk_green   = chr(0)+chr(128)+chr(0)
dk_cyan    = chr(128)+chr(128)+chr(0)
dk_yellow  = chr(0)+chr(128)+chr(128)
dk_magenta = chr(128)+chr(0)+chr(128)
dk_grey    = chr(128)+chr(128)+chr(128)
dk_orange  = chr(0)+chr(64)+chr(128)

vdk_red     = chr(0)+chr(0)+chr(64)
vdk_blue    = chr(64)+chr(0)+chr(0)
vdk_green   = chr(0)+chr(64)+chr(0)
vdk_cyan    = chr(64)+chr(64)+chr(0)
vdk_yellow  = chr(0)+chr(64)+chr(128)
vdk_magenta = chr(64)+chr(0)+chr(64)
vdk_grey    = chr(64)+chr(64)+chr(64)

lt_red     = chr(128)+chr(128)+chr(255)
lt_blue    = chr(255)+chr(128)+chr(128)
lt_green   = chr(128)+chr(255)+chr(128)
lt_cyan    = chr(255)+chr(255)+chr(128)
lt_yellow  = chr(128)+chr(255)+chr(255)
lt_magenta = chr(255)+chr(128)+chr(255)
lt_grey    = chr(192)+chr(192)+chr(192)
lt_orange  = chr(128)+chr(192)+chr(255)

vlt_grey   = chr(224)+chr(224)+chr(224)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def makeColour (r,g,b):
    "Make a colour string from the RGB values"
    return chr(b)+chr(g)+chr(r)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def createLinear (start, end, num):
    """
    Create a set of colours, starting at 'start' and ending
    at 'end'. Colours are three character strings representing
    blue, green and red - 'bgr'
    """

    r0 = ord (start [2])
    g0 = ord (start [1])
    b0 = ord (start [0])
    
    if num > 1:
        colour_map = ['xxx'] * num

        r_inc = float (ord (end [2]) - r0) / (num - 1)
        g_inc = float (ord (end [1]) - g0) / (num - 1)
        b_inc = float (ord (end [0]) - b0) / (num - 1)

        for i in range (0, num):

            r = r0 + int (i * r_inc)
            g = g0 + int (i * g_inc)
            b = b0 + int (i * b_inc)
        
            colour_map [i] = chr(b)+chr(g)+chr(r)
    else:
        colour_map = [chr(b0)+chr(g0)+chr(r0)]

    return colour_map        


                
