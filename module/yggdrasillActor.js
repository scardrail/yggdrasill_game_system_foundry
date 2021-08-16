import * as calculStats from "./calculStats.js"
export default class yggdrasillActor extends Actor {
    prepareData() {
        super.prepareData();

        let actorData = this.data;
        let data = actorData.data;
        if (actorData.type == "pj" || actorData.type == "pnj") {
            data = calculStats.setCharacterCaracs(data);

        }
    }
}