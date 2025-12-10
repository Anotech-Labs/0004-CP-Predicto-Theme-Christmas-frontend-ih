import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Paper,
    Typography,
    Card,
    CardContent,
    Grid,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    useTheme,
    LinearProgress,
} from "@mui/material";
import { Users, TrendingUp } from "lucide-react";

// Constants for K3 game options
const numberOptions = [
    "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT",
    "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN",
    "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN"
];

const specialOptions = [
    { value: "ODD", color: "#22c55e" },
    { value: "EVEN", color: "#a855f7" },
    { value: "BIG", color: "#3b82f6" },
    { value: "SMALL", color: "#f97316" }
];

const combinationOptions = [
    { value: "TWO_SAME", color: "#ef4444", label: "Two Same" },
    { value: "THREE_SAME", color: "#ec4899", label: "Three Same" },
    { value: "ALL_DIFFERENT", color: "#14b8a6", label: "All Different" },
    { value: "CONSECUTIVE", color: "#f59e0b", label: "Consecutive" }
];

const K3BettingMonitor = ({ websocketUrl, selectedTimer, periodId }) => {
    const theme = useTheme();
    const [monitorData, setMonitorData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState('connecting');
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const isComponentMounted = useRef(true);

    useEffect(() => {
        isComponentMounted.current = true;
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 5;

        const connect = () => {
            if (!isComponentMounted.current) return;

            // Clear existing connection
            if (wsRef.current) {
                wsRef.current.close();
            }

            const accessToken = sessionStorage.getItem("accessToken");
            if (!accessToken) {
                setError("No access token found. Please login again.");
                setIsLoading(false);
                return;
            }

            const wsUrl = `${websocketUrl}?token=${accessToken}`;
            
            try {
                console.log("🔌 Connecting to K3 Bet Monitor WebSocket:", wsUrl);
                const socket = new WebSocket(wsUrl);
                wsRef.current = socket;

                socket.onopen = () => {
                    if (!isComponentMounted.current) {
                        socket.close();
                        return;
                    }
                    
                    console.log("✅ K3 Bet Monitor WebSocket connected successfully");
                    setIsLoading(false);
                    setError(null);
                    setConnectionStatus('connected');
                    reconnectAttempts = 0;

                    // Send ping to keep connection alive
                    const pingInterval = setInterval(() => {
                        if (socket.readyState === WebSocket.OPEN) {
                            socket.send(JSON.stringify({ type: "ping" }));
                        } else {
                            clearInterval(pingInterval);
                        }
                    }, 30000);
                };

                socket.onmessage = (event) => {
                    if (!isComponentMounted.current) return;

                    try {
                        const data = JSON.parse(event.data);
                        console.log("📊 K3 Bet Monitor received data:", data);

                        // Handle different message types from the unified WebSocket service
                        if (data.type === "k3MonitorUpdate" && data.data) {
                            setMonitorData(data.data);
                            setIsLoading(false);
                        }
                        else if (data.status === "connected") {
                            console.log("✅ K3 Bet Monitor connection confirmed:", data.message);
                            setConnectionStatus('connected');
                            setError(null);
                        }
                        else if (data.type === "pong") {
                            console.log("🏓 Pong received from K3 bet monitor");
                        }
                        else {
                            console.log("📄 Other K3 bet monitor message:", data.type);
                        }
                    } catch (err) {
                        console.error("❌ Error processing K3 bet monitor message:", err);
                        setError("Error processing monitor data: " + err.message);
                    }
                };

                socket.onerror = (error) => {
                    if (!isComponentMounted.current) return;
                    console.error("❌ K3 Bet Monitor WebSocket error:", error);
                    setError("WebSocket connection error");
                    setConnectionStatus('error');
                    setIsLoading(false);
                };

                socket.onclose = (event) => {
                    if (!isComponentMounted.current) return;
                    console.log("🔌 K3 Bet Monitor WebSocket closed:", event.code, event.reason);
                    
                    setConnectionStatus('disconnected');
                    
                    if (event.code === 4001) {
                        setError("Authentication failed. Token required.");
                        return;
                    } else if (event.code === 4002) {
                        setError("Invalid or expired token. Please login again.");
                        return;
                    } else if (event.code === 4003) {
                        setError("Access denied. Admin privileges required.");
                        return;
                    }

                    if (!error) {
                        setError("WebSocket connection closed. Reconnecting...");
                    }

                    // Implement exponential backoff for reconnection
                    if (reconnectAttempts < maxReconnectAttempts) {
                        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
                        console.log(`🔄 Reconnecting K3 bet monitor in ${delay}ms (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);

                        reconnectTimeoutRef.current = setTimeout(() => {
                            if (isComponentMounted.current) {
                                reconnectAttempts++;
                                connect();
                            }
                        }, delay);
                    } else {
                        setError("Failed to reconnect after several attempts. Please reload the page.");
                    }
                };

            } catch (error) {
                if (isComponentMounted.current) {
                    console.error("❌ K3 Bet Monitor WebSocket connection error:", error);
                    setError("Failed to establish WebSocket connection: " + error.message);
                    setIsLoading(false);
                }
            }
        };

        connect();

        return () => {
            isComponentMounted.current = false;

            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }

            if (wsRef.current) {
                wsRef.current.onclose = null;
                wsRef.current.close();
            }
        };
    }, [websocketUrl]);

    const getCurrentPeriodData = () => {
        if (!monitorData || !monitorData.activePeriods) return null;
        
        const period = monitorData.activePeriods.find(
            (period) =>
                period.timerType === selectedTimer && period.periodId === periodId
        );
        
        console.log("🎯 Current K3 period data:", period);
        console.log("🔍 Looking for K3 timer:", selectedTimer, "period:", periodId);
        console.log("📊 Available K3 periods:", monitorData.activePeriods);
        
        return period;
    };

    const currentPeriod = getCurrentPeriodData();
    const maxBetAmount = currentPeriod
        ? Math.max(...Object.values(currentPeriod.betAmounts || {}))
        : 0;

    const getBetPercentage = (amount) => {
        if (!maxBetAmount || !amount) return 0;
        return (amount / maxBetAmount) * 100;
    };

    const getTotalPercentage = (amount) => {
        const total = currentPeriod?.totalBetAmount || 0;
        if (!total || !amount) return 0;
        return (amount / total) * 100;
    };

    if (isLoading) {
        return (
            <Card sx={{ borderRadius: 2 }}>
                <LinearProgress />
                <Typography textAlign="center" color="text.secondary" sx={{ mt: 1, p: 2 }}>
                    Loading K3 betting data... ({connectionStatus})
                </Typography>
            </Card>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ borderRadius: 2, mt: 2 }}>
                {error}
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Status: {connectionStatus} | Timer: {selectedTimer} | Period: {periodId}
                </Typography>
            </Alert>
        );
    }

    if (!currentPeriod) {
        return (
            <Alert severity="warning" sx={{ borderRadius: 2, mt: 2 }}>
                No K3 betting data available for the selected timer and period.
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Timer: {selectedTimer} | Period: {periodId}
                </Typography>
                <Typography variant="body2">
                    Available periods: {monitorData?.activePeriods?.length || 0}
                </Typography>
            </Alert>
        );
    }

    return (
        <Card
            sx={{
                mt: 2,
                borderRadius: 2,
                boxShadow:
                    "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            }}
        >
            <CardContent sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {/* Header Section */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Users size={20} className="text-gray-600" />
                                <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                                    Active Users: {monitorData?.activeUsers || 0}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <TrendingUp size={20} className="text-gray-600" />
                                <Chip
                                    label={`Total Bet Amount: ${
                                        currentPeriod?.totalBetAmount?.toLocaleString() || 0
                                    }`}
                                    color="primary"
                                    sx={{
                                        ml: 1,
                                        height: 28,
                                        fontWeight: 600,
                                        fontSize: "0.75rem",
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Connection Status */}
                        <Box sx={{ mb: 2 }}>
                            <Chip
                                label={`Status: ${connectionStatus} | Period: ${periodId}`}
                                color={connectionStatus === 'connected' ? 'success' : 'warning'}
                                size="small"
                                sx={{ fontSize: "0.75rem" }}
                            />
                        </Box>

                        {/* Numbers Table */}
                        <Paper
                            sx={{
                                borderRadius: 1,
                                overflow: "hidden",
                                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                                mb: 2,
                            }}
                        >
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    fontWeight: 600,
                                                    bgcolor: "primary.main",
                                                    color: "white",
                                                    fontSize: "0.875rem",
                                                }}
                                                colSpan={3}
                                            >
                                                Numbers (3-18)
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {numberOptions.map((number) => {
                                            const betAmount = currentPeriod?.betAmounts[number] || 0;
                                            const percentage = getBetPercentage(betAmount);

                                            return (
                                                <TableRow key={number} sx={{ "&:hover": { bgcolor: "action.hover" } }}>
                                                    <TableCell sx={{ fontSize: "0.875rem" }}>
                                                        <Chip
                                                            label={number}
                                                            size="small"
                                                            color="primary"
                                                            sx={{
                                                                fontWeight: 600,
                                                                fontSize: "0.75rem",
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: "0.875rem" }}>
                                                        <Typography sx={{ fontWeight: 500 }}>
                                                            {betAmount.toLocaleString()}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell width="40%" sx={{ fontSize: "0.875rem" }}>
                                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                                            <Box
                                                                sx={{
                                                                    flexGrow: 1,
                                                                    bgcolor: theme.palette.grey[100],
                                                                    borderRadius: 1,
                                                                    mr: 1,
                                                                    height: 6,
                                                                    position: "relative",
                                                                    overflow: "hidden",
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        position: "absolute",
                                                                        left: 0,
                                                                        top: 0,
                                                                        height: "100%",
                                                                        bgcolor: "primary.main",
                                                                        width: `${percentage}%`,
                                                                        transition: "width 0.3s ease",
                                                                    }}
                                                                />
                                                            </Box>
                                                            <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                                                                {percentage.toFixed(1)}%
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                        {/* Special Options */}
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            {specialOptions.map(({ value, color }) => {
                                const betAmount = currentPeriod?.betAmounts[value] || 0;
                                const percentage = getTotalPercentage(betAmount);

                                return (
                                    <Grid item xs={12} sm={6} md={3} key={value}>
                                        <Paper
                                            sx={{
                                                p: 2,
                                                borderTop: `3px solid ${color}`,
                                                borderRadius: 1,
                                                height: "100%",
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                <Box
                                                    sx={{
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: "50%",
                                                        bgcolor: color,
                                                        mr: 1,
                                                    }}
                                                />
                                                <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                                                    {value}
                                                </Typography>
                                            </Box>
                                            <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
                                                {betAmount.toLocaleString()}
                                            </Typography>
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <Box
                                                    sx={{
                                                        flexGrow: 1,
                                                        bgcolor: theme.palette.grey[100],
                                                        borderRadius: 1,
                                                        mr: 1,
                                                        height: 6,
                                                        position: "relative",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            left: 0,
                                                            top: 0,
                                                            height: "100%",
                                                            bgcolor: color,
                                                            width: `${percentage}%`,
                                                            transition: "width 0.3s ease",
                                                        }}
                                                    />
                                                </Box>
                                                <Typography
                                                    variant="caption"
                                                    sx={{ color: theme.palette.text.secondary, fontSize: "0.75rem" }}
                                                >
                                                    {percentage.toFixed(1)}%
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                );
                            })}
                        </Grid>

                        {/* Combination Options */}
                        <Grid container spacing={2}>
                            {combinationOptions.map(({ value, color, label }) => {
                                const betAmount = currentPeriod?.betAmounts[value] || 0;
                                const percentage = getTotalPercentage(betAmount);

                                return (
                                    <Grid item xs={12} sm={6} md={3} key={value}>
                                        <Paper
                                            sx={{
                                                p: 2,
                                                borderTop: `3px solid ${color}`,
                                                borderRadius: 1,
                                                height: "100%",
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                <Box
                                                    sx={{
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: "50%",
                                                        bgcolor: color,
                                                        mr: 1,
                                                    }}
                                                />
                                                <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                                                    {label}
                                                </Typography>
                                            </Box>
                                            <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
                                                {betAmount.toLocaleString()}
                                            </Typography>
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <Box
                                                    sx={{
                                                        flexGrow: 1,
                                                        bgcolor: theme.palette.grey[100],
                                                        borderRadius: 1,
                                                        mr: 1,
                                                        height: 6,
                                                        position: "relative",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            left: 0,
                                                            top: 0,
                                                            height: "100%",
                                                            bgcolor: color,
                                                            width: `${percentage}%`,
                                                            transition: "width 0.3s ease",
                                                        }}
                                                    />
                                                </Box>
                                                <Typography
                                                    variant="caption"
                                                    sx={{ color: theme.palette.text.secondary, fontSize: "0.75rem" }}
                                                >
                                                    {percentage.toFixed(1)}%
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default K3BettingMonitor;