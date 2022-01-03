import * as Dice from "../dice.js"
import * as calculStats from "../calculStats.js"
export default class YggdrasillActorSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            with: 840,
            height: 800,
            tabs: [{
                navSelector: ".sheet-tabs",
                contentSelector: ".sheet-body",
                initial: "carac"
            }],
            template: "systems/yggdrasill/templates/sheets/importantCharacter-sheet.hbs",
            classes: ["yggdrasill", "sheet", "importantCharacter"]
        })
    }

    getData() {
        let data = super.getData();

        data.config = CONFIG.yggdrasill;

        data.weapons = data.items.filter(function(item) {
            return item.type == "arme"
        });
        data.powers = data.items.filter(function(item) {
            return item.type == "power"
        });
        data.armors = data.items.filter(function(item) {
            return item.type == "protection"
        });
        data.objects = data.items.filter(function(item) {
            return item.type == "object"
        });
        data.runes = data.items.filter(function(item) {
            return item.type == "rune"
        });
        data.competences = data.items.filter(function(item) {
            return item.type == "competence"
        });
        data.competencesNormal = data.competences.filter(function(item) {
            return item.data.type == "base"
        }).sort((a, b) => parseInt(b.data.value) - parseInt(a.data.value));
        data.competencesMartial = data.competences.filter(function(item) {
            return item.data.type == "martial"
        }).sort((a, b) => parseInt(b.data.value) - parseInt(a.data.value));
        data.competencesMagic = data.competences.filter(function(item) {
            return item.data.type == "magic"
        }).sort((a, b) => parseInt(b.data.value) - parseInt(a.data.value));
        data.tempers = data.items.filter(function(item) {
            return item.type == "temper"
        });
        data.martialCpt = data.items.filter(function(item) {
            return item.type == "martialCpt"
        });
        data.sejdrCpt = data.items.filter(function(item) {
            return item.type == "sejdrCpt"
        });
        data.galdrCpt = data.items.filter(function(item) {
            return item.type == "galdrCpt"
        });
        data.runeCpt = data.items.filter(function(item) {
            return item.type == "runeCpt"
        });
        console.log(data);

        return data;
    }

    activateListeners(html) {

        //if is editable
        if (this.isEditable) {
            html.find(".item-create").click(this._onItemCreate.bind(this));
            html.find(".item-edit").click(this._onItemEdit.bind(this));
            html.find(".item-delete").click(this._onItemDelete.bind(this));
            html.find(".inline-edit").change(this._onSkillEdit.bind(this));
        }

        //if is editable
        if (this.actor.isOwner) {
            html.find(".task-check").click(this._onTaskCheck.bind(this));
        }

        super.activateListeners(html);

    }

    _onItemCreate(event) {
        event.preventDefault();
        let element = event.currentTarget;

        let options = {};

        let itemName = "yggdrasill.sheet.new";
        itemName = itemName.concat('-', element.dataset.type);

        let itemData = {
            name: game.i18n.localize(itemName),
            type: element.dataset.type
        };

        itemData = itemData instanceof Array ? itemData : [itemData];
        return this.actor.createEmbeddedDocuments("Item", itemData, options);
    }

    _onSkillEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let field = element.dataset.field;
        let value = element.value
        if (element.type == "checkbox") {
            value = element.checked;
        }
        console.log(item);
        return item.update({
            [field]: value
        });

    }

    _onItemEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);

        item.sheet.render(true);

    }

    _onItemDelete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let options = {};

        itemId = itemId instanceof Array ? itemId : [itemId];

        return this.actor.deleteEmbeddedDocuments("Item", itemId, options);
    }

    _onTaskCheck(event) {
        let task = {
            askForOptions: true,
            taskType: null,
            actionValue: 0,
            nbDiceKept: 0,
            nbDiceFuror: 0,
            destinyDice: 0,
            caracValue: 0,
            caracName: null,
            modifier: 0,
            isFuror: false,
            isCpt: false,
            isWeapon: false,
            isMagic: false,
            isRune: false,
            isSejdr: false,
            isGaldr: false,
            isConflict: false,
            isOffensive: false,
            isDefensive: false,
            actorType: null,
            itemId: null,
            item: null,
            isDodge: null,
        }
        task.actorType = this.actor.type;
        task.taskType = event.currentTarget.dataset.tasktype;
        if (task.taskType == "competence") {
            try {
                task.isDodge = event.currentTarget.dataset.isdodge;

            } catch (error) {
                console.log(error);
            }
        }


        if (task.actorType == "pj" || task.actorType == "pnj") {
            task = setImportantCharacterTask(task, this.actor);
        } else {
            try {
                task.isCpt = event.currentTarget.dataset.competence;
                console.log(task.isCpt);
            } catch (e) {}
            try {
                task.isConflict = event.currentTarget.dataset.conflict;
                task.isOffensive = event.currentTarget.dataset.offensive;
                this.actor.data.data.physic.roll = event.currentTarget.dataset.physic;

                task.actionValue = event.currentTarget.dataset.actionValue;
                task.nbDiceKept = event.currentTarget.dataset.nbDiceKept;
                task.nbDiceFuror = event.currentTarget.dataset.nbDiceFuror;
                task.destinyDice = event.currentTarget.dataset.destinyDice;
                task.caracValue = event.currentTarget.dataset.caracValue;
                task.caracName = event.currentTarget.dataset.actionName;
                task.modifier = event.currentTarget.dataset.modifier;
            } catch (e) {

            }



        }

        console.log(task);
        console.log(this.actor);

        Dice.TaskCheck({
            askForOptions: task.askForOptions,
            taskType: task.taskType,
            actionValue: task.actionValue,
            nbDiceKept: task.nbDiceKept,
            nbDiceFuror: task.nbDiceFuror,
            destinyDice: task.destinyDice,
            caracValue: task.caracValue,
            caracName: task.caracName,
            modifier: task.modifier,
            isCpt: task.isCpt,
            isFuror: task.isFuror,
            isWeapon: task.isWeapon,
            isMagic: task.isMagic,
            isGaldr: task.isGaldr,
            isRune: task.isRune,
            isSejdr: task.isSejdr,
            isConflict: task.isConflict,
            isOffensive: task.isOffensive,
            isDefensive: task.isDefensive,
            actor: this.actor.data,
            actorType: task.actorType,
            speaker: this.actor,
            item: task.item,
            isDodge: task.isDodge,
        })
    }
}

function setImportantCharacterTask(task, actor) {
    console.log(task.taskType);
    console.log(task);
    console.log(actor.data);
    let competence = null;

    if (!actor.data.data.isInFuror) actor.data.data.nbDiceFuror.value = 0;

    switch (task.taskType) {
        case "carac":
            console.log("Yggdrasill || carac");
            if (!task.caracName) {
                task.caracName = event.currentTarget.dataset.carac;
            }
            if (task.caracName == "power" || task.caracName == "vigour" || task.caracName == "agility") {
                task.caracValue = actor.data.data.primCarac.body[task.caracName].value;
                task.modifier = actor.data.data.primCarac.body[task.caracName].mod;
            } else if (task.caracName == "intelect" || task.caracName == "perception" || task.caracName == "tenacity") {
                task.caracValue = actor.data.data.primCarac.spirit[task.caracName].value;
                task.modifier = actor.data.data.primCarac.spirit[task.caracName].mod;
            } else {
                task.caracValue = actor.data.data.primCarac.soul[task.caracName].value;
                task.modifier = actor.data.data.primCarac.soul[task.caracName].mod;
            }

            try {
                task.item = actor.items.get(event.currentTarget.dataset.itemId).data;
            } catch (e) {
                task.item = null
            }

            break;
        case "competence":
            console.log("Yggdrasill || competence");
            console.log(task.isDodge);
            if (task.isDodge) {
                try {
                    task.itemId = actor.items.getName("Esquive", {
                        strict: true
                    }).data._id;
                } catch (e) {
                    task.taskType = "carac";
                    task.caracName = "agility";
                    task = setImportantCharacterTask(task, actor);
                    return task;
                }
            } else {
                task.itemId = event.currentTarget.closest(".item").dataset.itemId;
            }
            task.item = actor.items.get(task.itemId).data;
            task.isCpt = true;
            task.actionValue = task.item.data.value;
            break;
        case "arme":
            console.log("Yggdrasill || weapon");
            task.itemId = event.currentTarget.closest(".item").dataset.itemId;
            task.item = actor.items.get(task.itemId).data;
            task.isWeapon = true;
            competence = actor.items.filter(function(item) {
                return item.data.data.identifier == task.item.data.subType
            });
            try {
                task.actionValue = competence[0].data.data.value;
            } catch (e) {
                task.actionValue = 0;
            }
            break;
        case "sejdrCpt":
            console.log("Yggdrasill || sejdr");
            task.itemId = event.currentTarget.closest(".item").dataset.itemId;
            task.item = actor.items.get(task.itemId).data;
            console.log(task.item);
            console.log(actor);
            task.isMagic = true;
            task.isSejdr = true;
            task.caracValue = actor.data.data.primCarac.soul.instinct.value;
            task.modifier += actor.data.data.primCarac.soul.instinct.mod;
            task.modifier += task.item.data.modifier;
            competence = actor.items.filter(function(item) {
                return item.data.data.identifier == task.item.type
            });
            try {
                task.actionValue = competence[0].data.data.value;
            } catch (e) {
                task.actionValue = 0;
            }
            if (actor.data.data.nbDiceFuror.value <= 0) actor.data.data.nbDiceFuror.value = 1;
            if (actor.data.data.primCarac.soul.instinct.value <= actor.data.data.reserve.value) {
                actor.data.data.nbDiceFuror.max = actor.data.data.primCarac.soul.instinct.value;
            } else {
                actor.data.data.nbDiceFuror.max = actor.data.data.reserve.value;
            }
            actor.data.data.nbDiceFuror.min = 1;
            task.actionValue = actor.data.data.primCarac.soul.instinct.value;
            if (task.item.data.positiveness == "both" && !task.askForOptions) task.askForOptions = true;

            break;
        case "galdrCpt":
            console.log("Yggdrasill || galdr");
            task.itemId = event.currentTarget.closest(".item").dataset.itemId;
            task.item = actor.items.get(task.itemId).data;
            console.log(task.item);
            task.isMagic = true;
            task.isGaldr = true;
            task.caracValue = actor.data.data.primCarac.soul.charisma.value;
            task.modifier += actor.data.data.primCarac.soul.charisma.mod;
            competence = actor.items.filter(function(item) {
                return item.data.data.identifier == task.item.type
            });
            try {
                task.actionValue = competence[0].data.data.value;
            } catch (e) {
                task.actionValue = 0;
            }
            if (actor.data.data.nbDiceFuror.value <= 0) actor.data.data.nbDiceFuror.value = 1;
            if (actor.data.data.primCarac.soul.instinct.value <= actor.data.data.reserve.value) {
                actor.data.data.nbDiceFuror.max = actor.data.data.primCarac.soul.instinct.value;
            } else {
                actor.data.data.nbDiceFuror.max = actor.data.data.reserve.value;
            }
            actor.data.data.nbDiceFuror.min = 1;
            task.actionValue = actor.data.data.primCarac.soul.charisma.value;
            task.askForOptions = true;
            break;
        case "runeCpt":
            console.log("Yggdrasill || rune");
            task.itemId = event.currentTarget.closest(".item").dataset.itemId;
            task.item = actor.items.get(task.itemId).data;
            console.log(task.item);
            console.log(actor);
            task.isMagic = true;
            task.isRune = true;
            task.caracValue = actor.data.data.primCarac.soul.communication.value;
            task.modifier += actor.data.data.primCarac.soul.communication.mod;
            competence = actor.items.filter(function(item) {
                return item.data.data.identifier == task.item.type
            });
            try {
                task.actionValue = competence[0].data.data.value;
            } catch (e) {
                task.actionValue = 0;
            }
            if (actor.data.data.nbDiceFuror.value <= 0) actor.data.data.nbDiceFuror.value = 1;
            if (actor.data.data.primCarac.soul.instinct.value <= actor.data.data.reserve.value) {
                actor.data.data.nbDiceFuror.max = actor.data.data.primCarac.soul.instinct.value;
            } else {
                actor.data.data.nbDiceFuror.max = actor.data.data.reserve.value;
            }
            actor.data.data.nbDiceFuror.min = 1;
            task.actionValue = actor.data.data.primCarac.soul.communication.value;
            if (task.item.data.positiveness == "both" && !task.askForOptions) task.askForOptions = true;
            break;
        case "furor":
            console.log("Yggdrasill || furor");
            task.isFuror = true;
            task.caracName = "intelect";
            task.caracValue = actor.data.data.primCarac.spirit.intelect.value;
            task.modifier = actor.data.data.primCarac.spirit.intelect.mod;
            if (actor.data.data.isInFuror) task.modifier += actor.data.data.secCarac.ttlDm
            switch (actor.data.data.lifePoints.status) {
                case "frisky":
                    if (actor.data.data.isInFuror) actor.data.data.reserve.outSR = actor.data.data.sr.level[0].value + (actor.data.data.reserve.max - actor.data.data.reserve.value);
                    else actor.data.data.sr.value = 3;
                    break;
                case "injured":
                    if (actor.data.data.isInFuror) actor.data.data.reserve.outSR = actor.data.data.sr.level[1].value + (actor.data.data.reserve.max - actor.data.data.reserve.value);
                    else actor.data.data.sr.value = 4;
                    break;
                case "bruised":
                    if (actor.data.data.isInFuror) actor.data.data.reserve.outSR = actor.data.data.sr.level[2].value + (actor.data.data.reserve.max - actor.data.data.reserve.value);
                    else actor.data.data.sr.value = 5;
                    break;
            }
            break;
        default:
            task.askForOptions = false;
            console.log("task.taskType unknown")
            break;
    }

    task.nbDiceKept = actor.data.data.nbDiceKept;
    task.modifier += actor.data.data.caracUsed.rollModifier + actor.data.data.rollModifier + actor.data.data.actions.modifier + actor.data.data.martialCpt.mod;

    return task;
}