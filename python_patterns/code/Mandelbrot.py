#==============================================================
# (c) John Whitehouse 2002-2008
# htpp://www.eddaardvark.co.uk/
#
# Draws Mandelbrots and Julia sets
#
# version 2 - adds the "Quadrants" colour scheme
#==============================================================

import WindowsBMP
import ColourMap
import time
import sys
import math

# Some co-ordinates used in the examples

interesting_coords = [  (-0.3006818, 0.6600910),
                        (-0.5511328, 0.627839636),
                        (0.27322626, 0.595153338),
                        (-0.1555049, 0.650170438),
                        (0.42661603, 0.217772923),
                        (-0.502875,  0.518925),
                        (-1.2583585, 0.3821136)]

# Default 'c' value

active_point=0

# position of black in the bitmap's colour table

BLACK_INDEX = chr(0)
BLACK       = chr(0)+chr(0)+chr(0)+chr(0)
WHITE       = chr(255)+chr(255)+chr(255)+chr(0)
#=================================================================
# The Mandelbrot Pattern class
#=================================================================

class Mandelbrot:

    def __init__ (self):
        self.path         = 'c:\\python25\\work\\'
        self.filename     = 'mandelbrot'
        self.position     = (0,0,-0.5,0)
        self.scale        = 0.00375
        self.iterations   = 100
        self.draw         = self.drawStandard
        self.pfuns        = [self.pf1, self.pf2, self.pf3, self.pf4, self.pf5, self.pf6, self.pf7, self.pf8]
        self.julia_point  = interesting_coords [active_point]
        self.starfactor   = 0.001
        self.palette      = 0
        self.log_progress = False
        self.modefuns     = {'A':self.modeA, 'B':self.modeB, 'C':self.modeC,
                             'D':self.modeD, 'M':self.modeM, 'J':self.modeJ}
        self.setSize ((800, 600))
        self.buildColourMap (100)
#-----------------------------------------------------------------------
    def setSize (self, size):
        "Set the size"

        self.size = size

        self.bitmap = WindowsBMP.WindowsBMP ()
        self.bitmap.create8Bit (self.size [0], self.size [1])
#-----------------------------------------------------------------------
    def initRanges (self, mode):
        
        if mode == 'A':
            xmin = self.position [1] - self.scale * self.size [0] / 2
            ymin = self.position [3] - self.scale * self.size [1] / 2
        elif mode == 'B':
            xmin = self.position [1] - self.scale * self.size [0] / 2
            ymin = self.position [2] - self.scale * self.size [1] / 2
        elif mode == 'C':
            xmin = self.position [0] - self.scale * self.size [0] / 2
            ymin = self.position [3] - self.scale * self.size [1] / 2
        elif mode == 'D':
            xmin = self.position [0] - self.scale * self.size [0] / 2
            ymin = self.position [2] - self.scale * self.size [1] / 2
        elif mode == 'M':
            xmin = self.position [2] - self.scale * self.size [0] / 2
            ymin = self.position [3] - self.scale * self.size [1] / 2
        elif mode == 'J':
            xmin = self.position [0] - self.scale * self.size [0] / 2
            ymin = self.position [1] - self.scale * self.size [1] / 2

        ixrange      = range (0, self.size [0])
        iyrange      = range (0, self.size [1])
        self.xrange  = [xmin + self.scale * ix for ix in ixrange]
        self.yrange  = [ymin + self.scale * iy for iy in iyrange]
        self.modefun = self.modefuns [mode]
#-----------------------------------------------------------------------
    def modeA (self, ix, iy):
        z = complex (self.position [0], self.xrange [ix])
        c = complex (self.position [2], self.yrange [iy])
        return z, c

    def modeB (self, ix, iy):
        z = complex (self.position [0], self.xrange [ix])
        c = complex (self.yrange [iy], self.position [3])
        return z, c
                
    def modeC (self, ix, iy):
        z = complex (self.xrange [ix], self.position [1])
        c = complex (self.position [2], self.yrange [iy])
        return z, c
                
    def modeD (self, ix, iy):
        z = complex (self.xrange [ix], self.position [1])
        c = complex (self.yrange [iy], self.position [3])
        return z, c
                
    def modeM (self, ix, iy):
        z = complex (self.position [0], self.position [1])
        c = complex (self.xrange [ix], self.yrange [iy])
        return z, c
    
    def modeJ (self, ix, iy):
        z = complex (self.xrange [ix], self.yrange [iy])
        c = complex (self.position [2], self.position [3])
        return z, c
#-----------------------------------------------------------------------
    def drawPattern (self, type, sub_type):

        if sub_type == ' ':
            self.drawStandard (type)
        elif sub_type == 'S':
            self.drawStars (type)
        elif sub_type == 'B':
            self.drawBands (type, True, True)
        elif sub_type == 'I':
            self.drawBands (type, False, True)
        elif sub_type == 'R':
            self.drawBands (type, True, False)
        elif sub_type == 'Q':
            self.drawQuadrants (type)
        elif sub_type == 'V':
            self.drawValuesGeneric (type)
#-----------------------------------------------------------------------
    def drawStandard(self, mode):
        """
        There are 6 planes perpendicular to the four axes depending on which two of the
        4 variables z0x, z0y, cx and cy are kept constant and which two are varied. I've
        labelled these, 'M', 'J', 'A', 'B', 'C', 'D'.

        M: Fixes Z0 and varies c. If z0 = (0,0) this draws the traditional mandelbrot.
        J: Fixes c and varies Z0. This draws the Julia sets, one for each value of c.
        A: Fixes Z0x and cx, varies z0y and cy.
        B: Fixes Z0x and cy, varies z0y and cx.
        C: Fixes Z0y and cx, varies z0x and cy.
        D: Fixes Z0y and cy, varies z0x and cx.

        Pattern is coloured according to the number of iterations before the
        value of abs(z) passes 2.
        """

        self.initRanges (mode)

        ilist = range (0, self.iterations)

        for ix in range (0, self.size [0]):
            for iy in range (0, self.size [1]):

                z,c = self.modefun (ix, iy)
                colour = BLACK_INDEX
                
                for i in ilist:
                    z = z * z + c
                    if abs(z) >= 2:
                        colour = self.colour_map [i]
                        break

                self.bitmap.setPixel (ix, iy, colour)

            if self.log_progress > 0 and (ix % self.log_progress) == 0:
                print "%d of %d" % (ix,self.size[0])
#-----------------------------------------------------------------------
    def drawStars(self, mode):
        """
        There are 6 planes perpendicular to the four axes depending on which two of the
        4 variables z0x, z0y, cx and cy are kept constant and which two are varied. I've
        labelled these, 'M', 'J', 'A', 'B', 'C', 'D'.

        M: Fixes Z0 and varies c. If z0 = (0,0) this draws the traditional mandelbrot.
        J: Fixes c and varies Z0. This draws the Julia sets, one for each value of c.
        A: Fixes Z0x and cx, varies z0y and cy.
        B: Fixes Z0x and cy, varies z0y and cx.
        C: Fixes Z0y and cx, varies z0x and cy.
        D: Fixes Z0y and cy, varies z0x and cx.

        Pattern is coloured according to how close z passes to the origin
        """

        self.initRanges (mode)

        ilist = range (0, self.iterations)

        for ix in range (0, self.size [0]):
            for iy in range (0, self.size [1]):

                z,c = self.modefun (ix, iy)
                colour = BLACK_INDEX

                mind = 2
                
                for i in ilist:
                    z = z * z + c
                    d = abs (z)
                    
                    if d >= 2:
                        n = int (mind/self.starfactor)
                        n = min (n, 254)
                        colour = chr(n+1)
                        break
                    else:
                        mind = min(d, mind)

                self.bitmap.setPixel (ix, iy, colour)

            if self.log_progress > 0 and (ix % self.log_progress) == 0:
                print "%d of %d" % (ix,self.size[0])
#-----------------------------------------------------------------------
    def drawBands(self, mode, use_r, use_i):
        """
        There are 6 planes perpendicular to the four axes depending on which two of the
        4 variables z0x, z0y, cx and cy are kept constant and which two are varied. I've
        labelled these, 'M', 'J', 'A', 'B', 'C', 'D'.

        M: Fixes Z0 and varies c. If z0 = (0,0) this draws the traditional mandelbrot.
        J: Fixes c and varies Z0. This draws the Julia sets, one for each value of c.
        A: Fixes Z0x and cx, varies z0y and cy.
        B: Fixes Z0x and cy, varies z0y and cx.
        C: Fixes Z0y and cx, varies z0x and cy.
        D: Fixes Z0y and cy, varies z0x and cx.

        Pattern is coloured according to the bands colouring scheme, which treets how
        close the iterand gets to the origin in the x and y directions before
        escaping as separate contributions to the final colour.
        'use_i' and 'use_r' can be used to switch off the individual halves
        of the pattern.
        """

        self.initRanges (mode)

        ilist = range (0, self.iterations)

        for ix in range (0, self.size [0]):
            for iy in range (0, self.size [1]):

                z,c = self.modefun (ix, iy)
                colour = BLACK_INDEX
                
                minx = 2
                miny = 2
                
                for i in ilist:
                    z = z * z + c
                    d = abs (z)
                    
                    if d >= 2:
                        colour = 17
                        if use_r:
                            colour += 16 * min (int (minx/self.starfactor), 14)
                        else:
                            colour += 224
                        if use_i:
                            colour += min (int (miny/self.starfactor), 14)
                        else:
                            colour += 14

                        colour = chr(colour)
                        break
                    else:
                        minx = min(abs(z.real), minx)
                        miny = min(abs(z.imag), miny)
                        
                self.bitmap.setPixel (ix, iy, colour)

            if self.log_progress > 0 and (ix % self.log_progress) == 0:
                print "%d of %d" % (ix,self.size[0])
#-----------------------------------------------------------------------
    def drawQuadrants (self, mode):
        """
        There are 6 planes perpendicular to the four axes depending on which two of the
        4 variables z0x, z0y, cx and cy are kept constant and which two are varied. I've
        labelled these, 'M', 'J', 'A', 'B', 'C', 'D'.

        M: Fixes Z0 and varies c. If z0 = (0,0) this draws the traditional mandelbrot.
        J: Fixes c and varies Z0. This draws the Julia sets, one for each value of c.
        A: Fixes Z0x and cx, varies z0y and cy.
        B: Fixes Z0x and cy, varies z0y and cx.
        C: Fixes Z0y and cx, varies z0x and cy.
        D: Fixes Z0y and cy, varies z0x and cx.

        Pattern is coloured according to angle of escape, when Z is first greater than 2
        """

        self.initRanges (mode)

        ilist = range (0, self.iterations)

        for ix in range (0, self.size [0]):
            for iy in range (0, self.size [1]):

                z,c = self.modefun (ix, iy)
                colour=BLACK_INDEX
                
                for i in ilist:
                    z = z * z + c
                    d = abs (z)
                    
                    if d >= 2:
                        ang = (math.atan2(z.imag, z.real) + math.pi)/(2 * math.pi)
                        cidx = int (ang * 254)
                        colour = chr(cidx+1)
                        break
                        
                self.bitmap.setPixel (ix, iy, colour)

            if self.log_progress > 0 and (ix % self.log_progress) == 0:
                print "%d of %d" % (ix,self.size[0])
#-----------------------------------------------------------------------
    def standardValues(self, mode):

        """
        There are 6 planes perpendicular to the four axes depending on which two of the
        4 variables z0x, z0y, cx and cy are kept constant and which two are varied. I've
        labelled these, 'M', 'J', 'A', 'B', 'C', 'D'.

        M: Fixes Z0 and varies c. If z0 = (0,0) this draws the traditional mandelbrot.
        J: Fixes c and varies Z0. This draws the Julia sets, one for each value of c.
        A: Fixes Z0x and cx, varies z0y and cy.
        B: Fixes Z0x and cy, varies z0y and cx.
        C: Fixes Z0y and cx, varies z0x and cy.
        D: Fixes Z0y and cy, varies z0x and cx.

        Rather than draw the pattern return an array of the pattern values
        """

        self.initRanges (mode)

        ilist = range (0, self.iterations)

        for ix in range (0, self.size [0]):
            for iy in range (0, self.size [1]):

                z,c = self.modefun (ix, iy)

                count  = -1
                for i in ilist:
                    z = z * z + c
                    if abs(z) >= 2:
                        count = i
                        break

                ret.append(count)
            if self.log_progress:
                print "%d of %d" % (ix,self.size[0])
        return ret
#-----------------------------------------------------------------------
    def whereIs(self, xpos, ypos, mode):
        """
        Given a co-ordinate in pixel space returns its co-ordinates
        in the pattern space
        """

        if mode == 'A':
            ix = 1
            iy = 3

        elif mode == 'B':
            ix = 1
            iy = 2

        elif mode == 'C':
            ix = 0
            iy = 3

        elif mode == 'D':
            ix = 0
            iy = 2

        elif mode == 'M':
            ix = 2
            iy = 3

        elif mode == 'J':
            ix = 0
            iy = 1

        x = self.position [ix] + self.scale * (xpos - self.size [0] / 2)
        y = self.position [iy] + self.scale * (ypos - self.size [1] / 2)

        if mode == 'A':
            return (self.position [0], x, self.position [2], y)

        elif mode == 'B':
            return (self.position [0], x, y, self.position [3])

        elif mode == 'C':
            return (x, self.position [1], self.position [2], y)

        elif mode == 'D':
            return (x, self.position [1], y, self.position [3])

        elif mode == 'M':
            return (self.position [0], self.position [1], x, y)

        elif mode == 'J':
            return (x, y, self.position [2], self.position [3])

        return (0,0,0,0)
    
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def setIterations (self, num):
        """
        Set the number of iteration and the colour map
        """
        
        self.buildColourMap (num)
        self.iterations = num
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def buildColourMap (self, size):
        """
        Build a colour map with the specified number of colours.
        Index 0 relates to black, 1 - 255 are up for grabs.
        """

#        add = 255 - (size % 255)
#       f   = float (size + add) / float (size)

#        self.colour_map = [chr(1 + (int(i * f) % 255)) for i in range (0,size)]

        inc = 1
        col = 1
        self.colour_map = []

        while len(self.colour_map) < size:
            for i in range (inc):
                self.colour_map.append (chr(col))
            col += 1
            if col == 256:
                col = 1
                inc *= 2

        self.pfuns [self.palette] ()

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def pf1 (self):
        """        Creates the palette colours for the bitmap.
        Dark Blue -> Cyan -> Green
        """

        palette = [BLACK]

        m1 = ColourMap.createLinear (ColourMap.dk_blue, ColourMap.cyan, 128)
        m2 = ColourMap.createLinear (ColourMap.cyan, ColourMap.dk_green, 128)

        m1 = m1 [:-1] + m2

        for m in m1:
            m = m + chr(0)
            palette.append (m)

        self.bitmap.colourmap = palette

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def pf2 (self):
        """        Creates the palette colours for the bitmap.
        Dark Red -> Yellow -> Blue
        """

        palette = [BLACK]

        m1 = ColourMap.createLinear (ColourMap.dk_red, ColourMap.yellow, 128)
        m2 = ColourMap.createLinear (ColourMap.dk_blue, ColourMap.cyan, 128)

        m1 = m1 [:-1] + m2

        for m in m1:
            m = m + chr(0)
            palette.append (m)

        self.bitmap.colourmap = palette        
                
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def pf3 (self):
        """        Creates the palette colours for the bitmap.
        Dark blue to cyan. Used for the star drawing algorithm
        """

        palette = [BLACK]

        m1 = ColourMap.createLinear (ColourMap.cyan, ColourMap.dk_blue, 255)

        for m in m1:
            m = m + chr(0)
            palette.append (m)

        self.bitmap.colourmap = palette        

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def pf4 (self):
        """        Creates the palette colours for the bitmap.
        This one increments red and green in 15 steps and is used by the 'bands'
        colouring scheme.
        """

        palette = [BLACK]*256

        for i in range (0,15):
            green = 255-16*i
            for j in range (0,15):
                red = 255-12*j
                idx = 16*i+j+17
                palette[idx]=chr(0)+chr(green)+chr(red)+chr(0)

        self.bitmap.colourmap = palette        

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def pf5 (self):
        """        Creates the palette colours for the bitmap.
        This one increments blue and green in 15 steps and is used by the 'bands'
        colouring scheme.
        """

        palette = [BLACK]*256

        for i in range (0,15):
            green = 255-16*i
            for j in range (0,15):
                blue = 255-12*j
                idx = 16*i+j+17
                palette[idx]=chr(blue)+chr(green)+chr(0)+chr(0)

        self.bitmap.colourmap = palette        
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def pf6 (self):
        """        Creates the palette colours for the bitmap.
        This one creates 4 colours for the quadrants scheme
        """

        palette = [BLACK]*256
        l = [0,255]
        for i in range (1,129):
            palette[i]=chr(min(128+i,255))+chr(min(255,2*i))+chr(0)+chr(0)
        for i in range (1,128):
            palette[128+i]=chr(255-2*i)+chr(255-2*i)+chr(2*i+1)+chr(0)
        self.bitmap.colourmap = palette        
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def pf7 (self):
        """
        Yellow and blue bands
        """

        palette = [BLACK]*256
        yellow  = chr(0)+chr(255)+chr(255)+chr(0)
        blue    = chr(128)+chr(0)+chr(0)+chr(0)

        for i in range (1,256):
            palette[i]=[yellow,blue][i%2]

        self.bitmap.colourmap = palette

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def pf8 (self):
        """
        Thin red bands
        """

        palette    = [WHITE]*256
        palette[0] = BLACK

        for i in range (4):
            for j in range (3):
                palette[64*i+j+1]  = chr(0)+chr(0)+chr(128)+chr(0)
                palette[64*i+j+4]  = chr(0)+chr(0)+chr(192)+chr(0)
                palette[64*i+j+7]  = chr(0)+chr(0)+chr(255)+chr(0)
                palette[64*i+j+10] = chr(64)+chr(64)+chr(255)+chr(0)
                palette[64*i+j+13] = chr(128)+chr(128)+chr(255)+chr(0)
                palette[64*i+j+16] = chr(192)+chr(192)+chr(255)+chr(0)

                palette[64*i+j+33] = chr(0)+chr(64)+chr(128)+chr(0)
                palette[64*i+j+36] = chr(0)+chr(96)+chr(192)+chr(0)
                palette[64*i+j+39] = chr(0)+chr(128)+chr(255)+chr(0)
                palette[64*i+j+42] = chr(64)+chr(160)+chr(255)+chr(0)
                palette[64*i+j+44] = chr(128)+chr(192)+chr(255)+chr(0)
                palette[64*i+j+47] = chr(192)+chr(224)+chr(255)+chr(0)

        self.bitmap.colourmap = palette
