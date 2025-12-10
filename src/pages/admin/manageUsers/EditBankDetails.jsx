import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
  Grid,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountBalance as AccountBalanceIcon,
  Wallet as WalletIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon,
  ErrorOutline as ErrorIcon
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';

// Dark theme
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
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          border: '1px solid rgba(148, 163, 184, 0.12)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#f8fafc',
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
            },
          },
        },
      },
    },
  },
});

const EditBankDetails = () => {
  const theme = useTheme();
  const { axiosInstance } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [usdtWallets, setUsdtWallets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const isMd = useMediaQuery(theme.breakpoints.up("md"));

  const [bankFormData, setBankFormData] = useState({
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    mobileNumber: '',
    accountType: 'SAVINGS'
  });

  const [usdtFormData, setUsdtFormData] = useState({
    address: '',
    network: 'TRX',
    alias: ''
  });

  const validateBankForm = () => {
    const newErrors = {};
    if (!bankFormData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }
    if (!bankFormData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^\d{9,18}$/.test(bankFormData.accountNumber)) {
      newErrors.accountNumber = 'Invalid account number format';
    }
    if (!bankFormData.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankFormData.ifscCode)) {
      newErrors.ifscCode = 'Invalid IFSC code format';
    }
    if (!bankFormData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }
    if (!bankFormData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(bankFormData.mobileNumber)) {
      newErrors.mobileNumber = 'Invalid mobile number format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateUsdtForm = () => {
    const newErrors = {};
    if (!usdtFormData.address.trim()) {
      newErrors.address = 'Wallet address is required';
    } else if (!/^[A-Za-z0-9]{34,}$/.test(usdtFormData.address)) {
      newErrors.address = 'Invalid wallet address format';
    }
    if (!usdtFormData.alias.trim()) {
      newErrors.alias = 'Alias is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === 0
        ? '/api/list/admin/banking/users/bank-accounts'
        : `/api/list/admin/usdt/users/wallets/usdt?page=${currentPage}&limit=${itemsPerPage}`;

      const response = await axiosInstance.get(endpoint);

      if (!response.data) {
        throw new Error('No data received from server');
      }

      const filteredData = searchQuery
        ? response.data.data.filter(item =>
          item.userId.toString().includes(searchQuery.trim())
        )
        : response.data.data;

      if (activeTab === 0) {
        setBankAccounts(filteredData);
      } else {
        setUsdtWallets(filteredData);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error fetching data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, currentPage, searchQuery]);

  const handleUpdateBankAccount = async () => {
    if (!validateBankForm()) return;

    try {
      setLoading(true);
      await axiosInstance.put(
        `/api/list/admin/banking/users/${selectedUser.userId}/bank-account`,
        bankFormData
      );
      setSnackbar({
        open: true,
        message: 'Bank account updated successfully',
        severity: 'success'
      });
      fetchData();
      handleCloseDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error updating bank account',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUsdtWallet = async () => {
    if (!validateUsdtForm()) return;

    try {
      setLoading(true);
      await axiosInstance.put(
        `/api/list/admin/usdt/users/${selectedUser.userId}/wallet`,
        usdtFormData
      );
      setSnackbar({
        open: true,
        message: 'USDT wallet updated successfully',
        severity: 'success'
      });
      fetchData();
      handleCloseDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error updating USDT wallet',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (type, user) => {
    setDialogType(type);
    setSelectedUser(user);
    setErrors({});
    if (type === 'bank') {
      setBankFormData({
        accountName: user.accountName || '',
        accountNumber: user.accountNumber || '',
        ifscCode: user.ifscCode || '',
        bankName: user.bankName || '',
        mobileNumber: user.mobileNumber || '',
        accountType: user.accountType || 'SAVINGS'
      });
    } else {
      setUsdtFormData({
        address: user.address || '',
        network: user.network || 'TRX',
        alias: user.alias || ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setDialogType('');
    setErrors({});
  };

  const renderAccountCard = (account, type) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 2,
        borderRadius: 3,
        background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)',
        border: '1px solid rgba(148, 163, 184, 0.12)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          borderColor: '#6366f1'
        }
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={0.5}>
          <Typography
            variant="subtitle2"
            sx={{
              fontFamily: 'Inter',
              color: 'white'
            }}
          >
            User ID: {account.userId}
          </Typography>
          <Typography
            variant={isMd ? "h5" : ""}
            sx={{
              fontFamily: "Inter",
              fontWeight: 700,
              color: '#f8fafc',
            }}
          >

            {type === 'bank' ? account.accountName : account.alias}
          </Typography>
        </Stack>
        <IconButton
          onClick={() => handleOpenDialog(type, account)}
          sx={{
            color: 'white',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.2)
            }
          }}
        >
          <EditIcon />
        </IconButton>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>
        {type === 'bank' ? (
          <>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'Inter',
                  color: "white"
                }}
              >
                Account Number
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: 500
                }}
              >
                {account.accountNumber}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'Inter',
                  color: "white"
                }}
              >
                Bank Name
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: 500
                }}
              >
                {account.bankName}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'Inter',
                  color: "white"
                }}
              >
                Account Type
              </Typography>
              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: account.accountType === 'SAVINGS'
                    ? alpha(theme.palette.success.main, 0.1)
                    : alpha(theme.palette.info.main, 0.1),
                  color: account.accountType === 'SAVINGS'
                    ? theme.palette.success.main
                    : theme.palette.info.main
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'Inter',
                    fontWeight: 600
                  }}
                >
                  {account.accountType}
                </Typography>
              </Box>
            </Stack>
          </>
        ) : (
          <>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'Inter',
                  color: "white"
                }}
              >
                Wallet Address
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: 500,
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {account.address}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'Inter',
                  color: "white"
                }}
              >
                Network
              </Typography>
              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  color: "white"
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'Inter',
                    fontWeight: 600
                  }}
                >
                  {account.network}
                </Typography>
              </Box>
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  );

  const renderPagination = () => {
    const totalPages = Math.ceil((activeTab === 0 ? bankAccounts : usdtWallets).length / itemsPerPage);

    return (
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        sx={{ mt: 3 }}
      >
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            variant={currentPage === index + 1 ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setCurrentPage(index + 1)}
            sx={{
              minWidth: 40,
              height: 40,
              fontFamily: 'Inter',
              fontWeight: 500,
              borderRadius: 2
            }}
          >
            {index + 1}
          </Button>
        ))}
      </Stack>
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ margin: '0 auto', backgroundColor: '#0f172a', p: 3, borderRadius: '16px', minHeight: '100vh' }}>
        <Card
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: '16px',
            overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: 4, background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '16px' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 4 }}
          >
            <Typography
              variant={isMd ? "h4" : "h5"}
              sx={{
                fontFamily: "Inter",
                fontWeight: 700,
                color: '#f8fafc',
              }}
            >
              Account Management
            </Typography>
            <Button
              startIcon={<RefreshIcon />}
              onClick={fetchData}
              sx={{
                fontFamily: 'Inter',
                fontWeight: 500
              }}
            >
              Refresh
            </Button>
          </Stack>

          <Tabs
            value={activeTab}
            onChange={(_, newValue) => {
              setActiveTab(newValue);
              setCurrentPage(1);
              setSearchQuery('');
            }}
            sx={{
              mb: 4,
              '& .MuiTab-root': {
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: '0.95rem',
                minHeight: 48,
                '&.Mui-selected': {
                  color: "white"
                }
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0'
              }
            }}
          >
            <Tab
              icon={<AccountBalanceIcon />}
              label="Bank Accounts"
              iconPosition="start"
            />
            <Tab
              icon={<WalletIcon />}
              label="USDT Wallets"
              iconPosition="start"
            />
          </Tabs>

          <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by User ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "white" }} />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'Inter',
                  borderRadius: 2,
                  backgroundColor: '#1e293b',
                  color: '#f8fafc',
                  '& fieldset': {
                    borderColor: 'rgba(148, 163, 184, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(148, 163, 184, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                  }
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#94a3b8',
                  opacity: 1
                }
              }}
            />
            <Button
              startIcon={<FilterIcon />}
              variant="outlined"
              sx={{
                minWidth: 120,
                fontFamily: 'Inter',
                fontWeight: 500,
                borderRadius: 2
              }}
            >
              Filter
            </Button>
          </Stack>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (activeTab === 0 ? bankAccounts : usdtWallets).length === 0 ? (
            <Paper
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 3,
                background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)',
                border: '1px solid rgba(148, 163, 184, 0.12)'
              }}
            >
              <ErrorIcon
                sx={{
                  fontSize: 48,
                  color: "white",
                  mb: 2
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  color: '#f8fafc',
                  mb: 1
                }}
              >
                No Records Found
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'Inter',
                  color: '#94a3b8'
                }}
              >
                {searchQuery
                  ? 'No results match your search criteria'
                  : `No ${activeTab === 0 ? 'bank accounts' : 'USDT wallets'} found`}
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ minHeight: 600 }}>
              <Grid container spacing={3}>
                {(activeTab === 0 ? bankAccounts : usdtWallets)
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((item) => (
                    <Grid item xs={12} md={6} key={item.id}>
                      {renderAccountCard(item, activeTab === 0 ? 'bank' : 'usdt')}
                    </Grid>
                  ))}
              </Grid>
              {renderPagination()}
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: 'Inter',
            fontWeight: 600,
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {dialogType === 'bank' ? (
              <AccountBalanceIcon sx={{ color: theme.palette.primary.main }} />
            ) : (
              <WalletIcon sx={{ color: theme.palette.primary.main }} />
            )}
            <Typography variant="h6" sx={{ fontFamily: 'Inter', fontWeight: 600, color: '#f8fafc' }}>
              {dialogType === 'bank' ? 'Edit Bank Account' : 'Edit USDT Wallet'}
            </Typography>
          </Stack>
          <IconButton
            onClick={handleCloseDialog}
            size="small"
            sx={{
              color: theme.palette.grey[500],
              '&:hover': {
                bgcolor: alpha(theme.palette.grey[500], 0.1)
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Stack spacing={3}>
            {dialogType === 'bank' ? (
              <>
                <TextField
                  label="Account Name"
                  fullWidth
                  value={bankFormData.accountName}
                  onChange={(e) => setBankFormData(prev => ({
                    ...prev,
                    accountName: e.target.value
                  }))}
                  error={!!errors.accountName}
                  helperText={errors.accountName}
                  InputProps={{ 
                    sx: { 
                      fontFamily: 'Inter',
                      backgroundColor: '#1e293b',
                      color: '#f8fafc',
                      '& fieldset': {
                        borderColor: 'rgba(148, 163, 184, 0.2)',
                      },
                    } 
                  }}
                  InputLabelProps={{ 
                    sx: { 
                      fontFamily: 'Inter',
                      color: '#94a3b8',
                      '&.Mui-focused': {
                        color: '#6366f1'
                      }
                    } 
                  }}
                />
                <TextField
                  label="Account Number"
                  fullWidth
                  value={bankFormData.accountNumber}
                  onChange={(e) => setBankFormData(prev => ({
                    ...prev,
                    accountNumber: e.target.value
                  }))}
                  error={!!errors.accountNumber}
                  helperText={errors.accountNumber}
                  InputProps={{ 
                    sx: { 
                      fontFamily: 'Inter',
                      backgroundColor: '#1e293b',
                      color: '#f8fafc',
                      '& fieldset': {
                        borderColor: 'rgba(148, 163, 184, 0.2)',
                      },
                    } 
                  }}
                  InputLabelProps={{ 
                    sx: { 
                      fontFamily: 'Inter',
                      color: '#94a3b8',
                      '&.Mui-focused': {
                        color: '#6366f1'
                      }
                    } 
                  }}
                />
                <TextField
                  label="IFSC Code"
                  fullWidth
                  value={bankFormData.ifscCode}
                  onChange={(e) => setBankFormData(prev => ({
                    ...prev,
                    ifscCode: e.target.value.toUpperCase()
                  }))}
                  error={!!errors.ifscCode}
                  helperText={errors.ifscCode}
                  InputProps={{ 
                    sx: { 
                      fontFamily: 'Inter',
                      backgroundColor: '#1e293b',
                      color: '#f8fafc',
                      '& fieldset': {
                        borderColor: 'rgba(148, 163, 184, 0.2)',
                      },
                    } 
                  }}
                  InputLabelProps={{ 
                    sx: { 
                      fontFamily: 'Inter',
                      color: '#94a3b8',
                      '&.Mui-focused': {
                        color: '#6366f1'
                      }
                    } 
                  }}
                />
                <TextField
                  label="Bank Name"
                  fullWidth
                  value={bankFormData.bankName}
                  onChange={(e) => setBankFormData(prev => ({
                    ...prev,
                    bankName: e.target.value
                  }))}
                  error={!!errors.bankName}
                  helperText={errors.bankName}
                  InputProps={{ 
                    sx: { 
                      fontFamily: 'Inter',
                      backgroundColor: '#1e293b',
                      color: '#f8fafc',
                      '& fieldset': {
                        borderColor: 'rgba(148, 163, 184, 0.2)',
                      },
                    } 
                  }}
                  InputLabelProps={{ 
                    sx: { 
                      fontFamily: 'Inter',
                      color: '#94a3b8',
                      '&.Mui-focused': {
                        color: '#6366f1'
                      }
                    } 
                  }}
                />
                <TextField
                  label="Mobile Number"
                  fullWidth
                  value={bankFormData.mobileNumber}
                  onChange={(e) => setBankFormData(prev => ({
                    ...prev,
                    mobileNumber: e.target.value
                  }))}
                  error={!!errors.mobileNumber}
                  helperText={errors.mobileNumber}
                  InputProps={{ 
                    sx: { 
                      fontFamily: 'Inter',
                      backgroundColor: '#1e293b',
                      color: '#f8fafc',
                      '& fieldset': {
                        borderColor: 'rgba(148, 163, 184, 0.2)',
                      },
                    } 
                  }}
                  InputLabelProps={{ 
                    sx: { 
                      fontFamily: 'Inter',
                      color: '#94a3b8',
                      '&.Mui-focused': {
                        color: '#6366f1'
                      }
                    } 
                  }}
                />
                <FormControl fullWidth error={!!errors.accountType}>
                  <Select
                    value={bankFormData.accountType}
                    onChange={(e) => setBankFormData(prev => ({
                      ...prev,
                      accountType: e.target.value
                    }))}
                    sx={{
                      fontFamily: 'Inter',
                      backgroundColor: '#1e293b',
                      color: '#f8fafc',
                      '& .MuiSelect-select': {
                        fontFamily: 'Inter'
                      },
                      '& fieldset': {
                        borderColor: 'rgba(148, 163, 184, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(148, 163, 184, 0.3)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6366f1',
                      }
                    }}
                  >
                    <MenuItem value="SAVINGS" sx={{ fontFamily: 'Inter' }}>Savings</MenuItem>
                    <MenuItem value="CURRENT" sx={{ fontFamily: 'Inter' }}>Current</MenuItem>
                  </Select>
                  {errors.accountType && (
                    <FormHelperText>{errors.accountType}</FormHelperText>
                  )}
                </FormControl>
              </>
            ) : (
              <>
                <TextField
                  label="Wallet Address"
                  fullWidth
                  value={usdtFormData.address}
                  onChange={(e) => setUsdtFormData(prev => ({
                    ...prev,
                    address: e.target.value
                  }))}
                  error={!!errors.address}
                  helperText={errors.address}
                  InputProps={{ 
                    sx: { 
                      fontFamily: 'Inter',
                      backgroundColor: '#1e293b',
                      color: '#f8fafc',
                      '& fieldset': {
                        borderColor: 'rgba(148, 163, 184, 0.2)',
                      },
                    } 
                  }}
                  InputLabelProps={{ 
                    sx: { 
                      fontFamily: 'Inter',
                      color: '#94a3b8',
                      '&.Mui-focused': {
                        color: '#6366f1'
                      }
                    } 
                  }}
                />
                <FormControl fullWidth error={!!errors.network}>
                  <Select
                    value={usdtFormData.network}
                    onChange={(e) => setUsdtFormData(prev => ({
                      ...prev,
                      network: e.target.value
                    }))}
                    sx={{
                      fontFamily: 'Inter',
                      backgroundColor: '#1e293b',
                      color: '#f8fafc',
                      '& .MuiSelect-select': {
                        fontFamily: 'Inter'
                      },
                      '& fieldset': {
                        borderColor: 'rgba(148, 163, 184, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(148, 163, 184, 0.3)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6366f1',
                      }
                    }}
                  >
                    <MenuItem value="TRX" sx={{ fontFamily: 'Inter' }}>TRX</MenuItem>
                    <MenuItem value="BTC" sx={{ fontFamily: 'Inter' }}>BTC</MenuItem>
                    <MenuItem value="ETH" sx={{ fontFamily: 'Inter' }}>ETH</MenuItem>
                  </Select>
                  {errors.network && (
                    <FormHelperText>{errors.network}</FormHelperText>
                  )}
                </FormControl>
                <TextField
                  label="Alias"
                  fullWidth
                  value={usdtFormData.alias}
                  onChange={(e) => setUsdtFormData(prev => ({
                    ...prev,
                    alias: e.target.value
                  }))}
                  error={!!errors.alias}
                  helperText={errors.alias}
                  InputProps={{ 
                    sx: { 
                      fontFamily: 'Inter',
                      backgroundColor: '#1e293b',
                      color: '#f8fafc',
                      '& fieldset': {
                        borderColor: 'rgba(148, 163, 184, 0.2)',
                      },
                    } 
                  }}
                  InputLabelProps={{ 
                    sx: { 
                      fontFamily: 'Inter',
                      color: '#94a3b8',
                      '&.Mui-focused': {
                        color: '#6366f1'
                      }
                    } 
                  }}
                />
              </>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              fontFamily: 'Inter',
              fontWeight: 500,
              color: "white",
              '&:hover': {
                bgcolor: alpha(theme.palette.text.secondary, 0.05)
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={dialogType === 'bank' ? handleUpdateBankAccount : handleUpdateUsdtWallet}
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{
              fontFamily: 'Inter',
              fontWeight: 500,
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
                bgcolor: alpha(theme.palette.primary.main, 0.8)
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            fontFamily: 'Inter',
            width: '100%',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default EditBankDetails;