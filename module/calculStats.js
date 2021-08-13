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
                    data.data.data[temper.data.caracUp.name].offensive.mod += temper.data.caracUp.modifier;
                    data.data.data[temper.data.caracUp.name].defensive.mod += temper.data.caracUp.sndModifier;
                } else {
                    data.data.data[temper.data.caracUp.name].mod += temper.data.caracUp.modifier;
                }
            }
            if (i == 2) {
                if (temper.data.sndCaracUp.name == "conflict" || temper.data.sndCaracUp.name == "mystic") {
                    data.data.data[temper.data.sndCaracUp.name].offensive.mod += temper.data.sndCaracUp.modifier;
                    data.data.data[temper.data.sndCaracUp.name].defensive.mod += temper.data.sndCaracUp.sndModifier;
                } else {
                    data.data.data[temper.data.sndCaracUp.name].mod += temper.data.sndCaracUp.modifier;
                }
            }
            if (i == 3) {
                if (temper.data.thrdCaracUp.name == "conflict" || temper.data.thrdCaracUp.name == "mystic") {
                    data.data.data[temper.data.thrdCaracUp.name].offensive.mod += temper.data.thrdCaracUp.modifier;
                    data.data.data[temper.data.thrdCaracUp.name].defensive.mod += temper.data.thrdCaracUp.sndModifier;
                } else {
                    data.data.data[temper.data.thrdCaracUp.name].mod += temper.data.thrdCaracUp.modifier;
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
                data.data.data[key].roll = data.data.data[key].value + data.data.data[key].mod
            } else {
                data.data.data[key].offensive.roll = data.data.data[key].offensive.value + data.data.data[key].offensive.mod
                data.data.data[key].defensive.roll = data.data.data[key].defensive.value + data.data.data[key].defensive.mod
            }
        }
    };
    return data;
}

function setActionsModifications(data) {

    if (data.data.data.conflict.offensive.roll >= 10) {
        data.data.data.actions.max = 3;
    }

    data.data.data.actions.modifier = data.data.data.actions.value * -3;

    return data;
}

export function setCharacterCaracs(data) {

    let caracs = setCaracsDictionary(data);

    data = setFuror(data, caracs);
    data = setLifepoints(data, caracs);
    data = setSecCaracs(data, caracs);

    if (!(data.data.data.isInFuror)) {
        data.data.data.rollModifier = (data.data.data.lifePoints.modifier + data.data.data.secCarac.spaceReq.modifier);
    } else {
        data.data.data.rollModifier = (data.data.data.secCarac.spaceReq.modifier);
    }
    return data;
}

function setCaracsDictionary(data) {
    let caracs = {}

    caracs.power = data.data.data.primCarac.body.power.value;
    caracs.vigour = data.data.data.primCarac.body.vigour.value;
    caracs.agility = data.data.data.primCarac.body.agility.value;
    caracs.intelect = data.data.data.primCarac.spirit.intelect.value;
    caracs.perception = data.data.data.primCarac.spirit.perception.value;
    caracs.tenacity = data.data.data.primCarac.spirit.tenacity.value;
    caracs.charisma = data.data.data.primCarac.soul.charisma.value;
    caracs.instinct = data.data.data.primCarac.soul.instinct.value;
    caracs.communication = data.data.data.primCarac.soul.communication.value;

    return caracs;
}

function setFuror(data, caracs) {

    if (data.data.data.reserve.value == 0) {
        if (data.data.data.isInFuror) data.data.data.isInFuror = false;
        data.data.data.lifePoints.isWeary = true;
        data.data.data.lifePoints.wearyTime = (data.data.data.reserve.max * 10) + " " + game.i18n.localize("yggdrasill.sheet.duration.minute");
        data.data.data.nbDiceKept += -1;
    }

    if (data.data.data.isBerserk) {
        data.data.data.reserve.max = (caracs.vigour + caracs.tenacity + caracs.instinct);
        data.data.data.nbDiceFuror.max = data.data.data.reserve.max;
    } else if (data.data.data.isInitiated) {
        data.data.data.reserve.max = (caracs.vigour + caracs.intelect + caracs.instinct);
        data.data.data.nbDiceFuror.max = data.data.data.reserve.max;
    } else {
        data.data.data.reserve.max = Math.floor(((caracs.vigour + caracs.tenacity + caracs.instinct) / 2));
        data.data.data.nbDiceFuror.max = 1;
    }
    if (data.data.data.isBerserk && data.data.data.isInFuror) {
        data.data.data.nbDiceFuror.minMax = caracs.tenacity;
        data.data.data.nbDiceFuror.min = 1;
    }

    return data;
}

function setSecCaracs(data, caracs) {
    //set secondary caracs values
    data.data.data.secCarac.ini.reaction = (caracs.intelect + caracs.perception + caracs.instinct);
    data.data.data.secCarac.ttlIni = sum(data.data.data.secCarac.ini);

    data.data.data.secCarac.dp.base = (caracs.agility + caracs.vigour + caracs.instinct);
    if (!(data.data.data.isInFuror)) {
        data.data.data.secCarac.ttlDp = sum(data.data.data.secCarac.dp);
    }

    data.data.data.secCarac.dm.base = (caracs.tenacity + caracs.instinct + caracs.intelect);
    data.data.data.secCarac.ttlDm = sum(data.data.data.secCarac.dm);

    data.data.data.secCarac.transport.value = (caracs.agility + caracs.vigour);
    data.data.data.secCarac.transport.run = (data.data.data.secCarac.transport.value * 2);
    data.data.data.secCarac.transport.runTime = caracs.vigour + game.i18n.localize("yggdrasill.sheet.duration.hour");
    data.data.data.secCarac.transport.sprint = (data.data.data.secCarac.transport.value * 3);
    data.data.data.secCarac.transport.runTime = (caracs.vigour * 2) + game.i18n.localize("yggdrasill.sheet.duration.turn");

    data.data.data.secCarac.spaceReq.max = ((caracs.power * 2) + caracs.vigour);
    data.data.data.secCarac.spaceReq.troubled = (data.data.data.secCarac.spaceReq.max * 2);
    data.data.data.secCarac.spaceReq.crowded = (data.data.data.secCarac.spaceReq.max * 3);

    if (data.data.data.secCarac.spaceReq.value >= data.data.data.secCarac.spaceReq.max && data.data.data.secCarac.spaceReq.value <= data.data.data.secCarac.spaceReq.troubled) {
        data.data.data.secCarac.spaceReq.status = "troubled";
        data.data.data.secCarac.spaceReq.modifier = -3;
    } else if (data.data.data.secCarac.spaceReq.value > data.data.data.secCarac.spaceReq.troubled && data.data.data.secCarac.spaceReq.value <= data.data.data.secCarac.spaceReq.crowded) {
        data.data.data.secCarac.spaceReq.status = "crowded";
    } else if (data.data.data.secCarac.spaceReq.value > data.data.data.secCarac.spaceReq.crowded) {
        data.data.data.secCarac.spaceReq.status = "overloaded";
    } else {
        data.data.data.secCarac.spaceReq.status = "free";
    }

    return data;
}

function setLifepoints(data, caracs) {
    // set lifePoints thresholds
    data.data.data.lifePoints.max = ((caracs.power + caracs.vigour + caracs.agility) * 3 + ((caracs.intelect + caracs.perception + caracs.tenacity) * 2) + (caracs.charisma + caracs.instinct + caracs.communication));
    data.data.data.lifePoints.frisky = (data.data.data.lifePoints.max);
    data.data.data.lifePoints.injured = (data.data.data.lifePoints.max / 2);
    data.data.data.lifePoints.bruised = Math.floor(data.data.data.lifePoints.max / 4);
    data.data.data.lifePoints.dead = Math.floor(-(data.data.data.lifePoints.max / 4));
    data.data.data.lifePoints.indestructible = -data.data.data.lifePoints.max;

    if (data.data.data.isBerserk && data.data.data.isInFuror) {
        data.data.data.lifePoints.min = data.data.data.lifePoints.indestructible;

        if (data.data.data.lifePoints.value <= data.data.data.lifePoints.indestructible) {
            data.data.data.lifePoints.status = "dead";
            data.data.data.isDead = true;
        } else {
            data.data.data.lifePoints.status = "indestructible";
        }
    } else {
        data.data.data.lifePoints.min = data.data.data.lifePoints.dead;

        // set lifePoints modifiers
        if (data.data.data.lifePoints.value <= data.data.data.lifePoints.injured && data.data.data.lifePoints.value > data.data.data.lifePoints.bruised) {
            data.data.data.lifePoints.modifier = -3;
            data.data.data.lifePoints.status = "injured";
        } else if (data.data.data.lifePoints.value <= data.data.data.lifePoints.bruised && data.data.data.lifePoints.value > data.data.data.lifePoints.unconscious) {
            data.data.data.lifePoints.status = "bruised";
        } else if (data.data.data.lifePoints.value <= data.data.data.lifePoints.unconscious && data.data.data.lifePoints.value > data.data.data.lifePoints.dead) {
            data.data.data.lifePoints.status = "unconscious";
        } else if (data.data.data.lifePoints.value <= data.data.data.lifePoints.dead) {
            data.data.data.lifePoints.status = "dead";
            data.data.data.isDead = true;
        } else {
            data.data.data.lifePoints.status = "frisky";
        }

        if (data.data.data.lifePoints.isWeary || data.data.data.lifePoints.status == "bruised") {
            data.data.data.nbDiceKept += -1;
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