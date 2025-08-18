import { useState, useEffect } from 'react';
import { healthAPI } from '../services/api';
import { config } from '../config/env';

const ApiTest = () => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setStatus('loading');
    setError(null);
    
    try {
      const response = await healthAPI.check();
      setData(response);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">API Connection Test</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <strong>Backend URL:</strong> {config.API_BASE_URL}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Backend Port:</strong> {config.BACKEND_PORT}
        </p>
      </div>

      <div className="mb-4">
        <button
          onClick={testConnection}
          disabled={status === 'loading'}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {status === 'loading' ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      {status === 'loading' && (
        <div className="text-blue-600">Testing API connection...</div>
      )}

      {status === 'success' && data && (
        <div className="text-green-600">
          <p>✅ API Connection Successful!</p>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {status === 'error' && error && (
        <div className="text-red-600">
          <p>❌ API Connection Failed</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ApiTest; 