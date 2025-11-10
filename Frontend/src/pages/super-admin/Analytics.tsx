import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import * as analyticsService from '@/services/analytics.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Film, Users, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export function Analytics() {
  const [stats, setStats] = useState({
    totalTheaters: 0,
    totalMovies: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getDashboardAnalytics({});

      setStats({
        totalTheaters: response.data.overview.total_theaters || 0,
        totalMovies: response.data.overview.total_movies || 0,
        totalUsers: response.data.overview.total_users || 0,
        totalRevenue: response.data.overview.total_revenue || 0,
      });
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast.error(error.error?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Theaters',
      value: stats.totalTheaters,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Total Movies',
      value: stats.totalMovies,
      icon: Film,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="full" text="Loading analytics..." variant="cinema" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Platform-wide statistics and insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
