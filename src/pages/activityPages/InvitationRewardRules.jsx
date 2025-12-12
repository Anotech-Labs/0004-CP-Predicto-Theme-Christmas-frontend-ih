import React, { useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import useTheme from "@mui/material/styles/useTheme";
import CircularProgress from "@mui/material/CircularProgress";

import Grid from '@mui/material/Grid';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useAuth } from '../../context/AuthContext';
import { domain } from "../../utils/Secret";
import Mobile from "../../components/layout/Mobile";
import { useNavigate } from "react-router-dom";
import SvgIcon from '@mui/material/SvgIcon';


const RhombusIcon = (props) => (
    <SvgIcon {...props}>
        <path d="M12 2L22 12L12 22L2 12L12 2Z" />
    </SvgIcon>
);
const InvitationRewardRules = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { axiosInstance } = useAuth();
    const [rewardData, setRewardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleBackClick = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchRewardRules = async () => {
            try {
                const response = await axiosInstance.get(`${domain}/api/activity/invitation-bonus/rules`, {
                    withCredentials: true,
                });

                if (response.data.success) {
                    setRewardData(response.data.data);
                } else {
                    setError('Failed to fetch reward rules');
                }
            } catch (err) {
                setError('Error loading reward rules: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRewardRules();
    }, [axiosInstance]);

    function InvitationRules() {
        return (
            <Paper sx={{ mb: 2, overflow: "hidden", borderRadius: "5px", margin: 0,background:"#323738"}}>
                <Box
                    sx={{
                        background: "#cf7c10",
                        py: 0.5,
                        maxWidth: 200,
                        margin: "0 auto",
                        px: 2,
                        textAlign: "center",
                        borderBottomLeftRadius: "50px",
                        borderBottomRightRadius: "50px",
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", color: "white" }}
                    >
                        Rules
                    </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                    {[
                        "Only when the number of invited accounts is reached and each account can meet the recharge amount can you receive the bonus.",
                        "The invitation account meets the requirements, but the recharge amount of the account does not meet the requirements, and the bonus cannot be claimed.",
                        "Please claim the event bonus within the event period. All bonuses will be cleared after the event expires.",
                        "Please complete the task within the event period. After the event expires, the invitation record will be cleared."
                    ].map((rule, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                alignItems: "start",
                                mt: index === 0 ? 0 : 0,
                                paddingX: "5%",
                            }}
                        >
                            <RhombusIcon
                                sx={{ color: "#FED358", mr: 1, mt: "4px", fontSize: 10 }}
                            />
                            <Typography
                                variant="body2"
                                paragraph
                                sx={{ textAlign: "left", fontSize: "0.8rem",color:"#B79C8B" }}
                            >
                                {rule}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Paper>
        );
    }


    return (
        <Mobile>
            <Box
                sx={{
                    bgcolor: "#232626",
                    minHeight: "100vh",
                    maxWidth: "sm",
                    mx: "auto",
                }}
            >
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
                        <IconButton sx={{ color: '#FDE4BC', position: 'absolute', left: 0 ,p:"12px"}} onClick={handleBackClick}>
                            <ArrowBackIosNewIcon sx={{fontSize:"19px"}}/>
                        </IconButton>
                        <Typography variant="h6" sx={{ color: '#FDE4BC', textAlign: 'center' ,fontSize:"19px"}}>
                            Invitation reward rules
                        </Typography>
                    </Grid>
                </Grid>

                {/* Tips */}
                <Box sx={{ mt: 1.5 }}>
                    <Box sx={{
                        m: "8px 16px",
                        color: "#B79C8B",
                        fontSize: "13.8668px",
                        fontWeight: "400",
                        textAlign: "left"
                    }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Invite friends and recharge to get additional platform rewards!
                        </Typography>
                        <Typography variant="body2">
                            After being claimed, the rewards will be directly distributed to the wallet balance within 10 minutes.
                        </Typography>
                    </Box>
                </Box>

                {/* Reward Table */}
                <Box sx={{ mt: 1.5, p: 2 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
                            {error}
                        </Paper>
                    ) : (
                        <TableContainer component={Box} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', }}>
                            <Table>
                                <TableHead sx={{ background: "#cf7c10" }}>
                                    <TableRow>
                                        <TableCell sx={{ color: '#FFFFFF', fontWeight: '400', fontSize: "15px", padding: '10px 8px',borderBottom:"1px solid #666462"}}>
                                            Invite Account
                                        </TableCell>
                                        <TableCell sx={{ color: '#FFFFFF', fontWeight: '400', fontSize: "15px", padding: '10px 8px',borderBottom:"1px solid #666462" }}>
                                            Deposit Amount
                                        </TableCell>
                                        <TableCell sx={{ color: '#FFFFFF', fontWeight: '400', fontSize: "15px", padding: '10px 8px',borderBottom:"1px solid #666462" }}>
                                            Bonus
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rewardData.map((data, index) => (
                                        <TableRow
                                            key={data.id}
                                            sx={{ '&:nth-of-type(odd)': { bgcolor: '#323738' } ,'&:nth-of-type(even)': { bgcolor: '#1a1000' } }}
                                        >
                                            <TableCell sx={{color: '#B79C8B',borderBottom:"none" }}>{data.requiredReferrals} People</TableCell>
                                            <TableCell sx={{color: '#B79C8B',borderBottom:"none" }}>₹{Number(data.minDepositAmount).toFixed(2)}</TableCell>
                                            <TableCell sx={{color: '#B79C8B',borderBottom:"none" }}>₹{Number(data.bonusAmount).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>

                {/* Rules */}
                <Box sx={{ p: 2 }}><InvitationRules /></Box>
            </Box>
        </Mobile>
    );
};

export default InvitationRewardRules;