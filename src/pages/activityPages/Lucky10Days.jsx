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
import LuckyTenDaysInterest from "../../components/activity/LuckyTenDaysInterest";

const Lucky10days = () => {
    const navigate = useNavigate();

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
                            Lucky 10 Days
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
                            height: "224px",
                        }}
                    >
                        <CardMedia
                            component="img"
                            alt="Activity Award"
                            height="auto"
                            image="/assets/lucky10days/background.webp"
                            sx={{
                                objectFit: "contain",
                                width: "100%",
                                filter: "brightness(50%)" // Adjust the darkness level
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
                                Lucky 10 days of interest
                            </Typography>
                            <Box
                                component="ul"
                                sx={{
                                    color: "#fff",
                                    marginTop: "5px",
                                    fontSize: "13px",
                                    marginBottom: "20px",
                                    marginLeft: "10px",
                                    marginRight: "15px",
                                    lineHeight: 1.5,
                                    paddingLeft: "15px", // Proper indentation for bullets
                                }}
                            >
                                <Box component="li" style={{ margin: "5px 0" }}>In this game of strategy and dluck every win brings you closer to an exclusive bonus.</Box>
                                <Box component="li" style={{ margin: "5px 0" }}>Keep your streaj akuve hit 10 consecutive wins or more and you will unclick special rewards that grow with your success.</Box>
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
                                    display: "inline-flex", // Use inline-flex to align items in a line
                                    alignItems: "center", // Center items vertically
                                    gap: "3px",
                                    color: "#24ee89",
                                }}
                                onClick={() =>
                                    navigate("/activity/lucky-10days/rule")
                                }
                            >
                                <img src="/assets/k3/howtoplay.svg" alt="" width="14px" />
                                Rules
                            </Button>

                        </Box>
                    </Box>

                </Card>
                <LuckyTenDaysInterest />
            </Container>
        </Mobile>
    );
};

export default Lucky10days;
