import { useState } from "react";
import { useNavigate } from "react-router";
import { useInventory } from "../../context/InventoryContext";

export default function ResetGameButton() {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { resetAllProgress } = useInventory();
    const navigate = useNavigate();

    const handleConfirmReset = () => {
        setConfirmOpen(false);
        resetAllProgress();
        navigate("/");
    };

    return (
        <>
            {/* Bottom-Right Reset Button */}
            <div
                style={{
                    position: "fixed",
                    right: "16px",
                    bottom: "16px",
                    zIndex: 1100,
                    userSelect: "none"
                }}
            >
                <button
                    type="button"
                    onClick={() => setConfirmOpen(true)}
                    title="Reset all game progress and return to start"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 18px",
                        fontFamily: "'VT323', monospace",
                        fontSize: "1.45rem",
                        color: "#ffe0b5",
                        background: "linear-gradient(180deg, #512b3e 0%, #311422 100%)",
                        border: "2px solid #eab67c",
                        borderRadius: "6px",
                        boxShadow: "inset 0 1px 0 #9f6580, 0 4px 10px rgba(0, 0, 0, 0.65)",
                        cursor: "pointer",
                        textShadow: "1px 1px 0 #000",
                        transition: "all 0.12s ease"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.background = "linear-gradient(180deg, #6e324f 0%, #43172c 100%)";
                        e.currentTarget.style.boxShadow = "inset 0 1px 0 #c78ca8, 0 6px 14px rgba(0, 0, 0, 0.75), 0 0 10px rgba(234, 182, 124, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.background = "linear-gradient(180deg, #512b3e 0%, #311422 100%)";
                        e.currentTarget.style.boxShadow = "inset 0 1px 0 #9f6580, 0 4px 10px rgba(0, 0, 0, 0.65)";
                    }}
                >
                    <span style={{ fontSize: "1.6rem", color: "#ffd8a8" }}>↺</span>
                    <span>Reset Game</span>
                </button>
            </div>

            {/* Confirmation Modal */}
            {confirmOpen && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 3000,
                        fontFamily: "'VT323', monospace",
                        userSelect: "none"
                    }}
                    onClick={() => setConfirmOpen(false)}
                >
                    <div
                        style={{
                            backgroundColor: "#211a2b",
                            border: "4px solid #eab67c",
                            boxShadow: "inset 0 0 0 3px #53253a, 0 10px 30px rgba(0,0,0,0.85)",
                            borderRadius: "8px",
                            padding: "24px 32px",
                            maxWidth: "460px",
                            width: "90%",
                            textAlign: "center",
                            color: "#ffd8a8"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            style={{
                                fontSize: "2.3rem",
                                margin: "0 0 8px 0",
                                color: "#ffd8a8",
                                textShadow: "2px 2px #000"
                            }}
                        >
                            Reset Game?
                        </div>

                        <p
                            style={{
                                fontSize: "1.45rem",
                                color: "#ffe6bf",
                                lineHeight: 1.3,
                                margin: "0 0 20px 0"
                            }}
                        >
                            Are you sure you want to restart? This will reset all your tasks, items, and progress back to the beginning.
                        </p>

                        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                            <button
                                type="button"
                                onClick={handleConfirmReset}
                                style={{
                                    padding: "8px 22px",
                                    fontFamily: "'VT323', monospace",
                                    fontSize: "1.5rem",
                                    color: "#fff9e6",
                                    background: "linear-gradient(180deg, #c93b3b 0%, #821c1c 100%)",
                                    border: "2px solid #ff9999",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    boxShadow: "0 4px 0 #4a0c0c"
                                }}
                            >
                                ↺ Yes, Reset
                            </button>
                            <button
                                type="button"
                                onClick={() => setConfirmOpen(false)}
                                style={{
                                    padding: "8px 22px",
                                    fontFamily: "'VT323', monospace",
                                    fontSize: "1.5rem",
                                    color: "#ffd8a8",
                                    background: "linear-gradient(180deg, #512b3e 0%, #361726 100%)",
                                    border: "2px solid #eab67c",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    boxShadow: "0 4px 0 #1b0a13"
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
