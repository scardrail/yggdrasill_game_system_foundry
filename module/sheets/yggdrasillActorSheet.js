import * as Dice from "../dice.js"
import * as calculStats from "../calculStats.js"
export default class YggdrasillActorSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            with: 840,
            height: 800,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "carac" }],
            template: "systems/yggdrasill/templates/sheets/importantCharacter-sheet.hbs",
            classes: ["yggdrasill", "sheet", "importantCharacter"]
        })
    }

    getData() {
        let data = super.getData();

        data.config = CONFIG.yggdrasill;

        data.weapons = data.items.filter(function(item) { return item.type == "arme" });
        data.armors = data.items.filter(function(item) { return item.type == "protection" });
        data.objects = data.items.filter(function(item) { return item.type == "object" });
        data.competences = data.items.filter(function(item) { return item.type == "competence" });
        data.tempers = data.items.filter(function(item) { return item.type == "temper" });
        data.martialCpt = data.items.filter(function(item) { return item.type == "martialCpt" });
        data.sejdrCpt = data.items.filter(function(item) { return item.type == "sejdrCpt" });
        data.galdrCpt = data.items.filter(function(item) { return item.type == "galdrCpt" });
        data.runeCpt = data.items.filter(function(item) { return item.type == "runeCpt" });

        if (data.actor.type == "extra" || data.actor.type == "creature") {
            data.data.data = calculStats.setExtraCaracs(data.data.data);
        } else {
            // data.data.data = calculStats.setCharacterCaracs(data.data.data);
        }

        console.log(data);

        return data;
    }

    activateListeners(html) {

        //if is editable
        if (this.isEditable) {
            html.find(".item-create").click(this._onItemCreate.bind(this));
            html.find(".item-edit").click(this._onItemEdit.bind(this));
            html.find(".item-delete").click(this._onItemDelete.bind(this));
            html.find(".inline-edit").change(this._onSkillEdit.bind(this));
        }

        //if is editable
        if (this.actor.isOwner) {
            html.find(".item-roll").click(this._onItemRoll.bind(this));
            html.find(".task-check").click(this._onTaskCheck.bind(this));
        }

        super.activateListeners(html);
    }

    _onItemCreate(event) {
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

    _onSkillEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let field = element.dataset.field;
        let value = element.value
        if (element.type == "checkbox") {
            value = element.checked;
        }
        return item.update({
            [field]: value
        });

    }

    _onItemEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);

        item.sheet.render(true);

    }

    _onItemDelete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let options = {};

        itemId = itemId instanceof Array ? itemId : [itemId];

        return this.actor.deleteEmbeddedDocuments("Item", itemId, options);
    }

    _onItemRoll(event) {
        const itemId = event.currentTarget.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);

        item.roll();
    }

    _onTaskCheck(event) {
        let item = {};
        try {
            item = this.actor.items.get(event.currentTarget.dataset.itemId).data;
        } catch (e) {
            item = null
        }
        Dice.TaskCheck({
            actionValue: event.currentTarget.dataset.actionValue,
            nbDiceKept: event.currentTarget.dataset.nbDiceKept,
            nbDiceFuror: event.currentTarget.dataset.nbDiceFuror,
            destinyDice: event.currentTarget.dataset.destinyDice,
            caracValue: event.currentTarget.dataset.caracValue,
            modifier: event.currentTarget.dataset.modifier,
            actor: this.actor.data,
            item: item,
        })
    }

    _onFurorCheck(event) {
        const actor = this.actor.data;
        let rollFormula = "";
        let sr = {};
        if (element.dataset.type == "enter") {
            sr = {
                "frisky": 14,
                "injured": 19,
                "bruised": 25
            };
            rollFormula = "(@caracValue)d10kh(@nbDiceKept)x10+@modifiercs>=@sr";
        } else {
            sr = {
                "frisky": 5,
                "injured": 7,
                "bruised": 10
            };
            rollFormula = "((@caracValue)d10kh(@nbDiceKept)x10+@actionValue+@modifier)cs>=(@sr+@usedFurorDices)";
        }
        let rollData = {
            actionValue: actor.data.secCarac.ttlDm,
            sr: sr[actor.data.lifePoints.status],
            usedFurorDices: actor.data.reserve.max - actor.data.reserve.value,
            nbDiceKept: actor.data.nbDiceKept,
            caracValue: actor.data.primCarac.spirit.intelect.value,
            modifier: actor.data.rollModifier + actor.data.primCarac.spirit.intelect.mod + actor.data.actions.modifier,
        };

        let messageData = {
            speaker: ChatMessage.getSpeaker(),
        };
        new Roll(rollFormula, rollData).roll().toMessage(messageData);

    }
}