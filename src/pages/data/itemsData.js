import iconKey from "../GameComponents/assets/ui/UI_TravelBook_IconKey.png";
import mottoNoteImg from "../GameComponents/assets/ui/motto_note.svg";
import pickImg from "../TentComponents/assets/pick.png";
import ringImg from "../TentComponents/assets/ring.png";
import monsterImg from "../FirstHouseComponents/assets/monster_can.svg";
import soupImg from "../FirstHouseComponents/assets/soup_bowl.svg";
import waffleImg from "../FirstHouseComponents/assets/donkey_waffle.svg";
import rezePlushImg from "../FirstHouseComponents/assets/reze_plush.png";
import rockstarImg from "../TentComponents/assets/rockstar.png";
import goldenKnightImg from "../SecondHouseComponents/assets/golden_knight.svg";
import mechanicalKeycapImg from "../SecondHouseComponents/assets/mechanical_keycap.svg";
import strategistCrestImg from "../SecondHouseComponents/assets/strategist_crest.svg";

export const INVENTORY_SIZE = 12;

export const ITEMS_CATALOG = {
    chest_key: {
        id: "chest_key",
        name: "Chest Key",
        description: "An old brass key.",
        icon: iconKey,
        usableOn: ["chest"]
    },
    guitar_pick: {
        id: "guitar_pick",
        name: "Guitar Pick",
        description: "A red Jazz III guitar pick.",
        icon: pickImg,
        usableOn: ["guitar"]
    },
    suspicious_ring: {
        id: "suspicious_ring",
        name: "Suspicious Ring",
        description: "A shiny ring that turns you invisible",
        icon: ringImg,
        usableOn: []
    },
    monster_energy: {
        id: "monster_energy",
        name: "Monster Energy",
        description: "An ice-cold can of Monster Energy.",
        icon: monsterImg,
        usableOn: ["reze_plush"]
    },
    swamp_soup: {
        id: "swamp_soup",
        name: "Swamp Soup",
        description: "A steaming bowl of homemade soup.",
        icon: soupImg,
        usableOn: ["donkey"]
    },
    donkey_waffle: {
        id: "donkey_waffle",
        name: "Donkey's Golden Waffle",
        description: "A crispy golden waffle from Donkey.",
        icon: waffleImg,
        usableOn: []
    },
    reze_plushie: {
        id: "reze_plushie",
        name: "Reze Plushie",
        description: "A cute Reze plushie.",
        icon: rezePlushImg,
        usableOn: []
    },
    star_shaped_rock: {
        id: "star_shaped_rock",
        name: "Star-shaped Rock",
        description: "A precious stone obtained by completing the rhythm mini-game",
        icon: rockstarImg,
        usableOn: []
    },
    golden_knight: {
        id: "golden_knight",
        name: "Grandmaster's Knight",
        description: "A weighted gold chess knight prized for the Sicilian Defense.",
        icon: goldenKnightImg,
        usableOn: ["chessboard"]
    },
    mechanical_keycap: {
        id: "mechanical_keycap",
        name: "Artisan Keycap",
        description: "A custom neon-lit mechanical keycap for midnight coding.",
        icon: mechanicalKeycapImg,
        usableOn: ["battlestation"]
    },
    strategist_crest: {
        id: "strategist_crest",
        name: "Strategist's Crest",
        description: "A holographic mind crest earned by mastering the Memory Matrix.",
        icon: strategistCrestImg,
        usableOn: []
    },
    motto_note: {
        id: "motto_note",
        name: "Motto Note",
        description: 'Our sacred team motto: "One prompt at a time"',
        icon: mottoNoteImg,
        usableOn: ["stefan"]
    }
};
