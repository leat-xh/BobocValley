import { useState, useRef, useEffect, useCallback } from "react";
import { MEMORY_CARDS_DATA } from "./sanctumData";
import strategistCrestImg from "./assets/strategist_crest.svg";

function buildShuffledDeck() {
    const pairs = MEMORY_CARDS_DATA.flatMap((card, idx) => [
        { ...card, uid: `${card.pairId}_a_${idx}` },
        { ...card, uid: `${card.pairId}_b_${idx}` }
    ]);

    for (let i = pairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = pairs[i];
        pairs[i] = pairs[j];
        pairs[j] = temp;
    }

    return pairs;
}

function getStrategyRank(moves) {
    if (moves <= 9) return "★ Grandmaster Mind ★";
    if (moves <= 13) return "⚡ Master Tactician";
    return "✓ Strategic Analyst";
}

export default function MemoryMatrixGame({
    memoryWon,
    onWinGame
}) {
    const [deck, setDeck] = useState(() => buildShuffledDeck());
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedPairIds, setMatchedPairIds] = useState(() => new Set());
    const [moves, setMoves] = useState(0);
    const [isChecking, setIsChecking] = useState(false);
    const mismatchTimerRef = useRef(null);

    const totalPairs = MEMORY_CARDS_DATA.length;
    const isAllMatched = matchedPairIds.size === totalPairs;

    useEffect(() => {
        return () => {
            if (mismatchTimerRef.current) {
                clearTimeout(mismatchTimerRef.current);
            }
        };
    }, []);

    const handleRestart = useCallback(() => {
        if (mismatchTimerRef.current) {
            clearTimeout(mismatchTimerRef.current);
            mismatchTimerRef.current = null;
        }
        setDeck(buildShuffledDeck());
        setFlippedIndices([]);
        setMatchedPairIds(new Set());
        setMoves(0);
        setIsChecking(false);
    }, []);

    const handleCardClick = (index) => {
        if (isChecking) return;
        if (flippedIndices.includes(index)) return;
        const card = deck[index];
        if (matchedPairIds.has(card.pairId)) return;

        const nextFlipped = [...flippedIndices, index];
        setFlippedIndices(nextFlipped);

        if (nextFlipped.length === 2) {
            const nextMoves = moves + 1;
            setMoves(nextMoves);

            const [firstIdx, secondIdx] = nextFlipped;
            const firstCard = deck[firstIdx];
            const secondCard = deck[secondIdx];

            if (firstCard.pairId === secondCard.pairId) {
                const nextMatched = new Set(matchedPairIds);
                nextMatched.add(firstCard.pairId);
                setMatchedPairIds(nextMatched);
                setFlippedIndices([]);

                if (nextMatched.size === totalPairs) {
                    onWinGame?.(nextMoves);
                }
            } else {
                setIsChecking(true);
                mismatchTimerRef.current = setTimeout(() => {
                    setFlippedIndices([]);
                    setIsChecking(false);
                    mismatchTimerRef.current = null;
                }, 720);
            }
        }
    };

    return (
        <div className="sh-memory-container">
            <div className="sh-memory-header">
                <div className="sh-memory-stats">
                    <span className="sh-stat-pill">
                        Pairs: <strong>{matchedPairIds.size}/{totalPairs}</strong>
                    </span>
                    <span className="sh-stat-pill">
                        Moves: <strong>{moves}</strong>
                    </span>
                    {memoryWon && (
                        <span className="sh-stat-pill is-won">
                            ✓ Crest Claimed
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    className="sh-terminal-btn"
                    onClick={handleRestart}
                >
                    ↻ Shuffle Matrix
                </button>
            </div>

            <p className="sh-memory-subtitle">
                Match all 6 pairs of artifacts from the resident&apos;s daily life to unlock the{" "}
                <strong style={{ color: "#38bdf8" }}>Strategist&apos;s Crest</strong>.
            </p>

            <div className="sh-memory-grid">
                {deck.map((card, index) => {
                    const isFlipped = flippedIndices.includes(index);
                    const isMatched = matchedPairIds.has(card.pairId);
                    const revealed = isFlipped || isMatched;

                    return (
                        <button
                            key={card.uid}
                            type="button"
                            className={[
                                "sh-memory-card",
                                revealed ? "is-revealed" : "",
                                isMatched ? "is-matched" : ""
                            ]
                                .filter(Boolean)
                                .join(" ")}
                            onClick={() => handleCardClick(index)}
                            disabled={revealed || isChecking}
                            style={
                                revealed
                                    ? { borderColor: card.accent }
                                    : undefined
                            }
                        >
                            {revealed ? (
                                <div className="sh-card-face sh-card-front">
                                    <span className="sh-card-icon">{card.icon}</span>
                                    <span
                                        className="sh-card-title"
                                        style={{ color: card.accent }}
                                    >
                                        {card.title}
                                    </span>
                                    <span className="sh-card-sub">{card.subtitle}</span>
                                </div>
                            ) : (
                                <div className="sh-card-face sh-card-back">
                                    <span className="sh-card-back-emblem">♞</span>
                                    <span className="sh-card-back-label">NODE #{index + 1}</span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {isAllMatched && (
                <div className="sh-memory-victory-banner">
                    <img
                        src={strategistCrestImg}
                        alt="Strategist's Crest"
                        className="sh-victory-crest-img"
                    />
                    <div className="sh-victory-text-col">
                        <div className="sh-victory-title">
                            Matrix Synchronized in {moves} Moves! ({getStrategyRank(moves)})
                        </div>
                        <div className="sh-victory-desc">
                            The <strong>Strategist&apos;s Crest</strong> has been added to your inventory.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
