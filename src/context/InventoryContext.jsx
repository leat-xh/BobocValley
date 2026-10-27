import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import objectsData from "../pages/data/objects.json";
import { INVENTORY_SIZE, ITEMS_CATALOG } from "../pages/data/itemsData";

const InventoryContext = createContext(null);

const STORAGE_KEY_STATE = "boboc_game_state_v2";

const INITIAL_FIRST_HOUSE_STATE = {
    monsterPickedUp: false,
    soupPickedUp: false,
    coffeeSpilled: false,
    cleanedClothes: {},
    rezeMovedRevealed: false,
    monsterGivenToReze: false,
    extraMonsterReceived: false,
    soupGivenToDonkey: false,
    donkeyQuestComplete: false,
    rezePlushPickedUp: false
};

const INITIAL_SECOND_HOUSE_STATE = {
    nightMode: false,
    rugMoved: false,
    knightPickedUp: false,
    keycapPickedUp: false,
    memoryWon: false,
    journalInspected: false,
    paintingInspected: false
};

const INITIAL_TENT_STATE = {
    ampOn: false,
    rhythmWon: false,
    ringPickedUp: false,
    pickPickedUp: false
};

const INITIAL_VISITED_LOCATIONS = {
    firsthouse: false,
    secondhouse: false,
    tent: false,
    castle: false,
    hideout: false
};

let instanceCounter = 0;
function createItemInstance(itemId) {
    const template = ITEMS_CATALOG[itemId];
    if (!template) return null;
    instanceCounter += 1;
    return {
        ...template,
        itemId: template.id,
        instanceId: `${template.id}_${Date.now()}_${instanceCounter}`
    };
}

function hydrateSavedSlots(rawSlots) {
    if (!Array.isArray(rawSlots)) {
        return Array(INVENTORY_SIZE).fill(null);
    }
    const hydrated = Array(INVENTORY_SIZE).fill(null);
    for (let i = 0; i < Math.min(rawSlots.length, INVENTORY_SIZE); i++) {
        const entry = rawSlots[i];
        if (entry?.itemId && ITEMS_CATALOG[entry.itemId]) {
            hydrated[i] = {
                ...ITEMS_CATALOG[entry.itemId],
                itemId: entry.itemId,
                instanceId: entry.instanceId || `${entry.itemId}_restored_${i}`
            };
        }
    }
    return hydrated;
}

function loadSavedGameState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_STATE);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function pickRandomKeyTreeIndex() {
    const reachableTrees = objectsData
        .map((obj, index) => ({ obj, index }))
        .filter(
            ({ obj }) =>
                obj.type === "tree" &&
                obj.pos.x >= 50 &&
                obj.pos.x <= 1500 &&
                obj.pos.y >= 40 &&
                obj.pos.y <= 780
        );

    const pool =
        reachableTrees.length > 0
            ? reachableTrees
            : objectsData
                  .map((obj, index) => ({ obj, index }))
                  .filter(({ obj }) => obj.type === "tree");

    const chosen = pool[Math.floor(Math.random() * pool.length)];
    return chosen ? chosen.index : -1;
}

export function InventoryProvider({ children }) {
    const [slots, setSlotsState] = useState(() =>
        hydrateSavedSlots(loadSavedGameState()?.slots)
    );
    const slotsRef = useRef(slots);

    const setSlots = useCallback((updater) => {
        setSlotsState((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            slotsRef.current = next;
            return next;
        });
    }, []);

    const [selectedSlot, setSelectedSlot] = useState(0);
    const [draggedSlot, setDraggedSlot] = useState(null);
    const [worldItems, setWorldItems] = useState([]);
    const [shakenTrees, setShakenTrees] = useState({});
    const [shakingTreeIndex, setShakingTreeIndex] = useState(null);
    const [keyTreeIndex] = useState(() => pickRandomKeyTreeIndex());
    const [chestUnlocked, setChestUnlocked] = useState(() =>
        Boolean(loadSavedGameState()?.chestUnlocked)
    );
    const [castleCompleted, setCastleCompleted] = useState(() =>
        Boolean(loadSavedGameState()?.castleCompleted)
    );
    const [notification, setNotification] = useState(null);

    // Persistent state for FirstHouse across route navigation
    const [firstHouseState, setFirstHouseState] = useState(() => ({
        ...INITIAL_FIRST_HOUSE_STATE,
        ...(loadSavedGameState()?.firstHouseState || {})
    }));

    // Persistent state for SecondHouse (Laurentiu's Sanctum) across route navigation
    const [secondHouseState, setSecondHouseState] = useState(() => ({
        ...INITIAL_SECOND_HOUSE_STATE,
        ...(loadSavedGameState()?.secondHouseState || {})
    }));

    // Persistent state for Victor's Tent across route navigation
    const [tentState, setTentState] = useState(() => ({
        ...INITIAL_TENT_STATE,
        ...(loadSavedGameState()?.tentState || {})
    }));

    // Visited locations tracking for tasks / checklist
    const [visitedLocations, setVisitedLocations] = useState(() => {
        try {
            const saved = localStorage.getItem("boboc_visited_locations");
            if (saved) return { ...INITIAL_VISITED_LOCATIONS, ...JSON.parse(saved) };
        } catch {}
        return { ...INITIAL_VISITED_LOCATIONS };
    });
    const [resetCounter, setResetCounter] = useState(0);

    const markLocationVisited = useCallback((key) => {
        setVisitedLocations((prev) => {
            if (prev[key]) return prev;
            const next = { ...prev, [key]: true };
            try {
                localStorage.setItem("boboc_visited_locations", JSON.stringify(next));
            } catch {}
            return next;
        });
    }, []);

    // Persist game state to localStorage
    useEffect(() => {
        try {
            const serializableSlots = slots.map((s) =>
                s ? { itemId: s.itemId, instanceId: s.instanceId } : null
            );
            localStorage.setItem(
                STORAGE_KEY_STATE,
                JSON.stringify({
                    slots: serializableSlots,
                    chestUnlocked,
                    castleCompleted,
                    firstHouseState,
                    secondHouseState,
                    tentState
                })
            );
        } catch {}
    }, [slots, chestUnlocked, castleCompleted, firstHouseState, secondHouseState, tentState]);

    // Clean up any old localStorage keys from previous version
    useEffect(() => {
        localStorage.removeItem("boboc_inventory_slots_v1");
        localStorage.removeItem("boboc_world_items_v1");
        localStorage.removeItem("boboc_object_states_v1");
    }, []);

    const showNotification = useCallback((text, type = "info", icon = null) => {
        setNotification({
            id: Date.now() + Math.random(),
            text,
            type,
            icon
        });
    }, []);

    useEffect(() => {
        if (!notification) return;
        const timer = setTimeout(() => {
            setNotification(null);
        }, 3200);
        return () => clearTimeout(timer);
    }, [notification]);

    const addItem = useCallback((itemId) => {
        const template = ITEMS_CATALOG[itemId];
        if (!template) return false;

        const currentSlots = slotsRef.current;
        const emptyIdx = currentSlots.findIndex((s) => s === null);
        if (emptyIdx === -1) {
            showNotification(`Inventory is full (${INVENTORY_SIZE}/${INVENTORY_SIZE})!`, "warning");
            return false;
        }

        const nextSlots = [...currentSlots];
        nextSlots[emptyIdx] = createItemInstance(itemId);
        slotsRef.current = nextSlots;
        setSlotsState(nextSlots);
        setSelectedSlot(emptyIdx);
        return true;
    }, [showNotification]);

    const removeItemAtSlot = useCallback((slotIndex) => {
        const currentSlots = slotsRef.current;
        if (slotIndex < 0 || slotIndex >= INVENTORY_SIZE || !currentSlots[slotIndex]) {
            return;
        }
        const nextSlots = [...currentSlots];
        nextSlots[slotIndex] = null;
        slotsRef.current = nextSlots;
        setSlotsState(nextSlots);
    }, []);

    const moveOrSwapSlots = useCallback((fromIndex, toIndex) => {
        if (
            fromIndex === null ||
            toIndex === null ||
            fromIndex === toIndex ||
            fromIndex < 0 ||
            fromIndex >= INVENTORY_SIZE ||
            toIndex < 0 ||
            toIndex >= INVENTORY_SIZE
        ) {
            return;
        }

        setSlots((prev) => {
            if (!prev[fromIndex]) return prev;
            const next = [...prev];
            const temp = next[toIndex];
            next[toIndex] = next[fromIndex];
            next[fromIndex] = temp;
            return next;
        });
        setSelectedSlot(toIndex);
    }, [setSlots]);

    const shakeTree = useCallback((treeIndex, treeObj) => {
        if (shakenTrees[treeIndex]) return;

        setShakingTreeIndex(treeIndex);
        setTimeout(() => {
            setShakingTreeIndex((prev) => (prev === treeIndex ? null : prev));
        }, 500);

        setShakenTrees((prev) => ({
            ...prev,
            [treeIndex]: true
        }));

        if (treeIndex === keyTreeIndex) {
            setWorldItems((prev) => [
                ...prev,
                {
                    worldItemId: `key_from_tree_${treeIndex}`,
                    itemId: "chest_key",
                    pos: {
                        x: treeObj.pos.x + 42,
                        y: treeObj.pos.y + 95
                    }
                }
            ]);
            showNotification(
                "The Chest Key fell out of the tree!",
                "success",
                ITEMS_CATALOG.chest_key.icon
            );
        } else {
            showNotification("Shook the tree... nothing fell out.", "info");
        }
    }, [shakenTrees, keyTreeIndex, showNotification]);

    const pickupWorldItem = useCallback((worldItemId) => {
        const target = worldItems.find((w) => w.worldItemId === worldItemId);
        if (!target) return false;

        const template = ITEMS_CATALOG[target.itemId];
        if (!template) return false;

        const currentSlots = slotsRef.current;
        const emptyIdx = currentSlots.findIndex((s) => s === null);
        if (emptyIdx === -1) {
            showNotification(`Inventory is full (${INVENTORY_SIZE}/${INVENTORY_SIZE})!`, "warning");
            return false;
        }

        const nextSlots = [...currentSlots];
        nextSlots[emptyIdx] = createItemInstance(target.itemId);
        slotsRef.current = nextSlots;
        setSlotsState(nextSlots);
        setWorldItems((prev) => prev.filter((w) => w.worldItemId !== worldItemId));
        setSelectedSlot(emptyIdx);
        showNotification(`Picked up ${template.name}!`, "success", template.icon);
        return true;
    }, [worldItems, showNotification]);

    const interactItemWithWorldObject = useCallback((slotIndex, obj) => {
        const currentSlots = slotsRef.current;
        const item = currentSlots[slotIndex];
        if (!item || !obj) return false;

        if (obj.type === "chest" && item.itemId === "chest_key") {
            if (chestUnlocked) {
                showNotification("The Chest is already unlocked!", "info");
                return false;
            }
            const nextSlots = [...currentSlots];
            nextSlots[slotIndex] = createItemInstance("motto_note");
            slotsRef.current = nextSlots;
            setSlotsState(nextSlots);
            setChestUnlocked(true);
            showNotification(
                "Unlocked the Chest! Found Motto Note: 'One prompt at a time'!",
                "success",
                ITEMS_CATALOG.motto_note.icon
            );
            return true;
        }

        return false;
    }, [chestUnlocked, showNotification]);

    const resetAllProgress = useCallback(() => {
        const emptySlots = Array(INVENTORY_SIZE).fill(null);
        slotsRef.current = emptySlots;
        setSlotsState(emptySlots);
        setSelectedSlot(0);
        setDraggedSlot(null);
        setWorldItems([]);
        setShakenTrees({});
        setShakingTreeIndex(null);
        setChestUnlocked(false);
        setCastleCompleted(false);
        setFirstHouseState({ ...INITIAL_FIRST_HOUSE_STATE });
        setSecondHouseState({ ...INITIAL_SECOND_HOUSE_STATE });
        setTentState({ ...INITIAL_TENT_STATE });
        setVisitedLocations({ ...INITIAL_VISITED_LOCATIONS });
        try {
            localStorage.removeItem("boboc_visited_locations");
            localStorage.removeItem("playerPos");
            localStorage.removeItem(STORAGE_KEY_STATE);
            localStorage.removeItem("boboc_hideout_delivered_v2");
        } catch {}
        setResetCounter((c) => c + 1);
        showNotification("Game restarted! Welcome back to Boboc Valley.", "info");
    }, [showNotification]);

    const draggedItem = draggedSlot !== null ? slots[draggedSlot] : null;

    return (
        <InventoryContext.Provider
            value={{
                slots,
                selectedSlot,
                setSelectedSlot,
                draggedSlot,
                setDraggedSlot,
                draggedItem,
                worldItems,
                shakenTrees,
                shakingTreeIndex,
                chestUnlocked,
                castleCompleted,
                setCastleCompleted,
                firstHouseState,
                setFirstHouseState,
                secondHouseState,
                setSecondHouseState,
                tentState,
                setTentState,
                visitedLocations,
                markLocationVisited,
                resetAllProgress,
                resetCounter,
                notification,
                showNotification,
                addItem,
                removeItemAtSlot,
                moveOrSwapSlots,
                shakeTree,
                pickupWorldItem,
                interactItemWithWorldObject
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
}

export function useInventory() {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error("useInventory must be used within an InventoryProvider");
    }
    return context;
}
