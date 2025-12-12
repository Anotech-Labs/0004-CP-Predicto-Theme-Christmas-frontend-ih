import React, { useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
// import { CheckIcon } from "lucide-react";

const K3AllDifferent = ({
  selectedNumbers1,
  selectedNumbers2,
  handleNumberClick,
  handleNumberClick2,
  handleOpenDrawer,
  handleEventSelection,
  setselectedItem,
  drawerOpen,
  handleCloseDrawer,
}) => {
  const values = [1, 2, 3, 4, 5, 6];

  // Clear selections when drawer closes
  useEffect(() => {
    if (!drawerOpen) {
      handleNumberClick([]);
      handleNumberClick2([]);
    }
  }, [drawerOpen]);

  const handleNumber1Click = (value) => {
    if (selectedNumbers1.includes(value)) {
      const newSelection = selectedNumbers1.filter((num) => num !== value);
      handleNumberClick(newSelection);
      return;
    }

    if (selectedNumbers1.length >= 3) {
      return;
    }

    const newSelection = [...selectedNumbers1, value];
    handleNumberClick(newSelection);

    if (newSelection.length === 3) {
      // Send the array directly to handleOpenDrawer
      handleOpenDrawer(newSelection, "ALL_DIFFERENT");
      handleEventSelection("Different");
      setselectedItem("ALL_DIFFERENT");
    }
  };

  const handleNumber2Click = (value) => {
    if (selectedNumbers2.includes(value)) {
      const newSelection = selectedNumbers2.filter((num) => num !== value);
      handleNumberClick2(newSelection);
      return;
    }

    if (selectedNumbers2.length >= 2) {
      return;
    }

    const newSelection = [...selectedNumbers2, value];
    handleNumberClick2(newSelection);

    if (newSelection.length === 2) {
      // Send the array directly to handleOpenDrawer
      handleOpenDrawer(newSelection, "TWO_DIFFERENT");
      handleEventSelection("Different");
      setselectedItem("TWO_DIFFERENT");
    }
  };

  const handleContinuousClick = () => {
    // Get valid continuous combinations
    const continuousCombinations = [
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5],
      [4, 5, 6],
    ];

    // Randomly select one combination
    const randomIndex = Math.floor(
      Math.random() * continuousCombinations.length
    );
    const selectedCombination = continuousCombinations[randomIndex];

    // Set the selection in state and send to parent
    handleNumberClick(selectedCombination);
    handleOpenDrawer(selectedCombination, "THREE_CONTINUOUS");
    handleEventSelection("Different");
    setselectedItem("THREE_CONSECUTIVE");
  };

  return (
    <>
      <Typography
        variant="body1"
        align="left"
        color="#FDE4BC"
        fontSize={14}
        gutterBottom
      >
        3 different numbers: odds(34.56)
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
      </Typography>

      <Grid container spacing={1} justifyContent={"space-between"}>
        {values.map((value, index) => (
          <Grid item key={index}>
            <Box
              sx={{
                bgcolor: selectedNumbers1.includes(value)
                  ? "#9B48DB"
                  : "#9B48DB",
                borderRadius: "4px",
                p: 1,
                color: selectedNumbers1.includes(value) ? "white" : "#FDE4BC",
                minWidth: "32px",
                textAlign: "center",
                position: "relative",
                cursor: "pointer",
                marginBottom: "8px",
                opacity: selectedNumbers1.includes(value) ? 1 : 0.5,
              }}
              onClick={() => handleNumber1Click(value)}
            >
              {value}
              {selectedNumbers1.includes(value) && (
                // <CheckIcon className="absolute bottom-0 right-0 bg-white text-[#9B48DB] rounded-full text-xs" />
                <img
                  src="/assets/k3/check.svg" // Replace with your actual image path
                  alt="Selected"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "16px", // Adjust size as needed
                    height: "16px", // Adjust size as needed
                  }}
                />
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 1, mb: 2 }}>
        <Typography
          variant="body1"
          align="left"
          color="#FDE4BC"
          fontSize={14}
          gutterBottom
        >
          3 continuous numbers: odds(8.64){" "}
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
        </Typography>

        <Box
          sx={{
            bgcolor: "#D23838",
            borderRadius: "4px",
            p: 1,
            textAlign: "center",
            color: "#ffffff",
            cursor: "pointer",
            // "&:hover": {
            //   bgcolor: "#ff9595",
            // },
          }}
          onClick={handleContinuousClick}
        >
          3 continuous numbers
        </Box>
      </Box>

      <Typography
        variant="body1"
        align="left"
        color="#FDE4BC"
        fontSize={14}
        gutterBottom
      >
        2 different numbers: odds(6.91){" "}
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
      </Typography>

      <Grid container spacing={1} justifyContent={"space-between"}>
        {values.map((value, index) => (
          <Grid item key={index}>
            <Box
              sx={{
                bgcolor: selectedNumbers2.includes(value)
                  ? "#9B48DB"
                  : "#9B48DB",
                borderRadius: "4px",
                p: 1,
                color: selectedNumbers2.includes(value) ? "white" : "#ffffff",
                minWidth: "32px",
                textAlign: "center",
                position: "relative",
                cursor: "pointer",
                opacity: selectedNumbers2.includes(value) ? 1 : 0.5,
              }}
              onClick={() => handleNumber2Click(value)}
            >
              {value}
              {selectedNumbers2.includes(value) && (
                // <CheckIcon className="absolute bottom-0 right-0 bg-white text-[#9B48DB] rounded-full text-xs" />
                <img
                  src="/assets/k3/check.svg" // Replace with your actual image path
                  alt="Selected"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "16px", // Adjust size as needed
                    height: "16px", // Adjust size as needed
                  }}
                />
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default K3AllDifferent;
