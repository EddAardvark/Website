"""
Solves Sudokus.
"""

# A counter

counter = 0

# Mode map. We can make patters that are 4x4, 6x6, 8x8, 9x9, 10x10, 12x12, 14x14 and 16x16
# that have three sets of constraints, rows, columns and blocks. This map determines
# the block size for a given grid size.
# The key is the mode, the numbers define the total size and the cell size (width x height).

modemap={ '4': (4,2,2),
          '6': (6,3,2),
          '8': (8,4,2),
          '9': (9,3,3),
          '10': (10,5,2),
          '12a': (12,6,2),
          '12b': (12,4,3),
          '14': (14,7,2),
          '16a': (16,8,2),
          '16b': (16,4,4)}

#---------------------------------------------------------------------------------------------------
def solve(pattern,mode='9',diagonal=False):
    """
    Solves a puzzle. Expects the input as an array of 9 (size) strings like the examples
    above. Each string represents one row of the puzzle, with the numbers 1-9 (size)
    representing themselves and '-' (or any other) characters for the unknown cells.
    16x16 version uses A-P.
    """

    su = SuSolver(mode,diagonal)

    # Apply the know cells
    
    su.setGivenValues(pattern)

    print "After first pass\n"
    printGrid(su.grid)

    ok = su.solve()
    if ok:
        print "\nSolution...\n"
    else:
        print "\n*** Failed ***\n"

    printGrid(su.grid)
    return su

#---------------------------------------------------------------------------------------------------
class SuSolver:
    def __init__(self, mode='9',diagonal=False):
        """
        Initialise the grid with every square potentially containing all the values
        """
        self.cell_lists = []
        self.setMode (mode,diagonal)
        self.grid = [[[k+1 for k in range(self.size)] for j in range (self.size)] for i in range(self.size)]
        self.solution_limit = 50
#---------------------------------------------------------------------------------------------------
    def description(self):
        """
        Return a string describing this puzzle
        """
        txt = "%dx%d with %dx%d sub-cells" % (self.size, self.size, self.cx, self.cy)
        if self.diagonals:
            txt += " and diagonals"
        return txt
#---------------------------------------------------------------------------------------------------
    def setMode(self, m, d):
        """
        Set the mode. These are described in the mode map
        """

        self.mode = m
        self.size = modemap [m][0]
        self.cx   = modemap [m][1]
        self.cy   = modemap [m][2]
        self.diagonals = d

        self.makeCellLists()
#---------------------------------------------------------------------------------------------------
    def setGivenValues(self,pattern):
        """
        Set the given values
        """

        for row in range(self.size):
            text = pattern[row]
            for col in range(self.size):
                try:
                    n = fromSymbol(text[col], self.size)
                    if n > 0 and n <= self.size:
                        self.fixValue(row,col,n)
                except:
                    pass
#---------------------------------------------------------------------------------------------------
    def solve(self):
        """
        Assumes that we have fixed all the given values and we now have to search for the
        unknowns.
        """

        found = True
        self.solutions = []

    # Keep going until we find a solution or are forced to give up

        while found:
            if self.basicSolve ():
                return 1

            found = self.tryGuessing ()
            print "After Guessing, found = %d, todo = %d", (found, self.toDo())
            
            if self.toDo () == 0:
                self.solutions.append (makeSolutionKey(self.grid))
                return 1

    # If we didn't find anything then count the possible solutions.
    
        global counter
        counter = 0
        self.countSolutions()
#---------------------------------------------------------------------------------------------------
    def basicSolve (self):
        """
        Runs through a set of algorithms that identify impossible values and elimintates
        them. This quite often leads to a solution without the need to go into the
        recursive guessing mode.
        """
        # Eliminate the easy ones

        while self.doEasyBits():
            pass

        if self.toDo() == 0:
            print "Basic Solve has found a soluton"
            key = makeSolutionKey(self.grid)
            printGrid(self.grid)
            self.solutions = [key]
            return True

        print "\nAfter the easy bits..., todo = %d\n" % self.toDo()
        printGrid(self.grid)
        return False
#---------------------------------------------------------------------------------------------------
    def doEasyBits(self):
        """
        Applies simple rules to remove impossible values
        """

    # Locates those numbers that only appear once in a set of cells

        if self.removeSingleton():
            return True

    # Locates pairs of numbers that appear twice in a set of cells

        if self.findPairs():
            return True

        return False

#---------------------------------------------------------------------------------------------------
    def tryGuessing (self):
        """
        Goes through the list of undecided possibilities and eliminates those
        that lead to insoluble configurations. These are then eliminated. Returns
        True if an invalid guess is found.
        """
    # Build up a list of guesses

        guesses = self.EnumerateGuesses ()
        print "\nStarting Guessing: %d guesses to try" % len(guesses)

    # We work through the list of guesses trying each one in turn. If a guess doesn't
    # lead to a contradiction then that guess doesn't help us, so we restore the grid
    # and try the next guess. If a guess does lead to an exception then that guess can't
    # be correct so we can remove that possibility from the list. In this second case
    # we then exit the guessing loop and try the basic stuff again to see what the
    # consequences are.

        for g in guesses:
            found  = False
            backup = cloneGrid (self.grid)
            try:
                self.applyGuess(g)
                while self.doEasyBits():
                    pass

            except Exception,e:
                print 'Guess %s threw exception "%s"' % (g,e)
                found = True

        # Undo the guess
        
            self.grid = backup

        # found is true when a guess leads to a contradiction. If eliminating this guess
        # uniquely identifies the cell value then apply that fix to the rest of the grid.
        
            if found:
                (row,col,val) = g
                self.removeValue(row,col,val)
                if len(self.grid [row][col]) == 1:
                    self.fixValue(row,col,self.grid [row][col][0])
                    print 'After removing %d from (%d,%d)' % (val,row,col)
                    printGrid(self.grid)
                break
    # found will be false if we run through all the guesses without finding anything
        return found
#---------------------------------------------------------------------------------------------------
    def EnumerateGuesses (self):
        """
            Find the candidates for guessing and return them as a list
        """
        guesses = []

        for i in range(self.size):
            for j in range(self.size):
                if len (self.grid [i][j]) > 1:
                    for n in self.grid [i][j]:
                        guesses.append ((i,j,n))
        return guesses
#---------------------------------------------------------------------------------------------------
    def EnumerateUnresolved (self):
        """
        Find the cells that still contain choices
        """
        choices = []

        for row in range(0,self.size):
            for col in range(0,self.size):
                if len (self.grid [row][col]) > 1:
                    choices.append ((row,col,self.grid [row][col]))
        return choices
#---------------------------------------------------------------------------------------------------
    def countSolutions(self):
        """
        The algorithm didn't find a unique solution. We will use the remaining undecided 
        cells to generate a list of solutions. If there is only one then that's the solution.
        """
    # Is this the root of the recursion (when all the lists are empty)

        list = {}
        path = []

        try:
            ok = self.countSolutions2 (0, path, list)
        except:
            print "Exception"
            ok = False

        if len (list) > 0:
            if ok:
                print "%d solutions found" % len(list)
            else:
                print "Bailed out after finding %d solutions" % len(list)

            self.solutions = list.keys()
#---------------------------------------------------------------------------------------------------
    def countSolutions2(self, depth, path, list):
        """
        The algorithm didn't find a unique solution. We will use the remaining undecided 
        cells to generate a list of solutions. If there is only one then that's the solution.
        This function is recursive. Returns true if it reaches the end of the search, false
        if it bails out because there are too many.
        """

    # Get the list of unresolved cells and choose the first one

        choices = self.EnumerateUnresolved ()

    # Take the first choice and work through the possibilities

        if len(choices) > 0:
            (row, col, vals) = choices [0]
            if len(vals) > 1:
                for val in vals:
                    newpath = path + [(row,col,val)]
                    backup = cloneGrid (self.grid)
                    try:
                        self.fixValue (row,col,val)

                        while self.doEasyBits():
                            pass

                        global counter
                        counter += 1

                        if counter > 1000:
                            return False

                    # if this lead to a potential solution add it to our list
                    # if it was inconclusive try another guess
                    # if it threw an exception go round the loop trying the next value
                            
                        if self.toDo() == 0:
                            key = makeSolutionKey(self.grid)
                            try:
                                list[key] += 1
                            except KeyError:
                                list[key] = 1

                            if len(list.keys()) > self.solution_limit:
                                return False
                        else:
                            if not self.countSolutions2(depth+1, newpath, list):
                                return False

                    except Exception,e:
                        pass

                # Undo the guess

                    self.grid = backup
        return True
#---------------------------------------------------------------------------------------------------
    def toDo(self):
        """
        How many cells left
        """
        num = 0
        for row in self.grid:
            for cell in row:
                if len(cell) > 1:
                    num += 1
        return num
#---------------------------------------------------------------------------------------------------
    def applyGuess(self,g):
        """
        Alternative form of fixValue, g = (row,col,val)
        """
        self.fixValue (g[0],g[1],g[2])
#---------------------------------------------------------------------------------------------------
    def fixValue(self,row,col,val):
        """
        We have a value for one of the squares, work out the ramifications on all the others.
        If applyFix finds any other cells where the value is fixed it will add them to the
        discoveries list.
        """
        self.discoveries = [(row,col,val)]

        while len(self.discoveries) > 0:
            self.applyFix(self.discoveries[0])
            self.discoveries = self.discoveries[1:]

#---------------------------------------------------------------------------------------------------
    def applyFix(self,cmd):
        """
        Apply a value to a cell and the update the remaining cells the reflect the consequences.
        """

        (row,col,val) = cmd

    # is this selection valid

        try:
            idx = self.grid[row][col].index(val)
        except ValueError:
            raise Exception ("Cell (%d,%d) can't be %d, possibilities are %s" % (row,col,val,self.grid[row][col]))

        self.grid[row][col] = [val]

# Find the lists of cells that contain this cell and then remove all duplicate values

        cell = (row,col)
        
        for cl in self.cell_lists:
            try:
                idx = cl.index(cell)
                for c in cl:
                    if c != cell:
                        (row,col) = c
                        self.removeValue(row,col,val)
                        
            except ValueError:
                pass
#-------------------------------------------------------------------------
    def removeValue(self,row,col,val):
        """
        Try to remove a value from a square.
        """

    # If the removal would leave the cell empty barf.

        if len(self.grid[row][col]) == 1 and self.grid[row][col][0] == val:
            raise Exception("Removing %d from (%d,%d) would leave the cell empty" % (val,row,col))

    # Try and remove the value. If the removal is successful and leaves a single valued
    # cell then we add this new cell to the discovery list

        try:
            self.grid[row][col].remove(val)

            if len(self.grid[row][col]) == 1:
                self.discoveries.append((row,col,self.grid[row][col][0]))
            return True
            
        except ValueError:
            return False

#-------------------------------------------------------------------------
    def removeSingleton(self):
        """
        Searches the rows, columns and squares counting how frequently numbers
        appear in the undecided cells. If a number only appears once then that cell
        must contain that number. If one is found it is removed and this function
        returns 'True'. If there are no singletons it returns 'False'.
        """

        if self.toDo() == 0:
            return False

        for cl in self.cell_lists:
            if self.removeSingletonInList(cl):
                return True

        return False
#-------------------------------------------------------------------------
    def findPairs(self):
        """
        If two cells in a set have identical pairs of possibilities,
        eg 1 and 2, then no other cell in that set can contain a 1 or a 2.
        This can be extended to three cells with identical threesomes etc.
        but these are less likely
        """

        if self.toDo() == 0:
            return False

        for cl in self.cell_lists:
            if self.findPairInList(cl):
                return True

        return False
#-------------------------------------------------------------------------
    def removeSingletonInList(self,list):
        """
        Checks the set of cells looking for a number that only occurs in one list
        """

        counts = [0]*(self.size+1)

        for (row,col) in list:
            if len(self.grid[row][col]) > 1:
                for n in self.grid[row][col]:
                    counts[n] += 1

    # see if there is a number that only appears in one cell

        try:
            val = counts.index(1)
        except:
            return False

    # There is, where was it?

        for (row,col) in list:
            if len(self.grid[row][col]) > 1:
                try:
                    idx = self.grid[row][col].index(val)
                    #print "Singleton (%d,%d) = %d" % (row,col,val)
                    self.fixValue(row,col,val)
                    return True
                except:
                    pass

    # Shouldn't get here
        raise Exception("Algorithm Error")
#-------------------------------------------------------------------------
    def findPairInList(self,list):
        """
        Checks the cells in the list to see if two have identical pairs
        """

        pairs = []

        for (row,col) in list:
            if len(self.grid[row][col]) == 2:
                pairs.append((row,col))

        any = False

    # Need at least two pairs for this test

        if len(pairs) >= 2:
            for i in range (len(pairs)-1):
                for j in range (i+1,len(pairs)):
                    (r1,c1) = pairs [i]
                    (r2,c2) = pairs [j]

    # If there are some matching pairs then we can remove the two numbers found
    # from the other cells

                    if self.grid[r1][c1] == self.grid[r2][c2]:
                        vals = self.grid[r1][c1]
                        for (row,col) in list:
                            if not (row == r1 and col == c1 or row == r2 and col == c2):
                                for v in vals:
                                    if self.removeValue(row,col,v):
                                        if len(self.grid [row][col]) == 1:
                                            fix = self.grid [row][col][0]
                                            self.fixValue(row,col,fix)
                                        any = True
                    
        return any
#-------------------------------------------------------------------------
    def makeCellLists(self):
        """
        Makes a list of lists, each individual list is a set of cells that
        must meet the exclusivity criterion of the puzzle, ie. that all the
        values are different.
        """

        self.cell_lists = []

    # Rows and columns

        for i in range (self.size):
            l1 = []
            l2 = []
            for j in range (self.size):
                l1.append ((i,j))
                l2.append ((j,i))
            self.cell_lists.append(l1)
            self.cell_lists.append(l2)

    # Boxes

        nx = self.size / self.cx
        ny = self.size / self.cy

        for r1 in range (ny):
            for c1 in range (nx):
                list = []
                for r2 in range (self.cy):
                    for c2 in range (self.cx):
                        row = self.cy * r1 + r2
                        col = self.cx * c1 + c2
                        list.append ((row,col))
                self.cell_lists.append(list)

    # diagonals

        if self.diagonals:
            l1 = []
            l2 = []

            for i in range (self.size):
                l1.append ((i,i))
                l2.append ((i,self.size-i-1))

            self.cell_lists.append (l1)
            self.cell_lists.append (l2)
#---------------------------------------------------------------------------------------------------
def makeSolutionKey(grid):
    """
    Turns a solution into a string
    """
    ret = ''
    size = len(grid)

    for row in grid:
        for cell in row:
            ret += toSymbol (cell[0], size)
    return ret
#-------------------------------------------------------------------------
def toSymbol(val,size):
    """
    For patterns up to 9x9 use the symbols 1-9, for 10 - 26 is uses A-Z.
    For other sizes just return the value as text.
    """
    if size > 0 and size <= 9:
        return chr (ord('1') + val - 1)

    if size > 9 and size <= 26:
        return chr (ord('A') + val - 1)

    return "%d" % val
#-------------------------------------------------------------------------
def fromSymbol(sym,size):
    """
    Inverse of toSymbol
    """
    if size > 0 and size <= 9:
        return int(sym)

    if size > 9 and size <= 26:
        return ord(sym) - ord('A') + 1

    return 0
#-------------------------------------------------------------------------
def printGridAsHTML(grid):
    """
    Does what it says.
    """
    size = len(grid)
    print '<table>'
    for row in grid:
        print ' <tr>'
        for cell in row:
            s2 = ''
            for k in cell:
                s2 += toSymbol (k, size)
            print '  <td>%s</td>' % s2
        print ' </tr>'
    print '</table>'
#-------------------------------------------------------------------------
def printExampleAsHTML(example):
    """
    Does what it says.
    """
    print '<table>'
    for row in example:
        print ' <tr>'
        for j in row:
            if j == '-':
                print '  <td>&nbsp;</td>'
            else:
                print '  <td>%s</td>' % j
        print ' </tr>'
    print '</table>'
#---------------------------------------------------------------------------------------------------
def cloneGrid(grid):
    """
    Create a new grid identical to the current one - copy by value rather than reference
    """
    #ret = [[[k for k in grid[i][j]] for j in range (size)] for i in range(size)]
    ret = [[[k for k in cell] for cell in row] for row in grid]
    return ret
#-------------------------------------------------------------------------
def printGrid(grid):
    """
    Does what it says. Works best for 9x9 grids.
    """
    size   = len(grid)

# find biggest entry to set up the format string

    longest = 0
    
    for row in grid:
        for cell in row:
            if len(cell) > longest:
                longest = len(cell)

    format = "%%%ds" % (longest+1)

# now print the grid

    for row in grid:
        str = ''
        for cell in row:
            s2 = ''
            for k in cell:
                s2 += toSymbol (k, size)
            str += format % s2
        print str

#-------------------------------------------------------------------------
def printCellLists():
    """
    Print out the cell lists
    """

    for cl in self.cell_lists:
        print cl
