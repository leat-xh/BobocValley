function Object({ pos, imgSrc, width, height, scale, zIndex}) {
    
    return (
        <div style={{
            position: "absolute",
            left: pos.x,
            top: pos.y,
            zIndex: zIndex
        }}>
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
    )
}

export default Object;