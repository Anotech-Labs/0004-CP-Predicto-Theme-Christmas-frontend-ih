import React from "react";
import { Box, Button, Typography } from "@mui/material";

const DatePickerHeader = ({ onCancel, onConfirm }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 16px", // Adjusted padding for better spacing
      backgroundColor: "#323738", // Updated background color
      borderRadius: "8px 8px 0 0", // Add a rounded corner for the top
      border: "none", // Ensure no border is applied
      outline: "none", // Ensure no outline is applied
      boxShadow: "none", // Ensure no box shadow is applied
      "&::before, &::after": {
        display: "none", // Remove pseudo-elements that might cause lines
      },
      "&:focus, &:active": {
        outline: "none", // Remove outline on focus/active states
      },
      overflow: "hidden", // Prevent any overflow that might cause white lines
    }}
  >
    <Button
      onClick={onCancel}
      sx={{
        color: "#969799",
        textTransform: "none",
        fontWeight: "normal",
        minWidth: "auto", // Remove extra padding around the button text
        padding: "0", // Remove padding inside the button
        border: "none", // Ensure no border is applied
        outline: "none", // Ensure no outline is applied
        "&:focus, &:active": {
          outline: "none", // Remove outline on focus/active states
        },
      }}
    >
      Cancel
    </Button>

    <Typography
      variant="subtitle1"
      sx={{
        fontWeight: "bold",
        color: "white",
      }}
    >
      Choose a date
    </Typography>

    <Button
      onClick={onConfirm}
      sx={{
        color: "#24EE89",
        textTransform: "none",
        fontWeight: "normal",
        minWidth: "auto", // Remove extra padding around the button text
        padding: "0", // Remove padding inside the button
        border: "none", // Ensure no border is applied
        outline: "none", // Ensure no outline is applied
        "&:focus, &:active": {
          outline: "none", // Remove outline on focus/active states
        },
      }}
    >
      Confirm
    </Button>
  </Box>
);

export default DatePickerHeader;