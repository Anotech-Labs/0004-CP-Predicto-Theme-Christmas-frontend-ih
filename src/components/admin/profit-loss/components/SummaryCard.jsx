import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export const SummaryCard = ({ title, value, subtitle, color = 'primary' }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom variant="body2">
          {title}
        </Typography>
        <Typography 
          variant="h5" 
          component="div" 
          color={`${color}.main`} 
          sx={{ mb: 1, fontWeight: 600 }}
        >
          {typeof value === 'number' ? value.toFixed(2) : value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
