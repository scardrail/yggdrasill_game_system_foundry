
export const registerHandlebarsHelpers = function () {
    Handlebars.registerHelper('isNull', function (val) {
        return val == null;
    });

    Handlebars.registerHelper('isObject', function (val) {
        console.log("Yggdrasill | isObject | "+val);
        let result = val instanceof Object 
        console.log("Yggdrasill | isObject | "+result);
        return result;
    });

    Handlebars.registerHelper('notMagicOrMartial', function (val) {
        console.log("Yggdrasill | notMagicOrMartial | "+val);
        let isNotMagic = val !== "competenceMagique";
        console.log("Yggdrasill | notMagicOrMartial | isNotMagic:"+isNotMagic);
        let isNotMartial = val !== "competenceMartiale";
        console.log("Yggdrasill | notMagicOrMartial | isNotMartial:"+isNotMartial);
        var orStatement = true;
        if(!isNotMagic || !isNotMartial){
            orStatement = !orStatement;
        }
        console.log("Yggdrasill | notMagicOrMartial | orStatement:"+orStatement);

        return orStatement;
    });

    Handlebars.registerHelper('isEmpty', function (list) {
        if (list) return list.length == 0;
        else return 0;
    });

    Handlebars.registerHelper('notEmpty', function (list) {
        return list.length > 0;
    });

    Handlebars.registerHelper('isZeroOrNull', function (val) {
        return val == null || val == 0;
    });

    Handlebars.registerHelper('isNegative', function (val) {
        return val < 0;
    });

    Handlebars.registerHelper('isNegativeOrNull', function (val) {
        return val <= 0;
    });

    Handlebars.registerHelper('isPositive', function (val) {
        return val > 0;
    });

    Handlebars.registerHelper('isPositiveOrNull', function (val) {
        return val >= 0;
    });

    Handlebars.registerHelper('equals', function (val1, val2) {
        return val1 == val2;
    });
}