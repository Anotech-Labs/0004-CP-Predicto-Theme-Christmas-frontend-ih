import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Grid from "@mui/material/Grid";
import { IconButton } from "@mui/material";

import Mobile from "../../components/layout/Mobile";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { rules,rules2, rulesdata } from "../../data/PromotionData";
import { useNavigate } from "react-router-dom";

const InvitationRule = ({ children }) => {
  //   useEffect(() => {
  //     const setVh = () => {
  //       const vh = window.innerHeight * 0.01;
  //       document.documentElement.style.setProperty('--vh', `${vh}px`);
  //     };

  //     window.addEventListener('resize', setVh);
  //     setVh();

  //     return () => window.removeEventListener('resize', setVh);
  //   }, []);

  const navigate = useNavigate(); // Hook for navigation

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  const rows = [
    { stars: "L0", coins: 0, goldCoins: 0, teamRanking: "0" },
    { stars: "L1", coins: "500K", goldCoins: "100K", teamRanking: "100k" },
    { stars: "L2", coins: "1,000K", goldCoins: "200K", teamRanking: "500k" },
    { stars: "L3", coins: "2.5M", goldCoins: "500K", teamRanking: "700k" },
    { stars: "L4", coins: "3.5M", goldCoins: "700K", teamRanking: "700k" },
    { stars: "L5", coins: "5M", goldCoins: "1,000K", teamRanking: "1000k" },
    { stars: "L6", coins: "10M", goldCoins: "2M", teamRanking: "2M" },
    { stars: "L7", coins: "100M", goldCoins: "20M", teamRanking: "20M" },
    { stars: "L8", coins: "500M", goldCoins: "100M", teamRanking: "100M" },
    { stars: "L9", coins: "1,000M", goldCoins: "200M", teamRanking: "200M" },
    { stars: "L10", coins: "1,500M", goldCoins: "300M", teamRanking: "300M" },
  ];

  const rows2 = [
    { stars: 1, tier1: "0.64%", tier2: "0.18%", tier3: "0.054%", tier4: "0" },
    { stars: 2, tier1: "0.7%", tier2: "0.245%", tier3: "0.0858%", tier4: "0" },
    {
      stars: 3,
      tier1: "0.75%",
      tier2: "0.2812%",
      tier3: "0.1054%",
      tier4: "0.1",
    },
    { stars: 4, tier1: "0.8%", tier2: "0.32%", tier3: "0.128%", tier4: "0.2" },
    {
      stars: 5,
      tier1: "0.85%",
      tier2: "0.3612%",
      tier3: "0.1534%",
      tier4: "0.3",
    },
    {
      stars: 6,
      tier1: "0.9%",
      tier2: "0.405%",
      tier3: "0.1822%",
      tier4: "0.4",
    },
    { stars: 7, tier1: "1%", tier2: "0.5%", tier3: "0.25%", tier4: "0" },
    { stars: 8, tier1: "1.1%", tier2: "0.605%", tier3: "0.3328%", tier4: "0" },
    { stars: 9, tier1: "1.2%", tier2: "0.72%", tier3: "0.432%", tier4: "0.5" },
    { stars: 10, tier1: "1.3%", tier2: "0.845%", tier3: "0.5492%", tier4: "0" },
    { stars: 11, tier1: "1.4%", tier2: "0.98%", tier3: "0.684%", tier4: "0.6" },
  ];

  const rows3 = [
    { stars: 1, tier1: "0.3%", tier2: "0.09%", tier3: "0.027%", tier4: "0.0" },
    {
      stars: 2,
      tier1: "0.35%",
      tier2: "0.1225%",
      tier3: "0.0429%",
      tier4: "0.1",
    },
    {
      stars: 3,
      tier1: "0.375%",
      tier2: "0.1404%",
      tier3: "0.0527%",
      tier4: "0.0",
    },
    { stars: 4, tier1: "0.4%", tier2: "0.16%", tier3: "0.0664%", tier4: "0.0" },
    {
      stars: 5,
      tier1: "0.425%",
      tier2: "0.1804%",
      tier3: "0.0764%",
      tier4: "0.0",
    },
    {
      stars: 6,
      tier1: "0.45%",
      tier2: "0.2025%",
      tier3: "0.0911%",
      tier4: "0.1",
    },
    { stars: 7, tier1: "0.5%", tier2: "0.25%", tier3: "0.125%", tier4: "0.0" },
    {
      stars: 8,
      tier1: "0.55%",
      tier2: "0.3025%",
      tier3: "0.1644%",
      tier4: "0.0",
    },
    { stars: 9, tier1: "0.6%", tier2: "0.36%", tier3: "0.216%", tier4: "0.1" },
    {
      stars: 10,
      tier1: "0.65%",
      tier2: "0.4225%",
      tier3: "0.2746%",
      tier4: "0.1",
    },
    { stars: 11, tier1: "0.7%", tier2: "0.49%", tier3: "0.343%", tier4: "0.2" },
  ];

  const rows4 = [
    { stars: 1, tier1: "0.3%", tier2: "0.09%", tier3: "0.027%", tier4: "0.0" },
    {
      stars: 2,
      tier1: "0.35%",
      tier2: "0.1225%",
      tier3: "0.0429%",
      tier4: "0.1",
    },
    {
      stars: 3,
      tier1: "0.375%",
      tier2: "0.1404%",
      tier3: "0.0527%",
      tier4: "0.0",
    },
    { stars: 4, tier1: "0.4%", tier2: "0.16%", tier3: "0.0664%", tier4: "0.0" },
    {
      stars: 5,
      tier1: "0.425%",
      tier2: "0.1804%",
      tier3: "0.0764%",
      tier4: "0.0",
    },
    {
      stars: 6,
      tier1: "0.45%",
      tier2: "0.2025%",
      tier3: "0.0911%",
      tier4: "0.1",
    },
    { stars: 7, tier1: "0.5%", tier2: "0.25%", tier3: "0.125%", tier4: "0.0" },
    {
      stars: 8,
      tier1: "0.55%",
      tier2: "0.3025%",
      tier3: "0.1644%",
      tier4: "0.0",
    },
    { stars: 9, tier1: "0.6%", tier2: "0.36%", tier3: "0.216%", tier4: "0.1" },
    {
      stars: 10,
      tier1: "0.65%",
      tier2: "0.4225%",
      tier3: "0.2746%",
      tier4: "0.1",
    },
    { stars: 11, tier1: "0.7%", tier2: "0.49%", tier3: "0.343%", tier4: "0.2" },
  ];

  const rows5 = [
    { stars: 1, tier1: "0.3%", tier2: "0.09%", tier3: "0.027%", tier4: "0.0" },
    {
      stars: 2,
      tier1: "0.35%",
      tier2: "0.1225%",
      tier3: "0.0429%",
      tier4: "0.1",
    },
    {
      stars: 3,
      tier1: "0.375%",
      tier2: "0.1404%",
      tier3: "0.0527%",
      tier4: "0.0",
    },
    { stars: 4, tier1: "0.4%", tier2: "0.16%", tier3: "0.0664%", tier4: "0.0" },
    {
      stars: 5,
      tier1: "0.425%",
      tier2: "0.1804%",
      tier3: "0.0764%",
      tier4: "0.0",
    },
    {
      stars: 6,
      tier1: "0.45%",
      tier2: "0.2025%",
      tier3: "0.0911%",
      tier4: "0.1",
    },
    { stars: 7, tier1: "0.5%", tier2: "0.25%", tier3: "0.125%", tier4: "0.0" },
    {
      stars: 8,
      tier1: "0.55%",
      tier2: "0.3025%",
      tier3: "0.1644%",
      tier4: "0.0",
    },
    { stars: 9, tier1: "0.6%", tier2: "0.36%", tier3: "0.216%", tier4: "0.1" },
    {
      stars: 10,
      tier1: "0.65%",
      tier2: "0.4225%",
      tier3: "0.2746%",
      tier4: "0.1",
    },
    { stars: 11, tier1: "0.7%", tier2: "0.49%", tier3: "0.343%", tier4: "0.2" },
  ];
  return (
    <>
      <Mobile>
        <div style={{ backgroundColor: "#232626" }}>
          <Container
            disableGutters
            maxWidth="xs"
            sx={{
              bgcolor: "#232626",
              minHeight: "100dvh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header Section */}
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
              onClick={handleBackClick}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ color: "#ffffff", textAlign: "center", fontSize: "19px" }}
            >
                Rules
            </Typography>
          </Grid>
        </Grid>

            {/* Subheading Section */}
            <Typography
              variant="h7"
              sx={{
                marginTop: 2,
                color: "#B3BEC1",
                
                textAlign: "center",
                "& p": {
                  color: "#24ee89",
                  margin: 0,
                  fontSize:"19.2px",
                  fontWeight:"bold"
                },
              }}
            >
              <p>【Promotion partner】program</p>
              This activity is valid for a long time
            </Typography>

            {/* Rules Section */}
            <Box sx={{ flex: 1, px: 2,pt:2 }}>
              {rules.map((rule, index) => (
                <Paper
                  key={index}
                  // elevation={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    backgroundColor: "#323738",
                    backgroundImage:"url('/assets/header.svg')",
                    backgroundPosition: "center -8px",
                    backgroundSize: "cover",
                    border: "none",
                    boxShadow: "none",
                  }}
                >
                  <Box
                    sx={{
                      // backgroundColor: "#B9BCC8;",
                      borderRadius: "50%",
                      width: 30,
                      height: 30,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center-top",
                      fontWeight: "bold",
                      color: "#ffffff",
                      mb: 1,
                      mt:-1,
                      fontSize:"13px"
                    }}
                  >0
                    {index + 1}
                  </Box>
                  <Typography
                    variant="body2"
                    
                    color="textPrimary"
                    sx={{ color: "#B3BEC1", textAlign: "left",fontSize:"13px" }}
                  >
                    {rule}
                  </Typography>
                </Paper>
              ))}
            </Box>

            {/* Table Section */}
            <Box sx={{ px: 2 }}>
              <TableContainer component={Paper} elevation={3} sx={{boxShadow:"none"}}>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                  <TableHead>
                  <TableRow sx={{ bgcolor: "#cf7c10" }}>
                    <TableCell
                      sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        p: "13px 0px 13px 5px", // Top padding is increased here
                        fontSize: "12.5px",
                        whiteSpace: "nowrap",
                        textAlign:"center",
                        border:"none"
                      }}
                    >
                      Rebate level
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        p: "13px 8px 13px 5px", // Top padding is increased here
                        fontSize: "12.2px",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        border:"none"
                      }}
                      align="center"
                    >
                      Team Number
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        p: "13px 8px 13px 5px", // Top padding is increased here
                        fontSize: "12.2px",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        border:"none"
                      }}
                      align="center"
                    >
                      Team Betting
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        p: "13px 8px 13px 5px", // Top padding is increased here
                        fontSize: "12.5px",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        border:"none"
                      }}
                      align="center"
                    >
                      Team Deposit
                    </TableCell>
                  </TableRow>

                  </TableHead>
                  <TableBody>
                    {rulesdata.map((row,index) => (
                      <TableRow 
                      key={row.level} 
                      sx={{
                        background: index % 2 === 0 ? "#323738" : "#1a1000",
                        '& .MuiTableCell-root': {  // Remove default cell borders
                          borderBottom: 'none'
                        }
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 1,
                          padding: "2.5px 16px"
                        }}
                      >
                        <Grid item xs={3}>
                          <Box
                            sx={{
                              position: "relative",
                              display: "inline-block",
                              width: "100%",
                            }}
                          >
                            <img
                              src={`/assets/promotion/lowerLevel.webp`}
                              alt={row.level}
                              style={{ 
                                width: "100%", 
                                // borderRadius: "8px"
                              }}
                            />
                            <Typography
                              sx={{
                                position: "absolute",
                                top: "60%",
                                left: "75%",
                                transform: "translate(-50%, -50%)",
                                color: "#fff670",
                                fontSize: "12.5px",
                              }}
                            >
                              {row.level}
                            </Typography>
                          </Box>
                        </Grid>
                      </TableCell>
                      <TableCell 
                        align="center" 
                        sx={{
                          color: "#B3BEC1",
                          padding: "8px 16px",
                          fontWeight:"bold"
                        }}
                      >
                        {row.teamNumber}
                      </TableCell>
                      <TableCell 
                        align="center" 
                        sx={{
                          color: "#B3BEC1",
                          padding: "8px 16px",
                           fontWeight:"bold"
                        }}
                      >
                        {row.teamBetting}
                      </TableCell>
                      <TableCell 
                        align="center" 
                        sx={{
                          color: "#B3BEC1",
                          padding: "8px 16px",
                           fontWeight:"bold"
                        }}
                      >
                        {row.teamDeposit}
                      </TableCell>
                    </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box sx={{ flex: 1, p: 2 }}>
              {rules2.map((rule, index) => (
                <Paper
                  key={index}
                  // elevation={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    backgroundColor: "#323738",
                    backgroundImage:"url('/assets/header.svg')",
                    backgroundPosition: "center -8px",
                    backgroundSize: "cover",
                    border: "none",
                    boxShadow:"none"
                  }}
                >
                  <Box
                    sx={{
                      // backgroundColor: "#B9BCC8;",
                      borderRadius: "50%",
                      width: 30,
                      height: 30,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center-top",
                      fontWeight: "bold",
                      color: "#ffffff",
                      mb: 1,
                      mt:-1,
                      fontSize:"13px"
                    }}
                  >0
                    {index + 5}
                  </Box>
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    sx={{ color: "#B3BEC1", textAlign: "left",fontSize:"13px" }}
                  >
                    {rule}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Container>
          <br />
          <br />
          <br />
        </div>
      </Mobile>
    </>
  );
};

export default InvitationRule;
