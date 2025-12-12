import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";

const Characteristic = () => {
  const Characteristic = [
    {
      id: 1,
      imgSrc: "/assets/characteristics/103.webp",
      game: "Aviator",
      odds: 88.77,
    },
    {
      id: 2,
      imgSrc: "/assets/characteristics/100.webp",
      game: "Aviator",
      odds: 88.77,
    },
    {
      id: 3,
      imgSrc: "/assets/characteristics/110.webp",
      game: "Hilo",
      odds: 88.77,
    },
    {
      id: 4,
      imgSrc: "/assets/characteristics/107.webp",
      game: "Money Coming",
      odds: 88.77,
    },
    {
      id: 5,
      imgSrc: "/assets/characteristics/101.webp",
      game: "Super Ace",
      odds: 88.77,
    },
    {
      id: 6,
      imgSrc: "/assets/characteristics/103.webp",
      game: "Aviator",
      odds: 88.77,
    },
  ];

  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(Characteristic.length / itemsPerPage);

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
      }, 2000);
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

  const getClickHandler = (gameId) => {
    switch (gameId) {
      case 1:
        return handleAviatorClick;
      case 2:
        return handleBoomClick;
      case 3:
        return handleLimboClick;
      case 4:
        return handleHotlineClick;
      case 5:
        return handleHiloClick;
      case 6:
        return handleFortuneNekoClick;
      default:
        return () => {};
    }
  };

  // Game click handlers remain the same...
  const handleAviatorClick = () => {
    if (phoneUserUid) {
      const url = `https://jdbmain.imitator-host.site/jdb/post?iv=f1ab7cea8106a3e4&key=b4d70df8d5c2857c&uid=${phoneUserUid}&serverUrl=https://jdb.anotechsolutions.cloud&parent=imitator&gType=22&mType=22001`;
      window.location.href = url;
    } else {
      console.error("User UID not available yet.");
    }
  };

  const handleBoomClick = () => {
    if (phoneUserUid) {
      const url = ` https://jdbmain.imitator-host.site/jdb/post?iv=f1ab7cea8106a3e4&key=b4d70df8d5c2857c&uid=${phoneUserUid}&serverUrl=https://jdb.anotechsolutions.cloud&parent=imitator&gType=22&mType=22005`;
      window.location.href = url;
    } else {
      console.error("User UID not available yet.");
    }
  };

  const handleLimboClick = () => {
    if (phoneUserUid) {
      const url = `https://jdbmain.imitator-host.site/jdb/post?iv=f1ab7cea8106a3e4&key=b4d70df8d5c2857c&uid=${phoneUserUid}&serverUrl=https://jdb.anotechsolutions.cloud&parent=imitator&gType=9&mType=9018`;
      window.location.href = url;
    } else {
      console.error("User UID not available yet.");
    }
  };

  const handleHotlineClick = () => {
    if (phoneUserUid) {
      const url = `https://jdbmain.imitator-host.site/jdb/post?iv=f1ab7cea8106a3e4&key=b4d70df8d5c2857c&uid=${phoneUserUid}&serverUrl=https://jdb.anotechsolutions.cloud&parent=imitator&gType=22&mType=22009`;
      window.location.href = url;
    } else {
      console.error("User UID not available yet.");
    }
  };

  const handleHiloClick = () => {
    if (phoneUserUid) {
      const url = `https://jdbmain.imitator-host.site/jdb/post?iv=f1ab7cea8106a3e4&key=b4d70df8d5c2857c&uid=${phoneUserUid}&serverUrl=https://jdb.anotechsolutions.cloud&parent=imitator&gType=22&mType=22006`;
      window.location.href = url;
    } else {
      console.error("User UID not available yet.");
    }
  };

  const handleFortuneNekoClick = () => {
    if (phoneUserUid) {
      const url = `https://jdbmain.imitator-host.site/jdb/post?iv=f1ab7cea8106a3e4&key=b4d70df8d5c2857c&uid=${phoneUserUid}&serverUrl=https://jdb.anotechsolutions.cloud&parent=imitator&gType=22&mType=22004`;
      window.location.href = url;
    } else {
      console.error("User UID not available yet.");
    }
  };

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
          sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}
        >
          <img src="/assets/gameFilter/superJackpot.webp" alt="" width="22px" />
          <Typography
            sx={{
              fontSize: "16px",
              color: "#ffffff",
              marginRight: "12px",
              marginLeft: "6px",
              whiteSpace: "nowrap",
              fontWeight:"bold",
              fontFamily: "'Times New Roman', Times,  ",
            }}
          >
            Super Jackpot
          </Typography>
        </Grid>
      </Grid>
      <Typography
        sx={{ fontSize: "12px", textAlign: "left", color: "#b3bec1",
              fontFamily: "'Times New Roman', Times,  ", }}
      >
        When you win a super jackpot, you will receive additional rewards
      </Typography>
      <Typography
        sx={{ fontSize: "12px", textAlign: "left",  color: "#b3bec1",
              fontFamily: "'Times New Roman', Times,  ", }}
      >
        Maximum bonus{" "}
        <span style={{ color: "rgb(240, 150, 14)" }}>₹300.00</span>
      </Typography>

      {/* Slider Section */}
      <Box
        {...handlers}
        sx={{
          width: "100%",
          overflow: "hidden",
          mt: 1.4,
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            transform: `translateX(-${currentIndex * 101}%)`,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <Grid
              container
              spacing={1}
              key={pageIndex}
              sx={{ flex: "0 0 100%", mr: 2 }}
            >
              {Characteristic.slice(
                pageIndex * itemsPerPage,
                pageIndex * itemsPerPage + itemsPerPage
              ).map((game) => (
                <Grid item xs={4} key={game.id} sx={{ pr: 0, pl: 0 }}>
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: "8px",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Typography
                      sx={{
                        background:
                          "linear-gradient(180deg, #7afec3 , #02afb6 )",
                        alignItems:"center",
                        fontSize:"13px",
                        width: "40%",
                        color:"#000000",
                        position: "absolute",
                        borderRadius:"8px 0 8px 0",
                        fontWeight:"bold"
                      }}
                    >
                      25.3X
                    </Typography>
                    <img
                      src={game.imgSrc}
                      alt={game.game}
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                      }}
                    />
                    <Box
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        maxWidth: "100%",
                        height: "100%",
                        textAlign: "left",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#b3bec1",
                          fontSize: "12px",
              fontFamily: "'Times New Roman', Times,  ",
                        }}
                      >
                        {game.game}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#FED358",
                        }}
                      >
                        ₹50.00
                      </Typography>
                    </Box>
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

export default Characteristic;
