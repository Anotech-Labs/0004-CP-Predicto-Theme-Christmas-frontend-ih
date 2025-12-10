import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    Typography,
    Container,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Alert,
    Snackbar,
    useTheme,
    alpha,
    ThemeProvider,
    createTheme,
} from "@mui/material";
import { Edit, Delete, Add, Warning } from "@mui/icons-material";
import axios from "axios";
import { domain } from "../../../utils/Secret";
import { useAuth } from "../../../context/AuthContext";
import { max } from "date-fns";

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
          color: '#f8fafc',
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
          },
        },
      },
    },
  },
});

axios.defaults.withCredentials = true;

const customColors = {
    primary: "#6366f1",
    secondary: "#8b5cf6",
    success: "#10B981",
    error: "#EF4444",
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f8fafc",
    border: "rgba(148, 163, 184, 0.12)",
};

const ActivityRewardSetting = () => {
    const theme = useTheme();
    const [settings, setSettings] = useState([]);
    const [formData, setFormData] = useState({
        minBettingAmount: "",
        activityAward: "",
        activityName: "",
        catagories: "DAILY",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [timeScopeToCategoryId, setTimeScopeToCategoryId] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const { axiosInstance } = useAuth();

    const fetchSettings = async () => {
        try {
            const response = await axiosInstance.get(`${domain}/api/activity/activity-award/categories`);
            const categoryMap = {};
            response.data.forEach((category) => {
                categoryMap[category.timeScope] = category.id;
            });
            setTimeScopeToCategoryId(categoryMap);

            const formattedSettings = response.data.flatMap((category) =>
                category.tasks.map((task) => ({
                    id: task.id,
                    name: task.name,
                    minBettingAmount: task.minBettingAmount,
                    bonusAmount: task.bonusAmount,
                    categoryName: category.name,
                    categoryType: category.timeScope,
                }))
            );
            setSettings(formattedSettings);
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to fetch settings",
                severity: "error",
            });
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSubmit = async () => {
        const categoryId = timeScopeToCategoryId[formData.catagories];
        const newSetting = {
            name: formData.activityName,
            categoryId,
            minBettingAmount: parseFloat(formData.minBettingAmount),
            bonusAmount: parseFloat(formData.activityAward),
        };

        try {
            if (isEditing) {
                await axiosInstance.put(`${domain}/api/activity/activity-award/tasks/${editingId}`, newSetting);
                setOpenEditDialog(false);
            } else {
                await axiosInstance.post(`${domain}/api/activity/activity-award/tasks`, newSetting);
            }
            setFormData({
                minBettingAmount: "",
                activityAward: "",
                activityName: "",
                catagories: "DAILY",
            });
            setIsEditing(false);
            setEditingId(null);
            fetchSettings();
            setSnackbar({
                open: true,
                message: `Successfully ${isEditing ? "updated" : "created"} activity reward`,
                severity: "success",
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: `Failed to ${isEditing ? "update" : "create"} activity reward`,
                severity: "error",
            });
        }
    };

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`${domain}/api/activity/activity-award/tasks/${deleteId}`);
            setDeleteId(null);
            setOpenDeleteDialog(false);
            fetchSettings();
            setSnackbar({
                open: true,
                message: "Successfully deleted activity reward",
                severity: "success",
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to delete activity reward",
                severity: "error",
            });
        }
    };

    const handleEdit = (setting) => {
        setFormData({
            minBettingAmount: setting.minBettingAmount,
            activityAward: setting.bonusAmount,
            activityName: setting.name,
            catagories: setting.categoryType,
        });
        setEditingId(setting.id);
        setIsEditing(true);
        setOpenEditDialog(true);
    };

    const filteredSettings = settings.filter(
        (setting) => setting.categoryType === formData.catagories
    );

    const commonStyles = {
        fontFamily: "Inter, sans-serif",
        maxWidth: "100%",
    };

    const inputStyles = {
        "& .MuiOutlinedInput-root": {
            ...commonStyles,
            height: "48px", // Adjusted height
            backgroundColor: customColors.surface,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
                backgroundColor: alpha(customColors.primary, 0.02),
            },
            "&.Mui-focused": {
                backgroundColor: customColors.surface,
                "& fieldset": {
                    borderColor: customColors.primary,
                    borderWidth: "2px",
                },
            },
        },
        "& .MuiOutlinedInput-input": {
            padding: "12px", // Adjusted padding
            height: "20px", // Adjusted height for input
        },
        "& .MuiInputLabel-root": {
            ...commonStyles,
            fontSize: "0.875rem",
            color: alpha(customColors.primary, 0.7),
            "&.Mui-focused": {
                color: customColors.primary,
            },
            transform: "translate(14px, 14px) scale(1)", // Adjusted initial position
            "&.MuiInputLabel-shrink": {
                transform: "translate(14px, -5px) scale(0.75)", // Adjusted shrunk label position
            },
        },
        "& .MuiMenuItem-root": {
            ...commonStyles,
        },
        marginBottom: "12px", // Adjusted margin
    };

    const selectStyles = {
        ...inputStyles,
        "& .MuiSelect-select": {
            ...commonStyles,
            fontSize: "0.875rem",
        },
    };
    return (
        <ThemeProvider theme={darkTheme}>
            <Container sx={{ minWidth: "100%", borderRadius: "16px", border: `1px solid ${customColors.border}`, py: 4, bgcolor: customColors.background, minHeight: "100vh" }}>
            <Box sx={{ mb: 5 }}>
                <Typography
                    variant="h5"
                    sx={{
                        ...commonStyles,
                        fontWeight: 700,
                        // color: customColors.primary,
                        mb: 1,
                        color:'#f8fafc'
                    }}
                >
                    Activity Reward Settings
                </Typography>
                <Typography
                    variant="body3"
                    sx={{
                        ...commonStyles,
                        color: alpha(customColors.text, 0.7),
                        // maxWidth: "600px",
                    }}
                >
                    Configure and manage activity-based rewards to incentivize user engagement and participation.
                </Typography>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    borderRadius: "16px",
                    border: `1px solid ${customColors.border}`,
                    overflow: "hidden",
                    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                }}
            >
                <Box sx={{ p: 3, borderBottom: `1px solid ${customColors.border}` }}>
                    <Stack direction="row" spacing={3} alignItems="center">
                        <FormControl sx={{ width: 240, ...selectStyles }}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={formData.catagories}
                                label="Category"
                                onChange={(e) => setFormData({ ...formData, catagories: e.target.value })}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            ...commonStyles,
                                            mt: 1,
                                            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                            "& .MuiMenuItem-root": {
                                                ...commonStyles,
                                                fontSize: "0.875rem",
                                                py: 1.5,
                                            },
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="DAILY">Daily Rewards</MenuItem>
                                <MenuItem value="WEEKLY">Weekly Rewards</MenuItem>
                                <MenuItem value="MONTHLY">Monthly Rewards</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setOpenEditDialog(true)}
                            sx={{
                                ...commonStyles,
                                height: "44px",
                                px: 4,
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                backgroundColor: customColors.primary,
                                "&:hover": {
                                    backgroundColor: alpha(customColors.primary, 0.9),
                                },
                                textTransform: "none",
                                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                            }}
                        >
                            Add New Reward
                        </Button>
                    </Stack>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {["Activity Name", "Min. Betting", "Award", "Category", "Actions"].map((header) => (
                                    <TableCell
                                        key={header}
                                        align={header === "Actions" ? "right" : "left"}
                                        sx={{
                                            py: 2,
                                            px: 3,
                                            backgroundColor: alpha(customColors.primary, 0.02),
                                            ...commonStyles,
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            color: customColors.primary,
                                            borderBottom: `1px solid ${customColors.border}`,
                                            letterSpacing: "0.05em",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSettings.map((setting) => (
                                <TableRow
                                    key={setting.id}
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: alpha(customColors.primary, 0.02),
                                        },
                                    }}
                                >
                                    <TableCell
                                        sx={{
                                            py: 2,
                                            px: 3,
                                            ...commonStyles,
                                            fontSize: "0.875rem",
                                            color: customColors.text,
                                        }}
                                    >
                                        {setting.name}
                                    </TableCell>
                                    <TableCell sx={{ ...commonStyles, fontSize: "0.875rem" }}>
                                        {setting.minBettingAmount}
                                    </TableCell>
                                    <TableCell sx={{ ...commonStyles, fontSize: "0.875rem" }}>
                                        {setting.bonusAmount}
                                    </TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                display: "inline-block",
                                                px: 2,
                                                py: 0.75,
                                                borderRadius: "6px",
                                                bgcolor: alpha(customColors.primary, 0.1),
                                                color: customColors.primary,
                                                ...commonStyles,
                                                fontSize: "0.75rem",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {setting.categoryType}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(setting)}
                                            sx={{
                                                color: customColors.primary,
                                                "&:hover": {
                                                    backgroundColor: alpha(customColors.primary, 0.1),
                                                },
                                            }}
                                        >
                                            <Edit sx={{ fontSize: 20 }} />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                setDeleteId(setting.id);
                                                setOpenDeleteDialog(true);
                                            }}
                                            sx={{
                                                color: customColors.error,
                                                ml: 1,
                                                "&:hover": {
                                                    backgroundColor: alpha(customColors.error, 0.1),
                                                },
                                            }}
                                        >
                                            <Delete sx={{ fontSize: 20 }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredSettings.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        align="center"
                                        sx={{
                                            py: 8,
                                            ...commonStyles,
                                            color: alpha(customColors.text, 0.5),
                                        }}
                                    >
                                        No rewards found for this category
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Edit/Create Dialog */}
            <Dialog
    open={openEditDialog}
    onClose={() => {
        setOpenEditDialog(false);
        setIsEditing(false);
        setFormData({
            minBettingAmount: "",
            activityAward: "",
            activityName: "",
            catagories: "DAILY",
        });
    }}
    maxWidth="sm"
    fullWidth
    PaperProps={{
        sx: {
            borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
            margin: "16px",
            width: "calc(100% - 32px)",
            maxWidth: "600px",
            padding: "16px", // Added padding to ensure space
        },
    }}
>
                <DialogTitle
                    sx={{
                        ...commonStyles,
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: customColors.primary,
                        pt: 3,
                        px: 3,
                        pb: 1,
                    }}
                >
                    {isEditing ? "Edit Activity Reward" : "Create New Activity Reward"}
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
    <Box component="form" noValidate autoComplete="off">
        <TextField
            fullWidth
            label="Activity Name"
            value={formData.activityName}
            onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
            sx={inputStyles}
            InputLabelProps={{
                shrink: true,
            }}
        />
        <TextField
            fullWidth
            label="Minimum Betting Amount"
            type="number"
            value={formData.minBettingAmount}
            onChange={(e) => setFormData({ ...formData, minBettingAmount: e.target.value })}
            sx={inputStyles}
            InputLabelProps={{
                shrink: true,
            }}
        />
        <TextField
            fullWidth
            label="Activity Award"
            type="number"
            value={formData.activityAward}
            onChange={(e) => setFormData({ ...formData, activityAward: e.target.value })}
            sx={inputStyles}
            InputLabelProps={{
                shrink: true,
            }}
        />
    </Box>
</DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button
                        onClick={() => {
                            setOpenEditDialog(false);
                            setIsEditing(false);
                            setFormData({
                                minBettingAmount: "",
                                activityAward: "",
                                activityName: "",
                                catagories: "DAILY",
                            });
                        }}
                        sx={{
                            ...commonStyles,
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: alpha(customColors.text, 0.7),
                            "&:hover": {
                                backgroundColor: alpha(customColors.text, 0.05),
                            },
                            px: 3,
                            py: 1,
                            mr: 1,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            ...commonStyles,
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            backgroundColor: customColors.primary,
                            "&:hover": {
                                backgroundColor: alpha(customColors.primary, 0.9),
                            },
                            boxShadow: "none",
                            textTransform: "none",
                            px: 3,
                            py: 1,
                        }}
                    >
                        {isEditing ? "Save Changes" : "Create Reward"}
                    </Button>
                </DialogActions>
            </Dialog>


            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        ...commonStyles,
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: customColors.error,
                        pt: 4,
                        px: 4,
                    }}
                >
                    Delete Reward
                </DialogTitle>
                <DialogContent sx={{ px: 4 }}>
                    <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mt: 2 }}>
                        <Warning sx={{ color: customColors.error, fontSize: 28 }} />
                        <Typography
                            sx={{
                                ...commonStyles,
                                color: alpha(customColors.text, 0.7),
                                fontSize: "0.875rem",
                                lineHeight: 1.6,
                            }}
                        >
                            Are you sure you want to delete this reward? This action cannot be undone and will permanently remove the reward from the system.
                        </Typography>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 4 }}>
                    <Button
                        onClick={() => setOpenDeleteDialog(false)}
                        sx={{
                            ...commonStyles,
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: alpha(customColors.text, 0.7),
                            "&:hover": {
                                backgroundColor: alpha(customColors.text, 0.05),
                            },
                            px: 3,
                            py: 1,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleDelete}
                        sx={{
                            ...commonStyles,
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            backgroundColor: customColors.error,
                            "&:hover": {
                                backgroundColor: alpha(customColors.error, 0.9),
                            },
                            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                            textTransform: "none",
                            px: 4,
                            py: 1,
                        }}
                    >
                        Delete Reward
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{
                        ...commonStyles,
                        backgroundColor:
                            snackbar.severity === "success" ? customColors.success : customColors.error,
                        color: customColors.surface,
                        "& .MuiAlert-icon": {
                            color: customColors.surface,
                        },
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        py: 1,
                        px: 2,
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
        </ThemeProvider>
    );
};

export default ActivityRewardSetting;