import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
    Card,
    CardContent,
    Grid,
    Typography,
    TextField,
    Button,
    Box,
    CircularProgress,
    Paper,
    Tooltip as MuiTooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Line,
    Legend,
    ComposedChart,
} from 'recharts'
import { jwtDecode } from 'jwt-decode'

// Enhanced color palette for a more lucrative UI
const luxuryColors = {
    primary: '#3a36e0',          // Rich royal blue
    secondary: '#6c63ff',        // Vibrant purple
    success: '#00d09c',          // Bright teal green
    warning: '#ffac33',          // Warm gold/amber
    orange: '#eb6121',          // orange
    error: '#ff5a5f',            // Coral red
    neutral: '#5f6c86',          // Slate blue-gray
    gradient: {
        blue: 'linear-gradient(135deg, #3a36e0 0%, #6c63ff 100%)',
        green: 'linear-gradient(135deg, #00d09c 0%, #00a86b 100%)',
        gold: 'linear-gradient(135deg, #ffac33 0%, #ff8a00 100%)',
        red: 'linear-gradient(135deg, #ff5a5f 0%, #ff3a54 100%)',
    },
    background: {
        main: '#f6f9ff',         // Light blue-gray
        card: '#ffffff',         // White
        dark: '#edf2f7',         // Light blue-gray
        highlight: '#f0f5ff'     // Very light blue
    },
    text: {
        primary: '#1a202c',      // Very dark blue-gray
        secondary: '#4a5568',    // Dark blue-gray
        muted: '#718096',        // Mid blue-gray
    }
}

// Chart colors with better contrast and visual appeal
const CHART_COLORS = ['#3a36e0', '#00d09c', '#ffac33', '#ff5a5f', '#6c63ff', '#00a86b']

// Enhanced styled components
const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    background: luxuryColors.background.card,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    borderRadius: '20px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    border: '1px solid rgba(58, 54, 224, 0.05)',
    '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    },
}))

const DashboardHeader = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    padding: theme.spacing(4),
    borderRadius: '24px',
    background: luxuryColors.gradient.blue,
    color: '#ffffff',
    boxShadow: '0 10px 25px rgba(58, 54, 224, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
        borderRadius: '50%',
        transform: 'translate(30%, -30%)',
    },
    [theme.breakpoints.down('sm')]: {
        marginBottom: theme.spacing(3),
        padding: theme.spacing(3),
    },
}))

const MetricCard = styled(Paper)(({ theme, accentColor }) => ({
    padding: theme.spacing(3),
    borderRadius: '18px',
    background: luxuryColors.background.card,
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '8px',
        height: '100%',
        background: accentColor || luxuryColors.primary,
        opacity: 0.8,
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '120px',
        height: '120px',
        background: 'radial-gradient(circle, rgba(58, 54, 224, 0.05) 0%, rgba(58, 54, 224, 0) 70%)',
        borderRadius: '50%',
        transform: 'translate(30%, -30%)',
    },
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 12px 25px rgba(0, 0, 0, 0.12)',
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontFamily: 'Inter, sans-serif',
    padding: theme.spacing(2),
    borderBottom: '1px solid #edf2f7',
    fontSize: '0.95rem',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(1.5),
    },
}))

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    background: luxuryColors.background.highlight,
    color: luxuryColors.primary,
    padding: theme.spacing(2),
    borderBottom: `2px solid ${luxuryColors.primary}`,
    fontSize: '0.95rem',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(1.5),
    },
}))

const GlassCard = styled(Box)(({ theme, bg }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: theme.spacing(2),
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
    background: bg || 'transparent',
}))

// Define this function outside your component or in a useCallback
const renderCustomizedLabel = (props) => {
    const { name, percent, cx, cy, midAngle, outerRadius } = props
    const RADIAN = Math.PI / 180
    // Position the label further away from the pie
    const radius = outerRadius * 1.2
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
        <text
            x={x}
            y={y}
            fill={luxuryColors.text.secondary}
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            style={{
                fontFamily: 'Inter',
                fontSize: isMobile ? 10 : 12,
                fontWeight: 500
            }}
        >
            {`${name}: ${(percent * 100).toFixed(1)}%`}
        </text>
    )
}

function AgentPerformanceDashboard() {
    const { axiosInstance } = useAuth()
    const [uid, setUid] = useState('')
    const [networkData, setNetworkData] = useState(null)
    const [userPerformance, setUserPerformance] = useState(null)
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    // Get admin's UID from token
    useEffect(() => {
        const accessToken = sessionStorage.getItem('accessToken')
        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken)
                setUid(decodedToken.uid || '')
            } catch (error) {
                console.error('Error decoding token:', error)
            }
        }
    }, [])

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setLoadingProgress((oldProgress) => {
                    const newProgress = Math.min(oldProgress + 5, 95)
                    return newProgress
                })
            }, 100)
            return () => {
                clearInterval(interval)
                setLoadingProgress(0)
            }
        }
    }, [loading])

    const fetchData = async () => {
        if (!uid) {
            setError('Please enter a user ID')
            return
        }

        setLoading(true)
        setError('')

        try {
            const [networkResponse, performanceResponse] = await Promise.all([
                axiosInstance.get(`/api/admin/agent/network-summary/${uid}`),
                axiosInstance.get(`/api/admin/agent/user-performance/${uid}`),
            ])

            setNetworkData(networkResponse.data.data)
            setUserPerformance(performanceResponse.data.data)
            //console.log('Network Data:', networkResponse.data.data)
            //console.log('User Performance Data:', performanceResponse.data.data)
        } catch (err) {
            setError('Failed to fetch data. Please check the User ID and try again.')
            console.error('Error fetching data:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (uid) {
            fetchData()
        }
    }, [uid])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value)
    }

    const getPerformanceMetrics = () => {
        if (!networkData) return []
        const { bettingStats } = networkData

        const winRate = (bettingStats.totalWinAmount / bettingStats.totalBetAmount) * 100
        return [
            {
                label: 'Win Rate',
                value: `${winRate.toFixed(1)}%`,
                color: winRate >= 50 ? luxuryColors.success : luxuryColors.error,
                icon: '📈', // Unicode icons add visual interest
            },
            {
                label: 'Average Bet',
                value: formatCurrency(bettingStats.totalBetAmount / networkData.totalUsers),
                color: luxuryColors.secondary,
                icon: '💰',
            },
            {
                label: 'Efficiency',
                value: `${((networkData.commissionStats.totalCommission / bettingStats.totalBetAmount) * 100).toFixed(1)}%`,
                color: luxuryColors.warning,
                icon: '⚡',
            },
        ]
    }

    // Prepare level-wise performance data from the API response
    const getLevelWisePerformanceData = () => {
        if (!userPerformance || !userPerformance.levelWiseStats) return []

        return userPerformance.levelWiseStats.map(level => ({
            level: `Level ${level.level}`,
            userCount: level.userCount,
            deposits: level.deposits,
            withdrawals: level.withdrawals,
            betAmount: level.betAmount,
            winAmount: level.winAmount,
            profitLoss: level.profitLoss,
        }))
    }

    // Calculate financial summary for pie chart
    const getFinancialSummaryData = () => {
        if (!networkData) return []

        return [
            { name: 'Deposits', value: networkData.financialStats.totalDeposits },
            { name: 'Withdrawals', value: networkData.financialStats.totalWithdrawals },
            { name: 'Bet Amount', value: networkData.bettingStats.totalBetAmount },
            { name: 'Win Amount', value: networkData.bettingStats.totalWinAmount },
            { name: 'Commission', value: networkData.commissionStats.totalCommission },
        ]
    }

    // Add a pulsing animation for key metrics
    const PulsingValue = styled(Typography)(({ theme, color }) => ({
        fontFamily: 'Inter, sans-serif',
        color: color || luxuryColors.primary,
        position: 'relative',
        display: 'inline-block',
        '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: `${color || luxuryColors.primary}20`,
            animation: 'pulse 2s infinite',
            zIndex: -1,
        },
        '@keyframes pulse': {
            '0%': {
                transform: 'translate(-50%, -50%) scale(1)',
                opacity: 0.7,
            },
            '70%': {
                transform: 'translate(-50%, -50%) scale(1.5)',
                opacity: 0,
            },
            '100%': {
                transform: 'translate(-50%, -50%) scale(1)',
                opacity: 0,
            },
        },
    }))

    return (
        <Box sx={{
            p: { xs: 2, sm: 3, md: 4 },
            background: luxuryColors.background.main,
            // backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(58, 54, 224, 0.03) 0%, rgba(58, 54, 224, 0) 60%)',
            backgroundSize: '100% 100%',
            minHeight: '100vh',
            fontFamily: 'Inter, sans-serif'
        }}>
            {/* <DashboardHeader>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 2, sm: 0 }
                }}>
                    <Box>
                        <Typography variant={isMobile ? "h5" : "h4"} sx={{
                            fontFamily: 'Inter',
                            fontWeight: 700,
                            letterSpacing: '-0.5px',
                            textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}>
                            Agent Performance Dashboard
                        </Typography>
                        <Typography variant="body1" sx={{
                            fontFamily: 'Inter',
                            mt: 1,
                            opacity: 0.9,
                            maxWidth: '600px'
                        }}>
                            Comprehensive overview of network performance, user stats, and financial metrics
                        </Typography>
                    </Box>
                </Box>
                {error && (
                    <GlassCard bg="rgba(255,90,95,0.1)" sx={{ mt: 2 }}>
                        <Typography color="error" sx={{ fontFamily: 'Inter, sans-serif' }}>
                            {error}
                        </Typography>
                    </GlassCard>
                )}
            </DashboardHeader> */}

            {networkData && userPerformance && (
                <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                    {/* Key Metrics */}
                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCard accentColor={luxuryColors.primary}>
                            <Box>
                                <Typography variant="subtitle2" sx={{
                                    fontFamily: 'Inter',
                                    color: luxuryColors.text.muted,
                                    fontWeight: 500,
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem'
                                }}>
                                    Total Network Size
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                                    <PulsingValue variant={isMobile ? "h5" : "h4"} color={luxuryColors.primary} sx={{
                                        fontFamily: 'Inter', fontWeight: 700, letterSpacing: '-0.5px'
                                    }}>
                                        {networkData.totalUsers.toLocaleString()}
                                    </PulsingValue>
                                    <Typography variant="body2" sx={{ ml: 1, color: luxuryColors.text.muted }}>users</Typography>
                                </Box>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mt: 2,
                                padding: '10px 16px',
                                background: `${luxuryColors.primary}10`,
                                borderRadius: '12px'
                            }}>
                                <Typography variant="body2" sx={{
                                    fontFamily: 'Inter',
                                    color: luxuryColors.primary,
                                    fontWeight: 600
                                }}>
                                    Active across {networkData.levelWiseCounts.length} levels
                                </Typography>
                            </Box>
                        </MetricCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCard accentColor={luxuryColors.orange}>
                            <Box>
                                <Typography variant="subtitle2" sx={{
                                    fontFamily: 'Inter',
                                    color: luxuryColors.text.muted,
                                    fontWeight: 500,
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem'
                                }}>
                                    Net Deposits
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                                    <PulsingValue variant={isMobile ? "h5" : "h4"} color={luxuryColors.orange} sx={{
                                        fontFamily: 'Inter', fontWeight: 700, letterSpacing: '-0.5px'
                                    }}>
                                        {formatCurrency(networkData.financialStats.netDeposits)}
                                    </PulsingValue>
                                </Box>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mt: 2,
                                padding: '10px 16px',
                                background: `${luxuryColors.orange}10`,
                                borderRadius: '12px'
                            }}>
                                <Typography variant="body2" sx={{
                                    fontFamily: 'Inter',
                                    color: luxuryColors.orange,
                                    fontWeight: 600
                                }}>
                                    {networkData.financialStats.totalDeposits > 0
                                        ? `${((networkData.financialStats.netDeposits / networkData.financialStats.totalDeposits) * 100).toFixed(1)}% retention rate`
                                        : 'No deposits yet'}
                                </Typography>
                            </Box>
                        </MetricCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCard accentColor={networkData.bettingStats.netProfitLoss >= 0 ? luxuryColors.success : luxuryColors.error}>
                            <Box>
                                <Typography variant="subtitle2" sx={{
                                    fontFamily: 'Inter',
                                    color: luxuryColors.text.muted,
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    letterSpacing: '0.5px'
                                }}>
                                    Net Profit
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                                    <PulsingValue
                                        variant={isMobile ? "h5" : "h4"}
                                        color={networkData.bettingStats.netProfitLoss >= 0 ? luxuryColors.success : luxuryColors.error}
                                        sx={{
                                            fontFamily: 'Inter',
                                            fontWeight: 700,
                                            letterSpacing: '-0.5px'
                                        }}
                                    >
                                        {formatCurrency(networkData.bettingStats.netProfitLoss)}
                                    </PulsingValue>
                                </Box>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mt: 2,
                                padding: '10px 16px',
                                background: networkData.bettingStats.netProfitLoss >= 0 ?
                                    `${luxuryColors.success}10` : `${luxuryColors.error}10`,
                                borderRadius: '12px'
                            }}>
                                <Typography variant="body2" sx={{
                                    fontFamily: 'Inter',
                                    color: networkData.bettingStats.netProfitLoss >= 0 ? luxuryColors.success : luxuryColors.error,
                                    fontWeight: 600
                                }}>
                                    {`${(networkData.bettingStats.totalWinAmount / networkData.bettingStats.totalBetAmount * 100).toFixed(1)}% win rate`}
                                </Typography>
                            </Box>
                        </MetricCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCard accentColor={luxuryColors.warning}>
                            <Box>
                                <Typography variant="subtitle2" sx={{
                                    fontFamily: 'Inter',
                                    color: luxuryColors.text.muted,
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    letterSpacing: '0.5px'
                                }}>
                                    Commission Earned
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                                    <PulsingValue variant={isMobile ? "h5" : "h4"} color={luxuryColors.warning} sx={{
                                        fontFamily: 'Inter', fontWeight: 700, letterSpacing: '-0.5px'
                                    }}>
                                        {formatCurrency(networkData.commissionStats.totalCommission)}
                                    </PulsingValue>
                                </Box>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mt: 2,
                                padding: '10px 16px',
                                background: `${luxuryColors.warning}10`,
                                borderRadius: '12px'
                            }}>
                                <Typography variant="body2" sx={{
                                    fontFamily: 'Inter',
                                    color: luxuryColors.warning,
                                    fontWeight: 600
                                }}>
                                    {`${(networkData.commissionStats.totalCommission / networkData.bettingStats.totalBetAmount * 100).toFixed(1)}% of total bets`}
                                </Typography>
                            </Box>
                        </MetricCard>
                    </Grid>

                    {/* Level-Wise Performance Chart */}
                    <Grid item xs={12}>
                        <StyledCard>
                            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                                <Typography variant="h6" sx={{
                                    fontFamily: 'Inter',
                                    mb: { xs: 2, sm: 3 },
                                    fontWeight: 600,
                                    color: luxuryColors.text.primary,
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&::before': {
                                        content: '""',
                                        display: 'inline-block',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: luxuryColors.primary,
                                        marginRight: '10px'
                                    }
                                }}>
                                    Level-Wise Performance Breakdown
                                </Typography>
                                <Box sx={{
                                    height: { xs: 300, sm: 350, md: 400 },
                                    width: '100%',
                                    p: { xs: 0, sm: 1, md: 2 }
                                }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart
                                            data={getLevelWisePerformanceData()}
                                            margin={{ top: 20, right: 30, left: isMobile ? 10 : 30, bottom: 30 }}
                                        >
                                            <defs>
                                                <linearGradient id="depositGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={luxuryColors.primary} stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor={luxuryColors.primary} stopOpacity={0.2} />
                                                </linearGradient>
                                                <linearGradient id="betGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={luxuryColors.warning} stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor={luxuryColors.warning} stopOpacity={0.2} />
                                                </linearGradient>
                                                <linearGradient id="winGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={luxuryColors.success} stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor={luxuryColors.success} stopOpacity={0.2} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.6} />
                                            <XAxis
                                                dataKey="level"
                                                tick={{ fontFamily: 'Inter', fontSize: isMobile ? 10 : 12, fill: luxuryColors.text.secondary }}
                                                tickLine={{ stroke: '#9e9e9e' }}
                                                axisLine={{ stroke: '#9e9e9e' }}
                                                padding={{ left: 10, right: 10 }}
                                            />
                                            <YAxis
                                                yAxisId="left"
                                                orientation="left"
                                                tick={{ fontFamily: 'Inter', fontSize: isMobile ? 10 : 12, fill: luxuryColors.text.secondary }}
                                                tickFormatter={(value) => `₹${value / 1000}k`}
                                                tickLine={{ stroke: '#9e9e9e' }}
                                                axisLine={{ stroke: '#9e9e9e' }}
                                                label={{
                                                    value: 'Amount (₹)',
                                                    angle: -90,
                                                    position: 'insideLeft',
                                                    fontFamily: 'Inter',
                                                    fontSize: isMobile ? 10 : 12,
                                                    fill: luxuryColors.text.muted,
                                                    dx: isMobile ? -15 : -10
                                                }}
                                            />
                                            <YAxis
                                                yAxisId="right"
                                                orientation="right"
                                                tick={{ fontFamily: 'Inter', fontSize: isMobile ? 10 : 12, fill: luxuryColors.text.secondary }}
                                                tickLine={{ stroke: '#9e9e9e' }}
                                                axisLine={{ stroke: '#9e9e9e' }}
                                                label={{
                                                    value: 'Users',
                                                    angle: 90,
                                                    position: 'insideRight',
                                                    fontFamily: 'Inter',
                                                    fontSize: isMobile ? 10 : 12,
                                                    fill: luxuryColors.text.muted,
                                                    dx: isMobile ? 15 : 10
                                                }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    fontFamily: 'Inter',
                                                    fontSize: isMobile ? 10 : 12,
                                                    borderRadius: '12px',
                                                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                                                    border: 'none',
                                                    padding: '12px 16px'
                                                }}
                                                formatter={(value, name) => {
                                                    if (name === 'userCount') return [`${value} users`, 'User Count']
                                                    return [formatCurrency(value), name]
                                                }}
                                                cursor={{ fill: 'rgba(58, 54, 224, 0.05)' }}
                                            />
                                            <Legend
                                                wrapperStyle={{
                                                    fontFamily: 'Inter',
                                                    fontSize: isMobile ? 10 : 12,
                                                    paddingTop: '15px'
                                                }}
                                                iconType="circle"
                                            />
                                            <Bar
                                                yAxisId="left"
                                                dataKey="deposits"
                                                fill="url(#depositGradient)"
                                                name="Deposits"
                                                barSize={isMobile ? 15 : 25}
                                                radius={[4, 4, 0, 0]}
                                            />
                                            <Bar
                                                yAxisId="left"
                                                dataKey="betAmount"
                                                fill="url(#betGradient)"
                                                name="Bet Amount"
                                                barSize={isMobile ? 15 : 25}
                                                radius={[4, 4, 0, 0]}
                                            />
                                            <Bar
                                                yAxisId="left"
                                                dataKey="winAmount"
                                                fill="url(#winGradient)"
                                                name="Win Amount"
                                                barSize={isMobile ? 15 : 25}
                                                radius={[4, 4, 0, 0]}
                                            />
                                            <Line
                                                yAxisId="right"
                                                type="monotone"
                                                dataKey="userCount"
                                                stroke={luxuryColors.secondary}
                                                strokeWidth={3}
                                                dot={{
                                                    fill: luxuryColors.secondary,
                                                    strokeWidth: 2,
                                                    r: 6,
                                                    strokeDasharray: '',
                                                }}
                                                activeDot={{ r: 8, strokeWidth: 2 }}
                                                name="User Count"
                                            />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </Box>
                            </CardContent>
                        </StyledCard>
                    </Grid>

                    {/* Financial Summary Chart */}
                    <Grid item xs={12} md={6}>
                        <StyledCard>
                            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                                <Typography variant="h6" sx={{
                                    fontFamily: 'Inter',
                                    mb: { xs: 2, sm: 3 },
                                    fontWeight: 600,
                                    color: luxuryColors.text.primary,
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&::before': {
                                        content: '""',
                                        display: 'inline-block',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: luxuryColors.warning,
                                        marginRight: '10px'
                                    }
                                }}>
                                    Financial Distribution
                                </Typography>
                                <Box sx={{
                                    height: { xs: 320, sm: 400, md: 450 }, // Increased height
                                    width: '100%',
                                    p: { xs: 0, sm: 1, md: 2 }
                                }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                                            <Pie
                                                data={getFinancialSummaryData()}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={true} // Enable label lines
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                                outerRadius={isMobile ? 40 : 90} // Reduced radius to make more room for labels
                                                innerRadius={isMobile ? 15 : 45}
                                                fill="#8884d8"
                                                dataKey="value"
                                                paddingAngle={3}
                                            >
                                                {getFinancialSummaryData().map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                                                        stroke="white"
                                                        strokeWidth={1.5}
                                                        fontSize={isMobile ? 10 : 12} // Adjust font size for mobile
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) => formatCurrency(value)}
                                                contentStyle={{
                                                    fontFamily: 'Inter',
                                                    fontSize: isMobile ? 10 : 12,
                                                    borderRadius: '12px',
                                                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                                                    border: 'none',
                                                    padding: '12px 16px'
                                                }}
                                            />
                                            <Legend
                                                formatter={(value) => <span style={{ fontFamily: 'Inter', fontSize: isMobile ? '0.75rem' : '0.85rem', color: luxuryColors.text.secondary }}>{value}</span>}
                                                layout="horizontal"
                                                verticalAlign="bottom"
                                                align="center"
                                                iconType="circle"
                                                wrapperStyle={{ paddingTop: 20 }} // Add spacing above legend
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            </CardContent>
                        </StyledCard>
                    </Grid>

                    {/* Performance Metrics */}
                    <Grid item xs={12} md={6}>
                        <StyledCard>
                            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                                <Typography variant="h6" sx={{
                                    fontFamily: 'Inter',
                                    mb: { xs: 2, sm: 3 },
                                    fontWeight: 600,
                                    color: luxuryColors.text.primary,
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&::before': {
                                        content: '""',
                                        display: 'inline-block',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: luxuryColors.success,
                                        marginRight: '10px'
                                    }
                                }}>
                                    Performance Metrics
                                </Typography>
                                <Grid container spacing={3}>
                                    {getPerformanceMetrics().map((metric, index) => (
                                        <Grid item xs={12} key={index}>
                                            <Box sx={{
                                                p: 2,
                                                borderRadius: '14px',
                                                background: `${metric.color}08`,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    background: `${metric.color}15`,
                                                    transform: 'translateX(10px)'
                                                }
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box sx={{
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '12px',
                                                        background: `${metric.color}15`,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        boxShadow: `0 8px 20px ${metric.color}20`,
                                                        fontSize: '20px'
                                                    }}>
                                                        {metric.icon}
                                                    </Box>
                                                    <Typography sx={{
                                                        ml: 2,
                                                        fontFamily: 'Inter',
                                                        fontWeight: 600,
                                                        color: luxuryColors.text.secondary,
                                                    }}>
                                                        {metric.label}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="h6" sx={{
                                                    fontFamily: 'Inter',
                                                    fontWeight: 700,
                                                    color: metric.color
                                                }}>
                                                    {metric.value}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </StyledCard>
                    </Grid>

                    {/* Most Active Users Table */}
                    <Grid item xs={12}>
                        <StyledCard>
                            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                                <Typography variant="h6" sx={{
                                    fontFamily: 'Inter',
                                    mb: { xs: 2, sm: 3 },
                                    fontWeight: 600,
                                    color: luxuryColors.text.primary,
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&::before': {
                                        content: '""',
                                        display: 'inline-block',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: luxuryColors.secondary,
                                        marginRight: '10px'
                                    }
                                }}>
                                    Level-wise Performance Details
                                </Typography>
                                <TableContainer sx={{
                                    borderRadius: '16px',
                                    boxShadow: 'none',
                                    border: '1px solid #edf2f7',
                                    maxHeight: 400,
                                    '&::-webkit-scrollbar': {
                                        width: '8px',
                                        height: '8px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        background: '#f1f1f1',
                                        borderRadius: '4px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        background: '#c1c1c1',
                                        borderRadius: '4px',
                                    },
                                }}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableHeaderCell>Level</StyledTableHeaderCell>
                                                <StyledTableHeaderCell align="right">Users</StyledTableHeaderCell>
                                                <StyledTableHeaderCell align="right">Total Deposits</StyledTableHeaderCell>
                                                <StyledTableHeaderCell align="right">Total Withdrawals</StyledTableHeaderCell>
                                                <StyledTableHeaderCell align="right">Bet Amount</StyledTableHeaderCell>
                                                <StyledTableHeaderCell align="right">Win Amount</StyledTableHeaderCell>
                                                <StyledTableHeaderCell align="right">Commission</StyledTableHeaderCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {userPerformance.levelWiseStats.map((user, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            background: luxuryColors.background.highlight,
                                                        }
                                                    }}
                                                >
                                                    <StyledTableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Box
                                                                sx={{
                                                                    width: '32px',
                                                                    height: '32px',
                                                                    borderRadius: '50%',
                                                                    background: CHART_COLORS[index % CHART_COLORS.length],
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    color: 'white',
                                                                    fontWeight: 600,
                                                                    fontSize: '14px',
                                                                    mr: 1,
                                                                }}
                                                            >
                                                                {user.level}
                                                            </Box>
                                                        </Box>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {user.userCount}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Box component="span" sx={{
                                                            // color: user.winAmount >= user.betAmount ? luxuryColors.success : luxuryColors.error,
                                                            fontWeight: 600
                                                        }}>
                                                            {formatCurrency(user.deposits)}
                                                        </Box>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Box component="span" sx={{
                                                        }}>
                                                            {formatCurrency(user.withdrawals)}
                                                        </Box>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Box component="span" sx={{
                                                            color: user.winAmount >= user.betAmount ? luxuryColors.success : luxuryColors.error,
                                                            fontWeight: 600
                                                        }}>
                                                            {formatCurrency(user.betAmount)}
                                                        </Box>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {formatCurrency(user.winAmount)}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Box sx={{
                                                            background: luxuryColors.background.highlight,
                                                            color: luxuryColors.primary,
                                                            fontWeight: 600,
                                                            padding: '4px 12px',
                                                            borderRadius: '12px',
                                                            display: 'inline-block',
                                                            fontSize: '0.85rem'
                                                        }}>
                                                            {formatCurrency(user.profitLoss)}
                                                        </Box>
                                                    </StyledTableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                </Grid>
            )}

            {!networkData && !userPerformance && !error && (
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} sm={8} md={6} lg={5}>
                        <StyledCard>
                            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h6" sx={{
                                    fontFamily: 'Inter',
                                    mb: 3,
                                    fontWeight: 600,
                                    color: luxuryColors.text.primary
                                }}>
                                    Enter User ID to View Network Data
                                </Typography>
                                <TextField
                                    fullWidth
                                    label="User ID"
                                    variant="outlined"
                                    value={uid}
                                    onChange={(e) => setUid(e.target.value)}
                                    sx={{
                                        mb: 3,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            fontFamily: 'Inter',
                                            '&.Mui-focused fieldset': {
                                                borderColor: luxuryColors.primary,
                                                borderWidth: '2px'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontFamily: 'Inter'
                                        }
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={fetchData}
                                    disabled={loading || !uid}
                                    sx={{
                                        background: luxuryColors.primary,
                                        padding: '12px',
                                        borderRadius: '12px',
                                        fontFamily: 'Inter',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        boxShadow: '0 8px 20px rgba(58, 54, 224, 0.25)',
                                        '&:hover': {
                                            background: luxuryColors.secondary,
                                            boxShadow: '0 10px 25px rgba(58, 54, 224, 0.35)',
                                        }
                                    }}
                                >
                                    {loading ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CircularProgress
                                                size={24}
                                                sx={{ color: '#fff', mr: 1 }}
                                                variant="determinate"
                                                value={loadingProgress}
                                            />
                                            <Typography variant="button" sx={{ fontFamily: 'Inter' }}>
                                                Loading...
                                            </Typography>
                                        </Box>
                                    ) : 'Fetch Network Data'}
                                </Button>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                </Grid>
            )}
        </Box>
    )
}

export default AgentPerformanceDashboard