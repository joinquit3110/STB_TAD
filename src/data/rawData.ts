// Dữ liệu gốc từ Bảng 5.9a - Chiều dài của lá (mm)
// Exported as a mutable array to allow for editing
export const rawData = [
  40, 46, 45, 59, 43, 52, 49, 43,
  59, 53, 70, 42, 60, 37, 55, 43,
  51, 56, 61, 57, 32, 63, 46, 56,
  60, 42, 46, 66, 39, 50, 33, 45
];

// Keep a copy of the original data for reset functionality
export const originalRawData = [...rawData];

// Bảng tần số ghép nhóm (Bảng 5.9b)
export interface GroupData {
  interval: string;
  lowerBound: number;
  upperBound: number;
  frequency: number;
  values?: number[];
  sum?: number;
  mean?: number;
  midpoint?: number;
  isLastInterval?: boolean;
  // Manual input fields for students
  manualFrequency?: number;
  manualSum?: number;
  manualMean?: number;
  manualMidpoint?: number;
  manualDeviation?: number;
  manualProduct?: number; // n_i × c_i
  // Fields for comparison between actual and calculated values
  originalMean?: number;
  calculatedMean?: number;
  meanDifference?: number;
}

export const initialGroupData: GroupData[] = [
  {
    interval: '[30;40)',
    lowerBound: 30,
    upperBound: 40,
    frequency: 4,
    values: [],
    midpoint: 35
  },
  {
    interval: '[40;50)',
    lowerBound: 40,
    upperBound: 50,
    frequency: 12,
    values: [],
    midpoint: 45
  },
  {
    interval: '[50;60)',
    lowerBound: 50,
    upperBound: 60,
    frequency: 10,
    values: [],
    midpoint: 55
  },
  {
    interval: '[60;70]',
    lowerBound: 60,
    upperBound: 70,
    frequency: 6,
    values: [],
    midpoint: 65,
    isLastInterval: true
  }
];

// Hàm tính toán thống kê
export const calculateGroupMean = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
};

export const calculateOverallMean = (groups: GroupData[]): number => {
  const totalWeightedSum = groups.reduce((acc, group) => {
    return acc + (group.mean || 0) * group.frequency;
  }, 0);
  
  const totalFrequency = groups.reduce((acc, group) => acc + group.frequency, 0);
  
  return totalFrequency > 0 ? totalWeightedSum / totalFrequency : 0;
};

// Calculate mean of raw data directly
export const calculateRawDataMean = (data: number[]): number => {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
};

export const calculateMidpointMean = (groups: GroupData[]): number => {
  const totalWeightedSum = groups.reduce((acc, group) => {
    return acc + (group.midpoint || 0) * group.frequency;
  }, 0);
  
  const totalFrequency = groups.reduce((acc, group) => acc + group.frequency, 0);
  
  return totalWeightedSum / totalFrequency;
};

// Dữ liệu bài tập phụ - Cân nặng học sinh
export const practiceRawData = [
  45, 48, 52, 47, 50, 54, 49, 46,
  53, 51, 55, 48, 57, 44, 52, 47,
  49, 50, 56, 53, 42, 58, 48, 51,
  54, 47, 50, 59, 45, 52, 41, 48
];

export const practiceGroupData: GroupData[] = [
  {
    interval: '[40;45)',
    lowerBound: 40,
    upperBound: 45,
    frequency: 3,
    values: [],
    midpoint: 42.5
  },
  {
    interval: '[45;50)',
    lowerBound: 45,
    upperBound: 50,
    frequency: 12,
    values: [],
    midpoint: 47.5
  },
  {
    interval: '[50;55)',
    lowerBound: 50,
    upperBound: 55,
    frequency: 11,
    values: [],
    midpoint: 52.5
  },
  {
    interval: '[55;60)',
    lowerBound: 55,
    upperBound: 60,
    frequency: 6,
    values: [],
    midpoint: 57.5
  }
];
