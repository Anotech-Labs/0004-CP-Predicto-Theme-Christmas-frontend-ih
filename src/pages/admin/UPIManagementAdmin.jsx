import React, { useState, useEffect } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
  Chip,
  ThemeProvider,
  createTheme
} from '@mui/material'
import {
  AccountBalanceWallet,
  CheckCircle,
  Cancel,
  Visibility,
  Star,
  StarBorder,
  Refresh,
  Search
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import { domain } from '../../utils/Secret'

// Dark theme matching EditBankDetails
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
  },
})

const UPIManagementAdmin = () => {
  const { axiosInstance } = useAuth()
  
  // State management
  const [activeTab, setActiveTab] = useState(0)
  const [changeRequests, setChangeRequests] = useState([])
  const [userUPIs, setUserUPIs] = useState([])
  const [statistics, setStatistics] = useState({})
  const [loading, setLoading] = useState(false)
  
  // Pagination for change requests
  const [requestsPage, setRequestsPage] = useState(0)
  const [requestsRowsPerPage, setRequestsRowsPerPage] = useState(10)
  const [requestsTotal, setRequestsTotal] = useState(0)
  
  // Pagination for UPIs
  const [upisPage, setUpisPage] = useState(0)
  const [upisRowsPerPage, setUpisRowsPerPage] = useState(10)
  const [upisTotal, setUpisTotal] = useState(0)
  
  // Dialog states
  const [openApproveDialog, setOpenApproveDialog] = useState(false)
  const [openRejectDialog, setOpenRejectDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [adminComments, setAdminComments] = useState('')

  // Filter states
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [upiStatusFilter, setUpiStatusFilter] = useState('ALL')

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  useEffect(() => {
    fetchData()
  }, [activeTab, statusFilter, upiStatusFilter, requestsPage, requestsRowsPerPage, upisPage, upisRowsPerPage])

  const fetchData = () => {
    if (activeTab === 0) {
      fetchChangeRequests()
    } else if (activeTab === 1) {
      fetchUserUPIs()
    } else if (activeTab === 2) {
      fetchStatistics()
    }
  }

  const fetchChangeRequests = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(
        `${domain}/api/list/admin/upi/change-requests`,
        { 
          params: { 
            status: statusFilter,
            page: requestsPage + 1,
            limit: requestsRowsPerPage
          } 
        }
      )
      setChangeRequests(response.data.data || [])
      setRequestsTotal(response.data.pagination?.total || 0)
    } catch (error) {
      console.error('Error:', error)
      showSnackbar('Failed to fetch change requests', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserUPIs = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(
        `${domain}/api/list/admin/upi/upis`,
        { 
          params: { 
            status: upiStatusFilter,
            page: upisPage + 1,
            limit: upisRowsPerPage
          } 
        }
      )
      setUserUPIs(response.data.data || [])
      setUpisTotal(response.data.pagination?.total || 0)
    } catch (error) {
      console.error('Error:', error)
      showSnackbar('Failed to fetch user UPIs', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`${domain}/api/list/admin/upi/statistics`)
      setStatistics(response.data.data || {})
    } catch (error) {
      console.error('Error:', error)
      showSnackbar('Failed to fetch statistics', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleApproveRequest = async () => {
    try {
      await axiosInstance.post(
        `${domain}/api/list/admin/upi/change-requests/approve`,
        { requestId: selectedItem.id, adminComments }
      )
      showSnackbar('Request approved successfully', 'success')
      setOpenApproveDialog(false)
      setAdminComments('')
      fetchChangeRequests()
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to approve request', 'error')
    }
  }

  const handleRejectRequest = async () => {
    if (!adminComments.trim() || adminComments.trim().length < 5) {
      showSnackbar('Admin comments must be at least 5 characters', 'error')
      return
    }

    try {
      await axiosInstance.post(
        `${domain}/api/list/admin/upi/change-requests/reject`,
        { requestId: selectedItem.id, adminComments }
      )
      showSnackbar('Request rejected successfully', 'success')
      setOpenRejectDialog(false)
      setAdminComments('')
      fetchChangeRequests()
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to reject request', 'error')
    }
  }

  const handleUpdateUPIStatus = async (upiId, newStatus) => {
    try {
      await axiosInstance.put(
        `${domain}/api/list/admin/upi/upis/status`,
        { upiId, status: newStatus, adminComments: `Status updated to ${newStatus}` }
      )
      showSnackbar('UPI status updated successfully', 'success')
      fetchUserUPIs()
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to update UPI status', 'error')
    }
  }

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'warning',
      'APPROVED': 'success',
      'REJECTED': 'error',
      'CANCELLED': 'default',
      'ACTIVE': 'success',
      'INACTIVE': 'default',
      'DELETED': 'error'
    }
    return colors[status] || 'default'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Header */}
        <Stack spacing={3} sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <AccountBalanceWallet sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
              UPI Management System
            </Typography>
          </Stack>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => {
              setActiveTab(newValue)
              setRequestsPage(0)
              setUpisPage(0)
            }}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                color: 'text.secondary',
                fontWeight: 600,
                '&.Mui-selected': { color: 'primary.main' }
              }
            }}
          >
            <Tab label="Change Requests" />
            <Tab label="User UPIs" />
            <Tab label="Statistics" />
          </Tabs>
        </Stack>

        {/* Tab 0: Change Requests Table */}
        {activeTab === 0 && (
          <Box>
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setRequestsPage(0)
                  }}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </Select>
              </FormControl>
              <Button startIcon={<Refresh />} onClick={fetchChangeRequests} variant="outlined">
                Refresh
              </Button>
            </Stack>

            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
                  <Table>
                    <TableHead sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>UPI Address</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>UPI Name</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {changeRequests.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                            <Typography color="text.secondary">No change requests found</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        changeRequests.map((request) => (
                          <TableRow key={request.id} hover>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {request.user?.userName || 'N/A'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {request.userId}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={request.requestType.replace('_', ' ')} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>{request.requestedUpiAddress}</TableCell>
                            <TableCell>{request.requestedUpiName}</TableCell>
                            <TableCell>
                              <Chip label={request.status} color={getStatusColor(request.status)} size="small" />
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption">{formatDate(request.createdAt)}</Typography>
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={0.5}>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setSelectedItem(request)
                                    setOpenViewDialog(true)
                                  }}
                                  sx={{ color: 'primary.main' }}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                                {request.status === 'PENDING' && (
                                  <>
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setSelectedItem(request)
                                        setOpenApproveDialog(true)
                                      }}
                                      sx={{ color: 'success.main' }}
                                    >
                                      <CheckCircle fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setSelectedItem(request)
                                        setOpenRejectDialog(true)
                                      }}
                                      sx={{ color: 'error.main' }}
                                    >
                                      <Cancel fontSize="small" />
                                    </IconButton>
                                  </>
                                )}
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={requestsTotal}
                  page={requestsPage}
                  onPageChange={(e, newPage) => setRequestsPage(newPage)}
                  rowsPerPage={requestsRowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setRequestsRowsPerPage(parseInt(e.target.value, 10))
                    setRequestsPage(0)
                  }}
                  sx={{ color: 'text.primary', bgcolor: 'background.paper', borderRadius: '0 0 8px 8px' }}
                />
              </>
            )}
          </Box>
        )}

        {/* Tab 1: User UPIs Table */}
        {activeTab === 1 && (
          <Box>
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={upiStatusFilter}
                  label="Status"
                  onChange={(e) => {
                    setUpiStatusFilter(e.target.value)
                    setUpisPage(0)
                  }}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                </Select>
              </FormControl>
              <Button startIcon={<Refresh />} onClick={fetchUserUPIs} variant="outlined">
                Refresh
              </Button>
            </Stack>

            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
                  <Table>
                    <TableHead sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>UPI Address</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>UPI Name</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Provider</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Primary</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Verified</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userUPIs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                            <Typography color="text.secondary">No UPIs found</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        userUPIs.map((upi) => (
                          <TableRow key={upi.id} hover>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {upi.user?.userName || 'N/A'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {upi.userId}
                              </Typography>
                            </TableCell>
                            <TableCell>{upi.upiAddress}</TableCell>
                            <TableCell>{upi.upiName}</TableCell>
                            <TableCell>{upi.upiProvider || 'N/A'}</TableCell>
                            <TableCell>
                              <Chip label={upi.status} color={getStatusColor(upi.status)} size="small" />
                            </TableCell>
                            <TableCell>
                              {upi.isPrimary ? (
                                <Star sx={{ color: 'gold', fontSize: 20 }} />
                              ) : (
                                <StarBorder sx={{ color: 'grey.400', fontSize: 20 }} />
                              )}
                            </TableCell>
                            <TableCell>
                              {upi.isVerified ? (
                                <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                              ) : (
                                <Cancel sx={{ color: 'error.main', fontSize: 20 }} />
                              )}
                            </TableCell>
                            <TableCell>
                              <FormControl size="small" sx={{ minWidth: 100 }}>
                                <Select
                                  value={upi.status}
                                  onChange={(e) => handleUpdateUPIStatus(upi.id, e.target.value)}
                                  disabled={upi.status === 'DELETED'}
                                >
                                  <MenuItem value="ACTIVE">Active</MenuItem>
                                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                                  <MenuItem value="DELETED">Delete</MenuItem>
                                </Select>
                              </FormControl>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={upisTotal}
                  page={upisPage}
                  onPageChange={(e, newPage) => setUpisPage(newPage)}
                  rowsPerPage={upisRowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setUpisRowsPerPage(parseInt(e.target.value, 10))
                    setUpisPage(0)
                  }}
                  sx={{ color: 'text.primary', bgcolor: 'background.paper', borderRadius: '0 0 8px 8px' }}
                />
              </>
            )}
          </Box>
        )}

        {/* Tab 2: Statistics */}
        {activeTab === 2 && (
          <Box>
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <Stack spacing={3}>
                <Paper 
                  sx={{ 
                    p: 4, 
                    bgcolor: 'background.paper',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: 3
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                    <AccountBalanceWallet sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      UPI Statistics Dashboard
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" spacing={3} flexWrap="wrap">
                    {[
                      { label: 'Total UPIs', value: statistics.totalUPIs || 0, color: '#6366f1', icon: '💳' },
                      { label: 'Active UPIs', value: statistics.activeUPIs || 0, color: '#10b981', icon: '✅' },
                      { label: 'Pending Requests', value: statistics.pendingRequests || 0, color: '#f59e0b', icon: '⏳' },
                      { label: 'Verified UPIs', value: statistics.verifiedUPIs || 0, color: '#06b6d4', icon: '✓' },
                      { label: 'Primary UPIs', value: statistics.primaryUPIs || 0, color: '#a855f7', icon: '⭐' },
                      { label: 'Inactive UPIs', value: statistics.inactiveUPIs || 0, color: '#ef4444', icon: '⛔' },
                    ].map((stat, idx) => (
                      <Paper 
                        key={idx} 
                        sx={{ 
                          p: 3, 
                          minWidth: 180,
                          flex: '1 1 200px',
                          background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                          border: `1px solid ${stat.color}30`,
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: `0 8px 24px ${stat.color}40`
                          }
                        }}
                      >
                        <Stack spacing={1}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
                            >
                              {stat.label}
                            </Typography>
                            <Typography sx={{ fontSize: 24 }}>{stat.icon}</Typography>
                          </Stack>
                          <Typography variant="h3" sx={{ color: stat.color, fontWeight: 800 }}>
                            {stat.value}
                          </Typography>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </Paper>
              </Stack>
            )}
          </Box>
        )}

        {/* Dialogs */}
        <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Approve Request</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Approve this {selectedItem?.requestType?.replace('_', ' ').toLowerCase()} request?
            </Typography>
            <TextField
              fullWidth
              label="Admin Comments (Optional)"
              multiline
              rows={3}
              value={adminComments}
              onChange={(e) => setAdminComments(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenApproveDialog(false)}>Cancel</Button>
            <Button onClick={handleApproveRequest} variant="contained" color="success">
              Approve
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Reject Request</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Reject this {selectedItem?.requestType?.replace('_', ' ').toLowerCase()} request?
            </Typography>
            <TextField
              fullWidth
              label="Rejection Reason (Required - Min 5 chars)"
              multiline
              rows={3}
              value={adminComments}
              onChange={(e) => setAdminComments(e.target.value)}
              required
              error={adminComments.trim().length > 0 && adminComments.trim().length < 5}
              helperText={adminComments.trim().length > 0 && adminComments.trim().length < 5 ? 'Must be at least 5 characters' : ''}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
            <Button onClick={handleRejectRequest} variant="contained" color="error" disabled={!adminComments.trim() || adminComments.trim().length < 5}>
              Reject
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Request Details</DialogTitle>
          <DialogContent>
            {selectedItem && (
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">User</Typography>
                  <Typography>{selectedItem.user?.userName || 'N/A'} (ID: {selectedItem.userId})</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Request Type</Typography>
                  <Typography>{selectedItem.requestType?.replace('_', ' ')}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip label={selectedItem.status} color={getStatusColor(selectedItem.status)} size="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">UPI Address</Typography>
                  <Typography>{selectedItem.requestedUpiAddress}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">UPI Name</Typography>
                  <Typography>{selectedItem.requestedUpiName}</Typography>
                </Box>
                {selectedItem.reason && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">User Reason</Typography>
                    <Typography>{selectedItem.reason}</Typography>
                  </Box>
                )}
                {selectedItem.adminComments && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Admin Comments</Typography>
                    <Typography>{selectedItem.adminComments}</Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
                  <Typography>{formatDate(selectedItem.createdAt)}</Typography>
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  )
}

export default UPIManagementAdmin
