import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Math as MathComponent } from './Math';
import { MathSymbols } from '../constants/mathFormulas';
import { formatInputNumber, formatVietnameseNumber, parseVietnameseNumber } from '../utils/numberFormat';

interface GroupData {
  interval: string;
  lowerBound: number;
  upperBound: number;
  frequency: number;
  values?: number[];
  sum?: number;
  mean?: number;
  midpoint?: number;
  isLastInterval?: boolean;
  manualFrequency?: number;
  manualSum?: number;
  manualMean?: number;
  manualMidpoint?: number;
  manualDeviation?: number;
}

interface GroupTableProps {
  groupData: GroupData[];
  onValueRemove?: (groupIndex: number, value: number) => void;
  onGroupClick?: (groupIndex: number) => void;
  showMeans?: boolean;
  showMidpoints?: boolean;
  showFrequency?: boolean;
  showSum?: boolean;
  showDeviation?: boolean;
  editableMeans?: boolean;
  editableFrequency?: boolean;
  editableSum?: boolean;
  editableDeviation?: boolean;
  onMeanChange?: (groupIndex: number, newMean: number) => void;
  onFrequencyChange?: (groupIndex: number, newFrequency: number) => void;
  onSumChange?: (groupIndex: number, newSum: number) => void;
  onDeviationChange?: (groupIndex: number, newDeviation: number) => void;
  validateFrequency?: (groupIndex: number, value: number) => 'correct' | 'in-progress' | 'incorrect';
  validateSum?: (groupIndex: number, value: number) => 'correct' | 'in-progress' | 'incorrect';
  validateMean?: (groupIndex: number, value: number) => 'correct' | 'in-progress' | 'incorrect';
  validateDeviation?: (groupIndex: number, value: number) => 'correct' | 'in-progress' | 'incorrect';
}

interface DroppableGroupProps {
  group: GroupData;
  groupIndex: number;
  onValueRemove?: (groupIndex: number, value: number) => void;
  onGroupClick?: (groupIndex: number) => void;
  showMeans?: boolean;
  showMidpoints?: boolean;
  showFrequency?: boolean;
  showSum?: boolean;
  showDeviation?: boolean;
  editableMeans?: boolean;
  editableFrequency?: boolean;
  editableSum?: boolean;
  editableDeviation?: boolean;
  onMeanChange?: (groupIndex: number, newMean: number) => void;
  onFrequencyChange?: (groupIndex: number, newFrequency: number) => void;
  onSumChange?: (groupIndex: number, newSum: number) => void;
  onDeviationChange?: (groupIndex: number, newDeviation: number) => void;
  validateFrequency?: (groupIndex: number, value: number) => 'correct' | 'in-progress' | 'incorrect';
  validateSum?: (groupIndex: number, value: number) => 'correct' | 'in-progress' | 'incorrect';
  validateMean?: (groupIndex: number, value: number) => 'correct' | 'in-progress' | 'incorrect';
  validateDeviation?: (groupIndex: number, value: number) => 'correct' | 'in-progress' | 'incorrect';
}

const DroppableGroup: React.FC<DroppableGroupProps> = ({
  group,
  groupIndex,
  onValueRemove,
  onGroupClick,
  showMeans,
  showMidpoints,
  showFrequency,
  showSum,
  showDeviation,
  editableMeans,
  editableFrequency,
  editableSum,
  editableDeviation,
  onMeanChange,
  onFrequencyChange,
  onSumChange,
  onDeviationChange,
  validateFrequency,
  validateSum,
  validateMean,
  validateDeviation
}) => {
  const isComplete = (group.values?.length || 0) === group.frequency;
  const progress = ((group.values?.length || 0) / group.frequency) * 100;
  // Controlled input state for deviation
  const [inputDeviationValue, setInputDeviationValue] = useState(
    group.manualDeviation !== undefined ? formatInputNumber(group.manualDeviation, 2) : ''
  );
  // Sync with store value if it changes externally
  useEffect(() => {
    setInputDeviationValue(group.manualDeviation !== undefined ? formatInputNumber(group.manualDeviation, 2) : '');
  }, [group.manualDeviation]);
  
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: groupIndex * 0.1 }}
      className={`${isComplete ? 'bg-success-50' : ''}`}
    >
      {/* Interval */}
      <td className="table-header">{group.interval}</td>
        {/* Values */}
      <td 
        className="table-cell min-w-48 cursor-pointer"
        onClick={() => onGroupClick?.(groupIndex)}
      >
        <div className="droppable-zone min-h-16 relative hover:bg-primary-50 transition-colors duration-200">
          <div className="flex flex-wrap gap-1 justify-center items-center min-h-16">
            {/* Display values with frequency count */}
            {Array.from(new Set(group.values || [])).map((value) => {
              const count = group.values?.filter(v => v === value).length || 0;
              return (
                <motion.span
                  key={`${groupIndex}-${value}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`draggable-item text-sm ${
                    onValueRemove ? 'cursor-pointer hover:bg-red-50 hover:border-red-300' : ''
                  } relative`}
                  onClick={() => onValueRemove?.(groupIndex, value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {value}
                  {count > 1 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {count}
                    </span>
                  )}
                </motion.span>
              );
            }) || []}
          </div>
          
          {/* Progress bar */}
          <div className="absolute bottom-1 left-1 right-1 h-1 bg-gray-200 rounded">
            <motion.div
              className="h-full bg-primary-500 rounded"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          {/* Progress text */}
          <div className="absolute top-1 right-1 text-xs text-gray-500">
            {group.values?.length || 0}
          </div>
        </div>
      </td>      {/* Frequency */}
      {showFrequency && (
        <td className="table-cell">          {editableFrequency ? (
            <input
              type="number"
              min="0"
              max="99"
              value={group.manualFrequency !== undefined ? group.manualFrequency : ''}
              placeholder=""
              onChange={(e) => onFrequencyChange?.(groupIndex, parseInt(e.target.value) || 0)}
              className={`w-18 px-2 py-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 hide-number-arrows ${
                validateFrequency 
                  ? {
                      'correct': 'border-green-500 bg-green-50',
                      'in-progress': 'border-yellow-500 bg-yellow-50', 
                      'incorrect': 'border-red-500 bg-red-50'
                    }[validateFrequency(groupIndex, group.manualFrequency || 0)]
                  : 'border-gray-300'
              }`}
            />          ) : (
            <span className="font-medium text-blue-700">
              {group.manualFrequency !== undefined ? group.manualFrequency : group.frequency}
            </span>
          )}
        </td>
      )}      {/* Sum */}
      {showSum && (
        <td className="table-cell">
          {editableSum ? (
            <input
              type="number"
              min="0"
              max="9999"
              value={group.manualSum !== undefined ? group.manualSum : ''}
              placeholder=""
              onChange={(e) => onSumChange?.(groupIndex, parseInt(e.target.value) || 0)}
              className={`w-24 px-2 py-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 hide-number-arrows ${
                validateSum 
                  ? {
                      'correct': 'border-green-500 bg-green-50',
                      'in-progress': 'border-yellow-500 bg-yellow-50', 
                      'incorrect': 'border-red-500 bg-red-50'
                    }[validateSum(groupIndex, group.manualSum || 0)]
                  : 'border-gray-300'
              }`}
            />          ) : (group.manualSum !== undefined || group.sum !== undefined) ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="font-bold text-primary-700 text-lg"
            >
              {group.manualSum !== undefined ? group.manualSum : group.sum}
            </motion.span>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </td>
      )}{/* Mean */}
      {showMeans && (
        <td className="table-cell">
          {editableMeans ? (            <input
              type="text"
              defaultValue={group.manualMean !== undefined ? formatInputNumber(group.manualMean, 2) : ''}
              placeholder=""
              onBlur={(e) => {
                // Parse and format the value when user finishes editing
                const inputValue = e.target.value;
                if (inputValue === '') {
                  onMeanChange?.(groupIndex, 0);
                  e.target.value = '';
                  return;
                }
                const parsedValue = parseVietnameseNumber(inputValue);
                if (!isNaN(parsedValue)) {
                  onMeanChange?.(groupIndex, parsedValue);
                  e.target.value = formatInputNumber(parsedValue, 2);
                }
              }}
              className={`w-28 px-2 py-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 hide-number-arrows ${
                validateMean 
                  ? {
                      'correct': 'border-green-500 bg-green-50',
                      'in-progress': 'border-yellow-500 bg-yellow-50', 
                      'incorrect': 'border-red-500 bg-red-50'
                    }[validateMean(groupIndex, group.manualMean || 0)]
                  : 'border-gray-300'
              }`}
            />          ) : (group.manualMean !== undefined || group.mean !== undefined) ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="font-bold text-success-700 text-lg"
            >
              {formatVietnameseNumber(group.manualMean !== undefined ? group.manualMean : group.mean!, 2)}
            </motion.span>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </td>
      )}      {/* Midpoint */}
      {showMidpoints && (
        <td className="table-cell">
          <span className="font-medium text-blue-700">
            {formatVietnameseNumber(group.manualMidpoint || group.midpoint || 0, 1)}
          </span>
        </td>
      )}        {/* Deviation */}
      {showDeviation && (
        <td className="table-cell">
          {editableDeviation ? (
            <input
              type="text"
              value={inputDeviationValue}
              placeholder=""
              onChange={(e) => {
                setInputDeviationValue(e.target.value);
              }}
              onBlur={(e) => {
                const inputValue = e.target.value;
                if (inputValue === '') {
                  onDeviationChange?.(groupIndex, 0);
                  setInputDeviationValue('');
                  return;
                }
                const parsedValue = parseVietnameseNumber(inputValue);
                if (!isNaN(parsedValue)) {
                  onDeviationChange?.(groupIndex, parsedValue);
                  setInputDeviationValue(formatInputNumber(parsedValue, 2));
                } else {
                  setInputDeviationValue('');
                }
              }}
              className={`w-28 px-2 py-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 hide-number-arrows ${
                validateDeviation 
                  ? {
                      'correct': 'border-green-500 bg-green-50',
                      'in-progress': 'border-yellow-500 bg-yellow-50', 
                      'incorrect': 'border-red-500 bg-red-50'
                    }[validateDeviation(groupIndex, group.manualDeviation || 0)]
                  : 'border-gray-300'
              }`}
            />
          ) : (
            <span className="font-medium text-warning-700">
              {formatVietnameseNumber(Math.abs((group.mean || 0) - (group.manualMidpoint || group.midpoint || 0)), 2)}
            </span>
          )}
        </td>
      )}
    </motion.tr>
  );
};

export const GroupTable: React.FC<GroupTableProps> = ({
  groupData,
  onValueRemove,
  onGroupClick,
  showMeans = false,
  showMidpoints = false,
  showFrequency = true,
  showSum = false,
  showDeviation = false,
  editableMeans = false,
  editableFrequency = false,
  editableSum = false,
  editableDeviation = false,
  onMeanChange,
  onFrequencyChange,
  onSumChange,
  onDeviationChange,
  validateFrequency,
  validateSum,
  validateMean,
  validateDeviation
}) => {const totalFrequency = groupData.reduce((sum, group) => sum + group.frequency, 0);
  const totalAssigned = groupData.reduce((sum, group) => sum + (group.values?.length || 0), 0);  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card"
    >
      {!showMidpoints && (
        <h3 className="text-xl font-bold text-center mb-4 text-primary-700">
          Bảng 5.9b - Bảng tần số ghép nhóm chiều dài của lá
        </h3>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">          <thead>            <tr>
              <th className="table-header">Chiều dài</th>
              <th className="table-header">Các giá trị</th>              {showFrequency && <th className="table-header">Tần số</th>}
              {showSum && <th className="table-header">Tổng</th>}
              {showMeans && <th className="table-header"><MathComponent>{MathSymbols.groupMean}</MathComponent></th>}
              {showMidpoints && <th className="table-header"><MathComponent>{MathSymbols.midpoint}</MathComponent></th>}
              {showDeviation && <th className="table-header"><MathComponent>{MathSymbols.deviationAbs}</MathComponent></th>}
            </tr>
          </thead>
          <tbody>            {groupData.map((group, index) => (              <DroppableGroup
                key={index}
                group={group}
                groupIndex={index}
                onValueRemove={onValueRemove}
                onGroupClick={onGroupClick}
                showMeans={showMeans}
                showMidpoints={showMidpoints}
                showFrequency={showFrequency}
                showSum={showSum}
                showDeviation={showDeviation}
                editableMeans={editableMeans}
                editableFrequency={editableFrequency}
                editableSum={editableSum}
                editableDeviation={editableDeviation}
                onMeanChange={onMeanChange}
                onFrequencyChange={onFrequencyChange}
                onSumChange={onSumChange}
                onDeviationChange={onDeviationChange}
                validateFrequency={validateFrequency}
                validateSum={validateSum}
                validateMean={validateMean}
                validateDeviation={validateDeviation}
              />
            ))}
          </tbody>
        </table>
      </div>
        <div className="mt-4 text-sm">
        <div className="text-gray-600 text-center">
          Đã phân loại: <span className="font-bold text-primary-700">{totalAssigned}</span>/{totalFrequency}
        </div>
      </div>
    </motion.div>
  );
};
