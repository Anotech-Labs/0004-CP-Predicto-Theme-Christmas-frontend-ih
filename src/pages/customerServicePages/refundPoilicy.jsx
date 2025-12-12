import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Grid,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Mobile from "../../components/layout/Mobile";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAuth } from "../../context/AuthContext";
import { UserContext } from "../../context/UserState";
import { domain } from "../../utils/Secret";
import { format } from "date-fns";

const RefundProcess = () => {
  const { userData } = useContext(UserContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ message: "", severity: "info" });
  const [refundData, setRefundData] = useState(null);
  const [isLoadingRefundData, setIsLoadingRefundData] = useState(false);
  const [gameType, setGameType] = useState("ALL");

  const { axiosInstance } = useAuth();
  const navigate = useNavigate();

  const gameTypeLabels = {
    ALL: "All",
    WINGO: "Wingo",
    K3: "K3",
    FIVE_D: "5D",
    CAR_RACE: "Car Race"
  };

  const timerLabels = {
    ONE_MINUTE_TIMER: "1 Min",
    THREE_MINUTE_TIMER: "3 Min",
    FIVE_MINUTE_TIMER: "5 Min",
    TEN_MINUTE_TIMER: "10 Min",
    THIRTY_TIMER: "30 Sec",
  };

  // Fetch refund data on component mount or when game type changes
  useEffect(() => {
    if (userData?.uid) {
      fetchRefundData();
    }
  }, [userData, gameType]);

  const fetchRefundData = async () => {
    if (!userData?.uid) {
      //console.log("User ID not found:", userData?.uid);
      setError("User ID not found. Please try again later.");
      return;
    }

    setIsLoadingRefundData(true);
    try {
      // Use different endpoints based on game type selection
      const endpoint = gameType === "ALL"
        ? `${domain}/api/master-game/refund/pending-all`
        : `${domain}/api/master-game/refund/pending?gameType=${gameType}`;

      const response = await axiosInstance.get(endpoint);
      //console.log("Refund data response", response);
      setRefundData(response.data);
    } catch (err) {
      console.error(
        "Error fetching refund data:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Failed to load refund data");
    } finally {
      setIsLoadingRefundData(false);
    }
  };

  const handleSubmit = async () => {
    if (!userData?.uid) {
      setError("User ID not found. Please try again later.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Show loader for 3 seconds before making the API call
      setTimeout(async () => {
        try {
          // Use different endpoints based on game type selection
          const endpoint = gameType === "ALL"
            ? `${domain}/api/master-game/refund/process-all`
            : `${domain}/api/master-game/refund/process`;

          const payload = {
            uid: userData.uid,
          };

          // Add gameType to payload if specific game selected
          if (gameType !== "ALL") {
            payload.gameType = gameType;
          }

          const response = await axiosInstance.post(endpoint, payload);

          //console.log("response", response);
          setAlertMsg({
            message: "Refund process completed successfully!",
            severity: "success"
          });
          setOpenSnackbar(true);

          setTimeout(() => {
            // Refresh refund data after processing
            fetchRefundData();
          }, 2000);
        } catch (err) {
          console.error("Error:", err.response?.data || err.message);
          setAlertMsg({
            message: err.response?.data?.message || "Failed to process refund. Please try again.",
            severity: "error"
          });
          setOpenSnackbar(true);
        } finally {
          setLoading(false);
        }
      }, 3000); // Show loader for 3 seconds
    } catch (err) {
      setLoading(false);
      setError("An unexpected error occurred");
    }
  };

  const handleGameTypeChange = (event) => {
    setGameType(event.target.value);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  // Helper function to render game-specific data
  const renderGameSpecificData = (bet) => {
    if (!bet.gameSpecificData) return null;

    const data = bet.gameSpecificData;

    if (data.selectedItem) {
      return <span>{data.selectedItem}</span>;
    } else if (data.betType) {
      return <span>{data.betType}</span>;
    } else if (data.selectedSection) {
      return <span>Section: {data.selectedSection}</span>;
    }

    return null;
  };

  return (
    <Mobile>
      <Container
        disableGutters
        maxWidth="xs"
        sx={{
          bgcolor: "#232626",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          "&.MuiContainer-root": {
            maxWidth: "100%",
          },
        }}
      >
        <Box
          sx={{
            bgcolor: "#232626",
            padding: "8px 10px",
            display: "flex",
            alignItems: "center",
            color: "#ffffff",
          }}
        >
          <ChevronLeftIcon
            sx={{ fontSize: 30, cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, textAlign: "center", color: "#ffffff" }}
          >
            Refund Process
          </Typography>
          <HomeIcon
            sx={{ fontSize: 30, cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
        </Box>

        <Box sx={{ m: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ color: "#ffffff", mt: 2, mb: 1, textAlign: "left" }}
          >
            Your UID
          </Typography>
          <TextField
            fullWidth
            placeholder="Your UID"
            variant="outlined"
            value={userData?.uid || ""}
            disabled
            InputProps={{
              readOnly: true,
              style: { color: "#ffffff" },
            }}
            sx={{
              bgcolor: "#323738",
              "& .MuiOutlinedInput-root": {
                color: "#ffffff",
                input: {
                  height: "15px",
                  fontSize: "14px",
                  color: "#ffffff",
                },
                "& fieldset": { borderColor: "#454037" },
                "&:hover fieldset": { borderColor: " #454037" },
                "&.Mui-focused fieldset": { borderColor: " #454037" },
              },
              borderRadius: 1,
              "& .Mui-disabled": {
                WebkitTextFillColor: "#ffffff !important",
                color: "#ffffff !important",
              },
            }}
          />

          {/* Game Type Dropdown */}
          <Typography
            variant="subtitle1"
            sx={{ color: "#ffffff", mt: 2, mb: 1, textAlign: "left" }}
          >
            Game Type
          </Typography>
          <FormControl
            fullWidth
            sx={{
              bgcolor: "#323738",
              "& .MuiOutlinedInput-root": {
                color: "#ffffff",
                "& fieldset": { borderColor: "#454037" },
                "&:hover fieldset": { border: "1px solid #454037" },
                "&.Mui-focused fieldset": { border: "1px solid #454037" },
              },
              "& .MuiInputLabel-root": {
                color: "#A8A5A1",
              },
              "& .MuiSvgIcon-root": {
                color: "#ffffff",
              },
            }}
          >
            <Select
              value={gameType}
              onChange={handleGameTypeChange}
              displayEmpty
              sx={{ color: "#F5F3F0", height: "40px" }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#323738",
                    color: "#F5F3F0",
                    "& .MuiMenuItem-root": {
                      backgroundColor: "transparent !important", // removes selected bg
                      "&.Mui-selected": {
                        backgroundColor: "transparent !important",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "#2c2c2c", // optional: hover effect
                      },
                      "&:hover": {
                        backgroundColor: "#2c2c2c", // optional: hover effect
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="ALL">All Game Types</MenuItem>
              <MenuItem value="WINGO">Wingo</MenuItem>
              <MenuItem value="K3">K3</MenuItem>
              <MenuItem value="FIVE_D">5D</MenuItem>
              <MenuItem value="CAR_RACE">Car Race</MenuItem>
            </Select>
          </FormControl>

          {error && (
            <Typography color="error" sx={{ my: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{
              background: "linear-gradient(90deg,#24ee89,#9fe871)",
              color: "#323738",
              borderRadius: 4,
              mt: 3,
              mb: 3,
              textTransform: "none",
              "&:disabled": {
                background: "#454456",
                color: "#A8A5A1",
              },
            }}
            onClick={handleSubmit}
            disabled={loading || !userData?.uid}
          >
            {loading
              ? "Processing..."
              : `Process ${gameTypeLabels[gameType] || gameType} Refund`}
          </Button>

          {/* Refund Data Display */}
          {isLoadingRefundData ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress sx={{ color: "#FED358 " }} />
            </Box>
          ) : refundData ? (
            <Box sx={{ mt: 2 }}>
              {/* Summary Section */}
              <Paper
                elevation={0}
                sx={{
                  bgcolor: "#323738",
                  color: "#ffffff",
                  borderRadius: 2,
                  mb: 2,
                  p: 2,
                }}
              >
                <Typography variant="h6" sx={{ mb: 1, color: "#FED358 " }}>
                  Refund Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: "#A8A5A1" }}>
                      Pending Refunds:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {gameType === "ALL"
                        ? refundData.totalPendingRefunds
                        : refundData.pendingRefunds}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: "#A8A5A1" }}>
                      Total Refund Amount:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      ₹{(gameType === "ALL"
                        ? refundData.totalRefundAmount
                        : refundData.totalRefundAmount).toFixed(2)}
                    </Typography>
                  </Grid>
                  {refundData.refundAmount > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ color: "#A8A5A1" }}>
                        Refund Amount:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", color: "#FED358 " }}
                      >
                        ₹{refundData.refundAmount.toFixed(2)}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>

              {/* Game Type Summaries for ALL selection */}
              {gameType === "ALL" && refundData.gameTypeSummaries && (
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: "#323738",
                    color: "#ffffff",
                    borderRadius: 2,
                    mb: 2,
                    p: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1, color: "#FED358 " }}>
                    Game Types Summary
                  </Typography>
                  {refundData.gameTypeSummaries.map((summary, index) => (
                    <Box key={index} sx={{ mb: index < refundData.gameTypeSummaries.length - 1 ? 2 : 0 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ flex: 1, textAlign: "left" }}>
                          <Typography variant="body1">
                            {gameTypeLabels[summary.gameType] || summary.gameType}
                          </Typography></Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ color: "#A8A5A1" }}>
                            Amount: ₹{summary.totalRefundAmount.toFixed(2)}
                          </Typography></Box>
                        <Box sx={{ flex: 1, textAlign: "right" }}>
                          <Chip
                            label={`${summary.pendingRefunds} pending`}
                            size="small"
                            sx={{
                              bgcolor: summary.pendingRefunds > 0 ? "rgba(249, 89, 89, 0.1)" : "rgba(0, 0, 0, 0.1)",
                              color: summary.pendingRefunds > 0 ? "#FED358 " : "#A8A5A1",
                              borderRadius: 1,
                            }}
                          />
                        </Box>
                      </Box>

                      {index < refundData.gameTypeSummaries.length - 1 && (
                        <Divider sx={{ my: 1, borderColor: 'rgba(58, 58, 58, 0.2)' }} />
                      )}
                    </Box>
                  ))}
                </Paper>
              )}

              {/* Pending Period IDs */}
              {/* {gameType !== "ALL" && refundData.pendingPeriodIds && refundData.pendingPeriodIds.length > 0 && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        bgcolor: "#323738",
                                        color: "#ffffff",
                                        borderRadius: 2,
                                        mb: 2,
                                        p: 2,
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                        Pending Period IDs
                                    </Typography>
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                        {refundData.pendingPeriodIds.map((id, index) => (
                                            <Chip
                                                key={index}
                                                label={id}
                                                size="small"
                                                sx={{
                                                    bgcolor: "rgba(249, 89, 89, 0.1)",
                                                    color: "#FED358 ",
                                                    borderRadius: 1,
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Paper>
                            )} */}

              {/* Refund Transactions */}
              {gameType !== "ALL" && refundData.refundTransactions && refundData.refundTransactions.length > 0 && (
                <Accordion
                  sx={{
                    bgcolor: "#323738",
                    color: "#ffffff",
                    borderRadius: 2,
                    mb: 2,
                    "&:before": {
                      display: "none",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#FED358 " }} />}
                    sx={{
                      borderBottom: "1px solid rgba(249, 89, 89, 0.1)",
                      minHeight: "48px",
                    }}
                  >
                    <Typography>Refund Transactions</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <List disablePadding>
                      {refundData.refundTransactions.map(
                        (transaction, index) => (
                          <ListItem
                            key={index}
                            divider={
                              index !==
                              refundData.refundTransactions.length - 1
                            }
                            sx={{
                              borderColor: "rgba(58, 58, 58, 0.2)",
                              py: 1,
                            }}
                          >
                            <ListItemText
                              primary={
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography variant="body2">
                                    ₹{transaction.amount.toFixed(2)}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "#A8A5A1" }}
                                  >
                                    {formatDate(transaction.createdAt)}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#A8A5A1" }}
                                >
                                  {transaction.details}
                                </Typography>
                              }
                            />
                          </ListItem>
                        )
                      )}
                    </List>
                  </AccordionDetails>
                </Accordion>
              )}

              {/* Bets Details */}
              {gameType !== "ALL" && refundData.bets && refundData.bets.length > 0 && (
                <Accordion
                  sx={{
                    bgcolor: "#323738",
                    color: "#ffffff",
                    borderRadius: 2,
                    mb: 2,
                    "&:before": {
                      display: "none",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#FED358 " }} />}
                    sx={{
                      borderBottom: "1px solid rgba(249, 89, 89, 0.1)",
                      minHeight: "48px",
                    }}
                  >
                    <Typography>Bets ({refundData.bets.length})</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <List disablePadding>
                      {refundData.bets.map((bet, index) => (
                        <ListItem
                          key={index}
                          divider={index !== refundData.bets.length - 1}
                          sx={{
                            borderColor: "rgba(58, 58, 58, 0.2)",
                            py: 1,
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography variant="body2">
                                  ₹{bet.betAmount.toFixed(2)} {" "}
                                  {/* {renderGameSpecificData(bet)} */}
                                </Typography>
                                {bet.selectedTimer && (
                                  <Chip
                                    label={timerLabels[bet.selectedTimer] || bet.selectedTimer}
                                    size="small"
                                    sx={{
                                      bgcolor: "rgba(249, 89, 89, 0.1)",
                                      color: "#FED358 ",
                                      height: "20px",
                                      fontSize: "10px",
                                    }}
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              <Typography
                                variant="caption"
                                sx={{ color: "#A8A5A1" }}
                              >
                                ID: {bet.id} • Period: {bet.periodId}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>
          ) : null}
        </Box>

        {/* Loading Animation */}
        {loading && (
          <Box
            sx={{
              position: "fixed",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "rgba(0, 0, 0, 0.9)",
              color: "white",
              padding: "20px 30px",
              borderRadius: "10px",
              zIndex: 1000,
              textAlign: "center",
              minWidth: "200px",
              minHeight: "150px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="loader"></div>
            <Typography variant="body1" sx={{ marginTop: "15px" }}>
              Processing...
            </Typography>
          </Box>
        )}

        {/* Snackbar for notifications */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <MuiAlert
            onClose={handleCloseSnackbar}
            severity={alertMsg.severity}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }}
          >
            {alertMsg.message}
          </MuiAlert>
        </Snackbar>

        {/* CSS for the loading animation */}
        <style jsx>{`
 @keyframes fadeIn {
 from {
 opacity: 0;
 }
 to {
 opacity: 1;
 }
 }

 @keyframes spin {
 0% {
 transform: rotate(0deg);
 }
 100% {
 transform: rotate(360deg);
 }
 }

 .loader {
 border: 4px solid rgba(255, 255, 255, 0.3);
 border-radius: 50%;
 border-top: 4px solid #FED358 ;
 width: 40px;
 height: 40px;
 margin: 0 auto;
 animation: spin 1s linear infinite;
 }
 `}</style>
      </Container>
    </Mobile>
  );
};

export default RefundProcess;