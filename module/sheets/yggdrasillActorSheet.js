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
        data.powers = data.items.filter(function(item) { return item.type == "power" });
        data.armors = data.items.filter(function(item) { return item.type == "protection" });
        data.objects = data.items.filter(function(item) { return item.type == "object" });
        data.runes = data.items.filter(function(item) { return item.type == "rune" });
        data.competences = data.items.filter(function(item) { return item.type == "competence" });
        data.competencesNormal = data.competences.filter(function(item) { return item.data.type == "base" }).sort((a, b) => parseInt(b.data.value) - parseInt(a.data.value));
        data.competencesMartial = data.competences.filter(function(item) { return item.data.type == "martial" }).sort((a, b) => parseInt(b.data.value) - parseInt(a.data.value));
        data.competencesMagic = data.competences.filter(function(item) { return item.data.type == "magic" }).sort((a, b) => parseInt(b.data.value) - parseInt(a.data.value));
        data.tempers = data.items.filter(function(item) { return item.type == "temper" });
        data.martialCpt = data.items.filter(function(item) { return item.type == "martialCpt" });
        data.sejdrCpt = data.items.filter(function(item) { return item.type == "sejdrCpt" });
        data.galdrCpt = data.items.filter(function(item) { return item.type == "galdrCpt" });
        data.runeCpt = data.items.filter(function(item) { return item.type == "runeCpt" });
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
            html.find(".carac-roll").click(this._onCptRoll.bind(this));
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
        console.log(item);
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



    async _onFurorIntRoll(event, checked) {
        if (!checked) {
            let chatTemplate = "systems/yggdrasill/templates/partials/chat/character-basic-card.hbs";
            let carac = "spirit.intelect";

            let chatData = {
                user: game.user.id,
                speaker: { actor: this.actor },
            };


            let cardData = {
                ...this.data,
                owner: this.actor.id,
                actor: this.actor.data,
                carac: carac,
                config: CONFIG.yggdrasill
            }
            console.log(this.actor.data);

            chatData.roll = true;


            chatData.content = await renderTemplate(chatTemplate, cardData);
            ChatMessage.applyRollMode(chatData, "selfroll");
            return ChatMessage.create(chatData);
        }
    }

    async _onCptRoll(event) {
        let chatTemplate = "systems/yggdrasill/templates/partials/chat/character-basic-card.hbs";
        let carac = event.currentTarget.dataset.carac;

        let chatData = {
            user: game.user.id,
            speaker: { actor: this.actor },
        };


        let cardData = {
            ...this.data,
            owner: this.actor.id,
            actor: this.actor.data,
            carac: carac,
            config: CONFIG.yggdrasill
        }
        console.log(this.actor.data);

        chatData.roll = true;


        chatData.content = await renderTemplate(chatTemplate, cardData);
        ChatMessage.applyRollMode(chatData, "selfroll");
        return ChatMessage.create(chatData);
    }

    _onTaskCheck(event) {
        let isCpt = false;
        let isConflict = false;
        let isOffensive = false;
        let item = {};
        try {
            item = this.actor.items.get(event.currentTarget.dataset.itemId).data;
        } catch (e) {
            item = null
        }
        try {
            isCpt = event.currentTarget.dataset.competence;
            console.log(isCpt);
        } catch (e) {}
        try {
            isConflict = event.currentTarget.dataset.conflict;
            isOffensive = event.currentTarget.dataset.offensive;
            this.actor.data.data.physic.roll = event.currentTarget.dataset.physic;
            console.log(isConflict);
            console.log(isOffensive);
        } catch (e) {

        }

        Dice.TaskCheck({
            actionValue: event.currentTarget.dataset.actionValue,
            nbDiceKept: event.currentTarget.dataset.nbDiceKept,
            nbDiceFuror: event.currentTarget.dataset.nbDiceFuror,
            destinyDice: event.currentTarget.dataset.destinyDice,
            caracValue: event.currentTarget.dataset.caracValue,
            modifier: event.currentTarget.dataset.modifier,
            isCpt: isCpt,
            isConflict: isConflict,
            isOffensive: isOffensive,
            actor: this.actor.data,
            speaker: this.actor,
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