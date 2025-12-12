import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    LinearProgress,
    Snackbar,
    Alert, Grid
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { domain } from "../../utils/Secret";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
const WinningStreakTabs = () => {
    const [selectedGame, setSelectedGame] = useState("All");
    const [eligibilityData, setEligibilityData] = useState(null);
    const [filteredGames, setFilteredGames] = useState([]);
    const [claimedRules, setClaimedRules] = useState([]);
    const [isClaiming, setIsClaiming] = useState(false);
    const { axiosInstance } = useAuth();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const fetchEligibilityData = async () => {
        try {
            const response = await axiosInstance.get(
                `${domain}/api/activity/winning-streak/eligibility`,
                { withCredentials: true }
            );

            if (response.data && response.data.eligibility) {
                const data = response.data.eligibility.data;
                setEligibilityData(data);

                // Initialize claimed rules from existing claims
                if (data.hasExistingClaim) {
                    const claims = data.overallSummary?.eligibleRulesSummary || [];
                    setClaimedRules(claims.map(rule => rule.ruleId));
                }

                filterGames(data, "All");
            }
        } catch (error) {
            console.error("Error fetching eligibility:", error);
        }
    };

    useEffect(() => {
        fetchEligibilityData();
    }, []);

    const filterGames = (data, gameType) => {
        if (!data?.gameEligibility) return;

        if (gameType === "All") {
            // Show games with ongoing streaks
            const ongoingGames = data.gameEligibility.filter(
                game => game.currentStreak > 0
            );
            setFilteredGames(ongoingGames);
        } else {
            // Filter by specific game type
            const filtered = data.gameEligibility.filter(
                game => game.gameType === gameType
            );
            setFilteredGames(filtered);
        }
    };

    const handleTabChange = (event, newValue) => {
        setSelectedGame(newValue);
        filterGames(eligibilityData, newValue);
    };

    const showSnackbar = (message, severity = "info") => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleClaim = async (ruleId, gameType) => {
        if (!ruleId || !gameType) {
            showSnackbar("Invalid claim request", "error");
            return;
        }

        if (isClaiming) return;
        setIsClaiming(true);

        try {
            const response = await axiosInstance.post(
                `${domain}/api/activity/winning-streak/claim`,
                { ruleId, gameType },
                { withCredentials: true }
            );

            if (response.data?.success) {
                showSnackbar("Bonus claimed successfully!", "success");
                // Add to claimed rules
                setClaimedRules(prev => [...prev, ruleId]);
                // Refresh data
                await fetchEligibilityData();
            } else {
                showSnackbar(
                    response.data?.message || "Failed to claim bonus",
                    "error"
                );
            }
        } catch (error) {
            console.error("Claim error:", error);
            const errorMsg = error.response?.data?.message ||
                "Failed to claim bonus. Please try again.";
            showSnackbar(errorMsg, "error");
        } finally {
            setIsClaiming(false);
        }
    };

    const getGameIcon = (gameType) => {
        switch (gameType) {
            case "WINGO": return "/assets/winningStreak/wingo.svg";
            case "CAR_RACE": return "/assets/winningStreak/racing.svg";
            case "K3": return "/assets/winningStreak/k3.svg";
            case "FIVED": return "/assets/winningStreak/5D.svg";
            default: return "/assets/winningStreak/All.svg";
        }
    };

    const renderWinningStreakRule = (game, rule, index) => {
        const progressPercentage = Math.min(
            (rule.currentStreak / rule.requiredStreak) * 100,
            100
        );
        //console.log("rule", rule);
        const progressText = `${rule.currentStreak}/${rule.requiredStreak}`;
        const bonusAmount = rule.potentialBonus || 0;
        const isClaimed = claimedRules.includes(rule.ruleId);
        const canClaim = rule.eligible && !isClaimed &&
            eligibilityData?.canClaim &&
            !isClaiming;

        return (
            <Card
                key={`${game.gameType}-${rule.ruleId}-${index}`}
                sx={{
                    backgroundColor: "#323738",
                    color: "#FFFFFF",
                    borderRadius: 3,
                    boxShadow: "none",
                    mb: 2,
                }}
            >
                <CardContent sx={{ padding: 2, position: "relative" }}>
                    <Box sx={{ mb: 2.5 }}>
                        <Typography variant="h6" sx={{ fontSize: 15, color: "#FDE4BC", mb: 1, textAlign: "left" }}>
                            Current Winning Streak
                        </Typography>

                        <Box
                            sx={{
                                position: "absolute",
                                top: 16,
                                right: 16,
                                width: 33,
                                height: 33,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <img
                                src={getGameIcon(game.gameType)}
                                alt={game.gameType}
                                style={{ width: "100%" }}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2" sx={{ color: "#B79C8B", fontSize: 12 }}>
                            {Math.min(progressPercentage, 100).toFixed(2)}% completion
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#B79C8B", fontSize: 12 }}>
                            {progressText}
                        </Typography>
                    </Box>

                    <LinearProgress
                        variant="determinate"
                        value={Math.min(progressPercentage, 100)}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            mb: 2,
                            backgroundColor: "#6b4000",
                            "& .MuiLinearProgress-bar": {
                                background: "#FED358",
                            },
                        }}
                    />

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                            <Typography variant="body2" sx={{ color: "#B79C8B", mb: 0.5 }}>
                                Reward -
                                <Typography component="span" sx={{ color: "#FF5722", fontWeight: "bold", ml: 1 }}>
                                    ₹{bonusAmount.toFixed(2)}
                                </Typography>
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            sx={{
                                background: canClaim
                                    ? "linear-gradient(90deg,#24ee89,#9fe871)"
                                    : "#555",
                                color: "#ffffff",
                                borderRadius: 3,
                                textTransform: "none",
                                fontWeight: "bold",
                                "&:hover": {
                                    bgcolor: canClaim ? "#FF7D00" : "#555",
                                },
                                minWidth: 100,
                                "&:disabled": {
                                    bgcolor: "#4c4b4b",
                                    color:""
                                }
                            }}
                            onClick={() => handleClaim(rule.ruleId, game.gameType)}
                            disabled={!canClaim}
                        >
                            {isClaimed ? "Claimed" : "Claim"}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    const renderWinningStreakCards = (game) => {
        if (!game.rulesProgress?.length) return null;

        if (selectedGame === "All") {
            // For "All" tab, show the highest eligible rule or the closest to completion
            const sortedRules = [...game.rulesProgress].sort((a, b) => {
                if (a.eligible && !b.eligible) return -1;
                if (!a.eligible && b.eligible) return 1;
                return (b.currentStreak / b.requiredStreak) - (a.currentStreak / a.requiredStreak);
            });
            return renderWinningStreakRule(game, sortedRules[0], 0);
        } else {
            // For specific game tabs, show all rules sorted by requirement
            return [...game.rulesProgress]
                .sort((a, b) => a.requiredStreak - b.requiredStreak)
                .map((rule, idx) => renderWinningStreakRule(game, rule, idx));
        }
    };

    const tabOptions = [
        { value: "All", label: "All", img: "/assets/icons/all-unselected.svg" },
        { value: "WINGO", label: "Wingo", img: "/assets/winningStreak/wingo.svg" },
        { value: "CAR_RACE", label: "Racing", img: "/assets/winningStreak/racing.svg" },
        { value: "K3", label: "K3", img: "/assets/winningStreak/k3.svg" },
        { value: "FIVED", label: "5D", img: "/assets/winningStreak/5D.svg" }
    ];
    useEffect(() => {
        if (snackbar.open) {
            const timer = setTimeout(() => {
                setSnackbar((prev) => ({ ...prev, open: false }));
            }, 3000); // Auto-close after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [snackbar.open]);
    return (
        <Container disableGutters maxWidth={false} sx={{ margin: 0, padding: 0, bgcolor: "#1A1A1A" }}>
            <Box sx={{ overflow: "hidden", bgcolor: "#1A1A1A" }}>
                {/* Game type tabs */}
                <Box
                    sx={{
                        display: "flex",
                        overflow: "auto",
                        mb: 2,
                        mx: 1,
                        "&::-webkit-scrollbar": { display: "none" },
                        scrollbarWidth: "none"
                    }}
                >
                    {tabOptions.map((tab) => (
                        <Box
                            key={tab.value}
                            onClick={() => handleTabChange(null, tab.value)}
                            sx={{
                                minWidth: 90,
                                height: 60,
                                mx: 1,
                                my: 1,
                                borderRadius: 2.5,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                background: selectedGame === tab.value
                                    ? "linear-gradient(90deg,#24ee89,#9fe871)"
                                    : "#323738",
                                color: selectedGame === tab.value?"#232626":"#FDE4BC",
                            }}
                        >
                            <Grid sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <img
                                    src={tab.img}
                                    alt={tab.label}
                                    style={{ width: 26 }}
                                /></Grid>
                            <Typography variant="body2">{tab.label}</Typography>
                        </Box>
                    ))}
                </Box>

                {/* Winning streak cards */}
                <Box sx={{ px: 1 }}>
                    {eligibilityData ? (
                        filteredGames.length > 0 ? (
                            filteredGames.map((game) => renderWinningStreakCards(game))
                        ) : (
                            <Box sx={{ pb: 4, pt: 8, textAlign: "center" }}>
                                <Typography sx={{ color: "#FDE4BC" }}>
                                    {selectedGame === "All"
                                        ? "No ongoing winning streaks"
                                        : `No streaks in ${selectedGame} game`}
                                </Typography>
                            </Box>
                        )
                    ) : (
                        <Box sx={{ pb: 4, pt: 8, textAlign: "center" }}>
                            <Typography sx={{ color: "#FDE4BC" }}>No rules found</Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar> */}

            <div>
                {/* Your existing component code */}

                {/* Popup Notification */}
                {snackbar.open && (
                    <Box
                        sx={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            ...(isSmallScreen && { width: "70%" }),
                            transform: "translate(-50%, -50%)",
                            bgcolor: "rgba(0, 0, 0, 0.9)",
                            color: "white",
                            padding: "20px 30px",
                            borderRadius: "10px",
                            zIndex: 1000,
                            animation: "fadeIn 0.5s ease",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px"
                        }}
                    >
                        {/* Checkmark/Success Icon */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {snackbar.severity === "success" ? (
                                // Success Icon
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 22 22"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M8.53125 15.3125L4.03125 10.8125L5.28125 9.5625L8.53125 12.8125L16.7188 4.625L17.9688 5.875L8.53125 15.3125Z"
                                        fill="#4CAF50"
                                    />
                                </svg>
                            ) : (
                                // Error Icon
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 22 22"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M11 0.6875C5.15625 0.6875 0.6875 5.15625 0.6875 11C0.6875 16.8438 5.15625 21.3125 11 21.3125C16.8438 21.3125 21.3125 16.8438 21.3125 11C21.3125 5.15625 16.8438 0.6875 11 0.6875ZM11 19.3125C6.1875 19.3125 2.6875 15.8125 2.6875 11C2.6875 6.1875 6.1875 2.6875 11 2.6875C15.8125 2.6875 19.3125 6.1875 19.3125 11C19.3125 15.8125 15.8125 19.3125 11 19.3125ZM11 6.6875C10.5625 6.6875 10.1875 7.0625 10.1875 7.5V11C10.1875 11.4375 10.5625 11.8125 11 11.8125C11.4375 11.8125 11.8125 11.4375 11.8125 11V7.5C11.8125 7.0625 11.4375 6.6875 11 6.6875ZM11 14.1875C10.5625 14.1875 10.1875 14.5625 10.1875 15C10.1875 15.4375 10.5625 15.8125 11 15.8125C11.4375 15.8125 11.8125 15.4375 11.8125 15C11.8125 14.5625 11.4375 14.1875 11 14.1875Z"
                                        fill="#F44336"
                                    />
                                </svg>
                            )}
                        </Box>
                        <Typography variant="body1" sx={{ fontSize: "13px" }}>
                            {snackbar.message}
                        </Typography>
                    </Box>
                )}

                {/* Add keyframes for fade-in animation */}
                <style jsx>{`
                      @keyframes fadeIn {
                        from {
                          opacity: 0;
                        }
                        to {
                          opacity: 1;
                        }
                      }
                    `}</style>
            </div>
        </Container>
    );
};

export default WinningStreakTabs;