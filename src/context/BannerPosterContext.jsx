import axios from "axios"
import { createContext, useEffect, useState } from "react"
import { imageKitSecret } from "../utils/Secret"

const BannerPosterContext = createContext()

export const BannerPosterProvider = ({ children }) => {
  const [attendanceUrl, setAttendanceUrl] = useState('')
  const [avaiatorUrl, setAvaiatorUrl] = useState('')
  const [firstbonusUrl, setFirstbonusUrl] = useState('')
  const [luckyspinUrl, setLuckyspinUrl] = useState('')
  const [realtimerebateUrl, setRealtimerebateUrl] = useState('')
  const [rebateUrl, setRebateUrl] = useState('')
  const [refralbonusUrl, setRefralbonusUrl] = useState('')
  const [slotUrl, setSlotUrl] = useState('')
  const [telegramUrl, setTelegramUrl] = useState('')
  const [usdtUrl, setUsdtUrl] = useState('')
  const [welcomeUrl, setWelcomeUrl] = useState('')
  const [winstreakUrl, setWinstreakUrl] = useState('')
  const [luckydaysUrl, setLuckydaysUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [tournamentUrl, setTournamentUrl] = useState('')

  // Activity poster URLs

  const [superjackpotPosterUrl, setSuperjackpotPosterUrl] = useState('')
  const [winstreakPosterUrl, setWinstreakPosterUrl] = useState('')
  const [luckydaysPosterUrl, setLuckydaysPosterUrl] = useState('')
  const [realtimerebatePosterUrl, setRealtimerebatePosterUrl] = useState('')
  const [rebatePosterUrl, setRebatePosterUrl] = useState('')
  const [refrealBonusPosterUrl, setRefrealBonusPosterUrl] = useState('')
  const [usdtPosterUrl, setUsdtPosterUrl] = useState('')
  const [youtubePosterUrl, setYoutubePosterUrl] = useState('')
  // const [loyaltyPosterUrl, setLoyaltyPosterUrl] = useState('')
  // const [birthdayPosterUrl, setBirthdayPosterUrl] = useState('')
  // const [seasonalPosterUrl, setSeasonalPosterUrl] = useState('')
  // const [eventPosterUrl, setEventPosterUrl] = useState('')
  // const [specialofferPosterUrl, setSpecialofferPosterUrl] = useState('')
  // const [leaderboardPosterUrl, setLeaderboardPosterUrl] = useState('')


  useEffect(() => {
    const basicAuth = `Basic ${btoa(`${imageKitSecret}:`)}`;

    const options = {
      method: 'GET',
      url: 'https://api.imagekit.io/v1/files',
      params: { path: '/Banner' },
      headers: {
        Accept: 'application/json',
        Authorization: basicAuth // replace this in backend ideally
      }
    }

    axios
      .request(options)
      .then((response) => {
        const files = response.data
        files.forEach((item) => {
          if (!item.name || !item.url) return

          const name = item.name.toLowerCase()

          if (name.includes('attendance')) setAttendanceUrl(item.url)
          else if (name.includes('avaitor')) setAvaiatorUrl(item.url)
          else if (name.includes('firstbonus')) setFirstbonusUrl(item.url)
          else if (name.includes('luckyspin')) setLuckyspinUrl(item.url)
          else if (name.includes('realtimerebate')) setRealtimerebateUrl(item.url)
          else if (name.includes('rebate')) setRebateUrl(item.url)
          else if (name.includes('refralbonus')) setRefralbonusUrl(item.url)
          else if (name.includes('slot')) setSlotUrl(item.url)
          else if (name.includes('telegram')) setTelegramUrl(item.url)
          else if (name.includes('usdt')) setUsdtUrl(item.url)
          else if (name.includes('welcome')) setWelcomeUrl(item.url)
          else if (name.includes('winstreak')) setWinstreakUrl(item.url)
          else if (name.includes('luckydays')) setLuckydaysUrl(item.url)
          else if (name.includes('youtube')) setYoutubeUrl(item.url)
          else if (name.includes('tournament')) setTournamentUrl(item.url)
        })
      })
      .catch((error) => {
        console.error('Error fetching image URLs:', error)
      })
  }, [])

 

  // Fetch activity posters
  useEffect(() => {
    const basicAuth = `Basic ${btoa(`${imageKitSecret}:`)}`;

    const activityOptions = {
      method: 'GET',
      url: 'https://api.imagekit.io/v1/files',
      params: { path: '/activity-poster' },
      headers: {
        Accept: 'application/json',
        Authorization: basicAuth // replace this in backend ideally
      }
    }

    axios
      .request(activityOptions)
      .then((response) => {
        const files = response.data
        files.forEach((item) => {
          if (!item.name || !item.url) return

          const name = item.name

          if (name.includes('superjackpot')) setSuperjackpotPosterUrl(item.url)
          if (name.includes('winstreak')) setWinstreakPosterUrl(item.url)
          if (name.includes('luckydays')) setLuckydaysPosterUrl(item.url)
          else if (name.includes('realtimerebate')) setRealtimerebatePosterUrl(item.url)
          else if (name.includes('rebate')) setRebatePosterUrl(item.url)
          else if (name.includes('refrealBonus')) setRefrealBonusPosterUrl(item.url)
          else if (name.includes('usdt')) setUsdtPosterUrl(item.url)
          else if (name.includes('youtube')) setYoutubePosterUrl(item.url)
        })
      })
      .catch((error) => {
        console.error('Error fetching activity poster URLs:', error)
      })
  }, [])



  return (
    <BannerPosterContext.Provider
      value={{
        // Banner posters
        attendanceUrl,
        avaiatorUrl,
        firstbonusUrl,
        luckyspinUrl,
        realtimerebateUrl,
        rebateUrl,
        refralbonusUrl,
        slotUrl,
        telegramUrl,
        usdtUrl,
        welcomeUrl,
        winstreakUrl,
        luckydaysUrl,
        youtubeUrl,
        tournamentUrl,
        
        // Activity posters
        superjackpotPosterUrl,
        winstreakPosterUrl,
        luckydaysPosterUrl,
        realtimerebatePosterUrl,
        rebatePosterUrl,
        refrealBonusPosterUrl,
        usdtPosterUrl,
        youtubePosterUrl,
      }}
    >
      {children}
    </BannerPosterContext.Provider>
  )
}

export default BannerPosterContext
