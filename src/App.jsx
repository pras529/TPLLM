import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button, TextField, CircularProgress } from '@mui/material';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function App() {
  const [trafficData, setTrafficData] = useState(null);
  const [location, setLocation] = useState('13.0827,80.2707');
  const [time, setTime] = useState('2025-03-25 17:00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [startQuery, setStartQuery] = useState('Chennai Central');
  const [destQuery, setDestQuery] = useState('Bengaluru MG Road');
  const [startCoords, setStartCoords] = useState({ label: 'Chennai Central', value: '13.0827,80.2707' });
  const [destCoords, setDestCoords] = useState({ label: 'Bengaluru MG Road', value: '12.9716,77.5946' });
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [routeData, setRouteData] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState('');

  const requestPayload = useMemo(() => ({ location, time }), [location, time]);

  useEffect(() => {
    setLocation(startCoords.value);
  }, [startCoords]);

  const fetchGeocode = async (text, setter) => {
    if (!text || text.length < 3) {
      setter([]);
      return;
    }
    try {
      const { data } = await axios.get(`${API_BASE}/geocode`, { params: { q: text, limit: 5 } });
      setter(data.results || []);
    } catch (err) {
      console.error('Geocode lookup failed', err);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => fetchGeocode(startQuery, setStartSuggestions), 300);
    return () => clearTimeout(id);
  }, [startQuery]);

  useEffect(() => {
    const id = setTimeout(() => fetchGeocode(destQuery, setDestSuggestions), 300);
    return () => clearTimeout(id);
  }, [destQuery]);

  const chooseStart = (result) => {
    setStartQuery(result.label);
    setStartCoords({ label: result.label, value: `${result.lat},${result.lon}` });
    setStartSuggestions([]);
  };

  const chooseDest = (result) => {
    setDestQuery(result.label);
    setDestCoords({ label: result.label, value: `${result.lat},${result.lon}` });
    setDestSuggestions([]);
  };

  const fetchRoute = async () => {
    if (!startCoords.value || !destCoords.value) return;
    setRouteLoading(true);
    setRouteError('');
    try {
      const { data } = await axios.get(`${API_BASE}/route`, {
        params: { start: startCoords.value, dest: destCoords.value },
      });
      setRouteData(data);
    } catch (err) {
      setRouteError('Unable to fetch live route.');
      console.error(err);
    }
    setRouteLoading(false);
  };

  useEffect(() => {
    fetchRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startCoords, destCoords]);

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

          <div className="journey-grid">
            <div>
              <div className="field">
                <FaMapMarkerAlt className="field-icon" />
                <TextField
                  fullWidth
                  label="Start location"
                  variant="outlined"
                  value={startQuery}
                  onChange={(e) => setStartQuery(e.target.value)}
                  placeholder="Type a place"
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              {startSuggestions.length > 0 && (
                <div className="suggestion-list">
                  {startSuggestions.map((s) => (
                    <button key={s.label} className="suggestion-item" onClick={() => chooseStart(s)}>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="field">
                <FaMapMarkerAlt className="field-icon" />
                <TextField
                  fullWidth
                  label="Destination"
                  variant="outlined"
                  value={destQuery}
                  onChange={(e) => setDestQuery(e.target.value)}
                  placeholder="Type a place"
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              {destSuggestions.length > 0 && (
                <div className="suggestion-list">
                  {destSuggestions.map((s) => (
                    <button key={s.label} className="suggestion-item" onClick={() => chooseDest(s)}>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="journey-meta">
            <div className="pill">
              <span className="pill-label">Distance</span>
              <strong>{routeData ? `${routeData.distance_km} km` : routeLoading ? 'Loading…' : '—'}</strong>
            </div>
            <div className="pill">
              <span className="pill-label">ETA</span>
              <strong>{routeData ? `${routeData.duration_min} min` : routeLoading ? 'Loading…' : '—'}</strong>
            </div>
            <div className="pill">
              <span className="pill-label">As of</span>
              <strong>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
            </div>
          </div>
          <div className="journey-actions">
            <Button variant="outlined" onClick={fetchRoute} disabled={routeLoading}>
              {routeLoading ? 'Fetching…' : 'Get distance & time'}
            </Button>
          </div>
          {routeError && <p className="error">{routeError}</p>}

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
