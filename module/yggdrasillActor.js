import * as calculStats from "./calculStats.js"
export default class yggdrasillActor extends Actor {
    prepareData() {
        super.prepareData();
        let actorData = this.data;
        actorData.data.id = actorData._id;
        if (actorData.type == "pj" || actorData.type == "pnj") {
            try {
                actorData = calculStats.setMartialCpt(actorData);
            } finally {}
            try {
                actorData = calculStats.setProtection(actorData);
            } finally {}
            try {
                actorData = calculStats.setHasMagicCpt(actorData);
            } finally {}
            let data = actorData.data;
            data = calculStats.setCharacterCaracs(data);
        } else {
            actorData = calculStats.setExtraCaracs(actorData);
        }
    }
}