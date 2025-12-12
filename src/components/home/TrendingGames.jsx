import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import { GameContext } from "../../context/GameContext";

export default function TrendingGamesMosaic() {
    const { handleApiClick } = useContext(GameContext)
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
                width: "100%",
                maxWidth: "460px",
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

            <Box
                sx={{
                    display: "grid",
                    width: "calc(100% - 20px)",
                    px: "10px",
                    gap: 1.5,
                    pb: 2,
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gridAutoRows: "minmax(0, 1fr)",
                    gridTemplateAreas: `
        "aviator seven"
        "pappu   seven"
        "roulette crazy"
      `,
                }}
            >
                {/* Aviator - top-left */}
                <Box
                    sx={{
                        gridArea: "aviator",
                        borderRadius: "10px",
                        overflow: "hidden",
                        position: "relative",
                        width: "100%",
                        paddingBottom: "56.25%", // 16:9 aspect ratio
                    }}
                    onClick={() => handleApiClick(1,"SPRIBE", "SPRIBE" )}
                >
                    <Box
                        component="img"
                        src={items.aviator}
                        alt="Aviator"
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block"
                        }}
                    />
                </Box>

                {/* 7up7down - top-right and spans second row */}
                <Box
                    sx={{
                        gridArea: "seven",
                        borderRadius: "10px",
                        overflow: "hidden",
                        position: "relative",
                        width: "100%",
                        paddingBottom: "133.33%", // 3:4 aspect ratio (spans 2 rows)
                    }}
                    onClick={() => handleApiClick(51,"JILI", "SLOT" )}
                >
                    <Box
                        component="img"
                        src={items.sevenUp}
                        alt="7up7down"
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block"
                        }}
                    />
                </Box>

                {/* Pappu - second row left */}
                <Box
                    sx={{
                        gridArea: "pappu",
                        borderRadius: "10px",
                        overflow: "hidden",
                        position: "relative",
                        width: "100%",
                        paddingBottom: "56.25%", // 16:9 aspect ratio
                    }}
                    onClick={() => handleApiClick(52,"JILI", "SLOT" )}
                >
                    <Box
                        component="img"
                        src={items.pappu}
                        alt="Pappu"
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block"
                        }}
                    />
                </Box>

                {/* European Roulette - bottom-left */}
                <Box
                    sx={{
                        gridArea: "roulette",
                        borderRadius: "10px",
                        overflow: "hidden",
                        position: "relative",
                        width: "100%",
                        paddingBottom: "56.25%", // 16:9 aspect ratio
                    }}
                    onClick={() => handleApiClick(53,"JILI", "SLOT" )}
                >
                    <Box
                        component="img"
                        src={items.roulette}
                        alt="European Roulette"
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block"
                        }}
                    />
                </Box>

                {/* Crazy Time - bottom-right */}
                <Box
                    sx={{
                        gridArea: "crazy",
                        borderRadius: "10px",
                        overflow: "hidden",
                        position: "relative",
                        width: "100%",
                        paddingBottom: "56.25%", // 16:9 aspect ratio
                    }}
                >
                    <Box
                        component="img"
                        src={items.crazy}
                        alt="Crazy Time"
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block"
                        }}
                    />
                </Box>
            </Box>
        </Box>
    )
}
