import React from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import { useContext } from 'react';
import { UserContext } from "../../context/UserState";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useNavigate } from 'react-router-dom';
const WalletComponent = () => {
    const navigate = useNavigate()
    const { userWallet, getWalletBalance } =
        useContext(UserContext);
    const handleRefresh = () => {
        getWalletBalance()
    }
    return (
        <Paper sx={{
            margin: "0 16px",
            borderRadius: 3,
            boxShadow: 'none',
            backgroundColor: '#05012B',
            width: 'calc(100% - 30px)',
            mt: 2.5
            // maxWidth: 400,
        }}>
            <Box sx={{ display: 'flex', justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                {/* Wallet Balance */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                        <img src="/assets/activity/cointri.webp" alt="" style={{ width: "12px" }} />
                        <Typography variant="body2" color="#92A8E3" fontSize="11px">Wallet balance</Typography>
                    </Box>

                    {/* Amount Display */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography component="div" sx={{ fontWeight: 'bold', fontSize: "17px" ,color:"#ffffff"}}>
                            ₹{`${userWallet ? parseFloat(userWallet).toFixed(2) : "Loading"}`}
                        </Typography>
                        <CachedIcon onClick={handleRefresh} sx={{ color: '#aaa', fontSize: 20, cursor: "pointer" }} />
                    </Box>
                </Box>
                {/* Buttons */}
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: "10px", width: "45%" }}>
                    <Grid sx={{ width: "100%" }}>
                        <Button
                            onClick={() => navigate("/wallet/withdraw")}
                            fullWidth
                            sx={{
                                borderRadius: 2,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textTransform: "none",
                                color: "#fff",

                                backgroundImage: 'url("/assets/walletcard/withdraw.svg")',
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                height: 44,
                                // lineHeight:1
                                p: 0.5
                                // gap: "2px", // Decrease this to reduce space between icon and text
                            }}
                        >
                            <ArrowUpwardIcon sx={{ fontSize: "18px" }} />
                            <Typography sx={{ fontSize: "12.8px", lineHeight: "1" }}>Withdraw</Typography>

                        </Button>
                    </Grid>
                    <Grid sx={{ width: "100%" }}>
                        <Button
                            onClick={() => navigate("/wallet/deposit")}
                            fullWidth
                            sx={{
                                borderRadius: 2,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textTransform: "none",
                                color: "#fff",

                                backgroundImage: 'url("/assets/walletcard/deposit.svg")',
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                height: 44,
                                // lineHeight:1
                                p: 1
                                // gap: "2px", // Decrease this to reduce space between icon and text
                            }}
                        >
                            <ArrowDownwardIcon sx={{ fontSize: "18px" }} />
                            <Typography sx={{ fontSize: "12.8px", lineHeight: "1" }}>Deposit</Typography>

                        </Button>

                    </Grid>
                </Box>
            </Box>
        </Paper>
    );
};

export default WalletComponent;