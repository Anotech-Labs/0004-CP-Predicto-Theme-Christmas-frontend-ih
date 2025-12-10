import { Alert, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const ErrorPopup = ({ message, onClose }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(600));
  useEffect(() => {
    if (message) {
      setOpenSnackbar(true); 
      
      const timer = setTimeout(() => {
        setOpenSnackbar(false);
        if (onClose) onClose();
      }, 3000);

      return () => clearTimeout(timer); 
    }
  }, [message, onClose]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
    if (onClose) onClose(); // Reset parent state on close
  };

  return (
    <Snackbar
      open={openSnackbar}
      autoHideDuration={5000}
      onClose={handleCloseSnackbar}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Alert
        variant="outlined"
        severity="warning"
        icon={false}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          fontSize: '15px',
          padding: '5px 5px',
          // fontWeight: 600,
          borderRadius: '8px',
          minWidth: '50px',
          maxWidth: isSmallScreen?"100%":'120px',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '45px' }}>!</div>
        <div>{message}</div>
      </Alert>
    </Snackbar>
  );
};

export default ErrorPopup;
