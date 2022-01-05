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
    isFuror = false,
    isCpt = false,
    isWeapon = false,
    isRune = false,
    isSejdr = false,
    isGaldr = false,
    isConflict = false,
    isOffensive = false,
    attackType = null,
    actor = null,
    actorType = null,
    speaker = null,
    item = null,
    magicPositiveness = null,
    galdrData = null,
    runeData = null,
    isDodge = null,
    sr = 0,
} = {}) {
    console.log(actor);
    try {
        console.log(item);
    } catch (e) {

    }
    if (askForOptions && actorType != "extra" && actorType != "creature") {
        let checkOptions = await GetTaskCheckOptions(taskType, caracName, actor, item, isDodge);
        if (checkOptions.cancelled) {
            return;
        }
        nbDiceFuror = checkOptions.nbDiceFuror;
        try {
            sr = checkOptions.sr;
        } catch (error) {
            console.log(error);
        }

        isDestinyRoll = checkOptions.isDestinyRoll;
        modifier += checkOptions.modifier;
        if (checkOptions.caracUsed) {
            let caracUsed = getCaracDatasFromItem(checkOptions.caracUsed, actor);
            caracValue = caracUsed.caracValue;
            caracName = caracUsed.caracName;
            modifier += caracUsed.modifier;
        }
        if (isWeapon) {

            let dualWeaponSettings = null;
            console.log(item);
            if (item.data.properties.dblWeapon) dualWeaponSettings = game.settings.get("yggdrasill", "DualWeaponsModificator");
            console.log(dualWeaponSettings);

            switch (checkOptions.cptUsed) {
                case 'devastating':
                case 'iStoppage':
                case 'pStoppage':
                    console.log("*3");
                    actor.data.dmgMod += (caracValue * 3);
                    modifier += -caracValue;
                    switch (dualWeaponSettings) {
                        case "attack":
                            modifier += (actor.data.primCarac.body.agility.value + actor.data.primCarac.body.agility.mod);
                            break;
                        case "defense":
                            modifier -= (actor.data.primCarac.body.agility.value + actor.data.primCarac.body.agility.mod);
                            break;
                        default:
                            break;
                    }
                    break;
                case 'force':
                case 'iImpact':
                case 'pImpact':
                    console.log("*1");
                    actor.data.dmgMod += caracValue;
                    switch (dualWeaponSettings) {
                        case "attack":
                            modifier += (actor.data.primCarac.body.agility.value + actor.data.primCarac.body.agility.mod);
                            break;
                        case "defense":
                            modifier -= (actor.data.primCarac.body.agility.value + actor.data.primCarac.body.agility.mod);
                            break;
                        default:
                            break;
                    }
                    break;
                case 'precise':
                    console.log("-1");
                    actor.data.enemyArmorMod = -caracValue;
                    switch (dualWeaponSettings) {
                        case "attack":
                            modifier += (actor.data.primCarac.body.agility.value + actor.data.primCarac.body.agility.mod);
                            break;
                        case "defense":
                            modifier -= (actor.data.primCarac.body.agility.value + actor.data.primCarac.body.agility.mod);
                            break;
                        default:
                            break;
                    }
                    break;
                case 'aimed':
                    console.log("-*3");
                    actor.data.enemyArmorMod = -(caracValue * 3);
                    actor.data.dmgMod += (caracValue * 3)
                    modifier += -caracValue;
                    switch (dualWeaponSettings) {
                        case "attack":
                            modifier += (actor.data.primCarac.body.agility.value + actor.data.primCarac.body.agility.mod);
                            break;
                        case "defense":
                            modifier -= (actor.data.primCarac.body.agility.value + actor.data.primCarac.body.agility.mod);
                            break;
                        default:
                            break;
                    }
                    break;
                case 'parade':
                    console.log("def");
                    actor.data.caracUsed.isDefensive = true;
                    switch (dualWeaponSettings) {
                        case "attack":
                            modifier -= (actor.data.primCarac.body.agility.value + actor.data.primCarac.body.agility.mod);
                            break;
                        case "defense":
                            modifier += (actor.data.primCarac.body.agility.value + actor.data.primCarac.body.agility.mod);
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    console.log("norm");
                    switch (dualWeaponSettings) {
                        case "attack":
                            modifier += (actor.data.primCarac.body.agility.value + actor.data.primCarac.body.agility.mod);
                            break;
                        case "defense":
                            modifier -= (actor.data.primCarac.body.agility.value + actor.data.primCarac.body.agility.mod);
                            break;
                        default:
                            break;
                    }
                    console.log(`Sorry, we are out of ${checkOptions.cptUsed}.`);
            }
            console.log(modifier);
        }
        if (isSejdr) {
            actor.data.caracUsed.isMagic = true;
            magicPositiveness = checkOptions.positiveness;
        } else if (isGaldr) {
            actor.data.caracUsed.isMagic = true;
            let galdrTargetSize = game.i18n.localize(checkOptions.targetPath + ".size");
            let galdrTargetValue = null;
            if (galdrTargetSize != checkOptions.targetPath + ".size")
                galdrTargetValue = galdrTargetSize + game.i18n.localize(checkOptions.targetPath + ".value")
            else
                galdrTargetValue = game.i18n.localize(checkOptions.targetPath + ".value")

            galdrData = {
                sd: checkOptions.sd,
                durationDice: game.i18n.localize(checkOptions.durationPath + ".dice"),
                durationUnit: game.i18n.localize(checkOptions.durationPath + ".unit"),
                targetValue: galdrTargetValue
            }
        } else if (isRune) {
            actor.data.caracUsed.isMagic = true;
            magicPositiveness = checkOptions.positiveness;
            let castDuration = (6 - actor.data.primCarac.body.agility.value) + " " + game.i18n.localize(checkOptions.supportPath + ".castDuration");
            let effectsDuration = actionValue + " " + game.i18n.localize(checkOptions.supportPath + ".effectsDuration");
            let support = game.i18n.localize(checkOptions.supportPath + ".value");
            runeData = {
                positiveness: magicPositiveness,
                sd: checkOptions.sd,
                power: checkOptions.power,
                castDuration: castDuration,
                effectsDuration: effectsDuration,
                support: support
            }
            console.log(runeData)
        }

        if (item) {
            if (item.type == "sejdrCpt" || (item.type == "arme" && !(actor.data.caracUsed.isDefensive))) {
                console.log("is sejdrCpt or is arme and not is Defensive");
                sr = 3;
            }
        }
        if (actor.data.secCarac.spaceReq.status == "crowded") {
            console.log("is crowded");
            sr += 1;
        } else if (actor.data.secCarac.spaceReq.status == "overloaded") {
            console.log("is overloaded");
            sr += 2;
        }
        if (actor.data.isInFuror && caracName == "perception") {
            console.log("is In Furor and perception");
            sr += 1;
        };

        game.actors.get(actor._id).update({
            'data.nbDiceFuror.value': nbDiceFuror
        })
        if (sr) actor.data.sr.value = sr;

    }

    if (caracValue == 1 && actorType != "extra" && actorType != "creature") {
        nbDiceKept += -1;
    }
    try {
        if (item.name == "Esquive" || actor.data.caracUsed.isDefensive) {
            attackType = "defensive";
        }
        if (attackType == "defensive" && actor.data.isInFuror) {
            nbDiceKept = 1;
        }
    } catch (error) {

    }
    console.log("Yggdrasill || taskType " + taskType);
    console.log("Yggdrasill || caracValue " + caracValue);
    console.log("Yggdrasill || caracName " + caracName);
    console.log("Yggdrasill || nbDiceKept " + nbDiceKept);
    console.log("Yggdrasill || actionValue " + actionValue);
    console.log("Yggdrasill || nbDiceFuror " + nbDiceFuror);
    console.log("Yggdrasill || destinyDice " + destinyDice);
    console.log("Yggdrasill || modifier " + modifier);
    console.log("Yggdrasill || isDodge " + isDodge);
    console.log("Yggdrasill || isConflict " + isConflict);
    console.log("Yggdrasill || isOffensive " + isOffensive);
    console.log("Yggdrasill || attackType " + attackType);
    console.log("Yggdrasill || isInFuror " + actor.data.isInFuror);
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
        actor.data.nbDiceFuror.max = actor.data.primCarac.soul.instinct;
        actor.data.nbDiceFuror.min = 1;
        actor.data.secCarac.dp.magic = 0;
        actor.data.secCarac.dm.magic = 0;
        if (actor.data.nbDiceFuror.value > 0) {
            actor.data.secCarac.dp.magic = -3;
            actor.data.secCarac.dm.magic = -3;
        }
    }

    if (actor.data.isBerserk && actor.data.nbDiceFuror.value > 0) {
        // if (actor.data.isInFuror && caracName == "perception") actor.data.sr.value += 1;
        if (attackType == "defensive" && actor.data.isInFuror) rollData.nbDiceKept = 1;
        actor.data.isInFuror = true;
    }
    let chatTemplate = null;
    let chatData = null;
    let cardData = null;
    let chatOptions = {};
    let rollResult = null;
    let criticalFailures = false;

    if (item.type == "arme" && !(actor.data.caracUsed.isDefensive)) {
        // actor.data.sr.value = 3;
        chatTemplate = "systems/yggdrasill/templates/partials/chat/character-damage-card.hbs";
        console.log("weapon roll");
        chatOptions = {};

        chatOptions = foundry.utils.mergeObject({
            user: game.user.id,
            flavor: null,
            template: chatTemplate,
            blind: isBlind
        }, chatOptions);
        const isPrivate = false;

        rollResult = await new Roll(rollFormula, rollData).roll({
            async: true
        })

        // Execute the roll, if needed
        if (!rollResult._evaluated) rollResult.evaluate();

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

        criticalFailures = getifIsCriticalFailures(rollResult);
        // Define chat data
        chatData = {
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            rollMode: game.settings.get("core", "rollMode"),
            formula: isPrivate ? "???" : rollResult._formula,
            flavor: isPrivate ? null : chatOptions.flavor,
            user: chatOptions.user,
            speaker: {
                actor: speaker
            },
            criticalFailures: criticalFailures,
            tooltip: isPrivate ? "" : await rollResult.getTooltip(),
            total: isPrivate ? "?" : Math.round(rollResult._total * 100) / 100,
            item: item,
            owner: actor.id,
            actor: actor,
            config: CONFIG.yggdrasill,
            sound: CONFIG.sounds.dice
        };
    } else {
        console.log("Yggdrasill ||" + item.type);
        if (item.type == "sejdrCpt") {
            chatTemplate = "systems/yggdrasill/templates/partials/chat/character-sejdrCpt-card.hbs";
        } else if (item.type == "galdrCpt") {
            chatTemplate = "systems/yggdrasill/templates/partials/chat/character-galdrCpt-card.hbs";
        } else if (item.type == "runeCpt") {
            chatTemplate = "systems/yggdrasill/templates/partials/chat/character-runeCpt-card.hbs";
        } else if (isConflict == "true") {
            if (isOffensive == "true") {
                chatTemplate = "systems/yggdrasill/templates/partials/chat/extra-conflict-card.hbs";
                actor.data.dmgMod = "[[1d10]] + " + actor.data.physic.roll + " + MR";
                caracName = "attack";
            } else {
                chatTemplate = "systems/yggdrasill/templates/partials/chat/character-basic-card.hbs";
                // console.log("Yggdrasill |0| isConflict " + isConflict);
                actor.data.dmgMod = 0;
                caracName = "defense";
            }
        } else if (item.type == "competence") {
            chatTemplate = "systems/yggdrasill/templates/partials/chat/character-competence-card.hbs";
        } else if (isFuror) {
            chatTemplate = "systems/yggdrasill/templates/partials/chat/character-furor-card.hbs";
        } else {
            chatTemplate = "systems/yggdrasill/templates/partials/chat/character-basic-card.hbs";
        }

        chatOptions = foundry.utils.mergeObject({
            user: game.user.id,
            flavor: null,
            template: chatTemplate,
            blind: isBlind
        }, chatOptions);
        const isPrivate = false;

        rollResult = await new Roll(rollFormula, rollData).roll({
            async: true
        })

        // Execute the roll, if needed
        if (!rollResult._evaluated) rollResult.evaluate();
        if (item.type == "sejdrCpt") {
            let mr = Math.round(rollResult._total * 100) / 100 - 14;
            let durationValue = "";
            let failure = false;
            console.log("Yggdrasill || _total" + rollResult._total);
            console.log("Yggdrasill || mr" + mr);
            if (mr >= 0 && mr <= 5) {
                durationValue = "[[1d5]]" + game.i18n.localize("yggdrasill.magicCpt.duration.action");
            } else if (mr >= 6 && mr <= 10) {
                durationValue = "[[1d10]]" + game.i18n.localize("yggdrasill.magicCpt.duration.turn");

            } else if (mr >= 11 && mr <= 15) {
                durationValue = "[[1d10]]" + game.i18n.localize("yggdrasill.magicCpt.duration.minute");

            } else if (mr >= 16 && mr <= 25) {
                durationValue = "[[1d10]]" + game.i18n.localize("yggdrasill.magicCpt.duration.hour");

            } else if (mr >= 26) {
                durationValue = "[[1d5]]" + game.i18n.localize("yggdrasill.magicCpt.duration.day");

            } else {
                durationValue = game.i18n.localize("yggdrasill.sheet.failure");
                failure = true;

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
                positiveness: magicPositiveness,
                failure: failure,
                owner: actor.id,
                actor: actor,
                config: CONFIG.yggdrasill
            }

        } else if (item.type == "galdrCpt") {
            cardData = {
                formula: isPrivate ? "???" : rollResult._formula,
                flavor: isPrivate ? null : chatOptions.flavor,
                user: chatOptions.user,
                tooltip: isPrivate ? "" : await rollResult.getTooltip(),
                total: isPrivate ? "?" : Math.round(rollResult._total * 100) / 100,
                item: item,
                galdrData: galdrData,
                owner: actor.id,
                actor: actor,
                config: CONFIG.yggdrasill
            }
        } else if (item.type == "runeCpt") {
            cardData = {
                formula: isPrivate ? "???" : rollResult._formula,
                flavor: isPrivate ? null : chatOptions.flavor,
                user: chatOptions.user,
                tooltip: isPrivate ? "" : await rollResult.getTooltip(),
                total: isPrivate ? "?" : Math.round(rollResult._total * 100) / 100,
                item: item,
                runeData: runeData,
                owner: actor.id,
                actor: actor,
                config: CONFIG.yggdrasill
            }

        } else if (isFuror) {
            let total = isPrivate ? "?" : Math.round(rollResult._total * 100) / 100;
            let attacker = game.actors.get(actor._id);
            let sr = 0;
            let success = false;
            console.log(attacker);
            console.log(total);
            if (actor.data.isInFuror) {
                sr = actor.data.reserve.outSR;
                if (total >= sr) {
                    try {
                        success = true;
                        attacker.update({
                            'data.isInFuror': false
                        })
                    } catch (error) {
                        console.log(error);

                    }
                }
                sr = actor.data.reserve.outSR;
            } else {
                sr = actor.data.sr.level[actor.data.sr.value].value;
                if (total < sr) {
                    try {
                        success = true;
                        attacker.update({
                            'data.isInFuror': true
                        })
                    } catch (error) {
                        console.log(error);

                    }
                }
                sr = actor.data.sr.level[actor.data.sr.value].value;
            }
            console.log(sr);
            console.log(actor);
            cardData = {
                formula: isPrivate ? "???" : rollResult._formula,
                flavor: isPrivate ? null : chatOptions.flavor,
                user: chatOptions.user,
                tooltip: isPrivate ? "" : await rollResult.getTooltip(),
                total: total,
                sr: sr,
                success: success,
                caracName: game.i18n.localize("yggdrasill.character.reserve"),
                owner: actor.id,
                actor: actor,
                config: CONFIG.yggdrasill
            }
        } else {
            let caracNameSent = null;
            if (actor.type == "extra" || actor.type == "creature") caracNameSent = game.i18n.localize(CONFIG.yggdrasill.extraCarac[caracName])
            else caracNameSent = game.i18n.localize(CONFIG.yggdrasill.carac[caracName])
            cardData = {
                formula: isPrivate ? "???" : rollResult._formula,
                flavor: isPrivate ? null : chatOptions.flavor,
                user: chatOptions.user,
                tooltip: isPrivate ? "" : await rollResult.getTooltip(),
                total: isPrivate ? "?" : Math.round(rollResult._total * 100) / 100,
                item: item,
                caracName: caracNameSent,
                owner: actor.id,
                actor: actor,
                config: CONFIG.yggdrasill
            }
        }

        console.log(rollResult);
        criticalFailures = getifIsCriticalFailures(rollResult);

        // Define chat data
        chatData = {
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
    }
    console.log(actor);
    chatData.roll = rollResult;


    cardData.criticalFailures = criticalFailures;
    // Render the roll display template
    chatData.content = await renderTemplate(chatOptions.template, cardData);
    actor.data = resetingValues(actor.data, actor.type, actor._id, nbDiceFuror);
    console.log(actor);
    let message = ChatMessage.create(chatData);
    // console.log(ChatMessage.getSpeaker())

    if (criticalFailures && item.type == "arme" && !(actor.data.caracUsed.isDefensive)) await rollCriticalFail();
    return message;

}

function getifIsCriticalFailures(rollResult) {
    let criticalFailures = false;
    let nbicesForFail = 0;
    let results = [];

    const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

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
    return criticalFailures;

}


async function GetTaskCheckOptions(taskType, caracName, actor, item, isDodge) {
    const templates = {
        "carac": "systems/yggdrasill/templates/partials/dialog/primCarac-check-dialog.hbs",
        "seccarac": "systems/yggdrasill/templates/partials/dialog/secCarac-check-dialog.hbs",
        "competence": "systems/yggdrasill/templates/partials/dialog/cpt-check-dialog.hbs",
        "arme": "systems/yggdrasill/templates/partials/dialog/weapon-check-dialog.hbs",
        "sejdrCpt": "systems/yggdrasill/templates/partials/dialog/sejdr-check-dialog.hbs",
        "galdrCpt": "systems/yggdrasill/templates/partials/dialog/galdr-check-dialog.hbs",
        "runeCpt": "systems/yggdrasill/templates/partials/dialog/rune-check-dialog.hbs",
        "furor": "systems/yggdrasill/templates/partials/dialog/furor-check-dialog.hbs"
    };
    let isDodging = false;
    if (isDodge) isDodging = true;
    let html;
    let name;
    if (taskType == "carac" || taskType == "seccarac") {
        html = await renderTemplate(templates[taskType], {
            actor: actor,
            config: CONFIG.yggdrasill,
            isDodging: isDodging
        });
        if (taskType == "carac") {
            name = game.i18n.localize(CONFIG.yggdrasill.carac[caracName]);
        } else {
            name = game.i18n.localize("yggdrasill.characteristics.secondary.dm");
        }
    } else if (taskType == "furor") {
        html = await renderTemplate(templates[taskType], {
            actor: actor,
            config: CONFIG.yggdrasill,
            status: game.i18n.localize(CONFIG.yggdrasill.importantCharacStatus[actor.data.lifePoints.status])
        });
        name = game.i18n.localize("yggdrasill.character.reserve");
    } else {
        html = await renderTemplate(templates[taskType], {
            actor: actor,
            item: item,
            isDodging: isDodging,
            config: CONFIG.yggdrasill
        });
        name = game.i18n.localize(item.name);
    }
    if (taskType == "furor") {
        return new Promise(resolve => {
            const data = {
                title: game.i18n.format(name, {
                    type: taskType
                }),
                content: html,
                buttons: {
                    normal: {
                        label: game.i18n.localize("yggdrasill.chat.furorDialog.yes"),
                        callback: html => resolve(
                            _processTaskCheckOptions(html, taskType, item, isDodging)
                        )
                    },
                    cancel: {
                        label: game.i18n.localize("yggdrasill.chat.furorDialog.no"),
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

    } else {
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
                            _processTaskCheckOptions(html, taskType, item, isDodging)
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
}

function _processTaskCheckOptions(html, taskType, item, isDodging) {

    let form = html[0].querySelector('form');
    console.log(form);

    let positiveness = null;
    let sd = 0;
    let targetPath = null;
    let supportPath = null;
    let durationPath = null;


    switch (taskType) {
        case "carac":
            if (!isDodging) {
                return {
                    sr: parseInt(form.baseSR.value),
                    nbDiceFuror: parseInt(form.nbRollDiceFuror.value),
                    isDestinyRoll: form.isDestinyRoll.checked,
                    modifier: parseInt(form.ModificatorRollValue.value)
                }
            } else {
                return {
                    sr: 3,
                    nbDiceFuror: parseInt(form.nbRollDiceFuror.value),
                    isDestinyRoll: form.isDestinyRoll.checked,
                    modifier: parseInt(form.ModificatorRollValue.value)
                }
            }
            break;
        case "seccarac":
            return {
                sr: parseInt(form.baseSR.value),
                nbDiceFuror: parseInt(form.nbRollDiceFuror.value),
                isDestinyRoll: form.isDestinyRoll.checked,
                modifier: parseInt(form.ModificatorRollValue.value),
                caracUsed: form.caracUsed.value
            }
            break;
        case "competence":
            if (!isDodging) {
                return {
                    sr: parseInt(form.baseSR.value),
                    nbDiceFuror: parseInt(form.nbRollDiceFuror.value),
                    isDestinyRoll: form.isDestinyRoll.checked,
                    modifier: parseInt(form.ModificatorRollValue.value),
                    caracUsed: form.caracUsed.value
                }
            } else {
                return {
                    sr: 3,
                    nbDiceFuror: parseInt(form.nbRollDiceFuror.value),
                    isDestinyRoll: form.isDestinyRoll.checked,
                    modifier: parseInt(form.ModificatorRollValue.value),
                    caracUsed: "agility"
                }
            }
            break;
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
            break;
        case "sejdrCpt":
            if (item.data.positiveness == "both") {
                positiveness = form.positiveness.value;
            } else {
                positiveness = item.data.positiveness
            }
            return {
                nbDiceFuror: parseInt(form.nbRollDiceFuror.value),
                isDestinyRoll: form.isDestinyRoll.checked,
                modifier: parseInt(form.ModificatorRollValue.value),
                caracUsed: "",
                positiveness: positiveness
            }
            break;
        case "galdrCpt":
            targetPath = CONFIG.yggdrasill.galdrTargets[item.data.type][form.targets.value];
            durationPath = CONFIG.yggdrasill.galdrDuration[form.duration.value];
            console.log(targetPath);
            console.log(durationPath);

            sd += item.data.difficultyLevel + parseInt(game.i18n.localize(targetPath + ".sd")) + parseInt(game.i18n.localize(durationPath + ".sd"));

            console.log(sd);

            return {
                nbDiceFuror: parseInt(form.nbRollDiceFuror.value),
                isDestinyRoll: form.isDestinyRoll.checked,
                modifier: parseInt(form.ModificatorRollValue.value),
                caracUsed: "",
                sd: sd,
                durationPath: durationPath,
                targetPath: targetPath
            }
            break;
        case "runeCpt":
            supportPath = CONFIG.yggdrasill.runeSupport[form.support.value];
            if (item.data.positiveness == "both") {
                positiveness = form.positiveness.value;
            } else {
                positiveness = item.data.positiveness
            }
            console.log(supportPath);


            sd += (parseInt(item.data.level) * 3) + parseInt(game.i18n.localize(supportPath + ".sd")) + parseInt(form.power.value);

            console.log((parseInt(item.data.level) * 3) + " " + parseInt(game.i18n.localize(supportPath + ".sd")) + " " + parseInt(form.power.value));
            console.log(sd);

            return {
                nbDiceFuror: parseInt(form.nbRollDiceFuror.value),
                isDestinyRoll: form.isDestinyRoll.checked,
                modifier: parseInt(form.ModificatorRollValue.value),
                caracUsed: "",
                sd: sd,
                positiveness: positiveness,
                supportPath: supportPath,
                power: form.power.value
            }
            break;
        default:
            return {
                nbDiceFuror: 0,
                isDestinyRoll: false,
                modifier: 0
            }
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
        console.log(table)
        return table.name == "CriticalFail"
    });
    table = table[0];
    const defaultResults = await table.roll();
    let messageData = {
        roll: defaultResults.roll,
        speaker: ChatMessage.getSpeaker()
    };
    table.toMessage(defaultResults.results, messageData);
}

function resetingValues(data, type, id, nbDiceFuror) {
    console.log("Yggdrasill || resetingValues of actor :" + id);
    if (type == "pj" || type == "pnj") {
        let attacker = game.actors.get(id);
        let furorSpent = data.reserve.value - nbDiceFuror;
        if (furorSpent > 0) {
            attacker.update({
                'data.isReseting': true,
                'data.wasInFuror': data.wasInFuror,
                'data.reserve.value': furorSpent
            })
        } else {
            attacker.update({
                'data.isReseting': true,
                'data.wasInFuror': data.wasInFuror,
                'data.reserve.value': 0
            })
        }
        data.sr.value = 0;
        if (!data.isInFuror && !data.isInitiated) {
            data.nbDiceFuror.value = 0;
            data.nbDiceFuror.min = 0;
            data.nbDiceFuror.max = 1;
        } else if (data.isInFuror && !data.isInitiated) {
            console.log(data.nbDiceFuror);
            if (nbDiceFuror > data.nbDiceFuror.min) data.nbDiceFuror.lastValue = nbDiceFuror;
            data.nbDiceFuror.min = data.nbDiceFuror.lastValue;
            data.nbDiceFuror.value = data.nbDiceFuror.lastValue;
        } else if (data.caracUsed.isMagic) {
            data.caracUsed.isMagic = false;
            data.nbDiceFuror.value = 0;
            data.nbDiceFuror.min = 0;
            data.nbDiceFuror.max = 1;
        }

        if (data.martialCpt.mod != 0) {
            let i = 0;
            attacker.data.items.forEach(item => {

                if (item.type == "martialCpt") {
                    let itm = attacker.data.items.get(item.id);
                    console.log(itm);
                    if (itm.data.data.properties.isChecked) {
                        itm.update({
                            'data.properties.isChecked': false
                        })
                    }
                }
                i += 1;
            });
        }
        data.dmgMod = 0;
        console.log(data.nbDiceFuror);
        data.caracUsed.value = 0;
        data.caracUsed.rollModifier = 0;
        data.isDestinyRoll = false;
        data.caracUsed.isDefensive = false;
        data.caracUsed.isDM = false;
        data.magicCpt.sejdrCpt.positiveness = "none";
        data.magicCpt.runeCpt.positiveness = "none";

    } else {
        data.dmgMod = 0;
    }

    return data;
}