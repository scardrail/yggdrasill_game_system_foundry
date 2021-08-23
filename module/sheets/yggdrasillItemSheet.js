export default class YggdrasillItemSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 600,
            height: 570,
            classes: ["yggdrasill", "sheet", "item"]
        })
    }

    get template() {
        console.log(`Yggdrasill | Récupération du fichier hbs ${this.item.data.type}-sheet.hbs`);

        return `systems/yggdrasill/templates/sheets/${this.item.data.type}-sheet.hbs`;
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.yggdrasill;

        console.log(data);
        return data;
    }

    activateListeners(html) {

        //if is editable
        if (this.isEditable) {}


        //if is editable
        if (this.item.isOwner) {
            html.find(".inline-edit").change(this._onSkillEdit.bind(this));
            html.find(".nbCaracs-edit").change(this._onNbCaracsEdit.bind(this));
        }

        super.activateListeners(html);
    }


    _onNbCaracsEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let nbCaracs = element.value;
        let data = this.item.data.data;
        let nbToAdd = nbCaracs - data.caracs.length;
        if (nbToAdd > 0) {
            for (var i = data.caracs.length; i < nbCaracs; i++) {
                data.caracs.push(data.caracUp);
            }
        }
        if (nbToAdd < 0) {
            for (var j = 0; j < Math.abs(nbToAdd); j++) {
                data.caracs.pop();
            }
        }
        return this.item.update({
            [`data.caracs`]: data.caracs
        });
    }

    _onSkillEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let identifier = element.dataset.identifier;
        let field = element.dataset.field;
        let data = this.item.data.data;
        if (element.type == "number") {
            data.caracs[identifier][field] = element.valueAsNumber;
        } else {
            data.caracs[identifier][field] = element.value;
        }
        return this.item.update({
            [`data.caracs`]: data.caracs
        });
    }
}