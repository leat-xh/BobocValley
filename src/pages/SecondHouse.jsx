import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useInventory } from "../context/InventoryContext";

export default function SecondHouse() {
    const navigate = useNavigate();
    const { markLocationVisited } = useInventory();

    useEffect(() => {
        markLocationVisited("secondhouse");
    }, [markLocationVisited]);

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                backgroundColor: "#18141f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                userSelect: "none"
            }}
        >
            <button
                type="button"
                onClick={() => navigate("/")}
                style={{
                    padding: "14px 34px",
                    fontFamily: "'VT323', monospace",
                    fontSize: "2.2rem",
                    color: "#fff9e6",
                    background: "linear-gradient(180deg, #b87a32 0%, #7d4913 100%)",
                    border: "3px solid #ffe1a6",
                    boxShadow: "0 5px 0 #3a2006, 0 10px 25px rgba(0,0,0,0.6)",
                    borderRadius: "6px",
                    cursor: "pointer",
                    textShadow: "1px 1px 0 #281403",
                    letterSpacing: "1px",
                    transition: "transform 0.1s ease"
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.06)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                }}
            >
                ← Leave House
            </button>
        </div>
    );
}
