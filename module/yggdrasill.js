import YggdrasillItemSheet from "./sheets/yggdrasillItemSheet.js";
import YggdrasillActorSheet from "./sheets/yggdrasillActorSheet.js";

import { registerHandlebarsHelpers } from "./helpers.js";
import {yggdrasill} from "./config.js";

Hooks.once("init", () => {
    console.log("Yggdrasill | Initialisation du système Yggdrasill");

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("yggdrasill", YggdrasillItemSheet, {makeDefault: true});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("yggdrasill", YggdrasillActorSheet, {makeDefault: true});

    //register Handlebars config
    CONFIG.yggdrasill = yggdrasill;
    // Register Handlebars helpers
    registerHandlebarsHelpers();
});