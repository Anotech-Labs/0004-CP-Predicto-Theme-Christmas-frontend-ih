import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { DoubleArrow, Refresh } from "@mui/icons-material";

const PuzzleSlider = ({ onPuzzleSolved }) => {
  const [puzzlePieceLeft, setPuzzlePieceLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [puzzleGapPosition, setPuzzleGapPosition] = useState(0);
  const [puzzleTopPosition, setPuzzleTopPosition] = useState(20);
  const sliderRef = useRef(null);
  const drawerRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Array of possible background images
  const backgroundImages = [
    "/assets/login/puzzleImage1.webp",
    "/assets/login/puzzleImage2.webp",
    "/assets/login/puzzleImage3.webp",
    "/assets/login/puzzleImage4.webp",
    "/assets/login/puzzleImage5.webp"
  ];

  // Base dimensions that will be scaled
  const BASE_WIDTH = 340;
  const BASE_HEIGHT = 212;
  const BASE_PIECE_SIZE = 65;
  const BASE_DRAWER_HEIGHT = 40;

  // Calculate current dimensions based on container width
  const getScaledDimensions = () => {
    const scale = containerWidth / BASE_WIDTH;
    return {
      sliderWidth: containerWidth || 350,
      sliderHeight: BASE_HEIGHT * scale,
      puzzlePieceWidth: BASE_PIECE_SIZE * scale,
      puzzlePieceHeight: BASE_PIECE_SIZE * scale,
      drawerHeight: BASE_DRAWER_HEIGHT * scale,
    };
  };

  const dimensions = getScaledDimensions();
  const snapTolerance = dimensions.puzzlePieceWidth * 0.1;

  // Generate random positions for puzzle piece while ensuring it stays within bounds
  // and is at least 40% from the left side of the image
  const generateRandomPositions = () => {
    // Add padding to keep piece fully within visible area
    const horizontalPadding = 10;
    const verticalPadding = 10;

    // Calculate the 40% mark from the left edge
    const minLeftPosition = dimensions.sliderWidth * 0.4;

    // Calculate max positions to ensure piece stays within bounds
    const maxHorizontalPosition = dimensions.sliderWidth - dimensions.puzzlePieceWidth - horizontalPadding;
    const maxVerticalPosition = dimensions.sliderHeight - dimensions.puzzlePieceHeight - verticalPadding;

    // Generate random positions that ensures the piece is at least 40% from the left
    // and stays within the right boundary
    const randomHorizontalPosition = Math.max(
      minLeftPosition,
      Math.min(maxHorizontalPosition, minLeftPosition + Math.random() * (maxHorizontalPosition - minLeftPosition))
    );

    const randomVerticalPosition = Math.max(
      verticalPadding,
      Math.min(maxVerticalPosition, Math.random() * maxVerticalPosition)
    );

    return {
      horizontal: randomHorizontalPosition,
      vertical: randomVerticalPosition
    };
  };

  // Initialize random positions and image on mount
  useEffect(() => {
    // Wait until container width is set
    if (containerWidth <= 0) return;

    const randomImageIndex = Math.floor(Math.random() * backgroundImages.length);
    setCurrentImage(randomImageIndex);

    const positions = generateRandomPositions();
    setPuzzleGapPosition(positions.horizontal);
    setPuzzleTopPosition(positions.vertical);
  }, [containerWidth]);

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.parentElement.clientWidth;
        const maxWidth = Math.min(parentWidth, BASE_WIDTH);
        setContainerWidth(maxWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

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
    const newLeft = e.clientX - drawerRect.left - dimensions.puzzlePieceWidth / 2;

    if (newLeft >= 0 && newLeft <= dimensions.sliderWidth - dimensions.puzzlePieceWidth) {
      setPuzzlePieceLeft(newLeft);
    }
  };

  const puzzlePiecePath = `M228.246,292.11H129.05l10.79-24.609c1.559-3.546,2.339-7.309,2.339-11.208 c0-15.467-12.585-28.053-28.053-28.053c-15.47,0-28.052,12.586-28.052,28.053c0,3.899,0.783,7.674,2.33,11.208l10.772,24.604 H0.005V63.868h90.699c0.174-0.257,0.274-0.538,0.274-0.76c0-0.034,0-0.072-0.006-0.106c-0.854-0.726-1.529-1.307-2.43-2.19 C81.916,53.99,78.319,45.15,78.319,35.81C78.319,16.065,94.387,0,114.131,0s35.81,16.065,35.81,35.81 c0,9.352-3.594,18.191-10.124,24.896l-2.242,1.987c-0.083,0.192-0.111,0.332-0.111,0.403c0,0.257,0.1,0.521,0.263,0.761h90.519 v90.622c0.252,0.137,0.572,0.245,0.887,0.245c0.543-0.577,1.212-1.366,2.178-2.338c6.822-6.619,15.668-10.216,24.988-10.216 c19.738,0,35.807,16.071,35.807,35.81c0,19.75-16.068,35.812-35.807,35.812c-9.332,0-18.178-3.597-24.908-10.138l-1.978-2.162 c-0.366-0.057-0.841,0.041-1.167,0.206V292.11z`;

  const refreshPuzzle = () => {
    // Random image selection
    const randomImageIndex = Math.floor(Math.random() * backgroundImages.length);
    setCurrentImage(randomImageIndex);

    // Generate new random positions
    const positions = generateRandomPositions();
    setPuzzleGapPosition(positions.horizontal);
    setPuzzleTopPosition(positions.vertical);

    // Reset piece position and states
    setPuzzlePieceLeft(0);
    setPuzzleSolved(false);
    setShowPopup(false);
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[350px] mx-auto px-4"
      style={{
        '&:focus-visible': {
          outline: 'none',
          boxShadow: 'none',
        },
      }}
    >
      <div
        style={{
          // width: `${dimensions.sliderWidth}px`,
          position: "relative",
          fontFamily: "Arial, sans-serif",
          '&:focus-visible': {
            outline: 'none',
            boxShadow: 'none',
          },
        }}
      >
        <div
          ref={sliderRef}
          style={{
            width: "100%",
            height: `${dimensions.sliderHeight}px`,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.89)",
          }}
        >
          {/* Main background image with mask */}
          <div style={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}>
            <img
              src={backgroundImages[currentImage]}
              alt="Puzzle Background"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {/* White mask for puzzle gap */}
            <svg
              width={dimensions.puzzlePieceWidth}
              height={dimensions.puzzlePieceHeight}
              viewBox="0 0 292.11 292.11"
              style={{
                position: "absolute",
                top: `${puzzleTopPosition}px`,
                left: `${puzzleGapPosition}px`,
                width: `${dimensions.puzzlePieceWidth}px`,
                height: `${dimensions.puzzlePieceHeight}px`,
                zIndex: 1,
              }}
            >
              <defs>
                <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feComponentTransfer in="SourceAlpha">
                    <feFuncA type="table" tableValues="1 0" />
                  </feComponentTransfer>
                  <feGaussianBlur stdDeviation="6" />  {/* Adjust blur for shadow softness */}
                  <feOffset dx="2" dy="2" result="offsetblur" />  {/* Controls shadow direction */}
                  <feComposite in2="SourceAlpha" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path
                d={puzzlePiecePath}
                fill="rgba(0, 0, 0, 0.3)"
                stroke="rgba(255, 255, 255, 0.94)"
                strokeWidth="10"
                style={{ filter: "url(#innerShadow)" }}
              />
            </svg>
          </div>

          {/* Movable puzzle piece with clipped background image */}
          <div
            style={{
              position: "absolute",
              top: `${puzzleTopPosition}px`,
              left: `${puzzlePieceLeft}px`,
              width: `${dimensions.puzzlePieceWidth}px`,
              height: `${dimensions.puzzlePieceHeight}px`,
              zIndex: 3,
              transition: isDragging ? "none" : "left 0.2s ease-out",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 292.11 292.11'%3E%3Cpath d='${puzzlePiecePath}'/%3E%3C/svg%3E")`,
                WebkitMaskSize: "100% 100%",
                maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 292.11 292.11'%3E%3Cpath d='${puzzlePiecePath}'/%3E%3C/svg%3E")`,
                maskSize: "cover",
              }}
            >
              <img
                src={backgroundImages[currentImage]}
                alt="Puzzle Piece"
                style={{
                  position: "absolute",
                  width: `${dimensions.sliderWidth}px`,
                  height: `${dimensions.sliderHeight}px`,
                  objectFit: "cover",
                  left: `-${puzzlePieceLeft}px`,
                  top: `-${puzzleTopPosition}px`,
                }}
              />
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 292.11 292.11"
                style={{ position: "absolute", top: 0, left: 0 }}
              >
                <path
                  d={puzzlePiecePath}
                  fill="none"
                  stroke="white"
                  strokeWidth="12"
                  style={{
                    filter: "drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.8))"
                  }}
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          ref={drawerRef}
          onPointerDown={startDragging}
          onPointerMove={handleDragging}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          style={{
            // width: "100%",
            height: `${dimensions.drawerHeight}px`,
            position: "relative",
            backgroundColor: "#f0f0f0",
            marginTop: "2px",
            cursor: "pointer",
            touchAction: "none",
            // border: "1px solid #ccc",
            // borderBottomLeftRadius: "10px",
            // borderBottomRightRadius: "10px",
            borderRadius:"3px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Tooltip title="Drag to slide the puzzle piece" placement="top">
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-gray-600"
              style={{
                fontSize: "6.4px",
                fontWeight: 400,
              }}
            >
              Hold and slide
            </div>
          </Tooltip>

          <div
            style={{
              width: `${puzzlePieceLeft + dimensions.puzzlePieceWidth / 2}px`,
              height: "100%",
              background: "linear-gradient(90deg, #4CAF50, #8BC34A)",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
              transition: isDragging ? "none" : "width 0.2s ease-out",
              opacity: 0.7,
            }}
          />

          <div
            style={{
              width: `${dimensions.puzzlePieceWidth}px`,
              height: "100%",
              background: "#ffffff",
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
            <DoubleArrow className="text-sm sm:text-base md:text-lg text-blue-500" />
          </div>
        </div>
        <div className="flex justify-center text-gray-600" style={{ marginTop: "0", marginLeft: "0", backgroundColor: "#222121" }}>
          <button
            onClick={refreshPuzzle}
            style={{
              border: "none",
              width: "40px",
              background: "#222121",
              marginTop: "0",
              marginLeft: "0",
              height: "40px"
            }}
          >
            <Refresh sx={{ color: "#ffffff", fontSize: "20px", cursor: "pointer" }} />
          </button>
        </div>
        {showPopup && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         bg-white p-4 sm:p-6 rounded-lg shadow-lg z-50 text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl text-blue-500 mb-2">
              Congratulations!
            </h2>
            <p className="text-base sm:text-lg">Puzzle Solved!</p>
          </div>
        )}

        {puzzleSolved && (
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: `${dimensions.sliderHeight + dimensions.drawerHeight}px`,
              background: "linear-gradient(45deg, rgba(76, 175, 80, 0.6), rgba(139, 195, 74, 0.6))",
              borderRadius: "10px",
              zIndex: 4
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PuzzleSlider;