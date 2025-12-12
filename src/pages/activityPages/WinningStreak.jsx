import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import { domain } from "../../utils/Secret";
import Mobile from "../../components/layout/Mobile";
import { useAuth } from "../../context/AuthContext";
import WinningStreakTabs from "../../components/activity/WinningStreakTabs";

const WinningStreak = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [totalBetAmount, setTotalBetAmount] = useState(0);
    const { axiosInstance } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(
                    `${domain}/api/activity/activity-award/levels`,
                    {
                        withCredentials: true,
                    }
                );

                const dailyCategory = response.data.find(
                    (cat) => cat.timeScope === "DAILY"
                );
                if (dailyCategory && dailyCategory.tasks.length > 0) {
                    setTotalBetAmount(dailyCategory.tasks[0].totalDailyBetting || 0);
                }

                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching activity awards:", error);
            }
        };

        fetchData();
    }, []);

    const handleRedirect = () => {
        navigate(-1);
    };

    return (
        <Mobile>
            <Container
                disableGutters
                maxWidth={false}
                sx={{
                    margin: 0,
                    padding: 0,
                    backgroundColor: "#232626",
                    minHeight: "100vh",
                }}
            >
                {/* Header */}
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
                            onClick={handleRedirect}
                        >
                            <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
                        </IconButton>
                        <Typography
                            variant="h6"
                            sx={{ color: "#ffffff", textAlign: "center", fontSize: "19px" }}
                        >
                            Winning Streak
                        </Typography>
                    </Grid>
                </Grid>

                {/* Banner Card */}
                <Card
                    sx={{
                        backgroundColor: "#fff",
                        color: "#ACAFB3",
                        borderRadius: 0,
                        boxShadow: "none",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            textAlign: "center",
                            backgroundColor: "#ffffff",
                            height: "160",
                        }}
                    >
                        <CardMedia
                            component="img"
                            alt="Activity Award"
                            height="auto"
                            image="/assets/winningStreak/background.webp"
                            sx={{
                                objectFit: "contain",
                                width: "100%",
                                filter: "brightness(50%)"
                            }}
                        />
                        <Box
                            sx={{
                                position: "absolute",
                                top: "45%",
                                left: "10px",
                                transform: "translateY(-50%)",
                                textAlign: "left",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{ color: "#fff" }}
                            >
                                Winning Streak
                            </Typography>
                            <Box
                                component="ul"
                                sx={{
                                    color: "#fff",
                                    marginTop: "5px",
                                    fontSize: "13px",
                                    marginBottom: "20px",
                                    marginLeft: "10px",
                                    marginRight:"15px",
                                    lineHeight:1.5,
                                    paddingLeft: "15px",
                                }}
                            >
                                <Box component="li" style={{ margin: "5px 0" }}>In this game of strategy and luck every win brings you closer to an exclusive bonus.</Box>
                                <Box component="li" style={{ margin: "5px 0" }}>Keep your streak active, hit consecutive wins or more and you will unlock special rewards that grow with your success.</Box>
                                <Box component="li" style={{ margin: "5px 0" }}>The longer your win, the bigger the bonus how far can your go?</Box>
                            </Box>
                        </Box>
                        <Box sx={{
                            position: "absolute",
                            top: "90%",
                            right: "10px",
                            transform: "translateY(-50%)",
                            textAlign: "right",
                        }}>
                            <Button
                                variant="outlined"
                                sx={{
                                    border: "1px solid #24ee89",
                                    borderRadius: "8px",
                                    padding: "0.5px 8px",
                                    fontSize: "13px",
                                    textTransform: "initial",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "3px",
                                    color: "#24ee89",
                                }}
                                onClick={() =>
                                    navigate("/activity/winning-streak/rule")
                                }
                            >
                                <img src="/assets/k3/howtoplay.svg" alt="" width="14px" />
                                Rules
                            </Button>
                        </Box>
                    </Box>
                </Card>

                {/* Task Cards */}
                <WinningStreakTabs />
            </Container>
        </Mobile>
    );
};

export default WinningStreak;