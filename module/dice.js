export async function TaskCheck({
    caracValue = 0,
    nbDiceKept = 0,
    actionValue = 0,
    nbDiceFuror = 0,
    destinyDice = 0,
    modifier = 0,
    actor = null,
    item = null
} = {}) {
    console.log("Yggdrasill || caracValue " + caracValue);
    console.log("Yggdrasill || nbDiceKept " + nbDiceKept);
    console.log("Yggdrasill || actionValue " + actionValue);
    console.log("Yggdrasill || nbDiceFuror " + nbDiceFuror);
    console.log("Yggdrasill || destinyDice " + destinyDice);
    console.log("Yggdrasill || modifier " + modifier);
    console.log("Yggdrasill || actor :");
    console.log(actor);
    let rollFormula = "(@caracValue)d10kh(@nbDiceKept)x10";
    if (actionValue != 0) rollFormula += " + @actionValue";
    if (modifier != 0) rollFormula += " + @modifier";
    if (destinyDice != 0) rollFormula += " + (@destinyDice)d10";
    if (nbDiceFuror != 0) rollFormula += " + (@nbDiceFuror)d10";

    let rollData = {
        actionValue: actionValue,
        nbDiceKept: nbDiceKept,
        nbDiceFuror: nbDiceFuror,
        destinyDice: destinyDice,
        caracValue: caracValue,
        modifier: modifier,
    };

    if (actor.data.isInitiated && (item.type == "sejdrCpt" || item.type == "galdrCpt" || item.type == "runeCpt")) {
        actor.data.nbDiceFuror.max = actor.data.primCarac.spirit.tenacity;
        actor.data.nbDiceFuror.min = 1;
        actor.data.secCarac.dp.magic = 0;
        actor.data.secCarac.dm.magic = 0;
        if (actor.data.nbDiceFuror.value > 0) {
            actor.data.secCarac.dp.magic = -3;
            actor.data.secCarac.dm.magic = -3;
        }
    }

    if (actor.data.isBerserk && actor.data.nbDiceFuror.value > 0) {
        if (!(actor.data.isInFuror)) actor.data.primCarac.perception.mod += -3;
        if (element.dataset.type == "defensive") rollData.nbDiceKept = 1;
        actor.data.isInFuror = true;
    }
    if (actor.data.isInFuror && actor.data.nbDiceFuror.value > actor.data.nbDiceFuror.min) actor.data.nbDiceFuror.minMax = actor.data.nbDiceFuror.value;

    let messageData = {
        speaker: ChatMessage.getSpeaker(),
    };
    // if (item.type == "arme") {
    //     let chatTemplate = "systems/yggdrasill/templates/partials/chat/character-damage-card.hbs";
    //     console.log(item);
    //     console.log(actor);



    //     let rollResult = new Roll(rollFormula, rollData).roll()

    //     let renderedRoll = await rollResult.render({ template: chatTemplate });

    //     console.log(renderedRoll)
    //     let chatData = {
    //         user: game.user.id,
    //         speaker: ChatMessage.getSpeaker(),
    //         content: renderedRoll,
    //         item: item,
    //         owner: actor.id,
    //         actor: actor,
    //         config: CONFIG.yggdrasill

    //     }
    //     rollResult.toMessage(chatData);


    // } else {
    new Roll(rollFormula, rollData).roll().toMessage(messageData);
    actor.data = resetingValues(actor.data);
    // }
}

function resetingValues(data) {
    data.nbDiceFuror.value = 0;
    data.caracUsed.name = "";
    data.caracUsed.value = 0;
    data.isDestinyRoll = false;

    return data;
}