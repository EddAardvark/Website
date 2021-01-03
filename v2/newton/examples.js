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
    var j1 = '{"z9":{"start":0,"inc":0,"current":0},"z8":{"start":0,"inc":0,"current":0},"z7":{"start":0,"inc":0,"current":0},"z6":{"start":0,"inc":0,"current":0},"z5":{"start":0,"inc":0,"current":0},"z4":{"start":0,"inc":0,"current":0},"z3":{"start":1,"inc":0,"current":1},"z2":{"start":-2.55,"inc":0,"current":-2.55},"z1":{"start":0,"inc":0,"current":0},"z0":{"start":-1,"inc":0,"current":-1},"zoom":{"start":0.5,"inc":1.01,"current":0.5},"alpha":{"sx":1,"sy":0,"dx":0,"dy":0,"cx":1,"cy":0},"seed":{"sx":1,"sy":0,"dx":0,"dy":0,"cx":1,"cy":0},"steps":{"start":100,"inc":0,"current":100},"colour":{"sx":0,"sy":0,"dx":0,"dy":0,"cx":0,"cy":0}}';
    var t1 = 'z^3 - 2.55z^2 - 1';
    
    NewtonExamples.list ["A"] = {"text":t1, "json":j1};
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



 