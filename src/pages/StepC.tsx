import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Math as MathComponent } from '../components/Math';
import { MathFormulas } from '../constants/mathFormulas';
import { useAppStore } from '../store/useAppStore';
import { formatVietnameseNumber, parseVietnameseNumber, formatInputNumber } from '../utils/numberFormat';

export const StepC: React.FC = () => {
  const { 
    groupData, 
    isStepBComplete, 
    isStepCComplete,
    updateManualProduct, 
    updateManualFinalMean,
    manualFinalMean 
  } = useAppStore();
  
  // Local state for input values to handle Vietnamese number formatting properly
  const [inputProductValues, setInputProductValues] = useState<string[]>(
    groupData.map(group => formatInputNumber(group.manualProduct, 1))
  );
  const [inputFinalMeanValue, setInputFinalMeanValue] = useState<string>(
    formatInputNumber(manualFinalMean, 2)
  );
  
  // Update local state when store values change
  useEffect(() => {
    setInputProductValues(groupData.map(group => formatInputNumber(group.manualProduct, 1)));
    setInputFinalMeanValue(formatInputNumber(manualFinalMean, 2));
  }, [groupData, manualFinalMean]);
  
  // Check if Step B is complete
  const stepBCompleted = isStepBComplete();
  
  // Validation function for manual product
  const validateProduct = (groupIndex: number, inputProduct: number): 'correct' | 'in-progress' | 'incorrect' => {
    const group = groupData[groupIndex];
    const expectedProduct = group.frequency * (group.manualMidpoint || 0);
    
    if (Math.abs(inputProduct - expectedProduct) < 0.01 && expectedProduct > 0) {
      return 'correct';
    } else if (inputProduct === 0) {
      return 'in-progress';
    } else {
      return 'incorrect';
    }
  };

  // Validation function for final mean
  const validateFinalMean = (inputMean: number): 'correct' | 'in-progress' | 'incorrect' => {
    const totalSum = groupData.reduce((sum, group) => sum + (group.manualProduct || 0), 0);
    const totalFreq = groupData.reduce((sum, group) => sum + group.frequency, 0);
    const expectedMean = totalFreq > 0 ? totalSum / totalFreq : 0;
    
    if (Math.abs(inputMean - expectedMean) < 0.01 && expectedMean > 0) {
      return 'correct';
    } else if (inputMean === 0) {
      return 'in-progress';
    } else {
      return 'incorrect';
    }
  };
  // Check if all products are correctly entered
  const isProductComplete = () => {
    return groupData.every(group => {
      const expectedProduct = group.frequency * (group.manualMidpoint || 0);
      return group.manualProduct !== undefined && 
             Math.abs(group.manualProduct - expectedProduct) < 0.01 && 
             expectedProduct > 0;
    });
  };

  const productComplete = isProductComplete();
  const stepCComplete = isStepCComplete();

  const handleProductChange = (groupIndex: number, newProduct: number) => {
    updateManualProduct(groupIndex, newProduct);
  };

  const handleFinalMeanChange = (newMean: number) => {
    updateManualFinalMean(newMean);
  };  return (
    <div className="space-y-6">
      {/* Meaning Section */}      {/* Formula Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card bg-white border-2 border-emerald-300"
      >
        <h3 className="text-xl font-bold text-center text-emerald-800 mb-6">
          📐 Công thức trung bình của mẫu số liệu ghép nhóm
        </h3>        
        <div className="text-center mb-6">
          <MathComponent display className="text-3xl font-bold text-emerald-700 mb-4">
            {MathFormulas.midpointMean}
          </MathComponent>
        </div>
      </motion.div>{/* Interactive Calculation Table */}
      {stepBCompleted ? (        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-emerald-50 border-2 border-emerald-300"
        >
          <h4 className="font-semibold text-emerald-800 mb-4 text-center text-lg">
            📊 Bảng tính toán số trung bình mẫu số liệu ghép nhóm
          </h4>            <div className="overflow-x-auto">
            <table className="w-full border-collapse">              <thead>
                <tr>
                  <th className="table-header w-1/4">Nhóm</th>
                  <th className="table-header w-1/6"><MathComponent>{"n_i"}</MathComponent></th>
                  <th className="table-header w-1/6"><MathComponent>{"c_i"}</MathComponent></th>
                  <th className="table-header w-5/12 bg-purple-100"><MathComponent>{"n_i \\times c_i"}</MathComponent></th>
                </tr>
              </thead>
              <tbody>
                {groupData.map((group, index) => {
                  const productValidation = validateProduct(index, group.manualProduct || 0);
                  
                  return (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <td className="table-cell font-medium">{group.interval}</td>
                      <td className="table-cell text-blue-700 font-bold text-center">{group.frequency}</td>
                      <td className="table-cell text-emerald-700 font-bold text-center">
                        {formatVietnameseNumber(group.manualMidpoint || 0, 1)}
                      </td>                      <td className="table-cell">
                        <input
                          type="text"
                          value={inputProductValues[index] || ''}
                          onChange={(e) => {
                            const newInputValues = [...inputProductValues];
                            newInputValues[index] = e.target.value;
                            setInputProductValues(newInputValues);
                          }}
                          onBlur={(e) => {
                            const inputValue = e.target.value.trim();
                            if (inputValue === '') {
                              handleProductChange(index, 0);
                              const newInputValues = [...inputProductValues];
                              newInputValues[index] = '';
                              setInputProductValues(newInputValues);
                              return;
                            }
                            const numValue = parseVietnameseNumber(inputValue);
                            if (!isNaN(numValue)) {
                              handleProductChange(index, numValue);
                              // If correct, format the display value
                              if (validateProduct(index, numValue) === 'correct') {
                                const newInputValues = [...inputProductValues];
                                newInputValues[index] = formatInputNumber(numValue, 1);
                                setInputProductValues(newInputValues);
                              }
                            }
                          }}                          className={`w-full px-2 py-1 border rounded text-center font-bold ${
                            productValidation === 'correct' ? 'border-success-300 bg-success-50 text-success-700' :
                            productValidation === 'incorrect' ? 'border-red-300 bg-red-50 text-red-700' :
                            'border-gray-300'
                          }`}
                        />
                      </td>
                    </motion.tr>
                  );
                })}
                <tr className="border-t-2 border-gray-400">
                  <td className="table-header">Tổng</td>
                  <td className="table-header text-blue-800 text-center">
                    {groupData.reduce((sum, group) => sum + group.frequency, 0)}
                  </td>
                  <td className="table-header text-center">-</td>
                  <td className="table-header bg-purple-100 text-center">
                    {productComplete ? (
                      <span className="text-purple-800 font-bold">
                        {formatVietnameseNumber(groupData.reduce((sum, group) => sum + (group.manualProduct || 0), 0), 1)}
                      </span>
                    ) : (
                      <span className="text-gray-500">?</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-yellow-50 border-yellow-200 text-center"
        >
          <div className="text-4xl mb-2">⏳</div>
          <h3 className="text-lg font-bold text-yellow-800 mb-2">
            Cần hoàn thành Bước B trước!
          </h3>
          <p className="text-yellow-700">
            Hãy quay lại Bước B để tính toán giá trị đại diện và độ lệch
          </p>
        </motion.div>
      )}      {/* Final Calculation */}
      {stepBCompleted && productComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="card bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200"
        >
          <div className="text-center">
            <div className="text-lg text-gray-700 mb-4">🧮 Tính toán cuối cùng:</div>
            
            {/* Formula */}
            <div className="mb-4">
              <MathComponent display className="text-3xl font-bold text-emerald-700 mb-4">
            {MathFormulas.midpointMean}
          </MathComponent>
            </div>            {/* Manual input for final result */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-lg font-semibold">= </span>
              <input
                type="text"
                value={inputFinalMeanValue}
                onChange={(e) => {
                  setInputFinalMeanValue(e.target.value);
                }}
                onBlur={(e) => {
                  const inputValue = e.target.value.trim();
                  if (inputValue === '') {
                    handleFinalMeanChange(0);
                    setInputFinalMeanValue('');
                    return;
                  }
                  const numValue = parseVietnameseNumber(inputValue);
                  if (!isNaN(numValue)) {
                    handleFinalMeanChange(numValue);
                    // If correct, format the display value
                    if (validateFinalMean(numValue) === 'correct') {
                      setInputFinalMeanValue(formatInputNumber(numValue, 2));
                    }
                  }
                }}                className={`px-4 py-2 border-2 rounded-lg text-center font-bold text-xl w-32 ${
                  validateFinalMean(manualFinalMean || 0) === 'correct' ? 'border-success-300 bg-success-50 text-success-700' :
                  validateFinalMean(manualFinalMean || 0) === 'incorrect' ? 'border-red-300 bg-red-50 text-red-700' :
                  'border-gray-300'
                }`}
              />
              <span className="text-lg font-semibold">mm</span>
            </div>
          </div>
        </motion.div>
      )}      {/* Success message when step is complete */}
      {stepCComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card bg-success-50 border-2 border-success-300 text-center"
        >
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-bold text-success-800 mb-2">
            Xuất sắc! Bạn đã hoàn thành Tính trung bình
          </h3>
          <p className="text-success-700">
            Số trung bình mẫu số liệu ghép nhóm: <strong>{formatVietnameseNumber(manualFinalMean || 0, 2)} mm</strong>
          </p>
        </motion.div>
      )}
    </div>
  );
};
