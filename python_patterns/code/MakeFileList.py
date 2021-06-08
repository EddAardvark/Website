#==============================================================
# (c) John Whitehouse 2002-2003
# htpp://www.eddaardvark.co.uk/
#==============================================================

import string

def MakeFileList (path, root, extension, start, num):
    """
    Returns a list of sequential file names of the format
            path\rootddddd.extension

    where ddddd is the index number, in the range start to
    start + num - 1, padded out to five digits with leading zeros.
    """

    ret = []

# ensure the separator characters are present

    if path [-1] != '\\':
        path = path + '\\'

    if extension [0] != '.':
        extension = '.' + extension

# make the file list

    for i in range (start, start + num):
        index = string.zfill(i, 5)
        ret.append (path + root + index + extension)

    return ret        
