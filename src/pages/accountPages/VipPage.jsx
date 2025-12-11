import React, { useEffect } from "react";
import Mobile from "../../components/layout/Mobile";
import IconButton from "@mui/material/IconButton";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useState } from "react";
import { domain } from "../../utils/Secret";
import axios from "axios";
import VipComponent from "../../components/account/vip/VipComponent"

const VipMain = ({ children }) => {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate(-1);
  };

  // const [lastAchievement, setLastAchievement] = useState(null);
  // useEffect(() => {
  //   const fetchLastAchievement = async () => {
  //     try {
  //       const response = await axios.get(`${domain}/last-achievement`, {
  //         withCredentials: true,
  //       });

  //       setLastAchievement(response.data.lastAchievement);
  //     } catch (err) {
  //       console.error("Error fetching last achievement:", err);
  //     }
  //   };

  //   fetchLastAchievement();
  // }, []);

  return (
    <>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
          sx={{width:"100%"}}
        >
          <Box flexGrow={1} sx={{ backgroundColor: "#232626" }}>
          <Grid
          container
          alignItems="center"
          justifyContent="center"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "#232626",
            padding: "7px 12px",
          }}
        >
          <Grid
            item
            xs={12}
            container
            alignItems="center"
            justifyContent="center"
          >
            <IconButton
              sx={{
                color: "#FDE4BC",
                position: "absolute",
                left: 0,
                p: "12px",
              }}
              onClick={handleRedirect}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ color: "#FDE4BC", textAlign: "center", fontSize: "19px" }}
            >
               VIP
            </Typography>
          </Grid>
        </Grid>

            

            {/* //content */}

            <VipComponent />

            {/* content end */}
          </Box>

          {children}
        </Box>
      </Mobile>
    </>
  );
};

export default VipMain;