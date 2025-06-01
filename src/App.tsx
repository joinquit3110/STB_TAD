import { motion, AnimatePresence } from 'framer-motion';
import { StepIndicator } from './components/StepIndicator';
import { StepA } from './pages/StepA';
import { StepB } from './pages/StepB';
import { StepC } from './pages/StepC';
import { StepD } from './pages/StepD';
import { Summary } from './pages/Summary';
import { useAppStore } from './store/useAppStore';
import { Math as MathComponent } from './components/Math';

const stepTitles = [
  <>Phân loại và tính <MathComponent>{"\\bar{x}_i"}</MathComponent></>,
  <>So sánh <MathComponent>{"\\bar{x}_i"}</MathComponent> và <MathComponent>{"c_i"}</MathComponent></>, 
  <>Tính trung bình <MathComponent>{"\\bar{x}"}</MathComponent></>,
  "Giá trị đại diện",
  "Tổng kết"
];

function App() {
  const { currentStep, setCurrentStep, isStepAComplete, isStepBComplete, isStepCComplete } = useAppStore();

  const canProceedFromStep = (step: number) => {
    switch (step) {
      case 0: // StepA
        return isStepAComplete();
      case 1: // StepB
        return isStepBComplete();
      case 2: // StepC
        return isStepCComplete();
      default:
        return true; // Other steps can proceed normally
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    if (currentStep < stepTitles.length - 1 && canProceedFromStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <StepA />;
      case 1:
        return <StepB />;
      case 2:
        return <StepC />;
      case 3:
        return <StepD />;
      case 4:
        return <Summary />;
      default:
        return <StepA />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 shadow-2xl overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-10 right-10 w-24 h-24 bg-yellow-300 rounded-full"
            animate={{
              x: [0, -30, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 left-1/3 w-28 h-28 bg-green-300 rounded-full"
            animate={{
              x: [0, 40, 0],
              y: [0, -25, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
            >
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Số Trung Bình
              </span>
              <br />
              <span className="text-white">
                Dữ Liệu Ghép Nhóm
              </span>
            </motion.h1>
          </motion.div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-blue-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z" fill="currentColor" />
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={stepTitles.length}
          stepTitles={stepTitles}
          onStepClick={handleStepClick}
        />

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between items-center mt-8"
        >
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentStep === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            ← Bước trước
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-600">
              Bước {currentStep + 1} / {stepTitles.length}
            </div>
            <div className="text-lg font-bold text-primary-700">
              {stepTitles[currentStep]}
            </div>
          </div>

          <button
            onClick={nextStep}
            disabled={currentStep === stepTitles.length - 1 || !canProceedFromStep(currentStep)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentStep === stepTitles.length - 1 || !canProceedFromStep(currentStep)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            Bước tiếp → 
          </button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 text-white overflow-hidden h-20">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #ffffff 2px, transparent 2px),
                               radial-gradient(circle at 75% 75%, #ffffff 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
            animate={{
              backgroundPosition: ['0px 0px', '50px 50px', '0px 0px']
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Top wave decoration */}
        <div className="absolute top-0 left-0 right-0">
          <svg className="w-full h-12 text-gray-900 transform rotate-180" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z" fill="currentColor" />
          </svg>
        </div>
      </footer>
    </div>
  );
}

export default App;
