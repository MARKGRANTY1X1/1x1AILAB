
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area } from 'recharts';
import { ChartDataPoint } from '../types';

interface HashrateChartProps {
  data: ChartDataPoint[];
  isMining: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-card p-2 border border-dark-border rounded-md shadow-lg">
        <p className="label text-dark-text-secondary">{`${label}`}</p>
        <p className="intro text-primary font-bold">{`Hashrate: ${payload[0].value.toFixed(2)} MH/s`}</p>
      </div>
    );
  }
  return null;
};


const HashrateChart: React.FC<HashrateChartProps> = ({ data, isMining }) => {
  const chartColor = isMining ? "#10b981" : "#4b5563"; // emerald-500 or gray-600
  
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
           <defs>
            <linearGradient id="colorHashrate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.2)" />
          <XAxis 
            dataKey="time" 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
            axisLine={{ stroke: '#4b5563' }}
            tickLine={{ stroke: '#4b5563' }}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
            axisLine={{ stroke: '#4b5563' }}
            tickLine={{ stroke: '#4b5563' }}
            domain={['dataMin - 10', 'dataMax + 20']}
            allowDataOverflow={true}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="hashrate"
            stroke={chartColor}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
           <Area type="monotone" dataKey="hashrate" stroke={false} fillOpacity={1} fill="url(#colorHashrate)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HashrateChart;
