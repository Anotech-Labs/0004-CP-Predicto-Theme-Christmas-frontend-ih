// ==========================================
// Dynamic Spin Event Configuration Panel
// Location: src/components/dynamicSpinEvent/admin/ConfigurationPanel.jsx
// ==========================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  Chip,
  LinearProgress,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Casino as CasinoIcon,
  MonetizationOn as MoneyIcon,
  Schedule as ScheduleIcon,
  CardGiftcard as GiftIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import dynamicSpinEventAdminService from '../../../services/dynamicSpinEventAdminService';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1e293b',
  color: '#ffffff',
  padding: theme.spacing(3),
  borderRadius: 16,
  marginBottom: theme.spacing(3),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#334155',
  color: '#ffffff',
  borderRadius: 12,
  '& .MuiCardHeader-root': {
    backgroundColor: '#475569',
    color: '#ffffff',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#475569',
    color: '#ffffff',
    '& fieldset': {
      borderColor: '#64748b',
    },
    '&:hover fieldset': {
      borderColor: '#3b82f6',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#94a3b8',
    '&.Mui-focused': {
      color: '#3b82f6',
    },
  },
  '& .MuiInputAdornment-root': {
    color: '#94a3b8',
  },
}));

const RewardCard = styled(Card)(({ theme, position }) => ({
  backgroundColor: '#475569',
  color: '#ffffff',
  borderRadius: 12,
  border: '2px solid transparent',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#3b82f6',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)',
  },
  '& .MuiCardHeader-root': {
    backgroundColor: `hsl(${(position - 1) * 45}, 70%, 50%)`,
    color: '#ffffff',
    padding: theme.spacing(1.5),
  },
}));

const ProbabilityBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: '#64748b',
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
  },
}));

const ConfigurationPanel = ({ configData, onConfigurationSaved, showNotification }) => {
  // State management - ALL VALUES FROM API/DB
  const [formData, setFormData] = useState({
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
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [totalProbability, setTotalProbability] = useState(0);

  // Initialize form data - ONLY FROM API/DB
  useEffect(() => {
    if (configData) {
      // Parse magicBoxRewards if it's a string from DB
      let parsedMagicBoxRewards = configData.magicBoxRewards;
      if (typeof configData.magicBoxRewards === 'string') {
        try {
          parsedMagicBoxRewards = JSON.parse(configData.magicBoxRewards);
        } catch (e) {
          parsedMagicBoxRewards = [];
        }
      }

      setFormData({
        ...configData,
        magicBoxRewards: parsedMagicBoxRewards || [],
        spinWheelRewards: configData.spinWheelRewards || []
      });
    }
    // NO DEFAULT CONFIG - Admin must set up everything via API
  }, [configData]);

  // Calculate total probability whenever rewards change
  useEffect(() => {
    const total = formData.spinWheelRewards.reduce((sum, reward) => {
      return sum + parseFloat(reward.probability || 0);
    }, 0);
    setTotalProbability(total);
  }, [formData.spinWheelRewards]);

  // Initialize empty reward structures if needed
  useEffect(() => {
    // Initialize 8 empty spin wheel rewards if none exist
    if (formData.spinWheelRewards.length === 0 && !configData) {
      const emptyRewards = Array.from({ length: 8 }, (_, index) => ({
        position: index + 1,
        rewardAmount: 0,
        rewardType: 'CASH',
        probability: 0,
        displayLabel: '',
        isActive: true
      }));
      setFormData(prev => ({
        ...prev,
        spinWheelRewards: emptyRewards
      }));
    }

    // Initialize 4 empty magic box rewards if none exist
    if (formData.magicBoxRewards.length === 0 && !configData) {
      const emptyMagicBoxRewards = Array.from({ length: 4 }, (_, index) => ({
        id: index + 1,
        amount: 0,
        label: '',
        probability: 0
      }));
      setFormData(prev => ({
        ...prev,
        magicBoxRewards: emptyMagicBoxRewards
      }));
    }
  }, [configData, formData.spinWheelRewards.length, formData.magicBoxRewards.length]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleRewardChange = (index, field, value) => {
    const updatedRewards = [...formData.spinWheelRewards];
    updatedRewards[index] = {
      ...updatedRewards[index],
      [field]: field === 'rewardAmount' || field === 'probability' ? parseFloat(value) || 0 : value
    };
    
    setFormData(prev => ({
      ...prev,
      spinWheelRewards: updatedRewards
    }));
  };

  const validateForm = () => {
    const validation = dynamicSpinEventAdminService.validateConfiguration(formData);
    setErrors(validation.errors.reduce((acc, error) => {
      acc.general = acc.general ? `${acc.general}; ${error}` : error;
      return acc;
    }, {}));
    return validation.isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showNotification('Please fix validation errors before saving', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await dynamicSpinEventAdminService.saveConfiguration(formData);
      
      if (result.success) {
        onConfigurationSaved(result.data);
        showNotification(result.message, 'success');
      } else {
        showNotification(result.message, 'error');
      }
    } catch (error) {
      showNotification('Failed to save configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    // Reset to empty config - NO DEFAULTS
    const emptyConfig = dynamicSpinEventAdminService.getEmptyConfiguration();
    setFormData({
      ...emptyConfig,
      spinWheelRewards: Array.from({ length: 8 }, (_, index) => ({
        position: index + 1,
        rewardAmount: 0,
        rewardType: 'CASH',
        probability: 0,
        displayLabel: '',
        isActive: true
      })),
      magicBoxRewards: Array.from({ length: 4 }, (_, index) => ({
        id: index + 1,
        amount: 0,
        label: '',
        probability: 0
      }))
    });
    setErrors({});
    showNotification('Configuration cleared. Please fill in all values.', 'info');
  };

  const getProbabilityColor = () => {
    if (Math.abs(totalProbability - 100) < 0.01) return 'success';
    if (totalProbability > 100) return 'error';
    return 'warning';
  };

  return (
    <Box>
      {/* Validation Errors */}
      {errors.general && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.general}
        </Alert>
      )}

      {/* Basic Configuration */}
      <StyledPaper>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <ScheduleIcon sx={{ color: '#3b82f6' }} />
          <Typography variant="h6" fontWeight="bold">
            Basic Configuration
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              label="Event Name"
              value={formData.eventName}
              onChange={(e) => handleInputChange('eventName', e.target.value)}
              placeholder="e.g., Diwali Bonus Bonanza"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  color="primary"
                />
              }
              label="Event Active"
              sx={{ color: '#ffffff' }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <StyledTextField
              fullWidth
              label="Minimum Deposit to Unlock"
              type="number"
              value={formData.minDepositToUnlock}
              onChange={(e) => handleInputChange('minDepositToUnlock', parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <StyledTextField
              fullWidth
              label="Target Bonus Amount"
              type="number"
              value={formData.targetBonusAmount}
              onChange={(e) => handleInputChange('targetBonusAmount', parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <StyledTextField
              fullWidth
              label="Cycle Duration (Days)"
              type="number"
              value={formData.cycleDurationDays}
              onChange={(e) => handleInputChange('cycleDurationDays', parseInt(e.target.value) || 1)}
              inputProps={{ min: 1, max: 30 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              label="Spins Per Day"
              type="number"
              value={formData.spinsPerDay}
              onChange={(e) => handleInputChange('spinsPerDay', parseInt(e.target.value) || 1)}
              inputProps={{ min: 1, max: 10 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              label="Bonus Wagering Multiplier"
              type="number"
              value={formData.bonusWageringMultiplier}
              onChange={(e) => handleInputChange('bonusWageringMultiplier', parseFloat(e.target.value) || 1)}
              inputProps={{ min: 1, step: 0.1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">x</InputAdornment>,
              }}
            />
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Magic Box Configuration */}
      <StyledPaper>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <GiftIcon sx={{ color: '#10b981' }} />
          <Typography variant="h6" fontWeight="bold">
            Magic Box Configuration (4 Reward Options)
          </Typography>
          <Tooltip title="User will receive one random reward from these 4 options">
            <InfoIcon sx={{ color: '#94a3b8' }} />
          </Tooltip>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.magicBoxEnabled}
                  onChange={(e) => handleInputChange('magicBoxEnabled', e.target.checked)}
                  color="primary"
                />
              }
              label="Enable Magic Box"
              sx={{ color: '#ffffff' }}
            />
          </Grid>

          {/* Magic Box Rewards Grid - 4 Options */}
          {formData.magicBoxRewards && formData.magicBoxRewards.map((reward, index) => (
            <Grid item xs={12} sm={6} md={3} key={reward.id}>
              <StyledCard>
                <CardHeader
                  title={`Reward Option ${index + 1}`}
                  titleTypographyProps={{ variant: 'subtitle2', fontWeight: 'bold' }}
                  sx={{ py: 1, backgroundColor: '#10b981' }}
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Amount"
                        type="number"
                        size="small"
                        value={reward.amount || ''}
                        onChange={(e) => {
                          const updatedRewards = [...formData.magicBoxRewards];
                          updatedRewards[index] = { ...updatedRewards[index], amount: parseFloat(e.target.value) || 0 };
                          handleInputChange('magicBoxRewards', updatedRewards);
                        }}
                        disabled={!formData.magicBoxEnabled}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Probability"
                        type="number"
                        size="small"
                        value={reward.probability || ''}
                        onChange={(e) => {
                          const updatedRewards = [...formData.magicBoxRewards];
                          updatedRewards[index] = { ...updatedRewards[index], probability: parseFloat(e.target.value) || 0 };
                          handleInputChange('magicBoxRewards', updatedRewards);
                        }}
                        disabled={!formData.magicBoxEnabled}
                        inputProps={{ min: 0, max: 100, step: 1 }}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Display Label"
                        size="small"
                        value={reward.label || ''}
                        onChange={(e) => {
                          const updatedRewards = [...formData.magicBoxRewards];
                          updatedRewards[index] = { ...updatedRewards[index], label: e.target.value };
                          handleInputChange('magicBoxRewards', updatedRewards);
                        }}
                        disabled={!formData.magicBoxEnabled}
                        placeholder={`₹${reward.amount || 0}`}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}

          {/* Magic Box Probability Summary */}
          <Grid item xs={12}>
            <Alert 
              severity={formData.magicBoxRewards?.reduce((sum, r) => sum + (r.probability || 0), 0) === 100 ? 'success' : 'warning'}
              sx={{ backgroundColor: '#334155', color: '#ffffff' }}
            >
              <Typography variant="body2">
                Total Magic Box Probability: {formData.magicBoxRewards?.reduce((sum, r) => sum + (r.probability || 0), 0).toFixed(1)}% / 100%
                {formData.magicBoxRewards?.reduce((sum, r) => sum + (r.probability || 0), 0) !== 100 && 
                  ' (Must equal 100%)'}
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Spin Wheel Rewards - Exactly 8 Sections */}
      <StyledPaper>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <CasinoIcon sx={{ color: '#f59e0b' }} />
            <Typography variant="h6" fontWeight="bold">
              Spin Wheel Rewards (8 Sections)
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              label={`Total: ${totalProbability.toFixed(1)}%`}
              color={getProbabilityColor()}
              variant="filled"
            />
            <Tooltip title="Probabilities must sum to exactly 100%">
              <InfoIcon sx={{ color: '#94a3b8' }} />
            </Tooltip>
          </Box>
        </Box>

        {/* Probability Progress Bar */}
        <Box mb={3}>
          <ProbabilityBar
            variant="determinate"
            value={Math.min(totalProbability, 100)}
            color={getProbabilityColor()}
          />
          <Typography variant="caption" color="#94a3b8" sx={{ mt: 1, display: 'block' }}>
            Probability Distribution: {totalProbability.toFixed(1)}% / 100%
          </Typography>
        </Box>

        {/* Rewards Grid - Always 8 sections */}
        <Grid container spacing={2}>
          {formData.spinWheelRewards.slice(0, 8).map((reward, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <RewardCard position={index + 1}>
                <CardHeader
                  title={`Section ${index + 1}`}
                  titleTypographyProps={{ variant: 'subtitle2', fontWeight: 'bold' }}
                />
                <CardContent sx={{ pt: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Reward Amount"
                        type="number"
                        size="small"
                        value={reward.rewardAmount || ''}
                        onChange={(e) => handleRewardChange(index, 'rewardAmount', e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Probability"
                        type="number"
                        size="small"
                        value={reward.probability || ''}
                        onChange={(e) => handleRewardChange(index, 'probability', e.target.value)}
                        inputProps={{ min: 0, max: 100, step: 0.1 }}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Display Label"
                        size="small"
                        value={reward.displayLabel || ''}
                        onChange={(e) => handleRewardChange(index, 'displayLabel', e.target.value)}
                        placeholder={`₹${reward.rewardAmount || 0}`}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </RewardCard>
            </Grid>
          ))}
        </Grid>
      </StyledPaper>

      {/* Admin Bias Settings */}
      <StyledPaper>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <MoneyIcon sx={{ color: '#ef4444' }} />
          <Typography variant="h6" fontWeight="bold">
            Admin Bias Settings (Internal)
          </Typography>
          <Tooltip title="These settings adjust actual probabilities to favor the house">
            <InfoIcon sx={{ color: '#94a3b8' }} />
          </Tooltip>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              label="Low Reward Bias Multiplier"
              type="number"
              value={formData.lowRewardBias}
              onChange={(e) => handleInputChange('lowRewardBias', parseFloat(e.target.value) || 1)}
              inputProps={{ min: 1, step: 0.1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">x</InputAdornment>,
              }}
              helperText="Increases probability for rewards ≤ ₹50"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              label="High Reward Bias Multiplier"
              type="number"
              value={formData.highRewardBias}
              onChange={(e) => handleInputChange('highRewardBias', parseFloat(e.target.value) || 0.1)}
              inputProps={{ min: 0.1, max: 1, step: 0.1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">x</InputAdornment>,
              }}
              helperText="Decreases probability for rewards ≥ ₹500"
            />
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Action Buttons */}
      <Box display="flex" gap={2} justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={handleReset}
          startIcon={<RefreshIcon />}
          sx={{
            borderColor: '#64748b',
            color: '#94a3b8',
            '&:hover': {
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
            },
          }}
        >
          Reset to Defaults
        </Button>
        
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || Math.abs(totalProbability - 100) > 0.01}
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          sx={{
            backgroundColor: '#3b82f6',
            '&:hover': {
              backgroundColor: '#2563eb',
            },
            '&:disabled': {
              backgroundColor: '#64748b',
            },
          }}
        >
          {loading ? 'Saving...' : 'Save Configuration'}
        </Button>
      </Box>
    </Box>
  );
};

export default ConfigurationPanel;
