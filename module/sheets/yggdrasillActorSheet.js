

export default class YggdrasillActorSheet extends ActorSheet {
    get template(){
        console.log(`Yggdrasill | Récupération du fichier actor html ${this.actor.data.type}-sheet.html`);

        return `systems/yggdrasill/templates/sheets/${this.actor.data.type}-sheet.html`;
    }

    getData(){
        const data = super.getData();
        data.systemData = data.data.data;
        console.log(data);
        return data;
    }
    
}