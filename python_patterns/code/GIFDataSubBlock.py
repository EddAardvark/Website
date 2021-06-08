#==============================================================
# (c) John Whitehouse 2002-2003
# htpp://www.eddaardvark.co.uk/
#==============================================================

#==============================================================
# A GIF File data sub-block
#==============================================================

class GIFDataSubBlock:

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def __init__ (self):
        "Initialise"
        
        self.length = 0      # The length
        self.text   = ''     # The content

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def copy (self):
        "Return a copy"

        ret = GIFDataSubBlock ()
        
        ret.length = self.length
        ret.text   = self.text

        return ret        

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def readFromFile (self, file):
        "Read a data sub-block from the current point in the file"
        
        self.length = ord (file.read (1)[0])

        if self.length > 0:
            self.text = file.read (self.length)

        else:
            self.text = ''
    
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    def writeToFile (self, file):
        """
        Write the data sub-block to a file.close
            - Doesn't write 0 length blocks
        """

        if self.length > 0:
            file.write (chr(self.length))
            file.write (self.text)
            
