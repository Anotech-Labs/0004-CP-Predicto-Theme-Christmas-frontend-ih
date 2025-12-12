import React, { useEffect, useState } from "react";
import { Typography, Grid, IconButton, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Mobile from "../../components/layout/Mobile";
import { domain } from "../../utils/Secret";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const LotteryCommission = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDate = location.state?.date;
  const {axiosInstance} = useAuth();
  const [levels, setLevels] = useState([]);

const [commissionData, setCommissionData] = useState([]);
  const fetchCommissionData2= async (selectedDate) => {
    try {
      // Convert selectedDate to a Date object and add 1 day
    const startDate = selectedDate;
    const endDate = new Date(new Date(selectedDate).getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]; // Converts to 'YYYY-MM-DD' format
      const response = await axiosInstance.get(`${domain}/api/promotion/commission-details-data`, {
        params: { startDate, endDate },
      withCredentials: true,
      });
      //console.log("response",response)
      
      setCommissionData(response?.data?.data)
      setLevels(response?.data?.data?.levelCommissionDetails); 
    } catch (error) {
      console.error("Error fetching commission data:", error);
    }
  }
useEffect(() => {
  fetchCommissionData2(selectedDate);
},[selectedDate])

  const handleRedirect = () => {
    navigate(-1);
  };
  return (
    <Mobile>
      <Box
        display="flex"
        flexDirection="column"
        height="calc(var(--vh, 1vh) * 100)"
        position="relative"
        backgroundColor="#232626"
      >
        <Box flexGrow={1}>
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
                  color: "#FDE4BC",
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
                sx={{ color: "#FDE4BC", textAlign: "center", fontSize: "19px" }}
              >
                Details
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ padding: "12px", color: "white" }}>
            <DetailsBox
              selectedDate={selectedDate}
              commissionData={commissionData}
            />

            <CommissionDetailsBox
              commissionData={commissionData}
              levels={levels}
            />
          </Box>
        </Box>
      </Box>
    </Mobile>
  );
};

const DetailsBox = ({ selectedDate, commissionData }) => (
  <Box
    sx={{
      // border: "1px solid #E0E0E0",
      borderRadius: "8px",
      padding: "12px",
      backgroundColor: "#323738",
      color: "white",
      maxWidth: "400px",
      margin: "8px auto",
      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    }}
  >
    <Typography
      variant="body2"
      sx={{
        color: "#FDE4BC",
        marginBottom: "8px",
        textAlign: "start",
      }}
    >
      {selectedDate || "No date selected"}
    </Typography>
    <Box
      sx={{
        borderBottom: "1px solid #3B3833",
        marginBottom: "16px",
      }}
    ></Box>
    <Grid container spacing={1}>
      <Grid item xs={12} container justifyContent="space-between" color="#FDE4BC">
        <Typography variant="body2" >Total number of bettors</Typography>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          {commissionData.totalBettors ?? 0} People
        </Typography>
      </Grid>

      <Grid item xs={12} container justifyContent="space-between" color="#FDE4BC">
        <Typography variant="body2">Total Invested amount</Typography>
        <Typography
          variant="body2"
          sx={{ color: "#FF5722", fontWeight: "bold" }}
        >
          ₹{commissionData.totalInvestedAmount ?? 0}
        </Typography>
      </Grid>

      <Grid item xs={12} container justifyContent="space-between" color="#FDE4BC">
        <Typography variant="body2">Total commission settlement</Typography>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          ₹{commissionData.totalCommissionPayout ?? 0}
        </Typography>
      </Grid>
    </Grid>

    <Box
      sx={{
        marginTop: "16px",
        textAlign: "center",
        padding: "8px 16px",
        borderRadius: "24px",
        border: "1px solid #FDE4BC",
        color: "#FDE4BC",
        fontWeight: "bold",
        cursor: "pointer",
        // "&:hover": {
        //   backgroundColor: "#bc641d",
        //   color: "white",
        // },
      }}
    >
      Rebate level rules
    </Box>
  </Box>
);

const CommissionDetailsBox = ({ commissionData, levels }) => {
  return (
    <Box
      sx={{
        // border: "1px solid #E0E0E0",
        borderRadius: "8px",
        // padding: "16px",
        backgroundColor: "#323738",
        color: "#FDE4BC",
        maxWidth: "400px",
        margin: "16px auto",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box sx={{ padding: "0.75rem", marginTop: "1rem" }}>
        <Typography
          variant="h6"
          sx={{
            marginBottom: "16px",
            fontSize: "14px",
            textAlign: "start",
          }}
        >
          Lottery Commission
        </Typography>

        <Grid container spacing={1}>
          <CommissionDetailRow
            label="Number of bettors"
            value={`${commissionData.totalBettors ?? 0} People`}
          />
          <CommissionDetailRow
            label="Rebate level"
            value="LV0"
            color="#bc641d"
          />
          <CommissionDetailRow
            label="Bet amount"
            value={`₹${commissionData.totalBettingAmount ?? 0}`}
            color="#FF5722"
          />
          <CommissionDetailRow
            label="Commission payout"
            value={`₹${commissionData.totalCommissionPayout ?? 0}`}
            color="#FF5722"
          />
        </Grid>
      </Box>

      <Typography
        variant="h6"
        sx={{
          background: " linear-gradient(90deg,#24ee89,#9fe871)",
          padding: "2px 16px",
          // borderRadius: "4px",
          color: "white",
          textAlign: "center",
          marginBottom: "16px",
          marginTop: "18px",
        }}
      >
        Lottery Commission
      </Typography>
      <Grid container sx={{ marginBottom: 1 }}>
        <Grid item xs={3}>
          <Typography
            sx={{ fontWeight: "bold", color: " #bc641d", fontSize: "13px" }}
          >
            Lower level
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={{ fontWeight: "bold", fontSize: "13px" }}>
            Bet amount
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={{ fontWeight: "bold", fontSize: "13px" }}>
            Rebate ratio
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={{ fontWeight: "bold", fontSize: "13px" }}>
            Total
          </Typography>
        </Grid>
      </Grid>

      {levels.map((level, index) => {
        const levelKey = `l${level.level}`;
        return (
          <Grid
            container
            key={index}
            sx={{
              padding: "8px 0",
              backgroundColor: index % 2 === 0 ? "#1d1c1b" : "inherit",
            }}
          >
            <Grid item xs={3}>
              <Box
                sx={{
                  position: "relative",
                  display: "inline-block",
                  width: "100%",
                }}
              >
                <img
                  src={`/assets/promotion/lowerLevel.webp`}
                  alt={level.level}
                  style={{ width: "60%", borderRadius: "8px" }} // Optional: Add border-radius for rounded corners
                />
                <Typography
                  sx={{
                    position: "absolute",
                    top: "60%",
                    left: "65%",
                    transform: "translate(-50%, -50%)",
                    color: "#fff670",
                    // fontWeight: "bold",
                    fontSize: "0.6rem",
                    // textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Optional: Add shadow for better readability
                  }}
                >
                  LV{level.level ?? 0}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={3}>
              <Typography>
                ₹
                {level.bettingAmount ?? 0}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography> {level.commissionPercentage ?? 0}%</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">
                ₹
                {level.commissionAmount ?? 0}
              </Typography>
            </Grid>
          </Grid>
        );
      })}
    </Box>
  );
};

const CommissionDetailRow = ({ label, value, color = "inherit" }) => (
  <Grid item xs={12} container justifyContent="space-between">
    <Typography variant="body2">{label}</Typography>
    <Typography variant="body2" sx={{ fontWeight: "bold", color }}>
      {value}
    </Typography>
  </Grid>
);

export default LotteryCommission; 