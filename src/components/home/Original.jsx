import React, { useState } from "react"
import { useSwipeable } from "react-swipeable"
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"

const Original = () => {
  const Original = [
    {
      id: 1,
      imgSrc: "/assets/original/800_20240807164906191.webp",
      game: "Aviator",
    },
    { id: 2, imgSrc: "/assets/original/100.webp", game: "Boom" },
    { id: 3, imgSrc: "/assets/original/902.webp", game: "Win Go" },
    { id: 4, imgSrc: "/assets/original/803.webp", game: "Aviator 5min" },
    { id: 5, imgSrc: "/assets/original/802.webp", game: "Aviator 3min" },
    { id: 6, imgSrc: "/assets/original/114.webp", game: "Horse racing" },
    { id: 7, imgSrc: "/assets/original/110.webp", game: "limbo" },
    { id: 8, imgSrc: "/assets/original/107.webp", game: "hotline" },
    { id: 9, imgSrc: "/assets/original/101.webp", game: "hilo" },
    { id: 10, imgSrc: "/assets/original/197.webp", game: "color game" },
    { id: 11, imgSrc: "/assets/original/200.webp", game: "pappu playing" },
    { id: 12, imgSrc: "/assets/original/224.webp", game: "go rush" },
    { id: 13, imgSrc: "/assets/original/229.webp", game: "mines" },
    { id: 14, imgSrc: "/assets/original/232.webp", game: "tower" },
    { id: 15, imgSrc: "/assets/original/233.webp", game: "hilo" },
    { id: 16, imgSrc: "/assets/original/235.webp", game: "limbo" },
    { id: 17, imgSrc: "/assets/original/236.webp", game: "wheel" },
  ]
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 6
  const totalPages = Math.ceil(Original.length / itemsPerPage)

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

  return (
    <Box sx={{  mb: 0}}>
      <Box display="flex" alignItems="center">
        <Grid
          container
          alignItems="center"
          sx={{
            mt: 2.1,
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
           <Grid sx={{width:"5.1px",height:"13.5px",backgroundColor:"#00ecbe",color:"transparent",borderRadius:"5px"}}>.</Grid>
            <Typography
              sx={{
                fontSize: "16px",
                color: "#FDE4BC",
                marginRight: "12px",
                marginLeft: "7px",
                whiteSpace: "nowrap",
              }}
            >
              Original
            </Typography>
            {/* <Button
              variant="outlined"
              sx={{
                borderColor: "transparent",
                backgroundColor: "#011341",
                color: "#00ecbe",
                "&:hover": {
                  borderColor: "transparent",
                  backgroundColor: "#011341",
                },
                display: "flex",
                alignItems: "center",
                px: 1.5,
                py: 0.5,
                textTransform: "none",
                borderRadius: "5px",
                height: "24px",
                minWidth: "unset",
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: "10px",
                  fontWeight: "normal",
                  color: "#00ecbe",
                  whiteSpace: "nowrap",
                }}
              >
                More{" "}
                <span style={{ color: "#f5863b", marginLeft: "4px" }}>
                  {Original.length}
                </span>
              </Typography>
            </Button> */}
          </Grid>

           {/* <Grid
          item
          sx={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            marginLeft: "auto",
            gap: "5px",
          }}
        >
           <Box
            onClick={handlePrev}
            component="img"
            src="../assets/icons/previous.svg"
            alt=""
            sx={{ width: "30px", height: "30px" }} // Adjust the size as needed
          />
          <Box
            onClick={handleNext}
            component="img"
            src="../assets/icons/next.svg"
            alt=""
            sx={{ width: "30px", height: "30px" }} // Adjust the size as needed 
          />*/}
          {/* <IconButton
            onClick={handlePrev}
            // sx={{
            //   color: "black",
            //   backgroundColor: "#f5863b",
            //   "&:hover": {
            //     backgroundColor: "#f5863b",
            //   },
            //   borderRadius: "4px",
            //   padding: "4px",
            //   minWidth: "28px",
            //   height: "28px",
            //   marginRight: "4px",
            // }}
          > */}
         
          {/* </IconButton>
          <IconButton
            onClick={handleNext}
            // sx={{
            //   color: "black",
            //   backgroundColor: "#f5863b",
            //   "&:hover": {
            //     backgroundColor: "#f5863b",
            //   },
            //   borderRadius: "4px",
            //   padding: "4px",
            //   minWidth: "28px",
            //   height: "28px",
            // }}
          > */}
          
          {/* </IconButton> */}
        {/* </Grid> */}
        </Grid>
      </Box>

      <Typography sx={{ fontSize: "11px", textAlign: "left",mt:0.4,color:"#a7a19a"}}>
      The games are independently developed by our team, fun, fair, and safe
      </Typography>

      {/* <Box sx={{ mt: 1 }}> */}
        <Box
          {...handlers}
          sx={{
            width: "100%",
            position: "relative",
            mt:1.3,
            overflow: "hidden",
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
                {Original.slice(
                  pageIndex * itemsPerPage,
                  pageIndex * itemsPerPage + itemsPerPage
                ).map((game, idx) => (
                  <Grid item xs={4} key={idx} sx={{pr: 0}}>
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
                    >
                      <img
                        src={game.imgSrc}
                        alt={game.game}
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "8px",
                          // objectFit: "cover",
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
    // </Box>
  )
}

export default Original
