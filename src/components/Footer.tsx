import { Github, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-border py-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>Powered by</span>
            <a
              href="https://helius.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              Helius API
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Pavelevich/shadow-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">GitHub</span>
            </a>
          </div>

          <p className="text-muted-foreground text-sm">
            © 2026 SolPrivacy
          </p>
        </div>
      </div>
    </footer>
  );
};
