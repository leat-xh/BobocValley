import { useNavigate } from "react-router";

export default function LeaveButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      style={styles.button}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#f3f4f6";
        e.currentTarget.style.borderColor = "#d1d5db";
        e.currentTarget.style.color = "#111827";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#ffffff";
        e.currentTarget.style.borderColor = "#e5e7eb";
        e.currentTarget.style.color = "#374151";
      }}
    >
      <span style={styles.icon}>←</span> Leave
    </button>
  );
}

const styles = {
  button: {
    position: "fixed",
    top: "24px",
    left: "24px",
    zIndex: 1000,
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
  },
  icon: {
    fontSize: "16px",
    lineHeight: 1,
  },
};