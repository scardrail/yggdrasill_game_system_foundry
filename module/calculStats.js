export function setExtraCaracs(data) {
    console.log(data);

    data = setTempersModifications(data);
    data = setRollableStats(data);
    data = setActionsModifications(data);

    return data;
}

function setTempersModifications(data) {
    data.tempers.forEach(temper => {
        for (var i = 0; i <= temper.data.nbCaracUp; i++) {
            console.log(temper.data.caracUp);
            if (i == 1) {
                if (temper.data.caracUp.name == "conflict" || temper.data.caracUp.name == "mystic") {
                    data[temper.data.caracUp.name].offensive.mod += temper.data.caracUp.modifier;
                    data[temper.data.caracUp.name].defensive.mod += temper.data.caracUp.sndModifier;
                } else {
                    data[temper.data.caracUp.name].mod += temper.data.caracUp.modifier;
                }
            }
            if (i == 2) {
                if (temper.data.sndCaracUp.name == "conflict" || temper.data.sndCaracUp.name == "mystic") {
                    data[temper.data.sndCaracUp.name].offensive.mod += temper.data.sndCaracUp.modifier;
                    data[temper.data.sndCaracUp.name].defensive.mod += temper.data.sndCaracUp.sndModifier;
                } else {
                    data[temper.data.sndCaracUp.name].mod += temper.data.sndCaracUp.modifier;
                }
            }
            if (i == 3) {
                if (temper.data.thrdCaracUp.name == "conflict" || temper.data.thrdCaracUp.name == "mystic") {
                    data[temper.data.thrdCaracUp.name].offensive.mod += temper.data.thrdCaracUp.modifier;
                    data[temper.data.thrdCaracUp.name].defensive.mod += temper.data.thrdCaracUp.sndModifier;
                } else {
                    data[temper.data.thrdCaracUp.name].mod += temper.data.thrdCaracUp.modifier;
                }
            }
        }
    });

    return data;
}

function setRollableStats(data) {
    for (const [key, value] of Object.entries(data.config.extraCarac)) {
        if (!(key == 'none' || key == 'dmgMod')) {
            if (!(key == 'conflict' || key == 'mystic')) {
                data[key].roll = data[key].value + data[key].mod
            } else {
                data[key].offensive.roll = data[key].offensive.value + data[key].offensive.mod
                data[key].defensive.roll = data[key].defensive.value + data[key].defensive.mod
            }
        }
    };
    return data;
}

function setActionsModifications(data) {

    if (data.conflict.offensive.roll >= 10) {
        data.actions.max = 3;
    }

    data.actions.modifier = data.actions.value * -3;

    return data;
}

export function setCharacterCaracs(data) {

    let caracs = setCaracsDictionary(data);

    data = setFuror(data, caracs);
    data = setLifepoints(data, caracs);
    data = setSecCaracs(data, caracs);

    if (!(data.isInFuror)) {
        data.rollModifier = (data.lifePoints.modifier + data.secCarac.spaceReq.modifier);
    } else {
        data.rollModifier = (data.secCarac.spaceReq.modifier);
    }
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

function setFuror(data, caracs) {

    if (data.reserve.value == 0) {
        if (data.isInFuror) data.isInFuror = false;
        data.lifePoints.isWeary = true;
        data.lifePoints.wearyTime = (data.reserve.max * 10) + " " + game.i18n.localize("yggdrasill.sheet.duration.minute");
        data.nbDiceKept += -1;
    }

    if (data.isBerserk) {
        data.reserve.max = (caracs.vigour + caracs.tenacity + caracs.instinct);
        data.nbDiceFuror.max = data.reserve.max;
    } else if (data.isInitiated) {
        data.reserve.max = (caracs.vigour + caracs.intelect + caracs.instinct);
        data.nbDiceFuror.max = data.reserve.max;
    } else {
        data.reserve.max = Math.floor(((caracs.vigour + caracs.tenacity + caracs.instinct) / 2));
        data.nbDiceFuror.max = 1;
    }
    if (data.isBerserk && data.isInFuror) {
        data.nbDiceFuror.max = caracs.tenacity;
        data.nbDiceFuror.min = 1;
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
    } else if (data.secCarac.spaceReq.value > data.secCarac.spaceReq.crowded) {
        data.secCarac.spaceReq.status = "overloaded";
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

        if (data.lifePoints.value <= data.lifePoints.indestructible) {
            data.lifePoints.status = "dead";
            data.isDead = true;
            data.nbDiceKept = 0;
        } else {
            data.lifePoints.status = "indestructible";
        }
    } else {
        data.lifePoints.min = data.lifePoints.dead;

        // set lifePoints modifiers
        if (data.lifePoints.value <= data.lifePoints.injured && data.lifePoints.value > data.lifePoints.bruised) {
            data.lifePoints.modifier = -3;
            data.lifePoints.status = "injured";
        } else if (data.lifePoints.value <= data.lifePoints.bruised && data.lifePoints.value > data.lifePoints.unconscious) {
            data.lifePoints.status = "bruised";
        } else if (data.lifePoints.value <= data.lifePoints.unconscious && data.lifePoints.value > data.lifePoints.dead) {
            data.lifePoints.status = "unconscious";
        } else if (data.lifePoints.value <= data.lifePoints.dead) {
            data.lifePoints.status = "dead";
            data.isDead = true;
            data.nbDiceKept = 0;
        } else {
            data.lifePoints.status = "frisky";
        }

        if (data.lifePoints.isWeary || data.lifePoints.status == "bruised") {
            data.nbDiceKept += -1;
        }
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