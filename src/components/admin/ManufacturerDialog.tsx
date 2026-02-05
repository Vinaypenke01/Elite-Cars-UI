import { useState } from 'react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Manufacturer } from '@/types';

const manufacturerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    country: z.string().optional(),
});

type ManufacturerFormValues = z.infer<typeof manufacturerSchema>;

interface ManufacturerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: ManufacturerFormValues) => Promise<void>;
    loading?: boolean;
}

const ManufacturerDialog = ({
    open,
    onOpenChange,
    onSubmit,
    loading
}: ManufacturerDialogProps) => {
    const form = useForm<ManufacturerFormValues>({
        resolver: zodResolver(manufacturerSchema),
        defaultValues: {
            name: '',
            country: '',
        },
    });

    const handleSubmit = async (values: ManufacturerFormValues) => {
        await onSubmit(values);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Manufacturer</DialogTitle>
                    <DialogDescription>
                        Enter the manufacturer details
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Manufacturer Name*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Maruti Suzuki, Honda" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input placeholder="India, Japan" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    form.reset();
                                    onOpenChange(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Adding...' : 'Add Manufacturer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ManufacturerDialog;
