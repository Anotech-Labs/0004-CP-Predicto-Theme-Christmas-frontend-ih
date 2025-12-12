import React from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import { useContext } from 'react';
import { UserContext } from "../../context/UserState";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useNavigate } from 'react-router-dom';
const TopBanner = () => {
    const navigate = useNavigate()
    const { userWallet, getWalletBalance } =
        useContext(UserContext);
    const handleRefresh = () => {
        getWalletBalance()
    }
    return (
        <Paper sx={{
            // margin: "0 16px",
            mx: "auto",
            my:3,
            borderRadius: 3,
            boxShadow: 'none',
            backgroundColor: 'transparent',
            // width: 'calc(100% - 30px)',
            // mt: 0.5
            // maxWidth: 400,
        }}>
           
            <Box >
                <Box sx={{  display: "flex", justifyContent: "space-between",gap:1.8}}>
                    <Grid sx={{}}>
                        <Box
                            // onClick={() => navigate("/lucky-spinner")}
                            sx={{
                                borderRadius: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                // padding: 1.5,
                                cursor: 'pointer',
                                color: '#fff',
                                fontWeight: 'bold',
                                // height: 56,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >

                            <img src="/assets/walletCard/wheel.webp" alt="VIP" style={{ width: "100%", }} />
                        </Box>
                    </Grid>
                    <Grid >
                        <Box
                            onClick={() => navigate("/account/vip")}
                            sx={{
                                borderRadius: 5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                // padding: 1.5,
                                cursor: 'pointer',
                                color: '#fff',
                                fontWeight: 'bold',
                                // height: 56,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',

                            }}
                        >
                            <img src="/assets/walletCard/VIP.webp" alt="VIP" style={{ width: "100%", }} />
                        </Box>
                    </Grid>
                </Box>
            </Box>
        </Paper>
    );
};

export default TopBanner;