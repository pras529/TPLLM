import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';

export default function Home() {
  const [trafficData, setTrafficData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    location: '13.08,80.27',
        time: '2025-03-25 17:00'
  })
})
      .then((res) => res.json())
      .then((data) => setTrafficData(data))
      .catch((err) => console.error(err));
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
          <h2 className="text-3xl mb-4">Real-Time Traffic Prediction</h2>
          {trafficData ? (
            <pre className="text-trafficGreen text-lg">{JSON.stringify(trafficData, null, 2)}</pre>
          ) : (
            <p className="text-trafficYellow">Fetching prediction...</p>
          )}
        </div>

        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
            padding: '12px 24px',
            borderRadius: '16px',
            boxShadow: '0 0 20px #8e2de2',
            color: 'white',
            fontSize: '1rem'
          }}
        >
          Predict Again
        </Button>
      </motion.main>

      <footer className="p-4 text-center">
        &copy; 2025 TPLLM - Traffic Prediction Powered by LLM
      </footer>
    </div>
  );
}
