import React from "react";
import { Box, Button } from "@mui/material";

const LevelHeader = ({ onCancel, onConfirm }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "7px 16px",
      backgroundColor: "#323738",
      color: "#a8a5a1",
    }}
  >
    <Button
      onClick={onCancel}
      sx={{ color: "#969799", textTransform: "none" }}
    >
      Cancel
    </Button>
    <Button
  onClick={onConfirm}
  variant="contained"
  sx={{
    color: "#FED358",
    backgroundColor: "transparent",
    textTransform: "none",
    boxShadow:"none",
    '&:hover': {
        boxShadow:"none",
      backgroundColor: "transparent", // Keep the background color the same on hover
    },
  }}
>
  Confirm Level
</Button>

  </Box>
);

export default LevelHeader;