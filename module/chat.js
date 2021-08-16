import * as Dice from "./dice.js"
export function addChatListeners(html) {
    html.on('click', 'button.roll', onCaracRoll);
    html.on('change', '.furor', onSetNbDiceFuror);
    html.on('change', '.destiny', onSetIfDestinyDice);
    html.on('change', '.carac', onSetCarac);
    html.on('change', '.off', onSetOffensive);
    html.on('change', '.def', onSetDefensive);
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

    let item = {};

    if (attacker.data.data.isDestinyRoll) destinyDice = 1;

    if (card.dataset.type == "arme") {
        console.log("Yggdrasill || weapon");
        let weapon = attacker.items.get(card.dataset.itemId);
        console.log(weapon.data.data.subType);
        competence = attacker.items.filter(function(item) { return item.data.data.identifier == weapon.data.data.subType });
        competenceValue = competence[0].data.data.value;
        item = weapon;
    } else {
        console.log("Yggdrasill || competence");
        competence = attacker.items.get(card.dataset.itemId);
        competenceValue = competence.data.data.value;
        item = competence;
    }
    if (attacker.data.data.caracUsed.value == 0) {
        event.currentTarget.style.borderColor = "red";
        console.log("Yggdrasill || ROLL : choose a caracteristic");

    } else {
        caracValue = attacker.data.data.caracUsed.value;
        caracMod = attacker.data.data.caracUsed.mod + attacker.data.data.rollModifier;
        event.currentTarget.style.borderColor = "black";
        event.currentTarget.setAttribute("disabled", "");
        Dice.TaskCheck({
            actionValue: competenceValue,
            nbDiceKept: attacker.data.data.nbDiceKept,
            nbDiceFuror: attacker.data.data.nbDiceFuror.value,
            destinyDice: destinyDice,
            caracValue: caracValue,
            modifier: caracMod,
            attackType: attackType,
            actor: attacker.data,
            item: item.data
        })
    }


}