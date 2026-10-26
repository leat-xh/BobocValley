import { useState } from "react";
import { useLocation } from "react-router";
import { useInventory } from "../../context/InventoryContext";
import dropdownArrow from "./assets/ui/UI_TravelBook_HandleDropdown01a.png";
import tickIcon from "./assets/ui/UI_TravelBook_IconTick01a.png";
import "./Taskbar.css";

export default function Taskbar() {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();
    const { visitedLocations, firstHouseState, slots } = useInventory();

    const isOutdoor = location.pathname === "/";
    const hasLeaveButton = location.pathname !== "/";

    // Outside houses task list logic
    const allFourVisited = Boolean(
        visitedLocations.firsthouse &&
        visitedLocations.secondhouse &&
        visitedLocations.tent &&
        visitedLocations.castle
    );

    let title = "Checklist";
    let tasks = [];

    if (isOutdoor) {
        if (!allFourVisited) {
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
                    label: "Visit the Castle",
                    done: Boolean(visitedLocations.castle)
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
        const hasPick = slots?.some((s) => s?.itemId === "guitar_pick");
        tasks = [
            {
                id: "pick",
                label: "Find the guitar pick",
                done: Boolean(hasPick)
            },
            {
                id: "amp",
                label: "Turn on the amplifier",
                done: false
            },
            {
                id: "guitar",
                label: "Play the guitar rhythm game",
                done: false
            }
        ];
    } else if (location.pathname === "/secondhouse") {
        title = "Laurentiu's House";
        tasks = [
            {
                id: "secondhouse_done",
                label: "Visit Laurentiu's House",
                done: true
            }
        ];
    } else if (location.pathname === "/fortress") {
        title = "Castle";
        tasks = [
            {
                id: "castle_done",
                label: "Visit the Castle",
                done: true
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

                    {isOutdoor && allFourVisited && !visitedLocations.hideout && (
                        <div className="tb-taskbar-banner-unlocked">
                            ★ Secret entrance unlocked at the Windmill! ★
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
