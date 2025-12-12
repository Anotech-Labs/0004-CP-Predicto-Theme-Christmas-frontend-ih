import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  Grid,
  useMediaQuery
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import DatePickerHeader from "../../components/common/DatePickerHeader";
import DatePickerBody from "../../components/common/DatePickerBody";
import { format, addDays } from "date-fns";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Mobile from "../../components/layout/Mobile";

const TransactionHistory = () => {
  const navigate = useNavigate();
  const { axiosInstance } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({ totalAmount: 0, count: 0 });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });

  // Filter state
  const [filterType, setFilterType] = useState("All");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Date picker state
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [daysInMonth, setDaysInMonth] = useState([]);

  // Today's date for default values
  const today = new Date();
  const tomorrow = addDays(today, 1);

  // Date state
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  // Display date
  const [displayDate, setDisplayDate] = useState("Choose a date");

  // Actual date params for API
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Infinite scroll
  const observer = useRef();
  const lastTransactionElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && pagination.currentPage < pagination.totalPages) {
        loadMoreTransactions();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, pagination.currentPage, pagination.totalPages]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));


  // Update days in month when year or month changes
  useEffect(() => {
    const getDaysInMonth = (year, month) => {
      return new Date(year, month, 0).getDate();
    };

    setDaysInMonth(Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1));
  }, [selectedYear, selectedMonth]);

  // Load transactions on initial render and filter changes
  useEffect(() => {
    fetchTransactions();
  }, [startDate, endDate, filterType]);

  useEffect(() => {
    if (openDatePicker) {
      setSelectedYear(today.getFullYear());
      setSelectedMonth(today.getMonth() + 1);
      setSelectedDay(today.getDate()); // Set to today's date (not day before)
    }
  }, [openDatePicker]);

  // Properly map filter display names to API parameter values
  const filterOptions = [
    // Transaction Types
    "All",
    "Deposit",
    "Withdrawal",
    "Bonus",
    "VIP",
    // "Game",
    "Bet",
    "Win",
    "Other",
    // Specific Bonus Types
    "Manual Deposit",
    "USDT Deposit",
    "Manual Withdrawal",
    "Deposit Bonus",
    "Attendance Bonus",
    "Daily Reward",
    "Invitation Bonus",
    "Rebate Bonus",
    "Red Envelope",
    "Commission",
    "VIP Monthly Reward",
    "VIP One Time Bonus",
    "Winning Streak Bonus",
    "User Balance Admin",
    "Salary Person",
    "Lucky 10 Interest Reward",
    "Wingo",
    "K3",
    "Car Race",
    "5D",
    "Recharge Bonus",
    "Refer Bonus",
  ];

  // Map filter display names to API parameter types and values
  const getFilterParams = (filterType) => {
    switch (filterType) {
      // Transaction Types
      case "All":
        return {}; // No specific filter
      case "Deposit":
        return { transactionType: "DEPOSIT" };
      case "Withdrawal":
        return { transactionType: "WITHDRAWAL" };
      case "Bonus":
        return { transactionType: "BONUS" };
      case "VIP":
        return { transactionType: "VIP" };
      case "Game":
        return { transactionType: "GAME" };
      case "Bet":
        return { transactionType: "BET" };
      case "Win":
        return { transactionType: "WIN" };
      case "Other":
        return { transactionType: "OTHER" };

      // Specific Bonus Types
      case "Manual Deposit":
        return { bonusType: "MANUAL_DEPOSIT" };
      case "USDT Deposit":
        return { bonusType: "USDT_DEPOSIT" };
      case "Manual Withdrawal":
        return { bonusType: "MANUAL_WITHDRAWAL" };
      case "Deposit Bonus":
        return { bonusType: "DEPOSIT_BONUS" };
      case "Attendance Bonus":
        return { bonusType: "ATTENDANCE_BONUS" };
      case "Daily Reward":
        return { bonusType: "DAILY_REWARD" };
      case "Invitation Bonus":
        return { bonusType: "INVITATION_BONUS" };
      case "Rebate Bonus":
        return { bonusType: "REBATE_BONUS" };
      case "Red Envelope":
        return { bonusType: "RED_ENVELOPE" };
      case "Commission":
        return { bonusType: "COMMISSION" };
      case "VIP Monthly Reward":
        return { bonusType: "VIP_MONTHLY_REWARD" };
      case "VIP One Time Bonus":
        return { bonusType: "VIP_ONE_TIME_BONUS" };
      case "Winning Streak Bonus":
        return { bonusType: "WINNING_STREAK_BONUS" };
      case "User Balance Admin":
        return { bonusType: "USER_BALANCE_ADMIN" };
      case "Salary Person":
        return { bonusType: "SALARY_PERSON" };
      case "Lucky 10 Interest Reward":
        return { bonusType: "LUCKY_10_INTEREST_REWARD" };
      case "Wingo":
        return { bonusType: "WINGO" };
      case "K3":
        return { bonusType: "K3" };
      case "Car Race":
        return { bonusType: "CAR_RACE" };
      case "5D":
        return { bonusType: "FIVED" };
      case "Recharge Bonus":
        return { bonusType: "RECHARGE_PERCENTAGE_BONUS" };
      case "Refer Bonus":
        return { bonusType: "REFFER_BONUS" };
      default:
        return {}; // Default to no filter
    }
  };

  // Fetch transactions
  const fetchTransactions = async (page = 1, append = false) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      let queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", pagination.itemsPerPage);

      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      // Get proper filter parameters based on selection
      const filterParams = getFilterParams(filterType);

      // Add filter parameters to query
      Object.entries(filterParams).forEach(([key, value]) => {
        queryParams.append(key, value);
      });

      const response = await axiosInstance.get(`/api/transaction/my-transactions?${queryParams.toString()}`);

      const { data, pagination: paginationData, summary: summaryData } = response.data;

      if (append) {
        setTransactions(prev => [...prev, ...data]);
      } else {
        setTransactions(data);
      }

      setPagination(paginationData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch transactions");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load more transactions for infinite scroll
  const loadMoreTransactions = () => {
    if (pagination.currentPage < pagination.totalPages) {
      fetchTransactions(pagination.currentPage + 1, true);
    }
  };

  // Handle date confirmation
  const handleDateConfirm = () => {
    const newSelectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    const formattedSelectedDate = format(newSelectedDate, "yyyy-MM-dd");
    const nextDay = addDays(newSelectedDate, 1);
    const formattedNextDay = format(nextDay, "yyyy-MM-dd");

    setStartDate(formattedSelectedDate);
    setEndDate(formattedNextDay);
    setDisplayDate(format(newSelectedDate, "yyyy-MM-dd"));
    setOpenDatePicker(false);
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate(-1);
  };

  // Handle filter selection
  const handleFilterSelect = (filterValue) => {
    setFilterType(filterValue);
    setFilterDrawerOpen(false);
  };

  // Format transaction for display
  const formatTransactionType = (type) => {
    switch (type) {
      case "DEPOSIT": return "Deposit";
      case "WITHDRAWAL": return "Withdraw";
      case "BONUS": return "Bonus";
      case "GAME": return "Game";
      case "BET": return "Bet";
      case "WIN": return "Win";
      case "VIP": return "VIP";
      case "OTHER": return "Other";
      default: return type.charAt(0) + type.slice(1).toLowerCase();
    }
  };

  // Format transaction details for display
  const formatTransactionDetails = (details, type) => {
    switch (details) {
      // DEPOSIT related codes
      case "MDR": return "Manual Deposit Request";
      case "MDF": return "Manual Deposit Failed";
      case "MDC": return "Manual Deposit Complete";
      case "USDTR": return "USDT Request";
      case "USDTF": return "USDT Failed";
      case "USDTC": return "USDT Complete";

      // WITHDRAWAL related codes
      case "MWR": return "Manual Withdrawal Request";
      case "MWF": return "Manual Withdrawal Failed";
      case "MWC": return "Manual Withdrawal Complete";

      // BONUS related codes
      case "DR": return "Daily Reward";
      case "IB": return "Invitation Bonus";
      case "RB": return "Rebate Bonus";
      case "RE": return "Red Envelope";
      case "COMMISSION": return "Commission";
      case "RRB": return "Refer Bonus";

      // VIP related codes
      case "VIP MR": return "VIP Monthly Reward";
      case "VIP OTB": return "VIP One Time Bonus";

      // OTHER codes
      case "WSB": return "Winning Streak Bonus";
      case "UBA": return "User Balance Admin";
      case "SP": return "Salary Person";
      case "L10IR": return "Lucky 10 Interest Reward";

      // Games
      case "WINGO": return "Wingo Game";
      case "K3": return "K3 Game";
      case "CAR_RACE": return "Car Race Game";
      case "FIVED": return "5D Game";
      case "BET": return "Bet";
      case "WIN": return "Win";

      // Handle specific cases for Recharge Bonus
      case "RPB":
      case "Recharge percentage bonus":
        return "Lucky Recharge Bonus";

      // Handle deposit bonus
      default:
        if (details.startsWith("DB") && type === "BONUS") {
          return `Deposit Bonus ${details.substring(3)}`;
        } else if (details.startsWith("AB") && type === "BONUS") {
          return `Attendance Bonus ${details.substring(3)}`;
        }
        return details;
    }
  };

  // Get card title based on transaction and selected filter
  const getCardTitle = (transaction) => {
    const transactionType = transaction.transactionType;
    const details = transaction.details;

    // Handle specific cases for Recharge Bonus
    if (details === "RPB") {
      return "Recharge Bonus";
    }

    if (details === "RRB") {
      return "Refer Bonus";
    }

    // For specific transaction types, use more descriptive titles
    const formattedDetail = formatTransactionDetails(details, transactionType);

    // If it's a specific status, handle it properly
    if (details === "MDF" || details === "USDTF" || details === "MWF") {
      return formattedDetail;
    } else if (details === "MDR" || details === "USDTR" || details === "MWR") {
      return formattedDetail;
    } else if (details === "MDC" || details === "USDTC" || details === "MWC") {
      return formattedDetail;
    }

    // For All filter, show the specific transaction type
    if (filterType === "All") {
      return formatTransactionType(transactionType);
    }

    // Otherwise use the selected filter as the title
    return filterType;
  };

  // Get title color based on transaction status
  const getTitleColor = (transaction) => {
    return "#F5A623";
  };

  // Get text color for title (to ensure readability against background)
  const getTitleTextColor = (bgColor) => {
    return bgColor === "#F44336" || bgColor === "#4CAF50" || bgColor === "#B3BEC1" ? "#B3BEC1" : "#000";
  };

  return (
    <Mobile>
      <Box sx={{ backgroundColor: "#232626", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Header section */}
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "#232626",
            padding: "3px 12px",
          }}
        >
          <Grid item xs={12} container alignItems="center" justifyContent="center">
            <IconButton
              sx={{
                color: "#ffffff",
                position: "absolute",
                left: 0,
                p: "12px",
              }}
              onClick={handleBackClick}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                color: "#ffffff",
                textAlign: "center",
                fontSize: "19px",
                fontWeight: "semi-bold",
              }}
            >
              Transaction history
            </Typography>
          </Grid>
        </Grid>

        {/* Filter Bar */}
        <Box sx={{
          margin: "12px 12px 25px 12px",
          display: "flex",
          gap: "12px",
          backgroundColor: "#232626",
        }}>
          <Button
            variant="outlined"
            onClick={() => setFilterDrawerOpen(true)}
            sx={{
              flex: 1,
              width: "48%",
              height: "2.8rem",
              backgroundColor: "#323738",
              border: "transparent",
              textTransform: "none",
              display: "flex",
              fontSize: "15px",
              justifyContent: "space-between",
              padding: "0 10px",
              color: "#B3BEC1",
              fontWeight: "550",
              borderRadius: "5px",
            }}
          >
            {filterType}
            <KeyboardArrowDownOutlinedIcon />
          </Button>
          <Button
            variant="outlined"
            onClick={() => setOpenDatePicker(true)}
            sx={{
              flex: 1,
              justifyContent: "space-between",
              backgroundColor: "#323738",
              border: "transparent",
              textTransform: "none",
              display: "flex",
              fontSize: "15px",
              padding: "0 10px",
              color: "#B3BEC1",
              fontWeight: "600",
              borderRadius: "5px",
            }}
          >
            {displayDate}
            <KeyboardArrowDownOutlinedIcon />
          </Button>
        </Box>

        {/* Transactions list */}
        <Box sx={{ flexGrow: 1, backgroundColor: "#232626", padding: "0", overflowY: "auto" }}>
          {error ? (
            <Typography variant="body1" color="error" sx={{ textAlign: "center", my: 4 }}>
              {error}
            </Typography>
          ) : transactions.length === 0 && !loading ? (
            <Typography variant="body1" sx={{ textAlign: "center", my: 4, color: "gray" }}>
              No data available.
            </Typography>
          ) : (
            <List sx={{ p: 0 }}>
              {transactions.map((transaction, index) => {
                const isPositiveAmount = transaction.amount > 0;
                const isWin = transaction.details === "WIN" || transaction.details === "Win";
                const isBet = transaction.details === "BET" || transaction.details === "Bet";

                const cardTitle = getCardTitle(transaction);
                const cardBgColor = getTitleColor(transaction);
                const cardTextColor = getTitleTextColor(cardBgColor);

                return (
                  <ListItem
                    ref={index === transactions.length - 1 ? lastTransactionElementRef : null}
                    key={transaction.id}
                    sx={{ p: "0 12px", mb: 2 }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <Box
                        sx={{
                          bgcolor: cardBgColor,
                          color: cardTextColor,
                          p: 1.5,
                          borderTopLeftRadius: "4px",
                          borderTopRightRadius: "4px",
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: "normal", color: "#ffffff" }}>
                          {cardTitle}
                        </Typography>
                      </Box>

                      <Box sx={{ bgcolor: "#323738", p: "12px 6px", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, background: "#232626", p: 1, borderRadius: "5px" }}>
                          <Typography variant="body2" sx={{ color: "#B3BEC1", fontSize: "12px" }}>Detail</Typography>
                          <Typography variant="body2" sx={{ color: "#B3BEC1", fontSize: "12px" }}>
                            {formatTransactionDetails(transaction.details, transaction.transactionType)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, background: "#232626", p: 1, borderRadius: "5px" }}>
                          <Typography variant="body2" sx={{ color: "#B3BEC1", fontSize: "12px" }}>Time</Typography>
                          <Typography variant="body2" sx={{ color: "#B3BEC1", fontSize: "12px" }}>
                            {format(new Date(transaction.createdAt), "yyyy-MM-dd HH:mm:ss")}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between", background: "#232626", p: 1, borderRadius: "5px" }}>
                          <Typography variant="body2" sx={{ color: "#B3BEC1", fontSize: "12px" }}>Balance</Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: isPositiveAmount ? "#4CAF50" : "#F44336",
                              fontWeight: "normal", fontSize: "17px"
                            }}
                          >
                            ₹{Math.abs(transaction.amount).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          )}

          {/* Loading indicator */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress size={24} color="primary" />
            </Box>
          )}
        </Box>

        {/* Date picker dialog */}
        <Dialog
          open={openDatePicker}
          onClose={() => setOpenDatePicker(false)}
          PaperProps={{
            sx: {
              width: "100%",
              height: "auto",
              margin: "0 auto",
              maxWidth: isSmallScreen ? "600px" : "396px",
              background: "#323738",
              color: "black",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              position: "absolute",
              bottom: 0,

            }
          }}
          fullWidth
        >
          <DatePickerHeader
            onCancel={() => setOpenDatePicker(false)}
            onConfirm={handleDateConfirm}
          />
          <DatePickerBody
            year={selectedYear}
            month={selectedMonth}
            day={selectedDay}
            daysInMonth={daysInMonth}
            setYear={setSelectedYear}
            setMonth={setSelectedMonth}
            setDay={setSelectedDay}
            includeToday={true} // Add this prop to include today's date
          />
        </Dialog>

        {/* Filter drawer - Styled to match your screenshots */}
        <Dialog
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: "100%",
              height: "auto",
              margin: "0 auto",
              maxWidth: isSmallScreen ? "600px" : "396px",
              backgroundColor: "#201d29",
              color: "black",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              position: "absolute",
              bottom: 0,
            }
          }}
          fullWidth
        >
          {/* Header with Cancel/Confirm buttons */}
          <Box
            sx={{
              padding: "16px",
              backgroundColor: "#323738",
              display: "flex",
              justifyContent: "space-between",
              // borderBottom: "1px solid rgba(255,255,255,0.1)"
            }}
          >
            <Typography
              sx={{ color: "#888", cursor: "pointer", fontWeight: "bold" }}
              onClick={() => setFilterDrawerOpen(false)}
            >
              Cancel
            </Typography>
            <Typography
              sx={{ color: "#f5993b", fontWeight: "bold", cursor: "pointer" }}
              onClick={() => handleFilterSelect(filterType)}
            >
              Confirm
            </Typography>
          </Box>

          {/* Scrollable options container */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              maxHeight: "calc(60vh - 220px)" // Account for header height
            }}
          >
            {filterOptions.map((option, index) => {
              // Determine if this option is the currently selected one
              const isSelected = filterType === option;

              // Apply special styling for the selected item (white background as in screenshot)
              return (
                <Button
                  key={index}
                  sx={{
                    padding: "10px",
                    width: "100%",
                    textAlign: "center",
                    borderRadius: "0",
                    backgroundColor: isSelected ? "#323738" : "transparent",
                    color: isSelected ? "#B3BEC1" : "#888",
                    justifyContent: "center",
                    textTransform: "none",
                    fontSize: "15px",
                    fontWeight: isSelected ? "bold" : "normal",
                    // "&:hover": {
                    //   backgroundColor: isSelected ? "#f2f2f1" : "rgba(255,255,255,0.05)"
                    // }
                    marginTop: "20px"
                  }}
                  onClick={() => handleFilterSelect(option)}
                >
                  {option}
                </Button>
              );
            })}
          </Box>
        </Dialog>
      </Box>
    </Mobile>
  );
};

export default TransactionHistory;