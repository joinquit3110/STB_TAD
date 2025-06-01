import React from 'react';
import { motion } from 'framer-motion';
import { Math } from '../components/Math';
import { useAppStore } from '../store/useAppStore';
import { formatVietnameseNumber } from '../utils/numberFormat';

export const Summary: React.FC = () => {
  const { currentMean, resetLesson } = useAppStore();
  // Sử dụng ref để theo dõi trạng thái in ấn
  const printingRef = React.useRef(false);

  // CSS dành cho in PDF
  React.useEffect(() => {
    // Xóa bất kỳ style in ấn cũ để tránh xung đột
    const oldStyle = document.getElementById('print-styles');
    if (oldStyle) document.head.removeChild(oldStyle);
    
    // Tạo style element mới cho in ấn
    const printStyle = document.createElement('style');
    printStyle.setAttribute('id', 'print-styles');
    // Đảm bảo có background-printing mặc định
    const printSetting = document.createElement('style');
    printSetting.innerHTML = `
      @media print {
        html {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          forced-color-adjust: exact !important;
        }
      }
    `;
    document.head.appendChild(printSetting);
    printStyle.innerHTML = `
      @media print {
        /* Đảm bảo mọi màu sắc được in chính xác */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        /* Cấu hình trang in đơn giản nhất */
        @page {
          size: A4;
          margin: 1.5cm;
          @top {
            content: "" !important;
          }
          @bottom {
            content: "" !important;
          }
        }
        
        /* Giữ màu gradient header */
        .header-gradient {
          background: linear-gradient(to right, #8b5cf6, #7c3aed) !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          color: white !important;
          box-shadow: none !important;
          border: none !important;
          page-break-inside: avoid !important;
        }
        
        html, body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          forced-color-adjust: exact !important;
          background-color: white !important;
        }
        
        .bg-blue-50, .bg-blue-100, .bg-green-50, .bg-green-100, 
        .bg-emerald-50, .bg-teal-50, .bg-indigo-50, .bg-white, 
        .bg-gradient-to-r, .bg-gradient-to-br {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          forced-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        /* Đảm bảo màu gradient */
        .bg-gradient-to-r {
          background: linear-gradient(to right, #ebf5ff, #e6f5ff) !important;
        }
        
        .from-blue-50.to-indigo-50 {
          background: linear-gradient(to right, #ebf5ff, #eef2ff) !important;
        }
        
        .from-emerald-50.via-green-50.to-teal-50 {
          background: linear-gradient(to right, #ecfdf5, #f0fdf4, #f0fdfa) !important;
        }
        
        /* Đảm bảo màu nền có sẵn */
        .bg-blue-100 {
          background-color: #e6f0ff !important;
        }
        
        .bg-green-100 {
          background-color: #dcfce7 !important;
        }
        
        .shadow, .shadow-md, .shadow-sm, .shadow-inner {
          box-shadow: none !important;
          border: 1px solid #ddd !important;
        }
        
        .print-header, .print-footer {
          display: none !important;
        }
        
        .print-content {
          margin: 0;
          padding: 0;
        }
        
        button, .btn, .btn-secondary, .btn-primary {
          display: none !important;
        }
        
        /* Đảm bảo màu chữ hiển thị đúng */
        .text-blue-600, .text-blue-700, .text-blue-800 {
          color: #1e40af !important;
          font-weight: bold !important;
        }
        
        .text-green-600, .text-green-700, .text-green-800 {
          color: #15803d !important;
          font-weight: bold !important;
        }
        
        .text-emerald-600, .text-emerald-700, .text-emerald-800 {
          color: #047857 !important;
          font-weight: bold !important;
        }
        
        .text-teal-600, .text-teal-700, .text-teal-800 {
          color: #0f766e !important;
          font-weight: bold !important;
        }
        
        /* Hiển thị LaTeX */
        .katex { 
          font-size: 1.1em !important; 
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        .print-formula {
          transform: scale(1.8) !important;
          margin: 30px 0 !important;
          display: block !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        .bg-blue-100 {
          background-color: #dbeafe !important;
          color: #1e40af !important;
        }
        
        .text-blue-800 {
          color: #1e40af !important;
          -webkit-text-fill-color: #1e40af !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        /* Giữ nội dung khi in */
        .print-preserve {
          display: block !important;
          page-break-inside: avoid !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        /* Giữ màu sắc và background cho các card */
        .card.bg-blue-50 {
          background-color: #eff6ff !important;
          border-color: #bfdbfe !important;
        }
        
        .card.from-emerald-50.to-green-50 {
          background: linear-gradient(to right, #ecfdf5, #f0fdf4) !important;
        }
        
        /* Đảm bảo màu chữ in đúng */
        .text-emerald-700, .text-emerald-800 {
          color: #047857 !important;
        }
        
        .text-primary-800 {
          color: #1e40af !important;
        }
        
        .text-gray-700 {
          color: #374151 !important;
        }
        
        .no-duplicate-print {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        /* Header style */
        .header-gradient {
          display: block !important;
          color: white !important;
          background: linear-gradient(to right, #8b5cf6, #7c3aed) !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          padding: 1.5rem !important;
          margin-bottom: 1.5rem !important;
          border-radius: 0.5rem !important;
          text-align: center !important;
        }
        
        .card {
          border: 1px solid #ddd !important;
          margin-bottom: 15px !important;
          page-break-inside: avoid !important;
        }
        
        h1, h2, h3 {
          page-break-after: avoid !important;
        .pagination-controls, .navigation-buttons,
        a[href="#previous"], a[href="#next"] {
          display: none !important;
        }
        
        .print-preserve {
          background: linear-gradient(to right, #6366f1, #8b5cf6) !important;
          color: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        /* Đảm bảo header có màu gradient */
        .bg-gradient-to-r {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          background-image: linear-gradient(to right, #6366f1, #8b5cf6) !important;
        }
        
        /* Giữ header và màu nền khi in */
        @page {
          margin: 1.5cm !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        @media print {
          .print-hide {
            display: none !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          .screen-only {
            display: none !important;
          }
        }
        
        /* Ẩn các header */
        h1, h2, h3, h4, h5, h6 {
          break-after: avoid !important;
          break-before: avoid !important;
          -webkit-region-break-after: avoid !important;
          -webkit-region-break-before: avoid !important;
        }
        
        .text-primary-800, .text-2xl, .text-3xl, .text-xl {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        /* Ẩn các điều hướng bước */
        .navigation-panel, .nav-buttons, .step-indicator,
        .stepper-controls, .page-controls, .step-navigation {
          display: none !important;
        }
        
        /* Ẩn nút "Làm lại bài học" và "In bài học" */
        .btn-secondary, .btn-primary, [type="button"], [type="submit"],
        .mt-8, .space-x-4 {
          display: none !important;
        }
      }
    `;
    
    // Thêm style vào document head
    document.head.appendChild(printStyle);
    
    // Cleanup khi component unmount
    return () => {
      const styleElement = document.getElementById('print-styles');
      if (styleElement) document.head.removeChild(styleElement);
    };
  }, []);
  
  return (
    <div className="space-y-6 print-content">      
      {/* Header chính với gradient */}
      <div className="header-gradient bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-lg shadow-md mb-6 print-preserve">
        <h1 className="text-3xl font-bold text-center text-white">Dữ Liệu Ghép Nhóm</h1>
        <h2 className="text-xl font-medium text-center text-white mt-2">Số Trung Bình</h2>
      </div>
      
      {/* Main Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 text-center print-preserve"
      >
        <h1 className="text-3xl font-bold text-emerald-800 mb-6 text-center">
          🎉 Chúc mừng! Hoàn thành bài học
        </h1>
        
        <div className="text-center mb-6">
          <div className="text-lg text-gray-700 mb-2">
            Số trung bình chiều dài lá đã tính được:
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-5xl font-bold text-emerald-700"
          >
            {formatVietnameseNumber(currentMean, 2)} mm
          </motion.div>
        </div>
      </motion.div>

      {/* Key Learnings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card print-preserve"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          📚 Những kiến thức đã học được:
        </h2>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6 rounded-xl border border-green-200 shadow-md mb-6"
        >
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3 text-emerald-600">📈</div>
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-teal-600">Ý nghĩa của số trung bình của mẫu số liệu ghép nhóm</h3>
          </div>
          
          <div className="p-4 bg-white rounded-lg shadow-inner border border-green-100 print-preserve" style={{backgroundColor: "rgba(255, 255, 255, 0.9)"}}>
            <div className="pl-4 border-l-4 border-green-400">
              <p className="text-gray-700 mb-3 font-medium">
                Số trung bình <Math>{"\\bar{x}"}</Math> của mẫu số liệu ghép nhóm là <span className="text-green-600 font-semibold">giá trị trung bình xấp xỉ</span> của các số liệu trong mẫu.
              </p>
              <p className="text-gray-700">
                Nó có thể được xem như <span className="bg-green-100 px-2 py-1 rounded">giá trị trung tâm</span> của mẫu và nhiều khi được dùng làm một đại diện cho toàn bộ tập dữ liệu.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Process Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card bg-blue-50 border-blue-200 print-preserve"
      >
        <h2 className="text-2xl font-bold text-blue-800 mb-6">
          🔄 Quy trình đã thực hiện:
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: 1,
              title: "Phân loại dữ liệu",
              description: "Sắp xếp 32 giá trị vào 4 nhóm theo khoảng",
              icon: "📊",
              color: "bg-blue-100 text-blue-800"
            },            {
              step: 2,              title: "So sánh trung bình và Giá trị đại diện",
              description: "Đánh giá độ chính xác của Giá trị đại diện",
              icon: "⚖️",
              color: "bg-cyan-100 text-cyan-800"
            },
            {
              step: 3,
              title: "Tính trung bình tổng",
              description: "Áp dụng công thức trung bình mẫu số liệu ghép nhóm",
              icon: "🧮",
              color: "bg-emerald-100 text-emerald-800"
            },
            {
              step: 4,
              title: "Thí nghiệm và khám phá",
              description: "Quan sát ảnh hưởng của giá trị đại diện",
              icon: "🔬",
              color: "bg-purple-100 text-purple-800"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`${item.color} rounded-lg p-4 text-center`}
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="font-bold mb-1">Bước {item.step}</div>
              <div className="font-semibold text-sm mb-2">{item.title}</div>
              <div className="text-xs">{item.description}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Placeholder for spacing */}
      <div className="my-6"></div>

      {/* Placeholder for additional information */}
      <div className="my-8"></div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="flex justify-center space-x-6 mt-12 print-hide"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => resetLesson()}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium px-6 py-3 rounded-full shadow-lg transition-all duration-300"
        >
          <span className="text-xl">🔄</span>
          <span>Làm lại</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // Gọi hàm in một lần duy nhất
            if (!printingRef.current) {
              printingRef.current = true;
              window.print();
              setTimeout(() => {
                printingRef.current = false;
              }, 1000);
            }
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium px-6 py-3 rounded-full shadow-lg transition-all duration-300"
        >
          <span className="text-xl">🖨️</span>
          <span>In bài học</span>
        </motion.button>
      </motion.div>
      
      {/* Không có footer cho bản in */}
    </div>
  );
};
