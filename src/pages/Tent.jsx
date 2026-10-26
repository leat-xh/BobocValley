import { useState, useRef, useEffect } from "react"
import LeaveButton from "./Components/LeaveButton"
import bgImg from "./TentComponents/assets/tentbg.jpeg"
import shineImg from "./TentComponents/assets/shine.png"
import ampImg from "./TentComponents/assets/amp.png"
import amp2Img from "./TentComponents/assets/amp2.png"
import guitarImg from "./TentComponents/assets/guitar.png"
import chickenGuitarImg from "./TentComponents/assets/chicken_guitar.png"
import catImg from "./TentComponents/assets/cat.png"
import cat2Img from "./TentComponents/assets/cat2.png"
import ringImg from "./TentComponents/assets/ring.png"
import pickImg from "./TentComponents/assets/pick.png"
import Modal from "./Components/Modal"
import Poster from "./TentComponents/Poster"
import RhythmGame from "./TentComponents/RhythmGame"
import { useInventory } from "../context/InventoryContext"

export default function Tent() {
    const { slots, draggedSlot, setDraggedSlot, addItem, showNotification, markLocationVisited } = useInventory();

    useEffect(() => {
        markLocationVisited("tent");
    }, [markLocationVisited]);

    const hasRingInInventory = slots.some((s) => s?.itemId === "suspicious_ring");
    const hasPickInInventory = slots.some((s) => s?.itemId === "guitar_pick");

    const [collectedRing, setCollectedRing] = useState(hasRingInInventory);
    const [collectedPick, setCollectedPick] = useState(hasPickInInventory);

    const [catPos, setCatPos] = useState({x: 650, y: 680});
    const [catHeld, setCatHeld] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const [ampModalOpen, setAmpModalOpen] = useState(false);
    const [ampOn, setAmpOn] = useState(false);

    const [guitarModalOpen, setGuitarModalOpen] = useState(false);
    const [tentPopup, setTentPopup] = useState(null);

    const tryOpenGuitar = () => {
        if (!collectedPick && !hasPickInInventory) {
            setTentPopup({
                title: "Missing Guitar Pick",
                message: "You need to find the guitar pick before you can play!",
                img: pickImg
            });
            return;
        }
        if (!ampOn) {
            setTentPopup({
                title: "Amplifier is Off",
                message: "You need to turn on the amplifier first! Click the amp and press its power switch.",
                img: ampImg
            });
            return;
        }
        setGuitarModalOpen(true);
    };
    
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

            {/* TravelBook Popup Modal for Ring, Guitar Pick, and Amplifier */}
            {tentPopup && (
                <div
                    className="tb-popup-overlay"
                    onClick={() => setTentPopup(null)}
                >
                    <div
                        className="tb-popup-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="tb-popup-inner">
                            {tentPopup.img && (
                                <img
                                    src={tentPopup.img}
                                    alt={tentPopup.title}
                                    className="tb-popup-img"
                                />
                            )}
                            <div className="tb-popup-title">{tentPopup.title}</div>
                            <div className="tb-popup-message">{tentPopup.message}</div>
                            <button
                                type="button"
                                className="tb-popup-btn"
                                onClick={() => setTentPopup(null)}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                    if (addItem("suspicious_ring")) {
                        setCollectedRing(true);
                        setTentPopup({
                            title: "Suspicious Ring",
                            message: "You collected a suspicious ring! It has been added to your inventory.",
                            img: ringImg
                        });
                    }
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
                onClick={tryOpenGuitar}
                onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    const rawSlot = e.dataTransfer.getData("text/plain");
                    const idx = rawSlot !== "" ? parseInt(rawSlot, 10) : draggedSlot;
                    const droppedItem = idx !== null ? slots[idx] : null;
                    setDraggedSlot(null);
                    if (droppedItem?.itemId === "guitar_pick") {
                        if (!ampOn) {
                            setTentPopup({
                                title: "Amplifier is Off",
                                message: "You need to turn on the amplifier first! Click the amp and press its power switch.",
                                img: ampImg
                            });
                            return;
                        }
                        setGuitarModalOpen(true);
                    } else {
                        tryOpenGuitar();
                    }
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
                    if (addItem("guitar_pick")) {
                        setCollectedPick(true);
                        setTentPopup({
                            title: "Guitar Pick",
                            message: "You collected a guitar pick! Drag it onto the guitar or click the guitar to play.",
                            img: pickImg
                        });
                    }
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
                    cursor: (catHeld ? "grabbing" : "grab"),
                    transform: "scale(0.35)",
                    touchAction: "none",
                    userSelect: "none",
                    zIndex: 2
                }}
                draggable={false}
                onDoubleClick={() => {
                    showNotification("Don't call me a cat. I'm Morgana!", "info", catImg);
                }}
                onPointerDown={e => {
                    e.preventDefault();
                    setCatHeld(true);
                    e.currentTarget.setPointerCapture(e.pointerId);

                    dragOffset.current = {
                        x: e.clientX - catPos.x,
                        y: e.clientY - catPos.y,
                    };
                }}
                onPointerUp={e => {
                    setCatHeld(false);
                    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                        e.currentTarget.releasePointerCapture(e.pointerId);
                    }
                }}
                onPointerCancel={() => setCatHeld(false)}
                onPointerMove={e => {
                    if (!catHeld && !e.currentTarget.hasPointerCapture(e.pointerId)) return;

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
