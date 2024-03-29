import {
    registerHandlebarsHelpers
} from "./helpers.js";
import {
    yggdrasill
} from "./config.js";

import * as Chat from "./chat.js";

import yggdrasillItem from "./yggdrasillItem.js";
import yggdrasillActor from "./yggdrasillActor.js";

import YggdrasillItemSheet from "./sheets/yggdrasillItemSheet.js";
import YggdrasillActorSheet from "./sheets/YggdrasillActorSheet.js";

async function preloadHandlebarsTemplates() {
    const templatePaths = [

        "systems/yggdrasill/templates/partials/character-description-block.hbs",
        "systems/yggdrasill/templates/partials/character-richness-block.hbs",
        "systems/yggdrasill/templates/partials/character-primCarac-block.hbs",
        "systems/yggdrasill/templates/partials/character-secCarac-block.hbs",
        "systems/yggdrasill/templates/partials/character-thirdCarac-block.hbs",
        "systems/yggdrasill/templates/partials/character-actAndFuror-block.hbs",
        "systems/yggdrasill/templates/partials/character-actAndFuror-magic-block.hbs",
        "systems/yggdrasill/templates/partials/character-weapons-block.hbs",
        "systems/yggdrasill/templates/partials/character-powers-block.hbs",
        "systems/yggdrasill/templates/partials/character-magics-block.hbs",
        "systems/yggdrasill/templates/partials/character-martialCpt-block.hbs",
        "systems/yggdrasill/templates/partials/character-armors-block.hbs",
        "systems/yggdrasill/templates/partials/character-objects-block.hbs",
        "systems/yggdrasill/templates/partials/character-runes-block.hbs",
        "systems/yggdrasill/templates/partials/character-competences-block.hbs",
        "systems/yggdrasill/templates/partials/character-aett-block.hbs",
        "systems/yggdrasill/templates/partials/character-parameters-block.hbs",
        "systems/yggdrasill/templates/partials/extra-carac-block.hbs",
        "systems/yggdrasill/templates/partials/extra-temper-block.hbs",
        "systems/yggdrasill/templates/partials/extra-martial-block.hbs",

        "systems/yggdrasill/templates/partials/cards/weapon-card.hbs",
        "systems/yggdrasill/templates/partials/cards/armor-card.hbs",
        "systems/yggdrasill/templates/partials/cards/object-card.hbs",
        "systems/yggdrasill/templates/partials/cards/competence-card.hbs",
        "systems/yggdrasill/templates/partials/cards/temper-card.hbs",

        "systems/yggdrasill/templates/partials/chat/rollCheck.hbs",
        "systems/yggdrasill/templates/partials/chat/character-basic-card.hbs",

        "systems/yggdrasill/templates/partials/chat/extra-conflict-card.hbs",
        "systems/yggdrasill/templates/partials/chat/character-competence-card.hbs",
        "systems/yggdrasill/templates/partials/chat/character-damage-card.hbs"

    ];
    return loadTemplates(templatePaths);
}

function registerSystemsSettings() {
    game.settings.register("yggdrasill", "DualWeaponsModificator", {
        config: true,
        scrope: "client",
        name: "SETTINGS.DualWeaponsModificator.name",
        hint: "SETTINGS.DualWeaponsModificator.label",
        type: String,
        choices: {
            "none": "",
            "attack": "SETTINGS.DualWeaponsModificator.attack",
            "defense": "SETTINGS.DualWeaponsModificator.defense"
        },
        default: "none",
        onChange: value => {
            console.log(value);
        }
    })
}

Hooks.once("init", () => {
    console.log("Yggdrasill | Initialisation du système Yggdrasill");

    //register Handlebars config
    CONFIG.yggdrasill = yggdrasill;
    CONFIG.Item.documentClass = yggdrasillItem;
    CONFIG.Actor.documentClass = yggdrasillActor;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("yggdrasill", YggdrasillItemSheet, {
        makeDefault: true
    });

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("yggdrasill", YggdrasillActorSheet, {
        makeDefault: true
    });

    // Register Handlebars helpers
    registerHandlebarsHelpers();
    preloadHandlebarsTemplates();

    registerSystemsSettings();
});

Hooks.on("renderChatLog", (app, html, data) => {
    Chat.addChatListeners(html);

    preloadHandlebarsTemplates();
});