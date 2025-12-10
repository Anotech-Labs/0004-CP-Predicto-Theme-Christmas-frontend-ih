import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Mobile from "../components/layout/Mobile";
import BottomNavigationArea from "../components/common/BottomNavigation";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Snackbar,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  CardMedia,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  EmojiEvents as TrophyIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  MonetizationOn as PrizeIcon,
  PlayArrow as JoinIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  Star as StarIcon,
  Timeline as StatsIcon,
  Leaderboard as LeaderboardIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import LoadingLogo from "../components/utils/LodingLogo";

const Tournament = () => {
  const navigate = useNavigate();
  const { axiosInstance } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [myStats, setMyStats] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchActiveTournaments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/tournament/public/active");
      if (response.data.success) {
        const tournamentData = response.data.data || [];
        console.log("Raw tournament data:", tournamentData);
        
        // Remove duplicates based on tournament ID
        const uniqueTournaments = tournamentData.filter((tournament, index, self) => 
          index === self.findIndex(t => t.id === tournament.id)
        );
        
        console.log("Unique tournaments after deduplication:", uniqueTournaments);
        setTournaments(uniqueTournaments);
      }
    } catch (error) {
      showSnackbar("Failed to fetch tournaments", "error");
      console.error("Error fetching tournaments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyStats = async () => {
    try {
      const response = await axiosInstance.get("/api/tournament/my-stats");
      if (response.data.success) {
        const statsData = response.data.data || [];
        console.log("📊 My tournament stats:", statsData);
        setMyStats(statsData);
      } else {
        console.error("❌ Failed to fetch my stats:", response.data);
      }
    } catch (error) {
      console.error("❌ Error fetching my stats:", error);
    }
  };

  const fetchLeaderboard = async (tournamentId) => {
    try {
      const response = await axiosInstance.get(
        `/api/tournament/${tournamentId}/leaderboard/public`
      );
      if (response.data.success) {
        setLeaderboard(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    fetchActiveTournaments();
    fetchMyStats();
    
    // // Check for auto-join opportunities every 30 seconds
    // const autoJoinInterval = setInterval(() => {
    //   autoJoinTournaments();
    // }, 30000);

    // // Cleanup interval on unmount
    // return () => clearInterval(autoJoinInterval);
  }, []);

  const handleJoinTournament = async (tournamentId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`/api/tournament/${tournamentId}/join`);
      
      if (response.data.success) {
        showSnackbar("Successfully joined tournament!");
        // Refresh both tournaments and stats to update UI immediately
        await Promise.all([
          fetchActiveTournaments(),
          fetchMyStats()
        ]);
        setJoinDialogOpen(false);
      } else {
        // Handle validation errors returned with 200 status but success: false
        const errorMessage = response.data.error || "Failed to join tournament";
        const details = response.data.details;
        
        let detailedMessage = errorMessage;
        if (details) {
          if (details.userDeposits !== undefined && details.required !== undefined) {
            detailedMessage += ` (You have ₹${details.userDeposits}, need ₹${details.required})`;
          } else if (details.userBets !== undefined && details.required !== undefined) {
            detailedMessage += ` (You have ₹${details.userBets} bets, need ₹${details.required})`;
          }
        }
        
        showSnackbar(detailedMessage, "error");
      }
    } catch (error) {
      console.error("Join tournament error:", error);
      showSnackbar(error.response?.data?.error || "Failed to join tournament", "error");
    } finally {
      setLoading(false);
    }
  };

  const openViewDialog = (tournament) => {
    setSelectedTournament(tournament);
    fetchLeaderboard(tournament.id);
    setViewDialogOpen(true);
  };

  const openJoinDialog = (tournament) => {
    setSelectedTournament(tournament);
    setJoinDialogOpen(true);
  };

  // Auto-join eligible tournaments after user activity
  const autoJoinTournaments = async () => {
    try {
      console.log("🎯 Checking for auto-join eligible tournaments...");
      
      const response = await axiosInstance.post("/api/tournament/auto-join");
      
      if (response.data.success && response.data.joinedTournaments.length > 0) {
        console.log("✅ Auto-joined tournaments:", response.data.joinedTournaments);
        
        // Show success message
        const tournamentNames = response.data.joinedTournaments.map(t => t.tournamentName).join(", ");
        showSnackbar(`🎉 Auto-joined tournaments: ${tournamentNames}`, "success");
        
        // Refresh data to show updated participation status
        await Promise.all([
          fetchActiveTournaments(),
          fetchMyStats()
        ]);
      } else {
        console.log("ℹ️ No eligible tournaments for auto-join");
      }
    } catch (error) {
      console.error("❌ Auto-join error:", error);
      // Don't show error to user as this is a background operation
    }
  };

  const isParticipating = (tournamentId) => {
    // Check from myStats - this is the most reliable method
    const participating = myStats.some((stat) => stat.tournamentId === tournamentId);
    
    console.log(`🔍 Checking participation for tournament ${tournamentId}:`, {
      participating,
      myStatsCount: myStats.length,
      myStats: myStats.map(s => ({ tournamentId: s.tournamentId, score: s.totalScore })),
      checkingTournamentId: tournamentId
    });
    
    return participating;
  };

  const getMyRank = (tournamentId) => {
    const stat = myStats.find((s) => s.tournamentId === tournamentId);
    return stat?.currentRank || null;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
        >
          <Box flexGrow={1} sx={{ backgroundColor: "#f1f2f5" }}>
            {/* Header */}
            <Grid
              container
              alignItems="center"
              sx={{
                background: "linear-gradient(90deg, #6a1b17 0%, #f70208 100%)",
                padding: "16px",
                color: "white",
                position: "sticky",
                top: 0,
                zIndex: 1000,
              }}
            >
              <Grid item xs={2}>
                <IconButton
                  onClick={() => navigate("/activity")}
                  sx={{ color: "white", p: 0 }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Grid>
              <Grid item xs={8} textAlign="center">
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  🏆 Tournaments
                </Typography>
              </Grid>
              <Grid item xs={2}></Grid>
            </Grid>

            {/* Tournament Banner */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "20px",
                margin: "10px",
                borderRadius: "15px",
                color: "white",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"20\" cy=\"20\" r=\"2\" fill=\"%23ffffff\" opacity=\"0.1\"/><circle cx=\"80\" cy=\"30\" r=\"1.5\" fill=\"%23ffffff\" opacity=\"0.1\"/><circle cx=\"40\" cy=\"70\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/></svg>')",
                  pointerEvents: "none",
                },
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                🏆 RISE OF THE CHAMPIONS
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2, opacity: 0.9 }}>
                SEASON 2025 PARTICIPANT
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "25px",
                  px: 4,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.3)",
                  },
                }}
              >
                JOIN THE BATTLE NOW!
              </Button>
            </Box>

        {/* My Tournament Stats */}
        {myStats.length > 0 && (
          <Box sx={{ px: 1, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, px: 1, fontWeight: "bold" }}>
              My Tournament Activity
            </Typography>
            <Stack spacing={1}>
              {myStats.slice(0, 3).map((stat) => (
                <Card key={stat.id} sx={{ mx: 1 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      {stat.tournament?.name}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                      <Chip
                        label={`Rank #${stat.currentRank || "N/A"}`}
                        size="small"
                        color="primary"
                      />
                      <Typography variant="body2">
                        Score: {Number(stat.totalScore || 0).toLocaleString()}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        )}

            {/* Active Tournaments List */}
            <Box sx={{ px: 1, pb: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, px: 1, fontWeight: "bold" }}>
                Active Tournaments
              </Typography>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress size={40} />
                </Box>
              ) : tournaments.length === 0 ? (
                <Card sx={{ mx: 1, textAlign: "center", py: 4 }}>
                  <CardContent>
                    <TrophyIcon sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No Active Tournaments
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      Check back later for new tournaments!
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <Stack spacing={2} sx={{ px: 1 }}>
                  {tournaments.map((tournament) => (
                    <Card
                      key={tournament.id}
                      sx={{
                        borderRadius: "15px",
                        overflow: "hidden",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "16px" }}>
                            {tournament.name}
                          </Typography>
                          <Chip
                            label={tournament.status}
                            size="small"
                            color={tournament.status === "ACTIVE" ? "success" : "default"}
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {tournament.description}
                        </Typography>

                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Participants
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                              {tournament._count?.participants || 0}
                              {tournament.maxParticipants && `/${tournament.maxParticipants}`}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography variant="caption" color="text.secondary">
                              Prize Pool
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#f59e0b" }}>
                              ₹{Number(tournament.totalPrizePool || 0).toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>

                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ViewIcon />}
                            onClick={() => openViewDialog(tournament)}
                            sx={{ flex: 1 }}
                          >
                            View
                          </Button>
                          {!isParticipating(tournament.id) && (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<JoinIcon />}
                              onClick={() => openJoinDialog(tournament)}
                              sx={{ 
                                flex: 1,
                                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                                "&:hover": {
                                  background: "linear-gradient(45deg, #1976D2 30%, #0288D1 90%)",
                                }
                              }}
                            >
                              Join
                            </Button>
                          )}
                          {isParticipating(tournament.id) && (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<StarIcon />}
                              disabled
                              sx={{ 
                                flex: 1,
                                background: "linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)",
                                color: "white",
                                "&.Mui-disabled": {
                                  background: "linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)",
                                  color: "white",
                                }
                              }}
                            >
                              Joined - Rank #{getMyRank(tournament.id) || "N/A"}
                            </Button>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>

        {/* View Tournament Dialog */}
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6">{selectedTournament?.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Tournament Details & Leaderboard
                </Typography>
              </Box>
              <IconButton onClick={() => setViewDialogOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent dividers>
            {selectedTournament && (
              <Box>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Tournament Type
                    </Typography>
                    <Chip label={selectedTournament.type} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Status
                    </Typography>
                    <Chip
                      label={selectedTournament.status}
                      color={selectedTournament.status === "ACTIVE" ? "success" : "default"}
                    />
                  </Grid>
                </Grid>

                <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <LeaderboardIcon />
                  Leaderboard
                </Typography>

                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Rank</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Bets</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaderboard.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No leaderboard data yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        leaderboard.slice(0, 10).map((entry, index) => (
                          <TableRow key={entry.id}>
                            <TableCell>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                {index < 3 && (
                                  <StarIcon
                                    fontSize="small"
                                    sx={{
                                      color:
                                        index === 0
                                          ? "#FFD700"
                                          : index === 1
                                          ? "#C0C0C0"
                                          : "#CD7F32",
                                    }}
                                  />
                                )}
                                <Typography>#{entry.currentRank}</Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>{entry.user?.userName || `User ${entry.userId}`}</TableCell>
                            <TableCell>{Number(entry.totalScore).toLocaleString()}</TableCell>
                            <TableCell>₹{Number(entry.totalBets || 0).toLocaleString()}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Join Tournament Dialog */}
        <Dialog open={joinDialogOpen} onClose={() => setJoinDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Join Tournament</DialogTitle>
          <DialogContent>
            {selectedTournament && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {selectedTournament.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {selectedTournament.description}
                </Typography>

                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Requirements:</strong>
                    <br />
                    • Minimum Deposit: ₹{Number(selectedTournament.minimumDepositAmount).toLocaleString()}
                    <br />
                    • Minimum Bet: ₹{Number(selectedTournament.minimumBetAmount).toLocaleString()}
                  </Typography>
                </Alert>

                <Typography variant="body2">
                  Are you sure you want to join this tournament?
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setJoinDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => handleJoinTournament(selectedTournament?.id)}
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Join Tournament"}
            </Button>
          </DialogActions>
        </Dialog>

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
        </Box>
        <BottomNavigationArea />
      </Mobile>
    </>
  );
};

export default Tournament;
