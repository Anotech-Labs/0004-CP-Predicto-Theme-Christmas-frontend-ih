import React, { useEffect, useState, useContext } from "react";
import Mobile from "../../components/layout/Mobile";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import SvgIcon from "@mui/material/SvgIcon";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ListItemIcon from "@mui/material/ListItemIcon";
// import RefreshIcon from "@mui/icons-material/Refresh";
import Dialog from "@mui/material/Dialog";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import Divider from "@mui/material/Divider";
// import { makeStyles } from "@material-ui/core/styles";
// import InputAdornment from "@material-ui/core/InputAdornment";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import StarIcon from "@mui/icons-material/Star";
// import BulletPoint from "@material-ui/icons/FiberManualRecord";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { domain } from "../../utils/Secret";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@mui/material";
import WalletCard from "../../components/wallet/WalletCard";
// import CloseIcon from "@mui/icons-material/Close"
import InputAdornment from "@mui/material/InputAdornment";
import { UserContext } from "../../context/UserState";
import { useAuth } from "../../context/AuthContext";
import LockIcon from "@mui/icons-material/Lock";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
const RhombusIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 2L22 12L12 22L2 12L12 2Z" />
  </SvgIcon>
);
// const useStyles = makeStyles((theme) => ({
//   cardContainer: {
//     width: "100%",
//     // margin: "10px auto",
//     // borderRadius: "8px",
//     backgroundColor: "#f5f5f5",
//     display: "flex",
//     alignItems: "center",
//     padding: "10px",
//     // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//   },
//   imageContainer: {
//     width: "40px",
//     height: "40px",
//     borderRadius: "50%",
//     backgroundColor: "#ffffff",
//     overflow: "hidden",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   detailsContainer: {
//     flex: 1,
//     marginLeft: "10px",
//   },
//   iconContainer: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "flex-end",
//   },
//   root: {
//     flexGrow: 1,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     margin: "0 10px",
//     // backgroundColor: 'rgb(42,50,112)',
//     color: "#a7a5a1",
//   },
//   input: {
//     marginLeft: theme.spacing(1),
//     marginRight: theme.spacing(1),
//     backgroundColor: "rgb(55,72,146)",
//     width: "35ch",
//     "& .MuiOutlinedInput-root": {
//       "& fieldset": {
//         borderColor: "rgb(34,39,91)",
//       },
//     },
//     "& .MuiOutlinedInput-input": {
//       color: "#a7a5a1",
//     },
//     borderRadius: "10px",
//   },
//   button: {
//     margin: theme.spacing(3),
//     borderRadius: "12px",
//     width: "40ch",
//   },
//   list: {
//     color: "#a7a5a1",
//   },
// }));

const WithDraw = ({ children }) => {
  //   const classes = useStyles();

  const [withdrawals, setWithdrawals] = useState([]);
  const { userWallet, userData, getUserData } = useContext(UserContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { axiosInstance } = useAuth();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const fetchWithdrawals = async () => {
    try {
      const response = await axiosInstance.get(
        `${domain}/api/wallet/withdraw/history`,
        {
          withCredentials: true,
        }
      );
      // //console.log("withdraw/history", response.data.data)
      if (response.data.success) {
        const latestFiveHistories = response.data.data.slice(0, 5);
        setWithdrawals(latestFiveHistories);
      }
    } catch (error) {
      console.error("Error fetching withdrawal data:", error);
    }
  };
  useEffect(() => {
    fetchWithdrawals();
  }, []);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  const [amount, setAmount] = useState("");

  // const handleButtonClick = (value) => {
  //   setAmount(value)
  // }

  // const handleInputChange = (event) => {
  //   setAmount(event.target.value)
  // }
  // const [walletData, setWalletData] = useState(0)
  // const [userWithdrawalRequests, setUserWithdrawalRequests] = useState([])
  // const [existingBankDetails, setExistingBankDetails] = useState(null)
  // const [openBankDialog, setOpenBankDialog] = useState(false)
  // const [bankAccountName, setBankAccountName] = useState("")
  const [withdrawalMethod, setWithdrawalMethod] = useState("Bank Card");
  const [existingUsdtDetails, setExistingUsdtDetails] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    mobileNumber: "",
    isPrimary: "",
  });

  const [usdtDetails, setUsdtDetails] = useState({
    address: "", // Updated to directly manage TRX address and alias
    network: "",
    alias: "",
  });

  // UPI state management
  const [upiDetails, setUpiDetails] = useState({
    primaryUPI: null,
    canWithdraw: false,
  });
  const [upiAmount, setUpiAmount] = useState("");

  // const handleRedirect = () => {
  //   navigate(-1)
  // }

  const handlePage = () => {
    navigate("/withdraw-history");
  };

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `${domain}/api/list/banking/account`,
          {
            withCredentials: true,
          }
        );
        // //console.log("bank details -->", response.data)

        // Check if response data is not empty and has bank details
        // if (response.data && response.data.length > 0) {
        setBankDetails(response.data.data); // Set the first object from the response data
        // } else {
        //   setBankDetails(null) // Set bankDetails to null if no data is available
        // }
      } catch (err) {
        console.error(err.response?.data || err.message);
        setBankDetails(null); // Set bankDetails to null in case of an error
      }
    };

    fetchBankDetails();
  }, []);

  useEffect(() => {
    // Clear amount when withdrawal method changes
    setAmount("");
  }, [withdrawalMethod]);

  // Truncate bank name to 10 characters followed by "..."
  const truncatedBankName =
    bankDetails?.bankName && bankDetails.bankName.length > 10
      ? `${bankDetails.bankName.substring(0, 10)}...`
      : bankDetails?.bankName || "";
  // //console.log("result",bankDetails)
  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `${domain}/api/list/usdt/crypto`,
          {
            withCredentials: true,
          }
        );
        // //console.log("Fetching bank details...",response.data.data)
        if (response.data.data) {
          // Store the entire array of wallet addresses and the network
          setUsdtDetails({
            address: response.data.data.address,
            network: response.data.data.network,
            alias: response.data.data.alias,
          });
          setExistingUsdtDetails(response.data.data);
          // //console.log("setUsdtDetails",setUsdtDetails)
        } else {
          // Handle the case where no data is found
          // //console.log("No data in response")
          setUsdtDetails({ address: "", network: "" });
        }
      } catch (err) {
        console.error("Error fetching TRX address details:", err);
        // Handle errors and update state if needed
        setUsdtDetails({ address: "", network: "" });
        // Optionally set an error message state here
      }
    };

    fetchBankDetails();
  }, []);

  // Separate useEffect to log usdtDetails whenever it changes
  // useEffect(() => {
  //   // //console.log("USDT details:", usdtDetails)
  // }, [usdtDetails]);

  // Fetch UPI details
  useEffect(() => {
    const fetchUPIDetails = async () => {
      try {
        // Fetch primary UPI
        const primaryResponse = await axiosInstance.get(
          `${domain}/api/list/upi/primary`
        );

        // Check withdrawal eligibility
        const eligibilityResponse = await axiosInstance.get(
          `${domain}/api/list/upi/withdrawal-eligibility`
        );

        setUpiDetails({
          primaryUPI: primaryResponse.data.data,
          canWithdraw: eligibilityResponse.data.data?.canWithdraw || false,
        });
      } catch (error) {
        console.error("Error fetching UPI details:", error);
        setUpiDetails({
          primaryUPI: null,
          canWithdraw: false,
        });
      }
    };

    fetchUPIDetails();
  }, []);

  // const handleBankDetailsChange = (event) => {
  //   const { name, value } = event.target

  //   if (withdrawalMethod === "Bank Card") {
  //     setBankDetails({
  //       ...bankDetails,
  //       [name]: value,
  //     })
  //   } else {
  //     if (name === "network") {
  //       // Handle changes to the network field
  //       setUsdtDetails({
  //         ...usdtDetails,
  //         [name]: value,
  //       })
  //     } else if (name.startsWith("address") || name.startsWith("alias")) {
  //       // Handle changes to wallet address fields
  //       const index = parseInt(name.match(/\d+/)[0], 10) // Extract index from name

  //       setUsdtDetails((prevDetails) => {
  //         const updatedWalletAddress = [...prevDetails.walletAddress]
  //         updatedWalletAddress[index] = {
  //           ...updatedWalletAddress[index],
  //           [name.split("-")[1]]: value, // Update specific field (address or alias)
  //         }

  //         return {
  //           ...prevDetails,
  //           walletAddress: updatedWalletAddress,
  //         }
  //       })
  //     }
  //   }
  // }

  const navigate = useNavigate();
  const location = useLocation();
  // //console.log(location, "location")
  const handleWithdrawback = () => {
    if (location.state?.from === "addbank") {
      // Redirect to 'withdrawal' page
      navigate("/wallet/withdraw");
    } else {
      // Optionally handle cases where the previous page is not 'addbank'
      navigate(-1);
    }
  };

  const handleWithdraw = async () => {
    // Parse withdrawal amounts
    const usdtAmountNum = parseFloat(usdtAmount);
    const withdrawalAmountNum = parseFloat(withdrawalAmount);

    // Handling Bank Card Withdrawals
    if (!withdrawData) {
      setIsPopupVisible(true);
      setPopupMessage("Withdrawal settings not found");
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 2000);
      return;
    }

    if (withdrawalMethod === "Bank Card") {
      // Validate bank account number
      if (
        !bankDetails.accountNumber ||
        bankDetails.accountNumber.trim() === ""
      ) {
        setIsPopupVisible(true);
        setPopupMessage("Please enter your bank account number.");
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        return;
      }

      // Validate withdrawal amount for Bank Card
      if (
        withdrawalAmountNum < withdrawData.minWithdrawAmount ||
        withdrawalAmountNum > withdrawData.maxWithdrawAmount
      ) {
        setIsPopupVisible(true);
        setPopupMessage(
          `Please enter an amount between ₹${withdrawData.minWithdrawAmount} and ₹${withdrawData.maxWithdrawAmount}.`
        );
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        return;
      }

      if (betAmount && betAmount.amount !== "0") {
        setIsPopupVisible(true);
        setPopupMessage("Please use all your deposit money first!");
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        return;
      }

      if (!canWithdraw) {
        setIsPopupVisible(true);
        setPopupMessage("Please contact to your Admin !");
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        return;
      }

      // Ensure withdrawal amount is a valid number
      if (isNaN(withdrawalAmountNum)) {
        setIsPopupVisible(true);
        setPopupMessage("Please enter a valid withdrawal amount.");
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        return;
      }

      // Proceed with Bank Card withdrawal request
      try {
        const response = await axiosInstance.post(
          `${domain}/api/wallet/withdraw`,
          {
            amount: withdrawalAmountNum,
            withdrawalMethod: "BANK_TRANSFER",
          },
          {
            withCredentials: true,
          }
        );

        // Check if the response indicates success or failure
        if (
          response.data &&
          response.data.data &&
          !response.data.data.success
        ) {
          // Handle service-level error
          setIsPopupVisible(true);
          setPopupMessage(
            response.data.data.error || "Withdrawal request failed"
          );
          setTimeout(() => {
            setIsPopupVisible(false);
          }, 2000);
          return;
        }

        // Success case
        fetchWithdrawals();
        setIsPopupVisible(true);
        setPopupMessage("Bank Card withdrawal request was successful.");
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);

        // Reset Bank Card form fields
        setWithdrawalAmount("");
      } catch (error) {
        setIsPopupVisible(true);
        setPopupMessage(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Bank Card withdrawal request failed"
        );
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
      }
    }

    // Handling USDT Withdrawals
    else if (withdrawalMethod === "USDT") {
      // Validate USDT wallet address
      if (!existingUsdtDetails || !existingUsdtDetails.address) {
        setIsPopupVisible(true);
        setPopupMessage("Please set up your USDT wallet address first.");
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        return;
      }

      if (betAmount && betAmount.amount !== "0") {
        setIsPopupVisible(true);
        setPopupMessage("Please use all your deposit money first!");
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        return;
      }

      // Ensure USDT amount is valid
      if (isNaN(usdtAmountNum)) {
        setIsPopupVisible(true);
        setPopupMessage("Please enter a valid USDT amount.");
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        return;
      }

      // Validate USDT withdrawal amount
      if (usdtAmountNum < 10) {
        setIsPopupVisible(true);
        setPopupMessage("USDT amount must be at least $10.");
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        return;
      }

      if (usdtAmountNum > 100) {
        setIsPopupVisible(true);
        setPopupMessage("USDT amount cannot exceed $100.");
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        return;
      }

      // Proceed with USDT withdrawal request
      try {
        const response = await axiosInstance.post(
          `${domain}/api/wallet/withdraw`,
          {
            amount: withdrawalAmountNum,
            withdrawalMethod: "USDT",
          },
          {
            withCredentials: true,
          }
        );

        // Check if the response indicates success or failure
        if (
          response.data &&
          response.data.data &&
          !response.data.data.success
        ) {
          // Handle service-level error
          setIsPopupVisible(true);
          setPopupMessage(
            response.data.data.error || "Withdrawal request failed"
          );
          setTimeout(() => {
            setIsPopupVisible(false);
          }, 2000);
          return;
        }

        // Success case
        fetchWithdrawals();
        setIsPopupVisible(true);
        setPopupMessage("USDT withdrawal request was successful.");
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);

        // Reset USDT form fields
        setUsdtAmount("");
        setWithdrawalAmount("");
      } catch (error) {
        setIsPopupVisible(true);
        setPopupMessage(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "USDT withdrawal request failed"
        );
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
      }
    }

    // Handling UPI Withdrawals
    else if (withdrawalMethod === "UPI") {
      // Validate UPI setup
      if (!upiDetails.primaryUPI || !upiDetails.canWithdraw) {
        setIsPopupVisible(true);
        setPopupMessage("Please set up your primary UPI address first.");
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        return;
      }

      // Validate UPI amount
      const upiAmountNum = parseFloat(upiAmount);
      if (isNaN(upiAmountNum) || upiAmountNum <= 0) {
        setIsPopupVisible(true);
        setPopupMessage("Please enter a valid UPI amount.");
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        return;
      }

      // Validate UPI withdrawal amount against settings
      if (
        upiAmountNum < withdrawData.minWithdrawAmount ||
        upiAmountNum > withdrawData.maxWithdrawAmount
      ) {
        setIsPopupVisible(true);
        setPopupMessage(
          `UPI amount must be between ₹${withdrawData.minWithdrawAmount} and ₹${withdrawData.maxWithdrawAmount}.`
        );
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        return;
      }

      // Check wallet balance
      if (upiAmountNum > userWallet) {
        setIsPopupVisible(true);
        setPopupMessage("Insufficient wallet balance for UPI withdrawal.");
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        return;
      }

      if (betAmount && betAmount.amount !== "0") {
        setIsPopupVisible(true);
        setPopupMessage("Please use all your deposit money first!");
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        return;
      }

      if (!canWithdraw) {
        setIsPopupVisible(true);
        setPopupMessage("Please contact to your Admin !");
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        return;
      }

      // Proceed with UPI withdrawal request
      try {
        const response = await axiosInstance.post(
          `${domain}/api/wallet/withdraw`,
          {
            amount: upiAmountNum,
            withdrawalMethod: "UPI",
            upiId: upiDetails.primaryUPI.id,
          },
          {
            withCredentials: true,
          }
        );

        // Check if the response indicates success or failure
        if (
          response.data &&
          response.data.data &&
          !response.data.data.success
        ) {
          // Handle service-level error
          setIsPopupVisible(true);
          setPopupMessage(
            response.data.data.error || "Withdrawal request failed"
          );
          setTimeout(() => {
            setIsPopupVisible(false);
          }, 2000);
          return;
        }

        // Success case
        fetchWithdrawals();
        setIsPopupVisible(true);
        setPopupMessage("UPI withdrawal request was successful.");
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);

        // Reset UPI form fields
        setUpiAmount("");
        setWithdrawalAmount("");
      } catch (error) {
        setIsPopupVisible(true);
        setPopupMessage(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "UPI withdrawal request failed."
        );
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
      }
    }
  };

  // const [user, setUser] = useState(null)
  // const [plainPassword, setPlainPassword] = useState("")

  // const fetchUserData = async () => {
  //   try {
  //     const response = await axios.get(`${domain}/user`, {
  //       withCredentials: true,
  //     })
  //     //console.log("User Data -->", response.data)
  //     setUser(response.data.user)
  //     setPlainPassword(response.data.user.plainPassword)
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }

  // useEffect(() => {
  //   fetchUserData()
  // }, [])

  // const handleRefresh = () => {
  //   // Handle refresh logic
  //   fetchUserData()
  // }

  // Updated handlePasswordSubmit function for your frontend

  const handlePasswordSubmit = async () => {
    try {
      setIsLoading(true);

      // Using axiosInstance which already handles auth tokens and refresh
      const response = await axiosInstance.post("/api/user/verify-password", {
        uid: userData.uid, // Assuming userData has the user's ID
        password: password,
      });

      // axiosInstance already handles error responses and token refreshing
      if (response.data.success) {
        // Password verified successfully
        handleWithdraw();
        setOpenPasswordDialog(false);
        setPassword("");
        setPasswordError("");
      } else {
        // Password verification failed
        setPasswordError("Incorrect password");
      }
    } catch (error) {
      // Handle specific error codes if available
      if (error.response?.data?.errorCode) {
        switch (error.response.data.errorCode) {
          case "ACCOUNT_LOCKED":
            setPasswordError(
              "Your account has been locked. Please contact support."
            );
            break;
          case "INVALID_PASSWORD":
            setPasswordError("Incorrect password. Please try again.");
            break;
          default:
            setPasswordError(
              error.response?.data?.message || "Failed to verify password"
            );
        }
      } else {
        setPasswordError("Failed to verify password. Please try again.");
      }
      console.error("Password verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawClick = () => {
    //console.log("withdraw clicked");
    setPassword(""); // Reset password when opening modal
    setPasswordError(""); // Reset any previous errors
    setShowPassword(false); // Reset password visibility
    setOpenPasswordDialog(true);
  };

  const [betAmount, setBetamount] = useState(null);
  const [canWithdraw, setCanWithdraw] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get(
        `${domain}/api/admin/turn-over/my-turnover`,
        { withCredentials: true }
      );
      // //console.log("Turnover data:", response.data)
      setBetamount(response.data);
      setCanWithdraw(response.data.canWithdraw);
    } catch (err) {
      console.error("Error fetching turnover data:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const [withdrawData, setWithdrawData] = useState(null);
  // //console.log(withdrawData)

  const fetchWithdrawSettings = async () => {
    try {
      const response = await axiosInstance.get(
        `${domain}/api/wallet/withdraw/settings`,
        {
          withCredentials: true,
        }
      );
      // //console.log("withdraw/settings-->", response.data.data)
      setWithdrawData(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWithdrawSettings();
  }, []);

  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [usdtAmount, setUsdtAmount] = useState("");

  const handleWithdrawalAmountChange = (e) => {
    const value = e.target.value;

    // Allow only numeric values
    if (/^\d*\.?\d*$/.test(value)) {
      setWithdrawalAmount(value);

      // Calculate and update usdtAmount
      const withdrawalAmountNum = parseFloat(value);
      if (!isNaN(withdrawalAmountNum)) {
        setUsdtAmount((withdrawalAmountNum / 93).toFixed(2));
      } else {
        setUsdtAmount(""); // Reset if input is empty or invalid
      }
    }
  };

  const handleUsdtAmountChange = (e) => {
    const value = e.target.value;

    // Allow only numeric values
    if (/^\d*\.?\d*$/.test(value)) {
      setUsdtAmount(value);

      // Calculate and update withdrawalAmount
      const usdtAmountNum = parseFloat(value);
      if (!isNaN(usdtAmountNum)) {
        setWithdrawalAmount((usdtAmountNum * 93).toFixed(2));
      } else {
        setWithdrawalAmount(""); // Reset if input is empty or invalid
      }
    }
  };

  useEffect(() => {
    setWithdrawalAmount("");
    setUsdtAmount("");
  }, [withdrawalMethod]);

  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
        >
          <Box flexGrow={1} sx={{ backgroundColor: "#232626 " }}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#232626",
                padding: "7px 4px",
                color: "white",
                mb: 2,
              }}
            >
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                sx={{ px: 2 }} // Adds horizontal padding to both sides
              >
                <Grid item xs={3} display="flex" justifyContent="flex-start">
                  <IconButton
                    sx={{ color: "#FDE4BC", ml: -1.5 }}
                    onClick={handleWithdrawback}
                  >
                    <ArrowBackIosNewIcon sx={{ fontSize: "20px" }} />
                  </IconButton>
                </Grid>
                <Grid item xs={6} display="flex" justifyContent="center">
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#FDE4BC",
                      fontSize: "19px",
                      whiteSpace: "nowrap", // Prevent wrapping
                      textAlign: "center",
                    }}
                  >
                    Withdraw
                  </Typography>
                </Grid>
                <Grid item xs={3} display="flex" justifyContent="flex-end">
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#FDE4BC",
                      fontSize: "12px",
                      whiteSpace: "nowrap", // Prevent wrapping
                      cursor: "pointer", // Indicate it's clickable
                    }}
                    onClick={handlePage}
                  >
                    Withdrawal history
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <WalletCard name={"Available Balance"} />

            <Grid
              container
              spacing={1}
              mt={0}
              style={{
                width: "96%",
                marginLeft: "auto",
                marginRight: "10px",
                alignItems: "center",
              }}
            >
              <Grid item xs={4}>
                <div
                  onClick={() => setWithdrawalMethod("Bank Card")}
                  style={{
                    background:
                      withdrawalMethod === "Bank Card"
                        ? "linear-gradient(90deg,#24ee89,#9fe871)"
                        : "#323738",
                    color:
                      withdrawalMethod === "Bank Card" ? "black" : "#B79C8B",
                    borderRadius: 8,
                    padding: 16,
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <img
                    src="/assets/icons/bankicon2.webp"
                    alt="Image 1"
                    style={{
                      display: "block",
                      margin: "0 auto",
                      maxWidth: "50%",
                      borderRadius: "50%",
                    }}
                  />
                  <Typography
                    variant="caption"
                    align="center"
                    style={{ marginTop: 8 }}
                  >
                    Bank Card
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={4}>
                <div
                  onClick={() => setWithdrawalMethod("USDT")}
                  style={{
                    background:
                      withdrawalMethod === "USDT"
                        ? "linear-gradient(90deg,#24ee89,#9fe871)"
                        : "#323738",
                    color: withdrawalMethod === "USDT" ? "black" : "#B79C8B",
                    borderRadius: 8,
                    padding: 16,
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer", // To show the clickable cursor
                  }}
                >
                  <img
                    src="/assets/icons/usdt2.webp"
                    alt="USDT"
                    style={{
                      display: "block",
                      margin: "0 auto",
                      maxWidth: "50%",
                      borderRadius: "50%",
                    }}
                  />
                  <Typography
                    variant="caption"
                    align="center"
                    style={{ marginTop: 8 }}
                  >
                    USDT
                  </Typography>
                </div>
              </Grid>

              {/* <Grid item xs={4}>
                <div
                  onClick={() => setWithdrawalMethod("UPI")}
                  style={{
                    background:
                      withdrawalMethod === "UPI"
                        ? "linear-gradient(90deg, #6a1b17 0%, #f70208 100%)"
                        : "#ffffff",
                    color: withdrawalMethod === "UPI" ? "#ffffff" : "#768096",
                    borderRadius: 8,
                    padding: 16,
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      margin: "0 auto",
                      marginBottom: "8px",
                      borderRadius: "50%",
                      background:
                        withdrawalMethod === "UPI"
                          ? "#ffffff"
                          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color:
                          withdrawalMethod === "UPI" ? "#6a1b17" : "#ffffff",
                        fontWeight: "bold",
                        fontSize: "18px",
                        fontFamily:
                          "'Times New Roman', Times, serif !important",
                      }}
                    >
                      UPI
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    align="center"
                    style={{ marginTop: 8 }}
                    sx={{
                      fontFamily: "'Times New Roman', Times, serif !important",
                    }}
                  >
                    UPI
                  </Typography>
                </div>
              </Grid> */}
            </Grid>

            {withdrawalMethod === "USDT" && (
              <Grid
                container
                spacing={1}
                mt={2}
                xs={12}
                style={{
                  width: "92%",
                  margin: "1rem auto",
                  background: "#323738",
                  borderRadius: "10px",
                  // padding: "10px", // Add padding for visual consistency
                }}
              >
                {usdtDetails.address.length > 0 ? (
                  <Card
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                      background: "#323738",
                      width: "100%",
                      height: "100%", // Ensure Card takes full height of the parent
                      margin: "0 auto",
                      flexGrow: 1, // Allow Card to grow and fill the height
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        component="img"
                        src="../../assets/3-6bb1e3bd.webp"
                        alt="TRC Logo"
                        sx={{
                          width: "24px",
                          height: "24px",
                          marginRight: "8px",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", color: "#B79C8B" }}
                      >
                        TRC
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        marginLeft: "2.5rem",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "#B79C8B", fontSize: "13px" }}
                      >
                        {usdtDetails?.address
                          ? usdtDetails.address.slice(0, 10) + "..."
                          : "No Address"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#FFA500", fontSize: "13px" }}
                      >
                        {usdtDetails?.alias || "No Alias"}
                      </Typography>
                    </Box>

                    {/* <ArrowForwardIosIcon
                      sx={{ fontSize: "16px", color: "#757575" }}
                    /> */}
                  </Card>
                ) : (
                  <Link
                    to="/wallet/withdraw/usdtaddress"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      width: "100%",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      style={{ textAlign: "center", padding: 16 }}
                    >
                      <img
                        src="/assets/wallet/addBank.webp"
                        alt="Add Bank Details"
                        style={{
                          display: "block",
                          margin: "0 auto",
                          maxWidth: "20%",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography
                        variant="caption"
                        align="center"
                        style={{ marginTop: 8, color: "#837064" }}
                      >
                        Add address
                      </Typography>
                    </Grid>
                  </Link>
                )}
              </Grid>
            )}

            {withdrawalMethod === "Bank Card" && bankDetails ? (
              <Grid
                container
                alignItems="center"
                style={{
                  width: "92%",
                  margin: "20px auto",
                  // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#323738",
                  borderRadius: "10px",
                  padding: "10px",
                  height: "80px",
                  cursor: "pointer",
                }}
              >
                <Grid item xs={4} style={{ textAlign: "center" }}>
                  <AccountBalanceIcon
                    style={{ color: "#f2c200", fontSize: "30px" }}
                  />
                  <Typography
                    variant="body2"
                    style={{ color: "#B79C8B", marginTop: "4px" }}
                  >
                    {truncatedBankName}
                  </Typography>
                </Grid>
                <Grid item style={{ margin: "0 10px" }}>
                  <div
                    style={{
                      borderLeft: "1px solid #B79C8B",
                      height: "30px",
                    }}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="body2" style={{ color: "#B79C8B" }}>
                    {bankDetails.accountNumber}
                  </Typography>
                </Grid>
                <Grid item style={{ marginLeft: "auto" }}>
                  {/* <ChevronRightIcon style={{ color: "#666462" }} /> */}
                </Grid>
              </Grid>
            ) : (
              withdrawalMethod === "Bank Card" && (
                <Grid
                  onClick={() => {
                    if (!bankDetails) {
                      navigate("/wallet/withdraw/add-bank");
                    }
                  }}
                  container
                  spacing={1}
                  mt={2}
                  xs={12}
                  style={{
                    width: "92%",
                    // marginLeft: "20px",
                    margin: "1rem auto",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#323738",
                    borderRadius: "8px",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <img
                      src="/assets/wallet/addBank.webp"
                      alt="Add Bank Details"
                      style={{
                        display: "block",
                        margin: "0 auto",
                        maxWidth: "15%",
                        borderRadius: "50%",
                      }}
                    />
                    <Typography
                      variant="caption"
                      align="center"
                      style={{
                        marginTop: 2,
                        color: "#837064",
                        fontSize: "15px",
                      }}
                    >
                      Add Bank Details
                    </Typography>
                    <Button sx={{ textTransform: "none", color: "#837064" }}>
                      Go Here
                    </Button>
                  </Grid>
                </Grid>
              )
            )}

            {withdrawalMethod === "Bank Card" && !bankDetails ? (
              <Typography
                sx={{
                  color: "#d23838",
                  fontSize: "12px",
                  textAlign: "center", // Center aligns the text
                  mb: 1,
                }}
              >
                Need to add beneficiary information to be able to withdraw money
              </Typography>
            ) : (
              ""
            )}
            {withdrawalMethod === "USDT" && usdtDetails.address.length === 0 ? (
              <Typography
                sx={{
                  color: "#d23838",
                  fontSize: "12px",
                  textAlign: "center", // Center aligns the text
                  mb: 1,
                }}
              >
                Need to add beneficiary information to be able to withdraw money
              </Typography>
            ) : (
              ""
            )}

            {/* UPI Display Section */}
            {/* {withdrawalMethod === "UPI" && upiDetails.primaryUPI ? (
              <Grid
                container
                alignItems="center"
                style={{
                  width: "92%",
                  margin: "20px auto",
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  padding: "15px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Grid item xs={2}>
                  <AccountBalanceWalletIcon
                    style={{
                      fontSize: 40,
                      color: "#6a1b17",
                    }}
                  />
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {upiDetails.primaryUPI.upiAddress}
                    <StarIcon
                      style={{ color: "gold", marginLeft: 8, fontSize: 20 }}
                    />
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ color: "#666", marginTop: "2px" }}
                  >
                    {upiDetails.primaryUPI.upiName}
                  </Typography>
                  {upiDetails.primaryUPI.upiProvider && (
                    <Typography
                      variant="body2"
                      style={{ color: "#666", marginTop: "2px" }}
                    >
                      Provider: {upiDetails.primaryUPI.upiProvider}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate("/upi-management")}
                    sx={{
                      borderColor: "#6a1b17",
                      color: "#6a1b17",
                      fontSize: "10px",
                      "&:hover": {
                        borderColor: "#f70208",
                        backgroundColor: "rgba(247, 2, 8, 0.04)",
                      },
                    }}
                  >
                    Manage
                  </Button>
                </Grid>
              </Grid>
            ) : (
              withdrawalMethod === "UPI" && (
                <Grid
                  onClick={() => navigate("/upi-management")}
                  container
                  spacing={1}
                  mt={2}
                  xs={12}
                  style={{
                    width: "92%",
                    margin: "1rem auto",
                    backgroundColor: "#fff3cd",
                    borderRadius: "8px",
                    border: "1px solid #ffeaa7",
                    cursor: "pointer",
                    padding: "20px",
                  }}
                >
                  <Grid item xs={12} style={{ textAlign: "center" }}>
                    <AccountBalanceWalletIcon
                      style={{
                        fontSize: 40,
                        color: "#856404",
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                    <Typography
                      variant="body1"
                      style={{
                        fontWeight: "bold",
                        color: "#856404",
                        marginTop: "10px",
                      }}
                    >
                      No Primary UPI Set
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ color: "#856404", marginTop: "5px" }}
                    >
                      Click here to add and manage your UPI addresses
                    </Typography>
                  </Grid>
                </Grid>
              )
            )}

            {withdrawalMethod === "UPI" && !upiDetails.canWithdraw ? (
              <Typography
                sx={{
                  color: "#d23838",
                  fontSize: "12px",
                  textAlign: "center",
                  mb: 1,
                }}
              >
                Need to set up a primary UPI address to be able to withdraw
                money
              </Typography>
            ) : (
              ""
            )} */}
            <Grid
              container
              spacing={1}
              mt={2}
              xs={12}
              sx={{
                width: "92%",
                margin: "0 auto",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#323738",
                borderRadius: "10px",
                padding: "5px 12px",
              }}
            >
              {/* Conditional Rendering for Bank Card */}

              {withdrawalMethod === "Bank Card" && (
                <>
                  {bankDetails?.bankName.length > 0 && (
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      fullWidth
                      placeholder="Please enter the amount"
                      value={withdrawalAmount}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                          setWithdrawalAmount(value);
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <span
                              style={{
                                color: "#FED358",
                                fontSize: "20px",
                                fontWeight: "bold",
                                marginLeft: "0.5rem",
                                marginRight: "28px",
                              }}
                            >
                              ₹
                            </span>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        // marginTop: "1rem",
                        bgcolor: "#232626",
                        borderRadius: "50px",
                        height: "47.5px",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          color: "#FED358", // Set text color for input
                          "& fieldset": { border: "none" },
                          "&:hover fieldset": { border: "none" },
                          "&.Mui-focused fieldset": { border: "none" },
                          "& input": {
                            fontSize: "13px",
                            color: "#FED358", // Ensure input text color is white
                          },
                          "& input::placeholder": {
                            fontSize: "13px",
                            color: "#837064", // Ensure placeholder color is white
                            opacity: 1, // Ensure opacity doesn't dim the color
                          },
                        },
                      }}
                    />
                  )}
                  {/* Balance Information */}
                  <Grid item container xs={11.8} spacing={3}>
                    <Grid item xs={7}>
                      <Typography
                        variant="body2"
                        align="left"
                        mt={1}
                        sx={{
                          color: "#B79C8B",
                          fontSize: "12px",
                          mb: 1.1,
                        }}
                      >
                        Minimum Amount:{" "}
                        <span style={{ color: "#f58530" }}>
                          ₹{" "}
                          {withdrawData
                            ? withdrawData.minWithdrawAmount
                            : "0.00"}
                        </span>
                      </Typography>
                      <Typography
                        variant="body2"
                        align="left"
                        sx={{ color: "#B79C8B", fontSize: "12px" }}
                      >
                        Maximum Amount
                        <span style={{ color: "#f58530" }}>
                          ₹{" "}
                          {withdrawData
                            ? withdrawData.maxWithdrawAmount
                            : "0.00"}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={5}
                      mt={1}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "end",
                        flexDirection: "column",
                      }}
                    >
                      <Button
                        // mt={0.8}
                        variant="outlined"
                        size="small"
                        sx={{
                          mb: 0.5,
                          height: "20px",
                          minWidth: "67px", // Ensures the button has a minimum width
                          borderColor: "#FED358", // Orange border
                          color: "#FED358", // Orange text
                          textTransform: "none", // Prevent capitalization
                          borderRadius: "5px",
                          padding: "0px 16px", // Adjust padding for button size
                          fontSize: "12px", // Match `body2` font size
                          // "&:hover": {
                          //   borderColor: "#FED358", // Keep border color on hover
                          //   backgroundColor: "rgba(221,145,56,0.1)", // Add light background on hover
                          // },
                        }}
                        onClick={() => {
                          setWithdrawalAmount(userWallet);
                          // setUsdtAmount((userWallet / 93).toFixed(2))
                          // setShowWarning(true) // Show warning message
                        }}
                      >
                        All
                      </Button>

                      <Typography variant="body2" align="right">
                        <span
                          style={{ color: "rgb(221,145,56)", fontSize: "16px" }}
                        >
                          ₹{withdrawalAmount || 0.0}
                        </span>
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Withdraw Button */}
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        mt: 1.4,
                        ml: "-8px",
                        background:
                          "linear-gradient(90deg,#24ee89,#9fe871)",
                        borderRadius: "20px",
                        height: "42px",
                        textTransform: "none",
                        fontSize: "15px",
                        color: "#221f2e", // Explicitly set text color
                        "&:hover": {
                          bgcolor: "#FED358",
                        },
                        "&.Mui-disabled": {
                          background: "rgb(144, 144, 144)", // Retain gradient for disabled state
                          color: "#221f2e", // Set text color for disabled state
                        },
                      }}
                      onClick={handleWithdrawClick}
                      disabled={!withdrawalAmount || !withdrawalMethod}
                    >
                      Withdraw
                    </Button>
                  </Grid>
                </>
              )}

              {withdrawalMethod === "USDT" && (
                <>
                  {usdtDetails?.address.length > 0 && (
                    <>
                      <Grid item xs={12}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <img
                            src="/assets/3-6bb1e3bd.webp"
                            alt="Tether Icon"
                            style={{
                              color: "#26A17B",
                              marginRight: "8px",
                              height: "24px",
                              width: "24px",
                            }}
                          />
                          <Typography
                            variant="subtitle1"
                            sx={{ color: "#FDE4BC" }}
                          >
                            Select amount of USDT
                          </Typography>
                        </Box>

                        <TextField
                          fullWidth
                          value={usdtAmount}
                          onChange={handleUsdtAmountChange}
                          placeholder="Please enter USDT amount"
                          variant="outlined"
                          sx={{
                            mb: 1.5,
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#232626",
                              borderRadius: "10px",
                              height: "45px",
                              fontSize: "13px",
                              color: "#FED358",
                              "& fieldset": {
                                border: "none",
                              },
                            },
                            "& .MuiInputBase-input::placeholder": {
                              color: "#837064",
                              fontSize: "13px",
                              opacity: 1,
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <img
                                  src="/assets/3-6bb1e3bd.webp"
                                  alt="Tether Icon"
                                  style={{ height: "24px", width: "24px" }}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />

                        {parseFloat(usdtAmount) < 10 && usdtAmount && (
                          <Typography
                            variant="body1"
                            color="error"
                            sx={{
                              mt: 0.5,
                              mb: 1,
                              textAlign: "left",
                              fontSize: "0.8rem",
                            }}
                          >
                            Minimum USDT withdrawal amount is $10.
                          </Typography>
                        )}

                        {parseFloat(usdtAmount) > 100 && usdtAmount && (
                          <Typography
                            variant="body1"
                            color="error"
                            sx={{
                              mt: 0.5,
                              mb: 1,
                              textAlign: "left",
                              fontSize: "0.8rem",
                            }}
                          >
                            Maximum USDT withdrawal amount is $100.
                          </Typography>
                        )}

                        <TextField
                          fullWidth
                          value={withdrawalAmount}
                          onChange={handleWithdrawalAmountChange}
                          placeholder="Please enter withdrawal amount"
                          variant="outlined"
                          sx={{
                            mb: 1.5,
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#232626",
                              borderRadius: "10px",
                              height: "45px",
                              fontSize: "13px",
                              color: "#FED358",
                              "& fieldset": {
                                border: "none",
                              },
                            },
                            "& .MuiInputBase-input::placeholder": {
                              color: "#837064",
                              fontSize: "13px",
                              fontWeight: "normal",
                              opacity: 1,
                            },
                            color: "#FED358",
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Typography sx={{ color: "#FED358" }}>
                                  ₹
                                </Typography>
                              </InputAdornment>
                            ),
                          }}
                        />

                        {showWarning && (
                          <Typography
                            variant="body1"
                            color="error"
                            sx={{
                              mt: 0.5,
                              mb: 1,
                              textAlign: "left",
                              fontSize: "0.8rem",
                            }}
                          >
                            Single withdrawal amount range from
                            ₹1,000~₹1,000,000
                          </Typography>
                        )}
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="#FED358"
                          fontSize="13px"
                        >
                          Withdrawable balance{" "}
                          <span style={{ color: "#DD9138" }}>
                            ₹{userWallet}
                          </span>
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: "#FED358",
                            color: "#FED358",
                            // minWidth: "60px",
                            fontSize: "13px",
                            padding: "0px 16px",
                            height: "20px",
                          }}
                          onClick={() => {
                            setWithdrawalAmount(userWallet);
                            setUsdtAmount((userWallet / 93).toFixed(2));
                            setShowWarning(true); // Show warning message
                          }}
                        >
                          All
                        </Button>
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        background:
                          "linear-gradient(90deg,#24ee89,#9fe871)",
                        borderRadius: "20px",
                        height: "42px",
                        textTransform: "none",
                        fontSize: "15px",
                        color: "#221f2e", // Explicitly set text color
                        "&:hover": {
                          bgcolor: "#FED358",
                        },
                        "&.Mui-disabled": {
                          background: "rgb(144, 144, 144)", // Retain gradient for disabled state
                          color: "#221f2e", // Set text color for disabled state
                        },
                      }}
                      onClick={handleWithdrawClick}
                      disabled={!withdrawalAmount || !withdrawalMethod}
                    >
                      Withdraw
                    </Button>
                  </Grid>
                </>
              )}

              {/* UPI Form Section */}
              {withdrawalMethod === "UPI" && (
                <>
                  {upiDetails?.primaryUPI && (
                    <>
                      <TextField
                        fullWidth
                        label="UPI Address"
                        value={upiDetails.primaryUPI.upiAddress}
                        disabled
                        variant="outlined"
                        margin="normal"
                        InputProps={{
                          startAdornment: (
                            <AccountBalanceWalletIcon
                              sx={{ mr: 1, color: "grey.500" }}
                            />
                          ),
                          endAdornment: <StarIcon sx={{ color: "gold" }} />,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "#f8f9fa",
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Account Holder Name"
                        value={upiDetails.primaryUPI.upiName}
                        disabled
                        variant="outlined"
                        margin="normal"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "#f8f9fa",
                          },
                        }}
                      />
                      {upiDetails.primaryUPI.upiProvider && (
                        <TextField
                          fullWidth
                          label="UPI Provider"
                          value={upiDetails.primaryUPI.upiProvider}
                          disabled
                          variant="outlined"
                          margin="normal"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                              backgroundColor: "#f8f9fa",
                            },
                          }}
                        />
                      )}

                      <TextField
                        fullWidth
                        label="Enter UPI Amount"
                        type="number"
                        value={upiAmount}
                        onChange={(e) => {
                          setUpiAmount(e.target.value);
                          setWithdrawalAmount(e.target.value);
                        }}
                        variant="outlined"
                        margin="normal"
                        InputProps={{
                          startAdornment: (
                            <Typography
                              style={{ marginRight: "8px", color: "#dd0000" }}
                            >
                              ₹
                            </Typography>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />

                      {/* Balance Information */}
                      <Grid item container xs={11.8} spacing={3}>
                        <Grid item xs={7}>
                          <Typography
                            variant="body2"
                            align="left"
                            mt={1}
                            sx={{
                              color: "#80849C",
                              fontSize: "12px",
                              mb: 1.1,
                              fontFamily:
                                "'Times New Roman', Times, serif !important",
                            }}
                          >
                            Minimum Amount:{" "}
                            <span style={{ color: "#dd0000" }}>
                              ₹{" "}
                              {withdrawData
                                ? withdrawData.minWithdrawAmount
                                : "0.00"}
                            </span>
                          </Typography>
                          <Typography
                            variant="body2"
                            align="left"
                            sx={{
                              color: "#80849C",
                              fontSize: "12px",
                              fontFamily:
                                "'Times New Roman', Times, serif !important",
                            }}
                          >
                            Maximum Amount:{" "}
                            <span style={{ color: "#dd0000" }}>
                              ₹{" "}
                              {withdrawData
                                ? withdrawData.maxWithdrawAmount
                                : "0.00"}
                            </span>
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={5}
                          mt={1}
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "end",
                            flexDirection: "column",
                          }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              mb: 0.5,
                              height: "20px",
                              minWidth: "67px",
                              borderColor: "#dd0000",
                              color: "#dd0000",
                              textTransform: "none",
                              borderRadius: "5px",
                              padding: "0px 16px",
                              fontSize: "12px",
                            }}
                            onClick={() => {
                              setUpiAmount(userWallet);
                              setWithdrawalAmount(userWallet);
                            }}
                          >
                            All
                          </Button>

                          <Typography variant="body2" align="right">
                            <span
                              style={{ color: "#dd0000", fontSize: "16px" }}
                            >
                              ₹{upiAmount || 0.0}
                            </span>
                          </Typography>
                        </Grid>
                      </Grid>

                      {/* Withdraw Button */}
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          variant="contained"
                          sx={{
                            mt: 1.4,
                            ml: "-8px",
                            background:
                              "linear-gradient(90deg, #6a1b17 0%, #f70208 100%)",
                            borderRadius: "20px",
                            height: "42px",
                            textTransform: "none",
                            fontSize: "15px",
                            color: "#ffffff",
                            "&:hover": {
                              background:
                                "linear-gradient(90deg, #6a1b17 0%, #f70208 100%)",
                            },
                            "&.Mui-disabled": {
                              background: "rgb(144, 144, 144)",
                              color: "#ffffff",
                            },
                          }}
                          onClick={handleWithdrawClick}
                          disabled={!upiAmount || !upiDetails.canWithdraw}
                        >
                          Withdraw
                        </Button>
                      </Grid>
                    </>
                  )}
                </>
              )}

              {openPasswordDialog && (
                <Dialog
                  open={openPasswordDialog}
                  onClose={() => setOpenPasswordDialog(false)}
                  PaperProps={{
                    sx: {
                      borderRadius: "16px",
                      width: "calc(100% - 64px)",
                      // maxWidth: "400px",
                      p: 2,
                      m: 0,
                      bgcolor: "#323738",
                      maxWidth: "330px",
                    },
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <IconButton
                      onClick={() => setOpenPasswordDialog(false)}
                      sx={{
                        position: "absolute",
                        right: -8,
                        top: -8,
                        color: "grey.500",
                      }}
                    >
                      {/* <X size={20} /> */}
                    </IconButton>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mb: 3,
                        mt: 2,
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: "#f0970f",
                          borderRadius: "50%",
                          p: "16px 18px",
                          mb: 2,
                        }}
                      >
                        <LockIcon sx={{ color: "white" }} />
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: "#f0970f",
                        }}
                      >
                        Confirm Withdrawal
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#B79C8B",
                          textAlign: "center",
                          mt: 1,
                        }}
                      >
                        Please enter your password to complete the withdrawal
                      </Typography>
                    </Box>

                    <DialogContent sx={{ px: 0, pb: 0 }}>
                      <TextField
                        autoFocus
                        fullWidth
                        variant="outlined"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!passwordError}
                        helperText={passwordError}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handlePasswordSubmit();
                          }
                        }}
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              onClick={() => setShowPassword((prev) => !prev)}
                              edge="end"
                            >
                              {showPassword ? (
                                <Visibility sx={{ color: "#f0970f" }} />
                              ) : (
                                <VisibilityOff sx={{ color: "#f0970f" }} />
                              )}
                            </IconButton>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            // color: "#000", // Input text color
                            "& fieldset": {
                              borderColor: "#ccc", // Default border color
                            },
                            "&:hover fieldset": {
                              borderColor: "#ccc", // Border color on hover
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#f0970f", // Border color when focused
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#999", // Default placeholder color
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#f0970f", // Placeholder color when focused
                          },
                          "& .MuiOutlinedInput-input": {
                            color: "#f0970f", // Input text color (grey)
                          },
                        }}
                      />
                    </DialogContent>

                    <DialogActions
                      sx={{
                        px: 0,
                        pb: 0,
                        mt: 3,
                        gap: 2,
                      }}
                    >
                      <Button
                        fullWidth
                        onClick={() => setOpenPasswordDialog(false)}
                        sx={{
                          borderRadius: "10px",
                          color: "#f0970f",
                          border: "1px solid #f0970f",
                          textTransform: "none",
                          "&:hover": {
                            border: "1px solid #f0970f",
                            bgcolor: "rgba(15, 101, 24, 0.04)",
                          },
                        }}
                        variant="outlined"
                      >
                        Cancel
                      </Button>
                      <Button
                        fullWidth
                        onClick={() => handlePasswordSubmit()}
                        sx={{
                          borderRadius: "10px",
                          bgcolor: "#f0970f",
                          color: "white",
                          textTransform: "none",
                          "&:hover": {
                            bgcolor: "#f0970f",
                            opacity: 0.9,
                          },
                        }}
                        variant="contained"
                      >
                        Confirm
                      </Button>
                    </DialogActions>
                  </Box>
                </Dialog>
              )}
              {/* Fourth row */}
              <Grid item sx={{ ml: "-15px" }}>
                <Box
                  sx={{
                    width: "100%",
                    // paddingLeft:"-8px",
                    margin: "22px 5px 10px 5px",
                    borderRadius: 5,
                    // padding: 1,
                    alignItems: "center",
                  }}
                >
                  <List
                    sx={{
                      backgroundColor: "#323738",
                      py: 1.5,
                      px: 2,
                      border: "1px solid #363636",
                      borderRadius: "8px",
                      lineHeight: "1.5",
                    }}
                  >
                    <ListItem sx={{ padding: "5px 0" }}>
                      <ListItemIcon
                        sx={{ minWidth: "unset", marginRight: "8px" }}
                      >
                        <RhombusIcon sx={{ fontSize: 10, color: "#FED358" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#B79C8B",
                              display: "flex",
                              alignItems: "center",
                              fontSize: "0.8rem", // Set font size to 0.8rem
                            }}
                          >
                            Need to bet
                            <span
                              style={{
                                color: "rgb(210,56,56)",
                                marginLeft: "4px",
                                marginRight: "4px",
                              }}
                            >
                              ₹
                              {betAmount && !isNaN(Number(betAmount.amount))
                                ? Number(betAmount.amount).toFixed(2)
                                : "0.00"}
                            </span>
                            to be able to withdraw
                          </Typography>
                        }
                      />
                    </ListItem>

                    <ListItem sx={{ padding: "8px 0", mt: -1.5 }}>
                      <ListItemIcon
                        sx={{ minWidth: "unset", marginRight: "8px" }}
                      >
                        <RhombusIcon sx={{ fontSize: 10, color: "#FED358" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{
                              color: "#B79C8B",
                              display: "flex",
                              alignItems: "center",
                              fontSize: "0.8rem", // Set font size to 0.8rem
                            }}
                          >
                            Withdraw Hour{" "}
                            <span
                              style={{
                                color: "rgb(210,56,56)",
                                marginLeft: "4px",
                              }}
                            >
                              {withdrawData
                                ? `${withdrawData.withdrawalStartHour}:00 ${withdrawData.withdrawalStartPeriod}`
                                : "00:00"}
                              -
                              {withdrawData
                                ? `${withdrawData.withdrawalEndHour}:00 ${withdrawData.withdrawalEndPeriod}`
                                : "23:59"}
                            </span>
                          </Typography>
                        }
                      />
                    </ListItem>

                    <ListItem sx={{ padding: "8px 0", mt: -1.5 }}>
                      <ListItemIcon
                        sx={{ minWidth: "unset", marginRight: "8px" }}
                      >
                        <RhombusIcon sx={{ fontSize: 10, color: "#FED358" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{
                              color: "#B79C8B",
                              display: "flex",
                              alignItems: "center",
                              fontSize: "0.8rem", // Set font size to 0.8rem
                            }}
                          >
                            Daily Withdrawal Times Limits{" "}
                            <span
                              style={{
                                color: "rgb(210,56,56)",
                                marginLeft: "4px",
                              }}
                            >
                              {withdrawData
                                ? withdrawData.maxWithdrawRequestsPerDay
                                : "3"}
                            </span>
                          </Typography>
                        }
                      />
                    </ListItem>

                    <ListItem sx={{ padding: "8px 0", mt: -1.5 }}>
                      <ListItemIcon
                        sx={{ minWidth: "unset", marginRight: "8px" }}
                      >
                        <RhombusIcon sx={{ fontSize: 10, color: "#FED358" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{
                              color: "#B79C8B",
                              fontSize: "0.8rem", // Set font size to 0.8rem
                            }}
                          >
                            Withdrawal amount range{" "}
                            <span
                              style={{
                                color: "rgb(210,56,56)",

                                marginLeft: "4px",
                              }}
                            >
                              ₹
                              {withdrawData
                                ? withdrawData.minWithdrawAmount
                                : "0.00"}
                              -₹
                              {withdrawData
                                ? withdrawData.maxWithdrawAmount
                                : "0.00"}
                            </span>
                          </Typography>
                        }
                      />
                    </ListItem>

                    <ListItem sx={{ padding: "8px 0", mt: -1.5 }}>
                      <ListItemIcon
                        sx={{ minWidth: "unset", marginRight: "8px" }}
                      >
                        <RhombusIcon
                          sx={{ fontSize: 10, color: "#FED358", mb: 7 }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{ color: "#B79C8B", fontSize: "0.8rem" }} // Set font size to 0.8rem
                          >
                            Please confirm your beneficial account information
                            before withdrawing. If your information is
                            incorrect, our company will not be liable for the
                            amount of loss.
                          </Typography>
                        }
                      />
                    </ListItem>

                    <ListItem sx={{ padding: "8px 0", mt: -1.5 }}>
                      <ListItemIcon
                        sx={{ minWidth: "unset", marginRight: "8px" }}
                      >
                        <RhombusIcon
                          sx={{ fontSize: 10, color: "#FED358", mb: 2.5 }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{ color: "#B79C8B", fontSize: "0.8rem" }} // Set font size to 0.8rem
                          >
                            If your beneficial information is incorrect, please
                            contact customer service.
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ paddingX: "1rem", marginBottom: "3rem" }}>
              <Typography
                variant="h7"
                sx={{
                  display: "flex", // Flexbox to align items
                  alignItems: "center", // Vertically align items
                  marginBottom: "0.5rem",
                  marginTop: "1.5rem",
                  color: "#B79C8B",
                  textAlign: "left",
                  fontSize: "17px",
                }}
              >
                <Box
                  component="img"
                  src="/assets/icons/deposithistories.svg"
                  alt="Invitation Reward Rules"
                  sx={{ width: "18px", height: "38px", marginRight: "12px" }}
                />
                Withdrawal history
              </Typography>

              {withdrawals.length > 0 ? (
                withdrawals.map((withdrawal) => (
                  <Card
                    key={withdrawal.id}
                    sx={{
                      marginBottom: 2,
                      borderRadius: 2,
                      overflow: "hidden",
                      background: "#323738",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <CardContent sx={{ padding: 0, mb: -2 }}>
                      <Box
                        sx={{ padding: 1, borderBottom: "1px solid #454037" }}
                      >
                        <Grid container alignItems="center">
                          <Grid item xs={6} sx={{ textAlign: "left" }}>
                            <Chip
                              label="Withdraw"
                              sx={{
                                backgroundColor:
                                  withdrawal.withdrawStatus === "COMPLETED"
                                    ? "#27ae60"
                                    : withdrawal.withdrawStatus === "PENDING"
                                    ? "#f39c12"
                                    : "#e74c3c",
                                color: "white",
                                // fontWeight: "bold",
                                height: "24px", // Adjusting height to match the image
                                fontSize: "14px",
                                borderRadius: "4px",
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sx={{ textAlign: "right" }}>
                            <Typography
                              sx={{
                                color:
                                  withdrawal.withdrawStatus === "COMPLETED"
                                    ? "#27ae60"
                                    : withdrawal.withdrawStatus === "PENDING"
                                    ? "#f39c12"
                                    : "#e74c3c",
                                // fontWeight: "bold",
                                fontSize: "14px",
                              }}
                            >
                              {withdrawal.withdrawStatus}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                      <Box sx={{ padding: 1.5 }}>
                        <Grid container spacing={1} sx={{ textAlign: "left" }}>
                          {[
                            {
                              label: "Balance",
                              value: `₹${withdrawal.withdrawAmount}`,
                              color:
                                withdrawal.withdrawStatus === "COMPLETED"
                                  ? "#27ae60"
                                  : withdrawal.withdrawStatus === "PENDING"
                                  ? "#f39c12"
                                  : "#e74c3c",
                              fontSize: "14px",
                              fontWeight: "bold",
                            },
                            {
                              label: "Type",
                              value: withdrawal.withdrawMethod,
                              fontSize: "12px",
                            },
                            {
                              label: "Time",
                              value: new Date(
                                withdrawal.withdrawDate
                              ).toLocaleString(),
                              fontSize: "12px",
                            },
                            {
                              label: "Order number",
                              value: withdrawal.id,
                              fontSize: "12px",
                            },
                          ].map(
                            ({ label, value, color, fontSize, fontWeight }) => (
                              <React.Fragment key={label}>
                                <Grid item xs={6}>
                                  <Typography
                                    sx={{
                                      color: "#B79C8B",
                                      fontSize: "13px",
                                      lineHeight: "20px",
                                    }}
                                  >
                                    {label}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sx={{ textAlign: "right" }}>
                                  <Typography
                                    sx={{
                                      fontSize,
                                      fontWeight: fontWeight || "medium",
                                      color: color || "#B79C8B",
                                      lineHeight: "20px",
                                    }}
                                  >
                                    {value}
                                  </Typography>
                                </Grid>
                              </React.Fragment>
                            )
                          )}
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                  <img
                    src="/assets/No data-1.webp" // Replace with the correct path to your image file
                    alt="No data available"
                    style={{ width: "150px", marginBottom: "10px" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "center",
                      color: "#757575",
                      marginBottom: "1rem",
                      fontSize: "14px",
                    }}
                  >
                    No Data.
                  </Typography>
                </Box>
              )}

              {/* Button to navigate to All Withdrawal Histories */}
              <Box
                sx={{
                  textAlign: "center",
                  marginTop: "10%",
                  marginBottom: "20%",
                }}
              >
                <Button
                  onClick={() => navigate("/withdraw-history")}
                  variant="contained"
                  // color="primary"
                  sx={{
                    width: "100%",
                    fontSize: "16px",
                    textTransform: "initial",
                    borderRadius: "20px",
                    color: "#FED358",
                    background: "transparent",
                    border: "1px solid #FED358",
                    // "&:hover": {
                    //   background:
                    //     "linear-gradient(90deg,#24ee89,#9fe871)",
                    // },
                  }}
                >
                  All history
                </Button>
              </Box>
            </Box>
          </Box>

          {children}
        </Box>

        {/* <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
            // width: "100%",
          }}
        >
          <Alert
            severity="success"
            onClose={() => setSnackbarOpen(false)}
            sx={{
              mx: 2,
              padding: "6px 8px",
              backgroundColor: "#ffd9ae", // Custom background color (Dark Gray)
              color: "#232626", // Custom text color
              "& .MuiSvgIcon-root": { color: "#FED358" }, // Changes the icon color to yellow
              "&.MuiAlert-action": { padding: "1px 0px 0px 0px" },
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar> */}
        <div>
          {/* Your existing component code */}

          {/* Popup Notification */}
          {isPopupVisible && (
            <Box
              sx={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "rgba(0, 0, 0, 0.9)",
                color: "white",
                padding: "20px 10px",
                borderRadius: "10px",
                // boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
                animation: "fadeIn 0.5s ease",
                textAlign: "center",
                ...(isSmallScreen && { width: "75%" }),
              }}
            >
              <Typography sx={{ marginTop: "10px", fontSize: "14px" }}>
                {popupMessage}
              </Typography>
            </Box>
          )}

          {/* Add keyframes for fade-in animation */}
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
      </Mobile>
    </div>
  );
};

export default WithDraw;
