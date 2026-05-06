'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ScatterController,
} from 'chart.js';
import { Line, Bar, Scatter } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ScatterController,
  Title,
  Tooltip,
  Legend,
  Filler
);

export type VizType = 'loss' | 'distribution' | 'boundary';

interface MLVisualizerProps {
  type: VizType;
  data: any;
  title?: string;
  className?: string;
}

export default function MLVisualizer({ type, data, title, className }: MLVisualizerProps) {
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          font: {
            family: 'Inter, sans-serif',
            weight: 'bold' as any,
            size: 10,
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: '#330C2F',
        titleFont: { size: 12, weight: 'bold' as any },
        bodyFont: { size: 11 },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { weight: 'bold' as any, size: 10 } },
        title: { display: true, text: data.xAxisLabel || '', font: { weight: 'bold' as any } }
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { weight: 'bold' as any, size: 10 } },
        title: { display: true, text: data.yAxisLabel || '', font: { weight: 'bold' as any } }
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart' as any,
    },
  };

  const renderChart = () => {
    switch (type) {
      case 'loss':
        return (
          <Line 
            options={{
              ...commonOptions,
              elements: {
                line: { tension: 0.4 },
                point: { radius: 2, hoverRadius: 5 }
              }
            }} 
            data={{
              labels: data.labels,
              datasets: [
                {
                  label: 'Training Loss',
                  data: data.trainLoss,
                  borderColor: '#7B287D',
                  backgroundColor: 'rgba(123, 40, 125, 0.1)',
                  fill: true,
                  borderWidth: 3,
                },
                {
                  label: 'Validation Loss',
                  data: data.valLoss,
                  borderColor: '#CDB4DB',
                  borderDash: [5, 5],
                  borderWidth: 2,
                  fill: false,
                }
              ]
            }} 
          />
        );

      case 'distribution':
        return (
          <Bar 
            options={commonOptions} 
            data={{
              labels: data.labels,
              datasets: [
                {
                  label: 'Frequency',
                  data: data.values,
                  backgroundColor: '#A7C7E7',
                  borderColor: '#330C2F',
                  borderWidth: 2,
                  borderRadius: 4,
                }
              ]
            }} 
          />
        );

      case 'boundary':
        return (
          <Scatter 
            options={commonOptions} 
            data={{
              datasets: [
                {
                  label: 'Class A',
                  data: data.classA,
                  backgroundColor: '#7B287D',
                  pointRadius: 6,
                },
                {
                  label: 'Class B',
                  data: data.classB,
                  backgroundColor: '#A7C7E7',
                  pointRadius: 6,
                },
                {
                  label: 'Decision Boundary',
                  data: data.boundary,
                  type: 'line' as any,
                  borderColor: '#330C2F',
                  borderWidth: 2,
                  fill: false,
                  showLine: true,
                  pointRadius: 0,
                }
              ]
            }} 
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white border-3 border-brand-dark rounded-neo p-6 shadow-[4px_4px_0px_0px_#330C2F] ${className}`}>
      {title && (
        <h4 className="text-xs font-black uppercase tracking-widest text-brand-dark/40 mb-6 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#7B287D]" />
          {title}
        </h4>
      )}
      <div className="h-[300px] relative">
        {renderChart()}
      </div>
    </div>
  );
}
