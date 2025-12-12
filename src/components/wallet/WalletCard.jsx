import React, { useEffect, useContext } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
// import RefreshIcon from '@mui/icons-material/Refresh'
// import axios from 'axios';
// import { domain } from "../../utils/Secret";
import { UserContext } from '../../context/UserState'

const WalletCard = ({ name }) => {

  const { userWallet, getWalletBalance } = useContext(UserContext)

  useEffect(() => {
    getWalletBalance()
  }, [])

  const handleRefresh = () => {
    getWalletBalance()
  }

  return (
    <Grid
      container
      mt={0}
      style={{
        backgroundImage: `url('/assets/wallet/greencard.webp')`,
        borderRadius: 8,
        padding: 8,
        backgroundSize: "cover",
        width: "93%",
        marginLeft: "auto",
        marginRight: "auto",
        height: "138px",
        marginTop: "0.75rem",
      }}
    >
      <Grid
        container
        item
        alignItems="center"
        sx={{ textAlign: "left", display: "flex", gap: "4px" }} // Use gap for fine-tuning the space
      >
        <Grid
          item
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "4px",
            maxWidth: "16px", // Ensure proper alignment and size
          }}
        >
          <img
            src="/assets/wallet/wallet.webp"
            alt="Your Image"
            style={{ width: "100%" }} // Ensure the image stays within its container
          />
        </Grid>
        <Grid item>
          <Typography fontSize="15px" sx={{ color: "black", marginLeft: "5px", 
                      fontFamily: "'Times New Roman', Times,  ",}} align="left">
            {name}
          </Typography>
        </Grid>
      </Grid>

      <Grid container item alignItems="center" >
        <Grid
          item
          xs={12}
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "12px",
          }}
        >
          <Typography
            fontSize="27px"
            sx={{ color: "#221f2e", fontWeight: "bold",
              fontFamily: "'Times New Roman', Times,  ", }}
          >
            {`\u20B9 ${userWallet ? parseFloat(userWallet).toFixed(2) : "Loading..."
              }`}
          </Typography>
          <IconButton
            sx={{ fontWeight: "bold" }}
            onClick={handleRefresh}
          >
            {/* <RefreshIcon
              style={{ color: "#ffffff" }}
            /> */}
            <img
              src="/assets/icons/refreshWhite.webp"
              alt="logo"
              style={{ width: "25px", marginLeft: "2px" }}
            />
          </IconButton>
        </Grid>
      </Grid>

      <Grid
        container
        item
        alignItems="center"
        style={{ marginTop: 16 }}
      >
        <Grid item xs={3}></Grid>
        <Grid item xs={9}>
          <Typography
            variant="body1"
            sx={{ color: "#9e9c9b" }}
          ></Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default WalletCard