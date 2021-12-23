import * as calculStats from "./calculStats.js"
export default class yggdrasillItem extends Item {
    chatTemplate = {
        "arme": "systems/yggdrasill/templates/partials/chat/character-weapon-card.hbs",
        "protection": "systems/yggdrasill/templates/partials/chat/character-armor-card.hbs",
        "object": "systems/yggdrasill/templates/partials/chat/character-object-card.hbs",
        "competence": "systems/yggdrasill/templates/partials/chat/character-competence-card.hbs",
        "martialCpt": "systems/yggdrasill/templates/partials/chat/character-martialCpt-card.hbs",
        "sejdrCpt": "systems/yggdrasill/templates/partials/chat/character-magicCpt-card.hbs",
        "galdrCpt": "systems/yggdrasill/templates/partials/chat/character-magicCpt-card.hbs",
        "runeCpt": "systems/yggdrasill/templates/partials/chat/character-magicCpt-card.hbs",
        "temper": "systems/yggdrasill/templates/partials/chat/character-temper-card.hbs"
    };

    prepareData() {
        super.prepareData();

        let itemData = this.data;
        let data = itemData.data;
        if (itemData.type == "arme") {
            if (data.subType == "wThrow" || data.subType == "wShot") {
                data.properties.ranged = true;
            } else {
                data.properties.ranged = false;
            }
        }
    }
    async roll() {

        let chatData = {
            user: game.user.id,
            speaker: { actor: this.actor },
        };

        let cardData = {
            ...this.data,
            owner: this.actor.id,
            actor: this.actor.data,
            config: CONFIG.yggdrasill
        }
        console.log("roll data card");
        console.log(this.actor.data);

        chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);

        chatData.roll = true;
        ChatMessage.applyRollMode(chatData, "selfroll");
        return ChatMessage.create(chatData);
    }
}