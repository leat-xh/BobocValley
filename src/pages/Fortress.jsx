import { useEffect, useState } from "react";
import LeaveButton from "./Components/LeaveButton";
import { useInventory } from "../context/InventoryContext";
import bgImg from "./FortressComponents/assets/fortress.png";
import charImg from "./FortressComponents/assets/stefan.png";
import "./FortressComponents/Fortress.css"

export default function Fortress() {
    const { markLocationVisited } = useInventory();
    const [description, setDescription] = useState(true);
    const [dialogueStep, setDialogueStep] = useState(0);

    useEffect(() => {
        markLocationVisited("castle");
    }, [markLocationVisited]);

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                position: "relative",
                backgroundImage: `url(${bgImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: "48px",
                fontFamily: "'VT323', monospace",
                userSelect: "none"
            }}
        >
            {description && (<div
                style={{
                    backgroundColor: "rgba(32, 26, 35, 0.9)",
                    border: "4px solid #7b323e",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.7)",
                    padding: "20px 40px",
                    borderRadius: "8px",
                    textAlign: "center",
                    maxWidth: "560px",
                    position: "relative"
                }}
            >
                <h1 style={{ fontSize: "2.6rem", margin: "0 0 10px 0", color: "#ffd8a8", textShadow: "2px 2px #000" }}>
                    The Grand Fortress 
                </h1>
                <p style={{ fontSize: "1.4rem", color: "#eab67c", margin: 0 }}>
                    The majestic fortress overlooking Boboc Valley. Its ancient halls hold countless secrets.
                </p>

                <button
                    style={{
                        position: "absolute",
                        right: 10,
                        top: 10,
                        background: "none",
                        color: "red",
                        border: "none",
                        fontSize: "1.25rem",
                        cursor: "pointer"
                    }}
                    onClick={() => setDescription(false)}
                >x</button>
            </div> )}
            {!description && (
                <>
                    {/* Stefan */}
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            bottom: 0,
                            backgroundImage: `url(${charImg})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "bottom left",
                            backgroundSize: "contain",
                            width: 617,
                            height: 404,
                            pointerEvents: "none",
                        }}
                    />

                    {/* Dialogue box */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: 30,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "min(800px, 80vw)",
                            minHeight: 170,
                            boxSizing: "border-box",
                            padding: "20px 28px",
                            background: "#211a2b",
                            border: "4px solid #eab67c",
                            boxShadow: "0 0 0 4px #382535, 0 8px 20px #000",
                            borderRadius: 4,
                            color: "#fff0d0",
                            fontFamily: "'VT323', monospace",
                            fontSize: "1.6rem",
                            zIndex: 10,
                        }}
                    >
                        <h2
                            style={{
                                color: "#ffd8a8",
                                margin: "0 0 10px",
                                fontSize: "2rem",
                            }}
                        >
                            Stefan
                        </h2>

                        {dialogueStep === 0 && (
                            <>
                                <p>
                                    Halt! What are you doing here, stranger?
                                    The Grand Fortress is not a place for the
                                    unprepared.
                                </p>

                                <button onClick={() => setDialogueStep(1)}>
                                    {"I'm here to prove myself."}
                                </button>

                                <button onClick={() => setDialogueStep(2)}>
                                    {"I just got lost..."}
                                </button>
                            </>
                        )}

                        {dialogueStep === 1 && (
                            <>
                                <p>
                                    So, you seek to prove your worth? Very well!
                                    I'll put your skills to the test. Complete
                                    my challenges if you wish to proceed!
                                </p>

                                <button onClick={() => setDialogueStep(3)}>
                                    Bring it on!
                                </button>
                            </>
                        )}

                        {dialogueStep === 2 && (
                            <>
                                <p>
                                    Lost? How convenient! Nobody wanders into
                                    this fortress by accident. You'll have to
                                    prove you're worthy of being here!
                                </p>

                                <button onClick={() => setDialogueStep(3)}>
                                    Fine, test me.
                                </button>
                            </>
                        )}

                        {dialogueStep === 3 && (
                            <>
                                <p>
                                    Excellent! Your trials will test your
                                    reflexes, memory, and musical talent.
                                    Are you ready to begin?
                                </p>

                                <button
                                    onClick={() => {
                                        setDialogueStep(4);
                                    }}
                                >
                                    Start the trials!
                                </button>
                            </>
                        )}

                        {dialogueStep === 4 && (
                            <>
                                <p>
                                    Your first challenge awaits! Prepare yourself,
                                    adventurer!
                                </p>

                                <button
                                    onClick={() => {
                                        // TODO: Start your first mini-game here
                                    }}
                                >
                                    Begin Challenge 1
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
