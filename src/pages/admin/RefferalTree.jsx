import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Avatar,
    TextField,
    Button,
    IconButton,
    alpha,
    Chip,
    Slider,
    Tooltip,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Person as PersonIcon,
    AccountBalanceWallet as WalletIcon,
    Phone as PhoneIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    AccountTree as TreeIcon,
    Search as SearchIcon,
    CurrencyRupee as RupeeIcon,
    ZoomIn as ZoomInIcon,
    ZoomOut as ZoomOutIcon,
    FitScreen as FitScreenIcon,
    Group as GroupIcon,
    Timeline as TimelineIcon,
    Layers as LayersIcon,
    Close as CloseIcon
} from '@mui/icons-material';

// Colors configuration - Dark Theme
const colors = {
    primary: '#6366f1',
    secondary: '#818cf8',
    surface: '#1e293b',
    background: '#0f172a',
    border: 'rgba(148, 163, 184, 0.12)',
    text: {
        primary: '#f8fafc',
        secondary: '#94a3b8',
    },
    level: {
        0: '#4338CA',
        1: '#06B6D4',
        2: '#10B981',
        3: '#8B5CF6',
        4: '#F59E0B',
        5: '#EC4899',
        6: '#0EA5E9',
        7: '#14B8A6',
        8: '#4F46E5',
        9: '#F97316',
    }
};

// Styled components
const RootContainer = styled(Paper)(({ theme }) => ({
    backgroundColor: colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    margin: theme.spacing(2),
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(148, 163, 184, 0.12)',
    fontFamily: 'Inter, sans-serif',
    height: 'calc(100vh - 32px)',
    display: 'flex',
    flexDirection: 'column',
}));

const Header = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#FFF',
    fontFamily: 'Inter, sans-serif',
}));

const SearchField = styled(TextField)({
    '& .MuiInputBase-root': {
        height: 40,
        fontFamily: 'Inter, sans-serif',
        backgroundColor: alpha('#000', 0.08),
        borderRadius: 8,
        color: '#fff',
        backdropFilter: 'blur(8px)',
        '& fieldset': {
            borderColor: 'transparent',
        },
        '&:hover fieldset': {
            borderColor: alpha('#fff', 0.2),
        },
        '&.Mui-focused fieldset': {
            borderColor: alpha('#fff', 0.3),
        },
    },
    '& .MuiInputBase-input': {
        padding: '8px 12px',
    },
});

// Update TreeContainer to allow scrolling on mobile
const TreeContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4, 2),
    backgroundColor: colors.background,
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative',
    height: 'calc(100vh - 140px)', // Account for header height
    '@media (max-width: 768px)': {
        padding: theme.spacing(3, 1),
        height: 'calc(100vh - 120px)', // Slightly adjusted for mobile
    },
}));

const PanZoomContainer = styled(Box)(({ scale }) => ({
    transformOrigin: '50% 0',
    transform: `scale(${scale})`,
    transition: 'transform 0.3s ease',
    cursor: 'grab',
    '&:active': {
        cursor: 'grabbing',
    },
    width: 'fit-content',
    margin: '0 auto',
    padding: '32px',
    minHeight: '100%',
    '@media (max-width: 768px)': {
        padding: '16px',
    }
}));

const NodeCard = styled(Paper)(({ theme, level = 0 }) => ({
    width: 280,
    padding: theme.spacing(2),
    borderRadius: 16,
    backgroundColor: colors.surface,
    border: '1px solid',
    borderColor: alpha(colors.level[level % 10] || colors.level[0], 0.2),
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    fontFamily: 'Inter, sans-serif',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(24px)',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 32px ${alpha(colors.level[level % 10] || colors.level[0], 0.2)}`,
        borderColor: alpha(colors.level[level % 10] || colors.level[0], 0.4),
    }
}));

const LevelBadge = styled(Chip)(({ theme, level = 0 }) => ({
    position: 'absolute',
    top: 12,
    right: 12,
    height: 24,
    backgroundColor: alpha(colors.level[level % 10] || colors.level[0], 0.1),
    color: colors.level[level % 10] || colors.level[0],
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: '0.75rem',
    '& .MuiChip-label': {
        padding: '0 8px',
    },
}));

const LevelContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(8),
    marginTop: theme.spacing(6),
    position: 'relative',
    minWidth: 'fit-content',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -theme.spacing(3),
        left: '50%',
        width: 1,
        height: theme.spacing(3),
        backgroundColor: alpha(colors.primary, 0.12),
    },
}));

const NodeConnector = styled(Box)(({ theme, isFirst, isLast }) => ({
    position: 'absolute',
    top: -theme.spacing(2),
    left: isFirst ? '50%' : 0,
    right: isLast ? '50%' : 0,
    height: 1,
    backgroundColor: alpha(colors.primary, 0.12),
}));

const InfoText = styled(Typography)(() => ({
    fontSize: '0.8125rem',
    color: colors.text.secondary,
    fontFamily: 'Inter, sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    padding: '2px 4px',
    borderRadius: 4,
    '&:hover': {
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
    },
}));

// Update ZoomControls for better responsiveness
const ZoomControls = styled(Box)(({ theme }) => ({
    position: 'fixed',
    right: theme.spacing(4),
    top: '60%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    zIndex: 1000,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: theme.spacing(1.5),
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(24px)',
    border: `1px solid rgba(148, 163, 184, 0.12)`,
    '@media (max-width: 1200px)': {
        right: theme.spacing(2),
    },
    '@media (max-width: 768px)': {
        right: theme.spacing(1),
        padding: theme.spacing(1),
        gap: theme.spacing(0.5),
    },
}));

const StatusMessage = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: theme.spacing(3),
    left: '50%',
    transform: 'translateX(-50%)',
    padding: theme.spacing(1, 2),
    backgroundColor: colors.surface,
    color: colors.text.primary,
    borderRadius: 12,
    backdropFilter: 'blur(24px)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(148, 163, 184, 0.12)',
    zIndex: 10,
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

// TreeNode component for rendering individual nodes
const TreeNode = ({ node, level = 0 }) => {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = node.children?.length > 0;
    const createdDate = new Date(node.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <Box sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 'fit-content',
            margin: '16px 0',
        }}>
            <NodeCard level={level}>
                <LevelBadge
                    level={level}
                    label={`Level ${level}`}
                    icon={<TreeIcon sx={{ fontSize: 12 }} />}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: alpha(colors.level[level % 10] || colors.level[0], 0.1),
                            color: colors.level[level % 10] || colors.level[0],
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            fontSize: '1.125rem',
                        }}
                    >
                        {node.userName?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Box sx={{ ml: 1.5 }}>
                        <Typography sx={{
                            fontWeight: 600,
                            fontSize: '0.8375rem',
                            color: colors.text.primary,
                            fontFamily: 'Inter, sans-serif',
                        }}>
                            {node.userName || 'User'}
                        </Typography>
                        <Typography sx={{
                            fontSize: '0.75rem',
                            color: colors.text.secondary,
                            fontFamily: 'Inter, sans-serif',
                        }}>
                            ID: {node.uid} • {createdDate}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ mt: 1.5 }}>
                    <InfoText>
                        <PersonIcon sx={{ fontSize: 16, color: colors.level[level % 10] || colors.level[0] }} />
                        {node.accountType || 'Standard'}
                    </InfoText>
                    <InfoText>
                        <PhoneIcon sx={{ fontSize: 16, color: colors.level[level % 10] || colors.level[0] }} />
                        {node.mobile || 'N/A'}
                    </InfoText>
                    <InfoText>
                        <WalletIcon sx={{ fontSize: 16, color: colors.level[level % 10] || colors.level[0] }} />
                        <RupeeIcon sx={{ fontSize: 14 }} />
                        {node.walletBalance?.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }) || '0.00'}
                    </InfoText>
                </Box>

                {hasChildren && (
                    <Tooltip title={expanded ? "Collapse" : "Expand"}>
                        <IconButton
                            size="small"
                            onClick={() => setExpanded(!expanded)}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                bottom: 8,
                                padding: '4px',
                                color: colors.level[level % 10] || colors.level[0],
                                backgroundColor: alpha(colors.level[level % 10] || colors.level[0], 0.08),
                                '&:hover': {
                                    backgroundColor: alpha(colors.level[level % 10] || colors.level[0], 0.16),
                                },
                            }}
                        >
                            {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                )}
            </NodeCard>

            {hasChildren && expanded && (
                <LevelContainer>
                    {node.children.map((child, index) => (
                        <Box
                            key={child.uid || index}
                            sx={{
                                position: 'relative',
                                minWidth: 'fit-content'
                            }}
                        >
                            <NodeConnector
                                isFirst={index === 0}
                                isLast={index === node.children.length - 1}
                            />
                            <TreeNode
                                node={child}
                                level={level + 1}
                            />
                        </Box>
                    ))}
                </LevelContainer>
            )}
        </Box>
    );
};

// Summary component
const NetworkSummary = ({ data, open, onClose }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    bgcolor: colors.surface,
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(148, 163, 184, 0.12)',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
                }
            }}
        >
            <DialogTitle sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontFamily: 'Inter, sans-serif',
                }}>
                    <GroupIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
                    <Typography sx={{
                        fontFamily: 'Inter',
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        fontWeight: 600,
                        color: colors.text.primary,
                    }}>
                        Network Summary
                    </Typography>
                </Box>
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                        color: colors.text.secondary,
                        '&:hover': {
                            bgcolor: 'rgba(99, 102, 241, 0.1)'
                        }
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 2 }}>
                <Box sx={{ mb: 2 }}>
                    <InfoText>
                        <LayersIcon sx={{ fontSize: 16 }} />
                        Max Depth: Level {data.summary.maxDepth}
                    </InfoText>
                    <InfoText>
                        <GroupIcon sx={{ fontSize: 16 }} />
                        Total Users: {data.summary.totalUsers}
                    </InfoText>
                </Box>

                <Typography sx={{
                    fontSize: isMobile ? '0.8rem' : '0.875rem',
                    fontWeight: 600,
                    color: colors.text.primary,
                    mb: 1,
                    fontFamily: 'Inter, sans-serif',
                }}>
                    Level Distribution
                </Typography>

                {data.summary.levelCounts.map(({ level, count }) => (
                    <Box
                        key={level}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 0.5,
                        }}>
                        <Typography sx={{
                            fontSize: isMobile ? '0.7rem' : '0.75rem',
                            color: colors.text.secondary,
                            fontFamily: 'Inter, sans-serif',
                        }}>
                            Level {level}
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}>
                            <Box
                                sx={{
                                    width: isMobile ? 60 : 80,
                                    height: 4,
                                    borderRadius: 2,
                                    backgroundColor: alpha(colors.level[level % 10], 0.2),
                                }}
                            >
                                <Box
                                    sx={{
                                        width: `${(count / data.summary.totalUsers) * 100}%`,
                                        height: '100%',
                                        borderRadius: 2,
                                        backgroundColor: colors.level[level % 10],
                                    }}
                                />
                            </Box>
                            <Typography sx={{
                                fontSize: isMobile ? '0.7rem' : '0.75rem',
                                color: colors.text.secondary,
                                minWidth: isMobile ? 16 : 20,
                                textAlign: 'right',
                                fontFamily: 'Inter, sans-serif',
                            }}>
                                {count}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </DialogContent>
        </Dialog>
    );
};

// Main ReferralTree component
const ReferralTree = () => {
    const { axiosInstance } = useAuth();
    const [treeData, setTreeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState('');
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const [statusMessage, setStatusMessage] = useState(null);
    const [showSummary, setShowSummary] = useState(true);
    const [openSummary, setOpenSummary] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    // Add this line near other state declarations
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));


    // Add this useEffect for initial centering
    useEffect(() => {
        if (treeData && initialLoad) {
            // Center the view on first load
            const containerWidth = containerRef.current?.clientWidth || 0;
            const centerX = (containerWidth / 2) - 140; // 140 is half of NodeCard width (280/2)
            setPosition({ x: centerX, y: 0 });
            setInitialLoad(false);
        }
    }, [treeData]);

    // Add keyboard shortcut handling
    useEffect(() => {
        const handleKeyboard = (e) => {
            if (e.ctrlKey) {
                if (e.key === '=') {
                    e.preventDefault();
                    handleZoomIn();
                } else if (e.key === '-') {
                    e.preventDefault();
                    handleZoomOut();
                } else if (e.key === '0') {
                    e.preventDefault();
                    resetView();
                }
            }
        };

        window.addEventListener('keydown', handleKeyboard);
        return () => window.removeEventListener('keydown', handleKeyboard);
    }, [scale]);

    useEffect(() => {
        fetchTreeData();
    }, []);

    const fetchTreeData = async (uid) => {
        setLoading(true);
        try {
            const endpoint = uid ? `/api/admin/agent/referral-tree/${uid}` : '/api/admin/agent/referral-tree/2';
            const response = await axiosInstance.get(endpoint);
            setTreeData(response.data.data);
            setStatusMessage(`Loaded network for ID: ${response.data.data.uid}`);
            setTimeout(() => setStatusMessage(null), 3000);
        } catch (error) {
            console.error('Failed to fetch tree data:', error);
            setStatusMessage('Failed to load network data');
            setTimeout(() => setStatusMessage(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (searchId.trim()) {
            fetchTreeData(searchId.trim());
            resetView();
        }
    };

    const handleMouseDown = (e) => {
        if (e.button === 0) {
            setIsDragging(true);
            setStartPos({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && containerRef.current) {
            const newX = e.clientX - startPos.x;
            const newY = e.clientY - startPos.y;
            setPosition({ x: newX, y: newY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleZoomIn = () => {
        setScale(prev => {
            const newScale = Math.min(prev + 0.1, 2);
            setStatusMessage(`Zoom: ${Math.round(newScale * 100)}%`);
            setTimeout(() => setStatusMessage(null), 1000);
            return newScale;
        });
    };

    const handleZoomOut = () => {
        setScale(prev => {
            const newScale = Math.max(prev - 0.1, 0.3);
            setStatusMessage(`Zoom: ${Math.round(newScale * 100)}%`);
            setTimeout(() => setStatusMessage(null), 1000);
            return newScale;
        });
    };

    const resetView = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
        setStatusMessage('View reset');
        setTimeout(() => setStatusMessage(null), 1000);
    };

    const handleWheel = (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 0.1 : -0.1;
            const newScale = Math.max(0.3, Math.min(2, scale + delta));
            setScale(newScale);
            setStatusMessage(`Zoom: ${Math.round(newScale * 100)}%`);
            setTimeout(() => setStatusMessage(null), 1000);
        }
    };

    if (loading) {
        return (
            <RootContainer>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    fontFamily: 'Inter, sans-serif',
                }}>
                    <CircularProgress
                        size={32}
                        sx={{
                            color: colors.primary,
                            '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round',
                            },
                        }}
                    />
                </Box>
            </RootContainer>
        );
    }

    return (
        <RootContainer>
            <Header>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TreeIcon sx={{ mr: 1, fontSize: 24 }} />
                        <Typography sx={{
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            fontFamily: 'Inter, sans-serif',
                        }}>
                            Referral Network
                        </Typography>
                    </Box>
                    <Tooltip title="Show Network Summary">
                        <IconButton
                            onClick={() => setOpenSummary(true)}
                            sx={{ color: 'white' }}
                        >
                            <TimelineIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    backgroundColor: alpha('#fff', 0.08),
                    padding: '4px',
                    borderRadius: '15px 40px 40px 15px',
                }}>
                    <SearchField
                        placeholder="Enter User ID..."
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        size="small"
                        fullWidth
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ mr: 1, color: alpha('#fff', 0.7) }} />,
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{
                            backgroundColor: alpha('#fff', 0.12),
                            fontFamily: 'Inter, sans-serif',
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            borderRadius: 6,
                            px: 3,
                            minWidth: 'auto',
                            height: 40,
                            '&:hover': {
                                backgroundColor: alpha('#fff', 0.2),
                            },
                        }}
                    >
                        Search
                    </Button>
                </Box>
            </Header>

            <TreeContainer>
                {treeData && (
                    <NetworkSummary
                        data={treeData}
                        open={openSummary}
                        onClose={() => setOpenSummary(false)}
                    />
                )}

                <Box
                    ref={containerRef}
                    sx={{
                        height: '100%',
                        overflow: 'auto',  // Changed to 'auto' to enable touch scrolling
                        position: 'relative',
                        WebkitOverflowScrolling: 'touch', // Enable smooth scrolling on iOS
                        '&::-webkit-scrollbar': {
                            width: '8px',
                            height: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: alpha(colors.primary, 0.2),
                            borderRadius: '4px',
                            '&:hover': {
                                background: alpha(colors.primary, 0.3),
                            }
                        },
                        '@media (max-width: 768px)': {
                            overflow: 'auto',
                            '-webkit-overflow-scrolling': 'touch',
                        }
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onWheel={handleWheel}
                    onTouchStart={(e) => {
                        setIsDragging(false); // Prevent drag during touch scroll
                    }}
                >
                    <PanZoomContainer
                        scale={scale}
                        style={{
                            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                            minHeight: '100%',
                            minWidth: 'fit-content',
                        }}
                    >
                        {treeData && <TreeNode node={treeData} />}
                    </PanZoomContainer>
                </Box>

                <ZoomControls>
                    <Tooltip title="Zoom In (Ctrl + =)">
                        <IconButton onClick={handleZoomIn} size="small" sx={{
                            color: colors.primary,
                            backgroundColor: alpha(colors.primary, 0.05),
                            padding: isMobile ? '4px' : '8px',
                            '&:hover': {
                                backgroundColor: alpha(colors.primary, 0.1),
                            }
                        }}>
                            <ZoomInIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Zoom Out (Ctrl + -)">
                        <IconButton onClick={handleZoomOut} size="small" sx={{
                            color: colors.primary,
                            backgroundColor: alpha(colors.primary, 0.05),
                            padding: isMobile ? '4px' : '8px',
                            '&:hover': {
                                backgroundColor: alpha(colors.primary, 0.1),
                            }
                        }}>
                            <ZoomOutIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Reset View (Ctrl + 0)">
                        <IconButton onClick={resetView} size="small" sx={{
                            color: colors.primary,
                            backgroundColor: alpha(colors.primary, 0.05),
                            padding: isMobile ? '4px' : '8px',
                            '&:hover': {
                                backgroundColor: alpha(colors.primary, 0.1),
                            }
                        }}>
                            <FitScreenIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                    </Tooltip>

                    <Box sx={{
                        px: isMobile ? 0.5 : 1,
                        py: 0.5,
                        display: isTablet ? 'none' : 'block' // Hide slider on smaller screens
                    }}>
                        <Typography sx={{
                            fontSize: '0.75rem',
                            color: colors.text.secondary,
                            fontFamily: 'Inter, sans-serif',
                            mb: 0.5,
                            textAlign: 'center'
                        }}>
                            {Math.round(scale * 100)}%
                        </Typography>
                        <Slider
                            size="small"
                            value={scale}
                            min={0.3}
                            max={2}
                            step={0.1}
                            onChange={(_, newValue) => {
                                setScale(newValue);
                                setStatusMessage(`Zoom: ${Math.round(newValue * 100)}%`);
                                setTimeout(() => setStatusMessage(null), 1000);
                            }}
                            sx={{
                                color: colors.primary,
                                height: 4,
                                width: isMobile ? 60 : 80,
                                '& .MuiSlider-thumb': {
                                    width: 12,
                                    height: 12,
                                },
                            }}
                        />
                    </Box>
                </ZoomControls>

                {statusMessage && (
                    <StatusMessage>
                        {statusMessage}
                    </StatusMessage>
                )}
            </TreeContainer>
        </RootContainer>
    );
};

export default ReferralTree;