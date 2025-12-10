import React, { useState ,useEffect} from "react";
import Draggable from "react-draggable";
import { useNavigate } from "react-router-dom";
import { domain } from "../../../utils/Secret";
import { useAuth } from "../../../context/AuthContext";

const TelegramFloat = () => {
    const navigate = useNavigate();
    const [telegramLink, setTelegramLink] = useState(""); 
    const [isDragging, setIsDragging] = useState(false);

    const { axiosInstance } = useAuth();
    // Track if we're dragging to distinguish between drags and taps

    const fetchTelegramLinks = async () => {
        try {
            const response = await axiosInstance.get(
                `${domain}/api/additional/telegram-channel/get-telegram`
            );
            const link = response.data[0]?.link;
            if (link) {
                setTelegramLink(link); // <-- save in state
            }
        } catch (error) {
            console.error("Error fetching Telegram links:", error);
        }
    };
    useEffect(() => {

        fetchTelegramLinks();
    }, []);

    const handleStart = () => {
        if (telegramLink) {
            window.open(telegramLink, "_blank"); // Open in new tab
            // or use navigate if it's an internal route
            // navigate(telegramLink);
        }
    };



    return (

        <div
            className="draggable-button"
            style={{
                position: "fixed",
                bottom: 236,
                right: 10,
                zIndex: 1000,
                cursor: "pointer",
                touchAction: "none",
            }}
            onClick={handleStart}
        >
            <img
                src="/assets/floatingIcons/telegram.webp"
                alt="Customer Support"
                style={{ width: 50, height: "auto", pointerEvents: "none" }}
            />
        </div>
    );
};

export default TelegramFloat;