import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Building2 } from 'lucide-react';
import type { DustAttack, ExchangeFingerprint } from '@/types/privacy';

interface DustAlertProps {
  data: DustAttack;
}

interface ExchangeAlertProps {
  data: ExchangeFingerprint;
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'MINIMAL':
    case 'LOW':
      return 'border-success/30 bg-success/5';
    case 'MEDIUM':
      return 'border-warning/30 bg-warning/5';
    case 'HIGH':
    case 'CRITICAL':
      return 'border-destructive/30 bg-destructive/5';
    default:
      return 'border-border bg-card';
  }
};

const getRiskTextColor = (risk: string) => {
  switch (risk) {
    case 'MINIMAL':
    case 'LOW':
      return 'text-success';
    case 'MEDIUM':
      return 'text-warning';
    case 'HIGH':
    case 'CRITICAL':
      return 'text-destructive';
    default:
      return 'text-foreground';
  }
};

export const DustAttackAlert = ({ data }: DustAlertProps) => {
  const isDetected = data.dustAttackDetected;
  
  return (
    <motion.div
      className={`rounded-lg border p-5 ${isDetected ? getRiskColor(data.linkingRisk) : 'border-success/30 bg-success/5'}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-lg ${isDetected ? 'bg-destructive/20' : 'bg-success/20'}`}>
          {isDetected ? (
            <AlertTriangle className="w-6 h-6 text-destructive" />
          ) : (
            <Shield className="w-6 h-6 text-success" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">Dust Attack Detection</h3>
          
          {isDetected ? (
            <div className="space-y-3">
              <p className="text-muted-foreground">
                Potential dust attack activity detected on this wallet.
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Dust Transactions:</span>
                  <span className="ml-2 font-medium text-foreground">{data.dustTransactionsReceived}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Unique Senders:</span>
                  <span className="ml-2 font-medium text-foreground">{data.uniqueDustSenders || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Vulnerability:</span>
                  <span className="ml-2 font-medium text-foreground">{(data.dustVulnerability * 100).toFixed(0)}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Linking Risk:</span>
                  <span className={`ml-2 font-medium ${getRiskTextColor(data.linkingRisk)}`}>
                    {data.linkingRisk}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-success">No dust attack activity detected.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ExchangeExposureAlert = ({ data }: ExchangeAlertProps) => {
  const cexCount = data.detectedExchanges.filter(e => e.type === 'CEX').length;
  const dexCount = data.detectedExchanges.filter(e => e.type === 'DEX').length;
  
  return (
    <motion.div
      className={`rounded-lg border p-5 ${getRiskColor(data.traceabilityRisk)}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-lg bg-primary/20">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">Exchange & KYC Exposure</h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">KYC Exposure:</span>
                <span className="ml-2 font-medium text-foreground">{(data.kycExposure * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Traceability Risk:</span>
                <span className={`ml-2 font-medium ${getRiskTextColor(data.traceabilityRisk)}`}>
                  {data.traceabilityRisk}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">CEX Detected:</span>
                <span className="ml-2 font-medium text-foreground">{cexCount}</span>
              </div>
              <div>
                <span className="text-muted-foreground">DEX Detected:</span>
                <span className="ml-2 font-medium text-foreground">{dexCount}</span>
              </div>
            </div>
            
            {data.detectedExchanges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {data.detectedExchanges.map((exchange, i) => (
                  <span
                    key={i}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      exchange.type === 'CEX' 
                        ? 'bg-destructive/20 text-destructive' 
                        : 'bg-accent/20 text-accent'
                    }`}
                  >
                    {exchange.name} ({exchange.type})
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
