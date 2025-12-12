import React, { useState } from "react"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Divider from "@mui/material/Divider"
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded"
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded"
import { useMediaQuery } from "@mui/material"
const WingoChart = ({ data, page, setPage, totalPage }) => {
  const [numRows, setNumRows] = useState(15)

  const handleLoadMore = () => {
    // //console.log("Load More button clicked");
    setNumRows(numRows + 10)
  }
  const displayData = data.slice(0, numRows)

  const isSmallScreen = useMediaQuery("(max-width:500px)")
  const isMiddleScreen = useMediaQuery("(max-width:600px)")

  const wordToNumber = (word) => {
    const numbers = {
      'ZERO': 0, 'ONE': 1, 'TWO': 2, 'THREE': 3, 'FOUR': 4,
      'FIVE': 5, 'SIX': 6, 'SEVEN': 7, 'EIGHT': 8, 'NINE': 9
    }
    return numbers[word] !== undefined ? numbers[word] : word
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "0px 0rem" }}>
      <div
        style={{
          display: "flex",
          backgroundColor: "#cf7c10",
          padding: "15px 0px",
          borderRadius: "5px 5px 0px 0px",
          fontWeight: "bold",
          color: "white",
        }}
      >
        <div style={{ width: "30%", fontSize: "14px" }}>Period</div>
        <div style={{ width: "70%", fontSize: "14px" }}>Number</div>
      </div>

      <div
        style={{
          backgroundColor: "#323738",
          padding: "10px",
          marginBottom: "20px",
          fontSize: isMiddleScreen ? "10px" : "12px",
          borderRadius: "4px",
        }}
      >
        <div style={{ marginBottom: "10px", color: "#FDE4BC", textAlign: "left", fontSize: isMiddleScreen ? "12px" : "14px" }}>
          Statistic (last 100 Periods)
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <div style={{ color: "#FDE4BC", fontSize: isMiddleScreen ? "12px" : "14px" }}>Winning number</div>
          <div>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, index) => (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  backgroundColor: "#323738", // Change background to white
                  color: "#D23838", // Change text color to red
                  textAlign: "center",
                  lineHeight: "18px",
                  marginRight: "2px",
                  fontSize: isMiddleScreen ? "12px" : "14px",
                  border: "1px solid #D23838", // Add a red border
                }}
              >
                {num}
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
            color: "#9DA7B3",
            fontSize: isMiddleScreen ? "12px" : "14px"
          }}
        >
          <div style={{ color: "#FDE4BC" }}>Missing</div>
          <div>
            {[1, 0, 21, 5, 3, 16, 9, 4, 10, 8].map((num, index) => (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  // backgroundColor: "#323738", // Change background to white
                  // color: "red", // Change text color to red
                  textAlign: "center",
                  lineHeight: "18px",
                  marginRight: "2px",
                  fontSize: isMiddleScreen ? "12px" : "14px",
                  border: "1px solid transparent", // Add a red border
                }}
              >
                {num}
              </span>
            ))}
          </div>
          {/* <div>1 0 21 5 3 16 9 4 10 8</div> */}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
            color: "#9DA7B3",
            fontSize: isMiddleScreen ? "12px" : "14px"
          }}
        >
          <div style={{ color: "#FDE4BC" }}>Avg missing</div>
          <div>
            {[11, 4, 13, 15, 6, 6, 10, 9, 11, 13].map((num, index) => (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  // backgroundColor: "#323738", // Change background to white
                  // color: "red", // Change text color to red
                  textAlign: "center",
                  lineHeight: "18px",
                  marginRight: "2px",
                  fontSize: isMiddleScreen ? "12px" : "14px",
                  border: "1px solid transparent", // Add a red border
                }}
              >
                {num}
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
            color: "#9DA7B3",
            fontSize: isMiddleScreen ? "12px" : "14px"
          }}
        >
          <div style={{ color: "#FDE4BC" }}>Frequency</div>
          <div>
            {[8, 19, 6, 7, 12, 13, 8, 11, 7, 9].map((num, index) => (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  // backgroundColor: "#323738", // Change background to white
                  // color: "red", // Change text color to red
                  textAlign: "center",
                  lineHeight: "18px",
                  marginRight: "2px",
                  fontSize: isMiddleScreen ? "12px" : "14px",
                  border: "1px solid transparent", // Add a red border
                }}
              >
                {num}
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#9DA7B3",
            // borderBottom: "1px solid #ccc",
            fontSize: isMiddleScreen ? "12px" : "14px",
            marginBottom: "8px",
          }}
        >
          <div style={{ color: "#FDE4BC" }}>Max consecutive</div>
          <div>
            {[2, 2, 1, 2, 1, 2, 1, 2, 1, 3].map((num, index) => (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  // backgroundColor: "#323738", // Change background to white
                  // color: "red", // Change text color to red
                  textAlign: "center",
                  lineHeight: "18px",
                  marginRight: "2px",
                  fontSize: isMiddleScreen ? "12px" : "14px",
                  border: "1px solid transparent", // Add a red border
                }}
              >
                {num}
              </span>
            ))}
          </div>
        </div>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.5)",width:"100%" }}></Divider>
        {displayData.map((row, rowIndex) => (
          <>
          <div
            key={row.id}
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              margin: "13px 0",
              position: "relative",
              paddingBottom: "5px",
              // borderBottom: "1px solid #ccc",
              justifyContent: "space-between",
              justifySelf: "flex-end",
            }}
          >
            <div style={{ fontSize: isMiddleScreen ? "11px" : "13px", color: "#FDE4BC" }}>
              {row.periodId.toString()}
            </div>
            {Array.from({ length: 10 }).map((_, circleIndex) => {
              const isColored =
                circleIndex === Number(wordToNumber(row.numberOutcome))
              return (
                <div
                  key={circleIndex}
                  style={{
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    border: "1px solid #9DA7B3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // position: "relative",
                    // margin: "0 5px",
                    background: isColored
                      ? Array.isArray(row.colorOutcome) &&
                        row.colorOutcome.length === 2
                        ? `linear-gradient(to right, ${row.colorOutcome[0]} 50%, ${row.colorOutcome[1]} 50%)`
                        : row.colorOutcome
                      : "transparent",
                    color: isColored ? "white" : "#9DA7B3",
                    zIndex: isColored ? 2 : 0
                  }}
                >
                  {circleIndex}
                </div>
              )
            })}
            
            {rowIndex < data.length - 1 && (
              <svg
                style={{
                  position: "absolute",
                  top: -10,
                  left: "100px",
                  overflow: "visible",
                  transform: "rotate(2deg)",
                  zIndex: 1,
                }}
              >
                <path
                  d={(() => {
                    const currentValue = Number(wordToNumber(row?.numberOutcome)) * ( isMiddleScreen ? 20 : 20.5) + ( isMiddleScreen ? 10 : 25 )
                    const nextRowValue =
                      rowIndex + 1 < data.length
                        ? Number(wordToNumber(data[rowIndex + 1]?.numberOutcome)) * ( isMiddleScreen ? 20 : 20.5) + ( isMiddleScreen ? 20 : 25 )
                        : currentValue // Default to currentValue if out of bounds

                    return `M${currentValue} 15 ${nextRowValue} 71`
                  })()}
                  stroke="red"
                  fill="transparent"
                />
              </svg>
            )}
          </div>
          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.5)",width:"100%", inset: 0 }}></Divider>

          </>
        ))}
      </div>


      <Box
        sx={{
          // width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "10px",
          backgroundColor: "#323738",
          padding: { xs: "10px"},
          borderRadius: "0 0 10px 10px",
        }}
      >
        <Button
          variant="contained"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          sx={{
            marginRight: "10px",
            backgroundColor: "#FED358",
            "&.Mui-disabled": {
              backgroundColor: "#382e35", // Disabled background color
              color: "#B79C8B", // Optional: Change text color for better visibility
            },
            "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 7px" },
          }}
        >
          <ArrowBackIosRoundedIcon style={{ color: page === 1 ? "#B79C8B" : "#323738" }} />
        </Button>
        <Grid sx={{ display: "flex", alignItems: "center", color: "#B79C8B",fontSize:"12.8px" }}>
          {page}/{totalPage}
        </Grid>
        <Button
          variant="contained"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPage}
          sx={{
            marginLeft: "10px",
            backgroundColor: "#FED358",
            "&.Mui-disabled": {
              backgroundColor: "#382e35", // Disabled background color
              color: "#B79C8B", // Optional: Change text color for better visibility
            },
            "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 7px" },
          }}
        >
          <ArrowForwardIosRoundedIcon style={{ color: page === totalPage ? "#B79C8B" : "#323738" }} />
        </Button>
      </Box>
    </div>
  )
}

export default WingoChart