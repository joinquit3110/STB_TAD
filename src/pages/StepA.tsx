import React from 'react';
import { motion } from 'framer-motion';
import { RawTable } from '../components/RawTable';
import { GroupTable } from '../components/GroupTable';
import { useAppStore } from '../store/useAppStore';
import { rawData } from '../data/rawData';
import { Math as MathComponent } from '../components/Math';

export const StepA: React.FC = () => {
  const {
    groupData,
    addValueToGroup,
    removeValueFromGroup,
    draggedValue,
    setDraggedValue,
    updateManualMean,
    updateManualFrequency,
    updateManualSum
  } = useAppStore();
  
  // Get all values that have been assigned to groups
  const assignedValues = groupData.flatMap(group => group.values || []);
  
  const handleValueSelect = (value: number) => {
    setDraggedValue(value);
  };

  const handleGroupClick = (groupIndex: number) => {
    if (draggedValue !== null) {
      const group = groupData[groupIndex];
      let isInGroup = false;
      
      if (group.isLastInterval) {
        isInGroup = draggedValue >= group.lowerBound && draggedValue <= group.upperBound;
      } else {
        isInGroup = draggedValue >= group.lowerBound && draggedValue < group.upperBound;
      }
      
      if (isInGroup) {
        addValueToGroup(groupIndex, draggedValue);
        setDraggedValue(null);
      }
    }
  };
  // Color-coded validation functions
  const validateFrequency = (groupIndex: number, inputFrequency: number): 'correct' | 'in-progress' | 'incorrect' => {
    const group = groupData[groupIndex];
    const actualFrequency = group.values?.length || 0;
    
    if (inputFrequency === actualFrequency && actualFrequency > 0) {
      return 'correct';
    } else if (inputFrequency === 0 && actualFrequency === 0) {
      return 'in-progress';
    } else {
      return 'incorrect';
    }
  };

  const validateSum = (groupIndex: number, inputSum: number): 'correct' | 'in-progress' | 'incorrect' => {
    const group = groupData[groupIndex];
    const actualSum = group.values?.reduce((acc, val) => acc + val, 0) || 0;
    
    if (inputSum === actualSum && actualSum > 0) {
      return 'correct';
    } else if (inputSum === 0 && actualSum === 0) {
      return 'in-progress';
    } else {
      return 'incorrect';
    }
  };

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

  // Check if all groups have correct values entered manually
  const isTableCompleteAndCorrect = () => {
    return groupData.every(group => {
      const actualFrequency = group.values?.length || 0;
      const actualSum = group.values?.reduce((acc, val) => acc + val, 0) || 0;
      const actualMean = actualFrequency > 0 ? actualSum / actualFrequency : 0;
      
      // Check if student has entered correct values manually using manual fields
      return (
        group.manualFrequency === actualFrequency && actualFrequency > 0 &&
        group.manualSum === actualSum && actualSum > 0 &&
        group.manualMean !== undefined && Math.abs(group.manualMean - actualMean) < 0.01 && actualMean > 0
      );
    });
  };

  const allDataAssigned = assignedValues.length === rawData.length;
  const tableComplete = isTableCompleteAndCorrect();
  const handleFrequencyChange = (groupIndex: number, newFrequency: number) => {
    updateManualFrequency(groupIndex, newFrequency);
  };

  const handleSumChange = (groupIndex: number, newSum: number) => {
    updateManualSum(groupIndex, newSum);
  };

  const handleMeanChange = (groupIndex: number, newMean: number) => {
    updateManualMean(groupIndex, newMean);
  };
  return (
    <div className="space-y-6">
      {/* Raw Data Table */}
      <RawTable
        onValueSelect={handleValueSelect}
        selectedValues={assignedValues}
        currentlySelected={draggedValue}
      />

      {/* Group Table with Color-Coded Validation */}
      <GroupTable
        groupData={groupData}
        onValueRemove={removeValueFromGroup}
        showMeans={true}
        showFrequency={true}
        showSum={true}
        editableFrequency={true}
        editableSum={true}
        editableMeans={true}
        onFrequencyChange={handleFrequencyChange}
        onSumChange={handleSumChange}
        onMeanChange={handleMeanChange}
        onGroupClick={handleGroupClick}
        validateFrequency={validateFrequency}
        validateSum={validateSum}
        validateMean={validateMean}
      />

      {/* Completion Status */}
      {allDataAssigned && !tableComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
        >
          <div className="text-center">
            <div className="text-4xl mb-2">📝</div>
            <h3 className="text-xl font-bold text-yellow-800 mb-2">
              Hoàn thành nhập liệu
            </h3>            <p className="text-yellow-700">
              Hãy điền đúng các giá trị Tần số, Tổng và <MathComponent>{"\\bar{x}_i"}</MathComponent> cho tất cả các nhóm để tiếp tục
            </p>
          </div>
        </motion.div>
      )}

      {/* Success Message - Only show when table is complete and correct */}
      {allDataAssigned && tableComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="card bg-gradient-to-r from-success-50 to-emerald-50 border-success-200"
        >
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-success-800 mb-2">
              Xuất sắc! Đã hoàn thành bảng tính
            </h3>
            <p className="text-success-700">
              Bạn đã điền đúng tất cả các giá trị. Hãy chuyển sang bước tiếp theo!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
