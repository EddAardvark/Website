#==============================================================
# (c) John Whitehouse 2002-2003
# htpp://www.eddaardvark.co.uk/
#==============================================================

import struct

# GIF Components

from GIFHeader import *
from GIFImage import *
from GIFDataSubBlock import *
from GIFGraphicControlExtension import *
from GIFCommentExtension import * 
from GIFApplicationExtension import *

# static data

testfiles = ['c:\\Python22\\work\\test.gif',
             'c:\\Python22\\work\\test2.gif',
             'c:\\Python22\\work\\sequence2.gif']

# Some GIF constants

EXTENSION       = 0x21
IMAGE_SEPARATOR = 0x2c
END_OF_FILE     = 0x3b

GRAPHIC_CONTROL_EXTENSION = 0xf9
COMMENT_EXTENSION         = 0xfe
PLAIN_TEXT_EXTENSION      = 0x01
APPLICATION_EXTENSION     = 0xff

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def Test (file_index):
    """
    Test function.
    Call with an index to one of the files in 'testfiles'
    """
    
    gif = GIFFile ()
    gif.readFile (testfiles [file_index])
    return gif

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def WriteTest ():
    """
    Write Test function.
    """

    WriteTest2 (testfiles[2])
    
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def WriteTest2 (input):
    """
    Write Test function.
    """

    gif = GIFFile ()
    gif2 = GIFFile ()
    
    gif.readFile    (input)
    gif.writeToFile ('c:\\python22\\work\\writetest.gif')
    gif2.readFile   ('c:\\python22\\work\\writetest.gif')
    
    return (gif, gif2)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def WantedBlock (block):
    """
    Used by the clean method to remove unwanted blocks, returns
    0 if a block is an unknown application extension or a comment.
    """

    if block.typename == 'GIFCommentExtension':
        return 0

    if block.typename == 'GIFApplicationExtension' and not block.isNetscape ():
        return 0

    return 1

#==============================================================
# GIF File decoding class
#
# File structure is
#
#   Header
#   Logical screen descriptor
#   Global colour table (optional)
#   Netscape 2.0 application extension (optional)
#     - defines the repeat count for animation
#   Sequence of other records
#==============================================================

class GIFFile:

    def __init__ (self):
        "Initialise"
        
        self.the_file = None         # The file
        self.hdr      = GIFHeader () # The Header
        self.colours  = []           # The colour map
        self.contents = []           # The contents

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def readFile (self, filename):
        "Read in a GIF file"

    # Open the file

        self.the_file = open (filename, "rb")

    # read the heading
    
        self.hdr = GIFHeader ()
        self.hdr.readFromFile (self.the_file)

        if self.hdr.Sig != 'GIF':
            print "****** Not a GIF File ******"
            return

    # Read the colour table
    
        num_colours = self.hdr.colourTableSize ()
        self.colours = []
        
        if num_colours > 0:        
            for i in range (0,num_colours):
                s = self.the_file.read (3)
                c = struct.unpack ('=BBB', s)
                self.colours.append (c)
        else:
            self.colours = None

    # Read the data blocks

        self.contents = []

        while 1:
            
            sep   = ord (self.the_file.read (1)[0])
            block = None

            if sep == END_OF_FILE:
                break

            elif sep == IMAGE_SEPARATOR:
                block = GIFImage ()
                block.readFromFile (self.the_file)
            
            elif sep == EXTENSION:
                block = self.readExtension ()

            else:
                print "**** Sep = " + hex (sep) + " ****"
                break

        # Add new block to the list
        
            if block != None:
                self.contents.append (block)

    # Close the file
    
        self.the_file.close ()

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def readExtension (self):
        """
        Read an Extension Block!
        byte 1  0x21 - already read
        byte 2  Application Extension Label
        """
        ret = None
        type = ord (self.the_file.read (1)[0])

        if type == GRAPHIC_CONTROL_EXTENSION:
            ret = GIFGraphicControlExtension ()

        elif type == COMMENT_EXTENSION:
            ret = GIFCommentExtension ()

        elif type == PLAIN_TEXT_EXTENSION:
            print "Plain Text Extension - Not implemented"

        elif type == APPLICATION_EXTENSION:
            ret = GIFApplicationExtension ()

        if ret != None:
            ret.readFromFile (self.the_file)

        return ret            

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def writeToScreen (self, detailed):
        """
        Write the contents to the screen as text
        If 'detailed' is only a summary is written
        """

        if self.the_file != None:
            print "File: " + self.the_file.name
        else:
            print "File: (none)"

        if detailed:        
            self.hdr.writeToScreen ()
            
        num_colours = self.hdr.colourTableSize ()
        print "  Colour table size = ", num_colours

        back_index   = self.hdr.BackIndex
        print "  Background: Colour [%d] = %s" % (back_index, str(self.colours [back_index]))

    # Write out the contents
    
        for c in self.contents:
            c.writeToScreen (detailed)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def writeToFile (self, filename):
        """
        Write the contents to a file.close
            - Don't forget the binary flag when opening the file :-(
        """

        file = open (filename, "wb")

        self.hdr.writeToFile (file)
            
        num_colours = self.hdr.colourTableSize ()

    # write the colour table
    
        if num_colours > 0:
            for i in range (0, num_colours):
                tup = self.colours [i]
                s = struct.pack ('=BBB', tup [0], tup [1], tup [2])
                file.write (s)

    # Write out the contents
    
        for c in self.contents:
            c.writeToFile (file)

    # End of file

        s = struct.pack ('=B', END_OF_FILE)
        file.write (s)
        
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def countRecords (self):
        """
        Return a map of frequencies for the different record types
        """

        ret = {}            

        # Initialise with the known types

        ret ['GIFImage'] = 0
        ret ['GIFGraphicControlExtension'] = 0 
        ret ['GIFCommentExtension'] = 0
        ret ['GIFApplicationExtension'] = 0
        ret ['GIFPlainTextExtension'] = 0

        for c in self.contents:
            try:
                ret [c.typename] += 1
            except KeyError:
                ret [c.typename] = 1

        return ret                

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def setDelay (self, delay):
        """        Sets the delay time between images in an animation.
        'delay' is in increments of 1/100th second, max 255.
        """

        for c in self.contents:
            if c.typename == 'GIFGraphicControlExtension':
                c.setDelay (delay)
                
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def setRepeatCount (self, repeat):
        """        Sets the repeat count. This is a bit strange - a loop count of 0
        appears to be infinite and a loop count of one will display the sequence
        twice. To get the sequence to display one you have to remove the NETSCAPE
        block. This method sets the NETSCAPE repeat parameter to whatever is
        specified without considering the above.
        """

    # Remove any existing NETSCAPE block
    
        if self.hasNetscapeBlock ():
            self.contents.pop (0)

    # Insert NETSCAPE block as first block

        block = GIFApplicationExtension ()
        block.makeNetscape (repeat)

    # Insert it

        self.contents.insert (0, block)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def hasNetscapeBlock (self):
        """
        Is there a NETSCAPE block. If there is it will be the first
        block after the header/colour table
        """

        if len (self.contents) > 0 \
                and self.contents [0].typename == 'GIFApplicationExtension' \
                and self.contents [0].isNetscape ():
            return 1

        return 0

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def clean (self):
        """
        Removes comments and application extensions other than the NETSCAPE one.
        """

        self.contents = filter (WantedBlock, self.contents)
        
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def insertMyComment (self):
        "Insert a comment with my details"

        insert_pos = 0
        
    # See if there is a NETSCAPE block
    
        if self.hasNetscapeBlock ():
            insert_pos = 1

    # Create the comment

        cmt = GIFCommentExtension ()
        cmt.makeMyComment ()

    # Insert

        self.contents.insert (insert_pos, cmt)    
        
        

        
        