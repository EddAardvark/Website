//-------------------------------------------------------------------------------------------------
// Represents a polynomial used in the Newton fractal generator.
// (c) John Whitehouse 2015
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------
function NewtonExamples ()
{
}

NewtonExamples.list = {};

NewtonExamples.FillList = function ()
{
    var j1 = '{"z9":0,"z8":0,"z7":0,"z6":0,"z5":0,"z4":0,"z3":1,"z2":-2.55,"z1":0,"z0":-1,"zoom":[0.5,1.5],"steps":[100,500],"alpha":{"x":1,"y":0},"seed":{"x":1,"y":0},"colour":{"x":0,"y":0}}';
    var t1 = 'z^3 - 2.55z^2 - 1';
    
    var j2 = '{"z9":0,"z8":0,"z7":0,"z6":0,"z5":0,"z4":0,"z3":1,"z2":-2.51132528,"z1":0,"z0":-1,"zoom":[7,7],"steps":[100,500],"alpha":{"x":1,"y":0},"seed":{"x":0.862857,"y":0},"colour":{"x":0,"y":0}}';
    var t2 = 'Unusual non-convergent region';

    var j3 = '{"z9":0,"z8":0,"z7":0,"z6":0,"z5":0,"z4":1,"z3":0,"z2":4,"z1":0,"z0":4,"zoom":[0.5,1.5],"steps":[1000,5000],"alpha":{"x":1,"y":0},"seed":{"x":0.832958396,"y":0},"colour":{"x":0,"y":0}}';
    var t3 = 'Two double real roots';

    var j4 = '{"z9":0,"z8":0,"z7":0,"z6":0,"z5":0,"z4":1,"z3":0,"z2":-4,"z1":0,"z0":4,"zoom":[0.5,1.5],"steps":[1000,5000],"alpha":{"x":1,"y":0},"seed":{"x":0.832958396,"y":0},"colour":{"x":0,"y":0}}';
    var t4 = 'Two double imaginary roots';

    var j5 = '{"z9":0,"z8":0,"z7":0,"z6":1,"z5":-5.1,"z4":6.5025,"z3":-2,"z2":5.1,"z1":0,"z0":[1,1.5],"zoom":[0.5,1.5],"steps":[100,500],"alpha":{"x":1,"y":0},"seed":{"x":1,"y":0},"colour":{"x":0,"y":0}}';
    var t5 = '(z^3 - 2.55z^2 - 1)^2';

    
    NewtonExamples.list ["A"] = {"text":t1, "json":j1};
    NewtonExamples.list ["B"] = {"text":t2, "json":j2};
    NewtonExamples.list ["C"] = {"text":t3, "json":j3};
    NewtonExamples.list ["D"] = {"text":t4, "json":j4};
    NewtonExamples.list ["E"] = {"text":t5, "json":j5};
}

//-------------------------------------------------------------------------------------------------

NewtonExamples.FillList ();

//-------------------------------------------------------------------------------------------------
NewtonExamples.GetExample = function (id)
{
    return NewtonExamples.list.hasOwnProperty (id) ? NewtonExamples.list [id].json : null;
}
//-------------------------------------------------------------------------------------------------

NewtonExamples.ShowExamples = function (sel)
{
    for (var idx in NewtonExamples.list)
    {
        var opt = document.createElement("option");
        opt.text = NewtonExamples.list[idx].text;
        opt.value = idx;
        sel.add(opt);
    }
}



 