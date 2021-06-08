#==============================================================
# (c) John Whitehouse 2002-2003
# htpp://www.eddaardvark.co.uk/
#==============================================================

import struct

from GIFDataSubBlock import *

# transforms size fields to actual values

pow = [2, 4, 8, 16, 32, 64, 128, 256] # 2^(i+1)

# for parsing

READ_FORMAT  = '=HHHHB'
READ_SIZE    = 9
WRITE_FORMAT = '=BHHHHB'

#==============================================================
# GIF Image block
# As well as the GIF header we have to read the local colour
# table (if it is present) and the data blocks. The data blocks
# are preceded by a single byte indicating the number of bits
# used in encoding
#==============================================================

class GIFImage:

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def __init__ (self):
        "Initialise"
        
        self.Left      = 0
        self.Top       = 0
        self.Width     = 0
        self.Height    = 0
        self.FlagsByte = 0
        self.Flags     = (0,0,0,0)
        self.CodeBits  = 0
        self.typename  = 'GIFImage'
        self.colours   = []    
        self.SubBlocks = []

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def copy (self):
        "make a copy of this image and return it"

        ret = GIFImage ()
        
        ret.Left      = self.Left
        ret.Top       = self.Top
        ret.Width     = self.Width
        ret.Height    = self.Height
        ret.FlagsByte = self.FlagsByte
        ret.Flags     = self.Flags
        ret.CodeBits  = self.CodeBits
        ret.typename  = 'GIFImage'

    # copy the colours

        ret.colours = [c for c in self.colours]

    # copy the sub-blocks
    
        for sb in self.SubBlocks:
            ret.SubBlocks.append (sb.copy ())

        return ret            

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    
    def readFromFile (self, file):
        """
        Read the block from the file. Assumes that the image separator
        0x2c has already been read
        
            BYTE    IMAGE_SEPARATOR = 0x2c
            WORD    left        in pixels
            WORD    top         in pixels
            WORD    width       in pixels
            WORD    height      in pixels
            BYTE    flags       flags

            Local colour table (optional)
            Sub-blocks
        """

        s = file.read (READ_SIZE)
        img = struct.unpack (READ_FORMAT, s)

        self.Left      = img [0]
        self.Top       = img [1]
        self.Width     = img [2]
        self.Height    = img [3]
        self.FlagsByte = img [4]

        self.Flags     = self.decodeFlags ()        

    # Local colour table

        self.colours = []    

        if self.Flags [3]:
            num = pow [self.Flags [0]]

            for i in range (0,num):
                s = file.read (3)
                c = struct.unpack ('BBB', s)
                colours.append (c)

    # Image Data

        self.CodeBits = ord (file.read (1)[0])

    # Sub-blocks
    
        self.SubBlocks = []

        while 1:
            sb = GIFDataSubBlock ()

            sb.readFromFile (file)

            if sb.length == 0:
                break

            self.SubBlocks.append (sb)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    
    def decodeFlags (self):
        """
        Translates the Image descriptor flags byte into it's separate values
        (r1, r2, r3, r4)
        
        r1 = Size of Local Color Table     3 Bits (2^(n+1) 3 byte colours)
        reserved                           2 Bits - not returned
        r2 = Sort Flag                     1 Bit
        r3 = Interlaced                    1 Bit
        r4 = Local Color Table Flag        1 Bit
        """

        byte = self.FlagsByte

        r1 = byte % 8   # Size of colour table
        byte /= 8
        byte /= 4       # reserved
        r2 = byte % 2   # Sort flag
        byte /= 2
        r3 = byte % 2   # Interlaced flag
        byte /= 2
        r4 = byte % 2   # Colour table present
        
        return (r1, r2, r3, r4)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    
    def writeToScreen (self, detailed):
        """
        Set detailed to 1 for long version, 0 for short
        """

        if detailed:
            print "Image: Position = (%d, %d), Size = %d x %d" % (self.Left, self.Top, self.Width, self.Height)
            print "  Sort = ", self.Flags [1]
            print "  Interlaced = ", self.Flags [2]
            print "  Local colour table = ", self.Flags [3]
            print "  Image code bits = ", self.CodeBits

            size = 0
            for sb in self.SubBlocks:
                size += sb.length

            print "  Num Data blocks = %d, total size = %d" % (len (self.SubBlocks), size)

            if self.Flags [3]:
                print "Colour Table Size = ", pow [self.Flags [0]]
        else:
            print "Image (%d sub-blocks)" % len (self.SubBlocks)
            
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def writeToFile (self, file):
        "Write the image and its sub-blocks to a file"

        s = struct.pack (WRITE_FORMAT, 0x2c,
                                        self.Left,
                                        self.Top,
                                        self.Width,
                                        self.Height,
                                        self.FlagsByte)

        file.write (s)

    # Local colour table

        if self.Flags [3]:
            num_colours = pow [self.Flags [0]]

            for i in range (0, num_colours):
                tup = self.colours [i]
                s = struct.pack ('=BBB', tup [0], tup [1], tup [2])
                file.write (s)

    # Image Data

        s = struct.pack ('=B', self.CodeBits)
        file.write (s)

    # Now the sub-blocks

        for sb in self.SubBlocks:
            sb.writeToFile (file)
            
    # And a sub-block terminator        

        file.write ('\x00')
