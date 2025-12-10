// ==========================================
// Dynamic Spin Event Admin Hook
// Location: src/hooks/useDynamicSpinEventAdmin.js
// ==========================================

import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { createDynamicSpinEventAdminService } from '../services/dynamicSpinEventAdminService';

/**
 * Custom hook for Dynamic Spin Event Admin operations
 * Uses AuthContext's axiosInstance for all API calls
 */
export const useDynamicSpinEventAdmin = () => {
  const { axiosInstance, isDemoAdmin, checkDemoAdminRestriction } = useAuth();

  // Create service instance with AuthContext's axiosInstance
  const adminService = useMemo(() => {
    return createDynamicSpinEventAdminService(axiosInstance);
  }, [axiosInstance]);

  // Wrapper functions that include demo admin checks
  const getConfiguration = async () => {
    try {
      return await adminService.getConfiguration();
    } catch (error) {
      console.error('❌ [HOOK] Get configuration failed:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to fetch configuration'
      };
    }
  };

  const saveConfiguration = async (configData) => {
    // Check demo admin restrictions for save operations
    if (!checkDemoAdminRestriction('save Dynamic Spin Event configuration')) {
      return {
        success: false,
        data: null,
        message: 'Demo admin access restricted'
      };
    }

    try {
      return await adminService.saveConfiguration(configData);
    } catch (error) {
      console.error('❌ [HOOK] Save configuration failed:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to save configuration'
      };
    }
  };

  const updateConfiguration = async (configId, configData) => {
    // Check demo admin restrictions for update operations
    if (!checkDemoAdminRestriction('update Dynamic Spin Event configuration')) {
      return {
        success: false,
        data: null,
        message: 'Demo admin access restricted'
      };
    }

    try {
      return await adminService.updateConfiguration(configId, configData);
    } catch (error) {
      console.error('❌ [HOOK] Update configuration failed:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to update configuration'
      };
    }
  };

  const getStatistics = async () => {
    try {
      return await adminService.getStatistics();
    } catch (error) {
      console.error('❌ [HOOK] Get statistics failed:', error);
      return {
        success: false,
        data: {},
        message: error.message || 'Failed to fetch statistics'
      };
    }
  };

  const getBonusRequests = async (page = 1, limit = 20, status = 'ALL') => {
    try {
      return await adminService.getBonusRequests(page, limit, status);
    } catch (error) {
      console.error('❌ [HOOK] Get bonus requests failed:', error);
      return {
        success: false,
        data: { requests: [], pagination: {} },
        message: error.message || 'Failed to fetch bonus requests'
      };
    }
  };

  const approveBonus = async (requestId, approvedAmount) => {
    // Check demo admin restrictions for approve operations
    if (!checkDemoAdminRestriction('approve bonus requests')) {
      return {
        success: false,
        data: null,
        message: 'Demo admin access restricted'
      };
    }

    try {
      return await adminService.approveBonus(requestId, approvedAmount);
    } catch (error) {
      console.error('❌ [HOOK] Approve bonus failed:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to approve bonus'
      };
    }
  };

  const rejectBonus = async (requestId, rejectionReason) => {
    // Check demo admin restrictions for reject operations
    if (!checkDemoAdminRestriction('reject bonus requests')) {
      return {
        success: false,
        data: null,
        message: 'Demo admin access restricted'
      };
    }

    try {
      return await adminService.rejectBonus(requestId, rejectionReason);
    } catch (error) {
      console.error('❌ [HOOK] Reject bonus failed:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to reject bonus'
      };
    }
  };

  // Utility functions from the service
  const validateConfiguration = (config) => {
    return adminService.validateConfiguration(config);
  };

  const formatCurrency = (amount) => {
    return adminService.formatCurrency(amount);
  };

  const formatDate = (date) => {
    return adminService.formatDate(date);
  };

  const calculateBiasedProbabilities = (rewards, lowBias, highBias) => {
    return adminService.calculateBiasedProbabilities(rewards, lowBias, highBias);
  };

  const getEmptyConfiguration = () => {
    return adminService.getEmptyConfiguration();
  };

  return {
    // API Methods
    getConfiguration,
    saveConfiguration,
    updateConfiguration,
    getStatistics,
    getBonusRequests,
    approveBonus,
    rejectBonus,
    
    // Utility Methods
    validateConfiguration,
    formatCurrency,
    formatDate,
    calculateBiasedProbabilities,
    getEmptyConfiguration,
    
    // Auth State
    isDemoAdmin,
    checkDemoAdminRestriction
  };
};

export default useDynamicSpinEventAdmin;
