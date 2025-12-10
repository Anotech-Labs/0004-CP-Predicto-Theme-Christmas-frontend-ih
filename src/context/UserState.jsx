import { createContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { apidomain, clientPrefix, clientSecretKey, domain } from "../utils/Secret"

export const UserContext = createContext()

const UserState = ({ children }) => {
  const { axiosInstance, isAuthenticated, logout } = useAuth()

  const [userData, setUserData] = useState(null)
  const [userWallet, setUserWallet] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [accountType, setAccountType] = useState("")
  const [error, setError] = useState(null)
  const [getThirdPartyBalance, setGetThirdPartyBalance] = useState(null);

  const getUserData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Use a timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await axiosInstance.get(`/api/user/me?_t=${timestamp}`)
      
      if (response.data && response.data.body) {
        const user = response.data.body.user

        // First set the user data
        setUserData(user)
        setAccountType(user.accountType)
        await getWalletBalance()
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch user data')
      if (error.response?.status === 401) {
        await logout()
      }
    } finally {
      setIsLoading(false)
    }
  }

    const fetchThirdPartyBalance = async () => {
    try {
      const response = await axiosInstance.post(`${domain}/api/huidu/balance-sync`, {
        apiKey: clientPrefix,
        apiSecret: clientSecretKey,
        wrapperUrl: apidomain
      });
      // console.log("fetchThirdPartyBalance", response)
      setGetThirdPartyBalance(response.data.data.third_party_balance);
    } catch (err) {
      console.error("Error fetching third-party wallet balance:", err);
    }
  };

useEffect(() => {
  fetchThirdPartyBalance()
}, [])

  const getWalletBalance = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Add cache-busting parameter
      const timestamp = new Date().getTime();
      const response = await axiosInstance.get(`/api/user/wallet-balance?_t=${timestamp}`)

      if (response.data && response.data.body) {
        let balance = response.data.body.walletBalance
        const validBalance = Number(balance ?? 0);
        setUserWallet(
          validBalance === 0
            ? "0.00"
            : validBalance % 1 === 0
              ? `${validBalance}.00`
              : validBalance.toFixed(2)
        );
      }

      return response.data
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch wallet balance')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateWallet = async (walletData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await axiosInstance.put('/api/user/wallet', walletData)

      if (response.data && response.data) {
        setUserWallet(response.data.body)
      }

      return response.data
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update wallet')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUserData = async () => {
    if (isAuthenticated) {
      await getUserData()
    } else {
      setUserData(null)
      setUserWallet(null)
    }
  }

  // const updateLocalWalletBalance = async (userData, balance) => {
  //   if (!userData?.uid) {
  //     ////console.log("[updateLocalWalletBalance] No user found")
  //     return 0
  //   }

  //   // try {
  //   //   const updateRequest = {
  //   //     uid: userData.uid,
  //   //     amount: balance,
  //   //   };

  //   //   ////console.log("[updateLocalWalletBalance] Updating wallet with amount:", balance);
  //   //   const response = await axiosInstance.post(`${domain}/api/api-wrapper/update-wallet`, updateRequest);

  //   //   if (response.data.success) {
  //       ////console.log("[updateLocalWalletBalance] Local wallet updated successfully:", response.data);
  //       setUserWallet(response.data.ThirdPartyWalletAmount);
  //   //   } else {
  //   //     console.error("[updateLocalWalletBalance] Failed to update local wallet:", response.data.message);
  //   //   }
  //   // } catch (err) {
  //   //   console.error("[updateLocalWalletBalance] Error updating local wallet:", err);
  //   // }
  // };

  // Add visibility change listener to check flag when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated && userData?.uid) {
        refreshUserData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userData?.uid, isAuthenticated]);

  // Clear user data on unmount
  useEffect(() => {
    return () => {
      setUserData(null)
      setUserWallet(null)
      setError(null)
    }
  }, [])

  const clearUserData = () => {
    setUserData(null)
    setUserWallet(null)
    setError(null)
  }

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        userWallet,
        getWalletBalance,
        setUserWallet,
        getUserData,
        updateWallet,
        refreshUserData,
        clearUserData,
        accountType,
        isLoading,
        error,
        getThirdPartyBalance,
        fetchThirdPartyBalance,
      }} >
      {children}
    </UserContext.Provider>
  )
}

export default UserState