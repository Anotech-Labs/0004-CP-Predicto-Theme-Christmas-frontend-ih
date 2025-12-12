import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid"
import Divider from "@mui/material/Divider"
import Box from "@mui/material/Box"
import useMediaQuery from "@mui/material/useMediaQuery";
import { Button } from "@mui/material";

const GameHistory = ({
  data = [],
  page = 1,
  setPage,
  totalPage = 1
}) => {
  // Ensure data is always an array
  const [paginatedData, setPaginatedData] = useState([]);

  // Update paginated data whenever data or page changes
  useEffect(() => {
    if (Array.isArray(data)) {
      setPaginatedData(data);
    } else {
      setPaginatedData([]);
    }
  }, [data, page]);

  const columns = [
    { id: "period", label: "Period", width: "35%" },
    { id: "result", label: "Result", width: "45%" },
    { id: "total", label: "Sum", width: "20%" },
  ];

  const isMediumScreen = useMediaQuery("(max-width:600px)");
  const isSmallScreen = useMediaQuery("(max-width:475px)");

  // Prepare section outcome for rendering
  const prepareSectionOutcome = (row) => {
    const sections = ['sectionA', 'sectionB', 'sectionC', 'sectionD', 'sectionE'];
    return sections.reduce((acc, section, index) => {
      acc[`section${index + 1}`] = { number: row[section] };
      return acc;
    }, {});
  };

  // Defensive checks
  if (!paginatedData || paginatedData.length === 0) {
    return (
      <Grid container sx={{ backgroundColor: "#323738", padding: "20px", color: "#ffffff" }}>
        No game history available
      </Grid>
    );
  }

  return (
    <Grid container px={0} sx={{ backgroundColor: "#323738" }}>
      {columns.map((column, index) => (
        <Grid
          item
          key={column.id}
          sx={{
            width: column.width,
            backgroundColor: "#cf7c10",
            color: "#ffffff",
            padding: "2.5% 5.8%",
            borderTopLeftRadius: index === 0 ? "10px" : "0",
            borderTopRightRadius: index === columns.length - 1 ? "10px" : "0",
            fontWeight: "bold",
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
        justifyContent="space-around"
        sx={{
          // mt: 1.5,
          backgroundColor: "#323738",
          // padding: "4px 0",
        }}
      >
        {paginatedData.map((row) => (
          <React.Fragment key={row.periodId}>
            {/* Period ID Column */}
            <Grid
              item
              xs={5}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12.9px",
                color: "#ffffff",
                padding: "9px 4px",
                textAlign: "center",
              }}
            >
              {row.periodId.toString()}
            </Grid>

            {/* Outcome Section */}
            <Grid
              item
              xs={5}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                // gap: "4px",
                padding: "9px 4px",
              }}
            >
              {Object.entries(prepareSectionOutcome(row)).map(([key, outcome]) => (
                <div
                  key={key}
                  style={{
                    minWidth: isSmallScreen ? "16px" : "20px",
                    minHeight: isSmallScreen ? "16px" : "20px",
                    borderRadius: "50%",
                    border: "1px solid grey",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    color: "#ffffff",
                    margin: isMediumScreen ? "2px 3px" : "2px",
                    aspectRatio: "1 / 1",
                    fontSize: isSmallScreen ? "12px" : "14px",
                  }}
                >
                  {outcome.number}
                </div>
              ))}
            </Grid>

            {/* Sum Section */}
            <Grid
              item
              xs={2}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                // gap: "4px",
                padding: "9px 4px",
              }}
            >
              <div
                style={{
                  minWidth: isSmallScreen ? "22px" : "22px",
                  minHeight: isSmallScreen ? "22px" : "22px",
                  borderRadius: "50%",
                  // border: "1px solid grey",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#24ee89",
                  color: "black",
                  margin: isMediumScreen ? "2px 3px" : "2px",
                  aspectRatio: "1 / 1",
                  fontSize: isSmallScreen ? "11.7px" : "11.7px",
                }}
              >
                {row.sumSection}
              </div>
              {/* {row.sumSection} */}
            </Grid>
          </React.Fragment>
        ))}
      </Grid>

    </Grid>
  );
};

export default GameHistory;