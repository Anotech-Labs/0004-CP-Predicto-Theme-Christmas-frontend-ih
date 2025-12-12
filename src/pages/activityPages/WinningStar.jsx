import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
// import Container from '@mui/material/Container';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import Mobile from "../../components/layout/Mobile";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
const WinningItem = ({ avatar, nickname, gameName, wins, bonus, time }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(460));
  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        margin: 1.5,
        bgcolor: "#323738",
        color: "white",
      }}
    >
      <CardContent
        sx={{
          "&.MuiCardContent-root": {
            padding: "10px",
          },
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar src={avatar} sx={{ width: 40, height: 40, mr: 2 }} />
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ fontSize: isSmallScreen ? "11px" : "15px",color:"#ffffff"}}
          >
            {nickname}
          </Typography>
        </Box>
        <Grid container>
          <Grid
            item
            xs={6}
            sx={{
              backgroundColor: "#3a4142",
              py: 0.5, // Reduced padding
              px: 1.5, // Reduced padding
              borderBottom: "2px solid #323738", // Reduced border thickness
              textAlign: "left",
              borderRadius: "5px 0 0 5px",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontSize: isSmallScreen ? "11px" : "13px" }}
              color="#B79C8B"
            >
              Game name
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              backgroundColor: "#3a4142",
              py: 0.5,
              px: 1.5,
              borderBottom: "2px solid #323738",
              textAlign: "left",
              borderRadius: "0 5px 5px 0",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontSize: isSmallScreen ? "11px" : "13px" }}
              color="#ffffff"
            >
              {gameName}
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              backgroundColor: "#3a4142",
              py: 0.5,
              px: 1.5,
              borderBottom: "2px solid #323738",
              textAlign: "left",
              borderRadius: "5px 0 0 5px",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontSize: isSmallScreen ? "11px" : "13px" }}
              color="#B79C8B"
            >
              Number of wins
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              backgroundColor: "#3a4142",
              py: 0.5,
              px: 1.5,
              borderBottom: "2px solid #323738",
              textAlign: "left",
              borderRadius: "0 5px 5px 0",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontSize: isSmallScreen ? "11px" : "13px" }}
              color="warning.main"
            >
              {wins}X
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              backgroundColor: "#3a4142",
              py: 0.5,
              px: 1.5,
              borderBottom: "2px solid #323738",
              textAlign: "left",
              borderRadius: "5px 0 0 5px",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontSize: isSmallScreen ? "11px" : "13px" }}
              color="#B79C8B"
            >
              Bonus
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              backgroundColor: "#3a4142",
              py: 0.5,
              px: 1.5,
              borderBottom: "2px solid #323738",
              textAlign: "left",
              borderRadius: "0 5px 5px 0",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontSize: isSmallScreen ? "11px" : "13px" }}
              color="red"
            >
              ₹{bonus}
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              backgroundColor: "#3a4142",
              py: 0.5,
              px: 1.5,
              borderBottom: "2px solid #323738",
              textAlign: "left",
              borderRadius: "5px 0 0 5px",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontSize: isSmallScreen ? "11px" : "13px" }}
              color="#B79C8B"
            >
              Winning time
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              backgroundColor: "#3a4142",
              py: 0.5,
              px: 1.5,
              borderBottom: "2px solid #323738",
              textAlign: "left",
              borderRadius: "0 5px 5px 0",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontSize: isSmallScreen ? "11px" : "13px" }}
              color="#B79C8B"
            >
              {time}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const WinningStar = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const winningItems = [
    {
      avatar: "/assets/avatars/profile-1.webp",
      nickname: "917***914",
      gameName: "Treasures of Lion City",
      wins: 10.14,
      bonus: "50.00",
      time: "2024-08-17 05:54:00",
    },
    {
      avatar: "/assets/avatars/profile-2.webp",
      nickname: "918***025",
      gameName: "Aviator",
      wins: 14.63,
      bonus: "50.00",
      time: "2024-08-17 05:54:00",
    },
    {
      avatar: "/assets/avatars/profile-3.webp",
      nickname: "919***822",
      gameName: "Aviator",
      wins: 22,
      bonus: "100.00",
      time: "2024-08-17 05:54:00",
    },
    {
      avatar: "/assets/avatars/profile-4.webp",
      nickname: "919***822",
      gameName: "Fortune Gems 2",
      wins: 10,
      bonus: "50.00",
      time: "2024-08-17 05:54:00",
    },
  ];

  return (
    <div>
      <Mobile>
        <Box sx={{ bgcolor: "#232626", minHeight: "100vh" }}>
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
                  color: "#ffffff",
                  position: "absolute",
                  left: 0,
                  p: "12px",
                }}
                onClick={() => navigate(-1)}
              >
                <ArrowBackIosOutlinedIcon sx={{ fontSize: "19px" }} />
              </IconButton>
              <Typography
                variant="h6"
                sx={{ color: "#ffffff", textAlign: "center", fontSize: "19px" }}
              >
                Winning star
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            {winningItems.map((item, index) => (
              <WinningItem key={index} {...item} />
            ))}
          </Box>
        </Box>
      </Mobile>
    </div>
  );
};

export default WinningStar;
