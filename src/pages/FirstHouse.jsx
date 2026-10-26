import { useState, useRef, useEffect } from "react";
import LeaveButton from "./Components/LeaveButton";
import { useInventory } from "../context/InventoryContext";

import entranceBg from "./FirstHouseComponents/assets/entrance.webp";
import diningBg from "./FirstHouseComponents/assets/dining.webp";
import bedroomBg from "./FirstHouseComponents/assets/bedroom.jpg";
import rezePlushImg from "./FirstHouseComponents/assets/reze_plush.png";
import monsterImg from "./FirstHouseComponents/assets/monster_can.svg";
import soupImg from "./FirstHouseComponents/assets/soup_bowl.svg";
import coffeeMugImg from "./FirstHouseComponents/assets/coffee_mug.svg";
import waffleImg from "./FirstHouseComponents/assets/donkey_waffle.svg";

// ============================================================================
// EDIT ITEM POSITIONS HERE:
// Every item is centered at its { x, y } pixel coordinate (or { left, top })
// ============================================================================
const ITEM_POSITIONS = {
    // Room 1: Entrance
    donkeyHitbox: { left: "41%", top: "26%", width: "21%", height: "60%" },
    clothesEntrance: { left: "68%", top: "78%" },

    // Room 2: Dining Room
    coffeeMugStart: { x: 542, y: 584 },
    swampSoup: { x: 923, y: 760 },
    monsterCan: { x: 1191, y: 665 },
    clothesDining: { x: 618, y: 796 },

    // Room 3: Bedroom
    rezePlushStart: { x: 957, y: 604 },
    // The hidden number always sits exactly under Reze's starting spot
    bedNumberClue: { x: 957, y: 604 },
    clothesBedroom: { left: "26%", top: "79%" }
};

const ROOMS = [
    { id: "entrance", name: "1. Entrance", bg: entranceBg },
    { id: "dining", name: "2. Dining Room", bg: diningBg },
    { id: "bedroom", name: "3. Bedroom", bg: bedroomBg }
];

const SECRET_CODE = "4729";

const CLOTHES_ITEMS = [
    {
        id: "shirt",
        room: "entrance",
        pos: ITEM_POSITIONS.clothesEntrance,
        color: "#5b7cfa"
    },
    {
        id: "pants",
        room: "dining",
        pos: ITEM_POSITIONS.clothesDining,
        color: "#c95b42"
    },
    {
        id: "sock",
        room: "bedroom",
        pos: ITEM_POSITIONS.clothesBedroom,
        color: "#845ef7"
    }
];

// Prioritize exact x / y pixel coordinates over percentages
function resolveLeft(pos) {
    if (typeof pos?.x === "number") return pos.x;
    return pos?.left ?? 0;
}
function resolveTop(pos) {
    if (typeof pos?.y === "number") return pos.y;
    return pos?.top ?? 0;
}

export default function FirstHouse() {
    const {
        slots,
        draggedSlot,
        setDraggedSlot,
        addItem,
        removeItemAtSlot,
        firstHouseState,
        setFirstHouseState,
        markLocationVisited,
        showNotification
    } = useInventory();

    useEffect(() => {
        markLocationVisited("firsthouse");
    }, [markLocationVisited]);

    const [roomIdx, setRoomIdx] = useState(0);
    const [housePopup, setHousePopup] = useState(null);
    const [donkeyModalOpen, setDonkeyModalOpen] = useState(false);
    const [codeInput, setCodeInput] = useState("");
    const [showCoordHelper, setShowCoordHelper] = useState(false);
    const [cursorCoords, setCursorCoords] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.target.tagName === "INPUT") return;
            if (e.key.toLowerCase() === "p") {
                setShowCoordHelper((prev) => !prev);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    // Reze plushie position on the bed (in Bedroom)
    const [rezePos, setRezePos] = useState(() => ({
        x: resolveLeft(ITEM_POSITIONS.rezePlushStart),
        y: resolveTop(ITEM_POSITIONS.rezePlushStart)
    }));
    const [rezeHeld, setRezeHeld] = useState(false);
    const rezeDragOffset = useRef({ x: 0, y: 0 });
    const rezePointerStart = useRef({ x: 0, y: 0 });

    // Coffee mug drag position on dining table (in Dining Room)
    const [coffeePos, setCoffeePos] = useState(() => ({
        x: resolveLeft(ITEM_POSITIONS.coffeeMugStart),
        y: resolveTop(ITEM_POSITIONS.coffeeMugStart)
    }));
    const [coffeeHeld, setCoffeeHeld] = useState(false);
    const coffeeDragOffset = useRef({ x: 0, y: 0 });

    // Keep state synced whenever ITEM_POSITIONS is edited in code
    useEffect(() => {
        setRezePos({
            x: resolveLeft(ITEM_POSITIONS.rezePlushStart),
            y: resolveTop(ITEM_POSITIONS.rezePlushStart)
        });
    }, [ITEM_POSITIONS.rezePlushStart.x, ITEM_POSITIONS.rezePlushStart.y, ITEM_POSITIONS.rezePlushStart.left, ITEM_POSITIONS.rezePlushStart.top]);

    useEffect(() => {
        setCoffeePos({
            x: resolveLeft(ITEM_POSITIONS.coffeeMugStart),
            y: resolveTop(ITEM_POSITIONS.coffeeMugStart)
        });
    }, [ITEM_POSITIONS.coffeeMugStart.x, ITEM_POSITIONS.coffeeMugStart.y, ITEM_POSITIONS.coffeeMugStart.left, ITEM_POSITIONS.coffeeMugStart.top]);

    const currentRoom = ROOMS[roomIdx];

    const cleanedCount = Object.keys(firstHouseState.cleanedClothes || {}).length;
    const allClothesCleaned = cleanedCount >= CLOTHES_ITEMS.length;

    const handleCleanClothes = (cloth) => {
        if (firstHouseState.cleanedClothes?.[cloth.id]) return;

        const nextCleaned = {
            ...(firstHouseState.cleanedClothes || {}),
            [cloth.id]: true
        };
        const nextCount = Object.keys(nextCleaned).length;

        setFirstHouseState((prev) => ({
            ...prev,
            cleanedClothes: nextCleaned
        }));

        if (nextCount >= CLOTHES_ITEMS.length) {
            setHousePopup({
                title: "All Clothes Cleaned Up!",
                message: "You found a number underneath: 2",
                badgeNumber: "2"
            });
        }
    };

    const triggerSpillCoffee = () => {
        if (firstHouseState.coffeeSpilled) return;
        setFirstHouseState((prev) => ({
            ...prev,
            coffeeSpilled: true
        }));
        setHousePopup({
            title: "Coffee Spilled!",
            message: "A number appeared in the spilled coffee: 7",
            img: coffeeMugImg,
            badgeNumber: "7"
        });
    };

    const handleGiveMonsterToReze = (slotIdx) => {
        const activeSlot =
            slotIdx !== null && !Number.isNaN(slotIdx) ? slotIdx : draggedSlot;
        const item = activeSlot !== null ? slots[activeSlot] : null;
        setDraggedSlot(null);

        if (!item || item.itemId !== "monster_energy") {
            return;
        }

        removeItemAtSlot(activeSlot);
        setFirstHouseState((prev) => ({
            ...prev,
            monsterGivenToReze: true
        }));
        setHousePopup({
            title: "Reze Plushie",
            message: "Reze gives you a number: 9",
            img: rezePlushImg,
            badgeNumber: "9"
        });
    };

    const handleDropOnDonkey = (slotIdx) => {
        const activeSlot =
            slotIdx !== null && !Number.isNaN(slotIdx) ? slotIdx : draggedSlot;
        const item = activeSlot !== null ? slots[activeSlot] : null;
        setDraggedSlot(null);

        if (item && item.itemId === "swamp_soup") {
            removeItemAtSlot(activeSlot);
            setFirstHouseState((prev) => ({
                ...prev,
                soupGivenToDonkey: true
            }));
            setDonkeyModalOpen(true);
            showNotification("Gave Swamp Soup to Donkey!", "success");
        } else {
            setDonkeyModalOpen(true);
        }
    };

    const handleGiveSoupButton = () => {
        const soupSlotIdx = slots.findIndex((s) => s?.itemId === "swamp_soup");
        if (soupSlotIdx === -1) {
            showNotification("You don't have any soup!", "warning");
            return;
        }
        removeItemAtSlot(soupSlotIdx);
        setFirstHouseState((prev) => ({
            ...prev,
            soupGivenToDonkey: true
        }));
        showNotification("Gave Swamp Soup to Donkey!", "success");
    };

    const handleSubmitDonkeyQuest = (e) => {
        e.preventDefault();
        if (!firstHouseState.soupGivenToDonkey) {
            const soupSlotIdx = slots.findIndex((s) => s?.itemId === "swamp_soup");
            if (soupSlotIdx !== -1) {
                removeItemAtSlot(soupSlotIdx);
                setFirstHouseState((prev) => ({
                    ...prev,
                    soupGivenToDonkey: true
                }));
            } else {
                showNotification("Donkey is still hungry!", "warning");
                return;
            }
        }

        const trimmed = codeInput.replace(/\s+/g, "");
        if (trimmed !== SECRET_CODE) {
            showNotification("Wrong numbers!", "warning");
            return;
        }

        if (firstHouseState.donkeyQuestComplete) {
            return;
        }

        if (!addItem("donkey_waffle")) {
            return;
        }

        setFirstHouseState((prev) => ({
            ...prev,
            donkeyQuestComplete: true
        }));
        setDonkeyModalOpen(false);
        setHousePopup({
            title: "Donkey's Reward!",
            message: "Donkey gave you Donkey's Golden Waffle!",
            img: waffleImg
        });
    };

    return (
        <div
            onMouseMove={(e) => {
                if (!showCoordHelper) return;
                setCursorCoords({
                    x: Math.round(e.clientX),
                    y: Math.round(e.clientY)
                });
            }}
            onClick={(e) => {
                if (!showCoordHelper) return;
                const x = Math.round(e.clientX);
                const y = Math.round(e.clientY);
                const snippet = `{ x: ${x}, y: ${y} }`;
                navigator.clipboard?.writeText(snippet);
                showNotification(`Copied: ${snippet}`, "info");
            }}
            style={{
                position: "relative",
                backgroundImage: `url(${currentRoom.bg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                backgroundSize: "cover",
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                userSelect: "none",
                fontFamily: "'VT323', monospace"
            }}
        >
            <LeaveButton />

            {showCoordHelper && (
                <div
                    style={{
                        position: "fixed",
                        top: 70,
                        left: 24,
                        zIndex: 1600,
                        background: "rgba(0, 0, 0, 0.85)",
                        color: "#39ff14",
                        border: "2px solid #39ff14",
                        borderRadius: 6,
                        padding: "8px 12px",
                        fontSize: 18,
                        pointerEvents: "none"
                    }}
                >
                    <div>
                        <strong>Placement Mode (Press P to hide)</strong>
                    </div>
                    <div>
                        <code>{`{ x: ${cursorCoords.x}, y: ${cursorCoords.y} }`}</code>
                    </div>
                    <div style={{ color: "#ffd8a8", fontSize: 15 }}>
                        Click anywhere to copy {"{ x, y }"} (items center on the clicked point)
                    </div>
                </div>
            )}

            {/* Top Clues Bar */}
            <div
                style={{
                    position: "fixed",
                    top: 18,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 900,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    background: "rgba(42, 24, 18, 0.9)",
                    border: "3px solid #ffd071",
                    borderRadius: 8,
                    padding: "6px 18px",
                    color: "#ffd8a8",
                    fontSize: 20,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.55)"
                }}
            >
                <span style={{ color: "#ffd071", fontWeight: "bold" }}>
                    {currentRoom.name}
                </span>
                <span>|</span>
                <span>
                    Clues:{" "}
                    <strong style={{ color: "#fff" }}>
                        #1: {firstHouseState.rezeMovedRevealed ? "4" : "?"}
                    </strong>{" "}
                    ·{" "}
                    <strong style={{ color: "#fff" }}>
                        #2: {firstHouseState.coffeeSpilled ? "7" : "?"}
                    </strong>{" "}
                    ·{" "}
                    <strong style={{ color: "#fff" }}>
                        #3: {allClothesCleaned ? "2" : "?"}
                    </strong>{" "}
                    ·{" "}
                    <strong style={{ color: "#fff" }}>
                        #4: {firstHouseState.monsterGivenToReze ? "9" : "?"}
                    </strong>
                </span>
            </div>

            {/* Left / Right Clickable Room Navigation Arrows */}
            {roomIdx > 0 && (
                <button
                    type="button"
                    onClick={() => setRoomIdx((prev) => prev - 1)}
                    style={navArrowStyle("left")}
                >
                    ← {ROOMS[roomIdx - 1].name}
                </button>
            )}
            {roomIdx < ROOMS.length - 1 && (
                <button
                    type="button"
                    onClick={() => setRoomIdx((prev) => prev + 1)}
                    style={navArrowStyle("right")}
                >
                    {ROOMS[roomIdx + 1].name} →
                </button>
            )}

            {/* Bottom Room Switcher Tabs */}
            <div
                style={{
                    position: "fixed",
                    bottom: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 900,
                    display: "flex",
                    gap: 10
                }}
            >
                {ROOMS.map((r, idx) => (
                    <button
                        key={r.id}
                        type="button"
                        onClick={() => setRoomIdx(idx)}
                        style={{
                            padding: "8px 18px",
                            fontFamily: "'VT323', monospace",
                            fontSize: 20,
                            fontWeight: "bold",
                            cursor: "pointer",
                            borderRadius: 6,
                            border:
                                idx === roomIdx
                                    ? "3px solid #ffd071"
                                    : "2px solid #5c3a21",
                            background: idx === roomIdx ? "#8f323b" : "#ffd8a8",
                            color: idx === roomIdx ? "#fff" : "#493333",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.45)"
                        }}
                    >
                        {r.name}
                    </button>
                ))}
            </div>

            {/* Random Clothes in current room */}
            {CLOTHES_ITEMS.filter(
                (c) =>
                    c.room === currentRoom.id &&
                    !firstHouseState.cleanedClothes?.[c.id]
            ).map((cloth) => (
                <div
                    key={cloth.id}
                    onClick={() => handleCleanClothes(cloth)}
                    style={{
                        position: "absolute",
                        left: resolveLeft(cloth.pos),
                        top: resolveTop(cloth.pos),
                        transform: "translate(-50%, -50%)",
                        cursor: "pointer",
                        zIndex: 25
                    }}
                >
                    <svg width="86" height="64" viewBox="0 0 86 64">
                        <path
                            d="M12 36 C10 20, 28 14, 42 18 C58 12, 76 22, 74 38 C78 50, 58 56, 42 54 C24 56, 8 48, 12 36 Z"
                            fill={cloth.color}
                            stroke="#2b1b12"
                            strokeWidth="3"
                        />
                        <path
                            d="M26 28 Q42 36 58 26 M28 42 Q44 34 60 44"
                            stroke="rgba(255,255,255,0.45)"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            ))}

            {/* ==================== ROOM 1: ENTRANCE (DONKEY) ==================== */}
            {currentRoom.id === "entrance" && (
                <div
                    onClick={() => setDonkeyModalOpen(true)}
                    onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        const rawSlot = e.dataTransfer.getData("text/plain");
                        handleDropOnDonkey(
                            rawSlot !== "" ? parseInt(rawSlot, 10) : null
                        );
                    }}
                    style={{
                        position: "absolute",
                        left: resolveLeft(ITEM_POSITIONS.donkeyHitbox),
                        top: resolveTop(ITEM_POSITIONS.donkeyHitbox),
                        width: ITEM_POSITIONS.donkeyHitbox.width,
                        height: ITEM_POSITIONS.donkeyHitbox.height,
                        cursor: "pointer",
                        zIndex: 20
                    }}
                />
            )}

            {/* ==================== ROOM 2: DINING ROOM ==================== */}
            {currentRoom.id === "dining" && (
                <>
                    {/* Coffee on Dining Table */}
                    {!firstHouseState.coffeeSpilled ? (
                        <div
                            style={{
                                position: "absolute",
                                left: coffeePos.x,
                                top: coffeePos.y,
                                transform: "translate(-50%, -50%)",
                                width: 70,
                                height: 70,
                                cursor: coffeeHeld ? "grabbing" : "grab",
                                touchAction: "none",
                                userSelect: "none",
                                zIndex: 30
                            }}
                            onClick={triggerSpillCoffee}
                            onPointerDown={(e) => {
                                e.preventDefault();
                                setCoffeeHeld(true);
                                e.currentTarget.setPointerCapture(e.pointerId);
                                coffeeDragOffset.current = {
                                    x: e.clientX - coffeePos.x,
                                    y: e.clientY - coffeePos.y
                                };
                            }}
                            onPointerMove={(e) => {
                                if (
                                    !coffeeHeld &&
                                    !e.currentTarget.hasPointerCapture(e.pointerId)
                                )
                                    return;
                                setCoffeePos({
                                    x: e.clientX - coffeeDragOffset.current.x,
                                    y: e.clientY - coffeeDragOffset.current.y
                                });
                            }}
                            onPointerUp={(e) => {
                                if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                                    e.currentTarget.releasePointerCapture(e.pointerId);
                                }
                                setCoffeeHeld(false);
                                triggerSpillCoffee();
                            }}
                        >
                            <img
                                src={coffeeMugImg}
                                alt="Coffee"
                                style={{ width: 68, height: 68, pointerEvents: "none" }}
                            />
                        </div>
                    ) : (
                        <div
                            onClick={() =>
                                setHousePopup({
                                    title: "Spilled Coffee",
                                    message: "Number: 7",
                                    img: coffeeMugImg,
                                    badgeNumber: "7"
                                })
                            }
                            style={{
                                position: "absolute",
                                left: coffeePos.x,
                                top: coffeePos.y,
                                transform: "translate(-50%, -50%)",
                                cursor: "pointer",
                                zIndex: 30,
                                display: "flex",
                                alignItems: "center",
                                gap: 8
                            }}
                        >
                            <img
                                src={coffeeMugImg}
                                alt="Spilled Mug"
                                style={{
                                    width: 58,
                                    height: 58,
                                    transform: "rotate(78deg)"
                                }}
                            />
                            <div
                                style={{
                                    width: 110,
                                    height: 54,
                                    background: "rgba(58, 30, 14, 0.92)",
                                    border: "2px solid #8a5229",
                                    borderRadius: "55% 45% 60% 40%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#ffd071",
                                    fontSize: 34,
                                    fontWeight: "bold",
                                    textShadow: "0 2px 4px #000"
                                }}
                            >
                                7
                            </div>
                        </div>
                    )}

                    {/* Swamp Soup on Dining Table */}
                    {!firstHouseState.soupPickedUp && (
                        <div
                            onClick={() => {
                                if (addItem("swamp_soup")) {
                                    setFirstHouseState((prev) => ({
                                        ...prev,
                                        soupPickedUp: true
                                    }));
                                    setHousePopup({
                                        title: "Swamp Soup",
                                        message: "Picked up Swamp Soup.",
                                        img: soupImg
                                    });
                                }
                            }}
                            style={{
                                position: "absolute",
                                left: resolveLeft(ITEM_POSITIONS.swampSoup),
                                top: resolveTop(ITEM_POSITIONS.swampSoup),
                                transform: "translate(-50%, -50%)",
                                cursor: "pointer",
                                zIndex: 28
                            }}
                        >
                            <img
                                src={soupImg}
                                alt="Soup"
                                style={{ width: 76, height: 64 }}
                            />
                        </div>
                    )}

                    {/* Monster Energy Can in Dining Room */}
                    {!firstHouseState.monsterPickedUp && (
                        <div
                            onClick={() => {
                                if (addItem("monster_energy")) {
                                    setFirstHouseState((prev) => ({
                                        ...prev,
                                        monsterPickedUp: true
                                    }));
                                    setHousePopup({
                                        title: "Monster Energy",
                                        message: "Picked up Monster Energy.",
                                        img: monsterImg
                                    });
                                }
                            }}
                            style={{
                                position: "absolute",
                                left: resolveLeft(ITEM_POSITIONS.monsterCan),
                                top: resolveTop(ITEM_POSITIONS.monsterCan),
                                transform: "translate(-50%, -50%)",
                                cursor: "pointer",
                                zIndex: 28
                            }}
                        >
                            <img
                                src={monsterImg}
                                alt="Monster"
                                style={{ width: 52, height: 74 }}
                            />
                        </div>
                    )}
                </>
            )}

            {/* ==================== ROOM 3: BEDROOM (REZE PLUSHIE) ==================== */}
            {currentRoom.id === "bedroom" && (
                <>
                    {/* Secret Number #1 underneath Reze Plushie's starting position on the bed.
                        Only rendered once Reze has been moved off it, so it's fully hidden until then. */}
                    {(firstHouseState.rezePlushPickedUp ||
                        Math.hypot(
                            rezePos.x - resolveLeft(ITEM_POSITIONS.rezePlushStart),
                            rezePos.y - resolveTop(ITEM_POSITIONS.rezePlushStart)
                        ) > 45) && (
                    <div
                        onClick={() => {
                            setHousePopup({
                                title: "Found a Number",
                                message: "Number: 4",
                                badgeNumber: "4"
                            });
                        }}
                        style={{
                            position: "absolute",
                            left: resolveLeft(ITEM_POSITIONS.bedNumberClue),
                            top: resolveTop(ITEM_POSITIONS.bedNumberClue),
                            transform: "translate(-50%, -50%)",
                            width: 58,
                            height: 44,
                            background: "#ffd8a8",
                            border: "2px solid #493333",
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 30,
                            fontWeight: "bold",
                            color: "#8f323b",
                            cursor: "pointer",
                            zIndex: 15,
                            boxShadow: "0 3px 8px rgba(0,0,0,0.45)"
                        }}
                    >
                        4
                    </div>
                    )}

                    {/* Reze Plushie on the Bed */}
                    {!firstHouseState.rezePlushPickedUp && (
                        <div
                            style={{
                                position: "absolute",
                                left: rezePos.x,
                                top: rezePos.y,
                                transform: "translate(-50%, -50%)",
                                width: 120,
                                height: 145,
                                cursor: rezeHeld ? "grabbing" : "grab",
                                touchAction: "none",
                                userSelect: "none",
                                zIndex: 25,
                                filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.55))"
                            }}
                            draggable={false}
                            onDoubleClick={() => {
                                setRezeHeld(false);
                                setRezePos({
                                    x: resolveLeft(ITEM_POSITIONS.rezePlushStart),
                                    y: resolveTop(ITEM_POSITIONS.rezePlushStart)
                                });
                                showNotification(
                                    "The Donkey yells to put the Reze Plushie back!",
                                    "warning",
                                    rezePlushImg
                                );
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = "move";
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                const rawSlot = e.dataTransfer.getData("text/plain");
                                handleGiveMonsterToReze(
                                    rawSlot !== "" ? parseInt(rawSlot, 10) : null
                                );
                            }}
                            onPointerDown={(e) => {
                                e.preventDefault();
                                setRezeHeld(true);
                                e.currentTarget.setPointerCapture(e.pointerId);
                                rezePointerStart.current = {
                                    x: e.clientX,
                                    y: e.clientY
                                };
                                rezeDragOffset.current = {
                                    x: e.clientX - rezePos.x,
                                    y: e.clientY - rezePos.y
                                };
                            }}
                            onPointerMove={(e) => {
                                if (
                                    !rezeHeld &&
                                    !e.currentTarget.hasPointerCapture(e.pointerId)
                                )
                                    return;
                                const nextX = e.clientX - rezeDragOffset.current.x;
                                const nextY = e.clientY - rezeDragOffset.current.y;
                                setRezePos({ x: nextX, y: nextY });

                                if (
                                    !firstHouseState.rezeMovedRevealed &&
                                    Math.hypot(
                                        nextX - resolveLeft(ITEM_POSITIONS.rezePlushStart),
                                        nextY - resolveTop(ITEM_POSITIONS.rezePlushStart)
                                    ) > 45
                                ) {
                                    setFirstHouseState((prev) => ({
                                        ...prev,
                                        rezeMovedRevealed: true
                                    }));
                                }
                            }}
                            onPointerUp={(e) => {
                                setRezeHeld(false);
                                if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                                    e.currentTarget.releasePointerCapture(e.pointerId);
                                }
                                const movedDist = Math.hypot(
                                    e.clientX - rezePointerStart.current.x,
                                    e.clientY - rezePointerStart.current.y
                                );
                                if (
                                    movedDist < 8 &&
                                    firstHouseState.donkeyQuestComplete
                                ) {
                                    if (addItem("reze_plushie")) {
                                        setFirstHouseState((prev) => ({
                                            ...prev,
                                            rezePlushPickedUp: true
                                        }));
                                        setHousePopup({
                                            title: "Reze Plushie",
                                            message: "Picked up the Reze Plushie!",
                                            img: rezePlushImg
                                        });
                                    }
                                }
                            }}
                            onPointerCancel={() => setRezeHeld(false)}
                        >
                            <img
                                src={rezePlushImg}
                                alt="Reze Plushie"
                                draggable={false}
                                style={{
                                    width: 120,
                                    height: 145,
                                    objectFit: "contain",
                                    pointerEvents: "none"
                                }}
                            />
                        </div>
                    )}
                </>
            )}

            {/* ==================== DONKEY INTERACTION MODAL ==================== */}
            {donkeyModalOpen && (
                <div
                    className="tb-popup-overlay"
                    onClick={() => setDonkeyModalOpen(false)}
                >
                    <div
                        className="tb-popup-card"
                        style={{ width: 390 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="tb-popup-inner">
                            <div className="tb-popup-title">Donkey</div>

                            <div
                                style={{
                                    width: "100%",
                                    background: "#f3c78e",
                                    border: "2px solid #493333",
                                    padding: "8px 10px",
                                    fontSize: 18,
                                    textAlign: "center"
                                }}
                            >
                                <div>
                                    Soup:{" "}
                                    <strong>
                                        {firstHouseState.soupGivenToDonkey
                                            ? "✅ Given"
                                            : "❌ Not given"}
                                    </strong>
                                </div>
                                {!firstHouseState.soupGivenToDonkey && (
                                    <button
                                        type="button"
                                        className="tb-shake-btn"
                                        style={{ marginTop: 6 }}
                                        onClick={handleGiveSoupButton}
                                    >
                                        Give Soup
                                    </button>
                                )}
                            </div>

                            <form
                                onSubmit={handleSubmitDonkeyQuest}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 8,
                                    width: "100%"
                                }}
                            >
                                <label style={{ fontSize: 18, fontWeight: "bold" }}>
                                    Enter the 4 Numbers:
                                </label>
                                <input
                                    type="text"
                                    maxLength={4}
                                    value={codeInput}
                                    onChange={(e) => setCodeInput(e.target.value)}
                                    placeholder="____"
                                    style={{
                                        width: 140,
                                        textAlign: "center",
                                        fontFamily: "'VT323', monospace",
                                        fontSize: 28,
                                        padding: "4px 8px",
                                        border: "2px solid #493333",
                                        background: "#fff5e4",
                                        color: "#3a2020"
                                    }}
                                />
                                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                                    <button type="submit" className="tb-popup-btn">
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        className="tb-popup-btn"
                                        onClick={() => setDonkeyModalOpen(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== TRAVELBOOK POPUP MODAL ==================== */}
            {housePopup && (
                <div
                    className="tb-popup-overlay"
                    onClick={() => setHousePopup(null)}
                >
                    <div
                        className="tb-popup-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="tb-popup-inner">
                            {housePopup.img && (
                                <img
                                    src={housePopup.img}
                                    alt={housePopup.title}
                                    className="tb-popup-img"
                                />
                            )}
                            {housePopup.badgeNumber && (
                                <div
                                    style={{
                                        fontSize: 42,
                                        fontWeight: "bold",
                                        color: "#8f323b",
                                        background: "#ffe6c4",
                                        border: "3px solid #493333",
                                        borderRadius: 8,
                                        padding: "2px 18px"
                                    }}
                                >
                                    {housePopup.badgeNumber}
                                </div>
                            )}
                            <div className="tb-popup-title">{housePopup.title}</div>
                            <div className="tb-popup-message">{housePopup.message}</div>
                            <button
                                type="button"
                                className="tb-popup-btn"
                                onClick={() => setHousePopup(null)}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function navArrowStyle(side) {
    return {
        position: "fixed",
        top: "50%",
        [side === "left" ? "left" : "right"]: side === "left" ? 24 : 115,
        transform: "translateY(-50%)",
        zIndex: 900,
        padding: "10px 18px",
        fontFamily: "'VT323', monospace",
        fontSize: 22,
        fontWeight: "bold",
        background: "#ffd8a8",
        color: "#493333",
        border: "3px solid #493333",
        borderRadius: 8,
        cursor: "pointer",
        boxShadow: "0 6px 16px rgba(0,0,0,0.5)"
    };
}
