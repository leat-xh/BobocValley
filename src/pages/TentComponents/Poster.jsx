export default function Poster() {
    return (
        <div
            style={{
                position: "absolute",
                left: 100,
                top: 310,
                width: 540,
                padding: 24,
                background: "#e60012",
                color: "black",
                transform: `
                    perspective(800px)
                    rotateX(10deg)
                    rotateY(25deg)
                    rotateZ(-4deg)
                    scale(0.5)
                `,
                transformOrigin: "center",
                boxShadow: "12px 12px 0px black",
                border: "5px solid white",
                fontFamily: "'Arial Black', Impact, sans-serif",
                zIndex: 10,
            }}
        >
            {/* Main headline */}
            <div
                style={{
                    background: "black",
                    color: "white",
                    padding: "8px 14px",
                    fontSize: 48,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: -2,
                    transform: "rotate(1deg)",
                    marginBottom: 18,
                    display: "inline-block",
                }}
            >
                SEIZE THE DAY.
            </div>

            {/* Quote strips */}
            {[
                "Because believe it or not,",
                "each and every one of us in this room",
                "is one day going to stop breathing,",
                "turn cold and DIE.",
            ].map((line, i) => (
                <div
                    key={i}
                    style={{
                        background: i === 3 ? "black" : "white",
                        color: i === 3 ? "#ff0018" : "black",
                        padding: "7px 12px",
                        fontSize: 19,
                        fontWeight: 900,
                        width: "fit-content",
                        maxWidth: "100%",
                        marginTop: 7,
                        transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)`,
                        boxShadow: "4px 4px 0 rgba(0,0,0,0.3)",
                    }}
                >
                    {line}
                </div>
            ))}

            {/* Decorative footer */}
            <div
                style={{
                    marginTop: 22,
                    borderTop: "3px solid black",
                    paddingTop: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: 2,
                }}
            >
                <span>JOHN KEATING</span>
                <span>TAKE YOUR HEART</span>
            </div>
        </div>
    ) 
}
