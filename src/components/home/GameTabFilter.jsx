import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const tabData = [
  { label: "All", imageSelected: "../public/assets/icons/abouticon.webp", imageUnselected: "/assets/icons/abouticon.webp" },
  { label: "Lottery", imageSelected: "../public/assets/icons/lottery-selected.webp", imageUnselected: "/assets/icons/lottery-unselected.webp" },
  { label: "Super Jackpot", imageSelected: "../public/assets/icons/superJackpot.webp", imageUnselected: "/assets/icons/superJackpot.webp" },
  { label: "Slots", imageSelected: "../public/assets/icons/slots-selected.webp", imageUnselected: "/assets/icons/slots-unselected.webp" },
  { label: "Original", imageSelected: "../public/assets/icons/original-selected.webp", imageUnselected: "/assets/icons/original-unselected.webp" },
  { label: "Fishing", imageSelected: "../public/assets/icons/fishing-selected.webp", imageUnselected: "/assets/icons/fishing-unselected.webp" },
  { label: "Casino", imageSelected: "../public/assets/icons/casino-selected.webp", imageUnselected: "/assets/icons/casino-unselected.webp" },
];

const GameTabFilter = ({ selectedTabName, setSelectedTabName }) => {
  const [tabValue, setTabValue] = useState(
    tabData.findIndex((tab) => tab.label === selectedTabName) || 0
  );

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
    setSelectedTabName(tabData[newValue].label);
  };
  
  return (
    <Box>
    <Box sx={{ backgroundColor: "#05012B", px: "10px", py: "16px" }}>
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          bgcolor: "#05012B",
          borderRadius: "10px",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {tabData.map((tab, index) => (
          <Box
            key={index}
            role="tab"
            aria-selected={tabValue === index}
            tabIndex={0}
            onClick={() => handleTabChange(index)}
            onKeyDown={(e) => e.key === "Enter" && handleTabChange(index)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "70px", // Adjusted for proper spacing
              padding: "0 8px",
              cursor: "pointer",
              background: "transparent",
              color: tabValue === index ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
              borderRadius: "10px",
              marginRight: "6px",
              "&:first-of-type": { marginLeft: "8px" },
              transition: "all 0.3s ease",
            }}
          >
            <img
              src={tab.imageSelected}
              alt={tab.label}
              style={{
                width: "55px",
                height: "55px",
                marginBottom: "4px",
                opacity: tabValue === index ? 1 : 0.5,
                transition: "opacity 0.3s ease",
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontSize: "14px",
                textAlign: "center",
                fontWeight: tabValue === index ? "bold" : "normal",
                whiteSpace: "nowrap", // Prevents text wrapping
                overflow: "hidden",
                textOverflow: "ellipsis", // Truncates long text with ellipsis if necessary
              }}
            >
              {tab.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
  
  );
};

export default GameTabFilter;