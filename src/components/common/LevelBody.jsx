import React from "react";
import VerticalPicker from "./VerticalPicker";
import { Box } from "@mui/material";

const LevelBody = ({ selectedLevel, setSelectedLevel, options }) => {
  // Transform options to include "Tier" prefix for numeric values
  const formattedOptions = options.map((option) => {
    if (!isNaN(option)) {
      return `Tier ${option}`;
    }
    return option;
  });

  // Function to handle the selection change
  const handleChange = (formattedValue) => {
    // Extract the numeric value from "Tier X" or keep the original value
    const originalValue = formattedValue.startsWith("Tier")
      ? formattedValue.replace("Tier ", "")
      : formattedValue;
    setSelectedLevel(originalValue);
  };

  return (
    <Box
      sx={{
        padding: "20px",
        bgcolor: "#201d29",
      }}
    >
      <VerticalPicker
        initialValue={
          selectedLevel === "Dummy" || selectedLevel === "All"
            ? selectedLevel
            : `Tier ${selectedLevel}`
        }
        onChange={handleChange}
        options={formattedOptions}
      />
    </Box>
  );
};

export default LevelBody;