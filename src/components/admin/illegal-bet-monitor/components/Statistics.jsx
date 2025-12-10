import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  LinearProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Lock as LockIcon,
  Timeline as TimelineIcon,
  SportsEsports as GamepadIcon,
  ErrorOutline as AlertCircleIcon
} from '@mui/icons-material';

const StatCard = ({ title, value, icon: Icon, color, subtitle, progress }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        backgroundColor: '#1e293b',
        border: '1px solid rgba(148, 163, 184, 0.12)',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(24px)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)',
          borderColor: 'rgba(99, 102, 241, 0.3)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: 3 
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
              sx={{ 
                p: 1.5, 
                borderRadius: 2,
                bgcolor: alpha(color, 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon 
                sx={{ 
                  fontSize: 24,
                  color: color
                }}
              />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              {title}
            </Typography>
          </Box>
          {typeof progress === 'number' && (
            <Box 
              sx={{ 
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                bgcolor: alpha(color, 0.12),
                color: color
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {progress}%
              </Typography>
            </Box>
          )}
        </Box>
        
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            mb: 1,
            color: theme.palette.text.primary
          }}
        >
          {typeof value === 'number' ? value.toLocaleString() : '-'}
        </Typography>
        
        {subtitle && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 500
            }}
          >
            {subtitle}
          </Typography>
        )}
        
        {typeof progress === 'number' && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(color, 0.12),
                '& .MuiLinearProgress-bar': {
                  bgcolor: color,
                  borderRadius: 3
                }
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const ViolationsByGame = ({ byGameType }) => {
  const theme = useTheme();
  const total = Object.values(byGameType).reduce((a, b) => a + b, 0);
  
  return (
    <Card sx={{ 
      height: '100%',
      backgroundColor: '#1e293b',
      border: '1px solid rgba(148, 163, 184, 0.12)',
      borderRadius: '16px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
      backdropFilter: 'blur(24px)'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Box 
            sx={{ 
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.12)
            }}
          >
            <GamepadIcon 
              sx={{ 
                fontSize: 24,
                color: theme.palette.primary.main
              }}
            />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Violations by Game
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          {Object.entries(byGameType)
            .filter(([_, count]) => count > 0)
            .map(([game, count]) => (
              <Box key={game} sx={{ mb: 3, '&:last-child': { mb: 0 } }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 1 
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: theme.palette.text.primary
                    }}
                  >
                    {game}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      fontWeight: 500
                    }}
                  >
                    {count.toLocaleString()} violations
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    width: '100%',
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    borderRadius: 2,
                    height: 8,
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      width: `${(count / total) * 100}%`,
                      bgcolor: theme.palette.primary.main,
                      height: '100%',
                      transition: 'width 0.5s ease'
                    }}
                  />
                </Box>
              </Box>
            ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const RiskAnalysis = ({ riskLevelDistribution }) => {
  const theme = useTheme();
  const total = Object.values(riskLevelDistribution).reduce((a, b) => a + b, 0);
  
  const riskColors = {
    HIGH: theme.palette.error.main,
    MEDIUM: theme.palette.warning.main,
    LOW: theme.palette.success.main
  };

  return (
    <Card sx={{ 
      height: '100%',
      backgroundColor: '#1e293b',
      border: '1px solid rgba(148, 163, 184, 0.12)',
      borderRadius: '16px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
      backdropFilter: 'blur(24px)'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Box 
            sx={{ 
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'rgba(148, 163, 184, 0.12)'
            }}
          >
            <AlertCircleIcon 
              sx={{ 
                fontSize: 24,
                color: '#94a3b8'
              }}
            />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Risk Level Analysis
          </Typography>
        </Box>

        {Object.entries(riskLevelDistribution).map(([level, count]) => (
          <Box key={level} sx={{ mb: 3, '&:last-child': { mb: 0 } }}>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mb: 1 
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: riskColors[level]
                  }}
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    color: theme.palette.text.primary
                  }}
                >
                  {level}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontWeight: 500
                }}
              >
                {total > 0 ? ((count / total) * 100).toFixed(1) : '0'}%
              </Typography>
            </Box>
            <Box 
              sx={{ 
                width: '100%',
                bgcolor: 'rgba(148, 163, 184, 0.12)',
                borderRadius: 2,
                height: 8,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  width: total > 0 ? `${(count / total) * 100}%` : '0%',
                  bgcolor: riskColors[level],
                  height: '100%',
                  transition: 'width 0.5s ease'
                }}
              />
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export const EnhancedStatistics = ({ statistics }) => {
  const theme = useTheme();
  const { 
    totalViolations = 0,
    activeViolators = 0,
    lockedViolators = 0,
    byGameType = {},
    riskLevelDistribution = {}
  } = statistics || {};

  return (
    <Grid container spacing={3} mb={3}>
      <Grid item xs={12} md={6} lg={3}>
        <StatCard
          title="Total Violations"
          value={totalViolations}
          icon={TrendingUpIcon}
          color={theme.palette.primary.main}
          subtitle="Across all games"
        />
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        <StatCard
          title="Active Violators"
          value={activeViolators}
          icon={WarningIcon}
          color={theme.palette.error.main}
          progress={activeViolators > 0 ? 24 : 0}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        <StatCard
          title="Locked Accounts"
          value={lockedViolators}
          icon={LockIcon}
          color={theme.palette.warning.main}
          subtitle="Suspended due to violations"
        />
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        <StatCard
          title="Violation Rate"
          value={activeViolators > 0 ? Number((totalViolations / activeViolators).toFixed(1)) : 0}
          icon={TimelineIcon}
          color={theme.palette.success.main}
          subtitle="Avg. violations per user"
        />
      </Grid>

      <Grid item xs={12} md={8}>
        <ViolationsByGame byGameType={byGameType} />
      </Grid>

      <Grid item xs={12} md={4}>
        <RiskAnalysis riskLevelDistribution={riskLevelDistribution} />
      </Grid>
    </Grid>
  );
};

export default EnhancedStatistics;