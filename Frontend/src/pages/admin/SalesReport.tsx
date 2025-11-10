import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserBookings } from '@/store/slices/bookingSlice';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Ticket, TrendingUp, DollarSign, Users, Film } from 'lucide-react';
import { format } from 'date-fns';
import { useConfig } from '@/contexts/ConfigContext';

export function SalesReport() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { bookings, isLoading } = useAppSelector((state) => state.bookings);
  const { platformFee, currencySymbol } = useConfig();

  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  // Fetch all bookings for the theater
  useEffect(() => {
    if (user?.theater_id) {
      dispatch(fetchUserBookings({ limit: 1000 }));
    }
  }, [dispatch, user?.theater_id]);

  // Filter bookings for this theater only
  const theaterBookings = bookings.filter(
    (booking) => booking.show?.theater?.id === user?.theater_id
  );

  // Calculate statistics
  const totalRevenue = theaterBookings.reduce(
    (sum, booking) => sum + (booking.status === 'confirmed' || booking.status === 'completed' ? booking.total_amount : 0),
    0
  );

  const totalTickets = theaterBookings.reduce(
    (sum, booking) => sum + (booking.status === 'confirmed' || booking.status === 'completed' ? (booking.booking_seats?.length || 0) : 0),
    0
  );

  const totalBookings = theaterBookings.filter(
    (booking) => booking.status === 'confirmed' || booking.status === 'completed'
  ).length;

  const uniqueMovies = new Set(
    theaterBookings.map((booking) => booking.show?.movie?.id).filter(Boolean)
  ).size;

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

  if (isLoading) {
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
          <h1 className="text-3xl font-bold mb-2">Sales Report</h1>
          <p className="text-muted-foreground">Revenue and booking statistics for your theater</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currencySymbol}{totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From {totalBookings} bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTickets}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total seats booked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Confirmed bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Movies Shown</CardTitle>
              <Film className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueMovies}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Different movies
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {theaterBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Ticket className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No bookings found for your theater</p>
              </div>
            ) : (
              <div className="space-y-4">
                {theaterBookings.slice(0, 10).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{booking.show?.movie?.title || 'Unknown Movie'}</p>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {booking.show?.show_date
                            ? format(new Date(booking.show.show_date), 'MMM dd, yyyy')
                            : 'N/A'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {booking.show?.show_time || 'N/A'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Ticket className="w-3 h-3" />
                          {booking.booking_seats?.length || 0} seats
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{currencySymbol}{booking.total_amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(booking.booking_date), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Ticket Sales</span>
                <span className="font-bold">{currencySymbol}{(totalRevenue - (totalBookings * platformFee)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Platform Fees</span>
                <span className="font-bold">{currencySymbol}{(totalBookings * platformFee).toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-bold">Total Revenue</span>
                <span className="font-bold text-primary text-xl">{currencySymbol}{totalRevenue.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Confirmed</span>
                <span className="font-bold text-green-600">
                  {theaterBookings.filter((b) => b.status === 'confirmed').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-bold text-blue-600">
                  {theaterBookings.filter((b) => b.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cancelled</span>
                <span className="font-bold text-red-600">
                  {theaterBookings.filter((b) => b.status === 'cancelled').length}
                </span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-bold">Total Bookings</span>
                <span className="font-bold text-primary text-xl">{theaterBookings.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
