import iconKey from "../GameComponents/assets/ui/UI_TravelBook_IconKey.png";
import pickImg from "../TentComponents/assets/pick.png";
import ringImg from "../TentComponents/assets/ring.png";
import monsterImg from "../FirstHouseComponents/assets/monster_can.svg";
import soupImg from "../FirstHouseComponents/assets/soup_bowl.svg";
import waffleImg from "../FirstHouseComponents/assets/donkey_waffle.svg";
import rezePlushImg from "../FirstHouseComponents/assets/reze_plush.png";

export const INVENTORY_SIZE = 9;

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
        description: "A shiny ring found inside Victor's tent.",
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
    }
};
