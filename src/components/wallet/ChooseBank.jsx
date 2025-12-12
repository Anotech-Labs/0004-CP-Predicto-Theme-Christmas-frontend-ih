import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { banks } from '../../data/BankData'


const ChooseBank = ({selectedBank, setSelectedBank, setShowBankSelection}) => {

  const [searchTerm, setSearchTerm] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [customBank, setCustomBank] = useState("")

  const handleBankClick = (bank) => {
    setSelectedBank(bank)
    setShowBankSelection(false)
  }

  const handleCustomBankSubmit = () => {
    setSelectedBank(customBank)
    setCustomBank("")
    setOpenDialog(false)
    setShowBankSelection(false)
  }

  const filteredBanks = banks.filter((bank) =>
    bank.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Box sx={{ backgroundColor: "#232626", p: 2 }}>
        <Box sx={{ backgroundColor: "#323738", mb: 2 }}>
          <TextField
            fullWidth
            variant="filled"
            placeholder="Search bank"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              input: {
                color: "white", // Input text color
                "&::placeholder": {
                  color: "grey", // Placeholder color
                  opacity: 1, // Ensure placeholder is visible
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#FED358" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ backgroundColor: "#323738", borderRadius: "4px" }}>
          <List>
            {filteredBanks.map((bank) => (
              <ListItem
                button
                key={bank}
                onClick={() => handleBankClick(bank)}
                sx={{ borderBottom: "1px solid #a8a5a1" }}
              >
                <ListItemText primary={bank} sx={{color:"#a8a5a1"}}/>
              </ListItem>
            ))}
            <ListItem
              button
              onClick={() => setOpenDialog(true)}
              sx={{ borderBottom: "1px solid #a8a5a1" }}
            >
              <ListItemText primary="Other" sx={{color:"#a8a5a1"}} />
            </ListItem>
          </List>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Enter Custom Bank Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Bank Name"
            type="text"
            fullWidth
            variant="outlined"
            value={customBank}
            onChange={(e) => setCustomBank(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCustomBankSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

    </>
  )
}

export default ChooseBank