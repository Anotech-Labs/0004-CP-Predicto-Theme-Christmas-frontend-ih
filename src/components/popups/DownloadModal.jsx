import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,Grid
} from '@mui/material'; import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const DownloadModal = ({ onClose, iconSrc }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const storedVisibility = localStorage.getItem('downloadBannerVisible');
        if (storedVisibility === 'false') {
            setIsVisible(false);
        }
    }, []);

    const handleDownload = () => {
        // const link = document.createElement("a");
        // link.href = `https://111club.online/abclottery.apk`;
        // link.download = "abclottery.apk";
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
    };

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('downloadBannerVisible', 'false');
    };

    if (!isVisible) return null;


    return (

        <Box
            sx={{
                position: 'fixed',
                left: '50%',
                bottom: '6.2rem',
                transform: 'translateX(-50%)',
                width: '10rem', // Adjusted for realistic size
                height: '2.5rem',
                background: 'linear-gradient(90deg,#24ee89,#9fe871)',
                borderRadius: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1rem',
                zIndex: 1000,
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
        >
            {/* App Icon */}
            <Box onClick={handleDownload} sx={{ display: 'flex', alignItems: 'center', }}>
                <Grid sx={{background:"#000000",display:"flex",justifyContent:"center",alignItems:"center",width: 23, marginRight: "5px"}}> <img
                    src="/assets/logo/a_logo2.webp"
                    alt="logo"
                    style={{ width: "100%" }}
                /></Grid>
               
                <Typography
                    variant="body1"
                    sx={{
                        color: '#232626',
                        fontFamily: "'-apple-system', 'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: "12.8px"
                    }}
                >
                    Add to Desktop
                </Typography>
                
            </Box>


            {/* Close Button */}
            <IconButton
                onClick={handleClose}
                sx={{
                    color: '#000000',
                    padding: 0,
                    marginRight: '-5px',
                    
                }}
            >
                <CancelOutlinedIcon />
            </IconButton>
        </Box>
    );
};

export default DownloadModal;