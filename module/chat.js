import * as Dice from "./dice.js"
export function addChatListeners(html) {
    html.on('click', 'button.roll', onCaracRoll);
    html.on('change', '.furor', onSetNbDiceFuror);
    html.on('change', '.destiny', onSetIfDestinyDice);
    html.on('change', '.carac', onSetCarac);
    html.on('change', '.off', onSetOffensive);
    html.on('change', '.def', onSetDefensive);
    html.on('change', '.targets', onSetTargets);
    html.on('change', '.duration', onSetDuration);
    html.on('change', '.support', onSetSupport);
    html.on('change', '.power', onSetPower);
}

function onSetPower(event) {
    const element = event.currentTarget.closest(".power");
    let power = element.value;

    let attacker = game.actors.get(element.dataset.ownerId);

    attacker.data.data.magicCpt.runeCpt.power = power;
    attacker.data.data.magicCpt.runeCpt.sd.power = power;
    console.log(attacker);
}

function onSetSupport(event) {
    const element = event.currentTarget.closest(".support");
    let support = element.value;

    let attacker = game.actors.get(element.dataset.ownerId);

    console.log(support);
    console.log(attacker.data.data.primCarac.body.agility.value);
    console.log((6 - attacker.data.data.primCarac.body.agility.value));
    console.log(game.i18n.localize("yggdrasill.magicCpt.runeSupport." + support + ".castDuration"));

    attacker.data.data.magicCpt.runeCpt.castDuration = (6 - attacker.data.data.primCarac.body.agility.value) + " " + game.i18n.localize("yggdrasill.magicCpt.runeSupport." + support + ".castDuration");
    attacker.data.data.magicCpt.runeCpt.effectsDuration = game.i18n.localize("yggdrasill.magicCpt.runeSupport." + support + ".effectsDuration");
    attacker.data.data.magicCpt.runeCpt.support = game.i18n.localize("yggdrasill.magicCpt.runeSupport." + support + ".value");
    attacker.data.data.magicCpt.runeCpt.sd.support = game.i18n.localize("yggdrasill.magicCpt.runeSupport." + support + ".sd");
    console.log(attacker);
}

function onSetTargets(event) {
    const element = event.currentTarget.closest(".targets");
    let subType = element.dataset.subType;
    let size = element.value;

    let attacker = game.actors.get(element.dataset.ownerId);

    attacker.data.data.magicCpt.galdrCpt.galdrTargets.value = game.i18n.localize("yggdrasill.magicCpt.galdrTargets." + subType + "." + size + ".value");
    attacker.data.data.magicCpt.galdrCpt.galdrTargets.size = attacker.data.data.primCarac.soul.instinct.value * parseInt(game.i18n.localize("yggdrasill.magicCpt.galdrTargets." + subType + "." + size + ".size"));
    attacker.data.data.magicCpt.galdrCpt.galdrTargets.sd = game.i18n.localize("yggdrasill.magicCpt.galdrTargets." + subType + "." + size + ".sd");
    console.log(attacker);
}

function onSetDuration(event) {
    const element = event.currentTarget.closest(".duration");
    let duration = element.value;

    let attacker = game.actors.get(element.dataset.ownerId);
    attacker.data.data.magicCpt.galdrCpt.galdrDuration.value = game.i18n.localize("yggdrasill.magicCpt.galdrDuration." + duration + ".value");
    attacker.data.data.magicCpt.galdrCpt.galdrDuration.dice = game.i18n.localize("yggdrasill.magicCpt.galdrDuration." + duration + ".dice");
    attacker.data.data.magicCpt.galdrCpt.galdrDuration.unit = game.i18n.localize("yggdrasill.magicCpt.galdrDuration." + duration + ".unit");
    attacker.data.data.magicCpt.galdrCpt.galdrDuration.sd = game.i18n.localize("yggdrasill.magicCpt.galdrDuration." + duration + ".sd");
    console.log(attacker);
}

function onSetOffensive(event) {
    const element = event.currentTarget.closest(".off");
    let offensive = element.checked;
    console.log(offensive);
    let attacker = game.actors.get(element.dataset.ownerId);
    attacker.data.data.caracUsed.isOffensive = offensive;
    console.log(attacker);
}

function onSetDefensive(event) {
    const element = event.currentTarget.closest(".def");
    let defensive = element.checked;
    let attacker = game.actors.get(element.dataset.ownerId);
    attacker.data.data.caracUsed.isDefensive = defensive;
}

function onSetCarac(event) {
    const element = event.currentTarget.closest(".carac");
    let type = element.dataset.type;
    let ranged = element.dataset.ranged;
    let carac = element.value;
    let attacker = game.actors.get(element.dataset.ownerId);
    let caracValue = 0;
    let caracMod = 0;
    let secCarac = "";

    if (type == "arme") {
        secCarac = carac;
        if (ranged == "false") {
            carac = CONFIG.yggdrasill.meleeCoresp[carac];
        } else {
            carac = CONFIG.yggdrasill.rangedCoresp[carac];
        }
    }

    console.log("Yggdrasill || carac " + carac);
    if (carac == "power" || carac == "vigour" || carac == "agility") {
        caracValue = attacker.data.data.primCarac.body[carac].value;
        caracMod = attacker.data.data.primCarac.body[carac].mod;
    } else if (carac == "intelect" || carac == "perception" || carac == "tenacity") {
        caracValue = attacker.data.data.primCarac.spirit[carac].value;
        caracMod = attacker.data.data.primCarac.spirit[carac].mod;
    } else {
        caracValue = attacker.data.data.primCarac.soul[carac].value;
        caracMod = attacker.data.data.primCarac.soul[carac].mod;
    }
    console.log("Yggdrasill || carac value " + caracValue);

    if (type == "arme") {
        switch (secCarac) {
            case 'devastating':
            case 'iStoppage':
            case 'pStoppage':
                attacker.data.data.dmgMod = (caracValue * 3);
                caracMod += -caracValue;
                break;
            case 'force':
            case 'iImpact':
            case 'pImpact':
                attacker.data.data.dmgMod = caracValue;
                break;
            case 'precise':
                attacker.data.data.enemyArmorMod = -caracValue;
                break;
            case 'aimed':
                attacker.data.data.enemyArmorMod = -(caracValue * 3);
                attacker.data.data.dmgMod = (caracValue * 3)
                caracMod += -caracValue;
                break;
            case 'parade':
                attacker.data.data.caracUsed.isDefensive = true;
                break;
            default:
                console.log(`Sorry, we are out of ${secCarac}.`);
        }
    }


    attacker.data.data.caracUsed.name = carac;
    attacker.data.data.caracUsed.value = caracValue;
    attacker.data.data.caracUsed.mod = caracMod;
}

function onSetNbDiceFuror(event) {
    const element = event.currentTarget.closest(".furor");
    let furor = element.value;
    let attacker = game.actors.get(element.dataset.ownerId);
    attacker.data.data.nbDiceFuror.value = parseInt(furor);
}

function onSetIfDestinyDice(event) {
    const element = event.currentTarget.closest(".destiny");
    let destiny = element.checked;
    let attacker = game.actors.get(element.dataset.ownerId);
    attacker.data.data.isDestinyRoll = destiny;
}

function onCaracRoll(event) {
    const card = event.currentTarget.closest(".item");
    let attacker = game.actors.get(card.dataset.ownerId);
    let competence = "";
    let competenceValue = 0;
    let caracValue = 0;
    let caracMod = 0;
    let destinyDice = 0;
    let attackType = null;
    let cptNeeded = true;

    let item = {};

    if (attacker.data.data.isDestinyRoll) destinyDice = 1;

    if (card.dataset.type == "arme") {
        console.log("Yggdrasill || weapon");
        let weapon = attacker.items.get(card.dataset.itemId);
        console.log(weapon.data.data.subType);
        competence = attacker.items.filter(function(item) { return item.data.data.identifier == weapon.data.data.subType });
        try {
            competenceValue = competence[0].data.data.value;
        } catch (e) {
            competenceValue = 0;
        }

        item = weapon;
    } else if (card.dataset.type == "sejdrCpt" || card.dataset.type == "galdrCpt" || card.dataset.type == "runeCpt") {
        console.log("Yggdrasill || " + card.dataset.type);
        if (attacker.data.data.nbDiceFuror.value <= 0) attacker.data.data.nbDiceFuror.value = 1;
        cptNeeded = false;
        let cpt = attacker.items.get(card.dataset.itemId);
        competence = attacker.items.filter(function(item) { return item.data.data.identifier == cpt.type });
        console.log(cpt);
        console.log(competence);
        competenceValue = competence[0].data.data.value;
        switch (card.dataset.type) {
            case "sejdrCpt":
                attacker.data.data.caracUsed.value = attacker.data.data.primCarac.soul.instinct.value;
                break;
            case "galdrCpt":
                attacker.data.data.caracUsed.value = attacker.data.data.primCarac.soul.charisma.value;
                attacker.data.data.magicCpt.galdrCpt.difficultyLevelSum = (attacker.data.data.magicCpt.galdrCpt.galdrDuration.sd + attacker.data.data.magicCpt.galdrCpt.galdrTargets.sd + cpt.data.data.difficultyLevel);
                break;
            case "runeCpt":
                attacker.data.data.magicCpt.runeCpt.effectsDuration = competenceValue + " " + attacker.data.data.magicCpt.runeCpt.effectsDuration;
                attacker.data.data.magicCpt.runeCpt.sd.level = (cpt.data.data.level * 3)
                attacker.data.data.caracUsed.value = attacker.data.data.primCarac.soul.communication.value;
                attacker.data.data.magicCpt.runeCpt.difficultyLevelSum = (parseInt(attacker.data.data.magicCpt.runeCpt.sd.support) + parseInt(attacker.data.data.magicCpt.runeCpt.sd.power) + parseInt(attacker.data.data.magicCpt.runeCpt.sd.level));
                break;
        }
        item = cpt;
    } else if (card.dataset.type == "competence") {
        console.log("Yggdrasill || competence");
        competence = attacker.items.get(card.dataset.itemId);
        competenceValue = competence.data.data.value;
        item = competence;
    }
    if (attacker.data.data.caracUsed.value == 0 && cptNeeded) {
        event.currentTarget.style.borderColor = "red";
        console.log("Yggdrasill || ROLL : choose a caracteristic");

    } else {
        console.log("Yggdrasill || attacker");
        console.log(attacker);
        let isConflict = false
        caracValue = attacker.data.data.caracUsed.value;
        caracMod = attacker.data.data.caracUsed.mod + attacker.data.data.rollModifier + attacker.data.data.actions.modifier + attacker.data.data.martialCpt.mod;
        event.currentTarget.style.borderColor = "black";
        event.currentTarget.setAttribute("disabled", "");
        Dice.TaskCheck({
            actionValue: competenceValue,
            nbDiceKept: attacker.data.data.nbDiceKept,
            nbDiceFuror: attacker.data.data.nbDiceFuror.value,
            destinyDice: destinyDice,
            caracValue: caracValue,
            modifier: caracMod,
            isConflict: isConflict,
            attackType: attackType,
            actor: attacker.data,
            item: item.data
        })
    }


}