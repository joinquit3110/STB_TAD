import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { rawData } from '../data/rawData';
import { useAppStore } from '../store/useAppStore';

interface RawTableProps {
  onValueSelect?: (value: number) => void;
  selectedValues?: number[];
  currentlySelected?: number | null;
  disabled?: boolean;
  editable?: boolean;
  data?: number[];
  onEditComplete?: () => void;
  onValueChange?: (updatedData: number[]) => void;
  showEditInstructions?: boolean;
}

export const RawTable: React.FC<RawTableProps> = ({ 
  onValueSelect, 
  selectedValues = [],
  currentlySelected = null,
  disabled = false,
  editable = false,
  data = rawData,
  onEditComplete,
  onValueChange,
  showEditInstructions = true
}) => {
  const { calculateMeans } = useAppStore();
  const [editingCell, setEditingCell] = useState<{rowIndex: number, colIndex: number} | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  // Organize data into 4 rows of 8 columns
  const organizedData = [];
  for (let i = 0; i < data.length; i += 8) {
    organizedData.push(data.slice(i, i + 8));
  }

  // Helper function to check if a value is fully assigned
  const isValueFullyAssigned = (value: number): boolean => {
    const totalCountInData = data.filter(v => v === value).length;
    const assignedCount = selectedValues.filter(v => v === value).length;
    return assignedCount >= totalCountInData;
  };

  const handleCellClick = (value: number, rowIndex: number, colIndex: number) => {
    if (editable) {
      // If in edit mode, allow clicking to edit the value
      setEditingCell({ rowIndex, colIndex });
      setEditValue(value.toString());
    } else if (!disabled && onValueSelect && !isValueFullyAssigned(value)) {
      onValueSelect(value);
    }
  };
  
  const handleEditKeyDown = (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
    if (e.key === 'Enter') {
      const value = parseFloat(editValue);
      if (!isNaN(value)) {
        // Tạo bản sao của mảng dữ liệu để cập nhật
        const updatedData = [...data];
        const dataIndex = rowIndex * 8 + colIndex;
        
        if (dataIndex < updatedData.length) {
          updatedData[dataIndex] = value;
          
          // Gọi onValueChange nếu được cung cấp
          if (onValueChange) {
            onValueChange(updatedData);
          } else {
            // Cách cũ nếu không có onValueChange
            data[dataIndex] = value;
            calculateMeans();
            // Gọi onEditComplete nếu được cung cấp
            if (onEditComplete) {
              onEditComplete();
            }
          }
        }
      }
      setEditingCell(null);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };  
  
  const handleEditBlur = (rowIndex: number, colIndex: number) => {
    const value = parseFloat(editValue);
    if (!isNaN(value)) {
      // Tạo bản sao của mảng dữ liệu để cập nhật
      const updatedData = [...data];
      const dataIndex = rowIndex * 8 + colIndex;
      
      if (dataIndex < updatedData.length) {
        updatedData[dataIndex] = value;
        
        // Gọi onValueChange nếu được cung cấp
        if (onValueChange) {
          onValueChange(updatedData);
        } else {
          // Cách cũ nếu không có onValueChange
          data[dataIndex] = value;
          calculateMeans();
          // Gọi onEditComplete nếu được cung cấp
          if (onEditComplete) {
            onEditComplete();
          }
        }
      }
    }
    setEditingCell(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card shadow-md rounded-lg p-4 bg-white"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-center text-primary-700">
          Bảng 5.9a - Chiều dài của lá (mm)
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse rounded-lg shadow-sm">
          <tbody className="divide-y divide-gray-200">
            {organizedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((value, colIndex) => {
                  // Determine cell styling
                  const isSelected = currentlySelected === value;
                  const isAssigned = selectedValues.includes(value);
                  const isFullyAssigned = isAssigned && isValueFullyAssigned(value);
                  const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.colIndex === colIndex;
                  
                  return (
                    <td
                      key={colIndex}
                      className={`
                        border border-gray-200 px-4 py-3 text-center transition-all duration-200
                        ${isSelected ? 'bg-blue-100 font-bold shadow-inner' : ''}
                        ${isAssigned && !isSelected ? 'bg-blue-50' : ''}
                        ${disabled || isFullyAssigned ? 'opacity-60' : ''}
                        ${editable ? 'cursor-pointer' : ''}
                        ${isEditing ? 'p-0 bg-white shadow-inner' : ''}
                        ${editable && !isEditing ? 'hover:bg-blue-50 hover:shadow-inner hover:font-medium' : ''}
                      `}
                      onClick={() => handleCellClick(value, rowIndex, colIndex)}
                    >
                      {isEditing ? (
                        <div className="relative">
                          <input
                            type="number"
                            className="w-full py-2.5 px-3 text-center text-blue-800 font-medium border-2 border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => handleEditKeyDown(e, rowIndex, colIndex)}
                            onBlur={() => handleEditBlur(rowIndex, colIndex)}
                            autoFocus
                            step="any"
                          />
                          {showEditInstructions && (
                            <div className="absolute text-xs text-gray-500 -bottom-5 left-0 right-0 text-center bg-white py-1 rounded-b-md shadow-sm">
                              <span className="font-medium">Enter</span> để lưu, <span className="font-medium">ESC</span> để hủy
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={`py-1.5 ${editable ? 'hover:text-blue-700 hover:font-medium' : ''}`}>
                          {value}
                          {editable && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-xs text-gray-400 mt-1">
                              Nhấp để sửa
                            </motion.div>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
