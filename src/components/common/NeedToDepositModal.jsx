import React from 'react'
import { Modal, Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom' // Import useNavigate for navigation

const NeedToDepositModal = ({ open, onClose }) => {
  const navigate = useNavigate() // Hook for navigation

  // Handle confirm button click
  const handleConfirm = () => {
    navigate('/wallet/deposit') // Navigate to the deposit page
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="need-to-deposit-modal"
      aria-describedby="confirm-deposit-action"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 2,
        '&:focus-visible': {
          outline: 'none',
          boxShadow: 'none',
        },
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
          '&:focus-visible': {
            outline: 'none',
            boxShadow: 'none',
          },
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
              fontWeight: 'bold',
              mt: 0.5,
            }}
          >
            Deposit Required
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#aaaaaa',
              fontSize: '16px',
            }}
          >
            You need to deposit funds to continue.
          </Typography>
        </Box>

        <Box
          sx={{
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
                textTransform: 'none',
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={handleConfirm} // Navigate to deposit page on confirm
              sx={{
                flex: 1,
                py: 1.5,
                background: 'linear-gradient(90deg,#24ee89,#9fe871)',
                color: 'black',
                borderRadius: 0,
                textTransform: 'none',
              }}
            >
              Deposit Now
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default NeedToDepositModal