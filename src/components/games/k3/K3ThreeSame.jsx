import { Typography, Grid, Box } from "@mui/material";
import { useState } from "react";
const K3ThreeSame = ({
  selectedNumbers1,
  handleOpenDrawer,
  handleEventSelection,
  setselectedItem,
}) => {
  const [selectedItem, setSelectedItemState] = useState(null);
  const data = [
    {
      label: "3 of the same number: odds(207.36)",
      values: [
        [1, 1, 1],
        [2, 2, 2],
        [3, 3, 3],
        [4, 4, 4],
        [5, 5, 5],
        [6, 6, 6],
      ],
    },
    {
      label: "Any 3 of the same number: odds(34.56)",
      value: "Any 3 of the same number: odds",
    },
  ];

  return (
    <>
      {data.map((item, index) => (
        <div key={index} sx={{ mt: 2 }}>
          <Typography
            variant="body1"
            align="left"
            color="#FDE4BC"
            fontSize={14}
          >
            {item.label}
            {item.label && (
              <span
                style={{
                  background: "rgb(250, 87, 74)",
                  color: "#323738",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "15px", 
                  height: "15px",
                  borderRadius: "50%", 
                  fontSize: "12px", 
                  lineHeight: "0", 
                  textAlign: "center",
                  marginLeft: "4px", 
                }}
              >
                ?
              </span>
            )}
          </Typography>
          {Array.isArray(item.values) ? (
            <Grid container spacing={1} justifyContent="space-between">
              {item.values.map((value, valueIndex) => {
                // Extract the first digit for display and bet placement
                const displayNumber = value[0];
                return (
                <Grid item key={valueIndex}>
                  <Box
                    elevation={3}
                    sx={{
                      bgcolor: selectedNumbers1.toString() === value.toString()
                        ? "#9B48DB"
                        : "#9B48DB",
                      p: 1,
                      display: "flex",
                      justifyContent: "center",
                      borderRadius: "4px",
                      minWidth: "34px",
                      alignItems: "center",
                      position: "relative",
                      color: selectedNumbers1.toString() === value.toString()
                        ? "white"
                        : "#FDE4BC",
                      marginTop: "5px",
                      marginBottom: "8px",
                      opacity: selectedNumbers1.toString() === value.toString() ? 1 : 0.5,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      // When clicking a specific three same number, pass the displayNumber
                      // Set selectedNumbers1 for visual feedback
                      handleOpenDrawer(value, "THREE_SAME");
                      handleEventSelection("3 same specific");
                      setselectedItem("THREE_SAME");
                      setSelectedItemState("THREE_SAME");
                    }}
                  >
                    {displayNumber}{displayNumber}{displayNumber}
                    {selectedNumbers1.toString() === value.toString() && (
                      <img
                        src="/assets/k3/check.svg"
                        alt="Selected"
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: "16px",
                          height: "16px",
                        }}
                      />
                    )}
                  </Box>
                </Grid>
              )})}
            </Grid>
          ) : (
            <Box
              elevation={3}
              sx={{
                bgcolor: "#D23838",
                p: 1,
                display: "flex",
                justifyContent: "center",
                borderRadius: "4px",
                alignItems: "center",
                color: "#ffffff",
                marginTop: "5px",
                opacity: selectedItem === "THREE_SAME_RANDOM" ? 1 : 0.5,
                cursor: "pointer",
              }}
              onClick={() => {
                // Generate a random number (1-6) for "Any 3 of the same"
                const randomValue = Math.floor(Math.random() * 6) + 1;
                const sameNumbers = [randomValue, randomValue, randomValue];

                // Pass both the type and the random number
                handleOpenDrawer(sameNumbers, "THREE_SAME_RANDOM");
                handleEventSelection("3 same random");
                setselectedItem("THREE_SAME_RANDOM");
                setSelectedItemState("THREE_SAME_RANDOM");
              }}
            >
              <Typography variant="body1">{item.value}</Typography>
            </Box>
          )}
        </div>
      ))}
    </>
  );
};

export default K3ThreeSame;