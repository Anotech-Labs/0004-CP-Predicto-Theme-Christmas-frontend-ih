import React, { useEffect, useState } from "react"
import Mobile from "../../../components/layout/Mobile"
import IconButton from "@mui/material/IconButton"
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Button, useMediaQuery } from '@mui/material'
import { useNavigate } from "react-router-dom"
import { Link } from 'react-router-dom'
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import { domain } from "../../../utils/Secret"
import coinimg from "../../../assets/activity/cointri.webp"
import giftimg from "../../../assets/activity/giftbox.webp"
import "./Attendance.css"
import ErrorPopup from "../../../components/popups/ErrorPopup"
import { useAuth } from '../../../context/AuthContext'

function CoinBox({ coinboxAmount, coinboxDay, onClick, disabled, status, message, isCurrentDay }) {
  return (
    <div
      className={`coinbox-container ${disabled ? "disabled" : ""} ${isCurrentDay ? "current-day" : ""}`}
      onClick={disabled ? null : onClick}
      style={{
        border: isCurrentDay ? '2px solid #FED358' : 'none',
        position: 'relative',
        height: '100px',
      }}
    >
      <div className="coinbox-amount" style={{
        color: status === 'COMPLETED' ? '#B79C8B' : '#FDE4BC',
        fontWeight: isCurrentDay ? 'bold' : 'normal'
      }}>
        {coinboxAmount}
      </div>
      <div className="coinbox-image">
        <img src={coinimg} alt="" />
      </div>
      <div className="coinbox-day" style={{
        color: "#B79C8B",
        fontWeight: isCurrentDay ? 'bold' : 'normal'
      }}>
        {coinboxDay}
      </div>
      {message && <div className="requirement-message" style={{ fontSize: '10px', color: '#B79C8B' }}>{message}</div>}
      {isCurrentDay && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          background: '#FED358',
          color: '#000000',
          padding: '2px 6px',
          borderRadius: '10px',
          fontSize: '10px'
        }}>
          Current
        </div>
      )}
    </div>
  )
}

const Attendance = ({ children }) => {
  const navigate = useNavigate()
  const isSmallScreen = useMediaQuery('(max-width:350px)')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attendanceData, setAttendanceData] = useState({
    progress: { streak: 0, percentage: 0 },
    current: { day: 1, eligible: false, message: "" },
    tasks: []
  })
  const { axiosInstance } = useAuth()

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty("--vh", `${vh}px`)
    }
    window.addEventListener("resize", setVh)
    setVh()
    return () => window.removeEventListener("resize", setVh)
  }, [])

  const handleRedirect = () => {
    navigate(-1)
  }

  const fetchAttendanceData = async () => {
    try {
      setLoading(true)
      const { data } = await axiosInstance.get(`${domain}/api/activity/attendance/eligibility`)
      if (data.success) {
        // Transform API response to match component's data structure
        const transformedData = {
          progress: {
            streak: data.data.progress.streak,
            percentage: data.data.progress.percentage
          },
          current: {
            day: data.data.current.day,
            eligible: data.data.current.eligible,
            message: data.data.current.message,
            nextRuleId: data.data.current.nextRuleId
          },
          tasks: data.data.tasks.map(task => ({
            day: task.day,
            status: task.status,
            bonus: task.bonus,
            deposit: {
              required: task.deposit.required,
              current: task.deposit.current,
              remaining: Math.max(0, task.deposit.required - task.deposit.current)
            }
          }))
        }
        setAttendanceData(transformedData)
      }
      setError(null)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Failed to fetch attendance data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendanceData()
  }, [axiosInstance])

  const claimBonus = async () => {
    if (!attendanceData?.current?.eligible) {
      return
    }

    try {
      setLoading(true)
      await axiosInstance.post(`${domain}/api/activity/attendance/claim`, {
        ruleId: attendanceData.current.nextRuleId
      })
      await fetchAttendanceData()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to claim bonus")
    } finally {
      setLoading(false)
    }
  }

  const renderTask = (task, index) => {
    const isCurrentDay = task.day === attendanceData.current.day
    const isCompleted = task.status === 'COMPLETED'
    const isEligible = isCurrentDay && attendanceData.current.eligible

    if (index < 6) {
      return (
        <CoinBox
          key={task.day}
          coinboxAmount={`₹${task.bonus.toFixed(2)}`}
          coinboxDay={`${task.day} Day`}
          onClick={isCurrentDay && isEligible ? claimBonus : undefined}
          disabled={!isCurrentDay || !isEligible || loading || isCompleted}
          status={task.status}
          isCurrentDay={isCurrentDay}
          message={
            isCurrentDay && !isEligible && task.deposit?.remaining > 0
              ? `Deposit ₹${task.deposit.remaining} more`
              : ''
          }
        />
      )
    } else {
      return (
        <div
          id="coinbox-container"
          key={task.day}
          onClick={isCurrentDay && isEligible ? claimBonus : undefined}
          style={{
            cursor: isCurrentDay && isEligible ? 'pointer' : 'not-allowed',
            opacity: isCompleted ? 0.7 : 1,
            border: isCurrentDay ? '2px solid #FED358' : 'none',
            position: 'relative'
          }}
        >
          {isCurrentDay && (
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              background: '#FED358',
              color: '#000000',
              padding: '2px 6px',
              borderRadius: '10px',
              fontSize: '10px'
            }}>
              Current
            </div>
          )}
          <div id="coinbox-image">
            <img src={giftimg} alt="" />
          </div>
          <div id="coinbox-content">
            <div id="coinbox-amount" style={{
              color: isCompleted ? "#B79C8B" : "#FDE4BC",
              fontWeight: isCurrentDay ? 'bold' : 'normal'
            }}>
              ₹{task.bonus.toFixed(2)}
            </div>
            <div id="coinbox-day" style={{
              color: "#B79C8B",
              fontWeight: isCurrentDay ? 'bold' : 'normal'
            }}>
              {task.day} Day
            </div>
            {isCurrentDay && !isEligible && task.deposit?.remaining > 0 && (
              <div className="requirement-message" style={{ fontSize: '10px', color: '#B79C8B' }}>
                Deposit ₹{task.deposit.remaining} more
              </div>
            )}
          </div>
        </div>
      )
    }
  }

  return (
    <>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
        >
          <Box flexGrow={1} >
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#232626",
                padding: "8px 16px",
                color: "white",
              }}
            >
              <Grid item container alignItems="center" justifyContent="center">
                <Grid item xs={2}>
                  <IconButton
                    sx={{ color: "#FDE4BC", ml: -5 }}
                    onClick={handleRedirect}
                  >
                    <ArrowBackIosNewIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={10}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#FDE4BC",
                      flexGrow: 1,
                      textAlign: "center",
                      mr: 8,
                    }}
                  >
                    Attendance
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <div className="outerContainer">
              <div style={{ backgroundColor: "rgb(245,70,69)" }}>
              <div className="bannerBox">
                <div className="content">
                  <div className="contentOne">
                    <h3>Attendance Bonus</h3>
                    <p>
                      get rewards based on consecutive <br /> login days!
                    </p>
                  </div>
                  <div className="contentTwo">
                    <span style={{ fontSize: "15px", fontWeight: "normal" }}>Attended Consecutively</span>
                    <span style={{ fontSize: "15px", fontWeight: "normal" }}>
                      <b style={{ fontSize: "19px", }}>
                        {loading ? "Loading..." : attendanceData.progress.streak}
                      </b> Days
                    </span>
                  </div>
                  <div className="contentThree">
                    <p>Progress</p>
                    <h3>
                      {loading ? "Loading..." : `${attendanceData.progress.percentage}%`}
                    </h3>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Link to="/activity/games-rule" style={{ textDecoration: "none" }}>
                      <Button variant="filled" sx={{ color: "white", background: "linear-gradient(to right, #FF8C3D, #FFAB3F)", borderRadius: "20px", textTransform: "none",fontSize: isSmallScreen ? "13.8668px" : '12px' }}>
                        Game Rules
                      </Button>
                    </Link>
                    <Button
                      variant="filled"
                      onClick={() => navigate('/activity/attendance/history')}
                      sx={{
                        fontSize: isSmallScreen ? "13.8668px" : '12px',
                        color: "white",
                        background: "linear-gradient(to right, #FF8C3D, #FFAB3F)",
                        borderRadius: "20px",
                        textTransform: "none"
                      }}
                    >
                      Attendance History
                    </Button>


                  </div>
                </div>
              </div></div>
              <div className="cardbox">
                {!loading && attendanceData.tasks.map((task, index) => renderTask(task, index))}
                <Button
                  variant="contained"
                  className="attendanceButton"
                  onClick={claimBonus}
                  disabled={loading || !attendanceData.current.eligible}
                  sx={{
                    width: "90%",
                    height: "45px",
                    borderRadius: "20px",
                    background: "linear-gradient(180deg, #FED358, #FFB472)",
                    cursor: "pointer",
                    border: "none",
                    marginBottom: "100px",
                    textTransform: "initial",
                    // opacity: (!attendanceData.current.eligible || loading) ? 0.7 : 1,
                    color: "#232626 !important",  // Force white text
                    fontSize:"19.2px",
                    mt:2
                  }}
                >
                  Attendance
                </Button>

              </div>
              {error && <ErrorPopup message={error} />}
            </div>
          </Box>
          {children}
        </Box>
      </Mobile>
    </>
  )
}

export default Attendance