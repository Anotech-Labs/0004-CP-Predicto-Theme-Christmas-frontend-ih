import React, { useState, useEffect,useContext } from "react"
import "./SettingStyle.css"
// import uidimg from "../../assets/uidimg.webp";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import SettingBottom from "./SettingBottom"
import lockimg from "../../assets/account/lock.webp"
import mailBox from "../../assets/account/mail.webp"
import update from "../../assets/account/versionUpdate.webp"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
// import Alert from "@mui/material/Alert"
import { domain } from "../../utils/Secret"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../context/UserState"
import { useAuth } from "../../context/AuthContext"
import { Grid,Box ,IconButton} from "@mui/material"
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Avatar from "@mui/material/Avatar";
function SettingComponent() {
  //   const [open, setOpen] = useState(false);
  const navigate = useNavigate()
  const { getUserData, userData } = useContext(UserContext)
  const { axiosInstance } = useAuth()
  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  //   const handleClose = () => {
  //     setOpen(false);
  //   };

  // const [openResetPassword, setOpenResetPassword] = useState(false)

  // const [oldPassword, setOldPassword] = useState("")
  // const [newPassword, setNewPassword] = useState("")
  // const [alertOpen, setAlertOpen] = useState(false)

  // const [userData, setUserData] = useState(null)

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await axios.get(`${domain}/user`, {
  //         withCredentials: true,
  //       })
  //       //console.log("Data-->", response.data)
  //       setUserData(response.data)
  //     } catch (err) {
  //       console.error(err)
  //     }
  //   }

  //   fetchUserData()
  // }, [])
  // const handleOpenResetPassword = () => {
  //   setOpenResetPassword(true)
  // }

  // const handleCloseResetPassword = () => {
  //   setOpenResetPassword(false)
  // }
  // const handleResetPassword = async (event) => {
  //   event.preventDefault()

  //   try {
  //     const response = await axios.post(
  //       `${domain}ChangePassword`,
  //       {
  //         oldPassword,
  //         newPassword,
  //       },
  //       { withCredentials: true }
  //     )

  //     if (response.status === 200) {
  //       setAlertOpen(true)
  //       handleCloseResetPassword()
  //     }
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }

  // const [user, setUser] = useState(null)
  const [username, setUsername] = useState(null)
  const [openChangeUsername, setOpenChangeUsername] = useState(false)

  // const fetchUserData = async () => {
  //   try {
  //     const response = await axios.get(`${domain}/user`, {
  //       withCredentials: true,
  //     })
  //     setUser(response.data.user)
  //     //console.log(response.data.user)
  //     setUsername(response.data.user.username)
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }

  // useEffect(() => {
  //   fetchUserData()
  // }, [])

  const subtitle = `${userData ? userData.uid : 0}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(subtitle);
  };


  const handleOpenChangeUsername = () => {
    setUsername(userData.userName)
    setOpenChangeUsername(true)
  }

  const handleCloseChangeUsername = () => {
    setOpenChangeUsername(false)
  }

  const handleChangeUsername = async (event) => {
    event.preventDefault()

    try {
      const response = await axiosInstance.patch(
        `${domain}/api/account/v1/profile/users/${userData.uid}/username`,
        {
          newUsername:username,
        },
        { withCredentials: true }
      )

      if (response.status === 200) {
        getUserData() 
        handleCloseChangeUsername()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAvatarChange = () => {
    navigate("/account/avatar-change", { state: { avatar: userData.avatar } })
  }

  return (
    <div className="settingpage-main-container">
      <div className="settingpage-top">
        <div className="settingpage-info">
          <div className="avatar">
            {/* <div className="avatar-image"> */}
              {/* <img src={userData?.avatar} alt="" /> */}
              <Grid
                item
                xs={3}
                align="left"
                onClick={() =>
                  navigate("/account/avatar-change", {
                    state: { avatar: userData.avatar },
                  })
                }
              >
                <Avatar src={userData?.avatar} sx={{ width: 76, height: 76 }} />
              </Grid>
            {/* </div> */}
            <div className="change-avatar">
              <span>Change Avatar</span>
              <KeyboardArrowRightIcon onClick={handleAvatarChange} />
            </div>
          </div>
          <div className="settingpage-name">
            <h4>Nickname</h4>
            <div className="Username">
              <Button
                sx={{ color: "rgb(99, 99, 99)" ,p:0}}
                onClick={handleOpenChangeUsername}
              >
                <span style={{color:"#ffffff"}}>{userData ? userData.userName : "Loading..."}</span>
                <KeyboardArrowRightIcon />
              </Button>
            </div>

           
          </div>

          <div className="settingpage-uid">
            <h4>UID</h4>
            <div className="uid">
              <span style={{color:"#ffffff"}}>{userData && userData.uid ? userData.uid : "Loading..."}</span>
              {/* <ContentCopyIcon onClick={handleCopy} sx={{ color: "rgb(240,150,14)" }} /> */}
                <IconButton onClick={handleCopy} sx={{ p: 0 }}>
                                  <img
                                      src="/assets/icons/copy3.svg"
                                      alt="logo"
                                      style={{ width: "13px"}}
                                    />
                                  </IconButton>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-page">
        <div
          className="bottom-heading"
          style={{ textAlign: "left", color: "#ffffff" ,marginBottom:"15px"}}
        >
          
          <h3 style={{display:"flex",gap:"10px"}}> <Grid
                sx={{
                  width: "3px",
                  height: "90%",
                  backgroundColor: "#fed358",
                  color: "transparent",
                  // borderRadius: "5px",
                  // marginLeft:"-16px"
                }}
              >
                .
              </Grid>Security Information</h3>
        </div>

            <Dialog 
              open={openChangeUsername} 
              onClose={handleCloseChangeUsername}
              PaperProps={{
                component: "form",
                onSubmit: handleChangeUsername,
                sx: {
                  backgroundColor: '#3a4142',
                  borderRadius: '12px',
                  width: '100%',
                  maxWidth: '370px',
                  margin: "auto 10px",
                  position: 'relative',
                  // paddingBottom: '50px'
                }
              }}
              sx={{
                '& .MuiDialog-container': {
                  paddingBottom: '60px' // Add padding to container to make room for icon
                }
              }}
            >
              <DialogTitle
                sx={{
                  color: '#fff',
                  textAlign: 'center',
                  fontSize: '20px',
                  fontWeight: 500,
                  pt: 1,
                  pb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    width: '60px',
                    height: '2px',
                    display: 'inline-block',
                    background: 'linear-gradient(90deg, #fff -2.73%, rgba(230, 235, 240, 0) 91.36%)',
                    borderRadius: '0.26667rem',
                    transform: 'scaleX(-1)',
                  }}
                />
                Change Nickname
                <Box
                  sx={{
                    width: '60px',
                    height: '2px',
                    display: 'inline-block',
                    background: 'linear-gradient(90deg, #fff -2.73%, rgba(230, 235, 240, 0) 91.36%)',
                    borderRadius: '0.26667rem',
                  }}
                />
              </DialogTitle>

              <DialogContent sx={{ px: 1.5, pb: 1 }}>
                <Grid sx={{background:"#323738", px:1.8, py:2.5, borderRadius:3}}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1,gap:1 }}>
                  <img
                                      src="/assets/icons/nickname.svg"
                                      alt="logo"
                                      style={{ width: "25px"}}
                                    />
                    <Box sx={{ color: '#ffffff', fontSize: '16px' }}>Nickname</Box>
                  </Box>

                  <TextField
                    autoFocus
                    fullWidth
                    name="username"
                    // label="New Username"
                    type="text"
                    value={username}
                    placeholder="Please enter Nickname"
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{
                      mt: 1,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: "50px",
                        height: "50px",
                        color: '#ffffff',
                        '& fieldset': {
                          borderColor: 'transparent'
                        },
                        '&:hover fieldset': {
                          borderColor: 'transparent'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'transparent'
                        }
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#ffffff',
                        opacity: 1
                      }
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    sx={{
                      mt: 20,
                      py: 1.5,
                      background: 'linear-gradient(90deg,#24ee89,#9fe871),#323738',
                      borderRadius: '50px',
                      textTransform: 'none',
                      height: "36px",
                      fontSize: '16px',
                      '&:hover': {
                        backgroundColor: '#FF8C24'
                      },
                      color:"#232626"
                    }}
                  >
                    Confirm
                  </Button>
                </Grid>
              </DialogContent>
              
              <Box
                sx={{
                  position: 'fixed',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bottom: "20%",
                  // top:300,
                  zIndex: 1301, // Higher than Dialog's default z-index
                }}
              >
                <IconButton
                  onClick={handleCloseChangeUsername}
                  sx={{ 
                    color: '#fff',
                    
                    // bgcolor: 'rgba(255, 255, 255, 0.1)',
                    // '&:hover': {
                    //   bgcolor: 'rgba(255, 255, 255, 0.2)'
                    // }
                  }}
                >
                  <CancelOutlinedIcon sx={{fontSize:"30px"}}/>
                </IconButton>
              </Box>
            </Dialog>
        <div className="bottom-box-container">
          <SettingBottom
            settingBottomImage={lockimg}
            bottomBoxName="Login Password"
            bottomGoto="Edit"
            backgroundColor="#323738"
            // onClick={handleOpenResetPassword}
            onClick={()=> navigate('/account/settings/PasswordChange')}
          />

          <SettingBottom
            settingBottomImage={mailBox}
            bottomBoxName="Bind Mailbox"
            bottomGoto="Edit"
          />

          {/* <SettingBottom
                        // settingBottomImage={googleVerification}
                        bottomBoxName='Google Verification'
                        bottomGoto='Edit' /> */}

          <SettingBottom
            settingBottomImage={update}
            bottomBoxName="Updated Version"
            bottomGoto="1.0.1"
          />
        </div>
      </div>
    </div>
  )
}

export default SettingComponent
