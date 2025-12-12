import React, { useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Mobile from "../../components/layout/Mobile";
import { useNavigate } from "react-router-dom";
import { IconButton } from '@mui/material';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Grid from "@mui/material/Grid";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Feedback = () => {
  const navigate = useNavigate();
  const [feedbackText, setFeedbackText] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "success",
  });
  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleSubmit = () => {
    if (feedbackText.trim() === "") {
      setAlertMsg({
        message: "Please enter your feedback before submitting.",
        severity: "warning",
      });
    } else {
      setAlertMsg({
        message: "Feedback submitted successfully!",
        severity: "success",
      });
      setFeedbackText(""); // Clear the input field
    }

    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  return (
    <Mobile>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      // anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={alertMsg.severity}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }}
        >
          {alertMsg.message}
        </MuiAlert>
      </Snackbar>
      <Container
        disableGutters
        maxWidth="xs"
        sx={{
          bgcolor: "#232626",
          height: "100vh",
          maxWidth: "100vw", // Set the maxWidth to 100vw to handle viewport width
          display: "flex",
          flexDirection: "column",
        }}
      >
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
              onClick={handleBackClick}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ color: "#ffffff", textAlign: "center", fontSize: "19px" }}
            >
              Feedback
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ p: 2, flexGrow: 1, background: "#232626" }}>
          <TextField
            fullWidth
            multiline
            rows={20} // Increase the number of rows for a taller TextField
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Welcome to feedback, please give feedback - please describe the problem in detail when providing feedback, preferably attach a screenshot of the problem you encountered, we will immediately process your feedback!"
            variant="outlined"
            InputProps={{
              sx: {
                bgcolor: "#323738",
                borderRadius: 2,
                textAlign: "center",
                lineHeight: "1.3",
                padding: "15px",
                alignItems: "center",
                border: "none",
                color: "white",
                fontSize: "12px",
                "& textarea": {
                  textAlign: "left",
                  "&::placeholder": {
                    color: "#B3BEC1", // Set placeholder color to white
                  },
                },
                "& fieldset": {
                  border: "none",
                },
              },
            }}
            sx={{ mb: 2, width: "100%", maxWidth: "600px" }} // You can adjust the maxWidth as needed
          />
          <Box sx={{ textAlign: "center", my: 2, color: "#ffffff" }}>
            <Typography variant="body1" fontSize={"15px"}>
              Send helpful feedback
            </Typography>

            <Typography variant="body1" fontSize={"15px"}>
              Chance to win Mystery Rewards
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: "20px" }}>
            <Box
              component="img"
              src="../assets/account/feedback.webp"
              alt="Feedback rewards"
              sx={{ width: "60%", height: "auto" }}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{
              background: "linear-gradient(90deg,#24ee89,#9fe871)",
              color: "black",
              mt: "30px",
              // mb:"30px",
              borderRadius: "50px",
              border: "none",
              boxShadow: "none",
              padding: "10px 20px",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#ffc700",
                border: "none",
              },
              "&:focus": {
                outline: "none",
                border: "none",
              },
              "&:active": {
                bgcolor: "#ffc700",
                border: "none",
                outline: "none",
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Container>
    </Mobile>
  );
};

export default Feedback;
