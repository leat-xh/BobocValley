import { useState } from "react";
import {
    SANCTUM_QUOTE,
    JOURNAL_PAGES,
    TERMINAL_LOGS
} from "./sanctumData";
import MemoryMatrixGame from "./MemoryMatrixGame";
import goldenKnightImg from "./assets/golden_knight.svg";

export function PaintingModal({ isOpen, onClose, nightMode }) {
    if (!isOpen) return null;

    return (
        <div className="sh-modal-overlay" onClick={onClose}>
            <div
                className="sh-modal-card sh-painting-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sh-modal-header">
                    <span className="sh-modal-badge">🎨 Framed Oil &amp; Neon Canvas</span>
                    <button
                        type="button"
                        className="sh-modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Stylized Canvas Artwork */}
                <div className={`sh-canvas-preview ${nightMode ? "is-night" : ""}`}>
                    <div className="sh-canvas-sky">
                        <div className="sh-canvas-moon" />
                        <div className="sh-canvas-stars" />
                    </div>
                    <div className="sh-canvas-grid-floor" />
                    <img
                        src={goldenKnightImg}
                        alt="The Golden Knight"
                        className="sh-canvas-knight"
                    />
                    <div className="sh-canvas-caption">
                        &ldquo;THE QUIET ARCHITECT OF THE VALLEY&rdquo;
                    </div>
                </div>

                {/* Engraved Brass Plaque with Personal Quote */}
                <div className="sh-plaque-box">
                    <div className="sh-plaque-label">ENGRAVED BRASS PLAQUE</div>
                    <blockquote className="sh-plaque-quote">
                        &ldquo;{SANCTUM_QUOTE}&rdquo;
                    </blockquote>
                </div>

                <p className="sh-modal-footnote">
                    Observation: The painting depicts a Golden Chess Knight overlooking a digital grid. The resident clearly values patience, clean structure, and strategic foresight over brute force.
                </p>

                <div className="sh-modal-footer">
                    <button type="button" className="sh-gold-btn" onClick={onClose}>
                        Done Inspecting
                    </button>
                </div>
            </div>
        </div>
    );
}

export function JournalModal({ isOpen, onClose }) {
    const [pageIdx, setPageIdx] = useState(0);

    if (!isOpen) return null;
    const currentPage = JOURNAL_PAGES[pageIdx];

    return (
        <div className="sh-modal-overlay" onClick={onClose}>
            <div
                className="sh-modal-card sh-journal-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sh-modal-header">
                    <span className="sh-modal-badge">📓 Strategist&apos;s Leather Journal</span>
                    <button
                        type="button"
                        className="sh-modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                <div className="sh-journal-tabs">
                    {JOURNAL_PAGES.map((page, idx) => (
                        <button
                            key={page.id}
                            type="button"
                            className={`sh-tab-btn ${idx === pageIdx ? "is-active" : ""}`}
                            onClick={() => setPageIdx(idx)}
                        >
                            {page.title}
                        </button>
                    ))}
                </div>

                <div className="sh-journal-page">
                    <h3 className="sh-journal-heading">{currentPage.heading}</h3>
                    <ul className="sh-journal-list">
                        {currentPage.entries.map((entry, idx) => (
                            <li key={idx} className="sh-journal-entry">
                                {entry}
                            </li>
                        ))}
                    </ul>
                    <div className="sh-journal-clue-box">
                        💡 {currentPage.footerClue}
                    </div>
                </div>

                <div className="sh-modal-footer">
                    <button
                        type="button"
                        className="sh-terminal-btn"
                        onClick={() =>
                            setPageIdx((prev) =>
                                prev === 0 ? JOURNAL_PAGES.length - 1 : prev - 1
                            )
                        }
                    >
                        ← Switch Page
                    </button>
                    <button type="button" className="sh-gold-btn" onClick={onClose}>
                        Close Journal
                    </button>
                </div>
            </div>
        </div>
    );
}

export function BattlestationModal({
    isOpen,
    onClose,
    memoryWon,
    onWinGame,
    nightMode,
    onToggleNightMode
}) {
    const [activeTab, setActiveTab] = useState("minigame");

    if (!isOpen) return null;

    return (
        <div className="sh-modal-overlay" onClick={onClose}>
            <div
                className="sh-modal-card sh-battlestation-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sh-modal-header">
                    <span className="sh-modal-badge">
                        🖥️ Dual-Monitor Tactical Workstation
                    </span>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <button
                            type="button"
                            className="sh-terminal-btn"
                            onClick={onToggleNightMode}
                        >
                            {nightMode ? "☀️ Day Mode" : "🌙 Cyber-UV Mode"}
                        </button>
                        <button
                            type="button"
                            className="sh-modal-close"
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="sh-journal-tabs">
                    <button
                        type="button"
                        className={`sh-tab-btn ${activeTab === "minigame" ? "is-active" : ""}`}
                        onClick={() => setActiveTab("minigame")}
                    >
                        🎮 Tactical Memory Matrix (Mini-Game)
                    </button>
                    <button
                        type="button"
                        className={`sh-tab-btn ${activeTab === "logs" ? "is-active" : ""}`}
                        onClick={() => setActiveTab("logs")}
                    >
                        💻 System Architecture &amp; Clues
                    </button>
                </div>

                {activeTab === "minigame" ? (
                    <MemoryMatrixGame
                        memoryWon={memoryWon}
                        onWinGame={onWinGame}
                    />
                ) : (
                    <div className="sh-terminal-console">
                        <div className="sh-terminal-title">
                            root@strategist-sanctum:~/boboc-valley$ cat resident_profile.log
                        </div>
                        <div className="sh-terminal-lines">
                            {TERMINAL_LOGS.map((line, i) => (
                                <div key={i} className="sh-terminal-line">
                                    {line}
                                </div>
                            ))}
                        </div>
                        <div className="sh-terminal-hint">
                            Tip: Ensure Cyber-UV Mode is active in the room to spot the glowing Artisan Keycap on the upper rack!
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
