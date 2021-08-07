import YggdrasillItemSheet from "./sheets/yggdrasillItemSheet.js";
import YggdrasillActorSheet from "./sheets/YggdrasillActorSheet.js";

import { registerHandlebarsHelpers} from "./helpers.js";
import {yggdrasill} from "./config.js";

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/yggdrasill/templates/partials/character-description-block.hbs",
        "systems/yggdrasill/templates/partials/character-richness-block.hbs",
        "systems/yggdrasill/templates/partials/character-primCarac-block.hbs",
        "systems/yggdrasill/templates/partials/character-secCarac-block.hbs",
        "systems/yggdrasill/templates/partials/character-thirdCarac-block.hbs",
        "systems/yggdrasill/templates/partials/character-actAndFuror-block.hbs",
        "systems/yggdrasill/templates/partials/character-weapons-block.hbs",
        "systems/yggdrasill/templates/partials/character-magics-block.hbs",
        "systems/yggdrasill/templates/partials/character-martialCpt-block.hbs",
        "systems/yggdrasill/templates/partials/character-armors-block.hbs",
        "systems/yggdrasill/templates/partials/character-objects-block.hbs",
        "systems/yggdrasill/templates/partials/character-competences-block.hbs",
        "systems/yggdrasill/templates/partials/character-aett-block.hbs",
        "systems/yggdrasill/templates/partials/extra-carac-block.hbs",
        "systems/yggdrasill/templates/partials/extra-temper-block.hbs",
        "systems/yggdrasill/templates/partials/weapon-card.hbs",
        "systems/yggdrasill/templates/partials/armor-card.hbs",
        "systems/yggdrasill/templates/partials/object-card.hbs",
        "systems/yggdrasill/templates/partials/competence-card.hbs",
        "systems/yggdrasill/templates/partials/temper-card.hbs"
    ];
    return loadTemplates(templatePaths);
}

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
    preloadHandlebarsTemplates();
});