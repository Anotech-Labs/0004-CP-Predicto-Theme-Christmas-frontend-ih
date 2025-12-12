import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import Mobile from "../../components/layout/Mobile";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import { domain } from "../../utils/Secret";
import { useAuth } from "../../context/AuthContext";

function CollectionRecord() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("daily");
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { axiosInstance } = useAuth();

  useEffect(() => {
    const fetchRewards = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${domain}/api/activity/activity-award/my-activities`
        );

        if (response.data && Array.isArray(response.data)) {
          const filteredRewards = response.data.filter(
            (item) =>
              (activeButton === "weekly" && item.timeScope === "WEEKLY") ||
              (activeButton === "daily" && item.timeScope === "DAILY") ||
              (activeButton === "monthly" && item.timeScope === "MONTHLY")
          );

          const formattedRewards = filteredRewards.map((item) => ({
            id: item.id,
            activityAward: item.bonusAmount,
            date: item.claimedAt,
            taskName: item.task.name,
            status: item.status,
            timeScope: item.timeScope,
          }));

          setRewards(formattedRewards);
        } else {
          setError("Invalid response format.");
        }
      } catch (error) {
        setError("Error fetching rewards.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [activeButton, axiosInstance]);

  return (
    <Mobile>
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
            sx={{ color: "#FDE4BC", position: "absolute", left: 0, p: "12px" }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ color: "#FDE4BC", textAlign: "center", fontSize: "19px" }}
          >
            Receive History
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ background: "#232626", height: "100vh", padding: "11px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0px",
            gap: "4px", // Add gap between buttons
          }}
        >
          <Box
            onClick={() => setActiveButton("daily")}
            sx={{
              background:
                activeButton === "daily"
                  ? "linear-gradient(90deg,#24ee89,#9fe871)"
                  : "#382e35",
              padding: "16px 0",
              borderRadius: "8px",
              width: "100%", // Equal width for all buttons
              color: activeButton === "daily" ? "#232626" : "#B79C8B",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            Daily
          </Box>
          <Box
            onClick={() => setActiveButton("weekly")}
            sx={{
              background:
                activeButton === "weekly"
                  ? "linear-gradient(90deg,#24ee89,#9fe871)"
                  : "#382e35",
              padding: "16px 0",
              borderRadius: "8px",
              width: "100%", // Equal width for all buttons
              color: activeButton === "weekly" ? "#232626" : "#B79C8B",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            Weekly
          </Box>
          <Box
            onClick={() => setActiveButton("monthly")}
            sx={{
              background:
                activeButton === "monthly"
                  ? "linear-gradient(90deg,#24ee89,#9fe871)"
                  : "#382e35",
              padding: "16px 0",
              borderRadius: "8px",
              width: "100%", // Equal width for all buttons
              color: activeButton === "monthly" ? "#232626" : "#B79C8B",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            Monthly
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
            // px: 2,
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "70vh",
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography
              sx={{
                color: "red",
                textAlign: "center",
                fontSize: "18px",
                mt: 4,
              }}
            >
              {error}
            </Typography>
          ) : rewards.length > 0 ? (
            <Grid
              container
              spacing={1.3} // Adjusted spacing between cards
              sx={{
                maxWidth: "600px",
                p: 0,
              }}
            >
              {rewards.map((reward, index) => (
                <Grid item xs={12} key={reward.id || index}>
                  <Card
                    sx={{
                      background: "#323738",
                      color: "#F5F3F0",
                      borderRadius: "8px", // Added border radius for cards
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <MilitaryTechIcon
                          style={{
                            color: "#FED358",
                            marginRight: "8px", // Adjusted icon margin
                          }}
                          fontSize="large"
                        />
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          Activity Award: ₹{reward.activityAward}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "#B79C8B",
                          mt: 1, // Adjusted margin top
                        }}
                      >
                        <CalendarTodayIcon
                          style={{ marginRight: "8px" }} // Adjusted icon margin
                          size={10}
                        />
                        <Typography variant="caption" >
                          {new Date(reward.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            ml: 2,
                            color: "#FED358",
                            fontWeight: "bold",
                          }}
                        >
                          {reward.timeScope}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "70vh",
                textAlign: "center",
                color: "grey",
              }}
            >
              <img
                src="/assets/No data-1.webp"
                alt="No data available"
                style={{
                  width: "40%",
                  marginBottom: "16px",
                }}
              />
              <Typography variant="h6">No data available</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Mobile>
  );
}

export default CollectionRecord;