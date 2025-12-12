import React from "react";
import { Box, Typography } from "@mui/material";

export default function TrendingGamesMosaic() {
    const items = {
        aviator: "/assets/TrendingGames/Aviator_251210_189.webp",
        sevenUp: "/assets/TrendingGames/7up7down_251210_69.webp",
        pappu: "/assets/TrendingGames/114.webp",
        roulette: "/assets/TrendingGames/EuropeanRoulette_251210_62.webp",
        crazy: "/assets/TrendingGames/CrazyTime_251210_184.webp",
    };

    return (
        <Box
            sx={{
                width: "auto",
                bgcolor: "transparent",
                color: "white",
                textAlign: "left"
            }}
        >
            <Typography
                variant="body1"
                sx={{
                    fontWeight: 700,
                    color: "#ffffffde",
                    px: 2,
                    mb: 1
                }}
            >
                Trending Games
            </Typography>

            {/* Main grid matching the screenshot exactly */}
            <Box
                sx={{
                    display: "grid",
                    width: "calc(100% - 20px)",
                    px: "10px",
                    gap: 1.5,
                    pb: 2,
                    // 2 columns; 3 rows with explicit named areas
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gridTemplateRows: {
                        xs: "auto", // single column stacked on xs
                        sm: "110px 110px 110px", // default for small and up
                        md: "130px 130px 130px",
                        lg: "140px 140px 140px",
                    },
                    gridTemplateAreas: {
                        xs: `"aviator"
                 "seven"
                 "pappu"
                 "roulette"
                 "crazy"`,
                        sm: `"aviator seven"
                 "pappu   seven"
                 "roulette crazy"`,
                    },
                }}
            >
                {/* Aviator - top-left */}
                <Box
                    sx={{
                        gridArea: "aviator",
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: 1,
                    }}
                >
                    <Box
                        component="img"
                        src={items.aviator}
                        alt="Aviator"
                        sx={{ width: "auto", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }}
                    />
                </Box>

                {/* 7up7down - top-right and spans second row */}
                <Box
                    sx={{
                        gridArea: "seven",
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: 1,
                        backgroundColor: "#111",
                    }}
                >
                    <Box
                        component="img"
                        src={items.sevenUp}
                        alt="7up7down"
                        sx={{ width: "auto", height: "100%", display: "block", objectFit: "contain", objectPosition: "center" }}
                    />
                </Box>

                {/* Pappu - second row left */}
                <Box
                    sx={{
                        gridArea: "pappu",
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: 1,
                        backgroundColor: "#111",
                    }}
                >
                    <Box
                        component="img"
                        src={items.pappu}
                        alt="Pappu"
                        sx={{ width: "auto", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }}
                    />
                </Box>

                {/* European Roulette - bottom-left */}
                <Box
                    sx={{
                        gridArea: "roulette",
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: 1,
                        backgroundColor: "#111",
                    }}
                >
                    <Box
                        component="img"
                        src={items.roulette}
                        alt="European Roulette"
                        sx={{ width: "auto", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }}
                    />
                </Box>

                {/* Crazy Time - bottom-right */}
                <Box
                    sx={{
                        gridArea: "crazy",
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: 1,
                        backgroundColor: "#111",
                    }}
                >
                    <Box
                        component="img"
                        src={items.crazy}
                        alt="Crazy Time"
                        sx={{ width: "auto", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }}
                    />
                </Box>
            </Box>
        </Box>
    )
}
