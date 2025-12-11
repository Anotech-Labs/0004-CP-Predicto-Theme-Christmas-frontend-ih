import React, { useContext, useEffect, useState } from 'react'
import Mobile from '../../components/layout/Mobile'
import { Box, Container, Typography,CircularProgress  } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { UserContext } from '../../context/UserState'
import { domain } from '../../utils/Secret'
import TMSDepositCard from '../../components/tms/TMSDepositCard'
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import HomeIcon from "@mui/icons-material/Home"
import { useNavigate } from 'react-router-dom'
import TMSWithdrawalCard from '../../components/tms/TMSWithdrawalCard'
import NoDataImage from "/assets/No data-1.webp";
const WithdrawalHistory = () => {
        const [error, setError] = useState("")
        const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
        const [withdrawalHistory, setWithdrawalHistory ] = useState([])
        const [loading, setLoading] = useState(false)
        const { axiosInstance } = useAuth()
        const { userData } = useContext(UserContext)
        const navigate = useNavigate()
        const fetchWithdrawHistory = async () => {
          setLoading(true); // Start loading
          let allHistory = [];
          try {
              const pendingRes = await axiosInstance.get(`${domain}/api/wallet/withdraw/history`, {
                  params: {
                      userId: userData.uid,
                      status: "PENDING",
                      page: 1,
                      pageSize: 10,
                      sortOrder: "desc"
                  }
              })
              allHistory = [...pendingRes.data.data];
              const cancelledRes = await axiosInstance.get(`${domain}/api/wallet/withdraw/history`, {
                params: {
                    userId: userData.uid,
                    status: "REJECTED",
                    page: 1,
                    pageSize: 10,
                    sortOrder: "desc"
                }
            })
            allHistory = [...allHistory, ...cancelledRes.data.data];
            allHistory.sort((a, b) => new Date(b.depositDate) - new Date(a.depositDate));
              //console.log("response.data", allHistory)
              setWithdrawalHistory(allHistory)
          } catch (error) {
              setSnackbar({ open: true, message: "Error fetching withdraw history. Try again.", severity: "error" })
              console.error("Error:", error)
          } finally {
              setLoading(false)
          }
      }

    useEffect(() => {
        if (userData?.uid) { 
        fetchWithdrawHistory()
        }
    }, [userData?.uid])
    

  return (
    <Mobile>
    <Container disableGutters maxWidth="xs" sx={{
        position:"sticky",zIndex:1000,
        bgcolor: "#232626", height: "100vh", display: "flex", flexDirection: "column", "&.MuiContainer-root": {
            maxWidth: "100%"
        }
    }}>
         <Box sx={{ bgcolor: "#232626", padding: "8px 10px", display: "flex", alignItems: "center", color: "#FDE4BC" }}>
                    <ChevronLeftIcon sx={{ fontSize: 30, cursor: "pointer" }} onClick={() => navigate(-1)} />
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", color: "#FDE4BC" }}>
                        Withdrawal History
                    </Typography>
                    <HomeIcon sx={{ fontSize: 30 ,cursor:"pointer"}} onClick={() => navigate("/")} />
                </Box>
                 {/* Withdrawal History Section */}

                <Box sx={{ m: 2, textAlign: "center" }} >
          {loading ? (
            <CircularProgress sx={{ color: "#FDE4BC", mt: 5 }} /> // Loader when fetching data
          ) : withdrawalHistory.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <img src={NoDataImage} alt="No Data" style={{ width: "80%", maxWidth: "300px" }} />
              <Typography sx={{ color: "#FDE4BC", mt: 2 }}>No withdrawal history found</Typography>
            </Box>
          ) : (
            withdrawalHistory && withdrawalHistory.map((item, index) => (
              <TMSWithdrawalCard key={index} withdrawal={item} fetchWithdrawHistory={fetchWithdrawHistory} />
            ))
          )}
        </Box>
        </Container>
        </Mobile>
  )
}

export default WithdrawalHistory