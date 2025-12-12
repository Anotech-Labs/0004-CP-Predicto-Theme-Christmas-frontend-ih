import React, { useEffect, useState } from "react";
import Mobile from "../../components/layout/Mobile";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { domain } from "../../utils/Secret";
import { useNavigate } from "react-router-dom";
import MuiAlert from "@mui/material/Alert"
import { useAuth } from "../../context/AuthContext"
import { Snackbar } from "@mui/material"

const GiftCoupon = ({ children }) => {
  const [couponCode, setCouponCode] = useState("")
  const [alertMsg, setAlertMsg] = useState({ message: "", severity: "info" })
  const [historyData, setHistoryData] = useState([])
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const navigate = useNavigate()
  const { axiosInstance } = useAuth()

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  useEffect(() => {
    const fetchGiftHistory = async () => {
      try {
        const response = await axiosInstance.get(
          `${domain}/api/account/v1/tokens/coupons/my-claims`,
          { withCredentials: true }
        )
        setHistoryData(response.data.data.data)
      } catch (error) {
        console.error("Error fetching transaction history:", error)
        
      }
    }

    fetchGiftHistory()
  }, [axiosInstance, alertMsg])

  const handleRedirect = () => {
    navigate(-1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await axiosInstance.post(
        `${domain}/api/account/v1/tokens/coupons/claim`,
        { code: couponCode },
        { withCredentials: true }
      )
      setAlertMsg({ message: response.data.message, severity: "success" })
    } catch (error) {
      //console.log("Error", error.response?.data?.message)
      
    } finally {
      setOpenSnackbar(true)
    }
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpenSnackbar(false)
  }

  return (
    <>
      <Mobile>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={1000}
          onClose={handleCloseSnackbar}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <MuiAlert
            onClose={handleCloseSnackbar}
            severity={alertMsg.severity} // Use the severity from alertMsg
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }}
          >
            {alertMsg.message} {/* Render only the message */}
          </MuiAlert>

        </Snackbar>
        <Box
          display="flex"
          flexDirection="column"
          height="100dvh"
          position="relative"
        >
          <Box flexGrow={1}>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#232626",
                padding: "7px 12px",
              }}
            >
              <Grid
                item
                xs={12}
                container
                alignItems="center"
                justifyContent="center"
              >
                <IconButton
                  sx={{
                    color: "#FDE4BC",
                    position: "absolute",
                    left: 0,
                    p: "12px",
                  }}
                  onClick={handleRedirect}
                >
                  <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
                </IconButton>
                <Typography
                  variant="h6"
                  sx={{ color: "#FDE4BC", textAlign: "center", fontSize: "19px" }}
                >
                  Gift
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ backgroundColor: "#232626", height: "100%" }}>
              <img
                src="../assets/activity/giftbg.webp"
                alt="coupon"
                style={{ width: "100%", height: "190px" }}
              />
              <Box sx={{ backgroundColor: "#232626", px: 1.5, pb: 1, mt: 1.5 }}>
                <Box
                  sx={{
                    backgroundColor: "#323738",
                    padding: 2,
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="body1"
                    gutterBottom
                    align="left"
                    sx={{ fontSize: "15px" }}
                    color="#B79C8B"
                  >
                    Hi
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    align="left"
                    sx={{ fontSize: "15px" }}
                    color="#B79C8B"
                  >
                    We have a gift for you
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    align="left"
                    color="#FDE4BC"
                    sx={{ mt: 4, fontSize: "14px" }}
                  >
                    Please enter the gift code below
                  </Typography>
                  <form
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: "20px",
                      width: "100%",
                    }}
                  >
                    <TextField
                      value={couponCode}
                      onChange={(event) => setCouponCode(event.target.value)}
                      placeholder="Please enter gift code"
                      required
                      variant="outlined"
                      size="small"
                      sx={{
                        marginBottom: "10px",
                        padding: "2px",
                        borderRadius: "20px",
                        backgroundColor: "#232626",
                        "& .MuiInputBase-input::placeholder": {
                          color: "#9598aa",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                      InputProps={{
                        style: { color: "white" },
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      // color="primary"
                      sx={{
                        borderRadius: "50px",
                        my: "20px",
                        // textDecoration:"none",
                        padding: "11px",
                        background: "linear-gradient(90deg,#24ee89,#9fe871)",
                        color: "black",
                        textTransform: "none",
                        "&:hover": {
                          background: "linear-gradient(90deg,#24ee89,#9fe871)",
                        },
                      }}
                    >
                      Receive
                    </Button>
                  </form>
                </Box>
              </Box>

              <Box sx={{ padding: 1.5, boxShadow: "none", background: "#232626",mb:3 }}>
                <Card
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "none", background: "#323738",
                    height: "100%",
                    padding: "0px",
                  }}
                >
                  <CardContent padding="0px">
                    <Typography
                      variant="h7"
                      sx={{
                        display: "flex", // Flexbox to align items
                        alignItems: "center", // Vertically align items
                        marginBottom: "0.5rem",
                        // marginTop: "1.5rem",
                        color: "#FDE4BC",
                        textAlign: "left",
                      }}
                    >
                      <Box
                        component="img"
                        src="/assets/icons/history.svg"
                        alt="Invitation Reward Rules"
                        sx={{ width: "18px", height: "38px", marginRight: "8px" }}
                      />
                      History
                    </Typography>

                    {historyData.length > 0 ? (
                     <List sx={{ maxHeight: 300, overflow: "auto" }}>
                     {historyData.map((transaction, index) => (
                       <React.Fragment key={index}>
                         <ListItem
                           alignItems="flex-start"
                           sx={{
                             background: "#232626",
                             borderRadius: 2,
                             mb: 1,
                             padding: "12px 16px",
                           }}
                         >
                           <Grid container spacing={2} alignItems="center">
                             <Grid item xs={6}>
                               <Typography
                                 variant="subtitle1"
                                 sx={{
                                   color: "#FED358",
                                   marginBottom: "4px", // Add margin to separate "Coupon" and the code
                                 }}
                               >
                                 Coupon
                               </Typography>
                               <Typography
                                 variant="subtitle1"
                                 sx={{
                                   color: "#FED358",
                                 }}
                               >
                                 {transaction?.couponCode}
                               </Typography>
                             </Grid>
                             <Grid
                               item
                               xs={6}
                               sx={{
                                 display: "flex",
                                 flexDirection: "column",
                                 alignItems: "flex-end",
                                 justifyContent: "center", // Align content vertically in the center
                               }}
                             >
                               <Typography
                                 variant="subtitle1"
                                 sx={{
                                   color: "#FED358",
                                   fontWeight: "bold",
                                 }}
                               >
                                 ₹{transaction?.discount}
                               </Typography>
                               <Typography
                                 variant="body2"
                                 sx={{
                                   color: "#FED358",
                                 }}
                               >
                                 {new Date(transaction.claimedAt).toLocaleDateString()}
                               </Typography>
                             </Grid>
                           </Grid>
                         </ListItem>
                         {index < historyData.length - 1 && (
                           <Divider
                             variant="inset"
                             component="li"
                             sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}
                           />
                         )}
                       </React.Fragment>
                     ))}
                   </List>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          borderRadius: 2,
                          p: 2,
                        }}
                      >
                        <img
                          src="../../assets/No data-1.webp"
                          alt="No data"
                          style={{ width: "100px", marginBottom: "10px" }}
                        />
                        <Typography variant="body2" sx={{ color: "#666462" }}>
                          No Data
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>

          {children}
        </Box>
      </Mobile>
    </>
  );
};

export default GiftCoupon;