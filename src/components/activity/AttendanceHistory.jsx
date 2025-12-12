import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Card,
  CardContent,
  useMediaQuery,
  Chip
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useAuth } from '../../context/AuthContext';
import { domain } from '../../utils/Secret';
import Mobile from '../../components/layout/Mobile';
import ErrorPopup from '../../components/popups/ErrorPopup';

const AttendanceHistory = ({ children }) => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:350px)');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historyData, setHistoryData] = useState({
    currentStreak: 0,
    lastClaimDate: '',
    progress: {
      completedDays: 0,
      totalDays: 7,
      remainingDays: 7,
      percentageComplete: 0
    },
    upcomingMilestones: [],
    recentClaims: [],
    summary: {
      totalBonusClaimed: 0,
      totalClaimsCount: 0,
      successfulClaims: 0,
      highestStreak: 0
    }
  });

  const { axiosInstance } = useAuth();

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    window.addEventListener('resize', setVh);
    setVh();
    return () => window.removeEventListener('resize', setVh);
  }, []);

  const handleRedirect = () => {
    navigate(-1);
  };

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`${domain}/api/activity/attendance/history`);
      if (data.success) {
        setHistoryData(data.data);
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch attendance history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, [axiosInstance]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).split("/").reverse().join("-"); // Converts DD/MM/YYYY to YYYY-MM-DD

    const formattedTime =
      String(date.getUTCHours()).padStart(2, "0") + ":" +
      String(date.getUTCMinutes()).padStart(2, "0") + ":" +
      String(date.getUTCSeconds()).padStart(2, "0");

    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <Mobile>
      <Box
        display="flex"
        flexDirection="column"
        height="calc(var(--vh, 1vh) * 100)"
        position="relative"
        sx={{
          fontFamily: 'Inter, sans-serif',
          backgroundColor: '#1a1618'
        }}
      >
        <Box flexGrow={1}>
          {/* Header */}
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1000,
              backgroundColor: "#323738",
              padding: "8px 16px",
              color: "white",
            }}
          >
            <Grid item container alignItems="center" justifyContent="center">
              <Grid item xs={2}>
                <IconButton
                  sx={{ color: "#F5F3F0", ml: -5 }}
                  onClick={handleRedirect}
                >
                  <ArrowBackIosNewIcon />
                </IconButton>
              </Grid>
              <Grid item xs={10}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#F5F3F0",
                    flexGrow: 1,
                    textAlign: "center",
                    mr: 8,
                  }}
                >
                  Attendance History
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* Content */}
          <Box sx={{ p: 2.5, maxWidth: '800px', margin: '0 auto' }}>
            {loading ? (
              <LinearProgress
                sx={{
                  my: 2,
                  backgroundColor: '#e9ecef',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#24ee89'
                  },
                  borderRadius: 1
                }}
              />
            ) : (
              <>
                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={6}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: 3,
                        backgroundColor: '#323738',
                        // border: '1px solid #e8e8e8',
                        transition: 'all 0.3s ease-in-out',
                        overflow: 'hidden',
                        position: 'relative',
                        borderColor: '#24ee89',
                        // '&:hover': {
                        //   borderColor: '#24ee89',
                        //   boxShadow: '0 4px 12px rgba(15, 101, 24, 0.12)',
                        //   transform: 'translateY(-2px)'
                        // },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '6px',
                          height: '100%',
                          backgroundColor: '#24ee89',
                          opacity: 0.7
                        }
                      }}
                    >
                      <CardContent sx={{ p: 1, pl: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {/* <LocalFireDepartmentIcon sx={{ color: '#24ee89', mr: 1, fontSize: '1.2rem' }} /> */}
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: '#A8A5A1',
                              fontWeight: 600,
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.9rem',
                              letterSpacing: '0.02em'
                            }}
                          >
                            Current Streak
                          </Typography>
                        </Box>
                        <Typography
                          variant="h4"
                          sx={{
                            mt: 1.5,
                            fontWeight: 700,
                            color: '#24ee89',
                            fontFamily: 'Inter, sans-serif',
                            display: 'flex',
                            alignItems: 'baseline',
                            lineHeight: 1.2
                          }}
                        >
                          {historyData.currentStreak}
                          <Typography
                            component="span"
                            variant="body1"
                            sx={{
                              ml: 1,
                              color: '#777',
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.875rem',
                              fontWeight: 500
                            }}
                          >
                            Days
                          </Typography>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: 3,
                        backgroundColor: '#323738',
                        // border: '1px solid #3B3833',
                        transition: 'all 0.3s ease-in-out',
                        overflow: 'hidden',
                        position: 'relative',
                        borderColor: '#24ee89',
                        // '&:hover': {
                        //   borderColor: '#24ee89',
                        //   boxShadow: '0 4px 12px rgba(15, 101, 24, 0.12)',
                        //   transform: 'translateY(-2px)'
                        // },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '6px',
                          height: '100%',
                          backgroundColor: '#24ee89',
                          opacity: 0.7
                        }
                      }}
                    >
                      <CardContent sx={{ p: 1, pl: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {/* <EmojiEventsIcon sx={{ color: '#24ee89', mr: 1, fontSize: '1.2rem' }} /> */}
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: '#A8A5A1',
                              fontWeight: 600,
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.9rem',
                              letterSpacing: '0.02em'
                            }}
                          >
                            Highest Streak
                          </Typography>
                        </Box>
                        <Typography
                          variant="h4"
                          sx={{
                            mt: 1.5,
                            fontWeight: 700,
                            color: '#24ee89',
                            fontFamily: 'Inter, sans-serif',
                            display: 'flex',
                            alignItems: 'baseline',
                            lineHeight: 1.2
                          }}
                        >
                          {historyData.summary.highestStreak}
                          <Typography
                            component="span"
                            variant="body1"
                            sx={{
                              ml: 1,
                              color: '#777',
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.875rem',
                              fontWeight: 500
                            }}
                          >
                            Days
                          </Typography>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Progress Section */}
                <Card
                  elevation={0}
                  sx={{
                    mb: 3.5,
                    borderRadius: 3,
                    backgroundColor: '#323738',
                    border: '1px solid #3B3833',
                    transition: 'all 0.3s ease-in-out',
                    overflow: 'hidden',
                    position: 'relative',
                    '&:hover': {
                      borderColor: '#24ee89',
                      boxShadow: '0 4px 12px rgba(15, 101, 24, 0.12)',
                      transform: 'translateY(-2px)'
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '6px',
                      height: '100%',
                      backgroundColor: '#24ee89',
                      opacity: 0.7
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, pl: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                          sx={{
                            fontWeight: 400,
                            color: '#F5F3F0',
                            fontSize: '0.875rem',
                            fontFamily: 'Inter, sans-serif',
                            letterSpacing: '0.02em'
                          }}
                        >
                          Weekly Progress
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        label={`${historyData.progress.percentageComplete.toFixed(2)}%`}
                        sx={{
                          backgroundColor: 'rgba(15, 101, 24, 0.12)',
                          color: '#24ee89',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          height: 24
                        }}
                      />
                    </Box>

                    <Box sx={{ position: 'relative', mb: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={historyData.progress.percentageComplete}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: '#e9ecef',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#24ee89',
                            borderRadius: 5,
                            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                          }
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          width: '100%',
                          top: 0,
                          left: 0,
                          height: 10,
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0 4px'
                        }}
                      >
                        {Array.from({ length: 8 }, (_, i) => (
                          <Box
                            key={i}
                            sx={{
                              width: 1,
                              height: 10,
                              backgroundColor: '#e9ecef',
                              opacity: 0,
                              '&:first-of-type, &:last-of-type': {
                                opacity: 0
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#A8A5A1',
                          fontWeight: 500,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.875rem'
                        }}
                      >
                        {historyData.progress.completedDays} of {historyData.progress.totalDays} days completed
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#24ee89',
                          fontWeight: 600,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <InfoOutlinedIcon sx={{ fontSize: '0.875rem', mr: 0.5 }} />
                        Weekly target
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Upcoming Milestones */}
                {/* <Card 
                elevation={0}
                sx={{ 
                  mb: 3,
                  borderRadius: 2.5,
                  backgroundColor: '#323738',
                  border: '1px solid #e0e0e0',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: '#24ee89',
                    boxShadow: '0 2px 8px rgba(15, 101, 24, 0.08)'
                  }
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      color: '#1a1a1a',
                      fontSize: '1rem',
                      fontFamily: 'Inter, sans-serif',
                      mb: 2
                    }}
                  >
                    Upcoming Milestones
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell 
                            sx={{ 
                              fontWeight: 600,
                              color: '#666',
                              borderBottom: '1px solid #e0e0e0',
                              fontSize: '0.875rem',
                              fontFamily: 'Inter, sans-serif',
                              padding: '12px 16px'
                            }}
                          >
                            Day
                          </TableCell>
                          <TableCell 
                            sx={{ 
                              fontWeight: 600,
                              color: '#666',
                              borderBottom: '1px solid #e0e0e0',
                              fontSize: '0.875rem',
                              fontFamily: 'Inter, sans-serif',
                              padding: '12px 16px'
                            }}
                          >
                            Required Deposit
                          </TableCell>
                          <TableCell 
                            sx={{ 
                              fontWeight: 600,
                              color: '#666',
                              borderBottom: '1px solid #e0e0e0',
                              fontSize: '0.875rem',
                              fontFamily: 'Inter, sans-serif',
                              padding: '12px 16px'
                            }}
                          >
                            Bonus
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {historyData.upcomingMilestones.map((milestone) => (
                          <TableRow 
                            key={milestone.day}
                            sx={{
                              ...milestone.isNext ? { 
                                backgroundColor: 'rgba(15, 101, 24, 0.04)',
                                transition: 'background-color 0.2s'
                              } : {},
                              '&:hover': {
                                backgroundColor: 'rgba(15, 101, 24, 0.06)'
                              }
                            }}
                          >
                            <TableCell 
                              sx={{ 
                                fontWeight: 500,
                                color: milestone.isNext ? '#24ee89' : '#1a1a1a',
                                fontSize: '0.875rem',
                                fontFamily: 'Inter, sans-serif',
                                padding: '12px 16px'
                              }}
                            >
                              Day {milestone.day}
                            </TableCell>
                            <TableCell 
                              sx={{ 
                                fontSize: '0.875rem', 
                                fontFamily: 'Inter, sans-serif',
                                padding: '12px 16px'
                              }}
                            >
                              ₹{milestone.requiredDeposit}
                            </TableCell>
                            <TableCell 
                              sx={{ 
                                color: '#24ee89',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                fontFamily: 'Inter, sans-serif',
                                padding: '12px 16px'
                              }}
                            >
                              ₹{milestone.bonus}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card> */}

                {/* Recent Claims */}
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#323738',
                    border: '1px solid #3B3833',
                    padding: '0px'
                  }}
                >
                  <CardContent sx={{ paddingBottom: '10px !important' }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        color: '#F5F3F0',
                        fontSize: '1rem',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Recent Claims
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableBody>
                          {historyData.recentClaims.map((claim, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0px',
                                borderBottom: '1px solid #626663'
                              }}
                            >
                              {/* Left Side: Continuous Attendance Info */}
                              <TableCell
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  fontSize: '0.875rem',
                                  fontFamily: 'Inter, sans-serif',
                                  fontWeight: 500,
                                  color: '#A8A5A1',
                                  borderBottom: 'none'
                                }}
                              >
                                <Typography variant="body2" fontWeight={400}>
                                  Continuous attendance {claim.day} Day
                                </Typography>
                                <Typography variant="caption" color="#626663">
                                  {formatDate(claim.date)}
                                </Typography>
                              </TableCell>

                              {/* Right Side: Bonus */}
                              <TableCell
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: '#24ee89',
                                  borderRadius: '20px',
                                  padding: '5px 15px',
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  color: 'white',
                                  minWidth: '60px',
                                  borderBottom: 'none'
                                }}
                              >
                                <img
                                  src="/assets/activity/cointri.webp" // Replace with actual icon path
                                  alt="coin"
                                  style={{ width: '18px', height: '18px', marginRight: '5px' }}
                                />
                                {claim.bonusAmount}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>

              </>
            )}
            {error && <ErrorPopup message={error} />}
          </Box>
        </Box>
        {children}
      </Box>
    </Mobile>
  );
};

export default AttendanceHistory;