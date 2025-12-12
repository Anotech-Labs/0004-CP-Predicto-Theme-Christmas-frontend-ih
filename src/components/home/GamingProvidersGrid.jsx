import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';

const GamingProvidersGrid = () => {
    const providers = [
        { id: 1, name: 'JILI', image: '/assets/provider/jili.png', width: '2.5rem' },
        { id: 2, name: 'Spribe', image: '/assets/provider/spribe.png', width: '2.6rem' },
        { id: 3, name: 'JDB', image: '/assets/provider/jdb.png', width: '2.2rem' },
        { id: 4, name: 'Evolution', image: '/assets/provider/evolution.png', width: '4rem' },
        { id: 5, name: 'InOut', image: '/assets/provider/io.png', width: '4rem' },
        { id: 6, name: 'Hacksaw', image: '/assets/provider/hg.png', width: '3.7rem' },
        { id: 7, name: 'PG Soft', image: '/assets/provider/pg.png', width: '3.9rem' },
        { id: 8, name: 'Playtech', image: '/assets/provider/play.png', width: '3.9rem' },
        { id: 9, name: 'Turbo Games', image: '/assets/provider/tg.png', width: '3.9rem' },
        { id: 10, name: 'Evoplay', image: '/assets/provider/evo.png', width: '4rem' },
        { id: 11, name: 'Microgaming', image: '/assets/provider/mg.png', width: '4.3rem' },
        { id: 12, name: 'Habanero', image: '/assets/provider/haba.png', width: '4.2rem' },
        { id: 13, name: 'SA Gaming', image: '/assets/provider/sa.png', width: '4rem' },
    ];

    const socials = [
        { id: 1, name: 'Telegram', image: '/assets/provider/tele.png', bg: '#1393c6', width: '6.5rem' },
        { id: 2, name: 'Facebook', image: '/assets/provider/fb.png', bg: '#2b56a7', width: '6.5rem' },
        { id: 3, name: 'Instagram', image: '/assets/provider/insta.png', bg: '#d92f73', width: '6.5rem' },
        { id: 4, name: 'WhatsApp', image: '/assets/provider/whats.png', bg: '#1db341', width: '6.5rem' },
        { id: 5, name: 'YouTube', image: '/assets/provider/yt.png', bg: '#c60e1b', width: '6.5rem' },
    ];

    return (
        <Box
            sx={{
                width: '100%',
                mx: 1.5,
                mt: 1.5,
            }}
        >
            <Grid
                container
                spacing={1}
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: "calc(100% - 15px)",
                    // px: 1
                }}
            >
                {providers.map((provider) => (
                    <Grid
                        item
                        key={provider.id}
                        xs={3}
                        sx={{
                            mb: 0.75,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                backgroundColor: '#373b3c',
                                borderRadius: '0.5rem',
                                height: '2.65rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {provider.image ? (
                                <Box
                                    component="img"
                                    src={provider.image}
                                    alt={provider.name}
                                    sx={{
                                        width: provider.width,
                                        height: 'auto',
                                        objectFit: 'contain',
                                        pointerEvents: 'none',
                                        display: 'block',
                                    }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        width: provider.width,
                                        height: '100%',
                                    }}
                                />
                            )}
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            {/* </Box> */}

            <Box sx={{ color: 'white', fontWeight: 800, my: 1.5, textAlign: "start", fontSize: "16px" }}>Community</Box>


            <Grid
                container
                spacing={1}
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: "calc(100% - 12px)",
                    // px: 1
                }}
            >
                {socials.map((item) => (
                    <Grid
                        item
                        key={socials.id}
                        xs={4}
                        sx={{
                            mb: 0.75,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                backgroundColor: item.bg,
                                borderRadius: '0.5rem',
                                height: '2.65rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Box
                                component="img"
                                src={item.image}
                                alt={item.name}
                                sx={{ width: item.width, height: 'auto', objectFit: 'contain', pointerEvents: 'none' }}
                            />
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    mb: -4,
                    pt: 2,
                    justifyContent: "center",
                    fontSize: "14px",
                    lineHeight: "1rem",
                    color: "rgb(179,190,193)",
                }}
            >
                <Typography sx={{ mr: 3, fontSize: "12px" }}>Privacy Policy</Typography>
                |
                <Typography sx={{ ml: 3, fontSize: "12px" }}>Terms Of Service</Typography>
            </Box>
        </Box>
    );
};

export default GamingProvidersGrid;
