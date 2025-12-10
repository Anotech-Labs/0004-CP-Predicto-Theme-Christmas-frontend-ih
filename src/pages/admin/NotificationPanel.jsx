import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { alpha, createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  CssBaseline,
  Tooltip,
  Chip,
  Divider,
  Stack,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';

import {
  Send as SendIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  BugReport as TestIcon,
  Campaign as CampaignIcon,
  SportsEsports as GameIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  BugReport
} from '@mui/icons-material';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
    button: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
    },
    h1: { fontFamily: 'Inter, sans-serif' },
    h2: { fontFamily: 'Inter, sans-serif' },
    h3: { fontFamily: 'Inter, sans-serif' },
    h4: { fontFamily: 'Inter, sans-serif' },
    h5: { fontFamily: 'Inter, sans-serif' },
    h6: { fontFamily: 'Inter, sans-serif' },
    body1: { fontFamily: 'Inter, sans-serif' },
    body2: { fontFamily: 'Inter, sans-serif' },
  },
  palette: {
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#7c3aed',
      light: '#8b5cf6',
      dark: '#6d28d9',
    },
    error: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
    },
    success: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '12px',
        },
      },
    },
  },
});

const NotificationPanel = () => {
  const { axiosInstance } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    url: '',
    targetType: 'all',
    targetEmails: '',
    gameType: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [serviceHealth, setServiceHealth] = useState(null);
  const [openTestDialog, setOpenTestDialog] = useState(false);

  // Check service health on component mount
  useEffect(() => {
    checkServiceHealth();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const checkServiceHealth = async () => {
    try {
      // 🚀 USING YOUR AXIOS PATTERN
      const response = await axiosInstance.get('/api/push-notification/health');
      setServiceHealth(response.data);
      
      if (response.data.success) {
        showSnackbar('OneSignal service is running perfectly!', 'success');
      }
    } catch (error) {
      console.error('Health check failed:', error);
      setServiceHealth({ 
        success: false, 
        message: error.response?.data?.message || 'Service unavailable' 
      });
      showSnackbar('Failed to check service health', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        message: formData.message,
        url: formData.url || undefined,
        targetType: formData.targetType,
        gameType: formData.gameType,
        ...(formData.targetType === 'specific' && {
          targetEmails: formData.targetEmails 
            ? formData.targetEmails.split(',').map(email => email.trim())
            : []
        })
      };

      // 🚀 USING YOUR AXIOS PATTERN
      const response = await axiosInstance.post('/api/push-notification/send-promotional', payload);
      
      if (response.data.success) {
        showSnackbar(
          `✅ Notification sent to ${response.data.data.recipients} users successfully!`, 
          'success'
        );
        
        // Reset form on success
        setFormData({ 
          title: '', 
          message: '', 
          url: '', 
          targetType: 'all', 
          targetEmails: '',
          gameType: 'general'
        });
      } else {
        showSnackbar(response.data.message || 'Failed to send notification', 'error');
      }
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 'Failed to send notification', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const sendTest = async () => {
    setLoading(true);
    
    try {
      // 🚀 USING YOUR AXIOS PATTERN
      const response = await axiosInstance.post('/api/push-notification/test', {
        title: formData.title || '🎮 Test Gaming Notification',
        message: formData.message || 'This is a test notification from your gaming platform! All systems working perfectly! 🚀🎰'
      });

      if (response.data.success) {
        showSnackbar(
          `✅ Test notification sent successfully to ${response.data.data.sentTo}!`, 
          'success'
        );
        setOpenTestDialog(false);
      } else {
        showSnackbar(response.data.message || 'Test notification failed', 'error');
      }
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 'Failed to send test notification', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const sendGameNotification = async (gameType) => {
    if (!formData.title || !formData.message) {
      showSnackbar('Please fill in title and message first', 'warning');
      return;
    }

    setLoading(true);

    try {
      // 🚀 USING YOUR AXIOS PATTERN
      const response = await axiosInstance.post('/api/push-notification/send-game', {
        gameType,
        title: formData.title,
        message: formData.message,
        url: formData.url || undefined
      });

      if (response.data.success) {
        showSnackbar(
          `✅ ${gameType.toUpperCase()} notification sent to ${response.data.data.recipients} users!`, 
          'success'
        );
      } else {
        showSnackbar(response.data.message || `Failed to send ${gameType} notification`, 'error');
      }
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || `Failed to send ${gameType} notification`, 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const gameTypes = [
    { value: 'general', label: '🌟 General', color: 'primary' },
    { value: 'wingo', label: '🎯 Wingo', color: 'secondary' },
    { value: 'k3', label: '🎲 K3', color: 'success' },
    { value: '5d', label: '🎰 5D', color: 'warning' },
    { value: 'car-race', label: '🏎️ Car Race', color: 'error' },
    { value: 'lucky-spin', label: '🍀 Lucky Spin', color: 'info' }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ margin: '0 auto', p: 3, backgroundColor: '#f8fafc' }}>
        
        {/* Header Section */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
          >
            <Box>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
                🚀 Push Notification Control Panel
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Send promotional notifications to all your gaming users instantly
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={checkServiceHealth}
                disabled={loading}
              >
                Check Service
              </Button>
              <Button
                variant="contained"
                startIcon={<BugReport />}
                onClick={() => setOpenTestDialog(true)}
                disabled={loading}
                color="warning"
              >
                Send Test
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Service Health Status */}
        {serviceHealth && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                {serviceHealth.success ? (
                  <SuccessIcon color="success" />
                ) : (
                  <ErrorIcon color="error" />
                )}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div">
                    Service Status: {serviceHealth.success ? '🟢 ONLINE' : '🔴 OFFLINE'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {serviceHealth.message || 'Checking service...'}
                  </Typography>
                </Box>
                <Chip
                  label={serviceHealth.success ? 'Active' : 'Inactive'}
                  color={serviceHealth.success ? 'success' : 'error'}
                  variant="outlined"
                />
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Main Form */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            {loading && <LinearProgress sx={{ mb: 2 }} />}
            
            {/* Title and Game Type Row */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Notification Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="🎉 MEGA GAMING SALE - 50% OFF!"
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CampaignIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Game Type</InputLabel>
                <Select
                  value={formData.gameType}
                  onChange={(e) => setFormData({...formData, gameType: e.target.value})}
                  disabled={loading}
                  startAdornment={<GameIcon fontSize="small" sx={{ mr: 1, ml: 1 }} />}
                >
                  {gameTypes.map((game) => (
                    <MenuItem key={game.value} value={game.value}>
                      {game.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {/* Message */}
            <TextField
              fullWidth
              label="Notification Message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="🔥 Limited time offer! Get 50% off all games, exclusive bonuses, and free spins! Don't miss out - play now and win big! 💰🎰"
              required
              multiline
              rows={4}
              disabled={loading}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                    <NotificationsIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Target and URL Row */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Target Audience</InputLabel>
                <Select
                  value={formData.targetType}
                  onChange={(e) => setFormData({...formData, targetType: e.target.value})}
                  disabled={loading}
                >
                  <MenuItem value="all">🌟 All Gaming Users</MenuItem>
                  <MenuItem value="specific">🎯 Specific Users (by email)</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Click Action URL (Optional)"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                placeholder="https://yourdomain.com/games"
                disabled={loading}
              />
            </Stack>

            {/* Specific Emails (conditional) */}
            {formData.targetType === 'specific' && (
              <TextField
                fullWidth
                label="Target Emails (comma separated)"
                value={formData.targetEmails}
                onChange={(e) => setFormData({...formData, targetEmails: e.target.value})}
                placeholder="user1@example.com, user2@example.com"
                disabled={loading}
                sx={{ mb: 2 }}
              />
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<SendIcon />}
              disabled={loading}
              fullWidth
              sx={{ py: 1.5, fontSize: '1.1rem' }}
            >
              {loading ? 'Sending Notification...' : '🚀 Send Notification'}
            </Button>
          </Box>
        </Paper>

        {/* Game-Specific Quick Buttons */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            🎮 Quick Game Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Fill in title & message above, then click a game to send game-specific notification
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {gameTypes.slice(1).map((game) => (
              <Button
                key={game.value}
                variant="outlined"
                size="small"
                onClick={() => sendGameNotification(game.value)}
                disabled={loading || !formData.title || !formData.message}
                sx={{ mb: 1 }}
              >
                {game.label}
              </Button>
            ))}
          </Stack>
        </Paper>

        {/* Test Dialog */}
        <Dialog
          open={openTestDialog}
          onClose={() => setOpenTestDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ elevation: 0, sx: { borderRadius: 2 } }}
        >
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={1}>
              <BugReport color="warning" />
              <Typography variant="h6">Send Test Notification</Typography>
            </Stack>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              This will send a test notification to your admin email address.
            </Typography>
            <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Preview:
              </Typography>
              <Typography variant="body2">
                <strong>Title:</strong> {formData.title || '🎮 Test Gaming Notification'}
              </Typography>
              <Typography variant="body2">
                <strong>Message:</strong> {formData.message || 'This is a test notification from your gaming platform!'}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setOpenTestDialog(false)}
              variant="outlined"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={sendTest}
              variant="contained"
              color="warning"
              startIcon={<BugReport />}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Test'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            elevation={6}
            sx={{
              width: '100%',
              fontFamily: 'Inter, sans-serif',
              '& .MuiAlert-message': {
                fontFamily: 'Inter, sans-serif'
              }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default NotificationPanel;