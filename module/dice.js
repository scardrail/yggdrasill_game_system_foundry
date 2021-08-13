export async function TaskCheck({
    actorData = null,
    actionValue = null,
    actionsMod = null,
    extra = false
} = {}) {
    const messageTemplate = "systems/yggdrasill/templates/partials/chat/extra-conflict-card.hbs"
    let baseDice = extra == "true" ? "2d10" : "";
    let rollFormula = `${baseDice} + @actionValue + @actionsMod`;
    let rollData = {
        ...actorData,
        actionValue: actionValue,
        actionsMod: actionsMod
    }
    let rollResult = new Roll(rollFormula, rollData).roll();
    let renderRoll = await rollResult.render({template: messageTemplate});

    console.log(actionsMod);
    let messageData = {
        speaker: ChatMessage.getSpeaker(),
        content: renderRoll
    }
    rollResult.toMessage(messageData);

}