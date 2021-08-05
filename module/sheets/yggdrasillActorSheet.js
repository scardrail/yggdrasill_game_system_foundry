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
        console.log(data);
        return data;
    }
}