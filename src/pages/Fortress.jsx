import { useEffect } from "react";
import LeaveButton from "./Components/LeaveButton";
import { useInventory } from "../context/InventoryContext";
import guildBg from "./GameComponents/assets/guild.jpg";

export default function Fortress() {
    const { markLocationVisited } = useInventory();

    useEffect(() => {
        markLocationVisited("castle");
    }, [markLocationVisited]);

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                position: "relative",
                backgroundImage: `url(${guildBg})`,
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
                    backgroundColor: "rgba(32, 26, 35, 0.9)",
                    border: "4px solid #7b323e",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.7)",
                    padding: "20px 40px",
                    borderRadius: "8px",
                    textAlign: "center",
                    maxWidth: "560px"
                }}
            >
                <h1 style={{ fontSize: "2.6rem", margin: "0 0 10px 0", color: "#ffd8a8", textShadow: "2px 2px #000" }}>
                    The Grand Castle
                </h1>
                <p style={{ fontSize: "1.4rem", color: "#eab67c", margin: 0 }}>
                    The majestic fortress overlooking Boboc Valley. Its ancient halls hold countless secrets.
                </p>
            </div>
        </div>
    );
}
