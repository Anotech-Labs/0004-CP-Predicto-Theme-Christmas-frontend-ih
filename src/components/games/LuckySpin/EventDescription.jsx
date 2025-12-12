import React from "react";
import {
  Typography,
  List,
  ListItem,
  Grid,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Mobile from "../../../components/layout/Mobile";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { useNavigate } from "react-router-dom";

const EventDesc = () => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate(-1);
  };

  return (
    <div>
      <Mobile>
        <Box
          sx={{
            bgcolor: "#232626",
            minHeight: "100vh",
            p: 0,
            maxWidth: "600px",
            mx: "auto",
          }}
        >
          {/* Header with Back Button */}
          <Grid
            item
            container
            alignItems="center"
            justifyContent="center"
            sx={{ bgcolor: "#232626", py: 0.8 }} // Background color for the header
          >
            <Grid item xs={2}>
              <IconButton
                sx={{ color: "#ffffff", ml: -2 }} // White color for the icon
                onClick={handleRedirect}
              >
                <ArrowBackIosNewIcon sx={{ fontSize:"19px"}}/>
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <Typography
                variant="h6"
                sx={{
                  color: "#ffffff", // White color for the text
                  flexGrow: 1,
                  textAlign: "center",
                  mr: 8,
                  fontSize:"19px"
                }}
              >
                Event Description
              </Typography>
            </Grid>
          </Grid>

          <Grid sx={{ mx: 1, mt: 2 }}>
            {/* Activity Time */}
            <Box sx={{ backgroundColor: "#323738", textAlign: "left" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#3a4142",
                  width: "100%",
                  padding: "6px 0px",
                  clipPath: "polygon(0 0, 100% 0%, 96% 100%, 0% 100%)",
                }}
              >
                <PlayArrowRoundedIcon sx={{ color: "#f1f2f5", marginRight: "4px" }} />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "medium", color: "#ffffff" }}
                >
                  Activity time
                </Typography>
              </Box>
              <Box sx={{ width: "90%", bgcolor: "#323738", padding: "8px 16px" }}>
                <Typography variant="body2" sx={{ color: "#ffffff", fontSize: "12px" }}>
                  From now on
                </Typography>
              </Box>
            </Box>

            {/* Validity Period */}
            <Box sx={{ backgroundColor: "#323738", mt: 1, textAlign: "left" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#3a4142",
                  width: "100%",
                  padding: "6px 0px",
                  clipPath: "polygon(0 0, 100% 0%, 96% 100%, 0% 100%)",
                }}
              >
                <PlayArrowRoundedIcon sx={{ color: "#f1f2f5", marginRight: "8px" }} />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "medium", color: "#ffffff" }}
                >
                  Validity period
                </Typography>
              </Box>
              <Box sx={{ width: "90%", bgcolor: "#323738", padding: "8px 16px" }}>
                <Typography variant="body2" sx={{ color: "#ffffff", fontSize: "12px" }}>
                  Official website notification shall prevail
                </Typography>
              </Box>
            </Box>

            {/* Red Text - Deposit Info */}

            <ListItem
              sx={{
                padding: 1,
                my: 2.5,
                bgcolor: "#323738",
                borderRadius: "8px",
                textAlign: "left",
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{ color: "#D23838", textAlign: "center", fontSize: "12px" }}
                  >
                    Members whose single deposit amount or accumulated deposit
                    amount reaches the set amount can participate in the
                    lottery.
                  </Typography>
                }
              />
            </ListItem>

            {/* Conditions of Participation */}
            <Box sx={{ backgroundColor: "#323738", mt: 1, textAlign: "left" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#3a4142",
                  width: "100%",
                  padding: "6px 0px",
                  clipPath: "polygon(0 0, 100% 0%, 96% 100%, 0% 100%)",
                }}
              >
                <PlayArrowRoundedIcon sx={{ color: "#f1f2f5", marginRight: "8px" }} />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "medium", color: "#ffffff" }}
                >
                  Conditions of participation
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  bgcolor: "#323738",
                  padding: "8px 0px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#B79C8B",px:2, fontSize: "12px" }}
                >
                  Members who meet the requirements of{" "}
                  <Box component="span" sx={{ color: "#D23838" }}>
                    Vip0, Vip1, Vip2, Vip3, Vip4, Vip5, Vip6, Vip7, Vip8, Vip9,
                    Vip10
                  </Box>{" "}
                  can participate in the bigwheel event. You need to bind a bank
                  card. Hundreds of millions of cash and many other prizes are
                  up for grabs. Get ready for endless surprises and grand prizes
                  every day!
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: "#B79C8B", my: 2,px:2, fontSize: "12px" }}
                >
                  Need to bind a{" "}
                  <Box component="span" sx={{ color: "#D23838" }}>
                    Bank account
                  </Box>
                  .
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#B79C8B", fontSize: "12px", mt: 1,px:2, }}
                >
                  With hundreds of millions in cash and many other prizes up for
                  grabs, get ready for endless surprises and big prizes every
                  day!
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Box>
      </Mobile>{" "}
    </div>
  );
};

export default EventDesc;