import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  ThemeProvider,
  createTheme,
  alpha,
  CircularProgress,
  IconButton
} from "@mui/material";
import { Close as CloseIcon } from '@mui/icons-material';
import { useAuth } from "../../../context/AuthContext";
import { domain } from "../../../utils/Secret";

// Custom theme with Inter font
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
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
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#f8fafc',
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: '0.02em',
      color: '#f8fafc',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            fontFamily: 'Inter, sans-serif',
            '&:hover fieldset': {
              borderColor: '#6366f1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366f1',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            fontFamily: 'Inter, sans-serif',
            '&.Mui-focused': {
              color: '#6366f1',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: '8px',
          padding: '10px 24px',
          boxShadow: 'none',
        },
      },
    },
  },
});

const BankDetailsModal = ({ open, onClose, userId }) => {
  const { axiosInstance } = useAuth();
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    mobileNumber: "",
  });

  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (open && userId) {
      fetchBankDetails();
    }
  }, [open, userId]);

  const fetchBankDetails = async () => {
    try {
      const { data } = await axiosInstance.get(
        `${domain}/api/list/admin/banking/users/${userId}/bank-account`,
        { withCredentials: true }
      );
      setBankDetails(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bank details:", error);
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (e) => {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosInstance.put(
        `${domain}/api/list/admin/banking/users/${userId}/bank-account`,
        bankDetails,
        { withCredentials: true }
      );
      setSnackbar({ 
        open: true, 
        message: data.message, 
        severity: "success" 
      });
      onClose();
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: "An error occurred while updating bank details", 
        severity: "error" 
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Modal 
        open={open} 
        onClose={onClose} 
        aria-labelledby="bank-details-modal"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 500 },
            bgcolor: 'background.paper',
            boxShadow: '0px 4px 35px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px',
            p: { xs: 2, sm: 4 },
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography 
            variant="h4" 
            sx={{ 
              mb: 3, 
              textAlign: 'center',
              color: 'primary.main',
              fontSize: '1.75rem',
            }}
          >
            Update Bank Details
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress sx={{ color: 'primary.main' }} />
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Account Holder Name"
                  name="accountName"
                  value={bankDetails.accountName}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="Enter account holder name"
                  sx={{ mb: 2.5 }}
                />
                <TextField
                  label="Account Number"
                  name="accountNumber"
                  value={bankDetails.accountNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="Enter account number"
                  sx={{ mb: 2.5 }}
                />
                <TextField
                  label="IFSC Code"
                  name="ifscCode"
                  value={bankDetails.ifscCode}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="Enter IFSC code"
                  sx={{ mb: 2.5 }}
                />
                <TextField
                  label="Bank Name"
                  name="bankName"
                  value={bankDetails.bankName}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="Enter bank name"
                  sx={{ mb: 2.5 }}
                />
                <TextField
                  label="Mobile Number"
                  name="mobileNumber"
                  value={bankDetails.mobileNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="Enter mobile number"
                />
              </Box>

              <Box 
                display="flex" 
                justifyContent="space-between" 
                gap={2}
                mt={4}
              >
                <Button
                  onClick={onClose}
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: alpha('#071251', 0.04),
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  Update Details
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            fontFamily: 'Inter, sans-serif',
            '& .MuiAlert-message': {
              fontSize: '0.95rem',
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default BankDetailsModal;