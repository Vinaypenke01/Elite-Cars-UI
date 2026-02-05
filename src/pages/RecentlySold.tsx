import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getRecentlySold } from '@/services/api.service';
import { Loader2 } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

const RecentlySold = () => {
  useSEO({
    title: 'Recently Sold',
    description: 'Browse our recently sold luxury and premium vehicles. See the quality cars that have found their new owners at Elite Motors.',
    keywords: 'sold cars, luxury car sales, premium vehicles sold, archive',
    canonical: 'https://elite-cars-project.netlify.app/recently-sold'
  });
  const { data: soldCars = [], isLoading } = useQuery({
    queryKey: ['recentlySold'],
    queryFn: () => getRecentlySold(20) // Fetch up to 20 recently sold cars
  });

  // Format the sold date for display
  const formatSoldDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Recently Sold</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Check out some of our recently sold vehicles. These premium cars found their new homes with satisfied customers.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : soldCars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No recently sold vehicles to display yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {soldCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden group">
                  <div className="relative">
                    <img
                      src={car.image || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400'}
                      alt={car.car_name}
                      className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                    <Badge className="absolute top-3 right-3 bg-destructive">
                      SOLD
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{car.car_name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-accent font-bold">
                        {car.price}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Sold: {formatSoldDate(car.sold_date)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlySold;
