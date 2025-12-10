import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Dark theme matching admin panel
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
    },
    background: {
      default: '#1e293b',
      paper: '#334155',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
  },
});

// Custom styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  background: '#0e1527',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  overflow: 'hidden'
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  padding: '16px',
  '&.MuiTableCell-head': {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    color: '#f8fafc',
    fontWeight: 500,
    fontSize: '14px',
    whiteSpace: 'nowrap'
  },
  '&.MuiTableCell-body': {
    fontSize: '14px',
    color: '#f8fafc'
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  '&:hover': {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  padding: '8px 24px',
  borderRadius: '6px',
  '&.MuiButton-containedPrimary': {
    backgroundColor: '#6366f1',
    '&:hover': {
      backgroundColor: '#1976d2'
    }
  }
}));

const StyledEditIcon = styled(EditIcon)({
  fontSize: 18,
  color: '#6366f1'
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '12px',
    padding: '16px',
    background: "#0e1527"
  }
}));

function AttendanceBonusSetting() {
  const { axiosInstance } = useAuth();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [editValues, setEditValues] = useState({
    depositAmount: '',
    bonusAmount: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const fetchAttendanceStats = async () => {
    try {
      const response = await axiosInstance.get('/api/activity/attendance/admin/stats');
      setRules(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch attendance rules');
      console.error('Error fetching attendance stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const initializeRules = async () => {
    try {
      setLoading(true);
      await axiosInstance.post('/api/activity/attendance/create-initial-rules');
      await fetchAttendanceStats();
    } catch (err) {
      setError('Failed to initialize rules');
      console.error('Error initializing rules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceStats();
  }, []);

  const handleEditClick = (rule) => {
    setSelectedRule(rule);
    setEditValues({
      depositAmount: rule.requirement.deposit,
      bonusAmount: rule.requirement.bonus
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRule(null);
    setEditValues({ depositAmount: '', bonusAmount: '' });
  };

  const handleUpdateRule = async () => {
    try {
      await axiosInstance.put(`/api/activity/attendance/rules/${selectedRule.id}`, {
        depositAmount: Number(editValues.depositAmount),
        bonusAmount: Number(editValues.bonusAmount)
      });
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      fetchAttendanceStats();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to update rule');
      console.error('Error updating rule:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ 
        margin: "0 auto", 
        p: 3, 
        backgroundColor: 'rgba(15, 23, 42, 0.6)', 
        minHeight: '100vh',
        borderRadius: '16px',
        border: '1px solid rgba(148, 163, 184, 0.1)'
      }}>
        <Stack spacing={3}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: '8px',
                '& .MuiAlert-icon': { color: '#f44336' }
              }}
            >
              {error}
            </Alert>
          )}
        
        {updateSuccess && (
          <Alert 
            severity="success"
            sx={{ 
              borderRadius: '8px',
              '& .MuiAlert-icon': { color: '#4caf50' }
            }}
          >
            Rule updated successfully!
          </Alert>
        )}

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          p: 3,
          background: '#0e1527',
          borderRadius: '12px',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: 'Inter, sans-serif', 
              fontWeight: 700,
              color: '#f8fafc',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
            }}
          >
            Attendance Bonus Settings
          </Typography>
          
          {rules.length === 0 && (
            <StyledButton
              variant="contained"
              onClick={initializeRules}
            >
              Quick Setup
            </StyledButton>
          )}
        </Box>

        <StyledPaper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Day</StyledTableCell>
                  <StyledTableCell align="right">Required Deposit</StyledTableCell>
                  <StyledTableCell align="right">Bonus Amount</StyledTableCell>
                  <StyledTableCell align="right">Total Claims</StyledTableCell>
                  <StyledTableCell align="right">Total Bonus Paid</StyledTableCell>
                  <StyledTableCell align="right">Total Deposits</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rules.map((rule) => (
                  <StyledTableRow key={rule.id}>
                    <StyledTableCell>Day {rule.day}</StyledTableCell>
                    <StyledTableCell align="right">
                      {rule.requirement.deposit.toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {rule.requirement.bonus.toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {rule.stats.totalClaims.toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {rule.stats.totalBonusPaid.toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {rule.stats.totalDeposits.toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <IconButton
                        onClick={() => handleEditClick(rule)}
                        size="small"
                        sx={{ padding: '4px' }}
                      >
                        <StyledEditIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledPaper>

        <StyledDialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: '18px',
            fontWeight: 600,
            color: '#f8f8f8',
            pb: 1
          }}>
            Edit Day {selectedRule?.day} Requirements
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                label="Required Deposit"
                type="number"
                value={editValues.depositAmount}
                onChange={(e) => setEditValues({ ...editValues, depositAmount: e.target.value })}
                fullWidth
                variant="outlined"
                InputProps={{
                  sx: { 
                    fontFamily: 'Inter, sans-serif',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e0e0e0'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0c1754'
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { fontFamily: 'Inter, sans-serif' }
                }}
              />
              <TextField
                label="Bonus Amount"
                type="number"
                value={editValues.bonusAmount}
                onChange={(e) => setEditValues({ ...editValues, bonusAmount: e.target.value })}
                fullWidth
                variant="outlined"
                InputProps={{
                  sx: { 
                    fontFamily: 'Inter, sans-serif',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e0e0e0'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0c1754'
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { fontFamily: 'Inter, sans-serif' }
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ padding: '16px 24px' }}>
            <StyledButton
              onClick={handleCloseDialog}
              sx={{ color: '#666' }}
            >
              Cancel
            </StyledButton>
            <StyledButton
              onClick={handleUpdateRule}
              variant="contained"
            >
              Update
            </StyledButton>
          </DialogActions>
        </StyledDialog>
      </Stack>
    </Box>
  </ThemeProvider>
  );
}

export default AttendanceBonusSetting;