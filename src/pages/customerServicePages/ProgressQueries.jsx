import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Slide,
  AppBar,
  Toolbar,
  DialogContentText,
  useMediaQuery,
} from '@mui/material';
import axios from 'axios';

// Import icons
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import ReplyIcon from "@mui/icons-material/Reply";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Mobile from '../../components/layout/Mobile';
import { domain } from '../../utils/Secret'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { useTheme } from "@mui/material/styles";

// Transition for mobile dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Status color mapping
const statusColors = {
  OPEN: '#ff9800', // orange
  CLOSED: '#4caf50', // green
  IN_PROGRESS: '#2196f3', // blue
  RESOLVED: '#8bc34a', // light green
};

// Type icons mapping
const typeIcons = {
  WITHDRAWAL_PROBLEM: '💸',
  DEPOSIT_NOT_RECEIVED: '💰',
  GAME_PROBLEMS: '🎮',
  ACTIVITY_BONUS: '🎁',
  OTHERS: '❓',
  ADD_USDT_ADDRESS: '📝',
};

// Text formatter to normalize capitalization
const formatText = (text) => {
  if (!text) return '';

  // Convert from UPPER_CASE format to Title Case format
  return text
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// File type icon helper
const getFileIcon = (fileType) => {
  if (fileType.includes('image')) return <ImageIcon />;
  if (fileType.includes('pdf')) return <PictureAsPdfIcon />;
  return <InsertDriveFileIcon />;
};

const ProgressQueries = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const lastTicketElementRef = useRef(null);
  const { axiosInstance } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(400));

  // Fetch tickets from API
  const fetchTickets = async (reset = false) => {
    if (loading) return;

    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;

      // Don't fetch if we've reached the last page
      if (!reset && currentPage > totalPages) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get(`${domain}/api/ticket/user`, {
        params: {
          page: currentPage,
          limit: 10,
          status: filterStatus !== 'ALL' ? filterStatus : undefined,
          search: search || undefined
        }
      });

      const responseData = response.data.data;

      if (reset) {
        setTickets(responseData.tickets || []);
      } else {
        setTickets(prev => [...prev, ...(responseData.tickets || [])]);
      }

      // Update pagination information
      setTotalPages(responseData.pagination?.totalPages || 1);
      setHasMore(currentPage < (responseData.pagination?.totalPages || 1));

      // Update page number for next fetch
      setPage(reset ? 2 : currentPage + 1);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchTickets(true);
  }, [filterStatus]);

  // Handle search input
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Execute search on Enter key
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchTickets(true);
    }
  };

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!lastTicketElementRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchTickets(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(lastTicketElementRef.current);

    return () => {
      if (lastTicketElementRef.current) {
        observer.unobserve(lastTicketElementRef.current);
      }
    };
  }, [hasMore, loading, tickets]);

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseTicketDetail = () => {
    setSelectedTicket(null);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleViewAttachment = (attachment) => {
    // Check if it's an image type
    if (attachment.fileType.includes('image')) {
      setCurrentImage(attachment);
      setImageViewerOpen(true);
    } else {
      // For non-image files, you might want to download or open in a new tab
      window.open(attachment.fileUrl || `${domain}/api/attachments/${attachment.id}`, '_blank');
    }
  };

  const handleCloseImageViewer = () => {
    setImageViewerOpen(false);
    setCurrentImage(null);
  };

  return (
    <Mobile>
      <Container disableGutters maxWidth="xs" sx={{
        bgcolor: "#232626", height: "100vh", display: "flex", flexDirection: "column",
        "&.MuiContainer-root": { maxWidth: "100%" }
      }}>
        {/* Header */}
        <Box sx={{ bgcolor: "#232626", padding: "8px 10px", display: "flex", alignItems: "center", color: "#FDE4BC" }}>
          <ChevronLeftIcon sx={{ fontSize: 30, cursor: "pointer" }} onClick={() => window.history.back()} />
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", color: "#FDE4BC" }}>
            Progress Queries
          </Typography>
          <HomeIcon sx={{ fontSize: 30, cursor: "pointer" }} onClick={() => navigate("/")} />
        </Box>

        {/* Search and Filter */}
        <Box sx={{ p: 2, bgcolor: "#232626" }}>
          {/* Dropdown filter replacing chips */}
          <FormControl fullWidth size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&.Mui-focused fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              },
              '& .MuiSvgIcon-root': { color: 'white' }
            }}>
            <Select
              value={filterStatus}
              onChange={handleFilterChange}
              displayEmpty
              sx={{
                bgcolor: "#323738",
                borderRadius: 1,
                color: "#A8A5A1", height: "40px",
                "& .MuiSelect-icon": { color: "#A8A5A1" },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#3B3833" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#3B3833" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3B3833" },
                "& .MuiSelect-select": { color: "#A8A5A1" }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#232626",
                    "& .MuiMenuItem-root": {
                      color: "#A8A5A1",
                      bgcolor: "#232626",
                      padding: "10px 16px",
                    },
                    "& .MuiMenuItem-root:hover": {
                      bgcolor: "transparent",
                    },
                    "& .MuiMenuItem-root.Mui-selected": {
                      bgcolor: "#323738",
                    },
                  },
                },
              }}
            >
              <MenuItem value="ALL">All tickets</MenuItem>
              <MenuItem value="OPEN">Open</MenuItem>
              <MenuItem value="IN_PROGRESS">In progress</MenuItem>
              <MenuItem value="RESOLVED">Resolved</MenuItem>
              <MenuItem value="CLOSED">Closed</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Ticket List */}
        <Box sx={{
          flexGrow: 1, p: 2, bgcolor: "#232626", overflowY: "auto",
          '&::-webkit-scrollbar': { // Hide scrollbar for WebKit browsers
            width: 0,
            background: 'transparent',
          },
          scrollbarWidth: 'none', // Hide scrollbar for Firefox
        }}>
          {tickets.length === 0 && !loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
                No tickets found
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {tickets.map((ticket, index) => (
                <ListItem
                  key={ticket.id}
                  disablePadding
                  sx={{ mb: 2, p: 0 }}
                  ref={index === tickets.length - 1 ? lastTicketElementRef : null}
                >
                  <Card
                    sx={{
                      width: '100%',
                      borderLeft: `4px solid ${statusColors[ticket.status] || '#757575'}`,
                      cursor: 'pointer',
                      bgcolor: '#323738',
                      color: '#FDE4BC'
                    }}
                    onClick={() => handleTicketClick(ticket)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle2" color="#A8A5A1" fontSize={isSmallScreen ? "12px" : "14px"}>
                          {ticket.ticketNumber}
                        </Typography>
                        <Chip
                          label={ticket.status === 'OPEN' ? 'Open' :
                            ticket.status === 'CLOSED' ? 'Closed' :
                              ticket.status === 'IN_PROGRESS' ? 'In progress' :
                                ticket.status === 'RESOLVED' ? 'Resolved' :
                                  formatText(ticket.status)}
                          sx={{
                            bgcolor: statusColors[ticket.status] || '#757575',
                            color: '#000',
                            fontWeight: 'bold',
                            fontSize: isSmallScreen ? "10px" : "12px",
                            p: isSmallScreen ? "5px" : "10px"
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5 }}>
                        <Avatar sx={{ width: isSmallScreen ? 25 : 28, height: isSmallScreen ? 25 : 28, fontSize: isSmallScreen ? "12px" : "14px", bgcolor: '#232626' }}>
                          {typeIcons[ticket.type] || '📝'}
                        </Avatar>
                        <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#f5f3f0', fontSize: isSmallScreen ? "13px" : "14px" }}>
                          {formatText(ticket.type)}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="#A8A5A1" noWrap sx={{ mb: 0.5, textTransform: "none", fontSize: isSmallScreen ? "12px" : "14px" }}>
                        {ticket.ticketDetails?.description ||
                          ticket.ticketDetails?.problemDescription ||
                          ticket.ticketDetails?.bonusDescription ||
                          ticket.ticketDetails?.issueDescription ||
                          `${formatText(ticket.type)} issue`}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: isSmallScreen ? "12px" : "14px" }} />
                          <Typography variant="caption" fontSize={isSmallScreen ? "10px" : "12px"} color="rgba(255, 255, 255, 0.5)">
                            {formatDate(ticket.createdAt)}
                          </Typography>
                        </Box>

                        {ticket.ticketAttachments && ticket.ticketAttachments.length > 0 && (
                          <Chip
                            icon={<AttachFileIcon fontSize="small" />}
                            label={ticket.ticketAttachments.length}
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: 'rgba(255, 255, 255, 0.3)', color: '#FDE4BC' }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </ListItem>
              ))}
            </List>
          )}

          {/* Loading indicator */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={30} sx={{ color: '#90caf9' }} />
            </Box>
          )}
        </Box>

        {/* Improved Ticket Detail Dialog for Mobile */}
        <Dialog
          open={Boolean(selectedTicket)}
          onClose={handleCloseTicketDetail}
          fullWidth
          fullScreen={isMobile}
          TransitionComponent={isMobile ? Transition : undefined}
          PaperProps={{
            style: {
              backgroundColor: '#232626',
              color: '#FDE4BC',
              margin: isMobile ? "20px" : undefined,
              borderRadius: isMobile ? 0 : undefined,
              maxWidth: "360px",
              // height: "70%"
            },
          }}
        >

          {selectedTicket && (
            <>
              {/* Mobile AppBar for fullscreen dialog */}
              {isMobile ? (
                <AppBar position="sticky" sx={{ bgcolor: '#323738' }}>
                  <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleCloseTicketDetail}>
                      <ChevronLeftIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1, fontSize: isSmallScreen ? "14px" : "16px" }} variant="h6">
                      {selectedTicket.ticketNumber}
                    </Typography>
                    <Chip
                      label={selectedTicket.status === 'OPEN' ? 'Open' :
                        selectedTicket.status === 'CLOSED' ? 'Closed' :
                          selectedTicket.status === 'IN_PROGRESS' ? 'In progress' :
                            selectedTicket.status === 'RESOLVED' ? 'Resolved' :
                              formatText(selectedTicket.status)}
                      size="small"
                      sx={{
                        bgcolor: statusColors[selectedTicket.status] || '#757575',
                        color: '#000',
                        fontWeight: 'bold'
                      }}
                    />
                  </Toolbar>
                </AppBar>
              ) : (
                <DialogTitle>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">{selectedTicket.ticketNumber}</Typography>
                    <Chip
                      label={selectedTicket.status === 'OPEN' ? 'Open' :
                        selectedTicket.status === 'CLOSED' ? 'Closed' :
                          selectedTicket.status === 'IN_PROGRESS' ? 'In progress' :
                            selectedTicket.status === 'RESOLVED' ? 'Resolved' :
                              formatText(selectedTicket.status)}
                      size="small"
                      sx={{
                        bgcolor: statusColors[selectedTicket.status] || '#757575',
                        color: '#000',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                </DialogTitle>
              )}

              <DialogContent
                dividers={!isMobile}
                sx={{
                  p: isMobile ? 2 : 3,
                  pb: isMobile ? 9 : 3 // Extra padding at bottom for mobile to account for fixed buttons
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  {formatText(selectedTicket.type)}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="#A8A5A1">Created on</Typography>
                  <Typography variant="body2" color="#A8A5A1">
                    {new Date(selectedTicket.createdAt).toLocaleString()}
                  </Typography>
                </Box>

                {/* Ticket Details */}
                <Box sx={{ mb: 3, p: 1.5, bgcolor: '#323738', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom color="#f5f3f0">Details</Typography>

                  {selectedTicket.type === 'WITHDRAWAL_PROBLEM' && selectedTicket.ticketDetails && (
                    <>
                      {selectedTicket.ticketDetails.withdrawalId && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px" }}>
                          <strong>Withdrawal id:</strong> {selectedTicket.ticketDetails.withdrawalId}
                        </Typography>
                      )}
                      {selectedTicket.ticketDetails.amount && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px", mt: 0.2 }}>
                          <strong>Amount:</strong> ${selectedTicket.ticketDetails.amount}
                        </Typography>
                      )}
                      {selectedTicket.ticketDetails.description && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px", mt: 0.2 }}>
                          <strong>Description:</strong> {selectedTicket.ticketDetails.description}
                        </Typography>
                      )}
                    </>
                  )}

                  {selectedTicket.type === 'DEPOSIT_NOT_RECEIVED' && selectedTicket.ticketDetails && (
                    <>
                      {selectedTicket.ticketDetails.utrNumber && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px" }}>
                          <strong>UTR number:</strong> {selectedTicket.ticketDetails.utrNumber}
                        </Typography>
                      )}
                      {selectedTicket.ticketDetails.receiverUpiId && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px", mt: 0.2 }}>
                          <strong>UPI id:</strong> {selectedTicket.ticketDetails.receiverUpiId}
                        </Typography>
                      )}
                      {selectedTicket.ticketDetails.orderNumber && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px", mt: 0.2 }}>
                          <strong>Order number:</strong> {selectedTicket.ticketDetails.orderNumber}
                        </Typography>
                      )}
                      {selectedTicket.ticketDetails.orderAmount && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px", mt: 0.2 }}>
                          <strong>Amount:</strong> ${selectedTicket.ticketDetails.orderAmount}
                        </Typography>
                      )}
                    </>
                  )}

                  {selectedTicket.type === 'GAME_PROBLEMS' && selectedTicket.ticketDetails && (
                    <>
                      {selectedTicket.ticketDetails.gameType && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px" }}>
                          {selectedTicket.ticketDetails.gameType && (
                            <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px" }}>
                              <strong>Game type:</strong> {selectedTicket.ticketDetails.gameType.charAt(0).toUpperCase() + selectedTicket.ticketDetails.gameType.slice(1).toLowerCase()}
                            </Typography>
                          )}
                        </Typography>
                      )}
                      {selectedTicket.ticketDetails.problemDescription && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px", mt: 0.2 }}>
                          <strong>Description:</strong> {selectedTicket.ticketDetails.problemDescription}
                        </Typography>
                      )}
                    </>
                  )}

                  {selectedTicket.type === 'ACTIVITY_BONUS' && selectedTicket.ticketDetails && (
                    <>
                      {selectedTicket.ticketDetails.bonusDescription && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px" }}>
                          <strong>Description:</strong> {selectedTicket.ticketDetails.bonusDescription}
                        </Typography>
                      )}
                    </>
                  )}

                  {selectedTicket.type === 'ADD_USDT_ADDRESS' && selectedTicket.ticketDetails && (
                    <>
                      {selectedTicket.ticketDetails.usdtAddress && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px" }}>
                          <strong>USDT Address:</strong> {selectedTicket.ticketDetails.usdtAddress}
                        </Typography>
                      )}
                      {selectedTicket.ticketDetails.description && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px" }}>
                          <strong>Description:</strong> {selectedTicket.ticketDetails.description || "USDT address addition request"}
                        </Typography>
                      )}
                    </>
                  )}

                  {selectedTicket.type === 'CHANGE_BANK_NAME' && selectedTicket.ticketDetails && (
                    <>
                      {selectedTicket.ticketDetails.currentBankName && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px" }}>
                          <strong>Current Bank Name:</strong> {selectedTicket.ticketDetails.currentBankName}
                        </Typography>
                      )}
                      {selectedTicket.ticketDetails.newBankName && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px", mt: 0.2 }}>
                          <strong>New Bank Name:</strong> {selectedTicket.ticketDetails.newBankName}
                        </Typography>
                      )}
                    </>
                  )}

                  {selectedTicket.type === 'IFSC_MODIFICATION' && selectedTicket.ticketDetails && (
                    <>
                      {selectedTicket.ticketDetails.currentIFSC && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px" }}>
                          <strong>Current IFSC:</strong> {selectedTicket.ticketDetails.currentIFSC}
                        </Typography>
                      )}
                      {selectedTicket.ticketDetails.newIFSC && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px", mt: 0.2 }}>
                          <strong>New IFSC:</strong> {selectedTicket.ticketDetails.newIFSC}
                        </Typography>
                      )}
                    </>
                  )}

                  {selectedTicket.type === 'MODIFY_BANK_INFO' && selectedTicket.ticketDetails && (
                    <>
                      {selectedTicket.ticketDetails.modificationType && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px" }}>
                          <strong>Modification Type:</strong> {selectedTicket.ticketDetails.modificationType}
                        </Typography>
                      )}
                      <Typography variant="subtitle2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px", mt: 1 }}>
                        Current Details:
                      </Typography>
                      {selectedTicket.ticketDetails.oldBankName && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px", mt: 0.2 }}>
                          <strong>Bank Name:</strong> {selectedTicket.ticketDetails.oldBankName}
                        </Typography>
                      )}
                      {selectedTicket.ticketDetails.oldBeneficiaryName && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px", mt: 0.2 }}>
                          <strong>Beneficiary Name:</strong> {selectedTicket.ticketDetails.oldBeneficiaryName}
                        </Typography>
                      )}
                      {selectedTicket.ticketDetails.oldAccountNumber && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px", mt: 0.2 }}>
                          <strong>Account Number:</strong> {selectedTicket.ticketDetails.oldAccountNumber}
                        </Typography>
                      )}
                      {selectedTicket.ticketDetails.oldIFSC && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px", mt: 0.2 }}>
                          <strong>IFSC:</strong> {selectedTicket.ticketDetails.oldIFSC}
                        </Typography>
                      )}
                      <Typography variant="subtitle2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px", mt: 1 }}>
                        New Details:
                      </Typography>
                      {selectedTicket.ticketDetails.newBankName && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px", mt: 0.2 }}>
                          <strong>Bank Name:</strong> {selectedTicket.ticketDetails.newBankName}
                        </Typography>
                      )}
                      {selectedTicket.ticketDetails.newBeneficiaryName && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px", mt: 0.2 }}>
                          <strong>Beneficiary Name:</strong> {selectedTicket.ticketDetails.newBeneficiaryName}
                        </Typography>
                      )}
                      {selectedTicket.ticketDetails.newAccountNumber && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px", mt: 0.2 }}>
                          <strong>Account Number:</strong> {selectedTicket.ticketDetails.newAccountNumber}
                        </Typography>
                      )}
                      {selectedTicket.ticketDetails.newIFSC && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px", mt: 0.2 }}>
                          <strong>IFSC:</strong> {selectedTicket.ticketDetails.newIFSC}
                        </Typography>
                      )}
                    </>
                  )}

                  {selectedTicket.type === 'OTHERS' && selectedTicket.ticketDetails && (
                    <>
                      {selectedTicket.ticketDetails.issueDescription && (
                        <Typography variant="body2" sx={{ color: "#A8A5A1", fontSize: isSmallScreen ? "12px" : "14px" }}>
                          <strong>Description:</strong> {selectedTicket.ticketDetails.issueDescription}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>

                {/* Attachments Section */}
                {selectedTicket.ticketAttachments && selectedTicket.ticketAttachments.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Attachments ({selectedTicket.ticketAttachments.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedTicket.ticketAttachments.map((attachment) => (
                        <Chip
                          key={attachment.id}
                          icon={getFileIcon(attachment.fileType)}
                          label={attachment.fileName?.substring(0, 15) || "File"}
                          onClick={() => handleViewAttachment(attachment)}
                          sx={{
                            bgcolor: '#323738',
                            color: '#FDE4BC',
                            '& .MuiChip-icon': { color: '#FDE4BC' }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Messages/Responses Section */}
                {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Messages
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {selectedTicket.responses.map((response) => (
                        <ListItem
                          key={response.id}
                          sx={{
                            p: 1.5,
                            bgcolor: '#323738',
                            borderRadius: 1,
                            mb: 1,
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                          }}
                        >
                          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="#f5f3f0">
                              {response.isAdmin ? 'Support Team' : 'You'}
                            </Typography>
                            <Typography variant="caption" color="#A8A5A1">
                              {formatDate(response.createdAt)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="#A8A5A1" sx={{ whiteSpace: 'pre-wrap' }}>
                            {response.message}
                          </Typography>

                          {/* Response attachments */}
                          {response.responseAttachments && response.responseAttachments.length > 0 && (
                            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {response.responseAttachments.map((attachment) => (
                                <Chip
                                  key={attachment.id}
                                  icon={getFileIcon(attachment.fileType)}
                                  label={attachment.fileName?.substring(0, 15) || "File"}
                                  onClick={() => handleViewAttachment(attachment)}
                                  size="small"
                                  sx={{
                                    bgcolor: '#232626',
                                    color: 'white',
                                    '& .MuiChip-icon': { color: 'white' }
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Actions based on ticket status */}
                {(selectedTicket.status === 'OPEN' || selectedTicket.status === 'IN_PROGRESS') && (
                  <DialogContentText sx={{ color: '#A8A5A1', fontSize: "14px", mt: 2 }}>
                    Our support team is reviewing your ticket. We'll respond as soon as possible.
                  </DialogContentText>
                )}

                {selectedTicket.status === 'RESOLVED' && (
                  <DialogContentText sx={{ color: '#A8A5A1', fontSize: "14px", mt: 2 }}>
                    This ticket has been resolved. If you're satisfied with the resolution, you can close the ticket. If you need further assistance, please add another response.
                  </DialogContentText>
                )}

                {selectedTicket.status === 'CLOSED' && (
                  <DialogContentText sx={{ color: '#A8A5A1', fontSize: "14px", mt: 2 }}>
                    This ticket is closed. If you have a similar issue, please create a new ticket.
                  </DialogContentText>
                )}
              </DialogContent>
            </>
          )}
        </Dialog>

        {/* Image Viewer Dialog */}
        <Dialog
          open={imageViewerOpen}
          onClose={handleCloseImageViewer}
          // maxWidth="md"
          PaperProps={{
            style: {
              backgroundColor: '#232626',
              color: 'white',
              overflow: 'hidden',
              maxWidth:"340px"
            },
          }}
        >
          <AppBar position="static" sx={{ bgcolor: '#323738', position: 'relative' }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleCloseImageViewer}>
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
                {currentImage?.fileName || 'Image Preview'}
              </Typography>
            </Toolbar>
          </AppBar>
          <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
            {currentImage && (
              <img
                src={currentImage.fileUrl || `${domain}/api/attachments/${currentImage.id}`}
                alt={currentImage.fileName || "Attachment"}
                style={{ width: '100%', objectFit: 'contain', maxHeight: '80vh' }}
              />
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Mobile>
  );
};

export default ProgressQueries;