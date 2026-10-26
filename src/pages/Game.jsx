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

export default function Game() {
    const navigate = useNavigate();
    const {
        draggedSlot,
        setDraggedSlot,
        draggedItem,
        worldItems,
        shakenTrees,
        shakingTreeIndex,
        chestUnlocked,
        visitedLocations,
        shakeTree,
        pickupWorldItem,
        interactItemWithWorldObject,
        showNotification
    } = useInventory();

    const allFourVisited = Boolean(
        visitedLocations?.firsthouse &&
        visitedLocations?.secondhouse &&
        visitedLocations?.tent &&
        visitedLocations?.castle
    );

    const [player, setPlayer] = useState(() => {
        const defaultPos = { x: 800, y: 500 };
        let initialPos = defaultPos;
        try {
            const savedPos = localStorage.getItem("playerPos");
            if (savedPos) {
                const parsed = JSON.parse(savedPos);
                if (
                    typeof parsed?.x === "number" &&
                    typeof parsed?.y === "number" &&
                    parsed.x >= 10 &&
                    parsed.x <= window.innerWidth - 80 &&
                    parsed.y >= 10 &&
                    parsed.y <= window.innerHeight - 80
                ) {
                    initialPos = parsed;
                }
            }
        } catch {
            initialPos = defaultPos;
        }
        return {
            pos: initialPos,
            scale: 3,
            width: 40,
            height: 40,
            size: 40
        };
    });
    const [isIdle, setIsIdle] = useState(true);
    const [direction, setDirection] = useState("right");

    const keys = useRef(new Set());

    // Find the closest tree when the player is standing next to one
    const nearbyTree = (() => {
        let best = null;
        let bestDist = Infinity;
        objectsData.forEach((obj, index) => {
            if (obj.type !== "tree") return;
            if (isNear(player, obj, 45)) {
                const dist = Math.hypot(
                    (player.pos.x + 60) - (obj.pos.x + 80),
                    (player.pos.y + 60) - (obj.pos.y + 80)
                );
                if (dist < bestDist) {
                    bestDist = dist;
                    best = { obj, index };
                }
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
                // Pick up nearby key if on the ground
                const nearbyWorldItem = worldItems.find((wItem) => {
                    const dx = (player.pos.x + 60) - (wItem.pos.x + 22);
                    const dy = (player.pos.y + 60) - (wItem.pos.y + 22);
                    return Math.hypot(dx, dy) <= 95;
                });

                if (nearbyWorldItem) {
                    pickupWorldItem(nearbyWorldItem.worldItemId);
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

                const nearbyObject = objectsData.find(obj =>
                    obj.interactable && isNear(player, obj, 30)
                );

                if (nearbyObject) {
                    if (nearbyObject.type === "chest") {
                        if (chestUnlocked) {
                            showNotification("Chest is unlocked!", "success");
                        } else {
                            showNotification("Chest is locked! Shake trees to find the Key, then drag it onto the Chest.", "warning");
                        }
                        return;
                    }
                    if (nearbyObject.type === "carriage") {
                        if (allFourVisited) {
                            navigate("/hideout");
                        } else {
                            showNotification("The Secret Hideout entrance is sealed! Visit all 4 locations first.", "info");
                        }
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
    }, [player, worldItems, chestUnlocked, allFourVisited, pickupWorldItem, showNotification, navigate]);

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
                    if (obj.type == "carriage" && !allFourVisited) return false;
                    return obj.solid && isColliding(next, obj)
                });
                return blocked ? prev : next;
            })

            animationId = requestAnimationFrame(update);
        }


        animationId = requestAnimationFrame(update);

        return () => cancelAnimationFrame(animationId);
    }, []);

    useEffect(() => {
        localStorage.setItem("playerPos", JSON.stringify(player.pos));
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

        let objectBadge = null;
        if (obj.type === "chest" && chestUnlocked) {
            objectBadge = "Unlocked!";
        } else if (obj.type === "windmill") {
            //objectBadge = allFourVisited ? "★ Secret Hideout ★" : null;
        }

        const handleObjectClick = () => {
            if (!isNear(player, obj, 50)) return;
            if (obj.type === "windmill") {
                showNotification("Today seems especially windy!", "info");
                return; 
                if (allFourVisited) {
                    navigate("/hideout");
                } else {
                    showNotification("The Secret Hideout entrance is sealed! Visit all 4 locations first.", "info");
                }
            } else if (obj.path) {
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
                }}
                transparancy={!playerIsInFront && isNear(player, obj, 10)}
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

    </div>)
}
