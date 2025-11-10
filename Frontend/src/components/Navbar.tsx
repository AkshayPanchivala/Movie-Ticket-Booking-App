import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Moon, Sun, Film } from 'lucide-react';
import { useTheme } from 'next-themes';
import { showSuccessToast } from '@/lib/toast';

export function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user: profile } = useAppSelector((state) => state.auth);
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    await dispatch(logout());
    showSuccessToast('Logged out successfully');
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'theater_admin':
        return 'Theater Admin';
      default:
        return 'User';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/90 shadow-sm">
      <div className="flex h-16 items-center px-6 justify-between max-w-[2000px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-primary to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
            <Film className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-amber-500 to-yellow-600 bg-clip-text text-transparent tracking-tight">
              CineHub
            </span>
            <p className="text-[10px] text-muted-foreground -mt-1 uppercase tracking-widest font-semibold">
              Premium Cinema
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-xl border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all"
          >
            {theme === 'dark' ?
              <Sun className="h-5 w-5 text-foreground" /> :
              <Moon className="h-5 w-5 text-foreground" />
            }
          </Button>

          {profile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 gap-3 rounded-xl hover:bg-primary/10">
                  <Avatar className="h-9 w-9 border-2 border-primary/30">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-amber-600 text-primary-foreground font-bold">
                      {getInitials(profile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-foreground">{profile.full_name}</span>
                    <span className="text-xs text-primary font-medium">{getRoleBadge(profile.role)}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl border-border/50">
                <DropdownMenuLabel className="font-semibold text-foreground">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled className="text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  <span>{profile.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive hover:text-destructive hover:bg-destructive/10 font-medium">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
