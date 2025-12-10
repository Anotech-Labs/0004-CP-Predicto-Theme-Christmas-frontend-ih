import React, { useState } from 'react';
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
  Snackbar,
  Alert,
  CssBaseline,
  Divider,
  Stack,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Avatar
} from '@mui/material';

import {
  Notifications as NotificationsIcon,
  Send as SendIcon,
  Science as TestIcon,
  Campaign as CampaignIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Title as TitleIcon,
  Message as MessageIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
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
    MuiTextField: {
      styleOverrides: {
        root: { fontFamily: 'Inter, sans-serif' },
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
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
        },
      },
    },
  },
});

const PushNotificationAdmin = () => {
  const { axiosInstance } = useAuth();
  const [openSendDialog, setOpenSendDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    url: '',
    imageUrl: ''
  });

  const handleSendNotification = async () => {
    if (!formData.title || !formData.message) {
      showSnackbar('Title and message are required', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/push-notifications/send-to-all', {
        title: formData.title,
        message: formData.message,
        url: formData.url || window.location.origin,
        imageUrl: formData.imageUrl || undefined,
      });

      if (response.data.success) {
        setLastResult({
          type: 'success',
          recipients: response.data.data.recipients,
          notificationId: response.data.data.notificationId,
          timestamp: new Date().toLocaleString()
        });
        showSnackbar(`✅ Notification sent to ${response.data.data.recipients} users!`, 'success');
        setOpenSendDialog(false);
        resetForm();
      }
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to send notification', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    setTestLoading(true);
    try {
      const response = await axiosInstance.post('/api/push-notifications/test');
      
      if (response.data.success) {
        setLastResult({
          type: 'test',
          recipients: response.data.data.recipients || 'N/A',
          timestamp: new Date().toLocaleString()
        });
        showSnackbar('🧪 Test notification sent successfully!', 'success');
      }
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to send test notification', 'error');
    } finally {
      setTestLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      url: '',
      imageUrl: ''
    });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const NotificationForm = () => (
    <>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <CampaignIcon color="primary" />
          <Typography variant="h6" sx={{ fontFamily: 'Inter, sans-serif' }}>
            Send Push Notification
          </Typography>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box component="form" sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Notification Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            margin="normal"
            placeholder="🎉 Special Offer!"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TitleIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            fullWidth
            label="Message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            margin="normal"
            multiline
            rows={3}
            placeholder="Get 50% bonus on your next deposit! Limited time only."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                  <MessageIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            fullWidth
            label="Click URL (Optional)"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            margin="normal"
            placeholder="https://yourwebsite.com/offer"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            fullWidth
            label="Image URL (Optional)"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            margin="normal"
            placeholder="https://yourwebsite.com/promo-image.jpg"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ImageIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={() => {
            setOpenSendDialog(false);
            resetForm();
          }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSendNotification}
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} /> : <SendIcon />}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send to All Users'}
        </Button>
      </DialogActions>
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ margin: '0 auto', p: 3, backgroundColor: '#f8fafc' }}>
        
        {/* Header */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
          >
            <Box>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
                <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Push Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Send real-time notifications to all your website users
              </Typography>
            </Box>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <Button
                variant="outlined"
                startIcon={testLoading ? <CircularProgress size={16} /> : <TestIcon />}
                onClick={handleTestNotification}
                disabled={testLoading}
                fullWidth={{ xs: true, sm: false }}
              >
                {testLoading ? 'Testing...' : 'Send Test'}
              </Button>
              <Button
                variant="contained"
                startIcon={<CampaignIcon />}
                onClick={() => setOpenSendDialog(true)}
                fullWidth={{ xs: true, sm: false }}
              >
                Send Notification
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <NotificationsIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Push Notification Service
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      OneSignal Integration Active
                    </Typography>
                    <Chip 
                      label="Connected" 
                      color="success" 
                      size="small" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: lastResult?.type === 'success' ? 'success.main' : 'secondary.main' }}>
                    {lastResult?.type === 'success' ? <SuccessIcon /> : <TestIcon />}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Last Notification
                    </Typography>
                    {lastResult ? (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {lastResult.type === 'test' ? 'Test notification' : `Sent to ${lastResult.recipients} users`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {lastResult.timestamp}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No notifications sent yet
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Features Info */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            🚀 Features
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <CampaignIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Instant Delivery
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Real-time push notifications
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <ImageIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Rich Media
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Images & custom URLs
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <NotificationsIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Cross-Browser
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Works on all devices
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <TestIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Test Mode
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Test before sending
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Send Notification Dialog */}
        <Dialog
          open={openSendDialog}
          onClose={() => setOpenSendDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            elevation: 0,
            sx: { borderRadius: 2 }
          }}
        >
          <NotificationForm />
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

export default PushNotificationAdmin;