export const registerHandlebarsHelpers = function() {
    Handlebars.registerHelper('isNull', function(val) {
        return val == null;
    });

    Handlebars.registerHelper('isObject', function(val) {
        let result = val instanceof Object
        return result;
    });

    Handlebars.registerHelper('nbItem', function(list) {
        console.log("Yggdrasill | nbItem | list:" + list[0].specialite);
        console.log("Yggdrasill | nbItem | list.length:" + list.length);
        if (list) return list.length;
        else return 0;
    });

    Handlebars.registerHelper('isOffensive', function(owner) {
        let attacker = game.actors.get(owner);
        let val = attacker.data.data.caracUsed.isOffensive;
        console.log("Yggdrasill | isOffensive | val : " + val);
        return val;
    });


    Handlebars.registerHelper('notMagicOrMartial', function(val) {
        let isNotMagic = val !== "competenceMagique";
        let isNotMartial = val !== "competenceMartiale";
        var orStatement = true;
        if (!isNotMagic || !isNotMartial) {
            orStatement = !orStatement;
        }
        return orStatement;
    });

    Handlebars.registerHelper('isEmpty', function(list) {
        if (list) return list.length == 0;
        else return 0;
    });

    Handlebars.registerHelper('notEmpty', function(list) {
        return list.length > 0;
    });

    Handlebars.registerHelper('isZeroOrNull', function(val) {
        return val == null || val == 0;
    });

    Handlebars.registerHelper('isNegative', function(val) {
        return val < 0;
    });

    Handlebars.registerHelper('isNegativeOrNull', function(val) {
        return val <= 0;
    });

    Handlebars.registerHelper('isPositive', function(val) {
        return val > 0;
    });

    Handlebars.registerHelper('isPositiveOrNull', function(val) {
        return val >= 0;
    });


    Handlebars.registerHelper('subs', function(val1, val2) {
        var substract = 0;
        substract = parseInt(val1) - parseInt(val2);
        return substract;
    });
    Handlebars.registerHelper('add', function(val1, val2) {
        var addition = 0;
        addition = val1 + val2;
        return addition;
    });
    Handlebars.registerHelper('equals', function(val1, val2) {
        return val1 == val2;
    });
    Handlebars.registerHelper('eqNot', function(val1, val2) {
        return val1 != val2;
    });
    Handlebars.registerHelper('upper', function(val1, val2) {
        return val1 > val2;
    });
    Handlebars.registerHelper('lower', function(val1, val2) {
        return val1 < val2;
    });
    Handlebars.registerHelper('upperEq', function(val1, val2) {
        return val1 >= val2;
    });
    Handlebars.registerHelper('lowerEq', function(val1, val2) {
        return val1 <= val2;
    });
    Handlebars.registerHelper('or', function(val1, val2) {
        return val1 || val2;
    });
    Handlebars.registerHelper('and', function(val1, val2) {
        return val1 && val2;
    });

    Handlebars.registerHelper('eqOr', function(val1, val2, val3, val4) {
        return val1 == val2 || val3 == val4;
    });
    Handlebars.registerHelper('not', function(cond) {
        return !cond;
    });
    Handlebars.registerHelper('orNot', function(val1, val2) {
        return !val1 || !val2;
    });
    Handlebars.registerHelper('andNot', function(val1, val2) {
        return !val1 && !val2;
    });
    Handlebars.registerHelper('xAndNot', function(val1, val2) {
        if (val1 == val2 && val1 && val2)
            return false;
        else
            return true;
    });
    Handlebars.registerHelper('stringify', function(val) {
        return parseInt(val);
    });

    Handlebars.registerHelper('times', function(n, block) {
        var accum = '';
        for (var i = 0; i < n; ++i) {
            block.data.index = i;
            block.data.first = i === 0;
            block.data.last = i === (n - 1);
            accum += block.fn(this);
        }
        return accum;
    });



    Handlebars.registerHelper('for', function(from, to, incr, block) {
        var accum = '';
        for (var i = from; i < to; i += incr)
            accum += block.fn(i);
        return accum;
    });
}