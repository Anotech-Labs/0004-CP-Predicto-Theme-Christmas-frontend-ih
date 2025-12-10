import React, { useEffect, useState } from 'react'
import "./SwipeableCards.css"
import axios from 'axios'
import { domain } from '../../../utils/Secret'
import { useAuth } from '../../../context/AuthContext';

const VipHistory = () => {

    const { axiosInstance } = useAuth();
    const [activeTab, setActiveTab] = useState("history");
    const [hasData, setHasData] = useState(false);
    const [historyData, setHistoryData] = useState([]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const fetchVipHistory = async () => {
            try {
                const response = await axiosInstance.get('/api/vip/history');
                const historyData = response.data.data;
                setHistoryData(historyData);
                setHasData(historyData.length > 0);
            } catch (error) {
                console.error("Error fetching VIP history:", error);
                setHasData(false);
            }
        };

        fetchVipHistory();
    }, [axiosInstance]);

    const getTitleColorClass = (header) => {
        switch (header?.toLowerCase()) {
            case 'bronze':
                return 'text-bronze';
            case 'silver':
                return 'text-silver';
            case 'gold':
                return 'text-gold';
            default:
                return '';
        }
    };

    const formatHistoryItem = (item) => {
        const formattedDate = new Date(item.claimedAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false, // Use 24-hour format
          });
        if (item.claimType === 'ONE_TIME') {
            return {
                title: item.rule.name,
                description: `${item.bonusAmount} EXP`,
                subtext: formattedDate
            };
        } else {
            return {
                title: `${item.rule.name}`,
                description: `${item.bonusAmount} EXP`,
                subtext: formattedDate
            };
        }
    };

    const benefits = [
        {
            image: "/assets/vipIcons/welfare1-eee87ee1.webp",
            title: "Level up rewards",
            description: "Each account can only receive 1 time",
            buttonText: "Received"
        },
        {
            image: "/assets/vipIcons/welfare2-cf757d28.webp",
            title: "Monthly reward",
            description: "Each account can only receive 1 time per month",
            buttonText: "Received"
        },
        {
            image: "/assets/vipIcons/welfare5-8b250748.webp",
            title: "Rebate rate",
            description: "Increase income of rebate",
            buttonText: "Check the details"
        }
    ];

    return (
        <>
            {/* <div className="my-benefits">
                <h2 className="my-benefits__title">
                    <span className="my-benefits__crown">👑</span> My benefits
                </h2>
                <div className="benefits-grid">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className={`benefit-card ${index === 3 ? "benefit-card--wide" : ""
                                }`}
                        >
                            <div className="benefit-card__image-container">
                                <img
                                    src={benefit.image}
                                    alt={benefit.title}
                                    className="benefit-card__image"
                                />
                                {benefit.levelReward !== undefined && (
                                    <span className="benefit-card__reward-count">
                                        <span className="benefit-card__reward-count-dot"></span>
                                        {benefit.levelReward}
                                    </span>
                                )}
                            </div>
                            <h3 className="benefit-card__title">{benefit.title}</h3>
                            <p className="benefit-card__description">{benefit.description}</p>
                            <button
                                className={`benefit-card__button ${benefit.buttonText === "Check the details"
                                    ? "benefit-card__button--outlined"
                                    : "benefit-card__button--filled"
                                    }`}
                            >
                                {benefit.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div> */}

            {/* <MyBenefits /> */}

            <div className="history-rules-container">
                <div className="history-section-group">
                    <button
                        className={`history-tabs ${activeTab === "history" ? "active" : ""
                            }`}
                        onClick={() => handleTabClick("history")}
                    >
                        History
                    </button>
                    <button
                        className={`history-tabs ${activeTab === "rules" ? "active" : ""}`}
                        onClick={() => handleTabClick("rules")}
                    >
                        Rules
                    </button>
                </div>
                <section className="history-section">
                    {activeTab === "history" && !hasData && (
                        <div className="no-data-container">
                            <img
                                className="no-data-history-img"
                                src="/assets/No data-1.webp"
                                alt="No Data"
                            />
                            <span className="no-data-history-text">No data available</span>
                        </div>
                    )}
                    {activeTab === "history" && hasData && (
                         <div className="data-content">
                         {historyData.map((item, idx) => {
                             const formattedContent = formatHistoryItem(item);
                             return (
                                 <div key={idx} className="history-item">
                                     <div className="history-item-content">
                                         <div className="history-item-left">
                                             <p className="history-item-title">{formattedContent.title}</p>
                                             <p className="history-item-exp">Betting EXP</p>
                                             <p className="history-item-date">{formattedContent.subtext}</p>
                                         </div>
                                         <div className="history-item-right">
                                             <p className="history-item-description">{formattedContent.description}</p>
                                         </div>
                                     </div>
                                     <div className="history-item-divider"></div>
                                 </div>
                             );
                         })}
                     </div>
                    )}
                    {activeTab === "rules" && (
                        <div className="rules-content">
                            <h2>VIP privileges</h2>
                            <p>VIP rule description</p>

                            <div className="rules-card">
                                <div className="rules-card-header">Upgrade standard</div>
                                <div className="rules-card-text">
                                    The IP member's experience points (valid bet amount) that meet
                                    the requirements of the corresponding rank will be promoted to
                                    the corresponding VIP level, the member's VIP data statistics
                                    period starts from 00:00:00 days VIP system launched.VIP level
                                    calculation is refreshed every 10 minutes! The corresponding
                                    experience level is calculated according to valid odds 1:1 !
                                </div>
                            </div>

                            <div className="rules-card">
                                <div className="rules-card-header">Upgrade order</div>
                                <div className="rules-card-text">
                                    The VIP level that meets the corresponding requirements can be
                                    promoted by one level every day, but the VIP level cannot be
                                    promoted by leapfrogging.
                                </div>
                            </div>

                            <div className="rules-card">
                                <div className="rules-card-header">Level maintenance</div>
                                <div className="rules-card-text">
                                    VIP members need to complete the maintenance requirements of
                                    the corresponding level within 30 days after the "VIP level
                                    change"; if the promotion is completed during this period, the
                                    maintenance requirements will be calculated according to the
                                    current level.
                                </div>
                            </div>

                            <div className="rules-card">
                                <div className="rules-card-header">Downgrade standard</div>
                                <div className="rules-card-text">
                                    If a VIP member fails to complete the corresponding level
                                    maintenance requirements within 30 days, the system will
                                    automatically deduct the experience points corresponding to
                                    the level. If the experience points are insufficient, the
                                    level will be downgraded, and the corresponding discounts will
                                    be adjusted to the downgraded level accordingly.
                                </div>
                            </div>

                            <div className="rules-card">
                                <div className="rules-card-header">Upgrade Bonus</div>
                                <div className="rules-card-text">
                                    The upgrade benefits can be claimed on the VIP page after the
                                    member reaches the VIP membership level, and each VIP member
                                    can only get the upgrade reward of each level once.
                                </div>
                            </div>
                            <div className="rules-card">
                                <div className="rules-card-header">Monthly reward</div>
                                <div className="rules-card-text">
                                    VIP members can earn the highest level of VIP rewards once a
                                    month.Can only be received once a month. Prizes cannot be
                                    accumulated. And any unclaimed rewards will be refreshed on
                                    the next settlement day. When receiving the highest level of
                                    monthly rewards this month Monthly Rewards earned in this
                                    month will be deducted e.g. when VIP1 earns 500 and upgrades
                                    to VIP2 to receive monthly rewards 500 will be deducted.
                                </div>
                            </div>
                            <div className="rules-card">
                                <div className="rules-card-header">Real-time rebate</div>
                                <div className="rules-card-text">
                                    The higher the VIP level, the higher the return rate, all the
                                    games are calculated in real time and can be self-rewarded!
                                </div>
                            </div>
                            <div className="rules-card">
                                <div className="rules-card-header">Safe</div>
                                <div className="rules-card-text">
                                    VIP members who have reached the corresponding level will get
                                    additional benefits on safe deposit based on the member's VIP
                                    level.
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div></>
    )
}

export default VipHistory