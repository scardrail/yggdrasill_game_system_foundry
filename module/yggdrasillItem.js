import * as calculStats from "./calculStats.js"
export default class yggdrasillItem extends Item {
    prepareData() {
        super.prepareData();

        let itemData = this.data;
        let data = itemData.data;
        if (itemData.type == "arme") {
            if (data.subType == "wThrow" || data.subType == "wShot") {
                data.properties.ranged = true;
            } else {
                data.properties.ranged = false;
            }
        }
    }
}