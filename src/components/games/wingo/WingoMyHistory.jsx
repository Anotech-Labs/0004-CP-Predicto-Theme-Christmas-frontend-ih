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


const WingoMyHistory = ({ bets, page, setPage, totalPage, hideDetailsButton, insideBettingRecord }) => {
  const navigate = useNavigate();
  // //console.log("bets", bets[1])
  const wordToNumber = (word) => {
    const numbers = {
      ZERO: 0,
      ONE: 1,
      TWO: 2,
      THREE: 3,
      FOUR: 4,
      FIVE: 5,
      SIX: 6,
      SEVEN: 7,
      EIGHT: 8,
      NINE: 9,
    };
    return numbers[word] !== undefined ? numbers[word] : word;
  };
  const handleCopy = (id) => {
    const tempInput = document.createElement("textarea");
    tempInput.value = id;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  };

  const handleDetailsClick = () => {
    //console.log("Details clicked");
    navigate("/home/AllLotteryGames/wingo/BettingRecordWin");
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
                // aria-controls={`panel${index}-content`}
                // id={`panel${index}-header`}
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <Box
                        border={1}
                        borderRadius={2}
                        style={{
                          background:
                            bet.selectedItem.toLowerCase() ===
                              "green" ||
                              [1, 3, 7, 9].includes(
                                wordToNumber(bet.selectedItem)
                              )
                              ? "RGB(64,173,114)"
                              : bet.selectedItem.toLowerCase() ===
                                "red" ||
                                [2, 4, 6, 8].includes(
                                  wordToNumber(bet.selectedItem)
                                )
                                ? "RGB(253,86,92)"
                                : bet.selectedItem.toLowerCase() ===
                                  "violet"
                                  ? "RGB(182,89,254)"
                                  : bet.selectedItem.toLowerCase() ===
                                    "big"
                                    ? "#ffa82e" // Background color for "big"
                                    : bet.selectedItem.toLowerCase() ===
                                      "small"
                                      ? "#1876d2" // Background color for "small"
                                      : wordToNumber(bet.selectedItem) === 0
                                        ? "linear-gradient(to right, rgb(253,86,92) 50%, rgb(182,89,254) 50%)"
                                        : wordToNumber(bet.selectedItem) === 5
                                          ? "linear-gradient(to right, rgb(64,173,114) 50%, rgb(182,89,254) 50%)"
                                          : "rgb(71,129,255)",
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
                          {wordToNumber(bet.selectedItem)}
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
                          borderColor: bet.result === "" ? "#DD9138" : bet.isWin ? "#17B15E"
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
                            color: bet.result === "" ? "#DD9138" : bet.isWin ? "#17B15E"
                              : "#D23838",
                            // fontWeight: "bold",
                          }}
                        >
                          {bet.result === ""
                            ? "Pending"
                            : !bet.isWin
                              ? "Failed"
                              : "Success"}
                        </Typography>
                      </Box>
                      {bet.result.length > 0 && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: bet.result === "" ? "#DD9138" : bet.isWin ? "#17B15E"
                              : "#D23838",
                            fontWeight: "bold",
                          }}
                        >
                          {bet.result === ""
                            ? "pending"
                            : !bet.isWin
                              ? `-₹${Math.abs(
                                parseFloat(bet.actualBetAmount).toFixed(2)
                              )}`
                              : `+₹${parseFloat(bet.winAmount).toFixed(
                                2
                              )}`}
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
                                  cursor: "pointer",
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
                          value: `₹${parseFloat(
                            bet.betAmount
                          ).toFixed(2)}`,
                        },
                        {
                          label: "Quantity",
                          value: bet.multiplier,
                        },
                        {
                          label: "Amount after tax",
                          value: `₹${parseFloat(
                            bet.actualBetAmount
                          ).toFixed(2)}`,
                        },
                        {
                          label: "Tax",
                          value: `₹${parseFloat(bet.tax).toFixed(
                            2
                          )}`,
                        },
                        {
                          label: "Result",
                          value:
                            bet.result === " "
                              ? ""
                              : wordToNumber(
                                bet.result?.split("|")[0]
                              ),
                        },
                        {
                          label: "Select",
                          value: bet.selectedItem,
                        },
                        {
                          label: "Status",
                          value: bet.result === "" ? "Pending" : !bet.isWin ? "Failed" : "Success",
                          color: bet.result === "" ? "#DD9138" : !bet.isWin ? "#D23838" : "#17B15E",

                        },
                        {
                          label: "Win/lose",
                          value: bet.result === "" ? "Pending" : bet.winAmount > 0 ? `+₹${parseFloat(bet.winAmount).toFixed(2)}` : `-₹${parseFloat(bet.actualBetAmount).toFixed(2)}`,
                          color: bet.result === "" ? "#DD9138" : bet.winAmount > 0 ? "#17B15E" : "#D23838",
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
                              borderBottom: "1px solid #382e35",
                            }}
                          >
                            {row.label === "Amount after tax" ? (
                              <Typography sx={{ color: "red" }}>
                                {row.value}
                              </Typography>
                            ) : row.label === "Result" &&
                              row.value === "" ? ( // If Result is empty, display a blank Typography
                              <Typography sx={{ color: "#B79C8B" }}>
                                {" "}
                              </Typography>
                            ) : row.label === "Result" ? (
                              <Typography
                                sx={{
                                  color: "#B79C8B",
                                  fontSize:
                                    wordToNumber(row.value) >= 0 &&
                                      wordToNumber(row.value) <= 4
                                      ? "16px"
                                      : "16px",
                                }}
                              >
                                {row.value}{" "}
                                {wordToNumber(row.value) >= 0 &&
                                  wordToNumber(row.value) <= 4 ? (
                                  <span
                                    style={{ color: "#6ea8f4" }}
                                  >
                                    Small
                                  </span>
                                ) : (
                                  <span
                                    style={{ color: "#feaa57" }}
                                  >
                                    Big
                                  </span>
                                )}{" "}
                                {wordToNumber(row.value) === 0 ? (
                                  <span>
                                    <span style={{ color: "red" }}>
                                      Red
                                    </span>
                                    /
                                    <span
                                      style={{ color: "violet" }}
                                    >
                                      Violet
                                    </span>
                                  </span>
                                ) : [1, 3, 7, 9].includes(
                                  wordToNumber(row.value)
                                ) ? (
                                  <span style={{ color: "green" }}>
                                    Green
                                  </span>
                                ) : [2, 4, 6, 8].includes(
                                  wordToNumber(row.value)
                                ) ? (
                                  <span style={{ color: "red" }}>
                                    Red
                                  </span>
                                ) : wordToNumber(row.value) ===
                                  5 ? (
                                  <span>
                                    <span
                                      style={{ color: "green" }}
                                    >
                                      Green
                                    </span>
                                    /
                                    <span
                                      style={{ color: "violet" }}
                                    >
                                      Violet
                                    </span>
                                  </span>
                                ) : (
                                  <span style={{ color: "black" }}>
                                    Unknown
                                  </span>
                                )}
                              </Typography>
                            ) : (
                              wordToNumber(row.value)
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
                    sx={{ borderColor: "#382e35", width: "100%" }}
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
              backgroundColor: "#382e35", // Disabled background color
              color: "#B79C8B", // Optional: Change text color for better visibility
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
              backgroundColor: "#382e35", // Disabled background color
              color: "#B79C8B", // Optional: Change text color for better visibility
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

export default WingoMyHistory;
