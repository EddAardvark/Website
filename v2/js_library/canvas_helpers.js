//-------------------------------------------------------------------------------------------------
// Functions to create SVG elements
// (c) John Whitehouse 2018
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

CanvasHelp = function (w, h)
{
    if (w && h)
    {
        this.canvas = document.createElement('canvas');
        this.canvas.width = w;
        this.canvas.height = h;
        this.context = this.canvas.getContext("2d");
    }
}

CanvasHelp.FromImage = function (image)
{
    var ch = new CanvasHelp();
    
    ch.canvas = document.createElement("CANVAS");
    ch.canvas.width = image.width;
    ch.canvas.height = image.height;
    ch.context = ch.canvas.getContext("2d");
    
    return ch;
}
//-------------------------------------------------------------------------------------------------
// 0 is the rectangle in model space, 1 is where it appears on the canvas.
// Implements the mapping:
// x2 = ax + cy + e;
// y2 = bx + dy + f;
//
// x' = (x - x0) * (w1/w0) + x1 = x * w1 / w0 + x1 - w1 * x0 / w0
// y' = (y - y0) * (h1/h0) + y1 = y * h1 / h0 + y1 - h1 * y0 / h0
//
// b and c are 0.
//-------------------------------------------------------------------------------------------------
CanvasHelp.prototype.TransformRect = function (x0, y0, w0, h0, x1, y1, w1, h1)
{
    if (w0 == 0 || h0 == 0) throw "can't map from a zero sized rectangle";
    
    var a = w1 / w0;
    var d = h1 / h0;
    var e = x1 - a * x0;
    var f = y1 - d * y0;
    
    this.context.setTransform(a, 0, 0, d, e, f);
}
//-------------------------------------------------------------------------------------------------
CanvasHelp.prototype.TransformRectToCanvas = function (x0, y0, w0, h0)
{
    this.TransformRect (x0, y0, w0, h0, 0, 0, this.canvas.width, this.canvas.height);
}


CanvasHelp.two_pi = 2 * Math.PI;


CanvasHelp.TextProperties = function (font, f_style, align, base)
{
    this.font = font; // Eg. "30px Arial";
    this.fillStyle = f_style;
    this.textAlign = align;
    this.textBaseline = base;
}

CanvasHelp.prototype.SetBackground = function (bgcolour)
{
    this.context.fillStyle = bgcolour;
}
CanvasHelp.prototype.SetTransparency = function (alpha)
{
    this.context.globalAlpha = alpha;
}     
        
CanvasHelp.prototype.SetForeground = function (fgcolour)
{
    this.context.strokeStyle = fgcolour;
}
CanvasHelp.prototype.SetLineWidth = function (w)
{
    this.context.lineWidth = w;
}
CanvasHelp.prototype.DrawImage = function (x, y, image)
{
    this.context.drawImage(image, x, y);
}
CanvasHelp.prototype.GetData = function ()
{
    return this.canvas.toDataURL();
}
CanvasHelp.prototype.Clear = function ()
{
    this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);
}
CanvasHelp.prototype.FillRect = function (x, y, w, h)
{
    this.context.fillRect(x, y, w, h);
}
CanvasHelp.prototype.SetPixel = function (x, y)
{
    this.context.fillRect(x, y, 1, 1);
}
CanvasHelp.prototype.DrawRect = function (x, y, w, h)
{
    this.context.rect(x, y, w, h);
    this.context.stroke();
}
CanvasHelp.prototype.DrawFilledRect = function (x, y, w, h)
{
    this.context.beginPath();
    this.context.fillRect(x, y, w, h);
    this.context.rect(x, y, w, h);
    this.context.stroke();
}
CanvasHelp.prototype.DrawLine = function (p1, p2)
{
    this.context.beginPath();
    this.context.moveTo(p1[0],p1[1]);
    this.context.lineTo(p2[0],p2[1]);
    this.context.stroke();
}
CanvasHelp.prototype.DrawLines = function (points)
{
    this.context.beginPath();
    this.context.moveTo(points[0][0],points[0][1]);
    for (var i = 1 ; i < points.length ; ++i)
    {
        this.context.lineTo(points[i][0],points[i][1]);
    }
    this.context.stroke();
}
CanvasHelp.prototype.DrawLineRelative = function (start, delta)
{
    this.context.beginPath();
    this.context.moveTo(start[0],start[1]);
    this.context.lineTo(start[0]+delta[0],start[1]+delta[1]);
    this.context.stroke();
}
CanvasHelp.prototype.DrawSolidText = function (font, text, x, y, colour)
{
    this.context.font = font; // Eg. "30px Arial";
    this.context.fillStyle = colour;
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(text, x, y);
}
CanvasHelp.prototype.DrawTextAt = function (x, y, text, props)
{
    if (props)
    {
        this.context.font = props.font;
        this.context.fillStyle = props.fillStyle;
        this.context.textAlign = props.textAlign;
        this.context.textBaseline = props.textBaseline;
    }
    
    this.context.fillText(text, x, y);
}

CanvasHelp.prototype.DrawSpot = function (x, y, r, colour)
{
    this.context.beginPath ();
    this.context.arc(x, y, r, 0, CanvasHelp.two_pi, false);
    this.context.fillStyle = colour;
    this.context.fill();
}
CanvasHelp.prototype.DrawFilledCircle = function (x, y, r, inside, outside)
{
    this.context.beginPath ();
    this.context.arc(x, y, r, 0, CanvasHelp.two_pi, false);
    this.context.fillStyle = inside;
    this.context.strokeStyle = outside;
    this.context.fill();
    this.context.stroke();
}
CanvasHelp.prototype.DrawCircle = function (x, y, r, outside)
{
    this.context.beginPath ();
    this.context.arc(x, y, r, 0, CanvasHelp.two_pi, false);
    this.context.strokeStyle = outside;
    this.context.stroke();
}
CanvasHelp.prototype.DrawPolygon = function (points, fill="nonzero")
{
    this.context.beginPath();
    this.context.moveTo(points [0][0], points [0][1]);
    
    for (var i = 0 ; i < points.length ; ++i)
    {
        this.context.lineTo(points[i][0], points[i][1]);
    }
    this.context.closePath();
    this.context.fill(fill);
    this.context.stroke();
}

CanvasHelp.prototype.FillPolygon = function (points)
{
    this.context.beginPath();
    this.context.moveTo(points [0][0], points [0][1]);

    for (var i = 0 ; i < points.length ; ++i)
    {
        this.context.lineTo(points[i][0], points[i][1]);
    }
    this.context.closePath();
    this.context.fill();
}

// For this to work, if the polygon is clockwise the hole must be anticlockwise
CanvasHelp.prototype.DrawPolygonWithHole = function (outer_points, inner_points)
{
    // outer

    this.context.beginPath();
    this.context.moveTo(outer_points [0][0], outer_points [0][1]);

    for (var i = 0 ; i < outer_points.length ; ++i)
    {
        this.context.lineTo(outer_points[i][0], outer_points[i][1]);
    }
    this.context.closePath();

    var n = inner_points.length - 1;

    this.context.moveTo(inner_points [n][0], inner_points [n][1]);

    for (var i = n-1 ; i >= 0 ; --i)
    {
        this.context.lineTo(inner_points[i][0], inner_points[i][1]);
    }
    this.context.closePath();

    this.context.fill();
    this.context.stroke();
}

CanvasHelp.prototype.Render = function (where)
{
    where.width = this.canvas.width;
    where.height = this.canvas.height;
    where.src = this.GetData ();
}
// Render into an img element
CanvasHelp.Clear = function (where)
{
    where.width = 0;
    where.height = 0;
    where.src = null;
}
// Fill entire canvas with an image
CanvasHelp.prototype.FillWithImage = function (image)
{
    void this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
}
// Get a pixel
CanvasHelp.prototype.GetPixel = function (x, y)
{
    var d = this.context.getImageData(x, y, 1, 1);
    return d.data;
}
// Get a pixel
CanvasHelp.prototype.GetPixelBlock = function (x, y, w, h)
{
    var d = this.context.getImageData(x, y, w, h);
    return d.data;
}



//------------------------------------------------------------------------------------------------------------------------------------
CanvasHelp.prototype.toString = function ()
{
  return "CanvasHelp: " + this.canvas.width + " x " + this.canvas.height;
}


