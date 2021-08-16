import * as calculStats from "./calculStats.js"
export default class yggdrasillActor extends Actor {
    prepareData() {
        super.prepareData();

        let actorData = this.data;
        let data = actorData.data;
        // console.log("Yggdrasill || data before :");
        // console.log(this);
        // console.log("Yggdrasill || type :" + actorData.type);
        if (actorData.type == "pj" || actorData.type == "pnj") {
            data = calculStats.setCharacterCaracs(data);
            // console.log("Yggdrasill || data after :");
            // console.log(this);
        }
    }
}