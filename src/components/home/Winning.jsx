import React from "react";
import { Box, Grid, Typography, Divider } from "@mui/material";
import { useState, useEffect } from "react";

const Winning = () => {
  const initialWinners = [
    {
      id: 1,
      txt: "Mem***GGD",
      image: "/assets/avatars/profile-1.webp",
      txt2: "28.09",
      image1: "/assets/icons/winningInformation.webp",
    },
    {
      id: 2,
      txt: "Mem***DHF",
      image: "/assets/avatars/profile-2.webp",
      txt2: "39.03",
      image1: "/assets/icons/winningInformation.webp",
    },
    {
      id: 3,
      txt: "Mem***SKL",
      image: "/assets/avatars/profile-3.webp",
      txt2: "13.36",
      image1: "/assets/icons/winningInformation.webp",
    },
    {
      id: 4,
      txt: "Mem***PID",
      image: "/assets/avatars/profile-4.webp",
      txt2: "16.90",
      image1: "/assets/icons/winningInformation.webp",
    },
    {
      id: 5,
      txt: "Mem***JYR",
      image: "/assets/avatars/profile-5.webp",
      txt2: "69.03",
      image1: "/assets/icons/winningInformation.webp",
    },
    {
      id: 6,
      txt: "Mem***MKL",
      image: "/assets/avatars/profile-6.webp",
      txt2: "139.03",
      image1: "/assets/icons/winningInformation.webp",
    },
    {
      id: 7,
      txt: "Mem***MKL",
      image: "/assets/avatars/profile-6.webp",
      txt2: "19.53",
      image1: "/assets/icons/winningInformation.webp",
    },
    {
      id: 8,
      txt: "Mem***MKL",
      image: "/assets/avatars/profile-6.webp",
      txt2: "539.03",
      image1: "/assets/icons/winningInformation.webp",
    },
    {
      id: 9,
      txt: "Mem***MKL",
      image: "/assets/avatars/profile-6.webp",
      txt2: "181.23",
      image1: "/assets/icons/winningInformation.webp",
    },
    {
      id: 10,
      txt: "Mem***XYZ",
      image: "/assets/icons/winningInformation.webp",
      txt2: "99.99",
      image1: "/assets/icons/winningInformation.webp",
    },
  ];

  const [winners, setWinners] = useState(initialWinners);
  const [visibleCards, setVisibleCards] = useState(initialWinners.slice(0, 9));
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    const rotateWinners = () => {
      // 1. Trigger the animation to slide down the existing cards
      setAnimationClass("slide-down");

      // 2. Wait for the animation to complete, then update the visible cards
      setTimeout(() => {
        setWinners((prevWinners) => {
          const newWinners = [...prevWinners];
          const nextWinner = newWinners[5]; // Get the next card in the list
          newWinners.push(nextWinner); // Add it to the end
          newWinners.shift(); // Remove the oldest card
          setVisibleCards(newWinners.slice(0, 9)); // Update visible cards
          return newWinners;
        });

        // 3. Reset the animation class
        setAnimationClass("");
      }, 600); // Match this duration with the CSS animation duration
    };

    const interval = setInterval(rotateWinners, 3000); // Rotate every 3 seconds
    return () => clearInterval(interval);
  }, [winners.length]);

  return (
    <>
      <style>
        {`
          @keyframes slideDown {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(100%);
            }
          }

          .winner-container {
            position: relative;
            overflow: hidden;
            height: 375px; /* Adjust based on your card height */
          }

          .winner-item {
            transition: all 0.6s ease;
          }

          .slide-down .winner-item {
            animation: slideDown 0.6s forwards;
          }

          .winner-item.slide-in {
            animation: slideIn 0.6s forwards;
          }
        `}
      </style>

      {/* <Box display="flex" alignItems="center" mt={4} mb={-1} mx={"13px"}>

        <img src="/assets/icons/winningInformation.webp" alt="" width="25px" />
        <Typography
          align="left"
          sx={{
            fontSize: "14px",
            color: "#1E2637",
            display: "flex",
            marginLeft: "2px",
            alignItems: "center",
            fontWeight: "bold",
            fontFamily: "'Times New Roman', Times,  ",
          }}
        >
          Winning information
        </Typography>
      </Box> */}

      <Box sx={{ mt:3,mx: 1.5, background: "#323738", width: "calc(100% - 25px)", borderRadius: "15px" }}>
        <Grid sx={{ display: "flex", justifyContent: "space-between", px: "10px", mt: 2, py: 2 }}>
          <Grid sx={{ color: "#B3BEC1", fontSize: "14px", width: "30%", textAlign: "left",  fontFamily: "'Times New Roman', Times,  ", }} >Game</Grid>
          <Grid sx={{ color: "#B3BEC1", fontSize: "14px", width: "30%",  fontFamily: "'Times New Roman', Times,  ", }}>Player</Grid>
          <Grid sx={{ color: "#B3BEC1", fontSize: "14px", width: "30%",textAlign:"right" ,  fontFamily: "'Times New Roman', Times,  ",}}>Profit</Grid>
        </Grid>
        <Divider sx={{ color: "#E1E1E1" }}></Divider>
        <Box sx={{  mx: "13px" }} className={`winner-container ${animationClass}`}>
          <Grid container >

            {/* <Box sx={{background:"#323738",width:"100%",borderRadius:"15px"}}> */}

            {visibleCards.map((item, index) => (
              <Grid item xs={12} key={index}>
                <Box
                  className={`winner-item ${index === 4 ? "slide-in" : ""}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#323738",
                    py: "10px",
                    borderRadius: "8px",
                    marginBottom: "2px",
                  }}
                >
                  {/* Left Section: User Image and Info */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1,width:"30%" }}>
                    <Box sx={{ position: "relative" }}>
                      <img
                        src={item.image1}
                        alt="Winner"
                        style={{
                          width: "22px",
                        }}
                      />
                    </Box>
                    <Box sx={{ textAlign: "left" }}>
                      <Typography sx={{ color: "#ffffff", fontSize: "12.8px",  fontFamily: "'Times New Roman', Times,  ", }}>
                        Card 365
                      </Typography>
                    </Box>
                  </Box>

                  {/* Right Section: Details and Amount */}
                  <Box sx={{ textAlign: "center",display:"flex",justifyContent:"center",width:"30%" }}>
                    <Typography sx={{ color: "#ffffff", fontSize: "12.8px" ,  fontFamily: "'Times New Roman', Times,  ",}}>
                      {item.txt}
                    </Typography>
                    </Box>

                  {/* Right Section: Details and Amount */}
                  <Box sx={{ textAlign: "right" ,width:"30%"}}>
                    <Typography sx={{ color: "#24ee89", fontSize: "12.8px", mt: "5px" ,  fontFamily: "'Times New Roman', Times,  ",}}>
                      ₹{item.txt2}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ color: "#E1E1E1" }}></Divider>
              </Grid>
              
            ))}
            {/* </Box> */}
          </Grid>
        </Box></Box>
    </>
  );
};

export default Winning;