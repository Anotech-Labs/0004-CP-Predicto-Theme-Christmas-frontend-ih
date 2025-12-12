import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import CheckIcon from "@mui/icons-material/Close";
import Mobile from "../../components/layout/Mobile";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { domain } from "../../utils/Secret";
import { Divider } from "@mui/material";

// Background with Image and Gradient
const ImageBackground = styled(Box)({
  position: "relative",
  backgroundImage: `url("/assets/activity/invitation.png"), linear-gradient(94deg,#f99937 2.72%,#ff6922 43.54%,#ff8039 98.54%)`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "16px",
  zIndex: 1,
  color: "white",
  height: "150px",

  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url("../assets/invitation_bg.webp")',
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    opacity: 1,
    zIndex: 1,
  },
});

const DashedDivider = () => (
  <Box
    sx={{
      border: "none",
      position: "relative",
      width: "calc(100% - 1.14667rem)",
      margin: "0.48rem auto",
      padding: "0 0.13333rem",
      "&::after, &::before": {
        content: '""',
        display: "block",
        borderRadius: "50%",
        backgroundColor: "#232626",
        // backgroundColor: 'var(--bg_color_L1, #f6f6f6)',
        position: "absolute",
        width: "1.2rem",
        height: "1.2rem",
        top: "-0.5rem",
      },
      "&::before": {
        right: -15,
      },
      "&::after": {
        left: -15,
      },
      "& hr": {
        margin: 0,
        border: "none",
        // borderTop: '0.01333rem dashed var(--Dividing-line_color, #f0f0f0)',
        borderTop: "0.01333rem dashed #666462",
        width: "98%",
        position: "absolute",
        top: 0,
      },
    }}
  >
    <hr />
  </Box>
);
const InvitationBonus = () => {
  const navigate = useNavigate();
  const [isDataFetching, setIsDataFetching] = useState(true);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [claimedBonuses, setClaimedBonuses] = useState({});
  const { axiosInstance } = useAuth();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchEligibilityStatus = async (ruleId = null) => {
    try {
      setIsDataFetching(true);

      const response = await axiosInstance.get(
        `${domain}/api/activity/invitation-bonus/eligibility`,
        {
          withCredentials: true,
        }
      );

      const responseData = response.data?.data?.data;

      if (!responseData || !Array.isArray(responseData.tasks)) {
        throw new Error("Invalid data format received from server");
      }

      let updatedTasks = responseData.tasks;

      if (ruleId) {
        updatedTasks = updatedTasks.map((task) =>
          task.ruleId === ruleId
            ? {
                ...task,
                status: {
                  ...task.status,
                  isClaimed: true,
                  message: "Bonus claimed successfully!",
                },
              }
            : task
        );
      }

      const transformedData = {
        ...responseData,
        tasks: updatedTasks.map((task, index) => ({
          ruleId: task.ruleId,
          bonusAmount: task.bonusAmount,
          progress: task.progress,
          status: {
            ...task.status,
            displayLevel: ` ${index + 1}`,
          },
        })),
        bonusDetails: updatedTasks.map((task, index) => ({
          ruleId: task.ruleId, // Explicitly include ruleId in bonusDetails
          displayLevel: ` ${index + 1}`,
          bonusAmount: task.bonusAmount,
          level: task.progress.referrals.required,
          minDepositAmount: task.progress.deposits.minAmount,
          progress: {
            referrals: {
              current: task.progress.referrals.current,
              required: task.progress.referrals.required,
              qualifying: task.progress.deposits.current,
            },
            deposits: task.progress.deposits,
          },
          achieved: task.status.isClaimed,
          status: task.status, // Include the full status object
        })),
      };

      setEligibilityData(transformedData);
      setErrorMessage(null);
    } catch (error) {
      console.error("Error in fetchEligibilityStatus:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to fetch eligibility status. Please try again."
      );
      setSnackbar({
        open: true,
        message: "Failed to fetch or claim the bonus.",
        severity: "error",
      });
    } finally {
      setIsDataFetching(false);
    }
  };

  // useEffect(() => {
  //   //console.log("Component mounted - initiating data fetch");
  //   fetchEligibilityStatus();
  // }, []);

  const handleClaimBonus = async (ruleId) => {
    try {
      if (!ruleId) {
        throw new Error("Task ID is required for claiming bonus");
      }

      //console.log(`Claiming bonus for taskId: ${ruleId}`);

      // Make claim API call with taskId
      const claimResponse = await axiosInstance.post(
        `${domain}/api/activity/invitation-bonus/claim`,
        {
          taskId: ruleId,
        },
        {
          withCredentials: true,
        }
      );

      const claimData = claimResponse.data?.data;

      if (claimData?.success) {
        // Show success snackbar
        setSnackbar({
          open: true,
          message: "Bonus Claimed successfully",
          severity: "success",
          autoHideDuration: 3000,
        });

        // Fetch updated eligibility status
        await fetchEligibilityStatus(ruleId);
      } else {
        throw new Error(claimData?.message || "Failed to claim bonus");
      }
    } catch (error) {
      console.error("Error claiming bonus:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to claim the bonus. Please try again.",
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  };
  const handleBackClick = () => {
    navigate(-1);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const getBonusStatus = (bonus) => {
    //console.log("Checking bonus status for:", bonus);

    // Check if bonus is already claimed
    if (bonus.achieved) {
      return {
        text: "Claimed",
        disabled: true,
        color: "#cdcfdd",
      };
    }

    // Check if bonus is eligible to be claimed
    const hasRequiredReferrals =
      bonus.progress.referrals.current >= bonus.progress.referrals.required;
    const hasRequiredDeposits =
      bonus.progress.deposits.current >= bonus.progress.deposits.required;

    if (hasRequiredReferrals && hasRequiredDeposits) {
      return {
        text: "Claim",
        disabled: false,
        color: "#5b73f5",
      };
    }

    // Default case: not eligible and not claimed
    return {
      text: "Unfinished",
      disabled: true,
      color: "#cdcfdd",
    };
  };

  useEffect(() => {
    fetchEligibilityStatus();
  }, []);

  if (errorMessage) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error" gutterBottom>
          {errorMessage}
        </Typography>
        <Button
          variant="contained"
          onClick={fetchEligibilityStatus}
          sx={{ bgcolor: "#1AB266" }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (isDataFetching || !eligibilityData) {
    return (
      <Mobile>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography>Loading invitation bonus details...</Typography>
        </Box>
      </Mobile>
    );
  }

  return (
    <Mobile>
      <Box
        sx={{
          bgcolor: "#232626",
          minHeight: "100vh",
          maxWidth: "sm",
          mx: "auto",
        }}
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
              <ArrowBackIosOutlinedIcon sx={{ fontSize: "19px" }} />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ color: "#FDE4BC", textAlign: "center", fontSize: "19px" }}
            >
              Invitation bonus
            </Typography>
          </Grid>
        </Grid>

        <ImageBackground>
          <Box sx={{ position: "relative", zIndex: 2, textAlign: "left" }}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="bold"
              sx={{ fontSize: "18px" }}
            >
              Invite friends and deposit
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "12px" }}>
              Both parties can receive rewards
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "12px" }}>
              Invite friends to register and recharge
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "12px" }}>
              to receive rewards
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, fontSize: "12px" }}>
              activity date:
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", color: "white" }}
            >
              2024-05-03 - End date is not declared
            </Typography>
          </Box>
        </ImageBackground>

        <Box
          sx={{
            p: 1,
            margin: 3,
            display: "flex",
            justifyContent: "space-around",
            background: "#382e35",
            borderRadius: "16px",
            marginTop: "-3%",
            zIndex: 10,
            position: "relative",
            gap: 2,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Invitation Reward Rules */}
          <Box
            onClick={() => navigate("/activity/invitation-reward-rules")}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: "50px",
                height: "50px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src="/assets/icons/inviterecord.svg"
                alt="Invitation Reward Rules"
                sx={{ width: "50px", height: "50px" }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "#B79C8B", fontWeight: "500" }}
            >
              Invitation reward rules
            </Typography>
          </Box>

          {/* Invitation Record */}
          <Box
            onClick={() => navigate("/activity/invitation-record")}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: "50px",
                height: "50px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src="/assets/icons/invitereward.svg"
                alt="Invitation Record"
                sx={{ width: "50px", height: "50px" }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "#B79C8B", fontWeight: "500" }}
            >
              Invitation record
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mx: 2, mb: 4 }}>
          {Array.isArray(eligibilityData.bonusDetails) &&
            eligibilityData.bonusDetails.map((bonus, index) => {
              const bonusStatus = getBonusStatus(bonus);
              return (
                <Box
                  key={index}
                  sx={{
                    width: "100%",
                    bgcolor: "#323738",
                    // bgcolor: 'var(--bg_color_L2, #fff)',
                    borderRadius: "10px",
                    my: "1rem",
                    pb: "0.46667rem",
                  }}
                >
                  {/* Head Section */}
                  <Box
                    sx={{
                      background: "#323738",
                      p: 0,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderRadius: "8px",
                    }}
                  >
                    {/* Left Section */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0,
                        borderRadius: ".71333rem 0 1rem",
                        background: "#17b15e",
                        p: 1,
                        color: "#fde4bc",
                        flex: 0.6,
                      }}
                    >
                      <Typography
                        component="span"
                        sx={{ fontSize: "12px", fontWeight: "400" }}
                      >
                        Bonus{" "}
                      </Typography>
                      <Box
                        sx={{
                          display: "inline-flex",
                          justifyContent: "center",
                          alignItems: "center",
                          bgcolor: "#fde4bc",
                          color: "#323738",
                          width: 19,
                          height: 19,
                          marginLeft: "7px",
                          borderRadius: "50%",
                          // boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Typography component="span" sx={{ fontSize: "12px" }}>
                          {bonus.displayLevel}
                        </Typography>
                      </Box>
                      <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        ml:5
                      }}>
                        <img src="/assets/icons/cross.svg" alt="" width="22px" />
                      </Box>
                    </Box>

                    {/* Right Section */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        marginRight: "12px",
                        flex: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13.8668px",
                          color: "#feaa57",
                          fontWeight: "700",
                          mt: 1,
                        }}
                      >
                        ₹{bonus.bonusAmount.toFixed(2)}
                      </Typography>
                      <Box
                        sx={{
                          width: "100%",
                          height: "1px",
                          backgroundColor: "#666462",
                          mt: 0.8,
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Details Section */}
                  <Box sx={{ p: 1.5, bgcolor: "#323738" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#343434",
                        mb: 1,
                        padding: 1,
                        borderRadius: "5px",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#FDE4BC",
                          fontSize: "12.8px",
                          fontWeight: "400",
                        }}
                      >
                        Number of invitees
                      </Typography>
                      <Typography
                        sx={{
                          color: "#FDE4BC",
                          fontSize: "14.9332px",
                          fontWeight: "400",
                        }}
                      >
                        {" "}
                        {bonus.level}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#343434",
                        mb: 1,
                        padding: 1,
                        borderRadius: "5px",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#FDE4BC",
                          fontSize: "12.8px",
                          fontWeight: "400",
                        }}
                      >
                        Recharge per people
                      </Typography>
                      <Typography
                        sx={{
                          color: "#FB5B5B",
                          fontSize: "14.9332px",
                          fontWeight: "400",
                        }}
                      >
                        ₹{bonus.minDepositAmount.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Divider */}
                  <DashedDivider />

                  {/* Task Section */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      bgcolor: "#323738",
                    }}
                  >
                    <Box sx={{ flex: 1, textAlign: "center" }}>
                      <Typography
                        sx={{
                          color: "#FEAA57",
                          fontWeight: 500,
                          mb: 0.5,
                          fontSize: "17.0668px",
                        }}
                      >
                        {bonus.progress.referrals.current} /{" "}
                        {bonus.progress.referrals.required}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#B79C8B",
                          fontSize: "12px",
                          fontWeight: 400,
                        }}
                      >
                        Number of invitees
                      </Typography>
                    </Box>

                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{
                        mx: 2,
                        bgcolor: "#666462",
                        width: "0.5px",
                        height: "50",
                      }}
                    />

                    <Box sx={{ flex: 1, textAlign: "center" }}>
                      <Typography
                        sx={{
                          color: "#FB5B5B",
                          fontWeight: 500,
                          mb: 0.5,
                          fontSize: "17.0668px",
                        }}
                      >
                        {bonus.progress.deposits.current} /{" "}
                        {bonus.progress.deposits.required}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#B79C8B",
                          fontSize: "12px",
                          fontWeight: 400,
                        }}
                      >
                        Deposit number
                      </Typography>
                    </Box>
                  </Box>

                  {/* Button */}
                  <Box sx={{ px: 2, mt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleClaimBonus(bonus.ruleId)}
                      disabled={bonusStatus.disabled}
                      sx={{
                        "&.Mui-disabled": {
                          background: "#5a5145",
                          border: "transparent",
                          color: "#FDE4BC",
                        },
                        background: "linear-gradient(180deg, #FED358, #FFB472)",
                        border: bonusStatus.disabled
                          ? "1px solid  grey"
                          : "1px solid #FED358",
                        color: bonusStatus.disabled ? "grey" : "#FED358",
                        boxShadow: "transparent",
                        // '&:hover': {
                        //   // background: bonusStatus.disabled ? '#343434' : 'linear-gradient(90deg,#24ee89,#9fe871)',
                        // },
                        textTransform: "none",
                        borderRadius: "20px",
                        py: 0.5,
                        fontWeight: 700,
                        fontSize: "16px",
                        transition: "background 0.3s ease",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "16px",
                          fontWeight: 700,
                          color: bonusStatus.disabled ? "#FDE4BC" : "#000000",
                        }}
                      >
                        {bonusStatus.text}
                      </Typography>
                    </Button>
                  </Box>
                  <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    sx={{
                      top: "50% !important",
                      left: "50% !important",
                      transform: "translate(-50%, -50%)",
                      width:"100%"
                    }}
                  >
                    <Alert
                      onClose={handleCloseSnackbar}
                      severity={snackbar.severity}
                      sx={{
                        // width: "100%",
                        backgroundColor: "#00000080",
                        color:"#ffffff",
                        "& .MuiAlert-icon": { color: "#FED358" },
                      }}
                    >
                      {snackbar.message}
                    </Alert>
                  </Snackbar>
                </Box>
              );
            })}
        </Box>
      </Box>
      <br />
          <br />
          <br />

    </Mobile>
  );
};

export default InvitationBonus;
