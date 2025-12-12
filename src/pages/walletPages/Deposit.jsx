import React, { useEffect, useState, useRef, useContext, useMemo } from "react";
import Mobile from "../../components/layout/Mobile";
import IconButton from "@mui/material/IconButton";
import WalletCard from "../../components/wallet/WalletCard";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import SvgIcon from "@mui/material/SvgIcon";
import InputAdornment from "@mui/material/InputAdornment";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
// import Alert from "@mui/material/Alert";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import axios from "axios";
import { domain } from "../../utils/Secret";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CloseIcon from "@mui/icons-material/Close";
import { VerticalAlignCenter } from "@mui/icons-material";
import { UserContext } from "../../context/UserState";
import { useAuth } from "../../context/AuthContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const RhombusIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 2L22 12L12 22L2 12L12 2Z" />
  </SvgIcon>
);

const upiQrAmounts = [
  100, 500, 800, 1000, 2000, 3000, 5000, 10000, 20000, 30000, 40000, 50000,
];
const upiPaytmAmounts = [
  200, 500, 800, 1000, 2000, 3000, 5000, 10000, 20000, 30000, 40000, 50000,
];

const upiWatchPayAmounts = [
  200, 500, 800, 1000, 2000, 3000, 5000, 10000, 20000, 30000, 40000, 50000,
];
const upiLGPayAmounts = [
  200, 500, 800, 1000, 2000, 3000, 5000, 10000, 20000, 30000, 40000, 50000,
];

const upiIQPayAmounts = [
  100, 200, 500, 800, 1000, 2000, 3000, 5000, 10000, 20000, 40000, 50000,
];

const usdtAmounts = [10, 50, 100, 200, 500, 1000];

const Deposit = ({ children }) => {
  const { userWallet } = useContext(UserContext);
  const { axiosInstance } = useAuth();
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes in seconds
  const timerRef = useRef(null);
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI x QR");
  const [walletAmount, setWalletAmount] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const conversionRate = 93;
  const [depositHistories, setDepositHistories] = useState([]);
  const [walletData, setWalletData] = useState(0);
  const [openDepositDialog, setOpenDepositDialog] = useState(false);
  const [utr, setUtr] = useState("");
  const [utrAlert, setUtrAlert] = useState(false);
  const [duplicateUtrAlert, setDuplicateUtrAlert] = useState("");
  const [depositRequests, setDepositRequests] = useState([]);
  const [usdtAmount, setUsdtAmount] = useState("");
  // Add these state variables to your existing state declarations
  const [isPolling, setIsPolling] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [isRestricted, setIsRestricted] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState("");
  const [depositBonusPercentage, setDepositBonusPercentage] = useState(0);
  const [availableGateways, setAvailableGateways] = useState([]);
  const [paymentModes, setPaymentModes] = useState({});


  const gatewayToPaymentMode = {
    IQPAY: 'UPIxIQPay',
    WATCHPAY: 'UPIxWatchPay',
    LGPAY: 'UPIxLGPay',
    PAYTM: 'UPIxPAYTM',
  };

  const allPaymentModes = {
    "UPI x QR": {
      amounts: upiQrAmounts,
      channels: [
        { name: "Super-QR", balance: "100 - 50K", bonus: "3%" },
        { name: "ARpay-QR", balance: "100 - 50K", bonus: "3%" },
        { name: "OoPay-QR", balance: "100 - 50K", bonus: "3%" },
        { name: "Paile-QR", balance: "100 - 100K", bonus: "3%" },
        { name: "7Day-QR", balance: "100 - 50K", bonus: "3%" },
        { name: "FFPay-QR", balance: "100 - 50K", bonus: "3%" },
        { name: "WPay-QR", balance: "100 - 50K", bonus: "3%" },
        { name: "Happy-QR", balance: "100 - 50K", bonus: "3%" },
      ]
    },
    "UPIxPAYTM": {
      amounts: upiPaytmAmounts,
      channels: [
        { name: "QR-ARpay", balance: "200 - 50K", bonus: "3%" },
        { name: "QR-7Day", balance: "200 - 50K", bonus: "3%" },
        { name: "QR-Happy", balance: "200 - 50K", bonus: "3%" },
        { name: "QR-OoPay", balance: "200 - 50K", bonus: "3%" },
      ]
    },
    "UPIxWatchPay": {
      amounts: upiWatchPayAmounts,
      channels: [
        { name: "QR-ARpay", balance: "100 - 50K", bonus: "3%" },
        { name: "QR-7Day", balance: "100 - 50K", bonus: "3%" },
        { name: "QR-Happy", balance: "100 - 50K", bonus: "3%" },
        { name: "QR-OoPay", balance: "100 - 50K", bonus: "3%" },
      ]
    },
    "UPIxLGPay": {
      amounts: upiLGPayAmounts,
      channels: [
        { name: "QR-ARpay", balance: "100 - 50K", bonus: "3%" },
        { name: "QR-7Day", balance: "100 - 50K", bonus: "3%" },
        { name: "QR-Happy", balance: "100 - 50K", bonus: "3%" },
        { name: "QR-OoPay", balance: "100 - 50K", bonus: "3%" },
      ]
    },
    "UPIxIQPay": {
      amounts: upiIQPayAmounts,
      channels: [
        { name: "QR-ARpay", balance: "100 - 50K", bonus: "3%" },
        { name: "QR-7Day", balance: "100 - 50K", bonus: "3%" },
        { name: "QR-Happy", balance: "100 - 50K", bonus: "3%" },
        { name: "QR-OoPay", balance: "100 - 50K", bonus: "3%" },
      ]
    },
    "USDT": {
      amounts: usdtAmounts,
      channels: [
        {
          name: "UUPayUSDTCU",
          balance: "10-1M",
          bonus: "3%",
          image: "../../assets/3-6bb1e3bd.webp",
        }
      ]
    }
  };
  // const paymentModes = useMemo(() => {
  //   const dynamicModes = {};
  //   availablePaymentGateways.forEach(apiName => {
  //     const modeKey = gatewayToPaymentMode[apiName];
  //     if (modeKey && originalPaymentModes[modeKey]) {
  //       dynamicModes[modeKey] = originalPaymentModes[modeKey];
  //     }
  //   });
  //   return dynamicModes;
  // }, [availablePaymentGateways]);

  useEffect(() => {
    const fetchAvailableGateways = async () => {
      try {
        const response = await axiosInstance.get(
          `${domain}/api/wallet/paymentGateway/available`
        );
        //console.log("Available Gateways Response:", response.data.data);
  
        const sortedGateways = response.data.data
          .filter(gateway => gateway.available && gatewayToPaymentMode[gateway.name])
          .sort((a, b) => {
            // Prioritize IQPAY
            if (a.name === "IQPAY") return -1;
            if (b.name === "IQPAY") return 1;
            return 0;
          });
  
        const dynamicModes = sortedGateways.reduce((acc, gateway) => {
          const modeKey = gatewayToPaymentMode[gateway.name];
          return { ...acc, [modeKey]: allPaymentModes[modeKey] };
        }, {});
  
        // Append static fallback modes
        setPaymentModes({
          ...dynamicModes,
          "UPI x QR": allPaymentModes["UPI x QR"],
          "USDT": allPaymentModes["USDT"]
        });
  
      } catch (error) {
        console.error("Error fetching available gateways:", error);
  
        // Fallback to defaults if API fails
        setPaymentModes({
          "UPI x QR": allPaymentModes["UPI x QR"],
          "USDT": allPaymentModes["USDT"]
        });
      }
    };
  
    fetchAvailableGateways();
  }, []);


  // Function to determine the color based on deposit status
  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "#149922"; // Green for completed
      case "PENDING":
        return "#FFA500"; // Orange for pending
      case "FAILED":
        return "#FF0000"; // Red for failed
      default:
        return "#757575"; // Grey for unknown statuses
    }
  };

  const paymentAmounts = {
    "UPI x QR": upiQrAmounts,
    "UPIxPAYTM": upiPaytmAmounts,
    "UPIxWatchPay": upiWatchPayAmounts,
    "UPIxLGPay": upiLGPayAmounts,
    "UPIxIQPay": upiIQPayAmounts,
    "USDT": usdtAmounts
  };

  const getAmountArray = () => {
    return paymentModes[paymentMode]?.amounts || [];
  };


  // Fetching deposit history data from the API
  const fetchDepositHistory = async () => {
    try {
      const response = await axiosInstance.get(
        `${domain}/api/wallet/deposit/history`,
        {
          withCredentials: true,
        }
      );
      const latestFiveHistories = response.data.data.slice(0, 5);
      setDepositHistories(latestFiveHistories);
    } catch (error) {
      console.error("Error fetching deposit history:", error);
    }
  };

  useEffect(() => {
    fetchDepositHistory();
  }, []);

  useEffect(() => {
    const fetchDepositBonusPercentage = async () => {
      try {
        const response = await axiosInstance.get(
          `${domain}/api/additional/deposit-bonus/percentage`,
          { withCredentials: true }
        );
        if (response.data.success && response.data.data.depositBonusPercentage > 0) {
          setDepositBonusPercentage(response.data.data.depositBonusPercentage);
        }
      } catch (error) {
        console.error("Error fetching deposit bonus percentage:", error);
      }
    };

    fetchDepositBonusPercentage();
  }, []);

  const handleCopy = (depositId) => {
    navigator.clipboard.writeText(depositId);
  };

  const handleUtrChange = (event) => {
    setUtr(event.target.value);
  };

  const handleUsdtInputChange = (event) => {
    const value = event.target.value;

    // Allow only numeric values with an optional decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setUsdtAmount(value);

      if (value !== "") {
        setAmount((parseFloat(value) * conversionRate).toFixed(2));
      } else {
        setAmount("");
      }
    }
  };
  // Define the function to close the dialog
  const closeDepositDialog = () => {
    setOpenDepositDialog(false);
    setDuplicateUtrAlert("");
    setUtr("");
  };

  const handleButtonClick = (value) => {
    setSelectedValue(value);
    if (paymentMode === "USDT") {
      setUsdtAmount(value.toString());
      setAmount((value * 93).toString()); // Assuming 1 USDT = 93 INR
    } else {
      setAmount(value.toString());
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Allow only numeric values with an optional decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);

      if (paymentMode === "USDT" && value !== "") {
        setUsdtAmount((parseFloat(value) / 93).toFixed(2)); // Assuming 1 USDT = 93 INR
      } else {
        setUsdtAmount(""); // Reset if input is empty or invalid
      }
    }
  };

  // Add the createRestrictedDeposit function
  const createRestrictedDeposit = async (depositAmount) => {
    const generateDepositId = () => {
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 10000);
      return `DEP-${timestamp}-${randomNum}`;
    };

    const depositId = generateDepositId();
    try {
      const response = await axiosInstance.post(
        `${domain}/api/wallet/deposit`,
        {
          amount: depositAmount,
          // depositId: depositId,
          depositMethod: paymentMode === "UPI x QR" ? "UPI" : paymentMode,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setAmount("");
        setUsdtAmount("");
        // fetchUserData();

        // Show the popup notification
        setPopupMessage("Deposit Request successfull!");
        setIsPopupVisible(true);
        // Hide the popup after 2 seconds
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating deposit:", error);
      // Handle error notification here
    }
  };

  const sendDepositRequest = async () => {
    setUtrAlert(false) //(dont remove this code)
    setUtr("")
    setDuplicateUtrAlert("")
    fetchDepositHistory()
    if (!utr) {
      setUtrAlert(true)
      return
    }

    // Call your createDeposit endpoint
    try {
      const response = await axiosInstance.post(
        `${domain}/api/wallet/deposit`,
        {
          amount: parseInt(amount),
          // depositId: utr,
          depositMethod: paymentMode === "UPI x QR" ? "UPI" : paymentMode,
          utrNumber: utr,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // Ensures credentials are included
        }
      );


      if (response.data.success) {
        setOpenDepositDialog(false)
        setAmount("")
        setUsdtAmount("")
        setIsPopupVisible(true);
        setPopupMessage("Deposit Request successfull!");
        setTimeout(() => {
          setIsPopupVisible(false)
        }, 2000)
      } else {
        setDuplicateUtrAlert(
          response.message || "An error occurred while processing your request."
        )
      }
      fetchDepositHistory()
    } catch (error) {
      //console.log("Error creating deposit:", error)
      setDuplicateUtrAlert(
        "An unexpected error occurred. Please try again later."
      )
    }
  }

  useEffect(() => {
    if (openDepositDialog) {
      timerRef.current = setInterval(() => {
        setRemainingTime((time) => time - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRemainingTime(300);
    }

    return () => clearInterval(timerRef.current);
  }, [openDepositDialog, imageUrl]);

  useEffect(() => {
    if (remainingTime === 0) {
      setOpenDepositDialog(false);
    }
  }, [remainingTime]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // make a random 10 digit transaction id
  const transaction = Math.floor(1000000000 + Math.random() * 9000000000);
  const [paymentUrl, setPaymentUrl] = useState("");
  // Function to generate a 16-digit unique order number
  const generateOrderNumber = () => {
    return Math.floor(Math.random() * 10 ** 16)
      .toString()
      .padStart(16, "0");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Define a minimum amount check or any additional validation if required
    const minAmount = paymentMode === "USDT" ? 10 : 100;
    const currentAmount =
      paymentMode === "USDT" ? parseFloat(usdtAmount) : parseFloat(amount);

    if (isNaN(currentAmount) || currentAmount < minAmount) {
      setIsPopupVisible(true);
      setPopupMessage(
        `Amount must be at least ${paymentMode === "USDT" ? "10$" : "₹100"}`
      );
      setTimeout(() => {
        setIsPopupVisible(false)
      }, 2000)
      return;
    }

    try {
      // Generate a unique 16-digit order number
      const orderNumber = generateOrderNumber();
      // //console.log(`Generated order number: ${orderNumber}`);

      let response;

      if (paymentMode === "UPIxPAYTM") {
        response = await axios.post(
          `${domain}/create-order`,
          {
            amount: currentAmount,
            orderNumber: orderNumber, // Send the generated unique order number
          },
          { withCredentials: true }
        );
        // Check if the order creation was successful
        if (response.status !== 201 || !response.data.paymentResponse) {
          console.error(
            "Failed to create order or invalid response structure.",
            response
          );
          throw new Error(
            "Failed to create order or invalid response structure"
          );
        }

        const { paymentResponse } = response.data;
        const { payOrderId, retCode, payParams } = paymentResponse;

        // Ensure that payOrderId is present and retCode is SUCCESS
        if (payOrderId && retCode === "SUCCESS") {
          const payUrl = payParams.payUrl; // Extract payment URL from 
          handleSuccessfulPayment(payUrl);
        } else {
          console.error("Invalid payment response:", paymentResponse);
          throw new Error("Invalid payment response. Please try again.");
        }
      } else if (paymentMode === "UPIxLGPay") {

        response = await axios.post(
          `${domain}/create-lgpay-order`,
          {
            amount: currentAmount,
            order_sn: orderNumber, // Send the generated unique order number
          },
          { withCredentials: true }
        );

        // Check if the order creation was successful
        if (response.status !== 201 || !response.data.paymentUrl) {
          console.error(
            "Failed to create LGPay order or invalid response structure.",
            response
          );
          throw new Error(
            "Failed to create LGPay order or invalid response structure"
          );
        }

        const payUrl = response.data.paymentUrl;

        handleSuccessfulLGPayPayment(payUrl, orderNumber); // Pass orderNumber here
      } else if (paymentMode === "UPIxWatchPay") {
        // //console.log("Starting UPIxWatchPay payment process...");

        // Call the create-lgpay-order API when payment mode is UPIxLGPay
        response = await axiosInstance.post(
          `${domain}/api/wallet/paymentGateway/watchpay/create-order`,
          {
            amount: currentAmount,
            orderId: orderNumber, // Send the generated unique order number
          },
        );

       if (
          response.data.data.data.paymentGatewayRes.tradeResult === "1" &&
          response.data.data.data.paymentGatewayRes.payInfo &&
          response.data.data.data.paymentGatewayRes.respCode === "SUCCESS"
        ) {
          const payUrl = response.data.data.data.paymentGatewayRes.payInfo;

          // Assuming handleSuccessfulLGPayPayment is a function to handle the redirection
          handleSuccessfulWatchPayPayment(payUrl, orderNumber); // Pass orderNumber here
        } else {
          console.error(
            "Failed to create LGPay order or invalid response structure.",
            response
          );
          throw new Error(
            "Failed to create LGPay order or invalid response structure"
          );
        }
      } else if (paymentMode === "UPIxIQPay") {
        // Handle IQPay payment process
        //console.log("Starting UPIxIQPay payment process...");

        response = await axiosInstance.post(
          `${domain}/api/wallet/paymentGateway/iqpay/create-order`,
          {
            amount: currentAmount,
            orderId: orderNumber, // Send the generated unique order number
          },
        );

        // Check if the order creation was successful based on IQPay response structure
        if (
          response.data.status === true &&
          response.data.data &&
          response.data.data.intentUrl
        ) {
          const payUrl = response.data.data.intentUrl;

          // Handle successful IQPay payment
          handleSuccessfulIQPayPayment(payUrl, orderNumber);
        } else {
          console.error(
            "Failed to create IQPay order or invalid response structure.",
            response
          );
          throw new Error(
            "Failed to create IQPay order or invalid response structure"
          );
        }
      } else {
        // Handle other payment modes
        response = await axios.post(
          `${domain}/deposit`,
          {
            amount: currentAmount,
            depositMethod: paymentMode,
          },
          { withCredentials: true }
        );

        if (response.status === 200 && response.data.paymentResponse) {
          const payUrl = response.data.paymentResponse.payParams.payUrl;
          handleSuccessfulPayment(payUrl);
        } else {
          console.error(
            "Failed to process deposit or invalid response structure.",
            response
          );
          throw new Error(
            "Failed to process deposit or invalid response structure"
          );
        }
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      handlePaymentError(error);
    }
  };

  // Add a new handler for successful IQPay payments
  const handleSuccessfulIQPayPayment = (payUrl, orderSn) => {
    setPaymentUrl(payUrl);
    setOrderNumber(orderSn); // Store the order number
    window.open(payUrl);
    setAmount("");
    setUsdtAmount("");

    // If you need to implement polling for IQPay status, uncomment below
    // setIsPolling(true);
    // pollIQPaymentStatus(orderSn);
  };

  // Optional: Add a polling function for IQPay if needed
  const pollIQPaymentStatus = async (orderSn) => {
    try {
      const intervalId = setInterval(async () => {
        try {
          const statusResponse = await axiosInstance.post(
            `${domain}/api/wallet/paymentGateway/iqpay/order-status`,
            {
              merchant_ref_id: orderSn
            }
          );

          //console.log("IQPay payment status:", statusResponse.data);

          // Check if payment is completed or failed
          if (statusResponse.data.status === true &&
            statusResponse.data.data.status === "SUCCESS") {
            clearInterval(intervalId);
            setIsPolling(false);
            // Handle successful payment completion
            setIsPopupVisible(true);
            setPopupMessage("Payment completed successfully!");
            setTimeout(() => {
              setIsPopupVisible(false);
              // Refresh wallet or navigate to success page
            }, 2000);
          } else if (statusResponse.data.status === true &&
            statusResponse.data.data.status === "CANCELLED") {
            clearInterval(intervalId);
            setIsPolling(false);
            // Handle failed payment
            setIsPopupVisible(true);
            setPopupMessage("Payment was cancelled or failed.");
            setTimeout(() => {
              setIsPopupVisible(false);
            }, 2000);
          }
        } catch (error) {
          console.error("Error polling IQPay payment status:", error);
        }
      }, 5000); // Poll every 5 seconds

      // Store interval ID to clear it later if needed
      setStatusPollingInterval(intervalId);

      // Stop polling after 5 minutes (300000ms) if not completed
      setTimeout(() => {
        clearInterval(intervalId);
        setIsPolling(false);
      }, 300000);
    } catch (error) {
      console.error("Error setting up IQPay status polling:", error);
    }
  };

  const handleSuccessfulPayment = (payUrl) => {
    setPaymentUrl(payUrl);
    window.location.href = payUrl;
    setAmount("");
    setUsdtAmount("");
  };

  // Modify your existing handleSuccessfulLGPayPayment function
  const handleSuccessfulLGPayPayment = (payUrl, orderSn) => {
    setPaymentUrl(payUrl);
    setOrderNumber(orderSn); // Store the order number
    window.open(payUrl);
    setAmount("");
    setUsdtAmount("");

    // Start polling
    // setIsPolling(true);
    // pollPaymentStatus(orderSn);
  };

  // Modify your existing handleSuccessfulLGPayPayment function
  const handleSuccessfulWatchPayPayment = (payUrl, orderSn) => {
    setPaymentUrl(payUrl);
    setOrderNumber(orderSn); // Store the order number
    window.open(payUrl);
    setAmount("");
    setUsdtAmount("");
  };

  const handlePaymentError = (error) => {
    console.error("Error processing payment:", error.message);
    if (error.response) {
      console.error("Server Error:", error.response.data);
      console.error("Status Code:", error.response.status);
      console.error("Response Headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    setIsPopupVisible(true);
    setPopupMessage(
      "Payment request failed. Please try again or check your details."
    );
    setTimeout(() => {
      setIsPopupVisible(false)
    }, 2000)
  };

  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate(-1);
  };

  const handlePage = () => {
    navigate("/deposit-history");
  };

  const [selectedChannel, setSelectedChannel] = useState(0);
  const [selectedValue, setSelectedValue] = useState(0);
  useEffect(() => {
    setSelectedChannel(0);
  }, [paymentMode]);
  // const paymentModes = {
  //   // UPIxWatchPay: [
  //   //   { name: "QR-ARpay", balance: "100 - 50K", bonus: "3%" },
  //   //   { name: "QR-7Day", balance: "100 - 50K", bonus: "3%" },
  //   //   { name: "QR-Happy", balance: "100 - 50K", bonus: "3%" },
  //   //   { name: "QR-OoPay", balance: "100 - 50K", bonus: "3%" },
  //   // ],
  //   // UPIxPAYTM: [
  //   //   { name: "QR-ARpay", balance: "200 - 50K", bonus: "3%" },
  //   //   { name: "QR-7Day", balance: "200 - 50K", bonus: "3%" },
  //   //   { name: "QR-Happy", balance: "200 - 50K", bonus: "3%" },
  //   //   { name: "QR-OoPay", balance: "200 - 50K", bonus: "3%" },
  //   // ],
  //   // UPIxLGPay: [
  //   //   { name: "QR-ARpay", balance: "100 - 50K", bonus: "3%" },
  //   //   { name: "QR-7Day", balance: "100 - 50K", bonus: "3%" },
  //   //   { name: "QR-Happy", balance: "100 - 50K", bonus: "3%" },
  //   //   { name: "QR-OoPay", balance: "100 - 50K", bonus: "3%" },
  //   // ],
  //   "UPI x QR": [
  //     { name: "Super-QR", balance: "100 - 50K", bonus: "3%" },
  //     { name: "ARpay-QR", balance: "100 - 50K", bonus: "3%" },
  //     { name: "OoPay-QR", balance: "100 - 50K", bonus: "3%" },
  //     { name: "Paile-QR", balance: "100 - 100K", bonus: "3%" },
  //     { name: "7Day-QR", balance: "100 - 50K", bonus: "3%" },
  //     { name: "FFPay-QR", balance: "100 - 50K", bonus: "3%" },
  //     { name: "WPay-QR", balance: "100 - 50K", bonus: "3%" },
  //     { name: "Happy-QR", balance: "100 - 50K", bonus: "3%" },
  //   ],
  //   USDT: [
  //     {
  //       name: "UUPayUSDTCU",
  //       balance: "10-1M",
  //       bonus: "3%",
  //       image: "../../assets/3-6bb1e3bd.webp",
  //     },
  //   ],
  // };

  const [user, setUser] = useState(null);

  // Add this to your Deposit.jsx file - Modified handleDeposit function

const handleDeposit = (e) => {
  e.preventDefault();
  const minAmount = paymentMode === "USDT" ? 10 : 100;
  const currentAmount =
    paymentMode === "USDT" ? parseFloat(usdtAmount) : parseFloat(amount);

  if (isNaN(currentAmount) || currentAmount < minAmount) {
    setIsPopupVisible(true);
    setPopupMessage(
      `Amount must be at least ${paymentMode === "USDT" ? "10$" : "₹100"}`
    );
    setTimeout(() => {
      setIsPopupVisible(false);
    }, 2000);
  } else {
    // Check for UPIxPAYTM payment mode and minimum amount of 200
    if (paymentMode === "UPIxPAYTM" && currentAmount < 200) {
      setIsPopupVisible(true);
      setPopupMessage(
        "For UPI payments, the minimum deposit amount is ₹200. Please increase your deposit amount."
      );
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 2000);
    } else {
      // Handle different payment gateways
      if (paymentMode === "UPIxPAYTM") {
        handleSubmit(e);
      } else if (paymentMode === "UPIxWatchPay") {
        handleSubmit(e);
      } else if (paymentMode === "UPIxLGPay") {
        handleSubmit(e);
      } else if (paymentMode === "UPIxIQPay") {
        handleSubmit(e);
      } else if (paymentMode === "USDT") {
        // Generate random parameters for USDT payment
        const randomParam = Math.random().toString(36).substring(2, 15);
        const timestamp = Date.now();
        // Navigate to USDT deposit page with random parameters and amount
        window.location.href = `/usdt-deposit/${randomParam}/${timestamp}?amount=${usdtAmount}`;
      } else if (paymentMode === "UPI x QR") {
        // ✅ NEW: Navigate to UPI Manual Deposit page
        const randomParam = Math.random().toString(36).substring(2, 15);
        const timestamp = Date.now();
        window.location.href = `/upi-deposit/${randomParam}/${timestamp}?amount=${amount}`;
      } else {
        // Fallback for other payment modes
        if (isRestricted) {
          createRestrictedDeposit(amount);
        } else {
          setOpenDepositDialog(true);
        }
      }
    }
  }
};
  const [get1, setGet1] = useState("");
  const [get2, setGet2] = useState("");
  useEffect(() => {
    const handleGet = () => {
      axiosInstance
        .get(`${domain}/api/upi/show`, { withCredentials: true })
        .then((res) => {
          const data = res.data.data;
          if (data.length > 0) {
            const lastItem = data[data.length - 1]; // Get the last object
            setGet1(lastItem.upiId);
            setGet2(lastItem.trxAddress);
            if (lastItem.imageUrl) {
              setImageUrl(`${window.location.origin}${lastItem.imageUrl}`);
            } else {
              setImageUrl(null); // Handle null image cases
            }
            //console.log("Last Object Data:", lastItem);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };

    handleGet();
  }, []);

  useEffect(() => {
    // Reset amount and usdtAmount when payment mode changes
    setAmount("");
    setUsdtAmount("");
  }, [paymentMode]);
  return (
    <>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="100dvh"
          position="relative"
        >
          <Box flexGrow={1} sx={{ backgroundColor: "#232626 " ,position: "relative", }}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#232626 ",
                padding: "7px 4px",
                color: "white",
              }}
            >
              <Grid item container alignItems="center" justifyContent="center">
                <Grid item xs={3}>
                  <IconButton
                    sx={{ color: "#ffffff", mr: 8 }}
                    onClick={handleRedirect}
                  >
                    <ArrowBackIosNewIcon sx={{ fontSize: "20px" }} />
                  </IconButton>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#ffffff",
                      flexGrow: 1,
                      textAlign: "center",
                      mr: 3,
                    }}
                  >
                    Deposit
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="caption"
                    sx={{
                      textAlign: "left",
                      color: "#ffffff",
                      fontSize: "13px",
                      flexGrow: 1,
                    }}
                    onClick={handlePage}
                  >
                    Deposit history
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <WalletCard name={"Balance"} />
            <Grid
              container
              spacing={1}
              mt={0}
              style={{
                width: "96%",
                marginLeft: "auto",
                marginRight: "10px",
                marginTop: "5px",
                alignItems: "center",
              }}
            >
              {Object.keys(paymentModes).map((mode) => {
                const imgSrc = `/assets/wallet/${mode}.webp`;
                //console.log("Rendering Image for Mode:", mode, "with src:", imgSrc);

                return (
                  <Grid item xs={3.2} key={mode}>
                    <div
                      style={{
                        background:
                          paymentMode === mode
                            ? "linear-gradient(90deg,#24ee89,#9fe871)"
                            : "#323738",
                        borderRadius: 8,
                        color: paymentMode === mode ? "black" : "#B3BEC1",
                        padding: "20px 0px",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        height: "65px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                      }}
                      onClick={() => {
                        setPaymentMode(mode);
                        setSelectedChannel(null);
                      }}
                    >
                      {/* Badge for Deposit Bonus Percentage */}
                      {depositBonusPercentage > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            backgroundColor: "red",
                            color: "white",
                            borderRadius: "0 8px 0",
                            padding: "0 5px",
                            width: "24px",
                            height: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {depositBonusPercentage}%
                        </div>
                      )}

                      <img
                        src={imgSrc}
                        alt={mode}
                        style={{
                          maxWidth: "40%",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography
                        variant="caption"
                        align="center"
                        style={{ marginTop: 8, fontSize: "12.8px" }}
                      >
                        {mode}
                      </Typography>
                    </div>
                  </Grid>
                );
              })}

            </Grid>

            {/* Channels Based on Payment Mode */}
            <Box
              sx={{
                // border: "1px solid #e0e0e0",
                borderRadius: "12px",

                padding: "13px",
                paddingBottom: "15px",
                paddingTop: "15px",
                background: "#323738",
                // width: "87%",
                margin: "auto 13px",
                mt: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <img
                  src="/assets/icons/card.svg"
                  alt="Placeholder"
                  width={25}
                  height={25}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "17px",
                    marginLeft: 1.5,
                    fontWeight: "500",
                    color: "#ffffff",
                  }}
                >
                  Select channel
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {paymentModes[paymentMode]?.channels?.map((channel, index) => (
                  <Grid item xs={6} key={index}>
                    <Card
                      onClick={() => setSelectedChannel(index)}
                      sx={{
                        borderRadius: "8px",
                        background:
                          selectedChannel === index
                            ? "linear-gradient(90deg,#24ee89,#9fe871)"
                            : "#3a4142",
                        cursor: "pointer",
                        height: paymentMode === "USDT" ? "65px" : "50px", // Set height conditionally based on payment mode
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        py: 1,
                        width: paymentMode === "USDT" ? "110%" : "100%",
                        boxShadow: "none",
                      }}
                    >
                      <CardContent
                        sx={{
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          padding: "0px",
                          paddingTop: "20px",
                          // mt: 2,
                        }}
                      >
                        {/* Conditionally render the image only for USDT channels */}
                        {channel.image && (
                          <img
                            src={channel.image}
                            alt="Channel"
                            style={{
                              width: "2rem",
                              height: "2rem",
                              marginRight: "12px",
                              // marginLeft: "-10px",
                            }}
                          />
                        )}
                        <Box>
                          <Typography
                            sx={{
                              color:
                                selectedChannel === index
                                  ? "#221f2e"
                                  : "#B3BEC1",
                              fontSize: "15px",
                            }}
                          >
                            {channel.name}
                          </Typography>
                          <Typography
                            sx={{
                              color:
                                selectedChannel === index
                                  ? "#221f2e"
                                  : "#B3BEC1",
                              fontSize: "15px",
                            }}
                          >
                            Balance: {channel.balance}
                          </Typography>
                          {/* Render bonus only for USDT payment mode */}
                          {paymentMode === "USDT" && channel.bonus && (
                            <Typography
                              sx={{
                                color:
                                  selectedChannel === index
                                    ? "#221f2e"
                                    : "#a8a5a1",
                                fontSize: "13px",
                              }}
                            >
                              {channel.bonus} bonus
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
            {/* Deposit Amount */}
            <Box
              sx={{ bgcolor: "#323738", p: 2, borderRadius: 2, margin: "13px" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <img
                  src="/assets/icons/depositicon.svg"
                  alt="Placeholder"
                  width={25}
                  height={25}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#ffffff",
                    ml: "12px",
                    fontSize: "19px",
                  }}
                >
                  Deposit amount
                </Typography>
              </Box>

              <Grid container spacing={1}>
                {getAmountArray().map((value) => (
                  <Grid item xs={4} key={value}>
                    <Button
                      variant="outlined"
                      onClick={() => handleButtonClick(value)}
                      startIcon={
                        <Typography sx={{ color: selectedValue === value ? "#FFFFFF" : "#b3bec1" }}>
                          {paymentMode === "USDT" ? (
                            <img
                              src="/assets/wallet/USDT.webp"
                              alt="USDT"
                              style={{
                                maxWidth: "20%",
                                paddingRight: "4rem",
                              }}
                            />
                          ) : (
                            "₹"
                          )}
                        </Typography>
                      }
                      sx={{
                        width: "100%",
                        background:
                          selectedValue === value
                            ? "linear-gradient(90deg,#24ee89,#9fe871)"
                            : "#323738",
                        color: selectedValue === value ? "#221F2E" : "#24ee89",
                        borderColor: "#ffffff",
                        justifyContent: "center",

                        "& .MuiButton-startIcon": {
                          position: "absolute",
                          left: "16px",
                        },
                      }}
                    >
                      <Typography variant="h7" sx={{ fontSize: "17px" }}>
                        {paymentMode === "USDT"
                          ? value
                          : value >= 1000
                            ? `${value / 1000}K`
                            : value}
                      </Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>

              {paymentMode === "USDT" ? (
                <TextField
                  fullWidth
                  placeholder="Please enter USDT amount"
                  value={usdtAmount}
                  onChange={handleUsdtInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <img
                          src="/assets/wallet/USDT.webp"
                          alt="USDT"
                          style={{ maxWidth: "1.5rem" }}
                        />
                        <span
                          style={{
                            color: "transparent",
                            fontSize: "20px",
                            fontWeight: "bold",
                            marginLeft: "0.7rem",
                            marginRight: "1rem",
                            height: "100%",
                            width: "1px",
                            background: "#b3bec1",
                          }}
                        >
                          .
                        </span>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setAmount("");
                            setUsdtAmount("");
                          }}
                          sx={{
                            border: "2px solid #656565", // White circular border
                            borderRadius: "50%", // Ensures the border is circular
                            padding: "0px", // Adjust padding for proper spacing
                            color: "#656565", // Icon color
                          }}
                        >
                          <CloseIcon sx={{ width: "17px", height: "17px" }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    marginTop: "1rem",
                    bgcolor: "#232626",
                    borderRadius: "50px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      color: "white", // Set text color for input
                      "& fieldset": { border: "none" },
                      "&:hover fieldset": { border: "none" },
                      "&.Mui-focused fieldset": { border: "none" },
                      "& input": {
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#24ee89", // Ensure input text color is white
                      },
                      "& input::placeholder": {
                        fontSize: "14px",
                        fontWeight: "normal",
                        color: "#b3bec1", // Ensure placeholder color is white
                        opacity: 1, // Ensure opacity doesn't dim the color
                      },
                    },
                  }}
                />
              ) : null}

              <TextField
                fullWidth
                placeholder="Please enter the amount"
                value={amount}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span
                        style={{
                          color: "#24ee89",
                          fontSize: "20px",
                          fontWeight: "bold",
                          marginLeft: "0.5rem",
                        }}
                      >
                        ₹
                      </span>
                      <span
                        style={{
                          color: "transparent",
                          fontSize: "20px",
                          fontWeight: "bold",
                          margin: "0 1rem",
                          height: "100%",
                          width: "1px",
                          background: "#b3bec1",
                        }}
                      >
                        .
                      </span>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          setAmount("");
                          setUsdtAmount("");
                        }}
                        sx={{
                          border: "2px solid #656565", // White circular border
                          borderRadius: "50%", // Ensures the border is circular
                          padding: "0px", // Adjust padding for proper spacing
                          color: "#656565", // Icon color
                        }}
                      >
                        <CloseIcon sx={{ width: "17px", height: "17px" }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  marginTop: "1rem",
                  bgcolor: "#232626",
                  borderRadius: "50px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    color: "white", // Set text color for input
                    "& fieldset": { border: "none" },
                    "&:hover fieldset": { border: "none" },
                    "&.Mui-focused fieldset": { border: "none" },
                    "& input": {
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#24ee89", // Ensure input text color is white
                    },
                    "& input::placeholder": {
                      fontSize: "14px",
                      fontWeight: "normal",
                      color: "#b3bec1", // Ensure placeholder color is white
                      opacity: 1, // Ensure opacity doesn't dim the color
                    },
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  textTransform: "initial",
                  background:
                    "linear-gradient(90deg,#24ee89,#9fe871)",
                  borderRadius: "16px",
                  color: "white",
                  "&:hover": { bgcolor: "#0e5415" },
                  boxShadow: "none",
                }}
                onClick={handleDeposit}
              >
                Deposit
              </Button>
            </Box>
            <div>
              {paymentUrl && <a href={paymentUrl}>Proceed to Payment</a>}
            </div>
            {/* Recharge Instructions */}
            <Box
              sx={{
                margin: "10px auto", // Centered horizontally with automatic margins
                borderRadius: 2,
                bgcolor: "#323738",
                color: "white",
                mt: 2,
                width: "93%",
              }}
            >
              <Box sx={{ padding: 2 }}>
                {/* Adjusted padding for better spacing */}
                <Box display="flex" alignItems="center" mb={2} gap={1}>
                  {/* Increased bottom margin */}
                  <img
                    src="/assets/icons/book.svg"
                    alt="Placeholder"
                    width={21}
                    height={22}
                    style={{ marginTop: "2px" }}
                  />
                  {/* <RhombusIcon sx={{ fontSize: 30, color: "#0f6518", mr: 1 }} /> */}
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    align="left"
                    sx={{ lineHeight: 1.3, fontSize: "16px",color:"#ffffff" }}
                  >
                    Recharge Instructions
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: "1px solid #433e36", // Light grey border color
                    borderRadius: 3, // Rounded corners
                    paddingLeft: 1.3, // Increased padding inside the border
                    paddingRight: 1.3, // Increased padding inside the border
                    py: 2.8, // Increased padding inside the border
                    ml: 0, // No left margin for alignment
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      fontSize: "13px",
                      mb: 1.5, // Increased bottom margin
                      color: "#B3BEC1",
                    }}
                    align="left"
                  >
                    <RhombusIcon
                      sx={{ fontSize: 9, color: "#24ee89", mr: 1 }} // Slightly larger icon for better visibility
                    />
                    If the transfer time is up, please fill out the deposit form
                    again.
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      fontSize: "13px",
                      mb: 1.5, // Increased bottom margin
                      color: "#B3BEC1",
                    }}
                    align="left"
                  >
                    <RhombusIcon
                      sx={{ fontSize: 9, color: "#24ee89", mr: 1 }} // Slightly larger icon for better visibility
                    />
                    The transfer amount must match the order you created,
                    otherwise the money cannot be credited successfully.
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      fontSize: "13px",
                      mb: 1.5, // Increased bottom margin
                      color: "#B3BEC1",
                    }}
                    align="left"
                  >
                    <RhombusIcon
                      sx={{ fontSize: 9, color: "#24ee89", mr: 1 }} // Slightly larger icon for better visibility
                    />
                    If you transfer the wrong amount, our company will not be
                    responsible for the lost amount!
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      fontSize: "13px",
                      color: "#B3BEC1",
                    }}
                    align="left"
                  >
                    <RhombusIcon
                      sx={{ fontSize: 9, color: "#24ee89", mr: 1 }} // Slightly larger icon for better visibility
                    />
                    Note: Do not cancel the deposit order after the money has
                    been transferred.
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Dialog
              open={openDepositDialog}
              onClose={closeDepositDialog} // Handle close event
              disableBackdropClick
              disableEscapeKeyDown
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "& .MuiDialog-paper": {
                  backgroundColor: "#232626", // Light green background
                  borderRadius: "16px",
                  maxWidth: "350px",
                },
              }}
            >
              <DialogTitle
                sx={{
                  background:
                    "linear-gradient(90deg,#24ee89,#9fe871)",
                  color: "black",
                  fontWeight: "bold",
                  borderTopLeftRadius: "16px",
                  borderTopRightRadius: "16px",
                }}
              >
                Deposit
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ backgroundColor: "#232626" }}>
                  <Grid item xs={8}>
                    <Typography
                      variant="h6"
                      sx={{ color: "#f5a73b", paddingTop: "1rem" }}
                    >
                      Remaining Time
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant="h6"
                      align="right"
                      sx={{ color: "#f5a73b", paddingTop: "1rem" }} // Red color for the countdown
                    >
                      {Math.floor(remainingTime / 60)}:
                      {remainingTime % 60 < 10 ? "0" : ""}
                      {remainingTime % 60}
                    </Typography>
                  </Grid>
                  {paymentMode === "UPI x QR" && (
                    <>
                      {imageUrl ? (
                        <Grid item xs={12}>
                          <img
                            src={imageUrl}
                            alt="QR Code"
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              display: "block",
                              margin: "0 auto",
                            }}
                          />
                        </Grid>
                      ) : (
                        <Grid item xs={12}>
                          <Typography variant="h7" sx={{ color: '#a8a5a1' }}>Loading QR Code...</Typography>
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ color: "#a8a5a1" }}>
                          UPI ID: {get1 ? get1 : "Loading"}
                          <IconButton
                            onClick={() =>
                              copyToClipboard(get1 ? get1 : "Loading")
                            }
                          >
                            <FileCopyIcon sx={{ color: "#f5a73b" }} />
                          </IconButton>
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="utr"
                          label="UTR"
                          value={utr}
                          onChange={handleUtrChange}
                          sx={{
                            width: "100%",
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#323738", // Dark background color
                              borderRadius: "8px",
                              "& fieldset": {
                                border: "1px solid #808080", // Gray border
                              },
                              "&:hover fieldset": {
                                border: "1px solid #808080", // Gray border on hover
                              },
                              "&.Mui-focused fieldset": {
                                border: "1px solid #808080", // Gray border when focused
                              },
                              "& .MuiOutlinedInput-input": {
                                color: "white", // White text color for input
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#808080", // Gray label color
                              "&.Mui-focused": {
                                color: "#808080", // Gray label color when focused
                              },
                            },
                          }}
                          InputLabelProps={{
                            shrink: true, // Ensures the label is always above the input
                          }}
                        />
                      </Grid>
                    </>
                  )}
                  {paymentMode === "USDT" && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ color: "#a8a5a1" }}>
                          USDT Wallet Address: {get2 ? get2 : "Loading"}
                          <IconButton
                            onClick={() =>
                              copyToClipboard(get2 ? get2 : "Loading")
                            }
                          >
                            <FileCopyIcon sx={{ color: "#f5883b" }} />
                          </IconButton>
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" sx={{ color: "#a8a5a1" }}>
                          Conversion Rate: 1 USDT = 93 INR
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="utr"
                          label="UTR"
                          value={utr}
                          onChange={handleUtrChange}
                          sx={{
                            width: "100%",
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                              "& fieldset": {
                                border: "1px solid gray", // Gray border
                              },
                              "&:hover fieldset": {
                                border: "1px solid gray", // Gray border on hover
                              },
                              "&.Mui-focused fieldset": {
                                border: "1px solid gray", // Gray border when focused
                              },
                              "& .MuiOutlinedInput-input": {
                                color: "white", // White text color for input
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "gray", // Gray label color
                              "&.Mui-focused": {
                                color: "gray", // Gray label color when focused
                              },
                            },
                          }}
                          InputLabelProps={{
                            shrink: true, // Ensures the label is always above the input
                          }}
                        />
                      </Grid>
                    </>
                  )}
                  {paymentMode === "UPIxPAYTM" && (
                    <Grid item xs={12}>
                      <Typography variant="body1">
                        Currently this payment option is not available.
                      </Typography>
                    </Grid>
                  )}
                  {utrAlert && (
                    <Grid item xs={12}>
                      <Alert severity="error" sx={{ marginBottom: 2 }}>
                        UPI ID or QR Scan is required
                      </Alert>
                    </Grid>
                  )}
                  {duplicateUtrAlert && (
                    <Grid item xs={12}>
                      <Alert severity="error" sx={{ marginBottom: 2 }}>
                        {duplicateUtrAlert}
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions
                sx={{
                  justifyContent: "center",
                  borderTop: "1px solid #c8e6c9", // Light green border
                  padding: "16px",
                }}
              >
                <Button
                  onClick={closeDepositDialog} // Cancel button to close the dialog
                  sx={{
                    backgroundColor: "#e0e0e0", // Red color for cancel button
                    color: "black",
                    textTransform: "initial",
                    "&:hover": {
                      backgroundColor: "#e0e0e0", // Darker red on hover
                    },
                    mr: 2, // Margin-right for spacing
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={sendDepositRequest}
                  sx={{
                    backgroundColor: "#f5a73b",
                    color: "white",
                    textTransform: "initial",

                    "&:hover": {
                      backgroundColor: "#f5883b", // Darker green on hover
                    },
                  }}
                >
                  Send Request
                </Button>
              </DialogActions>
            </Dialog>
            <br />
            {/* content end */}
            <Box sx={{ paddingX: "1rem" }}>
              {/* Heading */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <img
                  src="/assets/icons/deposithistories.svg"
                  alt="Placeholder"
                  width={25}
                  height={25}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "17px",
                    marginLeft: 1.5,
                    fontWeight: "bold",
                    color: "#ffffff",
                  }}
                >
                  Deposit History
                </Typography>
              </Box>

              <div>
                {depositHistories.length > 0 ? (
                  depositHistories.map((deposit) => (
                    <Card
                      key={deposit.depositId}
                      sx={{
                        marginBottom: "16px",
                        bgcolor: "#323738",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <CardContent
                        sx={{ padding: "16px", position: "relative" }}
                      >
                        <Grid
                          container
                          mt={-1}
                          mb={1}
                          sx={{ borderBottom: "1px solid #454037" }}
                        >
                          <Grid item xs={3}>
                            <Box
                              sx={{
                                backgroundColor: getStatusColor(
                                  deposit.depositStatus
                                ),
                                color: "#FFFFFF",
                                // fontWeight: "bold",
                                borderRadius: "5px",
                                padding: "4px 0px",
                                marginBottom: "10%",
                                fontSize: "14px",
                                textAlign: "center",
                              }}
                            >
                              Deposit
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "500",
                                position: "absolute",
                                right: "16px",
                                top: "13px",
                                fontSize: "16px",
                                color: getStatusColor(deposit.depositStatus),
                              }}
                            >
                              {deposit.depositStatus.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                          <Grid item xs={3} textAlign="left">
                            <Typography
                              variant="body2"
                              sx={{ color: "#B3BEC1" }}
                            >
                              Balance
                            </Typography>
                          </Grid>
                          <Grid item xs={9} textAlign="end">
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "500",
                                color: getStatusColor(deposit.depositStatus),
                              }}
                            >
                              ₹{deposit.depositAmount}
                            </Typography>
                          </Grid>
                          <Grid item xs={3} textAlign="left">
                            <Typography
                              variant="body2"
                              sx={{ color: "#B3BEC1" }}
                            >
                              Type
                            </Typography>
                          </Grid>
                          <Grid item xs={9} textAlign="end">
                            <Typography
                              variant="body2"
                              sx={{ color: "#B3BEC1" }}
                            >
                              {deposit.depositMethod}
                            </Typography>
                          </Grid>
                          <Grid item xs={3} textAlign="left">
                            <Typography
                              variant="body2"
                              sx={{ color: "#B3BEC1" }}
                            >
                              Time
                            </Typography>
                          </Grid>
                          <Grid item xs={9} textAlign="end">
                            <Typography
                              variant="body2"
                              sx={{ color: "#B3BEC1" }}
                            >
                              {new Date(deposit.depositDate).toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={4} textAlign="left">
                            <Typography
                              variant="body2"
                              sx={{ color: "#B3BEC1" }}
                            >
                              Order number
                            </Typography>
                          </Grid>
                          <Grid item xs={8} textAlign="end">
                            <Typography
                              variant="body2"
                              sx={{ color: "#B3BEC1" }}
                            >
                              {deposit.depositId}
                              <IconButton
                                size="small"
                                // sx={{color:"red"}}
                                onClick={() => handleCopy(deposit.depositId)}
                              >
                                <img
                                  src="/assets/icons/copy2.svg"
                                  alt="logo"
                                  style={{ width: "12px" }}
                                />
                                {/* <ContentCopyIcon fontSize="small" /> */}
                              </IconButton>
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      marginTop: "10%",
                      marginBottom: "15%",
                    }}
                  >
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
                      }}
                    >
                      No deposit history available.
                    </Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    textAlign: "center",
                    marginTop: "10%",
                    marginBottom: "20%",
                  }}
                >
                  <Button
                    onClick={() => navigate("/deposit-history")}
                    variant="contained"
                    // color="primary"
                    sx={{
                      width: "100%",
                      fontSize: "16px",
                      textTransform: "initial",
                      borderRadius: "20px",
                      color: "#24ee89",
                      background: "transparent",
                      border: "1px solid #24ee89",
                      // "&:hover": {
                      //   background:
                      //     "linear-gradient(90deg,#24ee89,#9fe871)",
                      // },
                    }}
                  >
                    All history
                  </Button>
                </Box>
              </div>
            </Box>
          </Box>

          {children}
          <br />
          <br />
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
                  padding: "20px 30px",
                  borderRadius: "10px",
                  // boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                  zIndex: 1000,
                  animation: "fadeIn 0.5s ease",
                  textAlign: "center",
                }}
              >
                <Typography variant="body1" sx={{ marginTop: "10px" }}>
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
        </Box>
      </Mobile>
    </>
  );
};

export default Deposit;
