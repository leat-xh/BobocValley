import { useEffect, useRef, useState } from "react";

const KEYS = ["j", "k", "l", ";"];
const HIT_LINE = 500;
const SPEED = 0.3;
import { beatmap } from "./beatmaps/song1";

export default function RhythmGame({}) {
    const [songTime, setSongTime] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState("");

    const startTime = useRef(null);
    const notes = useRef(beatmap.map(n => ({ ...n })));
    const [remaining, setRemaining] = useState(notes.current);

    // Game loop
    useEffect(() => {
        let frame;

        function update(timestamp) {
            if (startTime.current === null) {
                startTime.current = timestamp;
            }

            const elapsed = timestamp - startTime.current;

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
    }, []);

    // Keyboard input
    useEffect(() => {
        function handleKey(e) {
            if (e.repeat) return;

            const lane = KEYS.indexOf(e.key.toLowerCase());
            if (lane === -1) return;

            const currentTime =
                performance.now() - startTime.current;

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

        window.addEventListener("keydown", handleKey);

        return () =>
            window.removeEventListener("keydown", handleKey);
    }, []);

    return (
        <div>
            <h2>Score: {score}</h2>
            <h3>{feedback}</h3>

            <div style={{
                display: "flex",
                position: "relative",
                height: 550,
                width: 320,
                overflow: "hidden",
                background: "#181818"
            }}>
                {KEYS.map((key, lane) => (
                    <div key={key} style={{
                        width: 80,
                        height: "100%",
                        borderRight: "1px solid #555"
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
            </div>
        </div>
    ) 
}