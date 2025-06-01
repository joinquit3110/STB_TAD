import React from 'react';
import { motion } from 'framer-motion';
import { Math as MathComponent } from './Math';
import { MathSymbols } from '../constants/mathFormulas';
import { formatVietnameseNumber } from '../utils/numberFormat';

interface MeanPanelProps {
  originalMean: number;
  currentMean: number;
  showComparison?: boolean;
  title?: string;
}

export const MeanPanel: React.FC<MeanPanelProps> = ({
  originalMean,
  currentMean,
  showComparison = false,
  title = "Số trung bình của dữ liệu"
}) => {
  const deviation = Math.abs(currentMean - originalMean);
  const deviationPercent = originalMean !== 0 ? (deviation / originalMean) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="formula-display"
    >
      <h2 className="text-2xl font-bold text-primary-800 mb-4">{title}</h2>
      
      {/* Main formula */}
      <div className="mb-6">        <div className="text-lg text-gray-700 mb-2">
          <MathComponent>{"\\bar{x} = \\frac{\\sum n_i \\bar{x}_i}{\\sum n_i}"}</MathComponent>
        </div>
          <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="text-6xl font-bold text-primary-700"
        >
          {formatVietnameseNumber(currentMean, 2)}
        </motion.div>
        
        <div className="text-sm text-gray-600 mt-2">mm</div>
      </div>
      
      {/* Comparison section */}
      {showComparison && originalMean !== currentMean && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="border-t border-blue-200 pt-4 space-y-3"
        >
          <h3 className="text-lg font-semibold text-gray-800">So sánh với giá trị gốc:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-sm text-gray-600">Giá trị gốc</div>
              <div className="text-xl font-bold text-gray-800">{formatVietnameseNumber(originalMean, 2)}</div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-sm text-gray-600">Độ lệch tuyệt đối</div>
              <div className={`text-xl font-bold ${
                deviation < 1 ? 'text-success-600' : deviation < 3 ? 'text-warning-600' : 'text-red-600'
              }`}>
                {formatVietnameseNumber(deviation, 2)}
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-sm text-gray-600">Độ lệch tương đối</div>
              <div className={`text-xl font-bold ${
                deviationPercent < 2 ? 'text-success-600' : deviationPercent < 5 ? 'text-warning-600' : 'text-red-600'
              }`}>
                {formatVietnameseNumber(deviationPercent, 1)}%
              </div>
            </div>
          </div>
          
          {/* Interpretation */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">Nhận xét:</h4>
            <p className="text-sm text-gray-700">
              {deviationPercent < 2 ? (
                "🎯 Độ sai lệch rất nhỏ - giá trị đại diện rất tốt!"
              ) : deviationPercent < 5 ? (
                "⚠️ Độ sai lệch vừa phải - giá trị đại diện khá tốt."
              ) : (
                "❌ Độ sai lệch lớn - giá trị đại diện kém chính xác."
              )}
            </p>
          </div>
        </motion.div>
      )}
      
      {/* Explanation text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-6 text-sm text-gray-600 bg-white rounded-lg p-4"
      >        <p className="mb-2">
          <strong>Ý nghĩa:</strong> <MathComponent>{MathSymbols.groupMean}</MathComponent> đóng vai trò là <em>giá trị đại diện</em> cho mỗi nhóm dữ liệu.
        </p>
        <p>
          Số trung bình tổng thể được tính dựa trên trung bình có trọng số của các nhóm.
        </p>
      </motion.div>
    </motion.div>
  );
};
