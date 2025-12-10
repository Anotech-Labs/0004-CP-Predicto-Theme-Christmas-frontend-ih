import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Button,
    Chip,
    Grid,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    IconButton,
    Tooltip,
    CircularProgress,
    TextField,
    MenuItem,
    InputAdornment,
    Tabs,
    Tab,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    LinearProgress,
    Stack,
    useTheme,
} from '@mui/material';
import {
    Block,
    CheckCircle,
    Warning,
    Refresh,
    Search,
    Timeline,
    Group,
    Security,
    LocationOn,
    ExpandMore,
    CloudDownload,
    Assessment,
    Language,
    DeviceHub,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { format } from 'date-fns';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

// Custom theme with Inter font and dark mode
const customTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6366f1',
            light: '#818cf8',
            dark: '#4f46e5'
        },
        error: {
            main: '#ef4444',
            light: '#f87171'
        },
        warning: {
            main: '#f59e0b',
            light: '#fbbf24'
        },
        success: {
            main: '#10b981',
            light: '#34d399'
        },
        background: {
            default: '#0f172a',
            paper: '#1e293b'
        },
        text: {
            primary: '#f8fafc',
            secondary: '#94a3b8',
            disabled: '#64748b'
        }
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
        h3: {
            fontWeight: 700,
            fontSize: '2rem',
            color: '#f8fafc'
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
            color: '#f8fafc'
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
            color: '#f8fafc'
        },
        h6: {
            fontWeight: 600,
            fontSize: '1rem',
            color: '#f8fafc'
        },
        subtitle1: {
            fontWeight: 500,
        },
        button: {
            fontWeight: 500,
            textTransform: 'none',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      `,
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(148, 163, 184, 0.12)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
                    backdropFilter: 'blur(24px)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                contained: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #818cf8 0%, #8b5cf6 100%)',
                        boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)'
                    }
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
            },
        },
    },
});

// Activity type colors for consistent visualization
const ACTIVITY_COLORS = {
    LOGIN: '#3498db',
    REGISTER: '#2ecc71',
    BET_PLACE: '#e74c3c',
    WITHDRAWAL: '#f1c40f',
    DEPOSIT: '#9b59b6',
};

const RISK_LEVELS = {
    HIGH: { color: '#e74c3c', label: 'High Risk' },
    MEDIUM: { color: '#f39c12', label: 'Medium Risk' },
    LOW: { color: '#2ecc71', label: 'Low Risk' },
};

const IPInformation = () => {
    const { axiosInstance } = useAuth();
    const theme = useTheme();

    // State management
    const [ipStats, setIpStats] = useState({ data: [], pagination: {} });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedIP, setSelectedIP] = useState(null);
    const [ipAnalytics, setIPAnalytics] = useState(null);
    const [analyticsOpen, setAnalyticsOpen] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOptions, setFilterOptions] = useState({
        riskLevel: 'all',
        activityType: 'all',
        dateRange: 'all',
    });
    const [currentTab, setCurrentTab] = useState(0);
    const [suspiciousActivities, setSuspiciousActivities] = useState([]);
    const [timeframeStats, setTimeframeStats] = useState(null);

    // Process date range for API
    const getDateRangeParams = (range) => {
        const now = new Date();
        switch (range) {
            case 'today':
                return {
                    startDate: new Date(now.setHours(0, 0, 0, 0)).toISOString(),
                    endDate: new Date().toISOString(),
                };
            case 'week':
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - 7);
                return {
                    startDate: weekStart.toISOString(),
                    endDate: new Date().toISOString(),
                };
            case 'month':
                const monthStart = new Date(now);
                monthStart.setMonth(now.getMonth() - 1);
                return {
                    startDate: monthStart.toISOString(),
                    endDate: new Date().toISOString(),
                };
            default:
                return {};
        }
    };

    // Process filters for API request
    const getFilteredParams = () => {
        const params = {
            page: page + 1,
            limit: rowsPerPage,
        };

        // Add search term if present
        if (searchTerm.trim()) {
            params.search = searchTerm.trim();
        }

        // Add risk level filter
        if (filterOptions.riskLevel !== 'all') {
            params.riskLevel = filterOptions.riskLevel;
        }

        // Add activity type filter
        if (filterOptions.activityType !== 'all') {
            params.activityType = filterOptions.activityType;
        }

        // Add date range filter
        if (filterOptions.dateRange !== 'all') {
            const dateRange = getDateRangeParams(filterOptions.dateRange);
            params.startDate = dateRange.startDate;
            params.endDate = dateRange.endDate;
        }

        return params;
    };


    // Fetch main IP statistics
    const fetchIPStats = async () => {
        try {
            setLoading(true);
            const params = getFilteredParams();

            const response = await axiosInstance.get('/api/admin/ip-tracking/stats/overall', {
                params: params
            });

            // Process the response data based on filters
            let filteredData = response.data.data || [];

            // Apply client-side filtering if needed
            if (searchTerm.trim()) {
                const searchLower = searchTerm.toLowerCase();
                filteredData = filteredData.filter(item =>
                    item.ipInfo.ip.toLowerCase().includes(searchLower) ||
                    item.ipInfo.city?.toLowerCase().includes(searchLower) ||
                    item.ipInfo.country?.toLowerCase().includes(searchLower)
                );
            }

            if (filterOptions.riskLevel !== 'all') {
                filteredData = filteredData.filter(item =>
                    item.riskMetrics.activityLevel === filterOptions.riskLevel
                );
            }

            setIpStats({
                data: filteredData,
                pagination: response.data.pagination || {}
            });
            setError(null);
        } catch (err) {
            setError('Failed to fetch IP statistics. Please try again.');
            console.error('Error fetching IP stats:', err);
        } finally {
            setLoading(false);
        }
    };

    // Add debounced search effect
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchIPStats();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Fetch suspicious betting activities
    const fetchSuspiciousActivities = async () => {
        try {
            const response = await axiosInstance.get('/api/admin/ip-tracking/suspicious-betting', {
                params: {
                    date: new Date(),
                    minUsers: 2,
                },
            });
            setSuspiciousActivities(response.data.multiUserIPs);
        } catch (err) {
            console.error('Error fetching suspicious activities:', err);
        }
    };

    // Handle filter changes
    const handleFilterChange = (filterType, value) => {
        setFilterOptions(prev => ({
            ...prev,
            [filterType]: value
        }));
        setPage(0); // Reset to first page when filters change
    };

    // Initialize data fetching
    useEffect(() => {
        fetchIPStats();
        fetchSuspiciousActivities();
    }, [page, rowsPerPage, searchTerm, filterOptions]);

    // Handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewAnalytics = async (ip) => {
        try {
            setSelectedIP(ip);
            setAnalyticsOpen(true);
            const response = await axiosInstance.get(`/api/admin/ip-tracking/analytics/${ip}`);
            setIPAnalytics(response.data);

            // Process timeline data for visualization
            const timelineData = processTimelineData(response.data.recentActivities);
            setTimeframeStats(timelineData);
        } catch (err) {
            setError(`Failed to fetch analytics for IP ${ip}`);
            console.error('Error fetching IP analytics:', err);
        }
    };
    const handleBlockIP = async (ip) => {
        try {
            setLoading(true);
            await axiosInstance.post(`/api/admin/ip-tracking/block/${ip}`);

            // Update the local state to reflect the blocked IP
            setIpStats(prevStats => ({
                ...prevStats,
                data: prevStats.data.map(item =>
                    item.ipInfo.ip === ip
                        ? {
                            ...item,
                            ipInfo: {
                                ...item.ipInfo,
                                blocked: true
                            }
                        }
                        : item
                )
            }));

            setError(null);
        } catch (err) {
            setError(`Failed to block IP ${ip}`);
            console.error('Error blocking IP:', err);
        } finally {
            setLoading(false);
        }
    };

    // Updated handleUnblockIP function
    const handleUnblockIP = async (ip) => {
        try {
            setLoading(true);
            await axiosInstance.post(`/api/admin/ip-tracking/unblock/${ip}`);

            // Update the local state to reflect the unblocked IP
            setIpStats(prevStats => ({
                ...prevStats,
                data: prevStats.data.map(item =>
                    item.ipInfo.ip === ip
                        ? {
                            ...item,
                            ipInfo: {
                                ...item.ipInfo,
                                blocked: false
                            }
                        }
                        : item
                )
            }));

            setError(null);
        } catch (err) {
            setError(`Failed to unblock IP ${ip}`);
            console.error('Error unblocking IP:', err);
        } finally {
            setLoading(false);
        }
    };


    // Activity Timeline Component
    const ActivityTimeline = ({ activities }) => {
        //console.log("activities--->", activities);

        const chartData = activities
            .filter(activity => activity.timestamp) // Filter out activities with no timestamp
            .map(activity => {
                const date = new Date(activity.timestamp);
                return {
                    timestamp: date.toString() !== 'Invalid Date' ? format(date, 'HH:mm') : 'Invalid Date',
                    type: activity.activityType,
                    success: activity.success ? 1 : 0,
                };
            });

        return (
            <Box sx={{ width: '100%', height: 300, fontFamily: 'Inter, sans-serif' }}>
                <ResponsiveContainer>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tick={{ fontFamily: 'Inter, sans-serif' }} />
                        <YAxis tick={{ fontFamily: 'Inter, sans-serif' }} />
                        <RechartsTooltip contentStyle={{ fontFamily: 'Inter, sans-serif' }} />
                        <Line
                            type="monotone"
                            dataKey="success"
                            stroke="#8884d8"
                            strokeWidth={2}
                            dot={{ r: 5 }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        );
    };
    // Activity Distribution Chart
    const ActivityDistribution = ({ data }) => {
        //console.log("data is --->", data);

        // Use `activitySummary` from response
        const activitySummary = data?.data?.activitySummary ?? [];

        // Convert activitySummary to pie chart data
        const pieData = activitySummary.map((item) => ({
            name: item.activityType,
            value: item.count,
        }));

        return (
            <Box sx={{ width: '100%', height: 300, fontFamily: 'Inter, sans-serif' }}>
                {pieData.length > 0 ? (
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={ACTIVITY_COLORS[entry.name] || ACTIVITY_COLORS.DEFAULT} />
                                ))}
                            </Pie>
                            <RechartsTooltip contentStyle={{ fontFamily: 'Inter, sans-serif' }} />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p style={{ textAlign: 'center', color: 'gray', fontFamily: 'Inter, sans-serif' }}>
                        No activity data available
                    </p>
                )}
            </Box>
        );
    };
    // Stats Summary Cards
    const StatCard = ({ title, value, icon, color }) => (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {icon}
                    <Typography variant="h6" color="text.secondary">
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h4" color={color}>
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );

    // Risk Level Chip Component
    const RiskLevelChip = ({ level }) => (
        <Chip
            label={RISK_LEVELS[level].label}
            sx={{
                bgcolor: RISK_LEVELS[level].color + '20',
                color: RISK_LEVELS[level].color,
                fontWeight: 600,
            }}
        />
    );

    return (
        <ThemeProvider theme={customTheme}>
            <Box sx={{
                p: 3,
                maxWidth: '100%',
                overflow: 'hidden',
                minHeight: '80vh',
                backgroundColor: '#0f172a',
                borderRadius: '16px'
            }}>
                {/* Header Section */}
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on small screens, row on larger screens
                                justifyContent: 'space-between',
                                alignItems: { xs: 'flex-start', sm: 'center' }, // Align left on small screens, center on larger screens
                                gap: 2, // Add gap between items
                                mb: 3,
                            }}
                        >
                            {/* Title */}
                            <Typography variant="h3" sx={{ mb: { xs: 2, sm: 0 } }}> {/* Add margin-bottom only on small screens */}
                                IP Intelligence Dashboard
                            </Typography>

                            {/* Refresh Button */}
                            <Button
                                variant="contained"
                                startIcon={<Refresh />}
                                onClick={fetchIPStats}
                                disabled={loading}
                                sx={{ width: { xs: '100%', sm: 'auto' } }} // Full width on small screens, auto width on larger screens
                            >
                                Refresh Data
                            </Button>
                        </Box>
                    </Grid>

                    {/* Error Alert */}
                    {error && (
                        <Grid item xs={12}>
                            <Alert severity="error" onClose={() => setError(null)}>
                                {error}
                            </Alert>
                        </Grid>
                    )}

                    {/* Search and Filters */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Search IP or Location"
                                            variant="outlined"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Search />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Risk Level"
                                            value={filterOptions.riskLevel}
                                            onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
                                        >
                                            <MenuItem value="all">All Risks</MenuItem>
                                            <MenuItem value="HIGH">High Risk</MenuItem>
                                            <MenuItem value="MEDIUM">Medium Risk</MenuItem>
                                            <MenuItem value="LOW">Low Risk</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Activity Type"
                                            value={filterOptions.activityType}
                                            onChange={(e) => handleFilterChange('activityType', e.target.value)}
                                        >
                                            <MenuItem value="all">All Activities</MenuItem>
                                            <MenuItem value="LOGIN">Login</MenuItem>
                                            <MenuItem value="REGISTER">Register</MenuItem>
                                            <MenuItem value="BET_PLACE">Betting</MenuItem>
                                            <MenuItem value="WITHDRAWAL">Withdrawal</MenuItem>
                                            <MenuItem value="DEPOSIT">Deposit</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Time Range"
                                            value={filterOptions.dateRange}
                                            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                                        >
                                            <MenuItem value="all">All Time</MenuItem>
                                            <MenuItem value="today">Today</MenuItem>
                                            <MenuItem value="week">This Week</MenuItem>
                                            <MenuItem value="month">This Month</MenuItem>
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>


                    {/* Summary Statistics Cards */}
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <StatCard
                                    title="Total Active IPs"
                                    value={ipStats.data.length}
                                    icon={<Language sx={{ color: theme.palette.primary.main }} />}
                                    color="primary.main"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <StatCard
                                    title="High Risk IPs"
                                    value={ipStats.data.filter(ip => ip.riskMetrics.activityLevel === 'HIGH').length}
                                    icon={<Warning sx={{ color: theme.palette.error.main }} />}
                                    color="error.main"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <StatCard
                                    title="Blocked IPs"
                                    value={ipStats.data.filter(ip => ip.ipInfo.blocked).length}
                                    icon={<Block sx={{ color: theme.palette.warning.main }} />}
                                    color="warning.main"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <StatCard
                                    title="Active Users"
                                    value={ipStats.data.reduce((acc, ip) => acc + ip.statistics.uniqueUsers, 0)}
                                    icon={<Group sx={{ color: theme.palette.success.main }} />}
                                    color="success.main"
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Main Content Tabs */}
                    <Grid item xs={12}>
                        <Card>
                            <Tabs
                                value={currentTab}
                                onChange={(e, newValue) => setCurrentTab(newValue)}
                                sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
                            >
                                <Tab label="IP Overview" icon={<Assessment />} iconPosition="start" />
                                <Tab label="Suspicious Activities" icon={<Security />} iconPosition="start" />
                                <Tab label="Activity Timeline" icon={<Timeline />} iconPosition="start" />
                            </Tabs>

                            {/* Tab Panel 1: IP Overview */}
                            {currentTab === 0 && (
                                <CardContent>
                                    {loading ? (
                                        <Box sx={{ width: '100%', mt: 2 }}>
                                            <LinearProgress />
                                        </Box>
                                    ) : (
                                        <TableContainer>
                                            <Table sx={{ minWidth: 1100 }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>IP Address</TableCell>
                                                        <TableCell>Location</TableCell>
                                                        <TableCell align="center">Risk Level</TableCell>
                                                        <TableCell align="right">Total Activities</TableCell>
                                                        <TableCell align="right">Unique Users</TableCell>
                                                        <TableCell align="center">Status</TableCell>
                                                        <TableCell align="center">Last Activity</TableCell>
                                                        <TableCell align="center">Actions</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {ipStats.data.map((row) => (
                                                        <TableRow
                                                            key={row.ipInfo.ip}
                                                            sx={{
                                                                '&:last-child td, &:last-child th': { border: 0 },
                                                                bgcolor: row.ipInfo.blocked ? 'rgba(231, 76, 60, 0.1)' : 'inherit',
                                                            }}
                                                        >
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                                                                        {row.ipInfo.ip}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <LocationOn sx={{ fontSize: 16, color: 'primary.main' }} />
                                                                    <Typography variant="body2">
                                                                        {`${row.ipInfo.city || ''}, ${row.ipInfo.country || 'Unknown'}`}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <RiskLevelChip level={row.riskMetrics.activityLevel} />
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                {row.statistics.totalActivities}
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                {row.statistics.uniqueUsers}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {row.ipInfo.blocked ? (
                                                                    <Chip
                                                                        label="Blocked"
                                                                        color="error"
                                                                        size="small"
                                                                    />
                                                                ) : (
                                                                    <Chip
                                                                        label="Active"
                                                                        color="success"
                                                                        size="small"
                                                                    />
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {row.lastActivity && new Date(row.lastActivity).toString() !== 'Invalid Date'
                                                                    ? format(new Date(row.lastActivity), 'yyyy-MM-dd HH:mm')
                                                                    : 'Invalid Date'}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                                    <Tooltip title="View Analytics">
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => handleViewAnalytics(row.ipInfo.ip)}
                                                                        >
                                                                            <Timeline />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    {row.ipInfo.blocked ? (
                                                                        <Tooltip title="Unblock IP">
                                                                            <IconButton
                                                                                size="small"
                                                                                color="success"
                                                                                onClick={() => handleUnblockIP(row.ipInfo.ip)}
                                                                                disabled={loading}
                                                                            >
                                                                                <CheckCircle />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    ) : (
                                                                        <Tooltip title="Block IP">
                                                                            <IconButton
                                                                                size="small"
                                                                                color="error"
                                                                                onClick={() => handleBlockIP(row.ipInfo.ip)}
                                                                                disabled={loading}
                                                                            >
                                                                                <Block />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    )}
                                                                </Box>
                                                            </TableCell>

                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}

                                    {/* Pagination */}
                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 50]}
                                        component="div"
                                        count={ipStats.pagination.total || 0}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </CardContent>
                            )}

                            {/* Tab Panel 2: Suspicious Activities */}
                            {currentTab === 1 && (
                                <CardContent>
                                    {Array.isArray(suspiciousActivities) && suspiciousActivities.length > 0 ? (
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>IP Address</TableCell>
                                                        <TableCell>Location</TableCell>
                                                        <TableCell align="right">Number of Users</TableCell>
                                                        <TableCell align="right">Total Bets</TableCell>
                                                        <TableCell align="right">Total Amount</TableCell>
                                                        <TableCell align="center">Actions</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {suspiciousActivities.map((activity) => (
                                                        <TableRow key={activity.ip}>
                                                            <TableCell>{activity.ip}</TableCell>
                                                            <TableCell>
                                                                {`${activity.city || ''}, ${activity.country || 'Unknown'}`}
                                                            </TableCell>
                                                            <TableCell align="right">{activity.userCount}</TableCell>
                                                            <TableCell align="right">{activity.totalBets}</TableCell>
                                                            <TableCell align="right">{activity.totalAmount}</TableCell>
                                                            <TableCell align="center">
                                                                <Button
                                                                    variant="outlined"
                                                                    size="small"
                                                                    onClick={() => handleViewAnalytics(activity.ip)}
                                                                >
                                                                    Investigate
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    ) : (
                                        <Typography variant="body1" align="center" sx={{ py: 4 }}>
                                            No suspicious activities detected.
                                        </Typography>
                                    )}
                                </CardContent>
                            )}

                            {/* Tab Panel 3: Activity Timeline */}
                            {currentTab === 2 && (
                                <CardContent>
                                    {timeframeStats ? (
                                        <ActivityTimeline activities={timeframeStats} />
                                    ) : (
                                        <Typography variant="body1" align="center" sx={{ py: 4 }}>
                                            Select an IP to view its activity timeline.
                                        </Typography>
                                    )}
                                </CardContent>
                            )}
                        </Card>
                    </Grid>
                </Grid>

                {/* Analytics Dialog */}
                <Dialog
                    open={analyticsOpen}
                    onClose={() => setAnalyticsOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6">Analytics for IP:</Typography>
                            <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                                {selectedIP}
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        {ipAnalytics ? (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Activity Distribution
                                            </Typography>
                                            <ActivityDistribution data={ipAnalytics} />
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Activity Timeline
                                            </Typography>
                                            <ActivityTimeline activities={ipAnalytics?.data?.recentActivities || []} />
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Detailed Activity Log
                                            </Typography>
                                            <TableContainer>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Timestamp</TableCell>
                                                            <TableCell>Activity Type</TableCell>
                                                            <TableCell>User Name</TableCell>
                                                            <TableCell>User UID</TableCell>
                                                            <TableCell>Status</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {Array.isArray(ipAnalytics?.data?.recentActivities) && ipAnalytics.data.recentActivities.length > 0 ? (
                                                            ipAnalytics.data.recentActivities.map((activity) => {
                                                                //console.log("Mapping Activity:", activity); // Debugging log

                                                                const date = new Date(activity.timestamp);
                                                                const formattedDate = isNaN(date.getTime()) ? "Invalid Date" : format(date, "yyyy-MM-dd HH:mm");

                                                                return (
                                                                    <TableRow key={activity.id}>
                                                                        <TableCell>{formattedDate}</TableCell>
                                                                        <TableCell>{activity.activityType}</TableCell>
                                                                        <TableCell>{activity?.userName || "Unknown User"}</TableCell>
                                                                        <TableCell>{activity?.userId || "Unknown User"}</TableCell>
                                                                        <TableCell>

                                                                            <Chip
                                                                                label={activity.success ? "Success" : "Failed"}
                                                                                color={activity.success ? "success" : "error"}
                                                                                size="small"
                                                                            />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            })
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan={4} style={{ textAlign: "center" }}>
                                                                    No recent activities found.
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>

                                                </Table>
                                            </TableContainer>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        )}
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => setAnalyticsOpen(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
};

export default IPInformation;