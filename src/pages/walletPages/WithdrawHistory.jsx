import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Mobile from "../../components/layout/Mobile";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import CloseIcon from "@mui/icons-material/Close";
// import { TextField } from "@mui/material";
// import axios from "axios";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { domain } from "../../utils/Secret";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CalendarDrawer from "../../components/common/CalenderDrawer";
import { useAuth } from "../../context/AuthContext";
// import Drawer from "@mui/material/Drawer";

const WithdrawHistory = () => {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState([]);
  // const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [calendarDrawerOpen, setCalendarDrawerOpen] = useState(false);
  const [statusDrawerOpen, setStatusDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { axiosInstance } = useAuth();

  // Add new state for pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const pageSize = 10;

  // Reference for the observer
  const observer = useRef();
  // Reference for the last withdrawal item
  const lastWithdrawalRef = useCallback(
    (node) => {
      if (isLoadingMore) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            // Ensure we're keeping the current filter context

            loadMore();
          }
        },
        {
          threshold: 0.1, // Reduced threshold for earlier trigger
        }
      );

      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoadingMore, hasMore, selectedType, page]
  );

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleDrawerClose = () => {
    setStatusDrawerOpen(false);
  };

  const handleOpenCalendarDrawer = () => {
    setCalendarDrawerOpen(true);
  };

  const handleCloseCalendarDrawer = () => {
    setCalendarDrawerOpen(false);
  };

  // Format date to YYYY-MM-DD with optional day increment
  const formatDate = (date, incrementDays = 0) => {
    if (!date) return "";
    const d = new Date(date);
    // Add the increment if specified
    d.setDate(d.getDate() + incrementDays);
    return d.toISOString().split("T")[0];
  };
  const fetchWithdrawals = async (pageNum = 1, shouldAppend = false) => {
    const isInitialLoad = pageNum === 1;
    isInitialLoad ? setIsLoading(true) : setIsLoadingMore(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      // Only add dates to params if both start and end dates are present
      let formatedStartDate = formatDate(startDate);
      let formatedEndDate = formatDate(endDate);
      if (startDate && endDate && formatedStartDate === formatedEndDate) {
        formatedEndDate = formatDate(formatedEndDate, 1);
      }

      params.append("startDate", formatedStartDate); // Increment start date by 1
      params.append("endDate", formatedEndDate); // Increment end date by 1

      if (selectedStatus !== "All") {
        params.append("status", selectedStatus.toUpperCase());
      }

      if (selectedType !== "All") {
        params.append("method", selectedType);
      }

      // Add pagination parameters
      params.append("page", pageNum);
      params.append("limit", pageSize);

      const response = await axiosInstance.get(
        `${domain}/api/wallet/withdraw/history?${params.toString()}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        const newWithdrawals = response.data.data;
        setWithdrawals((prev) =>
          shouldAppend ? [...prev, ...newWithdrawals] : newWithdrawals
        );
        setHasMore(newWithdrawals.length === pageSize);
        setPage(pageNum);
      } else {
        console.warn(
          "Failed to fetch withdrawal history:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error fetching withdrawal history:", error);
    } finally {
      isInitialLoad ? setIsLoading(false) : setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchWithdrawals(1, false);
  }, [selectedType, selectedStatus, startDate, endDate]);

  // Load more function
  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchWithdrawals(page + 1, true);
    }
  };

  const handleRedirect = () => {
    navigate(-1);
  };
  const handleTypeChange = (type) => {
    if (selectedType === type) return; // Prevent unnecessary state updates
    //console.log("Changing type to:", type); // Debug log
    setPage(1);
    setHasMore(true);
    setWithdrawals([]); // Clear existing withdrawals
    setSelectedType(type);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setStatusDrawerOpen(false);
  };

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);
  const handleDateRangeSelect = (range) => {
    if (!range?.start && !range?.end) {
      setCalendarDrawerOpen(false);
      return;
    }

    // If only start date is selected, use it for both start and end
    if (range?.start && !range?.end) {
      const start = new Date(range.start);
      start.setHours(0, 0, 0, 0);

      setStartDate(formatDate(start, 1));
      setEndDate(formatDate(start, 1));
      setCalendarDrawerOpen(false);
      return;
    }

    // Set the time to start of day for start date and end of day for end date
    const start = new Date(range.start);
    start.setHours(0, 0, 0, 0);

    const end = new Date(range.end);
    end.setHours(23, 59, 59, 999);

    setStartDate(formatDate(start, 1));
    setEndDate(formatDate(end));
    setCalendarDrawerOpen(false);
  };
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Mobile>
      <Box sx={{ backgroundColor: "#232626", minHeight: "100vh" }}>
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
              onClick={handleRedirect}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ color: "#ffffff", textAlign: "center", fontSize: "19px" }}
            >
              Withdrawal History
            </Typography>
          </Grid>
        </Grid>

        {/* Filter Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: "8px",
            padding: 0,
            backgroundColor: "#232626",
            marginBottom: 1,
            mx: "auto",
            width: "calc(100% - 30px)",
            borderRadius: 2,
            overflow: "hidden",
            marginTop: 1.5,
          }}
        >
          {[
            {
              label: "All",
              title: "All",
              selectedIcon: "/assets/icons/all-selected.svg",
              unselectedIcon: "/assets/icons/all-unselected.svg",
            },
            {
              title: "UPI x QR",
              label: "BANK_TRANSFER",
              icon: "/assets/wallet/UPI x QR.webp",
              // disabled: true
            },
            {
              title: "USDT",
              label: "USDT",
              icon: "/assets/icons/usdt2.webp",
              // disabled: true
            },
          ].map(({ title, label, selectedIcon, unselectedIcon, icon }) => (
            <Button
              key={title}
              variant={selectedType === label ? "contained" : "outlined"}
              onClick={() => handleTypeChange(label)}
              // onClick={() => !disabled && handleTypeChange(label)}
              sx={{
                display: "flex",
                fontWeight: "bold",
                alignItems: "center",
                background:
                  selectedType === label
                    ? "linear-gradient(90deg,#24ee89,#9fe871)"
                    : "#323738",
                color: selectedType === label ? "black" : "#B79C8B",
                borderColor:
                  selectedType === label ? "transparent" : "transparent",
                borderRadius: 2,
                boxShadow:
                  selectedType === label
                    ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                    : "none",
                padding: "6px 20px",
                minWidth: "110px",
                textTransform: "none",
              }}
            >
              <Box
                component="img"
                src={
                  title === "All"
                    ? selectedType === "All"
                      ? selectedIcon // Show selected icon for "All"
                      : unselectedIcon // Show unselected icon for "All"
                    : icon // For other buttons, show their respective icons
                }
                alt={title}
                sx={{
                  width: "16px",
                  height: "16px",
                  marginRight: "8px",
                }}
                onError={(e) => {
                  e.target.src = "/assets/icons/default-icon.svg"; // Fallback image if not found
                }}
              />
              {title}
            </Button>
          ))}
        </Box>

        {/* Filters */}
        <Grid
          container
          justifyContent="space-between"
          sx={{ m: 2, mx: "auto", width: "calc(100% - 30px)" }}
        >
          <Button
            onClick={() => setStatusDrawerOpen(true)}
            sx={{
              width: "48%",
              height: "2.8rem",
              backgroundColor: "#323738",
              justifyContent: "space-between",
              textTransform: "none",
              color: "#B79C8B",
              padding: "0 16px",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
          >
            {selectedStatus}
            <KeyboardArrowDownOutlinedIcon />
          </Button>
          <Button
            onClick={() => handleOpenCalendarDrawer(true)}
            sx={{
              width: "48%",
              height: "2.8rem",
              backgroundColor: "#323738",
              textTransform: "none",
              display: "flex",
              fontSize: "11.5px",
              justifyContent: "space-between",
              padding: "0 10px",
              color: "#B79C8B",
              fontWeight: "bold",
              borderRadius: "5px",
              whiteSpace: "nowrap", // Prevent text wrapping
              overflow: "hidden", // Hide overflow
              textOverflow: "ellipsis", // Show ellipsis if text overflows
            }}
          >
            {startDate && endDate
              ? `${formatDisplayDate(startDate)} - ${formatDisplayDate(
                  endDate
                )}`
              : "Choose a date"}
            <KeyboardArrowDownOutlinedIcon />
          </Button>
        </Grid>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ textAlign: "center", my: 4 }}>
            <Typography sx={{ color: "#B79C8B" }}>Loading...</Typography>
          </Box>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <Box sx={{ textAlign: "center", my: 4 }}>
            <Typography sx={{ color: "#e74c3c" }}>{error}</Typography>
            <Button
              onClick={fetchWithdrawals}
              sx={{
                mt: 2,
                color: "#FED358",
                "&:hover": {
                  backgroundColor: "rgba(240, 150, 14, 0.1)",
                },
              }}
            >
              Retry
            </Button>
          </Box>
        )}

        {/* Empty State */}
        {!isLoading && !error && withdrawals.length === 0 && (
          <Box sx={{ textAlign: "center", my: 4 }}>
            <Typography sx={{ color: "#B79C8B" }}>
              No withdrawal history found
            </Typography>
          </Box>
        )}

        {/* Withdrawal History */}
        {!isLoading && !error && withdrawals.length > 0 && (
          <Box sx={{ m: 2 }}>
            {withdrawals.map((withdrawal, index) => (
              <Card
                key={withdrawal._id}
                // Add ref to last item for infinite scroll
                ref={
                  index === withdrawals.length - 1 ? lastWithdrawalRef : null
                }
                sx={{
                  backgroundColor: "#323738",
                  color: "#768096",
                  marginBottom: 2,
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <CardContent sx={{ padding: 0, mb: -2 }}>
                  <Box sx={{ padding: 1, borderBottom: "1px solid grey" }}>
                    <Grid container alignItems="center">
                      <Grid item xs={6} sx={{ textAlign: "left" }}>
                        <Chip
                          label="Withdraw"
                          sx={{
                            fontWeight: "bold",
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
                          {withdrawal.withdrawStatus
                            .charAt(0)
                            .toUpperCase() + withdrawal.withdrawStatus.slice(1).toLowerCase()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ paddingX: 1.5, paddingY: 1 }}>
                    <Grid container sx={{ textAlign: "left" }}>
                      {[
                        {
                          label: "Balance",
                          value:
                            withdrawal.withdrawMethod === "USDT"
                              ? `$${withdrawal.withdrawAmount}`
                              : `₹${withdrawal.withdrawAmount}`,
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
                          value: withdrawal.withdrawMethod === "BANK_TRANSFER"
                            ? "Bank Transfer"
                            : withdrawal.withdrawMethod,
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
                        {
                          label: "Remark",
                          value: withdrawal.remark,
                          fontSize: "12px",
                        },
                      ]?.map(
                        ({ label, value, color, fontSize, fontWeight }) => (
                          <React.Fragment key={label}>
                            <Grid item xs={6}>
                              <Typography
                                sx={{
                                  color: "#7f8c8d",
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
                                  color: color || "inherit",
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
            ))}

            {/* Loading more indicator */}
            {isLoadingMore && (
              <Box sx={{ textAlign: "center", py: 2 }}>
                <Typography sx={{ color: "#B79C8B" }}>
                  Loading more...
                </Typography>
              </Box>
            )}

            {/* No more data indicator */}
            {!hasMore && withdrawals.length > 0 && (
              <Box sx={{ textAlign: "center", py: 2 }}>
                <Typography sx={{ color: "#B79C8B" }}>
                  No more withdrawals to load
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Calendar Drawer */}
        {/* <Drawer
          anchor="bottom"
          open={calendarDrawerOpen}
          onClose={() => setCalendarDrawerOpen(false)}
          PaperProps={{
            sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16 },
          }}
        >
          <Box sx={{ padding: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Calendar
              </Typography>
              <IconButton onClick={() => setCalendarDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleDateRangeConfirm}
            >
              Confirm
            </Button>
          </Box>
        </Drawer> */}

        {/* <Drawer
  anchor="bottom"
  open={calendarDrawerOpen}
  onClose={() => setCalendarDrawerOpen(false)}
  PaperProps={{
    sx: { 
      borderTopLeftRadius: 16, 
      borderTopRightRadius: 16,
      maxWidth: isSmallScreen ? "425px" : "396px",
      margin: "0 auto",
      width: "100%",
    },
  }}
>
  <CalendarDrawer
    onDateSelect={(date) => {
      setStartDate(date.toISOString().split('T')[0]);
      setEndDate(date.toISOString().split('T')[0]);
    }}
    onConfirm={() => {
      setCalendarDrawerOpen(false);
      applyFilters();
    }}
  />
</Drawer> */}

        <CalendarDrawer
          isOpen={calendarDrawerOpen}
          onClose={handleCloseCalendarDrawer}
          onRangeSelect={handleDateRangeSelect}
        />

        {/* <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "center",
                marginBottom: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center", }}>
                Select Status
              </Typography>
              <IconButton onClick={() => setStatusDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box> */}

        {/* Status Drawer */}
        <Drawer
          anchor="bottom"
          open={statusDrawerOpen}
          onClose={() => setStatusDrawerOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: "100%",
              height: "auto",
              margin: "0 auto",
              maxWidth: isSmallScreen ? "600px" : "396px",
              backgroundColor: "#323738",
              color: "black",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            },
          }}
        >
          <Box sx={{}}>
            <Box
              sx={{
                padding: "16px 16px",
                display: "flex",
                justifyContent: "space-between",
                // marginBottom: "16px",
              }}
            >
              <Typography
                sx={{ color: "#969799", cursor: "pointer", fontWeight: "bold" }}
                onClick={handleDrawerClose}
              >
                Cancel
              </Typography>
              <Typography
                sx={{ color: "#24EE89", fontWeight: "bold", cursor: "pointer" }}
              >
                Confirm
              </Typography>
            </Box>
            <List sx={{ backgroundColor: "#232626" }}>
              {["All", "Pending", "Completed", "Rejected"].map((status) => (
                <ListItem
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  sx={{
                    color: "#B79C8B",
                    fontWeight: "normal",
                    textAlign: "center",
                  }}
                >
                  <ListItemText
                    primary={status}
                    primaryTypographyProps={{
                      textTransform: "none !important", // Force it
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>
    </Mobile>
  );
};

export default WithdrawHistory;
