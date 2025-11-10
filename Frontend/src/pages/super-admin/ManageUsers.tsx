import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import * as userService from '@/services/user.service';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  UserPlus,
  Edit,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Shield,
  Building2,
  User as UserIcon,
} from 'lucide-react';
import { showSuccessToast, handleApiError } from '@/lib/toast';
import { User } from '@/types/api.types';
import { motion } from 'framer-motion';
import { fetchTheaters } from '@/store/slices/theaterSlice';
import { useAppDispatch } from '@/store/hooks';

export function ManageUsers() {
  const dispatch = useAppDispatch();
  const { theaters } = useAppSelector((state) => state.theaters);

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form data
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'user' as 'user' | 'theater_admin' | 'super_admin',
    theater_id: '',
  });

  const [editForm, setEditForm] = useState({
    role: 'user' as 'user' | 'theater_admin' | 'super_admin',
    theater_id: '',
  });

  // Fetch theaters for dropdown
  useEffect(() => {
    dispatch(fetchTheaters());
  }, [dispatch]);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, searchQuery]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getAllUsers({
        page: currentPage,
        limit: 10,
        ...(roleFilter && roleFilter !== 'all' && { role: roleFilter }),
        ...(searchQuery && { search: searchQuery }),
      });

      // Normalize user data - convert _id to id if needed
      const normalizedUsers = response.data.users.map((user: any) => ({
        ...user,
        id: user.id || user._id,
      }));

      setUsers(normalizedUsers);
      setTotalPages(response.data.pagination.total_pages);
    } catch (error) {
      handleApiError(error, 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Use admin-specific endpoint that doesn't return auth tokens
      await userService.createUserByAdmin({
        email: createForm.email,
        password: createForm.password,
        full_name: createForm.full_name,
        role: createForm.role,
        ...(createForm.role === 'theater_admin' && createForm.theater_id && { theater_id: createForm.theater_id }),
      });

      showSuccessToast('User created successfully');
      setCreateDialogOpen(false);
      resetCreateForm();
      fetchUsers();
    } catch (error) {
      handleApiError(error, 'Failed to create user');
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) return;

    try {
      await userService.updateUserRole(selectedUser.id, {
        role: editForm.role,
        ...(editForm.role === 'theater_admin' && editForm.theater_id && { theater_id: editForm.theater_id }),
      });

      showSuccessToast('User updated successfully');
      setEditDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      handleApiError(error, 'Failed to update user');
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      if (user.is_active) {
        await userService.deactivateUser(user.id);
        showSuccessToast('User deactivated successfully');
      } else {
        await userService.activateUser(user.id);
        showSuccessToast('User activated successfully');
      }
      fetchUsers();
    } catch (error) {
      handleApiError(error, 'Failed to update user status');
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      role: user.role,
      theater_id: user.theater_id || '',
    });
    setEditDialogOpen(true);
  };

  const resetCreateForm = () => {
    setCreateForm({
      email: '',
      password: '',
      full_name: '',
      role: 'user',
      theater_id: '',
    });
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      super_admin: { label: 'Super Admin', className: 'bg-purple-500 hover:bg-purple-600' },
      theater_admin: { label: 'Theater Admin', className: 'bg-blue-500 hover:bg-blue-600' },
      user: { label: 'User', className: 'bg-green-500 hover:bg-green-600' },
    };
    return variants[role] || variants.user;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Shield className="w-4 h-4" />;
      case 'theater_admin':
        return <Building2 className="w-4 h-4" />;
      default:
        return <UserIcon className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
            <p className="text-muted-foreground">Create and manage user accounts and roles</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Create User
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="theater_admin">Theater Admin</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
            </SelectContent>
          </Select>
          {(searchQuery || roleFilter !== 'all') && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('all');
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Users Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Theater</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="text-muted-foreground">Loading users...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <p className="text-muted-foreground">No users found</p>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => {
                  const roleBadge = getRoleBadge(user.role);
                  const theater = theaters.find((t) => t.id === user.theater_id);

                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge className={`${roleBadge.className} flex items-center gap-1 w-fit`}>
                          {getRoleIcon(user.role)}
                          {roleBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {theater ? (
                          <span className="text-sm">{theater.name}</span>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? 'default' : 'secondary'}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(user)}
                            className="gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            variant={user.is_active ? 'destructive' : 'default'}
                            size="sm"
                            onClick={() => handleToggleUserStatus(user)}
                            className="gap-1"
                          >
                            {user.is_active ? (
                              <>
                                <UserX className="w-3 h-3" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3 h-3" />
                                Activate
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Add a new user to the system</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-full-name">Full Name</Label>
              <Input
                id="create-full-name"
                value={createForm.full_name}
                onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">Password</Label>
              <Input
                id="create-password"
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-role">Role</Label>
              <Select
                value={createForm.role}
                onValueChange={(value: any) => setCreateForm({ ...createForm, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="theater_admin">Theater Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {createForm.role === 'theater_admin' && (
              <div className="space-y-2">
                <Label htmlFor="create-theater">Assign Theater</Label>
                <Select
                  value={createForm.theater_id}
                  onValueChange={(value) => setCreateForm({ ...createForm, theater_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theater" />
                  </SelectTrigger>
                  <SelectContent>
                    {theaters.map((theater) => (
                      <SelectItem key={theater.id} value={theater.id}>
                        {theater.name} - {theater.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>Update user role and permissions</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <form onSubmit={handleEditUser} className="space-y-4">
              <div className="space-y-2">
                <Label>User</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedUser.full_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={editForm.role}
                  onValueChange={(value: any) => setEditForm({ ...editForm, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="theater_admin">Theater Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editForm.role === 'theater_admin' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-theater">Assign Theater</Label>
                  <Select
                    value={editForm.theater_id}
                    onValueChange={(value) => setEditForm({ ...editForm, theater_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theater" />
                    </SelectTrigger>
                    <SelectContent>
                      {theaters.map((theater) => (
                        <SelectItem key={theater.id} value={theater.id}>
                          {theater.name} - {theater.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update User</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
