import { useEffect } from "react";
import LeaveButton from "./Components/LeaveButton";
import { useInventory } from "../context/InventoryContext";

export default function SecondHouse() {
    const { markLocationVisited } = useInventory();

    useEffect(() => {
        markLocationVisited("secondhouse");
    }, [markLocationVisited]);

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                backgroundColor: "#201a23",
                backgroundImage: "radial-gradient(#3a2b42 15%, transparent 16%)",
                backgroundSize: "24px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffd8a8",
                fontFamily: "'VT323', monospace",
                userSelect: "none"
            }}
        >
            <LeaveButton />
            <div
                style={{
                    backgroundColor: "#2b1e2e",
                    border: "4px solid #7b323e",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                    padding: "32px 48px",
                    borderRadius: "8px",
                    textAlign: "center",
                    maxWidth: "520px"
                }}
            >
                <h1 style={{ fontSize: "3rem", margin: "0 0 16px 0", color: "#ffd8a8", textShadow: "2px 2px #000" }}>
                    Laurentiu's House
                </h1>
                <p style={{ fontSize: "1.5rem", color: "#eab67c", margin: 0 }}>
                    Welcome to Laurentiu's manor. A peaceful place amidst Boboc Valley.
                </p>
            </div>
        </div>
    );
}
