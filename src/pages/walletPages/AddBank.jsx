import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
// import List from '@mui/material/List'
// import ListItem from '@mui/material/ListItem'
// import ListItemText from '@mui/material/ListItemText'
// import Dialog from '@mui/material/Dialog'
// import DialogActions from '@mui/material/DialogActions'
// import DialogContent from '@mui/material/DialogContent'
// import DialogTitle from '@mui/material/DialogTitle'
// import InputAdornment from '@mui/material/InputAdornment'
import { useNavigate } from 'react-router-dom'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PersonIcon from '@mui/icons-material/Person'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PhoneIcon from '@mui/icons-material/Phone'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
// import SearchIcon from '@mui/icons-material/Search'
import Mobile from '../../components/layout/Mobile'
import ChooseBank from '../../components/wallet/ChooseBank'
import { useAuth } from '../../context/AuthContext'
import { domain } from '../../utils/Secret'

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
const banks = [
  "Bank of Baroda",
  "Union Bank of India",
  "Central Bank of India",
  "Yes Bank",
  "HDFC Bank",
  "Karnataka Bank",
  "Standard Chartered Bank",
  "IDBI Bank",
  "Bank of India",
  "Punjab National Bank",
  "ICICI Bank",
  "Canara Bank",
  "Kotak Mahindra Bank",
  "State Bank of India",
  "Indian Bank",
  "Axis Bank",
  "Syndicate Bank",
  "Citibank India"
]

const AddBank = () => {
  const navigate = useNavigate()
  const { axiosInstance } = useAuth()
  const [showBankSelection, setShowBankSelection] = useState(false)
  const [selectedBank, setSelectedBank] = useState("")

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  // Form states
  const [name, setName] = useState("")
  const [accountNo, setAccountNo] = useState("")
  const [ifscCode, setIfscCode] = useState("")
  const [mobile, setMobile] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  const isFormValid =
    name.trim() !== "" &&
    accountNo.trim() !== "" &&
    ifscCode.trim() !== "" &&
    mobile.trim() !== "" &&
    selectedBank.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if(mobile.length !== 10) {
        setSnackbarMessage("Please enter a valid 10-digit mobile number.")
        setOpenSnackbar(true)
        setTimeout(() => {
          setOpenSnackbar(false);
      }, 3000);
        return
      }
      const response = await axiosInstance.post(
        `${domain}/api/list/banking/account`,
        {
          accountName: name,
          accountNumber: accountNo,
          ifscCode,
          mobileNumber: mobile,
          bankName: selectedBank,
          accountType: "SAVINGS"
        },
        {
          withCredentials: true, // Include credentials (cookies) in the request
        }
      )

      //console.log(response.data)
      // Your submit logic here
      setSnackbarMessage("Bank details updated successfully!")
      setOpenSnackbar(true)
      setTimeout(() => {
        setOpenSnackbar(false);
    }, 3000);
      // Clear fields after successful submission
      setName("")
      setAccountNo("")
      setIfscCode("")
      setMobile("")
      setSelectedBank("")

      navigate("/wallet/withdraw")
    } catch (err) {
      setSnackbarMessage(err.response?.data || "An error occurred")
      //console.log(err)
      setOpenSnackbar(true)
      setTimeout(() => {
        setOpenSnackbar(false);
    }, 3000);
    }
  }
  
  return (
    <Mobile>
      <Box display="flex" flexDirection="column" height="100vh" position="relative">
        <Box>
          <Grid
            container
            alignItems="center"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1000,
              backgroundColor: "#232626",
              padding: "12px 16px",
              // borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Grid item xs={1}>
              <IconButton
                sx={{ color: "#FDE4BC", padding: 0 }}
                onClick={() => (showBankSelection ? setShowBankSelection(false) : navigate(-1))}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: "17px" }} />
              </IconButton>

            </Grid>
            <Grid item xs={11}>
              <Typography variant="subtitle1" sx={{ textAlign: "center", color: "#FDE4BC" }}>
                {showBankSelection ? "Choose a bank" : "Add a bank account number"}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {showBankSelection ? (
          <ChooseBank selectedBank={selectedBank} setSelectedBank={setSelectedBank} setShowBankSelection={setShowBankSelection} />
        ) : (
          <Box sx={{ px: "8px", backgroundColor: "#232626", height: "100%" }}>
            <Box sx={{ backgroundColor: "#323738", p: 1, mb: 3, borderRadius: "20px", display: "flex", alignItems: "center" }}>
              <Typography variant="body2" display="flex" alignItems="center" color="error" textAlign="left" sx={{ fontSize: "12px" }}>
                <ErrorOutlineOutlinedIcon sx={{ mr: 1, fontSize: "20px" }} />
                To ensure the safety of your funds, please bind your bank account
              </Typography>
            </Box>

            <Box mb={2}>
              <Box display="flex" alignItems="center" mb={1}>
                <Box sx={{ mr: 2, color: "#FED358" }}>
                  <AccountBalanceIcon />
                </Box>
                <Typography sx={{ color: "#FDE4BC",fontSize:"12.8px" }}>Choose a bank</Typography>
              </Box>
              <Box
                onClick={() => setShowBankSelection(true)}
                sx={{
                  background: "linear-gradient(90deg,#24ee89,#9fe871),#323738",
                  py: 0.5,
                  px: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: "8px",
                  cursor: "pointer",
                  color: "110d14",
                }}
              >
                <Typography variant="subtitle1">
                  {selectedBank || "Please select a bank"}
                </Typography>
                <ChevronRightIcon />
              </Box>
            </Box>

            <Box mb={2}>
              <Box display="flex" alignItems="center" mb={1}>
                <Box sx={{ mr: 1.2, color: "#FED358" }}>
                  <PersonIcon sx={{fontSize:30}}/>
                </Box>
                <Typography sx={{ color: "#FDE4BC",fontSize:"12.8px" }}>Full recipient's name</Typography>
              </Box>
              <Box sx={{ py: 1,px:0.5, borderRadius: "8px" }}>
                <TextField
                  fullWidth
                  placeholder="Please enter the recipient's name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="standard"
                  sx={{
                    background:"#323738",
                    borderRadius:"6px",
                    py:1,
                    input: {
                      color: "#FDE4BC", // Input text color
                      pl:1,
                      "&::placeholder": {
                        color: "#837064", // Placeholder color
                        opacity: 1, // Ensure full visibility
                        // pl:1
                      },
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: "#323738", // Light grey (default)
                    },
                    "& .MuiInput-underline:hover:before": {
                         borderBottom: "1px solid #323738",// Grey on hover
                    },
                    "& .MuiInput-underline:hover:after": {
                         borderBottom: "1px solid #323738",// Grey on hover
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "#323738", // White when focused (typing)
                    },
                  }}
                />
              </Box>
            </Box>

            <Box mb={2}>
              <Box display="flex" alignItems="center" mb={1}>
                <Box sx={{ mr: 1.2, color: "#FED358" }}>
                  <CreditCardIcon sx={{fontSize:30}}/>
                </Box>
                <Typography sx={{ color: "#FDE4BC" ,fontSize:"12.8px"}}>Bank account number</Typography>
              </Box>
             <Box sx={{ py: 1,px:0.5, borderRadius: "8px" }}>
                <TextField
                  fullWidth
                  placeholder="Please enter the bank account number"
                  value={accountNo}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,50}$/.test(value)) {
                      setAccountNo(value)
                    }
                  }}
                  variant="standard"
                 sx={{
                    background:"#323738",
                    borderRadius:"6px",
                    py:1,
                    input: {
                      color: "#FDE4BC", // Input text color
                      pl:1,
                      "&::placeholder": {
                        color: "#837064", // Placeholder color
                        opacity: 1, // Ensure full visibility
                        // pl:1
                      },
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: "#323738", // Light grey (default)
                    },
                    "& .MuiInput-underline:hover:before": {
                         borderBottom: "1px solid #323738",// Grey on hover
                    },
                    "& .MuiInput-underline:hover:after": {
                         borderBottom: "1px solid #323738",// Grey on hover
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "#323738", // White when focused (typing)
                    },
                  }}
                />
              </Box>
            </Box>

            <Box mb={2}>
              <Box display="flex" alignItems="center" mb={1}>
                <Box sx={{ mr: 1.2, color: "#FED358" }}>
                  <VpnKeyIcon sx={{fontSize:30}}/>
                </Box>
                <Typography sx={{ color: "#FDE4BC",fontSize:"12.8px" }}>Bank IFSC code</Typography>
              </Box>
              <Box sx={{ py: 1,px:0.5, borderRadius: "8px" }}>
                <TextField
                  fullWidth
                  placeholder="Please enter the bank IFSC code"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  variant="standard"
                  sx={{
                    background:"#323738",
                    borderRadius:"6px",
                    py:1,
                    input: {
                      color: "#FDE4BC", // Input text color
                      pl:1,
                      "&::placeholder": {
                        color: "#837064", // Placeholder color
                        opacity: 1, // Ensure full visibility
                        // pl:1
                      },
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: "#323738", // Light grey (default)
                    },
                    "& .MuiInput-underline:hover:before": {
                         borderBottom: "1px solid #323738",// Grey on hover
                    },
                    "& .MuiInput-underline:hover:after": {
                         borderBottom: "1px solid #323738",// Grey on hover
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "#323738", // White when focused (typing)
                    },
                  }}
                />
              </Box>
            </Box>

            <Box mb={2}>
              <Box display="flex" alignItems="center" mb={1}>
                <Box sx={{ mr: 1.2, color: "#FED358" }}>
                  <PhoneIcon sx={{fontSize:30}}/>
                </Box>
                <Typography sx={{ color: "#FDE4BC",fontSize:"12.8px" }}>Phone number</Typography>
              </Box>
             <Box sx={{ py: 1,px:0.5, borderRadius: "8px" }}>
                <TextField
                  fullWidth
                  placeholder="Please enter your mobile number"
                  value={mobile}
                  onChange={(e) => 
                    {
                      const value = e.target.value;
                      if (/^\d{0,10}$/.test(value)) {
                        setMobile(value)
                      }
                    }
                  }
                  variant="standard"
                  sx={{
                    background:"#323738",
                    borderRadius:"6px",
                    py:1,
                    input: {
                      color: "#FDE4BC", // Input text color
                      pl:1,
                      "&::placeholder": {
                        color: "#837064", // Placeholder color
                        opacity: 1, // Ensure full visibility
                        // pl:1
                      },
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: "#323738", // Light grey (default)
                    },
                    "& .MuiInput-underline:hover:before": {
                         borderBottom: "1px solid #323738",// Grey on hover
                    },
                    "& .MuiInput-underline:hover:after": {
                         borderBottom: "1px solid #323738",// Grey on hover
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "#323738", // White when focused (typing)
                    },
                  }}
                />
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={!isFormValid}
              sx={{
                background: "linear-gradient(90deg,#24ee89,#9fe871),#323738",
                borderRadius: "24px",
                p: 1,
                mb: 3,
                "&:hover": {
                  background: "linear-gradient(90deg,#24ee89,#9fe871),#323738",
                },
                textTransform: "none"
              }}
            >
              Save
            </Button>
          </Box>
        )}

        <div>
                        {/* Your existing component code */}
        
                        {/* Popup Notification */}
                        {openSnackbar && (
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
                                    {snackbarMessage}
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
  )
}

export default AddBank