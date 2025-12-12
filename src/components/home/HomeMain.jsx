import React, { useContext, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import DetailsBox from "../common/DetailsBox";
import Winning from "./Winning";
// import Stage from "./Stage";
import ScrollableTabs from "./ScrollableTab";
import SvgIcon from "@mui/material/SvgIcon";
import { useNavigate } from "react-router-dom";
import ImageSlider from "./ImageSlider";
import { UserContext } from "../../context/UserState";
// import GameTabFilter from "./GameTabFilter";
// import WalletComponent from "./walletCard";
// import TopBanner from "./TopBanner";
// import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import LoadingLogo from "../utils/LodingLogo";
import Divider from '@mui/material/Divider';
import { useAuth } from "../../context/AuthContext";
import { Badge, Button } from "@mui/material";
import JackpotSection from "./JackpotSection";
<<<<<<< Updated upstream
import { Bell, Gift, Plus } from "lucide-react";
import TrendingGames from "./TrendingGames";
=======
import { Bell, Divide, Gift, Plus } from "lucide-react";
import GamingProvidersGrid from "./GamingProvidersGrid";
>>>>>>> Stashed changes
const HomeMain = ({ children }) => {
  const RhombusIcon = (props) => (
    <SvgIcon {...props}>
      <path d="M12 2L22 12L12 22L2 12L12 2Z" />
    </SvgIcon>
  );



  const [logoLoading, setLogoLoading] = useState(true); // Loading state
  // const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const [currentTextIndex, setCurrentTextIndex] = useState(0);
  // const [winners, setWinners] = useState(win);
  // const [selectedTabName, setSelectedTabName] = useState("All");
  const navigate = useNavigate()
  const { userWallet, getWalletBalance, isLoading } = useContext(UserContext);
  const { isAuthenticated } = useAuth()
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoLoading(false); // Hide loading after 2 seconds
    }, 1000);
    getWalletBalance()

    return () => clearTimeout(timer); // Cleanup
  }, []);

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        height="calc(var(--vh, 1vh) * 100)"
        position="relative"
        sx={{
          backgroundColor: "#232626",
          overflowY: "scroll",
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            width: "1px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#232626",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#232626",
          },
        }}
      >
        {isLoading || logoLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
            }}
          >
            <LoadingLogo websiteName="Cognix Solutions" />
          </div>
        )}
        <Box flexGrow={1}>
          {/* Top bar */}

          {!isAuthenticated ? (
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#232626",
                px: "6px",
                pt: "6px",
                color: "white",
              }}
            >
              <Grid item xs={4} sx={{ ml: 1 }} textAlign="left">
                <img
                  src="/assets/logo/colorLogo.webp"
                  alt="logo"
                  style={{ width: "140px", height: "auto" }}
                />
              </Grid>

              <Grid
                item
                xs={6}
                textAlign="right"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Button
                    sx={{
                      textTransform: "none",
                      color: "#ffffff",
                      border: "1px solid white",
                      width: "60px",
                      height: "30px",
                      mr: 1,
                      fontSize: "12px",
                      textAlign: "center",
                      lineHeight: "30px",
                      fontWeight: "600",
                    }}
                    onClick={() =>  navigate("/login")}
                  >
                    Sign In
                  </Button>

                  <Button
                    sx={{
                      textTransform: "none",
                      color: "#000000",
                      width: "60px",
                      height: "30px",
                      fontSize: "12px",
                      textAlign: "center",
                      lineHeight: "30px",
                      fontWeight: "600",
                      background: "linear-gradient(90deg,#24ee89,#9fe871)",
                      boxShadow:
                        "0 0 12px rgba(35,238,136,.3), inset 0 -2px #1dca6a",
                    }}
                    onClick={() =>  navigate("/register")}
                  >
                    Sign Up
                  </Button>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#232626",
                px: "6px",
                pt: "6px",
                color: "white",
                display: "flex"
              }}
            >
              {/* LEFT LOGO */}
              <Grid item xs={1}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/assets/logo/a_logo.webp"   // your green G logo
                    alt="logo"
                    style={{ width: 42, height: "auto" }}
                  />
                </Box>
              </Grid>

              {/* CENTER BALANCE BOX */}
              <Grid item xs={4}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#2F3232",
                    borderRadius: "10px",
                    border: "1px solid #3A3C3C",
                    px: 1,
                    py: 0.6,
                  }}
                >
                  {/* Rupee Amount */}
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: "#fff",
                      fontWeight: 500,
                      mr: 1,
                    }}
                  >
                    ₹ {userWallet}
                  </Typography>

                  {/* Green + Button */}
                  <IconButton
                    sx={{
                      width: 30,
                      height: 30,
                      background: "#20D562",
                      borderRadius: "10px",
                      p: 0,
                      "&:hover": { background: "#1bc057" },
                    }}
                    onClick={() => navigate("/wallet/deposit")}
                  >
                    <Plus />
                  </IconButton>
                </Box>
              </Grid>

              {/* RIGHT ICONS + AVATAR */}
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                {/* Bell Icon with badge "2" */}
                <Box sx={{ bgcolor: "#ffffff0d", p: "6px", display: "flex", borderRadius: "10px" }}>
                  <Badge
                    badgeContent={4}
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#9DF86D",
                        color: "#000",
                        fontSize: "10px",
                        fontWeight: 600,
                      },
                    }}
                  >
                    <IconButton sx={{ p: 0.5 }}
                      onClick={() => navigate("/account/notification")}>
                      <Bell style={{ color: "white" }} />
                    </IconButton>
                  </Badge>
                  <Divider />
                  {/* Gift Icon */}
                  <IconButton sx={{ p: 0.5 }}
                  onClick={() => navigate("/account/gift-coupon")}>
                    <Gift style={{ color: "white" }} />
                  </IconButton>

                </Box>


                {/* Hot Event Sticker */}
                <img
                  src="/assets/hotevent-GYxqVDim.png"
                  alt="hot event"
                  style={{ width: 44, height: "auto" }}
                />

                {/* Profile Avatar */}
                <img
                  src="/assets/home-profile.png"   // santa hat avatar asset
                  width={50}
                  onClick={() => navigate("/account")}
                />
              </Grid>
            </Grid>
          )}


          {/* <TopBanner /> */}
          <ImageSlider />
          {/* <DetailsBox /> */}
          {/* <WalletComponent /> */}
          {/* Tabs */}
          {/* <ScrollableTabs/> */}
          <JackpotSection />
          <TrendingGames />
          <ScrollableTabs />

          {/* Winning Information */}
          <Winning />

<<<<<<< Updated upstream
          {/* Today's earning chart */}
          <Box
            sx={{
              mx: 1.7,
              mt: 3.5,
              // padding: "16px",
              borderRadius: "8px",
              maxWidth: "100%",
            }}
          >
            <Box display="flex" alignItems="center" sx={{ mb: "15px" }}>
              <img src="/assets/gameFilter/winning.webp" alt="" width="22px" />
              <Typography
                variant="h6"
                sx={{
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "7px",
                  fontSize: "14.9px",
                  fontWeight: "600",
                  fontFamily: "'Times New Roman', Times, serif !important",
                }}
              >
                Today's earnings chart
              </Typography>
            </Box>
            {/* <Box sx={{ width: "100%", borderRadius: "12px", background: "#232626" }}>
              <Stage /></Box> */}
          </Box>

          {/* InfoSection */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            sx={{
              mx: "13px",
              my: 2.5,
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              gap={1.5}
              sx={{
                backgroundColor: "#232626",
                p: 1,
                borderRadius: "8px",
              }} // Optional container styling
            >
              {/* First Row: Two Images */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 1 }}
              >
=======
          <GamingProvidersGrid />
>>>>>>> Stashed changes


          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </Box>

        {children}
      </Box >
    </>
  );
};

export default HomeMain;
