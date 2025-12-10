import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';

export const useProfitLoss = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { axiosInstance } = useAuth();

    const fetchProfitLoss = async (filter, customStartDate, customEndDate, userId = '') => {
        try {
            setLoading(true);
            setError(null);
            
            // Start building the base URL
            let url = `/api/admin/profit-loss?filter=${filter}`;
            
            // Add custom date parameters only if filter is 'custom' and both dates are present
            if (filter === 'custom') {
                if (!customStartDate || !customEndDate) {
                    throw new Error('Both start date and end date are required for custom filter');
                }
                // Format dates properly
                url += `&customStartDate=${customStartDate}&customEndDate=${customEndDate}`;
            }
            
            // Add userId if present
            if (userId && userId.trim()) {
                url += `&userId=${userId.trim()}`;
            }

            //console.log('Fetching data from:', url); // Debug log

            const response = await axiosInstance.get(url);
            setData(response.data);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch profit/loss data';
            setError(errorMessage);
            console.error('Profit/Loss fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, fetchProfitLoss };
};