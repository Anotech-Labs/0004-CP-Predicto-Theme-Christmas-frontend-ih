import React, { useContext, useState, useEffect } from "react"
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert,
    IconButton
} from "@mui/material"
import Mobile from "../../components/layout/Mobile"
import { useNavigate } from "react-router-dom"
import HomeIcon from "@mui/icons-material/Home"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"
import { useAuth } from "../../context/AuthContext"
import { UserContext } from "../../context/UserState"
import { domain } from "../../utils/Secret"

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
const AddUSDT = () => {
    const [USDTAddress, setUSDTAddress] = useState("")
    const [userId, setUserId] = useState("")
    const [screenshot, setScreenshot] = useState(null)
    const [error, setError] = useState("")
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
    const [loading, setLoading] = useState(false)
    const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
    const [popupMessage, setPopupMessage] = useState("");

    const { axiosInstance } = useAuth()
    const { userData } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (userData?.uid) {
            setUserId(userData.uid) // Only once when userData is loaded
        }
    }, [userData])
    const handleImageUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            setScreenshot(file)
        }
    }

    const handleSubmit = async () => {
        if (!userId || !USDTAddress || !screenshot) {
            setPopupMessage("All fields are required!")
            setIsPopupVisible(true);
            setTimeout(() => {
                setIsPopupVisible(false);
            }, 2000);
            // setSnackbar({ open: true, message: "All fields are required!", severity: "error" })
            return
        }

        setLoading(true) // Start loading

        try {
            const formData = new FormData()
            formData.append("userId", userId.toString()) // Ensure it's a string
            formData.append("type", "ADD_USDT_ADDRESS")
            formData.append("ticketDetails", JSON.stringify({ usdtAddress: USDTAddress }))
            formData.append("files", screenshot, screenshot.name) // Ensure correct file format

            const response = await axiosInstance.post(`${domain}/api/ticket/create-ticket`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            setPopupMessage("USDT Address change request submitted successfully!")
            setIsPopupVisible(true);
            setTimeout(() => {
                setIsPopupVisible(false);
            }, 2000);
            // setSnackbar({ open: true, message: "USDT Address added successfully!", severity: "success" })
            //console.log("Response:", response.data)

            // Clear form after success
            setUserId("")
            setUSDTAddress("")
            setScreenshot(null)
        } catch (error) {
            setPopupMessage("Failed to submit. Try again.")
            setIsPopupVisible(true);
            setTimeout(() => {
                setIsPopupVisible(false);
            }, 2000);
            // setSnackbar({ open: true, message: "Failed to submit. Try again.", severity: "error" })
            console.error("Error:", error)
        } finally {
            setLoading(false) // Stop loading
        }
    }

    return (
        <Mobile>
            <Container disableGutters maxWidth="xs" sx={{
                bgcolor: "#232626", height: "100vh", display: "flex", flexDirection: "column",
                "&.MuiContainer-root": {
                    maxWidth: "100%"
                }
            }}>
                {/* Header */}
                <Box sx={{ bgcolor: "#232626", padding: "8px 10px", display: "flex", alignItems: "center", color: "#FDE4BC" }}>
                    <ChevronLeftIcon sx={{ fontSize: 30, cursor: "pointer" }} onClick={() => navigate(-1)} />
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", color: "#FDE4BC" }}>
                        Add USDT Address
                    </Typography>
                    <HomeIcon sx={{ fontSize: 30, cursor: "pointer" }} onClick={() => navigate("/")} />
                </Box>

                {/* Form Fields */}
                <Box sx={{ m: 2 }}>
                    {/* User ID */}
                    <Typography variant="subtitle1" sx={{ color: "#FDE4BC", mt: 1, mb: 1, textAlign: "left" }}>
                        User ID <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField
                        fullWidth
                        // type="number"
                        placeholder="Please enter User ID"
                        variant="outlined"
                        value={userId}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "") // Remove non-numeric characters
                            setUserId(value)
                        }}
                        sx={inputStyles}
                        inputProps={{ min: 1 }}
                    />

                    {/* USDT Address */}
                    <Typography variant="subtitle1" sx={{ color: "#FDE4BC", mt: 3, mb: 1, textAlign: "left" }}>
                        USDT Address <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField
                        fullWidth
                        type="text"
                        placeholder="Please enter USDT address"
                        variant="outlined"
                        value={USDTAddress}
                        onChange={(e) => setUSDTAddress(e.target.value)}
                        error={USDTAddress.length > 0 && (USDTAddress.length < 26 || USDTAddress.length > 100)}
                        helperText={
                            USDTAddress.length > 0 && (USDTAddress.length < 26 || USDTAddress.length > 100)
                                ? 'USDT address must be between 26 and 100 characters'
                                : ''
                        }
                        sx={inputStyles}
                    />

                    {/* USDT Address Screenshot */}
                    <Typography variant="subtitle1" sx={{ color: "#FDE4BC", mt: 3, mb: 1, textAlign: "left" }}>
                        USDT Address Screenshot  <span style={{ color: "red" }}>*</span> <span style={{ fontStyle: "italic", opacity: 0.7, fontSize: "12px" }}>
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
                                <AddPhotoAlternateIcon sx={{ color: "#FDE4BC", fontSize: 45 }} />
                                <Typography variant="caption" sx={{ color: "gray" }}>photo</Typography>
                            </Box>
                        )}
                        <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                    </Box>

                    {/* Submit Button */}
                    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
                    <Button variant="contained" fullWidth sx={{
                        background: "linear-gradient(90deg,#24ee89,#9fe871)", color: "white", borderRadius: 4, mt: 2,
                        textTransform: "none", "&:disabled": {
                            background: "#454456", // Disabled color
                            color: "#A8A5A1", // Adjust text color for better readability
                        },
                    }} onClick={handleSubmit} disabled={loading}>
                        {loading ? "Submitting..." : "Confirm"}
                    </Button>
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
const inputStyles = {
    bgcolor: "#323738",
    input: { color: "#f5f3f0", height: "15px", fontSize: "14px" },
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
        },
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
export default AddUSDT
