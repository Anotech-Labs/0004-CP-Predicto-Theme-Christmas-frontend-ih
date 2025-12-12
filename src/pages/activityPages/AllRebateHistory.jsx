import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { domain } from "../../utils/Secret";
import Mobile from "../../components/layout/Mobile";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../context/AuthContext';
import { styled } from "@mui/material";
const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: "#232626",
  minHeight: "60px",
  padding: "8px 18px",
  "& .MuiTabs-scroller": {
    overflow: "auto !important",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  "& .MuiTabs-indicator": {
    display: "none", // Hide default indicator since we're using box backgrounds
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: "#B79C8B",
  minHeight: "55px",
  padding: "5px 30px",
  fontSize: "13px",
  textTransform: "none",
  marginRight: "8px",
  borderRadius: "5px",
  backgroundColor: "#323738",
  "&.Mui-selected": {
    color: "#323738",
    background: "linear-gradient(90deg,#24ee89,#9fe871)",
  },
  "& .MuiTab-iconWrapper": {
    marginBottom: "5px !important", // Space between icon and label
    marginRight: "0 !important", // Remove default right margin
  },
  // Remove default ripple effect
  "&:hover": {
    backgroundColor: "#2a2929",
  },
}));

const AllRebateHistory = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [pendingRebate, setPendingRebate] = useState(0);
  const [totalRebateClaimed, setTotalRebateClaimed] = useState(0);
  const [rebatePercentage, setRebatePercentage] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [totalRebateAmount, setTotalRebateAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [rebateHistory, setRebateHistory] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasMore: false
  });
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const { axiosInstance } = useAuth()

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Reset pagination when changing tabs
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasMore: false
    });
    // Fetch new data for the selected tab
    // fetchRebateData(tabData[newValue].type);
    fetchRebateHistory(1, tabData[newValue].type);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const tabData = [
    {
      icon: "/assets/icons/rebate/all-unselected.svg",
      selectedImage: "/assets/icons/rebate/all-selected.svg",
      label: "All",
      type: "All",
      title: "All-Total betting rebate",
    },
    {
      icon: "/assets/icons/rebate/Lottery Deselect.svg",
      selectedImage: "/assets/icons/rebate/Lottery Deselect-1.svg",
      label: "Lottery",
      type: "Lottery",
      title: "Lottery-Total betting rebate",
    },
    {
      icon: "/assets/icons/rebate/Casino Deselect.svg",
      selectedImage: "/assets/icons/rebate/Casino Deselect-1.svg",
      label: "Casino",
      type: "Casino",
      title: "Casino-Total betting rebate",
    },
    {
      icon: "/assets/icons/rebate/spade-1.svg",
      selectedImage: "/assets/icons/rebate/spade.svg",
      label: "Rummy",
      type: "Rummy",
      title: "Rummy-Total betting rebate",
    },
    {
      icon: "/assets/icons/rebate/slotsdeselect.svg",
      selectedImage: "/assets/icons/rebate/slotsselected.svg",
      label: "Slots",
      type: "Slots",
      title: "Slots-Total betting rebate",
    },
  ];

  // const tabData = [
  //     { label: "All", imageSelected: "/assets/icons/all-selected.webp", imageUnselected: "/assets/icons/all-unselected.webp" },
  //     { label: "Lottery", imageSelected: "/assets/icons/lottery-selected.webp", imageUnselected: "/assets/icons/lottery-unselected.webp" },
  //     { label: "Original", imageSelected: "/assets/icons/original-selected.webp", imageUnselected: "/assets/icons/original-unselected.webp" },
  //     { label: "Slots", imageSelected: "/assets/icons/slots-selected.webp", imageUnselected: "/assets/icons/slots-unselected.webp" },
  //     { label: "Sports", imageSelected: "/assets/icons/sports-selected.webp", imageUnselected: "/assets/icons/sports-unselected.webp" },
  //   ];


  // const fetchRebateData = async (type = tabData[tabValue].type) => {
  //   try {
  //     // Only make actual API call for All and Lottery types
  //     if (type === "All" || type === "Lottery") {
  //       const response = await axiosInstance.get(`/api/vip/rebate/pending`, {
  //         params: {
  //           type: type
  //         }
  //       });
  
  //       if (response.data.success) {
  //         const { pendingRebate, currentLevel, rebatePercentage } = response.data.data;
  //         setPendingRebate(parseFloat(pendingRebate));
  //         setRebatePercentage(parseFloat(rebatePercentage));
  //         setCurrentLevel(currentLevel);
  //       }
  //       //console.log(response)
  //     } else {
  //       // For other types, set to zero/empty values
  //       setPendingRebate(0);
  //       setRebatePercentage(0);
  //       setCurrentLevel(0);
  //     }
     
  //   } catch (error) {
  //     console.error("Error fetching rebate data:", error);
  //     setSnackbar({
  //       open: true,
  //       message: 'Failed to fetch rebate data',
  //       severity: 'error'
  //     });
  //   }
  // };

  // const handleClaimRebate = async () => {
  //   if (pendingRebate <= 0 || !(tabData[tabValue].type === "All" || tabData[tabValue].type === "Lottery")) {
  //     setSnackbar({
  //       open: true,
  //       message: 'No rebate available to claim',
  //       severity: 'warning'
  //     });
  //     return;
  //   }
  
  //   setIsLoading(true);
  //   try {
  //     const response = await axiosInstance.post('/api/vip/rebate/claim', {
  //       type: tabData[tabValue].type
  //     });
  
  //     if (response.data.success) {
  //       const { claim, transaction } = response.data.data;
  //       setSnackbar({
  //         open: true,
  //         message: `Successfully claimed ${transaction.amount} rebate!`,
  //         severity: 'success'
  //       });
  
  //       setPendingRebate(0);
  //       setTotalRebateClaimed(prev => prev + parseFloat(transaction.amount));
  //       fetchRebateData(tabData[tabValue].type);
  //       fetchRebateHistory(1, tabData[tabValue].type);
  //     }
  //   } catch (error) {
  //     console.error("Error claiming rebate:", error);
  //     setSnackbar({
  //       open: true,
  //       message: 'Failed to claim rebate. Please try again later.',
  //       severity: 'error'
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchRebateHistory = async (page = 1, type = tabData[tabValue].type) => {
    setIsLoadingHistory(true);
    try {
      // Only make actual API call for All and Lottery types
      if (type === "All" || type === "Lottery") {
        const response = await axiosInstance.get(`/api/vip/rebate/history`, {
          params: {
            page,
            type
          }
        });
  // //console.log(response)
        if (response.data.success) {
          const { history, pagination } = response.data.data;
          // If it's page 1, replace the history, otherwise append
          if (page === 1) {
            setRebateHistory(history);
          } else {
            setRebateHistory(prev => [...prev, ...history]);
          }
          setPagination(pagination);
        }
      } else {
        // For other types, set empty history and pagination
        if (page === 1) {
          setRebateHistory([]);
        }
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          hasMore: false
        });
      }
    } catch (error) {
      console.error("Error fetching rebate history:", error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch rebate history',
        severity: 'error'
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };


  useEffect(() => {
    // fetchRebateData();
    fetchRebateHistory();
  }, []);

  return (
    <Mobile>
      <Box
        sx={{
          bgcolor: "#232626",
          minHeight: "100vh",
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "#232626",
            padding: "7px 12px",
          }}
        >
          <Grid
            item
            xs={12}
            container
            alignItems="center"
            justifyContent="center"
          >
            <IconButton
              sx={{
                color: "#FDE4BC",
                position: "absolute",
                left: 0,
                p: "12px",
              }}
              onClick={() => navigate(-1)}
            >
              <ArrowBackIosOutlinedIcon sx={{ fontSize: "19px" }} />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ color: "#FDE4BC", textAlign: "center", fontSize: "19px" }}
            >
              Rebate History
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ width: "100%", bgcolor: "#1c1c1c" }}>
          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons={false}
            aria-label="game categories tabs"
            TabIndicatorProps={{
              style: {
                transition: "300ms",
              },
            }}
          >
            {tabData.map((tab, index) => (
              <StyledTab
                key={index}
                mr={1}
                icon={
                  <img
                    src={tabValue === index ? tab.selectedImage : tab.icon}
                    alt={tab.label}
                    style={{ width: "24px", height: "24px" }}
                  />
                }
                label={tab.label}
                id={`tab-${index}`}
                aria-controls={`tabpanel-${index}`}
              />
            ))}
          </StyledTabs>
        </Box>

        <Box sx={{ mt: 1, mx: 1.5 }}>
          {/* <Card
            variant="outlined"
            sx={{
              p: 1,
              bgcolor: "#323738",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                // fontWeight: "bold",
                mb: 0.5,
                color: "#f5f3f0",
                textAlign: "left",
                fontSize: "15px",
              }}
            >
              {tabData[tabValue].title || "-Total betting rebate"}
            </Typography>
            <CardContent
              sx={{
                p: 0,
                "&:last-child": {
                  paddingBottom: 0,
                },
              }}
            >
              <Box display="flex" alignItems="center" sx={{ mb: 1.5 }}>
                <Box
                  component="span"
                  sx={{
                    border: "1px solid #FED358",
                    borderRadius: "5px",
                    px: 1,
                    py: 0.3,
                    mr: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <VerifiedUserIcon
                    sx={{ color: "#FED358", mr: 0.5, fontSize: "18px" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "#FED358", fontSize: "12px" }}
                  >
                    Real-time count
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#fff",
                  mb: 1,
                  textAlign: "left",
                  fontSize: "19px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src="/assets/icons/rebate/rebate.webp"
                  style={{ width: 24, marginRight: 4 }}
                />
                {pendingRebate.toFixed(2)}
              </Typography>
              <Box
                sx={{
                  bgcolor: "#3b3833",
                  borderRadius: "5px",
                  p: 1,
                  mb: 1,
                  textAlign: "left",
                  width: "85%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#B79C8B", fontSize: "12px" }}
                >
                  Upgrade VIP level to increase rebate rate
                </Typography>
              </Box>
              <Grid container spacing={1} sx={{ mb: 1 }}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      bgcolor: "#3b3833",
                      borderRadius: "8px",
                      p: 1,
                      textAlign: "left",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="#B79C8B"
                      sx={{ fontSize: "12px" }}
                    >
                      Rebate rate
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        color: "#FF851B",
                        fontSize: "17px",
                      }}
                    >
                      {rebatePercentage}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      bgcolor: "#3b3833",
                      borderRadius: "8px",
                      p: 1,
                      textAlign: "left",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="#B79C8B"
                      sx={{ fontSize: "12px" }}
                    >
                      Total rebate
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        color: "#FF851B",
                        fontSize: "17px",
                      }}
                    >
                      {totalRebateClaimed.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Typography
                variant="body2"
                color="#B79C8B"
                sx={{
                  mb: 1.5,
                  fontStyle: "italic",
                  fontSize: "12px",
                  textAlign: "left",
                  ml: "8px",
                }}
              >
                Automatic code washing at 01:00:00 every morning
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={handleClaimRebate}
                disabled={isLoading || pendingRebate <= 0}
                sx={{
                  background: "linear-gradient(90deg,#24ee89,#9fe871)",
                  color: "black",
                  borderRadius: "25px",
                  textTransform: "none",
                  "&.Mui-disabled": {
                    background: "#454456",
                    color: "#fff",
                  },
                  height: "38px",
                  fontSize: "1rem",
                  // fontWeight: "bold",
                }}
              > 
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "One-Click Rebate"
              )}
              </Button>

              <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <Alert
                  onClose={handleCloseSnackbar}
                  severity={snackbar.severity}
                  sx={{ width: '100%' }}
                >
                  {snackbar.message}
                </Alert>
              </Snackbar>
            </CardContent>
          </Card>

          <Typography
            variant="h6"
            sx={{
              textAlign: "left",
              fontWeight: "bold",
              mt: 1.5,
              mb: 2,
              color: "#fff",
            }}
          >
            <Box
              component="span"
              sx={{
                bgcolor: "#FED358",
                mr: 1,
                borderRadius: "2px",
                width: "4px",
                height: "20px",
                display: "inline-block",
              }}
            ></Box>
            Rebate Record
          </Typography> */}

          <Box sx={{ mt: 1 }}>
            {isLoadingHistory ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : rebateHistory.length > 0 ? (
              <>
                {rebateHistory.map((record, index) => (
                  <Paper
                    key={index}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: "12px",
                      // boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      bgcolor: "#323738",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {record.gameName}
                    </Typography>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="#B79C8B">
                        {new Date(record.claimedAt).toLocaleString()}
                      </Typography>
                      <Typography sx={{ fontWeight: "bold", color: "#FED358" }}>
                        Completed
                      </Typography>
                    </Grid>

                    <Divider sx={{ my: 1 }} />

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {/* Left Side - Step Indicator & Labels */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <img
                            src="/assets/activity/red_circles.webp"
                            alt="Step indicator"
                            style={{ width: "15px", height: "auto", marginBottom: "-4px" }}
                          />
                        </Box>
                        <Box mt={0.8}>
                          {["Betting rebate", "Rebate rate", "Rebate amount"].map((label, index) => (
                            <Typography key={index} variant="body2" color="#B79C8B" lineHeight={2.5} textAlign="start" >
                              {label}
                            </Typography>
                          ))}
                        </Box>
                      </Box>

                      {/* Right Side - Values */}
                      <Box>
                        {[
                          {
                            value: record.bettingRebate,
                            color: "#B79C8B",
                          },
                          {
                            value: `${parseFloat(record.rebateRate).toFixed(2)}%`,
                            color: "#FF5733",
                          },
                          {
                            value: parseFloat(record.rebateAmount).toFixed(2),
                            color: "#FFA07A",
                          },
                        ].map((item, i) => (
                          <Typography key={i} sx={{ fontWeight: "400", color: item.color, textAlign: "end", lineHeight: 2 }}>
                            {item.value}
                          </Typography>
                        ))}
                      </Box>
                    </Box>

                  </Paper>
                ))}

                {pagination.hasMore && (
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 2, mb: 4 }}
                    onClick={() => fetchRebateHistory(pagination.currentPage + 1)}
                  >
                    Load More
                  </Button>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <img
                  src="/assets/No data-1.webp"
                  alt="No data available"
                  style={{ width: "50%", marginBottom: "10px" }}
                />
                <Typography variant="body1" color="#888">
                  No rebate records available
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <br />
      <br />
      <br />
    </Mobile>
  );
};

export default AllRebateHistory;
