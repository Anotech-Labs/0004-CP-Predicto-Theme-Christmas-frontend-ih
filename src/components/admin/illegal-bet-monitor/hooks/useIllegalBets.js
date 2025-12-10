import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../context/AuthContext';

export const useIllegalBets = () => {
  const { axiosInstance } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    gameType: '',
    startDate: today,
    endDate: '2030-12-31',
    minIllegalBets: '',
    search: '',
    sortOrder: 'desc'
  });

  const fetchIllegalBets = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await axiosInstance.get(
        `/api/admin/illegal-bets/users?${params}`
      );
      setData(response.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters, axiosInstance]);

  useEffect(() => {
    fetchIllegalBets();
  }, [fetchIllegalBets]);

  return { data, loading, error, filters, setFilters, refetch: fetchIllegalBets };
};