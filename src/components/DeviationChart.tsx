import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { GroupData } from '../data/rawData';
import { Math as MathComponent } from './Math';
import { MathSymbols } from '../constants/mathFormulas';
import { formatVietnameseNumber } from '../utils/numberFormat';

interface DeviationChartProps {
  groupData: GroupData[];
}

export const DeviationChart: React.FC<DeviationChartProps> = ({ groupData }) => {
  // Prepare data for the chart
  const chartData = groupData.map((group, index) => ({
    interval: group.interval,
    groupMean: group.mean || 0,
    midpoint: group.midpoint || 0,
    deviation: group.mean !== undefined && group.midpoint !== undefined 
      ? Math.abs(group.mean - group.midpoint) 
      : 0,
    index
  }));

  const maxValue = Math.max(
    ...chartData.map(d => Math.max(d.groupMean, d.midpoint))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >      <h3 className="text-xl font-bold text-center mb-6 text-primary-700">
        So sánh <MathComponent>{MathSymbols.groupMean}</MathComponent> và <MathComponent>{MathSymbols.midpoint}</MathComponent>
      </h3>
      
      <div className="h-80 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="interval" 
              tick={{ fontSize: 12 }}
              stroke="#374151"
            />
            <YAxis 
              domain={[0, Math.ceil(maxValue + 5)]}
              tick={{ fontSize: 12 }}
              stroke="#374151"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}              formatter={(value: number, name: string) => [
                formatVietnameseNumber(value, 2),
                name === 'groupMean' ? 'Trung bình nhóm' : 'Giá trị đại diện'
              ]}
              labelFormatter={(label) => `Khoảng: ${label}`}
            />            <Legend 
              formatter={(value) => 
                value === 'groupMean' ? 'Trung bình nhóm' : 'Giá trị đại diện'
              }
            />
            <Bar 
              dataKey="groupMean" 
              fill="#3b82f6" 
              name="groupMean"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="midpoint" 
              fill="#06b6d4" 
              name="midpoint"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Deviation table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">          <thead>
            <tr>
              <th className="table-header">Khoảng</th>
              <th className="table-header"><MathComponent>{MathSymbols.groupMean}</MathComponent></th>
              <th className="table-header"><MathComponent>{MathSymbols.midpoint}</MathComponent></th>
              <th className="table-header"><MathComponent>{"|\\bar{x}_i - c_i|"}</MathComponent></th>
              <th className="table-header">Nhận xét</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((data, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <td className="table-cell font-medium">{data.interval}</td>                <td className="table-cell text-primary-700 font-bold">
                  {formatVietnameseNumber(data.groupMean, 2)}
                </td>
                <td className="table-cell text-cyan-700 font-bold">
                  {formatVietnameseNumber(data.midpoint, 2)}
                </td>
                <td className="table-cell">
                  <span className={`font-bold ${
                    data.deviation < 1 ? 'text-success-600' : 
                    data.deviation < 3 ? 'text-warning-600' : 'text-red-600'
                  }`}>
                    {formatVietnameseNumber(data.deviation, 2)}
                  </span>
                </td>
                <td className="table-cell text-sm">
                  {data.deviation < 1 ? (
                    <span className="text-success-600">Rất gần</span>
                  ) : data.deviation < 3 ? (
                    <span className="text-warning-600">Khá gần</span>
                  ) : (
                    <span className="text-red-600">Khác biệt</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
