import React, { useContext, useEffect } from 'react'
// import Refresh from "@mui/icons-material/Refresh";"
// import VolumeUp from "@mui/icons-material/VolumeUp";
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import IconButton from '@mui/material/IconButton'
import Button from "@mui/material/Button"
import DetailsBox from '../../common/DetailsBox'
import { UserContext } from '../../../context/UserState'
import { Refresh } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
// import TextField from "@mui/material/TextField";



const GameWalletCard = () => {

  const navigate = useNavigate()

  const { userWallet, getWalletBalance } = useContext(UserContext)

  useEffect(() => {
    getWalletBalance()
  }, [])

  const handleRefresh = () => {
    getWalletBalance()
  }

  const navigateToRecharge = () => {
    navigate("/wallet/deposit")
  }

  const navigateToWithdraw = () => {
    navigate("/wallet/withdraw")
  }

  return (
    <>
      <Grid
        container
        direction="column"
        sx={{
          height: "300px",
          backgroundColor: "#323738",
          borderRadius: "0 0 70px 70px",
          textAlign: "center",
        }}
      >
        <Grid
          sx={{
            backgroundImage: `url("/assets/walletbg.webp")`,
            backgroundSize: "cover",
            backgroundColor: "#3a4142",
            backgroundPosition: "center",
            margin: "20px 15px 10px 15px",
            borderRadius: "30px",
            padding: "10px",
            // marginTop: "10px",
          }}
        >
          <Grid
            sm={12}
            item
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {/* {userWallet ? `₹ ${ parseFloat(userWallet)}` : "₹ Loading"} */}
              {`\u20B9${userWallet ? `${parseFloat(userWallet).toFixed(2)}` : "₹ Loading"}`}
            </Typography>
            {/* <IconButton sx={{ color: "#a6a6a6", marginLeft:"20px"}} onClick={handleRefresh}>
              <Refresh />
            </IconButton> */}
            <IconButton onClick={handleRefresh}>
              <img
                src="/assets/icons/refreshGrey.webp"
                alt="logo"
                style={{ width: "19px", marginLeft: "2px" }}
              />
            </IconButton>
          </Grid>

          <Grid
            sm={12}
            item
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
            }}
          >
            {/* <AccountBalanceWallet
              sx={{ marginRight: "10px", color: "#24ee89" }}
            /> */}
            <Box
              component="img"
              src="../assets/wingo/wallet.svg"
              alt=""
              sx={{ marginRight: "10px", width: "20px", height: "20px" }} // Adjust the size as needed
            />
            <Typography variant="subtitle2">Wallet Balance</Typography>
          </Grid>
          <Grid
            sm={12}
            mt={3}
            item
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "50px",
              px: "10px",
              pb: "8px"
            }}
          >
            <Button
              variant="filled"
              onClick={navigateToWithdraw}
              fullWidth
              sx={{
                fontSize: "15px",
                // width:"55px",
                // marginLeft: "10px",
                color: "white",
                backgroundColor: "#D23838",
                "&:hover": {
                  backgroundColor: "#D23838",
                },
                borderColor: "#D23838",
                borderRadius: "50px",
                fontWeight: "bold",
                textTransform: "none",
                height:"36px"
              }}
            >
              Withdraw
            </Button>
            <Button
              variant="contained"
              onClick={navigateToRecharge}
              fullWidth
              sx={{
                fontSize: "15px",
                // width:"55px",
                // marginLeft: "10px",
                backgroundColor: "#17B15E",
                "&:hover": {
                  backgroundColor: "#17B15E",
                },
                borderRadius: "50px",
                fontWeight: "bold",
                textTransform: "none",
                height: "36px",
              }}
            >
              Deposit
            </Button>
          </Grid>
        </Grid>
        <DetailsBox />
      </Grid>
    </>
  )
}

export default GameWalletCard