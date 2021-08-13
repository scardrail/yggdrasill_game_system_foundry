import * as Dice from "../dice.js"
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
        let data = super.getData();

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

        //if is editable
        if(this.isEditable){
            html.find(".item-create").click(this._onItemCreate.bind(this));
            html.find(".item-edit").click(this._onItemEdit.bind(this));
            html.find(".item-delete").click(this._onItemDelete.bind(this));
            html.find(".inline-edit").change(this._onSkillEdit.bind(this));
        }

        //if is editable
        if(this.actor.isOwner){
            html.find(".item-roll").click(this._onItemRoll.bind(this));
        }

        super.activateListeners(html);
    }

    _onItemCreate(event){
        event.preventDefault();
        let element = event.currentTarget;

        let options = {};

        let itemName = "yggdrasill.sheet.new";
        itemName = itemName.concat('-', element.dataset.type);

        let itemData = {
            name: game.i18n.localize(itemName),
            type: element.dataset.type
        };

        itemData = itemData instanceof Array ? itemData : [itemData];
        return this.actor.createEmbeddedDocuments("Item", itemData, options);
    }

    _onSkillEdit(event){
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item =  this.actor.items.get(itemId);
        let field = element.dataset.field;

        return item.update({ [field] : element.value });

    }

    _onItemEdit(event){
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item =  this.actor.items.get(itemId);

        item.sheet.render(true);

    }

    _onItemDelete(event){
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let options = {};

        itemId = itemId instanceof Array ? itemId : [itemId];

        return this.actor.deleteEmbeddedDocuments("Item", itemId, options);
    }

    _onItemRoll(event){
        event.preventDefault();
        let element = event.currentTarget;
        console.log(element.dataset.modifier);
        
        Dice.TaskCheck(
            {
                actionValue: element.dataset.value, 
                actionsMod: element.dataset.modifier, 
                extra:element.dataset.extra
            }
        )
    }
}