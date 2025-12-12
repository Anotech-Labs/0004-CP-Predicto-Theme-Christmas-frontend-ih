import React from 'react';
import {
  Grid,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider, Table,
  TableBody, TableContainer,

  Button,
} from '@mui/material';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { useNavigate } from "react-router-dom";


const FiveDMyHistory = ({ bets, page, setPage, hideDetailsButton, totalPage }) => {
  // const formatTimer = (timer) => {
  //   const timerMap = {
  //     'ONE_MINUTE_TIMER': '1 Min',
  //     'THREE_MINUTE_TIMER': '3 Min',
  //     'FIVE_MINUTE_TIMER': '5 Min',
  //     'TEN_MINUTE_TIMER': '10 Min'

  //   };
  //   return timerMap[timer] || timer;
  // };
  const navigate = useNavigate();

  const handleCopy = (id) => {
    const tempInput = document.createElement("textarea");
    tempInput.value = id;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  };
  // Helper function to format selected bets
  const formatSelectedBets = (bet) => {
    // console.log("Bet:", JSON.stringify(bet, null, 2));
  
    const sectionMap = {
      "SECTION_A": { section: "sectionA", size: "sizeA", parity: "parityA" },
      "SECTION_B": { section: "sectionB", size: "sizeB", parity: "parityB" },
      "SECTION_C": { section: "sectionC", size: "sizeC", parity: "parityC" },
      "SECTION_D": { section: "sectionD", size: "sizeD", parity: "parityD" },
      "SECTION_E": { section: "sectionE", size: "sizeE", parity: "parityE" },
      "SUM": { size: "sizeSum", parity: "paritySum" } 
    };
  
    const sectionInfo = sectionMap[bet.betType] || {};
  
    const formatSingleValue = (val) => {
      if (!val && val !== 0) return "";
      return typeof val === "string" && ["BIG", "SMALL", "ODD", "EVEN"].includes(val.toUpperCase())
        ? val.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
        : val;
    };
  
    const formatValue = (value) => {
      if (Array.isArray(value)) {
        return value.length > 0 ? value.map(formatSingleValue).join(", ") : "";
      }
      return formatSingleValue(value);
    };
  
    const formatParts = [];
  
    // Section (only if present)
    if (sectionInfo.section && bet.hasOwnProperty(sectionInfo.section)) {
      const selectedSections = bet[sectionInfo.section];
      if (Array.isArray(selectedSections) && selectedSections.length > 0) {
        formatParts.push(`Section: ${formatValue(selectedSections)}`);
      }
    }
  
    // Size
    if (sectionInfo.size && bet.hasOwnProperty(sectionInfo.size)) {
      const selectedSize = bet[sectionInfo.size];
      if ((Array.isArray(selectedSize) && selectedSize.length > 0) || selectedSize) {
        formatParts.push(`Size: ${formatValue(selectedSize)}`);
      }
    }
  
    // Parity
    if (sectionInfo.parity && bet.hasOwnProperty(sectionInfo.parity)) {
      const selectedParity = bet[sectionInfo.parity];
      if ((Array.isArray(selectedParity) && selectedParity.length > 0) || selectedParity) {
        formatParts.push(`Parity: ${formatValue(selectedParity)}`);
      }
    }
  
    const result = formatParts.length > 0 ? formatParts.join(" | ") : "N/A";
    // console.log("Formatted Output:", result);
    return result;
  };
  // Helper function to get result numbers
  const getResultNumbers = (bet) => {
    const sections = ['A', 'B', 'C', 'D', 'E'];
    return sections
      .map(section => {
        const results = bet[`resultSection${section}`];
        return Array.isArray(results) ? results[0] : results;
      })
      .join(' ');
  };
  const handleDetailsClick = () => {
    navigate("/home/AllLotteryGames/5d/BettingRecordWin");
  };

  return (
    <Grid container sx={{ justifyContent: "center" }}>
      <Box
        sx={{
          backgroundColor: "#323738",
          width: "100%",
          borderRadius: "10px 10px 0 0px",
        }}
      >
        <Grid
          sx={{
            padding: "10px 10px 0px 10px",
            textAlign: "right",
            display: "flex",
            justifyContent: "flex-end",
            borderRadius: "5px 5px 0 0px"
          }}
        >
          {!hideDetailsButton && (
            <Button
              onClick={handleDetailsClick}
              sx={{
                textTransform: "none",
                color: "#DD9138",
                padding: "5px 7px",
                border: "1px solid #DD9138",
                borderRadius: "10px",
                fontSize: "13px",
                mb: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around"
              }}
            >
              Details
              <img
                src="/assets/k3/Details.webp"
                alt="Order icon"
                style={{
                  width: 18,
                  marginLeft: 3
                }}
              />
            </Button>
          )}
        </Grid>
        {bets.map((bet, index) => (
          <Accordion
            key={bet.id}
            sx={{
              backgroundColor: "#323738",
              boxShadow: "none",
              "&::before": { backgroundColor: "transparent" },
            }}
          >
            <AccordionSummary
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: 0,
                "& .MuiAccordionSummary-content.Mui-expanded": { margin: 0 },
                "& .MuiAccordionSummary-content": {
                  display: "flex",
                  flexDirection: "column",
                  margin: "4px 0",
                  width: "100%",
                },
              }}
            >
              <Box>
                <Box
                  sx={{
                    p: "2px 17px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        background: "#FED358",
                        color: "white",
                        height: 36,
                        width: 38,
                        borderRadius: "25%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mr: 2,
                      }}
                    >
                      <Typography variant="body5" sx={{ color: "white", fontSize: "13px", textTransform: "initial", }}>
                        {bet.betType.replace('SECTION_', '')}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography sx={{ fontSize: "15px", color: "#FDE4BC", mb: 0.5 }}>
                        {String(bet.periodId)}
                      </Typography>
                      <Typography sx={{ color: "#B79C8B", fontSize: "12px" }}>
                        {bet.timestamp
                          ? new Date(bet.timestamp).toISOString().slice(0, 19).replace("T", " ")
                          : "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Box
                      sx={{
                        border: 1,
                        borderColor: !getResultNumbers(bet) || String(getResultNumbers(bet)).trim() === ""
                          ? "#DD9138" : bet.isWin ? "#17B15E" : "#D23838",
                        borderRadius: "7px",
                        pt: "0.2px",
                        pb: "0.1px",
                        px: "18px",
                        display: "inline-block",
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "12px",
                          color: !getResultNumbers(bet) || String(getResultNumbers(bet)).trim() === ""
                            ? "#DD9138" : bet.isWin ? "#17B15E" : "#D23838",
                        }}
                      >
                        {!getResultNumbers(bet) || String(getResultNumbers(bet)).trim() === ""
                          ? "Pending" : bet.isWin ? "Success" : "Failed"}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: bet.isWin ? "#17B15E" : "#D23838",
                      }}
                    >
                      {!getResultNumbers(bet) || String(getResultNumbers(bet)).trim() === ""
                        ? "" : bet.isWin
                          ? `+₹${parseFloat(bet.winAmount || 0).toFixed(2)}`
                          : `-₹${parseFloat(bet.actualBetAmount || 0).toFixed(2)}`}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {index !== bets.length - 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mx: 1, mt: 1 }}>
                  <Divider sx={{ borderColor: "#3B3833", width: "96%" }} />
                </Box>
              )}
            </AccordionSummary>
            <AccordionDetails sx={{ px: 1, pb: 0 }}>
              <Typography
                sx={{
                  fontWeight: "400",
                  textAlign: "left",
                  marginLeft: 1,
                  fontSize: "21px",
                  color: "#FDE4BC",
                }}
              >
                Details
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableBody >
                    {[
                      {
                        label: "Order number", value: (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                            {bet.id}
                            <img
                              onClick={() => handleCopy(bet.id)}
                              src="/assets/k3/copy.svg"
                              alt="Order icon"
                              style={{
                                width: 13,
                                // height: 20, 
                                marginLeft: 8
                              }}
                            />
                          </div>
                        ),
                      },
                      { label: "Period", value: bet.periodId },
                      // {
                      //   label: "Selected Timer",
                      //   value: formatTimer(bet.selectedTimer)
                      // },
                      {
                        label: "Purchase amount",
                        value: `₹${parseFloat(bet.betAmount || 0).toFixed(2)}`,
                      },
                      { label: "Quantity", value: bet.multiplier },
                      {
                        label: "Amount after tax",
                        value: `₹${parseFloat(bet.actualBetAmount || 0).toFixed(2)}`,
                        color: bet.winAmount > 0 ? "green" : "red",
                      },
                      {
                        label: "Tax",
                        value: `₹${parseFloat(bet.tax || 0).toFixed(2)}`,
                        color: "#B79C8B"
                      },
                      {
                        label: "Result", value: (
                          <div
                            style={{
                              display: "flex",
                              gap: "4px", // Space between circles
                              alignItems: "center",
                              justifyContent: "flex-end",
                              flexWrap: "wrap", // Handles small screens properly
                            }}
                          >
                            {getResultNumbers(bet) && String(getResultNumbers(bet)).trim() !== ""
                              ? String(getResultNumbers(bet)) // Convert to string (to handle any data type)
                                .split(" ") // Split string by spaces
                                .map((num, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      width: "18px",
                                      borderRadius: "50%",
                                      border: "1px solid #FDE4BC",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      background: "transparent",
                                      color: "#FDE4BC",
                                      fontSize: "12.8px",
                                      fontWeight: "bold",
                                      aspectRatio: "1 / 1",
                                    }}
                                  >
                                    {num}
                                  </div>
                                ))
                              : <span></span> // Show "Pending" if no result
                            }
                          </div>
                        ),
                      },
                      {
                        label: "Select",
                        value: formatSelectedBets(bet),
                        color: "#FDE4BC"
                      },
                      {
                        label: "Status",
                        value: !getResultNumbers(bet) || String(getResultNumbers(bet)).trim() === ""
                          ? "Pending"
                          : bet.isWin
                            ? "Success"
                            : "Failed",
                        color: !getResultNumbers(bet) || String(getResultNumbers(bet)).trim() === ""
                          ? "#DD9138" // Pending color (Orange)
                          : bet.isWin
                            ? "#17B15E" // Success (Green)
                            : "#D23838", // Failed (Red)
                      },
                      {
                        label: "Win/lose",
                        value: !getResultNumbers(bet) || String(getResultNumbers(bet)).trim() === ""
                          ? "" : bet.isWin
                            ? `+₹${parseFloat(bet.winAmount || 0).toFixed(2)}`
                            : `-₹${parseFloat(bet.actualBetAmount || 0).toFixed(2)}`,
                        color: bet.isWin ? "#17B15E" : "#D23838"
                      },
                      {
                        label: "Order time",
                        value: bet.timestamp
                          ? new Date(bet.timestamp).toISOString().slice(0, 19).replace("T", " ")
                          : "N/A",
                        color: "#B79C8B"
                      }
                    ].map((item, idx) => (
                      <Grid
                        key={idx}
                        sx={{
                          border: "4px solid #323738",
                          backgroundColor: "#3b3833",
                          borderRadius: "8px",
                          display: "flex",
                          padding: "2px 6px",
                          justifyContent: "space-between"

                        }}
                      >
                        <Typography sx={{ color: "#B79C8B", fontSize: "15px", borderBottom: "none", }}>
                          {item.label}
                        </Typography>
                        <Typography
                          sx={{
                            color: item.color || "#B79C8B",
                            fontSize: "15px",
                            textAlign: "right",
                            // padding: "2px 6px",
                            borderBottom: "1px solid #3B3833",
                          }}
                        >
                          {item.value}
                        </Typography>
                      </Grid>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: "flex", justifyContent: "center", mx: 1, mt: 2.2 }}>
                <Divider sx={{ borderColor: "#3B3833", width: "100%" }} />
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: "32px",
          marginTop: "30px",
          backgroundColor: "#323738",
          padding: { xs: "10px 0", sm: "15px 0" },
          borderRadius: "0 0 10px 10px",
        }}
      >
        <Button
          variant="contained"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          sx={{
            marginRight: "10px",
            backgroundColor: "#FED358",
            "&.Mui-disabled": { backgroundColor: "#382e35", color: "#B79C8B" },
            "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 7px" },
          }}
        >
          <ArrowBackIosRoundedIcon style={{ color: page === 1 ? "#B79C8B" : "#323738" }} />
        </Button>
        <Grid sx={{ display: "flex", alignItems: "center", color: "#B79C8B", fontSize: "13px" }}>
          {page}/{totalPage}
        </Grid>
        <Button
          variant="contained"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPage}
          sx={{
            marginLeft: "10px",
            backgroundColor: "#FED358",
            "&.Mui-disabled": { backgroundColor: "#382e35", color: "#B79C8B" },
            "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 7px" },
          }}
        >
          <ArrowForwardIosRoundedIcon style={{ color: page === totalPage ? "#B79C8B" : "#323738" }} />
        </Button>
      </Box>
    </Grid>
  );
};

export default FiveDMyHistory;