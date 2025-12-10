import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Mobile from '../components/layout/Mobile';
import BottomNavigationArea from '../components/common/BottomNavigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  LinearProgress,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import {
  Casino as CasinoIcon,
  CardGiftcard as GiftIcon,
  Star as StarIcon,
  History as HistoryIcon,
  MonetizationOn as MoneyIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import LoadingLogo from '../components/utils/LodingLogo';

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#0f172a',
  color: '#ffffff',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(10),
}));

const MagicBoxCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  borderRadius: 20,
  border: '2px solid #3b82f6',
  boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
  animation: 'float 3s ease-in-out infinite',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)',
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-10px)' },
  },
}));

const SpinWheelCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#1e293b',
  borderRadius: 16,
  border: '1px solid #475569',
  marginBottom: theme.spacing(2),
}));

const RewardItem = styled(Box)(({ theme, selected }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: selected ? '#3b82f6' : '#475569',
  color: '#ffffff',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: selected ? '2px solid #60a5fa' : '2px solid transparent',
  '&:hover': {
    backgroundColor: selected ? '#2563eb' : '#64748b',
    transform: 'translateY(-2px)',
  },
}));

const DynamicSpinEvent = () => {
  const navigate = useNavigate();
  const { axiosInstance } = useAuth();
  
  // State management
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [magicBoxEligible, setMagicBoxEligible] = useState(false);
  const [magicBoxEligibilityData, setMagicBoxEligibilityData] = useState(null);
  const [selectedReward, setSelectedReward] = useState(null);
  const [claimDialog, setClaimDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchConfig(),
        fetchUserStats(),
        checkMagicBoxEligibility()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      showSnackbar('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      const response = await axiosInstance.get('/api/activity/dynamic-spin-event/public/config');
      if (response.data.success) {
        setConfig(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await axiosInstance.get('/api/activity/dynamic-spin-event/stats');
      if (response.data.success) {
        console.log('📊 [FRONTEND] User stats received:', response.data.data);
        console.log('📊 [FRONTEND] Accumulated amount:', response.data.data.accumulatedAmount);
        console.log('📊 [FRONTEND] Progress percentage:', response.data.data.progressPercentage);
        console.log('📊 [FRONTEND] Target amount:', response.data.data.targetAmount);
        setUserStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const checkMagicBoxEligibility = async () => {
    try {
      const response = await axiosInstance.get('/api/activity/dynamic-spin-event/magic-box/eligibility');
      if (response.data.success) {
        setMagicBoxEligible(response.data.data.eligible);
        // Store eligibility data for display
        setMagicBoxEligibilityData(response.data.data);
      }
    } catch (error) {
      console.error('Error checking magic box eligibility:', error);
    }
  };

  const handleClaimMagicBox = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/activity/dynamic-spin-event/magic-box/claim');

      if (response.data.success) {
        const rewardAmount = response.data.data.rewardAmount;
        showSnackbar(response.data.message || `Magic box claimed! You received ₹${rewardAmount}`, 'success');
        setMagicBoxEligible(false);
        setClaimDialog(false);
        // Refresh data
        await Promise.all([
          fetchUserStats(),
          checkMagicBoxEligibility()
        ]);
      } else {
        showSnackbar(response.data.error || 'Failed to claim magic box', 'error');
      }
    } catch (error) {
      showSnackbar('Error claiming magic box', 'error');
      console.error('Error claiming magic box:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpin = async () => {
    if (!userStats?.remainingSpins || userStats.remainingSpins <= 0) return;
    
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/activity/dynamic-spin-event/spin');
      if (response.data.success) {
        // Show success message with reward amount
        setSnackbar({
          open: true,
          message: `🎉 You won ₹${response.data.data.rewardAmount}!`,
          severity: 'success'
        });
        
        // Refresh user stats
        await fetchUserStats();
      } else {
        setSnackbar({
          open: true,
          message: response.data.error || 'Spin failed',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error spinning:', error);
      setSnackbar({
        open: true,
        message: 'Failed to spin. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestBonus = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/activity/dynamic-spin-event/bonus/request');
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: '🎉 Bonus request submitted successfully! Admin will review it soon.',
          severity: 'success'
        });
        
        // Refresh user stats
        await fetchUserStats();
      } else {
        setSnackbar({
          open: true,
          message: response.data.error || 'Bonus request failed',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error requesting bonus:', error);
      setSnackbar({
        open: true,
        message: 'Failed to request bonus. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMagicBoxClick = async (boxIndex) => {
    if (loading) return;
    
    setLoading(true);
    try {
      console.log(`🎁 [FRONTEND] User clicked magic box ${boxIndex}`);
      
      const response = await axiosInstance.post('/api/activity/dynamic-spin-event/magic-box/claim');
      if (response.data.success) {
        const rewardAmount = response.data.data.rewardAmount;
        setSnackbar({
          open: true,
          message: `🎉 Congratulations! You won ₹${rewardAmount} from box ${boxIndex}!`,
          severity: 'success'
        });
        
        // Refresh user stats and magic box eligibility
        await fetchUserStats();
        await checkMagicBoxEligibility();
      } else {
        setSnackbar({
          open: true,
          message: response.data.error || 'Failed to claim magic box',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error claiming magic box:', error);
      setSnackbar({
        open: true,
        message: 'Failed to claim magic box. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToHistory = () => {
    navigate('/dynamic-spin-event/history');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const generateMagicBoxRewards = () => {
    if (!config) return [];
    
    // Parse magicBoxRewards if it's a string from DB
    let magicBoxRewards = config.magicBoxRewards;
    if (typeof config.magicBoxRewards === 'string') {
      try {
        magicBoxRewards = JSON.parse(config.magicBoxRewards);
      } catch (e) {
        magicBoxRewards = [];
      }
    }
    
    // ONLY use admin-configured magic box rewards from DB
    // NO FALLBACK - Admin must configure via database
    if (magicBoxRewards && Array.isArray(magicBoxRewards) && magicBoxRewards.length === 4) {
      return magicBoxRewards;
    }
    
    // Return empty if not configured
    return [];
  };

  if (loading && !config) {
    return (
      <Mobile>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <LoadingLogo />
        </Box>
        <BottomNavigationArea />
      </Mobile>
    );
  }

  return (
    <Mobile>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#ffffff', pb: 10 }}>
        {/* Header */}
        <Box p={2} display="flex" alignItems="center" justifyContent="space-between">
          <IconButton onClick={() => navigate(-1)} sx={{ color: '#ffffff' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">
            Dynamic Spin Event
          </Typography>
          <IconButton onClick={loadInitialData} sx={{ color: '#ffffff' }}>
            <RefreshIcon />
          </IconButton>
        </Box>

        <Container maxWidth="sm" sx={{ px: 2 }}>
          {/* User Stats Card - Only show when magic box is NOT available */}
          {userStats && !magicBoxEligible && (
            <Card sx={{ backgroundColor: '#1e293b', mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h5" color="#3b82f6" fontWeight="bold">
                        {userStats.remainingSpins || 0}
                      </Typography>
                      <Typography variant="body2" color="#94a3b8">
                        Available Spins
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h5" color="#10b981" fontWeight="bold">
                        {formatCurrency(parseFloat(userStats.accumulatedAmount || "0"))}
                      </Typography>
                      <Typography variant="body2" color="#94a3b8">
                        Accumulated Amount
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box mt={2}>
                  <Typography variant="caption" color="#94a3b8" gutterBottom>
                    Progress to Target: {(userStats.progressPercentage || 0).toFixed(1)}%
                    {userStats.progressPercentage > 100 && (
                      <span style={{ color: '#10b981', fontWeight: 'bold' }}> 🎉 TARGET EXCEEDED!</span>
                    )}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(userStats.progressPercentage || 0, 100)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#475569',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: userStats.progressPercentage > 100 ? '#10b981' : '#3b82f6',
                        borderRadius: 4,
                      },
                    }}
                  />
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Typography variant="caption" color="#6b7280">
                      Target: {formatCurrency(parseFloat(userStats.targetAmount || userStats.config?.targetBonusAmount || "500"))}
                    </Typography>
                    <Typography variant="caption" color={userStats.progressPercentage > 100 ? "#10b981" : "#6b7280"}>
                      Current: {formatCurrency(parseFloat(userStats.accumulatedAmount || "0"))}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Magic Box - Show ONLY when available (priority over spin wheel) */}
          {magicBoxEligible && (
            <Card sx={{ backgroundColor: '#000', mb: 3, borderRadius: 2, border: '2px solid #fbbf24' }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h4" sx={{ color: '#fbbf24', mb: 3, fontWeight: 'bold' }}>
                  💰 Cash everyday 💰
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4 }}>
                  {[1, 2, 3, 4].map((boxIndex) => (
                    <Box
                      key={boxIndex}
                      onClick={() => handleMagicBoxClick(boxIndex)}
                      sx={{
                        width: 80,
                        height: 80,
                        background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        '&:hover': { 
                          transform: 'scale(1.1)',
                          boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
                        },
                        transition: 'all 0.3s ease',
                        border: '2px solid #fff',
                        '&:before': {
                          content: '""',
                          position: 'absolute',
                          top: '10%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '60%',
                          height: '20%',
                          background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                          borderRadius: '4px'
                        }
                      }}
                    >
                      <Typography variant="h4" sx={{ zIndex: 1 }}>🎁</Typography>
                    </Box>
                  ))}
                </Box>
                
                <Typography variant="h6" color="#fbbf24" fontWeight="bold" gutterBottom>
                  Choose your reward
                </Typography>
                <Typography variant="body2" color="#94a3b8">
                  Click any box to claim your reward and get 1 free spin!
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Spin Wheel - Show ONLY when magic box is NOT available AND user has spins */}
          {!magicBoxEligible && userStats?.remainingSpins > 0 && (
            <>
              {/* Spin Available Info */}
              <Card sx={{ backgroundColor: '#1e293b', mb: 3, borderRadius: 2, border: '2px solid #3b82f6' }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <CasinoIcon sx={{ fontSize: 48, color: '#3b82f6', mb: 2 }} />
                  <Typography variant="h6" color="#3b82f6" gutterBottom>
                    🎰 You Have {userStats.remainingSpins} Spin{userStats.remainingSpins > 1 ? 's' : ''} Available!
                  </Typography>
                  <Typography variant="body2" color="#94a3b8" mb={2}>
                    Use your spins on the wheel below to win rewards
                  </Typography>
                  <Typography variant="caption" color="#6b7280">
                    Next magic box: {magicBoxEligibilityData?.nextAvailableDate ? new Date(magicBoxEligibilityData.nextAvailableDate).toLocaleString() : 'Soon'}
                  </Typography>
                </CardContent>
              </Card>

              {/* Spin Wheel */}
              <SpinWheelCard sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  🎰 Spin Wheel
                </Typography>
                <Chip
                  label={`${userStats?.remainingSpins || 0} spins left`}
                  color={userStats?.remainingSpins > 0 ? 'primary' : 'default'}
                  size="small"
                />
              </Box>

              {/* Spin Wheel Visual */}
              {config?.spinWheelRewards && (
                <Box 
                  sx={{ 
                    position: 'relative', 
                    width: 200, 
                    height: 200, 
                    mx: 'auto', 
                    mb: 3,
                    borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, #3b82f6, #10b981, #f59e0b, #ef4444, #8b5cf6, #06b6d4, #84cc16, #f97316)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '4px solid #1e293b',
                    animation: loading ? 'spin 2s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 160, 
                      height: 160, 
                      borderRadius: '50%', 
                      backgroundColor: '#1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}
                  >
                    <CasinoIcon sx={{ fontSize: 40, color: '#3b82f6', mb: 1 }} />
                    <Typography variant="h6" color="#ffffff" fontWeight="bold">
                      {loading ? 'SPINNING' : 'READY'}
                    </Typography>
                  </Box>
                  
                  {/* Pointer */}
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: -10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '10px solid transparent',
                      borderRight: '10px solid transparent',
                      borderBottom: '20px solid #fbbf24',
                      zIndex: 10
                    }}
                  />
                </Box>
              )}

              {/* Rewards Display */}
              {config?.spinWheelRewards && (
                <Box mb={3}>
                  <Typography variant="subtitle2" color="#94a3b8" mb={1} textAlign="center">
                    🎁 Possible Rewards
                  </Typography>
                  <Grid container spacing={1}>
                    {config.spinWheelRewards.slice(0, 4).map((reward, index) => (
                      <Grid item xs={3} key={index}>
                        <Box 
                          sx={{ 
                            p: 1, 
                            backgroundColor: '#334155', 
                            borderRadius: 1, 
                            textAlign: 'center',
                            border: '1px solid #475569'
                          }}
                        >
                          <Typography variant="caption" color="#10b981" fontWeight="bold">
                            ₹{reward.rewardAmount}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  {config.spinWheelRewards.length > 4 && (
                    <Typography variant="caption" color="#6b7280" textAlign="center" display="block" mt={1}>
                      +{config.spinWheelRewards.length - 4} more rewards...
                    </Typography>
                  )}
                </Box>
              )}
              
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSpin}
                disabled={!userStats?.remainingSpins || userStats.remainingSpins <= 0 || loading}
                startIcon={loading ? <CircularProgress size={20} /> : <CasinoIcon />}
                sx={{
                  backgroundColor: userStats?.remainingSpins > 0 ? '#10b981' : '#64748b',
                  '&:hover': { backgroundColor: userStats?.remainingSpins > 0 ? '#059669' : '#64748b' },
                  '&:disabled': { backgroundColor: '#64748b' },
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                }}
              >
                {loading ? '🎰 SPINNING...' : userStats?.remainingSpins > 0 ? '🎰 SPIN NOW!' : '🔒 NO SPINS'}
              </Button>
              
              {(!userStats?.remainingSpins || userStats.remainingSpins <= 0) && (
                <Alert severity="info" sx={{ mt: 2, backgroundColor: '#334155' }}>
                  <Typography variant="body2" mb={1}>
                    <strong>How to get more spins:</strong>
                  </Typography>
                  <Typography variant="body2" component="div">
                    • 🎁 Claim magic box (every {config?.cycleDurationDays || 3} days)<br/>
                    • 🤝 Refer friends who deposit ₹{config?.minDepositForReferralSpin || config?.minDepositToUnlock || 100}+<br/>
                    • ⏰ Wait for daily reset
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </SpinWheelCard>
            </>
          )}

          {/* No Spins Available - Show when magic box not available and no spins */}
          {!magicBoxEligible && (!userStats?.remainingSpins || userStats.remainingSpins <= 0) && (
            <Card sx={{ 
              backgroundColor: '#1e293b', 
              mb: 3, 
              borderRadius: 2, 
              border: userStats?.targetReached ? '1px solid #10b981' : '1px solid #475569' 
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                {userStats?.targetReached ? (
                  <>
                    <StarIcon sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
                    <Typography variant="h6" color="#10b981" gutterBottom>
                      🎯 Target Achieved!
                    </Typography>
                    <Typography variant="body2" color="#94a3b8" mb={2}>
                      Congratulations! You've reached ₹{userStats?.targetAmount || 500}.
                    </Typography>
                    <Typography variant="body2" color="#e2e8f0" mb={2}>
                      {userStats?.bonusClaimable ? 
                        "You can now claim your bonus reward!" : 
                        "Your bonus request is being processed."
                      }
                    </Typography>
                    <Typography variant="caption" color="#6b7280">
                      New spins will be available in the next cycle.
                    </Typography>
                  </>
                ) : (
                  <>
                    <GiftIcon sx={{ fontSize: 48, color: '#64748b', mb: 2 }} />
                    <Typography variant="h6" color="#64748b" gutterBottom>
                      No Spins Available
                    </Typography>
                    <Typography variant="body2" color="#94a3b8" mb={2}>
                      {magicBoxEligibilityData?.message || "Wait for magic box or daily reset"}
                    </Typography>
                    {magicBoxEligibilityData?.nextAvailableDate && (
                      <Typography variant="caption" color="#6b7280">
                        Next magic box: {new Date(magicBoxEligibilityData.nextAvailableDate).toLocaleString()}
                      </Typography>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Claim Bonus Button - Show when target reached */}
          {userStats?.bonusClaimable && (
            <Card sx={{ backgroundColor: '#1e293b', mb: 3, borderRadius: 2, border: '2px solid #10b981' }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h4" sx={{ fontSize: 48, mb: 2 }}>
                  🎉
                </Typography>
                <Typography variant="h5" color="#10b981" fontWeight="bold" gutterBottom>
                  Congratulations! Target Achieved!
                </Typography>
                <Typography variant="body1" color="#94a3b8" mb={3}>
                  You've accumulated ₹{parseFloat(userStats.accumulatedAmount || "0").toLocaleString()} and reached your target of ₹{parseFloat(userStats.targetAmount || "500").toLocaleString()}!
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleRequestBonus}
                  sx={{
                    backgroundColor: '#10b981',
                    '&:hover': { backgroundColor: '#059669' },
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                >
                  🎁 CLAIM BONUS NOW
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Referral Info Card - Only show when magic box is NOT available AND target not reached */}
          {!magicBoxEligible && !userStats?.targetReached && (
            <Card sx={{ backgroundColor: '#1e293b', mb: 3, borderRadius: 2, border: '1px solid #3b82f6' }}>
            <CardContent>
              <Box textAlign="center" mb={2}>
                <Typography variant="h6" color="#3b82f6" fontWeight="bold" gutterBottom>
                  🤝 Get More Spins by Referring Friends!
                </Typography>
                <Typography variant="body2" color="#94a3b8" mb={2}>
                  Earn 1 extra spin for each friend who deposits ₹{config?.minDepositForReferralSpin || config?.minDepositToUnlock || 100} or more
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="#10b981" fontWeight="bold">
                      {userStats?.totalReferrals || 0}
                    </Typography>
                    <Typography variant="caption" color="#94a3b8">
                      Total Referrals
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="#3b82f6" fontWeight="bold">
                      {userStats?.referralSpinsEarned || 0}
                    </Typography>
                    <Typography variant="caption" color="#94a3b8">
                      Spins Earned
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="#f59e0b" fontWeight="bold">
                      ₹{config?.minDepositForReferralSpin || config?.minDepositToUnlock || 100}
                    </Typography>
                    <Typography variant="caption" color="#94a3b8">
                      Min Deposit
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box mt={2} p={2} backgroundColor="#334155" borderRadius={1}>
                <Typography variant="body2" color="#e2e8f0" textAlign="center">
                  💡 <strong>How it works:</strong> Share your referral link → Friend signs up → Friend deposits ₹{config?.minDepositForReferralSpin || config?.minDepositToUnlock || 100}+ → You get 1 spin!
                </Typography>
              </Box>
            </CardContent>
          </Card>
          )}

          {/* Target Reached Message - Show when target is reached but referral section should be hidden */}
          {!magicBoxEligible && userStats?.targetReached && userStats?.bonusApproved && (
            <Card sx={{ backgroundColor: '#1e293b', mb: 3, borderRadius: 2, border: '1px solid #10b981' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box mb={2}>
                  <Typography variant="h6" color="#10b981" fontWeight="bold" gutterBottom>
                    🎉 Bonus Already Claimed!
                  </Typography>
                  <Typography variant="body2" color="#94a3b8" mb={2}>
                    You have successfully claimed your bonus for this cycle.
                  </Typography>
                  <Typography variant="body2" color="#e2e8f0">
                    Referral rewards will be available again in the next cycle.
                  </Typography>
                </Box>
                
                {userStats?.cycleEndDate && (
                  <Box mt={2} p={2} backgroundColor="#334155" borderRadius={1}>
                    <Typography variant="body2" color="#e2e8f0" textAlign="center">
                      ⏰ <strong>Next cycle starts:</strong> {new Date(userStats.cycleEndDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* History Button - Only show when magic box is NOT available */}
          {!magicBoxEligible && (
            <Button
              fullWidth
              variant="outlined"
              onClick={navigateToHistory}
              startIcon={<HistoryIcon />}
              sx={{
                borderColor: '#475569',
                color: '#94a3b8',
                mb: 3,
                py: 1.5,
                '&:hover': {
                  borderColor: '#3b82f6',
                  color: '#3b82f6',
                  backgroundColor: '#1e40af20'
                }
              }}
            >
              View History
            </Button>
          )}
               </Container>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Mobile>
  );
};

export default DynamicSpinEvent;