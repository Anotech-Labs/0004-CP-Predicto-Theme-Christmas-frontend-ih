import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  useTheme,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

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

const DEFAULT_FILTERS = {
  userName: '',
  userId: '',
  minTurnOver: '',
  maxTurnOver: '',
  minBets: '',
  maxBets: '',
  minDeposits: '',
  maxDeposits: ''
};

function UpdateTurnOver() {
  const theme = useTheme();
  const { axiosInstance } = useAuth();
  
  // State management
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(true);

  const [updateDialog, setUpdateDialog] = useState({
    open: false,
    userId: null,
    amount: '',
    updateType: 'INCREASE',
    userData: null
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const tableStyles = {
    tableCell: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem',
      whiteSpace: 'nowrap',
      color: '#f8fafc'
    },
    headerCell: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      backgroundColor: 'rgba(99, 102, 241, 0.05)',
      fontSize: '0.875rem',
      color: '#f8fafc'
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page + 1,
        limit: pagination.limit,
        ...Object.entries(filters).reduce((acc, [key, value]) => 
          value ? { ...acc, [key]: value } : acc, {})
      });

      const response = await axiosInstance.get(`/api/admin/turn-over/combined?${queryParams}`);
      setData(response.data.data);
      setPagination({
        ...pagination,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages
      });
    } catch (error) {
      showSnackbar('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTurnOver = async () => {
    try {
      if (updateDialog.updateType === 'DECREASE' && 
          Number(updateDialog.amount) > updateDialog.userData.totalTurnOver) {
        showSnackbar('Decrease amount cannot exceed the existing turnover amount', 'error');
        return;
      }

      await axiosInstance.put(`/api/admin/turn-over/${updateDialog.userId}`, {
        amount: Number(updateDialog.amount),
        updateType: updateDialog.updateType
      });

      showSnackbar(`Turn over ${updateDialog.updateType.toLowerCase()}d successfully`, 'success');
      closeUpdateDialog();
      fetchData();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update turn over';
      showSnackbar(errorMessage, 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeUpdateDialog = () => {
    setUpdateDialog({
      open: false,
      userId: null,
      amount: '',
      updateType: 'INCREASE',
      userData: null
    });
  };

  const openUpdateDialog = (userId, updateType, userData) => {
    setUpdateDialog({
      open: true,
      userId,
      amount: '',
      updateType,
      userData
    });
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.limit]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: 3, maxWidth: '100%', backgroundColor: "#0f172a", borderRadius: '16px', minHeight: '100vh' }}>
        <Typography variant="h5" sx={{ 
          mb: 4, 
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          color: '#f8fafc' 
        }}>
        Turn Over Management
      </Typography>

        {/* Filters Section */}
        <Paper sx={{ 
          mb: 3, 
          borderRadius: 2,
          background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)',
          border: '1px solid rgba(148, 163, 184, 0.12)'
        }}>
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: showFilters ? 1 : 0,
          borderColor: 'divider'
        }}>
          <Typography variant="h6" sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
            Filters
          </Typography>
          <Button
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Box>

        {showFilters && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {Object.entries(filters).map(([key, value]) => (
                <Grid item xs={12} sm={6} md={3} key={key}>
                  <TextField
                    fullWidth
                    label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    value={value}
                    onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                    type={key.includes('min') || key.includes('max') ? 'number' : 'text'}
                    size="small"
                    sx={{
                      '& .MuiInputBase-root': {
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.875rem'
                      },
                      '& .MuiInputLabel-root': {
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.875rem'
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setFilters(DEFAULT_FILTERS)}
                startIcon={<ClearIcon />}
                sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                onClick={fetchData}
                startIcon={<SearchIcon />}
                sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}
              >
                Search
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

        {/* Data Table */}
        <Paper sx={{ 
          borderRadius: 2,
          background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          overflow: 'hidden'
        }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableStyles.headerCell}>User ID</TableCell>
                <TableCell sx={tableStyles.headerCell}>Username</TableCell>
                <TableCell sx={tableStyles.headerCell} align="right">Total Bets</TableCell>
                <TableCell sx={tableStyles.headerCell} align="right">Total Deposits</TableCell>
                <TableCell sx={tableStyles.headerCell} align="right">Total Turn Over</TableCell>
                <TableCell sx={tableStyles.headerCell} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={tableStyles.tableCell}>
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.uid} hover>
                    <TableCell sx={tableStyles.tableCell}>{row.uid}</TableCell>
                    <TableCell sx={tableStyles.tableCell}>{row.userName}</TableCell>
                    <TableCell sx={tableStyles.tableCell} align="right">
                      {row.totalBets.toLocaleString()}
                    </TableCell>
                    <TableCell sx={tableStyles.tableCell} align="right">
                      {Number(row.totalDeposits).toLocaleString()}
                    </TableCell>
                    <TableCell sx={tableStyles.tableCell} align="right">
                      {row.totalTurnOver.toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="Increase Turn Over">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => openUpdateDialog(row.uid, 'INCREASE', row)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Decrease Turn Over">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => openUpdateDialog(row.uid, 'DECREASE', row)}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <Divider />
          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page}
            onPageChange={(e, newPage) => setPagination({ ...pagination, page: newPage })}
            rowsPerPage={pagination.limit}
            onRowsPerPageChange={(e) => setPagination({
              ...pagination,
              limit: parseInt(e.target.value, 10),
              page: 0
            })}
            sx={{
              '.MuiTablePagination-select': {
                fontFamily: 'Inter, sans-serif'
              },
              '.MuiTablePagination-displayedRows': {
                fontFamily: 'Inter, sans-serif'
              }
            }}
          />
        </TableContainer>
      </Paper>

      {/* Update Dialog */}
      <Dialog
        open={updateDialog.open}
        onClose={closeUpdateDialog}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400,
            background: "#0e1527"
          }
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          pb: 1
        }}>
          {updateDialog.updateType === 'INCREASE' ? 'Increase' : 'Decrease'} Turn Over
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {updateDialog.userData && (
              <Typography sx={{ 
                mb: 2,
                fontFamily: 'Inter, sans-serif',
                color: "#cccccc"
              }}>
                Current Turn Over: {updateDialog.userData.totalTurnOver.toLocaleString()}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={updateDialog.amount}
              onChange={(e) => setUpdateDialog({ ...updateDialog, amount: e.target.value })}
              error={updateDialog.updateType === 'DECREASE' && 
                     Number(updateDialog.amount) > (updateDialog.userData?.totalTurnOver || 0)}
              helperText={updateDialog.updateType === 'DECREASE' && 
                         Number(updateDialog.amount) > (updateDialog.userData?.totalTurnOver || 0) ?
                         'Amount cannot exceed current turn over' : ''}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'Inter, sans-serif'
                },
                '& .MuiInputLabel-root': {
                  fontFamily: 'Inter, sans-serif'
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={closeUpdateDialog}
            sx={{ fontFamily: 'Inter, sans-serif' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateTurnOver}
            variant="contained"
            color={updateDialog.updateType === 'INCREASE' ? 'primary' : 'error'}
            disabled={!updateDialog.amount || 
                     (updateDialog.updateType === 'DECREASE' && 
                      Number(updateDialog.amount) > (updateDialog.userData?.totalTurnOver || 0))}
            sx={{ fontFamily: 'Inter, sans-serif' }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            fontFamily: 'Inter, sans-serif',
            '& .MuiAlert-message': {
              fontFamily: 'Inter, sans-serif'
            }
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default UpdateTurnOver;