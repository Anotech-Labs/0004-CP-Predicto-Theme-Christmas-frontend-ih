import React, { useState, useEffect, useMemo, useContext } from "react";
import { useTheme, useMediaQuery, Collapse } from "@mui/material";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserContext } from "../../context/UserState";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { useSpring, animated } from "@react-spring/web";
import {
  Menu as MenuIcon,
  Public as PublicIcon,
//   BuildOutlined as BuildOutlinedIcon,
  AccountCircle as AccountCircleIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
//   Notifications as NotificationsIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
//   Settings as SettingsIcon,
//   CardGiftcard as GiftIcon,
//   ManageHistory as ManageHistoryIcon,
//   ReceiptLong as ReceiptLongIcon,
} from "@mui/icons-material";

const drawerWidth = {
  xs: '100%',
  sm: 280,
  md: 280,
  lg: 280
};

// Enhanced theme configuration with a more vibrant color palette
const themeColors = {
  primary: {
    main: '#5E35FF', // More vibrant purple
    light: '#8E6DFF',
    dark: '#4520D9',
  },
  secondary: {
    main: '#FF8A47', // Orange for accent
    light: '#FFAC79',
    dark: '#E66C25',
  },
  background: {
    default: '#F7F9FC', // Lighter base background
    paper: '#FFFFFF',
    drawer: 'rgba(25, 28, 58, 0.98)', // Slightly lighter drawer background
    appBar: 'rgba(25, 28, 58, 0.98)',
    card: '#FFFFFF',
    highlight: 'rgb(36, 19, 102,0.6)', // Light purple for highlights
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.75)',
    disabled: 'rgba(255, 255, 255, 0.5)',
    dark: '#2A2F52',
  },
  border: {
    light: 'rgba(255, 255, 255, 0.1)',
    dark: 'rgba(0, 0, 0, 0.08)',
  },
  success: {
    main: '#36B37E',
    light: '#6FCF97',
  },
  warning: {
    main: '#FFAB00',
    light: '#FFD666',
  },
  error: {
    main: '#FF5252',
    light: '#FF8A8A',
  },
  info: {
    main: '#2196F3',
    light: '#64B5F6',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #5E35FF 0%, #7D5FFE 100%)',
    blue: 'linear-gradient(180deg, #0F1D40 0%, #274BA6 100%)',
    secondary: 'linear-gradient(135deg, #FF8A47 0%, #FFB17A 100%)',
    success: 'linear-gradient(135deg, #36B37E 0%, #6FCF97 100%)',
  }
};

// Enhanced styled components with glassmorphism and improved transitions
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "#0F1D40",
  backdropFilter: 'blur(10px)',
  borderBottom: `1px solid ${themeColors.border.light}`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    background: themeColors.gradients.blue,
    backdropFilter: 'blur(12px)',
    borderRight: `1px solid ${themeColors.border.light}`,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  },
}));

const ScrollContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  height: 'calc(100% - 120px)',
  '&::-webkit-scrollbar': {
    width: '5px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: alpha(themeColors.text.primary, 0.2),
    borderRadius: '6px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: alpha(themeColors.text.primary, 0.3),
  },
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  margin: '5px 10px',
  borderRadius: '10px',
  transition: 'all 0.3s ease',
  backgroundColor: active ? alpha(themeColors.background.highlight, 0.6) : 'transparent',
  '&:hover': {
    background: themeColors.primary.main,
    transform: 'translateX(4px)',
  },
  '& .MuiListItemIcon-root': {
    color: active ? "#ececec" : themeColors.text.secondary,
    minWidth: {
      xs: '36px',
      sm: '40px',
    },
    transition: 'color 0.3s ease',
  },
  '& .MuiListItemText-primary': {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: active ? 600 : 500,
    fontSize: {
      xs: '0.825rem',
      sm: '0.875rem',
    },
    color: active ? themeColors.text.primary : themeColors.text.secondary,
    letterSpacing: '0.01em',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const AppLogoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 0',
  '& img': {
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    }
  }
}));

const ProfileBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 10px',
  borderRadius: '14px',
  background: alpha(themeColors.primary.main, 0.1),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: alpha(themeColors.primary.main, 0.15),
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  }
}));

// Get drawer items function with enhanced icons
const getDrawerItems = (accountType) => {
  const itemSets = {
    AGENT: [
      { text: "Dashboard", icon: <DashboardIcon />, link: "/agent/agent-dashboard" },
    //   { text: "Transactions", icon: <ReceiptLongIcon />, link: "/agent/transactions" },
    //   { text: "Analytics", icon: <ManageHistoryIcon />, link: "/agent/analytics" },
    //   { text: "Rewards", icon: <GiftIcon />, link: "/agent/rewards" },
    //   { text: "Settings", icon: <SettingsIcon />, link: "/agent/settings" },
    ],
  };

  return itemSets[accountType] || [];
};

const DrawerItem = React.memo(({ item, isActive, level = 0 }) => {
  const [open, setOpen] = useState(false);

  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: level * 100,
    config: { tension: 280, friction: 20 },
  });

  const handleClick = () => {
    if (item.subItems) {
      setOpen(!open);
    }
  };

  const indentPadding = {
    xs: level * 1.5,
    sm: level * 2,
  };

  if (item.subItems) {
    return (
      <animated.div style={springProps}>
        <StyledListItem
          button
          onClick={handleClick}
          active={isActive ? 1 : 0}
          sx={{ pl: 2 + indentPadding }}
        >
          <ListItemIcon>
            <animated.div style={springProps}>
              {item.icon}
            </animated.div>
          </ListItemIcon>
          <ListItemText
            primary={item.text}
            sx={{
              '& .MuiTypography-root': {
                transition: 'font-weight 0.2s ease',
              }
            }}
          />
          <animated.div style={springProps}>
            {open ? (
              <ExpandLessIcon sx={{
                color: isActive ? themeColors.text.primary : themeColors.text.secondary,
                transition: 'color 0.3s ease'
              }} />
            ) : (
              <ExpandMoreIcon sx={{
                color: isActive ? themeColors.text.primary : themeColors.text.secondary,
                transition: 'color 0.3s ease'
              }} />
            )}
          </animated.div>
        </StyledListItem>
        <Collapse in={open} timeout={300} unmountOnExit>
          <List component="div" disablePadding>
            {item.subItems.map((subItem, index) => (
              <DrawerItem
                key={`${subItem.text}-${index}`}
                item={subItem}
                isActive={isActive}
                level={level + 1}
              />
            ))}
          </List>
        </Collapse>
      </animated.div>
    );
  }

  return (
    <animated.div style={springProps}>
      <StyledListItem
        button
        component={Link}
        to={item.link}
        active={isActive ? 1 : 0}
        sx={{
          pl: 2 + indentPadding,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '4px',
            height: isActive ? '70%' : '0%',
            background: "#ececec",
            borderRadius: '0 4px 4px 0',
            transition: 'height 0.3s ease',
          }
        }}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
      </StyledListItem>
    </animated.div>
  );
});

const DrawerContent = React.memo(({ items, currentPath }) => (
  <List sx={{ padding: '6px 0' }}>
    {items.map((item, index) => (
      <DrawerItem
        key={`${item.text}-${index}`}
        item={item}
        isActive={
          currentPath === item.link ||
          item.subItems?.some((subItem) => currentPath === subItem.link)
        }
      />
    ))}
  </List>
));

const ProfileMenu = React.memo(({ anchorEl, handleClose, handleLogout }) => {
  const springProps = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 280, friction: 20 },
  });

  return (
    <Menu
      id="profile-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{
        sx: {
          mt: 1.5,
          background: themeColors.gradients.blue,
          backdropFilter: 'blur(12px)',
          border: `1px solid ${themeColors.border.light}`,
          borderRadius: '16px',
          minWidth: '220px',
          overflow: 'visible',
          filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.15))',
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            background: themeColors.gradients.blue,
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
            borderLeft: `1px solid ${themeColors.border.light}`,
            borderTop: `1px solid ${themeColors.border.light}`,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <animated.div style={springProps}>
        
        <MenuItem
          onClick={handleClose}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            py: 1.5,
            mx: 1,
            my: 1,
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
          }}
        >
          <ListItemIcon>
            <PersonIcon sx={{ color: themeColors.text.primary }} />
          </ListItemIcon>
          <ListItemText
            primary="Profile Settings"
            primaryTypographyProps={{
              sx: {
                color: themeColors.text.primary,
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
              }
            }}
          />
        </MenuItem>
        
        <MenuItem
          onClick={handleLogout}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            py: 1.5,
            mx: 1,
            mb: 1,
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: 'rgba(255, 99, 71, 0.15)',
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: themeColors.error.light }} />
          </ListItemIcon>
          <ListItemText
            primary="Log Out"
            primaryTypographyProps={{
              sx: {
                color: themeColors.error.light,
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
              }
            }}
          />
        </MenuItem>
      </animated.div>
    </Menu>
  );
});

const AdminPanel = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const [logoUrl, setLogoUrl] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const location = useLocation();
  const { accountType } = useContext(UserContext);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // Set initial drawer state based on screen size
  useEffect(() => {
    setDrawerOpen(isLargeScreen);
  }, [isLargeScreen]);

  // Notification badge animation
  // const notificationBadgeProps = useSpring({
  //   from: { scale: 0.8, opacity: 0 },
  //   to: { scale: 1, opacity: 1 },
  //   config: { tension: 200, friction: 15 }
  // });

  // Close drawer on location change for non-large screens
  useEffect(() => {
    if (!isLargeScreen) {
      setDrawerOpen(false);
    }
    setLoadingProgress(100);
  }, [location, isLargeScreen]);

  const handleDrawerToggle = () => {
    if (!isLargeScreen) {
      setDrawerOpen(!drawerOpen);
    }
  };

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);

  const handleProfileMenuClose = () => setAnchorEl(null);

  const handleGoHome = () => {
    navigate("/");
    if (isMobile) setMobileOpen(false);
  };

  // const handleGoSetting = () => {
  //   navigate("/admin/system-setting");
  //   if (isMobile) setMobileOpen(false);
  // };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    // Reset scroll position when location changes
    window.scrollTo(0, 0);
    document.body.style.overflow = 'auto'; // Ensure body can scroll
    
    // Set timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      setLoadingProgress(100);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location]);

  const drawerItems = useMemo(() => getDrawerItems(accountType), [accountType]);

  const drawer = useMemo(
    () => (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: themeColors.gradients.blue,
      }}>
        <Toolbar sx={{ px: 2.5 }}>
          <AppLogoBox
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
              py: 1,
            }}
          >
            <Box
              component="img"
              sx={{
                height: { xs: 40, sm: 45 },
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
              }}
              alt="Logo"
              src={logoUrl || "/assets/logo/colorLogo.webp"}
            />
          </AppLogoBox>
        </Toolbar>
        <Divider sx={{ 
          borderColor: themeColors.border.light,
          opacity: 0.5,
          mx: 2
        }} />
        
        <ScrollContainer>
          <Box sx={{ py: 1 }}>
            <DrawerContent items={drawerItems} currentPath={location.pathname} />
          </Box>
        </ScrollContainer>
        <Divider sx={{ 
          borderColor: themeColors.border.light,
          opacity: 0.5,
          mx: 2
        }} />
        <Box sx={{ p: 3 }}>
          <Box sx={{
            p: 2,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(80, 47, 212, 0.5) 0%, rgba(78, 57, 161, 0.832) 100%)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(94, 53, 255, 0.8)',
            textAlign: 'center',
          }}>
            <Typography
              variant="body2"
              sx={{
                color: themeColors.text.primary,
                fontWeight: 500,
                mb: 1
              }}
            >
              2025 Agent Dashboard
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: themeColors.text.secondary,
                display: 'block',
              }}
            >
              Version 1.0.0
            </Typography>
          </Box>
        </Box>
      </Box>
    ),
    [drawerItems, location.pathname, logoUrl]
  );

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      maxWidth: '100vw',
      overflow: 'hidden',
      backgroundColor: themeColors.background.default
    }}>
      <CssBaseline />

      <StyledAppBar
        position="fixed"
        sx={{
          width: {
            xs: '100%',
            lg: drawerOpen ? `calc(100% - ${drawerWidth.lg}px)` : '100%'
          },
          ml: {
            xs: 0,
            lg: drawerOpen ? `${drawerWidth.lg}px` : 0
          }
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 64, sm: 70 },
            display: 'flex',
            justifyContent: 'space-between',
            px: { xs: 2, sm: 3 },
            gap: 2
          }}
        >
          {/* Left side - Title and Menu Icon */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flex: '1 1 auto'
          }}>
            {!isLargeScreen && (
              <IconButton
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  color: themeColors.text.primary,
                  background: alpha(themeColors.primary.main, 0.1),
                  borderRadius: '10px',
                  '&:hover': {
                    background: alpha(themeColors.primary.main, 0.15),
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
{/* 
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            >
              Agent Dashboard
            </Typography>
            
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              background: alpha(themeColors.primary.main, 0.1),
              borderRadius: '10px',
              px: 1.5,
              py: 0.75,
              gap: 1 
            }}>
              <Typography
                variant="caption"
                sx={{
                  color: themeColors.text.secondary,
                  fontWeight: 500,
                }}
              >
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </Typography>
            </Box> */}
          </Box>

          {/* Right side - Action Icons */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            ml: 'auto' // Pushes to the right
          }}>

            <Tooltip title="Go to Website" arrow>
              <IconButton
                onClick={handleGoHome}
                size="medium"
                sx={{
                  color: themeColors.text.primary,
                  background: alpha(themeColors.primary.main, 0.1),
                  borderRadius: '10px',
                  '&:hover': {
                    background: alpha(themeColors.primary.main, 0.15),
                  },
                }}
              >
                <PublicIcon />
              </IconButton>
            </Tooltip>

            <ProfileBadge onClick={handleProfileMenuOpen}>
            <AccountCircleIcon sx={{ color: themeColors.text.primary }} />
            </ProfileBadge>
          </Box>
        </Toolbar>

        <LinearProgress
          variant="determinate"
          value={loadingProgress}
          sx={{
            height: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            '& .MuiLinearProgress-bar': {
              background: themeColors.gradients.primary,
              transition: 'width 0.6s cubic-bezier(0.65, 0, 0.35, 1)',
            },
          }}
        />
      </StyledAppBar>

      <StyledDrawer
        variant={isLargeScreen ? "permanent" : "temporary"}
        open={isLargeScreen ? true : drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: {
              xs: drawerWidth.xs,
              sm: drawerWidth.sm,
              md: drawerWidth.md,
              lg: drawerWidth.lg
            },
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </StyledDrawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: '100%',
            lg: drawerOpen ? `calc(100% - ${drawerWidth.lg}px)` : '100%'
          },
          minHeight: '100vh',
          height: '100%',
          pt: { xs: '67px', sm: '73px' },
          pb: 4,
          px: { xs: 2, sm: 3, lg: 4 },
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          background: "#f6f9ff",
          transition: 'padding 0.3s ease',
        }}
      >

        
        {/* Main Content */}
        <Box
          sx={{
            borderRadius: 3,
            background: "#f6f9ff",
            // p: { xs: 2, sm: 3 },
            // boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            flexGrow: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            // border: `1px solid ${themeColors.border.dark}`,
            // mt: 2,
            '& > *': {
              mb: 3,
              '&:last-child': {
                mb: 0
              }
            }
          }}
        >
          {children}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: 3,
            textAlign: 'center',
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha(themeColors.background.paper, 0.7),
            backdropFilter: 'blur(8px)',
            border: `1px solid ${themeColors.border.dark}`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: alpha(themeColors.text.dark, 0.7),
              fontWeight: 500,
            }}
          >
            © 2025 Admin Panel. All rights reserved.
          </Typography>
        </Box>
      </Box>
      
      <ProfileMenu
        anchorEl={anchorEl}
        handleClose={handleProfileMenuClose}
        handleLogout={handleLogout}
      />
    </Box>
  );
};

export default React.memo(AdminPanel)