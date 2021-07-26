export default class YggdrasillItemSheet extends ItemSheet {
    get template(){
        console.log(`Yggdrasill | Récupération du fichier html ${this.item.data.type}-sheet.html`);

        return `systems/yggdrasill/templates/sheets/${this.item.data.type}-sheet.html`;
    }

    getData(){
        const data = super.getData();
        console.log(data);
        return data;
    }
}