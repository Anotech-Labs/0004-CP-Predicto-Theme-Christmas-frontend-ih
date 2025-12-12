import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
const GameHistory = ({ data, page, setPage, totalPage }) => {
  // const pageSize = 10;
  // const [page, setPage] = useState(1)

  const wordToNumber = (word) => {
    const numbers = {
      ZERO: 0,
      ONE: 1,
      TWO: 2,
      THREE: 3,
      FOUR: 4,
      FIVE: 5,
      SIX: 6,
      SEVEN: 7,
      EIGHT: 8,
      NINE: 9,
    };
    return numbers[word] !== undefined ? numbers[word] : word;
  };

  const columns = [
    { id: "period", label: "Period", width: "38%" },
    { id: "number", label: "Number", width: "17%" },
    { id: "big_small", label: "Big Small", width: "30%" },
    { id: "color", label: "Color", width: "15%" },
  ];
  //   const totalPage = data.length;
  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const paginatedData = data.slice(page * pageSize, (page + 1) * pageSize)

  return (
    <Grid container px={0}>
      {columns.map((column, index) => (
        <Grid
          item
          key={column.id}
          sx={{
            width: column.width,
            backgroundColor: "#cf7c10", // Changed to a golden yellow color
            color: "white",
            padding: "3.5% 1.8%",
            borderTopLeftRadius: index === 0 ? "5px" : "0",
            borderTopRightRadius: index === columns.length - 1 ? "5px" : "0",
            // fontWeight: "bold",
            display: "flex",
            fontSize: "0.9rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {column.label}
        </Grid>
      ))}
      <Divider />
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        backgroundColor="#323738"
      >
        {data.map((row) => (
          <React.Fragment key={row.periodId}>
            <Grid
              item
              xs={3}
              sx={{
                padding: "8px",
                // borderBottom: '1px solid #ccc',
                display: "flex",
                alignItems: "center",
                justifyContent: "left",
                fontSize: "13px",
                color: "#ffffff",
                // fontWeight: "bold"
              }}
            >
              {row.periodId.toString()}
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                padding: "8px",
                // borderBottom: '1px solid #ccc',
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                textAlign: "right",
                justifyContent: "right",
                // paddingRight: "5%",
                background:
                  Array.isArray(row.colorOutcome) &&
                  row.colorOutcome.length === 2
                    ? `linear-gradient(to bottom, ${
                        row.colorOutcome[0] === "red"
                          ? "rgb(253,86,92)"
                          : row.colorOutcome[0] === "green"
                          ? "rgb(64,173,114)"
                          : row.colorOutcome[0]
                      } 50%, ${
                        row.colorOutcome[1] === "red"
                          ? "rgb(253,86,92)"
                          : row.colorOutcome[1] === "green"
                          ? "rgb(64,173,114)"
                          : row.colorOutcome[1]
                      } 50%)`
                    : row.colorOutcome[0] === "red"
                    ? "rgb(253,86,92)"
                    : row.colorOutcome[0] === "green"
                    ? "rgb(64,173,114)"
                    : row.colorOutcome[0],
                WebkitBackgroundClip: "text",
                color: "transparent",
                fontSize: "1.7rem",
              }}
            >
              {wordToNumber(row.numberOutcome)}
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                padding: "8px",
                // borderBottom: '1px solid #ccc',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textTransform: "capitalize",
                fontSize: "13px",
                color: "#ffffff",
                // fontWeight: "bold"
              }}
            >
              {row.sizeOutcome.charAt(0).toUpperCase() + row.sizeOutcome.slice(1).toLowerCase()}
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                padding: "5px",
                // borderBottom: '1px solid #ccc',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {Array.isArray(row.colorOutcome) ? (
                row.colorOutcome.map((color, index) => (
                  <div
                    key={index}
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor:
                        color === "red"
                          ? "rgb(253,86,92)"
                          : color === "green"
                          ? "rgb(64,173,114)"
                          : color,
                      marginRight:
                        index < row.colorOutcome.length - 1 ? "5px" : "0",
                    }}
                  />
                ))
              ) : (
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: row.colorOutcome,
                  }}
                />
              )}
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          backgroundColor: "#323738",
          padding: { xs: "10px 0", sm: "20px 0" },
          borderRadius: "0 0 10px 10px",
          gap:"30px"
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
              backgroundColor: "#3a4142", // Disabled background color
              color: "#B3BEC1", // Optional: Change text color for better visibility
            },
            "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 7px" },
          }}
        >
          <ArrowBackIosRoundedIcon style={{ color: page === 1 ? "#B3BEC1" : "#323738"  }} />
        </Button>
        <Grid sx={{ display: "flex", alignItems: "center", color: "#B3BEC1" ,fontSize:"12.8px"}}>
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
              backgroundColor: "#3a4142", // Disabled background color
              color: "#B3BEC1", // Optional: Change text color for better visibility
            },
            "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 7px" },
          }}
        >
          <ArrowForwardIosRoundedIcon style={{color: page === totalPage ? "#B3BEC1" : "#323738"}} />
        </Button>
      </Box>
    </Grid>
  );
};

export default GameHistory;
