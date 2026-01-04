import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin, register as apiRegister } from '../api/authApi';
import { getTenants } from '../api/tenantApi';
import type { Tenant } from '../types/index';
import '../styles/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const userData = await apiLogin(email);
        login(userData);
      } else {
        const userData = await apiRegister(email, name, tenantName || undefined);
        login(userData);
      }
    } catch (err) {
      setError(mode === 'login' ? 'Login failed. Please check your email.' : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (mode === 'register') {
      getTenants()
        .then(setTenants)
        .catch(() => setTenants([]));
    }
  }, [mode]);

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Communication Hub</h1>
        <div className="toggle-row">
          <button
            type="button"
            className={`toggle-button ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`toggle-button ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="login-input"
            />
          )}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          {mode === 'register' && (
            <select
              className="login-input"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
            >
              <option value="">Create or join tenant</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          )}
          <button type="submit" disabled={loading} className="login-button">
            {loading ? (mode === 'login' ? 'Logging in...' : 'Registering...') : mode === 'login' ? 'Login' : 'Register'}
          </button>
          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
