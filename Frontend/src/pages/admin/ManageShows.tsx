import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMovies } from '@/store/slices/movieSlice';
import { fetchScreensByTheater } from '@/store/slices/theaterSlice';
import { createShow } from '@/store/slices/showSlice';
import * as showService from '@/services/show.service';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, Clock, Film } from 'lucide-react';
import { toast } from 'sonner';
import { Show } from '@/types/api.types';
import { format } from 'date-fns';

export function ManageShows() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { movies } = useAppSelector((state) => state.movies);
  const { screens } = useAppSelector((state) => state.theaters);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theaterShows, setTheaterShows] = useState<Show[]>([]);
  const [isLoadingShows, setIsLoadingShows] = useState(false);

  const [formData, setFormData] = useState({
    movie_id: '',
    screen_id: '',
    show_date: '',
    show_time: '',
    price: '',
  });

  // Fetch movies and screens on mount
  useEffect(() => {
    dispatch(fetchMovies({ limit: 100 }));

    if (user?.theater_id) {
      dispatch(fetchScreensByTheater(user.theater_id));
    }
  }, [dispatch, user]);

  // Load theater shows when user is available
  useEffect(() => {
    if (user?.theater_id) {
      loadTheaterShows();
    }
  }, [user?.theater_id]);

  const loadTheaterShows = async () => {
    if (!user?.theater_id) return;

    try {
      setIsLoadingShows(true);

      // Fetch all shows for this theater (not just today's)
      const response = await showService.getAllShows({
        theater_id: user.theater_id,
        limit: 100 // Get up to 100 shows
      });

      setTheaterShows((response.data as any).shows || []);
    } catch (error: any) {
      console.error('Error loading shows:', error);
      toast.error('Failed to load shows');
    } finally {
      setIsLoadingShows(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.theater_id) {
      toast.error('No theater assigned to your account');
      return;
    }

    if (!formData.movie_id || !formData.screen_id || !formData.show_date || !formData.show_time || !formData.price) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const showData = {
        movie_id: formData.movie_id,
        screen_id: formData.screen_id,
        theater_id: user.theater_id,
        show_date: formData.show_date,
        show_time: formData.show_time,
        price: parseFloat(formData.price),
      };

      const result = await dispatch(createShow(showData));

      if (createShow.fulfilled.match(result)) {
        const newShow = result.payload;

        // Add the new show to the local state immediately
        setTheaterShows(prevShows => {
          // Insert the new show in sorted order (by date and time)
          const updatedShows = [...prevShows, newShow].sort((a, b) => {
            const dateCompare = new Date(a.show_date).getTime() - new Date(b.show_date).getTime();
            if (dateCompare !== 0) return dateCompare;
            return a.show_time.localeCompare(b.show_time);
          });
          return updatedShows;
        });

        toast.success('Show created successfully');
        setDialogOpen(false);
        resetForm();

        // Also refresh from server to ensure consistency
        loadTheaterShows();
      } else {
        toast.error('Failed to create show');
      }
    } catch (error: any) {
      console.error('Error creating show:', error);
      toast.error(error.error?.message || 'Failed to create show');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      movie_id: '',
      screen_id: '',
      show_date: '',
      show_time: '',
      price: '',
    });
  };

  if (!user?.theater_id && user?.role !== 'super_admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-muted-foreground">No theater assigned to your account.</p>
            <p className="text-sm text-muted-foreground mt-2">Please contact an administrator.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Get today's date for min date constraint
  const today = new Date().toISOString().split('T')[0];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Shows</h1>
            <p className="text-muted-foreground">Schedule movie shows for your theater</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Show
          </Button>
        </div>

        {isLoadingShows ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : theaterShows.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Film className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No shows scheduled. Add your first show to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {theaterShows.map((show) => (
              <Card key={show.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Film className="w-5 h-5 text-primary" />
                    {show.movie?.title || 'Movie'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {show.show_date ? format(new Date(show.show_date), 'MMM dd, yyyy') : 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {show.show_time}
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Screen</span>
                      <span className="font-medium">{show.screen?.name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-muted-foreground">Price</span>
                      <span className="font-bold text-primary">₹{show.price}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule New Show</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="movie">Movie</Label>
              <Select
                value={formData.movie_id}
                onValueChange={(value) => setFormData({ ...formData, movie_id: value })}
                required
              >
                <SelectTrigger id="movie">
                  <SelectValue placeholder="Select a movie" />
                </SelectTrigger>
                <SelectContent>
                  {movies.filter(m => m.is_active).map((movie) => (
                    <SelectItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="screen">Screen</Label>
              <Select
                value={formData.screen_id}
                onValueChange={(value) => setFormData({ ...formData, screen_id: value })}
                required
              >
                <SelectTrigger id="screen">
                  <SelectValue placeholder="Select a screen" />
                </SelectTrigger>
                <SelectContent>
                  {screens.filter(s => s.is_active).map((screen) => (
                    <SelectItem key={screen.id} value={screen.id}>
                      {screen.name} ({screen.total_seats} seats)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="show_date">Show Date</Label>
              <Input
                id="show_date"
                type="date"
                min={today}
                value={formData.show_date}
                onChange={(e) => setFormData({ ...formData, show_date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="show_time">Show Time</Label>
              <Input
                id="show_time"
                type="time"
                value={formData.show_time}
                onChange={(e) => setFormData({ ...formData, show_time: e.target.value })}
                placeholder="HH:MM (e.g., 14:30)"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Format: HH:MM (24-hour)</p>
            </div>

            <div>
              <Label htmlFor="price">Ticket Price (₹)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g., 250"
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Show'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setDialogOpen(false); resetForm(); }}
                disabled={isSubmitting}
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
