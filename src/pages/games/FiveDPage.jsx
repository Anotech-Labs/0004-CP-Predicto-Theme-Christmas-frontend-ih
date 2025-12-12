import React, { useState, useEffect, useRef, useCallback } from "react"
import IconButton from "@mui/material/IconButton"
import Mobile from "../../components/layout/Mobile"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Drawer from "@mui/material/Drawer"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Table from "@mui/material/Table"
import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import TableBody from "@mui/material/TableBody"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import NoteIcon from "@mui/icons-material/Note"
import { useNavigate } from "react-router-dom"
import Chart5D from "../../components/games/fiveD/FiveDChart.jsx"
import axios from "axios"
import "../../components/games/fiveD/spinner.css";
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import GameHistory from "../../components/games/fiveD/GameHistory"
import FiveDMyHistory from "../../components/games/fiveD/FiveDMyHistory.jsx"
import Snackbar from "@mui/material/Snackbar"
import MuiAlert from "@mui/material/Alert"
import { Pagination, styled } from "@mui/material"
import { domain, wssdomain } from "../../utils/Secret"

import FiveDHtp from "../../components/games/fiveD/FiveDHtp"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material/styles"
import boxa from "../../assets/fived/boxa.webp"
import boxb from "../../assets/fived/boxb.webp"
import boxc from "../../assets/fived/boxc.webp"
import boxd from "../../assets/fived/boxd.webp"
import boxe from "../../assets/fived/boxe.webp"
import boxsum from "../../assets/fived/boxsum.webp"
import RemoveIcon from "@mui/icons-material/IndeterminateCheckBox"
import AddIcon from "@mui/icons-material/AddBox"
import CircularProgress from "@mui/material/CircularProgress"
import Backdrop from "@mui/material/Backdrop"
import GameWalletCard from "../../components/games/common/GameWalletCard"
import CountdownTimer from "../../components/games/common/CountdownTimer"
import { useAuth } from "../../context/AuthContext";

const countdownSound = new Audio("/assets/sound.mp3")
countdownSound.loop = true
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

const images = [
    {
        id: 1,
        src: "/assets/clock-unselected.webp",
        altSrc: "/assets/clock-selected.webp",
        subtitle: "1min",
    },
    {
        id: 2,
        src: "/assets/clock-unselected.webp",
        altSrc: "/assets/clock-selected.webp",
        subtitle: "3min",
    },
    {
        id: 3,
        src: "/assets/clock-unselected.webp",
        altSrc: "/assets/clock-selected.webp",
        subtitle: "5min",
    },
    {
        id: 4,
        src: "/assets/clock-unselected.webp",
        altSrc: "/assets/clock-selected.webp",
        subtitle: "10min",
    },
]

const tabData = [
    { label: "Game History" },
    { label: "Chart" },
    { label: "My History" },
]

const TabPanel = ({ children, value, index }) => {
    return (
        <div hidden={value !== index}>
            {value === index && (
                <Box p={0} m={0}>
                    {children}
                </Box>
            )}
        </div>
    )
}

const box = [boxa, boxb, boxc, boxd, boxe, boxsum]
const TopButton = styled(Tab)(({ theme, selected, index }) => ({
    minWidth: selected ? "52px" : "auto",
    padding: index === box.length - 1 ? "4px 6px" : "4px 16px",
    fontWeight: "bold",
    fontSize: "16px", // Default font size for larger screens
    color: selected ? "transparent" : "#FDE4BC",
    backgroundColor: selected ? "#323738" : "#382e35",
    backgroundImage: selected ? `url(${box[index]})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    borderRadius: "10px 10px 0px 0px",
    margin: "0 2.5px",

    // Font size adjustment for screens smaller than 380px
    "@media (max-width: 380px)": {
        fontSize: "12px", // Decrease font size for small screens
        padding: "4px 14px",
    },
}))

const ResultCircle = styled(Box)({
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "none",
    backgroundColor: "#f6f6f6",
    color: "black",
    fontSize: "1rem",
})

const SumCircle = styled(Box)({
    width: 35,
    height: 35,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FED358",
    color: "#ffffff",
})


const tabLabels = ["Big 1.98", "Small 1.98", "Odd 1.98", "Even 1.98"]

const FiveDPage = ({ timerKey }) => {
    const [activeId, setActiveId] = useState(images[0].id)
    const [selectedTimer, setSelectedTimer] = useState("1min")
    const [rows, setRows] = useState([])
    const [chartPage, setChartPage] = useState(1);
    const [historyPage, setHistoryPage] = useState(1);
    const [openDialog, setOpenDialog] = useState(false)
    const [periodId, setPeriodId] = useState(null)
    const [remainingTime, setRemainingTime] = useState(null)
    const [user, setUser] = useState(null)
    const [index, setIndex] = useState(0)
    const [inProp, setInProp] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [betAmount, setBetAmount] = useState(1)
    const [multiplier, setMultiplier] = useState(1)
    const [totalBet, setTotalBet] = useState(0)
    const [betPeriodId, setBetPeriodId] = useState(null)
    const [lastAlertedPeriodId, setLastAlertedPeriodId] = useState(null)
    // const [open, setOpen] = useState(false)
    // const [dialogContent, setDialogContent] = useState("")
    // const [gameResult, setGameResult] = useState("")
    const [statisticsData, setStatisticsData] = useState([])
    const [bets, setBets] = useState([]);
    const [betPage, setBetPage] = useState(1);
    const [betTotalPage, setBetTotalPage] = useState(1);
    const [selectedColor, setSelectedColor] = useState("RGB(71,129,255)")
    // const [winloss, setWinLoss] = useState(0)
    // const [popupresult, setPopupResult] = useState(0)
    // const [popupperiodid, setPopupPeriodId] = useState(0)
    // const [popupTimer, setPopupTimer] = useState(0)
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
    const [popupMessage, setPopupMessage] = useState("");
    const [activeTab, setActiveTab] = useState(0)
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [isSmall, setIsSmall] = useState(false)
    const [isBig, setIsBig] = useState(true)
    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))
    const isSmallScreen2 = useMediaQuery(theme.breakpoints.down(400));
    // const [popupQueue, setPopupQueue] = useState([]) // new queue to manage sequential popups
    // const [currentBetIndex, setCurrentBetIndex] = useState(0) // tracks current popup being shown
    const [selectedValue, setSelectedValue] = useState(0)
    const [finalReels, setFinalReels] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [remainingTimeInMs, setRemainingTimeInMs] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [page, setPage] = useState(1);
    const [gameTotalPage, setGameTotalPage] = useState(10);

    const [popupQueue, setPopupQueue] = useState([]); // Queue to manage sequential popups
    const [currentBetIndex, setCurrentBetIndex] = useState(-1); // Tracks current popup being shown
    const [open, setOpen] = useState(false); // Controls the visibility of the popup
    const [dialogContent, setDialogContent] = useState(""); // Content to display in the popup
    const [gameResult, setGameResult] = useState(""); // Result of the bet (Won/Lost)
    const [winloss, setWinLoss] = useState(0); // Win/Loss amount
    const [popupresult, setPopupResult] = useState([]); // Result of the bet (e.g., numbers)
    const [popupperiodid, setPopupPeriodId] = useState(""); // Period ID of the bet
    const [popupTimer, setPopupTimer] = useState(""); // Timer type of the bet
    const [userBets, setUserBets] = useState(() => {
        // Load userBets from localStorage on component mount
        const storedUserBets = localStorage.getItem("userBets");
        return storedUserBets ? JSON.parse(storedUserBets) : [];
    });

    // Save userBets to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("userBets", JSON.stringify(userBets));
    }, [userBets]);

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
    const [processedPeriodIds, setProcessedPeriodIds] = useState(new Set()); // Dynamically populated

    // Function to clean up userBets by removing processed bets
    const cleanUserBets = (userBets, processedPeriodIds) => {
        return userBets.filter((periodId) => !processedPeriodIds.has(periodId));
    };

    // Effect to clean up userBets whenever processedPeriodIds changes
    useEffect(() => {
        const cleanedUserBets = cleanUserBets(userBets, processedPeriodIds);
        setUserBets(cleanedUserBets);
    }, [processedPeriodIds]); // Run this effect whenever processedPeriodIds changes

    // Save state to localStorage whenever it changes
    useEffect(() => {
        saveStateToLocalStorage("processedPeriodIds", processedPeriodIds);
    }, [processedPeriodIds]);


    const [reels, setReels] = useState([0, 0, 0, 0, 0])
    const [results, setResults] = useState([])
    const [sum, setSum] = useState(0)
    const [numberArray, setNumberArray] = useState([])
    const [manualOutcomes, setManualOutcomes] = useState([])
    const [activeTopButton, setActiveTopButton] = useState(0)
    const reelsRef = useRef([])
    const [selectedNumbers, setSelectedNumbers] = useState([])
    const [activeButton, setActiveButton] = useState(1)
    const [activeTopCategory, setActiveTopCategory] = useState("A")
    const [drawerSelectedIndex, setDrawerSelectedIndex] = useState(null) // To track the selected index inside the drawer
    const [selectedElement, setSelectedElement] = useState(null)
    const [accountType, setAccountType] = useState("Normal")
    const [isPlacingBet, setIsPlacingBet] = useState(false)
    const { axiosInstance } = useAuth();
    const [agreed, setAgreed] = useState(true);
      const [show, setShow] = useState(true);
    const [isSpinning, setIsSpinning] = useState(false);
    const previousOutcomesRef = useRef(null);
    const initialLoadRef = useRef(true);
    const awaitingNewDataRef = useRef(false);
    // Add a state to track if this is the first page load
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    // Define refs outside useEffect
    const previousTimer = useRef(selectedTimer)
    const pendingBetsCache = useRef({})
    const haveOutcomesChanged = (newOutcomes) => {
        if (!previousOutcomesRef.current) return true;

        return JSON.stringify(previousOutcomesRef.current) !== JSON.stringify(newOutcomes);
    };

    useEffect(() => {
        let isMounted = true;
        let timeoutId = null;
        let expiryTimeoutId = null;

        const getTimeRemainingInPeriod = () => {
            const timerMap = {
                "1min": 60000,
                "3min": 180000,
                "5min": 300000,
                "10min": 600000,
            };

            const periodDuration = timerMap[selectedTimer] || 60000;
            const now = new Date();
            const seconds = now.getSeconds();
            const milliseconds = now.getMilliseconds();

            let timeRemaining;

            switch (selectedTimer) {
                case "1min":
                    timeRemaining = periodDuration - (seconds * 1000 + milliseconds);
                    break;

                case "3min":
                    const threeMinProgress =
                        (Math.floor(now.getMinutes() % 3) * 60 + seconds) * 1000 +
                        milliseconds;
                    timeRemaining = periodDuration - threeMinProgress;
                    break;

                case "5min":
                    const fiveMinProgress =
                        (Math.floor(now.getMinutes() % 5) * 60 + seconds) * 1000 +
                        milliseconds;
                    timeRemaining = periodDuration - fiveMinProgress;
                    break;

                case "10min":
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

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const timerTypeMap = {
        "1min": "ONE_MINUTE_TIMER",
        "3min": "THREE_MINUTE_TIMER",
        "5min": "FIVE_MINUTE_TIMER",
        "10min": "TEN_MINUTE_TIMER",
    };

    const timerTypeChange = {
        "ONE_MINUTE_TIMER": "1 Minute",
        "THREE_MINUTE_TIMER": "3 Minute",
        "FIVE_MINUTE_TIMER": "5 Minute",
        "TEN_MINUTE_TIMER": "10 Minute",
    };

    const fetchAndSortData = async () => {
        try {
            // //console.log("Fetching data for page:", page);
            const timerType = timerTypeMap[selectedTimer] || "ONE_MINUTE_TIMER";
            const currentPage = activeTab === 0 ? historyPage : chartPage;
            // //console.log("Timer Type:", timerType);
            // //console.log("page", page)
            // //console.log("activeTab", activeTab)
            const response = await axiosInstance.get(
                `${domain}/api/master-game/fived/history`,
                {
                    params: { timerType: timerType, page: currentPage, limit: 10 },
                    withCredentials: true,
                }
            );
            // //console.log("Response data:", response.data.data.results);

            const filtered = response.data.data.results;
            setGameTotalPage(response.data.data.pagination.totalPages);
            const sortedData = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setHistoryData(sortedData);
            setResults(sortedData)

            // //console.log("sortedData", fetchedData)
            if (sortedData.length > 0) {
                const fetchedData = sortedData[0];
                // //console.log("fetchedData", fetchedData);

                const numbersArray = [
                    fetchedData.sectionA,
                    fetchedData.sectionB,
                    fetchedData.sectionC,
                    fetchedData.sectionD,
                    fetchedData.sectionE
                ];
                setManualOutcomes(numbersArray);
                // //console.log("numbersArray--", numbersArray);
                // Either this is first load or data has changed
                if (initialLoadRef.current || haveOutcomesChanged(numbersArray)) {
                    // Store the new outcomes
                    previousOutcomesRef.current = [...numbersArray];

                    // If spinner is already running, we'll update it when it completes
                    if (isSpinning) {
                        // If currently spinning, mark as awaiting new data to be applied after spin
                        awaitingNewDataRef.current = true;
                    } else if (initialLoadRef.current) {
                        // First load - position without animation
                        setReelsToPositions(numbersArray, false);
                        initialLoadRef.current = false;
                    } else {
                        // Normal update with new data - trigger spin
                        spinReels(numbersArray);
                    }
                }
            }
        } catch (err) {
            console.error("Error fetching or processing data:", err);
        }
    };

    useEffect(() => {
        if (periodId && periodId !== "Loading...") {
            fetchAndSortData();
        }
    }, [selectedTimer, periodId, domain, page, historyPage, chartPage, activeTab]);
    // useEffect(() => {
    //     // When the selected timer changes, start the spinner
    //     if (!initialLoadRef.current && !isSpinning) {
    //         awaitingNewDataRef.current = true;
    //         spinReels(manualOutcomes);
    //     }
    // }, [selectedTimer]);

    const fetchBetHistory = async () => {
        const timerType = timerTypeMap[selectedTimer] || "ONE_MINUTE_TIMER";
        try {
            const response = await axiosInstance.get(
                `${domain}/api/master-game/fived/bet-history`,
                {
                    params: { timerType: timerType, page: betPage, limit: 10 },
                    withCredentials: true,
                }
            );

            const betData = response.data.data.bets;
            setBets(betData);
            setBetTotalPage(response.data.data.pagination.totalPages);
        } catch (error) {
            console.error("Error fetching FiveD bet history:", error);
            setTimeout(async () => {
                try {
                    const retryResponse = await axiosInstance.get(
                        `${domain}/api/master-game/fived/bet-history`,
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

    useEffect(() => {
        fetchBetHistory();
    }, [selectedTimer, periodId, betPage]);

    useEffect(() => {
        if (selectedCategory || selectedNumbers.length > 0) {
            setActiveBetAmount(1)
            setBetAmount(1)
        }
    }, [selectedCategory, selectedNumbers])

    const handleButtonClick = (event, newValue) => {
        setActiveTopButton(newValue)
        setActiveTopCategory(["A", "B", "C", "D", "E", "SUM"][newValue])
    }

    const handleCategorySelection = (label, index) => {
        if (typeof label === "string") {
            // Existing logic for category labels
            if (selectedCategory === label) {
                setSelectedCategory(null)
                handleEventSelection(label.toLowerCase().split(" ")[0])
            } else {
                setSelectedCategory(label)
                setSelectedNumbers([])
                handleEventSelection(label.toLowerCase())
            }
        } else {
            // New logic for number selections
            setSelectedCategory(null)
            handleEventSelection("number")
        }
        // //console.log("Selected index:", index)
    }

    // Animation function - ensure this runs correctly
    const spinReels = useCallback((finalOutcomes) => {
        if (isSpinning) return; // Prevent overlapping animations

        setIsSpinning(true);
        // //console.log("Starting spin animation with outcomes:", finalOutcomes);

        // Reset reels to starting position first for a good spin
        reelsRef.current.forEach((reel) => {
            if (!reel) return;

            // Reset position to begin spinning from top
            reel.style.transition = "none";
            reel.style.top = "0px";

            // Force reflow to apply the immediate position change
            void reel.offsetWidth;
        });

        // Now start the spinning effect
        reelsRef.current.forEach((reel) => {
            if (!reel) return;

            // Apply spinning animation
            reel.style.animation = "spinReel 1s linear infinite";
        });

        // Schedule the sequential stopping of reels
        const baseDelay = 2000;
        const staggerDelay = 500;

        reelsRef.current.forEach((reel, index) => {
            if (!reel) return;

            setTimeout(() => {
                // Stop the animation
                reel.style.animation = "none";

                // Calculate the final position
                const stopPosition = finalOutcomes[index] * 60 + 5;

                // Apply smooth stopping
                reel.style.transition = "top 1s cubic-bezier(0.23, 1, 0.32, 1)";
                reel.style.top = `-${stopPosition}px`;

                // If this is the last reel, reset the spinning state
                if (index === reelsRef.current.length - 1) {
                    setTimeout(() => {
                        setIsSpinning(false);
                        // //console.log("Spin animation complete");

                        // If we fetched new data while spinning, position reels to show it
                        if (awaitingNewDataRef.current) {
                            awaitingNewDataRef.current = false;
                            // //console.log("Applying post-spin data update");
                            // Make a new API call to ensure we have the latest data
                            fetchAndSortData();
                        }
                    }, 1000);
                }
            }, baseDelay + (index * staggerDelay));
        });
    }, [isSpinning]);

    // Helper function to position reels without animation
    const setReelsToPositions = (positions, animate = false) => {
        reelsRef.current.forEach((reel, index) => {
            if (!reel) return;

            const stopPosition = positions[index] * 60 + 5;

            reel.style.transition = animate ? "top 1s ease" : "none";
            reel.style.top = `-${stopPosition}px`;
        });
    };

    // Initialize the spinner and add keyframes
    useEffect(() => {
        // Set up the CSS keyframes
        if (!document.getElementById('spinKeyframes')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'spinKeyframes';
            styleSheet.textContent = `
            @keyframes spinReel {
                0% { transform: translateY(0); }
                100% { transform: translateY(-600px); }
            }
        `;
            document.head.appendChild(styleSheet);
        }

        return () => {
            // Clean up
            const styleElement = document.getElementById('spinKeyframes');
            if (styleElement) {
                styleElement.remove();
            }
        };
    }, []);
    // Add this useEffect for initial page load animation
    useEffect(() => {
        // This will run once when component mounts
        if (initialLoadRef.current) {

            // Fetch data and then start spinning
            fetchAndSortData().then(data => {
                if (data && data.length > 0) {
                    const fetchedData = data[0];
                    const initialOutcomes = [
                        fetchedData.sectionA,
                        fetchedData.sectionB,
                        fetchedData.sectionC,
                        fetchedData.sectionD,
                        fetchedData.sectionE
                    ];

                    // Small delay to ensure DOM is ready
                    setTimeout(() => {
                        initialLoadRef.current = false;
                        spinReels(initialOutcomes);
                    }, 500);
                }
            });
        }
    }, []);
    useEffect(() => {
        // Don't run on the very first render
        if (initialLoadRef.current) {
            return;
        }

        // Only spin on initial load or when remainingTime === "01"
        if ((remainingTime === 2) && !isSpinning) {
            // Mark that we've initialized the spinner
            fetchAndSortData().then(newData => {
                if (newData && newData.length > 0) {
                    const fetchedData = newData[0];
                    const latestOutcomes = [
                        fetchedData.sectionA,
                        fetchedData.sectionB,
                        fetchedData.sectionC,
                        fetchedData.sectionD,
                        fetchedData.sectionE
                    ];

                    // Directly trigger the spin with the latest data
                    if (!isSpinning) {
                        spinReels(latestOutcomes);
                    }
                }
            });
        }
    }, [manualOutcomes, spinReels, isSpinning, remainingTime]);


    const navigate = useNavigate()

    useEffect(() => {
        if (timerKey) {
            const timerMap = {
                "1min": { id: 1, subtitle: "1min" },
                "3min": { id: 2, subtitle: "3min" },
                "5min": { id: 3, subtitle: "5min" },
                "10min": { id: 4, subtitle: "10min" },
            }
            if (timerMap[timerKey]) {
                setActiveId(timerMap[timerKey].id)
                setSelectedTimer(timerMap[timerKey].subtitle)
                // navigate(`/5d/${timerKey}`)
            }
        }
    }, [timerKey, navigate])

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 600) {
                setIsSmall(true)
                setIsBig(false)
            } else {
                setIsSmall(false)
                setIsBig(true)
            }
        }
        window.addEventListener("resize", handleResize)
        handleResize() // Set the initial state
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const handleToggle = () => {
        setAgreed((prev) => !prev);
    };
    const handleToggle2 = () => {
        setShow(!show); // Toggle state on click
    };
    const handleOpenPopup = () => {
        setIsPopupOpen(true)
    }

    const handleClosePopup = () => {
        setIsPopupOpen(false)
    }

    const handleNumberSelection = (value) => {
        if (selectedNumbers.includes(value)) {
            setSelectedNumbers(selectedNumbers.filter((num) => num !== value))
        } else { 
            setSelectedNumbers([...selectedNumbers, value])
            setSelectedCategory(null)
        }
    }

    // const fetchUserData = async () => {
    //     try {
    //         const response = await axios.get(`${domain}/user`, {
    //             withCredentials: true,
    //         })
    //         setAccountType(response.data.user.accountType)
    //         setUser(response.data.user)
    //     } catch (err) {
    //         console.error("Error fetching user data:", err)
    //     }
    // }

    useEffect(() => {
        const generateRandomCols = (numCols, min, max) => {
            return Array.from(
                { length: numCols },
                () => Math.floor(Math.random() * (max - min + 1)) + min
            )
        }
        const generateStatisticsData = () => {
            const newStatisticsData = [
                { id: "A", label: "Missing", cols: generateRandomCols(10, 1, 50) },
                { id: "B", label: "Avg missing", cols: generateRandomCols(10, 1, 20) },
                { id: "C", label: "Frequency", cols: generateRandomCols(10, 0, 5) },
                {
                    id: "D",
                    label: "Max consecutive",
                    cols: generateRandomCols(10, 0, 50),
                },
            ]
            setStatisticsData(newStatisticsData)
        }
        // Generate statistics data on mount and every interval
        generateStatisticsData()
        // const intervalId = setInterval(fetchUserData, 1000);
        // return () => clearInterval(intervalId);
    }, [periodId]) // Run once on mount

    const handleTimerChange = (id, subtitle) => {
        setActiveId(id)
        // const newTimerKey = subtitle.toLowerCase().replace("min", "min")
        setSelectedTimer(subtitle)
        setPage(1)
        setBetPage(1)
        setChartPage(1)
        setHistoryPage(1);
        // navigate(`/5d/${newTimerKey}`)
    }

    const handleClick = (id) => {
        if (!timerKey) {
            let newTimerKey
            switch (id) {
                case 1:
                    newTimerKey = "1min"
                    break
                case 2:
                    newTimerKey = "3min"
                    break
                case 3:
                    newTimerKey = "5min"
                    break
                case 4:
                    newTimerKey = "30sec" // Handle 30-second timer
                    break
                default:
                    newTimerKey = "30sec"
            }
            // navigate(`/5d/${newTimerKey}`)
            setSelectedTimer(images.find((img) => img.id === id).subtitle)
            setActiveId(id)
        }
    }

    const textArray = [
        "We are excited to welcome you to 20 Lottery, where you can enjoy a wide range of games. But that's not all - there are also plenty of bonuses waiting for you to claim! Join us now and start play your game with 20 Lottery. Get ready for non-stop fun and rewards. Welcome aboard!  Stay tuned for more updates and promotions.",
        "24/7 Live support on 20 Lottery ",
        "20 Lottery welcomes you here !!",
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            setInProp(false)

            setTimeout(() => {
                setIndex((oldIndex) => {
                    return (oldIndex + 1) % textArray.length
                })
                setInProp(true)
            }, 500) // This should be equal to the exit duration below
        }, 3000) // Duration between changing texts

        return () => clearInterval(timer)
    }, [])

    const navigateToPage = () => {
        navigate(-1)
    }

    const handleOpenDrawer = (selectedIndex) => {
        setDrawerOpen(true)
        setDrawerSelectedIndex(selectedIndex)
        setAgreed(true);
    }

    const handleCloseDrawer = () => {
        setDrawerOpen(false)
    }

    const handleBetAmount = (amount) => {
        setActiveBetAmount(amount)
        setBetAmount(amount)
    }

    const handleMultiplier = (multiplier) => {
        setMultiplier(multiplier)
    }

    const mapSelectedTimer = (timer) => {
        const timerMap = {
            '1min': 'ONE_MINUTE_TIMER',
            '3min': 'THREE_MINUTE_TIMER',
            '5min': 'FIVE_MINUTE_TIMER',
            '10min': 'TEN_MINUTE_TIMER',
            '30sec': 'THIRTY_TIMER'
        }

        return timerMap[timer] || timer
    }

    // Handle placing a bet
    const handlePlaceBet = async () => {
        // //console.log("Placing bet...");

        // Validate bet amount
        if (betAmount === 0) {
            console.warn("Bet amount is 0.");
            setPopupMessage("You can't place a bet with 0 amount.");
            setIsPopupVisible(true);
            // Hide the popup after 2 seconds
            setTimeout(() => {
                setIsPopupVisible(false);
            }, 2000);
            return;
        }

        // Prevent betting in last 5 seconds
        if (["00:06", "00:05", "00:04", "00:03", "00:02", "00:01"].includes(remainingTime)) {
            console.warn("Attempting to place bet in the last 5 seconds. Remaining time:", remainingTime);
             setPopupMessage("You can't place a bet in the last 5 seconds.");
            setIsPopupVisible(true);
            // Hide the popup after 2 seconds
            setTimeout(() => {
                setIsPopupVisible(false);
            }, 2000);
            return;
        }

        // Dynamically determine bet type and section
        const getBetType = () => {
            if (activeTopCategory === "SUM") return "SUM";
            return `SECTION_${activeTopCategory}`;
        };

        // Dynamically create bet data
        const betData = {
            betAmount,
            multiplier,
            selectedTimer: mapSelectedTimer(selectedTimer),
            periodId,
            betType: getBetType(),
        };

        // Determine section key dynamically
        const sectionKey = activeTopCategory === "SUM"
            ? "sumSection"
            : `section${activeTopCategory}`;

        // Add number bets if selected
        if (selectedNumbers.length > 0) {
            betData[sectionKey] = activeTopCategory === "SUM"
                ? selectedNumbers[0]  // For SUM, use first number
                : selectedNumbers;
        }

        // Handle size and parity for both section and sum bets
        if (selectedCategory) {
            const categoryKey = selectedCategory.split(" ")[0];

            // Dynamically determine size key
            const sizeKey = activeTopCategory === "SUM"
                ? "sizeSum"
                : `size${activeTopCategory}`;

            // Dynamically determine parity key
            const parityKey = activeTopCategory === "SUM"
                ? "paritySum"
                : `parity${activeTopCategory}`;

            // Add size bet (always as an array except for SUM)
            if (categoryKey === "Big") {
                betData[sizeKey] = activeTopCategory === "SUM" ? "BIG" : ["BIG"];
            } else if (categoryKey === "Small") {
                betData[sizeKey] = activeTopCategory === "SUM" ? "SMALL" : ["SMALL"];
            }

            // Add parity bet (always as an array except for SUM)
            if (categoryKey === "Odd") {
                betData[parityKey] = activeTopCategory === "SUM" ? "ODD" : ["ODD"];
            } else if (categoryKey === "Even") {
                betData[parityKey] = activeTopCategory === "SUM" ? "EVEN" : ["EVEN"];
            }
        }

        // Validate bet data
        if (!selectedCategory && selectedNumbers.length === 0) {
            console.error("No selection made. Please select numbers or a category.");
            return;
        }

        // //console.log("Final Bet Data:", betData);

        // Set loading state
        setIsPlacingBet(true);

        try {
            // Place bet using axios
            const response = await axiosInstance.post(
                `${domain}/api/master-game/fived/bet`,
                betData,
            );

            // Handle successful bet placement
            if (response.status === 201) {
                // //console.log("Bet placed successfully. Period ID:", periodId);
                setUserBets((prevBets) => [...prevBets, periodId]); // Add periodId to userBets

                // Reset bet-related states
                setSelectedNumbers([]);
                setSelectedCategory(null);
                setBetAmount(1);
                setMultiplier(1);

                // Show success notification and reset states
                 setPopupMessage("Bet placed successfully!");
                setIsPopupVisible(true);
                // Hide the popup after 2 seconds
                setTimeout(() => {
                    setIsPopupVisible(false);
                }, 2000);
                setDisplayBetAmount(1);
                setCustomBetAmount("");
                setBetPeriodId(periodId);
                handleCloseDrawer();
                setActiveBetAmount(1);
                // fetchUserData();
            }
        } catch (err) {
            console.error("Error placing bet:", err);
            setPopupMessage(err.response?.data?.error?.startsWith("Insufficient balance")
        ? "Insufficient balance"
        : (err.response?.data?.error || "Failed to place bet. Please try again.")
      );
       handleCloseDrawer();
            setIsPopupVisible(true);
            // Hide the popup after 2 seconds
            setTimeout(() => {
                setIsPopupVisible(false);
            }, 2000);

        } finally {
            // Always disable loader
            setIsPlacingBet(false);
        }
    };
    useEffect(() => {
        const totalBet =
            betAmount *
            multiplier *
            (selectedNumbers.length || (selectedCategory ? 1 : 0))
        setDisplayBetAmount(totalBet)
    }, [betAmount, multiplier, selectedNumbers, selectedCategory])

    const handleCancelBet = () => {
        setSelectedNumbers([])
        setActiveBetAmount(null)
        setBetAmount(1)
        setTotalBet(1)
        setMultiplier(1) // Reset multiplier if you want
        setCustomBetAmount("") // Clear custom bet amount input
        setSelectedValue(null) // Deselect the active tab or value

        // Close the drawer
        handleCloseDrawer()
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return
        }

       setTimeout(() => {
            setIsPopupVisible(false);
        }, 2000);
    }

    useEffect(() => {
        handleClick(images[0].id)
    }, [])

    const [lastPlayedTime, setLastPlayedTime] = useState(null)
    const [isSoundOn, setIsSoundOn] = useState(false)


    useEffect(() => {
        if (remainingTime >= "01" && remainingTime <= "05") {
            setOpenDialog(true)
            handleCloseDrawer()
            if (isSoundOn && remainingTime !== lastPlayedTime) {
                countdownSound.play()
                setLastPlayedTime(remainingTime)
                setTimeout(() => {
                    countdownSound.pause()
                    countdownSound.currentTime = 0
                }, 1000 - countdownSound.duration * 1000)
            }
        } else {
            setOpenDialog(false)
            if (isSoundOn) {
                countdownSound.pause()
                countdownSound.currentTime = 0
                setLastPlayedTime(null)
            }
        }

    }, [remainingTime, isSoundOn])

    const handleEventSelection = (event) => {

        switch (event) {
            case "Even":
                setSelectedColor("rgb(200,111,255)")
                break
            case "Odd":
                setSelectedColor("rgb(251,91,91)")
                break
            case "Small":
                setSelectedColor("rgb(110,168,244)")
                break
            case "Big":
                setSelectedColor("rgb(254,170,87)")
                break
            default:
                setSelectedColor("#FED358")
        }
    }

    // const [activeButton, setActiveButton] = useState(1);
    const [activeBetAmount, setActiveBetAmount] = useState(1)
    const [customBetAmount, setCustomBetAmount] = useState("")
    const [displayBetAmount, setDisplayBetAmount] = useState(1)

    const handleCustomBetChange = (event) => {
        const betAmount = parseFloat(event.target.value)
        setCustomBetAmount(event.target.value)
        if (!isNaN(betAmount) && betAmount > 0) {
            handleBetAmount(betAmount)
            setActiveBetAmount(betAmount)
        }
    }

    useEffect(() => {
        setTotalBet(betAmount * multiplier)
    }, [betAmount, multiplier])

    // Fetch bet history and filter resolved bets
    const fetchPopupBetHistory = async () => {
        const timerType = timerTypeMap[selectedTimer] || "ONE_MINUTE_TIMER";
        try {
            const response = await axiosInstance.get(
                `${domain}/api/master-game/fived/bet-history`,
                {
                    params: { timerType: timerType, page: betPage, limit: 10 },
                    withCredentials: true,
                }
            );

            const betData = response.data.data.bets;

            // Filter bets that have valid resultSection data (i.e., results are available)
            // AND belong to the user's bets
            const resolvedBets = betData.filter(
                (bet) =>
                    Array.isArray(bet.resultSectionA) && bet.resultSectionA.length > 0 &&
                    Array.isArray(bet.resultSectionB) && bet.resultSectionB.length > 0 &&
                    Array.isArray(bet.resultSectionC) && bet.resultSectionC.length > 0 &&
                    Array.isArray(bet.resultSectionD) && bet.resultSectionD.length > 0 &&
                    Array.isArray(bet.resultSectionE) && bet.resultSectionE.length > 0 &&
                    userBets.includes(bet.periodId) &&
                    !processedPeriodIds.has(bet.periodId)
            );

            // Sort by timestamp (newest first) to get the most recent bet
            const sortedBets = resolvedBets.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );

            // Only process the most recent bet
            if (sortedBets.length > 0) {
                const mostRecentBet = sortedBets[0];

                // Clear the queue and add only the most recent bet
                setPopupQueue([mostRecentBet]);

                // Mark all resolved bets as processed
                setProcessedPeriodIds((prevSet) => {
                    const newSet = new Set(prevSet);
                    resolvedBets.forEach((bet) => newSet.add(bet.periodId));

                    // Clean up userBets dynamically
                    const cleanedUserBets = userBets.filter((periodId) => !newSet.has(periodId));
                    setUserBets(cleanedUserBets);

                    return newSet;
                });

                // Start processing the queue
                setCurrentBetIndex(0);
            }

            setBets(betData);
            setBetTotalPage(response.data.data.pagination.totalPages);
        } catch (error) {
            console.error("Error fetching FiveD bet history:", error);
            setTimeout(async () => {
                try {
                    const retryResponse = await axiosInstance.get(
                        `${domain}/api/master-game/fived/bet-history`,
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

    // Fetch bet history when userBets or selectedTimer changes
    useEffect(() => {
        let timeoutId;
        
        if (userBets.length > 0) {
            timeoutId = setTimeout(() => {
                fetchPopupBetHistory();
            }, 2000); // 2 seconds delay
        }
        
        // Cleanup function to clear timeout if component unmounts or dependencies change
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [userBets, selectedTimer, betPage, periodId]);

    // Handle sequential display of popups
    useEffect(() => {
        // //console.log("Popup queue:", popupQueue);
        if (popupQueue.length > 0 && currentBetIndex < popupQueue.length) {
            const currentBet = popupQueue[currentBetIndex];

            if (!currentBet) {
                console.error("currentBet is undefined or null.");
                return;
            }

            // //console.log("Displaying popup for bet:", currentBet);

            // Prepare popup content
            const announceBetResult = async () => {
                setGameResult(currentBet.isWin ? "Won" : "Lost");
                setWinLoss(
                    currentBet.isWin 
                      ? Number(currentBet.winAmount || 0).toFixed(2) 
                      : Number(currentBet.actualBetAmount || 0).toFixed(2)
                  );
                setPopupPeriodId(currentBet.periodId);
                setPopupResult([
                    currentBet.resultSectionA,
                    currentBet.resultSectionB,
                    currentBet.resultSectionC,
                    currentBet.resultSectionD,
                    currentBet.resultSectionE,
                    currentBet.resultSum,
                ]);
                setPopupTimer(currentBet.selectedTimer);
                setDialogContent(currentBet.isWin ? "Bonus" : "Lose");

                setOpen(true); // Show the popup
            };

            announceBetResult();

            // Close the popup after 2.5 seconds and move to the next bet
            const timer = setTimeout(() => {
                // //console.log("Closing popup and moving to next bet...");
                setOpen(false);
                setTimeout(() => {
                    setCurrentBetIndex((prevIndex) => prevIndex + 1);
                }, 1000);
            }, 2500);

            return () => clearTimeout(timer);
        } else if (popupQueue.length > 0 && currentBetIndex >= popupQueue.length) {
            // //console.log("All popups displayed. Resetting queue and cleaning up localStorage...");

            // Reset popup queue and processedPeriodIds
            setPopupQueue([]);
            setCurrentBetIndex(-1);

            // Clear localStorage for popupQueue and processedPeriodIds
            localStorage.removeItem("popupQueue");
            localStorage.removeItem("processedPeriodIds");
        }
    }, [popupQueue, currentBetIndex]);
    // First, define a function to format the lottery results
    const formatLotteryResults = (resultData) => {
        // Parse the result string into individual digits
        const resultString = String(resultData);
        const digits = resultString.split(',');
        const sum = digits.slice(0, 5).reduce((acc, digit) => acc + parseInt(digit), 0);

        return (
            <div style={{
                // backgroundColor: '#FF7F50',
                // padding: '10px',
                width: 'calc(100% - 30px)',
                // margin: '0 10px'
            }}>
                <div style={{
                    color: gameResult === "Won" ? "white" : "#7c9dc2",
                    // marginBottom: '5px',
                    fontSize: '14px',
                    // fontWeight: 'bold'
                }}>
                    Lottery results
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3px', gap: "5px" }}>
                    <span style={{ color: 'white', fontSize: '14px', background: gameResult === "Won" ? "#fdc03d" : "#7c9cc2", padding: "5px 12px", borderRadius: "50px 50px 0 0", fontWeight: "bold" }}>A</span>
                    <span style={{ color: 'white', fontSize: '14px', background: gameResult === "Won" ? "#fdc03d" : "#7c9cc2", padding: "5px 12px", borderRadius: "50px 50px 0 0", fontWeight: "bold" }}>B</span>
                    <span style={{ color: 'white', fontSize: '14px', background: gameResult === "Won" ? "#fdc03d" : "#7c9cc2", padding: "5px 12px", borderRadius: "50px 50px 0 0", fontWeight: "bold" }}>C</span>
                    <span style={{ color: 'white', fontSize: '14px', background: gameResult === "Won" ? "#fdc03d" : "#7c9cc2", padding: "5px 12px", borderRadius: "50px 50px 0 0", fontWeight: "bold" }}>D</span>
                    <span style={{ color: 'white', fontSize: '14px', background: gameResult === "Won" ? "#fdc03d" : "#7c9cc2", padding: "5px 12px", borderRadius: "50px 50px 0 0", fontWeight: "bold" }}>E</span>
                    <span style={{ color: 'white', fontSize: '14px', background: gameResult === "Won" ? "#fdc03d" : "#7c9cc2", padding: "5px 2px", borderRadius: "50px 50px 0 0", fontWeight: "bold" }}>SUM</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: "13px" }}>
                    {digits.slice(0, 5).map((digit, index) => (
                        <div key={index} style={{
                            width: '25px',
                            height: '25px',
                            borderRadius: '50%',
                            // backgroundColor: 'white',
                            border: gameResult === "Won" ? "1px solid white" : "1px solid #7c9cc2",
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: gameResult === "Won" ? " white" : " #7c9cc2"
                        }}>
                            {digit}
                        </div>
                    ))}
                    <div style={{
                        width: '25px',
                        height: '25px',
                        borderRadius: '50%',
                        border: gameResult === "Won" ? "1px solid white" : "1px solid #7c9cc2",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: gameResult === "Won" ? " white" : " #7c9cc2"
                    }}>
                        {sum}
                    </div>
                </div>
            </div>
        );
    };

    const isSum = activeTopButton === 5
    const firstHalf = 0;
    const secondHalf = remainingTime;

    return (
        <div>
            <Mobile>
                <div style={{ backgroundColor: "#232626", overflowX: "hidden" }}>
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                            position: "sticky",
                            top: 0,
                            zIndex: 5000,
                            backgroundColor: "#232626",
                            // padding: "4px 0px",
                            color: "white",
                        }}
                    >
                        <Grid item xs={3} textAlign="left">
                            <IconButton style={{ color: "white" }} onClick={navigateToPage}>
                                <ArrowBackIosNewIcon sx={{ fontSize: "18px", ml: 0.5 }} />
                            </IconButton>
                        </Grid>
                        <Grid item xs={6} textAlign="center">
                            <img
                                src="/assets/logo/colorLogo.webp"
                                alt="logo"
                                style={{ width: "140px"}}
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
                                    mr: "20px"
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

                        </Grid>
                    </Grid>

                    <GameWalletCard />

                    <Grid
                        container
                        spacing={1}
                        sx={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            maxWidth: "93%",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                            marginTop: "-65px",
                            backgroundColor: "#382e35",
                            borderRadius: "13px",
                            color: "white",
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
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <img
                                    src={activeId === image.id ? image.altSrc : image.src}
                                    alt={image.subtitle}
                                    style={{ width: "60%" }}
                                />
                                <div
                                    style={{
                                        textAlign: "center",
                                        color: activeId === image.id ? "black" : "#B79C8B",
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
                                        5D
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
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-around",
                            maxWidth: "100%",
                            mt: 1.5,
                            backgroundColor: "#323738",
                            margin: 1.5,
                            color: "#768096",
                            borderRadius: "11px",
                            padding: 1,
                        }}
                    >
                        {/* Left Section (Lottery Label) */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: { xs: 1, sm: 1 },
                                color: "#B79C8B"
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    lineHeight: 1,
                                    fontSize: { xs: "13.8px", sm: "13.8px" },
                                }}
                            >
                                Lottery
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    lineHeight: 2.5,
                                    fontSize: { xs: "13.8px", sm: "13.8px" },
                                }}
                            >
                                results
                            </Typography>
                        </Box>

                        {/* Results Section */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: { xs: "5px", sm: "10px" },
                            }}
                        >
                            {results.length > 0 && (() => {
                                const latestResult = results[0]; // Get latest result
                                // //console.log("latestResult", latestResult);

                                const mappedData = [
                                    { number: latestResult.sectionA, letter: "A" },
                                    { number: latestResult.sectionB, letter: "B" },
                                    { number: latestResult.sectionC, letter: "C" },
                                    { number: latestResult.sectionD, letter: "D" },
                                    { number: latestResult.sectionE, letter: "E" },
                                ];

                                return mappedData.map((result, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                    >
                                        <SumCircle sx={{ background: "#382e35" }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontSize: { xs: "13px", sm: "13px" },
                                                    color: "#FDE4BC",
                                                }}
                                            >
                                                {result.number}
                                            </Typography>
                                        </SumCircle>
                                        <Typography
                                            variant="caption"
                                            sx={{ mt: 0.25, fontSize: { xs: "14px", sm: "14px" }, color: "#B79C8B" }}
                                        >
                                            {result.letter}
                                        </Typography>
                                    </Box>
                                ));
                            })()}
                        </Box>


                        {/* Right Section (Sum) */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 3,
                                // ml: { xs: 0.5, sm: 0.5 },
                            }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: "bold", mr: 1 }}>
                                =
                            </Typography>
                            <SumCircle sx={{ background: "#FED358" }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: { xs: "13px", sm: "13px" }, color: "#232626"
                                    }}
                                >
                                    {results[0]?.sumSection}
                                </Typography>
                            </SumCircle>
                        </Box>
                    </Box>

                    <Box
                        mt={2}
                        sx={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            maxWidth: "90%",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                            p: 1,
                            backgroundColor: "#323738",
                            borderRadius: "10px",
                        }}
                    >
                        <Grid container spacing={0} alignItems="center" marginBottom="6px">
                            <Grid item xs={2} sx={{textAlign: "left" }}>
                                <Typography
                                    variant="body1"
                                    color="#B79C8B"
                                    sx={{ fontSize: "0.8rem" }}
                                >
                                    Period
                                </Typography>
                            </Grid>
                            <Grid item xs={5} sx={{textAlign: "left" }}>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        border: "1px solid #FED358",
                                        borderRadius: "15px",
                                        padding: "1.5px 17px",
                                        fontSize: "0.6rem",
                                        textTransform: "initial",
                                        display: "inline-flex", // Use inline-flex to align items in a line
                                        alignItems: "center", // Center items vertically
                                        color: "#FED358",
                                        gap: "3px",
                                    }}
                                    // startIcon={<NoteIcon />}
                                    onClick={handleOpenPopup}
                                >
                                    <img src="/assets/k3/howtoplay.svg" alt="" width="12px" />
                                    How to play
                                </Button>
                                <FiveDHtp isOpen={isPopupOpen} onClose={handleClosePopup} />
                            </Grid>
                            <Grid item xs={5} sx={{ paddingLeft: "10px", textAlign: "right" }}>
                                <Typography variant="body5" color="#B79C8B" sx={{ fontSize: "12.8px" }}>
                                    Time Remaining
                                </Typography>
                            </Grid>
                        </Grid>
                        <CountdownTimer
                            setPeriodId={setPeriodId}
                            periodId={periodId}
                            selectedTimer={selectedTimer}
                            remainingTime={remainingTime}
                            setRemainingTime={setRemainingTime}
                            gameType="k3"
                        />

                        <div className="fullbox">
                            <div id="leftbox"></div>
                            <div className="outerbox">
                                <img className="polygon-left" src="/assets/Polygon-left.svg" />
                                <img
                                    className="polygon-right"
                                    src="/assets/Polygon-right.svg"
                                />
                                <div className="diebox">
                                    <div className="slot-machine">
                                        {[...Array(5)].map((_, index) => (
                                            <div className="reel" key={index}>
                                                <div
                                                    className="reel-inner"
                                                    ref={(el) => (reelsRef.current[index] = el)}
                                                >
                                                    {/* <div className="numberElem placeholder-circle"></div> */}
                                                    {[...Array(30)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`numberElem ${index === 0 ? "green-background" : ""
                                                                }`}
                                                        >
                                                            {i % 10}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div id="rightbox"></div>
                        </div>

                        <Box sx={{ position: "relative" }}>
                            <div
                                className="overlay"
                                style={{
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    borderRadius: "10px",
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
                                    width: "300px",
                                    height: "200px",
                                    display: openDialog ? "flex" : "none",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                    color: "#FED358",
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
                                            backgroundColor: "#382e35",
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
                                            backgroundColor: "#382e35",
                                        }}
                                    >
                                        {secondHalf}
                                    </p>
                                </div>
                            </div>
                            <Box sx={{ mt: 2, mb: 2, borderBottom: "1px solid #454037" }}>
                                <Tabs
                                    value={activeTopButton}
                                    onChange={handleButtonClick}
                                    TabIndicatorProps={{ style: { display: "none" } }}
                                >
                                    {["A", "B", "C", "D", "E", "SUM"].map((label, index) => (
                                        <TopButton
                                            key={index}
                                            label={activeTopButton === index ? "" : label}
                                            selected={activeTopButton === index}
                                            index={activeTopButton === index ? index : ""}
                                        />
                                    ))}
                                </Tabs>
                            </Box>

                            <Grid
                                container
                                spacing={1}
                                style={{
                                    margin: "revert-layer",
                                }}
                            >
                                {tabLabels.map((label, index) => (
                                    <Grid item key={index} xs={3} sm={3}>
                                        <Box
                                            style={{
                                                backgroundColor:
                                                    selectedElement === label ? selectedColor : "#382e35",
                                                color:
                                                    selectedElement === label ? "#ffffff" : "#B79C8B",
                                                borderRadius: "5px",
                                                textAlign: "center",
                                                cursor: "pointer",
                                                height: "2rem",
                                                width: "5rem",
                                                margin: "0 3px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "10px",
                                                lineHeight: "00px",
                                            }}
                                            onClick={() => {
                                                handleOpenDrawer(label, index) // Open drawer with the selected index
                                                setDrawerSelectedIndex(index)
                                                handleCategorySelection(label, index)
                                                // //console.log("label", label.toLowerCase().split(" ")[0])
                                                handleEventSelection(label)
                                                handleEventSelection(label.toLowerCase().split(" ")[0])
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                style={{ textTransform: "initial" }}
                                            >
                                                {label}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>

                            <Grid
                                container
                                spacing={2}
                                justifyContent="center"
                                sx={{ mt: 0.2 }}
                            >
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((value, index) => (
                                    <Grid item key={index} xs={2.2} sm={2.2} textAlign="center">
                                        <Box
                                            className="round"
                                            sx={{
                                                width: "35px",
                                                height: "35px",
                                                borderRadius: "50%",
                                                border: "1px solid #837064",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                margin: "0 auto",
                                                fontSize: "14px",
                                                color: "#837064",
                                                backgroundColor: "transparent",
                                                cursor: "pointer",
                                                "&:active": {
                                                    backgroundColor: "#FED358",
                                                },
                                                opacity: isSum ? 0 : 1,
                                                pointerEvents: isSum ? "none" : "auto",
                                            }}
                                            onClick={() => {
                                                if (!isSum) {
                                                    handleOpenDrawer(value) // Open drawer and pass value
                                                    handleCategorySelection(value.toString(), index)
                                                    handleEventSelection("default")

                                                    // Toggle selection of the number
                                                    setSelectedNumbers((prev) =>
                                                        prev.includes(value)
                                                            ? prev.filter((num) => num !== value)
                                                            : [...prev, value]
                                                    )
                                                }
                                            }}
                                        >
                                            {value}
                                        </Box>

                                        <Typography
                                            className="rate"
                                            variant="body2"
                                            sx={{
                                                marginTop: "2px",
                                                color: "#B79C8B",
                                                fontSize: "0.75rem",
                                                textAlign: "center",
                                                opacity: isSum ? 0 : 1,
                                            }}
                                        >
                                            9
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>

                            {isSum && (
                                <Grid
                                    container
                                    spacing={1}
                                    justifyContent="center"
                                    style={{
                                        position: "absolute",
                                        top: "35%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        width: "100%",
                                        // backgroundColor: "white",
                                    }}
                                >
                                    {tabLabels.map((label, index) => (
                                        <Grid item key={index} xs={3} sm={3}>
                                            <Box
                                                style={{
                                                    backgroundColor:
                                                        selectedCategory === label
                                                            ? selectedColor
                                                            : "#382e35",
                                                    color: "#ffffff",
                                                    borderRadius: "5px",
                                                    textAlign: "center",
                                                    cursor: "pointer",
                                                    height: "2rem",
                                                    width: "5rem",
                                                    margin: "0 3px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "10px",
                                                    lineHeight: "00px",
                                                }}
                                                onClick={() => {
                                                    handleOpenDrawer(label, index)
                                                    setDrawerSelectedIndex(index)
                                                    handleCategorySelection(label, index)
                                                    handleEventSelection(
                                                        label.toLowerCase().split(" ")[0]
                                                    )
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    style={{ textTransform: "initial" }}
                                                >
                                                    {label}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    </Box>
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
                            {snackbarMessage}
                        </MuiAlert>
                    </Snackbar> */}

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
                                color: "black",
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
                                color: "black",
                                backgroundColor: "#323738",
                            }}
                        >
                            {/* Top Buttons and Categories */}
                            <Box
                                sx={{
                                    mt: 2,
                                    mb: 1.2,
                                    marginX: 1.2,
                                    borderBottom: "1px solid #454037",
                                    width: "100%",
                                }}
                            >
                                <Tabs
                                    value={activeTopButton}
                                    onChange={handleButtonClick}
                                    TabIndicatorProps={{ style: { display: "none" } }}
                                >
                                    {["A", "B", "C", "D", "E", "SUM"].map((label, index) => (
                                        <TopButton
                                            key={index}
                                            label={activeTopButton === index ? "" : label}
                                            selected={activeTopButton === index}
                                            index={activeTopButton === index ? index : ""}
                                        />
                                    ))}
                                </Tabs>
                            </Box>

                            <Grid
                                container
                                spacing={1}
                                style={{
                                    margin: "0px auto 5px",
                                }}
                            >
                                {tabLabels.map((label, index) => (
                                    <Grid
                                        item
                                        xs={3}
                                        sm={3}
                                        key={index}
                                        style={{
                                            padding: "0 5px",
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Grid
                                            style={{
                                                backgroundColor:
                                                    selectedCategory === label
                                                        ? selectedColor
                                                        : "#382e35",
                                                color: "#B79C8B",
                                                borderRadius: "5px",
                                                textAlign: "center",
                                                cursor: "pointer",
                                                height: "2rem",
                                                width: "5rem",
                                                margin: "0 0px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "10px",
                                                lineHeight: "20px",
                                            }}
                                            onClick={() => {
                                                handleCategorySelection(label, index)
                                                // //console.log("categoryLabel", label, index)
                                            }} // Update category and color
                                        >
                                            <Typography
                                                variant="body2"
                                                style={{ textTransform: "initial" }}
                                            >
                                                {label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Selectable Number Boxes */}
                            <Grid
                                container
                                spacing={2}
                                justifyContent="center"
                                style={{
                                    opacity: isSum ? 0 : 1,
                                    pointerEvents: isSum ? "none" : "auto",
                                    height: isSum ? 0 : "auto",
                                    overflow: "hidden",
                                    transition: "opacity 0.3s, height 0.3s",
                                }}
                            >
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((value, index) => (
                                    <Grid item key={index} xs={2.2} sm={2.2} textAlign="center">
                                        <Box
                                            className="round"
                                            sx={{
                                                width: "35px",
                                                height: "35px",
                                                borderRadius: "50%",
                                                border: selectedNumbers.includes(value)
                                                    ? `2px solid ${selectedColor}`
                                                    : "1px solid #837064",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                margin: "0 auto",
                                                fontSize: "0.8rem",
                                                color: selectedNumbers.includes(value)
                                                    ? "#fff"
                                                    : "#837064",
                                                backgroundColor: selectedNumbers.includes(value)
                                                    ? selectedColor
                                                    : "transparent",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => handleNumberSelection(value)}
                                        >
                                            {value}
                                        </Box>

                                        <Typography
                                            className="rate"
                                            variant="body2"
                                            sx={{
                                                marginTop: "2px",
                                                color: "#837064",
                                                fontSize: "0.75rem",
                                                textAlign: "center",
                                            }}
                                        >
                                            9
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Bet Amount Selection */}
                            <Grid padding={1}>
                                <Grid item xs={12}>
                                    <Grid container justifyContent="space-between">
                                        <Typography
                                            variant="h6"
                                            sx={{ color: "#FDE4BC", fontSize: "1rem" }}
                                        >
                                            Balance
                                        </Typography>
                                        <Grid sx={{ display: "flex", jusitfyContent: "space-between", gap: "10px" }}>
                                            {[1, 10, 100, 1000].map((amount) => (
                                                <Button
                                                    key={amount}
                                                    variant="contained"
                                                    style={{
                                                        ...(activeBetAmount === amount
                                                            ? { backgroundColor: selectedColor, color: "#201d2b" }
                                                            : { backgroundColor: "#382e35", color: "#B79C8B" }),
                                                        boxShadow: "none", // Add this to remove shadow
                                                        minWidth: "30px",
                                                        padding: "2px 6px",
                                                        fontSize: "17px"
                                                    }}
                                                    onClick={() => handleBetAmount(amount)}
                                                >
                                                    {"₹" + amount}
                                                </Button>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Quantity Selection */}
                                <Grid item xs={12} mt={2}>
                                    <Grid container>
                                        <Grid
                                            item
                                            container
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{ color: "#FDE4BC", flexWrap: "nowrap" }}
                                        >
                                            <Typography
                                                variant="h6"
                                                sx={{ fontSize: isSmallScreen2 ? "15px" : "17px", display: "flex", justifyContent: "flex-start" }}
                                            >
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
                                                        color: "#FDE4BC",
                                                    }}
                                                    InputProps={{
                                                        style: {
                                                            color: "#FDE4BC",
                                                            borderRadius: 15,
                                                            height: isSmallScreen2 ? 25 : 30,
                                                            fontSize: isSmallScreen2 ? "15px" : "17px",
                                                        },
                                                    }}
                                                    InputLabelProps={{
                                                        style: { color: "#B79C8B", fontSize: isSmallScreen2 ? "8px" : "12px", },
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
                                            sx={{ color: "#FDE4BC" }}>
                                            {/* Multiplier Selection */}

                                            <Typography
                                                variant="h6"
                                                sx={{ color: "#FDE4BC", fontSize: isSmallScreen2 ? "15px" : "17px" }}
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
                                                            setMultiplier(
                                                                multiplier > 1 ? multiplier - 1 : 1
                                                            )
                                                        }
                                                        sx={{
                                                            color: "white",
                                                            padding: "4px",
                                                        }}
                                                    >
                                                        <RemoveIcon
                                                            fontSize="small"
                                                            sx={{ color: selectedColor, fontSize: 38 }}
                                                        />
                                                    </IconButton>
                                                </Grid>
                                                <Grid item>
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            // border: `1px solid ${selectedColor}`,
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
                                                            color: "white",
                                                            padding: "4px",
                                                        }}
                                                    >
                                                        <AddIcon
                                                            fontSize="small"
                                                            sx={{ color: selectedColor, fontSize: 38 }}
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
                                        sx={{ color: "#FDE4BC" }}
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
                                                        ? { backgroundColor: selectedColor, color: "#201d2b" }
                                                        : { backgroundColor: "#382e35", color: "#B79C8B" }),
                                                }}
                                            >
                                                X{value}
                                            </div>
                                        ))}
                                    </Grid>
                                    <Typography sx={{ alignItems: "center", display: "flex", mt: 1 }}>
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
                            color: "#FED358 ", // Checked color
                            fontSize: 22, // Slightly bigger for effect
                          }}
                        />
                      }
                    />
                                        <span style={{ marginLeft: 8, fontSize: "13px", color: "#B79C8B" }}>
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

                            {/* Total Bet Calculation */}
                            <Grid item xs={12} mt={2}>
                                <Grid container justifyContent="space-around" spacing={0}>
                                    <Grid item xs={3}>
                                        <Button
                                            onClick={handleCancelBet}
                                            fullWidth
                                            style={{ backgroundColor: "#382e35", color: "#B79C8B", textTransform: "none", borderRadius: "0px" }}
                                            variant="contained"
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Button
                                            onClick={handlePlaceBet}
                                            fullWidth
                                            style={{ background: selectedColor, color: "black", textTransform: "none", borderRadius: "0px" }}
                                            variant="contained"
                                            disabled={!agreed || isPlacingBet}
                                        >
                                            {`Total amount ₹${displayBetAmount}`}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                     {/*       <>
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
                                                color: "#F5B73B",
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
                            Bet placed successfully!
                        </MuiAlert>
                    </Snackbar> */}

                    <Grid
                        mt={2}
                        container
                        justifyContent="center"
                        sx={{ marginBottom: "15%" }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                maxWidth: "95%",
                                margin: "0 auto",
                            }}
                        >
                            <Grid container spacing={1} sx={{ mb: 1.5 }}>
                                {tabData.map((tab, index) => (
                                    <Grid item xs={4} key={index}>
                                        <Box
                                            onClick={() => setActiveTab(index)}
                                            sx={{
                                                height: "40px", // Adjust this value to change the tab height
                                                background:
                                                    activeTab === index ? "linear-gradient(90deg,#24ee89,#9fe871)" : "#323738",
                                                color: activeTab === index ? "#221f2e" : "#B79C8B",
                                                borderRadius: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                                transition: "all 0.3s",
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontSize: "14.8px",
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

                            <Box sx={{ mt: 2 }}>
                                {activeTab === 0 && (
                                    <TabPanel>
                                        <GameHistory data={historyData}
                                            page={historyPage}
                                            setPage={setHistoryPage}
                                            totalPage={gameTotalPage}
                                        />
                                        <Box
                                            sx={{
                                                width: "100%",
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: "30px",
                                                marginTop: "20px",
                                                backgroundColor: "#323738",
                                                padding: { xs: "10px 0", sm: "15px 0" },
                                                borderRadius: "0 0 10px 10px",
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                onClick={() => setHistoryPage(historyPage - 1)}
                                                disabled={historyPage === 1}
                                                sx={{
                                                    marginRight: "10px",
                                                    backgroundColor: "#FED358",
                                                    "&.Mui-disabled": {
                                                        backgroundColor: "#382e35",
                                                        color: "#B79C8B",
                                                    },
                                                    "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 7px" },
                                                }}
                                            >
                                                <ArrowBackIosRoundedIcon style={{ color: historyPage === 1 ? "#B79C8B" : "#323738" }} />
                                            </Button>
                                            <Grid sx={{ display: "flex", alignItems: "center", color: "#B79C8B" ,fontSize:"14px"}}>
                                                {historyPage}/{gameTotalPage}
                                            </Grid>
                                            <Button
                                                variant="contained"
                                                onClick={() => setHistoryPage(historyPage + 1)}
                                                disabled={historyPage === gameTotalPage}
                                                sx={{
                                                    marginLeft: "10px",
                                                    backgroundColor: "#FED358",
                                                    "&.Mui-disabled": {
                                                        backgroundColor: "#382e35",
                                                        color: "#B79C8B",
                                                    },
                                                    "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 7px" },
                                                }}
                                            >
                                                <ArrowForwardIosRoundedIcon style={{ color: historyPage === gameTotalPage ? "#B79C8B" : "#323738" }} />
                                            </Button>
                                        </Box>
                                    </TabPanel>
                                )}
                                {activeTab === 1 && (
                                    <TabPanel>
                                        <Chart5D data={{ statisticsData, historyData, chartPage, setChartPage, gameTotalPage }} />
                                    </TabPanel>
                                )}
                                {activeTab === 2 && (
                                    <TabPanel>
                                        <FiveDMyHistory
                                            bets={bets}
                                            page={betPage}
                                            setPage={setBetPage}
                                            totalPage={betTotalPage}
                                        />

                                    </TabPanel>

                                )}
                            </Box>
                        </Box>
                    </Grid>

                    <>


                        <div
                            style={{
                                display: show ?( open ? "flex" : "none") :"flex", // Toggle visibility based on `open`
                                // display: "flex",
                                position: "absolute",
                                zIndex: 2000,
                                // left: 10,
                                top: "0px", jusitfyContent: "center",
                                alignItems: "center",
                                width: isSmallScreen ? "100%" : "calc(100% - 50px)",
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
                                    // top:"20%",
                                    height: "60%",
                                    backgroundImage: `url(${popupresult
                                        ? gameResult === "Won"
                                            ? "/assets/icons/images/popup-win.webp"
                                            : "/assets/icons/images/popup-loss.webp"
                                        : "/assets/icons/images/popup-pending.webp"
                                        })`,
                                    backgroundSize: "contain",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
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
                                        color: gameResult === "Won" ? "white" : "#7c9dc2",
                                        fontWeight: "bold",
                                        marginTop: "5.7rem",
                                        fontSize: "30px"
                                    }}
                                >
                                    {popupresult
                                        ? gameResult === "Won"
                                            ? "Congratulations"
                                            : "Sorry"
                                        : "Pending"}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    style={{ color: "#1E2637", marginBottom: "0rem", width: '90%', display: "flex", justifyContent: "center" }}
                                >
                                    {formatLotteryResults(popupresult)}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="#f45446"
                                    mb={3}
                                    mt={3}
                                >
                                    {dialogContent}
                                    <br />
                                    <span
                                        style={{
                                            color: gameResult === "Won" ? "green" : "red",
                                            fontWeight: "bold", fontSize: "20px"
                                        }}
                                    >
                                        ₹{winloss}
                                    </span>

                                    <br />
                                    <span style={{ fontSize: window.innerWidth <= 340 ? "11px" : "12px", color: "#768096" }}>
                                        Period:5D {timerTypeChange[popupTimer]} {popupperiodid}
                                    </span>
                                    <br />
                                    {/* <span style={{ fontSize: "1rem", fontWeight: "bold", color: "#768096" }}>
                                       
                                    </span> */}
                                </Typography>
                                <Typography sx={{ color: gameResult ? "white" : "#7c9dc2", mt: 3,display:"flex",alignItems:"center",flexDirection:"row" }}>
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
                                <IconButton onClick={() => setOpen(false)} sx={{ position: "absolute", bottom: -60 }}>
                                    <CancelOutlinedIcon
                                        sx={{ color: "white", fontSize: "45px" }}
                                    />
                                </IconButton>
                                {/* <Button onClick={() => setOpen(false)}>Close</Button> */}
                            </div>
                        </div>
                    </>
                </div>
                {/* <br /> */}
                {/* <br /> */}
                <br />
            </Mobile>
        </div>
    )
}

export default FiveDPage
