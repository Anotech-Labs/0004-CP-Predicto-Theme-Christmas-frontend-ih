import React, { useState,useContext } from "react"
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { useSwipeable } from "react-swipeable"
import { useNavigate } from "react-router-dom";
import { SPORT } from "../../data/GameImg";
import { GameContext } from "../../context/GameContext";

const Sports = () => {
  const Sports = SPORT
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 3
  const totalPages = Math.ceil(Sports.length / itemsPerPage)
  const { handleApiClick } = useContext(GameContext)
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

  const visibleGames = Sports.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  )

  return (
    <Box sx={{ mt: 0, mb: 0,}}>
      {/* Header Section */}
      <Box sx={{ }}>
        <Grid
          container
          alignItems="center"
          sx={{
            mt: 0,
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
           <img src="/assets/gameFilter/sports.webp" alt="" width="21px" />
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
              Sports
            </Typography>            
          </Grid>   
        </Grid>


      {/* Games Grid */}
      <Box {...handlers} sx={{ flexGrow: 1, maxWidth: 600, margin: "auto" }}>
        <Box sx={{ paddingTop: "12px" }}>
          <Grid container spacing={1}>
            {visibleGames.map((game) => (
              <Grid item xs={4} sm={4} md={4} key={game.id}>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "8px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleApiClick(game.id, "SPORT", "SPORT")}
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
        </Box>
      </Box>
    </Box>
    
    </Box>
  )
}

export default Sports
