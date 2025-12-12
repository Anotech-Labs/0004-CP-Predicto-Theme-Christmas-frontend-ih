import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Mobile from "../../components/layout/Mobile";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
const SuperJackpot = () => {
  const navigate = useNavigate();
  const navigateToPage = () => {
    navigate(-1);
  };

  const handleNavigate = () => {
    navigate(-1);
  };

  const handleWinning = () => {
    navigate("/activity/super-jackpot/winning-star");
  };
  return (
    <div>
      <Mobile>
        <Box
          maxWidth="sm"
          sx={{ bgcolor: "#232626", minHeight: "100vh", p: 0, mx: "auto" }}
        >
          {/* Header with Back Button */}
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1000,
              backgroundColor: "#232626",
              padding: "7px 12px",
            }}
          >
            <Grid
              item
              xs={12}
              container
              alignItems="center"
              justifyContent="center"
            >
              <IconButton
                sx={{
                  color: "#ffffff",
                  position: "absolute",
                  left: 0,
                  p: "12px",
                }}
                onClick={navigateToPage}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
              </IconButton>
              <Typography
                variant="h6"
                sx={{ color: "#ffffff", textAlign: "center", fontSize: "19px" }}
              >
                Super jackpot
              </Typography>
            </Grid>
          </Grid>

          {/* Super Jackpot Banner */}
          <Card
            sx={{
              backgroundColor: "#fff",
              color: "#ACAFB3",
              borderRadius: 0,
              boxShadow: "none",
              overflow: "hidden",
            }}
          >
            {/* Image at the Top */}
            <Box
              sx={{
                position: "relative",
                textAlign: "center",
                backgroundColor: "#ffffff",
                height: "160",
              }}
            >
              <CardMedia
                component="img"
                alt="Activity Award"
                height="auto"
                image="../assets/activity/superJackpot.webp" // Replace with the correct image URL
                sx={{
                  objectFit: "cover",
                  width: "100%",
                  //   height: { xs: "200px", sm: "auto" },
                  minHeight: "5rem",
                  maxHeight: "11rem",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "43%",
                  "@media (max-width: 340px)": {
                    top: "48%", // Apply when screen width is ≤ 470px
                  },
                  left: "13px",
                  transform: "translateY(-50%)", // Center vertically
                  textAlign: "left", // Align text to the left within the Box
                }}
              >
                <Grid sx={{ width: " 55%" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      marginTop: "5px",
                      color: "#fff",
                      fontSize: "22px",
                      "@media (max-width: 470px)": {
                        fontSize: "18px", // Apply when screen width is ≤ 470px
                      },
                      fontWeight: "bold",
                    }}
                  >
                    Super Jackpot
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#fff",
                      marginTop: { xs: "8px", sm: "12px" },
                      fontSize: "12px", // Small font size
                      marginBottom: "2px",
                    }}
                  >
                    When you get the Super Jackpot in 【Slots】Can get 1
                    additional bonus. <br />
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      marginTop: "5px",
                      color: "#fff",
                      fontSize: "12px", // Small font size
                    }}
                  >
                    The reward is valid for 1 day, and you will not be able to
                    claim it after it expires!
                  </Typography>
                </Grid>
              </Box>
            </Box>
          </Card>

          <Box sx={{ px: 2, pt: 1.5 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                mb: 1,
                maxWidth: 380,

                bgcolor: "#5a5145",
                color: "#b3bec1",
                height: "36px",
                fontSize: "13px",
                // fontWeight: "bold",
                py: 1,
                borderRadius: "20px",
                textTransform: "none",
                // "&:hover": {
                //     bgcolor: "#454456", // Hover background color
                // },
              }}
            >
              <Box
                component="img"
                src="/assets/icons/receiveinbatches.webp"
                alt=""
                sx={{ width: "25px", height: "25px", marginRight: "5px",filter:"brightness(50%) " }} // Adjust the size as needed
              />
              Receive in batches
            </Button>
          </Box>
          {/* Rule and Winning Star Buttons */}
          <Box sx={{ px: 1 }}>
            <Grid container spacing={1} sx={{ mb: 1, p: 1 }}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  sx={{
                    bgcolor: "#323738",
                    color: "#ffffff",
                    fontSize: "13px",
                    borderRadius: "10px",
                    py: 1.5,
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center", // Align items horizontally
                    justifyContent: "center", // Align items starting from the left
                    // fontWeight: "bold",
                  }}
                  onClick={() => navigate("/activity/super-jackpot/rule")}
                >
                  <img
                    src="/assets/icons/clipboard.svg"
                    alt="Rule Icon"
                    style={{
                      width: 18,
                      // height: 24,
                      marginRight: 8, // Add spacing between image and text
                    }}
                  />
                  Rule
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  sx={{
                    bgcolor: "#323738",
                    color: "#ffffff",
                    borderRadius: "10px",
                    py: 1.5,
                    textTransform: "none",
                    display: "flex",
                    fontSize: "13px",
                    alignItems: "center", // Align items horizontally
                    justifyContent: "center", // Align items starting from the left
                    // fontWeight: "bold",
                  }}
                  onClick={handleWinning}
                >
                  <img
                    src="/assets/icons/winningcrown.svg"
                    alt="Winning Crown Icon"
                    style={{
                      width: 24,
                      height: 24,
                      marginRight: 8, // Add spacing between image and text
                    }}
                  />
                  Winning star
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* No Jackpot Message */}
          <Box
            sx={{
              // height: 200,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#323738",
              margin: 2,
              borderRadius: "10px",
              mb: 2,
              p: 2,
            }}
          >
            <img
              src="/assets/No data-1.webp" // Replace with your dummy image path
              alt="No Data Available"
              style={{ width: "200px", height: "auto" }}
            />
            <Typography variant="body1" color="#B3BEC1">
              You don't have a big jackpot yet, let's bet
            </Typography>
          </Box>

          {/* Bet Button */}
          <Box sx={{ px: 2, pt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate("/")}
              sx={{
                background: "linear-gradient(90deg,#24ee89,#9fe871)",
                color: "black",
                // fontWeight: "bold",
                maxWidth: 350,
                borderRadius: "24px",
                alignItem: "center",
                textTransform: "none",
                py: 1,
                // "&:hover": { bgcolor: " #0F6518" },
              }}
            >
              Go bet
            </Button>
          </Box>
        </Box>
      </Mobile>
    </div>
  );
};

export default SuperJackpot;
