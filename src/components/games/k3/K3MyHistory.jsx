import React from "react";
import {
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import { Button } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { useNavigate } from "react-router-dom";
// import { diceImg } from "./path-to-dice-images" // Replace with actual path

const dice1 = "/assets/k3/dice/dice1.webp";
const dice2 = "/assets/k3/dice/dice2.webp";
const dice3 = "/assets/k3/dice/dice3.webp";
const dice4 = "/assets/k3/dice/dice4.webp";
const dice5 = "/assets/k3/dice/dice5.webp";
const dice6 = "/assets/k3/dice/dice6.webp";

const diceImg = [dice1, dice2, dice3, dice4, dice5, dice6];

const K3MyHistory = ({ bets, page, setPage, totalPage, hideDetailsButton,insideBettingRecord }) => {
  const navigate = useNavigate();
  const handleCopy = (id) => {
    const tempInput = document.createElement("textarea");
    tempInput.value = id;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  };

  const handleDetailsClick = () => {
    navigate("/home/AllLotteryGames/k3/BettingRecordWin");
  };

  return (
    <Grid container sx={{ justifyContent: "center" }}>
      <Box
        sx={{
          backgroundColor: "#323738",
          width: "100%",
          borderRadius: insideBettingRecord ? "0" : "10px 10px 0 0px",
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
          // .slice()
          // .sort((a, b) =>
          //     b.timestamp && a.timestamp
          //         ? b.timestamp.seconds - a.timestamp.seconds
          //         : -1
          // )
          .map((bet, index) => (
            <Accordion
              key={index}
              sx={{
                backgroundColor: "#323738",
                boxShadow: "none",
                "&::before": {
                  // backgroundColor:index === 0 ? "transparent" :"rgba(0, 0, 0, 0.12)"
                  backgroundColor: "transparent"
                }
              }}
            >
              <AccordionSummary
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
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
                      // width: "100%",
                      p: "2px 17px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      //   mb: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 38,
                          height: 36,
                          borderRadius: "25%",
                          backgroundColor: (() => {
                            const type = bet.betType;

                            // Check bet type and use respective flags
                            if (type === "BIG_SMALL") {
                              return bet.isBig ? "#DD9138" : "#5088D3"; // Orange for Big, Blue for Small
                            }
                            if (type === "ODD_EVEN") {
                              return bet.isOdd ? "#D23838" : "#17B15E"; // Red for Odd, Green for Even
                            }

                            // Colors for other bet types
                            if (type === "TOTAL_SUM") return "#DD9138"; // Orange
                            if (type === "ALL_DIFFERENT") return "#5088D3"; // Blue
                            if (type === "TWO_SAME") return "#D23838"; // Red
                            if (type === "THREE_SAME") return "#17B15E"; // Green

                            return "#DD9138"; // Default color (orange)
                          })(),
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          mr: 2,
                        }}
                      >
                        <Typography
                          variant="body5"
                          sx={{
                            color: "white",
                            fontSize: "13px",
                            textTransform: "initial",
                          }}
                        >
                           {bet.betType === "TOTAL_SUM"
                            ? "Total"
                            : bet.betType === "ALL_DIFFERENT"
                              ? "Diff"
                              : bet.betType === "THREE_CONSECUTIVE"
                                ? "Diff"
                                : bet.betType === "THREE_SAME_RANDOM"
                                  ? "3 Same"
                                  : bet.betType === "TWO_DIFFERENT"
                                    ? "Diff"
                                    : bet.betType === "TWO_SAME"
                                      ? "2 Same"
                                      : bet.betType === "TWO_SAME_SPECIFIC"
                                        ? "2 Same"
                                        : bet.betType === "BIG_SMALL"
                                          ? bet.isBig
                                            ? "Big"
                                            : "Small"
                                          : bet.betType === "ODD_EVEN"
                                            ? bet.isOdd
                                              ? "Odd"
                                              : "Even"
                                            : "3 Same"}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontSize: "15px",
                            color: "#FDE4BC",
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
                          borderColor: bet.resultDice.length <= 0
                            ? "#DD9138"
                            : bet.isWin
                              ? "#17B15E"
                              : "#D23838",
                          borderRadius: "7px",
                          pt: "0.2px",
                          pb: "0.1px",
                          px: "18px",
                          // pr: "18px",
                          display: "inline-block",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "12px",
                            color:
                              bet.resultDice.length <= 0
                                ? "#DD9138"
                                : bet.isWin
                                  ? "#17B15E"
                                  : "#D23838",
                          }}
                        >
                          {bet.resultDice.length <= 0
                            ? "Pending"
                            : bet.isWin
                              ? "Success"
                              : "Failed"}
                        </Typography>
                      </Box>
                      {bet.resultDice.length > 0 && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: bet.isWin ? "#17B15E"
                              : "#D23838",
                          }}
                        >
                          {bet.winAmount > 0
                            ? `+\u20B9${(bet.winAmount).toFixed(2)}`
                            : `-\u20B9${Math.abs(bet.actualBetAmount).toFixed(2)}`}
                        </Typography>
                      )}

                    </Box>
                  </Box></Box>
                {index !== bets.length - 1 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mx: 1, mt: 1 }}
                  >
                    <Divider
                      sx={{ borderColor: "#382e35", width: "96%" }}
                    ></Divider>
                  </Box>
                )}
              </AccordionSummary>
              {/* <Box
                sx={{ display: "flex", justifyContent: "center", mx: 2, mb: 1 }}
              >
                <Divider
                  sx={{ borderColor: "#382e35", width: "100%" }}
                ></Divider>
              </Box> */}
              <AccordionDetails sx={{ px: 1, pb: 0 }}>
                <Typography
                  sx={{
                    fontWeight: "400",
                    // mb: 1,
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
                                  width: 13,
                                  // height: 20, 
                                  marginLeft: 8
                                }}
                              />
                            </div>
                          ),
                        },
                        { label: "Period", value: bet.periodId },
                        {
                          label: "Purchase amount",
                          value: `\u20B9${bet.betAmount.toFixed(2)}`,
                        },
                        {
                          label: "Quantity",
                          value: bet.multiplier,
                        },
                        {
                          label: "Amount after tax",
                          value: `\u20B9${bet.actualBetAmount.toFixed(2)}`,
                          color: bet.winAmount > 0 ? "green" : "red",
                        },
                        {
                          label: "Tax",
                          value: `\u20B9${bet.tax.toFixed(2)}`,
                        },
                        {
                          label: "Result",
                          value: Array.isArray(bet.resultDice)
                            ? (
                              <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end"
                              }}>
                                {bet.resultDice.map((outcome, index) => (
                                  <img
                                    key={index}
                                    src={diceImg[outcome - 1]}
                                    alt={`Dice ${outcome}`}
                                    style={{
                                      width: 20,
                                      marginLeft: "4px",
                                      verticalAlign: "middle"
                                    }}
                                  />
                                ))}
                              </div>
                            )
                            : null,
                        },
                         {
                          label: "Select",
                          value: `${bet.betType === "TOTAL_SUM"
                            ? "Total"
                            : bet.betType === "ALL_DIFFERENT"
                              ? "Diff"
                              : bet.betType === "THREE_CONSECUTIVE"
                                ? "Diff"
                                : bet.betType === "THREE_SAME_RANDOM"
                                  ? "3 Same"
                                  : bet.betType === "TWO_DIFFERENT"
                                    ? "Diff"
                                    : bet.betType === "TWO_SAME"
                                      ? "2 Same"
                                      : bet.betType === "TWO_SAME_SPECIFIC"
                                        ? "2 Same"
                                        : bet.betType === "BIG_SMALL"
                                          ? "Total"
                                          : bet.betType === "ODD_EVEN"
                                            ? "Total"
                                            : "3 Same"
                            }`,
                        },
                        {
                          label: "Status",
                          value: (
                            <Typography
                              variant="body1"
                              style={{
                                color: bet.resultDice.length <= 0
                                  ? "#DD9138"
                                  : bet.isWin
                                    ? "#17B15E"
                                    : "#D23838",
                              }}
                            >
                              {bet.resultDice.length <= 0
                                ? "Pending"
                                : bet.isWin
                                  ? "Success"
                                  : "Failed"}
                            </Typography>
                          ),
                        },
                        {
                          label: "Win/lose",
                          value:
                            bet.resultDice.length <= 0
                              ? "Pending" : bet.isWin ? `+\u20B9${bet.winAmount.toFixed(2)}`
                                : `-\u20B9${Math.abs(bet.actualBetAmount).toFixed(2)}`,
                          color: bet.resultDice.length <= 0
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
                            .replace("T", " ")}`


                        }
                      ].map((row, rowIndex) => (
                        <Grid
                          key={rowIndex}
                          sx={{
                            border: "0.4rem solid #323738",
                            backgroundColor: "#382e35",
                            borderRadius: "13px",
                            display: "flex",
                            padding: "2px 6px",
                            justifyContent: "space-between"

                          }}
                        >
                          <Typography
                            sx={{
                              // fontWeight: "bold",
                              fontSize: "15px",
                              // padding: "2px 6px",
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
                              // padding: "2px 6px",
                              borderBottom: "1px solid #382e35",
                            }}
                          >
                            {row.value}
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
                    sx={{ borderColor: "#382e35", width: "100%" }}
                  ></Divider>
                </Box>
              </AccordionDetails>
            </Accordion>

          ))}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            marginTop: "30px",
            backgroundColor: "#323738",
            padding: { xs: "10px 0", sm: "15px 0" },
            borderRadius: insideBettingRecord ? "0" : "0 0 10px 10px",
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
                backgroundColor: "#5a5145", // Disabled background color
                color: "#FDE4BC", // Optional: Change text color for better visibility
              },
              "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 7px" },
            }}
          >
            <ArrowBackIosRoundedIcon style={{ color: page === 1 ? "#FDE4BC" : "#323738" }} />
          </Button>
          <Grid sx={{ display: "flex", alignItems: "center", color: "#FDE4BC", fontSize: "13px" }}>
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
                backgroundColor: "#5a5145", // Disabled background color
                color: "#FDE4BC", // Optional: Change text color for better visibility
              },
              "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 7px" },
            }}
          >
            <ArrowForwardIosRoundedIcon style={{ color: page >= totalPage ? "#FDE4BC" : "#323738" }} />
          </Button>
        </Box>
      </Box>
    </Grid>
  );
};

export default K3MyHistory;
