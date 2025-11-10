import { Movie } from '@/lib/types';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, Calendar, Play, Film, User, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface MovieDetailsModalProps {
  movie: Movie | null;
  open: boolean;
  onClose: () => void;
  onBookNow?: () => void;
}

export function MovieDetailsModal({ movie, open, onClose, onBookNow }: MovieDetailsModalProps) {
  if (!movie) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 backdrop-blur-xl border-b border-border/50 px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent">
                  {movie.title}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold">{movie.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{movie.runtime} min</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(movie.release_date), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Left Column - Poster */}
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-2xl border border-border/50 transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              {movie.trailer_url && (
                <Button variant="outline" className="w-full group" asChild>
                  <a href={movie.trailer_url} target="_blank" rel="noopener noreferrer">
                    <Play className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                    Watch Trailer
                  </a>
                </Button>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Genres & Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Genres */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Film className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">Genres</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {movie.genre.map((g) => (
                      <Badge key={g} variant="secondary" className="px-3 py-1">
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">Language</h3>
                  </div>
                  <Badge variant="secondary" className="px-3 py-1">{(movie as any).language}</Badge>
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Synopsis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {(movie as any).description}
                </p>
              </div>

              {/* Director */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Director</h3>
                <p className="text-foreground">{(movie as any).director}</p>
              </div>

              {/* Cast */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Cast</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(movie as any).movie_cast?.map((actor: string) => (
                    <Badge key={actor} variant="outline" className="px-3 py-1">
                      {actor}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Fixed Footer */}
        {onBookNow && (
          <div className="sticky bottom-0 z-10 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 backdrop-blur-xl border-t border-border/50 px-6 py-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button
                onClick={onBookNow}
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40"
              >
                <Film className="w-5 h-5 mr-2" />
                Book Tickets Now
              </Button>
            </motion.div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
