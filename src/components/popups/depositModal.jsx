import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Box,
  Typography,
  Button,
  Checkbox,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { domain } from "../../utils/Secret";
import { useAuth } from "../../context/AuthContext";
import FirstDepositCard from "../activity/FirstDepositCard";

const DepositModal = ({ open, onClose }) => {
  const [depositBonuses, setDepositBonuses] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const { axiosInstance } = useAuth();

  const fetchDepositBonuses = async () => {
    try {
      const response = await axiosInstance.get(
        `${domain}/api/activity/deposit-bonus/rules?depositType=FIRST`
      );
      const rules = response.data.rules;

      const formattedBonuses = rules.map((rule) => ({
        id: rule.id,
        minimumDeposit: rule.depositAmount,
        bonus: rule.bonusAmount,
      }));

      setDepositBonuses(formattedBonuses);
    } catch (error) {
      console.error("Error fetching deposit bonuses:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchDepositBonuses();
      
      // Check if the modal should be shown today
      const dismissedDate = localStorage.getItem("depositModalDismissedDate");
      const today = new Date().toDateString();
      
      if (dismissedDate === today) {
        onClose();
      }
    }
  }, [open, onClose]);

  const handleClose = () => {
    if (isChecked) {
      const today = new Date().toDateString();
      localStorage.setItem("depositModalDismissedDate", today);
    }
    onClose();
  };

  const handleDeposit = () => {
    navigate("/wallet/deposit");
  };

  return (
    <Modal 
      open={open} 
      disableEscapeKeyDown
      disableAutoFocus
      disableEnforceFocus
      onClose={(event, reason) => {
        // Only close if close button is clicked, not on backdrop click
        if (reason !== 'backdropClick') {
          handleClose();
        }
      }}
    >
      <>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 340,
          bgcolor: "transparent",
          boxShadow: 24,
          borderRadius: 2,
          // overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "#3a4142",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#ffffff",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            borderRadius: "8px 8px 0 0",
          }}
        >
         
          <Typography
            variant="h6"
            sx={{ textAlign: "center", fontWeight: "bold", fontSize: "18px" }}
          >
            Extra first deposit bonus
          </Typography>
          <Typography
            variant="body2"
            sx={{ textAlign: "center", mt: 1, fontSize: "12px" }}
          >
            Each account can only receive rewards once
          </Typography>
        </Box>

        <Box
          sx={{
            padding: 1,
            overflowY: "auto",
            maxHeight: "60vh",
            background: "#323738",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {depositBonuses.map((bonus) => (
            <FirstDepositCard
              key={bonus.id}
              bonus={bonus}
              onDeposit={handleDeposit}
            />
          ))}
        </Box>

        <Box
          sx={{
            padding: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#3a4142",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 3,
            }}
          >
            <Checkbox
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              icon={<RadioButtonUncheckedIcon sx={{ color: "#B3BEC1" }} />}
              checkedIcon={<CheckCircleIcon sx={{ color: "#B3BEC1" }} />}
              sx={{ padding: 0 }}
            />
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", color: "#B3BEC1", textAlign: "right" }}
            >
              No more reminders today
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(90deg,#24ee89,#9fe871)",
              color: "black",
              p:"5px 30px",
              borderRadius:"20px",
              textTransform: "none",
              fontFamily:"800"
            }}
            onClick={() => navigate("/activity/first-deposit-bonus")}
          >
            Activity
          </Button>
        </Box>
      <IconButton
      onClick={handleClose}
      sx={{
        position: "absolute",
        left: "50%",
        bottom: -40,
        width:"30px",
        height:"30px",
        transform: "translateX(-50%)",
        // backgroundColor: "#ffffff",
        border: "3px solid #ffffff",
        boxShadow: 1,
        zIndex: 1300,
        "&:hover": {
          // backgroundColor: "#f0f0f0",
        },
      }}
    >
      <CloseIcon sx={{ color: "#ffffff" }} />
    </IconButton>
      </Box>
    </>
    </Modal>
  );
};

DepositModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DepositModal;