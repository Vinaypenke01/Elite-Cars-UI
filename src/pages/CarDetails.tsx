
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft, ArrowRight, Zap, Gauge, Timer, Battery, Check,
  Calendar, User, FileText, Shield, Wrench, MapPin, Car as CarIcon,
  Fuel, Settings, ChevronLeft, ChevronRight, MessageSquare
} from 'lucide-react';
import Joyride from 'react-joyride';
import { useTour } from '@/context/TourContext';
import { carDetailsSteps } from '@/guides/tourSteps';
import { useCar } from '@/hooks/useCars';
import { useSEO } from '@/hooks/useSEO';
import { useState } from 'react';
import { EnquiryForm } from '@/components/EnquiryForm';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { run, stepIndex, setStepIndex, stopTour } = useTour();

  // All useState hooks must be at the top
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedCarIndex, setRelatedCarIndex] = useState(0);
  const [enquiryFormOpen, setEnquiryFormOpen] = useState(false);

  const { data: car, isLoading, error } = useCar(id || '');

  useSEO({
    title: car ? `${(car as any).manufacturer_details?.name} ${(car as any).model_name}` : 'Car Details',
    description: car ? (car as any).description?.substring(0, 160) : 'View car details at Elite Motors.',
    keywords: car ? `${(car as any).model_name}, luxury ${(car as any).body_type}, buy ${(car as any).manufacturer_details?.name}` : 'car details, premium vehicles',
    ogImage: car && (car as any).images?.[0]?.image_url,
    canonical: `https://elite-cars-project.netlify.app/car/${id}`
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto"></div>
          <div className="animate-pulse text-xl font-semibold text-muted-foreground">Loading vehicle details...</div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 px-4">
        <div className="text-center max-w-md">
          <div className="mb-6 text-6xl">🚗</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Vehicle Not Found</h1>
          <p className="text-muted-foreground mb-8">We couldn't find the vehicle you're looking for.</p>
          <Button onClick={() => navigate('/cars')} size="lg">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collection
          </Button>
        </div>
      </div>
    );
  }

  const specs = [
    { icon: Zap, label: 'Engine', value: `${(car as any).engine_cc || 0} cc`, color: 'text-orange-500' },
    { icon: Fuel, label: 'Fuel Type', value: (car as any).fuel_type || 'N/A', color: 'text-blue-500' },
    { icon: Timer, label: 'Transmission', value: (car as any).transmission || 'N/A', color: 'text-purple-500' },
    { icon: Battery, label: 'Mileage', value: (car as any).mileage ? `${(car as any).mileage} km / l` : 'N/A', color: 'text-green-500' },
  ];

  const carName = (car as any).model_name || 'Vehicle';
  const manufacturer = (car as any).manufacturer_details?.name || '';
  const fullName = manufacturer ? `${manufacturer} ${carName} ` : carName;
  const carType = (car as any).body_type || (car as any).type || 'Vehicle';
  const carPrice = parseFloat((car as any).price) || 0;
  const carDescription = (car as any).description || 'No description available.';
  const variant = (car as any).variant;

  // Handle features from the new API structure
  const featuresRaw = (car as any).features;
  let carFeatures: string[] = [];

  if (Array.isArray(featuresRaw)) {
    carFeatures = featuresRaw.map((f: any) =>
      typeof f === 'object' && f.name ? f.name : (typeof f === 'string' ? f : '')
    ).filter(Boolean);
  }

  // Handle images from the new API structure
  const imagesRaw = (car as any).images || [];
  const allImages = imagesRaw.length > 0
    ? imagesRaw.map((img: any) => img.image_url || img.image || img)
    : ['/placeholder.svg'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Related cars carousel
  const relatedCars = (car as any).related_cars || [];
  const carsPerPage = 3; // Show 3 cars at a time on desktop
  const maxRelatedIndex = Math.max(0, Math.ceil(relatedCars.length / carsPerPage) - 1);

  const nextRelatedCars = () => {
    setRelatedCarIndex((prev) => Math.min(prev + 1, maxRelatedIndex));
  };

  const prevRelatedCars = () => {
    setRelatedCarIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <>
      <Joyride
        steps={carDetailsSteps}
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

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: hsl(var(--muted));
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: hsl(var(--accent));
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: hsl(var(--accent) / 0.8);
          }
        `}</style>
        <div className="container mx-auto px-4 py-6 md:py-12 max-w-7xl">
          {/* Back Button - Sticky on mobile */}
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm -mx-4 px-4 py-3 mb-6 md:static md:bg-transparent md:backdrop-blur-none md:mb-8">
            <Button
              variant="ghost"
              className="hover:bg-accent/10"
              onClick={() => navigate('/cars')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back to Collection</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>

          {/* Hero Section - Improved responsive layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="car-hero mb-8 md:mb-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
              {/* Image Carousel - Takes more space on desktop */}
              <div className="lg:col-span-3 space-y-4">
                {/* Main Carousel Image */}
                <div className="relative overflow-hidden rounded-xl md:rounded-2xl aspect-[4/3] md:aspect-video bg-muted border border-border group shadow-lg">
                  <img
                    src={allImages[currentImageIndex]}
                    alt={`${fullName} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    onLoad={() => {
                      console.log(`✅ Main image loaded for ${fullName} (${currentImageIndex + 1}): ${allImages[currentImageIndex]}`);
                    }}
                    onError={(e) => {
                      console.error(`❌ Failed to load main image for ${fullName}: ${allImages[currentImageIndex]}`);
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />

                  {/* Navigation Arrows - Always visible on mobile, hover on desktop */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-2 md:p-3 rounded-full shadow-lg transition-all md:opacity-0 md:group-hover:opacity-100"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-2 md:p-3 rounded-full shadow-lg transition-all md:opacity-0 md:group-hover:opacity-100"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs md:text-sm font-medium shadow-lg">
                        {currentImageIndex + 1} / {allImages.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail Strip - Scrollable on mobile */}
                {allImages.length > 1 && (
                  <div className="overflow-x-auto pb-2 -mx-1 px-1">
                    <div className="flex gap-2 min-w-min">
                      {allImages.map((img: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${i === currentImageIndex
                            ? 'border-accent scale-105 shadow-md'
                            : 'border-border hover:border-accent/50'
                            }`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${i + 1}`}
                            className="w-full h-full object-cover"
                            onLoad={() => {
                              console.log(`✅ Thumbnail ${i + 1} loaded for ${fullName}: ${img}`);
                            }}
                            onError={(e) => {
                              console.error(`❌ Thumbnail ${i + 1} failed for ${fullName}: ${img}`);
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Info - Better mobile spacing */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs md:text-sm px-3 py-1">
                      {carType}
                    </Badge>
                    {variant && (
                      <Badge variant="outline" className="text-xs md:text-sm px-3 py-1">
                        {variant}
                      </Badge>
                    )}
                  </div>

                  <div>
                    {manufacturer && (
                      <p className="text-sm md:text-base text-muted-foreground font-medium mb-1">
                        {manufacturer}
                      </p>
                    )}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                      {carName}
                    </h1>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl md:text-4xl font-bold text-accent">
                      ₹{carPrice.toLocaleString('en-IN')}
                    </p>
                    {(car as any).is_negotiable && (
                      <Badge variant="outline" className="text-xs">Negotiable</Badge>
                    )}
                  </div>

                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {carDescription}
                  </p>
                </div>

                {/* Quick Stats - Mobile optimized */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 pt-4 border-t">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Model Year</p>
                    <p className="text-lg md:text-xl font-bold">{(car as any).model_year}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Driven</p>
                    <p className="text-lg md:text-xl font-bold">{((car as any).kilometers_driven || 0).toLocaleString()} km</p>
                  </div>
                </div>

                {/* CTA Buttons - Prominent on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full gap-2 group text-base md:text-lg py-6 border-2"
                    onClick={() => setEnquiryFormOpen(true)}
                  >
                    <MessageSquare className="h-5 w-5" />
                    Enquire Now
                  </Button>
                  <Button
                    size="lg"
                    className="w-full package-btn gap-2 group text-base md:text-lg py-6"
                    onClick={() => navigate(`/package/${id}`)}
                  >
                    Choose Package
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Specs Section - Improved cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="specs-section mb-8 md:mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Performance Specs</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {specs.map((spec, index) => (
                <Card key={index} className="border-border hover:border-accent hover:shadow-md transition-all">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
                      <div className={`rounded - full bg - accent / 10 p - 2 md: p - 3 ${spec.color} `}>
                        <spec.icon className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground mb-1">{spec.label}</p>
                        <p className="text-base md:text-lg font-bold truncate">{spec.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Vehicle Details & Features - Combined Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8 md:mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Vehicle Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
              {/* Basic Details - 2 columns on large screens */}
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <InfoCard icon={Calendar} label="Model Year" value={(car as any).model_year || 'N/A'} />
                <InfoCard icon={FileText} label="Registration Year" value={(car as any).registration_year || 'N/A'} />
                <InfoCard icon={User} label="Ownership" value={(car as any).ownership || 'N/A'} />
                <InfoCard icon={Gauge} label="Kilometers Driven" value={`${((car as any).kilometers_driven || 0).toLocaleString()} km`} />
                <InfoCard icon={MapPin} label="Color" value={(car as any).color || 'N/A'} />
                <InfoCard icon={Settings} label="Transmission" value={(car as any).transmission || 'N/A'} />
              </div>

              {/* Features - 1 column on large screens */}
              {carFeatures.length > 0 && (
                <Card className="border-border">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Check className="h-5 w-5 text-accent" />
                      <h3 className="text-lg font-semibold">Key Features</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {carFeatures.map((feature: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="rounded-full bg-accent/20 p-1 flex-shrink-0">
                            <Check className="h-3 w-3 text-accent" />
                          </div>
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>

          {/* Documentation & Condition - Combined section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 md:mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Documentation & Condition</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Documentation Card */}
              <Card className="border-border hover:shadow-md transition-shadow">
                <CardContent className="p-4 md:p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 md:h-6 md:w-6 text-accent mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground mb-2">Insurance Validity</p>
                      <p className="text-base md:text-lg font-semibold">
                        {(car as any).insurance_valid_till
                          ? `Valid till ${new Date((car as any).insurance_valid_till).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} `
                          : 'Not Available'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground mb-3">Documents Available</p>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge label="RC" status={(car as any).rc_available} />
                      <StatusBadge label="PUC" status={(car as any).puc_available} />
                      <StatusBadge label="Loan Clear" status={(car as any).loan_clearance} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Condition Card */}
              <Card className="border-border hover:shadow-md transition-shadow">
                <CardContent className="p-4 md:p-6 space-y-4">
                  <InfoItem icon={CarIcon} label="Overall Condition" value={(car as any).condition || 'Good'} />
                  <InfoItem
                    icon={Shield}
                    label="Accident History"
                    value={(car as any).accident_history ? 'Yes' : 'No Accidents'}
                    valueColor={(car as any).accident_history ? 'text-red-500' : 'text-green-500'}
                  />
                  <InfoItem
                    icon={Wrench}
                    label="Service History"
                    value={(car as any).service_history ? 'Available' : 'Not Available'}
                    valueColor={(car as any).service_history ? 'text-green-500' : 'text-muted-foreground'}
                  />
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Manufacturer Info - Compact */}
          {/* {(car as any).manufacturer_details && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mb-8 md:mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Manufacturer</h2>
              <Card className="border-border hover:shadow-md transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-accent/10 p-3 md:p-4 flex-shrink-0">
                      <CarIcon className="h-6 w-6 md:h-8 md:w-8 text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xl md:text-2xl font-bold truncate">{(car as any).manufacturer_details.name}</p>
                      <p className="text-sm md:text-base text-muted-foreground">
                        {(car as any).manufacturer_details.country}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )} */}

          {/* Related Cars Section */}
          {relatedCars.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 md:mb-12"
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">You Might Also Like</h2>
                {relatedCars.length > carsPerPage && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevRelatedCars}
                      disabled={relatedCarIndex === 0}
                      className="h-8 w-8 md:h-10 md:w-10"
                    >
                      <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextRelatedCars}
                      disabled={relatedCarIndex === maxRelatedIndex}
                      className="h-8 w-8 md:h-10 md:w-10"
                    >
                      <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="overflow-hidden">
                <div
                  className="flex gap-4 transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${relatedCarIndex * 100} %)` }}
                >
                  {relatedCars.map((relatedCar: any) => (
                    <Card
                      key={relatedCar.id}
                      className="flex-shrink-0 w-full md:w-[calc(33.333%-11px)] border-border hover:border-accent hover:shadow-lg transition-all cursor-pointer group"
                      onClick={() => navigate(`/car/${relatedCar.id}`)}
                    >
                      <CardContent className="p-0">
                        <div className="relative h-48 md:h-56 overflow-hidden rounded-t-lg bg-muted">
                          <img
                            src={relatedCar.primary_image || relatedCar.images?.[0]?.image_url || '/placeholder.svg'}
                            alt={`${relatedCar.manufacturer_name} ${relatedCar.model_name}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <Badge variant="secondary" className="absolute top-3 left-3 text-xs">
                            {relatedCar.body_type}
                          </Badge>
                        </div>
                        <div className="p-4 space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">
                              {relatedCar.manufacturer_name}
                            </p>
                            <h3 className="text-lg font-bold truncate">
                              {relatedCar.model_name}
                            </h3>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t">
                            <p className="text-xl font-bold text-accent">
                              ₹{parseFloat(relatedCar.price).toLocaleString('en-IN')}
                            </p>
                            <Button variant="ghost" size="sm" className="group-hover:bg-accent/10">
                              View Details
                              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Dots indicator for mobile */}
              {relatedCars.length > 1 && (
                <div className="flex justify-center gap-2 mt-4 md:hidden">
                  {Array.from({ length: relatedCars.length }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setRelatedCarIndex(idx)}
                      className={`h-2 rounded-full transition-all ${idx === relatedCarIndex ? 'w-6 bg-accent' : 'w-2 bg-muted-foreground/30'
                        }`}
                      aria-label={`Go to car ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* CTA Section - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-center"
          >
            <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border-accent/50 shadow-xl">
              <CardContent className="space-y-4  md:space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold">Ready to Experience Excellence?</h2>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                  Choose your preferred package and take the next step towards owning this remarkable vehicle.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 group px-6 md:px-8 py-5 md:py-6 text-base md:text-lg w-full sm:w-auto border-2"
                    onClick={() => setEnquiryFormOpen(true)}
                  >
                    <MessageSquare className="h-5 w-5" />
                    Enquire Now
                  </Button>
                  <Button
                    size="lg"
                    className="package-btn gap-2 group px-6 md:px-8 py-5 md:py-6 text-base md:text-lg w-full sm:w-auto"
                    onClick={() => navigate(`/package/${id}`)}
                  >
                    Choose Package
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Enquiry Form Dialog */}
      <EnquiryForm
        open={enquiryFormOpen}
        onOpenChange={setEnquiryFormOpen}
        carId={Number(id)}
        carName={fullName}
      />
    </>
  );
};

// Helper Components for cleaner code
const InfoCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
  <Card className="border-border hover:shadow-sm transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-sm md:text-base font-semibold truncate">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const InfoItem = ({
  icon: Icon,
  label,
  value,
  valueColor = 'text-foreground'
}: {
  icon: any;
  label: string;
  value: string;
  valueColor?: string
}) => (
  <div className="flex items-start gap-3 pb-3 last:pb-0 border-b last:border-0">
    <Icon className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-sm md:text-base font-semibold ${valueColor}`}>{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ label, status }: { label: string; status: boolean }) => (
  <Badge variant={status ? "default" : "secondary"} className="text-xs">
    {label} {status ? '✓' : '✗'}
  </Badge>
);

export default CarDetails;