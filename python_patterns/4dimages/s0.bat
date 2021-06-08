@echo off

goto start

python MandelbrotDriver.py -tA -s320x240 -c(0,0,-1,0) -fpics/a -l32
python MandelbrotDriver.py -tB -s320x240 -c(0,0,-1,0) -fpics/b -l32
python MandelbrotDriver.py -tC -s320x240 -c(0,0,-1,0) -fpics/c -l32
python MandelbrotDriver.py -tD -s320x240 -c(0,0,-1,0) -fpics/d -l32
python MandelbrotDriver.py -tM -s320x240 -c(0,0,-1,0) -fpics/m -l32
python MandelbrotDriver.py -tJ -s320x240 -c(0,0,-1,0) -fpics/j -l32

python MandelbrotDriver.py -tA -s320x240 -c(0,0,-0.5,.575) -fpics/a2 -l32 -m10
python MandelbrotDriver.py -tB -s320x240 -c(0,0,-0.5,.575) -fpics/b2 -l32 -m10
python MandelbrotDriver.py -tC -s320x240 -c(0,0,-0.5,.575) -fpics/c2 -l32 -m10
python MandelbrotDriver.py -tD -s320x240 -c(0,0,-0.5,.575) -fpics/d2 -l32 -m10
python MandelbrotDriver.py -tM -s320x240 -c(0,0,-0.5,.575) -fpics/m2 -l32 -m10
python MandelbrotDriver.py -tJ -s320x240 -c(0,0,-0.5,.575) -fpics/j2 -l32 -m10

python MandelbrotDriver.py -tA -s320x240 -c(0,0,-0.56,.65) -fpics/a3 -l32 -m30
python MandelbrotDriver.py -tB -s320x240 -c(0,0,-0.56,.65) -fpics/b3 -l32 -m30
python MandelbrotDriver.py -tC -s320x240 -c(0,0,-0.56,.65) -fpics/c3 -l32 -m30
python MandelbrotDriver.py -tD -s320x240 -c(0,0,-0.56,.65) -fpics/d3 -l32 -m30
python MandelbrotDriver.py -tM -s320x240 -c(0,0,-0.56,.65) -fpics/m3 -l32 -m30
python MandelbrotDriver.py -tJ -s320x240 -c(0,0,-0.56,.65) -fpics/j3 -l32 -m30

python MandelbrotDriver.py -tA -s320x240 -c(0,0,-0.53,0.669) -fpics/a4 -l32 -m200
python MandelbrotDriver.py -tB -s320x240 -c(0,0,-0.53,0.669) -fpics/b4 -l32 -m200
python MandelbrotDriver.py -tC -s320x240 -c(0,0,-0.53,0.669) -fpics/c4 -l32 -m200
python MandelbrotDriver.py -tD -s320x240 -c(0,0,-0.53,0.669) -fpics/d4 -l32 -m200
python MandelbrotDriver.py -tM -s320x240 -c(0,0,-0.53,0.669) -fpics/m4 -l32 -m200
python MandelbrotDriver.py -tJ -s320x240 -c(0,0,-0.53,0.669) -fpics/j4 -l32 -m200

python MandelbrotDriver.py -tA -s320x240 -c(0,0,-0.53,0.669) -fpics/a5 -l32 -m2
python MandelbrotDriver.py -tB -s320x240 -c(0,0,-0.53,0.669) -fpics/b5 -l32 -m2
python MandelbrotDriver.py -tC -s320x240 -c(0,0,-0.53,0.669) -fpics/c5 -l32 -m2
python MandelbrotDriver.py -tD -s320x240 -c(0,0,-0.53,0.669) -fpics/d5 -l32 -m2
python MandelbrotDriver.py -tM -s320x240 -c(0,0,-0.53,0.669) -fpics/m5 -l32 -m2
python MandelbrotDriver.py -tJ -s320x240 -c(0,0,-0.53,0.669) -fpics/j5 -l32 -m2

python MandelbrotDriver.py -tA -s320x240 -c(0,-.5,-0.325,0.669) -fpics/a6 -l32 -m4
python MandelbrotDriver.py -tB -s320x240 -c(0,-.5,-0.325,0.669) -fpics/b6 -l32 -m4
python MandelbrotDriver.py -tC -s320x240 -c(0,-.5,-0.325,0.669) -fpics/c6 -l32 -m4
python MandelbrotDriver.py -tD -s320x240 -c(0,-.5,-0.325,0.669) -fpics/d6 -l32 -m4
python MandelbrotDriver.py -tM -s320x240 -c(0,-.5,-0.325,0.669) -fpics/m6 -l32 -m4
python MandelbrotDriver.py -tJ -s320x240 -c(0,-.5,-0.325,0.669) -fpics/j6 -l32 -m4

python MandelbrotDriver.py -tD -s1280x1024 -c(0,-.5,-0.325,0.669) -fpics/d6x -l64 -m4
python MandelbrotDriver.py -tDB -s1280x1024 -c(0,-.5,-0.325,0.669) -fpics/d6xb -l64 -m4

python MandelbrotDriver.py -tA -s320x240 -c(0,-.875,-0.075,0.669) -fpics/a7 -l32 -m8
python MandelbrotDriver.py -tB -s320x240 -c(0,-.875,-0.075,0.669) -fpics/b7 -l32 -m8
python MandelbrotDriver.py -tC -s320x240 -c(0,-.875,-0.075,0.669) -fpics/c7 -l32 -m8
python MandelbrotDriver.py -tD -s320x240 -c(0,-.875,-0.075,0.669) -fpics/d7 -l32 -m8
python MandelbrotDriver.py -tM -s320x240 -c(0,-.875,-0.075,0.669) -fpics/m7 -l32 -m8
python MandelbrotDriver.py -tJ -s320x240 -c(0,-.875,-0.075,0.669) -fpics/j7 -l32 -m8

python MandelbrotDriver.py -tJ -s1280x1024 -c(0,-.875,-0.075,0.669) -fpics/j7x -l32 -m8 -i1200
python MandelbrotDriver.py -tB -s1280x1024 -c(0,-.875,-0.075,0.669) -fpics/b7x -l32 -m8 -i1200
python MandelbrotDriver.py -tD -s1280x1024 -c(0,-.875,-0.075,0.669) -fpics/d7x -l32 -m8 -i1200

python MandelbrotDriver.py -tA -s320x240 -c(0,-.894,-0.056,0.669) -fpics/a8 -l32 -m20
python MandelbrotDriver.py -tB -s320x240 -c(0,-.894,-0.056,0.669) -fpics/b8 -l32 -m20
python MandelbrotDriver.py -tC -s320x240 -c(0,-.894,-0.056,0.669) -fpics/c8 -l32 -m20
python MandelbrotDriver.py -tD -s320x240 -c(0,-.894,-0.056,0.669) -fpics/d8 -l32 -m20
python MandelbrotDriver.py -tM -s320x240 -c(0,-.894,-0.056,0.669) -fpics/m8 -l32 -m20
python MandelbrotDriver.py -tJ -s320x240 -c(0,-.894,-0.056,0.669) -fpics/j8 -l32 -m20

python MandelbrotDriver.py -tJ -s1280x1024 -c(0,-.894,-0.056,0.669) -fpics/j8x -l32 -m20 -i1200

python MandelbrotDriver.py -tA -s320x240 -c(0,-.894,-0.056,0.669) -fpics/a9 -l32 -m200
python MandelbrotDriver.py -tB -s320x240 -c(0,-.894,-0.056,0.669) -fpics/b9 -l32 -m200
python MandelbrotDriver.py -tC -s320x240 -c(0,-.894,-0.056,0.669) -fpics/c9 -l32 -m200
python MandelbrotDriver.py -tD -s320x240 -c(0,-.894,-0.056,0.669) -fpics/d9 -l32 -m200
python MandelbrotDriver.py -tM -s320x240 -c(0,-.894,-0.056,0.669) -fpics/m9 -l32 -m200
python MandelbrotDriver.py -tJ -s320x240 -c(0,-.894,-0.056,0.669) -fpics/j9 -l32 -m200

python MandelbrotDriver.py -tA -s320x240 -c(0,-.902,-0.056,0.673) -fpics/a10 -l32 -m1000
python MandelbrotDriver.py -tB -s320x240 -c(0,-.902,-0.056,0.673) -fpics/b10 -l32 -m1000
python MandelbrotDriver.py -tC -s320x240 -c(0,-.902,-0.056,0.673) -fpics/c10 -l32 -m1000
python MandelbrotDriver.py -tD -s320x240 -c(0,-.902,-0.056,0.673) -fpics/d10 -l32 -m1000
python MandelbrotDriver.py -tM -s320x240 -c(0,-.902,-0.056,0.673) -fpics/m10 -l32 -m1000
python MandelbrotDriver.py -tJ -s320x240 -c(0,-.902,-0.056,0.673) -fpics/j10 -l32 -m1000

python MandelbrotDriver.py -tC -s1280x1024 -c(0,-.902,-0.056,0.673) -fpics/c10x -l32 -m1000 -i2400

python MandelbrotDriver.py -tA -s320x240 -c(0,-.902,-0.056,0.6716) -fpics/a11 -l32 -m4000 -i2400
python MandelbrotDriver.py -tB -s320x240 -c(0,-.902,-0.056,0.6716) -fpics/b11 -l32 -m4000 -i2400
python MandelbrotDriver.py -tC -s320x240 -c(0,-.902,-0.056,0.6716) -fpics/c11 -l32 -m4000 -i2400
python MandelbrotDriver.py -tD -s320x240 -c(0,-.902,-0.056,0.6716) -fpics/d11 -l32 -m4000 -i2400
python MandelbrotDriver.py -tM -s320x240 -c(0,-.902,-0.056,0.6716) -fpics/m11 -l32 -m4000 -i2400
python MandelbrotDriver.py -tJ -s320x240 -c(0,-.902,-0.056,0.6716) -fpics/j11 -l32 -m4000 -i2400

python MandelbrotDriver.py -tMS -s1280x1024 -c(0,-.902,-0.056,0.6716) -fpics/m11xs -l32 -m4000 -i2400 -b0.0003
python MandelbrotDriver.py -tA  -s1280x1024 -c(0,-.902,-0.056,0.6716) -fpics/a11x -l32 -m4000 -i2400 -b0.0003
python MandelbrotDriver.py -tDB -s1280x1024 -c(0,-.902,-0.056,0.6716) -fpics/d11xb -l32 -m4000 -i2400 -b0.0003

python MandelbrotDriver.py -tA -s320x240 -c(0,-.875,-0.069,0.6716) -fpics/a12 -l32 -m200 -i2400
python MandelbrotDriver.py -tB -s320x240 -c(0,-.875,-0.069,0.6716) -fpics/b12 -l32 -m200 -i2400
python MandelbrotDriver.py -tC -s320x240 -c(0,-.875,-0.069,0.6716) -fpics/c12 -l32 -m200 -i2400
python MandelbrotDriver.py -tD -s320x240 -c(0,-.875,-0.069,0.6716) -fpics/d12 -l32 -m200 -i2400
python MandelbrotDriver.py -tM -s320x240 -c(0,-.875,-0.069,0.6716) -fpics/m12 -l32 -m200 -i2400
python MandelbrotDriver.py -tJ -s320x240 -c(0,-.875,-0.069,0.6716) -fpics/j12 -l32 -m200 -i2400

python MandelbrotDriver.py -tA -s320x240 -c(0,-.875,-0.0650,0.6707) -fpics/a13 -l32 -m1000 -i4800
python MandelbrotDriver.py -tB -s320x240 -c(0,-.875,-0.0650,0.6707) -fpics/b13 -l32 -m1000 -i4800
python MandelbrotDriver.py -tC -s320x240 -c(0,-.875,-0.0650,0.6707) -fpics/c13 -l32 -m1000 -i4800
python MandelbrotDriver.py -tD -s320x240 -c(0,-.875,-0.0650,0.6707) -fpics/d13 -l32 -m1000 -i4800
python MandelbrotDriver.py -tM -s320x240 -c(0,-.875,-0.0650,0.6707) -fpics/m13 -l32 -m1000 -i4800
python MandelbrotDriver.py -tJ -s320x240 -c(0,-.875,-0.0650,0.6707) -fpics/j13 -l32 -m1000 -i4800


python MandelbrotDriver.py -tA -s320x240 -c(0,-.875,-0.0650,0.6707) -fpics/a14 -l32 -m10000 -i4800
python MandelbrotDriver.py -tB -s320x240 -c(0,-.875,-0.0650,0.6707) -fpics/b14 -l32 -m10000 -i4800
python MandelbrotDriver.py -tC -s320x240 -c(0,-.875,-0.0650,0.6707) -fpics/c14 -l32 -m10000 -i4800
python MandelbrotDriver.py -tD -s320x240 -c(0,-.875,-0.0650,0.6707) -fpics/d14 -l32 -m10000 -i4800
python MandelbrotDriver.py -tM -s320x240 -c(0,-.875,-0.0650,0.6707) -fpics/m14 -l32 -m10000 -i4800
python MandelbrotDriver.py -tJ -s320x240 -c(0,-.875,-0.0650,0.6707) -fpics/j14 -l32 -m10000 -i4800

:start

python MandelbrotDriver.py -tB -s1280x1024 -c(0,-.875,-0.0650,0.6707) -fb13x -l32 -m1000 -i4800

pause









