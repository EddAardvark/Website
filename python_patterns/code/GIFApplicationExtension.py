#==============================================================
# (c) John Whitehouse 2002-2003
# htpp://www.eddaardvark.co.uk/
#==============================================================

import struct

# GIF Components

from GIFDataSubBlock import *

# To parse the block

READ_FORMAT   = '=B8s3s'
READ_SIZE     = 12
WRITE_FORMAT  = '=BBB8s3s'

#==============================================================
# An application extension.
#
# Special case
#  App  =  NETSCAPE
#  Code =  2.0
#  Num Sub-blocks =  1
#
#   Used to encode repeat count for animated GIFs
#
#==============================================================

class GIFApplicationExtension:

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def __init__ (self):
        "Initialise"
        
        self.AppName   = ''
        self.AppCode   = ''
        self.typename  = 'GIFApplicationExtension'
        self.SubBlocks = []    

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    
    def readFromFile (self, file):
        """
        Read an application extension. Asumes that the two header
        bytes have already bean read.

            BYTE    EXTENSION               = 0x21
            BYTE    APPLICATION_EXTENSION   = 0xff
            
            BYTE    size = 11
            BYTE    name [8]
            BYTE    code [3]

            Sub-blocks            
        """
        
        s  = file.read (READ_SIZE)
        ae = struct.unpack (READ_FORMAT, s)

        if ae [0] != 11:
            print "**** Size mismatch in Application Extension ****"
            return

        self.AppName   = ae [1]
        self.AppCode   = ae [2]
        self.SubBlocks = []        

        while 1:
            sb = GIFDataSubBlock ()

            sb.readFromFile (file)

            if sb.length == 0:
                break

            self.SubBlocks.append (sb)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    
    def writeToScreen (self, detailed):
        """
        Write a desctiption of this entity to the screen
        Set detailed to 1 for long version, 0 for short
        """

        if detailed:
            print "Application Extension"
            print "  App  = ", str(self.AppName)
            print "  Code = ", str(self.AppCode)
            print "  Num Sub-blocks = ", len (self.SubBlocks)

            if self.isNetscape ():
                nsparams = struct.unpack ('=BH', self.SubBlocks [0].text)
                print "  Netscape 2.0 block: ", nsparams
        else:
            print "Application Extension (%d sub-blocks)" % len (self.SubBlocks)
            
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def isNetscape (self):
        "Is this a Netscape repeat count block?"

        return self.AppCode == '2.0' and self.AppName == 'NETSCAPE' and len (self.SubBlocks) >= 1
                
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def makeNetscape (self, repeat):
        """
        Make a netscape APplication Extension block with the specified
        repeat count.
        """
        self.AppName   = 'NETSCAPE'
        self.AppCode   = '2.0'
        self.SubBlocks = []

    # Make the repeat count sub-block

        sb = GIFDataSubBlock ()
        sb.length = 3
        sb.text = struct.pack ('=BH', 1, repeat)

        self.SubBlocks.append (sb)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def writeToFile (self, file):
        "Write the application extension to a file"

        s = struct.pack (WRITE_FORMAT, 0x21, 0xff, 11, self.AppName, self.AppCode)
        file.write (s)

    # Now the sub-blocks

        for sb in self.SubBlocks:
            sb.writeToFile (file)
            
    # And a sub-block terminator        

        file.write ('\x00')
