import React from "react";
import { useState,useEffect } from "react";
import {
  Typography,
  List,
  ListItem,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  SvgIcon,
  TableRow,
  Paper,
  ThemeProvider,
  createTheme,
  Box,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Mobile from "../../../components/layout/Mobile";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";
// import { domain } from '../../utils/Secret';
import { domain } from "../../../utils/Secret";
import { useAuth } from "../../../context/AuthContext";

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      paper: '#ffffff',
    },
  },
});

const rules = [
  "Members must reach the single deposit amount and cumulative deposit amount to be eligible to participate in the lottery",
  <>Conditions for withdrawal of wheel rewards: <Typography component="span" sx={{ color: "red", fontSize: "12px", fontWeight: "bold" }}>1</Typography> times turnover required.</>,
  "If you receive monetary rewards, there is no need to apply, the system will automatically add them to your member ID (please contact customer service to receive physical rewards)",
  <>The lottery round starts every morning at <Typography component="span" sx={{ color: "red", fontSize: "12px", fontWeight: "bold" }}>00:00</Typography>. After making your deposit, you need to wait 5 minutes before the draw wheel starts.</>
];

// const tasks = [
//   { amount: 500.00, spins: 1 },
//   { amount: 1000.00, spins: 1 },
//   { amount: 2000.00, spins: 1 },
//   { amount: 5000.00, spins: 1 },
//   { amount: 10000.00, spins: 2 },
//   { amount: 50000.00, spins: 2 },
//   { amount: 100000.00, spins: 3 },
// ];

const RhombusIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 2L22 12L12 22L2 12L12 2Z" />
  </SvgIcon>
);

const EventDetails = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
 const { axiosInstance } = useAuth();
  const handleRedirect = () => {
    navigate(-1);
  };

  const fetchSpinRules = async () => {
    try {
      // const domain = process.env.REACT_APP_API_DOMAIN; // Ensure you have this set in your .env file
      const response = await await axiosInstance.get(`${domain}/api/activity/lucky-spin/rules`, {
      });
      // Transform API data to match the required format
      //console.log("respone=",response)
      const transformedTasks = response?.data.data.map(rule => ({
        amount: parseFloat(rule.minDepositAmount),
        spins: rule.spinChances
      })).sort((a, b) => a.amount - b.amount); // Sort by amount

      setTasks(transformedTasks);
    } catch (error) {
      console.error("Error fetching spin rules:", error);
      // Optionally set a default or show an error message
      setTasks([]);
    }
  };
  useEffect(() => {
    fetchSpinRules();
  }, []);
  return (
    <div>
      <Mobile>
        <Box
          sx={{
            bgcolor: "#232626",
            // minHeight: "100vh",
            height: "100vh",
            p: 0,
            maxWidth: "600px",
            mx: "auto",
          }}
        >
          {/* Header with Back Button */}
          <Grid
            item
            container
            alignItems="center"
            justifyContent="center"
            sx={{ bgcolor: "#232626", py: 0.8 }} // Background color for the header
          >
            <Grid item xs={2}>
              <IconButton
                sx={{ color: "#ffffff", ml: -2 }} // White color for the icon
                onClick={handleRedirect}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <Typography
                variant="h6"
                sx={{
                  color: "#ffffff", // White color for the text
                  flexGrow: 1,
                  textAlign: "center",
                  mr: 8,
                  fontSize: "19px"
                }}
              >
                Activity Details
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 1, padding: 1, borderRadius: "10px" }}>
            <TableContainer component={Paper} sx={{ maxWidth: 400, margin: 'auto', backgroundColor: '#cf7c10', overflow: "hidden" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { color: '#ffffff', fontSize: '1rem', textAlign: 'center', textWrap: "nowrap" } }}>
                    <TableCell sx={{ padding: "10px 8px", borderBottom: "none" }}>Task</TableCell>
                    <TableCell sx={{ padding: "10px 8px", borderBottom: "none" }}>Number of spins</TableCell>
                    <TableCell sx={{ padding: "10px 8px", borderBottom: "none" }}>spin time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:nth-of-type(odd)': { backgroundColor: '#323738' },
                        '&:nth-of-type(even)': { backgroundColor: '#1a1000' },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          padding: '16px 12px',
                          textAlign: 'center',
                          borderBottom: "none"
                        }}
                      >
                        <div style={{ color: '#d23838', fontSize: '12px', }}>₹{task.amount.toFixed(2)}</div>
                        <div style={{ color: '#B3BEC1', fontSize: '11px' }}>Total depositsBalance</div>
                      </TableCell>
                      <TableCell sx={{ color: '#ffffff', textAlign: 'center', fontSize: '13.8px', borderBottom: "none" }}>+{task.spins}</TableCell>
                      <TableCell sx={{ color: '#B3BEC1', textAlign: 'center', textWrap: "nowrap", fontSize: '14px', borderBottom: "none" }}>00:00-23:59</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Paper sx={{
            overflow: "hidden", borderRadius: "10px", margin: 1, mt: 4,
            background: "#323738",
          }}>
            <Box
              sx={{
                bgcolor: "#cf7c10",
                py: 0.5,
                maxWidth: 200,
                margin: "0 auto",
                px: 1,
                textAlign: "center",
                borderBottomLeftRadius: "50px",
                borderBottomRightRadius: "50px",

              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                Rules
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              {rules.map((rule, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "start",
                    mt: index === 0 ? 0 : 0,
                    paddingX: "5%",
                  }}
                >
                  <RhombusIcon
                    sx={{ color: "#24ee89", mr: 1, mt: "4px", fontSize: 10 }}
                  />
                  <Typography
                    variant="body2"
                    paragraph
                    sx={{ textAlign: "left", fontSize: "13.2px", color: "#B3BEC1" }}
                  >
                    {rule}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ bgcolor: "#232626", p: 1.5, borderRadius: 2, mb: 1, textAlign: "left", mx: 2, color: "#B3BEC1" }}>
              {/* Example text */}
              <Typography variant="body1" sx={{ mb: 0, fontSize: "13.2px" }}>
                For example:
              </Typography>

              {/* Description text with highlighted spans */}
              <Typography variant="body2" sx={{ lineHeight: 1, fontSize: "13.5px" }}>
                If a member's single deposit exceeds{" "}
                <Typography component="span" sx={{ fontWeight: "bold", color: "red", fontSize: "12px" }}>
                  ₹100,000.00
                </Typography>{" "}
                on the same day, he or she will receive{" "}
                <Typography component="span" sx={{ fontWeight: "bold", color: "red", fontSize: "12px" }}>
                  3
                </Typography>{" "}
                lucky draw opportunities. The lottery draws are valid for the same day and
                cannot be accumulated to the next day!
              </Typography>
            </Box>
          </Paper>
        </Box>
        <br />
        <br />
        <br />
      </Mobile>{" "}
    </div>
  );
};

export default EventDetails;