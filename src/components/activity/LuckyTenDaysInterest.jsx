import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Snackbar,
    Alert,
    Grid,
    Checkbox, Divider
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { domain } from '../../utils/Secret';
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CheckIcon from "@mui/icons-material/Check";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
const LuckyTenDaysInterest = () => {
    const [apiData, setApiData] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const { axiosInstance } = useAuth();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const fetchEligibilityData = async () => {
        //console.log("fetchEligibilityData called");
        try {
            const response = await axiosInstance.get(
                `${domain}/api/activity/lucky-ten-days-interest/eligibility`,
                { withCredentials: true }
            );
            setApiData(response.data.data);
        } catch (error) {
            console.error("Error fetching eligibility data:", error);
            // setSnackbarMessage('Failed to fetch eligibility data');
            // setSnackbarSeverity('error');
            // setOpenSnackbar(true);
        }
    };

    const handleClaim = async (ruleId) => {
        try {
            const response = await axiosInstance.post(
                `${domain}/api/activity/lucky-ten-days-interest/claim`,
                { ruleId },
                { withCredentials: true }
            );

            if (response.data.success) {
                fetchEligibilityData();
                setSnackbarMessage('Reward claimed successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
            } else {
                setSnackbarMessage(response.data.message || 'Failed to claim reward');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        } catch (error) {
            console.error('Error claiming bonus:', error);
            // setSnackbarMessage('An error occurred while claiming the reward');
            // setSnackbarSeverity('error');
            // setOpenSnackbar(true);
        }
    };
    setTimeout(() => {
        setOpenSnackbar(false);
    }, 3000);
    useEffect(() => {
        fetchEligibilityData();
    }, []);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const renderChestColumn = () => {
        // Detailed logging

        // Validate data exists
        if (!apiData || !apiData.summary) {
            return <Typography>No data available</Typography>;
        }

        // Valid claim days and highest eligible rule
        const validClaimDays = apiData.summary.validClaimDays || [];
        const canClaimToday = apiData.summary.canClaimToday;
        const highestEligibleRule = apiData.summary.highestEligibleReward?.ruleId;



        // const totalDays = 21;
        // const claimedDays = apiData.rules.filter(rule => rule?.claimInfo?.lastClaimed).length;


        const today = new Date();
        const currentDay = today.getDate();

        // Chest configurations
        const chestConfigs = [
            { day: 21, ruleId: 2, chestNumber: 1, labelPosition: 'top' },  // Day 21 - Chest 1 (Rule 2)
            { day: 11, ruleId: 3, chestNumber: 2, labelPosition: 'left' },  // Day 11 - Chest 2 (Rule 3)
            { day: 1, ruleId: 4, chestNumber: 3, labelPosition: 'bottom' }    // Day 1 - Chest 3 (Rule 4)
        ];
        // Find the chest matching today's date
        const todaysChest = chestConfigs.find(chest => chest.day === currentDay);

        const progressPercentage = (currentDay / 21) * 100;

        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                bgcolor: '#110d14',
                p: "16px 5px"
            }}>
                <Box>
                    <Typography
                        sx={{
                            color: '#FDE4BC',
                            fontSize: 16,
                            mb: 3,
                            zIndex: 3,
                            position: 'relative'
                        }}
                    >
                        Total Days
                    </Typography>
                </Box>

                {/* Progress Bar Container */}
                <Box sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '126px',
                    bottom: '59px',
                    width: '7px',
                    bgcolor: '#7e4400',
                    transform: 'translateX(-50%)',
                    borderRadius: '3px',
                    zIndex: 1,
                    overflow: 'hidden'
                }}>
                    <Box sx={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: '100%',
                        height: `${progressPercentage}%`,
                        background: 'linear-gradient(90deg, #FF6B00, #DD9138)',
                        transition: 'height 0.5s ease-in-out'
                    }} />
                    {/* Day 6 Label on the right side */}

                </Box>
                <Typography
                    sx={{
                        position: 'absolute',
                        left: '60%',  // Puts the text on the right side of the progress bar
                        bottom: '19%',       // Adjusts vertical position (between Day 1 and Day 11)
                        transform: 'translateY(-50%)',
                        color: '#B79C8B',
                        fontSize: '12px',
                        zIndex: 4
                    }}
                >
                    Day 4
                </Typography>
                <Typography
                    sx={{
                        position: 'absolute',
                        right: '60%',  // Puts the text on the right side of the progress bar
                        bottom: '28%',       // Adjusts vertical position (between Day 1 and Day 11)
                        transform: 'translateY(-50%)',
                        color: '#B79C8B',
                        fontSize: '12px',
                        zIndex: 4
                    }}
                >
                    Day 8
                </Typography>
                <Typography
                    sx={{
                        position: 'absolute',
                        left: '69%',  // Puts the text on the right side of the progress bar
                        bottom: '38%',       // Adjusts vertical position (between Day 1 and Day 11)
                        transform: 'translateY(-50%)',
                        color: '#B79C8B',
                        fontSize: '12px',
                        zIndex: 4
                    }}
                >
                    Day 11
                </Typography>
                <Typography
                    sx={{
                        position: 'absolute',
                        right: '60%',  // Puts the text on the right side of the progress bar
                        top: '44%',       // Adjusts vertical position (between Day 1 and Day 11)
                        transform: 'translateY(-50%)',
                        color: '#B79C8B',
                        fontSize: '12px',
                        zIndex: 4
                    }}
                >
                    Day 14
                </Typography>
                <Typography
                    sx={{
                        position: 'absolute',
                        left: '60%',  // Puts the text on the right side of the progress bar
                        top: '35%',       // Adjusts vertical position (between Day 1 and Day 11)
                        transform: 'translateY(-50%)',
                        color: '#B79C8B',
                        fontSize: '12px',
                        zIndex: 4
                    }}
                >
                    Day 18
                </Typography>
                {chestConfigs.map((chest, index) => {

                    const isClaimableChest =
                        todaysChest &&
                        todaysChest.day === chest.day &&
                        apiData.summary.canClaimToday;

                    const isClaimedChest = apiData.currentClaim?.status === 'CLAIMED' && todaysChest?.ruleId === chest.ruleId;

                    // Render label based on position
                    const renderLabel = () => {
                        const labelStyle = {
                            color: '#B79C8B',
                            position: 'absolute',
                            zIndex: 4,
                            fontSize: '12px',
                        };

                        switch (chest.labelPosition) {
                            case 'top':
                                return (
                                    <Typography sx={{
                                        ...labelStyle,
                                        // top: '-20px',
                                        left: '50%',
                                        transform: 'translateX(-50%)'
                                    }}>
                                        Day 21
                                    </Typography>
                                );
                            // case 'left':
                            //     return (
                            //         <Typography sx={{
                            //             ...labelStyle,
                            //             left: '-12px',
                            //             top: '50%',
                            //             transform: 'translateY(-50%)'
                            //         }}>
                            //             Day 11
                            //         </Typography>
                            //     );
                            case 'bottom':
                                return (
                                    <Typography sx={{
                                        ...labelStyle,
                                        bottom: '-10px',
                                        left: '50%',
                                        transform: 'translateX(-50%)'
                                    }}>
                                        Day 1
                                    </Typography>
                                );
                            default:
                                return null;
                        }
                    };
                    return (
                        <Box
                            key={chest.day}
                            sx={{
                                position: 'relative',
                                mb: index < 2 ? 7 : 0,
                                zIndex: 2
                            }}
                        >
                            {renderLabel()}
                            <Box
                                onClick={() => isClaimableChest && handleClaim(highestEligibleRule)}
                                sx={{
                                    width: '120px',
                                    height: 'auto',
                                    cursor: isClaimableChest ? 'pointer' : 'default',
                                    transition: 'opacity 0.3s ease',
                                    position: 'relative',
                                    zIndex: 3,
                                    // opacity: isHighestEligibleChest ? 1 : 0.5
                                }}
                            >
                                <img
                                    src={
                                        // isClaimedChest || isClaimedChest2
                                        isClaimedChest
                                            ? "/assets/lucky10days/chest-open2.webp"  // Only claimed chest opens
                                            : "/assets/lucky10days/chest-closed2.webp"
                                    }
                                    alt={`Day ${chest.day} chest`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        filter: isClaimableChest || isClaimedChest ? 'none' : 'brightness(65%)'
                                    }}
                                />
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        );
    };

    const renderRulesColumn = () => {
        const reversedRules = [...(apiData?.rules || [])].reverse(); // Reverse the rules
        const rulesCount = reversedRules.length;
        return (
            <Box sx={{
                bgcolor: '#110d14',
                p: "16px 5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                // height: '100%'
            }}>
                <Typography
                    sx={{
                        color: '#FDE4BC',
                        fontSize: 16,
                        // fontWeight: 'bold',
                        mb: 4,
                        textAlign: 'center'
                    }}
                >
                    Recharge Amount
                </Typography>

                <Box sx={{
                    height: '400px', // Fixed height when more than 6 rules
                    width: "100%",
                    overflowY: "auto", // Add scrollbar when needed
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    gap: "10px",
                    // Hide scrollbar but keep scrolling functionality
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                    '-ms-overflow-style': 'none', // Hide scrollbar for IE & Edge
                    'scrollbar-width': 'none', // Hide scrollbar for Firefox
                    // pr: 1 // Add some padding for scrollbar
                }}>
                    {reversedRules.map((rule) => {
                        const ruleDetails = rule?.rule;
                        const isChecked = rule?.progress?.remainingRecharge === "0"; // Check if remainingRecharge is 0
                        return (
                            <Box
                                key={ruleDetails?.id}
                                sx={{
                                    width: "80%",
                                    alignSelf: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    bgcolor: isChecked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                                    borderRadius: 50,
                                    p: "10px 13px 10px 13px",
                                    transition: 'background-color 0.3s ease'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>

                                    <Typography sx={{ color: isChecked ? 'grey' : "#FDE4BC", mr: 2, fontSize: 10, ml: 1 }}>
                                        ₹{ruleDetails?.rechargeRequired}
                                    </Typography>
                                </Box>

                                <Typography
                                    sx={{
                                        color: isChecked ? "#FED358" : "grey",
                                        fontSize: 12,
                                        display: "flex",
                                        alignItems: "center",
                                        // fontStyle: 'italic'
                                    }}
                                >
                                    {isChecked ? "Reached" : "Pending"}
                                    {isChecked ? (
                                        <CheckCircleIcon
                                            sx={{
                                                color: "#FED358",
                                                fontSize: 16,
                                                ml: 0.5
                                            }}
                                        />
                                    ) : (
                                        <HourglassBottomIcon
                                            sx={{
                                                color: "grey",
                                                fontSize: 16,
                                                ml: 0.5
                                            }}
                                        />
                                    )}
                                </Typography>



                            </Box>
                        );
                    })}

                    {/* Placeholder for empty states */}
                    {rulesCount === 0 && (
                        <Typography
                            sx={{
                                fontSize: 12,
                                color: '#B79C8B',
                                textAlign: 'center',
                                position:"absolute",
                                top:"50%",
                                left:"46%",
                                p: 2
                            }}
                        >
                            No recharge rules available
                        </Typography>
                    )}
                </Box>
            </Box>
        );
    };

    // Add a loading state if apiData is not yet loaded
    if (!apiData) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container
            disableGutters
            maxWidth={false}
            sx={{
                margin: 0,
                padding: 0,
                bgcolor: '#110d14',
                color: '#FDE4BC'
            }}
        >
            <Grid sx={{ display: "flex", justifyContent: "space-between", position: "relative", mb: 4 }}>
                <Grid sx={{ width: "40%" }}>
                    {renderChestColumn()}
                </Grid>
                {/* <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                        bgcolor: '#555',
                        width: '2px',
                        // position: "absolute",
                        // left: "50%",
                        // top: "0",
                        // height: "100%"
                    }}
                /> */}

                <Grid sx={{ width: "60%" }}>
                    {renderRulesColumn()}
                </Grid>
            </Grid>

            <div>
                {/* Your existing component code */}

                {/* Popup Notification */}
                {openSnackbar && (
                    <Box
                        sx={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            ...(isSmallScreen && { width: "70%" }),
                            transform: "translate(-50%, -50%)",
                            bgcolor: "rgba(0, 0, 0, 0.9)",
                            color: "white",
                            padding: "20px 30px",
                            borderRadius: "10px",
                            zIndex: 1000,
                            animation: "fadeIn 0.5s ease",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px"
                        }}
                    >
                        {/* Checkmark/Success Icon */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8.53125 15.3125L4.03125 10.8125L5.28125 9.5625L8.53125 12.8125L16.7188 4.625L17.9688 5.875L8.53125 15.3125Z"
                                    fill="#4CAF50"
                                />
                            </svg>
                        </Box>
                        <Typography variant="body1" sx={{ fontSize: "13px" }}>
                            {snackbarMessage}
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
    );
};

export default LuckyTenDaysInterest;