import React, { useState,useContext  } from "react"
import { useSwipeable } from "react-swipeable"
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import { GameContext } from "../../context/GameContext";
import { FISH } from "../../data/GameImg";
import { Button } from "@mui/material";
const Fishing = () => {
  const Fishing = FISH

  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerRow = 3
  const rowsPerPage = Fishing.length
  const itemsPerPage = itemsPerRow * rowsPerPage
  const totalPages = Math.ceil(Fishing.length / itemsPerPage)
  const [currentCategory] = useState("FISH");
  const navigate = useNavigate();
  const { handleApiClick } = useContext(GameContext);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    trackMouse: true,
  })

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalPages - 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleAllGamesClick = () => {
    navigate("/all-games/Fishing");
  };

  return (
    <Box sx={{ mb: 0 }}>
      {/* Header Section */}
      <Box display="flex" alignItems="center">
        <Grid
          container
          alignItems="center"
          sx={{
            // mt: 2,
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
            sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}
          >
            <img src="/assets/gameFilter/fishing.webp" alt="" width="21px" />
            <Typography
              sx={{
                fontSize: "16px",
                color: "#ffffff",
                marginRight: "12px",
                marginLeft: "7px",
                whiteSpace: "nowrap",
                fontWeight:"bold",
                fontFamily: "'Times New Roman', Times,  ",
              }}
            >
              Fishing
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Games Grid */}
      <Box
        {...handlers}
        sx={{
          width: "100%",
          position: "relative",
          mt: 1.2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <Grid
              container
              key={pageIndex}
              sx={{ flex: "0 0 100%", mr: 2 }}
            >
              {Fishing.slice(
                pageIndex * itemsPerPage,
                pageIndex * itemsPerPage + itemsPerPage
              ).map((game, idx) => (
                <Grid item xs={4} key={idx} sx={{ p: 0.5 }}>
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: "8px",
                      textAlign: "center",
                      cursor: "pointer",
                      "&:hover": {
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                    onClick={() => handleApiClick(game.id, currentCategory, "FISH")}
                  >
                    <img
                      src={game.imgSrc}
                      alt={game.game}
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
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
  )
}

export default Fishing