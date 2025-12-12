import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Mobile from "../../components/layout/Mobile";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { domain } from "../../utils/Secret";
import { useAuth } from "../../context/AuthContext";
const GameStatsItem = ({ stats }) => {
  //   if (!stats) return null; // No data to show if stats is undefined

  return (
    <Box
      className="gamestats-container-items"
      sx={{
        padding: "16px",
        borderRadius: "8px",
        boxShadow: 1,
        backgroundColor: "#323738",
        mt: 2,
      }}
    >
      <Box className="gamestats-container-item">
        <Grid container alignItems="center">
          <Grid item>
            <img
              alt="Lottery"
              src="/assets/icons/loteria-0ccd41c5.webp"
              style={{ marginRight: "8px" }}
              width={24}
            />
          </Grid>
          <Grid item>
            <Typography
              variant="h6"
              component="span"
              sx={{ fontWeight: "bold", color: "#ffffff" }}
            >
              Lottery
            </Typography>
          </Grid>
        </Grid>
        <Box
          className="gamestats-container-item-content"
          sx={{ marginTop: "16px" , display: "flex", flexDirection: "row" ,gap:1,ml:"5px"}}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img
              src="/assets/activity/red_circles.webp"
              alt="Step indicator"
              style={{ width: "15px", height: "auto" }}
            />
          </Box>
          <Box
            className="gamestats-container-item-content-list"
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "10px", // Reduced spacing between each item
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="#B3BEC1">
                {" "}
                {/* Smaller text */}
                Total bet
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: "", color: "#B3BEC1" }}
              >
                {" "}
                {/* Smaller text */}₹{Number(stats.totalAmount).toFixed(2)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="#B3BEC1">
                {" "}
                {/* Smaller text */}
                Number of bets
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: "", color: "#B3BEC1" }}
              >
                {" "}
                {/* Smaller text */}
                {stats.totalBets}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="#B3BEC1">
                {" "}
                {/* Smaller text */}
                Winning amount
              </Typography>
              <Typography variant="body2" sx={{ color: "#B3BEC1" }}>
                {" "}
                {/* Smaller text */}₹{Number(stats.totalWinAmount).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

function GameStatistic({ children }) {
  const [activeButton, setActiveButton] = useState("Today");
  const [stats, setStats] = useState({
    totalBets: 0,
    totalAmount: 0,
    winningAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { axiosInstance } = useAuth();
  const navigate = useNavigate();

  const handleButtonClick = (buttonName) => {
    setLoading(true);
    setActiveButton(buttonName);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${domain}/api/account/v1/statistics/all-betting-stats`,
        { withCredentials: true }
      );

      // Mapping for activeButton values to API response keys
      const keyMap = {
        Today: "today",
        Yesterday: "yesterday",
        "This week": "thisWeek",
        "This month": "thisMonth",
      };

      // Get the correct key from the mapping
      const selectedKey = keyMap[activeButton] || "today";

      if (response.data?.data?.[selectedKey]) {
        setStats(response.data.data[selectedKey]);
      } else {
        setStats({
          totalBets: 0,
          totalAmount: 0,
          totalWinAmount: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setStats({
        totalBets: 0,
        totalAmount: 0,
        totalWinAmount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeButton]);

  // if (loading) {
  //   return (
  //     <Box
  //       display="flex"
  //       justifyContent="center"
  //       alignItems="center"
  //       height="100vh"
  //     >
  //       <CircularProgress />
  //     </Box>
  //   )
  // }

  // if (error) {
  //   return (
  //     <Box
  //       display="flex"
  //       justifyContent="center"
  //       alignItems="center"
  //       height="100vh"
  //     >
  //       <Typography color="error">{error}</Typography>
  //     </Box>
  //   );
  // }

  const noDataAvailable =
    !stats.totalBets && !Number(stats.totalAmount) && !stats.winningAmount;

  return (
    <>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
          sx={{ backgroundColor: "#232626" }}
        >
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
                onClick={handleBackClick}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
              </IconButton>
              <Typography
                variant="h6"
                sx={{ color: "#ffffff", textAlign: "center", fontSize: "19px" }}
              >
                Game Statistics
              </Typography>
            </Grid>
          </Grid>

          {/* Button Group */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 2,
              backgroundColor: "#232626",
            }}
          >
            {["Today", "Yesterday", "This week", "This month"].map((label) => (
              <Button
                key={label}
                onClick={() => handleButtonClick(label)}
                sx={{
                  flex: 1,
                  height: "30px",
                  background:
                    activeButton === label
                      ? "linear-gradient(90deg,#24ee89,#9fe871)"
                      : "#323738",
                  color: activeButton === label ? "black" : "#B3BEC1",

                  borderRadius: "20px",
                  marginRight: "10px",
                  fontSize: "12px",
                  padding: "5px 10px",
                  minWidth: "auto",
                  lineHeight: "1",
                  textTransform: "none",
                  fontWeight: "bold",
                  // border:
                  //   activeButton === label
                  //     ? "1px solid #ccc"
                  //     : "1px solid transparent",
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          {/* Box below the buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px",
              p: 2,
              mt: 2,
              mx: 2,
              // border: "1px solid #e0e0e0", // Light gray border
              bgcolor: "#323738",
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#24ee89" }} />
            ) : (
              <>
                <Typography
                  variant="h5"
                  sx={{ color: "#24ee89", fontWeight: "bold" }}
                >
                  ₹{Number(stats.totalAmount).toFixed(2)}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "#B3BEC1" }}>
                  Total bet
                </Typography>
              </>
            )}
          </Box>

          {/* Box below the buttons */}
          {!loading &&
            (noDataAvailable ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  // bgcolor: "white",
                  borderRadius: "10px",
                  p: 2,
                  mt: 2,
                  mx: 2,
                  // border: "1px solid #e0e0e0", // Light gray border
                }}
              >
                <Box
                  component="img"
                  src="/assets/No data-1.webp" // Update with the correct image path
                  alt="No data"
                  sx={{ width: "100px", mt: 2, opacity: 0.5 }}
                />
                <Typography variant="body2" sx={{ color: "#B3BEC1", mt: 1 }}>
                  No data available
                </Typography>
              </Box>
            ) : (
              <Box sx={{ paddingX: "1.1rem" }}>
                {/* Game Stats Item Component */}
                <GameStatsItem stats={stats} />
              </Box>
            ))}
        </Box>
      </Mobile>
    </>
  );
}

export default GameStatistic;
