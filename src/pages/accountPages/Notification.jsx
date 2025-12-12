import React, { useEffect, useState, useContext } from "react";
import Mobile from "../../components/layout/Mobile";
import IconButton from "@mui/material/IconButton";
import EmailIcon from "@mui/icons-material/Email";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useAuth } from "../../context/AuthContext";
import { domain } from "../../utils/Secret";
import { UserContext } from "../../context/UserState";
// import DeleteConfirmationModal from "./DeleteConfirmationModal"; // Import the new modal component
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
const Notification = ({ children }) => {
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
  const { axiosInstance } = useAuth();
  const { userData } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [expandedTitles, setExpandedTitles] = useState({});
  const [expandedMessages, setExpandedMessages] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state for delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous URL
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${domain}/api/notification/list`
      );
      setNotifications(response.data.data.items);
      setError(null);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err.response?.data?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [axiosInstance]);

  // Open delete confirmation modal
  const openDeleteModal = (notificationId) => {
    setNotificationToDelete(notificationId);
    setDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setNotificationToDelete(null);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (notificationToDelete) {
      try {
        await axiosInstance.delete(
          `${domain}/api/account/v1/notifications/user/${notificationToDelete}`
        );

        // Update local state after successful deletion
        setNotifications((prevNotifications) => {
          return prevNotifications.filter((notification) => {
            return notification.id !== notificationToDelete;
          });
        });
        setPopupMessage(" Notification deleted successfully!!")
        setIsPopupVisible(true);
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);

        closeDeleteModal();
      } catch (err) {
        console.error("Error deleting notification:", err);
        setPopupMessage("Failed to delete notification. Please try again.");
        setIsPopupVisible(true);
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);

        closeDeleteModal();
      }
    }
  };

  const toggleTitleExpansion = (index) => {
    setExpandedTitles((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleMessageExpansion = (index) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const truncateText = (text, charLimit) => {
    return text.length > charLimit ? text.slice(0, charLimit) + "..." : text;
  };

  // if (loading) {
  //   return (
  //     <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  // if (error) {
  //   return <Typography color="error">Failed to load notifications.</Typography>;
  // }

  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
          sx={{ bgcolor: "#232626", mb: 10 }}
        >
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
                onClick={handleBackClick}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
              </IconButton>
              <Typography
                variant="h6"
                sx={{ color: "#FDE4BC", textAlign: "center", fontSize: "19px" }}
              >
                Notifications
              </Typography>
            </Grid>
          </Grid>

          <Container
            sx={{
              mb: 20,
              maxWidth: "600px",
              paddingLeft: { xs: "12px", sm: "12px" },
              paddingRight: { xs: "12px", sm: "12px" },
            }}
          >

            {error ? (<Typography color="error">Failed to load notifications.</Typography>)
              : loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                  <CircularProgress />
                </Box>
              ) :
                notifications.length === 0 ? (
                  <Box display="flex" flexDirection="column" alignItems="center" height="100vh" marginTop="20px">
                    <img src="/assets/No data-1.webp" alt="No Data" style={{ width: '200px', height: '200px' }} />
                    <Typography variant="h7" color="#FDE4BC">No notifications available</Typography>
                  </Box>
                ) : (
                  notifications.map((notification, index) => (
                    <Card
                      key={notification.id}
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        boxShadow: 1,
                        backgroundColor: "#323738",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          "&:last-child": {
                            paddingBottom: "5px",
                            paddingTop: "5px",
                            paddingRight: "0px",
                            px: 1.5,
                          },
                        }}
                      >
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item sx={{ display: "flex", alignItems: "center" }}>
                            <EmailIcon
                              sx={{ mr: 0.5, color: "#767574", fontSize: "18px" }}
                            />
                            <Typography
                              variant="h6"
                              component="div"
                              color="black"
                              fontWeight="bold"
                              sx={{
                                wordBreak: "break-word",
                                textTransform: "uppercase",
                                fontSize: "16px",
                                color: "white",
                              }}
                            >
                              {expandedTitles[index]
                                ? notification.title.toUpperCase()
                                : truncateText(notification.title.toUpperCase(), 20)}
                              {!expandedTitles[index] &&
                                notification.title.length > 20 && (
                                  <Button
                                    onClick={() => toggleTitleExpansion(index)}
                                    sx={{
                                      color: "black",
                                      textTransform: "none",
                                      padding: 0,
                                      minWidth: "unset",
                                    }}
                                  >
                                    ...
                                  </Button>
                                )}
                            </Typography>
                          </Grid>

                          <Grid item>
                            <Button
                              onClick={() => openDeleteModal(notification.id)}
                              sx={{ minWidth: "unset", padding: 0 }}
                            >
                              <img
                                src="/assets/icons/delete.webp"
                                alt=""
                                width={18}
                              />
                            </Button>
                          </Grid>
                        </Grid>

                        <Typography
                          variant="body2"
                          color="#666462"
                          textAlign="left"
                          sx={{
                            wordBreak: "break-word",
                            fontSize: "13px",
                          }}
                        >
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="#a7a4a0"
                          sx={{ mt: 1, textAlign: "left" }}
                        >
                          {expandedMessages[index]
                            ? notification.body
                            : truncateText(notification.body, 50)}
                          {notification.body.length > 50 && (
                            <Button
                              onClick={() => toggleMessageExpansion(index)}
                              sx={{ color: "#FED358", padding: 0 }}
                            >
                              {expandedMessages[index] ? "Show less" : "Show more"}
                            </Button>
                          )}
                        </Typography>
                      </CardContent>
                    </Card>
                  )))}
          </Container>

          {children}
        </Box>

        {/* Success Snackbar */}
        {/* <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <MuiAlert
            severity="success"
            onClose={() => setSnackbarOpen(false)}
            sx={{
              width: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              "& .MuiAlert-icon": {
                color: "#FED358",
              },
            }}
          >
            Notification deleted successfully!
          </MuiAlert>
        </Snackbar> */}
        <div>
          {/* Your existing component code */}

          {/* Popup Notification */}
          {isPopupVisible && (
            <Box
              sx={{
                position: "fixed",
                top: "50%",
                left: "50%",
                ...(isSmallScreen && { width: "70%" }),
                transform: "translate(-50%, -50%)",
                bgcolor: "rgba(0, 0, 0, 0.9)",
                color: "white",
                padding: "20px 30px",
                borderRadius: "10px",
                zIndex: 1000,
                animation: "fadeIn 0.5s ease",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}
            >
              {/* Checkmark/Success Icon */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.53125 15.3125L4.03125 10.8125L5.28125 9.5625L8.53125 12.8125L16.7188 4.625L17.9688 5.875L8.53125 15.3125Z"
                    fill="#4CAF50"
                  />
                </svg>
              </Box>
              <Typography variant="body1" sx={{ fontSize: "13px" }}>
                {popupMessage}
              </Typography>
            </Box>
          )}

          {/* Add keyframes for fade-in animation */}
          <style jsx>{`
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`}</style>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          open={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
        />
      </Mobile>
    </div>
  );
};

export default Notification;