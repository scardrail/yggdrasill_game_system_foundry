export default class YggdrasillActorSheet extends ActorSheet {
    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            with: 840,
            height: 800,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "carac"}],
            template: "systems/yggdrasill/templates/sheets/importantCharacter-sheet.hbs",
            classes: ["yggdrasill", "sheet", "importantCharacter"]
        })
    };

    getData(){
        const data = super.getData();
        data.config = CONFIG.yggdrasill;
        data.weapons = data.items.filter(function(item) {return item.type == "arme"});
        data.armors = data.items.filter(function(item) {return item.type == "protection"});
        data.objects = data.items.filter(function(item) {return item.type == "object"});
        data.competences = data.items.filter(function(item) {return item.type == "competence"});
        data.martialCpt = data.items.filter(function(item) {return item.type == "martialCpt"});
        data.sejdrCpt = data.items.filter(function(item) {return item.type == "sejdrCpt"});
        data.galdrCpt = data.items.filter(function(item) {return item.type == "galdrCpt"});
        data.runeCpt = data.items.filter(function(item) {return item.type == "runeCpt"});
        console.log(data);
        return data;
    }
}