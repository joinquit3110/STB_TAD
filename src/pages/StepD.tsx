import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { formatVietnameseNumber } from '../utils/numberFormat';
import { RawTable } from '../components/RawTable';

export const StepD: React.FC = () => {
  const { 
    isStepCComplete, 
    setCurrentStep,
    rawDataMean,
    recalculateAllGroups,
    resetRawData,
    editableRawData,
    updateEditableRawData,
    stepDGroupData,
    stepDMean
  } = useAppStore();

  // Xử lý khi chưa hoàn thành bước trước
  if (!isStepCComplete()) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-orange-800 mb-2">
            Bạn cần hoàn thành Bước C trước
          </h3>
          <p className="text-orange-700 mb-4">
            Để xem kết quả so sánh, vui lòng quay lại và hoàn thành Bước C.
          </p>
          <button
            onClick={() => setCurrentStep(2)}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Quay lại Bước C
          </button>
        </div>
      </div>
    );
  }

  // Tính tổng tần số của tất cả các nhóm
  const totalFrequency = stepDGroupData.reduce((sum, group) => sum + group.frequency, 0);

  return (
    <div className="space-y-6">
      {/* Summary Comparison Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card bg-gradient-to-r from-blue-50 to-green-50 border border-gray-200 shadow-lg mb-6 overflow-hidden"
      >
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800">So sánh giá trị trung bình</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-2">
          <div className="bg-white/80 p-5 rounded-lg shadow-sm border border-blue-100">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-semibold text-blue-800">Dữ liệu gốc</h4>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {editableRawData.length} giá trị
              </span>
            </div>
            <div className="flex flex-col">
              <p className="text-4xl font-bold text-blue-800">{formatVietnameseNumber(rawDataMean)}</p>
              <p className="text-xs text-blue-600 mt-1">Cập nhật tự động khi chỉnh sửa</p>
            </div>
          </div>
          
          <div className="bg-white/80 p-5 rounded-lg shadow-sm border border-green-100">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-semibold text-green-800">Dữ liệu ghép nhóm</h4>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {stepDGroupData.length} nhóm
              </span>
            </div>
            <div className="flex flex-col">
              <p className="text-4xl font-bold text-green-800">{formatVietnameseNumber(stepDMean)}</p>
              <p className="text-xs text-green-600 mt-1">Từ tần số và giá trị đại diện của các nhóm</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 bg-white/90 p-3 rounded-md border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Chênh lệch:</span> 
              <span className="font-bold text-purple-700 ml-1">
                {formatVietnameseNumber(Math.abs(rawDataMean - stepDMean))}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Raw Data Table with edit functionality */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card bg-white border-2 border-gray-300 shadow-lg"
      >
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Dữ liệu gốc có thể chỉnh sửa</h3>
          <button
            onClick={() => resetRawData()}
            className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center space-x-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Đặt lại dữ liệu gốc</span>
          </button>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-800">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p>Các thay đổi ở đây sẽ không ảnh hưởng đến kết quả của các bước trước.</p>
          </div>
        </div>
        
        <RawTable 
          editable={true} 
          data={editableRawData}
          showEditInstructions={false}
          onValueChange={(updatedData) => {
            // Cập nhật dữ liệu gốc có thể chỉnh sửa
            updateEditableRawData(updatedData);
            // Tính toán lại các nhóm
            recalculateAllGroups();
          }}
        />
      </motion.div>

      {/* Detailed Comparison Table */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        transition={{ duration: 0.5 }}
        className="card bg-white border-2 border-gray-300"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header w-1/5 bg-gray-100">Khoảng</th>
                <th className="table-header w-1/5 bg-gray-100">Tần số (n<sub>i</sub>)</th>
                <th className="table-header w-1/5 bg-blue-100">
                  Giá trị đại diện (c<sub>i</sub>)
                </th>
                <th className="table-header w-1/5 bg-yellow-100">
                  Trung bình nhóm
                </th>
                <th className="table-header w-1/5 bg-purple-100">
                  n<sub>i</sub> × c<sub>i</sub>
                </th>
              </tr>
            </thead>            
            <tbody>
              {stepDGroupData.map((group, index) => {
                const product = (group.midpoint || 0) * group.frequency;
                
                return (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <td className="table-cell font-medium">{group.interval}</td>
                    <td className="table-cell text-center font-bold">{group.frequency}</td>
                    <td className="table-cell text-center text-blue-700 font-bold bg-blue-50">
                      {formatVietnameseNumber(group.midpoint || 0, 1)}
                    </td>
                    <td className="table-cell text-center text-yellow-700 font-bold bg-yellow-50">
                      {group.mean ? formatVietnameseNumber(group.mean, 1) : '-'}
                    </td>
                    <td className="table-cell text-center text-purple-700 font-bold bg-purple-50">
                      {formatVietnameseNumber(product, 1)}
                    </td>
                  </motion.tr>
                );
              })}
              <tr className="border-t-2 border-gray-400">
                <td className="table-header">Tổng</td>
                <td className="table-header text-center">{totalFrequency}</td>
                <td className="table-header text-center">-</td>
                <td className="table-header text-center">-</td>
                <td className="table-header bg-purple-100 text-center text-purple-800">
                  {formatVietnameseNumber(stepDGroupData.reduce((sum, group) => sum + (group.midpoint || 0) * group.frequency, 0), 1)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Congratulations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-center shadow-lg"
      >
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-success-800 mb-3">
          Hoàn thành!
        </h3>
        <p className="text-success-700 text-lg">
          Bạn đã học xong cách tính trung bình mẫu số liệu ghép nhóm
        </p>
      </motion.div>
    </div>
  );
};