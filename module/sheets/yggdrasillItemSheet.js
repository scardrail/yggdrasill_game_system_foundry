export default class YggdrasillItemSheet extends ItemSheet {
    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            with: 530,
            height: 400,
            classes: ["yggdrasill", "sheet", "item  "]
        })
    }

    get template(){
        console.log(`Yggdrasill | Récupération du fichier html ${this.item.data.type}-sheet.html`);

        return `systems/yggdrasill/templates/sheets/${this.item.data.type}-sheet.html`;
    }

    getData(){
        const data = super.getData();
        data.config = CONFIG.yggdrasill;
        console.log(data);
        return data;
    }
}