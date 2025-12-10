import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import "./RacingAnimation.css"
import sceneryImg from "../../../assets/race/scenery.webp"
import roadImg from "../../../assets/race/road.webp"
import finisherImg from "../../../assets/race/finisher.webp"
import wheelImg from "../../../assets/race/wheel.gif"
import windImg from "../../../assets/race/wind.webp"
import flameImg from "../../../assets/race/flame.webp"
import lightRedImg from "../../../assets/race/lightred.webp"
import lightYellowImg from "../../../assets/race/lightyellow.webp"
import lightGreenImg from "../../../assets/race/lightgreen.webp"
import trafficSignalImg from "../../../assets/race/trafficlight.webp"
import result1Img from "../../../assets/race/result1.webp"
import result2Img from "../../../assets/race/result2.webp"
import result3Img from "../../../assets/race/result3.webp"
import speedPinball1 from "../../../assets/race-ball/speed_pinball1.webp"
import speedPinball2 from "../../../assets/race-ball/speed_pinball2.webp"
import speedPinball3 from "../../../assets/race-ball/speed_pinball3.webp"
import speedPinball4 from "../../../assets/race-ball/speed_pinball4.webp"
import speedPinball5 from "../../../assets/race-ball/speed_pinball5.webp"
import speedPinball6 from "../../../assets/race-ball/speed_pinball6.webp"
import speedPinball7 from "../../../assets/race-ball/speed_pinball7.webp"
import speedPinball8 from "../../../assets/race-ball/speed_pinball8.webp"
import speedPinball9 from "../../../assets/race-ball/speed_pinball9.webp"
import speedPinball10 from "../../../assets/race-ball/speed_pinball10.webp"
import { useSearchParams } from "react-router-dom"
import { domain } from "../../../utils/Secret"
import { useAuth } from "../../../context/AuthContext"

const RacingAnimation = () => {
    const [searchParams] = useSearchParams()
    const selectedTimer = searchParams.get("timer") || "30sec"
    const [showResultPage, setShowResultPage] = useState(false)
    const [roadStartPosition, setRoadStartPosition] = useState(970)
    const [finishLinePosition, setFinishLinePosition] = useState(-300)
    const [isRacing, setIsRacing] = useState(false)
    const [winners, setWinners] = useState({})
    const [positions, setPositions] = useState([])
    const [showPositions, setShowPositions] = useState(false)
    const [remainingTime, setRemainingTime] = useState(0)
    const [periodId, setPeriodId] = useState(null)
    const [trafficLights, setTrafficLights] = useState({
        red: false,
        yellow: false,
        green: false,
    })
    const [showWheels, setShowWheels] = useState(false)
    const [readyToRace, setReadyToRace] = useState(false)
    const { axiosInstance } = useAuth()
    const animationFrameRef = useRef()
    const carPositionsRef = useRef({
        car1: 0,
        car2: 5,
        car3: 15,
        car4: 20,
        car5: 30,
        car6: 40,
        car7: 45,
        car8: 50,
        car9: 60,
        car10: 70,
    })
    const [carPositions, setCarPositions] = useState(carPositionsRef.current)

    const ballImages = {
        1: speedPinball1,
        2: speedPinball2,
        3: speedPinball3,
        4: speedPinball4,
        5: speedPinball5,
        6: speedPinball6,
        7: speedPinball7,
        8: speedPinball8,
        9: speedPinball9,
        10: speedPinball10,
    };

    useEffect(() => {
           if (!winners.first || !winners.second || !winners.third) {
               setShowPositions(false); // Hide positions if winners are not set
               return;
           }
       
           let interval;
       
           const startGeneration = setTimeout(() => {
               setShowPositions(true);
       
               const generateRandomPositions = () => {
                   if (!isRacing) {
                       // Show only the winners after race ends
                       setPositions([winners.first, winners.second, winners.third]);
                       return;
                   }
       
                   // Generate completely random positions while the race is ongoing
                   const nums = Array.from({ length: 10 }, (_, i) => i + 1);
       
                   for (let i = nums.length - 1; i > 0; i--) {
                       const j = Math.floor(Math.random() * (i + 1));
                       [nums[i], nums[j]] = [nums[j], nums[i]];
                   }
       
                   setPositions(nums);
               };
       
               // Start generating random positions repeatedly while race is ongoing
               interval = setInterval(generateRandomPositions, 250);
       
           }, 10);
       
           return () => {
               clearTimeout(startGeneration);
               clearInterval(interval);
           };
       }, [isRacing, winners]);    

    const timerTypeMap = {
        "30sec": "THIRTY_TIMER",
        "1min": "ONE_MINUTE_TIMER",
        "3min": "THREE_MINUTE_TIMER",
        "5min": "FIVE_MINUTE_TIMER",
        "10min": "TEN_MINUTE_TIMER",
    };

    const fetchTimerData = async () => {
        // //console.log("fetchTimerData")
        try {
          const timerType = selectedTimer ? timerTypeMap[selectedTimer] : "THIRTY_TIMER";
          
          const response = await axiosInstance.get(
            `${domain}/api/master-game/period/active-period`,
            {
              params: { timerType },
            }
          );
          
          const data = response.data;
          // setPeriodId(data.periodId);
          
          // Calculate remaining time in seconds
          const endTime = new Date(data.endTime).getTime();
          const currentTime = Date.now();
          const initialRemaining = Math.floor((endTime - currentTime) / 1000);
          
          // Ensure we have a non-negative value
          setRemainingTime(Math.max(initialRemaining, 0));
          
        //   //console.log("Fetched period:", data.periodId, "Remaining time:", initialRemaining);
        } catch (error) {
          console.error("Failed to fetch timer data:", error);
          
          // On error, retry after a short delay
          setTimeout(() => {
            fetchTimerData();
          }, 1000);
        }
      };

      const fetchGameHistory = useCallback(async () => {
        const timerType = timerTypeMap[selectedTimer] || "THIRTY_TIMER";
        try {
        
            const response = await axiosInstance.get(`${domain}/api/master-game/car-race/history`, {
                params: {
                    timerType,
                    page: 1,
                    limit: 1
                },
                withCredentials: true,
            });
        

            let filteredData = response.data.data.history[0]
            setPeriodId(filteredData.periodId)
            setWinners({
                first: filteredData.firstPlace.carNumber,
                second: filteredData.secondPlace.carNumber,
                third: filteredData.thirdPlace.carNumber,
            })
            setReadyToRace(true)
        } catch (err) {
            console.error("Error fetching game history:", err)
        }
    }, [selectedTimer])
      
      useEffect(() => {
        if (remainingTime === 0) {
            fetchGameHistory();
        }
        
    }, [remainingTime, fetchGameHistory]);
      
        useEffect(() => {
          fetchTimerData();
          setRemainingTime(0);
        }, [selectedTimer]);
      
        useEffect(() => {
          let intervalId = null;
      
          if (remainingTime > 0 || remainingTime === 0) {
            intervalId = setInterval(() => {
              setRemainingTime((prevTime) => {
                if (prevTime <= 1) {
                  // Check for 1 to ensure we fetch before hitting 0
                  clearInterval(intervalId);
                  fetchTimerData(); // Fetch new data when timer reaches zero
                  return 0;
                }
                return prevTime - 1;
              });
            }, 1000);
          }
      
          return () => {
            if (intervalId) {
              clearInterval(intervalId);
            }
          };
        }, [remainingTime]);

        const startRace = () => {
            // Reset states
            const resetStates = () => {
                setIsRacing(false);
                setFinishLinePosition(-300);
                setShowResultPage(false);
                setRoadStartPosition(970);
                setShowWheels(false);
                setTrafficLights({ red: true, yellow: false, green: false });
        
                const initialPositions = {
                    car1: 0, car2: 5, car3: 15, car4: 20, car5: 30,
                    car6: 40, car7: 45, car8: 50, car9: 60, car10: 70
                };
        
                carPositionsRef.current = initialPositions;
                setCarPositions(initialPositions);
            };
        
            const triggerYellowLight = () => {
                setTrafficLights({ red: true, yellow: true, green: false });
                setTimeout(triggerGreenLight, 500);
            };
        
            const triggerGreenLight = () => {
                setTrafficLights({ red: true, yellow: true, green: true });
                setTimeout(clearTrafficLights, 500);
            };
        
            const clearTrafficLights = () => {
                setTrafficLights({ red: false, yellow: false, green: false });
                setTimeout(startRoadAnimation, 500);
            };
        
            const startRoadAnimation = () => {
                setRoadStartPosition(1350); // Animate the road
                setTimeout(startRaceAnimation, 100);
            };
        
            const startRaceAnimation = () => {
                setIsRacing(true);
                setShowWheels(true);
            
                let raceTime = 0;
                const raceDuration = 10000;
                const finalSprintTime = 3000;
                const finishLineAnimationTime = 9000;
                const resultDisplayDuration = 5000;
            
                // Important: Fetch winners BEFORE starting the animation
                // and use a state variable to track when we have the data
                const fetchWinnersBeforeRace = async () => {
                    const timerType = timerTypeMap[selectedTimer] || "THIRTY_TIMER";
                    try {
                        const response = await axiosInstance.get(`${domain}/api/master-game/car-race/history`, {
                            params: { timerType, page: 1, limit: 1 },
                            withCredentials: true,
                        });
            
                        const filteredData = response.data.data.history[0];
                        setPeriodId(filteredData.periodId);
                        
                        // Set winners state that will be used consistently throughout the animation
                        const raceWinners = {
                            first: filteredData.firstPlace.carNumber,
                            second: filteredData.secondPlace.carNumber,
                            third: filteredData.thirdPlace.carNumber,
                        };
                        
                        setWinners(raceWinners);
                        
                        // Store winners locally for the animation to use
                        const winnerData = raceWinners;
                        
                        // Now start the animation with the winner data already available
                        startActualRaceAnimation(winnerData);
                    } catch (err) {
                        console.error("Error fetching game history:", err);
                        // Fallback to start animation even if fetch fails
                        startActualRaceAnimation({});
                    }
                };
            
                // Separated the animation logic into its own function that receives winner data
                const startActualRaceAnimation = (winnerData) => {
                    const carMomentums = {};
                    Object.keys(carPositionsRef.current).forEach((car) => {
                        carMomentums[car] = {
                            speed: Math.random() * 4,
                            direction: 1,
                            lastChange: 0,
                        };
                    });
            
                    const animate = (timestamp) => {
                        if (!raceTime) raceTime = timestamp;
                        const progress = timestamp - raceTime;
            
                        if (progress >= finishLineAnimationTime && finishLinePosition === -300) {
                            setFinishLinePosition(250);
                        }
            
                        if (progress < raceDuration) {
                            const newPositions = { ...carPositionsRef.current };
            
                            Object.keys(newPositions).forEach((car) => {
                                const carNum = parseInt(car.replace("car", ""));
            
                                if (progress >= raceDuration - finalSprintTime) {
                                    // Use the winner data that was fetched before the race started
                                    if (winnerData.first === carNum) newPositions[car] += 4.5;
                                    else if (winnerData.second === carNum) newPositions[car] += 4;
                                    else if (winnerData.third === carNum) newPositions[car] += 3.5;
                                    else newPositions[car] += Math.random() < 1.8 ? -Math.random() * 0.8 : Math.random() * 0.6;
                                } else {
                                    if (progress - carMomentums[car].lastChange > 1500) {
                                        if (Math.random() < 1.8) {
                                            carMomentums[car].speed = Math.random() * 0.5 + 0.4;
                                            carMomentums[car].direction = Math.random() < 0.7 ? 1 : -1;
                                            carMomentums[car].lastChange = progress;
                                        }
                                    }
            
                                    const movement = carMomentums[car].speed * carMomentums[car].direction;
                                    const randomFactor = (Math.random() - 0.5) * 0.1;
                                    newPositions[car] += movement + randomFactor;
            
                                    if (newPositions[car] < -50) {
                                        newPositions[car] = -50;
                                        carMomentums[car].direction = 1;
                                    }
            
                                    if (Math.random() < 0.05) {
                                        newPositions[car] += Math.random() * 1;
                                    }
                                }
                            });
            
                            carPositionsRef.current = newPositions;
                            setCarPositions(newPositions);
                            animationFrameRef.current = requestAnimationFrame(animate);
                        } else {
                            setIsRacing(false);
                            setShowWheels(false);
            
                            setTimeout(() => {
                                const sceneryElement = document.getElementById("scenaryitm");
                                const roadElement = document.getElementById("roaditm");
                                if (sceneryElement) sceneryElement.style.animation = "none";
                                if (roadElement) roadElement.style.animation = "none";
            
                                setTimeout(() => {
                                    setShowResultPage(true);
                                    setTimeout(() => {
                                        setShowResultPage(false);
                                        resetStates();
                                        if (sceneryElement) sceneryElement.style.animation = "";
                                        if (roadElement) roadElement.style.animation = "";
                                        setTrafficLights({ red: false, yellow: false, green: false });
                                    }, resultDisplayDuration);
                                    setFinishLinePosition(-300);
                                    setRoadStartPosition(970);
                                }, 1000);
                            }, 0);
                        }
                    };
            
                    animationFrameRef.current = requestAnimationFrame(animate);
                };
            
                // Start by fetching winners first, then the animation will begin
                fetchWinnersBeforeRace();
            };            
        
            // Start the sequence
            resetStates();
            setTimeout(triggerYellowLight, 500);
        };
        

    useEffect(() => {
        if (remainingTime === 1 && readyToRace) {
          startRace(winners.first, winners.second, winners.third);
          //console.log("winners", winners)
        }
      }, [remainingTime, readyToRace]);

    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [])

    const CarComponent = ({
        id,
        right,
        imageNumber,
        showEffects = true,
        bottom = "60px",
    }) => {
        // Calculate the dynamic values based on imageNumber
        const width = 120 + imageNumber * 7
        const height = 32 + imageNumber * 2
        const wheelSize = 18 + imageNumber
        const windWidth = 144 + imageNumber * 3
        const windHeight = 50 + imageNumber * 2
        const flameWidth = 49 + imageNumber * 1 // if flame is needed
        const flameHeight = 11 + imageNumber * 0.5 // if flame is needed

        // Base styles that are applied directly to each car
        const baseStyle = {
            position: "absolute",
            bottom: bottom, // Passed dynamically
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            transformStyle: "preserve-3d",
            willChange: "transform, left",
            transform: `scale(1)`, // Base scale
            right: `${right}px`, // Position dynamically calculated
        }

        return (
            <div className={`racecar racecar${imageNumber}`} id={id} style={baseStyle}>
                <img
                    src={`/assets/race/car${imageNumber}.webp`}
                    width={width}
                    height={height}
                    alt={`Car ${imageNumber}`}
                />

                {showWheels && (
                    <>
                        <div
                            className={`wheel${imageNumber}a`}
                            style={{
                                display: "block",
                                position: "absolute",
                                bottom: "0",
                                left: "15%",
                                transform: "translateY(20%)",
                            }}
                        >
                            <img
                                src={wheelImg}
                                width={wheelSize}
                                height={wheelSize}
                                alt="Wheel"
                            />
                        </div>
                        <div
                            className={`wheel${imageNumber}b`}
                            style={{
                                display: "block",
                                position: "absolute",
                                bottom: "0",
                                right: "5%",
                                transform: "translateY(15%)",
                            }}
                        >
                            <img
                                src={wheelImg}
                                width={wheelSize}
                                height={wheelSize}
                                alt="Wheel"
                            />
                        </div>
                    </>
                )}

                {showEffects && (
                    <>
                        <div
                            className="wind"
                            style={{ display: "block", opacity: isRacing ? 0.6 : 0 }}
                        >
                            <img
                                src={windImg}
                                width={windWidth}
                                height={windHeight}
                                alt="Wind effect"
                            />
                        </div>
                        <div
                            className="flame"
                            style={{
                                display: isRacing ? "block" : "none",
                                position: "absolute",
                                bottom: "10px",
                                left: "98%",
                                transform: "translateX(-50%)",
                                opacity: isRacing ? 1 : 0,
                                zIndex: 1,
                            }}
                        >
                            <img
                                src={flameImg}
                                width={flameWidth || "50"}
                                height={flameHeight || "50"}
                                alt="Flame effect"
                            />
                        </div>
                    </>
                )}
            </div>
        )
    }

    // const ballImageCache = useMemo(() => {
    //     const cache = {};
    //     for (let i = 1; i <= 10; i++) {
    //       cache[i] = `/assets/race-ball/speed_pinball${i}.webp`;
    //     }
    //     return cache;
    //   }, []);

    const getBallImage = useCallback((number) => {
        return ballImages[number]
    }, [ballImages])

    return (
        <div className="raceContainer">
            <header className="header">
                <div className="logo">Racing {selectedTimer}</div>
                <div
                    className="headposition"
                    style={{
                        display: showPositions ? "flex" : "none",
                        gap: "10px",
                        padding: "10px",
                    }}
                >
                    {(showResultPage
                        ? [winners.first, winners.second, winners.third]
                        : positions
                    ).map((number, index) => (
                        <div
                            key={`pos${index + 1}`}
                            className="positm"
                            id={`pos${index + 1}`}
                            style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                overflow: "hidden",
                                backgroundColor: "#f0f0f0",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                        >
                            <img
                                src={ballImages[number]}
                                alt={`Ball ${number}`}
                                style={{
                                    width: "100%",
                                    height: "auto",
                                }}
                            />
                        </div>
                    ))}
                </div>
                <div className="currentdraw">
                    Per. <span id="currentdrawid">{periodId}</span>
                </div>
            </header>

            <div className="scenary page1">
                <div
                    className="scenaryitm"
                    id="scenaryitm"
                    style={{
                        animation: isRacing ? "scrollScenery 10s linear infinite" : "",
                        animationPlayState:
                            !isRacing && !showResultPage ? "paused" : "running",
                    }}
                >
                    <img src={sceneryImg} width="2668" height="119" alt="Scenery" />
                </div>
            </div>

            <div className="road page1">
                <div className="roadani">
                    <div
                        className="roaditm"
                        id="roaditm"
                        style={{
                            animation: isRacing ? "scrollRoad 0.5s linear infinite" : "none",
                            willChange: "transform",
                            zIndex: 0,
                        }}
                    >
                        <img src={roadImg} width="2660" height="540" alt="Road" />
                    </div>
                </div>

                <div
                    className="roadstart"
                    id="roadstart"
                    style={{
                        left: `${roadStartPosition}px`,
                        transition: "left 1s ease-in-out",
                        willChange: "left",
                        zIndex: 1,
                    }}
                >
                    <img src={finisherImg} width="249" height="490" alt="Start line" />
                </div>
                <div
                    className="roadfinish"
                    id="roadfinish"
                    style={{
                        left: `${finishLinePosition}px`,
                        transition: "left 1s ease-in",
                        willChange: "left",
                        position: "absolute",
                        zIndex: 1,
                        top: "20px",
                    }}
                >
                    <img src={finisherImg} width="249" height="490" alt="Finish line" />
                </div>

                {[...Array(10)].map((_, index) => (
                    <CarComponent
                        key={`car${10 - index}`}
                        id={`car${10 - index}`}
                        right={carPositions[`car${10 - index}`]}
                        imageNumber={10 - index}
                        bottom={`${35 + index * 50}px`} // Adjust as needed
                    />
                ))}

                {(trafficLights.red || trafficLights.yellow || trafficLights.green) && (
                    <div className="trafficlight" style={{ position: "relative" }}>
                        <img
                            src={trafficSignalImg}
                            width="636px"
                            height="128px"
                            alt="Traffic signal box"
                            style={{
                                position: "absolute",
                                top: "-50px",
                                left: "340px",
                                zIndex: 1,
                            }}
                        />
                        <div className="countdownnum" />
                        <div className="countdownnum2" />
                        {trafficLights.red && (
                            <div
                                className="redlight"
                                style={{
                                    position: "absolute",
                                    top: "-80px",
                                    left: "720px",
                                    zIndex: 2,
                                }}
                            >
                                <img
                                    src={lightRedImg}
                                    width="293"
                                    height="193"
                                    alt="Red light"
                                />
                            </div>
                        )}
                        {trafficLights.yellow && (
                            <div
                                className="yellowlight"
                                style={{
                                    position: "absolute",
                                    top: "-80px",
                                    left: "520px",
                                    zIndex: 2,
                                }}
                            >
                                <img
                                    src={lightYellowImg}
                                    width="293"
                                    height="193"
                                    alt="Yellow light"
                                />
                            </div>
                        )}
                        {trafficLights.green && (
                            <div
                                className="greenlight"
                                style={{
                                    position: "absolute",
                                    top: "-80px",
                                    left: "320px",
                                    zIndex: 2,
                                }}
                            >
                                <img
                                    src={lightGreenImg}
                                    width="293"
                                    height="193"
                                    alt="Green light"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div
                className="resultpage page2"
                style={{ display: showResultPage ? "block" : "none" }}
            >
                {[1, 2, 3].map((num) => (
                    <div
                        key={`result${num}`}
                        className={`resultitm result${num}`}
                        id={`result${num}`}
                        style={{ opacity: 1 }}
                    >
                        <img
                            src={num === 1 ? result1Img : num === 2 ? result2Img : result3Img}
                            width={num === 1 ? 226 : num === 2 ? 258 : 173}
                            height={num === 1 ? 177 : num === 2 ? 139 : 112}
                            alt={`Result ${num}`}
                        />
                    </div>
                ))}

                {showResultPage && (
                    <>
                        <ResultCarComponent
                            position={1}
                            carNumber={winners.first}
                            showResultPage={showResultPage}
                        />
                        <ResultCarComponent
                            position={2}
                            carNumber={winners.second}
                            showResultPage={showResultPage}
                        />
                        <ResultCarComponent
                            position={3}
                            carNumber={winners.third}
                            showResultPage={showResultPage}
                        />
                    </>
                )}

                <div className="resultitm resultcar2" id="resultcar2">
                    <div className="rcar rcar2" />
                </div>
                <div
                    className="resultitm resultcar3"
                    id="resultcar3"
                    style={{ opacity: 1, left: "859px", top: "291px" }}
                >
                    <div className="rcar rcar4" />
                </div>
                <div
                    className="resultitm resultcar1"
                    id="resultcar1"
                    style={{ opacity: 1, left: "395px", top: "328px" }}
                >
                    <div className="rcar rcar8" />
                </div>
            </div>

            <footer className="footer" style={{ display: "none" }}>
                <div className="footer1">
                    <div className="footer1_1" id="footerter">
                        Waiting for Results:
                    </div>

                </div>

                <div className="footer2">
                    <div className="footer2_1">Champion & Runner-up Sum:</div>
                    <div className="footer2_2" id="stat1_2">
                        Even
                    </div>
                    <div className="footer2_2" id="stat1_3">
                        Small
                    </div>
                </div>

                <div className="footer3">
                    <div className="footer2_1">1-5 Dragon Tiger:</div>
                    {[...Array(5)].map((_, index) => (
                        <div
                            key={`stat2_${index + 1}`}
                            className="footer2_2"
                            id={`stat2_${index + 1}`}
                        >
                            -
                        </div>
                    ))}
                </div>
            </footer>
        </div>
    )
}

const ResultCarComponent = ({ position, carNumber, showResultPage }) => {
    const [visible, setVisible] = useState(false)

    const dimensions = {
        1: { width: "350px", height: "150px" },
        2: { width: "300px", height: "130px" },
        3: { width: "280px", height: "130px" },
    }

    const { width, height } = dimensions[position]

    const positionStyles = {
        1: { left: "640px", top: "360px", zIndex: 3 },
        2: { left: "300px", top: "300px", zIndex: 2 },
        3: { left: "1100px", top: "305px", zIndex: 1 },
    }

    useEffect(() => {
        if (showResultPage) {
            // Only start the fade-in animation when result page is shown
            const fadeInDelay = position * 500 // Maintain the staggered timing
            const timeout = setTimeout(() => setVisible(true), fadeInDelay)
            return () => clearTimeout(timeout)
        } else {
            // Reset visibility when result page is hidden
            setVisible(false)
        }
    }, [showResultPage, position])

    // //console.log("carNumber", carNumber)

    return (
        <div
            className={`resultitm resultcar${position}`}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(-150px)" : "translateX(0px)",
                transition: "opacity 0.8s ease-in-out, transform 0.8s ease-in-out",
                ...positionStyles[position],
                position: "absolute",
            }}
        >
            {carNumber && (
                <img
                    src={`../../../assets/race/winner${carNumber}.webp`}
                    width={width}
                    height={height}
                    alt={`Car ${carNumber}`}
                    style={{
                        transform: "scale(1.5)", // Make result cars slightly larger
                        objectFit: "contain", // Ensure image fits well
                    }}
                />
            )}
        </div>
    )
}

export const ResponsiveRacingWrapper = () => {
    const containerRef = useRef(null)
    const [scale, setScale] = useState({ x: 1, y: 1 })

    const updateScale = () => {
        if (!containerRef.current) return

        // Original game dimensions
        const baseWidth = 1334
        const baseHeight = 770

        // Get the parent iframe dimensions
        const parentWidth = window.innerWidth
        const parentHeight = window.innerHeight

        // Calculate scale factors
        const scaleX = parentWidth / baseWidth
        const scaleY = parentHeight / baseHeight

        // Use the smaller scale to maintain aspect ratio
        const scale = Math.min(scaleX, scaleY)

        setScale({
            x: scale,
            y: scale
        })
    }

    useEffect(() => {
        updateScale()

        // Add resize listener
        window.addEventListener('resize', updateScale)

        return () => {
            window.removeEventListener('resize', updateScale)
        }
    }, [])

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: "#110d14"
        }}>
            <div
                ref={containerRef}
                style={{
                    transform: `scale(${scale.x}, ${scale.y})`,
                    transformOrigin: 'center center',
                    width: '1334px',
                    height: '770px',
                }}
            >
                <RacingAnimation />
            </div>
        </div>
    )
}

export default RacingAnimation
