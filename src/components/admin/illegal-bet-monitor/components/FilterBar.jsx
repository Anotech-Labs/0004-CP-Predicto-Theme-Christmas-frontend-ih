import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  TextField,
  Grid,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Button,
  Chip,
  useTheme,
  alpha,
  useMediaQuery,
  Collapse,
  Tooltip
} from '@mui/material';
import {
  Clear as ClearIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Timeline as StatsIcon,
  FilterAlt as FilterAltIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

export const FilterBar = ({ filters, setFilters, onRefresh }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleDateChange = (e, field) => {
    setFilters(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleClearFilters = () => {
    const today = new Date().toISOString().split('T')[0];
    setFilters({
      page: 1,
      limit: filters.limit,
      startDate: today,
      endDate: '2026-12-31',
      minIllegalBets: '',
      search: '',
      sortOrder: 'desc'
    });
    setShowAdvancedFilters(false);
  };

  const hasActiveFilters = () => {
    return filters.startDate || filters.endDate || 
           filters.search || filters.minIllegalBets;
  };

  const hasAdvancedFilters = () => {
    return filters.search || filters.minIllegalBets;
  };

  const getActiveFilters = () => {
    const active = [];
    if (filters.startDate) {
      active.push({ 
        label: `From: ${new Date(filters.startDate).toLocaleDateString()}`, 
        key: 'startDate' 
      });
    }
    if (filters.endDate) {
      active.push({ 
        label: `To: ${new Date(filters.endDate).toLocaleDateString()}`, 
        key: 'endDate' 
      });
    }
    if (filters.search) active.push({ label: `User: ${filters.search}`, key: 'search' });
    if (filters.minIllegalBets) {
      active.push({ 
        label: `Min Bets: ${filters.minIllegalBets}`, 
        key: 'minIllegalBets' 
      });
    }
    return active;
  };

  const handleRemoveFilter = (key) => {
    const today = new Date().toISOString().split('T')[0];
    if (key === 'startDate') {
      setFilters(prev => ({ ...prev, [key]: today }));
    } else if (key === 'endDate') {
      setFilters(prev => ({ ...prev, [key]: '2026-12-31' }));
    } else {
      setFilters(prev => ({ ...prev, [key]: '' }));
    }
  };

  const renderTextField = (props) => (
    <TextField
      {...props}
      fullWidth
      variant="outlined"
      size={isMobile ? "small" : "medium"}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          transition: 'all 0.2s ease-in-out',
          borderRadius: 1,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
            }
          },
          '&.Mui-focused': {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
              borderWidth: 2
            }
          }
        }
      }}
    />
  );

  return (
    <Card
      elevation={0}
      sx={{
        background: alpha(theme.palette.background.paper, 0.9),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: 2,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: `0px 4px 20px ${alpha(theme.palette.common.black, 0.1)}`
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5 
          }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: 2,
                backgroundColor: hasActiveFilters() 
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.grey[500], 0.1),
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <FilterAltIcon 
                sx={{ 
                  color: hasActiveFilters() 
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary,
                  fontSize: 24,
                  transition: 'all 0.2s ease-in-out'
                }}
              />
            </Box>
            <Box>
              <Typography 
                variant={isMobile ? "subtitle1" : "h6"} 
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  lineHeight: 1.2
                }}
              >
                Illegal Bets Filter
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  display: 'block'
                }}
              >
                {hasActiveFilters() 
                  ? `${getActiveFilters().length} active filters`
                  : 'No custom filters applied'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {hasActiveFilters() && (
              <Button
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                sx={{
                  borderColor: alpha(theme.palette.error.main, 0.5),
                  color: theme.palette.error.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.05),
                    borderColor: theme.palette.error.main
                  }
                }}
              >
                Clear
              </Button>
            )}
            <Tooltip title="Refresh Data">
              <IconButton
                onClick={onRefresh}
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            {renderTextField({
              type: "date",
              label: "Start Date",
              value: filters.startDate,
              onChange: (e) => handleDateChange(e, 'startDate'),
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                )
              },
              InputLabelProps: { shrink: true }
            })}
          </Grid>

          <Grid item xs={12} sm={6}>
            {renderTextField({
              type: "date",
              label: "End Date",
              value: filters.endDate,
              onChange: (e) => handleDateChange(e, 'endDate'),
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                )
              },
              InputLabelProps: { shrink: true }
            })}
          </Grid>
        </Grid>

        {hasActiveFilters() && (
          <Box sx={{ mb: 2 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1 
              }}
            >
              {getActiveFilters().map(filter => (
                <Chip
                  key={filter.key}
                  label={filter.label}
                  onDelete={() => handleRemoveFilter(filter.key)}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiChip-deleteIcon': {
                      color: theme.palette.primary.main,
                      '&:hover': {
                        color: theme.palette.error.main
                      }
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        <Button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          startIcon={showAdvancedFilters ? <ExpandMoreIcon /> : <ChevronRightIcon />}
          sx={{
            color: theme.palette.text.secondary,
            mb: showAdvancedFilters ? 2 : 0,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            }
          }}
        >
          Advanced Search
          {hasAdvancedFilters() && (
            <Chip
              label={getActiveFilters().filter(f => 
                f.key === 'search' || f.key === 'minIllegalBets'
              ).length}
              size="small"
              sx={{
                ml: 1,
                height: 20,
                backgroundColor: theme.palette.primary.main,
                color: 'white'
              }}
            />
          )}
        </Button>

        <Collapse in={showAdvancedFilters}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {renderTextField({
                label: "Search by User ID",
                value: filters.search,
                onChange: (e) => setFilters(prev => ({ 
                  ...prev, 
                  search: e.target.value 
                })),
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                  endAdornment: filters.search && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setFilters(prev => ({ 
                          ...prev, 
                          search: '' 
                        }))}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              })}
            </Grid>

            <Grid item xs={12} sm={6}>
              {renderTextField({
                type: "number",
                label: "Minimum Illegal Bets",
                value: filters.minIllegalBets,
                onChange: (e) => setFilters(prev => ({ 
                  ...prev, 
                  minIllegalBets: e.target.value 
                })),
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <StatsIcon sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                  endAdornment: filters.minIllegalBets && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setFilters(prev => ({ 
                          ...prev, 
                          minIllegalBets: '' 
                        }))}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              })}
            </Grid>
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
};

FilterBar.propTypes = {
  filters: PropTypes.shape({
    page: PropTypes.number,
    limit: PropTypes.number,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    minIllegalBets: PropTypes.string,
    search: PropTypes.string,
    sortOrder: PropTypes.oneOf(['asc', 'desc'])
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired
};

export default FilterBar;