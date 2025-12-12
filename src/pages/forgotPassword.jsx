import { Checkbox, Box, FormLabel } from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import RadioGroup from "@mui/material/RadioGroup";
import Grid from "@mui/material/Grid";
import { domain } from "../utils/Secret";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
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
     <Grid
        container
        justifyContent="flex-start"
        alignItems="flex-start"
        direction="column"
        sx={{
          minHeight: "220px",
          backgroundImage: "url('/assets/login/login.webp')",
          backgroundPosition: "50%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Shadow Image */}
        <img
          src="/assets/login/shadow.webp"
          alt="Top Image"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "100%",
            height: "auto",
          }}
        />

        {/* Wrapper for logo + cross */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "120px",
          }}
        >
          {/* Logo */}
          <img
            src="/assets/logo/a_logo2.webp"
            alt="Overlay Logo"
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              width: "auto",
              height: "30px",
            }}
          />

          {/* CROSS BUTTON */}
          <Box
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              height: "2rem",
              width: "2rem",
              backgroundColor: "rgba(255,255,255,0.157)",
              color: "#b3bec1",
              borderRadius: "0.375rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              cursor: "pointer",
              zIndex: 20,
              userSelect: "none",
            }}
            onClick={() => navigate("/")}
          >
            x
          </Box>
        </Box>
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

      <Container
        disableGutters
        maxWidth="xs"
        sx={{
          background: "#242626",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ mx: 2 }}>
          {/* Phone Number Input */}
          <Box display="flex" alignItems="center" mt={1} mb={1.5}>
            <FormLabel sx={{ marginLeft: "6px", color: "#ffffff", fontSize: "12px", fontWeight: "400" }}>
              Phone number
            </FormLabel>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0, }}>
            <TextField
              select
              label=""
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              sx={{
                width: "100px",
                backgroundColor: "#242626",
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  // borderRadius: "8px 0 0 8px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#D3D3D3",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#D3D3D3",
                  },
                  "& fieldset": {
                    borderColor: "#D3D3D3",
                    borderRight: "none",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#ffffff",
                  fontSize: "15px",
                },
                "& .MuiInputLabel-root": {
                  color: "#768096",
                },
                "& .MuiSelect-icon": {
                  color: "#768096",
                },
              }}
              SelectProps={{
                IconComponent: KeyboardArrowDownRoundedIcon,
                renderValue: (selected) =>
                  countryCodes.find((item) => item.code === selected)?.code,

                MenuProps: {
                  PaperProps: {
                    sx: {
                      "& .MuiMenuItem-root": {
                        fontSize: "14px",
                        "&:hover": {
                          backgroundColor: "#242626",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#e3f2fd",
                          "&:hover": {
                            backgroundColor: "#bbdefb",
                          },
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
              type="tel"
              value={mobile}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only numbers and ensure max length of 10 digits
                if (/^\d{0,10}$/.test(value)) {
                  setMobile(value);
                }
              }}
              required
              sx={{
                flex: 1,
                backgroundColor: "transparent",
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  borderRadius: "0 8px 8px 0",
                  "& fieldset": {
                    borderColor: "#D3D3D3",
                    borderLeft: "none",
                  },
                  "&:hover fieldset": {
                    borderColor: "#D3D3D3",
                    borderLeft: "none",
                  },
                  "&.Mui-focused fieldset": {
                    borderWidth: "1px",
                    borderColor: "#D3D3D3",
                    borderLeft: "none",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#ffffff",
                  fontSize: "15px",
                },
                "& .MuiInputBase-input::placeholder": {
                  fontWeight: "400",
                  color: "#999",
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* Verification Code */}
          <Box display="flex" alignItems="center" mt={2.5} mb={1.5} >
            <FormLabel sx={{ marginLeft: "6px", color: "#ffffff", fontSize: "12px", fontWeight: "400" }}>
              Verification code
            </FormLabel>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Please enter the confirmation code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            sx={{
              flex: 1,
              backgroundColor: "transparent",
              "& .MuiOutlinedInput-root": {
                height: "40px",
                borderRadius: "1px",
                "& fieldset": {
                  borderColor: "#D3D3D3",
                },
                "&:hover fieldset": {
                  borderColor: "#D3D3D3",
                },
                "&.Mui-focused fieldset": {
                  borderWidth: "1px",
                  borderColor: "#D3D3D3",
                },
              },
              "& .MuiInputBase-input": {
                color: "#ffffff",
                fontSize: "15px",
              },
              "& .MuiInputBase-input::placeholder": {
                fontWeight: "400",
                color: "#999",
                opacity: 1,
              },
            }}
            InputProps={{
              style: { borderRadius: "1px", color: "#ffffff" },
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={!otpSent ? handleSendOTP : handleVerifyOTP}
                    disabled={!mobile || isVerifyButtonDisabled}
                    sx={{
                      background: isVerifyButtonDisabled
                        ? "linear-gradient(180deg,#24ee89,#9fe871)"
                        : "linear-gradient(180deg,#24ee89,#9fe871)",
                      color: "#000",
                      borderRadius: "4px",
                      textTransform: "capitalize",
                      px: 3,
                      py: 0.4,
                      "&:hover": {
                        background: isVerifyButtonDisabled
                          ? "linear-gradient(180deg,#24ee89,#9fe871)"
                          : "linear-gradient(180deg,#24ee89,#9fe871)",
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
              <Box display="flex" alignItems="center" mt={3} mb={1}>
                <Box
                  component="img"
                  src="../assets/login/lock_black.webp"
                  alt=""
                  sx={{ width: "20px" }}
                />
                <FormLabel sx={{ marginLeft: "6px", color: "#ffffff", fontSize: "12px", fontWeight: "400" }}>
                  New password
                </FormLabel>
              </Box>

              <TextField
                fullWidth
                variant="outlined"
                type={showPassword.newPassword ? "text" : "password"}
                placeholder="A new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{
                  flex: 1,
                  backgroundColor: "transparent",
                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                    borderRadius: "1px",
                    "& fieldset": {
                      borderColor: "#D3D3D3",
                    },
                    "&:hover fieldset": {
                      borderColor: "#D3D3D3",
                    },
                    "&.Mui-focused fieldset": {
                      borderWidth: "1px",
                      borderColor: "#D3D3D3",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#ffffff",
                    fontSize: "15px",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    fontWeight: "400",
                    color: "#999",
                    opacity: 1,
                  },
                }}
                InputProps={{
                  style: { borderRadius: "10px", color: "#ffffff" },
                  endAdornment: (
                    <InputAdornment
                      edge="end"
                      onClick={toggleNewPasswordVisibility}
                      sx={{ cursor: "pointer", color: "#c3c3c3", alignItems: "center" }}
                    >
                      {showPassword.newPassword ? (
                        <RemoveRedEyeOutlinedIcon />
                      ) : (
                        <VisibilityOffOutlinedIcon />
                      )}
                    </InputAdornment>
                  ),
                }}
              />

              <Box display="flex" alignItems="center" mt={3} mb={1}>
                <Box
                  component="img"
                  src="../assets/login/lock_black.webp"
                  alt=""
                  sx={{ width: "20px" }}
                />
                <FormLabel sx={{ marginLeft: "6px", color: "#ffffff", fontSize: "12px", fontWeight: "400" }}>
                  Confirm password
                </FormLabel>
              </Box>

              <TextField
                fullWidth
                variant="outlined"
                type={showPassword.confirmNewPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                sx={{
                  flex: 1,
                  backgroundColor: "transparent",
                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                    borderRadius: "1px",
                    "& fieldset": {
                      borderColor: "#D3D3D3",
                    },
                    "&:hover fieldset": {
                      borderColor: "#D3D3D3",
                    },
                    "&.Mui-focused fieldset": {
                      borderWidth: "1px",
                      borderColor: "#D3D3D3",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#ffffff",
                    fontSize: "15px",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    fontWeight: "400",
                    color: "#999",
                    opacity: 1,
                  },
                }}
                InputProps={{
                  style: { borderRadius: "10px", color: "#ffffff" },
                  endAdornment: (
                    <InputAdornment
                      edge="end"
                      onClick={toggleConfirmNewPasswordVisibility}
                      sx={{ cursor: "pointer", color: "#c3c3c3", alignItems: "center" }}
                    >
                      {showPassword.confirmNewPassword ? (
                        <RemoveRedEyeOutlinedIcon />
                      ) : (
                        <VisibilityOffOutlinedIcon />
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
                    <Checkbox
                      checked={isChecked}
                      onClick={handleToggle}
                      icon={
                        <RadioButtonUncheckedIcon
                          sx={{
                            color: "#c8c9cc", // Unchecked color
                            fontSize: 22, // Adjust size
                          }}
                        />
                      }
                      checkedIcon={
                        <CheckCircleIcon
                          sx={{
                            color: "#24ee89", // Checked color
                            fontSize: 22, // Slightly bigger for effect
                          }}
                        />
                      }
                    />
                  }
                  label={
                    <Typography sx={{ color: "#768096", fontSize: 13 }}>
                      I have read and agree <span style={{ color: "#24ee89" }}>【Privacy Agreement】</span>
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
                    "linear-gradient(180deg,#24ee89,#9fe871)",
                  borderRadius: "2px",
                  width: "85%",
                  height: "43px",
                  textTransform: "none",
                }}
                sx={{
                  fontWeight: "bold",
                  marginBottom: "20px",
                  marginTop: "18px",
                  color: "#ffffff",
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