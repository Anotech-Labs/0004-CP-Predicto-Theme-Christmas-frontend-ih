import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Divider,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { domain } from "../../utils/Secret";

const ActivityRewardTabs = () => {
  const [selectedTab, setSelectedTab] = useState("DAILY");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [totalBetAmount, setTotalBetAmount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const { axiosInstance } = useAuth();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
    duration: 3000, // Default duration 5 seconds
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const showSnackbar = (message, severity = "info", duration = 5000) => {
    setSnackbar({
      open: true,
      message,
      severity,
      duration,
    });
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `${domain}/api/activity/activity-award/levels`,
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      setCategories(data);
      filterCategories(data, selectedTab);

      const dailyCategory = data.find((cat) => cat.timeScope === "DAILY");
      if (dailyCategory?.tasks?.length > 0) {
        setTotalBetAmount(dailyCategory.tasks[0].totalDailyBetting || 0);
      }
    } catch (error) {
      console.error("Error fetching activity awards:", error);
      showSnackbar(
        "Failed to fetch activity awards. Please try again later.",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, [axiosInstance]);

  const filterCategories = (allCategories, timeScope) => {
    // Filter categories based on the selected timeScope and check if it contains tasks for that timeScope
    const filtered = allCategories.filter((category) =>
      category.tasks.some((task) => task.timeScope === timeScope)
    );
    setFilteredCategories(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    filterCategories(categories, newValue);
  };

  const handleClaim = async (task) => {
    if (!task.canClaim || task.isClaimedToday) {
      alert(
        task.isClaimedToday
          ? 'You have already claimed this reward today.'
          : 'You have not met the minimum betting amount for the reward.',
        'warning'
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
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === task.id ? { ...t, isClaimedToday: true, canClaim: false } : t
          )
        );
        showSnackbar('Reward claimed successfully!', 'success');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        showSnackbar(error.response.data.message || 'Failed to claim reward.', 'error');
      } else {
        console.error('Error claiming award:', error);
        showSnackbar('Error claiming award. Please try again later.', 'error');
      }
    } finally {
      fetchData();
    }
  };

  const renderTaskCard = (task) => {
    const progress = Math.min(
      (totalBetAmount / Number(task.minBettingAmount)) * 100,
      100
    );

    const getButtonText = () => {
      if (task.isClaimedToday) return "Claimed";
      if (task.canClaim) return "Tap to Claim";
      return "to Complete";
    };

    const getProgressText = () => `${totalBetAmount}/${task.minBettingAmount}`;

    return (
      <Card
        key={task.id}
        sx={{
          backgroundColor: "#232626",
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
              backgroundColor: "#323738",
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
                background: task.isClaimedToday
                  ? "linear-gradient(90deg,#24ee89,#9fe871)"
                  : "linear-gradient(90deg,#24ee89,#9fe871)",
                borderTopLeftRadius: "10px",
                borderBottomRightRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 1,
                zIndex: 1,
              }}
            >
              {filteredCategories.map((category) => (
                <Typography
                  variant="body1"
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                  }}
                >
                  {category.name}
                </Typography>
              ))}
            </Box>

            <Box sx={{ position: "absolute", top: "10px", right: "10px" }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "#B79C8B", fontSize: "0.75rem" }}
              >
                {task.isClaimedToday
                  ? "Claimed"
                  : task.canClaim
                  ? "Completed"
                  : "Unfinished"}
              </Typography>
            </Box>

            <Divider
              sx={{ backgroundColor: "#454037", marginBottom: 1, mt: "13px" }}
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
                  src="/assets/icons/loteria-0ccd41c5.webp"
                  alt="Task Icon"
                  style={{ width: "25px", height: "25px", marginRight: "8px" }}
                />
                <Typography variant="body2" sx={{ color: "#B79C8B" }}>
                  {task.name.toLowerCase()} betting bonus
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
                backgroundColor: "#fadac5",
                marginBottom: 1,
                "& .MuiLinearProgress-bar": {
                  background: task.isClaimedToday
                    ? "linear-gradient(90deg,#24ee89,#9fe871)"
                    : "linear-gradient(90deg,#24ee89,#9fe871)",
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
              <Typography variant="body2" sx={{ color: "#B79C8B" }}>
                Award amount
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <img
                  src="/assets/wallet/wallet.webp"
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

            <Divider sx={{ backgroundColor: "#454037", marginBottom: 1 }} />

            <Button
              variant="outlined"
              sx={{
                width: "100%",
                color: task.isClaimedToday ? "#FED358" : "#FED358",
                borderColor: task.isClaimedToday ? "#FED358" : "#FED358",
                "&.Mui-disabled": {
                  border: "1px solid #FED358",
                  color: "#FED358",
                },
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
    <Container disableGutters maxWidth={false} sx={{ margin: 0, padding: 0 }}>
    <Box
      sx={{
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        bgcolor: "#323738",
        overflow: "hidden",
      }}
    >
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          "& .MuiTab-root": {
            color: "#949493",
            fontWeight: "500",
            fontSize: "12px",
            textTransform: "none",
            padding: "12px 16px",
            borderBottom: "2px solid transparent",
            fontFamily: "inherit",
            // '&:hover': {
            //   backgroundColor: '#e8f5e9',
            // },
            "&.Mui-selected": {
              color: "#FED358",
              fontWeight: "600",
              borderBottom: "2px solid #FED358",
              fontSize: "13px",
            },
          },
          "& .MuiTabs-indicator": {
            display: "none",
          },
        }}
      >
        {["DAILY", "WEEKLY", "MONTHLY"]
          .filter((timeScope) =>
            categories.some((category) =>
              category.tasks.some((task) => task.timeScope === timeScope)
            )
          )
          .map((timeScope) => (
            <Tab
              key={timeScope}
              label={timeScope.charAt(0).toUpperCase() + timeScope.slice(1).toLowerCase()}
              value={timeScope}
            />
          ))}
      </Tabs>
  
      <Box sx={{}}>
        {filteredCategories
          .filter((category) => category.timeScope === selectedTab)
          .map((category) =>
            category.tasks.map((task) => renderTaskCard(task))
          )}
      </Box>
    </Box>
  </Container>
  );
};

export default ActivityRewardTabs;
