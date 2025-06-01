import React from 'react';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: (string | React.ReactNode)[];
  onStepClick?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
  onStepClick
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = onStepClick && index <= currentStep;

          return (
            <React.Fragment key={index}>
              {/* Step Circle */}
              <motion.div
                className={`step-indicator ${
                  isCompleted ? 'completed' : isActive ? 'active' : 'inactive'
                } ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                whileHover={isClickable ? { scale: 1.1 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
                onClick={() => isClickable && onStepClick(index)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {isCompleted ? '✓' : stepNumber}
              </motion.div>

              {/* Connector Line */}
              {index < totalSteps - 1 && (
                <motion.div
                  className="flex-1 h-1 mx-2 bg-gray-300 rounded"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <motion.div
                    className={`h-full rounded transition-all duration-500 ${
                      index < currentStep ? 'bg-success-500' : 'bg-gray-300'
                    }`}
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: index < currentStep ? '100%' : '0%' 
                    }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  />
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Titles */}
      <div className="flex justify-between mt-4">
        {stepTitles.map((title, index) => (
          <motion.div
            key={index}
            className="text-center flex-1 px-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            <div
              className={`text-xs font-medium ${
                index === currentStep
                  ? 'text-primary-700'
                  : index < currentStep
                  ? 'text-success-600'
                  : 'text-gray-500'
              }`}
            >
              {title}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Current Step Description */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4 text-center"
      >
        <h2 className="text-xl font-bold text-primary-800">
          Bước {currentStep + 1}: {stepTitles[currentStep]}
        </h2>
      </motion.div>
    </div>
  );
};
