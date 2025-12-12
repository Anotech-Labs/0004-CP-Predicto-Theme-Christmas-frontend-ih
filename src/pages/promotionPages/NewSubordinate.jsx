import React, { useEffect, useState } from "react";
import Mobile from "../../components/layout/Mobile";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Typography, Grid, Box, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { domain } from "../../utils/Secret";
import { useAuth } from "../../context/AuthContext"

const Navbar = () => {
  const navigate = useNavigate();
  return (
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
          <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ color: "#FDE4BC", textAlign: "center", fontSize: "19px" }}
        >
          New subordinates
        </Typography>
      </Grid>
    </Grid>

  );
};

const DateOptions = ({ selectedOption, setSelectedOption }) => {
  return (
    <Box
      sx={{
        padding: "8px",
        backgroundColor: "#232626",
        display: "flex",
        // borderRadius: "20px",
        justifyContent: "space-between",
      }}
    >
      {["Today", "Yesterday", "This month"].map((option) => (
        <Button
          key={option}
          onClick={() => setSelectedOption(option)}
          sx={{
            background: selectedOption === option ? "linear-gradient(90deg,#24ee89,#9fe871)" : "#323738",
            color: selectedOption === option ? "black" : "grey",
            borderRadius: "10px",
            padding: "8px 16px",
            minWidth: "32.5%",
            textTransform: "none",
          }}
        >
          {option}
        </Button>
      ))}
    </Box>
  );
};

const SubordinateList = ({ filter }) => {
  const [subordinates, setSubordinates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axiosInstance } = useAuth();

  useEffect(() => {
    fetchSubordinates();
  }, [filter]);

  const fetchSubordinates = async () => {
    setLoading(true);

    // Map selected filter to API timePeriod values
    const timePeriodMapping = {
      Today: "today",
      Yesterday: "yesterday",
      "This month": "this_month",
    };

    try {
      const response = await axiosInstance.get(
        `${domain}/api/subordinate/getNewSubordinatesForUid`,
        {
          params: { timePeriod: timePeriodMapping[filter] },
          withCredentials: true,
        }
      );
      setSubordinates(response.data.data.data);
    } catch (error) {
      console.error("Error fetching subordinates:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatMobile = (mobile) => {
    return mobile.slice(0, 3) + "****" + mobile.slice(-5);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#232626",
        padding: 1.5,
        flexGrow: 1,
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          display: "none", // Hide scrollbar for Chrome, Safari, and Opera
        },
        scrollbarWidth: "none", // Hide scrollbar for Firefox
        msOverflowStyle: "none", // Hide scrollbar for IE and Edge

      }}
    >
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        subordinates.map((sub) => (
          <Box
            key={sub.uid}
            elevation={1}
            sx={{
              background: "#323738",
              marginBottom: 1.5,
              padding: 2,
              borderRadius: "5px",
              // borderBottom: "1px solid #e1e1e1",
            }}
          >
            <Grid container justifyContent="space-between" alignItems="left">
              <Grid item textAlign="left">
                <Typography color="#A8A5A1" fontSize={13}>
                  {formatMobile(sub.mobilenumber)}
                </Typography>
                {sub.isdirectsubordinate ? (
                  <Typography variant="body2" color="#A8A5A1">
                    Direct subordinates
                  </Typography>
                ) : (
                  <Typography variant="body2" color="#A8A5A1">
                    Indirect subordinates
                  </Typography>
                )}
              </Grid>
              <Grid item textAlign="right">
                <Typography color="#A8A5A1" fontSize={13}>
                  UID:{sub.childuid}
                </Typography>
                <Typography variant="body2" fontSize={13} color="#A8A5A1">
                  {formatDate(sub.registrationdate)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ))
      )}
      {!loading && subordinates.length === 0 && (
        <Typography align="center" sx={{ marginTop: 2, color: "grey" }}>
          No more
        </Typography>
      )}
    </Box>
  );
};
const NewSubordinate = () => {
  const [selectedOption, setSelectedOption] = useState("Today");

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
          backgroundColor="#F5F5F5"
        >
          <Navbar />
          <DateOptions
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
          <SubordinateList filter={selectedOption} />
        </Box>
      </Mobile>
    </div>
  );
};

export default NewSubordinate;
