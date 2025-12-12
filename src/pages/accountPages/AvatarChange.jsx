import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import React, { useContext, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Mobile from "../../components/layout/Mobile";
import { useNavigate, useLocation } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { domain } from "../../utils/Secret"
import { useAuth } from '../../context/AuthContext';
import { UserContext } from '../../context/UserState';

const AvatarChange = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { axiosInstance } = useAuth()
  // Get the full user avatar URL from location.state (if passed)
  const fullUserAvatar = location.state?.avatar || null;

  // Extract only the file name (e.g., profile-5.webp) from the fullUserAvatar
  const userAvatarFile = fullUserAvatar
    ? fullUserAvatar.split("/").pop()
    : null;

  // Set user's current avatar as the default selected avatar (if available)
  const [selectedAvatar, setSelectedAvatar] = useState(userAvatarFile);
  const { getUserData, userData } = useContext(UserContext)

  const images = [
    "/assets/avatars/profile-1.webp",
    "/assets/avatars/profile-2.webp",
    "/assets/avatars/profile-3.webp",
    "/assets/avatars/profile-4.webp",
    "/assets/avatars/profile-5.webp",
    "/assets/avatars/profile-6.webp",
    "/assets/avatars/profile-7.webp",
    "/assets/avatars/profile-8.webp",
    "/assets/avatars/profile-9.webp",
    "/assets/avatars/profile-10.webp",
    "/assets/avatars/profile-11.webp",
    "/assets/avatars/profile-12.webp",
    "/assets/avatars/profile-13.webp",
    "/assets/avatars/profile-14.webp",
  ];

  const handleImageClick = async (imageUrl) => {
    //console.log("imageUrl:", imageUrl);
    
    const imageFileName = imageUrl.split("/").pop();
    try {
      const response = await axiosInstance.patch(
        `${domain}/api/account/v1/profile/users/${userData.uid}/avatar`,
        {
          avatar: `${imageFileName}`,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSelectedAvatar(imageFileName);
        //console.log("imageFileName:", imageFileName);
        getUserData() 
        // navigate(-1); // Navigate back after successful update

      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRedirect = () => {
    navigate(-1);
  };

  return (
    <>
      <Mobile>
        <Box
          sx={{
            bgcolor: "#232626",
            minHeight: "100vh",
            p: 0,
            maxWidth: "600px",
            mx: "auto",
          }}
        >
          {/* Header with Back Button */}
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
              onClick={handleRedirect}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ color: "#ffffff", textAlign: "center", fontSize: "19px" }}
            >
               Change Avatar
            </Typography>
          </Grid>
        </Grid>

          {/* Avatar Grid */}
          <Grid container spacing={2} sx={{ p: 2 }}>
            {images.map((image, index) => (
              <Grid item xs={4} key={index}>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border:
                      selectedAvatar === image.split("/").pop()
                        ? "4px solid #24ee89"
                        : "none", // Highlight selected avatar by file name
                    cursor: "pointer",
                  }}
                  onClick={() => handleImageClick(image)}
                >
                  <CardMedia
                    component="img"
                    image={image}
                    alt={`Avatar ${index + 1}`}
                    sx={{ width: "100%", height: "auto" }}
                  />
                  {selectedAvatar === image.split("/").pop() && (
                    <CheckCircleIcon
                      sx={{
                        position: "absolute",
                        bottom: 6,
                        right: 6,
                        color: "#24ee89",
                        fontSize: 22,
                        backgroundColor: "white",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Mobile>
    </>
  );
};

export default AvatarChange;
