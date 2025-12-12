import React, { useState, useEffect, useRef, useContext } from "react"
import IconButton from "@mui/material/IconButton"
import {
    Typography,
    Grid,
    Box,
    TextField,
    Button,
    Drawer,
    Divider,
} from "@mui/material"
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"

import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useNavigate } from "react-router-dom"
// import axios from "axios";
import speedPinball1 from "../../assets/race-ball/speed_pinball1.webp"
import speedPinball2 from "../../assets/race-ball/speed_pinball2.webp"
import speedPinball3 from "../../assets/race-ball/speed_pinball3.webp"
import speedPinball4 from "../../assets/race-ball/speed_pinball4.webp"
import speedPinball5 from "../../assets/race-ball/speed_pinball5.webp"
import speedPinball6 from "../../assets/race-ball/speed_pinball6.webp"
import speedPinball7 from "../../assets/race-ball/speed_pinball7.webp"
import speedPinball8 from "../../assets/race-ball/speed_pinball8.webp"
import speedPinball9 from "../../assets/race-ball/speed_pinball9.webp"
import speedPinball10 from "../../assets/race-ball/speed_pinball10.webp"
import { Snackbar } from "@mui/material"
import MuiAlert from "@mui/material/Alert"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material/styles"
import RemoveIcon from "@mui/icons-material/IndeterminateCheckBox"
import AddIcon from "@mui/icons-material/AddBox"
import { CircularProgress, Backdrop } from "@mui/material"
import { styled } from "@mui/material"
import GameWalletCard from "../../components/games/common/GameWalletCard"
import { domain, carRaceAnimation } from "../../utils/Secret"
import Mobile from "../../components/layout/Mobile"
import { useAuth } from "../../context/AuthContext"
import CountdownTimer from "../../components/games/common/CountdownTimer"
import { UserContext } from "../../context/UserState"
import RaceHistory from "../../components/games/carRace/RaceHistory"
import RacingMyHistory from "../../components/games/carRace/RacingMyHistory"
const countdownSound = new Audio("/assets/sound.mp3")
countdownSound.loop = true

const images = [
    { id: 4, src: "/assets/clock-unselected.webp", altSrc: "/assets/clock-selected.webp", subtitle: "30Sec" },
    { id: 1, src: "/assets/clock-unselected.webp", altSrc: "/assets/clock-selected.webp", subtitle: "1Min" },
    { id: 2, src: "/assets/clock-unselected.webp", altSrc: "/assets/clock-selected.webp", subtitle: "3Min" },
    { id: 3, src: "/assets/clock-unselected.webp", altSrc: "/assets/clock-selected.webp", subtitle: "5Min" },
]

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
}

const tabData = [{ label: "Game History" }, { label: "My History" }]

const TabPanel = ({ children, value, index }) => {
    return (
        <div hidden={value !== index}>
            {value === index && <Box p={0} m={0}>{children}</Box>}
        </div>
    )
}

const NumberCircle = styled(Box)(() => ({
    width: 26,
    height: 26,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "10px 0px 0px 6px",
}))

const CarRacingPage = ({ timerKey }) => {
    const [activeId, setActiveId] = useState(images[0].id)
    const [selectedTimer, setSelectedTimer] = useState("30sec")
    const [rows, setRows] = useState([])
    const [openDialog, setOpenDialog] = useState(false)
    const [periodId, setPeriodId] = useState(null)
    const [lastPeriodId, setLastPeriodId] = useState(null)
    const [remainingTime, setRemainingTime] = useState(null)
    const [index, setIndex] = useState(0)
    const [historyPage, setHistoryPage] = useState(1)
    const [betsPage, setBetsPage] = useState(1)
    const [gameTotalPage, setGameTotalPage] = useState(1)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [betAmount, setBetAmount] = useState(1)
    const [multiplier, setMultiplier] = useState(1)
    const [totalBet, setTotalBet] = useState(0)
    const [open, setOpen] = useState(false)
    const [dialogContent, setDialogContent] = useState("")
    const [gameResult, setGameResult] = useState("")
    const [bets, setBets] = useState([])
    const [selectedColor, setSelectedColor] = useState("RGB(71,129,255)")
    const [winloss, setWinLoss] = useState(0)
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
    const [popupMessage, setPopupMessage] = useState("");
    const [activeTab, setActiveTab] = useState(0)
    const theme = useTheme()
    const [popupresult, setPopupResult] = useState([])
    const [popupperiodid, setPopupPeriodId] = useState("")
    const [popupTimer, setPopupTimer] = useState("")
    const [processedPeriodIds, setProcessedPeriodIds] = useState(() => {
        const storedProcessedPeriodIds = localStorage.getItem("processedPeriodIds")
        return storedProcessedPeriodIds ? new Set(JSON.parse(storedProcessedPeriodIds)) : new Set()
    })
    const [sessionBets, setSessionBets] = useState([])
    const [currentBetIndex, setCurrentBetIndex] = useState(-1)
    const [activeButton, setActiveButton] = useState(1)
    const [isPlacingBet, setIsPlacingBet] = useState(false)
    const [selected, setSelected] = useState("First_Place")
    const [isLoading, setIsLoading] = useState(false)
    const [activeBetAmount, setActiveBetAmount] = useState(1)
    const [customBetAmount, setCustomBetAmount] = useState("")
    const [displayBetAmount, setDisplayBetAmount] = useState(1)
    const [selectedItems, setSelectedItems] = useState([])

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))
    const isSmallScreen2 = useMediaQuery(theme.breakpoints.down(400))
    const [betPlaced, setBetPlaced] = useState(false)
    const navigate = useNavigate()
    const [betTotalPage, setBetTotalPage] = useState(1)
    const { axiosInstance } = useAuth()
    const [agreed, setAgreed] = useState(true)
    const [show, setShow] = useState(true)
    const { userWallet } = useContext(UserContext)
    const previousTimer = useRef(selectedTimer)
    const pendingBetsCache = useRef({})
    const [userBets, setUserBets] = useState(() => {
        const storedUserBets = localStorage.getItem("userBets")
        return storedUserBets ? JSON.parse(storedUserBets) : []
    })
    const [popupQueue, setPopupQueue] = useState(() => {
        const storedPopupQueue = localStorage.getItem("popupQueue")
        return storedPopupQueue ? JSON.parse(storedPopupQueue) : []
    })
    const lastPeriodIdRef = useRef(null)


    const buttonStyles = (label) => ({
        width: "105px",
        height: "30px",
        gap: "10px",
        borderRadius: "20px",
        backgroundColor: selected === label ? "#FF5722" : "transparent",
        border: "2px solid #FF5722",
        color: selected === label ? "white" : "#FF5722",
        "&:hover": {
            backgroundColor: selected === label ? "#FF5722" : "transparent",
        },
    })

    const handleTopClick = (label) => {
        setSelectedItems([])
        setSelected((prev) => (prev === label ? null : label))
    }

    const gradientMapping = [
        { text: "Big", gradient: "linear-gradient(90deg, #FF9000 0%, #FFD000 100%)" },
        { text: "Small", gradient: "linear-gradient(90deg, #00BDFF 0%, #5BCDFF 100%)" },
        { text: "Odd", gradient: "linear-gradient(90deg, #FD0261 0%, #FF8A96 100%)" },
        { text: "Even", gradient: "linear-gradient(90deg, #00BE50 0%, #9BDF00 100%)" },
    ]

    const getGradientForItem = (item) => {
        const match = gradientMapping.find((mapping) => mapping.text === item)
        return match ? match.gradient : "transparent"
    }
    const toggleAgree = () => {
        setAgreed((prev) => !prev)
    }
    const handleToggle = () => {
        setShow(!show)
    }
    const timerTypeMap = {
        "30sec": "THIRTY_TIMER",
        "1min": "ONE_MINUTE_TIMER",
        "3min": "THREE_MINUTE_TIMER",
        "5min": "FIVE_MINUTE_TIMER",
        "10min": "TEN_MINUTE_TIMER",
    }

    const timerTypeChange = {
        "THIRTY_TIMER": "30 sec",
        "ONE_MINUTE_TIMER": "1 Minute",
        "THREE_MINUTE_TIMER": "3 Minute",
        "FIVE_MINUTE_TIMER": "5 Minute",
        "TEN_MINUTE_TIMER": "10 Minute",
    }

    const labelMap = {
        "1st": "First_Place",
        "2nd": "Second_Place",
        "3rd": "Third_Place",
    }

    const fetchGameHistory = async (pageToFetch = betsPage) => {
        if (!periodId || periodId === "Loading...") return

        setIsLoading(true)
        const timerType = timerTypeMap[selectedTimer] || "THIRTY_TIMER"

        try {
            const response = await axiosInstance.get(`${domain}/api/master-game/car-race/history`, {
                params: { timerType, page: pageToFetch, limit: 10 },
                withCredentials: true,
            })

            if (!response.data.success) {
                console.error("Error: Response not successful", response.data.message)
                return
            }

            const historyData = response.data.data.history
            setGameTotalPage(response.data.data.pagination.totalPages)
            setRows({ history: historyData })

            if (historyData.length > 0) {
                const latestPeriodId = historyData[0].periodId
                setLastPeriodId(latestPeriodId)
            }
        } catch (err) {
            console.error("Error fetching game history:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchGameHistory(historyPage)
    }, [historyPage, selectedTimer, periodId])

    const handleTimerChange = (id, subtitle) => {
        setActiveId(id)
        const newTimerKey = subtitle.toLowerCase()
        setSelectedTimer(newTimerKey)
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
                    newTimerKey = "30sec"
                    break
                default:
                    newTimerKey = "30sec"
            }
            setSelectedTimer(images.find((img) => img.id === id).subtitle.toLowerCase())
            setActiveId(id)
        }
    }

    const navigateToPage = () => {
        navigate("/")
    }


    const handleOpenDrawer = (selectedIndex) => {
        setDrawerOpen(true)
        setAgreed(true)
    }

    const handleCloseDrawer = () => {
        setDrawerOpen(false)
        setSelectedItems([])
    }

    const handleBetAmount = (amount) => {
        setBetAmount(amount)
        setActiveBetAmount(amount)
        setCustomBetAmount("")
    }

    const handleMultiplier = (value) => {
        setMultiplier(value)
        setActiveButton(value)
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
            case "even":
                setSelectedColor("rgb(200,111,255)")
                break
            case "odd":
                setSelectedColor("rgb(251,91,91)")
                break
            case "small":
                setSelectedColor("rgb(110,168,244)")
                break
            case "big":
                setSelectedColor("rgb(254,170,87)")
                break
            default:
                setSelectedColor("#0f6518")
        }
    }

    const handleCustomBetChange = (event) => {
        const value = event.target.value
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setCustomBetAmount(value)
            const numericValue = parseFloat(value)
            if (!isNaN(numericValue) && numericValue > 0) {
                setBetAmount(numericValue)
                setActiveBetAmount(numericValue)
                setDisplayBetAmount(numericValue)
            }
        }
    }

    useEffect(() => {
        const totalBet = betAmount * multiplier * selectedItems.length
        setDisplayBetAmount(totalBet)
    }, [betAmount, multiplier, selectedItems])

    const RESTRICTED_TIMES = ["00:06", "00:05", "00:04", "00:03", "00:02", "00:01"]
    const VALID_CAR_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    const fetchBets = async () => {
        const timerType = timerTypeMap[selectedTimer] || "THIRTY_TIMER"
        try {
            const response = await axiosInstance.get(`${domain}/api/master-game/car-race/bet-history`, {
                params: { timerType, page: betsPage, limit: 10 },
                withCredentials: true,
            })

            const betData = response.data.data.bets

            // Filter bets placed during the current session
            const sessionBetsData = betData.filter((bet) => sessionBets.includes(bet.periodId))

            // Filter out bets that have already been processed
            const unprocessedBets = sessionBetsData.filter(
                (bet) => bet.resultElements !== null && !processedPeriodIds.has(bet.periodId)
            )

            // Add unprocessed bets to the popup queue
            if (unprocessedBets.length > 0) {
                setPopupQueue((prevQueue) => {
                    const newBets = unprocessedBets.filter(
                        (bet) => !prevQueue.some((queuedBet) => queuedBet.periodId === bet.periodId)
                    )
                    return [...prevQueue, ...newBets]
                })

                // Start processing the queue if it's not already running
                if (currentBetIndex === -1) {
                    setCurrentBetIndex(0)
                }
            }

            setBets(betData)
            setBetTotalPage(response.data.data.pagination.totalPages)
        } catch (error) {
            console.error("Error fetching bet history:", error)
        }
    }

    useEffect(() => {
        return () => {
            // Clear sessionBets when the component unmounts
            setSessionBets([])
        }
    }, [])

    useEffect(() => {
        // Fetch bet history when the periodId changes
        if (periodId && periodId !== lastPeriodIdRef.current) {
            fetchBets()
            lastPeriodIdRef.current = periodId
        }
    }, [periodId])

    useEffect(() => {
        // Check if the current periodId is in userBets and not in processedPeriodIds
        if (periodId && userBets.includes(periodId) && !processedPeriodIds.has(periodId)) {
            // Find the bet for the current periodId
            const currentBet = bets.find((bet) => bet.periodId === periodId)

            // Only show the popup if resultElements is not null
            if (currentBet && currentBet.resultElements) {
                // Set popup content
                setGameResult(currentBet.isWin ? "Won" : "Lost")
                setWinLoss(currentBet.isWin ? currentBet.winAmount : currentBet.actualBetAmount)
                setPopupPeriodId(currentBet.periodId)
                setPopupResult(currentBet.resultElements)
                setPopupTimer(currentBet.selectedTimer)
                setDialogContent(currentBet.isWin ? "Bonus" : "You lost the bet")
                setOpen(true) // Show the popup

                // Mark this periodId as processed
                setProcessedPeriodIds((prevSet) => {
                    const newSet = new Set(prevSet)
                    newSet.add(periodId)
                    localStorage.setItem("processedPeriodIds", JSON.stringify(Array.from(newSet)))
                    return newSet
                })

                const timer = setTimeout(() => {
                    setOpen(false)

                    // Move to the next bet in the queue
                    setCurrentBetIndex((prevIndex) => prevIndex + 1)
                }, 3000) // 3 seconds

                return () => clearTimeout(timer)

                // Remove the periodId from userBets (optional)
                setUserBets((prevBets) => {
                    const newBets = prevBets.filter((id) => id !== periodId)
                    localStorage.setItem("userBets", JSON.stringify(newBets))
                    return newBets
                })
            }
        }
    }, [periodId, userBets, processedPeriodIds, bets])

    const handlePageChange = (newPage) => {
        setBetsPage(newPage)
    }

    useEffect(() => {
        const delay = setTimeout(() => {
            if (popupQueue.length > 0 && currentBetIndex < popupQueue.length) {
                const currentBet = popupQueue[currentBetIndex];

                if (!currentBet) {
                    console.error("currentBet is undefined or null.");
                    return;
                }

                // Check if the bet has already been processed
                if (!processedPeriodIds.has(currentBet.periodId)) {
                    // Set popup content
                    setGameResult(currentBet.isWin ? "Won" : "Lost");
                    setWinLoss(currentBet.isWin ? currentBet.winAmount : currentBet.actualBetAmount);
                    setPopupPeriodId(currentBet.periodId);
                    setPopupResult(currentBet.resultElements);
                    setPopupTimer(currentBet.selectedTimer);
                    setDialogContent(currentBet.isWin ? "Bonus" : "You lost the bet");
                    setOpen(true); // Show the popup

                    // Mark this bet as processed
                    setProcessedPeriodIds((prevSet) => {
                        const newSet = new Set(prevSet);
                        newSet.add(currentBet.periodId);
                        localStorage.setItem("processedPeriodIds", JSON.stringify(Array.from(newSet)));
                        return newSet;
                    });

                    // Close the popup after 3 seconds and move to the next bet
                    const timer = setTimeout(() => {
                        setOpen(false);

                        // Move to the next bet in the queue
                        setCurrentBetIndex((prevIndex) => prevIndex + 1);
                    }, 3000); // 3 seconds for closing

                    return () => clearTimeout(timer);
                } else {
                    // If the bet has already been processed, move to the next bet
                    setCurrentBetIndex((prevIndex) => prevIndex + 1);
                }
            } else if (popupQueue.length > 0 && currentBetIndex >= popupQueue.length) {
                // All popups displayed, reset the queue
                setPopupQueue([]);
                setCurrentBetIndex(-1);
            }
        }, 2000); // 3-second delay before starting the logic

        return () => clearTimeout(delay);
    }, [popupQueue, currentBetIndex, processedPeriodIds]);

    // Separate effect to close the popup automatically
    useEffect(() => {
        if (open) {
            const closeTimer = setTimeout(() => {
                //console.log("Closing popup");
                setOpen(false);
            }, 3000);

            return () => clearTimeout(closeTimer);
        }
    }, [open]);
    useEffect(() => {
        if (remainingTime <= 0) {
            fetchBets()
        }
    }, [remainingTime])

    useEffect(() => {
        const cleanedUserBets = userBets.filter((periodId) => !processedPeriodIds.has(periodId))
        setUserBets(cleanedUserBets)
    }, [processedPeriodIds])

    // const [snackbarMessage, setSnackbarMessage] = useState("")
    const handlePlaceBet = async () => {
        const processedSelections = processSelectedItems(selectedItems)
        const { carNumbers, sizes, parities } = processedSelections

        // Calculate total elements and bet
        const totalBetElements = carNumbers.length + sizes.length + parities.length
        const totalBet = betAmount * totalBetElements

        // Validate bet
        const validationError = validateBet(carNumbers, totalBet)
        if (validationError) {
            setPopupMessage(validationError)
            setIsPopupVisible(true);
            // Hide the popup after 2 seconds
            setTimeout(() => {
                setIsPopupVisible(false);
            }, 2000);
            return
        }

        // Time restriction check
        if (RESTRICTED_TIMES.includes(remainingTime)) {
            setPopupMessage("You can't place a bet in the last 5 seconds.")
            setIsPopupVisible(true);
            // Hide the popup after 2 seconds
            setTimeout(() => {
                setIsPopupVisible(false);
            }, 2000);
            return
        }

        // Prepare bet data
        const betData = {
            carNumbers,
            sizes,
            parities,
            betAmount: totalBet,
            multiplier,
            periodId,
            selectedTimer: timerTypeMap[selectedTimer],
            selectedSection: selected,
        }

        setIsPlacingBet(true)

        try {
            const response = await axiosInstance.post(`${domain}/api/master-game/car-race/bet`, betData, {
                withCredentials: true,
            })

            if (response.status === 201) {
                // Add the bet to sessionBets
                setSessionBets((prevBets) => [...prevBets, periodId])

                // Show success message
                setPopupMessage("Bet placed successfully!")
                setIsPopupVisible(true);
                // Hide the popup after 2 seconds
                setTimeout(() => {
                    setIsPopupVisible(false);
                }, 2000);
            } else {
                throw new Error(response.data.message || "Error placing bet")
            }
        } catch (error) {
            console.error("Error placing bet:", error)
            setPopupMessage(error.response?.data?.message || "Failed to place bet. Please try again.")
            setIsPopupVisible(true);
            // Hide the popup after 2 seconds
            setTimeout(() => {
                setIsPopupVisible(false);
            }, 2000);
        } finally {
            setIsPlacingBet(false)
            setDisplayBetAmount(1)
            setSelectedItems([])
            setCustomBetAmount("")
            handleCloseDrawer()
            setActiveBetAmount(1)
            fetchBets()
            fetchGameHistory()
        }
    }

    const getBallImage = (number) => {
        return `../../assets/race-ball/speed_pinball${number}.webp`
    }

    const processSelectedItems = (items) => {
        return items.reduce(
            (acc, item) => {
                if (typeof item === "number") {
                    acc.carNumbers.push(item)
                } else if (["Big", "Small"].includes(item)) {
                    acc.sizes.push(item)
                } else if (["Odd", "Even"].includes(item)) {
                    acc.parities.push(item)
                }
                return acc
            },
            { carNumbers: [], sizes: [], parities: [] }
        )
    }

    const validateBet = (carNumbers, totalBet) => {
        // Check for invalid car numbers
        const invalidNumbers = carNumbers.filter(
            (num) => !VALID_CAR_NUMBERS.includes(num)
        )
        if (invalidNumbers.length > 0) {
            return `Invalid car numbers selected: ${invalidNumbers.join(", ")}`
        }

        if (totalBet <= 0) {
            return "Invalid bet amount"
        }

        if (userWallet < totalBet) {
            return "Insufficient balance to place this bet"
        }

        return null
    }

    const handleCancelBet = () => {
        setSelectedItems([])
        setActiveBetAmount(null)
        setBetAmount(1)
        setTotalBet(1)
        setMultiplier(1)
        setCustomBetAmount("")
        handleCloseDrawer()
    }

    // useEffect(() => {
    //     setTotalBet(betAmount * multiplier)
    // }, [betAmount, multiplier])

    const handleSelection = (item) => {
        setSelectedItems((prev) => {
            if (prev.includes(item)) {
                return prev.filter((i) => i !== item)
            }
            return [...prev, item]
        })
    }

    return (
        <>
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
                                    gap: "10px",
                                    mr: "20px",
                                }}
                            >
                                <Box
                                    onClick={() => navigate("/customer-service")}
                                    component="img"
                                    src="../assets/icons/customerCare.webp"
                                    alt="Support Agent Icon"
                                    sx={{ width: "25px", height: "25px", cursor: "pointer" }}
                                />
                                {isSoundOn && (
                                    <Box
                                        component="img"
                                        src="../assets/icons/sound.webp"
                                        alt="Sound Icon"
                                        onClick={() => setIsSoundOn(!isSoundOn)}
                                        sx={{ width: "25px", height: "25px", cursor: "pointer" }}
                                    />
                                )}
                                {!isSoundOn && (
                                    <Box
                                        component="img"
                                        src="../assets/icons/soundMute.webp"
                                        onClick={() => setIsSoundOn(!isSoundOn)}
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
                            width: "calc(100% - 30px)",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                            marginTop: "-65px",
                            backgroundColor: "#3a4142",
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
                                        color: activeId === image.id ? "black" : "#B3BEC1",
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
                                        Race
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

                    <CountdownTimer
                        setPeriodId={setPeriodId}
                        periodId={periodId}
                        selectedTimer={selectedTimer}
                        remainingTime={remainingTime}
                        setRemainingTime={setRemainingTime}
                        gameType="carRace"
                    />

                    <div
                        className="gameframe"
                        style={{
                            position: "relative",
                            paddingTop: "57.72%",
                            overflow: "hidden",
                            margin: "0 8px",
                        }}
                    >
                        <iframe
                            src={`${carRaceAnimation}/racing-animation?&timer=${selectedTimer}`}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                border: "none",
                                display: "block",
                            }}
                            title={`Racing Game for Period ${lastPeriodId} with Timer ${selectedTimer}`}
                        />
                    </div>

                    <Box
                        mt={2}
                        sx={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            maxWidth: "94%",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                            p: 0,
                            backgroundColor: "#323738",
                            borderRadius: "10px",
                        }}
                    >
                        <Box sx={{ position: "relative" }}>
                            <div
                                className="overlay"
                                style={{
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    borderRadius: "10px",
                                    position: "absolute",
                                    inset: 0,
                                    zIndex: 100,
                                    display: openDialog ? "inline-block" : "none",
                                    cursor: "not-allowed",
                                    pointerEvents: openDialog ? "auto" : "none",
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
                                            backgroundColor: "#3a4142",
                                        }}
                                    >
                                        {0}
                                    </p>
                                    <p
                                        style={{
                                            textAlign: "center",
                                            paddingLeft: "20px",
                                            borderRadius: "20px",
                                            fontSize: "130px",
                                            paddingRight: "20px",
                                            backgroundColor: "#3a4142",
                                        }}
                                    >
                                        {remainingTime}
                                    </p>
                                </div>
                            </div>

                            <Box sx={{ mx: "2px", p: 1 }}>
                                <Box
                                    sx={{
                                        overflowX: "auto",
                                        width: "100%",
                                        mt: 1,
                                        padding: "0px",
                                    }}
                                >
                                    <Grid
                                        container
                                        justifyContent="space-evenly"
                                        sx={{
                                            display: "inline-flex",
                                            flexWrap: "nowrap",
                                            gap: 1,
                                        }}
                                    >
                                        {["1st", "2nd", "3rd"].map((label) => (
                                            <Button
                                                key={label}
                                                sx={{
                                                    ...buttonStyles(labelMap[label]),
                                                    textTransform: "initial",
                                                }}
                                                onClick={() => handleTopClick(labelMap[label])}
                                            >
                                                {label}
                                            </Button>
                                        ))}
                                    </Grid>
                                </Box>

                                <Divider
                                    sx={{
                                        my: 1,
                                        backgroundColor: "rgba(0, 0, 0, 0.12)",
                                    }}
                                />

                                {/* Second Row */}
                                <Grid
                                    container
                                    mt={1}
                                    sx={{ borderRadius: "20px", padding: "0px" }}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        mb={1}
                                        container
                                        justifyContent="space-evenly"
                                    >
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <Box
                                                key={num}
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    width: "12%",
                                                    cursor: "pointer",
                                                    background: selectedItems.includes(num)
                                                        ? "rgba(214, 31, 36, 0.10)"
                                                        : "transparent",
                                                    border: selectedItems.includes(num)
                                                        ? "1px solid #FD5810"
                                                        : "1px solid transparent",
                                                    borderRadius: "4px",
                                                    transition:
                                                        "transform 0.3s ease, background 0.3s, border 0.3s",
                                                }}
                                                onClick={() => {
                                                    handleSelection(num)
                                                    handleOpenDrawer(num.toString())
                                                }}
                                            >
                                                <img
                                                    src={ballImages[num]}
                                                    alt={num.toString()}
                                                    style={{ width: "100%" }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        mt: 1,
                                                        color: "#B3BEC1",
                                                    }}
                                                >
                                                    9
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        mb={2}
                                        container
                                        justifyContent="space-evenly"
                                    >
                                        {[6, 7, 8, 9, 10].map((num) => (
                                            <Box
                                                key={num}
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    width: "12%",
                                                    cursor: "pointer",
                                                    background: selectedItems.includes(num)
                                                        ? "rgba(214, 31, 36, 0.10)"
                                                        : "transparent",
                                                    border: selectedItems.includes(num)
                                                        ? "1px solid #FD5810"
                                                        : "1px solid transparent",
                                                    borderRadius: "4px",
                                                    transition:
                                                        "transform 0.3s ease, background 0.3s, border 0.3s",
                                                }}
                                                onClick={() => {
                                                    handleSelection(num)
                                                    handleOpenDrawer(num.toString())
                                                }}
                                            >
                                                <img
                                                    src={ballImages[num]}
                                                    alt={num.toString()}
                                                    style={{ width: "100%" }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        mt: 1,
                                                        color: "#B3BEC1",
                                                    }}
                                                >
                                                    9
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Grid>
                                </Grid>
                                {/* Number Balls */}
                                <Box
                                    sx={{
                                        overflowX: "auto",
                                        width: "100%",
                                        mt: 0,
                                        padding: "0px",
                                    }}
                                >
                                    <Grid
                                        container
                                        justifyContent="space-evenly"
                                        sx={{
                                            display: "flex",
                                            flexWrap: "nowrap",
                                            gap: 0.5,
                                        }}
                                    >
                                        {[
                                            {
                                                text: "Big",
                                                gradient:
                                                    "linear-gradient(90deg, #FF9000 0%, #FFD000 100%)",
                                            },
                                            {
                                                text: "Small",
                                                gradient:
                                                    "linear-gradient(90deg, #00BDFF 0%, #5BCDFF 100%)",
                                            },
                                            {
                                                text: "Odd",
                                                gradient:
                                                    "linear-gradient(90deg, #FD0261 0%, #FF8A96 100%)",
                                            },
                                            {
                                                text: "Even",
                                                gradient:
                                                    "linear-gradient(90deg, #00BE50 0%, #9BDF00 100%)",
                                            },
                                        ].map((button) => (
                                            <Grid
                                                item
                                                key={button.text}
                                                sx={{
                                                    p: 0.5,
                                                    borderRadius: "4px",
                                                    background: selectedItems.includes(button.text)
                                                        ? "rgba(214, 31, 36, 0.10)"
                                                        : "transparent",
                                                    border: selectedItems.includes(button.text)
                                                        ? "1px solid #FD5810"
                                                        : "1px solid transparent",
                                                }}
                                            >
                                                <Button
                                                    onClick={() => {
                                                        handleSelection(button.text)
                                                        handleOpenDrawer(button.text.toLowerCase())
                                                        handleEventSelection(button.text.toLowerCase())
                                                    }}
                                                    variant="contained"
                                                    sx={{
                                                        background: button.gradient,
                                                        "&:hover": {
                                                            background: button.gradient,
                                                        },
                                                        height: "35px",
                                                        minWidth: "70px",
                                                        maxWidth: "80px",
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
                                                    <span>{button.text}</span>
                                                    <span>2</span>
                                                </Button>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </Box>
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
                    {/*   <Snackbar
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
                            severity={snackbarMessage.includes("successfully") ? "success" : "error"}
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
                                background: "#323738",
                                color: "#B3BEC1",
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
                                color: "#B3BEC1",
                                background: "#323738",
                            }}
                        >
                            {/* Top Buttons and Categories */}
                            <Box
                                sx={{
                                    background: "transparent",
                                    position: "relative",
                                    zIndex: 1,
                                }}
                            >
                                {/* Ball Selection */}
                                <Grid
                                    container
                                    mt={1}
                                    sx={{ borderRadius: "20px", padding: "0px" }}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        mb={1}
                                        container
                                        justifyContent="space-evenly"
                                    >
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <Box
                                                key={num}
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    width: "11%",
                                                    cursor: "pointer",
                                                    background: selectedItems.includes(num)
                                                        ? "rgba(214, 31, 36, 0.10)"
                                                        : "transparent",
                                                    border: selectedItems.includes(num)
                                                        ? "1px solid #FD5810"
                                                        : "1px solid transparent",
                                                    borderRadius: "4px",
                                                    transition:
                                                        "transform 0.3s ease, background 0.3s, border 0.3s",
                                                }}
                                                onClick={() => {
                                                    handleSelection(num)
                                                    handleOpenDrawer(num.toString())
                                                }}
                                            >
                                                <img
                                                    src={ballImages[num]}
                                                    alt={num.toString()}
                                                    style={{ width: "100%" }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        mt: 1,
                                                        color: "#B3BEC1",
                                                    }}
                                                >
                                                    9
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        mb={2}
                                        container
                                        justifyContent="space-evenly"
                                    >
                                        {[6, 7, 8, 9, 10].map((num) => (
                                            <Box
                                                key={num}
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    width: "11%",
                                                    cursor: "pointer",
                                                    background: selectedItems.includes(num)
                                                        ? "rgba(214, 31, 36, 0.10)"
                                                        : "transparent",
                                                    border: selectedItems.includes(num)
                                                        ? "1px solid #FD5810"
                                                        : "1px solid transparent",
                                                    borderRadius: "4px",
                                                    transition:
                                                        "transform 0.3s ease, background 0.3s, border 0.3s",
                                                }}
                                                onClick={() => handleSelection(num)}
                                            >
                                                <img
                                                    src={ballImages[num]}
                                                    alt={num.toString()}
                                                    style={{ width: "100%" }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        mt: 1,
                                                        color: "#B3BEC1",
                                                    }}
                                                >
                                                    9
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Grid>
                                </Grid>

                                {/* Selectable Number Boxes */}
                                <Box
                                    sx={{
                                        overflowX: "auto",
                                        width: "100%",
                                        mt: 0,
                                        mb: 1,
                                        padding: "0px",
                                    }}
                                >
                                    <Grid
                                        container
                                        justifyContent="space-evenly"
                                        sx={{
                                            display: "flex",
                                            flexWrap: "nowrap",
                                            gap: 0.5,
                                        }}
                                    >
                                        {[
                                            {
                                                text: "Big",
                                                gradient:
                                                    "linear-gradient(90deg, #FF9000 0%, #FFD000 100%)",
                                            },
                                            {
                                                text: "Small",
                                                gradient:
                                                    "linear-gradient(90deg, #00BDFF 0%, #5BCDFF 100%)",
                                            },
                                            {
                                                text: "Odd",
                                                gradient:
                                                    "linear-gradient(90deg, #FD0261 0%, #FF8A96 100%)",
                                            },
                                            {
                                                text: "Even",
                                                gradient:
                                                    "linear-gradient(90deg, #00BE50 0%, #9BDF00 100%)",
                                            },
                                        ].map((button) => (
                                            <Grid
                                                item
                                                key={button.text}
                                                sx={{
                                                    p: 0.5,
                                                    borderRadius: "4px",
                                                    background: selectedItems.includes(button.text)
                                                        ? "rgba(214, 31, 36, 0.10)"
                                                        : "transparent",
                                                    border: selectedItems.includes(button.text)
                                                        ? "1px solid #FD5810"
                                                        : "1px solid transparent",
                                                }}
                                            >
                                                <Button
                                                    onClick={() => {
                                                        handleSelection(button.text)
                                                        handleOpenDrawer(button.text.toLowerCase())
                                                        handleEventSelection(button.text.toLowerCase())
                                                    }}
                                                    variant="contained"
                                                    sx={{
                                                        background: button.gradient,
                                                        "&:hover": {
                                                            background: button.gradient,
                                                        },
                                                        height: "35px",
                                                        minWidth: "70px",
                                                        maxWidth: "80px",
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
                                                    <span>{button.text}</span>
                                                    <span>2</span>
                                                </Button>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </Box>

                            <Grid padding={1}>
                                <Grid item xs={12}>
                                    <Grid container justifyContent="flex-start">
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: "#ffffff",
                                                fontSize: "0.85rem",
                                                mr: 1,
                                                alignContent: "center",
                                            }}
                                        >
                                            Select:
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                px: 0.5,
                                            }}
                                        >
                                            {selected?.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                                        </Box>

                                        {selectedItems.map((item) => (
                                            <Box
                                                key={item}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    flexGrow: 0,
                                                    px: 0,
                                                    mx: "2px",
                                                }}
                                            >
                                                {typeof item === "number" ? (
                                                    <img
                                                        src={ballImages[item]}
                                                        alt={item.toString()}
                                                        style={{ maxWidth: "20px" }}
                                                    />
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            background: getGradientForItem(item),
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
                                                        {item}
                                                    </Box>
                                                )}
                                            </Box>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Bet Amount Selection */}
                            <Grid padding={1}>
                                <Grid item xs={12}>
                                    <Grid container justifyContent="space-between">
                                        <Typography
                                            variant="h6"
                                            sx={{ color: "#ffffff", fontSize: "1rem" }}
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
                                                            ? { background: selectedColor, color: "#201d2b" }
                                                            : { background: "#3a3834", color: "#B3BEC1" }),
                                                        boxShadow: "none",
                                                        minWidth: "30px",
                                                        padding: "2px 6px",
                                                        fontSize: "17px"
                                                    }}
                                                    onClick={() => handleBetAmount(amount)}
                                                >
                                                    {"₹" + amount}
                                                </Button>
                                            ))}</Grid>
                                    </Grid>
                                </Grid>

                                {/* Quantity Selection */}
                                <Grid item xs={12} mt={1}>
                                    <Grid container>
                                        <Grid
                                            item
                                            container
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{ color: "#ffffff", flexWrap: "nowrap" }}

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
                                                        color: "#ffffff",
                                                    }}
                                                    InputProps={{
                                                        style: {
                                                            color: "#ffffff",
                                                            borderRadius: 15,
                                                            height: isSmallScreen2 ? 25 : 30,
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
                                                            sx={{
                                                                color: selectedColor.startsWith(
                                                                    "linear-gradient(to bottom right, #D23838 50%, #9B48DB 0)"
                                                                )
                                                                    ? "#d23838"
                                                                    : selectedColor.startsWith(
                                                                        "linear-gradient(to bottom right, #17B15E 50%, #9B48DB 0)"
                                                                    )
                                                                        ? "#17b15e"
                                                                        : selectedColor,
                                                                fontSize: 38,
                                                            }}
                                                        />
                                                    </IconButton>
                                                </Grid>
                                                <Grid item>
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
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
                                                            sx={{
                                                                color: selectedColor.startsWith(
                                                                    "linear-gradient(to bottom right, #D23838 50%, #9B48DB 0)"
                                                                )
                                                                    ? "#d23838"
                                                                    : selectedColor.startsWith(
                                                                        "linear-gradient(to bottom right, #17B15E 50%, #9B48DB 0)"
                                                                    )
                                                                        ? "#17b15e"
                                                                        : selectedColor,
                                                                fontSize: 38,
                                                            }}
                                                        />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>


                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12} mt={1}>
                                    <Grid
                                        container
                                        justifyContent="flex-end"
                                        sx={{ color: "#B3BEC1" }}
                                    >
                                        {[1, 5, 10, 20, 50, 100].map((value) => (
                                            <div
                                                key={value}
                                                className={`button ${activeButton === value ? "active" : ""}`}
                                                onClick={() => handleMultiplier(value)}
                                                style={{
                                                    ...(activeButton === value
                                                        ? { background: selectedColor, color: "#201d2b" }
                                                        : { background: "#3a3834", color: "#B3BEC1" }),
                                                    padding: "5px 8px",
                                                    borderRadius: "5px",
                                                    margin: "5px",
                                                }}
                                            >
                                                X{value}
                                            </div>
                                        ))}
                                    </Grid>
                                    <Typography sx={{ alignItems: "center", display: "flex", mt: 1 }}>
                                        <Checkbox
                                            checked={agreed}
                                            onClick={toggleAgree} // Handle both check and uncheck
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
                                        <span style={{ marginLeft: 8, fontSize: "13px", color: "#B3BEC1" }}>
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
                            <Grid item xs={12} mt={1}>
                                <Grid container justifyContent="space-around" spacing={0}>
                                    <Grid item xs={3}>
                                        <Button
                                            onClick={handleCancelBet}
                                            fullWidth
                                            style={{ background: "#3a3834", color: "#B3BEC1", textTransform: "none", borderRadius: "0px" }}
                                            variant="contained"
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Button
                                            onClick={handlePlaceBet}
                                            fullWidth
                                            style={{ background: selectedColor, textTransform: "none", color: "black", borderRadius: "0px" }}
                                            variant="contained"
                                            disabled={!agreed || isPlacingBet}
                                        >
                                            {`Total Bet: ₹${displayBetAmount}`}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* <>
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
                            </> */}
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
                            severity={snackbarMessage.includes("successfully") ? "success" : "error"}
                            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }}
                        >
                            {snackbarMessage}
                        </MuiAlert>
                    </Snackbar> */}

                    <Grid
                        mt={2}
                        container
                        justifyContent="center"
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
                                    <Grid item xs={6} key={index}>
                                        <Box
                                            onClick={() => {
                                                setActiveTab(index)
                                            }}
                                            sx={{
                                                height: "40px",
                                                background:
                                                    activeTab === index ? "linear-gradient(90deg,#24ee89,#9fe871)" : "#323738",
                                                color: activeTab === index ? "#000" : "grey",
                                                borderRadius: 1,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                                transition: "all 0.3s",
                                                "&:hover": {
                                                    background:
                                                        activeTab === index ? "linear-gradient(90deg,#24ee89,#9fe871)" : "#323738",
                                                },
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontSize: "12px",
                                                    textTransform: "none",
                                                    fontWeight: "bold",
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
                                        <RaceHistory
                                            data={rows}
                                            page={historyPage}
                                            setPage={setHistoryPage}
                                            totalPage={gameTotalPage}
                                        />
                                    </TabPanel>
                                )}
                                {activeTab === 1 && (
                                    <TabPanel>
                                        <RacingMyHistory
                                            bets={bets}
                                            isLoading={isLoading}
                                            getGradientForItem={getGradientForItem}
                                            page={betsPage}
                                            setPage={handlePageChange}
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
                                display: show ? (open ? "flex" : "none") : "flex",
                                // display:"flex",
                                position: "absolute",
                                zIndex: 2000,
                                top: "0px",
                                justifyContent: "center",
                                alignItems: "center",
                                width: isSmallScreen ? "100%" : "calc(100% - 50px)",
                                height: "100%",
                                overflow: "auto",
                                border: "none",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: "transparent",
                                    margin: "5% 15px",
                                    width: "100%",
                                    height: "60%",
                                    backgroundImage: `url(${gameResult === "Won"
                                        ? "/assets/icons/images/popup-win.webp"
                                        : "/assets/icons/images/popup-loss.webp"
                                        })`,
                                    backgroundSize: "contain",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    position: "relative",
                                }}
                            >
                                <Typography
                                    // variant="h4"
                                    style={{
                                        color: gameResult === "Won" ? "white" : "#7c9dc2",
                                        fontWeight: "bold",
                                        marginTop: "6rem",
                                        fontSize: "30px"
                                    }}
                                >
                                    {gameResult === "Won" ? "Congratulations" : "Sorry"}
                                </Typography>
                                <Typography style={{ color: gameResult === "Won" ? "white" : "#7c9dc2", }}>
                                    Lottery results

                                </Typography>
                                <Grid
                                    item
                                    xs={6}
                                    sx={{ marginBottom: "0px", display: "flex", justifyContent: "space-between" }}>
                                    {popupresult &&
                                        ["firstPlace", "secondPlace", "thirdPlace"].map((pos) => (
                                            <NumberCircle key={pos}>
                                                <img
                                                    src={ballImages[parseInt(popupresult[pos], 10)]}
                                                    alt={`Car ${popupresult[pos]}`}
                                                    style={{
                                                        width: "100%",
                                                        height: "auto",
                                                        // borderRadius: "50%",
                                                        boxShadow: `4px 4px 8px rgba(0, 0, 0, 0.4)`,
                                                        borderRadius: "50px"
                                                    }}
                                                />
                                            </NumberCircle>
                                        ))}
                                </Grid>

                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    // mb={4}
                                    mt={3.5}
                                    sx={{ display: "flex", alignItems: "center", gap: 0, flexDirection: "column" }}
                                >
                                    {/* {dialogContent} */}
                                    <span
                                        style={{
                                            color: gameResult === "Won" ? "green" : "red",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        ₹{winloss}
                                    </span>

                                    <span style={{ fontSize: "0.75rem", fontWeight: "bold" }}>
                                        Period: {timerTypeChange[popupTimer]}
                                    </span>
                                    <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>
                                        {popupperiodid}
                                    </span>
                                </Typography>
                                <Typography sx={{ color: gameResult ? "white" : "#7c9dc2", mt: 6, display: "flex", alignItems: "center", flexDirection: "row" }}>
                                    <Checkbox
                                        checked={show}
                                        onClick={handleToggle} // Handle both check and uncheck
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
                            </div>
                        </div>
                    </>
                </div>
                <br />
                <br />
                <br />
            </Mobile>
        </>
    )
}

export default CarRacingPage