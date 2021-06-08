#==============================================================
# (c) John Whitehouse 2002-2003
# htpp://www.eddaardvark.co.uk/
#==============================================================

from GIFFile import *

# Example function
#
# This function assumes that there are 100 GIF files in the
# folder 'c:\\python22\\work\\example' called 'example10000.gif'
# through to 'example10099.gif'. It will create an output file
# called 'sequence.gif' in the same folder.
# It also returns the GIFFile object so that you can manipulate
# further and/or inspect it.
#
# To use
#
#   import GIFAnimator
#   GIFAnimator.Example ()
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def Example ():

    import MakeFileList
    flist = MakeFileList.MakeFileList ('c:\\python22\\work\\example', 'example', 'gif', 1000, 200)
    animation = buildFromFiles (flist)

# make it a bit faster

    animation.setDelay (10)

# Save and return

    animation.writeToFile ('c:\\python22\\work\\animation.gif')    
    return animation

#==============================================================
# Animated GIF Creator - creates a GIF file as a combination
# of a list of the supplied files.
#
# Does nothing clever, the basic canvas is the largest width
# and height of the input files and all the files are positioned
# at (0,0)
#
# The palette is taken from the first file.
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

def buildFromFiles (filenames):
    """
    Build an animated GIF from a set of GIF files
    The files are assembled in the order they appear in the list
    """

# Create the output file
    
    result = GIFFile ()

# Read the input files

    InputFiles  = []   # The list of input files that generate the animation

    for fname in filenames:
        print "Reading " + fname
        gif = GIFFile ()
        gif.readFile (fname)

        InputFiles.append (gif)

# Initialise the output file (copy the header and colour table)

    if len (InputFiles) > 0:
        result.hdr = InputFiles [0].hdr.copy ()

    if InputFiles [0].colours != None:
        result.colours = [c for c in InputFiles [0].colours]

# Calculate the screen size and copy the image data blocks

    for f in InputFiles:
        if f.hdr.Width > result.hdr.Width:
            result.hdr.Width = f.hdr.Width
        if f.hdr.Height > result.hdr.Height:
            result.hdr.Height = f.hdr.Height

        copyImageData (f, result)
            
# put the animation things in

    result.insertMyComment ()
    result.setRepeatCount  (0)  # infinity
    result.setDelay        (50) # 1/2 second

    return result

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

def copyImageData (source, dest):
    """
    Scan through the records in 'source' looking for graphics control extensions
    and image data blocks. If there isn't a graphics control extension block preceding
    and image data block then we create and insert one.
    """

    gce = None
    
    for block in source.contents:
        if block.typename == 'GIFGraphicControlExtension':
            gce = block.copy ()

    # We've found the image. If we already have a GCE then use it, otherwise
    # create a default one and use that.
    
        elif block.typename == 'GIFImage':
            if gce == None:
                gce = GIFGraphicControlExtension ()

            img = block.copy ()

            dest.contents.append (gce)
            dest.contents.append (img)

            gce = None

    # The GCE must be immediately before the image so if something intervenes it isn't
    
        else:
            gce = None            
        

        
        