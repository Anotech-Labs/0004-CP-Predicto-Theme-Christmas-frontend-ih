// ==========================================
// Dynamic Spin Event Admin Service
// Location: src/services/dynamicSpinEventAdminService.js
// ==========================================

class DynamicSpinEventAdminService {
  constructor(axiosInstance) {
    this.apiClient = axiosInstance;
  }
  // ==========================================
  // 🎯 CONFIGURATION MANAGEMENT
  // ==========================================

  /**
   * Get current configuration
   */
  async getConfiguration() {
    try {
      const response = await this.apiClient.get('/api/admin/dynamic-spin-event/config');
      let configData = response.data.data || null;
      
      // If config exists but spin wheel rewards are missing or invalid, create defaults
      if (configData && (!configData.spinWheelRewards || configData.spinWheelRewards.length !== 8)) {
        console.log('🛠️ [ADMIN-SERVICE] Fixing missing or invalid spin wheel rewards');
        
        configData.spinWheelRewards = [
          { position: 1, rewardAmount: 10, probability: 30, displayLabel: "₹10", rewardType: "CASH", isActive: true },
          { position: 2, rewardAmount: 20, probability: 25, displayLabel: "₹20", rewardType: "CASH", isActive: true },
          { position: 3, rewardAmount: 30, probability: 15, displayLabel: "₹30", rewardType: "CASH", isActive: true },
          { position: 4, rewardAmount: 50, probability: 12, displayLabel: "₹50", rewardType: "CASH", isActive: true },
          { position: 5, rewardAmount: 75, probability: 8, displayLabel: "₹75", rewardType: "CASH", isActive: true },
          { position: 6, rewardAmount: 100, probability: 5, displayLabel: "₹100", rewardType: "CASH", isActive: true },
          { position: 7, rewardAmount: 150, probability: 3, displayLabel: "₹150", rewardType: "CASH", isActive: true },
          { position: 8, rewardAmount: 200, probability: 2, displayLabel: "₹200", rewardType: "CASH", isActive: true }
        ];
      }
      
      return {
        success: true,
        data: configData,
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

  /**
   * Create or update configuration
   */
  async saveConfiguration(configData) {
    try {
      console.log('📤 [ADMIN-SERVICE] Preparing to save configuration:', {
        eventName: configData.eventName,
        minDepositToUnlock: configData.minDepositToUnlock,
        targetBonusAmount: configData.targetBonusAmount,
        spinWheelRewardsCount: configData.spinWheelRewards?.length,
        magicBoxEnabled: configData.magicBoxEnabled,
        magicBoxRewardsCount: configData.magicBoxRewards?.length
      });

      // Validate spin wheel rewards (must be exactly 8)
      if (!configData.spinWheelRewards || configData.spinWheelRewards.length !== 8) {
        throw new Error('Spin wheel must have exactly 8 reward sections');
      }

      // Validate probabilities sum to 100 (with tolerance for floating point errors)
      const totalProbability = configData.spinWheelRewards.reduce((sum, reward) => {
        const prob = parseFloat(reward.probability || 0);
        return sum + (isNaN(prob) ? 0 : prob);
      }, 0);
      
      if (Math.abs(totalProbability - 100) > 1) { // Allow 1% tolerance for floating point errors
        throw new Error(`Total probability must equal 100%. Current total: ${totalProbability.toFixed(2)}%`);
      }

      // Ensure positions are 1-8 and convert to proper numbers
      configData.spinWheelRewards = configData.spinWheelRewards.map((reward, index) => ({
        ...reward,
        position: index + 1,
        rewardAmount: parseFloat(reward.rewardAmount || 0),
        probability: parseFloat(reward.probability || 0),
        isActive: reward.isActive !== false
      }));

      // Ensure all numeric fields are properly converted
      const payload = {
        ...configData,
        minDepositToUnlock: parseFloat(configData.minDepositToUnlock || 0),
        targetBonusAmount: parseFloat(configData.targetBonusAmount || 0),
        minDepositForReferralSpin: parseFloat(configData.minDepositForReferralSpin || 0),
        bonusWageringMultiplier: parseFloat(configData.bonusWageringMultiplier || 1),
        cycleDurationDays: parseInt(configData.cycleDurationDays || 1),
        spinsPerDay: parseInt(configData.spinsPerDay || 1),
        lowRewardBias: parseFloat(configData.lowRewardBias || 3.0),
        highRewardBias: parseFloat(configData.highRewardBias || 0.3)
      };

      console.log('📤 [ADMIN-SERVICE] Sending payload to API');

      const response = await this.apiClient.post('/api/admin/dynamic-spin-event/config', payload);
      
      console.log('✅ [ADMIN-SERVICE] Configuration saved successfully');
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Configuration saved successfully'
      };
    } catch (error) {
      console.error('❌ [ADMIN-SERVICE] Save configuration failed:', error.response?.data || error.message);
      return {
        success: false,
        data: null,
        message: error.response?.data?.error || error.message || 'Failed to save configuration'
      };
    }
  }

  /**
   * Update existing configuration
   */
  async updateConfiguration(configId, configData) {
    try {
      const response = await this.apiClient.put(`/api/admin/dynamic-spin-event/config/${configId}`, configData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Configuration updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update configuration'
      };
    }
  }

  // ==========================================
  // 📊 STATISTICS & ANALYTICS
  // ==========================================

  /**
   * Get admin statistics
   */
  async getStatistics() {
    try {
      const response = await this.apiClient.get('/api/admin/dynamic-spin-event/statistics');
      return {
        success: true,
        data: response.data.data || {},
        message: response.data.message || 'Statistics retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: {},
        message: error.response?.data?.message || 'Failed to fetch statistics'
      };
    }
  }

  // ==========================================
  // 💰 BONUS REQUEST MANAGEMENT
  // ==========================================

  /**
   * Get bonus requests with pagination and filtering
   */
  async getBonusRequests(page = 1, limit = 20, status = 'ALL') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (status && status !== 'ALL') {
        params.append('status', status);
      }

      const response = await this.apiClient.get(`/api/admin/dynamic-spin-event/bonus/requests?${params}`);
      return {
        success: true,
        data: response.data.data || { requests: [], pagination: {} },
        message: response.data.message || 'Bonus requests retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: { requests: [], pagination: {} },
        message: error.response?.data?.message || 'Failed to fetch bonus requests'
      };
    }
  }

  /**
   * Approve bonus request
   */
  async approveBonus(requestId, approvedAmount) {
    try {
      const response = await this.apiClient.post('/api/admin/dynamic-spin-event/bonus/approve', {
        requestId,
        approvedAmount: parseFloat(approvedAmount)
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Bonus approved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to approve bonus'
      };
    }
  }

  /**
   * Reject bonus request
   */
  async rejectBonus(requestId, rejectionReason) {
    try {
      const response = await this.apiClient.post('/api/admin/dynamic-spin-event/bonus/reject', {
        requestId,
        rejectionReason
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Bonus rejected successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to reject bonus'
      };
    }
  }

  // ==========================================
  // 🛠️ UTILITY METHODS
  // ==========================================

  /**
   * Get empty configuration template (for initial setup only)
   * NO DEFAULT VALUES - Admin must configure everything via DB
   */
  getEmptyConfiguration() {
    return {
      eventName: '',
      isActive: false,
      minDepositToUnlock: 0,
      targetBonusAmount: 0,
      minDepositForReferralSpin: 0,
      bonusWageringMultiplier: 0,
      cycleDurationDays: 0,
      spinsPerDay: 0,
      magicBoxEnabled: false,
      magicBoxRewards: [],
      lowRewardBias: 0,
      highRewardBias: 0,
      spinWheelRewards: []
    };
  }

  /**
   * Validate configuration data
   */
  validateConfiguration(config) {
    const errors = [];

    // Basic validation
    if (!config.eventName || config.eventName.trim().length < 3) {
      errors.push('Event name must be at least 3 characters long');
    }

    if (!config.minDepositToUnlock || config.minDepositToUnlock < 1) {
      errors.push('Minimum deposit must be at least ₹1');
    }

    if (!config.targetBonusAmount || config.targetBonusAmount < config.minDepositToUnlock) {
      errors.push('Target bonus amount must be greater than minimum deposit');
    }

    if (!config.cycleDurationDays || config.cycleDurationDays < 1 || config.cycleDurationDays > 30) {
      errors.push('Cycle duration must be between 1 and 30 days');
    }

    if (!config.spinsPerDay || config.spinsPerDay < 1 || config.spinsPerDay > 10) {
      errors.push('Spins per day must be between 1 and 10');
    }

    // Magic box rewards validation (4 rewards)
    if (config.magicBoxEnabled) {
      if (!config.magicBoxRewards || config.magicBoxRewards.length !== 4) {
        errors.push('Magic box must have exactly 4 reward options');
      } else {
        const totalMagicBoxProbability = config.magicBoxRewards.reduce((sum, reward) => sum + parseFloat(reward.probability || 0), 0);
        if (Math.abs(totalMagicBoxProbability - 100) > 0.01) {
          errors.push(`Magic box probabilities must equal 100%. Current: ${totalMagicBoxProbability.toFixed(2)}%`);
        }

        config.magicBoxRewards.forEach((reward, index) => {
          if (!reward.amount || reward.amount < 0) {
            errors.push(`Magic box reward ${index + 1}: Amount must be greater than 0`);
          }
          if (!reward.probability || reward.probability < 0 || reward.probability > 100) {
            errors.push(`Magic box reward ${index + 1}: Probability must be between 0 and 100`);
          }
        });
      }
    }

    // Spin wheel rewards validation
    if (!config.spinWheelRewards || config.spinWheelRewards.length !== 8) {
      errors.push('Spin wheel must have exactly 8 reward sections');
    } else {
      const totalProbability = config.spinWheelRewards.reduce((sum, reward) => {
        const prob = parseFloat(reward.probability || 0);
        return sum + (isNaN(prob) ? 0 : prob);
      }, 0);
      
      if (Math.abs(totalProbability - 100) > 1) { // Allow 1% tolerance
        errors.push(`Total probability must equal 100%. Current: ${totalProbability.toFixed(2)}%`);
      }

      config.spinWheelRewards.forEach((reward, index) => {
        if (!reward.rewardAmount || reward.rewardAmount < 0) {
          errors.push(`Reward ${index + 1}: Amount must be greater than 0`);
        }
        if (!reward.probability || reward.probability < 0 || reward.probability > 100) {
          errors.push(`Reward ${index + 1}: Probability must be between 0 and 100`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

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
   * Calculate probability distribution with bias
   */
  calculateBiasedProbabilities(rewards, lowBias = 3.0, highBias = 0.3) {
    const biasedRewards = rewards.map(reward => {
      const amount = parseFloat(reward.rewardAmount || 0);
      let bias = 1.0;
      
      if (amount <= 50) {
        bias = lowBias; // Increase probability for low rewards
      } else if (amount >= 500) {
        bias = highBias; // Decrease probability for high rewards
      }
      
      return {
        ...reward,
        biasedProbability: (parseFloat(reward.probability || 0) * bias)
      };
    });

    // Normalize to 100%
    const totalBiased = biasedRewards.reduce((sum, reward) => sum + reward.biasedProbability, 0);
    return biasedRewards.map(reward => ({
      ...reward,
      actualProbability: totalBiased > 0 ? (reward.biasedProbability / totalBiased) * 100 : 0
    }));
  }
}

// Export factory function to create service instance with axiosInstance
export const createDynamicSpinEventAdminService = (axiosInstance) => {
  return new DynamicSpinEventAdminService(axiosInstance);
};

export default DynamicSpinEventAdminService;
