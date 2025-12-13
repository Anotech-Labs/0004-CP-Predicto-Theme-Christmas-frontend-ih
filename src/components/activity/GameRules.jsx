import { Box, Typography, Table, IconButton, TableBody, TableCell, Grid, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Mobile from "../../components/layout/Mobile";
import SvgIcon from '@mui/material/SvgIcon';
import { useAuth } from '../../context/AuthContext';
import { domain } from '../../utils/Secret';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RhombusIcon = (props) => (
    <SvgIcon {...props}>
        <path d="M12 2L22 12L12 22L2 12L12 2Z" />
    </SvgIcon>
);

const GameRules = () => {
    const [rulesData, setRulesData] = useState([]);
    const navigate = useNavigate();
    const { axiosInstance } = useAuth();

    const handleBackClick = () => {
        navigate(-1);
    };

    const fetchRules = async () => {
        try {
            const { data } = await axiosInstance.get(`${domain}/api/activity/attendance/rules`);
            if (data.success) {
                setRulesData(data.data);
            }
        } catch (error) {
            console.error('Error fetching rules:', error);
        }
    };

    useEffect(() => {
        fetchRules();
    }, [axiosInstance]);

    function Rules() {
        return (
            <Paper sx={{ mb: 2, overflow: "hidden", borderRadius: "5px", margin: 0 ,background:"#323738"}}>
                <Box
                    sx={{
                        background: "linear-gradient(90deg,#24EE89,#9FE871)",
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
                        sx={{ fontWeight: "bold", color: "#ffffff" }}
                    >
                        Rules
                    </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                    {[
                        'The higher the number of consecutive login days, the more rewards you get, up to 7 consecutive days',
                        'During the activity, please check once a day',
                        'Players with no deposit history cannot claim the bonus',
                        'Deposit requirements must be met from day one',
                        'The platform reserves the right to final interpretation of this activity',
                        'When you encounter problems, please contact customer service',
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
                                sx={{ color: "#24ee89", mr: 1, mt: "4px", fontSize: 10 }}
                            />
                            <Typography
                                variant="body2"
                                paragraph
                                sx={{ textAlign: "justify", fontSize: "0.8rem",color:"#B3BEC1" }}
                            >
                                {rule}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Paper>
        );
    }

    const formatCurrency = (amount) => {
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    return (
        <div>
            <Mobile>
                <Box disableGutters maxWidth="xs" sx={{ bgcolor: '#232626', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            position: 'sticky',
                            top: 0,
                            zIndex: 1000,
                            backgroundColor: '#232626',
                            padding: '10px 16px',
                        }}
                    >
                        <Grid item xs={12} container alignItems="center" justifyContent="center">
                            <IconButton sx={{ color: '#ffffff', position: 'absolute', left: 0 }} onClick={handleBackClick}>
                                <ArrowBackIosNewIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ color: '#ffffff', textAlign: 'center' }}>
                                Game Rules
                            </Typography>
                        </Grid>
                    </Grid>

                    <Box sx={{ p: 2, mt: -1 }}>
                        <TableContainer component={Paper} sx={{ mt: 0, border: 'none' }} elevation={0}>
                            <Table sx={{ border: 'none' }}>
                                <TableHead>
                                    <TableRow sx={{ background: 'linear-gradient(90deg,#24EE89,#9FE871)', border: 'none' }}>
                                        <TableCell align="center" sx={{ color: '#ffffff', border: 'none', padding: '0px 8px' }}>
                                            Continuous attendance
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: '#ffffff', border: 'none', padding: '0px 8px' }}>
                                           Accumulated amount
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: '#ffffff', border: 'none', padding: '0px 8px' }}>
                                            Attendance bonus
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rulesData.map((row) => (
                                        <TableRow key={row.day} sx={{ backgroundColor: row.day % 2 === 0 ? '#3a4142' : '#323738', border: 'none' }}>
                                            <TableCell align="center" sx={{ border: 'none',color:"#B3BEC1" }}>{row.day}</TableCell>
                                            <TableCell align="center" sx={{ border: 'none',color:"#B3BEC1" }}>{formatCurrency(row.requiredDeposit)}</TableCell>
                                            <TableCell align="center" sx={{ border: 'none',color:"#B3BEC1" }}>{formatCurrency(row.bonusReward)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ mt: 2 }}><Rules /></Box>
                    </Box>
                </Box>
            </Mobile>
        </div>
    );
};

export default GameRules;