import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
  InputAdornment,
  ThemeProvider,
  Divider,
  Avatar,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Casino as CasinoIcon,
  Settings as SettingsIcon,
  Assessment as StatsIcon,
  People as PeopleIcon,
  History as HistoryIcon,
  MonetizationOn as MoneyIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Cancel as RejectIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  CardGiftcard as GiftIcon,
  CheckCircle as ApproveIcon,  // Add this line
  Assignment as RequestIcon     // Add this line

} from '@mui/icons-material';
import { createTheme } from '@mui/material/styles';

// Theme matching Tournament design
const colors = {
  primary: "#6366f1",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#06b6d4",
  purple: "#8b5cf6",
  background: {
    default: "#0f172a",
    paper: "#1e293b",
    card: "#1e293b",
  },
  text: {
    primary: "#f8fafc",
    secondary: "#94a3b8",
    disabled: "#64748b",
  },
  border: {
    light: "rgba(148, 163, 184, 0.12)",
  },
};

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    primary: { main: colors.primary },
    success: { main: colors.success },
    warning: { main: colors.warning },
    error: { main: colors.error },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: colors.background.card,
          border: `1px solid ${colors.border.light}`,
          borderRadius: 12,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
  },
});

const DynamicSpinEventSimpleAdmin = () => {
  const { axiosInstance } = useAuth();

  // State management
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);

  // Statistics state
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSpins: 0,
    totalRewards: 0,
    totalMagicBoxClaims: 0,
    averageReward: 0
  });

  // Bonus requests state
  const [bonusRequests, setBonusRequests] = useState([]);
  const [bonusPage, setBonusPage] = useState(0);
  const [bonusRowsPerPage, setBonusRowsPerPage] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, type: '', request: null });

  // Configuration state
  const [config, setConfig] = useState({
    eventName: 'Dynamic Spin Event',
    isActive: true,
    targetBonusAmount: 500,
    cycleDurationDays: 3,
    minDepositForReferralSpin: 100,

    // 4 Magic Box Rewards
    magicBoxRewards: [
      { id: 1, amount: 150, label: 'Reward 1', percentage: 30 },
      { id: 2, amount: 200, label: 'Reward 2', percentage: 40 },
      { id: 3, amount: 300, label: 'Reward 3', percentage: 60 },
      { id: 4, amount: 400, label: 'Reward 4', percentage: 80 },
    ],

    // 8 Spin Wheel Rewards
    spinWheelRewards: [
      { position: 1, amount: 10, probability: 30 },
      { position: 2, amount: 20, probability: 25 },
      { position: 3, amount: 30, probability: 15 },
      { position: 4, amount: 50, probability: 12 },
      { position: 5, amount: 75, probability: 8 },
      { position: 6, amount: 100, probability: 5 },
      { position: 7, amount: 150, probability: 3 },
      { position: 8, amount: 200, probability: 2 },
    ]
  });

  useEffect(() => {
    loadConfiguration();
    loadStatistics(); // Load statistics on component mount
    loadBonusRequests();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Load statistics
  const loadStatistics = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/dynamic-spin-event/statistics');
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
      showSnackbar('Failed to load statistics', 'error');
    }
  };


  // Load bonus requests
  const loadBonusRequests = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/dynamic-spin-event/bonus-requests');
      console.log('🎁 [ADMIN] Bonus requests response:', response.data);
      if (response.data.success) {
        const requests = response.data.data.items || [];
        console.log('🎁 [ADMIN] Setting bonus requests:', requests);
        setBonusRequests(requests);
      }
    } catch (error) {
      console.error('Error loading bonus requests:', error);
      setBonusRequests([]);
    }
  };

  // Handle bonus request action (approve/reject)
  const handleBonusAction = async (requestId, action, reason = '') => {
    try {
      // Find the request to get the requested amount
      const request = bonusRequests.find(r => r.id === requestId);

      const requestBody = action === 'approve'
        ? {
          requestId,
          approvedAmount: request?.requestedAmount || request?.targetAmount
        }
        : {
          requestId,
          rejectionReason: reason
        };

      const response = await axiosInstance.post(`/api/admin/dynamic-spin-event/bonus/${action}`, requestBody);

      if (response.data.success) {
        showSnackbar(`Request ${action}d successfully!`, 'success');
        loadBonusRequests(); // Reload the list
        setActionDialog({ open: false, type: '', request: null });
      } else {
        showSnackbar(response.data.message || `Failed to ${action} request`, 'error');
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      showSnackbar(`Error ${action}ing request`, 'error');
    }
  };

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 1) {
      loadStatistics();
    } else if (newValue === 2) {
      loadBonusRequests();
    }
  };

  const loadConfiguration = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/admin/dynamic-spin-event/config');
      if (response.data.success && response.data.data) {
        // Parse magicBoxRewards if it's a JSON string
        let parsedConfig = { ...response.data.data };
        if (typeof parsedConfig.magicBoxRewards === 'string') {
          try {
            parsedConfig.magicBoxRewards = JSON.parse(parsedConfig.magicBoxRewards);
          } catch (e) {
            parsedConfig.magicBoxRewards = [];
          }
        }
        // Ensure magicBoxRewards is always an array with proper probability field
        if (!Array.isArray(parsedConfig.magicBoxRewards) || parsedConfig.magicBoxRewards.length === 0) {
          parsedConfig.magicBoxRewards = [
            { id: 1, amount: 150, label: 'Reward 1', probability: 25 },
            { id: 2, amount: 200, label: 'Reward 2', probability: 25 },
            { id: 3, amount: 300, label: 'Reward 3', probability: 25 },
            { id: 4, amount: 400, label: 'Reward 4', probability: 25 }
          ];
        }
        // Ensure spinWheelRewards is always an array and map backend format to frontend
        if (!Array.isArray(parsedConfig.spinWheelRewards) || parsedConfig.spinWheelRewards.length === 0) {
          parsedConfig.spinWheelRewards = [
            { position: 1, amount: 10, probability: 30 },
            { position: 2, amount: 20, probability: 25 },
            { position: 3, amount: 30, probability: 15 },
            { position: 4, amount: 50, probability: 12 },
            { position: 5, amount: 75, probability: 8 },
            { position: 6, amount: 100, probability: 5 },
            { position: 7, amount: 150, probability: 3 },
            { position: 8, amount: 200, probability: 2 }
          ];
        } else {
          // Map backend spinWheelRewards format to frontend format
          parsedConfig.spinWheelRewards = parsedConfig.spinWheelRewards.map(reward => ({
            position: reward.position,
            amount: parseFloat(reward.rewardAmount) || 0, // Map rewardAmount to amount
            probability: parseFloat(reward.probability) || 0
          }));
        }

        console.log('📥 [FRONTEND] Loaded configuration:', {
          magicBoxRewards: parsedConfig.magicBoxRewards,
          spinWheelRewards: parsedConfig.spinWheelRewards
        });

        setConfig(parsedConfig);
      } else {
        // No configuration found, use defaults
        console.log('📥 [FRONTEND] No configuration found, using defaults');
        setConfig({
          ...config, // Keep existing default values
          magicBoxRewards: [
            { id: 1, amount: 150, label: 'Reward 1', probability: 25 },
            { id: 2, amount: 200, label: 'Reward 2', probability: 25 },
            { id: 3, amount: 300, label: 'Reward 3', probability: 25 },
            { id: 4, amount: 400, label: 'Reward 4', probability: 25 }
          ]
        });
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
      // Use defaults on error
      console.log('📥 [FRONTEND] Error loading config, using defaults');
      setConfig({
        ...config, // Keep existing default values
        magicBoxRewards: [
          { id: 1, amount: 150, label: 'Reward 1', probability: 25 },
          { id: 2, amount: 200, label: 'Reward 2', probability: 25 },
          { id: 3, amount: 300, label: 'Reward 3', probability: 25 },
          { id: 4, amount: 400, label: 'Reward 4', probability: 25 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetupDefault = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/admin/dynamic-spin-event/setup');
      if (response.data.success) {
        showSnackbar('Default configuration created successfully!', 'success');
        await loadConfiguration(); // Reload the configuration
      } else {
        showSnackbar(response.data.message || 'Failed to create default configuration', 'error');
      }
    } catch (error) {
      console.error('Error creating default configuration:', error);
      showSnackbar('Failed to create default configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfiguration = async () => {
    // Validate magic box probabilities sum to 100%
    if (!Array.isArray(config.magicBoxRewards)) {
      showSnackbar('Magic box rewards configuration is invalid', 'error');
      return;
    }

    const magicBoxTotalProbability = config.magicBoxRewards.reduce((sum, reward) => {
      const prob = parseFloat(reward.probability) || 0;
      return sum + prob;
    }, 0);

    if (Math.abs(magicBoxTotalProbability - 100) > 0.1) {
      showSnackbar(`Magic box probabilities must sum to exactly 100%. Current: ${magicBoxTotalProbability.toFixed(1)}%`, 'error');
      return;
    }

    // Validate spin wheel probabilities sum to 100 - ensure numbers not strings
    if (!Array.isArray(config.spinWheelRewards)) {
      showSnackbar('Spin wheel rewards configuration is invalid', 'error');
      return;
    }

    const totalProbability = config.spinWheelRewards.reduce((sum, reward) => {
      const prob = parseFloat(reward.probability) || 0;
      return sum + prob;
    }, 0);

    if (Math.abs(totalProbability - 100) > 0.1) {
      showSnackbar(`Spin wheel probabilities must sum to 100%. Current: ${totalProbability.toFixed(1)}%`, 'error');
      return;
    }

    setLoading(true);
    try {
      console.log('💾 [FRONTEND] Saving configuration:', {
        magicBoxRewards: config.magicBoxRewards,
        spinWheelRewards: config.spinWheelRewards,
        isActive: config.isActive
      });

      const response = await axiosInstance.post('/api/admin/dynamic-spin-event/config', config);

      if (response.data.success) {
        showSnackbar('Configuration saved successfully!', 'success');

        // Parse the response data properly
        let updatedConfig = { ...response.data.data };

        // Ensure magicBoxRewards is parsed if it's a JSON string
        if (typeof updatedConfig.magicBoxRewards === 'string') {
          try {
            updatedConfig.magicBoxRewards = JSON.parse(updatedConfig.magicBoxRewards);
          } catch (e) {
            console.error('Failed to parse magicBoxRewards:', e);
            updatedConfig.magicBoxRewards = [];
          }
        }

        // Ensure arrays are properly set
        if (!Array.isArray(updatedConfig.magicBoxRewards)) {
          updatedConfig.magicBoxRewards = [];
        }
        if (!Array.isArray(updatedConfig.spinWheelRewards)) {
          updatedConfig.spinWheelRewards = [];
        }

        // Map backend spinWheelRewards format to frontend format
        if (Array.isArray(updatedConfig.spinWheelRewards)) {
          updatedConfig.spinWheelRewards = updatedConfig.spinWheelRewards.map(reward => ({
            position: reward.position,
            amount: parseFloat(reward.rewardAmount) || 0, // Map rewardAmount to amount
            probability: parseFloat(reward.probability) || 0
          }));
        }

        console.log('✅ [FRONTEND] Processed response data:', {
          magicBoxRewards: updatedConfig.magicBoxRewards,
          spinWheelRewards: updatedConfig.spinWheelRewards
        });

        setConfig(updatedConfig);
      } else {
        showSnackbar(response.data.message || 'Failed to save configuration', 'error');
      }
    } catch (error) {
      showSnackbar('Error saving configuration', 'error');
      console.error('Error saving configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicBoxRewardChange = (index, field, value) => {
    const newRewards = [...config.magicBoxRewards];
    newRewards[index] = {
      ...newRewards[index],
      [field]: field === 'amount' || field === 'percentage' ? parseFloat(value) || 0 : value
    };
    setConfig({ ...config, magicBoxRewards: newRewards });
  };

  const handleSpinWheelRewardChange = (index, field, value) => {
    if (!Array.isArray(config.spinWheelRewards)) {
      return;
    }
    const newRewards = [...config.spinWheelRewards];
    newRewards[index] = {
      ...newRewards[index],
      [field]: field === 'amount' || field === 'probability' ? parseFloat(value) || 0 : value
    };
    setConfig({ ...config, spinWheelRewards: newRewards });
  };

  const calculateTotalProbability = () => {
    if (!Array.isArray(config.spinWheelRewards)) {
      return 0;
    }
    return config.spinWheelRewards.reduce((sum, reward) => {
      const prob = parseFloat(reward.probability) || 0;
      return sum + prob;
    }, 0);
  };

  const calculateMagicBoxTotalProbability = () => {
    if (!Array.isArray(config.magicBoxRewards)) {
      return 0;
    }
    return config.magicBoxRewards.reduce((sum, reward) => {
      const prob = parseFloat(reward.probability) || 0;
      return sum + prob;
    }, 0);
  };

  // Statistics Panel Component
  const StatisticsPanel = () => (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {(statistics?.totalUsers || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Users
                  </Typography>
                </Box>
                <StatsIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {(statistics?.totalSpins || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Spins
                  </Typography>
                </Box>
                <CasinoIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    ₹{(statistics?.totalRewardsDistributed || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Rewards
                  </Typography>
                </Box>
                <GiftIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: '#1e293b' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom color="white">
                Active Users
              </Typography>
              <Typography variant="h3" color="primary" fontWeight="bold">
                {(statistics?.activeUsers || 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Users active in current cycle
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: '#1e293b' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom color="white">
                Magic Box Claims
              </Typography>
              <Typography variant="h3" color="secondary" fontWeight="bold">
                {(statistics?.magicBoxClaims || 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Total magic box claims
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: '#1e293b' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom color="white">
                Pending Bonus Requests
              </Typography>
              <Typography variant="h3" color="warning.main" fontWeight="bold">
                {(statistics?.pendingBonusRequests || 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Awaiting approval
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: '#1e293b' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom color="white">
                Approved Bonus Requests
              </Typography>
              <Typography variant="h3" color="success.main" fontWeight="bold">
                {(statistics?.approvedBonusRequests || 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Successfully approved
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Bonus Requests Panel Component
  const BonusRequestsPanel = () => (
    <Box>
      <Card sx={{ backgroundColor: '#1e293b' }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h6" fontWeight="bold" color="white">
              Bonus Requests
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadBonusRequests}
              size="small"
              sx={{ color: 'white', borderColor: '#374151' }}
            >
              Refresh
            </Button>
          </Box>

          {bonusRequests.length === 0 ? (
            <Box textAlign="center" py={4}>
              <RequestIcon sx={{ fontSize: 64, color: '#6b7280', mb: 2 }} />
              <Typography variant="h6" color="#94a3b8" gutterBottom>
                No Bonus Requests
              </Typography>
              <Typography variant="body2" color="#6b7280">
                No bonus requests found. They will appear here when users make requests.
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#94a3b8', borderColor: '#374151' }}>User ID</TableCell>
                      <TableCell sx={{ color: '#94a3b8', borderColor: '#374151' }}>Amount</TableCell>
                      <TableCell sx={{ color: '#94a3b8', borderColor: '#374151' }}>Type</TableCell>
                      <TableCell sx={{ color: '#94a3b8', borderColor: '#374151' }}>Status</TableCell>
                      <TableCell sx={{ color: '#94a3b8', borderColor: '#374151' }}>Date</TableCell>
                      <TableCell sx={{ color: '#94a3b8', borderColor: '#374151' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bonusRequests
                      .slice(bonusPage * bonusRowsPerPage, bonusPage * bonusRowsPerPage + bonusRowsPerPage)
                      .map((request) => (
                        <TableRow key={request.id}>
                          <TableCell sx={{ color: 'white', borderColor: '#374151' }}>{request.userId}</TableCell>
                          <TableCell sx={{ color: 'white', borderColor: '#374151' }}>₹{request.requestedAmount}</TableCell>
                          <TableCell sx={{ borderColor: '#374151' }}>
                            <Chip
                              label="BONUS REQUEST"
                              size="small"
                              color="secondary"
                            />
                          </TableCell>
                          <TableCell sx={{ borderColor: '#374151' }}>
                            <Chip
                              label={request.status}
                              size="small"
                              color={
                                request.status === 'APPROVED' ? 'success' :
                                  request.status === 'REJECTED' ? 'error' : 'warning'
                              }
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'white', borderColor: '#374151' }}>
                            {new Date(request.requestedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell sx={{ borderColor: '#374151' }}>
                            {request.status === 'PENDING' && (
                              <Box display="flex" gap={1}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  startIcon={<ApproveIcon />}
                                  onClick={() => setActionDialog({
                                    open: true,
                                    type: 'approve',
                                    request
                                  })}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="error"
                                  startIcon={<RejectIcon />}
                                  onClick={() => setActionDialog({
                                    open: true,
                                    type: 'reject',
                                    request
                                  })}
                                >
                                  Reject
                                </Button>
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={bonusRequests.length}
                page={bonusPage}
                onPageChange={(event, newPage) => setBonusPage(newPage)}
                rowsPerPage={bonusRowsPerPage}
                onRowsPerPageChange={(event) => {
                  setBonusRowsPerPage(parseInt(event.target.value, 10));
                  setBonusPage(0);
                }}
                sx={{
                  color: 'white',
                  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                    color: '#94a3b8'
                  }
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: '100vh',
        backgroundColor: colors.background.default,
        p: 3
      }}>
        {/* Header Section */}
        <Card sx={{ mb: 3, p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{
                bgcolor: colors.primary,
                width: 56,
                height: 56
              }}>
                <CasinoIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color={colors.text.primary}>
                  Dynamic Spin Event
                </Typography>
                <Typography variant="body1" color={colors.text.secondary}>
                  Manage spin events, rewards, and user bonuses
                </Typography>
              </Box>
            </Box>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadConfiguration}
                disabled={loading}
                sx={{
                  borderColor: colors.border.light,
                  color: colors.text.secondary,
                  '&:hover': {
                    borderColor: colors.primary,
                    color: colors.primary
                  }
                }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveConfiguration}
                disabled={loading}
                sx={{
                  bgcolor: colors.primary,
                  '&:hover': {
                    bgcolor: colors.primary
                  }
                }}
              >
                Save Configuration
              </Button>
            </Box>
          </Box>
        </Card>
        {/* Tab Navigation */}
        <Card sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                color: colors.text.secondary,
                '&.Mui-selected': {
                  color: colors.primary
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: colors.primary,
                height: 3
              }
            }}
          >
            <Tab
              icon={<SettingsIcon />}
              label="Configuration"
              iconPosition="start"
            />
            <Tab
              icon={<StatsIcon />}
              label="Statistics"
              iconPosition="start"
            />
            <Tab
              icon={<HistoryIcon />}
              label="Bonus Requests"
              iconPosition="start"
            />
          </Tabs>
        </Card>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            {/* Basic Settings */}
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: colors.primary }}>
                    <SettingsIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color={colors.text.primary}>
                      Basic Configuration
                    </Typography>
                    <Typography variant="body2" color={colors.text.secondary}>
                      Configure event settings and parameters
                    </Typography>
                  </Box>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Event Name"
                      value={config.eventName}
                      onChange={(e) => setConfig({ ...config, eventName: e.target.value })}
                      sx={{
                        '& .MuiInputLabel-root': { color: '#94a3b8' },
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: '#374151' }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.isActive}
                          onChange={(e) => setConfig({ ...config, isActive: e.target.checked })}
                        />
                      }
                      label="Event Active"
                      sx={{ color: 'white' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Target Bonus Amount (₹)"
                      value={config.targetBonusAmount}
                      onChange={(e) => setConfig({ ...config, targetBonusAmount: parseFloat(e.target.value) || 0 })}
                      sx={{
                        '& .MuiInputLabel-root': { color: '#94a3b8' },
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: '#374151' }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Cycle Duration (days)"
                      value={config.cycleDurationDays}
                      onChange={(e) => setConfig({ ...config, cycleDurationDays: parseInt(e.target.value) || 1 })}
                      sx={{
                        '& .MuiInputLabel-root': { color: '#94a3b8' },
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: '#374151' }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Min Deposit for Referral Spin (₹)"
                      value={config.minDepositForReferralSpin}
                      onChange={(e) => setConfig({ ...config, minDepositForReferralSpin: parseFloat(e.target.value) || 0 })}
                      sx={{
                        '& .MuiInputLabel-root': { color: '#94a3b8' },
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: '#374151' }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Magic Box Rewards - 4 Options */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <GiftIcon sx={{ fontSize: 32, color: '#fbbf24' }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        Magic Box Rewards (4 Options)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Configure exactly 4 reward options. Probabilities must sum to 100%
                      </Typography>
                    </Box>
                  </Box>
                  {Array.isArray(config.magicBoxRewards) && config.magicBoxRewards.length > 0 && (
                    <Chip 
                      label={`Total: ${calculateMagicBoxTotalProbability().toFixed(1)}%`}
                      color={Math.abs(calculateMagicBoxTotalProbability() - 100) < 0.1 ? 'success' : 'error'}
                    />
                  )}
                </Box>

                {/* Show message if no rewards configured */}
                {!Array.isArray(config.magicBoxRewards) || config.magicBoxRewards.length === 0 ? (
                  <Box
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      backgroundColor: colors.background.paper,
                      borderRadius: 2,
                      border: `1px solid ${colors.border.light}`
                    }}
                  >
                    <GiftIcon sx={{ fontSize: 48, color: colors.text.disabled, mb: 2 }} />
                    <Typography variant="h6" color={colors.text.secondary} gutterBottom>
                      No Magic Box Rewards Configured
                    </Typography>
                    <Typography variant="body2" color={colors.text.disabled}>
                      Click "Setup Default" to create default magic box rewards
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {config.magicBoxRewards.map((reward, index) => (
                      <Grid item xs={12} md={6} key={reward.id || index}>
                        <Paper
                          elevation={2}
                          sx={{
                            p: 3,
                            backgroundColor: colors.background.paper,
                            border: `1px solid ${colors.border.light}`
                          }}
                        >
                          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                            <Typography variant="subtitle1" fontWeight="bold" color={colors.text.primary}>
                              Magic Box Option {index + 1}
                            </Typography>
                            <Chip
                              label={`${reward.probability || 0}% probability`}
                              size="small"
                              color="primary"
                            />
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                type="number"
                                label="Amount (₹)"
                                value={reward.amount || ''}
                                onChange={(e) => handleMagicBoxRewardChange(index, 'amount', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                  '& .MuiInputLabel-root': { color: colors.text.secondary },
                                  '& .MuiOutlinedInput-root': {
                                    color: colors.text.primary,
                                    '& fieldset': { borderColor: colors.border.light },
                                    '&:hover fieldset': { borderColor: colors.primary },
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                type="number"
                                label="Probability (%)"
                                value={reward.probability || ''}
                                onChange={(e) => handleMagicBoxRewardChange(index, 'probability', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: 0, max: 100, step: 1 }}
                                sx={{
                                  '& .MuiInputLabel-root': { color: colors.text.secondary },
                                  '& .MuiOutlinedInput-root': {
                                    color: colors.text.primary,
                                    '& fieldset': { borderColor: colors.border.light },
                                    '&:hover fieldset': { borderColor: colors.primary },
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Display Label"
                                value={reward.label || ''}
                                onChange={(e) => handleMagicBoxRewardChange(index, 'label', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                placeholder="e.g., Small Reward, Big Win"
                                sx={{
                                  '& .MuiInputLabel-root': { color: colors.text.secondary },
                                  '& .MuiOutlinedInput-root': {
                                    color: colors.text.primary,
                                    '& fieldset': { borderColor: colors.border.light },
                                    '&:hover fieldset': { borderColor: colors.primary },
                                  }
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {Array.isArray(config.magicBoxRewards) && config.magicBoxRewards.length > 0 && Math.abs(calculateMagicBoxTotalProbability() - 100) > 0.1 && (
                  <Alert severity="warning" sx={{ mt: 3 }}>
                    <Typography variant="body2">
                      Magic box probabilities must equal 100%. Current total: {calculateMagicBoxTotalProbability().toFixed(1)}%
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Spin Wheel Rewards - 8 Sections */}
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <CasinoIcon sx={{ fontSize: 32, color: colors.info }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color={colors.text.primary}>
                        Spin Wheel Rewards (8 Sections)
                      </Typography>
                      <Typography variant="body2" color={colors.text.secondary}>
                        Configure exactly 8 reward sections. Probabilities must sum to 100%
                      </Typography>
                    </Box>
                  </Box>
                  {Array.isArray(config.spinWheelRewards) && config.spinWheelRewards.length > 0 && (
                    <Chip
                      label={`Total: ${calculateTotalProbability().toFixed(1)}%`}
                      color={Math.abs(calculateTotalProbability() - 100) < 0.1 ? 'success' : 'error'}
                    />
                  )}
                </Box>

                {/* Show message if no rewards configured */}
                {!Array.isArray(config.spinWheelRewards) || config.spinWheelRewards.length === 0 ? (
                  <Box
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      backgroundColor: colors.background.paper,
                      borderRadius: 2,
                      border: `1px solid ${colors.border.light}`
                    }}
                  >
                    <CasinoIcon sx={{ fontSize: 48, color: colors.text.disabled, mb: 2 }} />
                    <Typography variant="h6" color={colors.text.secondary} gutterBottom>
                      No Spin Wheel Rewards Configured
                    </Typography>
                    <Typography variant="body2" color={colors.text.disabled}>
                      Click "Setup Default" to create default spin wheel rewards
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {config.spinWheelRewards.map((reward, index) => (
                      <Grid item xs={12} md={6} key={reward.position}>
                        <Paper elevation={1} sx={{ p: 2 }}>
                          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            Section {reward.position}
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                size="small"
                                type="number"
                                label="Amount (₹)"
                                value={reward.amount}
                                onChange={(e) => handleSpinWheelRewardChange(index, 'amount', e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                size="small"
                                type="number"
                                label="Probability (%)"
                                value={reward.probability}
                                onChange={(e) => handleSpinWheelRewardChange(index, 'probability', e.target.value)}
                                inputProps={{ min: 0, max: 100, step: 0.1 }}
                              />
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {Array.isArray(config.spinWheelRewards) && config.spinWheelRewards.length > 0 && Math.abs(calculateTotalProbability() - 100) > 0.1 && (
                  <Alert severity="warning" sx={{ mt: 3 }}>
                    <Typography variant="body2">
                      Total probability must equal 100%. Current total: {calculateTotalProbability().toFixed(1)}%
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Statistics Tab */}
        {activeTab === 1 && <StatisticsPanel />}

        {/* Bonus Requests Tab */}
        {activeTab === 2 && <BonusRequestsPanel />}

        {/* Action Dialog */}
        <Dialog
          open={actionDialog.open}
          onClose={() => setActionDialog({ open: false, type: '', request: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {actionDialog.type === 'approve' ? 'Approve Request' : 'Reject Request'}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to {actionDialog.type} this bonus request?
            </Typography>
            {actionDialog.request && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>User ID:</strong> {actionDialog.request.userId}
                </Typography>
                <Typography variant="body2">
                  <strong>Amount:</strong> ₹{actionDialog.request.requestedAmount}
                </Typography>
                <Typography variant="body2">
                  <strong>Type:</strong> BONUS REQUEST
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setActionDialog({ open: false, type: '', request: null })}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color={actionDialog.type === 'approve' ? 'success' : 'error'}
              onClick={() => handleBonusAction(
                actionDialog.request?.id,
                actionDialog.type,
                `${actionDialog.type}d by admin`
              )}
            >
              {actionDialog.type === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default DynamicSpinEventSimpleAdmin;
