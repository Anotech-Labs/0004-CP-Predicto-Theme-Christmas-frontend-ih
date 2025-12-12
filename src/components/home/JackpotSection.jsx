import { Box, Button, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useAuth } from "../../context/AuthContext";
import { keyframes } from "@mui/system";
import { useEffect, useState } from "react";

const RollingDigit = ({ value }) => {
    const [display, setDisplay] = useState(value);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            // show random numbers while rolling
            setDisplay(Math.floor(Math.random() * 10));
            i++;

            // after small flips, stop on real digit
            if (i > 6) {
                clearInterval(interval);
                setDisplay(value);
            }
        }, 40);

        return () => clearInterval(interval);
    }, [value]);

    return (
        <Box
            sx={{
                display: "inline-block",
                width: "18px",
                textAlign: "center",
                transition: "transform 0.2s",
                fontVariantNumeric: "tabular-nums",
            }}
        >
            {display}
        </Box>
    );
};


const JackpotSection = () => {
    const base = "2270";
    const [randomDigits, setRandomDigits] = useState("3063");
    const { isAuthenticated } = useAuth();

    const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.6);
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

    useEffect(() => {
        const interval = setInterval(() => {
            const last4 = Math.floor(1000 + Math.random() * 9000)
                .toString();
            const decimal = Math.floor(Math.random() * 100)
                .toString()
                .padStart(2, "0");

            setRandomDigits(last4 + decimal);
        }, 1200);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{ mx: { xs: 0.5, sm: 1 } }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: { xs: 0.75, sm: 1 },
                    mx: { xs: 0.5, sm: 1 },
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
                            animation: `${pulse} 1.5s ease-in-out infinite`,
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
                    borderRadius: { xs: "12px", sm: "14px" },
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
                            mt: 1,
                            ml: { xs: 2, },
                        }}
                    >
                        {/* Daily Jackpot with decorative elements */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: { xs: 0.5, sm: 1 },
                                mb: { xs: 0 },
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
                                    fontSize: { xs: "15px", sm: "18px" },
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
                        {!isAuthenticated &&(
                        <Typography sx={{
                            color: "#ddd", mb: 0.5, fontSize: { xs: "12px", sm: "14px", md: "16px" }
                        }}>
                            Jackpot prize pool
                        </Typography>
                        )}

                        {/* Prize amount */}
                        <Box
                            sx={{
                                px: { xs: 2, sm: 2.5, },
                                py: { xs: 0.5, sm: 0.75, },
                                borderRadius: { xs: "8px", sm: "10px" },
                                bgcolor: "rgba(0,0,0,0.6)",
                                textAlign: "center",
                                mt: { xs: 1 },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: { xs: "20px", sm: "22px" },
                                    fontWeight: 800,
                                    color: "rgb(36,238,137)",
                                }}
                            >
                                ₹{base}
                                {/* last 4 digits */}
                                <RollingDigit value={randomDigits[0]} />
                                <RollingDigit value={randomDigits[1]} />
                                <RollingDigit value={randomDigits[2]} />

                                {"."}

                                {/* decimals */}
                                <RollingDigit value={randomDigits[3]} />
                                <RollingDigit value={randomDigits[4]} />
                            </Typography>
                        </Box>

                        {/* My Rank and My Prize */}
                        {isAuthenticated && (
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
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default JackpotSection;