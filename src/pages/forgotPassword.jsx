import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Radio from "@mui/material/Radio";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import RadioGroup from "@mui/material/RadioGroup";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { domain } from "../utils/Secret";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import FlagIcon from "@mui/icons-material/Flag";
import LockIcon from "@mui/icons-material/Lock";

import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import SendToMobileIcon from "@mui/icons-material/SendToMobile";
import GppGoodIcon from "@mui/icons-material/GppGood";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Mobile from "../components/layout/Mobile";
import axios from "axios";

const countryCodes = [{ code: "+91", country: "India" }];

const ForgotPassword = () => {
  const navigate = useNavigate();

  // State management
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [isChecked, setIsChecked] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isVerifyButtonDisabled, setIsVerifyButtonDisabled] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen2 = useMediaQuery(theme.breakpoints.down('400'));
  // Snackbar states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Password visibility states
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmNewPassword: false,
  });
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // Other states
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [tabValue, setTabValue] = useState(0);

  // Handlers
  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setOpenDrawer(false);
  };
  const handleRedirect = () => navigate("-1");
  const handleToggle = () => setIsChecked(!isChecked);

  // Snackbar handlers
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Password visibility toggles
  const toggleNewPasswordVisibility = () => {
    setShowPassword((prev) => ({
      ...prev,
      newPassword: !prev.newPassword,
    }));
  };
  const toggleConfirmNewPasswordVisibility = () => {
    setShowPassword((prev) => ({
      ...prev,
      confirmNewPassword: !prev.confirmNewPassword,
    }));
  };

  // API Call: Send OTP
  const handleSendOTP = async () => {
    if (!mobile) {
      showSnackbar("Please enter a mobile number", "error");
      return;
    }

    try {
      const response = await axios.post(
        `${domain}/api/additional/forgot-password/send-otp`,
        { phoneNumber: `${mobile}` }
      );

      if (response.data.success) {
        showSnackbar("OTP sent successfully", "success");
        setOtpSent(true);
      }
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to send OTP",
        "error"
      );
    }
  };

  // API Call: Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp) {
      showSnackbar("Please enter the OTP", "error");
      return;
    }

    try {
      const response = await axios.post(
        `${domain}/api/additional/forgot-password/verify-otp`,
        { otp }
      );

      if (response.data.message === "OTP verified successfully") {
        showSnackbar("OTP verified successfully", "success");
        setOtpVerified(true);
        setIsVerifyButtonDisabled(true);
      }
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "OTP verification failed",
        "error"
      );
    }
  };
  // API Call: Reset Password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      showSnackbar("Please enter both passwords", "error");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showSnackbar("Passwords do not match", "error");
      return;
    }

    if (!isChecked) {
      showSnackbar("Please agree to the privacy agreement", "error");
      return;
    }

    try {
      const response = await axios.post(
        `${domain}/api/additional/forgot-password/forgot-password`,
        { newPassword }
      );

      if (response.data.message === "Password reset successfully") {
        showSnackbar("Password reset successfully", "success");
        navigate("/login");
      }
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Password reset failed",
        "error"
      );
    }
  };

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
      }, 3000); // Auto-close after 3 seconds
  
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);
  return (
    <Mobile>
      {/* Header Grid - Unchanged */}
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "#110d14",
          px: "2px",
          height: "50px",
          // py: "2px",
          color: "black",
        }}
      >
        <Grid item xs={4} textAlign="left">
          <IconButton sx={{ color: "white" }} onClick={() => navigate(-1)}>
            <ArrowBackIosNewIcon sx={{ fontSize: "20px" }} />
          </IconButton>
        </Grid>
        <Grid item xs={4} textAlign="center">
          <img
            src="assets/logo/colorLogo.webp"
            alt="logo"
            style={{ width: "115px" }}
          />
        </Grid>
        <Grid item xs={4} sx={{display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
          <img
            src="assets/icons/english.webp"
            alt="logo"
            style={{ width: "25px", marginRight: "8px" }}
          />
          <Typography sx={{fontSize:"16px",color:"#FED358",marginRight: "13px" }}>EN</Typography>
        </Grid>
      </Grid>


      {/* Title Grid - Unchanged */}
      <Grid
        container
        justifyContent="flex-start"
        alignItems="flex-start"
        sx={{
          background:
            "linear-gradient(180deg, #FED358 , #FFB472 ),#241e22",
          px: "16px",
          pt: "10px",
          pb: "25px",
          color: "white",
          minHeight: "fit-content",
        }}
        direction="column"
      >
        <Typography variant="h7" sx={{ fontWeight: "bold", fontSize: "17px" }}>
          Forgot password
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontSize: "12px",
            pt: "9px",
            textAlign: "left",
            lineHeight: 1.2,
          }}
        >
          Please retrieve/change your password through your mobile phone number
        </Typography>
      </Grid>

      {/* <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar> */}

      {/* Tabs - Unchanged */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Grid
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "90%",
            borderBottom: "2px solid #FED358",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            TabIndicatorProps={{
              style: {
                backgroundColor: tabValue === 0 ? "transparent" : "transparent",
              },
            }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Tab
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "16px",
              }}
              icon={
                <Box
                  component="img"
                  src="../assets/login/phonenumber.svg"
                  alt=""
                  sx={{ width: "16px", height: "auto" }}
                />
              }
              label="phone reset"
              style={{ color: tabValue === 0 ? "#FED358" : "grey" }}
            />
          </Tabs>
        </Grid>
      </Box>

      <Container
        disableGutters
        maxWidth="xs"
        sx={{
          background: "#110d14",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ mx: 2, mt: 1 }}>
          {/* Phone Number Input */}
          <Box sx={{ display: "flex", mb: 1 }}>
            <Box
              component="img"
              src="/assets/login/phonenumber.svg"
              alt=""
              sx={{ width: "16px", marginRight: "5px" }}
            />
            <Typography variant="body2" sx={{ color: "#FDE4BC", fontSize: 17 }}>
              Phone number
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              select
              label=""
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              sx={{
                width: "100px",
                background: "#241e22",
                marginBottom: -1,
                borderRadius: "10px",
                "& .MuiOutlinedInput-root": {
                  marginRight: "15px",
                  height: "46px",
                  lineHeight: "1.5",
                  "&.Mui-focused fieldset": {
                    borderColor: "#454037",
                  },
                  "&:hover fieldset": {
                    borderColor: "#454037",
                  },
                  "& fieldset": {
                    borderColor: "#454037",
                    border: "none",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#a8a5a1",
                  textOverflow: "clip",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                },
                "& .MuiInputLabel-root": {
                  color: "#a8a5a1",
                },
                "& .MuiSelect-icon": {
                  color: "#a8a5a1",
                  marginRight: "4px",
                },
              }}
              InputLabelProps={{
                style: { color: "#fff" },
              }}
              SelectProps={{
                IconComponent: KeyboardArrowDownRoundedIcon,
                renderValue: (selected) =>
                  countryCodes.find((item) => item.code === selected)?.code,
                MenuProps: {
                  PaperProps: {
                    sx: {
                      color: "#FDE4BC",
                      background: "#FED358",
                      "& .MuiMenuItem-root": {
                        background: "#FED358",
                        "&:hover": {
                          background: "#FED358",
                        },
                      },
                    },
                  },
                },
              }}
            >
              {countryCodes.map((item) => (
                <MenuItem key={item.code} value={item.code}>
                  {item.code} {item.country}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              placeholder="Please enter the phone number"
              fullWidth
              variant="outlined"
              autoComplete="off"
              autoFocus={false}
              margin="normal"
              type="tel"
              value={mobile}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  setMobile(value);
                }
              }}
              required
              sx={{
                width: "80%",
                backgroundColor: "#241e22",
                borderRadius: "10px",
                "& .MuiOutlinedInput-root": {
                  height: "46px", // Smaller TextField size
                  "& fieldset": {
                    borderColor: "transparent", // Lighter border color
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent", // Slightly lighter on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderWidth: "0.1px",
                    borderColor: "#454037 !important", // Focused border color
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#FDE4BC",
                  fontSize: "15px", // Slightly smaller text size
                },
                "& .MuiInputBase-input::placeholder": {
                  fontWeight: "300",
                  color: "#FDE4BC !important", // Placeholder color
                },
              }}
              InputProps={{
                style: { borderRadius: "10px", color: "#6e7167" },
              }}
            />
          </Box>

          {/* Verification Code */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1, mt: 2 }}>
            <GppGoodIcon sx={{ mr: 1, color: "#FED358" }} />
            <Typography variant="body2" sx={{ color: "#FDE4BC", fontSize: 17 }}>
              Verification Code
            </Typography>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Please enter the confirmation code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            sx={{
              backgroundColor: "#241e22",
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                height: "46px", // Smaller TextField size
                "& fieldset": {
                  borderColor: "transparent", // Lighter border color
                },
                "&:hover fieldset": {
                  borderColor: "transparent", // Slightly lighter on hover
                },
                "&.Mui-focused fieldset": {
                  borderWidth: "0.1px",
                  borderColor: "#454037 !important", // Focused border color
                },
              },
              "& .MuiInputBase-input": {
                color: "#FDE4BC",
                fontSize: "15px", // Slightly smaller text size
              },
              "& .MuiInputBase-input::placeholder": {
                fontWeight: "300",
                color: "#FDE4BC !important", // Placeholder color
              },
            }}
            InputProps={{
              style: { borderRadius: "10px", color: "#6e7167" },
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={!otpSent ? handleSendOTP : handleVerifyOTP}
                    disabled={!mobile || isVerifyButtonDisabled}
                    sx={{
                      background: isVerifyButtonDisabled
                        ? "linear-gradient(90deg, #A0A0A0 0%, #808080 100%)"
                        : "linear-gradient(180deg, #FED358 , #FFB472 )",
                      color: "#FDE4BC",
                      borderRadius: 50,
                      textTransform: "capitalize",
                      px: 3,
                      py: 0.4,
                      "&:hover": {
                        background: isVerifyButtonDisabled
                          ? "linear-gradient(90deg, #A0A0A0 0%, #808080 100%)"
                          : "linear-gradient(180deg, #FED358 , #FFB472 )",
                      },
                    }}
                  >
                    {isVerifyButtonDisabled
                      ? "Verified"
                      : !otpSent
                        ? "Send"
                        : "Verify"}
                  </Button>
                </InputAdornment>
              ),
            }}
          />

          {/* New Password Section (Only show when OTP is verified) */}
          {otpVerified && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, mt: 3 }}>
                <Box
                  component="img"
                  src="../assets/icons/passwordIcon.svg"
                  alt=""
                  sx={{ width: "20px", marginRight: "5px" }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "#FDE4BC", fontSize: 17 }}
                >
                  Enter new password
                </Typography>
              </Box>

              <TextField
                fullWidth
                variant="outlined"
                type={showPassword.newPassword ? "text" : "password"}
                placeholder="A new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{
                  backgroundColor: "#241e22",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": {
                    height: "47.5px", // Smaller TextField size
                    "& fieldset": {
                      borderColor: "transparent", // Lighter border color
                    },
                    "&:hover fieldset": {
                      borderColor: "transparent", // Slightly lighter on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderWidth: "0.1px",
                      borderColor: "#666255 !important", // Focused border color
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#FDE4BC",
                    fontSize: "15px", // Slightly smaller text size
                  },
                }}
                InputProps={{
                  style: { borderRadius: "10px", color: "#6e7167" },
                  endAdornment: (
                    <InputAdornment
                    edge="end"
                      onClick={toggleNewPasswordVisibility}
                      sx={{ cursor: "pointer", color: "#c3c3c3", alignItems: "center" }}
                    >
                      {showPassword.newPassword ? (
                        <VisibilityOffOutlinedIcon />
                      ) : (
                        <RemoveRedEyeOutlinedIcon />
                      )}
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: "flex", alignItems: "center", mb: 1, mt: 2 }}>
                <Box
                  component="img"
                  src="../assets/icons/passwordIcon.svg"
                  alt=""
                  sx={{ width: "20px", marginRight: "5px" }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "#FDE4BC", fontSize: 17 }}
                >
                  Confirm new password
                </Typography>
              </Box>

              <TextField
                fullWidth
                variant="outlined"
                type={showPassword.confirmNewPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                sx={{
                  // width: "96%",
                  backgroundColor: "#241e22",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": {
                    height: "47.5px", // Smaller TextField size
                    "& fieldset": {
                      borderColor: "transparent", // Lighter border color
                    },
                    "&:hover fieldset": {
                      borderColor: "transparent", // Slightly lighter on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderWidth: "0.1px",
                      borderColor: "#666255 !important", // Focused border color
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#FDE4BC",
                    fontSize: "15px", // Slightly smaller text size
                  },
                }}
                InputProps={{
                  style: { borderRadius: "10px", color: "#6e7167" },
                  endAdornment: (
                    <InputAdornment
                       edge="end"
                      onClick={toggleConfirmNewPasswordVisibility}
                      sx={{ cursor: "pointer",color: "#c3c3c3", alignItems: "center" }}
                    >
                      {showPassword.confirmNewPassword ? (
                        <VisibilityOffOutlinedIcon />
                      ) : (
                        <RemoveRedEyeOutlinedIcon />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}

          {/* Privacy Agreement and Reset Button */}
          <Box sx={{ display: "flex", flexDirection: "column", mt: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                margin: "2px 0 10px",
              }}
            >
              <RadioGroup row>
                <FormControlLabel
                  value="remember"
                  control={
                    <Radio
                      checked={isChecked}
                      onClick={handleToggle}
                      icon={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 18.2,
                            height: 18.2,
                            border: "1.5px solid #c8c9cc",
                            borderRadius: "50%",
                          }}
                        />
                      }
                      checkedIcon={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: "transparent",
                          }}
                        >
                          <img
                            src="/assets/login/rememberme.svg"
                            alt="Checked"
                            style={{ width: "100%", height: "auto" }}
                          />
                        </Box>
                      }
                    />
                  }
                  label={
                    <Typography sx={{ color: "#B79C8B", fontSize: 13 }}>
                      I have read and agree <span style={{ color: "#D23838" }}>【Privacy Agreement】</span>
                    </Typography>
                  }
                />
              </RadioGroup>
            </Box>

            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                onClick={handleResetPassword}
                disabled={!otpVerified || !isChecked}
                style={{
                  background:
                    "linear-gradient(180deg, #FED358 , #FFB472 ),#241e22",
                  borderRadius: "360px",
                  width: "85%",
                  height: "43px",
                  textTransform: "none",
                }}
                sx={{
                  fontWeight: "bold",
                  marginBottom: "20px",
                  marginTop: "18px",
                  color: "#221f2e",
                  fontSize: "19px", // Replace with the desired royal gold color if different
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Box>
        <div>
          {/* Your existing component code */}

          {/* Popup Notification */}
          {snackbar.open && (
            <Box
              sx={{
                position: "fixed",
                top: "50%",
                left: "50%",
                ...(isSmallScreen && { width: "70%" }),
                transform: "translate(-50%, -50%)",
                bgcolor: "rgba(0, 0, 0, 0.9)",
                color: "#FDE4BC",
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
                {snackbar.severity === "success" ? (
                  // Success Icon
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
                ) : (
                  // Error Icon
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 0.6875C5.15625 0.6875 0.6875 5.15625 0.6875 11C0.6875 16.8438 5.15625 21.3125 11 21.3125C16.8438 21.3125 21.3125 16.8438 21.3125 11C21.3125 5.15625 16.8438 0.6875 11 0.6875ZM11 19.3125C6.1875 19.3125 2.6875 15.8125 2.6875 11C2.6875 6.1875 6.1875 2.6875 11 2.6875C15.8125 2.6875 19.3125 6.1875 19.3125 11C19.3125 15.8125 15.8125 19.3125 11 19.3125ZM11 6.6875C10.5625 6.6875 10.1875 7.0625 10.1875 7.5V11C10.1875 11.4375 10.5625 11.8125 11 11.8125C11.4375 11.8125 11.8125 11.4375 11.8125 11V7.5C11.8125 7.0625 11.4375 6.6875 11 6.6875ZM11 14.1875C10.5625 14.1875 10.1875 14.5625 10.1875 15C10.1875 15.4375 10.5625 15.8125 11 15.8125C11.4375 15.8125 11.8125 15.4375 11.8125 15C11.8125 14.5625 11.4375 14.1875 11 14.1875Z"
                      fill="#F44336"
                    />
                  </svg>
                )}
              </Box>
              <Typography variant="body1" sx={{ fontSize: "13px" }}>
                {snackbar.message}
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
      </Container>

    </Mobile>
  );
};

export default ForgotPassword;
