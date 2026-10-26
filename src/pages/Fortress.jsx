import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import LeaveButton from "./Components/LeaveButton";
import { useInventory } from "../context/InventoryContext";
import bgImg from "./FortressComponents/assets/fortress.png";
import charImg from "./FortressComponents/assets/stefan.png";
import "./FortressComponents/Fortress.css";

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
    // Dialogue phases:
    // "intro_0", "intro_lost", "intro_ready",
    // "q1", "q1_wrong",
    // "q2", "q2_wrong",
    // "q3", "q3_wrong",
    // "c1_cleared",
    // "challenge2", "c2_wrong",
    // "victory"
    const [phase, setPhase] = useState(() => (castleCompleted ? "already_conquered" : "intro_0"));

    const hasMottoNote = slots.some((s) => s?.itemId === "motto_note");
    const mottoNoteSlotIndex = slots.findIndex((s) => s?.itemId === "motto_note");

    useEffect(() => {
        markLocationVisited("castle");
    }, [markLocationVisited]);

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
        if (ans === "Today seems especially windy!") {
            showNotification("Correct! 'Today seems especially windy!'", "success");
            setPhase("c1_cleared");
        } else {
            setPhase("q3_wrong");
        }
    };

    const handleGiveMottoNote = () => {
        if (!hasMottoNote || mottoNoteSlotIndex === -1) {
            setPhase("c2_wrong");
            return;
        }

        // Consume the motto note
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
            <LeaveButton />

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
                            margin: 0
                        }}
                    >
                        The majestic castle overlooking Boboc Valley. Stefan cel Mare awaits to challenge worthy challengers.
                    </p>

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
                        <div className="fortress-speaker-tag">
                            ⚔️ Stefan cel Mare
                        </div>

                        {/* Already Conquered State */}
                        {phase === "already_conquered" && (
                            <>
                                <p className="fortress-dialogue-text">
                                    Welcome back, champion! You proved your worth with our sacred motto: "One prompt at a time". The mysterious Carriage is waiting for you in the valley!
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
                                    Halt! What are you doing here, stranger? The Grand Fortress is not a place for the unprepared.
                                </p>
                                <div className="fortress-actions-row">
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => setPhase("intro_ready")}
                                    >
                                        I'm here to prove myself.
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
                                    Lost? Nobody wanders into this fortress by accident. You'll have to prove you're worthy of being here!
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
                                    Very well! I have two trials for you. The first tests your knowledge of Boboc Valley. Are you ready for Challenge 1?
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
                                    Challenge 1 — Question 1/3
                                </div>
                                <p className="fortress-dialogue-text">
                                    "Who lives in Shrek's swamp house?"
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
                                    Challenge 1 — Question 2/3
                                </div>
                                <p className="fortress-dialogue-text">
                                    "What's the name of the cat?"
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
                                    Wrong! That creature insisted in Victor's tent: "Don't call me a cat!"
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

                        {/* Question 3 */}
                        {phase === "q3" && (
                            <>
                                <div className="fortress-badge-challenge">
                                    Challenge 1 — Question 3/3
                                </div>
                                <p className="fortress-dialogue-text">
                                    "What does the windmill say when you inspect it?"
                                </p>
                                <div className="fortress-options-grid">
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => handleAnswerQ3("Today seems especially windy!")}
                                    >
                                        Today seems especially windy!
                                    </button>
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => handleAnswerQ3("The wind is howling!")}
                                    >
                                        The wind is howling!
                                    </button>
                                    <button
                                        type="button"
                                        className="fortress-btn"
                                        onClick={() => handleAnswerQ3("Not a breath of wind today...")}
                                    >
                                        Not a breath of wind today...
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
                                    Nay! Go visit the windmill near the valley entrance and inspect it!
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

                        {/* Challenge 1 Cleared */}
                        {phase === "c1_cleared" && (
                            <>
                                <div className="fortress-badge-challenge fortress-badge-success">
                                    ✓ Challenge 1 Cleared!
                                </div>
                                <p className="fortress-dialogue-text">
                                    Impressive! You answered all three trivia questions correctly. You know Boboc Valley like the back of your hand!
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
                                    Stefan cel Mare asks: <strong style={{ color: "#ffd8a8" }}>"What is it the team stands for?"</strong>
                                </p>
                                <p className="fortress-dialogue-text is-hint">
                                    Hand over the Motto Note with our sacred creed: "One prompt at a time". (Found inside the locked chest in the valley, opened with the tree key).
                                </p>

                                <div className="fortress-actions-row">
                                    {hasMottoNote ? (
                                        <button
                                            type="button"
                                            className="fortress-gold-btn"
                                            onClick={handleGiveMottoNote}
                                        >
                                            📜 Give Stefan cel Mare the Motto Note ("One prompt at a time")
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                className="fortress-btn"
                                                onClick={() => setPhase("c2_wrong")}
                                            >
                                                "I don't have the note yet..."
                                            </button>
                                            <button
                                                type="button"
                                                className="fortress-btn"
                                                onClick={() => navigate("/")}
                                            >
                                                Leave to find the chest key
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
                                    ★ Castle Conquered! ★
                                </div>
                                <p className="fortress-dialogue-text">
                                    "YES! <span style={{ color: "#ffd8a8" }}>'One prompt at a time'</span>! That is our creed! You have proven your worth beyond all doubt, true adventurer!"
                                </p>
                                <p className="fortress-dialogue-text is-hint">
                                    Behold! The mysterious Carriage has now appeared in the valley. The Secret Hideout awaits you!
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
