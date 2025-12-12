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
const WithdrawalIssue = () => {
    const [screenshot, setScreenshot] = useState(null)
    const [description, setDescription] = useState("")
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
    const [loading, setLoading] = useState(false)
    const [searchParams] = useSearchParams()
    const transactionId = searchParams.get("transactionId") || ""
    const amount = searchParams.get("amount") || ""

  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState("");
    const { userData } = useContext(UserContext)
    const { axiosInstance } = useAuth()
const navigate= useNavigate()
    const handleImageUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            setScreenshot(file)
        }
    }

    const handleSubmit = async () => {
        if (!description.trim() || !screenshot) {
            setPopupMessage("All fields are required!")
            setIsPopupVisible(true);
            setTimeout(() => {
                setIsPopupVisible(false);
              }, 2000);
            // setSnackbar({ open: true, message: "All fields are required!", severity: "error" })
            return
        }

        if (!userData || !userData.uid) {
            setPopupMessage("User not found. Please login again.")
            setIsPopupVisible(true);
            setTimeout(() => {
                setIsPopupVisible(false);
              }, 2000);
            // setSnackbar({ open: true, message: "User not found. Please login again.", severity: "error" })
            return
        }

        setLoading(true)

        const data = {
            withdrawalId: transactionId,
            amount,
            description
        }

        try {
            const formData = new FormData()
            formData.append("userId", userData.uid.toString())
            formData.append("type", "WITHDRAWAL_PROBLEM")
            formData.append("ticketDetails", JSON.stringify(data))
            formData.append("files", screenshot, screenshot.name)

            const response = await axiosInstance.post(`${domain}/api/ticket/create-ticket`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
setPopupMessage("Withdrawal issue submitted successfully!")
            setIsPopupVisible(true);
            setTimeout(() => {
                setIsPopupVisible(false);
              }, 2000);
            // setSnackbar({ open: true, message: "Withdrawal issue submitted successfully!", severity: "success" })
            //console.log("Response:", response.data)

            // Clear form
            setDescription("")
            setScreenshot(null)

        } catch (error) {
            setPopupMessage("Failed to submit issue. Try again.")
            setIsPopupVisible(true);
            setTimeout(() => {
                setIsPopupVisible(false);
              }, 2000);
            // setSnackbar({ open: true, message: "Failed to submit issue. Try again.", severity: "error" })
            console.error("Error:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Mobile>
            <Container disableGutters maxWidth="xs" sx={{
                bgcolor: "#232626", height: "100vh", display: "flex", flexDirection: "column",
                "&.MuiContainer-root": { maxWidth: "100%" }
            }}>
                {/* Header */}
                <Box sx={{ bgcolor: "#232626", padding: "8px 10px", display: "flex", alignItems: "center", color: "#f5f3f0" }}>
                    <ChevronLeftIcon sx={{ fontSize: 30, cursor: "pointer" }} onClick={() => window.history.back()} />
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", color: "#FDE4BC" }}>
                        Withdrawal Issue
                    </Typography>
                    <HomeIcon sx={{ fontSize: 30,cursor:"pointer" }} onClick={() => navigate("/")} />
                </Box>

                {/* Form */}
                <Box sx={{ p: 2, color: "#f5f3f0", flexGrow: 1, textAlign: "left" }}>
                    <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>Withdrawal issue description <span style={{ color: "red" }}>*</span></Typography>
                    <TextField
                        fullWidth
                        placeholder="Please enter content"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{
                            bgcolor: "#323738",
                            borderRadius: 1,
                            "& .MuiOutlinedInput-root": {
                                color: "white", // Ensure text is white
                                "& fieldset": { borderColor: "#3B3833" }, // Border color
                                "&:hover fieldset": { border: "1px solid #3B3833" },
                                "&.Mui-focused fieldset": { border: "1px solid #3B3833/" }
                            },
                            "& .MuiInputBase-input": {
                                color: "#f5f3f0", // Text color fix
                            },
                            "& .MuiInputBase-input::placeholder": {
                                color: "#A8A5A1", // Placeholder color
                                opacity: 1
                            }
                        }}
                        inputProps={{ maxLength: 500 }}
                    />


                    <Typography variant="body1" sx={{ mt: 3, mb: 1 }}>Transaction ID <span style={{ color: "red" }}>*</span></Typography>
                    <TextField
                        fullWidth
                        value={transactionId}
                        variant="outlined"
                        sx={inputStyles}
                        InputProps={{ readOnly: true }}
                    />

                    <Typography variant="body1" sx={{ mt: 3, mb: 1 }}>Amount <span style={{ color: "red" }}>*</span></Typography>
                    <TextField
                        fullWidth
                        value={amount}
                        variant="outlined"
                        sx={inputStyles}
                        InputProps={{ readOnly: true }}
                    />

                    <Typography variant="body1" sx={{ mt: 3, mb: 1 }}>Withdrawal proof receipt detail <span style={{ color: "red" }}>*</span> <span style={{ fontStyle: "italic", opacity: 0.7, fontSize: "12px" }}>
                    ( Upto <span style={{ color: "red" }}>2 mb</span> )</span></Typography>
                    <Box component="label" sx={uploadBoxStyles}>
                        {screenshot ? (
                            <img src={URL.createObjectURL(screenshot)} alt="Receipt Screenshot" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <AddPhotoAlternateIcon sx={{ color: "#FDE4BC", fontSize: 45 }} />
                        )}
                        <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                    </Box>

                    <Button
                        variant="contained"
                        sx={{ mt: 3, background: "linear-gradient(90deg,#24ee89,#9fe871)", borderRadius: 4,textTransform:"none","&:disabled": {
                            background: "#454456", // Disabled color
                            color: "#A8A5A1", // Adjust text color for better readability
                          }, }}
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
                    >
                        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
                    </Snackbar> */}
                </Box>
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
            </Container>
        </Mobile>
    )
}

// Styles
const inputStyles = {
    bgcolor: "#323738",
  input: { color: "#f5f3f0",height:"15px",fontSize:"14px" },
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
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 100, height: 100, bgcolor: "#333", borderRadius: 2, cursor: "pointer", overflow: "hidden"
}

export default WithdrawalIssue