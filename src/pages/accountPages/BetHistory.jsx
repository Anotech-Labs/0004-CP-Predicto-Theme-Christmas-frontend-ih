import React, { useState, useRef, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { useNavigate } from "react-router-dom";
import Mobile from "../../components/layout/Mobile";
import { domain } from "../../utils/Secret";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import "../../components/account/BetHistoryStyles.css";
import { useAuth } from "../../context/AuthContext";
import DatePickerHeader from "../../components/common/DatePickerHeader";
import DatePickerBody from "../../components/common/DatePickerBody";
import fivedBallImage from "../../assets/fived/fivedball.webp";

const tabsData = [
  {
    icon: "/assets/icons/rebate/Lottery Deselect.svg",
    selectedImage: "/assets/icons/rebate/Lottery Deselect-1.svg",
    label: "Lottery",
  },
  {
    icon: "/assets/icons/rebate/Casino Deselect.svg",
    selectedImage: "/assets/icons/rebate/Casino Deselect-1.svg",
    label: "Casino",
  },
  {
    icon: "/assets/icons/rebate/Lottery Deselect.svg",
    selectedImage: "/assets/icons/rebate/Lottery Deselect-1.svg",
    label: "Fishing",
  },
  {
    icon: "/assets/icons/rebate/original-1.svg",
    selectedImage: "/assets/icons/rebate/original.svg",
    label: "Original",
  },
  {
    icon: "/assets/icons/rebate/spade-1.svg",
    selectedImage: "/assets/icons/rebate/spade.svg",
    label: "Rummy",
  },
  {
    icon: "/assets/icons/rebate/slotsdeselect.svg",
    selectedImage: "/assets/icons/rebate/slotsselected.svg",
    label: "Slots",
  },
];

// Updated filter options for both lottery and API games - commented out most options
const filterOptions = {
  Lottery: [
    "All",
    "WINGO",
    "K3DICE",
    "5D",
    // "CAR RACE"
  ],
  Original: ["All", "SPRIBE", "INOUT"],
  Casino: [
    "All",
    "JILI",
    "CQ9",
    "PG",
    "EVO",
    "SEXY",
    // "V8",
    // "365",
    "MG",
    // "PRAGMATIC",
    "JDB",
    // "IDEAL",
    // "EVO_VIDEO",
    // "KM",
  ],
  Fishing: [
    "All",
    "JILI",
    // "CQ9",
    // "FISH"
  ],
  Rummy: [
    "All",
    // "JILI_POKER",
    "V8",
    // "365"
  ],
  Slots: [
    "All",
    "JILI",
    "CQ9",
    "PG",
    "MG",
    // "PRAGMATIC",
    "JDB",
    // "IDEAL",
    "EVO_VIDEO",
  ],
};

// Map tab names to API categories
const tabToCategoryMap = {
  Original: "CRASH",
  Casino: "LIVE_CASINO",
  Fishing: "FISHING",
  Rummy: "POKER",
  Slots: "SLOTS",
};

const displayNameMap = {
  WINGO: "Win Go",
  FIVED: "5D",
  // CAR_RACE: "Car Race",
  K3DICE: "K3",
  All: "All",
  // API Game Categories
  CRASH: "Crash Games",
  LIVE_CASINO: "Live Casino",
  FISHING: "Fishing Games",
  POKER: "Poker Games",
  SLOTS: "Slot Games",
  TABLE_GAMES: "Table Games",
  ELECTRONIC: "Electronic Games",
  SPORTS: "Sports Betting",
};

const imageMap = {
  zero: "/assets/wingo/0.webp",
  one: "/assets/wingo/1.webp",
  two: "/assets/wingo/2.webp",
  three: "/assets/wingo/3.webp",
  four: "/assets/wingo/4.webp",
  five: "/assets/wingo/5.webp",
  six: "/assets/wingo/6.webp",
  small: "/assets/wingo/0.webp",
  big: "/assets/wingo/0.webp",
  green: "/assets/wingo/0.webp",
  red: "/assets/wingo/0.webp",
  yellow: "/assets/wingo/0.webp",
  violetred: "/assets/wingo/0.webp",
  violetgreen: "/assets/wingo/0.webp",
  eight: "/assets/wingo/8.webp",
  seven: "/assets/wingo/7.webp",
  nine: "/assets/wingo/9.webp",
};

const gameImgMap = {
  All: "/assets/betHistory/All.webp",
  WINGO: "/assets/lottery/wingo.webp",
  K3DICE: "/assets/lottery/K3Lottery.webp",
  "5D": "/assets/lottery/5dLottery.webp",
  // "CAR RACE": "/assets/lottery/car.webp",
  SPRIBE: "/assets/betHistory/spribe.webp",
  INOUT: "/assets/betHistory/inOutDark.svg",
  MG_Video: "/assets/betHistory/MG_Video.webp",
  // AG_Video: "/assets/betHistory/AG_Video.webp",
  // TB_Chess: "/assets/betHistory/TB.webp",
  EVO_Video: "/assets/betHistory/EVO_Video.webp",
  EVO: "/assets/betHistory/EVO_Video.webp",
  JDB: "/assets/betHistory/JDB.webp",
  JILI: "/assets/betHistory/Jili.webp",
  // MG_Fish: "/assets/betHistory/MG_FISH.webp",
  // Card365: "/assets/betHistory/CARD365.webp",
  // 365: "/assets/betHistory/CARD365.webp",
  PG: "/assets/betHistory/PG.webp",
  // "9G": "/assets/betHistory/9G.webp",
  CQ9: "/assets/betHistory/CQ9.webp",
  MG: "/assets/betHistory/MG_Video.webp",
  // PRAGMATIC: "/assets/betHistory/PRAGMATIC.webp",
  SEXY: "/assets/betHistory/SEXY_Video.webp",
  V8: "/assets/betHistory/V8CARD.webp",
  // IDEAL: "/assets/betHistory/IDEAL.webp",
  EVO_VIDEO: "/assets/betHistory/EVO_Video.webp",
  // KM: "/assets/betHistory/KM.webp",
  // FISH: "/assets/betHistory/MG_FISH.webp",
  // JILI_POKER: "/assets/betHistory/Jili.webp",
};

const selectedGameImgMap = {
  All: "/assets/betHistory/All2.webp",
  WINGO: "/assets/lottery/wingo.webp",
  K3DICE: "/assets/lottery/K3Lottery.webp",
  "5D": "/assets/lottery/5dLottery.webp",
  // "CAR RACE": "/assets/lottery/car.webp",
  SPRIBE: "/assets/betHistory/spribe2.webp",
  INOUT: "/assets/betHistory/inOutDark.svg",
  // MG_Video: "/assets/betHistory/MG_Video2.webp",
  // AG_Video: "/assets/betHistory/AG_Video2.webp",
  // TB_Chess: "/assets/betHistory/TB2.webp",
  EVO_Video: "/assets/betHistory/EVO_Video2.webp",
  EVO: "/assets/betHistory/EVO_Video2.webp",
  JDB: "/assets/betHistory/JDB2.webp",
  JILI: "/assets/betHistory/Jili2.webp",
  // MG_Fish: "/assets/betHistory/MG_FISH2.webp",
  Card365: "/assets/betHistory/CARD3652.webp",
  // 365: "/assets/betHistory/CARD3652.webp",
  PG: "/assets/betHistory/PG.webp",
  // "9G": "/assets/betHistory/9G2.webp",
  CQ9: "/assets/betHistory/CQ9.webp",
  MG: "/assets/betHistory/MG_Video2.webp",
  // PRAGMATIC: "/assets/betHistory/PRAGMATIC2.webp",
  SEXY: "/assets/betHistory/SEXY_Video.webp",
  V8: "/assets/betHistory/V8CARD.webp",
  IDEAL: "/assets/betHistory/IDEAL2.webp",
  EVO_VIDEO: "/assets/betHistory/EVO_Video2.webp",
  // KM: "/assets/betHistory/KM2.webp",
  // FISH: "/assets/betHistory/MG_FISH2.webp",
  // JILI_POKER: "/assets/betHistory/Jili2.webp",
};

const diceImageMap = {
  1: "/assets/k3/dice/dice1.webp",
  2: "/assets/k3/dice/dice2.webp",
  3: "/assets/k3/dice/dice3.webp",
  4: "/assets/k3/dice/dice4.webp",
  5: "/assets/k3/dice/dice5.webp",
  6: "/assets/k3/dice/dice6.webp",
};

const colorMap = {
  small: "#5088D3",
  big: "#24ee89",
  odd: "#D23838",
  even: "#17B15E",
  red: "#fb4e4e",
  green: "#49ce9b",
  yellow: "#FFEB3B",
  violet: "#9C27B0",
};

// Helper function to properly capitalize text
const capitalizeText = (text) => {
  if (!text) return "";
  return text.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
};

// Helper function to get last 16 digits of transaction ID
const getShortTransactionId = (transactionId) => {
  if (!transactionId) return "N/A";
  const str = transactionId.toString();
  return str.length > 16 ? str.slice(-16) : str;
};

// Helper function to format result status
const formatResultStatus = (result) => {
  if (!result) return "Unknown";
  const resultLower = result.toString().toLowerCase();
  if (resultLower === "loss" || resultLower === "lose") return "Lose";
  if (resultLower === "win") return "Win";
  return capitalizeText(result);
};

const getDaysInMonth = (year, month) => {
  return Array.from(
    { length: new Date(year, month, 0).getDate() },
    (_, i) => i + 1
  );
};

const BetHistory = () => {
  const [activeButton, setActiveButton] = useState("Lottery");
  const theme = useTheme();
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All");

  const today = new Date();
  const todayWithoutTime = new Date(today);
  todayWithoutTime.setHours(0, 0, 0, 0);

  // State for both lottery bets and API history
  const [bets, setBets] = useState([]);
  const [apiHistory, setApiHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const containerRef = useRef(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { axiosInstance } = useAuth();

  // Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef(null);

  // Date picker states
  const [daysInMonth, setDaysInMonth] = useState(
    getDaysInMonth(today.getFullYear(), today.getMonth() + 1)
  );
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState(today.getDate());

  // Date range state
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);
  const startOfYesterday = new Date(today);
  startOfYesterday.setDate(today.getDate() - 1);
  startOfYesterday.setHours(0, 0, 0, 0);

  const [selectedDateRange, setSelectedDateRange] = useState({
    start: startOfYesterday.toISOString(),
    end: endOfDay.toISOString(),
  });

  // Format lottery game details (existing function)
  const formatGameDetails = (bet) => {
    if (!bet.gameDetails) return "N/A";

    switch (bet.betType) {
      case "WINGO":
        return `${
          bet.gameDetails.formattedSelectedItem || bet.gameDetails.selectedItem
        }`;

      case "K3DICE":
        if (bet.gameDetails.totalSum) {
          return `Total Sum: ${bet.gameDetails.totalSum.toLowerCase()}`;
        }
        if (
          bet.gameDetails.selectedNumbers &&
          bet.gameDetails.selectedNumbers.length > 0
        ) {
          return `Numbers: ${bet.gameDetails.selectedNumbers.join(", ")}`;
        }
        return "Total Sum: 0";

      case "FIVED":
        if (bet.gameDetails.selectedSections) {
          const sections = bet.gameDetails.selectedSections;
          let result = [];

          const formatSection = (section, sectionName) => {
            if (!section) return null;
            let sectionResult = [];
            if (section.numbers && section.numbers.length > 0) {
              sectionResult.push(`Numbers: ${section.numbers.join(", ")}`);
            }
            if (section.sizes && section.sizes.length > 0) {
              sectionResult.push(`Size: ${section.sizes.join(", ")}`);
            }
            if (section.parities && section.parities.length > 0) {
              sectionResult.push(`Parity: ${section.parities.join(", ")}`);
            }
            if (sectionResult.length > 0) {
              return `${sectionName}(${sectionResult.join(" | ")})`;
            }
            return null;
          };

          const sectionA = formatSection(sections.sectionA, "A");
          const sectionB = formatSection(sections.sectionB, "B");
          const sectionC = formatSection(sections.sectionC, "C");
          const sectionD = formatSection(sections.sectionD, "D");
          const sectionE = formatSection(sections.sectionE, "E");

          if (sectionA) result.push(sectionA);
          if (sectionB) result.push(sectionB);
          if (sectionC) result.push(sectionC);
          if (sectionD) result.push(sectionD);
          if (sectionE) result.push(sectionE);

          if (sections.sum) {
            const sumOptions = [];
            if (sections.sum.size)
              sumOptions.push(`Size: ${sections.sum.size}`);
            if (sections.sum.parity)
              sumOptions.push(`Parity: ${sections.sum.parity}`);
            if (sumOptions.length > 0) {
              result.push(`SUM(${sumOptions.join(" | ")})`);
            }
          }

          return result.length > 0
            ? `Section ${result.join(" ")}`
            : "No selections";
        }
        return "No selections";

      case "CAR_RACE":
        const selectedSection = bet.gameDetails.selectedSection.replace(
          /_/g,
          " "
        );
        const sectionElements = bet.gameDetails.sectionElements;

        if (sectionElements && sectionElements.length > 0) {
          const formattedSection = sectionElements
            .map((section) => {
              const carNumbers = section.carNumbers?.join(", ") || "N/A";
              const parities = section.parities?.join(", ") || "N/A";
              return `${carNumbers} ${parities}`;
            })
            .join(", ");

          return `${selectedSection} (${formattedSection})`;
        }
        return "No selections";

      default:
        return "N/A";
    }
  };

  // Format lottery results (existing function)
  const formatResult = (bet) => {
    if (!bet.result) return "N/A";

    if (bet.result.displayValue) {
      if (bet.betType === "K3DICE") {
        const diceValues = bet.result.displayValue
          .split(": ")[1]
          .split(" (")[0]
          .split(", ");
        return diceValues;
      } else if (bet.betType === "CAR_RACE") {
        const { firstPlace, secondPlace, thirdPlace } = bet.result.raw;
        return [firstPlace, secondPlace, thirdPlace];
      } else if (bet.betType === "WINGO") {
        return bet.result.displayValue.split("|");
      } else if (bet.betType === "FIVED") {
        const raw = bet.result.raw;
        const numbers = [
          raw.sectionA[0] ?? "N/A",
          raw.sectionB[0] ?? "N/A",
          raw.sectionC[0] ?? "N/A",
          raw.sectionD[0] ?? "N/A",
          raw.sectionE[0] ?? "N/A",
        ];

        const balls = numbers.map((number, index) => {
          if (number === "N/A") {
            return <span key={index}></span>;
          }

          return (
            <span
              key={index}
              style={{
                width: "2rem",
                height: "2rem",
                display: "inline-block",
                backgroundImage: `url(${fivedBallImage})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                marginRight: "0.3rem",
                textAlign: "center",
                lineHeight: "2rem",
                fontSize: "1rem",
                fontWeight: "bold",
                color: "#e93333",
              }}
            >
              {number}
            </span>
          );
        });

        return balls;
      }
    }

    return "";
  };

  // Handle date change
  const handleDateChange = () => {
    const selectedDate = new Date(year, month - 1, day);
    selectedDate.setHours(0, 0, 0, 0);

    const endOfSelectedDate = new Date(selectedDate);
    endOfSelectedDate.setHours(23, 59, 59, 999);

    setSelectedDateRange({
      start: selectedDate.toISOString(),
      end: endOfSelectedDate.toISOString(),
    });

    setDatePickerOpen(false);
  };

  // Fetch lottery bets (existing function)
  const fetchLotteryBets = useCallback(
    async (pageNumber = 1, isInitialLoad = false) => {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setIsFetching(true);
      }
      setError("");

      try {
        const betTypeParam =
          selectedOption === "5D"
            ? "FIVED"
            : // : selectedOption === "CAR RACE"
            // ? "CAR_RACE"
            selectedOption !== "All"
            ? selectedOption
            : null;

        const params = {
          betType: betTypeParam,
          startDate: selectedDateRange.start,
          endDate: selectedDateRange.end,
          page: pageNumber,
          limit: 10,
        };

        const response = await axiosInstance.get(
          `${domain}/api/account/v1/bets/history`,
          {
            params,
            withCredentials: true,
          }
        );

        if (response.status) {
          const newBets = response.data.data.data.data;

          if (isInitialLoad) {
            setBets(newBets);
          } else {
            setBets((prevBets) => [...prevBets, ...newBets]);
          }

          setHasMore(newBets.length === 10);
        } else {
          if (isInitialLoad) {
            setBets([]);
          }
          setError("No history available");
          setHasMore(false);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch data");
        setHasMore(false);
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        } else {
          setIsFetching(false);
        }
      }
    },
    [selectedOption, selectedDateRange, axiosInstance]
  );

  // NEW: Fetch API history for casino/fishing/slots etc
  const fetchApiHistory = useCallback(
    async (pageNumber = 1, isInitialLoad = false) => {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setIsFetching(true);
      }
      setError("");

      try {
        const category = tabToCategoryMap[activeButton];
        if (!category) {
          setError("Invalid category");
          setHasMore(false);
          return;
        }

        // Format date for API (YYYY-MM-DD format)
        const startDate = new Date(selectedDateRange.start)
          .toISOString()
          .split("T")[0];
        const endDate = new Date(selectedDateRange.end)
          .toISOString()
          .split("T")[0];

        const params = {
          category: category,
          provider: selectedOption === "All" ? "ALL" : selectedOption,
          page: pageNumber,
          limit: 10,
          startDate: startDate,
          endDate: endDate,
        };

        console.log("Fetching API history with params:", params);

        const response = await axiosInstance.get(
          `${domain}/api/api-games/history`,
          {
            params,
            withCredentials: true,
          }
        );

        if (response.data.success) {
          const newTransactions = response.data.data.transactions;

          if (isInitialLoad) {
            setApiHistory(newTransactions);
          } else {
            setApiHistory((prevHistory) => [
              ...prevHistory,
              ...newTransactions,
            ]);
          }

          setHasMore(response.data.data.pagination.hasNextPage);
        } else {
          if (isInitialLoad) {
            setApiHistory([]);
          }
          setError("No history available");
          setHasMore(false);
        }
      } catch (err) {
        console.error("API History fetch error:", err);
        setError("Failed to fetch data");
        setHasMore(false);
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        } else {
          setIsFetching(false);
        }
      }
    },
    [activeButton, selectedOption, selectedDateRange, axiosInstance]
  );

  // Main fetch function that decides between lottery and API history
  const fetchData = useCallback(
    async (pageNumber = 1, isInitialLoad = false) => {
      if (activeButton === "Lottery") {
        await fetchLotteryBets(pageNumber, isInitialLoad);
      } else {
        await fetchApiHistory(pageNumber, isInitialLoad);
      }
    },
    [activeButton, fetchLotteryBets, fetchApiHistory]
  );

  // Load more data for infinite scroll
  const loadMoreData = useCallback(() => {
    if (!isFetching && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage, false);
    }
  }, [fetchData, isFetching, hasMore, page]);

  // Effect for initial data fetch and when filters change
  useEffect(() => {
    setPage(1);
    if (activeButton === "Lottery") {
      setBets([]);
      setApiHistory([]);
    } else {
      setApiHistory([]);
      setBets([]);
    }
    fetchData(1, true);
  }, [activeButton, selectedOption, selectedDateRange]);

  // Effect for infinite scroll observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isFetching && !loading) {
        loadMoreData();
      }
    }, options);

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, isFetching, loading, loadMoreData]);

  // Handle tab button click
  const handleButtonClick = (label) => {
    setActiveButton(label);
    setSelectedOption("All"); // Reset to "All" when switching tabs
  };

  // Handle filter drawer
  const handleFilterClick = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setTimeout(() => {
      handleDrawerClose();
    }, 150);
  };

  // NEW: Render API history transaction card
  const renderApiTransactionCard = (transaction, index) => {
    return (
      <div key={index} className="Card">
        <div className="card-header">
          <div className="card-header-left">
            <Typography variant="h6" fontWeight="bold" textAlign="left">
              {capitalizeText(transaction.gameInfo.gameName)}
            </Typography>
            <Typography variant="caption" color="#A8A5A1">
              {transaction.timestamps.gameTime
                ? new Date(transaction.timestamps.gameTime)
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")
                : "N/A"}
            </Typography>
          </div>
          <div className="card-header-right">
            <Typography
              variant="body1"
              sx={{
                color:
                  transaction.transaction.resultColor === "green"
                    ? "#40c592"
                    : transaction.transaction.resultColor === "red"
                    ? "#e98613"
                    : "#A8A5A1",
              }}
            >
              {formatResultStatus(transaction.transaction.result)}
            </Typography>
          </div>
        </div>

        <div className="card-content">
          <div className="card-row">
            <span className="label">Game</span>
            <span className="value">
              {capitalizeText(transaction.gameInfo.gameName)}
            </span>
          </div>
          <div className="card-row">
            <span className="label">Provider</span>
            <span className="value">
              {capitalizeText(transaction.gameInfo.provider)}
            </span>
          </div>
          <div className="card-row">
            <span className="label">Category</span>
            <span className="value">
              {displayNameMap[transaction.gameInfo.category] ||
                capitalizeText(transaction.gameInfo.category)}
            </span>
          </div>
          <div className="card-row">
            <span className="label">Transaction Id</span>
            <span className="value">
              {getShortTransactionId(transaction.serialNumber)}
            </span>
          </div>
          <div className="card-row">
            <span className="label">Type</span>
            <span className="value">
              {capitalizeText(transaction.transaction.type)}
            </span>
          </div>
        </div>

        {/* <div className="card-divider">
          <img
            src="/assets/divider.webp"
            alt=""
            style={{ width: "100%", height: "100%" }}
          />
        </div> */}
        

        <div className="card-content2">
          <div className="card-row2">
            <div
              className="inner-content lottery-results-heading"
              style={{ textAlign: "left", color: "#1E2637" }}
            >
              Transaction Details
            </div>
          </div>
        </div>

        <div className="results-grid">
          <div className="grid-item">
            <div className="value">
              ₹{Number(transaction.transaction.betAmount || 0).toFixed(2)}
            </div>
            <div className="label2">
              <span className="icon-circle"></span>Bet Amount
            </div>
          </div>
          <div className="grid-item">
            <div className="value">
              ₹{Number(transaction.transaction.winAmount || 0).toFixed(2)}
            </div>
            <div className="label2">
              <span className="icon-circle"></span>Win Amount
            </div>
          </div>
          <div className="grid-item">
            <div className="value">
              ₹{Number(transaction.balance.before || 0).toFixed(2)}
            </div>
            <div className="label2">
              <span className="icon-circle"></span>Balance Before
            </div>
          </div>
          <div className="grid-item">
            <div
              className="value"
              style={{
                color:
                  transaction.transaction.resultColor === "green"
                    ? "green"
                    : transaction.transaction.resultColor === "red"
                    ? "red"
                    : "#A8A5A1",
              }}
            >
              {transaction.transaction.profitLoss}
            </div>
            <div className="label2">
              <span className="icon-circle"></span>Net Amount
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Existing lottery card render function
  const renderLotteryCard = (bet, index) => {
    return (
      <div key={index} className="Card">
        <div className="card-header">
          <div className="card-header-left">
            <Typography variant="h6" fontWeight="bold" textAlign="left">
              {displayNameMap[bet.betType] || capitalizeText(bet.betType)}
            </Typography>
            <Typography variant="caption" color="#A8A5A1">
              {bet.timestamp
                ? new Date(bet.timestamp)
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")
                : "N/A"}
            </Typography>
          </div>
          <div className="card-header-right">
            <Typography
              variant="body1"
              sx={{ color: bet.isWin ? "#40c592" : "#e98613" }}
            >
              {!bet.isWin ? "Lose" : "Win"}
            </Typography>
          </div>
        </div>

        <div className="card-content">
          <div className="card-row">
            <span className="label">Type</span>
            <span className="value">
              {bet.betType
                ? bet.betType === "WINGO"
                  ? `Win Go ${bet.formattedTimer}`
                  : bet.betType === "FIVED"
                  ? `5D ${bet.formattedTimer}`
                  : // : bet.betType === "CAR_RACE"
                    // ? `Car Race ${bet.formattedTimer}`
                    `${capitalizeText(bet.betType)} ${bet.formattedTimer}`
                : "N/A"}
            </span>
          </div>
          <div className="card-row">
            <span className="label">Period</span>
            <span className="value">{bet.periodId}</span>
          </div>
          <div className="card-row">
            <span className="label">Order Number</span>
            <span className="value">
              {getShortTransactionId(bet.id) || "N/A"}
            </span>
          </div>
          <div className="card-row">
            <span className="label">Select</span>
            <span
              className="value"
              style={{
                color: bet.betType === "K3DICE" ? "#dd0000" : "#A8A5A1",
              }}
            >
              {formatGameDetails(bet)}
            </span>
          </div>
          <div className="card-row">
            <span className="label">Total Bet</span>
            <span className="value">
              ₹{Number(bet.actualBetAmount).toFixed(2)}
            </span>
          </div>
        </div>

        {/* <div className="card-divider">
          <img
            src="/assets/divider.webp"
            alt=""
            style={{ width: "100%", height: "100%" }}
          />
        </div> */}

        <div
          style={{
            width: "100%",
            height: "2px",
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "10px 2px", // bigger gaps = fewer dots
            backgroundRepeat: "repeat-x",
            margin: "12px auto",
          }}
        ></div>
        <div className="card-content2">
          <div className="card-row2">
            <div
              className="inner-content lottery-results-heading"
              style={{ textAlign: "left", color: "#fff" }}
            >
              Lottery Results
            </div>
          </div>
          <div className="card-row2">
            <div className="inner-content lottery-results">
              {typeof formatResult(bet) === "string" ? (
                <span className="value">{formatResult(bet)}</span>
              ) : bet.betType === "WINGO" ? (
                <div className="result-images">
                  {formatResult(bet).map((item, i) => {
                    const itemLower = item.trim().toLowerCase();
                    const textCategories = [
                      "small",
                      "big",
                      "odd",
                      "even",
                      "red",
                      "green",
                      "yellow",
                      "violet",
                    ];

                    if (
                      /^(zero|one|two|three|four|five|six|seven|eight|nine|\d)$/.test(
                        itemLower
                      )
                    ) {
                      return (
                        <div
                          style={{
                            width: "30px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <img
                            key={i}
                            src={imageMap[itemLower]}
                            alt={item}
                            className="result-image"
                            style={{ width: "100%" }}
                          />
                        </div>
                      );
                    } else if (
                      itemLower === "violet&red" ||
                      (itemLower.includes("violet") &&
                        itemLower.includes("red"))
                    ) {
                      return (
                        <div
                          key={i}
                          className="combined-result violet-red"
                          style={{
                            background: `linear-gradient(to bottom right,#fb4e4e 50%,#eb43dd 0)`,
                            color: "#fff",
                            height: "95%",
                            width: "80px",
                            borderRadius: "7px",
                            fontSize: "13px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          Red Violet
                        </div>
                      );
                    } else if (
                      itemLower === "violet&green" ||
                      (itemLower.includes("violet") &&
                        itemLower.includes("green"))
                    ) {
                      return (
                        <div
                          key={i}
                          className="combined-result violet-green"
                          style={{
                            background: `linear-gradient(to bottom right,#49ce9b 50%, #eb43dd 0)`,
                            color: "#fff",
                            height: "95%",
                            width: "80px",
                            borderRadius: "7px",
                            fontSize: "13px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          Green Violet
                        </div>
                      );
                    } else if (itemLower.includes("&")) {
                      const parts = itemLower.split("&");
                      const firstColor = colorMap[parts[0]] || "#9C27B0";
                      const secondColor = colorMap[parts[1]] || "#777";
                      const firstLetter = parts[0].charAt(0).toUpperCase();
                      const secondLetter = parts[1].charAt(0).toUpperCase();

                      return (
                        <div
                          key={i}
                          className="combined-result"
                          style={{
                            background: `linear-gradient(to right, ${firstColor}, ${secondColor})`,
                            color: "#fff",
                            height: "95%",
                            width: "80px",
                            borderRadius: "7px",
                            fontSize: "13px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {`${firstLetter}&${secondLetter}`}
                        </div>
                      );
                    } else if (textCategories.includes(itemLower)) {
                      return (
                        <div
                          key={i}
                          className="text-result-box"
                          style={{
                            backgroundColor: colorMap[itemLower] || "#777",
                            color: itemLower === "yellow" ? "#000" : "#fff",
                            height: "95%",
                            width: "60px",
                            borderRadius: "7px",
                            fontSize: "13px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {itemLower.charAt(0).toUpperCase() +
                            itemLower.slice(1).toLowerCase()}
                        </div>
                      );
                    } else if (colorMap[itemLower]) {
                      return (
                        <div
                          key={i}
                          className="text-result-box"
                          style={{
                            backgroundColor: colorMap[itemLower],
                            color: "#fff",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            display: "inline-block",
                            fontSize: "12px",
                          }}
                        >
                          {itemLower.charAt(0).toUpperCase() +
                            itemLower.slice(1).toLowerCase()}
                        </div>
                      );
                    } else if (itemLower.includes(" ")) {
                      const parts = itemLower.split(" ");
                      if (
                        (parts.includes("violet") && parts.includes("red")) ||
                        (parts.includes("violet") && parts.includes("green"))
                      ) {
                        const isVioletRed = parts.includes("red");
                        const gradientColors = isVioletRed
                          ? `linear-gradient(to right, ${colorMap.violet}, ${colorMap.red})`
                          : `linear-gradient(to right, ${colorMap.violet}, ${colorMap.green})`;
                        const text = isVioletRed ? "R / V" : "G/V";

                        return (
                          <div
                            key={i}
                            className={`combined-result ${
                              isVioletRed ? "violet-red" : "violet-green"
                            }`}
                            style={{
                              display: "inline-block",
                              background: gradientColors,
                              color: "#fff",
                              padding: "4px 12px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              textAlign: "center",
                            }}
                          >
                            {text}
                          </div>
                        );
                      }

                      return (
                        <div
                          key={i}
                          style={{
                            display: "inline-flex",
                            margin: "0 5px 5px 0",
                          }}
                        >
                          {parts.map((part, j) => {
                            if (textCategories.includes(part)) {
                              return (
                                <div
                                  key={`${i}-${j}`}
                                  style={{
                                    backgroundColor: colorMap[part] || "#777",
                                    color: part === "yellow" ? "#000" : "#fff",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    margin: "0 2px",
                                    fontSize: "12px",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {part}
                                </div>
                              );
                            } else if (imageMap[part]) {
                              return (
                                <img
                                  key={`${i}-${j}`}
                                  src={imageMap[part]}
                                  alt={part}
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    margin: "0 2px",
                                  }}
                                />
                              );
                            } else {
                              return (
                                <span key={`${i}-${j}`} className="value">
                                  {part}
                                </span>
                              );
                            }
                          })}
                        </div>
                      );
                    } else {
                      return (
                        <span
                          key={i}
                          className="value"
                          style={{ margin: "0 5px 5px 0" }}
                        >
                          {item}
                        </span>
                      );
                    }
                  })}
                </div>
              ) : bet.betType === "K3DICE" ? (
                <div className="result-images">
                  {formatResult(bet)?.map((diceNumber, i) => (
                    <div key={i} style={{ width: "25px" }}>
                      {diceNumber ? (
                        <img
                          src={diceImageMap[parseInt(diceNumber.trim())]}
                          alt={`dice ${diceNumber}`}
                          className="result-image"
                          style={{ width: "100%" }}
                        />
                      ) : (
                        <div></div>
                      )}
                    </div>
                  ))}
                </div>
              ) : bet.betType === "FIVED" ? (
                <span className="value">{formatResult(bet)}</span>
              ) : bet.betType === "CAR_RACE" ? (
                <div className="result-images">
                  {formatResult(bet)?.map((position, i) => (
                    <div
                      key={i}
                      style={{
                        width: "30px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {position ? (
                        <img
                          src={`/assets/race/winner${position}.webp`}
                          alt={`Car ${position}`}
                          className="result-image"
                          style={{ width: "100%" }}
                        />
                      ) : (
                        <div></div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="value">N/A</span>
              )}
            </div>
          </div>
        </div>
        <div className="results-grid">
          <div className="grid-item">
            <div className="value">
              ₹{Number(bet.actualBetAmount || 0).toFixed(2)}
            </div>
            <div className="label2">
              <span className="icon-circle"></span>Actual Amount
            </div>
          </div>
          <div className="grid-item">
            <div className="value">
              ₹{Number(bet.winAmount || 0).toFixed(2)}
            </div>
            <div className="label2">
              <span className="icon-circle"></span>Winnings
            </div>
          </div>
          <div className="grid-item">
            <div className="value">₹{Number(bet.tax).toFixed(2)}</div>
            <div className="label2">
              <span className="icon-circle"></span>Handling Fee
            </div>
          </div>
          <div className="grid-item">
            <div
              className="value"
              style={{ color: bet.isWin ? "green" : "red" }}
            >
              {bet.isWin ? "+" : "-"}₹
              {Math.abs(parseFloat(bet.profitLoss)).toFixed(2)}
            </div>
            <div className="label2">
              <span className="icon-circle"></span>Profit/Loss
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
        >
          <Box flexGrow={1}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#323738 ",
                padding: "7px 4px",
                color: "white",
              }}
            >
              <Grid item container alignItems="center" justifyContent="center">
                <Grid item xs={3}>
                  <IconButton
                    sx={{ color: "#ffffff", mr: 8 }}
                    onClick={() => navigate(-1)}
                  >
                    <ArrowBackIosNewIcon sx={{ fontSize: "20px" }} />
                  </IconButton>
                </Grid>
                <Grid item xs={9}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#ffffff",
                      flexGrow: 1,
                      textAlign: "center",
                      mr: 10,
                    }}
                  >
                    Bet History
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Box
              ref={containerRef}
              sx={{
                display: "flex",
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                padding: "15px 0",
                margin: "0 16px",
                gap: "6px",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                transition: "scroll 0.3s ease-out",
              }}
            >
              {tabsData.map((tab) => (
                <Box
                  key={tab.label}
                  sx={{
                    minWidth: "27%",
                    flex: "0 0 auto",
                    scrollSnapAlign: "start",
                  }}
                >
                  <Button
                    onClick={() => handleButtonClick(tab.label)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      background:
                        activeButton === tab.label
                          ? "linear-gradient(90deg,#24ee89,#9fe871)"
                          : "#323738",
                      color: activeButton === tab.label ? "#221f2e" : "#a8a5a1",
                      borderRadius: 1,
                      padding: "5px 0",
                      transition: "background-color 0.3s ease",
                      "&:hover": {
                        background:
                          activeButton === tab.label
                            ? "linear-gradient(90deg,#24ee89,#9fe871)"
                            : "#323738",
                      },
                    }}
                  >
                    <img
                      src={
                        activeButton === tab.label
                          ? tab.selectedImage
                          : tab.icon
                      }
                      alt={tab.label}
                      style={{
                        width: "22px",
                        height: "22px",
                        marginBottom: "4px",
                      }}
                    />
                    <Typography
                      sx={{ fontSize: "12px", textTransform: "none" }}
                    >
                      {tab.label}
                    </Typography>
                  </Button>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                padding: "0 16px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  backgroundColor: "#323738",
                  color: "#A8A5A1",
                  borderColor: "#323738",
                  borderRadius: 1,
                  padding: "10px 10px",
                  textTransform: "capitalize",
                  justifyContent: "space-between",
                  width: "100%",
                  "&:hover": {
                    backgroundColor: "#323738",
                    borderColor: "#323738",
                  },
                }}
                onClick={handleFilterClick}
              >
                {selectedOption === "All"
                  ? "All Games"
                  : selectedOption.toUpperCase() === "WINGO"
                  ? "Win Go"
                  : selectedOption.toUpperCase() === "K3DICE"
                  ? "K3"
                  : capitalizeText(selectedOption)}
                <KeyboardArrowDownOutlinedIcon />
              </Button>
              <Button
                variant="outlined"
                onClick={() => setDatePickerOpen(true)}
                sx={{
                  color: "#A8A5A1",
                  borderColor: "#323738",
                  borderRadius: 1,
                  padding: "10px 10px",
                  textTransform: "capitalize",
                  width: "100%",
                  justifyContent: "space-between",
                  marginLeft: "8px",
                  backgroundColor: "#323738",
                  "&:hover": {
                    backgroundColor: "#323738",
                    borderColor: "#323738",
                  },
                }}
              >
                {selectedDateRange.start && selectedDateRange.end
                  ? `${new Date(selectedDateRange.start).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )} - ${new Date(selectedDateRange.end).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}`
                  : "Select Date"}
                <KeyboardArrowDownOutlinedIcon />
              </Button>
            </Box>

            {loading ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="calc(100vh - 80px)"
              >
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                height="55%"
              >
                <img src="/assets/No data-2.webp" alt="Error" width={150} />
                <Typography color="grey">{error}</Typography>
              </Box>
            ) : (
              <Box padding="16px">
                {/* Render lottery bets */}
                {activeButton === "Lottery" &&
                  bets &&
                  bets.map((bet, index) => renderLotteryCard(bet, index))}

                {/* Render API history */}
                {activeButton !== "Lottery" &&
                  apiHistory &&
                  apiHistory.map((transaction, index) =>
                    renderApiTransactionCard(transaction, index)
                  )}

                {/* Infinite scroll trigger and loading indicator */}
                {((activeButton === "Lottery" && bets && bets.length > 0) ||
                  (activeButton !== "Lottery" &&
                    apiHistory &&
                    apiHistory.length > 0)) && (
                  <>
                    <div
                      ref={observerRef}
                      style={{ height: "20px", margin: "10px 0" }}
                    ></div>
                    {isFetching && (
                      <Box
                        display="flex"
                        justifyContent="center"
                        padding="20px"
                      >
                        <CircularProgress size={30} sx={{ color: "#dd0000" }} />
                      </Box>
                    )}
                  </>
                )}

                {/* No more records indicator */}
                {((activeButton === "Lottery" && bets && bets.length > 0) ||
                  (activeButton !== "Lottery" &&
                    apiHistory &&
                    apiHistory.length > 0)) &&
                  !hasMore &&
                  !isFetching && (
                    <Box display="flex" justifyContent="center" padding="20px">
                      <Typography color="#A8A5A1">No more records</Typography>
                    </Box>
                  )}
              </Box>
            )}
          </Box>

          {/* Filter Drawer */}
          <Drawer
            anchor="bottom"
            open={drawerOpen}
            onClose={handleDrawerClose}
            sx={{
              "& .MuiDrawer-paper": {
                width: "100%",
                height: "auto",
                margin: "0 auto",
                maxWidth: isSmallScreen ? "600px" : "396px",
                backgroundColor: "#323738",
                color: "#1E2637",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              },
            }}
          >
            <List
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: "10px",
                margin: "10px",
              }}
            >
              {filterOptions[activeButton].map((option) => {
                return (
                  <ListItem
                    button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    sx={{
                      background:
                        option === selectedOption
                          ? "linear-gradient(90deg,#24ee89,#9fe871)"
                          : "#3b3833",
                      "&:hover": {
                        background:
                          option === selectedOption
                            ? "linear-gradient(90deg,#24ee89,#9fe871)"
                            : "#3b3833",
                      },
                      color: option === selectedOption ? "#f1f2f5" : "#a8a5a1",
                      fontWeight: option === selectedOption ? "bold" : "normal",
                      borderRadius: "10px",
                      textAlign: "center",
                      cursor: "pointer",
                      width: "calc(50% - 5px)",
                    }}
                  >
                    <Grid sx={{ width: "40px", height: "40px" }}>
                      <img
                        src={
                          option === selectedOption
                            ? selectedGameImgMap[option]
                            : gameImgMap[option] ||
                              "/assets/lottery/default.webp"
                        }
                        alt={option}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Grid>
                    <ListItemText
                      primary={
                        option.toUpperCase() === "WINGO"
                          ? "Win Go"
                          : option.toUpperCase() === "K3DICE"
                          ? "K3"
                          : // : option.toUpperCase() === "CAR RACE"
                            // ? "Car Race"
                            capitalizeText(option)
                      }
                      sx={{ textAlign: "center" }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Drawer>

          {/* Date Picker Drawer */}
          <Drawer
            anchor="bottom"
            open={datePickerOpen}
            onClose={() => setDatePickerOpen(false)}
            sx={{
              "& .MuiDrawer-paper": {
                width: "100%",
                height: "auto",
                margin: "0 auto",
                maxWidth: isSmallScreen ? "600px" : "396px",
                color: "white",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                overflow: "hidden",
                padding: "0",
                backgroundColor: "#323738",
              },
            }}
          >
            <DatePickerHeader
              onCancel={() => setDatePickerOpen(false)}
              onConfirm={handleDateChange}
            />
            <DatePickerBody
              year={year}
              month={month}
              day={day}
              daysInMonth={daysInMonth}
              setYear={setYear}
              setMonth={setMonth}
              setDay={setDay}
              includeToday={true}
            />
          </Drawer>
        </Box>
      </Mobile>
    </>
  );
};

export default BetHistory;
