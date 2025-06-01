import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GroupData } from '../data/rawData';
import { initialGroupData, calculateOverallMean, rawData, originalRawData, calculateRawDataMean, calculateGroupMean } from '../data/rawData';

export interface AppState {
  // Current step (0-4)
  currentStep: number;
  // Data for the lesson
  groupData: GroupData[];
  originalMean: number;
  currentMean: number;
  manualFinalMean?: number;
  rawDataMean: number;
  editableRawData: number[];
  
  // Data riêng biệt cho StepD
  stepDGroupData: GroupData[];
  stepDMean: number;
  
  // UI states
  draggedValue: number | null;
  completedGroups: Set<number>;
  isCalculating: boolean;
  
  // Actions
  setCurrentStep: (step: number) => void;
  updateGroupData: (newGroupData: GroupData[]) => void;
  addValueToGroup: (groupIndex: number, value: number) => void;
  removeValueFromGroup: (groupIndex: number, value: number) => void;
  setDraggedValue: (value: number | null) => void;
  updateGroupMean: (groupIndex: number, newMean: number) => void;
  updateGroupFrequency: (groupIndex: number, newFrequency: number) => void;
  updateGroupSum: (groupIndex: number, newSum: number) => void;
  updateManualFrequency: (groupIndex: number, newFrequency: number) => void;
  updateManualSum: (groupIndex: number, newSum: number) => void;
  updateManualMean: (groupIndex: number, newMean: number) => void;
  updateManualMidpoint: (groupIndex: number, newMidpoint: number) => void;
  updateManualDeviation: (groupIndex: number, newDeviation: number) => void;
  updateManualProduct: (groupIndex: number, newProduct: number) => void;
  updateManualFinalMean: (finalMean: number) => void;
  resetLesson: () => void;
  resetRawData: () => void;
  calculateMeans: () => void;
  recalculateAllGroups: () => void;
  isStepAComplete: () => boolean;
  isStepBComplete: () => boolean;
  isStepCComplete: () => boolean;
  updateEditableRawData: (newData: number[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      groupData: initialGroupData.map(group => ({ ...group, values: [] })),
      originalMean: 0,
      currentMean: 0,
      manualFinalMean: undefined,
      rawDataMean: calculateRawDataMean(rawData),
      editableRawData: [...originalRawData],
      
      // Data riêng biệt cho StepD
      stepDGroupData: initialGroupData.map(group => ({ ...group, values: [] })),
      stepDMean: 0,
      
      draggedValue: null,
      completedGroups: new Set(),
      isCalculating: false,

      setCurrentStep: (step) => set({ currentStep: step }),

      updateGroupData: (newGroupData) => set({ groupData: newGroupData }),

      addValueToGroup: (groupIndex, value) => {
        const state = get();
        const newGroupData = [...state.groupData];
        const group = newGroupData[groupIndex];
        
        // Count how many times this value appears in the raw data
        const valueCount = rawData.filter((v: number) => v === value).length;
        
        // Check if we have enough space and if this value hasn't been added yet
        const currentValueCount = group.values?.filter(v => v === value).length || 0;
        const spaceLeft = group.frequency - (group.values?.length || 0);
        
        console.log(`Adding value ${value} to group ${groupIndex}:`);
        console.log(`- Value appears ${valueCount} times in raw data`);
        console.log(`- Current value count in group: ${currentValueCount}`);
        console.log(`- Space left in group: ${spaceLeft}`);
        console.log(`- Group values before:`, group.values);
        
        // Validation checks
        if (!group.values) {
          console.error('Group values array is not initialized');
          return;
        }
        
        if (currentValueCount > 0) {
          console.warn(`Value ${value} already exists in group ${groupIndex}`);
          return;
        }
        
        if (spaceLeft < valueCount) {
          console.warn(`Not enough space in group ${groupIndex}. Need ${valueCount}, have ${spaceLeft}`);
          return;
        }
        
        // Add all instances of this value to properly calculate statistics
        for (let i = 0; i < valueCount; i++) {
          group.values.push(value);
        }
        
        console.log(`- Group values after:`, group.values);
        
        // Don't auto-calculate sum and mean - let students enter manually
        // group.sum = group.values.reduce((acc, val) => acc + val, 0);
        // group.mean = calculateGroupMean(group.values);
        
        // Check if group is completed
        const newCompletedGroups = new Set(state.completedGroups);
        if (group.values.length === group.frequency) {
          newCompletedGroups.add(groupIndex);
        }
        
        set({ 
          groupData: newGroupData, 
          completedGroups: newCompletedGroups 
        });
        
        // Calculate overall mean if all groups are completed
        if (newCompletedGroups.size === newGroupData.length) {
          get().calculateMeans();
        }
      },

      removeValueFromGroup: (groupIndex, value) => {
        const state = get();
        const newGroupData = [...state.groupData];
        const group = newGroupData[groupIndex];
        
        if (group.values) {
          // Remove all instances of this value
          group.values = group.values.filter(v => v !== value);
          
          // Don't auto-calculate sum and mean - let students enter manually
          // group.sum = group.values.reduce((acc, val) => acc + val, 0);
          // group.mean = group.values.length > 0 ? calculateGroupMean(group.values) : 0;
          
          // Update completed groups
          const newCompletedGroups = new Set(state.completedGroups);
          if (group.values.length < group.frequency) {
            newCompletedGroups.delete(groupIndex);
          }
          
          set({ 
            groupData: newGroupData, 
            completedGroups: newCompletedGroups 
          });
        }
      },

      setDraggedValue: (value) => set({ draggedValue: value }),

      updateGroupMean: (groupIndex, newMean) => {
        const state = get();
        const newGroupData = [...state.groupData];
        newGroupData[groupIndex].mean = newMean;
        
        set({ groupData: newGroupData });
        get().calculateMeans();
      },

      updateGroupFrequency: (groupIndex, newFrequency) => {
        const state = get();
        const newGroupData = [...state.groupData];
        newGroupData[groupIndex].frequency = newFrequency;
        
        set({ groupData: newGroupData });
      },

      updateGroupSum: (groupIndex, newSum) => {
        const state = get();
        const newGroupData = [...state.groupData];
        newGroupData[groupIndex].sum = newSum;
        
        set({ groupData: newGroupData });
      },

      updateManualFrequency: (groupIndex, newFrequency) => {
        const state = get();
        const newGroupData = [...state.groupData];
        newGroupData[groupIndex].manualFrequency = newFrequency;
        
        set({ groupData: newGroupData });
      },

      updateManualSum: (groupIndex, newSum) => {
        const state = get();
        const newGroupData = [...state.groupData];
        newGroupData[groupIndex].manualSum = newSum;
        
        set({ groupData: newGroupData });
      },

      updateManualMean: (groupIndex, newMean) => {
        const state = get();
        const newGroupData = [...state.groupData];
        newGroupData[groupIndex].manualMean = newMean;
        // Also set the mean field so other steps can access it
        newGroupData[groupIndex].mean = newMean;
        
        set({ groupData: newGroupData });
      },

      updateManualMidpoint: (groupIndex, newMidpoint) => {
        const state = get();
        const newGroupData = [...state.groupData];
        newGroupData[groupIndex].manualMidpoint = newMidpoint;
        // Also set the midpoint field so other steps can access it
        newGroupData[groupIndex].midpoint = newMidpoint;
        
        set({ groupData: newGroupData });
      },

      updateManualDeviation: (groupIndex, newDeviation) => {
        const state = get();
        const newGroupData = [...state.groupData];
        newGroupData[groupIndex].manualDeviation = newDeviation;
        
        set({ groupData: newGroupData });
      },

      updateManualProduct: (groupIndex, newProduct) => {
        const state = get();
        const newGroupData = [...state.groupData];
        newGroupData[groupIndex].manualProduct = newProduct;
        
        set({ groupData: newGroupData });
      },

      updateManualFinalMean: (finalMean) => {
        set({ manualFinalMean: finalMean });
      },

      calculateMeans: () => {
        set({ isCalculating: true });
        const state = get();
        const { groupData } = state;
        
        // Calculate mean for each group
        const updatedGroupData = groupData.map(group => {
          if (!group.values || group.values.length === 0) return group;
          const mean = calculateGroupMean(group.values);
          return { ...group, mean };
        });
        
        set({
          groupData: updatedGroupData,
          originalMean: calculateOverallMean(updatedGroupData),
          currentMean: calculateOverallMean(updatedGroupData),
          isCalculating: false,
          rawDataMean: calculateRawDataMean(get().editableRawData)
        });
      },
      
      recalculateAllGroups: () => {
        const state = get();
        const editableData = state.editableRawData;
        
        // Tính toán dữ liệu hoàn toàn tách biệt cho StepD
        // Không thay đổi dữ liệu của các step trước
        const stepDGroups = JSON.parse(JSON.stringify(initialGroupData));
        
        // Reset values for all groups in StepD
        stepDGroups.forEach((group: GroupData) => {
          group.values = [];
        });
        
        // Phân bổ dữ liệu có thể chỉnh sửa vào các nhóm cho StepD
        editableData.forEach((value: number) => {
          // Tìm nhóm mà giá trị này thuộc về
          const groupIndex = stepDGroups.findIndex((group: GroupData) => {
            const isInRange = group.isLastInterval
              ? value >= group.lowerBound && value <= group.upperBound
              : value >= group.lowerBound && value < group.upperBound;
            return isInRange;
          });
          
          if (groupIndex !== -1) {
            if (!stepDGroups[groupIndex].values) {
              stepDGroups[groupIndex].values = [];
            }
            stepDGroups[groupIndex].values!.push(value);
          }
        });
        
        // Tính toán thống kê cho các nhóm trong StepD
        stepDGroups.forEach((group: GroupData) => {
          if (group.values && group.values.length > 0) {
            group.sum = group.values.reduce((sum: number, val: number) => sum + val, 0);
            group.mean = group.sum / group.values.length;
            group.frequency = group.values.length;
            // Tính các giá trị khác cho nhóm
            group.midpoint = (group.lowerBound + group.upperBound) / 2;
            if (group.mean && group.midpoint) {
              // Lưu vào các trường đã có trong interface
              group.manualDeviation = Math.abs(group.mean - group.midpoint);
              group.manualProduct = group.frequency * group.midpoint;
            }
          }
        });
        
        // Cập nhật store với dữ liệu StepD mới và raw data mean
        set({
          stepDGroupData: stepDGroups,
          stepDMean: calculateOverallMean(stepDGroups),
          rawDataMean: calculateRawDataMean(editableData)
        });
      },
      
      resetRawData: () => {
        // Tạo một bản sao mới của dữ liệu gốc
        const newEditableData = [...originalRawData];
        
        // Đặt lại dữ liệu có thể chỉnh sửa về giá trị ban đầu
        set({
          editableRawData: newEditableData,
          rawDataMean: calculateRawDataMean(newEditableData)
        });
        
        // Tính toán lại dữ liệu cho StepD
        get().recalculateAllGroups();
      },
      
      updateEditableRawData: (newData: number[]) => {
        set({
          editableRawData: newData,
          rawDataMean: calculateRawDataMean(newData)
        });
      },

      resetLesson: () => {
        // Reset the raw data to original values
        rawData.length = 0;
        originalRawData.forEach(value => rawData.push(value));
        
        set({
          groupData: initialGroupData.map(group => ({ ...group, values: [] })),
          originalMean: 0,
          currentMean: 0,
          draggedValue: null,
          completedGroups: new Set(),
          isCalculating: false,
          rawDataMean: calculateRawDataMean(rawData)
        });
      },
      
      isStepAComplete: () => {
        const state = get();
        const { groupData } = state;
        
        // Check if all data is assigned
        const assignedValues = groupData.flatMap(group => group.values || []);
        const allDataAssigned = assignedValues.length === rawData.length;
        
        if (!allDataAssigned) return false;
        
        // Check if all manual entries are correct
        return groupData.every(group => {
          const actualFrequency = group.values?.length || 0;
          const actualSum = group.values?.reduce((acc, val) => acc + val, 0) || 0;
          const actualMean = actualFrequency > 0 ? actualSum / actualFrequency : 0;
          
          // Check if student has entered correct values manually
          return (
            group.manualFrequency === actualFrequency && actualFrequency > 0 &&
            group.manualSum === actualSum && actualSum > 0 &&
            group.manualMean !== undefined && Math.abs(group.manualMean - actualMean) < 0.01 && actualMean > 0
          );
        });
      },

      isStepBComplete: () => {
        const state = get();
        const { groupData } = state;
        
        // First check if Step A is complete
        if (!get().isStepAComplete()) return false;
        
        // Check if all midpoints are correctly entered
        const midpointsComplete = groupData.every(group => {
          const expectedMidpoint = (group.lowerBound + group.upperBound) / 2;
          return group.manualMidpoint !== undefined && 
                 Math.abs(group.manualMidpoint - expectedMidpoint) < 0.01 && 
                 expectedMidpoint > 0;
        });
        
        // Check if all deviations are correctly entered
        const deviationsComplete = groupData.every(group => {
          if (!group.manualMidpoint || !group.mean) return false;
          const expectedDeviation = Math.abs(group.mean - group.manualMidpoint);
          return group.manualDeviation !== undefined && 
                 Math.abs(group.manualDeviation - expectedDeviation) < 0.01;
        });
          return midpointsComplete && deviationsComplete;
      },

      isStepCComplete: () => {
        const state = get();
        const { groupData, manualFinalMean } = state;
        
        // First check if Step B is complete
        if (!get().isStepBComplete()) return false;
        
        // Check if all products are correctly entered
        const productsComplete = groupData.every(group => {
          const expectedProduct = group.frequency * (group.manualMidpoint || 0);
          return group.manualProduct !== undefined && 
                 Math.abs(group.manualProduct - expectedProduct) < 0.01 && 
                 expectedProduct > 0;
        });
        
        if (!productsComplete) return false;
        
        // Check if final mean is correctly entered
        const totalSum = groupData.reduce((sum, group) => sum + (group.manualProduct || 0), 0);
        const totalFreq = groupData.reduce((sum, group) => sum + group.frequency, 0);
        const expectedMean = totalFreq > 0 ? totalSum / totalFreq : 0;
        
        return manualFinalMean !== undefined && 
               Math.abs(manualFinalMean - expectedMean) < 0.01 && 
               expectedMean > 0;
      }
    }),    {
      name: 'statistics-lesson-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        groupData: state.groupData,
        originalMean: state.originalMean,
        currentMean: state.currentMean,
        completedGroups: Array.from(state.completedGroups)
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.completedGroups)) {
          state.completedGroups = new Set(state.completedGroups as number[]);
        }
      },
    }
  )
);
