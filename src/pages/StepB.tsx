import React from 'react';
import { motion } from 'framer-motion';
import { GroupTable } from '../components/GroupTable';
import { Math as MathComponent } from '../components/Math';
import { MathFormulas, MathSymbols } from '../constants/mathFormulas';
import { useAppStore } from '../store/useAppStore';
import { DeviationChart } from '../components/DeviationChart';

export const StepB: React.FC = () => {
  const { groupData, isStepAComplete, updateManualMidpoint, updateManualDeviation, updateManualMean } = useAppStore();

  // Check if Step A is complete
  const allGroupsCompleted = isStepAComplete();

  // Validation functions for midpoint
  const validateMidpoint = (groupIndex: number, inputMidpoint: number): 'correct' | 'in-progress' | 'incorrect' => {
    const group = groupData[groupIndex];
    const expectedMidpoint = (group.lowerBound + group.upperBound) / 2;
    
    if (Math.abs(inputMidpoint - expectedMidpoint) < 0.01 && inputMidpoint > 0) {
      return 'correct';
    } else if (inputMidpoint === 0) {
      return 'in-progress';
    } else {
      return 'incorrect';
    }
  };
  const handleMidpointChange = (groupIndex: number, newMidpoint: number) => {
    updateManualMidpoint(groupIndex, newMidpoint);
  };

  const handleDeviationChange = (groupIndex: number, newDeviation: number) => {
    updateManualDeviation(groupIndex, newDeviation);
  };
  
  // Handler for mean changes (moved from Step A)
  const handleMeanChange = (groupIndex: number, newMean: number) => {
    updateManualMean(groupIndex, newMean);
  };
  
  // Validation function for mean (moved from Step A)
  const validateMean = (groupIndex: number, inputMean: number): 'correct' | 'in-progress' | 'incorrect' => {
    const group = groupData[groupIndex];
    const actualSum = group.values?.reduce((acc, val) => acc + val, 0) || 0;
    const actualCount = group.values?.length || 0;
    const actualMean = actualCount > 0 ? actualSum / actualCount : 0;
    
    if (Math.abs(inputMean - actualMean) < 0.01 && actualMean > 0) {
      return 'correct';
    } else if (inputMean === 0 && actualMean === 0) {
      return 'in-progress';
    } else {
      return 'incorrect';
    }
  };
  // Validation function for deviation
  const validateDeviation = (groupIndex: number, inputDeviation: number): 'correct' | 'in-progress' | 'incorrect' => {
    const group = groupData[groupIndex];
    if (!group.manualMidpoint || !group.manualMean) return 'in-progress';
    
    const expectedDeviation = Math.abs(group.manualMean - group.manualMidpoint);
    
    if (Math.abs(inputDeviation - expectedDeviation) < 0.01 && inputDeviation >= 0) {
      return 'correct';
    } else if (inputDeviation === 0 && expectedDeviation > 0.01) {
      return 'in-progress';
    } else {
      return 'incorrect';
    }
  };
  // Check if all midpoints are correctly entered
  const areMidpointsComplete = () => {
    return groupData.every(group => {
      const expectedMidpoint = (group.lowerBound + group.upperBound) / 2;
      return group.manualMidpoint !== undefined && 
             Math.abs(group.manualMidpoint - expectedMidpoint) < 0.01 && 
             expectedMidpoint > 0;
    });
  };
  
  // Check if all means and midpoints are correctly entered
  const isStepBComplete = () => {
    return groupData.every(group => {
      // Check midpoint calculation
      const expectedMidpoint = (group.lowerBound + group.upperBound) / 2;
      const midpointCorrect = group.manualMidpoint !== undefined && 
                             Math.abs(group.manualMidpoint - expectedMidpoint) < 0.01 && 
                             expectedMidpoint > 0;
      
      // Check mean calculation (moved from Step A)
      const actualSum = group.values?.reduce((acc, val) => acc + val, 0) || 0;
      const actualCount = group.values?.length || 0;
      const actualMean = actualCount > 0 ? actualSum / actualCount : 0;
      const meanCorrect = group.manualMean !== undefined && 
                         Math.abs(group.manualMean - actualMean) < 0.01 && 
                         actualMean > 0;
      
      return midpointCorrect && meanCorrect;
    });
  };
  const midpointsComplete = areMidpointsComplete();
  const stepBComplete = isStepBComplete();
  // Check if all deviations are correctly entered
  const isDeviationComplete = () => {
    return groupData.every(group => {
      if (!group.manualMidpoint || !group.manualMean) return false;
      const expectedDeviation = Math.abs(group.manualMean - group.manualMidpoint);
      return group.manualDeviation !== undefined && 
             Math.abs(group.manualDeviation - expectedDeviation) < 0.01;
    });
  };
  const deviationComplete = isDeviationComplete();

  return (
    <div className="space-y-6">
      {/* Formula explanation with manual input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card bg-white border-2 border-dashed border-cyan-300"
      >
        <h3 className="text-lg font-bold text-cyan-800 mb-4 text-center">
          🧮 Giá trị đại diện c_i        </h3>          <div className="text-center mb-4 text-gray-700">          <p>Hãy tính và nhập giá trị đại diện c_i cho mỗi nhóm <MathComponent>{"[a_i;b_i)"}</MathComponent></p>
          <div className="bg-cyan-50 p-3 rounded-lg mt-2 shadow-inner">
            <MathComponent display>{MathFormulas.midpoint}</MathComponent>
            <p className="text-sm text-cyan-800 mt-2">Giá trị đại diện là điểm giữa của mỗi nhóm</p>
          </div>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {groupData.map((group, index) => {
            const validation = validateMidpoint(index, group.manualMidpoint || 0);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className={`rounded-lg p-4 border-2 ${
                  validation === 'correct' ? 'bg-success-50 border-success-200' :
                  validation === 'incorrect' ? 'bg-red-50 border-red-200' :
                  'bg-cyan-50 border-cyan-200'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold text-cyan-800 mb-2">{group.interval}</div>                  <div className="text-sm text-gray-600 mb-2">
                    <MathComponent>{`c_i = \\frac{${group.lowerBound} + ${group.upperBound}}{2}`}</MathComponent>
                  </div><div className="mb-2">
                    <input
                      type="number"
                      step="0.1"
                      value={group.manualMidpoint || ''}
                      onChange={(e) => handleMidpointChange(index, parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-md text-center font-bold no-spinners ${
                        validation === 'correct' ? 'border-success-300 bg-success-50 text-success-700' :
                        validation === 'incorrect' ? 'border-red-300 bg-red-50 text-red-700' :
                        'border-gray-300'
                      }`}
                      placeholder=""
                      style={{
                        WebkitAppearance: 'none',
                        MozAppearance: 'textfield'
                      }}
                    />
                  </div>
                  {validation === 'incorrect' && (
                    <div className="text-red-600 text-sm">✗ Sai, hãy thử lại</div>
                  )}
                </div>
              </motion.div>
            )
          })}        </div>
      </motion.div>      {/* Data Table with Comparison - Only show when all midpoint values are correct */}
      {allGroupsCompleted && midpointsComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 100 }}
          className="mb-6"
        >
          <h3 className="text-xl font-bold mb-4 text-primary-700 text-center">
            Bảng 5.9b - Bảng tần số ghép nhóm với c_i và x_i
          </h3>
          <GroupTable
            groupData={groupData.map(group => ({
              ...group,
              midpoint: group.manualMidpoint !== undefined ? group.manualMidpoint : (group.lowerBound + group.upperBound) / 2,
              // Use manualMean for the mean property to ensure the deviation calculation works properly
              mean: group.manualMean
            }))}
            showFrequency={true}
            showSum={true}
            showMeans={true}
            showMidpoints={true}
            showDeviation={true}
            editableMeans={true}
            editableDeviation={true}
            onMeanChange={handleMeanChange}
            onDeviationChange={handleDeviationChange}
            validateMean={validateMean}
            validateDeviation={validateDeviation}
          />
        </motion.div>
      )}      {/* Bar chart comparison between x_i and c_i - Only show when deviations are complete */}
      {allGroupsCompleted && stepBComplete && deviationComplete && (
        <DeviationChart groupData={groupData} />
      )}
      
      {/* Success Message - Only show when both steps are complete */}
      {allGroupsCompleted && stepBComplete && deviationComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="card bg-gradient-to-r from-success-50 to-emerald-50 border-success-200"
        >
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-success-800 mb-2">
              Hoàn thành! Đã tính đúng tất cả độ lệch
            </h3>
            <p className="text-success-700">
              Bạn đã tính đúng độ lệch giữa trung bình thực tế và giá trị đại diện cho tất cả các nhóm. Hãy chuyển sang bước tiếp theo!
            </p>
          </div>
        </motion.div>
      )}

      {/* Call to action - Step A incomplete */}
      {!allGroupsCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-yellow-50 border-yellow-200 text-center"
        >
          <div className="text-4xl mb-2">⏳</div>
          <h3 className="text-lg font-bold text-yellow-800 mb-2">
            Hãy hoàn thành Bước 1 trước!
          </h3>
          <p className="text-yellow-700">
            Cần phân loại tất cả dữ liệu và tính <MathComponent>{MathSymbols.groupMean}</MathComponent> để có thể so sánh với Giá trị đại diện <MathComponent>{MathSymbols.midpoint}</MathComponent>
          </p>
        </motion.div>
      )}      {/* Call to action - Step B incomplete */}
      {allGroupsCompleted && midpointsComplete && !stepBComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
        >
          <div className="text-center">
            <div className="text-4xl mb-2">📝</div>
            <h3 className="text-xl font-bold text-yellow-800 mb-2">
              Hoàn thiện nhập dữ liệu vào bảng
            </h3>            <p className="text-yellow-700">
              Hãy tính và nhập đúng giá trị trung bình <MathComponent>{"x_i"}</MathComponent> và giá trị đại diện <MathComponent>{MathSymbols.midpoint}</MathComponent> cho tất cả các nhóm
            </p>
          </div>
        </motion.div>
      )}
      {/* Call to action - Deviation incomplete */}
      {allGroupsCompleted && stepBComplete && !deviationComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-orange-50 to-red-50 border-orange-200"
        >
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="text-xl font-bold text-orange-800 mb-2">
              Hoàn thành tính độ lệch
            </h3>            <p className="text-orange-700">
              Hãy tính và nhập đúng độ lệch <MathComponent>{"|\\bar{x}_i - c_i|"}</MathComponent> cho tất cả các nhóm trong bảng
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
