import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTheaters, createTheater } from '@/store/slices/theaterSlice';
import * as theaterService from '@/services/theater.service';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, MapPin, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { Theater } from '@/types/api.types';

export function ManageTheaters() {
  const dispatch = useAppDispatch();
  const { theaters, isLoading } = useAppSelector((state) => state.theaters);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTheater, setEditingTheater] = useState<Theater | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    city: '',
    total_screens: '',
    facilities: '',
  });

  // Fetch theaters on mount
  useEffect(() => {
    dispatch(fetchTheaters());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const theaterData = {
        name: formData.name,
        location: formData.location,
        city: formData.city,
        total_screens: parseInt(formData.total_screens),
        facilities: formData.facilities
          ? formData.facilities.split(',').map((f) => f.trim())
          : [],
      };

      if (editingTheater) {
        // Update existing theater
        await theaterService.updateTheater(editingTheater.id, theaterData);
        toast.success('Theater updated successfully');
        dispatch(fetchTheaters()); // Refresh list
      } else {
        // Create new theater
        const result = await dispatch(createTheater(theaterData));
        if (createTheater.fulfilled.match(result)) {
          toast.success('Theater created successfully');
        }
      }

      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error saving theater:', error);
      toast.error(error.error?.message || 'Failed to save theater');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      city: '',
      total_screens: '',
      facilities: '',
    });
    setEditingTheater(null);
  };

  const handleEdit = (theater: Theater) => {
    setEditingTheater(theater);
    setFormData({
      name: theater.name,
      location: theater.location,
      city: theater.city,
      total_screens: theater.total_screens.toString(),
      facilities: theater.facilities.join(', '),
    });
    setDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Theaters</h1>
            <p className="text-muted-foreground">Add and manage theaters across the platform</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Theater
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : theaters.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No theaters found. Add your first theater to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {theaters.map((theater) => (
              <Card key={theater.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl mb-1">{theater.name}</h3>
                      <Badge variant={theater.is_active ? 'default' : 'secondary'}>
                        {theater.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{theater.location}, {theater.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      <span>{theater.total_screens} Screens</span>
                    </div>
                    {theater.facilities.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-2">
                        {theater.facilities.join(' • ')}
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleEdit(theater)}>
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
            <DialogTitle>{editingTheater ? 'Edit Theater' : 'Add New Theater'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Theater Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Downtown, Mall Road"
                required
              />
            </div>
            <div>
              <Label htmlFor="total_screens">Total Screens</Label>
              <Input
                id="total_screens"
                type="number"
                min="1"
                value={formData.total_screens}
                onChange={(e) => setFormData({ ...formData, total_screens: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="facilities">Facilities (comma separated)</Label>
              <Input
                id="facilities"
                value={formData.facilities}
                onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                placeholder="e.g., Parking, Food Court, 3D, IMAX"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting
                  ? (editingTheater ? 'Updating...' : 'Creating...')
                  : (editingTheater ? 'Update Theater' : 'Add Theater')}
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
