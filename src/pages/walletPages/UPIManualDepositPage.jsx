import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Alert,
  Grid,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { domain } from "../../utils/Secret";
import { useAuth } from "../../context/AuthContext";
import Mobile from "../../components/layout/Mobile";

const UPIManualDepositPage = () => {
  const { id1, id2 } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedUPI, setSelectedUPI] = useState(null);
  const [utr, setUtr] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5 * 60); // 5 minutes
  const [isExpired, setIsExpired] = useState(false);
  const { axiosInstance } = useAuth();
  
  const query = new URLSearchParams(location.search);
  const amount = query.get("amount") || "100";

  const [orderNumber] = useState(() => {
    return `UPI${new Date()
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, 14)}${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`;
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch active UPI settings and randomly select one
  useEffect(() => {
    setDataLoading(true);

    axiosInstance
      .get(`${domain}/api/upi/active/upi`, { withCredentials: true })
      .then((res) => {
        const upiData = res.data.data;
        console.log("UPI API Response:", upiData);

        if (upiData && upiData.length > 0) {
          // Filter only records with UPI ID
          const validUPIs = upiData.filter(
            (record) => record.upiId && record.imageUrl
          );

          if (validUPIs.length > 0) {
            // Randomly select one UPI
            const randomIndex = Math.floor(Math.random() * validUPIs.length);
            setSelectedUPI(validUPIs[randomIndex]);
            console.log("Selected UPI:", validUPIs[randomIndex]);
          } else {
            setPopupMessage("No active UPI payment methods available.");
          }
        } else {
          setPopupMessage("No UPI payment settings found.");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch UPI settings:", err);
        setPopupMessage("Failed to load payment settings. Please try again.");
      })
      .finally(() => {
        setDataLoading(false);
      });
  }, [axiosInstance]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setPopupMessage("Copied!");
    setIsPopupVisible(true);
    setTimeout(() => setIsPopupVisible(false), 2000);
  };

  const sendUPIDeposit = async () => {
    setPopupMessage("");

    if (!utr) {
      setPopupMessage("UTR number is required");
      setIsPopupVisible(true);
      setTimeout(() => setIsPopupVisible(false), 3000);
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post(
        `${domain}/api/wallet/deposit`,
        {
          amount: parseInt(amount),
          depositMethod: "UPI",
          utrNumber: utr,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setPopupMessage("Deposit submitted successfully!");
        setIsPopupVisible(true);
        setUtr("");
        setTimeout(() => {
          setIsPopupVisible(false);
          navigate("/wallet/deposit");
        }, 3000);
      } else {
        const errorMsg =
          res.data.error === "DUPLICATE_UTR_NUMBER"
            ? "UTR number already used. Use a different one."
            : res.data.message || "Something went wrong";
        setPopupMessage(errorMsg);
        setIsPopupVisible(true);
        setTimeout(() => setIsPopupVisible(false), 3000);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error === "DUPLICATE_UTR_NUMBER"
          ? "UTR number already used. Use a different one."
          : error.response?.data?.message || "Network error. Try again.";
      setPopupMessage(errorMsg);
      setIsPopupVisible(true);
      setTimeout(() => setIsPopupVisible(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToMerchant = () => {
    navigate("/wallet/deposit");
  };

  // Expired payment screen
  if (isExpired) {
    return (
      <Mobile>
        <Container
          sx={{
            p: 0,
            "&.MuiContainer-root": {
              paddingLeft: "0 !important",
              paddingRight: "0 !important",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: "100vh",
              background: "#ffffff",
              p: 2,
            }}
          >
            <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
              Payment Invalid
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                height: "60vh",
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    border: "2px solid black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    ✕
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
                Payment Invalid
              </Typography>

              <Typography
                variant="body1"
                sx={{ mb: 4, color: "#666", textAlign: "center" }}
              >
                The payment order has expired
              </Typography>

              <Button
                variant="contained"
                onClick={handleReturnToMerchant}
                sx={{
                  py: 1.5,
                  px: 1,
                  bgcolor: "#000000",
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#333333",
                  },
                  borderRadius: 50,
                  width: "80%",
                  maxWidth: 300,
                }}
              >
                Return to merchant
              </Button>
            </Box>
          </Box>
        </Container>
      </Mobile>
    );
  }

  // Show error if no UPI data
  if (!dataLoading && !selectedUPI) {
    return (
      <Mobile>
        <Container
          sx={{
            p: 0,
            "&.MuiContainer-root": {
              paddingLeft: "0 !important",
              paddingRight: "0 !important",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              background: "#ffffff",
              p: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, color: "#E22323", textAlign: "center" }}
            >
              UPI Payment Not Available
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 3, textAlign: "center", color: "#666" }}
            >
              {popupMessage ||
                "UPI payment method is not configured. Please contact support."}
            </Typography>
            <Button
              variant="contained"
              onClick={handleReturnToMerchant}
              sx={{
                py: 1.5,
                px: 3,
                bgcolor: "#dd0000",
                color: "#FFFFFF",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#bb0000",
                },
                borderRadius: "8px",
              }}
            >
              Return to Deposit
            </Button>
          </Box>
        </Container>
      </Mobile>
    );
  }

  // Main UPI deposit page
  return (
    <Mobile>
      <Container
        sx={{
          p: 0,
          "&.MuiContainer-root": {
            paddingLeft: "0 !important",
            paddingRight: "0 !important",
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            bgcolor: "#ffffff",
            boxShadow: "none",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              pb: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "100%", textAlign: "left" }}>
              <img
                src="/assets/logo/lalapay.webp"
                alt="Lala Pay"
                style={{
                  height: "24px",
                  marginBottom: "16px",
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                <img src="/assets/wallet/UPI x QR.webp" alt="UPI" style={{ width: "100%" }} />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  fontSize: "23px",
                }}
              >
                ₹{Number(amount).toFixed(2)}
              </Typography>
            </Box>
          </Box>

          {/* Warning message */}
          <Box
            sx={{
              bgcolor: "#ffe8e3",
              py: 0.5,
              px: 1.5,
              textAlign: "center",
              mb: 2,
              mx: 2,
              borderRadius: "5px",
            }}
          >
            <Typography
              variant="body2"
              color="#E22323"
              sx={{ fontSize: "11.8px" }}
            >
              Please complete the payment within the time limit. Amount must match exactly.
            </Typography>
          </Box>

          <Box
            sx={{ mx: 2, my: 2, background: "#f7f7f7", borderRadius: "5px" }}
          >
            {/* Timer and Order ID */}
            <Box
              sx={{
                px: 2,
                py: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#6E6E6E", fontSize: "11.8px", fontWeight: "500" }}
              >
                CountDown
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", fontSize: "13.7px", color: timeRemaining < 60 ? "#E22323" : "#000" }}
              >
                {formatTime(timeRemaining)}
              </Typography>
            </Box>

            <Box
              sx={{
                px: 2,
                pb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#6E6E6E", fontSize: "11.8px" }}
              >
                Order Number
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ mr: 1, color: "#000000", fontSize: "11.8px" }}
                >
                  {orderNumber}
                </Typography>
                <ContentCopyIcon
                  fontSize="small"
                  sx={{
                    color: "#000000",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  onClick={() => copyToClipboard(orderNumber)}
                />
              </Box>
            </Box>
          </Box>

          {/* QR Code */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pb: 3,
              pt: 1,
              px: 2,
            }}
          >
            {dataLoading ? (
              <CircularProgress size={30} />
            ) : selectedUPI?.imageUrl ? (
              <Box
                sx={{
                  border: "5px solid #f0f1f5",
                  p: 2,
                  borderRadius: 1,
                  bgcolor: "#FFFFFF",
                  width: "200px",
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={selectedUPI.imageUrl}
                  alt="UPI QR Code"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  onError={(e) => {
                    console.error("QR Code image failed to load");
                    e.target.style.display = "none";
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  border: "5px solid #f0f1f5",
                  p: 2,
                  borderRadius: 1,
                  bgcolor: "#FFFFFF",
                  width: "200px",
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#666", textAlign: "center" }}
                >
                  QR Code not available
                </Typography>
              </Box>
            )}
          </Box>

          {/* UPI ID */}
          <Box sx={{ mx: 2, background: "#f7f7f7", borderRadius: "5px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                alignItems: "flex-start",
                py: 2,
                px: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#929292", fontSize: "11.8px" }}
              >
                UPI ID
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: "break-all",
                    fontSize: "13px",
                    fontWeight: "500",
                  }}
                >
                  {selectedUPI?.upiId || "Loading..."}
                </Typography>
                {selectedUPI?.upiId && (
                  <ContentCopyIcon
                    fontSize="small"
                    onClick={() => copyToClipboard(selectedUPI.upiId)}
                    sx={{
                      color: "#9E9E9E",
                      cursor: "pointer",
                      fontSize: "15px",
                      ml: 1,
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {/* UTR Input */}
          <Grid item xs={12} sx={{ mx: 2, mt: 2 }}>
            <Typography
              variant="subtitle1"
              color="#333333"
              mb={1}
              fontWeight="600"
              fontSize="16px"
            >
              UTR Number / Transaction ID
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your UTR/Transaction ID"
              variant="outlined"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "14px",
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "#E0E0E0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#dd0000",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#dd0000",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: "10.5px 14px",
                },
              }}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12} mt={{ xs: 1, md: 2 }} sx={{ mx: 2, mb: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={sendUPIDeposit}
              disabled={!selectedUPI || loading}
              sx={{
                py: { xs: 1.25, md: 1.5 },
                background: "linear-gradient(90deg, #6a1b17 0%, #f70208 100%)",
                color: "#FFFFFF",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(90deg, #5a0f0f 0%, #d70106 100%)",
                },
                "&:disabled": {
                  bgcolor: "#CCCCCC",
                  color: "#666666",
                },
                boxShadow: "0 2px 4px rgba(221, 0, 0, 0.2)",
                borderRadius: "8px",
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
              ) : (
                "Submit Transaction"
              )}
            </Button>
          </Grid>

          {/* Warning Information */}
          <Box sx={{ px: 2, pb: 3, mt: 5 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                mb: 1.5,
                fontSize: "17px",
                textAlign: "left",
              }}
            >
              Important Instructions:
            </Typography>

            <Typography variant="body2" sx={{ mb: 1.5, textAlign: "left" }}>
              1. Minimum deposit amount:{" "}
              <span style={{ color: "#E22323" }}>₹100</span>, deposits less
              than the minimum will not be credited
            </Typography>

            <Typography variant="body2" sx={{ mb: 1.5, textAlign: "left" }}>
              2. Please ensure the amount you transfer matches{" "}
              <span style={{ color: "#E22323" }}>exactly ₹{amount}</span> to avoid issues
            </Typography>

            <Typography variant="body2" sx={{ mb: 1.5, textAlign: "left" }}>
              3. After completing payment, enter the UTR/Transaction ID to confirm
            </Typography>

            <Typography variant="body2" sx={{ textAlign: "left" }}>
              4. Do not cancel the order after transferring the amount
            </Typography>
          </Box>
        </Paper>

        {/* Popup Notification */}
        <div>
          {isPopupVisible && (
            <Box
              sx={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "rgba(0, 0, 0, 0.8)",
                color: "white",
                padding: "10px 20px",
                borderRadius: "10px",
                zIndex: 1000,
                animation: "fadeIn 0.5s ease",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography variant="body1">{popupMessage}</Typography>
            </Box>
          )}
          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
          `}</style>
        </div>
      </Container>
    </Mobile>
  );
};

export default UPIManualDepositPage;