// ==========================================
// Dynamic Spin Event Statistics Panel
// Location: src/components/dynamicSpinEvent/admin/StatisticsPanel.jsx
// ==========================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  MonetizationOn as MoneyIcon,
  Casino as CasinoIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import dynamicSpinEventAdminService from '../../../services/dynamicSpinEventAdminService';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1e293b',
  color: '#ffffff',
  padding: theme.spacing(3),
  borderRadius: 16,
  marginBottom: theme.spacing(3),
}));

const StatCard = styled(Card)(({ theme, color = 'primary' }) => ({
  backgroundColor: '#334155',
  color: '#ffffff',
  borderRadius: 12,
  border: '1px solid #475569',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
  },
  '& .stat-icon': {
    backgroundColor: color === 'primary' ? '#3b82f6' : 
                   color === 'success' ? '#10b981' :
                   color === 'warning' ? '#f59e0b' :
                   color === 'error' ? '#ef4444' : '#6366f1',
  }
}));

const MetricBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
}));

const StatisticsPanel = ({ configData, showNotification }) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const result = await dynamicSpinEventAdminService.getStatistics();
      
      if (result.success) {
        setStatistics(result.data);
        setLastUpdated(new Date());
      } else {
        showNotification(result.message, 'error');
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
      showNotification('Failed to load statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return dynamicSpinEventAdminService.formatCurrency(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  if (!configData) {
    return (
      <Alert severity="info" sx={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
        Please configure the system first to view statistics.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <AssessmentIcon sx={{ color: '#3b82f6', fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold" color="#ffffff">
              System Statistics
            </Typography>
            <Typography variant="body2" color="#94a3b8">
              {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
            </Typography>
          </Box>
        </Box>
        
        <Tooltip title="Refresh Statistics">
          <IconButton
            onClick={loadStatistics}
            disabled={loading}
            sx={{ color: '#94a3b8', '&:hover': { color: '#3b82f6' } }}
          >
            {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {loading && !statistics ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress size={48} />
        </Box>
      ) : (
        <>
          {/* Overview Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard color="primary">
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar className="stat-icon">
                      <PeopleIcon />
                    </Avatar>
                    <MetricBox>
                      <Typography variant="h4" fontWeight="bold">
                        {formatNumber(statistics?.totalUsers || 0)}
                      </Typography>
                      <Typography variant="body2" color="#94a3b8">
                        Total Users
                      </Typography>
                    </MetricBox>
                  </Box>
                </CardContent>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard color="success">
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar className="stat-icon">
                      <CasinoIcon />
                    </Avatar>
                    <MetricBox>
                      <Typography variant="h4" fontWeight="bold">
                        {formatNumber(statistics?.totalSpins || 0)}
                      </Typography>
                      <Typography variant="body2" color="#94a3b8">
                        Total Spins
                      </Typography>
                    </MetricBox>
                  </Box>
                </CardContent>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard color="warning">
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar className="stat-icon">
                      <MoneyIcon />
                    </Avatar>
                    <MetricBox>
                      <Typography variant="h4" fontWeight="bold">
                        {formatCurrency(statistics?.totalRewardsDistributed || 0)}
                      </Typography>
                      <Typography variant="body2" color="#94a3b8">
                        Rewards Distributed
                      </Typography>
                    </MetricBox>
                  </Box>
                </CardContent>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard color="error">
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar className="stat-icon">
                      <TrendingUpIcon />
                    </Avatar>
                    <MetricBox>
                      <Typography variant="h4" fontWeight="bold">
                        {formatNumber(statistics?.activeUsers || 0)}
                      </Typography>
                      <Typography variant="body2" color="#94a3b8">
                        Active Users
                      </Typography>
                    </MetricBox>
                  </Box>
                </CardContent>
              </StatCard>
            </Grid>
          </Grid>

          {/* Detailed Statistics */}
          <Grid container spacing={3}>
            {/* System Performance */}
            <Grid item xs={12} md={6}>
              <StyledPaper>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  System Performance
                </Typography>
                
                <Box mb={3}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">User Engagement Rate</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatPercentage(statistics?.engagementRate || 0)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={statistics?.engagementRate || 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#475569',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#10b981',
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                <Box mb={3}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Bonus Conversion Rate</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatPercentage(statistics?.bonusConversionRate || 0)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={statistics?.bonusConversionRate || 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#475569',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#3b82f6',
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">System Profitability</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatPercentage(statistics?.profitabilityRate || 0)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={statistics?.profitabilityRate || 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#475569',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#f59e0b',
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              </StyledPaper>
            </Grid>

            {/* Financial Overview */}
            <Grid item xs={12} md={6}>
              <StyledPaper>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Financial Overview
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={2} sx={{ backgroundColor: '#475569', borderRadius: 2 }}>
                      <Typography variant="h5" fontWeight="bold" color="#10b981">
                        {formatCurrency(statistics?.totalDeposits || 0)}
                      </Typography>
                      <Typography variant="caption" color="#94a3b8">
                        Total Deposits
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box textAlign="center" p={2} sx={{ backgroundColor: '#475569', borderRadius: 2 }}>
                      <Typography variant="h5" fontWeight="bold" color="#ef4444">
                        {formatCurrency(statistics?.totalPayouts || 0)}
                      </Typography>
                      <Typography variant="caption" color="#94a3b8">
                        Total Payouts
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box textAlign="center" p={2} sx={{ backgroundColor: '#475569', borderRadius: 2 }}>
                      <Typography variant="h5" fontWeight="bold" color="#3b82f6">
                        {formatCurrency(statistics?.netProfit || 0)}
                      </Typography>
                      <Typography variant="caption" color="#94a3b8">
                        Net Profit
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box textAlign="center" p={2} sx={{ backgroundColor: '#475569', borderRadius: 2 }}>
                      <Typography variant="h5" fontWeight="bold" color="#f59e0b">
                        {formatCurrency(statistics?.avgRewardPerSpin || 0)}
                      </Typography>
                      <Typography variant="caption" color="#94a3b8">
                        Avg Reward/Spin
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </StyledPaper>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Recent Activity Summary
                </Typography>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 'bold' }}>Metric</TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 'bold' }}>Today</TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 'bold' }}>This Week</TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 'bold' }}>This Month</TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 'bold' }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ color: '#ffffff' }}>New Users</TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{formatNumber(statistics?.daily?.newUsers || 0)}</TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{formatNumber(statistics?.weekly?.newUsers || 0)}</TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{formatNumber(statistics?.monthly?.newUsers || 0)}</TableCell>
                        <TableCell>
                          <Chip label="Growing" color="success" size="small" />
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell sx={{ color: '#ffffff' }}>Spins Performed</TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{formatNumber(statistics?.daily?.spins || 0)}</TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{formatNumber(statistics?.weekly?.spins || 0)}</TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{formatNumber(statistics?.monthly?.spins || 0)}</TableCell>
                        <TableCell>
                          <Chip label="Active" color="primary" size="small" />
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell sx={{ color: '#ffffff' }}>Rewards Distributed</TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{formatCurrency(statistics?.daily?.rewards || 0)}</TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{formatCurrency(statistics?.weekly?.rewards || 0)}</TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{formatCurrency(statistics?.monthly?.rewards || 0)}</TableCell>
                        <TableCell>
                          <Chip label="Controlled" color="warning" size="small" />
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell sx={{ color: '#ffffff' }}>Bonus Requests</TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{formatNumber(statistics?.daily?.bonusRequests || 0)}</TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{formatNumber(statistics?.weekly?.bonusRequests || 0)}</TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{formatNumber(statistics?.monthly?.bonusRequests || 0)}</TableCell>
                        <TableCell>
                          <Chip label="Pending Review" color="info" size="small" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </StyledPaper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default StatisticsPanel;
