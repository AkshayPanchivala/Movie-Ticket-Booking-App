import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMovies, createMovie, updateMovie } from '@/store/slices/movieSlice';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Plus, Edit, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Movie } from '@/types/api.types';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Common languages for movies
const LANGUAGES = [
  'English',
  'Hindi',
  'Tamil',
  'Telugu',
  'Malayalam',
  'Kannada',
  'Bengali',
  'Marathi',
  'Gujarati',
  'Punjabi',
  'Spanish',
  'French',
  'German',
  'Japanese',
  'Korean',
  'Chinese',
  'Arabic',
  'Other'
];

export function ManageMovies() {
  const dispatch = useAppDispatch();
  const { movies, isLoading, isCreating, isUpdating } = useAppSelector((state) => state.movies);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    poster_url: '',
    trailer_url: '',
    director: '',
    genre: '',
    language: '',
    duration: '',
    movie_cast: '',
    rating: '',
    runtime: '',
  });
  const [releaseDate, setReleaseDate] = useState<Date | undefined>(undefined);

  // Fetch movies on mount
  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const movieData = {
      title: formData.title,
      description: formData.description,
      poster_url: formData.poster_url,
      trailer_url: formData.trailer_url || undefined,
      director: formData.director,
      genre: formData.genre.split(',').map((g) => g.trim()),
      language: formData.language,
      duration: parseInt(formData.duration),
      movie_cast: formData.movie_cast.split(',').map((c) => c.trim()),
      rating: parseFloat(formData.rating) || undefined,
      runtime: parseInt(formData.runtime),
      release_date: releaseDate ? releaseDate.toISOString().split('T')[0] : '',
    };

    if (editingMovie) {
      const result = await dispatch(updateMovie({ id: editingMovie.id, data: movieData }));
      if (updateMovie.fulfilled.match(result)) {
        toast.success('Movie updated successfully');
        setDialogOpen(false);
        resetForm();
      }
    } else {
      const result = await dispatch(createMovie(movieData));
      if (createMovie.fulfilled.match(result)) {
        toast.success('Movie added successfully');
        setDialogOpen(false);
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      poster_url: '',
      trailer_url: '',
      director: '',
      genre: '',
      language: '',
      duration: '',
      movie_cast: '',
      rating: '',
      runtime: '',
    });
    setReleaseDate(undefined);
    setEditingMovie(null);
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      poster_url: movie.poster_url,
      trailer_url: movie.trailer_url || '',
      director: movie.director,
      genre: movie.genre.join(', '),
      language: movie.language,
      duration: movie.duration.toString(),
      movie_cast: movie.movie_cast.join(', '),
      rating: movie.rating?.toString() || '',
      runtime: movie.runtime.toString(),
    });
    setReleaseDate(movie.release_date ? new Date(movie.release_date) : undefined);
    setDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Movies</h1>
            <p className="text-muted-foreground">Add and edit movies in the system</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Movie
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner size="md" text="Loading movies..." variant="cinema" />
        ) : movies.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No movies found. Start by adding your first movie!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {movies.map((movie) => (
              <Card key={movie.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-[2/3]">
                  <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />
                  {movie.rating && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/80 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-white text-xs font-semibold">{movie.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-1 mb-2">{movie.title}</h3>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleEdit(movie)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="poster_url">Poster URL</Label>
                <Input
                  id="poster_url"
                  value={formData.poster_url}
                  onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="trailer_url">Trailer URL (optional)</Label>
                <Input
                  id="trailer_url"
                  value={formData.trailer_url}
                  onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="director">Director</Label>
                <Input
                  id="director"
                  value={formData.director}
                  onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="genre">Genres (comma-separated)</Label>
                <Input
                  id="genre"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  placeholder="Action, Drama, Thriller"
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="movie_cast">Cast (comma-separated)</Label>
                <Input
                  id="movie_cast"
                  value={formData.movie_cast}
                  onChange={(e) => setFormData({ ...formData, movie_cast: e.target.value })}
                  placeholder="Actor 1, Actor 2, Actor 3"
                  required
                />
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData({ ...formData, language: value })}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating (0-10)</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="runtime">Runtime (minutes)</Label>
                <Input
                  id="runtime"
                  type="number"
                  min="1"
                  value={formData.runtime}
                  onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="release_date">Release Date</Label>
                <DatePicker
                  date={releaseDate}
                  onDateChange={setReleaseDate}
                  placeholder="Select release date"
                  disabled={isCreating || isUpdating}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating
                  ? (editingMovie ? 'Updating...' : 'Adding...')
                  : (editingMovie ? 'Update Movie' : 'Add Movie')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setDialogOpen(false); resetForm(); }}
                disabled={isCreating || isUpdating}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
