import React, { Suspense, useContext, useEffect, useRef, useState } from "react";
import Mobile from "../components/layout/Mobile";
import DepositModal from "../components/popups/depositModal";
import NotificationModal from "../components/popups/NotificationPopup";
import LoadingLogo from "../components/utils/LodingLogo";
import BottomNavigationArea from "../components/common/BottomNavigation";
import HomeMain from "../components/home/HomeMain";
import DownloadModal from "../components/popups/DownloadModal";
import CustomerSupportButton from "../components/utils/FloatingButtons/CustomerSupportButton";
import LuckySpinFloat from "../components/utils/FloatingButtons/LuckySpinFloat";
import TelegramFloat from "../components/utils/FloatingButtons/TelegramFloat";
import { useAuth } from "../context/AuthContext";
import { UserContext } from "../context/UserState"

const Home = () => {
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { getUserData } = useContext(UserContext)

  const [forceUpdate, setForceUpdate] = useState(0);
  const hasFetched = useRef(false);
  // const location = useLocation();
  const [forceRemount, setForceRemount] = useState(0);

  useEffect(() => {
    //console.log('useEffect for focus event triggered');
    const handleFocus = () => {
      //console.log('User returned to the tab (focus event detected)');
      setForceRemount(prev => prev + 1); // Force remount
      getUserData()
    };

    window.addEventListener('focus', handleFocus);

    // Cleanup
    return () => {
      //console.log('Cleaning up focus event listener');
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    window.addEventListener("resize", setVh);
    setVh();
    return () => window.removeEventListener("resize", setVh);
  }, []);

  useEffect(() => {
    // Check if notification modal should be shown today
    const notificationConfirmedDate = localStorage.getItem("notificationConfirmedDate");
    const today = new Date().toDateString();

    if (notificationConfirmedDate !== today) {
      // Delay opening the notification modal slightly
      const timer = setTimeout(() => {
        setNotificationModalOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // If notification is already confirmed, check if deposit modal should be shown
      const depositDismissedDate = localStorage.getItem("depositModalDismissedDate");
      if (depositDismissedDate !== today) {
        // Delay opening the deposit modal slightly
        const timer = setTimeout(() => {
          setDepositModalOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleNotificationClose = () => {
    setNotificationModalOpen(false);

    // Check if deposit modal should be shown
    const depositDismissedDate = localStorage.getItem("depositModalDismissedDate");
    const today = new Date().toDateString();

    if (depositDismissedDate !== today) {
      // Show deposit modal after a short delay
      setTimeout(() => setDepositModalOpen(true), 300);
    }
  };

  const handleDepositModalClose = () => {
    setDepositModalOpen(false);
  };

  // Add global style to hide scrollbars
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar {
        display: none;
      }
      * {
        scrollbar-width: none;
        msOverflowStyle: none;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <Suspense fallback={<LoadingLogo />}>
      <div style={{ position: "relative" }}>
        <Mobile>
          <NotificationModal
            open={isNotificationModalOpen}
            onClose={handleNotificationClose}
          />
          <DepositModal
            open={isDepositModalOpen}
            onClose={handleDepositModalClose}
          />
          <HomeMain />
          <DownloadModal />
          <BottomNavigationArea />
        </Mobile>
        {isAuthenticated && <TelegramFloat />}
        {isAuthenticated && <LuckySpinFloat />}
        {isAuthenticated && <CustomerSupportButton />}
      </div>
    </Suspense>
  );
};

export default Home;