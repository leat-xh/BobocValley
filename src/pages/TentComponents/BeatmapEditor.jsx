import { useRef, useState, useEffect } from "react";

const KEYS = ["j", "k", "l", ";"];

export default function BeatmapEditor() {
    const audioRef = useRef(null);
    const [notes, setNotes] = useState([]);
    const [recording, setRecording] = useState(false);

    function recordNote(lane) {
        const audio = audioRef.current;

        if (!audio || audio.paused || !recording) return;

        setNotes(prev => [
            ...prev,
            {
                id: prev.length + 1,
                lane,
                time: Math.round(audio.currentTime * 1000),
            },
        ]);
    }

    function exportBeatmap() {
        const sortedNotes = [...notes].sort(
            (a, b) => a.time - b.time
        );

        const blob = new Blob(
            [JSON.stringify(sortedNotes, null, 2)],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "song1.json";
        link.click();

        URL.revokeObjectURL(url);
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.repeat) return;

            const key = event.key.toLowerCase();
            const lane = KEYS.indexOf(key);

            if (lane === -1) return;

            recordNote(lane);
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [recording]);

    return (
        <div>
            <audio
                ref={audioRef}
                src="/songs/song1.mp3"
                controls
                preload="auto"
            />

            <div>
                <button
                    onClick={() => setRecording(prev => !prev)}
                >
                    {recording ? "Stop recording" : "Record notes"}
                </button>

                <button onClick={exportBeatmap}>
                    Export beatmap
                </button>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
                {KEYS.map((key, lane) => (
                    <button
                        key={key}
                        onClick={() => recordNote(lane)}
                        style={{ padding: 16 }}
                    >
                        {key.toUpperCase()}
                    </button>
                ))}
            </div>

            <p>Recorded notes: {notes.length}</p>

            <ol>
                {notes.slice(-10).map(note => (
                    <li key={note.id}>
                        {KEYS[note.lane].toUpperCase()} —{" "}
                        {(note.time / 1000).toFixed(3)} s
                    </li>
                ))}
            </ol>
        </div>
    );
}
