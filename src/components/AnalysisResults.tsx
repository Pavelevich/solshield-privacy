import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import {
  Activity,
  Share2,
  Lock,
  Users,
  GitBranch,
  Clock,
  Network,
  Shuffle,
  Link2,
  AlertTriangle,
  Building2,
} from 'lucide-react';
import { PrivacyScoreGauge } from './PrivacyScoreGauge';
import { MetricCard } from './MetricCard';
import { DustAttackAlert, ExchangeExposureAlert } from './AttackAlert';
import { RecommendationList } from './RecommendationList';
import type { PrivacyAnalysis } from '@/types/privacy';
import { Button } from '@/components/ui/button';

interface AnalysisResultsProps {
  data: PrivacyAnalysis;
  walletAddress: string;
}

const metrics = [
  {
    key: 'entropy',
    icon: Activity,
    name: 'Shannon Entropy',
    getValue: (d: PrivacyAnalysis) => d.entropy.totalEntropy,
    getPercentage: (d: PrivacyAnalysis) => d.entropy.totalEntropy * 100,
    interpret: (v: number) => v > 0.7 ? 'High randomness, good privacy' : v > 0.4 ? 'Moderate patterns detected' : 'Low entropy, predictable behavior',
    tooltip: 'Measures the randomness and unpredictability of your transaction patterns. Higher entropy means better privacy.',
  },
  {
    key: 'mutualInfo',
    icon: Share2,
    name: 'Mutual Information',
    getValue: (d: PrivacyAnalysis) => d.mutualInformation.totalMutualInformation,
    getPercentage: (d: PrivacyAnalysis) => (1 - d.mutualInformation.totalMutualInformation) * 100,
    interpret: (v: number) => v < 0.3 ? 'Low correlation with known entities' : v < 0.6 ? 'Some correlations found' : 'High correlation risk',
    tooltip: 'Indicates how much information about your wallet can be inferred from public data. Lower is better.',
  },
  {
    key: 'differential',
    icon: Lock,
    name: 'Differential Privacy',
    getValue: (d: PrivacyAnalysis) => `ε = ${d.differentialPrivacy.epsilon.toFixed(2)}`,
    getPercentage: (d: PrivacyAnalysis) => Math.max(0, 100 - d.differentialPrivacy.epsilon * 10),
    interpret: (v: string) => {
      const eps = parseFloat(v.split('=')[1]);
      return eps < 1 ? 'Strong privacy guarantees' : eps < 3 ? 'Moderate privacy level' : 'Weak differential privacy';
    },
    tooltip: 'Epsilon (ε) value indicating the level of privacy protection. Lower epsilon means stronger privacy guarantees.',
  },
  {
    key: 'kAnon',
    icon: Users,
    name: 'k-Anonymity',
    getValue: (d: PrivacyAnalysis) => d.kAnonymity.kValue,
    getPercentage: (d: PrivacyAnalysis) => d.kAnonymity.kAnonymityScore,
    interpret: (v: number) => v >= 50 ? 'Blends well with crowd' : v >= 20 ? 'Moderate anonymity set' : 'Low k-value, identifiable',
    tooltip: 'Shows how many similar wallets exist. Higher k-value means you blend in better with the crowd.',
  },
  {
    key: 'clustering',
    icon: GitBranch,
    name: 'Clustering Vulnerability',
    getValue: (d: PrivacyAnalysis) => d.advancedClustering.clusteringVulnerability,
    getPercentage: (d: PrivacyAnalysis) => (1 - d.advancedClustering.clusteringVulnerability) * 100,
    interpret: (v: number) => v < 0.3 ? 'Hard to cluster' : v < 0.6 ? 'Some clustering patterns' : 'Highly clusterable',
    tooltip: 'Measures how easily your wallet can be grouped with related addresses through heuristic analysis.',
  },
  {
    key: 'temporal',
    icon: Clock,
    name: 'Temporal Patterns',
    getValue: (d: PrivacyAnalysis) => d.temporalAnalysis.autocorrelation,
    getPercentage: (d: PrivacyAnalysis) => (1 - d.temporalAnalysis.autocorrelation) * 100,
    interpret: (v: number) => v < 0.2 ? 'Random timing patterns' : v < 0.5 ? 'Some time-based patterns' : 'Predictable timing',
    tooltip: 'Analyzes if your transactions follow predictable time patterns that could be used to identify you.',
  },
  {
    key: 'centrality',
    icon: Network,
    name: 'Network Centrality',
    getValue: (d: PrivacyAnalysis) => d.networkCentrality.networkVisibility,
    getPercentage: (d: PrivacyAnalysis) => (1 - d.networkCentrality.networkVisibility) * 100,
    interpret: (v: number) => v < 0.2 ? 'Low network visibility' : v < 0.5 ? 'Moderate visibility' : 'High network prominence',
    tooltip: 'PageRank-based measure of how central and visible your wallet is in the transaction network.',
  },
  {
    key: 'mixer',
    icon: Shuffle,
    name: 'Mixer Detection',
    getValue: (d: PrivacyAnalysis) => d.mixerDetection.mixerUsageProbability,
    getPercentage: (d: PrivacyAnalysis) => d.mixerDetection.mixerUsageProbability * 100,
    interpret: (v: number) => v > 0.7 ? 'Likely mixer usage detected' : v > 0.3 ? 'Possible mixing activity' : 'No mixer patterns detected',
    tooltip: 'Probability that this wallet has interacted with mixing services or privacy protocols.',
  },
  {
    key: 'crosschain',
    icon: Link2,
    name: 'Cross-chain Linkability',
    getValue: (d: PrivacyAnalysis) => d.crossChain.bridgeUsageDetected ? 'Detected' : 'None',
    getPercentage: (d: PrivacyAnalysis) => d.crossChain.bridgeUsageDetected ? 30 : 100,
    interpret: (v: string) => v === 'Detected' ? 'Bridge activity may link identities' : 'No cross-chain bridges detected',
    tooltip: 'Detects if bridge usage could link this wallet to addresses on other chains.',
  },
  {
    key: 'dust',
    icon: AlertTriangle,
    name: 'Dust Attack Detection',
    getValue: (d: PrivacyAnalysis) => d.dustAttack.dustAttackDetected ? 'Detected' : 'Clear',
    getPercentage: (d: PrivacyAnalysis) => d.dustAttack.dustAttackDetected ? (1 - d.dustAttack.dustVulnerability) * 100 : 100,
    interpret: (v: string) => v === 'Detected' ? 'Dust attack activity found' : 'No dust attacks detected',
    tooltip: 'Identifies if small "dust" transactions have been sent to track your wallet activity.',
  },
  {
    key: 'kyc',
    icon: Building2,
    name: 'Exchange/KYC Exposure',
    getValue: (d: PrivacyAnalysis) => `${(d.exchangeFingerprint.kycExposure * 100).toFixed(1)}%`,
    getPercentage: (d: PrivacyAnalysis) => (1 - d.exchangeFingerprint.kycExposure) * 100,
    interpret: (v: string) => {
      const pct = parseFloat(v);
      return pct < 10 ? 'Minimal KYC exposure' : pct < 30 ? 'Some exchange activity' : 'High exchange exposure';
    },
    tooltip: 'Percentage of transactions that can be linked to KYC-required exchanges.',
  },
];

export const AnalysisResults = ({ data, walletAddress }: AnalysisResultsProps) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto space-y-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Wallet Address */}
      <motion.div
        className="flex items-center justify-center gap-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <code className="text-sm font-mono text-muted-foreground bg-secondary/50 px-4 py-2 rounded-lg">
          {walletAddress}
        </code>
        <Button
          variant="ghost"
          size="icon"
          onClick={copyAddress}
          className="h-9 w-9"
        >
          {copied ? (
            <Check className="w-4 h-4 text-success" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </motion.div>

      {/* Privacy Score */}
      <motion.div
        className="glass-card rounded-2xl p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-center text-lg font-medium text-muted-foreground mb-6">Privacy Score</h2>
        <PrivacyScoreGauge
          score={data.advancedPrivacyScore}
          grade={data.grade}
          riskLevel={data.riskLevel}
        />
      </motion.div>

      {/* Metrics Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Privacy Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => {
            const value = metric.getValue(data);
            return (
            <MetricCard
              key={metric.key}
              icon={metric.icon}
              name={metric.name}
              value={value}
              percentage={metric.getPercentage(data)}
              interpretation={typeof value === 'number' ? (metric.interpret as (v: number) => string)(value) : (metric.interpret as (v: string) => string)(String(value))}
              tooltip={metric.tooltip}
              index={index}
            />
          )})}
        </div>
      </div>

      {/* Attack Detection */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Attack Detection</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DustAttackAlert data={data.dustAttack} />
          <ExchangeExposureAlert data={data.exchangeFingerprint} />
        </div>
      </div>

      {/* Recommendations */}
      {data.recommendations.length > 0 && (
        <RecommendationList recommendations={data.recommendations} />
      )}
    </motion.div>
  );
};
