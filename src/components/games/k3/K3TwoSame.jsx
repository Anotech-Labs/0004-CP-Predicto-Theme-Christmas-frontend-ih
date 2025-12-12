import React, { useState } from "react";
import { Typography, Grid, Box } from "@mui/material";
const K3TwoSame = ({ onBetSelect, handleOpenDrawer, handleEventSelection }) => {
  // Track selection from first array (pair numbers)
  const [selectedPair, setSelectedPair] = useState(null);

  const betTypes = [
    {
      label: "2 matching numbers: odds(13.83)",
      values: [
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5],
        [6, 6],
      ],
      action: "TWO_SAME",
      backgroundColor: "#9B48DB",
    },
    {
      label: "A pair of unique numbers: odds(69.12)",
      values: [
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5],
        [6, 6],
      ],
      action: "TWO_SAME_SPECIFIC",
      backgroundColor: "#D23838",
    },
    {
      values: [1, 2, 3, 4, 5, 6],
      action: "TWO_SAME_SPECIFIC",
      backgroundColor: "#17B15E",
    },
  ];

  const handleBetClick = (value, action, typeIndex) => {
    if (action === "TWO_SAME") {
      onBetSelect(value[0], action);
      handleOpenDrawer(value[0], action);
      handleEventSelection("2 same");
      setSelectedPair(null); // Reset any existing selection
    } else if (action === "TWO_SAME_SPECIFIC") {
      if (typeIndex === 1) {
        // First row selection (pairs)
        setSelectedPair(value[0]); // Store the first number
      } else if (typeIndex === 2 && selectedPair !== null) {
        // Second row selection (single numbers)
        if (value !== selectedPair) {
          // Only proceed if different number selected
          const finalValue = [selectedPair, value];
          onBetSelect(finalValue, action);
          handleOpenDrawer(finalValue, action);
          handleEventSelection("2 same");
          setSelectedPair(null); // Reset selection after completing
        }
      }
    }
  };

  return (
    <>
      {betTypes.map((type, typeIndex) => (
        <div key={typeIndex} style={{ marginTop: "5px" }}>
          <Typography
            variant="body1"
            color="#FDE4BC"
            align="left"
            fontSize={14}
          >
            {type.label}
            {type.label && (
              <span
                style={{
                  background: "rgb(250, 87, 74)",
                  color: "#323738",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "15px", // Adjusted for better centering
                  height: "15px",
                  borderRadius: "50%", // Makes it a perfect circle
                  fontSize: "12px", // Adjusted for proper fit
                  // fontWeight: "bold",
                  lineHeight: "0", // Ensures vertical alignment
                  textAlign: "center",
                  marginLeft: "4px", // Adds spacing between text and circle
                }}
              >
                ?
              </span>
            )}
          </Typography>
          <Grid container spacing={1} justifyContent="space-between">
            {type.values.map((value, valueIndex) => {
              const isSelected = typeIndex === 1 && value[0] === selectedPair;
              const isDisabled = typeIndex === 2 && value === selectedPair;

              return (
                <Grid item key={valueIndex}>
                  <Box
                    elevation={3}
                    sx={{
                      bgcolor: isSelected
                        ? "#808080" // Selected pair color
                        : isDisabled
                        ? "#cccccc" // Disabled color for matching single number
                        : type.backgroundColor,
                      p: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "4px",
                      minWidth: "34px",
                      color: "#F5F3F0",
                      marginTop: "5px",
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      opacity: isDisabled ? 1 : 0.5,
                      // "&:hover": {
                      //   opacity: isDisabled ? 0.5 : 0.8,
                      // },
                    }}
                    onClick={() =>
                      !isDisabled &&
                      handleBetClick(value, type.action, typeIndex)
                    }
                  >
                    <Typography variant="body1">
                      {Array.isArray(value) ? value.join("") : value}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </div>
      ))}
    </>
  );
};

export default K3TwoSame;
