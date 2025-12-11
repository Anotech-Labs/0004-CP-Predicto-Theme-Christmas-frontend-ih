import React, { useState, useCallback, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// MUI Components
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Checkbox, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Modal from "@mui/material/Modal";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloseIcon from "@mui/icons-material/Close";
// MUI Icons
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import TranslateIcon from "@mui/icons-material/Translate";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import EmailIcon from "@mui/icons-material/Email";
// import LockIcon from "@mui/icons-material/Lock";
// import SupportAgentIcon from "@mui/icons-material/SupportAgent";
// import SendToMobileIcon from "@mui/icons-material/SendToMobile";

// Context and Components
import { useAuth } from "../context/AuthContext";
import PuzzleSlider from "../components/utils/Puzzle/PuzzleSlider";
import Mobile from "../components/layout/Mobile";
import ErrorPopup from "../components/popups/ErrorPopup";
import { domain } from "../utils/Secret";
// import { UserContext } from "../context/UserState";

const countryCodes = [{ code: "+91", country: "India" }];

const Login = () => {
  // const domain = import.meta.env.VITE_DOMAIN
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const { login, loginMessage, setLoginMessage } = useAuth();
  const navigate = useNavigate();

  // Check for login message when component mounts
  useEffect(() => {
    if (loginMessage) {
      setShowLoginMessage(true);
    }
  }, [loginMessage]);

  // Clear login message when component unmounts, but only if login is successful
  useEffect(() => {
    // Only show message if it exists and we're not in the process of logging in
    if (loginMessage && !showPuzzle) {
      setShowLoginMessage(true);
    }
  }, [loginMessage, showPuzzle]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Radio button handler
  const handleToggle = () => {
    setIsChecked(!isChecked); // Toggle state on click
  };

  const isLoginButtonActive =
    (mobile.trim() !== "" && password.trim() !== "") ||
    (email.trim() !== "" && password.trim() !== "");

  const handleCloseLoginMessage = () => {
    setShowLoginMessage(false);
    setLoginMessage(""); // Clear the message when user dismisses it
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      // Parse mobile to an integer for the API request
      const mobileNumber = parseInt(mobile, 10);

      // Validate the mobile number
      if (isNaN(mobileNumber) || mobile.length !== 10) {
        setErrorMessage("Please enter a valid 10-digit mobile number.");
        return;
      }

      const request = {
        mobile: mobileNumber,
        password,
      };

      //console.log("req->", request);

      // Send the mobile as an integer in the API request
      console.log(domain, "Login domain")
      const response = await axios.post(`${domain}/api/user/login`, request);

      // //console.log("response:->", response)

      if (response.status === 200) {
        const isAdmin = [
          "ADMIN",
          "FINANCEHEAD",
          "GAMEHEAD",
          "SETTINGSHEAD",
          "ADDITIONALHEAD",
          "SUPPORTHEAD",
        ].includes(response.data.data.user.accountType);

        const isAgent = ["AGENT"].includes(response.data.data.user.accountType);

        // Get sessionId from the response
        const { accessToken, refreshToken, sessionId } =
          response.data.data.tokens;

        // Pass sessionId to login function
        login(accessToken, refreshToken, sessionId, isAdmin, isAgent);

        // Clear any login messages as login is successful
        setLoginMessage("");
        sessionStorage.removeItem("loginMessage");

        setShowPuzzle(true);

        // navigate("/");
      }
    } catch (error) {
      if (error) {
        const statusCode = error.response?.status;
        console.log("error statusCode: ", error);

        if (statusCode >= 500 && statusCode < 600) {
          setErrorMessage("Server is in maintenance, please try again later.");
        } else {
          setErrorMessage(
            error.response?.data?.message || "Network Connection Error. Please try again later"
          );
        }

        console.error(error.response?.data?.message || error.message);
      }
    }
  };

  const handlePuzzleSolved = useCallback(() => {
    setShowPuzzle(false);
    navigate("/");
  }, [navigate]);

  const handleRegister = () => {
    navigate("/register");
  };

  const handleRedirect = () => {
    navigate("/");
  };

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

      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          width: "85%",
          maxWidth: "300px",
        }}
      >
        <Snackbar
          open={showLoginMessage && !!loginMessage}
          autoHideDuration={4000}
          // anchorOrigin={{ vertical: "center", horizontal: "center" }}
          onClose={handleCloseLoginMessage}
        >
          <Alert
            severity="warning"
            variant="filled"
            icon={false} // Remove default icon
            sx={{
              width: "100%",
              bgcolor: "rgba(0, 0, 0, 0.9)",
              color: "#fff",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              "& .MuiAlert-message": {
                padding: 0,
                textAlign: "center",
              },
              "& .MuiAlert-action": {
                padding: 0,
                marginRight: 0,
              },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
              <WarningAmberIcon sx={{ color: "#FFB74D", fontSize: "28px" }} />
            </Box>
            <Typography
              sx={{
                fontSize: "13px",
                lineHeight: 1.3,
                fontWeight: 400,
                mb: 1,
              }}
            >
              {loginMessage}
            </Typography>
            <IconButton
              size="small"
              onClick={handleCloseLoginMessage}
              sx={{
                color: "#fff",
                padding: "4px",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <CloseIcon sx={{ fontSize: "16px" }} />
            </IconButton>
          </Alert>
        </Snackbar>
      </Box>

      <Grid
        container
        justifyContent="flex-start"
        alignItems="flex-start"
        sx={{
          backgroundColor: "#212327",
          color: "white",
          minHeight: "fit-content",
        }}
      >
        <Grid item xs={12} sx={{ mb: 1 }}>
          <form onSubmit={handleLogin} autoComplete="off">
            {/* Outer container mimicking .login_container-tab */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                background: "#323738",
                borderRadius: "8px 8px 0 0",
                overflow: "hidden",
                width: "100%",
                // borderBottom: "1px solid #D3D3D3",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                TabIndicatorProps={{ style: { display: "none" } }} // Remove default indicator
                sx={{ width: "100%", minHeight: "50px" }}
              >
                {/* Phone Tab */}
                <Tab
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      {/* <Box
                        component="img"
                        src={
                          tabValue === 0
                            ? "../assets/login/phone.webp"
                            : "../assets/login/phonenone.webp"
                        }
                        alt="Phone Icon"
                        sx={{
                          width: "20px",
                          height: "20px",
                        }}
                      /> */}
                      <Box
                        sx={{
                          fontSize: "14px",
                          fontWeight: "500",
                          textTransform: "initial",
                          color: tabValue === 0 ? "#24ee89" : "#888888",
                        }}
                      >
                        Log in with phone
                      </Box>
                    </Box>
                  }
                  sx={{
                    flex: 1,
                    minHeight: "50px",
                    background: tabValue === 0 ? "#3a4142" : "#323738",
                    clipPath:
                      tabValue === 0
                        ? "polygon(0 0,100% 0,calc(100% - 20px) 100%,0 100%)" // active: right corner slant
                        : "none",
                    transition: "all 0.3s ease",
                  }}
                />

                {/* Email Tab */}
                <Tab
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      {/* <Box
                        component="img"
                        src={
                          tabValue === 1
                            ? "../assets/login/mail.webp"
                            : "../assets/login/mailnone.webp"
                        }
                        alt="Email Icon"
                        sx={{
                          width: "26px",
                          height: "20px",
                        }}
                      /> */}
                      <Box
                        sx={{
                          fontSize: "14px",
                          fontWeight: "500",
                          textTransform: "initial",
                          color: tabValue === 1 ? "#24ee89" : "#768096",
                        }}
                      >
                        Email login
                      </Box>
                    </Box>
                  }
                  sx={{
                    flex: 1,
                    minHeight: "53px",
                    background: tabValue === 1 ? "#3a4142" : "#323738",
                    clipPath:
                      tabValue === 1
                        ? "polygon(0 0,100% 0,100% 100%,20px 100%)" // active: left corner slant
                        : "none",
                    transition: "all 0.3s ease",
                  }}
                />
              </Tabs>
            </Box>
            <Grid item xs={12} sx={{ mb: 1, px: 2.5 }}>

              <TabPanel value={tabValue} index={0} sx={{ px: "10px" }}>
                <Box display="flex" alignItems="center" mt={2} mb={1}>
                  {/* <Box
                    component="img"
                    src="../assets/login/phone_black.webp"
                    alt=""
                    sx={{ width: "20px" }}
                  /> */}
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
                        color: "#fff",
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
              <TabPanel value={tabValue} index={1} sx={{ px: "10px" }}>
                <Box display="flex" alignItems="center" mt={4} mb={1}>
                  {/* <Box
                    component="img"
                    src="../assets/login/mail_black.webp"
                    alt=""
                    sx={{ width: "20px" }}
                  /> */}
                  <FormLabel sx={{ marginLeft: "6px", color: "#ffffff", fontSize: "12px", fontWeight: "400" }}>
                    Mail
                  </FormLabel>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    placeholder="Please enter the email"
                    fullWidth
                    variant="outlined"
                    autoComplete="off"
                    autoFocus={false}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={
                      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length > 0
                    }
                    helperText={
                      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length > 0
                        ? "Please enter a valid email address"
                        : ""
                    }
                    required
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
              </TabPanel>
              <Box display="flex" alignItems="center" mt={3}>
                {/* <Box
                  component="img"
                  src="../assets/login/lock_black.webp"
                  alt=""
                  sx={{ width: "20px" }}
                /> */}
                <FormLabel sx={{ marginLeft: "6px", color: "#ffffff", fontSize: "12px", fontWeight: "400" }}>
                  Password
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
                      {showPassword ? (
                        <Box
                          component="img"
                          src="../assets/icons/eyeVisible.webp"
                          alt=""
                          sx={{ width: "23px" }}
                        />
                      ) : (
                        <Box
                          component="img"
                          src="../assets/icons/eyeInvisible.webp"
                          alt=""
                          sx={{ width: "23px" }}
                        />
                      )}
                    </IconButton>
                  ),
                }}
                InputLabelProps={{
                  style: { color: "#6e7167" },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between", // 👈 puts Forgot password on right
                  marginTop: "10px",
                  width: "100%",
                }}
              >
                {/* Remember Password */}
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
                              color: "#c8c9cc",
                              fontSize: 22,
                            }}
                          />
                        }
                        checkedIcon={
                          <CheckCircleIcon
                            sx={{
                              color: "#24ee89",
                              fontSize: 22,
                            }}
                          />
                        }
                      />
                    }
                    label={
                      <Typography sx={{ color: "#768096", fontSize: 12 }}>
                        Remember password
                      </Typography>
                    }
                  />
                </RadioGroup>

                {/* Forgot Password */}
                <Typography
                  onClick={() => navigate("/forgot-password")}
                  sx={{
                    fontSize: 12,
                    fontWeight: 400,
                    textAlign: "center",
                    marginTop: "5px",
                    color: "#24ee89",
                    cursor: "pointer",
                  }}
                >
                  Forgot password
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                type="submit"
                style={{
                  marginBottom: "22px",
                  marginTop: "20px",
                  background: isLoginButtonActive
                    ? "linear-gradient(180deg,#9fe871,#24ee89)"
                    : "linear-gradient(180deg,#cfd1df,#c8cada)",
                  borderRadius: "5px",
                  color: isLoginButtonActive ? "#212327" : "#fff",
                  fontWeight: "700",
                  fontSize: "18px",
                  textShadow: isLoginButtonActive ? "0 5px 2px rgba(231,65,65,.501961)" : "none",
                  width: "85%",
                  border: "1px solid rgba(0,0,0,.2)",
                  textTransform: "none",
                  height: "42px",
                }}
                sx={{
                  fontWeight: "bold",
                }}
              >
                Log in
              </Button>
              <Button
                onClick={handleRegister}
                variant="outlined"
                color="primary"
                fullWidth
                sx={{
                  "&:hover": {
                    background: "#212327",
                  },
                }}
                style={{
                  borderRadius: "5px",
                  borderColor: "#24ee89",
                  width: "85%",
                  height: "42px",
                }}
              >
                <span
                  style={{
                    color: "#24ee89",
                    marginLeft: "3px",
                    fontWeight: "700",
                    textTransform: "none",
                    fontSize: "18px",
                  }}
                >
                  Register
                </span>
              </Button>
            </Grid>
          </form>
        </Grid>
        {/* <Grid
          item
          xs={6}
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ padding: "16px", marginTop: "7px", cursor: "pointer" }}
          onClick={() => navigate("/forgot-password")}
        >
          <Box
            component="img"
            src="../assets/login/ForgotPassword.svg"
            alt=""
            sx={{ height: "50px", mb: "0px", width: "50px" }}
          />
          <Typography
            variant="subtitle1"
            style={{ color: "#ffffff", fontSize: "13px" }}
          >
            Forgot password
          </Typography>
        </Grid>
        <Grid
          item
          xs={6}
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          onClick={() => window.open("https://t.me/Cognixsupport", "_blank")}
          sx={{ padding: "16px", marginTop: "4px", cursor: "pointer" }}
        >
          <Box
            component="img"
            src="../assets/login/customer.svg"
            alt=""
            sx={{
              marginRight: "8px",
              width: "42px",
              height: "55px",
              mb: "0px",
            }}
          />
          <Typography
            variant="subtitle1"
            style={{ color: "#ffffff", marginBottom: "51px", fontSize: "13px" }}
          >
            Customer Service
          </Typography>
        </Grid> */}
      </Grid>

      <Modal
        open={showPuzzle}
        onClose={() => setShowPuzzle(false)}
        aria-labelledby="puzzle-modal"
        aria-describedby="puzzle-to-complete-login"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 300, sm: 350 },
            boxShadow: 24,
            "&:focus-visible": {
              outline: "none",
              boxShadow: "none",
            },
          }}
        >
          <PuzzleSlider onPuzzleSolved={handlePuzzleSolved} />
        </Box>
      </Modal>
      {errorMessage && (
        <ErrorPopup
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
    </Mobile>
  );
};

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
};

export default Login;
