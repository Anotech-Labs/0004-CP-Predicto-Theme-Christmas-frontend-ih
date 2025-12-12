import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Grid from "@mui/material/Grid";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Mobile from "../../components/layout/Mobile";

// Bonus data array
const bonusData = [
  { winningRate: "10X-19X", betAmount: "₹30-₹99999", bonus: "₹50.00" },
  { winningRate: "20X-29X", betAmount: "₹30-₹99999", bonus: "₹100.00" },
  { winningRate: "30X-39X", betAmount: "₹30-₹99999", bonus: "₹200.00" },
  { winningRate: "40X-59X", betAmount: "₹30-₹99999", bonus: "₹300.00" },
  { winningRate: "60X-999999X", betAmount: "₹30-₹99999", bonus: "₹500.00" },
];

const Rule = () => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate(-1);
  };

  return (
    <div>
      <Mobile>
        <Box
          sx={{
            bgcolor: "#232626",
            minHeight: "100vh",
            p: 0,
            maxWidth: "sm",
            mx: "auto",
          }}
        >
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
                onClick={handleRedirect}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
              </IconButton>
              <Typography
                variant="h6"
                sx={{ color: "#ffffff", textAlign: "center", fontSize: "19px" }}
              >
                Rule
              </Typography>
            </Grid>
          </Grid>

          <Box
            sx={{
              p: 2,
              mb: 2,
              position: "relative",
              color: "white",
              overflow: "hidden",
            }}
          >
            {/* Background Image */}
            <Box
              component="img"
              src="../../assets/activity/rule.webp"
              alt="Super Jackpot Banner"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
              }}
            />

            {/* Content */}
            <Box sx={{ position: "relative", zIndex: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={7} sx={{ textAlign: "left" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      "@media (max-width: 420px)": {
                        fontSize: "14px",
                      },
                    }}
                  >
                    Super Jackpot
                  </Typography>
                  <Typography
                    variant="caption"
                    paragraph
                    sx={{
                      fontSize: "13px",
                      "@media (max-width: 420px)": {
                        fontSize: "10px",
                      },
                    }}
                  >
                    When you win the Super Jackpot in the game, you can get
                    additional platform bonuses, and the bonuses will be
                    distributed to you according to the multiple of the winning
                    prize.
                  </Typography>
                </Grid>
              </Grid>
              <Box
                sx={{
                  bgcolor: "rgba(252,69,0,0.4)",
                  p: 1.5,
                  borderRadius: 2,
                  display: "flex",
                  mb: -1,
                  justifyContent: "flex-start",
                }}
              >
                <WarningIcon
                  sx={{
                    "@media (max-width: 420px)": {
                      fontSize: "15px",
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    textAlign: "start",
                    "@media (max-width: 420px)": {
                      fontSize: "9px",
                    },
                  }}
                >
                  Warning: Please claim all bonuses before the event ends, after
                  the event ends, you will lose the chance to get the bonus.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mx: 1.5, mb: 2, mt: 1.2 }}>
            <Typography
              variant="body1"
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontSize: "17px",
              }}
            >
              <Box
                component="img"
                src="/assets/icons/bigdatabase.svg"
                alt=""
                sx={{ width: "20px", height: "20px", marginRight: "5px" }} // Adjust the size as needed
              />{" "}
              Bonus
            </Typography>
            <TableContainer
              sx={{ backgroundColor: "#ffffff", borderRadius: "10px" }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#cf7c10" }}>
                    <TableCell
                      sx={{
                        color: "#ffffff",
                        borderBottom: "transparent",
                        textAlign: "center",
                        padding: "8px",
                        fontSize: "13px",
                      }}
                    >
                      Winning rate
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#ffffff",
                        borderBottom: "transparent",
                        textAlign: "center",
                        padding: "8px",
                        fontSize: "13px",
                      }}
                    >
                      Bet amount
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#ffffff",
                        borderBottom: "transparent",
                        textAlign: "center",
                        padding: "8px",
                        fontSize: "13px",
                      }}
                    >
                      Bonus
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bonusData.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ bgcolor: index % 2 === 0 ? "#323738" : "#232626" }}
                    >
                      <TableCell
                        sx={{
                          color: "#dc9038",
                          borderBottom: "transparent",
                          textAlign: "center",
                          padding: "9px",
                          fontSize: "13px",
                        }}
                      >
                        {row.winningRate}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#ffffff",
                          borderBottom: "transparent",
                          textAlign: "center",
                          padding: "9px",
                          fontSize: "13px",
                        }}
                      >
                        {row.betAmount}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#d23838",
                          borderBottom: "transparent",
                          textAlign: "center",
                          padding: "9px",
                          fontSize: "13px",
                        }}
                      >
                        {row.bonus}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box
            sx={{
              px: 1,
              py: 2,
              mb: 2,
              bgcolor: "#323738",
              borderRadius: "10px",
              margin: 1.5,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <PlayArrowIcon sx={{ fontSize: "28px", color: "#24ee89" }} />
            <Typography
              variant="body2"
              sx={{
                color: "#B3BEC1",
                display: "inline-flex",
                alignItems: "center",
                fontSize: "13px",
                textAlign: "start",
              }}
            >
              &nbsp;All event interpretation rights belong to the platform. If
              you have any questions, please contact customer service now.
            </Typography>
          </Box>
          <Grid sx={{ mx: 1.5 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/customer-service")}
              // fullWidth
              // startIcon={<HeadsetMicIcon />}
              sx={{
                width: "100%",
                background: "linear-gradient(90deg,#24ee89,#9fe871)",
                color: "black",
                fontWeight: "bold",
                "&:hover": {
                  bgcolor: "#106518",
                },
                textTransform: "none",
                borderRadius: 10,
                margin: "25px 0",
                "&.MuiButton-root": {
                  padding: "0", // Ensures no default padding
                },
              }}
            >
              <Box
                component="img"
                src="/assets/icons/ghost.svg"
                alt="Invitation Reward Rules"
                sx={{ width: "30px", height: "40px", marginRight: "4px" }}
              />
              Contact customer service
            </Button>
          </Grid>
        </Box>

        {/* <br /> */}
      </Mobile>
    </div>
  );
};

export default Rule;
