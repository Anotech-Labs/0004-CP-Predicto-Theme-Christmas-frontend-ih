// ==========================================
// Dynamic Spin Event User Service
// Location: src/services/dynamicSpinEventService.js
// ==========================================

import axiosInstance from '../utils/axiosInstance';

class DynamicSpinEventService {
  
  // ==========================================
  // 🎯 PUBLIC ENDPOINTS (No Auth Required)
  // ==========================================

  /**
   * Get public configuration
   */
  async getPublicConfig() {
    try {
      const response = await axiosInstance.get('/api/activity/dynamic-spin-event/public/config');
      return {
        success: true,
        data: response.data.data || null,
        message: response.data.message || 'Configuration retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch configuration'
      };
    }
  }

  // ==========================================
  // 🎯 USER ENDPOINTS (Auth Required)
  // ==========================================

  /**
   * Get user statistics and progress
   */
  async getUserStats() {
    try {
      const response = await axiosInstance.get('/api/activity/dynamic-spin-event/user/stats');
      return {
        success: true,
        data: response.data.data || {},
        message: response.data.message || 'User stats retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: {},
        message: error.response?.data?.message || 'Failed to fetch user stats'
      };
    }
  }

  /**
   * Check magic box eligibility
   */
  async checkMagicBoxEligibility() {
    try {
      const response = await axiosInstance.get('/api/activity/dynamic-spin-event/magic-box/eligibility');
      return {
        success: true,
        data: response.data.data || { eligible: false },
        message: response.data.message || 'Eligibility checked successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: { eligible: false },
        message: error.response?.data?.message || 'Failed to check eligibility'
      };
    }
  }

  /**
   * Claim magic box reward
   */
  async claimMagicBox(selectedRewardId, rewardAmount) {
    try {
      const response = await axiosInstance.post('/api/activity/dynamic-spin-event/magic-box/claim', {
        selectedRewardId,
        rewardAmount
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Magic box claimed successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to claim magic box'
      };
    }
  }

  /**
   * Perform spin
   */
  async performSpin() {
    try {
      const response = await axiosInstance.post('/api/activity/dynamic-spin-event/spin');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Spin completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to perform spin'
      };
    }
  }

  /**
   * Get user history
   */
  async getUserHistory(page = 1, limit = 20) {
    try {
      const response = await axiosInstance.get(`/api/activity/dynamic-spin-event/user/history?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data.data || { history: [], pagination: {} },
        message: response.data.message || 'History retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: { history: [], pagination: {} },
        message: error.response?.data?.message || 'Failed to fetch history'
      };
    }
  }

  /**
   * Request bonus payout
   */
  async requestBonus(requestedAmount, targetAmount, actualAmount) {
    try {
      const response = await axiosInstance.post('/api/activity/dynamic-spin-event/bonus/request', {
        requestedAmount,
        targetAmount,
        actualAmount
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Bonus request submitted successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to submit bonus request'
      };
    }
  }

  // ==========================================
  // 🛠️ UTILITY METHODS
  // ==========================================

  /**
   * Format currency
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount || 0);
  }

  /**
   * Format date
   */
  formatDate(date) {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Calculate progress percentage
   */
  calculateProgress(current, target) {
    if (!target || target <= 0) return 0;
    return Math.min((current / target) * 100, 100);
  }

  /**
   * Generate magic box items based on target amount
   */
  generateMagicBoxItems(targetAmount = 500) {
    return [
      { 
        id: 1, 
        amount: Math.floor(targetAmount * 0.6), 
        label: `₹${Math.floor(targetAmount * 0.6)}`,
        percentage: 60
      },
      { 
        id: 2, 
        amount: Math.floor(targetAmount * 0.4), 
        label: `₹${Math.floor(targetAmount * 0.4)}`,
        percentage: 40
      },
      { 
        id: 3, 
        amount: Math.floor(targetAmount * 0.8), 
        label: `₹${Math.floor(targetAmount * 0.8)}`,
        percentage: 80
      },
      { 
        id: 4, 
        amount: Math.floor(targetAmount * 0.3), 
        label: `₹${Math.floor(targetAmount * 0.3)}`,
        percentage: 30
      },
    ];
  }

  /**
   * Check if user needs to refer friends for more spins
   */
  checkReferralRequirement(availableSpins, config) {
    if (availableSpins > 0) {
      return {
        needsReferral: false,
        message: `You have ${availableSpins} spins available`
      };
    }

    return {
      needsReferral: true,
      message: `No spins available. Refer friends who deposit ₹${config?.minDepositForReferralSpin || 100} to get more spins!`
    };
  }
}

export default new DynamicSpinEventService();
