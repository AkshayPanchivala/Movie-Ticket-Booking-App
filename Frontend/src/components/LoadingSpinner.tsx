import { motion } from 'framer-motion';
import { Film, Popcorn, Ticket } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'full';
  text?: string;
  variant?: 'default' | 'cinema';
}

export function LoadingSpinner({ size = 'md', text, variant = 'default' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    full: 'min-h-[60vh]'
  };

  if (variant === 'cinema') {
    return (
      <div className={`flex flex-col items-center justify-center ${size === 'full' ? sizes.full : ''}`}>
        <div className="relative">
          {/* Orbiting icons */}
          <motion.div
            className="absolute"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="relative w-24 h-24">
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Film className="w-6 h-6 text-primary" />
              </motion.div>
              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.33 }}
              >
                <Popcorn className="w-6 h-6 text-amber-500" />
              </motion.div>
              <motion.div
                className="absolute left-0 top-1/2 -translate-y-1/2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.66 }}
              >
                <Ticket className="w-6 h-6 text-purple-500" />
              </motion.div>
            </div>
          </motion.div>

          {/* Center pulse */}
          <motion.div
            className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-16 h-16 rounded-full bg-primary/20" />
          </motion.div>
        </div>

        {text && (
          <motion.p
            className="mt-6 text-muted-foreground text-sm font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={`flex flex-col items-center justify-center ${size === 'full' ? sizes.full : ''}`}>
      <div className="relative">
        <motion.div
          className={`${size !== 'full' ? sizes[size] : 'h-16 w-16'} border-4 border-primary/30 rounded-full`}
          style={{ borderTopColor: 'hsl(var(--primary))' }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className={`absolute inset-0 ${size !== 'full' ? sizes[size] : 'h-16 w-16'} border-4 border-transparent rounded-full`}
          style={{ borderRightColor: 'hsl(var(--primary))' }}
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      {text && (
        <motion.p
          className="mt-4 text-muted-foreground text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Button loading spinner
export function ButtonSpinner({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
}
