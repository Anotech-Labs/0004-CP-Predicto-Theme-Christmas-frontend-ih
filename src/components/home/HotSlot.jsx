import React, { useState, useContext } from "react"
import { useSwipeable } from "react-swipeable"
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import { JILI, SPRIBE } from "../../data/GameImg"
import { GameContext } from "../../context/GameContext";
import { Button } from "@mui/material";
const HotSlot = () => {
  const JILIGames = JILI
  const SPRIBEGames = SPRIBE

  const navigate = useNavigate();
  const { handleApiClick } = useContext(GameContext);
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerRow = 3
  const rowsPerPage = JILIGames.length
  const itemsPerPage = itemsPerRow * rowsPerPage
  const totalPages = Math.ceil(JILIGames.length / itemsPerPage)

  const rowsPerPage2 = SPRIBEGames.length
  const itemsPerPage2 = itemsPerRow * rowsPerPage2
  const totalPages2 = Math.ceil(SPRIBEGames.length / itemsPerPage)

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
    navigate("/all-games/Mini games");
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
            <img src="/assets/gameFilter/like.webp" alt="" width="21px" />
            <Typography
              sx={{
                fontSize: "16px",
                color: "#ffffff",
                marginRight: "12px",
                marginLeft: "7px",
                whiteSpace: "nowrap",
                fontWeight: "bold",
                fontFamily: "'Times New Roman', Times,  ",
              }}
            >
              Platform recommendation
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
              {SPRIBEGames.slice(
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
                    onClick={() => handleApiClick(game.id, "SPRIBE", "SPRIBE")}
                  >
                    <img
                      src={game.imgSrc}
                      alt={game.game}
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                        aspectRatio: "3/4"
                      }}
                    />
                    <Button
                      sx={{
                        background: `linear-gradient(to right, #fed358 ${game.odds}, #18423d ${game.odds})`,
                        color: '#05012B',
                        padding: '1px 2px',
                        width: "100%",
                        border: 'none',
                        borderRadius: '5px',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        gap: "10px",
                        fontSize: '14px',
                        '&:hover': {
                          background: `linear-gradient(to right, #fed358 ${game.odds}, #18423d ${game.odds})`,
                          opacity: 0.9,
                        },
                      }}
                    >
                      <Typography sx={{ fontSize: "11.7px" }}>odds of </Typography>
                      <Typography sx={{ fontSize: "11.7px" }}>{game.odds} </Typography>
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ))}
        </Box>
      </Box>
      {/* Header Section */}
      <Box display="flex" alignItems="center">
        <Grid
          container
          alignItems="center"
          sx={{
            mt: 2,
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
            <img src="/assets/gameFilter/popular.webp" alt="" width="21px" />
            <Typography
              sx={{
                fontSize: "16px",
                color: "#ffffff",
                marginRight: "12px",
                marginLeft: "7px",
                whiteSpace: "nowrap",
                fontWeight: "bold",
                fontFamily: "'Times New Roman', Times,  ",
              }}
            >
              Popular
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
          {Array.from({ length: totalPages2 }).map((_, pageIndex) => (
            <Grid
              container
              key={pageIndex}
              sx={{ flex: "0 0 100%", mr: 2 }}
            >
              {JILIGames.slice(
                pageIndex * itemsPerPage2,
                pageIndex * itemsPerPage2 + itemsPerPage2
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
                    onClick={() => handleApiClick(game.id, "JILI", "SLOT")}
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
                    <Button
                      sx={{
                        background: `linear-gradient(to right, #fed358 ${game.odds}, #18423d ${game.odds})`,
                        color: '#05012B',
                        padding: '1px 2px',
                        width: "100%",
                        border: 'none',
                        borderRadius: '5px',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        gap: "10px",
                        fontSize: '14px',
                        '&:hover': {
                          background: `linear-gradient(to right, #fed358 ${game.odds}, #18423d ${game.odds})`,
                          opacity: 0.9,
                        },
                      }}
                    >
                      <Typography sx={{ fontSize: "11.7px" }}>odds of </Typography>
                      <Typography sx={{ fontSize: "11.7px" }}>{game.odds} </Typography>
                    </Button>
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

export default HotSlot