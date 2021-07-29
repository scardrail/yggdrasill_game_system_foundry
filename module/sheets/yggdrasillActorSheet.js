export default class YggdrasillActorSheet extends ActorSheet {
    get template(){
        console.log(`Yggdrasill | Récupération du fichier actor html ${this.actor.data.type}-sheet.html`);

        return `systems/yggdrasill/templates/sheets/${this.actor.data.type}-sheet.html`;
    }

    getData(){
        const data = super.getData();
        console.log(data);
        this.setCalculatedData(data);
        console.log(data);
        return data;
    }

    setCalculatedData = (data) => {
        console.log("Yggdrasill | setCalculatedData");
        data.data.data.ini.reaction = data.data.data.attributs.ame.instinct + data.data.data.attributs.esprit.perception + data.data.data.attributs.esprit.intelect;
        console.log("Yggdrasill | reaction : "+data.data.data.ini.reaction);
        data.data.data.dp.base = data.data.data.attributs.corps.agilité + data.data.data.attributs.corps.agilité + data.data.data.attributs.ame.instinct;
        console.log("Yggdrasill | base defense physique : "+data.data.data.dp.base);
        data.data.data.dm.base = data.data.data.attributs.esprit.tenacite + data.data.data.attributs.esprit.intelect + data.data.data.attributs.ame.instinct;
        console.log("Yggdrasill | base defense mentale : "+data.data.data.dm.base);
        
        data.systemData = data.data.data;
        return data;
    }
  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    // if ( !this.isEditable ) return;
    html.find('.rollable').click(this._onRoll.bind(this));
    
  }
  _onRoll(event){
      console.log(event)
      const dataSet = event.target.dataset["dice"];
      console.log(dataSet)
  }

}