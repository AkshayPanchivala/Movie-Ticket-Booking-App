import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FooterProps {
  variant?: 'default' | 'dark';
}

export function Footer({ variant = 'default' }: FooterProps) {
  const isDark = variant === 'dark';

  return (
    <footer className={cn(
      "w-full border-t backdrop-blur-sm",
      isDark
        ? "border-white/10 bg-gradient-to-r from-slate-900/80 via-purple-900/40 to-slate-900/80"
        : "border-border/40 bg-gradient-to-r from-background via-muted/20 to-background"
    )}>
      <div className="w-full px-6 py-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Left: Copyright */}
          <div className={cn(
            "text-xs",
            isDark ? "text-white/70" : "text-muted-foreground"
          )}>
            © 2025 CineHub
          </div>

          {/* Center: Made with love */}
          <div className={cn(
            "flex items-center gap-1 text-xs",
            isDark ? "text-white/70" : "text-muted-foreground"
          )}>
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
            <span>by</span>
            <a
              href="https://akshaypanchivala.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "font-semibold hover:underline transition-colors",
                isDark ? "text-purple-400 hover:text-purple-300" : "text-primary hover:text-primary/80"
              )}
            >
              Akshay Panchivala
            </a>
          </div>

          {/* Right: Contact Us Button */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className={cn(
              "transition-all duration-200 h-7 px-3 text-xs",
              isDark
                ? "border-purple-400/70 bg-purple-500/10 text-white hover:bg-purple-500/30 hover:border-purple-300 hover:text-white"
                : "hover:bg-primary hover:text-primary-foreground"
            )}
          >
            <a
              href="https://akshaypanchivala.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(isDark && "text-white")}
            >
              Contact Us
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
