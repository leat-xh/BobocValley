import { useEffect, useRef, useState } from "react";
import { useInventory } from "../../context/InventoryContext";

const KEYS = ["j", "k", "l", ";"];
const HIT_LINE = 320;
const SPEED = 0.3;
const SONG_URL = "/songs/song1.mp3"
import { beatmap1 } from "./beatmaps/song1";

export default function RhythmGame() {
    const { slots, addItem, setTentState, showNotification } = useInventory();
    const [gameStart, setGameStart] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const [songTime, setSongTime] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState("");
    const startTime = useRef(null);
    const notes = useRef(beatmap1.map(n => ({ ...n })));
    const [remaining, setRemaining] = useState(() => beatmap1.map(n => ({ ...n })));

    const [countDownTimer, setCountDownTimer] = useState(null);

    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio("/songs/song1.mp3");
        audioRef.current.preload = "auto";

        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (countDownTimer === null) return
        if (countDownTimer < 0) {
            const audio = audioRef.current;
            if (audio) {
                audio.currentTime = 0;

                audio.play()
                    .then(() => {
                        startTime.current = null;
                        setSongTime(0);
                        setGameStart(true);
                    })
                    .catch(error => {
                        console.error("Couldn't play song:", error);
                    });
            }

            return;
        }

        const timer = setTimeout(() => {
            setCountDownTimer(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countDownTimer]);

    const [pressedKeys, setPressedKeys] = useState(new Set());
    // Game loop
    useEffect(() => {
        if (!gameStart) return;
        let frame;

        function update(timestamp) {
            const audio = audioRef.current;
            if (!audio) return;

            const elapsed = audio.currentTime * 1000;

            setSongTime(elapsed);

            // Remove missed notes
            const missed = notes.current.filter(
                n => elapsed - n.time > 150
            );

            if (missed.length) {
                notes.current = notes.current.filter(
                    n => elapsed - n.time <= 150
                );

                setRemaining([...notes.current]);
                setFeedback("MISS");
            }

            frame = requestAnimationFrame(update);
        }

        frame = requestAnimationFrame(update);

        return () => cancelAnimationFrame(frame);
    }, [gameStart]);

    // Keyboard input
    useEffect(() => {
        if (!gameStart) return;
        function handleKey(e) {
            if (e.repeat) return;

            const lane = KEYS.indexOf(e.key.toLowerCase());
            if (lane === -1) return;

            setPressedKeys(prev => new Set([...prev, lane]));


            const currentTime = audioRef.current.currentTime * 1000;

            // Find closest note in the pressed lane
            const candidates = notes.current
                .filter(n => n.lane === lane)
                .sort((a, b) =>
                    Math.abs(a.time - currentTime) -
                    Math.abs(b.time - currentTime)
                );

            const note = candidates[0];
            if (!note) return;

            const difference = Math.abs(
                note.time - currentTime
            );

            if (difference > 150) return;

            let points = 0;
            let result = "";

            if (difference <= 50) {
                points = 300;
                result = "PERFECT";
            } else if (difference <= 100) {
                points = 100;
                result = "GOOD";
            } else {
                points = 50;
                result = "BAD";
            }

            setScore(prev => prev + points);
            setFeedback(result);

            notes.current = notes.current.filter(
                n => n.id !== note.id
            );

            setRemaining([...notes.current]);
        }
        function handleKeyUp(e) {
            const lane = KEYS.indexOf(e.key.toLowerCase());
            if (lane === -1) return;

            setPressedKeys(prev => {
                const next = new Set(prev);
                next.delete(lane);
                return next;
            });
        }

        window.addEventListener("keydown", handleKey);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKey);
            window.removeEventListener("keyup", handleKeyUp);
        }
    }, [gameStart]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleSongEnd = () => {
            setGameFinished(true);
            setGameStart(false);
        };

        audio.addEventListener("ended", handleSongEnd);

        return () => {
            audio.removeEventListener("ended", handleSongEnd);
        };
    }, []);

    useEffect(() => {
        if (gameFinished) {
            if (score > 10000) {
                setTentState((prev) => ({ ...prev, rhythmWon: true }));
                const hasRockstar = slots?.some((s) => s?.itemId === "star_shaped_rock");
                if (!hasRockstar) {
                    addItem("star_shaped_rock");
                    showNotification("Challenge Cleared! You earned the Rockstar!", "success");
                }
            } else {
                showNotification(`Score: ${score}. You need over 10,000 points to earn the Rockstar!`, "error");
            }
        }
    }, [gameFinished, score, slots, addItem, setTentState, showNotification]);
    function retryGame() {
        const audio = audioRef.current;

        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        // Restore every note from the original beatmap
        notes.current = beatmap1.map(n => ({ ...n }));
        setRemaining([...notes.current]);

        // Reset game state
        setScore(0);
        setFeedback("");
        setSongTime(0);
        setPressedKeys(new Set());
        setGameStart(false);
        setGameFinished(false);

        // Start the countdown again
        setCountDownTimer(3);
    }

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                color: "white",
                fontFamily: "'Arial Black', Impact, sans-serif",
            }}
        >
            {gameFinished ? (
                score > 10000 ? (
                    <>
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }} 
                        >
                            <h1>You are a Rockstar!</h1>
                            <h2>Final Score: {score}</h2>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                        <h2 style={{ color: "#ff6b6b" }}>Not enough rock energy!</h2>
                        <p style={{ margin: 0, fontSize: "1.2rem" }}>Final Score: {score}</p>
                        <p style={{ margin: 0, color: "#ffd166", fontSize: "0.95rem" }}>You need over 10,000 points to earn the Rockstar!</p>
                        <button
                            style={{
                                width: 280,
                                fontSize: "1.8rem",
                                padding: "0.5rem",
                                fontWeight: "bold",
                                cursor: "pointer",
                                borderRadius: "0.75rem",
                                border: ".25rem #ef476f solid",
                                background: "#261c2c",
                                color: "#fff",
                                marginTop: "10px"
                            }} 
                            onClick={retryGame}
                        >
                            Retry!
                        </button>
                    </div>
                )
            ) : gameStart ? (
            <>
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }} 
                >
                    <h2>Score: {score}</h2>
                    <h3>{feedback}</h3>
                </div>

                <div style={{
                    display: "flex",
                    position: "relative",
                    height: 380,
                    width: 320,
                    overflow: "hidden",
                    background: "#181818"
                }}>
                    {KEYS.map((key, lane) => (
                        <div key={key} style={{
                            width: 80,
                            height: "100%",
                            borderRight: "1px solid #555",
                        }}>
                            {remaining
                                .filter(n => n.lane === lane)
                                .map(note => {
                                    const y = HIT_LINE -
                                        (note.time - songTime) * SPEED;

                                    return (
                                        <div
                                            key={note.id}
                                            style={{
                                                position: "absolute",
                                                left: lane * 80 + 5,
                                                top: y,
                                                width: 70,
                                                height: 20,
                                                background: "cyan"
                                            }}
                                        />
                                    );
                                })}
                        </div>
                    ))}

                    <div style={{
                        position: "absolute",
                        top: HIT_LINE,
                        width: "100%",
                        height: 3,
                        background: "yellow"
                    }} />
                    <div style={{
                        position: "absolute",
                        top: HIT_LINE + 20,
                        width: "100%",
                        height: 30,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-around",
                        fontWeight: "bold"
                    }} >
                        {KEYS.map((key, lane) => (
                            <div
                                key={key}
                                style={{
                                    width: 65,
                                    height: 28,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",

                                    background: pressedKeys.has(lane)
                                        ? "cyan"
                                        : "#333",

                                    color: pressedKeys.has(lane)
                                        ? "black"
                                        : "white",

                                    borderRadius: 4,
                                    transform: pressedKeys.has(lane)
                                        ? "scale(0.92)"
                                        : "scale(1)",

                                    transition: "all 0.05s"
                                }}
                            >
                                {key.toUpperCase()}
                            </div>
                        ))}
                    </div>
                </div>
            </>
            ): countDownTimer !== null ? 
            (
                <div
                style={{
                    width: 320,
                    fontSize: "2rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    textAlign: "center"
                }}>
                    {countDownTimer}...
                </div>
            )
            : (
                    <button
                        style={{
                            width: 320,
                            fontSize: "2rem",
                            padding: "0.5rem",
                            fontWeight: "bold",
                            cursor: "pointer",
                            borderRadius: "0.75rem",
                            border: ".25rem red solid"
                        }} 
                        onClick={() => {
                            setCountDownTimer(3);
                            setGameFinished(false);
                            setScore(0);
                        }}
                    >
                        Start!
                    </button>
            )}
        </div>
    ) 
}