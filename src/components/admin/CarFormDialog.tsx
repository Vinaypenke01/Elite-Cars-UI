import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import type { Car, Manufacturer } from '@/types';
import { useEffect, useState } from 'react';
import { X, Upload, IndianRupee, Car as CarIcon, Fuel, Gauge, Calendar, Plus } from 'lucide-react';
import { getManufacturers, addManufacturer } from '@/services/api.service';
import ManufacturerDialog from './ManufacturerDialog';

const carSchema = z.object({
    manufacturer_id: z.number().min(1, 'Manufacturer is required'),
    model_name: z.string().min(2, 'Model name must be at least 2 characters'),
    variant: z.string().optional(),
    body_type: z.string().min(1, 'Body type is required'),
    model_year: z.number().min(1900).max(new Date().getFullYear() + 1),
    registration_year: z.number().min(1900).max(new Date().getFullYear()),
    ownership: z.string().min(1, 'Ownership is required'),
    kilometers_driven: z.number().min(0, 'Must be a positive number'),
    fuel_type: z.string().min(1, 'Fuel type is required'),
    transmission: z.string().min(1, 'Transmission is required'),
    engine_cc: z.number().min(1, 'Engine CC is required'),
    mileage: z.number().min(0, 'Mileage must be positive'),
    color: z.string().min(1, 'Color is required'),
    price: z.number().min(0, 'Price must be positive'),
    is_negotiable: z.boolean().default(true),
    insurance_valid_till: z.string().optional(),
    rc_available: z.boolean().default(true),
    puc_available: z.boolean().default(true),
    loan_clearance: z.boolean().default(true),
    condition: z.string().min(1, 'Condition is required'),
    accident_history: z.boolean().default(false),
    service_history: z.boolean().default(true),
    description: z.string().optional(),
    feature_names: z.string().optional(),
    uploaded_images: z.any()
        .refine((files) => {
            if (!files || !(files instanceof FileList)) return true;
            return files.length >= 1 && files.length <= 5;
        }, 'Please select between 1 and 5 images')
        .optional(),
});

type CarFormValues = z.infer<typeof carSchema>;

interface CarFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
    initialData?: Partial<Car>;
    title: string;
    loading?: boolean;
}

const CarFormDialog = ({
    open,
    onOpenChange,
    onSubmit,
    initialData,
    title,
    loading
}: CarFormDialogProps) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [manufacturerDialogOpen, setManufacturerDialogOpen] = useState(false);
    const [manufacturerLoading, setManufacturerLoading] = useState(false);

    const form = useForm<CarFormValues>({
        resolver: zodResolver(carSchema),
        defaultValues: {
            manufacturer_id: 0,
            model_name: '',
            variant: '',
            body_type: '',
            model_year: new Date().getFullYear(),
            registration_year: new Date().getFullYear(),
            ownership: '1st Owner',
            kilometers_driven: 0,
            fuel_type: '',
            transmission: '',
            engine_cc: 0,
            mileage: 0,
            color: '',
            price: 0,
            is_negotiable: true,
            insurance_valid_till: '',
            rc_available: true,
            puc_available: true,
            loan_clearance: true,
            condition: 'Good',
            accident_history: false,
            service_history: true,
            description: '',
            feature_names: '',
            uploaded_images: null,
        },
    });

    useEffect(() => {
        // Load manufacturers
        loadManufacturers();
    }, []);

    const loadManufacturers = async () => {
        try {
            const data = await getManufacturers();
            setManufacturers(data);
        } catch (error) {
            console.error('Failed to load manufacturers:', error);
        }
    };

    const handleAddManufacturer = async (data: { name: string; country?: string }) => {
        setManufacturerLoading(true);
        try {
            const newManufacturer = await addManufacturer(data);
            await loadManufacturers(); // Reload list
            form.setValue('manufacturer_id', newManufacturer.id);
            setManufacturerDialogOpen(false);
        } catch (error) {
            console.error('Failed to add manufacturer:', error);
            alert('Failed to add manufacturer. Please try again.');
        } finally {
            setManufacturerLoading(false);
        }
    };

    const removeImage = (indexToRemove: number) => {
        const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
        setSelectedFiles(updatedFiles);

        if (updatedFiles.length > 0) {
            const dataTransfer = new DataTransfer();
            updatedFiles.forEach(file => dataTransfer.items.add(file));
            form.setValue('uploaded_images', dataTransfer.files);
        } else {
            form.setValue('uploaded_images', null);
        }
    };

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset({
                    manufacturer_id: initialData.manufacturer_details?.id || 0,
                    model_name: initialData.model_name || '',
                    variant: initialData.variant || '',
                    body_type: initialData.body_type || '',
                    model_year: initialData.model_year || new Date().getFullYear(),
                    registration_year: initialData.registration_year || new Date().getFullYear(),
                    ownership: initialData.ownership || '1st Owner',
                    kilometers_driven: initialData.kilometers_driven || 0,
                    fuel_type: initialData.fuel_type || '',
                    transmission: initialData.transmission || '',
                    engine_cc: initialData.engine_cc || 0,
                    mileage: initialData.mileage || 0,
                    color: initialData.color || '',
                    price: Number(initialData.price) || 0,
                    is_negotiable: initialData.is_negotiable ?? true,
                    insurance_valid_till: initialData.insurance_valid_till || '',
                    rc_available: initialData.rc_available ?? true,
                    puc_available: initialData.puc_available ?? true,
                    loan_clearance: initialData.loan_clearance ?? true,
                    condition: initialData.condition || 'Good',
                    accident_history: initialData.accident_history ?? false,
                    service_history: initialData.service_history ?? true,
                    description: initialData.description || '',
                    feature_names: initialData.features?.map(f => f.name).join(', ') || '',
                    uploaded_images: null,
                });
            } else {
                // Reset to default values for new car
                form.reset({
                    manufacturer_id: 0,
                    model_name: '',
                    variant: '',
                    body_type: '',
                    model_year: new Date().getFullYear(),
                    registration_year: new Date().getFullYear(),
                    ownership: '1st Owner',
                    kilometers_driven: 0,
                    fuel_type: '',
                    transmission: '',
                    engine_cc: 0,
                    mileage: 0,
                    color: '',
                    price: 0,
                    is_negotiable: true,
                    insurance_valid_till: '',
                    rc_available: true,
                    puc_available: true,
                    loan_clearance: true,
                    condition: 'Good',
                    accident_history: false,
                    service_history: true,
                    description: '',
                    feature_names: '',
                    uploaded_images: null,
                });
            }
            setSelectedFiles([]);
        }
    }, [initialData, form, open]);

    const handleSubmit = (values: CarFormValues) => {
        const transformedData = {
            ...values,
            feature_names: values.feature_names
                ? values.feature_names.split(',').map((s) => s.trim()).filter(Boolean)
                : []
        };
        onSubmit(transformedData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Enter the complete details for the vehicle. All fields with * are required.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        {/* Identity Section */}
                        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <CarIcon className="h-5 w-5" />
                                Vehicle Identity
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="manufacturer_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Manufacturer*</FormLabel>
                                            <div className="flex gap-2">
                                                <Select
                                                    onValueChange={(value) => field.onChange(Number(value))}
                                                    value={field.value?.toString()}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="flex-1">
                                                            <SelectValue placeholder="Select manufacturer" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {manufacturers.map((m) => (
                                                            <SelectItem key={m.id} value={m.id.toString()}>
                                                                {m.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setManufacturerDialogOpen(true)}
                                                    title="Add new manufacturer"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="model_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Model Name*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Swift, City, Creta" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="variant"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Variant</FormLabel>
                                            <FormControl>
                                                <Input placeholder="VXi, ZX+" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="body_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Body Type*</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select body type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                                                    <SelectItem value="Sedan">Sedan</SelectItem>
                                                    <SelectItem value="SUV">SUV</SelectItem>
                                                    <SelectItem value="MUV">MUV</SelectItem>
                                                    <SelectItem value="Coupe">Coupe</SelectItem>
                                                    <SelectItem value="Convertible">Convertible</SelectItem>
                                                    <SelectItem value="Pickup">Pickup</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Year & Ownership */}
                        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Year & Ownership
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="model_year"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Model Year*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="2023"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="registration_year"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Registration Year*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="2023"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="ownership"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ownership*</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1st Owner">1st Owner</SelectItem>
                                                    <SelectItem value="2nd Owner">2nd Owner</SelectItem>
                                                    <SelectItem value="3rd Owner">3rd Owner</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Gauge className="h-5 w-5" />
                                Specifications
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="kilometers_driven"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kilometers Driven*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="50000"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="fuel_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fuel Type*</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select fuel type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Petrol">Petrol</SelectItem>
                                                    <SelectItem value="Diesel">Diesel</SelectItem>
                                                    <SelectItem value="CNG">CNG</SelectItem>
                                                    <SelectItem value="Electric">Electric</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="transmission"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Transmission*</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select transmission" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Manual">Manual</SelectItem>
                                                    <SelectItem value="Automatic">Automatic</SelectItem>
                                                    <SelectItem value="AMT">AMT</SelectItem>
                                                    <SelectItem value="CVT">CVT</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="engine_cc"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Engine CC*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="1500"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="mileage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mileage (km/l)*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="18.5"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="color"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Color*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="White, Silver" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <IndianRupee className="h-5 w-5" />
                                Pricing
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price (₹)*</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="number"
                                                        placeholder="500000"
                                                        className="pl-9"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="is_negotiable"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Price Negotiable</FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                            <h3 className="text-lg font-semibold">Documents</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="insurance_valid_till"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Insurance Valid Till</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-3 gap-2">
                                    <FormField
                                        control={form.control}
                                        name="rc_available"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal">RC Available</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="puc_available"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal">PUC Available</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="loan_clearance"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal">Loan Clear</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Condition */}
                        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                            <h3 className="text-lg font-semibold">Condition</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="condition"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Overall Condition*</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Excellent">Excellent</SelectItem>
                                                    <SelectItem value="Good">Good</SelectItem>
                                                    <SelectItem value="Average">Average</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-4">
                                    <FormField
                                        control={form.control}
                                        name="accident_history"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel>Accident History</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="service_history"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel>Service History</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <FormField
                            control={form.control}
                            name="uploaded_images"
                            render={({ field: { onChange, value, ...field } }) => (
                                <FormItem>
                                    <FormLabel>
                                        Vehicle Images* ({selectedFiles.length}/5 selected)
                                    </FormLabel>
                                    <FormControl>
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <Input
                                                    id="file-upload"
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const files = e.target.files;
                                                        if (files && files.length > 0) {
                                                            const newFiles = Array.from(files);
                                                            const combined = [...selectedFiles, ...newFiles].slice(0, 5);
                                                            setSelectedFiles(combined);

                                                            const dataTransfer = new DataTransfer();
                                                            combined.forEach(file => dataTransfer.items.add(file));
                                                            onChange(dataTransfer.files);
                                                        }
                                                    }}
                                                    {...field}
                                                />
                                                <label
                                                    htmlFor="file-upload"
                                                    className={`flex items-center justify-center gap-2 w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                                                        ${selectedFiles.length >= 5
                                                            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                                                            : 'border-primary/50 hover:border-primary hover:bg-primary/5'
                                                        }`}
                                                >
                                                    <Upload className="h-5 w-5" />
                                                    <span className="text-sm font-medium">
                                                        {selectedFiles.length >= 5
                                                            ? 'Maximum 5 images reached'
                                                            : selectedFiles.length > 0
                                                                ? `Add more images (${5 - selectedFiles.length} remaining)`
                                                                : 'Click to upload images (Max 5)'
                                                        }
                                                    </span>
                                                </label>
                                            </div>

                                            {selectedFiles.length > 0 && (
                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                                    {selectedFiles.map((file, i) => (
                                                        <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-muted border-2 border-border">
                                                            <img
                                                                src={URL.createObjectURL(file)}
                                                                alt={`preview-${i}`}
                                                                className="object-cover w-full h-full"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(i)}
                                                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 px-2 text-center">
                                                                Image {i + 1}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {initialData?.images && selectedFiles.length === 0 && (
                                                <div className="space-y-2">
                                                    <p className="text-sm text-muted-foreground">Current images:</p>
                                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                                        {initialData.images.map((img, i) => (
                                                            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-muted border-2 border-border">
                                                                <img
                                                                    src={img.image_url}
                                                                    alt={`existing-${i}`}
                                                                    className="object-cover w-full h-full"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description & Features */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Additional details about the vehicle..."
                                            className="h-24"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="feature_names"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Features (comma separated)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="ABS, Airbags, Power Steering, AC"
                                            {...field}
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Vehicle'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>

            {/* Manufacturer Dialog */}
            <ManufacturerDialog
                open={manufacturerDialogOpen}
                onOpenChange={setManufacturerDialogOpen}
                onSubmit={handleAddManufacturer}
                loading={manufacturerLoading}
            />
        </Dialog>
    );
};

export default CarFormDialog;
