import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { DoubleArrow } from "@mui/icons-material";

const PuzzleSlider = ({ onPuzzleSolved }) => {
  const [backgroundPattern, setBackgroundPattern] = useState("");
  const [puzzlePieceLeft, setPuzzlePieceLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const sliderRef = useRef(null);
  const drawerRef = useRef(null);
  const navigate = useNavigate();

  const puzzlePieceWidth = 80;
  const puzzlePieceHeight = 80;
  const puzzleGapPosition = 250;
  const sliderHeight = 300;
  const sliderWidth = 350;
  const drawerHeight = 40;
  const snapTolerance = 10;

  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 50%)`;
  };

  const generateComplementaryColor = (color) => {
    const hue = parseInt(color.split("(")[1].split(",")[0]);
    const complementaryHue = (hue + 180) % 360;
    return `hsl(${complementaryHue}, 70%, 50%)`;
  };

  const generateRandomPattern = useCallback(() => {
    const baseColor = generateRandomColor();
    const complementColor = generateComplementaryColor(baseColor);
    const patternSize = Math.floor(Math.random() * 50) + 20;
    const angle = Math.floor(Math.random() * 360);

    return `
      linear-gradient(${angle}deg, ${baseColor}, ${complementColor}),
      repeating-linear-gradient(
        ${angle + 45}deg,
        transparent,
        transparent ${patternSize / 2}px,
        rgba(255,255,255,0.1) ${patternSize / 2}px,
        rgba(255,255,255,0.1) ${patternSize}px
      )
    `;
  }, []);

  useEffect(() => {
    setBackgroundPattern(generateRandomPattern());
  }, [generateRandomPattern]);

  useEffect(() => {
    if (puzzleSolved) {
      onPuzzleSolved();
    }
  }, [puzzleSolved, onPuzzleSolved]);

  const startDragging = (e) => {
    setIsDragging(true);
    if (drawerRef.current) {
      drawerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const stopDragging = () => {
    setIsDragging(false);
    if (Math.abs(puzzlePieceLeft - puzzleGapPosition) < snapTolerance) {
      setPuzzlePieceLeft(puzzleGapPosition);
      setPuzzleSolved(true);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/");
      }, 2000);
    }
  };

  const handleDragging = (e) => {
    if (!isDragging) return;

    const drawerRect = drawerRef.current.getBoundingClientRect();
    const newLeft = e.clientX - drawerRect.left - puzzlePieceWidth / 2;

    if (newLeft >= 0 && newLeft <= sliderWidth - puzzlePieceWidth) {
      setPuzzlePieceLeft(newLeft);
    }
  };

  const puzzlePiecePath = `
    M 0,20
    C 0,10 10,0 20,0
    H 60
    C 70,0 80,10 80,20
    V 60
    C 80,70 70,80 60,80
    H 20
    C 10,80 0,70 0,60
    Z
  `;

  return (
    <div
      style={{
        width: `${sliderWidth}px`,
        margin: "0 auto",
        position: "relative",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Image Slider */}
      <div
        ref={sliderRef}
        style={{
          width: `${sliderWidth}px`,
          height: `${sliderHeight}px`,
          position: "relative",
          border: "1px solid #ccc",
          background: backgroundPattern,
          overflow: "hidden",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        {/* Visible gap */}
        <svg
          width={puzzlePieceWidth}
          height={puzzlePieceHeight}
          style={{
            position: "absolute",
            bottom: "30px",
            left: `${puzzleGapPosition}px`,
            zIndex: 1,
          }}
        >
          <path
            d={puzzlePiecePath}
            fill="rgba(0, 0, 0, 0.4)"
            stroke="#fff"
            strokeWidth="2"
          />
        </svg>

        {/* Puzzle piece */}
        <svg
          width={puzzlePieceWidth}
          height={puzzlePieceHeight}
          style={{
            position: "absolute",
            bottom: "30px",
            left: `${puzzlePieceLeft}px`,
            zIndex: 3,
            filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.3))",
            transition: isDragging ? "none" : "left 0.2s ease-out",
          }}
        >
          <defs>
            <clipPath id="puzzlePieceClip">
              <path d={puzzlePiecePath} />
            </clipPath>
          </defs>
          <rect
            x="0"
            y="0"
            width={sliderWidth}
            height={sliderHeight}
            fill={backgroundPattern}
            clipPath="url(#puzzlePieceClip)"
            style={{
              transform: `translate(-${puzzleGapPosition}px, -${
                sliderHeight - puzzlePieceHeight - 30
              }px)`,
              filter: "brightness(1.2)",
            }}
          />
          <path
            d={puzzlePiecePath}
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            style={{
              filter:
                Math.abs(puzzlePieceLeft - puzzleGapPosition) < snapTolerance
                  ? "drop-shadow(0 0 5px #00ff00)"
                  : "none",
            }}
          />
        </svg>
      </div>

      {/* Draggable Drawer */}
      <div
        ref={drawerRef}
        onPointerDown={startDragging}
        onPointerMove={handleDragging}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        style={{
          width: `${sliderWidth}px`,
          height: `${drawerHeight}px`,
          position: "relative",
          backgroundColor: "#f0f0f0",
          marginTop: "-2px",
          cursor: "pointer",
          touchAction: "none",
          border: "1px solid #ccc",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Instructions */}
        <Tooltip title="Drag to slide the puzzle piece" placement="top">
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#333",
              fontWeight: "bold",
              zIndex: 2,
            }}
          >
            <div>Drag Me</div>
          </div>
        </Tooltip>

        {/* Progress bar */}
        <div
          style={{
            width: `${puzzlePieceLeft + puzzlePieceWidth / 2}px`,
            height: "100%",
            background: "linear-gradient(90deg, #4CAF50, #8BC34A)",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
            transition: isDragging ? "none" : "width 0.2s ease-out",
          }}
        />

        {/* Drawer handle */}
        <div
          style={{
            width: `${puzzlePieceWidth}px`,
            height: "100%",
            backgroundColor: "#ffffff",
            position: "absolute",
            left: `${puzzlePieceLeft}px`,
            transition: isDragging ? "none" : "left 0.2s ease-out",
            boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DoubleArrow style={{ fontSize: 24, color: "#007bff" }} />
        </div>
      </div>

      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: "0 0 10px 0", color: "#007bff" }}>
            Congratulations!
          </h2>
          <p style={{ margin: "0", fontSize: "18px" }}>Puzzle Solved!</p>
        </div>
      )}

      {puzzleSolved && (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: `${sliderHeight + drawerHeight}px`,
            background:
              "linear-gradient(45deg, rgba(76, 175, 80, 0.6), rgba(139, 195, 74, 0.6))",
            borderRadius: "10px",
            zIndex: 4,
          }}
        />
      )}
    </div>
  );
};

export default PuzzleSlider;
