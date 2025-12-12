import React, { useState, useEffect, useContext } from "react";
import Mobile from "../../components/layout/Mobile";
import IconButton from "@mui/material/IconButton";
import { Button } from "@mui/material";
import { Typography, Grid, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { domain } from "../../utils/Secret";
import MuiAlert from "@mui/material/Alert";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Snackbar from "@mui/material/Snackbar";
import { UserContext } from "../../context/UserState";
import { QRCodeCanvas } from "qrcode.react"; // Import QRCodeCanvas component
// import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

const InviteLink = ({ children }) => {
  const [invitationLink, setInvitationLink] = useState("");
  const { userData } = useContext(UserContext);
  useEffect(() => {
    if (userData?.referralLink) {
      setInvitationLink(userData.referralLink);
    }
  }, []);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);
  const navigate = useNavigate();

  const handleCopyLink = () => {
  try {
    if (userData && userData.referralLink) {
      // Get the current domain
      const currentDomain = window.location.origin;
      
      // Extract just the path part from the referral link (e.g., /register?invitecode=282400302553)
      let referralPath = userData.referralLink;
      
      // If the referral link already contains a domain or protocol, extract just the path
      if (referralPath.includes('://') || referralPath.includes('www.')) {
        const url = new URL(referralPath);
        referralPath = url.pathname + url.search + url.hash;
      }
      
      // Ensure the path starts with a / if it doesn't already
      if (!referralPath.startsWith('/')) {
        referralPath = '/' + referralPath;
      }
      
      // Create the complete invitation link with the current domain
      const completeInvitationLink = `${currentDomain}${referralPath}`;
      
      // Create a temporary textarea element
      const tempInput = document.createElement("textarea");
      tempInput.value = completeInvitationLink;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy"); // Fallback method
      document.body.removeChild(tempInput);
      setOpenSnackbar(true);
      //console.log("Copied successfully using current domain:", currentDomain);
    } else {
      console.error("Referral link not available.");
    }
  } catch (err) {
    console.error("Failed to copy referral link: ", err);
  }
};


  // const handleDownload = () => {
  //   const div = document.getElementById("divToDownload");

  //   html2canvas(div).then((canvas) => {
  //     canvas.toBlob((blob) => {
  //       saveAs(blob, "invitation.webp");
  //     });
  //   });
  // };

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <>
      <>
        <Mobile>
          <Box
            display="flex"
            flexDirection="column"
            height="calc(var(--vh, 1vh) * 100)"
            position="relative"
          >
            <Box flexGrow={1} sx={{ backgroundColor: "#232626" }}>
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
                      color: "#ffffff",
                      position: "absolute",
                      left: 0,
                      p: "12px",
                    }}
                    onClick={() => navigate(-1)}
                  >
                    <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{ color: "#ffffff", textAlign: "center", fontSize: "19px" }}
                  >
                    Invite
                  </Typography>
                </Grid>
              </Grid>

              {/* //content */}
              <Typography
                variant="h6"
                sx={{
                  textAlign: "center",
                  fontSize: "15px",
                  mt: "15px",
                  color: "#B3BEC1",
                }}
              >
                Please swipe left - right to choose your favorite poster
              </Typography>

              <Box
                component="div"
                sx={{
                  display: "flex",
                  overflowX: "scroll",
                  scrollSnapType: "x mandatory",
                  WebkitOverflowScrolling: "touch",
                  gap: 2,
                  px: 5,
                  mt: 3,
                  scrollbarWidth: "none", // Firefox
                  "&::-webkit-scrollbar": { display: "none" }, // Chrome/Safari
                }}
              >
                {[1, 2, 3].map((index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: "0 0 85%",
                      scrollSnapAlign: "center",
                      position: "relative",
                      borderRadius: 2,
                      overflow: "hidden",
                      backgroundColor: "#fff",
                      boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    {/* Poster Image */}
                    <img
                      src={`/assets/promotion/poster.webp`}
                      alt={`Poster ${index}`}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                    />

                    {/* QR Code Overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "white",
                        padding: "6px",
                        borderRadius: "4px",
                        boxShadow: "0px 2px 6px rgba(0,0,0,0.3)",
                      }}
                    >
                      {invitationLink ? (
                        <QRCodeCanvas
                          value={invitationLink}
                          size={70}
                          bgColor={"#ffffff"}
                          fgColor={"#000000"}
                          level={"L"}
                          includeMargin={false}
                        />
                      ) : (
                        <Typography color="error" variant="body2">
                          Loading QR...
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  mx: 1
                }}
              >
                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: "17px",
                    // fontWeight: "bold",
                    mt: "15px",
                    color: "#ffffff",
                  }}
                >
                  Invite friends
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "center",
                    // fontWeight: "bold",
                    fontSize: "17px",
                    mt: "15px",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Income
                  <span
                    style={{
                      color: "#D23838",
                      marginLeft: "8px",
                      marginRight: "8px",
                    }}
                  >
                    10 billion
                  </span>
                  Commission
                </Typography>
              </Box>
              <Grid
                container
                spacing={2}
                sx={{
                  marginLeft: "auto",
                  marginRight: "7%",
                  width: "90%",
                  marginTop: "20px",
                  marginBottom: "150px",
                }}
              >
                <Grid item xs={12}>
                  <a onClick={handleCopyLink}
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "10px",
                      background: "linear-gradient(90deg,#24ee89,#9fe871)",
                      color: "black",
                      borderRadius: "20px",
                      textDecoration: "none",
                      fontSize: "16px",
                      // fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    Invitation Link
                  </a>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleCopyLink}
                    style={{
                      color: "#24ee89",
                      borderColor: "#24ee89",
                      borderRadius: "20px",
                      textTransform: "none",
                    }}
                  >
                    Copy Invitation Link
                  </Button>
                </Grid>
              </Grid>

              <Snackbar
                open={openSnackbar}
                autoHideDuration={1000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "center", horizontal: "center" }}
                sx={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "90%",
                }}
              >
                <MuiAlert
                  onClose={handleCloseSnackbar}
                  severity="success"
                  sx={{
                    // width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    "& .MuiAlert-icon": {
                      color: "orange", // Changes the icon color
                    },
                  }}
                >
                  Invitation link copied successfully!
                </MuiAlert>
              </Snackbar>
              {/* content end */}
            </Box>

            {children}
          </Box>
        </Mobile>
      </>
    </>
  );
};

export default InviteLink;
