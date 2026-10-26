import { useEffect } from "react";
import LeaveButton from "./Components/LeaveButton";
import { useInventory } from "../context/InventoryContext";
import hideoutBg from "./TentComponents/assets/tentbgdark.jpeg";

export default function SecretHideout() {
    const { markLocationVisited } = useInventory();

    useEffect(() => {
        markLocationVisited("hideout");
    }, [markLocationVisited]);

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                position: "relative",
                backgroundImage: `url(${hideoutBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingBottom: "48px",
                fontFamily: "'VT323', monospace",
                userSelect: "none"
            }}
        >
            <LeaveButton />
            <div
                style={{
                    backgroundColor: "rgba(20, 15, 25, 0.92)",
                    border: "4px solid #7b323e",
                    boxShadow: "0 8px 28px rgba(0,0,0,0.8)",
                    padding: "24px 44px",
                    borderRadius: "8px",
                    textAlign: "center",
                    maxWidth: "600px"
                }}
            >
                <h1 style={{ fontSize: "2.8rem", margin: "0 0 10px 0", color: "#ffd8a8", textShadow: "2px 2px #000" }}>
                    The Secret Hideout
                </h1>
                <p style={{ fontSize: "1.45rem", color: "#eab67c", margin: 0 }}>
                    You discovered the clandestine sanctuary hidden deep within Boboc Valley!
                </p>
            </div>
        </div>
    );
}
