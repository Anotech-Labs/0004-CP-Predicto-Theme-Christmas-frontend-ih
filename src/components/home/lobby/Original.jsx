import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { GameContext } from "../../context/GameContext";
import { SPRIBE } from "../../data/GameImg"
const Original = ({onDetailClick = () => {}}) => {
  const Original = SPRIBE; // Filter out game with ID 6
  
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(Original.length / itemsPerPage);
  const [currentCategory] = useState("SPRIBE");
  const { handleApiClick } = useContext(GameContext)

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, totalPages]);

  // Pause auto-play on user interaction
  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    // Resume after 5 seconds of no interaction
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const handleNext = () => {
    pauseAutoPlay();
    setCurrentIndex((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrev = () => {
    pauseAutoPlay();
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    trackMouse: true,
  });


  return (
    <Box sx={{ mt: 1.5, mb: 0 }}>
      {/* Header Section */}
      <Grid
        container
        alignItems="center"
        sx={{
          mt: 1,
          mb: 0,
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "space-between",
          width: "100%",
          overflowX: "auto",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        <Grid
          item
          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >

          <img src="/assets/gamefilter/miniGames2.svg" alt="" width="102px" />
        </Grid>

        <Grid
          item
          sx={{
            display: "flex",
            alignItems: "center",
            // flexShrink: 0,
            // gap: "7.5px",
            marginLeft: "2px",
          }}
        >
          <Button
            variant="contained"
            onClick={onDetailClick}
            sx={{
              marginRight: "10px",
              backgroundColor: "#ffffff",
              "&.MuiButtonBase-root": { minWidth: 0, padding: "3px 8px", boxShadow: "none", },
            }}
          ><Typography sx={{ color: "#ffffff", fontSize: "12px", textTransform: "none", fontWeight: "bold",  fontFamily: "'Times New Roman', Times,  ", }}>Detail</Typography> </Button>
          <Button
            variant="contained"
            onClick={handlePrev}
            sx={{
              backgroundColor: "#ffffff",
              "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 8px", boxShadow: "none", },
            }}
          >
            <ArrowBackIosRoundedIcon style={{ color: "#000000", fontSize: "12px" }} />
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{

              marginLeft: "10px",
              backgroundColor: "#ffffff",
              "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 8px", boxShadow: "none", },

            }}
          >
            <ArrowForwardIosRoundedIcon style={{ color: "#000000", fontSize: "12px" }} />
          </Button>
        </Grid>
      </Grid>


      {/* Slider Section */}
      <Box
        {...handlers}
        sx={{
          width: "100%",
          overflow: "hidden",
          mt: 1.4,
          position: "relative",
          // padding: "0 5px"
        }}
      >
        <Box
          sx={{
            display: "flex",
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.3s ease-in-out",
            width: "100%"
          }}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <Grid
              container
              spacing={1}
              key={pageIndex}
              sx={{
                flex: "0 0 100%",
                flexWrap: "nowrap",  // Prevent wrapping
                width: "100%",       // Explicit width
                margin: 0,           // Reset margin
                padding: 0           // Reset padding
              }}
            >
              {Original.slice(
                pageIndex * itemsPerPage,
                pageIndex * itemsPerPage + itemsPerPage
              ).map((game) => (
                <Grid item xs={4} key={game.id} sx={{
                  pr: 0.5,  // Use consistent padding
                  pl: 0.5,  // Use consistent padding
                  display: 'flex',
                  justifyContent: 'center'  // Center the content horizontally
                }}>
                  
                  <Box
                    onClick={() => handleApiClick(game.id, currentCategory, "SPRIBE")}
                    sx={{
                      position: "relative",
                      borderRadius: "8px",
                      textAlign: "center",
                      cursor: "pointer",
                      width: "100%", // Set explicit width constraint
                      maxWidth: "100%" // Prevent overflow
                    }}
                  >

                    <img
                      src={game.imgSrc}
                      alt={game.game}
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                        aspectRatio: "3/4",
                        // objectFit: "contain"
                      }}
                    />

                  </Box>
                </Grid>
              ))}
            </Grid>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Original;
