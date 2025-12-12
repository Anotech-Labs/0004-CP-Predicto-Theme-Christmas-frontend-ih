import React, { useContext, useState } from "react"
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert,
    // IconButton,
    Select,
    MenuItem
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
const ModifyBankDetails = () => {
    const [modificationType, setModificationType] = useState("Account Change")
    const [oldBankName, setOldBankName] = useState("")
    const [oldBeneficiaryName, setOldBeneficiaryName] = useState("")
    const [oldAccountNumber, setOldAccountNumber] = useState("")
    const [oldIFSC, setOldIFSC] = useState("")
    const [newBankName, setNewBankName] = useState("")
    const [newBeneficiaryName, setNewBeneficiaryName] = useState("")
    const [newAccountNumber, setNewAccountNumber] = useState("")
    const [newIFSC, setNewIFSC] = useState("")
    const [screenshot, setScreenshot] = useState(null)
    const [error, setError] = useState("")
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
    const [loading, setLoading] = useState(false)
 const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState("");
    const { axiosInstance } = useAuth()
    const { userData } = useContext(UserContext)
    const navigate = useNavigate()

    const handleImageUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            setScreenshot(file)
        }
    }

    const handleSubmit = async () => {
        // Validate all required fields
        if (!oldBankName || !oldBeneficiaryName || !oldAccountNumber || !oldIFSC ||
            !newBankName || !newBeneficiaryName || !newAccountNumber || !newIFSC || !screenshot) {
setPopupMessage("All fields are required!");
                setIsPopupVisible(true);
                setTimeout(() => {
                    setIsPopupVisible(false);
                  }, 2000);
                // setSnackbar({ open: true, message: "All fields are required!", severity: "error" })
            return
        }

        setLoading(true) // Start loading

        const ticketDetails = {
            modificationType,
            oldBankName,
            oldBeneficiaryName,
            oldAccountNumber,
            oldIFSC,
            newBankName,
            newBeneficiaryName,
            newAccountNumber,
            newIFSC,
        }

        try {
            const formData = new FormData()
            formData.append("userId", userData.uid.toString()) // Ensure userId is a string
            formData.append("type", "MODIFY_BANK_INFO")
            formData.append("ticketDetails", JSON.stringify(ticketDetails))
            formData.append("files", screenshot, screenshot.name) // Attach file properly

            const response = await axiosInstance.post(`${domain}/api/ticket/create-ticket`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            setPopupMessage("Bank details updated successfully!");
            setIsPopupVisible(true);
            setTimeout(() => {
                setIsPopupVisible(false);
              }, 2000);
            // setSnackbar({ open: true, message: "Bank details updated successfully!", severity: "success" })
            //console.log("Response:", response.data)

            // Clear form after success
            setOldBankName("")
            setOldBeneficiaryName("")
            setOldAccountNumber("")
            setOldIFSC("")
            setNewBankName("")
            setNewBeneficiaryName("")
            setNewAccountNumber("")
            setNewIFSC("")
            setScreenshot(null)
        } catch (error) {
            setPopupMessage("Failed to update bank details. Try again.");
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
                bgcolor: "#232626", height: "100vh", display: "flex", flexDirection: "column", "&.MuiContainer-root": {
                    maxWidth: "100%",
                }
            }}>
                {/* Header */}
                <Box sx={{ bgcolor: "#232626", padding: "8px 10px", display: "flex", alignItems: "center", color: "#FDE4BC" }}>
                    <ChevronLeftIcon sx={{ fontSize: 30, cursor: "pointer" }} onClick={() => navigate(-1)} />
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", color: "#FDE4BC" }}>
                        Modify Bank Details
                    </Typography>
                    <HomeIcon sx={{ fontSize: 30, cursor: "pointer" }} onClick={() => navigate("/")} />
                </Box>

                {/* Form Fields */}
                <Box sx={{ m: 2, textAlign: "left" }}>
                    {/* User ID */}
                    <Typography variant="subtitle1" sx={{ color: "#FDE4BC", mt: 1, mb: 1, }}>
                        Select modification <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Select
                        fullWidth
                        value={modificationType}
                        // disabled
                        sx={{
                            bgcolor: "#323738",
                            borderRadius: 1,
                            color: "#A8A5A1",height:"50px",
                            "& .MuiSelect-icon": { color: "#A8A5A1" },
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#3B3833" },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#3B3833" },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3B3833" },
                            "& .MuiSelect-select": { color: "#A8A5A1" }
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    bgcolor: "#323738", // Dropdown menu background color
                                    // borderRadius: "8px",
                                    "& .MuiMenuItem-root": {
                                        color: "#A8A5A1", // Text color in dropdown
                                        bgcolor: "#323738",
                                        padding: "10px 16px", // Adjusted padding
                                        //   border: "1px solid #3B3833"
                                    },
                                    "& .MuiMenuItem-root:hover": {
                                        bgcolor: "transparent", // Slightly lighter on hover
                                    },
                                    "& .MuiMenuItem-root.Mui-selected": {
                                        bgcolor: "transparent", // Slightly lighter on hover
                                    },

                                },
                            },
                        }}
                    >
                        <MenuItem value="Account Change">Account Change</MenuItem>
                    </Select>

                    {/* Old Bank Details */}
                    <Typography variant="subtitle1" sx={{ color: "#FDE4BC", mt: 3, mb: 1, }}>Old Bank Name <span style={{ color: "red" }}>*</span></Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter old bank name"
                        value={oldBankName}
                        onChange={(e) => setOldBankName(e.target.value)}
                        sx={inputStyles}
                    />

                    <Typography variant="subtitle1" sx={{ color: "#FDE4BC", mt: 3, mb: 1, }}>Old Beneficiary Name <span style={{ color: "red" }}>*</span></Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter old beneficiary name"
                        value={oldBeneficiaryName}
                        onChange={(e) => setOldBeneficiaryName(e.target.value)}
                        sx={inputStyles}
                    />

                    <Typography variant="subtitle1" sx={{ color: "#FDE4BC", mt: 3, mb: 1, }}>Old Account Number <span style={{ color: "red" }}>*</span></Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter old account number"
                        value={oldAccountNumber}
                        onChange={(e) => setOldAccountNumber(e.target.value)}
                        sx={inputStyles}
                    />

                    <Typography variant="subtitle1" sx={{ color: "#FDE4BC", mt: 3, mb: 1, }}>Old IFSC Code <span style={{ color: "red" }}>*</span></Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter old IFSC code"
                        value={oldIFSC}
                        onChange={(e) => setOldIFSC(e.target.value)}
                        sx={inputStyles}
                    />

                    {/* New Bank Details */}
                    <Typography variant="subtitle1" sx={{ color: "#FDE4BC", mt: 3, mb: 1, }}>New Bank Name <span style={{ color: "red" }}>*</span></Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter new bank name"
                        value={newBankName}
                        onChange={(e) => setNewBankName(e.target.value)}
                        sx={inputStyles}
                    />

                    <Typography variant="subtitle1" sx={{ color: "#FDE4BC", mt: 3, mb: 1, }}>New Beneficiary Name <span style={{ color: "red" }}>*</span></Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter new beneficiary name"
                        value={newBeneficiaryName}
                        onChange={(e) => setNewBeneficiaryName(e.target.value)}
                        sx={inputStyles}
                    />

                    <Typography variant="subtitle1" sx={{ color: "#FDE4BC", mt: 3, mb: 1, }}>New Account Number <span style={{ color: "red" }}>*</span></Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter new account number"
                        value={newAccountNumber}
                        onChange={(e) => setNewAccountNumber(e.target.value)}
                        sx={inputStyles}
                    />

                    <Typography variant="subtitle1" sx={{ color: "#FDE4BC", mt: 3, mb: 1, }}>New IFSC Code <span style={{ color: "red" }}>*</span></Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter new IFSC code"
                        value={newIFSC}
                        onChange={(e) => setNewIFSC(e.target.value)}
                        sx={inputStyles}
                    />

                    {/* Bank Details Screenshot */}
                    <Typography variant="subtitle1" sx={{ color: "#FDE4BC", mt: 3, mb: 1, }}>Bank Details Screenshot <span style={{ color: "red" }}>*</span> <span style={{ fontStyle: "italic", opacity: 0.7, fontSize: "12px" }}>
                    ( Upto <span style={{ color: "red" }}>2 mb</span> )</span></Typography>
                    <Box component="label" sx={{ width: 100, height: 100, bgcolor: "#323738", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2, cursor: "pointer", overflow: "hidden", border: "1px solid #3B3833" }}>
                        {screenshot ? <img src={URL.createObjectURL(screenshot)} alt="Screenshot" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> :
                            <AddPhotoAlternateIcon sx={{ color: "#FDE4BC", fontSize: 45 }} />}
                        <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                    </Box>

                    {/* Submit Button */}
                    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
                    <Button variant="contained" fullWidth sx={{
                        background: "linear-gradient(90deg,#24ee89,#9fe871)", color: "white", borderRadius: 4, mt: 2, mb: 4,
                        textTransform: "none", "&:disabled": {
                            background: "#454456", // Disabled color
                            color: "#A8A5A1", // Adjust text color for better readability
                        },
                    }} onClick={handleSubmit} disabled={loading}>
                        {loading ? "Submitting..." : "Confirm"}
                    </Button>
                </Box>
                {/* <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
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
    input: { color: "#f5f3f0" ,fontSize:"14px",height:"15px"},
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
export default ModifyBankDetails
