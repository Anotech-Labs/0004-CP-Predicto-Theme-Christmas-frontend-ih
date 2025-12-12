import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Pagination,
  styled,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import speedPinball1 from "../../../assets/race-ball/speed_pinball1.webp";
import speedPinball2 from "../../../assets/race-ball/speed_pinball2.webp";
import speedPinball3 from "../../../assets/race-ball/speed_pinball3.webp";
import speedPinball4 from "../../../assets/race-ball/speed_pinball4.webp";
import speedPinball5 from "../../../assets/race-ball/speed_pinball5.webp";
import speedPinball6 from "../../../assets/race-ball/speed_pinball6.webp";
import speedPinball7 from "../../../assets/race-ball/speed_pinball7.webp";
import speedPinball8 from "../../../assets/race-ball/speed_pinball8.webp";
import speedPinball9 from "../../../assets/race-ball/speed_pinball9.webp";
import speedPinball10 from "../../../assets/race-ball/speed_pinball10.webp";

const ballImages = {
  1: speedPinball1,
  2: speedPinball2,
  3: speedPinball3,
  4: speedPinball4,
  5: speedPinball5,
  6: speedPinball6,
  7: speedPinball7,
  8: speedPinball8,
  9: speedPinball9,
  10: speedPinball10,
};

const NumberCircle = styled(Box)(() => ({
  width: 20,
  height: 20,
  borderRadius: "50%",
  border: "2px solid #323738",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 1px",
  backgroundColor: "#323738",
}));

const ResultCircle = styled(Box)(({ bgcolor }) => ({
  width: 15,
  height: 15,
  borderRadius: "10%",
  backgroundColor: "#323738",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 2px",
  color: "#fff",
  fontSize: "0.7rem",
  fontWeight: "bold",
}));

const HeaderCell = styled(Box)({
  padding: "12px",
  textAlign: "center",
  color: "white",
  fontWeight: "bold",
});

const RaceHistory = ({ data, page, setPage, totalPage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!data || !data.history || !Array.isArray(data.history)) {
    return <Typography sx={{ p: 2, textAlign: "center" }}>No race history available</Typography>;
  }
  const getCarImage = (number) => ballImages[number] || "";

  const getBSColor = (value) =>
    value === "Big"
      ? "linear-gradient(90deg, #FF9000 0%, #FFD000 100%)"
      : "linear-gradient(90deg, #00BDFF 0%, #5BCDFF 100%)";

  const getOEColor = (value) =>
    value === "Odd"
      ? "linear-gradient(90deg, #FD0261 0%, #FF8A96 100%)"
      : "linear-gradient(90deg, #00BE50 0%, #9BDF00 100%)";

  return (
    <Card sx={{ maxWidth: "100%", bgcolor: "#323738" }}>
      <CardContent sx={{ p: 0 }}>
        <Grid container sx={{ bgcolor: "#cf7c10" }}>
          <Grid item xs={4}><HeaderCell>Period</HeaderCell></Grid>
          <Grid item xs={3}><HeaderCell>Result</HeaderCell></Grid>
          <Grid item xs={2.5}><HeaderCell>B/S</HeaderCell></Grid>
          <Grid item xs={2.5}><HeaderCell>O/E</HeaderCell></Grid>
        </Grid>

        {data.history?.map((item) => (
          <Grid
            container
            key={item.id}
            sx={{
              py: 1,
              borderBottom: "1px solid #3D363A",
              "&:last-child": { borderBottom: 0 },
              alignItems: "center",
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
            }}
          >
            <Grid item xs={4} sx={{ textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "#ffffff", fontSize: "12.288px" }}>{item.periodId}</Typography>
            </Grid>

            <Grid item xs={3} sx={{ display: "flex", justifyContent: "center" }}>
              {[item.firstPlace, item.secondPlace, item.thirdPlace].map((pos, index) => (
                <NumberCircle key={index}>
                  <img
                    src={getCarImage(pos?.carNumber)}
                    alt={`Car ${pos?.carNumber || "Unknown"}`}
                    style={{ width: "100%", height: "auto", borderRadius: "50%" }}
                  />
                </NumberCircle>
              ))}
            </Grid>

            <Grid item xs={2.5} sx={{ display: "flex", justifyContent: "center" }}>
              {[item.firstPlace, item.secondPlace, item.thirdPlace].map((pos, index) => (
                <ResultCircle key={index} sx={{ background: getBSColor(pos?.size || "") }}>
                  {pos?.size?.[0] || "-"}
                </ResultCircle>
              ))}
            </Grid>

            <Grid item xs={2.5} sx={{ display: "flex", justifyContent: "center" }}>
              {[item.firstPlace, item.secondPlace, item.thirdPlace].map((pos, index) => (
                <ResultCircle key={index} sx={{ background: getOEColor(pos?.parity || "") }}>
                  {pos?.parity?.[0] || "-"}
                </ResultCircle>
              ))}
            </Grid>
          </Grid>
        ))}

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            backgroundColor: "#323738",
            padding: { xs: "10px 0", sm: "20px 0" },
            borderRadius: "0 0 10px 10px",
            gap: "30px"
          }}
        >
          <Button
            variant="contained"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            sx={{
              marginRight: "10px",
              backgroundColor: "#24ee89",
              "&.Mui-disabled": {
                backgroundColor: "#5a5145", // Disabled background color
                color: "#B3BEC1", // Optional: Change text color for better visibility
              },
              "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 7px" },
            }}
          >
            <ArrowBackIosRoundedIcon style={{ color: page === 1 ? "#B3BEC1" : "#323738" }} />
          </Button>
          <Grid sx={{ display: "flex", alignItems: "center", color: "#B3BEC1",fontSize:"12.8px" }}>
            {page}/{totalPage}
          </Grid>
          <Button
            variant="contained"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPage}
            sx={{
              marginLeft: "10px",
              backgroundColor: "#24ee89",
              "&.Mui-disabled": {
                backgroundColor: "#5a5145", // Disabled background color
                color: "#B3BEC1", // Optional: Change text color for better visibility
              },
              "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 7px" },
            }}
          >
            <ArrowForwardIosRoundedIcon style={{ color: page === totalPage ? "#B3BEC1" : "#323738" }} />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RaceHistory;