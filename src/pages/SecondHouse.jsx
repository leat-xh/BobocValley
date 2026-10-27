import { useEffect, useState, useRef, useCallback } from "react";
import LeaveButton from "./Components/LeaveButton";
import { useInventory } from "../context/InventoryContext";
import {
    SANCTUM_QUOTE,
    DISTRACTION_AND_CLUE_POPUPS
} from "./SecondHouseComponents/sanctumData";
import {
    PaintingModal,
    JournalModal,
    BattlestationModal
} from "./SecondHouseComponents/SanctumModals";

import goldenKnightImg from "./SecondHouseComponents/assets/golden_knight.svg";
import mechanicalKeycapImg from "./SecondHouseComponents/assets/mechanical_keycap.svg";
import strategistCrestImg from "./SecondHouseComponents/assets/strategist_crest.svg";
import "./SecondHouseComponents/SecondHouse.css";

const RUG_INITIAL_POS = { xPercent: 48, yPercent: 76 };

export default function SecondHouse() {
    const {
        slots,
        draggedSlot,
        setDraggedSlot,
        addItem,
        secondHouseState,
        setSecondHouseState,
        markLocationVisited,
        showNotification
    } = useInventory();

    useEffect(() => {
        markLocationVisited("secondhouse");
    }, [markLocationVisited]);

    const nightMode = Boolean(secondHouseState?.nightMode);
    const knightPickedUp = Boolean(
        secondHouseState?.knightPickedUp ||
            slots.some((s) => s?.itemId === "golden_knight")
    );
    const keycapPickedUp = Boolean(
        secondHouseState?.keycapPickedUp ||
            slots.some((s) => s?.itemId === "mechanical_keycap")
    );
    const memoryWon = Boolean(
        secondHouseState?.memoryWon ||
            slots.some((s) => s?.itemId === "strategist_crest")
    );

    // Modals & Popups
    const [paintingModalOpen, setPaintingModalOpen] = useState(false);
    const [journalModalOpen, setJournalModalOpen] = useState(false);
    const [battlestationModalOpen, setBattlestationModalOpen] = useState(false);
    const [sanctumPopup, setSanctumPopup] = useState(null);

    // Draggable Rug State (pixel offset from initial center)
    const [rugOffset, setRugOffset] = useState(() =>
        secondHouseState?.rugMoved ? { dx: 210, dy: 18 } : { dx: 0, dy: 0 }
    );
    const [rugHeld, setRugHeld] = useState(false);
    const rugPointerStart = useRef({ x: 0, y: 0, startDx: 0, startDy: 0 });

    const isVaultExposed =
        Boolean(secondHouseState?.rugMoved) ||
        Math.hypot(rugOffset.dx, rugOffset.dy) > 75;

    const handleToggleNightMode = useCallback(() => {
        const nextMode = !nightMode;
        setSecondHouseState((prev) => ({
            ...prev,
            nightMode: nextMode
        }));
        showNotification(
            nextMode
                ? "Midnight Cyber-UV Mode activated! Hidden neon elements revealed."
                : "Switched to Daylight Study Mode.",
            "info"
        );
    }, [nightMode, setSecondHouseState, showNotification]);

    const handleOpenPainting = () => {
        setSecondHouseState((prev) => ({
            ...prev,
            paintingInspected: true
        }));
        setPaintingModalOpen(true);
    };

    const handleOpenJournal = () => {
        setSecondHouseState((prev) => ({
            ...prev,
            journalInspected: true
        }));
        setJournalModalOpen(true);
    };

    const handlePickupKnight = () => {
        if (knightPickedUp) return;
        if (addItem("golden_knight")) {
            setSecondHouseState((prev) => ({
                ...prev,
                knightPickedUp: true,
                rugMoved: true
            }));
            setSanctumPopup({
                title: "Grandmaster's Golden Knight",
                message:
                    "You found the weighted Golden Knight hidden beneath the rug! It has been added to your inventory.",
                img: goldenKnightImg
            });
            showNotification("Collected Grandmaster's Knight!", "success", goldenKnightImg);
        }
    };

    const handleClickKeycap = () => {
        if (keycapPickedUp) return;
        if (!nightMode) {
            setSanctumPopup(DISTRACTION_AND_CLUE_POPUPS.keycapLocked);
            return;
        }
        if (addItem("mechanical_keycap")) {
            setSecondHouseState((prev) => ({
                ...prev,
                keycapPickedUp: true
            }));
            setSanctumPopup({
                title: "Custom Artisan Keycap",
                message:
                    "Under the UV-Neon glow, you spotted and collected the resident's custom Artisan Keycap!",
                img: mechanicalKeycapImg
            });
            showNotification("Collected Artisan Keycap!", "success", mechanicalKeycapImg);
        }
    };

    const handleWinMemoryGame = useCallback(
        (movesCount) => {
            const alreadyHadCrest =
                secondHouseState?.memoryWon ||
                slots.some((s) => s?.itemId === "strategist_crest");

            setSecondHouseState((prev) => ({
                ...prev,
                memoryWon: true
            }));

            if (!alreadyHadCrest) {
                if (addItem("strategist_crest")) {
                    showNotification(
                        `Memory Matrix solved in ${movesCount} moves! Earned Strategist's Crest!`,
                        "success",
                        strategistCrestImg
                    );
                }
            } else {
                showNotification(
                    `Memory Matrix completed in ${movesCount} moves!`,
                    "success",
                    strategistCrestImg
                );
            }
        },
        [secondHouseState?.memoryWon, slots, setSecondHouseState, addItem, showNotification]
    );

    const handleDropOnChessboard = (e) => {
        e.preventDefault();
        const rawSlot = e.dataTransfer.getData("text/plain");
        const idx = rawSlot !== "" ? parseInt(rawSlot, 10) : draggedSlot;
        const droppedItem = idx !== null ? slots[idx] : null;
        setDraggedSlot(null);

        if (droppedItem?.itemId === "golden_knight") {
            showNotification(
                "The Golden Knight fits the Sicilian Defense formation! Keep it in your inventory to return in the Secret Hideout.",
                "info",
                goldenKnightImg
            );
        } else {
            setSanctumPopup(
                knightPickedUp
                    ? DISTRACTION_AND_CLUE_POPUPS.chessboardComplete
                    : DISTRACTION_AND_CLUE_POPUPS.chessboard
            );
        }
    };

    const handleDropOnBattlestation = (e) => {
        e.preventDefault();
        const rawSlot = e.dataTransfer.getData("text/plain");
        const idx = rawSlot !== "" ? parseInt(rawSlot, 10) : draggedSlot;
        const droppedItem = idx !== null ? slots[idx] : null;
        setDraggedSlot(null);

        if (droppedItem?.itemId === "mechanical_keycap") {
            showNotification(
                "The tactile Artisan Keycap clicks satisfyingly! Keep it in your inventory to return in the Secret Hideout.",
                "info",
                mechanicalKeycapImg
            );
        }
        setBattlestationModalOpen(true);
    };

    return (
        <div className={`sh-room-container ${nightMode ? "is-night-mode" : ""}`}>
            <LeaveButton />

            {/* Top Sanctum Status Banner */}
            <div className="sh-top-banner">
                <span className="sh-banner-title">
                    ♞ The Strategist&apos;s Sanctum
                </span>
                <span>|</span>
                <span>
                    Mode:{" "}
                    <strong style={{ color: nightMode ? "#38bdf8" : "#fde047" }}>
                        {nightMode ? "🌙 Midnight Cyber-UV" : "☀️ Daylight Study"}
                    </strong>
                </span>
                <span>|</span>
                <span className={`sh-banner-pill ${knightPickedUp ? "is-collected" : ""}`}>
                    ♞ Knight: {knightPickedUp ? "✓" : "?"}
                </span>
                <span className={`sh-banner-pill ${keycapPickedUp ? "is-collected" : ""}`}>
                    ⌨️ Keycap: {keycapPickedUp ? "✓" : "?"}
                </span>
                <span className={`sh-banner-pill ${memoryWon ? "is-collected" : ""}`}>
                    ★ Crest: {memoryWon ? "✓" : "?"}
                </span>
            </div>

            {/* Architectural Background Layers */}
            <div className="sh-wall-wainscot" />
            <div className="sh-floor-planks" />

            {/* Castle Arched Window */}
            <div
                className="sh-castle-window sh-interactive-obj"
                onClick={() =>
                    showNotification(
                        nightMode
                            ? "The valley sleeps under a starry sky—prime hours for deep focus and clean code."
                            : "From the northern tower window, you can oversee all of Boboc Valley.",
                        "info"
                    )
                }
            >
                <div className="sh-obj-label">Tower Window</div>
                <div className="sh-window-orb" />
                <div className="sh-window-cross-v" />
                <div className="sh-window-cross-h" />
            </div>

            {/* Secret UV Wall Inscription (Revealed in Night Mode) */}
            <div className="sh-uv-wall-clue">
                ⚡ UV INSCRIPTION: &ldquo;OPENING: SICILIAN DEFENSE · KEYCAP GLOWS ON THE UPPER RACK&rdquo;
            </div>

            {/* 1. Framed Strategist Painting (With Personal Quote) */}
            <div
                className="sh-painting-frame sh-interactive-obj"
                onClick={handleOpenPainting}
                title="Inspect Framed Painting"
            >
                <div className="sh-obj-label">Inspect Strategist&apos;s Painting</div>
                <div className="sh-painting-inner">
                    <img
                        src={goldenKnightImg}
                        alt="Painting"
                        style={{ width: 68, height: 68, pointerEvents: "none" }}
                    />
                </div>
                <div className="sh-painting-quote-strip">
                    &ldquo;{SANCTUM_QUOTE}&rdquo;
                </div>
            </div>

            {/* 2. Cyber-UV Ambient Wall Switch (Changes Room Visual State) */}
            <div
                className={`sh-wall-switch sh-interactive-obj ${nightMode ? "is-active" : ""}`}
                onClick={handleToggleNightMode}
                title="Toggle Daylight / Midnight Cyber-UV Mode"
            >
                <div className="sh-obj-label">
                    {nightMode ? "Switch to Day Mode" : "Activate Cyber-UV Mode"}
                </div>
                <div className="sh-switch-led" />
                <div className="sh-switch-toggle-track">
                    <div className="sh-switch-knob" />
                </div>
                <div className="sh-switch-caption">{nightMode ? "UV ON" : "DAY"}</div>
            </div>

            {/* 3. Upper Neon Shelf with Collectible Artisan Keycap */}
            <div
                className="sh-neon-rack sh-interactive-obj"
                onClick={handleClickKeycap}
                title="Upper Hardware Rack"
            >
                <div className="sh-obj-label">
                    {keycapPickedUp
                        ? "Upper Neon Rack (Keycap Collected)"
                        : nightMode
                          ? "Click to Collect Artisan Keycap!"
                          : "Dim Hardware Rack (Needs UV Light)"}
                </div>

                {/* Decorative Mecha Trophy */}
                <div style={{ fontSize: "2rem" }} title="Mini Sci-Fi Mecha Model">
                    🤖
                </div>

                {/* Collectible #2: Mechanical Artisan Keycap */}
                {!keycapPickedUp ? (
                    <div
                        className={`sh-keycap-collectible ${nightMode ? "is-glowing" : ""}`}
                        style={{ opacity: nightMode ? 1 : 0.32 }}
                    >
                        <img
                            src={mechanicalKeycapImg}
                            alt="Artisan Keycap"
                            style={{ width: 52, height: 52, pointerEvents: "none" }}
                        />
                    </div>
                ) : (
                    <div style={{ fontSize: "1.1rem", color: "#4ade80" }}>
                        ✓ Keycap Taken
                    </div>
                )}

                {/* Decorative Trophy Cup */}
                <div style={{ fontSize: "1.9rem" }} title="Blitz Chess Trophy">
                    🏆
                </div>
            </div>

            {/* 4. Dual-Monitor Battlestation (Opens Mini-Game & Terminal Logs Modal) */}
            <div
                className="sh-battlestation-desk sh-interactive-obj"
                onClick={() => setBattlestationModalOpen(true)}
                onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                }}
                onDrop={handleDropOnBattlestation}
                title="Open Dual-Monitor Battlestation & Memory Matrix Mini-Game"
            >
                <div className="sh-obj-label">
                    🎮 Dual-Monitor Workstation (Play Mini-Game)
                </div>

                <div className="sh-monitors-row">
                    {/* Left Monitor: Code / Architecture */}
                    <div className="sh-monitor-screen">
                        <div style={{ fontSize: "0.95rem", color: "#38bdf8" }}>
                            CLEAN_ARCH.TS
                        </div>
                        <div className="sh-monitor-code-lines">
                            <div className="sh-code-bar" style={{ width: "85%" }} />
                            <div
                                className="sh-code-bar"
                                style={{ width: "62%", background: "#a855f7" }}
                            />
                            <div
                                className="sh-code-bar"
                                style={{ width: "74%", background: "#4ade80" }}
                            />
                            <div className="sh-code-bar" style={{ width: "50%" }} />
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                            STATUS: READY
                        </div>
                    </div>

                    {/* Right Monitor: Tactical Memory Matrix */}
                    <div className="sh-monitor-screen">
                        <div style={{ fontSize: "0.95rem", color: "#fbbf24" }}>
                            MEMORY_MATRIX.EXE
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.8rem",
                                color: memoryWon ? "#4ade80" : "#38bdf8"
                            }}
                        >
                            {memoryWon ? "★ WON ★" : "♞ ⌨️ 🖥️"}
                        </div>
                        <div style={{ fontSize: "0.9rem", color: "#fde047", textAlign: "center" }}>
                            Click to Play!
                        </div>
                    </div>
                </div>

                <div className="sh-desk-surface">
                    <span style={{ fontSize: "1.35rem" }}>⌨️</span>
                    <span style={{ fontSize: "1.2rem", color: "#cbd5e1" }}>
                        RGB TACTICAL DECK
                    </span>
                    <span style={{ fontSize: "1.35rem" }}>☕</span>
                </div>

                <div className="sh-desk-legs">
                    <div className="sh-desk-leg" />
                    <div className="sh-desk-leg" />
                </div>
            </div>

            {/* 5. Strategist's Leather Journal on Pedestal (Opens 2-Page Journal Modal) */}
            <div
                className="sh-journal-pedestal sh-interactive-obj"
                onClick={handleOpenJournal}
                title="Read Strategist's Journal"
            >
                <div className="sh-obj-label">Read Strategist&apos;s Journal</div>
                <div className="sh-journal-book">📓</div>
                <div className="sh-pedestal-stand" />
            </div>

            {/* 6. Obsidian Chessboard Table (Clue Object) */}
            <div
                className="sh-chess-table sh-interactive-obj"
                onClick={() =>
                    setSanctumPopup(
                        knightPickedUp
                            ? DISTRACTION_AND_CLUE_POPUPS.chessboardComplete
                            : DISTRACTION_AND_CLUE_POPUPS.chessboard
                    )
                }
                onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                }}
                onDrop={handleDropOnChessboard}
                title="Inspect Obsidian Chessboard"
            >
                <div className="sh-obj-label">Obsidian Chessboard</div>
                <div className="sh-chessboard-surface">
                    <span style={{ color: "#f8fafc", textShadow: "0 2px 4px #000" }}>
                        ♔
                    </span>
                    <span style={{ color: "#fbbf24", textShadow: "0 2px 4px #000" }}>
                        {knightPickedUp ? "♞" : "?"}
                    </span>
                    <span style={{ color: "#38bdf8", textShadow: "0 2px 4px #000" }}>
                        ♜
                    </span>
                </div>
                <div className="sh-chess-pillar" />
                <div className="sh-chess-base" />
            </div>

            {/* 7. Geometric Cyber-Bonsai (Distraction Object) */}
            <div
                className="sh-bonsai-pot sh-interactive-obj"
                onClick={() => setSanctumPopup(DISTRACTION_AND_CLUE_POPUPS.bonsai)}
                title="Inspect Cyber-Bonsai"
            >
                <div className="sh-obj-label">Geometric Bonsai</div>
                <div style={{ fontSize: "3.4rem", lineHeight: 1 }}>🌳</div>
                <div
                    style={{
                        width: 58,
                        height: 26,
                        background: "#1e293b",
                        border: "2px solid #38bdf8",
                        borderRadius: "4px 4px 12px 12px"
                    }}
                />
            </div>

            {/* 8. Sci-Fi & Algorithms Bookshelf (Clue / Context Object) */}
            <div
                className="sh-bookshelf sh-interactive-obj"
                onClick={() => setSanctumPopup(DISTRACTION_AND_CLUE_POPUPS.bookshelf)}
                title="Inspect Bookshelf"
            >
                <div className="sh-obj-label">Sci-Fi &amp; Algorithms Library</div>
                <div className="sh-shelf-row">
                    <div className="sh-book-spine" style={{ height: 42, background: "#ef4444" }} />
                    <div className="sh-book-spine" style={{ height: 48, background: "#3b82f6" }} />
                    <div className="sh-book-spine" style={{ height: 38, background: "#eab308" }} />
                    <div className="sh-book-spine" style={{ height: 46, background: "#8b5cf6" }} />
                    <div className="sh-book-spine" style={{ height: 44, background: "#10b981" }} />
                </div>
                <div className="sh-shelf-row">
                    <div className="sh-book-spine" style={{ height: 46, background: "#06b6d4" }} />
                    <div className="sh-book-spine" style={{ height: 40, background: "#f97316" }} />
                    <div style={{ fontSize: "1.8rem", marginLeft: "auto" }}>🚀</div>
                </div>
                <div className="sh-shelf-row">
                    <div className="sh-book-spine" style={{ height: 48, background: "#ec4899" }} />
                    <div className="sh-book-spine" style={{ height: 42, background: "#6366f1" }} />
                    <div className="sh-book-spine" style={{ height: 45, background: "#14b8a6" }} />
                    <div className="sh-book-spine" style={{ height: 39, background: "#f59e0b" }} />
                </div>
            </div>

            {/* 9. Cast-Iron Gym Dumbbells Rack (Clue / Personal Life Object) */}
            <div
                className="sh-dumbbell-rack sh-interactive-obj"
                onClick={() => setSanctumPopup(DISTRACTION_AND_CLUE_POPUPS.dumbbells)}
                title="Inspect Gym Dumbbells"
            >
                <div className="sh-obj-label">Cast-Iron Dumbbells Rack</div>
                <div style={{ fontSize: "2.2rem", lineHeight: 1 }}>🏋️‍♂️</div>
                <div style={{ fontSize: "1.1rem", color: "#cbd5e1" }}>
                    2x 25KG IRON SET
                </div>
            </div>

            {/* Hidden Floor Vault underneath the Crimson Rug */}
            <div className="sh-hidden-floor-vault">
                {!knightPickedUp ? (
                    <div
                        onClick={handlePickupKnight}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            cursor: isVaultExposed ? "pointer" : "default",
                            pointerEvents: isVaultExposed ? "auto" : "none"
                        }}
                        title="Click to pick up Grandmaster's Golden Knight"
                    >
                        <img
                            src={goldenKnightImg}
                            alt="Golden Knight"
                            style={{ width: 58, height: 58 }}
                        />
                        <span style={{ fontSize: "1.05rem", color: "#fde047" }}>
                            Take Golden Knight
                        </span>
                    </div>
                ) : (
                    <div
                        style={{
                            fontSize: "1.1rem",
                            color: "#94a3b8",
                            textAlign: "center",
                            padding: "0 8px"
                        }}
                    >
                        ✓ Knight Collected
                        <br />
                        <span style={{ color: "#fbbf24", fontSize: "0.95rem" }}>
                            &ldquo;SICILIAN DEFENSE&rdquo;
                        </span>
                    </div>
                )}
            </div>

            {/* Draggable Crimson Tactical Rug (Drag & Drop Personalization) */}
            <div
                className="sh-draggable-rug"
                style={{
                    left: `calc(${RUG_INITIAL_POS.xPercent}% + ${rugOffset.dx}px)`,
                    top: `calc(${RUG_INITIAL_POS.yPercent}% + ${rugOffset.dy}px)`,
                    cursor: rugHeld ? "grabbing" : "grab"
                }}
                onPointerDown={(e) => {
                    e.preventDefault();
                    setRugHeld(true);
                    e.currentTarget.setPointerCapture(e.pointerId);
                    rugPointerStart.current = {
                        x: e.clientX,
                        y: e.clientY,
                        startDx: rugOffset.dx,
                        startDy: rugOffset.dy
                    };
                }}
                onPointerMove={(e) => {
                    if (!rugHeld && !e.currentTarget.hasPointerCapture(e.pointerId)) {
                        return;
                    }
                    const nextDx =
                        rugPointerStart.current.startDx +
                        (e.clientX - rugPointerStart.current.x);
                    const nextDy =
                        rugPointerStart.current.startDy +
                        (e.clientY - rugPointerStart.current.y);

                    const clampedDx = Math.max(-340, Math.min(340, nextDx));
                    const clampedDy = Math.max(-120, Math.min(120, nextDy));
                    setRugOffset({ dx: clampedDx, dy: clampedDy });

                    if (
                        !secondHouseState?.rugMoved &&
                        Math.hypot(clampedDx, clampedDy) > 75
                    ) {
                        setSecondHouseState((prev) => ({
                            ...prev,
                            rugMoved: true
                        }));
                        showNotification(
                            "Moved the crimson rug! A hidden floor compartment is underneath!",
                            "info"
                        );
                    }
                }}
                onPointerUp={(e) => {
                    setRugHeld(false);
                    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                        e.currentTarget.releasePointerCapture(e.pointerId);
                    }
                }}
                onPointerCancel={() => setRugHeld(false)}
            >
                <div className="sh-rug-pattern">
                    <span>❖ ROYAL WEAVE RUG ❖</span>
                    <span style={{ fontSize: "1rem", opacity: 0.8 }}>
                        (Drag aside to inspect floor)
                    </span>
                </div>
            </div>

            {/* Detailed Inspection Modals */}
            <PaintingModal
                isOpen={paintingModalOpen}
                onClose={() => setPaintingModalOpen(false)}
                nightMode={nightMode}
            />

            <JournalModal
                isOpen={journalModalOpen}
                onClose={() => setJournalModalOpen(false)}
            />

            <BattlestationModal
                isOpen={battlestationModalOpen}
                onClose={() => setBattlestationModalOpen(false)}
                memoryWon={memoryWon}
                onWinGame={handleWinMemoryGame}
                nightMode={nightMode}
                onToggleNightMode={handleToggleNightMode}
            />

            {/* TravelBook Popup Modal for Clues, Distractions & Item Pickups */}
            {sanctumPopup && (
                <div
                    className="tb-popup-overlay"
                    onClick={() => setSanctumPopup(null)}
                >
                    <div
                        className="tb-popup-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="tb-popup-inner">
                            {sanctumPopup.img && (
                                <img
                                    src={sanctumPopup.img}
                                    alt={sanctumPopup.title}
                                    className="tb-popup-img"
                                />
                            )}
                            <div className="tb-popup-title">{sanctumPopup.title}</div>
                            <div className="tb-popup-message">{sanctumPopup.message}</div>
                            <button
                                type="button"
                                className="tb-popup-btn"
                                onClick={() => setSanctumPopup(null)}
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
