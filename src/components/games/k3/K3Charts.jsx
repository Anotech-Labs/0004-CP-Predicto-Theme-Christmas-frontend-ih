import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/system";
import Pagination from "@mui/material/Pagination";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import useMediaQuery from "@mui/material/useMediaQuery";

const CustomPagination = styled(Pagination)({
  "& .MuiPaginationItem-root": {
    color: "#A8A5A1",
  },
  "& .MuiPaginationItem-page.Mui-selected": {
    color: "#A8A5A1",
  },
  "& .MuiPaginationItem-ellipsis": {
    color: "#0F6518",
    backgroundColor: "#0F6518",
  },
  "& .MuiPaginationItem-previousNext": {
    backgroundColor: "#0F6518",
    color: "#323738",
    padding: "3px",
    width: "auto", // Ensure it doesn't stretch
    height: "auto", // Ensure it doesn't stretch
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .MuiPaginationItem-icon": {
    width: "70px", // Adjust the size to make it square
    height: "40px", // Adjust the size to make it square
  },
});

const K3Charts = ({ data ,page, setPage ,totalPage}) => {
  const getOutcomeDescription = (outcome) => {
    const uniqueNumbers = [...new Set(outcome)];
    if (uniqueNumbers.length === 1) {
      return "3 same numbers";
    } else if (uniqueNumbers.length === 2) {
      return "2 same numbers";
    } else if (uniqueNumbers.length === 3) {
      const sortedOutcome = [...outcome].sort();
      if (
        sortedOutcome[2] - sortedOutcome[1] === 1 &&
        sortedOutcome[1] - sortedOutcome[0] === 1
      ) {
        return "3 consecutive numbers";
      } else {
        return "3 different numbers";
      }
    }
  };

  // const [page, setPage] = useState(0);
  // const rowsPerPage = 10;
  // const totalPages = Math.ceil(data.length / rowsPerPage);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage - 1);
  // };

  
  const isSmallScreen = useMediaQuery('(max-width:400px)');
  // const paginatedData = data.slice(
  //   page * rowsPerPage,
  //   (page + 1) * rowsPerPage
  // );

  return (
    <div style={{marginTop:"20px"}}>
      <div
        style={{
          backgroundColor: "#323738",
          borderRadius: "10px",
          color: "black",
          // padding: "1px",
        }}
      >
        {/* Header Row */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            fontWeight: "bold",
            backgroundColor: "#cf7c10",
            color: "white",
            height: "40px",
            alignItems: "center",
            padding: "0 5px",
            borderRadius:"5px 5px 0 0px"
          }}
        >
          <div style={{ width: "150px", fontSize: isSmallScreen?"14px":"16px" }}>Period</div>
          <div style={{ width: "150px", fontSize:isSmallScreen?"14px": "16px" }}>Results</div>
          <div style={{ width: "200px", fontSize: isSmallScreen?"14px":"16px" }}>Number</div>
        </div>
        {/* Render Data Rows */}
        {data.map((row) => (
          <div
            key={row.id}
            style={{
              display: "flex",
              flexDirection: "row",
              margin: "5px 0",
              alignItems: "center",
              padding: "0 10px",
              color: "#FDE4BC",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: isSmallScreen? "11px":"12px" }}>
              <p>{row.periodId}</p>
           
            </div>
            <div style={{  fontSize:isSmallScreen? "11px" :"12px",display:"flex",justifyContent:"center" }}>
              {row.diceValues.map((outcome, index) => {
                const src = `/assets/k3/dice/dice${outcome}.webp`;
                return (
                  <img
                    key={index}
                    src={src}
                    alt={`Dice ${outcome}`}
                   
                    style={{ marginRight: "5px" ,width:isSmallScreen? "18px":"20px",
                      }}
                  />
                );
              })}
            </div>
            <div style={{  fontSize: isSmallScreen? "11px":"12px" ,width:isSmallScreen? "40%":"40%"}}>
              {getOutcomeDescription(row.diceValues)}
            </div>
          </div>
        ))}{" "}
      </div>
      {/* Load More Pagination */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap:"32px",
          marginTop: "20px",
          backgroundColor: "#323738",
          padding: { xs: "10px 0", sm: "15px 0" },
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
              backgroundColor: "#5a5145", // Disabled background color
              color: "#FDE4BC", // Optional: Change text color for better visibility
            },
            "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 7px" },
          }}
        >
          <ArrowBackIosRoundedIcon style={{ color: page === 1 ? "#FDE4BC" : "#323738" }} />
        </Button>
        <Grid sx={{ display: "flex", alignItems: "center", color: "#FDE4BC",fontSize:"12.8px" }}>
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
              backgroundColor: "#5a5145", // Disabled background color
              color: "#FDE4BC", // Optional: Change text color for better visibility
            },
            "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 7px" },
          }}
        >
          <ArrowForwardIosRoundedIcon style={{ color: page === totalPage ? "#FDE4BC" : "#323738" }} />
        </Button>
      </Box>
    </div>
  );
};

export default K3Charts;
