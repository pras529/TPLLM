import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function Home() {
  const [trafficData, setTrafficData] = useState(null);
  const [location, setLocation] = useState('13.08,80.27'); // default location
  const [loading, setLoading] = useState(false);

  const fetchTrafficPrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: location,
          time: '2025-03-25 17:00', // You can make time dynamic too if you want
        }),
      });
      const data = await response.json();
      setTrafficData(data);
    } catch (error) {
      console.error('Error fetching traffic data:', error);
    }
    setLoading(false);
  };

  // Fetch initial prediction
  useEffect(() => {
    fetchTrafficPrediction();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-traffic text-white flex flex-col">
      <header className="flex items-center p-6">
        <Image src="/tpllm_logo.png" alt="TPLLM Logo" width={120} height={50} />
        <h1 className="text-4xl font-bold ml-4">Traffic Prediction LLM (TPLLM)</h1>
      </header>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center flex-grow space-y-10"
      >
        <div className="glass p-8 max-w-xl w-full text-center shadow-xl">
          <h2 className="text-3xl mb-6">Real-Time Traffic Prediction</h2>

          {/* Input Field for Location */}
          <div className="flex flex-col space-y-4 mb-6">
            <TextField
              label="Enter Location (lat,long)"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              sx={{
                input: { color: 'white' },
                label: { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: '#8e2de2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8e2de2',
                  },
                },
              }}
            />

            {/* Predict Button */}
            <Button
              variant="contained"
              onClick={fetchTrafficPrediction}
              sx={{
                background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
                padding: '12px 24px',
                borderRadius: '16px',
                boxShadow: '0 0 20px #8e2de2',
                color: 'white',
                fontSize: '1rem',
              }}
            >
              Predict Traffic for This Location
            </Button>
          </div>

          {/* Traffic Data */}
          {loading ? (
            <p className="text-trafficYellow">Fetching prediction...</p>
          ) : trafficData ? (
            <pre className="text-trafficGreen text-left text-sm">{JSON.stringify(trafficData, null, 2)}</pre>
          ) : (
            <p className="text-trafficRed">No data available.</p>
          )}
        </div>
      </motion.main>

      <footer className="p-4 text-center">
        &copy; 2025 TPLLM - Traffic Prediction Powered by LLM
      </footer>
    </div>
  );
}
