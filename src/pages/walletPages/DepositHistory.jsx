import React, { useCallback, useEffect, useReducer, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Mobile from "../../components/layout/Mobile";
import CalendarDrawer from "../../components/common/CalenderDrawer";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
// import noDataImage from "../assets/14-a397ff6b.webp";
import { domain } from "../../utils/Secret";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../context/AuthContext";
// Initial state
const initialState = {
  selectedFilter: "All",
  selectedMethod: "All",
  isOptionsDrawerOpen: false,
  selectedDate: [
    new Date(new Date().setDate(new Date().getDate() - 5)),
    new Date(),
  ],
  depositHistory: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  initialLoad: true,
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, selectedFilter: action.payload, page: 1, depositHistory: [], hasMore: true, initialLoad: true };
    case "SET_METHOD":
      return { ...state, selectedMethod: action.payload, page: 1, depositHistory: [], hasMore: true, initialLoad: true };
    case "TOGGLE_OPTIONS_DRAWER":
      return { ...state, isOptionsDrawerOpen: action.payload };
    case "SET_DATE":
      return { ...state, selectedDate: action.payload, page: 1, depositHistory: [], hasMore: true, initialLoad: true };
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { 
        ...state, 
        depositHistory: state.page === 1 ? action.payload : [...state.depositHistory, ...action.payload], 
        loading: false,
        hasMore: action.payload.length > 0,
        initialLoad: false,
        page: state.page + (action.payload.length > 0 ? 1 : 0)
      };
    case "FETCH_ERROR":
      return { ...state, error: action.payload, loading: false, initialLoad: false };
    default:
      return state;
  }
};

// Main component
const DepositHistory = () => {
  const [calendarDrawerOpen, setCalendarDrawerOpen] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const theme = useTheme();
  const { axiosInstance } = useAuth();
  const [calendarKey, setCalendarKey] = useState(0);
  // const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [filteredData, setfilteredData] = useState([]);
  const observer = useRef();
  const lastDepositElementRef = useCallback(node => {
    if (state.loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && state.hasMore) {
        fetchDepositHistory();
      }
    });
    if (node) observer.current.observe(node);
  }, [state.loading, state.hasMore]);

  // const [selectedDateRange, setSelectedDateRange] = useState({
  //   start: null,
  //   end: null,
  // });

  const toggleCalendarDrawer = (open) => {
    setCalendarDrawerOpen(open);
    if (open) {
      setCalendarKey((prev) => prev + 1); // Increment key when opening drawer
    }
  };

  // const handleDrawerClose = () => {
  //   setDrawerOpen(false);
  // };

  // const handleDateRangeSelect = (dateRange) => {
  //   //console.log("Date range selected:", dateRange);
  //   dispatch({ type: "SET_DATE", payload: [dateRange.start, dateRange.end] });
  // };

  const formatDateDisplay = (date) => {
    if (!date) return "Choose a date";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDate = useCallback((date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1); // Add 1 day
    return newDate.toISOString().split("T")[0];
  }, []);

  const fetchDepositHistory = useCallback(async () => {
    if (state.loading) return; // Prevent multiple simultaneous requests
    dispatch({ type: "FETCH_START" });

    try {
      const statusMap = {
        All: "",
        Completed: "SUCCESS",
        Pending: "PENDING",
        Cancelled: "CANCELLED",
      };

      let startDate = state.selectedDate[0]
        ? formatDate(state.selectedDate[0])
        : "";
      let endDate = state.selectedDate[1]
        ? formatDate(state.selectedDate[1])
        : "";

      // If startDate and endDate are the same, increment endDate by one day
      if (startDate && endDate && startDate === endDate) {
        const newEndDate = new Date(state.selectedDate[1]);
        newEndDate.setDate(newEndDate.getDate() + 2);
        endDate = newEndDate.toISOString().split("T")[0];
      }

      //console.log(startDate, endDate);
      const response = await axiosInstance.get(
        `${domain}/api/wallet/deposit/history`,
        {
          withCredentials: true,
          params: {
            status:
              state.selectedFilter !== "All"
                ? statusMap[state.selectedFilter]
                : "",
            method: state.selectedMethod !== "All" ? state.selectedMethod : "",
            startDate,
            endDate,
            page: state.page,
            limit: 10,
          },
        }
      );

      const newData = response.data.data || [];
      setfilteredData(state.page === 1 ? newData : [...filteredData, ...newData]);
      dispatch({ type: "FETCH_SUCCESS", payload: newData });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  }, [
    state.selectedFilter,
    state.selectedMethod,
    state.selectedDate,
    state.page,
    axiosInstance,
    formatDate,
    filteredData,
  ]);

  useEffect(() => {
    if (state.initialLoad) {
      fetchDepositHistory();
    }
  }, [state.selectedFilter, state.selectedMethod, state.selectedDate]);

  const handleFilterClick = (filter) => {
    dispatch({ type: "SET_FILTER", payload: filter });
    dispatch({ type: "TOGGLE_OPTIONS_DRAWER", payload: false });
  };

  const handleMethodClick = (method) => {
    dispatch({ type: "SET_METHOD", payload: method });
  };

  const toggleOptionsDrawer = (open) => () => {
    dispatch({ type: "TOGGLE_OPTIONS_DRAWER", payload: open });
  };

  const handleDateRangeSelect = (dateRange) => {
    let startDate = null;
    let endDate = null;

    if (dateRange.start) {
      startDate = new Date(dateRange.start);

      // If only start date is selected, automatically set end date to start date
      if (!dateRange.end) {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate());
      } else {
        endDate = new Date(dateRange.end);
      }

      // Ensure we're working with clean date objects (no time component)
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      dispatch({
        type: "SET_DATE",
        payload: [startDate, endDate],
      });
    }

    toggleCalendarDrawer(false);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "success":
        return "#149922"; // Green for completed
      case "pending":
        return "#FFA500"; // Orange for pending
      case "cancelled":
        return "#FF0000"; // Red for failed
      default:
        return "#757575"; // Grey for unknown statuses
    }
  };

  return (
    <>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          position="relative"
          color="#f2f2f1"
          sx={{ minHeight: "100vh", bgcolor: "#F5F5F5" }}
        >
          <Box flexGrow={1} sx={{ background: "#232626" }}>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#232626",
                padding: "7px 12px",
              }}
            >
              <Grid
                item
                xs={12}
                container
                alignItems="center"
                justifyContent="center"
              >
                <IconButton
                  sx={{
                    color: "#ffffff",
                    position: "absolute",
                    left: 0,
                    p: "12px",
                  }}
                  onClick={() => navigate(-1)}
                >
                  <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
                </IconButton>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#ffffff",
                    textAlign: "center",
                    fontSize: "19px",
                  }}
                >
                  Deposit history
                </Typography>
              </Grid>
            </Grid>

            {/* Filter and Method Buttons */}
            <Grid
              container
              justifyContent="space-between"
              sx={{ mx: "auto", width: "calc(100% - 18px)", mt: 1.5 }}
            >
              {[
                {
                  name: "All",
                  title: "All",
                  selectedIcon: "/assets/icons/all-selected.svg",
                  unselectedIcon: "/assets/icons/all-unselected.svg", // Add unselected icon here
                },
                {
                  name: "UPI",
                  title: "UPI X QR",
                  icon: "/assets/wallet/UPI x QR.webp",
                },
                {
                  name: "USDT",
                  title: "USDT",
                  icon: "/assets/icons/USDT.webp",
                },
              ].map((method) => (
                <Grid item xs={4} key={method.name} sx={{ paddingX: 0.5 }}>
                  <Button
                    onClick={() => handleMethodClick(method.name)}
                    sx={{
                      width: "100%",
                      height: "2.5rem",
                      background:
                        state.selectedMethod === method.name
                          ? "linear-gradient(90deg,#24ee89,#9fe871)"
                          : "#323738",
                      textTransform: "none",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "0 8px",
                      gap: "10px",
                      color:
                        state.selectedMethod === method.name
                          ? "#221f2e"
                          : "#B3BEC1",
                      borderRadius: "5px",
                      // fontWeight: "bold",
                      fontSize: "13px",
                    }}
                  >
                    <img
                      src={
                        method.name === "All"
                          ? state.selectedMethod === "All"
                            ? method.selectedIcon
                            : method.unselectedIcon
                          : method.icon
                      }
                      alt={method.title}
                      style={{
                        width: "16px",
                        height: "16px",
                        marginRight: "4px",
                        filter:
                          state.selectedMethod === method.title
                            ? "none"
                            : "none",
                      }}
                    />
                    <span>{method.title}</span>
                  </Button>
                </Grid>
              ))}
            </Grid>

            {/* Filter and Date Range Buttons */}
            <Grid
              container
              justifyContent="space-between"
              sx={{ m: "13px", width: "calc(100% - 26px)" }}
            >
              <Button
                onClick={toggleOptionsDrawer(true)}
                sx={{
                  width: "48%",
                  height: "2.8rem",
                  backgroundColor: "#323738",
                  textTransform: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 16px",
                  color: "#B3BEC1",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  fontSize: "14px",
                }}
              >
                <span>{state.selectedFilter}</span>
                <KeyboardArrowDownOutlinedIcon />
              </Button>
              <Button
                onClick={() => toggleCalendarDrawer(true)}
                sx={{
                  width: "48%",
                  height: "2.8rem",
                  backgroundColor: "#323738",
                  textTransform: "none",
                  display: "flex",
                  fontSize: "11.5px",
                  justifyContent: "space-between",
                  padding: "0 10px",
                  color: "#B3BEC1",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  whiteSpace: "nowrap", // Prevent text wrapping
                  overflow: "hidden", // Hide overflow
                  textOverflow: "ellipsis", // Show ellipsis if text overflows
                }}
              >
                <span>
                  {state.selectedDate[0] && state.selectedDate[1]
                    ? `${formatDateDisplay(state.selectedDate[0])} - ${formatDateDisplay(state.selectedDate[1])}`
                    : "Choose a date"}
                </span>
                <KeyboardArrowDownOutlinedIcon />
              </Button>
            </Grid>
            {/* Deposit History List */}
            <Box
              sx={{
                m: "13px",
                flexGrow: 1,
                overflowY: "auto",
              }}
            >
              {state.initialLoad && state.loading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ height: "100%" }}
                >
                  <CircularProgress />
                </Box>
              ) : state.error ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ height: "100%" }}
                >
                  <img
                    src="/assets/No data-1.webp"
                    alt="No Data"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                  <Typography variant="h6" sx={{ marginTop: "16px" }}>
                    No deposit history available.
                  </Typography>
                </Box>
              ) : filteredData.length > 0 ? (
                <>
                  {filteredData.map((deposit, index) => (
                    <Card
                      key={deposit.depositId}
                      ref={index === filteredData.length - 1 ? lastDepositElementRef : null}
                      sx={{
                        marginBottom: "12px",
                        borderRadius: "8px",
                        backgroundColor: "#323738",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <CardContent sx={{ paddingX: "16px", position: "relative" }}>
                        <Grid
                          container
                          xs={12}
                          mb={1}
                          sx={{ borderBottom: "1px solid #B3BEC1", display: "flex", alignItems: "center" }}
                        >
                          <Grid item xs={6}>
                            <Box
                              sx={{
                                backgroundColor: getStatusColor(deposit.depositStatus),
                                color: "#FFFFFF",
                                borderRadius: "5px",
                                padding: "4px",
                                fontSize: "14px",
                                textAlign: "center",
                                width: "5.5rem",
                                marginBottom: "6px",
                              }}
                            >
                              Deposit
                            </Box>
                          </Grid>
                          <Grid item xs={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "500",
                                fontSize: "14px",
                                color: getStatusColor(deposit.depositStatus),
                              }}
                            >
                              {deposit.depositStatus.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                          <Grid item xs={3} textAlign="left">
                            <Typography variant="body2" sx={{ color: "#B3BEC1" }}>
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
                            <Typography variant="body2" sx={{ color: "#B3BEC1" }}>
                              Type
                            </Typography>
                          </Grid>
                          <Grid item xs={9} textAlign="end">
                            <Typography variant="body2" sx={{ color: "#B3BEC1" }}>
                              {deposit.depositMethod}
                            </Typography>
                          </Grid>
                          <Grid item xs={3} textAlign="left">
                            <Typography variant="body2" sx={{ color: "#B3BEC1" }}>
                              Time
                            </Typography>
                          </Grid>
                          <Grid item xs={9} textAlign="end">
                            <Typography variant="body2" sx={{ color: "#B3BEC1" }}>
                              {new Date(deposit.depositDate).toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={4} textAlign="left">
                            <Typography variant="body2" sx={{ color: "#B3BEC1" }}>
                              Order number
                            </Typography>
                          </Grid>
                          <Grid item xs={8} textAlign="end">
                            <Typography variant="body2" sx={{ color: "#B3BEC1" }}>
                              {deposit.depositId}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                  {!state.initialLoad && state.loading && (
                    <Box display="flex" justifyContent="center" my={2}>
                      <CircularProgress size={30} />
                    </Box>
                  )}
                </>
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ height: "100%" }}
                >
                  <img
                    src="/assets/No data-1.webp"
                    alt="No Data"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                  <Typography variant="h6" sx={{ marginTop: "16px" }}>
                    No deposit history available.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Options Drawer */}
          <Drawer
            anchor="bottom"
            open={state.isOptionsDrawerOpen}
            onClose={toggleOptionsDrawer(false)}
            sx={{
              "& .MuiDrawer-paper": {
                width: "100%",
                height: "auto",
                margin: "0 auto",
                maxWidth: isSmallScreen ? "600px" : "396px",
                backgroundColor: "#323738",
                color: "white",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
                marginTop: "10px",
              }}
            >
              <Button
                onClick={toggleOptionsDrawer(false)}
                sx={{ color: "#969799", fontWeight: "normal" }}
              >
                Cancel
              </Button>
              <Button 
                onClick={toggleOptionsDrawer(false)}
                sx={{ color: "#24ee89", fontWeight: "bold" }}
              >
                Confirm
              </Button>
            </Box>
            <List>
              {["All", "Completed", "Pending", "Cancelled"].map((filter) => (
                <ListItem
                  button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  sx={{
                    color: "#b9bcc8",
                    fontWeight: "normal",
                    // borderBottom: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  <ListItemText primary={filter} />
                </ListItem>
              ))}
            </List>
          </Drawer>
          <CalendarDrawer
            key={calendarKey} // Add this line
            isOpen={calendarDrawerOpen}
            onClose={() => toggleCalendarDrawer(false)}
            onRangeSelect={handleDateRangeSelect}
            initialStartDate={state.selectedDate[0]}
            initialEndDate={state.selectedDate[1]}
          />

          {/* Date Picker Drawer */}
        </Box>
      </Mobile>
    </>
  );
};

export default DepositHistory;