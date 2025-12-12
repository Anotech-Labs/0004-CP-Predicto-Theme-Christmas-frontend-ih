import React, { useEffect, useState } from "react";
import Mobile from "../../components/layout/Mobile";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

import { useNavigate } from "react-router-dom";
// import axios from "axios";
import Phone from "@mui/icons-material/Phone";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import EditIcon from "@mui/icons-material/Edit";
// import MuiAlert from "@mui/material/Alert";
import { useAuth } from "../../context/AuthContext";
import { domain } from "../../utils/Secret";

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "#232626",
  display: "flex",
  flexDirection: "column",
}));

const WarningBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#323738",
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  borderRadius: "12px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
}));

const InputContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#323738",
  padding: theme.spacing(1),
  borderRadius: "12px",
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  color: "#666462",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
}));

const SaveButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(90deg,#24ee89,#9fe871),#323738",
  color: "white",
  fontWeight: "bold",
  borderRadius: "24px",
  padding: "12px",
  marginTop: theme.spacing(4),
  "&:hover": {
    backgroundColor: "#0C4F14",
  },
  textTransform: "uppercase",
  letterSpacing: "2px",
}));

const UsdtAddress = () => {
  // const classes = useStyles();
  const navigate = useNavigate();
  const { axiosInstance } = useAuth();
  //   const bankContext = useBank();
  //   const selectedBank = bankContext ? bankContext.selectedBank : null;
  const [errorMessage, setErrorMessage] = useState("");
  const [network, setNetwork] = useState("TRC"); // Default network
  const [usdtAddress, setUsdtAddress] = useState(""); // State for USDT address
  const [addressAlias, setAddressAlias] = useState(""); // State for alias
  const [trxAddress, setTrxAddress] = useState(""); // State for TRX address
  const [successPopupOpen, setSuccessPopupOpen] = useState(false); // State for success popup

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  // Function to handle the USDT Address submission
  // const handleSubmitUSDT = async (e) => {
  //   e.preventDefault();
  //   if (!usdtAddress || !addressAlias) {
  //     alert("Please provide both USDT address and alias.");
  //     return;
  //   }

  //   try {
  //     const response = await axiosInstance.post(
  //       `${domain}/api/list/usdt/crypto`,
  //       {
  //         network,
  //         usdtAddress,
  //         addressAlias,
  //       },
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     //console.log(response.data);
  //     setSuccessPopupOpen(true); // Open success popup
  //     navigate("/wallet/withdraw");
  //   } catch (err) {
  //     alert(err.response?.data || "Error occurred while saving the address.");
  //   }
  // };

  // Function to handle the TRX Address submission
  const handleSubmitTRX = async (e) => {
    e.preventDefault();
    setErrorMessage("")

    if (!trxAddress || !addressAlias) {
      setErrorMessage("Please provide both TRX address and alias.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    if (trxAddress.length < 26) {
      setErrorMessage("Crypto address must be at least 26 characters.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    if (trxAddress.length > 100) {
      setErrorMessage("Crypto address cannot exceed 100 characters.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    try {
      const response = await axiosInstance.post(
        `${domain}/api/list/usdt/crypto`,
        {
          address: trxAddress, // Updated to 'address' as expected by the backend
          network: "TRX",
          alias: addressAlias, // Send alias with TRX address
        },
        {
          withCredentials: true,
        }
      );
      //console.log(response.data);
      setSuccessPopupOpen(true); // Open success popup
      navigate("/wallet/withdraw");
    } catch (err) {
      console.error(err);
    }
  };

  const handleClosePopup = () => {
    setSuccessPopupOpen(false);
  };

  return (
    <>
      <Mobile>
        <Box display="flex" flexDirection="column" height="100vh">
          <Box>
            <Grid
              container
              alignItems="center"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#232626",
                padding: "12px 16px",
                // borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Grid item xs={1}>
                <IconButton
                  sx={{ color: "#FDE4BC", padding: 0 }}
                  onClick={() => navigate(-1)}
                >
                  <ArrowBackIosNewIcon />
                </IconButton>
              </Grid>
              <Grid item xs={11}>
                <Typography
                  variant="subtitle1"
                  sx={{ textAlign: "center", color: "#FDE4BC" }}
                >
                  Add USDT Address
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <StyledContainer>
            <WarningBox>
              <ErrorOutlineOutlinedIcon
                sx={{ color: "error.main", marginRight: 1 }}
                fontSize="small"
              />
              <Typography
                variant="body2"
                display="flex"
                alignItems="center"
                color="error"
                sx={{ fontSize: "12px" }}
              >
                To ensure the safety of your funds, please link your wallet
              </Typography>
            </WarningBox>

            {/* Network Selection */}
            <Box mb={2}>
              <Box display="flex" alignItems="center" mb={1}>
                <LanguageIcon sx={{ marginRight: 2, color: "#f5a93b" }} />
                <Typography sx={{ fontWeight: "bold", color: "#f5f3f0" }}>
                  Select main network
                </Typography>
              </Box>
              <InputContainer>
                <Typography variant="subtitle1">{network}</Typography>
                <EditIcon style={{ color: "#f5a93b", marginLeft: 8 }} />
              </InputContainer>
            </Box>

            {/* TRX Address Section */}
            <Box mb={2}>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography
                  sx={{ fontWeight: "bold", color: "#f5f3f0", mb: 1 }}
                >
                  TRX Address
                </Typography>
              </Box>
              <InputContainer>
                <TextField
                  fullWidth
                  placeholder="Please enter the USDT address"
                  value={trxAddress}
                  onChange={(e) => setTrxAddress(e.target.value)}
                  variant="standard"
                  required
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{
                    "& input": {
                      color: "grey",
                    },
                    "& input::placeholder": {
                      color: "#999999",
                      fontSize: "15px",
                    },
                  }}
                />
              </InputContainer>
            </Box>

            {/* Alias Section */}
            <Box mb={4}>
              <Box display="flex" alignItems="center" mb={1}>
                <Phone sx={{ color: "#f5a93b" }} />
                <Typography
                  sx={{ fontWeight: "bold", color: "#f5f3f0", mb: 1 }}
                >
                  Address Alias
                </Typography>
              </Box>
              <InputContainer>
                <TextField
                  fullWidth
                  placeholder="Please enter a remark of the withdrawal address"
                  value={addressAlias}
                  onChange={(e) => setAddressAlias(e.target.value)}
                  variant="standard"
                  required
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{
                    "& input": {
                      color: "grey",
                    },
                    "& input::placeholder": {
                      color: "#999999",
                      fontSize: "15px",
                    },
                  }}
                />
              </InputContainer>
            </Box>
            {errorMessage && (
              <Typography color="error" variant="caption">
                {errorMessage}
              </Typography>
            )}
            {/* Save Button for TRX Address */}
            <SaveButton onClick={handleSubmitTRX} fullWidth>
              Save
            </SaveButton>
          </StyledContainer>

          {/* Success Popup */}
          <Snackbar
            open={successPopupOpen}
            autoHideDuration={4000}
            onClose={handleClosePopup}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={handleClosePopup} severity="success">
              Address successfully saved!
            </Alert>
          </Snackbar>
        </Box>
      </Mobile>
    </>
  );
};

export default UsdtAddress;
