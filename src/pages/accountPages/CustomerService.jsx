import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import Mobile from "../../components/layout/Mobile";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { domain } from "../../utils/Secret";
import { useAuth } from "../../context/AuthContext";

const CustomerService = () => {
  const navigate = useNavigate();
  const [telegramLinks, setTelegramLinks] = useState([]);
  const [openTelegramModal, setOpenTelegramModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { axiosInstance } = useAuth();

  useEffect(() => {
    // Fetch Telegram channel links when component mounts
    const fetchTelegramLinks = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          `${domain}/api/additional/telegram-channel/get-telegram`
        );
        // Ensure telegramLinks is always an array
        setTelegramLinks(Array.isArray(response.data) ? response.data : []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Telegram links:", error);
        setIsLoading(false);
      }
    };

    fetchTelegramLinks();
  }, []);

  const handleOpenTelegramModal = () => {
    setOpenTelegramModal(true);
  };

  const handleCloseTelegramModal = () => {
    setOpenTelegramModal(false);
  };

  const handleOpenTelegramLink = (link) => {
    window.open(link, "_blank");
    setOpenTelegramModal(false);
  };

  const serviceOptions = [
    {
      title: "Deposit Not Received",
      icon: "/assets/customer-support/deposit.svg",
      link: "/tms/deposit-recharge-history",
    },
    {
      title: "Withdrawal Problem",
      icon: "/assets/customer-support/withdrawal.svg",
      link: "/tms/withdrawal-history",
    },
    {
      title: "IFSC Modification",
      icon: "/assets/customer-support/IFSC.svg",
      link: "/tms/change-ifsc",
    },
    {
      title: "Change ID Login Password",
      icon: "/assets/customer-support/changePass.svg",
      link: "/tms/change-password",
    },
    {
      title: "Change Bank Name",
      icon: "/assets/customer-support/bank.svg",
      link: "/tms/change-bank-name",
    },
    {
      title: "Modify Bank Information",
      icon: "/assets/customer-support/bank.svg",
      link: "/tms/modify-bank-details",
    },
    {
      title: "Add USDT Address",
      icon: "/assets/customer-support/USDT_Add.svg",
      link: "/tms/change-usdt",
    },
    {
      title: "Activity Bonus",
      icon: "/assets/customer-support/activityBonus.webp",
      link: "/tms/activity-bonus",
    },
    {
      title: "Game Problems",
      icon: "/assets/customer-support/gameProblem.svg",
      link: "/tms/game-problem",
    },
    {
      title: "Refund Policy",
      icon: "/assets/customer-support/refund.svg",
      link: "/tms/refund-policy",
    },
    {
      title: "Others",
      icon: "/assets/customer-support/gameProblem.svg",
      link: "/tms/others-issue",
    },
    {
      title: "Telegram Support",
      icon: "/assets/customer-support/gameProblem.svg",
      action: handleOpenTelegramModal,
    },
  ];

  return (
    <Mobile>
      <Container
        disableGutters
        maxWidth="xs"
        sx={{
          bgcolor: "#232626",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          "&.MuiContainer-root": {
            maxWidth: "100%",
          },
        }}
      >
        <Box
          sx={{
            bgcolor: "#232626",
            padding: "8px 10px",
            display: "flex",
            alignItems: "center",
            color: "#FDE4BC",
          }}
        >
          <ChevronLeftIcon
            sx={{ fontSize: 30, cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FDE4BC",
            }}
          >
            Customer Service
          </Typography>
          <HomeIcon
            sx={{ fontSize: 30, cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
        </Box>

        <Box>
          <Box
            component="img"
            src="../assets/account/helpline.webp"
            alt="Customer service illustration"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
        <Typography
          variant="h6"
          sx={{ color: "#FDE4BC", textAlign: "left", mt: 2, ml: 2 }}
        >
          Self Service
        </Typography>

        <List sx={{ bgcolor: "#323738", m: 2, borderRadius: 2 }}>
          {serviceOptions.map((item, index) => (
            <ListItem
              component="div"
              key={index}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  navigate(item.link);
                }
              }}
              sx={{ cursor: "pointer" }}
              secondaryAction={
                <IconButton edge="end" aria-label="go to">
                  <ChevronRightIcon sx={{ color: "#B79C8B" }} />
                </IconButton>
              }
            >
              <ListItemIcon>
                <Box
                  component="img"
                  src={item.icon}
                  alt={item.title}
                  sx={{
                    width: 35,
                    height: 35,
                    borderRadius: "50%",
                    objectFit: "contain",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{ fontWeight: "medium", my: "6px" }}
                sx={{ color: "#B79C8B" }}
              />
            </ListItem>
          ))}
        </List>

        {/* Kind Tips Section */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            mx: 2,
            textAlign: "left",
            background: "#323738",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: "#FDE4BC" }}
          >
            Kind Tips
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#B79C8B", mt: 1, fontSize: "12px" }}
          >
            1. Please select the corresponding question and submit it for
            review. After successful submission, the customer service specialist
            will handle it for you within 10 minutes. Please wait patiently.
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#B79C8B", mt: 1, fontSize: "12px" }}
          >
            2. 15 minutes after submitting for review, you can use{" "}
            <strong>Progress Query</strong> to view the review results of the
            work order you submitted.
          </Typography>
          
        </Box>

        {/* Progress Query Button */}
        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              background: "linear-gradient(90deg,#24ee89,#9fe871)",
              color: "#232626",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "24px",
              py: 1.5,
              textTransform: "none",
              mt: 2,
            }}
            onClick={() => navigate("/tms/progress-query")}
          >
            Progress Query
          </Button>
        </Box>
        <br />
        <br />
        <br />
      </Container>

      {/* Telegram Links Modal */}
      <Dialog
        open={openTelegramModal}
        onClose={handleCloseTelegramModal}
        maxWidth="xs"
        fullWidth={false}
        PaperProps={{
          sx: {
            width: "370px",
            minWidth: "370px",
            m: 2,
            background: "#323738",
            borderRadius: "12px",
            boxShadow: "0 8px 24px 0 rgba(31, 38, 135, 0.1)",
            border: "none",
          },
        }}
      >
        <DialogTitle
          sx={{
            background:
              "linear-gradient(135deg, #F5B73B 0%, #FED358 100%)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            color: "white",
            boxShadow: "0 2px 10px rgba(250, 98, 97, 0.3)",
            "& .MuiIconButton-root": {
              color: "white",
            },
          }}
        >
          <Typography variant="h7">Telegram Support Channels</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseTelegramModal}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, background: "#323738" }}>
          {isLoading ? (
            <Box sx={{ p: 3, textAlign: "center",color:"#E3EFFF" }}>
              <Typography>Loading Telegram channels...</Typography>
            </Box>
          ) : telegramLinks.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center",color:"#E3EFFF" }}>
              <Typography>No Telegram channels available.</Typography>
            </Box>
          ) : (
            <List sx={{ pt: 0 }}>
              {telegramLinks.map((channel, index) => (
                <Box key={channel.id}>
                  <ListItem
                    component="div"
                    onClick={() => handleOpenTelegramLink(channel.link)}
                    sx={{
                      py: 2,
                      cursor: "pointer",
                      // "&:hover": {
                      //   backgroundColor: "#f5f5f5",
                      // },
                    }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color: "#ffffff",
                          mb: 0.5,
                        }}
                      >
                        {channel.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#E3EFFF",
                          wordBreak: "break-all",
                        }}
                      >
                        {channel.link}
                      </Typography>
                    </Box>
                    <ChevronRightIcon sx={{ color: "#E3EFFF", ml: 1 }} />
                  </ListItem>
                  {index < telegramLinks.length - 1 && (
                    <Divider sx={{ opacity: 0.6 }} />
                  )}
                </Box>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Mobile>
  );
};

export default CustomerService;
