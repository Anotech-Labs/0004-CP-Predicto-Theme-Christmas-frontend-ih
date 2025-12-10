import React, { useEffect } from 'react';
import { 
    Box, 
    FormControl, 
    Select, 
    MenuItem, 
    TextField,
    InputLabel,
    Grid,
    Tooltip,
    IconButton,
    Alert
} from '@mui/material';
import { Info } from '@mui/icons-material';

export const DateRangeSelector = ({
    filter,
    setFilter,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    userId,
    setUserId
}) => {
    // Validate dates when filter type is custom
    useEffect(() => {
        if (filter === 'custom') {
            if (!customStartDate) {
                setCustomStartDate(new Date().toISOString().split('T')[0]);
            }
            if (!customEndDate) {
                setCustomEndDate(new Date().toISOString().split('T')[0]);
            }
        }
    }, [filter]);

    // Handle date changes with validation
    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setCustomStartDate(newStartDate);
        
        // Ensure end date is not before start date
        if (customEndDate && newStartDate > customEndDate) {
            setCustomEndDate(newStartDate);
        }
    };

    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        if (customStartDate && newEndDate < customStartDate) {
            // If end date is before start date, set it to start date
            setCustomEndDate(customStartDate);
        } else {
            setCustomEndDate(newEndDate);
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Grid container spacing={2} alignItems="flex-start">
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel id="date-filter-label" sx={{ color: 'rgba(255, 255, 255, 0.7)', '&.Mui-focused': { color: '#f8fafc' } }}>Time Period</InputLabel>
                        <Select
                            labelId="date-filter-label"
                            value={filter}
                            onChange={(e) => {
                                setFilter(e.target.value);
                                if (e.target.value !== 'custom') {
                                    setCustomStartDate(null);
                                    setCustomEndDate(null);
                                }
                            }}
                            size="small"
                            sx={{ 
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                color: '#f8fafc',
                                borderRadius: '12px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.2)'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.3)'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)'
                                },
                                '& .MuiSvgIcon-root': {
                                    color: '#f8fafc'
                                }
                            }}
                            label="Time Period"
                        >
                            <MenuItem value="today">Today</MenuItem>
                            <MenuItem value="yesterday">Yesterday</MenuItem>
                            <MenuItem value="this_week">This Week</MenuItem>
                            <MenuItem value="last_week">Last Week</MenuItem>
                            <MenuItem value="this_month">This Month</MenuItem>
                            <MenuItem value="last_month">Last Month</MenuItem>
                            <MenuItem value="custom">Custom Range</MenuItem>
                            <MenuItem value="all_time">All Time</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {filter === 'custom' && (
                    <>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                type="date"
                                size="small"
                                value={customStartDate || ''}
                                onChange={handleStartDateChange}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        color: '#f8fafc',
                                        borderRadius: '12px',
                                        '& fieldset': {
                                            borderColor: 'rgba(255, 255, 255, 0.2)'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(255, 255, 255, 0.3)'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'rgba(255, 255, 255, 0.5)'
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'rgba(255, 255, 255, 0.7)'
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#f8fafc'
                                    }
                                }}
                                InputLabelProps={{ shrink: true }}
                                label="Start Date"
                                required
                                error={filter === 'custom' && !customStartDate}
                                helperText={filter === 'custom' && !customStartDate ? 'Start date is required' : ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                type="date"
                                size="small"
                                value={customEndDate || ''}
                                onChange={handleEndDateChange}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        color: '#f8fafc',
                                        borderRadius: '12px',
                                        '& fieldset': {
                                            borderColor: 'rgba(255, 255, 255, 0.2)'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(255, 255, 255, 0.3)'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'rgba(255, 255, 255, 0.5)'
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'rgba(255, 255, 255, 0.7)'
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#f8fafc'
                                    }
                                }}
                                InputLabelProps={{ shrink: true }}
                                label="End Date"
                                required
                                error={filter === 'custom' && !customEndDate}
                                helperText={filter === 'custom' && !customEndDate ? 'End date is required' : ''}
                                inputProps={{
                                    min: customStartDate // Prevent selecting date before start date
                                }}
                            />
                        </Grid>
                    </>
                )}

                <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            fullWidth
                            size="small"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value.trim())}
                            label="User ID"
                            placeholder="Enter user ID"
                            sx={{ 
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    color: '#f8fafc',
                                    borderRadius: '12px',
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.2)'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.3)'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#f8fafc'
                                },
                                '& input::placeholder': {
                                    color: 'rgba(255, 255, 255, 0.5)'
                                }
                            }}
                        />
                        <Tooltip title="Enter user ID to view specific user's profit/loss">
                            <IconButton size="small" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                                <Info fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Grid>
            </Grid>

            {filter === 'custom' && (!customStartDate || !customEndDate) && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    Please select both start and end dates for custom date range
                </Alert>
            )}
        </Box>
    );
};
