import React, { useState,useContext,useEffect } from "react"
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert,
} from "@mui/material"
import Mobile from "../../components/layout/Mobile"
import { useNavigate } from "react-router-dom"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import HomeIcon from "@mui/icons-material/Home"
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"
import { useAuth } from "../../context/AuthContext"
import { domain } from "../../utils/Secret"
import { UserContext } from "../../context/UserState"

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
const ActivityBonus = () => {
    const [bonusDescription, setBonusDescription] = useState("")
    const [userId, setUserId] = useState("")
    const [screenshot, setScreenshot] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
    const [loading, setLoading] = useState(false)

    const { axiosInstance } = useAuth()
        const { userData } = useContext(UserContext)
    const navigate = useNavigate()
    const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
    const [popupMessage, setPopupMessage] = useState("");

     useEffect(() => {
            if (userData?.uid) {
                setUserId(userData.uid) // Only once when userData is loaded
            }
        }, [userData])
    const handleImageUpload = (event) => {
        const file = event.target.files[0]
        if (file) setScreenshot(file)
    }

    const handleSubmit = async () => {
        if (!bonusDescription || !userId || !screenshot) {
            setPopupMessage("All fields are required!")
            setIsPopupVisible(true);
            setTimeout(() => {
                setIsPopupVisible(false);
            }, 2000);
            // setSnackbar({ open: true, message: "All fields are required!", severity: "error" })
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("userId", userId)
            formData.append("type", "ACTIVITY_BONUS")
            formData.append("ticketDetails", JSON.stringify({ bonusDescription, userId: parseInt(userId) }))
            formData.append("files", screenshot, screenshot.name)

            await axiosInstance.post(`${domain}/api/ticket/create-ticket`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            setPopupMessage("Request submitted successfully!")
            setIsPopupVisible(true);
            setTimeout(() => {
                setIsPopupVisible(false);
            }, 2000);
            // setSnackbar({ open: true, message: "Request submitted successfully!", severity: "success" })

            // Clear form
            setUserId("")
            setBonusDescription("")
            setScreenshot(null)
        } catch (error) {
            setPopupMessage("Failed to submit. Try again.")
            setIsPopupVisible(true);
            setTimeout(() => {
                setIsPopupVisible(false);
            }, 2000);
            // setSnackbar({ open: true, message: "Failed to submit. Try again.", severity: "error" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Mobile>
            <Container disableGutters maxWidth="xs" sx={{
                bgcolor: "#232626", height: "100vh", display: "flex", flexDirection: "column"
            }}>
                {/* Header */}
                <Box sx={{ bgcolor: "#232626", padding: "12px 10px", display: "flex", alignItems: "center" }}>
                    <ChevronLeftIcon sx={{ fontSize: 30, cursor: "pointer", color: "#FDE4BC" }} onClick={() => navigate(-1)} />
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold", color: "#FDE4BC" }}>
                        Activity Bonus
                    </Typography>
                    <HomeIcon sx={{ fontSize: 30, color: "#FDE4BC", cursor: "pointer" }} onClick={() => navigate("/")} />
                </Box>

                {/* Form Fields */}
                <Box sx={{ m: 2, textAlign: "left" }}>
                    {/* Bonus Description */}
                    <Typography variant="subtitle1" sx={{ color: "#FDE4BC", mt: 1, mb: 1, }}>
                        Please clearly explain the bonus you wish to claim. <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Please enter content"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={bonusDescription}
                        onChange={(e) => setBonusDescription(e.target.value)}
                        sx={inputStyles}
                        inputProps={{ maxLength: 500 }}
                    />
                    <Typography sx={{ textAlign: "right", color: "#999", fontSize: "12px" }}>
                        {bonusDescription.length}/500
                    </Typography>

                    {/* Daman ID */}
                    <Typography variant="subtitle1" sx={{ color: "#FDE4BC", mt: 1, mb: 1, }}>
                        User ID <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Please enter User ID"
                        variant="outlined"
                        value={userId}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "") // Remove non-numeric characters
                            setUserId(value)
                        }}
                        type="tel" // Ensures numeric keyboard on mobile
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" ,min: 1}} // Restricts input to numbers
                        sx={inputStyles}
                    />


                    {/* Screenshot Upload */}
                    <Typography variant="subtitle1" sx={{ color: "#FDE4BC", mt: 3, mb: 1, }}>
                        Please attach the screenshot <span style={{ color: "red" }}>*</span> <span style={{ fontStyle: "italic", opacity: 0.7, fontSize: "12px" }}>
                            ( Upto <span style={{ color: "red" }}>2 mb</span> )
                        </span>

                    </Typography>
                    <Box
                        sx={{
                            width: 100,
                            height: 100,
                            bgcolor: "#333",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 2,
                            // border: "1px dashed #C4C4C4",
                            cursor: "pointer",
                            overflow: "hidden",
                            position: "relative"
                        }}
                        component="label"
                    >
                        {screenshot ? (
                            <img src={URL.createObjectURL(screenshot)} alt="Screenshot" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <AddPhotoAlternateIcon sx={{ color: "#ccc", fontSize: 45 }} />
                                <Typography variant="caption" sx={{ color: "#ccc" }}>photo</Typography>
                            </Box>
                        )}
                        <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                    </Box>

                    {/* Submit Button */}
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            background: "linear-gradient(90deg,#24ee89,#9fe871)",
                            color: "white",
                            borderRadius: 4,
                            mt: 3,
                            textTransform: "none",
                            fontSize: "16px", "&:disabled": {
                                background: "#454456", // Disabled color
                                color: "#A8A5A1", // Adjust text color for better readability
                            },
                        }}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Confirm"}
                    </Button>
                </Box>

                {/* Snackbar for feedback */}
                {/* <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
                        {snackbar.message}
                    </Alert>
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
            </Container>
        </Mobile>
    )
}
const inputStyles = {
    bgcolor: "#323738",
    input: { color: "#f5f3f0", height: "15px", fontSize: "14px" },
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
        },
    "& .MuiOutlinedInput-root": {
        color: "#f5f3f0",
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
export default ActivityBonus