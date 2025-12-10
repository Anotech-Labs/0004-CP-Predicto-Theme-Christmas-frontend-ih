import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    Divider
} from '@mui/material';
import { DateRangeSelector } from '../../components/admin/profit-loss/components/DateRangeSelector';
import { SummaryCards } from '../../components/admin/profit-loss/components/SummaryCards';
import { GameStatsList } from '../../components/admin/profit-loss/components/GameStatsList';
import { ProfitLossCharts } from '../../components/admin/profit-loss/components/ProfitLossCharts';
import { useProfitLoss } from '../../components/admin/profit-loss/hooks/useProfitLoss';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
    typography: {
        fontFamily: "'Inter', -apple-system, sans-serif",
        h4: {
            fontWeight: 700,
            fontSize: '2rem',
            color: '#f8fafc',
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem'
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.5rem',
            color: '#f8fafc',
            letterSpacing: '-0.01em'
        },
        h6: {
            fontWeight: 600,
            color: '#f8fafc',
            fontSize: '1.25rem'
        },
        body1: {
            color: '#94a3b8'
        },
        body2: {
            color: '#64748b'
        }
    },
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
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(148, 163, 184, 0.12)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
                    backdropFilter: 'blur(24px)'
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
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
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '12px',
                    padding: '10px 20px',
                    fontSize: '0.9375rem'
                },
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
                    fontWeight: 600,
                    borderRadius: '8px',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    color: '#818cf8',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                }
            }
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(15, 23, 42, 0.5)'
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    color: '#f8fafc',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)'
                },
                body: {
                    color: '#94a3b8',
                    borderColor: 'rgba(148, 163, 184, 0.12)'
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(15, 23, 42, 0.5)',
                        borderRadius: '12px',
                        '& fieldset': {
                            borderColor: 'rgba(148, 163, 184, 0.12)'
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(99, 102, 241, 0.5)'
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#6366f1'
                        }
                    }
                }
            }
        }
    }
});

const ProfitAndLoss = () => {
    const [filter, setFilter] = useState('today');
    const [customStartDate, setCustomStartDate] = useState(null);
    const [customEndDate, setCustomEndDate] = useState(null);
    const [userId, setUserId] = useState('');

    const { data, loading, error, fetchProfitLoss } = useProfitLoss();

    useEffect(() => {
        // Only fetch if we have both dates when filter is custom
        if (filter === 'custom' && (!customStartDate || !customEndDate)) {
            return;
        }
        fetchProfitLoss(filter, customStartDate, customEndDate, userId);
    }, [filter, customStartDate, customEndDate, userId]);

    if (loading) {
        return (
            <ThemeProvider theme={theme}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    gap: 3,
                    bgcolor: 'background.default'
                }}>
                    <CircularProgress
                        size={48}
                        thickness={4}
                        sx={{
                            color: '#6366f1',
                            filter: 'drop-shadow(0 4px 8px rgba(99, 102, 241, 0.3))'
                        }}
                    />
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: '#94a3b8',
                            fontWeight: 500
                        }}
                    >
                        Loading profit and loss data...
                    </Typography>
                </Box>
            </ThemeProvider>
        );
    }

    if (error) {
        return (
            <ThemeProvider theme={theme}>
                <Paper
                    elevation={0}
                    sx={{ 
                        p: 3,
                        m: 2,
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px'
                    }}
                >
                    <Typography 
                        variant="h6"
                        sx={{
                            color: '#ef4444',
                            fontWeight: 600,
                            mb: 1
                        }}
                    >
                        ⚠️ Error Loading Data
                    </Typography>
                    <Typography 
                        sx={{ 
                            color: '#f87171',
                            fontSize: '0.9375rem'
                        }}
                    >
                        {error}
                    </Typography>
                </Paper>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Box 
                sx={{ 
                    bgcolor: 'background.default',
                    minHeight: '100vh',
                    p: 3,
                    borderRadius: '16px'
                }}
            >
                {/* Header Section */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 4 },
                        mb: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '16px 16px 0 0',
                        border: 'none',
                        color: '#ffffff'
                    }}
                >
                    <Typography 
                        variant="h4" 
                        sx={{
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            color: '#ffffff',
                            fontWeight: 700
                        }}
                    >
                        Profit and Loss Analysis
                        
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '1.1rem',
                            fontWeight: 400,
                            mb: 3
                        }}
                    >
                        Monitor and analyze gaming revenue, profits, and performance metrics
                    </Typography>

                    {/* Filters Section */}
                    <DateRangeSelector
                        filter={filter}
                        setFilter={setFilter}
                        customStartDate={customStartDate}
                        setCustomStartDate={setCustomStartDate}
                        customEndDate={customEndDate}
                        setCustomEndDate={setCustomEndDate}
                        userId={userId}
                        setUserId={setUserId}
                    />
                </Paper>

                {/* Content Section */}
                <Box sx={{ px: { xs: 2, md: 3 } }}>
                    {data && (
                        <>
                            <Box sx={{ mb: 4 }}>
                                <ProfitLossCharts summary={data.summary} gameStats={data.gameStats} />
                            </Box>
                            
                            <Box sx={{ mb: 4 }}>
                                <SummaryCards summary={data.summary} />
                            </Box>
                            
                            <GameStatsList gameStats={data.gameStats} />
                        </>
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default ProfitAndLoss;