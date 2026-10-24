function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
        }}>
            <button
                onClick={onClose}
                style={{
                    position: "absolute",
                    top: 30,
                    left: 30,
                    cursor: "pointer",
                    fontSize: 30,
                    zIndex: 1001,
                }}
            >
                &#8592;
            </button>

            {children}
        </div>
    );
}

export default Modal;