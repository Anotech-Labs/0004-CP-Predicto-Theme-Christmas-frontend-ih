import React, { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import Lottery from "./Lottery";
import MiniGames from "./MiniGames";
import HotSlot from "./HotSlot";
import Slots from "./Slots";
import Sports from "./Sports";
import Casino from "./Casino";
import SuperJackpot from "./SuperJackpot";
import Pvc from "./Pvc";
import Fishing from "./Fishing";
import Champion from "./Champion";
import HomeCasino from "./HomeCasino";
import HomeRummy from "./HomeRummy";
import HomeSlots from "./HomeSlots";
import HomeFishing from "./HomeFishing";
import HomeSports from "./HomeSports";
import HomeMiniGames from "./HomeMiniGames";
import { useNavigate } from "react-router-dom";
// import TopBanner from "./TopBanner";

const ScrollableTabs = () => {
  // Set initial selected item to "Lobby"
  const [selectedItem, setSelectedItem] = useState("Lobby");
  const scrollRef = useRef(null);
  const itemRefs = useRef({});
  const navigate = useNavigate()

  // const navigationItems = [
  //   {
  //     name: "Lobby",
  //     icon: "/assets/gameFilter/lobby.webp"
  //   },
  //   {
  //     name: "Lottery",
  //     icon: "/assets/gameFilter/lottery.webp"
  //   },
  //   {
  //     name: "Mini games",
  //     icon: "/assets/gameFilter/miniGames.webp"
  //   },
  //   {
  //     name: "Popular",
  //     icon: "/assets/gameFilter/popular.webp"
  //   },
  //   {
  //     name: "Slots",
  //     icon: "/assets/gameFilter/slots.webp"
  //   },
  //   {
  //     name: "Fishing",
  //     icon: "/assets/gameFilter/fishing.webp"
  //   },
  //   {
  //     name: "PVC",
  //     icon: "/assets/gameFilter/pvc.webp"
  //   },
  //   {
  //     name: "Casino",
  //     icon: "/assets/gameFilter/casino.webp"
  //   },
  //   {
  //     name: "Sports",
  //     icon: "/assets/gameFilter/sports.webp"
  //   }
  // ];

  const handleFilter = (componentName) => {
    setSelectedItem(componentName);
  };

  // const handleSwitchToTab = (tabName) => {
  //   handleFilter(tabName);
  // };
  // Center the selected tab
  useEffect(() => {
    if (scrollRef.current && itemRefs.current[selectedItem]) {
      const container = scrollRef.current;
      const item = itemRefs.current[selectedItem];

      const containerWidth = container.clientWidth;
      const itemWidth = item.clientWidth;

      // Calculate scroll position to center the item
      const scrollPosition = item.offsetLeft - (containerWidth / 2) + (itemWidth / 2);

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [selectedItem]);

  // Component mapping
  const renderComponent = () => {
    switch (selectedItem) {
      case "Lobby":
        return (
          <>
          <Lottery />
           <HomeMiniGames onDetailClick={() => navigate("/all-games/Mini games")}/>
            <HomeCasino onDetailClick={() => navigate("/all-games/Casino")}/>
            <HomeSlots onDetailClick={() => navigate("/all-games/Slots")}/>
              {/* <TopBanner/> */}
                     <HomeSports onDetailClick={() => navigate("/all-games/Sports")}/>
                             <HomeRummy />
                      <HomeFishing onDetailClick={() => navigate("/all-games/Fishing")}/>
                       <SuperJackpot />           
          </>
        );
      case "Lottery":
        return <Lottery />;
      case "Mini games":
        return <MiniGames />;
      case "Slots":
        return (
          <>
            <Slots />
            {/* <SuperJackpot /> */}
          </>
        );
      case "Popular":
        return <HotSlot />;
      case "Fishing":
        return <Fishing />;
      case "Casino":
        return <Casino />;
      case "PVC":
        return <Pvc />;
      case "Sports":
        return <Sports />;
      case "Champion":
        return <Champion />;
      default:
        return <Lottery />;
    }
  };

  return (
    <Box sx={{
    // mx: "13px"
     }}>
      {/* Scrollable tabs container */}
      {/* <Box
        ref={scrollRef}
        sx={{
          backgroundColor: '#232626',
          display: 'flex',
          overflowX: 'auto',
          scrollbarWidth: 'none', // Hide scrollbar for Firefox
          msOverflowStyle: 'none', // Hide scrollbar for IE/Edge
          '&::-webkit-scrollbar': {
            display: 'none' // Hide scrollbar for Chrome/Safari
          },
          whiteSpace: 'nowrap',
          padding: '0px 5px'
        }}
      >
        {navigationItems.map((item) => (
          <Box
            key={item.name}
            ref={el => itemRefs.current[item.name] = el}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              position: 'relative',
              // marginRight: '15px',
              flexShrink: 0,
              width: '70px',
              // Add indicator for selected tab
              // borderBottom: selectedItem === item.name ? '3px solid #24ee89' : '2px solid transparent',
              paddingBottom: '5px'
            }}
            onClick={() => handleFilter(item.name)}
          >
            <Box sx={{
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: selectedItem === item.name ? '1' : '0.5',
              borderRadius: '50%',
              padding: '5px'
            }}>
              <img
                src={item.icon}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </Box>

            <Box
              sx={{
                color: selectedItem === item.name ? "#ffffff" : "#b3bec1",
                fontSize: '12.8px',
                textAlign: 'center',
                width: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'color 0.3s ease',
                fontFamily: "'Times New Roman', Times,  ",
              }}
            >
              {item.name}
            </Box>
            <Box sx={{ width: "50%", height: "3px", background: selectedItem === item.name ? "#24ee89" : "transparent", borderRadius: "5px", mt: 1 ,boxShadow: selectedItem === item.name ? "0 .05333rem .26667rem #24ee89a6":"none"}}>

            </Box>
          </Box>
        ))}
      </Box> */}

      {/* Content area */}
      <Box sx={{px:2,background:"transparent"}}>
        {renderComponent()}
      </Box>
    </Box>
  );
};

export default ScrollableTabs;