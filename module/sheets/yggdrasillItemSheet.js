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
}