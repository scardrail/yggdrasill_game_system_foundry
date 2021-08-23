export async function TaskCheck({
    caracValue = 0,
    nbDiceKept = 0,
    actionValue = 0,
    nbDiceFuror = 0,
    destinyDice = 0,
    modifier = 0,
    isCpt = false,
    isConflict = false,
    isOffensive = false,
    attackType = null,
    actor = null,
    item = null
} = {}) {
    console.log("Yggdrasill || caracValue " + caracValue);
    console.log("Yggdrasill || nbDiceKept " + nbDiceKept);
    console.log("Yggdrasill || actionValue " + actionValue);
    console.log("Yggdrasill || nbDiceFuror " + nbDiceFuror);
    console.log("Yggdrasill || destinyDice " + destinyDice);
    console.log("Yggdrasill || modifier " + modifier);
    console.log("Yggdrasill || isCpt " + isCpt);
    console.log("Yggdrasill || isConflict " + isConflict);
    console.log("Yggdrasill || isOffensive " + isOffensive);
    console.log("Yggdrasill || attackType " + attackType);
    console.log("Yggdrasill || actor :");
    console.log(actor);

    let rollFormula = "(@caracValue)d10kh(@nbDiceKept)x10";
    let isBlind = false;
    if (actor.type == "extra" || actor.type == "creature") {
        rollFormula = "(@caracValue)d10";
        isBlind = true;
    }

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

    if (item == null) item = { type: "" };

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
        if (!(actor.data.isInFuror)) actor.data.primCarac.spirit.perception.mod += -3;
        if (attackType == "defensive") rollData.nbDiceKept = 1;
        actor.data.isInFuror = true;
    }
    if (actor.data.isInFuror && actor.data.nbDiceFuror.value > actor.data.nbDiceFuror.min) actor.data.nbDiceFuror.minMax = actor.data.nbDiceFuror.value;

    let messageData = {
        speaker: ChatMessage.getSpeaker()
    };
    if (item.type == "arme" && !(actor.data.caracUsed.isDefensive)) {
        let chatTemplate = "systems/yggdrasill/templates/partials/chat/character-damage-card.hbs";
        console.log(item);
        console.log(actor);

        let chatOptions = {};

        chatOptions = foundry.utils.mergeObject({
            user: game.user.id,
            flavor: null,
            template: chatTemplate,
            blind: isBlind
        }, chatOptions);
        const isPrivate = false;

        let rollResult = new Roll(rollFormula, rollData).roll()

        // Execute the roll, if needed
        if (!rollResult._evaluated) rollResult.evaluate();

        let cardData = {
            formula: isPrivate ? "???" : rollResult._formula,
            flavor: isPrivate ? null : chatOptions.flavor,
            user: chatOptions.user,
            tooltip: isPrivate ? "" : await rollResult.getTooltip(),
            total: isPrivate ? "?" : Math.round(rollResult._total * 100) / 100,
            item: item,
            owner: actor.id,
            actor: actor,
            config: CONFIG.yggdrasill
        }

        console.log(rollResult)

        // Define chat data
        const chatData = {
            formula: isPrivate ? "???" : rollResult._formula,
            flavor: isPrivate ? null : chatOptions.flavor,
            user: chatOptions.user,
            tooltip: isPrivate ? "" : await rollResult.getTooltip(),
            total: isPrivate ? "?" : Math.round(rollResult._total * 100) / 100,
            item: item,
            owner: actor.id,
            actor: actor,
            config: CONFIG.yggdrasill,
            sound: CONFIG.sounds.dice
        };
        chatData.roll = true;

        // Render the roll display template
        chatData.content = await renderTemplate(chatOptions.template, cardData);

        actor.data = resetingValues(actor.data);
        return ChatMessage.create(chatData);


    } else {
        console.log("Yggdrasill ||" + item.type);
        console.log(item);
        console.log(actor);
        let chatTemplate = ""
        if (item.type == "sejdrCpt") {
            chatTemplate = "systems/yggdrasill/templates/partials/chat/character-sejdrCpt-card.hbs";
        } else if (item.type == "galdrCpt") {
            chatTemplate = "systems/yggdrasill/templates/partials/chat/character-galdrCpt-card.hbs";
        } else if (item.type == "runeCpt") {
            chatTemplate = "systems/yggdrasill/templates/partials/chat/character-runeCpt-card.hbs";
        } else if (isConflict == "true") {
            chatTemplate = "systems/yggdrasill/templates/partials/chat/extra-conflict-card.hbs";
            if (isOffensive == "true") {
                console.log("Yggdrasill |[[1d10]]| isConflict " + isConflict);
                actor.data.dmgMod = "[[1d10]] + " + actor.data.physic.roll + " + MR";
            } else {
                console.log("Yggdrasill |0| isConflict " + isConflict);
                actor.data.dmgMod = 0;
            }
        } else {
            chatTemplate = "systems/yggdrasill/templates/partials/chat/rollCheck.hbs";
        }
        console.log(item);
        console.log(actor);

        let chatOptions = {};

        chatOptions = foundry.utils.mergeObject({
            user: game.user.id,
            flavor: null,
            template: chatTemplate,
            blind: isBlind
        }, chatOptions);
        const isPrivate = false;

        let rollResult = new Roll(rollFormula, rollData).roll()

        // Execute the roll, if needed
        if (!rollResult._evaluated) rollResult.evaluate();
        let cardData = {}
        if (item.type == "sejdrCpt") {
            let mr = Math.round(rollResult._total * 100) / 100 - 14;
            let durationValue = "";
            console.log("Yggdrasill || _total" + rollResult._total);
            console.log("Yggdrasill || mr" + mr);
            if (mr >= 0 && mr <= 5) {
                durationValue = "[[1d5]]" + game.i18n.localize("yggdrasill.sheet.duration.action");
            } else if (mr >= 6 && mr <= 10) {
                durationValue = "[[1d10]]" + game.i18n.localize("yggdrasill.sheet.duration.turn");

            } else if (mr >= 11 && mr <= 15) {
                durationValue = "[[1d10]]" + game.i18n.localize("yggdrasill.sheet.duration.minute");

            } else if (mr >= 16 && mr <= 25) {
                durationValue = "[[1d10]]" + game.i18n.localize("yggdrasill.sheet.duration.hour");

            } else if (mr >= 26) {
                durationValue = "[[1d5]]" + game.i18n.localize("yggdrasill.sheet.duration.day");

            } else {
                durationValue = game.i18n.localize("yggdrasill.sheet.failure");
            }
            item.data.durationValue = durationValue;
            cardData = {
                formula: isPrivate ? "???" : rollResult._formula,
                flavor: isPrivate ? null : chatOptions.flavor,
                user: chatOptions.user,
                tooltip: isPrivate ? "" : await rollResult.getTooltip(),
                total: isPrivate ? "?" : Math.round(rollResult._total * 100) / 100,
                mr: mr,
                item: item,
                owner: actor.id,
                actor: actor,
                config: CONFIG.yggdrasill
            }

        } else {
            cardData = {
                formula: isPrivate ? "???" : rollResult._formula,
                flavor: isPrivate ? null : chatOptions.flavor,
                user: chatOptions.user,
                tooltip: isPrivate ? "" : await rollResult.getTooltip(),
                total: isPrivate ? "?" : Math.round(rollResult._total * 100) / 100,
                item: item,
                owner: actor.id,
                actor: actor,
                config: CONFIG.yggdrasill
            }
        }

        console.log(rollResult);

        const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);


        let nbicesForFail = 0;
        let criticalFailures = false;
        let results = [];

        switch (rollResult.terms[0].number) {
            case 1:
                nbicesForFail = 1;
                break;

            case 2:
                nbicesForFail = 2;
                break;

            default:
                nbicesForFail = 3;
                break;
        }
        try {
            rollResult.terms[0].results.forEach(el => {
                results.push(el.result);
            });
            if (countOccurrences(results, 1) >= nbicesForFail) criticalFailures = true;
            results = [];
        } catch (error) {
            console.log(error);
        }
        console.log("Yggdrasill || is criticalFailures : " + criticalFailures);

        // Define chat data
        let chatData = {
            formula: isPrivate ? "???" : rollResult._formula,
            flavor: isPrivate ? null : chatOptions.flavor,
            user: chatOptions.user,
            tooltip: isPrivate ? "" : await rollResult.getTooltip(),
            total: isPrivate ? "?" : Math.round(rollResult._total * 100) / 100,
            criticalFailures: criticalFailures,
            item: item,
            owner: actor.id,
            actor: actor,
            config: CONFIG.yggdrasill,
            sound: CONFIG.sounds.dice
        };
        chatData.roll = true;


        cardData.criticalFailures = criticalFailures;
        // Render the roll display template
        chatData.content = await renderTemplate(chatOptions.template, cardData);

        actor.data = resetingValues(actor.data, actor.type);
        let message = ChatMessage.create(chatData);
        if (criticalFailures) await rollCriticalFail();
        return message;
    }

}

async function rollCriticalFail() {
    let table = game.tables.filter(function(table) { return table._id == "UnAwWsx5UK6Y6rVJ" });
    table = table[0];
    console.log(table);
    const defaultResults = await table.roll();
    console.log(defaultResults);
    let messageData = {
        roll: defaultResults.roll,
        speaker: ChatMessage.getSpeaker()
    };
    table.toMessage(defaultResults.results, messageData);
}

function resetingValues(data, type) {
    console.log("Yggdrasill || resetingValues");
    if (type == "pj" || type == "pnj") {
        data.nbDiceFuror.value = 0;
        data.caracUsed.name = "";
        data.caracUsed.value = 0;
        data.isDestinyRoll = false;
        data.caracUsed.isDefensive = false;
        data.magicCpt.sejdrCpt.positiveness = "none";
        data.magicCpt.runeCpt.positiveness = "none";
    } else {
        data.dmgMod = 0;
    }

    return data;
}