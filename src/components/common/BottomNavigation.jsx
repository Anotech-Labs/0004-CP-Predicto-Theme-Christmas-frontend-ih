import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";

// Styled component for the ping animation container
const PingContainer = styled("div")({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

// Styled component for the ping circles (half-circle top glow)
const PingCircle = styled("div")(({ delay }) => ({
  position: "absolute",
  backgroundColor: "rgb(255, 255, 0)",
  width: "3rem",
  height: "2.5rem",
  borderRadius: "9999px 9999px 0 0",
  top: "0",
  marginLeft: "0.05rem",
  animation: `ping 1.5s cubic-bezier(0, 0, 0.1, 1) infinite`,
  animationDelay: delay || "0s",
  "@keyframes ping": {
    "0%": {
      transform: "scale(1)",
      opacity: 1,
    },
    "75%, 100%": {
      transform: "scale(2)",
      opacity: 0,
    },
  },
}));

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
        height: "8.5%",
        backgroundColor: "#01441c",
        width: "100%",
        maxWidth: isSmallScreen ? "" : "396px",
      }}
    >
      <img
        src="/assets/christmas2-CQdl-tRr.webp"
        alt=""
        width={"100%"}
        style={{ position: "absolute", top: "-38px", zIndex: 10, marginBottom: "20px" }}
      />
      <BottomNavigationAction
        style={{ color: value === "/promotion" ? "#24ee89" : "#ffffff", fontWeight: 600 }}
        label="Promotion"
        value="/promotion"
        icon={
          <img
            src={
              value === "/promotion"
                ? "/assets/navigation/promotion1.svg"
                : "/assets/navigation/promotion.svg"
            }
            width="30px"
            height="30px"
            style={{
              marginBottom: "2px",
              paddingTop: "12px",
            }}
            alt="icon"
          />
        }
      />
      <BottomNavigationAction
        style={{ color: value === "/activity" ? "#24ee89" : "#ffffff", fontWeight: 600 }}
        label="Activity"
        value="/activity"
        icon={
          <img
            src={
              value === "/activity"
                ? "/assets/navigation/activity1.svg"
                : "/assets/navigation/activity.svg"
            }
            width="30px"
            height="30px"
            style={{
              marginBottom: "2px",
              paddingTop: "12px",
            }}
            alt="icon"
          />
        }
      />

      <BottomNavigationAction
        value="/"
        icon={
          <PingContainer>
            <PingCircle delay="0s" />
            <PingCircle delay="0.375s" />
            <PingCircle delay="0.75s" />
            <img
              src="/assets/navigation/home.png"
              width="92px"
              height="62px"
              alt="icon"
              style={{
                zIndex: 20,
                position: "relative",
              }}
            />
          </PingContainer>
        }
        style={{ color: value === "/" ? "#ffffff" : "#ffffff", marginBottom: "0px" }}
      />
      <BottomNavigationAction
        style={{ color: value === "/wallet" ? "#24ee89" : "#ffffff", fontWeight: 600 }}
        label="Wallet"
        value="/wallet"
        icon={
          <img
            src={
              value === "/wallet"
                ? "/assets/navigation/wallet1.svg"
                : "/assets/navigation/wallet.svg"
            }
            width="30px"
            height="30px"
            style={{
              marginBottom: "2px",
              paddingTop: "12px",
            }}
            alt="icon"
          />
        }
      />
      <BottomNavigationAction
        style={{ color: value === "/account" ? "#24ee89" : "#ffffff", fontWeight: 600 }}
        label="Account"
        value="/account"
        icon={
          <img
            src={
              value === "/account"
                ? "/assets/navigation/account1.svg"
                : "/assets/navigation/account.svg"
            }
            width="30px"
            height="30px"
            style={{
              marginBottom: "2px",
              paddingTop: "12px",
            }}
            alt="icon"
          />
        }
      />
    </BottomNavigation>
  );
};

export default BottomNavigationArea;