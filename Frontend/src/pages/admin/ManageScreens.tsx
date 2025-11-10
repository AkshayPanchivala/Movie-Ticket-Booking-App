import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchScreensByTheater } from '@/store/slices/theaterSlice';
import * as screenService from '@/services/screen.service';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Armchair } from 'lucide-react';
import { toast } from 'sonner';
import { Screen } from '@/types/api.types';

export function ManageScreens() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { screens, isLoading } = useAppSelector((state) => state.theaters);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState<Screen | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    rows: '',
    columns: '',
  });

  // Fetch screens on mount if user has theater access
  useEffect(() => {
    if (user?.theater_id) {
      dispatch(fetchScreensByTheater(user.theater_id));
    }
  }, [dispatch, user]);

  const generateSeats = async (screenId: string, rows: number, columns: number) => {
    // Generate seats in standard layout (A-Z rows, numbered columns)
    const seats = [];
    const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let r = 0; r < rows; r++) {
      for (let c = 1; c <= columns; c++) {
        seats.push({
          row: rowLetters[r],
          column: c,
          seat_type: (r < 2 ? 'premium' : 'regular') as 'regular' | 'premium' | 'vip',
        });
      }
    }

    try {
      await screenService.createSeatsBulk(screenId, { seats });
      toast.success(`Generated ${seats.length} seats successfully`);
    } catch (error: any) {
      toast.error(error.error?.message || 'Failed to generate seats');
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.theater_id) {
      toast.error('No theater assigned to your account');
      return;
    }

    setIsSubmitting(true);

    try {
      const rows = parseInt(formData.rows);
      const columns = parseInt(formData.columns);
      const totalSeats = rows * columns;

      const screenData = {
        theater_id: user.theater_id,
        name: formData.name,
        rows,
        columns,
        total_seats: totalSeats,
      };

      if (editingScreen) {
        // Update existing screen
        await screenService.updateScreen(editingScreen.id, screenData);
        toast.success('Screen updated successfully');
      } else {
        // Create new screen
        const response = await screenService.createScreen(screenData);
        const newScreen = response.data;

        // Generate seats for the new screen
        await generateSeats(newScreen.id, rows, columns);
        toast.success('Screen and seats created successfully');
      }

      setDialogOpen(false);
      resetForm();

      // Refresh screens list
      if (user.theater_id) {
        dispatch(fetchScreensByTheater(user.theater_id));
      }
    } catch (error: any) {
      console.error('Error saving screen:', error);
      toast.error(error.error?.message || 'Failed to save screen');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', rows: '', columns: '' });
    setEditingScreen(null);
  };

  const handleEdit = (screen: Screen) => {
    setEditingScreen(screen);
    setFormData({
      name: screen.name,
      rows: screen.rows.toString(),
      columns: screen.columns.toString(),
    });
    setDialogOpen(true);
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Screens</h1>
            <p className="text-muted-foreground">Manage theater screens and seating</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Screen
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : screens.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Armchair className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No screens found. Add your first screen to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {screens.map((screen) => (
              <Card key={screen.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-xl mb-1">{screen.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {screen.rows} rows × {screen.columns} columns
                      </p>
                    </div>
                    <Armchair className="w-8 h-8 text-primary" />
                  </div>
                  <div className="mb-4">
                    <p className="text-2xl font-bold">{screen.total_seats}</p>
                    <p className="text-sm text-muted-foreground">Total Seats</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleEdit(screen)}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingScreen ? 'Edit Screen' : 'Add New Screen'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Screen Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Screen 1, IMAX Hall"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rows">Rows</Label>
                <Input
                  id="rows"
                  type="number"
                  min="1"
                  max="26"
                  value={formData.rows}
                  onChange={(e) => setFormData({ ...formData, rows: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="columns">Columns</Label>
                <Input
                  id="columns"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.columns}
                  onChange={(e) => setFormData({ ...formData, columns: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting
                  ? (editingScreen ? 'Updating...' : 'Creating...')
                  : (editingScreen ? 'Update Screen' : 'Add Screen')}
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
