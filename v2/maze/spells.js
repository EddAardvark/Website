//-------------------------------------------------------------------------------------------------
// Spells for use in the javascript maze.
// (c) John Whitehouse 2013
// www.eddaardvark.co.uk
//-------------------------------------------------------------------------------------------------

// Spells consist of a combination of elements, not all combinations will be valid, these
// components are listed below.

// Levels - determines effectiveness, range and duration

var SPELL_LEVEL_1 = 1;
var SPELL_LEVEL_2 = 2;
var SPELL_LEVEL_3 = 3;
var SPELL_LEVEL_4 = 4;
var SPELL_LEVEL_5 = 5;
var SPELL_LEVEL_6 = 6;
var SPELL_LEVEL_7 = 7;
var SPELL_LEVEL_8 = 8;
var SPELL_LEVEL_9 = 9;
var SPELL_LEVEL_10 = 10;

// Spell types - what the spell does

var SPELL_DIG = 1000;
var SPELL_MINE = 1001;
var SPELL_PATH = 1002;
var SPELL_LOCATE = 1003;
var SPELL_TELEPORT = 1004;
var SPELL_PUSH = 1005;
var SPELL_BURN = 1006;
var SPELL_FREEZE = 1007;
var SPELL_PICK_UP = 1008;
var SPELL_THROW = 1009;
var SPELL_PULL = 1010;
var SPELL_ROCKS = 1011;

// Target types - what the spell acts on

var SPELL_PLAYER = 2000;
var SPELL_MONSTER = 2001;
var SPELL_STRUCTURE = 2002;
var SPELL_HOME = 2003;
var SPELL_EXIT = 2004;
var SPELL_LOCK = 2005;
var SPELL_KEY = 2006;
var SPELL_GEM = 2007;
var SPELL_FLAG = 2008;
var SPELL_BEACON = 2009;
var SPELL_ANYTHING = 2010;

// Power - modifies range and the magnitude of the effects

var SPELL_POWER_MINIMUM = 3001;
var SPELL_POWER_LOW = 3002;
var SPELL_POWER_MEDIUM = 3003;
var SPELL_POWER_HIGH = 3004;
var SPELL_POWER_MAXIMUM = 3005;

// Directions

var SPELL_HERE = 4000;
var SPELL_N = 4001;
var SPELL_NE = 4002;
var SPELL_E = 4003;
var SPELL_SE = 4004;
var SPELL_S = 4005;
var SPELL_SW = 4006;
var SPELL_W = 4007;
var SPELL_NW = 4008;
var SPELL_UP = 4009;
var SPELL_DOWN = 4010;
var SPELL_RANDOM_DIRECTION = 4011;

// Spread (1 = beam, 8 = all around)

var SPELL_SPREAD_1 = 5000;
var SPELL_SPREAD_3 = 5001;
var SPELL_SPREAD_5 = 5002;
var SPELL_SPREAD_7 = 5003;
var SPELL_SPREAD_8 = 5004;

var RUNETYPE_LEVEL = 0;
var RUNETYPE_TYPE = 1;
var RUNETYPE_TARGET = 2;
var RUNETYPE_POWER = 3;
var RUNETYPE_DIRECTION = 4;
var RUNETYPE_SPREAD = 5;

// Use some obscure unicode characters as runes

var runes =
[
    SPELL_LEVEL_1,
    SPELL_LEVEL_2,
    SPELL_LEVEL_3,
    SPELL_LEVEL_4,
    SPELL_LEVEL_5,
    SPELL_LEVEL_6,
    SPELL_LEVEL_7,
    SPELL_LEVEL_8,
    SPELL_LEVEL_9,
    SPELL_LEVEL_10,

    SPELL_DIG,
    SPELL_MINE,
    SPELL_PATH,
    SPELL_LOCATE,
    SPELL_TELEPORT,
    SPELL_PUSH,
    SPELL_BURN,
    SPELL_FREEZE,
    SPELL_PICK_UP,
    SPELL_THROW,
    SPELL_PULL,
    SPELL_ROCKS,

    SPELL_PLAYER,
    SPELL_MONSTER,
    SPELL_STRUCTURE,
    SPELL_HOME,
    SPELL_EXIT,
    SPELL_LOCK,
    SPELL_KEY,
    SPELL_GEM,
    SPELL_FLAG,
    SPELL_BEACON,
    SPELL_ANYTHING,

    SPELL_POWER_MINIMUM,
    SPELL_POWER_LOW,
    SPELL_POWER_MEDIUM,
    SPELL_POWER_HIGH,
    SPELL_POWER_MAXIMUM,

    SPELL_HERE,
    SPELL_N,
    SPELL_NE,
    SPELL_E,
    SPELL_SE,
    SPELL_S,
    SPELL_SW,
    SPELL_W,
    SPELL_NW,
    SPELL_UP,
    SPELL_DOWN,
    SPELL_RANDOM_DIRECTION,

    SPELL_SPREAD_1,
    SPELL_SPREAD_3,
    SPELL_SPREAD_5,
    SPELL_SPREAD_7,
    SPELL_SPREAD_8,
];

var rune_details = {};

rune_details [SPELL_LEVEL_1] = { desc: "Level 1", rune: "&#x0298" };
rune_details [SPELL_LEVEL_2] = { desc: "Level 2", rune: "&#x026E" };
rune_details [SPELL_LEVEL_3] = { desc: "Level 3", rune: "&#x0293" };
rune_details [SPELL_LEVEL_4] = { desc: "Level 4", rune: "&#x0289" };
rune_details [SPELL_LEVEL_5] = { desc: "Level 5", rune: "&#x0255" };
rune_details [SPELL_LEVEL_6] = { desc: "Level 6", rune: "&#x0256" };
rune_details [SPELL_LEVEL_7] = { desc: "Level 7", rune: "&#x029D" };
rune_details [SPELL_LEVEL_8] = { desc: "Level 8", rune: "&#x0258" };
rune_details [SPELL_LEVEL_9] = { desc: "Level 9", rune: "&#x02AE" };
rune_details [SPELL_LEVEL_10] = { desc: "Level 10", rune: "&#x0CDE" };

rune_details [SPELL_DIG] =              { desc: "Dig",       rune: "&#x0260" };
rune_details [SPELL_MINE] =             { desc: "Mine",      rune: "&#x263F" };
rune_details [SPELL_PATH] =             { desc: "Find path", rune: "&#x10C4" };
rune_details [SPELL_LOCATE] =           { desc: "Locate",    rune: "&#x0263" };
rune_details [SPELL_TELEPORT] =         { desc: "Teleport",  rune: "&#x02A7" };
rune_details [SPELL_PUSH] =             { desc: "Push",      rune: "&#x02A8" };
rune_details [SPELL_BURN] =             { desc: "Burn",      rune: "&#x0DF4" };
rune_details [SPELL_FREEZE] =           { desc: "Freeze",    rune: "&#x2042" };
rune_details [SPELL_PICK_UP] =          { desc: "Pick up",   rune: "&#x2668" };
rune_details [SPELL_THROW] =            { desc: "Throw",     rune: "&#x02AC" };
rune_details [SPELL_PULL] =             { desc: "Pull",      rune: "&#x02AD" };
rune_details [SPELL_ROCKS] =            { desc: "Rocks",     rune: "&#x0A8C" };

rune_details [SPELL_PLAYER] =           { desc: "Player",    rune: "&#x0537" };
rune_details [SPELL_MONSTER] =          { desc: "Monster",   rune: "&#x0C93" };
rune_details [SPELL_STRUCTURE] =        { desc: "Structure", rune: "&#x213F" };
rune_details [SPELL_HOME] =             { desc: "Home",      rune: "&#x039E" };
rune_details [SPELL_EXIT] =             { desc: "Exit",      rune: "&#x25A3" };
rune_details [SPELL_LOCK] =             { desc: "Lock",      rune: "&#x0275" };
rune_details [SPELL_KEY] =              { desc: "Key",       rune: "&#x0276" };
rune_details [SPELL_GEM] =              { desc: "Gem",       rune: "&#x0277" };
rune_details [SPELL_FLAG] =             { desc: "Flag",      rune: "&#x0278" };
rune_details [SPELL_BEACON] =           { desc: "Beacon",    rune: "&#x203B" };
rune_details [SPELL_ANYTHING] =         { desc: "Anything",  rune: "&#x03DE" };

rune_details [SPELL_POWER_MINIMUM] =    { desc: "Mininum power",    rune: "&#x03E0" };
rune_details [SPELL_POWER_LOW] =        { desc: "Standard power",   rune: "&#x03E2" };
rune_details [SPELL_POWER_MEDIUM] =     { desc: "Medium power",     rune: "&#x0416" };
rune_details [SPELL_POWER_HIGH] =       { desc: "High power",       rune: "&#x0414" };
rune_details [SPELL_POWER_MAXIMUM] =    { desc: "Maximum power",    rune: "&#x042E" };

rune_details [SPELL_HERE] =             { desc: "Here",     rune: "&#x0466" };
rune_details [SPELL_N] =                { desc: "N",        rune: "&#x0583" };
rune_details [SPELL_NE] =               { desc: "NE",       rune: "&#x0468" };
rune_details [SPELL_E] =                { desc: "E",        rune: "&#x0253" };
rune_details [SPELL_SE] =               { desc: "SE",       rune: "&#x046A" };
rune_details [SPELL_S] =                { desc: "S",        rune: "&#x0586" };
rune_details [SPELL_SW] =               { desc: "SW",       rune: "&#x026E" };
rune_details [SPELL_W] =                { desc: "W",        rune: "&#x0539" };
rune_details [SPELL_NW] =               { desc: "NW",       rune: "&#x053D" };
rune_details [SPELL_UP] =               { desc: "Up",       rune: "&#x0291" };
rune_details [SPELL_DOWN] =             { desc: "Down",     rune: "&#x0B95" };
rune_details [SPELL_RANDOM_DIRECTION] = { desc: "Random",   rune: "&#x13AD" };

rune_details [SPELL_SPREAD_1] =         { desc: "Spread 1", rune: "&#x13DC" };
rune_details [SPELL_SPREAD_3] =         { desc: "Spread 3", rune: "&#x0512" };
rune_details [SPELL_SPREAD_5] =         { desc: "Spread 5", rune: "&#x06DE" };
rune_details [SPELL_SPREAD_7] =         { desc: "Spread 7", rune: "&#x0A8B" };
rune_details [SPELL_SPREAD_8] =         { desc: "Spread 8", rune: "&#x0B87" };

var spell_structure = {};

var SPELL_NONE = -1;        // Not needed
var SPELL_REQUIRED = -2;    // Must be provided
var SPELL_INVENTORY = -2;   // Something from the inventory

spell_structure [SPELL_DIG] = { direction: SPELL_REQUIRED, spread: SPELL_SPREAD_1, target: SPELL_NONE, power: SPELL_POWER_LOW};
spell_structure [SPELL_MINE] = { direction: SPELL_REQUIRED, spread: SPELL_SPREAD_1, target: SPELL_NONE, power: SPELL_POWER_LOW};
spell_structure [SPELL_PATH] = { direction: SPELL_NONE, spread: SPELL_NONE, target: SPELL_REQUIRED, power: SPELL_POWER_LOW};
spell_structure [SPELL_LOCATE] = { direction: SPELL_NONE, spread: SPELL_NONE, target: SPELL_REQUIRED, power: SPELL_POWER_LOW};
spell_structure [SPELL_TELEPORT] = { direction: SPELL_NONE, spread: SPELL_NONE, target: SPELL_NONE, power: SPELL_POWER_LOW};
spell_structure [SPELL_PUSH] = { direction: SPELL_REQUIRED, spread: SPELL_SPREAD_1, target: SPELL_NONE, power: SPELL_POWER_LOW};
spell_structure [SPELL_ROCKS] = { direction: SPELL_REQUIRED, spread: SPELL_SPREAD_1, target: SPELL_NONE, power: SPELL_POWER_LOW};
spell_structure [SPELL_BURN] = { direction: SPELL_REQUIRED, spread: SPELL_SPREAD_1, target: SPELL_NONE, power: SPELL_POWER_LOW};
spell_structure [SPELL_FREEZE] = { direction: SPELL_REQUIRED, spread: SPELL_SPREAD_1, target: SPELL_NONE, power: SPELL_POWER_LOW};
spell_structure [SPELL_PICK_UP] = { direction: SPELL_REQUIRED, spread: SPELL_SPREAD_1, target: SPELL_NONE, power: SPELL_POWER_LOW};
spell_structure [SPELL_THROW] = { direction: SPELL_REQUIRED, spread: SPELL_SPREAD_1, target: SPELL_INVENTORY, power: SPELL_POWER_LOW};
spell_structure [SPELL_PULL] = { direction: SPELL_REQUIRED, spread: SPELL_SPREAD_1, target: SPELL_NONE, power: SPELL_POWER_LOW};

// Spell levels

var spell_levels = {};

spell_levels [SPELL_LEVEL_1] = 1;
spell_levels [SPELL_LEVEL_2] = 2;
spell_levels [SPELL_LEVEL_3] = 3;
spell_levels [SPELL_LEVEL_4] = 4;
spell_levels [SPELL_LEVEL_5] = 5;
spell_levels [SPELL_LEVEL_6] = 6;
spell_levels [SPELL_LEVEL_7] = 7;
spell_levels [SPELL_LEVEL_8] = 8;
spell_levels [SPELL_LEVEL_9] = 9;
spell_levels [SPELL_LEVEL_10] = 10;

// Spell powers

var spell_powers = {};

spell_powers [SPELL_POWER_MINIMUM] = 1;
spell_powers [SPELL_POWER_LOW] =     2;
spell_powers [SPELL_POWER_MEDIUM] =  3;
spell_powers [SPELL_POWER_HIGH] =    4;
spell_powers [SPELL_POWER_MAXIMUM] = 5;

// Map rune values to their display string

var rune_map = {};
for (var i = 0 ; i < runes.length ; ++i)
{
    rune_map [runes [i].value] = runes [i].rune;
}

//-------------------------------------------------------------------------------------------------
// Create a spell
//-------------------------------------------------------------------------------------------------
function Spell ()
{
    this.spell = [];
}
//-------------------------------------------------------------------------------------------------
// Convert a rune value to a type
//-------------------------------------------------------------------------------------------------
Spell.GetRuneType = function (rune)
{
    return Math.floor (rune / 1000);
}
//-------------------------------------------------------------------------------------------------
// Add a rune to a spell
//-------------------------------------------------------------------------------------------------
Spell.prototype.AddRune = function (rune)
{
    if (this.spell.indexOf(rune) == -1)
    {
        this.spell.push (rune);
    }
    MazePopup.Replace (this.MakeSpellConstructor ());
}
//-------------------------------------------------------------------------------------------------
// remove a rune from a spell
//-------------------------------------------------------------------------------------------------
Spell.prototype.RemoveRune = function (rune)
{
    var idx = this.spell.indexOf(rune);

    if (idx != -1)
    {
        this.spell.splice (idx, 1);
    }
    MazePopup.Replace (this.MakeSpellConstructor ());
}
//-------------------------------------------------------------------------------------------------
// Allow a user to construct a spell from the set of runes
//-------------------------------------------------------------------------------------------------
Spell.prototype.MakeSpellConstructor = function ()
{
    var text = "<h1> Create a spell </h1>";

    text += "<div style=\"overflow:auto;\">";

    var num = runes.length;

    var text = "<h2> Available runes </h2>";

    for (var i = 0 ; i < num ; ++i)
    {
        text += "<div class=\"rune\" OnClick='maze.spell.AddRune(" + runes[i] + ")'>" + rune_details [runes[i]].rune + "</div>";
    }
    text += "<div style=\"clear:both;\"/><h2> Current spell </h2>";

    num = this.spell.length;

    for (var i = 0 ; i < num ; ++i)
    {
        text += "<div class=\"rune\" OnClick='maze.spell.RemoveRune(" + this.spell[i] + ")'>" + rune_details [this.spell[i]].rune + "</div>";
    }
    text += "</div><div style=\"clear:both;\"/>";

    if (num > 0)
    {
        text += "<button OnClick='maze.spell.CastCurrentSpell()'> Cast </button>";
    }

    return text;
}
//-------------------------------------------------------------------------------------------------
// Show a list of the known runes, currently all of them
//-------------------------------------------------------------------------------------------------
Spell.MakeRuneList = function ()
{
    var text = "<h2> Available runes </h2>";
    var num = runes.length;

    for (var i = 0 ; i < num ; ++i)
    {
        text += "<div class=\"popupbox\"><div class=\"rune\">" + rune_details [runes[i]].rune;
        text += "</div>" + rune_details [runes[i]].desc + "</div>";
    }
    text += "</div><div style=\"clear:both;\"/>";
    return text;
}
//-------------------------------------------------------------------------------------------------
// Allow a user to construct a spell from the set of runes
//-------------------------------------------------------------------------------------------------
Spell.MakeRune = function ()
{
    var text = "<h2> Available runes </h2>";
    var num = runes.length;

    for (var i = 0 ; i < num ; ++i)
    {
        text += "<div class=\"rune\" OnClick='maze.spell.AddRune(" + runes[i] + ")'>" + rune_details [runes[i]].rune + "</div>";
    }
    text += "<div style=\"clear:both;\"/><h2> Current spell </h2>";

    num = this.spell.length;

    for (var i = 0 ; i < num ; ++i)
    {
        text += "<div class=\"rune\" OnClick='maze.spell.RemoveRune(" + this.spell[i] + ")'>" + rune_details [this.spell[i]].rune + "</div>";
    }
    text += "</div><div style=\"clear:both;\"/>";

    if (num > 0)
    {
        text += "<button OnClick='maze.spell.CastCurrentSpell()'> Cast </button>";
    }

    return text;
}
//-------------------------------------------------------------------------------------------------
// Cast the current spell
// A spell needs a level rune and a type rune, other runes are optional/conditional
//-------------------------------------------------------------------------------------------------
Spell.prototype.CastCurrentSpell = function ()
{
    var num = this.spell.length;

    if (num < 1)
    {
        return;
    }

    // level (required)

    var result = Spell.GetRuneAt (this.spell, 0, RUNETYPE_LEVEL, SPELL_REQUIRED);

    if (result == null)
    {
        return;
    }

    this.level = result.rune;

    // Type (required)

    result = Spell.GetRuneAt (this.spell, result.index, RUNETYPE_TYPE, SPELL_REQUIRED);

    if (result == null)
    {
        return;
    }

    this.type = result.rune;

    // Target (depends on the type)

    var mode = spell_structure [this.type].target;
    result = Spell.GetRuneAt (this.spell, result.index, RUNETYPE_TARGET, mode);

    if (result == null)
    {
        return;
    }

    this.target = result.rune;

    // Power (depends on the type)

    mode = spell_structure [this.type].power;

    result = Spell.GetRuneAt (this.spell, result.index, RUNETYPE_POWER, mode);

    if (result == null)
    {
        return;
    }

    this.power = result.rune;

    // Direction (depends on the type)

    mode = spell_structure [this.type].direction;
    result = Spell.GetRuneAt (this.spell, result.index, RUNETYPE_DIRECTION, mode);

    if (result == null)
    {
        return;
    }

    var direction = result.rune;

    // Spread (depends on the type)

    var mode = spell_structure [this.type].spread;
    result = Spell.GetRuneAt (this.spell, result.index, RUNETYPE_SPREAD, mode);

    if (result == null)
    {
        return;
    }

    this.spread = result.rune;
    MazePopup.Hide ();

    switch (this.type)
    {
        case SPELL_PATH:
            maze.CastFindSpell (this.level, this.power, this.target);
            break;
    }
}
//-------------------------------------------------------------------------------------------------
// Extracts a rune from a spell, returns a tuple [rune,index] if the process is successful
// of null if it isn't.
//-------------------------------------------------------------------------------------------------
Spell.GetRuneAt = function (spell, index, expected_type, mode)
{
    // Not wanted, leave index unchanged

    if (mode == SPELL_NONE)
    {
        return {rune: SPELL_NONE, index: index};
    }

    // required and missing => incomplete

    if (index >= spell.length)
    {
        if (mode == SPELL_REQUIRED)
        {
            MazePopup.Replace (Spell.ShowIncompleteSpell (spell));
            return null;
        }
        return {rune: mode, index: index};
    }

    // See if there is an explicit value

    var rune = spell [index];
    var rune_type = Spell.GetRuneType (rune);

    // If there is advance the index and return the rune.

    if (rune_type == expected_type)
    {
        return {rune: rune, index: index + 1};
    }

    // if the rune is required the spell fizzles

    if (mode == SPELL_REQUIRED)
    {
        MazePopup.Replace (Spell.ShowFizzledSpell (spell, index));
        return null;
    }

    // return the default value (same as the mode)

    return {rune: mode, index: index};
}
//-------------------------------------------------------------------------------------------------
// Show an incomplete spell
//-------------------------------------------------------------------------------------------------
Spell.ShowIncompleteSpell = function (spell, pos)
{
    var text = "<h1> Incomplete Spell </h1>";

    text += "<p> All spells need a level indication and a spell type. Additional runes act as modifiers.</p>";

    text += "<div style=\"overflow:auto;\">";

    var num = spell.length;

    for (var i = 0 ; i < num ; ++i)
    {
        var c = "goodrune";
        text += "<div class=\"goodrune\"><span title=\"Rune\">" + rune_details [spell[i]].rune  + "</span></div>";
    }
    text += "</div><div style=\"clear:both;\"/>";

    return text;
}
//-------------------------------------------------------------------------------------------------
// Show a fizzled spell with an indicator of where it failed
//-------------------------------------------------------------------------------------------------
Spell.ShowFizzledSpell = function (spell, pos)
{
    var text = "<h1> Fizzle </h1>";

    text += "<p> Your spell fizzled at rune " + (pos + 1) + "</p>";

    text += "<div style=\"overflow:auto;\">";

    var num = spell.length;

    for (var i = 0 ; i < num ; ++i)
    {
        var c = "goodrune";
        if (i == pos)
        {
            c = "badrune";
        }
        else if (i > pos)
        {
            c = "untriedrune";
        }
        text += "<div class=\"" + c + "\">" + rune_details [spell[i]].rune + "</div>";
    }
    text += "</div><div style=\"clear:both;\"/>";

    return text;
}
