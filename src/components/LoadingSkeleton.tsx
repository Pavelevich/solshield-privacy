import { motion } from 'framer-motion';

export const LoadingSkeleton = () => {
  return (
    <motion.div
      className="w-full max-w-6xl mx-auto space-y-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Score Skeleton */}
      <div className="glass-card rounded-2xl p-8 flex flex-col items-center">
        <div className="w-48 h-48 rounded-full bg-muted animate-pulse" />
        <div className="w-24 h-6 bg-muted rounded-full mt-6 animate-pulse" />
      </div>

      {/* Metrics Grid Skeleton */}
      <div>
        <div className="w-40 h-6 bg-muted rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              className="glass-card rounded-lg p-5 space-y-4"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="w-24 h-4 bg-muted rounded animate-pulse" />
                  <div className="w-16 h-8 bg-muted rounded animate-pulse" />
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full animate-pulse" />
              <div className="w-full h-3 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Attack Detection Skeleton */}
      <div>
        <div className="w-40 h-6 bg-muted rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-muted animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="w-40 h-5 bg-muted rounded animate-pulse" />
                  <div className="w-full h-16 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
