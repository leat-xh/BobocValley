function Object({ pos, imgSrc, width, height, scale, zIndex, nickname = "" }) {
    
    return (
        <div
            style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                zIndex: zIndex,
            }}
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

            <div
                style={{
                    width: width,
                    height: height,
                    scale: scale,
                    backgroundImage: `url(${imgSrc})`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                }}
            />
        </div>
    );
}

export default Object;