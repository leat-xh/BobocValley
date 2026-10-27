import goldenKnightImg from "./assets/golden_knight.svg";
import mechanicalKeycapImg from "./assets/mechanical_keycap.svg";
import strategistCrestImg from "./assets/strategist_crest.svg";

export const SANCTUM_QUOTE =
    "In chess, as in code, victory belongs to the one who sees three moves ahead while staying calm in the shadows.";

export const MEMORY_CARDS_DATA = [
    {
        pairId: "chess_knight",
        icon: "♞",
        title: "Sicilian Knight",
        subtitle: "Blitz Chess Tactics",
        accent: "#fbbf24"
    },
    {
        pairId: "dual_monitors",
        icon: "🖥️",
        title: "Dual Monitors",
        subtitle: "Clean Architecture",
        accent: "#38bdf8"
    },
    {
        pairId: "mech_keyboard",
        icon: "⌨️",
        title: "Custom Switches",
        subtitle: "Tactile Keyboards",
        accent: "#a855f7"
    },
    {
        pairId: "gym_dumbbells",
        icon: "🏋️",
        title: "Iron Discipline",
        subtitle: "Evening Gym Session",
        accent: "#f43f5e"
    },
    {
        pairId: "scifi_mecha",
        icon: "🚀",
        title: "Sci-Fi & Anime",
        subtitle: "Cyberpunk Lore",
        accent: "#10b981"
    },
    {
        pairId: "midnight_espresso",
        icon: "☕",
        title: "Double Espresso",
        subtitle: "2 AM Debugging Fuel",
        accent: "#f59e0b"
    }
];

export const JOURNAL_PAGES = [
    {
        id: "strategy",
        title: "Page I — The Art of the Board",
        heading: "Notes on the Sicilian Defense",
        entries: [
            "Every complex problem is a chessboard in disguise. Rushing an attack without fortification only invites a counter-strike.",
            "The Golden Knight remains the resident's prized piece—capable of leaping over obstacles that block every other piece on the board.",
            "Note to self: The spare Grandmaster's Golden Knight is tucked safely inside the floor compartment beneath the woven crimson rug."
        ],
        footerClue: "Clue #1: Drag the crimson floor rug aside to uncover what lies beneath."
    },
    {
        id: "routine",
        title: "Page II — Midnight Architecture",
        heading: "Clean Code & Iron Routine",
        entries: [
            "18:00 — Heavy dumbbells and compound lifts. A disciplined mind needs a strong foundation after hours at the desk.",
            "22:00 — Switch the sanctum to Midnight Cyber-UV mode. The dual monitors come alive and the custom mechanical keyboard clicks in rhythm.",
            "01:00 — One episode of classic sci-fi anime before refactoring the final module. No spaghetti code allowed in this fortress."
        ],
        footerClue: "Clue #2: Flip the UV Cyber Switch on the wall to reveal nocturnal secrets."
    }
];

export const TERMINAL_LOGS = [
    "[SYS-22:14] Dual-Monitor Battlestation online. Clean-code linter: 0 warnings, 0 errors.",
    "[CHESS-ENGINE] Opening book loaded: Sicilian Defense (Najdorf Variation) — Win rate: 78.4%.",
    "[WORKOUT-LOG] Evening gym session complete: PR achieved on weighted pull-ups & bench press.",
    "[MEDIA-QUEUE] Up next: Cyberpunk / Sci-Fi marathon & synthwave coding playlist.",
    "[SECURITY-NOTE] Backup Artisan Keycap stored on the neon shelf—visible only in Night/UV Mode."
];

export const DISTRACTION_AND_CLUE_POPUPS = {
    chessboard: {
        title: "Obsidian Chessboard",
        message:
            "An unfinished blitz match sits on polished obsidian. Black is playing the Sicilian Defense, poised for a royal fork—but the Golden Knight piece is missing from the board! Perhaps it slipped under the floor rug?",
        img: goldenKnightImg
    },
    chessboardComplete: {
        title: "The Grandmaster's Board",
        message:
            "You hold the Grandmaster's Golden Knight! This weighted piece is the resident's signature talisman—keep it in your inventory to return to its rightful owner in the Secret Hideout.",
        img: goldenKnightImg
    },
    dumbbells: {
        title: "Cast-Iron Dumbbells",
        message:
            "A pair of heavy cast-iron dumbbells racked with military precision. The owner of this room never skips an evening workout to clear his head between coding sprints.",
        img: null
    },
    bonsai: {
        title: "Geometric Cyber-Bonsai",
        message:
            "A meticulously pruned bonsai tree in a matte-black hexagonal pot. Even its branches follow a clean, balanced binary-tree structure. (Just a peaceful distraction—nothing hidden in the soil!)",
        img: null
    },
    bookshelf: {
        title: "Sci-Fi & Algorithms Shelf",
        message:
            "Hardcover volumes on clean software architecture, grandmaster chess endgames, and limited-edition sci-fi anime figures arranged in strict order. A bookmark reads: 'Measure twice, deploy once.'",
        img: null
    },
    keycapLocked: {
        title: "Dim Shelf Alcove",
        message:
            "There seems to be a small hardware case on the upper neon rack, but it's too dark to see clearly in normal lighting. Try flipping the Cyber-UV Wall Switch!",
        img: mechanicalKeycapImg
    },
    crestInfo: {
        title: "Strategist's Hologram Crest",
        message:
            "Earned by completing the Tactical Memory Matrix on the Dual-Monitor Battlestation.",
        img: strategistCrestImg
    }
};
