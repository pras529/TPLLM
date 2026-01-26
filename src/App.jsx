 import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button, TextField, CircularProgress } from '@mui/material';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function App() {
  const [trafficData, setTrafficData] = useState(null);
  const [location, setLocation] = useState('13.08,80.27');
  const [time, setTime] = useState('2025-03-25 17:00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const requestPayload = useMemo(() => ({ location, time }), [location, time]);

  const fetchTrafficPrediction = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE}/predict`, requestPayload);
      setTrafficData(response.data);
    } catch (err) {
      setError('Unable to fetch traffic prediction. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrafficPrediction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      <header className="header">
        <img src="/tpllm_logo1.png" alt="TPLLM Logo" className="logo" />
        <div className="brand">
          <p className="eyebrow">Traffic Prediction</p>
          <h1 className="title">TPLLM Dashboard</h1>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="main"
      >
        <section className="card">
          <div className="card-head">
            <div>
              <p className="eyebrow">Live Forecast</p>
              <h2 className="subtitle">Predict congestion with your location and time.</h2>
            </div>
            <Button onClick={fetchTrafficPrediction} variant="contained" className="primary-btn">
              Predict Traffic
            </Button>
          </div>

          <div className="form-grid">
            <div className="field">
              <FaMapMarkerAlt className="field-icon" />
              <TextField
                fullWidth
                label="Location (lat,lon)"
                variant="outlined"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="field">
              <FaClock className="field-icon" />
              <TextField
                fullWidth
                label="Time (YYYY-MM-DD HH:MM)"
                variant="outlined"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </div>

          {loading && (
            <div className="status">
              <CircularProgress size={28} />
              <p>Fetching prediction...</p>
            </div>
          )}

          {error && <p className="error">{error}</p>}

          {!loading && !error && trafficData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="result"
            >
              <h3>Prediction</h3>
              <pre>{JSON.stringify(trafficData, null, 2)}</pre>
            </motion.div>
          )}

          {!loading && !error && !trafficData && <p className="muted">No data yet.</p>}
        </section>
      </motion.main>

      <footer className="footer">© 2025 TPLLM</footer>
    </div>
  );
}
