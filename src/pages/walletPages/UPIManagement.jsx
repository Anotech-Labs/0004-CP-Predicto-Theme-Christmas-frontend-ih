import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import { useNavigate } from 'react-router-dom'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import CancelIcon from '@mui/icons-material/Cancel'
import Mobile from '../../components/layout/Mobile'
import { useAuth } from '../../context/AuthContext'
import { domain } from '../../utils/Secret'
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"

const UPIManagement = () => {
  const navigate = useNavigate()
  const { axiosInstance } = useAuth()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  // State management
  const [upis, setUpis] = useState([])
  const [changeRequests, setChangeRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")

  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedUPI, setSelectedUPI] = useState(null)

  // Form states
  const [formData, setFormData] = useState({
    upiAddress: '',
    upiName: '',
    upiProvider: '',
    reason: ''
  })

  const upiProviders = [
    'PayTM', 'PhonePe', 'GooglePay', 'BHIM', 'Amazon Pay', 'Payzapp', 'Mobikwik', 'Freecharge', 'Other'
  ]

  useEffect(() => {
    fetchUPIs()
    fetchChangeRequests()
  }, [])

  const fetchUPIs = async () => {
    try {
      const response = await axiosInstance.get(`${domain}/api/list/upi/`, {
        withCredentials: true
      })
      setUpis(response.data.data || [])
    } catch (error) {
      console.error('Error fetching UPIs:', error)
      showSnackbar('Failed to fetch UPI addresses', 'error')
    }
  }

  const fetchChangeRequests = async () => {
    try {
      const response = await axiosInstance.get(`${domain}/api/list/upi/change-requests`, {
        withCredentials: true
      })
      setChangeRequests(response.data.data || [])
    } catch (error) {
      console.error('Error fetching change requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setOpenSnackbar(true)
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  const validateUPIAddress = (address) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/
    return upiRegex.test(address) && address.length >= 5 && address.length <= 50
  }

  const handleAddUPI = async () => {
    if (!validateUPIAddress(formData.upiAddress)) {
      showSnackbar('Please enter a valid UPI address (e.g., user@paytm)', 'error')
      return
    }

    if (!formData.upiName.trim()) {
      showSnackbar('Please enter UPI holder name', 'error')
      return
    }

    try {
      // Direct add - no approval needed for new UPI
      await axiosInstance.post(`${domain}/api/list/upi/`, {
        upiAddress: formData.upiAddress,
        upiName: formData.upiName,
        upiProvider: formData.upiProvider
      }, {
        withCredentials: true
      })

      showSnackbar('UPI address added successfully!')
      setOpenAddDialog(false)
      resetForm()
      fetchUPIs() // Refresh UPI list
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add UPI address'
      showSnackbar(errorMessage, 'error')
    }
  }

  const handleEditUPI = async () => {
    if (!validateUPIAddress(formData.upiAddress)) {
      showSnackbar('Please enter a valid UPI address (e.g., user@paytm)', 'error')
      return
    }

    if (!formData.upiName.trim()) {
      showSnackbar('Please enter UPI holder name', 'error')
      return
    }

    try {
      await axiosInstance.put(`${domain}/api/list/upi/request`, {
        upiId: selectedUPI.id,
        upiAddress: formData.upiAddress,
        upiName: formData.upiName,
        upiProvider: formData.upiProvider,
        reason: formData.reason
      }, {
        withCredentials: true
      })

      showSnackbar('UPI update request submitted successfully. Please wait for admin approval.')
      setOpenEditDialog(false)
      resetForm()
      fetchChangeRequests()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit update request'
      showSnackbar(errorMessage, 'error')
    }
  }

  const handleDeleteUPI = async () => {
    try {
      await axiosInstance.delete(`${domain}/api/list/upi/${selectedUPI.id}/request`, {
        data: { reason: formData.reason },
        withCredentials: true
      })

      showSnackbar('UPI deletion request submitted successfully. Please wait for admin approval.')
      setOpenDeleteDialog(false)
      resetForm()
      fetchChangeRequests()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit deletion request'
      showSnackbar(errorMessage, 'error')
    }
  }

  const handleSetPrimary = async (upi) => {
    try {
      await axiosInstance.post(`${domain}/api/list/upi/primary`, {
        upiId: upi.id
      }, {
        withCredentials: true
      })

      showSnackbar('Primary UPI updated successfully! This UPI will now be used for withdrawals.', 'success')
      fetchUPIs() // Refresh to show updated primary status
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to set primary UPI'
      showSnackbar(errorMessage, 'error')
    }
  }

  const handleCancelRequest = async (requestId) => {
    try {
      await axiosInstance.patch(`${domain}/api/list/upi/change-requests/${requestId}/cancel`, {}, {
        withCredentials: true
      })
      showSnackbar('Request cancelled successfully')
      fetchChangeRequests()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel request'
      showSnackbar(errorMessage, 'error')
    }
  }

  const resetForm = () => {
    setFormData({
      upiAddress: '',
      upiName: '',
      upiProvider: '',
      reason: ''
    })
    setSelectedUPI(null)
  }

  const openEditDialogWithData = (upi) => {
    setSelectedUPI(upi)
    setFormData({
      upiAddress: upi.upiAddress,
      upiName: upi.upiName,
      upiProvider: upi.upiProvider || '',
      reason: ''
    })
    setOpenEditDialog(true)
  }

  const openDeleteDialogWithData = (upi) => {
    setSelectedUPI(upi)
    setFormData({ ...formData, reason: '' })
    setOpenDeleteDialog(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success'
      case 'PENDING': return 'warning'
      case 'REJECTED': return 'error'
      case 'INACTIVE': return 'default'
      default: return 'default'
    }
  }

  const getRequestStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning'
      case 'APPROVED': return 'success'
      case 'REJECTED': return 'error'
      case 'CANCELLED': return 'default'
      default: return 'default'
    }
  }

  const getRequestStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <PendingIcon />
      case 'APPROVED': return <CheckCircleIcon />
      case 'REJECTED': return <CancelIcon />
      case 'CANCELLED': return <CancelIcon />
      default: return <PendingIcon />
    }
  }

  if (loading) {
    return (
      <Mobile>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Mobile>
    )
  }

  return (
    <Mobile>
      <Box sx={{ padding: 2 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            UPI Management
          </Typography>
        </Box>

        {/* UPI Addresses List */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Your UPI Addresses
        </Typography>

        {/* Info Box */}
        <Box 
          sx={{ 
            mb: 3, 
            p: 2, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 2,
            color: '#fff'
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
            ℹ️ How UPI Management Works:
          </Typography>
          <Typography variant="caption" component="div" sx={{ mb: 0.5 }}>
            • <strong>PRIMARY UPI</strong>: Used for withdrawals (marked with ⭐ PRIMARY badge)
          </Typography>
          <Typography variant="caption" component="div" sx={{ mb: 0.5 }}>
            • <strong>Add UPI</strong>: ✅ Instant, no approval needed
          </Typography>
          <Typography variant="caption" component="div" sx={{ mb: 0.5 }}>
            • <strong>Set Primary</strong>: ✅ Click hollow star (⭐) to change instantly
          </Typography>
          <Typography variant="caption" component="div">
            • <strong>Edit/Delete</strong>: ⚠️ Requires admin approval for security
          </Typography>
        </Box>

        {upis.length === 0 ? (
          <Card sx={{ mb: 3, textAlign: 'center', py: 4 }}>
            <CardContent>
              <AccountBalanceWalletIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No UPI addresses added yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add your first UPI address to enable withdrawals
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenAddDialog(true)}
                sx={{
                  background: 'linear-gradient(90deg, #6a1b17 0%, #f70208 100%)',
                  borderRadius: 2
                }}
              >
                Add UPI Address
              </Button>
            </CardContent>
          </Card>
        ) : (
          upis.map((upi) => (
            <Card key={upi.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 1 }}>
                        {upi.upiAddress}
                      </Typography>
                      {upi.isPrimary && (
                        <Chip
                          icon={<StarIcon sx={{ color: 'gold' }} />}
                          label="PRIMARY"
                          size="small"
                          sx={{
                            background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
                            color: '#fff',
                            fontWeight: 'bold'
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {upi.upiName}
                    </Typography>
                    {upi.upiProvider && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Provider: {upi.upiProvider}
                      </Typography>
                    )}
                    <Box display="flex" alignItems="center" mt={1}>
                      <Chip
                        label={upi.status}
                        color={getStatusColor(upi.status)}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      {upi.isVerified && (
                        <Chip
                          label="Verified"
                          color="success"
                          size="small"
                          icon={<CheckCircleIcon />}
                        />
                      )}
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="column" gap={1}>
                    {!upi.isPrimary && upi.status === 'ACTIVE' && (
                      <IconButton
                        size="small"
                        onClick={() => handleSetPrimary(upi)}
                        title="Set as Primary UPI (for withdrawals)"
                        sx={{
                          '&:hover': {
                            background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
                            color: '#fff'
                          }
                        }}
                      >
                        <StarBorderIcon />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => openEditDialogWithData(upi)}
                      title="Edit UPI"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => openDeleteDialogWithData(upi)}
                      title="Delete UPI"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        )}

        {/* Change Requests */}
        {changeRequests.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mb: 2, mt: 4, fontWeight: 'bold' }}>
              Pending Requests
            </Typography>
            {changeRequests.map((request) => (
              <Card key={request.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flexGrow: 1 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        {getRequestStatusIcon(request.status)}
                        <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'bold' }}>
                          {request.requestType.replace('_', ' ')} Request
                        </Typography>
                      </Box>
                      <Typography variant="body2" gutterBottom>
                        UPI: {request.requestedUpiAddress}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Name: {request.requestedUpiName}
                      </Typography>
                      {request.reason && (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Reason: {request.reason}
                        </Typography>
                      )}
                      {request.adminComments && (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Admin Comments: {request.adminComments}
                        </Typography>
                      )}
                      <Box display="flex" alignItems="center" mt={1}>
                        <Chip
                          label={request.status}
                          color={getRequestStatusColor(request.status)}
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                          {new Date(request.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    {request.status === 'PENDING' && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleCancelRequest(request.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {/* Add UPI Dialog */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New UPI Address</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="UPI Address"
              placeholder="e.g., 9876543210@paytm or user@phonepe"
              value={formData.upiAddress}
              onChange={(e) => setFormData({ ...formData, upiAddress: e.target.value })}
              margin="normal"
              InputProps={{
                startAdornment: <AccountBalanceWalletIcon sx={{ mr: 1, color: 'grey.500' }} />
              }}
            />
            <TextField
              fullWidth
              label="Account Holder Name"
              value={formData.upiName}
              onChange={(e) => setFormData({ ...formData, upiName: e.target.value })}
              margin="normal"
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: 'grey.500' }} />
              }}
            />
            <TextField
              fullWidth
              select
              label="UPI Provider (Optional)"
              value={formData.upiProvider}
              onChange={(e) => setFormData({ ...formData, upiProvider: e.target.value })}
              margin="normal"
              SelectProps={{ native: true }}
            >
              <option value="">Select Provider</option>
              {upiProviders.map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
            <Button
              onClick={handleAddUPI}
              variant="contained"
              sx={{ background: 'linear-gradient(90deg, #6a1b17 0%, #f70208 100%)' }}
            >
              Add UPI
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit UPI Dialog */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Update UPI Address</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="UPI Address"
              value={formData.upiAddress}
              onChange={(e) => setFormData({ ...formData, upiAddress: e.target.value })}
              margin="normal"
              InputProps={{
                startAdornment: <AccountBalanceWalletIcon sx={{ mr: 1, color: 'grey.500' }} />
              }}
            />
            <TextField
              fullWidth
              label="Account Holder Name"
              value={formData.upiName}
              onChange={(e) => setFormData({ ...formData, upiName: e.target.value })}
              margin="normal"
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: 'grey.500' }} />
              }}
            />
            <TextField
              fullWidth
              select
              label="UPI Provider (Optional)"
              value={formData.upiProvider}
              onChange={(e) => setFormData({ ...formData, upiProvider: e.target.value })}
              margin="normal"
              SelectProps={{ native: true }}
            >
              <option value="">Select Provider</option>
              {upiProviders.map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Reason for Update"
              multiline
              rows={2}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              margin="normal"
              placeholder="Why are you updating this UPI address?"
            />
            <Typography variant="caption" color="warning.main" sx={{ mt: 2, display: 'block' }}>
              ⚠️ UPI updates require admin approval for security
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
            <Button
              onClick={handleEditUPI}
              variant="contained"
              sx={{ background: 'linear-gradient(90deg, #6a1b17 0%, #f70208 100%)' }}
            >
              Submit Update Request
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete UPI Dialog */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Delete UPI Address</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to delete this UPI address?
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              UPI: {selectedUPI?.upiAddress}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Name: {selectedUPI?.upiName}
            </Typography>
            <TextField
              fullWidth
              label="Reason for Deletion"
              multiline
              rows={2}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              margin="normal"
              placeholder="Why are you deleting this UPI address?"
            />
            <Typography variant="caption" color="error" sx={{ mt: 2, display: 'block' }}>
              ⚠️ UPI deletion requires admin approval for security
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteUPI}
              variant="contained"
              color="error"
            >
              Submit Delete Request
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Floating Add UPI Button */}
        {upis.length > 0 && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
            sx={{
              position: 'fixed',
              bottom: isSmallScreen ? 80 : 20,
              right: 20,
              background: 'linear-gradient(90deg, #6a1b17 0%, #f70208 100%)',
              borderRadius: 3,
              px: 3,
              py: 1.5,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              '&:hover': {
                background: 'linear-gradient(90deg, #8a1b17 0%, #ff0208 100%)',
                transform: 'scale(1.05)',
                transition: 'all 0.2s'
              }
            }}
          >
            Add More UPI
          </Button>
        )}
      </Box>
    </Mobile>
  )
}

export default UPIManagement
