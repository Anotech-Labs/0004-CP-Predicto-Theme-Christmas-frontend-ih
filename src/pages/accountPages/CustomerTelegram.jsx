import {
    Box,
    Typography,
    Container,
    List,
    Avatar,
    ListItem,
    Grid,
    IconButton,
    Paper,
    ListItemText,
    ListItemAvatar,
    Button,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import Mobile from "../../components/layout/Mobile";
import { useEffect, useState } from "react";
import { domain } from "../../utils/Secret";
import { useAuth } from "../../context/AuthContext";

const CustomerTelegram = () => {
    const navigate = useNavigate()
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

  const { axiosInstance } = useAuth();
          const fetchTelegramLinks = async () => {
            try {
                setIsLoading(true);
                const response = await axiosInstance.get(
                    `${domain}/api/additional/telegram-channel/get-telegram`
                );
                const telegramLinks = Array.isArray(response.data) ? response.data : [];

                const dynamicServices = [
                    {
                        text: 'Change ID Login Password',
                        img: '/assets/icons/customer/id.svg',
                        link: '/tms/change-password',
                    },
                    ...telegramLinks.map(item => ({
                        text: item.title || 'Official Telegram Channel',
                        img: '/assets/icons/customer/telegram.svg',
                        link: item.link, // Make sure your API returns this
                    })),
                ];

                setServices(dynamicServices);
            } catch (error) {
                console.error("Error fetching Telegram links:", error);
            } finally {
                setIsLoading(false);
            }
        };
  useEffect(() => {

        fetchTelegramLinks();
    }, []);

    return (
        <Mobile>
            <Box
                display="flex"
                flexDirection="column"
                height="100vh"
                sx={{
                    backgroundColor: "#232626",
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        justifyContent: 'space-between',
                        backgroundColor: '#232626,'
                    }}
                >
                    <HomeIcon sx={{ color: '#fff' }} onClick={() => navigate('/')} />
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 500, fontSize: '18px' }}>
                        Self Service Center
                    </Typography>
                    <Grid
                        item
                        xs={4}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                        }}
                    >
                        <img
                            src="assets/icons/english.webp"
                            alt="logo"
                            style={{ width: "25px", marginRight: "8px" }}
                        />
                        <Typography
                            sx={{
                                fontWeight: "550",
                                fontSize: "16px",
                                color: "#ffffff",
                                marginRight: "13px",
                            }}
                        >
                            EN
                        </Typography>
                    </Grid>
                </Box>

                {/* Banner */}
                <Box sx={{ p: 0, backgroundColor: '#232626' }}>
                    <Box
                        sx={{
                            position: 'relative',
                            backgroundColor: '',
                            // borderRadius: '12px',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            component="img"
                            src="/assets/icons/customer/customer.webp"
                            alt="Customer Service Banner"
                            sx={{
                                width: "100%",
                                height: "auto",
                            }}
                        />
                    </Box>
                </Box>

                {/* Self Service Section */}
                <Box sx={{ p: 2, bgcolor: '#232626', flexGrow: 1 }}>
                    <Typography
                        sx={{
                            fontSize: '18px',
                            fontWeight: 500,
                            color: '#fff',
                            mb: 2,
                            textAlign: 'left',
                        }}
                    >
                        Self Service
                    </Typography>

                    <List sx={{ bgcolor: '#323738', borderRadius: '12px', overflow: 'hidden' }}>
                        {services.map((service, index) => (
                            <Box key={index}>
                                <ListItem
                                    button
                                    onClick={() => {
                                        if (service.link.startsWith("http")) {
                                            window.open(service.link, "_blank");
                                        } else {
                                            navigate(service.link);
                                        }
                                    }}
                                    sx={{
                                        py: 1.5,
                                        px: 2,
                                    }}
                                    secondaryAction={
                                        <ArrowForwardIosIcon fontSize="small" sx={{ color: '#9e9e9e' }} />
                                    }
                                >

                                    <Box
                                        component="img"
                                        src={service.img}
                                        alt={service.text}
                                        sx={{ width: 40, height: 40 }}
                                    />
                                    {/* </Avatar> */}
                                    <ListItemText
                                        primary={service.text}
                                        primaryTypographyProps={{
                                            sx: {
                                                color: '#fff',
                                                fontSize: '16px',
                                                fontWeight: "400",
                                                ml: 2,
                                            }
                                        }}
                                    />
                                </ListItem>
                                {index < services.length - 1 && (
                                    <Box
                                        sx={{
                                            height: '1px',
                                            bgcolor: '#666',
                                            ml: 2,
                                            mr: 2,
                                        }}
                                    />
                                )}
                            </Box>
                        ))}
                    </List>

                    {/* Kind Tips Section */}

                    <Box
                        sx={{
                            mt: 3,
                            bgcolor: '#323738',
                            borderRadius: '12px',
                            p: 2,
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: '#fff',
                                fontWeight: 500,
                                mb: 1.5,
                                textAlign: "left"
                            }}
                        >
                            Kind tips
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#666',
                                mb: 1.5,
                                fontSize: '14px',
                                lineHeight: 1.4,
                                textAlign: 'left'
                            }}
                        >
                            1. Please select the corresponding question and submit it for review. After successful submission, the customer service specialist will handle it for you immediately. Please wait patiently.
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#666',
                                mb: 1.5,
                                fontSize: '14px',
                                lineHeight: 1.4,
                                textAlign: 'left'
                            }}
                        >
                            2. After submitting for review, you can use [Progress Query] to view the review results of the work order you submitted.
                        </Typography>
                    </Box>

                </Box>
            </Box>
        </Mobile>
    );
};

export default CustomerTelegram;