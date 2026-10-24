import { useState, useRef } from "react"
import LeaveButton from "./Components/LeaveButton"
import bgImg from "./TentComponents/assets/tentbg.jpeg"
import shineImg from "./TentComponents/assets/shine.png"
import ampImg from "./TentComponents/assets/amp.png"
import amp2Img from "./TentComponents/assets/amp2.png"
import catImg from "./TentComponents/assets/cat.png"
import cat2Img from "./TentComponents/assets/cat2.png"
import Modal from "./Components/Modal"

export default function Tent() {
    const [collectedRing, setCollectedRing] = useState(false);
    const [collectedPick, setCollectedPick] = useState(false);

    const [catPos, setCatPos] = useState({x: 650, y: 680});
    const [catHeld, setCatHeld] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const [ampModalOpen, setAmpModalOpen] = useState(false);
    const [ampOn, setAmpOn] = useState(false);
    
    return (
        <div
        style={{
            backgroundImage: `url(${bgImg})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top left',
            backgroundSize: 'cover',
            width: '100vw',
            height: '100vh',
        }}>
            <LeaveButton/>
            {!collectedRing && (
            <div
                style={{
                    position: "absolute",
                    left: 80,
                    top: 770,
                    backgroundImage: `url(${shineImg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top left',
                    backgroundSize: 'cover',
                    width: 70,
                    height: 70,
                    cursor: "pointer" 
                }}
                onClick={() => {
                    setCollectedRing(true)
                    alert("you collected a suspicious ring")
                }}
                ></div>)
            }
            <div
                style={{
                    position: "absolute",
                    left: 1400,
                    top: 630,
                    backgroundImage: `url(${ampImg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top left',
                    backgroundSize: 'cover',
                    width: 384,
                    height: 400,
                    transform: "scale(.5)",
                    cursor: "pointer" 
                }}
                onClick={() => {
                    setAmpModalOpen(true)
                }}
            ></div>
            <Modal isOpen={ampModalOpen} onClose={() => setAmpModalOpen(false)}>
                <>
                    <div
                        style={{
                            backgroundImage: `url(${amp2Img})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'top left',
                            backgroundSize: 'cover',
                            width: 559,
                            height: 447,
                            transform: "translateX(-5%)"

                        }} 
                    >
                        <div style={{
                            position: "absolute",
                            width: 30,
                            height: 30,
                            background: (ampOn ? "rgba(255, 0, 0, 0.8)" : "rgba(0, 0, 0, 0)"),
                            borderRadius: 8,
                            left: 420,
                            top: 72,
                            cursor: "pointer"
                        }}
                        onClick={() => setAmpOn(!ampOn)}
                        >
                        
                        </div>
                    </div>
                </>
            </Modal>
            {!collectedPick && (
            <div
                style={{
                    position: "absolute",
                    left: 850,
                    top: 880,
                    backgroundImage: `url(${shineImg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top left',
                    backgroundSize: 'cover',
                    width: 70,
                    height: 70,
                    cursor: "pointer" 
                }}
                onClick={() => {
                    setCollectedPick(true)
                    alert("you collected a guitar pick")
                }}
                ></div>)
            }
            <div
                style={{
                    position: "absolute",
                    left: catPos.x,
                    top: catPos.y,
                    backgroundImage: `url(${(catHeld ? cat2Img : catImg)})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top left',
                    backgroundSize: 'cover',
                    width: 507,
                    height: 492,
                    cursor: (catHeld ? "grab" : "pointer"),
                    transform: "scale(0.35)",
                    zIndex: 2
                }}
                onDoubleClick={() => {
                    alert("Dont call me a cat. Im Morgana!")
                }}
                onPointerDown={e => {
                    setCatHeld(true)
                    e.currentTarget.setPointerCapture(e.pointerId);

                    dragOffset.current = {
                        x: e.clientX - catPos.x,
                        y: e.clientY - catPos.y,
                    };
                }}
                onPointerUp={() => setCatHeld(false)}
                onPointerMove={e => {
                    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;

                    setCatPos({
                        x: e.clientX - dragOffset.current.x,
                        y: Math.max(e.clientY - dragOffset.current.y, 400),
                    });
                }}

                ></div>


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


        </div>
    )
}