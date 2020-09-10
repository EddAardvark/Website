import primes

head = """<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<link rel="StyleSheet" href="../jw.css" type="text/css" media="screen">
<title>The 3x+1 Problem</title>
</head>

<body style="background-color: #eeeeff">
"""

table_def = '<table class="whitebox" cellpadding="4", cellspacing="0" border="1">\n'

# Saves recalculating things or passing lots of parameters

class Constants:
    def __init__(self,m,n):
        if 2**m < 3**n:
            raise "2**m < 3**n"
        self.n          = n
        self.m          = m
        self.cols       = n-1
        self.rows       = m-n
        self.starter    = 3**n - 2**n
        self.K          = 2**m - 3**n

        self.num_values = combinations (n-1,m-1)

        self.getTableIncrements()
        self.getTableValues()
        self.getCellValues()
        self.getLoopMap()

    #----------------------------------------------------------------------------------
    def getCellValues(self):
        """
        The values in the table in a simple list. Requires exp_table.
        """
        self.cellvalues = [self.starter]

        for row in range(self.rows):
            for col in range(self.cols):
                for value in self.exp_table[row][col]:
                    self.cellvalues.append(value)

    #----------------------------------------------------------------------------------
    def getLoopMap(self):
        """
           Finds all the loops and creates a mapping of the size and smallest
           member. Requires cellvalues.
        """

        self.loopmap = {}
        self.minvals = []
        self.maxvals = []
        cellvalues = self.cellvalues
        cellvalues.sort()

        while len(cellvalues) > 0:
            value = cellvalues[0]
            loop = fullOddSequence(value,self.K)[:-1]
            
            try:
                self.loopmap[len(loop)].append(value)
            except KeyError:
                self.loopmap[len(loop)] = [value]

            self.minvals.append(min(loop))
            self.maxvals.append(max(loop))

            for i in loop:
                cellvalues.remove(i)
    #----------------------------------------------------------------------------------
    def getTableIncrements(self):
        """
        Calculate the increment table.
        """
        table = []

        for row in range (self.rows):
            row_vals=[]
            for col in range (self.cols):
                row_vals.append((3**(self.n-1-col) - 2**(self.n-1-col)) * 2**(1+row+col))
            table.append(row_vals)
        self.inc_table = table
    #----------------------------------------------------------------------------------
    def getTableValues(self):
        """
        Calculate the expanded table values. Requires inc_table and starter.
        """
        table = []

        for r in range (self.rows):
            row = []
            for c in range (self.cols):
                inc = self.inc_table[r][c]
                values = []
                if r == 0:
                    values.append(self.starter + inc)
                else:
                    for c2 in range (0,c+1):
                        prev = table[r-1][c2]
                        for val in prev:
                            values.append(val+inc)
                row.append(values)
            table.append(row)
        self.exp_table = table
    #----------------------------------------------------------------------------------
    def WriteTables(self,f):
        f.write(head)
        f.write('<h1>Pyramid Tables for N=%d, M=%d</h1>\n' % (self.n, self.m))

        clist = [("ptable",  "Pyramid Table",  self.WritePyramidTable),
                 ("etable",  "Expanded Table", self.WriteExpandedPyramidTable),
                 ("ranges",  "Ranges",         self.WriteRangedPyramidTable),
                 ("sranges", "Scaled Ranges",  self.WriteScaledPyramidTable),
                 ("franges", "Fixed Ranges",   self.WriteFixedScaledPyramidTable),
                 ("loops",   "Loops",          self.WriteLoops),
                 ("lseeds",  "Loop Seeds",     self.WriteLoopSeeds),
                 ("oloops",  "Other Loops",    self.WriteOtherLoops)]

        WriteContents(f,clist)
        prev = False
        for cl in clist:
            WriteSection (f, cl, prev)
            cl[2](f)
            prev = True

        WriteSection (f, None, True)
    #----------------------------------------------------------------------------------
    def WritePyramidTable(self,f):
        """
        Writes the Pyramid Table for a given combination of m and n (2**m > 3**n).
        """
        para = """This table shows the increments assigned to each cell. To generate
        loop values for the 3x+%d system take the value in the starter cell (%d) and
        add a single value from each row, working down the table. You can stop at any
        time, including adding no rows at all. The only other rule is that you can't
        choose a value that is in a column to the left of one you've already used.
        """ % (self.K, self.starter)

        self.writeHeadings(f, "Increment", para)

    #Remaining Rows

        r = 0
        
        for row in self.inc_table:
            f.write('<tr><th>Row %d</th>'%r)
            r += 1
            for col in row:
                f.write('<td class="code">%d</td>'%(col))

            f.write('</tr>\n')
        f.write('</table>\n')

    #----------------------------------------------------------------------------------
    def WriteExpandedPyramidTable(self,f):
        """
        Expands the Pyramid Table putting actual values in all the cells. Unless there
        are too many.
        """

        if self.num_values > 1000:
            para = "There are %d values in the table; too many to display." % self.num_values
            f.write('<p>%s</p>\n' % para)
            return

        para = """This table show the values that can be obtained by following the
        rules in the <a href="#ptable">Pyramid Table<a> section and stopping in a
        particular cell. For cells in the first row and column there is only one
        route so there is only a single value. The number of values in later cells
        increases rapidly (of the order c^r). The table has %d entries.
        """ % self.num_values

        self.writeHeadings(f, "Values", para)

    #Remaining Rows

        r = 0

        for row in self.exp_table:
            f.write('<tr><th>Row %d</th>' % r)
            r += 1
            for col in row:
                colstr = ('%s'%col)[1:-1]
                f.write('<td class="code">%s</td>'%(colstr))
            f.write('</tr>\n')
        f.write('</table>\n')
    #----------------------------------------------------------------------------------
    def WriteLoops(self,f):
        """
        Associates the values in the expanded table with particular loops.
        """

    # Output

        para = """A given combination of n and m will generate a set of loops containing
        n odd elements. If n and m have a common factor then some of the n-cycles will
        be split into multiple repeats of a smaller loop. If n and m are co-prime then
        only n-cycles will be found. This table shows the loops in the 3x+%d system and
        the values of their smallest elements (seeds).""" % self.K
        
        f.write('<p>%s</p>\n' % para)
        keys = self.loopmap.keys()
        keys.sort()

        f.write(table_def)

    # Headings

        f.write('<tr><th>Loop Size</th><th>Number of Loops</th><th>Smallest Elements</th></tr>\n')

    # table

        row = """      <tr>
          <td class="code">%s</td>
          <td class="code">%s</td>
          <td class="code">%s</td>
        </tr>"""
        
        for key in keys:
            ltext = ('%s' % self.loopmap[key])[1:-1]
            f.write(row % (key, len(self.loopmap[key]), ltext))

        f.write('</table>\n')

    #----------------------------------------------------------------------------------
    def WriteOtherLoops(self,f):
        """
        Derivative loops
        """
        para="""When there is a common factor (f) between the members of a loop and the
        constant K in 3x+K there will be loops in the system 3x+(K/f) as well. This section
        shows the loops generated when 'f' is the highest common factor of K and the original
        loop members. Thus K/f will be the smallest number where this particular loops exists.
        All odd multiples of K/f will have similar loops."""
        
        row = """    <tr>
          <td class="code">%s</td>
          <td class="code">%s</td>
          <td class="code">3x + %s</td>
          <td class="code">%s</td>
          <td class="code">%s</td>
        </tr>"""

        headings = """    <tr>
          <th>Loop Size</th>
          <th>Factor</th>
          <th>System</th>
          <th>Number of Loops</th>
          <th>Smallest Elements</th>
        </tr>"""

        f.write("<p>%s</p>\n" % para)

        found = False

        for key in self.loopmap:
            submap = {}
            for val in self.loopmap[key]:
                h = hcf (val,self.K)
                if h > 1:
                    k2 = self.K/h
                    v2 = val/h
                    try:
                        submap [k2].append(v2)
                    except KeyError:
                        submap [k2] = [v2]
            for sk in submap:
                if not found:
                    f.write(table_def)
                    f.write(headings)
                    found = True
                stext = ("%s" % submap[sk])[1:-1]
                f.write(row % (key, self.K/sk, sk, len(submap[sk]),stext))

        if found:
            f.write('</table>\n')
        else:
            f.write('<p>No other loops were found.</p>\n')
    #----------------------------------------------------------------------------------
    def WriteLoopSeeds(self,f):
        """
        Shows where the loops start
        """
        para = [0]*2
        para [0] = """\"Loop Seeds\" are the smallest values in each loop. This table shows
        where they are in the table. The numbers in the boxes indicate the number of loops
        seeded by values in that box relative to the total number of values in the box.
        """
        para[1] = """This second table shows the locations of the maximum values in each loop.
        Note: there is one more maximum value than minimum values because one of the loops is
        seeded by the start value, %d.""" % self.starter
        
        for i in range (0,2):
            table = []
            for row in range (self.rows):
                table.append([0]*self.cols)

        # See where the values are

            if i == 0:
                vals = self.minvals
            else:
                vals = self.maxvals

            for row in range(self.rows):
                for col in range(self.cols):
                    for value in self.exp_table[row][col]:
                        try:
                            idx = vals.index(value)
                            table [row][col] += 1
                        except ValueError:
                            pass

            f.write('<p>%s</p>\n' % para[i])
            f.write(table_def)
            for row in range(self.rows):
                f.write('  <tr>')
                for col in range(self.cols):
                    if table [row][col] > 0:
                        f.write('<td class="code">%d/%d</td>' % (table[row][col],len(self.exp_table[row][col])))
                    else:
                        f.write('<td class="code">-</td>')

            f.write('</table>\n')
    #----------------------------------------------------------------------------------
    def WriteRangedPyramidTable(self,f):
        """
        Expands the Pyramid Table showing the range of values in all the cells
        """
        para = """This table lists the ranges of values that appear in each cell of the
        <a href="#etable">Expanded Pyramid</a> Table."""

        self.writeHeadings(f, "Ranges", para)

        for row in range(self.rows):
            f.write('<tr><th>Row %d</th>' % row)
            for col in range(self.cols):
                m1 = self.starter + getMin (self.inc_table,row,col)
                m2 = self.starter + getMax (self.inc_table,row,col)
                if m1 == m2:
                    f.write('<td class="code">%d</td>'%(m1))
                else:
                    f.write('<td class="code">%d - %d</td>'%(m1,m2))

            f.write('</tr>\n')
        f.write('</table>\n')
    #----------------------------------------------------------------------------------
    def WriteScaledPyramidTable(self,f):
        """
        Expands the Pyramid Table showing the range of possible 3x+1 solutions
        for each cell.
        """

        para = """This table divides the ranges of values in the
        <a href="#ranges">Ranges</a> Table by the constant K in 3x+K (%d).
        If there were a %d-cycle in the 3x+1 system then the seed value and all the
        other loop members would fall within in these ranges.""" % (self.K, self.n)

        self.writeHeadings(f, "Scaled Range", para)

        div = self.K

        for row in range(self.rows):
            f.write('<tr><th>Row %d</th>' % row)
            for col in range(self.cols):
                m1 = self.starter + getMin (self.inc_table,row,col)
                m2 = self.starter + getMax (self.inc_table,row,col)
                if m1 == m2:
                    f.write('<td class="code">%.3f</td>'%(float(m1)/div))
                else:
                    f.write('<td class="code">%.3f - %.3f</td>'%(float(m1)/div,float(m2)/div))
            f.write('</tr>\n')
        f.write('</table>\n')

    #----------------------------------------------------------------------------------
    def WriteFixedScaledPyramidTable(self,f):
        """
        Expands the Pyramid Table showing the range of possible 3x+1 solutions
        for each cell (adjusted to only allow value integers)
        """

        para = """The values in the <a href="#sranges">Scaled Ranges</a> Table are expressed
        in floating point. Any member of a cycle in 3x+1 must be an odd integer of the form
        6n+1 or 6n-1. This table shows the ranges in the <a href="#sranges">Scaled Range</a> Table
        after applying this constraint. Cells where no values are possible appear as "---".
        The combined range at the end of this section shows the values that need to be checked
        to confirm there are no %d-cycles in 3x+1.""" % (self.n)

        self.writeHeadings(f, "Fixed Range", para)

        div = self.K
        vmin = fixUp(self.starter + getMin (self.inc_table,0,0), div)
        vmax = vmin

    #Remaining Rows
        for row in range(self.rows):
            f.write('<tr><th>Row %d</th>' % row)
            for col in range(self.cols):
                m1 = self.starter + getMin (self.inc_table,row,col)
                m2 = self.starter + getMax (self.inc_table,row,col)
                v0 = fixUp(m1, div)
                v1 = fixDown(m2, div)
                if v1 < v0:
                    f.write('<td class="code">---</td>')
                else:
                    if v1 > vmax:
                        vmax = v1
                    if v0 < vmin:
                        vmin = v0
                    if v1 > v0:
                        f.write('<td class="code">%s - %s</td>'%(v0,v1))
                    elif v1 == v0:
                        f.write('<td class="code">%s</td>'%(v0))

            f.write('</tr>\n')
        f.write('</table>\n')
        if vmax > vmin:
            f.write('<p>The combined range is %d - %d.</p>\n' % (vmin,vmax))
        else:
            f.write('<p>The combined range is empty.</p>\n')
    #----------------------------------------------------------------------------------
    def writeHeadings(self,f,text,para=""):

        if len(para)>0:
            f.write('<p>%s</p>\n' % para)

        f.write(table_def)
        
    #Top row

        f.write('<tr><th>3x + %d</th><th colspan="%d">%s</th></tr>\n' % (self.K,self.cols,text))

    #Second Row

        f.write('<tr><td class="code">%d</td>'%self.starter)
        for i in range (self.cols):
            f.write('<th>box %d</th>'%(i+1))
        f.write('</tr>\n')

#----------------------------------------------------------------------------------
def all(fname='c:/temp/pyramidtable'):
    for n in range (4,15):
        for m in range (7,21):
            if 2**m > 3**n:
                go(n,m,fname)
#----------------------------------------------------------------------------------
def go(n, m, fname='c:/temp/ptable'):
    """
    Write a web page containing all the tables
    """

    fname = fname + ('_%d_%d.html' % (n,m))
    f = open(fname,'w')
    c = Constants (m,n)

    c.WriteTables(f)
    f.close()
#----------------------------------------------------------------------------------
def fixUp(v0, div):
    if v0%div != 0:
        v0 = (int)(float(v0)/div) + 1
        
    if v0 % 2 == 0:
        v0 += 1
    if v0 % 3 == 0:
        v0 += 2

    return v0
#----------------------------------------------------------------------------------
def fixDown(v1, div):
    if v1%div != 0:
        v1 = (int)(float(v1)/div) - 1
        
    if v1 % 2 == 0:
        v1 -= 1
    if v1 % 3 == 0:
        v1 -= 2

    return v1
#----------------------------------------------------------------------------------
def WriteSection (f, title, previous):
    """
    Write the division markers and heading
    """
    if previous:
        f.write('</div></div>\n')

    if title:
        f.write('<div class="box" style="background-color: #c0c0d0"><div class="margins">\n')
        f.write('<h2><a name="%s">%s</a></h2>\n' % (title[0],title[1]))
#----------------------------------------------------------------------------------
def WriteContents (f,clist):
    """
    Write the contents
    """

    f.write('<div class="margins">\n')
    f.write('<p>On this page...</p>\n<ul>')
    for (link,title,fun) in clist:
        f.write('<li><a href="#%s">%s</a></li>\n' % (link,title))
    f.write('</ul></div>\n')

#----------------------------------------------------------------------------------
def getMin(table,row,col):
    if row==0:
        return table [0][col]
    return table [row][col] + getMin(table,row-1,col)
#----------------------------------------------------------------------------------
def getMax(table,row,col):
    if row==0:
        return table [0][col]
    return table [row][col] + getMax(table,row-1,0)
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def hcf (n1, n2):
    "Highest common factor of two integers"

    if n1 <1 or n2 < 1:
        return 1

    while 1:
        if n1 > n2:
            t = n1
            n1 = n2
            n2 = t

        if n1 == 0:
            return n2

        if n1 == 1:
            return 1

        n2 = n2 % n1
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def factorial(n):
    ret = 1
    for i in range (1,n):
        ret *= (i+1)
    return ret
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def combinations(n,t):
    n2 = t-n
    if n2 > n:
        temp = n
        n = n2
        n2 = temp

    ret = 1

    for i in range (n+1,t+1):
        ret *= i

    return ret / factorial(n2)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def fullOddSequence(xstart, K, limit=100):
    """
    Returns a sequence of odd values either until a loop is detected or
    we reach the limit.
    """

# Start with an odd number

    while xstart > 0 and xstart % 2 == 0:
        xstart /= 2 ;

    x = xstart
    ret=[x]
    count = 0
    
# Loop until an exit condition is encountered

    while 1:
        x = 3*x + K
        while x%2 == 0:
            x /= 2
        ret.append (x)
        count += 1

        if ret.index(x) < count or count > limit:
            break

    return ret
