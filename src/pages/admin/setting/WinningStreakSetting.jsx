import React, { useState, useEffect } from "react";
import {
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    Box,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Typography,
    styled,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Snackbar,
    Alert,
    Tooltip,
    InputAdornment,
    ThemeProvider,
    createTheme
} from "@mui/material";
import { Edit as EditIcon, Info as InfoIcon } from "lucide-react";
import { domain } from "../../../utils/Secret";
import { useAuth } from "../../../context/AuthContext";

// Dark theme matching admin panel
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
    },
    background: {
      default: '#1e293b',
      paper: '#334155',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
  },
});

const WinningStreakSetting = () => {
    const [streakRules, setStreakRules] = useState([]);
    const [winningNumber, setWinningNumber] = useState("");
    const [bonusPercentage, setBonusPercentage] = useState("");
    const [editingRule, setEditingRule] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [errors, setErrors] = useState({ winningNumber: "", bonusPercentage: "" });

    const { axiosInstance } = useAuth();

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    const fetchStreakRules = async () => {
        try {
            const response = await axiosInstance.get(`${domain}/api/activity/winning-streak/rules`, {
                withCredentials: true,
            });
            setStreakRules(response.data.data);
        } catch (err) {
            showSnackbar("Failed to fetch winning streak rules", "error");
        }
    };

    useEffect(() => {
        fetchStreakRules();
    }, []);

    const validate = (values) => {
        const errors = {};
        if (!values.winningNumber) {
            errors.winningNumber = "Consecutive wins number is required";
        } else if (isNaN(values.winningNumber) || values.winningNumber <= 0) {
            errors.winningNumber = "Please enter a valid positive number";
        }

        if (!values.bonusPercentage) {
            errors.bonusPercentage = "Bonus percentage is required";
        } else if (isNaN(values.bonusPercentage) || values.bonusPercentage <= 0 || values.bonusPercentage > 100) {
            errors.bonusPercentage = "Please enter a valid percentage between 0 and 100";
        }

        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validate({
            winningNumber,
            bonusPercentage
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await axiosInstance.post(
                `${domain}/api/activity/winning-streak/rules`,
                {
                    consecutiveWinningNumber: parseInt(winningNumber),
                    bonusPercentage: parseFloat(bonusPercentage)
                },
                { withCredentials: true }
            );
            showSnackbar("Winning streak rule added successfully");
            setWinningNumber("");
            setBonusPercentage("");
            fetchStreakRules();
        } catch (err) {
            showSnackbar("Failed to add winning streak rule", "error");
        }
    };

    const handleEdit = async () => {
        const validationErrors = validate({
            winningNumber: editingRule.consecutiveWinningNumber,
            bonusPercentage: editingRule.bonusPercentage
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await axiosInstance.put(
                `${domain}/api/activity/winning-streak/rules/${editingRule.id}`,
                {
                    consecutiveWinningNumber: parseInt(editingRule.consecutiveWinningNumber),
                    bonusPercentage: parseFloat(editingRule.bonusPercentage)
                },
                { withCredentials: true }
            );
            showSnackbar("Winning streak rule updated successfully");
            setIsEditDialogOpen(false);
            fetchStreakRules();
        } catch (err) {
            showSnackbar("Failed to update winning streak rule", "error");
        }
    };

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            color: "#f8fafc",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            fontWeight: 600,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
        "&:hover": {
            backgroundColor: theme.palette.action.selected,
        },
        "& td": {
            fontFamily: "Inter, sans-serif",
        },
    }));

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ 
              margin: "0 auto", 
              p: 3, 
              backgroundColor: 'rgba(15, 23, 42, 0.6)', 
              minHeight: '100vh',
              borderRadius: '16px',
              border: '1px solid rgba(148, 163, 184, 0.1)'
            }}>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              mb: 4,
              p: 3,
              background: 'linear-gradient(145deg, #334155 0%, rgba(99, 102, 241, 0.1) 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}>
                <Typography
                    variant="h4"
                    sx={{
                        color: "#f8fafc",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                    }}
                >
                    Winning Streak Settings
                </Typography>
                <Tooltip title="Configure bonus rewards for players who achieve consecutive wins">
                    <IconButton size="small" sx={{ ml: 1, color: '#f8fafc' }}>
                        <InfoIcon size={20} />
                    </IconButton>
                </Tooltip>
            </Box>

            <Paper elevation={3} sx={{ p: 3, mb: 4, background: 'linear-gradient(145deg, #334155 0%, rgba(99, 102, 241, 0.1) 100%)', border: '1px solid rgba(148, 163, 184, 0.2)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Consecutive Wins Required"
                                fullWidth
                                type="number"
                                value={winningNumber}
                                onChange={(e) => setWinningNumber(e.target.value)}
                                error={!!errors.winningNumber}
                                helperText={errors.winningNumber}
                                InputProps={{
                                    sx: { fontFamily: "Inter, sans-serif" }
                                }}
                                InputLabelProps={{
                                    sx: { fontFamily: "Inter, sans-serif" }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Bonus Percentage"
                                fullWidth
                                type="number"
                                value={bonusPercentage}
                                onChange={(e) => setBonusPercentage(e.target.value)}
                                error={!!errors.bonusPercentage}
                                helperText={errors.bonusPercentage}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    sx: { fontFamily: "Inter, sans-serif" }
                                }}
                                InputLabelProps={{
                                    sx: { fontFamily: "Inter, sans-serif" }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ display: "flex" }}>
                            <Button
                                variant="contained"
                                type="submit"
                                sx={{
                                    backgroundColor: "#6366f1",
                                    fontFamily: "Inter, sans-serif",
                                    "&:hover": {
                                        backgroundColor: "#818cf8"
                                    }
                                }}
                            >
                                Add Streak Rule
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, background: '#0e1527', border: '1px solid rgba(148, 163, 184, 0.2)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
                <Typography
                    variant="h5"
                    sx={{
                        mb: 3,
                        color: "#f8fafc",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600
                    }}
                >
                    Current Winning Streak Rules
                </Typography>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Consecutive Wins</StyledTableCell>
                                <StyledTableCell>Bonus Percentage</StyledTableCell>
                                <StyledTableCell align="right">Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {streakRules.length > 0 ? (
                                streakRules.map((rule) => (
                                    <StyledTableRow key={rule.id}>
                                        <StyledTableCell>{rule.consecutiveWinningNumber} wins</StyledTableCell>
                                        <StyledTableCell>{rule.bonusPercentage}%</StyledTableCell>
                                        <StyledTableCell align="right">
                                            <IconButton
                                                onClick={() => {
                                                    setEditingRule(rule);
                                                    setIsEditDialogOpen(true);
                                                }}
                                                size="small"
                                            >
                                                <EditIcon size={20} />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))
                            ) : (
                                <StyledTableRow>
                                    <StyledTableCell colSpan={3} align="center">
                                        No data available
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog
                open={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                PaperProps={{
                    sx: { 
                      fontFamily: "Inter, sans-serif",
                      background: '#0e1527',
                      border: '1px solid rgba(148, 163, 184, 0.2)'
                    }
                }}
            >
                <DialogTitle sx={{ fontFamily: "Inter, sans-serif", color: "#f8fafc" }}>
                    Edit Winning Streak Rule
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Consecutive Wins Required"
                                fullWidth
                                type="number"
                                value={editingRule?.consecutiveWinningNumber || ""}
                                onChange={(e) => setEditingRule({
                                    ...editingRule,
                                    consecutiveWinningNumber: e.target.value
                                })}
                                InputProps={{
                                    sx: { fontFamily: "Inter, sans-serif" }
                                }}
                                InputLabelProps={{
                                    sx: { fontFamily: "Inter, sans-serif" }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Bonus Percentage"
                                fullWidth
                                type="number"
                                value={editingRule?.bonusPercentage || ""}
                                onChange={(e) => setEditingRule({
                                    ...editingRule,
                                    bonusPercentage: e.target.value
                                })}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    sx: { fontFamily: "Inter, sans-serif" }
                                }}
                                InputLabelProps={{
                                    sx: { fontFamily: "Inter, sans-serif" }
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setIsEditDialogOpen(false)}
                        sx={{ fontFamily: "Inter, sans-serif" }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEdit}
                        variant="contained"
                        sx={{
                            backgroundColor: "#6366f1",
                            fontFamily: "Inter, sans-serif",
                            "&:hover": {
                                backgroundColor: "#818cf8"
                            }
                        }}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: "100%", fontFamily: "Inter, sans-serif" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
        </ThemeProvider>
    );
};

export default WinningStreakSetting;