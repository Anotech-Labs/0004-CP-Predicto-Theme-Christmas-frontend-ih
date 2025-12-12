import React, { useContext, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Container, Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import HomeIcon from "@mui/icons-material/Home"
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"
import Mobile from "../../components/layout/Mobile"
import { UserContext } from "../../context/UserState"
import { useAuth } from "../../context/AuthContext"
import { domain } from "../../utils/Secret"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
const DepositIssue = () => {
  const [screenshot, setScreenshot] = useState(null)
  const [receiverUpiId, setReceiverUpiId] = useState("")
  const [error, setError] = useState("")
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const depositId = searchParams.get("depositId") || ""
  const amount = searchParams.get("amount") || ""
  const utrNumber = searchParams.get("utrNumber") || ""
  const navigate = useNavigate()
  const { userData } = useContext(UserContext)
  const { axiosInstance } = useAuth()

  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setScreenshot(file)
    }
  }

  const handleSubmit = async () => {
    // Validate all required fields
    if (!receiverUpiId || !screenshot) {
      setPopupMessage("All fields are required!")
      setIsPopupVisible(true);
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 2000);
      // setSnackbar({ open: true, message: "All fields are required!", severity: "error" })
      return
    }

    setLoading(true) // Start loading

    const data = {
      utrNumber,
      receiverUpiId,
      orderNumber: depositId,
      orderAmount: amount
    }

    try {
      const formData = new FormData()
      formData.append("userId", userData.uid.toString()) // Ensure userId is a string
      formData.append("type", "DEPOSIT_NOT_RECEIVED")
      formData.append("ticketDetails", JSON.stringify(data))
      formData.append("files", screenshot, screenshot.name) // Attach file properly

      const response = await axiosInstance.post(`${domain}/api/ticket/create-ticket`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setPopupMessage("Deposit issue submitted successfully!")
      setIsPopupVisible(true);
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 2000);
      // setSnackbar({ open: true, message: "Bank details updated successfully!", severity: "success" })
      //console.log("Response:", response.data)

      setReceiverUpiId("")
      setScreenshot(null)

    } catch (error) {
      setPopupMessage("Failed to submit issue. Try again.")
      setIsPopupVisible(true);
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 2000);
      // setSnackbar({ open: true, message: "Failed to update bank details. Try again.", severity: "error" })
      console.error("Error:", error)
    } finally {
      setLoading(false) // Stop loading
    }
  }

  return (
    <Mobile>
      <Container disableGutters maxWidth="xs" sx={{
        bgcolor: "#232626", height: "100vh", display: "flex", flexDirection: "column",
        "&.MuiContainer-root": { maxWidth: "100%" }
      }}>
        {/* Header */}
        <Box sx={{ bgcolor: "#232626", padding: "8px 10px", display: "flex", alignItems: "center", color: "#FDE4BC" }}>
          <ChevronLeftIcon sx={{ fontSize: 30, cursor: "pointer" }} onClick={() => window.history.back()} />
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", color: "#FDE4BC" }}>
            Deposit Not Received
          </Typography>
          <HomeIcon sx={{ fontSize: 30, cursor: "pointer" }} onClick={() => navigate("/")} />
        </Box>

        {/* Form */}
        <Box sx={{ p: 2, color: "#FDE4BC", flexGrow: 1, textAlign: "left" }}>
          <Typography variant="body1" sx={{ mb: 1 }}>UTR number <span style={{ color: "red" }}>*</span></Typography>
          <TextField fullWidth placeholder="Please enter UTR" variant="outlined" sx={inputStyles} value={utrNumber} InputProps={{ readOnly: true }} />

          <Typography variant="body1" sx={{ mt: 3, mb: 1 }}>Receiver UPI ID <span style={{ color: "red" }}>*</span></Typography>
          <TextField
            fullWidth
            placeholder="Please enter content"
            variant="outlined"
            sx={inputStyles}
            value={receiverUpiId}
            onChange={(e) => setReceiverUpiId(e.target.value)}
          />

          <Typography variant="body1" sx={{ mt: 3, mb: 1 }}>Order Number <span style={{ color: "red" }}>*</span></Typography>
          <TextField
            fullWidth
            value={depositId}
            variant="outlined"
            sx={inputStyles}
            InputProps={{ readOnly: true }}
          />

          <Typography variant="body1" sx={{ mt: 3, mb: 1 }}>Order Amount <span style={{ color: "red" }}>*</span></Typography>
          <TextField
            fullWidth
            value={amount}
            variant="outlined"
            sx={inputStyles}
            InputProps={{ readOnly: true }}
          />
          <Typography variant="body1" sx={{ mt: 3, mb: 1 }}>Deposit proof receipt detail <span style={{ color: "red" }}>*</span> <span style={{ fontStyle: "italic", opacity: 0.7, fontSize: "12px" }}>
            ( Upto <span style={{ color: "red" }}>2 mb</span> )</span></Typography>
          <Box component="label" sx={{ width: 100, height: 100, bgcolor: "#333", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2, cursor: "pointer", overflow: "hidden" }}>
            {screenshot ? <img src={URL.createObjectURL(screenshot)} alt="Screenshot" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> :
              <AddPhotoAlternateIcon sx={{ color: "#FDE4BC", fontSize: 45 }} />}
            <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
          </Box>

          <Button
            variant="contained"
            sx={{
              mt: 3, background: "linear-gradient(90deg,#24ee89,#9fe871)", borderRadius: 4, textTransform: "none", "&:disabled": {
                background: "#454456", // Disabled color
                color: "#A8A5A1", // Adjust text color for better readability
              },
            }}
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>

          {/* <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "top", horizontal: "center" }} 
          >
            <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
          </Snackbar> */}

          <div>
            {/* Your existing component code */}

            {/* Popup Notification */}
            {isPopupVisible && (
              <Box
                sx={{
                  position: "fixed",
                  top: "40%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "rgba(0, 0, 0, 0.9)",
                  color: "white",
                  padding: "20px 30px",
                  borderRadius: "10px",
                  // boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                  zIndex: 1000,
                  animation: "fadeIn 0.5s ease",
                  textAlign: "center",
                }}
              >
                <Typography variant="body1" sx={{ marginTop: "10px" }}>
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
      </Container>
    </Mobile>
  )
}

// Styles
const inputStyles = {
  bgcolor: "#323738",
  input: { color: "#FDE4BC", height: "15px", fontSize: "14px" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "1px solid #3B3833", // Remove border initially
    },
    "&:hover fieldset": {
      border: "1px solid #3B3833", // Grey border on hover
    },
    "&.Mui-focused fieldset": {
      border: "1px solid #3B3833", // Grey border on focus
    },
  },
}


const uploadBoxStyles = {
  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  width: 100, height: 100, border: "2px dashed #555", borderRadius: 2, cursor: "pointer"
}

export default DepositIssue
