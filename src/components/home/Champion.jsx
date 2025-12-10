import React from "react";
import { Box, Typography, Grid } from "@mui/material";

const Champion = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "150px",
        position: "relative",
        margin: "17px auto",

      }}
    >
      {/* Main background with trophy image */}
      <Box
  sx={{
    width: "100%",
    height: "100%",
    backgroundImage: 'url("/assets/championtasklogo.webp")',
    backgroundSize: "100% 100%", // Ensures the image fully covers the box
    backgroundPosition: "center center", // Centers the image perfectly
    backgroundRepeat: "no-repeat",
    borderRadius: "8px",
    position: "relative",
    overflow: "hidden",
  }}
></Box>
      {/* Floating card with countdown and bonus */}
      <Box
        sx={{
          position: "absolute",
          top: "15px",
          right: "10px",
          width: "140px",
          display:"flex",
          flexDirection:"column",
          justifyContent:"center",
          alignItems:"center",
          borderRadius: "8px",
          // gap:"5px"
          // padding: "8px",
        }}
      >
        {/* Countdown section */}
   <Box
  sx={{
    borderRadius: "6px",
    padding: "6px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  }}
>
  <Typography
    sx={{
      background: "linear-gradient(90deg, #ff3134 0%, #f97450 100%)",
      color: "white",
      fontSize: "11px",
      fontWeight: "500",
      padding: "4px 10px",
      textAlign: "left",
      borderRadius: "8px 8px 0 0",
    }}
  >
    Countdown
  </Typography>
  <Grid
    sx={{
      background: "rgba(253, 86, 92, .5)",
      display: "flex",
      padding: "0.5px 10px",
      borderRadius: "0 0 8px 8px",
      alignItems: "center",
      mb:"5px",
      justifyContent: "space-between",
    }}
  >
    <Typography
      sx={{
        color: "white",
        fontSize: "12px",
      }}
    >
      <span style={{ fontWeight: "bold", fontSize: "19px" }}>1</span> Days
    </Typography>
    <Typography
      sx={{
        color: "white",
        fontSize: "12px",
      }}
    >
      11:12:25
    </Typography>
  </Grid>

  {/* Bonus section (removed marginBottom to eliminate space) */}
  <Box
    sx={{
      borderRadius: "6px",
      // padding: "6px",
      display: "flex",
      flexDirection: "column",
      width: "100%",
    }}
  >
    <Typography
      sx={{
        background: "linear-gradient(90deg, #ff3134 0%, #f97450 100%)",
        color: "white",
        fontSize: "11px",
        fontWeight: "500",
        textAlign: "left",
        padding: "4px 10px",
        borderRadius: "8px 8px 0 0",
      }}
    >
      Bonus
    </Typography>
    <Typography
      sx={{
        background: "white",
        borderRadius: "0 0 8px 8px",
        color: "#D23838",
        fontSize: "12px",
        padding: "4px",
        fontWeight: "bold",
      }}
    >
      ₹1,000,000.00
    </Typography>
  </Box>
</Box>

        
      </Box>
    </Box>
  );
};

export default Champion;
