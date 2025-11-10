import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSalesReport } from '@/store/slices/analyticsSlice';
import { DashboardLayout } from '@/components/DashboardLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Ticket, DollarSign, TrendingUp, RefreshCw } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useConfig } from '@/contexts/ConfigContext';
import { cn } from '@/lib/utils';

export function SalesReport() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { salesReport, isLoading } = useAppSelector((state) => state.analytics);
  const { currencySymbol } = useConfig();

  const [dateRange, setDateRange] = useState({
    date_from: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
    date_to: format(new Date(), 'yyyy-MM-dd'),
  });
  const [groupBy, setGroupBy] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Fetch sales report
  useEffect(() => {
    if (user?.theater_id) {
      dispatch(fetchSalesReport({
        theater_id: user.theater_id,
        date_from: dateRange.date_from,
        date_to: dateRange.date_to,
        group_by: groupBy,
      }));
    }
  }, [dispatch, user?.theater_id, dateRange, groupBy]);

  const handleRefresh = () => {
    if (user?.theater_id) {
      dispatch(fetchSalesReport({
        theater_id: user.theater_id,
        date_from: dateRange.date_from,
        date_to: dateRange.date_to,
        group_by: groupBy,
      }));
    }
  };

  const handleDateRangeChange = (days: number) => {
    setDateRange({
      date_from: format(subDays(new Date(), days), 'yyyy-MM-dd'),
      date_to: format(new Date(), 'yyyy-MM-dd'),
    });
  };

  if (isLoading && !salesReport) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="full" text="Loading sales report..." variant="cinema" />
      </DashboardLayout>
    );
  }

  const summary = salesReport?.summary || {
    total_bookings: 0,
    total_revenue: 0,
    average_ticket_price: 0,
    total_seats_sold: 0,
  };

  const salesByPeriod = salesReport?.sales_by_period || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sales Report</h1>
            <p className="text-muted-foreground">
              Revenue and booking statistics for your theater (Last {Math.ceil((new Date(dateRange.date_to).getTime() - new Date(dateRange.date_from).getTime()) / (1000 * 60 * 60 * 24))} days)
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={dateRange.date_from === format(subDays(new Date(), 7), 'yyyy-MM-dd') ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange(7)}
            >
              Last 7 Days
            </Button>
            <Button
              variant={dateRange.date_from === format(subDays(new Date(), 30), 'yyyy-MM-dd') ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange(30)}
            >
              Last 30 Days
            </Button>
            <Button
              variant={dateRange.date_from === format(subDays(new Date(), 90), 'yyyy-MM-dd') ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange(90)}
            >
              Last 90 Days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Group By Filter */}
        <div className="flex gap-2">
          <span className="text-sm text-muted-foreground self-center">Group by:</span>
          <Button
            variant={groupBy === 'daily' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setGroupBy('daily')}
          >
            Daily
          </Button>
          <Button
            variant={groupBy === 'weekly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setGroupBy('weekly')}
          >
            Weekly
          </Button>
          <Button
            variant={groupBy === 'monthly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setGroupBy('monthly')}
          >
            Monthly
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currencySymbol}{summary.total_revenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From {summary.total_bookings} bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Seats Sold</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total_seats_sold}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total seats booked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total_bookings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Confirmed bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Ticket Price</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currencySymbol}{summary.average_ticket_price.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Per ticket
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sales by Period */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Over Time ({groupBy.charAt(0).toUpperCase() + groupBy.slice(1)})</CardTitle>
          </CardHeader>
          <CardContent>
            {salesByPeriod.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No sales data available for the selected period</p>
              </div>
            ) : (
              <div className="space-y-3">
                {salesByPeriod.map((period, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{period.period}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {period.bookings} bookings
                        </div>
                        <div className="flex items-center gap-1">
                          <Ticket className="w-3 h-3" />
                          {period.seats_sold} seats
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">{currencySymbol}{period.revenue.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        {currencySymbol}{(period.revenue / period.bookings).toFixed(2)} avg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
