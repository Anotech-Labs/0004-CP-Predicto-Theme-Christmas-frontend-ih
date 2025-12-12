import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Mobile from "../../components/layout/Mobile";
import { useNavigate } from "react-router-dom";

const GiftPackage = () => {
  const navigate = useNavigate();

  return (
    <Mobile>
      <Box
        sx={{
          bgcolor: "#232626",
          minHeight: "100vh",
          p: 0,
          maxWidth: "600px",
          mx: "auto",
        }}
      >
        {/* Header with Back Button */}
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
          <Grid item xs={12} container alignItems="center" justifyContent="center">
            <IconButton
              sx={{
                color: "#FDE4BC",
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
              sx={{ color: "#FDE4BC", textAlign: "center", fontSize: "19px" }}
            >
              Activity Details
            </Typography>
          </Grid>
        </Grid>

        <Paper
          sx={{
            mb: 2,
            backgroundImage: `url("../../assets/activity/giftpackage.webp"), linear-gradient(45deg, #FFA500, #FF6347)`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            color: "white",
            position: "relative",
            overflow: "hidden",
            textAlign: "left",
          }}
        >
          <Grid sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              New member gift package
            </Typography>
            <Typography paragraph sx={{ fontSize: "12px" }}>
              There are two types of new member <br />gift  package rewards:
            </Typography>
            <Typography variant="body2" paragraph sx={{ fontSize: "14px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "18px",
                  height: "18px",
                  lineHeight: "20px",
                  textAlign: "center",
                  backgroundColor: "white",
                  color: "#FFA500",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              >
                1
              </span>
              Bonus bonus for first deposit <br /> negative profit
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "14px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "18px",
                  height: "18px",
                  lineHeight: "20px",
                  textAlign: "center",
                  backgroundColor: "white",
                  color: "#FFA500",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              >
                2
              </span>
              Play games and get <br />bonuses  only for <br />new members
            </Typography>
            <Button
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "white",
                fontSize: "10px",
                borderRadius: "15px",
                height: "30px",
                width: "130px",
                marginTop: "16px",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Activity Details
            </Button>
          </Grid>
        </Paper>

        <Box
          sx={{
            display: "flex",
            alignItems: "left",
            p: 1,
            margin: 1,
            borderRadius: "50px",
            textAlign: "left",
            color: "red",
            bgcolor: "#323738",
          }}
        >
          <InfoOutlinedIcon sx={{ mr: 1, color: "red" }} />
          <Typography variant="caption">
            The membership system that meets the standard automatically distributes bonuses
          </Typography>
        </Box>
      </Box>
    </Mobile>
  );
};

export default GiftPackage;
