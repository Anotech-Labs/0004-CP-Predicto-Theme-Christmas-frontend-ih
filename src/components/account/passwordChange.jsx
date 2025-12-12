import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Mobile from "../layout/Mobile";
// MUI Components
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormLabel from "@mui/material/FormLabel";
import { UserContext } from "../../context/UserState";
// MUI Icons
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"; 
import { useAuth } from "../../context/AuthContext";
import { domain } from "../../utils/Secret";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
const PasswordChange = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { axiosInstance } = useAuth();
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  //   const handleRedirect = () => {
  //     navigate(-1);
  //   };

  const isChangeButtonActive =
    currentPassword.trim() !== "" &&
    newPassword.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    newPassword === confirmPassword;

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    // //console.log(userData)
    // if (currentPassword !== userData.plainPassword) {
    //     alert("current password is wrong");
    //     return;
    //   }
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage("New password cannot be same as current password");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      const response = await axiosInstance.patch(
        `${domain}/api/account/v1/profile/users/${userData.uid}/password`,
        {
          currentPassword,
          newPassword,
          confirmNewPassword: confirmPassword,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setPopupMessage("Password changed successfully!");
        setIsPopupVisible(true);
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
        setNewPassword("")
        setConfirmPassword("")
        setCurrentPassword("")
        // navigate(-1);
      }
    } catch (error) {
      console.error("Full error object:", error);
      if (error.response && error.response.status === 500) {
        setErrorMessage("Current password is incorrect.");
      } else {
        setErrorMessage("Failed to change password. Please try again.");
      }
      
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <Mobile>
      <Box sx={{ bgcolor: "#232626", minHeight: "100vh" }}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "#232626",
            padding: "4px 8px",
            color: "#FDE4BC",
          }}
        >
          <Grid item container alignItems="center" justifyContent="center">
            <Grid item xs={2}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{ color: "#FDE4BC", ml: -5 }}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: "20px" }} />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <Typography
                variant="h6"
                sx={{
                  color: "#FDE4BC",
                  flexGrow: 1,
                  fontSize: "19px",
                  textAlign: "center",
                  mr: 8,
                }}
              >
                Change login password
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          container
          justifyContent="flex-start"
          alignItems="flex-start"
          sx={{
            backgroundColor: "#232626",
            pl: "23px",
            pr: "23px",
            color: "white",
            minHeight: "fit-content",
          }}
        >
          <Grid item xs={12} sx={{ mb: 1 }}>
            <form onSubmit={handlePasswordChange} autoComplete="off">
              <Box display="flex" alignItems="center" mt={4}>
                <Box
                  component="img"
                  src="/assets/login/passwordIcon.svg"
                  alt=""
                  sx={{ width: "22px", height: "20px" }}
                />
                <FormLabel sx={{ marginLeft: "5px", color: "#FDE4BC" }}>
                  Login password
                </FormLabel>
              </Box>
              <TextField
                placeholder="Login password"
                type={showCurrentPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                autoComplete="new-password"
                margin="normal"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                sx={{
                  width: "98%",
                  backgroundColor: "#323738",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": {
                    height: "46px",
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "transparent",
                    },
                    "&.Mui-focused fieldset": {
                      borderWidth: "0.1px",
                      borderColor: "#454037 !important",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#FDE4BC",
                    fontSize: "15px",
                  },
                }}
                InputProps={{
                  style: { borderRadius: "10px", color: "#FDE4BC" },
                  endAdornment: (
                    <IconButton
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      edge="end"
                      sx={{ color: "#c3c3c3" }}
                    >
                      <Box
                        component="img"
                        src={`/assets/icons/eye${
                          showCurrentPassword ? "Visible" : "Invisible"
                        }.webp`}
                        alt=""
                        sx={{ width: "23px" }}
                      />
                    </IconButton>
                  ),
                }}
              />

              <Box display="flex" alignItems="center" mt={3}>
                <Box
                  component="img"
                  src="/assets/login/passwordIcon.svg"
                  alt=""
                  sx={{ width: "22px", height: "20px" }}
                />
                <FormLabel sx={{ marginLeft: "5px", color: "#FDE4BC" }}>
                  New login password
                </FormLabel>
              </Box>
              <TextField
                placeholder=" New login password"
                type={showNewPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                margin="normal"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{
                  width: "98%",
                  backgroundColor: "#323738",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": {
                    height: "46px",
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "transparent",
                    },
                    "&.Mui-focused fieldset": {
                      borderWidth: "0.1px",
                      borderColor: "#454037 !important",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#FDE4BC",
                    fontSize: "15px",
                  },
                }}
                InputProps={{
                  style: { borderRadius: "10px", color: "#6e7167" },
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                      sx={{ color: "#c3c3c3" }}
                    >
                      <Box
                        component="img"
                        src={`/assets/icons/eye${
                          showNewPassword ? "Visible" : "Invisible"
                        }.webp`}
                        alt=""
                        sx={{ width: "23px" }}
                      />
                    </IconButton>
                  ),
                }}
              />

              <Box display="flex" alignItems="center" mt={3}>
                <Box
                  component="img"
                  src="/assets/login/passwordIcon.svg"
                  alt=""
                  sx={{ width: "22px", height: "20px" }}
                />
                <FormLabel sx={{ marginLeft: "5px", color: "#FDE4BC" }}>
                  Confirm new password
                </FormLabel>
              </Box>
              <TextField
                placeholder="Confirm new password"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                margin="normal"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{
                  width: "98%",
                  backgroundColor: "#323738",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": {
                    height: "46px",
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "transparent",
                    },
                    "&.Mui-focused fieldset": {
                      borderWidth: "0.1px",
                      borderColor: "#454037 !important",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#FDE4BC",
                    fontSize: "15px",
                  },
                }}
                InputProps={{
                  style: { borderRadius: "10px", color: "#6e7167" },
                  endAdornment: (
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                      sx={{ color: "#c3c3c3" }}
                    >
                      <Box
                        component="img"
                        src={`/assets/icons/eye${
                          showConfirmPassword ? "Visible" : "Invisible"
                        }.webp`}
                        alt=""
                        sx={{ width: "23px" }}
                      />
                    </IconButton>
                  ),
                }}
              />

              {errorMessage && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {errorMessage}
                </Typography>
              )}
  <Box display="flex" alignItems="center" justifyContent="right"mt={1}>
                
                <Typography sx={{  color: "#B79C8B", fontSize: "13.8px" ,cursor:"pointer"}}>
                  Forgot original login password 
                </Typography>
                <ArrowForwardIosIcon sx={{color: "#B79C8B",fontSize: "13.8px",cursor:"pointer"}}/>
              </Box>
              <Button
                variant="contained"
                fullWidth
                type="submit"
                // disabled={!isChangeButtonActive}
                style={{
                  marginTop: "70px",
                  background: isChangeButtonActive
                    ? "linear-gradient(90deg,#24ee89,#9fe871)"
                    : "#454456",
                  borderRadius: "300px",
                  color: isChangeButtonActive ? "#221f2e" : "#a8a5a1",
                  fontWeight: "bold",
                  fontSize: "19px",
                  width: "87%",
                  textTransform: "none",
                  height: "42px",
                }}
              >
                Save changes
              </Button>

              <Box sx={{ height: "20px" }} />
            </form>
          </Grid>
        </Grid>
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
      </Box>
    </Mobile>
  );
};

export default PasswordChange;
