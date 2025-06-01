import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathProps {
  children: string;
  display?: boolean;
  className?: string;
}

export const Math: React.FC<MathProps> = ({ children, display = false, className = '' }) => {
  if (display) {
    return (
      <div className={`text-center my-4 ${className}`}>
        <BlockMath math={children} />
      </div>
    );
  }

  return (
    <span className={className}>
      <InlineMath math={children} />
    </span>
  );
};

export default Math;
