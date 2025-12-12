import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import { domain } from "../../utils/Secret";
import Mobile from "../../components/layout/Mobile";
import { useAuth } from "../../context/AuthContext";
import ActivityRewardTabs from "../../components/activity/ActivityRewardTabs";

const ActivityReward = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [totalBetAmount, setTotalBetAmount] = useState(0);
  const { axiosInstance } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `${domain}/api/activity/activity-award/levels`,
          {
            withCredentials: true,
          }
        );

        // Find the daily category and calculate total betting amount
        const dailyCategory = response.data.find(
          (cat) => cat.timeScope === "DAILY"
        );
        if (dailyCategory && dailyCategory.tasks.length > 0) {
          setTotalBetAmount(dailyCategory.tasks[0].totalDailyBetting || 0);
        }

        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching activity awards:", error);
      }
    };

    fetchData();
  }, []);

  const handleRedirect = () => {
    navigate(-1);
  };

  const handleClaim = async (task) => {
    if (!task.canClaim || task.isClaimedToday) {
      alert(
        task.isClaimedToday
          ? "You have already claimed this reward today."
          : "You have not met the minimum betting amount for the reward."
      );
      return;
    }

    try {
      const response = await axiosInstance.post(
        `${domain}/api/activity/activity-award/claim`,
        { taskId: task.id },
        { withCredentials: true }
      );

      if (response.status === 201 || response.status === 200) {
        // Refresh data after successful claim
        setCategories((prevCategories) =>
          prevCategories.map((category) => ({
            ...category,
            tasks: category.tasks.map((t) =>
              t.id === task.id
                ? { ...t, isClaimedToday: true, canClaim: false }
                : t
            ),
          }))
        );
        alert("Reward claimed successfully!");
      }
    } catch (error) {
      console.error("Error claiming award:", error);
      alert("Error claiming award. Please try again later.");
    }
  };

  const renderTaskCard = (task) => {
    const progress = Math.min(
      (totalBetAmount / task.minBettingAmount) * 100,
      100
    );

    const getButtonText = () => {
      if (task.isClaimedToday) return "Claimed";
      if (task.canClaim) return "Tap to Claim";
      return "Complete Mission";
    };

    const getProgressText = () => {
      return `${totalBetAmount}/${task.minBettingAmount}`;
    };

    return (
      <Card
        key={task.id}
        sx={{
          backgroundColor: "#f2f2f1",
          color: "#80849c",
          borderRadius: 0,
          boxShadow: "none",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ padding: 2 }}>
          <Box
            sx={{
              padding: 2,
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              position: "relative",
              minHeight: "130px",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "35%",
                height: "30px",
                backgroundColor: task.isClaimedToday ? "#16b15e" : "#388e3c",
                borderTopLeftRadius: "10px",
                borderBottomRightRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 1,
                zIndex: 1,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                }}
              >
                {task.name}
              </Typography>
            </Box>

            <Box sx={{ position: "absolute", top: "10px", right: "10px" }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "#80849c", fontSize: "0.75rem" }}
              >
                {task.isClaimedToday
                  ? "Claimed"
                  : task.canClaim
                  ? "Completed"
                  : "Unfinished"}
              </Typography>
            </Box>

            <Divider
              sx={{ backgroundColor: "#323738", marginBottom: 1, mt: "13px" }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 1,
                paddingTop: "10px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <img
                  src="/assets/greenball.webp"
                  alt="Task Icon"
                  style={{ width: "28px", height: "28px", marginRight: "8px" }}
                />
                <Typography variant="body2" sx={{ color: "#80849c" }}>
                  {task.timeScope.toLowerCase()} betting bonus
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "#ff4d4f", fontWeight: "bold", marginLeft: "8px" }}
              >
                {getProgressText()}
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 1,
                backgroundColor: "#388e3c",
                marginBottom: 1,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: task.isClaimedToday ? "#4caf50" : "#1a90ff",
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 1,
              }}
            >
              <Typography variant="body2" sx={{ color: "#80849c" }}>
                Award amount
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <img
                  src="/assets/wallet.webp"
                  style={{
                    width: "20px",
                    height: "20px",
                    marginBottom: "3px",
                    paddingRight: "5px",
                  }}
                  alt="Wallet Icon"
                />
                <Typography
                  variant="h6"
                  sx={{ color: "#dd9138", fontSize: "1rem" }}
                >
                  ₹{task.bonusAmount}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ backgroundColor: "#323738", marginBottom: 1 }} />

            <Button
              variant="outlined"
              sx={{
                width: "100%",
                color: task.isClaimedToday ? "#4caf50" : "#4da6ff",
                borderColor: task.isClaimedToday ? "#4caf50" : "#4da6ff",
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: "bold",
                padding: "6px 12px",
              }}
              disabled={task.isClaimedToday || !task.canClaim}
              onClick={() => handleClaim(task)}
            >
              {getButtonText()}
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Mobile>
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          margin: 0,
          padding: 0,
          backgroundColor: "#232626",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{ position: "sticky",
            top: 0,
            zIndex: 1000, padding: "5px 16px", background: "#323738" }}
        >
          <Grid item>
            <IconButton sx={{ color: "#FDE4BC" }} onClick={handleRedirect}>
              <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
            </IconButton>
          </Grid>
          <Grid item display="flex" alignItems="center">
            <RestoreOutlinedIcon
              sx={{ cursor: "pointer", color: "#FDE4BC", marginRight: "8px" }}
            />
            <Box
              component="div"
              onClick={() =>
                navigate("/activity/activity-reward/collection-record")
              }
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <Typography sx={{ color: "#FDE4BC", fontSize: "0.8rem" }}>
                Collection record
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Banner Card */}
        <Card
          sx={{
            backgroundColor: "#fff",
            color: "#ACAFB3",
            borderRadius: 0,
            boxShadow: "none",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "relative",
              textAlign: "center",
              backgroundColor: "#ffffff",
              height: "160",
            }}
          >
            <CardMedia
              component="img"
              alt="Activity Award"
              height="auto"
              image="../assets/activity/activity_award.webp"
              sx={{ objectFit: "contain", width: "100%" }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "56%",
                left: "10px",
                transform: "translateY(-50%)",
                textAlign: "left",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                Activity Award
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#fff",
                  marginTop: "5px",
                  fontSize: "11px",
                  marginBottom: "20px",
                }}
              >
                Complete weekly/daily tasks to receive <br />
                rich rewards. <br />
                Weekly rewards cannot be accumulated <br />
                to the next week, and daily rewards <br />
                cannot be accumulated to the next day.
              </Typography>
            </Box>
          </Box>
          <CardContent
            sx={{
              padding: 1.2,
              bgcolor: "#323738",
              "&:last-child": {
                pb: 1.2,
              },
            }}
          >
            <Typography
              variant="body1"
              sx={{ color: "#B79C8B", textAlign: "center" }}
            >
              Check your daily missions and claim your rewards!
            </Typography>
          </CardContent>
        </Card>

        {/* Task Cards */}
        <ActivityRewardTabs />
      </Container>
      <br />
          <br />
          <br />
    </Mobile>
  );
};

export default ActivityReward;
