export default class yggdrasillItem extends Item {
    chatTemplate = {
        "arme": "systems/yggdrasill/templates/partials/chat/character-weapon-card.hbs",
        "protection": "systems/yggdrasill/templates/partials/chat/character-armor-card.hbs",
        "object": "systems/yggdrasill/templates/partials/chat/character-object-card.hbs",
        "competence": "systems/yggdrasill/templates/partials/chat/character-competence-card.hbs",
        "martialCpt": "systems/yggdrasill/templates/partials/chat/character-martialCpt-card.hbs",
        "sejdrCpt": "systems/yggdrasill/templates/partials/chat/character-sejdrCpt-card.hbs",
        "galdrCpt": "systems/yggdrasill/templates/partials/chat/character-galdrCpt-card.hbs",
        "runeCpt": "systems/yggdrasill/templates/partials/chat/character-runeCpt-card.hbs",
        "temper": "systems/yggdrasill/templates/partials/chat/character-temper-card.hbs"
    };

    async roll() {
        let chatData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker()
        };

        let cardData = {
            ...this.data,
            owner: this.actor.id
        }

        chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);

        chatData.roll = true;

        return ChatMessage.create(chatData);
    }
}