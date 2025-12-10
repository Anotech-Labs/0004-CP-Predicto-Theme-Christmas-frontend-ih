import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Box,
    Typography,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Grid,
    Snackbar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    useTheme,
    Tooltip,
    Chip,
    Divider,
    Skeleton,
    ThemeProvider,
    createTheme,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { styled } from "@mui/material/styles";
import { domain } from "../../../utils/Secret";
import { useAuth } from "../../../context/AuthContext";

// Dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
  },
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          border: '1px solid rgba(148, 163, 184, 0.12)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
          color: '#f8fafc',
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
            },
          },
        },
      },
    },
  },
});

// Enhanced color system with consistent palette
const colorSystem = {
    primary: {
        main: "#6366f1",
        light: "#818cf8",
        dark: "#4f46e5",
        contrastText: "#ffffff"
    },
    secondary: {
        main: "#6366f1",
        light: "#818cf8",
        dark: "#4f46e5",
        contrastText: "#ffffff"
    },
    background: {
        default: "#0f172a",
        paper: "#1e293b",
        elevated: "#1e293b"
    },
    text: {
        primary: "#f8fafc",
        secondary: "#94a3b8",
        disabled: "#64748b"
    },
    border: {
        light: "rgba(148, 163, 184, 0.12)",
        main: "rgba(148, 163, 184, 0.2)",
        dark: "rgba(148, 163, 184, 0.3)"
    },
    status: {
        success: "#43a047",
        error: "#d32f2f",
        warning: "#f57c00",
        info: "#0288d1"
    },
    accent: {
        light: "#eef2ff",
        hover: "#f5f7ff"
    }
};

// Refined typography system with Inter font
const typography = {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    h1: {
        fontSize: "2.5rem",
        fontWeight: 700,
        letterSpacing: "-0.01562em",
        lineHeight: 1.2
    },
    h2: {
        fontSize: "2rem",
        fontWeight: 700,
        letterSpacing: "-0.00833em",
        lineHeight: 1.2
    },
    h3: {
        fontSize: "1.75rem",
        fontWeight: 700,
        letterSpacing: "0em",
        lineHeight: 1.2
    },
    h4: {
        fontSize: "1.5rem",
        fontWeight: 600,
        letterSpacing: "0.00735em",
        lineHeight: 1.2
    },
    h5: {
        fontSize: "1.25rem",
        fontWeight: 600,
        letterSpacing: "0em",
        lineHeight: 1.2
    },
    h6: {
        fontSize: "1rem",
        fontWeight: 600,
        letterSpacing: "0.0075em",
        lineHeight: 1.2
    },
    body1: {
        fontSize: "1rem",
        fontWeight: 400,
        letterSpacing: "0.00938em",
        lineHeight: 1.5
    },
    body2: {
        fontSize: "0.875rem",
        fontWeight: 400,
        letterSpacing: "0.01071em",
        lineHeight: 1.5
    },
    button: {
        fontSize: "0.875rem",
        fontWeight: 600,
        letterSpacing: "0.02857em",
        textTransform: "none",
        lineHeight: 1.75
    },
    caption: {
        fontSize: "0.75rem",
        fontWeight: 400,
        letterSpacing: "0.03333em",
        lineHeight: 1.5
    }
};

// Enhanced shadows system
const shadows = {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
};

// Refined TextField with consistent styling
const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        height: '56px',
        fontFamily: typography.fontFamily,
        fontSize: typography.body1.fontSize,
        backgroundColor: '#1e293b',
        transition: 'all 0.2s ease-in-out',
    },
    '& label': {
        fontFamily: typography.fontFamily,
        color: colorSystem.text.secondary,
        fontSize: typography.body2.fontSize,
        transform: 'translate(14px, 16px) scale(1)',
    },
    '& label.Mui-focused': {
        color: colorSystem.primary.main,
        transform: 'translate(14px, -9px) scale(0.75)',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: colorSystem.border.main,
            transition: 'all 0.2s ease-in-out',
        },
        '&:hover fieldset': {
            borderColor: colorSystem.border.dark,
        },
        '&.Mui-focused fieldset': {
            borderColor: colorSystem.primary.main,
            borderWidth: '2px',
        },
    },
    '& .MuiInputBase-inputMultiline': {
        padding: '16px 14px',
    },
    '& .MuiFormHelperText-root': {
        fontFamily: typography.fontFamily,
        fontSize: typography.caption.fontSize,
        marginTop: '4px',
    },
}));

// Enhanced FormControl with consistent styling
const StyledFormControl = styled(FormControl)(({ theme }) => ({
    '& .MuiInputBase-root': {
        height: '56px',
        fontFamily: typography.fontFamily,
        fontSize: typography.body1.fontSize,
        backgroundColor: colorSystem.background.paper,
    },
    '& label': {
        fontFamily: typography.fontFamily,
        color: colorSystem.text.secondary,
        fontSize: typography.body2.fontSize,
        transform: 'translate(14px, 16px) scale(1)',
    },
    '& label.Mui-focused': {
        color: colorSystem.primary.main,
        transform: 'translate(14px, -9px) scale(0.75)',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: colorSystem.border.main,
            transition: 'all 0.2s ease-in-out',
        },
        '&:hover fieldset': {
            borderColor: colorSystem.border.dark,
        },
        '&.Mui-focused fieldset': {
            borderColor: colorSystem.primary.main,
            borderWidth: '2px',
        },
    },
    '& .MuiSelect-select': {
        display: 'flex',
        alignItems: 'center',
        padding: '14px 16px',
    },
}));

// Refined TableContainer with improved styling
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: '8px',
    boxShadow: shadows.sm,
    border: `1px solid ${colorSystem.border.light}`,
    maxWidth: '100%',
    overflowX: 'auto',
    msOverflowStyle: 'none',  // Hide scrollbar for IE and Edge
    scrollbarWidth: 'none',  // Hide scrollbar for Firefox
    '&::-webkit-scrollbar': {  // Hide scrollbar for Chrome, Safari and Opera
        display: 'none'
    }
}));

// Enhanced TableCell with consistent styling
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        color: '#f8fafc',
        fontFamily: typography.fontFamily,
        fontSize: typography.body2.fontSize,
        fontWeight: typography.h6.fontWeight,
        padding: '16px',
        borderBottom: `2px solid ${colorSystem.border.main}`,
        whiteSpace: 'nowrap',
        height: '56px',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: typography.body2.fontSize,
        fontFamily: typography.fontFamily,
        color: colorSystem.text.secondary,
        padding: '16px',
        whiteSpace: "pre-wrap",
        maxWidth: "300px",
        overflowWrap: "break-word",
        height: '56px',
    },
}));

// Refined TableRow with improved hover effects
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: colorSystem.background.paper,
    },
    '&:nth-of-type(even)': {
        backgroundColor: colorSystem.background.default,
    },
    // '&:hover': {
    //     backgroundColor: colorSystem.accent.hover,
    //     transition: 'background-color 0.2s ease-in-out',
    // },
    '&:last-child td, &:last-child th': {
        borderBottom: 0,
    },
}));

// Enhanced ImportanceChip with consistent styling
const ImportanceChip = styled(Chip)(({ importance }) => {
    const getColor = (importance) => {
        switch (importance?.toUpperCase()) {
            case 'URGENT':
                return colorSystem.status.error;
            case 'HIGH':
                return colorSystem.status.warning;
            case 'MEDIUM':
                return colorSystem.status.info;
            case 'LOW':
            default:
                return colorSystem.status.success;
        }
    };

    return {
        backgroundColor: `${getColor(importance)}20`,
        color: getColor(importance),
        fontFamily: typography.fontFamily,
        fontWeight: 600,
        height: '24px',
        '& .MuiChip-label': {
            padding: '4px 8px',
            fontSize: typography.caption.fontSize,
        },
    };
});

// Refined SubmitButton with consistent styling
const SubmitButton = styled(Button)(({ theme }) => ({
    backgroundColor: colorSystem.primary.main,
    color: colorSystem.primary.contrastText,
    fontFamily: typography.fontFamily,
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
    padding: '8px 24px',
    height: '56px',
    borderRadius: '8px',
    boxShadow: shadows.sm,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: colorSystem.primary.dark,
        boxShadow: shadows.md,
    },
    '&:active': {
        backgroundColor: colorSystem.primary.dark,
        boxShadow: shadows.sm,
    },
    '&.Mui-disabled': {
        backgroundColor: colorSystem.text.disabled,
        color: colorSystem.background.paper,
    },
}));

// Enhanced DeleteButton with improved hover effects
const DeleteButton = styled(IconButton)(({ theme }) => ({
    color: colorSystem.text.secondary,
    transition: 'all 0.2s ease-in-out',
    width: '32px',
    height: '32px',
    '&:hover': {
        backgroundColor: `${colorSystem.status.error}20`,
        color: colorSystem.status.error,
    },
}));

function CreateNotifications() {
    // State management
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [importance, setImportance] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState("");
    const [errors, setErrors] = useState({
        title: "",
        message: "",
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const { axiosInstance } = useAuth();

    // Form validation
    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            title: "",
            message: "",
        };

        if (!title.trim()) {
            newErrors.title = "Title is required";
            isValid = false;
        }

        if (!message.trim()) {
            newErrors.message = "Message is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // API handlers
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const formData = {
            title: title.trim(),
            body: message.trim(),
            isGlobal: true,
            importance: importance,
            expirationType: "NEVER"
        };

        try {
            const response = await axiosInstance.post(
                `${domain}/api/notification`,
                formData,
                { withCredentials: true }
            );

            if (response.data.success) {
                setSnackbar({
                    open: true,
                    message: "Notification created successfully",
                    severity: "success",
                });
                setTitle("");
                setMessage("");
                setImportance("LOW");
                fetchNotifications();
            } else {
                throw new Error(response.data.message || "Failed to create notification");
            }
        } catch (error) {
            console.error("Error creating notification:", error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || "An error occurred while creating the notification",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                `${domain}/api/account/v1/notifications/global?page=1&limit=10`,
                { withCredentials: true }
            );

            if (response.data.success) {
                setNotifications(response.data.data.items);
            } else {
                throw new Error(response.data.message || "Failed to fetch notifications");
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || "An error occurred while fetching notifications",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (notificationId) => {
        setDeleteLoading(notificationId);
        try {
            const response = await axiosInstance.delete(
                `${domain}/api/notification/${notificationId}`,
                { withCredentials: true }
            );

            if (response.data.success) {
                setSnackbar({
                    open: true,
                    message: "Notification deleted successfully",
                    severity: "success",
                });
                setNotifications(notifications.filter(
                    (notification) => notification.id !== notificationId
                ));
            } else {
                throw new Error(response.data.message || "Failed to delete notification");
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || "An error occurred while deleting the notification",
                severity: "error",
            });
        } finally {
            setDeleteLoading("");
        }
    };

    // Effects
    useEffect(() => {
        fetchNotifications();
    }, []);

    // Render helpers
    const renderTableSkeleton = () => (
        <TableBody>
            {[...Array(5)].map((_, index) => (
                <StyledTableRow key={`skeleton-${index}`}>
                    {[...Array(7)].map((_, cellIndex) => (
                        <StyledTableCell key={`skeleton-cell-${cellIndex}`}>
                            <Skeleton animation="wave" height={24} />
                        </StyledTableCell>
                    ))}
                </StyledTableRow>
            ))}
        </TableBody>
    );

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{
                minHeight: "85vh",
                backgroundColor: colorSystem.background.default,
                py: { xs: 3, md: 4 },
                px: { xs: 2, md: 4 },
            }}>
                {/* Create Notification Section */}
                <Paper
                    elevation={0}
                    sx={{
                        border: `1px solid ${colorSystem.border.light}`,
                        borderRadius: 2,
                        overflow: 'hidden',
                        backgroundColor: colorSystem.background.paper,
                        boxShadow: shadows.sm,
                    }}
                >
                    <Box sx={{ p: { xs: 2, md: 4 } }}>
                        <Typography
                            variant="h5"
                            sx={{
                                color: colorSystem.text.primary,
                                fontFamily: typography.fontFamily,
                                ...typography.h5,
                                mb: 4,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            Create Notification
                            <Tooltip title="Create and send notifications to users" arrow>
                                <InfoOutlinedIcon
                                    sx={{
                                        fontSize: 20,
                                        color: colorSystem.text.secondary
                                    }}
                                />
                            </Tooltip>
                        </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ width: '100%' }}
                    >
                        <Grid
                            container
                            spacing={3} // Increased spacing
                            direction={{ xs: 'column', sm: 'row' }}
                            sx={{ mb: { xs: 2, md: 0 } }}
                        >
                            <Grid item xs={12} sm={12} md={6} lg={3}>
                                <StyledTextField
                                    required
                                    fullWidth
                                    label="Title"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        if (errors.title) {
                                            setErrors(prev => ({ ...prev, title: "" }));
                                        }
                                    }}
                                    error={!!errors.title}
                                    helperText={errors.title}
                                    disabled={loading}
                                    placeholder="Enter notification title"
                                    sx={{ mb: { xs: 2, sm: 0 } }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={3}>
                                <StyledFormControl
                                    fullWidth
                                    disabled={loading}
                                    sx={{ mb: { xs: 2, sm: 0 } }}
                                >
                                    <InputLabel id="importance-label" shrink>Importance</InputLabel>
                                    <Select
                                        labelId="importance-label"
                                        value={importance}
                                        onChange={(e) => setImportance(e.target.value)}
                                        label="Importance"
                                        notched // Ensures the label is properly aligned
                                    >
                                        <MenuItem value="LOW">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <ImportanceChip label="Low" importance="LOW" size="small" />
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="MEDIUM">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <ImportanceChip label="Medium" importance="MEDIUM" size="small" />
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="HIGH">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <ImportanceChip label="High" importance="HIGH" size="small" />
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="URGENT">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <ImportanceChip label="Urgent" importance="URGENT" size="small" />
                                            </Box>
                                        </MenuItem>
                                    </Select>
                                </StyledFormControl>
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4}>
                                <StyledTextField
                                    required
                                    fullWidth
                                    label="Message"
                                    value={message}
                                    onChange={(e) => {
                                        setMessage(e.target.value);
                                        if (errors.message) {
                                            setErrors(prev => ({ ...prev, message: "" }));
                                        }
                                    }}
                                    error={!!errors.message}
                                    helperText={errors.message}
                                    multiline
                                    rows={1}
                                    disabled={loading}
                                    placeholder="Enter notification message"
                                    sx={{ mb: { xs: 2, sm: 0 } }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={2}>
                                <SubmitButton
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    startIcon={loading && (
                                        <CircularProgress size={20} color="inherit" />
                                    )}
                                    sx={{ height: '56px' }}
                                >
                                    {loading ? 'Creating...' : 'Create'}
                                </SubmitButton>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Paper>

            {/* Notifications Table Section */}
            <Paper
                elevation={0}
                sx={{
                    mt: 4,
                    border: `1px solid ${colorSystem.border.light}`,
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: colorSystem.background.paper,
                    boxShadow: shadows.sm,
                }}
            >
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    <Typography
                        variant="h5"
                        sx={{
                            color: colorSystem.text.primary,
                            fontFamily: typography.fontFamily,
                            ...typography.h5,
                            mb: 4,
                        }}
                    >
                        Notification History
                    </Typography>

                    <StyledTableContainer>
                        <Table aria-label="notifications table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>No.</StyledTableCell>
                                    <StyledTableCell>Title</StyledTableCell>
                                    <StyledTableCell>Message</StyledTableCell>
                                    <StyledTableCell>Type</StyledTableCell>
                                    <StyledTableCell>Date</StyledTableCell>
                                    <StyledTableCell>Importance</StyledTableCell>
                                    <StyledTableCell align="center">Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            {loading ? (
                                renderTableSkeleton()
                            ) : (
                                <TableBody>
                                    {notifications.length === 0 ? (
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={7} align="center">
                                                <Box sx={{
                                                    py: 4,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}>
                                                    <ErrorOutlineIcon
                                                        sx={{
                                                            fontSize: 48,
                                                            color: colorSystem.text.secondary,
                                                            mb: 1,
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            color: colorSystem.text.primary,
                                                            fontFamily: typography.fontFamily,
                                                            ...typography.h6,
                                                        }}
                                                    >
                                                        No notifications found
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: colorSystem.text.secondary,
                                                            fontFamily: typography.fontFamily,
                                                            ...typography.body2,
                                                        }}
                                                    >
                                                        Create a new notification to get started
                                                    </Typography>
                                                </Box>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ) : (
                                        notifications.map((notification, index) => (
                                            <StyledTableRow key={notification.id}>
                                                <StyledTableCell>{index + 1}</StyledTableCell>
                                                <StyledTableCell>{notification.title}</StyledTableCell>
                                                <StyledTableCell>{notification.body}</StyledTableCell>
                                                <StyledTableCell>
                                                    <Chip
                                                        label={notification.isGlobal ? "Global" : "User-specific"}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: notification.isGlobal
                                                                ? `${colorSystem.primary.main}20`
                                                                : `${colorSystem.secondary.main}20`,
                                                            color: notification.isGlobal
                                                                ? colorSystem.primary.main
                                                                : colorSystem.secondary.main,
                                                            fontWeight: 600,
                                                            fontFamily: typography.fontFamily,
                                                        }}
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <ImportanceChip
                                                        label={notification.importance}
                                                        importance={notification.importance}
                                                        size="small"
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Tooltip title="Delete notification" arrow>
                                                        <DeleteButton
                                                            onClick={() => handleDelete(notification.id)}
                                                            disabled={deleteLoading === notification.id}
                                                        >
                                                            {deleteLoading === notification.id ? (
                                                                <CircularProgress size={20} />
                                                            ) : (
                                                                <DeleteIcon />
                                                            )}
                                                        </DeleteButton>
                                                    </Tooltip>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                    )}
                                </TableBody>
                            )}
                        </Table>
                    </StyledTableContainer>
                </Box>
            </Paper>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{
                        width: "100%",
                        fontFamily: typography.fontFamily,
                        ...typography.body2,
                    }}
                    elevation={6}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    </ThemeProvider>
    );
}

export default CreateNotifications;