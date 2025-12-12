import React, { useState, useEffect, useRef, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/IndeterminateCheckBox";
import AddIcon from "@mui/icons-material/AddBox";
import Mobile from "../../components/layout/Mobile";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  Typography,
  Grid,
  Box,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Table,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableContainer,
} from "@mui/material";
// import { minHeight, styled } from "@mui/system";
import NoteIcon from "@mui/icons-material/Note";

import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
// import SupportAgentIcon from "@mui/icons-material/SupportAgent";
// import MusicNoteIcon from "@mui/icons-material/MusicNote";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
// import Refresh from "@mui/icons-material/Refresh";
// import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
// import MusicOffIcon from "@material-ui/icons/MusicOff";
import MusicOffIcon from "@mui/icons-material/MusicOff";
// import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
// import Divider from "@mui/material/Divider";
import Pagination from "@mui/material/Pagination";
import Drawer from "@mui/material/Drawer";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
// import K3popup from "./K3popup";
// import "../App.css";
import "../../components/games/k3/style.css";
// import CheckIcon from "@mui/icons-material/Check"
// import axios from "axios"
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { domain } from "../../utils/Secret";
import GameWalletCard from "../../components/games/common/GameWalletCard";
import K3Htp from "../../components/games/k3/K3Htp";
import K3Charts from "../../components/games/k3/K3Charts";
import K3GameHistory from "../../components/games/k3/K3GameHistory";
import K3MyHistory from "../../components/games/k3/K3MyHistory";
import CountdownTimer from "../../components/games/common/CountdownTimer";
import { UserContext } from "../../context/UserState";
import { useAuth } from "../../context/AuthContext";
import K3ThreeSame from "../../components/games/k3/K3ThreeSame";
import K3TwoSame from "../../components/games/k3/K3TwoSame";
import K3AllDifferent from "../../components/games/k3/K3AllDifferent";
const countdownSound = new Audio("/assets/sound.mp3");
countdownSound.loop = true;

const images = [
  {
    id: 1,
    src: "/assets/clock-unselected.webp",
    altSrc: "/assets/clock-selected.webp",
    subtitle: "1Min",
  },
  {
    id: 2,
    src: "/assets/clock-unselected.webp",
    altSrc: "/assets/clock-selected.webp",
    subtitle: "3Min",
  },
  {
    id: 3,
    src: "/assets/clock-unselected.webp",
    altSrc: "/assets/clock-selected.webp",
    subtitle: "5Min",
  },
  {
    id: 4,
    src: "/assets/clock-unselected.webp",
    altSrc: "/assets/clock-selected.webp",
    subtitle: "10Min",
  },
];

// const columns = [
//   { id: "period", label: "Period" },
//   { id: "sum", label: "Sum" },
//   { id: "diceValues", label: "Results" },
// ];

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box p={0}>{children}</Box>}
    </div>
  );
};

const K3Page = ({ timerKey }) => {
  const [activeId, setActiveId] = useState(images[0].id);
  const [selectedTimer, setSelectedTimer] = useState("1min");
  const [selectedItem, setselectedItem] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  //   const [timer, setTimer] = useState(60);
  //   const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  //   const [winner, setWinner] = useState(null);
  const [betPlaced, setBetPlaced] = useState(false);
  const [periodId, setPeriodId] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  // const [wallet, setWallet] = useState([]);
  const [isSmall, setIsSmall] = useState(false);
  const [isBig, setIsBig] = useState(true);
  const [isOdd, setIsOdd] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const [currentBetIndex, setCurrentBetIndex] = useState(-1);
  const [remainingTimeInMs, setRemainingTimeInMs] = useState(null);
  // const [showOverlay, setShowOverlay] = useState(false);
  // const [overlayContent, setOverlayContent] = useState("");
  // Add isPlacingBet state at the top of your component
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const { userData, getWalletBalance } = useContext(UserContext);
  const { axiosInstance } = useAuth();
  const [agreed, setAgreed] = useState(true);
  const [show, setShow] = useState(true);

  // Helper functions to persist state in localStorage
  const saveStateToLocalStorage = (key, state) => {
    if (state instanceof Set) {
      // Convert Set to array before saving
      localStorage.setItem(key, JSON.stringify(Array.from(state)));
    } else {
      localStorage.setItem(key, JSON.stringify(state));
    }
  };

  const loadStateFromLocalStorage = (key, defaultValue) => {
    const storedState = localStorage.getItem(key);
    if (storedState) {
      if (key === "processedPeriodIds") {
        // Convert array back to Set
        return new Set(JSON.parse(storedState));
      }
      return JSON.parse(storedState);
    }
    return defaultValue;
  };

  // Load initial state from localStorage
  const [userBets, setUserBets] = useState(() => {
    const storedUserBets = localStorage.getItem("userBets");
    return storedUserBets ? JSON.parse(storedUserBets) : [];
  });

  const [popupQueue, setPopupQueue] = useState([]);
  const [processedPeriodIds, setProcessedPeriodIds] = useState(new Set());
  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userBets", JSON.stringify(userBets));
  }, [userBets]);

  useEffect(() => {
    localStorage.setItem("popupQueue", JSON.stringify(popupQueue));
  }, [popupQueue]);

  useEffect(() => {
    localStorage.setItem("processedPeriodIds", JSON.stringify(Array.from(processedPeriodIds)));
  }, [processedPeriodIds]);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallScreen2 = useMediaQuery(theme.breakpoints.down(400));

  useEffect(() => {
    if (timerKey) {
      // //console.log("Timer key received:", timerKey); // Console log the timerKey

      // Map timerKey to corresponding timer details
      const timerMap = {
        "1min": { id: 1, subtitle: "1min" },
        "3min": { id: 2, subtitle: "3min" },
        "5min": { id: 3, subtitle: "5min" },
        "10min": { id: 4, subtitle: "10min" },
      };

      if (timerMap[timerKey]) {
        setActiveId(timerMap[timerKey].id);
        setSelectedTimer(timerMap[timerKey].subtitle);
        // navigate(`/k3/${timerKey}`);
      }
    }
  }, [timerKey, navigate]); // Include navigate in the dependency array

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setIsSmall(true);
        setIsBig(false);
      } else {
        setIsSmall(false);
        setIsBig(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Set the initial state
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggle = () => {
    setAgreed((prev) => !prev);
  };
  const handleToggle2 = () => {
    setShow(!show); // Toggle state on click
  };

  //   const handleDialog = () => {
  //     setOpen1(!open1);
  //   };

  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;
    let expiryTimeoutId = null;

    const getTimeRemainingInPeriod = () => {
      const timerMap = {
        "1Min": 60000,
        "3Min": 180000,
        "5Min": 300000,
        "10Min": 600000, // Added 10Min timer (10 minutes in milliseconds)
      };

      const periodDuration = timerMap[selectedTimer] || 60000;
      const now = new Date();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();

      let timeRemaining;

      switch (selectedTimer) {
        case "1Min":
          timeRemaining = periodDuration - (seconds * 1000 + milliseconds);
          break;

        case "3Min":
          const threeMinProgress =
            (Math.floor(now.getMinutes() % 3) * 60 + seconds) * 1000 +
            milliseconds;
          timeRemaining = periodDuration - threeMinProgress;
          break;

        case "5Min":
          const fiveMinProgress =
            (Math.floor(now.getMinutes() % 5) * 60 + seconds) * 1000 +
            milliseconds;
          timeRemaining = periodDuration - fiveMinProgress;
          break;

        case "10Min":
          const tenMinProgress =
            (Math.floor(now.getMinutes() % 10) * 60 + seconds) * 1000 +
            milliseconds;
          timeRemaining = periodDuration - tenMinProgress;
          break;

        default:
          timeRemaining = periodDuration;
      }

      return timeRemaining > 0 ? timeRemaining : periodDuration;
    };
    // //console.log("SelectedTimer Coming ------>", selectedTimer);

    const setupNextFetch = () => {
      if (!isMounted) return;

      const timeRemaining = getTimeRemainingInPeriod();
      setRemainingTimeInMs(timeRemaining);

      if (timeoutId) clearTimeout(timeoutId);
      if (expiryTimeoutId) clearTimeout(expiryTimeoutId);

      timeoutId = setTimeout(() => {
        if (isMounted) {
          setupNextFetch();
        }
      }, timeRemaining);
    };

    // Just setup the timer without fetching
    setupNextFetch();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (expiryTimeoutId) clearTimeout(expiryTimeoutId);
    };
  }, [selectedTimer]);

  // Single effect to handle both selectedTimer changes and periodId changes
  const lastSelectedTimerRef = useRef(selectedTimer);
  const lastPeriodIdRef = useRef(periodId);

  // useEffect(() => {
  //   if (remainingTimeInMs !== null) {
  //     // //console.log(`Time remaining: ${remainingTimeInMs/1000} seconds`);
  //   }
  // }, [remainingTimeInMs])

  const timerTypeMap = {
    "1min": "ONE_MINUTE_TIMER",
    "3min": "THREE_MINUTE_TIMER",
    "5min": "FIVE_MINUTE_TIMER",
    "10min": "TEN_MINUTE_TIMER",
  };

  const invertedTimerTypeMap = Object.fromEntries(
    Object.entries(timerTypeMap).map(([key, value]) => [value, key])
  );

  // Function to get the value using the key
  // function getOriginalKey(invertedKey) {
  //   return invertedTimerTypeMap[invertedKey] || null; // Return null if the key doesn't exist
  // }

  const handleTimerChange = (id, subtitle) => {
    setActiveId(id);
    const newTimerKey = subtitle.toLowerCase();
    setSelectedTimer(newTimerKey);
    setPage(1)
    setBetPage(1)
    setChartPage(1)
    // //console.log("newTimerKey--------->", mappedTimerType)
  };

  const handleClick = (id) => {
    if (!timerKey) {
      let newTimerKey;
      switch (id) {
        case 1:
          newTimerKey = "1min";
          break;
        case 2:
          newTimerKey = "3min";
          break;
        case 3:
          newTimerKey = "5min";
          break;
        case 4:
          newTimerKey = "10min";
          break;
        default:
          newTimerKey = "1min";
      }
      // const mappedTimerType = timerTypeMap[newTimerKey]
      setSelectedTimer(newTimerKey);
      setActiveId(id);
      // //console.log("newTimerKey", newTimerKey);
    }
  };

  const textArray = [
    "We are excited to welcome you to King99, where you can enjoy a wide range of games. But that's not all - there are also plenty of bonuses waiting for you to claim! Join us now and start play your game with King99. Get ready for non-stop fun and rewards. Welcome aboard!  Stay tuned for more updates and promotions.",
    "24/7 Live support on King99 club ",
    "King99 club welcomes you here !!",
  ];

  const [index, setIndex] = useState(0);
  const [inProp, setInProp] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setInProp(false);

      setTimeout(() => {
        setIndex((oldIndex) => {
          return (oldIndex + 1) % textArray.length;
        });
        setInProp(true);
      }, 500); // This should be equal to the exit duration below
    }, 3000); // Duration between changing texts

    return () => clearInterval(timer);
  }, []);

  //   table
  //   const [value, setValue] = useState(0);

  const tabData = [
    { label: "Game History" },
    { label: "Chart" },
    { label: "My History" },
  ];

  //   const handleChange = (event, newValue) => {
  //     setValue(newValue);
  //   };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [totalSum, settotalSum] = useState("");
  const [betAmount, setBetAmount] = useState(1);
  const [bets, setBets] = useState([]);
  const [multiplier, setMultiplier] = useState(1);
  const [totalBet, setTotalBet] = useState(1);
  const [twoSameNumber, setTwoSameNumber] = useState(null);
  const [threeSameNumber, setThreeSameNumber] = useState(null);
  const [thirdNumber, setThirdNumber] = useState(null);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [betPeriodId, setBetPeriodId] = useState(null);

  const [open, setOpen] = useState(false);
  //   const [open1, setOpen1] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [gameResult, setGameResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState("");

  //   const handleClose = () => {
  //     setBetPlaced(false);
  //     setOpen(false);
  //   };

  // First, fix the history fetch function
  const fetchBetHistory = async () => {
    const timerType = timerTypeMap[selectedTimer] || "ONE_MINUTE_TIMER";
    try {
      const response = await axiosInstance.get(
        `${domain}/api/master-game/k3/bet-history`,
        {
          params: { timerType: timerType, page: betPage, limit: 10 },
          withCredentials: true,
        }
      );
  
      const betData = response.data.data.bets;
  
      // Filter resolved bets that belong to the user and haven't been processed
      const resolvedBets = betData.filter(
        (bet) =>
          bet.resultDice &&
          bet.resultDice.length > 0 &&
          userBets.includes(bet.periodId) &&
          !processedPeriodIds.has(bet.periodId)
      );
  
      // Group resolved bets by periodId
      const groupedBets = {};
      resolvedBets.forEach(bet => {
        if (!groupedBets[bet.periodId]) {
          groupedBets[bet.periodId] = [];
        }
        groupedBets[bet.periodId].push(bet);
      });
  
      // For each period, add only the most recent bet to the popup queue
      if (Object.keys(groupedBets).length > 0) {
        setPopupQueue(prevQueue => {
          const newQueue = [...prevQueue];
          
          Object.values(groupedBets).forEach(betsForPeriod => {
            // Sort bets by timestamp (most recent first)
            const sortedBets = betsForPeriod.sort((a, b) => 
              new Date(b.timestamp) - new Date(a.timestamp)
            );
            
            // Add only the most recent bet if it's not already in the queue
            const mostRecentBet = sortedBets[0];
            if (!newQueue.some(queuedBet => queuedBet.periodId === mostRecentBet.periodId)) {
              newQueue.push(mostRecentBet);
            }
          });
          
          return newQueue;
        });
  
        // Mark these period IDs as processed
        setProcessedPeriodIds(prevSet => {
          const newSet = new Set(prevSet);
          Object.keys(groupedBets).forEach(periodId => newSet.add(periodId));
          return newSet;
        });
  
        // Start processing the queue if it's not already running
        if (currentBetIndex === -1) {
          setCurrentBetIndex(0);
        }
      }
  
      setBets(betData);
      setBetTotalPage(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching K3 bet history:", error);
      setTimeout(async () => {
        try {
          const retryResponse = await axiosInstance.get(
            `${domain}/api/master-game/k3/bet-history`,
            {
              params: { timerType: timerType, page: betPage, limit: 10 },
              withCredentials: true,
            }
          );
          setBets(retryResponse.data.data.bets);
          setBetTotalPage(retryResponse.data.data.pagination.totalPages);
        } catch (retryError) {
          console.error("Retry failed:", retryError);
        }
      }, 1000);
    }
  };


  const getStyles = () => {
    if (selectedItem === "TOTAL_SUM") {
      if (totalSum % 2 === 0) {
        return { shape: "circle", bgcolor: "#17B15E" }; // Green for even
      } else {
        return { shape: "circle", bgcolor: "#D23838" }; // Red for odd
      }
    }
    //console.log("selected item = ", selectedItem)
    //console.log("totalSum item = ", totalSum)

    switch (selectedItem) {
      case "ALL_DIFFERENT":
        return { shape: "box", bgcolor: "#9B48DB" }; // Violet
      case "TWO_DIFFERENT":
        return { shape: "box", bgcolor: "#9B48DB" }; // Violet
      case "TWO_SAME_SPECIFIC":
        return { shape: "box", bgcolor: "#D23838" }; // Violet
      case "THREE_CONSECUTIVE":
        return { shape: "box", bgcolor: "#D23838" }; // Violet
      case "TWO_SAME":
        return { shape: "box", bgcolor: "#9B48DB" }; // Violet
      case "THREE_SAME":
        return { shape: "box", bgcolor: "#9B48DB" }; // Violet
      // case "TWO_DIFFERENT":
      //   return { shape: "box", bgcolor: "#D23838" }; // Red
      case "BIG_SMALL":
        return { shape: "box", bgcolor: totalSum === "Big" ? "#24ee89" : "#5088D3" }; // Orange for Big/Small
      case "ODD_EVEN":
        return { shape: "box", bgcolor: totalSum === "Odd" ? "#D23838" : "#17B15E" }; // Yellow for Odd/Even
      default:
        return { shape: "box", bgcolor: "gray" };
    }
  };
  const { shape, bgcolor } = getStyles();
  useEffect(() => {
    // Check if the timer just reached 0
    if (remainingTime === 0 || remainingTime === "00") {
      // Set a timeout for 3 seconds before fetching bet history
      const delayTimer = setTimeout(() => {
        fetchBetHistory();
      }, 3000);

      // Cleanup the timer if component unmounts
      return () => clearTimeout(delayTimer);
    }
  }, [remainingTime]);

  // Improved handleOpenDrawer function
  const handleOpenDrawer = (item, action) => {
    // //console.log("Received item:", item, action);

    if (action === "TWO_SAME") {
      let number;
      if (Array.isArray(item)) {
        number = item[0];
      } else if (
        typeof item === "string" &&
        item.includes("matching numbers")
      ) {
        const match = item.match(/^\d+/);
        number = match ? parseInt(match[0]) : null;
      } else {
        number = parseInt(item);
      }
      settotalSum(item)
      // //console.log("Extracted TWO_SAME number:", number);

      if (number !== null && !isNaN(number)) {
        setTwoSameNumber(item);
        // //console.log("[ITEM]------------>", item);
      } else {
        console.error("Failed to extract valid number from:", item);
          setPopupMessage("Invalid number selection");
        setIsPopupVisible(true);
        // Hide the popup after 2 seconds
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
      }
    } else if (action === "TWO_SAME_SPECIFIC") {
      if (Array.isArray(item) && item.length === 2) {
        setTwoSameNumber(parseInt(item[0]));
        setThirdNumber(parseInt(item[1]));
        settotalSum(item)
      } else {
        console.error("Invalid TWO_SAME_SPECIFIC input:", item);
        setPopupMessage("Invalid number selection");
        setIsPopupVisible(true);
        // Hide the popup after 2 seconds
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
      }
    } else if (action === "THREE_SAME") {
      // For specific three same number (like [1,1,1])
      if (Array.isArray(item)) {
        const sameNumber = parseInt(item[0]);
        setThreeSameNumber(sameNumber);
        setSelectedNumbers1(item); // Update UI selection state
        settotalSum(item);
      } else {
        console.error("Invalid THREE_SAME input:", item);
      setPopupMessage("Invalid number selection");
        setIsPopupVisible(true);
        // Hide the popup after 2 seconds
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
      }
    } else if (action === "THREE_SAME_RANDOM") {
      // For "Any 3 of the same number" option
      if (Array.isArray(item)) {
        const randomSameNumber = parseInt(item[0]);
        setThreeSameNumber(randomSameNumber);
        setSelectedNumbers1([]); // Clear UI selection for specific triples
        settotalSum(item);
      } else {
        console.error("Invalid THREE_SAME_RANDOM input:", item);
       setPopupMessage("Invalid number selection");
        setIsPopupVisible(true);
        // Hide the popup after 2 seconds
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
      }
    }else if (action === "ALL_DIFFERENT" || action === "TWO_DIFFERENT") {
      // Handle both ALL_DIFFERENT and TWO_DIFFERENT cases
      if (Array.isArray(item)) {
        // Use the array directly, don't need to convert strings to integers
        const numberArray = item.map((num) =>
          typeof num === "string" ? parseInt(num) : num
        );

        if (action === "ALL_DIFFERENT") {
          setSelectedNumbers1(numberArray);
        } else {
          setSelectedNumbers2(numberArray);
        }

        // Important: Update the selectedNumbers state as well for bet placement
        setSelectedNumbers(numberArray);
        settotalSum(item)
        // //console.log(
        //   `Selected ${action === "ALL_DIFFERENT" ? "three" : "two"
        //   } different numbers:`,
        //   numberArray
        // );
      } else if (typeof item === "string") {
        // Handle case where numbers come as space-separated string
        const numbers = item.split(/\s+|/).map((num) => parseInt(num));
        if (
          (action === "ALL_DIFFERENT" && numbers.length === 3) ||
          (action === "TWO_DIFFERENT" && numbers.length === 2)
        ) {
          if (action === "ALL_DIFFERENT") {
            setSelectedNumbers1(numbers);
          } else {
            setSelectedNumbers2(numbers);
          }

          // Important: Update the selectedNumbers state as well for bet placement
          setSelectedNumbers(numbers);
          // //console.log(
          //   `Selected ${
          //     action === "ALL_DIFFERENT" ? "three" : "two"
          //   } different numbers:`,
          //   numbers
          // );
        } else {
          console.error(`Invalid ${action} input:`, item);
          setPopupMessage(
            `Please select ${action === "ALL_DIFFERENT" ? "three" : "two"
            } different numbers`
          );
          setIsPopupVisible(true);
          // Hide the popup after 2 seconds
          setTimeout(() => {
            setIsPopupVisible(false);
          }, 2000);
          return;
        }
      } else {
        console.error(`Invalid ${action} input:`, item);
        setPopupMessage(
          `Please select ${action === "ALL_DIFFERENT" ? "three" : "two"
          } different numbers`
        );
        setIsPopupVisible(true);
        // Hide the popup after 2 seconds
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        return;
      }
    } else if (action === "THREE_CONTINUOUS") {
      if (Array.isArray(item) && item.length === 3) {
        // Use the provided continuous numbers
        setSelectedNumbers1(item);
        // Important: Update the selectedNumbers state as well for bet placement
        setSelectedNumbers(item);
        // //console.log("Selected continuous numbers:", item);
        settotalSum(item)
      } else {
        // Create a random continuous combination if none provided
        const continuousCombinations = [
          [1, 2, 3],
          [2, 3, 4],
          [3, 4, 5],
          [4, 5, 6],
        ];

        // Randomly select one combination
        const randomIndex = Math.floor(
          Math.random() * continuousCombinations.length
        );
        const selectedCombination = continuousCombinations[randomIndex];

        setSelectedNumbers1(selectedCombination);
        // Important: Update the selectedNumbers state as well for bet placement
        setSelectedNumbers(selectedCombination);
      }

      // Update the bet type
      setselectedItem("THREE_CONSECUTIVE");
    } else {
      settotalSum(item);
    }
    setDrawerOpen(true);
    setAgreed(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleBetAmount = (amount) => {
    setBetAmount(amount);
  };

  const handleMultiplier = (multiplier) => {
    setMultiplier(multiplier);
  };

  //   const handleTotalBet = () => {
  //     setTotalBet(betAmount * multiplier);
  //   };

  // const fetchUserData = async () => {
  //   try {
  //     const response = await axiosInstance.get(`${domain}/api/user/me`, {
  //       withCredentials: true,
  //     })
  //     // //console.log("User is----->",response.data.user)
  //     setAccountType(response.data.user.accountType)
  //     setUser(response.data.user)
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }

  // const handleRefresh = () => {
  //   // Handle refresh logic
  //   fetchUserData()
  // }

  // useEffect(() => {
  //   fetchUserData()
  // }, [])

  const handlePlaceBet = async () => {
    // //console.log("handlePlaceBet triggered");
    // //console.log("totalSum---->", totalSum);
    // //console.log("twoSameNumber---->", twoSameNumber);

    if (selectedItem === "TWO_SAME") {
      if (twoSameNumber === null || isNaN(twoSameNumber)) {
        setPopupMessage("Please select a valid number for Two Same bet");
        setIsPopupVisible(true);
        // Hide the popup after 2 seconds
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        return;
      }
    }
    const convertToTotalSumOption = (totalSum) => {
      // //console.log("Sum", totalSum);
      const sumEnum = {
        3: "THREE",
        4: "FOUR",
        5: "FIVE",
        6: "SIX",
        7: "SEVEN",
        8: "EIGHT",
        9: "NINE",
        10: "TEN",
        11: "ELEVEN",
        12: "TWELVE",
        13: "THIRTEEN",
        14: "FOURTEEN",
        15: "FIFTEEN",
        16: "SIXTEEN",
        17: "SEVENTEEN",
        18: "EIGHTEEN",
      };
      return sumEnum[totalSum];
    };

    const betData = {
      betType: selectedItem, // Ensure selectedItem matches BetType enum (e.g., "TOTAL_SUM")
      betAmount: betAmount,
      multiplier: multiplier,
      totalBet: totalBet,
      selectedTimer: timerTypeMap[selectedTimer] || selectedTimer,
      periodId: periodId,
      userType: userData.accountType,
    };
    // //console.log("Bet Data Prepared:", betData);

    if (selectedItem === "TWO_SAME") {
      betData.twoSameNumber = Number(twoSameNumber);
      // //console.log("Setting TWO_SAME bet with number:", betData.twoSameNumber);
    }

    switch (selectedItem) {
      case "TOTAL_SUM":
        betData.totalSum = convertToTotalSumOption(totalSum); // Convert numeric sum to enum string
        break;

      case "ODD_EVEN":
        betData.isOdd = isOdd; // Boolean from user selection
        break;

      case "BIG_SMALL":
        betData.isBig = isBig; // Boolean from user selection
        break;

      case "TWO_SAME":
        if (!twoSameNumber) {
         setPopupMessage("Please select a number for Two Same bet");
          setIsPopupVisible(true);
          // Hide the popup after 2 seconds
          setTimeout(() => {
            setIsPopupVisible(false);
          }, 2000);
          return;
        }
        betData.twoSameNumber = Number(twoSameNumber); // Ensure it's a number
        break;

      case "TWO_SAME_SPECIFIC":
        if (!twoSameNumber || !thirdNumber) {
          setPopupMessage("Please select both numbers for Two Same Specific bet");
          setIsPopupVisible(true);
          // Hide the popup after 2 seconds
          setTimeout(() => {
            setIsPopupVisible(false);
          }, 2000);
          return;
        }
        betData.twoSameNumber = Number(twoSameNumber);
        betData.thirdNumber = Number(thirdNumber);
        break;
        case "THREE_SAME":
          if (!threeSameNumber && threeSameNumber !== 0) {
            setPopupMessage("Please select a number for Three Same bet");
          setIsPopupVisible(true);
          // Hide the popup after 2 seconds
          setTimeout(() => {
            setIsPopupVisible(false);
          }, 2000);
            return;
          }
          betData.threeSameNumber = Number(threeSameNumber);
          break;
         
        case "THREE_SAME_RANDOM":
          // For "Any 3 of the same number" - we need to include the random number
          if (!threeSameNumber && threeSameNumber !== 0) {
            // If somehow threeSameNumber is not set, pick a random one
            const randomValue = Math.floor(Math.random() * 6) + 1;
            betData.threeSameNumber = randomValue;
          } else {
            betData.threeSameNumber = Number(threeSameNumber);
          }
          break;

      case "ALL_DIFFERENT":
        betData.selectedNumbers = selectedNumbers; // Array of numbers (e.g., [1, 2, 3])
        break;

      case "THREE_CONSECUTIVE":
        betData.selectedNumbers = selectedNumbers
        break;

      case "TWO_DIFFERENT":
        betData.selectedNumbers = selectedNumbers; // Array of two numbers (e.g., [1, 2])
        break;

      default:
        throw new Error("Invalid bet type coming please fix it");
    }
    // //console.log("SelectedItem Coming this", selectedItem);

    setLastAlertedPeriodId(betData.periodId);
    // //console.log("Last Alerted Period ID:", betData.periodId);
    setIsPlacingBet(true); // Enable loader

    try {
      const postResponse = await axiosInstance.post(
        `${domain}/api/master-game/k3/bet`,
        betData,
        {
          withCredentials: true,
        }
      );

      if (postResponse.data.success) {
        setPopupMessage("Bet placed successfully");
        setIsPopupVisible(true);
        // Hide the popup after 2 seconds
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        setUserBets((prevBets) => [...prevBets, periodId]); // Add periodId to userBets
      }

      try {
        fetchBetHistory();
        getWalletBalance()
        setUserBets((prevBets) => [...prevBets, periodId]);
      } catch (error) {
        console.error("Error fetching K3 history after bet placement:", error);
      }

      // Reset states after successful bet
      setBetPlaced(true);
      setBetPeriodId(periodId);
      handleCloseDrawer();
      fetchBetHistory();
      setError(null);
      setBetAmount(1);
      setMultiplier(1);
      setDisplayBetAmount(1);
      setCustomBetAmount("");
      setActiveBetAmount(1);
      // fetchUserData()
      // setOpenSnackbar(true);
    } catch (error) {
      console.error("Error placing bet:", error);
      const errorMessage =
        error.response.data.error.split(".") || "Unknown error occurred";
      setPopupMessage(`${errorMessage[0]}`);
      setIsPopupVisible(true);
      // Hide the popup after 2 seconds
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 2000);
      setDrawerOpen(false);
    } finally {
      setIsPlacingBet(false);
      fetchBetHistory();
    }
  };
  useEffect(() => {
    setDisplayBetAmount(betAmount * multiplier);
  }, [betAmount, multiplier]);

  const handleCancelBet = () => {
    settotalSum("");
    setBetAmount(1);
    setMultiplier(1);
    setTotalBet(1);
    setCustomBetAmount("");
    setActiveBetAmount(1);
    handleCloseDrawer();
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setTimeout(() => {
      setIsPopupVisible(false);
    }, 2000);
  };

  useEffect(() => {
    handleClick(images[0].id);
  }, []);

  // Inside your Head component

  //   const countdownSound = new Audio("/path/to/sound.mp3"); // Replace with your sound file path
  //   const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sdata, setSdata] = useState([]);
  const [sdata1, setSdata1] = useState([]);
  const [page, setPage] = useState(1);
  const [chartPage, setChartPage] = useState(1);
  const [betPage, setBetPage] = useState(1);
  const [gameTotalPage, setGameTotalPage] = useState(10);
  const [betTotalPage, setBetTotalPage] = useState(1);
  const [lastAlertedPeriodId, setLastAlertedPeriodId] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [filteredData1, setFilteredData1] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // const [user, setUser] = useState(null)
  const [winloss, setWinLoss] = useState(0);
  // const [popupperiod, setPopupPeriod] = useState(0)
  const [pop, setpop] = useState(0);
  const [popupperiodid, setPopupPeriodId] = useState("");
  const [popupTimer, setPopupTimer] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  // const [accountType, setAccountType] = useState("Normal")
  // Define refs outside useEffect
  const previousTimer = useRef(selectedTimer);
  const pendingBetsCache = useRef({});

  useEffect(() => {
    fetchBetHistory()
  }, [selectedTimer, periodId, domain, betPage])

  useEffect(() => {
    const fetchAndSortData = async () => {
      try {
        const timerType = timerTypeMap[selectedTimer] || "ONE_MINUTE_TIMER";
        // Use different page variables based on the active tab
        const currentPage = activeTab === 0 ? page : chartPage;

        const response = await axiosInstance.get(
          `${domain}/api/master-game/k3/history`,
          {
            params: { timerType: timerType, page: currentPage, limit: 10 },
            withCredentials: true,
          }
        );
        // Filter data based on selectedTimer
        // //console.log("Game history  ------->", response.data.data.history)
        const filtered = response.data.data.history;
        setGameTotalPage(response.data.data.pagination.totalPages);
        // Sort data by timestamp in descending order
        const sortedData = filtered.sort((a, b) => b.timestamp - a.timestamp);

        // Update states with sorted data
        if (activeTab === 0) {
          setHistoryData(sortedData);
        } else {
          setChartData(sortedData);
        }

        setSdata(sortedData);
        setSdata1(sortedData);
        setFilteredData(filtered);
        // setFilteredData1(sortedData);

        // //console.log("K3 game result fetched for timer:", selectedTimer);
      } catch (err) {
        console.error("Error fetching or processing data:", err);
      }
    };

    // Only fetch when selectedTimer changes or periodId changes
    if (periodId && periodId !== "Loading...") {
      // //console.log("Fetching K3 game result due to periodId change:", periodId);
      fetchAndSortData();
    }

    // No interval needed anymore since we're relying on periodId changes
    return () => {
      // Cleanup if needed
    };
  }, [selectedTimer, periodId, domain, page, chartPage, activeTab]); // Added periodId to dependencies

  const [res, setRes] = useState([]);
  const [lastPlayedTime, setLastPlayedTime] = useState(null);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const resultsArray = Array.isArray(res) ? res : []

  useEffect(() => {
    if (remainingTime >= "01" && remainingTime <= "05") {
      setOpenDialog(true);
      setDrawerOpen(false);
      if (isSoundOn && remainingTime !== lastPlayedTime) {
        countdownSound.play();
        setLastPlayedTime(remainingTime);
        setTimeout(() => {
          countdownSound.pause();
          countdownSound.currentTime = 0;
        }, 1000 - countdownSound.duration * 1000);
      }
    } else {
      setOpenDialog(false);
      if (isSoundOn) {
        countdownSound.pause();
        countdownSound.currentTime = 0;
        setLastPlayedTime(null);
      }
    }
    // //console.log("popupRemaningTime:", popupRemaningTime)
  }, [remainingTime, isSoundOn]);

  // Fetch bets and handle popups
  useEffect(() => {
    let isMounted = true;
    let fetchTimeout = null;

    const fetchBets = async (forceUpdate = false) => {
      if (!isMounted || userBets.length === 0) return; // Skip if no user bets
  
      const timerType = timerTypeMap[selectedTimer] || "ONE_MINUTE_TIMER";
      try {
        const response = await axiosInstance.get(
          `${domain}/api/master-game/k3/bet-history`,
          {
            params: { timerType: timerType, page: betPage, limit: 10 },
            withCredentials: true,
          }
        );
  
        if (!isMounted) return;
  
        const betsData = response.data.data.bets;
  
        // Filter for resolved bets with resultDice available and matching the user's periodId
        const resolvedBets = betsData.filter(
          (bet) =>
            bet.resultDice &&
            bet.resultDice.length > 0 &&
            userBets.includes(bet.periodId) &&
            !processedPeriodIds.has(bet.periodId) // Skip already processed bets
        );
  
        // Group resolved bets by periodId
        const groupedBets = {};
        resolvedBets.forEach(bet => {
          if (!groupedBets[bet.periodId]) {
            groupedBets[bet.periodId] = [];
          }
          groupedBets[bet.periodId].push(bet);
        });
  
        // Add only the most recent bet for each period to the popup queue
        if (Object.keys(groupedBets).length > 0) {
          setPopupQueue((prevQueue) => {
            const newQueue = [...prevQueue];
            
            Object.values(groupedBets).forEach(betsForPeriod => {
              // Sort bets by timestamp (most recent first)
              const sortedBets = betsForPeriod.sort((a, b) => 
                new Date(b.timestamp) - new Date(a.timestamp)
              );
              
              // Add only the most recent bet if it's not already in the queue
              const mostRecentBet = sortedBets[0];
              if (!newQueue.some(queuedBet => queuedBet.periodId === mostRecentBet.periodId)) {
                newQueue.push(mostRecentBet);
              }
            });
            
            return newQueue;
          });
  
          // Mark these periodIds as processed
          setProcessedPeriodIds((prevSet) => {
            const newSet = new Set(prevSet);
            Object.keys(groupedBets).forEach(periodId => newSet.add(periodId));
            return newSet;
          });
  
          // Start processing the queue if it's not already running
          if (currentBetIndex === -1) {
            setCurrentBetIndex(0);
          }
        }
  
        // Calculate next fetch time based on the earliest unresolved bet
        const nextFetchTime = calculateNextFetchTime(betsData);
  
        if (nextFetchTime) {
          const delay = Math.max(0, nextFetchTime - Date.now());
  
          // Schedule next fetch just before bet expiry
          fetchTimeout = setTimeout(() => {
            if (isMounted) fetchBets();
          }, delay);
        } else {
          // No pending bets, schedule next fetch in 60 seconds
          fetchTimeout = setTimeout(() => {
            if (isMounted) fetchBets();
          }, 60000);
        }
      } catch (err) {
        console.error("Error fetching K3 bet history:", err);
  
        // Retry after 5 seconds on error
        fetchTimeout = setTimeout(() => {
          if (isMounted) fetchBets();
        }, 5000);
      }
    };

    // Function to calculate next fetch time
    const calculateNextFetchTime = (betsData) => {
      if (!betsData || !betsData.length) return null;

      const currentTime = Date.now();
      const unresolvedBets = betsData.filter(
        (bet) =>
          (!bet.resultDice || bet.resultDice.length === 0) &&
          userBets.includes(bet.periodId)
      );

      if (!unresolvedBets.length) return null;

      // Calculate expiry times for all unresolved bets
      const expiryTimes = unresolvedBets.map((bet) => {
        const betTime = new Date(bet.timestamp).getTime();
        return betTime + parseInt(bet.selectedTimer) * 1000; // Assuming selectedTimer is in seconds
      });

      // Get the soonest expiry time
      return Math.min(...expiryTimes);
    };

    fetchBets();

    return () => {
      isMounted = false;
      if (fetchTimeout) clearTimeout(fetchTimeout);
    };
  }, [selectedTimer, betPage, periodId, userBets, processedPeriodIds]);

  // Handle popups
  useEffect(() => {
    const delay = setTimeout(() => {
      if (popupQueue.length > 0 && currentBetIndex < popupQueue.length) {
        const currentBet = popupQueue[currentBetIndex];
  
        if (!currentBet) {
          console.error("currentBet is undefined or null.");
          return;
        }
  
        const announceBetResult = async () => {
          setOpen(true);
          setRes(currentBet.resultDice);
          setpop(currentBet.betType);
          setPopupPeriodId(String(currentBet.periodId));
          setPopupTimer(currentBet.selectedTimer);
          setGameResult(currentBet.isWin);
          setDialogContent(currentBet.isWin ? "Bonus" : "You lost the bet");
          setWinLoss(currentBet.isWin ? currentBet.winAmount : currentBet.actualBetAmount);
        };
  
        announceBetResult();
  
        const timer = setTimeout(() => {
          setOpen(false);
          setTimeout(() => {
            setCurrentBetIndex((prevIndex) => prevIndex + 1);
          }, 1000);
        }, 2500);
  
        // Clean up the timer when component unmounts or dependencies change
        return () => clearTimeout(timer);
      } else if (popupQueue.length > 0 && currentBetIndex >= popupQueue.length) {
        setPopupQueue([]); // Clear the queue
        setCurrentBetIndex(-1); // Reset the index
      }
    }, 2000); // 2-second delay for the whole effect
         
    // Cleanup the delay timer itself
    return () => clearTimeout(delay);
  }, [popupQueue, currentBetIndex]);

  useEffect(() => {
    const cleanedUserBets = userBets.filter((periodId) => !processedPeriodIds.has(periodId));
    setUserBets(cleanedUserBets);
  }, [processedPeriodIds]);

  // const seconds1 = remainingTime ? (String(remainingTime).split(":")[1] || "00") : "00"
  // Now seconds1 will always be a string, either from the split or "00"
  // const length = seconds1.length

  const firstHalf = 0;
  const secondHalf = remainingTime;

  const [selectedColor, setSelectedColor] = useState(" RGB(71,129,255)");
  const handleEventSelection = (event) => {
    // ... your existing code ...

    switch (event) {
      case "Total":
        setSelectedColor("#67D99C"); // Half green, half red
        break;
      case "2 same":
        setSelectedColor("#e4b7ff");
        break;
      case "3 same":
        setSelectedColor("#ffafae");
        break;
      case "Different":
        setSelectedColor(" #9B48DB");
        break;
      default:
        setSelectedColor(" RGB(71,129,255)");
    }
  };

  const [activeButton, setActiveButton] = useState(1);
  const [activeBetAmount, setActiveBetAmount] = useState(1);
  const [customBetAmount, setCustomBetAmount] = useState("");
  const [displayBetAmount, setDisplayBetAmount] = useState(1);
  const handleCustomBetChange = (event) => {
    const betAmount = parseFloat(event.target.value);
    setCustomBetAmount(event.target.value);
    if (!isNaN(betAmount) && betAmount > 0) {
      handleBetAmount(betAmount);
      setActiveBetAmount(betAmount);
    }
  };
  const [values, setValues] = useState(0);
  const handleChanges = (event, newValue) => {
    setValues(newValue);
  };

  const navigateToPage = () => {
    navigate(-1);
  };

  //   const navigateToPage1 = () => {
  //     navigate("/recharge"); // Replace '/path-to-page' with the actual path
  //   };

  //   const navigateToPage2 = () => {
  //     navigate("/withdraw"); // Replace '/path-to-page' with the actual path
  //   };

  const renderTab1Content = () => {
    const redImage = "/assets/k3/redBall-fd34b99e.webp";
    const greenImage = "/assets/k3/greenBall-b7685130.webp";
    const images = [
      { src: redImage, label: "3", factor: "207.36X", color: "red" },
      { src: greenImage, label: "4", factor: "69.12X", color: "green" },
      { src: redImage, label: "5", factor: "34.56X", color: "red" },
      { src: greenImage, label: "6", factor: "20.74X", color: "green" },
      { src: redImage, label: "7", factor: "13.83X", color: "red" },
      { src: greenImage, label: "8", factor: "9.88X", color: "green" },
      { src: redImage, label: "9", factor: "8.3X", color: "red" },
      { src: greenImage, label: "10", factor: "7.68X", color: "green" },
      { src: redImage, label: "11", factor: "7.682X", color: "red" },
      { src: greenImage, label: "12", factor: "8.3X", color: "green" },
      { src: redImage, label: "13", factor: "9.88X", color: "red" },
      { src: greenImage, label: "14", factor: "13.83X", color: "green" },
      { src: redImage, label: "15", factor: "20.74X", color: "red" },
      { src: greenImage, label: "16", factor: "34.56X", color: "green" },
      { src: redImage, label: "17", factor: "69.12X", color: "red" },
      { src: greenImage, label: "18", factor: "207.36X", color: "green" },
    ];

    // Group images into rows of 4
    const rows = [];
    for (let i = 0; i < images.length; i += 4) {
      rows.push(images.slice(i, i + 4));
    }

    return (
      <Box sx={{ width: '100%', px: 0 }}>
        {/* Balls layout - 4 per row */}
        {rows.map((row, rowIndex) => (
          <Grid
            key={`row-${rowIndex}`}
            container
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            {row.map((image, index) => (
              <Grid
                item
                xs={3}
                key={`${rowIndex}-${index}`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Box
                  position="relative"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 50,
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    handleOpenDrawer(image.label, "TOTAL_SUM");
                    handleEventSelection("Total");
                    setselectedItem("TOTAL_SUM");
                  }}
                >
                  <Box
                    component="img"
                    src={image.color === "green" ? greenImage : redImage}
                    alt={`Ball ${image.label}`}
                    sx={{
                      width: 48,
                      height: 'auto'
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: image.color,
                      fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' },
                      fontWeight: "bold",
                    }}
                  >
                    {image.label}
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  fontSize={{ xs: 10, sm: 11, md: 12 }}
                  align="center"
                  color="#B3BEC1"
                // sx={{ mt: 0.5 }}
                >
                  {image.factor}
                </Typography>
              </Grid>
            ))}
          </Grid>
        ))}

        {/* Bottom buttons with consistent spacing */}
        <Box sx={{ mt: 1, ml: "5px" }}>
          <Grid
            container
            spacing={1}
            justifyContent="center"
            alignItems="center"
          >
            {[
              {
                label: "Big",
                multiplier: "1.92X",
                bgColor: "#24ee89",
                action: "BIG_SMALL",
              },
              {
                label: "Small",
                multiplier: "1.92X",
                bgColor: "#5088D3",
                action: "BIG_SMALL",
              },
              {
                label: "Odd",
                multiplier: "1.92X",
                bgColor: "#D23838",
                action: "ODD_EVEN",
              },
              {
                label: "Even",
                multiplier: "1.92X",
                bgColor: "#17B15E",
                action: "ODD_EVEN",
              },
            ].map((item, index) => (
              <Grid
                key={index}
                item
                xs={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 0.5
                }}
              >
                <Box
                  onClick={() => {
                    handleOpenDrawer(item.label, item.action);
                    handleEventSelection("Total");
                    setselectedItem(item.action);
                    if (item.label === "Small") {
                      setIsBig(false);
                    }
                    if (item.label === "Big") {
                      setIsBig(true);
                    }
                    if (item.label === "Odd") {
                      setIsOdd(true);
                    }
                    if (item.label === "Even") {
                      setIsOdd(false);
                    }
                  }}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
                    width: '100%',
                    backgroundColor: item.bgColor,
                    color: "white",
                    borderRadius: 1,
                    cursor: 'pointer',
                    p: 1
                  }}
                >
                  <Typography variant="body2" fontSize={"17px"}>
                    {item.label}
                  </Typography>
                  <Typography variant="caption" fontSize={"11px"} >
                    {item.multiplier}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    );
  };
  const renderTab2Content = () => {
    const handleTwoSameBetSelect = (value, action, betType) => {
      handleOpenDrawer(value, action);
      handleEventSelection("2 same");
      setselectedItem(action);
    };

    return (
      <K3TwoSame
        onBetSelect={handleTwoSameBetSelect}
        handleOpenDrawer={handleOpenDrawer}
        handleEventSelection={handleEventSelection}
        betPlaced={betPlaced}
      />
    );
  };

  const renderTab4Content = () => {
    return (
      <K3AllDifferent
        selectedNumbers1={selectedNumbers1}
        selectedNumbers2={selectedNumbers2}
        handleNumberClick={setSelectedNumbers1}
        handleNumberClick2={setSelectedNumbers2}
        handleOpenDrawer={handleOpenDrawer}
        handleEventSelection={handleEventSelection}
        setselectedItem={setselectedItem}
        drawerOpen={drawerOpen}
        handleCloseDrawer={handleCloseDrawer}
      />
    );
  };

  const diceOne = "/assets/k3/dice/num1.webp";
  const diceTwo = "/assets/k3/dice/num2.webp";
  const diceThree = "/assets/k3/dice/num3.webp";
  const diceFour = "/assets/k3/dice/num4.webp";
  const diceFive = "/assets/k3/dice/num5.webp";
  const diceSix = "/assets/k3/dice/num6.webp";

  // Array of dice face images
  const diceImages = [diceOne, diceTwo, diceThree, diceFour, diceFive, diceSix];
  const [rolling, setRolling] = useState(false);
  const [diceFaces, setDiceFaces] = useState([1, 1, 1]);
  const rollInterval = useRef(null);
  const [currentPeriodId, setCurrentPeriodId] = useState(null);

  const rollDice = () => {
    setRolling(true);
    if (rollInterval.current) {
      clearInterval(rollInterval.current);
    }

    rollInterval.current = setInterval(() => {
      setDiceFaces([
        Math.ceil(Math.random() * 6),
        Math.ceil(Math.random() * 6),
        Math.ceil(Math.random() * 6),
      ]);
    }, 50);

    setTimeout(() => {
      clearInterval(rollInterval.current);
      const latestData = filteredData[0];
      // //console.log("Latest dice outcome:", latestData?.diceValues);
      if (latestData?.diceValues) {
        setDiceFaces(latestData.diceValues);
      }
      setRolling(false);
    }, 1000);
  };

  useEffect(() => {
    if (filteredData.length > 0) {
      const latestPeriodId = filteredData[0].periodId;
      if (latestPeriodId !== currentPeriodId) {
        // //console.log("Period ID changed. New ID:", latestPeriodId);
        setCurrentPeriodId(latestPeriodId);
        rollDice();
      }
    }
  }, [filteredData]);

  useEffect(() => {
    if (remainingTime === "00:01") {
      rollDice();
    }
  }, [remainingTime]);



  const [selectedNumbers1, setSelectedNumbers1] = useState([]);
  const [selectedNumbers2, setSelectedNumbers2] = useState([]);

  // const handleNumberClick = (value) => {
  //   if (selectedNumbers1.length < 3) {
  //     setSelectedNumbers1([...selectedNumbers1, value]);
  //   } else {
  //     handleOpenDrawer(selectedNumbers1.join(""));
  //     handleEventSelection("Different");
  //     setselectedItem("ALL_DIFFERENT");
  //     setSelectedNumbers1([]);
  //   }
  // };

  // const handleNumberClick2 = (value) => {
  //   if (selectedNumbers2.length < 2) {
  //     setSelectedNumbers2([...selectedNumbers2, value]);
  //   } else {
  //     handleOpenDrawer(selectedNumbers2.join(""));
  //     handleEventSelection("Different");
  //     setselectedItem("threeDifferentNumbers");
  //     setSelectedNumbers2([]);
  //   }
  // };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const dice1 = "/assets/dice/num1.webp";
  const dice2 = "/assets/dice/num2.webp";
  const dice3 = "/assets/dice/num3.webp";
  const dice4 = "/assets/dice/num4.webp";
  const dice5 = "/assets/dice/num5.webp";
  const dice6 = "/assets/dice/num6.webp";

  const diceImg = [dice1, dice2, dice3, dice4, dice5, dice6];

  return (
    <>
      <Mobile>
        <div style={{ backgroundColor: "#232626" }}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1000,
              backgroundColor: "#232626",
              padding: "0px 16px",
              color: "white",
            }}
          >
            <Grid item xs={3} textAlign="left">
              <IconButton
                color="inherit"
                onClick={navigateToPage}
                sx={{ padding: 0 }}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: "18px" }} />
              </IconButton>
            </Grid>

            <Grid item xs={6} textAlign="center">
              <img
                src="/assets/logo/colorLogo.webp"
                alt="logo"
                style={{ width: "140px" }}
                onClick={() => navigate('/')}
              />
            </Grid>

            <Grid item xs={3} textAlign="right">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "10px", // Space between the images
                  mr: "12px",
                }}
              >
                <Box
                  onClick={() => navigate("/customer-service")}
                  component="img"
                  src="../assets/icons/customerCare.webp"
                  alt="Support Agent Icon"
                  sx={{ width: "25px", height: "25px", cursor: "pointer" }} // Cursor pointer for interactivity
                />
                {isSoundOn && (
                  <Box
                    component="img"
                    src="../assets/icons/sound.webp"
                    alt="Sound Icon"
                    onClick={() => setIsSoundOn(!isSoundOn)} // Toggle state to hide the icon
                    sx={{ width: "25px", height: "25px", cursor: "pointer" }} // Cursor pointer for interactivity
                  />
                )}
                {!isSoundOn && (
                  <Box
                    component="img"
                    src="../assets/icons/soundMute.webp"
                    onClick={() => setIsSoundOn(!isSoundOn)} // Toggle state to show the icon
                    sx={{ width: "25px", height: "25px", cursor: "pointer" }}
                  />
                )}
              </Box>
              {/* <IconButton style={{ color: "white" }}>
                           <SupportAgentIcon />
                         </IconButton>
           
                         <IconButton
                           style={{ color: "white" }}
                           onClick={() => setIsSoundOn(!isSoundOn)}
                         >
                           {isSoundOn ? <MusicNoteIcon /> : <MusicOffIcon />}
                         </IconButton> */}
            </Grid>
          </Grid>

          <GameWalletCard />

          <Grid
            container
            spacing={1}
            sx={{
              marginLeft: "auto",
              marginRight: "auto",
              // maxWidth: "95%",
              width: "calc(100% - 28px)",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              marginTop: "-65px",
              backgroundColor: "#3a4142",
              borderRadius: "10px",
              color: "#B3BEC1",
            }}
          >
            {images.map((image) => (
              <Grid
                item
                xs={3}
                key={image.id}
                onClick={() => handleTimerChange(image.id, image.subtitle)}
                style={{
                  cursor: "pointer",
                  background:
                    activeId === image.id
                      ? "linear-gradient(90deg,#24ee89,#9fe871)"
                      : "transparent",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center", // Align items horizontally
                  justifyContent: "center", // Align items vertically
                  padding: "6px 0px",
                }}
              >
                <img
                  src={activeId === image.id ? image.altSrc : image.src}
                  alt={image.subtitle}
                  style={{ width: "55%" }}
                />
                <div
                  style={{
                    textAlign: "center",
                    color: activeId === image.id ? "#323738" : "#B3BEC1",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    style={{
                      fontSize: "0.75rem",
                      lineHeight: "1",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    K3 Lottrey
                  </Typography>
                  <Typography
                    variant="caption"
                    style={{
                      fontSize: "0.75rem",
                      lineHeight: "1.5",
                      marginBottom: "2px",
                    }}
                  >
                    {image.subtitle}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>

          <Box
            mt={2}
            sx={{
              marginLeft: "auto",
              marginRight: "auto",
              // maxWidth: "90%",
              width: "calc(100% - 44px)",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              p: "16px 8px 8px 8px",
              backgroundColor: "#323738",
              borderRadius: "10px",
            }}
          >
            <Grid container spacing={0} alignItems="center">
              <Grid item xs={2} textAlign={"left"}>
                <Typography
                  variant="body1"
                  color="#B3BEC1"
                  sx={{ fontSize: "0.8rem" }}
                >
                  Period
                </Typography>
              </Grid>
              <Grid item xs={5} textAlign={"left"}>
                <Button
                  variant="outlined"
                  sx={{
                    border: "1px solid #24ee89",
                    borderRadius: "15px",
                    padding: "1.5px 17px",
                    fontSize: "11.7px",
                    textTransform: "initial",
                    display: "inline-flex", // Use inline-flex to align items in a line
                    alignItems: "center", // Center items vertically
                    gap: "3px",
                    color: "#24ee89",
                  }}
                  // startIcon={<NoteIcon sx={{ color: "#24ee89" }} />}
                  onClick={handleOpenPopup}
                >
                  <img src="/assets/k3/howtoplay.svg" alt="" width="12px" />
                  How to play
                </Button>
                <K3Htp isOpen={isPopupOpen} onClose={handleClosePopup} />
              </Grid>
              <Grid
                item
                xs={5}
                sx={{ paddingLeft: "10px", textAlign: "right" }}
              >
                <Typography
                  variant="body5"
                  color="#B3BEC1"
                  sx={{ fontSize: "12px" }}
                >
                  Time Remaining
                </Typography>
              </Grid>
            </Grid>
            {/* <Grid item xs={8}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  textAlign: "left",
                  pl: "5%",
                }}
              >
                {periodId ? periodId : ""}
              </Typography>
            </Grid> */}
            <CountdownTimer
              setPeriodId={setPeriodId}
              periodId={periodId}
              selectedTimer={selectedTimer}
              remainingTime={remainingTime}
              setRemainingTime={setRemainingTime}
              gameType="k3"
            />

            <>
              <div className="fullbox">
                <div id="leftbox"></div>
                <div className="outerbox">
                  <div className="diebox">
                    <div className="dice-container">
                      {diceFaces.map((face, index) => (
                        <div key={index} className="dice-wrapper">
                          <div className="diceImg">
                            <img
                              src={diceImages[face - 1]}
                              alt={`Dice ${index + 1}`}
                              className={`dice-image ${rolling ? "rolling" : ""}`}
                            /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div id="rightbox"></div>
              </div>
            </>
            <Box
              mt={1}
              sx={{
                position: "relative",
                pointerEvents: openDialog ? "none" : "auto",
              }}
            >
              <div
                className="overlay"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "15px",
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  zIndex: 100,
                  display: openDialog ? "inline-block" : "none",
                  cursor: "not-allowed",
                }}
              ></div>

              <div
                style={{
                  //   display: "flex",
                  width: "300px",
                  height: "200px",
                  display: openDialog ? "flex" : "none",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  color: "#24ee89",
                  fontWeight: "bold",
                  textAlign: "center",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 900,
                }}
              >
                <div style={{ display: "flex", gap: "10px" }}>
                  <p
                    style={{
                      textAlign: "center",
                      paddingLeft: "20px",
                      borderRadius: "20px",
                      fontSize: "130px",
                      paddingRight: "20px",
                      backgroundColor: "#323738",
                    }}
                  >
                    {firstHalf}
                  </p>
                  <p
                    style={{
                      textAlign: "center",
                      paddingLeft: "20px",
                      borderRadius: "20px",
                      fontSize: "130px",
                      paddingRight: "20px",
                      backgroundColor: "#323738",
                    }}
                  >
                    {secondHalf}
                  </p>
                </div>
              </div>
              <Box mt={1}>
                <Tabs
                  value={values}
                  onChange={handleChanges}
                  TabIndicatorProps={{ style: { display: "none" } }}
                  variant="fullWidth"
                  style={{
                    marginBottom: "10px",
                    paddingTop: "10px",
                  }}
                >
                  <Tab
                    label="Total"
                    style={{
                      background: values === 0 ? "#24ee89" : "#3a4142",
                      color: values === 0 ? "#323738" : "#B3BEC1",
                      borderBottom: values === 0 ? "none" : "",
                      borderRadius: "5px 5px 0px 0px",
                      minWidth: "auto",
                      marginRight: "5px",
                      fontSize: "12px", // Space between tabs
                      textTransform: "none",
                      minHeight: "42px", // Apply here again
                      //                  "&.MuiTab-root": {
                      //   minHeight: "42px", // Ensure proper targeting
                      // },
                    }}
                  />
                  <Tab
                    label="2 same"
                    style={{
                      backgroundColor:
                        values === 1 ? "#24ee89" : "#3a4142",
                      color: values === 1 ? "#323738" : "grey",
                      borderBottom: values === 1 ? "none" : "",
                      borderRadius: "5px 5px 0px 0px",
                      minWidth: "auto",
                      marginRight: "5px",
                      fontSize: "12px", // Space between tabs
                      textTransform: "none",
                    }}
                  />
                  <Tab
                    label="3 same"
                    style={{
                      backgroundColor:
                        values === 2 ? "#24ee89" : "#3a4142",
                      color: values === 2 ? "#323738" : "grey",
                      borderBottom: values === 2 ? "none" : "",
                      borderRadius: "5px 5px 0px 0px",
                      minWidth: "auto",
                      marginRight: "5px",
                      fontSize: "12px", // Space between tabs
                      textTransform: "none",
                    }}
                  />
                  <Tab
                    label="Different"
                    style={{
                      backgroundColor:
                        values === 3 ? "#24ee89" : "#3a4142",
                      color: values === 3 ? "#323738" : "grey",
                      borderBottom: values === 3 ? "none" : "",
                      borderRadius: "5px 5px 0px 0px",
                      minWidth: "auto",
                      fontSize: "12px",
                      textTransform: "none",
                    }}
                  />
                </Tabs>
              </Box>
              <Box sx={{ mt: 2 }}>
                {values === 0 && renderTab1Content()}
                {values === 1 && renderTab2Content()}
                {values === 2 && (
                  <K3ThreeSame
                    selectedNumbers1={selectedNumbers1}
                    handleOpenDrawer={handleOpenDrawer}
                    handleEventSelection={handleEventSelection}
                    setselectedItem={setselectedItem}
                  />
                )}
                {values === 3 && renderTab4Content()}
              </Box>
            </Box>
          </Box>

          <Drawer
            anchor="bottom"
            open={drawerOpen}
            onClose={handleCloseDrawer}
            sx={{
              "& .MuiDrawer-paper": {
                width: "100%",
                height: "auto",
                margin: "0 auto",
                maxWidth: isSmallScreen ? "600px" : "396px",
                backgroundColor: "white",
                color: "#ffffff",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              },
            }}
          >
            <Grid
              container
              alignItems="center"
              style={{
                position: "relative",
                color: "#ffffff",
                backgroundColor: "#323738",
              }}
            >
              <Grid
                item
                xs={12}
                align="center"
                style={{
                  // position: "relative",
                  // marginBottom: "-5px",
                  height: "40px",
                  color: "#ffffff",
                  backgroundColor: "#323738",
                  paddingTop: "10px",
                  paddingLeft: 9,
                  textAlign: "left",
                }}
              >
                {/* <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "80%",
                    background: selectedColor,
                    clipPath: "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)",
                  }}
                > */}
                {selectedItem === "TOTAL_SUM"
                  ? "Total"
                  : selectedItem === "ALL_DIFFERENT"
                    ? "Different"
                    : selectedItem === "THREE_CONSECUTIVE"
                      ? "Different"
                      : selectedItem === "TWO_DIFFERENT"
                        ? "Different"
                        : selectedItem === "BIG_SMALL"
                          ? "Total"
                          : selectedItem === "ODD_EVEN"
                            ? "Total"
                            : selectedItem === "TWO_SAME"
                              ? "2 Same"
                              : selectedItem === "TWO_SAME_SPECIFIC"
                                ? "2 Same"
                                : selectedItem === "THREE_SAME"
                                  ? "3 Same"
                                  : selectedItem === "THREE_SAME_RANDOM"
                                    ? "3 Same"
                                    : "3 Same"}:


                {selectedItem === "TWO_DIFFERENT" && totalSum?.toString().length > 0 ? (
                  <Box sx={{ display: "flex", gap: "5px", justifyContent: "left", mt: 0.8 }}>
                    {totalSum
                      .toString()
                      .split(",")
                      .map((digit, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "4px",
                            backgroundColor: "#9B48DB", // Alternate colors
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="h8" sx={{ color: "white" }}>{digit}</Typography>
                        </Box>
                      ))}
                  </Box>
                ) : selectedItem === "ALL_DIFFERENT" && totalSum?.toString().length > 0 ? (
                  <Box sx={{ display: "flex", gap: "5px", justifyContent: "left", mt: 0.8 }}>
                    {totalSum
                      .toString()
                      .split(",")
                      .map((digit, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "4px",
                            backgroundColor: "#9B48DB", // Alternate colors
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="h8" sx={{ color: "white" }}>{digit}</Typography>
                        </Box>
                      ))}
                  </Box>
                ) : selectedItem === "TWO_SAME_SPECIFIC" && totalSum?.toString().length >= 2 ? (
                  <Box sx={{ display: "flex", gap: "10px", justifyContent: "left", mt: 0.8 }}>
                    {(() => {
                      const sumStr = totalSum.toString();
                      const firstNum = sumStr[0];
                      const secondNum = sumStr[2];

                      return (
                        <>
                          {/* First Box */}
                          <Box
                            sx={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "4px",
                              backgroundColor: "#D23838", // Change to your desired color
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              textAlign: "left",
                              // p: "6px"
                            }}
                          >
                            <Typography variant="h8" sx={{ color: "white" }}>{firstNum}</Typography>
                          </Box>

                          {/* Second Box */}
                          <Box
                            sx={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "4px",
                              backgroundColor: "#17B15E", // Change to your desired color
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              textAlign: "left",
                              // p: "6px"
                            }}
                          >
                            <Typography variant="h8" sx={{ color: "white" }}>{secondNum}</Typography>
                          </Box>
                        </>
                      );
                    })()}
                  </Box>
                ) : (<Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: selectedItem === "THREE_CONSECUTIVE" ? "40%" : shape === "circle" ? 15 : "30px",
                    height: shape === "circle" ? 15 : "30px",
                    borderRadius: shape === "circle" ? "50%" : "4px",
                    backgroundColor: bgcolor,
                    padding: shape === "circle" ? "8px" : selectedItem === "BIG_SMALL" || "EVEN_ODD" ? "0 6px" : "0px",
                    textAlign: "left",
                    mt: 0.8
                  }}
                >

                  <Typography variant="h8" sx={{ color: "white", fontSize: "13px" }}>
                    {selectedItem === "THREE_CONSECUTIVE" ? "3 Consecutive Numbers" : totalSum}
                    {/* {totalSum} */}
                  </Typography>
                </Box>
                )}
              </Grid>
              <Grid padding={1} marginTop={3}>
                <Grid item xs={12}>
                  <Grid container justifyContent="space-between" alignItems={"center"}>
                    <Typography
                      variant="h6"
                      sx={{ color: "#ffffff", fontSize: isSmallScreen2 ? "15px" : "17px", }}
                    >
                      Balance
                    </Typography>
                    <Grid sx={{ display: "flex", jusitfyContent: "space-between", gap: "10px" }}>
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor:
                            activeBetAmount === 1 ? "#24ee89" : "#3a4142",
                          color: activeBetAmount === 1 ? "#ffffff" : "#B3BEC1",
                          minWidth: "30px",
                          padding: "2px 6px",
                          fontSize: "17px"
                        }}
                        onClick={() => {
                          handleBetAmount(1);
                          setActiveBetAmount(1);
                        }}
                      >
                        {"₹1"}
                      </Button>
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor:
                            activeBetAmount === 10 ? "#24ee89" : "#3a4142",
                          color: activeBetAmount === 10 ? "#ffffff" : "#B3BEC1",
                          minWidth: "30px",
                          padding: "2px 6px",
                          fontSize: "17px"
                        }}
                        onClick={() => {
                          handleBetAmount(10);
                          setActiveBetAmount(10);
                        }}
                      >
                        {"₹10"}
                      </Button>
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor:
                            activeBetAmount === 100 ? "#24ee89" : "#3a4142",
                          color: activeBetAmount === 100 ? "#ffffff" : "#B3BEC1",
                          minWidth: "30px",
                          padding: "2px 6px",
                          fontSize: "17px"
                        }}
                        onClick={() => {
                          handleBetAmount(100);
                          setActiveBetAmount(100);
                        }}
                      >
                        {"₹100"}
                      </Button>
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor:
                            activeBetAmount === 1000 ? "#24ee89" : "#3a4142",
                          color: activeBetAmount === 1000 ? "#ffffff" : "#B3BEC1",
                          minWidth: "30px",
                          padding: "2px 6px",
                          fontSize: "17px"
                        }}
                        onClick={() => {
                          handleBetAmount(1000);
                          setActiveBetAmount(1000);
                        }}
                      >
                        {"₹1000"}
                      </Button></Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Grid container>
                    <Grid
                      item
                      container
                      direction="row"
                      justifyContent="space-between"
                      align="center"
                      alignItems="center"
                      sx={{ color: "#ffffff", flexWrap: "nowrap" }}
                    >
                      <Typography variant="h6" sx={{ fontSize: isSmallScreen2 ? "15px" : "17px", display: "flex", justifyContent: "flex-start" }}>
                        Add your money
                      </Typography>
                      <Grid item xs="auto" display="flex" justifyContent="flex-end">
                        <TextField
                          placeholder="Add Custom Amount"
                          variant="outlined"
                          value={customBetAmount}
                          onChange={handleCustomBetChange}
                          type="number"
                          sx={{
                            width: isSmallScreen2 ? "80%" : "100%",
                            "& .MuiOutlinedInput-root": {

                              "& fieldset": {
                                border: "1px solid grey", // Normal grey border
                              },
                              "&:hover fieldset": {
                                border: "1px solid grey", // Removes hover effect
                              },
                              "&.Mui-focused fieldset": {
                                border: "1px solid grey", // Removes focus effect
                              },
                            },
                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                              WebkitAppearance: "none",
                              margin: 0,
                            },
                          }}
                          style={{
                            borderRadius: 15,
                            height: isSmallScreen2 ? 25 : 30,
                            backgroundColor: "#232626",
                            color: "#ffffff",
                          }}
                          InputProps={{
                            style: {
                              color: "#ffffff",
                              borderRadius: 15,
                              height: isSmallScreen2 ? 25 : 30,
                              border: "none",
                              fontSize: isSmallScreen2 ? "15px" : "17px",
                            },
                          }}
                          InputLabelProps={{
                            style: { color: "#B3BEC1", fontSize: isSmallScreen2 ? "8px" : "12px", },
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item
                      container
                      direction="row"
                      justifyContent="space-between"
                      align="center"
                      alignItems="center"
                      sx={{ color: "#ffffff" }}>
                      <Typography
                        variant="h6"
                        sx={{ color: "#ffffff", fontSize: isSmallScreen2 ? "15px" : "17px" }}
                      >
                        Quantity
                      </Typography>
                      <Grid
                        item
                        container
                        xs="auto"
                        justifyContent="flex-end"
                        alignItems="center"
                        spacing={1}
                      >
                        <Grid item>
                          <IconButton
                            onClick={() =>
                              setMultiplier(multiplier > 1 ? multiplier - 1 : 1)
                            }
                            sx={{
                              color: "#ffffff",
                              padding: "4px",
                            }}
                          >
                            <RemoveIcon
                              fontSize="small"
                              sx={{
                                color: "#24ee89",
                                fontSize: 38,
                              }}
                            />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="body1"
                            sx={{
                              // border: `1px solid #3a4142`,
                              borderRadius: "4px",
                              padding: "4px 12px",
                              backgroundColor: "#232626",
                              color: "white",
                              minWidth: "55px",
                              textAlign: "center",
                            }}
                          >
                            {multiplier}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <IconButton
                            onClick={() => setMultiplier(multiplier + 1)}
                            sx={{
                              color: "#ffffff",
                              padding: "4px",
                            }}
                          >
                            <AddIcon
                              fontSize="small"
                              sx={{
                                color: "#24ee89",
                                fontSize: 38,
                              }}
                            />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Grid
                    container
                    justifyContent="flex-end"
                    sx={{ color: "#ffffff" }}
                  >
                    {[1, 5, 10, 20, 50, 100].map((value) => (
                      <div
                        key={value}
                        className={`button ${activeButton === value ? "active" : ""
                          }`}
                        onClick={() => {
                          handleMultiplier(value);
                          setActiveButton(value);
                        }}
                        style={{
                          padding: "5px 8px",
                          borderRadius: "5px",
                          margin: "5px",
                          ...(activeButton === value
                            ? { backgroundColor: "#24ee89", color: "#ffffff" }
                            : { backgroundColor: "#3a4142", color: "#B3BEC1" }),
                        }}
                      >
                        X{value}
                      </div>
                    ))}
                  </Grid>
                  <Typography sx={{ alignItems: "center", display: "flex", mt: 1.5 }}>
                  <Checkbox
                      checked={agreed}
                      onClick={handleToggle} // Handle both check and uncheck
                      icon={
                        <RadioButtonUncheckedIcon
                          sx={{
                            color: "#c8c9cc", // Unchecked color
                            fontSize: 22, // Adjust size
                          }}
                        />
                      }
                      checkedIcon={
                        <CheckCircleIcon
                          sx={{
                            color: "#24ee89 ", // Checked color
                            fontSize: 22, // Slightly bigger for effect
                          }}
                        />
                      }
                    />
                    <span style={{ marginLeft: 8, fontSize: "13px" ,color:"#B3BEC1"}}>
                      I agree
                    </span>
                    <span
                      style={{
                        marginLeft: 8,
                        color: "#D23838",
                        fontSize: "13px",
                      }}
                    >
                      《Pre-sale rules》
                    </span>
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} >
                <Grid container justifyContent="space-around" spacing={0}>
                  <Grid item xs={3}>
                    <Button
                      onClick={handleCancelBet}
                      fullWidth
                      style={{
                        backgroundColor: "#3a4142",
                        color: "#B3BEC1",
                        textTransform: "none",
                        borderRadius: "0px",
                        height:"50px"
                      }}
                      variant="contained"
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={9}>
                    <Button
                      onClick={handlePlaceBet}
                      fullWidth
                      disabled={!agreed}
                      style={{
                        background: "#24ee89",
                        color: "#232626",
                        textTransform: "none",
                        borderRadius: "0px", height:"50px"
                      }}
                      variant="contained"
                    >{`Total amount: ₹${displayBetAmount.toFixed(2)}`}</Button>
                  </Grid>
                </Grid>
              </Grid>

              {/*<>
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    background: "rgba(0, 0, 0, 0.8)",
                  }}
                  open={isPlacingBet}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "120px",
                      height: "120px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress
                      size={120}
                      sx={{
                        position: "absolute",
                        color: "#F5B73B ",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        width: "100%",
                        height: "100%",
                        padding: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "#fff",
                        }}
                      >
                        Placing Bet
                      </span>
                    </div>
                  </div>
                </Backdrop>
              </>*/}
            </Grid>
          </Drawer>
           <div>
            {/* bet placed alert */}
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

                  // Flexbox for centering content
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
          {/* <Snackbar
            open={openSnackbar}
            autoHideDuration={1000}
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
              severity="success"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }}
            >
              {errorMessage}
            </MuiAlert>
          </Snackbar> */}

          <Grid mt={1.5} sx={{ marginBottom: "20px" }}>
            <Box
              sx={{
                width: "calc(100% - 28px)",
                // maxWidth: "95%",
                margin: "0 auto",
              }}
            >
              <Grid container spacing={1} sx={{ mb: 1.5 }}>
                {tabData.map((tab, index) => (
                  <Grid item xs={4} key={index}>
                    <Box
                      onClick={() => setActiveTab(index)}
                      sx={{
                        height: "40px",
                        background:
                          activeTab === index
                            ? "linear-gradient(90deg,#24ee89,#9fe871)"
                            : "#323738",
                        color: activeTab === index ? "#323738" : "#B3BEC1",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        // "&:hover": {
                        //   backgroundColor:
                        //     activeTab === index ? "#24ee89" : "#f5f5f5",
                        // },
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: "12px", sm: "15px" },
                          textTransform: "none",
                          fontWeight: activeTab === index ? "bold" : "none",
                        }}
                      >
                        {tab.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 1 }}>
                {activeTab === 0 && (
                  <TabPanel>
                    <K3GameHistory
                      data={historyData}
                      page={page}
                      setPage={setPage}
                      totalPage={gameTotalPage}
                    />
                  </TabPanel>
                )}
                {activeTab === 1 && (
                  <TabPanel>
                    <K3Charts data={chartData} page={chartPage}
                      setPage={setChartPage}
                      totalPage={gameTotalPage} />
                  </TabPanel>
                )}
                {activeTab === 2 && (
                  <TabPanel>
                    <K3MyHistory bets={bets} page={betPage}
                      setPage={setBetPage}
                      totalPage={betTotalPage} />
                  </TabPanel>
                )}
              </Box>
            </Box>
          </Grid>
          <>{/* ...rest of the code... */}</>

               <div
            style={{
              display: show ? (open ? "flex" : "none") : "flex",
              // display: "flex",
              position: "absolute", // changed from fixed to absolute
              zIndex: 1,
              // left: isSmall ? 20 : 10,
              top: "0px",
              jusitfyContent: "center",
              alignItems: "center",
              width: isSmall ? "100%" : "calc(100% - 50px)",
              height: "100%",
              overflow: "auto",
              border: "none",
              backgroundColor: "rgba(0, 0, 0, 0.5)"
            }}
          >
            <div
              style={{
                backgroundColor: "transparent",
                margin: "5% 15px",
                // padding: 20,
                width: "100%",
                height: "65%",
                backgroundImage: `url(${res.length > 0
                  ? gameResult
                    ? "/assets/icons/images/popup-win.webp"
                    : "/assets/icons/images/popup-loss.webp"
                  : "/assets/icons/images/popup-pending.png"
                  })`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                // padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative"
              }}
            >
              <Typography
                variant="h4"
                style={{
                  color: gameResult ? "white" : "#7c9dc2",
                  textAlign: "center",
                  fontWeight: "bold",
                  // position: "absolute",
                  marginTop: "6rem",
                  fontSize: gameResult ?window.innerWidth <= 370 ?"1.7rem":"2.1rem":"2.1rem",
                }}
              >
                {res.length > 0
                  ? gameResult
                    ? "Congratulations"
                    : "Sorry"
                  : "Pending"}
              </Typography>
              <Typography
                variant="h6"
                style={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  // position: "absolute",
                  marginTop: "0.5rem",
                  color: gameResult ? "white" : "#7c9dc2",
                  gap: 5
                }}
              >
                {/* Lottery results {Array.isArray(res) ? res.join(", ") : res} */}
                Lottery results
                {resultsArray.map((num, index) => (
                  <img
                    key={index}
                    src={`/assets/k3/dice/dice${num}.webp`}
                    alt={`dice${num}`}
                    style={{ width: "25px", height: "25px", borderRadius: "5px", boxShadow: `2px 2px 5px rgba(0, 0, 0, 0.4)` }}
                  />
                ))}
              </Typography>

              <Typography
                sx={{
                  mt: 6,
                  mb: 1,
                  fontWeight: "bold",
                }}
                variant="body1"
                color="text.secondary"
              >
                {dialogContent}
                <br />
                <span
                  style={{ color: gameResult ? "green" : "red", fontSize: "18px" }}
                >
                  {gameResult ? `+₹` + parseFloat(winloss).toFixed(2) : `-₹` + parseFloat(winloss).toFixed(2)}
                </span>
                <br />
                <span style={{ fontSize: "14px" }}>
                  Period: {popupperiodid}
                </span>
              </Typography>
              <Typography sx={{ color: gameResult ? "white" : "#7c9dc2", mt: 3, display: "flex", alignItems: "center", flexDirection: "row" }}>
                <Checkbox
                  checked={show}
                  onClick={handleToggle2} // Handle both check and uncheck
                  icon={
                    <RadioButtonUncheckedIcon
                      sx={{
                        color: gameResult ? "white" : "#7c9dc2", // Unchecked color
                        fontSize: 22, // Adjust size

                      }}
                    />
                  }
                  checkedIcon={
                    <CheckCircleIcon
                      sx={{
                        color: gameResult ? "white" : "#7c9dc2", // Checked color
                        fontSize: 22, // Slightly bigger for effect

                        borderRadius: "50px"
                      }}
                    />
                  }
                />
                After 3 seconds auto close
              </Typography>
              {/* <Button
                sx={{
                  marginTop: isSmall ? "350px" : "370px",
                  marginLeft: "50px",
                  marginRight: "50px",
                  position: "absolute",
                }}
                onClick={() => setOpen(false)}
              >
                Close
              </Button> */}
              <IconButton onClick={() => setOpen(false)} sx={{ position: "absolute", bottom: -60 }}>
                <CancelOutlinedIcon
                  sx={{ color: "white", fontSize: "45px" }}
                />
              </IconButton>
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
      </Mobile>
    </>
  );
};

export default K3Page;