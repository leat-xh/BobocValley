import { useState, useRef } from "react"
import LeaveButton from "./Components/LeaveButton"
import bgImg from "./TentComponents/assets/tentbg.jpeg"
import shineImg from "./TentComponents/assets/shine.png"
import ampImg from "./TentComponents/assets/amp.png"
import amp2Img from "./TentComponents/assets/amp2.png"
import guitarImg from "./TentComponents/assets/guitar.png"
import chickenGuitarImg from "./TentComponents/assets/chicken_guitar.png"
import catImg from "./TentComponents/assets/cat.png"
import cat2Img from "./TentComponents/assets/cat2.png"
import Modal from "./Components/Modal"
import Poster from "./TentComponents/Poster"
import RhythmGame from "./TentComponents/RhythmGame"

export default function Tent() {
    const [collectedRing, setCollectedRing] = useState(false);
    const [collectedPick, setCollectedPick] = useState(false);

    const [catPos, setCatPos] = useState({x: 650, y: 680});
    const [catHeld, setCatHeld] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const [ampModalOpen, setAmpModalOpen] = useState(false);
    const [ampOn, setAmpOn] = useState(false);

    const [guitarModalOpen, setGuitarModalOpen] = useState(false);
    
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
                    left: 1500,
                    top: 650,
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

            <div
                style={{
                    position: "absolute",
                    left: 1240,
                    top: 330,
                    backgroundImage: `url(${guitarImg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top left',
                    backgroundSize: 'cover',
                    width: 376,
                    height: 663,
                    transform: "scale(0.55) rotate(-10deg)",
                    cursor: "pointer" 
                }}
                onClick={() => {
                    if (!collectedPick) {
                        alert("You need to find the pick")
                        return;
                    }
                    if (!ampOn) {
                        alert("You need to turn on the amplifier")
                        return;
                    }
                    setGuitarModalOpen(true);
                }}
            ></div>
            <Modal isOpen={guitarModalOpen} onClose={() => setGuitarModalOpen(false)}>
                <div
                    style={{
                        backgroundImage: `url(${chickenGuitarImg})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'top left',
                        backgroundSize: 'cover',
                        width: 565,
                        height: 442,
                    }} 
                >
                </div>
                <RhythmGame/>
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

               <Poster/> 

        </div>
    )
}