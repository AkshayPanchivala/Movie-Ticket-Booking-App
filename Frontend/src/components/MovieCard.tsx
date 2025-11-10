import { Movie } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
      className="cursor-pointer group"
      onClick={onClick}
    >
      <Card className="overflow-hidden h-full border border-border/50 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 bg-card">
        <div className="relative aspect-[2/3] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-primary to-amber-500 px-3 py-1.5 rounded-full shadow-lg z-20">
            <Star className="w-3.5 h-3.5 fill-primary-foreground text-primary-foreground" />
            <span className="text-primary-foreground text-xs font-bold">{movie.rating.toFixed(1)}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-center gap-2 text-white/90 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{movie.runtime} min</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {movie.genre.slice(0, 2).map((g) => (
                <Badge key={g} variant="secondary" className="text-xs bg-white/90 text-gray-900 hover:bg-white">
                  {g}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <CardContent className="p-4 bg-gradient-to-b from-card to-card/80">
          <h3 className="font-bold text-lg line-clamp-1 mb-2 text-foreground group-hover:text-primary transition-colors">{movie.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{movie.runtime} min</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
