import { motion } from 'framer-motion';
import {
    Users,
    Car,
    Calendar,
    TrendingUp,
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    Clock,
    ExternalLink,
    Settings,
    Mail,
    Phone,
    MapPin,
    Trophy,
    MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/context/AuthContext';
import { useCars } from '@/hooks/useCars';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getBookings,
    updateBookingStatus,
    deleteCar,
    addCar,
    updateCar,
    getDealershipSettings,
    updateDealershipSettings,
    DealershipSettings as DealershipSettingsType,
    addCarToRecentlySold,
    getRecentlySold
} from '@/services/api.service';
import { useEnquiries, useUpdateEnquiryStatus } from '@/hooks/useAdminEnquiries';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import CarFormDialog from '@/components/admin/CarFormDialog';
import { Car as CarType } from '@/data/carsData';
import { Loader2 } from 'lucide-react';

// Recently Sold Table Component
const RecentlySoldTable = () => {
    const { data: recentlySold = [], isLoading } = useQuery({
        queryKey: ['recentlySoldAdmin'],
        queryFn: () => getRecentlySold(50)
    });

    const formatSoldDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Sold Date</TableHead>
                    <TableHead>Added On</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {recentlySold.map((car) => (
                    <TableRow key={car.id}>
                        <TableCell className="flex items-center gap-3">
                            <img
                                src={car.image || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400'}
                                alt={car.car_name}
                                className="h-10 w-16 object-cover rounded grayscale"
                            />
                            <span className="font-medium">{car.car_name}</span>
                        </TableCell>
                        <TableCell className="font-semibold text-accent">{car.price}</TableCell>
                        <TableCell>{formatSoldDate(car.sold_date)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                            {car.created_at ? formatSoldDate(car.created_at) : '-'}
                        </TableCell>
                    </TableRow>
                ))}
                {recentlySold.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                            No recently sold vehicles yet.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

const AdminDashboard = () => {
    const { adminProfile, signOut } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<CarType | null>(null);
    const [carToDelete, setCarToDelete] = useState<string | null>(null);

    const { data: carsData, isLoading: carsLoading } = useCars();
    const allCars = (carsData || []) as CarType[];

    // Filter to show only available cars in current stock
    const cars = allCars.filter(car => car.is_available !== false);

    // Enquiries data
    const { data: enquiries = [], isLoading: enquiriesLoading } = useEnquiries();
    const updateEnquiryStatusMutation = useUpdateEnquiryStatus();


    const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
        queryKey: ['bookings'],
        queryFn: getBookings
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: any }) => updateBookingStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast({ title: 'Status Updated', description: 'Booking status has been updated successfully.' });
        }
    });

    const deleteCarMutation = useMutation({
        mutationFn: (id: string) => deleteCar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cars'] });
            toast({ title: 'Car Deleted', description: 'The vehicle has been removed from inventory.' });
        }
    });

    const saveCarMutation = useMutation({
        mutationFn: async (data: any) => {
            if (editingCar) {
                return updateCar(editingCar.id.toString(), data);
            } else {
                return addCar(data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cars'] });
            setIsDialogOpen(false);
            setEditingCar(null);
            toast({
                title: editingCar ? 'Car Updated' : 'Car Added',
                description: `Vehicle has been ${editingCar ? 'updated' : 'added'} successfully.`
            });
        },
        onError: (error: any) => {
            console.error('Save car error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to save car details';
            toast({
                title: 'Operation Failed',
                description: errorMessage,
                variant: 'destructive'
            });
        }
    });

    const addToRecentlySoldMutation = useMutation({
        mutationFn: (carId: number) => addCarToRecentlySold(carId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cars'] });
            queryClient.invalidateQueries({ queryKey: ['recentlySoldAdmin'] });
            queryClient.invalidateQueries({ queryKey: ['recentlySold'] });
            toast({
                title: 'Added to Recently Sold',
                description: 'The car has been successfully added to recently sold.'
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to add car to recently sold',
                variant: 'destructive'
            });
        }
    });

    const { data: settings } = useQuery({
        queryKey: ['dealershipSettings'],
        queryFn: getDealershipSettings
    });

    const updateSettingsMutation = useMutation({
        mutationFn: (data: Partial<DealershipSettingsType>) => updateDealershipSettings(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dealershipSettings'] });
            toast({ title: 'Settings Updated', description: 'Dealership contact information has been updated.' });
        }
    });

    const [settingsForm, setSettingsForm] = useState({
        address: '',
        phone: '',
        email: '',
        mon_sat: '',
        sunday: ''
    });

    // Initialize form when settings data is loaded
    useEffect(() => {
        if (settings) {
            setSettingsForm({
                address: settings.address || '',
                phone: settings.phone || '',
                email: settings.email || '',
                mon_sat: settings.business_hours?.mon_sat || '',
                sunday: settings.business_hours?.sunday || ''
            });
        }
    }, [settings]);

    const handleSettingsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettingsMutation.mutate({
            address: settingsForm.address,
            phone: settingsForm.phone,
            email: settingsForm.email,
            business_hours: {
                mon_sat: settingsForm.mon_sat,
                sunday: settingsForm.sunday
            }
        });
    };

    const handleEditCar = (car: CarType) => {
        setEditingCar(car);
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingCar(null);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (carToDelete) {
            deleteCarMutation.mutate(carToDelete);
            setIsDeleteDialogOpen(false);
            setCarToDelete(null);
        }
    };

    const stats = [
        { label: 'Total Cars', value: cars.length, icon: Car, color: 'text-blue-500' },
        { label: 'New Enquiries', value: enquiries.filter(e => e.status === 'NEW').length, icon: MessageSquare, color: 'text-amber-500' },
        { label: 'Active Bookings', value: bookings.filter(b => b.status === 'pending').length, icon: Calendar, color: 'text-green-500' },
        { label: 'Total Bookings', value: bookings.length, icon: TrendingUp, color: 'text-purple-500' },
    ];

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="container mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-muted-foreground mt-1">
                            Welcome back, {adminProfile?.display_name || 'Administrator'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => signOut()}>Logout</Button>
                        <Button className="gap-2" onClick={handleAddNew}>
                            <Plus className="h-4 w-4" />
                            Add New Car
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card>
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground leading-none">{stat.label}</p>
                                        <h2 className="text-3xl font-bold mt-2">{stat.value}</h2>
                                    </div>
                                    <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="bookings" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 mb-8">
                        <TabsTrigger value="bookings">Bookings</TabsTrigger>
                        <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
                        <TabsTrigger value="inventory">Inventory</TabsTrigger>
                        <TabsTrigger value="leads">Customer Leads</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="bookings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Test Drive Bookings</CardTitle>
                                <CardDescription>Manage and track all customer test drive requests.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Car</TableHead>
                                            <TableHead>Date & Time</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {bookings.map((booking) => (
                                            <TableRow key={booking.id}>
                                                <TableCell>
                                                    <div className="font-medium text-blue-100">{booking.customer_name}</div>
                                                    <div className="text-sm text-muted-foreground">{booking.email}</div>
                                                </TableCell>
                                                <TableCell>{booking.car_name}</TableCell>
                                                <TableCell>
                                                    <div>{booking.date}</div>
                                                    <div className="text-sm text-muted-foreground">{booking.time}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        booking.status === 'confirmed' ? 'default' :
                                                            booking.status === 'pending' ? 'secondary' :
                                                                'outline'
                                                    }>
                                                        {booking.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    {booking.status === 'pending' && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-green-500 hover:text-green-600"
                                                            onClick={() => updateStatusMutation.mutate({ id: booking.id!.toString(), status: 'confirmed' })}
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button size="sm" variant="ghost">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {bookings.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                                    No bookings found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="enquiries">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Enquiries</CardTitle>
                                <CardDescription>Manage customer enquiries about specific vehicles.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Car</TableHead>
                                            <TableHead>Message</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {enquiries.map((enquiry) => (
                                            <TableRow key={enquiry.id}>
                                                <TableCell>
                                                    <div className="font-medium">{enquiry.customer_name}</div>
                                                    <div className="text-sm text-muted-foreground">{enquiry.email}</div>
                                                    <div className="text-sm text-muted-foreground">{enquiry.phone}</div>
                                                </TableCell>
                                                <TableCell>{enquiry.car_name}</TableCell>
                                                <TableCell>
                                                    <div className="max-w-xs truncate text-sm">
                                                        {enquiry.message || 'No message'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        enquiry.status === 'NEW' ? 'default' :
                                                            enquiry.status === 'CONTACTED' ? 'secondary' :
                                                                enquiry.status === 'CONVERTED' ? 'default' :
                                                                    'outline'
                                                    }>
                                                        {enquiry.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(enquiry.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {enquiry.status === 'NEW' && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-green-500 hover:text-green-600"
                                                            onClick={() => updateEnquiryStatusMutation.mutate({ id: enquiry.id, status: 'CONTACTED' })}
                                                        >
                                                            Mark Contacted
                                                        </Button>
                                                    )}
                                                    {enquiry.status === 'CONTACTED' && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-blue-500 hover:text-blue-600"
                                                            onClick={() => updateEnquiryStatusMutation.mutate({ id: enquiry.id, status: 'CONVERTED' })}
                                                        >
                                                            Mark Converted
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {enquiries.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                                    No enquiries found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="inventory">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Vehicle Management</CardTitle>
                                    <CardDescription>Manage your current inventory and view recently sold vehicles.</CardDescription>
                                </div>
                                <Button size="sm" variant="outline" className="gap-2" onClick={handleAddNew}>
                                    <Plus className="h-4 w-4" /> Add Car
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="current-stock" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-6">
                                        <TabsTrigger value="current-stock">Current Stock</TabsTrigger>
                                        <TabsTrigger value="recently-sold">Recently Sold</TabsTrigger>
                                    </TabsList>

                                    {/* Current Stock Tab */}
                                    <TabsContent value="current-stock">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Vehicle</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Price</TableHead>
                                                    <TableHead>Featured</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {cars.map((car) => (
                                                    <TableRow key={car.id}>
                                                        <TableCell className="flex items-center gap-3">
                                                            <img src={car.images?.[0] || (car as any).image || '/placeholder.svg'} alt={car.name} className="h-10 w-16 object-cover rounded" />
                                                            <span className="font-medium">{car.name}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">{car.type}</Badge>
                                                        </TableCell>
                                                        <TableCell className="font-semibold text-accent">{car.price}</TableCell>
                                                        <TableCell>
                                                            {car.featured ? (
                                                                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Yes</Badge>
                                                            ) : 'No'}
                                                        </TableCell>
                                                        <TableCell className="text-right space-x-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                                                                onClick={() => addToRecentlySoldMutation.mutate(car.id)}
                                                                title="Add to Recently Sold"
                                                            >
                                                                <Trophy className="h-4 w-4" />
                                                            </Button>
                                                            <Button size="sm" variant="ghost" onClick={() => handleEditCar(car)}>
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                onClick={() => {
                                                                    setCarToDelete(car.id.toString());
                                                                    setIsDeleteDialogOpen(true);
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {cars.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                                            No vehicles in inventory.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TabsContent>

                                    {/* Recently Sold Tab */}
                                    <TabsContent value="recently-sold">
                                        <RecentlySoldTable />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="leads">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Leads</CardTitle>
                                <CardDescription>Manage general inquiries and contact requests.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-48 flex items-center justify-center text-muted-foreground">
                                Section under development
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Dealership Settings</CardTitle>
                                <CardDescription>Update your contact information and business hours.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSettingsSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <MapPin className="h-4 w-4 text-accent" /> Address
                                            </div>
                                            <Input
                                                value={settingsForm.address}
                                                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                                                placeholder="123 Luxury Lane..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Phone className="h-4 w-4 text-accent" /> Phone Number
                                            </div>
                                            <Input
                                                value={settingsForm.phone}
                                                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Mail className="h-4 w-4 text-accent" /> Email Address
                                            </div>
                                            <Input
                                                value={settingsForm.email}
                                                onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                                                placeholder="info@elitecars.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Clock className="h-4 w-4 text-accent" /> Mon - Sat Hours
                                            </div>
                                            <Input
                                                value={settingsForm.mon_sat}
                                                onChange={(e) => setSettingsForm({ ...settingsForm, mon_sat: e.target.value })}
                                                placeholder="9:00 AM - 7:00 PM"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Clock className="h-4 w-4 text-accent" /> Sunday Hours
                                            </div>
                                            <Input
                                                value={settingsForm.sunday}
                                                onChange={(e) => setSettingsForm({ ...settingsForm, sunday: e.target.value })}
                                                placeholder="10:00 AM - 5:00 PM"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={updateSettingsMutation.isPending}>
                                            {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <CarFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={(data) => saveCarMutation.mutate(data)}
                initialData={editingCar || undefined}
                title={editingCar ? 'Edit Vehicle' : 'Add New Vehicle'}
                loading={saveCarMutation.isPending}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the vehicle
                            from your inventory and remove it from the public catalog.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setCarToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete Vehicle
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AdminDashboard;
