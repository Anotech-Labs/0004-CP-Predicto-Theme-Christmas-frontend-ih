// IllegalBetMonitor.jsx
import React from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress,
  ThemeProvider,
  createTheme,
  Paper
} from '@mui/material';
import { FilterBar } from '../../components/admin/illegal-bet-monitor/components/FilterBar';
import { ViolationsTable } from '../../components/admin/illegal-bet-monitor/components/ViolationsTable';
import { EnhancedStatistics } from '../../components/admin/illegal-bet-monitor/components/Statistics';
import { useIllegalBets } from '../../components/admin/illegal-bet-monitor/hooks/useIllegalBets';

// Dark theme configuration matching admin panel
const theme = createTheme({
  typography: {
    fontFamily: "'Inter', -apple-system, sans-serif",
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
      color: '#f8fafc',
      letterSpacing: '-0.02em'
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#f8fafc',
      letterSpacing: '-0.01em'
    },
    h6: {
      fontWeight: 600,
      color: '#f8fafc'
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
          backdropFilter: 'blur(24px)'
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

const IllegalBetMonitor = () => {
  const { 
    data, 
    loading, 
    error, 
    filters, 
    setFilters 
  } = useIllegalBets();

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px',
            gap: 3
          }}
        >
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
            Loading violation data...
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
            Error Loading Data
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

  if (!data) return null;

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
            // borderRadius: 0,
            borderRadius: '16px 16px 0 0',
            border: 'none',
            color: '#ffffff',
            
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
            Illegal Bet Monitor
            {data.statistics && (
              <Box
                component="span" 
                sx={{ 
                  fontSize: '0.875rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(12px)',
                  px: 3,
                  py: 1,
                  borderRadius: '20px',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#ffffff'
                }}
              >
                {`${data.statistics.totalViolations} violations detected`}
              </Box>
            )}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.1rem',
              fontWeight: 400
            }}
          >
            Monitor and track betting violations across all gaming platforms
          </Typography>
        </Paper>

        {/* Content Section */}
        <Box sx={{ px: { xs: 2, md: 3 } }}>
          {data.statistics && (
            <Box sx={{ mb: 4 }}>
              <EnhancedStatistics statistics={data.statistics} />
            </Box>
          )}

          <Box sx={{ mb: 3 }}>
            <FilterBar 
              filters={filters} 
              setFilters={setFilters} 
            />
          </Box>

          <ViolationsTable 
            data={data}
            loading={loading}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default IllegalBetMonitor;