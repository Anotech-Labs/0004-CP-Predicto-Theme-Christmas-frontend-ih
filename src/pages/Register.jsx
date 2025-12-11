import React, { useState, useEffect } from "react";

// Custom Components
import Mobile from "../components/layout/Mobile";
import { domain } from "../utils/Secret";

// MUI Core Components
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
// MUI Icons
// import TranslateIcon from "@mui/icons-material/Translate";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import SendToMobileIcon from "@mui/icons-material/SendToMobile";
// import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

// Other Libraries
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ErrorPopup from "../components/popups/ErrorPopup";

const countryCodes = [{ code: "+91", country: "India" }];

const Register = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleShowPassword = () => setShowPassword(!showPassword);

  const [isChecked, setIsChecked] = useState(false);

  // Radio button handler
  const handleToggle = () => {
    setIsChecked(!isChecked); // Toggle state on click
  };

  const [countryCode, setCountryCode] = useState("+91");

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialInviteCode = query.get("invitecode");

  const [invitecode, setInviteCode] = useState(initialInviteCode || "");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    if (!isChecked) {
      setError("Please agree to the Privacy Agreement to continue.");
      return;
    }
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, include one letter, one number, and one special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const mobileNumber = parseInt(mobile, 10);

      const response = await axios.post(`${domain}/api/user/register`, {
        mobile: mobileNumber,
        password,
        inviteCode: invitecode,
      });

      if (response.data.success) {
        login(response.data.data.tokens.accessToken, response.data.data.tokens.refreshToken)
        navigate("/");
      } else {
        setError(response.data.message || "Registration failed.");
        setErrorMessage(response.data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration Error:", err); // Debugging log

      const statusCode = err.response?.status;
      const errorMessage = err.response?.data?.message;

      if (statusCode >= 500 && statusCode < 600) {
        setError("Server is in maintenance, please try again later.");
      } else if (
        errorMessage ===
        "Password must be 8-128 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
      ) {
        setError("Invalid password format.");
        setErrorMessage("Invalid password format.");
      } else {
        setError(errorMessage || "An error occurred. Please try again.");
        setErrorMessage(errorMessage || "An error occurred. Please try again.");
      }
    }
  };

  const handleLogin = async () => {
    navigate("/login");
  };

  const handleRedirect = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCodeFromUrl = urlParams.get("ref");

    if (inviteCodeFromUrl) {
      setInviteCode(inviteCodeFromUrl);
    }
  }, []);

  return (
    <>
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
          position: "relative", // important for absolute images
          overflow: "hidden",
        }}
      > <img
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
        {/* Wrapper for overlapping images */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "120px", // adjust as needed
          }}
        >
          {/* Second image (top shadow or overlay) */}
          <img
            src="/assets/logo/a_logo2.webp"
            alt="Overlay Logo"
            style={{
              position: "absolute",
              top: "10px",     // adjust spacing from the top
              left: "10px",    // adjust spacing from the left
              width: "auto",
              height: "30px",  // set your desired logo size
            }}
          />

        </Box>
      </Grid>
        <Grid
          container
          justifyContent="flex-start"
          alignItems="flex-start"
          sx={{
            backgroundColor: "#212327",
            px: "16px",
            color: "white",
            minHeight: "fit-content",
          }}
        >
          <Grid item xs={12} sx={{ marginBottom: "50px" }}>
            <form onSubmit={handleRegister}>

              <TabPanel value={tabValue} index={0} sx={{ px: "10px" }}>
                <Box display="flex" alignItems="center" mt={4} mb={1}>
                  <FormLabel sx={{ marginLeft: "6px", color: "#ffffff", fontSize: "12px", fontWeight: "400" }}>
                    Phone number
                  </FormLabel>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
                  <TextField
                    select
                    label=""
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    sx={{
                      width: "100px",
                      backgroundColor: "#212327",
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
                                backgroundColor: "#212327",
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
                {mobile && (!/^\d{10}$/.test(mobile) || mobile.length !== 10) && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5, display: "block" }}>
                    Mobile number must be exactly 10 digits.
                  </Typography>
                )}
              </TabPanel>
              <Box display="flex" alignItems="center" mt={2.5} >
                <FormLabel sx={{ marginLeft: "6px", color: "#ffffff", fontSize: "12px", fontWeight: "400" }}>
                  Set password
                </FormLabel>
              </Box>
              <TextField
                placeholder="Please enter password"
                type={showPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                autoComplete="new-password"
                margin="normal"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  style: { borderRadius: "1px", color: "#6e7167" },
                  endAdornment: (
                    <IconButton
                      onClick={handleShowPassword}
                      edge="end"
                      sx={{ color: "#c3c3c3", alignItems: "center" }}
                    >
                      {/* {showPassword ? <VisibilityOff /> : <Visibility />} */}
                      {showPassword ? (
                        <Box
                          component="img"
                          src="../assets/icons/eyeVisible.webp"
                          alt=""
                          sx={{ width: "23px" }} // Adjust the size as needed
                        />
                      ) : (
                        <Box
                          component="img"
                          src="../assets/icons/eyeInvisible.webp"
                          alt=""
                          sx={{ width: "23px" }} // Adjust the size as needed
                        />
                      )}
                    </IconButton>
                  ),
                }}
                InputLabelProps={{
                  style: { color: "#6e7167" },
                }}
              />

              <Box display="flex" alignItems="center" mt={2}>
                <FormLabel sx={{ marginLeft: "6px", color: "#ffffff", fontSize: "12px", fontWeight: "400" }}>
                  Confirm Password
                  </FormLabel>
              </Box>
              <TextField
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                margin="normal"
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
                  style: { borderRadius: "1px", color: "#6e7167" },
                  endAdornment: (
                    <IconButton
                      onClick={handleShowPassword}
                      edge="end"
                      sx={{ color: "#c3c3c3", alignItems: "center" }}
                    >
                      {showPassword ? (
                        <Box
                          component="img"
                          src="../assets/icons/eyeVisible.webp"
                          alt=""
                          sx={{ width: "23px" }} // Adjust the size as needed
                        />
                      ) : (
                        <Box
                          component="img"
                          src="../assets/icons/eyeInvisible.webp"
                          alt=""
                          sx={{ width: "23px" }} // Adjust the size as needed
                        />
                      )}
                    </IconButton>
                  ),
                }}
                InputLabelProps={{
                  style: { color: "#6e7167" },
                }}
              />
              <Box display="flex" alignItems="center" mt={2.5} >
                {/* <MoveToInboxIcon sx={{ color: "#e8910d" }} /> */}
                <FormLabel sx={{ marginLeft: "6px", color: "#ffffff", fontSize: "12px", fontWeight: "400" }}>
                  Invite Code</FormLabel>
              </Box>
              <TextField
                placeholder="Please enter the invitation code"
                value={invitecode}
                onChange={(e) => setInviteCode(e.target.value)}
                fullWidth
                required
                type="text"
                variant="outlined"
                margin="normal"
                // disabled
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
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  margin: "4px 0 8px",
                  color: "#e8910d",
                }}
              >
                <RadioGroup row>
                  <FormControlLabel
                    value="remember"
                    control={
                      <Checkbox
                        checked={isChecked}
                        onClick={handleToggle} // Handle both check and uncheck
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
              {error && (
                <Alert severity="error" sx={{ mb: 2, bgcolor: "#f1f2f5", color: "#D23838" }}>
                  {error}
                </Alert>
              )}
              <Button
                variant="contained"
                type="submit"
                fullWidth
                style={{
                  background:
                    "linear-gradient(180deg,#9fe871,#24ee89)",
                  borderRadius: "2px",
                  width: "85%",
                  height: "43px",
                  textShadow: "0 5px 2px rgba(100,35,30,.501961)",
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
                Register
              </Button>
              <Button
                onClick={handleLogin}
                variant="outlined"
                color="primary"
                fullWidth
                style={{
                  borderRadius: "2px",
                  borderColor: "#24ee89",
                  // height:"15%",
                  marginBottom: "6px",
                  marginTop: "1px",
                  textTransform: "none",
                  fontSize: "13px",
                  height: "42px",
                  width: "85%",
                }}
              >
                <span style={{ color: "#24ee89" }}>I have an account </span>
                <span
                  style={{
                    color: "#24ee89",
                    marginLeft: "10px",
                    fontSize: "16px",
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  {"  "}
                  {"  "}
                  Login
                </span>
              </Button>
            </form>
          </Grid>
        </Grid>
        {errorMessage && (
          <ErrorPopup
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        )}
      </Mobile>
    </>
  );
};

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
};

export default Register;