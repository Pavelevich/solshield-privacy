import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MetricCardProps {
  icon: LucideIcon;
  name: string;
  value: number | string;
  percentage?: number;
  interpretation: string;
  tooltip: string;
  index: number;
}

export const MetricCard = ({ 
  icon: Icon, 
  name, 
  value, 
  percentage, 
  interpretation, 
  tooltip,
  index 
}: MetricCardProps) => {
  const displayPercentage = percentage !== undefined ? percentage : (typeof value === 'number' ? Math.min(value * 100, 100) : 0);
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          className="glass-card rounded-lg p-5 cursor-help hover:border-primary/50 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{name}</h3>
              <p className="text-2xl font-bold text-accent mt-1">
                {typeof value === 'number' ? value.toFixed(2) : value}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${displayPercentage}%` }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.05 }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{interpretation}</p>
          </div>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};
