import React from 'react'
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import { useNavigate } from 'react-router-dom'
import activityRewardIcon from "../../assets/activity/activityReward-66772619.webp"
import invitationBonusIcon from "../../assets/activity/invitationBonus.webp"
import bettingRebateIcon from "../../assets/activity/BettingRebate-17d35455.webp"
import superJackpotIcon from "../../assets/activity/superJackpot-ecb648b4.webp"
import memberGiftIcon from "../../assets/activity/memberGift-a0182789.webp"
import giftboxIcon from "../../assets/activity/giftbox.webp"

const ActivityIcons = () => {

  const navigate = useNavigate()

  const rewards = [
    // {
    //   image: activityRewardIcon,
    //   label: "Activity Reward",
    //   link: "/activity/activity-reward",
    // },
    // {
    //   image: invitationBonusIcon,
    //   label: "Invitation Bonus",
    //   link: "/activity/invitation-bonus",
    // },
    {
      image: bettingRebateIcon,
      label: "Betting Rebate",
      link: "/activity/betting-rebate",
    },
    {
      image: superJackpotIcon,
      label: "Super Jackpot",
      link: "/activity/super-jackpot",
    },
    {
      image: memberGiftIcon,
      label: "First Gift",
      link: "/activity/gift-package",
    },
    // {
    //   image: giftboxIcon,
    //   label: "Dynamic Spin",
    //   link: "/dynamic-spin-event",
    // },
  ]

  return (
    <>
      <Grid
        container
        spacing={{ xs: 0, sm: 0, md: 0 }}
        justifyContent="space-around"
        alignItems="flex-start" // Ensures alignment at the start of the container
        sx={{ marginTop: 2, overflow: "hidden", }}
      >
        {rewards.map((reward, index) => (
          <Grid item key={index}>
            <Button
              onClick={() => navigate(reward.link)}
              sx={{ textAlign: "center", padding: 0, minWidth: 0 }}
            >
              <Box textAlign="center">
                <img
                  src={reward.image}
                  alt={reward.label}
                  style={{ width: "40px", height: "40px" }}
                />
                <Typography
                  sx={{
                    color: "#B79C8B",
                    textTransform: "initial",
                    fontSize: "11px",
                  }}
                >
                  {reward.label.split(" ").map((word, i) => (
                    <span key={i}>
                      {word}
                      <br />
                    </span>
                  ))}
                </Typography>
              </Box>
            </Button>
          </Grid>
        ))}
      </Grid></>
  )
}

export default ActivityIcons