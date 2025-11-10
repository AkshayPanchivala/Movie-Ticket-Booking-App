import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMovies } from '@/store/slices/movieSlice';
import { DashboardLayout } from '@/components/DashboardLayout';
import { MovieCard } from '@/components/MovieCard';
import { MovieDetailsModal } from '@/components/MovieDetailsModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Movie } from '@/types/api.types';

export function MoviesList() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { movies, pagination, isLoading } = useAppSelector((state) => state.movies);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenre] = useState('');

  // Fetch movies on mount and when filters change
  useEffect(() => {
    dispatch(
      fetchMovies({
        page: currentPage,
        limit: 20,
        ...(searchQuery && { search: searchQuery }),
        ...(selectedGenre && { genre: selectedGenre }),
      })
    );
  }, [dispatch, currentPage, searchQuery, selectedGenre]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleBookNow = () => {
    if (selectedMovie) {
      navigate(`/booking/${selectedMovie.id}`);
    }
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.total_pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Now Showing</h1>
          <p className="text-muted-foreground">Discover the latest movies and book your tickets</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search movies or directors..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie as any}
                  onClick={() => setSelectedMovie(movie)}
                />
              ))}
            </motion.div>

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1 || isLoading}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.total_pages}
                </span>
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={currentPage === pagination.total_pages || isLoading}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}

        {!isLoading && movies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery
                ? 'No movies found matching your search.'
                : 'No movies available at the moment.'}
            </p>
          </div>
        )}
      </div>

      <MovieDetailsModal
        movie={selectedMovie as any}
        open={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onBookNow={handleBookNow}
      />
    </DashboardLayout>
  );
}
