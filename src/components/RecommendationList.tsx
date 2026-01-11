import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Recommendation } from '@/types/privacy';

interface RecommendationListProps {
  recommendations: Recommendation[];
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'HIGH':
      return 'bg-destructive';
    case 'MEDIUM':
      return 'bg-warning';
    case 'LOW':
      return 'bg-success';
    default:
      return 'bg-muted';
  }
};

export const RecommendationList = ({ recommendations }: RecommendationListProps) => {
  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
      
      {recommendations.map((rec, index) => (
        <motion.div
          key={index}
          className="glass-card rounded-lg p-4 flex items-start gap-4 hover:border-primary/50 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className={`w-1.5 h-full min-h-[3rem] rounded-full ${getPriorityColor(rec.priority)}`} />
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                rec.priority === 'HIGH' 
                  ? 'bg-destructive/20 text-destructive'
                  : rec.priority === 'MEDIUM'
                  ? 'bg-warning/20 text-warning'
                  : 'bg-success/20 text-success'
              }`}>
                {rec.priority}
              </span>
            </div>
            <p className="font-medium text-foreground flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-primary" />
              {rec.action}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{rec.impact}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
