import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Typography,
    Tabs,
    Tab,
    IconButton,
    Container,
    CircularProgress,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import WingoMyHistory from "../wingo/WingoMyHistory";
import K3MyHistory from "../k3/K3MyHistory";
import FiveDMyHistory from "../fiveD/FiveDMyHistory";
import { useAuth } from "../../../context/AuthContext";
import { domain } from "../../../utils/Secret";
import Mobile from "../../layout/Mobile";
import RacingMyHistory from "../carRace/RacingMyHistory";

const BettingRecord = () => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { axiosInstance } = useAuth();

    const getGradientForItem = (item) => {
        switch(item) {
          case 'Small':
            return 'rgb(110,168,244)';
          case 'Big':
            return 'rgb(254,170,87)';
          case 'Even':
            return 'rgb(200,111,255)';
          case 'Odd':
            return 'rgb(251,91,91)';
          default:
            return '#0f6518'; // Default color
        }
      };

    // Pattern: /home/AllLotteryGames/[gameType]/BettingRecordWin
    const getGameTypeFromPath = () => {
        const pathSegments = location.pathname.split('/');
        const gameTypeIndex = pathSegments.findIndex(segment =>
            segment === "AllLotteryGames") + 1;

        if (gameTypeIndex < pathSegments.length) {
            return pathSegments[gameTypeIndex];
        }
        return "wingo"; // Default fallback
    };

    // Determine game type from params or path
    const gameType = params.gameType || getGameTypeFromPath();

    const [activeTab, setActiveTab] = useState(0);
    const [records, setRecords] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [timeInterval, setTimeInterval] = useState("30s");
    const [lastAlertedPeriodId, setLastAlertedPeriodId] = useState("");
    const [periodId, setPeriodId] = useState("Loading...");
    const [popupQueue, setPopupQueue] = useState([]);
    const [currentBetIndex, setCurrentBetIndex] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    // Timer type mapping
    const timerTypeMap = {
        "30s": "THIRTY_TIMER",
        "1min": "ONE_MINUTE_TIMER",
        "3min": "THREE_MINUTE_TIMER",
        "5min": "FIVE_MINUTE_TIMER",
        "10min": "TEN_MINUTE_TIMER",
    };

    // Determine tab options based on game type
    const getTabOptions = () => {
        if (gameType === "wingo" || gameType === "car-race") {
            return ["30s", "1min", "3min", "5min"];
        } else {
            return ["1min", "3min", "5min", "10min"];
        }
    };

    const tabOptions = getTabOptions();

    useEffect(() => {
        // Set default time interval based on game type
        const initInterval = (gameType === "wingo" || gameType === "car-race") ? "30s" : "1min";
        setTimeInterval(initInterval);
        setActiveTab((gameType === "wingo" || gameType === "car-race") ? 0 : 0);
        
        setIsInitialized(true);
    }, [gameType]);


    const fetchRecords = async () => {
        setLoading(true);

        const timerType = timerTypeMap[timeInterval] || 
                         ((gameType === "wingo" || gameType === "car-race") ? "THIRTY_TIMER" : "ONE_MINUTE_TIMER");
        
        let endpoint;
        if (gameType === "wingo") {
            endpoint = "/api/master-game/wingo/bet-history";
        } else if (gameType === "5d") {
            endpoint = "/api/master-game/fived/bet-history";
        } else if (gameType === "car-race") {
            endpoint = "/api/master-game/car-race/bet-history";
        } else if (gameType === "k3") {
            endpoint = "/api/master-game/k3/bet-history";
        } else {
            // Default fallback endpoint
            endpoint = "/api/master-game/wingo/bet-history";
        }

        try {
            const response = await axiosInstance.get(endpoint, {
                params: {
                    timerType: timerType,
                    page: page,
                    limit: 10
                },
                withCredentials: true,
            });

            //console.log(`${gameType} bet history:`, response.data.data);
            if (response.data && response.data.data) {
                setRecords(response.data.data.bets || []);
                setTotalPage(response.data.data.pagination?.totalPages || 1);

                // Handle bet completion notification logic
                const currentPeriodId = String(periodId);
                const previousAlertedPeriodId = String(lastAlertedPeriodId);

                if (
                    currentPeriodId &&
                    currentPeriodId !== "Loading..." &&
                    currentPeriodId !== previousAlertedPeriodId
                ) {
                    const completedBets = response.data.data.bets.filter(
                        (bet) =>
                            String(bet.periodId) === previousAlertedPeriodId &&
                            bet.result !== " "
                    );

                    if (completedBets.length > 0) {
                        setPopupQueue(completedBets);
                        setCurrentBetIndex(0);
                    }
                }
            } else {
                console.error("Invalid response format:", response);
                setRecords([]);
                setTotalPage(1);
            }
            setLoading(false);
            setFetchError(null);
        } catch (error) {
            console.error(`Error fetching ${gameType} betting history:`, error);
            setFetchError(`Failed to load ${gameType} betting history`);

            // Retry logic
            setTimeout(async () => {
                try {
                    const retryResponse = await axiosInstance.get(endpoint, {
                        params: {
                            timerType: timerType,
                            page: page,
                            limit: 10
                        },
                        withCredentials: true,
                    });

                    if (retryResponse.data && retryResponse.data.data) {
                        setRecords(retryResponse.data.data.bets || []);
                        setTotalPage(retryResponse.data.data.pagination?.totalPages || 1);
                        setFetchError(null);
                    } else {
                        setRecords([]);
                        setTotalPage(1);
                        setFetchError("Invalid data format received");
                    }

                    setLoading(false);
                } catch (retryError) {
                    console.error("Retry failed:", retryError);
                    setRecords([]);
                    setLoading(false);
                    setFetchError("Failed to load data after retry");
                }
            }, 1000);
        }
    };

    useEffect(() => {
        if (isInitialized) {
            fetchRecords();
        }
    }, [gameType, timeInterval, page, periodId, lastAlertedPeriodId, axiosInstance, isInitialized]);

    // const manualRefresh = () => {
    //     fetchRecords();
    // };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setTimeInterval(tabOptions[newValue]);
        setPage(1); // Reset to first page on tab change
    };

    const handleBack = () => {
        navigate(-1); // Go back to previous screen
    };

    const renderHistory = () => {
        if (loading) {
            return (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                    <CircularProgress sx={{ color: "#DD9138" }} />
                </Box>
            );
        }

        // Show error message if fetch failed
        if (fetchError) {
            return (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                    <Typography variant="body1" sx={{ color: "#F5F3F0" }}>
                        {fetchError}
                    </Typography>
                </Box>
            );
        }

        // Check if records are empty
        if (!records || records.length === 0) {
            return (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                    <Typography variant="body1" sx={{ color: "#F5F3F0" }}>
                        No data available
                    </Typography>
                </Box>
            );
        }

        // Render appropriate component based on game type
        if (gameType === "wingo") {
            return (
                <WingoMyHistory
                    bets={records}
                    page={page}
                    setPage={setPage}
                    totalPage={totalPage}
                    hideDetailsButton={true}
                    insideBettingRecord={true}
                />
            );
        } else if (gameType === "5d") {
            return (
                <FiveDMyHistory
                    bets={records}
                    page={page}
                    setPage={setPage}
                    totalPage={totalPage}
                    hideDetailsButton={true}
                    insideBettingRecord={true}
                />
            );
        } else if (gameType === "k3") {
            return (
                <K3MyHistory
                    bets={records}
                    page={page}
                    setPage={setPage}
                    totalPage={totalPage}
                    hideDetailsButton={true}
                    insideBettingRecord={true}
                />
            );
        } else if (gameType === "car-race") {
            return (
                <RacingMyHistory
                    bets={records}
                    page={page}
                    setPage={setPage}
                    totalPage={totalPage}
                    hideDetailsButton={true}
                    insideBettingRecord={true}
                    getGradientForItem={getGradientForItem}
                />
            );
        } else {
            // Default fallback
            return (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                    <Typography variant="body1" sx={{ color: "#F5F3F0" }}>
                        Unknown game type: {gameType}
                    </Typography>
                </Box>
            );
        }
    };

    // Safety check for gameType when generating title
    const gameTitle = gameType === "wingo" ? "Win Go" :
        gameType === "5d" ? "5D Lotre" :
        gameType === "car-race" ? "Car Race" :
        gameType === "k3" ? "K3 Lotre" :
        (gameType ? `${gameType.toUpperCase()} Lotre` : "Game Lotre");

    return (
        <Mobile>
            <Box sx={{ backgroundColor: "#232626", minHeight: "100vh" }}>
                <Box sx={{
                    backgroundColor: "#323738",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    p: 1,
                    // borderBottom:"1px solid #f58c3b"
                }}>
                    <IconButton
                        onClick={handleBack}
                        sx={{ color: "#F5F3F0", position: "absolute", left: 8 }}
                    >
                        <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
                    </IconButton>
                    <Typography sx={{ color: "#F5F3F0", textAlign: "center", fontSize: "19px" }}>
                        {gameTitle}
                    </Typography>
                </Box>

                <Box sx={{ backgroundColor: "#323738", mb: 2 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{
                            "& .MuiTabs-indicator": {
                                backgroundColor: "#DD9138",
                            },
                            "& .MuiTab-root": {
                                color: "#646566",
                                "&.Mui-selected": {
                                    color: "#f5f3f0",
                                },
                                // Override default padding
                                padding: "0", // Remove padding
                            }
                        }}
                    >
                        {tabOptions.map((tab, index) => (
                            <Tab
                                key={index}
                                sx={{
                                    textTransform: "initial",
                                    fontSize: "12px",
                                    // Ensure no padding is applied
                                    padding: "0",
                                }}
                                label={`${gameTitle} ${tab}`}
                            />
                        ))}
                    </Tabs>
                </Box>
                <Box>
                    {renderHistory()}
                </Box>
            </Box>
        </Mobile>
    );
};

export default BettingRecord;