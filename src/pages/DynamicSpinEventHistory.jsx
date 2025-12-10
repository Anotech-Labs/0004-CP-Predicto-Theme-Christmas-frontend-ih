import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Mobile from '../components/layout/Mobile';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  History as HistoryIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DynamicSpinEventHistory = () => {
  const navigate = useNavigate();
  const { user, axiosInstance } = useAuth();

  // State management
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 0 });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchHistory = async (page = 1, retryCount = 0) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/activity/dynamic-spin-event/history?page=${page}&limit=15`);
      if (response?.data?.success) {
        const historyData = response.data.data || {};
        const items = Array.isArray(historyData.items) ? historyData.items : [];
        const paginationData = historyData.pagination || { page: 1, limit: 15, total: 0, totalPages: 0 };
        
        setHistory(items);
        setPagination(paginationData);
        
        console.log(`✅ [HISTORY] Loaded: ${items.length} items, page ${paginationData.page}/${paginationData.totalPages}`);
      } else {
        throw new Error('Invalid history response');
      }
    } catch (error) {
      console.error('❌ [HISTORY] Error fetching history:', error);
      if (retryCount < 2) {
        console.log(`🔄 [HISTORY] Retrying fetch (${retryCount + 1}/3)`);
        setTimeout(() => fetchHistory(page, retryCount + 1), 1000);
      } else {
        showSnackbar('Failed to load history. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchHistory(newPage);
    }
  };

  const handleRefresh = () => {
    fetchHistory(pagination.page);
  };

  useEffect(() => {
    fetchHistory(1);
  }, []);

  const getSpinTypeIcon = (type) => {
    switch(type) {
      case 'MAGIC_BOX': return '🎁';
      case 'DAILY_SPIN': return '🎰';
      case 'SPIN_WHEEL': return '🎰';
      case 'REFERRAL': return '🤝';
      default: return '⭐';
    }
  };

  const getSpinTypeLabel = (type) => {
    switch(type) {
      case 'MAGIC_BOX': return 'Magic Box';
      case 'DAILY_SPIN': return 'Spin Wheel';
      case 'SPIN_WHEEL': return 'Spin Wheel';
      case 'REFERRAL': return 'Referral Bonus';
      default: return 'Reward';
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <Mobile>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#ffffff' }}>
        {/* Header */}
        <Box 
          sx={{ 
            backgroundColor: '#1e293b', 
            borderBottom: '1px solid #334155',
            position: 'sticky',
            top: 0,
            zIndex: 1000
          }}
        >
          <Container maxWidth="sm" sx={{ px: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" py={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <IconButton 
                  onClick={() => navigate('/dynamic-spin-event')}
                  sx={{ color: '#94a3b8' }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Box display="flex" alignItems="center" gap={1}>
                  <HistoryIcon sx={{ color: '#3b82f6', fontSize: 28 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Spin History
                  </Typography>
                </Box>
              </Box>
              <IconButton 
                onClick={handleRefresh}
                disabled={loading}
                sx={{ color: '#3b82f6' }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Container>
        </Box>

        {/* Content */}
        <Container maxWidth="sm" sx={{ px: 2, py: 2 }}>
          {/* Stats Summary */}
          <Box 
            sx={{ 
              backgroundColor: '#1e293b', 
              borderRadius: 2, 
              p: 3, 
              mb: 3,
              border: '1px solid #334155'
            }}
          >
            <Box textAlign="center">
              <Typography variant="h4" color="#10b981" fontWeight="bold" gutterBottom>
                {pagination.total}
              </Typography>
              <Typography variant="body1" color="#e2e8f0">
                Total Spins Completed
              </Typography>
              <Typography variant="caption" color="#64748b">
                Your complete spin activity history
              </Typography>
            </Box>
          </Box>

          {/* History List */}
          {loading && history.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={8}>
              <CircularProgress sx={{ color: '#3b82f6' }} />
            </Box>
          ) : history.length > 0 ? (
            <Box>
              {history.map((item, index) => (
                <Box 
                  key={item.id || index} 
                  sx={{ 
                    backgroundColor: index % 2 === 0 ? '#1e293b' : '#0f172a',
                    borderRadius: 2,
                    p: 3,
                    mb: 2,
                    border: '1px solid #334155',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#334155',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography variant="h4" sx={{ fontSize: '2rem' }}>
                        {getSpinTypeIcon(item.spinType)}
                      </Typography>
                      <Box>
                        <Typography variant="h6" fontWeight="600" color="#e2e8f0">
                          {getSpinTypeLabel(item.spinType)}
                        </Typography>
                        <Typography variant="body2" color="#64748b">
                          {formatDate(item.spunAt)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box textAlign="right">
                      <Typography 
                        variant="h5" 
                        fontWeight="bold" 
                        color="#10b981"
                        sx={{ fontSize: '1.5rem' }}
                      >
                        ₹{item.rewardAmount || 0}
                      </Typography>
                      {item.position && (
                        <Typography variant="caption" color="#64748b">
                          Position {item.position}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  {item.remarks && (
                    <Box 
                      sx={{ 
                        mt: 2, 
                        p: 2, 
                        backgroundColor: '#334155', 
                        borderRadius: 1,
                        borderLeft: '3px solid #3b82f6'
                      }}
                    >
                      <Typography variant="body2" color="#94a3b8">
                        {item.remarks}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: 2,
                    mt: 4,
                    mb: 2
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={pagination.page === 1 || loading}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    sx={{ 
                      borderColor: '#3b82f6',
                      color: '#3b82f6',
                      '&:hover': {
                        borderColor: '#2563eb',
                        backgroundColor: '#1e40af20'
                      }
                    }}
                  >
                    Previous
                  </Button>
                  
                  <Box 
                    sx={{ 
                      px: 3, 
                      py: 1, 
                      backgroundColor: '#1e293b', 
                      borderRadius: 1,
                      border: '1px solid #334155'
                    }}
                  >
                    <Typography variant="body2" color="#e2e8f0" textAlign="center">
                      Page {pagination.page} of {pagination.totalPages}
                    </Typography>
                  </Box>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={pagination.page >= pagination.totalPages || loading}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    sx={{ 
                      borderColor: '#3b82f6',
                      color: '#3b82f6',
                      '&:hover': {
                        borderColor: '#2563eb',
                        backgroundColor: '#1e40af20'
                      }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              )}

              {/* Footer Info */}
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 3,
                  borderTop: '1px solid #334155',
                  mt: 3
                }}
              >
                <Typography variant="caption" color="#64748b">
                  Showing {history.length} of {pagination.total} total spins
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                backgroundColor: '#1e293b',
                borderRadius: 2,
                border: '1px solid #334155'
              }}
            >
              <HistoryIcon sx={{ fontSize: 80, color: '#334155', mb: 2 }} />
              <Typography variant="h6" color="#94a3b8" gutterBottom>
                No History Yet
              </Typography>
              <Typography variant="body2" color="#64748b" mb={3}>
                Your spin history will appear here once you start playing
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/dynamic-spin-event')}
                sx={{
                  backgroundColor: '#3b82f6',
                  '&:hover': {
                    backgroundColor: '#2563eb'
                  }
                }}
              >
                Start Playing
              </Button>
            </Box>
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

export default DynamicSpinEventHistory;
