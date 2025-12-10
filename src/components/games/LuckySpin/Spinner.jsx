import React, { useState, useRef, useEffect } from "react";
import { LuckyWheel } from "@lucky-canvas/react";
import axios from "axios";
import { domain } from "../../../utils/Secret";
import { useAuth } from "../../../context/AuthContext";

export default function Spinner(onSpinComplete) {
  const myLucky = useRef();
  const [prizeAmounts, setPrizeAmounts] = useState([0, 0, 0, 0, 0, 0, 0, ""]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [alert, setAlert] = useState(null);
  const { axiosInstance } = useAuth();
  const prizeImg = {
    src: "/assets/luckyspin/redpackage.webp",
    width: "65%",
    top: "40%",
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const response = await axiosInstance.get(`${domain}/api/activity/lucky-spin/rewards`, {

      });

      if (response.data?.data) {
        // Extracting reward amounts based on their position
        const amounts = response.data.data
          .sort((a, b) => a.position - b.position) // Ensure rewards are in order
          .map(item => parseInt(item.rewardAmount, 10)); // Convert to numbers

        // Ensure prizeAmounts has exactly 8 elements (including empty or default values)
        while (amounts.length < 8) amounts.push(0);
        amounts[7] = "N/A"; // Set the last section as empty if needed

        setPrizeAmounts(amounts);
      }
    } catch (error) {
      showAlert("error", "Failed to load wheel data. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = (type, message, duration = 5000) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), duration);
  };

  const handleSpin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIsError(false);
    setAlert(null);

    try {
      const response = await axiosInstance.post(`${domain}/api/activity/lucky-spin/spin`);

      const { data } = response;

      // Determine winning index based on the position
      const winningIndex = data.data.position - 1; // Adjust index (positions start from 1)

      // Start wheel animation
      myLucky.current.play();

      // Stop the wheel after 5 seconds
      setTimeout(() => {
        myLucky.current.stop(winningIndex);

        // Show result popup 2 seconds after wheel stops
        setTimeout(() => {
          if (data.data.isDefault) {
            showAlert("info", `Oh sorry, Better Luck next Time.`);
          } else {
            showAlert("success", `Congratulations! You won ₹${data.data.rewardAmount}`);
          }
          // Trigger parent component to refresh history
          if (onSpinComplete) {
            onSpinComplete();
          }
        }, 2000);
      }, 5000);
    } catch (error) {
      setIsError(true);
      const errorMessage = error.response?.data?.message || "Failed to spin wheel";

      setTimeout(() => {
        if (myLucky.current) {
          myLucky.current.stop(0);

          // Show error message 2 seconds after wheel stops
          setTimeout(() => {
            showAlert("error", errorMessage);
          }, 2000);
        }
      }, 5000);
    } finally {
      // Reset spinning state after everything is done
      setTimeout(() => {
        setIsSpinning(false);
        setIsError(false);
      }, 7000);
    }
  };

  function getBackgroundColor(index) {
    const colors = [
      "#f6f600",
      "#ed6619",
      "#f6649c",
      "#e358f5",
      "#a445e7",
      "#33a8ed",
      "#4ce9d2",
      "#51f539",
    ];
    return colors[index % colors.length];
  }

  const wheelState = {
    blocks: [
      {
        padding: "12px",
        imgs: [{ src: "/assets/luckyspin/spinBg.webp", width: "100%", rotate: true }],
      },
    ],
    prizes: prizeAmounts.map((amount, index) => ({
      fonts: [
        {
          text: index === 7 ? `${amount}` : `₹${amount}`,
          top: "10%",
          fontColor: "#ffffff",
        },
      ],
      background: getBackgroundColor(index),
      imgs: [prizeImg],
    })),
    buttons: [
      {
        radius: "45%",
        imgs: [{ src: "/assets/luckyspin/gobutton.webp", width: "70%", top: "-100%" }],
      },
    ],
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "400px",
        }}
      >
        <div className="loading-spinner"></div>
        <p style={{ marginTop: "10px" }}>Loading Spin Wheel...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
        <LuckyWheel
          ref={myLucky}
          width="350px"
          height="335px"
          blocks={wheelState.blocks}
          prizes={wheelState.prizes}
          buttons={wheelState.buttons}
          onStart={handleSpin}
        />

        {isError && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: "50%",
            }}
          >
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>

      {alert && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            padding: "1rem",
            borderRadius: "15px",
            backgroundColor: "#1d1d17d6", // Muted olive for a warning background
            // border: "1px solid #c5a817",
            color: "white", // Warm yellow for warning text
            width: "100%",
            maxWidth: "320px",
            textAlign: "center",
            fontWeight: "500",
          }}
        >
          {alert.message}
        </div>
      )}




      <style jsx>{`
        .loading-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #3498db;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

@keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
