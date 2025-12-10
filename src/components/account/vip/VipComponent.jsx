import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import "./VipStyles.css";
import { domain } from "../../../utils/Secret";
import SwipeableCards from "./SwipeableCrads"
// import FullWidthTabs from './tab'; // Uncomment if needed

function VipComponent() {
  
  const { axiosInstance } = useAuth();
  const [userData, setUserData] = useState({
    avatar: "",
    totalBetAmount: "0",
    currentRebatePercentage: "0",
    progressPercentage: 0
  });

  // const levels = [
  //   { minAmount: 1000, awarded: "Silver" },
  //   { minAmount: 3000, awarded: "Gold" },
  //   { minAmount: 10000, awarded: "Platinum" },
  // ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/vip/experience');
        const vipData = response.data.data; // Remove [0] since data is not an array
  
        let progressPercentage = (parseFloat(vipData.totalBetAmount) / parseFloat(vipData.minimumBetRequired)) * 100;
  
        setUserData({
          avatar: vipData.avatar || '/assets/profile-1.webp', // Fallback avatar
          username: vipData.username,
          vipLevel: vipData.vipLevel,
          vipName: vipData.vipName,
          totalBetAmount: vipData.totalBetAmount || "0",
          nextLevelProgress: vipData.nextLevelProgress || "0",
          currentRebatePercentage: vipData.currentRebatePercentage || "0",
          progressPercentage: Math.min(progressPercentage, 100)
        });
      } catch (error) {
        console.error("Error fetching VIP experience data:", error);
        // Set default values on error
        setUserData({
          avatar: '/assets/profile-1.webp',
          username: '',
          vipLevel: 0,
          vipName: '',
          totalBetAmount: "0",
          nextLevelProgress: "0",
          currentRebatePercentage: "0",
          progressPercentage: 0
        });
      }
    };
  
    fetchData();
  }, [axiosInstance]);

  // const [lastAchievement, setLastAchievement] = useState(null);
  // useEffect(() => {
  //   const fetchLastAchievement = async () => {
  //     try {
  //       const response = await axios.get(`${domain}/last-achievement`, {
  //         withCredentials: true,
  //       });

  //       setLastAchievement(response.data.lastAchievement);
  //     } catch (err) {
  //       console.error("Error fetching last achievement:", err);
  //     }
  //   };

  //   fetchLastAchievement();
  // }, []);

  const vipLevelImages = [
    '/assets/vipIcons/vip-zero.webp',    // Level 0 (default or no VIP)
    '/assets/vipIcons/vip1.webp',    // Level 0 (default or no VIP)
    '/assets/vipIcons/vip2.webp',    // Level 1 (Bronze)
    '/assets/vipIcons/vip3.webp',    // Level 2 (Silver)
    '/assets/vipIcons/vip4.webp',      // Level 3 (Gold)
    '/assets/vipIcons/vip5.webp',  // Level 4 (Platinum)
    '/assets/vipIcons/vip6.webp',   // Level 6 (Diamond)
    '/assets/vipIcons/vip7.webp',   // Level 7 (Diamond)
    '/assets/vipIcons/vip8.webp',   // Level 8 (Diamond)
    '/assets/vipIcons/vip9.webp',   // Level 9 (Diamond)
    '/assets/vipIcons/vip10.webp',   // Level 10 (Diamond)
  ];

  const getImageForAchievement = () => {
    // Default to level 0 if vipLevel is undefined
    const level = userData.vipLevel || 0;
    
    // Make sure we don't go out of bounds of our array
    const safeLevel = Math.min(level, vipLevelImages.length - 1);
    
    return vipLevelImages[safeLevel];
  };

  const formatNumber = (number) => {
    const num = parseFloat(number);
    return Number.isInteger(num) ? num : num.toFixed(2);
  };

  return (
    <div>
      <div className="topbox">
      <div className="top-left">
        <div className="image-box">
          <img src={userData.avatar} alt="User Avatar" />
        </div>
      </div>
      <div className="top-right">
        <div className="top-right-top">
          <div className="top-image-box">
            <img
              src={getImageForAchievement()}
              alt={`VIP ${userData.vipName}`}
              width="40%"
              height="80%"
            />
          </div>
        </div>
        <div className="top-right-bottom" style={{ marginBottom: "35%" }}>
          <div>{userData.username}</div>
        </div>
      </div>
    </div>
    <div className="bottom-box">
      <div className="exp-box">
        <div className="exp">
          <div className="exp-content">
            <span className="exp-number">
              {formatNumber(userData.totalBetAmount)} EXP
            </span>
            <span className="exp-text">My experience</span>
          </div>
        </div>
        <div className="exp">
          <div className="exp-content">
            <span className="exp-number">
              {userData.currentRebatePercentage}%
            </span>
            <span className="exp-text">Current Rebate</span>
          </div>
        </div>
          {/* <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${userData.progressPercentage}%` }}
            />
          </div> */}
        </div>
        <div className="notice-mid" style={{ marginTop: "-5%" }}>
          <div className="n-box">
            VIP level rewards are settled at 2:00 am on the 1st of every month
          </div>
        </div>
        <SwipeableCards />
      </div>
      {/* Uncomment if needed */}
      {/* <FullWidthTabs /> */}
      <br />
      <br />
      <br />
    </div>
  );
}

export default VipComponent;
