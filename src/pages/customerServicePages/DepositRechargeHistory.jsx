import React, { useContext, useEffect, useState } from 'react'
import Mobile from '../../components/layout/Mobile'
import { Box, Container, Typography, CircularProgress } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { UserContext } from '../../context/UserState'
import { domain } from '../../utils/Secret'
import TMSDepositCard from '../../components/tms/TMSDepositCard'
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import HomeIcon from "@mui/icons-material/Home"
import { useNavigate } from 'react-router-dom'
import NoDataImage from "/assets/No data-1.webp";
const DepositRechargeHistory = () => {
    const [error, setError] = useState("")
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
    const [depositRechargeHistory, setDepositRechargeHistory] = useState([])
    const [loading, setLoading] = useState(false)
    const { axiosInstance } = useAuth()
    const { userData } = useContext(UserContext)
    const navigate = useNavigate()
    const fetchDepositRechargeHistory = async () => {
        setLoading(true)
        let allHistory = [];
        try {
            const pendingRes = await axiosInstance.get(`${domain}/api/wallet/deposit/history`, {
                params: {
                    userId: userData.uid,
                    status: "PENDING",
                    page: 1,
                    pageSize: 10,
                    sortOrder: "desc"
                }
            });

            allHistory = [...pendingRes.data.data];

            // Fetch CANCELLED deposits
            const cancelledRes = await axiosInstance.get(`${domain}/api/wallet/deposit/history`, {
                params: {
                    userId: userData.uid,
                    status: "CANCELLED",
                    page: 1,
                    pageSize: 10,
                    sortOrder: "desc"
                }
            });

            allHistory = [...allHistory, ...cancelledRes.data.data];
            allHistory.sort((a, b) => new Date(b.depositDate) - new Date(a.depositDate));
            setDepositRechargeHistory(allHistory);
        } catch (error) {
            setSnackbar({ open: true, message: "Error fetching deposit history. Try again.", severity: "error" })
            console.error("Error:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userData?.uid) {  // Ensure userData.uid is available before calling API
            fetchDepositRechargeHistory();
        }
        // fetchDepositRechargeHistory()
    }, [userData?.uid])


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
                        Recharge History
                    </Typography>
                    <HomeIcon sx={{ fontSize: 30, cursor: "pointer" }} onClick={() => navigate("/")} />
                </Box>
                <Box sx={{ m: 2, textAlign: "center" }}>
                    {loading ? (
                        <CircularProgress sx={{ color: "#FDE4BC", mt: 5 }} /> // Loader when fetching data
                    ) : depositRechargeHistory.length === 0 ? (
                        <Box sx={{ textAlign: "center", mt: 5 }}>
                            <img src={NoDataImage} alt="No Data" style={{ width: "80%", maxWidth: "300px" }} />
                            <Typography sx={{ color: "#FDE4BC", mt: 2 }}>No deposit history found</Typography>
                        </Box>
                    ) :
                        (depositRechargeHistory && depositRechargeHistory.map((item, index) => (
                            <TMSDepositCard key={index} deposit={item} />
                        )))}
                </Box>
            </Container>
        </Mobile>
    )
}

export default DepositRechargeHistory