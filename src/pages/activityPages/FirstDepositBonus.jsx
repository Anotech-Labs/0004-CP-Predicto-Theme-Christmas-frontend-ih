import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import SvgIcon from '@mui/material/SvgIcon';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { domain } from "../../utils/Secret";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Mobile from "../../components/layout/Mobile";
import FirstDepositCard from "../../components/activity/FirstDepositCard";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const RhombusIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 2L22 12L12 22L2 12L12 2Z" />
  </SvgIcon>
);

function FirstDepositBonus({ children }) {
  const [depositBonusData, setDepositBonusData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const { axiosInstance } = useAuth();


  const fetchDepositBonuses = async () => {
    try {
      // Fetch all deposit bonus rules without filtering by type
      const response = await axiosInstance.get(`${domain}/api/activity/deposit-bonus/rules`);
      setDepositBonusData(response.data);
    } catch (error) {
      console.error("Error fetching deposit bonuses:", error);
    }
  };

  useEffect(() => {
    fetchDepositBonuses();
  }, []);


  const handleBackClick = () => {
    navigate(-1);
  };

  const handleDeposit = () => {
    navigate("/wallet/deposit")
  }
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatDepositTypeName = (type) => {
    return type.charAt(0) + type.slice(1).toLowerCase() + " Deposit";
  };

  // Filter out deposit types with no rules
  const availableDepositTypes = depositBonusData.filter(item => item.rulesCount > 0);

  // Get the currently displayed deposit type data
  const currentDepositTypeData = availableDepositTypes[activeTab] || null;

  // Format bonus data for the selected deposit type
  const currentBonuses = currentDepositTypeData?.rules?.map(rule => ({
    id: rule.id,
    minimumDeposit: rule.depositAmount,
    bonus: rule.bonusAmount
  })) || [];

  // ActivityRules Component
  function ActivityRules() {
    return (
      <Paper sx={{ mb: 2, overflow: "hidden", borderRadius: "5px", margin: 0 ,background:"#323738"}}>
        <Box
          sx={{
            bgcolor: "#cf7c10",
            py: 0.5,
            maxWidth: 200,
            margin: "0 auto",
            px: 2,
            textAlign: "center",
            borderBottomLeftRadius: "50px",
            borderBottomRightRadius: "50px",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: "white" }}
          >
            Activity Rules
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          {[
            "Exclusive for the first recharge of the account. There is only one chance. The more you recharge, the more rewards you will receive. The highest reward is ₹8,888.00.",
            "Activities cannot be participated in repeatedly.",
            "Rewards can only be claimed manually on IOS, Android, H5, and PC.",
            "The bonus (excluding the principal) given in this event requires 1.00 times the coding turnover (i.e. valid bets) before it can be withdrawn, and the coding does not limit the platform.",
            "This event is limited to normal human operations by the account owner. It is prohibited to rent, use plug-ins, robots, gamble with different accounts, brush each other, arbitrage, interfaces, protocols, exploit loopholes, group control or other technical means to participate, otherwise it will be canceled or Rewards will be deducted, frozen, or even blacklisted.",
            "In order to avoid differences in text understanding, the platform reserves the right of final interpretation of this event.",
          ].map((rule, index) => (
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
                sx={{ textAlign: "justify", fontSize: "0.8rem" ,color:"#B3BEC1"}}
              >
                {rule}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    );
  }


  return (
    <Mobile>
      <div>
        <Box
          display="flex"
          flexDirection="column"
          height="100dvh"
          position="relative"
        >
          <Box flexGrow={1}>
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
                color: "#ffffff",
                position: "absolute",
                left: 0,
                p: "12px",
              }}
              onClick={handleBackClick}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ color: "#ffffff", textAlign: "center", fontSize: "19px" }}
            >
            Deposit Bonus
            </Typography>
          </Grid>
        </Grid>

        {/* Tabs for different deposit types */}
        {availableDepositTypes.length > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center",  backgroundColor: "#232626", }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                // variant="scrollable"
                scrollButtons="auto"
                sx={{
                  backgroundColor: "#232626",
                  '& .MuiTab-root': {
                    color: '#A8A5A1',
                    '&.Mui-selected': {
                      color: '#24ee89',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#24ee89',
                  },
                }}
              >
                {availableDepositTypes.map((item, index) => (
                  <Tab 
                    key={item.depositType} 
                    label={formatDepositTypeName(item.depositType)} 
                    sx={{ textTransform: 'none' }}
                  />
                ))}
              </Tabs>
              </Box>
            )}

            {/* Content start */}
            <Box sx={{ padding: "1.1rem",mb:7 }}>
            {currentBonuses.map((bonus) => (
            <FirstDepositCard 
            key={bonus.id} 
            bonus={bonus} 
            onDeposit={handleDeposit}
            depositType={currentDepositTypeData.depositType}
          />
          ))}

              <ActivityRules />

            </Box>
            {/* Content end */}
          </Box>
          {children}
        </Box>
      </div>
      <br />
          <br />
          <br />
    </Mobile>
  );
}

export default FirstDepositBonus;
