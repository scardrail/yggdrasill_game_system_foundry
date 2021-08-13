export async function TaskCheck({
    caracValue = null,
    nbDiceKept = null,
    actionValue = null,
    nbDiceFuror = null,
    destinyDice = null,
    modifier = null,
    actor = null
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
        // actionValue: item.data.data.value,
        // nbDiceKept: actor.data.nbDiceKept,
        // nbDiceFuror: actor.data.nbDiceFuror.value,
        // destinyDice: 0,
        // caracValue: actor.data.primCarac.body.power.value,
        // modifier: actor.data.rollModifier + actor.data.primCarac.body.power.mod
        actionValue: actionValue,
        nbDiceKept: nbDiceKept,
        nbDiceFuror: nbDiceFuror,
        destinyDice: destinyDice,
        caracValue: caracValue,
        modifier: modifier,
    };

    if (actor.data.isInitiated && (item.type == "sejdrCpt" || item.type == "galdrCpt" || item.type == "runeCpt")) {
        actor.data.nbDiceFuror.minMax = actor.data.primCarac.spirit.tenacity;
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
    if (actor.data.isInFuror && actor.data.nbDiceFuror.value > actor.data.nbDiceFuror.minMax) actor.data.nbDiceFuror.minMax = actor.data.nbDiceFuror.value;

    let messageData = {
        speaker: ChatMessage.getSpeaker(),
    };
    new Roll(rollFormula, rollData).roll().toMessage(messageData);
    // let myroll = new Roll(rollFormula, rollData).roll().toMessage(messageData);
    // console.log(myroll);
    actor.data.nbDiceFuror.value = 0;

}