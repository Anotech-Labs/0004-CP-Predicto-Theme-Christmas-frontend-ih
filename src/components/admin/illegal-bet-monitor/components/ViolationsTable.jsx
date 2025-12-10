import React, { useState, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Paper,
  Chip,
  Typography,
  Collapse,
  Box,
  IconButton,
  LinearProgress,
  Tooltip,
  Badge,
  Divider,
  TablePagination
} from '@mui/material';
import { format } from 'date-fns';

// Lightweight custom icons using pure SVG for better performance
const ChevronIcon = memo(({ isExpanded }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
));

// Memoized status indicator component
const StatusIndicator = memo(({ status, pulseColor }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: pulseColor,
      boxShadow: `0 0 0 4px ${pulseColor}33`,
      animation: status === 'ACTIVE' ? 'pulse 2s infinite' : 'none',
      '@keyframes pulse': {
        '0%': { boxShadow: `0 0 0 0 ${pulseColor}66` },
        '70%': { boxShadow: `0 0 0 6px ${pulseColor}00` },
        '100%': { boxShadow: `0 0 0 0 ${pulseColor}00` }
      }
    }}
  />
));

// Memoized violation type badge
const ViolationBadge = memo(({ type }) => {
  const getViolationColor = (violationType) => {
    const colors = {
      SIZE_CONFLICT: '#ef4444',
      NUMBER_CONFLICT: '#f59e0b',
      BIG_SMALL_CONFLICT: '#3b82f6',
      ODD_EVEN_CONFLICT: '#8b5cf6'
    };
    return colors[violationType] || '#6b7280';
  };

  return (
    <Box
      sx={{
        px: 2,
        py: 0.5,
        borderRadius: '4px',
        backgroundColor: `${getViolationColor(type)}15`,
        color: getViolationColor(type),
        fontSize: '0.75rem',
        fontWeight: 600,
        display: 'inline-block'
      }}
    >
      {type.split('_').join(' ')}
    </Box>
  );
});

// Memoized details panel component
const DetailsPanel = memo(({ user }) => {
  const gameStatistics = useMemo(() => Object.entries(user.gameSpecificStats), [user.gameSpecificStats]);

  return (
    <Box sx={{ py: 3, px: 4, bgcolor: '#1e293b' }}>
      {/* User Overview Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ color: '#f8fafc', mb: 2, fontWeight: 600 }}>
          User Overview
        </Typography>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Progress Status
            </Typography>
            <Box sx={{ position: 'relative', mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={user.progressPercentage}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  bgcolor: '#e2e8f0',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: user.progressPercentage > 70 ? '#10b981' : '#3b82f6'
                  }
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: -20,
                  fontWeight: 600,
                  color: '#64748b'
                }}
              >
                {user.progressPercentage}%
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Game Statistics Grid */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ color: '#f8fafc', mb: 2, fontWeight: 600 }}>
          Game Statistics
        </Typography>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 2
        }}>
          {gameStatistics.map(([game, stats]) => (
            <Paper
              key={game}
              elevation={0}
              sx={{
                p: 2,
                border: '1px solid rgba(148, 163, 184, 0.12)',
                borderRadius: 2,
                bgcolor: '#0f172a'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                  {game}
                </Typography>
                <Chip
                  label={`${stats.violationCount} violations`}
                  size="small"
                  sx={{
                    bgcolor: stats.violationCount > 5 ? '#fee2e2' : '#f1f5f9',
                    color: stats.violationCount > 5 ? '#ef4444' : '#64748b',
                    fontWeight: 500
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Last Violation: {format(new Date(stats.lastViolation.timestamp), 'MMM dd, yyyy HH:mm')}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Recent Violations Timeline */}
      <Box>
        <Typography variant="h6" sx={{ color: '#f8fafc', mb: 3, fontWeight: 600 }}>
          Recent Violations Timeline
        </Typography>
        <Box sx={{ position: 'relative' }}>
          {user.recentViolations.map((violation, index) => (
            <Box
              key={violation.periodId}
              sx={{
                position: 'relative',
                pl: 4,
                pb: 3,
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  left: '7px',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  bgcolor: index === user.recentViolations.length - 1 ? 'transparent' : '#e2e8f0'
                }
              }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: '#3b82f6',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  border: '3px solid #1e293b',
                  boxShadow: '0 0 0 2px #bfdbfe'
                }}
              />
              <Box
                sx={{
                  bgcolor: '#0f172a',
                  border: '1px solid rgba(148, 163, 184, 0.12)',
                  borderRadius: 2,
                  p: 2
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <ViolationBadge type={violation.violationType} />
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(violation.timestamp), 'MMM dd, HH:mm')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  {violation.conflictingBets.map((bet, idx) => (
                    <Chip
                      key={idx}
                      label={bet}
                      size="small"
                      sx={{
                        bgcolor: '#f1f5f9',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
});

// Main table component with pagination
export const ViolationsTable = memo(({ data, loading }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  // Add pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  if (!data?.users?.length) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          bgcolor: '#f8fafc',
          border: '1px dashed',
          borderColor: 'divider'
        }}
      >
        <Typography color="text.secondary">No violations found</Typography>
      </Paper>
    );
  }

  const handleRowClick = (userId) => {
    setExpandedRow(expandedRow === userId ? null : userId);
  };

  // Handlers for pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // Close expanded row when changing page
    setExpandedRow(null);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    // Close expanded row when changing rows per page
    setExpandedRow(null);
  };

  // Get paginated data
  const paginatedUsers = data.users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '8px 8px 0 0',
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>User ID</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Violations</TableCell>
              <TableCell>Risk Level</TableCell>
              <TableCell>Last Violation</TableCell>
              <TableCell>Game Type</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <React.Fragment key={user.userId}>
                <TableRow
                  hover
                  onClick={() => handleRowClick(user.userId)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f8fafc' },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell padding="checkbox">
                    <IconButton size="small" sx={{ transition: 'transform 0.2s' }}>
                      <ChevronIcon isExpanded={expandedRow === user.userId} />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontWeight: 500 }}>{user.userId}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.userName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.mobile}</TableCell>
                  <TableCell>
                    <Badge
                      badgeContent={user.totalIllegalBets}
                      color={user.totalIllegalBets > 10 ? 'error' : 'primary'}
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.75rem',
                          height: 20,
                          minWidth: 20,
                          fontWeight: 600
                        }
                      }}
                    >
                      <Box sx={{ width: 24 }} /> {/* Spacer */}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.riskLevel}
                      size="small"
                      sx={{
                        bgcolor: user.riskLevel === 'HIGH' ? '#fee2e2' :
                          user.riskLevel === 'MEDIUM' ? '#fef3c7' : '#dcfce7',
                        color: user.riskLevel === 'HIGH' ? '#ef4444' :
                          user.riskLevel === 'MEDIUM' ? '#f59e0b' : '#10b981',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={format(new Date(user.lastIllegalBet.timestamp), 'MMMM dd, yyyy HH:mm:ss')}>
                      <Typography variant="body2">
                        {format(new Date(user.lastIllegalBet.timestamp), 'MMM dd, HH:mm')}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{user.lastIllegalBet.gameType}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StatusIndicator
                        status={user.accountStatus}
                        pulseColor={user.accountStatus === 'ACTIVE' ? '#10b981' : '#ef4444'}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: user.accountStatus === 'ACTIVE' ? '#10b981' : '#ef4444',
                          fontWeight: 500
                        }}
                      >
                        {user.accountStatus}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={8}
                    sx={{
                      p: 0,
                      borderBottom: expandedRow === user.userId ? '1px solid' : 'none',
                      borderColor: 'divider'
                    }}
                  >
                    <Collapse in={expandedRow === user.userId} timeout={200}>
                      <DetailsPanel user={user} />
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add TablePagination component */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
  borderLeft: '1px solid rgba(148, 163, 184, 0.12)',
  borderRight: '1px solid rgba(148, 163, 184, 0.12)',
  borderBottom: '1px solid rgba(148, 163, 184, 0.12)', 
  borderRadius: '0 0 16px 16px',
  bgcolor: '#1e293b',
  color: '#f8fafc'
}}
      />
    </>
  );
});

// PropTypes definitions
ViolationsTable.propTypes = {
  data: PropTypes.shape({
    users: PropTypes.arrayOf(PropTypes.shape({
      userId: PropTypes.number,
      userName: PropTypes.string,
      mobile: PropTypes.string,
      totalIllegalBets: PropTypes.number,
      lastIllegalBet: PropTypes.shape({
        timestamp: PropTypes.string,
        gameType: PropTypes.string
      }),
      accountStatus: PropTypes.string,
      riskLevel: PropTypes.string,
      progressPercentage: PropTypes.number,
      gameSpecificStats: PropTypes.object,
      recentViolations: PropTypes.arrayOf(PropTypes.shape({
        periodId: PropTypes.string,
        timestamp: PropTypes.string,
        gameType: PropTypes.string,
        violationType: PropTypes.string,
        conflictingBets: PropTypes.arrayOf(PropTypes.string)
      }))
    }))
  }),
  loading: PropTypes.bool
};

// Performance optimizations
const MemoizedTooltip = memo(({ children, title }) => (
  <Tooltip title={title}>{children}</Tooltip>
));

// Custom hook for table sorting and filtering
const useTableControls = (data) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const requestSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  return { sortedData, requestSort, sortConfig };
};

// Enhanced table header component
const TableHeader = memo(({ onSort, sortConfig }) => {
  const headers = [
    { id: 'userId', label: 'User ID' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'totalIllegalBets', label: 'Violations' },
    { id: 'riskLevel', label: 'Risk Level' },
    { id: 'lastViolation', label: 'Last Violation' },
    { id: 'gameType', label: 'Game Type' },
    { id: 'status', label: 'Status' }
  ];

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        {headers.map((header) => (
          <TableCell
            key={header.id}
            onClick={() => onSort(header.id)}
            sx={{
              cursor: 'pointer',
              userSelect: 'none',
              color: '#475569',
              fontWeight: 600,
              '&:hover': {
                color: '#1e293b'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {header.label}
              {sortConfig.key === header.id && (
                <Box
                  component="span"
                  sx={{
                    width: 0,
                    height: 0,
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderTop: sortConfig.direction === 'desc' ? '4px solid currentColor' : 'none',
                    borderBottom: sortConfig.direction === 'asc' ? '4px solid currentColor' : 'none',
                    ml: 1
                  }}
                />
              )}
            </Box>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
});

// Export enhanced version with all optimizations and pagination
export default memo(function EnhancedViolationsTable({ data, loading }) {
  const { sortedData, requestSort, sortConfig } = useTableControls(data?.users || []);
  const [expandedRow, setExpandedRow] = useState(null);

  // Add pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Handlers for pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setExpandedRow(null); // Close expanded row when changing page
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setExpandedRow(null); // Close expanded row when changing rows per page
  };

  // Get current page data
  const paginatedData = useMemo(() => {
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  // Memoized row renderer
  const renderTableRows = useMemo(() => {
    return paginatedData.map((user) => (
      <React.Fragment key={user.userId}>
        <TableRow
          hover
          onClick={() => setExpandedRow(expandedRow === user.userId ? null : user.userId)}
          sx={{
            cursor: 'pointer',
            '&:hover': { bgcolor: '#f8fafc' },
            transition: 'background-color 0.2s',
            bgcolor: expandedRow === user.userId ? '#f1f5f9' : 'inherit'
          }}
        >
          <TableCell padding="checkbox">
            <IconButton size="small" sx={{ transition: 'transform 0.2s' }}>
              <ChevronIcon isExpanded={expandedRow === user.userId} />
            </IconButton>
          </TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontWeight: 500 }}>{user.userId}</Typography>
              <Typography variant="caption" color="text.secondary">
                {user.userName}
              </Typography>
            </Box>
          </TableCell>
          <TableCell>{user.mobile}</TableCell>
          <TableCell>
            <Badge
              badgeContent={user.totalIllegalBets}
              color={user.totalIllegalBets > 10 ? 'error' : 'primary'}
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.75rem',
                  height: 20,
                  minWidth: 20,
                  fontWeight: 600
                }
              }}
            >
              <Box sx={{ width: 24 }} /> {/* Spacer */}
            </Badge>
          </TableCell>
          <TableCell>
            <Chip
              label={user.riskLevel}
              size="small"
              sx={{
                bgcolor: user.riskLevel === 'HIGH' ? '#fee2e2' :
                  user.riskLevel === 'MEDIUM' ? '#fef3c7' : '#dcfce7',
                color: user.riskLevel === 'HIGH' ? '#ef4444' :
                  user.riskLevel === 'MEDIUM' ? '#f59e0b' : '#10b981',
                fontWeight: 600,
                fontSize: '0.75rem'
              }}
            />
          </TableCell>
          <TableCell>
            <Tooltip title={format(new Date(user.lastIllegalBet.timestamp), 'MMMM dd, yyyy HH:mm:ss')}>
              <Typography variant="body2">
                {format(new Date(user.lastIllegalBet.timestamp), 'MMM dd, HH:mm')}
              </Typography>
            </Tooltip>
          </TableCell>
          <TableCell>{user.lastIllegalBet.gameType}</TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StatusIndicator
                status={user.accountStatus}
                pulseColor={user.accountStatus === 'ACTIVE' ? '#10b981' : '#ef4444'}
              />
              <Typography
                variant="body2"
                sx={{
                  color: user.accountStatus === 'ACTIVE' ? '#10b981' : '#ef4444',
                  fontWeight: 500
                }}
              >
                {user.accountStatus}
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={8} sx={{ p: 0 }}>
            <Collapse in={expandedRow === user.userId} timeout={200}>
              <DetailsPanel user={user} />
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    ));
  }, [paginatedData, expandedRow]);

  if (!data?.users?.length) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          bgcolor: '#f8fafc',
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        <Typography color="text.secondary">No violations found</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '8px 8px 0 0',
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHeader onSort={requestSort} sortConfig={sortConfig} />
          <TableBody>
            {renderTableRows}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add TablePagination component */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderLeft: '1px solid',
          borderRight: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'divider',
          borderRadius: '0 0 8px 8px',
          bgcolor: 'white'
        }}
      />
    </Box>
  );
});