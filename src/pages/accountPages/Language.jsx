import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { IconButton } from '@mui/material';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from "react-router-dom";
import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
const Language = () => {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = React.useState('en');

  const handleLanguageSelect = (lang) => {
    setSelectedLang(lang);
  };

  return (
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
              onClick={()=>navigate(-1)}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ color: "#FDE4BC", textAlign: "center", fontSize: "19px" }}
            >
              Language
            </Typography>
          </Grid>
        </Grid>

      <List sx={{ px: 2 }}>
        <ListItem
          onClick={() => handleLanguageSelect('en')}
          sx={{
            bgcolor: selectedLang === 'en'?'#323738':"#232626",
            borderRadius: '8px',
            mb: 1,
            borderBottom:"1px solid #3c3830",
            cursor: 'pointer',
          }}
        >
          <Box
            component="img"
            src="/assets/language/english.webp"
            alt="US Flag"
            sx={{ width: 24, height: 24, borderRadius: '50%', mr: 2 }}
          />
          <ListItemText 
            primary="English" 
            sx={{ color: '#FDE4BC' }}
          />
         <Checkbox
            checked={selectedLang === 'en'}
            // onClick={handleToggle} // Handle both check and uncheck
            icon={
              <RadioButtonUncheckedIcon
                sx={{
                  color: "#c8c9cc", // Unchecked color
                  fontSize: 22, // Adjust size
                }}
              />
            }
            checkedIcon={
              <CheckCircleIcon
                sx={{
                  color: "#fed358", // Checked color
                  fontSize: 22, // Slightly bigger for effect
                }}
              />
            }
          />
        </ListItem>

        <ListItem
          onClick={() => handleLanguageSelect('hi')}
          sx={{
            bgcolor: selectedLang === 'hi'?'#323738':"#232626",
            borderRadius: '8px',
            cursor: 'pointer',
            borderBottom:"1px solid #3c3830",
          }}
        >
          <Box
            component="img"
            src="/assets/language/hindi.webp"
            alt="Indian Flag"
            sx={{ width: 24, height: 24, borderRadius: '50%', mr: 2 }}
          />
          <ListItemText 
            primary="हिंदी" 
            sx={{ color: '#FDE4BC' }}
          />
          <Checkbox
            checked={selectedLang === 'hi'}
            // onClick={handleToggle} // Handle both check and uncheck
            icon={
              <RadioButtonUncheckedIcon
                sx={{
                  color: "#c8c9cc", // Unchecked color
                  fontSize: 22, // Adjust size
                }}
              />
            }
            checkedIcon={
              <CheckCircleIcon
                sx={{
                  color: "#fed358", // Checked color
                  fontSize: 22, // Slightly bigger for effect
                }}
              />
            }
          />
        </ListItem>
      </List>
    </Container>
  );
};

export default Language;