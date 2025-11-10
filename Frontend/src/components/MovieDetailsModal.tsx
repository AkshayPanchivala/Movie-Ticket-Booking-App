import { Movie } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, Calendar, Play } from 'lucide-react';
import { format } from 'date-fns';

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{movie.title}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
            />
            {movie.trailer_url && (
              <Button variant="outline" className="w-full" asChild>
                <a href={movie.trailer_url} target="_blank" rel="noopener noreferrer">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Trailer
                </a>
              </Button>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {movie.genre.map((g) => (
                <Badge key={g} variant="secondary">{g}</Badge>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{movie.rating.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{movie.runtime}</p>
                  <p className="text-xs text-muted-foreground">Minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-bold">{format(new Date(movie.release_date), 'MMM d, yyyy')}</p>
                  <p className="text-xs text-muted-foreground">Release</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Synopsis</h3>
              <p className="text-muted-foreground leading-relaxed">{movie.synopsis}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Cast</h3>
              <div className="flex flex-wrap gap-2">
                {movie.movie_cast.map((actor) => (
                  <Badge key={actor} variant="outline">{actor}</Badge>
                ))}
              </div>
            </div>

            {onBookNow && (
              <Button onClick={onBookNow} size="lg" className="w-full">
                Book Tickets
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
