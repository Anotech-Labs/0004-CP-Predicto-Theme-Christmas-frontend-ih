import React from "react";
import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { keyframes } from "@mui/system";

const Winning = () => {
  const initialWinners = [
    {
      id: 1,
      user: "Mem***PXX",
      image: "/assets/avatars/profile-4.webp",
      amount: "980.00",
      game: "K3",
      gameType: "",
      thumbnail: "/assets/lottery/wingo.webp",
    },
    {
      id: 2,
      user: "Mem***AAL",
      image: "/assets/avatars/profile-2.webp",
      amount: "300.00",
      game: "JILI",
      gameType: "GAME",
      thumbnail: "/assets/lottery/K3Lottery.webp",
    },
    {
      id: 3,
      user: "Mem***LZL",
      image: "/assets/avatars/profile-3.webp",
      amount: "19,200.00",
      game: "Plinko",
      gameType: "",
      thumbnail: "/assets/lottery/wingo.webp",
    },
    {
      id: 4,
      user: "Mem***PXX",
      image: "/assets/avatars/profile-4.webp",
      amount: "980.00",
      game: "K3",
      gameType: "",
      thumbnail: "/assets/lottery/wingo.webp",
    },
    {
      id: 5,
      user: "Mem***PXX",
      image: "/assets/avatars/profile-4.webp",
      amount: "980.00",
      game: "K3",
      gameType: "",
      thumbnail: "/assets/lottery/wingo.webp",
    },
    {
      id: 6,
      user: "Mem***MKL",
      image: "/assets/avatars/profile-6.webp",
      amount: "1,390.00",
      game: "Plinko",
      gameType: "",
      thumbnail: "/assets/lottery/wingo.webp",
    },
    {
      id: 7,
      user: "Mem***XYZ",
      image: "/assets/avatars/profile-7.webp",
      amount: "2,999.00",
      game: "K3",
      gameType: "",
      thumbnail: "/assets/lottery/wingo.webp",
    },
  ];

  const [winners, setWinners] = useState(initialWinners);
  const [visibleCards, setVisibleCards] = useState(initialWinners.slice(0, 4));
  const [lastRemovedCard, setLastRemovedCard] = useState(null);
  const [showNewCard, setShowNewCard] = useState(false);

  // Define the blinking animation
  const blinkKeyframes = keyframes`
    0% { opacity: 0; }
    20% { opacity: 1; }
    40% { opacity: 0; }
    60% { opacity: 1; }
    80% { opacity: 0; }
    100% { opacity: 1; }
  `;

  useEffect(() => {
    const rotationInterval = 3000; // Total time for one complete cycle
    
    const animate = () => {
      // 1. Get the next card to display
      const nextCardIndex = (winners.indexOf(visibleCards[0]) - 1 + winners.length) % winners.length;
      const nextCard = winners[nextCardIndex];
      
      // 2. First make all current cards slide right (losing the last one)
      const currentCards = [...visibleCards];
      const removedCard = currentCards.pop(); // Store the last card that will be removed
      setLastRemovedCard(removedCard);
      
      // All cards move right
      document.querySelectorAll('.card-item').forEach(card => {
        card.style.transform = 'translateX(calc(100% + 12px))';
      });
      
      // 3. After the sliding completes, add the new card with blink effect
      setTimeout(() => {
        const newVisibleCards = [nextCard, ...currentCards.slice(0, 3)];
        setVisibleCards(newVisibleCards);
        
        // Reset positions of all cards
        document.querySelectorAll('.card-item').forEach(card => {
          card.style.transform = 'translateX(0)';
        });
        
        // Show the new card with blink effect
        setShowNewCard(true);
        
        // After blinking completes, reset for next animation
        setTimeout(() => {
          setShowNewCard(false);
        }, 1000);
      }, 600);
    };

    const interval = setInterval(animate, rotationInterval);
    return () => clearInterval(interval);
  }, [winners, visibleCards]);

  return (
    <>
      <style>
        {`
          .winner-container {
            position: relative;
            overflow: hidden;
            width: 100%;
          }
          
          .winner-cards {
            display: flex;
            position: relative;
            gap: 12px;
          }
          
          .card-item {
            flex: 0 0 auto;
            transition: transform 0.6s ease;
          }
          
          .new-card {
            animation: ${blinkKeyframes} 1s ease-in-out;
          }
          
          .game-badge {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #e74c3c;
            color: white;
            text-align: center;
            padding: 2px 0;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          
          .game-type {
            position: absolute;
            top: 0;
            right: 0;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 2px 6px;
            font-size: 10px;
            border-radius: 0 0 0 5px;
          }
        `}
      </style>

      <Box 
        sx={{ 
          padding: "15px 10px",
          backgroundImage: "url('/assets/winningbg.webp')",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          borderRadius: "0 0 8px 8px",
          m: 2,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Typography
          sx={{
            fontSize: "16px",
            color: "#FDE4BC",
            fontWeight: "bold",
            fontFamily: "'Times New Roman', Times, serif !important",
            mb: 2
          }}
        >
          Winning information
        </Typography>
        
        <Box className="winner-container">
          <Box className="winner-cards">
            {/* Visible cards */}
            {visibleCards.map((item, index) => (
              <Box
                key={`card-${item.id}`}
                className={`card-item ${index === 0 && showNewCard ? 'new-card' : ''}`}
                sx={{
                  width: { xs: "80px", sm: "100px", md: "110px" },
                  borderRadius: "6px",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ 
                  position: "relative", 
                  width: "100%", 
                  overflow: "hidden" 
                }}>
                  <img
                    src={item.thumbnail}
                    alt={item.game}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain"
                    }}
                  />
                </Box>

                <Box sx={{ 
                  textAlign: "center"
                }}>
                  <Typography sx={{ 
                    color: "#B79C8B", 
                    fontSize: "11px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    fontFamily: "'Times New Roman', Times, serif !important",
                    textOverflow: "ellipsis"
                  }}>
                    {item.user}
                  </Typography>
                  <Typography sx={{ 
                    color: "#FED358", 
                    fontSize: "11px", 
                  }}>
                    ₹{item.amount}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Winning;