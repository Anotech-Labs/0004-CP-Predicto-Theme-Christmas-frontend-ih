import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const DeleteConfirmationModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-confirmation-modal"
      aria-describedby="confirm-delete-action"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mx:2
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '320px',
          bgcolor: '#323738',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: 24,
        }}
      >
        <Box
          sx={{
            p: 2,
            bgcolor: '#323738',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: "bold",
              mt:0.5
            }}
          >
            Warning
          </Typography> <Typography
            variant="body1"
            sx={{
              color: '#aaaaaa',
              fontSize: '16px',
            //   mb: 3,
            }}
          >
            Are you sure to delete this message?
          </Typography>
        </Box>
        
        <Box
          sx={{
            // p: 3,
            textAlign: 'center',
          }}
        >
         
          
          <Box
            sx={{
              display: 'flex',
              width: '100%',
            }}
          >
            <Button
              onClick={onClose}
              sx={{
                flex: 1,
                py: 1.5,
                bgcolor: '#454456',
                color: 'white',
                borderRadius: 0,
                textTransform:"none"
                // '&:hover': {
                //   bgcolor: '#454456',
                // },
              }}
            >
              Cancel
            </Button>
            
            <Button
              onClick={onConfirm}
              sx={{
                flex: 1,
                py: 1.5,
                background: 'linear-gradient(90deg,#24ee89,#9fe871)',
                color: 'black',
                borderRadius: 0,
                textTransform:"none"
                // '&:hover': {
                //   bgcolor: '#f07c2e',
                // },
              }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmationModal;