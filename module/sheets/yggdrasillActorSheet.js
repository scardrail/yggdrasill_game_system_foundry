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
        data.tempers = data.items.filter(function(item) {return item.type == "temper"});
        data.martialCpt = data.items.filter(function(item) {return item.type == "martialCpt"});
        data.sejdrCpt = data.items.filter(function(item) {return item.type == "sejdrCpt"});
        data.galdrCpt = data.items.filter(function(item) {return item.type == "galdrCpt"});
        data.runeCpt = data.items.filter(function(item) {return item.type == "runeCpt"});
        console.log(data);
        return data;
    }

    activateListeners(html){
        html.find(".item-create").click(this._onItemCreate.bind(this));

        super.activateListeners(html);
    }

    _onItemCreate(event){
        event.preventDefault();
        let element = event.currentTarget;
        console.log(game);

        let itemData = {
            name: game.i18n.localize("yggdrasill.sheet.newCpt"),
            type: element.dataset.type
        };

        return this.actor.createOwnedItem(itemData);
    }
}