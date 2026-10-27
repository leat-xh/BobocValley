import objectsData from "./data/objects.json"
import imageRegistry from "./data/imageRegistry"
import { ITEMS_CATALOG } from "./data/itemsData"
import Player from './GameComponents/Player'
import Object from './GameComponents/Object'
import Sprite from './GameComponents/Sprite'
import bgImg from './GameComponents/assets/background.png'
import { isColliding, isNear} from "./GameComponents/utils/collision";
import { useInventory } from "../context/InventoryContext";

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router";

function getRandomSpawnPosition() {
    const screenW = typeof window !== "undefined" && window.innerWidth > 400 ? window.innerWidth : 1400;
    const screenH = typeof window !== "undefined" && window.innerHeight > 400 ? window.innerHeight : 800;

    const minX = 80;
    const maxX = Math.max(minX + 200, Math.min(1780, screenW - 140));
    const minY = 80;
    const maxY = Math.max(minY + 200, Math.min(960, screenH - 140));

    for (let attempts = 0; attempts < 300; attempts++) {
        const x = Math.floor(minX + Math.random() * (maxX - minX));
        const y = Math.floor(minY + Math.random() * (maxY - minY));
        const candidate = {
            pos: { x, y },
            scale: 3,
            width: 40,
            height: 40
        };

        const blocked = objectsData.some(obj => {
            if (obj.type === "carriage") return false;
            return obj.solid && isColliding(candidate, obj);
        });

        if (!blocked) {
            return { x, y };
        }
    }

    return { x: 800, y: 500 };
}

export default function Game() {
    const navigate = useNavigate();
    const {
        slots,
        addItem,
        draggedSlot,
        setDraggedSlot,
        draggedItem,
        worldItems,
        shakenTrees,
        shakingTreeIndex,
        chestUnlocked,
        castleCompleted,
        visitedLocations,
        resetCounter,
        shakeTree,
        pickupWorldItem,
        interactItemWithWorldObject,
        showNotification
    } = useInventory();

    const hasVisitedThreeHouses = Boolean(
        visitedLocations?.firsthouse &&
        visitedLocations?.secondhouse &&
        visitedLocations?.tent
    );

    const allFourVisited = Boolean(
        hasVisitedThreeHouses &&
        castleCompleted
    );

    const [player, setPlayer] = useState(() => {
        let initialPos = null;
        try {
            const saved = localStorage.getItem("playerPos");
            if (saved) {
                const parsed = JSON.parse(saved);
                if (
                    typeof parsed?.x === "number" &&
                    typeof parsed?.y === "number" &&
                    parsed.x >= 10 &&
                    parsed.x <= (window.innerWidth || 1920) - 80 &&
                    parsed.y >= 10 &&
                    parsed.y <= (window.innerHeight || 1080) - 80
                ) {
                    initialPos = parsed;
                }
            }
        } catch {}

        if (!initialPos) {
            initialPos = getRandomSpawnPosition();
        }

        return {
            pos: initialPos,
            scale: 3,
            width: 40,
            height: 40,
            size: 40
        };
    });

    useEffect(() => {
        if (resetCounter > 0) {
            const newPos = getRandomSpawnPosition();
            try {
                localStorage.setItem("playerPos", JSON.stringify(newPos));
            } catch {}
            setPlayer(prev => ({
                ...prev,
                pos: newPos
            }));
        }
    }, [resetCounter]);
    const [isIdle, setIsIdle] = useState(true);
    const [direction, setDirection] = useState("right");
    const [castlePopupOpen, setCastlePopupOpen] = useState(false);

    const keys = useRef(new Set());

    // Find the closest tree when the player is standing next to one
    const nearbyTree = (() => {
        let best = null;
        let bestDist = Infinity;
        objectsData.forEach((obj, index) => {
            if (obj.type !== "tree") return;
            const treeCenterX = obj.pos.x + 64;
            const treeCenterY = obj.pos.y + 80;
            const playerCenterX = player.pos.x + 60;
            const playerCenterY = player.pos.y + 60;
            const dist = Math.hypot(playerCenterX - treeCenterX, playerCenterY - treeCenterY);
            if ((dist <= 125 || isNear(player, obj, 50)) && dist < bestDist) {
                bestDist = dist;
                best = { obj, index };
            }
        });
        return best;
    })();

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();
            keys.current.add(key);
            if (key === "arrowleft") setDirection("left");
            if (key === "arrowright") setDirection("right");

            if (key === " " && !e.repeat) {
                // 1. Pick up nearby item if on the ground
                const nearbyWorldItem = worldItems.find((wItem) => {
                    const dx = (player.pos.x + 60) - (wItem.pos.x + 22);
                    const dy = (player.pos.y + 60) - (wItem.pos.y + 22);
                    return Math.hypot(dx, dy) <= 95;
                });

                if (nearbyWorldItem) {
                    pickupWorldItem(nearbyWorldItem.worldItemId);
                    return;
                }

                // 2. Shake nearby tree when pressing Space!
                if (nearbyTree) {
                    shakeTree(nearbyTree.index, nearbyTree.obj);
                    return;
                }

                // Check if near windmill entrance
                const isNearWindmill = (() => {
                    const windmillObj = objectsData.find((o) => o.type === "windmill");
                    if (!windmillObj) return false;
                    const wx = windmillObj.pos.x + 120;
                    const wy = windmillObj.pos.y + 160;
                    const px = player.pos.x + 60;
                    const py = player.pos.y + 60;
                    return Math.hypot(px - wx, py - wy) <= 150;
                })();

                if (isNearWindmill) {
                    showNotification("Today seems especially windy!", "info");
                    return;
                }

                const nearbyObject = objectsData.find(obj => {
                    if (obj.type === "carriage" && !castleCompleted) return false;
                    return obj.interactable && isNear(player, obj, 30);
                });

                if (nearbyObject) {
                    if (nearbyObject.type === "chest") {
                        if (chestUnlocked) {
                            const alreadyHasNote = slots?.some((s) => s?.itemId === "motto_note");
                            if (!alreadyHasNote && !castleCompleted) {
                                addItem("motto_note");
                            } else {
                                showNotification("Chest is unlocked! You already have the Motto Note.", "info");
                            }
                        } else {
                            showNotification("Chest is locked! Shake trees to find the Key, then drag it onto the Chest.", "warning");
                        }
                        return;
                    }
                    if (nearbyObject.type === "carriage") {
                        if (castleCompleted) {
                            navigate("/hideout");
                        }
                        return;
                    }
                    if (nearbyObject.path === "/fortress") {
                        if (!hasVisitedThreeHouses) {
                            showNotification("You have a bad feeling about this..., maybe you should wait", "warning");
                            return;
                        }
                        if (!castleCompleted) {
                            setCastlePopupOpen(true);
                            return;
                        }
                        navigate("/fortress");
                        return;
                    }
                    if (nearbyObject.path)
                        navigate(nearbyObject.path);
                }
            }
        };

        const handleKeyUp = (e) => {
            keys.current.delete(e.key.toLowerCase());
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [player, worldItems, slots, chestUnlocked, castleCompleted, hasVisitedThreeHouses, nearbyTree, shakeTree, addItem, pickupWorldItem, showNotification, navigate]);

    useEffect(() => {
        let animationId;

        function update() {
            const speed = 2.5;
            let dx = 0;
            let dy = 0;

            const pressed = keys.current;

            if (pressed.has("arrowup")) dy -= 1;
            if (pressed.has("arrowdown")) dy += 1;
            if (pressed.has("arrowleft")) dx -= 1;
            if (pressed.has("arrowright")) dx += 1;

            setIsIdle(dx === 0 && dy === 0);

            // Normalize diagonal movement
            const length = Math.hypot(dx, dy);

            if (length > 0) {
                dx /= length;
                dy /= length;
            }
            setPlayer(prev => {
                const clampedX = Math.max(10, Math.min(window.innerWidth - 60, prev.pos.x + dx * speed));
                const clampedY = Math.max(10, Math.min(window.innerHeight - 60, prev.pos.y + dy * speed));
                const next = {
                    ...prev,
                    pos: {
                        x: clampedX,
                        y: clampedY
                    }
                }

                const blocked = objectsData.some(obj => {
                    if (obj.type === "carriage" && !castleCompleted) return false;
                    return obj.solid && isColliding(next, obj)
                });
                return blocked ? prev : next;
            })

            animationId = requestAnimationFrame(update);
        }


        animationId = requestAnimationFrame(update);

        return () => cancelAnimationFrame(animationId);
    }, [castleCompleted]);

    useEffect(() => {
        try {
            localStorage.setItem("playerPos", JSON.stringify(player.pos));
        } catch {}
    }, [player.pos]);


    return (
    <div
    style={{
        backgroundImage: `url(${bgImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top left',
        backgroundSize: 'auto',
        width: '100vw',
        height: '100vh',
    }}>
    
      <Player 
        size={player.size} 
        scale={player.scale} 
        pos={player.pos} 
        isIdle={isIdle} 
        direction={direction}
      />

      {/* Popup with button to shake the tree when next to a tree */}
      {nearbyTree && (
        <div
            className="tb-tree-popup"
            style={{
                left: nearbyTree.obj.pos.x + 64,
                top: Math.max(70, nearbyTree.obj.pos.y + 15)
            }}
        >
            {shakenTrees[nearbyTree.index] ? (
                <span className="tb-tree-popup-text">Tree already shaken</span>
            ) : (
                <>
                    <span className="tb-tree-popup-text">Tree</span>
                    <button
                        type="button"
                        className="tb-shake-btn"
                        onClick={() => shakeTree(nearbyTree.index, nearbyTree.obj)}
                    >
                        Shake Tree
                    </button>
                </>
            )}
        </div>
      )}

      {/* Key on the ground after shaking the tree that has it */}
      {worldItems.map((wItem) => {
        const meta = ITEMS_CATALOG[wItem.itemId];
        if (!meta) return null;

        return (
            <div
                key={wItem.worldItemId}
                className="tb-world-item"
                style={{
                    left: wItem.pos.x,
                    top: wItem.pos.y
                }}
                onClick={() => pickupWorldItem(wItem.worldItemId)}
                title={`Click to pick up ${meta.name}`}
            >
                <div className="tb-world-item-label">
                    Pick up {meta.name}
                </div>
                <img
                    src={meta.icon}
                    alt={meta.name}
                    className="tb-world-item-img"
                />
            </div>
        );
      })}

      {objectsData.map((obj, i) => {
        if (!allFourVisited && obj.type == "carriage") return;

        const playerIsInFront =
            player.pos.y > obj.pos.y + obj.height / 1.5;

        const isChestTarget =
            obj.type === "chest" &&
            !chestUnlocked &&
            Boolean(draggedItem && draggedItem.itemId === "chest_key");

        const handleDropOnChest = (droppedSlotIndex) => {
            const activeSlot =
                droppedSlotIndex !== null && !Number.isNaN(droppedSlotIndex)
                    ? droppedSlotIndex
                    : draggedSlot;
            if (activeSlot !== null) {
                interactItemWithWorldObject(activeSlot, obj);
            }
            setDraggedSlot(null);
        };

        // The Carriage only appears after completing the Castle
        if (obj.type === "carriage" && !castleCompleted) {
            return null;
        }

        let objectBadge = null;
        if (obj.type === "chest" && chestUnlocked) {
            objectBadge = "Unlocked!";
        }

        const handleObjectClick = () => {
            if (!isNear(player, obj, 60)) return;

            if (obj.type === "chest" && chestUnlocked) {
                const alreadyHasNote = slots?.some((s) => s?.itemId === "motto_note");
                if (!alreadyHasNote && !castleCompleted) {
                    addItem("motto_note");
                } else {
                    showNotification("Chest is unlocked! You already have the Motto Note.", "info");
                }
                return;
            }

            if (obj.type === "carriage") {
                if (castleCompleted) {
                    navigate("/hideout");
                }
                return;
            }

            if (obj.path === "/fortress") {
                if (!hasVisitedThreeHouses) {
                    showNotification("You have a bad feeling about this..., maybe you should wait", "warning");
                    return;
                }
                if (!castleCompleted) {
                    setCastlePopupOpen(true);
                    return;
                }
                navigate("/fortress");
                return;
            }

            if (obj.type === "windmill") {
                const wx = obj.pos.x + 120;
                const wy = obj.pos.y + 160;
                const px = player.pos.x + 60;
                const py = player.pos.y + 60;
                if (Math.hypot(px - wx, py - wy) <= 220) {
                    showNotification("Today seems especially windy!", "info");
                } else {
                    showNotification("You need to get closer to inspect the windmill.", "info");
                }
                return;
            }

            if (obj.path) {
                navigate(obj.path);
            }
        };

        return obj.animation ? (
            <Sprite
                key={i}
                {...obj}
                imgSrc={imageRegistry[obj.type]}
                flipHorizontal={true}
                className={shakingTreeIndex === i ? "is-shaking-tree" : ""}
                style={{
                    position: "absolute",
                    left: obj.pos.x,
                    top: obj.pos.y,
                    zIndex: playerIsInFront ? 0 : 2,
                    cursor: obj.type === "tree" ? "pointer" : "default"
                }}
                transparancy={!playerIsInFront && isNear(player, obj, 10)}
                onClick={obj.type === "tree" ? () => shakeTree(i, obj) : undefined}
            />
        ) : (
            <Object
                key={i}
                {...obj}
                imgSrc={imageRegistry[obj.type]}
                zIndex={playerIsInFront ? 0 : 2}
                isValidDropTarget={isChestTarget}
                badge={objectBadge}
                onItemDrop={obj.type === "chest" ? handleDropOnChest : undefined}
                onClickObject={handleObjectClick}
            />
        );
    })}

    {castlePopupOpen && (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.72)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
                fontFamily: "'VT323', monospace",
                userSelect: "none"
            }}
            onClick={() => setCastlePopupOpen(false)}
        >
            <div
                style={{
                    backgroundColor: "#211a2b",
                    border: "4px solid #eab67c",
                    boxShadow: "inset 0 0 0 3px #53253a, 0 10px 30px rgba(0,0,0,0.85)",
                    borderRadius: "8px",
                    padding: "28px 36px",
                    maxWidth: "540px",
                    textAlign: "center",
                    color: "#ffd8a8"
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    style={{
                        fontSize: "2.5rem",
                        margin: "0 0 12px 0",
                        color: "#ffd8a8",
                        textShadow: "2px 2px #000"
                    }}
                >
                    The Grand Fortress
                </div>

                <p
                    style={{
                        fontSize: "1.7rem",
                        color: "#ffe6bf",
                        lineHeight: 1.3,
                        margin: "0 0 24px 0"
                    }}
                >
                    "Maybe I shouldn't visit so early..there might be something else hidden"
                </p>

                <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                    <button
                        type="button"
                        style={{
                            padding: "10px 24px",
                            fontFamily: "'VT323', monospace",
                            fontSize: "1.5rem",
                            color: "#fff9e6",
                            background: "linear-gradient(180deg, #b87a32 0%, #7d4913 100%)",
                            border: "2px solid #ffe1a6",
                            borderRadius: "4px",
                            cursor: "pointer",
                            boxShadow: "0 4px 0 #3a2006"
                        }}
                        onClick={() => {
                            setCastlePopupOpen(false);
                            navigate("/fortress");
                        }}
                    >
                        Enter Castle
                    </button>
                    <button
                        type="button"
                        style={{
                            padding: "10px 24px",
                            fontFamily: "'VT323', monospace",
                            fontSize: "1.5rem",
                            color: "#ffd8a8",
                            background: "linear-gradient(180deg, #512b3e 0%, #361726 100%)",
                            border: "2px solid #eab67c",
                            borderRadius: "4px",
                            cursor: "pointer",
                            boxShadow: "0 4px 0 #1b0a13"
                        }}
                        onClick={() => setCastlePopupOpen(false)}
                    >
                        Look Around First
                    </button>
                </div>
            </div>
        </div>
    )}

    </div>)
}
