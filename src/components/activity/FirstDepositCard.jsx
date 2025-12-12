import React from "react"
import PropTypes from "prop-types"
import { Box, Card, CardContent, Typography, LinearProgress, Button } from "@mui/material"

const FirstDepositCard = ({ bonus, onDeposit, depositType = "FIRST" })  => {
  // Format deposit type for display
  const depositLabel = depositType.charAt(0) + depositType.slice(1).toLowerCase();
  
  return (
  <Card
    sx={{
      mb: 2,
      backgroundColor: "#3a4142",
      boxShadow: "none",
      // border: "1px solid #E0E0E0",
      borderRadius: 2,
      // paddingBottom: -1
    }}
  >
    <CardContent sx={{
      "&:last-child": {
        paddingBottom: "10px"
      }, padding: "10px"
    }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="body1" sx={{ fontSize: "14px", color: "#ffffff" }}>
        {depositLabel} deposit{" "}
          <Typography component="span" sx={{ color: "#DD9138" }}>
            ₹{bonus.minimumDeposit}
          </Typography>
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#DD9138", fontSize: "15px" }}
        >
          + ₹{bonus.bonus}.00
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: "#B79C8B", fontSize: "12px", textAlign: "left" }}>
      Deposit ₹{bonus.minimumDeposit} for the {depositType.toLowerCase()} time and you will receive ₹{bonus.bonus} bonus
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
        <LinearProgress
          variant="determinate"
          value={0}
          sx={{
            flexGrow: 1,
            height: 16,
            borderRadius: 4,
            backgroundColor: "#232626",
            "& .MuiLinearProgress-bar": { backgroundColor: "#232626" },
          }}
        />
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            left: "30%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontWeight: "bold",
          }}
        >
          0/{bonus.minimumDeposit}
        </Typography>
        <Button
          variant="outlined"
          sx={{
            ml: 2,
            minWidth: 80,
            height: 30,
            fontSize: "12px",
            borderColor: "#DD9138",
            color: "#DD9138",
            borderRadius: "6px",
            textTransform: "none",
            "&:hover": {
              borderColor: "#DD9138",
              backgroundColor: "rgba(15, 101, 24, 0.04)",
            },
          }}
          onClick={onDeposit}
        >
          Deposit
        </Button>
      </Box>
    </CardContent>
  </Card>
)}

FirstDepositCard.propTypes = {
  bonus: PropTypes.object.isRequired,
  onDeposit: PropTypes.func.isRequired,
  depositType: PropTypes.string
}

export default FirstDepositCard
