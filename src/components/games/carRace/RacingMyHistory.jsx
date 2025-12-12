import React from 'react';
import {
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Divider,
} from '@mui/material';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import speedPinball1 from "../../../assets/race-ball/speed_pinball1.webp";
import speedPinball2 from "../../../assets/race-ball/speed_pinball2.webp";
import speedPinball3 from "../../../assets/race-ball/speed_pinball3.webp";
import speedPinball4 from "../../../assets/race-ball/speed_pinball4.webp";
import speedPinball5 from "../../../assets/race-ball/speed_pinball5.webp";
import speedPinball6 from "../../../assets/race-ball/speed_pinball6.webp";
import speedPinball7 from "../../../assets/race-ball/speed_pinball7.webp";
import speedPinball8 from "../../../assets/race-ball/speed_pinball8.webp";
import speedPinball9 from "../../../assets/race-ball/speed_pinball9.webp";
import speedPinball10 from "../../../assets/race-ball/speed_pinball10.webp";
import { useNavigate } from 'react-router-dom';

const ballImages = {
  1: speedPinball1,
  2: speedPinball2,
  3: speedPinball3,
  4: speedPinball4,
  5: speedPinball5,
  6: speedPinball6,
  7: speedPinball7,
  8: speedPinball8,
  9: speedPinball9,
  10: speedPinball10,
};

const RacingMyHistory = ({ bets, isLoading, getGradientForItem, page, setPage, totalPage,hideDetailsButton ,insideBettingRecord}) => {
  if (isLoading) {
    return (
      <Grid container justifyContent="center" sx={{ py: 2 }}>
        <Typography>Loading bet history...</Typography>
      </Grid>
    );
  }

  if (!bets || bets.length === 0) {
    return (
      <Grid container justifyContent="center" sx={{ py: 2 }}>
        <Typography>No bet history available</Typography>
      </Grid>
    );
  }

  const handleCopy = (id) => {
    const tempInput = document.createElement("textarea");
    tempInput.value = id;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  };

  const formatSectionName = (section) => {
    return section
      .replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
    const navigate = useNavigate();
  
  const handleDetailsClick = () => {
    navigate("/home/AllLotteryGames/car-race/BettingRecordWin");
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
        {bets
          .slice()
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .map((bet, index) => (
            <Accordion
              key={bet._id}
              sx={{
                backgroundColor: "#323738",
                boxShadow: "none",
                "&::before": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <AccordionSummary
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  padding: 0,
                  "& .MuiAccordionSummary-content.Mui-expanded": {
                    margin: 0,
                  },
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <Box
                        border={1}
                        borderRadius={2}
                        style={{
                          background: (() => {
                            const element = bet.SectionElements?.[0];
                            if (element?.carNumbers?.length > 0) {
                              return "#0f6518"; // Number bet color
                            } else if (element?.sizes?.length > 0) {
                              return element.sizes[0] === "Small"
                                ? "rgb(110,168,244)"
                                : "rgb(254,170,87)";
                            } else if (element?.parities?.length > 0) {
                              return element.parities[0] === "Even"
                                ? "rgb(200,111,255)"
                                : "rgb(251,91,91)";
                            }
                            return "#0f6518"; // Default color
                          })(),
                          color: "white",
                          height: "40px",
                          width: "40px",
                          display: "flex",
                          border: "none",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography sx={{ fontSize: "10px" }}>
                          {(() => {
                            const element = bet.SectionElements?.[0];
                            if (element?.carNumbers?.length > 0) {
                              return (
                                <div style={{ fontSize: "14px" }}>
                                  {element.carNumbers.slice(0, 2).join("|")}
                                </div>
                              );
                            } else if (element?.sizes?.length > 0) {
                              return element.sizes[0];
                            } else if (element?.parities?.length > 0) {
                              return element.parities[0];
                            }
                            return null;
                          })()}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontSize: "15px",
                            color: "#ffffff",
                            mb: 0.5,
                          }}
                        >
                          {String(bet.periodId)}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#B79C8B",
                            fontSize: "12px",
                          }}
                        >
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
                          borderColor: !bet.resultElements ? "#DD9138" : bet.isWin ? "#17B15E" : "#D23838",
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
                            color: !bet.resultElements ? "#DD9138" : bet.isWin ? "#17B15E" : "#D23838",
                          }}
                        >
                          {!bet.resultElements ? "Pending" : bet.isWin ? "Success" : "Failed"}
                        </Typography>
                      </Box>
                      {bet.resultElements && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: bet.isWin ? "#17B15E" : "#D23838",
                            fontWeight: "bold",
                          }}
                        >
                          {bet.isWin
                            ? `+₹${bet.winAmount || 0}`
                            : `-₹${bet.actualBetAmount || 0}`}
                        </Typography>
                      )}
                      {!bet.resultElements && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#DD9138",
                            fontWeight: "bold",
                          }}
                        >
                          ₹0.00
                        </Typography>
                      )}

                    </Box>
                  </Box>
                </Box>
                {index !== bets.length - 1 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mx: 1, mt: 1 }}
                  >
                    <Divider
                      sx={{ borderColor: "#3a4142", width: "96%" }}
                    ></Divider>
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
                    color: "#ffffff",
                  }}
                >
                  Details
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      {[
                        {
                          label: "Order number",
                          value: (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                              {bet.id}
                              <img
                                onClick={() => handleCopy(bet.id)}
                                src="/assets/k3/copy.svg"
                                alt="Order icon"
                                style={{
                                  cursor: "pointer",
                                  width: 13,
                                  marginLeft: 8,
                                }}
                              />
                            </div>
                          ),
                        },
                        { label: "Period", value: bet.periodId },
                        {
                          label: "Purchase amount",
                          value: `₹${parseFloat(bet.betAmount).toFixed(2)}`,
                        },
                        {
                          label: "Quantity",
                          value: bet.multiplier,
                        },
                        {
                          label: "Amount after tax",
                          value: `₹${parseFloat(bet.actualBetAmount).toFixed(2)}`,
                        },
                        {
                          label: "Tax",
                          value: `₹${parseFloat(bet.fee).toFixed(2)}`,
                        },
                        {
                          label: "Select",
                          value: {
                            section: bet.selectedSection,
                            numbers: bet.SectionElements?.[0]?.carNumbers,
                            sizes: bet.SectionElements?.[0]?.sizes,
                            parities: bet.SectionElements?.[0]?.parities,
                          },
                        },
                        {
                          label: "Status",
                          value: !bet.resultElements ? "Pending" : bet.isWin ? "Success" : "Failed",
                          color: !bet.resultElements
                            ? "#DD9138" // Pending color
                            : bet.isWin
                              ? "#17B15E" // Success color
                              : "#D23838", // Failed color
                        },

                        {
                          label: "Win/lose",
                          value: !bet.resultElements
                            ? "₹0.00"
                            : bet.isWin
                              ? `+₹${parseFloat(bet.winAmount || 0).toFixed(2)}`
                              : `-₹${parseFloat(bet.actualBetAmount || 0).toFixed(2)}`,
                          color: !bet.resultElements
                            ? "#DD9138"
                            : bet.isWin
                              ? "#17B15E"
                              : "#D23838",
                        },
                        {
                          label: "Order time",
                          value: `${new Date(bet.timestamp)
                            .toISOString()
                            .slice(0, 19)
                            .replace("T", " ")}`,
                        },
                      ].map((row, rowIndex) => (
                        <Grid
                          key={rowIndex}
                          sx={{
                            border: "0.3rem solid #323738",
                            backgroundColor: "#3a4142",
                            borderRadius: "10px",
                            display: "flex",
                            padding: "2px 6px",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "15px",
                              color: "#B79C8B",
                              borderBottom: "none",
                            }}
                          >
                            {row.label}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "15px",
                              color: row.color || "#B79C8B",
                              textAlign: "right",
                              borderBottom: "1px solid #3a4142",
                            }}
                          >
                            {row.label === "Amount after tax" ? (
                              <Typography sx={{ color: "red" }}>
                                {row.value}
                              </Typography>
                            ) : row.label === "Select" ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-end",
                                  gap: "8px",
                                }}
                              >
                                <Typography>{formatSectionName(row.value.section)}:</Typography>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "4px",
                                    flexWrap: "wrap",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  {row.value.numbers?.length > 0 &&
                                    row.value.numbers.map((item, index) => (
                                      <img
                                        key={index}
                                        src={ballImages[item]}
                                        alt={item.toString()}
                                        style={{ maxWidth: "20px" }}
                                      />
                                    ))}
                                  {row.value.sizes?.length > 0 &&
                                    row.value.sizes.map((size, index) => (
                                      <Box
                                        key={index}
                                        sx={{
                                          background: getGradientForItem(size),
                                          height: "20px",
                                          maxWidth: "50px",
                                          borderRadius: "5px",
                                          color: "#fff",
                                          textTransform: "initial",
                                          fontSize: "11px",
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          padding: "0 8px",
                                        }}
                                      >
                                        {size}
                                      </Box>
                                    ))}
                                  {row.value.parities?.length > 0 &&
                                    row.value.parities.map((parity, index) => (
                                      <Box
                                        key={index}
                                        sx={{
                                          background: getGradientForItem(parity),
                                          height: "22px",
                                          maxWidth: "58px",
                                          borderRadius: "5px",
                                          color: "#fff",
                                          textTransform: "initial",
                                          fontSize: "13px",
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          padding: "0 8px",
                                        }}
                                      >
                                        {parity}
                                      </Box>
                                    ))}
                                </div>
                              </div>
                            ) : (
                              row.value
                            )}
                          </Typography>
                        </Grid>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box
                  sx={{ display: "flex", justifyContent: "center", mx: 1, mt: 2.2 }}
                >
                  <Divider
                    sx={{ borderColor: "#3a4142", width: "100%" }}
                  ></Divider>
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
          marginTop: "20px",
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
            "&.Mui-disabled": {
              backgroundColor: "#3a4142",
              color: "#B79C8B",
            },
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
            "&.Mui-disabled": {
              backgroundColor: "#3a4142",
              color: "#B79C8B",
            },
            "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 7px" },
          }}
        >
          <ArrowForwardIosRoundedIcon style={{ color: page === totalPage ? "#B79C8B" : "#323738" }} />
        </Button>
      </Box>
    </Grid>
  );
};

export default RacingMyHistory;