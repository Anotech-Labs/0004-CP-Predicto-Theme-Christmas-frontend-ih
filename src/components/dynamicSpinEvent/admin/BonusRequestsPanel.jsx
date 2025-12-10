// ==========================================
// Dynamic Spin Event Bonus Requests Panel
// Location: src/components/dynamicSpinEvent/admin/BonusRequestsPanel.jsx
// ==========================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Avatar,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  MonetizationOn as MoneyIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import dynamicSpinEventAdminService from '../../../services/dynamicSpinEventAdminService';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1e293b',
  color: '#ffffff',
  borderRadius: 16,
  overflow: 'hidden',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: '#334155',
  '& .MuiTableCell-root': {
    borderColor: '#475569',
    color: '#ffffff',
  },
  '& .MuiTableHead-root .MuiTableCell-root': {
    backgroundColor: '#475569',
    fontWeight: 'bold',
    color: '#e2e8f0',
  },
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
  minWidth: 'auto',
  padding: theme.spacing(0.5, 1),
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,
  ...(variant === 'approve' && {
    backgroundColor: '#10b981',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#059669',
    },
  }),
  ...(variant === 'reject' && {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#dc2626',
    },
  }),
}));

const StatusChip = styled(Chip)(({ status }) => ({
  fontWeight: 600,
  ...(status === 'PENDING' && {
    backgroundColor: '#f59e0b',
    color: '#ffffff',
  }),
  ...(status === 'APPROVED' && {
    backgroundColor: '#10b981',
    color: '#ffffff',
  }),
  ...(status === 'REJECTED' && {
    backgroundColor: '#ef4444',
    color: '#ffffff',
  }),
}));

const BonusRequestsPanel = ({ configData, showNotification }) => {
  // State management
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, type: null, request: null });
  const [actionData, setActionData] = useState({ amount: '', reason: '' });

  useEffect(() => {
    loadBonusRequests();
  }, [page, rowsPerPage, statusFilter]);

  const loadBonusRequests = async () => {
    setLoading(true);
    try {
      const result = await dynamicSpinEventAdminService.getBonusRequests(
        page + 1,
        rowsPerPage,
        statusFilter
      );
      
      if (result.success) {
        setRequests(result.data.requests || []);
        setTotalCount(result.data.pagination?.total || 0);
      } else {
        showNotification(result.message, 'error');
      }
    } catch (error) {
      console.error('Error loading bonus requests:', error);
      showNotification('Failed to load bonus requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const openActionDialog = (type, request) => {
    setActionDialog({ open: true, type, request });
    setActionData({
      amount: type === 'approve' ? request.requestedAmount : '',
      reason: ''
    });
  };

  const closeActionDialog = () => {
    setActionDialog({ open: false, type: null, request: null });
    setActionData({ amount: '', reason: '' });
  };

  const handleApprove = async () => {
    if (!actionData.amount || parseFloat(actionData.amount) <= 0) {
      showNotification('Please enter a valid approval amount', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await dynamicSpinEventAdminService.approveBonus(
        actionDialog.request.id,
        parseFloat(actionData.amount)
      );
      
      if (result.success) {
        showNotification(result.message, 'success');
        closeActionDialog();
        loadBonusRequests();
      } else {
        showNotification(result.message, 'error');
      }
    } catch (error) {
      showNotification('Failed to approve bonus request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!actionData.reason.trim()) {
      showNotification('Please provide a rejection reason', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await dynamicSpinEventAdminService.rejectBonus(
        actionDialog.request.id,
        actionData.reason
      );
      
      if (result.success) {
        showNotification(result.message, 'success');
        closeActionDialog();
        loadBonusRequests();
      } else {
        showNotification(result.message, 'error');
      }
    } catch (error) {
      showNotification('Failed to reject bonus request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return dynamicSpinEventAdminService.formatCurrency(amount);
  };

  const formatDate = (date) => {
    return dynamicSpinEventAdminService.formatDate(date);
  };

  if (!configData) {
    return (
      <Alert severity="info" sx={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
        Please configure the system first to manage bonus requests.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <MoneyIcon sx={{ color: '#3b82f6', fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold" color="#ffffff">
              Bonus Requests Management
            </Typography>
            <Typography variant="body2" color="#94a3b8">
              Review and manage user bonus requests
            </Typography>
          </Box>
        </Box>
        
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: '#94a3b8' }}>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Status Filter"
              sx={{
                backgroundColor: '#475569',
                color: '#ffffff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#64748b',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3b82f6',
                },
              }}
            >
              <MenuItem value="ALL">All Status</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>
          
          <Tooltip title="Refresh Requests">
            <IconButton
              onClick={loadBonusRequests}
              disabled={loading}
              sx={{ color: '#94a3b8', '&:hover': { color: '#3b82f6' } }}
            >
              {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#334155', color: '#ffffff' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ backgroundColor: '#f59e0b' }}>
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {requests.filter(r => r.status === 'PENDING').length}
                  </Typography>
                  <Typography variant="body2" color="#94a3b8">
                    Pending Requests
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#334155', color: '#ffffff' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ backgroundColor: '#10b981' }}>
                  <ApproveIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {requests.filter(r => r.status === 'APPROVED').length}
                  </Typography>
                  <Typography variant="body2" color="#94a3b8">
                    Approved Today
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#334155', color: '#ffffff' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ backgroundColor: '#3b82f6' }}>
                  <MoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {formatCurrency(
                      requests
                        .filter(r => r.status === 'APPROVED')
                        .reduce((sum, r) => sum + (r.approvedAmount || 0), 0)
                    )}
                  </Typography>
                  <Typography variant="body2" color="#94a3b8">
                    Total Approved
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Requests Table */}
      <StyledPaper>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Requested Amount</TableCell>
                <TableCell>Target Amount</TableCell>
                <TableCell>Actual Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Request Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={32} />
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="#94a3b8">
                      No bonus requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ backgroundColor: '#3b82f6', width: 32, height: 32 }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            User #{request.userId}
                          </Typography>
                          <Typography variant="caption" color="#94a3b8">
                            {request.user?.mobile || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="#10b981">
                        {formatCurrency(request.requestedAmount)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {formatCurrency(request.targetAmount)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {formatCurrency(request.actualAmount)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <StatusChip
                        status={request.status}
                        label={request.status}
                        size="small"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(request.requestedAt)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" gap={1}>
                        {request.status === 'PENDING' && (
                          <>
                            <Tooltip title="Approve Request">
                              <ActionButton
                                variant="approve"
                                size="small"
                                onClick={() => openActionDialog('approve', request)}
                                startIcon={<ApproveIcon fontSize="small" />}
                              >
                                Approve
                              </ActionButton>
                            </Tooltip>
                            
                            <Tooltip title="Reject Request">
                              <ActionButton
                                variant="reject"
                                size="small"
                                onClick={() => openActionDialog('reject', request)}
                                startIcon={<RejectIcon fontSize="small" />}
                              >
                                Reject
                              </ActionButton>
                            </Tooltip>
                          </>
                        )}
                        
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => setSelectedRequest(request)}
                            sx={{ color: '#94a3b8', '&:hover': { color: '#3b82f6' } }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
        
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            backgroundColor: '#475569',
            color: '#ffffff',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              color: '#ffffff',
            },
            '& .MuiSelect-select': {
              color: '#ffffff',
            },
            '& .MuiIconButton-root': {
              color: '#ffffff',
            },
          }}
        />
      </StyledPaper>

      {/* Action Dialog */}
      <Dialog
        open={actionDialog.open}
        onClose={closeActionDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1e293b',
            color: '#ffffff',
          },
        }}
      >
        <DialogTitle>
          {actionDialog.type === 'approve' ? 'Approve Bonus Request' : 'Reject Bonus Request'}
        </DialogTitle>
        
        <DialogContent>
          {actionDialog.request && (
            <Box mb={3}>
              <Typography variant="body2" color="#94a3b8" gutterBottom>
                User: #{actionDialog.request.userId} | Requested: {formatCurrency(actionDialog.request.requestedAmount)}
              </Typography>
            </Box>
          )}
          
          {actionDialog.type === 'approve' ? (
            <TextField
              fullWidth
              label="Approved Amount"
              type="number"
              value={actionData.amount}
              onChange={(e) => setActionData(prev => ({ ...prev, amount: e.target.value }))}
              InputProps={{
                startAdornment: '₹',
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#475569',
                  color: '#ffffff',
                },
                '& .MuiInputLabel-root': {
                  color: '#94a3b8',
                },
              }}
            />
          ) : (
            <TextField
              fullWidth
              label="Rejection Reason"
              multiline
              rows={3}
              value={actionData.reason}
              onChange={(e) => setActionData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Please provide a reason for rejection..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#475569',
                  color: '#ffffff',
                },
                '& .MuiInputLabel-root': {
                  color: '#94a3b8',
                },
              }}
            />
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={closeActionDialog} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button
            onClick={actionDialog.type === 'approve' ? handleApprove : handleReject}
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: actionDialog.type === 'approve' ? '#10b981' : '#ef4444',
              '&:hover': {
                backgroundColor: actionDialog.type === 'approve' ? '#059669' : '#dc2626',
              },
            }}
          >
            {loading ? <CircularProgress size={20} /> : 
             actionDialog.type === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BonusRequestsPanel;
