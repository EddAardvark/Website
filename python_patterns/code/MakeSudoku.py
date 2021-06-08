# Make Sudokus

import random

# Use this method as we might be working on the code

try:
    reload(SuSolver)
except NameError:
    import SuSolver

EASY = 3
MED1 = 2
MED2 = 1
HARD = 0


# so we don't go on forever

bailout = 100

# makes puzzles
#   mode        determines the type, the list is in SuSolver.
#   difficulty  determines the dificulty with 0 being the hardest and 3 the easiest.
#   diagonal    determines whether to include diagonals
#   quick       decides whether to use the quick or slow algorithm, slow usually produces
#               grids with fewer values.

def go(mode='9', diagonal=False, difficulty=0, quick=True):
    puzzle = Puzzle(mode,difficulty,diagonal)

    if quick:    
        puzzle.quickFind()
    else:
        puzzle.find()

    txt = puzzle.makePuzzleString()
    
    SuSolver.solve(txt,mode,diagonal)
    SuSolver.printExampleAsHTML(txt)
    SuSolver.printGridAsHTML(puzzle.su.grid)

    return puzzle

#----------------------------------------------------------------------------------------
class Puzzle:
    """
    A Sudoku Puzzle.
    """
    def __init__(self,mode,difficulty,diagonal):
        """
        Initialise
        """
        self.puzzle = []
        self.difficulty = difficulty
        self.diagonal = diagonal
        self.mode = mode
        self.su   = SuSolver.SuSolver(mode,diagonal)
        self.size = self.su.size

        type = self.su.description()

        ds = ["Hard", "Medium(2)", "Medium(1)", "Easy"][self.difficulty]
        
        print "%s: dificulty = %s" % (type, ds)

#----------------------------------------------------------------------------------------
    def find(self):
        """
        This version tries all the possible guesses and then chooses one from the
        set of those that leave the fewest alternatives for the next iteration. The
        difficulty parameter can be used to relax the conditions slightly.
        """

        global bailout
        print "Using thourough Algorithm"
        
        SuSolver.printGrid(self.su.grid)
        
        guesses = self.su.EnumerateGuesses()
        count=0

    # Keep adding numbers until we get a solution

        while len(guesses) > 0 and count < bailout:
            print "%d Guesses to try" % len(guesses)
            guessmap = {}
            backup = SuSolver.cloneGrid (self.su.grid)
            for guess in guesses:
                if self.tryGuess (guess):
                    new_guesses = self.su.EnumerateGuesses()
                    l = len(new_guesses)
                    try:
                        guessmap [l].append (guess)
                    except KeyError:
                        guessmap [l] = [guess]
                self.su.grid = SuSolver.cloneGrid (backup)

            guess = self.chooseGuess(guessmap)
            count += 1
            self.puzzle.append(guess)
            self.tryGuess (guess)
            guesses = self.su.EnumerateGuesses()
#----------------------------------------------------------------------------------------
    def quickFind(self):
        """
        Three phase algorithm. This algorithm is faster than the 'find' method but it has
        the advantage of always finding a solution and is a lot faster than the other.

        (1) Fill in some squares at random, though consistent with the rules, but too few to
            lead to a unique solution
        (2) Use the solver to find some possible solutions
        (3) Pick one of these solutions and then build up a list of cells that uniquely determines
            it.
        """

        print "Using quick Algorithm"
        
    # (1) how many squares to fill in?
    # These numbers have been chosen empirically to be fewer than necessary to determine
    # a unique solution.

        if self.su.diagonals:
            qg = [0, 0, 0, 0, 2, 0, 4, 0, 0, 11, 20, 0, 0, 0, 0, 0, 70][self.size]
        else:
            qg = [0, 0, 0, 0, 4, 0, 8, 0, 16, 20, 30, 0, 0, 0, 0, 0, 80][self.size]

        self.doQuickGuesses(qg)
        SuSolver.printGrid(self.su.grid)

    # (2) Now feed the guesses we have chosen to another solution solver and see how
    # many solutions it finds (hopefully at least 1)

        su2 = SuSolver.SuSolver(self.mode,self.diagonal)

        txt = self.makePuzzleString()
        for t in txt:
            print t

        su2.setGivenValues(txt)
        su2.solve()

        print "%d solutions found" % len(su2.solutions)

    # (3) Reset our solution builder and start again, this time though we only uses guesses
    # that we know are in the solution so there should be no problems.

        self.su  = SuSolver.SuSolver(self.mode,self.diagonal)
        solution = su2.solutions[random.randint(0,len(su2.solutions)-1)]
        guesses  = []
        self.puzzle = []

        for i in range (len(solution)):
            ch  = solution [i]
            col = i % self.size
            row = i / self.size
            val = SuSolver.fromSymbol (ch, self.size)

            guesses.append ((row,col,val))

    # (3b) Try each of the guesses from the known solution to see how effective they are at
    # reducing the number of possibilities

        while len(guesses) > 0:
            print "%d Guesses to try" % len(guesses)
            guessmap = {}
            backup = SuSolver.cloneGrid (self.su.grid)
            for guess in guesses:
                if self.tryGuess (guess):
                    new_guesses = self.su.EnumerateGuesses()
                    l = len(new_guesses)
                    try:
                        guessmap [l].append (guess)
                    except KeyError:
                        guessmap [l] = [guess]
                self.su.grid = SuSolver.cloneGrid (backup)

            guess = self.chooseGuess(guessmap)

            print "Using %s, val = %s" % (guess, self.su.grid [row][col])
            self.puzzle.append(guess)
            self.tryGuess (guess)
            SuSolver.printGrid(self.su.grid)

            if self.su.toDo() == 0:
                break
            for g in guesses:
                (row,col,val) = g
                if len(self.su.grid [row][col]) == 1:
                    guesses.remove(g)

    # Print out the result
        print "Solution has %s values\n" % len(self.puzzle)
        for p in self.puzzle:
            print p
        print "Puzzle...\n"
        txt = self.makePuzzleString()
        for t in txt:
            print t
#----------------------------------------------------------------------------------------
    def doQuickGuesses(self, num):
        """
        Apply some guess without worrying how good they are.
        """

        guesses = self.su.EnumerateGuesses()
        count   = 0

        while len(guesses) > 0 and count < num:
            print "%d Quick guesses to try" % len(guesses)
            backup = SuSolver.cloneGrid (self.su.grid)
            guess  = guesses[random.randint(0,len(guesses)-1)]

            if self.tryGuess (guess):
                print "Quick guess (%d,%d) = %d accepted" % guess
                self.puzzle.append(guess)
                guesses = self.su.EnumerateGuesses()
            else:
                self.su.grid = SuSolver.cloneGrid (backup)

            count+=1

#----------------------------------------------------------------------------------------
    def chooseGuess(self, guessmap):
        """
        Choose a guess from the guess map. When difficulty is 0 then a guess is chosen
        from the set of guesses with the smallest number of next generation options.
        as difficulty gets larger the range of guesses visited does too.
        """

        keys = guessmap.keys()
        if len(keys) == 0:
            raise Exception ("Failed")

        keys.sort()
        print "Guesses: %d values from %d to %d" % (len(keys), keys [0], keys[-1])
        kidx = min (self.difficulty, len(keys)-1)
        kidx = random.randint(0,kidx)
        k0   = keys[kidx]
        idx  = random.randint (0,len(guessmap[k0])-1)
        print "Kidx = %d, key = %d, guess = %s" % (kidx, k0, guessmap[k0][idx])
        return guessmap[k0][idx]

#----------------------------------------------------------------------------------------
    def tryGuess (self,guess):
        """
        Try an individual guess. If this guess is compatible with a solution then
        add it to the puzzle list.
        """
        (row,col,val) = guess

        backup = SuSolver.cloneGrid (self.su.grid)

        try:
            self.su.fixValue(row,col,val)
            while self.su.doEasyBits():
                pass
            return True

        except Exception, e:
            self.su.grid = backup
            return False
#----------------------------------------------------------------------------------------
    def printPuzzle(self):
        """
        Print out the values we've set.
        """
        print "%d values in puzzle" % len(self.puzzle)
        for p in self.puzzle:
            print p
#----------------------------------------------------------------------------------------
    def makePuzzleString(self):
        """
        Converts the set of given values into an array of strings suitable for input
        to SuSolver.
        """
        rows = []
        grid = [[0 for j in range (self.size)] for i in range(self.size)]
        for (row,col,val) in self.puzzle:
            grid[row][col] = val

        for row in grid:
            txt = ''
            for cell in row:
                if cell == 0:
                    txt += '-'
                else:
                    txt += SuSolver.toSymbol(cell, self.size)
            rows.append(txt)

        return rows
#=====================================================================
#=====================================================================
def factorial(x):
    if x <= 1:
        return 1
    
    return x * factorial(x-1)


