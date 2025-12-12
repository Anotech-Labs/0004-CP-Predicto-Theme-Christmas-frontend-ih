import React, { useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useAuth } from '../../context/AuthContext';
import { domain } from '../../utils/Secret';
import Mobile from '../../components/layout/Mobile';
import { useNavigate } from 'react-router-dom';

const InvitationRecord = () => {
    const navigate = useNavigate();
    const { axiosInstance } = useAuth();
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const handleBackClick = () => {
        navigate(-1);
    };


    const fetchReferrals = async () => {
        try {
            const response = await axiosInstance.get(`${domain}/api/activity/invitation-bonus/history`, {
                withCredentials: true,
            });
            if (response.data.success) {
                setReferrals(response.data.data.referrals.data);
            } else {
                setError('Failed to fetch referral data.');
            }
        } catch (err) {
            setError(`Error loading referral data: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchReferrals();
    }, [axiosInstance]);

    return (
        <Mobile>
            <Box sx={{ bgcolor: '#232626', minHeight: '100vh', maxWidth: 'sm', mx: 'auto' }}>
                {/* App Bar */}
                <Grid
                    container
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1000,
                        backgroundColor: '#323738',
                        padding: "7px 12px",
                    }}
                >
                    <Grid item xs={12} container alignItems="center" justifyContent="center">
                        <IconButton sx={{ color: '#F5F3F0', position: 'absolute', left: 0, p: "12px" }} onClick={handleBackClick}>
                            <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
                        </IconButton>
                        <Typography variant="h6" sx={{ color: '#F5F3F0', textAlign: 'center', fontSize: "19px" }}>
                            Invitation record
                        </Typography>
                    </Grid>
                </Grid>

                {/* Referral List */}
                <Box sx={{ mb: 4, p: 2 }}>
                    {loading ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Typography color="error" sx={{ textAlign: 'center', py: 4 }}>
                            {error}
                        </Typography>
                    ) : referrals.length === 0 ? (
                        <Box sx={{ textAlign: "center", mt: 5 }}>
                            <img src="/assets/No data-1.webp" alt="No Data" style={{ width: "80%", maxWidth: "300px" }} />
                            <Typography sx={{ color: "white", mt: 2 }}>No withdrawal history found</Typography>
                        </Box>
                    ) : (
                        <List>
                            {referrals.map((item) => (
                                <Box
                                    key={item.uid}
                                    sx={{
                                        background: '#323738',
                                        borderRadius: '12px',
                                        padding: '10px',
                                        mb: 2,
                                    }}
                                >
                                    <ListItem disableGutters>
                                        <Box sx={{ width: '100%' }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mb: 1,
                                                }}
                                            >
                                                <Typography sx={{ fontWeight: "400", fontSize: "16px", color: "#F5F3F0" }} >
                                                    {item.userName}
                                                </Typography>
                                                <Typography sx={{ fontWeight: "400", fontSize: "16px", color: "#A8A5A1" }}>
                                                    UID: {item.uid}
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mb: 1,
                                                }}
                                            >
                                                <Typography sx={{ fontWeight: "400", fontSize: "12.8px", color: "#A8A5A1" }} >
                                                    Registration time:
                                                </Typography>
                                                <Typography sx={{ fontWeight: "400", fontSize: "12.8px", color: "#A8A5A1" }}>
                                                    <Typography variant="body2" color="A8A5A1">
                                                        {new Date(item.registrationDate).toLocaleString('en-GB').replace(',', '')}
                                                    </Typography>

                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mb: 1,
                                                }}
                                            >
                                                <Typography sx={{ fontWeight: "400", fontSize: "14.9332px", color: "#A8A5A1" }} >
                                                    Deposit amount:
                                                </Typography>
                                                <Typography sx={{ fontWeight: "400", fontSize: "14.9332px", color: "#FEAA57" }}>
                                                    ₹{item.totalDeposits}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                </Box>
                            ))}
                        </List>
                    )}
                </Box>

            </Box>
        </Mobile>
    );
};

export default InvitationRecord;
