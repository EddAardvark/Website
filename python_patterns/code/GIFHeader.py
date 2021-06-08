#==============================================================
# (c) John Whitehouse 2002-2003
# htpp://www.eddaardvark.co.uk/
#==============================================================

import struct

# The header size and format

HDR_FORMAT = '=3s3sHHBBB'
HDR_SIZE   = 13

# Translates colour table size to an actual number

pow = [2, 4, 8, 16, 32, 64, 128, 256] # 2^(i+1)

#==============================================================
# GIF Header
# Combines the header and the logical screen descriptor as
# they always appear to follow each other
#
#==============================================================

class GIFHeader:
    """
    GIF-File Formats

    struct GIFHEADER
    {
        BYTE    sig [3]     signature (GIF)
        BYTE    ver [3]     version (87a or 89a)
        WORD    width       in pixels
        WORD    height      in pixels
        BYTE    ct_flags    Colour table flags
        BYTE    back_index  Background colour index
        BYTE    pix_aspect  Pixel Aspect Ratio
    } ;
    """
    
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def __init__ (self):
        "Initialise"
        self.Sig             = 'GIF'
        self.Version         = '89a'
        self.Width           = 40
        self.Height          = 30
        self.FlagsByte       = 0
        self.BackIndex       = 0
        self.PixAspect       = 0
        self.Flags           = None

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def copy (self):
        "Make a copy of this header and return it"

        ret = GIFHeader ()
        
        ret.Sig       = self.Sig
        ret.Version   = self.Version
        ret.Width     = self.Width
        ret.Height    = self.Height
        ret.FlagsByte = self.FlagsByte
        ret.BackIndex = self.BackIndex
        ret.PixAspect = self.PixAspect
        ret.Flags     = self.Flags

        return ret

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def readFromFile (self, file):
        """
        Read the header and logical screen descriptor from the
        specified file
        """

        hdr  = file.read     (HDR_SIZE)
        vals = struct.unpack (HDR_FORMAT, hdr)

        self.Sig        = vals [0]
        self.Version    = vals [1]
        self.Width      = vals [2]
        self.Height     = vals [3]
        self.FlagsByte  = vals [4]
        self.BackIndex  = vals [5]
        self.PixAspect  = vals [6]
        self.Flags      = self.decodeFlags ()

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def decodeFlags (self):
        """
        Translates the colour table byte into it's separate values
        (r1, r2, r3, r4)
        
        r1 = Size of Global Color Table    3 Bits (2^(n+1) 3 byte colours)
        r2 = Sort Flag                     1 Bit
        r3 = Color Resolution              3 Bits
        r4 = Global Color Table Flag       1 Bit
        """
        byte = self.FlagsByte
        
        r1 = byte % 8   # Size of colour table
        byte /= 8
        r2 = byte % 2   # Sort flag
        byte /= 2
        r3 = byte % 8   # Colour resolution
        byte /= 8
        r4 = byte % 2   # Colour table present
        
        return (r1, r2, r3, r4)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def colourTableSize (self):
        "How big is the colour table?"

        if self.Flags [3]:        
            return pow [self.Flags [0]]

        return 0

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def typeName (self):
        return "GIF Header"
    
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def writeToScreen (self):
        "Print the header contents"
        print "GIF Header"
        print "  Sig = ", self.Sig
        print "  Gif Version = ", self.Version
        print "  Size = %d x %d" % (self.Width, self.Height)
        print "  Colour table present = ", self.Flags [3]

        if self.Flags [3]:        
            print "  Num Colours = ", pow [self.Flags [0]]
            print "  Sort colour table = ", self.Flags [1]
            print "  Color Resolution = %d bits" % (self.Flags [2])
            
        print "  Pixel Aspect = ", self.PixAspect

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def writeToFile (self, file):
        "Write the header to a file"

        hdr = struct.pack (HDR_FORMAT,
                            self.Sig,
                            self.Version,
                            self.Width,
                            self.Height,
                            self.FlagsByte,
                            self.BackIndex,
                            self.PixAspect)

        file.write (hdr)

