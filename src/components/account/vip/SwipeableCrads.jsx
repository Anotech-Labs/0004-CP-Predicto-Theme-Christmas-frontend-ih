import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSwipeable } from "react-swipeable";
import { useAuth } from "../../../context/AuthContext";
import silverCrown from "../../../assets/account/silverCrown.webp";
import goldenCrown from "../../../assets/account/goldenCrown.webp";
import badge1 from "../../../assets/account/badge/badge1.webp";
import badge2 from "../../../assets/account/badge/badge2.webp";
import badge3 from "../../../assets/account/badge/badge3.webp";
import badge4 from "../../../assets/account/badge/badge4.webp";
import badge5 from "../../../assets/account/badge/badge5.webp";
import badge6 from "../../../assets/account/badge/badge6.webp";
import badge7 from "../../../assets/account/badge/badge7.webp";
import badge8 from "../../../assets/account/badge/badge8.webp";
import badge9 from "../../../assets/account/badge/badge9.webp";
import badge10 from "../../../assets/account/badge/badge10.webp";
import lock from "../../../assets/account/lock2.webp";
import wallet from "../../../assets/account/wallet.webp";
import dicon from "../../../assets/account/dicon.svg";
import "./SwipeableCards.css";
import VipHistory from "./VipHistory";
import { domain } from "../../../utils/Secret";
// import Diamond from "@mui/icons-material/Diamond";
import { Typography } from "@mui/material";

const SwipeableCards = () => {
  const [index, setIndex] = useState(0);
  const [levels, setLevels] = useState([]);
  const [claimedLevels, setClaimedLevels] = useState(new Set());
  const { axiosInstance } = useAuth();
  // const [levels, setLevels] = useState([
  //   // {
  //   //     "minAmount": 1000,
  //   //     "oneTimeBonus": 100,
  //   //     "awarded": "Bronze",
  //   //     "monthlyBonus": 50,
  //   //     "rebatePercentage": 2,
  //   //     "_id": "674dd41562c4b34e91a9751d"
  //   // },
  //   {
  //     minAmount: 3000,
  //     oneTimeBonus: 250,
  //     awarded: "VIP1",
  //     monthlyBonus: 100,
  //     rebatePercentage: 3,
  //     _id: "674dd41562c4b34e91a9751e",
  //   },
  //   {
  //     minAmount: 30000,
  //     oneTimeBonus: 500,
  //     awarded: "VIP2",
  //     monthlyBonus: 200,
  //     rebatePercentage: 4,
  //     _id: "674dd41562c4b34e91a9751f",
  //   },
  //   {
  //     minAmount: 500000,
  //     oneTimeBonus: 1000,
  //     awarded: "VIP3",
  //     monthlyBonus: 300,
  //     rebatePercentage: 5,
  //     _id: "674dd41562c4b34e91a97520",
  //   },
  //   {
  //     minAmount: 5000000,
  //     oneTimeBonus: 2000,
  //     awarded: "VIP4",
  //     monthlyBonus: 500,
  //     rebatePercentage: 6,
  //     _id: "674dd41562c4b34e91a97521",
  //   },
  //   {
  //     minAmount: 10000000,
  //     oneTimeBonus: 2000,
  //     awarded: "VIP5",
  //     monthlyBonus: 500,
  //     rebatePercentage: 6,
  //     _id: "674dd41562c4b34e91a97521",
  //   },
  //   {
  //     minAmount: 80000000,
  //     oneTimeBonus: 2000,
  //     awarded: "VIP6",
  //     monthlyBonus: 500,
  //     rebatePercentage: 6,
  //     _id: "674dd41562c4b34e91a97521",
  //   },
  //   {
  //     minAmount: 300000000,
  //     oneTimeBonus: 2000,
  //     awarded: "VIP7",
  //     monthlyBonus: 500,
  //     rebatePercentage: 6,
  //     _id: "674dd41562c4b34e91a97521",
  //   },
  //   {
  //     minAmount: 1000000000,
  //     oneTimeBonus: 2000,
  //     awarded: "VIP8",
  //     monthlyBonus: 500,
  //     rebatePercentage: 6,
  //     _id: "674dd41562c4b34e91a97521",
  //   },
  //   {
  //     minAmount: 5000000000,
  //     oneTimeBonus: 2000,
  //     awarded: "VIP9",
  //     monthlyBonus: 500,
  //     rebatePercentage: 6,
  //     _id: "674dd41562c4b34e91a97521",
  //   },
  //   {
  //     minAmount: 9999999999,
  //     oneTimeBonus: 2000,
  //     awarded: "VIP10",
  //     monthlyBonus: 500,
  //     rebatePercentage: 6,
  //     _id: "674dd41562c4b34e91a97521",
  //   },
  // ]);
  // const [cards, setCards] = useState([]);
  // const [userData, setUserData] = useState(null);
  useEffect(() => {
    fetchVipEligibility();
  }, []);

  const fetchVipEligibility = async () => {
    try {
      const response = await axiosInstance.get("/api/vip/eligibility");
      setLevels(response.data.data);

      // Initialize claimedLevels based on isCurrentLevel
      const claimed = new Set();
      response.data.data.forEach((level) => {
        if (
          level.isCurrentLevel ||
          level.level < response.data.data.find((l) => l.isCurrentLevel)?.level
        ) {
          claimed.add(level.id);
        }
      });
      setClaimedLevels(claimed);
    } catch (error) {
      console.error("Error fetching VIP eligibility:", error);
    }
  };

  const handleClaimReward = async (levelId) => {
    try {
      await axiosInstance.post("/api/vip/claim", { levelId });

      // Update claimedLevels to include the newly claimed level and all levels below it
      setClaimedLevels((prev) => {
        const newClaimed = new Set(prev);
        const claimedLevel = levels.find((l) => l.id === levelId);
        levels.forEach((level) => {
          if (level.level <= claimedLevel.level) {
            newClaimed.add(level.id);
          }
        });
        return newClaimed;
      });

      // Refresh VIP eligibility data
      fetchVipEligibility();
    } catch (error) {
      console.error("Error claiming VIP reward:", error);
    }
  };
  const handleSwipeLeft = () => {
    setIndex((prev) => Math.min(prev + 1, levels.length - 1));
  };

  const handleSwipeRight = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    trackMouse: true,
  });

  const getColorForAwarded = (level) => {
    switch (level) {
      case 3:
        return {
          image: "/assets/vipcardOverlay/vip2.webp",
          gradient:
            "linear-gradient(117.29deg, rgb(248, 189, 131) 21.85%, rgb(226, 152, 78) 67.02%)",
        };
      case 2:
        return {
          image: "/assets/vipcardOverlay/vip1.webp",
          gradient:
            "linear-gradient(117.29deg, rgb(166, 183, 208) 21.85%, rgb(136, 158, 190) 67.02%)",
        };
      case 1:
        return {
          image: "/assets/vipcardOverlay/vip0.webp",
          gradient:
            "linear-gradient(117.29deg, rgb(255, 164, 147) 21.85%, rgb(255, 120, 120) 67.02%)",
        };
      case 4:
        return {
          image: "/assets/vipcardOverlay/vip4.webp",
          gradient:
            "linear-gradient(117.29deg, rgb(120, 219, 235) 21.85%, rgb(72, 199, 240) 67.02%)",
        };
      case 5:
        return {
          image: "/assets/vipcardOverlay/vip5.webp",
          gradient:
            "linear-gradient(117.29deg, rgb(223, 145, 251) 21.85%, rgb(239, 130, 213) 67.02%)",
        };
       case 6:
        return {
          image: "/assets/vipcardOverlay/vip6.webp",
          gradient:
            "linear-gradient(117.29deg,#61dca6 21.85%,#229b5f 67.02%)",
        };
      case 7:
        return {
          image: "/assets/vipcardOverlay/vip7.webp",
          gradient:
            "linear-gradient(117.29deg,#57b733 21.85%,#229b5f 67.02%)",
        };
      case 8:
        return {
          image: "/assets/vipcardOverlay/vip8.webp",
          gradient:
            "linear-gradient(117.29deg,#54baf1 21.85%,#3d77e8 67.02%)",
        };
      case 9:
        return {
          image: "/assets/vipcardOverlay/vip9.webp",
          gradient:
            "linear-gradient(117.29deg,#d084e2 21.85%,#8d49ff 67.02%)",
        };
      case 10:
        return {
          image: "/assets/vipcardOverlay/vip10.webp",
          gradient:
            "linear-gradient(117.29deg,#eeaf3a 21.85%,#f98b3b 67.02%)",
        };
      default:
        return {
          image: null,
          gradient: "linear-gradient(to right, #a6b7d0, #889fbe)",
        };
    }
  };

  const getTransparentColorForAwarded = (level) => {
    switch (level) {
      case 3:
        return "rgba(248, 189, 131, 0.2)";
      case 2:
        return "rgba(166, 183, 208, 0.2)";
      case 1:
        return "rgba(255, 164, 147, 0.2)";
      case 4:
        return "rgba(208, 132, 225, 0.2)";
      case 5:
        return "rgba(84, 186, 241, 0.2)";
      case 6:
        return "rgba(255, 215, 139, 0.2)";
      case 7:
        return "rgba(255, 215, 0, 0.2)";
      case 8:
        return "rgba(52, 20, 230, 0.2)";
      case 9:
        return "rgba(128, 56, 127, 0.2)";
      case 10:
        return "rgba(196, 102, 35, 0.2)";
      default:
        return "rgba(128, 128, 128, 0.2)";
    }
  };

  const getFillColorForAwarded = (level) => {
    switch (level) {
      case 3:
        return "rgb(255, 171, 88)";
      case 2:
        return "rgb(192, 217, 255)";
      case 1:
        return "rgb(255, 90, 90)";
      case 4:
        return "rgb(95, 215, 255)";
      case 5:
        return "rgb(255, 149, 230)";
      case 6:
        return "rgb(30, 177, 139)";
      case 7:
        return "rgb(27, 148, 88)";
      case 8:
        return "rgb(52, 112, 230)";
      case 9:
        return "rgb(128, 56, 245)";
      case 10:
        return "rgb(239, 123, 39)";
      default:
        return "rgb(65, 65, 65)";
    }
  };
  const getBadgeImage = (level) => {
    switch (level) {
      case 1:
        return badge3;
      case 2:
        return badge1;
      case 3:
        return badge2;
      case 5:
        return badge4;
      case 4:
        return badge5;
      case 6:
        return badge6;
      case 7:
        return badge7;
      case 8:
        return badge8;
      case 9:
        return badge9;
      case 10:
        return badge10;
      default:
        return badge3;
    }
  };
  const getCrownImage = (level) => {
    return level === 1
      ? goldenCrown
      : level === 2
      ? silverCrown
      : goldenCrown;
  };

  const styles = {
    associatedContainer: {
      margin: "12px 10px 20px 10px",
    },
    associated: {
      backgroundColor: "#323738",
      padding: "8px",
      borderRadius: "10px",
    },
  };

  if (levels.length === 0) return null;

  return (
    <>
      <div {...swipeHandlers} className="swipeable-cards-container">
        {levels.map((level, i) => {
          const { image, gradient } = getColorForAwarded(level.level);
          return (
            <div
              key={i}
              className="card"
              style={{
                background: gradient,
                transform: `translateX(${(i - index) * 105 + 12}%)`,
                transition: "transform 0.3s ease-in-out",
              }}
            >
              {image && (
                <img
                  src={image}
                  alt={`${level.name} overlay`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.5,
                    zIndex: 1,
                  }}
                />
              )}
              <div
                className="content"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: 0,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div className="top" style={{ width: "100%" }}>
                  <div className="left">
                    <div className="l-top">
                      <div className="l-one">
                        <img src={getCrownImage(level.level)} alt={level.name} />
                      </div>
                      <div className="l-two" style={{ fontWeight: "bold" }}>
                        {level.name}
                      </div>
                      <div className="l-three">
                        {level.isEligible ? (
                          <span
                            style={{
                              marginLeft: "10px",
                              color: "white",
                              fontSize: "0.6em",
                            }}
                          >
                            Level unlocked
                          </span>
                        ) : (
                          <div
                            className="lthreetwo"
                            style={{ marginTop: "5px" }}
                          >
                            <img
                              src={lock}
                              alt="Locked"
                              style={{ width: "30px", height: "30px" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      className="l-mid"
                      style={{
                        color: "white",
                        textAlign: "left",
                        fontSize: "0.8rem",
                      }}
                    >
                      Upgrading {level.name} requires
                    </div>
                    <div
                      style={{
                        color: "white",
                        textAlign: "left",
                        fontSize: "0.8rem",
                      }}
                    >
                      {level.minimumBettingAmount} EXP
                    </div>
                    <div
                      className="l-bottom"
                      style={{
                        color: "white",
                        textAlign: "left",
                        fontSize: "0.85rem",
                      }}
                    >
                      Bet ₹1 = 1 EXP
                    </div>
                  </div>
                  <div className="right">
                    <div className="image-badge">
                      <img src={getBadgeImage(level.level)} alt="" />
                    </div>
                    <div className="right-bottom">{level.name}</div>
                  </div>
                </div>
                <div className="mid" style={{ width: "100%" }}>
                  <div
                    className="outer-progress"
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: getTransparentColorForAwarded(
                        level.level
                      ),
                      borderRadius: "inherit",
                      position: "absolute",
                      zIndex: 1,
                    }}
                  ></div>
                  <div
                    className="inner-progress"
                    style={{
                      width: `${level.progress.percentage}%`,
                      height: "100%",
                      backgroundColor: getFillColorForAwarded(level.level),
                      borderRadius: "inherit",
                      position: "relative",
                      zIndex: 2,
                    }}
                  ></div>
                </div>
                <div className="bottom" style={{ width: "100%" }}>
                  <div
                    className="bottom-left"
                    style={{
                      background: getColorForAwarded(level.level).gradient,
                      marginTop: "5px",
                      paddingTop: "1px",
                      paddingBottom: "1px",
                      borderRadius: "10px",
                      color: "white",
                      display: "flex",
                      justifyContent: "space-between",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      alignItems: "center",
                      fontSize: "14px",
                    }}
                  >
                    {level.progress.absolute}
                  </div>
                  <div
                    className="bottom-right"
                    style={{
                      color: "white",
                      textAlign: "left",
                      fontSize: "1em",
                    }}
                  >
                    {level.minimumBettingAmount} can be leveled up
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={styles.associatedContainer}>
        {levels.map(
          (level, i) =>
            i === index && (
              <div key={i} style={styles.associated}>
                <div
                  className="heading"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    paddingTop: "10px",
                    marginBottom: "20px",
                    borderBottom: "1px solid #433e36",
                  }}
                >
                  <div className="d-img">
                    {/* <Diamond sx={{ color: "#f0960e", fontSize: 30 }} /> */}
                    <img
                      src="/assets/vipIcons/orangediamond.svg"
                      alt="Gift"
                      style={{
                        width: "22px",
                        // height: "30px",
                        marginBottom: "2px",
                        // marginRight: "0.2rem",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      color: "white",
                      fontSize: "1em",
                      // marginBottom:"6px",
                      fontWeight: "bold",
                      lineHeight: "30px",
                      marginTop: "-10px",
                    }}
                  >
                    VIP1 Benefits level
                  </div>
                </div>

                <div className="list">
                  <div
                    className="list-one"
                    style={{
                      display: "flex",
                      gap: "5px",
                      width: "100%",
                      // marginBottom: "-2%",
                      textAlign: "left",
                    }}
                  >
                    <div className="one-img">
                      <img
                        src="/assets/vipIcons/gift2.webp"
                        alt="Gift"
                        style={{
                          width: "3.5rem",
                          height: "3.5rem",
                          marginRight: "0.2rem",
                        }}
                      />
                    </div>
                    <div style={{ width: "80%" }}>
                      <div
                        style={{
                          color: "white",
                          fontSize: "15px",
                          // margin: "0",
                          marginTop: "5px",
                        }}
                      >
                        Level up reward
                      </div>
                      <div
                        style={{
                          color: "#a69f95",
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                      >
                        Each account can only recieve 1 time
                      </div>
                    </div>
                    <div style={{ width: "100px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "8px",
                          margin: "5px auto",
                          width: "100%",
                          alignItems: "center",
                          height: "30%",
                          border: "1px solid #f0960e",
                          borderRadius: "5px",
                        }}
                      >
                        <div
                          style={{
                            width: "13px",
                            height: "13px",
                            marginTop: "-4px",
                          }}
                        >
                          <img
                            src={wallet}
                            alt=""
                            style={{ width: " 100% ", height: "100%" }}
                          />
                        </div>
                        <div style={{ color: "#f0960e", fontSize: "0.8rem" }}>
                          {claimedLevels.has(level.id)
                            ? "Received"
                            : level.bonuses.oneTime}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "8px",
                          margin: "5px auto",
                          width: "100%",
                          alignItems: "center",
                          height: "30%",
                          border: "1px solid #f0960e",
                          borderRadius: "5px",
                        }}
                      >
                        <div
                          style={{
                            width: "13px",
                            height: "13px",
                            marginBottom: "3px",
                          }}
                        >
                          <img
                            src={dicon}
                            alt=""
                            style={{ width: " 100% ", height: "100%" }}
                          />
                        </div>
                        <div style={{ color: "#f0960e", fontSize: "0.8rem" }}>
                          0
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="list-one"
                    style={{
                      display: "flex",
                      gap: "5px",
                      width: "100%",
                      marginBottom: "2%",
                      marginTop: "3%",
                      textAlign: "left",
                    }}
                  >
                    <div className="one-img">
                      <img
                        src="/assets/vipIcons/coin.webp"
                        alt="Gift"
                        style={{
                          width: "3.5rem",
                          height: "3.5rem",
                          marginRight: "0.2rem",
                        }}
                      />
                    </div>
                    <div style={{ width: "80%" }}>
                      <div
                        style={{
                          color: "white",
                          fontSize: "15px",
                          // margin: "0",
                          marginTop: "2px",
                        }}
                      >
                        Monthly reward
                      </div>
                      <div
                        style={{
                          color: "#a69f95",
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                      >
                        Each account can only recieve 1 time per month
                      </div>
                    </div>
                    <div style={{ width: "100px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "8px",
                          margin: "5px auto",
                          alignItems: "center",
                          width: "100%",
                          height: "30%",
                          border: "1px solid #f0960e",
                          borderRadius: "5px",
                        }}
                      >
                        <div
                          style={{
                            width: "13px",
                            height: "13px",
                            marginTop: "-4px",
                          }}
                        >
                          <img
                            src={wallet}
                            alt=""
                            style={{ width: " 100% ", height: "100%" }}
                          />
                        </div>
                        <div style={{ color: "#f0960e", fontSize: "0.8rem" }}>
                          {level.bonuses.monthly}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "8px",
                          width: "100%",
                          height: "30%",
                          margin: "5px auto",
                          alignItems: "center",
                          border: "1px solid #f0960e",
                          borderRadius: "5px",
                        }}
                      >
                        <div
                          style={{
                            width: "13px",
                            height: "13px",
                            marginBottom: "3px",
                          }}
                        >
                          <img
                            src={dicon}
                            alt=""
                            style={{ width: " 100% ", height: "100%" }}
                          />
                        </div>
                        <div style={{ color: "#f0960e", fontSize: "0.8rem" }}>
                          0
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="list-one"
                    style={{
                      display: "flex",
                      gap: "5px",
                      width: "100%",
                      marginBottom: "0%",
                      textAlign: "left",
                    }}
                  >
                    <div className="one-img">
                      <img
                        src="/assets/vipIcons/stack.webp"
                        alt="Gift"
                        style={{
                          width: "3.5rem",
                          height: "3.5rem",
                          marginRight: "0.2rem",
                        }}
                      />
                    </div>
                    <div style={{ width: "80%" }}>
                      <div
                        style={{
                          color: "#001534",
                          fontSize: "16px",
                          // marginTop: "5px",
                        }}
                      >
                        <div
                          style={{
                            color: "white",
                            fontSize: "15px",
                            marginTop: "5px",
                          }}
                        >
                          Rebate rate
                        </div>
                        <div
                          style={{
                            color: "#a69f95",
                            fontSize: "12px",
                            marginTop: "13px",
                          }}
                        >
                          increase income of rebate
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        width: "100px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          height: "50%",
                          width: "100%",
                          justifyContent: "center",
                          gap: "8px",
                          margin: "5px auto",
                          border: "1px solid #f0960e",
                          borderRadius: "5px",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ width: "25px", height: "22px" }}>
                          <img
                            src="/assets/vipIcons/stack.svg"
                            alt="stack"
                            style={{
                              width: "100%",
                              height: "100%",
                              marginTop: "0px",
                            }}
                          />
                        </div>

                        <div style={{ color: "#f0960e", fontSize: "0.8rem" }}>
                          {level.bonuses.rebatePercentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                  {level.isEligible &&
                    !claimedLevels.has(level.id) &&
                    !level.isCurrentLevel && (
                      <button
                        onClick={() => handleClaimReward(level.id)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginTop: "20px",
                          background:
                            "linear-gradient(90deg,#F5B73B 0%, #F5853B 100%)",
                          color: "black",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          marginLeft: "0",
                        }}
                      >
                        Claim Rewards
                      </button>
                    )}
                </div>
              </div>
            )
        )}
      </div>
      <VipHistory />
    </>
  );
};

export default SwipeableCards;
