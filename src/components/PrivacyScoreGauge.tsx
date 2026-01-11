import { motion } from 'framer-motion';

interface PrivacyScoreGaugeProps {
  score: number;
  grade: string;
  riskLevel: string;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return { stroke: 'url(#gradient-good)', bg: 'hsl(142, 71%, 45%)' };
  if (score >= 60) return { stroke: 'url(#gradient-medium)', bg: 'hsl(38, 92%, 50%)' };
  return { stroke: 'url(#gradient-bad)', bg: 'hsl(0, 84%, 60%)' };
};

const getRiskBadgeColor = (risk: string) => {
  switch (risk) {
    case 'MINIMAL': return 'bg-success/20 text-success border-success/30';
    case 'LOW': return 'bg-success/20 text-success border-success/30';
    case 'MEDIUM': return 'bg-warning/20 text-warning border-warning/30';
    case 'HIGH': return 'bg-destructive/20 text-destructive border-destructive/30';
    case 'CRITICAL': return 'bg-destructive/20 text-destructive border-destructive/30';
    default: return 'bg-muted text-muted-foreground border-border';
  }
};

export const PrivacyScoreGauge = ({ score, grade, riskLevel }: PrivacyScoreGaugeProps) => {
  const { stroke, bg } = getScoreColor(score);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="gradient-good" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(142, 71%, 45%)" />
              <stop offset="100%" stopColor="hsl(160, 84%, 39%)" />
            </linearGradient>
            <linearGradient id="gradient-medium" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(38, 92%, 50%)" />
              <stop offset="100%" stopColor="hsl(25, 95%, 53%)" />
            </linearGradient>
            <linearGradient id="gradient-bad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(0, 84%, 60%)" />
              <stop offset="100%" stopColor="hsl(330, 81%, 60%)" />
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(240, 4%, 16%)"
            strokeWidth="8"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-5xl font-bold"
            style={{ color: bg }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {score}
          </motion.span>
          <motion.span 
            className="text-lg font-semibold text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            Grade: {grade}
          </motion.span>
        </div>
      </div>
      
      <motion.span 
        className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getRiskBadgeColor(riskLevel)}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        {riskLevel} RISK
      </motion.span>
    </div>
  );
};
