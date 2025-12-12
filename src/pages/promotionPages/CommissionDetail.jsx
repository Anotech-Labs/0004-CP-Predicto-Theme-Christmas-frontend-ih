import React, { useEffect, useState } from "react";
import Mobile from "../../components/layout/Mobile";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import DatePickerHeader from "../../components/common/DatePickerHeader";
import DatePickerBody from "../../components/common/DatePickerBody";
import { domain } from "../../utils/Secret";
import { Drawer } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

const getDaysInMonth = (year, month) => {
  return Array.from(
    { length: new Date(year, month, 0).getDate() },
    (_, i) => i + 1
  );
};

const CommissionDetail = () => {
  const navigate = useNavigate();
  const [searchDate, setSearchDate] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [summaryStats, setSummaryStats] = useState({
    totalBettingAmount: 0,
    totalCommissionPayout: 0,
    totalBettors: 0,
    totalInvestedAmount: 0,
    levelCommissionDetails: [],
    gameTypeDistribution: [],
  });
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { axiosInstance } = useAuth();

  useEffect(() => {
    initializeDate();
  }, []);

  useEffect(() => {
    setDaysInMonth(getDaysInMonth(year, month));
    if (day > getDaysInMonth(year, month).length) {
      setDay(getDaysInMonth(year, month).length);
    }
  }, [year, month]);

  useEffect(() => {
    if (searchDate) {
      fetchDepositsSummary();
    }
  }, [searchDate]);

  const initializeDate = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const formattedDate = yesterday.toISOString().split("T")[0];
    setSearchDate(formattedDate);
    setSelectedDate(formattedDate);
    setYear(yesterday.getFullYear());
    setMonth(yesterday.getMonth() + 1);
    setDay(yesterday.getDate());
  };

  const fetchDepositsSummary = async () => {
    try {
      const startDate = searchDate;
      const endDate = searchDate;

      const response = await axiosInstance.get(
        `${domain}/api/promotion/commission-details-data`,
        {
          params: { startDate, endDate },
          withCredentials: true,
        }
      );

      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setSummaryStats(data);
      }
    } catch (error) {
      console.error("Error fetching deposit summary:", error.message);
    }
  };

  const handleDateDrawerToggle = () => {
    setDatePickerOpen(!datePickerOpen);
  };

  const handleDateChange = () => {
    const formattedDate = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day
      }`;
    setSearchDate(formattedDate);
    setSelectedDate(formattedDate);
    setDatePickerOpen(false);
  };

  const handleCardClick = (path, date) => {
    navigate(path, { state: { date } });
  };

  const handleRedirect = () => {
    navigate(-1);
  };

  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
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
                padding: "10px 12px",
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
                  <ArrowBackIosRoundedIcon sx={{ fontSize: "19px" }} />
                </IconButton>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#ffffff",
                    textAlign: "center",
                    fontSize: "19px",
                  }}
                >
                  Commission Details
                </Typography>
              </Grid>
            </Grid>

            <Grid
              container
              sx={{
                padding: "8px 12px",
                marginBottom: "2px",
                marginTop: "3px",
              }}
            >
              <TextField
                type="text"
                value={selectedDate}
                fullWidth
                onClick={handleDateDrawerToggle}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleDateDrawerToggle}>
                        <KeyboardArrowDownOutlinedIcon
                          sx={{ color: "#b9bcc8" }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    padding: "2px 0px 2px 8px",
                  },
                }}
                sx={{
                  background: "#323738",
                  borderRadius: 2,
                  color: "black",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "transparent", // Default border
                    },
                    "&:hover fieldset": {
                      borderColor: "transparent", // Hover border
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "transparent", // Focus border
                    },
                  },
                  input: {
                    color: "#B3BEC1",
                    padding: "8px",
                  },
                  "& .MuiOutlinedInput-root input::placeholder": {
                    fontSize: "5px",
                    color: "#B3BEC1", // Placeholder color
                  },
                }}
              />
            </Grid>

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
                  background: "#323738",
                  color: "black",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                  marginBottom: "0px",

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
              />
            </Drawer>

            {/* Gray Box Section with Cards */}
            <Box
              sx={{
                background: "#323738",
                padding:'12px',
                borderRadius: "8px",
                color: "#B3BEC1",
                width: "94%",
                margin: "auto", // Center horizontally
                maxWidth: "1200px", // Limit the maximum width
                boxSizing: "border-box", // Ensure padding does not affect the width
              }}
            >
              <Typography
                variant="body2"
                sx={{ marginBottom: "4px", textAlign: "start" }}
              >
                Settlement successful
              </Typography>
              <Typography
                variant="body2"
                sx={{ marginBottom: "4px", textAlign: "start" }}
              >
                {selectedDate}
              </Typography>
              <Typography
                variant="body2"
                sx={{ marginBottom: "4px", textAlign: "start" }}
              >
                The commission has been automatically credited to your balance
              </Typography>

              {/* Commission Details Cards */}
              <Box sx={{ marginTop: "16px" }}>
                {[
                  {
                    label: "Number of bettors",
                    value: `${summaryStats.totalBettors || 0} People`, // Display the count
                    path: "/promotion/commission-detail/lottery-commission",
                  },
                  {
                    label: "Investor Amount",
                    value: summaryStats.totalInvestedAmount || 0, // Display the investor amount
                    path: "/promotion/commission-detail/lottery-commission",
                  },
                  {
                    label: "Commission payout",
                    value: summaryStats.totalCommissionPayout || 0,
                    path: "/promotion/commission-detail/lottery-commission",
                    valueColor: "#f39c12",
                  },
                  {
                    label: "Date",
                    value: selectedDate,
                    path: "/promotion/commission-detail/lottery-commission",
                  },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      background: "#272727",
                      padding: "10px",
                      marginBottom: "8px",
                      borderRadius: "3px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onClick={() => handleCardClick(item.path, selectedDate)}
                  >
                    <Typography variant="body2">{item.label}</Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: item.valueColor || "#ffffff" }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Mobile>
    </div>
  );
};

export default CommissionDetail;
