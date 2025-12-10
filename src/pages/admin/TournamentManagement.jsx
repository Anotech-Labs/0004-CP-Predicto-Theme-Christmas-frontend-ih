import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Box, Card, CardContent, Grid, Typography, Tabs, Tab, Button, FormControl,
  InputLabel, Select, MenuItem, Alert, Snackbar, ThemeProvider,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { theme, colors } from "./tournament/tournamentTheme";
import TournamentTable from "./tournament/TournamentTable";
import { CreateTournamentDialog, DisqualifyDialog } from "./tournament/TournamentDialogs";
import LeaderboardView from "./tournament/LeaderboardView";
import UserActivityTab from "./tournament/UserActivityTab";

const TournamentManagement = () => {
  const { axiosInstance } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTournaments, setTotalTournaments] = useState(0);
  const [leaderboardPage, setLeaderboardPage] = useState(0);
  const [leaderboardRowsPerPage, setLeaderboardRowsPerPage] = useState(20);
  const [totalLeaderboard, setTotalLeaderboard] = useState(0);

  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [disqualifyDialogOpen, setDisqualifyDialogOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [formData, setFormData] = useState({
    name: "", description: "", type: "BET_BASED", startDate: "", endDate: "",
    minimumDepositAmount: 0, minimumBetAmount: 0, maxParticipants: "",
    isPublic: true, includedGames: [],
    rewards: [{ rank: 1, rankLabel: "1st Place", rewardAmount: 1000 }],
  });

  const [disqualifyData, setDisqualifyData] = useState({ userId: null, reason: "" });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...(statusFilter && { status: statusFilter }),
        ...(typeFilter && { type: typeFilter }),
      };
      const response = await axiosInstance.get("/api/admin/tournament", { params });
      if (response.data.success) {
        setTournaments(response.data.data || []);
        setTotalTournaments(response.data.pagination?.total || 0);
      }
    } catch (error) {
      showSnackbar("Failed to fetch tournaments", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async (tournamentId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/admin/tournament/${tournamentId}/leaderboard`,
        { params: { page: leaderboardPage + 1, limit: leaderboardRowsPerPage } }
      );
      if (response.data.success) {
        setLeaderboard(response.data.data || []);
        setTotalLeaderboard(response.data.pagination?.total || 0);
      }
    } catch (error) {
      showSnackbar("Failed to fetch leaderboard", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [page, rowsPerPage, statusFilter, typeFilter]);

  useEffect(() => {
    if (selectedTournament) {
      fetchLeaderboard(selectedTournament.id);
    }
  }, [selectedTournament, leaderboardPage, leaderboardRowsPerPage]);

  const handleCreateTournament = async () => {
    try {
      setLoading(true);
      const payload = {
        ...formData,
        maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : undefined,
      };
      const response = await axiosInstance.post("/api/admin/tournament", payload);
      if (response.data.success) {
        showSnackbar("Tournament created successfully!");
        setCreateDialogOpen(false);
        fetchTournaments();
        resetForm();
      }
    } catch (error) {
      showSnackbar(error.response?.data?.error || "Failed to create tournament", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStartTournament = async (tournamentId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`/api/admin/tournament/${tournamentId}/start`);
      if (response.data.success) {
        showSnackbar("Tournament started successfully!");
        fetchTournaments();
      }
    } catch (error) {
      showSnackbar(error.response?.data?.error || "Failed to start tournament", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEndTournament = async (tournamentId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`/api/admin/tournament/${tournamentId}/end`);
      if (response.data.success) {
        showSnackbar("Tournament ended successfully!");
        fetchTournaments();
      }
    } catch (error) {
      showSnackbar(error.response?.data?.error || "Failed to end tournament", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTournament = async (tournamentId) => {
    if (!window.confirm("Are you sure you want to delete this tournament?")) return;
    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/api/admin/tournament/${tournamentId}`);
      if (response.data.success) {
        showSnackbar("Tournament deleted successfully!");
        fetchTournaments();
      }
    } catch (error) {
      showSnackbar(error.response?.data?.error || "Failed to delete tournament", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLeaderboard = async (tournamentId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/api/admin/tournament/${tournamentId}/update-leaderboard`
      );
      if (response.data.success) {
        showSnackbar("Leaderboard updated successfully!");
        fetchLeaderboard(tournamentId);
      }
    } catch (error) {
      showSnackbar(error.response?.data?.error || "Failed to update leaderboard", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDistributeRewards = async (tournamentId) => {
    if (!window.confirm("Distribute rewards? This cannot be undone.")) return;
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/api/admin/tournament/${tournamentId}/distribute-rewards`
      );
      if (response.data.success) {
        showSnackbar("Rewards distributed successfully!");
        fetchTournaments();
      }
    } catch (error) {
      showSnackbar(error.response?.data?.error || "Failed to distribute rewards", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDisqualifyParticipant = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/api/admin/tournament/${selectedTournament.id}/disqualify/${disqualifyData.userId}`,
        { reason: disqualifyData.reason }
      );
      if (response.data.success) {
        showSnackbar("Participant disqualified successfully!");
        setDisqualifyDialogOpen(false);
        fetchLeaderboard(selectedTournament.id);
        setDisqualifyData({ userId: null, reason: "" });
      }
    } catch (error) {
      showSnackbar(error.response?.data?.error || "Failed to disqualify participant", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "", description: "", type: "BET_BASED", startDate: "", endDate: "",
      minimumDepositAmount: 0, minimumBetAmount: 0, maxParticipants: "",
      isPublic: true, includedGames: [],
      rewards: [{ rank: 1, rankLabel: "1st Place", rewardAmount: 1000 }],
    });
  };

  const openViewDialog = (tournament) => {
    setSelectedTournament(tournament);
    setViewDialogOpen(true);
  };

  const openDisqualifyDialog = (userId) => {
    setDisqualifyData({ userId, reason: "" });
    setDisqualifyDialogOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", backgroundColor: colors.background.default, p: 3 }}>
        <Typography
          variant="h4"
          sx={{
            color: colors.text.primary,
            fontWeight: 700,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TrophyIcon sx={{ fontSize: 36, color: colors.primary }} />
          Tournament Management
        </Typography>

        <Card>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{ borderBottom: 1, borderColor: colors.border.light }}
          >
            <Tab label="Tournament List" />
            <Tab label="User Activity" />
          </Tabs>

          <CardContent>
            {currentTab === 0 && (
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Tournament List
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    Create Tournament
                  </Button>
                </Box>

                <Card sx={{ mb: 3, p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          label="Status"
                        >
                          <MenuItem value="">All</MenuItem>
                          <MenuItem value="DRAFT">Draft</MenuItem>
                          <MenuItem value="ACTIVE">Active</MenuItem>
                          <MenuItem value="ENDED">Ended</MenuItem>
                          <MenuItem value="CANCELLED">Cancelled</MenuItem>
                          <MenuItem value="COMPLETED">Completed</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                          label="Type"
                        >
                          <MenuItem value="">All</MenuItem>
                          <MenuItem value="BET_BASED">Bet Based</MenuItem>
                          <MenuItem value="DEPOSIT_BASED">Deposit Based</MenuItem>
                          <MenuItem value="WIN_BASED">Win Based</MenuItem>
                          <MenuItem value="MIXED">Mixed</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchTournaments}
                        sx={{ height: "56px" }}
                      >
                        Refresh
                      </Button>
                    </Grid>
                  </Grid>
                </Card>

                <TournamentTable
                  tournaments={tournaments}
                  loading={loading}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  totalTournaments={totalTournaments}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  onViewTournament={openViewDialog}
                  onStartTournament={handleStartTournament}
                  onEndTournament={handleEndTournament}
                  onDeleteTournament={handleDeleteTournament}
                  onDistributeRewards={handleDistributeRewards}
                />
              </Box>
            )}

            {currentTab === 1 && (
              <UserActivityTab axiosInstance={axiosInstance} showSnackbar={showSnackbar} />
            )}
          </CardContent>
        </Card>

        <CreateTournamentDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreateTournament}
          loading={loading}
        />

        <LeaderboardView
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          tournament={selectedTournament}
          leaderboard={leaderboard}
          loading={loading}
          page={leaderboardPage}
          rowsPerPage={leaderboardRowsPerPage}
          totalLeaderboard={totalLeaderboard}
          onPageChange={(e, newPage) => setLeaderboardPage(newPage)}
          onRowsPerPageChange={(e) => {
            setLeaderboardRowsPerPage(parseInt(e.target.value, 10));
            setLeaderboardPage(0);
          }}
          onUpdateLeaderboard={handleUpdateLeaderboard}
          onDisqualifyUser={openDisqualifyDialog}
        />

        <DisqualifyDialog
          open={disqualifyDialogOpen}
          onClose={() => setDisqualifyDialogOpen(false)}
          formData={disqualifyData}
          setFormData={setDisqualifyData}
          onSubmit={handleDisqualifyParticipant}
          loading={loading}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default TournamentManagement;
