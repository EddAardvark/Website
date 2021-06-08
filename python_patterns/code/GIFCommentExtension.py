#==============================================================
# (c) John Whitehouse 2002-2003
# htpp://www.eddaardvark.co.uk/
#==============================================================

import struct

# GIF Components

from GIFDataSubBlock import *

#==============================================================
# Read some comments from the file
# The comments are in sub-blocks following the prefix codes
#==============================================================

class GIFCommentExtension:

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def __init__ (self):
        "Initialise"
        
        self.typename  = 'GIFCommentExtension'
        self.SubBlocks = []

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    
    def readFromFile (self, file):

        """
        No specific content, only sub-blocks. Assumes that the prefix
        codes have already been read
        """

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
        Set detailed to 1 for long version, 0 for short
        """

        print "Comment (%d sub-blocks)" % len (self.SubBlocks)

        if detailed:
            for sb in self.SubBlocks:
                print "    [%d] %s" % (sb.length, sb.text)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def writeToFile (self, file):
        "Write the comment extension and its sub-blocks to a file"

    # Prefix codes

        file.write ('\x21\xfe')

    # Now the sub-blocks

        for sb in self.SubBlocks:
            sb.writeToFile (file)
            
    # And a sub-block terminator        

        file.write ('\x00')

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def makeMyComment (self):
        "Add a comment with my name etc."
        
        self.SubBlocks = []

        sb = GIFDataSubBlock ()
        sb.text = 'Created using python modules by John Whitehouse - http://www.eddaardvark.co.uk'
        sb.length = len(sb.text)

        self.SubBlocks.append (sb)


        
