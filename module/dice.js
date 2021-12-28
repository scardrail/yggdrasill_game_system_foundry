export async function TaskCheck({
    taskType = null,
    askForOptions = false,
    caracValue = 0,
    caracName = null,
    nbDiceKept = 0,
    actionValue = 0,
    nbDiceFuror = 0,
    destinyDice = 0,
    isDestinyRoll = false,
    modifier = 0,
    isCpt = false,
    isWeapon = false,
    isConflict = false,
    isOffensive = false,
    attackType = null,
    actor = null,
    actorType = null,
    speaker = null,
    item = null,
    itemType = null
} = {}) {
    if (askForOptions && actorType != "extra" && actorType != "creature") {
        let checkOptions = await GetTaskCheckOptions(taskType, caracName, actor, item);
        if (checkOptions.cancelled) {
            return;
        }
        nbDiceFuror = checkOptions.nbDiceFuror;
        isDestinyRoll = checkOptions.isDestinyRoll;
        modifier += checkOptions.modifier;
        if (checkOptions.caracUsed) {
            let caracUsed = getCaracDatasFromItem(checkOptions.caracUsed, actor);
            caracValue = caracUsed.caracValue;
            caracName = caracUsed.caracName;
            modifier += caracUsed.modifier;
        }
        if (isWeapon) {
            switch (checkOptions.cptUsed) {
                case 'devastating':
                case 'iStoppage':
                case 'pStoppage':
                    actor.data.dmgMod = (caracValue * 3);
                    modifier += -caracValue;
                    break;
                case 'force':
                case 'iImpact':
                case 'pImpact':
                    actor.data.dmgMod = caracValue;
                    break;
                case 'precise':
                    actor.data.enemyArmorMod = -caracValue;
                    break;
                case 'aimed':
                    actor.data.enemyArmorMod = -(caracValue * 3);
                    actor.data.dmgMod = (caracValue * 3)
                    modifier += -caracValue;
                    break;
                case 'parade':
                    actor.data.caracUsed.isDefensive = true;
                    break;
                default:
                    console.log(`Sorry, we are out of ${checkOptions.cptUsed}.`);
            }
        }

    }
    console.log("Yggdrasill || taskType " + taskType);
    console.log("Yggdrasill || caracValue " + caracValue);
    console.log("Yggdrasill || caracName " + caracName);
    console.log("Yggdrasill || nbDiceKept " + nbDiceKept);
    console.log("Yggdrasill || actionValue " + actionValue);
    console.log("Yggdrasill || nbDiceFuror " + nbDiceFuror);
    console.log("Yggdrasill || destinyDice " + destinyDice);
    console.log("Yggdrasill || modifier " + modifier);
    console.log("Yggdrasill || isCpt " + isCpt);
    console.log("Yggdrasill || isWeapon " + isWeapon);
    console.log("Yggdrasill || isConflict " + isConflict);
    console.log("Yggdrasill || isOffensive " + isOffensive);
    console.log("Yggdrasill || attackType " + attackType);
    console.log("Yggdrasill || actor :");
    console.log(actor);
    console.log("Yggdrasill || item :");
    console.log(item);


    let rollFormula = caracValue + "d10kh" + nbDiceKept + "x10";
    let detailFormula = caracName + " " + game.i18n.localize("yggdrasill.chat.rollFormula.roll");
    let isBlind = false;
    if (actor.type == "extra" || actor.type == "creature") {
        rollFormula = caracValue + "d10";
        detailFormula = "carac roll";
        isBlind = true;
    }

    if (actionValue != 0) {
        rollFormula += " + " + actionValue;
        detailFormula += " / " + game.i18n.localize("yggdrasill.chat.rollFormula.cpt");
    }
    if (modifier != 0) {
        rollFormula += " + " + modifier;
        detailFormula += " / " + game.i18n.localize("yggdrasill.chat.rollFormula.mod");
    }
    if (nbDiceFuror != 0) {
        rollFormula += " + " + nbDiceFuror + "d10";
        detailFormula += " / " + game.i18n.localize("yggdrasill.chat.rollFormula.furor");
    }
    if (isDestinyRoll) {
        rollFormula += " + 1d10";
        detailFormula += " / " + game.i18n.localize("yggdrasill.chat.rollFormula.destiny");
    }
    console.log(rollFormula);
    console.log(detailFormula);

    let rollData = {
        actionValue: actionValue,
        nbDiceKept: nbDiceKept,
        nbDiceFuror: nbDiceFuror,
        destinyDice: destinyDice,
        caracValue: caracValue,
        modifier: modifier
    };

    if (item == null) item = {
        type: ""
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
        if (!(actor.data.isInFuror)) actor.data.primCarac.spirit.perception.mod += -3;
        if (attackType == "defensive") rollData.nbDiceKept = 1;
        actor.data.isInFuror = true;
    }
    if (actor.data.isInFuror && actor.data.nbDiceFuror.value > actor.data.nbDiceFuror.min) actor.data.nbDiceFuror.minMax = actor.data.nbDiceFuror.value;

    if (item.type == "arme" && !(actor.data.caracUsed.isDefensive)) {
        let chatTemplate = "systems/yggdrasill/templates/partials/chat/character-damage-card.hbs";
        // console.log(item);
        console.log("weapon roll");
        // console.log(actor);

        let chatOptions = {};

        chatOptions = foundry.utils.mergeObject({
            user: game.user.id,
            flavor: null,
            template: chatTemplate,
            blind: isBlind
        }, chatOptions);
        const isPrivate = false;

        let rollResult = await new Roll(rollFormula, rollData).roll({
            async: true
        })

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

        // console.log(rollResult)


        // Define chat data
        let chatData = {
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            rollMode: game.settings.get("core", "rollMode"),
            formula: isPrivate ? "???" : rollResult._formula,
            flavor: isPrivate ? null : chatOptions.flavor,
            user: chatOptions.user,
            speaker: {
                actor: speaker
            },
            tooltip: isPrivate ? "" : await rollResult.getTooltip(),
            total: isPrivate ? "?" : Math.round(rollResult._total * 100) / 100,
            item: item,
            owner: actor.id,
            actor: actor,
            config: CONFIG.yggdrasill,
            sound: CONFIG.sounds.dice
        };
        chatData.roll = rollResult;

        // Render the roll display template
        chatData.content = await renderTemplate(chatOptions.template, cardData);

        actor.data = resetingValues(actor.data);
        let myMessage = ChatMessage.create(chatData);
        return myMessage;


    } else {
        console.log("Yggdrasill ||" + item.type);
        // console.log(item);
        // console.log(actor);
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
        // console.log(item);
        // console.log(actor);

        let chatOptions = {};

        chatOptions = foundry.utils.mergeObject({
            user: game.user.id,
            flavor: null,
            template: chatTemplate,
            blind: isBlind
        }, chatOptions);
        const isPrivate = false;

        let rollResult = await new Roll(rollFormula, rollData).roll({
            async: true
        })

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
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            rollMode: game.settings.get("core", "rollMode"),
            formula: isPrivate ? "???" : rollResult._formula,
            flavor: isPrivate ? null : chatOptions.flavor,
            user: chatOptions.user,
            speaker: {
                actor: speaker
            },
            tooltip: isPrivate ? "" : await rollResult.getTooltip(),
            total: isPrivate ? "?" : Math.round(rollResult._total * 100) / 100,
            criticalFailures: criticalFailures,
            item: item,
            owner: actor.id,
            actor: actor,
            config: CONFIG.yggdrasill,
            sound: CONFIG.sounds.dice
        };

        console.log(actor);
        chatData.roll = rollResult;


        cardData.criticalFailures = criticalFailures;
        // Render the roll display template
        chatData.content = await renderTemplate(chatOptions.template, cardData);


        actor.data = resetingValues(actor.data, actor.type);
        let message = ChatMessage.create(chatData);
        console.log(ChatMessage.getSpeaker())

        if (criticalFailures) await rollCriticalFail();
        return message;
    }

}


async function GetTaskCheckOptions(taskType, caracName, actor, item) {
    const templates = {
        "carac": "systems/yggdrasill/templates/partials/dialog/primCarac-check-dialog.hbs",
        "competence": "systems/yggdrasill/templates/partials/dialog/cpt-check-dialog.hbs",
        "arme": "systems/yggdrasill/templates/partials/dialog/weapon-check-dialog.hbs",
    };

    let html;
    let name;
    if (taskType == "carac") {
        html = await renderTemplate(templates[taskType], {
            actor: actor
        });
        name = game.i18n.localize(CONFIG.yggdrasill.carac[caracName]);
    } else if (taskType == "competence" || taskType == "arme") {
        html = await renderTemplate(templates[taskType], {
            actor: actor,
            item: item,
            config: CONFIG.yggdrasill
        });
        name = game.i18n.localize(item.name);
    }

    return new Promise(resolve => {
        const data = {
            title: game.i18n.format(name, {
                type: taskType
            }),
            content: html,
            buttons: {
                normal: {
                    label: game.i18n.localize("yggdrasill.chat.actions.roll"),
                    callback: html => resolve(
                        _processTaskCheckOptions(html, taskType, item)
                    )
                },
                cancel: {
                    label: game.i18n.localize("yggdrasill.chat.actions.cancel"),
                    callback: html => resolve({
                        cancelled: true
                    })
                }
            },
            default: "normal",
            close: () => resolve({
                cancelled: true
            })
        }
        new Dialog(data, null).render(true);
    });
}

function _processTaskCheckOptions(html, taskType, item) {

    let form = html[0].querySelector('form');
    console.log(form);


    switch (taskType) {
        case "carac":
            return {
                nbDiceFuror: parseInt(form.nbRollDiceFuror.value),
                isDestinyRoll: form.isDestinyRoll.checked,
                modifier: parseInt(form.ModificatorRollValue.value)
            }
        case "competence":
            return {
                nbDiceFuror: parseInt(form.nbRollDiceFuror.value),
                isDestinyRoll: form.isDestinyRoll.checked,
                modifier: parseInt(form.ModificatorRollValue.value),
                caracUsed: form.caracUsed.value
            }
        case "arme":

            let cptUsed = form.caracUsed.value;
            let carac = null;
            if (!item.data.properties.ranged) {
                carac = CONFIG.yggdrasill.meleeCoresp[cptUsed];
            } else {
                carac = CONFIG.yggdrasill.rangedCoresp[cptUsed];
            }
            return {
                nbDiceFuror: parseInt(form.nbRollDiceFuror.value),
                isDestinyRoll: form.isDestinyRoll.checked,
                modifier: parseInt(form.ModificatorRollValue.value),
                caracUsed: carac,
                cptUsed: cptUsed
            }
        default:
            break;
    }
}

function getCaracDatasFromItem(caracName, actor) {
    let caracDatas = {
        caracName: null,
        caracValue: 0,
        modifier: 0
    };
    caracDatas.caracName = caracName;
    if (caracName == "power" || caracName == "vigour" || caracName == "agility") {
        caracDatas.caracValue = actor.data.primCarac.body[caracName].value;
        caracDatas.modifier = actor.data.primCarac.body[caracName].mod;
    } else if (caracName == "intelect" || caracName == "perception" || caracName == "tenacity") {
        caracDatas.caracValue = actor.data.primCarac.spirit[caracName].value;
        caracDatas.modifier = actor.data.primCarac.spirit[caracName].mod;
    } else {
        caracDatas.caracValue = actor.data.primCarac.soul[caracName].value;
        caracDatas.modifier = actor.data.primCarac.soul[caracName].mod;
    }
    return caracDatas;
}

async function rollCriticalFail() {
    let table = game.tables.filter(function(table) {
        return table._id == "UnAwWsx5UK6Y6rVJ"
    });
    table = table[0];
    const defaultResults = await table.roll();
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
        data.caracUsed.value = 0;
        data.caracUsed.rollModifier = 0;
        data.isDestinyRoll = false;
        data.caracUsed.isDefensive = false;
        data.magicCpt.sejdrCpt.positiveness = "none";
        data.magicCpt.runeCpt.positiveness = "none";
    } else {
        data.dmgMod = 0;
    }

    return data;
}