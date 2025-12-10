// ==========================================
// Dynamic Spin Event Usage Example
// Location: src/examples/DynamicSpinEventUsageExample.jsx
// ==========================================

import React, { useState, useEffect } from 'react';
import { useDynamicSpinEventAdmin } from '../hooks/useDynamicSpinEventAdmin';

/**
 * Example component showing how to use the Dynamic Spin Event Admin Hook
 * This follows your AuthContext pattern with axiosInstance
 */
const DynamicSpinEventUsageExample = () => {
  // Use the hook - it automatically gets axiosInstance from AuthContext
  const {
    // API Methods
    getConfiguration,
    saveConfiguration,
    getStatistics,
    getBonusRequests,
    approveBonus,
    rejectBonus,
    
    // Utility Methods
    validateConfiguration,
    formatCurrency,
    formatDate,
    
    // Auth State
    isDemoAdmin,
    checkDemoAdminRestriction
  } = useDynamicSpinEventAdmin();

  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load configuration on component mount
  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    setLoading(true);
    try {
      const response = await getConfiguration();
      
      if (response.success) {
        setConfig(response.data);
        setMessage('✅ Configuration loaded successfully!');
      } else {
        setMessage('❌ ' + response.message);
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfiguration = async () => {
    // Demo admin check is built into the hook
    if (!config) return;

    setLoading(true);
    try {
      const response = await saveConfiguration(config);
      
      if (response.success) {
        setMessage('✅ Configuration saved successfully!');
      } else {
        setMessage('❌ ' + response.message);
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadStatistics = async () => {
    setLoading(true);
    try {
      const response = await getStatistics();
      
      if (response.success) {
        console.log('📊 Statistics:', response.data);
        setMessage('✅ Statistics loaded! Check console.');
      } else {
        setMessage('❌ ' + response.message);
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBonusExample = async () => {
    // Example: Approve bonus request ID 1 with amount 100
    const response = await approveBonus(1, 100);
    
    if (response.success) {
      setMessage('✅ Bonus approved successfully!');
    } else {
      setMessage('❌ ' + response.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎰 Dynamic Spin Event Admin - Usage Example</h1>
      
      {/* Demo Admin Status */}
      {isDemoAdmin && (
        <div style={{ 
          background: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          padding: '10px', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          🎭 <strong>Demo Mode Active</strong> - Some features may be restricted
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ color: '#007bff', marginBottom: '10px' }}>
          ⏳ Loading...
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px',
          borderRadius: '5px',
          background: message.includes('✅') ? '#d4edda' : '#f8d7da',
          border: message.includes('✅') ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
        }}>
          {message}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={loadConfiguration}
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 15px' }}
        >
          📥 Load Configuration
        </button>
        
        <button 
          onClick={handleSaveConfiguration}
          disabled={loading || !config}
          style={{ marginRight: '10px', padding: '10px 15px' }}
        >
          💾 Save Configuration
        </button>
        
        <button 
          onClick={handleLoadStatistics}
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 15px' }}
        >
          📊 Load Statistics
        </button>
        
        <button 
          onClick={handleApproveBonusExample}
          disabled={loading}
          style={{ padding: '10px 15px' }}
        >
          ✅ Approve Bonus (Example)
        </button>
      </div>

      {/* Configuration Display */}
      {config && (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '5px',
          marginTop: '20px'
        }}>
          <h3>📋 Current Configuration:</h3>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      )}

      {/* Usage Instructions */}
      <div style={{ 
        background: '#e7f3ff', 
        padding: '15px', 
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        <h3>🔧 How to Use:</h3>
        <ol>
          <li><strong>Import the hook:</strong> <code>import {`{ useDynamicSpinEventAdmin }`} from '../hooks/useDynamicSpinEventAdmin';</code></li>
          <li><strong>Use in component:</strong> <code>const dynamicSpinAdmin = useDynamicSpinEventAdmin();</code></li>
          <li><strong>Call methods:</strong> <code>await dynamicSpinAdmin.getConfiguration();</code></li>
          <li><strong>Demo admin checks:</strong> Built-in restrictions for demo users</li>
          <li><strong>AuthContext integration:</strong> Uses your existing axiosInstance automatically</li>
        </ol>
      </div>

      {/* Available Methods */}
      <div style={{ 
        background: '#f0f8ff', 
        padding: '15px', 
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        <h3>🛠️ Available Methods:</h3>
        <ul>
          <li><code>getConfiguration()</code> - Load current config</li>
          <li><code>saveConfiguration(configData)</code> - Save new config</li>
          <li><code>updateConfiguration(id, configData)</code> - Update existing config</li>
          <li><code>getStatistics()</code> - Load admin statistics</li>
          <li><code>getBonusRequests(page, limit, status)</code> - Get bonus requests</li>
          <li><code>approveBonus(requestId, amount)</code> - Approve bonus</li>
          <li><code>rejectBonus(requestId, reason)</code> - Reject bonus</li>
          <li><code>validateConfiguration(config)</code> - Validate config data</li>
          <li><code>formatCurrency(amount)</code> - Format currency</li>
          <li><code>formatDate(date)</code> - Format date</li>
        </ul>
      </div>
    </div>
  );
};

export default DynamicSpinEventUsageExample;
