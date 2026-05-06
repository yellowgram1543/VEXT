'use client';

import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Settings2 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ProbabilityVisualizer() {
  const [mean, setMean] = useState(0);
  const [stdDev, setStdDev] = useState(1);

  const generateGaussian = (m: number, s: number) => {
    const points = [];
    const step = 0.2;
    for (let x = -5; x <= 5; x += step) {
      const y = (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - m) / s, 2));
      points.push({ x: parseFloat(x.toFixed(1)), y: y });
    }
    return points;
  };

  const chartData = useMemo(() => {
    const points = generateGaussian(mean, stdDev);
    return {
      labels: points.map(p => p.x),
      datasets: [
        {
          label: `Normal Distribution (μ=${mean}, σ=${stdDev})`,
          data: points.map(p => p.y),
          borderColor: '#7B287D',
          backgroundColor: 'rgba(123, 40, 125, 0.2)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 3,
        },
      ],
    };
  }, [mean, stdDev]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        grid: { display: false },
        title: { display: true, text: 'Value (x)', font: { weight: 'bold' as any } }
      },
      y: {
        min: 0,
        max: 1,
        grid: { color: 'rgba(0,0,0,0.05)' },
        title: { display: true, text: 'Probability Density', font: { weight: 'bold' as any } }
      }
    },
    animation: {
      duration: 500, // Faster for interactive feel
    }
  };

  return (
    <div className="bg-white border-3 border-brand-dark rounded-neo p-6 shadow-[6px_6px_0px_0px_#330C2F] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black uppercase tracking-widest text-brand-dark/40 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#A7C7E7]" />
          Interactive Probability Density (Gaussian)
        </h4>
        <Settings2 className="w-4 h-4 text-brand-dark/20" />
      </div>

      <div className="h-[250px] relative">
        <Line data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t-2 border-brand-dark/5">
        {/* Mean Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/60">Mean (μ)</label>
            <span className="px-2 py-1 bg-brand-dark text-white rounded text-[10px] font-black">{mean}</span>
          </div>
          <input 
            type="range" 
            min="-3" 
            max="3" 
            step="0.1" 
            value={mean} 
            onChange={(e) => setMean(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7B287D]"
          />
        </div>

        {/* Std Dev Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/60">Std Deviation (σ)</label>
            <span className="px-2 py-1 bg-brand-dark text-white rounded text-[10px] font-black">{stdDev}</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1" 
            value={stdDev} 
            onChange={(e) => setStdDev(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#A7C7E7]"
          />
        </div>
      </div>
    </div>
  );
}
