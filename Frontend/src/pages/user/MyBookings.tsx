import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserBookings, cancelBooking } from '@/store/slices/bookingSlice';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Calendar, Clock, MapPin, Ticket, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useConfig } from '@/contexts/ConfigContext';

export function MyBookings() {
  const dispatch = useAppDispatch();
  const { bookings, pagination, isLoading } = useAppSelector((state) => state.bookings);
  const { platformFee, currencySymbol } = useConfig();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  // Fetch bookings on mount and when page/filter changes
  useEffect(() => {
    dispatch(
      fetchUserBookings({
        page: currentPage,
        limit: 10,
        ...(selectedStatus && { status: selectedStatus as any }),
      })
    );
  }, [dispatch, currentPage, selectedStatus]);

  const handleCancelBooking = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setCancelDialogOpen(true);
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    const result = await dispatch(cancelBooking(bookingToCancel));

    if (cancelBooking.fulfilled.match(result)) {
      toast.success('Booking cancelled successfully');
      setCancelDialogOpen(false);
      setBookingToCancel(null);
      // Refresh bookings list
      dispatch(
        fetchUserBookings({
          page: currentPage,
          limit: 10,
          ...(selectedStatus && { status: selectedStatus as any }),
        })
      );
    }
    // Error is automatically shown by errorMiddleware
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const canCancelBooking = (booking: any) => {
    // Can cancel if status is confirmed and show date is in the future
    if (booking.status !== 'confirmed') return false;

    const showDate = new Date(booking.show?.show_date || '');
    const now = new Date();
    return showDate > now;
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

  if (isLoading && currentPage === 1) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your ticket bookings</p>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          <Button
            variant={selectedStatus === '' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={selectedStatus === 'confirmed' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('confirmed')}
            size="sm"
          >
            Confirmed
          </Button>
          <Button
            variant={selectedStatus === 'cancelled' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('cancelled')}
            size="sm"
          >
            Cancelled
          </Button>
          <Button
            variant={selectedStatus === 'completed' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('completed')}
            size="sm"
          >
            Completed
          </Button>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Ticket className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No bookings yet</p>
              <p className="text-muted-foreground">Start booking tickets to see them here</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {booking.show?.movie?.poster_url && (
                        <img
                          src={booking.show.movie.poster_url}
                          alt={booking.show.movie.title || 'Movie'}
                          className="w-24 h-36 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">
                              {booking.show?.movie?.title || 'Unknown Movie'}
                            </h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">{currencySymbol}{booking.total_amount.toFixed(2)}</p>
                            <div className="text-xs text-muted-foreground mt-1">
                              <p>Tickets: {currencySymbol}{(booking.total_amount - platformFee).toFixed(2)}</p>
                              <p>Platform Fee: {currencySymbol}{platformFee.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                {booking.show?.theater?.name || 'Unknown Theater'}
                              </p>
                              <p className="text-muted-foreground">
                                {booking.show?.theater?.location || ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                {booking.show?.show_date
                                  ? format(new Date(booking.show.show_date), 'MMM d, yyyy')
                                  : 'N/A'}
                              </p>
                              <p className="text-muted-foreground">Show Date</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{booking.show?.show_time || 'N/A'}</p>
                              <p className="text-muted-foreground">Show Time</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                {booking.booking_seats
                                  ?.map((bs: any) => bs.seat?.seat_number)
                                  .filter(Boolean)
                                  .join(', ') || 'N/A'}
                              </p>
                              <p className="text-muted-foreground">Seats</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="text-xs text-muted-foreground">
                            Booked on {format(new Date(booking.booking_date), 'PPpp')}
                          </div>
                          {canCancelBooking(booking) && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel Booking
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4">
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
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Booking</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelBooking}>Yes, Cancel Booking</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
