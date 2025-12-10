import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDynamicSpinEventAdmin } from '../../hooks/useDynamicSpinEventAdmin';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop,
  Chip,
  IconButton,
  Tooltip,
  ThemeProvider
} from '@mui/material';
import {
  Settings as SettingsIcon,
  BarChart as StatsIcon,
  RequestPage as RequestIcon,
  Refresh as RefreshIcon,
  Casino as CasinoIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Import components
import ConfigurationPanel from '../../components/dynamicSpinEvent/admin/ConfigurationPanel';
import StatisticsPanel from '../../components/dynamicSpinEvent/admin/StatisticsPanel';
import BonusRequestsPanel from '../../components/dynamicSpinEvent/admin/BonusRequestsPanel';

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#0f172a',
  color: '#ffffff',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1e293b',
  color: '#ffffff',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: '#334155',
  '& .MuiTab-root': {
    color: '#94a3b8',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    minHeight: 64,
    '&.Mui-selected': {
      color: '#3b82f6',
    },
  },
  '& .MuiTabs-indicator': {
    backgroundColor: '#3b82f6',
    height: 3,
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  padding: theme.spacing(3),
  borderBottom: '1px solid #475569',
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  ...(status === 'active' && {
    backgroundColor: '#10b981',
    color: '#ffffff',
  }),
  ...(status === 'inactive' && {
    backgroundColor: '#ef4444',
    color: '#ffffff',
  }),
  ...(status === 'setup' && {
    backgroundColor: '#f59e0b',
    color: '#ffffff',
  }),
}));

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const DynamicSpinEventAdmin = () => {
  const { isDemoAdmin, handleDemoAdminClick } = useAuth();
  const dynamicSpinEventAdmin = useDynamicSpinEventAdmin();
  
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [systemStatus, setSystemStatus] = useState('loading');
  const [configData, setConfigData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Load initial data
  useEffect(() => {
    loadSystemStatus();
  }, []);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const loadSystemStatus = async () => {
    setLoading(true);
    try {
      const response = await dynamicSpinEventAdmin.getConfiguration();
      
      if (response.success && response.data) {
        setConfigData(response.data);
        setSystemStatus(response.data.isActive ? 'active' : 'inactive');
      } else {
        setSystemStatus('setup');
        setConfigData(null);
      }
    } catch (error) {
      console.error('Error loading system status:', error);
      setSystemStatus('error');
      showSnackbar('Failed to load system status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleConfigurationSaved = (newConfig) => {
    setConfigData(newConfig);
    setSystemStatus(newConfig.isActive ? 'active' : 'inactive');
    showSnackbar('Configuration saved successfully!', 'success');
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'active': return 'active';
      case 'inactive': return 'inactive';
      case 'setup': return 'setup';
      default: return 'setup';
    }
  };

  const getStatusText = () => {
    switch (systemStatus) {
      case 'active': return 'System Active';
      case 'inactive': return 'System Inactive';
      case 'setup': return 'Setup Required';
      case 'loading': return 'Loading...';
      default: return 'Unknown Status';
    }
  };

  return (
    <StyledContainer maxWidth="xl">
      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Header */}
      <StyledPaper sx={{ mb: 3 }}>
        <HeaderBox>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <CasinoIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
              <Box>
                <Typography variant="h4" fontWeight="bold" color="#ffffff">
                  Dynamic Spin Event Management
                </Typography>
                <Typography variant="body1" color="#94a3b8" sx={{ mt: 0.5 }}>
                  Comprehensive admin panel for managing spin events, rewards, and user bonuses
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <StatusChip
                status={getStatusColor()}
                label={getStatusText()}
                icon={systemStatus === 'loading' ? <CircularProgress size={16} /> : undefined}
              />
              <Tooltip title="Refresh System Status">
                <IconButton
                  onClick={loadSystemStatus}
                  sx={{ color: '#94a3b8', '&:hover': { color: '#3b82f6' } }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </HeaderBox>

        {/* Navigation Tabs */}
        <StyledTabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          aria-label="admin panel tabs"
        >
          <Tab
            icon={<SettingsIcon />}
            label="Configuration"
            iconPosition="start"
            sx={{ gap: 1 }}
          />
          <Tab
            icon={<StatsIcon />}
            label="Statistics"
            iconPosition="start"
            sx={{ gap: 1 }}
          />
          <Tab
            icon={<RequestIcon />}
            label="Bonus Requests"
            iconPosition="start"
            sx={{ gap: 1 }}
          />
        </StyledTabs>
      </StyledPaper>

      {/* Tab Panels */}
      <TabPanel value={activeTab} index={0}>
        <ConfigurationPanel
          configData={configData}
          onConfigurationSaved={handleConfigurationSaved}
          showNotification={showSnackbar}
          axiosInstance={axiosInstance}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <StatisticsPanel
          configData={configData}
          showNotification={showSnackbar}
          axiosInstance={axiosInstance}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <BonusRequestsPanel
          configData={configData}
          showNotification={showSnackbar}
          axiosInstance={axiosInstance}
        />
      </TabPanel>

      {/* Notification Snackbar */}
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default DynamicSpinEventAdmin;
