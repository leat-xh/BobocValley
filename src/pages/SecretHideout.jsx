import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import LeaveButton from "./Components/LeaveButton";
import { useInventory } from "../context/InventoryContext";
import { ITEMS_CATALOG } from "./data/itemsData";
import hideoutBg from "./TentComponents/assets/tentbg.jpeg";

import victorAvatar from "./GameComponents/assets/victor_avatar.png";
import laurentiuAvatar from "./GameComponents/assets/laurentiu_avatar.svg";
import leatxhAvatar from "./GameComponents/assets/leatxh_avatar.png";
import tickIcon from "./GameComponents/assets/ui/UI_TravelBook_IconTick01a.png";

const HIDEOUT_STORAGE_KEY = "boboc_hideout_delivered_v2";

function loadSavedDeliveries() {
    try {
        const raw = localStorage.getItem(HIDEOUT_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export default function SecretHideout() {
    const navigate = useNavigate();
    const {
        slots,
        removeItemAtSlot,
        markLocationVisited,
        resetAllProgress,
        resetCounter,
        showNotification,
        draggedSlot,
        setDraggedSlot
    } = useInventory();

    const savedDeliveries = loadSavedDeliveries();

    // Dialogue sequence:
    // 0 = Victor introduction
    // 1 = Laurentiu analysis
    // 2 = Leatxh challenge
    // 3 = Active drag and drop phase
    const [dialogueStep, setDialogueStep] = useState(() =>
        savedDeliveries?.dialogueStep ?? 0
    );
    const [liveReaction, setLiveReaction] = useState(null);

    const [victorHover, setVictorHover] = useState(false);
    const [laurentiuHover, setLaurentiuHover] = useState(false);
    const [leatxhHover, setLeatxhHover] = useState(false);

    const [victorDelivered, setVictorDelivered] = useState(
        () =>
            savedDeliveries?.victorDelivered || {
                pick: false,
                ring: false,
                rockstar: false
            }
    );

    const [laurentiuDelivered, setLaurentiuDelivered] = useState(
        () =>
            savedDeliveries?.laurentiuDelivered || {
                knight: false,
                keycap: false,
                crest: false
            }
    );

    const [leatxhDelivered, setLeatxhDelivered] = useState(
        () =>
            savedDeliveries?.leatxhDelivered || {
                waffle: false,
                plushie: false,
                monster: false
            }
    );

    useEffect(() => {
        markLocationVisited("hideout");
    }, [markLocationVisited]);

    useEffect(() => {
        try {
            localStorage.setItem(
                HIDEOUT_STORAGE_KEY,
                JSON.stringify({
                    dialogueStep,
                    victorDelivered,
                    laurentiuDelivered,
                    leatxhDelivered
                })
            );
        } catch {}
    }, [dialogueStep, victorDelivered, laurentiuDelivered, leatxhDelivered]);

    useEffect(() => {
        if (resetCounter > 0) {
            setDialogueStep(0);
            setVictorDelivered({ pick: false, ring: false, rockstar: false });
            setLaurentiuDelivered({ knight: false, keycap: false, crest: false });
            setLeatxhDelivered({ waffle: false, plushie: false, monster: false });
            try {
                localStorage.removeItem(HIDEOUT_STORAGE_KEY);
            } catch {}
        }
    }, [resetCounter]);

    const deliverToVictor = (itemKey, slotIdx) => {
        if (slotIdx === -1 || !slots[slotIdx]) return;
        removeItemAtSlot(slotIdx);
        setVictorDelivered((prev) => ({ ...prev, [itemKey]: true }));

        let speech = "Thanks for returning this!";
        if (itemKey === "pick")
            speech = "My guitar pick! Time to shred with Morgana and the cats!";
        if (itemKey === "ring")
            speech = "The suspicious ring! Heh, you actually spotted it shining.";
        if (itemKey === "rockstar")
            speech = "The rockstar stone! You conquered the guitar rhythm beatmap!";

        setLiveReaction({
            speaker: "Victor",
            avatar: victorAvatar,
            text: speech
        });
        showNotification("Item returned to Victor!", "success");
    };

    const deliverToLaurentiu = (itemKey, slotIdx) => {
        if (slotIdx === -1 || !slots[slotIdx]) return;
        removeItemAtSlot(slotIdx);
        setLaurentiuDelivered((prev) => ({ ...prev, [itemKey]: true }));

        let speech = "Thanks for returning this!";
        if (itemKey === "knight")
            speech =
                "My Grandmaster's Golden Knight! Never start a Sicilian Defense without it.";
        if (itemKey === "keycap")
            speech =
                "My custom artisan keycap! Now my midnight dual-monitor setup is complete again.";
        if (itemKey === "crest")
            speech =
                "The Strategist's Crest! You actually solved my Tactical Memory Matrix—impressive.";

        setLiveReaction({
            speaker: "Laurentiu",
            avatar: laurentiuAvatar,
            text: speech
        });
        showNotification("Item returned to Laurentiu!", "success");
    };

    const deliverToLeatxh = (itemKey, slotIdx) => {
        if (slotIdx === -1 || !slots[slotIdx]) return;
        removeItemAtSlot(slotIdx);
        setLeatxhDelivered((prev) => ({ ...prev, [itemKey]: true }));

        let speech = "Thanks for returning this!";
        if (itemKey === "waffle")
            speech = "Donkey's golden waffle! Smells delicious.";
        if (itemKey === "plushie")
            speech = "My Reze plushie! I was looking for her everywhere!";
        if (itemKey === "monster")
            speech = "An ice-cold Monster! Just what I needed.";

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
        if (dialogueStep < 3) return;

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
        if (dialogueStep < 3) return;

        const rawSlot = e.dataTransfer.getData("text/plain");
        const idx = rawSlot !== "" ? parseInt(rawSlot, 10) : draggedSlot;
        setDraggedSlot(null);
        if (idx === null || !slots[idx]) return;

        const itemId = slots[idx].itemId;
        if (itemId === "golden_knight" && !laurentiuDelivered.knight) {
            deliverToLaurentiu("knight", idx);
        } else if (itemId === "mechanical_keycap" && !laurentiuDelivered.keycap) {
            deliverToLaurentiu("keycap", idx);
        } else if (itemId === "strategist_crest" && !laurentiuDelivered.crest) {
            deliverToLaurentiu("crest", idx);
        } else {
            setLiveReaction({
                speaker: "Laurentiu",
                avatar: laurentiuAvatar,
                text: "That artifact doesn't belong to my sanctum. Analyze the clues again."
            });
            showNotification("It's not me you should give that to.", "warning");
        }
    };

    const handleLeatxhDrop = (e) => {
        e.preventDefault();
        setLeatxhHover(false);
        if (dialogueStep < 3) return;

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

    const laurentiuDeliveredCount =
        (laurentiuDelivered.knight ? 1 : 0) +
        (laurentiuDelivered.keycap ? 1 : 0) +
        (laurentiuDelivered.crest ? 1 : 0);

    const leatxhDeliveredCount =
        (leatxhDelivered.waffle ? 1 : 0) +
        (leatxhDelivered.plushie ? 1 : 0) +
        (leatxhDelivered.monster ? 1 : 0);

    const victorComplete = victorDeliveredCount === 3;
    const laurentiuComplete = laurentiuDeliveredCount === 3;
    const leatxhComplete = leatxhDeliveredCount === 3;
    const allDelivered = victorComplete && laurentiuComplete && leatxhComplete;

    const handleReplay = () => {
        try {
            localStorage.removeItem(HIDEOUT_STORAGE_KEY);
        } catch {}
        resetAllProgress();
        navigate("/");
    };

    const victorReturnedItems = [];
    if (victorDelivered.pick) victorReturnedItems.push(ITEMS_CATALOG.guitar_pick);
    if (victorDelivered.ring) victorReturnedItems.push(ITEMS_CATALOG.suspicious_ring);
    if (victorDelivered.rockstar)
        victorReturnedItems.push(ITEMS_CATALOG.star_shaped_rock);

    const laurentiuReturnedItems = [];
    if (laurentiuDelivered.knight)
        laurentiuReturnedItems.push(ITEMS_CATALOG.golden_knight);
    if (laurentiuDelivered.keycap)
        laurentiuReturnedItems.push(ITEMS_CATALOG.mechanical_keycap);
    if (laurentiuDelivered.crest)
        laurentiuReturnedItems.push(ITEMS_CATALOG.strategist_crest);

    const leatxhReturnedItems = [];
    if (leatxhDelivered.waffle)
        leatxhReturnedItems.push(ITEMS_CATALOG.donkey_waffle);
    if (leatxhDelivered.plushie)
        leatxhReturnedItems.push(ITEMS_CATALOG.reze_plushie);
    if (leatxhDelivered.monster)
        leatxhReturnedItems.push(ITEMS_CATALOG.monster_energy);

    // Active speaker configuration
    let currentSpeaker = "Victor";
    let currentAvatar = victorAvatar;
    let currentText = "You finally made it... we've been waiting for you, heh.";

    if (dialogueStep === 1) {
        currentSpeaker = "Laurentiu";
        currentAvatar = laurentiuAvatar;
        currentText =
            "Every move in the valley was a test of observation. Let's see how well you analyzed our sanctums.";
    } else if (dialogueStep === 2) {
        currentSpeaker = "Leatxh";
        currentAvatar = leatxhAvatar;
        currentText =
            "And let's see what you learned about us and what you STOLE from our houses... grrr.";
    } else if (dialogueStep >= 3) {
        if (allDelivered) {
            currentSpeaker = "The Fellowship of Boboc Valley";
            currentAvatar = laurentiuAvatar;
            currentText =
                "All 9 artifacts have been returned! We share a love for late-night coding, games & anime, while each bringing our own style—rock riffs, chess strategy, and swamp chaos—building 'One prompt at a time'!";
        } else if (liveReaction) {
            currentSpeaker = liveReaction.speaker;
            currentAvatar = liveReaction.avatar;
            currentText = liveReaction.text;
        } else {
            currentSpeaker = "The Fellowship";
            currentAvatar = victorAvatar;
            currentText =
                "Drag items from your inventory and return each artifact to its rightful owner (3 each).";
        }
    }

    const renderMemberCard = ({
        name,
        avatar,
        hover,
        setHover,
        onDrop,
        complete,
        deliveredCount,
        returnedItems,
        idleSubtitle
    }) => (
        <div
            onDragOver={
                dialogueStep >= 3
                    ? (e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = "move";
                          setHover(true);
                      }
                    : undefined
            }
            onDragLeave={dialogueStep >= 3 ? () => setHover(false) : undefined}
            onDrop={dialogueStep >= 3 ? onDrop : undefined}
            style={{
                flex: 1,
                backgroundColor: hover
                    ? "rgba(45, 28, 54, 0.97)"
                    : "rgba(28, 19, 34, 0.93)",
                border: hover
                    ? "3px dashed #ffd8a8"
                    : complete
                      ? "3px solid #63c778"
                      : "3px solid #eab67c",
                transform: hover ? "scale(1.02)" : "scale(1)",
                boxShadow: complete
                    ? "0 0 18px rgba(99, 199, 120, 0.55)"
                    : "0 6px 20px rgba(0,0,0,0.65)",
                borderRadius: "8px",
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                textAlign: "center",
                transition: "all 0.12s ease"
            }}
        >
            <div
                style={{
                    width: "105px",
                    height: "105px",
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
                    src={avatar}
                    alt={name}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                    }}
                />
            </div>

            <div style={{ fontSize: "1.95rem", color: "#ffd8a8", margin: 0 }}>
                {name}
            </div>

            {dialogueStep >= 3 ? (
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px"
                    }}
                >
                    {[0, 1, 2].map((slotIndex) => {
                        const item = returnedItems[slotIndex];
                        return (
                            <div
                                key={slotIndex}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    backgroundColor: item ? "#233d2a" : "#2d1b28",
                                    border: item
                                        ? "1px solid #63c778"
                                        : "1px dashed #7b4255",
                                    padding: "5px 10px",
                                    borderRadius: "4px"
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}
                                >
                                    {item ? (
                                        <>
                                            <img
                                                src={item.icon}
                                                alt={item.name}
                                                style={{ width: 22, height: 22 }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: "1.3rem",
                                                    color: "#80ea97"
                                                }}
                                            >
                                                {item.name}
                                            </span>
                                        </>
                                    ) : (
                                        <span
                                            style={{
                                                fontSize: "1.3rem",
                                                color: "#d896a8"
                                            }}
                                        >
                                            [ ? ] Missing Item
                                        </span>
                                    )}
                                </div>
                                {item ? (
                                    <img
                                        src={tickIcon}
                                        alt="Delivered"
                                        style={{ width: 18, height: 18 }}
                                    />
                                ) : (
                                    <span
                                        style={{
                                            fontSize: "1.05rem",
                                            color: "#d896a8"
                                        }}
                                    >
                                        Drag here
                                    </span>
                                )}
                            </div>
                        );
                    })}

                    <div
                        style={{
                            fontSize: "1.2rem",
                            color: complete ? "#80ea97" : "#ffd8a8",
                            marginTop: "2px"
                        }}
                    >
                        {complete
                            ? "✓ All items returned!"
                            : `Items returned: ${deliveredCount} / 3`}
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        fontSize: "1.3rem",
                        color: "#ffe0b5",
                        fontStyle: "italic",
                        marginTop: "10px"
                    }}
                >
                    {idleSubtitle}
                </div>
            )}
        </div>
    );

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
                padding: "16px 24px",
                boxSizing: "border-box",
                fontFamily: "'VT323', monospace",
                userSelect: "none",
                overflow: "hidden"
            }}
        >
            <LeaveButton />

            {/* Header Title Banner */}
            <div
                style={{
                    backgroundColor: "rgba(22, 14, 27, 0.94)",
                    border: "3px solid #eab67c",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.75)",
                    padding: "6px 36px",
                    borderRadius: "6px",
                    textAlign: "center"
                }}
            >
                <div
                    style={{
                        fontSize: "1.2rem",
                        color: "#ffd8a8",
                        letterSpacing: "1px"
                    }}
                >
                    ★ THE SECRET CARRIAGE HIDEOUT ★
                </div>
                <div
                    style={{
                        margin: "2px 0 0",
                        fontSize: "2rem",
                        color: "#fff3dc",
                        textShadow: "2px 2px #000"
                    }}
                >
                    {dialogueStep < 3
                        ? "The Confrontation"
                        : allDelivered
                          ? `★ Score: 9 / 9 — All Belongings Returned! ★`
                          : `Return what you took to its rightful owner! (${
                                victorDeliveredCount +
                                laurentiuDeliveredCount +
                                leatxhDeliveredCount
                            } / 9)`}
                </div>
            </div>

            {/* 3 Avatars Row */}
            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    justifyContent: "center",
                    alignItems: "stretch",
                    maxWidth: "1060px",
                    width: "100%",
                    margin: "8px 0"
                }}
            >
                {renderMemberCard({
                    name: "Victor",
                    avatar: victorAvatar,
                    hover: victorHover,
                    setHover: setVictorHover,
                    onDrop: handleVictorDrop,
                    complete: victorComplete,
                    deliveredCount: victorDeliveredCount,
                    returnedItems: victorReturnedItems,
                    idleSubtitle: "Tuning his electric guitar with Morgana nearby..."
                })}

                {renderMemberCard({
                    name: "Laurentiu",
                    avatar: laurentiuAvatar,
                    hover: laurentiuHover,
                    setHover: setLaurentiuHover,
                    onDrop: handleLaurentiuDrop,
                    complete: laurentiuComplete,
                    deliveredCount: laurentiuDeliveredCount,
                    returnedItems: laurentiuReturnedItems,
                    idleSubtitle:
                        "The strategist observing from the shadows, calculating three moves ahead..."
                })}

                {renderMemberCard({
                    name: "Leatxh",
                    avatar: leatxhAvatar,
                    hover: leatxhHover,
                    setHover: setLeatxhHover,
                    onDrop: handleLeatxhDrop,
                    complete: leatxhComplete,
                    deliveredCount: leatxhDeliveredCount,
                    returnedItems: leatxhReturnedItems,
                    idleSubtitle: "Glaring intently at your inventory..."
                })}
            </div>

            {/* RPG Dialogue Box at the Bottom */}
            <div
                style={{
                    width: "min(940px, 92vw)",
                    backgroundColor: "rgba(22, 14, 27, 0.96)",
                    border: "4px solid #eab67c",
                    boxShadow:
                        "inset 0 0 0 3px #53253a, 0 10px 30px rgba(0,0,0,0.85)",
                    borderRadius: "8px",
                    padding: "14px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    boxSizing: "border-box"
                }}
            >
                {/* Speaker Avatar Thumbnail */}
                <div
                    style={{
                        width: "72px",
                        height: "72px",
                        minWidth: "72px",
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
                    <img
                        src={currentAvatar}
                        alt={currentSpeaker}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                    />
                </div>

                {/* Speaker Text & Action */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px"
                    }}
                >
                    <div
                        style={{
                            fontSize: "1.65rem",
                            color: "#ffd8a8",
                            fontWeight: "bold",
                            letterSpacing: "0.5px"
                        }}
                    >
                        {currentSpeaker}
                    </div>
                    <div
                        style={{
                            fontSize: "1.45rem",
                            color: "#fff2d9",
                            lineHeight: 1.22
                        }}
                    >
                        &ldquo;{currentText}&rdquo;
                    </div>
                </div>

                {/* Dialogue Advance or Replay Button */}
                <div>
                    {dialogueStep < 2 && (
                        <button
                            type="button"
                            onClick={() => setDialogueStep((s) => s + 1)}
                            style={dialogueBtnStyle}
                        >
                            Next →
                        </button>
                    )}

                    {dialogueStep === 2 && (
                        <button
                            type="button"
                            onClick={() => setDialogueStep(3)}
                            style={dialogueBtnStyle}
                        >
                            Start →
                        </button>
                    )}

                    {dialogueStep >= 3 && allDelivered && (
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
    boxShadow:
        "inset 0 1px 0 #ffeaaf, 0 5px 0 #3a2006, 0 0 16px rgba(255, 207, 122, 0.5)",
    borderRadius: "6px",
    cursor: "pointer",
    textShadow: "1px 1px 0 #281403",
    whiteSpace: "nowrap"
};
