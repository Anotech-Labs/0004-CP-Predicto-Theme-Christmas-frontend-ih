import { Box, Button, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const JackpotSection = () => {
    return (
        <Box sx={{ mx: { xs: 0.5, sm: 1 } }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: { xs: 0.75, sm: 1 },
                    mx: { xs: 0.5, sm: 1},
                    color: "white",
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                    gap: { xs: 1, sm: 0 },
                }}
            >
                {/* Left Section */}
                <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, sm: 1 } }}>
                    {/* Green Dot */}
                    <Box
                        sx={{
                            width: { xs: 8, sm: 10 },
                            height: { xs: 8, sm: 10 },
                            bgcolor: "#00FF3C",
                            borderRadius: "50%",
                        }}
                    />
                    <Typography 
                        sx={{
                            fontSize: { xs: 14, sm: 15 },
                            fontWeight: 600
                        }}
                    >
                        Jackpot of the Day
                    </Typography>
                </Box>

                {/* Right Section */}
                <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, sm: 1 } }}>
                    {/* More Button */}
                    <Button
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            color: "white",
                            background: "#373e3f",
                            border: "none",
                            borderRadius: { xs: "6px", sm: "8px" },
                            px: { xs: 1, sm: 1.5 },
                            py: { xs: 0.4, sm: 0.5 },
                            fontSize: { xs: 12, sm: 13 },
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            minWidth: "auto",
                        }}
                    >
                        More
                        <ChevronRightIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                    </Button>

                    {/* Navigation Buttons */}
                    <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
                        <IconButton
                            sx={{
                                width: { sm: 28 },
                                height: { sm: 28 },
                                borderRadius: "6px",
                                bgcolor: "#2F2F2F",
                                color: "white",
                            }}
                        >
                            <ChevronLeftIcon sx={{ fontSize: { sm: 20, } }} />
                        </IconButton>

                        <IconButton
                            sx={{
                                width: { sm: 28 },
                                height: { sm: 28 },
                                borderRadius: "6px",
                                bgcolor: "#2F2F2F",
                                color: "white",
                            }}
                        >
                            <ChevronRightIcon sx={{ fontSize: { sm: 20, } }} />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    mb: { xs: 1.5, sm: 2 },
                    overflow: "hidden",
                    borderRadius: { xs: "12px", sm: "14px"},
                }}
            >
                {/* Background */}
                <Box
                    component="img"
                    src="/assets/christmas1-WPz6Ce1h.webp"
                    alt="Background"
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                        // minHeight: { xs: "160px", sm: "200px", md: "240px" },
                    }}
                />
                
                {/* Inner Content */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: { xs: 2, sm: 3, },
                    }}
                >
                    {/* Left side - Trophy + Coins */}
                    <Box 
                        sx={{ 
                            position: "relative", 
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Box
                            component="img"
                            src="/assets/trophy-B3u8sNrg-Bogwg3F_.webp"
                            alt="Trophy"
                            sx={{
                                width: { xs: "80px", sm: "100px" },
                                height: "auto",
                            }}
                        />
                    </Box>
                    
                    {/* Right side - Text content */}
                    <Box 
                        sx={{ 
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            ml: { xs: 2, },
                        }}
                    >
                        {/* Daily Jackpot with decorative elements */}
                        <Box 
                            sx={{ 
                                display: "flex", 
                                alignItems: "center",
                                gap: { xs: 0.5, sm: 1 },
                                mb: { xs: 0.5, sm: 1 },
                            }}
                        >
                            <Box
                                component="img"
                                src="/assets/grass.png"
                                alt=""
                                sx={{
                                    width: { xs: 18, sm: 24 },
                                    height: { xs: 18, sm: 24 },
                                    flexShrink: 0,
                                }}
                            />
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    fontSize: { xs: "16px", sm: "20px" },
                                    color: "rgb(0,255,153)",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Daily Jackpot
                            </Typography>
                            <Box
                                component="img"
                                src="/assets/grass.png"
                                alt=""
                                sx={{
                                    width: { xs: 18, sm: 24 },
                                    height: { xs: 18, sm: 24 },
                                    transform: "scaleX(-1)",
                                    flexShrink: 0,
                                }}
                            />
                        </Box>
                        
                        {/* Prize amount */}
                        <Box
                            sx={{
                                px: { xs: 2, sm: 2.5, },
                                py: { xs: 0.5, sm: 0.75, },
                                borderRadius: { xs: "8px", sm: "10px" },
                                bgcolor: "rgba(0,0,0,0.6)",
                                textAlign: "center",
                                mb: { xs: 1, sm: 1.5 },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: { xs: "20px", sm: "26px" },
                                    fontWeight: 800,
                                    color: "rgb(36,238,137)",
                                    lineHeight: 1,
                                }}
                            >
                                ₹2270306.35
                            </Typography>
                        </Box>
                        
                        {/* My Rank and My Prize */}
                        <Box 
                            sx={{ 
                                display: "flex", 
                                gap: { xs: 2, sm: 3 },
                                alignItems: "center",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: { xs: "11px", sm: "13px" },
                                    color: "#fff",
                                    fontWeight: 500,
                                }}
                            >
                                My Rank: <Box component="span" sx={{ color: "rgb(255,193,7)" }}>500th+</Box>
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: { xs: "11px", sm: "13px" },
                                    color: "#fff",
                                    fontWeight: 500,
                                }}
                            >
                                My Prize: <Box component="span" sx={{ color: "rgb(255,193,7)" }}>₹0</Box>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default JackpotSection;