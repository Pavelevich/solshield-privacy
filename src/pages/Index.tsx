import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';
import { WalletInput } from '@/components/WalletInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import type { PrivacyAnalysis } from '@/types/privacy';

// Mock data for demo (replace with actual API call)
const mockAnalysis: PrivacyAnalysis = {
  advancedPrivacyScore: 55,
  grade: 'D',
  riskLevel: 'MEDIUM',
  entropy: { totalEntropy: 0.65 },
  mutualInformation: { totalMutualInformation: 0.3 },
  differentialPrivacy: { epsilon: 2.3 },
  kAnonymity: { kValue: 15, kAnonymityScore: 45 },
  advancedClustering: { clusteringVulnerability: 0.4 },
  temporalAnalysis: { autocorrelation: 0.2 },
  networkCentrality: { networkVisibility: 0.35 },
  mixerDetection: { mixerUsageProbability: 0.1 },
  crossChain: { bridgeUsageDetected: false, detectedBridges: [] },
  dustAttack: {
    dustAttackDetected: true,
    dustVulnerability: 0.7,
    dustTransactionsReceived: 12,
    uniqueDustSenders: 5,
    linkingRisk: 'CRITICAL',
  },
  exchangeFingerprint: {
    kycExposure: 0.08,
    detectedExchanges: [
      { name: 'Raydium', type: 'DEX' },
      { name: 'Jupiter', type: 'DEX' },
    ],
    traceabilityRisk: 'LOW',
  },
  recommendations: [
    {
      action: 'Consider using a privacy-focused wallet or mixer',
      impact: 'Significantly improve transaction unlinkability',
      priority: 'HIGH',
    },
    {
      action: 'Avoid reusing addresses for receiving funds',
      impact: 'Reduces clustering vulnerability',
      priority: 'HIGH',
    },
    {
      action: 'Randomize transaction timing patterns',
      impact: 'Makes temporal analysis more difficult',
      priority: 'MEDIUM',
    },
    {
      action: 'Do not interact with dust transactions',
      impact: 'Prevents dust attack linking',
      priority: 'HIGH',
    },
    {
      action: 'Use DEX aggregators to obscure trading patterns',
      impact: 'Reduces exchange fingerprinting accuracy',
      priority: 'LOW',
    },
  ],
};

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
      // Simulate API call with delay
      // Replace this with actual API call:
      // const response = await fetch(`/api/v3/analyze/${address}`);
      // const data = await response.json();
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Using mock data for demo
      setAnalysisData(mockAnalysis);
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
          
          <p className="text-xl text-muted-foreground mb-12">
            Wallet Privacy Analyzer for Solana
          </p>

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
