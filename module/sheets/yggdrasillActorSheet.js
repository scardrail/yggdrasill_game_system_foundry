export default class YggdrasillActorSheet extends ActorSheet {
    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            template: `systems/yggdrasill/templates/sheets/${this.actor.data.type}-sheet.hbs`,
            classes: ["yggdrasill", "sheet", `${this.actor.data.type}`]
        })
    }

    get template(){
        console.log(`Yggdrasill | Récupération du fichier actor hbs ${this.actor.data.type}-sheet.hbs`);

        return `systems/yggdrasill/templates/sheets/${this.actor.data.type}-sheet.hbs`;
    }

    getData(){
        const data = super.getData();
        console.log(data);
        // this.setCalculatedData(data);
        console.log(data);
        return data;
    }

    // setCalculatedData = (data) => {
    //     console.log("Yggdrasill | setCalculatedData");
    //     data.data.data.ini.reaction = data.data.data.attributs.ame.instinct + data.data.data.attributs.esprit.perception + data.data.data.attributs.esprit.intelect;
    //     console.log("Yggdrasill | reaction : "+data.data.data.ini.reaction);
    //     data.data.data.dp.base = data.data.data.attributs.corps.agilité + data.data.data.attributs.corps.agilité + data.data.data.attributs.ame.instinct;
    //     console.log("Yggdrasill | base defense physique : "+data.data.data.dp.base);
    //     data.data.data.dm.base = data.data.data.attributs.esprit.tenacite + data.data.data.attributs.esprit.intelect + data.data.data.attributs.ame.instinct;
    //     console.log("Yggdrasill | base defense mentale : "+data.data.data.dm.base);
        
    //     data.systemData = data.data.data;
    //     return data;
    // }
  /* -------------------------------------------- */

  /** @override */
  activateListeners(hbs) {
    super.activateListeners(hbs);


}