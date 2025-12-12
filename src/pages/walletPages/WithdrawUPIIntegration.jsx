// This file contains the UPI integration code to be added to Withdraw.jsx

// Add these imports at the top
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import StarIcon from '@mui/icons-material/Star'

// Add UPI state management (add after existing state declarations around line 195)
const [upiDetails, setUpiDetails] = useState({
  primaryUPI: null,
  canWithdraw: false
})
const [upiAmount, setUpiAmount] = useState("")

// Add UPI fetch function (add after existing useEffect around line 270)
useEffect(() => {
  const fetchUPIDetails = async () => {
    try {
      // Fetch primary UPI
      const primaryResponse = await axiosInstance.get(
        `${domain}/api/list/upi/primary`
      )
      
      // Check withdrawal eligibility
      const eligibilityResponse = await axiosInstance.get(
        `${domain}/api/list/upi/withdrawal-eligibility`
      )

      setUpiDetails({
        primaryUPI: primaryResponse.data.data,
        canWithdraw: eligibilityResponse.data.data?.canWithdraw || false
      })
    } catch (error) {
      console.error("Error fetching UPI details:", error)
      setUpiDetails({
        primaryUPI: null,
        canWithdraw: false
      })
    }
  }

  fetchUPIDetails()
}, [])

// Add UPI withdrawal handling (add in the handleWithdraw function after USDT handling around line 540)
// Handling UPI Withdrawals
else if (withdrawalMethod === "UPI") {
  // Validate UPI setup
  if (!upiDetails.primaryUPI || !upiDetails.canWithdraw) {
    setIsPopupVisible(true)
    setPopupMessage("Please set up your primary UPI address first.")
    setTimeout(() => {
      setIsPopupVisible(false)
    }, 2000)
    return
  }

  // Validate UPI amount
  const upiAmountNum = parseFloat(upiAmount)
  if (isNaN(upiAmountNum) || upiAmountNum <= 0) {
    setIsPopupVisible(true)
    setPopupMessage("Please enter a valid UPI amount.")
    setTimeout(() => {
      setIsPopupVisible(false)
    }, 2000)
    return
  }

  // Validate UPI withdrawal amount against settings
  if (
    upiAmountNum < withdrawData.minWithdrawAmount ||
    upiAmountNum > withdrawData.maxWithdrawAmount
  ) {
    setIsPopupVisible(true)
    setPopupMessage(
      `UPI amount must be between ₹${withdrawData.minWithdrawAmount} and ₹${withdrawData.maxWithdrawAmount}.`
    )
    setTimeout(() => {
      setIsPopupVisible(false)
    }, 2000)
    return
  }

  // Check wallet balance
  if (upiAmountNum > walletBalance) {
    setIsPopupVisible(true)
    setPopupMessage("Insufficient wallet balance for UPI withdrawal.")
    setTimeout(() => {
      setIsPopupVisible(false)
    }, 2000)
    return
  }

  // Proceed with UPI withdrawal request
  try {
    const response = await axiosInstance.post(
      `${domain}/api/wallet/withdraw`,
      {
        amount: upiAmountNum,
        withdrawalMethod: "UPI",
        upiId: upiDetails.primaryUPI.id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    setIsPopupVisible(true)
    setPopupMessage("UPI withdrawal request was successful.")
    setTimeout(() => {
      setIsPopupVisible(false)
    }, 2000)
    
    // Reset UPI form fields
    setUpiAmount("")
    setWithdrawalAmount("")
  } catch (error) {
    setIsPopupVisible(true)
    setPopupMessage(error.response?.data?.message || "UPI withdrawal request failed.")
    setTimeout(() => {
      setIsPopupVisible(false)
    }, 2000)
  }
}

// Add UPI option in the withdrawal method selection (add after USDT Grid item around line 860)
<Grid item xs={4}>
  <div
    onClick={() => setWithdrawalMethod("UPI")}
    style={{
      background:
        withdrawalMethod === "UPI"
          ? "linear-gradient(90deg, #6a1b17 0%, #f70208 100%)"
          : "#ffffff",
      color: withdrawalMethod === "UPI" ? "#ffffff" : "#768096",
      borderRadius: 8,
      padding: 16,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      cursor: "pointer",
      textAlign: "center",
    }}
  >
    <AccountBalanceWalletIcon
      style={{
        display: "block",
        margin: "0 auto",
        width: 40,
        height: 40,
        marginBottom: 8,
      }}
    />
    <Typography
      variant="body2"
      style={{ marginTop: 8 }}
      sx={{ fontFamily: "'Times New Roman', Times,  " }}
    >
      UPI
    </Typography>
  </div>
</Grid>

// Add UPI amount input section (add after USDT section around line 970)
{withdrawalMethod === "UPI" && (
  <Grid
    container
    spacing={1}
    style={{
      marginTop: "20px",
      padding: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    }}
  >
    <Grid item xs={12}>
      <Typography
        variant="h6"
        style={{
          fontWeight: "bold",
          marginBottom: "10px",
          color: "#333",
        }}
      >
        UPI Withdrawal Amount
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Enter UPI Amount"
        type="number"
        value={upiAmount}
        onChange={(e) => {
          setUpiAmount(e.target.value)
          setWithdrawalAmount(e.target.value)
        }}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <Typography style={{ marginRight: "8px", color: "#666" }}>
              ₹
            </Typography>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        }}
      />
    </Grid>
  </Grid>
)}

// Add UPI details display section (add after Bank Card details section around line 1020)
{withdrawalMethod === "UPI" && upiDetails.primaryUPI ? (
  <Grid
    container
    alignItems="center"
    style={{
      marginTop: "20px",
      padding: "15px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      border: "1px solid #e9ecef",
    }}
  >
    <Grid item xs={2}>
      <AccountBalanceWalletIcon
        style={{
          fontSize: 40,
          color: "#6a1b17",
        }}
      />
    </Grid>
    <Grid item xs={8}>
      <Typography
        variant="body1"
        style={{
          fontWeight: "bold",
          color: "#333",
          display: "flex",
          alignItems: "center",
        }}
      >
        {upiDetails.primaryUPI.upiAddress}
        <StarIcon style={{ color: "gold", marginLeft: 8, fontSize: 20 }} />
      </Typography>
      <Typography
        variant="body2"
        style={{ color: "#666", marginTop: "2px" }}
      >
        {upiDetails.primaryUPI.upiName}
      </Typography>
      {upiDetails.primaryUPI.upiProvider && (
        <Typography
          variant="body2"
          style={{ color: "#666", marginTop: "2px" }}
        >
          Provider: {upiDetails.primaryUPI.upiProvider}
        </Typography>
      )}
    </Grid>
    <Grid item xs={2}>
      <Button
        variant="outlined"
        size="small"
        onClick={() => navigate("/upi-management")}
        sx={{
          borderColor: "#6a1b17",
          color: "#6a1b17",
          "&:hover": {
            borderColor: "#f70208",
            backgroundColor: "rgba(247, 2, 8, 0.04)",
          },
        }}
      >
        Manage
      </Button>
    </Grid>
  </Grid>
) : (
  withdrawalMethod === "UPI" && (
    <Grid
      onClick={() => navigate("/upi-management")}
      container
      alignItems="center"
      style={{
        marginTop: "20px",
        padding: "20px",
        backgroundColor: "#fff3cd",
        borderRadius: "8px",
        border: "1px solid #ffeaa7",
        cursor: "pointer",
      }}
    >
      <Grid item xs={2}>
        <AccountBalanceWalletIcon
          style={{
            fontSize: 40,
            color: "#856404",
          }}
        />
      </Grid>
      <Grid item xs={10}>
        <Typography
          variant="body1"
          style={{
            fontWeight: "bold",
            color: "#856404",
          }}
        >
          No Primary UPI Set
        </Typography>
        <Typography
          variant="body2"
          style={{ color: "#856404", marginTop: "5px" }}
        >
          Click here to add and manage your UPI addresses
        </Typography>
      </Grid>
    </Grid>
  )
)}

// Add UPI warning message (add after existing warning messages around line 1090)
{withdrawalMethod === "UPI" && !upiDetails.canWithdraw ? (
  <Typography
    sx={{
      color: "#d23838",
      fontSize: "12px",
      marginTop: "10px",
      textAlign: "center",
    }}
  >
    Need to set up a primary UPI address to be able to withdraw money
  </Typography>
) : ("")}

// Add UPI form fields in the main form section (add after USDT fields around line 1320)
{withdrawalMethod === "UPI" && (
  <>
    {upiDetails?.primaryUPI && (
      <>
        <TextField
          fullWidth
          label="UPI Address"
          value={upiDetails.primaryUPI.upiAddress}
          disabled
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: <AccountBalanceWalletIcon sx={{ mr: 1, color: 'grey.500' }} />,
            endAdornment: <StarIcon sx={{ color: 'gold' }} />
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#f8f9fa",
            },
          }}
        />
        <TextField
          fullWidth
          label="Account Holder Name"
          value={upiDetails.primaryUPI.upiName}
          disabled
          variant="outlined"
          margin="normal"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#f8f9fa",
            },
          }}
        />
        {upiDetails.primaryUPI.upiProvider && (
          <TextField
            fullWidth
            label="UPI Provider"
            value={upiDetails.primaryUPI.upiProvider}
            disabled
            variant="outlined"
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#f8f9fa",
              },
            }}
          />
        )}
      </>
    )}
  </>
)}

// Update the withdrawal button condition (modify existing condition around line 1400)
// Change from:
// disabled={!isFormValid || (withdrawalMethod === "Bank Card" && !bankDetails) || (withdrawalMethod === "USDT" && usdtDetails.address.length === 0)}
// To:
disabled={
  !isFormValid || 
  (withdrawalMethod === "Bank Card" && !bankDetails) || 
  (withdrawalMethod === "USDT" && usdtDetails.address.length === 0) ||
  (withdrawalMethod === "UPI" && !upiDetails.canWithdraw)
}

// Add navigation to UPI Management page
// Add this route to your App.js or routing configuration:
// import UPIManagement from './pages/walletPages/UPIManagement'
// <Route path="/upi-management" element={<UPIManagement />} />
