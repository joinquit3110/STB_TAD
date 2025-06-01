// Predefined math formulas for the statistics lesson
export const MathFormulas = {
  // Group mean formula
  groupMean: '\\bar{x}_i = \\frac{\\sum_{j=1}^{n_i} x_{ij}}{n_i}',
    // Overall mean using group means
  overallMean: '\\bar{x} = \\frac{\\sum_{i=1}^{k} n_i \\cdot \\bar{x}_i}{\\sum_{i=1}^{k} n_i}',
  
  // Overall mean using midpoints
  midpointMean: '\\bar{x} = \\frac{n_1 c_1 + n_2 c_2 + \\ldots + n_k c_k}{N}',
    // Deviation formula
  deviation: 'd_i = \\bar{x}_i - c_i',
    // Group midpoint
  midpoint: 'c_i = \\frac{a_i + b_i}{2}',
  
  // Variance formula for grouped data
  VARIANCE_GROUPED: '\\sigma^2 = \\frac{\\sum_{i=1}^{k} f_i (x_i - \\bar{x})^2}{N}',
  
  // Standard deviation formula
  STANDARD_DEVIATION: '\\sigma = \\sqrt{\\sigma^2}'
};

// Common math symbols and expressions
export const MathSymbols = {
  mean: '\\bar{x}',
  groupMean: '\\bar{x}_i',
  midpoint: 'c_i',
  frequency: 'n_i',
  deviation: 'd_i',
  deviationAbs: '|\\bar{x}_i-c_i|',
  sum: '\\sum',
  approximately: '\\approx',
  equals: '=',
  plusMinus: '\\pm'
};
