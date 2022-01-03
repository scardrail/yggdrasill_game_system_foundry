export function setExtraCaracs(data) {
    // console.log(data);

    data = setExtraLifepoints(data);
    data = setTempersModifications(data);
    data = setRollableStats(data);
    data = setActionsModifications(data);
    data.data = setInitiative(data.data, data.data.physic.roll);

    return data;
}

function setExtraLifepoints(data) {
    // console.log(data);

    switch (data.data.lifeStatus) {
        case "frisky":
            data.data.lifePoints.value = 2;
            break;
        case "injured":
            data.data.lifePoints.value = 1;
            break;
        case "dead":
            data.data.lifePoints.value = 0;
            break;
        default:
            data.data.lifePoints.value = 2;
            break;
    }
    return data;
}

function setTempersModifications(data) {
    // console.log(data);
    try {
        let tempers = data.items.filter(function(item) {
            return item.type == "temper"
        });

        // console.log(tempers);

        tempers.forEach(temper => {
            if (temper.data.data.nbCaracUp > data.data.nbCaracUp) data.data.nbCaracUp = temper.data.data.nbCaracUp;
        });
        // console.log(data.data.nbCaracUp);
        data = newTM(data, tempers);

    } catch (e) {
        console.log("No tempers " + e);
    }
    return data;
}

function newTM(data, tempers) {
    tempers.forEach(temper => {
        temper.data.data.caracs.forEach(carac => {
            // console.log(carac.name);
            if (carac.name == "conflict" || carac.name == "mystic") {
                data.data[carac.name].offensive.mod += carac.modifier;
                data.data[carac.name].defensive.mod += carac.sndModifier;
            } else if (carac.name == "dmgMod") {
                data.data[carac.name] += carac.modifier;
            } else {
                data.data[carac.name].mod += carac.modifier;
            }
        })
    });
    return data;
}

function setRollableStats(data) {
    // console.log(data);
    for (const [key, value] of Object.entries(CONFIG.yggdrasill.extraCarac)) {
        if (!(key == 'none' || key == 'dmgMod' || key == 'attack' || key == 'defense')) {
            if (!(key == 'conflict' || key == 'mystic')) {
                data.data[key].roll = data.data[key].value + data.data[key].mod
            } else {
                data.data[key].offensive.roll = data.data[key].offensive.value + data.data[key].offensive.mod
                data.data[key].defensive.roll = data.data[key].defensive.value + data.data[key].defensive.mod
            }
        }
    };
    return data;
}

function setActionsModifications(data) {

    if (data.data.conflict.offensive.roll >= 10) {
        data.data.actions.max = 3;
    }

    data.data.actions.modifier = data.data.actions.value * -3;

    return data;
}

export function setCharacterCaracs(data) {

    let caracs = setCaracsDictionary(data);

    // console.log(data);

    data = setAction(data, caracs);
    data = setFuror(data, caracs);
    data = setLifepoints(data, caracs);
    data = setSecCaracs(data, caracs);
    data = setInitiative(data, data.secCarac.ttlIni);

    if (!(data.isInFuror)) {
        data.rollModifier = (data.lifePoints.modifier + data.secCarac.spaceReq.modifier);
    } else {
        data.rollModifier = (data.secCarac.spaceReq.modifier);
    }
    data.isReseting = false;
    return data;
}

function setCaracsDictionary(data) {
    let caracs = {}

    caracs.power = data.primCarac.body.power.value;
    caracs.vigour = data.primCarac.body.vigour.value;
    caracs.agility = data.primCarac.body.agility.value;
    caracs.intelect = data.primCarac.spirit.intelect.value;
    caracs.perception = data.primCarac.spirit.perception.value;
    caracs.tenacity = data.primCarac.spirit.tenacity.value;
    caracs.charisma = data.primCarac.soul.charisma.value;
    caracs.instinct = data.primCarac.soul.instinct.value;
    caracs.communication = data.primCarac.soul.communication.value;

    return caracs;
}

function setAction(data, caracs) {

    data.actions.max = caracs.agility + 1;

    switch (data.actions.value) {
        case 1:
            data.actions.modifier = 0;
            break;
        case 2:
            data.actions.modifier = -2;
            break;
        case 3:
            data.actions.modifier = -5;
            break;
        case 4:
            data.actions.modifier = -10;
            break;
        case 5:
            data.actions.modifier = -15;
            break;
        case 6:
            data.actions.modifier = -20;
            break;
    }

    return data;
}

function setFuror(data, caracs) {
    console.log(data)
    if (data.reserve.value == 0) {
        if (data.isInFuror) {
            game.actors.get(data.id).update({
                'data.isInFuror': false
            })
        }
        data.lifePoints.isWeary = true;
        data.lifePoints.wearyTime = (data.reserve.max * 10) + " " + game.i18n.localize("yggdrasill.sheet.duration.minute");
    }

    if (data.isBerserk) {
        data.reserve.max = (caracs.vigour + caracs.tenacity + caracs.instinct);
    } else if (data.isInitiated) {
        data.reserve.max = (caracs.vigour + caracs.intelect + caracs.instinct);
        if (!data.isReseting) data.nbDiceFuror.max = caracs.instinct;
    } else {
        data.reserve.max = Math.floor(((caracs.vigour + caracs.tenacity + caracs.instinct) / 2));
        if (!data.isReseting) data.nbDiceFuror.max = 1;
    }
    if (data.isBerserk && data.isInFuror && !data.wasInFuror) {
        data.wasInFuror = true;
        data.nbDiceFuror.max = caracs.tenacity;
        data.nbDiceFuror.min = 1;
        data.nbDiceFuror.value = 1;
        data.nbDiceFuror.lastValue = 1;
        console.log("entrée en fureur !! ");
    } else if (data.isBerserk && !data.isInFuror) {
        data.wasInFuror = false;
        data.nbDiceFuror.max = 1;
        data.nbDiceFuror.min = 0;
        data.nbDiceFuror.value = 0;
        data.nbDiceFuror.lastValue = 0;
        console.log("sortie de fureur !! ");
    } else {

        console.log("déjà en fureur !! ");
    }
    return data;
}

function setSecCaracs(data, caracs) {
    //set secondary caracs values
    data.secCarac.ini.reaction = (caracs.intelect + caracs.perception + caracs.instinct);
    data.secCarac.ttlIni = sum(data.secCarac.ini);

    data.secCarac.dp.base = (caracs.agility + caracs.vigour + caracs.instinct);
    if (!(data.isInFuror)) {
        data.secCarac.ttlDp = sum(data.secCarac.dp);
    } else {
        data.secCarac.ttlDp = 0;
    }

    data.secCarac.dm.base = (caracs.tenacity + caracs.instinct + caracs.intelect);
    data.secCarac.ttlDm = sum(data.secCarac.dm);

    data.secCarac.transport.value = (caracs.agility + caracs.vigour);
    data.secCarac.transport.run = (data.secCarac.transport.value * 2);
    data.secCarac.transport.runTime = caracs.vigour + game.i18n.localize("yggdrasill.sheet.duration.hour");
    data.secCarac.transport.sprint = (data.secCarac.transport.value * 3);
    data.secCarac.transport.runTime = (caracs.vigour * 2) + game.i18n.localize("yggdrasill.sheet.duration.turn");

    data.secCarac.spaceReq.max = ((caracs.power * 2) + caracs.vigour);
    data.secCarac.spaceReq.troubled = (data.secCarac.spaceReq.max * 2);
    data.secCarac.spaceReq.crowded = (data.secCarac.spaceReq.max * 3);

    if (data.secCarac.spaceReq.value >= data.secCarac.spaceReq.max && data.secCarac.spaceReq.value <= data.secCarac.spaceReq.troubled) {
        data.secCarac.spaceReq.status = "troubled";
        data.secCarac.spaceReq.modifier = -3;
    } else if (data.secCarac.spaceReq.value > data.secCarac.spaceReq.troubled && data.secCarac.spaceReq.value <= data.secCarac.spaceReq.crowded) {
        data.secCarac.spaceReq.status = "crowded";
        // data.sr.value += 1;
    } else if (data.secCarac.spaceReq.value > data.secCarac.spaceReq.crowded) {
        data.secCarac.spaceReq.status = "overloaded";
        // data.sr.value += 2;
    } else {
        data.secCarac.spaceReq.status = "free";
    }

    return data;
}

function setLifepoints(data, caracs) {
    // set lifePoints thresholds
    data.lifePoints.max = ((caracs.power + caracs.vigour + caracs.agility) * 3 + ((caracs.intelect + caracs.perception + caracs.tenacity) * 2) + (caracs.charisma + caracs.instinct + caracs.communication));
    data.lifePoints.frisky = (data.lifePoints.max);
    data.lifePoints.injured = (data.lifePoints.max / 2);
    data.lifePoints.bruised = Math.floor(data.lifePoints.max / 4);
    data.lifePoints.dead = Math.floor(-(data.lifePoints.max / 4));
    data.lifePoints.indestructible = -data.lifePoints.max;

    if (data.isBerserk && data.isInFuror) {
        data.lifePoints.min = data.lifePoints.indestructible;
        data.lifePoints.isIndestructible = true;
    } else {
        data.lifePoints.min = data.lifePoints.dead;
    }
    // set lifePoints modifiers
    if (data.lifePoints.value <= data.lifePoints.injured && data.lifePoints.value > data.lifePoints.bruised) {
        if (!data.lifePoints.isIndestructible) data.lifePoints.modifier = -3;
        data.lifePoints.status = "injured";
    } else if (data.lifePoints.value <= data.lifePoints.bruised && data.lifePoints.value > data.lifePoints.unconscious) {
        data.lifePoints.status = "bruised";
    } else if (data.lifePoints.value <= data.lifePoints.unconscious && data.lifePoints.value > data.lifePoints.dead && !data.lifePoints.isIndestructible) {
        data.lifePoints.status = "unconscious";
    } else if (data.lifePoints.value <= data.lifePoints.dead && !data.lifePoints.isIndestructible) {
        data.lifePoints.status = "dead";
        data.isDead = true;
        data.nbDiceKept = 0;
    } else if (data.lifePoints.value <= data.lifePoints.indestructible && data.lifePoints.isIndestructible) {
        data.lifePoints.status = "dead";
        data.isDead = true;
        data.lifePoints.isIndestructible = false;
        data.nbDiceKept = 0;
    } else {
        data.lifePoints.status = "frisky";
    }

    if (data.lifePoints.isWeary || (data.lifePoints.status == "bruised" && !data.lifePoints.isIndestructible)) {
        data.nbDiceKept += -1;
    }
    return data;

}

function sum(obj) {
    var sum = 0;
    for (var el in obj) {
        if (obj.hasOwnProperty(el)) {
            sum += parseFloat(obj[el]);
        }
    }
    return sum;
}

function setInitiative(data, value) {
    data.ttlIni = value;
    return data;
}

export function setProtection(actorData) {

    // console.log(actorData);
    try {
        let armors = actorData.items.filter(function(item) {
            return item.type == "protection"
        });
        let weapons = actorData.items.filter(function(item) {
            return item.type == "arme"
        });
        // console.log(armors);
        // console.log(weapons);
        let protection = 0;
        let protectionShield = 0;
        let enc = 0;
        armors.forEach(item => {
            if (!item.data.data.properties.stored) {
                if (item.data.data.properties.equiped) {
                    if (item.data.data.pSubType != "shield") {
                        protection += item.data.data.defBase.value;
                    } else {
                        protectionShield += item.data.data.defBase.value;
                        enc -= item.data.data.enc;
                    }
                }
                enc += item.data.data.enc;
            }
        });
        weapons.forEach(item => {
            if (!item.data.data.properties.stored) {
                enc += item.data.data.enc;
            }
        });

        // console.log(protection);
        // console.log(protectionShield);
        // console.log(enc);

        actorData.data.protection = protection;
        actorData.data.secCarac.dp.protection = protectionShield;
        actorData.data.secCarac.dp.spaceReq = -enc;
        actorData.data.secCarac.ini.spaceReq = -enc;
        actorData.data.secCarac.spaceReq.value = enc;
    } catch (e) {
        console.log("No Protection " + e);
    }
    // console.log(actorData);
    return actorData;
}


export function setMartialCpt(actorData) {
    // console.log(actorData);
    try {

        let item = actorData.items.filter(function(item) {
            return item.type == "martialCpt"
        });
        // console.log(item);
        item = item.filter(function(item) {
            return item.data.data.properties.isChecked
        });
        // console.log(item);
        let competenceModifier = item[0].data.data.modifier;
        let competenceDmgMod = item[0].data.data.dmgMod;
        let competenceType = item[0].data.data.type;

        actorData.data.martialCpt.mod = competenceModifier;
        switch (competenceType) {
            case "attack":
                actorData.data.martialCpt.dmgMod = competenceDmgMod;
                actorData.data.martialCpt.isMcptAttackUsed = true;
                break;
            case "defense":
                actorData.data.martialCpt.isMcptDefenseUsed = true;
                break;
            case "utilitary":
                actorData.data.martialCpt.isMcptUtilitaryUsed = true;
                break;
            default:
                break;
        }
        // console.log(actorData);

    } catch (e) {
        actorData.data.martialCpt.isMcptAttackUsed = false;
        actorData.data.martialCpt.isMcptDefenseUsed = false;
        actorData.data.martialCpt.isMcptUtilitaryUsed = false;
        actorData.data.martialCpt.mod = 0;
        actorData.data.martialCpt.dmgMod = 0;

        console.log("No checked MrtialCpt " + e);
    }
    return actorData;
}


export function setHasMagicCpt(actorData) {
    try {
        let competence = actorData.items.filter(function(cpt) {
            return cpt.type == "competence"
        });
        let item = competence.filter(function(item) {
            return item.data.data.type == "magic"
        }).sort((a, b) => parseInt(b.data.value) - parseInt(a.data.value));
        if (item.length > 0) actorData.data.hasMagicCpt = true;

    } catch (e) {
        console.log("setHasMagicCpt " + e);
        actorData.data.hasMagicCpt = false;
    }
    return actorData;
}