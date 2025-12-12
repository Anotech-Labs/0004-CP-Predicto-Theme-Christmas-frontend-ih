import React, { useState } from "react"
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
// import IconButton from "@mui/material/IconButton";
// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { useSwipeable } from "react-swipeable"
import { PVC } from "../../data/GameImg";

const Pvc = () => {
  const Pvc = PVC

  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 3
  const totalPages = Math.ceil(Pvc.length / itemsPerPage)
const navigate = useNavigate();
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
    navigate("/all-games/PVC");
  };

  return (
    <Box sx={{ mt: 0, mb: 0}}>
      {/* Header Section */}
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
           <img src="/assets/gameFilter/pvc.webp" alt="" width="21px" />
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
            PVC
          </Typography>
        </Grid>
      </Grid>
      


      {/* Slider Section */}
      <Box
        {...handlers}
        sx={{
          overflow: "hidden",
          mt: 1.5,
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.3s ease-in-out",
            width: `${totalPages * 100}%`,
          }}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <Grid container spacing={0.8} key={pageIndex}>
              {Pvc.slice(
                pageIndex * itemsPerPage,
                pageIndex * itemsPerPage + itemsPerPage
              ).map((game,index) => (
                <Grid item xs={4} key={game.id}>
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: "8px",
                      textAlign: "center",
                      cursor: "pointer",
                      "&:hover": {},
                    }}
                    onClick={() => navigate(`/pvc/allgames?index=${index}`)}
                  >
                    <img
                      src={game.imgSrc}
                      alt={game.game}
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                        objectFit: "cover",
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

export default Pvc
