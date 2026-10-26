import { createContext, useContext, useState, useEffect, useCallback } from "react";
import objectsData from "../pages/data/objects.json";
import { INVENTORY_SIZE, ITEMS_CATALOG } from "../pages/data/itemsData";

const InventoryContext = createContext(null);

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
    const [slots, setSlots] = useState(() => Array(INVENTORY_SIZE).fill(null));
    const [selectedSlot, setSelectedSlot] = useState(0);
    const [draggedSlot, setDraggedSlot] = useState(null);
    const [worldItems, setWorldItems] = useState([]);
    const [shakenTrees, setShakenTrees] = useState({});
    const [shakingTreeIndex, setShakingTreeIndex] = useState(null);
    const [keyTreeIndex] = useState(() => pickRandomKeyTreeIndex());
    const [chestUnlocked, setChestUnlocked] = useState(false);
    const [notification, setNotification] = useState(null);

    // Persistent state for FirstHouse across route navigation
    const [firstHouseState, setFirstHouseState] = useState({
        monsterPickedUp: false,
        soupPickedUp: false,
        coffeeSpilled: false,
        cleanedClothes: {}, // { shirt: true, pants: true, sock: true }
        rezeMovedRevealed: false,
        monsterGivenToReze: false,
        soupGivenToDonkey: false,
        donkeyQuestComplete: false,
        rezePlushPickedUp: false
    });

    // Visited locations tracking for tasks / checklist
    const [visitedLocations, setVisitedLocations] = useState(() => {
        try {
            const saved = localStorage.getItem("boboc_visited_locations");
            if (saved) return JSON.parse(saved);
        } catch {}
        return {
            firsthouse: false,
            secondhouse: false,
            tent: false,
            castle: false,
            hideout: false
        };
    });

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

        const emptyIdx = slots.findIndex((s) => s === null);
        if (emptyIdx === -1) {
            showNotification("Inventory is full (9/9)!", "warning");
            return false;
        }

        setSlots((prev) => {
            const idx = prev.findIndex((s) => s === null);
            if (idx === -1) return prev;
            const next = [...prev];
            next[idx] = createItemInstance(itemId);
            return next;
        });
        setSelectedSlot(emptyIdx);
        return true;
    }, [slots, showNotification]);

    const removeItemAtSlot = useCallback((slotIndex) => {
        setSlots((prev) => {
            if (slotIndex < 0 || slotIndex >= INVENTORY_SIZE || !prev[slotIndex]) {
                return prev;
            }
            const next = [...prev];
            next[slotIndex] = null;
            return next;
        });
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
    }, []);

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

        const emptyIdx = slots.findIndex((s) => s === null);
        if (emptyIdx === -1) {
            showNotification("Inventory is full (9/9)!", "warning");
            return false;
        }

        const nextSlots = [...slots];
        nextSlots[emptyIdx] = createItemInstance(target.itemId);
        setSlots(nextSlots);
        setWorldItems((prev) => prev.filter((w) => w.worldItemId !== worldItemId));
        setSelectedSlot(emptyIdx);
        showNotification(`Picked up ${template.name}!`, "success", template.icon);
        return true;
    }, [worldItems, slots, showNotification]);

    const interactItemWithWorldObject = useCallback((slotIndex, obj) => {
        const item = slots[slotIndex];
        if (!item || !obj) return false;

        if (obj.type === "chest" && item.itemId === "chest_key") {
            if (chestUnlocked) {
                showNotification("The Chest is already unlocked!", "info");
                return false;
            }
            setSlots((prev) => {
                const next = [...prev];
                next[slotIndex] = null;
                return next;
            });
            setChestUnlocked(true);
            showNotification("Unlocked the Chest with the Chest Key!", "success", item.icon);
            return true;
        }

        return false;
    }, [slots, chestUnlocked, showNotification]);

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
                firstHouseState,
                setFirstHouseState,
                visitedLocations,
                markLocationVisited,
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
