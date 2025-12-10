import React, { useState } from "react";
import Draggable from "react-draggable";
import { useNavigate } from "react-router-dom";

const CustomerSupportButton = () => {
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    
    // Track if we're dragging to distinguish between drags and taps
    const handleStart = () => {
        setIsDragging(false);
    };
    
    const handleDrag = () => {
        setIsDragging(true);
    };
    
    const handleStop = (e) => {
        // Only navigate if it was a tap, not a drag
        if (!isDragging) {
            navigate("/customer-service");
        }
        // Reset dragging state
        setTimeout(() => setIsDragging(false), 10);
    };

    return (
        <Draggable
            bounds="body"
            handle=".draggable-button"
            defaultPosition={{ x: 0, y: 0 }}
            onStart={handleStart}
            onDrag={handleDrag}
            onStop={handleStop}
        >
            <div
                className="draggable-button"
                style={{
                    position: "fixed",
                    bottom: 120,
                    right: 10,
                    zIndex: 1000,
                    cursor: "pointer",
                    touchAction: "none",
                }}
            >
                <img
                    src="/assets/floatingIcons/csIcon.webp"
                    alt="Customer Support"
                    style={{ width: 50, height: "auto", pointerEvents: "none" }}
                />
            </div>
        </Draggable>
    );
};

export default CustomerSupportButton;