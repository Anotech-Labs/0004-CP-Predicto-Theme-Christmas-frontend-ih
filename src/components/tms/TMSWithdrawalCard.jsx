import React, { useEffect } from "react"
import { Box, Button, Typography, Paper } from "@mui/material"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import { useNavigate } from "react-router-dom"
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery"
const TMSWithdrawalCard = ({ withdrawal,fetchWithdrawHistory }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(withdrawal.depositId)
  }
  // useEffect(()=>{
  //   fetchWithdrawHistory()
  // },[])
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(380));
const fontSize= isSmallScreen?"12px":"14px"
  const navigate = useNavigate()

  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: 400, mx: "auto", borderRadius: 2, my: 2, bgcolor: "#323738", color: "#ccc" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button variant="contained" color="success" size="small"  sx={{ textTransform: "none" }}>
          Withdrawal
        </Button>
        <Typography color="error" variant="body2">
        {withdrawal.withdrawStatus.charAt(0).toUpperCase() + withdrawal.withdrawStatus.slice(1).toLowerCase()}
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography color="#f5f3f0"  fontSize={fontSize}>Amount</Typography>
        <Typography color="error"  fontSize={fontSize}>{withdrawal.withdrawAmount}</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography color="#f5f3f0"  fontSize={fontSize}>Type</Typography>
        <Typography color="#A8A5A1"  fontSize={fontSize}>{withdrawal.withdrawMethod.split("_").join(" ")}</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography color="#f5f3f0"  fontSize={fontSize}>Time</Typography>
        <Typography color="#A8A5A1"  fontSize={fontSize}>{new Date(withdrawal.withdrawDate).toLocaleString()}</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography color="#f5f3f0"  fontSize={fontSize} sx={{ textWrap: "nowrap" }}>Order Number</Typography>
        <Box display="flex" alignItems="center">
          <Typography sx={{ ml: 2, textOverflow: "ellipsis" }}color="#A8A5A1"   fontSize={fontSize}>{withdrawal.transactionId}</Typography>
          <Button size="small" onClick={handleCopy} sx={{minWidth:"0",p:"4px 0 4px 4px"}}>
            <ContentCopyIcon fontSize="small"sx={{fontSize:"15px",color:"#A8A5A1"}} />
          </Button>
        </Box>
      </Box>

      <Button
        fullWidth
        variant="contained"
        sx={{ borderRadius: 4, background: "linear-gradient(90deg,#24ee89,#9fe871)", textTransform: "none" }}
        onClick={() => navigate(`/tms/withdrawal-issue?transactionId=${withdrawal.transactionId}&amount=${withdrawal.withdrawAmount}`)}
      >
        Submit Receipt
      </Button>

    </Paper>
  )
}

export default TMSWithdrawalCard