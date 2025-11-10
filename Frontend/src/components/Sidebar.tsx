import { useAppSelector } from '@/store/hooks';
import { cn } from '@/lib/utils';
import { NavLink } from 'react-router-dom';
import {
  Film,
  Ticket,
  Building2,
  Users,
  BarChart3,
  Monitor,
  IndianRupee,
} from 'lucide-react';

export function Sidebar() {
  const { user: profile } = useAppSelector((state) => state.auth);

  const userLinks = [
    { to: '/dashboard', icon: Film, label: 'Movies' },
    { to: '/bookings', icon: Ticket, label: 'My Bookings' },
  ];

  const theaterAdminLinks = [
    { to: '/dashboard', icon: Film, label: 'Movies' },
    { to: '/bookings', icon: Ticket, label: 'My Bookings' },
    { to: '/admin/movies', icon: Film, label: 'Manage Movies' },
    { to: '/admin/screens', icon: Monitor, label: 'Manage Screens' },
    { to: '/admin/shows', icon: Ticket, label: 'Manage Shows' },
    { to: '/admin/sales', icon: IndianRupee, label: 'Sales Report' },
  ];

  const superAdminLinks = [
    { to: '/dashboard', icon: Film, label: 'Movies' },
    { to: '/bookings', icon: Ticket, label: 'My Bookings' },
    { to: '/super-admin/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/super-admin/theaters', icon: Building2, label: 'Manage Theaters' },
    { to: '/super-admin/users', icon: Users, label: 'Manage Users' },
    { to: '/super-admin/movies', icon: Film, label: 'All Movies' },
  ];

  const getLinks = () => {
    if (profile?.role === 'super_admin') return superAdminLinks;
    if (profile?.role === 'theater_admin') return theaterAdminLinks;
    return userLinks;
  };

  const links = getLinks();

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] border-r border-border/50 bg-card/95 backdrop-blur-xl shadow-sm overflow-y-auto z-40 custom-scrollbar">
      <nav className="flex flex-col gap-1.5 p-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group',
                isActive
                  ? 'bg-gradient-to-r from-primary to-amber-500 text-primary-foreground shadow-lg shadow-primary/20'
                  : 'hover:bg-primary/5 text-muted-foreground hover:text-foreground border border-transparent hover:border-primary/20'
              )
            }
          >
            <link.icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
