import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Pagination from "@mui/material/Pagination";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import useMediaQuery from "@mui/material/useMediaQuery";

const K3GameHistory = ({ data, page, setPage ,totalPage}) => {
  // const pageSize = 10;
  // const [page, setPage] = useState(0);
  // //console.log("K3GameHistory" , data)
  // const totalPages = Math.ceil(data.length / pageSize);
// //console.log("page",page)
  const columns = [
    { id: "period", label: "Period" },
    { id: "sum", label: "Sum" },
    { id: "diceOutcome", label: "Results" },
  ];

  const isSmallScreen = useMediaQuery('(max-width:380px)');
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-evenly"
      borderRadius="25px"
      color="white"
      sx={{mt:"20px"}}
    >
      <Grid
        container
        item
        direction="row"
        justifyContent="space-evenly"
        backgroundColor="#cf7c10"
        borderRadius="5px 5px 0 0px"
      >
        {columns.map((column) => (
          <Grid
            item
            xs={column.id === "diceOutcome" ? 4 : 4}
            key={column.id}
            sx={{
              color: "white",
              height: 40,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              borderRadius: "5px",
              fontSize: "13px",
            }}
          >
            {column.label}
          </Grid>
        ))}
      </Grid>
      <Divider />
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        backgroundColor="#323738"
      >
        {data.map((row) => (
          <Grid
            container
            item
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            color="#ffffff"
            key={row.id}
            fontSize="0.75rem"
            // fontWeight="bold"
            // borderBottom="1px solid #ccc"
            padding="8px 12px"
          >
            <Grid item xs={4} sx={{fontSize:isSmallScreen ? "11px" : "12px"}}>
              {row.periodId}
            </Grid>
            <Grid item xs={3}sx={{display:"flex",justifyContent:"space-between",fontSize:isSmallScreen ? "11px" : "12px"}}>
              <Grid>
              {row.totalSum}
              </Grid>
              <Grid>
              {row.isBig ? "Big" : "Small"}
              </Grid>
              <Grid>
              {row.isOdd ? "Odd" : "Even"}
              </Grid>
             
            </Grid>
            {/* <Grid item xs={2}>
              {row.isBig ? "Big" : "Small"}
            </Grid>
            <Grid item xs={2}>
              {row.isOdd ? "Odd" : "Even"}
            </Grid> */}
            <Grid item xs={3}>
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="center"
              >
                {row.diceValues.map((outcome, index) => {
                  const src = `/assets/k3/dice/dice${outcome}.webp`;
                  return (
                    <img
                      key={index}
                      src={src}
                      alt={`Dice ${outcome}`}
                      style={{ margin: "3px" ,width:isSmallScreen?"18px":"22px"}}
                    />
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap:"30px",
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
            backgroundColor: "#24ee89",
            "&.Mui-disabled": {
              backgroundColor: "#5a5145", // Disabled background color
              color: "#B3BEC1", // Optional: Change text color for better visibility
            },
            "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 7px" },
          }}
        >
          <ArrowBackIosRoundedIcon style={{ color: page === 1 ? "#B3BEC1" : "#323738" }} />
        </Button>
        <Grid sx={{ display: "flex", alignItems: "center", color: "#B3BEC1" ,fontSize:"12.8px"}}>
          {page}/{totalPage}
          {/* 1/5 */}
        </Grid>
        <Button
          variant="contained"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPage}
          sx={{
            marginLeft: "10px",
            backgroundColor: "#24ee89",
            "&.Mui-disabled": {
              backgroundColor: "#5a5145", // Disabled background color
              color: "#B3BEC1", // Optional: Change text color for better visibility
            },
            "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 7px" },
          }}
        >
          <ArrowForwardIosRoundedIcon style={{ color: page === totalPage ? "#B3BEC1" : "#323738" }} />
        </Button>
      </Box>
    </Grid>
  );
};

export default K3GameHistory;
