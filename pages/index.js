import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button, TextField, CircularProgress } from '@mui/material';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';

export default function Home() {
  const [trafficData, setTrafficData] = useState(null);
  const [location, setLocation] = useState('13.08,80.27'); // default
  const [time, setTime] = useState('2025-03-25 17:00'); // new: dynamic time field
  const [loading, setLoading] = useState(false);

  const fetchTrafficPrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, time }),
      });
      const data = await response.json();
      setTrafficData(data);
    } catch (error) {
      console.error('Error fetching traffic data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrafficPrediction();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex flex-col">
      
      {/* Header */}
      <header className="flex items-center p-6 backdrop-blur-md bg-white/5 shadow-md">
        <Image src="/tpllm_logo1.png" alt="TPLLM Logo" width={100} height={40} />
        <h1 className="text-4xl font-extrabold ml-4 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400">
          Traffic Prediction LLM
        </h1>
      </header>

      {/* Main */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center justify-center flex-grow p-4 space-y-10"
      >
        <div className="glass bg-white/10 backdrop-blur-md p-8 max-w-2xl w-full rounded-2xl shadow-2xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-cyan-300">Real-Time Traffic Prediction</h2>

          {/* Input Fields */}
          <div className="flex flex-col space-y-4 mb-8">
            {/* Location Input */}
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-fuchsia-400" />
              <TextField
                fullWidth
                label="Enter Location (lat,long)"
                variant="outlined"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                sx={{
                  input: { color: 'white' },
                  label: { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'white' },
                    '&:hover fieldset': { borderColor: '#8e2de2' },
                    '&.Mui-focused fieldset': { borderColor: '#8e2de2' },
                  },
                }}
              />
            </div>

            {/* Time Input */}
            <div className="flex items-center gap-2">
              <FaClock className="text-fuchsia-400" />
              <TextField
                fullWidth
                label="Enter Time (YYYY-MM-DD HH:MM)"
                variant="outlined"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                sx={{
                  input: { color: 'white' },
                  label: { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'white' },
                    '&:hover fieldset': { borderColor: '#8e2de2' },
                    '&.Mui-focused fieldset': { borderColor: '#8e2de2' },
                  },
                }}
              />
            </div>

            {/* Predict Button */}
            <Button
              fullWidth
              variant="contained"
              onClick={fetchTrafficPrediction}
              sx={{
                background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
                padding: '12px 24px',
                borderRadius: '30px',
                boxShadow: '0 0 20px #8e2de2',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
              Predict Traffic
            </Button>
          </div>

          {/* Output Section */}
          {loading ? (
            <div className="flex flex-col items-center">
              <CircularProgress sx={{ color: '#8e2de2' }} />
              <p className="mt-4 text-trafficYellow">Fetching prediction...</p>
            </div>
          ) : trafficData ? (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-black/50 p-6 rounded-xl shadow-inner overflow-x-auto text-left"
            >
              <h3 className="text-2xl font-semibold mb-4 text-cyan-300">Prediction Result:</h3>
              <pre className="text-green-300 text-sm whitespace-pre-wrap">{JSON.stringify(trafficData, null, 2)}</pre>
            </motion.div>
          ) : (
            <p className="text-trafficRed">No data available.</p>
          )}
        </div>
      </motion.main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-400 text-sm">
        &copy; 2025 TPLLM — Traffic Prediction Powered by AI
      </footer>
    </div>
  );
}
