import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    useTheme
} from '@mui/material';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell,
    ResponsiveContainer
} from 'recharts';

const COLORS = {
    primary: '#6366f1',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
};

// Custom styles that will apply Inter font
const fontStyle = {
    fontFamily: 'Inter, sans-serif',
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Card sx={{ 
                p: 1.5, 
                backgroundColor: '#0f172a', 
                border: '1px solid rgba(148, 163, 184, 0.12)', 
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
                borderRadius: '8px'
            }}>
                <Typography variant="subtitle2" sx={{ ...fontStyle, color: '#f8fafc', mb: 0.5, fontWeight: 600 }}>
                    {label}
                </Typography>
                {payload.map((entry, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 2,
                            color: entry.color,
                            ...fontStyle
                        }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#94a3b8', ...fontStyle }}>
                            {entry.name}:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#f8fafc', ...fontStyle }}>
                            {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
                            {(entry.name === 'ROI' || entry.name === 'Win Rate') ? '%' : ''}
                        </Typography>
                    </Box>
                ))}
            </Card>
        );
    }
    return null;
};

const CustomLegend = ({ payload }) => {
    return (
        <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 2,
            pt: 1,
            ...fontStyle
        }}>
            {payload.map((entry, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: entry.color
                        }}
                    />
                    <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500, ...fontStyle }}>
                        {entry.value}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export const ProfitLossCharts = ({ summary, gameStats }) => {
    const theme = useTheme();

    const winLossData = [
        { name: 'Wins', value: summary.totalWins, color: COLORS.success },
        { name: 'Losses', value: summary.totalLoss, color: COLORS.danger }
    ];

    const gameComparisonData = gameStats.map(game => ({
        name: game.gameName,
        'Win Rate': parseFloat(game.winRate.toFixed(2)),
        'Net P/L': parseFloat(game.netProfitLossAdmin.toFixed(2)),
        'ROI': parseFloat(game.roiAdmin.toFixed(2))
    }));

    return (
        <Box sx={{
            width: '100%',
            borderRadius: 4,
            my: 3,
            ...fontStyle
        }}>
            <Grid container spacing={3}>
                {/* Win/Loss Distribution */}
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        p: 3,
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(148, 163, 184, 0.12)',
                        borderRadius: '16px',
                        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
                        backdropFilter: 'blur(24px)',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)',
                            borderColor: 'rgba(99, 102, 241, 0.3)'
                        }
                    }}>
                        <Typography variant="h6" sx={{ mb: 3, color: '#f8fafc', fontWeight: 600, fontSize: '1.125rem', ...fontStyle }}>
                            Win/Loss Distribution
                        </Typography>
                        <Box sx={{ height: 350 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={winLossData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={8}
                                        dataKey="value"
                                        label={({ name, value, x, y, percent }) => {
                                            // Return the label string directly instead of an object
                                            return `${name}: ${value}`;
                                        }}
                                    >
                                        {winLossData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend content={<CustomLegend />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </Grid>

                {/* Game Performance Chart */}
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        p: 3,
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(148, 163, 184, 0.12)',
                        borderRadius: '16px',
                        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
                        backdropFilter: 'blur(24px)',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)',
                            borderColor: 'rgba(99, 102, 241, 0.3)'
                        }
                    }}>
                        <Typography variant="h6" sx={{ mb: 3, color: '#f8fafc', fontWeight: 600, fontSize: '1.125rem', ...fontStyle }}>
                            Game Performance Metrics
                        </Typography>
                        <Box sx={{ height: 350 }}>
                            <ResponsiveContainer>
                                <BarChart
                                    data={gameComparisonData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.12)" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500, fontFamily: 'Inter' }}
                                        axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                                    />
                                    <YAxis
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500, fontFamily: 'Inter' }}
                                        axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend content={<CustomLegend />} />
                                    <Bar
                                        dataKey="Win Rate"
                                        fill={COLORS.success}
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="ROI"
                                        fill={COLORS.primary}
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </Grid>

                {/* Investment Analysis */}
                <Grid item xs={12}>
                    <Card sx={{
                        p: 3,
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(148, 163, 184, 0.12)',
                        borderRadius: '16px',
                        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
                        backdropFilter: 'blur(24px)',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)',
                            borderColor: 'rgba(99, 102, 241, 0.3)'
                        }
                    }}>
                        <Typography variant="h6" sx={{ mb: 3, color: '#f8fafc', fontWeight: 600, fontSize: '1.125rem', ...fontStyle }}>
                            Investment vs Returns Analysis
                        </Typography>
                        <Box sx={{ height: 350 }}>
                            <ResponsiveContainer>
                                <LineChart
                                    data={gameStats}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.12)" />
                                    <XAxis
                                        dataKey="gameName"
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500, fontFamily: 'Inter' }}
                                        axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                                    />
                                    <YAxis
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500, fontFamily: 'Inter' }}
                                        axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend content={<CustomLegend />} />
                                    <Line
                                        type="monotone"
                                        dataKey="totalInvested"
                                        stroke={COLORS.primary}
                                        strokeWidth={3}
                                        dot={{ r: 6, strokeWidth: 2 }}
                                        activeDot={{ r: 8 }}
                                        name="Total Invested"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="totalWon"
                                        stroke={COLORS.success}
                                        strokeWidth={3}
                                        dot={{ r: 6, strokeWidth: 2 }}
                                        activeDot={{ r: 8 }}
                                        name="Total Won"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};