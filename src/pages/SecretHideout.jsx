import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useInventory } from "../context/InventoryContext";
import { ITEMS_CATALOG } from "./data/itemsData";
import hideoutBg from "./TentComponents/assets/tentbg.jpeg";

import victorAvatar from "./GameComponents/assets/victor_avatar.png";
import leatxhAvatar from "./GameComponents/assets/leatxh_avatar.png";
import tickIcon from "./GameComponents/assets/ui/UI_TravelBook_IconTick01a.png";

export default function SecretHideout() {
    const navigate = useNavigate();
    const {
        slots,
        removeItemAtSlot,
        markLocationVisited,
        resetAllProgress,
        showNotification,
        draggedSlot,
        setDraggedSlot
    } = useInventory();

    // Dialogue sequence:
    // 0 = Victor introduction
    // 1 = Leatxh challenge
    // 2 = Active drag and drop phase
    const [dialogueStep, setDialogueStep] = useState(0);
    const [liveReaction, setLiveReaction] = useState(null);

    const [victorHover, setVictorHover] = useState(false);
    const [laurentiuHover, setLaurentiuHover] = useState(false);
    const [leatxhHover, setLeatxhHover] = useState(false);

    const [victorDelivered, setVictorDelivered] = useState({
        pick: false,
        ring: false,
        rockstar: false
    });

    const [leatxhDelivered, setLeatxhDelivered] = useState({
        waffle: false,
        plushie: false,
        monster: false
    });

    useEffect(() => {
        markLocationVisited("hideout");
    }, [markLocationVisited]);

    const deliverToVictor = (itemKey, slotIdx) => {
        if (slotIdx === -1 || !slots[slotIdx]) return;
        removeItemAtSlot(slotIdx);
        setVictorDelivered((prev) => ({ ...prev, [itemKey]: true }));

        let speech = "Thanks for returning this!";
        if (itemKey === "pick") speech = "My guitar pick! Time to shred with the cats!";
        if (itemKey === "ring") speech = "The suspicious ring! Heh, you actually found it.";
        if (itemKey === "rockstar") speech = "The rockstar stone! Now we're talking!";

        setLiveReaction({
            speaker: "Victor",
            avatar: victorAvatar,
            text: speech
        });
        showNotification("Item returned to Victor!", "success");
    };

    const deliverToLeatxh = (itemKey, slotIdx) => {
        if (slotIdx === -1 || !slots[slotIdx]) return;
        removeItemAtSlot(slotIdx);
        setLeatxhDelivered((prev) => ({ ...prev, [itemKey]: true }));

        let speech = "Thanks for returning this!";
        if (itemKey === "waffle") speech = "Donkey's golden waffle! Smells delicious.";
        if (itemKey === "plushie") speech = "My Reze plushie! I was looking for her everywhere!";
        if (itemKey === "monster") speech = "An ice-cold Monster! Just what I needed.";

        setLiveReaction({
            speaker: "Leatxh",
            avatar: leatxhAvatar,
            text: speech
        });
        showNotification("Item returned to Leatxh!", "success");
    };

    const handleVictorDrop = (e) => {
        e.preventDefault();
        setVictorHover(false);
        if (dialogueStep < 2) return;

        const rawSlot = e.dataTransfer.getData("text/plain");
        const idx = rawSlot !== "" ? parseInt(rawSlot, 10) : draggedSlot;
        setDraggedSlot(null);
        if (idx === null || !slots[idx]) return;

        const itemId = slots[idx].itemId;
        if (itemId === "guitar_pick" && !victorDelivered.pick) {
            deliverToVictor("pick", idx);
        } else if (itemId === "suspicious_ring" && !victorDelivered.ring) {
            deliverToVictor("ring", idx);
        } else if (itemId === "star_shaped_rock" && !victorDelivered.rockstar) {
            deliverToVictor("rockstar", idx);
        } else {
            setLiveReaction({
                speaker: "Victor",
                avatar: victorAvatar,
                text: "It's not me you should give that to."
            });
            showNotification("It's not me you should give that to.", "warning");
        }
    };

    const handleLaurentiuDrop = (e) => {
        e.preventDefault();
        setLaurentiuHover(false);
        if (dialogueStep < 2) return;

        const rawSlot = e.dataTransfer.getData("text/plain");
        const idx = rawSlot !== "" ? parseInt(rawSlot, 10) : draggedSlot;
        setDraggedSlot(null);
        if (idx === null || !slots[idx]) return;

        setLiveReaction({
            speaker: "Laurentiu",
            avatar: null,
            text: "It's not me you should give that to."
        });
        showNotification("It's not me you should give that to.", "warning");
    };

    const handleLeatxhDrop = (e) => {
        e.preventDefault();
        setLeatxhHover(false);
        if (dialogueStep < 2) return;

        const rawSlot = e.dataTransfer.getData("text/plain");
        const idx = rawSlot !== "" ? parseInt(rawSlot, 10) : draggedSlot;
        setDraggedSlot(null);
        if (idx === null || !slots[idx]) return;

        const itemId = slots[idx].itemId;
        if (itemId === "donkey_waffle" && !leatxhDelivered.waffle) {
            deliverToLeatxh("waffle", idx);
        } else if (itemId === "reze_plushie" && !leatxhDelivered.plushie) {
            deliverToLeatxh("plushie", idx);
        } else if (itemId === "monster_energy" && !leatxhDelivered.monster) {
            deliverToLeatxh("monster", idx);
        } else {
            setLiveReaction({
                speaker: "Leatxh",
                avatar: leatxhAvatar,
                text: "It's not me you should give that to."
            });
            showNotification("It's not me you should give that to.", "warning");
        }
    };

    const victorDeliveredCount =
        (victorDelivered.pick ? 1 : 0) +
        (victorDelivered.ring ? 1 : 0) +
        (victorDelivered.rockstar ? 1 : 0);

    const leatxhDeliveredCount =
        (leatxhDelivered.waffle ? 1 : 0) +
        (leatxhDelivered.plushie ? 1 : 0) +
        (leatxhDelivered.monster ? 1 : 0);

    const victorComplete = victorDeliveredCount === 3;
    const leatxhComplete = leatxhDeliveredCount === 3;
    const allDelivered = victorComplete && leatxhComplete;

    const handleReplay = () => {
        resetAllProgress();
        navigate("/");
    };

    // List of delivered items to show in the mystery slots (revealed once given)
    const victorReturnedItems = [];
    if (victorDelivered.pick) victorReturnedItems.push(ITEMS_CATALOG.guitar_pick);
    if (victorDelivered.ring) victorReturnedItems.push(ITEMS_CATALOG.suspicious_ring);
    if (victorDelivered.rockstar) victorReturnedItems.push(ITEMS_CATALOG.star_shaped_rock);

    const leatxhReturnedItems = [];
    if (leatxhDelivered.waffle) leatxhReturnedItems.push(ITEMS_CATALOG.donkey_waffle);
    if (leatxhDelivered.plushie) leatxhReturnedItems.push(ITEMS_CATALOG.reze_plushie);
    if (leatxhDelivered.monster) leatxhReturnedItems.push(ITEMS_CATALOG.monster_energy);

    // Active speaker configuration
    let currentSpeaker = "Victor";
    let currentAvatar = victorAvatar;
    let currentText = "You finally made it...we've been waiting for you, heh";

    if (dialogueStep === 1) {
        currentSpeaker = "Leatxh";
        currentAvatar = leatxhAvatar;
        currentText = "Let's see what you learned about us and what you STOLE from our houses...grrr.";
    } else if (dialogueStep >= 2) {
        if (allDelivered) {
            currentSpeaker = "The Fellowship";
            currentAvatar = victorAvatar;
            currentText = "All stolen items have been returned! You have completed Boboc Valley!";
        } else if (liveReaction) {
            currentSpeaker = liveReaction.speaker;
            currentAvatar = liveReaction.avatar;
            currentText = liveReaction.text;
        } else {
            currentSpeaker = "The Fellowship";
            currentAvatar = victorAvatar;
            currentText = "Drag items from your inventory and give each person what belongs to them.";
        }
    }

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                position: "relative",
                backgroundImage: `url(${hideoutBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px",
                boxSizing: "border-box",
                fontFamily: "'VT323', monospace",
                userSelect: "none",
                overflow: "hidden"
            }}
        >
            {/* Header Title Banner */}
            <div
                style={{
                    backgroundColor: "rgba(22, 14, 27, 0.94)",
                    border: "3px solid #eab67c",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.75)",
                    padding: "8px 36px",
                    borderRadius: "6px",
                    textAlign: "center"
                }}
            >
                <div style={{ fontSize: "1.25rem", color: "#ffd8a8", letterSpacing: "1px" }}>
                    ★ THE SECRET CARRIAGE HIDEOUT ★
                </div>
                <div
                    style={{
                        margin: "2px 0 0",
                        fontSize: "2.1rem",
                        color: "#fff3dc",
                        textShadow: "2px 2px #000"
                    }}
                >
                    {dialogueStep < 2
                        ? "The Confrontation"
                        : allDelivered
                        ? "★ All Belongings Returned! ★"
                        : "Return what you took to its rightful owner!"}
                </div>
            </div>

            {/* 3 Avatars Row */}
            <div
                style={{
                    display: "flex",
                    gap: "24px",
                    justifyContent: "center",
                    alignItems: "stretch",
                    maxWidth: "1050px",
                    width: "100%",
                    margin: "10px 0"
                }}
            >
                {/* 1st Person: Victor */}
                <div
                    onDragOver={
                        dialogueStep >= 2
                            ? (e) => {
                                  e.preventDefault();
                                  e.dataTransfer.dropEffect = "move";
                                  setVictorHover(true);
                              }
                            : undefined
                    }
                    onDragLeave={dialogueStep >= 2 ? () => setVictorHover(false) : undefined}
                    onDrop={dialogueStep >= 2 ? handleVictorDrop : undefined}
                    style={{
                        flex: 1,
                        backgroundColor: victorHover
                            ? "rgba(45, 28, 54, 0.97)"
                            : "rgba(28, 19, 34, 0.93)",
                        border: victorHover
                            ? "3px dashed #ffd8a8"
                            : victorComplete
                            ? "3px solid #63c778"
                            : "3px solid #eab67c",
                        transform: victorHover ? "scale(1.02)" : "scale(1)",
                        boxShadow: victorComplete
                            ? "0 0 18px rgba(99, 199, 120, 0.55)"
                            : "0 6px 20px rgba(0,0,0,0.65)",
                        borderRadius: "8px",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px",
                        textAlign: "center",
                        transition: "all 0.12s ease"
                    }}
                >
                    <div
                        style={{
                            width: "115px",
                            height: "115px",
                            borderRadius: "50%",
                            border: "3px solid #ffd8a8",
                            overflow: "hidden",
                            backgroundColor: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.5)"
                        }}
                    >
                        <img
                            src={victorAvatar}
                            alt="Victor"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}
                        />
                    </div>

                    <div style={{ fontSize: "2rem", color: "#ffd8a8", margin: 0 }}>
                        Victor
                    </div>

                    {/* Mystery Drop Slots (Active only in drag & drop phase) */}
                    {dialogueStep >= 2 ? (
                        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "6px" }}>
                            {[0, 1, 2].map((slotIndex) => {
                                const item = victorReturnedItems[slotIndex];
                                return (
                                    <div
                                        key={slotIndex}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            backgroundColor: item ? "#233d2a" : "#2d1b28",
                                            border: item ? "1px solid #63c778" : "1px dashed #7b4255",
                                            padding: "6px 12px",
                                            borderRadius: "4px"
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            {item ? (
                                                <>
                                                    <img src={item.icon} alt={item.name} style={{ width: 22, height: 22 }} />
                                                    <span style={{ fontSize: "1.35rem", color: "#80ea97" }}>
                                                        {item.name}
                                                    </span>
                                                </>
                                            ) : (
                                                <span style={{ fontSize: "1.35rem", color: "#d896a8" }}>
                                                    [ ? ] Missing Item
                                                </span>
                                            )}
                                        </div>
                                        {item ? (
                                            <img src={tickIcon} alt="Delivered" style={{ width: 18, height: 18 }} />
                                        ) : (
                                            <span style={{ fontSize: "1.05rem", color: "#d896a8" }}>Drag here</span>
                                        )}
                                    </div>
                                );
                            })}

                            <div
                                style={{
                                    fontSize: "1.25rem",
                                    color: victorComplete ? "#80ea97" : "#ffd8a8",
                                    marginTop: "4px"
                                }}
                            >
                                {victorComplete ? "✓ All items returned!" : `Items returned: ${victorDeliveredCount} / 3`}
                            </div>
                        </div>
                    ) : (
                        <div style={{ fontSize: "1.35rem", color: "#ffe0b5", fontStyle: "italic", marginTop: "12px" }}>
                            Standing with arms crossed...
                        </div>
                    )}
                </div>

                {/* 2nd Person: Laurentiu (Question Mark) */}
                <div
                    onDragOver={
                        dialogueStep >= 2
                            ? (e) => {
                                  e.preventDefault();
                                  e.dataTransfer.dropEffect = "move";
                                  setLaurentiuHover(true);
                              }
                            : undefined
                    }
                    onDragLeave={dialogueStep >= 2 ? () => setLaurentiuHover(false) : undefined}
                    onDrop={dialogueStep >= 2 ? handleLaurentiuDrop : undefined}
                    style={{
                        flex: 1,
                        backgroundColor: laurentiuHover
                            ? "rgba(45, 28, 54, 0.97)"
                            : "rgba(28, 19, 34, 0.93)",
                        border: laurentiuHover
                            ? "3px dashed #ffd8a8"
                            : "3px solid #eab67c",
                        transform: laurentiuHover ? "scale(1.02)" : "scale(1)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.65)",
                        borderRadius: "8px",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "12px",
                        textAlign: "center",
                        transition: "all 0.12s ease"
                    }}
                >
                    <div
                        style={{
                            width: "115px",
                            height: "115px",
                            borderRadius: "50%",
                            border: "3px solid #ffd8a8",
                            backgroundColor: "#221424",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.5)"
                        }}
                    >
                        <span
                            style={{
                                fontSize: "4.5rem",
                                color: "#ffd8a8",
                                fontWeight: "bold",
                                textShadow: "2px 2px #000"
                            }}
                        >
                            ?
                        </span>
                    </div>

                    <div style={{ fontSize: "2rem", color: "#ffd8a8", margin: 0 }}>
                        Laurentiu
                    </div>

                    <div
                        style={{
                            backgroundColor: "#2d1b28",
                            border: "1px dashed #7b4255",
                            padding: "12px 14px",
                            borderRadius: "6px",
                            fontSize: "1.35rem",
                            color: "#ffe0b5",
                            lineHeight: 1.25
                        }}
                    >
                        "The strategist observing from the shadows... He smiles silently, watching you return everyone's belongings."
                    </div>

                    <div style={{ fontSize: "1.3rem", color: "#eab67c", marginTop: "auto" }}>
                        ★ Enigmatic Guardian ★
                    </div>
                </div>

                {/* 3rd Person: Leatxh */}
                <div
                    onDragOver={
                        dialogueStep >= 2
                            ? (e) => {
                                  e.preventDefault();
                                  e.dataTransfer.dropEffect = "move";
                                  setLeatxhHover(true);
                              }
                            : undefined
                    }
                    onDragLeave={dialogueStep >= 2 ? () => setLeatxhHover(false) : undefined}
                    onDrop={dialogueStep >= 2 ? handleLeatxhDrop : undefined}
                    style={{
                        flex: 1,
                        backgroundColor: leatxhHover
                            ? "rgba(45, 28, 54, 0.97)"
                            : "rgba(28, 19, 34, 0.93)",
                        border: leatxhHover
                            ? "3px dashed #ffd8a8"
                            : leatxhComplete
                            ? "3px solid #63c778"
                            : "3px solid #eab67c",
                        transform: leatxhHover ? "scale(1.02)" : "scale(1)",
                        boxShadow: leatxhComplete
                            ? "0 0 18px rgba(99, 199, 120, 0.55)"
                            : "0 6px 20px rgba(0,0,0,0.65)",
                        borderRadius: "8px",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px",
                        textAlign: "center",
                        transition: "all 0.12s ease"
                    }}
                >
                    <div
                        style={{
                            width: "115px",
                            height: "115px",
                            borderRadius: "50%",
                            border: "3px solid #ffd8a8",
                            overflow: "hidden",
                            backgroundColor: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.5)"
                        }}
                    >
                        <img
                            src={leatxhAvatar}
                            alt="Leatxh"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}
                        />
                    </div>

                    <div style={{ fontSize: "2rem", color: "#ffd8a8", margin: 0 }}>
                        Leatxh
                    </div>

                    {/* Mystery Drop Slots (Active only in drag & drop phase) */}
                    {dialogueStep >= 2 ? (
                        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "6px" }}>
                            {[0, 1, 2].map((slotIndex) => {
                                const item = leatxhReturnedItems[slotIndex];
                                return (
                                    <div
                                        key={slotIndex}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            backgroundColor: item ? "#233d2a" : "#2d1b28",
                                            border: item ? "1px solid #63c778" : "1px dashed #7b4255",
                                            padding: "6px 12px",
                                            borderRadius: "4px"
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            {item ? (
                                                <>
                                                    <img src={item.icon} alt={item.name} style={{ width: 22, height: 22 }} />
                                                    <span style={{ fontSize: "1.35rem", color: "#80ea97" }}>
                                                        {item.name}
                                                    </span>
                                                </>
                                            ) : (
                                                <span style={{ fontSize: "1.35rem", color: "#d896a8" }}>
                                                    [ ? ] Missing Item
                                                </span>
                                            )}
                                        </div>
                                        {item ? (
                                            <img src={tickIcon} alt="Delivered" style={{ width: 18, height: 18 }} />
                                        ) : (
                                            <span style={{ fontSize: "1.05rem", color: "#d896a8" }}>Drag here</span>
                                        )}
                                    </div>
                                );
                            })}

                            <div
                                style={{
                                    fontSize: "1.25rem",
                                    color: leatxhComplete ? "#80ea97" : "#ffd8a8",
                                    marginTop: "4px"
                                }}
                            >
                                {leatxhComplete ? "✓ All items returned!" : `Items returned: ${leatxhDeliveredCount} / 3`}
                            </div>
                        </div>
                    ) : (
                        <div style={{ fontSize: "1.35rem", color: "#ffe0b5", fontStyle: "italic", marginTop: "12px" }}>
                            Glaring intently at your inventory...
                        </div>
                    )}
                </div>
            </div>

            {/* RPG Dialogue Box at the Bottom */}
            <div
                style={{
                    width: "min(900px, 92vw)",
                    backgroundColor: "rgba(22, 14, 27, 0.96)",
                    border: "4px solid #eab67c",
                    boxShadow: "inset 0 0 0 3px #53253a, 0 10px 30px rgba(0,0,0,0.85)",
                    borderRadius: "8px",
                    padding: "16px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    boxSizing: "border-box"
                }}
            >
                {/* Speaker Avatar Thumbnail */}
                <div
                    style={{
                        width: "74px",
                        height: "74px",
                        minWidth: "74px",
                        borderRadius: "50%",
                        border: "3px solid #ffd8a8",
                        overflow: "hidden",
                        backgroundColor: "#221424",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 3px 8px rgba(0,0,0,0.6)"
                    }}
                >
                    {currentAvatar ? (
                        <img
                            src={currentAvatar}
                            alt={currentSpeaker}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}
                        />
                    ) : (
                        <span style={{ fontSize: "3rem", color: "#ffd8a8", fontWeight: "bold" }}>
                            ?
                        </span>
                    )}
                </div>

                {/* Speaker Text & Action */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div
                        style={{
                            fontSize: "1.7rem",
                            color: "#ffd8a8",
                            fontWeight: "bold",
                            letterSpacing: "0.5px"
                        }}
                    >
                        {currentSpeaker}
                    </div>
                    <div
                        style={{
                            fontSize: "1.55rem",
                            color: "#fff2d9",
                            lineHeight: 1.25
                        }}
                    >
                        "{currentText}"
                    </div>
                </div>

                {/* Dialogue Advance or Replay Button */}
                <div>
                    {dialogueStep === 0 && (
                        <button
                            type="button"
                            onClick={() => setDialogueStep(1)}
                            style={dialogueBtnStyle}
                        >
                            Next →
                        </button>
                    )}

                    {dialogueStep === 1 && (
                        <button
                            type="button"
                            onClick={() => setDialogueStep(2)}
                            style={dialogueBtnStyle}
                        >
                            Start →
                        </button>
                    )}

                    {dialogueStep >= 2 && allDelivered && (
                        <button
                            type="button"
                            onClick={handleReplay}
                            style={replayBtnStyle}
                        >
                            ↺ REPLAY GAME
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

const dialogueBtnStyle = {
    padding: "8px 22px",
    fontFamily: "'VT323', monospace",
    fontSize: "1.5rem",
    color: "#fff9e6",
    background: "linear-gradient(180deg, #b87a32 0%, #7d4913 100%)",
    border: "2px solid #ffe1a6",
    boxShadow: "0 4px 0 #3a2006",
    borderRadius: "4px",
    cursor: "pointer",
    whiteSpace: "nowrap"
};

const replayBtnStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 24px",
    fontFamily: "'VT323', monospace",
    fontSize: "1.7rem",
    letterSpacing: "1px",
    color: "#fff9e6",
    background: "linear-gradient(180deg, #b87a32 0%, #7d4913 100%)",
    border: "2px solid #ffe1a6",
    boxShadow: "inset 0 1px 0 #ffeaaf, 0 5px 0 #3a2006, 0 0 16px rgba(255, 207, 122, 0.5)",
    borderRadius: "6px",
    cursor: "pointer",
    textShadow: "1px 1px 0 #281403",
    whiteSpace: "nowrap"
};
