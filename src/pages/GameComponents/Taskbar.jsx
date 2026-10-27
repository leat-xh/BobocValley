import { useState } from "react";
import { useLocation } from "react-router";
import { useInventory } from "../../context/InventoryContext";
import dropdownArrow from "./assets/ui/UI_TravelBook_HandleDropdown01a.png";
import tickIcon from "./assets/ui/UI_TravelBook_IconTick01a.png";
import "./Taskbar.css";

export default function Taskbar() {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();
    const {
        visitedLocations,
        castleCompleted,
        firstHouseState,
        secondHouseState,
        tentState,
        slots
    } = useInventory();

    const isOutdoor = location.pathname === "/";
    const hasLeaveButton = location.pathname !== "/";

    let title = "Checklist";
    let tasks = [];

    if (isOutdoor) {
        if (!castleCompleted) {
            tasks = [
                {
                    id: "firsthouse",
                    label: "Visit Leatxh's House",
                    done: Boolean(visitedLocations.firsthouse)
                },
                {
                    id: "secondhouse",
                    label: "Visit Laurentiu's House",
                    done: Boolean(visitedLocations.secondhouse)
                },
                {
                    id: "tent",
                    label: "Visit Victor's Tent",
                    done: Boolean(visitedLocations.tent)
                },
                {
                    id: "castle",
                    label: "Conquer the Castle",
                    done: Boolean(castleCompleted)
                }
            ];
        } else {
            tasks = [
                {
                    id: "hideout",
                    label: "Enter the secret hideout",
                    done: Boolean(visitedLocations.hideout),
                    isSecret: true
                }
            ];
        }
    } else if (location.pathname === "/firsthouse") {
        title = "House Tasks";
        const cleanedCount = Object.values(firstHouseState?.cleanedClothes || {}).filter(Boolean).length;
        tasks = [
            {
                id: "clothes",
                label: `Clean the clothes (${cleanedCount}/3)`,
                done: cleanedCount >= 3
            },
            {
                id: "soup",
                label: "Give swamp soup to Donkey",
                done: Boolean(firstHouseState?.soupGivenToDonkey)
            },
            {
                id: "reze",
                label: "Offer Monster drink to Reze",
                done: Boolean(firstHouseState?.monsterGivenToReze)
            },
            {
                id: "code",
                label: "Find bedroom code & escape",
                done: Boolean(firstHouseState?.donkeyQuestComplete)
            }
        ];
    } else if (location.pathname === "/tent") {
        title = "Tent Tasks";
        const hasPick =
            slots?.some((s) => s?.itemId === "guitar_pick") ||
            Boolean(tentState?.pickPickedUp);
        tasks = [
            {
                id: "pick",
                label: "Find the guitar pick",
                done: Boolean(hasPick)
            },
            {
                id: "amp",
                label: "Turn on the amplifier",
                done: Boolean(tentState?.ampOn)
            },
            {
                id: "guitar",
                label: "Play the guitar rhythm game",
                done: Boolean(tentState?.rhythmWon)
            }
        ];
    } else if (location.pathname === "/secondhouse") {
        title = "Sanctum Tasks";
        const hasKnight =
            Boolean(secondHouseState?.knightPickedUp) ||
            slots?.some((s) => s?.itemId === "golden_knight");
        const hasKeycap =
            Boolean(secondHouseState?.keycapPickedUp) ||
            slots?.some((s) => s?.itemId === "mechanical_keycap");
        const hasCrest =
            Boolean(secondHouseState?.memoryWon) ||
            slots?.some((s) => s?.itemId === "strategist_crest");
        const hasInspectedClues = Boolean(
            secondHouseState?.paintingInspected ||
                secondHouseState?.journalInspected
        );

        tasks = [
            {
                id: "sh_rug_knight",
                label: "Move rug & find Golden Knight",
                done: hasKnight
            },
            {
                id: "sh_uv_keycap",
                label: "Activate UV Mode & claim Keycap",
                done: hasKeycap
            },
            {
                id: "sh_clues",
                label: "Inspect Painting or Journal",
                done: hasInspectedClues
            },
            {
                id: "sh_memory",
                label: "Beat Tactical Memory Matrix",
                done: hasCrest
            }
        ];
    } else if (location.pathname === "/fortress") {
        title = "Castle Trials";
        tasks = [
            {
                id: "castle_t1",
                label: "Challenge 1: Trivia Trial",
                done: Boolean(castleCompleted)
            },
            {
                id: "castle_t2",
                label: "Challenge 2: Deliver Team Motto",
                done: Boolean(castleCompleted)
            }
        ];
    } else if (location.pathname === "/hideout") {
        title = "Secret Hideout";
        tasks = [
            {
                id: "hideout_done",
                label: "Enter the secret hideout",
                done: true,
                isSecret: true
            }
        ];
    }

    const completedCount = tasks.filter((t) => t.done).length;

    return (
        <div
            className={`tb-taskbar-container ${
                hasLeaveButton ? "has-leave-button" : ""
            }`}
        >
            <button
                type="button"
                className="tb-taskbar-header"
                onClick={() => setIsOpen((prev) => !prev)}
                title="Toggle Task Checklist"
            >
                <div className="tb-taskbar-title">
                    <span>{title}</span>
                    <span className="tb-taskbar-badge">
                        {completedCount}/{tasks.length}
                    </span>
                </div>
                <img
                    src={dropdownArrow}
                    alt="Toggle"
                    className={`tb-taskbar-arrow ${isOpen ? "is-open" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="tb-taskbar-dropdown">
                    {tasks.map((task) => (
                        <div key={task.id} className="tb-task-item">
                            <div
                                className={`tb-checkbox ${
                                    task.done ? "is-done" : ""
                                }`}
                            >
                                {task.done && (
                                    <img
                                        src={tickIcon}
                                        alt="Completed"
                                        className="tb-checkbox-tick"
                                    />
                                )}
                            </div>
                            <span
                                className={`tb-task-label ${
                                    task.done ? "is-done" : ""
                                } ${task.isSecret ? "is-secret-hideout" : ""}`}
                            >
                                {task.label}
                            </span>
                        </div>
                    ))}

                    {isOutdoor && castleCompleted && !visitedLocations.hideout && (
                        <div className="tb-taskbar-banner-unlocked">
                            ★ The Carriage has arrived with the Secret Hideout! ★
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
