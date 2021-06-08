#==============================================================
# (c) John Whitehouse 2002-2003
# htpp://www.eddaardvark.co.uk/
#==============================================================

import struct

READ_FORMAT = '=BBHBB'
READ_SIZE   = 6
WRITE_FORMAT = '=BBBBHBB'

#================================================================================
# a GIF Graphic Control Extension
#================================================================================

class GIFGraphicControlExtension:
    """
    Read a graphic control extension
        BYTE    EXTENSION       = 0x21
        BYTE    GC_EXTENSION    = 0xf9

        BYTE    size = 4
        BYTE    flags
        WORD    delay
        BYTE    transparent colour
        BYTE    terminator = 0
    """

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def __init__ (self):
        "Initialise"

        self.FlagsByte = 0
        self.Delay     = 0
        self.TransIdx  = 0
        self.Flags     = (0,0,0)
        self.typename  = 'GIFGraphicControlExtension'

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def copy (self):
        "Make a copy of this GIFGraphicControlExtension and return it"

        ret = GIFGraphicControlExtension ()
        
        ret.FlagsByte = self.FlagsByte
        ret.Delay     = self.Delay
        ret.TransIdx  = self.TransIdx
        ret.Flags     = self.Flags
        ret.typename  = 'GIFGraphicControlExtension'

        return ret
    
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def readFromFile (self, file):
        """
        Read from a file. This assumes that the two header bytes
        0x21 and 0xf9 have already been read.
        """
        
        s = file.read (READ_SIZE)
        gce = struct.unpack (READ_FORMAT, s)

        self.FlagsByte = gce [1]
        self.Delay     = gce [2]
        self.TransIdx  = gce [3]

        if gce [4] != 0 or gce [0] != 4:
            print "**** Error reading Graphic Control Extension ****"
            return
        
        self.Flags = self.decodeFlags ()

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def decodeFlags (self):
        """
        Translates the Graphics control extension flags
        (r1, r2, r3)
        
        r1 = Use transparancy               1 bit
        r2 = User input flag                1 Bit
        r3 = Disposal method                3 bits
        """

        byte = self.FlagsByte

        r1 = byte % 2   # Transparent
        byte /= 2
        r2 = byte % 2   # User input
        byte /= 2
        r3 = byte % 8   # Disposal

        return (r1, r2, r3)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def writeToScreen (self, detailed):
        """
        Set detailed to 1 for long version, 0 for short
        """
        print "Graphic control Extension"

        if detailed:
            print "  Delay = ", self.Delay
            print "  Disposal = ", self.Flags [2] 
            print "  User Input = ", self.Flags [1]
            print "  Use transparancy = ", self.Flags [0]

            if self.Flags [0]:
                print "  Transparancy Colour Index = ", self.TransIdx

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def writeToFile (self, file):
        "Write the graphics control extension and its sub-blocks to a file"

        s = struct.pack (WRITE_FORMAT, 0x21, 0xf9, 4, self.FlagsByte, self.Delay, self.TransIdx, 0)
        file.write (s)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def setDelay (self, delay):
        """        Sets the delay time between images in an animation.
        'delay' is in increments of 1/100th second, max 255.
        """

        self.Delay = delay % 256
