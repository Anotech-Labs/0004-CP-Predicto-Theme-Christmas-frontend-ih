import React, { useState,useContext } from "react";
import { useSwipeable } from "react-swipeable";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { EVO_Video, IDEAL, SEXY_Video, V8 } from "../../data/GameImg";
import { GameContext } from "../../context/GameContext";
// Styled Components
const ScrollContainer = styled(Box)({
    width: "100%",
    overflow: "hidden",
    position: "relative",
    // transform: "skew(-3deg)",
    // "& > *": {
    //     transform: "skew(3deg)", // Counter-skew inner content
    // },
})

const TabsWrapper = styled(Box)({
    display: "flex",
    overflowX: "auto",
    scrollBehavior: "smooth",
    // scrollbarWidth: "none", border: "1px solid #224BA2",
    background: "linear-gradient(180deg,rgba(232,142,52,.5) 0%,rgba(106,94,86,.2) 100%)",

    "&::-webkit-scrollbar": {
        display: "none",
    },
    "msOverflowStyle": "none",
    // transform: "skew(-3deg)",
    // "& > *": {
    //     transform: "skew(3deg)", // Counter-skew inner content
    // },
    borderRadius: "5px",
})

const TabButton = styled(Box)(({ active }) => ({
    padding: "8px 14px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    position: "relative",
    whiteSpace: "nowrap",
    // Remove border-radius
    borderRadius: "5px",
    transition: "all 0.3s ease",
    background: active
        ? "linear-gradient(180deg, #FED358 0%, #FFB472 100%)"
        : "transparent",
    // Transform the container into a parallelogram
    // transform: "skew(-3deg)",
    // "& > *": {
    //     transform: "skew(3deg)", // Counter-skew the content
    // },
    // border: active ? "1px solid #ffffff" : "transparent"
}))

const Label = styled("span")(({ active }) => ({
    color: active ? "#05012b" : "#B79C8B",
    fontSize: "14px",
    fontWeight: active ? "600" : "400",
}))

const gamesDataWithSVG = {
    IDEAL: {
        name: "IDEAL",
        games: IDEAL,
        icon: (isSelected) => (
            <img
                src={isSelected ? "/assets/casino/iDeal-black.webp" : "/assets/casino/iDeal-grey.webp"}
                alt="IDEAL"
                width="50"
                
            />
        )
    },
    EVO_Video: {
        name: "EVO_Video",
        games: EVO_Video,
        icon: (isSelected) => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 5 135 40" fill={isSelected ? "black" : "#B79C8B"}>
                <path d="M38.4321 12.6882H54.5375V16.601H42.6177V22.3081H50.5531V26.2209H42.6177V32.6109H54.9067V36.5238H38.4321V12.6882Z" fill={isSelected ? "black" : "#B79C8B"}></path>
                <path d="M53.7466 19.5794H58.0321L61.7818 31.3893L65.2638 19.5794H69.4161L63.6567 36.5221H59.8055L53.7466 19.5794Z" fill={isSelected ? "black" : "#B79C8B"}></path>
                <path d="M68.76 28.0864C68.76 22.918 72.1088 19.2566 76.8966 19.2566C81.6512 19.2566 85 22.918 85 28.0864C85 33.1835 81.5846 36.8449 76.7968 36.8449C72.0406 36.8449 68.76 33.2549 68.76 28.0864ZM80.7795 28.1935V28.0508C80.7795 24.8209 79.3056 22.8823 76.895 22.8823C74.4512 22.8823 72.9773 24.8209 72.9773 28.0508V28.1935C72.9773 31.352 74.4163 33.2192 76.8285 33.2192C79.2723 33.2192 80.7795 31.3537 80.7795 28.1935Z" fill={isSelected ? "black" : "#B79C8B"}></path>
                <path d="M32.5317 39.6466C31.8185 39.6466 31.2416 39.0265 31.2416 38.2619C31.2432 37.4956 31.8201 36.8772 32.5317 36.8772C33.2465 36.8772 33.8218 37.4956 33.8233 38.2619C33.8218 39.0265 33.2449 39.6466 32.5317 39.6466ZM32.5317 36.5221C31.6378 36.5221 30.912 37.302 30.912 38.2619C30.912 39.2218 31.6378 40 32.5317 40C33.4271 40 34.153 39.2218 34.153 38.2619C34.153 37.302 33.4271 36.5221 32.5317 36.5221Z" fill={isSelected ? "black" : "#B79C8B"}></path>
                <path d="M29.885 23.776C31.1751 23.8202 32.5903 23.7828 34.153 23.6503C33.928 20.2777 32.9041 17.476 31.37 15.3047C31.4429 15.8993 31.4841 16.5042 31.4841 17.1209C31.4841 19.5353 30.9025 21.8035 29.885 23.776Z" fill={isSelected ? "black" : "#B79C8B"}></path>
                <path d="M29.3445 24.7326C27.0433 28.4466 23.1081 30.8949 18.6372 30.8949C18.3187 30.8949 18.0033 30.8779 17.6911 30.8542C16.55 32.7299 15.813 34.8129 15 36.7719C23.0194 41.3626 33.3748 36.5221 34.153 24.8345C32.3685 24.6833 30.7757 24.6561 29.3445 24.7326Z" fill={isSelected ? "black" : "#B79C8B"}></path>
                <path d="M15 11.7146C17.2299 17.0938 18.9003 23.4073 29.885 23.776C30.9025 21.8035 31.4841 19.5353 31.4841 17.1209C31.4841 16.5042 31.4429 15.8993 31.37 15.3047C27.5885 9.95786 20.7039 8.44912 15 11.7146Z" fill={isSelected ? "black" : "#B79C8B"}></path>
                <path d="M29.3445 24.7326C22.7341 25.0826 19.6294 27.6668 17.6911 30.8542C18.0033 30.8779 18.3187 30.8949 18.6372 30.8949C23.1081 30.8949 27.0433 28.4449 29.3445 24.7326Z" fill={isSelected ? "black" : "#B79C8B"}></path>
                <path d="M31.912 37.98H31.6695V37.8084H32.3574V37.98H32.1165V38.7156H31.912V37.98Z" fill={isSelected ? "black" : "#B79C8B"}></path>
                <path d="M32.443 37.8066H32.7663L32.9216 38.3859L33.0832 37.8066H33.3986V38.7138H33.1973V37.9816L32.9834 38.7138H32.8233L32.6173 37.985V38.7138H32.443V37.8066Z" fill={isSelected ? "black" : "#B79C8B"}></path>
            </svg>
        )
    },
    SEXY_Video: {
        name: "SEXY_Video",
        games: SEXY_Video,
        icon: (isSelected) => (
            <img
                src={isSelected ? "/assets/casino/video_black.webp" : "/assets/casino/video_grey.webp"}
                alt="SEXY Icon"
                width="50"
            />
        )
    },
    V8Games: {
        name: "V8Games",
        games: V8,
        icon: (isSelected) => (
            <img
                src={isSelected ? "/assets/casino/V8-1.webp" : "/assets/casino/V8.webp"}
                alt="V8"
                width="50"
            />
        )
    },
};


const Casino = () => {
    const [currentCategory, setCurrentCategory] = useState("IDEAL");
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 6;

    const navigate = useNavigate();
    const currentGames = gamesDataWithSVG[currentCategory].games;
    const totalPages = Math.ceil(currentGames.length / itemsPerPage);

    const { handleApiClick } = useContext(GameContext);
    const handlers = useSwipeable({
        onSwipedLeft: () => handleNext(),
        onSwipedRight: () => handlePrev(),
        trackMouse: true,
    });

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, totalPages - 1));
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleCategoryChange = (category) => {
        setCurrentCategory(category);
        setCurrentIndex(0);
    };
    const handleAllGamesClick = () => {
        navigate("/all-games/Casino");
    };
    const visibleGames = currentGames.slice(
        currentIndex * itemsPerPage,
        (currentIndex + 1) * itemsPerPage
    );

    return (
        <Box sx={{}}>
            <Box sx={{}}>
                <Grid item sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                    <img src="/assets/gameFilter/casino.webp" alt="" width="21px" />
                    <Typography sx={{ fontSize: "16px", color: "#ffffff", mx: 1, whiteSpace: "nowrap", fontWeight:"bold",
                fontFamily: "'Times New Roman', Times,  ", }}>
                        Casino
                    </Typography>
                </Grid>

                <Box sx={{
                    // background: "#011341",
                    // borderRadius: "8px",
                    mt: 1,
                
                }}>
                    <ScrollContainer>
                        <TabsWrapper>
                            {Object.keys(gamesDataWithSVG).map((category) => (
                                <TabButton
                                    key={category}
                                    active={currentCategory === category}
                                    onClick={() => handleCategoryChange(category)}
                                >
                                    {gamesDataWithSVG[category].icon(currentCategory === category)}
                                    <Label active={currentCategory === category}>
                                        {gamesDataWithSVG[category].name}
                                    </Label>
                                </TabButton>
                            ))}
                        </TabsWrapper>
                    </ScrollContainer>
                </Box>
                {/* Games Grid */}
                <Box {...handlers} sx={{ flexGrow: 1, maxWidth: 600, margin: "auto" }}>
                    <Box sx={{ paddingTop: "10px" }}>
                        <Grid container spacing={1}>
                            {visibleGames.map((game) => (
                                <Grid item xs={4} sm={4} md={4} key={game.id}>
                                    <Box
                                        sx={{
                                            position: "relative",
                                            borderRadius: "8px",
                                            textAlign: "center",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => handleApiClick(game.id, currentCategory, "CASINO")}
                                    >
                                        <img
                                            src={game.imgSrc}
                                            alt={game.game}
                                            style={{
                                                width: "100%",
                                                height: "auto",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Casino