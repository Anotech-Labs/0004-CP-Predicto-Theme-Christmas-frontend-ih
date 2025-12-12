import React, { useContext, useState } from "react"
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Snackbar,
    Alert
} from "@mui/material"
import Mobile from "../../components/layout/Mobile"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { useNavigate } from "react-router-dom"
import HomeIcon from "@mui/icons-material/Home"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import { useAuth } from "../../context/AuthContext"
import { domain } from "../../utils/Secret"
import { UserContext } from "../../context/UserState"

const ChangeBankName = () => {
    const [currentBankName, setCurrentBankName] = useState("")
    const [newBankName, setNewBankName] = useState("")
    const [error, setError] = useState("")
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
    const [loading, setLoading] = useState(false)

    const { axiosInstance } = useAuth()
    const { userData } = useContext(UserContext)
    const navigate = useNavigate()
 const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState("");
    const handleSubmit = async () => {
        if (currentBankName.length <= 1 || newBankName.length <= 1) {
            setError("Please enter valid IFSC codes")
            return
        }
        setError("")
        setLoading(true)

        try {
            const response = await axiosInstance.post(`${domain}/api/ticket/create-ticket`, {
                userId: userData.uid,
                type: "CHANGE_BANK_NAME",
                ticketDetails: {
                    currentBankName,
                    newBankName
                }
            })
            //console.log("response", response)
            setPopupMessage("Request submitted successfully!");
            setIsPopupVisible(true);
            setTimeout(() => {
                setIsPopupVisible(false);
              }, 2000);
            // setSnackbar({ open: true, message: "Password change request submitted successfully!", severity: "success" })
        } catch (err) {
            console.error("Error:", err.response?.data || err.message)
            setPopupMessage("Failed to submit. Try again.");
            setIsPopupVisible(true);
            setTimeout(() => {
                setIsPopupVisible(false);
              }, 2000);
            // setSnackbar({ open: true, message: err.response?.data?.message || "Failed to change password. Try again.", severity: "error" })
        } finally {
            setLoading(false)
        }
    }


    return (
        <Mobile>
            <Container disableGutters maxWidth="xs" sx={{
                bgcolor: "#232626", height: "100vh", display: "flex", flexDirection: "column", "&.MuiContainer-root": {
                    maxWidth: "100%"
                }
            }}>
                <Box sx={{ bgcolor: "#232626", padding: "8px 10px", display: "flex", alignItems: "center", color: "#FDE4BC" }}>
                    <ChevronLeftIcon sx={{ fontSize: 30, cursor: "pointer" }} onClick={() => navigate(-1)} />
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", color: "#FDE4BC" }}>
                        Change Bank Name
                    </Typography>
                    <HomeIcon sx={{ fontSize: 30 }} />
                </Box>

                <Box sx={{ m: 2 }}>
                    <Typography variant="subtitle1" sx={{ color: "#FDE4BC", mt: 1, mb: 1, textAlign: "left" }}>
                        Current Bank Name
                    </Typography>
                    <TextField fullWidth placeholder="Current Bank Name" variant="outlined" value={currentBankName} onChange={(e) => setCurrentBankName(e.target.value)} sx={inputStyles} />
                    <Typography variant="subtitle1" sx={{ color: "#FDE4BC", mt: 3, mb: 1, textAlign: "left" }}>
                        New Bank Name
                    </Typography>
                    <TextField
                        fullWidth
                        type="text"
                        placeholder="New Bank Name"
                        variant="outlined"
                        autoComplete="new-password"
                        value={newBankName}
                        onChange={(e) => setNewBankName(e.target.value)}
                        sx={inputStyles} />
                    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
                    <Button variant="contained" fullWidth sx={{
                        background: "linear-gradient(90deg,#24ee89,#9fe871)", color: "white", borderRadius: 4, mt: 2,
                        textTransform: "none", "&:disabled": {
                            background: "#454456", // Disabled color
                            color: "#A8A5A1", // Adjust text color for better readability
                        },
                    }} onClick={handleSubmit} disabled={loading}>{loading ? "Submitting..." : "Confirm"}</Button>
                </Box>
                {/* <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
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
export default ChangeBankName
