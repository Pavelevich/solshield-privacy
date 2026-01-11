export interface DustAttack {
  dustAttackDetected: boolean;
  dustVulnerability: number;
  dustTransactionsReceived: number;
  uniqueDustSenders?: number;
  linkingRisk: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface ExchangeFingerprint {
  kycExposure: number;
  detectedExchanges: Array<{
    name: string;
    type: 'CEX' | 'DEX';
  }>;
  traceabilityRisk: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface Recommendation {
  action: string;
  impact: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface PrivacyAnalysis {
  advancedPrivacyScore: number;
  grade: string;
  riskLevel: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  entropy: { totalEntropy: number };
  mutualInformation: { totalMutualInformation: number };
  differentialPrivacy: { epsilon: number };
  kAnonymity: { kValue: number; kAnonymityScore: number };
  advancedClustering: { clusteringVulnerability: number };
  temporalAnalysis: { autocorrelation: number };
  networkCentrality: { networkVisibility: number };
  mixerDetection: { mixerUsageProbability: number };
  crossChain: { bridgeUsageDetected: boolean; detectedBridges: string[] };
  dustAttack: DustAttack;
  exchangeFingerprint: ExchangeFingerprint;
  recommendations: Recommendation[];
}

export interface APIResponse {
  success: boolean;
  data: PrivacyAnalysis;
}
