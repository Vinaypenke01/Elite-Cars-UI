import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useState } from 'react';
import CarCard from '@/components/CarCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Joyride from 'react-joyride';
import { useTour } from '@/context/TourContext';
import { carsListSteps } from '@/guides/tourSteps';
import { useCars } from '@/hooks/useCars';
import { useSEO } from '@/hooks/useSEO';
import { Filter, AlertCircle } from 'lucide-react';

const CarsList = () => {
  useSEO({
    title: 'Browse Vehicles',
    description: 'Explore our premium collection of luxury and electric vehicles. Filter by type and find your perfect car at Elite Motors.',
    keywords: 'luxury cars for sale, buy electric vehicles, premium cars collection, car inventory',
    canonical: 'https://elite-cars-project.netlify.app/cars'
  });
  const { run, stepIndex, setStepIndex, stopTour } = useTour();
  const [selectedType, setSelectedType] = useState<string>('All');

  // Fetch cars from Firestore
  const { data: carsData = [], isLoading, isError, error } = useCars();

  const types = ['All', 'Electric', 'Electric Luxury', 'Electric SUV', 'Electric Sports'];

  // Filter out unavailable (sold) cars and filter by type
  const availableCars = (carsData as any[]).filter((car) => car.is_available !== false);
  const filteredCars =
    selectedType === 'All'
      ? availableCars
      : availableCars.filter((car) => car.body_type === selectedType || car.type === selectedType);

  return (
    <>
      <Joyride
        steps={carsListSteps}
        run={run}
        stepIndex={stepIndex}
        continuous
        showSkipButton
        showProgress
        callback={(data) => {
          const { status, index, type } = data;
          if (type === 'step:after') {
            setStepIndex(index + 1);
          }
          if (status === 'finished' || status === 'skipped') {
            stopTour();
          }
        }}
        styles={{
          options: {
            primaryColor: 'hsl(217 91% 50%)',
            zIndex: 10000,
          },
        }}
      />

      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cars-header mb-12 text-center"
          >
            <h1 className="text-5xl font-bold mb-4">Premium Collection</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of luxury electric vehicles, each offering
              exceptional performance and cutting-edge technology.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="filter-section mb-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Filter by type:
                </span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {types.map((type) => (
                  <Badge
                    key={type}
                    variant={selectedType === type ? 'default' : 'outline'}
                    className="cursor-pointer px-4 py-2 text-sm"
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="h-56 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <p className="text-xl text-muted-foreground mb-2">
                Failed to load vehicles
              </p>
              <p className="text-sm text-muted-foreground">
                {error?.message || 'Please try again later'}
              </p>
            </motion.div>
          )}

          {/* Cars Grid */}
          {!isLoading && !isError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.map((car, index) => (
                <ScrollReveal
                  key={car.id}
                  delay={index * 0.05} // Faster stagger
                  direction="up"
                >
                  <CarCard {...car} />
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && filteredCars.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl text-muted-foreground">
                No vehicles found in this category.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSelectedType('All')}
              >
                View All Vehicles
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default CarsList;
