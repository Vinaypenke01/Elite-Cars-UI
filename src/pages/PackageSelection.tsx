import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PackageCard from '@/components/PackageCard';
import { ArrowLeft } from 'lucide-react';
import Joyride from 'react-joyride';
import { useTour } from '@/context/TourContext';
import { packageSteps } from '@/guides/tourSteps';
import { carsData } from '@/data/carsData';
import { useState } from 'react';

const PackageSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { run, stepIndex, setStepIndex, stopTour } = useTour();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const car = carsData.find((c) => c.id === Number(id));

  const packages = [
    {
      title: 'Essential',
      price: 'Standard',
      features: [
        'Complete vehicle inspection',
        'Basic warranty coverage',
        'Standard delivery',
        'Owner\'s manual & documentation',
        'Basic maintenance guide',
        'Customer support access',
      ],
    },
    {
      title: 'Premium',
      price: '+ $5,000',
      popular: true,
      features: [
        'Everything in Essential',
        'Extended 3-year warranty',
        'Premium concierge delivery',
        'Complimentary first service',
        '24/7 roadside assistance',
        'Ceramic coating protection',
        'Custom floor mats & accessories',
        'Priority customer support',
      ],
    },
    {
      title: 'Ultimate',
      price: '+ $12,000',
      features: [
        'Everything in Premium',
        'Lifetime warranty coverage',
        'White-glove home delivery',
        'Annual maintenance package',
        'Paint protection film (full)',
        'Custom interior detailing',
        'Dedicated account manager',
        'Exclusive owner events access',
        'Performance driving course',
      ],
    },
  ];

  const handleSelectPackage = (packageTitle: string) => {
    setSelectedPackage(packageTitle);
    setTimeout(() => {
      navigate(`/booking/${id}`, { state: { package: packageTitle } });
    }, 300);
  };

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Vehicle Not Found</h1>
          <Button onClick={() => navigate('/cars')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Joyride
        steps={packageSteps}
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
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-8"
            onClick={() => navigate(`/car/${id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vehicle Details
          </Button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4">Choose Your Package</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select the perfect package for your <span className="text-accent font-semibold">{car.manufacturer?.name || ''} {car.model || car.name}</span>.
              Each package is designed to enhance your ownership experience.
            </p>
          </motion.div>

          {/* Packages Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="packages-container grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
          >
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PackageCard
                  {...pkg}
                  onSelect={() => handleSelectPackage(pkg.title)}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center text-muted-foreground"
          >
            <p className="text-sm">
              All packages include our signature Elite Motors experience. Package upgrades can be
              added at any time during your ownership.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PackageSelection;
