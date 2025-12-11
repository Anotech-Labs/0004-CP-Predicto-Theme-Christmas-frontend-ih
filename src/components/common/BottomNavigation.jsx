import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

const BottomNavigationArea = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(location.pathname);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        style={{
          position: "fixed",
          bottom: "0px",
          height: "10%",
          // backgroundImage: "url(/assets/christmas2-CQdl-tRr.webp)",
          // backgroundSize: "cover",
          // backgroundPosition: "top",
          backgroundColor: "#01441c",
          width: "100%",
          maxWidth: isSmallScreen ? "" : "396px",
          // paddiny: "1%",
          // Adjust height based on screen size
        }}
      >
        <img src="/assets/christmas2-CQdl-tRr.webp" alt="" width={"100%"} style={{ position: "absolute", top: "-38px", zIndex:10, marginBottom: "20px"}} />
        <BottomNavigationAction
          style={{ color: value === "/promotion" ? "#ffffff" : "#ffffff" }}
          label="Promotion"
          value="/promotion"
          icon={
            <img
              src={
                value === "/promotion"
                  ? "/assets/navigation/promotionSelected.webp"
                  : "/assets/navigation/promotion.webp"
              }
              width="30px"
              height="30px"
              style={{
                marginBottom: "4px",
              }}
              alt="icon"
            />
          }
        />
        <BottomNavigationAction
          style={{ color: value === "/activity" ? "#ffffff" : "#ffffff" }}
          label="Activity"
          value="/activity"
          icon={
            <img
              src={
                value === "/activity"
                  ? "/assets/navigation/activitySelected.webp"
                  : "/assets/navigation/activity.webp"
              }
              width="30px"
              height="30px"
              style={{
                marginBottom: "4px",
              }}
              alt="icon"
            />
          }
        />

        <BottomNavigationAction
          // label="Home"
          value="/"
          icon={
            <img
              src="/assets/navigation/home.webp"
              width="50px"
              height="50px"
              alt="icon"
              style={{
                zIndex: 20
              }}
            />
          }
          style={{ color: value === "/" ? "#ffffff" : "#ffffff", marginBottom: "20px" }}
        />
        <BottomNavigationAction
          style={{ color: value === "/wallet" ? "#ffffff" : "#ffffff" }}
          label="Wallet"
          value="/wallet"
          icon={
            <img
              src={
                value === "/wallet"
                  ? "/assets/navigation/walletSelected.webp"
                  : "/assets/navigation/wallet.webp"
              }
              width="30px"
              height="30px"
              style={{
                marginBottom: "4px", // hide image when src is empty
              }}
              alt="icon"
            />
          }
        />
        <BottomNavigationAction
          style={{ color: value === "/account" ? "#ffffff" : "#ffffff" }}
          label="Account"
          value="/account"
          icon={
            <img
              src={
                value === "/account"
                  ? "/assets/navigation/accountSelected.webp"
                  : "/assets/navigation/account.webp"
              }
              width="30px"
              height="30px"
              style={{
                marginBottom: "4px",
              }}
              alt="icon"
            />
          }
        />
      </BottomNavigation>
  );
};

export default BottomNavigationArea;
