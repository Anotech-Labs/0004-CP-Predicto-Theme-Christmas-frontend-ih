import React, { useEffect, useState } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { domain } from "../../../utils/Secret";
import { useAuth } from "../../../context/AuthContext";

const CountdownTimer = ({
  selectedTimer,
  remainingTime,
  setRemainingTime,
  periodId,
  setPeriodId,
  gameType,
}) => {
  // const [periodId, setPeriodId] = useState(null)
  const { axiosInstance } = useAuth();

  const timerTypeMap = {
    "30sec": "THIRTY_TIMER",
    "1min": "ONE_MINUTE_TIMER",
    "3min": "THREE_MINUTE_TIMER",
    "5min": "FIVE_MINUTE_TIMER",
    "10min": "TEN_MINUTE_TIMER",
  };

// Modify the fetchTimerData function in CountdownTimer.jsx
const fetchTimerData = async () => {
  try {
    const timerType = selectedTimer
      ? timerTypeMap[selectedTimer]
      : gameType !== "wingo"
      ? "ONE_MINUTE_TIMER"
      : "THIRTY_TIMER";
    
    const response = await axiosInstance.get(
      `${domain}/api/master-game/period/active-period`,
      {
        params: { timerType },
      }
    );
    
    const data = response.data;
    setPeriodId(data.periodId);
    
    // Calculate remaining time in seconds
    const endTime = new Date(data.endTime).getTime();
    const currentTime = Date.now();
    const initialRemaining = Math.floor((endTime - currentTime) / 1000);
    
    // Ensure we have a non-negative value
    setRemainingTime(Math.max(initialRemaining, 0));
    
    //console.log("Fetched period:", data.periodId, "Remaining time:", initialRemaining);
  } catch (error) {
    console.error("Failed to fetch timer data:", error);
    
    // On error, retry after a short delay
    setTimeout(() => {
      fetchTimerData();
    }, 1000);
  }
};

// Also let's add a fallback timer cleanup logic for when a period finishes
useEffect(() => {
  // If timer reaches zero, fetch new data
  if (remainingTime <= 0) {
    const timeoutId = setTimeout(() => {
      fetchTimerData();
    }, 500); // Small delay to let backend process period completion
    
    return () => clearTimeout(timeoutId);
  }
}, [remainingTime]);

  useEffect(() => {
    fetchTimerData();
    setRemainingTime(0);
  }, [selectedTimer]);

  useEffect(() => {
    let intervalId = null;

    if (remainingTime > 0 || remainingTime === 0) {
      intervalId = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            // Check for 1 to ensure we fetch before hitting 0
            clearInterval(intervalId);
            fetchTimerData(); // Fetch new data when timer reaches zero
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [remainingTime]);

  const formatTimeDisplay = (seconds) => {
    if (seconds === null) return "0000";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <>
      {gameType === "carRace" ? (
        <>
           <Grid
            container
            spacing={0}
            mt={2}
            sx={{
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "95%",
              // boxShadow: "0px 4px 8px hsla(0, 0%, 0%, 0.1)",
              backgroundImage: 'url("/assets/race/orangeCard.webp")',
              backgroundSize: "contain",
              aspectRatio: 3 / 1,
              backgroundRepeat: "no-repeat",
              backgroundOrigin: "content-box",
              backgroundPosition: "center",
            }}
          >
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                pl: "4%",
              }}
            >
              <Box
                sx={{
                  border: "1px solid white",
                  borderRadius: "4px",
                  padding: "1px 8px",
                  display: "inline-block",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "white",
                    fontSize: "12px",
                    marginBottom: "4px",
                  }}
                >
                  Period
                </Typography>
              </Box>

              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontSize: "17.28px",
                  fontWeight: "600",
                }}
              >
                {periodId ? periodId : ""}
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-end",
                pr: "4%",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "white",
                  fontSize: "12px",
                  marginBottom: "4px",
                }}
              >
                Time remaining
              </Typography>

              <Grid item>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      marginTop: "12px",
                      background: "#232626",
                      color: "white",
                      textAlign: "center",
                      fontWeight: "bold",
                      lineHeight: "25px",
                      margin: "2px 2px",
                    }}
                  >
                    {formatTimeDisplay(remainingTime)[0]}
                  </Box>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      marginTop: "8px",
                      background: "#232626",
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                      lineHeight: "25px",
                      margin: "0 2px",
                    }}
                  >
                    {formatTimeDisplay(remainingTime)[1]}
                  </Box>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      background: "#232626",
                      color: "white",
                      marginTop: "8px",
                      fontWeight: "bold",
                      textAlign: "center",
                      lineHeight: "20px",
                      margin: "0 2px",
                    }}
                  >
                    :
                  </Box>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      background: "#232626",
                      color: "white",
                      marginTop: "10px",
                      fontWeight: "bold",
                      textAlign: "center",
                      lineHeight: "25px",
                      margin: "0 2px",
                    }}
                  >
                    {formatTimeDisplay(remainingTime)[2]}
                  </Box>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      background: "#232626",
                      color: "white",
                      fontWeight: "bold",
                      marginTop: "8px",
                      textAlign: "center",
                      lineHeight: "25px",
                      margin: "2px 2px",
                    }}
                  >
                    {formatTimeDisplay(remainingTime)[3]}
                  </Box>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </>
      ) : gameType === "wingo" ? (
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            pr: "4%",
          }}
        >
          <Grid item>
            <Typography
              variant="caption"
              sx={{ color: "black", fontWeight: "bold" }}
            >
              Time Remaining
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Box
                sx={{
                  display: "inline-block",
                  padding: "2px 3px",
                  marginTop: "12px",
                  backgroundColor: "#232626",
                  color: "#ffffff",
                  textAlign: "center",
                  fontWeight: "bold",
                  lineHeight: "25px",
                  margin: "2px 2px",
                }}
              >
                {formatTimeDisplay(remainingTime)[0]}
              </Box>
              <Box
                sx={{
                  display: "inline-block",
                  padding: "2px 3px",
                  marginTop: "8px",
                  backgroundColor: "#232626",
                  color: "#ffffff",
                  fontWeight: "bold",
                  textAlign: "center",
                  lineHeight: "25px",
                  margin: "0 2px",
                }}
              >
                {formatTimeDisplay(remainingTime)[1]}
              </Box>
              <Box
                sx={{
                  display: "inline-block",
                  padding: "2px 3px",
                  backgroundColor: "#232626",
                  color: "#ffffff",
                  marginTop: "8px",
                  fontWeight: "bold",
                  textAlign: "center",
                  lineHeight: "25px",
                  margin: "0 2px",
                }}
              >
                :
              </Box>
              <Box
                sx={{
                  display: "inline-block",
                  padding: "2px 3px",
                  backgroundColor: "#232626",
                  color: "#ffffff",
                  marginTop: "10px",
                  fontWeight: "bold",
                  textAlign: "center",
                  lineHeight: "25px",
                  margin: "0 2px",
                }}
              >
                {formatTimeDisplay(remainingTime)[2]}
              </Box>
              <Box
                sx={{
                  display: "inline-block",
                  padding: "2px 3px",
                  backgroundColor: "#232626",
                  color: "#ffffff",
                  fontWeight: "bold",
                  marginTop: "8px",
                  textAlign: "center",
                  lineHeight: "25px",
                  margin: "2px 2px",
                }}
              >
                {formatTimeDisplay(remainingTime)[3]}
              </Box>
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="h6"
              sx={{ color: "black", fontSize: "15px", fontWeight: "bold",mt:1 }}
            >
              {periodId || ""}
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <>
          <Grid
            container
            spacing={1}
            alignItems="center"
            sx={{ width: "100%", m: 0, justifyContent: "space-between" }}
          >
            <Box item>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: gameType === "wingo" ? "black" : "#ffffff",
                  textAlign: "left",
                  pl: gameType === "wingo" ? "5%" : "0px",
                }}
              >
                {periodId ? periodId : ""}
              </Typography>
            </Box>
            <Box item>
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Box
                  sx={{
                    // display: "inline-block",
                    width: "20px",
                    borderRadius:"2px",
                    height: "31px",
                    marginTop: "12px",
                    backgroundColor:
                      gameType === "wingo" ? "#232626" : "#3a4142",
                    color: gameType === "wingo" ? "white" : "#fed358",
                    textAlign: "center",
                    fontWeight: "bold",
                    lineHeight: "25px",
                    margin: "2px 2px",
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center"
                  }}
                >
                  {formatTimeDisplay(remainingTime)[0]}
                </Box>
                <Box
                  sx={{
                    // display: "inline-block",
                    width: "20px",
                    borderRadius:"2px",
                    height: "31px",
                    marginTop: "8px",
                    backgroundColor:
                      gameType === "wingo" ? "#232626" : "#3a4142",
                    color: gameType === "wingo" ? "white" : "#fed358",
                    fontWeight: "bold",
                    textAlign: "center",
                    lineHeight: "25px",
                    margin: "0 2px",
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center"
                  }}
                >
                  {formatTimeDisplay(remainingTime)[1]}
                </Box>
                <Box
                  sx={{
                    display: "inline-block",
                    width: "16px",
                    height: "22px",
                    backgroundColor:
                      gameType === "wingo" ? "#232626" : "transparent",
                    color: gameType === "wingo" ? "white" : "#fed358",
                    marginTop: "8px",
                    fontWeight: "bold",
                    textAlign: "center",
                    lineHeight: "20px",
                    margin: "0 2px",
                  }}
                >
                  :
                </Box>
                <Box
                  sx={{
                    // display: "inline-block",
                    width: "20px",
                    borderRadius:"2px",
                    height: "31px",
                    backgroundColor:
                      gameType === "wingo" ? "#232626" : "#3a4142",
                    color: gameType === "wingo" ? "white" : "#fed358",
                    marginTop: "10px",
                    fontWeight: "bold",
                    textAlign: "center",
                    lineHeight: "25px",
                    margin: "0 2px",
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center"
                  }}
                >
                  {formatTimeDisplay(remainingTime)[2]}
                </Box>
                <Box
                  sx={{
                    // display: "inline-block",
                    width: "20px",
                    borderRadius:"2px",
                    height: "31px",
                    backgroundColor:
                      gameType === "wingo" ? "#232626" : "#3a4142",
                    color: gameType === "wingo" ? "white" : "#fed358",
                    fontWeight: "bold",
                    marginTop: "8px",
                    textAlign: "center",
                    lineHeight: "25px",
                    margin: "2px 2px",
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center"
                  }}
                >
                  {formatTimeDisplay(remainingTime)[3]}
                </Box>
              </Typography>
            </Box>
          </Grid>
        </>
      )}
    </>
  );
};

export default CountdownTimer;