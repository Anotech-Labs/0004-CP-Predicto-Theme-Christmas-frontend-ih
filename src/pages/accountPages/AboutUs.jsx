import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import DescriptionIcon from "@mui/icons-material/Description";
import Mobile from "../../components/layout/Mobile";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Grid from "@mui/material/Grid";

const AboutUs = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <Mobile>
      <Container
        disableGutters
        maxWidth="xs"
        sx={{
          bgcolor: "#232626",
          height: "100vh",
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
                color: "#FDE4BC",
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
              sx={{ color: "#FDE4BC", textAlign: "center", fontSize: "19px" }}
            >
              About Us
            </Typography>
          </Grid>
        </Grid>

        {/* Placeholder for the image */}
        <Box>
          <Box
            component="img"
            src="../assets/account/aboutus.webp"
            alt="About us illustration"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        <List sx={{ flexGrow: 1, mx: "20px", borderRadius: "50px" }}>
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="go to">
                <ChevronRightIcon sx={{ fontSize: 30, color: "#FDE4BC" }} />
              </IconButton>
            }
            sx={{
              px: 1,
              py: 2,
              background: "#232626",
              borderBottom: "1px solid #3D363A",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: "auto", // Removes default min-width that causes extra spacing
                mr: 1, // Adds a slight margin-right for controlled spacing
              }}
            >
              <Box
                component="img"
                src="../assets/account/confidentialityagreement.svg"
                alt=""
                sx={{ width: "20px", height: "30px" }} // Adjust the size as needed
              />
            </ListItemIcon>
            <ListItemText
              primary="Confidentiality Agreement"
              sx={{
                color: "#FDE4BC",
                margin: 0, // Removes extra margin around the text
              }}
            />
          </ListItem>

          <Divider sx={{ mx: 2 }} />
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="go to">
                <ChevronRightIcon sx={{ fontSize: 30, color: "#FDE4BC" }} />
              </IconButton>
            }
            sx={{
              px: 1,
              py: 2,
              background: "110d14",
              borderBottom: "1px solid #3D363A",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: "auto", // Removes default min-width that causes extra spacing
                mr: 1, // Adds a slight margin-right for controlled spacing
              }}
            >
              <Box
                component="img"
                src="../assets/account/riskdisclosure.svg"
                alt=""
                sx={{ width: "20px", height: "30px" }} // Adjust the size as needed
              />
            </ListItemIcon>
            <ListItemText
              primary="Risk Disclosure Agreement"
              sx={{ color: "#FDE4BC", margin: 0 }}
            />
          </ListItem>
          <Divider sx={{ mx: 2 }} />
        </List>
      </Container>
    </Mobile>
  );
};

export default AboutUs;
