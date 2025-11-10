import { Seat } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Armchair } from 'lucide-react';

interface SeatSelectionGridProps {
  seats: Seat[];
  bookedSeatIds: string[];
  selectedSeatIds: string[];
  onSeatToggle: (seatId: string) => void;
  rows: number;
  columns: number;
}

export function SeatSelectionGrid({
  seats,
  bookedSeatIds,
  selectedSeatIds,
  onSeatToggle,
  rows,
  columns,
}: SeatSelectionGridProps) {
  const seatMap = new Map<string, Seat>();
  seats.forEach((seat) => {
    seatMap.set(seat.seat_number, seat);
  });

  const rowLabels = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i));

  const getSeatStyles = (seat: Seat, isBooked: boolean, isSelected: boolean) => {
    if (isBooked) {
      return {
        className: 'bg-destructive/70 cursor-not-allowed border-destructive/50',
        hoverEffect: false,
      };
    }

    if (isSelected) {
      return {
        className: 'bg-gradient-to-br from-primary via-amber-500 to-yellow-600 text-primary-foreground border-primary shadow-lg shadow-primary/50',
        hoverEffect: true,
      };
    }

    switch (seat.seat_type) {
      case 'vip':
        return {
          className: 'bg-gradient-to-br from-purple-600 to-purple-800 text-white border-purple-500 shadow-md hover:shadow-purple-500/50',
          hoverEffect: true,
        };
      case 'premium':
        return {
          className: 'bg-gradient-to-br from-amber-600 to-amber-800 text-white border-amber-500 shadow-md hover:shadow-amber-500/50',
          hoverEffect: true,
        };
      default:
        return {
          className: 'bg-muted text-muted-foreground border-border hover:bg-muted/80 hover:border-primary/30',
          hoverEffect: true,
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Premium Screen Indicator */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-full max-w-3xl">
          <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full shadow-lg shadow-primary/30" />
          <div className="absolute inset-x-0 -bottom-1 h-8 bg-gradient-to-b from-primary/20 to-transparent blur-xl" />
        </div>
        <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-semibold text-foreground tracking-wider uppercase">Cinema Screen</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="flex flex-col items-center gap-3 py-4">
        {rowLabels.map((rowLabel, rowIndex) => (
          <motion.div
            key={rowLabel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
            className="flex items-center gap-3"
          >
            <span className="w-8 text-center text-sm font-bold text-foreground bg-primary/10 rounded-lg py-1 border border-primary/20">
              {rowLabel}
            </span>
            <div className="flex gap-2">
              {Array.from({ length: columns }, (_, colIndex) => {
                const seatNumber = `${rowLabel}${colIndex + 1}`;
                const seat = seatMap.get(seatNumber);
                const isBooked = seat ? bookedSeatIds.includes(seat.id) : false;
                const isSelected = seat ? selectedSeatIds.includes(seat.id) : false;

                if (!seat) {
                  return <div key={seatNumber} className="w-10 h-10" />;
                }

                const styles = getSeatStyles(seat, isBooked, isSelected);

                return (
                  <motion.button
                    key={seatNumber}
                    whileHover={styles.hoverEffect && !isBooked ? { scale: 1.15, y: -4 } : {}}
                    whileTap={styles.hoverEffect && !isBooked ? { scale: 0.9 } : {}}
                    disabled={isBooked}
                    onClick={() => onSeatToggle(seat.id)}
                    className={cn(
                      'relative w-10 h-10 rounded-t-xl text-xs font-bold transition-all duration-200',
                      'border-2 flex items-center justify-center',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      styles.className
                    )}
                    title={`${seat.seat_number} - ${seat.seat_type.toUpperCase()} ${isBooked ? '(Booked)' : isSelected ? '(Selected)' : ''}`}
                  >
                    <Armchair className="w-5 h-5" strokeWidth={2.5} />
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
            <span className="w-8 text-center text-sm font-bold text-foreground bg-primary/10 rounded-lg py-1 border border-primary/20">
              {rowLabel}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Premium Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-8 pt-6 border-t border-border/50">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-border/50 shadow-sm"
        >
          <div className="w-8 h-8 bg-muted rounded-t-xl border-2 border-border flex items-center justify-center">
            <Armchair className="w-4 h-4 text-muted-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground">Regular</span>
            <span className="text-[10px] text-muted-foreground">Standard Seat</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-border/50 shadow-sm"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-t-xl border-2 border-amber-500 flex items-center justify-center shadow-md shadow-amber-500/30">
            <Armchair className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground">Premium</span>
            <span className="text-[10px] text-muted-foreground">Enhanced Comfort</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-border/50 shadow-sm"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-t-xl border-2 border-purple-500 flex items-center justify-center shadow-md shadow-purple-500/30">
            <Armchair className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground">VIP</span>
            <span className="text-[10px] text-muted-foreground">Luxury Experience</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-border/50 shadow-sm"
        >
          <div className="relative w-8 h-8 bg-gradient-to-br from-primary via-amber-500 to-yellow-600 rounded-t-xl border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/50">
            <Armchair className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground">Selected</span>
            <span className="text-[10px] text-muted-foreground">Your Choice</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-border/50 shadow-sm"
        >
          <div className="w-8 h-8 bg-destructive/70 rounded-t-xl border-2 border-destructive/50 flex items-center justify-center opacity-50">
            <Armchair className="w-4 h-4 text-destructive-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground">Booked</span>
            <span className="text-[10px] text-muted-foreground">Not Available</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
