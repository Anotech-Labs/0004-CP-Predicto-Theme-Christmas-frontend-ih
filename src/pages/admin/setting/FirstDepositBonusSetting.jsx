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
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "lucide-react";
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
          color: '#f8fafc',
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
          },
        },
      },
    },
  },
});

const FirstDepositBonusSetting = () => {
  const [depositBonuses, setDepositBonuses] = useState([]);
  const [minimumDeposit, setMinimumDeposit] = useState("");
  const [bonus, setBonus] = useState("");
  const [editingBonus, setEditingBonus] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [errors, setErrors] = useState({ minimumDeposit: "", bonus: "" });

  const { axiosInstance } = useAuth();

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchDepositBonuses = async () => {
    try {
      const response = await axiosInstance.get(`${domain}/api/activity/deposit-bonus/rules`, {
        withCredentials: true,
      });
      setDepositBonuses(response.data[0].rules);
    } catch (err) {
      showSnackbar("Failed to fetch deposit bonuses", "error");
    }
  };

  useEffect(() => {
    fetchDepositBonuses();
  }, []);

  const validate = (values) => {
    const errors = {};
    if (!values.minimumDeposit) {
      errors.minimumDeposit = "Minimum Deposit is required";
    } else if (isNaN(values.minimumDeposit) || values.minimumDeposit <= 0) {
      errors.minimumDeposit = "Please enter a valid positive number";
    }

    if (!values.bonus) {
      errors.bonus = "Bonus is required";
    } else if (isNaN(values.bonus) || values.bonus <= 0) {
      errors.bonus = "Please enter a valid positive number";
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate({ minimumDeposit, bonus });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axiosInstance.post(
        `${domain}/api/activity/deposit-bonus/rules`,
        {
          depositType: "FIRST",
          depositAmount: parseFloat(minimumDeposit),
          bonusAmount: parseFloat(bonus)
        },
        { withCredentials: true }
      );
      showSnackbar("Deposit bonus added successfully");
      setMinimumDeposit("");
      setBonus("");
      fetchDepositBonuses();
    } catch (err) {
      showSnackbar("Failed to add deposit bonus", "error");
    }
  };

  const handleEdit = async () => {
    const validationErrors = validate({
      minimumDeposit: editingBonus.depositAmount,
      bonus: editingBonus.bonusAmount
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axiosInstance.put(
        `${domain}/api/activity/deposit-bonus/rules/${editingBonus.id}`,
        {
          depositAmount: parseFloat(editingBonus.depositAmount),
          bonusAmount: parseFloat(editingBonus.bonusAmount)
        },
        { withCredentials: true }
      );
      showSnackbar("Deposit bonus updated successfully");
      setIsEditDialogOpen(false);
      fetchDepositBonuses();
    } catch (err) {
      showSnackbar("Failed to update deposit bonus", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${domain}/api/activity/deposit-bonus/rules/${id}`, {
        withCredentials: true
      });
      showSnackbar("Deposit bonus deleted successfully");
      fetchDepositBonuses();
    } catch (err) {
      showSnackbar("Failed to delete deposit bonus", "error");
    }
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      color: theme.palette.common.white,
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
      <Box sx={{ margin: "0 auto", p: 3, backgroundColor: '#0f172a', minHeight: '100vh', borderRadius: '16px' }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          color: "#f8fafc",
          fontFamily: "Inter, sans-serif",
          fontWeight: 700
        }}
      >
        First Deposit Bonus Settings
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4, background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%) !important', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Minimum Deposit"
                fullWidth
                value={minimumDeposit}
                onChange={(e) => setMinimumDeposit(e.target.value)}
                error={!!errors.minimumDeposit}
                helperText={errors.minimumDeposit}
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
                label="Bonus Amount"
                fullWidth
                value={bonus}
                onChange={(e) => setBonus(e.target.value)}
                error={!!errors.bonus}
                helperText={errors.bonus}
                InputProps={{
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
                Add Bonus Rule
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%) !important', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            color: "#f8fafc",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600
          }}
        >
          Current Bonus Rules
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Minimum Deposit</StyledTableCell>
                <StyledTableCell>Bonus Amount</StyledTableCell>
                <StyledTableCell align="right">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {depositBonuses.map((bonus) => (
                <StyledTableRow key={bonus.id}>
                  <StyledTableCell>
                    {typeof bonus.depositAmount === 'number' ? bonus.depositAmount.toFixed(2) : bonus.depositAmount}
                  </StyledTableCell>
                  <StyledTableCell>
                    {typeof bonus.bonusAmount === 'number' ? bonus.bonusAmount.toFixed(2) : bonus.bonusAmount}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <IconButton
                      onClick={() => {
                        setEditingBonus(bonus);
                        setIsEditDialogOpen(true);
                      }}
                      size="small"
                    >
                      <EditIcon size={20} />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(bonus.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon size={20} />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
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
            background: '#0f172a',
            border: '1px solid rgba(148, 163, 184, 0.12)'
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: "Inter, sans-serif", color: "#f8fafc" }}>
          Edit Bonus Rule
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Minimum Deposit"
                fullWidth
                value={editingBonus?.depositAmount || ""}
                onChange={(e) => setEditingBonus({
                  ...editingBonus,
                  depositAmount: e.target.value
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
                label="Bonus Amount"
                fullWidth
                value={editingBonus?.bonusAmount || ""}
                onChange={(e) => setEditingBonus({
                  ...editingBonus,
                  bonusAmount: e.target.value
                })}
                InputProps={{
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

export default FirstDepositBonusSetting;