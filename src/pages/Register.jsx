import React, { useState, useEffect } from "react";

// Custom Components
import Mobile from "../components/layout/Mobile";
import { domain ,inviteCode} from "../utils/Secret";

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
import Radio from "@mui/material/Radio";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";

// MUI Icons
// import TranslateIcon from "@mui/icons-material/Translate";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import SendToMobileIcon from "@mui/icons-material/SendToMobile";
// import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
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

  const [invitecode, setInviteCode] = useState(initialInviteCode || inviteCode);

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
  
    // New regex: requires at least one digit, 8+ characters, no special char/capital letter enforcement
    const passwordRegex = /^(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters and include at least one number."
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
        login(response.data.data.tokens.accessToken, response.data.data.tokens.refreshToken);
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
          alignItems="center"
          justifyContent="space-between"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "#110d14",
            px: "2px",
            height: "50px",
            color: "black",
          }}
        >
          <div id="recaptcha-container"></div>
          <Grid item xs={4} textAlign="left">
            <IconButton sx={{ color: "white" }} onClick={handleRedirect}>
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
          <Typography sx={{color:"#FED358",marginRight: "13px" }}>EN</Typography>
        </Grid>
        </Grid>
        <Grid
          container
          justifyContent="flex-start"
          alignItems="flex-start"
          sx={{
            // backgroundColor: "#0F6518",
            background:
              "#241e22",
            padding: "8px 22px 50px",

            color: "white",
            minHeight: "fit-content",
          }}
          direction="column"
        >
          <Typography
            variant="h7"
            sx={{ fontWeight: "bold", fontSize: "17px" }}
          >
            Register
          </Typography>
          <Typography variant="subtitle2" sx={{ fontSize: "12px", pt: "9px" }}>
            Please register by phone number or email
          </Typography>
        </Grid>
        <Grid
          container
          justifyContent="flex-start"
          alignItems="flex-start"
          sx={{
            backgroundColor: "#110d14",
            px: "16px",
            color: "white",
            minHeight: "fit-content",
          }}
        >
          <Grid item xs={12} sx={{ marginBottom: "50px" }}>
            <form onSubmit={handleRegister}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "20px",
                  // Add the bottom border here
                }}
              >
                <Grid sx={{
                  display: "flex",
                  justifyContent: "center", width: "97%", borderBottom: "2px solid #FED358",
                }}>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    TabIndicatorProps={{
                      style: {
                        backgroundColor:
                          tabValue === 0 ? "transparent" : "transparent",
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
                          sx={{ width: "17px", height: "auto", mt: -0.6 }} // Adjust the size as needed
                        />
                      }
                      label="Register your phone"
                      style={{ color: tabValue === 0 ? "#FED358" : "grey" }}
                    />
                  </Tabs>
                </Grid>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <Box display="flex" alignItems="center" mt={4}>
                  <Box
                    component="img"
                    src="../assets/login/phonenumber.svg"
                    alt=""
                    sx={{
                      ml: "10px",
                      marginRight: "8px",
                      width: "21px",
                      height: "22px",
                    }} // Adjust the size as needed
                  />
                  <FormLabel sx={{ color: "#FDE4BC" }}>Phone number</FormLabel>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField
                    select
                    label=""
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    sx={{
                      marginLeft: "8px",
                      width: "110px",
                      background: "#241e22",
                      marginBottom: -1,
                      borderRadius: "10px",
                      "& .MuiOutlinedInput-root": {
                        marginRight: "6px",
                        height: "47.5px",
                        lineHeight: "1.5",
                        "&.Mui-focused fieldset": {
                          borderColor: "#fff",
                        },
                        "&:hover fieldset": {
                          borderColor: "#fff",
                        },
                        "& fieldset": {
                          borderColor: "#fff",
                          border: "none",
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: "#B79C8B",
                        textOverflow: "clip",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#B79C8B",
                      },
                      "& .MuiSelect-icon": {
                        color: "#B79C8B",
                        marginRight: "4px",
                      },
                    }}
                    InputLabelProps={{
                      style: { color: "#FDE4BC" },
                    }}
                    SelectProps={{
                      IconComponent: KeyboardArrowDownRoundedIcon,
                      renderValue: (selected) =>
                        countryCodes.find((item) => item.code === selected)
                          ?.code, // Show code only

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
                      // Allow only numbers and ensure max length of 10 digits
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
                      "& .MuiInputBase-input::placeholder": {
                        fontWeight: "300",
                        color: "#FDE4BC !important", // Placeholder color
                      },
                    }}
                    InputProps={{
                      style: { borderRadius: "10px", color: "#FDE4BC" },
                    }}
                    InputLabelProps={{
                      style: { color: "#FDE4BC" },
                    }}
                  />
                </Box>
                {mobile &&
                  (!/^\d{10}$/.test(mobile) || mobile.length !== 10) && (
                    <Typography color="error" variant="caption">
                      Mobile number must be exactly 10 digits.
                    </Typography>
                  )}
              </TabPanel>

              <Box display="flex" alignItems="center" mt={-0.2} mb={-0.2} >
                <Box
                  component="img"
                  src="../assets/login/passwordIcon.svg"
                  alt=""
                  sx={{ width: "22px", height: "20px", ml: "10px", mr: "8px" }} // Adjust the size as needed
                />
                <FormLabel sx={{ color: "#FDE4BC" }}>Set Password</FormLabel>
              </Box>
              <TextField
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                autoComplete="new-password"
                margin="normal"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  width: "96%",
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
                      borderColor: "#666255 !important", // Focused border color
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#FDE4BC",
                    fontSize: "15px", // Slightly smaller text size
                  },
                }}
                InputProps={{
                  style: { borderRadius: "10px", color: "#FDE4BC" },
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
                  style: { color: "#FDE4BC" },
                }}
              />

              <Box display="flex" alignItems="center" mt={2}>
                <Box
                  component="img"
                  src="../assets/login/passwordIcon.svg"
                  alt=""
                  sx={{ width: "22px", height: "20px", ml: "10px", mr: "8px" }} // Adjust the size as needed
                />
                <FormLabel sx={{ color: "#FDE4BC", lineHeight: 1 }}>Confirm Password</FormLabel>
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
                  width: "96%",
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
                  style: { borderRadius: "10px", color: "#FDE4BC" },
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
              <Box display="flex" alignItems="center" mt={1.7}>
                {/* <MoveToInboxIcon sx={{ color: "#FED358" }} /> */}
                <Box
                  component="img"
                  src="../assets/login/invitecode.svg"
                  alt=""
                  sx={{ ml: "11px", mr: "3px", width: "20px", height: "20px" }} // Adjust the size as needed
                />
                <FormLabel sx={{ color: "#FDE4BC", }}>Invite Code</FormLabel>
              </Box>
              <TextField
                placeholder="Please enter the invitation code"
                value={invitecode}
                onChange={(e) => setInviteCode(e.target.value)}
                fullWidth
                required
                variant="outlined"
                margin="normal"
                disabled
                InputProps={{
                  style: { borderRadius: "10px", color: "#FDE4BC" },
                }}
                InputLabelProps={{
                  style: { color: "#FDE4BC" },
                }}
                sx={{
                  width: "96%",
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
                      borderColor: "#666255 !important", // Focused border color
                    },
                    "& .Mui-disabled": {
                      "&:hover": {
                        borderColor: "transparent",
                      },
                      "-webkit-text-fill-color":"#B79C8B",
                    },
                    fontSize: "15px", // Slightly smaller text size
                    color: "#FDE4BC",
                    
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#FDE4BC !important", // Placeholder color
                    fontWeight: "300",
                  },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  margin: "16px 0 8px",
                  color: "FED358",
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
                              color: "#FED358 ", // Checked color
                              fontSize: 22, // Slightly bigger for effect
                            }}
                          />
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
              {error && (
                <Alert severity="error" sx={{ mb: 2, bgcolor: "#110d14", color: "#D23838" }}>
                  {error}
                </Alert>
              )}
              <Button
                variant="contained"
                type="submit"
                fullWidth
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
                Register
              </Button>
              <Button
                onClick={handleLogin}
                variant="outlined"
                color="primary"
                fullWidth
                style={{
                  borderRadius: "300px",
                  borderColor: "#FED358",
                  // height:"15%",
                  marginBottom: "6px",
                  marginTop: "1px",
                  textTransform: "none",
                  fontSize: "13px",
                  height: "42px",
                  width: "85%",
                }}
              >
                <span style={{ color: "#a8a5a1" }}>I have an account </span>
                <span
                  style={{
                    color: "#FED358",
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