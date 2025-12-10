import { createTheme, alpha } from "@mui/material";

export const colors = {
  primary: "#6366f1",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#06b6d4",
  purple: "#8b5cf6",
  background: {
    default: "#0f172a",
    paper: "#1e293b",
    card: "#1e293b",
  },
  text: {
    primary: "#f8fafc",
    secondary: "#94a3b8",
    disabled: "#64748b",
  },
  border: {
    light: "rgba(148, 163, 184, 0.12)",
  },
};

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    primary: { main: colors.primary },
    success: { main: colors.success },
    warning: { main: colors.warning },
    error: { main: colors.error },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: colors.background.card,
          border: `1px solid ${colors.border.light}`,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: colors.border.light,
        },
      },
    },
  },
});

export const getStatusColor = (status) => {
  switch (status) {
    case "ACTIVE":
      return colors.success;
    case "ENDED":
      return colors.info;
    case "DRAFT":
      return colors.warning;
    case "CANCELLED":
      return colors.error;
    case "COMPLETED":
      return colors.purple;
    default:
      return colors.text.secondary;
  }
};

export const availableGames = ["WINGO", "K3", "FIVED", "CAR_RACE", "CARD_GAME"];
