import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';
import { WalletInput } from '@/components/WalletInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import type { PrivacyAnalysis } from '@/types/privacy';

// Use relative URL for API (proxied through nginx)
const API_URL = import.meta.env.VITE_API_URL || '';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<PrivacyAnalysis | null>(null);
  const [analyzedWallet, setAnalyzedWallet] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleAnalyze = async (address: string) => {
    setIsLoading(true);
    setAnalyzedWallet(address);
    
    // Scroll to results area
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const response = await fetch(`${API_URL}/api/v3/analyze/${address}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      setAnalysisData(result.data);
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: 'Unable to analyze wallet. Please check the address and try again.',
        variant: 'destructive',
      });
      setAnalysisData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <Shield className="w-8 h-8 text-primary" />
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">SolPrivacy</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-4">
            Wallet Privacy Analyzer for Solana
          </p>

          <a
            href="https://dexscreener.com/solana/8i51xnnpgakaj4g4nddmqh95v4fkaxw8mhtarokd9te8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12"
          >
            Powered by <span className="font-semibold">TETSUO</span> on Solana
          </a>

          <WalletInput onAnalyze={handleAnalyze} isLoading={isLoading} />
        </motion.div>
      </section>

      {/* Results Section */}
      <section ref={resultsRef} className="container mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSkeleton />
            </motion.div>
          )}
          
          {!isLoading && analysisData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AnalysisResults data={analysisData} walletAddress={analyzedWallet} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Spacer to push footer down */}
      <div className="flex-1" />

      <Footer />
    </div>
  );
};

export default Index;
