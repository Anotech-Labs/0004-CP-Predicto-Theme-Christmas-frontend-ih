import React from "react"
import Mobile from "../../../components/layout/Mobile";
import {
  AppBar,
  Box,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom"

const ActivityRules = () => {
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate(-1)
  }
  return (
    <Mobile>
        <Grid
            item
            container
            alignItems="center"
            justifyContent="center"
            sx={{ bgcolor: "#232626", py: 0.8 }} // Background color for the header
          >
            <Grid item xs={2}>
              <IconButton
                sx={{ color: "#FDE4BC", ml: -2 }} // #323738 color for the icon
                onClick={handleBackClick}
              >
                <ArrowBackIosNewIcon sx={{ fontSize:"19px"}}/>
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <Typography
                variant="h6"
                sx={{
                  color: "#FDE4BC", // #323738 color for the text
                  flexGrow: 1,
                  textAlign: "center",
                  mr: 8,
                   fontSize:"19px"
                }}
              >
                Activity Rules
              </Typography>
            </Grid>
          </Grid>
      <Box sx={{ mx: 2, mt: 2 }}>
        <Box
          sx={{
            backgroundColor: "#323738",
            color: "#B79C8B",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            textAlign: "left",
            maxWidth: "100%",
            marginBottom: "26px",
          }}
        >
          <Box
            sx={{
              bgcolor: "#382e35",
              py: 0.5,
              maxWidth: 100,
              margin: "0 auto",
              px: 2,
              textAlign: "center",
              borderBottomLeftRadius: "50px",
              borderBottomRightRadius: "50px",
              color: "#FDE4BC",
              fontWeight: "bold",
            }}
          >
            01
          </Box>
          <Typography
            variant="body1"
            sx={{ color: "#FDE4BC", my: 1, mx: 2, fontSize: "12.6px" }}
          >
            The event is effective from now on. The discount can only be used
            once per address, per email address, per phone number and for the
            same payment method (debit/credit card/bank account) and IP address;
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#B79C8B", mx: 2, pb:2, fontSize: "12.6px" }}
          >
            If a member applies repeatedly, the company reserves the right to
            cancel or withdraw member bonuses.
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "#323738",
            color: "#FDE4BC",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            textAlign: "left",
            maxWidth: "100%",
            marginBottom: "26px",
          }}
        >
          <Box
            sx={{
              bgcolor: "#382e35",
              py: 0.5,
              maxWidth: 100,
              margin: "0 auto",
              px: 2,
              textAlign: "center",
              borderBottomLeftRadius: "50px",
              borderBottomRightRadius: "50px",
              color: "#FDE4BC",
              fontWeight: "bold",
            }}
          >
            02
          </Box>
          <Typography
            variant="body1"
            sx={{ color: "#FDE4BC", my: 1, mx: 2, fontSize: "12.6px" }}
          >
            All offers are specially designed for players.
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#B79C8B", mx: 2,pb:2, fontSize: "12.6px" }}
          >
            If any group or individual is found to be dishonestly withdrawing
            bonuses or threatening or abusing company offers, the company
            reserves the right to freeze or cancel the account and account
            balance of that group or individual.
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "#323738",
            color: "#FDE4BC",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            textAlign: "left",
            maxWidth: "100%",
            marginBottom: "16px",
          }}
        >
          <Box
            sx={{
              bgcolor: "#382e35",
              py: 0.5,
              maxWidth: 100,
              margin: "0 auto",
              px: 2,
              textAlign: "center",
              borderBottomLeftRadius: "50px",
              borderBottomRightRadius: "50px",
              color: "#FDE4BC",
              fontWeight: "bold",
            }}
          >
            03
          </Box>
          <Typography
            variant="body1"
            sx={{ color: "#FDE4BC", my: 1, mx: 2, fontSize: "12.6px" }}
          >
            The platform reserves the right of final outcome of this event;
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#B79C8B", mx: 2, pb:2, fontSize: "12.6px" }}
          >
            and the right to modify or terminate the campaign without prior notice; these terms apply to all offers.
          </Typography>
        </Box>
      </Box>
    </Mobile>
  )
}

export default ActivityRules