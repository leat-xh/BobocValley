import { useState, useEffect } from "react";
import { useInventory } from "../../context/InventoryContext";
import "./InventorySidebar.css";

import slotCursor1 from "./assets/ui/UI_TravelBook_SlotCursor01a_1.png";
import slotCursor2 from "./assets/ui/UI_TravelBook_SlotCursor01a_2.png";
import slotCursor3 from "./assets/ui/UI_TravelBook_SlotCursor01a_3.png";
import slotCursor4 from "./assets/ui/UI_TravelBook_SlotCursor01a_4.png";
import iconTick from "./assets/ui/UI_TravelBook_IconTick01a.png";
import iconCross from "./assets/ui/UI_TravelBook_IconCross01a.png";

const CURSOR_FRAMES = [slotCursor1, slotCursor2, slotCursor3, slotCursor4];

export default function InventorySidebar() {
    const {
        slots,
        selectedSlot,
        setSelectedSlot,
        draggedSlot,
        setDraggedSlot,
        moveOrSwapSlots,
        notification
    } = useInventory();

    const [hoveredSlot, setHoveredSlot] = useState(null);
    const [dragOverSlot, setDragOverSlot] = useState(null);
    const [cursorFrameIdx, setCursorFrameIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCursorFrameIdx((prev) => (prev + 1) % CURSOR_FRAMES.length);
        }, 180);
        return () => clearInterval(interval);
    }, []);

    const handleDragStart = (e, index) => {
        if (!slots[index]) {
            e.preventDefault();
            return;
        }
        setDraggedSlot(index);
        setSelectedSlot(index);
        setHoveredSlot(null);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(index));
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (dragOverSlot !== index) {
            setDragOverSlot(index);
        }
    };

    const handleDragLeave = (index) => {
        if (dragOverSlot === index) {
            setDragOverSlot(null);
        }
    };

    const handleDropOnSlot = (e, targetIndex) => {
        e.preventDefault();
        e.stopPropagation();
        const rawSource = e.dataTransfer.getData("text/plain");
        const fromIndex =
            draggedSlot !== null
                ? draggedSlot
                : rawSource !== ""
                  ? parseInt(rawSource, 10)
                  : null;

        if (fromIndex !== null && !Number.isNaN(fromIndex)) {
            moveOrSwapSlots(fromIndex, targetIndex);
        }
        setDragOverSlot(null);
        setDraggedSlot(null);
    };

    const handleDragEnd = () => {
        setDragOverSlot(null);
        setDraggedSlot(null);
    };

    return (
        <>
            {notification && (
                <div className="tb-banner-toast" role="status">
                    <img
                        src={
                            notification.icon ||
                            (notification.type === "warning" ? iconCross : iconTick)
                        }
                        alt=""
                        className="tb-banner-icon"
                    />
                    <span className="tb-banner-text">{notification.text}</span>
                </div>
            )}

            <aside
                className="tb-inventory-sidebar"
                aria-label="9-Slot Non-Stackable Inventory"
            >
                <div className="tb-inventory-page">
                    <div className="tb-slots-column">
                        {slots.map((item, idx) => {
                            const isSelected = selectedSlot === idx;
                            const isHovered = hoveredSlot === idx;
                            const isDragOver = dragOverSlot === idx;
                            const isDraggingSource = draggedSlot === idx;
                            const showAnimatedCursor =
                                isSelected || isHovered || isDragOver;

                            return (
                                <div
                                    key={idx}
                                    className={[
                                        "tb-slot",
                                        isSelected ? "is-selected" : "",
                                        isDragOver ? "is-drag-over" : "",
                                        isDraggingSource ? "is-dragging-source" : ""
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                    onClick={() => setSelectedSlot(idx)}
                                    onMouseEnter={() => setHoveredSlot(idx)}
                                    onMouseLeave={() =>
                                        setHoveredSlot((prev) => (prev === idx ? null : prev))
                                    }
                                    onDragOver={(e) => handleDragOver(e, idx)}
                                    onDragLeave={() => handleDragLeave(idx)}
                                    onDrop={(e) => handleDropOnSlot(e, idx)}
                                >
                                    {showAnimatedCursor && (
                                        <div
                                            className="tb-slot-cursor"
                                            style={{
                                                backgroundImage: `url(${CURSOR_FRAMES[cursorFrameIdx]})`
                                            }}
                                        />
                                    )}

                                    {item && (
                                        <div
                                            className="tb-slot-item"
                                            draggable={true}
                                            onDragStart={(e) => handleDragStart(e, idx)}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <img
                                                src={item.icon}
                                                alt={item.name}
                                                className="tb-slot-item-img"
                                                draggable={false}
                                            />
                                        </div>
                                    )}

                                    {item && isHovered && draggedSlot === null && (
                                        <div className="tb-slot-tooltip">
                                            <div className="tb-tooltip-title">
                                                {item.name}
                                            </div>
                                            <div className="tb-tooltip-desc">
                                                {item.description}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </aside>
        </>
    );
}
