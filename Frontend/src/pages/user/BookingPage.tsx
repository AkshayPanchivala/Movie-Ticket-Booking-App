import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMovieById } from '@/store/slices/movieSlice';
import { fetchTheaters } from '@/store/slices/theaterSlice';
import { fetchShowsByMovie, fetchAvailableSeats, clearAvailableSeats } from '@/store/slices/showSlice';
import { createBooking } from '@/store/slices/bookingSlice';
import { DashboardLayout } from '@/components/DashboardLayout';
import { TheaterSelector } from '@/components/TheaterSelector';
import { SeatSelectionGrid } from '@/components/SeatSelectionGrid';
import { PaymentModal } from '@/components/PaymentModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Show, Screen, SeatWithBookingStatus } from '@/types/api.types';

export function BookingPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux state
  const { selectedMovie: movie, isLoading: movieLoading } = useAppSelector((state) => state.movies);
  const { theaters } = useAppSelector((state) => state.theaters);
  const { shows, availableSeats, isLoading: showsLoading } = useAppSelector((state) => state.shows);
  const { isCreating: bookingLoading } = useAppSelector((state) => state.bookings);
  const { user } = useAppSelector((state) => state.auth);

  // Local state
  const [selectedTheaterId, setSelectedTheaterId] = useState<string | null>(null);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Generate dates for next 4 days (today + 3 more days)
  const getNextDates = () => {
    const dates = [];
    for (let i = 0; i < 4; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        dateStr: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        monthName: date.toLocaleDateString('en-US', { month: 'short' }),
        isToday: i === 0
      });
    }
    return dates;
  };

  const availableDates = getNextDates();

  // Fetch movie and theaters on mount
  useEffect(() => {
    if (!movieId || movieId === 'undefined') {
      toast.error('Invalid movie selection. Redirecting...');
      navigate('/dashboard');
      return;
    }

    dispatch(fetchMovieById(movieId));
    dispatch(fetchTheaters());
  }, [dispatch, movieId, navigate]);

  // Fetch shows when theater is selected
  useEffect(() => {
    if (movieId && selectedTheaterId) {
      const today = new Date().toISOString().split('T')[0];
      dispatch(
        fetchShowsByMovie({
          movieId,
          params: {
            theater_id: selectedTheaterId,
            date: selectedDate || today,
          },
        })
      );
    }
  }, [dispatch, movieId, selectedTheaterId, selectedDate]);

  // Fetch available seats when show is selected
  useEffect(() => {
    if (selectedShow) {
      dispatch(fetchAvailableSeats(selectedShow.id));
      setSelectedSeatIds([]); // Clear selected seats when changing shows
    } else {
      dispatch(clearAvailableSeats());
    }
  }, [dispatch, selectedShow]);

  // Error handling is done automatically by errorMiddleware
  // No manual error toasts needed

  const handleSeatToggle = (seatId: string) => {
    setSelectedSeatIds((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const handleProceedToPayment = () => {
    if (!selectedShow || !user || selectedSeatIds.length === 0) return;
    setPaymentModalOpen(true);
  };

  const handleConfirmPayment = async (paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet' | 'stripe', paymentDetails: Record<string, any>) => {
    if (!selectedShow || !user || selectedSeatIds.length === 0) return;

    const bookingData: any = {
      show_id: selectedShow.id,
      seat_ids: selectedSeatIds,
      payment_method: paymentMethod,
      payment_details: paymentDetails,
    };

    // Add payment_intent_id at root level for Stripe payments
    if (paymentDetails.payment_intent_id) {
      bookingData.payment_intent_id = paymentDetails.payment_intent_id;
    }

    const result = await dispatch(createBooking(bookingData));

    if (createBooking.fulfilled.match(result)) {
      toast.success(`Booking confirmed! Successfully booked ${selectedSeatIds.length} seat(s) for ${movie?.title}`);
      setPaymentModalOpen(false);
      navigate('/bookings');
    } else {
      toast.error('Failed to create booking. Please try again.');
    }
  };

  // Show loading spinner while fetching initial data
  if (movieLoading || !movie) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="full" text="Loading movie details..." variant="cinema" />
      </DashboardLayout>
    );
  }

  // Extract screen info from availableSeats response
  const screen: Screen | null = selectedShow?.screen || null;
  const seats: SeatWithBookingStatus[] = availableSeats?.seats || [];
  const bookedSeatIds = seats.filter((s) => s.is_booked).map((s) => s.id);
  const totalAmount = selectedShow ? selectedShow.price * selectedSeatIds.length : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Book Tickets</h1>
          <p className="text-muted-foreground">{movie.title}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Theater</CardTitle>
              </CardHeader>
              <CardContent>
                <TheaterSelector
                  theaters={theaters as any}
                  selectedTheaterId={selectedTheaterId}
                  onSelect={setSelectedTheaterId}
                />
              </CardContent>
            </Card>

            {selectedTheaterId && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Select Date</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                        {availableDates.map((date) => (
                          <motion.button
                            key={date.dateStr}
                            onClick={() => {
                              setSelectedDate(date.dateStr);
                              setSelectedShow(null); // Reset show when date changes
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                              "flex-shrink-0 w-24 h-28 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1",
                              selectedDate === date.dateStr
                                ? "bg-gradient-to-br from-primary to-amber-500 border-primary shadow-lg shadow-primary/30 text-white"
                                : "bg-card border-border hover:border-primary/50 hover:shadow-md"
                            )}
                          >
                            <span className="text-xs font-medium uppercase opacity-80">
                              {date.dayName}
                            </span>
                            <span className="text-3xl font-bold">
                              {date.dayNum}
                            </span>
                            <span className="text-sm font-medium uppercase opacity-90">
                              {date.monthName}
                            </span>
                            {date.isToday && (
                              <span className={cn(
                                "text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full mt-1",
                                selectedDate === date.dateStr
                                  ? "bg-white/20"
                                  : "bg-primary/10 text-primary"
                              )}>
                                Today
                              </span>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Select Show Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                  {showsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : shows.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No shows available for {format(new Date(selectedDate), 'EEEE, MMMM d')}.</p>
                      <p className="text-sm mt-2">Please select a different date or theater.</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {shows.map((show) => (
                        <motion.div
                          key={show.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant={selectedShow?.id === show.id ? 'default' : 'outline'}
                            onClick={() => setSelectedShow(show)}
                            className={cn(
                              "min-w-[120px] h-14 text-base font-semibold transition-all duration-200",
                              selectedShow?.id === show.id
                                ? "bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 shadow-lg shadow-primary/20"
                                : "hover:border-primary/50 hover:bg-primary/5"
                            )}
                          >
                            <Clock className="w-5 h-5 mr-2" />
                            {show.show_time}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              </>
            )}

            {selectedShow && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Seats</CardTitle>
                </CardHeader>
                <CardContent>
                  {showsLoading ? (
                    <LoadingSpinner size="md" text="Loading seat availability..." variant="cinema" />
                  ) : !availableSeats || seats.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No seat information available.</p>
                    </div>
                  ) : (
                    <SeatSelectionGrid
                      seats={seats as any}
                      bookedSeatIds={bookedSeatIds}
                      selectedSeatIds={selectedSeatIds}
                      onSeatToggle={handleSeatToggle}
                      rows={screen?.rows || 10}
                      columns={screen?.columns || 10}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Movie</span>
                      <span className="font-medium">{movie.title}</span>
                    </div>
                    {selectedShow && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Date</span>
                          <span className="font-medium">
                            {format(new Date(selectedShow.show_date), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Time</span>
                          <span className="font-medium">{selectedShow.show_time}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Screen</span>
                          <span className="font-medium">{screen?.name}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Seats</span>
                      <span className="font-medium">
                        {selectedSeatIds.length > 0
                          ? selectedSeatIds
                              .map((id) => seats.find((s) => s.id === id)?.seat_number)
                              .join(', ')
                          : 'None'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount</span>
                      <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
                    </div>
                    {selectedSeatIds.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center">
                        Please select at least one seat to proceed
                      </p>
                    )}
                  </div>

                  <Button
                    className={cn(
                      "w-full font-semibold text-base transition-all duration-200",
                      selectedSeatIds.length === 0
                        ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60 hover:opacity-60"
                        : "bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
                    )}
                    size="lg"
                    disabled={selectedSeatIds.length === 0}
                    onClick={handleProceedToPayment}
                  >
                    {selectedSeatIds.length === 0 ? 'Select Seats to Continue' : 'Proceed to Payment'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Payment Modal */}
        <PaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          onConfirmPayment={handleConfirmPayment}
          totalAmount={totalAmount}
          movieTitle={movie.title}
          seatCount={selectedSeatIds.length}
          processing={bookingLoading}
          showId={selectedShow?.id}
          seatIds={selectedSeatIds}
        />
      </div>
    </DashboardLayout>
  );
}
