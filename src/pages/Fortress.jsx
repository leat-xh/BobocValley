import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import LeaveButton from "./Components/LeaveButton";
import { useInventory } from "../context/InventoryContext";
import bgImg from "./FortressComponents/assets/fortress.png";
import charImg from "./FortressComponents/assets/stefan.png";
import "./FortressComponents/Fortress.css";

const MAX_HINTS = 3;

const PHASE_HINTS = {
    q1: "Hint: The swamp house with Donkey and Reze is the first house on the southwest side of the valley—it belongs to Leatxh!",
    q2: "Hint: Double-click the black feline in Victor's Tent—he yells 'Don't call me a cat. I'm Morgana!'",
    q3: "Hint: In Laurentiu's northern castle-house, moving the crimson rug reveals his prized Grandmaster's Golden Knight!",
    q4: "Hint: Walk up to the Windmill in the valley and press Space or click it: 'Today seems especially windy!'",
    challenge2:
        "Hint: Shake the trees around Boboc Valley until the Chest Key drops, drag the Key onto the Chest to get the Motto Note ('One prompt at a time'), and give it to Stefan!"
};

export default function Fortress() {
    const navigate = useNavigate();
    const {
        slots,
        removeItemAtSlot,
        castleCompleted,
        setCastleCompleted,
        markLocationVisited,
        showNotification
    } = useInventory();

    const [description, setDescription] = useState(true);
    const [phase, setPhase] = useState(() =>
        castleCompleted ? "already_conquered" : "intro_0"
    );
    const [hintsUsed, setHintsUsed] = useState(0);
    const [hintState, setHintState] = useState({ phase: null, text: null });

    const activeHintText = hintState.phase === phase ? hintState.text : null;

    const hasMottoNote = slots.some((s) => s?.itemId === "motto_note");
    const mottoNoteSlotIndex = slots.findIndex((s) => s?.itemId === "motto_note");

    useEffect(() => {
        markLocationVisited("castle");
    }, [markLocationVisited]);

    const isChallenge1Cleared =
        castleCompleted ||
        phase === "c1_cleared" ||
        phase === "challenge2" ||
        phase === "c2_wrong" ||
        phase === "victory" ||
        phase === "already_conquered";

    const trialsRemaining = castleCompleted ? 0 : isChallenge1Cleared ? 1 : 2;
    const hintsLeft = MAX_HINTS - hintsUsed;
    const canUseHintOnPhase = Boolean(PHASE_HINTS[phase]);

    const handleUseHint = () => {
        if (!PHASE_HINTS[phase]) return;
        if (activeHintText) return;
        if (hintsUsed >= MAX_HINTS) {
            showNotification("No hints remaining (0/3)!", "warning");
            return;
        }
        setHintsUsed((prev) => prev + 1);
        setHintState({ phase, text: PHASE_HINTS[phase] });
        showNotification(`Used a hint! (${MAX_HINTS - (hintsUsed + 1)}/3 remaining)`, "info");
    };

    const handleAnswerQ1 = (ans) => {
        if (ans === "Leatxh") {
            showNotification("Correct! Leatxh resides in the swamp house.", "success");
            setPhase("q2");
        } else {
            setPhase("q1_wrong");
        }
    };

    const handleAnswerQ2 = (ans) => {
        if (ans === "Morgana") {
            showNotification("Correct! Morgana the not-cat!", "success");
            setPhase("q3");
        } else {
            setPhase("q2_wrong");
        }
    };

    const handleAnswerQ3 = (ans) => {
        if (ans === "The Golden Knight") {
            showNotification(
                "Correct! The Strategist prizes the Golden Knight!",
                "success"
            );
            setPhase("q4");
        } else {
            setPhase("q3_wrong");
        }
    };

    const handleAnswerQ4 = (ans) => {
        if (ans === "Today seems especially windy!") {
            showNotification("Correct! 'Today seems especially windy!'", "success");
            setPhase("c1_cleared");
        } else {
            setPhase("q4_wrong");
        }
    };

    const handleGiveMottoNote = () => {
        if (!hasMottoNote || mottoNoteSlotIndex === -1) {
            setPhase("c2_wrong");
            return;
        }

        removeItemAtSlot(mottoNoteSlotIndex);
        setCastleCompleted(true);
        setPhase("victory");
        showNotification(
            "Delivered the Motto Note! Castle conquered!",
            "success"
        );
    };

    return (
        <div
            className="fortress-container"
            style={{
                backgroundImage: `url(${bgImg})`
            }}
        >
            {/* In the Trap Castle, the main Leave button only appears once conquered! */}
            {castleCompleted && <LeaveButton />}

            {/* Top Fortress Gate Lock & Remaining Trials Indicator */}
            <div
                style={{
                    position: "fixed",
                    top: 16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 900,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    background: "rgba(22, 14, 27, 0.94)",
                    border: `3px solid ${castleCompleted ? "#58a96b" : "#eab67c"}`,
                    borderRadius: 8,
                    padding: "6px 20px",
                    color: "#ffd8a8",
                    fontSize: "1.35rem",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.75)"
                }}
            >
                <span>
                    {castleCompleted
                        ? "🔓 Fortress Gates Unlocked!"
                        : "🔒 Fortress Gates Locked Behind You!"}
                </span>
                <span>|</span>
                <span>
                    Trials Remaining:{" "}
                    <strong style={{ color: castleCompleted ? "#86efac" : "#fde047" }}>
                        {trialsRemaining} / 2
                    </strong>
                </span>
                <span>|</span>
                <span>
                    Hints Left:{" "}
                    <strong style={{ color: hintsLeft > 0 ? "#67e8f9" : "#fca5a5" }}>
                        {hintsLeft} / {MAX_HINTS}
                    </strong>
                </span>
            </div>

            {/* Intro Welcome Popup (dismissible) */}
            {description && (
                <div
                    style={{
                        backgroundColor: "rgba(32, 26, 35, 0.94)",
                        border: "4px solid #eab67c",
                        boxShadow: "0 8px 28px rgba(0,0,0,0.85)",
                        padding: "24px 44px",
                        borderRadius: "8px",
                        textAlign: "center",
                        maxWidth: "580px",
                        position: "relative",
                        zIndex: 20,
                        color: "#ffd8a8"
                    }}
                >
                    <h1
                        style={{
                            fontSize: "2.8rem",
                            margin: "0 0 10px 0",
                            color: "#ffd8a8",
                            textShadow: "2px 2px #000"
                        }}
                    >
                        The Grand Fortress
                    </h1>
                    <p
                        style={{
                            fontSize: "1.45rem",
                            color: "#ffe0b5",
                            margin: "0 0 12px 0"
                        }}
                    >
                        The heavy iron gates slam shut behind you! Stefan cel Mare awaits to test your knowledge of Boboc Valley and our sacred creed before you may leave.
                    </p>

                    <button
                        type="button"
                        className="fortress-gold-btn"
                        onClick={() => setDescription(false)}
                        style={{ marginTop: 8 }}
                    >
                        ⚔️ Face Stefan cel Mare
                    </button>

                    <button
                        style={{
                            position: "absolute",
                            right: 12,
                            top: 10,
                            background: "none",
                            color: "#ff6b6b",
                            border: "none",
                            fontSize: "1.8rem",
                            cursor: "pointer",
                            fontFamily: "'VT323', monospace"
                        }}
                        onClick={() => setDescription(false)}
                        title="Close"
                    >
                        ✕
                    </button>
                </div>
            )}

            {!description && (
                <>
                    {/* Stefan cel Mare Visual Sprite */}
                    <div
                        className="fortress-stefan-sprite"
                        style={{
                            backgroundImage: `url(${charImg})`
                        }}
                    />

                    {/* Themed Dialogue Box */}
                    <div className="fortress-dialogue-box">
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 10
                            }}
                        >
                            <div className="fortress-speaker-tag" style={{ margin: 0 }}>
                                ⚔️ Stefan cel Mare
                            </div>

                            {canUseHintOnPhase && (
                                <button
                                    type="button"
                                    className="fortress-btn"
                                    onClick={handleUseHint}
                                    disabled={hintsLeft <= 0 || Boolean(activeHintText)}
                                    style={{
                                        padding: "4px 14px",
                                        fontSize: "1.25rem",
                                        opacity:
                                            hintsLeft <= 0 || Boolean(activeHintText)
                                                ? 0.55
                                                : 1
                                    }}
                                >
                                    💡 Hint ({hintsLeft}/{MAX_HINTS})
                                </button>
                            )}
                        </div>

                        {activeHintText && (
                            <div
                                style={{
                                    background: "rgba(6, 182, 212, 0.16)",
                                    border: "2px solid #22d3ee",
                                    borderRadius: 6,
                                    padding: "6px 12px",
                                    marginBottom: 10,
                                    color: "#a5f3fc",
                                    fontSize: "1.35rem"
                                }}
                            >
                                {activeHintText}
                            </div>
                        )}

                        {/* Already Conquered State */}
                        {phase === "already_conquered" && (
                            <>
                                <p className="fortress-dialogue-text">
                                    Welcome back, champion! You proved your worth with our sacred motto: &ldquo;One prompt at a time&rdquo;. The mysterious Carriage is waiting for you in the valley!
                                </p>
                                <div className="fortress-actions-row">
                                    <button
                                        type="button"
                                        className="fortress-gold-btn"
                                        onClick={() => navigate("/")}
                                    >
                                        Return to Valley (Find Carriage)
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Intro 0 */}
                        {phase === "intro_0" && (
                            <>
                                <p className="fortress-dialogue-text">
                                    Halt! The Fortress gates have locked behind you, stranger. None may exit until both royal trials are conquered!
                                </p>
                                <div className="fortress-actions-row">
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => setPhase("intro_ready")}
                                    >
                                        I&apos;m here to prove myself.
                                    </button>
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => setPhase("intro_lost")}
                                    >
                                        I just got lost...
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Intro Lost */}
                        {phase === "intro_lost" && (
                            <>
                                <p className="fortress-dialogue-text">
                                    Lost? Nobody wanders into this fortress by accident. You&apos;ll have to prove you&apos;re worthy of being here!
                                </p>
                                <div className="fortress-actions-row">
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => setPhase("intro_ready")}
                                    >
                                        Fine, test me.
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Intro Ready */}
                        {phase === "intro_ready" && (
                            <>
                                <p className="fortress-dialogue-text">
                                    Very well! I have two trials for you. The first tests your knowledge of every house in Boboc Valley. Are you ready for Challenge 1?
                                </p>
                                <div className="fortress-actions-row">
                                    <button
                                        type="button"
                                        className="fortress-gold-btn"
                                        onClick={() => setPhase("q1")}
                                    >
                                        ⚡ Begin Challenge 1: Trivia
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Question 1 */}
                        {phase === "q1" && (
                            <>
                                <div className="fortress-badge-challenge">
                                    Challenge 1 — Question 1/4
                                </div>
                                <p className="fortress-dialogue-text">
                                    &ldquo;Who lives in Shrek&apos;s swamp house?&rdquo;
                                </p>
                                <div className="fortress-options-grid">
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => handleAnswerQ1("Leatxh")}
                                    >
                                        Leatxh
                                    </button>
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => handleAnswerQ1("Laurentiu")}
                                    >
                                        Laurentiu
                                    </button>
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => handleAnswerQ1("Victor")}
                                    >
                                        Victor
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Question 1 Wrong */}
                        {phase === "q1_wrong" && (
                            <>
                                <div className="fortress-badge-challenge fortress-badge-error">
                                    Incorrect Answer
                                </div>
                                <p className="fortress-dialogue-text">
                                    Incorrect! Think about who welcomes you inside the swamp house with the donkey!
                                </p>
                                <div className="fortress-actions-row">
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => setPhase("q1")}
                                    >
                                        Try Question 1 Again
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Question 2 */}
                        {phase === "q2" && (
                            <>
                                <div className="fortress-badge-challenge">
                                    Challenge 1 — Question 2/4
                                </div>
                                <p className="fortress-dialogue-text">
                                    &ldquo;What&apos;s the name of the cat in the tent?&rdquo;
                                </p>
                                <div className="fortress-options-grid">
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => handleAnswerQ2("Morgana")}
                                    >
                                        Morgana
                                    </button>
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => handleAnswerQ2("MiauMiau")}
                                    >
                                        MiauMiau
                                    </button>
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => handleAnswerQ2("Yuumi")}
                                    >
                                        Yuumi
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Question 2 Wrong */}
                        {phase === "q2_wrong" && (
                            <>
                                <div className="fortress-badge-challenge fortress-badge-error">
                                    Incorrect Answer
                                </div>
                                <p className="fortress-dialogue-text">
                                    Wrong! That creature insisted in Victor&apos;s tent: &ldquo;Don&apos;t call me a cat!&rdquo;
                                </p>
                                <div className="fortress-actions-row">
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => setPhase("q2")}
                                    >
                                        Try Question 2 Again
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Question 3 (About Laurentiu's Sanctum) */}
                        {phase === "q3" && (
                            <>
                                <div className="fortress-badge-challenge">
                                    Challenge 1 — Question 3/4
                                </div>
                                <p className="fortress-dialogue-text">
                                    &ldquo;Which chess piece is prized by the strategist in Laurentiu&apos;s northern sanctum?&rdquo;
                                </p>
                                <div className="fortress-options-grid">
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => handleAnswerQ3("The Golden Knight")}
                                    >
                                        The Golden Knight
                                    </button>
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => handleAnswerQ3("The Obsidian Rook")}
                                    >
                                        The Obsidian Rook
                                    </button>
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => handleAnswerQ3("The Silver Bishop")}
                                    >
                                        The Silver Bishop
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Question 3 Wrong */}
                        {phase === "q3_wrong" && (
                            <>
                                <div className="fortress-badge-challenge fortress-badge-error">
                                    Incorrect Answer
                                </div>
                                <p className="fortress-dialogue-text">
                                    Not quite! Remember the framed painting and the piece hidden beneath the crimson rug in Laurentiu&apos;s sanctum!
                                </p>
                                <div className="fortress-actions-row">
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => setPhase("q3")}
                                    >
                                        Try Question 3 Again
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Question 4 */}
                        {phase === "q4" && (
                            <>
                                <div className="fortress-badge-challenge">
                                    Challenge 1 — Question 4/4
                                </div>
                                <p className="fortress-dialogue-text">
                                    &ldquo;What does the windmill say when you inspect it?&rdquo;
                                </p>
                                <div className="fortress-options-grid">
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() =>
                                            handleAnswerQ4("Today seems especially windy!")
                                        }
                                    >
                                        Today seems especially windy!
                                    </button>
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() =>
                                            handleAnswerQ4("The wind is howling!")
                                        }
                                    >
                                        The wind is howling!
                                    </button>
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() =>
                                            handleAnswerQ4("Not a breath of wind today...")
                                        }
                                    >
                                        Not a breath of wind today...
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Question 4 Wrong */}
                        {phase === "q4_wrong" && (
                            <>
                                <div className="fortress-badge-challenge fortress-badge-error">
                                    Incorrect Answer
                                </div>
                                <p className="fortress-dialogue-text">
                                    Nay! Go visit the windmill near the valley entrance and inspect it!
                                </p>
                                <div className="fortress-actions-row">
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => setPhase("q4")}
                                    >
                                        Try Question 4 Again
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Challenge 1 Cleared */}
                        {phase === "c1_cleared" && (
                            <>
                                <div className="fortress-badge-challenge fortress-badge-success">
                                    ✓ Challenge 1 Cleared! (1 Trial Remaining)
                                </div>
                                <p className="fortress-dialogue-text">
                                    Impressive! You answered all four trivia questions correctly. You know Boboc Valley and its residents like the back of your hand!
                                </p>
                                <div className="fortress-actions-row">
                                    <button
                                        type="button"
                                        className="fortress-gold-btn"
                                        onClick={() => setPhase("challenge2")}
                                    >
                                        ⚔️ Begin Challenge 2
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Challenge 2: The Sacred Motto */}
                        {phase === "challenge2" && (
                            <>
                                <div className="fortress-badge-challenge">
                                    Challenge 2 — The Sacred Motto
                                </div>
                                <p className="fortress-dialogue-text">
                                    Stefan cel Mare asks:{" "}
                                    <strong style={{ color: "#ffd8a8" }}>
                                        &ldquo;What is it the team stands for?&rdquo;
                                    </strong>
                                </p>
                                <p className="fortress-dialogue-text is-hint">
                                    Hand over the Motto Note with our sacred creed: &ldquo;One prompt at a time&rdquo;. (Found inside the locked chest in the valley, opened with the tree key).
                                </p>

                                <div className="fortress-actions-row">
                                    {hasMottoNote ? (
                                        <button
                                            type="button"
                                            className="fortress-gold-btn"
                                            onClick={handleGiveMottoNote}
                                        >
                                            📜 Give Stefan cel Mare the Motto Note (&ldquo;One prompt at a time&rdquo;)
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                className="fortress-btn"
                                                onClick={() => setPhase("c2_wrong")}
                                            >
                                                &ldquo;I don&apos;t have the note yet...&rdquo;
                                            </button>
                                            <button
                                                type="button"
                                                className="fortress-btn"
                                                onClick={() => navigate("/")}
                                            >
                                                Temporary Reprieve: Search Valley for Chest Key
                                            </button>
                                        </>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Challenge 2 Missing Note */}
                        {phase === "c2_wrong" && (
                            <>
                                <div className="fortress-badge-challenge fortress-badge-error">
                                    Missing Sacred Motto
                                </div>
                                <p className="fortress-dialogue-text">
                                    You do not possess our motto note! Shake the trees around Boboc Valley to find the Chest Key, unlock the chest, claim the Motto Note, and bring it back to me!
                                </p>
                                <div className="fortress-actions-row">
                                    <button
                                        type="button"
                                        className="fortress-gold-btn"
                                        onClick={() => navigate("/")}
                                    >
                                        Go Search the Valley for the Key
                                    </button>
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => setPhase("challenge2")}
                                    >
                                        Back
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Victory Phase */}
                        {phase === "victory" && (
                            <>
                                <div className="fortress-badge-challenge fortress-badge-success">
                                    ★ Castle Conquered! Gates Unlocked! ★
                                </div>
                                <p className="fortress-dialogue-text">
                                    &ldquo;YES!{" "}
                                    <span style={{ color: "#ffd8a8" }}>
                                        &lsquo;One prompt at a time&rsquo;
                                    </span>
                                    ! That is our creed! You have proven your worth beyond all doubt, true adventurer!&rdquo;
                                </p>
                                <p className="fortress-dialogue-text is-hint">
                                    Behold! The Fortress gates are open and the mysterious Carriage has arrived in the valley. The Secret Hideout awaits you!
                                </p>
                                <div className="fortress-actions-row">
                                    <button
                                        type="button"
                                        className="fortress-gold-btn"
                                        onClick={() => navigate("/")}
                                    >
                                        Enter Boboc Valley (Find the Carriage)
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
