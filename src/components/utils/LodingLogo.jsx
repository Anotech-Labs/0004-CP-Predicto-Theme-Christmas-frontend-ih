import React from "react";
import { CircularProgress, Box } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#0cc178", // MUI's default blue
//     },
//   },
// });

const LoadingLogo = () => {
  return (
    // <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 200,
            height: 200,
            borderRadius: "50%",
          }}
        >
          <CircularProgress
            size={150}
            thickness={1}
            sx={{
              color: () => "#24EE89",
            }}
          />
          <img
            src="/assets/logo/a_logo.webp"
            alt="logo"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "50%",
              height: "auto",
            }}
          />
        </Box>
      </Box>
    // </ThemeProvider>
  );
};

export default LoadingLogo;
