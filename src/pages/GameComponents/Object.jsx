import { useState } from "react";

function Object({
    pos,
    imgSrc,
    width,
    height,
    scale,
    zIndex,
    nickname = "",
    isValidDropTarget = false,
    badge = null,
    onItemDrop,
    onClickObject
}) {
    const [isDragHovered, setIsDragHovered] = useState(false);

    const handleDragOver = (e) => {
        if (!onItemDrop) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (!isDragHovered) setIsDragHovered(true);
    };

    const handleDragLeave = () => {
        if (isDragHovered) setIsDragHovered(false);
    };

    const handleDrop = (e) => {
        if (!onItemDrop) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragHovered(false);
        const rawSlot = e.dataTransfer.getData("text/plain");
        onItemDrop(rawSlot !== "" ? parseInt(rawSlot, 10) : null);
    };

    return (
        <div
            className={[
                "tb-world-object-wrapper",
                isValidDropTarget ? "is-valid-drop-target" : "",
                isDragHovered ? "is-drag-hovered" : ""
            ]
                .filter(Boolean)
                .join(" ")}
            style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                zIndex: zIndex
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={onClickObject}
        >
            {nickname && (
                <div
                    style={{
                        position: "absolute",
                        top: -25,
                        left: "50%",
                        transform: "translateX(-50%) translateY(50%)",
                        backgroundColor: "black",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: 4,
                        whiteSpace: "nowrap",
                        zIndex: 999,
                        opacity: 0.75
                    }}
                >
                    {nickname}
                </div>
            )}

            {badge && <div className="tb-object-badge">{badge}</div>}

            <div
                style={{
                    width: width,
                    height: height,
                    scale: scale,
                    backgroundImage: `url(${imgSrc})`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    imageRendering: "pixelated"
                }}
            />
        </div>
    );
}

export default Object;
