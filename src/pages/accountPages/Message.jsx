import React, { useEffect, useState } from "react"
import Mobile from "../../components/layout/Mobile"
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { useNavigate } from "react-router-dom"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import CampaignIcon from '@mui/icons-material/Campaign'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { useAuth } from "../../context/AuthContext"
import { domain } from "../../utils/Secret"
const Message = ({ children }) => {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty("--vh", `${vh}px`)
    }

    window.addEventListener("resize", setVh)
    setVh()

    return () => window.removeEventListener("resize", setVh)
  }, [])

  const navigate = useNavigate()
  const handleBackClick = () => navigate(-1)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page] = useState(1)
  const [limit] = useState(10)
  
  const { axiosInstance } = useAuth()

  
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`${domain}/api/account/v1/notifications/global`, {
          withCredentials: true,
          params: {
            page,
            limit
          }
        })
        setNotifications(response.data.data.items)
        setError(null)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch notifications')
      } finally {
        setLoading(false)
      }
    }
    useEffect(() => {
    fetchNotifications()
  }, [axiosInstance, page, limit])

  return (
    <>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          sx={{ bgcolor: "#232626" }}
        >
          <Box
            sx={{
              bgcolor: "#232626",
              padding: "8px 10px",
              display: "flex",
              alignItems: "center",
              color: "#ffffff",
            }}
          >
            <ChevronLeftIcon
              sx={{ fontSize: 30, cursor: "pointer" }}
              onClick={handleBackClick}
            />

            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
              }}
            >
              Notification
            </Typography>
          </Box>

         <Card sx={{
            background: "#232626",
            py: 0,
            px: 2,
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            paperShadow: "none",
          }}elevation={0}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress sx={{ color: '#ffffff' }} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
            ) : notifications.length === 0 ? (
              <Typography sx={{ color: '#a8a5a1', textAlign: 'center', mt: 2 }}>
                No notifications available
              </Typography>
            ) : (
              notifications.map((notification, index) => (
                <Card
                  key={index}
                  sx={{
                    my: 1.5,
                    boxShadow: 2,
                    borderRadius: 2,
                    bgcolor: "#323738",
                    textAlign: "left"
                  }}
                >
                  <CardContent sx={{ p: 1 }}>
                    <Grid container spacing={1}>
                      <Grid item>
                        <Box
                          component="img"
                          src="../assets/account/livechat.svg"
                          alt=""
                          sx={{ width: "30px", height: "30px" }}
                        />
                      </Grid>
                      <Grid item xs>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#ffffff",
                            fontSize: "16px",
                            textAlign: "left"
                          }}
                        >
                          {notification.title}
                        </Typography>
                        </Grid>
                      </Grid>
                      <Grid item sx={{ mb: "-14px" }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#B79C8B",
                            mb: 1,
                            mt: 0.1,
                            p: 0.3,
                            lineHeight: 1.05,
                            fontSize: "11.8px",
                            textAlign: "left"
                          }}
                        >
                          {notification.body}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#b3bec1", textAlign: "left", fontSize: "11px" }}
                        >
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      
                    </Grid>
                  </CardContent>
                </Card>
              ))
            )}
          </Card>


          {children}
        </Box>
      </Mobile>
    </>
  )
}

export default Message