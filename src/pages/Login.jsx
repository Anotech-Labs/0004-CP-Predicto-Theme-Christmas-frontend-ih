import React, { useState, useCallback, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

// MUI Components
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import FormLabel from "@mui/material/FormLabel"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import Modal from "@mui/material/Modal"
import MenuItem from "@mui/material/MenuItem"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import CloseIcon from "@mui/icons-material/Close"
// MUI Icons
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"

import Checkbox from "@mui/material/Checkbox"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"

// Context and Components
import { useAuth } from "../context/AuthContext"
import PuzzleSlider from "../components/utils/Puzzle/PuzzleSlider"
import Mobile from "../components/layout/Mobile"
import ErrorPopup from "../components/popups/ErrorPopup"
import { domain } from "../utils/Secret"

const countryCodes = [{ code: "+91", country: "India" }]

const Login = () => {
  // const domain = import.meta.env.VITE_DOMAIN
  const [tabValue, setTabValue] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [mobile, setMobile] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false);
  const [showPuzzle, setShowPuzzle] = useState(false)
  const [countryCode, setCountryCode] = useState("+91")
  const [errorMessage, setErrorMessage] = useState("")
  const [isChecked, setIsChecked] = useState(false)
  const [showLoginMessage, setShowLoginMessage] = useState(false)

  const { login, loginMessage, setLoginMessage } = useAuth()
  const navigate = useNavigate()

  // Check for login message when component mounts
  useEffect(() => {
    if (loginMessage) {
      setShowLoginMessage(true)
    }
  }, [loginMessage])

  // Clear login message when component unmounts, but only if login is successful
  useEffect(() => {
    // Only show message if it exists and we're not in the process of logging in
    if (loginMessage && !showPuzzle) {
      setShowLoginMessage(true)
    }
  }, [loginMessage, showPuzzle])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  // Radio button handler
  const handleToggle = () => {
    setIsChecked(!isChecked) // Toggle state on click
  }

  const isLoginButtonActive =
    (mobile.trim() !== "" && password.trim() !== "") ||
    (email.trim() !== "" && password.trim() !== "")
  const handleCloseLoginMessage = () => {
    setShowLoginMessage(false)
    setLoginMessage("") // Clear the message when user dismisses it
  }

  // On component mount, load saved email if "remember me" was set
  useEffect(() => {
    const savedMobile = localStorage.getItem("rememberedDetails");
    if (savedMobile) {
      const { mobile2, password2 } = JSON.parse(savedMobile);
      setMobile(mobile2);
      setPassword(password2);
      // setMobile(savedMobile);
      setIsChecked(true);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const mobileNumber = parseInt(mobile, 10);

      if (isNaN(mobileNumber) || mobile.length !== 10) {
        setErrorMessage("Please enter a valid 10-digit mobile number.");
        return;
      }

      const request = { mobile: mobileNumber, password };
      const response = await axios.post(`${domain}/api/user/login`, request);

      if (response.status === 200) {
        const { user, tokens } = response.data.data;

        const isAdmin = [
          "ADMIN",
          "FINANCEHEAD",
          "GAMEHEAD",
          "SETTINGSHEAD",
          "ADDITIONALHEAD",
          "SUPPORTHEAD",
        ].includes(user.accountType);

        const isAgent = ["AGENT"].includes(user.accountType);

        // Check if user is demo admin (iCD: true)
        const isDemoAdmin = user.iCD === true && isAdmin;

        const { accessToken, refreshToken, sessionId } = tokens;

        // Pass isDemoAdmin flag to login function
        login(
          accessToken,
          refreshToken,
          sessionId,
          isAdmin,
          isAgent,
          isDemoAdmin
        );

        setLoginMessage("");
        sessionStorage.removeItem("loginMessage");
        setShowPuzzle(true);

        if (isChecked) {
          const loginInfo = { mobile2: mobile, password2: password };
          localStorage.setItem("rememberedDetails", JSON.stringify(loginInfo));
        } else {
          localStorage.removeItem("rememberedDetails");
        }
      }
    } catch (error) {
      if (error) {
        const statusCode = error.response?.status;

        if (statusCode >= 500 && statusCode < 600) {
          setErrorMessage("Server is in maintenance, please try again later.");
        } else {
          setErrorMessage(
            error.response?.data?.message || "Network connection error."
          );
        }

        console.error(error.response?.data?.message || error.message);
      }
    }
  }

  const handlePuzzleSolved = useCallback(() => {
    setShowPuzzle(false)
    navigate("/")
  }, [navigate])

  const handleRegister = () => {
    navigate("/register")
  }

  const handleRedirect = () => {
    navigate("/")
  }

  return (
    <Mobile>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "#232626",
          px: "2px",
          height: "50px",
          // py: "2px",
          color: "black",
        }}
      >
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
        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <img
            src="assets/icons/english.webp"
            alt="logo"
            style={{ width: "25px", marginRight: "8px" }}
          />
          <Typography
            sx={{
              fontWeight: "550",
              fontSize: "16px",
              color: "#FED358",
              marginRight: "13px",
            }}
          >
            EN
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        justifyContent="flex-start"
        alignItems="flex-start"
        sx={{
          // backgroundColor: "#0F6518",
          background:
            "#323738",
          px: "16px",
          pt: "10px",
          pb: "40px",
          color: "white",
          minHeight: "fit-content",
        }}
        direction="column"
      >
        <Typography variant="h7" sx={{ fontWeight: "bold", fontSize: "17px" }}>
          Log in
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
          Please login with your phone number or email <br />
          If you forget your password, please contact customer service
        </Typography>
        {/* <Typography variant="caption" sx={{fontSize:"11px" , pt:"-5px"}}>
          If you forget your password, please contact customer service
        </Typography> */}
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
          autoHideDuration={5000}
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
          backgroundColor: "#232626",
          pl: "23px",
          pr: "23px",
          color: "white",
          minHeight: "fit-content",
        }}
      >
        <Grid item xs={12} sx={{ mb: 1 }}>
          <form onSubmit={handleLogin} autoComplete="off">
            <Grid sx={{ width: "97%", borderBottom: "1px solid #454037" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                TabIndicatorProps={{
                  style: {
                    backgroundColor: "#FED358",
                    width: "50%",
                    textAlign: "center",
                  },
                }}
              >
                <Tab
                  sx={{
                    width: "50%",
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                  icon={
                    // <Box
                    //   component="img"
                    //   src="../assets/login/phonenumber.webp"
                    //   alt=""
                    //   sx={{ width: "20px", pb: "5px" }} // Adjust the size as needed
                    // />
                    <img
                      src={
                        tabValue === 1
                          ? "../assets/login/phoneUnselected.svg"
                          : "../assets/login/phonenumber.svg"
                      }
                      alt="Email Icon"
                      style={{ paddingBottom: "5px", width: "16px" }}
                    />
                  }
                  label="phone number"
                  style={{ color: tabValue === 0 ? "#FED358" : "#B79C8B" }}
                />
                <Tab
                  sx={{
                    width: "50%",
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                  icon={
                    <img
                      src={
                        tabValue === 1
                          ? "../assets/login/emailselected.svg"
                          : "../assets/login/emaildelected.svg"
                      }
                      alt="Email Icon"
                      style={{ paddingBottom: "5px", width: "30px" }}
                    />
                  }
                  label="Email Login"
                  style={{ color: tabValue === 1 ? "#FED358" : "#B79C8B" }}
                />
              </Tabs>
            </Grid>
            <TabPanel value={tabValue} index={0}>
              <Box display="flex" alignItems="center" mt={4}>
                {/* <SendToMobileIcon sx={{ color: "#FED358" }} /> */}
                <Box
                  component="img"
                  src="../assets/login/phonenumber.svg"
                  alt=""
                  sx={{ width: "16px" }} // Adjust the size as needed
                />
                <FormLabel sx={{ marginLeft: "6px", color: "#FDE4BC" }}>
                  Phone number
                </FormLabel>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                  select
                  label=""
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  sx={{
                    width: "100px",
                    background: "#323738",
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
                    style: { color: "#fff" },
                  }}
                  SelectProps={{
                    IconComponent: KeyboardArrowDownRoundedIcon,
                    renderValue: (selected) =>
                      countryCodes.find((item) => item.code === selected)?.code, // Show code only

                    MenuProps: {
                      PaperProps: {
                        sx: {
                          color: "white",
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
                    const value = e.target.value
                    // Allow only numbers and ensure max length of 10 digits
                    if (/^\d{0,10}$/.test(value)) {
                      setMobile(value)
                    }
                  }}
                  required
                  sx={{
                    width: "80%",
                    backgroundColor: "#323738",
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
                    style: { borderRadius: "10px", color: "#FDE4BC" },
                  }}
                />
              </Box>
              {mobile && (!/^\d{10}$/.test(mobile) || mobile.length !== 10) && (
                <Typography color="error" variant="caption">
                  Mobile number must be exactly 10 digits.
                </Typography>
              )}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Box display="flex" alignItems="center" mt={4}>
                <Box
                  component="img"
                  src="../assets/login/emailselected.svg"
                  alt=""
                  sx={{ width: "29px" }} // Adjust the size as needed
                />
                <FormLabel sx={{ marginLeft: "5px", color: "#FDE4BC" }}>
                  Mail
                </FormLabel>
              </Box>
              <TextField
                placeholder="Please input your email"
                fullWidth
                variant="outlined"
                margin="normal"
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
                  backgroundColor: "#323738",
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
                }}
                InputProps={{
                  style: { borderRadius: "10px", color: "#FDE4BC" },
                }}
                InputLabelProps={{
                  style: { color: "#6e7167" },
                }}
              />
            </TabPanel>
            <Box display="flex" alignItems="center" mt={3}>
              <Box
                component="img"
                src="../assets/login/passwordIcon.svg"
                alt=""
                sx={{ width: "22px", height: "20px", mb: 1.5 }} // Adjust the size as needed
              />
              <FormLabel sx={{ color: "#FDE4BC", marginLeft: "5px", mb: 1.8 }}>
                Password
              </FormLabel>
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
                width: "98%",
                // paddingRight:"10px",
                // marginRight:"100px",
                margin: "1px",
                backgroundColor: "#323738",
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
                style: { color: "#6e7167" },
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
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
                    <Typography sx={{ color: "#B79C8B", fontSize: 12 }}>
                      Remember password
                    </Typography>
                  }
                />
              </RadioGroup>
            </Box>
            <Button
              variant="contained"
              fullWidth
              type="submit"
              style={{
                marginBottom: "22px",
                marginTop: "20px",
                background: isLoginButtonActive
                  ? "linear-gradient(180deg, #FED358 , #FFB472 )"
                  : "#454456",
                borderRadius: "300px",
                color: isLoginButtonActive ? "#221f2e" : "#B79C8B",
                fontWeight: "bold",
                fontSize: "19px",
                width: "87%",
                textTransform: "none",
                height: "42px",
              }}
              sx={{
                fontWeight: "bold",
                // color: "#221f2e",
                // fontSize: "16px",
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
                  background: "#232626",
                },
              }}
              style={{
                borderRadius: "300px",
                borderColor: "#FED358",
                width: "87%",
                height: "42px",
              }}
            >
              <span
                style={{
                  color: "#FED358",
                  marginLeft: "3px",
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "19px",
                }}
              >
                Register
              </span>
            </Button>
          </form>
        </Grid>
        <Grid
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
            sx={{ width: "38px", height: "45px", mb: "3px" }} // Adjust the size as needed
          />
          <Typography
            variant="subtitle1"
            style={{ color: "#FDE4BC", fontSize: "13px" }}
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
          sx={{ padding: "16px", marginTop: "10px" }}
          onClick={() => navigate("/customer-telegram")}
        >
          <Box
            component="img"
            src="../assets/login/customer.svg"
            alt=""
            sx={{
              marginRight: "8px",
              width: "38px",
              // height: "38px",
              mb: "7px",
            }} // Adjust the size as needed
          />
          {/* <SupportAgentIcon style={{ fontSize: 60, color: "#FED358" }} /> */}
          <Typography
            variant="subtitle1"
            style={{ color: "#FDE4BC", marginBottom: "51px", fontSize: "13px" }}
          >
            Customer Service
          </Typography>
        </Grid>
      </Grid>

      <Modal
        open={showPuzzle}
        onClose={() => setShowPuzzle(false)}
        aria-labelledby="puzzle-modal"
        aria-describedby="puzzle-to-complete-login"
        sx={{
          "&:focus-visible": {
            outline: "none",
            boxShadow: "none",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 300, sm: 350 },
            // bgcolor: "background.paper",
            boxShadow: 24,
            // borderRadius: 2,
            '&:focus-visible': {
              outline: 'none',
              boxShadow: 'none',
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
  )
}

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  )
}

export default Login
