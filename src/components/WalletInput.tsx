import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WalletInputProps {
  onAnalyze: (address: string) => void;
  isLoading: boolean;
}

const EXAMPLE_WALLETS = [
  'vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg',
  'AQFnRFkK8Jrxi91h2HCxQrdtdayWPSHKvAURR85ZeLWG',
  '4nepvZMsEGfK7GhFA4738VGTnQucnWwngN76Wem1EB4F',
];

export const WalletInput = ({ onAnalyze, isLoading }: WalletInputProps) => {
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim() && address.length >= 32) {
      onAnalyze(address.trim());
    }
  };

  const handleExampleClick = (wallet: string) => {
    setAddress(wallet);
    onAnalyze(wallet);
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Solana wallet address..."
          className="w-full h-14 pl-5 pr-32 text-base bg-card border-border focus:border-primary focus:ring-primary/20 rounded-xl"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || address.length < 32}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all glow-primary"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Analyze
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm text-muted-foreground">Try example:</span>
        {EXAMPLE_WALLETS.map((wallet, i) => (
          <Button
            key={i}
            variant="outline"
            size="sm"
            onClick={() => handleExampleClick(wallet)}
            disabled={isLoading}
            className="text-xs font-mono bg-secondary/50 border-border hover:border-primary/50 hover:bg-secondary"
          >
            {wallet.slice(0, 4)}...{wallet.slice(-4)}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};
