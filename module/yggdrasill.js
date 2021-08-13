import { registerHandlebarsHelpers} from "./helpers.js";
import {yggdrasill} from "./config.js";

import YggdrasillItemSheet from "./sheets/yggdrasillItemSheet.js";
import YggdrasillActorSheet from "./sheets/YggdrasillActorSheet.js";

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "templates/dice/roll.html",
        
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
        "systems/yggdrasill/templates/partials/extra-martial-block.hbs",
        "systems/yggdrasill/templates/partials/cards/weapon-card.hbs",
        "systems/yggdrasill/templates/partials/cards/armor-card.hbs",
        "systems/yggdrasill/templates/partials/cards/object-card.hbs",
        "systems/yggdrasill/templates/partials/cards/competence-card.hbs",
        "systems/yggdrasill/templates/partials/cards/temper-card.hbs",
        "systems/yggdrasill/templates/partials/chat/extra-conflict-card.hbs"
        
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